---
title: Create a Dynamics 365 for Operations offer in the Commercial Marketplace 
description: How to create a new Dynamics 365 for Operations offer for listing or selling in the Azure Marketplace, AppSource, or through the Cloud Solution Provider (CSP) program using the Commercial Marketplace portal on Microsoft Partner Center. 
author: dsindona 
ms.author: dsindona 
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 01/13/2020
---

# Create a Dynamics 365 for Operations offer

This topic explains how to create a new Dynamics 365 for Operations offer. [Microsoft Dynamics 365 for Finance and Operations](https://dynamics.microsoft.com/finance-and-operations) is an enterprise resource planning (ERP) service that supports advanced finance, operations, manufacturing, and supply chain management. All offers for Dynamics 365 for Operations must go through our certification process.

Before starting, [Create a Commercial Marketplace account in Partner Center](https://docs.microsoft.com/azure/marketplace/partner-center-portal/create-account) if you haven't done so yet. Ensure your account is enrolled in the commercial marketplace program.

>[!NOTE]
> Once an offer has been published, edits to the offer made in Partner Center will only be updated in the system and store fronts after re-publishing. Ensure that you submit the offer for publication after you make changes.

## Create a new offer

1. Sign in to [Partner Center](https://partner.microsoft.com/dashboard/home).
2. In the left-nav menu, select **Commercial Marketplace** > **Overview**.
3. On the Overview page, select **+ New offer** > **Dynamics 365 for operations**.

    ![Illustrates the left-navigation menu.](./media/new-offer-dynamics-365-operations.png)

> [!NOTE]
> After an offer is published, edits made to it in Partner Center only appear in storefronts after republishing the offer. Make sure you always republish after making changes.

## New offer

Enter an **Offer ID**. This is a unique identifier for each offer in your account.

- This ID is visible to customers in the web address for the marketplace offer and Azure Resource Manager templates, if applicable.
- Use only lowercase letters and numbers. It can include hyphens and underscores, but no spaces, and is limited to 50 characters. For example, if you enter **test-offer-1** here, the offer web address will be `https://azuremarketplace.microsoft.com/marketplace/../test-offer-1`.
- The Offer ID can't be changed after you select **Create**.

Enter an **Offer alias**. This is the name used for the offer in Partner Center.

- This name isn't used in the marketplace and is different from the offer name and other values shown to customers.

Select **Create** to generate the offer and continue.

## Offer setup

### How do you want potential customers to interact with this listing offer?

Select the option you'd like to use for this offer.

#### Get it now (free)

List your offer to customers for free by providing a valid URL (beginning with *http* or *https*) where they can access your app.  For example, `https://contoso.com/my-app`

#### Free trial (listing)

List your offer to customers with a link to a free trial by providing a valid URL (beginning with `http` or `https`) where they can get a trial. For example, `https://contoso.com/trial/my-app`. Offer listing free trials are created, managed, and configured by your service and do not have subscriptions managed by Microsoft.

> [!NOTE]
> The tokens your application will receive through your trial link can only be used to obtain user information through Azure Active Directory (Azure AD) to automate account creation in your app. Microsoft accounts are not supported for authentication using this token.

#### Contact me

Collect customer contact information by connecting your Customer Relationship Management (CRM) system. The customer will be asked for permission to share their information. These customer details, along with the offer name, ID, and marketplace source where they found your offer, will be sent to the CRM system that you've configured. For more information about configuring your CRM, see [Customer leads](#customer-leads).

### Test drive

A test drive is a great way to showcase your offer to potential customers by giving them the option to "try before you buy", resulting in increased conversion and the generation of highly qualified leads. To learn more, start with [What is test drive](../what-is-test-drive.md).

To enable a test drive for a fixed period of time, select the **Enable a test drive** check box. To remove test drive from your offer, clear this check box.

### Customer leads

[!INCLUDE [Connect lead management](./includes/connect-lead-management.md)]

For more information, see [Lead management overview](./commercial-marketplace-get-customer-leads.md).

Select **Save draft** before continuing.

## Properties

This page lets you define the categories and industries used to group your offer on the marketplace, your app version, and the legal contracts supporting your offer.

### Category

Select a minimum of one and a maximum of three categories. These categories will be used to place your offer into the appropriate marketplace search areas. Be sure to call out how your offer supports these categories in the offer description.

### Industry

[!INCLUDE [Industry Taxonomy](./includes/industry-taxonomy.md)]

### App version

Enter the version number of your offer. Customers will see this version listed on the offer's detail page.

### Terms and conditions

Provide your own legal terms and conditions in the **Terms and conditions** field. You can also provide the URL where your terms and conditions can be found. Customers will be required to accept these terms before they can try your offer.

Select **Save draft** before continuing.

## Offer listing

This page displays the languages in which your offer will be listed. Currently, **English (United States)** is the only available option.

You will need to define marketplace details (offer name, description, images, etc.) for each language/market. Select the language/market name to provide this info.

> [!NOTE]
> Offer listing content (such as the description, documents, screenshots, terms of use, etc.) is not required to be in English, as long as the offer description begins with the phrase, "This application is available only in [non-English language]." It is also acceptable to provide a *Useful Link URL* to offer content in a language other than the one used in the Offer listing content.

Here's an example of how offer information appears in Microsoft AppSource:

:::image type="content" source="media/example-azure-marketplace-d365-operations.png" alt-text="Illustrates how this offer appears in Microsoft AppSource.":::

#### Call-out descriptions

1. Logo
2. Products
3. Categories
4. Industries
5. Support address (link)
6. Terms of use
7. Privacy policy
8. Offer name
9. Screenshots/videos
10. Description

### Name

The name you enter here will be shown to customers as the title of your offer listing. This field is pre-populated with the text you entered for **Offer alias** when you created the offer, but you can change this value. This name may be trademarked (and you may include trademark or copyright symbols). The name can't be more than 50 characters and can't include any emojis.

### Short description

Provide a short description of your offer, up to 100 characters. This description may be used in marketplace search results.

### Description

[!INCLUDE [Long description-1](./includes/long-description-1.md)]

[!INCLUDE [Long description-2](./includes/long-description-2.md)]

[!INCLUDE [Rich text editor](./includes/rich-text-editor.md)]

### Search keywords

You can optionally enter up to three search keywords to help customers find your offer in the marketplace. For best results, try to use these keywords in your description as well.

### Products your app works with

If you want to let customers know that your app works with specific products, enter up to three product names here.

### Support URLs

This section lets you provide links to help customers understand more about your offer.

#### Help link

Enter the URL where customers can learn more about your offer.

#### Privacy policy URL

Enter the URL to your organization's privacy policy. You are responsible for ensuring your app complies with privacy laws and regulations, and for providing a valid privacy policy.

### Contacts

In this section, provide the name, email, and phone number for a **Support contact** and an **Engineering contact**. This information isn't shown to customers, but will be available to Microsoft, and may be provided to CSP partners.

In the **Support contact** section, provide the **Support URL** where CSP partners can find support for your offer.

### Supporting documents

Provide at least one (and up to three) related marketing documents here, such as white papers, brochures, checklists, or presentations. These documents must be in PDF format.

### Marketplace images

In this section, you can provide logos and images that will be used when showing your offer to customer. All images must be in .png format.

>[!Note]
>If you have an issue uploading files, make sure your local network does not block the https://upload.xboxlive.com service used by Partner Center.

#### Store logos

Provide your offer's logo in two pixel sizes:

- **Small** (48 x 48)
- **Large** (216 x 216)


#### Screenshots

Add screenshots that show how your offer works. At least one screenshot is required, and you can add up to five. All screenshots must be 1280 x 720 pixels.

#### Videos

You can optionally add up to four videos that demonstrate your offer. These videos should be hosted on YouTube and/or Vimeo. For each one, enter the video's name, its URL, and a thumbnail image of the video (1280 x 720 pixels)

#### Additional marketplace listing resources

[Best practices for marketplace offer listings](https://docs.microsoft.com/azure/marketplace/gtm-offer-listing-best-practices)

Select **Save draft** before continuing.

## Availability

This page gives you options about where and how to make your offer available.

### Markets

This section lets you specify the markets in which your offer should be available. To do so, select **Edit markets,** which will display the **Market selection** popup window.

By default, no markets are selected. Select at least one market to publish your offer. Click  **Select all** to make your offer available in every possible market, or select the specific markets that you want to add. Once you've finished, select **Save**.

Your selections here apply only to new acquisitions; if someone already has your app in a certain market, and you later remove that market, the people who already have the offer in that market can continue to use it, but no new customers in that market will be able to get your offer.

> [!IMPORTANT]
> It is your responsibility to meet any local legal requirements, even if those requirements aren't listed here or in Partner Center.

Keep in mind that even if you select all markets, local laws and restrictions or other factors may prevent certain offers from being listed in some countries and regions.

### Preview audience

Before you publish your offer live to the broader marketplace offer, you'll first need to make it available to a limited **Preview audience**. Enter a **Hide key** (any string using only lowercase letters and/or numbers) here. Members of your preview audience can use this hide key as a token to view a preview of your offer in the marketplace.

Then, when you're ready to make your offer available and remove the preview restriction, you'll need to remove the **Hide key** and publish again.

Select **Save draft** before continuing.

## Technical configuration

This page defines the technical details used to connect to your offer. This connection enables us to provision your offer for the end customer if they choose to acquire it.

### Solution identifier

Provide the solution identifier (GUID) for your solution.

To find your solution identifier:

1. In Microsoft Dynamics Lifecycle Services (LCS), select **Solution Management**.
2. Select your solution, then look for the **Solution Identifier** in the **Package overview**. If the identifier is blank, select **Edit** and republish your package, then try again.

### Release version

Select the version of Dynamics 365 for Finance and Operations that this solution works with.

Select **Save draft** before continuing.

## Test drive technical configuration

This page lets you set up a demonstration ("test drive") that allows customers to try your offer before purchasing it. Learn more in [What is test drive](../what-is-test-drive.md).

To enable a test drive, select the **Enable a test drive** check box on the [Offer setup](#test-drive) tab. To remove test drive from your offer, clear this check box.

When you've finished setting up your test drive, select **Save draft** before continuing.

## Supplemental content

This page lets you provide additional information about your offer to help us validate your offer. This information is not shown to customers or published to the marketplace.

### Validation assets

Upload a [Customization Analysis Report (CAR)](https://docs.microsoft.com/dynamics365/unified-operations/dev-itpro/dev-tools/customization-analysis-report) in this section. This report is generated by analyzing your customization and extension models, based on a predefined set of best practice rules.

This file must be in .xls or .xlsx format. If you have more than one report, you can upload a .zip file containing all of the reports.

### Does solution include localizations?

Select **Yes** if the solution enables use of local standards and policies (for example, if it accommodates the different payroll rules required by different countries/regions). Otherwise, select **No**.

### Does solution enable translations?

Answer **Yes** if the text in your solution can be translated into other languages. Otherwise, select **No**.

Select **Save draft** before continuing.

## Publish

### Submit offer to preview

Once you have completed all the required sections of the offer, select **Review and publish** at the upper-right corner of the portal.

If it's your first time publishing this offer, you can:

- See the completion status for each section of the offer.
    - **Not started** – The section has not been touched and should be completed.
    - **Incomplete** – The section has errors that need to be fixed or requires more information to be provided. Go back to the section(s) and update it.
    - **Complete** – The section is complete, all required data has been provided and there are no errors. All sections of the offer must be in a complete state before you can submit the offer.
- In the **Notes for certification** section, provide testing instructions to the certification team to ensure that your app is tested correctly, in addition to any supplementary notes helpful for understanding your app.
- Submit the offer for publishing by selecting **Submit**. We will send you an email to let you know when a preview version of the offer is available for you to review and approve. Return to Partner Center and select **Go-live** for the offer to publish your offer to the public.

## Next step

- [Update an existing offer in the Commercial Marketplace](./update-existing-offer.md)
