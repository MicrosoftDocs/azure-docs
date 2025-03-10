---
title: Start/Stop VMs v2 overview
description: This article describes version two of the Start/Stop VMs feature, which starts or stops Azure Resource Manager and classic VMs on a schedule.
ms.topic: conceptual
ms.service: azure-functions
ms.subservice: start-stop-vms
ms.custom: devx-track-arm-template
ms.date: 09/23/2022
---

# Start/Stop VMs v2 overview

The Start/Stop VMs v2 feature starts or stops Azure Virtual Machines instances across multiple subscriptions. It starts or stops virtual machines on user-defined schedules, provides insights through [Azure Application Insights](/azure/azure-monitor/app/app-insights-overview), and send optional notifications by using [action groups](/azure/azure-monitor/alerts/action-groups). For most scenarios, Start/Stop VMs can manage virtual machines deployed and managed both by Azure Resource Manager and by Azure Service Manager (classic), which is [deprecated](/azure/virtual-machines/classic-vm-deprecation).

This new version of Start/Stop VMs v2 provides a decentralized low-cost automation option for customers who want to optimize their VM costs. It offers all of the same functionality as the original version that was available with Azure Automation, but it's designed to take advantage of newer technology in Azure. The Start/Stop VMs v2 relies on multiple Azure services and it will be charged based on the services that are deployed and consumed.

## Important Start/Stop VMs v2 Updates

> + No further development, enhancements, or updates will be available for Start/Stop v2 except when required to remain on supported versions of components and Azure services.
>
> + The TriggerAutoUpdate and UpdateStartStopV2 functions are now deprecated and will be removed in the future. To update Start/Stop v2, we recommend that you stop the site, install to the latest version from our [GitHub repository](https://github.com/microsoft/startstopv2-deployments), and then start the site. To disable the automatic update functionality, set the Function App's **AzureClientOptions:EnableAutoUpdate** [application setting](../functions-how-to-use-azure-function-app-settings.md?tabs=azure-portal%2Cto-premium#get-started-in-the-azure-portal) to **false**. No built-in notification system is available for updates. After an update to Start/Stop v2 becomes available, we will update the [readme.md](https://github.com/microsoft/startstopv2-deployments/blob/main/README.md) in the GitHub repository. Third-party GitHub file watchers might be available to notify you of changes.
> 
> + As of August 19, 2024, Start/Stop v2 has been updated to the [.NET 8 isolated worker model](../functions-versions.md?tabs=isolated-process%2Cv4&pivots=programming-language-csharp#languages).  

    
## Overview

Start/Stop VMs v2 is redesigned and it doesn't depend on Azure Automation or Azure Monitor Logs, as required by the previous version. This version relies on [Azure Functions](../../azure-functions/functions-overview.md) to handle the VM start and stop execution.

A managed identity is created in Microsoft Entra ID for this Azure Functions application and allows Start/Stop VMs v2 to easily access other Microsoft Entra protected resources, such as the logic apps and Azure VMs. For more about managed identities in Microsoft Entra ID, see [Managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md).

An HTTP trigger function endpoint is created to support the schedule and sequence scenarios included with the feature, as shown in the following table.

|Name |Trigger |Description |
|-----|--------|------------|
|Scheduled |HTTP |This function is for both scheduled and sequenced scenario (differentiated by the payload schema). It's the entry point function called from the Logic App and takes the payload to process the VM start or stop operation. |
|AutoStop |HTTP |This function supports the **AutoStop** scenario, which is the entry point function that is called from Logic App.|
|AutoStopVM |HTTP |This function is triggered automatically by the VM alert when the alert condition is true.|
|VirtualMachineRequestOrchestrator |Queue |This function gets the payload information from the **Scheduled** function and orchestrates the VM start and stop requests.|
|VirtualMachineRequestExecutor |Queue |This function performs the actual start and stop operation on the VM.|
|CreateAutoStopAlertExecutor |Queue |This function gets the payload information from the **AutoStop** function to create the alert on the VM.|
|HeartBeatAvailabilityTest |Timer |This function monitors the availability of the primary HTTP functions.|
|CostAnalyticsFunction |Timer |This function is used by Microsoft to estimate aggregate cost of Start/Stop V2 across customers. This function does not impact the functionality of Start/Stop V2.|
|SavingsAnalyticsFunction |Timer |This function is used by Microsoft to estimate aggregate savings of Start/Stop V2 across customers. This function does not impact the functionality of Start/Stop V2.|
|VirtualMachineSavingsFunction |Queue |This function performs the actual savings calculation on a VM achieved by the Start/Stop V2 solution.|
|TriggerAutoUpdate |Timer |Deprecated. This function starts the auto update process based on the application setting "**AzureClientOptions:EnableAutoUpdate=true**".|
|UpdateStartStopV2 |Queue |Deprecated. This function performs the actual auto update execution, which validates your current version with the available version and decides the final action.|

For example, **Scheduled** HTTP trigger function is used to handle schedule and sequence scenarios. Similarly, **AutoStop** HTTP trigger function handles the auto stop scenario.

The queue-based trigger functions are required in support of this feature. All timer-based triggers are used to perform the availability test and to monitor the health of the system.

 [Azure Logic Apps](../../logic-apps/logic-apps-overview.md) is used to configure and manage the start and stop schedules for the VM take action by calling the function using a JSON payload. By default, during initial deployment it creates a total of five Logic Apps for the following scenarios:

- **Scheduled** - Start and stop actions are based on a schedule you specify against Azure Resource Manager and classic VMs. **ststv2_vms_Scheduled_start** and **ststv2_vms_Scheduled_stop** configure the scheduled start and stop.

- **Sequenced** - Start and stop actions are based on a schedule targeting VMs with pre-defined sequencing tags. Only two named tags are supported - `sequencestart` and `sequencestop`. **ststv2_vms_Sequenced_start** and **ststv2_vms_Sequenced_stop** configure the sequenced start and stop. 

    The proper way to use the sequence functionality is to create a tag named `sequencestart` on each VM you wish to be started in a sequence. The tag value needs to be an integer ranging from 1 to N for each VM in the respective scope. The tag is optional and if not present, the VM simply won't participate in the sequencing. The same criteria applies to stopping VMs with only the tag name being different and use `sequencestop` in this case. You have to configure both the tags in each VM to get start and stop action. If two or more VMs share the same tag value, those VMs would be started or stopped at the same time.

    For example, the following table shows that both start and stop actions are processed in ascending order by the value of the tag.

    :::image type="content" source="media/overview/sequence-settings-table.png" alt-text="Table that shows sequence settings tag examples":::

    > [!NOTE]
    > This scenario only supports Azure Resource Manager VMs.

- **AutoStop** - This functionality is only used for performing a stop action against both Azure Resource Manager and classic VMs based on its CPU utilization. It can also be a scheduled-based *take action*, which creates alerts on VMs and based on the condition, the alert is triggered to perform the stop action. **ststv2_vms_AutoStop** configures the auto stop functionality.

Each Start/Stop action supports assignment of one or more subscriptions, resource groups, or a list of VMs.

An Azure Storage account, which is required by Functions, is also used by Start/Stop VMs v2 for two purposes:

   - Uses Azure Table Storage to store the execution operation metadata (that is, the start/stop VM action).

   - Uses Azure Queue Storage to support the Azure Functions queue-based triggers.

All trace logging data from the function app execution is sent to your connected Application Insights instance. You can view the telemetry data stored in Application Insights from a set of pre-defined visualizations presented in a shared [Azure dashboard](/azure/azure-portal/azure-portal-dashboards).

Email notifications are also sent as a result of the actions performed on the VMs.

## New releases

When a new version of Start/Stop VMs v2 is released, your instance is auto-updated without having to manually redeploy.

## Supported scoping options

### Subscription

Scoping to a subscription can be used when you need to perform the start and stop action on all the VMs in an entire subscription, and you can select multiple subscriptions if necessary.  

You can also specify a list of VMs to exclude and it will ignore them from the action. You can also use wildcard characters to specify all the names that simultaneously can be ignored.

### Resource group

Scoping to a resource group can be used when you need to perform the start and stop action on all the VMs by specifying one or more resource group names, and across one or more subscriptions.

You can also specify a list of VMs to exclude and it will ignore them from the action. You can also use wildcard characters to specify all the names that simultaneously can be ignored.

### VMList

Specifying a list of VMs can be used when you need to perform the start and stop action on a specific set of virtual machines, and across multiple subscriptions. This option doesn't support specifying a list of VMs to exclude.

## Prerequisites

- You must have an Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/).

- To deploy the solution, your account must be granted the [Owner](../../role-based-access-control/built-in-roles.md#owner) permission in the subscription.

- Start/Stop VMs v2 is available in all Azure global and US Government cloud regions that are listed in [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?regions=all&products=functions) page for Azure Functions.

## Next steps

To deploy this feature, see [Deploy Start/Stop VMs](deploy.md).
