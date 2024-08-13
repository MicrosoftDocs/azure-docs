---
title: Important details during migration either by portal or scripts in Azure Update Manager
description: A summary of important pointers while migrating using Azure portal or migration scripts in Azure Update Manager
author: snehasudhirG
ms.service: azure-update-manager
ms.topic: conceptual
ms.date: 08/13/2024
ms.author: sudhirsneha
---

# Key points to note for automated migration

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers

This article lists the significant details that you must note when you're migrating using the portal migration tool or migration scripts.

## Important reminders

- Non-Azure Saved Search Queries aren't migrated.
- The Migration and Deboarding Runbooks need to have the Az.Modules updated to work. 
- The prerequisite script updates the Az.Modules to the latest version 8.0.0.
- The StartTime of the MRP Schedule will be equal to the nextRunTime of the Software Update Configuration. 
- Data from Log Analytics isn't migrated. 
- User Managed Identities [don't support](/entra/identity/managed-identities-azure-resources/managed-identities-faq#can-i-use-a-managed-identity-to-access-a-resource-in-a-different-directorytenant) cross tenant scenarios.
- RebootOnly Setting isn't available in Azure Update Manager. Schedules with the RebootOnly setting aren't migrated..
- For Recurrence, Automation schedules support values between (1 to 100) for Hourly/Daily/Weekly/Monthly schedules, whereas Azure Update Manager’s maintenance configuration supports between (6 to 35) for Hourly and (1 to 35) for Daily/Weekly/Monthly. See the following examples:

  | **Automation schedule recurrence** | **Maintenance configuration schedule recurrence calculation** |
  |---|---|
  | **100 hours** | 100/24 = 4.16 (Round to Nearest Value) -> every four days |
  | **1 hour** | Every 6 hours as it is the minimum value |
  | **100 days** | 100/7 = 14.28 (Round to Nearest Value) -> every 14 weeks |
  | **100 weeks** | 100/4.34 = 23.04 (Round to Nearest Value) -> every 23 Months |
  | **Every 100 Weeks and must be Executed on Fridays** | 23 Months (100/4.34). But there's no way in Azure Update Manager to say that execute every 23 Months on all Fridays of that Month, so the schedule isn't migrated. |
  | **More than 35 Months** | 35 months recurrence | 
  
- SUC supports between 30 Minutes to six Hours for the Maintenance Window. MRP supports between 1 hour 30 minutes to 4 hours.

  | **Maintenance window in Automation Update Management** | **Maintenance window in Azure Update Manager** |
  |---|---|
  | **30 minutes** | one hour 30 minutes |
  | **6 hours** | Four hours |
 
- When the migration runbook is executed multiple times, say you did Migrate All automation schedules and then again tried to migrate all the schedules, then migration runbook runs the same logic. Doing it again updates the MRP schedule if any new change is present in SUC. It doesn't make duplicate config assignments. Also, operations are carried only for automation schedules having enabled schedules. If an SUC was **Migrated** earlier, it will be skipped in the next turn as its underlying schedule will be **Disabled**. 
- In the end, you can resolve more machines from Azure Resource Graph as in Azure Update Manager. You can't check if Hybrid Runbook Worker is reporting or not, unlike in Automation Update Management where it was an intersection of Dynamic Queries and Hybrid Runbook Worker.
- Machines that are unsupported in Azure Update Manager aren't migrated. The Schedules, which have such machines will be partially migrated and only supported machines of the software update configuration will be moved to Azure Update Manager. To prevent patching by both Automation Update Management and Azure Update Manager, remove migrated machines from deployment schedules in Automation Update Management. 
- Remove the user managed identity created for migration that is linked with the automation account. For more information, see [Remove user-assigned managed identity for Azure Automation account](https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-azp#delete-a-user-assigned-managed-identity).

Post-migration, a Software Update Configuration can have any one of the following four migration statuses: 

- MigrationFailed 
- PartiallyMigrated 
- NotMigrated
- Migrated 

The following table shows the scenarios associated with each Migration Status:

| **MigrationFailed** | **PartiallyMigrated** |**NotMigrated** | **Migrated** |
|---|---|---|---|
| Failed to create Maintenance Configuration for the Software Update Configuration| Non-Zero number of Machines where Patch-Settings failed to apply. </br> For example, if a machine is unsupported in Azure Update Manager, then status of the Software Update Configuration will be partially migrated. | Failed to get software update configuration from the API due to some client/server error such as **internal Service Error.** | Zero Machines where Patch-Settings failed to apply </br> **And** </br> Zero Machines with failed Configuration Assignments. </br> **And** </br> Zero Dynamic Queries failed to resolve that is failed to execute the query against Azure Resource Graph. </br> **And** </br> Zero Dynamic Scope Configuration assignment failures </br> **And** </br> Software Update Configuration has zero Saved Search Queries.|
| | Non-Zero number of Machines with failed Configuration Assignments. | Software Update Configuration is having reboot setting as reboot only. This isn't supported today in Azure Update Manager. | |
| | Non-Zero number of Dynamic Queries failed to resolve that is failed to execute the query against Azure Resource Graph. | Software Update Configuration doesn't have a succeeded provisioning state in DB. | |
| | Non-Zero number of Dynamic Scope Configuration assignment failures. | Software Update Configuration is in errored state in DB. | |
| | Software Update Configuration is having Saved Search Queries. | Schedule associated with Software Update Configuration is already expired at the time of migration. | |
| | Software Update Configuration is having pre/post tasks, which haven't been migrated successfully| Schedule associated with Software Update Configuration is disabled. | |
| | | Unhandled exception while migrating software update configuration. |

## Next steps

- [An overview of migration](migration-overview.md)
- [Migration using Azure portal](migration-using-portal.md)
- [Migration using runbook scripts](migration-using-runbook-scripts.md)
- [Manual migration guidance](migration-manual.md)
