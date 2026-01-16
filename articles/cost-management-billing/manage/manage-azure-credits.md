---
title: Manage a Microsoft Azure credit resource under a subscription
description: Learn how to manage your Azure credit resource, including moving it across resource groups or subscriptions.
author: benshy
ms.reviewer: benshy
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 08/18/2025
ms.author: benshy
#customer intent: As a Microsoft Customer Agreement billing owner, I want learn about managing a Azure credit so that I move the credit when needed.
service.tree.id: cf90d1aa-e8ca-47a9-a6d0-bc69c7db1d52
---


# Manage a Microsoft Azure credit resource under a subscription

When you accept Microsoft Azure credit under a Customer Agreement, the credit is assigned to a [subscription](../../cost-management-billing/manage/cloud-subscription.md) and resource group. The associated resource holds metadata such as status, credit amount, currency, start date, and end date. This information is accessible in the Azure portal.

>[!NOTE] 
>This article applies to Azure Credit Offer, Azure Prepayment, End Customer Investment Funds (ECIF), and Support credits accepted after ***August 2025***, credits accepted earlier are not listed as resources under a subscription.



## Move credit across resource groups or subscriptions 
You can move the credit resource to another resource group or subscription just like other Azure resources. This move only changes metadata and does not impact the credit. 

The new resource group or subscription must remain within the same billing profile as the original.

## To move a credit resource

Here are the high-level steps to move a credit resource. For more information on moving Azure resources, see [Move Azure resources to a new resource group or subscription](../../azure-resource-manager/management/move-resource-group-and-subscription.md).


### To move a credit resource to a new resource group
1.	In the [Azure portal](https://portal.azure.com/), type in **Credits** from global search.
2.	Select the **Credits** service.
3.	Select the specific credit resource you want to move.
4.	From the *Essentials* tab, select the ***move*** link next to Resource Group.
5.	The source resource group is set automatically. Specify the ***Target*** resource group and select ***Next***.
6.	Wait for the portal to validate resource move readiness.
7.	When validation completes successfully, select ***Next***.
8.	Click on the acknowledgment that you need to update tools and scripts for these resources. To start moving the resources, select ***Move***.
9.	After the move is complete, verify that the credit resource is in the new resource group. 

### To move a credit resource to a new subscription
1.	In the [Azure portal](https://portal.azure.com/), type in **Credits** from global search.
2.	Select the **Credits** service.
3.	Select the specific credit resource you want to move.
4.	From the *Essentials* tab, select the move link next to Subscription.
5.	The source subscription and resource group are set automatically. Specify the Target subscription and resource group, then select ***Next***.
6.	Wait for the portal to validate resource move readiness.
7.	When validation completes successfully, select ***Next***.
8.	Click on the acknowledgment that you need to update tools and scripts for these resources. To start moving the resources, select ***Move***.
9.	After the move is complete, verify that the credit resource is in the new subscription and resource group. 

When a credit is moved, the resource URI associated with it's updated to reflect the change.


## To view the credit resource URI

1.	In the [Azure portal](https://portal.azure.com/), search for **Credits**.
2.	Select the credit resource.
3.	On the *Overview* page, in the left navigation menu, expand *Settings*, and select *Properties*.
4.	The credit resource URI is the ID value.


## Rename a credit resource

The credit’s resource name is a part of its Uniform Resource Identifier (URI) and can't be changed. However, you can use [tags](../../azure-resource-manager/management/tag-resources.md) to help identify the credit resource based on a nomenclature relevant to your organization.


## Delete a credit resource 

A credit resource may only be deleted if its status is ***Failed***, ***Canceled***, or ***Expired***. Deletion of a credit resource is a permanent action and can't be undone.

If you attempt to delete an active credit resource, you receive an error notifying you that the credit resource can't be deleted in its current ***Succeeded*** state. 

Attempting to delete a resource group or subscription that contains an active credit resource will fail with a similar error. To mitigate, move the active credit resource to another resource group or subscription within the same billing profile before attempting deletion. 

For additional information on moving a credit resource, see section: [To move a credit resource](#to-move-a-credit-resource)


## Cancel a credit 

Contact your Microsoft account team if you have questions about canceling your credit.


## Grant user access to a credit resource

By default, the user account that accepted the credit proposal has owner access to the credit resource. You can grant access by adding other users to an Azure role. 

1.	In the [Azure portal](https://portal.azure.com/), search for **Credits**.
2.	Select the credit resource.
3.	On the left navigation menu, select ***Access control (IAM)***.
4.	From Access control (IAM), select ***Add*** and choose ***Add role assignment***. 
5.	From the ***Role*** tab, select the appropriate role.
6.	On the ***Members*** tab, another user.
7.	On the ***Review + assign*** tab, review the role assignment settings.
8.	Select ***Review + assign*** button to assign the role.

>[!NOTE] 
>Currently supported Azure built-in roles are Reader, Contributor, and Owner.

## Frequently asked questions
 - **Does having a credit resource object impact associated with a subscription impact how the credit behaves?** No, having a credit resource created on a subscription doesn’t change how the credit is applied or what the credit is applied to. The credit resource acts as a record of the credit awarded and gives you other metadata, such as the credit’s start and end dates and credit amount.

 - **Does the resource group’s location affect credit application?** No, the resource group stores metadata about the resources and doesn’t impact the credit. The credit resource is associated with a Billing Profile and automatically applied to applicable charges on the billing profile. 


## Next steps

For information on checking the credit balance, see: [Track Azure credit balance for a Microsoft Customer Agreement](../../cost-management-billing/manage/mca-check-azure-credits-balance.md).

## Related content
- [Track Azure credit balance for a Microsoft Customer Agreement](../../cost-management-billing/manage/mca-check-azure-credits-balance.md)
- [What is a cloud subscription](../../cost-management-billing/manage/cloud-subscription.md)
- [Move Azure resources to a new resource group or subscription](../../azure-resource-manager/management/move-resource-group-and-subscription.md)
