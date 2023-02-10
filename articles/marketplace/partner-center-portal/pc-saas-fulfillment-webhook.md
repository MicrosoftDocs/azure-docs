---
title: Implementing a webhook on the SaaS service | Microsoft commercial marketplace
description: Learn how to implement a webhook on the SaaS service by using the fulfillment APIs version 2.
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: reference
ms.date: 08/24/2022
author: arifgani
ms.author: argani
---

# Implementing a webhook on the SaaS service

When creating a transactable SaaS offer in Partner Center, the partner provides the **Connection webhook** URL to be used as an HTTP endpoint.  This webhook is called by Microsoft by using the POST HTTP call to notify the publisher side of following events that happen on the Microsoft side:

* When the SaaS subscription is in *Subscribed* status:
    * ChangePlan
    * ChangeQuantity
    * Renew (notify only, no ACK needed)
    * Suspend (notify only, no ACK needed)
    * Unsubscribe (notify only, no ACK needed)
* When SaaS subscription is in *Suspended* status:
    * Reinstate
    * Unsubscribe (notify only, no ACK needed)

The publisher must implement a webhook in the SaaS service to keep the SaaS subscription status consistent with the Microsoft side.  The SaaS service is required to call the Get Operation API to validate and authorize the webhook call and payload data before taking action based on the webhook notification. The publisher should return HTTP 200 to Microsoft as soon as the webhook call is processed. This value acknowledges that the webhook call has been received successfully by the publisher.

> [!IMPORTANT]
> The webhook URL service must be up and running 24x7, and ready to receive new calls from Microsoft time at all times. Microsoft does have a retry policy for the webhook call (500 retries over 8 hours), but if the publisher doesn't accept the call and return a response, the operation that webhook notifies about will eventually fail on the Microsoft side.

*Webhook payload example of ChangePlan:*

```json
{
  "id": "<guid>",
  "activityId": "<guid>",
  "operationRequestSource": "Azure",
  "subscriptionId": "<guid>",
  "timeStamp": "2021-06-23T05:05:29.9799053Z",
  "action": "ChangePlan"
}
```

*Webhook payload example of ChangeQuantity event:*

```json
{
  "id": "<guid>",
  "activityId": "<guid>",
  "publisherId": "XXX",
  "offerId": "YYY",
  "planId": "plan1",
  "quantity": 100,
  "subscriptionId": "<guid>",
  "timeStamp": "2022-02-14T20:26:05.1419317Z",
  "action": "ChangeQuantity",
  "status": "InProgress",
  "operationRequestSource": "Partner",
  "subscription":
    {
      "id": "<guid>",
      "name": "Test",
      "publisherId": "XXX",
      "offerId": "YYY",
      "planId": "plan1",
      "quantity": 10,
      "beneficiary":
        {
          "emailId": "XX@gmail.com",
          "objectId": "<guid>",
          "tenantId": "<guid>",
          "puid": "1234567890",
        },
      "purchaser":
        {
          "emailId": "XX@gmail.com",
          "objectId": "<guid>",
          "tenantId": "<guid>",
          "puid": "1234567890",
        },
      "allowedCustomerOperations": ["Delete", "Update", "Read"],
      "sessionMode": "None",
      "isFreeTrial": false,
      "isTest": false,
      "sandboxType": "None",
      "saasSubscriptionStatus": "Subscribed",
      "term":
        {
          "startDate": "2022-02-10T00:00:00Z",
          "endDate": "2022-03-12T00:00:00Z",
          "termUnit": "P1M",
          "chargeDuration": null,
        },
      "autoRenew": true,
      "created": "2022-01-10T23:15:03.365988Z",
      "lastModified": "2022-02-14T20:26:04.5632549Z",
    },
  "purchaseToken": null,
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
  "quantity": 20,
  "timeStamp": "2019-04-15T20:17:31.7350641Z",
  "action": "Reinstate",
  "status": "InProgress"
}
```

*Webhook payload example of a Renew event:*

```json
// end user's subscription renewal
 {
    "id": "<guid>",
    "activityId": "<guid>",
    "publisherId": "contoso",
    "offerId": "offer1",
    "planId": "plan1",
    "quantity": 1,
    "subscriptionId": "<guid>",
    "timeStamp": "2021-12-04T19:48:06.7054737Z",
    "action": "Renew",
    "status": "Succeeded",
    "operationRequestSource": "Azure",
    "subscription": {
        "id": "<guid>",
        "name": "name",
        "publisherId": "contoso",
        "offerId": "offerId",
        "planId": "planId",
        "quantity": null,
        "beneficiary": {
            "emailId": "XXX@gmail.com",
            "objectId": "<guid>",
            "tenantId": "<guid>",
            "puid": null
        },
        "purchaser": {
            "emailId": "XXX@gmail.com",
            "objectId": "<guid>",
            "tenantId": "<guid>",
            "puid": null
        },
        "allowedCustomerOperations": [
            "Delete",
            "Update",
            "Read"
        ],
        "sessionMode": "None",
        "isFreeTrial": false,
        "isTest": false,
        "sandboxType": "None",
        "saasSubscriptionStatus": "Subscribed",
        "term": {
            "startDate": "2021-12-04T00:00:00Z",
            "endDate": "2022-01-03T00:00:00Z",
            "termUnit": "P1M",
            "chargeDuration": null
        },
        "autoRenew": true,
        "created": "2021-09-10T07:03:17.5098444Z",
        "lastModified": "2021-12-04T19:48:06.0754649Z"
    },
    "purchaseToken": null
}
```

*Webhook payload example of a Suspend event:*

```json
{
  "id": "<guid>",
  "activityId": "<guid>",
  "publisherId": "testpublisher",
  "offerId": "testoffer",
  "planId": "starter",
  "quantity": 1,
  "subscriptionId": "<guid>",
  "timeStamp": "2022-03-10T16:34:41.137017Z",
  "action": "Suspend",
  "status": "Succeeded",
  "operationRequestSource": "Azure",
  "subscription": {
    "id": "<guid>",
    "name": "testcms",
    "publisherId": "testpublisher",
    "offerId": "cmstestoffer",
    "planId": "starter",
    "quantity": null,
    "beneficiary": {
      "emailId": "XXX",
      "objectId": "<guid>",
      "tenantId": "<guid>",
      "puid": "XXX"
    },
    "purchaser": {
      "emailId": "XXX",
      "objectId": "<guid>",
      "tenantId": "<guid>",
      "puid": "XXX"
    },
    "allowedCustomerOperations": [ "Delete", "Update", "Read" ],
    "sessionMode": "None",
    "isFreeTrial": false,
    "isTest": false,
    "sandboxType": "None",
    "saasSubscriptionStatus": "Subscribed",
    "term": {
      "startDate": "2022-03-09T00:00:00Z",
      "endDate": "2022-04-08T00:00:00Z",
      "termUnit": "P1M",
      "chargeDuration": null
    },
    "autoRenew": true,
    "created": "2022-03-09T18:45:49.0735944Z",
    "lastModified": "2022-03-09T22:49:25.4181451Z"
  },
  "purchaseToken": null
}
```

*Webhook payload example of unsubscribe event:*

This is a notify only event. There is no send to ACK for this event.

```json
{
  "id": "<guid>",
  "activityId": "<guid>",
  "publisherId": "testpublisher",
  "offerId": "saasteam4-preview",
  "planId": "standard",
  "quantity": 1,
  "subscriptionId": "<guid>",
  "timeStamp": "2022-03-12T01:53:14.5038009Z",
  "action": "Unsubscribe",
  "status": "Succeeded",
  "operationRequestSource": "Azure",
  "subscription": {
    "id": "<guid>",
    "name": "Sub-test-ng",
    "publisherId": "testpublisher",
    "offerId": "saasteam4-preview",
    "planId": "standard",
    "quantity": null,
    "beneficiary": {
      "emailId": "*******************************",
      "objectId": "<guid>",
      "tenantId": "<guid>",
      "puid": "****************"
    },
    "purchaser": {
      "emailId": "*******************************",
      "objectId": "<guid>",
      "tenantId": "<guid>",
      "puid": "****************"
    },
    "allowedCustomerOperations": [ "Delete", "Update", "Read" ],
    "sessionMode": "None",
    "isFreeTrial": false,
    "isTest": false,
    "sandboxType": "None",
    "saasSubscriptionStatus": "Unsubscribed",
    "term": {
      "startDate": "2022-03-07T00:00:00Z",
      "endDate": "2022-04-06T00:00:00Z",
      "termUnit": "P1M",
      "chargeDuration": null
    },
    "autoRenew": true,
    "created": "2021-12-07T12:47:12.7474496Z",
    "lastModified": "2022-03-11T22:32:06.720473Z"
  },
  "purchaseToken": null
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

**Video tutorials**

- [SaaS Webhook Overview](https://go.microsoft.com/fwlink/?linkid=2196258)
- [Implementing a Simple SaaS Webhook in .NET](https://go.microsoft.com/fwlink/?linkid=2196159)
- [Azure AD Application Registrations](https://go.microsoft.com/fwlink/?linkid=2196262)
