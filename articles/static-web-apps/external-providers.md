---
title: Deploy to Azure Static Web Apps with external providers
description: Learn to use CI/CD providers that aren't supported out-of-the-box to build and deploy your website in Azure Static Web Apps.
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic:  how-to
ms.date: 06/05/2023
ms.author: cshoe
---

# Deploy to Azure Static Web Apps with external providers

Azure Static Web Apps supports a series of built-in providers to help you publish your website. If you would like to use a provider beyond the out-of-the-box options, use the following guide to build and deploy your static web app.

> [!NOTE]
> You can also follow the steps specific to [Bitbucket](bitbucket.md) and [GitLab](gitlab.md).

## Create a static web app

When you create a new static web app from the Azure portal, you can select the source location of your web app.

1. Under *Deployment details*, select **Other** to use a custom source control provider.

    Once the static web app is ready, then go to the *Overview* section.

1. From the *Overview* section, select the **Manage deployment token** button.

1. Copy the deployment token and paste it into a text editor so you can set up your CI/CD pipeline.

## Set up a CI/CD pipeline

When you set up your CI/CD pipeline, you need to create two jobs. The first job builds your static web app and the second deploys the app.

### Build

The purpose of the build job is to build the web application into a production-ready state. Set up your build job to run the commands necessary to build and package your web application to make it ready for deployment.

The build process needs to build the static web app and the APIs in the `api` folder, if they exist.

Build commands are specific to the technology you use. See the documentation for libraries or frameworks used in your application for details.

### Deploy

Create a job to deploy the production-ready files and folders to the empty Static Web App. Your job must include the static web app's deployment token to authenticate with Azure.

Deployment commands are specific to the technology you use. See the documentation for your source control provider for details.

## Next steps

> [!div class="nextstepaction"]
> [Build your first static app](getting-started.md)
