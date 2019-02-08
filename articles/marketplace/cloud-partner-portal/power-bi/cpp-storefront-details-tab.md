---
title: Storefront Details for a Power BI App offer - Azure Marketplace | Microsoft Docs
description: Configure Storefront Details fields for a Power BI App offer for the Microsoft AppSource Marketplace. 
services: Azure, AppSource, Marketplace, Cloud Partner Portal, Power BI
documentationcenter:
author: v-miclar
manager: Patrick.Butler  
editor:

ms.assetid: 
ms.service: marketplace
ms.workload: 
ms.tgt_pltfrm: 
ms.devlang: 
ms.topic: conceptual
ms.date: 01/30/2019
ms.author: pbutlerm
---

# Power BI Apps Storefront Details tab

Use the **Storefront Details** tab of the **New Offer** page to provide marketing, sales, and legal information to your prospective customers. This tab also specifies how to manage leads generated from the marketplace. This long form is divided into six sections: **Offer Details**, **Listing Details**, **Marketing Artifacts**, **Legal**, **Customer Support**, and **Lead Management**.  An appended asterisk (*) on the field label indicates that it is required.


## Offer Details section

In this section, you enter the general information about your App Source Offer.

![Offer Details section of the Storefront Details tab](./media/offer-details-section.png)

The following table describes the name and purpose of these fields.

|   Field               |   Description                                                                           |
|-----------------------|-----------------------------------------------------------------------------------------|
| **Offer Summary**     | Brief purpose of the app. Maximum length of 100 characters.                             |
| **Offer Description** | Description of app. Maximum length of 3000 characters, supports simple HTML formatting. |
|                       |                                                                                         |


## Listing Details section

This second section provides additional context for your app: what industries it is typically used in, what category best applies to it, compatible products, and associated search terms.

![Listing Details section of the Storefront Details tab](./media/listing-details-section.png)

 The following table describes the name and purpose of these fields.
 
|   Field                                  |   Description                                                        |
| --------------                           | ---------------------                                                |
| **Industries**                           | Select the industry that your app is best aligned to. If your app relates to multiple industries, you can leave this blank.      |
| **Categories**                           | Select the categories that are relevant to your app. Select a maximum of 3.     |
| **Help link for your app**               | URL to a page that has online help for your app           |
| **Products your app works with (Max 3)** | List the specific products that your app works with. You can list maximum of 3 products. To list a product, click on the plus sign (beside new) and a new open text field will be created for you to enter the name of a product that your app works with.      |
| **Search keywords (Max 3)**              | AppSource allows customer to do search based on keywords. You can enter the set of keywords for which your application will be shown to the customers. For example, if the application is "My Emailing app" Emails, Mailing, Mail app might be some keywords. Choose words that users will likely use to search for your app in the AppSource search box. |
|  |  |


## Marketing Artifacts section

This third section enables uploading of branding and marketing materials.  It is divided in four subsections: **Logos**, **Videos**, **Documents**, and **Screenshots**. Logos and screenshots are required marketing artifacts; however, all are highly recommended for best customer appeal.

![Marketing Artifacts section of the Storefront Details tab](./media/marketing-artifacts-section.png)

 
|    Field                             |    Description                                                    |
|   -----------                        |    -------------                                                  |
| *Logos*                              |                                                                   |
| **Offer logo (png format, 48x48)**   | Displayed on AppSource in the overview of app or app results, when completing a search. Only png format, with a resolution of 48px\*48px is supported.  |
| **Offer logo (png format, 216x216)** | Displayed on AppSource on your app’s detail page.  Only png format, with a resolution of 216px\*216px is supported.  |
| *Videos*                             |                                                                   |
| **Name**                             | Name or title of the app                                          |
| **URL**                              | Video URL hosted on YouTube or Vimeo                              |
| **Thumbnail**                        | Thumbnail image of the app.  Only png format with a resolution of 1280px\*720px is supported.   |
| *Documents*                          | Optional, but maximum of three documents. Docs you upload here will appear on AppSource under "Learn more".  |
| **Name**                             | Name or title of supporting document                              |
| **File**                             | Upload document must be in pdf format                             |
| *Screenshots*                        | Optional, but maximum of five screenshots.                        |
| **Name**                             | Name or title of screenshot                                       |
| **Image**                            | Upload screen capture image, must be png format with resolution of 1280px\*720px  | 
|   |   |


### Logo guidelines

All the logos uploaded to the [Cloud Partner Portal](https://cloudpartner.azure.com) should follow the guidelines:

- Do not use a gradient background on your logo.
- Avoid placing text—including your company or brand name—on the logo. The look and feel of your logo should be "flat" and should avoid gradients.
- Do not stretch the logo.


## Legal section

This fourth section enables you to provide the two legal documents required for each offer: Privacy Policy and the Terms of Use.

![Legal section of the Storefront Details tab](./media/legal-section.png)

|   Field                |   Description                           |
|------------------------|--------------------------------------   |
| **Privacy Policy URL** | URL to your posted privacy policy       |
| **Terms of use**       | Policy as plain text or simple HTML     |
|  |  |


## Customer Support section

Provide the **Support URL** for your online customer support page.  It is best if this online support page provides customers with multiple contact options, such as phone, email, and live chat. 


## Lead Management section

The last section enables you to collect customers leads generated from your AppSource offers. It offers the following storage options (from a drop-down list)
for this lead information.

|    Field               |   Lead destination                               |
|------------------------|--------------------------------------            |
|  **None**              | Leads are not collected (the default).  |
| **Azure Blob (deprecated)** | An [Azure blob](https://docs.microsoft.com/azure/storage/blobs/storage-blobs-overview), specified by a container name and a connection string.  This choice is deprecated; use **Azure Table** instead.  |
| **Azure Table**        | An [Azure table](https://docs.microsoft.com/azure/cosmos-db/table-storage-overview), specified by a connection string  |
| **Dynamics CRM Online** | A [Microsoft Dynamics 365 Online](https://dynamics.microsoft.com/) instance, specified by a URL and authentication credentials |
| **HTTPS Endpoint**     | The specified HTTPS endpoint as a JSON payload   |
| **Marketo**            | A [Marketo](https://www.marketo.com/) instance, specified by server ID, munchkin ID, and form ID   |
| **Salesforce**         | A [Salesforce](https://www.salesforce.com/) database, specified by an object Identifier |
|  |  |

After you publish your offer, the lead connection is validated, and a test lead is automatically sent to the specified destination. Lead
information should be continuously managed, and these settings should be promptly updated to reflect your current customer management architecture.


## Next steps

In the next [Contacts](./cpp-contacts-tab.md) tab, you will provide technical and user support resources for your offer.
