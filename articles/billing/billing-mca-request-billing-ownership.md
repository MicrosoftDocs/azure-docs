---
title: Get billing ownership of Azure subscriptions | Microsoft Docs
description: Learn how to request billing ownership of Azure subscriptions from other users.
services: ''
documentationcenter: ''
author: amberbhargava
manager: amberb
editor: banders
tags: billing

ms.service: billing
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 01/31/2019
ms.author: banders

---
# Get billing ownership of Azure subscriptions from other users

You might want to take ownership of Azure subscriptions if the existing billing owner is leaving your organization, or you want to pay for the subscriptions through your billing account.

You can send a request to take ownership of Azure subscriptions from existing owners in other billing accounts. Taking ownership transfers billing ownership of subscriptions to your invoice section. After ownership is transferred, your invoice section is responsible for all charges for the subscriptions.

To request the billing ownership, you must be an **Owner** or **Contributor** on the invoice section. To learn more, see [Invoice section tasks](billing-understand-mca-roles.md#invoice-section-tasks).

This article applies to a billing account for a Microsoft Customer Agreement. [Check if you have access to a Microsoft Customer Agreement](#check-your-access-to-a-microsoft-customer-agreement).

## Request billing ownership in the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Search on **Cost Management + Billing**.

   ![Screenshot that shows Azure portal search for cost management + billing](./media/billing-mca-request-billing-ownership/billing-search-costmanagement+billing.png)

3. Go to the invoice section. Depending on your access, you may need to select a billing account or billing profile. From the billing account or profile, select **Invoice sections** and then an invoice section.
   <!-- Todo - Add a screenshot -->

4. Select **Transfer requests** from the lower-left side.

5. From the top of the page, select **Add**.

6. Enter the email address of the user you're requesting billing ownership from. The user must be an account administrator on an individual billing account or an account owner on an Enterprise Agreement.

   ![Screenshot that shows adding a new transfer request](./media/billing-mca-request-billing-ownership/mca-new-transfer-request.png)

7. Select **Send transfer request**.

8. The user gets an email with instructions to review your transfer request.
   ![Screenshot that shows review transfer request email](./media/billing-mca-request-billing-ownership/mca-review-transfer-request-email.png)

9. To approve the transfer request, the user selects the link in the email and follows the instructions.

    ![Screenshot that shows review transfer request email](./media/billing-mca-request-billing-ownership/mca-review-transfer-request.png)

## Check the status of your transfer request in the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Search on **Cost Management + Billing**.

   ![Screenshot that shows Azure portal search for cost management + billing](./media/billing-mca-request-billing-ownership/billing-search-costmanagement+billing.png)

3. Go to the invoice section. Depending on your access, you may need to select a billing account or billing profile. From the billing account or profile, select **Invoice sections** and then an invoice section.
   <!-- Todo - Add a screenshot -->

4. Select **Transfer requests** from the lower-left side.

5. The Transfer requests page displays the following information:

    ![Screenshot that shows list of transfer requests](./media/billing-mca-request-billing-ownership/mca-view-transfer-requests.png)

   |Column|Definition|
   |---------|---------|
   |Request date|The date when the transfer request was sent|
   |Recipient|The email address of the user that you sent the request to transfer billing ownership|
   |Expiration date|The date when the request expires|
   |Status|The status of transfer request|

    The transfer request can have one of the following statuses:

   |Status|Definition|
   |---------|---------|
   |In progress|The user hasn't accepted the transfer request|
   |Processing|The user approved the transfer request. Billing for subscriptions that the user selected is getting transferred to your invoice section|
   |Completed| The billing for subscriptions that the user selected is transferred to your invoice section|
   |Finished with errors|The request completed but billing for some subscriptions that the user selected couldn't be transferred|
   |Expired|The user didn't accept the request on time and it expired|
   |Canceled|Someone with access to the transfer request canceled the request|
   |Declined|The user declined the transfer request|

6. Select a transfer request to view details. The transfer details page displays the following information:
   <!-- Todo - Add a screenshot -->

   |Column  |Definition|
   |---------|---------|
   |Transfer request ID|The unique ID for your transfer request|
   |Transfer requested on|The date when the transfer request was sent|
   |Transfer requested by|The email address of the user who sent the transfer request|
   |Transfer request expires on| The date when the transfer request expires|
   |Recipient's email address|The email address of the user that you sent the request to transfer billing ownership|
   |Transfer link sent to recipient|The url that was sent to the user to review the transfer request|

## Useful information

The following section provides helpful information about transferring subscriptions.

### Service downtime

There is no impact to the services running in the transferred subscriptions.

### Disabled subscriptions

Disabled subscriptions can't be transferred. Subscriptions must be in active state to transfer their billing ownership.

### Azure resources transfer

All resources from the subscriptions like VMs, disks, and websites transfer.

### Azure Marketplace products transfer

Azure Marketplace products transfer along with their respective subscriptions.

### Azure reservations transfer

The user that you send the transfer request can select Azure reservations to transfer. When the transfer is completed, reservation discount can be applied to subscriptions in the billing profile of your invoice section.

### Access to Azure services

User access to Azure services in the transferred subscriptions does not change.

### Azure support plan

Azure support doesn't transfer with the subscriptions. If the user selects all subscriptions and reservations to transfer, ask them to cancel their support plan.

### Charges for transferred subscription

The original billing owner of the subscriptions is responsible for any charges that were reported up to the point that the transfer is completed. Your invoice section is responsible for charges reported from the time of transfer onwards. There may be some charges that took place before transfer but was reported afterwards. These charges show up on your invoice section.

### Supported offers

Subscription of any types or offers, except CSP offers can be transferred.

### Cancel a transfer request

You can cancel the transfer request until the request is approved or declined. To cancel the transfer request, [go to the transfer details page](#check-status-of-your-transfer-request-in-the-Azure-portal) and select cancel from the bottom of the page.

## Check your access to a Microsoft Customer Agreement
[!INCLUDE [billing-check-mca](../../includes/billing-check-mca.md)]

## Next steps

- The billing ownership of the Azure subscriptions is transferred to your invoice section. Keep track of the charges for these subscriptions in the [Azure portal](https://portal.azure.com).
- Give others permissions to view and manage billing for these subscriptions. For more information, see [Invoice section roles and tasks](billing-understand-mca-roles.md#invoice-section-tasks)

## Need help? Contact support
If you need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.
