---
title: About Azure App Spaces
description: Learn how Azure App Spaces helps you develop and manage web applications with less complexity.
ms.service: app-spaces
ms.topic: overview
author: msangapu-msft
ms.author: msangapu
ms.date: 05/22/2023
---

# About Azure App Spaces

[Azure App Spaces](https://go.microsoft.com/fwlink/?linkid=2234200) is an intelligent service for developers that reduces the complexity of creating and managing web apps. It helps you identify the correct services for your applications on Azure and provides a user-friendly management experience that's streamlined for the development process. 

App Spaces offers all the benefits of deploying an app via existing Azure services, like [Container Apps](../container-apps/overview.md), [Static Web Apps](../static-web-apps/overview.md), and [App Service](../app-service/overview.md), with an experience that's focused on making you develop and deploy faster.
## Easy to use

App Spaces reduces the decisions required for developers to get started with web apps. Based on what App Spaces detects within your repository, it may suggest a service to use, for example, if you have a Dockerfile inside your GitHub repository, it suggests Container Apps as the service for your app.

The creation process is categorized in the following simplified sections:
- GitHub Repository: Select your organization, repo, and branch.
- App Space details: Enter a name for your App Space and use the autodetected language, service, and plan.
- Azure Destination: Select a subscription and region for deployment.

Within a few minutes, you can deploy your App Space.

## Simplified management

App Spaces only requires information that's needed during the development process, like environment management, environment variables, connection strings, and so on. So, developing and managing your app components is straightforward and simplified. For more information, see [Manage components](quickstart-deploy-web-app.md#manage-components).

## Simplified pricing

 Azure App Spaces offers simplified and consistent pricing plans for various scenarios, so you don't have to worry about any accidental charges.
## Next steps

> [!div class="nextstepaction"]
> [Deploy a web app with Azure App Spaces](quickstart-deploy-web-app.md)

## Related articles

- [Deploy an Azure App Spaces template](deploy-app-spaces-template.md)
- [Compare Container Apps with other Azure contain options](../container-apps/compare-options.md)
- [About Azure Cosmos DB](../cosmos-db/introduction.md)
