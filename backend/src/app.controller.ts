import {Controller, Get, Res} from '@nestjs/common';
import {ApiExcludeEndpoint} from "@nestjs/swagger";

@Controller()
export class AppController {

    @ApiExcludeEndpoint()
    @Get()
    index(@Res() res) {
        res.status(302).redirect('/docs');
    }

}
