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

While publishing your offer to the marketplace via Partner Center, you will need to connect your offer to your Customer Relationship Management (CRM) system so that you can receive customer contact information immediately after a customer expresses interest or deploys your product.

1. **Select a lead destination where you want us to send customer leads**. The following CRM systems are supported:

    * [Dynamics 365](../commercial-marketplace-lead-management-instructions-dynamics.md) for Customer Engagement
    * [Marketo](../commercial-marketplace-lead-management-instructions-marketo.md)
    * [Salesforce](../commercial-marketplace-lead-management-instructions-salesforce.md)

    If your CRM system is not explicitly supported in the list above, you have the following options that allow you to store the customer lead data, and then you can export or import these data into your CRM system.

    * [Azure Table](../commercial-marketplace-lead-management-instructions-azure-table.md)
    * [Https Endpoint](../commercial-marketplace-lead-management-instructions-https.md)

2. Read the documentation linked above to your selected lead destination to see how to set up the lead destination to receive leads from your marketplace offer. 
3. Connect your offer to the lead destination while publishing the offer to the marketplace in Partner Center. See the documentation linked above for how to do this.
4. Confirm the connection to the lead destination is set up properly. Once you have configured your lead destination properly and have hit Publish on your offer in Partner Center, we will validate the connection and send you a test lead. When you are viewing the offer before you go live, you can also test your lead connection by trying to acquire the offer yourself in the preview environment. 
5. Make sure the connection to the lead destination stays up-to-date so that you don't lose any leads, so make sure you update these connections whenever something has changed on your end.
