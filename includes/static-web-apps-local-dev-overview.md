---
author: craigshoemaker
ms.service: static-web-apps
ms.topic: include
ms.date: 02/05/2024
ms.author: cshoe
---

## How it works

The following chart shows how requests are handled locally.

:::image type="content" source="../articles/static-web-apps/media/local-development/cli-conceptual.png" alt-text="Diagram showing the Azure Static Web App CLI request and response flow.":::

> [!IMPORTANT]
> Go to `http://localhost:4280` to access the application served by the CLI.

- **Requests** made to port `4280` are forwarded to the appropriate server depending on the type of request.

- **Static content** requests, such as HTML or CSS,  are either handled by the internal CLI static content server, or by the front-end framework server for debugging.

- **Authentication and authorization** requests are handled by an emulator, which provides a fake identity profile to your app.

- **Functions Core Tools runtime**<sup>1</sup> handles requests to the site's API.

- **Responses** from all services are returned to the browser as if they were all a single application.

Once you start the UI and the Azure Functions API apps independently, then start the Static Web Apps CLI and point it to the running apps using the following command:

```console
swa start http://localhost:<DEV-SERVER-PORT-NUMBER> --api-location http://localhost:7071
```

Optionally, if you use the `swa init` command, the Static Web Apps CLI looks at your application code and build a _swa-cli.config.json_ configuration file for the CLI. When you use the _swa-cli.config.json_ file, you can run `swa start` to launch your application locally.

<sup>1</sup> The Azure Functions Core Tools are automatically installed by the CLI if they aren't already on your system.
