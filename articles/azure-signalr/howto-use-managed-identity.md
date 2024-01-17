---
title: Managed identities in Azure SignalR Service
description: Learn how managed identities work in Azure SignalR Service, and how to use a managed identity in serverless scenarios.
author: vicancy
ms.service: signalr
ms.topic: how-to
ms.date: 12/09/2022
ms.author: lianwei
---

# Managed identities for Azure SignalR Service

In Azure SignalR Service, you can use a managed identity from Microsoft Entra ID to:

- Obtain access tokens.
- Access secrets in Azure Key Vault.

The service supports only one managed identity. You can create either a system-assigned or a user-assigned identity. A system-assigned identity is dedicated to your Azure SignalR Service instance and is deleted when you delete the instance. A user-assigned identity is managed independently of your Azure SignalR Service resource.

This article shows you how to create a managed identity for Azure SignalR Service and how to use it in serverless scenarios.

## Prerequisites

To use a managed identity, you must have the following items:

- An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- An Azure SignalR Service resource.
- Upstream resources that you want to access, such as an Azure Key Vault resource.
- An Azure Functions app (function app).

## Add a managed identity to Azure SignalR Service

You can add a managed identity to Azure SignalR Service in the Azure portal or the Azure CLI. This article shows you how to add a managed identity to Azure SignalR Service in the Azure portal.

### Add a system-assigned identity

To add a system-assigned managed identity to your Azure SignalR Service instance:

1. In the Azure portal, browse to your Azure SignalR Service instance.
1. Select **Identity**.
1. On the **System assigned** tab, switch **Status** to **On**.

   :::image type="content" source="media/signalr-howto-use-managed-identity/system-identity-portal.png" alt-text="Screenshot that shows selections for adding a system-assigned identity in the portal.":::
1. Select **Save**.
1. Select **Yes** to confirm the change.

### Add a user-assigned identity

To add a user-assigned identity to your Azure SignalR Service instance, you need to create the identity and then add it to the service.

1. Create a user-assigned managed identity resource according to [these instructions](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal.md#create-a-user-assigned-managed-identity).
1. In the Azure portal, browse to your Azure SignalR Service instance.
1. Select **Identity**.
1. On the **User assigned** tab, select **Add**.
1. On the **User assigned managed identities** dropdown menu, select the identity.

   :::image type="content" source="media/signalr-howto-use-managed-identity/user-identity-portal.png" alt-text="Screenshot that shows selections for adding a user-assigned identity in the portal.":::
1. Select **Add**.

## Use a managed identity in serverless scenarios

Azure SignalR Service is a fully managed service. It uses a managed identity to obtain an access token. In serverless scenarios, the service adds the access token into the `Authorization` header in an upstream request.

### Enable managed identity authentication in upstream settings

After you add a [system-assigned identity](#add-a-system-assigned-identity) or [user-assigned identity](#add-a-user-assigned-identity) to your Azure SignalR Service instance, you can enable managed identity authentication in the upstream endpoint settings:

1. In the Azure portal, browse to your Azure SignalR Service instance.
1. Select **Settings** from the menu.
1. Select the **Serverless** service mode.
1. In the **Add an upstream URL pattern** text box, enter the upstream endpoint URL pattern. See [URL template settings](concept-upstream.md#url-template-settings).
1. Select **Add one Upstream Setting**, and then select any asterisk.

   :::image type="content" source="media/signalr-howto-use-managed-identity/pre-msi-settings.png" alt-text="Screenshot that shows Azure SignalR Service settings for adding an upstream URL pattern.":::

1. In **Upstream Settings**, configure your upstream endpoint settings.

   :::image type="content" source="media/signalr-howto-use-managed-identity/msi-settings.png" alt-text="Screenshot of upstream settings for Azure SignalR Service.":::

1. In the managed identity authentication settings, for **Audience in the issued token**, you can specify the target **resource**. The **resource** will become an `aud` claim in the obtained access token, which can be used as a part of validation in your upstream endpoints. The resource can be in one of the following formats:

   - Application (client) ID of the service principal.
   - Application ID URI of the service principal.

   > [!IMPORTANT]
   > Using empty resource actully acquire a token targets to Microsoft Graph. As today, Microsoft Graph enables token encryption so it's not available for application to authenticate the token other than Microsoft Graph. In common practice, you should always create a service principal to represent your upstream target. And set the **Application ID** or **Application ID URI** of the service principal you've created.

#### Authentication in a function app

You can easily set access validation for a function app without code changes by using the Azure portal:

1. In the Azure portal, go to the function app.
1. Select **Authentication** from the menu.
1. Select **Add identity provider**.
1. On the **Basics** tab, in the **Identity provider** dropdown list, select **Microsoft**.
1. In **Action to take when request is not authenticated**, select **Log in with Microsoft Entra ID**.
1. The option to create a new registration is selected by default. You can change the name of the registration. For more information on enabling a Microsoft Entra provider, see [Configure your App Service or Azure Functions app to use a Microsoft Entra ID sign-in](../app-service/configure-authentication-provider-aad.md).

   :::image type="content" source="media/signalr-howto-use-managed-identity/function-aad.png" alt-text="Screenshot that shows basic information for adding an identity provider.":::
1. Go to Azure SignalR Service and follow the [steps](howto-use-managed-identity.md#add-a-system-assigned-identity) to add a system-assigned identity or user-assigned identity.
1. In Azure SignalR Service, go to **Upstream settings**, and then select **Use Managed Identity** and **Select from existing Applications**. Select the application that you created previously.

After you configure these settings, the function app will reject requests without an access token in the header.

### Validate access tokens

If you're not using WebApp or Azure Function, you can also validate the token.

The token in the `Authorization` header is a [Microsoft identity platform access token](../active-directory/develop/access-tokens.md).

To validate access tokens, your app should also validate the audience and the signing tokens. These tokens need to be validated against the values in the OpenID discovery document. For an example, see the [tenant-independent version of the document](https://login.microsoftonline.com/common/.well-known/openid-configuration).

The Microsoft Entra middleware has built-in capabilities for validating access tokens. You can browse through the [Microsoft identity platform code samples](../active-directory/develop/sample-v2-code.md) to find one in the language of your choice.

Libraries and code samples that show how to handle token validation are available. Several open-source partner libraries are also available for JSON Web Token (JWT) validation. There's at least one option for almost every platform and language. For more information about Microsoft Entra authentication libraries and code samples, see [Microsoft identity platform authentication libraries](../active-directory/develop/reference-v2-libraries.md).


## Use a managed identity for a Key Vault reference

Azure SignalR Service can access Key Vault to get secrets by using the managed identity.

1. Add a [system-assigned identity](#add-a-system-assigned-identity) or [user-assigned identity](#add-a-user-assigned-identity) to your Azure SignalR Service instance.
1. Grant secret read permission for the managed identity in the access policies in Key Vault. See [Assign a Key Vault access policy by using the Azure portal](../key-vault/general/assign-access-policy-portal.md).

Currently, you can use this feature to [reference a secret in the upstream URL pattern](./concept-upstream.md#key-vault-secret-reference-in-url-template-settings).

## Next steps

- [Azure Functions development and configuration with Azure SignalR Service](signalr-concept-serverless-development-config.md)
