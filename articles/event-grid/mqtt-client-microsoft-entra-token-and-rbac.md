---
title: Microsoft Entra `JWT` authentication and RBAC authorization for clients with Microsoft Entra identity
description: Describes JWT authentication and RBAC roles to authorize clients with Microsoft Entra identity to publish or subscribe MQTT messages
ms.topic: conceptual
ms.custom: build-2024
ms.date: 01/27/2025
author: Connected-Seth
ms.author: seshanmugam
ms.subservice: mqtt
---

# Microsoft Entra JWT authentication and Azure RBAC authorization to publish or subscribe MQTT messages

You can authenticate MQTT clients with Microsoft Entra JWT to connect to Event Grid namespace. You can use Azure role-based access control (Azure RBAC) to enable MQTT clients, with Microsoft Entra identity, to publish or subscribe access to specific topic spaces.

> [!IMPORTANT]
> - This feature is supported only when using MQTT v5 protocol version

## Prerequisites
- You need an Event Grid namespace with MQTT enabled. Learn about [creating Event Grid namespace](/azure/event-grid/create-view-manage-namespaces#create-a-namespace)

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
> - Audience: `aud` claim must be set to `https://eventgrid.azure.net/`.

## Authorization to grant access permissions
A client using Microsoft Entra ID based JWT authentication needs to be authorized to communicate with the Event Grid namespace. You can assign the following two built-in roles to provide either publish or subscribe permissions, to clients with Microsoft Entra identities.

- Use **EventGrid TopicSpaces Publisher** role to provide MQTT message publisher access
- Use **EventGrid TopicSpaces Subscriber** role to provide MQTT message subscriber access

You can use these roles to provide permissions at subscription, resource group, Event Grid namespace, or Event Grid topic space scope.

## Assigning the publisher role to your Microsoft Entra identity at topic space scope

1. In the Azure portal, navigate to your Event Grid namespace
1. Navigate to the topic space to which you want to authorize access.
1. Go to the Access control (IAM) page of the topic space
1. Select the **Role assignments** tab to view the role assignments at this scope.
1. Select **+ Add** and Add role assignment.
1. On the Role tab, select the "Event Grid TopicSpaces Publisher" role.
1. On the Members tab, for **Assign access to**, select User, group, or service principal option to assign the selected role to one or more service principals (applications).
1. Select **+ Select members**.
1. Find and select the service principals.
1. Select **Next**
1. Select **Review + assign** on the Review + assign tab.

> [!NOTE]
> You can follow similar steps to assign the built-in Event Grid TopicSpaces Subscriber role at topic space scope.

## Next steps
- See [Publish and subscribe to MQTT message using Event Grid](mqtt-publish-and-subscribe-portal.md)
- To learn more about how Managed Identities work, you can refer to [How managed identities for Azure resources work with Azure virtual machines - Microsoft Entra](/entra/identity/managed-identities-azure-resources/how-managed-identities-work-vm)  
- To learn more about how to obtain tokens from Microsoft Entra ID, you can refer to [obtaining Microsoft Entra tokens](/entra/identity-platform/v2-oauth2-client-creds-grant-flow#get-a-token)
- To learn more about Azure Identity client library, you can refer to [using Azure Identity client library](/entra/identity/managed-identities-azure-resources/how-to-use-vm-token#get-a-token-using-the-azure-identity-client-library)
- To learn more about implementing an interface for credentials that can provide a token, you can refer to [TokenCredential Interface](/java/api/com.azure.core.credential.tokencredential)
- To learn more about how to authenticate using Azure Identity, you can refer to [examples](https://github.com/Azure/azure-sdk-for-java/wiki/Azure-Identity-Examples)
- If you prefer to use custom roles, you can review the process to [create a custom role](../role-based-access-control/custom-roles-portal.md)
