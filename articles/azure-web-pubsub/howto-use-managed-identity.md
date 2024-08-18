---
title: Managed identities in Azure Web PubSub
description: Learn how managed identities work in Azure Web PubSub and how to use a managed identity in a serverless scenario.
author: vicancy
ms.service: azure-web-pubsub
ms.topic: article
ms.date: 08/16/2024
ms.author: lianwei
---

# Managed identities for Azure Web PubSub

This article shows you how to create a managed identity for Azure Web PubSub and how to use it.

> [!IMPORTANT]
> Azure Web PubSub can support only one managed identity. You can add *either* a system-assigned identity or a user-assigned identity.

## Add a system-assigned identity

To set up a managed identity in the Azure portal, create an Azure Web PubSub instance, and then enable the feature.

1. In the Azure portal, create a standard Azure Web PubSub resource. Go to the resource in the portal.

1. On the left menu, select **Identity**.

1. Select the **System assigned** tab, and then set **Status** to **On**. Select **Save**.

   :::image type="content" source="media/howto-use-managed-identity/system-identity-portal.png" alt-text="Add a system-assigned identity in the Azure portal.":::

## Add a user-assigned identity

To create a Web PubSub resource by using a user-assigned identity, create the identity, and then add its resource identifier to your service.

1. Create a [user-assigned managed identity resource](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal.md#create-a-user-assigned-managed-identity).

1. In the Azure portal, create a standard Azure Web PubSub resource. Go to the resource in the portal.

1. On the left menu, select **Identity**.

1. Select the **User assigned** tab, and then select **Add**.

1. Search for the identity that you created and select it. Select **Add**.

   :::image type="content" source="media/howto-use-managed-identity/user-identity-portal.png" alt-text="Add a user-assigned identity in the portal":::

## Use a managed identity in client events scenarios

Azure Web PubSub is a fully managed service, so you can't use a managed identity to manually get tokens. Instead, when Web PubSub sends events to event handler, it uses the managed identity to get an access token. The service then sets the access token in the `Authorization` header in the HTTP request.

### Enable managed identity authentication in event handler settings

1. Add a system-assigned identity or a user-assigned identity.

1. Go to **Configure Hub Settings** and add or edit an event handler for the network.

   :::image type="content" source="media/howto-use-managed-identity/msi-settings.png" alt-text="msi-setting":::

1. Under **Authentication**, select **Use Authentication**, and then select **Specify the issued token audience**. The audience becomes the `aud` claim in the access token. It can be part of validation in your event handler.

   You can choose one of these options:

   - Select from existing Microsoft Entra applications. The application ID of the application you choose is used.
   - The Application ID URI of the service principal.

   > [!IMPORTANT]
   > Using an empty resource actually acquires a token target for Microsoft Graph. Currently, Microsoft Graph enables token encryption, so it's not supported for an application to authenticate the token other than with Microsoft Graph. You should always create a service principal to represent your network target. Set the **Application ID** or **Application ID URI** of the service principal you've created.

#### Authentication in a function app

You can easily set access validation for a function app without code changes by using the Azure portal:

1. In the Azure portal, go to the function app.
1. On the left menu, select **Authentication**.
1. Select **Add identity provider**.
1. Select the **Basics** tab, and for **Identity provider**, select **Microsoft**.
1. In **Action to take when request is not authenticated**, select **Log in with Microsoft Entra ID**.
1. The option to create a new registration is selected by default. You can change the name of the registration. For more information about how to enable a Microsoft Entra provider, see [Configure your Azure App Service or Azure Functions app to use a Microsoft Entra ID sign-in](../app-service/configure-authentication-provider-aad.md).

   :::image type="content" source="media/howto-use-managed-identity/function-entra.png" alt-text="Screenshot that shows basic information for adding an identity provider.":::
1. Go to your Web PubSub resource and [add a system-assigned identity or a user-assigned identity](howto-use-managed-identity.md#add-a-system-assigned-identity).
1. On the left menu for your Web PubSub resource, select the **Settings** tab.
1. Select **Edit** to edit your hub settings, and select **Edit** to edit your event handler settings. Under **Authentication**, select **Use Managed Identity** and **Select from existing Applications**. Select the application that you created.

After you configure these settings, the function app rejects requests that don't have an access token in the header.

### Validate access tokens

If you're not using Web Apps or Azure Functions, you also can validate the token.

The token in the `Authorization` header is a [Microsoft identity platform access token](../active-directory/develop/access-tokens.md).

To validate access tokens, your app should also validate the audience and the signing tokens. Signing tokens must be validated against the values in the OpenID discovery document. For example, see the [tenant-independent version of the document](https://login.microsoftonline.com/common/.well-known/openid-configuration).

The Microsoft Entra middleware has built-in capabilities for validating access tokens. You can browse our [samples](../active-directory/develop/sample-v2-code.md) to find one in the language you want to use.

We provide libraries and code samples that show you how to handle token validation. There are also several open-source partner libraries available for JSON Web Token (JWT) validation. There's at least one option for almost every platform and language. For more information about Microsoft Entra authorization libraries and code samples, see [Microsoft identity platform authentication libraries](../active-directory/develop/reference-v2-libraries.md).

Specially, if the event handler hosts in Azure Functions or the Web Apps feature of Azure App Service, an easy way is to [configure Microsoft Entra login](../app-service/configure-authentication-provider-aad.md).

## Use a managed identity for a key vault reference

Web PubSub Service can access a key vault to get a secret by using the managed identity.

1. Add a system-assigned identity or a user-assigned identity for Azure Web PubSub.

1. In the key vault, grant secret read permissions for the managed identity via access policies. For more information, see [Assign a key vault access policy by using the Azure portal](/azure/key-vault/general/assign-access-policy-portal)

Currently, this feature can be used in the following scenarios:

- Use syntax `{@Microsoft.KeyVault(SecretUri=<secret-identity>)}` to get secrets from a key vault in the event handler URL template setting.

## Related content

- [Tutorial: Create a serverless real-time chat app with Azure Functions and Azure Web PubSub](quickstart-serverless.md)
