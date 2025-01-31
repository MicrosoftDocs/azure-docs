---
title: Migrate to Azure Container Apps automation tools
description: Describes how to use automation tools of Azure Container Apps to achieve CI/CD.
author: KarlErickson
ms.author: dixue
ms.service: azure-spring-apps
ms.topic: upgrade-and-migration-article
ms.date: 01/29/2025
ms.custom: devx-track-java, devx-track-extended-java
---

# Clients or automation tools for Azure Container Apps

[!INCLUDE [deprecation-note](../includes/deprecation-note.md)]

**This article applies to:** ✅ Basic/Standard ✅ Enterprise

This article describes the client and automation tools available for use with Azure Container Apps.

Azure Container Apps is supported by many automation tools and IDEs. Its goal is to improve the experience of developers when deploying applications. At the same time, it provides better support for daily CI/CD operations.

## Prerequisites

- An existing Azure container app. For more information, see [Quickstart: Deploy your first container app using the Azure portal](../../container-apps/quickstart-portal.md).

## Azure CLI

You can use the Azure CLI to manage Azure Container Apps. For the full list of commands, see the [Container Apps Azure CLI reference](/cli/azure/service-page/container%20apps). The preview features are defined in the `containerapp` extension. If you plan to use preview features, you need to enable preview features in the Azure CLI and install or update the latest Azure Container Apps extension by using the following command. To learn how to install the Azure CLI, see [Install the Azure CLI](/cli/azure/install-azure-cli).

```azurecli
az extension add --name containerapp --upgrade --allow-preview true
```

## Terraform

You can manage Azure Container Apps by Terraform. For more information, see [Terraform Reference](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/container_app). To learn how to install Terraform, see [Install Terraform](https://developer.hashicorp.com/terraform/install).

## GitHub action

The Azure Container Apps GitHub action [azure/container-apps-deploy-action](https://github.com/marketplace/actions/azure-container-apps-build-and-deploy) supports building and deploying your container app. You can update the configuration of a container app by using the `yamlConfigPath` argument. For more information, see the [action's GitHub Marketplace page](https://github.com/marketplace/actions/azure-container-apps-build-and-deploy). To learn how to install the GitHub action, see [Quickstart for GitHub Actions](https://docs.github.com/actions/writing-workflows/quickstart).

## Azure DevOps

The Azure Pipelines task enables you to deploy a container app to an Azure Container Apps environment. You can deploy either from a prebuilt image or an application image created with a builder or Docker file. For the complete documentation, see [AzureContainerApps@1 - Azure Container Apps Deploy v1 task](/azure/devops/pipelines/tasks/reference/azure-container-apps-v1).

## Maven plugin

You can deploy your app to Azure Container Apps by using Azure Container Apps Maven plugin. First, add the plugin to your **pom.xml** file and include the details of your target resources. Then, package and deploy the app by using the following Maven command:

```bash
mvn clean package azure-container-apps:deploy
```

For more information, see [Maven Plugin for Azure Container Apps](https://github.com/microsoft/azure-maven-plugins/wiki/Azure-Container-Apps). To learn how to install Apache Maven, see [Install Apache Maven](https://maven.apache.org/install.html).

## VS Code extension

The Azure Container Apps extension for Visual Studio Code enables you to deploy your applications easily by either choosing existing Container Apps resources or creating new ones. After installing the extension, you can access its features through the Azure control panel in Visual Studio Code. For more information, see [Quickstart: Deploy to Azure Container Apps using Visual Studio Code](../../container-apps/deploy-visual-studio-code.md).

## IntelliJ extension

Azure Toolkit for IntelliJ IDEA makes it easy to create a Container Apps environment and deploy containerized applications to Azure Container Apps from an image. For more information and step-by-step tutorials, see [Quickstart: Deploy to Azure Container Apps using IntelliJ IDEA](/azure/developer/java/toolkit-for-intellij/create-container-apps-intellij).

## Azure Developer CLI

The Azure Developer CLI (`azd`) is an open-source tool designed to simplify and speed up the process of setting up and deploying applications on Azure. It provides straightforward, developer-friendly commands aligned with key stages of the development workflow. Whether you work in a terminal, an IDE, or use CI/CD pipelines, `azd` helps streamline resource provisioning and deployment.

`azd` uses flexible blueprint templates to get applications running on Azure quickly. These templates include infrastructure-as-code assets for provisioning resources with Bicep or Terraform, starter app code that you can customize, and configuration files for deployment. The templates can also include CI/CD pipeline workflow files for GitHub Actions or Azure Pipelines to integrate automated workflows seamlessly.

The latest version of `azd` now supports Azure Container Apps by default. For more information on the developer experience, see [Quickstart: Deploy an Azure Developer CLI template](/azure/developer/azure-developer-cli/get-started?pivots=programming-language-java). To learn how to install `azd`, see [Install or update the Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd).
