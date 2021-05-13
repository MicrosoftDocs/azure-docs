---
title: Plan a Managed Service offer for the Microsoft commercial marketplace 
description: How to plan a new Managed Service offer for Azure Marketplace using the commercial marketplace program in Microsoft Partner Center. 
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
author: Microsoft-BradleyWright
ms.author: brwrigh
ms.reviewer: anbene
ms.date: 12/23/2020
---

# How to plan a Managed Service offer for the Microsoft commercial marketplace

This article introduces the requirements for publishing a Managed Service offer to the Microsoft commercial marketplace through Partner Center.

Managed Services are Azure Marketplace offers that enable cross-tenant and multi-tenant management with Azure Lighthouse. To learn more, see [What is Azure Lighthouse?](../lighthouse/overview.md) When a customer purchases a Managed Service offer, they’re able to delegate one or more subscription or resource group. You can then work on those resources by using the [Azure delegated resource management](../lighthouse/concepts/architecture.md) capabilities of Azure Lighthouse.

## Eligibility requirements

To publish a Managed Service offer, you must have earned a Gold or Silver Microsoft Competency in Cloud Platform. This competency demonstrates your expertise to customers. For more information, see [Microsoft Partner Network Competencies](https://partner.microsoft.com/membership/competencies).

Offers must meet all applicable [commercial marketplace certification policies](/legal/marketplace/certification-policies) to be published on Azure Marketplace.

## Customer leads

You must connect your offer to your customer relationship management (CRM) system to collect customer information. The customer will be asked for permission to share their information. These customer details, along with the offer name, ID, and online store where they found your offer, will be sent to the CRM system that you've configured. The commercial marketplace supports different kinds of CRM systems, along with the option to use an Azure table or configure an HTTPS endpoint using Power Automate.

You can add or modify a CRM connection at any time during or after offer creation. For detailed guidance, see [Customer leads from your commercial marketplace offer](partner-center-portal/commercial-marketplace-get-customer-leads.md).

## Legal contracts

In the Properties page of Partner Center, you’ll be asked to provide **terms and conditions** for the use of your offer. You can either enter your terms directly in Partner Center or provide the URL where they can be found. Customers will be required to accept these terms and conditions before purchasing your offer.

## Offer listing details

When you create your Managed Service offer in Partner Center, you’ll enter text, images, documents, and other offer details. This is what customers will see when they discover your offer on Azure Marketplace. See the following example:

:::image type="content" source="media/example-managed-service.png" alt-text="Illustrates how a Managed Service offer appears on Azure Marketplace.":::

**Call-out descriptions**

1. Logo
1. Name
1. Short description
1. Categories
1. Legal contracts and privacy policy
1. Description
1. Screenshots/videos
1. Useful links

Here's an example of how the offer listing appears in the Azure portal:

:::image type="content" source="media/example-managed-service-azure-portal.png" alt-text="Illustrates how this offer appears in the Azure portal.":::

**Call-out descriptions**

1. Name
2. Description
3. Useful links
4. Screenshots/videos

> [!NOTE]
> If your offer is in a language other than English, the offer listing can be in that language, but the description must begin or end with the English phrase “This service is available in &lt;language of your offer content>”. You can also provide supporting documents in a language that's different from the one used in the offer listing details.

To help create your offer more easily, prepare some of these items ahead of time. The following items are required unless otherwise noted.

**Name**: this will appear as the title of your offer listing in the commercial marketplace. The name may be trademarked. It can't contain emojis (unless they're the trademark and copyright symbols) and must be limited to 50 characters.

**Search results summary**: describe the purpose or goal of your offer in 100 characters or less. This summary is used in the commercial marketplace listing search results. It shouldn’t be identical to the title. Consider including your top SEO keywords.

**Short description**: provide a short description of your offer (up to 256 characters). It’ll be displayed on your offer listing in Azure portal.

**Description**: describe your offer in 3,000 characters or less. This description will be displayed in the commercial marketplace listing. Consider including a value proposition, key benefit, category or industry associations, and any necessary disclosures.

Here are some tips for writing your description:

* Clearly describe the value of your offer in the first few sentences, including:
    * The type of user who benefits from the offer.
    * What customer needs or issues the offer addresses.
* Remember that the first few sentences might be displayed in search results.
* Use industry-specific vocabulary.

You can use HTML tags to format your description. For information about HTML formatting, see [HTML tags supported in the commercial marketplace offer descriptions](./supported-html-tags.md).

**Privacy policy link**: provide an URL to the privacy policy, hosted on your site. You’re responsible for ensuring your offer complies with privacy laws and regulations, and for providing a valid privacy policy.

**Useful links** (optional): upload supplemental online documents about your offer.

**Contact information**: provide name, email address, and phone number of two people in your company (you can be one of them): a support contact and an engineering contact. We'll use this information to communicate with you about your offer. This information isn’t shown to customers but may be provided to Cloud Solution Provider (CSP) partners

**Support URLs** (optional): if you have support websites for Azure Global Customers and/or Azure Government customers, provide those URLs.

**Marketplace media – logos**: provide a PNG file for the large-size logo of your offer. Partner Center will use it to create medium and small logos. You can optionally replace these logos with a different image later.

* The large logo (from 216 x 216 to 350 x 350 px) appears on your offer listing on Azure Marketplace.
* The medium logo (90 x 90 px) is shown when a new resource is created.
* The small logo (48 x 48 px) is used on the Azure Marketplace search results.

Follow these guidelines for your logos:

* Make sure the image isn't stretched.
* The Azure design has a simple color palette. Limit the number of primary and secondary colors on your logo.
* The Azure portal colors are white and black. Don't use these as the background of your logo. We recommend simple primary colors that make your logo prominent.
* If you use a transparent background, make sure that the logo and text aren't white, black, or blue.
* The look and feel of your logo should be flat. Avoid gradients. Don't place text on the logo, not even your company or brand name.

**Marketplace media – screenshots** (optional): Add up to five images that demonstrate how your offer works. All images must be 1280 x 720 pixels in size and in .PNG format.

**Marketplace media – videos** (optional): upload up to five videos that demonstrate your offer. The videos must be hosted on YouTube or Vimeo and have a thumbnail (1280 x 720 PNG file).

## Preview audience

A preview audience can access your offer before it’s published on Azure Marketplace in order to test it. On the **Preview audience** page of Partner Center, you can define a limited preview audience.

> [!NOTE]
> A preview audience differs from a private plan. A private plan is one you make available only to a specific audience you choose. This enables you to negotiate a custom plan with specific customers.

You can send invites to Microsoft Account (MSA) or Azure Active Directory (Azure AD) email addresses. Add up to 10 email addresses manually or import up to 20 with a .csv file. If your offer is already live, you can still define a preview audience for testing any changes or updates to your offer.

## Plans and pricing

Managed Service offers require at least one plan. A plan defines the solution scope, limits, and the associated pricing, if applicable. You can create multiple plans for your offer to give your customers different technical and pricing options. For general guidance about plans, including private plans, see [Plans and pricing for commercial marketplace offers](plans-pricing.md).

Managed Services support only one pricing model: **Bring your own license (BYOL)**. This means that you’ll bill your customers directly, and Microsoft won’t charge you any fees.

## Next steps

* [Create a Managed Service offer](./create-managed-service-offer.md)
* [Offer listing best practices](./gtm-offer-listing-best-practices.md)