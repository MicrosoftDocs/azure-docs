---
title: Create an Azure virtual machine offer on Azure Marketplace
description: Learn how to create a virtual machine offer on Azure Marketplace with the required SKU.
author: emuench
ms.author: mingshen
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 05/19/2020
---

# Create an Azure virtual machine offer on Azure Marketplace

This article describes how to create and publish an Azure virtual machine offer to [Azure Marketplace](https://azuremarketplace.microsoft.com/). It addresses both Windows-based and Linux-based virtual machines that contain an operating system, a virtual hard disk (VHD), and up to 16 data disks. 

Before you start, [Create a commercial marketplace account in Partner Center](https://docs.microsoft.com/azure/marketplace/partner-center-portal/create-account). Ensure that your account is enrolled in the commercial marketplace program.

## Introduction

### The benefits of publishing to Azure Marketplace

When you publish your offers on Azure Marketplace, you can:

- Promote your company with the help of the Microsoft brand.
- Reach over 100 million Office 365 and Dynamics 365 users and more than 200,000 organizations.
- Get high-quality leads from these marketplaces.
- Get your services promoted by the Microsoft field sales and telesales teams.

### Before you begin

If you haven't done so yet, review the [Virtual machine offer publishing guide](https://docs.microsoft.com/azure/marketplace/marketplace-virtual-machines) and this Azure Virtual Machine material:

- Quickstart guides
  - [Azure quickstart templates](https://azure.microsoft.com/resources/templates/)
  - [GitHub Azure quickstart templates](https://github.com/azure/azure-quickstart-templates)
- Tutorials
  - [Linux VMs](https://docs.microsoft.com/azure/virtual-machines/linux/tutorial-manage-vm)
  - [Windows VMs](https://docs.microsoft.com/azure/virtual-machines/windows/tutorial-manage-vm)
- Samples
  - [Azure CLI samples for Linux VMs](https://docs.microsoft.com/azure/virtual-machines/linux/cli-samples)
  - [Azure PowerShell for Linux VMs](https://docs.microsoft.com/azure/virtual-machines/linux/powershell-samples)
  - [Azure CLI samples for Windows VMs](https://docs.microsoft.com/azure/virtual-machines/windows/cli-samples)
  - [Azure PowerShell for Windows VMs](https://docs.microsoft.com/azure/virtual-machines/scripts/virtual-machines-windows-powershell-sample-create-vm-quick)

### Fundamentals in technical knowledge

The process of designing, building, and testing offers takes time and requires expertise in both the Azure platform and the technologies that are used to build your offer.

Your engineering team should have a basic understanding and working knowledge of the following Microsoft technologies:

- [Azure services](https://azure.microsoft.com/services/)
- [Design and architecture of Azure applications](https://azure.microsoft.com/solutions/architecture/)
- [Azure Virtual Machines](https://azure.microsoft.com/services/virtual-machines/), [Azure Storage](https://azure.microsoft.com/services/?filter=storage#storage), and [Azure Networking](https://azure.microsoft.com/services/?filter=networking#networking)

## Create a new offer

1. Sign in to [Partner Center](https://partner.microsoft.com/dashboard/home).
2. On the left pane, select **Commercial Marketplace** > **Overview**.
3. On the **Overview** page, select **New offer** > **Azure Virtual Machine**.

    ![Screenshot showing the left pane menu options and the "New offer" button.](./media/new-offer-azure-virtual-machine.png)

> [!NOTE]
> After your offer is published, any edits you make to it in Partner Center appear on Azure Marketplace only after you republish the offer. Be sure to always republish an offer after making changes to it.

## New offer

Enter an **Offer ID**. This is a unique identifier for each offer in your account.

- This ID is visible to customers in the web address for the Azure Marketplace offer and in Azure PowerShell and the Azure CLI, if applicable.
- Use only lowercase letters and numbers. The ID can include hyphens and underscores, but no spaces, and is limited to 50 characters. For example, if you enter **test-offer-1**, the offer web address will be `https://azuremarketplace.microsoft.com/marketplace/../test-offer-1`.
- The Offer ID can't be changed after you select **Create**.

Enter an **Offer alias**. The offer alias is the name that's used for the offer in Partner Center.

- This name isn't used on Azure Marketplace. It is different from the offer name and other values that are shown to customers.

Select **Create** to generate the offer and continue.

## Offer setup

### Test Drive

A *Test Drive* is a great way to showcase your offer to potential customers. It gives them the option to "try before you buy," which can help increase your conversions and generate highly qualified leads. For more information, see [What is a Test Drive?](https://docs.microsoft.com/azure/marketplace/cloud-partner-portal/test-drive/what-is-test-drive).

To enable a Test Drive for a fixed period of time, select the **Enable a test drive** check box. To remove the Test Drive from your offer, clear the check box.

Additional Test Drive resources:

- [Technical best practices](https://github.com/Azure/AzureTestDrive/wiki/Test-Drive-Best-Practices)
- [Marketing best practices](https://docs.microsoft.com/azure/marketplace/cloud-partner-portal/test-drive/marketing-and-best-practices)
- [Download the Test Drive overview](https://assetsprod.microsoft.com/mpn/azure-marketplace-appsource-test-drives.pdf) PDF file (make sure that your pop-up blocker is turned off).

### Customer leads

When you're publishing your offer to the commercial marketplace with Partner Center, connect it to your Customer Relationship Management (CRM) system. This lets you receive customer contact information as soon as someone expresses interest in or uses your product. Connecting to a CRM is required if you want to enable a Test Drive (see the preceding section). Otherwise, connecting to a CRM is optional.

1. Select a lead destination where you want us to send customer leads. Partner Center supports the following CRM systems:
    - [Dynamics 365](https://docs.microsoft.com/azure/marketplace/partner-center-portal/commercial-marketplace-lead-management-instructions-dynamics) for customer engagement
    - [Marketo](https://docs.microsoft.com/azure/marketplace/partner-center-portal/commercial-marketplace-lead-management-instructions-marketo)
    - [Salesforce](https://docs.microsoft.com/azure/marketplace/partner-center-portal/commercial-marketplace-lead-management-instructions-salesforce)

    > [!NOTE]
    > If your CRM system isn't listed here, use [Azure Table storage](https://docs.microsoft.com/azure/marketplace/partner-center-portal/commercial-marketplace-lead-management-instructions-azure-table) or an [HTTPS endpoint](https://docs.microsoft.com/azure/marketplace/partner-center-portal/commercial-marketplace-lead-management-instructions-https) to store your customer lead data. Then export the data to your CRM system.

1. Connect your offer to the lead destination when you're publishing in Partner Center.
1. Confirm that the connection to the lead destination is configured properly. After you publish it in Partner Center, Microsoft validates the connection and sends you a test lead. While you're previewing the offer before it goes live, you can also test your lead connection by trying to deploy the offer yourself in the preview environment.
1. Ensure that the connection to the lead destination stays updated so that you don't lose any leads.

1. Select **Save draft** before you continue.

## Properties

On the **Properties** page, you define the categories and industries that are used to group your offer on Azure Marketplace, your application version, and the legal contracts that support your offer.

### Categories

Select a minimum of one and a maximum of five categories. You use these categories to place your offer in the appropriate Azure Marketplace search areas. In the offer description, explain how your offer supports these categories. Virtual machine offers appear under the **Compute** category on Azure Marketplace.

### Legal

You must provide offer terms and conditions to your customers. You have two options:

- **Use your own terms and conditions**

   To provide your own custom terms and conditions, enter up to 10,000 characters of text in the **Terms and conditions** box. If you require a longer description, enter a single web address for your terms and conditions. It will be displayed to customers as an active link.

   Your customers must accept these terms before they can try your offer.

- **Use the Standard Contract for the Microsoft commercial marketplace**

   To simplify the procurement process for customers and reduce legal complexity for software vendors, Microsoft offers a Standard Contract for the commercial marketplace. When you offer your software under the Standard Contract, customers need to read and accept it only once, and you don't have to creating custom terms and conditions.

   Use the Standard Contract by selecting the **Use the Standard Contract for Microsoft's commercial marketplace** check box and then, in the pop-up window, select **Accept** (you might have to scroll up to view it).

   ![Screenshot showing the Legal pane in Partner Center with the "Use the Standard Contract for Microsoft's commercial marketplace" check box.](media/use-standard-contract.png)

  > [!NOTE]
  > After you publish an offer by using the Standard Contract for the commercial marketplace, you can't use your own custom terms and conditions. You can offer a solution under either the Standard Contract or your own terms and conditions.

  For more information, see [Standard Contract for the Microsoft commercial marketplace](https://docs.microsoft.com/azure/marketplace/standard-contract). Download the [Standard Contract](https://go.microsoft.com/fwlink/?linkid=2041178) PDF file (make sure that your pop-up blocker is turned off).

  **Standard Contract amendments**

  Standard Contract amendments let you select the Standard Contract terms for simplicity and create the terms for your product or business. Customers need to review the amendments to the contract only if they've already reviewed and accepted the Microsoft Standard Contract. There are two types of amendments:

  * **Universal amendments**: These amendments are applied universally to the Standard Contract for all customers. They are shown to every customer of the offer in the purchase flow. Customers must accept the terms of the Standard Contract and the amendments before they can use your offer. You can provide a single universal amendment per offer. You can enter an unlimited number of characters in this box. These terms are displayed to customers in AppSource, Azure Marketplace, and/or the Azure portal during the discovery and purchase flow.

  * **Custom amendments**: These special amendments to the Standard Contract are targeted to specific customers through Azure tenant IDs. You can choose the tenant you want to target. Only customers from the tenant are presented with the custom amendment terms in the offer's purchase flow. Customers must accept the terms of the Standard Contract and the amendments before they can use your offer.

    1. Start by selecting **Add custom amendment terms (Max 10)**. You can provide up to ten custom amendment terms per offer. Do the following:

       a. Enter your own amendment terms in the **Custom amendment terms** box. You can enter an unlimited number of characters. Only customers from the tenant IDs that you specify for these custom terms will see them in the offer's purchase flow in the Azure portal.

       b. (Required) Provide **Tenant IDs**. Each custom amendment can be targeted to up to 20 tenant IDs. If you add a custom amendment, you must provide at least one tenant ID, which identifies your customer in Azure. Your customer can find this for you in Azure by selecting **Azure Active Directory** > **Properties**. The directory ID value is the tenant ID (for example, 50c464d3-4930-494c-963c-1e951d15360e). You can also find the organization's tenant ID of your customer by using their domain name web address at [What is my Microsoft Azure and Office 365 tenant ID?](https://www.whatismytenantid.com/).

       c. (Optional) Provide a friendly **Description** for the tenant ID, one that helps you identify the customer that you're targeting with the amendment.

        > [!NOTE]
        > These two types of amendments are paired with each other. Customers who are targeted with custom amendments will also get the universal amendments to the Standard Contract during the purchase.

    1. Select **Save draft** before you continue.

## Offer listing

On the **Offer listing** page, you define the offer details, such as offer name, description, links, and contacts.

> [!NOTE]
> Your offer listing content, such as the description, documents, screenshots, and terms of use, doesn't have to be in English, as long as the offer description begins with the phrase, "This application is available only in \<non-English language>." You can also provide a URL to link to a site that offers content in a language other than the one that's used in the offer listing content.

### Marketplace details

#### Name

The name that you enter here is shown to customers as the title of your offer listing. This field is autofilled with the name that you entered in the **Offer alias** box when you created the offer. You can change this name later. The name:

- Can be trademarked. You can include trademark and copyright symbols.
- Can't contain more than 50 characters.
- Can't include emojis.

#### Search results summary

Provide a short description of your offer, to be displayed in Azure Marketplace search results. It can contain up to 100 characters.

#### Long summary

Provide a longer description of your offer, to be displayed in Azure Marketplace search results. It can contain up to 256 characters.

#### Description

[!INCLUDE [Long description-1](./includes/long-description-1.md)]

[!INCLUDE [Long description-2](./includes/long-description-2.md)]

[!INCLUDE [Long description-3](./includes/long-description-3.md)]

#### Privacy policy link

Enter the web address (URL) of your organization's privacy policy. Ensure that your offer complies with privacy laws and regulations. You must also post a valid privacy policy on your website.

### Useful links

Provide supplemental online documents about your offer. To add a link, select **Add a link**, and then complete the following fields:

- **Name**: Customers will see the name on the details page.
- **Link (URL)**: Enter a link that lets customers view your online document.

### Customer support links

Provide the support website where customers can reach your support team.

- Azure Global support website
- Azure Government support website

### Partner support contact

Provide contact information for Microsoft partners to use when your customers open a support ticket. This information isn't listed on Azure Marketplace.

- Name
- Email
- Phone

### Engineering contact

Provide contact information for Microsoft to use when there are issues with your offer, including issues with certification. This information isn't listed on Azure Marketplace.

- Name
- Email
- Phone

### Azure Marketplace media

Provide logos and images to use with your offer. All images must be in PNG format. Blurry images will cause your submission to be rejected.

>[!NOTE]
>If you have an issue uploading files, ensure that your local network doesn't block the https://upload.xboxlive.com service that's used by Partner Center.

#### Azure Marketplace logos

Provide PNG files of your offer's logo with the following four image dimensions:

- **Small** (48 &times; 48 pixels)
- **Medium** (90 &times; 90 pixels)
- **Large** (216 &times; 216 pixels)
- **Wide** (255 &times; 115 pixels)

All four logos are required, and they're displayed in various Azure Marketplace listings.

#### Screenshots

Add up to five screenshots that show how your offer works. Each screenshot must be 1280 &times; 720 pixels in size and in PNG format. Each screenshot must include a caption.

#### Videos

Add up to five videos that demonstrate your offer. The videos should be hosted on an external video service. Enter each video's name, web address, and a thumbnail PNG image of the video at 1280 &times; 720 pixels.

For additional marketplace listing resources, see [Best practices for marketplace offer listings](https://docs.microsoft.com/azure/marketplace/gtm-offer-listing-best-practices).

Select **Save draft** before you continue.

## Preview

Select the **Preview** tab, and then select a limited **Preview Audience** for validating your offer before you publish it live to the broader commercial marketplace audience.

> [!IMPORTANT]
> After checking your offer on the **Preview** pane, select **Go live** to publish your offer for the commercial marketplace public audience.

Your preview audience is identified by Azure subscription ID GUIDs, along with an optional description for each. Neither of these fields can be seen by customers. You can find your Azure subscription ID on the **Subscriptions** page in the Azure portal.

Add at least one Azure subscription ID, either individually (up to 10 IDs) or by uploading a CSV file (up to 100 IDs). By adding these subscription IDs, you define who can preview your offer before it is published live. If your offer is already live, you can still define a preview audience for testing offer changes or updates to your offer.

> [!NOTE]
> A preview audience differs from a private audience. A preview audience can access your offer _before_ it's published live on Azure Marketplace. The preview audience can see and validate all plans, including those that will be available only to a private audience after your offer is fully published to Azure Marketplace. A private audience (defined on the plan **Pricing and Availability** pane) has exclusive access to a particular plan.

Select **Save draft** before you proceed to the next section.

## Plan overview

You can provide a variety of plan options within the same offer in Partner Center. These plans were formerly referred to as SKUs. An offer requires at least one plan, which can vary by monetization audience, Azure region, features, or VM images.

After you create your plans, select the **Plan overview** tab to display:

- Plan names
- License models
- Audience (public or private)
- Current publishing status
- Available actions

The actions that are available on the **Plan overview** pane vary depending on the current status of your plan.

- If the plan status is a draft, select **Delete draft**.
- If the plan status is published live, select **Stop sell plan** or **Sync private audience**.

### Create a new plan

Select **Create new plan** at the top. The **New plan** dialog box appears.

In the **Plan ID** box, create a unique plan ID for each plan in this offer. This ID will be visible to customers in the product web address. Use only lowercase letters and numbers, dashes, or underscores, and a maximum of 50 characters.

> [!NOTE]
> The plan ID can't be changed after you select **Create**.

In the **Plan name** box, enter a name for this plan. Customers see this name when they're deciding which plan to select within your offer. Create a unique name that clearly points out the differences between plans. For example, you might enter **Windows Server** with *Pay-as-you-go*, *BYOL*, *Advanced*, and *Enterprise* plans.

Select **Create**.

### Plan setup

Set the high-level configuration for the type of plan, specify whether it reuses a technical configuration from another plan, and identify the Azure regions where the plan should be available. Your selections here determine which fields are displayed on other panes for the same plan.

#### Reuse a technical configuration

If you have more than one plan of the same type, and the packages are identical between them, you can select **This plan reuses technical configuration from another plan**. This option lets you select one of the other plans of the same type for this offer and lets you reuse its technical configuration.

> [!NOTE]
> When you reuse the technical configuration from another plan, the entire **Technical configuration** tab disappears from this plan. The technical configuration details from the other plan, including any updates you make in the future, will be used for this plan as well. This setting can't be changed after the plan is published.

#### Azure regions

Your plan must be made available in at least one Azure region.

Select the **Azure Global** option to make your plan available to customers in all Azure Global regions that have commercial marketplace integration. For more information, see [Geographic availability and currency support](https://docs.microsoft.com/azure/marketplace/marketplace-geo-availability-currencies).

Select the **Azure Government** option to make your plan available in the [Azure Government](https://docs.microsoft.com/azure/azure-government/documentation-government-welcome) region. This region provides controlled access for customers from  US federal, state, local, or tribal entities, as well as for partners who are eligible to serve them. You, as the publisher, are responsible for any compliance controls, security measures, and best practices. Azure Government uses physically isolated datacenters and networks (located in the US only).

Before you publish to [Azure Government](https://docs.microsoft.com/azure/azure-government/documentation-government-manage-marketplace-partners), test and validate your plan in the environment, because certain endpoints may differ. To set up and test your plan, request a trial account from the [Microsoft Azure Government trial](https://azure.microsoft.com/global-infrastructure/government/request/) page.

> [!NOTE]
> After your plan is published and available in a specific Azure region, you can't remove that region.

#### Azure Government certifications

This option is visible only if you selected **Azure Government** as the Azure region in the preceding section.

Azure Government services handle data that's subject to certain government regulations and requirements. For example, FedRAMP, NIST 800.171 (DIB), ITAR, IRS 1075, DoD L4, and CJIS. To bring awareness to your certifications for these programs, you can provide up to 100 links that describe them. These can be either links to your listing on the program directly or links to descriptions of your compliance with them on your own websites. These links are visible to Azure Government customers only.

Select **Save draft** before you continue.

### Plan listing

In this section, you configure the listing details of the plan. This pane displays specific information, which can differ from other plans in the same offer.

#### Plan name

This field is autofilled with the name that you gave your plan when you created it. This name appears on Azure Marketplace as the title of this plan. It is limited to 100 characters.

#### Plan summary

Provide a short summary of your plan, not the offer. This summary is limited to 100 characters.

#### Plan description

Describe what makes this software plan unique, and describe any differences between plans within your offer. Describe the plan only, not the offer. The plan description can contain up to 2,000 characters.

Select **Save draft** before you continue.

### Pricing and availability

On this pane, you configure:

- Markets where this plan is available.
- The price per hour.
- Whether to make the plan visible to everyone or only to specific customers (a private audience).

#### Markets

Every plan must be available in at least one market. Select the check box for every market location where this plan should be available for purchase. (Users in these markets can still deploy the offer to all Azure regions selected in the ["Plan setup"](#plan-setup) section.) The **Tax Remitted** button shows countries/regions in which Microsoft remits sales and use tax on your behalf. Publishing to China is limited to plans that are either *Free* or *Bring-your-own-license* (BYOL).

If you've already set prices for your plan in US dollar (USD) currency and add another market location, the price for the new market is calculated according to current exchange rates. Always review the price for each market before you publish. Review your pricing by selecting **Export prices (xlsx)** after you save your changes.

When you remove a market, customers from that market who are using active deployments will not be able to create new deployments or scale up their existing deployments. Existing deployments are not affected.

#### Pricing

For the **License model**, select **Usage-based monthly billed plan** to configure pricing for this plan, or select **Bring your own license** to let customers use this plan with their existing license.

For a usage-based monthly billed plan, use one of the following three pricing entry options:

- **Per core**: Provide pricing per core in USD. Microsoft calculates the pricing per core size and converts it into local currencies by using the current exchange rate.
- **Per core size**: Provide pricing per core size in USD. Microsoft calculates the pricing and converts it into local currencies by using the current exchange rate.
- **Per market and core size**: Provide pricing for each core size for all markets. You can import the prices from a spreadsheet.

> [!NOTE]
> Save pricing changes to enable the export of pricing data. After a price for a market in your plan is published, it can't be changed later. To ensure that the prices are right before you publish them, export the pricing spreadsheet and review the prices in each market.

#### Free Trial

You can offer a one-month or three-month *Free Trial* to your customers.

#### Visibility

You can design each plan to be visible to everyone or only to a preselected audience. Assign memberships in this restricted audience by using Azure subscription IDs.

**Public**: Your plan can be seen by everyone.

**Private audience**: Make your plan visible only to a preselected audience. After it's published as a private plan, you can update the audience or change it to public. After you make a plan public, it must remain public. It can't be changed back to a private plan.

> [!NOTE]
> A private or restricted audience is different from the preview audience that you defined on the **Preview** pane. A preview audience can access your offer _before_ it's published live to Azure Marketplace. Although the private audience choice applies only to a specific plan, the preview audience can view all private and public plans for validation purposes.

**Restricted audience (Azure subscription IDs)**: Assign the audience that will have access to this private plan by using Azure subscription IDs. Optionally, include a description of each Azure subscription ID that you've assigned. Add up to 10 subscription IDs manually or up to 20,000 IDs if you're importing a CSV spreadsheet. Azure subscription IDs are represented as GUIDs, and all letters must be lowercase.

>[!Note]
>Private offers are not supported with Azure subscriptions established through a reseller of the Cloud Solution Provider program (CSP).


#### Hide a plan

If your virtual machine is meant to be used only indirectly when it's referenced through another solution template or managed application, select this check box to publish the virtual machine but hide it from customers who might be searching or browsing for it directly.

> [!NOTE]
> Hidden plans don't support preview links.

Select **Save draft** before you continue.

### Technical configuration

Provide the images and other technical properties that are associated with this plan. For more information, see [Create an Azure VM technical asset](https://docs.microsoft.com/azure/marketplace/partner-center-portal/create-azure-container-technical-assets).

> [!NOTE]
> The **Technical configuration** tab isn't displayed if you configured this plan to reuse packages from another plan on the **Plan setup** tab.

#### Operating system

On the **Operating system** pane, do the following:

- For **Operating system family**, select the **Windows** or **Linux** operating system.
- For **Release** or **Vendor**, select the Windows release or Linux vendor.
- For **OS friendly name**, enter a friendly operating system name. This name is visible to customers.

#### Recommended VM sizes

Select up to six recommended virtual machine sizes to display on Azure Marketplace.

#### Open ports

Open public or private ports on a deployed virtual machine.

#### Storage option for deployment

For **Disk deployment option**, select the type of disk deployment that your customers can use for the virtual machine. Microsoft recommends limiting the deployment to **Managed disk deployment** only.

#### Properties

For **Support Accelerated Networking**, select whether your VM supports [Accelerated Networking](https://go.microsoft.com/fwlink/?linkid=2124513).

#### VM images

Provide a disk version and the shared access signature (SAS) URI for the virtual machine images. Add up to 16 data disks for each VM image. Provide only one new image version per plan in a specified submission. After an image has been published, you can't edit it, but you can delete it. Deleting a version prevents both new and existing users from deploying a new instance of the deleted version.

- **Disc version**: The version of the image you are providing.
- **SAS URI**: The location in your Azure storage account where you've stored the operating system VHD. To learn how to get a SAS URI, see [Get shared access signature URI for your VM image](https://docs.microsoft.com/azure/marketplace/partner-center-portal/get-sas-uri).
- Data disk images are also VHD shared access signature URIs that are stored in their Azure storage accounts.
- Add only one image per submission in a plan.

Regardless of which operating system you use, add only the minimum number of data disks that the solution requires. During deployment, customers can't remove disks that are part of an image, but they can always add disks during or after deployment.

Select **Save draft** before you continue and return to **Plan overview**.

## Resell through CSPs

Expand the reach of your offer by making it available to partners in the [Cloud Solution Provider (CSP)](https://azure.microsoft.com/offers/ms-azr-0145p/) program. All Bring-your-own-license (BYOL) plans are automatically opted in to the program. You can also choose to opt in your non-BYOL plans.

Select **Save draft** before you continue.

## Test Drive

Set up a demonstration, or *Test Drive*, that lets customers try your offer for a fixed period of time before they buy it. To create a demonstration environment for your customers, see [Test Drive offers in the commercial marketplace](https://docs.microsoft.com/azure/marketplace/partner-center-portal/test-drive).

To enable a Test Drive, select the **Enable a test drive** check box on the **Offer setup** pane. To remove the Test Drive from your offer, clear the check box.

Additional Test Drive resources:

- [Marketing best practices](https://docs.microsoft.com/azure/marketplace/cloud-partner-portal/test-drive/marketing-and-best-practices)
- [Technical best practices](https://github.com/Azure/AzureTestDrive/wiki/Test-Drive-Best-Practices)
- [Test Drive overview](https://assetsprod.microsoft.com/mpn/azure-marketplace-appsource-test-drives.pdf) PDF file (make sure that your pop-up blocker is turned off)

Select **Save draft** before you continue.

## Review and publish

After you've completed all the required sections of the offer, you can submit it for review and publication.

At the upper right, select **Review and publish**.

On this pane you can:

- View the completion status for each section of the offer:

  - **Not started**: The section has not been started and needs to be completed.
  - **Incomplete**: The section has errors that must be fixed or requires that you provide more information. For guidance about updating the incomplete information, see this article's earlier sections.
  - **Complete**: The section is complete and there are no errors. All sections of the offer must be complete before you can submit the offer.
- Provide **Notes for certification** to the certification team to help ensure that your application is tested correctly. Include testing instructions and any supplementary notes that can help the team understand your application.

To submit the offer for publishing, select **Review and publish**.

Microsoft will send an email message to let you know when a preview version of the offer is available to review and approve. To publish your offer to the public (or, if it's a private offer, publish it to a private audience), go to Partner Center, go to your offer's **Overview** page, and then select **Go-live**. The status of your offer appears at the top of the page when publishing is in progress.

### Errors and review feedback

The **Manual validation** step in the publishing process represents an extensive review of your offer and its associated technical assets. If this process uncovers errors with your offer, you'll receive a certification report that details the issues. Simply make the required corrections and republish your offer.

## Offer overview

The **Offer overview** page shows a visual representation of the steps, both completed and in progress, that are required to publish your offer and the length of time each step should take to complete.

This page also includes links to help you work with the offer, depending on its status:

- If the offer is a draft: [Delete draft offer](https://docs.microsoft.com/azure/marketplace/partner-center-portal/update-existing-offer#delete-a-draft-offer)
- If the offer is live: [Stop selling the offer](https://docs.microsoft.com/azure/marketplace/partner-center-portal/update-existing-offer#stop-selling-an-offer-or-plan)
- If the offer is in preview: [Go-live](https://docs.microsoft.com/azure/marketplace/partner-center-portal/publishing-status#publisher-approval)
- If you haven't completed publisher sign-out: [Cancel publishing](https://docs.microsoft.com/azure/marketplace/partner-center-portal/update-existing-offer#cancel-publishing)

## Marketplace examples

Here's an example of how offer information appears in Azure Marketplace:

:::image type="content" source="media/example-azure-marketplace-virtual-machine-offer.png" alt-text="Illustrates how this offer appears in Azure Marketplace.":::

#### Call-out descriptions

1. Large logo
2. Price
3. Categories
4. Terms and conditions
5. Privacy policy address (link)
6. Offer name
7. Description
8. Useful links
9. Screenshots/videos

<br>Here's an example of how offer information appears in Azure Marketplace search results:

:::image type="content" source="media/example-azure-marketplace-virtual-machine-search-results.png" alt-text="Illustrates how this offer appears in Azure Marketplace search results.":::

#### Call-out descriptions

1. Small logo
2. Offer name
3. Search results summary
4. Trial

<br>Here's an example of Azure Marketplace plan details:

:::image type="content" source="media/example-azure-marketplace-virtual-machine-plan-details.png" alt-text="Illustrates Azure Marketplace plan details.":::

#### Call-out descriptions

1. Plan name and summary
2. Recommend VM sizes
3. Plan pricing

<br>Here's an example of how offer information appears in the Azure portal:

:::image type="content" source="media/example-azure-portal-virtual-machine-offer.png" alt-text="Illustrates how this offer appears in the Azure portal.":::

#### Call-out descriptions

1. Name
2. Description
3. Useful links
4. Screenshots/videos

<br>Here's an example of how offer information appears in the Azure portal search results:

:::image type="content" source="media/example-azure-portal-virtual-machine-search-results.png" alt-text="Illustrates how this offer appears in the Azure portal search results.":::

#### Call-out descriptions

1. Small logo
2. Offer name
3. Search results summary

<br>Here's an example of the Azure portal plan details:

:::image type="content" source="media/example-azure-portal-virtual-machine-plan-details.png" alt-text="Illustrates the Azure portal plan details.":::

#### Call-out descriptions

1. Plan name
2. Plan description

## Next step

- [Update an existing offer in the commercial marketplace](https://docs.microsoft.com/azure/marketplace/partner-center-portal/update-existing-offer)
