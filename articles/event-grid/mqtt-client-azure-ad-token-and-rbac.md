---
title: Microsoft Entra JWT authentication and RBAC authorization for clients with Microsoft Entra identity
description: Describes JWT authentication and RBAC roles to authorize clients with Microsoft Entra identity to publish or subscribe MQTT messages
ms.topic: conceptual
ms.date: 8/11/2023
author: veyaddan
ms.author: veyaddan
---

# Microsoft Entra JWT authentication and Azure RBAC authorization to publish or subscribe MQTT messages
You can authenticate MQTT clients with Microsoft Entra JWT to connect to Event Grid namespace.  You can use Azure role-based access control (Azure RBAC) to enable MQTT clients, with Microsoft Entra identity, to publish or subscribe access to specific topic spaces.

> [!IMPORTANT]
> This feature is supported only when using MQTT v5

## Prerequisites
- You need an Event Grid namespace with MQTT enabled.  Learn about [creating Event Grid namespace](/azure/event-grid/create-view-manage-namespaces#create-a-namespace)
- Review the process to [create a custom role](/azure/role-based-access-control/custom-roles-portal)


<a name='authentication-using-azure-ad-jwt'></a>

## Authentication using Microsoft Entra JWT
You can use the MQTT v5 CONNECT packet to provide the Microsoft Entra JWT token to authenticate your client, and you can use the MQTT v5 AUTH packet to refresh the token.  

In CONNECT packet, you can provide required values in the following fields:

|Field  | Value  |
|---------|---------|
|Authentication Method | OAUTH2-JWT |
|Authentication Data | JWT token |

In AUTH packet, you can provide required values in the following fields:

|Field | Value |
|---------|---------|
| Authentication Method | OAUTH2-JWT |
| Authentication Data | JWT token |
| Authentication Reason Code | 25 |
 
Authenticate Reason Code with value 25 signifies reauthentication.

> [!NOTE]
> Audience: “aud” claim must be set to "https://eventgrid.azure.net/".

## Authorization to grant access permissions
A client using Microsoft Entra ID based JWT authentication needs to be authorized to communicate with the Event Grid namespace.  You can create custom roles to enable the client to communicate with Event Grid instances in your resource group, and then assign the roles to the client.  You can use following two data actions to provide publish or subscribe permissions, to clients with Microsoft Entra identities, on specific topic spaces.

**Topic spaces publish** data action
Microsoft.EventGrid/topicSpaces/publish/action

**Topic spaces subscribe** data action
Microsoft.EventGrid/topicSpaces/subscribe/action

> [!NOTE]
> Currently, we recommend using custom roles with the actions provided.

### Custom roles

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

## Create custom roles
1. Navigate to topic spaces page in your Event Grid namespace
1. Select the topic space for which the custom RBAC role needs to be created
1. Navigate to the Access control (IAM) page within the topic space
1. In the Roles tab, right select any of the roles to clone a new custom role.  Provide the custom role name.
1. Switch the Baseline permissions to **Start from scratch**
1. On the Permissions tab, select **Add permissions**
1. In the selection page, find and select Microsoft Event Grid
    :::image type="content" source="./media/mqtt-client-azure-ad-token-and-rbac/event-grid-custom-role-permissions.png" lightbox="./media/mqtt-client-azure-ad-token-and-rbac/event-grid-custom-role-permissions.png" alt-text="Screenshot showing the Microsoft Event Grid option to find the permissions.":::
1. Navigate to Data Actions
1. Select **Topic spaces publish** data action and select **Add**
    :::image type="content" source="./media/mqtt-client-azure-ad-token-and-rbac/event-grid-custom-role-permissions-data-actions.png" lightbox="./media/mqtt-client-azure-ad-token-and-rbac/event-grid-custom-role-permissions-data-actions.png" alt-text="Screenshot showing the data action selection.":::
1. Select Next to see the topic space in the Assignable scopes tab.  You can add other assignable scopes if needed.
1. Select **Create** in Review + create tab to create the custom role.
1. Once the custom role is created, you can assign the role to an identity to provide the publish permission on the topic space.  You can learn how to assign roles [here](/azure/role-based-access-control/role-assignments-portal).

<a name='assign-the-custom-role-to-your-azure-ad-identity'></a>

## Assign the custom role to your Microsoft Entra identity
1. In the Azure portal, navigate to your Event Grid namespace
1. Navigate to the topic space to which you want to authorize access.
1. Go to the Access control (IAM) page of the topic space
1. Select the **Role assignments** tab to view the role assignments at this scope.
1. Select **+ Add** and Add role assignment.
1. On the Role tab, select the role that you created in the previous step.
1. On the Members tab, select User, group, or service principal to assign the selected role to one or more service principals (applications).
    - Users and groups work when user/group belong to fewer than 200 groups.
1. Select **Select members**.
1. Find and select the users, groups, or service principals.
1. Select **Review + assign** on the Review + assign tab.

> [!NOTE]
> You can follow similar steps to create and assign a custom Event Grid MQTT subscriber permission to a topic space.

## Next steps
- See [Publish and subscribe to MQTT message using Event Grid](mqtt-publish-and-subscribe-portal.md)
- To learn more about how Managed Identities work, you can refer to [How managed identities for Azure resources work with Azure virtual machines - Microsoft Entra](/azure/active-directory/managed-identities-azure-resources/how-managed-identities-work-vm)  
- To learn more about how to obtain tokens from Microsoft Entra ID, you can refer to [obtaining Microsoft Entra tokens](/azure/active-directory/develop/v2-oauth2-client-creds-grant-flow#get-a-token)
- To learn more about Azure Identity client library, you can refer to [using Azure Identity client library](/azure/active-directory/managed-identities-azure-resources/how-to-use-vm-token#get-a-token-using-the-azure-identity-client-library)
- To learn more about implementing an interface for credentials that can provide a token, you can refer to [TokenCredential Interface](/java/api/com.azure.core.credential.tokencredential)
- To learn more about how to authenticate using Azure Identity, you can refer to [examples](https://github.com/Azure/azure-sdk-for-java/wiki/Azure-Identity-Examples)
