---
title: Manage a discount resource under a subscription
description: Learn how to manage your discount resource, including moving it across resource groups or subscriptions.
author: benshy
ms.reviewer: benshy
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 01/29/2025
ms.author: benshy
#customer intent: As a Microsoft Customer Agreement billing owner, I want learn about managing a discount so that I move the discount when needed.
service.tree.id: cf90d1aa-e8ca-47a9-a6d0-bc69c7db1d52
---

# Manage a discount resource under a subscription
Upon acceptance of a discount as part of a Microsoft Customer Agreement, the discount is allotted to a subscription and resource group. The resultant discount resource contains descriptive metadata including discount status, discount type, product family, discount percentage, start date, and end date. While the discount resource stores relevant metadata, it doesn't impact eligibility. Discounts are applicable to a billing account and apply automatically to eligible charges on any subscription within the billing account.  


<br>

> [!NOTE]
> This article applies to certain Azure and Microsoft 365 discounts accepted after **August 2025**. Discounts accepted earlier are not listed as resources under a subscription

<br>

## Move a discount across resource groups or subscriptions

You can move the discount resource between resource groups or subscriptions within the same billing account without affecting the discount, as only the metadata is updated.

### To move a discount resource

Here are the high-level steps to move a discount resource. For more information on moving Azure resources, see: [Move Azure resources to a new resource group or subscription](../../../azure-resource-manager/management/move-resource-group-and-subscription.md).


### To move a discount resource to a new resource group

1.	In the [Azure portal](https://portal.azure.com/), type in **Discounts** from global search.
2.	Select the **Discounts** service.
3.	Select the specific discount resource you want to move.
4.	From the ***Essentials*** tab, select the ***move*** link next to Resource group.
5.	The source resource group is set automatically. Specify the ***Target*** resource group and select ***Next***.
6.	Wait for the portal to validate resource move readiness.
7.	When validation completes successfully, select ***Next***.
8.	Select the acknowledgment that you need to update tools and scripts for these resources. To start moving the resources, select ***Move***
9.	After the move is complete, verify that the discount resource is in the new resource group. 

### To move a discount resource to a new subscription

1.	In the [Azure portal](https://portal.azure.com/), type in **Discounts** from global search.
2.	Select the **Discounts** service.
3.	Select the specific discount resource you want to move.
4.	From the ***Essentials*** tab, select the ***move*** link next to Subscription.
5.	The source subscription and resource group are set automatically. Specify the ***Target*** subscription and resource group, then select ***Next***.
6.	Wait for the portal to validate resource move readiness.
7.	When validation completes successfully, select ***Next***.
8.	Select the acknowledgment that you need to update tools and scripts for these resources. To start moving the resources, select ***Move***.
9.	After the move is complete, verify that the discount resource is in the new subscription and resource group. 

When a discount is moved, the resource URI associated with it's updated to reflect the change.


## To view the discount resource URI
1.	In the [Azure portal](https://portal.azure.com/), search for **Discounts**.
2.	Select the discount resource.
3.	On the Overview page, in the left navigation menu, expand **Settings**, and select **Properties**.
4.	The discount resource URI is the **ID** value.

## View the additional discount metadata

Additional detailed information regarding the available discount is accessible by viewing the JSON representation of the discount resource. This allows you to examine all relevant fields, such as discount values, eligibility criteria, validity periods, and other pertinent attributes connected to the discount. 

To see the additional discount metadata 

1.	In the [Azure portal](https://portal.azure.com/), search for **Discounts**.
2.	Select the discount resource.
3.	From Overview page, on the ***Essentials*** tab, select **JSON View**.


## Rename a discount resource
The discount’s resource name is a part of its Uniform Resource Identifier (URI) and can't be changed. However, you can use [tags](../../../azure-resource-manager/management/tag-resources.md) to help identify the credit resource based on a nomenclature relevant to your organization.


## Delete a discount resource 
You can only delete a discount resource if its status is in the ***Failed***, ***Canceled***, or ***Expired*** states. Deletion is permanent and can't be reversed.
If you try to delete an active discount resource in an ***Active*** state, an error notifies you that deletion is not allowed.

Deleting a resource group or subscription with an active discount resource will fail. To resolve, move the discount resource to another group or subscription within the same billing account before deleting.

For additional information on moving a discount resource, see section: [To move a discount resource](#to-move-a-discount-resource).


## Cancel a discount 
Contact your Microsoft account team if you have questions about canceling your discount.


## Grant user access to a discount resource
The user who accepted the discount proposal automatically gets owner access to the discount resource. To add other users, assign them an Azure role.

1.	In the [Azure portal](https://portal.azure.com/), search for **Discounts**
2.	Select the discount resource.
3.	On the left navigation menu, select ***Access control (IAM)***.
4.	From ***Access control (IAM)***, select ***Add*** and choose ***Add role assignment***.
5.	From the **Role** tab, select the appropriate role.
6.	On the **Members** tab, add other users.
7.	On the ***Review + assign*** tab, review the role assignment settings.
8.	Select ***Review + assign*** button to assign the role.

<br>

>[!NOTE]
>Currently supported Azure built-in roles are Reader, Contributor, and Owner. 
<br>

## Frequently asked questions
- **How do I verify discount is being applied?** For Azure based discounts, you can verify the discount is appropriately applied by following the instructions outlined in the [Calculate discount in the usage file](../../understand/download-azure-daily-usage.md#calculate-discount-in-the-usage-file) article.

- **Does attaching a discount resource to a subscription alter its behavior?** Creating a discount resource object on a subscription doesn't affect how or to what the discount applies. It simply records the discount and provides metadata like start/end dates and discount percentage, etc.

 - **Does the resource group’s location affect discount application?** The resource group maintains metadata regarding the resources and doesn't influence discount eligibility. Discounts are linked to a billing account and are automatically applied to qualifying charges for any subscription within that billing account.
   
 - **Are discounts with a status of Expired or Canceled automatically deleted?** No, discounts marked as Expired or Canceled are not deleted automatically; they must be removed manually. These records are kept intentionally for analysis of past cost or pricing changes.  

<br>

## Related content
 - [Calculate discount in the usage file](../../understand/download-azure-daily-usage.md#calculate-discount-in-the-usage-file)
 - [Understand Cost Management data](../../../cost-management-billing/costs/understand-cost-mgt-data.md)
 - [View and download your organization's Azure pricing](../../../cost-management-billing/manage/ea-pricing.md)
 - [Terms in your Microsoft Customer Agreement price sheet](../../../cost-management-billing/manage/mca-understand-pricesheet.md)
 - [What is a cloud subscription](../../../cost-management-billing/manage/cloud-subscription.md)
 - [Move Azure resources to a new resource group or subscription](../../../azure-resource-manager/management/move-resource-group-and-subscription.md)
