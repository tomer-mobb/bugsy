import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as dotenv from 'dotenv';
import { z } from 'zod';
import Debug from 'debug';

const debug = Debug('mobbdev:constants');
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

export const SCANNERS = {
    Checkmarx: 'checkmarx',
    Codeql: 'codeql',
    Fortify: 'fortify',
    Snyk: 'snyk',
};

const envVariablesSchema = z
    .object({
        WEB_LOGIN_URL: z.string(),
        WEB_APP_URL: z.string(),
        API_URL: z.string(),
        GITHUB_CLIENT_ID: z.string(),
    })
    .required();

const envVariables = envVariablesSchema.parse(process.env);
debug('config %o', envVariables);

export const mobbAscii = `
                                   ..                       
                             ..........                     
                        .................                   
               ...........................                  
              ..............................                
             ................................               
             ..................................             
            ....................................            
            .....................................           
            .............................................   
          ................................................. 
     ...............................       .................
  ..................................           ............ 
..................    .............            ..........   
......... ........      .........             ......        
  ...............                          ....             
         .... ..                                            
                                                            
                                      . ...                 
                              ..............                
                       ......................               
                   ...........................              
               ................................             
           ......................................           
                ...............................             
                       .................                    
`;

export const WEB_LOGIN_URL = envVariables.WEB_LOGIN_URL;
export const WEB_APP_URL = envVariables.WEB_APP_URL;
export const API_URL = envVariables.API_URL;
export const GITHUB_CLIENT_ID = envVariables.GITHUB_CLIENT_ID;
