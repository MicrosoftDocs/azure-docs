---
title: Microsoft commercial marketplace transact capabilities
description: This article describes pricing, billing, invoicing, and payout considerations for the commercial marketplace transact option.
author: dsindona
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 06/15/2020
ms.author: dsindona

---
# Commercial marketplace transact capabilities

## Transactions by publishing option

Either the publisher or Microsoft is responsible for managing software license transactions for offers in the commercial marketplace. The publishing option you choose for your offer will determine who manages the transaction. See [Determine your publishing option](./determine-your-listing-type.md#choose-a-publishing-option) for availability and explanations of each publishing option.

### List, trial, and BYOL publishing options

Publishers with existing commerce capabilities can choose list, trial, and bring-your-own-license (BYOL) publishing options for promotional and user acquisition purposes. With these options, Microsoft doesn't participate directly in the publisher's software license transactions and there's no associated transaction fee. Publishers are responsible for supporting all aspects of the software license transaction, including but not limited to order, fulfillment, metering, billing, invoicing, payment, and collection. With the list and trial publishing options, publishers keep 100% of publisher software licensing fees collected from the customer.

### Transact publishing option

The transact publishing option takes advantage of Microsoft commerce capabilities and provides an end-to-end experience from discovery and evaluation to purchase and implementation. Transact offers are billed against an existing Microsoft subscription or a credit card, allowing Microsoft to host cloud marketplace transactions on behalf of the publisher.

You choose the transact option when you create a new offer in Partner Center. On the **Offer setup** page under **Setup details**, select "Yes, I would like to sell through Microsoft and have Microsoft host transactions on my behalf." This option will show only if transact is available for your offer type.

## Transact overview

When using the transact publishing option, Microsoft enables the sale of third-party software and deployment of some offer types to the customer's Azure subscription. You the publisher must consider the billing of infrastructure fees and your own software licensing fees when selecting a billing model and offer type.

The transact publishing option is currently supported for the following offer types:

- Virtual machines
- Azure applications
- SaaS applications

### Billing infrastructure costs

For **virtual machines** and **Azure applications**, Azure infrastructure usage fees are billed to the customer's Azure subscription. Infrastructure usage fees are priced and presented separately from the software provider's licensing fees on the customer's invoice.

For **SaaS Apps**, you the publisher must account for Azure infrastructure usage fees and software licensing fees as a single cost item.  It is represented as a flat fee to the customer. The Azure infrastructure usage is managed and billed to the partner directly. Actual infrastructure usage fees are not seen by the customer. Publishers typically opt to bundle Azure infrastructure usage fees into their software license pricing. Software licensing fees aren't metered or consumption based.

## Transact billing models

Depending on the transaction option used, software license fees are as follows:

- **Free** – No charge for software licenses.
- **Bring your own license** (BYOL) – Any applicable charges for software licenses are managed directly between the publisher and customer. Microsoft only passes through Azure infrastructure usage fees. This applies to virtual machines and Azure applications only.
- **Pay-as-you-go** – Software license fees are presented as a per-hour, per-core (vCPU) pricing rate based on the Azure infrastructure used. This applies to virtual machines and Azure applications only.
- **Subscription pricing** – Software license fees are presented as a monthly or annual, recurring fee billed as a flat rate or per-seat. This applies to SaaS apps (monthly or annual) and Azure applications - managed apps (monthly) only.
- **Free software trial** – No charge for software licenses for 30 or 90 days.

### Free and bring-your-own-license (BYOL) pricing

When publishing a free or bring-your-own-license transaction offer, Microsoft does not play a role in facilitating the sales transaction for your software license fees. Like the list and trial publishing options, the publisher keeps 100% of software license fees.

### Pay-as-you-go and subscription (site-based) pricing

When publishing a pay-as-you-go or subscription transaction offer, Microsoft provides the technology and services to process software license purchases, returns, and chargebacks. In this scenario, the publisher authorizes Microsoft to act as an agent for these purposes. The publisher allows Microsoft to facilitate the software licensing transaction, while retaining their designation as the seller, provider, distributor, and licensor.

Microsoft enables customers to order, license, and use your software, subject to the terms and conditions of both Microsoft's commercial marketplace and your end-user licensing agreement. You must provide your own end-user licensing agreement or select the [Standard Contract](./standard-contract.md) when creating the offer.

### Free software trials

For transact publishing scenarios, you can make a software license available free for 30 or 90 days. This discounting capability does not include the cost of Azure infrastructure usage driven by use of the partner solution.

### Private offers

In addition to using offer types and billing models to monetize an offer, you can transact a private offer, complete with negotiated, deal-specific pricing, or custom configurations. Private offers are supported by all three transact publishing options.

This option allows higher or lower pricing than the publicly available offering. Private offers can be used to discount or add a premium to an offer. Private offers can be made available to one or more customers by white-listing their Azure subscription at the offer level.

### Examples

**Pay-As-You-Go** 

Pay-As-You-Go has the following cost structure:

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

Partners who have qualified for the Reduced Marketplace Service Fee will see a reduced transaction fee on the SaaS offers from May 2019 until June 2020.

In this scenario, Microsoft bills $100.00 for your software license and pays out $90.00 to the publisher:

|Microsoft bills  | $100.00 per month  |
|---------|---------|
|Microsoft pays you 80% of your license cost <br> \* Microsoft pays you 90% of your license cost for any qualified SaaS apps   |   $80.00 per month <br> \* $90.00 per month    |
|Microsoft keeps 20% of your license cost <br> \* Microsoft keeps 10% of your license cost for any qualified SaaS apps.  |  $20.00 per month <br> \* $10.00     |

For certain SaaS products that you publish on the commercial marketplace, Microsoft will reduce its **Marketplace Service Fee** from 20% (as described in the Microsoft Publisher Agreement) to 10%. For your offer to qualify, at least one of your offers must be designated by Microsoft as either IP co-sell ready or IP co-sell prioritized. To receive this reduced Marketplace Service Fee for the month, eligibility must be met at least five business days before the end of the previous calendar month. Reduced Marketplace Service fee will not apply to VMs, managed apps, or any other products made available through the commercial marketplace. This reduced fee will be available to qualified offers, with license charges collected by Microsoft between May 1, 2019 and June 30, 2020. After that time, the fee will return to its normal amount.

### Customer invoicing, payment, billing, and collections

**Invoicing and payment** – You can use the customer's preferred invoicing method to deliver subscription or PAYGO software license fees.

**Enterprise Agreement** – If the customer's preferred invoicing method is the Microsoft Enterprise Agreement, your software license fees will be billed using this invoicing method as an itemized cost, separate from any Azure-specific usage costs.

**Credit cards and monthly invoice** – Customers can also pay using a credit card and a monthly invoice. In this case, your software license fees will be billed just like the Enterprise Agreement scenario, as an itemized cost, separate from any Azure-specific usage costs.

**Free credits and monetary commitment** – Some customers elect to prepay Azure with a monetary commitment in the Enterprise Agreement or have been provided free credits for use with Azure. Although these credits can be used to pay for Azure usage, they can't be used to pay for publisher software license fees.

**Billing and collections** – Publisher software license billing is presented using the customer selected method of invoicing and follows the invoicing timeline. Customers without an Enterprise Agreement in place are billed monthly for marketplace software licenses. Customers with an Enterprise Agreement are billed monthly via an invoice that is presented quarterly.

When subscription or Pay-as-You-Go pricing models are selected, Microsoft acts as the agent of the publisher and is responsible for all aspects of billing, payment, and collection.

### Publisher payout and reporting

Any software licensing fees collected by Microsoft as an agent are subject to a 20% transaction fee unless otherwise specified and are deducted at the time of publisher payout.

Customers typically purchase using the Enterprise Agreement or a credit-card enabled pay-as-you-go agreement. The agreement type determines billing, invoicing, collection, and payout timing.

>[!NOTE]
>All reporting and insights for the transact publishing option are available via the Analytics section of Partner Center.

#### Billing questions and support

For more information and legal policies, see the [Publisher Agreement](https://query.prod.cms.rt.microsoft.com/cms/api/am/binary/RE3ypvt) (available in Partner Center).

For help on billing questions, contact [commercial marketplace publisher support](https://aka.ms/marketplacepublishersupport).

## Transact requirements

This section covers transact requirements for different offer types.

### Requirements for all offer types

- A Microsoft account and financial information are required for the transact publishing option, regardless of the offer's pricing model.
- Mandatory financial information includes payout account and tax profile.

For more information on setting up these accounts, see [Manage your commercial marketplace account in Partner Center](https://docs.microsoft.com/azure/marketplace/partner-center-portal/manage-account)).

### Requirements for specific offer types

The transact publishing option is only available for use with the following marketplace offer types:

- **Virtual machine** – Select from free, bring-your-own-license, or pay-as-you-go-pricing models and present as SKUs defined at the offer level. On the customer's Azure bill, Microsoft presents the publisher software license fees separately from the underlying Azure infrastructure fees. Azure infrastructure fees are driven by use of the publisher software.

- **Azure application: solution template or managed app** – Must provision one or more virtual machines and pulls through the sum of the virtual machine pricing. For managed apps on a single plan, a flat-rate monthly subscription can be selected as the pricing model instead the virtual machine pricing. In some cases, Azure infrastructure usage fees are passed to the customer separately from software license fees, but on the same billing statement. However, if you configure a managed app offering for ISV infrastructure charges, the Azure resources are billed to the publisher, and the customer receives a flat fee that includes the cost of infrastructure, software licenses, and management services.

- **SaaS application** - Must be a multitenant solution, use [Azure Active Directory](https://azure.microsoft.com/services/active-directory/) for authentication, and integrate with the [SaaS Fulfillment APIs](partner-center-portal/pc-saas-fulfillment-api-v2.md). Azure infrastructure usage is managed and billed directly to you (the partner), so you must account for Azure infrastructure usage fees and software licensing fees as a single cost item. For detailed guidance, see [Create a new SaaS offer in the commercial marketplace](partner-center-portal/create-new-saas-offer.md).

## Next steps

- Review the eligibility requirements in the publishing options by offer type section to finalize the selection and configuration of your offer.
- Review the publishing patterns by storefront for examples on how your solution maps to an offer type and configuration.
