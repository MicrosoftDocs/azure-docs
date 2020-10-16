---
title: Plan a virtual machine offer on Azure Marketplace
description: This article describes the requirements for publishing a virtual machine offer to Azure Marketplace.
services:  Azure, Marketplace, Compute, Storage, Networking, Blockchain, Security
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
author: iqshahmicrosoft
ms.author: iqshah
ms.date: 10/16/2020
---

# Plan a virtual machine offer

This article explains the different options and requirements for publishing a virtual machine (VM) offer to the commercial marketplace. VM offers are transactable offers deployed and billed through Azure Marketplace).

Before you start, [Create a commercial marketplace account in Partner Center](https://docs.microsoft.com/azure/marketplace/partner-center-portal/create-account) and ensure your account is enrolled in the commercial marketplace program.


Use this offer type when your offer is deployed as a virtual machine to the subscription that's associated with your customer. VMs are fully commerce-enabled, using pay-as-you-go or bring-your-own-license (BYOL) licensing models. Microsoft hosts the commerce transaction and bills your customer on your behalf. You get the benefit of using the preferred payment relationship between your customer and Microsoft, including any Enterprise Agreements.

> [!NOTE]
> The monetary commitments associated with an Enterprise Agreement can be used against the Azure usage of your VM, but not against your software licensing fees.

You can restrict the discovery and deployment of your VM to a specific set of customers by publishing the image and pricing as a Private Offer. Private Offers unlock the ability for you to create exclusive offers for your closest customers and offer customized software and terms. The customized terms enable you to highlight a variety of scenarios, including field-led deals with specialized pricing and terms as well as early access to limited release software. Private Offers enable you to give specific pricing or products to a limited set of customers by creating a new plan with those details.

For more information, see [**Private Offers on Azure Marketplace**](https://azure.microsoft.com/blog/private-offers-on-azure-marketplace).

## Fundamentals in technical knowledge

The process of designing, building, and testing offers takes time and requires expertise in both the Azure platform and the technologies used to build your offer.

Your engineering team should have a working knowledge of the following Microsoft technologies:

- [Azure services](https://azure.microsoft.com/services/)
- [Design and architecture of Azure applications](https://azure.microsoft.com/solutions/architecture/)
- [Azure Virtual Machines](https://azure.microsoft.com/services/virtual-machines/), [Azure Storage](https://azure.microsoft.com/services/?filter=storage#storage), and [Azure Networking](https://azure.microsoft.com/services/?filter=networking#networking)


## Listing options

As you prepare to publish a new virtual machine offer, you need to decide which *listing option* to choose. This will determine what additional information you’ll need to provide as you create your offer in Partner Center. You will define your listing option on the **Offer setup** page in Partner Center. 

The following table shows the listing options for SaaS offers in the commercial marketplace.

| Listing option | Transaction process |
| ------------ | ------------- |
| Contact me | The customer contacts you directly from information in your listing.``*`` |
| Free trial | The customer is redirected to your target URL via Azure Active Directory (Azure AD).``*`` |
| Get it now (Free) | The customer is redirected to your target URL via Azure AD.``*`` |
| Sell through Microsoft  | Offers sold through Microsoft are called _transactable_ offers. An offer that is transactable is one in which Microsoft facilitates the exchange of money for a software license on the publisher’s behalf. We bill SaaS offers using the pricing model you choose, and manage customer transactions on your behalf. Note that Azure infrastructure usage fees are billed to you, the partner, directly. You should account for infrastructure costs in your pricing model. This is explained in more detail in [SaaS billing](#saas-billing) below.  |


For more information on these listing options, see [Commercial marketplace transact capabilities](https://docs.microsoft.com/azure/marketplace/marketplace-commercial-transaction-capabilities-and-considerations).

After your offer is published, the listing option you chose for your offer appears as a button in the upper-left corner of your offer's listing page. The following example shows an offer page in Azure Marketplace with the  **Get it now** button.

:::image type="content" source="media/vm/sample-offer-screen.png" alt-text="Sample VM offer screen.":::

## Technical requirements

The technical requirements differ depending on the listing option you choose for your offer.

The _Get it now (Free)_, _Free trial_, and _Sell through Microsoft_ listing options have the following technical requirements:

- You must prepare one operating system virtual hard disk (VHD), and optional data disk VHDs.
- You must create at least one plan for your offer. Your plan is priced based on the [licensing option](#licensing-options) you select.
- The customer can cancel your offer at any time.

This article describes how to prepare and configure a virtual machine (VM) for Azure Marketplace. A VM contains two components:

1. **Operating system virtual hard disk (VHD)** – Contains the operating system and solution that deploys with your offer. The process of preparing the VHD differs depending on whether it is a Linux-, Windows-, or custom-based VM.
1. **Data disk VHDs** (optional) – Dedicated, persistent storage for a VM. Don't use the operating system VHD (for example, the C: drive) to store persistent information.

A VM image contains one operating system disk and up to 16 data disks. Use one VHD per data disk, even if the disk is blank.

> [!NOTE]
> Regardless of which operating system you use, add only the minimum number of data disks needed by the solution. Customers cannot remove disks that are part of an image at the time of deployment, but they can always add disks during or after deployment.

> [!IMPORTANT]
> Every VM Image in a plan must have the same number of data disks.

## Plans

Transactable offers require at least one plan. A plan defines the solution scope and limits, and the associated pricing. You can create multiple plans for your offer to give your customers different technical and pricing options. If you choose to process transactions independently instead of creating a transactable offer, the **Plans** page is not visible. If so, skip this section and go to [Additional sales opportunities](#additional-sales-opportunities).

See [Plans and pricing for commercial marketplace offers](plans-pricing.md) for general guidance about plans, including pricing models, free trials, and private plans. The following sections discuss additional information specific to SaaS offers.

## Licensing options

As you prepare to publish a new VM offer, you need to decide which licensing option to choose. This will determine what additional information you'll need to provide later as you create your offer in Partner Center.

These are the available licensing options for VM offers:

| Licensing option | Transaction process |
| --- | --- |
| Free trial | Offer your customers a one-, three- or six-month free trial. |
| Test drive | This option lets your customers evaluate VMs at no additional cost to them. They don't need to be an existing Azure customer to engage with the trial experience. For details, see [What is a test drive?](https://docs.microsoft.com/azure/marketplace/what-is-test-drive) |
| BYOL | This Bring Your Own Licensing option lets your customers bring existing software licenses to Azure.\* |
| Usage-based | Also known as pay-as-you-go, this option lets your customers pay per hour. |
| Interactive demo  | Give your customers a guided experience of your solution using an interactive demonstration. The benefit is that you can offer a trial experience without having to provide a complicated setup of your complex solution. |
|

\* As the publisher, you support all aspects of the software license transaction, including (but not limited to) order, fulfillment, metering, billing, invoicing, payment, and collection.

## Test drives


## Customer leads

You must connect your offer to your customer relationship management (CRM) system to collect customer information. The customer will be asked for permission to share their information. These customer details, along with the offer name, ID, and online store where they found your offer, will be sent to the CRM system that you've configured. The commercial marketplace supports a variety of CRM systems, along with the option to use an Azure table or configure an HTTPS endpoint using Power Automate.

You can add or modify a CRM connection at any time during or after offer creation. For detailed guidance, see
[Customer leads from your commercial marketplace offer](partner-center-portal/commercial-marketplace-get-customer-leads.md).

## Legal contracts

To simplify the procurement process for customers and reduce legal complexity for software vendors, Microsoft offers a standard contract you can use for your offers in the commercial marketplace. When you offer your software under the standard contract, customers only need to read and accept it one time, and you don't have to create custom terms and conditions.

If you choose to use the standard contract, you have the option to add universal amendment terms and up to 10 custom amendments to the standard contract. You can also use your own terms and conditions instead of the standard contract. You will manage these details in the **Properties** page. For detailed information, see [Standard contract for Microsoft commercial marketplace](standard-contract.md).

> [!NOTE]
> After you publish an offer using the standard contract for the commercial marketplace, you cannot use your own custom terms and conditions. It is an "or" scenario. You either offer your solution under the standard contract or your own terms and conditions. If you want to modify the terms of the standard contract you can do so through Standard Contract Amendments.

## Offer listing details

When you [create a new SaaS offer](create-new-saas-offer.md) in Partner Center, you will enter text, images, optional videos, and other details on the **Offer listing** page. This is the information that customers will see when they discover your offer listing in the commercial marketplace, as shown in the following example.

:::image type="content" source="./media/example-saas-1.png" alt-text="Illustrates how this offer appears in Microsoft AppSource.":::

**Call-out descriptions**

1. Logo
2. Categories
3. Industries
4. Support address (link)
5. Terms of use
6. Privacy policy
7. Offer name
8. Summary
9. Description
10. Screenshots/videos
11. Documents

The following example shows an offer listing in the Azure portal.

![Illustrates an offer listing in the Azure portal.](./media/example-managed-services.png)

**Call out descriptions**

1. Title
1. Description
1. Useful links
1. Screenshots

> [!NOTE]
> Offer listing content is not required to be in English if the offer description begins with the phrase "This application is available only in [non-English language]".

To help create your offer more easily, prepare some of these items ahead of time. The following items are required unless otherwise noted.

- **Name**: This name will appear as the title of your offer listing in the commercial marketplace. The name may be trademarked. It cannot contain emojis (unless they are the trademark and copyright symbols) and must be limited to 50 characters.
- **Search results summary**: Describe the purpose or function of your offer as a single sentence with no line breaks in 100 characters or less. This summary is used in the commercial marketplace listing(s) search results.
- **Description**: This description will be displayed in the commercial marketplace listing(s) overview. Consider including a value proposition, key benefits, intended user base, any category or industry associations, in-app purchase opportunities, any required disclosures, and a link to learn more.
    
    This text box has rich text editor controls that you can use to make your description more engaging. You can also use HTML tags to format your description. You can enter up to 3,000 characters of text in this box, including HTML markup. For additional tips, see [Write a great app description](https://docs.microsoft.com/windows/uwp/publish/write-a-great-app-description).

- **Getting Started Instructions**: If you choose to sell your offer through Microsoft (transactable offer), this field is required. These are instructions to help customers connect to your SaaS offer. You can add up to 3,000 characters of text and links to more detailed online documentation.
- **Search keywords** (optional): Provide up to three search keywords that customers can use to find your offer in the online stores. You don't need to include the offer **Name** and **Description**: that text is automatically included in search.
- **Privacy policy link**: The URL for your company’s privacy policy. You must provide a valid privacy policy and are responsible for ensuring your app complies with privacy laws and regulations.
- **Contact information**: You must designate the following contacts from your organization:
  - **Support contact**: Provide the name, phone, and email for Microsoft partners to use when your customers open tickets. You must also include the URL for your support website.
  - **Engineering contact**: Provide the name, phone, and email for Microsoft to use directly when there are problems with your offer. This contact information isn’t listed in the commercial marketplace.
  - **CSP Program contact** (optional): Provide the name, phone, and email if you opt in to the CSP program, so those partners can contact you with any questions. You can also include a URL to your marketing materials.
- **Useful links** (optional): You can provide links to various resources for users of your offer. For example, forums, FAQs, and release notes.
- **Supporting documents**: You can provide up to three customer-facing documents, such as whitepapers, brochures, checklists, or PowerPoint presentations.
- **Media – Logos**: Provide a PNG file for the **Large** size logo. Partner Center will use this to create a **Small** and a **Medium** logo. You can optionally replace these with different images later.

   - Large (from 216 x 216 to 350 x 350 px, required)
   - Medium (90 x 90 px, optional)
   - Small (48 x 48 px, optional)

  These logos are used in different places in the online stores:

  - The Small logo appears in Azure Marketplace search results and on the Microsoft AppSource main page and search results page.
  - The Medium logo appears when you create a new resource in Microsoft Azure.
  - The Large logo appears on your offer listing page in Azure Marketplace and Microsoft AppSource.

- **Media - Screenshots**: You must add at least one and up to five screenshots with the following requirements, that show how your offer works:
  - 1280 x 720 pixels
  - .png file
  - Must include a caption
- **Media - Videos** (optional): You can add up to four videos with the following requirements, that demonstrate your offer:
  - Name
  - URL: Must be hosted on YouTube or Vimeo only.
  - Thumbnail: 1280 x 720 .png file

> [!Note]
> Your offer must meet the general [commercial marketplace certification policies](https://docs.microsoft.com/legal/marketplace/certification-policies#100-general) and the [software as a service policies](https://docs.microsoft.com/legal/marketplace/certification-policies#1000-software-as-a-service-saas) to be published to the commercial marketplace.

## Additional sales opportunities

You can choose to opt into Microsoft-supported marketing and sales channels. When creating your offer in Partner Center, you will see two tabs toward the end of the process:

- **Resell through CSPs**: Use this option to allow Microsoft Cloud Solution Providers (CSP) partners to resell your solution as part of a bundled offer. See [Cloud Solution Provider program](cloud-solution-providers.md) for more information.

- **Co-sell with Microsoft**: This option lets Microsoft sales teams consider your IP co-sell eligible solution when evaluating their customers’ needs. See [Co-sell option in Partner Center](./partner-center-portal/commercial-marketplace-co-sell.md) for detailed information on how to prepare your offer for evaluation.



> [!NOTE]
> The Cloud Solution Provider (CSP) partner channel opt-in is now available. For more information about marketing your offer through Microsoft CSP partner channels, see [**Cloud Solution Providers**](https://docs.microsoft.com/azure/marketplace/cloud-solution-providers).


FROM OTHER ARTICLE: 
## Category

Select categories and subcategories to place your offer in the appropriate marketplace search areas. Be sure to describe how your offer supports these categories in the offer description. Select:

- At least one and up to two categories, including a primary and a secondary category (optional).
- Up to two subcategories for each primary and/or secondary category. If no subcategory is applicable to your offer, select **Not applicable**.

See the full list of categories and subcategories in [Offer Listing Best Practices](gtm-offer-listing-best-practices.md). Virtual machine offers always appear under the **Compute** category on Azure Marketplace.

## Legal

You must provide offer terms and conditions to your customers. You have two options: use your own terms and conditions, or use the Standard Contract for the Microsoft commercial marketplace.

- **Use your own terms and conditions**

   To provide your own custom terms and conditions, enter up to 10,000 characters of text in the **Terms and conditions** box. If you require a longer description, enter a single web address for your terms and conditions. It will be displayed to customers as an active link.

   Your customers must accept these terms before they can try your offer.

- **Use the Standard Contract for the Microsoft commercial marketplace**

   To simplify the procurement process for customers and reduce legal complexity for software vendors, Microsoft offers a Standard Contract for the commercial marketplace. When you offer your software under the Standard Contract, customers need to read and accept it only once, and you don't have to creating custom terms and conditions.

   Use the Standard Contract by selecting the **Use the Standard Contract for Microsoft's commercial marketplace** check box and then, in the pop-up window, select **Accept** (you might have to scroll up to view it).

   ![Screenshot showing the Legal pane in Partner Center with the "Use the Standard Contract for Microsoft's commercial marketplace" check box.](media/use-standard-contract.png)

  > [!NOTE]
  > After you publish an offer by using the Standard Contract for the commercial marketplace, you can't use your own custom terms and conditions. You can offer a solution under either the Standard Contract or your own terms and conditions.

  For more information, see [Standard Contract for the Microsoft commercial marketplace](standard-contract.md). Download the [Standard Contract](https://go.microsoft.com/fwlink/?linkid=2041178) PDF file (make sure your pop-up blocker is turned off).

  ## Standard Contract amendments

  Standard Contract amendments let you select the Standard Contract terms for simplicity and create the terms for your product or business. Customers need to review the amendments to the contract only if they've already reviewed and accepted the Microsoft Standard Contract. There are two types of amendments:

  * **Universal amendments**: These amendments are applied universally to the Standard Contract for all customers. They are shown to every customer of the offer in the purchase flow. Customers must accept the terms of the Standard Contract and the amendments before they can use your offer. You can provide a single universal amendment per offer. You can enter an unlimited number of characters in this box. These terms are displayed to customers in AppSource, Azure Marketplace, and/or the Azure portal during the discovery and purchase flow.

  * **Custom amendments**: These special amendments to the Standard Contract are targeted to specific customers through Azure tenant IDs. You can choose the tenant you want to target. Only customers from the tenant are presented with the custom amendment terms in the offer's purchase flow. Customers must accept the terms of the Standard Contract and the amendments before they can use your offer.

    1. Start by selecting **Add custom amendment terms (Max 10)**. You can provide up to ten custom amendment terms per offer. Do the following:

       a. Enter your own amendment terms in the **Custom amendment terms** box. You can enter an unlimited number of characters. Only customers from the tenant IDs that you specify for these custom terms will see them in the offer's purchase flow in the Azure portal.

       b. (Required) Provide **Tenant IDs**. Each custom amendment can be targeted to up to 20 tenant IDs. If you add a custom amendment, you must provide at least one tenant ID, which identifies your customer in Azure. Your customer can find this for you in Azure by selecting **Azure Active Directory** > **Properties**. The directory ID value is the tenant ID (for example, 50c464d3-4930-494c-963c-1e951d15360e). You can also find the organization's tenant ID of your customer by using their domain name web address at [What is my Microsoft Azure and Microsoft 365 tenant ID?](https://www.whatismytenantid.com/).

       c. (Optional) Provide a friendly **Description** for the tenant ID, one that helps you identify the customer that you're targeting with the amendment.

        > [!NOTE]
        > These two types of amendments are paired with each other. Customers who are targeted with custom amendments will also get the universal amendments to the Standard Contract during the purchase.

    1. Select **Save draft** before you continue.
    2. 
## Next steps

- [Sign in to Partner Center](https://partner.microsoft.com/dashboard/account/v3/enrollment/introduction/partnership)
- [Create a virtual machine offer on Azure Marketplace](azure-vm-create.md)
- [Offer listing best practices](gtm-offer-listing-best-practices.md)
 