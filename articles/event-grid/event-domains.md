---
title: Event Domains in Azure Event Grid
description: Describes how Event Domains are used to manage topics in Azure Event Grid.
services: event-grid
author: banisadr

ms.service: event-grid
ms.author: babanisa
ms.topic: conceptual
ms.date: 10/30/2018
---

# Understand Event Domains for Managing Event Grid Topics

This article describes how to use Event Domains to manage the flow of custom events to your various business orgs, customers, or applications. Use Event Domains to:

* Manage multitenant eventing architectures at scale.
* Manage your authorization and authentication.
* Partition your topics without managing each individually.
* Avoid individually publishing to each of your topic endpoints.

[!INCLUDE [event-grid-preview-feature-note.md](../../includes/event-grid-preview-feature-note.md)]


## Event Domains overview

An Event Domain is a management tool for large numbers of Event Grid Topics related to the same application. You can think of it as a meta-topic that can contain thousands of individual topics.

Event Domains make the architecture Azure services like Storage and IoT Hub use to publish their events available for you to use in your own system. They allow you to publish events to thousands of topics. Domains also give you authorization and authentication control over each topic so you can partition your tenants.

### Example use case

Event Domains are most easily explained using an example. Let’s say you run Contoso Construction Machinery, where you manufacture tractors, digging equipment, and other heavy machinery. As a part of running the business, you push real-time information to customers regarding equipment maintenance, systems health, contract updates etc. All of this information goes to various endpoints including your app, customer endpoints, and other infrastructure customers have setup.

Event Domains allows you to model Contoso Construction Machinery as a single eventing entity. Each of your customers is represented as a Topic within the Domain/ Authentication and authorization are handled using Azure Active Directory. Each of your customers can subscribe to their Topic and get their events delivered to them. Managed access through the Event Domain ensures they can only access their topic.

It also gives you a single endpoint, which you can publish all of your customer events to. Event Grid will take care of making sure each Topic is only aware of events scoped to its tenant.

![Contoso Construction Example](./media/event-domains/contoso-construction-example.png)

## Access management

 With a Domain, you get fine grain authorization and authentication control over each topic via Azure's Role Based Access Check (RBAC). You can use these roles to restrict each tenant in your application to only the topics you wish to grant them access to.

Role Based Access Check (RBAC) in Event Domains works the same way [managed access control](https://docs.microsoft.com/azure/event-grid/security-authentication#management-access-control) works in the rest of Event Grid and Azure. Use RBAC to create and enforce custom role definitions in Event Domains.

### Built in roles

Event Grid has two built-in role definitions to make RBAC easier:

#### EventGrid EventSubscription Contributor (Preview)

```json
[
  {
    "Description": "Lets you manage EventGrid event subscription operations.",
    "IsBuiltIn": true,
    "Id": "428e0ff05e574d9ca2212c70d0e0a443",
    "Name": "EventGrid EventSubscription Contributor (Preview)",
    "IsServiceRole": false,
    "Permissions": [
      {
        "Actions": [
          "Microsoft.Authorization/*/read",
          "Microsoft.EventGrid/eventSubscriptions/*",
          "Microsoft.EventGrid/topicTypes/eventSubscriptions/read",
          "Microsoft.EventGrid/locations/eventSubscriptions/read",
          "Microsoft.EventGrid/locations/topicTypes/eventSubscriptions/read",
          "Microsoft.Insights/alertRules/*",
          "Microsoft.Resources/deployments/*",
          "Microsoft.Resources/subscriptions/resourceGroups/read",
          "Microsoft.Support/*"
        ],
        "NotActions": [],
        "DataActions": [],
        "NotDataActions": [],
        "Condition": null
      }
    ],
    "Scopes": [
      "/"
    ]
  }
]
```

#### EventGrid EventSubscription Reader (Preview)

```json
[
  {
    "Description": "Lets you read EventGrid event subscriptions.",
    "IsBuiltIn": true,
    "Id": "2414bbcf64974faf8c65045460748405",
    "Name": "EventGrid EventSubscription Reader (Preview)",
    "IsServiceRole": false,
    "Permissions": [
      {
        "Actions": [
          "Microsoft.Authorization/*/read",
          "Microsoft.EventGrid/eventSubscriptions/read",
          "Microsoft.EventGrid/topicTypes/eventSubscriptions/read",
          "Microsoft.EventGrid/locations/eventSubscriptions/read",
          "Microsoft.EventGrid/locations/topicTypes/eventSubscriptions/read",
          "Microsoft.Resources/subscriptions/resourceGroups/read"
        ],
        "NotActions": [],
        "DataActions": [],
        "NotDataActions": []
       }
    ],
    "Scopes": [
      "/"
    ]
  }
]
```

## Subscribing to topics

Subscribing to events on a topic within an Event Domain is the same as [creating an Event Subscription on a custom topic](./custom-event-quickstart.md) or subscribing to any of the built-in Event Publishers Azure offers.

### Domain scope subscriptions

Event Domains also allow for Domain scope subscriptions. An event subscription on an Event Domain will receive all events sent to the Domain regardless of the topic the events are sent to. Domain scope subscriptions can be useful for management and auditing purposes.

## Publishing to an Event Domain

When you create an Event Domain, you're given a publishing endpoint similar to if you had created a topic in Event Grid. 

To publish events to any topic in an Event Domain, push the events to the Domain's endpoint the [same way you would for a custom topic](./post-to-custom-topic.md). The only difference is that you must specify the topic you'd like the event to be delivered to.

For example, publishing the following array of events would send event with `"id": "1111"` to topic `foo` while the event with `"id": "2222"` would be sent to topic `bar`:

```json
[{
  "topic": "foo",
  "id": "1111",
  "eventType": "maintenanceRequested",
  "subject": "myapp/vehicles/diggers",
  "eventTime": "2018-10-30T21:03:07+00:00",
  "data": {
    "make": "Contoso",
    "model": "Small Digger"
  },
  "dataVersion": "1.0"
},
{
  "topic": "bar",
  "id": "2222",
  "eventType": "maintenanceCompleted",
  "subject": "myapp/vehicles/tractors",
  "eventTime": "2018-10-30T21:04:12+00:00",
  "data": {
    "make": "Contoso",
    "model": "Big Tractor"
  },
  "dataVersion": "1.0"
}]
```

Event Domains handle publishing to topics for you. Instead of publishing events to each topic you manage individually, you can publish all of your events to the Domain’s endpoint and Event Grid takes care of ensuring each event is sent to the correct topic.

## Limits and quotas

### Control plane

During preview, Event Domains will be limited to 1,000 topics within a domain and 50 event subscriptions per topic within a Domain. Event Domain scope subscriptions will also be limited to 50.

### Data plane

During preview, event throughput for an Event Domain will be limited to the same 5,000 events per second ingestion rate that custom topics are limited to.

## Pricing

During preview, Event Domains will use the same [operations pricing](https://azure.microsoft.com/pricing/details/event-grid/) that all other features in Event Grid use.

Operations work the same in Event Domains as they do in custom topics. Each ingress of an event to an Event Domain is an operation, and each delivery attempt for an event is an operation.

## Next steps

* To learn about setting up Event Domains, creating topics, creating event subscriptions, and publishing events, see [Manage Event Domains](./how-to-event-domains.md).