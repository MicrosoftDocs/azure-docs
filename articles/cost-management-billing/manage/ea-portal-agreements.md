---
title: Azure EA agreements and amendments
description: This article explains how Azure EA agreements and amendments affect your Azure EA portal use.
author: bandersmsft
ms.author: banders
ms.date: 06/01/2020
ms.topic: conceptual
ms.service: cost-management-billing
ms.reviewer: boalcsva
---

# Azure EA agreements and amendments

The article describes how Azure EA agreements and amendments might affect your access, use, and payments for Azure services.

## Enrollment provisioning status

The start date of a new monetary commitment is defined by the date that the regional operations center processed it. Since monetary commitment orders via the Azure EA portal are processed in the UTC time zone, you may experience some delay if your monetary commitment purchase order was processed in a different region. The coverage start date on the purchase order at https://www.explore.ms shows the start of the monetary commitment. The coverage start date is when the monetary commitment appears in the Azure EA portal.

## Support for enterprise customers

 The Azure [Enterprise Agreement Support Plan Offer](https://azure.microsoft.com/offers/enterprise-agreement-support/) is available for some customers.

## Enrollment status

An enrollment has one of the following status values. Each value determines how you can use and access an enrollment. The enrollment status determines at which stage your enrollment is. It tells you if the enrollment needs to be activated before it can be used. Or, if the initial period has expired and you're charged for usage overage.

**Pending** - The enrollment administrator needs to sign in to the Azure EA portal. Once signed in, the enrollment switches to **Active** status.

**Active** - The enrollment is accessible and usable. You can create accounts and subscriptions in the Azure EA portal. The enrollment remains active until the enterprise agreement end date.

**Indefinite Extended Term** - Indefinite extended term status occurs after the enterprise agreement end date is reached. Before the EA enrollment reaches the enterprise agreement end date, the Enrollment Administrator should decide to:

- Renew the enrollment by adding additional Monetary Commitment
- Transfer the existing enrollment to a new enrollment
- Migrate to the Microsoft Online Subscription Program (MOSP)
- Confirm disablement of all services associated with the enrollment

**Expired** - The EA enrollment expires when it reaches the enterprise agreement end date. The EA customer is opted out of the extended term and all their services are disabled.

As of August 1, 2019, new opt-out forms aren't accepted for Azure commercial customers. Instead, all enrollments go into indefinite extended term. If you want to stop using Azure services, close your subscription in the [Azure portal](https://portal.azure.com). Or, your partner can submit a termination request at https://www.explore.ms. There's no change for customers with government agreement types.

**Transferred** - Transferred status is applied to enrollments that have their associated accounts and services transferred to a new enrollment. Enrollments don't automatically transfer if a new enrollment number is generated during renewal. The prior enrollment number must be included in the customer's renewal request for an automatic transfer.

## Partner markup

In the Azure EA portal, Partner Price Markup helps to enable better cost reporting for customers. The Azure EA portal shows usage and prices configured by partners for their customers.

Markup allows partner administrators to add a percentage markup to their indirect enterprise agreements. Percentage markup applies to all Microsoft first party service information in the Azure EA portal such as: meter rates, monetary commitments, and orders. After the markup is published by the partner, the customer sees Azure costs in the Azure EA portal. For example, usage summary, price lists, and downloaded usage reports.

Starting in September 2019, partners can apply markup anytime during a term. They don't need to wait until the term next anniversary to apply markup.

Microsoft won't access or utilize the provided markup and associated prices for any purpose unless explicitly authorized by the channel partner.

### How the calculation works

The LSP provides a single percentage number in the EA portal.  All commercial information on the portal will be uplifted by the percentage provided by the LSP. Example:

- Customer signs an EA with monetary commitment of USD 100,000.
- The meter rate for Service A is USD 10 / Hour.
- LSP sets markup percentage of 10% on the EA Portal.
- The example below is how the customer will see the commercial information:
    - Monetary Balance: USD 110,000.
    - Meter rate for Service A: USD 11 / Hour.
    - Usage/hosting information for service A when used for 100 hours: USD 1,100.
    - Monetary Balance available to the customer post deduction of Service A consumption: USD 108,900.

### When to use a markup

Use the feature if you set the same markup percentage on ALL commercial transactions in the EA. i.e. – if you mark-up the monetary commitment information, the meter rates, the order information, etc.

Don't use the markup feature if:
- You use different rates between monetary commitment and meter rates.
- You use different rates for different meters.

If you're using different rates for different meters, we recommend developing a custom solution based on the API Key, which can be provided by the customer, to pull consumption data and provide reports.

### Other important information

This feature is meant to provide an estimation of the Azure cost to the end customer. The LSP is responsible for all financial transactions with the customer under the EA.

Please make sure to review the commercial information - monetary balance information, price list, etc. before publishing the marked-up prices to end customer.

### How to add a price markup

**Step One: Add price markup**

1. From the Enterprise Portal, click **Reports** on the left navigation.
1. Under _Usage Summary_, click the blue **Markup** wording.
1. Enter the markup percentage (between -100 to 100) and click **Preview**.


**Step Two: Review and validate**

Review the markup price in the _Usage Summary_ for the commitment term in the customer view. The Microsoft price will still be available in the partner view. The views can be toggled using the partner markup "people" toggle at the top right.

1. Review the prices in the price sheet.
1. Changes can be made before publishing by selecting **Edit** on _View Usage Summary > Customer View_ tab.
   
Both the service prices and the commitment balances will be marked up by the same percentages. If you have different percentages for monetary balance and meter rates, or different percentages for different services, then please don't use this feature.

**Step Three: Publish**

After pricing is reviewed and validated, click **Publish**.
  
Pricing with markup will be available to enterprise administrators immediately after selecting publish. Edits can't be made to markup. You must disable markup and begin from Step One.

### Which enrollments have a markup enabled?

To check if an enrollment has a markup published, click **Manage** on the left navigation, and click on the **Enrollment** tab. Select the enrollment box to check, and view the markup status under _Enrollment Detail_. It will display the current status of the markup feature for that EA as Disabled, Preview, or Published.

### How can the customer download usage estimates?

Once partner markup is published, the indirect customer will have access to balance and charge .csv monthly files and usage detail .csv files. The usage detail files will include resource rate and extended cost.

### How can I as partner apply markup to existing EA customer(s) that was earlier with another partner?
Partners can use the markup feature (on Azure EA) after a Change of Channel Partner is processed; no need to wait for the next anniversary term.


## Resource commitment and requesting quota increases

**The system enforces the following default quotas per subscription:**

| **Resource** | **Default Quota** | **Comments** |
| --- | --- | --- |
| Microsoft Azure Compute Instances | 20 concurrent small compute instances or their equivalent of the other compute instance sizes. | The following table provides how to calculate the equivalent number of small instances:<ul><li> Extra Small - 1 equivalent small instance </li><li> Small - 1 equivalent small instance </li><li> Medium - 2 equivalent small instances </li><li> Large - 4 equivalent small instances </li><li> Extra Large - 8 equivalent small instances </li> </ul>|
| Microsoft Azure Compute Instances v2 VM's | EA: 350 Cores | GA IaaS v2 VMs:<ul><li> A0\_A7 family - 350 cores </li><li> B\_A0\_A4 family - 350 cores </li><li> A8\_A9 family - 350 cores </li><li> DF family - 350 cores</li><li> GF - 350 cores </li></ul>|
| Microsoft Azure Hosted Services | 6 hosted services | This limit of hosted services cannot be increased beyond six for an individual subscription. If you require additional hosted services, please add additional subscriptions. |
| Microsoft Azure Storage | 5 storage accounts, each of a maximum size of 100 TB each. | You can increase the number of storage accounts to up to 20 per subscription. If you require additional storage accounts, please add additional subscriptions. |
| SQL Azure | 149 databases of either type (i.e., Web Edition or Business Edition). |   |
| Access Control | 50 Namespaces per account. 100 million Access Control transactions per month |   |
| Service Bus | 50 Namespaces per account. 40 Service Bus connections | Customers purchasing Service Bus connections through connection packs will have quotas equal to the midpoint between the connection pack they purchased and the next highest connection pack amount. Customers choosing a 500 Pack will have a quota of 750. |

## Resource commitment

Microsoft will provide services to you up to at least the level of the associated usage included in the monthly commitment that you purchased (the Service Commitment), but all other increases in usage levels of service resources (e.g. adding to the number of compute instances running, or increasing the amount of storage in use) are subject to the availability of these service resources.

Any quota described above is not a Service Commitment. For purposes of determining the number of simultaneous small compute instances (or their equivalent) that Microsoft will provide as part of a Service Commitment, this is determined by dividing the number of committed small compute instance hours purchased for a month by the number of hours in the shortest month of the year (i.e., February – 672 hours).

## Requesting a quota increase

You can request a quota increase at any time by submitting an [online request](https://g.microsoftonline.com/0WAEP00en/6). To process your request, provide the following information:

- The Microsoft account or work or school account associated with the account owner of your subscription. This is the email address utilized to sign in to the Microsoft Azure portal to manage your subscription(s). Please also identify that this account is associated with an EA enrollment.
- The resource(s) and amount for which you desire a quota increase.
- The Azure Developer Portal Subscription ID associated with your service.
  - For information on how to obtain your subscription ID, please [contact support](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview).

## Plan SKUs

Plan SKUs offer the ability to purchase a suite of integrated services together at a discounted rate. The Plan SKUs are designed to complement each other through further integrated offerings and suite for greater cost savings.

One example would be the Operations Management Suite (OMS) subscription. OMS offers a simple way to access a full set of cloud-based management capabilities, including analytics, configuration, automation, security, backup, and disaster recovery. OMS subscriptions include rights to System Center components to provide a complete solution for hybrid cloud environments.

Enterprise Administrators can assign Account Owners to provision previously purchased Plan SKUs in the Enterprise Portal by following these steps:

### View the price sheet to check included quantity

1. Sign in as an Enterprise Administrator.
1. Click **Reports** on the left navigation.
1. Click the **Price Sheet** tab.
1. Click the 'Download' icon in the top-right corner.
1. Find the corresponding Plan SKU part numbers with filter on column "Included Quantity" and select values greater than "0".

### Existing/New account owners to create new subscriptions

**Step One: Sign in to account**
1. From the Azure EA Portal, select the **Manage** tab and navigate to **Subscription** on the top menu.
1. Verify that you're logged in as the account owner of this account.
1. Click **+Add Subscription**.
1. Click **Purchase**.

The first time you add a subscription to an account, you'll need to provide your contact information. When adding later subscriptions, your contact information will be populated for you.

The first time you add a subscription to your account, you'll be asked to accept the MOSA agreement and a Rate Plan. These sections are NOT Applicable to Enterprise Agreement Customers, but are currently necessary to provision your subscription. Your Microsoft Azure Enterprise Agreement Enrollment Amendment supersedes the above items and your contractual relationship won't change. Please check the box indicating you accept the terms.

**Step Two: Update subscription name**

All new subscriptions will be added with the default "Microsoft Azure Enterprise" subscription name. It's important to update the subscription name to differentiate it from the other subscriptions within your Enterprise Enrollment and ensure that it's recognizable on reports at the enterprise level.

Click **Subscriptions**, click on the subscription you created, and then click **Edit Subscription Details.**

Update the subscription name and service administrator and click on the checkmark. The subscription name will appear on reports and it will also be the name of the project associated with the subscription on the development portal.
New subscriptions may take up to 24 hours to propagate in the subscriptions list.

Only account owners can view and manage subscriptions.

### Troubleshooting

**Account owner showing in pending status**

When new Account Owners (AO) are added to the enrollment for the first time, they'll always show as "pending" under status. Upon receiving the activation welcome email, the AO can sign in to activate their account. This activation will update their account status from "pending" to "active".

**Usages being charged after Plan SKUs are purchased**

This scenario occurs when the customer has deployed services under the wrong enrollment number or selected the wrong services.

To validate if you're deploying under the right enrollment, you can check your included units information via the price sheet. Please sign in as an Enterprise Administrator and click on **Reports** on the left navigation and select **Price Sheet** tab. Click the Download icon in the top-right corner and find the corresponding Plan SKU part numbers with filter on column "Included Quantity" and select values greater than "0".

Ensure that your OMS plan is showing on the price sheet under included units. If there are no included units for OMS plan on your enrollment, your OMS plan may be under another enrollment. Please contact Azure Enterprise Portal Support at [https://aka.ms/AzureEntSupport](https://aka.ms/AzureEntSupport).

If the included units for the services on the price sheet don't match with what you have deployed, e.g. Operational Insights Premium Data Analyzed vs. Operational Insights Standard Data Analyzed, it means that you may have deployed services that are not covered by the plan, please contact Azure Enterprise Portal Support at [https://aka.ms/AzureEntSupport](https://aka.ms/AzureEntSupport) so we can assist you further.

**Provisioned Plan SKU services on wrong enrollment**

If you have multiple enrollments and have deployed services under the wrong enrollment number, which doesn't have an OMS plan, please contact Azure Enterprise Portal Support at [https://aka.ms/AzureEntSupport](https://aka.ms/AzureEntSupport).

## Next steps

- To start using the Azure EA portal, see [Get started with the Azure EA portal](ea-portal-get-started.md).
- Azure EA portal administrators should read [Azure EA portal administration](ea-portal-administration.md) to learn about common administrative tasks.
