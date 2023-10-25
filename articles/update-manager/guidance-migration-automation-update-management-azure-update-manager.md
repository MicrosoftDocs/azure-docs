---
title: Guidance to move virtual machines from Automation Update Management to Azure Update Manager
description: Guidance overview on migration from Automation Update Management to Azure Update Manager
author: snehasudhirG
ms.service: azure-update-manager
ms.topic: conceptual
ms.date: 09/14/2023
ms.author: sudhirsneha
---

# Guidance to move virtual machines from Automation Update Management to Azure Update Manager

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.

This article provides guidance to move virtual machines from Automation Update Management to Azure Update Manager.

Azure Update Manager provides a SaaS solution to manage and govern software updates to Windows and Linux machines across Azure, on-premises, and multicloud environments. It is an evolution of [Azure Automation Update management solution](../automation/update-management/overview.md) with new features and functionality, for assessment and deployment of software updates on a single machine or on multiple machines at scale.

For the Azure Update Manager, both AMA and MMA aren't a requirement to manage software update workflows as it relies on the Microsoft Azure VM Agent for Azure VMs and Azure connected machine agent for Arc-enabled servers. When you perform an update operation for the first time on a machine, an extension is pushed to the machine and it interacts with the agents to assess missing updates and install updates.


> [!NOTE] 
> - If you are using Azure Automation Update Management Solution, we recommend that you don't remove MMA agents from the machines without completing the migration to Azure Update Manager for the machine's patch management needs. If you remove the MMA agent from the machine without moving to Azure Update Manager, it would break the patching workflows for that machine. 
>
> - All capabilities of Azure Automation Update Management will be available on Azure Update Manager before the deprecation date.

## Guidance to move virtual machines from Automation Update Management to Azure Update Manager

Guidance to move various capabilities is provided in table below:

**S.No** | **Capability** | **Automation Update Management** | **Azure Update Manager** | **Steps using Azure portal** | **Steps using API/script** | 
--- | --- | --- | ---| ---| ---| 
1 | Patch management for Off-Azure machines. | Could run with or without Arc connectivity. | Azure Arc is a prerequisite for non-Azure machines. | 1. [Create service principal](../app-service/quickstart-php.md#1---get-the-sample-repository) </br> 2. [Generate installation script](../azure-arc/servers/onboard-service-principal.md#generate-the-installation-script-from-the-azure-portal) </br> 3. [Install agent and connect to Azure](../azure-arc/servers/onboard-service-principal.md#install-the-agent-and-connect-to-azure) | 1. [Create service principal](../azure-arc/servers/onboard-service-principal.md#azure-powershell) <br> 2. [Generate installation script](../azure-arc/servers/onboard-service-principal.md#generate-the-installation-script-from-the-azure-portal) </br> 3. [Install agent and connect to Azure](../azure-arc/servers/onboard-service-principal.md#install-the-agent-and-connect-to-azure) |
2 | Enable periodic assessment to check for latest updates automatically every few hours. | Machines automatically receive the latest updates every 12 hours for Windows and every 3 hours for Linux. | Periodic assessment is an update setting on your machine. If it's turned on, the Update Manager fetches updates every 24 hours for the machine and shows the latest update status. | 1. [Single machine](manage-update-settings.md#configure-settings-on-a-single-vm) </br> 2. [At scale](manage-update-settings.md#configure-settings-at-scale) </br> 3. [At scale using policy](periodic-assessment-at-scale.md) | 1. [For Azure VM](../virtual-machines/automatic-vm-guest-patching.md#azure-powershell-when-updating-a-windows-vm) </br> 2.[For Arc-enabled VM](/powershell/module/az.connectedmachine/update-azconnectedmachine?view=azps-10.2.0) |
3 | Static Update deployment schedules (Static list of machines for update deployment). | Automation Update management had its own schedules. | Azure Update Manager creates a [maintenance configuration](../virtual-machines/maintenance-configurations.md) object for a schedule. So, you need to create this object, copying all schedule settings from Automation Update Management to Azure Update Manager schedule. | 1. [Single VM](scheduled-patching.md#schedule-recurring-updates-on-a-single-vm) </br> 2. [At scale](scheduled-patching.md#schedule-recurring-updates-at-scale) </br> 3. [At scale using policy](scheduled-patching.md#onboard-to-schedule-by-using-azure-policy) | [Create a static scope](manage-vms-programmatically.md) |
4 | Dynamic Update deployment schedules (Defining scope of machines using resource group, tags, etc. which is evaluated dynamically at runtime).| Same as static update schedules. | Same as static update schedules. | [Add a dynamic scope](manage-dynamic-scoping.md#add-a-dynamic-scope | [Create a dynamic scope]( tutorial-dynamic-grouping-for-scheduled-patching.md#create-a-dynamic-scope) |
5 | Deboard from Azure Automation Update management. | After you complete the steps 1, 2, and 3, you need to clean up Azure Update management objects. | | 1. [Remove machines from solution](../automation/update-management/remove-feature.md#remove-management-of-vms) </br> 2. [Remove Update Management solution](../automation/update-management/remove-feature.md#remove-updatemanagement-solution) </br> 3. [Unlink workspace from Automation account](../automation/update-management/remove-feature.md#unlink-workspace-from-automation-account) </br> 4. [Cleanup Automation account](../automation/update-management/remove-feature.md#cleanup-automation-account) | NA |
6 | Reporting | Custom update reports using Log Analytics queries. | Update data is stored in Azure Resource Graph (ARG). Customers can query ARG data to build custom dashboards, workbooks etc. | The old Automation Update Management data stored in Log analytics can be accessed, but there's no provision to move data to ARG. You can write ARG queries to access data that will be stored to ARG after virtual machines are patched via Azure Update Manager. With ARG queries you can, build dashboards and workbooks using following instructions: </br> 1. [Log structure of Azure Resource graph updates data](query-logs.md) </br> 2. [Sample ARG queries](sample-query-logs.md) </br> 3. [Create workbooks](manage-workbooks.md) | NA |
7 | Customize workflows using pre and post scripts. | Available as Automation runbooks. | We recommend that you use Automation runbooks once they are available. | | |
8 | Create alerts based on updates data for your environment | Alerts can be set up on updates data stored in Log Analytics. |We recommend that you use alerts once they are available. | | |


 
## Next steps
- [An overview on Azure Update Manager](overview.md)
- [Check update compliance](view-updates.md) 
- [Deploy updates now (on-demand) for single machine](deploy-updates.md) 
- [Schedule recurring updates](scheduled-patching.md)
