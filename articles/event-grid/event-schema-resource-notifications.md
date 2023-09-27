---
title: Azure Resource Notifications - Overview 
description: This article provides information on Azure Event Grid events supported by Azure Resource Notifications. 
ms.topic: conceptual
ms.date: 09/26/2023
---

# Azure Resource Notifications overview
Azure Resource Notifications (ARN) represent the cutting-edge unified pub/sub service catering to all Azure resources. ARN taps into a diverse range of publishers, and this wealth of data is now accessible through ARN's dedicated system topics.

Here are the key advantages:

**Comprehensive Payloads:** Notifications delivered through ARN encompass the entire resource payload. This direct access leads to a reduction in read throttling, thereby enhancing your overall experience.

**Enhanced Filtering Capabilities:** The availability of payloads opens up a plethora of filtering options. Leverage the properties within the payload to fine-tune the notifications stream, tailoring it to your specific scenarios.

**Expanded Dataset Access**: ARN taps into multiple publishers, allowing it to offer datasets that may not be accessible through standard system topics.

**Robust Role-Based Access Control (RBAC):** ARN is fortified with a robust RBAC capability. This empowers you to configure users/service principals to subscribe exclusively to the data they have authorization for, within the scope of their acc

## RBAC for ARN system topics 

As of today, you need the following generic permissions provided by Event Grid to create system topics and event subscriptions

- `microsoft.eventgrid/eventsubscription/write`
- `microsoft.eventgrid/systemtopic/eventsubscriptions/write`

In addition to the above, we now require that you grant specific permissions, outlined below,  to users/security principals for accessing ARN system topics. For each topic type, we are exposing a distinct permission, ensuring precise and tailored access:

| Topic Type | Permission |
| ---------- | ---------- | 
| HealthResources | Microsoft.ResourceNotifications/systemTopics/subscribeToHealthResources/action |

To enhance customer experience, we are introducing a built-in role definition that encompasses all the requisite permissions for receiving data through any ARN system topic. This includes permissions mandated by Event Grid for system topic and event subscription creation. This built-in role definition will be regularly updated to incorporate additional topic types as they become accessible through our service. As a result, users assigned this built-in role will automatically gain access to all upcoming ARN topic types. You have the option to either utilize the provided built-in role definition or craft your own custom role definitions to enforce access control.

Built-in role definition: 

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you create system topics and event subscriptions on all system topics
exposed currently and in the future by Azure Resource Notifications.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/[guid]"
  "name": "[guid]",
  "permissions": [
    {
      "actions": [
        "Microsoft.EventGrid/eventSubscription/write",
        “Microsoft.EventGrid/systemTopics/eventSubscriptions/write",
        "Microsoft.ResourceNotifications/systemTopics/subscribeToResources/action",
       "Microsoft.ResourceNotifications/systemTopics/subscribeToHealthResources/action” ,
       “Microsoft.ResourceNotifications/systemTopics/subscribeToMaintenanceResources/action”
     ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Resource Notifications System Topics Subscriber",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Next steps
See [Azure Resource Notifications - Health Resources events in Azure Event Grid](event-schema-health-resources.md).