---
title: Remove Azure Automation Start/Stop VMs during off-hours overview
description: This article describes how to remove the Start/Stop VMs during off-hours feature and unlink an Automation account from the Log Analytics workspace.
services: automation
ms.subservice: process-automation
ms.date: 01/04/2023
ms.topic: conceptual
ms.custom: engagement-fy23
---

# Remove Start/Stop VMs during off-hours from Automation account

> [!NOTE]
> Start/Stop VM during off-hours, version 1 is going to retire soon by CY23 and is unavailable in the marketplace now. We recommend that you start using [version 2](/articles/azure-functions/start-stop-vms/overview.md), which is now generally available. The new version offers all existing capabilities and provides new features, such as multi-subscription support from a single Start/Stop instance. If you have the version 1 solution already deployed, you can still use the feature, and we will provide support until retirement in CY23. The details on announcement will be shared soon.

After you enable the Start/Stop VMs during off-hours feature to manage the running state of your Azure VMs, you may decide to stop using it. Removing this feature can be done using one of the following methods based on the supported deployment models:


> [!NOTE]
> Before proceeding, verify there aren't any [Resource Manager locks](../azure-resource-manager/management/lock-resources.md) applied at the subscription, resource group, or resource which prevents accidental deletion or modification of critical resources. When you deploy the Start/Stop VMs during off-hours solution, it sets the lock level to **Cannot Delete** against several dependent resources in the Automation account (specifically its runbooks and variables). Any locks need to be removed before you can delete the Automation account.

## Delete the dedicated resource group

To delete the resource group, follow the steps outlined in the [Azure Resource Manager resource group and resource deletion](../azure-resource-manager/management/delete-resource-group.md) article.


## Next steps

To re-enable this feature, see [Enable Start/Stop during off-hours](automation-solution-vm-management-enable.md).