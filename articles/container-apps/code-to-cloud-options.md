---
title: Code to cloud options in Azure Container Apps
description: Learn about the different options to deploy a container app directly from your development environment.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.topic: how-to
ms.date: 03/18/2026
ms.author: cshoe
#customer intent: As an application developer using Azure Container Apps, I need to understand the options to develop and deploy my apps.
---

# Select the right code-to-cloud path for Azure Container Apps

You have several options as you develop and deploy your apps to Azure Container Apps. As you evaluate your goals and the needs of your team, consider the following questions.

- Are you new to containers?
- Is your focus more on your application or your infrastructure?
- Are you innovating rapidly or in a stable steady state with your application?

Your answers to these questions affect your preferred development and deployment strategies. This article helps you select the most appropriate option for how you develop and deploy your applications to Azure Container Apps.

Depending on your situation, you might want to deploy:

- From a [code editor](#code-editor)
- Through the [Azure portal](#azure-portal)
- With a hosted [code repository](#code-repository)
- By using [infrastructure as code](#infrastructure-as-code)

If you're new to containers, you can [learn more](#new-to-containers) about how containers can help your development process.

## New to containers

You can simplify the development and deployment of your application by packaging your app into a *container*. Containers allow you to wrap up your application and all its dependencies into a single unit that's portable and can be run easily on any container platform.

If you're interested in deploying your application to Azure Container Apps, but don't want to define a container ahead of time, Container Apps can create a container. The Container Apps *cloud build* feature automatically identifies your application stack and uses [CNCF Buildpacks](https://buildpacks.io/) to generate a container image for you.

Defining containers ahead of time often requires using Docker and publishing your container on a container registry. When you use the Container Apps cloud build, you don't have to worry about special container tooling or registries.

If your application currently doesn't use a container, consider using the Container Apps cloud build to deploy your application.

### Resources

- [Build and deploy your app to Azure Container Apps](tutorial-code-to-cloud.md)
- [Deploy an artifact file to Azure Container Apps (preview)](deploy-artifact.md)

## Code editor

If you spend most your time editing code and favor rapid iteration of your applications, you might want to use [Visual Studio](https://visualstudio.microsoft.com/) or [Visual Studio Code](https://code.visualstudio.com/). These editors allow you to easily build Docker files and deploy your applications directly to Azure Container Apps.

This approach allows you to experiment with configuration options made in the early stages of an application's life.

After your application works as expected, you can formalize the build process through your [code repository](#code-repository) to run and deploy your application.

### Resources

- [Deploy to Azure Container Apps using Visual Studio](deploy-visual-studio.md)
- [Deploy to Azure Container Apps using Visual Studio Code](deploy-visual-studio-code.md)

## Azure portal

The Azure portal's focus is on setting up, changing, and experimenting with your Container Apps environment.

Although you can't use the Azure portal to deploy your code, it's ideal for making incremental changes to your configuration. The Azure portal's strengths lie in making it easy for you to set up, change, and experiment with your container app.

### Resources

- [Deploy your first container app using the Azure portal](quickstart-portal.md)

## Code repository

GitHub and Azure DevOps repositories provide the most structured path to running your code on Azure Container Apps.

As you maintain code in a repository, deployment takes place on the server rather than your local workstation. Remote execution engages safeguards to ensure your application is only updated through trusted channels.

### Resources

- [Deploy to Azure Container Apps with GitHub Actions](github-actions.md)
- [Deploy to Azure Container Apps from Azure Pipelines](azure-pipelines.md)

## Infrastructure as code

Infrastructure as Code (IaC) allows you to maintain your infrastructure setup and configuration in code. Once in your codebase, you can ensure every deployed container environment is consistent, reproducible, and version-controlled.

In Azure Container Apps, you can use the [Azure CLI](/cli/azure/) or the [Azure Developer CLI](/azure/developer/azure-developer-cli/overview) to configure your applications.

| CLI | Description | Best used with |
|--|--|--|
| Azure CLI | The Azure CLI allows you to deploy directly from your local workstation in the form of local code or container image. You can use PowerShell or Bash to automate application and infrastructure deployment. | Individuals or small teams during initial iteration phases. |
| Azure Developer CLI (AZD) | AZD is a hybrid solution for handling both the development and operation of your application. When you use AZD, you need to maintain both your application code and infrastructure code in the same repository. The application code requires a Dockerfile for packaging. The infrastructure code is defined in Bicep. | Applications managed by a single team. |

#### Resources

- **Azure CLI**
  - [Build and deploy your container app from a repository](quickstart-code-to-cloud.md)
  - [Deploy your first container app using the command line](get-started.md)
  - [Set up GitHub Actions with Azure CLI](github-actions-cli.md)
  - [Build and deploy your container app from a repository](tutorial-deploy-first-app-cli.md)

- **Azure Developer CLI (AZD)**
  - [Get started using Azure Developer CLI](/azure/developer/azure-developer-cli/get-started?tabs=localinstall&pivots=programming-language-nodejs)

## Related content

- [Deploy to Azure Container Apps using Visual Studio](deploy-visual-studio.md)
- [Deploy to Azure Container Apps using Visual Studio Code](deploy-visual-studio-code.md)
- Migrating from Heroku? See [Heroku to Azure Container Apps migration overview](migrate-heroku-overview.md).
