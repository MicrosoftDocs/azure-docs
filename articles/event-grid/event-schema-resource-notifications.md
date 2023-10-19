---
title: Azure Resource Notifications - Overview 
description: This article provides information on Azure Event Grid events supported by Azure Resource Notifications. 
ms.topic: conceptual
ms.date: 09/26/2023
---

# Azure Resource Notifications overview
Azure Resource Notifications (ARN) represent the cutting-edge unified pub/sub service catering to all Azure resources. ARN taps into a diverse range of publishers, and this wealth of data is now accessible through ARN's dedicated system topics in Azure Event Grid.

Here are the key advantages:

- **Comprehensive payloads:** Notifications delivered through ARN encompass the entire resource payload. This direct access leads to a reduction in read throttling, thereby enhancing your overall experience.
- **Enhanced filtering capabilities:** The availability of payloads opens up a plethora of filtering options. Use the properties within the payload to fine-tune the notifications stream, tailoring it to your specific scenarios.
- **Expanded dataset access**: ARN taps into multiple publishers, allowing it to offer datasets that may not be accessible through standard system topics.
- **Robust Role-Based Access Control (RBAC):** ARN is fortified with a robust RBAC capability. This feature empowers you to configure users or service principals to subscribe exclusively to the data they have authorization for, within the scope of their access.

## RBAC for ARN system topics 
All the events under ARN system topics are exclusively emitted at the Azure subscription scope. It implies that the entity creating the event subscription for a given topic type receives notifications for the corresponding events across the entire Azure subscription. For security reasons, it's' imperative to restrict the ability to create event subscriptions on this topic to principals with read access over the entire Azure subscription. 

As of today, you need the following generic permissions provided by Event Grid to create system topics and event subscriptions.

- `microsoft.eventgrid/eventsubscription/write`
- `microsoft.eventgrid/systemtopic/eventsubscriptions/write`

In addition to these permissions, you need to grant the following permissions to users or security principals for accessing ARN system topics. For each topic type,  distinct permissions are exposed, ensuring precise and tailored access:

| Topic Type | Permission |
| ---------- | ---------- | 
| HealthResources | `Microsoft.ResourceNotifications/systemTopics/subscribeToHealthResources/action` |

To enhance customer experience, a built-in role definition that encompasses all the requisite permissions for receiving data through any ARN system topic is available. This role includes permissions mandated by Event Grid for system topic and event subscription creation. This built-in role definition is regularly updated to incorporate more topic types as they become accessible through our service. **As a result, users assigned this built-in role automatically gains access to all future ARN topic types**. You can choose to either utilize the provided built-in role definition or craft your own custom role definitions to enforce access control.

### Built-in role definition: 

```json
{
    "assignableScopes": [
        "/"
    ],
    "description": "Lets you create system topics and event subscriptions on all system topics exposed currently and in the future by Azure Resource Notifications.",
    "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/[guid]",
    "name": "[guid]",
    "permissions": [{
    "actions": [
        "Microsoft.EventGrid/eventSubscription/write",
        "Microsoft.EventGrid/systemTopics/eventSubscriptions/write",
        "Microsoft.ResourceNotifications/systemTopics/subscribeToResources/action",
        "Microsoft.ResourceNotifications/systemTopics/subscribeToHealthResources/action",
        "Microsoft.ResourceNotifications/systemTopics/subscribeToMaintenanceResources/action"
    ],
    "notActions": [],
    "dataActions": [],
    "notDataActions": []
    }],
    "roleName": "Azure Resource Notifications System Topics Subscriber",
    "roleType": "BuiltInRole",
    "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Contact us
If you have any questions or feedback on this feature, don't hesitate to reach us at [arnsupport@microsoft.com](mailto:arnsupport@microsoft.com). 


## Next steps
See [Azure Resource Notifications - Health Resources events in Azure Event Grid](event-schema-health-resources.md).
