---
title: Planning guide for Power BI app offers in Microsoft AppSource (Azure Marketplace)
description: This article is planning guide for Power BI app offers in Microsoft AppSource (Azure Marketplace)
services:  Azure, Marketplace, Compute, Storage, Networking, Blockchain, Security
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
author: keferna
ms.author: keferna
ms.date: 03/30/2021
---

# Plan a Power BI App offer

This article explains how to publish a Power BI app to Microsoft [AppSource](https://appsource.microsoft.com/). A Power BI app packages customizable content, including datasets, reports, and dashboards. You can then use the app with other Power BI platforms using AppSource, perform the adjustments and customizations allowed by the developer, and connect it to your own data.

Before you begin, review these links, which provide templates, tips, and samples:

- [Create a Power BI app](/power-bi/service-template-apps-create)
- [Tips for authoring a Power BI app](/power-bi/service-template-apps-tips)
- [Samples](/power-bi/service-template-apps-samples)


## Publishing benefits

Benefits of publishing to the commercial marketplace:

- Promote your company by using the Microsoft brand.
- Potentially reach more than 100 million Microsoft 365 and Dynamics 365 users on AppSource and more than 200,000 organizations through Azure Marketplace.
- Receive high-quality leads from these marketplaces.
- Have your services promoted by the Microsoft field and telesales teams.

## Overview

:::image type="content" source="media/power-bi/power-bi-app-publishing-steps.png" alt-text="Overview of the steps to publish a Power BI app offer." border="false":::

These are the key publishing steps:

1. Create your application in Power BI. You'll receive a package install link, which is the main technical asset for the offer. Send the test package to pre-production before creating the offer in Partner Center. For details, see [What are Power BI apps?](/power-bi/service-template-apps-overview)
2. Add the marketing materials, such as official name, description, and logos.
3. Include the offer's legal and support documents, such as terms of use, privacy policy, support policy, and user help.
4. Create the offer – Use Partner Center to edit the details, including the offer description, marketing materials, legal information, support information, and asset specifications.
5. Submit it for publishing.
6. Monitor the process in Partner Center, where the AppSource onboarding team tests, validates, and certifies your app.
7. After it's certified, review the app in its test environment and release it. This will list it on AppSource (it "goes live").
8. In Power BI, send the package into production. For details, see [Manage the Power BI app release](/power-bi/service-template-apps-create#manage-the-template-app-release).

## Requirements

To be published in the commercial marketplace, your Power BI app offer must meet the following technical and business requirements.

### Technical requirements

The main technical asset you'll need is a [Power BI app](/power-bi/connect-data/service-template-apps-overview). This is a collection of primary datasets, reports, or dashboards. It also includes optional connected services and embedded datasets, previously known as a [content pack](/power-bi/service-organizational-content-pack-introduction). For more information about developing this type of app, see [What are Power BI apps?](/power-bi/connect-data/service-template-apps-overview).

#### Get an installation web address

You can only build a Power BI app within the [Power BI](https://powerbi.microsoft.com/) environment.

1. Sign in with a [Power BI Pro license](/power-bi/service-admin-purchasing-power-bi-pro).
2. Create and test your app in Power BI.
3. When you receive the app installation web address, add it to the **Technical Configuration** page in Partner Center.

After your app is created and tested in Power BI, save the application installation web address, as you'll need it to [create a Power BI app offer](power-bi-app-offer-setup.md).

### Business requirements

The business requirements include procedural, contractual, and legal obligations. You must:

- Be a registered commercial marketplace publisher. If you're not registered, follow the steps in [Create a commercial marketplace account in Partner Center](create-account.md).
- Provide content that meets the criteria for your offering to be listed on AppSource. For more information, see [Have an app to list on AppSource? Here's how](https://appsource.microsoft.com/blogs/have-an-app-to-list-on-appsource-here-s-how).
- Agree to and follow the [Microsoft Privacy Statement](https://privacy.microsoft.com/privacystatement).

## Licensing options

These are the available licensing options for Power BI app offers: <font color="red"> [ pick the right ones, or add ] </font>

| Licensing option | Transaction process |
| --- | --- |
| BYOL | The Bring Your Own Licensing option lets your customers bring existing software licenses to Azure.\* |
| Get it now (free) | List your offer to customers for free. |
| Free trial (listing) | Offer your customers a one-, three- or six-month free trial. Offer listing free trials are created, managed, and configured by your service and do not have subscriptions managed by Microsoft. |
| Contact me | Collect customer contact information by connecting your Customer Relationship Management (CRM) system. The customer will be asked for permission to share their information. These customer details, along with the offer name, ID, and marketplace source where they found your offer, will be sent to the CRM system that you've configured. For more information about configuring your CRM, see the **Customer leads** section of your offer type's **Offer setup** page. |
|

\* As the publisher, you support all aspects of the software license transaction, including (but not limited to) order, fulfillment, metering, billing, invoicing, payment, and collection.

## Customer leads

When you're publishing an offer to the commercial marketplace with Partner Center, you'll want to connect it to your Customer Relationship Management (CRM) system. This lets you receive customer contact information as soon as someone expresses interest in or uses your product. Connecting to a CRM is required if you want to enable a test drive; otherwise, connecting to a CRM is optional. Partner Center supports Azure table, Dynamics 365 Customer Engagement, HTTPS endpoint, Marketo, and Salesforce.

## Legal contracts

<strike>To simplify the procurement process for customers and reduce legal complexity for software vendors, Microsoft offers a standard contract you can use for your offers in the commercial marketplace. When you offer your software under the standard contract, customers only need to read and accept it one time, and you don't have to create custom terms and conditions.</strike>

You'll need terms and conditions customers must accept before they can try your offer, or a link to where they can be found.

## Offer listing details

> [!NOTE]
> Offer listing content is not required to be in English if the offer description begins with the phrase "This application is available only in [non-English language]".

To help create your offer more easily, prepare these items ahead of time. All are required except where noted.

- **Name** – The name will appear as the title of your offer listing in the commercial marketplace. The name may be trademarked. It cannot contain emojis (unless they are the trademark and copyright symbols) and is limited to 50 characters.
- **Search results summary** – The purpose or function of your offer as a single sentence with no line breaks in 100 characters or less. This is used in the commercial marketplace listing(s) search results.
- **Description** – This description displays in the commercial marketplace listing(s) overview. Consider including a value proposition, key benefits, intended user base, any category or industry associations, in-app purchase opportunities, any required disclosures, and a link to learn more. This text box has rich text editor controls to make your description more engaging. Optionally, use HTML tags for formatting.
- **Search keywords** (optional) – Up to three search keywords that customers can use to find your offer. Don't include the offer **Name** and **Description**; that text is automatically included in search.
- **Products your app works with** (optional) – The names of up to three products your offer works with.
- **Help/Privacy policy links** – The URL for your company’s help and privacy policy. You are responsible for ensuring your app complies with privacy laws and regulations.
- **Contact information**
  - **Support contact** – The name, phone, and email that Microsoft partners will use when your customers open tickets. Include the URL for your support website.
  - **Engineering contact** – The name, phone, and email for Microsoft to use directly when there are problems with your offer. This contact information isn’t listed in the commercial marketplace.
  - **Supporting documents** – 
- **Media**
    - **Logos** – A PNG file for the **Large** logo. Partner Center will use this to create other required logo sizes. You can optionally replace these with different images later.
    - **Screenshots** – At least one and up to five screenshots that show how your offer works. Images must be 1280 x 720 pixels, in PNG format, and include a caption.
    - **Videos** (optional) – Up to four videos that demonstrate your offer. Include a name, URL for YouTube or Vimeo, and a 1280 x 720 pixel PNG thumbnail.

> [!Note]
> Your offer must meet the general [commercial marketplace certification policies](/legal/marketplace/certification-policies#100-general) to be published to the commercial marketplace.

<strike>

## Preview audience

A preview audience can access your offer prior to being published live in the online stores in order to test the end-to-end functionality before you publish it live. On the **Preview audience** page, you can define a limited preview audience.

You can send invites to Azure subscription IDs. Add up to 10 IDs manually or import up to 100 with a .csv file. If your offer is already live, you can still define a preview audience for testing any changes or updates to your offer.</strike>

## <strike>Plans and</strike> Pricing

<strike>Container offers require at least one plan. A plan defines the solution scope and limits. You can create multiple plans for your offer to give your customers different technical and licensing options.</strike>

Power BI app offers support [ how many? ] licensing models: Free or Bring Your Own License (BYOL). BYOL means you’ll bill your customers directly, and Microsoft won’t charge you any fees. Microsoft only passes through Azure infrastructure usage fees. For more information, see [Commercial marketplace transact capabilities](marketplace-commercial-transaction-capabilities-and-considerations.md).<font color="red"> [ licensing is discussed above, perhaps this section should be there, or vice versa ] </font>

## Additional sales opportunities

You can choose to opt into Microsoft-supported marketing and sales channels. When creating your offer in Partner Center, you will see two tabs toward the end of the process:

- **Resell through CSPs** – Allow Microsoft Cloud Solution Providers (CSP) partners to resell your solution as part of a bundled offer. For more information about this program, see [Cloud Solution Provider program](cloud-solution-providers.md).
- **Co-sell with Microsoft** – Let Microsoft sales teams consider your IP co-sell eligible solution when evaluating their customers’ needs. For details about co-sell eligibility, see [Requirements for co-sell status](/legal/marketplace/certification-policies). For details on preparing your offer for evaluation, see [Co-sell option in Partner Center](commercial-marketplace-co-sell.md).

## Offer requirements <font color="red"> [ from Containers, as starter info ] </font>

| Requirement | Details |  
| --- | --- |  
| Billing and metering | Support either the free or BYOL billing model. |
| Image built from a Dockerfile | Container images must be based on the Docker image specification and built from a Dockerfile. For more information about building Docker images, see the "Usage" section of [Dockerfile reference](https://docs.docker.com/engine/reference/builder/#usage). |
| Hosting in an Azure Container Registry repository | Container images must be hosted in an Azure Container Registry repository. For more information about working with Azure Container Registry, see [Quickstart: Create a private container registry by using the Azure portal](../container-registry/container-registry-get-started-portal.md).<br><br> |
| Image tagging | Container images must contain at least one tag (maximum number of tags: 16). For more information about tagging an image, see the `docker tag` page on the [Docker Documentation](https://docs.docker.com/engine/reference/commandline/tag) site. |

## Next steps

- [Create a Power BI app offer](power-bi-app-offer-setup.md)
