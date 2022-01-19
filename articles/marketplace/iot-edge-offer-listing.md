---
title: Configure IoT Edge Module offer listing details on Azure Marketplace
description: Configure IoT Edge Module offer listing details on Azure Marketplace.
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
author: aarathin
ms.author: aarathin
ms.date: 05/21/2021
---

# Configure IoT Edge Module offer listing details

This page lets you define the offer details such as offer name, description, links, contacts, logos, and screenshots.

> [!NOTE]
> Provide offer listing details in one language only. English is not required as long as the offer description begins with the phrase, "This application is available only in [non-English language]." It is also acceptable to provide a *Useful link URL* to offer content in a language other than the one used in the Offer listing content.

Here's an example of how offer information appears in Azure Marketplace (any listed prices are for example purposes only and not intended to reflect actual costs):

:::image type="content" source="media/iot-edge/example-iot-azure-marketplace-offer.png" alt-text="Illustrates how this offer appears in Azure Marketplace.":::

##### Call-out descriptions

1. Logo
1. Categories
1. Support address (link)
1. Terms of use
1. Privacy policy (link)
1. Offer name
1. Offer summary
1. Description
1. Learn More links
1. Screenshots/videos

<br>Here's an example of how offer information appears in Azure Marketplace search results:

:::image type="content" source="media/iot-edge/example-iot-azure-marketplace-offer-search-results.png" alt-text="Illustrates how this offer appears in Azure Marketplace search results.":::

##### Call-out descriptions

1. Small logo
2. Offer name
3. Search results summary

<br>Here's an example of how offer information appears in the Azure portal:

:::image type="content" source="media/iot-edge/example-iot-azure-portal-offer.png" alt-text="Illustrates how this offer appears in the Azure portal.":::

##### Call-out descriptions

1. Name
2. Description
3. Useful links
4. Screenshots

<br>Here's an example of how offer information appears in the Azure portal search results:

:::image type="content" source="media/iot-edge/example-iot-azure-portal-offer-search-results.png" alt-text="Illustrates how this offer appears in the Azure portal search results.":::

##### Call-out descriptions

1. Small logo
2. Offer name
3. Search results summary

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

Enter the **Privacy policy link** (URL) to your organization's privacy policy. You are responsible for ensuring your app complies with privacy laws and regulations, and for providing a valid privacy policy.

## Useful links

Provide supplemental online documents about your offer. You can add up to 25 links. To add a link, select **+ Add a link** and then complete the following fields:

- **Title** – Customers will see the title on your offer's details page.
- **Link (URL)** – Enter a link for customers to view your online document. The link must start with `http://` or `https://`.

Add at least one link to your documentation and one link to the compatible IoT Edge devices from the [Azure IoT device catalog](https://catalog.azureiotsolutions.com/).

### Contact information

Provide the name, email, and phone number for a **Support contact**, **Engineering contact**, and **Cloud Solution Provider Program contact**. This information is not shown to customers, but will be available to Microsoft, and may be provided to CSP partners.

In the **Cloud Solution Provider Program contact** section, provide the **Support website for Azure Global customers** address where partners can find support for your offer based on whether the offer is available in Azure Global, Azure Government, or both.

In the **Support contact** section, provide the **CSP Program Marketing Materials** address where CSP partners can find marketing materials and support for your offer.

## Marketplace media

Provide logos and images to use with your offer. All images must be in PNG format. Blurry images will cause your submission to be rejected.

>[!NOTE]
>If you have an issue uploading files, ensure that your local network doesn't block the https://upload.xboxlive.com service that's used by Partner Center.

### Logos

Provide a PNG file for the **Large** size logo. Partner Center will use this to create other required sizes. You can optionally replace this with a different image later.

These logos are used in different places in the listing:

[!INCLUDE [logos-appsource-only](includes/logos-appsource-only.md)]

[!INCLUDE [Logo tips](includes/graphics-suggestions.md)]

### Screenshots

Add up to five optional screenshots that show how your offer works. Screenshots must be 1280 x 720 pixels and in PNG format. Add a caption for each screenshot.

### Videos

Add up to five optional videos that demonstrate your offer. They should be hosted on an external video service. Enter each video's name, web address, and a thumbnail PNG image of the video at 1280 x 720 pixels.

For additional marketplace listing resources, see [Best practices for marketplace offer listings](gtm-offer-listing-best-practices.md).

Select **Save draft** before continuing to the next tab in the left-nav menu, **Preview audience**.

## Next steps

- [Set preview audience](iot-edge-preview-audience.md)
