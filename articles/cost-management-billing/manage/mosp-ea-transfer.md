---
title: Transfer an Azure subscription to an Enterprise Agreement
description: This article helps you understand the steps to transfer a Microsoft Customer Agreement subscription or MOSP subscription to an Enterprise Agreement.
author: bandersmsft
ms.reviewer: sgautam
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 03/21/2024
ms.author: banders
ms.custom:
---

# Transfer an Azure subscription to an Enterprise Agreement (EA)

This article helps you understand the steps needed to transfer an individual Microsoft Online Service Program (MOSP) subscription (Azure offer MS-AZR-003P pay-as-you-go) to an EA. The transfer has no downtime, however there are many steps to follow to enable the transfer.

[!INCLUDE [cost-management-billing-subscription-b2b-b2c-transfer-note](../../../includes/cost-management-billing-subscription-b2b-b2c-transfer-note.md)]

If you want to transfer a different subscription type to EA, see [Azure subscription and reservation transfer hub](subscription-transfer.md) for supported transfer options.

> [!NOTE]
> The transfer process doesn't change Microsoft Entra Directory information that the subscriptions are linked to. If you want to make a Microsoft Entra Directory change, see [Transfer an Azure subscription to a different Microsoft Entra directory](../../role-based-access-control/transfer-subscription.md).

## Prerequisites

The following sections help you identify your subscription account admin, required access to the destination EA, and set the EA authentication level.

### Identify the subscription account admin

Identify the subscription account admin by signing in to the Azure portal with an account that has at least the Azure RBAC reader role for the subscription. Then navigate to **Subscriptions** > Select the subscription > **Properties**. The subscription **Account Admin** is shown. Make a note of the user information.

:::image type="content" source="./media/mosp-ea-transfer/subscription-account-admin.png" alt-text="Screenshot showing subscription properties where you can view the Account Admin." lightbox="./media/mosp-ea-transfer/subscription-account-admin.png" :::

> [!NOTE]
> You must sign in later with the same Account Admin user account as described in the preceding information. If you don't have access to the account, you must get it before proceeding. For more information, see [Transfer billing ownership of an Azure subscription to another account](billing-subscription-transfer.md).

### Access to the destination EA

You must have access to the destination EA to create an EA account owner. An existing or new department is required. The department is where the subscription is put when the subscription is transferred. The EA account owner owns the subscription that's put in the department.

You must have one of the following roles to create an EA account owner. For more information about EA roles, see [Managing Azure Enterprise Agreement roles](understand-ea-roles.md).

- Enterprise Administrator
- Department Administrator

### Set EA authentication level

EAs have an authentication level set that determines which types of users can be added as EA account owners for the enrollment. There are four authentication levels available.

Ensure that the authentication level set for the EA allows you to create a new EA account owner using the subscription account administrator noted previously. For example:

- If the subscription account administrator has an email address domain of `@outlook.com`, then the EA must have its authentication level set to either **Microsoft Account Only** or **Mixed Account**.
- If the subscription account administrator has an email address domain of `@<YourAzureADTenantPrimaryDomain.com>`, then the EA must have its authentication level set to either **Work or School Account** or **Work or School Account Cross Tenant**. The ability to create a new EA account owner depends on whether the EA's default domain is the same as the subscription account administrator's email address domain.

> [!NOTE]
> When set correctly, changing the authentication level doesn't impact the transfer process.

## Transfer the subscription to the EA

After you've reviewed and completed any needed [prerequisites](#prerequisites), you're ready to start the process to transfer of the subscription to the EA.

### Create an EA account owner

As described in the [prerequisites](#access-to-the-destination-ea) section, you must create an EA account owner either as part of an existing or new EA department.

1. Sign in to the Azure portal as an enterprise or department administrator.
1. To create a new department, see [Create a department](direct-ea-administration.md#to-create-a-department).
1. To create the EA account owner, see [Add an account and account owner](direct-ea-administration.md#add-an-account-and-account-owner). When asked for the **Account Owner E-Mail** enter the email address of the subscription **Account Admin** that you identified previously.
    > [!NOTE]
    > If the EA Authentication Level is set incorrectly, the EA account owner creation fails and an error is shown.

After the EA account owner is created the subscription account Administrator, who is also now an EA account owner, receives an email. It notifies the user that they're now an EA Account Owner. If the user doesn't have access to an email mailbox associated with the account specified, there's no need to worry. The email is only a notification. Information in the email isn't required to proceed. However, an email mailbox is advised for future notifications about the subscription.

### Complete the subscription transfer

Now that the subscription account administrator is also an EA account owner, they can create subscriptions under the EA.

> [!IMPORTANT]
> Before proceeding you need to understand what happens when a new EA account owner signs in to the Azure portal for the first time. Read and understand the following information before you sign in as the subscription account administrator.

The first time a new EA account owner signs in to the Azure portal, they see the following warning:

```
WARNING

You are about to associate your account (email address) to the following enrollment:

Enrollment Name: <EnrollmentName>
Enrollment Number: <EnrollmentNumber>

All Enrollment Administrators can gain access to all of your subscriptions if you proceed.
Additionally, all Azure subscriptions for which you are the account owner will be converted to your Enterprise Agreement.
This includes subscriptions which include a monthly credit (e.g. Visual Studio, Microsoft Cloud Partner Program, BizSpart, etc.) meaning you will lose the monthly credit by proceeding.
All subscriptions based on a Visual Studio subscriber offer (monthly credit for Visual Studio subscribers or Pay-As-You-Go Dev/Test) will be converted to use the Enterprise Dev/Test usage rates and be billed against this enrollment from today onwards.
If you wish to retain the monthly credits currently associated with any of your subscriptions, please cancel.
Please see additional details.

Cancel  Continue
```

The warning states the following:

***When a user is added as an account owner, any Azure subscriptions associated with the account owner that are based on either the MOSP (PAYG) Dev/Test offer or the monthly credit offers for Visual Studio subscribers will be converted to the EA Dev/Test offer. Subscriptions based on other offer types, such as MOSP (PAYG), associated with the Account Owner will be converted to the standard EA subscription offer.***

If the user understands the consequences of the warning, select **Continue** and the subscriptions associated with their account are transferred to the EA.

## More help

Using the preceding information, you should have transferred the subscription to the EA. If you need more help, create a [billing support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Next step

- [EA Billing administration on the Azure portal](direct-ea-administration.md)
