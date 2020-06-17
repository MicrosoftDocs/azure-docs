---
title: Metering service APIs FAQ - Microsoft commercial marketplace
description: Frequently asked questions about the metering service APIs for SaaS offers in Microsoft AppSource and Azure Marketplace. 
author: dsindona 
ms.author: dsindona 
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 06/01/2020
---

# Marketplace metered billing APIs - FAQ

Once a customer subscribes to a SaaS service, or Azure Application with a Managed Apps plan, with metered billing, you will track consumption for each billing dimension being used.  If the consumption exceeds the included quantities set for the term selected by the customer, your service will emit usage events to Microsoft.

## For both SaaS offers and Managed apps

### How often is it expected to emit usage?

Ideally, you are expected to emit usage every hour for the past hour, only if there is usage in the previous hour.

### Is there a maximal period between one emission and the next one?

There is no such limitation. Only emit usage as it occurs. For example, if you only need to submit one unit of usage per subscription lifetime, you can do it.

### What is the maximum delay between the time an event occurs, and the time a usage event is emitted to Microsoft?

Ideally, the usage event is emitted every hour for events that occurred in the past hour. However, delays are expected. The maximum delay allowed is 24 hours, after which usage events will not be accepted. The best practice is to collect hourly usage and to emit is as one event at the end of the hour.

For example, if a usage event occurs at 1 PM on a day, you have until 1 PM on the next day to emit a usage event associated with this event.  In case the system emitting usage is down, it can recover and then send the usage event for the hour interval in which the usage happened, without loss of fidelity.

If 24 hours have passed after the actual usage, you can still emit the consumed units with later usage events.  However, this practice may hurt the credibility of the billing event reports for the end customer.  We recommend that you avoid sending meter emission once a day/week/month.  It will be harder to understand the actual usage by a customer, and to resolve issues or questions that might be raised regarding usage events.

Another reason to send usage every hour is to avoid situations that the user cancels the subscription before the publisher sends the daily/weekly/monthly emission event.

### What happens when you send more than one usage event in the same hour?

Only one usage event is accepted for the one-hour interval. The hour interval starts at minute 0 and ends at minute 59.  If more than one usage event is emitted for the same hour, any subsequent usage events are dropped as duplicates.

### What happens when the customer cancels the purchase within the time allowed by the cancellation policy?

The flat-rate amount will not be charged but the overage usage will be.

### Can custom meter plans be used for one-time payments?

Yes, you can define a custom dimension as one unit of one-time payment and emit it only once for each customer.

### Can custom meter plans be used to tiered pricing model?

Yes, it can be implemented with each custom dimension representing a single price tier.

For example, Contoso wants to charge $0.5 per email for the first 1000 emails, $0.4 per email between 1000 and 5000 emails, and $0.2 per email for above 5000 emails. They can define three custom dimensions, that correspond to the three email pricing tiers. Emit units of the first dimension for as long as the number of emails stays below 1000, then units of the second dimension when the number of emails is between 1000 and 5000, and finally, units of the third dimension for above 5000 emails.

### What happens if the Marketplace metering service has an outage?

If the ISV sends a custom meter and receives an error, that may have been caused by an issue on Microsoft side (usually in the case similar events were accepted before without an error), then the ISV should wait and retry the emission.

If the error persists, then resubmit that custom meter the next hour (accumulate the quantity). Continue this process until a non-error response is received.

## For SaaS offers only

### What happens when you emit usage for a SaaS subscription that has been unsubscribed already?

Any usage event emitted to the marketplace platform will not be accepted after a SaaS subscription has been deleted.

Usage can be emitted only for subscriptions in the Subscribed status (and not for subscriptions in `PendingFulfillmentStart`, `Suspended`, or `Unsubscribed` status).

The only exception is reporting usage for the time that was before the SaaS subscription has been canceled.

For example, the customer canceled the SaaS subscription today at 3 pm. Now is 5 pm, the publisher can still emit usage for the period between 6 pm yesterday and 3 pm today for this SaaS subscription.

### Can you get a list of all SaaS subscriptions, including active and unsubscribed subscriptions?

Yes, when you call the [GET Subscriptions List API](https://docs.microsoft.com/azure/marketplace/partner-center-portal/pc-saas-fulfillment-api-v2#subscription-api) as it includes a list of all SaaS subscriptions. The status field in the response for each SaaS subscription captures whether the subscription is active or unsubscribed.

### Are the start and end dates of SaaS subscription term and overage usage emission connected?

Overage events can be emitted at any point of time for existing SaaS subscription in *Subscribed* status. It's the responsibility of the publisher to emit usage events based on the policy defined in the billing plan. The overage must be calculated based on the dates defined in the term of the SaaS subscription. 

For example, if the publisher defines a SaaS plan that includes 1000 emails for $100 in monthly flat rate, every email above 1000 is billed $1 via custom dimension.

When the customer buys and activates the subscription on January 6, the 1000 email included in the flat rate will be counted starting on this day. So if until February 5 (end of the first month of the subscription) only 900 emails are sent, the customer will pay the fixed rate only for the first month of this subscription, and no overage usage events will be emitted by the publisher between January 6 and February 5. On February 6, the subscription will be automatically renewed and the count will start again. If on February 15 the customer reached 1000 emails sent, the rest of the emails sent until March 5 will be charged as overage ($1 per email) based on the overage usage events emitted by the publisher.

## Next steps

- For more information, see [Marketplace metering service APIs](./marketplace-metering-service-apis.md).
