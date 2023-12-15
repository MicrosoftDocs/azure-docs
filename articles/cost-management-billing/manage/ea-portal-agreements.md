---
title: Azure EA agreements and amendments
description: This article explains how Azure EA agreements and amendments affect your Azure EA portal use.
author: bandersmsft
ms.author: banders
ms.date: 07/10/2023
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: enterprise
ms.reviewer: sapnakeshari
---

# Azure EA agreements and amendments

The article describes how Azure EA agreements and amendments might affect your access, use, and payments for Azure services.

## Enrollment provisioning status

The date that the regional operations center processes the new Azure Prepayment (previously called monetary commitment) defines the new start date. Since Azure Prepayment orders via the Azure portal are processed in the UTC time zone, you may experience some delay if your Azure Prepayment purchase order was processed in a different region. The coverage start date on the purchase order shows the start of the Azure Prepayment. The coverage start date is when the Azure Prepayment appears in the Azure portal.

## Support for enterprise customers

 The Azure [Enterprise Agreement Support Plan Offer](https://azure.microsoft.com/offers/enterprise-agreement-support/) is available for some customers.

## Enrollment status

An enrollment has one of the following status values. Each value determines how you can use and access an enrollment. The enrollment status determines at which stage your enrollment is. It tells you if the enrollment needs to be activated before it can be used. Or, if the initial period has expired and you're charged for usage overage.

**Pending** - The enrollment administrator needs to sign in to the Azure portal. After the administrator signs in, the enrollment switches to **Active** status.

**Active** - The enrollment is accessible and usable. You can create departments, accounts, and subscriptions in the [Azure portal](https://portal.azure.com). The enrollment remains active until the enterprise agreement end date. 

**Indefinite Extended Term** - Indefinite extended term status occurs after the enterprise agreement end date is reached and is expired. When an agreement enters into an extended term, it doesn't receive discounted pricing. Instead, pricing is at retail rates. Before the EA enrollment reaches the enterprise agreement end date, the Enrollment Administrator should decide to:

- Renew the enrollment by adding more Azure Prepayment
- Transfer the existing enrollment to a new enrollment
- Migrate to the Microsoft Online Subscription Program (MOSP)
- Confirm disablement of all services associated with the enrollment

EA credit expires when the EA enrollment ends for all programs except the EU program.

**Expired** - The EA enrollment expires when it reaches the enterprise agreement end date and is opted out of the extended term. Sign a new enrollment contract as soon as possible. Although your service isn't disabled immediately, there's a risk of it getting disabled.

As of August 1, 2019, new opt-out forms aren't accepted for Azure commercial customers. Instead, all enrollments go into indefinite extended term. If you want to stop using Azure services, close your subscription in the [Azure portal](https://portal.azure.com). Or, your partner can submit a termination request. There's no change for customers with government agreement types.

**Transferred** - Transferred status is applied to enrollments that have their associated accounts and services transferred to a new enrollment. Enrollments don't automatically transfer if a new enrollment number is generated during renewal. The prior enrollment number must be included in the customer's renewal request for an automatic transfer.

## Partner markup

In the Azure portal, Partner Price Markup helps to enable better cost reporting for customers. The Azure portal shows usage and prices configured by partners for their customers.

Markup allows partner administrators to add a percentage markup to their indirect enterprise agreements. Percentage markup applies to all Microsoft first party service information in the Azure portal such as: meter rates, Azure Prepayment, and orders. After the partner publishes the markup, the customer sees Azure costs in the Azure portal. For example, usage summary, price lists, and downloaded usage reports.

Starting in September 2019, partners can apply markup anytime during a term. They don't need to wait until the term next anniversary to apply markup.

Microsoft doesn't access or utilize the provided markup and associated prices for any purpose unless explicitly authorized by the channel partner.

### How the calculation works

The Licensing Solution Partners (LSP) provides a single percentage number in the Azure portal. All commercial information on the portal gets uplifted with the percentage provided by the LSP. Example:

- Customer signs an EA with Azure Prepayment of USD 100,000.
- The meter rate for Service A is USD 10 / Hour.
- LSP sets markup percentage of 10% on the EA Portal.
- The following example is how the customer sees the commercial information:
    - Monetary Balance: USD 110,000.
    - Meter rate for Service A: USD 11 / Hour.
    - Usage/hosting information for service A when used for 100 hours: USD 1,100.
    - Monetary Balance available to the customer post deduction of Service A consumption: USD 108,900.

### When to use a markup

Use the feature if you set the same markup percentage on *all* commercial transactions in the EA. For example, if you mark-up the Azure Prepayment information, the meter rates, the order information, and so on.

Don't use the markup feature if:
- You use different rates between Azure Prepayment and meter rates.
- You use different rates for different meters.

If you're using different rates for different meters, we recommend developing a custom solution based on the API key. The customer can provide the API key to pull consumption data and provide reports.

### Other important information

This feature is meant to provide an estimation of the Azure cost to the end customer. The LSP is responsible for all financial transactions with the customer under the EA.

Make sure to review the commercial information - monetary balance information, price list, etc. before publishing the marked-up prices to end customer.

#### Partner markup view limitations

- If the user has both Partner admin and EA admin role, the partner admin role takes precedence and prices are displayed without markup.
- If partners want to see the cost with markup and download reports with markup in they Azure portal, they should only have the EA admin role.
- The Partner admin sees prices without markup in the downloaded usage files. However, the Partner admin can download the Charges by service file that includes markup details.

#### Azure savings plan purchases

For [Azure Savings plan](../savings-plan/savings-plan-compute-overview.md) purchases, in some situations, indirect EA end customers could see minor variances in their utilization percentage when they view their [cost reports](../savings-plan/utilization-cost-reports.md) in Cost Management. Actual purchase and usage charges are always computed in partner prices and not in customer prices (for example, with markup). Subsequent markdown and uplift could result in floating point numbers exceeding eight decimal point precision. Azure rounds calculations to eight decimal precision, which can cause minor variances in the utilization numbers for end customers.

Let's look at an example. Assume that a customer enters an Azure Savings Plan commitment amount of 3.33/hour. If the markup is 13%, after the markdown to arrive at the partner price and the subsequent markup in the cost and usage reports, there's minor variance in numbers:

- Customer entered value: 3.33/hour
- Mark up: 13%
- Partner commitment calculated from customer value and rounded to eight decimal point precision: 2.94690265
- Final customer viewed commit (uplifting partner price): 3.32999999

### How to add a price markup

You can add price markup on Azure portal with the following steps:
 
1. In the Azure portal, sign in as a partner administrator.
1. Search for **Cost Management + Billing** and select it.
1. In the left navigation menu, select **Billing scopes** and then select the billing account that you want to work with.
1. In the left navigation menu, select **Billing Profile** and then select the billing profile that you want to work with.
1. In the left navigation menu, select **Markup**.
1. To add markup, select **Set markup**.
1. Enter the markup percentage and select **Preview**.
1. Review the credit and usage charges before and after markup update.
1. Accept the disclaimer and select **Publish** to publish the markup.
1. The customer can now view credits and charges details.

You can add price markup in the Azure Enterprise portal with the following steps:

#### First step - Add price markup

1. In the Enterprise Portal, select **Reports** in the left navigation menu.
1. Under _Usage Summary_, select the blue **Markup** link.
1. Enter the markup percentage (between 0 to 100) and select **Preview**.

#### Second step - Review and validate

Review the markup price in the _Usage Summary_ for the Prepayment term in the customer view. The Microsoft price is still available in the partner view. The views can be toggled using the partner markup **People** toggle at the top right.

1. Review the prices in the price sheet.
1. Changes can be made before publishing by selecting **Edit** on _View Usage Summary > Customer View_ tab.

Both the service prices and the Prepayment balances get marked up by the same percentages. If you have different percentages for monetary balance and meter rates, or different percentages for different services, then don't use this feature.

#### Third step - Publish

After pricing is reviewed and validated, select **Publish**.

Pricing with markup is available to enterprise administrators immediately after selecting publish. Edits can't be made to markup. You must disable markup and begin from the first step.

### Which enrollments have a markup enabled?

To check if an enrollment has a markup published, select **Manage** in the left navigation menu, then select the **Enrollment** tab. Select the enrollment box to check, and view the markup status under _Enrollment Detail_. It displays the current status of the markup feature for that EA as Disabled, Preview, or Published.

To check markup status of an enrollment on Azure portal, follow the below steps:

1. In the Azure portal, sign in as a partner administrator.
1. Search for **Cost Management + Billing** and select it.
1. Select **Billing scopes** and then select the billing account that you want to work with.
1. In the left navigation menu, select **Billing scopes** and then select the billing account that you want to work with.
1. In the left navigation menu, select **Billing Profile**.
1. You can view the markup status of an enrollment.

### How can the customer download usage estimates?

Once partner markup is published, the indirect customer has access to the balance and charge CSV monthly files and usage detail files. The usage detail files include the resource rate and extended cost.

### How can I as partner apply markup to existing EA customer(s) that was earlier with another partner?
Partners can use the markup feature (on Azure EA portal or Azure portal) after a Change of Channel Partner is processed; there's no need to wait for the next anniversary term.

## Resource Prepayment and requesting quota increases

**The system enforces the following default quotas per subscription:**

| **Resource** | **Default Quota** | **Comments** |
| --- | --- | --- |
| Microsoft Azure Compute Instances | 20 concurrent small compute instances or their equivalent of the other compute instance sizes. | The following table provides how to calculate the equivalent number of small instances:<ul><li> Extra Small - one equivalent small instance </li><li> Small - one equivalent small instance </li><li> Medium - two  equivalent small instances </li><li> Large - four  equivalent small instances </li><li> Extra Large - eight equivalent small instances </li> </ul>|
| Microsoft Azure Compute Instances v2 VMs | EA: 350 Cores | GA IaaS v2 VMs:<ul><li> A0\_A7 family - 350 cores </li><li> B\_A0\_A4 family - 350 cores </li><li> A8\_A9 family - 350 cores </li><li> DF family - 350 cores</li><li> GF - 350 cores </li></ul>|
| Microsoft Azure Hosted Services | six hosted services | This limit of hosted services can't be increased beyond six for an individual subscription. If you require more hosted services, add more subscriptions. |
| Microsoft Azure Storage | Five storage accounts, each of a maximum size of 100 TB each. | You can increase the number of storage accounts to up to 20 per subscription. If you require more storage accounts, add more subscriptions. |
| SQL Azure | 149 databases of either type (for example, Web Edition or Business Edition). |   |
| Access Control | 50 Namespaces per account. 100 million Access Control transactions per month |   |
| Service Bus | 50 Namespaces per account. 40 Service Bus connections | Customers purchasing Service Bus connections through connection packs have quotas equal to the midpoint between the connection pack they purchased and the next highest connection pack amount. Customers choosing a 500 Pack have a quota of 750. |

## Resource Prepayment

Microsoft provides services to you up to at least the level of the associated usage included in the monthly Prepayment that you purchased (the Service Prepayment). However, all other increases in usage levels of service resources are subject to the availability of these service resources. For example, adding to the number of compute instances running, or increasing the amount of storage in use.

Quotas described previously aren't Service Prepayment. You can determine the number of simultaneous small compute instances, or their equivalent, that Microsoft provides as part of a Service Prepayment. Divide the number of committed small compute instance hours purchased for a month by the number of hours in the shortest month of the year. For example, February – 672 hours.

## Requesting a quota increase

You can request a quota increase at any time by submitting an [online request](https://portal.azure.com/). To process your request, provide the following information:

- The Microsoft account or work or school account associated with the account owner of your subscription. It's the email address used to sign in to the Microsoft Azure portal to manage your subscription(s). Verify that the account is associated with an EA enrollment.
- The resource(s) and amount for which you desire a quota increase.
- The Azure Developer Portal Subscription ID associated with your service.
  - For information on how to obtain your subscription ID, [contact support](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview).

## Plan SKUs

Plan SKUs offer the ability to purchase a suite of integrated services together at a discounted rate. The Plan SKUs are designed to complement each other through further integrated offerings and suite for greater cost savings.

One example would be the Operations Management Suite (OMS) subscription. OMS offers a simple way to access a full set of cloud-based management capabilities. It includes analytics, configuration, automation, security, backup, and disaster recovery. OMS subscriptions include rights to System Center components to provide a complete solution for hybrid cloud environments.

Enterprise Administrators can assign Account Owners to prepare previously purchased Plan SKUs in the Enterprise portal by following these steps:

### View the price sheet to check included quantity

1. Sign in as an Enterprise Administrator.
1. Select **Reports** on the left navigation.
1. Select the **Price Sheet** tab.
1. Select the **Download** symbol in the top-right corner of the page.
1. Find the corresponding Plan SKU part numbers with filter on column **Included Quantity** and select values greater than 0 (zero).

EA customer can view price sheet in Azure portal. See [view price sheet in Azure portal](ea-pricing.md#download-pricing-for-an-enterprise-agreement).

### Existing/New account owners to create new subscriptions

**Step One: Sign in to account**
1. From the Azure EA Portal, select the **Manage** tab and navigate to **Subscription** on the top menu.
1. Verify that you're logged in as the account owner of this account.
1. Select **+Add Subscription**.
1. Select **Purchase**.

The first time you add a subscription to an account, you need to provide your contact information. When you add more subscriptions later, your contact information is populated for you.

The first time you add a subscription to your account, you're asked to accept the MOSA agreement and a Rate Plan. These sections aren't Applicable to Enterprise Agreement Customers, but are currently necessary to create your subscription. Your Microsoft Azure Enterprise Agreement Enrollment Amendment supersedes the above items and your contractual relationship doesn't change. Select the box indicating you accept the terms.

**Step Two: Update subscription name**

All new subscriptions are added with the default *Microsoft Azure Enterprise* subscription name. It's important to update the subscription name to differentiate it from the other subscriptions within your Enterprise Enrollment and ensure that it's recognizable on reports at the enterprise level.

Select **Subscriptions**, select the subscription you created, and then select **Edit Subscription Details.**

Update the subscription name and service administrator and select the checkmark. The subscription name appears on reports and it's also the name of the project associated with the subscription on the development portal.

New subscriptions may take up to 24 hours to propagate in the subscriptions list.

Only account owners can view and manage subscriptions.

Direct customer can create and edit subscription in Azure portal. See [manage subscription in Azure portal](direct-ea-administration.md#create-a-subscription).

### Troubleshooting

**Account owner showing in pending status**

When new Account Owners (AO) are added to the enrollment for the first time, they always have `pending` under status. When you receive the activation welcome email, the AO can sign in to activate their account. This activation updates their account status from `pending` to `active`.

**Usages being charged after Plan SKUs are purchased**

This scenario occurs when the customer has deployed services under the wrong enrollment number or selected the wrong services.

To validate if you're deploying under the right enrollment, you can check your included units information via the price sheet. Sign in as an Enterprise Administrator and select **Reports** on the left navigation and select **Price Sheet** tab. Select the Download symbol in the top-right corner and find the corresponding Plan SKU part numbers with filter on column **Included Quantity** and select values greater than "0."

Ensure that your OMS plan is showing on the price sheet under included units. If there are no included units for OMS plan on your enrollment, your OMS plan may be under another enrollment. Contact Azure Enterprise Portal Support at [https://aka.ms/AzureEntSupport](https://aka.ms/AzureEntSupport).

If the included units for the services on the price sheet don't match with what you have deployed, then you may have deployed services that aren't covered by the plan. For example, Operational Insights Premium Data Analyzed vs. Operational Insights Standard Data Analyzed. In this example, contact Azure Enterprise Portal Support at [https://aka.ms/AzureEntSupport](https://aka.ms/AzureEntSupport) so we can assist you further.

**Provisioned Plan SKU services on wrong enrollment**

If you have multiple enrollments and have deployed services under the wrong enrollment number, which doesn't have an OMS plan, contact Azure Enterprise Portal Support at [https://aka.ms/AzureEntSupport](https://aka.ms/AzureEntSupport).

## Next steps

- To start using the Azure EA portal, see [Get started with the Azure EA portal](ea-portal-get-started.md).
- Azure EA portal administrators should read [Azure EA portal administration](ea-portal-administration.md) to learn about common administrative tasks.
