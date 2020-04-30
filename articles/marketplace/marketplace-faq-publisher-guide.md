---
title: Microsoft commercial marketplace FAQ 
description: Get answers to commonly asked questions about Azure Marketplace and Microsoft AppSource.
author: qianw211
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 04/16/2020
ms.author: dsindona
---

# Microsoft commercial marketplace FAQ

This article answers commonly asked questions about the Microsoft commercial marketplace.

## FAQ for customers

### What you need to know about the commercial marketplace

**What is Azure Marketplace?**

[Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace) provides access to and information about solutions and services that are available from Microsoft and our partners. Customers can discover, try, or buy cloud software solutions that are built on or for Azure. Our catalog of more than 8,000 listings provides Azure building blocks, such as virtual machines (VMs), APIs, Azure apps, solution templates and managed applications, software as a service (SaaS) apps, containers, and consulting services.

**Who are Azure Marketplace customers?**

Azure Marketplace is designed for IT professionals and cloud developers who are interested in commercial IT software and services.

**What types of products are currently available on Azure Marketplace?**

Azure Marketplace offers technical solutions and services from Microsoft and partners that are built to extend Azure products and services. The solution catalog spans several categories, including:

* Base operating systems
* Databases
* Security
* Identity
* Networking
* Blockchains
* Developer tools

### Azure Marketplace for customers

**How do I get started on Azure Marketplace?**

To find a wide range of enterprise applications and solutions that are certified and optimized to run on Azure, go to [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps). You can also access Azure Marketplace through the [Azure portal] when you [create a resource](https://portal.azure.com/#create/hub).

**What are the key benefits of Azure Marketplace?**

With Azure Marketplace, customers can discover technical applications that are built for or built on Azure. It combines the Microsoft Azure market of solutions and services into a single, unified platform to help customers discover, try, buy, or deploy solutions in just a few clicks.

**How do I purchase products from Azure Marketplace?**

Azure Marketplace offers can be purchased through:

* [The web-based storefront](https://azuremarketplace.microsoft.com/marketplace/apps)
* [The Azure portal](https://portal.azure.com) 
  > [!Note]
  > Signing in to the Azure portal requires an Azure account. If you don't have one, you're redirected to the **Welcome to Azure** page to create one.  
* [The Azure CLI](/cli/azure/?view=azure-cli-latest)

>[!Note]
>Prepaid credits and other forms of monetary commitment can't be used to pay for software license fees, but they can be used to pay associated Azure usage charges. Exceptions are listed in [Azure monetary commitment](https://azure.microsoft.com/updates/azure-marketplace-third-party-reseller-services-now-use-azure-monetary-commitment/).

**Can I choose which Azure regions to deploy my Azure Marketplace purchase to?**

As a customer, you have the option of deploying to any Azure datacenter region that you've enabled. We recommend selecting the datacenter locations closest to your services to optimize performance and control your budget.

**If I accidentally delete an Azure Marketplace purchase, can I *undo* the action?**

No, deletions are final. If a subscription is accidentally deleted, it can be repurchased. Any unused functionality or prepaid services are lost.

**Am I warned if I try to delete an Azure Marketplace purchase that's in use by one of my applications?**

No, Azure provides no warning when a purchase is being deleted, even if it is currently in use or an application is dependent on it.

**If my Azure Marketplace purchase has any dependencies on other assets, such as an Azure website, do I have to manage them?**

Dependencies are not automatically managed for Azure Marketplace offerings. To determine whether there are any dependencies prior to deploying the solution, carefully review the description of your Azure Marketplace purchase before using it.

**Can I buy Azure Marketplace solutions from an Azure Cloud Solution Provider?**

If the publisher has configured an offering to make it available through the Cloud Solution Provider (CSP) channel, Cloud Solution Provider partners have the option of reselling the solution.

**What countries/regions are supported for purchasing applications and services that are sold or set up through Azure Marketplace?**

Azure Marketplace is available to Azure customers in the countries/regions that are listed in the [participation policies](/legal/marketplace/participation-policy).

**What currencies are supported by Azure Marketplace?**

Transactions can be conducted in the following 17 currencies: AUD, BRL, CAD, CHF, DKK, EUR, GBP, INR, JPY, KRW, NOK, NZD, RUB, SEK, TWD, USD, and RMB.

### Deploying a solution from Azure Marketplace

**I have deployed an Azure Marketplace virtual machine (VM) to a subscription, and I now want to migrate the subscription from one Azure account to another. Is this currently supported?**

To migrate an Azure subscription, including Azure Marketplace VMs and services, delete or cancel any previous Azure subscription before you associate it with the new Azure account. After the migration is complete, the resulting usage fees are billed using the new registered account's method of payment.

**I want to migrate an Azure Marketplace VM subscription to my Enterprise Agreement. Is this currently supported?**

To migrate an Azure Marketplace VM subscription to an Enterprise Agreement (EA), stop or cancel any previous subscription before the migration. After the migration of your Azure account and associated subscriptions is complete, you can repurchase the Azure Marketplace VM or service.  The resulting usage fees are billed quarterly under your Enterprise Agreement.

### Pricing and payment

**How are Azure Marketplace subscriptions priced?**

Pricing varies depending on product types and publisher specifications. Software license fees and Azure usage costs are charged separately through your Azure subscription.

* *Unbundled*:

  + *Bring-your-own-license (BYOL) model*: When you obtain a software license directly from the publisher or a reseller, there are no additional software-related charges or fees.

* *Bundled*:

  * An Azure subscription is included with the publisher's independent software vendor (ISV) solution pricing.

* *Charged*:

    + *Free*: Free SKU. No charges are applied for software license fees or usage of the offering.

    + *Free software trial*: An offer that is free for a limited period. There is no charge for the publisher's software license fees for use during the trial period. After the offer expires, it automatically converts to a paid offer that's based on standard rates issued by the publisher.

    + *Usage-based*: Rates are charged or billed based on the extent of the usage of the offering. For virtual machines images, usage is charged an hourly fee. For developer services and APIs, usage is charged per unit of measurement, as defined by the offering.

    + *Flat fee*: SaaS subscriptions can be priced as a flat fee and billed monthly or annually. This can also include additional billing dimensions that charge according to consumption (for example, bandwidth, emails, or tickets). 

    + *Per-user*: SaaS subscriptions can be priced on a per-user basis and billed monthly or annually. 

Offer-specific pricing details can be found on the solution details page on the [Azure pricing](https://azure.microsoft.com/pricing/) site or within the [Azure portal].

> [!Note]
> Except for monthly fees, Azure usage charges are applicable to all pricing models unless otherwise stated.

**How should I provide my software license key for BYOL marketplace solutions, and what role does Azure Marketplace play?**

The acquisition and enforcement of license credentials for BYOL solutions are the responsibility of the publisher. For virtual machine offers, the acquisition of the license key typically occurs in the publisher's application after the application has started. When you're using a virtual machine offer that's deployed via an Azure application solution template, you can configure the Azure Resource Manager template (ARM template) to prompt customers for a range of inputs, including license credentials.

Here are the most common options per offer type:

* *Virtual machine offer*:

   + *Option 1*: Users typically acquire the license key in the publisher's application after the application has started.

   + *Option 2*: Users enter the license key (via command line or the web interface that's provided by the offer) after they deploy the VM offer in the selected subscription. The license can be a key or a file, as determined by the publisher.

* *Azure applications (solution template and managed applications)*:

   + *Option 1*: The ARM template can be configured to prompt you for a range of inputs including license credentials. This can be done as a license file (file upload) or a key (text box input), before the deployment of the offer, in the user's subscription.

   + *Option 2*: You can enter the license key via command line or the web interface that's provided by the offer.  You do this after deploying the Azure application offer in the selected subscription. The license can be a key or file, as determined by the publisher.

**What kinds of trials are supported?**

Publishers can add one free month for paid SaaS offers and one or three free months of consumption for VM images. Free trial offers are listings with a call to action to initiate a trial. These lead the customer to a website that's defined by the publisher to set up the trial experience. Trials can also be added to paid offerings where the first month is free. 

**Do I need to have a payment instrument (for example, a credit card) on file to deploy Free Tier or BYOL offerings?**

No. A payment instrument is not required to deploy *Free Tier* or *BYOL* offerings. However, *Free Trial* offerings require a payment instrument. Listings that include the *Get it now* or *Free software trial* buttons are deployed to the selected Azure subscription. These listings are billed using the selected account's registered method of payment. Azure usage charges are billed separately from software license fees.

**If Enterprise Agreement indirect customers have questions about pricing for offers sold on Azure Marketplace, whom should they contact?**

Enterprise Agreement indirect customers must contact their Licensing Solution Provider for all Azure Marketplace pricing questions.

**Can I control my employees' access to Azure Marketplace and purchasing privileges?**

Yes, for Enterprise Agreement customers, the enrollment administrator may turn off purchase privileges for all accounts on the enrollment and turn the privileges back on long enough to make a purchase.

**What payment methods are supported for commercial marketplace purchases?**

Customers can purchase offerings from the commercial marketplace by using credit cards. If you have an existing Azure subscription, purchases from Azure Marketplace use the payment method that's configured on the account, and they appear on the same invoice as a separate line item. Some offers consume the Azure monetary commitment, but most commercial marketplace purchases do not draw down Enterprise Agreement commitments, although Azure infrastructure consumption will.

**Can I apply Azure subscription credits or monetary commitment funds in my account toward Azure Marketplace offers?**

Specific Azure Marketplace offers can use Azure subscription credits or monetary commitment funds. For a complete list of products participating in this program, see [Azure monetary commitment](https://azure.microsoft.com/updates/azure-marketplace-third-party-reseller-services-now-use-azure-monetary-commitment/). These offers do not include BYOL or bring-your-own-subscription (BYOS) options. No other Azure Marketplace offers can use Azure subscription credits or monetary commitment, such as the free one-month trial credit, monthly MSDN credits, credits from Azure promotions, monetary commitment balances, and any other free credits provided from Azure.

**Do volume license discounts apply to Azure Marketplace purchases?**

No. Publishers who own solutions on Azure Marketplace can set pricing.  Standard Microsoft volume license discounts don't apply toward Azure Marketplace purchases.

**Where can I view my Azure Marketplace subscription details and billing information?**

* [Microsoft Online Subscription Program (MOSP)](https://azure.microsoft.com/support/legal/subscription-agreement/?country=us&language=en) (web direct) customers: 
  * In the [Azure portal], go to the **Cost Management + Billing** section, and then select the **Invoices** tab.

* Enterprise Agreement customers: 
  * In the [Azure portal], go to the **Cost Management + Billing** section, and then select the **Invoices** tab.

* Cloud Solution Provider (CSP) partners: 
  1. In Partner Center, select **Customers** view, and then select a company whose Azure Marketplace customer purchase details you want to view.
  1. Select the **Order History** tab to view the details.

**How do I cancel an Azure Marketplace add-in to an Azure virtual machine?**

Because the add-in is associated with the VM, you can cancel the Azure Marketplace purchase by deleting the VM. This action stops all subscription usage and charges on the Azure Marketplace purchase.

**How often am I billed for my Azure Marketplace purchases?**

All Azure Marketplace offers that don't deduct from a monetary commitment are billed monthly in arrears. Annual SaaS subscriptions are billed once for a full year's services.

If you're a [Microsoft Online Subscription Program](https://azure.microsoft.com/support/legal/subscription-agreement/) (web direct) customer, you're charged monthly against the credit card that's on file for your Azure subscription profile. 

Annual SaaS subscriptions are billed once for a full year's services.

**How can I move my Azure Marketplace purchases from my MOSP subscription to my direct Enterprise Agreement subscription?**

Although most Microsoft subscriptions can be easily converted to an Enterprise Agreement, Azure Marketplace purchases within MOSP subscriptions can't.

To migrate other services purchased from Azure Marketplace to an EA subscription, first cancel the applications from within the existing MOSP subscription, and then repurchase those applications within the EA subscription. As part of this process, you can submit a credit request for a refund during the potential month of overlapping coverage between Azure Marketplace service subscriptions. To submit such a request, [create a support ticket](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview).

**What is the difference between *price*, *software price*, and *total price* in the cost structure for virtual machine offers on Azure Marketplace?**

*Price* refers to the cost of only the Azure virtual machine that runs the Azure Marketplace publisher software. *Software price* refers to the cost of only the software that runs on the VM. *Total price* refers to the combined cost of that virtual machine and the software that runs on it.

**How do I find out how much of my Azure Marketplace purchase I have used?**

You can learn about your estimated usage by going to the [Azure portal]. Such information might not include recent activities, and it might be based on projections derived from past consumption. During the public preview, this capability might not be available for all purchases and might vary based on product type.

### Customer support

**Whom do I contact for general support issues with Azure Marketplace?**

For general application support about usage or troubleshooting, contact the application publisher directly.

For billing and subscription issues with your Azure Marketplace purchase, contact [Azure Support](https://support.microsoft.com/getsupport?oaspworkflow=start_1.0.0.0&wf=0&wfname=productselection&prid=16230&forceorigin=esmc&ccsid=636694515623707953).

**Whom do I contact for technical support for a solution purchased on Azure Marketplace?**

Contact the publisher provider for all technical product support. You can find publisher contact information or a link to the support website on their solution details page on Azure Marketplace.

**Whom do I contact for billing support or questions about a third-party solution purchased on Azure Marketplace?**

Contact [Azure Support](https://support.microsoft.com/getsupport?oaspworkflow=start_1.0.0.0&wf=0&wfname=productselection&prid=16230&forceorigin=esmc&ccsid=636694515623707953).

**Whom do I contact if I have questions about pricing or terms for partner solutions sold on Azure Marketplace?**

Contact the publisher provider for all technical product support. Publisher contact information or a link to the support website can be found on each solution details page on Azure Marketplace.

**If I am not satisfied, can I return a purchase?**

Purchases made from [Azure Marketplace](https://azuremarketplace.microsoft.com/) can't be returned, but they can be canceled or deleted. Consumption-based offers are billed according to usage, so when the usage stops, the charges stop as well. Subscriptions are canceled and aren't billed past the current billing period. If a subscription is canceled shortly after purchase (24 hours for monthly and 14 days for annual), a full refund is provided.

Contact the publisher directly for any technical issues relating to your Azure Marketplace service or purchase. You'll find publisher contact information or a link to their support website on their solution details page on Azure Marketplace.

**How is license pricing handled when they're added mid-term?**

Pricing for licenses that are added to an existing subscription is prorated for the remainder of the subscription period.

**How is pricing for license removals handled mid-term?**

Licenses that are canceled are subject to the refund policy found in this article.  All canceled licenses are immediately removed from your account and no longer available for use.

**Are refunds supported for consumption-based offers?**

Any charges based on consumption, whether for hourly VMs or custom metering, are not refundable through cancellation. After the consumption, the charges are processed by the Microsoft commerce platform. Quality-of-service disputes where a refund is requested are handled outside Microsoft systems, between the publisher and the customer directly. Offers that support a flat rate plus metered billing follow our standard refund policy for the flat-rate charges.

**Is it possible to change plans mid-term?**

No, it isn't possible to transition between monthly and annual plans.

**Can customers purchase two plans from the same offer?**

Yes, it is possible for customers to own two plans from the same offer simultaneously.

**Do refund and plan-change policies differ by storefront?**

No, the business policies are consistent across the commercial marketplace. If a plan is resold by a partner in the Cloud Solution Provide program, the partner may enforce a different policy for their customers.


## FAQ for publishers

### What you need to know about the commercial marketplace

**What is Azure Marketplace?**

[Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace) is an online applications and services marketplace. Customers (mostly IT pros and developers) can discover and buy cloud software solutions that are built with or for Azure. The Azure Marketplace catalog has over 8,000 listings. Examples of offerings include Azure building blocks such as virtual machines, APIs, solution templates, SaaS applications, and consulting service offers.

Azure Marketplace is the starting point for all joint Microsoft go-to-market activities.  It focuses on helping partners to reach more customers. You can publish new listings, conduct promotional and demand-generation campaigns, and perform joint sales and marketing activities with Microsoft.

**Who are Azure Marketplace customers?**

Azure Marketplace is designed for IT professionals and cloud developers who are interested in commercial IT software and services.

### Azure Marketplace for publishers

**Why should I publish my application on Azure Marketplace, and how does it benefit me?**

Azure Marketplace provides a market for Microsoft partners to promote and sell products and services to Azure customers. Publishers gain immediate access to 140 global markets, our more than 300,000 partners, and the Azure network of enterprise customers.  Azure Marketplace includes more than 90 percent of Fortune 500 companies and many of the world's leading developers. New partners on Azure Marketplace are automatically offered a set of [no-cost go-to-market benefits](gtm-your-marketplace-benefits.md#list-trial-and-consulting-benefits) to help boost awareness of their offers in the commercial marketplace.

**What is the differentiating factor between Azure Marketplace and AppSource?**

Microsoft provides two distinct cloud marketplace storefronts: Azure Marketplace and AppSource. These storefronts allow customers to find, try, and buy cloud applications and services. Each storefront serves unique customer needs and enables Microsoft partners to target their solutions or services based on the target audience.

Select [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps) to target IT professionals and developers, or technical users.

Select [AppSource](https://appsource.microsoft.com/) to target line-of-business decision-makers and business owners.

For more details and to understand the benefits of Azure Marketplace and AppSource, see [Commercial marketplace publishing guide](marketplace-publishers-guide.md).

**Do I have to be a member of the Microsoft Partner Network (MPN) to list my applications and services on Azure Marketplace?**

Yes, an MPN membership is required to publish on Azure Marketplace. To get started, visit the [Microsoft Partner Network](https://partner.microsoft.com/membership).

**What are the criteria to publish a solution on Azure Marketplace?**

To publish on Azure Marketplace, partners must demonstrate that their application runs on or extends Azure. Publishers are required to provide customers with a [service-level agreement (SLA)](https://azure.microsoft.com/support/legal/sla/), a [privacy policy](https://privacy.microsoft.com/privacystatement), and phone and online support. Various workloads have additional requirements. For further guidance, see [Azure Marketplace Participation Policies](./marketplace-participation-policy.md) and [Commercial marketplace publishing guide](marketplace-publishers-guide.md).

**Is there a fee to publish on Azure Marketplace?**

There are no publishing fees when you upload a *List*, *Trial*, or *Bring-your-own-license (BYOL)* solution to Azure Marketplace.

**Are there any transaction fees for purchases through Azure Marketplace?**

When a solution license is purchased via Azure Marketplace, revenues for the license are split between the publisher and Microsoft.  This is done in accordance with the terms and conditions in the [Marketplace Publisher Agreement](https://query.prod.cms.rt.microsoft.com/cms/api/am/binary/RE3ypvt). Additionally, solutions from BYOL publishers don't incur transaction fees.

**What is a Standard Contract?**

Microsoft offers Standard Contract terms that a publisher can apply to an agreement, so that customers have a simplified procurement and legal review process.

**Where do I find guidelines for integrating my application with Azure Active Directory?**

Microsoft authenticates all Azure Marketplace users through Azure Active Directory (Azure AD).  You can directly set up a trial experience for customers without requiring an additional sign-in step.  For example, when authenticated users click through a trial listing on Azure Marketplace, they're automatically redirected to the trial environment.

For more information, and to get started enabling a trial by using Azure AD, see the "Enable a trial listing" section of [Enable an AppSource and Azure Marketplace listing by using Azure Active Directory](enable-appsource-marketplace-using-azure-ad.md#enable-a-trial-listing).

**How do I get started with Dev Center registration?**

As a publisher, you can get started by verifying that you're not already registered with a [Dev Center account](deprecated/register-dev-center.md). Next, register by signing in with your [Microsoft account](https://account.microsoft.com/account/), which will be associated with the developer account.

If you don't already have a Microsoft account, you can [create an account](https://signup.live.com/) (for example, **contoso_marketplace@live.com**).

**Why is a Dev Center account required?**

A Dev Center account is required to enable Microsoft to bill customers on the publisher's behalf for *Transaction* listing types. Your Dev Center account registration enables Microsoft to validate your legal, tax, and banking information. For more information, see [register in Dev Center](./partner-center-portal/create-account.md).

**What are leads and why are they important to me as a publisher on Azure Marketplace?**

Leads are customers who are deploying your products from Azure Marketplace. Whether your product is listed on [Azure Marketplace](https://azuremarketplace.microsoft.com) or [AppSource](https://appsource.microsoft.com), you can receive leads from customers who are interested in your product.  You can set up a lead destination on your offer. To learn more, see [Become a cloud marketplace publisher](./partner-center-portal/create-account.md).

**Where can I get help with setting up my lead destination?**

Get help in Partner Center by doing either of the following: 
* [Get customer leads from your marketplace offer](./partner-center-portal/commercial-marketplace-get-customer-leads.md) documentation.
* [Submit a support ticket](https://partner.microsoft.com/support/v2/?stage=1) by selecting your offer type and lead management.

**Am I required to configure a lead destination to publish an offer on Azure Marketplace?**

Yes. If you're publishing a *Contact Me*, *SaaS app*, or *consulting services* offer, you're required to configure a lead destination.

**How can I confirm that the lead configuration is correct?**

After you've completed the offer and set up a lead destination, the listing can properly be published in [Partner Center](https://partner.microsoft.com/). Before the listing goes live, you can validate whether the lead configuration setup is working correctly.  Send a test lead to the lead destination that you've configured in the offer.

**What countries/regions are available for Azure Marketplace publishers to sell from?**

Publishers based in the following countries/regions can currently sell on Azure Marketplace: Afghanistan, Albania, Algeria, Angola, Antigua and Barbuda, Argentina, Armenia, Australia, Austria, Azerbaijan, Bahrain, Bangladesh, Belarus, Belgium, Benin, Bolivia, Bosnia and Herzegovina, Botswana, Brazil, Bulgaria, Burkina Faso, Burundi, Cambodia, Cameroon, Canada, Central African Republic, Chad, Chile, Colombia, Comoros, Congo, Congo (DRC), Costa Rica, Cote D'Ivoire, Croatia, Cyprus, Czech Republic, Denmark, Dominica, Dominican Republic, Ecuador, Egypt, El Salvador, Eritrea, Estonia, Ethiopia, Fiji Islands, Finland, France, Georgia, Germany, Ghana, Greece, Guatemala, Guinea, Haiti, Honduras, Hong Kong SAR, Hungary, Iceland, India, Indonesia, Iraq, Ireland, Israel, Italy, Jamaica, Japan, Jordan, Kazakhstan, Kenya, Korea (South), Kuwait, Laos, Latvia, Lebanon, Liberia, Liechtenstein, Lithuania, Luxembourg, Madagascar, Malawi, Malaysia, Mali, Malta, Mauritius, Mexico, Monaco, Mongolia, Montenegro, Morocco, Mozambique, Nepal, The Netherlands, New Zealand, Nicaragua, Niger, Nigeria, Norway, Oman, Pakistan, Panama, Paraguay, Peru, Philippines, Poland, Portugal, Qatar, Romania, Russia, Rwanda, Saudi Arabia, Senegal, Serbia, Sierra Leone, Singapore, Slovakia, Slovenia, Somalia, South Africa, Spain, Sri Lanka, Sweden, Switzerland, Tajikistan, Tanzania, Thailand, Timor-Leste, Togo, Tonga, Trinidad and Tobago, Tunisia, Turkey, Turkmenistan, Uganda, Ukraine, United Arab Emirates, United Kingdom, United States, Uruguay, Uzbekistan, Venezuela, Vietnam, Zambia, and Zimbabwe.

**How do I delete a listing from Azure Marketplace?**

*Virtual machines and Azure apps*:

1. Sign in to [Partner Center](https://partner.microsoft.com/).
1. Select the offer from the **All Offers** tab.
1. In the left pane, select the **SKUs** tab.
1. Select the SKU for that you want to delete, and then select the **Delete** button.
1. [Republish the offer](./partner-center-portal/update-existing-offer.md#review-and-publish-an-updated-offer) to Azure Marketplace.

For more information, see [Update an existing offer in the commercial marketplace](./partner-center-portal/update-existing-offer.md).

*Web apps (SaaS apps, add-ins) and consulting services*:

1. In Partner Center, select the **question mark** (**?**) icon, and then select **Support**.
1. Go to the [New support request](https://go.microsoft.com/fwlink/?linkid=844975) page.
1. On the **New support** request page, select the offer type.
1. Select **Remove** to remove the published offer.
1. Create an incident ticket.
1. Select **Submit**.

*O365 apps*:

1. Sign in to [Partner Center](https://sellerdashboard.microsoft.com) with your dev account.
1. Withdraw the add-in.
    > [!NOTE]
    > Apps disappear from existing listings after 90 days.

**Why aren't my changes reflected in the offer?**

Changes made within Partner Center are updated in the system and storefronts only after you've republished the offer. After any modifications, ensure that you've resubmitted the offer for publication.

### Benefits and go-to-market (GTM) resources

**What are some of the go-to-market benefits provided for publishers who have listed offers on Azure Marketplace?**

Azure Marketplace is the starting point for joint go-to-market activities with Microsoft, and it's the doorway to a co-sell-ready partnership. All publishers of new listings on Azure Marketplace are automatically offered a set of [no-cost go-to-market benefits](https://assetsprod.microsoft.com/mpn/marketplace-gtm-benefits.pdf) to help drive awareness of offers to Microsoft customers. After you've published an offer, the Microsoft GTM team contacts you and begins delivering your benefits.

For more information about our GTM benefits and ways to grow your business in the commercial marketplace, visit [Microsoft GTM Services](https://partner.microsoft.com/reach-customers/gtm).

**Where are Azure Marketplace solutions promoted within Microsoft web properties?**

Azure Marketplace solutions are available in the [Azure portal] and on the [Azure Marketplace website](https://azuremarketplace.microsoft.com/marketplace/). Cloud developers and IT pros who use Azure have exposure to partner solutions every time they sign in. A subset of partner solutions is also showcased and rotated on the [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace) home page and the [Azure solutions](https://azure.microsoft.com/solutions/) page.

### Billing and payments

**How do I receive payment for my Azure Marketplace sales?**

All payments from Microsoft are processed monthly via PayPal or Electronic Funds Transfer (EFT). Payment is made within two months of the date when the customer used the service, although the exact timing depends on the payment instrument of the customer. A 45-day escrow period applies to credit card customers.

**For virtual machine-based solutions that are purchased with usage-based billing, when a customer upsizes or downsizes the underlying virtual machine, does the pricing of my software license follow?**

Yes, the new price is billed immediately.  Pricing changes happen when a customer changes the virtual machine size and specifies different prices in the pricing table, which are based on virtual machine size.

**Is per-node billing available for Azure Marketplace?**

Azure Marketplace does not currently support per-node billing with virtual machines. Publishers can still determine a per-node billing rate with Microsoft VM billing rates.  The calculation is to determine the number of VMs by the number of hours used and the rate per hour.

**Whom do I contact for billing or offer-management questions?**

If you have billing or offer-management questions, submit a ticket with [Microsoft Support](https://support.microsoft.com/getsupport?oaspworkflow=start_1.0.0.0&wf=0&wfName=productselection&prid=15635).

### Publisher support

**Whom do I contact for general support issues with Azure Marketplace?**

For general application support for usability or troubleshooting issues, contact [Partner Center Support](https://support.microsoft.com/getsupport?wf=0&tenant=ClassicCommercial&oaspworkflow=start_1.0.0.0&locale=en-us&supportregion=en-us&pesid=16230&ccsid=636565784998876007).

For billing and subscription issues with your Azure Marketplace purchase, contact [Azure Support](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview).

**Whom do I contact with publishing or offer-management questions?**

For up-to-date resources and documentation for frequently asked questions, see the [commercial marketplace publisher guide](marketplace-publishers-guide.md). Additionally, you can submit a ticket with [Microsoft Support in Partner Center](https://support.microsoft.com/getsupport?oaspworkflow=start_1.0.0.0&wf=0&wfname=productselection&prid=16230&forceorigin=esmc&ccsid=636694515623707953).

### Azure Marketplace for publishers

**How do I define my geographic availability to enable selling in various countries/regions?**

1.  In Partner Center, go to the SKU to which you want to add new countries/regions.  In the **SKU Details** section, for **Country/Region availability**, click **Select regions**.

    ![The "All SKUs" pane, showing the "Select regions" button](media/marketplace-publishers-guide/FAQ-choose-geo.png)

    A window opens that displays a list of all available countries/regions to sell to.

1.  Select the check box next to each country/region where you want to make this SKU available, and then select **OK**.

    ![Screenshot showing a list of available countries/regions](media/marketplace-publishers-guide/FAQ-select-countries.png)

1.  To apply the changes to your live offer, select **Publish**.  

    > [!Note]
    > It takes 24 hours for the changes to take effect.

<!---    ![Publish offer](media/marketplace-publishers-guide/FAQ-publish-offer.png) -->

**How can I, as a publisher, change the geographic availability for an existing offer?**

You can edit an existing offer, select the new countries/regions, and then use the spreadsheet download/upload function to set pricing.

**In what countries/regions can my customers purchase Azure Marketplace offerings?**

Azure Marketplace supports 141 buy-from geographies, as defined by customer billing addresses. For a list of countries/regions, see [participation policies](/legal/marketplace/participation-policy).

**What currencies are supported by Azure Marketplace?**

Transactions can be conducted in the following 17 currencies: AUD, BRL, CAD, CHF, DKK, EUR, GBP, INR, JPY, KRW, NOK, NZD, RUB, SEK, TWD, and USD.

### Pricing and payment

**What is the difference between Free Tier and Free Software Trial?**

A *Free Tier* subscription offering is perpetually free.  A *Free Software Trial* (Try It Now) offering is a paid subscription that's free for only a limited period of time.

**What is the process to validate the end-to-end purchase and provisioning flow?**

During the publishing process, you are given access to a preview of your offer. Access is restricted to users that you specify in the **Preview** tab. It's a live offer that isn't visible to anyone else. You can purchase this access and test the process; however, you will be charged the full amount according to your offer's configuration.

To complete a purchase at a very low price, we suggest that you publish a private plan to yourself, set at a price you can accept as the cost of testing. A zero-cost plan is supported, but it won't reflect the full user experience like a paid subscription.

**Will Microsoft provide a refund to my customers outside of standard policies?**

Yes, upon your request via support ticket, Microsoft will process credits to your customer if you deem it appropriate.

## Next steps

Visit the [Commercial marketplace publishing guide](/azure/marketplace/marketplace-publishers-guide) page.
