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

- Obtain access tokens
- Access secrets in Azure Key Vault

The service supports only one managed identity; you can create either a system-assigned or user-assigned identity. A system-assigned identity is dedicated to your SignalR instance and is deleted when you delete the instance. A user-assigned identity is managed independently of your SignalR resource.

This article shows you how to create a managed identity for Azure SignalR Service and how to use it in serverless scenarios.

## Prerequisites

To use a managed identity, you must have the following items:

- An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- An Azure SignalR resource.
- Upstream resources that you want to access. For example, an Azure Key Vault resource.
- An Azure Function app.

## Add a managed identity to Azure SignalR Service

You can add a managed identity to Azure SignalR Service in the Azure portal or the Azure CLI. This article shows you how to add a managed identity to Azure SignalR Service in the Azure portal.

### Add a system-assigned identity

To add a system-managed identity to your SignalR instance:

1. Browse to your SignalR instance in the Azure portal.
1. Select **Identity**.
1. On the **System assigned** tab, switch **Status** to **On**.
1. Select **Save**.

   :::image type="content" source="media/signalr-howto-use-managed-identity/system-identity-portal.png" alt-text="Screenshot showing Add a system-assigned identity in the portal.":::

1. Select **Yes** to confirm the change.

### Add a user-assigned identity

To add a user-assigned identity to your SignalR instance, you need to create the identity then add it to your service.

1. Create a user-assigned managed identity resource according to [these instructions](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal.md#create-a-user-assigned-managed-identity).
1. Browse to your SignalR instance in the Azure portal.
1. Select **Identity**.
1. On the **User assigned** tab, select **Add**.
1. Select the identity from the **User assigned managed identities** drop down menu.
1. Select **Add**.
   :::image type="content" source="media/signalr-howto-use-managed-identity/user-identity-portal.png" alt-text="Screenshot showing Add a user-assigned identity in the portal.":::

## Use a managed identity in serverless scenarios

Azure SignalR Service is a fully managed service. It uses a managed identity to obtain an access token. In serverless scenarios, the service adds the access token into the `Authorization` header in an upstream request.

### Enable managed identity authentication in upstream settings

Once you've added a [system-assigned identity](#add-a-system-assigned-identity) or [user-assigned identity](#add-a-user-assigned-identity) to your SignalR instance, you can enable managed identity authentication in the upstream endpoint settings.

1. Browse to your SignalR instance.
1. Select **Settings** from the menu.
1. Select the **Serverless** service mode.
1. Enter the upstream endpoint URL pattern in the **Add an upstream URL pattern** text box. See [URL template settings](concept-upstream.md#url-template-settings)
1. Select Add one Upstream Setting and select any asterisk go to **Upstream Settings**.
   :::image type="content" source="media/signalr-howto-use-managed-identity/pre-msi-settings.png" alt-text="Screenshot of Azure SignalR service Settings.":::

1. Configure your upstream endpoint settings.

   :::image type="content" source="media/signalr-howto-use-managed-identity/msi-settings.png" alt-text="Screenshot of Azure SignalR service Upstream settings.":::

1. In the managed identity authentication settings, for **Resource**, you can specify the target resource. The resource will become an `aud` claim in the obtained access token, which can be used as a part of validation in your upstream endpoints. The resource can be one of the following formats:

   - Empty
   - Application (client) ID of the service principal
   - Application ID URI of the service principal
   - Resource ID of an Azure service (For a list of Azure services that support managed identities, see [Azure services that support managed identities](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md#azure-services-that-support-azure-ad-authentication).)

   > [!NOTE]
   > If you manually validate an access token your service, you can choose any one of the resource formats. Make sure that the **Resource** value in **Auth** settings and the validation are consistent. When you use Azure role-based access control (Azure RBAC) for a data plane, you must use the resource format that the service provider requests.

### Validate access tokens

The token in the `Authorization` header is a [Microsoft identity platform access token](../active-directory/develop/access-tokens.md).

To validate access tokens, your app should also validate the audience and the signing tokens. These tokens need to be validated against the values in the OpenID discovery document. For example, see the [tenant-independent version of the document](https://login.microsoftonline.com/common/.well-known/openid-configuration).

The Microsoft Entra middleware has built-in capabilities for validating access tokens. You can browse through our [samples](../active-directory/develop/sample-v2-code.md) to find one in the language of your choice.

Libraries and code samples that show how to handle token validation are available. There are also several open-source partner libraries available for JSON Web Token (JWT) validation. There's at least one option for almost every platform and language. For more information about Microsoft Entra authentication libraries and code samples, see [Microsoft identity platform authentication libraries](../active-directory/develop/reference-v2-libraries.md).

#### Authentication in Function App

You can easily set access validation for a Function App without code changes using the Azure portal.

1. Go to the Function App in the Azure portal.
1. Select **Authentication** from the menu.
1. Select **Add identity provider**.
1. In the **Basics** tab, select **Microsoft** from the **Identity provider** dropdown.
1. Select **Log in with Microsoft Entra ID** in **Action to take when request is not authenticated**.
1. Select **Microsoft** in the identity provider dropdown. The option to create a new registration is selected by default. You can change the name of the registration. For more information on enabling Microsoft Entra provider, see [Configure your App Service or Azure Functions app to login with Microsoft Entra ID](../app-service/configure-authentication-provider-aad.md)
   :::image type="content" source="media/signalr-howto-use-managed-identity/function-aad.png" alt-text="Function Microsoft Entra ID":::
1. Navigate to SignalR Service and follow the [steps](howto-use-managed-identity.md#add-a-system-assigned-identity) to add a system-assigned identity or user-assigned identity.
1. go to **Upstream settings** in SignalR Service and choose **Use Managed Identity** and **Select from existing Applications**. Select the application you created previously.

After you configure these settings, the Function App will reject requests without an access token in the header.

> [!IMPORTANT]
> To pass the authentication, the _Issuer Url_ must match the _iss_ claim in token. Currently, we only support v1 endpoint (see [v1.0 and v2.0](../active-directory/develop/access-tokens.md)).

To verify the _Issuer Url_ format in your Function app:

1. Go to the Function app in the portal.
1. Select **Authentication**.
1. Select **Identity provider**.
1. Select **Edit**.
1. Select **Issuer Url**.
1. Verify that the _Issuer Url_ has the format `https://sts.windows.net/<tenant-id>/`.

## Use a managed identity for Key Vault reference

SignalR Service can access Key Vault to get secrets using the managed identity.

1. Add a [system-assigned identity](#add-a-system-assigned-identity) or [user-assigned identity](#add-a-user-assigned-identity) to your SignalR instance.
1. Grant secret read permission for the managed identity in the Access policies in the Key Vault. See [Assign a Key Vault access policy using the Azure portal](../key-vault/general/assign-access-policy-portal.md)

Currently, this feature can be used to [Reference secret in Upstream URL Pattern](./concept-upstream.md#key-vault-secret-reference-in-url-template-settings)

## Next steps

- [Azure Functions development and configuration with Azure SignalR Service](signalr-concept-serverless-development-config.md)
