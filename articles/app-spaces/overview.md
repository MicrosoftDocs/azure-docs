---
title: About Azure App Spaces
description: Learn how Azure App Spaces helps you develop and manage web applications with less complexity.
ms.service: app-spaces
ms.topic: overview
author: chcomley
ms.author: chcomley
ms.date: 05/10/2023
---

# About Azure App Spaces

Azure App Spaces is an intelligence service for developers that reduces the complexity of creating and managing web apps. It helps you identify the correct services for your applications on Azure and provides a user-friendly management experience that's streamlined for the development process. 

You get all the benefits of deploying an app via existing Azure services, like [Container Apps](../container-apps/overview.md), [Static Web Apps](../static-web-apps/overview.md), and [App Service](../app-service/overview.md), without the operator and IT-focussed technicality that tends to accompany the task of developing apps.
### Ease of use

App Spaces limits the decisions required for developers to get started with web apps. Depending on what's detected from your repository, App Spaces may suggest a service to provision, for example, if you have a Dockerfile inside your GitHub repository, it suggests Container Apps as the service for your app.

The creation process is categorized in the following simplified sections:
- GitHub Repository: Select your organization, repo, and branch.
- App Space details: Enter a name for your App Space and use the auto-detected language, service, and plan.
- Azure Destination: Select a subscription and region for deployment.

Within a few minutes you can deploy your App Space.

### Simplified management

App Spaces only pulls information that you need during the development process, like environment management, environment variables, and connection strings, so developing and managing your app components is straightforward and simplified. For more information, see [Manage components](quickstart-deploy-web-app.md#manage-components).

### Simplified consistent pricing

 Azure App Spaces offers consistent and simplified pricing with selection for flat rates of $20 or $40 per month. This way you don't have to worry about any accidental charges.
## Next steps

> [!div class="nextstepaction"]
> [Deploy a web app with Azure App Spaces](quickstart-deploy-web-app.md)

## Related articles

- [Deploy an Azure App Spaces template](deploy-app-spaces-template.md)
- 
