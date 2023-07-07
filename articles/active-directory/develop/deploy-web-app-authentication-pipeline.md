---
title: Deploy a web app with authentiation in a pipeline
description: Describes how to deploy a web app to Azure App Service and enable Azure App Service authentication in Azure Pipelines.
services: active-directory
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.custom: 
ms.topic: how-to
ms.date: 07/07/2023
ms.author: ryanwi
ms.reviewer: mahender
---

# Deploy a web app in a pipeline and configure authentication

Set up a multi-stage continuous integration/continuous deployment (CI/CD) pipeline that automates the process of deploying your application.  Your pipeline will automatically trigger a build when code changes are made and promote changes through various environments.

Configure authentication and authorization for Azure App Service in a continuous integration/continuous deployment (CI/CD) pipeline. Create an Azure AD app registration as an identity for your web app and configure redirect URI, home page URI, and issuer settings for App Service Authentication.

After completing this article, you'll be able to:

1. Create an identity for your web app using an Azure AD app registration in Azure Pipelines
1. Configure Azure App Service authentication to enable user sign-in in Azure Pipelines.

## Create a tenant

1. Join the Microsoft 365 Developer Program (recommended), or manually create a tenant
1. Get an Azure AD subscription (optional)


## Set up your Azure DevOps environment

Get the sample application

1. Prepare Visual Studio
1. Configure Git
1. Get the source code
1. Build and run the web app locally

## Set up your Azure DevOps environment

1. Add a user to Azure DevOps
1. Get the Azure DevOps project
    1. Run the template
    1. Set your project's visibility
    1. Create a service connection
1. Set up the project locally
    1. Configure Git
    1. Clone your fork locally
    1. Set the upstream remote
        
## Create a multi-stage build and release pipeline in Azure Pipelines

1. Create/update pipeline variables
1. Deploy the web app to Azure App Service
1. See the deployed website on App Service

## Build and deploy the web app to Azure App Service

1. Create/update pipeline variables
1. Deploy the web app to Azure App Service
1. See the deployed website on App Service
    
## Configure Azure App Service authentication in Azure Pipelines

1. Create an Azure AD app registration as an identity for your web app.
1. Get a secret from the app for App Service authentication
1. Configure secret setting for App Service web app
1. Configure redirect URI, home page URI, and issuer settings for App Service Authentication
1. Deploy the web app to Azure App Service and verify user sign in

## Next steps


