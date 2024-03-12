---
title: API server Azure Static Web Apps CLI
description: API server Azure Static Web Apps CLI
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic:  conceptual
ms.date: 02/02/2024
ms.author: cshoe
---

# Start the API server with the Azure Static Web App CLI

In Azure Static Web Apps, you can use the [integrated managed Functions](/azure/static-web-apps/apis-functions) to add API endpoints to your application. You can run an Azure Functions app locally using [Azure Functions core tools CLI](/azure/azure-functions/functions-run-local). The core tools CLI gives you the opportunity to run and debug your API endpoints locally.

You can start the core tools manually or automatically.

## Manual start

To use the SWA CLI emulator alongside the API server:

1. Start API server using the Azure Functions core tools CLI or the [Visual Studio Code Extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions).

    Copy the URL of the local API server, once the core tools are running.
  
    ```bash
    func host start
    ```

1. In a separate terminal, start the SWA CLI using the `--api-devserver-url` option to pass it the local API Server URI.

    For example:
  
    ```bash
    swa start ./my-dist --api-devserver-url http://localhost:7071
    ```

## Automatic start

To set up an automatic start, you first need to have an Azure Functions application project located in an `api` folder in your local development environment.

1. Launch the API server alongside the SWA emulator

    ```bash
    swa start ./my-dist --api-location ./api
    ```

1. Combine the launch with usage of a running dev server

    ```bash
    swa start http://localhost:3000 --api-location ./api
    ```
  
## Next steps

> [!div class="nextstepaction"]
> [Deploy to Azure](static-web-apps-cli-deploy.md)
