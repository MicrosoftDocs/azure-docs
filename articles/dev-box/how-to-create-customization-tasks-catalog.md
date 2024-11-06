---
title: Create tasks for Dev Box Team Customizations
description: Learn how to create and manage tasks in a catalog for Dev Box Team Customizations, including adding tasks and attaching the catalog to a project.
author: RoseHJM
ms.author: rosemalcolm
ms.service: dev-box
ms.topic: how-to
ms.date: 11/05/2024

#customer intent: As a dev center administrator or Project Admin, I want to create additional tasks in a catlog so that I can create a specific customization in a customization or image definition file.
---

# Create Tasks for Dev Box Team Customizations

Creating tasks for Dev Box Team Customizations allows you to define specific actions for your dev boxes, ensuring a consistent and efficient development environment. Creating new tasks in a catalog allows you to create reusable components tailored to your development teams and add guardrails around the configurations that are possible. This article guides you through creating a catalog for customization tasks, adding tasks, and attaching the catalog to a dev center or project.

[!INCLUDE [customizations-preview-text](includes/customizations-preview-text.md)]

## Prerequisites
To complete the steps in this article, you must have:
*    A dev center configured with a dev box project.
*    An existing catalog in GitHub or Azure Repos.

## Permissions required to configure customizations
  
[!INCLUDE [permissions-for-customizations](includes/permissions-for-customizations.md)]

## What are tasks?
A task performs a specific action, like installing software. Each task consists of one or more PowerShell scripts, along with a task.yaml file that provides parameters and defines how the scripts run. You can also include a PowerShell command in the task.yaml file. You can store a collection of curated tasks in a catalog attached to your dev center, with each task in a separate folder. Dev Box supports using a GitHub repository or an Azure Repos repository as a catalog and scans a specified folder of the catalog recursively to find task definitions.

WinGet and PowerShell are available from any dev center without requiring a catalog. If your customizations use only Winget or PowerShell, you can create tasks that use them in a customization file. If you need to use other tools or scripts, you can create tasks in a catalog.

Microsoft provides a quick start catalog to help you get started with customizations. It includes a default set of tasks that define common tasks:

- Install software with WinGet package manager
- Deploy desired state configuration (DSC) using WinGet Configuration
- Clone a repository using git-clone
- Configure applications like installing Visual Studio extensions
- Run PowerShell scripts

## Create tasks in a catalog

Tasks, such as installing software or running scripts, are organized into a catalog. You create and manage tasks in a catalog, define new tasks, and attach your catalog to a dev center. With Microsoft's quick start catalog, you can get started with common tasks like installing software, deploying desired state configurations, cloning repositories, and configuring applications. 

### Define new tasks
To create and manage tasks for Dev Box Team Customizations, follow these steps:

1. Create a repository to store your tasks. Optionally, you can make a copy of the [quick start catalog](https://github.com/microsoft/devcenter-catalog) in your own repository to use as a starting point.

1. Create tasks in your repository by modifying existing PowerShell scripts, or creating new scripts. To get started with creating tasks, you can use the examples given in the dev center examples repository on GitHub and PowerShell documentation.

1. Attach your repository to your dev center as a catalog.

1. Create a configuration file for those tasks by following the steps in [Write a customization file](./how-to-write-customization-file.md).

### Use secrets from an Azure Key Vault
You can use secrets from your Azure Key Vault in your yaml configurations to clone private repositories, or with any custom task you author that requires an access token.

To configure your Key Vault secrets for use in your yaml configurations,

1. Ensure that your dev center project's managed identity has the Key Vault Reader role and Key Vault Secrets User role on your key vault.

1. Grant the Secrets User role for the Key Vault secret to each user or user group who should be able to consume the secret during the customization of a dev box. The user or group granted the role must include the managed identity for the dev center, your own user account, and any user or group who needs the secret during the customization of a dev box.

## Attach a catalog 
You can attach a catalog to a project to make tasks accessible to the developer team. To attach a catalog to a project, follow the steps in this article: [Add and configure a catalog from GitHub or Azure Repos](../deployment-environments/how-to-configure-catalog.md).

## Related content
- [Microsoft Dev Box Team Customizations](concept-what-are-team-customizations.md)
- [Write a customization file](./how-to-write-customization-file.md) 
