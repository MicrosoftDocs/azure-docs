---
title: Cost management guide for Azure Lab Services
description: Understand the different ways to view costs for Lab Services.
author: RogerBestMSFT
ms.service: lab-services
ms.date: 07/04/2022
ms.topic: how-to
ms.custom: devdivchpfy22
---

# Cost management for Azure Lab Services

For Azure Lab Services, cost management can be broken down into two distinct areas: cost estimation and cost analysis. Cost estimation occurs when you're setting up the lab to make sure that the initial structure of the lab will fit within the expected budget. Cost analysis usually occurs at the end of the month to determine the necessary actions for the next month.

## Estimate the lab costs

Each lab dashboard has a **Costs & Billing** section that lays out a rough estimate of what the lab will cost for the lab. The estimate uses the number [schedules](classroom-labs-concepts.md#schedule), [quota hours](classroom-labs-concepts.md#quota), [extra quota for individual students](how-to-manage-lab-users.md#set-additional-quotas-for-specific-users), and [lab capacity](how-to-manage-vm-pool.md#change-lab-capacity) when calculating the cost estimate.  Changes to the number of quota hours, schedules or lab capacity will affect the cost estimate value.

If users don't consume their assigned quota hours, you are only charged for the quota hours that lab users consumed.

This estimate might not show all the possible costs. A few resources aren't included:

- The [template VM preparation](how-to-create-manage-template.md#update-a-template-vm) cost. It can vary significantly in the amount of time needed to create the template. The cost to run the template is the same as running any lab VM.
- Any [compute gallery](how-to-use-shared-image-gallery.md) costs. Compute galleries can be shared among multiple labs.
- Cost incurred when the lab creator starts a virtual machine (VM).
- Networking costs if the lab is using [advanced networking](how-to-connect-vnet-injection.md).

:::image type="content" source="./media/cost-management-guide/dashboard-cost-estimation.png" alt-text="Screenshot that shows the dashboard cost estimate in Azure Lab Services.":::

## Cost analysis

The cost analysis is for reviewing the previous month's usage to help you determine any adjustments you need to make for a lab. You can find the breakdown of past costs in the [subscription cost analysis](../cost-management-billing/costs/quick-acm-cost-analysis.md). 

1. In the [Azure portal](https://portal.azure.com), select **All services**.  Select **Cost management** from the quick access list or select **Cost management + billing** from the **General** category.

    :::image type="content" source="./media/cost-management-guide/all-services-cost-management.png" alt-text="Screenshot that shows the All services page.  The Cost management icon and Cost manage plus billing icon are highlighted.":::
1. Select the **Subscription** page and select subscription you wish to analyze.

    :::image type="content" source="./media/cost-management-guide/subscription-select.png" alt-text="Screenshot that shows the Subscriptions page in Cost Management + Billing.  The Subscriptions menu is highlighted.":::

1. Select **Cost analysis** in the left pane under the **Cost management** heading.

    :::image type="content" source="./media/cost-management-guide/subscription-cost-analysis.png" alt-text="Screenshot that shows a subscription cost analysis on a graph.":::

The Cost analysis dashboard allows in-depth cost analysis, including the ability to export to different file types on a schedule. For more information, see [Cost Management + Billing overview](../cost-management-billing/cost-management-billing-overview.md).

You can filter by service or resource type. To see only costs associated with Azure Lab Services, set the **service name** filter equal to **azure lab services**.  If filtering on **resource type**, include `Microsoft.Labservices/labaccounts` resource type.  If you're using [lab plans](concept-lab-accounts-versus-lab-plans.md), also include the `Microsoft.LabServices/labs` resource type.

### Understand the entries

Changing the view on **Cost Analysis** page to **Cost by resource** shows the individual charges.  By default, there are six columns: **Resource**, **Resource type**, **Location**, **Resource group name**, **Tags**, and **Cost**.   The **Resource** column contains the information about the lab plan, lab name, and VM. If the cost is associated with a template VM, the resource will be in the form `{lab account}/{lab name}/default`.  If the cost is associated with a student lab VM, the resource will be in the form `{lab account}/{lab name}/default/{vm name}`.

In this example, adding the first and second rows (both start with "aaalab / dockerlab") will give you the total cost for the lab "dockerlab" in the "aaalab" lab account or lab plan.

:::image type="content" source="./media/cost-management-guide/cost-analysis.png" alt-text="Screenshot that shows an example cost analysis for a subscription for Azure Lab Services associated costs." lightbox="./media/cost-management-guide/cost-analysis.png":::

If you're using [lab plans](concept-lab-accounts-versus-lab-plans.md), the entries are formatted differently.  The **Resource** column will show entries in the form `{lab name}/{number}` for Azure Lab Services. Some tags are added automatically to each entry when using lab plans.

| Tag name | Value |
| -------- | ----- |
| ms-istemplate | Set to true if cost associated with a template VM in a lab.  Set to false, otherwise. |
| ms-labname | Name of the lab. |
| ms-labplanid | Full resource ID of the lab plan used when creating the lab. |

:::image type="content" source="./media/cost-management-guide/cost-analysis-2.png" alt-text="Screenshot that shows an example cost analysis for a subscription using lab plans for Azure Lab Services associated costs." lightbox="./media/cost-management-guide/cost-analysis-2.png":::

To get the cost for the entire lab, don't forget to include external resources.  Azure Compute Gallery related charges are under the `Microsoft.Compute` namespace.  The advanced networking charges are under the `Microsoft.Network` namespace.

> [!NOTE]
> A compute gallery and virtual network can be connected to multiple labs.

### Separate the costs

Since cost entries are tied to the lab account, some schools use the lab account and the resource group as ways to separate the classes. Each class has its own lab plan and resource group.

In the cost analysis pane, add a filter based on the resource group name for the class. Then, only the costs for that class will be visible. Grouping by resource group allows a clearer delineation between the classes when you're viewing the costs. You can use the [scheduled export](../cost-management-billing/costs/tutorial-export-acm-data.md) feature of the cost analysis to download the costs of each class in separate files.

With [lab plans](concept-lab-accounts-versus-lab-plans.md):

- Cost entries are tied to a lab VM, *not* the lab plan.  
- Cost entries get tagged with the name of the lab the VM is tied to. You can filter by the lab name tag to view total cost across VM in that lab.
- Cost entries get tagged with the ID of the lab plan when creating the lab. You can filter by the lab plan tag to view total cost across labs created from a lab plan.
- You can set custom tags on labs or resource groups containing the labs to organize and analyze cost.

## Manage costs

Depending on the type of class, there are ways to manage costs to reduce instances of VMs that are running without a student using them.

### Automatic shutdown settings for cost control

Anytime a machine is **Running**, costs are being incurred, even if no one is connected to the VM.  You can enable several auto-shutdown features to avoid extra costs when the VMs aren't being used.  The are three auto-shutdown policies available in Azure Lab Services.

- Disconnect idle virtual machines.
- Shut down virtual machines when students disconnect from the virtual machine.
- Shut down virtual machines when students don't connect a recently started virtual machine.

For more information, see [Configure automatic shutdown of VMs for a lab plan](how-to-configure-auto-shutdown-lab-plans.md). You can configure these settings at both the lab plan/lab account level and the lab level.

### Scheduled time and quota time

[Schedules](classroom-labs-concepts.md#schedule) and [Quota](classroom-labs-concepts.md#quota) are two ways of allowing access to the lab VMs.

In the schedule, you can add a stop-only event type that will stop all machines at a specific time. Some lab owners have set a stop-only event for every day at midnight to reduce the cost and quota usage. The downside to this type of event is that all VMs will be shut down, even if a student is using a VM.

### Other costs related to labs

Some costs aren't rolled into Lab Services but can be tied to a lab service. You can [connect a compute gallery](how-to-attach-detach-shared-image-gallery.md) to a lab, but it won't show under the Lab Services costs and does have costs. To help keep overall costs down, you should remove any unused images from the gallery because the images have associated storage costs.

Labs can have connections to other Azure resources through a virtual network is using [advanced networking](how-to-connect-vnet-injection.md). When a lab is removed, you should remove the virtual network and the other resources.

## Conclusion

Hopefully, the information in this article has given you a better understanding of the tools that can help you reduce usage costs.
