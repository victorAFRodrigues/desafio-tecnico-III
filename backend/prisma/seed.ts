import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Modalidade } from '@prisma/client';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { randomUUID } from 'crypto';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Limpando banco...');
    await prisma.exame.deleteMany();
    await prisma.paciente.deleteMany();

    console.log('Criando pacientes e exames...');

    const modalidades = Object.values(Modalidade);

    for (let i = 0; i < 20; i++) {
        const paciente = await prisma.paciente.create({
            data: {
                nome: faker.person.fullName(),
                cpf: faker.string.numeric(11),
                telefone: faker.phone.number(),
                email: faker.internet.email(),
                dataNascimento: faker.date.birthdate({ min: 18, max: 80, mode: 'age' }),
            },
        });

        const qtdExames = faker.number.int({ min: 1, max: 4 });

        for (let j = 0; j < qtdExames; j++) {
            await prisma.exame.create({
                data: {
                    pacienteId: paciente.id,
                    modalidade: faker.helpers.arrayElement(modalidades),
                    descricao: faker.lorem.sentence(),
                    dataExame: faker.date.recent({ days: 180 }),
                    idempotencyKey: randomUUID(),
                },
            });
        }
    }

    console.log('Seed concluído!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });