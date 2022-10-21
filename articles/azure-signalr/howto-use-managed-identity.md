---
title: Managed identities in Azure SignalR Service
description: Learn how managed identities work in Azure SignalR Service, and how to use a managed identity in serverless scenarios.
author: vicancy
ms.service: signalr
ms.topic: article
ms.date: 06/8/2020
ms.author: lianwei
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

5. Search for the identity that you created earlier and selects it. Select **Add**.

    :::image type="content" source="media/signalr-howto-use-managed-identity/user-identity-portal.png" alt-text="Add a user-assigned identity in the portal":::

## Use a managed identity in serverless scenarios

Azure SignalR Service is a fully managed service, so you can't use a managed identity to get tokens manually. Instead, Azure SignalR Service uses the managed identity that you set to obtain an access token. The service then sets the access token into an `Authorization` header in an upstream request in serverless scenarios.

### Enable managed identity authentication in upstream settings

1. Add a system-assigned identity or user-assigned identity.

2. Add one Upstream Setting and click any asterisk to get into a detailed page as shown below.
    :::image type="content" source="media/signalr-howto-use-managed-identity/pre-msi-settings.png" alt-text="pre-msi-setting":::
    
    :::image type="content" source="media/signalr-howto-use-managed-identity/msi-settings.png" alt-text="msi-setting":::

3. In the managed identity authentication settings, for **Resource**, you can specify the target resource. The resource will become an `aud` claim in the obtained access token, which can be used as a part of validation in your upstream endpoints. The resource can be one of the following:
    - Empty
    - Application (client) ID of the service principal
    - Application ID URI of the service principal
    - [Resource ID of an Azure service](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md#azure-services-that-support-azure-ad-authentication)

    > [!NOTE]
    > If you validate an access token by yourself in your service, you can choose any one of the resource formats. Just make sure that the **Resource** value in **Auth** settings and the validation are consistent. If you use Azure role-based access control (Azure RBAC) for a data plane, you must use the resource that the service provider requests.

### Validate access tokens

The token in the `Authorization` header is a [Microsoft identity platform access token](../active-directory/develop/access-tokens.md).

To validate access tokens, your app should also validate the audience and the signing tokens. These need to be validated against the values in the OpenID discovery document. For example, see the [tenant-independent version of the document](https://login.microsoftonline.com/common/.well-known/openid-configuration).

The Azure Active Directory (Azure AD) middleware has built-in capabilities for validating access tokens. You can browse through our [samples](../active-directory/develop/sample-v2-code.md) to find one in the language of your choice.

We provide libraries and code samples that show how to handle token validation. There are also several open-source partner libraries available for JSON Web Token (JWT) validation. There's at least one option for almost every platform and language out there. For more information about Azure AD authentication libraries and code samples, see [Microsoft identity platform authentication libraries](../active-directory/develop/reference-v2-libraries.md).

#### Authentication in Function App

Setting access token validation in Function App is easy and efficient without code works.

1. In the **Authentication** page, click **Add identity provider**

2. Select **Log in with Azure Active Directory** in **Action to take when request is not authenticated**.

3. Select **Microsoft** in the identity provider dropdown. The option to create a new registration is selected by default. You can change the name of the registration. For more details on enabling Azure AD provider, please refer to [Configure your App Service or Azure Functions app to use Azure AD login](../app-service/configure-authentication-provider-aad.md)
    :::image type="content" source="media/signalr-howto-use-managed-identity/function-aad.png" alt-text="Function Aad":::

4. Navigate to SignalR Service and follow [steps](howto-use-managed-identity.md#add-a-system-assigned-identity) to add a system-assigned identity or user-assigned identity.

5. Get into **Upstream settings** in SignalR Service and choose **Use Managed Identity** and **Select from existing Applications**. Select the application you created previously.

After these settings, the Function App will reject requests without an access token in the header.

> [!Important] 
> To pass the authentication, the *Issuer Url* must match the *iss* claim in token. Currently, we only support v1 endpoint (see [v1.0 and v2.0](../active-directory/develop/access-tokens.md)), so the *Issuer Url* should look like `https://sts.windows.net/<tenant-id>/`. Check the *Issuer Url* configured in Azure Function. For **Authentication**, go to *Identity provider* -> *Edit* -> *Issuer Url*


## Use a managed identity for Key Vault reference

SignalR Service can access Key Vault to get secret using the managed identity.

1. Add a system-assigned identity or user-assigned identity for Azure SignalR Service.

2. Grant secret read permission for the managed identity in the Access policies in the Key Vault. See [Assign a Key Vault access policy using the Azure portal](../key-vault/general/assign-access-policy-portal.md)

Currently, this feature can be used in the following scenarios:

- [Reference secret in Upstream URL Pattern](./concept-upstream.md#key-vault-secret-reference-in-url-template-settings)


## Next steps

- [Azure Functions development and configuration with Azure SignalR Service](signalr-concept-serverless-development-config.md)
