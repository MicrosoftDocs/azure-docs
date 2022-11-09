---
title: Azure Marketplace IoT Edge module offers 
description: Learn about publishing an IoT Edge module offer in Azure Marketplace.
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
author: keferna
ms.author: keferna
ms.date: 06/29/2022
---

# Plan an IoT Edge module offer

The [Azure IoT Edge](https://azure.microsoft.com/services/iot-edge/) platform is backed by Microsoft Azure. This platform enables users to deploy cloud workloads to run directly on IoT devices.  An IoT Edge module can run offline workloads and do data analysis locally. This offer type helps to save bandwidth, safeguard local and sensitive data, and offers low-latency response time.  You now have the options to take advantage of these pre-built workloads. Until now, only a handful of first-party solutions from Microsoft were available. You had to invest the time and resources into building your own custom IoT solutions.

With IoT Edge modules in [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/category/internet-of-things?page=1), we now have a single destination for publishers to expose and sell their solutions to the IoT audience. IoT developers can ultimately find and purchase capabilities to accelerate their solution development.  

## Key benefits of IoT Edge modules in Azure Marketplace

| **For publishers**    | **For customers (IoT developers)**  |
| :------------------- | :-------------------|
| Reach millions of developers looking to build and deploy IoT Edge solutions.  | Compose an IoT Edge solution with the confidence of using secure and tested components. |
| Publish once and run across any IoT Edge hardware that supports containers. | Reduce time to market by finding and deploying 1st and 3rd party IoT Edge modules for specific needs. |
| Monetize with flexible billing options <ul><li>Free and Bring Your Own License (BYOL).</li></ul> | Make purchases with your choice of billing models.<ul><li>Free and Bring Your Own License (BYOL).</li></ul> |

## What is an IoT Edge module?

Azure IoT Edge lets you deploy and manage business logic on the edge in the form of modules. Azure IoT Edge modules are the smallest computation units managed by IoT Edge, and can contain Microsoft services (such as Azure Stream Analytics), third-party services or your own solution-specific code. To learn more about IoT Edge modules, see [Understand Azure IoT Edge modules](../iot-edge/iot-edge-modules.md).

### What is the difference between a Container offer type and an IoT Edge module offer type?

The IoT Edge module offer type is a specific type of container running on an IoT Edge device. It comes with default configuration settings to run in the IoT Edge context, and optionally uses the IoT Edge module SDK to be integrated with the IoT Edge runtime.

## Select the right online store

IoT Edge Modules are only published to Azure Marketplace; AppSource does not apply. For more information on the differences across online stores, see [Determine your publishing option](determine-your-listing-type.md).

## Technical Requirements

The technical requirements to get an IoT Edge Module certified and published in Azure Marketplace are detailed in the [Prepare your IoT Edge module technical assets](iot-edge-technical-asset.md).

## Eligibility prerequisites

All the terms of the Microsoft Azure Marketplace agreements and policies apply to IoT Edge module offers.  Additionally, there are prerequisites and technical requirements for IoT Edge modules.  

To publish an IoT Edge module to Azure Marketplace, you need to meet the following prerequisites:

- Access to the Partner Center. For more information, see [Create a commercial marketplace account in Partner Center](create-account.md).
- Host your IoT Edge module in an Azure Container Registry.
- Have your IoT Edge module metadata ready such as (non-exhaustive list):
    - A title
    - A description (in HTML format)
    - A logo image (in sizes of 48 x 48 (optional), 90 x 90 (optional), and from 216 x 216 to 350 x 350 px, all in PNG format)
    - A term of use and privacy policy
    - Default module configuration (route, twin desired properties, createOptions, environment variables)
    - Documentation
    - Support contacts

## Licensing options

These are the available licensing options for Azure Container offers:

| Licensing option | Transaction process |
| --- | --- |
| Free | List your offer to customers for free. |
| BYOL | The Bring Your Own Licensing option lets your customers bring existing software licenses to Azure.\* |

\* As the publisher, you support all aspects of the software license transaction, including (but not limited to) order, fulfillment, metering, billing, invoicing, payment, and collection.

## Publishing options

In all cases, IoT Edge modules should select the **Transact** publishing option.  See [choose a publishing option](determine-your-listing-type.md) for more details on publishing options.  

## Customer leads

The commercial marketplace will collect leads with customer information so you can access them in the [Referrals workspace](https://partner.microsoft.com/dashboard/referrals/v2/leads) in Partner Center. Leads will include information such as customer details along with the offer name, ID, and online store where the customer found your offer.

You can also choose to connect your CRM system to your offer. The commercial marketplace supports Dynamics 365, Marketo, and Salesforce, along with the option to use an Azure table or configure an HTTPS endpoint using Power Automate. For detailed guidance, see [Customer leads from your commercial marketplace offer](partner-center-portal/commercial-marketplace-get-customer-leads.md).

## Legal contracts

To simplify the procurement process for customers and reduce legal complexity for software vendors, Microsoft offers a standard contract you can use for your offers in the commercial marketplace. When you offer your software under the standard contract, customers only need to read and accept it one time, and you don't have to create custom terms and conditions.

You can choose to provide your own terms and conditions, instead of the standard contract. Customers must accept these terms before they can try your offer.

## Offer listing details

> [!NOTE]
> Offer listing content is not required to be in English if the offer description begins with the phrase "This application is available only in [non-English language]".

To help create your offer more easily, prepare these items ahead of time. All are required except where noted.

- **Name** – The name will appear as the title of your offer listing in the commercial marketplace. The name may be trademarked. It cannot contain emojis (unless they are the trademark and copyright symbols) and is limited to 200 characters.
- **Search results summary** – The purpose or function of your offer as a single sentence with no line breaks in 100 characters or less. This is used in the commercial marketplace listing(s) search results.
- **Short description** – Details of the purpose or function of the offer, written in plain text with no line breaks. This will appear on your offer's details page.
- **Description** – This description displays in the commercial marketplace listing(s) overview. Consider including a value proposition, key benefits, intended user base, any category or industry associations, in-app purchase opportunities, any required disclosures, and a link to learn more. This text box has rich text editor controls to make your description more engaging. Optionally, use HTML tags for formatting.
- **Privacy policy link** – The URL for your company’s privacy policy. You are responsible for ensuring your app complies with privacy laws and regulations.
- **Useful links** (optional): Links to various resources for users of your offer. For example, forums, FAQs, and release notes.
- **Contact information**
  - **Support contact** – The name, phone, and email that Microsoft partners will use when your customers open tickets. Include the URL for your support website.
  - **Engineering contact** – The name, phone, and email for Microsoft to use directly when there are problems with your offer. This contact information isn’t listed in the commercial marketplace.
  - **CSP Program contact** (optional): The name, phone, and email if you opt in to the Cloud Solution Provider (CSP) program, so those partners can contact you with any questions. You can also include a URL to your marketing materials.
- **Media**
    - **Logos** – A PNG file for the **Large** logo. Partner Center will use this to create other required logo sizes. You can optionally replace these with different images later.
    - **Screenshots** – At least one and up to five screenshots that show how your offer works. Images must be 1280 x 720 pixels, in PNG format, and include a caption.
    - **Videos** (optional) – Up to four videos that demonstrate your offer. Include a name, URL for YouTube or Vimeo, and a 1280 x 720 pixel PNG thumbnail.

> [!Note]
> Your offer must meet the general [commercial marketplace certification policies](/legal/marketplace/certification-policies#100-general) to be published to the commercial marketplace.

## Next steps

- [Create an IoT Edge module offer](./iot-edge-offer-setup.md) in Partner Center.
