---
title: Marketplace ‎Commercial Transaction Capabilities and Considerations | Azure
description: This article describes the Transact pricing, billing, invoicing, and payout considerations for an offer type.
services:  Azure, Marketplace, Compute, Storage, Networking, Transact Offer Type
documentationcenter:
author: yijenj
manager: nuno costa
editor:

ms.assetid: 
ms.service: marketplace
ms.workload: 
ms.tgt_pltfrm: 
ms.devlang: 
ms.topic: article
ms.date: 10/29/2018
ms.author: yijenj

---
# Azure Marketplace ‎commercial transaction capabilities and considerations

Azure Marketplace publishing options offer unique ways to connect cloud software and service providers with customers. This article covers the following commerce-related topics in the Azure Marketplace:

* Marketplace publishing options
* Transact general overview
* Transact billing models
* Transact requirements

## Marketplace publishing options

The following publishing options are available to Azure Marketplace publishers.

### List & trial publishing options

In Azure Marketplace, publishers can leverage the list and trial publishing options for promotional and user acquisition purposes. With the list or trial publishing options, Microsoft doesn't participate directly in the publisher’s software license transactions, and there is no associated transaction fee. Publishers are responsible for supporting all aspects of the software license transaction, including but not limited to: order, fulfillment, metering, billing, invoicing, payment, and collection. With the list and trial publishing options, publishers keep 100% of publisher software licensing fees collected from the customer. 

### Transact publishing option

In addition to the list and trial publishing options, the transact publishing option is available to Azure Marketplace publishers.   It takes advantage of Microsoft’s globally available commerce capabilities. This option allows Microsoft to host cloud marketplace transactions on behalf of the publisher.

## Transact general overview

When using the transact publishing option, Microsoft enables the sale of third-party software, and deployment of some offer types to the customer’s Azure subscription. The publisher must consider the billing of Azure infrastructure fees, and the publisher’s own software licensing fees, when selecting a billing model and offer type in Azure Marketplace.

The Transact publishing option in Azure Marketplace is currently supported for the following offer types: Virtual Machines, Azure Applications, or SaaS Apps.

![[Transacting Enterprise Deals in Azure Marketplace]](./media/marketplace-publishers-guide/Transact-enterprise-deals.png)

### Billing infrastructure costs

**For Virtual Machines and Azure applications**

For Virtual Machines and Azure Applications, the Azure infrastructure usage fees are billed to the customer’s Azure subscription.  Infrastructure usage fees are priced and presented separately from the software provider’s licensing fees on the customer’s invoice.

**For SaaS apps**

For SaaS Apps, the publisher must account for Azure infrastructure usage fees, and software licensing fees as a single cost item.  It is represented as a flat fee to the customer. The Azure infrastructure usage is managed and billed to the partner directly.  Actual infrastructure usage fees are not seen by the customer.  Publishers typically opt to bundle Azure infrastructure usage fees into their software license pricing.  Software licensing fees aren't metered or consumption based.

## Transact billing models

Depending on the transaction option used, the publisher’s software license fees can be presented as follows:  

* Free: No charge for software licenses. 

* Bring your own license (BYOL): Any applicable charges for software licenses are managed directly between the publisher and customer. Microsoft only passes through Azure infrastructure usage fees. (Virtual Machines and Azure Applications only.)

* Pay-as-you-go: Software license fees are presented as a per-hour, per-core (vCPU) pricing rate based on the Azure infrastructure used. This only applies to Virtual Machines and Azure Applications.

* Subscription pricing (site-based): Software license fees are presented as a monthly, recurring fee.  This only applies to SaaS Apps and Azure Applications – Managed Apps.

* Free software trial: No charge for software licenses for 30-days or 90-days.

### Free and bring-your-own-license (BYOL) pricing

When publishing a free or bring-your-own-license transaction offer, Microsoft does not play a role in facilitating the sales transaction for your software license fees. Like the list and trial publishing options, the publisher keeps 100% of software license fees. 

### Pay-as-you-go and subscription (site-based) pricing

When publishing a pay-as-you-go or subscription transaction offer, Microsoft provides the technology and services to process software license purchases, returns, and chargebacks. In this scenario, the publisher authorizes Microsoft to act as an agent for these purposes. The publisher allows Microsoft to facilitate the software licensing transaction, while retaining their designation as the seller, provider, distributor, and licensor.

Microsoft enables customers to order, license, and use publisher software, subjecting to the terms and conditions of both Azure Marketplace and the publisher’s end-user licensing agreement (see Cloud Partner Portal). Publishers must provide their end-user licensing agreement in the marketplace offer.

Orders processed through marketplace are billed to the customer’s Azure subscription in a single bill, the same billing method as the customer’s Azure infrastructure costs. Customers can use the preferred invoicing method and payment instrument used for their Azure subscription billing.

### Free software trials

For transact publishing scenarios, the publisher can make a software license available free for 30-days or 90 days. This discounting capability does not include the cost of Azure infrastructure usage that is driven by use of the partner solution.

### Private offers

In addition to using offer types and billing models to monetize an offer, publishers can transact a private version of solution offer, complete with negotiated, deal-specific pricing, and custom configurations using a customized image. Private offers are supported by all 3 transact publishing options.

This pricing option can be the higher or lower than the publicly displayed pricing.  Private offers can be used to discount, or add a premium for an offer. Private offers can be made available to one or more customers by white listing their Azure subscription at the offer level.

### Examples

**Pay-As-You-Go** 

* If you enable the Pay-As-You-Go option, then you have the following cost structure.

|Your license cost  | $1.00 per hour  |
|---------|---------|
|Azure usage cost (D1/1-Core)    |   $0.14 per hour     |
|*Customer is billed by Microsoft*    |  *$1.14 per hour*       |

* In this scenario, Microsoft bills $1.14 per hour for use of your published VM image.

|Microsoft bills  | $1.14 per hour  |
|---------|---------|
|Microsoft pays you 80% of your license cost|   $0.80 per hour     |
|Microsoft keeps 20% of your license cost  |  $0.20 per hour       |
|Microsoft keeps 100% of the Azure usage cost | $0.14 per hour |

**Bring Your Own License (BYOL)**

* If you enable the BYOL option, then you have the following cost structure.

|Your license cost  | License fee negotiated and billed by you  |
|---------|---------|
|Azure usage cost (D1/1-Core)    |   $0.14 per hour     |
|*Customer is billed by Microsoft*    |  *$0.14 per hour*       |

* In this scenario, Microsoft bills $0.14 per hour for use of your published VM image.

|Microsoft bills  | $0.14 per hour  |
|---------|---------|
|Microsoft keeps the Azure usage cost    |   $0.14 per hour     |
|Microsoft keeps 0% of your license cost   |  $0.00 per hour       |

**SaaS App subscription (Sell through Azure)**

This option must be configured to sell through Microsoft and can be priced using one or more flat-rate monthly Plans defined at the offer level.

* If you enable the Sell through Azure option, then you have the following cost structure.

|Your license cost       | $100.00 per month  |
|--------------|---------|
|Azure usage cost (D1/1-Core)    | Billed directly to the publisher, not the customer |
|*Customer is billed by Microsoft*    |  *$100.00 per month (note: publisher must account for any incurred or pass-through infrastructure costs in the license fee)*  |

* In this scenario, Microsoft bills $100.00 for your software license and pays out $80.00 to the publisher.

|Microsoft bills  | $100.00 per month  |
|---------|---------|
|Microsoft pays you 80% of your license cost    |   $80.00 per month     |
|Microsoft keeps 20% of your license cost   |  $20.00 per month       |

### Customer invoicing, payment, billing, and collections

**Invoicing and payment**

Publisher can use the customer’s preferred invoicing method to deliver subscription or PAYGO software license fees.

**Enterprise agreement** 

If the customer’s preferred invoicing method is the Microsoft Enterprise Agreement, your software license fees will be billed using this invoicing method as an itemized cost, separate from any Azure-specific usage costs.

**Credit cards and monthly invoice** 

Customers can also pay using a credit card and a monthly invoice. In this case, your software license fees will be billed just like the Enterprise Agreement scenario, as an itemized cost, separate from any Azure-specific usage costs.

For example, if the customer purchases using a credit card:

|Description    |    Date  |
|----------|----------|
|Order Period   | Aug 15, 2018 - Aug 30, 2018 |
|Term Ending (month)   | Aug 30, 2018 |
|Billing Date | Sept 1, 2018 |
|Customer Payment Date | Sept 1, 2018 |
|Escrow Period (credit cards only, 30 days) | Sept 1, 2018 – Sept 30, 2018 |
|Collection Period Start | Sept 1, 2018 |
|Collection Period End (maximum, 30 days) | Sept 30, 2018 |
|Payout Calculation Date (monthly on the 15th) | Oct 1, 2018 |
|Payout Date | Oct 15, 2018 |

If the customer purchases using an Enterprise Agreement:

| Description |    Date  |
|----------|----------|
|Order Period | Aug 15, 2018 - Aug 30, 2018 |
|Term Ending (quarter) | Sept 30, 2018 |
|Billing Date | Oct 15, 2018 |
|Escrow Period (credit cards only, 30 days) | n/a |
|Collection Period Start | Oct 15, 2018 |
|Collection Period End (maximum, 90 days) | Jan 15, 2019 |
|Customer Payment Date | Dec 30, 2018 |
|Payout Calculation Date (monthly on the 15th) | Jan 15, 2019 |
|Payout Date | Feb 15, 2019 |

**Free credits and monetary commitment** 

Some customers elect to prepay Azure with a monetary commitment in the Enterprise Agreement or have been provided free credits for use with Azure. Although these credits can be used to pay for Azure usage, they can't be used to pay for publisher software license fees.

**Billing and collections** 

Publisher software license billing is presented using the customer selected method of invoicing and follows the invoicing timeline. Customers without an Enterprise Agreement in place are billed monthly for marketplace software licenses. Customers with an Enterprise Agreement are billed monthly via an invoice that is presented quarterly.

When subscription or Pay-as-You-Go pricing models are selected, Microsoft acts as the agent of the publisher and is responsible for all aspects of billing, payment, and collection.

### Publisher payout and reporting

* Any software licensing fees collected by Microsoft as an agent are subject to a 20% transaction fee unless otherwise specified and are deducted at the time of publisher payout.

* Customers typically purchase using the Enterprise Agreement or a credit-card enabled pay-as-you-go agreement. The agreement type determines billing, invoicing, collection, and payout timing.

>[!NOTE] 
>All reporting and insights for the transact publishing option are available via the Insights section of the Cloud Partner Portal.

#### Billing questions and support

For more information and legal policies, see the [Publisher Agreement](https://cloudpartner.azure.com/Content/Unversioned/PublisherAgreement2.pdf) (available in the Cloud Partner Portal).

To get help on billing questions, [create a support incident](https://support.microsoft.com/getsupport?wf=0&tenant=classiccommercial&oaspworkflow=start_1.0.0.0&pesid=16230&forceorigin=esmc&ccsid=636764613233453423) and choose Virtual Machines or Web Apps (aka SaaS Apps) depending on the offer type used.

## Transact requirements

The transact requirements for different offer types are covered in this section.

### Requirements for all offer types

**Dev Center and Microsoft account** 

* Both a Dev Center and a Microsoft account are required for the transact publishing option, regardless of the offer’s pricing model.
* The Dev Center account holds all relevant financial details required for Microsoft to collect fees from the customer on the publisher’s behalf and pay out the publisher.
* Although you may use the same organizational or Microsoft sign-in details across both accounts, Dev Center is a separate account from the Cloud Partner Portal account. To use the transact publishing option, the publisher must complete the Dev Center account sign-up process, in addition to signing up for access to the Cloud Partner Portal.

*For more information on setting up these accounts, see [Become a Cloud Marketplace Publisher](https://docs.microsoft.com/azure/marketplace/become-publisher).*

### Requirements for specific offer types

The transact publishing option is only available for use with the following marketplace offer types: 

**Virtual Machine** 

Select from free, bring-your-own-license, or pay-as-you-go-pricing models and present as SKUs defined at the offer level. On the customer’s Azure bill, Microsoft presents the publisher software license fees separately from the underlying Azure infrastructure fees. Azure infrastructure fees are driven by use of the publisher software.

**Azure Applications: Solution Template or Managed App** 

Must provision one or more virtual machines and pulls through the sum of the virtual machine pricing. For managed apps on a single plan, a flat-rate monthly subscription can be selected as the pricing model instead the virtual machine pricing. In both cases, Azure infrastructure usage fees are passed to the customer separately from software license fees, but on the same billing statement.

## Next steps

* Review the eligibility requirements in the publishing options by offer type section to finalize the selection and configuration of your offer.
* Review the publishing patterns by storefront for examples on how your solution maps to an offer type and configuration.
* Become a Marketplace publisher, and sign in to the [Cloud Partner Portal](https://cloudpartner.azure.com) to create and configure your offer.
