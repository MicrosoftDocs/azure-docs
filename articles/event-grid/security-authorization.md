---
title: Event Grid Access Control with Azure RBAC
description: Azure Event Grid security controls access to resources using Azure RBAC built-in and custom roles. Learn how to configure role-based permissions for Event Grid operations.
#customer intent: As an IT admin, I want to understand how to control access to Azure Event Grid resources using role-based access control so that I can ensure only authorized users can perform management operations.
ms.topic: concept-article
ms.date: 03/26/2026
author: spelluru
ms.author: spelluru
ms.reviewer: spelluru
# Customer intent: I want to know how to secure access to Azure Event Grid resources. 
---

# Authorizing access to Event Grid resources
Azure Event Grid enables you to control the level of access different users have for various **management operations** such as listing event subscriptions, creating new ones, and generating keys. Event Grid uses Azure role-based access control (Azure RBAC).

## Operation types
To see a list of operations supported by Azure Event Grid, run the following Azure CLI command: 

```azurecli-interactive
az provider operation show --namespace Microsoft.EventGrid
```

The following operations return potentially secret information, which gets filtered out of normal read operations. Restrict access to these operations. 

* Microsoft.EventGrid/eventSubscriptions/getFullUrl/action
* Microsoft.EventGrid/topics/listKeys/action
* Microsoft.EventGrid/topics/regenerateKey/action


## Built-in roles
Event Grid provides the following three built-in roles. 


| Role | Description |
| ---- | ----------- | 
| [`EventGrid EventSubscription Reader`](../role-based-access-control/built-in-roles.md#eventgrid-eventsubscription-reader) | Lets you read Event Grid event subscriptions. |
| [`EventGrid EventSubscription Contributor`](../role-based-access-control/built-in-roles.md#eventgrid-eventsubscription-contributor) | Lets you manage Event Grid event subscription operations. |
| [`EventGrid Contributor`](../role-based-access-control/built-in-roles.md#eventgrid-contributor) | Lets you create and manage Event Grid resources. |
| [`EventGrid Data Sender`](../role-based-access-control/built-in-roles.md#eventgrid-data-sender) | Lets you send events to Event Grid topics. |

The **Event Grid Subscription Reader** and **Event Grid Subscription Contributor** roles are for managing event subscriptions. They're important when implementing [event domains](event-domains.md) because they give users the permissions they need to subscribe to topics in your event domain. These roles are focused on event subscriptions and don't grant access for actions such as creating topics.

The **Event Grid Contributor** role allows you to create and manage Event Grid resources. 



> [!NOTE]
> Select links in the first column to navigate to an article that provides more details about the role. For instructions on how to assign users or groups to RBAC roles, see [this article](../role-based-access-control/quickstart-assign-role-user-portal.md).


## Custom roles

If you need to specify permissions that are different than the built-in roles, create custom roles.

The following sample Event Grid role definitions grant users different permissions. These custom roles differ from the built-in roles because they grant broader access than just event subscriptions.

- **EventGridReadOnlyRole.json**: Grants only read-only operations.

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

- **EventGridNoDeleteListKeysRole.json**: Grants restricted post actions but disallows delete actions.

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

- **EventGridContributorRole.json**: Grants all Event Grid actions.

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

The Event Grid service encrypts all events or data written to disk by using a Microsoft-managed key, ensuring that it's encrypted at rest. Additionally, the maximum period of time that events or data are retained is 24 hours in adherence with the [Event Grid retry policy](delivery-and-retry.md). Event Grid automatically deletes all events or data after 24 hours, or the event time-to-live, whichever is less.

## Permissions for event subscriptions
If you use an event handler that isn't a WebHook (such as an event hub or queue storage), you need write access to that resource. This permissions check prevents an unauthorized user from sending events to your resource.

You must have the **Microsoft.EventGrid/EventSubscriptions/Write** permission on the resource that is the event source. You need this permission because you're writing a new subscription at the scope of the resource. The required resource differs based on whether you're subscribing to a system topic or custom topic. Both types are described in this section.

### System topics (Azure service publishers)
For system topics, if you're not the owner or contributor of the source resource, you need permission to write a new event subscription at the scope of the resource that publishes the event. The format of the resource is:
`/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/{resource-provider}/{resource-type}/{resource-name}`

For example, to subscribe to an event on a storage account named **myacct**, you need the Microsoft.EventGrid/EventSubscriptions/Write permission on:
`/subscriptions/####/resourceGroups/testrg/providers/Microsoft.Storage/storageAccounts/myacct`

### Custom topics
For custom topics, you need permission to write a new event subscription at the scope of the Event Grid topic. The format of the resource is:
`/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.EventGrid/topics/{topic-name}`

For example, to subscribe to a custom topic named **mytopic**, you need the Microsoft.EventGrid/EventSubscriptions/Write permission on:
`/subscriptions/####/resourceGroups/testrg/providers/Microsoft.EventGrid/topics/mytopic`



## Related content

* For an introduction to Event Grid, see [About Event Grid](overview.md).
