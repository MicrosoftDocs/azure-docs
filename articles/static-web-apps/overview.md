---
title: What is Azure Static Web Apps?
description: The key features and functionality of Azure Static Web Apps.
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic:  overview
ms.date: 05/08/2020
ms.author: cshoe
# Customer intent: As a developer, I want to publish a website from a GitHub repository so that the app is publicly available on the web.
---

# What is Azure Static Web Apps Preview?

Azure Static Web Apps is a service that automatically builds and deploys full stack web apps to Azure from a GitHub repository.

:::image type="content" source="media/overview/static-apps-overview.png" alt-text="Static Web Apps overview":::

The workflow of Azure Static Web Apps is tailored to a developer's daily workflow. Apps are built and deployed based off GitHub interactions.

When you create an Azure Static Web Apps resource, Azure sets up a GitHub Actions workflow in the app's source code repository that monitors a branch of your choice. Every time you push commits or accept pull requests into the watched branch, the GitHub Action automatically builds and deploys your app and its API to Azure.

Static web apps are commonly built using libraries and frameworks like Angular, React, Svelte, or Vue. These apps include HTML, CSS, JavaScript, and image assets that make up the application. With a traditional web server, these assets are served from a single server alongside any required API endpoints.

With Static Web Apps, static assets are separated from a traditional web server and are instead served from points geographically distributed around the world. This distribution makes serving files much faster as files are physically closer to end users. In addition, API endpoints are hosted using a [serverless architecture](../azure-functions/functions-overview.md), which avoids the need for a full back-end server all together.

## Key features

- **Web hosting** for static content like HTML, CSS, JavaScript, and images.
- **Integrated API** support provided by Azure Functions.
- **First-party GitHub integration** where repository changes trigger builds and deployments.
- **Globally distributed** static content, putting content closer to your users.
- **Free SSL certificates**, which are automatically renewed.
- **Custom domains**\* to provide branded customizations to your app.
- **Seamless security model** with a reverse-proxy when calling APIs, which requires no CORS configuration.
- **Authentication provider integrations** with Azure Active Directory, Facebook, Google, GitHub, and Twitter.
- **Customizable authorization role definition** and assignments.
- **Back-end routing rules** enabling full control over the content and routes you serve.
- **Generated staging versions** powered by pull requests enabling preview versions of your site before publishing.

## What you can do with Static Web Apps

- **Build modern JavaScript applications** with frameworks and libraries like [Angular](https://angular.io/), [React](https://reactjs.org/), [Svelte](https://svelte.dev/), [Vue](https://vuejs.org/) with an [Azure Functions](https://azure.microsoft.com/services/functions/) back-end.
- **Publish static sites** with frameworks like [Gatsby](publish-gatsby.md), [Hugo](publish-hugo.md), [VuePress](publish-vuepress.md).
- **Deploy web applications** with frameworks like [Next.js](deploy-nextjs.md) and [Nuxt.js](deploy-nuxtjs.md).

\* Apex domain registrations are not supported during preview.

## Next steps

> [!div class="nextstepaction"]
> [Build your first static app](getting-started.md)
