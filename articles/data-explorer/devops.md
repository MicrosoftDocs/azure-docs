---
title: 'Azure DevOps task for Azure Data Explorer'
description: 'In this topic, you learn to '
services: data-explorer
author: orspod
ms.author: orspodek
ms.reviewer: jasonh
ms.service: data-explorer
ms.topic: conceptual
ms.date: 04/28/2019

#Customer intent: I want to use Azure DevOps to....
---

# Azure DevOps Task for Azure Data Explorer

[Azure DevOps](https://azure.microsoft.com/services/devops/) Services provides development collaboration tools including high-performance pipelines, free private Git repositories, configurable Kanban boards, and extensive automated and continuous testing capabilities. [Azure Pipelines](https://azure.microsoft.com/services/devops/pipelines/) is one of the services under Azure DevOps enables you to manage CI/CD to deploy your code with high-performance pipelines that work with any language, platform, and cloud.
[Azure Data Explorer - Admin Commands](https://marketplace.visualstudio.com/items?itemName=Azure-Kusto.PublishToADX) is of the Azure Pipelines task available for free on the Visual Studio Marketplace. This task enables you to create release pipelines and deploy your database changes to your Azure Data Explorer databases.

This document will walk you through a simple example on how to use Azure Data Explorer – Admin Commands task to deploy your schema changes to your database. For complete CICD pipelines, refer Azure DevOps documentation.

## Prerequisites

* If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.
* Azure Data Explorer Cluster setup:
    * An [Azure Data Explorer cluster and database](/azure/data-explorer/create-cluster-database-portal).
    * Create Azure AD app by [provisioning an Azure AD application](/azure/kusto/management/access-control/how-to-provision-aad-app).
    * Grant access to your Azure AD App on your Azure Data Explorer database by [managing Azure Data Explorer database permissions](/azure/data-explorer/manage-database-permissions).
* Azure DevOps setup:
    * [Sign up for a free organization](/azure/devops/user-guide/sign-up-invite-teammates?view=azure-devops)
    * [Create an organization](/azure/devops/organizations/accounts/create-organization?view=azure-devops)
    * [Create a project in Azure DevOps](/azure/devops/organizations/projects/create-project?view=azure-devops)
    * [Code with Git](/azure/devops/user-guide/code-with-git?view=azure-devops)

## Create folders

Create the following folders (Functions, Policies, Tables) in your Git repos and copy the files from <location> in respective folders and commit the change. This sample files are provided to execute this workflow. 

![Create folders](media/devops/create-folders.png)

In real world, ensure your code idempotent. For example, use [.create-merge table](/azure/kusto/management/tables#create-merge-tables) instead of [.create table](/azure/kusto/management/tables#create-table), use [.create-or-alter](/azure/kusto/management/functions#create-or-alter-function) function instead of [.create function](/azure/kusto/management/functions#create-function), and use **.create-or-alter table command for update the ingestion mappings. - Need link**  

## Create a release pipeline 

1. Sign in to your [Azure DevOps account](https://dev.azure.com/).
1. Select **Pipelines** > **Releases** from left-hand menu and select **New pipeline**

    ![New pipeline](media/devops/new-pipeline.png)

1. In **New release pipeline** window, **Select a template** (HOW?) and select **Empty job**


