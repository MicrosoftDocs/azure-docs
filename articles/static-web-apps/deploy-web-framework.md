---
title: Deploy your web app to Azure Static Web Apps.
description: Learn to deploy your web app to Azure Static Web Apps.
services: static-web-apps
author: craigshoemaker
ms.service: azure-static-web-apps
ms.topic: article
ms.date: 07/02/2024
ms.author: cshoe
zone_pivot_groups: swa-web-framework
---

# Deploy your web app to Azure Static Web Apps

In this article, you create a new web app with the framework of your choice, run it locally, then deploy to Azure Static Web Apps.

## Prerequisites

To complete this tutorial, you need:

| Resource | Description |
|---|---|
| [Azure subscription][1] | If you don't have one, you can [create an account for free][1]. |
| [Node.js][2] | Install version 20.0 or later. |
| [Azure CLI][3] | Install version 2.6x or later. |

You also need a text editor. For work with Azure, [Visual Studio Code][4] is recommended.

You can run the app you create in this article on the platform of your choice including: Linux, macOS, Windows, or Windows Subsystem for Linux.

## Create your web app

1. Open a terminal window.

::: zone pivot="vanilla-js"

2. Select an appropriate directory for your code, then run the following commands.

    ```bash
    npm create vite@latest swa-vanilla-demo -- --template=vanilla
    cd swa-vanilla-demo
    npm install
    npm run dev
    ```

    As you run these commands, the development server prints the URL of your website. Select the link to open it in your default browser.

    ![Screen shot of the generated vanilla web application.][img-vanilla-js]

::: zone-end

::: zone pivot="angular"

2. Select an appropriate directory for your code, then run the following commands.

    ```bash
    npx --package @angular/cli@latest ng new swa-angular-demo --ssr=false --defaults
    cd swa-angular-demo
    npm start
    ```

    As you run these commands, the development server prints the URL of your website. Select the link to open it in your default browser.

    ![Screen shot of the generated angular web application.][img-angular]

::: zone-end

::: zone pivot="react"

2. Select an appropriate directory for your code, then run the following commands.

    ```bash
    npm create vite@latest swa-react-demo -- --template react
    cd swa-react-demo
    npm install
    npm run dev
    ```

    As you run these commands, the development server prints the URL of your website. Select the link to open it in your default browser.

    ![Screen shot of the generated react web application.][img-react]

::: zone-end

::: zone pivot="vue"

2. Select an appropriate directory for your code, then run the following commands.

    ```bash
    npm create vite@latest swa-vue-demo -- --template vue
    cd swa-vue-demo
    npm install
    npm run dev
    ```

    As you run these commands, the development server prints the URL of your website. Select the link to open it in your default browser.

    ![Screen shot of the generated Vue web application.][img-vue]

::: zone-end

3. Select <kbd>Cmd/Ctrl</kbd>+<kbd>C</kbd> to stop the development server.

[!INCLUDE [Create an Azure Static Web App](../../includes/static-web-apps/quickstart-direct-deploy-create.md)]

[!INCLUDE [Build your site for deployment](../../includes/static-web-apps/quickstart-direct-deploy-build.md)]

::: zone pivot="angular"

> [!WARNING]
> Angular v17 and later place the distributable files in a subdirectory of the output path that you can choose. The SWA CLI doesn't know the specific location of the directory. The following steps show you how to set this path correctly.

Locate the generated *index.html* file in your project in the *dist/swa-angular-demo/browser* folder.

1. Set the `SWA_CLI_OUTPUT_LOCATION` environment variable to the directory containing the *index.html* file:

    # [bash](#tab/bash)

    ```bash
    export SWA_CLI_OUTPUT_LOCATION="dist/swa-angular-demo/browser"
    ```

    # [csh](#tab/csh)

    ```bash
    setenv SWA_CLI_OUTPUT_LOCATION "dist/swa-angular-demo/browser"
    ```

    # [PowerShell](#tab/pwsh)

    ```powershell
    $env:SWA_CLI_OUTPUT_LOCATION="dist/swa-angular-demo/browser"
    ```

    # [CMD](#tab/cmd)

    ```bash
    set SWA_CLI_OUTPUT_LOCATION="dist/swa-angular-demo/browser"
    ```

    ---

::: zone-end

## Deploy your site to Azure

Deploy your code to your static web app:

```bash
npx swa deploy --env production
```

It might take a few minutes to deploy the application. Once complete, the URL of your site is displayed.

![Screen shot of the deploy command.][img-deploy]

On most systems, you can select the URL of the site to open it in your default browser.

[!INCLUDE [Clean up resources](../../includes/static-web-apps/quickstart-direct-deploy-clean-up-resources.md)]

## Next steps

> [!div class="nextstepaction"]
> [Add authentication](./add-authentication.md)

## Related content

* [Authentication and authorization](./authentication-authorization.yml)
* [Database connections](./database-overview.md)
* [Custom Domains](./custom-domain.md)

<!-- Links -->
[1]: https://azure.microsoft.com/free
[2]: https://nodejs.org/
[3]: /cli/azure/install-azure-cli
[4]: https://code.visualstudio.com

<!-- Images -->
[img-deploy]: media/deploy-screenshot.png
[img-vanilla-js]: media/deploy-web-framework/vanilla-js-screenshot.png
[img-angular]: media/deploy-web-framework/angular-screenshot.png
[img-react]: media/deploy-web-framework/react-screenshot.png
[img-vue]: media/deploy-web-framework/vue-screenshot.png
