---
title: Create a new Managed Services offer in the Commercial Marketplace 
description: How to create a new Managed Services offer for listing or selling in Azure Marketplace using the Commercial Marketplace portal on Microsoft Partner Center. 
author: JnHs 
manager: evansma
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 03/18/2020
---

# Create a new Managed Services offer

This topic explains how to create a new Managed Services offer. These offers enable a customer who purchases the offer to onboard resources for [Azure delegated resource management](../../../lighthouse/azure-delegated-resource-management.md).

To begin creating Managed Services offers, ensure that you first [Create a Partner Center account](./create-account.md) and open the [Commercial Marketplace dashboard](https://partner.microsoft.com/dashboard/commercial-marketplace/offers), with the **Overview** page selected. Note that competencies.....

![Commercial Marketplace dashboard on Partner Center](./media/new-offer-overview.png)

>[!Note]
> Once an offer has been published, edits to the offer made in Partner Center will only be updated in the system and store fronts after re-publishing. Please ensure that you submit the offer for publication after you make changes.

## Create a new offer

Select the **+ New offer** button, then select the **Managed Services** menu item. The **New offer** dialog box will appear.

### Offer ID and alias

- **Offer ID**: Unique identifier for each offer in your account. This ID will be visible to customers in the URL address for the marketplace offer. This ID can only contain lowercase alphanumeric characters (including hyphens and underscores, but no whitespace), limited to 50 characters, and can't be changed after you select **Create**.  For example, if you enter *test-offer-1* here, the offer URL will be `https://azuremarketplace.microsoft.com/marketplace/../test-offer-1`.

- **Offer alias**: The name used to refer to the offer within the Partner Center. This name won't be used in the marketplace, and is different than the offer name and other values that will be shown to customers. This value can't be changed after you select **Create**.

Once you enter your **Offer ID** and **Offer alias**, select **Create**. You'll then be able to work on all of the different parts of your offer.

## Offer setup

The **Offer setup** page asks for the following information. Be sure to select **Save** after completing these fields.

## Connect lead management

[!INCLUDE [Connect lead management](./includes/connect-lead-management.md)]

Note that per the [Managed Services certification policies](https://docs.microsoft.com/legal/marketplace/certification-policies#700-managed-services), a **Lead Destination** is required. For more information, see [Lead management overview](./commercial-marketplace-get-customer-leads.md).

Remember to **Save** before moving on to the next section!

## Properties

The **Properties** page lets you define the categories used to group your offer on the marketplace and the legal contracts supporting your offer. Select **Save** after completing this page.

### Category

Select a minimum of one and a maximum of five categories which will be used to place your offer into the appropriate marketplace search areas. Be sure to call out how your offer supports these categories in the offer description.

### Terms and conditions

Provide your own legal terms and conditions in the **Terms and conditions** field. You can also provide the URL where your terms and conditions can be found. Customers will be required to accept these terms before they can try your offer.

## Offer listing

The **Offer listing** page lets you define marketplace details (offer name, description, images, etc.) for your offer.

> [!NOTE]
> Offer listing content (such as the description, documents, screenshots, terms of use, etc.) is not required to be in English, as long as the offer description begins with the phrase, "This application is available only in [non-English language]." It is also acceptable to provide a *Useful Link URL* to offer content in a language other than the one used in the Offer listing content.

### Name

The name you enter here will be shown to customers as the title of your offer listing. This field is prepopulated with the text you entered for **Offer alias** when you created the offer, but you can change this value. This name may be trademarked (and you may include trademark or copyright symbols). The name can't be more than 50 characters and can't include any emojis.

### Search results summary

Provide a short description of your offer (up to 100 characters), which may be used in marketplace search results.

### Long summary

Provide a longer description of your offer (up to 256 characters). This long summary may also be used in marketplace search results.

### Description

Provide a longer description of your offer (up to 3,000 characters). This description will be displayed to customers in the marketplace listing overview. Include your offer's value proposition, key benefits, category and/or industry associations, in-app purchase opportunities, and any required disclosures. 

Some tips for writing your description:  

- Clearly describe your offer's value proposition in the first few sentences of your description. Include the following items in your value proposition:
  - Description of the offer
  - The type of user that benefits from the offer
  - Customer needs or pain that the offer addresses
- Keep in mind that the first few sentences might be displayed in search engine results.  
- Do not rely on features and functionality to sell your product. Instead, focus on the value you deliver.  
- Use industry-specific vocabulary or benefit-based wording as much as possible.
- Consider using HTML tags to format your description and make it more engaging.

To make your offer description more engaging, use the rich text editor to format your description.

![Using the rich text editor](./media/text-editor2.png)

Use the following instructions to use the rich text editor:

- To change the format of your content, highlight the text that you want to format and select a text style, as shown below:

     ![Using the rich text editor to change text format](./media/text-editor3.png)

- To add a bulleted or numbered list to the text, use the options below:

     ![Using the rich text editor to add lists](./media/text-editor4.png)

- To add or remove indentation to the text, use the options below:

     ![Using the rich text editor to indent](./media/text-editor5.png)

### Privacy policy link

Enter the URL to your organization's privacy policy (hosted on your site). You are responsible for ensuring your app complies with privacy laws and regulations, and for providing a valid privacy policy.

### Useful links

Provide optional supplemental online documents about your solution. Add additional useful links by clicking **+ Add a link**.

### Contact Information

In this section, you must provide the name, email, and phone number for a **Support contact** and an **Engineering contact**. This info is not shown to customers, but will be available to Microsoft, and may be provided to CSP partners.

### Support URLs

If you have support websites for **Azure Global Customers** and/or **Azure Government customers**, provide those URLs here.

### Marketplace images

In this section, you can provide logos and images that will be used when showing your offer to customer. All images must be in .png format.

#### Marketplace logos

Four logo sizes are required: **Small (40x40)**, **Medium (90x90)**, **Large (115x115)**, and **Wide (255x115)**. Follow these guidelines for your logos:

- The Azure design has a simple color palette. Limit the number of primary and secondary colors on your logo.
- The theme colors of the portal are white and black. Don't use these colors as the background color for your logo. Use a color that makes your logo prominent in the portal. We recommend simple primary colors.
- If you use a transparent background, make sure that the logo and text aren't white, black, or blue.
- The look and feel of your logo should be flat and avoid gradients. Don't use a gradient background on the logo.
- Don't place text on the logo, not even your company or brand name.
- Make sure the logo isn't stretched.

#### Screenshots

Add up to five screenshots that show how your offer works. All screenshots must be 1280 x 720 pixels.

#### Videos

You can optionally add up to five videos that demonstrate your offer. These videos should be hosted on YouTube and/or Vimeo. For each one, enter the video's name, its URL, and a thumbnail image of the video (1280 x 720 pixels).

#### Additional marketplace listing resources

- [Best practices for marketplace offer listings](https://docs.microsoft.com/azure/marketplace/gtm-offer-listing-best-practices)

## Preview

Before you publish your offer live to the broader marketplace offer, you'll first need to make it available to a limited preview audience. This lets you confirm how you offer appears in the Azure Marketplace before making it available to customers. Microsoft support and engineering teams will also be able to view your offer during this preview period.

You can define the preview audience by entering Azure subscription IDs in the **Preview Audience** section. You can enter up to 10 subscription IDs manually, or upload a .csv file with up to 100 subscription IDs.

Any customers associated with these subscriptions will be able to view the offer in Azure Marketplace before it goes live. Be sure to include your own subscriptions here so you can preview your offer.

## Plan overview



## Publish

### Submit offer to preview

Once you have completed all the required sections of the offer, select **publish** in the upper right corner of the portal. You will be redirected to the **Review and publish** page. 

If it's your first time publishing this offer, you can:

- See the completion status for each section of the offer.
    - *Not started* - means the section has not been touched and needs to be completed.
    - *Incomplete* - means the section has errors that need to be fixed or requires more information to be provided. Go back to the section(s) and update it.
    - *Complete* - means the section is complete, all required data has been provided and there are no errors. All sections of the offer must be in a complete state before you can submit the offer.
- In the **Notes for certification** section, provide testing instructions to the certification team to ensure that your app is tested correctly, in addition to any supplementary notes helpful for understanding your app.
- Submit the offer for publishing by selecting **Submit**. We will send you an email when a preview version of the offer is available for you to review and approve. Return to Partner Center and select **Go-live** for the offer to publish your offer to the public (or if a private offer, to the private audience).

## Next steps

- [Update an existing offer in the Commercial Marketplace](./update-existing-offer.md)
