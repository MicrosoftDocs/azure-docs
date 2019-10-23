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

This article describes how delete an [Azure Migrate](migrate-overview.md) project.


## Before you start

Note the following before you delete a project:

- When you delete a project, the project, and discovered machine metadata are deleted.
- If you've attached a Log Analytics workspace to the Server Assessment tool for the purposes of dependency analysis, you need to decide whether you want to delete the workspace. Note that:
    - The workspace isn't automatically deleted. If you want to delete the Log Analytics workspace, you must do that manually.
    - Before deleting a workspace verify what it's used for. The same Log Analytics workspace might be used for multiple scenarios.
    - Before you delete the project, you can find a link to the workspace (if applicable) in **Auzre Migrate - Servers** > **Azure Migrate - Server Assessment**, under **OMS Workspace**.
    - If you want to delete a workspace after you've deleted a project, located the workspace in the relevant resource group, and follow [these instructions](../azure-monitor/platform/delete-workspace.md).


## Delete a project


1. In the Azure portal, open the resource group in which the project was created.
2. In the resource group page, select **Show hidden types**.
3. Select the project and the associated resources that you want to delete.
    - The resource type for Azure Migrate projects is **Microsoft.Migrate/migrateprojects**.
    - The next section in this article provides information about the resources that might be created for discovery, assessment, and migration in an Azure Migrate project.
    - Alternatively, if the resource group only contains the Azure Migrate project, you can delete the entire resource group.
    - If you want to delete a project from the previous version of Azure Migrate, the steps are the same, but the resource type for these projects is **Migration project**.


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
