---
title: include file
description: include file
documentationcenter: partner-center-commercial-marketplace
author: qianw211
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: include
ms.date: 08/16/2019
ms.author: dsindona
ms.custom: include file

---

When you publish your offer to the marketplace via Partner Center, you need to connect your offer to your CRM system. In this way, you can receive customer contact information immediately after a customer expresses interest or deploys your product.

1. Select a lead destination where you want us to send customer leads. The following CRM systems are supported:

    * [Dynamics 365](../commercial-marketplace-lead-management-instructions-dynamics.md) for Customer Engagement
    * [Marketo](../commercial-marketplace-lead-management-instructions-marketo.md)
    * [Salesforce](../commercial-marketplace-lead-management-instructions-salesforce.md)

    If your CRM system isn't explicitly supported in this list, you can store the customer lead data by using the following options. Then you can export or import this data into your CRM system.

    * [Azure table](../commercial-marketplace-lead-management-instructions-azure-table.md)
    * [HTTPS endpoint](../commercial-marketplace-lead-management-instructions-https.md)

2. Read this linked documentation for your selected lead destination to see how to set up the lead destination to receive leads from your marketplace offer.
3. Connect your offer to the lead destination when you publish the offer to the marketplace in Partner Center. For information on how to do this, see the linked documentation.
4. Confirm that the connection to the lead destination is set up properly. After you've configured your lead destination properly, select **Publish** on your offer in Partner Center. Then we'll validate the connection and send you a test lead. When you view the offer before you go live, you can also test your lead connection by trying to acquire the offer yourself in the preview environment.
5. Make sure the connection to the lead destination stays up to date so that you don't lose any leads. Make sure you update these connections whenever something has changed on your end.
