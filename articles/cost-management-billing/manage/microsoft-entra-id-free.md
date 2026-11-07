---
title: Microsoft Entra ID Free
description: Learn about Microsoft Entra ID Free, a cloud-based identity management product included with your billing account, and how it helps manage your subscriptions.
author: KennyDay
ms.reviewer: zainzaigham
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: concept-article
ms.date: 10/05/2026
ms.author: zainzaigham
ms.custom:
- build-2025
---

# Microsoft Entra ID Free

Microsoft Entra ID Free is a no-charge billing record that represents the legal ownership of your [Microsoft Entra tenant](https://learn.microsoft.com/entra/fundamentals/whatis). It connects the tenant to the billing account that owns it and makes that relationship visible in Microsoft billing experiences.

## What Microsoft Entra ID Free represents

Your Microsoft Entra tenant is the directory where you manage identities, applications, access, and tenant settings. Microsoft Entra ID Free is the billing record that represents the tenant's legal ownership in Microsoft systems.

The billing record:

- Identifies a specific Microsoft Entra tenant in Microsoft billing systems.
- Associates the tenant with the billing account that owns it.

Microsoft Entra ID Free doesn't replace or change the tenant. The tenant ID, users, groups, applications, and settings remain part of the Microsoft Entra directory.

> [!NOTE]
> Not all existing Microsoft Entra tenants have a Microsoft Entra ID Free billing record yet. Microsoft is adding these records to eligible tenants in phases. Customers are notified when this process begins for their tenants, and no action is required before then.

## How it appears under your billing account and tenant

For a [Microsoft Customer Agreement](https://learn.microsoft.com/azure/cost-management-billing/understand/mca-overview), the Microsoft Entra ID Free billing record appears in the billing hierarchy:

| Billing hierarchy level | Relationship |
|---|---|
| [**Billing account**](https://learn.microsoft.com/azure/cost-management-billing/understand/mca-overview#your-billing-account) | Represents the commercial relationship with Microsoft and the organization that owns the tenant. |
| [**Billing profile**](https://learn.microsoft.com/azure/cost-management-billing/understand/mca-overview#billing-profiles) | Exists within the billing account and manages invoice and payment information. |
| [**Invoice section**](https://learn.microsoft.com/azure/cost-management-billing/understand/mca-overview#invoice-sections) | Exists within the billing profile and organizes products and subscriptions. |
| **Microsoft Entra ID Free** | Exists within the invoice section and represents the tenant's legal ownership. |

> [!NOTE]
> The Microsoft Entra tenant isn't another level in the billing hierarchy. It's a separate directory that contains the organization's identities, applications, access configuration, and directory settings. The Microsoft Entra ID Free billing record represents the tenant's legal ownership; it doesn't contain or move the directory.

## Where to find Microsoft Entra ID Free

You can find Microsoft Entra ID Free in the following admin experiences:

| Admin experience | Location |
|---|---|
| Azure portal | **Cost Management + Billing** > **Products + services** > **All billing subscriptions** |
| Microsoft 365 admin center | **Billing** > **Your products** |

If your billing account is associated with multiple Microsoft Entra tenants, each Microsoft Entra ID Free billing record represents the legal ownership of its associated tenant.

## Charges and billing impact

Microsoft Entra ID Free has no product charges. Its appearance in a billing account or list of billing subscriptions doesn't mean that the tenant is generating usage charges.

Microsoft automatically adds the billing record to an applicable billing account. No action is required to activate it, and it remains active while the billing account remains active.

Other Azure services, Microsoft Entra licenses, or Microsoft products purchased separately can generate charges. Those charges aren't caused by the Microsoft Entra ID Free billing record.

## How tenant lifecycle changes affect the billing record

The Microsoft Entra tenant and its Microsoft Entra ID Free billing record are separate objects. Creating, deleting, or transferring a tenant can affect the billing record associated with it.

### Tenant creation

When you create an eligible Microsoft Entra tenant, Microsoft automatically creates a Microsoft Entra ID Free billing record and associates it with the applicable billing account. No action is required.

Not all existing tenants have this billing record yet. Microsoft is adding records to eligible existing tenants in phases and will notify affected customers.

To create a tenant, see [Quickstart: Access and create a new tenant](https://learn.microsoft.com/entra/fundamentals/create-new-tenant?tabs=workforce).

### Tenant deletion

Deleting or canceling the Microsoft Entra ID Free billing record isn't the way to delete a Microsoft Entra tenant. To delete a tenant, follow the Microsoft Entra tenant-deletion process.

After you delete a tenant, its billing record might remain visible temporarily while Microsoft billing systems process the change.

For instructions, see [Delete a Microsoft Entra tenant](https://learn.microsoft.com/entra/identity/users/directory-delete-howto).

### Tenant transfer

Transferring a tenant's legal ownership changes the billing account associated with its Microsoft Entra ID Free billing record. It doesn't move or recreate the Microsoft Entra directory.

The tenant ID and directory contents remain unchanged. Users, groups, domains, applications, authentication settings, Microsoft Entra roles, [Azure role-based access control assignments](https://learn.microsoft.com/azure/role-based-access-control/overview), service data, and tenant configuration aren't affected.

> [!IMPORTANT]
> A tenant ownership transfer is a billing operation, not a directory migration. Review the transfer scope before you accept the request.

#### When to transfer a tenant

Transfer a tenant when the billing account that represents its legal ownership must change. Common scenarios include:

- A merger or acquisition in which the acquiring organization assumes ownership.
- A divestiture or business separation in which a new organization assumes ownership.
- An organizational restructuring that changes the responsible legal entity.
- Consolidation under the billing account of the organization that now owns the tenant.
- Correction of a tenant associated with the wrong billing account.

#### Choose a transfer scope

Choose the scope that matches your business transaction.

| Transfer scope | What moves | What remains unchanged | Use this option when |
|---|---|---|---|
| Microsoft Entra tenant only | The tenant's billing record moves to the destination billing account. | The Microsoft Entra directory and any associated Azure subscription remain in place. | Legal ownership must change without transferring an Azure subscription. |
| Entire Azure subscription | The subscription, its resources, and its billing ownership move to the destination billing account. | The Microsoft Entra directory contents remain unchanged. | The subscription and all its resources must move together. |
| Combined transfer | The tenant billing record and Azure subscription are both included in one request. | The Microsoft Entra directory contents remain unchanged. | Both items must be included in the same business transaction. |

#### Prerequisites

Before creating a transfer request, confirm the following conditions.

The transfer requester must:

- Have a billing account for a Microsoft Customer Agreement. To identify your billing account type, see [Check for access to a Microsoft Customer Agreement](https://learn.microsoft.com/azure/cost-management-billing/manage/mca-request-billing-ownership#check-for-access).
- Have an owner or contributor role for the destination billing account or the relevant billing profile or invoice section. For more information, see [Billing roles and tasks](https://learn.microsoft.com/azure/cost-management-billing/manage/understand-mca-roles#invoice-section-roles-and-tasks).

The transfer recipient must:

- Be the recipient named in the transfer request.
- Be able to review and accept the request.
- Confirm that organizational policies permit transfers out of the tenant.

The tenant must:

- Have a billing subscription named **Microsoft Entra ID Free** that represents its legal ownership. A tenant without this billing record isn't eligible for transfer.
- Exist in the same Azure cloud as the destination billing account. Cross-cloud tenant transfers aren't supported.

#### Create the transfer request

The transfer requester starts the transfer by using the process for requesting billing ownership of Azure products under a Microsoft Customer Agreement:

1. Follow the steps in [Create the product transfer request](https://learn.microsoft.com/azure/cost-management-billing/manage/mca-request-billing-ownership#create-the-product-transfer-request).
2. Select the destination billing account, billing profile, and invoice section.
3. Send the request to the transfer recipient.

The request remains pending until the transfer recipient responds. It expires after 15 days if it isn't completed.

#### Review and approve the transfer

The transfer recipient uses the standard Microsoft Customer Agreement process to review the request:

1. Open the transfer request.
2. On the transfer page, select the **Entra Tenants** tab.
3. Select the Microsoft Entra tenants to transfer.
4. Select the **Review request** tab and verify the selected products.
5. Resolve any warnings or failed validation messages, and then complete the transfer.

Only tenants with a **Microsoft Entra ID Free** billing record are available for selection. For the complete workflow, see [Review and approve the transfer request](https://learn.microsoft.com/azure/cost-management-billing/manage/mca-request-billing-ownership#review-and-approve-transfer-request).

#### Check the transfer status

After the transfer recipient approves the request, use the standard transfer experience to monitor it. For instructions and status definitions, see [Check the transfer request status](https://learn.microsoft.com/azure/cost-management-billing/manage/mca-request-billing-ownership#check-the-transfer-request-status).

If the request contains multiple products, review the transfer details to confirm the result for each selected Microsoft Entra tenant.

#### Verify the transfer

After the transfer completes:

1. Confirm that the request status is **Completed**.
2. Confirm that the Microsoft Entra ID Free billing record appears under the destination billing account, billing profile, and invoice section.
3. Confirm that the Microsoft Entra tenant ID and directory configuration are unchanged.
4. If the transaction also included an Azure subscription, confirm its billing ownership and resources separately.

For a tenant-only transfer, any associated Azure subscription and its resources remain under their existing billing account.

#### Troubleshoot a transfer

If validation or processing fails, confirm that:

- The destination billing account, billing profile, and invoice section are active.
- The transfer recipient opened the request with the intended identity.
- The tenant has a **Microsoft Entra ID Free** billing record.
- Source and destination transfer policies allow the operation.
- The source and destination are in the same Azure cloud.
- The request hasn't expired.

For general transfer warnings and failed validation messages, see [Review and approve the transfer request](https://learn.microsoft.com/azure/cost-management-billing/manage/mca-request-billing-ownership#review-and-approve-transfer-request).
