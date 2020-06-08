---
title: Use dynamic groups with Azure Automation Update Management
description: This article tells how to use dynamic groups with Azure Automation Update Management.
services: automation
ms.subservice: update-management
ms.date: 11/20/2019
ms.topic: conceptual
---

# Use dynamic groups with Update Management

Update Management allows you to target a dynamic group of Azure or non-Azure VMs for update deployments. Using a dynamic group keeps you from having to edit your deployment to update machines.

> [!NOTE]
> Dynamic groups do not work with classic VMs.

You can define dynamic groups for Azure or non-Azure machines from **Update management** in the Azure portal. See 
[Manage updates for multiple Azure virtual machines](manage-update-multi.md).

A dynamic group is defined by a query that Azure Automation evaluates at deployment time. Even if a dynamic group query retrieves a large number of machines, Azure Automation can process only a maximum of 1000 machines at a time. See [Azure subscription and service limits, quotas, and constraints](https://docs.microsoft.com/azure/azure-resource-manager/management/azure-subscription-service-limits#update-management). 

> [!NOTE]
> If you expect to update more than 1000 machines, we recommend that you split up the updates among multiple update schedules. 

## Define dynamic groups for Azure machines

When defining a dynamic group query for Azure machines, you can use the following items to populate the dynamic group:

* Subscription
* Resource groups
* Locations
* Tags

![Select groups](./media/automation-update-management/select-groups.png)

To preview the results of your dynamic group query, click **Preview**. The preview shows the group membership at the current time. In the example, we're searching for machines having the tag `Role` for the group **BackendServer**. If more machines have this tag added, they are added to any future deployments against that group.

![preview groups](./media/automation-update-management/preview-groups.png)

## Define dynamic groups for non-Azure machines

A dynamic group for non-Azure machines uses saved searches, also called computer groups. To learn how to create a saved search, see [Creating a computer group](../azure-monitor/platform/computer-groups.md#creating-a-computer-group). Once your saved search is created, you can select it from the list of saved searches in **Update management** in the Azure portal. Click **Preview** to preview the computers in the saved search.

![Select groups](./media/automation-update-management/select-groups-2.png)

## Next steps

To work with Update Management, see [Manage updates and patches for your Azure VMs](automation-tutorial-update-management.md).
