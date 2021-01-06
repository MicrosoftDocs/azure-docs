---
title: include file
description: include file
documentationcenter: partner-center-commercial-marketplace
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: include
ms.date: 08/24/2020
ms.custom: include file
author: mingshen-ms
ms.author: mingshen
---

When you publish your offer to the commercial marketplace via Partner Center, you need to connect your offer to your CRM system. This way, you can receive customer contact information immediately after a customer expresses interest or deploys your product.

1. Select a lead destination where you want us to send customer leads. The following CRM systems are supported:

    * [Dynamics 365](../commercial-marketplace-lead-management-instructions-dynamics.md) for Customer Engagement
    * [Marketo](../commercial-marketplace-lead-management-instructions-marketo.md)
    * [Salesforce](../commercial-marketplace-lead-management-instructions-salesforce.md)

    If your CRM system isn't explicitly supported in this list, you can store the customer lead data by using the following options. Then you can export or import this data into your CRM system.

    * [Azure table](../commercial-marketplace-lead-management-instructions-azure-table.md)
    * [HTTPS endpoint](../commercial-marketplace-lead-management-instructions-https.md)

1. Read the applicable linked documentation above to learn how to set up your lead destination and receive leads from your commercial marketplace offers.
1. After you've connected your offer to your lead destination, select **Publish** on your offer in Partner Center. We'll validate the connection and send you a test lead. When you view the offer before you go live, you can also test your lead connection by trying to acquire the offer yourself in the preview environment.
1. Make sure the connection to the lead destination stays up to date so you don't lose any leads. Make sure you update these connections whenever something has changed.
