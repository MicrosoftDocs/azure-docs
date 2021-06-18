---
title: Offer listing best practices - Microsoft commercial marketplace
description: Learn about go-to-market listing best practices for your Microsoft AppSource and Azure Marketplace offers.
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
author: trkeya
ms.author: trkeya
ms.date: 06/03/2021
---

# Offer listing best practices

This article gives suggestions for creating and engaging Microsoft commercial marketplace offers. The following tables outline best practices for completing offer information in Partner Center. For an analysis of how your offers are performing, go to the [Marketplace Insights dashboard](https://go.microsoft.com/fwlink/?linkid=2165936) in Partner Center.

## Online store offer details

| Setting | Best practice |
|:--- |:--- |  
| Offer name | For apps, provide a clear title that includes search keywords to help customers discover your offer. <br> <br> For Consulting Services, follow this format: [Offer Name: [Duration] [Offer Type] (for example, Contoso: 2-Week Implementation) |
| Offer description | Provide a clear description that describes your offer's value proposition in the first few sentences.  Keep in mind that these sentences may be used in search engine results. Core components of your value proposition should include: <ul> <li>Description of the product or solution. </li> <li> User persona that benefits from the product or solution. </li> <li> Customer need or pain the product or solution addresses. </li> </ul> <br> Use industry standard vocabulary or benefit-based wording when possible.  Do not rely on features and functionality to sell your product.  Instead, focus on the value you deliver. <br> <br> For Consulting Service listings, clearly state the professional service you provide. |

> [!IMPORTANT]
> Make sure your offer name and offer description adhere to **[Microsoft Trademark and Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general.aspx)** and other relevant, product-specific guidelines when referring to Microsoft trademarks and the names of Microsoft software, products, and services.

## Online store listing details

This table shows which offer types have categories and industries applicable to the different online stores: Azure Marketplace and Microsoft AppSource.

| Offer type | Categories for Azure Marketplace | Categories for AppSource | Industries for AppSource |
| :------------------- |:----------------:|:------:|:-------------:|
| Azure Application     | X |   |   |
| Azure Container       | X |   |   |
| Azure Virtual Machine | X |   |   |
| Consulting Service    | X<sup>*</sup> |   | X<sup>*</sup> |
| Dynamics 365 Customer Engagement & Power Apps | | X | X |
| Dynamics 365 for Operations | | X | X |
| Dynamics 365 business central | | X | X |
| IoT Edge Module | X | |  |
| Managed service | X | |  |
| Power BI app | | X | X |
| SaaS | X | X | X |

* The offer is published to the relevant online store based on the primary product. If the primary product is Azure, it goes to Azure Marketplace. Otherwise, its published to AppSource.

### Categories

Microsoft AppSource and Azure Marketplace are online stores that offer different solution types. Azure Marketplace offers IT solutions built on or for Azure.  Microsoft AppSource offer business solutions, such as industry SaaS applications, Dynamics 365 add-ins, Microsoft 365 add-ins, and Power Platform apps.

Categories and subcategories are mapped to each online store based on the solution type. Your offer will be published to Microsoft AppSource or Azure Marketplace depending on the offer type, transaction capabilities of the offer and category/subcategory selection. 

Select categories and subcategories that best align with your solution type. You can select:

* Up to two categories, including a primary and a secondary category (optional).
* Up to two subcategories for each primary and/or secondary category. If no subcategory is selected, you offer will still be discoverable on the selected category only.

[!INCLUDE [categories and subcategories](./includes/categories.md)]

#### IMPORTANT: SaaS Offers and Microsoft 365 Add-ins

For specific details on how transact capabilities may affect how your offer can be viewed and purchased by marketplace customers, see [Transacting in the commercial marketplace](marketplace-commercial-transaction-capabilities-and-considerations.md). For SaaS offers, the offer's transaction capability as well as the category selection will determine the online store where your offer will be published.

This table shows the combinations of options that are applicable to the different online stores: Azure Marketplace and Microsoft AppSource.

| Metered billing | Microsoft 365 add-ins | Private-only plan | Public-only plan | Public & private plans | Applicable online store |
|:-------------:|:---:|:--------:|:---------:|:---------------------:|:-------------:|
|  | X |  |  |  | AppSource |
| X |  | X |  |  | Azure Marketplace |
| X |  |  | X |  | Azure Marketplace |
| X |  |  |  | X | Azure Marketplace<sup>2</sup> |
|  |  | X |  |  | Azure Marketplace |
|  |  |  | X |  | AppSource<sup>1</sup><br>Azure Marketplace<sup>1</sup> |
|  |  |  |  | X | AppSource<sup>1</sup><br>Azure Marketplace<sup>1,2</sup> |
|  |  |  |  | X | AppSource<sup>1</sup><br>Azure Marketplace<sup>1</sup> |

1. Depending on category/subcategory and industry selection
2. Offers with private plans will be published to the Azure portal

> [!NOTE]
> You cannot have both listing plans and transactable plans in the same offer.

### Industries

Industry selection applies only for offers published to AppSource and Consulting Services published in Azure Marketplace.  Select industries and/or verticals if your offer addresses industry-specific needs, calling out industry-specific capabilities in your offer description. You can select up to two (2) industries and two (2) verticals per industry selected.

>[!Note]
>For consulting service offers in Azure Marketplace, there are no industry verticals.

| **Industries** |  **Verticals** |
| :------------------- | :----------------|
| **Agriculture** | |
| **Architecture & Construction** | |
| **Automotive** | |
| **Distribution** | Wholesale <br> Parcel & Package Shipping |  
| **Education** | Higher Education <br> Primary & Secondary Edu / K-12 <br> Libraries & Museums |
| **Financial Services** | Banking & Capital Markets <br> Insurance | 
| **Government** |  Defense & Intelligence <br> Civilian Government <br> Public Safety & Justice |
| **Healthcare** | Health Payor <br> Health Provider <br> Pharmaceuticals | 
| **Hospitality & Travel** | Travel & Transportation <br> Hotels & Leisure <br> Restaurants & Food Services | 
| **Manufacturing & Resources** | Chemical & Agrochemical <br> Discrete Manufacturing <br> Energy | 
| **Media & Communications** | Media & Entertainment <br> Telecommunications | 
| **Other Public Sector Industries** | Forestry & Fishing <br> Nonprofit | 
| **Professional Services** | Partner Professional Services <br> Legal | 
| **Real Estate** | |

Industry for Microsoft AppSource only:

| **Industry** |  **Verticals** |
| :------------------- | :----------------|
| **Retail & Consumer Goods** | Retailers <br> Consumer Goods |

### Applicable products

Select the applicable products your app works with for the offer to show up under selected products in AppSource.

### Search keywords

Keywords can help customers find your offer when they search. Identify the top search keywords for your offer, incorporate them in your offer summary and description as well as in the keyword section of the offer listing details section.

## Online store marketing details
| Setting | Best practice |
|:--- |:--- |  
| Offer logo (PNG format, from 216 × 216 to 350 x 350 px): app details page | Design and optimize your logo for a digital medium:<br>Upload the logo in PNG format to the app details listing page of your offer. Partner Center will resize it to the required logo sizes. |
| Offer logo (PNG format, 48 × 48 pixels): search page | Partner Center will generate this logo from the Large logo you uploaded. You can optionally replace this with a different image later. |
| "Learn more" documents | Include supporting sales and marketing assets under "Learn more," some examples are:<ul><li>white papers</li><li> brochures</li><li>checklists, or</li><li> PowerPoint presentations</li></ul><br>Save all files in PDF format. Your goal here should be to educate customers, not sell to them.<br><br>Add a link to your app landing page to all your documents and add URL parameters to help you track visitors and trials. |
| Videos: AppSource, consulting services, and SaaS offers only | The strongest videos communicate the value of your offer in narrative form:<ul> <li> Make your customer, not your company, the hero of the story. </li> <li> Your video should address the principal challenges and goals of your target customer. </li> <li> Recommended length: 60-90 seconds.</li> <li> Incorporate key search words that use the name of the videos. </li> <li> Consider adding additional videos, such as a how-to, getting started, or customer testimonials. </li> </ul> |
| Screenshots (1280&nbsp;&times;&nbsp;720) | Add up to five screenshots:<br>Incorporate key search words in the file names. |

## Link to your offer page from your website

When you link from the AppSource or Azure Marketplace badge on your site to your listing in the commercial marketplace, you can support strong analytics and reporting by including the following query parameters at the end of the URL:
* **src**: Include the source from which the traffic is routed to AppSource (for example, website, LinkedIn, or Facebook).
* **mktcmpid**: Your marketing campaign ID, which can contain up to 16 characters in any combination of letters, numbers, underscores, and hyphens (for example, *blogpost_12*).

The following example URL contains both of the preceding query parameters:
`https://appsource.microsoft.com/product/dynamics-365/mscrm.04931187-431c-415d-8777-f7f482ba8095?src=website&mktcmpid=blogpost_12`

By adding the parameters to your AppSource URL, you can review the effectiveness of your campaign in the [analytics dashboard](https://go.microsoft.com/fwlink/?linkid=2165765) in Partner Center.

## Next steps

Learn more about your [commercial marketplace benefits](./gtm-your-marketplace-benefits.md).

Sign in to [Partner Center](https://go.microsoft.com/fwlink/?linkid=2165290) to create and configure your offer. If you haven't yet enrolled in Partner Center, [create an account](create-account.md).
