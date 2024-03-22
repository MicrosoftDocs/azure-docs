---
title: Transfer subscriptions under an Azure plan from one partner to another
description: This article helps you understand what you need to know before and after you transfer billing ownership of your Azure subscription.
author: bandersmsft
ms.reviewer: mcville
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: conceptual
ms.date: 03/21/2024
ms.author: banders
---

# Transfer subscriptions under an Azure plan from one partner to another

This article helps customers of Microsoft partners to understand what they need to know before and after transferring billing ownership of an Azure subscription. To start an Azure subscription transfer that's under an Azure plan from one Microsoft partner to another, you need to contact your partner. The partner will send you instructions about how to begin. After the transfer process is complete, the billing ownership of your subscription is changed.

The steps that a partner takes are documented at [Transfer a customer's Azure subscriptions and/or Reservations (under an Azure plan) to a different CSP](/partner-center/transfer-azure-subscriptions-under-azure-plan).

[!INCLUDE [cost-management-billing-subscription-b2b-b2c-transfer-note](../../../includes/cost-management-billing-subscription-b2b-b2c-transfer-note.md)]

## User access

Access to existing users, groups, or service principals that were assigned using Azure role-based access control (Azure RBAC) isn't affected during the transition. [Azure RBAC](../../role-based-access-control/overview.md) helps you manage who has access to Azure resources, what they can do with those resources, and what areas they have access to. Your new partner isn't given any Azure RBAC access to your resources by the subscription transfer. Your previous partner keeps their Azure RBAC access.

Consequently, it's important that you remove Azure RBAC access for the old partner and add access for the new partner. For more information about giving your new partner access, see [What is Azure role-based access control (Azure RBAC)?](../../role-based-access-control/overview.md) For more information about removing your previous partner's Azure RBAC access, see [Remove Azure role assignments](../../role-based-access-control/role-assignments-remove.md).

Additionally, your new partner doesn't automatically get Admin on Behalf Of (AOBO) access to your subscriptions. AOBO is necessary for your partner to manage the Azure subscriptions on your behalf. For more information about Azure privileges, see [Obtain permissions to manage a customer's service or subscription](/partner-center/customers-revoke-admin-privileges).

## Stop a transfer

After you receive confirmation that a transfer request was submitted, you can use one of the following options **if you don't want the transfer to continue**.

- If the request hasn't yet been accepted by your current partner, you can ask your new partner to cancel the transfer request that they started (when the status is pending).
- Ask the current partner to take no action when they receive the transfer request. Without your current partner's consent, the transfer can't continue. The request will expire.
- You can _remove your reseller relationship_ with the new partner. This action removes the ability for your subscription to move. It effectively cancels the request.

You can also seek help, report misconduct, or suspicious activity using any of the options at the [Microsoft Legal](https://www.microsoft.com/legal/) web site. The option to report a concern is under Compliance & ethics.

## Next steps

- To give your new partner Azure RBAC access, see [What is Azure role-based access control (Azure RBAC)?](../../role-based-access-control/overview.md)
- [Obtain permissions to manage a customers service or subscription](/partner-center/customers-revoke-admin-privileges).