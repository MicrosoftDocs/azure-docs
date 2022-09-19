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

The replacement [Azure Developer CLI (azd)](/azure/developer/azure-developer-cli/overview?tabs=nodejs) is a developer command-line tool for building cloud apps. It provides commands that map to key stages in your workflow: code, build, deploy, monitor, repeat. Hence enabling users to create, provision, and deploy a new application in a single step. 

## Comparision between Azure DevOps and Azure Developer CLI

| DevOps Starter                             | Azure Developer CLI                         |
| ------------------------------------------ | ------------------------------------------- |
| Deploy to Azure with few clicks            | A single step to deploy to Azure            |
| Configures code, deployment, monitoring    | Configures code, deployment, monitoring     |
| Provides sample application to get started | Provides sample applications to get started |
| Allows user’s repo to be deployed          | Allows user’s repo to be deployed           |
| Is UI based experience in Azure portal     | Is CLI based experience                     |

## Migration:

There is **no migration required** as **DevOps starter does not store any information itself,** it just helps users with their Day 0 getting started experience on Azure. Moving forward the recommended way for users to get started on Azure will be [Azure Developer CLI](/azure/developer/azure-developer-cli/overview?tabs=nodejs).

For new application deployments to Azure, instead of creating DevOps Starter users can get the same capabilities by using Azure Developer CLI.

1. For choosing language, framework and target service, choose an appropriate [template](https://github.com/search?q=org:azure-samples%20topic:azd-templates) from azd repo and run the command `azd up --template \<template-name\>`

2. For provisioning Azure service resources, run the command `azd provision`

3. For creating CI/CD pipelines, run the command `azd pipeline config`

4. For application insights monitoring, run the command `azd monitor`

For existing application deployments, **DevOps starter does not store any information itself** and users can use following to get same information:

1. Azure resource details in Azure portal – In Azure portal, visit the resource page for which you had configured DevOps starter.

2. Pipeline and deployment details in GitHub Actions or Azure pipelines – Visit GitHub Actions webpage or the Azure DevOps webpage to look at the pipeline runs and deployments

3. Monitoring details in Application insights – Visit application insights menu in the corresponding Azure resource to look at the monitoring charts

## FAQ 

1. What is the difference between DevOps starter and Azure developer CLI?

Both are tools, which enable quick setting up of application deployment to Azure and configure CI/CD pipeline for the same. They enable users to quickly get started with Azure.

Azure Developer CLI provides more developer friendly commands as compared to clicking through multiple pages in the UI wizard of DevOps starter experience. This also means better clarity with extensive config-as-code.

2. Will I lose my application or the Azure resources if I am not able to access DevOps starter?

No. Application code, its deployments and Azure resources which host the application will still be available. DevOps starter does not store any of these.

3. Will I lose the CI/CD pipeline that I created using DevOps Starter?

No. You can still manage such CI/CD pipelines natively in their respective products - either GitHub Actions or Azure Pipelines.

