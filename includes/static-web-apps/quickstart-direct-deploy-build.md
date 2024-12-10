---
author: craigshoemaker
ms.author: cshoe
ms.service: azure-static-web-apps
ms.topic: include
ms.date: 07/02/2024
---

## Configure for deployment

1. Add a `staticwebapp.config.json` file to your application code with the following contents:

    ```json
    {
        "navigationFallback": {
            "rewrite": "/index.html"
        }
    }
    ```

    Defining a fallback route allows your site to server the `index.html` file for any requests made against the domain.

    Check this file into your source code control system (such as git) if you're using one.

1. Install the [Azure Static Web Apps (SWA) CLI][swacli] in your project.

    ```bash
    npm install -D @azure/static-web-apps-cli
    ```

    The SWA CLI helps you develop and test your site locally before you deploy it to the cloud.

1. Create a new file for your project and name it `swa-cli.config.json`.

    The `swa-cli.config.json` file describes how to build and deploy your site.

    Once this file is created, you can generate its contents using the `npx swa init` command.

    ```bash
    npx swa init --yes
    ```

1. Build your application for distribution.

    ```bash
    npx swa build
    ```

1. Use the SWA CLI to sign into Azure.

    ```bash
    npx swa login --resource-group swa-tutorial --app-name swa-demo-site
    ```

    Use the same resource group name and static web app name that you created in the previous section. As you attempt to log in, a browser opens to complete the process if necessary.

<!-- Links -->
[swacli]: https://azure.github.io/static-web-apps-cli/