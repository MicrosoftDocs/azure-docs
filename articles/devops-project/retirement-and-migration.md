---
title: Retirement of DevOps Starter for Azure | Microsoft Docs
description: Retirement of Azure Devops Starter and Migration
services: devops-project
documentationcenter: ''
author: moala
manager: moala
editor: 
ms.assetid: 
ms.service: az-devops-project
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload:
ms.date: 09/16/2022
ms.author: moala

---
# Retirement of DevOps Starter

Azure DevOps Starter will be retired March 31, 2023. The corresponding REST APIs for [Microsoft.DevOps](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/devops/resource-manager/Microsoft.DevOps/) and [Microsoft.VisualStudio/accounts/projects](/rest/api/visualstudio/projects) resources will be retired as well. 
Customers are encouraged to use [Azure Developer CLI](/azure/developer/azure-developer-cli/overview?tabs=nodejs) instead. 

## Azure Developer CLI

The replacement [Azure Developer CLI (azd)](/azure/developer/azure-developer-cli/overview?tabs=nodejs) is a developer command-line tool for building cloud apps. It provides commands that map to key stages in your workflow: code, build, deploy, monitor, repeat. You can use Azure CLI to create, provision, and deploy a new application in a single step. 

## Comparison between Azure DevOps and Azure Developer CLI

| DevOps Starter                             | Azure Developer CLI                         |
| ------------------------------------------ | ------------------------------------------- |
| Deploy to Azure with few clicks            | A single step to deploy to Azure            |
| Configures code, deployment, monitoring    | Configures code, deployment, monitoring     |
| Provides sample application to get started | Provides sample applications to get started |
| Allows user’s repo to be deployed          | Allows user’s repo to be deployed           |
| UI-based experience in Azure portal     | CLI-based experience                     |

## Migration:

There is no migration required because DevOps Starter does not store any information, it just helps users with their Day 0 getting started experience on Azure. Moving forward the recommended way for users to get started on Azure will be [Azure Developer CLI](/azure/developer/azure-developer-cli/overview?tabs=nodejs).


1. For choosing language, framework and target service, choose an appropriate [template](https://github.com/search?q=org:azure-samples%20topic:azd-templates) from azd repo and run the command `azd up --template \<template-name\>`

2. For provisioning Azure service resources, run the command `azd provision`

3. For creating CI/CD pipelines, run the command `azd pipeline config`

4. For application insights monitoring, run the command `azd monitor`

For existing application deployments, **DevOps starter does not store any information itself** and users can use following to get same information:

1. Azure resource details in Azure portal – In Azure portal, visit the resource page for which you had configured DevOps starter.

2. To see pipeline and deployment information, go to the corresponding GitHub Actions workflow or Azure pipeline to view runs and deployments. 

3. To see monitoring details in Application insights, go to application insights for your Azure resource and look at  the monitoring charts. 

## FAQ 

### What is the difference between DevOps starter and Azure developer CLI?

Both are tools, which enable quick setting up of application deployment to Azure and configure CI/CD pipeline for the same. They enable users to quickly get started with Azure.

Azure Developer CLI provides more developer-friendly commands in contrast to the UI wizard for DevOps Starter. This also means better clarity with config-as-code.

### Will I lose my application or the Azure resources if I am not able to access DevOps starter?

No. Application code, deployments, and Azure resources that host the application will still be available. DevOps Starter does not store any of these resources.

### Will I lose the CI/CD pipeline that I created using DevOps Starter?

No. You can still manage CI/CD pipelines in GitHub Actions or Azure Pipelines.

