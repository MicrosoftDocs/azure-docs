---
title: Offer publishing guide for publishing Dynamics 365 offers in Microsoft AppSource
description: Step-by-step publishing guide for publishing Dynamics 365 apps to Microsoft AppSource
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
author: navits
ms.author: navits
ms.date: 12/04/2020
---

# Plan a Microsoft Dynamics 365 offer

This article explains the different options and features of a Dynamics 365 offer in Microsoft AppSource in the commercial marketplace. AppSource includes offers that build on or extend Microsoft 365, Dynamics 365, PowerApps, and Power BI. AppSource allows paid (*Get It Now*), list (*Contact Me*), and trial (*Try It Now*) offers.

Before you start, create a commercial marketplace account in [Partner Center](./partner-center-portal/create-account.md) and ensure it is enrolled in the commercial marketplace program.

## Licensing options

As you prepare to publish a new offer, you need to decide which licensing option to choose. This will determine what additional information you'll need to provide later as you create the offer in Partner Center.

These are the available licensing options for Dynamics 365 offers:

| Licensing option | Transaction process |
| --- | --- |
| Get it now (free) | List your offer to customers for free. |
| Free trial (listing) | Offer your customers a one-, three- or six-month free trial. Offer listing free trials are created, managed, and configured by your service and do not have subscriptions managed by Microsoft. |
| Contact me | Collect customer contact information by connecting your Customer Relationship Management (CRM) system. The customer will be asked for permission to share their information. These customer details, along with the offer name, ID, and marketplace source where they found your offer, will be sent to the CRM system that you've configured. For more information about configuring your CRM, see Customer leads. |
|

## Test drive

[!INCLUDE [Test drives section](includes/test-drives.md)]

## Customer leads

[!INCLUDE [Customer leads section](includes/customer-leads.md)]

## Legal contracts

[!INCLUDE [Legal contracts section](includes/legal-contracts.md)]

## Offer listing details

Here's an example of how offer information appears in Microsoft AppSource (any listed prices are for example purposes only and do not reflect actual costs):

:::image type="content" source="media/dynamics-365/example-d365-operations.png" alt-text="Illustrates how this offer appears in Microsoft AppSource.":::

> [!NOTE]
> Offer listing content is not required to be in English if the offer description begins with the phrase "This application is available only in [non-English language]".

To help create your offer more easily, prepare these items ahead of time. All are required except where noted.

- **Name** – The name will appear as the title of your offer listing in the commercial marketplace. The name may be trademarked. It cannot contain emojis (unless they are the trademark and copyright symbols) and is limited to 50 characters.
- **Search results summary** – The purpose or function of your offer as a single sentence with no line breaks in 100 characters or less. This is used in the commercial marketplace listing(s) search results.
- **Description** – This description displays in the commercial marketplace listing(s) overview. Consider including a value proposition, key benefits, intended user base, any category or industry associations, in-app purchase opportunities, any required disclosures, and a link to learn more. This text box has rich text editor controls to make your description more engaging. Optionally, use HTML tags for formatting.
- **Search keywords** (optional) – Up to three search keywords that customers can use to find your offer. Don't include the offer **Name** and **Description**; that text is automatically included in search.
- **Product your app works with** (optional) – The names of up to three products your offer works with.
- **Help and privacy policy links** – The URLs for your offer's help and company’s privacy policy. You are responsible for ensuring your app complies with privacy laws and regulations.
- **Contact information**
  - **Support contact** – The name, phone, and email that Microsoft partners will use when your customers open tickets. Include the URL for your support website.
  - **Engineering contact** – The name, phone, and email for Microsoft to use directly when there are problems with your offer. This contact information isn’t listed in the commercial marketplace.
- **Supporting documents** – Up to three customer-facing documents, such as whitepapers, brochures, checklists, or PowerPoint presentations, in PDF form.
- **Media**
    - **Logos** – A PNG file for the **Large** logo. Partner Center will use this to create other required logo sizes. You can optionally replace these with different images later.
    - **Screenshots** – At least one and up to five screenshots that show how your offer works. Images must be 1280 x 720 pixels, in PNG format, and include a caption.
    - **Videos** (optional) – Up to four videos that demonstrate your offer. Include a name, URL for YouTube or Vimeo, and a 1280 x 720 pixel PNG thumbnail.

> [!Note]
> Your offer must meet the general [commercial marketplace certification policies](/legal/marketplace/certification-policies#100-general) to be published to the commercial marketplace.

## Additional sales opportunities

You can choose to opt into Microsoft-supported marketing and sales channels. When creating your offer in Partner Center, you will see two a tab toward the end of the process for **Co-sell with Microsoft**. This option lets Microsoft sales teams consider your IP co-sell eligible solution when evaluating their customers’ needs. See [Co-sell option in Partner Center](commercial-marketplace-co-sell.md) for detailed information on how to prepare your offer for evaluation.

## Next steps

After you've considered the planning items described above, select one of the following (also available in the table of contents on the left) to begin creating your offer. <font color="red">[ I think the 2nd column should be deleted and the first column should link to the appropriate Create topic like Ops, Biz Central, and CE are ]</font>

| Publishing guide    | Notes  |
| :------------------- | :-------------------|
| <strike>Microsoft 365</strike> | <strike>Review the [publishing process and guidelines](/office/dev/store/submit-to-appsource-via-partner-center).</strike> |
| [Dynamics 365 for Operations](d365-operations-offer-setup.md) | When you're building for Enterprise Edition, first review the [publishing process and guidelines](/dynamics365/fin-ops-core/dev-itpro/lcs-solutions/lcs-solutions-app-source). |
| [Dynamics 365 for Business Central](./partner-center-portal/create-new-business-central-offer.md) |   |
| [Dynamics 365 for Customer Engagement](./partner-center-portal/create-new-customer-engagement-offer.md) | First review the [publishing process and guidelines](/dynamics365/customer-engagement/developer/publish-app-appsource). |
| Power Apps | <font color="red">[ If this is a D365 offer, where should it link to? ] </font>|
| [Power BI](partner-center-portal/create-power-bi-app-offer.md) | Review the publishing process and guidelines](/power-bi/developer/office-store). |
|
