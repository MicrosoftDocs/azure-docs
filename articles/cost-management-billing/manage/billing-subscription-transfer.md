---
title: Transfer billing ownership of an MOSP Azure subscription
description: Describes how to transfer billing ownership of an MOSP Azure subscription to another account.
keywords: transfer azure subscription, azure transfer subscription, move azure subscription to another account,azure change subscription owner, transfer azure subscription to another account, azure transfer billing
author: bandersmsft
ms.reviewer: sgautam
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: how-to
ms.date: 02/13/2024
ms.author: banders
---

# Transfer billing ownership of an MOSP Azure subscription to another account

This article shows the steps needed to transfer billing ownership of an (MOSP) Microsoft Online Services Program, also referred to as pay-as-you-go, Azure subscription to another MOSP account. 

Before you transfer billing ownership for a subscription, read [Azure subscription and reservation transfer hub](subscription-transfer.md) to ensure that your transfer type is supported.

If you want to keep your billing ownership but change subscription type, see [Switch your Azure subscription to another offer](switch-azure-offer.md). To control who can access resources in the subscription, see [Azure built-in roles](../../role-based-access-control/built-in-roles.md).

If you're an Enterprise Agreement (EA) customer, your enterprise administrator can transfer billing ownership of your subscriptions between accounts.

Only the billing administrator of an account can transfer ownership of a subscription.

When you send or accept a transfer request, you agree to terms and conditions. For more information, see [Transfer terms and conditions](subscription-transfer.md#transfer-terms-and-conditions).

[!INCLUDE [cost-management-billing-subscription-b2b-b2c-transfer-note](../../../includes/cost-management-billing-subscription-b2b-b2c-transfer-note.md)]

## Transfer billing ownership of an Azure subscription

1. Sign in to the [Azure portal](https://portal.azure.com) as an administrator of the billing account that has the subscription that you want to transfer. If you're not sure if you're an administrator, or if you need to determine who is, see [Determine account billing administrator](add-change-subscription-administrator.md#whoisaa).
1. Navigate to **Subscriptions** and the select the one that you want to transfer.  
   :::image type="content" source="./media/billing-subscription-transfer/navigate-subscriptions.png" alt-text="Screenshot showing navigation to the Subscriptions page." lightbox="./media/billing-subscription-transfer/navigate-subscriptions.png" :::
1. At the top of the page, select **Transfer billing ownership**.  
   :::image type="content" source="./media/billing-subscription-transfer/select-transfer-billing-ownership.png" alt-text="Screenshot showing the Transfer billing ownership option." lightbox="./media/billing-subscription-transfer/select-transfer-billing-ownership.png" :::
1. On the Transfer billing ownership page, enter the email address of a user that is a billing administrator of the account that becomes the new owner for the subscription.  
   :::image type="content" source="./media/billing-subscription-transfer/transfer-billing-ownership-page.png" alt-text="Screenshot showing the Transfer billing ownership page." lightbox="./media/billing-subscription-transfer/transfer-billing-ownership-page.png" :::
1. If you're transferring your subscription to an account in another Microsoft Entra tenant, select **Move subscription tenant** to move the subscription to the new account's tenant. For more information, see [Transferring subscription to an account in another Microsoft Entra tenant](#transfer-a-subscription-to-another-azure-ad-tenant-account).
    > [!IMPORTANT]
    > If you choose to move the subscription to the new account's Microsoft Entra tenant, all [Azure role assignments](../../role-based-access-control/role-assignments-portal.md) to access resources in the subscription are permanently removed. Only the user in the new account who accepts your transfer request will have access to manage resources in the subscription. Alternatively, you can clear the **Move subscription tenant** option to transfer billing ownership without moving the subscription to the new account's tenant. If you do so, existing Azure role assignments to access Azure resources will be maintained.  
1. Select **Send transfer request**.
1. The user gets an email with instructions to review your transfer request.  
   :::image type="content" border="true" source="./media/billing-subscription-transfer/billing-receiver-email.png" alt-text="Screenshot showing a subscription transfer email tht was sent to the recipient.":::
1. To approve the transfer request, the user selects the link in the email and follows the instructions. The user then selects a payment method that is used to pay for the subscription. If the user doesn't have an Azure account, they have to sign up for a new account.  
   :::image type="content" border="true" source="./media/billing-subscription-transfer/billing-accept-ownership-step1.png" alt-text="Screenshot showing the first subscription transfer web page.":::
   :::image type="content" border="true" source="./media/billing-subscription-transfer/billing-accept-ownership-step2.png" alt-text="Screenshot showing the second subscription transfer web page.":::
   :::image type="content" border="true" source="./media/billing-subscription-transfer/billing-accept-ownership-step3.png" alt-text="Screenshot showing the third subscription transfer web page.":::
1. Success! The subscription is now transferred.

<a name='transfer-a-subscription-to-another-azure-ad-tenant-account'></a>

## Transfer a subscription to another Microsoft Entra tenant account

A Microsoft Entra tenant is created for you when you sign up for Azure. The tenant represents your account. You use the tenant to manage access to your subscriptions and resources.

When you create a new subscription, it's hosted in your account's Microsoft Entra tenant. If you want to give others access to your subscription or its resources, you need to invite them to join your tenant. Doing so helps you control access to your subscriptions and resources.

When you transfer billing ownership of your subscription to an account in another Microsoft Entra tenant, you can move the subscription to the new account's tenant. If you do so, all users, groups, or service principals that had [Azure role assignments](../../role-based-access-control/role-assignments-portal.md) to manage subscriptions and its resources lose their access. Only the user in the new account who accepts your transfer request has access to manage the resources. The new owner must manually add these users to the subscription to provide access to the user who lost it. For more information, see [Transfer an Azure subscription to a different Microsoft Entra directory](../../role-based-access-control/transfer-subscription.md).

## Transfer Visual Studio and Partner Network subscriptions

Visual Studio and Microsoft Cloud Partner Program subscriptions have monthly recurring Azure credit associated with them. When you transfer these subscriptions, your credit isn't available in the destination billing account. The subscription uses the credit in the destination billing account. For example, if Bob transfers a Visual Studio Enterprise subscription to Jane's account on September 9 and Jane accepts the transfer. After the transfer is completed, the subscription starts using credit in Jane's account. The credit resets every ninth day of the month.

## Next steps after accepting billing ownership

If you've accepted the billing ownership of an Azure subscription, we recommend you review these next steps:

1. Review and update the Service Admin, Co-Admins, and Azure role assignments. To learn more, see [Add or change Azure subscription administrators](add-change-subscription-administrator.md) and [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.md).
1. Update credentials associated with this subscription's services including:
   1. Management certificates that grant the user admin rights to subscription resources. For more information, see [Create and upload a management certificate for Azure](../../cloud-services/cloud-services-certs-create.md)
   1. Access keys for services like Storage. For more information, see [About Azure storage accounts](../../storage/common/storage-account-create.md)
   1. Remote Access credentials for services like Azure Virtual Machines.
1. If you're working with a partner, consider updating the partner ID on the subscription. You can update the partner ID in the [Azure portal](https://portal.azure.com). For more information, see [Link a partner ID to your Azure accounts](link-partner-id.md)

## Cancel a transfer request

Only one transfer request is active at a time. A transfer request is valid for 15 days. After the 15 days, the transfer request expires.

To cancel a transfer request:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to **Subscriptions** > Select the subscription that you sent a transfer request for, then select **Transfer billing ownership**.
1. At the bottom of the page, select **Cancel the transfer request**.

:::image type="content" source="./media/billing-subscription-transfer/transfer-billing-owership-cancel-request.png" alt-text="Screenshot showing the Transfer billing ownership window with the Cancel the transfer request option." lightbox="./media/billing-subscription-transfer/transfer-billing-owership-cancel-request.png" :::

## Troubleshooting

Use the following troubleshooting information if you're having trouble transferring subscriptions.

### Original Azure subscription billing owner leaves your organization

> [!Note]
> This section specifically applies to a billing account for a Microsoft Customer Agreement. Check if you have access to a [Microsoft Customer Agreement](mca-request-billing-ownership.md#check-for-access).

It's possible that the original billing account owner who created an Azure account and an Azure subscription leaves your organization. If that situation happens, then their user identity is no longer in the organization's Microsoft Entra ID. Then the Azure subscription doesn't have a billing owner. This situation prevents anyone from performing billing operations to the account, including viewing and paying bills. The subscription could go into a past-due state. Eventually, the subscription could get disabled because of nonpayment. Ultimately, the subscription could get deleted, affecting every service that runs on the subscription.

When a subscription no longer has a valid billing account owner, Azure sends an email to other Billing account owners, Service Administrators (if any), Co-Administrators (if any), and Subscription Owners informing them of the situation and provides them with a link to accept billing ownership of the subscription. Any one of the users can select the link to accept billing ownership. For more information about billing roles, see [Billing Roles](understand-mca-roles.md) and [Azure roles, Microsoft Entra roles, and classic subscription administrator roles](../../role-based-access-control/rbac-and-directory-admin-roles.md).

Here's an example of what the email looks like.

:::image type="content" source="./media/billing-subscription-transfer/orphaned-subscription-email.png" alt-text="Screenshot showing an example email to accept billing ownership." lightbox="./media/billing-subscription-transfer/orphaned-subscription-email.png" :::

Additionally, Azure shows a banner in the subscription's details window in the Azure portal to Billing owners, Service Administrators, Co-Administrators, and Subscription Owners. Select the link in the banner to accept billing ownership.

:::image type="content" source="./media/billing-subscription-transfer/orphaned-subscription-example.png" alt-text="Screenshot showing an example of a subscription without a valid billing owner." lightbox="./media/billing-subscription-transfer/orphaned-subscription-example.png" :::

### The "Transfer subscription" option is unavailable

<a name="no-button"></a> 

The self-service subscription transfer isn't available for your billing account. For more information, see [Azure subscription and reservation transfer hub](subscription-transfer.md) to ensure that your transfer type is supported.

###  Not all subscription types can transfer

Not all types of subscriptions support billing ownership transfer. You can transfer billing ownership or request billing ownership for the following subscription types.

| Offer Name (subscription type) | Microsoft Offer ID |
|---|---|
| [Pay-As-You-Go](https://azure.microsoft.com/offers/ms-azr-0003p/) | MS-AZR-0003P |
| [Visual Studio Enterprise subscribers](https://azure.microsoft.com/offers/ms-azr-0063p/)¹ | MS-AZR-0063P |
| [Visual Studio Professional subscribers](https://azure.microsoft.com/offers/ms-azr-0059p/)¹ | MS-AZR-0059P |
| [Action Pack](https://azure.microsoft.com/offers/ms-azr-0025p/)¹ | MS-AZR-0025P¹ |
| [Pay-As-You-Go Dev/Test](https://azure.microsoft.com/offers/ms-azr-0023p/) | MS-AZR-0023P |
| [MSDN Platforms subscribers](https://azure.microsoft.com/offers/ms-azr-0062p/)¹ | MS-AZR-0062P |
| [Visual Studio Test Professional subscribers](https://azure.microsoft.com/offers/ms-azr-0060p/)¹ | MS-AZR-0060P |
| [Azure Plan](https://azure.microsoft.com/offers/ms-azr-0017g/)² | MS-AZR-0017G |

¹ Any credit available on the subscription won't be available in the new account after the transfer.

² Only supported for products in accounts that are created during sign-up on the Azure website.

###  Access denied error shown when trying to transfer subscription billing ownership

This error is seen if you're trying to transfer a Microsoft Azure Plan subscription and you don't have the necessary permission. To transfer a Microsoft Azure plan subscription, you need to be an owner or contributor on the invoice section to which the subscription is billed. For more information, see [Manage subscriptions for invoice section](../manage/understand-mca-roles.md#manage-subscriptions-for-invoice-section).

## Need help? Contact us.

If you have questions or need help,  [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Next steps

- Review and update the Service Admin, Co-Admins, and Azure role assignments. To learn more, see [Add or change Azure subscription administrators](add-change-subscription-administrator.md) and [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.md).
