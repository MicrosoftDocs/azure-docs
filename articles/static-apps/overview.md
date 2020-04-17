---
title: What is App Service Static Apps?
description: The key features and functionality of App Service Static Apps.
services: azure-functions
author: craigshoemaker
ms.service: azure-functions
ms.topic:  overview
ms.date: 05/08/2020
ms.author: cshoe
---

# What is App Service Static Apps (Preview)?

App Service Static Apps is a service that automatically builds and deploys web apps from a GitHub repository.

:::image type="content" source="media/overview/static-apps-overview.png" alt-text="Static Apps overview":::

As commits and pull requests are applied to a designated branch, a GitHub Action workflow begins. The workflow builds the application for production and globally deploys the web app.

Back-end API functionality is provided via an Azure Functions app. Hosted on the Linux consumption plan, the app's API automatically scales up and down with demand.

## Key features

- **Free web hosting** for static content like HTML, CSS, JavaScript, and images
- **Free API** support provided by Azure Functions
- **Streamlined GitHub integration** where repository changes trigger builds and deployments
- **Globally distributed** static content on Azure points of presence servers
- **Free SSL certificates**, which are automatically renewed
- **Custom domains**\* to provide branded customizations to your app
- **Seamless security model** when calling APIs, which requires no CORS configurations
- **Authentication provider integrations** with Azure Active Directory, Facebook, Google, GitHub, and Twitter
- **Customizable authorization role definition** and assignments
- **Back-end routing rules** enabling full control over which routes serve what content
- **Generated staged environments** allow you to preview 

\* Apex domain registrations are not supported during preview.

## Next steps

> [!div class="nextstepaction"]
> [Building your first static app](getting-started.md)
