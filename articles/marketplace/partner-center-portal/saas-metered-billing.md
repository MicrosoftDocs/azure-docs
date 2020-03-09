---
title: Metered billing using the marketplace metering service | Azure Marketplace
description: This documentation is a guide for ISVs publishing SaaS offers with flexible billing models. 
author: MaggiePucciEvans 
manager: evansma
ms.author: evansma 
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 07/10/2019
---

# Metered billing using the marketplace metering service

With the Marketplace metering service, you can create software-as-a-service (SaaS) offers in the commercial marketplace program that are charged according to non-standard units.  Before publishing this offer, you define the billing dimensions such as bandwidth, tickets, or emails processed.  Customers then pay according to their consumption of these dimensions, with your system informing Microsoft via the Marketplace metering service API of billable events as they occur.  

## Prerequisites for metered billing

In order for a SaaS offer to use metered billing, it must:

* Meet all of the offer requirements for a [sell through Microsoft offer](https://docs.microsoft.com/azure/marketplace/partner-center-portal/create-new-saas-offer#sell-through-microsoft) as outlined in [Create a SaaS offer](https://docs.microsoft.com/azure/marketplace/partner-center-portal/create-new-saas-offer).
* Integrate with the [SaaS Fulfillment APIs](https://docs.microsoft.com/azure/marketplace/partner-center-portal/pc-saas-fulfillment-api-v2) for customers to provision and connect to your offer.  
* Be configured for the **flat rate** pricing model for charging customers for your service.  Dimensions are an optional extension to the flat rate pricing model. 
* Integrate with the [Marketplace metering service APIs](./marketplace-metering-service-apis.md) to inform Microsoft of billable events.

>[!Note]
>Marketplace metering service is available only to the flat rate billing model, and does not apply to the per user billing model.

## How metered billing fits in with pricing

When it comes to defining the offer along with its pricing models, it is important to understand the offer hierarchy.

* Each SaaS offer is configured to sell either through Microsoft or not.  This setting cannot be changed after an offer is published.
* Each SaaS offer, configured to sell through Microsoft, can have one or more plans. A user subscribes to the SaaS offer, but it is purchased through Microsoft within the context of a plan.
* Each plan has a pricing model associated with it: **flat rate** or **per user**. All plans in an offer must be associated with the same pricing model. For example, there cannot be an offer where one of its plans is flat rate pricing model, and another is per user pricing model.
* Within each plan configured for a flat rate billing model, at least one recurring fee (which can be $0) is included:
    * Recurring **monthly** fee: flat monthly fee that is pre-paid on a monthly recurrence when user purchases the plan.
    * Recurring **annual** fee: flat annual fee that is pre-paid on an annual recurrence when user purchases the plan.
* In addition to the recurring fees, the plan can also include optional dimensions used to charge customers for usage not included in the flat rate.   Each dimension represents a billable unit that your service will communicate to Microsoft using the [Marketplace metering service API](./marketplace-metering-service-apis.md).

## Sample offer

As an example, Contoso is a publisher with a SaaS service called Contoso Notification Services (CNS). CNS allows customers to send notifications either via email or text. Contoso is registered as a publisher in Partner Center for the commercial marketplace program to publish offers to Azure customers.  There are two plans associated with CNS, outlined below:

* Base plan
    * Send 10000 emails and 1000 texts for $0/month
    * Beyond the 10000 emails, pay $1 for every 100 emails
    * Beyond the 1000 texts, pay $0.02 for every text
* Premium plan
    * Send 50000 emails and 10000 texts for $350/month
    * Beyond the 50000 emails, pay $0.5 for every 100 emails
    * Beyond the 10000 texts, pay $0.01 for every text

An Azure customer subscribing to CNS service will be able to send the included quantity of text and emails per month based on the plan selected.  Contoso measures the usage up to the included quantity without sending any usage events to Microsoft.  When customers consume more than the included quantity, they do not have to change plans or do anything different.  Contoso will measure the overage beyond the included quantity and start emitting usage events to Microsoft for additional usage using the [Marketplace metering service API](./marketplace-metering-service-apis.md).  Microsoft in turn will charge the customer for the additional usage as specified by the publisher.

## Billing dimensions

Billing dimensions are used to communicate to the customer on how they will be billed for using the software, and also to communicate usage events to Microsoft. They are defined as follows:

* **Dimension identifier**: the immutable identifier referenced while emitting usage events.
* **Dimension name**: the display name associated with the dimension, e.g. "text messages sent".
* **Unit of measure**: the description of the billing unit, e.g. "per text message" or "per 100 emails".
* **Price per unit**: the price for one unit of the dimension.  
* **Included quantity for monthly term**: quantity of dimension included per month for customers paying the recurring monthly fee, must be an integer.
* **Included quantity for annual term**: quantity of dimension included per month for customers paying the recurring annual fee, must be an integer.

Billing dimensions are shared across all plans for an offer.  Some attributes apply to the dimension across all plans, and other attributes are plan-specific.

The attributes which define the dimension itself are shared across all plans for an offer.  Before you publish the offer, a change made to these attributes from the context of any plan will affect the dimension definition across all plans.  Once you publish the offer, these attributes will no longer be editable.  These attributes are:

* Identifier
* Name
* Unit of measure

The other attributes of a dimension are specific to each plan and can have different values from plan to plan.  Before you publish the plan you can edit these values and only this plan will be affected.  Once you publish the plan, these attributes will no longer be editable.  These attributes are:

* Price per unit
* Included quantity for monthly customers 
* Included quantity for annual customers 

Dimensions also have two special concepts, "enabled" and "infinite":

* **Enabled** indicates that this plan participates in this dimension.  You might want to leave this un-checked if you are creating a new plan that does not send usage events based on this dimension.  Also, any new dimensions added after a plan was first published will show up as "not enabled" on the already published plan.  A disabled dimension will not show up in any lists of dimensions for a plan seen by customers.
* **Infinite**, represented by the infinity symbol "∞", indicates that this plan participates in this dimension, but does not meter usage against this dimension.  If you want to indicate to your customers that the functionality represented by this dimension is included in the plan, but with no limit on usage.  A dimension with infinite usage will show up in lists of dimensions for a plan seen by customers, with an indication that it will never incur a charge for this plan.

>[!Note] 
>The following scenarios are explicitly supported: <br> - You can add a new dimension to a new plan.  The new dimension will not be enabled for any already published plans. <br> - You can publish a **flat-rate** plan without any dimensions, then add a new plan and configure a new dimension for that plan. The new dimension will not be enabled for already published plans.

## Constraints

### Trial behavior

Metered billing using the marketplace metering service is not compatible with offering a free trial.  It is not possible to configure a plan to use both metered billing and a free trial.

### Locking behavior

Because a dimension used with the Marketplace metering service represents an understanding of how a customer will be paying for the service, all of the details for a dimension are no longer editable once you publish it.  It's important that you have your dimensions fully defined for a plan before you publish.
  
Once an offer is published with a dimension, the offer-level details for that dimension can no longer be changed:

* Identifier
* Name
* Unit of measure

Once a plan is published, the plan-level details can no longer be changed:

* Price per unit
* Included quantity for monthly term
* Included quantity for annual term
* Whether the dimension is enabled for the plan

### Upper limits

The maximum number of dimensions that can be configured for a single offer is 18 unique dimensions.

## Get support

If you have one of the following, you can open a support ticket.

* Technical issues with marketplace metering service API.
* An issue that needs to be escalated because of an error or bug on your side (ex. wrong usage event).
* Any other issues related to metered billing. 

Follow the steps below to submit your support ticket:

1. Go to the [support page](https://support.microsoft.com/supportforbusiness/productselection?sapId=48734891-ee9a-5d77-bf29-82bf8d8111ff). The first few dropdown menus are automatically filled out for you. For Marketplace support, identify the product family as **Cloud and Online Services**, the product as **Marketplace Publisher**.  Do not change the pre-populated dropdown menu selections.
2. Under "Select the product version", select **Live offer management**.
3. Under "Select a category that best describe the issue", choose **SaaS apps**.
4. Under "Select a problem that best describes the issue", select **metered billing**.
5. By selecting the **Next** button, you will be directed to the **Issue details** page, where you can enter more details on your issue.

See [Support for the commercial marketplace program in Partner Center](https://docs.microsoft.com/azure/marketplace/partner-center-portal/support) for more publisher support options.

## Next steps

- See [Marketplace metering service APIs](./marketplace-metering-service-apis.md) for more information.
