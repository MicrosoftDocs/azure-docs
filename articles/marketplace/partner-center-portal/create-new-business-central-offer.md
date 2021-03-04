---
title: Create a Dynamics 365 Business Central offer in Microsoft AppSource
description: How to create a Dynamics 365 for Business Central offer in Microsoft AppSource. List or sell your offer in AppSource or through the Cloud Solution Provider (CSP) program.
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
author: navits09
ms.author: navits
ms.date: 12/02/2020
---

# Create a Dynamics 365 for Business Central offer

This article describes how to create a new Dynamics 365 Business Central offer. [Microsoft Dynamics 365 Business Central](https://dynamics.microsoft.com/business-central) is an enterprise resource planning (ERP) service that handles a wide range of business processes, including finance, operations, supply chain, CRM, and project management and electronic commerce. Premium packages also support classic deployment model and manufacturing. All offers for Dynamics 365 Business Central must go through our certification process.

Before starting, [Create a Commercial Marketplace account in Partner Center](create-account.md) if you haven't done so yet. Ensure your account is enrolled in the commercial marketplace program.

>[!NOTE]
> Once an offer is published, edits to the offer will only be updated in Partner Center and the online store after you resubmit the offer for publication.

## Create a new offer

1. Sign in to [Partner Center](https://partner.microsoft.com/dashboard/home).
2. In the left-nav menu, select **Commercial Marketplace** > **Overview**.
3. On the Overview page, select **+ New offer** > **Dynamics 365 business central**.

    ![Illustrates the left-navigation menu.](./media/new-offer-dynamics-365-business-central.png)

## New offer

Enter an **Offer ID**. This is a unique identifier for each offer in your account.

- This ID is visible to customers in the web address for the marketplace offer and Azure Resource Manager templates, if applicable.
- The Offer ID combined with the Publisher ID must be under 40 characters in length.
- Use only lowercase letters and numbers. It can include hyphens and underscores, but no spaces. For example, if your Publisher ID is `testpublisherid` and you enter **test-offer-1**, the offer web address will be `https://appsource.microsoft.com/product/dynamics-365/testpublisherid.test-offer-1`.
- This ID can't be changed after you select **Create**.

Enter an **Offer alias**. This is the name used for the offer in Partner Center.

- This name isn't used in the marketplace and is different from the offer name and other values shown to customers.
- This name can't be changed after you select **Create**.

Select **Create** to generate the offer and continue.

## Offer setup

### Alias

Enter a descriptive name that we'll use to refer to this offer solely within Partner Center. This name (pre-populated with what your entered when you created the offer) won't be used in the marketplace and is different than the offer name shown to customers. If you want to update the offer name later, go to the [Offer Listing](#offer-listing) page.

### Setup details

Select the **Package type** that applies to your offer:

- An **Add-on** app extends the experience and the existing functionality of Dynamics 365 Business Central. For details, see [Add-on apps](/dynamics365/business-central/dev-itpro/developer/readiness/readiness-add-on-apps).
- A **Connect** app can be used in the scenario where there must be established a point-to-point connection between Dynamics 365 Business Central and a third-party solution or service. For details, see [Connect Apps](/dynamics365/business-central/dev-itpro/developer/readiness/readiness-connect-apps).

For **How do you want potential customers to interact with this listing offer?**, select the option you'd like to use for this offer.

- **Get it now (free)** – List your offer to customers for free.
- **Free trial (listing)** – List your offer to customers with a link to a free trial. Offer listing free trials are created, managed, and configured by your service and do not have subscriptions managed by Microsoft.

    > [!NOTE]
    > The tokens your application will receive through your trial link can only be used to obtain user information through Azure Active Directory (Azure AD) to automate account creation in your app. Microsoft accounts are not supported for authentication using this token.

- **Contact me** – Collect customer contact information by connecting your Customer Relationship Management (CRM) system. The customer will be asked for permission to share their information. These customer details, along with the offer name, ID, and marketplace source where they found your offer, will be sent to the CRM system that you've configured. For more information about configuring your CRM, see [Customer leads](#customer-leads).

### Test drive

A test drive is a great way to showcase your offer to potential customers by giving them the option to "try before you buy", resulting in increased conversion and the generation of highly qualified leads. To learn more, start with [What is test drive](../what-is-test-drive.md).

To enable a test drive for a fixed period of time, select the **Enable a test drive** check box. To remove test drive from your offer, clear this check box.

### Customer leads

[!INCLUDE [Connect lead management](./includes/connect-lead-management.md)]

For more information, see [Lead management overview](./commercial-marketplace-get-customer-leads.md).

Select **Save draft** before continuing.

## Properties

This page lets you define the categories and industries used to group your offer on the marketplace, your app version, and the legal contracts supporting your offer.

### Categories

Select categories and subcategories to place your offer in the appropriate marketplace search areas. Be sure to describe how your offer supports these categories in the offer description. Select:

- At least one and up to two categories, including a primary and a secondary category (optional).
- Up to two subcategories for each primary and/or secondary category. If no subcategory is applicable to your offer, select **Not applicable**.

See the full list of categories and subcategories in [Offer Listing Best Practices](../gtm-offer-listing-best-practices.md).

### Industries

[!INCLUDE [Industry Taxonomy](includes/industry-taxonomy.md)]

### App version

Enter the version number of your offer. Customers will see this version listed on the offer's detail page.

### Terms and conditions

Provide your own legal terms and conditions here. You can also provide the address where your terms and conditions can be found. Customers will be required to accept these terms before they can try your offer.

Select **Save draft** before continuing.

## Offer listing

This page lets you define offer details such as offer name, description, links, and contacts.

> [!NOTE]
> Provide offer listing details in one language only. It is not required to be in English, as long as the offer description begins with the phrase, "This application is available only in [non-English language]." It is also acceptable to provide a *Useful link URL* to offer content in a language other than the one used in the Offer listing content.

Here's an example of how offer information appears in Microsoft AppSource (any listed prices are for example purposes only and not intended to reflect actual costs):
<!-- update screen? -->
:::image type="content" source="media/example-d365-business-central.png" alt-text="Illustrates how this offer appears in Microsoft AppSource.":::

#### Call-out descriptions

1. Logo
2. Products
3. Categories
4. Support address (link)
5. Terms of use
6. Privacy policy
7. Offer name
8. Summary
9. Description
10. Screenshots/videos

### Marketplace details

The **Name** you enter here will be shown to customers as the title of your offer listing. This field is pre-populated with the text you entered for **Offer alias** when you created the offer, but you can change this value. This name may be trademarked (and you may include trademark or copyright symbols). The name can't be more than 50 characters and can't include any emojis.

Provide a short description of your offer, up to 100 characters, for the **Search results summary**. This description may be used in marketplace search results.

[!INCLUDE [Long description-1](./includes/long-description-1.md)]

[!INCLUDE [Long description-2](./includes/long-description-2.md)]

[!INCLUDE [Rich text editor](./includes/rich-text-editor.md)]

You can optionally enter up to three **Search keywords** to help customers find your offer in the marketplace. For best results, also use these keywords in your description.

If you want to let customers know what **Products your app works with**, enter up to three product names.

### Help/Privacy URLs

Enter the **Help link for your app** (URL) where customers can learn more about your offer. Your Help URL cannot be the same as your Support URL.

Enter the **Privacy policy link** (URL) to your organization's privacy policy. You are responsible for ensuring your app complies with privacy laws and regulations, and for providing a valid privacy policy.

### Contact information

Provide the name, email, and phone number for a **Support contact** and an **Engineering contact**. This information is not shown to customers, but will be available to Microsoft and may be provided to CSP partners.

In the **Support contact** section, provide the **Support URL** where CSP partners can find support for your offer. Your Support URL cannot be the same as your Help URL.

### Supporting documents

Provide at least one (and up to three) related marketing documents here, such as white papers, brochures, checklists, or presentations, in PDF format.

### Marketplace media

Provide logos and images that will be used when showing your offer to customers. All images must be in PNG format.

[!INCLUDE [logo tips](../includes/graphics-suggestions.md)]

>[!Note]
>If you have an issue uploading files, make sure your local network does not block the https://upload.xboxlive.com service used by Partner Center.

#### Logos

Provide a PNG file for the **Large** size logo. Partner Center will use this to create other required sizes. You can optionally replace this with a different image later.

These logos are used in different places in the listing:

[!INCLUDE [logos-appsource-only](../includes/logos-appsource-only.md)]

[!INCLUDE [Logo tips](../includes/graphics-suggestions.md)]

#### Screenshots

Add screenshots that show how your offer works. At least three screenshots are required, and you can add up to five. All screenshots must be 1280 x 720 pixels and in PNG format.

#### Videos

You can optionally add up to four videos that demonstrate your offer. Videos must be hosted on an external site. For each one, enter the video's name, its address, and a thumbnail image of the video (1280 x 720 pixels).

For additional marketplace listing resources, see [Best practices for marketplace offer listings](../gtm-offer-listing-best-practices.md).

Select **Save draft** before continuing.

## Availability

This page lets you define where and how to make your offer available.

### Markets

To specify the markets where your offer should be available, select **Edit markets** to display the **Market selection** popup window.

Select at least one market. Choose **Select all** to make your offer available in every possible market, or select only the specific markets you want. When you're finished, select **Save**.

Your selections here apply only to new acquisitions; if someone already has your app in a certain market and you later remove that market, the people who already have the offer in that market can continue to use it, but no new customers in that market will be able to get your offer.

> [!IMPORTANT]
> It is your responsibility to meet any local legal requirements, even if those requirements aren't listed here or in Partner Center. Even if you select all markets, local laws, restrictions, or other factors may prevent certain offers from being listed in some countries and regions.

### Preview audience

Before you publish your offer live to the broader marketplace offer, you'll first need to make it available to a limited **Preview audience**. Enter a **Hide key** (any string using only lowercase letters and/or numbers) here. Members of your preview audience can use this hide key as a token to view a preview of your offer in the marketplace.

Then, when you're ready to make your offer available and remove the preview restriction, you'll need to remove the **Hide key** and publish again.

Select **Save draft** before continuing.

## Technical configuration

This page defines the technical details used to connect to your offer. This connection enables us to provision your offer for the end customer if they choose to acquire it.

### File upload

If you previously selected **Add On**, where you'll upload your offer's package file, along with the package files for any extension on which it has dependencies.

#### Extension package file

Upload the extension package file (.app) file for your offer.

#### Library extension package file

Required if your offer must be installed along with another extension that will not be published to the marketplace. If so upload its .app file here.

>[!NOTE]
>The dependency package file is no longer used. Upload a library extension package file instead.

Select **Save draft** before continuing.

<!-- ## Test drive technical configuration

This page lets you set up a demonstration ("test drive") that allows customers to try your offer before purchasing it. Learn more in [What is test drive](../what-is-test-drive.md).

To enable a test drive, select the **Enable a test drive** check box on the [Offer setup](#test-drive) tab. To remove test drive from your offer, clear this check box.

When you've finished setting up your test drive, select **Save draft** before continuing.
-->
## Supplemental content

This page lets you provide additional information to help us validate your offer. This information is not shown to customers or published to the marketplace.

### Target release

Indicate which release of Microsoft Dynamics Business Central your solution targets: **Current**, **Next Major**, or **Next Minor**. This information lets us test your solution appropriately.

### Supported editions

If your offer requires the Premium edition of Microsoft Dynamics 365 Business Central, select **Premium** only. Otherwise, select both **Essentials** and **Premium**.

### Key usage scenario

Upload a PDF file that lists your offer's key usage scenarios. All scenarios listed here may be verified by our validation team before we approve your offer for the marketplace.

### Test accounts

If a test account is needed in order for our certification team to properly review your offer, upload a .pdf, .doc, or .docx file with your **Test accounts** information.

### App tests automation

If your offer is an Add-on app, you must upload an **App tests automation** file (.app). This file is not applicable to Connect apps.

Select **Save draft** before continuing.

## Publish

### Submit offer to preview

After completing all required sections of the offer, select **Review and publish** in the upper-right corner of the portal.

If it's your first time publishing this offer, you can:

- See the completion status for each section of the offer.
    - **Not started** - Section has not been touched and needs to be completed.
    - **Incomplete** - Section has errors that need to be fixed or requires more information. Go back to the section(s) and update it.
    - **Complete** - Section is complete, all required data has been provided and there are no errors. All sections of the offer must be in a complete state before you can submit the offer.
- In the **Notes for certification** section, provide testing instructions to the certification team to ensure that your app is tested correctly, in addition to any supplementary notes helpful for understanding your app.
- Submit the offer for publishing by selecting **Submit**. We will email you when a preview version of the offer is available to review and approve. Return to Partner Center and select **Go-live** to publish your offer to the public.

## Next steps

- [Update an existing offer in the Commercial Marketplace](./update-existing-offer.md)