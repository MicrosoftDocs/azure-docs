---
title: Cloud Solution Providers | Azure Marketplace
description: Publishers can now sell their offers through Microsoft Cloud Solution Provider (CSP) partner channel.
services: Azure, Marketplace, Compute, Storage, Networking
author: ChJenk
ms.service: marketplace
ms.topic: article
ms.date: 11/07/2019
ms.author: v-chjen

---
# Cloud Solution Providers

Software offers can reach millions of qualified Microsoft customers served by partners in the Cloud Solution Provider (CSP) program, in addition to public availability of offers through [Microsoft web storefronts](https://docs.microsoft.com/azure/marketplace/comparing-appsource-azure-marketplace).

Publishers configure offers for availability in the CSP program on an opt-in basis, for a new offer or an existing one, enabling partners to sell your products and create bundled solutions for customers.

Publishers are responsible for providing break-fix support to end customers and for providing a mechanism for CSP partners and/or customers to contact you for support. It is best practices to provide CSP partners with user documentation, training, and service health/outage notifications (as applicable) so that CSP partners are equipped to handle tier 1 support requests from customers.  

The following offers are eligible to be opted into the CSP program:

- Transactable Software-as-a-Service (SaaS) offers
- Virtual Machines (VMs)
- Solution templates
- Managed applications

> [!NOTE]
> Containers and Bring Your Own License (BYOL) VM SKUs are opted into the CSP channel by default.

## How to configure an offering

The CSP program opt-in setting is configured in the Partner Center or Cloud Partner Portal offer creation experience. [Learn more about the changing publisher experience.](https://www.microsoftpartnercommunity.com/t5/Azure-Marketplace-and-AppSource/Cloud-Marketplace-In-Partner-Center/m-p/9738#M293)

### Partner Center opt-in

In Partner Center, you'll find the opt-in experience under the CSP Reseller audience module.

![CSP Reseller audience](media/marketplace-publishers-guide/csp-reseller-audience.png)

In the CSP Reseller audience module, you have three options to choose from:

- Option one: Any partner in the CSP program
- Option two: Specific partners in the CSP program
- Option three: No partners in the CSP program

#### Option one: Any partner in the CSP program

![Any partner in the CSP program](media/marketplace-publishers-guide/csp-reseller-option-one.png) 

 By choosing this option, all partners in the CSP program are eligible to resell your offer to their customers.

#### Option two: Specific partners in the CSP program

![Specific partners in the CSP program I select](media/marketplace-publishers-guide/csp-reseller-option-two.png)

By choosing this option, you authorize which partners in the CSP program are eligible to resell your offer.

To authorize CSPs, click **Select CSP Partners** and a menu appears that lets you search by CSP name or CSP Azure Active Directory (AAD) tenant ID. You can also apply filters, such as **Country**, **Competency**, or **Skill**.

![Select CSP menu](media/marketplace-publishers-guide/csp-pop-up-module.png)

Once you've chosen CSPs, select **Add** and a table showing the CSPs you've selected appears. Select **Save** to register your changes.

If this offer is unpublished, you'll need to publish your offer for it to be available to your selected CSPs.

If you're updating the CSP list on an already published offer, add the additional CSPs and select **Sync CSP audience**.

If you have an offer that already has a list of CSPs that have been authorized and if you would like to use the same list for another offer, use **Import/Export**. You'll need to navigate to the offer that has the CSP list and select **Export CSPs**. A .csv file is developed and it can then be imported into another offer.

#### Option three: No partners in the CSP program

![No partners in the CSP program](media/marketplace-publishers-guide/csp-reseller-option-three.png)

By choosing this option, you're opting your offer out of the CSP program. You can change this selection at any time.

### Cloud Partner Portal opt-in

In Cloud Partner Portal, the opt-in is set on the Marketplace or Storefront tab.

![CSP opt-in experience in CPP](media/marketplace-publishers-guide/csp-opt-in.png)

## Deauthorize CSPs

If you've authorized a CSP and that CSP has resold the product to their customers, you'll not be allowed to deauthorize that CSP.

If a CSP has not sold your product to their customers and you'd like to remove the CSP after your offer has been published, use the following instructions:

1. Go to the support page. The first few dropdown menus are automatically filled in for you.

   > [!NOTE]
   > Do not change the pre-populated dropdown menu selections.

2. For **Marketplace support**, identify the product family as **Cloud and Online Services** and the product as **Marketplace Publisher**.
3. For **Select the product version**, select **Live offer management**.
4. For **Select a category that best describe the issue**, choose the category that refers to your offer.
5. For **Select a problem that best describes the issue**, select **Update existing offer**.
6. Select **Next** to be directed to the **Issue details page**, where you can enter more details about your issue.
7. Use **Deauthorize CSP** as the issue title and fill out the rest of the sections as required.

## Navigate between options

This section is TBD.

## Sharing sales and support materials with CSP partners

To enable partners in the Cloud Solution Provider program to most effectively represent your offering and engage with your organization, you must submit sales and support materials that will be available to the resellers. These resources will not be exposed to customers in the marketplace storefronts.

### Partner Center CSP channel

If you've opted into the CSP channel in Partner Center, publishers must enter a URL that hosts relevant marketing materials and channel contact information to the CSP channel under the offer listing module:

![Partner Center CSP collateral information](media/marketplace-publishers-guide/pc-csp-channel.png)

### Cloud Partner Portal CSP channel

If you have opted into the CSP channel in Cloud Partner Portal, publishers must enter a URL that hosts relevant marketing materials and channel contact information to the CSP channel:

![Cloud Partner Portal CSP collateral information](media/marketplace-publishers-guide/cpp-csp-information.png)

## Next steps

Visit the [Azure Marketplace and AppSource Publisher Guide](https://docs.microsoft.com/azure/marketplace/marketplace-publishers-guide) page.

To learn more about marketplace GTM services, use [Go-to-market services](https://partner.microsoft.com/reach-customers/gtm).

Sign in to the [Cloud Partner Portal](https://cloudpartner.azure.com/), or the [Partner Center](https://partner.microsoft.com/dashboard/account/v3/enrollment/introduction/azureisv) for SaaS offers, and to create and configure your offer.
