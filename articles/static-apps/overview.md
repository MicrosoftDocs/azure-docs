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

When you make commits and pull requests to a designated branch, these trigger a GitHub Action workflow. The workflow builds the web application for production and globally deploys the web app. 

Back-end API functionality is provided via an Azure Functions app. Hosted on the Linux consumption plan, the app's API automatically scales up and down based on the demand on the API.

## Key features

- **Free web hosting** for static content like HTML, CSS, JavaScript, and images
- **Free API** support provided by Azure Functions
- **Streamlined GitHub integration** where repository changes trigger builds and deployments
- **Globally distributed** static content on Azure points of presence servers, putting content closer to your users
- **Free SSL certificates**, which are automatically renewed
- **Custom domains**\* to provide branded customizations to your app
- **Seamless security model** with a reverse-proxy when calling APIs, which requires no CORS configuration
- **Authentication provider integrations** with Azure Active Directory, Facebook, Google, GitHub, and Twitter
- **Customizable authorization role definition** and assignments
- **Back-end routing rules** enabling full control over the content and routes you serve

\* Apex domain registrations are not supported during preview.

## Next steps

> [!div class="nextstepaction"]
> [Building your first static app](getting-started.md)
