---
title: Create plans for a virtual machine offer on Azure Marketplace
description: Learn how to create plans for a virtual machine offer on Azure Marketplace.
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
author: emuench
ms.author: mingshen
ms.date: 10/16/2020
---

# Create plans for a virtual machine offer

You can provide a variety of plan options within the same offer in Partner Center. An offer requires at least one plan (formerly called a SKU), which can vary by monetization audience, Azure region, features, or VM images.

You can create up to 100 plans for each offer: up to 45 of these can be private. Learn more about private plans in [Private offers in the Microsoft commercial marketplace](private-offers.md).

After you create your plans, select the **Plan overview** tab to display:

- Plan names
- License models
- Audience (public or private)
- Current publishing status
- Available actions

The actions that are available on the **Plan overview** pane vary depending on the current status of your plan.

- If the plan status is a draft, select **Delete draft**.
- If the plan status is published live, select **Stop sell plan** or **Sync private audience**.

## Create a new plan

Select **Create new plan** at the top. The **New plan** dialog box appears.

In the **Plan ID** box, create a unique plan ID for each plan in this offer. This ID will be visible to customers in the product web address. Use only lowercase letters and numbers, dashes, or underscores, and a maximum of 50 characters.

> [!NOTE]
> The plan ID can't be changed after you select **Create**.

In the **Plan name** box, enter a name for this plan. Customers see this name when they're deciding which plan to select within your offer. Create a unique name that clearly points out the differences between plans. For example, you might enter **Windows Server** with *Pay-as-you-go*, *BYOL*, *Advanced*, and *Enterprise* plans.

Select **Create**.

## Plan setup

Set the high-level configuration for the type of plan, specify whether it reuses a technical configuration from another plan, and identify the Azure regions where the plan should be available. Your selections here determine which fields are displayed on other panes for the same plan.

### Reuse a technical configuration

If you have more than one plan of the same type, and the packages are identical between them, you can select **This plan reuses technical configuration from another plan**. This option lets you select one of the other plans of the same type for this offer and lets you reuse its technical configuration.

> [!NOTE]
> When you reuse the technical configuration from another plan, the entire **Technical configuration** tab disappears from this plan. The technical configuration details from the other plan, including any updates you make in the future, will be used for this plan as well. This setting can't be changed after the plan is published.

### Azure regions

Your plan must be made available in at least one Azure region.

Select the **Azure Global** option to make your plan available to customers in all Azure Global regions that have commercial marketplace integration. For more information, see [Geographic availability and currency support](marketplace-geo-availability-currencies.md).

Select the **Azure Government** option to make your plan available in the [Azure Government](../azure-government/documentation-government-welcome.md) region. This region provides controlled access for customers from  US federal, state, local, or tribal entities, as well as for partners who are eligible to serve them. You, as the publisher, are responsible for any compliance controls, security measures, and best practices. Azure Government uses physically isolated datacenters and networks (located in the US only).

Before you publish to [Azure Government](../azure-government/documentation-government-manage-marketplace-partners.md), test and validate your plan in the environment, because certain endpoints may differ. To set up and test your plan, request a trial account from the [Microsoft Azure Government trial](https://azure.microsoft.com/global-infrastructure/government/request/) page.

> [!NOTE]
> After your plan is published and available in a specific Azure region, you can't remove that region.

### Azure Government certifications

This option is visible only if you selected **Azure Government** as the Azure region in the preceding section.

Azure Government services handle data that's subject to certain government regulations and requirements. For example, FedRAMP, NIST 800.171 (DIB), ITAR, IRS 1075, DoD L4, and CJIS. To bring awareness to your certifications for these programs, you can provide up to 100 links that describe them. These can be either links to your listing on the program directly or links to descriptions of your compliance with them on your own websites. These links are visible to Azure Government customers only.

Select **Save draft** before you continue.

## Plan listing

In this section, you configure the listing details of the plan. This pane displays specific information, which can differ from other plans in the same offer.

### Plan name

This field is automatically filled with the name that you gave your plan when you created it. This name appears on Azure Marketplace as the title of this plan. It is limited to 100 characters.

### Plan summary

Provide a short summary of your plan, not the offer. This summary is limited to 100 characters.

### Plan description

Describe what makes this software plan unique, and describe any differences between plans within your offer. Describe the plan only, not the offer. The plan description can contain up to 2,000 characters.

Select **Save draft** before you continue.

## Pricing and availability

On this pane, you configure:

- Markets where this plan is available. Every plan must be available in at least one [market](marketplace-geo-availability-currencies.md).
- The price per hour.
- Whether to make the plan visible to everyone or only to specific customers (a private audience).

### Markets

Every plan must be available in at least one market. Select the check box for every market location where this plan should be available for purchase. (Users in these markets can still deploy the offer to all Azure regions selected in the ["Plan setup"](#plan-setup) section.) The **Tax Remitted** button shows countries/regions in which Microsoft remits sales and use tax on your behalf. Publishing to China is limited to plans that are either *Free* or *Bring-your-own-license* (BYOL).

If you've already set prices for your plan in US dollar (USD) currency and add another market location, the price for the new market is calculated according to current exchange rates. Always review the price for each market before you publish. Review your pricing by selecting **Export prices (xlsx)** after you save your changes.

When you remove a market, customers from that market who are using active deployments will not be able to create new deployments or scale up their existing deployments. Existing deployments are not affected.

### Pricing

For the **License model**, select **Usage-based monthly billed plan** to configure pricing for this plan, or select **Bring your own license** to let customers use this plan with their existing license.

For a usage-based monthly billed plan, use one of the following three pricing entry options:

- **Per core**: Provide pricing per core in USD. Microsoft calculates the pricing per core size and converts it into local currencies by using the current exchange rate.
- **Per core size**: Provide pricing per core size in USD. Microsoft calculates the pricing and converts it into local currencies by using the current exchange rate.
- **Per market and core size**: Provide pricing for each core size for all markets. You can import the prices from a spreadsheet.

> [!NOTE]
> Save pricing changes to enable the export of pricing data. After a price for a market in your plan is published, it can't be changed later. To ensure that the prices are right before you publish them, export the pricing spreadsheet and review the prices in each market.

### Free Trial

You can offer a one-month or three-month or six-month *Free Trial* to your customers.

### Visibility

You can design each plan to be visible to everyone or only to a preselected audience. Assign memberships in this restricted audience by using Azure subscription IDs.

**Public**: Your plan can be seen by everyone.

**Private audience**: Make your plan visible only to a preselected audience. After it's published as a private plan, you can update the audience or change it to public. After you make a plan public, it must remain public. It can't be changed back to a private plan.

> [!NOTE]
> A private or restricted audience is different from the preview audience that you defined on the **Preview** pane. A preview audience can access your offer _before_ it's published live to Azure Marketplace. Although the private audience choice applies only to a specific plan, the preview audience can view all private and public plans for validation purposes.

**Restricted audience (Azure subscription IDs)**: Assign the audience that will have access to this private plan by using Azure subscription IDs. Optionally, include a description of each Azure subscription ID that you've assigned. Add up to 10 subscription IDs manually or up to 20,000 IDs if you're importing a CSV spreadsheet. Azure subscription IDs are represented as GUIDs, and all letters must be lowercase.

>[!Note]
>Private offers are not supported with Azure subscriptions established through a reseller of the Cloud Solution Provider program (CSP).

### Hide a plan

If your virtual machine is meant to be used only indirectly when it's referenced through another solution template or managed application, select this check box to publish the virtual machine but hide it from customers who might be searching or browsing for it directly.

> [!NOTE]
> Hidden plans don't support preview links.

Select **Save draft** before you continue.

## Technical configuration

Provide the images and other technical properties that are associated with this plan. For more information, see [Configure VM offer listing details](azure-vm-create-listing.md).

> [!NOTE]
> The **Technical configuration** tab isn't displayed if you configured this plan to reuse packages from another plan on the **Plan setup** tab.

### Operating system

On the **Operating system** pane, do the following:

- For **Operating system family**, select the **Windows** or **Linux** operating system.
- For **Release** or **Vendor**, select the Windows release or Linux vendor.
- For **OS friendly name**, enter a friendly operating system name. This name is visible to customers.

### Recommended VM sizes

Select up to six recommended virtual machine sizes to display on Azure Marketplace.

### Open ports

Open public or private ports on a deployed virtual machine.

### Storage option for deployment

For **Disk deployment option**, select the type of disk deployment that your customers can use for the virtual machine. Microsoft recommends limiting the deployment to **Managed disk deployment** only.

### Properties

For **Support Accelerated Networking**, select whether your VM supports [Accelerated Networking](https://go.microsoft.com/fwlink/?linkid=2124513).

### VM images

Provide a disk version and the shared access signature (SAS) URI for the virtual machine images. Add up to 16 data disks for each VM image. Provide only one new image version per plan in a specified submission. After an image has been published, you can't edit it, but you can delete it. Deleting a version prevents both new and existing users from deploying a new instance of the deleted version.

- **Disc version**: The version of the image you are providing.
- **SAS URI**: The location in your Azure storage account where you've stored the operating system VHD. To learn how to get a SAS URI, see [Get shared access signature URI for your VM image](azure-vm-get-sas-uri.md).
- Data disk images are also VHD shared access signature URIs that are stored in their Azure storage accounts.
- Add only one image per submission in a plan.

Regardless of which operating system you use, add only the minimum number of data disks that the solution requires. During deployment, customers can't remove disks that are part of an image, but they can always add disks during or after deployment.

Select **Save draft** before you continue and return to **Plan overview**.

## Next steps

- [Add ta preview audience](azure-vm-create-preview.md)
