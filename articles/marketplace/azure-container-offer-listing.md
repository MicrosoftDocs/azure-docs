---
title: Configure Azure Container offer listing details on Microsoft AppSource
description: Configure Azure Container offer listing details on Microsoft AppSource.
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
author: keferna
ms.author: keferna
ms.date: 03/30/2021
---

# Configure Azure Container offer listing details

This page lets you define the offer details such as offer name, description, links, contacts, logos, and screenshots.

> [!NOTE]
> Provide offer listing details in one language only. English is not required as long as the offer description begins with the phrase, "This application is available only in [non-English language]." It is also acceptable to provide a *Useful link URL* to offer content in a language other than the one used in the Offer listing content.

## Marketplace details

The **Name** you enter here is shown to customers as the title of the offer. This field is pre-populated with the name you entered for **Offer alias** when you created the offer, but you can change it. The name:

- Can include trademark and copyright symbols.
- Must be 50 characters or less.
- Can't include emojis.

Provide a short description of your offer for the **Search results summary** (up to 100 characters). This description may be used in marketplace search results.

Provide a **Short description** of your offer, up to 256 characters. This will appear in search results and on your offer's details page.

[!INCLUDE [Long description-1](includes/long-description-1.md)]

[!INCLUDE [Long description-2](includes/long-description-2.md)]

Use HTML tags to format your description so it's more engaging. For a list of allowed tags, see [Supported HTML tags](supported-html-tags.md).

Enter the web address (URL) of your organization's privacy policy. Ensure your offer complies with privacy laws and regulations. You must also post a valid privacy policy on your website.

## Useful links

Provide supplemental online documents about your offer. You can add up to 25 links. To add a link, select **+ Add a link** and then complete the following fields:

- **Name** – Customers will see this on your offer's details page.
- **Link** (URL) – Enter a link for customers to view your online document. The link must start with http:// or https://.

### Contact information

Provide the name, email, and phone number for a **Support contact**, **Engineering contact**, and **Cloud Solution Provider Program** contact. This information is not shown to customers, but will be available to Microsoft, and may be provided to CSP partners.

In the **Support contact** section, provide the **Support website** where Azure Global and Azure Government (if applicable) customers can reach your support team.

## Marketplace media

Provide logos and images to use with your offer. All images must be in PNG format. Blurry images will cause your submission to be rejected.

[!INCLUDE [logo tips](includes/graphics-suggestions.md)]

>[!NOTE]
>If you have an issue uploading files, ensure that your local network doesn't block the https://upload.xboxlive.com service that's used by Partner Center.

### Logos

Provide a PNG file for the **Large** size logo. Partner Center will use this to create other required sizes. You can optionally replace this with a different image later.

These logos are used in different places in the listing:

[!INCLUDE [logos-appsource-only](includes/logos-appsource-only.md)]

[!INCLUDE [Logo tips](includes/graphics-suggestions.md)]

### Screenshots

Add at least one (and up to five) screenshots that show how your offer works. All screenshots must be 1280 x 720 pixels and in PNG format. Add a caption for each screenshot.

### Videos

Add up to five optional videos that demonstrate your offer. They should be hosted on an external video service. Enter each video's name, web address, and a thumbnail PNG image of the video at 1280 x 720 pixels.

For additional marketplace listing resources, see [Best practices for marketplace offer listings](gtm-offer-listing-best-practices.md).

Select **Save draft** before continuing to the next tab in the left-nav menu, **Preview audience**.
<!-- #### Offer examples

The following examples show how the offer listing fields appear in different places of the offer.

This shows search results in Azure Marketplace:

[![Illustrates the search results in Azure Marketplace](media/azure-container/azure-create-7-search-results-mkt-plc-small.png)](media/azure-container/azure-create-7-search-results-mkt-plc.png#lightbox)

This shows the **Offer listing** page in Azure portal:

:::image type="content" source="media/azure-container/azure-create-8-offer-listing-portal.png" alt-text="Illustrates the Offer listing page in Azure portal.":::

This shows search results in Azure portal:

[![Illustrates the search results in Azure portal.](media/azure-container/azure-create-9-search-results-portal-small.png)](media/azure-container/azure-create-9-search-results-portal.png#lightbox) -->

## Next steps

- [Set offer preview audience](azure-container-preview-audience.md)
