---
title: Code to cloud options in Azure Container Apps
description: Learn about the different options to deploy a container app directly from your development environment.
services: container-apps
author: craigshoemaker
ms.service: container-apps
ms.topic: how-to
ms.date: 08/11/2023
ms.author: cshoe
---

# Choose the right code-to-cloud path for Azure Container Apps

When developing applications for Azure Container Apps, you have several options to consider surrounding how to build and deploy your apps.

Some questions to consider include:

- Do you want to focus more on application changes, or infrastructure configuration?
- Are you working on a team-based code-to-cloud path or are you working as an individual?
- How fast do you need to see changes reflected in the application or infrastructure?
- How important is an automated workflow vs. an experimental workflow?

Based on your situation, your answers to these questions have a big impact on your development and deployment strategies.

If you're an individual rapidly iterating on features, your needs may vary from structured teams deploying to mature production environments.

This article helps you select the most appropriate option for how you build and deploy your applications to Azure Container Apps.

Depending on your situation, you may want to deploy from a [code editor](#code-editor), through the [Azure portal](#azure-portal), with a hosted [code repository](#code-repository), or via an [infrastructure as code](#infrastructure-as-code) approach.

## Code editor

If you send the majority of your time editing code and favor rapid iteration of your applications, then you may want to use [Visual Studio](https://visualstudio.microsoft.com/) or [Visual Studio Code](https://code.visualstudio.com/) to build your Docker files an deploy your applications directly to Azure Container Apps.

This approach makes it easy for you to experiment with configuration changes you make in the early stages of an application's development.

Once you application works as expected, then you can commit your changes to a [code repository](#code-repository) to run and deploy your application.

### Resources

- [Deploy to Azure Container Apps using Visual Studio](deploy-visual-studio.md)
- [Deploy to Azure Container Apps using Visual Studio Code](deploy-visual-studio-code.md)

## Azure portal

The Azure portal's focus is on setting up, changing, and experimenting with your Container Apps environment.

While you can't use the portal to deploy your code, it's ideal for making iterative changes to your configuration. The portal's strengths lie in making it easy for you to set up, change, and experiment with your container app.

You can also use the portal with Azure App Spaces to deploy your applications to Container Apps.

### Resources

- [Deploy your first container app using the Azure portal](quickstart-portal.md)
- [Deploy a web app with Azure App Spaces](/azure/app-spaces/quickstart-deploy-web-app?tabs=app-service)

## Code repository

Githuh and Azure DevOps (ADO) represent the most operational paths to running your code on ACA. Preceding any updates to your application requires repository check ins. This means a record about the change exists prior to this change being deployed. By coupling your deployment actions to branch policies you’re benefiting by making your repository the source of truth. Further, any build or deployment action takes place on the server rather than your local workstation enabling additional safeguards to ensure your application is only updated through trusted channels. Additional modification would enable you to transition your applications operations to a GitOps flow. For more information on how to use Github and ADO see here: 

Deploy to Azure Container Apps with GitHub Actions 

Deploy to Azure Container Apps from Azure Pipelines 

## Infrastructure as code

| CLI | Description | Best used with |
|--|--|--|
| Azure CLI | The Azure CLI allows you to deploy directly from your local workstation in the form of local code or container image. you can use PowerShell or Bash to automate application and infrastructure deployment. | Individuals or small teams during initial iteration phases. |
| Azure Developer CLI (AZD) |  |  |  |

#### Resources

- **Azure CLI**
  - [Build and deploy your container app from a repository](quickstart-code-to-cloud.md)
  - [Deploy your first container app with containerapp up](get-started.md)
  - [Set up GitHub Actions with Azure CLI](github-actions-cli.md)
  - [Build and deploy your container app from a repository](tutorial-deploy-first-app-cli.md)

- **Azure Developer CLI (AZD)**
  - [Get started using Azure Developer CLI](/azure/developer/azure-developer-cli/get-started?tabs=localinstall&pivots=programming-language-nodejs)

### Azure Developer CLI (AZD)

AZD is a hybrid solution to do both the development and operation of your application. It does require you to maintain both your application code as well as your infrastructure code in the same repository. Application code requires a Dockerfile for packaging, infrastructure code is captured as Bicep. Any updates to either application or infrastructure originate from the local workstation. Without further steps it is hence not well suited for multi-team apps. AZD is a great choice to package your application for others to run as well as for applications being managed by a single team.


 

Summary 

IMAGE: A diagram of a software developer

Description automatically generated 

In summary, each path outlined has its unique characteristics and suitability for different stages and scenarios. Consider the trade-offs between automation capabilities, development stage as well as the type of changes you’re primarily looking to make to your application.  

> [!div class="nextstepaction"]
> [Defile scale rules](scale-app.md)