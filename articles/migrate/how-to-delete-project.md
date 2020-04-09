---
title: Delete an Azure Migrate project
description: Describes how to create an Azure Migrate project and add an assessment/migration tool.
author: rayne-wiselman
ms.service: azure-migrate
ms.topic: article
ms.date: 10/22/2019
ms.author: raynew
---

# Delete an Azure Migrate project

This article describes how to delete an [Azure Migrate](migrate-overview.md) project.


## Before you start

Before you delete a project:

- When you delete a project, the project, and discovered machine metadata are deleted.
- If you've attached a Log Analytics workspace to the Server Assessment tool for dependency analysis, decide whether you want to delete the workspace. 
    - The workspace isn't automatically deleted. Delete it manually.
    - Verify what a workspace is used for before you delete it. The same Log Analytics workspace can be used for multiple scenarios.
    - Before you delete the project, you can find a link to the workspace in **Azure Migrate - Servers** > **Azure Migrate - Server Assessment**, under **OMS Workspace**.
    - To delete a workspace after deleting a project, find the workspace in the relevant resource group, and follow [these instructions](../azure-monitor/platform/delete-workspace.md).


## Delete a project


1. In the Azure portal, open the resource group in which the project was created.
2. In the resource group page, select **Show hidden types**.
3. Select the project and the associated resources that you want to delete.
    - The resource type for Azure Migrate projects is **Microsoft.Migrate/migrateprojects**.
    - In the next section, review the resources created for discovery, assessment, and migration in an Azure Migrate project.
    - If the resource group only contains the Azure Migrate project, you can delete the entire resource group.
    - If you want to delete a project from the previous version of Azure Migrate, the steps are the same. The resource type for these projects is **Migration project**.


## Created resources

These tables summarize the resources created for discovery, assessment, and migration in an Azure Migrate project.

> [!NOTE]
> Delete the key vault with caution because it might contain security keys.

### VMware/physical server

**Resource** | **Type**
--- | ---
"Appliancename"kv | Key vault
"Appliancename"site | Microsoft.OffAzure/VMwareSites
"ProjectName" | Microsoft.Migrate/migrateprojects
"ProjectName"project | Microsoft.Migrate/assessmentProjects
"ProjectName"rsvault | Recovery Services vault
"ProjectName"-MigrateVault-* | Recovery Services vault
migrateappligwsa* | Storage account
migrateapplilsa* | Storage account
migrateapplicsa* | Storage account
migrateapplikv* | Key vault
migrateapplisbns16041 | Service Bus Namespace

### Hyper-V VM 

**Resource** | **Type**
--- | ---
"ProjectName" | Microsoft.Migrate/migrateprojects
"ProjectName"project | Microsoft.Migrate/assessmentProjects
HyperV*kv | Key vault
HyperV*Site | Microsoft.OffAzure/HyperVSites
"ProjectName"-MigrateVault-* | Recovery Services vault


## Next steps

Learn how to add additional [assessment](how-to-assess.md) and [migration](how-to-migrate.md) tools. 
