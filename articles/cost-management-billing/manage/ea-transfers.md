---
title: Transfer Azure Enterprise enrollment accounts and subscriptions
description: Describes how Azure Enterprise enrollment accounts and subscriptions are transferred.
author: bandersmsft
ms.reviewer: sapnakeshari
ms.service: cost-management-billing
ms.subservice: enterprise
ms.topic: conceptual
ms.date: 04/13/2023
ms.author: banders
ms.custom: contperf-fy21q1
---

# Transfer Azure Enterprise enrollment accounts and subscriptions

This article provides an overview of enterprise transfers.

## Transfer an enterprise account to a new enrollment

An account transfer moves an account owner from one enrollment to another. All related subscriptions under the account owner move to the target enrollment. Use an account transfer when you have multiple active enrollments and only want to move selected account owners.

This section is for informational purposes only. An enterprise administrator doesn't perform the transfer actions. A support request is needed to transfer an enterprise account to a new enrollment.

Keep the following points in mind when you transfer an enterprise account to a new enrollment:

- Only the accounts specified in the request are transferred. If all accounts are chosen, then they're all transferred.
- The source enrollment keeps its status as active or extended. You can continue using the enrollment until it expires.
- You can't change account ownership during a transfer. After the account transfer is complete, the current account owner can change account ownership in the EA portal. Keep in mind that an EA administrator can't change account ownership.

### Prerequisites

When you request an account transfer with a support request, provide the following information:

- The number of the target enrollment, account name, and account owner email of account to transfer
- The enrollment number and account to transfer for the source enrollment

Other points to keep in mind before an account transfer:

- Approval from a full EA Administrator, not a read-only EA administrator, is required for the target and source enrollment.
    - If you have only UPN (User Principal Name) entities configured as full EA administrators without access to e-mail, you must **either** create a temporary full EA administrator account in the EA portal **or** provide EA portal screenshot evidence of a user account associated with the UPN account.
- You should consider an enrollment transfer if an account transfer doesn't meet your requirements.
- Your account transfer moves all services and subscriptions related to the specific accounts.
- Your transferred account appears inactive under the source enrollment and appears active under the target enrollment when the transfer is complete.
- Your account shows the end date corresponding to the effective transfer date on the source enrollment. The same date is the start date on the target enrollment.
- Your account usage incurred before the effective transfer date remains under the source enrollment.

## Transfer old enrollment to a new enrollment

An enrollment transfer is considered when:

- A current enrollment's Prepayment term has come to an end.
- An enrollment is in expired/extended status and a new agreement is negotiated.
- You have multiple enrollments and want to combine all the accounts and billing under a single enrollment.

This section is for informational purposes only. An enterprise administrator doesn't perform the transfer actions. A support request is needed to transfer an enterprise enrollment to a new one, unless the enrollment qualifies for [Auto enrollment transfer](#auto-enrollment-transfer).

When you request to transfer an old enterprise enrollment to a new enrollment, the following actions occur:

- Usage transferred may take up to 72 hours to be reflected in the new enrollment.
- If department administrator (DA) or account owner (AO) view charges were enabled on the old transferred enrollment, they must be enabled on the new enrollment.
- If you're using API reports or Power BI, [generate a new API access key](enterprise-rest-apis.md#api-key-generation) under your new enrollment. For API use, the API access key is used for authentication to older enterprise APIs that are retiring. For more information about retiring APIs that use the API access key, see [Migrate from Azure Enterprise Reporting to Microsoft Cost Management APIs overview](../automate/migrate-ea-reporting-arm-apis-overview.md).
    - All APIs use either the old enrollment or the new one, not both, for reporting purposes. If you need reports from APIs for the old and new enrollments, you must create your own reports.
- All Azure services, subscriptions, accounts, departments, and the entire enrollment structure, including all EA department administrators, transfer to a new target enrollment.
- The enrollment status is set to `Transferred` for the old enrollment. The old enrollment that was transferred is available for historic usage reporting purposes only.
- You can't add roles or subscriptions to the old enrollment that was transferred. `Transferred` status prevents any new usage against the old enrollment.
- Any remaining Azure Prepayment balance in the agreement is lost, including future terms.
-    If the old enrollment that you're transferring from has any reservation purchases, the historic (past) reservation purchasing fee remains in the old source enrollment. All future purchasing fees transfer to the new enrollment. Additionally, all reservation benefits are transferred across for use in the new enrollment.
-    The historic marketplace one-time purchase fee and any monthly fixed fees already incurred on the old enrollment aren't transferred to the new enrollment. Consumption-based marketplace charges are transferred.

### Effective transfer date

The effective transfer day can be on or after the start date of the target enrollment. The effective transfer date is the date that you want to transfer the old source enrollment to the new one. The date can be backdated to the first date of the current month, but not before it. For example, if today’s date is January 25, 2023 the enrollment transfer can be backdated to January 1, 2023 but not before it.

Additionally, if individual subscriptions are deleted or transferred in the current month, then the deletion/transfer date becomes the new earliest possible effective transfer date.

The source enrollment usage is charged against Azure Prepayment or as overage. Usage that occurs after the effective transfer date is transferred to the new enrollment and charged.

### Prerequisites

When you request an enrollment transfer, provide the following information:

- For the source enrollment, the enrollment number.
- For the target enrollment, the enrollment number to transfer to.
- Choose an enrollment transfer effective date.
    - The date must be or after the start date of the new target enrollment.
    - If you have an overage invoice that was already issued, the date that you choose doesn’t affect usage.

Other points to keep in mind before an enrollment transfer:

- Approval from both target and source enrollment EA Administrators is required.
- If an enrollment transfer doesn't meet your requirements, consider an account transfer.
- The source enrollment status is updated to `Transferred` and is available for historic usage reporting purposes only.
- There's no downtime during an enrollment transfer.
- Usage may take up to 24 - 48 hours to be reflected in the target enrollment.
- Cost view settings for department administrators or account owners don't carry over.
  - If previously enabled, settings must be enabled for the target enrollment.
- Any API keys used in the source enrollment must be regenerated for the target enrollment.
- If the source and destination enrollments are on different cloud instances, the transfer fails. Support personnel can transfer only within the same cloud instance. Cloud instances are the global Azure cloud and individual national clouds. For more information about national clouds, see [National clouds](../../active-directory/develop/authentication-national-cloud.md).
- For reservations (reserved instances):
  - The enrollment or account transfer between different currencies affects monthly reservation purchases. The following image illustrates the effects.  
        :::image type="content" source="./media/ea-transfers/cross-currency-reservation-transfer-effects.png" alt-text="Diagram illustrating the effects  of cross currency reservation transfers." border="false" lightbox="./media/ea-transfers/cross-currency-reservation-transfer-effects.png":::
  - When there's is a currency change during or after an enrollment transfer, reservations paid for monthly are canceled for the source enrollment. Cancellation happens at the time of next monthly payment for an individual reservation. This cancellation is intentional and affects only the monthly reservation purchases.
  - You may have to repurchase the canceled monthly reservations from the source enrollment using the new enrollment in the local or new currency. If you repurchase a reservation, the purchase term (one or three years) is reset. The repurchase doesn't continue under the previous term.
- If there's a backdated enrollment transfer, any savings plan benefit is applicable from the transfer request submission date - not from the effective transfer date.


### Auto enrollment transfer

You might see that an enrollment has the **Transferred** state, even if you haven't submitted a support ticket to request an enrollment transfer. The **Transferred** state results from the auto enrollment transfer process. In order for the auto enrollment transfer to occur during the renewal phrase, there are a few items that must be included in the new agreement:

- Prior enrollment number (it must exist in EA portal)
- Expiration date of the prior enrollment number is one day before the effective start date of the new agreement
- The new agreement has an invoiced Azure Prepayment order that has a current date or it's backdated
- The new enrollment is created in the EA portal

If there's no missing usage data in the EA portal between the prior enrollment and the new enrollment, then you don't have to create a transfer support ticket.

### Prepayment isn't transferrable

Prepayment isn't transferrable between enrollments. Prepayment balances are tied contractually to the enrollment where it was ordered. Prepayment isn't transferred as part of the account or enrollment transfer process.

### No services affected for account and enrollment transfers

There's no downtime during an account or enrollment transfer. It can be completed on the same day of your request if all requisite information is provided.

## Transfer an Enterprise subscription to a Pay-As-You-Go subscription

To transfer an Enterprise subscription to an individual subscription with Pay-As-You-Go rates, you must create a new support request in the Azure Enterprise portal. To create a support request, select **+ New support request** in the **Help and Support** area.

## Change Azure subscription or account ownership

The Azure EA portal can transfer subscriptions from one account owner to another. For more information, see [Change Azure subscription or account ownership](ea-portal-administration.md#change-azure-subscription-or-account-ownership).

## Subscription transfer effects

When an Azure subscription is transferred to an account in the same Microsoft Entra tenant, then all users, groups, and service principals that had Azure role-based access control (RBAC) to manage resources keep their access. For more information, see [(Azure RBAC)](../../role-based-access-control/overview.md).

To view users with Azure RBAC access to the subscription:

1. Open **Subscriptions** in the Azure portal.
2. Select the subscription you want to view, and then select **Access control (IAM)**.
3. Select **Role assignments**. The role assignments page lists all users who have Azure RBAC access to the subscription.

If the subscription is transferred to an account in a different Microsoft Entra tenant, then all users, groups, and service principals that had an [Azure RBAC role](../../role-based-access-control/overview.md) to manage resources _lose_ their access. Although Azure RBAC access isn't present, access to the subscription might be available through security mechanisms, including:

- Management certificates that grant the user admin rights to subscription resources. For more information, see [Create and Upload a Management Certificate for Azure](../../cloud-services/cloud-services-certs-create.md).
- Access keys for services like Storage. For more information, see [Azure storage account overview](../../storage/common/storage-account-overview.md).
- Remote Access credentials for services like Azure Virtual Machines.

If the recipient needs to restrict, access to their Azure resources, they should consider updating any secrets associated with the service. Most resources can be updated by using the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. select **All resources** on the Hub menu.
3. Select the resource.
4. select **Settings** to view and update existing secrets on the resource page.

## Next steps

- If you need help with troubleshooting Azure EA portal issues, see [Troubleshoot Azure EA portal access](ea-portal-troubleshoot.md).
