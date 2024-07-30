---
title: Summary of important details during migration either by portal or scripts
description: A summary of important pointers while migrating using Azure portal or migration scripts
author: snehasudhirG
ms.service: azure-update-manager
ms.topic: conceptual
ms.date: 07/30/2024
ms.author: sudhirsneha
---


# Key points

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers

This article lists the significant details that you must note when you are migrating using the portal migration tool or migration scripts.

## Important reminders

- Non-Azure Saved Search Queries won't be migrated. 
- The Migration and Deboarding Runbooks need to have the Az.Modules updated to work. 
- The prerequisite script updates the Az.Modules to the latest version 8.0.0.
- The StartTime of the MRP Schedule will be equal to the nextRunTime of the Software Update Configuration. 
- Data from Log Analytics won't be migrated. 
- User Managed Identities [don't support](/entra/identity/managed-identities-azure-resources/managed-identities-faq#can-i-use-a-managed-identity-to-access-a-resource-in-a-different-directorytenant) cross tenant scenarios.
- RebootOnly Setting isn't available in Azure Update Manager. Schedules having RebootOnly Setting won't be migrated.
- For Recurrence, Automation schedules support values between (1 to 100) for Hourly/Daily/Weekly/Monthly schedules, whereas Azure Update Manager’s maintenance configuration supports between (6 to 35) for Hourly and (1 to 35) for Daily/Weekly/Monthly.
   - For example, if the automation schedule has a recurrence of every 100 Hours, then the equivalent maintenance configuration schedule has it for every 100/24 = 4.16 (Round to Nearest Value) -> Four days will be the recurrence for the maintenance configuration. 
   - For example, if the automation schedule has a recurrence of every 1 hour, then the equivalent maintenance configuration schedule will have it every 6 hours.
   - Apply the same convention for Weekly and Daily. 
     - If the automation schedule has daily recurrence of say 100 days, then 100/7 = 14.28 (Round to Nearest Value) -> 14 weeks will be the recurrence for the maintenance configuration schedule.
     - If the automation schedule has weekly recurrence of say 100 weeks, then 100/4.34 = 23.04 (Round to Nearest Value) -> 23 Months will be the recurrence for the maintenance configuration schedule. 
     - If the automation schedule that should recur Every 100 Weeks and has to be Executed on Fridays. When translated to maintenance configuration, it will be Every 23 Months (100/4.34). But there's no way in Azure Update Manager to say that execute every 23 Months on all Fridays of that Month, so the schedule won't be migrated. 
     - If an automation schedule has a recurrence of more than 35 Months, then in maintenance configuration it will always have 35 Months Recurrence. 
   - SUC supports between 30 Minutes to six Hours for the Maintenance Window. MRP supports between 1 hour 30 minutes to 4 hours.
     - For example, if SUC has a Maintenance Window of 30 Minutes, then the equivalent MRP schedule will have it for 1 hour 30 minutes.
     - For example, if SUC has a Maintenance Window of 6 hours, then the equivalent MRP schedule will have it for 4 hours. 
- When the migration runbook is executed multiple times, say you did Migrate All automation schedules and then again tried to migrate all the schedules, then migration runbook will run the same logic. Doing it again will update the MRP schedule if any new change is present in SUC. It won't make duplicate config assignments. Also, operations are carried only for automation schedules having enabled schedules. If an SUC was **Migrated** earlier, it will be skipped in the next turn as its underlying schedule will be **Disabled**. 
- In the end, you can resolve more machines from Azure Resource Graph as in Azure Update Manager; You can't check if Hybrid Runbook Worker is reporting or not, unlike in Automation Update Management where it was an intersection of Dynamic Queries and Hybrid Runbook Worker.
- Machines which are unsupported in Azure Update Manager will not be migrated. The Schedules which have such machines will be partially migrated and only supported machines of the software update configuration will be moved to Azure Update Manager. To prevent patching by both Automation Update Management and Azure Update Manager, remove migrated machines from deployment schedules in Automation Update Management. 

Post-migration, a Software Update Configuration can have any one of the following four migration statuses: 

MigrationFailed 

PartiallyMigrated 

NotMigrated 

Migrated 

The below table shows the scenarios associated with each Migration Status. 
< to add> 

## Next steps

- [An overview of migration](migration-overview.md)
- [Migration using Azure portal](migration-using-portal.md)
- [Migration using runbook scripts](migration-using-runbook-scripts.md)
- [Key points during migration](migration-key-points.md)
