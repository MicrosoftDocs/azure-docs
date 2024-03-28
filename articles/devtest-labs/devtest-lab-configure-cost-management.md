---
title: Track costs associated with a lab in Azure DevTest Labs
description: This article provides information on how to track the cost of your lab through Azure Cost Management.
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 03/28/2024
ms.custom: UpdateFrequency2
---

# Track costs associated with a lab in Azure DevTest Labs
This article provides information on how to track the cost of your lab through [Azure Cost Management](../cost-management-billing/cost-management-billing-overview.md) by applying tags to the lab to filter costs. DevTest Labs may create more resource groups for resources related to the lab (depending on the features used and the settings of the lab). For this reason, it’s often not straightforward to get a view of the total costs for a lab just by looking at Resource Groups. To create a single view of costs per lab, tags are used. 

## Steps to Leverage Cost Management for DevTest Labs

These are the steps needed to use cost management for DevTest Labs. More details are captured in the following sections. 
1. Enable tag inheritance for costs.
1. Apply tags to the DevTest Labs (cost center, business unit, etc.).
1. Provide permissions to allow users to view costs.
1. Use Azure Cost Management for viewing/filtering costs for DevTest Labs, based on the tags.

## Step 1: Enable Tag Inheritance for Tags on Resource Groups 

When DevTest Labs creates [environments](devtest-lab-create-environment-from-arm.md), they are each placed in their own resource group. For billing purposes, you must enable tag inheritance to ensure that the lab tags flow down from the resource group to the resources. 

You can enable tag inheritance through billing properties or through Azure Policies. The billing properties method is the easiest and fastest to configure. However, it might affect billing reporting for other resources in the same subscription. 

- [Group and allocate costs using tag inheritance](../cost-management-billing/costs/enable-tag-inheritance.md)
- [Use the "Inherit a tag from the resource group" Azure Policy](../azure-resource-manager/management/tag-policies.md)

If updated correctly using the billing properties method, you see that Tag Inheritance now shows **Enabled**: 

:::image type="content" source="./media/devtest-lab-configure-cost-management/tag-inheritance.png" alt-text="Screenshot that shows Tag Inheritance is enabled.":::

## Step 2: Apply Tags to DevTest Labs

DevTest Labs automatically propagates tags applied at the lab level to the resources that are created by the lab. This includes virtual machines (tags are applied to the billable resources) and environments (tags are applied to the resource group for the environment). Follow the steps in this article to apply tags to your labs: [Add tags to a lab](devtest-lab-add-tag.md).

:::image type="content" source="./media/devtest-lab-configure-cost-management/devtest-tags.png" alt-text="Screenshot that shows tags in DevTest Labs in the Azure portal.":::

> [!NOTE]
> It’s important to remember that tags are propagated for any resources created _after_ the tag has been applied to the lab. If there are _existing resources_ that must be updated with the new tags, there's a script available to propagate the new/updated tags correctly. If you have existing resources and want to apply the lab tags, use the [Update-DevTestLabsTags script located in the DevTest Labs GitHub Repo](https://github.com/Azure/azure-devtestlab/tree/master/samples/DevTestLabs/Scripts/UpdateDtlTags). 

## Step 3: Provide permissions to allow users to view costs 

DevTest Labs users don’t automatically have permission to view costs for their resources via Cost Management. There's one more step to [enable users to view billing information](../cost-management-billing/costs/assign-access-acm-data.md#assign-billing-account-scope-access). Assign the _Billing Reader_ permission to users at the subscription level, if they don’t already have permissions that include Billing Reader access. More information is found here on managing access to billing information: [Manage access to Azure billing - Microsoft Cost Management.](../cost-management-billing/manage/manage-billing-access.md)

## Step 4: Use Azure Cost Management for viewing and filtering costs for DevTest Labs 

Now that DevTest Labs is configured to provide the lab-specific information for Cost Management, start here on Cost Management Reporting to view costs: Get started with [Cost Management reporting - Azure - Microsoft Cost Management](../cost-management-billing/costs/reporting-get-started.md). You can visualize the costs in the Azure portal, download cost reporting information, or use Power BI to visualize the costs. 

For a quick view of costs per lab, see the following steps: 

1. Select **Cost Management** and then on **Cost analysis**
2. Select **Daily Costs**

:::image type="content" source="./media/devtest-lab-configure-cost-management/daily-costs.png" alt-text="Screenshot that shows the daily costs card.":::

3. On the **Custom: Cost Analysis** page, select the **Group By** filter, choose **Tag** and then the Tag Name (like "CostCenter") to group by. Refer to the [documentation on group and filter options in Cost Management](../cost-management-billing/costs/group-filter.md) for more details.

The resulting view shows costs in the subscription grouped by the tag (which is grouping by the lab & its resources).

## Related content

- [Define lab policies](devtest-lab-set-lab-policy.md). Learn how to set the various policies used to govern how your lab and its virtual machines (VMs) are used. 
- [Create custom image](devtest-lab-create-template.md). When you create a virtual machine (VM), you specify a base. The base can be either a custom image or a Marketplace image. This article describes how to create a custom image from a virtual hard disk (VHD) file. 
- [Configure Marketplace images](devtest-lab-configure-marketplace-images.md). DevTest Labs supports creating VMs based on Azure Marketplace images. This article illustrates how to specify Azure Marketplace images you can use when creating VMs in a lab. 
- [Create a VM in a lab](devtest-lab-add-vm.md). This article illustrates how to create a VM from a custom or Marketplace base image, and work with artifacts in the VM. 
