---
title: Publishing guide for container offers in Azure Marketplace 
description: This article describes the requirements to publish container offers in Azure Marketplace.
services:  Azure, Marketplace, Compute, Storage, Networking, Blockchain, Security
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
author: aarathin
ms.author: aarathin
ms.date: 09/30/2022
---

# Plan an Azure container offer

Azure container offers help you publish your container image to Azure Marketplace. Use this guide to understand the requirements for this offer type.

Azure container offers are transaction offers that are deployed and billed through Azure Marketplace. The listing option a user sees is **Get It Now**.

Use the Azure Container offer type when your solution is either:
- A Docker container image that's set up as a Kubernetes-based Azure Container instance
- A Kubernetes application meant to be deployed on a managed Azure Kubernetes Service (AKS) cluster. 

> [!IMPORTANT]
> The Kubernetes application-based offer experience is in preview. Preview features are available on a self-service, opt-in basis. Previews are provided "as is" and "as available," and they're excluded from the service-level agreements and limited warranty. Previews are partially covered by customer support on a best-effort basis. As such, these features aren't meant for production use.

> [!NOTE]
> An Azure Container instance is a run-time docker instance that provides the fastest and simplest way to run a container in Azure, without having to manage any virtual machines or adopt a higher-level service. Container instances can be deployed directly to Azure or orchestrated by Azure Kubernetes Services or Azure Kubernetes Service Engine.  

## Licensing options

If you're publishing container images, these are the available licensing options for Azure Container offers:

| Licensing option | Transaction process |
| --- | --- |
| Free | List your offer to customers for free. |
| BYOL | The Bring Your Own Licensing option lets your customers bring existing software licenses to Azure.\* |

If you're publishing Kubernetes apps, these are the available licensing options for Azure Container offers:

| Licensing option | Transaction process |
| --- | --- |
| Free | List your offer to customers for free. |
| BYOL | The Bring Your Own Licensing option lets your customers bring existing software licenses to Azure.\* |
| Per core | List your Azure Container offer with pricing based on the critical CPU cores used. You provide the price for one CPU core and we’ll increment the pricing based on the size of the hardware used by your application for the critical cores you’ve tagged in your application as the ones that should generate usage. |
| Per every core in cluster | List your Azure Container offer with pricing based on the total number of CPU cores in the cluster. You provide the price for one CPU core and we’ll increment the pricing based on the size of the hardware in the cluster.|

\* As the publisher, you support all aspects of the software license transaction, including (but not limited to) order, fulfillment, metering, billing, invoicing, payment, and collection.

> [!NOTE]
> To ensure the prices are right before you publish them, first select Save draft to save pricing changes, then export the pricing spreadsheet and review the prices in each market.

When selecting a pricing option, Microsoft does the currency conversion.

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
- **Description** – This description displays in the commercial marketplace listing(s) overview, allowing up to 5,000 characters. Consider including a value proposition, key benefits, intended user base, any category or industry associations, in-app purchase opportunities, any required disclosures, and a link to learn more. This text box has rich text editor controls to make your description more engaging. Optionally, use HTML tags for formatting.
- **Privacy policy link** – The URL for your company’s privacy policy. You are responsible for ensuring your app complies with privacy laws and regulations.
- **Useful links** (optional): Links to various resources for users of your offer. For example, forums, FAQs, and release notes.
- **Contact information**
  - **Support contact** – The name, phone, and email that Microsoft partners will use when your customers open tickets. Include the URL for your support website.
  - **Engineering contact** – The name, phone, and email for Microsoft to use directly when there are problems with your offer. This contact information isn’t listed in the commercial marketplace.
  - **CSP Program contact** (optional): The name, phone, and email if you opt in to the CSP program, so those partners can contact you with any questions. You can also include a URL to your marketing materials.
- **Media**
    - **Logos** – A PNG file for the **Large** logo. Partner Center will use this to create other required logo sizes. You can optionally replace these with different images later.
    - **Screenshots** – At least one and up to five screenshots that show how your offer works. Images must be 1280 x 720 pixels, in PNG format, and include a caption.
    - **Videos** (optional) – Up to four videos that demonstrate your offer. Include a name, URL for YouTube or Vimeo, and a 1280 x 720 pixel PNG thumbnail.

> [!Note]
> Your offer must meet the general [commercial marketplace certification policies](/legal/marketplace/certification-policies#100-general) to be published to the commercial marketplace.

## Preview audience

A preview audience can access your offer prior to being published live in the online stores in order to test the end-to-end functionality before you publish it live. On the **Preview audience** page, you can define a limited preview audience.

You can send invites to Azure subscription IDs. Add up to 10 IDs manually or import up to 100 with a .csv file. If your offer is already live, you can still define a preview audience for testing any changes or updates to your offer.

## Plans and pricing

Container offers require at least one plan. A plan defines the solution scope and limits. You can create multiple plans for your offer to give your customers different technical, pricing, and licensing options.

Containers support different licensing models based on your packaging and deployment needs:

- If you are publishing container images, then two licensing models are supported: Free or Bring Your Own License (BYOL). BYOL means you’ll bill your customers directly, and Microsoft won’t charge you any fees. Microsoft only passes through Azure infrastructure usage fees. 
- If you are publishing Kubernetes apps, then four licensing models are supported: Free, BYOL, Per core, and Per every core in cluster. BYOL means you’ll bill your customers directly, and Microsoft won’t charge you any fees. Microsoft only passes through Azure infrastructure usage fees. For more info on the licensing models, see [Licensing options](#licensing-options). For additional information, see [Commercial marketplace transact capabilities](marketplace-commercial-transaction-capabilities-and-considerations.md).

## Additional sales opportunities

You can choose to opt into Microsoft-supported marketing and sales channels. When creating your offer in Partner Center, you will see two tabs toward the end of the process:

- **Resell through CSPs** – Allow Microsoft Cloud Solution Providers (CSP) partners to resell your solution as part of a bundled offer. For more information about this program, see [Cloud Solution Provider program](cloud-solution-providers.md).
- **Co-sell with Microsoft** – Let Microsoft sales teams consider your IP co-sell eligible solution when evaluating their customers’ needs. For details about co-sell eligibility, see [Requirements for co-sell status](/legal/marketplace/certification-policies). For details on preparing your offer for evaluation, see [Co-sell option in Partner Center](/partner-center/co-sell-configure?context=/azure/marketplace/context/context).

## Container offer requirements

For a container image-based offer, the following requirements apply:

| Requirement | Details |  
|:--- |:--- |  
| Billing and metering | Support either the free or BYOL billing model. |
| Image built from a Dockerfile | Container images must be based on the Docker image specification and built from a Dockerfile. For more information about building Docker images, see the "Usage" section of [Dockerfile reference](https://docs.docker.com/engine/reference/builder/#usage). |
| Hosting in an Azure Container Registry repository | Container images must be hosted in an Azure Container Registry repository. For more information about working with Azure Container Registry, see [Quickstart: Create a private container registry by using the Azure portal](../container-registry/container-registry-get-started-portal.md).<br><br> |
| Image tagging | Container images must contain at least one tag (maximum number of tags: 16). For more information about tagging an image, see the `docker tag` page on the [Docker Documentation](https://docs.docker.com/engine/reference/commandline/tag) site. |

For a Kubernetes application-based offer, the following requirements apply:

| Requirement | Details |  
|:--- |:--- |  
| Billing and metering | Support one of the PerCore, PerEveryCoreInCluster, or BYOL billing models. |
| Artifacts packaged as a Cloud Native Application Bundle (CNAB) | The Helm chart, manifest, createUiDefinition.json, and Azure Resource Manager template must be packaged as a CNAB. For more information, see [prepare technical assets][azure-kubernetes-technical-assets]. |
| Hosting in an Azure Container Registry repository | The CNAB must be hosted in an Azure Container Registry repository. For more information about working with Azure Container Registry, see [Quickstart: Create a private container registry by using the Azure portal](../container-registry/container-registry-get-started-portal.md).<br><br> |

## Next steps

- [Prepare technical assets for a container image-based offer](azure-container-technical-assets.md)
- [Prepare technical assets for a Kubernetes application-based offer](azure-container-technical-assets-kubernetes.md)
