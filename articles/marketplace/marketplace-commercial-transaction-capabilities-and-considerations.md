---
title: Marketplace ‎Commercial Transaction Capabilities and Considerations | Azure
description: This article describes the Transact pricing, billing, invoicing, and payout considerations for an offer type.
services:  Azure, Marketplace, Compute, Storage, Networking, Transact Offer Type

author: yijenj
manager: nuno costa

ms.service: marketplace
ms.topic: article
ms.date: 10/29/2018
ms.author: pabutler

---
# Commercial marketplace transaction capabilities and considerations

This article covers the following commerce-related topics for the commercial marketplace

* Marketplace publishing options
* Transact general overview
* Transact billing models
* Transact requirements

## Marketplace publishing options

The following publishing options are available to commercial marketplace publishers.

### List & trial publishing options

Publishers can leverage the list, trial, and BYOL publishing options for promotional and user acquisition purposes. With these options, Microsoft doesn't participate directly in the publisher’s software license transactions, and there is no associated transaction fee. Publishers are responsible for supporting all aspects of the software license transaction, including but not limited to: order, fulfillment, metering, billing, invoicing, payment, and collection. With the list and trial publishing options, publishers keep 100% of publisher software licensing fees collected from the customer. 

### Transact publishing option

In addition to the list and trial publishing options, the transact publishing option is available to publishers. This takes advantage of Microsoft’s globally available commerce capabilities and allows Microsoft to host cloud marketplace transactions on behalf of the publisher.

## Transact general overview

When using the transact publishing option, Microsoft enables the sale of third-party software, and deployment of some offer types to the customer’s Azure subscription. The publisher must consider the billing of infrastructure fees, and the publisher’s own software licensing fees, when selecting a billing model and offer type.

The Transact publishing option is currently supported for the following offer types: Virtual Machines, Azure Applications,and SaaS Apps.


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

* •	Subscription pricing: Software license fees are presented as a monthly or annual, recurring fee billed as a flat rate or per-seat. This only applies to SaaS Apps and Azure Applications – Managed Apps.

* Free software trial: No charge for software licenses for 30-days or 90-days.

### Free and bring-your-own-license (BYOL) pricing

When publishing a free or bring-your-own-license transaction offer, Microsoft does not play a role in facilitating the sales transaction for your software license fees. Like the list and trial publishing options, the publisher keeps 100% of software license fees. 

### Pay-as-you-go and subscription (site-based) pricing

WPay-as-you-go and subscription pricing
When publishing a pay-as-you-go or subscription transaction offer, Microsoft provides the technology and services to process software license purchases, returns, and chargebacks. In this scenario, the publisher authorizes Microsoft to act as an agent for these purposes. The publisher allows Microsoft to facilitate the software licensing transaction, while retaining their designation as the seller, provider, distributor, and licensor.

Microsoft enables customers to order, license, and use publisher software, subjecting to the terms and conditions of both Microsoft’s commercial Marketplace and the publisher’s end-user licensing agreement. Publishers must provide their end-user licensing agreement or select the [Standard Contract](https://docs.microsoft.com/azure/marketplace/standard-contract) when creating the offering.


### Free software trials

For transact publishing scenarios, the publisher can make a software license available free for 30-days or 90 days. This discounting capability does not include the cost of Azure infrastructure usage that is driven by use of the partner solution.

### Private offers

In addition to using offer types and billing models to monetize an offer, publishers can transact a private offer, complete with negotiated, deal-specific pricing, or custom configurations. Private offers are supported by all 3 transact publishing options.

This option allows higher or lower pricing than the publicly available offering. Private offers can be used to discount, or add a premium for an offer. Private offers can be made available to one or more customers by white listing their Azure subscription at the offer level.


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

**SaaS App subscription**

This option must be configured to sell through Microsoft and can be priced at a flat rate or per user on a monthly or annual basis.
•	If you enable the Sell through Microsoft option for a SaaS offer, then you have the following cost structure.

|Your license cost       | $100.00 per month  |
|--------------|---------|
|Azure usage cost (D1/1-Core)    | Billed directly to the publisher, not the customer |
|*Customer is billed by Microsoft*    |  *$100.00 per month (note: publisher must account for any incurred or pass-through infrastructure costs in the license fee)*  |

* In this scenario, Microsoft bills $100.00 for your software license and pays out $80.00 to the publisher.
* Partners who have qualified for the Reduced Marketplace Service Fee will see a reduced transaction fee on the SaaS offers from May 2019 until June 2020. In this scenario, Microsoft bills $100.00 for your software license and pays out $90.00 to the publisher.

|Microsoft bills  | $100.00 per month  |
|---------|---------|
|Microsoft pays you 80% of your license cost <br> \* Microsoft pays you 90% of your license cost for any qualified SaaS apps   |   $80.00 per month <br> \* $90.00 per month    |
|Microsoft keeps 20% of your license cost <br> \* Microsoft keeps 10% of your license cost for any qualified SaaS apps.  |  $20.00 per month <br> \* $10.00     |

* **Reduced Marketplace Service Fee:** For certain SaaS Products that you publish on our Commercial Marketplace, Microsoft will reduce its Marketplace Service Fee from 20% (as described in the Microsoft Publisher Agreement) to 10%.  In order for your Product to qualify, at least one of your products must be designated by Microsoft as either IP co-sell ready or IP co-sell prioritized. To receive this reduced Marketplace Service Fee for the month, eligibility must be met at least five (5) business days before the end of that calendar month. Reduced Marketplace Service fee will not apply to VMs, Managed Apps or any other products made available through our Commercial Marketplace.  This Reduced Marketplace Service Fee will be available to qualified offers, with license charges collected by Microsoft between May 1, 2019 and June 30, 2020.  After that time, the Marketplace Service Fee will return to its normal amount.

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
>All reporting and insights for the transact publishing option are available via the Insights section of the Cloud Partner Portal or Analytics section of Partner Center.

#### Billing questions and support

For more information and legal policies, see the [Publisher Agreement](https://cloudpartner.azure.com/Content/Unversioned/PublisherAgreement2.pdf) (available in the Cloud Partner Portal).

To get help on billing questions, please contact [commercial marketplace publisher support](https://aka.ms/marketplacepublishersupport).

## Transact requirements

The transact requirements for different offer types are covered in this section.

### Requirements for all offer types

- A Microsoft account and financial information are required for the transact publishing option, regardless of the offer’s pricing model.
- Mandatory financial information includes payout account and tax profile.

For more information on setting up these accounts, see [Manage Your Partner Center Account](https://docs.microsoft.com/azure/marketplace/partner-center-portal/manage-account#financial-details).


### Requirements for specific offer types

The transact publishing option is only available for use with the following marketplace offer types: 

**Virtual Machine** 

Select from free, bring-your-own-license, or pay-as-you-go-pricing models and present as SKUs defined at the offer level. On the customer’s Azure bill, Microsoft presents the publisher software license fees separately from the underlying Azure infrastructure fees. Azure infrastructure fees are driven by use of the publisher software.

**Azure Applications: Solution Template or Managed App** 

Must provision one or more virtual machines and pulls through the sum of the virtual machine pricing. For managed apps on a single plan, a flat-rate monthly subscription can be selected as the pricing model instead the virtual machine pricing. In some cases, Azure infrastructure usage fees are passed to the customer separately from software license fees, but on the same billing statement. However, if you configure a Managed App offering for ISV infrastructure charges, the Azure resources are billed to the publisher, and the customer receives a flat fee that includes the cost of infrastructure, software licenses, and management services.

## Next steps

* Review the eligibility requirements in the publishing options by offer type section to finalize the selection and configuration of your offer.
* Review the publishing patterns by storefront for examples on how your solution maps to an offer type and configuration.
