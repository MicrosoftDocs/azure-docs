---
title: Plan an Azure Application offer for the commercial marketplace
description: Learn how to plan for a new Azure application offer for listing or selling in Azure Marketplace, or through the Cloud Solution Provider (CSP) program using the commercial marketplace portal in Microsoft Partner Center.
author: aarathin
ms.author: aarathin
ms.reviewer: dannyevers
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 11/09/2020
---

# Plan an Azure Application offer for the commercial marketplace

This article explains the different options and requirements for publishing an Azure Application offer to the Microsoft commercial marketplace.

## Before you begin

Designing, building, and testing Azure application offers requires technical knowledge of both the Azure platform and the technologies used to build the offer. Your engineering team should have knowledge about the following Microsoft technologies:

- Basic understanding of [Azure Services](https://azure.microsoft.com/services/).
- How to [design and architect Azure applications](https://azure.microsoft.com/solutions/architecture/).
- Working knowledge of [Azure Virtual Machines](https://azure.microsoft.com/services/virtual-machines/), [Azure Storage](https://azure.microsoft.com/services/?filter=storage#storage), and [Azure Networking](https://azure.microsoft.com/services/?filter=networking#networking).
- Working knowledge of [Azure Resource Manager](https://azure.microsoft.com/features/resource-manager/).
- Working knowledge of [JSON](https://www.json.org/).

### Technical documentation and resources

Review the following resources as you plan your Azure application offer for the commercial marketplace.

- [Understand Azure Resource Manager Templates](/azure/azure-resource-manager/resource-group-authoring-templates.md)
- Quickstarts:
    - [Azure Quickstart templates](https://azure.microsoft.com/documentation/templates/)
    - [Azure templates best practices guide](https://github.com/Azure/azure-quickstart-templates/blob/master/1-CONTRIBUTION-GUIDE/best-practices.md)
    - [Publish application definition](/azure/managed-applications/publish-service-catalog-app)
    - [Deploy service catalog app](/azure/managed-applications/deploy-service-catalog-quickstart)
- Tutorials:
    - [Create definition files](/azure/managed-applications/publish-service-catalog-app)
    - [Publish marketplace application](/azure/managed-applications/publish-marketplace-app)
- Samples:
    - [Azure CLI](/azure/managed-applications/cli-samples)
    - [Azure PowerShell](/azure/managed-applications/powershell-samples)
    - [Managed application solutions](/azure/managed-applications/sample-projects)

The video [Building Solution Templates, and Managed Applications for the Azure Marketplace](https://channel9.msdn.com/Events/Build/2018/BRK3603) gives a comprehensive introduction to the Azure application offer type:

- What offer types are available
- What technical assets are required
- How to author an Azure Resource Manager template
- Developing and testing the app UI
- How to publish the app offer
- The application review process

### Suggested tools

Choose one or both of the following scripting environments to help manage your Azure application:

- [Azure PowerShell](https://docs.microsoft.com/powershell/azure/)
- [Azure CLI](https://docs.microsoft.com/cli/azure)

We recommend adding the following tools to your development environment:

- [Azure Storage Explorer](/azure/vs-azure-tools-storage-manage-with-storage-explorer)
- [Visual Studio Code](https://code.visualstudio.com/) with the following extensions:
    - Extension: [Azure Resource Manager Tools](https://marketplace.visualstudio.com/items?itemName=msazurermtools.azurerm-vscode-tools)
    - Extension: [Beautify](https://marketplace.visualstudio.com/items?itemName=HookyQR.beautify)
    - Extension: [Prettify JSON](https://marketplace.visualstudio.com/items?itemName=mohsen1.prettify-json)

You can review the available tools in the [Azure Developer Tools](https://azure.microsoft.com/tools/) page. Also if you are using Visual Studio, the [Visual Studio Marketplace](https://marketplace.visualstudio.com/).

## Listing options

After your offer is published, the listing options for your offer appear as a button in the upper-left corner of your offer’s listing page. For example, the following screenshot shows an offer listing page in Azure Marketplace with the _Get It Now_ button. If you had chosen to offer a test drive, the Test Drive button would also be shown.

:::image type="content" source="media/create-new-azure-app-offer/azure-app-listing-page.png" alt-text="Illustrates a listing page on Azure Marketplace.":::

## Test drive

You can choose to enable a test drive for your Azure Application offer that lets customers try your offer before purchasing it. To learn more about test drives, see [What is a test drive?](what-is-test-drive.md). For information about configuring different kinds of test drives, see [Test drive technical configuration](test-drive-technical-configuration.md).

You can also read about [test drive best practices](https://github.com/Azure/AzureTestDrive/wiki/Test-Drive-Best-Practices) and download the [Test drives overview](https://assetsprod.microsoft.com/mpn/azure-marketplace-appsource-test-drives.pdf) PDF (make sure your pop-up blocker is off).

> [!NOTE]
> Information the user should notice even if skimmingBecause all Azure applications are implemented using an Azure Resource Manager template, the only type of test drive available for an [Azure Application is an Azure Resource Manager based test drive](azure-resource-manager-test-drive.md).

## Customer leads

You must connect your offer to your customer relationship management (CRM) system to collect customer information. The customer will be asked for permission to share their information. These customer details, along with the offer name, ID, and online store where they found your offer, will be sent to the CRM system that you've configured. The commercial marketplace supports a variety of CRM systems, along with the option to use an Azure table or configure an HTTPS endpoint using Power Automate.

You can add or modify a CRM connection at any time during or after offer creation. For detailed guidance, see [Customer leads from your commercial marketplace offer](partner-center-portal/commercial-marketplace-get-customer-leads.md).

## Categories and subcategories

You can choose at least one and up to two categories for grouping your offer into the appropriate commercial marketplace search areas. You can choose up to two subcategories for each primary and secondary category. For a full list of categories and subcategories, see [Offer Listing Best Practices](gtm-offer-listing-best-practices.md#categories).

## Legal contracts

To simplify the procurement process for customers and reduce legal complexity for software vendors, Microsoft offers a standard contract you can use for your offers in the commercial marketplace. When you offer your software under the standard contract, customers only need to read and accept it one time, and you don't have to create custom terms and conditions.

If you choose to use the standard contract, you have the option to add universal amendment terms and up to 10 custom amendments to the standard contract. You can also use your own terms and conditions instead of the standard contract. You will manage these details in the **Properties** page. For detailed information, see [Standard contract for Microsoft commercial marketplace](standard-contract.md).

> [!NOTE]
> After you publish an offer using the standard contract for the commercial marketplace, you cannot use your own custom terms and conditions. It is an "or" scenario. You either offer your solution under the standard contract or your own terms and conditions. If you want to modify the terms of the standard contract you can do so through Standard Contract Amendments.

## Offer listing details

When you create a new Azure Application offer in Partner Center, you will enter text, images, optional videos, and other details on the Offer listing page. This is the information that customers will see when they discover your offer listing in the Azure Marketplace, as shown in the following example.

:::image type="content" source="media/create-new-azure-app-offer/example-azure-marketplace-app.png" alt-text="Illustrates how this offer appears in Azure Marketplace.":::

#### Call-out descriptions

1. Logo
2. Categories
3. Support address (link)
4. Terms of use
5. Privacy policy address (link)
6. Offer name
7. Summary
8. Description
9. Screenshots/videos

The following screenshot shows how offer information appears in the Azure portal:

:::image type="content" source="media/create-new-azure-app-offer/example-virtual-machine-container-iot-edge-saas.png" alt-text="Illustrates how this offer appears in the Azure portal.":::

#### Call-out descriptions

1. Title
2. Description
3. Useful links
4. Screenshots

> [!NOTE]
> Offer listing content is not required to be in English if the offer description begins with the phrase "This application is available only in [non-English language]".

To help create your offer more easily, prepare some of these items ahead of time. The following items are required unless otherwise noted.

- **Name**: This name will appear as the title of your offer listing in the commercial marketplace. The name may be trademarked. It cannot contain emojis (unless they are the trademark and copyright symbols) and must be limited to 50 characters.
- **Search results summary**: Describe the purpose or function of your offer as a single sentence, in plain text with no line breaks, in 100 characters or less. This summary is used in the commercial marketplace listing(s) search results.
- **Short description**: Provide up to 256 characters of plain text. This summary will appear on your offer’s details page.
- **Description**: This description will be displayed in the Azure Marketplace listing(s) overview. Consider including a value proposition, key benefits, intended user base, any category or industry associations, in-app purchase opportunities, customer need or pain that the offer addresses, any required disclosures, and a link to learn more.

    This text box has rich text editor controls that you can use to make your description more engaging. You can also use HTML tags to format your description. You can enter up to 3,000 characters of text in this box, which includes HTML markup and spaces. For additional tips, see [Write a great app description](/windows/uwp/publish/write-a-great-app-description.md) and [HTML tags supported in the commercial marketplace offer descriptions](supported-html-tags.md).

- **Search keywords** (optional): Provide up to three search keywords that customers can use to find your offer in the online store. For best results, also use these keywords in your description. You don't need to include the offer **Name** and **Description**. That text is automatically included in search.
- **Privacy policy link**: The URL for your company’s privacy policy. You must provide a valid privacy policy and are responsible for ensuring your app complies with privacy laws and regulations.
- **Useful links** (optional): You can provide links to various resources for users of your offer. For example, forums, FAQs, and release notes.
- **Contact information**: You must designate the following contacts from your organization:
  - **Support contact**: Provide the name, phone, and email for Microsoft partners to use when your customers open tickets. You must also include the URL for your support website.
  - **Engineering contact**: Provide the name, phone, and email for Microsoft to use directly when there are problems with your offer. This contact information isn’t listed in the commercial marketplace.
  - **CSP Program contact** (optional): Provide the name, phone, and email if you opt in to the Cloud Solution Provider (CSP) program, so those partners can contact you with any questions. You can also include a URL to your marketing materials.
- **Media – Logos**: Provide a PNG file for the **Large** size logo. Partner Center will use this to create a **Small** and a **Medium** logo. You can optionally replace these with different images later.
  - Large (from 216 x 216 to 350 x 350 px, required)
  - Medium (90 x 90 px, optional)
  - Small (48 x 48 px, optional)

  These logos are used in different places in the online stores:
  - The Small logo appears in Azure Marketplace search results.
  - The Medium logo appears when you create a new resource in Microsoft Azure.
  - The Large logo appears on your offer listing page in Azure Marketplace.

  Follow these guidelines for your logos:

  - The Azure design has a simple color palette. Limit the number of primary and secondary colors on your logo.
  - The theme colors of the portal are white and black. Don't use these colors as the background color for your logo. Use a color that makes your logo prominent in the portal. We recommend simple primary colors.
  - If you use a transparent background, make sure that the logo and text aren't white, black, or blue.
  - The look and feel of your logo should be flat and avoid gradients in the logo or background. Don't place text on the logo, not even your company or brand name. Blurry images will cause your submission to be rejected.
  - Make sure the logo isn't stretched.

- **Media - Screenshots** (optional): We recommend that you add screenshots that show how your offer works. You can add up to five screenshots with the following requirements, that show how your offer works:
  - 1280 x 720 pixels
  - .png file
  - Must include a caption
- **Media – Videos** (optional): You can add up to five videos with the following requirements, that demonstrate your offer:
  - Name
  - URL: Must be hosted on YouTube or Vimeo only.
  - Thumbnail: 1280 x 720 .png file

> [!NOTE]
> Your offer must meet the general [commercial marketplace certification policies](/legal/marketplace/certification-policies#100-general.md) to be published to the commercial marketplace.

## Preview audience

A preview audience can access your offer prior to being published live in the online stores in order to test the end-to-end functionality before you publish it live.

> [!NOTE]
> A preview audience differs from a private plan. A private plan is one you make available only to a specific audience you choose. This enables you to negotiate a custom plan with specific customers.

You define the preview audience using Azure subscription IDs, along with an optional description for each. Neither of these fields can be seen by customers.

## Technical configuration

For managed applications that emit metering events using the [Marketplace metering service APIs](partner-center-portal/marketplace-metering-service-apis.md), you must provide the identity that your service will use when emitting metering events.

This configuration is required if you want to use [Batch usage event](partner-center-portal/marketplace-metering-service-apis.md#metered-billing-batch-usage-event). In case you want to submit [usage event](partner-center-portal/marketplace-metering-service-apis.md#metered-billing-single-usage-event), you can also use the [instance metadata service](/azure/active-directory/managed-identities-azure-resources/overview.md) to get the [JSON web token (JWT) bearer token](partner-center-portal/pc-saas-registration.md#how-to-get-the-publishers-authorization-token)).

- **Azure Active Directory tenant ID** (required): Inside the Azure portal, you must [create an Azure Active Directory (AD) app](/azure/active-directory/develop/howto-create-service-principal-portal.md) so we can validate the connection between our two services is behind an authenticated communication. To find the [tenant ID](/azure/active-directory/develop/howto-create-service-principal-portal.md#get-tenant-and-app-id-values-for-signing-in) for your Azure Active Directory (Azure AD) app, to the [App registrations](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade) blade in your Azure Active Directory. In the **Display name** column, select the app. Then look for **Properties**, and then for the **Directory (tenant) ID** (for example `50c464d3-4930-494c-963c-1e951d15360e`).
- **Azure Active Directory application ID** (required): You also need your [application ID](/azure/active-directory/develop/howto-create-service-principal-portal#get-tenant-and-app-id-values-for-signing-in.md) and an authentication key. To find your application ID, go to the [App registrations](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade) blade in your your Azure Active Directory. In the **Display name** column, select the app and then look for the **Application (client) ID** (for example `50c464d3-4930-494c-963c-1e951d15360e`). To find the authentication key, go to **Settings** and select **Keys**. You will need to provide a description and duration and will then be provided a number value.

> [!NOTE]
> The Azure application ID will be associated to your publisher ID and can only be re-used within this publisher account.

## Additional sales opportunities

You can choose to opt into Microsoft-supported marketing and sales channels. When creating your offer in Partner Center, you will see two tabs toward the end of the process:

- **Resell through CSPs**: Use this option to allow Microsoft Cloud Solution Providers (CSP) partners to resell your solution as part of a bundled offer. See [Cloud Solution Provider program](/azure/marketplace/cloud-solution-providers.md) for more information.
- **Co-sell with Microsoft**: This option lets Microsoft sales teams consider your IP co-sell eligible solution when evaluating their customers’ needs. See [Co-sell option in Partner Center](partner-center-portal/commercial-marketplace-co-sell.md) for detailed information on how to prepare your offer for evaluation. For more information about marketing your offer through the Microsoft CSP partner channels, see [Cloud Solution Providers](cloud-solution-providers.md).

To learn more, see [Grow your cloud business with Azure Marketplace](https://azuremarketplace.microsoft.com/sell).

## Plans

Azure Application offers require at least one plan. A plan defines the solution scope and limits, and the associated pricing, if applicable. You can create multiple plans for your offer to give your customers different technical and pricing options.

For general guidance about plans, including pricing models, and private plans, see [Plans and pricing for commercial marketplace offers](plans-pricing.md). The following sections discuss additional information specific to Azure Application plans.

### Types of plans

There are two kinds of Azure application plans: _solution templates_ and _managed applications_.

- **Solution template** is one of the main ways to publish a solution in the commercial marketplace. Use this plan type when your solution requires additional deployment and configuration automation beyond a single virtual machine (VM). With a solution template, you can automate the process of providing multiple resources, including VMs, networking, and storage resources to provide complex IaaS solutions. Solution templates can employ many different kinds of Azure resources, including but not limited to VMs. For more information about building solution templates, see [What is Azure Resource Manager?](/azure/azure-resource-manager/resource-group-overview.md)
- **Managed application** is similar to solution templates, with one key difference. In a managed application, the resources are deployed to a resource group that's managed by the publisher of the app. The resource group is present in the consumer's subscription, but an identity in the publisher's tenant has access to the resource group. As the publisher, you specify the cost for ongoing support of the solution. Use Managed applications to easily build and deliver fully managed, turnkey applications to your customers. For more information about the advantages and types of managed applications, see the [Azure managed applications overview](/azure/managed-applications/overview.md).

Use an Azure application solution template under the following conditions:

- Your solution requires additional deployment and configuration automation beyond a single virtual machine (VM), such as a combination of VMs, networking, and storage resources.
- Your customers are going to manage the solution themselves.

Use an Azure Application: Managed application plan when the following conditions are required:

- You will deploy a subscription-based solution for your customer using either a virtual machine (VM) or an entire infrastructure as a service (IaaS)-based solution.
- You or your customer requires the solution to be managed by a partner. For example, a partner can be a systems integrator or a managed service provider (MSP).

## Next steps

- To plan a solution template, see [Plan a solution template for an Azure application offer](plan-azure-app-solution-template.md).
- To plan an Azure managed application, see [Plan an Azure managed application for an Azure application offer](plan-azure-app-managed-app.md).
