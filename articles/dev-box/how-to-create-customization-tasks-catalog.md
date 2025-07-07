---
title: Create Tasks for Dev Box Team Customizations
description: Learn how to create and manage tasks in a catalog for Dev Box team customizations, including adding tasks and attaching the catalog to a project.
author: RoseHJM
ms.author: rosemalcolm
ms.service: dev-box
ms.custom:
  - ignite-2024
ms.topic: how-to
ms.date: 11/05/2024

#customer intent: As a Dev Center Admin or Project Admin, I want to create additional tasks in a catalog so that I can create a specific customization in a customization or image definition file.
---

# Create tasks for Dev Box team customizations

When you create tasks for Microsoft Dev Box team customizations, you can define specific actions for your dev boxes to help ensure a consistent and efficient development environment. Creating new tasks in a catalog allows you to define reusable components tailored to your development teams and add guardrails around the configurations that are possible. This article guides you through creating a catalog for customization tasks, adding tasks, and attaching the catalog to a dev center or project.

[!INCLUDE [customizations-preview-text](includes/customizations-preview-text.md)]

## Prerequisites

To complete the steps in this article, you must have:

- A dev center configured with a dev box project.
- An existing catalog in GitHub or Azure Repos.

## Permissions required to configure customizations
  
[!INCLUDE [permissions-for-customizations](includes/permissions-for-customizations.md)]

## What are tasks?

A task performs a specific action, like installing software. Each task consists of one or more PowerShell scripts, along with a task.yaml file that provides parameters and defines how the scripts run. You can also include a PowerShell command in the task.yaml file.

You can store a collection of curated tasks in a catalog that's attached to your dev center, with each task in a separate folder. Dev Box supports using a GitHub repository or an Azure Repos repository as a catalog. Dev Box scans a specified folder of the catalog recursively to find task definitions.

WinGet and PowerShell are available from any dev center without requiring a catalog. If your customizations use only WinGet or PowerShell, you can create tasks that use them in a customization file. If you need to use other tools or scripts, you can create tasks in a catalog.

Microsoft provides a quickstart catalog to help you get started with customizations. It includes a default set of tasks that define common actions:

- Install software by using WinGet package manager.
- Deploy Desired State Configuration (DSC) by using WinGet Configuration.
- Clone a repository by using `git-clone`.
- Configure applications like installing Visual Studio extensions.
- Run PowerShell scripts.

## Create tasks in a catalog

Tasks, such as installing software or running scripts, are organized into a catalog. You create and manage tasks in a catalog, define new tasks, and attach your catalog to a dev center. With Microsoft's quickstart catalog, you can get started with common tasks like installing software, deploying DSC, cloning repositories, and configuring applications.

### Define new tasks

To create and manage tasks for Dev Box team customizations, follow these steps:

1. Create a repository to store your tasks. Optionally, you can make a copy of the [quickstart catalog](https://github.com/microsoft/devcenter-catalog) in your own repository to use as a starting point.

1. Create tasks in your repository by modifying existing PowerShell scripts or by creating new scripts. To start creating tasks, you can use the examples in the GitHub repository for dev center examples and in PowerShell documentation.

1. Attach your repository to your dev center as a catalog.

1. Create a configuration file for those tasks by following the steps in [Write a customization file](./how-to-write-customization-file.md).

### Use secrets from an Azure key vault

You can use secrets from your Azure key vault in your YAML configurations to clone private repositories, or with any custom task you author that requires an access token.

Your dev center needs access to your key vault. DevCenter doesn't support service tags, so if your key vault is kept private, you must allow trusted Microsoft services to bypass the firewall.

To configure your key vault secrets for use in your YAML configurations:

1. Ensure that your dev center project's managed identity has the Key Vault Reader role and Key Vault Secrets User role on your key vault.

1. Grant the Key Vault Secrets User role for the key vault secret to each user or user group that should be able to consume the secret during the customization of a dev box. The user or group that's granted the role must include the managed identity for the dev center, your own user account, and any user or group that needs the secret during the customization of a dev box.

For more information on using key vault secrets in a customization file, see [Clone a private repository by using a customization file](how-to-write-customization-file.md#clone-a-private-repository-by-using-a-customization-file).

## Attach a catalog

You can attach a catalog to a project to make tasks accessible to the developer team. To attach a catalog to a project, follow the steps in [Add and configure a catalog from GitHub or Azure Repos](../deployment-environments/how-to-configure-catalog.md).

## Related content

- [Microsoft Dev Box team customizations](concept-what-are-team-customizations.md)
- [Write a customization file for a dev box](./how-to-write-customization-file.md)