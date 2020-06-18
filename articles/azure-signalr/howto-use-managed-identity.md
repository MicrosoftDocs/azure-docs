---
title: Managed identities in Azure SignalR Service
description: Learn how managed identities work in Azure SignalR Service, how to configure to use managed identity in serverless scenarios.
author: chenyl
ms.service: signalr
ms.topic: article
ms.date: 06/8/2020
ms.author: chenyl
---

# How to use managed identities for Azure SignalR Service

This topic shows you how to create a managed identity for Azure SignalR Service and how to use it in serverless scenarios.

> [!Important] 
> Azure SignalR Service can only support one managed identity. That means you can add either a system-assigned identity or one user-assigned identity. 

## Add a system-assigned identity

### Using the Azure portal

To set up a managed identity in the portal, you will first create a SignalR Service as normal and then enable the feature.

1. Create a SignalR Service in the portal as you normally would. Navigate to it in the portal.

2. Select **Identity**.

4. Within the **System assigned** tab, switch **Status** to **On**. Click **Save**.

    :::image type="content" source="media/signalr-howto-use-managed-identity/system-identity-portal.png" alt-text="Add system-assigned identity in Portal":::

## Add a user-assigned identity

Creating a SignalR Service with a user-assigned identity requires that you create the identity and then add its resource identifier to your service.

### Using the Azure portal

First, you'll need to create a user-assigned identity resource.

1. Create a user-assigned managed identity resource according to [these instructions](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal.md#create-a-user-assigned-managed-identity).

2. Create a SignalR Service in the portal as you normally would. Navigate to it in the portal.

3. Select **Identity**.

4. Within the **User assigned** tab, click **Add**.

5. Search for the identity you created earlier and select it. Click **Add**.

    :::image type="content" source="media/signalr-howto-use-managed-identity/user-identity-portal.png" alt-text="Add user-assigened identity in Portal":::

## Use managed identity in serverless scenarios

As SignalR Service is a fully managed service, so you cannot use managed identity to get tokens manually. Instead, SignalR Service uses the managed identity you set to obtain access token and set into `Authorization` header in an upstream request in serverless scenarios.

### Enable managed identity authentication in Upstream settings

1. Add a system-assigned identity or user-assigned identity

2. Configure upstream settings and use *ManagedIdentity* as the *Auth* settings. Find how to create upstream settings with authentication at [Upstream settings](concept-upstream.md#create-upstream-settings).

3. In the Managed identity auth settings, you can specify the target *Resource*. The *Resource* will become `aud` claim in the obtained access token, which can be used as a part of validation in your upstream endpoints. The *Resource* can be one of the following
    - Empty
    - Application (client) ID of the service principal
    - Application ID URI of the service principal
    - Resource IDs of Azure services, see [Resource ID of Azure Services](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/services-support-managed-identities#azure-services-that-support-azure-ad-authentication)

    > [!NOTE]
    > If you validate access token by yourself in your service, you can choose any one of the *Resource* format. As long as to make sure the *Resource* in *Auth* settings and the validation are consistent. If you use Data Plane RBAC, you must use the *Resource* that service provider requests.

### Validate access token

The token in `Authorization` header is a [Microsoft identity platform access token](https://docs.microsoft.com/azure/active-directory/develop/access-tokens#validating-tokens).

To validate access tokens, your app should also validate the audience, and the signing tokens. These need to be validated against the values in the OpenID discovery document. For example, the tenant-independent version of the document is located at [https://login.microsoftonline.com/common/.well-known/openid-configuration](https://login.microsoftonline.com/common/.well-known/openid-configuration).

The Azure AD middleware has built-in capabilities for validating access tokens, and you can browse through our [samples](https://docs.microsoft.com/azure/active-directory/develop/sample-v2-code) to find one in the language of your choice.

We provide libraries and code samples that show how to handle token validation. The below information is provided for those who wish to understand the underlying process. There are also several third-party open-source libraries available for JWT validation - there is at least one option for almost every platform and language out there. For more information about Azure AD authentication libraries and code samples, see [v2.0 authentication libraries](https://docs.microsoft.com/azure/active-directory/develop/reference-v2-libraries).

## Next steps

- [Azure Functions development and configuration with Azure SignalR Service](signalr-concept-serverless-development-config.md)
