---
title: Azure Event Grid security and authentication
description: Describes Azure Event Grid and its concepts.
services: event-grid
author: banisadr
manager: timlt

ms.service: event-grid
ms.topic: article
ms.date: 09/18/2017
ms.author: babanisa
---
# Event Grid security and authentication 

Azure Event Grid has three types of authentication:

* Event subscriptions
* Event publishing
* WebHook event delivery

## WebHook Event delivery

Webhooks are one of many ways to receive events in real time from Azure Event Grid. Every time there is a new event ready to be delivered, the Event Grid Webhook seeds an HTTP request to the configured HTTP endpoint with the event in the body.

When you register your own WebHook endpoint with Event Grid, it sends you a POST request with a simple validation code in order to prove endpoint ownership. Your app needs to respond by echoing back the validation code. Event Grid does not deliver events to WebHook endpoints that have not passed the validation.

### Validation details

* At the time of event subscription creation/update, Event Grid posts a "SubscriptionValidationEvent" event to the target endpoint.
* The event contains a header value "Aeg-Event-Type: SubscriptionValidation".
* The event body has the same schema as other Event Grid events.
* The event data includes a "validationCode" property with a randomly generated string. For example, "validationCode: acb13…".

An example SubscriptionValidationEvent is shown in the following example:

```json
[{
  "id": "2d1781af-3a4c-4d7c-bd0c-e34b19da4e66",
  "topic": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "subject": "",
  "data": {
    "validationCode": "512d38b6-c7b8-40c8-89fe-f46f9e9622b6"
  },
  "eventType": "Microsoft.EventGrid.SubscriptionValidationEvent",
  "eventTime": "2017-08-06T22:09:30.740323Z"
}]
```

In order to prove endpoint ownership, echo back the validation code in the validationResponse property, as shown in the following example:

```json
{
  "validationResponse": "512d38b6-c7b8-40c8-89fe-f46f9e9622b6"
}
```

Finally, it is important to note that Azure Event Grid only supports HTTPS webhook endpoints.

## Event subscription

To subscribe to an event, you must have the **Microsoft.EventGrid/EventSubscriptions/Write** permission on the required resource. You need this permission because you are writing a new subscription at the scope of the resource. The required resource differs based on whether you are subscribing to a system topic or custom topic. Both types are described in this section.

### System topics (Azure service publishers)

For system topics, you need permission to write a new event subscription at the scope of the resource publishing the event. The format of the resource is:
`/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/{resource-provider}/{resource-type}/{resource-name}`

For example, to subscribe to an event on a storage account named **myacct**, you need the Microsoft.EventGrid/EventSubscriptions/Write permission on:
`/subscriptions/####/resourceGroups/testrg/providers/Microsoft.Storage/storageAccounts/myacct`

### Custom topics

For custom topics, you need permission to write a new event subscription at the scope of the Event Grid topic. The format of the resource is:
`/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.EventGrid/topics/{topic-name}`

For example, to subscribe to a custom topic named **mytopic**, you need the Microsoft.EventGrid/EventSubscriptions/Write permission on:
`/subscriptions/####/resourceGroups/testrg/providers/Microsoft.EventGrid/topics/mytopic`

## Topic publishing

Topics use either Shared Access Signature (SAS) or key authentication. We recommend SAS, but key authentication provides simple programming, and is compatible with many existing webhook publishers. 

You include the authentication value in the HTTP header. For SAS, use **aeg-sas-token** for the header value. For key authentication, use **aeg-sas-key** for the header value.

### Key authentication

Key authentication is the simplest form of authentication. Use the format: `aeg-sas-key: <your key>`

For example, you pass a key with:

```
aeg-sas-key: VXbGWce53249Mt8wuotr0GPmyJ/nDT4hgdEj9DpBeRr38arnnm5OFg==
```

### SAS tokens

SAS tokens for Event Grid include the resource, an expiration time, and a signature. The format of the SAS token is: `r={resource}&e={expiration}&s={signature}`.

The resource is the path for the topic to which you are sending events. For example, a valid resource path is: `https://<yourtopic>.<region>.eventgrid.azure.net/eventGrid/api/events`

You generate the signature from a key.

For example, a valid **aeg-sas-token** value is:

```http
aeg-sas-token: r=https%3a%2f%2fmytopic.eventgrid.azure.net%2feventGrid%2fapi%2fevent&e=6%2f15%2f2017+6%3a20%3a15+PM&s=a4oNHpRZygINC%2fBPjdDLOrc6THPy3tDcGHw1zP4OajQ%3d
```

The following example creates a SAS token for use with Event Grid:

```cs
static string BuildSharedAccessSignature(string resource, DateTime expirationUtc, string key)
{
    const char Resource = 'r';
    const char Expiration = 'e';
    const char Signature = 's';

    string encodedResource = HttpUtility.UrlEncode(resource);
    var culture = CultureInfo.CreateSpecificCulture("en-US");
    var encodedExpirationUtc = HttpUtility.UrlEncode(expirationUtc.ToString(culture));

    string unsignedSas = $"{Resource}={encodedResource}&{Expiration}={encodedExpirationUtc}";
    using (var hmac = new HMACSHA256(Convert.FromBase64String(key)))
    {
        string signature = Convert.ToBase64String(hmac.ComputeHash(Encoding.UTF8.GetBytes(unsignedSas)));
        string encodedSignature = HttpUtility.UrlEncode(signature);
        string signedSas = $"{unsignedSas}&{Signature}={encodedSignature}";

        return signedSas;
    }
}
```

## Management Access Control

Azure Event Grid allows you to control the level of access given to different users to do various management operations such as list event subscriptions, create new ones, and generate keys. Event Grid utilizes Azure's Role Based Access Check (RBAC).

### Operation types

Azure event grid supports the following actions:

* Microsoft.EventGrid/*/read
* Microsoft.EventGrid/*/write
* Microsoft.EventGrid/*/delete
* Microsoft.EventGrid/eventSubscriptions/getFullUrl/action
* Microsoft.EventGrid/topics/listKeys/action
* Microsoft.EventGrid/topics/regenerateKey/action

The last three operations return potentially secret information, which gets filtered out of normal read operations. It is best practice for you to restrict access to these operations. Custom roles can be created using [Azure PowerShell](../active-directory/role-based-access-control-manage-access-powershell.md), [Azure Command-Line Interface (CLI)](../active-directory/role-based-access-control-manage-access-azure-cli.md), and the [REST API](../active-directory/role-based-access-control-manage-access-rest.md).

### Enforcing Role Based Access Check (RBAC)

Use the following steps to enforce RBAC for different users:

#### Create a custom role definition file (.json)

The following are sample Event Grid role definitions that allow users to perform different sets of actions.

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

#### Create and assign custom role with Azure CLI

To create a custom role, use:

```azurecli
az role definition create --role-definition @<file path>
```

To assign the role to a user, use:

```azurecli
az role assignment create --assignee <user name> --role "<name of role>"
```

## Next steps

* For an introduction to Event Grid, see [About Event Grid](overview.md)
