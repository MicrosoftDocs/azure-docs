---
title: Overview of Maintenance Configurations for Azure virtual machines
description: Learn how to control when maintenance is applied to your Azure VMs using Maintenance Control.
author: cynthn
ms.service: virtual-machines
ms.subservice: maintenance
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 10/06/2021
ms.author: cynthn
#pmcontact: ApnaLakshay
---

# Managing VM updates with Maintenance Configurations

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

Maintenance Configurations gives you the ability to control and manage updates for many Azure virtual machine resources since Azure frequently updates its infrastructure to improve reliability, performance, security or launch new features. Most updates are transparent to users, but some sensitive workloads, like gaming, media streaming, and financial transactions, can't tolerate even few seconds of a VM freezing or disconnecting for maintenance. Maintenance Configurations is integrated with Azure Resource Graph (ARG) for low latency and high scale customer experience.

>[!IMPORTANT]
> Users are required to have a role of at least contributor in order to use maintenance configurations. Users also have to ensure that their subscription is registered with Maintenance Resource Provider to use maintenance configurations.

## Scopes

Maintenance Configurations currently supports three (3) scopes: Host, OS image, and Guest. While each scope allows scheduling and managing updates, the major difference lies in the resource they each support. This section outlines the details on the various scopes and their supported types:

| Scope    | Support Resources          |
|----------|----------------------------|
| Host     | Isolated Virtual Machines, Isolated Virtual Machine Scale Sets, Dedicated Hosts  |
| OS Image | Virtual Machine Scale Sets |
| Guest    | Virtual Machines, Azure Arc Servers |

### Host

With this scope, you can manage platform updates that do not require a reboot on your *isolated VMs*, *isolated Virtual Machine Scale Set instances* and *dedicated hosts*. Some features and limitations unique to the host scope are:

- Schedules can be set anytime within 35 days. After 35 days, updates are automatically applied.
- A minimum of a 2 hour maintenance window is required for this scope.
- Rack level maintenance is not currently supported.

[Learn more about Azure Dedicated Hosts](dedicated-hosts.md)

### OS image

Using this scope with maintenance configurations lets you decide when to apply upgrades to OS disks in your *Virtual Machine Scale Sets* through an easier and more predictable experience. An upgrade works by replacing the OS disk of a VM with a new disk created using the latest image version. Any configured extensions and custom data scripts are run on the OS disk, while data disks are retained. Some features and limitations unique to this scope are:

- Scale sets need to have [automatic OS upgrades](../virtual-machine-scale-sets/virtual-machine-scale-sets-automatic-upgrade.md) enabled in order to use maintenance configurations.
- You can schedule recurrence up to a week (7 days).
- A minimum of 5 hours is required for the maintenance window.

### Guest

This scope is integrated with [Update Manager](../update-center/overview.md), which allows you to save recurring deployment schedules to install updates for your Windows Server and Linux machines in Azure, in on-premises environments, and in other cloud environments connected using Azure Arc-enabled servers. Some features and limitations unique to this scope include:

- [Patch orchestration](automatic-vm-guest-patching.md#patch-orchestration-modes) for virtual machines need to be set to AutomaticByPlatform

    :::image type="content" source="./media/maintenance-configurations/add-schedule-maintenance-window.png" alt-text="Screenshot of the upper maintenance window time.":::

- The upper maintenance window is 3 hours 55 mins.
- A minimum of 1 hour and 30 minutes is required for the maintenance window.
- The value of **Repeat** should be at least 6 hours.

In rare cases if platform catchup host update window happens to coincide with the guest (VM) patching window and if the guest patching window don't get sufficient time to execute after host update then the system would show **Schedule timeout, waiting for an ongoing update to complete the resource** error since only a single update is allowed by the platform at a time. 

>[!IMPORTANT]
> The minimum maintenance window has been increased from 1 hour 10 minutes to 1 hour 30 minutes, while the minimum repeat value has been set to 6 hours for new schedules. **Please note that your existing schedules will not get impacted; however, we strongly recommend updating existing schedules to include these new changes.**

To learn more about this topic, checkout [Update Manager and scheduled patching](../update-center/scheduled-patching.md)

> [!NOTE]
> If you move a VM to a different resource group or subscription, the scheduled patching for the VM stops working as this scenario is currently unsupported by the system.

## Shut Down Machines

We are unable to apply maintenance updates to any shut down machines. You need to ensure that your machine is turned on at least 15 minutes before a scheduled update or your update may not be applied. If your machine is in a shutdown state at the time of your scheduled update, it may appear that the maintenance configuration has been disassociated on the Azure portal, and this is only a display issue that the team is currently working to fix it. The maintenance configuration has not been completely disassociated and you can check it via CLI using [check configuration](maintenance-configurations-cli.md#check-configuration).

## Management options

You can create and manage maintenance configurations using any of the following options:

- [Azure CLI](maintenance-configurations-cli.md)
- [Azure PowerShell](maintenance-configurations-powershell.md)
- [Azure portal](maintenance-configurations-portal.md)

>[!IMPORTANT]
> Pre/Post **tasks** property is currently exposed in the API but it is not supported a this time.

For an Azure Functions sample, see [Scheduling Maintenance Updates with Maintenance Configurations and Azure Functions](https://github.com/Azure/azure-docs-powershell-samples/tree/master/maintenance-auto-scheduler).

## Service Limits

The following are the recommended limits for the mentioned indicators

| Indicator    | Limit          |
|----------|----------------------------|
| Number of schedules per Subscription per Region     | 250  |
| Total number of Resource associations to a schedule | 3000 |
| Resource associations on each dynamic scope    | 1000 |
| Number of dynamic scopes per Resource Group or Subscription per Region     | 250  |
| Number of dynamic scopes per Maintenance Configuration   | 50  |

The following are the Dynamic Scope Limits for **each dynamic scope**

| Resource    | Limit          |
|----------|----------------------------|
| Resource associations     | 1000  |
| Number of tag filters | 50 |
| Number of Resource Group filters    | 50 |

**Please note that the above limits are for the Dynamic Scoping in the Guest scope only.**

## Next steps

To learn more, see [Maintenance and updates](maintenance-and-updates.md).
