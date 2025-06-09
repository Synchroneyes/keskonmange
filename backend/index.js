require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());

const routesPath = path.join(__dirname, 'routes');

// 🧠 Base de données en mémoire
const database = {
    rooms: [],
    users: [],
};

function buildRoutePath(fileNameWithoutExt) {
    const parts = fileNameWithoutExt.split('_');
    if (parts.length === 1) return '';
    return '/' + parts.slice(1).map(p => `:${p}`).join('/');
}

fs.readdirSync(routesPath).forEach((resourceDir) => {
    const resourcePath = path.join(routesPath, resourceDir);

    if (fs.lstatSync(resourcePath).isDirectory()) {
        fs.readdirSync(resourcePath).forEach((methodFile) => {
            if (!methodFile.endsWith('.js')) return;

            const methodFileName = methodFile.replace('.js', '');
            const [methodRaw] = methodFileName.split('_');
            const method = methodRaw.toLowerCase();

            const handlerModule = require(path.join(resourcePath, methodFile));
            const handler = typeof handlerModule === 'function' ? handlerModule(database) : null;

            if (typeof handler !== 'function') {
                console.warn(`⚠️  Le fichier ${methodFile} dans ${resourceDir} n'exporte pas une fonction middleware valide.`);
                return;
            }

            const subRoute = buildRoutePath(methodFileName);
            const route = `/${resourceDir}${subRoute}`;

            switch (method) {
                case 'get':
                    app.get(route, handler);
                    break;
                case 'post':
                    app.post(route, handler);
                    break;
                case 'put':
                    app.put(route, handler);
                    break;
                case 'delete':
                    app.delete(route, handler);
                    break;
                case 'patch':
                    app.patch(route, handler);
                    break;
                default:
                    console.warn(`Méthode HTTP non supportée: ${method} pour ${route}`);
            }

            console.log(`[ROUTE] ${method.toUpperCase()} ${route}`);
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
