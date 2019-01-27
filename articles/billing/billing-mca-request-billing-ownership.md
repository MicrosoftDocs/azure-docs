---
title: Request billing ownership in the Azure portal | Microsoft Docs
description: Learn how to request billing ownership of Azure products.
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
ms.date: 01/15/2018
ms.author: banders

---
# Request billing ownership of Azure products from other users

Request other users to transfer billing ownership of their Azure subscriptions and Reservations to your invoice section.

To request billing ownership for an invoice section, you need to be an Owner, Contributor, Purchaser, or Azure subscription creator on the section. To lean more, see [Invoice section roles and tasks](billing-understand-mca-roles.md#invoice-sections-roles-and-task)

This article applies to a billing account for a Microsoft Customer Agreement. [Check if you have a Microsoft Customer Agreement](#check-your-access-to-a-billing-account-for-microsoft-customer-agreement).

## Request billing ownership in the Azure portal

1. Sign in to Azure portal.

2. Search on **Cost Management + Billing**.

   ![Screenshot that shows Azure portal search](./media/billing-mca-request-billing-ownership/portal-cm-billing-search.png)

3. Go to the invoice section. Depending on your access, you may need to select a billing account or a billing profile, select **Invoice sections** and then select an invoice section.
   <!-- Todo - Add a screenshot -->

4. Select **Transfer requests** from the lower-left side.

5. From the top of the page, select **Add**.

6. Enter the email address of the recipient, who will transfer billing ownership of Azure products to your invoice section. The recipient must be an account administrator on an individual billing account or an account owner on an Enterprise Agreement enrollment.

   ![Screenshot that shows adding a new transfer request](./media/billing-mca-request-billing-ownership/mca-new-transfer-request.png)

7. Select **Send transfer request**.

8. The recipient will receive an email with instructions to review your transfer request.

   ![Screenshot that shows review transfer request email](./media/billing-mca-request-billing-ownership/mca-review-transfer-request-email.png)

9. The recipient selects the link in the email and follows the instructions to accept your transfer request.

    ![Screenshot that shows review transfer request email](./media/billing-mca-request-billing-ownership/mca-review-transfer-request.png)

10. The transfer is successful.

## Check status of your transfer request in the Azure portal

1. Sign in to Azure portal.

2. Select **Cost Management + Billing** from the lower-left side of the portal.

3. Go to the Invoice section. Depending on your access, you may need to select a billing account or a billing profile, select **Invoice sections** and then select an invoice section.
   <!-- Todo - Add a screenshot -->

4. Select **Transfer requests** from the lower-left side.

5. The Transfer requests page displays the following information:

    ![Screenshot that shows adding a new transfer request](./media/billing-mca-request-billing-ownership/mca-view-transfer-requests.png)

   |Column|Definition|
   |---------|---------|
   |Request date|The date when the transfer request was sent|
   |Recipient|The email address of the recipient of the transfer request|
   |Expiration date|The date when the request expires. The recipient can't accept the request after this date|
   |Status|The status of transfer request|

    The transfer request can have one of the following statuses:

   |Status|Definition|
   |---------|---------|
   |In progress|The recipient hasn't accepted the transfer request|
   |Processing|The recipient accepted the transfer request. Billing for products that recipient selected is getting transitioned|
   |Completed| The billing for products that recipient selected is transitioned to your invoice section|
   |Finished with errors|The request completed but billing for some products that recipient selected couldn't be transitioned|
   |Expired|The recipient didn't accept the request on time and it expired|
   |Canceled|Someone with access to the transfer request canceled the request|
   |Declined|The recipient declined the transfer request|

6. Select a transfer request to view details. The transfer details page displays the following information:
   <!-- Todo - Add a screenshot -->

   |Column  |Definition|
   |---------|---------|
   |Transfer request ID|The unique ID for your transfer request|
   |Transfer requested on|The date when the transfer request was sent|
   |Transfer requested by|The email address of the user who sent the transfer request|
   |Transfer request expires on| The date when the transfer request expires|
   |Recipient's email address|The email address of the recipient of the transfer request|
   |Transfer link sent to recipient|The url that was sent to the user to review the transfer request|

## Frequently asked questions (FAQ)

### Who is the Account Administrator of a billing account?

The Account Administrator signs up for or bought the Azure subscription. They're authorized to perform various management tasks like create subscriptions, cancel subscriptions, change the billing for a subscription, or change the Service Administrator.

### Does everything transfer? Including resource groups, VMs, disks, and other running services?

All resources from the subscriptions like VMs, disks, and websites transfer to your invoice section. However, any [administrator  [Role-based Access Control (RBAC)](../role-based-access-control/role-assignments-portal.md) policies set up by the recipient do not transfer.

### Does Azure Marketplace products transfer?

Yes, all Azure Marketplace products from the subscription transfer along with the subscription.

### Does a transfer result in any service downtime?

There is no impact to the service. Only billing relationship of Azure subscriptions are transferred.

### If a subscription is transferred to my invoice section in the middle of the billing cycle, do I  pay for the entire billing cycle?

The transfer request recipient is responsible for payment for any usage that was reported up to the point that the transfer is completed. Your invoice section is responsible for usage reported from the time of transfer onwards. There may be some usage that took place before transfer but was reported afterwards. The usage shows up on your invoice section.

## Check your access to a Billing account for Microsoft Customer Agreement
[!INCLUDE [billing-check-mca](../../includes/billing-check-mca.md)]

## Need help? Contact support
If you need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.
