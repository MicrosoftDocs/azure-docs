---
title: Seller Insights Definitions | Microsoft Docs
description: Provides definitions for many of the terms you will find in Seller Insights..
services: Azure, Marketplace, Cloud Partner Portal, 
documentationcenter:
author: v-miclar
manager: Patrick.Butler  
editor:

ms.assetid: 
ms.service: marketplace
ms.workload: 
ms.tgt_pltfrm: 
ms.devlang: 
ms.topic: conceptual
ms.date: 09/13/2018
ms.author: pbutlerm
---

Seller Insights Definitions
=======================

The following table provides definitions for many of the terms used in Seller Insights.

|  **Term**                                        |  **Definition**                                                                                                                              |
|  --------------------------------------------    |  ---------------------------------------------------------------------------------------------------------------------------------           |
| Azure License Type                               | The type of licensing agreement used by customers to purchase Azure. Also known as Channel.                                                  |
| Azure License Type: Cloud Solution Provider      | The end customer procures Azure and your Marketplace offer through their Cloud Solution Provider, who acts as your reseller.                 |
| Azure License Type: Enterprise                   | The end customer procures Azure and your Marketplace offer through an Enterprise Agreement, signed directly with Microsoft.                  |
| Azure License Type: Enterprise through Reseller  | The end customer procures Azure and your Marketplace offer through a Reseller who facilitates their Enterprise Agreement with Microsoft.     |
| Azure License Type: Pay as You Go                | The end customer procures Azure and your Marketplace offer through a Pay as You Go agreement, signed directly with Microsoft.                |
| Azure Subscription GUID                          | The Global Unique Identifier (GUID) of the Azure subscription that the customer used to purchase your Marketplace offer.                     |
| Charge Amount (CC)                               | The amount charged to the customer, in the customer's billing currency (CC).                                                                 |
| Charge Amount (PC)                               | The amount charged to the customer, in the *Payout Currency (PC)*.                                                                      |
| Charge Date                                      | The date the customer's charge was calculated, typically immediately following the usage period.                                             |
| Cloud Instance Name                              | The Microsoft Cloud in which a VM deployment occurred. (Azure Gov - Microsoft Cloud instance for the US Government; Azure China - Microsoft Cloud instance within China; Azure Germany - Microsoft Cloud instance within Germany; Azure Global - Microsoft Cloud instances for all other Global locations)                                                          |
| Custom Meter Usage                               | Measured units being consumed on custom meter offers.                                                                                        |
| Customer                                         | Any Azure customer or end user who acquires, makes use of, or otherwise views an offer published through the Marketplace. Customers are identifiable by unique *Azure Subscription GUID*.                                                                                                                                                                        |
| Customer City                                    | The city name provided by the end customer.                                                                                                  |
| Customer Communication Language                  | The language preferred by the customer for communication.                                                                                    |
| Customer Company Name                            | The company name provided by the end customer.                                                                                               |
| Customer Country                                 | The country name provided by the end customer.                                                                                               |
| Customer Currency (CC)                           | The currency preferred by the customer for pricing and billing.                                                                              |
| Customer Email                                   | The email address provided by the end customer.                                                                                              |
| Customer First Name                              | The first name of the customer.                                                                                                              |
| Customer Last Name                               | The last name of the customer.                                                                                                               |
| Customer Payment Type                            | The type of payment instrument used by the customer.                                                                                         |
| Customer Postal Code                             | The postal code provided by the end customer.                                                                                                |
| Customer State                                   | The state provided by the end customer.                                                                                                      |
| Date Acquired                                    | The first date the Azure subscription purchased any offer published by you.                                                                  |
| Date Lost                                        | The date the Azure subscription canceled all offer(s) published by you.                                                                     |
| Estimated Extended Charge (CC)                   | The estimated extended charge for the quantity of units of usage for a given SKU (in the customer’s currency). This value may not be exact due to rounding or truncation errors.                                                                                                                                                                                           |
| Estimated Extended Charge (PC)                   | The estimated extended charge for the quantity of units of usage for a given SKU based on foreign exchange conversion on the date usage is calculated (in the publisher’s currency). This value may not be exact due to rounding or truncation errors.                                                                                                                |
| Estimated Payout (PC)                            | The estimated payment for the quantity of units of usage for a given SKU based on foreign exchange conversion on the date the usage is calculated (in the publisher’s currency). This value may not be exact due to rounding or truncation errors.                                                                                                                |
| Estimated Price (PC)                             | The estimated price for a unit of usage for a given SKU based on foreign exchange conversion on the date usage is calculated (in the publisher’s currency). This value may not be exact due to rounding or truncation errors.                                                                                                                                            |
| Final Collection Status                          | For a specific charge, the latest status of the billing and collection lifecycle. This could be: *Collection in Progress*, *Collected*, *Paid Out*, *Refund,* or *Write Off*.                                                                                                                                                                                      |
| Final Collection Status: Collected               | The charge was collected.                                                                                                                    |
| Final Collection Status: Collection In Progress  | The charge has not yet been collected from the customer. Microsoft Azure billing is still billing or collecting from the customer.             |
| Final Collection Status: Refund                  | The charge was refunded (either the entire charge or a partial amount).                                                                      |
| Final Collection Status: Write Off               | The charge was written off as bad debt.                                                                                                      |
| IsNew Customer                                   | The customer deployed this *SKU* for the first time within the calendar month.                                                               |
| Market                                           | The country name provided by the end customer.                                                                                               |
| Marketplace License Type                         | The billing method of the Marketplace offer.                                                                                                 |
| Marketplace License Type: Billed Through Azure   | Microsoft is your agent for this Marketplace offer and bills customers on your behalf. (Either PAYG Credit Card or Enterprise Invoice)       |
| Marketplace License Type: Bring Your Own License | The VM requires a license key provided by the customer in order to deploy. Microsoft does not bill customers for their usage of this Marketplace offers. |
| Marketplace License Type: Free                   | The Marketplace offer is configured to be free to all users. Microsoft does not bill customers for their usage of this Marketplace offer.    |
| Marketplace License Type: Microsoft as Reseller  | Microsoft is your reseller for this Marketplace offer.                                                                                       |
| Marketplace Order                                | For VMs, a Marketplace order represents the deployment of one or many VMs tied to a single *SKU* on a unique Azure Subscription. A single Marketplace order can represent many deployments with variable core sizes. For Managed Applications and Dev Services, a Marketplace order represents a single *SKU* purchase by an *Azure Subscription GUID*.           |
| Microsoft Fee (CC)                               | The Microsoft fee on the transaction in customer's currency.                                                                                 |
| Normalized Usage                                 | Usage hours normalized to account for the number of VM cores involved in the usage: [Number of VM Cores] x [Hours of Raw Usage]. VMs designated as "SHAREDCORE" use 1/6 (or 0.1666) as the [Number of VM Cores] multiplier.                                                                                                                                       |
| Offer Name                                       | The name of the Marketplace offer.                                                                                                           |
| Offer Type                                       | The type of solution.                                                                                                                        |
| Offer Type: Custom Meter Solution                | The customer deployed your custom metered solution from the Marketplace.                                                                     |
| Offer Type: Managed Application                  | The customer purchased a subscription to your managed service application.                                                                   |
| Offer Type: Single VM                            | The customer deployed an image by selecting a single VM.                                                                                     |
| Offer Type: Solution Template                    | The customer deployed your solution template.                                                                                                |
| Order Cancel Date                                | The date the Marketplace order was canceled.                                                                                                 |
| Order Count                                      | The number of orders (active and canceled) this specific *Azure Subscription GUID* has of any of your offers.                               |
| Order Purchase Date                              | The date the *Marketplace Order* was created. For VMs, this is the first date that your image was deployed to the customer's Azure subscription. Subsequent deployments of that same image to the same Azure subscription are all considered one order.                                                                                                       |
| Order Status                                     | The status of a Marketplace order at the time the data was last refreshed.                                                                   |
| Order Status: Active                             | For managed applications, the order is active. For VMs, the customer has at least one deployment of the image on their Azure subscription.   |
| Order Status: Canceled                          | For managed applications, the order has been canceled. For VMs, the customer has deleted all deployments of the *SKU* from their Azure subscription.        |
| OrderID                                          | The unique identifier of the order. For managed applications, the customer has purchased a monthly subscription to your service. For VMs, the customer has deployed your image. Subsequent deployments of that same image to the same Azure subscription are all considered one order.                                                                       |
| Payment Type: Card                               | The customer pays for their Marketplace charges with a credit card.                                                                          |
| Payment Type: Invoice                            | The customer pays for their Marketplace charges via invoice.                                                                                 |
| Payout Amount (PC)                               | The amount paid to you, in your preferred *Payout Currency (PC)*.                                                                            |
| Payout Currency (PC)                             | The currency used for your payouts.                                                                                                          |
| Payout Date                                      | The date the payment request was sent from Microsoft to your bank.                                                                           |
| Payout Status                                    | Indicates where the transaction is in the payout lifecycle: *Paid Out*, *Upcoming Payout*, or *Not Ready for Payout*.                        |
| Payout Status: Not Ready for Payout              | The transaction is not ready for payout. (See *Final Collection Status* for more details)                                                    |
| Payout Status: Paid Out                          | The transaction was included in a past payout calculation. Positive values are paid, and negative values are netted against total amount due. |
| Payout Status: Upcoming Payout                   | The transaction is ready for payout and will be included in the next available payout calculation.                                           |
| Preview SKU                                      | You have tagged the *SKU* as "preview," and only Azure subscriptions whitelisted by you can deploy and use this image.                       |
| Price (CC)                                       | The price for a unit of usage for a given SKU (in the customer's currency).                                                                  |
| Promotional Contact Opt In                       | Indicates whether the customer proactively opted in for promotional contact from publishers. At this time, we are not presenting the option to customers, so we have indicated "No" across the board. Once this feature is deployed, we will start updating accordingly.                                                                                          |
| Publisher Currency (PC)                          | The currency preferred by the publisher for payout.                                                                                          |
| Raw Usage                                        | Usage hours for your Marketplace offer.                                                                                                      |
| Reseller Email                                   | The email address of the reseller involved in the sale to the end customer.                                                                  |
| Reseller Name                                    | The name of the Microsoft reseller managing the end customer.                                                                                |
| Resource URI                                     | A unique identifier for individual VMs or developer services deployments.                                                                    |
| SKU                                              | *SKU* name as defined during publishing. An offer may have many *SKUs,* but a *SKU* can only be associated with a single offer.              |
| SKU Billing Type                                 | The billing method of the *SKU*.                                                                                                             |
| SKU Billing Type: BYOL                           | The VM requires a license key provided by the customer in order to deploy. Microsoft does not bill customers for their usage of this Marketplace offers.   |
| SKU Billing Type: Free                           | The *SKU* is configured to be free to all users. Microsoft does not bill customers for their usage of this *SKU.*                            |
| SKU Billing Type: Microsoft as Reseller          | Microsoft is your reseller for this *SKU.*                                                                                                   |
| SKU Billing Type: Paid                           | Microsoft is your agent for this *SKU* and bills customers on your behalf. (Either PAYG Credit Card or Enterprise Invoice)                   |
| SKU Billing Type: Trial                          | The customer is in their trial period and will be converted to paid if they do not cancel or delete.                                         |
| Tax Amount (CC)                                  | The tax amount applied to the customer's bill in the *Customer Currency (CC)*.                                                               |
| Transaction Date                                 | The date of the transaction recorded in your payout reporting.                                                                               |
| Transaction Type                                 | The type of transaction that is being reported.                                                                                              |
| Transaction Type: Charge                         | The transaction is a positive value representing the amount charged to the customer.                                                         |
| Transaction Type: Customer Refund                | The customer's charge was refunded. This transaction is a negative value equal to the amount of the customer's positive charge. You can identify the corresponding positive value, which was previously paid by identifying the transaction with the same *Charge Date* and *Transaction Type* = "Charge" and *Final Collection Status* = "Refund."                   |
| Transaction Type: Payout Adjustment              | The transaction represents a positive or negative adjustment applied to your balance by Microsoft, created to account for a previous billing or payout error.                                                                                                                                                                                            |
| Transaction Type: Write off                      | The customer's charge was written off to bad debt. This transaction is a negative value equal to the amount of the customer's positive charge. You can identify the corresponding positive value that was previously paid by identifying the transaction with the same *Charge Date* and *Transaction Type* = "Charge" and *Final Collection Status* = "Write Off." |
| Transaction Type: Write off reversal             | The transaction is a positive value representing a reversal of a previously written off transaction.                                         |
| Trial End Date                                   | The date the trial period for this order will end or has ended.                                                                              |
| Usage                                            | The reported customer usage of the *SKU.* For VM Images, usage records represent the usage for the reported period for that VM size and *SKU*.   |
| Usage End Date                                   | The end date of the usage period being reported.                                                                                             |
| Usage Date                                       | The date customer usage occurred.                                                                                                             |
| Usage Reference                                  | The identifier for one or more days of customer usage for a given SKU associated with an entry in the payout report.                         |
| Usage Start Date                                 | The start date of the usage period being reported.                                                                                           |
| Usage Type                                       | A description of the usage being measured. (*Normalized Usage* or *Raw Usage*)                                                               |
| Usage Units                                      | The unit of measurement for the stated usage. VMs are always measured with hourly units of measurement.                                      |
| VM Size                                          | Represents the virtual machine hardware size aligned with the Azure offering. Examples include `Basic_A0`, `Standard_A11`, `Standard_D12`, and `Standard_G4`.   |
|  |  |


