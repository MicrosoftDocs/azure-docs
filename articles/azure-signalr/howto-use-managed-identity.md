---
title: Managed identities in Azure SignalR Service
description: Learn how managed identities work in Azure SignalR Service, and how to use a managed identity in serverless scenarios.
author: chenyl
ms.service: signalr
ms.topic: article
ms.date: 06/8/2020
ms.author: chenyl
---

# Managed identities for Azure SignalR Service

This article shows you how to create a managed identity for Azure SignalR Service and how to use it in serverless scenarios.

> [!Important] 
> Azure SignalR Service can support only one managed identity. That means you can add either a system-assigned identity or a user-assigned identity. 

## Add a system-assigned identity

To set up a managed identity in the Azure portal, you'll first create an Azure SignalR Service instance and then enable the feature.

1. Create an Azure SignalR Service instance in the portal as you normally would. Browse to it in the portal.

2. Select **Identity**.

4. On the **System assigned** tab, switch **Status** to **On**. Select **Save**.

    :::image type="content" source="media/signalr-howto-use-managed-identity/system-identity-portal.png" alt-text="Add a system-assigned identity in the portal":::

## Add a user-assigned identity

Creating an Azure SignalR Service instance with a user-assigned identity requires that you create the identity and then add its resource identifier to your service.

1. Create a user-assigned managed identity resource according to [these instructions](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal.md#create-a-user-assigned-managed-identity).

2. Create an Azure SignalR Service instance in the portal as you normally would. Browse to it in the portal.

3. Select **Identity**.

4. On the **User assigned** tab, select **Add**.

5. Search for the identity that you created earlier and select it. Select **Add**.

    :::image type="content" source="media/signalr-howto-use-managed-identity/user-identity-portal.png" alt-text="Add a user-assigned identity in the portal":::

## Use a managed identity in serverless scenarios

Azure SignalR Service is a fully managed service, so you can't use a managed identity to get tokens manually. Instead, Azure SignalR Service uses the managed identity that you set to obtain an access token. The service then sets the access token into an `Authorization` header in an upstream request in serverless scenarios.

### Enable managed identity authentication in upstream settings

1. Add a system-assigned identity or user-assigned identity.

2. Configure upstream settings and use **ManagedIdentity** as the **Auth** settings. To learn how to create upstream settings with authentication, see [Upstream settings](concept-upstream.md).

3. In the managed identity authentication settings, for **Resource**, you can specify the target resource. The resource will become an `aud` claim in the obtained access token, which can be used as a part of validation in your upstream endpoints. The resource can be one of the following:
    - Empty
    - Application (client) ID of the service principal
    - Application ID URI of the service principal
    - [Resource ID of an Azure service](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/services-support-managed-identities#azure-services-that-support-azure-ad-authentication)

    > [!NOTE]
    > If you validate an access token by yourself in your service, you can choose any one of the resource formats. Just make sure that the **Resource** value in **Auth** settings and the validation are consistent. If you use role-based access control (RBAC) for a data plane, you must use the resource that the service provider requests.

### Validate access tokens

The token in the `Authorization` header is a [Microsoft identity platform access token](https://docs.microsoft.com/azure/active-directory/develop/access-tokens#validating-tokens).

To validate access tokens, your app should also validate the audience and the signing tokens. These need to be validated against the values in the OpenID discovery document. For example, see the [tenant-independent version of the document](https://login.microsoftonline.com/common/.well-known/openid-configuration).

The Azure Active Directory (Azure AD) middleware has built-in capabilities for validating access tokens. You can browse through our [samples](https://docs.microsoft.com/azure/active-directory/develop/sample-v2-code) to find one in the language of your choice.

We provide libraries and code samples that show how to handle token validation. There are also several open-source partner libraries available for JSON Web Token (JWT) validation. There's at least one option for almost every platform and language out there. For more information about Azure AD authentication libraries and code samples, see [Microsoft identity platform authentication libraries](https://docs.microsoft.com/azure/active-directory/develop/reference-v2-libraries).

## Next steps

- [Azure Functions development and configuration with Azure SignalR Service](signalr-concept-serverless-development-config.md)
