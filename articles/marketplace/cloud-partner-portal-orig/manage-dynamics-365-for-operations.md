---
title: How to create Dynamics 365 for Operations offer via Cloud Partner portal | Microsoft Docs
description: How to create Dynamics 365 for Operations offer via Cloud Partner portal
services: Azure, Marketplace, Cloud Partner Portal, 
documentationcenter:
author: pbutlerm
manager: Ricardo.Villalobos  
editor:

ms.assetid: 
ms.service: marketplace
ms.workload: 
ms.tgt_pltfrm: 
ms.devlang: 
ms.topic: conceptual
ms.date: 09/13/2018
ms.author: pbutlerm
---

# How to create Dynamics 365 for Operations offer via Cloud Partner portal

Publishing portal provides role-based access to the portal allowing multiple individuals to be able to collaborate towards publishing an offer. See [Cloud Portal Manage Users](./cloud-partner-portal-manage-users.md) for more info.

Before an offer can be published on behalf of a publisher account, one of individuals with \"owner\" role need to agree to comply with the [Terms of Use](https://azure.microsoft.com/support/legal/website-terms-of-use/), [Microsoft Privacy Statement](http://www.microsoft.com/privacystatement/default.aspx), and [Microsoft Azure Certified Program Agreement](https://azure.microsoft.com/support/legal/marketplace/certified-program-agreement/).

## How to create a new Dynamics 365 for Operations offer

Once all the pre-requisites have been met, you are ready to start authoring your Dynamics 365 for Operations offer.

1. Sign in to the [Cloud Partner Portal](http://cloudpartner.azure.com/).
2. From the left navigation bar, click on \"+ New offer\" and select \"Dynamics 365 for Operations\".
3. A new offer \"Editor\" view is now opened for you, and we are ready to start authoring.
4. The \"forms\" that need to be filled out are visible on the left within the \"Editor\" view. Each \"form\" consists of a set of fields that are to be filled out. Required fields are marked with a red asterisk (\*).

There are four main forms for authoring a Dynamics 365 for Operations offer:

- Offer Settings
- Technical Info
- Storefront Details
- Contacts

## How to fill out the Offer Settings form

The offer settings form is a basic form to specify the offer settings. The different fields are described below.

### Offer ID

This is a unique identifier for the offer within a publisher profile. This ID will be visible in product URLs. It can only be composed of lowercase alphanumeric characters or dashes (-). The ID cannot end in a
dash and can have a maximum of 50 characters. This field is locked once an offer goes live.

for example, if a publisher contoso publisher creates an offer with offer ID *sample-dynamics365 for operations*, it will show up in AppSource as \"https://appsource.microsoft.com/marketplace/apps/**contoso**.*sample-dynamics
365 for operations*?tab=Overview\"

### Publisher ID

This dropdown allows you to choose the publisher profile you want to publish this offer under. This field is locked once an offer goes live.

Name

This is the display name for your offer. This is the name that will show  up in [AppSource](https://appsource.microsoft.com). It can have a maximum of 50 characters.

Click on \"Save\" to save your progress. Next step would be to fill out Technical info for your offer.

## How to fill out the Technical Info form

The technical info form contains information that will be displayed in your offer page. Instructions for the different fields are described below.

![New offer screen](./media/publish_d365_new_offer/Technical_info.png)

### Solution Identifier

First is your Solution Identifier.

1. To find this identifier, go to Life Cycle Services and select Solution Management.
2. After picking the appropriate solution, you will see the Solution Identifier in the Package overview. \*\*If the identifier is blank, select edit and republish your package for the Solution Identifier
    to appear.

### Validation Assets

Upload your CAR (Customization Analysis Reports) here.

### Does solution enable translation(s)?

Select \'Yes\' or \'No\'.

### Does solution include Localization(s)?

Select \'Yes\' or \'No\'.

### Product Version

Select New AX. Finally click save.

## How to fill out Storefront details form.

First is your Offer Details.

1. **Offer Summary**

    \- Enter a short summary of your solution (Max 100 chars).

2. **Offer Description**

    \- Enter a brief description of your solution. Your description should have the functional footprint of your solution and should directly align with your BPM library. for example, If you say you have
    features x,y,z in your marketing content, during the final review we will make sure these are documented in the BPM library inside LCS.

![storefront details screen](./media/publish_d365_new_offer/offer_details.png)

### Listing Details

![Storefront details screen](./media/publish_d365_new_offer/storefront_details.png)

1. **Industries** - Check a max of two industries from the given options.
2. **Categories** - Check a max of three categories from the given options.
3. **App Type** - Select from the given options.
4. **Help link for your App** - Enter the help link for your solution.
5. **Supported countries/regions** - Check from the given options.
6. **Supported Languages** - Check from the given options.
7. **App Version** - Enter version of your solution that is being released. (for example, 1.0.0.0)
8. **App Release Date** - Enter release date of your solution(mm/dd/yyyy).
9. **Products your app works with** - List-specific products that your
    app works with. You can list maximum of three products. To list a product, click on the plus sign (beside new) and a new open text field will be created for you to enter the name of a product that
    your app works with.
10. **Search Keywords** - Enter common terms users may use to find your solution during a search. \*\*These keywords will not be displayed in the marketplace.
11. **Hide Key** - This is what key that would be combined with the offer preview URL to hide it from public view. It is not a password. You can enter any string here.

### Marketing Artifacts

1. Next is uploading your **Logos**, **Screenshots**. \*\*Please note the sizes for each upload, and all images should be in PNG format.
2. **Demo videos** - Click on \"+new\". Upload a demo video of your solution(YouTube or Vimeo links only).\*\*. Please note that you should upload a Thumbnail of specified size to make your video appear in staging.
3. **Documents** - Upload any documents related to your solution, and remember to enter a name for the document.

### Legal

This information will link to your Privacy Policy, and Terms of Use. Enter the solution Privacy Policy URL, and your Terms of Use. \*\*The customer will be able to see these policies on the portal.

### Customer Support

The Support URL will only be seen in the portal by your users.

### Leads Management

Select a CRM system where you lead will be stored. Select \"Azure Table\" here if you have one of the following CRM systems: Salesforce, Marketo, Microsoft Dynamics CRM. The CRM system you select here is where
we will write details of end users that try your app on AppSource (leads). Depending on the CRM system you select, click the corresponding URL below for information on how to complete the next set of fields.

![Lead management details](./media/publish_d365_new_offer/leads.png)

1. For Azure Table refer [here](https://aka.ms/leadsettingforazuretable)
2. For Dynamics CRM online, refer [here](https://aka.ms/leadsettingfordynamicscrm)
3. For Marketo [here](https://aka.ms/leadsettingformarketo)
4. For Salesforce refer [here](https://aka.ms/leadsettingforsalesforce)

## How to fill out the Contacts form.

This information will be used for Microsoft and Customer support. Enter the Engineering Contact and Customer Support for your company, and the Support URL for your solution. This information will be used, as a single point of contact, if Microsoft has a question about your solution, and also for Customer support.

![Offer contacts screen](./media/publish_d365_new_offer/Contacts.png)
