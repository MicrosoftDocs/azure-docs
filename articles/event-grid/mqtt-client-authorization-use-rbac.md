---
title: RBAC authorization for clients with Azure AD identity
description: Describes RBAC roles to authorize clients with Azure AD identity to publish or subscribe MQTT messages
ms.topic: conceptual
ms.date: 8/11/2023
author: veyaddan
ms.author: veyaddan
---

# Authorizing access to publish or subscribe to MQTT messages in Event Grid namespace
You can use Azure role-based access control (Azure RBAC) to enable MQTT clients, with Azure Active Directory identity, to publish or subscribe access to specific topic spaces.

## Prerequisites
- You need an Event Grid namespace with MQTT enabled.  [Learn about creating Event Grid namespace](/azure/event-grid/create-view-manage-namespaces#create-a-namespace)
- Review the process to [create a custom role](/azure/role-based-access-control/custom-roles-portal)

## Operation types
You can use following two data actions to provide publish or subscribe permissions to clients with Azure AD identities on specific topic spaces.

**Topic spaces publish** data action
Microsoft.EventGrid/topicSpaces/publish/action

**Topic spaces subscribe** data action
Microsoft.EventGrid/topicSpaces/subscribe/action

> [!NOTE]
> Currently, we recommend using custom roles with the actions provided.

## Custom roles

You can create custom roles using the publish and subscribe actions.

The following are sample role definitions that allow you to publish and subscribe to MQTT messages.  These custom roles give permissions at topic space scope.  You can also create roles to provide permissions at subscription, resource group scope.

**EventGridMQTTPublisherRole.json**: MQTT messages publish operation.

```json
{
  "roleName": "Event Grid namespace MQTT publisher",
  "description": "Event Grid namespace MQTT message publisher role",
  "assignableScopes": [
    "/subscriptions/<subscription ID>/resourceGroups/<resource group name>/Microsoft.EventGrid/namespaces/<namespace name>/topicSpaces/<topicspace name>"
  ],
  "permissions": [
      {
          "actions": [],
          "notActions": [],
          "dataActions": [
              "Microsoft.EventGrid/topicSpaces/publish/action"
          ],
          "notDataActions": []
      }
  ]
}
```

**EventGridMQTTSubscriberRole.json**: MQTT messages subscribe operation.

```json
{
  "roleName": "Event Grid namespace MQTT subscriber",
  "description": "Event Grid namespace MQTT message subscriber role",
  "assignableScopes": [
    "/subscriptions/<subscription ID>/resourceGroups/<resource group name>/Microsoft.EventGrid/namespaces/<namespace name>/topicSpaces/<topicspace name>"
  ]
  "permissions": [
      {
          "actions": [],
          "notActions": [],
          "dataActions": [
              "Microsoft.EventGrid/topicSpaces/subscribe/action"
          ],
          "notDataActions": []
      }
  ]
}
```

## Create custom roles in Event Grid namespace
1. Navigate to topic spaces page in Event Grid namespace
1. Select the topic space for which the custom RBAC role needs to be created
1. Navigate to the Access control (IAM) page within the topic space
1. In the Roles tab, right select any of the roles to clone a new custom role.  Provide the custom role name.
1. Switch the Baseline permissions to **Start from scratch**
1. On the Permissions tab, select **Add permissions**
1. In the selection page, find and select Microsoft Event Grid
    :::image type="content" source="./media/mqtt-rbac-authorization-aad-clients/event-grid-custom-role-permissions.png" lightbox="./media/mqtt-rbac-authorization-aad-clients/event-grid-custom-role-permissions.png" alt-text="Screenshot showing the Microsoft Event Grid option to find the permissions.":::
1. Navigate to Data Actions
1. Select **Topic spaces publish** data action and select **Add**
    :::image type="content" source="./media/mqtt-rbac-authorization-aad-clients/event-grid-custom-role-permissions-data-actions.png" lightbox="./media/mqtt-rbac-authorization-aad-clients/event-grid-custom-role-permissions-data-actions.png" alt-text="Screenshot showing the data action selection.":::
1. Select Next to see the topic space in the Assignable scopes tab.  You can add other assignable scopes if needed.
1. Select **Create** in Review + create tab to create the custom role.
1. Once the custom role is created, you can assign the role to an identity to provide the publish permission on the topic space.  You can learn how to assign roles [here](/azure/role-based-access-control/role-assignments-portal).

> [!NOTE]
> You can follow similar steps to create and assign a custom Event Grid MQTT subscriber permission to a topic space.

## Next steps
See [Publish and subscribe to MQTT message using Event Grid](mqtt-publish-and-subscribe-portal.md)
