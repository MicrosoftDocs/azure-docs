---
title: Managed identities in Azure Web PubSub Service
description: Learn how managed identities work in Azure Web PubSub Service, and how to use a managed identity in serverless scenarios.
author: chenyl
ms.service: azure-web-pubsub
ms.topic: article
ms.date: 11/08/2021
ms.author: chenyl
---

# Managed identities for Azure Web PubSub Service

This article shows you how to create a managed identity for Azure Web PubSub Service and how to use it.

> [!Important]
> Azure Web PubSub Service can support only one managed identity. That means you can add either a system-assigned identity or a user-assigned identity.

## Add a system-assigned identity

To set up a managed identity in the Azure portal, you'll first create an Azure Web PubSub Service instance and then enable the feature.

1. Create an Azure Web PubSub Service instance in the portal as you normally would. Browse to it in the portal.

2. Select **Identity**.

3. On the **System assigned** tab, switch **Status** to **On**. Select **Save**.

   :::image type="content" source="media/howto-use-managed-identity/system-identity-portal.png" alt-text="Add a system-assigned identity in the portal":::

## Add a user-assigned identity

Creating an Azure Web PubSub Service instance with a user-assigned identity requires that you create the identity and then add its resource identifier to your service.

1. Create a user-assigned managed identity resource according to [these instructions](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal.md#create-a-user-assigned-managed-identity).

2. Create an Azure Web PubSub Service instance in the portal as you normally would. Browse to it in the portal.

3. Select **Identity**.

4. On the **User assigned** tab, select **Add**.

5. Search for the identity that you created earlier and selects it. Select **Add**.

   :::image type="content" source="media/howto-use-managed-identity/user-identity-portal.png" alt-text="Add a user-assigned identity in the portal":::

## Use a managed identity in client events scenarios

Azure Web PubSub Service is a fully managed service, so you can't use a managed identity to get tokens manually. Instead, when Azure Web PubSub Service sends events to event handler, it will use the managed identity to obtain an access token. The service then sets the access token into the `Authorization` header in the http request.

### Enable managed identity authentication in event handler settings

1. Add a system-assigned identity or user-assigned identity.

2. Navigate to the rule and switch on the **Authentication**.

   :::image type="content" source="media/howto-use-managed-identity/msi-settings.png" alt-text="msi-setting":::

3. Select application. The application ID will become the `aud` claim in the obtained access token, which can be used as a part of validation in your event handler. You can choose one of the following:

   - Use default Microsoft Entra application.
   - Select from existing Microsoft Entra applications. The application ID of the one you choose will be used.
   - Specify a Microsoft Entra application. The value should be [Resource ID of an Azure service](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md#azure-services-that-support-azure-ad-authentication)

   > [!NOTE]
   > If you validate an access token by yourself in your service, you can choose any one of the resource formats. If you use Azure role-based access control (Azure RBAC) for a data plane, you must use the resource that the service provider requests.

### Validate access tokens

The token in the `Authorization` header is a [Microsoft identity platform access token](../active-directory/develop/access-tokens.md).

To validate access tokens, your app should also validate the audience and the signing tokens. These need to be validated against the values in the OpenID discovery document. For example, see the [tenant-independent version of the document](https://login.microsoftonline.com/common/.well-known/openid-configuration).

The Microsoft Entra middleware has built-in capabilities for validating access tokens. You can browse through our [samples](../active-directory/develop/sample-v2-code.md) to find one in the language of your choice.

We provide libraries and code samples that show how to handle token validation. There are also several open-source partner libraries available for JSON Web Token (JWT) validation. There's at least one option for almost every platform and language out there. For more information about Microsoft Entra authorization libraries and code samples, see [Microsoft identity platform authentication libraries](../active-directory/develop/reference-v2-libraries.md).

Specially, if the event handler hosts in Azure Function or Web Apps, an easy way is to [Configure Microsoft Entra login](../app-service/configure-authentication-provider-aad.md).

## Use a managed identity for Key Vault reference

Web PubSub Service can access Key Vault to get secret using the managed identity.

1. Add a system-assigned identity or user-assigned identity for Azure Web PubSub Service.

2. Grant secret read permission for the managed identity in the Access policies in the Key Vault. See [Assign a Key Vault access policy using the Azure portal](../key-vault/general/assign-access-policy-portal.md)

Currently, this feature can be used in the following scenarios:

- Use syntax `{@Microsoft.KeyVault(SecretUri=<secret-identity>)}` to get secrets from KeyVault in the event handler url template setting.

## Next steps

- [Tutorial: Create a serverless real-time chat app with Azure Functions and Azure Web PubSub service](quickstart-serverless.md)
