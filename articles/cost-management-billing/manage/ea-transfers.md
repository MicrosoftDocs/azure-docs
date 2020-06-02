---
title: Azure Enterprise transfers
description: Describes Azure EA transfers
author: bandersmsft
ms.reviewer: baolcsva
ms.service: cost-management-billing
ms.topic: conceptual
ms.date: 06/01/2020
ms.author: banders

---

# Azure Enterprise transfers

This article provides an overview of enterprise transfers.

## Transfer an enterprise account to a new enrollment

An account transfer moves an account owner from one enrollment to another. All related subscriptions under the account owner will move to the target enrollment. Use an account transfer when you have multiple active enrollments and only want to move selected account owners.

This section is for informational purposes only as the action cannot be performed by an enterprise administrator. A support request is needed to transfer an enterprise account to a new enrollment.

Keep the following points in mind when you transfer an enterprise account to a new enrollment:

- Only the accounts specified in the request are transferred. If all accounts are chosen, then they're all transferred.
- The source enrollment keeps its status as active or extended. You can continue using the enrollment until it expires.

### Prerequisites

When you request an account transfer, provide the following information:

- The number of the target enrollment, account name, and account owner email of account to transfer
- For the source enrollment, the enrollment number and account to transfer

Other points to keep in mind before an account transfer:

- Approval from an EA Administrator is required for the target and source enrollment
- If an account transfer doesn't meet your requirements, consider an enrollment transfer.
- The account transfer transfers all services and subscriptions related to the specific accounts.
- After the transfer is complete, the transferred account appears inactive under the source enrollment and appears active under the target enrollment.
- The account shows the end date corresponding to the effective transfer date on the source enrollment and as a start date on the target enrollment.
- Any usage occurred for the account before the effective transfer date remains under the source enrollment.

## Transfer enterprise enrollment to a new one

An enrollment transfer is considered when:

- A current enrollment's commitment term has come to an end.
- An enrollment is in expired/extended status and a new agreement is negotiated.
- You have multiple enrollments and want to combine all the accounts and billing under a single enrollment.

This section is for informational purposes only as the action cannot be performed by an enterprise administrator. A support request is needed to transfer an enterprise enrollment to a new one.

When you request to transfer an entire enterprise enrollment to an enrollment, the following actions occur:

- All Azure services, subscriptions, accounts, departments, and the entire enrollment structure, including all EA department administrators, transfer to a new target enrollment.
- The enrollment status is set to _Transferred_. The transferred enrollment is available for historic usage reporting purposes only.
- You can't add roles or subscriptions to a transferred enrollment. Transferred status prevents additional usage against the enrollment.
- Any remaining monetary commitment balance in the agreement is lost, including future terms.
-    If the enrollment you're transferring from has RI purchases, the RI purchasing fee will remain in the source enrollment however all RI benefits will be transferred across for utilization in the new enrollment.
-    The marketplace one-time purchase fee and any monthly fixed fees already incurred on the old enrollment will not be transferred to the new enrollment. Consumption-based marketplace charges will be transferred.

### Effective transfer date

The effective transfer day can be on or after the start date of the target enrollment.

The source enrollment usage is charged against monetary commitment or as overage. Usage that occurs after the effective transfer date is transferred to the new enrollment and charged accordingly.

### Prerequisites

When you request an enrollment transfer, provide the following information:

- For the source enrollment, the enrollment number.
- For the target enrollment, the enrollment number to transfer to.
- For the enrollment transfer effective date, it can be a date on or after the start date of the target enrollment. The chosen date can't impact usage for any overage invoice already issued.

Other points to keep in mind before an enrollment transfer:

- Approval from both target and source enrollment EA Administrators is required.
- If an enrollment transfer doesn't meet your requirements, consider an account transfer.
- The source enrollment status will be updated to transferred and will only be available for historic usage reporting purposes.

### Monetary commitment

Monetary commitment isn't transferrable between enrollments. Monetary commitment balances are tied contractually to the enrollment where it was ordered. Monetary commitment isn't transferred as part of the account or enrollment transfer process.

### No services affected for account and enrollment transfers

There's no downtime during an account or enrollment transfer. It can be completed on the same day of your request if all requisite information is provided.

## Change account owner

The Azure EA portal can transfer subscriptions from one account owner to another. For more information, see [Change account owner](ea-portal-get-started.md#change-account-owner).

## Subscription transfer effects

When an Azure subscription is transferred to an account in the same Azure Active Directory tenant, then all users, groups, and service principals that had [role-based access control (RBAC)](../../role-based-access-control/overview.md) to manage resources keep their access.

To view users with RBAC access to the subscription:

1. In the Azure portal, open **Subscriptions**.
2. Select the subscription you want to view, and then select **Access control (IAM)**.
3. Select **Role assignments**. The role assignments page lists all users who have RBAC access to the subscription.

If the subscription is transferred to an account in a different Azure AD tenant, then all users, groups, and service principals that had [RBAC](../../role-based-access-control/overview.md) to manage resources _lose_ their access. Although RBAC access isn't present, access to the subscription might be available through security mechanisms, including:

- Management certificates that grant the user admin rights to subscription resources. For more information, see [Create and Upload a Management Certificate for Azure](../../cloud-services/cloud-services-certs-create.md).
- Access keys for services like Storage. For more information, see [Azure storage account overview](../../storage/common/storage-account-overview.md).
- Remote Access credentials for services like Azure Virtual Machines.

If the recipient needs to restrict,  access to their Azure resources, they should consider updating any secrets associated with the service. Most resources can be updated by using the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. On the Hub menu, select **All resources**.
3. Select the resource.
4. On the resource page, select **Settings** to view and update existing secrets.

## Next steps

- If you need help with troubleshooting Azure EA portal issues, see [Troubleshoot Azure EA portal access](ea-portal-troubleshoot.md).