---
title: Manual migration from Automation Update Management to Azure Update Manager
description: Guidance on manual migration while migrating from Automation Update Management to Azure Update Manager.
author: snehasudhirG
ms.service: azure-update-manager
ms.topic: conceptual
ms.date: 08/01/2024
ms.author: sudhirsneha
---

# Manual migration guidance

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers

The article provides the guidance to move various resources when you migrate manually.

## Guidance to move various resources


**S.No** | **Capability** | **Automation Update Management** | **Azure Update Manager** | **Steps using Azure portal** | **Steps using API/script** | 
--- | --- | --- | ---| ---| ---| 
1 | Patch management for Off-Azure machines. | Could run with or without Arc connectivity. | Azure Arc is a prerequisite for non-Azure machines. | 1. [Create service principal](../app-service/quickstart-php.md#1---get-the-sample-repository) </br> 2. [Generate installation script](../azure-arc/servers/onboard-service-principal.md#generate-the-installation-script-from-the-azure-portal) </br> 3. [Install agent and connect to Azure](../azure-arc/servers/onboard-service-principal.md#install-the-agent-and-connect-to-azure) | 1. [Create service principal](../azure-arc/servers/onboard-service-principal.md#azure-powershell) <br> 2. [Generate installation script](../azure-arc/servers/onboard-service-principal.md#generate-the-installation-script-from-the-azure-portal) </br> 3. [Install agent and connect to Azure](../azure-arc/servers/onboard-service-principal.md#install-the-agent-and-connect-to-azure) |
2 | Enable periodic assessment to check for latest updates automatically every few hours. | Machines automatically receive the latest updates every 12 hours for Windows and every 3 hours for Linux. | Periodic assessment is an update setting on your machine. If it's turned on, the Update Manager fetches updates every 24 hours for the machine and shows the latest update status. | 1. [Single machine](manage-update-settings.md#configure-settings-on-a-single-vm) </br> 2. [At scale](manage-update-settings.md#configure-settings-at-scale) </br> 3. [At scale using policy](periodic-assessment-at-scale.md) | 1. [For Azure VM](/azure/virtual-machines/automatic-vm-guest-patching#azure-powershell-when-updating-a-windows-vm) </br> 2. [For Arc-enabled VM](/powershell/module/az.connectedmachine/update-azconnectedmachine) |
3 | Static Update deployment schedules (Static list of machines for update deployment). | Automation Update management had its own schedules. | Azure Update Manager creates a [maintenance configuration](/azure/virtual-machines/maintenance-configurations) object for a schedule. So, you need to create this object, copying all schedule settings from Automation Update Management to Azure Update Manager schedule. | 1. [Single VM](scheduled-patching.md#schedule-recurring-updates-on-a-single-vm) </br> 2. [At scale](scheduled-patching.md#schedule-recurring-updates-at-scale) </br> 3. [At scale using policy](scheduled-patching.md#onboard-to-schedule-by-using-azure-policy) | [Create a static scope](manage-vms-programmatically.md) |
4 | Dynamic Update deployment schedules (Defining scope of machines using resource group, tags, etc. that is evaluated dynamically at runtime).| Same as static update schedules. | Same as static update schedules. | [Add a dynamic scope](manage-dynamic-scoping.md#add-a-dynamic-scope) | [Create a dynamic scope]( tutorial-dynamic-grouping-for-scheduled-patching.md#create-a-dynamic-scope) |
5 | Deboard from Azure Automation Update management. | After you complete the steps 1, 2, and 3, you need to clean up Azure Update management objects. | |  [Remove Update Management solution](../automation/update-management/remove-feature.md#remove-updatemanagement-solution) </br> | NA |
6 | Reporting | Custom update reports using Log Analytics queries. | Update data is stored in Azure Resource Graph (ARG). Customers can query ARG data to build custom dashboards, workbooks etc. | The old Automation Update Management data stored in Log analytics can be accessed, but there's no provision to move data to ARG. You can write ARG queries to access data that will be stored to ARG after virtual machines are patched via Azure Update Manager. With ARG queries you can build dashboards and workbooks using following instructions: </br> 1. [Log structure of Azure Resource graph updates data](query-logs.md) </br> 2. [Sample ARG queries](sample-query-logs.md) </br> 3. [Create workbooks](manage-workbooks.md) | NA |
7 | Customize workflows using pre and post scripts. | Available as Automation runbooks. | We recommend that you try out the Public Preview for pre and post scripts on your non-production machines and use the feature on production workloads once the feature enters General Availability. |[Manage pre and post events (preview)](manage-pre-post-events.md) and [Tutorial: Create pre and post events using a webhook with Automation](tutorial-webhooks-using-runbooks.md) | |
8 | Create alerts based on updates data for your environment | Alerts can be set up on updates data stored in Log Analytics. | We recommend that you try out the Public Preview for alerts on your non-production machines and use the feature on production workloads once the feature enters General Availability. |[Create alerts (preview)](manage-alerts.md) | |


## Next steps

- [An overview of migration](migration-overview.md)
- [Migration using Azure portal](migration-using-portal.md)
- [Migration using runbook scripts](migration-using-runbook-scripts.md)
- [Key points during migration](migration-key-points.md)
