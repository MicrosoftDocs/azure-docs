---
title: Azure Event Grid security and authentication
description: Describes Azure Event Grid and its concepts.
services: event-grid
author: banisadr
manager: timlt

ms.service: event-grid
ms.topic: conceptual
ms.date: 10/09/2018
ms.author: babanisa
---
# Event Grid security and authentication 

Azure Event Grid has three types of authentication:

* WebHook event delivery
* Event subscriptions
* Custom topic publishing

## WebHook Event delivery

Webhooks are one of the many ways to receive events from Azure Event Grid. When a new event is ready, EventGrid service POSTs an HTTP request to the configured endpoint with the event in the request body.

Like many other services that support webhooks, EventGrid requires you to prove "ownership" of your Webhook endpoint before it starts delivering events to that endpoint. This requirement is to prevent an unsuspecting endpoint from becoming the target endpoint for event delivery from EventGrid. However, when you use any of the three Azure services listed below, the Azure infrastructure automatically handles this validation:

* Azure Logic Apps,
* Azure Automation,
* Azure Functions for EventGrid Trigger.

If you're using any other type of endpoint, such as an HTTP trigger based Azure function, your endpoint code needs to participate in a validation handshake with EventGrid. EventGrid supports two different validation handshake models:

1. **ValidationCode handshake**: At the time of event subscription creation, EventGrid POSTs a "subscription validation event" to your endpoint. The schema of this event is similar to any other EventGridEvent, and the data portion of this event includes a `validationCode` property. Once your application has verified that the validation request is for an expected event subscription, your application code needs to respond by echoing back the validation code to EventGrid. This handshake mechanism is supported in all EventGrid versions.

2. **ValidationURL handshake (Manual handshake)**: In certain cases, you may not have control of the source code of the endpoint to be able to implement the ValidationCode based handshake. For example, if you use a third-party service (like [Zapier](https://zapier.com) or [IFTTT](https://ifttt.com/)), you might not be able to programmatically respond back with the validation code. Starting with version 2018-05-01-preview, EventGrid now supports a manual validation handshake. If you're creating an event subscription using SDK/tools that use this new API version (2018-05-01-preview), EventGrid sends a `validationUrl` property as part of the data portion of the subscription validation event. To complete the handshake, just do a GET request on that URL, either through a REST client or using your web browser. The provided validation URL is valid only for about 10 minutes. During that time, the provisioning state of the event subscription is `AwaitingManualAction`. If you don't complete the manual validation within 10 minutes, the provisioning state is set to `Failed`. You'll have to create the event subscription again before attempting the manual validation.

This mechanism of manual validation is in preview. To use it, you must install the [Event Grid extension](/cli/azure/azure-cli-extensions-list) for [Azure CLI](/cli/azure/install-azure-cli). You can install it with `az extension add --name eventgrid`. If you're using the REST API, make sure you're using `api-version=2018-05-01-preview`.

### Validation details

* At the time of event subscription creation/update, Event Grid posts a Subscription Validation Event to the target endpoint. 
* The event contains a header value "aeg-event-type: SubscriptionValidation".
* The event body has the same schema as other Event Grid events.
* The eventType property of the event is `Microsoft.EventGrid.SubscriptionValidationEvent`.
* The data property of the event includes a `validationCode` property with a randomly generated string. For example, "validationCode: acb13…".
* If you're using API version 2018-05-01-preview, the event data also includes a `validationUrl` property with a URL for manually validating the subscription.
* The array contains only the validation event. Other events are sent in a separate request after you echo back the validation code.
* The EventGrid DataPlane SDKs have classes corresponding to the subscription validation event data and subscription validation response.

An example SubscriptionValidationEvent is shown in the following example:

```json
[{
  "id": "2d1781af-3a4c-4d7c-bd0c-e34b19da4e66",
  "topic": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "subject": "",
  "data": {
    "validationCode": "512d38b6-c7b8-40c8-89fe-f46f9e9622b6",
    "validationUrl": "https://rp-eastus2.eventgrid.azure.net:553/eventsubscriptions/estest/validate?id=B2E34264-7D71-453A-B5FB-B62D0FDC85EE&t=2018-04-26T20:30:54.4538837Z&apiVersion=2018-05-01-preview&token=1BNqCxBBSSE9OnNSfZM4%2b5H9zDegKMY6uJ%2fO2DFRkwQ%3d"
  },
  "eventType": "Microsoft.EventGrid.SubscriptionValidationEvent",
  "eventTime": "2018-01-25T22:12:19.4556811Z",
  "metadataVersion": "1",
  "dataVersion": "1"
}]
```

To prove endpoint ownership, echo back the validation code in the validationResponse property, as shown in the following example:

```json
{
  "validationResponse": "512d38b6-c7b8-40c8-89fe-f46f9e9622b6"
}
```

Or, you can manually validate the subscription by sending a GET request to the validation URL. The event subscription stays in a pending state until validated.

You can find C# Sample that shows how to handle the subscription validation handshake at https://github.com/Azure-Samples/event-grid-dotnet-publish-consume-events/blob/master/EventGridConsumer/EventGridConsumer/Function1.cs.

### Checklist

During event subscription creation, if you're seeing an error message such as "The attempt to validate the provided endpoint https://your-endpoint-here failed. For more details, visit https://aka.ms/esvalidation", it indicates that there's a failure in the validation handshake. To resolve this error, verify the following aspects:

* Do you have control of the application code in the target endpoint? For example, if you're writing an HTTP trigger based Azure Function, do you have access to the application code to make changes to it?
* If you have access to the application code, implement the ValidationCode based handshake mechanism as shown in the sample above.

* If you don't have access to the application code (for example, if you're using a third-party service that supports webhooks), you can use the manual handshake mechanism. Make sure you're using the 2018-05-01-preview API version or later (install Event Grid Azure CLI extension) to receive the validationUrl in the validation event. To complete the manual validation handshake, get the value of the `validationUrl` property and visit that URL in your web browser. If validation is successful, you should see a message in your web browser that validation is successful. You'll see that event subscription's provisioningState is "Succeeded". 

### Event delivery security

You can secure your webhook endpoint by adding query parameters to the webhook URL when creating an Event Subscription. Set one of these query parameters to be a secret such as an [access token](https://en.wikipedia.org/wiki/Access_token) which the webhook can use to recognize the event is coming from Event Grid with valid permissions. Event Grid will include these query parameters in every event delivery to the webhook.

When editing the Event Subscription, the query parameters aren't displayed or returned unless the [--include-full-endpoint-url](https://docs.microsoft.com/cli/azure/eventgrid/event-subscription?view=azure-cli-latest#az-eventgrid-event-subscription-show) parameter is used in Azure [CLI](https://docs.microsoft.com/cli/azure?view=azure-cli-latest).

Finally, it's important to note that Azure Event Grid only supports HTTPS webhook endpoints.

## Event subscription

To subscribe to an event, you must prove that you have access to the event source and handler. Proving that you own a WebHook was covered in the preceding section. If you're using an event handler that isn't a WebHook (such as an event hub or queue storage), you need write access to that resource. This permissions check prevents an unauthorized user from sending events to your resource.

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

## Custom topic publishing

Custom topics use either Shared Access Signature (SAS) or key authentication. We recommend SAS, but key authentication provides simple programming, and is compatible with many existing webhook publishers. 

You include the authentication value in the HTTP header. For SAS, use **aeg-sas-token** for the header value. For key authentication, use **aeg-sas-key** for the header value.

### Key authentication

Key authentication is the simplest form of authentication. Use the format: `aeg-sas-key: <your key>`

For example, you pass a key with:

```
aeg-sas-key: VXbGWce53249Mt8wuotr0GPmyJ/nDT4hgdEj9DpBeRr38arnnm5OFg==
```

### SAS tokens

SAS tokens for Event Grid include the resource, an expiration time, and a signature. The format of the SAS token is: `r={resource}&e={expiration}&s={signature}`.

The resource is the path for the event grid topic to which you're sending events. For example, a valid resource path is: `https://<yourtopic>.<region>.eventgrid.azure.net/eventGrid/api/events`

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

Azure Event Grid allows you to control the level of access given to different users to do various management operations such as list event subscriptions, create new ones, and generate keys. Event Grid uses Azure's Role Based Access Check (RBAC).

### Operation types

Azure event grid supports the following actions:

* Microsoft.EventGrid/*/read
* Microsoft.EventGrid/*/write
* Microsoft.EventGrid/*/delete
* Microsoft.EventGrid/eventSubscriptions/getFullUrl/action
* Microsoft.EventGrid/topics/listKeys/action
* Microsoft.EventGrid/topics/regenerateKey/action

The last three operations return potentially secret information, which gets filtered out of normal read operations. It's recommended that you restrict access to these operations. Custom roles can be created using [Azure PowerShell](../role-based-access-control/role-assignments-powershell.md), [Azure Command-Line Interface (CLI)](../role-based-access-control/role-assignments-cli.md), and the [REST API](../role-based-access-control/role-assignments-rest.md).

### Enforcing Role Based Access Check (RBAC)

Use the following steps to enforce RBAC for different users:

#### Create a custom role definition file (.json)

The following are sample Event Grid role definitions that allow users to take different actions.

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
