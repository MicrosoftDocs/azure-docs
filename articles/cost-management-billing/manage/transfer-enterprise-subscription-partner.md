---
title: Transfer an EA subscription to Cloud Solution Provider v2
description: This article helps you understand the things you consider before you transfer an Enterprise Agreement (EA) subscription to a Cloud Solution Provider (CSP) v2 (Azure plan).
author: bandersmsft
ms.reviewer: jatracey
tags: billing
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: conceptual
ms.date: 12/08/2020
ms.author: banders
ms.custom: 
---

# Transfer an EA subscription to CSP v2

This article helps you understand the things you consider before you transfer an Enterprise Agreement (EA) subscription to a CSP v2 (Azure plan). Overall, you should get familiar with the migration process documented at [Get billing ownership of Azure subscriptions to your MPA account](mpa-request-ownership.md). Then, assess or qualify the migration with the following questions.

*Does the customer have any Azure Reservations for any resources like VMs, Storage accounts, or Data Lakes?* When yes, such resources aren't transferred during the migration. They must be canceled and repurchased after they're migrated to CSP v2. Or, you can leave them in place and then purchase them under CSP when they expire to renew them. If you need assistance or additional information, you can create a CSP support request to help you make a decision.

*Does the customer have any subscriptions that they want to migrate that under the Dev/Test offer?* If so, they can be migrated. However, discounted Dev/Test pricing isn't kept when the subscription is migrated to CSP. The resources in the subscriptions are charged at the normal CSP price list rate. Essentially, they're converted to normal CSP v2 subscriptions with pay-as-you-go pricing.

Classic Azure Resources are supported in this type of migration.

Not all Marketplace products can be transferred. If the same Azure Marketplace product doesn't exist in the CSP marketplace, then the subscription can't be migrated from EA to CSP v2.

Existing Azure support plans or packages can't be used after subscriptions are migrated to CSP. Only the CSP can create support requests for the subscriptions after migration. Ensure that your existing support plans or packages are canceled if no longer needed.

Azure EA monetary commitment funds don't transfer to CSP and are lost after migration. To avoid losing funds, plan for your migration to take place _after_ the EA commitment is fully used.

If the customer is a large Azure consumer, their CSP migration may not be automatically permitted. You may need to contact with your Microsoft PDM (Partner Development Manager) and the customer's Microsoft Account Executive. Talking to them can help ensure that the migration to CSP is the best-suited for the customer. The approval can take weeks to complete.

### Do the migration

The migration process is a _no downtime_ migration, it's just a billing change on the Azure back end.

You can only migrate subscriptions between the same Azure AD tenant. If the customer has subscriptions linked to different Azure AD tenants on their EA, you must set up a separate CSP partner relationship for each of the Azure AD tenants (\*.onmicrosoft.com domains).

The customer must accept a new Microsoft Customer Agreement. It must be updated on each of their CSP customer records.

The subscription migrates as a single unit, not individual resources. The subscription ID doesn't change. When one resource doesn't support the migration, then the entire subscription won't migrate to CSP v2. If you have one resource that won't migrate, you can try to migrate it to a different subscription.

Create an Azure plan for the customer using the CSP portal *before* you do a migration from EA to CSP v2 for any customer subscriptions. For more information, see [Purchase the Azure plan for customers &amp; access the latest Azure services at pay-as-you-go rates](/partner-center/purchase-azure-plan).

### Required user permissions

For the CSP, you must have either the Global admin or Admin agent role in the Partner Center.

For the customer, you must you have:

- Global admin role for each Azure AD tenant
- Owner permission for each Azure subscription
- Enterprise Account Owner, for the enrollment where the subscriptions are held

The user account that the customer signs in with to complete their part of the migration from must be an account that's in same or native Azure AD tenant. It can't be a guest account invited to the tenant.

All your Azure RBAC permissions are preserved. Nothing changes during the migration process.

### After migration

After migration in the CSP perspective, you can't use Delegated Admin Access (DAP) to customer subscriptions. That's even though you can see them from a billing perspective in the CSP portal. It's intended, so you have to manually find the CSP Foreign Principal ID. Then apply it as Owner (Azure role) to each subscription. The action can only be done by a user who is the native Azure AD Tenant with Owner permissions. You also need to do the same action as a CSP to get any Partner Earned Credit (PEC) back for the customer's Azure Consumed Revenue (ACR).

### CSP foreign principal PowerShell script

After migration, you can use the following PowerShell script to help apply the CSP foreign principal permissions.

```azurepowershell-interactive
## Connect to Customer AAD Tenant - Change 'xxxx' to the Azure AD Tenant ID which the subscriptions are linked to:
Connect-AzAccount -TenantId xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

## Get CSP Foreign Principal ID - Change 'PARTNER NAME' to whatever your CSP Partner Name is:
Get-AZRoleAssignment | where DisplayName -like "Foreign Principal for 'PARTNER NAME'*" | fl DisplayName, ObjectID

## Example Command Output:
DisplayName : Foreign Principal for 'CSP PARTNER NAME' in Role 'TenantAdmins' (CUSTOMER NAME)
ObjectId    : xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

## Set CSP Foreign Principal With Permissions Over Required Subscriptions - Insert correct ObjectID of CSP Foreign Principal & Customer Subscription ID:
New-AZRoleAssignment -ObjectId '{ObjectId from previous step}' -RoleDefinitionName Owner -Scope /subscriptions/XXXXX
```

Repeat the preceding steps for each Azure subscription that you've migrated. The `ObjectID` isn't the same across Azure AD Tenants, it's different in each tenant.

## Next steps

- [Get billing ownership of Azure subscriptions to your MPA account](mpa-request-ownership.md).
