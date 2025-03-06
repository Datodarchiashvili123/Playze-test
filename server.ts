import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr/node';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';
import { REQUEST } from "@angular/core";

export function app(): express.Express {
    const server = express();
    const serverDistFolder = dirname(fileURLToPath(import.meta.url));
    const browserDistFolder = resolve(serverDistFolder, '../browser');
    const indexHtml = join(serverDistFolder, 'index.server.html');

    const commonEngine = new CommonEngine();

    server.set('view engine', 'html');
    server.set('views', browserDistFolder);

    // Add redirection middleware for www.playze.io -> playze.io
    server.use((req, res, next) => {
        const host = req.headers.host || '';
        if (host.startsWith('www.')) {
            const newHost = host.replace('www.', '');
            return res.redirect(301, `https://${newHost}${req.url}`);
        }
        next();
    });

    // Serve static files first
    server.get('*.*', express.static(browserDistFolder, {
        maxAge: '0'
    }));


    // Serve the Google verification HTML file
    server.get('/google7ff99fd29e799a03.html', (req, res, next) => {
        res.sendFile(join(browserDistFolder, 'google7ff99fd29e799a03.html'), (err) => {
            if (err) {
                console.error('Error serving google verification file:', err);
                next(err);
            }
        });
    });

    server.get('/robots.txt', (req, res, next) => {
        res.sendFile(join(__dirname, 'dist', 'play', 'assets', 'robots.txt'), (err) => {
            if (err) {
                console.error('Error serving robots.txt:', err);
                next(err);
            }
        });
    });

    // All regular routes use the Angular engine
    server.get('*', (req, res, next) => {
        const { protocol, originalUrl, baseUrl, headers } = req;

        // Add cache control headers
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

        commonEngine
            .render({
                bootstrap,
                documentFilePath: indexHtml,
                url: `${protocol}://${headers.host}${originalUrl}`,
                publicPath: browserDistFolder,
                providers: [
                    { provide: APP_BASE_HREF, useValue: '/' },
                    { provide: REQUEST, useValue: req }
                ]
            })
            .then((html) => {
                res.status(200)
                    .set('Cache-Control', 'no-cache, no-store, must-revalidate')
                    .send(html);
            })
            .catch((err) => {
                console.error(`Error rendering page: ${err}`);
                next(err);
            });
    });

    return server;
}

function run(): void {
    const port = process.env['PORT'] || 4000;

    // Start up the Node server
    const server = app();
    server.listen(port, () => {
        console.log(`Node Express server listening on http://localhost:${port}`);
    });
}

run();