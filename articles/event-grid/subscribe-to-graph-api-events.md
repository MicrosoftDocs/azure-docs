---
title: Receive Microsoft Graph change notifications through Azure Event Grid
description: This article explains how to subscribe to events published by Microsoft Graph API.
author: robece
ms.author: robece
ms.topic: how-to
ms.custom: devx-track-azurecli, devx-track-azurepowershell, devx-track-extended-java, devx-track-go, devx-track-js, devx-track-python, build-2024
ms.date: 05/22/2024
---

# Receive Microsoft Graph API change events through Azure Event Grid 

This article describes steps to subscribe to events published by Microsoft Graph API. The following table lists the event sources for which events are available through Graph API. For most resources, events announcing its creation, update, and deletion are supported. For detailed information about the resources for which events are raised for event sources, see [supported resources by Microsoft Graph API change notifications](/graph/webhooks#supported-resources)
.

|Microsoft event source |Resources | Available event types | 
|:--- | :--- | :----|
| Microsoft Entra ID | [User](/graph/api/resources/user), [Group](/graph/api/resources/group) | [Microsoft Entra event types](microsoft-entra-events.md) |
| Microsoft Outlook|[Event](/graph/api/resources/event) (calendar meeting), [Message](/graph/api/resources/message) (email), [Contact](/graph/api/resources/contact) | [Microsoft Outlook event types](outlook-events.md) |
| Microsoft Teams |[ChatMessage](/graph/api/resources/callrecords-callrecord), [CallRecord](/graph/api/resources/callrecords-callrecord) (meeting) | [Microsoft Teams event types](teams-events.md) |
| OneDrive | [DriveItem](/graph/api/resources/driveitem)| [Microsoft OneDrive events](one-drive-events.md) |
| Microsoft SharePoint | [List](/graph/api/resources/list) | [Microsoft SharePoint events](share-point-events.md) |
| To Do | [To Do Task](/graph/api/resources/todotask) | [Microsoft ToDo events](to-do-events.md) |
| Security alerts | [Alert](/graph/api/resources/alert)| [Microsoft Security Alert events](security-alert-events.md) |
| Cloud printing | [Printer](/graph/api/resources/printer), [Print Task Definition](/graph/api/resources/printtaskdefinition) | [Microsoft Cloud Printing events](cloud-printing-events.md) |
| Microsoft Conversations | [Conversation](/graph/api/resources/conversation) | [Microsoft 365 Group Conversation events](conversation-events.md) |

You create a Microsoft Graph API subscription to enable Graph API events to flow into a partner topic. The partner topic is automatically created for you as part of the Graph API subscription creation. You use that partner topic to [create event subscriptions](event-filtering.md) to send your events to any of the supported [event handlers](event-handlers.md) that best meets your requirements to process the events.

> [!IMPORTANT]
>If you aren't familiar with the **Partner Events** feature, see [Partner Events overview](partner-events-overview.md).


## Why should I subscribe to events from Microsoft Graph API sources via Event Grid?

Besides the ability to subscribe to Microsoft Graph API events via Event Grid, you have [other options](/graph/webhooks#receiving-change-notifications) through which you can receive similar notifications (not events). Consider using Microsoft Graph API to deliver events to Event Grid if you have at least one of the following requirements:

- You're developing an event-driven solution that requires events from Microsoft Entra ID, Outlook, Teams, etc. to react to resource changes. You require the robust eventing model and publish-subscribe capabilities that Event Grid provides. For an overview of Event Grid, see [Event Grid concepts](concepts.md).
- You want to use Event Grid to route events to multiple destinations using a single Graph API subscription and you want to avoid managing multiple Graph API subscriptions.
- You require to route events to different downstream applications, webhooks, or Azure services depending on some of the properties in the event. For example, you might want to route event types such as `Microsoft.Graph.UserCreated` and `Microsoft.Graph.UserDeleted` to a specialized application that processes users' onboarding and off-boarding. You might also want to send `Microsoft.Graph.UserUpdated` events to another application that syncs contacts information, for example. You can achieve that using a single Graph API subscription when using Event Grid as a notification destination. For more information, see [event filtering](event-filtering.md) and [event handlers](event-handlers.md).
- Interoperability is important to you. You want to forward and handle events in a standard way using Cloud Native Computing Foundation (CNCF) [CloudEvents](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/spec.md) specification standard.
- You like the extensibility support that CloudEvents provides. For example, if you want to trace events across compliant systems, use CloudEvents extension [Distributed Tracing](https://github.com/cloudevents/spec/blob/v1.0.1/extensions/distributed-tracing.md). Learn more about more [CloudEvents extensions](https://github.com/cloudevents/spec/blob/v1.0.1/documented-extensions.md).
- You want to use proven event-driven approaches adopted by the industry.

## Enable Graph API events to flow to your partner topic

You request Microsoft Graph API to forward events to an Event Grid partner topic by creating a Graph API subscription using the Microsoft Graph API Software Development Kits (SDKs) and **following the steps in the links to samples provided** in this section. See [Supported languages for Microsoft Graph API SDK](/graph/sdks/sdks-overview#supported-languages.md) for available SDK support.

### General prerequisites

You should meet these general prerequisites before implementing your application to create and renew Microsoft Graph API subscriptions:

- Become familiar with the [high-level steps to subscribe to partner events](subscribe-to-partner-events.md#high-level-steps). As described in that article, before creating a Graph API subscription, you should follow the instructions in:

  - [Register the Event Grid resource provider](subscribe-to-partner-events.md#register-the-event-grid-resource-provider) with your Azure subscription.

  - [Authorize Microsoft Graph API (partner)](subscribe-to-partner-events.md#authorize-partner-to-create-a-partner-topic) to create a partner topic in your resource group.

- Have a working knowledge of [Microsoft Graph API notifications](/graph/api/resources/webhooks). As part of your learning, you could use the [Graph API Explorer](https://developer.microsoft.com/en-us/graph/graph-explorer) to create Graph API subscriptions.
- Understand [Partner Events concepts](partner-events-overview.md).
- Identify the Microsoft Graph API resource from which you want to receive system state change events. For more information, see [Microsoft Graph API change notifications](/graph/webhooks#supported-resources). For example, for tracking changes to users in Microsoft Entra ID you should use the [user](/graph/api/resources/user) resource. Use [group](/graph/api/resources/group) for tracking changes to user groups.
- Have a tenant administrator account on a Microsoft 365 tenant. You can get a development tenant for free by joining the [Microsoft 365 Developer Program](https://developer.microsoft.com/microsoft-365/dev-program).

You find other prerequisites specific to the programming language of choice and the development environment you use in the Microsoft Graph API samples links found in a coming section.

> [!IMPORTANT]
> While detailed instructions to implement your application are found in the [samples with detailed instructions](#samples-with-detailed-instructions) section, you should read all sections in this article as they contain additional, important information related to forwarding Microsoft Graph API events using Event Grid.

### How to create a Microsoft Graph API subscription

When you create a Graph API subscription, a partner topic is created for you. You pass the following information in parameter *notificationUrl* to specify what partner topic to create and be associated to the new Graph API subscription:

- partner topic name
- resource group name in which the partner topic is created
- region (location)
- Azure subscription

These code samples show you how to create a Graph API subscription. They show examples for creating a subscription to receive events from all users in a Microsoft Entra ID tenant when they're created, updated, or deleted.

# [HTTP](#tab/http)
<!-- {
  "blockType": "request",
  "name": "create_subscription_from_subscriptions"
}-->

```http
POST https://graph.microsoft.com/v1.0/subscriptions
Content-type: application/json

{
    "changeType": "Updated,Deleted,Created",
    "notificationUrl": "EventGrid:?azuresubscriptionid=8A8A8A8A-4B4B-4C4C-4D4D-12E12E12E12E&resourcegroup=yourResourceGroup&partnertopic=yourPartnerTopic&location=theNameOfAzureRegionFortheTopic",
    "lifecycleNotificationUrl": "EventGrid:?azuresubscriptionid=8A8A8A8A-4B4B-4C4C-4D4D-12E12E12E12E&resourcegroup=yourResourceGroup&partnertopic=yourPartnerTopic&location=theNameOfAzureRegionFortheTopic",
    "resource": "users",
    "expirationDateTime": "2024-03-31T00:00:00Z",
    "clientState": "secretClientValue"
}
```

# [C#](#tab/csharp)
[!INCLUDE [sample-code](includes/scripts/csharp/create-ms-graph-api-subscription-csharp-snippet.md)]

# [CLI](#tab/cli)
[!INCLUDE [sample-code](includes/scripts/cli/create-ms-graph-api-subscription-cli-snippet.md)]

# [Go](#tab/go)
[!INCLUDE [sample-code](includes/scripts/go/create-ms-graph-api-subscription-go-snippet.md)]

# [Java](#tab/java)
[!INCLUDE [sample-code](includes/scripts/java/create-ms-graph-api-subscription-java-snippet.md)]

# [JavaScript](#tab/javascript)
[!INCLUDE [sample-code](includes/scripts/javascript/create-ms-graph-api-subscription-javascript-snippet.md)]

# [PHP](#tab/php)
[!INCLUDE [sample-code](includes/scripts/php/create-ms-graph-api-subscription-php-snippet.md)]

# [PowerShell](#tab/powershell)
[!INCLUDE [sample-code](includes/scripts/powershell/create-ms-graph-api-subscription-powershell-snippet.md)]

# [Python](#tab/python)
[!INCLUDE [sample-code](includes/scripts/python/create-ms-graph-api-subscription-python-snippet.md)]

---

- `changeType`: the kind of resource changes for which you want to receive events. Valid values: `Updated`, `Deleted`, and `Created`. You can specify one or more of these values separated by commas.
- `notificationUrl`: a URI used to define the partner topic to which events are sent. It must conform to the following pattern: `EventGrid:?azuresubscriptionid=<you-azure-subscription-id>&resourcegroup=<your-resource-group-name>&partnertopic=<the-name-for-your-partner-topic>&location=<the-Azure-region-name-where-you-want-the-topic-created>`. The location (also known as Azure region) `name` can be obtained by executing the **az account list-locations** command. Don't use a location display name. For example, don't use West Central US. Use `westcentralus` instead.
   ```azurecli-interactive
    az account list-locations
   ```
- `lifecycleNotificationUrl`: a URI used to define the partner topic to which `microsoft.graph.subscriptionReauthorizationRequired`events are sent. This event signals your application that the Graph API subscription is expiring soon. The URI follows the same pattern as *notificationUrl* described earlier if using Event Grid as destination to lifecycle events. In that case, the partner topic should be the same as the one specified in *notificationUrl*.
- resource: the resource that generates events that announce state changes.
- expirationDateTime: the expiration time at which the subscription expires and the flow of events stop. It must conform to the format specified in [Request for Change (RFC) 3339](https://tools.ietf.org/html/rfc3339). You must specify an expiration time that is within the [maximum subscription length allowable per resource type](/graph/api/resources/subscription#subscription-lifetime).
- client state. This property is optional. It's used for verification of calls to your event handler application during event delivery. For more information, see [Graph API subscription properties](/graph/api/resources/subscription#properties).

> [!IMPORTANT]
>
> - The partner topic name must be unique within the same Azure region. Each tenant-application ID combination can  create up to 10 unique partner topics.
>
> - Be mindful of certain [Graph API resources' service limits](/graph/webhooks#azure-ad-resource-limitations) when developing your solution.
>
> - Existing Graph API subscriptions without a `lifecycleNotificationUrl` property don't receive lifecycle events. To add the lifecycleNotificationUrl property, you should delete the existing subscription and create a new subscription specifying the property during subscription creation.

After creating a Graph API subscription, you have a partner topic created on Azure.

### Renew a Microsoft Graph API subscription

Your application must renew the Graph API subscription before it expires to avoid stopping the flow of events. To help you automate the renewal process, Microsoft Graph API supports **lifecycle notifications events** to which your application can subscribe. Currently, all type of Microsoft Graph API resources support the `microsoft.graph.subscriptionReauthorizationRequired`, which is sent when any of the following conditions occur:

- Access token is about to expire.
- Graph API subscription is about to expire.
- A tenant administrator revoked your app's permissions to read a resource.

If you didn't renew your Graph API subscription after it expires, you need to create a new Graph API subscription. You could refer to the same partner topic you used in your expired subscription as long as it's expired for less than 30 days. If the Graph API subscription expired for more than 30 days, you can't reuse your existing partner topic. In this case, you need to either specify another partner topic name. Alternatively, you can delete the existing partner topic to create a new partner topic with the same name during the Graph API subscription creation.

#### How to renew a Microsoft Graph API subscription

Upon receiving a `microsoft.graph.subscriptionReauthorizationRequired` event your application should renew the Graph API subscription by doing these actions:

1. If you provided a client secret in the *clientState* property when you created the Graph API subscription, that client secret in included with the event. Validate that the event's clientState matches the value used when you created the Graph API subscription.
1. Ensure that the app has a valid access token to take the next step. More information is provided in the coming [samples with detailed instructions](#samples-with-detailed-instructions) section.
1. Call either of the following two APIs. If the API call succeeds, the change notification flow resumes.

    - Call the `/reauthorize` action to reauthorize the subscription without extending its expiration date.
        
        <!-- {
          "blockType": "request",
          "name": "change-notifications-lifecycle-notifications-reauthorize"
        }-->
        ```http
        POST  https://graph.microsoft.com/beta/subscriptions/{id}/reauthorize
        ```

    - Perform a regular "renew" action to reauthorize *and* renew the subscription at the same time.

        <!-- {
          "blockType": "request",
          "name": "change-notifications-lifecycle-notifications-renew"
        }-->
        ```http
        PATCH https://graph.microsoft.com/beta/subscriptions/{id}
        Content-Type: application/json

        {
           "expirationDateTime": "2024-04-30T11:00:00.0000000Z"
        }
        ```

      Renewing might fail if the app is no longer authorized to access to the resource. It might then be necessary for the app to obtain a new access token to successfully reauthorize a subscription.

Authorization challenges don't replace the need to renew a subscription before it expires. The lifecycles of access tokens and subscription expiration aren't the same. Your access token might expire before your subscription. It's important to be prepared to regularly reauthorize your endpoint to refresh your access token. Reauthorizing your endpoint doesn't renew your subscription. However, renewing your subscription also reauthorizes your endpoint.

When renewing and/or reauthorizing your Graph API subscription the same partner topic specified when the subscription was created is used. 

When Specifying a new *expirationDateTime*, it must be at least three hours from the current time. Otherwise, your application might receive `microsoft.graph.subscriptionReauthorizationRequired` events soon after renewal.

For examples about how to reauthorize your Graph API subscription using any of the supported languages, see [subscription reauthorize request](/graph/api/subscription-reauthorize#request).

For examples about how to renew and reauthorize your Graph API subscription using any of the supported languages, see [update subscription request.](/graph/api/subscription-update#request).

### Samples with detailed instructions

Microsoft Graph API documentation provides code samples with instructions to:

- Set up your development environment with specific instructions according to the language you use. Instructions also include how to get a Microsoft 365 tenant for development purposes.
- Create a Graph API subscriptions. To renew a subscription, you can call the Graph API using the code snippets in [How to renew a Graph API subscription](#how-to-renew-a-microsoft-graph-api-subscription).
- Get authentication tokens to use them when calling Microsoft Graph API.

>[!NOTE]
> It is possible to create your Graph API subscription using the [Microsoft Graph API Explorer](https://developer.microsoft.com/en-us/graph/graph-explorer). You should still use the samples for other important aspects of your solution such as authentication and receiving events.

Web application samples are available for the following languages:

- [C# sample](https://github.com/microsoftgraph/msgraph-sample-eventgrid-notifications-dotnet). It's an up-to-date sample that includes how to create and renew Graph API subscriptions and walks you through some of the steps to enable the flow of events.
- [Java sample](https://github.com/microsoftgraph/java-spring-webhooks-sample)
  - [GraphAPIController](https://github.com/robece/event-grid-ms-graph-api-java-snippet) contains sample code to create, delete, and renew a Graph API subscription. It must be used along with the Java sample application.
- [NodeJS sample](https://github.com/microsoftgraph/nodejs-webhooks-sample).

> [!IMPORTANT]
> You need to activate your partner topic that is created as part of your Graph API subscription creation. You also need to create an Event Grid event subscription to your web application to receive events. To that end, you use the URL configured in your web application to receive events as a webhook endpoint in your event subscription. [Next steps](#next-steps) for more information.

> [!IMPORTANT]
> Do you need sample code for another language or have questions? Please email us at [ask-graph-and-grid@microsoft.com](mailto:ask-graph-and-grid@microsoft.com?subject=Need%20support%20for%20sample%20in%20other%20language).

## Next steps

Follow the instructions in the following two steps to complete set-up to receive Microsoft Graph API events using Event Grid:

- [Activate the partner topic](subscribe-to-partner-events.md#activate-a-partner-topic) created as part of the Microsoft Graph API creation.
- [Subscribe to events](subscribe-to-partner-events.md#subscribe-to-events) by creating an event subscription to your partner topic.

Other useful links:
 
- [Azure Event Grid - Partner Events overview](partner-events-overview.md)
- [Information on Microsoft Graph API](https://developer.microsoft.com/graph/rest-api).
- [Microsoft Graph API webhooks](/graph/api/resources/webhooks)
- [Best practices for working with Microsoft Graph API](/graph/best-practices-concept)
- [Microsoft Graph API SDKs](/graph/sdks/sdks-overview)
- [Microsoft Graph API tutorials](/graph/tutorials), which shows how to use Graph API. This article doesn't necessarily include examples for sending events to Event Grid.
