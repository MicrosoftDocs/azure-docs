---
title: Create a IoT Edge Module offer on Microsoft AppSource.
description: Create a IoT Edge Module offer on Microsoft AppSource.
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
author: navits09
ms.author: navits
ms.date: 12/18/2020
---

# Create an IoT Edge Module offer

This article describes how to create an IoT (Internet of Things) Edge Module offer. <strike>This offer type is an enterprise resource planning (ERP) service that supports a wide range of business processes, including finance, operations, supply chain, CRM, project management, and electronic commerce.</strike> All offers <strike>for Dynamics 365 </strike>go through our certification process, which checks your solution for standard requirements, compatibility, and proper practices.<strike> The trial experience allows users to deploy your solution to a live Dynamics 365 environment.</strike>

Before you start, create a commercial marketplace account in [Partner Center](partner-center-portal/create-account.md) and ensure it is enrolled in the commercial marketplace program.

## Before you begin

Review [Plan an IoT Edge Module offer](marketplace-iot-edge.md). It will explain the technical requirements for this offer and list the information and assets you’ll need when you create it.

## Create a new offer

1. Sign in to [Partner Center](https://partner.microsoft.com/dashboard/home).
2. In the left-nav menu, select **Commercial Marketplace** > **Overview**.
3. On the Overview page, select **+ New offer** > **IoT Edge module**.

    :::image type="content" source="media/iot-edge/new-offer-iot-edge.png" alt-text="The left pane menu options and the 'New offer' button.":::

> [!IMPORTANT]
> After an offer is published, any edits you make to it in Partner Center appear on Microsoft AppSource only after you republish the offer. Be sure to always republish an offer after changing it.

## New offer

Enter an **Offer ID**. This is a unique identifier for each offer in your account.

- This ID is visible to customers in the web address for the offer and in Azure Resource Manager templates, if applicable.
- Use only lowercase letters and numbers. The ID can include hyphens and underscores, but no spaces, and is limited to 50 characters. For example, if your Publisher ID is `testpublisherid` and you enter **test-offer-1**, the offer web address will be `https://appsource.microsoft.com/product/dynamics-365/testpublisherid.test-offer-1`.
- The Offer ID combined with the Publisher ID must be under 50 characters in length. <font color="red">[ still true? ]</font>
- The Offer ID can't be changed after you select **Create**.

Enter an **Offer alias**. This is the name used for the offer in Partner Center.

- This name isn't used <strike>in the marketplace</strike> on AppSource. It is different from the offer name and other values shown to customers.
- This name can't be changed after you select **Create**.

Select **Create** to generate the offer. Partner Center opens the **Offer setup** page.

## Alias

Enter a descriptive name that we'll use to refer to this offer solely within Partner Center. The offer alias (pre-populated with what you entered when you created the offer) won't be used in the marketplace and is different than the offer name shown to customers. If you want to update the offer name later, see the [Offer listing](iot-edge-offer-listing.md) page.

## Customer leads

[!INCLUDE [Connect lead management](includes/customer-leads.md)]

For more information, see [Customer leads from your commercial marketplace offer](partner-center-portal/commercial-marketplace-get-customer-leads.md).

Select **Save draft** before continuing to the next tab in the left-nav menu, **Properties**.

## Next steps

- [Configure offer properties](iot-edge-properties.md)
- [Offer listing best practices](gtm-offer-listing-best-practices.md)