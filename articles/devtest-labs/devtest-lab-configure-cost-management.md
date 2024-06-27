---
title: Track costs associated with a lab in Azure DevTest Labs
description: Track the cost of your lab through Microsoft Cost Management with custom tags, tag inheritance, and filtered views.
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 06/03/2024
ms.custom: UpdateFrequency2

#customer intent: As a developer, I want to use Microsoft Cost Management to track and manage the costs associated with my DevTest Labs resources.
---

# Track costs associated with a lab in Azure DevTest Labs

This article provides information on how to track the cost of your lab through [Microsoft Cost Management](../cost-management-billing/cost-management-billing-overview.md) by applying tags to the lab to filter costs.

DevTest Labs can create extra resource groups for resources related to your lab. The number of resource groups created depends on the features used by the lab and their settings. Because of the extra resource groups, it's often not straightforward to get a view of the total costs for your lab just by looking at **Resource groups** in the Azure portal. To create a single view of costs per lab in the Azure portal, you can use resource group **Tags**. 

## Apply Cost Management for DevTest Labs

The process for using cost management for DevTest Labs involves four steps:

1. Create tags and enable tag inheritance in the Azure portal.
1. Apply the tags to your DevTest Labs resources.
1. Provide permissions to allow users to view their resource costs.
1. Use Microsoft Cost Management to view and filter costs for your DevTest Labs resources, based on your tags.

You might create tags to allow users to track billed charges by cost center, business unit, team project, and so on.

The details for these steps are described in the following sections. 

## Create tags and enable tag inheritance

When DevTest Labs creates [environments](devtest-lab-create-environment-from-arm.md), it places each environment in its own resource group. For billing purposes, you must enable tag inheritance to ensure the lab tag definitions flow down from the resource group to the resources. 

You can enable tag inheritance through billing properties or through Azure Policies. The billing properties method is the easiest and fastest to configure. However, it might affect billing reporting for other resources in the same subscription. 

The following articles describe how to create tags and enable tag inheritance:

- [Group and allocate costs by using tag inheritance](../cost-management-billing/costs/enable-tag-inheritance.md)
- [Use the "Inherit a tag from the resource group" Azure Policy](../azure-resource-manager/management/tag-policies.md)

If the lab is updated correctly by using the billing properties method, you see **Tag inheritance** is **Enabled**: 

:::image type="content" source="./media/devtest-lab-configure-cost-management/devtest-tag-inheritance.png" alt-text="Screenshot that shows Tag Inheritance is Enabled for cost management in the Azure portal." lightbox="./media/devtest-lab-configure-cost-management/devtest-tag-inheritance-large.png":::

## Apply tags to DevTest Labs

DevTest Labs automatically propagates tags applied at the lab level to resources created by the lab. For virtual machines, tags are applied to the billable resources. For environments, tags are applied to the resource group for the environment. To apply tags to your labs, follow the steps in [Add tags to a lab](devtest-lab-add-tag.md).

:::image type="content" source="./media/devtest-lab-configure-cost-management/devtest-tags.png" alt-text="Screenshot that shows tags added for a DevTest Labs resource in the Azure portal." lightbox="./media/devtest-lab-configure-cost-management/devtest-tags-large.png":::

> [!NOTE]
> After you apply a new tag to your lab, the tag is automatically applied to new lab resources when they're created. If you want to apply a new or updated tag to existing resources, you can use a script to propagate the tag correctly. Use the [Update-DevTestLabsTags script](https://github.com/Azure/azure-devtestlab/tree/master/samples/DevTestLabs/Scripts/UpdateDtlTags) located in the DevTest Labs GitHub repository.

## Provide permissions to view costs 

DevTest Labs users don't automatically have permission to view costs for their resources by using Cost Management. To add the permissions, follow the instructions in [enable users to view billing information](../cost-management-billing/costs/assign-access-acm-data.md#assign-billing-account-scope-access). Assign the _Billing Reader_ permission to users at the subscription level, if they don't already have permissions that include Billing Reader access.

For more information, see [Manage access to Azure billing - Microsoft Cost Management](../cost-management-billing/manage/manage-billing-access.md).

## View and filter costs

After DevTest Labs is configured to provide the lab-specific information for Microsoft Cost Management, you're ready to get started with [Cost Management reporting - Azure - Microsoft Cost Management](../cost-management-billing/costs/reporting-get-started.md). You can visualize the costs in the Azure portal, download cost reporting information, or use Power BI to visualize the costs. 

For a quick view of costs per lab, following these steps: 

1. In the [Azure portal](https://portal.azure.com), go to your lab, and select a resource group that has tags.

1. On the left menu, expand **Cost Management**, and select **Cost analysis**.

1. In the **Cost analysis** page, expand the **View** dropdown list, and select **Daily Costs**:

   :::image type="content" source="./media/devtest-lab-configure-cost-management/daily-costs.png" alt-text="Screenshot that shows how to view daily costs for resources in the Azure portal." lightbox="./media/devtest-lab-configure-cost-management/daily-costs-large.png":::

1. On the **Cost Analysis** page, expand the **Group By** filter, select **Tag**, and then select one of your applied tags:

   :::image type="content" source="./media/devtest-lab-configure-cost-management/group-by-tag.png" border="false" alt-text="Screenshot that shows how to change the Group by filter to show cost details based on applied tags.":::

   The updated view shows costs in the subscription grouped by the tag according to the lab  its resources. For more information, see the [documentation on group and filter options in Cost Management](../cost-management-billing/costs/group-filter.md).

## Related content

- [Use tags to organize your Azure resources and management hierarchy](/azure/azure-resource-manager/management/tag-resources)
- Review the [resource naming and tagging decision guide - Cost management and optimization](/azure/cloud-adoption-framework/ready/azure-best-practices/resource-naming-and-tagging-decision-guide)
- [Define DevTest Labs policies](devtest-lab-set-lab-policy.md)
