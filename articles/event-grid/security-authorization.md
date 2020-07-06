---
title: Azure Event Grid security and authentication
description: Describes Azure Event Grid and its concepts.
services: event-grid
author: femila
manager: timlt

ms.service: event-grid
ms.topic: conceptual
ms.date: 05/22/2019
ms.author: femila
---
# Authorizing access to Event Grid resources
Azure Event Grid allows you to control the level of access given to different users to do various management operations such as list event subscriptions, create new ones, and generate keys. Event Grid uses Azure's role-based access control (RBAC).


## Operation types

Event Grid supports the following actions:

* Microsoft.EventGrid/*/read
* Microsoft.EventGrid/*/write
* Microsoft.EventGrid/*/delete
* Microsoft.EventGrid/eventSubscriptions/getFullUrl/action
* Microsoft.EventGrid/topics/listKeys/action
* Microsoft.EventGrid/topics/regenerateKey/action

The last three operations return potentially secret information, which gets filtered out of normal read operations. It's recommended that you restrict access to these operations. 

## Built-in roles

Event Grid provides two built-in roles for managing event subscriptions. They're important when implementing [event domains](event-domains.md) because they give users the permissions they need to subscribe to topics in your event domain. These roles are focused on event subscriptions and don't grant access for actions such as creating topics.

You can [assign these roles to a user or group](../role-based-access-control/quickstart-assign-role-user-portal.md).

**EventGrid EventSubscription Contributor**: manage Event Grid subscription operations

```json
[
  {
    "Description": "Lets you manage EventGrid event subscription operations.",
    "IsBuiltIn": true,
    "Id": "428e0ff05e574d9ca2212c70d0e0a443",
    "Name": "EventGrid EventSubscription Contributor",
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

**EventGrid EventSubscription Reader**: read Event Grid subscriptions

```json
[
  {
    "Description": "Lets you read EventGrid event subscriptions.",
    "IsBuiltIn": true,
    "Id": "2414bbcf64974faf8c65045460748405",
    "Name": "EventGrid EventSubscription Reader",
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

## Custom roles

If you need to specify permissions that are different than the built-in roles, you can create custom roles.

The following are sample Event Grid role definitions that allow users to take different actions. These custom roles are different from the built-in roles because they grant broader access than just event subscriptions.

**EventGridReadOnlyRole.json**: Only allow read-only operations.

```json
{
  "Name": "Event grid read only role",
  "Id": "7C0B6B59-A278-4B62-BA19-411B70753856",
  "IsCustom": true,
  "Description": "Event grid read only role",
  "Actions": [
    "Microsoft.EventGrid/*/read"
  ],
  "NotActions": [
  ],
  "AssignableScopes": [
    "/subscriptions/<Subscription Id>"
  ]
}
```

**EventGridNoDeleteListKeysRole.json**: Allow restricted post actions but disallow delete actions.

```json
{
  "Name": "Event grid No Delete Listkeys role",
  "Id": "B9170838-5F9D-4103-A1DE-60496F7C9174",
  "IsCustom": true,
  "Description": "Event grid No Delete Listkeys role",
  "Actions": [
    "Microsoft.EventGrid/*/write",
    "Microsoft.EventGrid/eventSubscriptions/getFullUrl/action"
    "Microsoft.EventGrid/topics/listkeys/action",
    "Microsoft.EventGrid/topics/regenerateKey/action"
  ],
  "NotActions": [
    "Microsoft.EventGrid/*/delete"
  ],
  "AssignableScopes": [
    "/subscriptions/<Subscription id>"
  ]
}
```

**EventGridContributorRole.json**: Allows all event grid actions.

```json
{
  "Name": "Event grid contributor role",
  "Id": "4BA6FB33-2955-491B-A74F-53C9126C9514",
  "IsCustom": true,
  "Description": "Event grid contributor role",
  "Actions": [
    "Microsoft.EventGrid/*/write",
    "Microsoft.EventGrid/*/delete",
    "Microsoft.EventGrid/topics/listkeys/action",
    "Microsoft.EventGrid/topics/regenerateKey/action",
    "Microsoft.EventGrid/eventSubscriptions/getFullUrl/action"
  ],
  "NotActions": [],
  "AssignableScopes": [
    "/subscriptions/<Subscription id>"
  ]
}
```

You can create custom roles with [PowerShell](../role-based-access-control/custom-roles-powershell.md), [Azure CLI](../role-based-access-control/custom-roles-cli.md), and [REST](../role-based-access-control/custom-roles-rest.md).



### Encryption at rest

All events or data written to disk by the Event Grid service is encrypted by a Microsoft-managed key ensuring that it's encrypted at rest. Additionally, the maximum period of time that events or data retained is 24 hours in adherence with the [Event Grid retry policy](delivery-and-retry.md). Event Grid will automatically delete all events or data after 24 hours, or the event time-to-live, whichever is less.

## Permissions for event subscriptions
If you're using an event handler that isn't a WebHook (such as an event hub or queue storage), you need write access to that resource. This permissions check prevents an unauthorized user from sending events to your resource.

You must have the **Microsoft.EventGrid/EventSubscriptions/Write** permission on the resource that is the event source. You need this permission because you're writing a new subscription at the scope of the resource. The required resource differs based on whether you're subscribing to a system topic or custom topic. Both types are described in this section.

### System topics (Azure service publishers)
For system topics, you need permission to write a new event subscription at the scope of the resource publishing the event. The format of the resource is:
`/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/{resource-provider}/{resource-type}/{resource-name}`

For example, to subscribe to an event on a storage account named **myacct**, you need the Microsoft.EventGrid/EventSubscriptions/Write permission on:
`/subscriptions/####/resourceGroups/testrg/providers/Microsoft.Storage/storageAccounts/myacct`

### Custom topics
For custom topics, you need permission to write a new event subscription at the scope of the event grid topic. The format of the resource is:
`/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.EventGrid/topics/{topic-name}`

For example, to subscribe to a custom topic named **mytopic**, you need the Microsoft.EventGrid/EventSubscriptions/Write permission on:
`/subscriptions/####/resourceGroups/testrg/providers/Microsoft.EventGrid/topics/mytopic`



## Next steps

* For an introduction to Event Grid, see [About Event Grid](overview.md)
