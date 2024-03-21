---
title: About the Azure Static Web Apps CLI
description: Learn how to use the Azure Static Web Apps CLI
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic:  conceptual
ms.date: 02/06/2024
ms.author: cshoe
---

# Azure Static Web Apps CLI overview

Azure Static Web Apps websites are hosted in the cloud and often connect together a collection of cloud services. During development, and any time you need to run your app locally, you need tools to mimic how your app runs in the cloud.

The Static Web Apps CLI (SWA CLI) includes a series of local services that approximate how your app would run on Azure, but instead they run exclusively on your machine.

The Azure Static Web Apps CLI provides the following services:

- A local static site server
- A proxy to the front-end framework development server
- A proxy to your API endpoints - available through Azure Functions Core Tools
- A mock authentication and authorization server
- Local routes and configuration settings enforcement

[!INCLUDE [Local development overview](../../includes/static-web-apps-local-dev-overview.md)]

## Get started

Get started working with the Static Web Apps CLI with the following resources.

| Resource | Description |
|---|---|
| [Install the Static Web Apps CLI (SWA CLI)](static-web-apps-cli-install.md) | Install the Azure Static Web Apps CLI to your machine. |
| [Configure your environment](static-web-apps-cli-configuration.md) | Set up how your application reads configuration information. |
| [Start the website emulator](static-web-apps-cli-emulator.md) | Start the service to locally serve your website. |
| [Start the local API server](static-web-apps-cli-api-server.md) | Start the service to locally serve your API endpoints. |
| [Deploy to Azure](static-web-apps-cli-deploy.md) | Deploy your application to production on Azure. |

> [!NOTE]
> Often sites built with a front-end framework require a proxy configuration setting to correctly handle requests under the `api` route. When using the Azure Static Web Apps CLI the proxy location value is `/api`, and without the CLI the value is `http://localhost:7071/api`.

## Next steps

> [!div class="nextstepaction"]
> [Install the CII](static-web-apps-cli-install.md)
