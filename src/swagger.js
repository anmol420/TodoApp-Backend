import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerDocument = YAML.load(path.join(__dirname, '../docs/swagger.yaml'));

const customCSS = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";

const setupSwagger = (app) => {
    app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, { customCssUrl: customCSS }));
};

export default setupSwagger;
