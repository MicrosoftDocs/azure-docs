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

# Planning a Microsoft Dynamics 365 offer

This article explains the different options and features of a Dynamics 365 offer in Microsoft AppSource in the commercial marketplace. AppSource includes offers that build on or extend Microsoft 365, Dynamics 365, PowerApps, and Power BI. AppSource allows paid (*Get It Now*), list (*Contact Me*), and trial (*Try It Now*) offers.

Before you start, [Create a commercial marketplace account in Partner Center](./partner-center-portal/create-account.md) and ensure your account is enrolled in the commercial marketplace program.

Also, learn how to [Grow your cloud business with Azure Marketplace](https://azuremarketplace.microsoft.com/sell).<font color="red">[ keep? ]</font>

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

:::image type="content" source="media/dynamics-365/example-azure-marketplace-d365-operations.png" alt-text="Illustrates how this offer appears in Microsoft AppSource.":::

###### Call-out descriptions

1. Logo
2. Products
3. Categories
4. Industries
5. Support address (link)
6. Terms of use
7. Privacy policy
8. Offer name
9. Description
10. Screenshots/videos

> [!NOTE]
> Offer listing content is not required to be in English if the offer description begins with the phrase "This application is available only in [non-English language]".

To help create your offer more easily, prepare some of these items ahead of time. The following items are required unless otherwise noted.<font color="red">[ TAKEN FROM VM ]</font>

- **Name**: This name will appear as the title of your offer listing in the commercial marketplace. The name may be trademarked. It cannot contain emojis (unless they are the trademark and copyright symbols) and must be limited to 50 characters.
- **Search results summary**: Describe the purpose or function of your offer as a single sentence with no line breaks in 100 characters or less. This summary is used in the commercial marketplace listing(s) search results.
- **Description**: This description will be displayed in the commercial marketplace listing(s) overview. Consider including a value proposition, key benefits, intended user base, any category or industry associations, in-app purchase opportunities, any required disclosures, and a link to learn more.

    This text box has rich text editor controls that you can use to make your description more engaging. You can also use HTML tags to format your description. You can enter up to 3,000 characters of text in this box, including HTML markup. For additional tips, see [Write a great app description](/windows/uwp/publish/write-a-great-app-description).

- **Getting Started instructions**: If you choose to sell your offer through Microsoft (transactable offer), this field is required. These instructions help customers connect to your SaaS offer. You can add up to 3,000 characters of text and links to more detailed online documentation.
- **Search keywords** (optional): Provide up to three search keywords that customers can use to find your offer in the online stores. You don't need to include the offer **Name** and **Description**: that text is automatically included in search.
- **Privacy policy link**: The URL for your company’s privacy policy. You must provide a valid privacy policy and are responsible for ensuring your app complies with privacy laws and regulations.
- **Contact information**: You must provide the following contacts from your organization:
  - **Support contact**: Provide the name, phone, and email for Microsoft partners to use when your customers open tickets. You must also include the URL for your support website.
  - **Engineering contact**: Provide the name, phone, and email for Microsoft to use directly when there are problems with your offer. This contact information isn’t listed in the commercial marketplace.
  - **CSP Program contact** (optional): Provide the name, phone, and email if you opt in to the CSP program, so those partners can contact you with any questions. You can also include a URL to your marketing materials.
- **Useful links** (optional): You can provide links to various resources for users of your offer. For example, forums, FAQs, and release notes.
- **Supporting documents**: You can provide up to three customer-facing documents, such as whitepapers, brochures, checklists, or PowerPoint presentations.
- **Media – Logos**: Provide a PNG file for the **Large** logo. Partner Center will use this to create other required logo sizes. You can optionally replace these with different images later.

These logos are used in different places in the online stores:

  - A small logo appears in AppSource search results and on the AppSource main page and search results page.
  - A medium logo appears when you create a new resource in Microsoft Azure.
  - The Large logo appears on your offer listing page in AppSource.

- **Media - Screenshots**: You must add at least one and up to five screenshots that show how your offer works. Images must be:
  - 1280 x 720 pixels
  - PNG file type
  - Include a caption
- **Media - Videos** (optional): You can add up to four videos that demonstrate your offer. Videos must include:
  - Name
  - URL: Must be hosted on YouTube or Vimeo only.
  - Thumbnail: 1280 x 720 PNG file

> [!Note]
> Your offer must meet the general [commercial marketplace certification policies](/legal/marketplace/certification-policies#100-general) to be published to the commercial marketplace.

## Preview audience

[!INCLUDE [Test drives section](includes/preview-audience.md)]

## Additional sales opportunities

You can choose to opt into Microsoft-supported marketing and sales channels. When creating your offer in Partner Center, you will see two tabs toward the end of the process:

- **Resell through CSPs**: Use this option to allow Microsoft Cloud Solution Providers (CSP) partners to resell your solution as part of a bundled offer. For details, see [Cloud Solution Provider program](cloud-solution-providers.md).

- **Co-sell with Microsoft**: This option lets Microsoft sales teams consider your IP co-sell eligible solution when evaluating their customers’ needs. See [Co-sell option in Partner Center](./partner-center-portal/commercial-marketplace-co-sell.md) for detailed information on how to prepare your offer for evaluation.

## Next steps

After you've considered the planning items described above, select one of the following (also available in the table of contents on the left) to begin creating your offer. <font color="red">[ I think the 2nd column should be deleted and the first column should link to the Create topics in the Azure-docs collection, like Ops, Biz Central, and CE are ]</font>

| Publishing guide    | Notes  |
| :------------------- | :-------------------|
| <strike>Microsoft 365</strike> | <strike>Review the [publishing process and guidelines](/office/dev/store/submit-to-appsource-via-partner-center).</strike> |
| [Dynamics 365 for Operations](d365-operations-offer-setup.md) | When you're building for Enterprise Edition, first review the [publishing process and guidelines](/dynamics365/fin-ops-core/dev-itpro/lcs-solutions/lcs-solutions-app-source). |
| [Dynamics 365 for Business Central](./partner-center-portal/create-new-business-central-offer.md) |   |
| [Dynamics 365 for Customer Engagement](./partner-center-portal/create-new-customer-engagement-offer.md) | First review the [publishing process and guidelines](/dynamics365/customer-engagement/developer/publish-app-appsource). |
| Power Apps | <font color="red">[ If this is a D365 offer, where should it link to? ] </font>|
| [Power BI](partner-center-portal/create-power-bi-app-offer.md) | Review the publishing process and guidelines](/power-bi/developer/office-store). |
|
