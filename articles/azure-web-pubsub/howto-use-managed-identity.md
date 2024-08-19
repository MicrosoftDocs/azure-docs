---
title: Use a managed identity
description: Learn how managed identities work in Azure Web PubSub and how to use a managed identity in a serverless scenario.
author: vicancy
ms.service: azure-web-pubsub
ms.topic: how-to
ms.date: 08/16/2024
ms.author: lianwei
---

# Use a managed identity

This article shows you how to create and use a managed identity for Azure Web PubSub.

> [!IMPORTANT]
> Azure Web PubSub can support only one managed identity. You can add *either* a system-assigned identity or a user-assigned identity.

## Add a system-assigned identity

To set up a managed identity in the Azure portal, create an Azure Web PubSub instance, and then enable the feature.

1. In the Azure portal, create a Web PubSub resource. Go to the resource in the portal.

1. On the left menu, select **Identity**.

1. Select the **System assigned** tab, and then set **Status** to **On**. Select **Save**.

   :::image type="content" source="media/howto-use-managed-identity/system-identity-portal.png" alt-text="Screenshot that shows adding a system-assigned identity in the Azure portal.":::

## Add a user-assigned identity

To create a Web PubSub resource by using a user-assigned identity, create the identity, and then add the identity's resource identifier to your service.

1. Create a [user-assigned managed identity resource](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal.md#create-a-user-assigned-managed-identity).

1. In the Azure portal, create a Web PubSub resource. Go to the resource in the portal.

1. On the left menu, select **Identity**.

1. Select the **User assigned** tab, and then select **Add**.

1. Search for the identity that you created and select it. Select **Add**.

   :::image type="content" source="media/howto-use-managed-identity/user-identity-portal.png" alt-text="Screenshot that shows adding a user-assigned identity in the Azure portal":::

## Use a managed identity in client events scenarios

Azure Web PubSub is a fully managed service, so you can't use a managed identity to manually get tokens. Instead, when Web PubSub sends events to an event handler, it uses the managed identity to get an access token. The service then sets the access token in the `Authorization` header in the HTTP request.

### Managed identity authentication in event handler settings

1. Add a system-assigned identity or a user-assigned identity.

1. Go to **Configure hub settings** and add or edit an upstream event handler.

   :::image type="content" source="media/howto-use-managed-identity/msi-settings.png" alt-text="Screenshot that shows settings to use on the Configure hub settings pane.":::

1. Under **Authentication**, select **Use Managed Identity**, and then select the **Specify the issued token audience** checkbox. The audience becomes the `aud` claim in the access token. The claim can be part of validation for your event handler.

   For authentication, you can choose one of these options:

   - Use an existing Microsoft Entra application. The application ID of the application you choose is used.
   - Use the Application ID URI of the service principal.

   > [!IMPORTANT]
   > Using an empty resource actually acquires a token target for Microsoft Graph. Currently, Microsoft Graph enables token encryption, so it's not supported for an application to authenticate the token other than with Microsoft Graph. You should always create a service principal to represent your upstream target. Set **Application ID** or **Application ID URI** for the service principal you created.

#### Authentication in an Azure Functions app

You can easily set access validation for a Functions app without code changes.

1. In the Azure portal, go to the Functions app.
1. On the left menu, select **Authentication**.
1. Select **Add an identity provider**.
1. On the **Basics** tab, for **Identity provider**, select **Microsoft**.
1. For **Action to take when request is not authenticated**, select **Log in with Microsoft Entra ID**.
1. The option to create a new registration is selected by default. You can change the name of the registration. For more information about how to enable a Microsoft Entra provider, see [Configure your Azure App Service or Azure Functions app to use a Microsoft Entra ID sign-in](../app-service/configure-authentication-provider-aad.md).

   :::image type="content" source="media/howto-use-managed-identity/function-entra.png" alt-text="Screenshot that shows basic information for adding an identity provider.":::
1. Go to your Web PubSub resource and [add a system-assigned identity or a user-assigned identity](howto-use-managed-identity.md#add-a-system-assigned-identity).
1. On the left menu for your Web PubSub resource, select **Settings**.
1. Select **Edit** to edit your hub settings, and then select **Edit** to edit your event handler settings. Under **Authentication**, select **Use Managed Identity** and select the **Select from existing applications** checkbox. Select the application that you created.

After you configure these settings, the Functions app rejects requests that don't have an access token in the header.

### Validate an access token

If you're not using the Web Apps feature of Azure App Service or Azure Functions, you also can validate the token.

The token in the `Authorization` header is a [Microsoft identity platform access token](../active-directory/develop/access-tokens.md).

To validate access tokens, your app should also validate the audience and the signing tokens. Signing tokens must be validated against the values in the OpenID discovery document. For example, see the [tenant-independent version of the document](https://login.microsoftonline.com/common/.well-known/openid-configuration).

The Microsoft Entra middleware has built-in capabilities for validating access tokens. You can browse our [samples](../active-directory/develop/sample-v2-code.md) to find one in the language that you want to use.

We provide libraries and code samples that show you how to handle token validation. There are also several open-source partner libraries available for JSON Web Token (JWT) validation. There's at least one option for almost every platform and language. For more information about Microsoft Entra authorization libraries and code samples, see [Microsoft identity platform authentication libraries](../active-directory/develop/reference-v2-libraries.md).

If the event handler hosts in Azure Functions or Web Apps, an easy way is to [configure Microsoft Entra sign-in](../app-service/configure-authentication-provider-aad.md).

## Use a managed identity for a key vault reference

Web PubSub can access a key vault to get a secret by using a managed identity.

1. Add a system-assigned identity or a user-assigned identity for Azure Web PubSub.

1. In the key vault, grant secret read permissions for the managed identity via access policies. For more information, see [Assign a key vault access policy by using the Azure portal](/azure/key-vault/general/assign-access-policy-portal).

Currently, this feature can be used in the following scenario:

- Use syntax `{@Microsoft.KeyVault(SecretUri=<secret-identity>)}` to get secrets from a key vault in the event handler URL template setting.

## Related content

- [Tutorial: Create a serverless real-time chat app by using Azure Functions and Azure Web PubSub](quickstart-serverless.md)
