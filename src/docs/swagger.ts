import swaggerAutogen from "swagger-autogen";
import path from "path"

const doc = {
    info: {
        version: "v0.0.1",
        title: "Dokumentasi API EVENT",
        description: "Dokumentasi API EVENT"
    },
    servers: [
        {
            url: "http://localhost:3001/api",
            description: "Local Server"
        },
        {
            url: "https://be-event-rho.vercel.app/api",
            description: "Deploy Server",
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
            },  
        },
        schemas: {
            LoginRequest: {
                identifier: "firman007",
                password: "firman007id",
            },
        }
    }
}

const outputFile = "./swagger_output.json";
const endpointsFiles = [path.join(__dirname, "../routes/api.ts")]



swaggerAutogen({ openapi: "3.0.0"})(outputFile, endpointsFiles, doc)