---
title: Receive Microsoft Graph change notifications through Azure Event Grid (preview) 
description: This article explains how to subscribe to events published by Microsoft Graph API.
ms.topic: how-to
ms.date: 09/01/2022
---

# Receive Microsoft Graph change notifications through Azure Event Grid (preview)

This article describes steps to subscribe to events published by Microsoft Graph API. The following table lists the resources for which events are available through Graph API. For every resource, events for create, update and delete state changes are supported. 

> [!IMPORTANT]
> Microsoft Graph API's ability to send events to Azure Event Grid is currently in **private preview**. If you have questions or need support, email us at [ask-graph-and-grid@microsoft.com](mailto:ask-graph-and-grid@microsoft.com?subject=Support%20Request).

|Microsoft event source |Resource(s) | Available event types | 
|:--- | :--- | :----|
|Microsoft Entra ID| [User](/graph/api/resources/user), [Group](/graph/api/resources/group) | [Microsoft Entra event types](azure-active-directory-events.md) |
|Microsoft Outlook|[Event](/graph/api/resources/event) (calendar meeting), [Message](/graph/api/resources/message) (email), [Contact](/graph/api/resources/contact) | [Microsoft Outlook event types](outlook-events.md) |
|Microsoft Teams|[ChatMessage](/graph/api/resources/callrecords-callrecord), [CallRecord](/graph/api/resources/callrecords-callrecord) (meeting) | [Microsoft Teams event types](teams-events.md) |
|Microsoft SharePoint and OneDrive| [DriveItem](/graph/api/resources/driveitem)| |
|Microsoft SharePoint| [List](/graph/api/resources/list)|
|Security alerts| [Alert](/graph/api/resources/alert)|
|Microsoft Conversations| [Conversation](/graph/api/resources/conversation)| |

> [!IMPORTANT]
>If you aren't familiar with the **Partner Events** feature, see [Partner Events overview](partner-events-overview.md).


## Why should I use Microsoft Graph API as a destination?
Besides the ability to subscribe to Microsoft Graph API events via Event Grid, you have [other options](/graph/webhooks#receiving-change-notifications) through which you can receive similar notifications (not events). Consider using Microsoft Graph API to deliver events to Event Grid if you have at least one of the following requirements:

- You're developing an event-driven solution that requires events from Microsoft Entra ID, Outlook, Teams, etc. to react to resource changes. You require the robust eventing model and publish-subscribe capabilities that Event Grid provides. For an overview of Event Grid, see [Event Grid concepts](concepts.md).
- You want to use Event Grid to route events to multiple destinations using a single Graph API subscription and you want to avoid managing multiple Graph API subscriptions.
- You require to route events to different downstream applications, webhooks or Azure services depending on some of the properties in the event. For example, you may want to route event types such as `Microsoft.Graph.UserCreated` and `Microsoft.Graph.UserDeleted` to a specialized application that processes users' onboarding and off-boarding. You may also want to send `Microsoft.Graph.UserUpdated` events to another application that syncs contacts information, for example. You can achieve that using a single Graph API subscription when using Event Grid as a notification destination. For more information, see [event filtering](event-filtering.md) and [event handlers](event-handlers.md).
- Interoperability is important to you. You want to forward and handle events in a standard way using CNCF's [CloudEvents](https://github.com/cloudevents/spec/blob/v1.0.2/cloudevents/spec.md) specification standard, to which Event Grid fully complies.
- You like the extensibility support that CloudEvents provides. For example, if you want to trace events across compliant systems, you may use CloudEvents extension [Distributed Tracing](https://github.com/cloudevents/spec/blob/v1.0.1/extensions/distributed-tracing.md). Learn more about more [CloudEvents extensions](https://github.com/cloudevents/spec/blob/v1.0.1/documented-extensions.md).
- You want to use proven event-driven approaches adopted by the industry. 

## High-level steps

1. [Register the Event Grid resource provider](#register-the-event-grid-resource-provider) with your Azure subscription.
1. [Authorize partner](#authorize-partner-to-create-a-partner-topic) to create a partner topic in your resource group.
3. [Enable events to flow to a partner topic](#enable-graph-api-events-to-flow-to-your-partner-topic)
4. [Activate partner topic](#activate-a-partner-topic) so that your events start flowing to your partner topic.
5. [Subscribe to events](#subscribe-to-events).


[!INCLUDE [register-provider](./includes/register-provider.md)]

[!INCLUDE [authorize-verified-partner-to-create-topic](includes/authorize-verified-partner-to-create-topic.md)]


## Enable Graph API events to flow to your partner topic

You request Microsoft Graph API to send events by creating a Graph API subscription. When you create a Graph API subscription, the http request should look like the following sample:

```json
POST https://graph.microsoft.com/v1.0/subscriptions

x-ms-enable-features: EventGrid

Body:
{
    "changeType": "Updated,Deleted,Created",
    "notificationUrl": "EventGrid:?azuresubscriptionid=8A8A8A8A-4B4B-4C4C-4D4D-12E12E12E12E&resourcegroup=yourResourceGroup&partnertopic=youPartnerTopic&location=theNameOfAzureRegionFortheTopic",
    "resource": "users",
    "expirationDateTime": "2022-04-30T00:00:00Z",
    "clientState": "mysecret"
}
```

Here are some of the key headers and payload properties:

- `x-ms-enable-features`: Header used to indicate your desire to participate in the preview capability to send events to Azure Event Grid. Its value must be `EventGrid`. This header must be included with the request when creating a Microsoft Graph API subscription.
- `changeType`: the kind of resource changes for which you want to receive events. Valid values: `Updated`, `Deleted`, and `Created`. You can specify one or more of these values separated by commas.
- `notificationUrl`: a URI that conforms to the following pattern: `EventGrid:?azuresubscriptionid=<you-azure-subscription-id>&resourcegroup=<your-resource-group-name>&partnertopic=<the-name-for-your-partner-topic>&location=<the-Azure-region-name-where-you-want-the-topic-created>`. The location (also known as Azure region) `name` can be obtained by executing the **az account list-locations** command. Don't use a location displayname. For example, don't use "West Central US". Use `westcentralus` instead.
   ```azurecli-interactive
    az account list-locations
   ```
- resource: the resource that generates events to announce state changes.
- expirationDateTime: the expiration time at which the subscription expires and hence the flow of events stop. It must conform to the format specified in [RFC 3339](https://tools.ietf.org/html/rfc3339). You must specify an expiration time that is within the [maximum subscription length allowable for the resource type](/graph/api/resources/subscription#maximum-length-of-subscription-per-resource-type) used. 
- client state. A value that is set by you when creating a Graph API subscription. For more information, see [Graph API subscription properties](/graph/api/resources/subscription#properties).

> [!NOTE]
> Microsoft Graph API's capability to send events to Event Grid is only available in a specific Graph API environment. You will need to update your code so that it uses the following Graph API endpoint `https://graph.microsoft.com/beta`. For example, this is the way you can set the endpoint on your graph client (`com.microsoft.graph.requests.GraphServiceClient`) using the Graph API Java SDK:
>
>```java
>graphClient.setServiceRoot("https://graph.microsoft.com/beta");
>```

**You can create a Microsoft Graph API subscription by following the instructions in the [Microsoft Graph API webhook samples](https://github.com/microsoftgraph?q=webhooks&type=public&language=&sort=)** that include code samples for [NodeJS](https://github.com/microsoftgraph/nodejs-webhooks-sample), [Java (Spring Boot)](https://github.com/microsoftgraph/java-spring-webhooks-sample), and [.NET Core](https://github.com/microsoftgraph/aspnetcore-webhooks-sample). There are no samples available for Python, Go and other languages yet, but the [Graph SDK](/graph/sdks/sdks-overview) supports creating Graph API subscriptions using those programming languages. 

> [!NOTE]
> - Partner topic names must be unique within the same Azure region. Each tenant-application ID combination can  create up to 10 unique partner topics.
> - Be mindful of certain [Graph API resources' service limits](/graph/webhooks#azure-ad-resource-limitations) when developing your solution.

#### What happens when you create a Microsoft Graph API subscription?

When you create a Graph API subscription with a `notificationUrl` bound to Event Grid, a partner topic is created in your Azure subscription. For that partner topic, you [configure event subscriptions](event-filtering.md) to send your events to any of the supported [event handlers](event-handlers.md) that best meets your requirements to process the events. 

#### Test APIs using Graph Explorer
For quick tests and to get to know the API, you could use the [Graph Explorer](/graph/graph-explorer/graph-explorer-features). For anything else beyond casuals tests or learning, you should use the Microsoft Graph SDKs. 

[!INCLUDE [activate-partner-topic](includes/activate-partner-topic.md)]

[!INCLUDE [subscribe-to-events](includes/subscribe-to-events.md)]

## Next steps

See the following articles: 

- [Azure Event Grid - Partner Events overview](partner-events-overview.md)
- [Microsoft Graph API webhook samples](https://github.com/microsoftgraph?q=webhooks&type=public&language=&sort=). Use these samples to send events to Event Grid. You just need to provide a suitable value ``notificationUrl`` according to the request example above.
- [Varied set of resources on Microsoft Graph API](https://developer.microsoft.com/en-us/graph/rest-api).
- [Microsoft Graph API webhooks](/graph/api/resources/webhooks)
- [Best practices for working with Microsoft Graph API](/graph/best-practices-concept)
- [Microsoft Graph API SDKs](/graph/sdks/sdks-overview)
- [Microsoft Graph API tutorials](/graph/tutorials), which shows how to use Graph API in different programming languages.This doesn't necessarily include examples for sending events to Event Grid.
