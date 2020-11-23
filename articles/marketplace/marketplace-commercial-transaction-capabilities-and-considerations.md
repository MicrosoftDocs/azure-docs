---
title: Microsoft commercial marketplace transact capabilities
description: This article describes pricing, billing, invoicing, and payout considerations for the commercial marketplace transact option.
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 08/20/2020
ms.author: mingshen
author: mingshen-ms
---

# Commercial marketplace transact capabilities

This article describes pricing, billing, invoicing, and payout considerations for the Microsoft commercial marketplace. 

## Transactions by listing option

Either the publisher or Microsoft is responsible for managing software license transactions for offers in the commercial marketplace. The listing option you choose for your offer determines who manages the transaction. See [Choose a listing option](./determine-your-listing-type.md#choose-a-listing-option) for availability and explanations of each publishing option.

### Contact me, free trial, and BYOL options

Publishers can choose the _Contact me_ and _Free trial_, options for promotional and user acquisition purposes. For some offer types, publishers can choose the bring your own license (BYOL) option to enable customers to purchase a subscription to your offer using a license that they’ve purchased directly from you. With these options, Microsoft doesn't participate directly in the publisher's software license transactions and there's no associated transaction fee. 

Publishers are responsible for supporting all aspects of the software license transaction. This includes but is not limited to order, fulfillment, metering, billing, invoicing, payment, and collection. With the Contact me listing option, publishers keep 100% of publisher software licensing fees collected from the customer.

### Transact publishing option

Choosing to sell through Microsoft takes advantage of Microsoft commerce capabilities and provides an end-to-end experience from discovery and evaluation to purchase and implementation. An offer that’s transactable is one in which Microsoft facilitates the exchange of money for a software license on the publisher’s behalf. Transactable offers are billed against an existing Microsoft subscription or a credit card, allowing Microsoft to host cloud marketplace transactions on behalf of the publisher.

You choose the transact option when you create a new offer in Partner Center. This option will show only if transact is available for your offer type.

## Transact overview

When using the transact option, Microsoft enables the sale of third-party software and deployment of some offer types to the customer's Azure subscription. You the publisher must consider the billing of infrastructure fees and your own software licensing fees when selecting a pricing model for an offer.

The transact publishing option is currently supported for the following offer types:

- Virtual machines
- Azure applications
- SaaS applications

### Billing infrastructure costs

For **virtual machines** and **Azure applications**, Azure infrastructure usage fees are billed to the customer's Azure subscription. Infrastructure usage fees are priced and presented separately from the software provider's licensing fees on the customer's invoice.

For **SaaS Apps**, you the publisher must account for Azure infrastructure usage fees and software licensing fees as a single cost item.  It is represented as a flat fee to the customer. The Azure infrastructure usage is managed and billed to the publisher directly. Actual infrastructure usage fees are not seen by the customer. Publishers typically opt to bundle Azure infrastructure usage fees into their software license pricing. Software licensing fees aren't metered or based on user consumption.

## Pricing models

Depending on the transaction option used, subscription charges are as follows:

- **Get it now (Free)** – No charge for software licenses. Customers are not charged Azure Marketplace fees for using a free offer. Free offers can’t be converted to a paid offer. Customers must order a paid offer.
- **Bring your own license** (BYOL) – Any applicable charges for software licenses are managed directly between the publisher and customer. Microsoft only passes through Azure infrastructure usage fees. If an offer is listed in the commercial marketplace, customers who obtain access or use of the offer outside of the commercial marketplace are not charged commercial marketplace fees.
- **Subscription pricing** – Software license fees are presented as a monthly or annual, recurring subscription fee billed as a flat rate or per-seat. Recurrent subscription fees are not prorated for mid-term customer cancellations, or unused services. Recurrent subscription fees may be prorated if the customer upgrades or downgrades their subscription in the middle of the subscription term.
- **Usage-based pricing** – For Azure Virtual Machine offers, customers are charged based on the extent of their use of the offer. For Virtual Machine Images, customers are charged an hourly Azure Marketplace fee, as set by publishers, for use of virtual machines deployed from the VM images. The hourly fee may be uniform or varied across virtual machine sizes. Partial hours are charged by the minute. Plans are billed monthly.
- **Metered pricing** – For Azure Application offers and SaaS offers, publishers can use the [Marketplace metering service](./partner-center-portal/marketplace-metering-service-apis.md) to bill for consumption based on the meter dimensions they choose. For example, bandwidth, tickets, or emails processed. Publishers can define one or more meter dimensions for each plan. Publishers are responsible for tracking individual customers’ usage, with each meter defined in the offer. Events should be reported to Microsoft within an hour. Microsoft charges customers based on the usage information reported by publishers for the applicable billing period.
- **Free trial** – No charge for software licenses that range from 30 days up to six months, depending on the offer type. If publishers provide a free trial on multiple plans within the same offer, customers can switch to a free trial on another plan but the trial period does not restart. For virtual machine offers, customers are charged Azure infrastructure costs for using the offer during a trial period. Upon expiration of the trial period, customers are automatically charged for the last plan they tried based on standard rates unless they cancel before the end of the trial period.

> [!NOTE]
> Offers that are billed according to consumption after a solution has been used are not eligible for refunds.

Publishers who want to change the usage fees associated with an offer, should first remove the offer (or the specific plan within the offer) from the commercial marketplace. Removal should be done in accordance with the requirements of the [Microsoft Publisher Agreement](https://go.microsoft.com/fwlink/?LinkID=699560). Then the publisher can publish a new offer (or plan within an offer) that includes the new usage fees. For information, about removing an offer or plan, see [Stop selling an offer or plan](./partner-center-portal/update-existing-offer.md#stop-selling-an-offer-or-plan).

### Free, Contact me, and bring-your-own-license (BYOL) pricing

When publishing an offer with the Get it now (Free), Contact me, or BYOL option, Microsoft does not play a role in facilitating the sales transaction for your software license fees. Like the list and free trial publishing options, the publisher keeps 100% of software license fees.

### Usage-based and subscription pricing

When publishing an offer a a user-based or subscription transaction, Microsoft provides the technology and services to process software license purchases, returns, and chargebacks. In this scenario, the publisher authorizes Microsoft to act as an agent for these purposes. The publisher allows Microsoft to facilitate the software licensing transaction, while retaining their designation as the seller, provider, distributor, and licensor.

Microsoft enables customers to order, license, and use your software, subject to the terms and conditions of both Microsoft's commercial marketplace and your end-user licensing agreement. You must provide your own end-user licensing agreement or select the [Standard Contract](./standard-contract.md) when creating the offer.

### Free software trials

For transact publishing scenarios, you can make a software license available free for 30 to 120 days, depending on the subscription. This discounting capability does not include the cost of Azure infrastructure usage driven by use of the partner solution.

### Private offers

In addition to using offer types and billing models to monetize an offer, you can transact a private offer, complete with negotiated, deal-specific pricing, or custom configurations. Private offers are supported by all three transact publishing options.

This option allows higher or lower pricing than the publicly available offering. Private offers can be used to discount or add a premium to an offer. Private offers can be made available to one or more customers by white-listing their Azure subscription at the offer level.

### Examples

**Usage-based** 

Usage-based pricing has the following cost structure:

|Your license cost  | $1.00 per hour   |
|---------|---------|
|Azure usage cost (D1/1-Core)    |   $0.14 per hour     |
|*Customer is billed by Microsoft*    |  *$1.14 per hour*       |
||

In this scenario, Microsoft bills $1.14 per hour for use of your published VM image.

|Microsoft bills  | $1.14 per hour  |
|---------|---------|
|Microsoft pays you 80% of your license cost|   $0.80 per hour     |
|Microsoft keeps 20% of your license cost  |  $0.20 per hour       |
|Microsoft keeps 100% of the Azure usage cost | $0.14 per hour |
||

**Bring Your Own License (BYOL)**

BYOL has the following cost structure:

|Your license cost  | License fee negotiated and billed by you  |
|---------|---------|
|Azure usage cost (D1/1-Core)    |   $0.14 per hour     |
|*Customer is billed by Microsoft*    |  *$0.14 per hour*       |
||

In this scenario, Microsoft bills $0.14 per hour for use of your published VM image.

|Microsoft bills  | $0.14 per hour  |
|---------|---------|
|Microsoft keeps the Azure usage cost    |   $0.14 per hour     |
|Microsoft keeps 0% of your license cost   |  $0.00 per hour       |
||

**SaaS app subscription**

This option must be configured to sell through Microsoft and can be priced at a flat rate or per user on a monthly or annual basis. If you enable the **Sell through Microsoft** option for a SaaS offer, you have the following cost structure:

| Your license cost       | $100.00 per month  |
|--------------|---------|
| Azure usage cost (D1/1-Core)    | Billed directly to the publisher, not the customer |
| *Customer is billed by Microsoft*    |  *$100.00 per month (publisher must account for any incurred or pass-through infrastructure costs in the license fee)*  |
||

In this scenario, Microsoft bills $100.00 for your software license and pays out $80.00 to the publisher.

In this scenario, Microsoft bills $100.00 for your software license and pays out $90.00 to the publisher:

|Microsoft bills  | $100.00 per month  |
|---------|---------|
|Microsoft pays you 80% of your license cost <br> \* Microsoft pays you 90% of your license cost for any qualified SaaS apps   |   $80.00 per month <br> \* $90.00 per month    |
|Microsoft keeps 20% of your license cost <br> \* Microsoft keeps 10% of your license cost for any qualified SaaS apps.  |  $20.00 per month <br> \* $10.00     |

### Reduced Service Fee

For certain offers that you publish on the commercial marketplace, Microsoft will reduce its Marketplace Service Fee from 20% (as described in the [Microsoft Publisher Agreement](https://go.microsoft.com/fwlink/?LinkID=699560)) to 10%. For your offer(s) to qualify, your offer(s) must have been designated by Microsoft as Azure IP Co-sell incentivized. Eligibility must be met at least five business days before the end of each calendar month to receive the Reduced Marketplace Service Fee for the month. The Reduced Marketplace Service Fee applies to Azure IP Co-sell incentivized SaaS, VMs, Managed apps, and any other qualified transactable IaaS offers made available through the commercial marketplace. Paid SaaS offers associated with one Microsoft Teams app or at least two Microsoft 365 add-ins (Excel, PowerPoint, Word, Outlook, and SharePoint) and published on AppSource also receive this discount.

### Customer invoicing, payment, billing, and collections

**Invoicing and payment** – You can use the customer's preferred invoicing method to deliver subscription or PAYGO software license fees.

**Enterprise Agreement** – If the customer's preferred invoicing method is the Microsoft Enterprise Agreement, your software license fees will be billed using this invoicing method as an itemized cost, separate from any Azure-specific usage costs.

**Credit cards and monthly invoice** – Customers can also pay using a credit card and a monthly invoice. In this case, your software license fees will be billed just like the Enterprise Agreement scenario, as an itemized cost, separate from any Azure-specific usage costs.

**Free credits and monetary commitment** – Some customers elect to prepay Azure with a monetary commitment in the Enterprise Agreement or have been provided free credits for use with Azure. Although these credits can be used to pay for Azure usage, they can't be used to pay for publisher software license fees.

**Billing and collections** – Publisher software license billing is presented using the customer-selected method of invoicing and follows the invoicing timeline. Customers without an Enterprise Agreement in place are billed monthly for marketplace software licenses. Customers with an Enterprise Agreement are billed monthly via an invoice that is presented quarterly.

When subscription or Pay-as-You-Go pricing models are selected, Microsoft acts as the agent of the publisher and is responsible for all aspects of billing, payment, and collection.

### Publisher payout and reporting

Any software licensing fees collected by Microsoft as an agent are subject to a 20% transaction fee unless otherwise specified and are deducted at the time of publisher payout.

Customers typically purchase using the Enterprise Agreement or a credit-card enabled pay-as-you-go agreement. The agreement type determines billing, invoicing, collection, and payout timing.

>[!NOTE]
>All reporting and insights for the transact publishing option are available via the Analytics section of Partner Center.

#### Billing questions and support

For more information and legal policies, see the [Microsoft Publisher Agreement](https://go.microsoft.com/fwlink/?LinkID=699560) (available in Partner Center).

For help on billing questions, contact [commercial marketplace publisher support](https://aka.ms/marketplacepublishersupport).

## Transact requirements

This section covers transact requirements for different offer types.

### Requirements for all offer types

- A Microsoft account and financial information are required for the transact publishing option, regardless of the offer's pricing model.
- Mandatory financial information includes payout account and tax profile.
- The publisher must live in a [supported country or region](sell-from-countries.md).

For more information on setting up these accounts, see [Manage your commercial marketplace account in Partner Center](partner-center-portal/manage-account.md).

### Requirements for specific offer types

The transact publishing option is only available for use with the following marketplace offer types:

- **Azure Virtual Machine** – Select from free, bring-your-own-license, or usage-based pricing models and present as plans defined at the offer level. On the customer's Azure bill, Microsoft presents the publisher software license fees separately from the underlying Azure infrastructure fees. Azure infrastructure fees are driven by use of the publisher software.

- **Azure application: solution template or managed app** – Must provision one or more virtual machines and pulls through the sum of the virtual machine pricing. For managed apps on a single plan, a flat-rate monthly subscription can be selected as the pricing model instead the virtual machine pricing. In some cases, Azure infrastructure usage fees are passed to the customer separately from software license fees, but on the same billing statement. However, if you configure a managed app offering for ISV infrastructure charges, the Azure resources are billed to the publisher, and the customer receives a flat fee that includes the cost of infrastructure, software licenses, and management services.

- **SaaS application** - Must be a multitenant solution, use [Azure Active Directory](https://azure.microsoft.com/services/active-directory/) for authentication, and integrate with the [SaaS Fulfillment APIs](partner-center-portal/pc-saas-fulfillment-api-v2.md). Azure infrastructure usage is managed and billed directly to you (the partner), so you must account for Azure infrastructure usage fees and software licensing fees as a single cost item. For detailed guidance, see [Create a new SaaS offer in the commercial marketplace](./create-new-saas-offer.md).

## Next steps

- Review the eligibility requirements in the publishing options by offer type section to finalize the selection and configuration of your offer.
- Review the publishing patterns by online store for examples on how your solution maps to an offer type and configuration.