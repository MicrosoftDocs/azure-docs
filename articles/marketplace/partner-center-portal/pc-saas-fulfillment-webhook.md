---
title: Implementing a webhook on the SaaS service | Microsoft commercial marketplace
description: Learn how to implement a webhook on the SaaS service by using the fulfillment APIs version 2.
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: reference
ms.date: 10/27/2021
author: arifgani
ms.author: argani
---

# Implementing a webhook on the SaaS service

When creating a transactable SaaS offer in Partner Center, the partner provides the **Connection webhook** URL to be used as an HTTP endpoint.  This webhook is called by Microsoft by using the POST HTTP call to notify the publisher side of following events that happen on the Microsoft side:

* When the SaaS subscription is in *Subscribed* status:
    * ChangePlan
    * ChangeQuantity
    * Renew
    * Suspend
    * Unsubscribe
* When SaaS subscription is in *Suspended* status:
    * Reinstate
    * Unsubscribe

The publisher must implement a webhook in the SaaS service to keep the SaaS subscription status consistent with the Microsoft side.  The SaaS service is required to call the Get Operation API to validate and authorize the webhook call and payload data before taking action based on the webhook notification.  The publisher should return HTTP 200 to Microsoft as soon as the webhook call is processed.  This value acknowledges that the webhook call has been received successfully by the publisher.

> [!IMPORTANT]
> The webhook URL service must be up and running 24x7, and ready to receive new calls from Microsoft time at all times.  Microsoft does have a retry policy for the webhook call (500 retries over 8 hours), but if the publisher doesn't accept the call and return a response, the operation that webhook notifies about will eventually fail on the Microsoft side.

*Webhook payload example of a purchase event:*

```json
// end user changed a quantity of purchased seats for a plan on Microsoft side
{
  "id": "<guid>", // this is the operation ID to call with get operation API
  "activityId": "<guid>", // do not use
  "subscriptionId": "guid", // The GUID identifier for the SaaS resource which status changes
  "publisherId": "contoso", // A unique string identifier for each publisher
  "offerId": "offer1", // A unique string identifier for each offer
  "planId": "silver", // the most up-to-date plan ID
  "quantity": "25", // the most up-to-date number of seats, can be empty if not relevant
  "timeStamp": "2019-04-15T20:17:31.7350641Z", // UTC time when the webhook was called
  "action": "ChangeQuantity", // the operation the webhook notifies about
  "status": "Success" // Can be either InProgress or Success
}
```

*Webhook payload example of a subscription reinstatement event:*

```json
// end user's payment instrument became valid again, after being suspended, and the SaaS subscription is being reinstated
{
  "id": "<guid>",
  "activityId": "<guid>",
  "subscriptionId": "<guid>",
  "publisherId": "contoso",
  "offerId": "offer2 ",
  "planId": "gold",
  "quantity": "20",
  "timeStamp": "2019-04-15T20:17:31.7350641Z",
  "action": "Reinstate",
  "status": "InProgress"
}
```

*Webhook payload example of a renewal event:*

```json
// end user's payment instrument became valid again, after being suspended, and the SaaS subscription is being reinstated
{
  "id": "<guid>",
  "activityId": "<guid>",
  "subscriptionId": "<guid>",
  "publisherId": "contoso",
  "offerId": "offer1 ",
  "planId": "silver",
  "quantity": "25",
  "timeStamp": "2019-04-15T20:17:31.7350641Z",
  "action": "Renew",
  "status": "Success"
}
```

## Development and testing

To start the development process, we recommend creating dummy API responses on the publisher side.  These responses can be based on sample responses provided in this article.

When the publisher is ready for the end to end testing:

* Publish a SaaS offer to a limited preview audience and keep it in preview stage.
* Set the plan price to 0, to avoid triggering actual billing expense while testing.  Another option is to set a non-zero price and cancel all test purchases within 24 hours.
* Ensure all flows are invoked end to end, to simulate a real customer scenario.
* If the partner wants to test full purchase and billing flow, do so with offer that's priced above $0.  The purchase will be billed, and an invoice will be generated.

A purchase flow can be triggered from the Azure portal or Microsoft AppSource sites, depending on where the offer is being published.

*Change plan*, *change quantity*, and *unsubscribe* actions are tested from the publisher side.  From the Microsoft side, *unsubscribe* can be triggered from both the Azure portal and Admin Center (the portal where Microsoft AppSource purchases are managed).  *Change quantity and plan* can be triggered only from Admin Center.

## Get support

See [Support for the commercial marketplace program in Partner Center](../support.md) for publisher support options.

## Next steps

See the [commercial marketplace metering service APIs](../marketplace-metering-service-apis.md) for more options for SaaS offers in the commercial marketplace.

Review and use the [clients for different programming languages and samples](https://github.com/microsoft/commercial-marketplace-samples).
