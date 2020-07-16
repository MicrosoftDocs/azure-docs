---
title: Create a Power BI app offer in Microsoft commercial marketplace
description: Learn how to create and publish a Power BI app offer to Microsoft AppSource.
author: anbene
ms.author: mingshen
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 05/19/2020
---

# Create a Power BI app for Microsoft AppSource

This article describes how to create and publish a Power BI app offer to Microsoft [AppSource](https://appsource.microsoft.com/).

Before starting, [Create a Commercial Marketplace account in Partner Center](https://docs.microsoft.com/azure/marketplace/partner-center-portal/create-account) if you haven't done so yet. Ensure your account is enrolled in the commercial marketplace program.

## Create a new offer

1. Sign in to [Partner Center](https://partner.microsoft.com/dashboard/home).
2. In the left-nav menu, select **Commercial Marketplace** > **Overview**.
3. On the Overview page, select **+ New offer** > **Power BI Service App**.

   ![Illustrates the left-navigation menu.](./media/new-offer-power-bi-app.png)

> [!NOTE]
> After an offer is published, edits made to it in Partner Center only appear in storefronts after republishing the offer. Make sure you always republish after making changes.

> [!IMPORTANT]
> If **Power BI Service App** isn't shown or enabled, your account doesn't have permission to create this offer type. Please check that you've met all the [requirements](create-power-bi-app-overview.md) for this offer type, including registering for a developer account.

## New offer

Enter an **Offer ID**. This is a unique identifier for each offer in your account.

- This ID is visible to customers in the web address for the marketplace offer and Azure Resource Manager templates, if applicable.
- Use only lowercase letters and numbers. It can include hyphens and underscores, but no spaces, and is limited to 50 characters. For example, if you enter **test-offer-1** here, the offer web address will be `https://azuremarketplace.microsoft.com/marketplace/../test-offer-1`.
- The Offer ID can't be changed after you select **Create**.

Enter an **Offer alias**. This is the name used for the offer in Partner Center.

- This name isn't used in the marketplace and is different from the offer name and other values shown to customers.
- The Offer alias can't be changed after you select **Create**.

Select **Create** to generate the offer and continue.

## Offer overview

This page shows a visual representation of the steps required to publish this offer (both completed and upcoming) and how long each step should take to complete.

It includes links to perform operations on this offer based on the selection you make. For example:

- If the offer is a draft - [Delete draft offer](https://docs.microsoft.com/azure/marketplace/partner-center-portal/update-existing-offer#delete-a-draft-offer)
- If the offer is live - [Stop selling the offer](https://docs.microsoft.com/azure/marketplace/partner-center-portal/update-existing-offer#stop-selling-an-offer-or-plan)
- If the offer is in preview - [Go-live](https://docs.microsoft.com/azure/marketplace/partner-center-portal/publishing-status#publisher-approval)
- If you haven't completed publisher sign-out - [Cancel publishing](https://docs.microsoft.com/azure/marketplace/partner-center-portal/update-existing-offer#cancel-publishing)

## Offer setup

### Customer leads

When publishing your offer to the marketplace with Partner Center, you must connect it to your Customer Relationship Management (CRM) system. This lets you receive customer contact information as soon as someone expresses interest in or uses your product.

1. Select a lead destination where you want us to send customer leads. Partner Center supports the following CRM systems:

    - [Dynamics 365](https://docs.microsoft.com/azure/marketplace/partner-center-portal/commercial-marketplace-lead-management-instructions-dynamics) for Customer Engagement
    - [Marketo](https://docs.microsoft.com/azure/marketplace/partner-center-portal/commercial-marketplace-lead-management-instructions-marketo)
    - [Salesforce](https://docs.microsoft.com/azure/marketplace/partner-center-portal/commercial-marketplace-lead-management-instructions-salesforce)

    > [!NOTE]
    > If your CRM system isn't listed above, use [Azure Table](https://docs.microsoft.com/azure/marketplace/partner-center-portal/commercial-marketplace-lead-management-instructions-azure-table) or [Https Endpoint](https://docs.microsoft.com/azure/marketplace/partner-center-portal/commercial-marketplace-lead-management-instructions-https) to store customer lead data. Then export the data to your CRM system.

2. Connect your offer to the lead destination when publishing in Partner Center.
3. Confirm that the connection to the lead destination is configured properly. After you publish it in Partner Center, we'll validate the connection and send you a test lead. While you preview the offer before it goes live, you can also test your lead connection by trying to purchase the offer yourself in the preview environment.
4. Make sure the connection to the lead destination stays updated so you don't lose any leads.

Here are some additional lead management resources:

- [Lead management overview](https://docs.microsoft.com/azure/marketplace/partner-center-portal/commercial-marketplace-get-customer-leads)
- [Lead management FAQs](https://docs.microsoft.com/azure/marketplace/lead-management-for-cloud-marketplace#frequently-asked-questions)
- [Common lead configuration errors](https://docs.microsoft.com/azure/marketplace/lead-management-for-cloud-marketplace#common-lead-configuration-errors-during-publishing-on-cloud-partner-portal)
- [Lead Management Overview](https://assetsprod.microsoft.com/mpn/cloud-marketplace-lead-management.pdf) PDF (make sure your pop-up blocker is turned off)

Select **Save draft** before continuing.

## Properties

This page lets you define the categories and industries used to group your offer on the marketplace, your app version, and the legal contracts that support your offer.

### Category

Select a minimum of one and a maximum of three categories. These categories are used to place your offer into the appropriate marketplace search areas and are shown on your offer details page. In the offer description, explain how your offer supports these categories.

### Industry

Optionally, select up to two industries and two verticals under each industry. While categories are used for displaying your offer, industry and verticals are used in search filters and are applied in the Storefront. If your offer targets a specific industry and/or vertical, use the offer description to explain how your offer supports the selected industries or verticals. If your offer isn't industry-specific, leave this section blank.

> [!NOTE]
> As we work to introduce new industries and verticals to improve the offer discovery experience, some industries or verticals may not yet be visible on the Storefront. Industries and verticals marked with an (*) will be available at a future date. All published offers are discoverable via keyword search.
<p>&nbsp;

| **Industry** | **Subindustry** |
| --- | --- |
| *Automotive | *Automotive |
| Agriculture | *Other - Unsegmented |
| Distribution | *Wholesale<br>Parcel and Package Shipping |
| Education | *Higher Education<br>*Primary and Secondary Education / K-12<br>*Libraries and Museums |
| Financial Services | *Banking and Capital Markets<br>*Insurance |
| Government | *Defense and Intelligence (used to be called National and Public Security)<br>*Public Safety and Justice<br>*Civilian Government |
| Healthcare (used to be called Health) | *Health Payor<br>*Health Provider<br>*Pharmaceuticals |
| Manufacturing and Resources (used to be called Manufacturing) | *Chemical and Agrochemical<br>*Discrete Manufacturing<br>*Energy |
| Retail and Consumer Goods (used to be called Retail) | *Consumer Goods<br>*Retailers |
| *Media and Communications (used to be called Media and Entertainment) | *Media and Entertainment<br>*Telecommunications |
| Professional Services | *Legal<br>*Partner Professional Services |
| *Architecture and Construction (used to be called Architecture Engineering) | *Other - Unsegmented |
| *Hospitality and Travel | *Hotels and Leisure<br>*Travel and Transportation<br>*Restaurants and Food Services |
| *Other Public Sector Industries | *Forestry and Fishing<br>*Nonprofits |
| *Real Estate | *Other - Unsegmented |

### Legal

#### Terms and conditions

To provide your own custom terms and conditions, enter up to 10,000 characters in the **Terms and conditions** box. If your terms and conditions require a longer description, enter a single web link to where they can be found. It will display to customers as an active link.

Customers must accept these terms before they can try your offer.

Select **Save draft** before continuing to the next section, Offer listing.

## Offer listing

Here you'll define the offer details that are displayed in the marketplace. This includes the offer name, description, images, and so on.

### Language

Select the language in which your offer will be listed. Currently, **English (United States)** is the only available option.

Define marketplace details (such as offer name, description, and images) for each language/market. Select the language/market name to provide this info.

> [!NOTE]
> Offer details are not required to be in English if the offer description begins with the phrase, "This application is available only in [non-English language]." It's also okay to provide a Useful Link to offer content in a language that's different from the one used in the offer listing.

Here's an example of how offer information appears in Microsoft AppSource (any listed prices are for example purposes only and not intended to reflect actual costs):

:::image type="content" source="media/example-power-bi-app.png" alt-text="Illustrates how this offer appears in Microsoft AppSource.":::

#### Call-out descriptions

1. Logo
2. Products
3. Categories
4. Industries
5. Support address (link)
6. Terms of use
7. Privacy policy
8. Offer name
9. Summary
10. Description
11. Screenshots/videos

### Name

The name you enter here displays as the title of your offer. This field is pre-filled with the text you entered in the **Offer alias** box when you created the offer. You can change this name later.

The name:

- Can be trademarked (and you may include trademark or copyright symbols).
- Can't be more than 50 characters long.
- Can't include emojis.

### Search results summary

Provide a short description of your offer. This can be up to 100 characters long and is used in marketplace search results.

### Description

[!INCLUDE [Long description-1](./includes/long-description-1.md)]

[!INCLUDE [Long description-2](./includes/long-description-2.md)]

[!INCLUDE [Long description-3](./includes/long-description-3.md)]

### Search keywords

Enter up to three optional search keywords to help customers find your offer in the marketplace. For best results, also use these keywords in your description.

### Help/Privacy Web addresses

Provide links to help customers better understand your offer.

#### Help link

Enter the web address where customers can learn more about your offer.

#### Privacy policy URL

Enter the web address to your organization's privacy policy. You're responsible for ensuring that your offer complies with privacy laws and regulations. You're also responsible for posting a valid privacy policy on your website.

### Contact Information

You must provide the name, email, and phone number for a **Support contact** and an **Engineering contact**. This information isn't shown to customers. It is available to Microsoft and may be provided to Cloud Solution Provider (CSP) partners.

- Support contact (required): For general support questions.
- Engineering contact (required): For technical questions and certification issues.
- CSP Program contact (optional): For reseller questions related to the CSP program.

In the **Support contact** section, provide the web address of the **Support website** where partners can find support for your offer.

### Supporting documents

Provide at least one and up to three related marketing documents in PDF format. For example, white papers, brochures, checklists, or presentations.

### Marketplace images

Provide logos and images to use with your offer. All images must be in PNG format. Blurry images will be rejected.

>[!NOTE]
>If you have an issue uploading files, make sure your local network does not block the `https://upload.xboxlive.com` service used by Partner Center.

#### Store logos

Provide PNG files of your offer's logo in two pixel sizes:
- **Small** (48 x 48)
- **Large** (216 x 216)

Both logos are required and are used in different places in the marketplace listing.

#### Screenshots

Add at least one and up to five screenshots that show how your offer works. Each must be 1280 x 720 pixels in size and in PNG format.

#### Videos (optional)

Add up to five videos that demonstrate your offer. Enter the video's name, its web address, and thumbnail PNG image of the video at 1280 x 720 pixels in size.

#### Additional marketplace listing resources

To learn more about creating offer listings, see [Offer listing best practices](https://docs.microsoft.com/azure/marketplace/gtm-offer-listing-best-practices).

## Technical configuration

Promote your app in Power BI Service to production and provide the Power BI app installer link that enables customers to install your app. For more information, see [Publish apps with dashboards and reports in Power BI](https://docs.microsoft.com/power-bi/service-create-distribute-apps).

## Supplemental content

Provide additional information about your offer to help us validate it. This information isn't shown to customers or published to the marketplace.

### Validation assets

Optionally, add instructions (up to 3,000 characters) to help the Microsoft validation team configure, connect, and test your app. Include typical configuration settings, accounts, parameters, or other information that can be used to test the Connect Data option. This information is visible only to the validation team and is used only for validation purposes.

## Review and publish

After you've completed all the required sections of the offer, you can submit your offer to review and publish.

In the top-right corner of the portal, select **Review and publish**.

On the review page you can:

- See the completion status for each section of the offer. You can't publish until all sections of the offer are marked as complete.
  - **Not started** - The section hasn't been started and needs to be completed.
  - **Incomplete** - The section has errors that need to be fixed or requires that you provide more information. See the sections earlier in this document for guidance.
  - **Complete** - The section has all required data and there are no errors. All sections of the offer must be complete before you can submit the offer.
- Provide testing instructions to the certification team to ensure your app is tested correctly. Also, provide any supplementary notes that are helpful for understanding your offer.

To submit the offer for publishing, select **Publish**.

We'll send you an email to let you know when a preview version of the offer is available to review and approve. To publish your offer to the public, go to Partner Center and select **Go-live**.
