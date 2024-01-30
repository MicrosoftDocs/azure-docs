---
title: How to secure a daemon application in Microsoft Azure Maps
titleSuffix: Azure Maps
description: This article describes how to host daemon applications, such as background processes, timers, and jobs in a trusted and secure environment in Microsoft Azure Maps.
author: eriklindeman
ms.author: eriklind
ms.date: 10/28/2021
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
custom.ms: subject-rbac-steps
---

# Secure a daemon application

This article describes how to host daemon applications in a trusted and secure environment in Microsoft Azure Maps.

The following are examples of daemon applications:

- Azure Web Job
- Azure Function App
- Windows Service
- A running and reliable background service

## View Azure Maps authentication details

[!INCLUDE [authentication details](./includes/view-authentication-details.md)]

>[!IMPORTANT]
>For production applications, we recommend implementing Microsoft Entra ID and Azure role-based access control (Azure RBAC). For an overview of Microsoft Entra concepts, see [Authentication with Azure Maps](azure-maps-authentication.md).

## Scenario: Shared key authentication with Azure Key Vault

Applications that use Shared Key authentication, should store the keys in a secure store. This scenario describes how to safely store your application key as a secret in Azure Key Vault. Instead of storing the shared key in application configuration, the application can retrieve the shared key as an Azure Key Vault secret. To simplify key regeneration, we recommend that applications use one key at a time. Applications can then regenerate the unused key and deploy the regenerated key to Azure Key Vault while still maintaining current connections with one key. To understand how to configure Azure Key Vault, see [Azure Key Vault developer guide](../key-vault/general/developers-guide.md).

>[!IMPORTANT]
>This scenario indirectly accesses Microsoft Entra ID through Azure Key Vault. However, we recommend that you use Microsoft Entra authentication directly. Using Microsoft Entra ID directly avoids the additional complexity and operational requirements of using shared key authentication and setting up Key Vault.

The following steps outline this process:

1. [Create an Azure Key Vault](../key-vault/general/quick-create-portal.md).
2. Create an [Microsoft Entra service principal](../active-directory/fundamentals/service-accounts-principal.md) by creating an App registration or managed identity. The created principal is responsible for accessing the Azure Key Vault.
3. Assign the service principal access to Azure Key secrets `get` permission. For details about how to set permissions, see [Assign a Key Vault access policy using the Azure portal](../key-vault/general/assign-access-policy-portal.md).
4. Temporarily assign access to secrets `set` permission for you as the developer.
5. Set the shared key in the Key Vault secrets and reference the secret ID as configuration for the daemon application.
6. Remove your secrets `set` permission.
7. To retrieve the shared key secret from Azure Key Vault, implement Microsoft Entra authentication in the daemon application.
8. Create an Azure Maps REST API request with the shared key.
Now, the daemon application can retrieve the shared key from the Key Vault.

> [!TIP]
> If the app is hosted in the Azure environment, we recommend that you use a managed identity to reduce the cost and complexity of managing a secret for authentication. To learn how to set up a managed identity, see [Tutorial: Use a managed identity to connect Key Vault to an Azure web app in .NET](../key-vault/general/tutorial-net-create-vault-azure-web-app.md).

<a name='scenario-azure-ad-role-based-access-control'></a>

## Scenario: Microsoft Entra role-based access control

After an Azure Maps account is created, the Azure Maps `Client ID` value is present in the Azure portal authentication details page. This value represents the account that is to be used for REST API requests. This value should be stored in application configuration and retrieved before making HTTP requests. The goal of the scenario is to enable the daemon application to authenticate to Microsoft Entra ID and call Azure Maps REST APIs.

> [!TIP]
>To enable benefits of managed identity components, we recommend that you host on Azure Virtual Machines, Virtual Machine Scale Sets, or App Services.

### Host a daemon on Azure resources

When running on Azure resources, you can configure Azure-managed identities to enable low cost, minimal credential management effort.

To enable application access to a managed identity, see [Overview of managed identities](../active-directory/managed-identities-azure-resources/overview.md).

Some managed identity benefits are:

- Azure system-managed X509 certificate public key cryptography authentication.
- Microsoft Entra security with X509 certificates instead of client secrets.
- Azure manages and renews all certificates associated with the Managed Identity resource.
- Credential operational management is simplified because managed identity removes the need for a secured secret store service, such as Azure Key Vault.

### Host a daemon on non-Azure resources

Managed identities are only available when running on an Azure environment. As such, you must configure a service principal through a Microsoft Entra application registration for the daemon application.

#### Create new application registration

If you have already created your application registration, go to [Assign delegated API permissions](#assign-delegated-api-permissions).

To create a new application registration:

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Select **Microsoft Entra ID**.

3. Under **Manage** in the left pane, select **App registrations**.

4. Select the **+ New registration** tab.

      :::image type="content" border="false" source="./media/how-to-manage-authentication/app-registration.png" lightbox="./media/how-to-manage-authentication/app-registration.png" alt-text="A screenshot showing application registration in Microsoft Entra ID.":::

5. Enter a **Name**, and then select a **Support account type**.

    :::image type="content" border="true" source="./media/how-to-manage-authentication/app-create.png" alt-text="Create app registration.":::

6. Select **Register**.  

#### Assign delegated API permissions

To assign delegated API permissions to Azure Maps:

1. If you haven't done so already, sign in to the [Azure portal](https://portal.azure.com).

2. Select **Microsoft Entra ID**.

3. Under **Manage** in the left pane, select **App registrations**.

4. Select your application.

    :::image type="content" border="true" source="./media/how-to-manage-authentication/app-select.png" alt-text="Select app registrations.":::

5. Under **Manage** in the left pane, select **API permissions**.

6. Select **Add a permission**.

    :::image type="content" border="true" source="./media/how-to-manage-authentication/app-add-permissions.png" alt-text="Add app permission.":::

7. Select the **APIs my organization uses** tab.

8. In the search box, enter **Azure Maps**.

9. Select **Azure Maps**.

   :::image type="content" border="true" source="./media/how-to-manage-authentication/app-permissions.png" alt-text="Request app permission.":::

10. Select the **Access Azure Maps** check box.

11. Select **Add permissions**.

    :::image type="content" border="true" source="./media/how-to-manage-authentication/select-app-permissions.png" alt-text="Select app API permissions.":::

#### Create a client secret or configure certificate

To implement server or application-based authentication into your application, you can choose one of two options:

- Upload a public key certificate.
- Create a client secret.

##### Upload a public key certificate

To upload a public key certificate:

1. Under **Manage** in the left pane, select **Certificates & secrets**.

2. Select **Upload certificate**.
   :::image type="content" border="true" source="./media/how-to-manage-authentication/upload-certificate.png" alt-text="Upload certificate.":::

3. To the right of the text box, select the file icon.

4. Select a *.crt*, *.cer*, or *.pem* file, and then select **Add**.

    :::image type="content" border="true" source="./media/how-to-manage-authentication/upload-certificate-file.png" alt-text="Upload certificate file.":::

##### Create a client secret

To create a client secret:

1. Under **Manage** in the left pane, select **Certificates & secrets**.

2. Select **+ New client secret**.

   :::image type="content" border="true" source="./media/how-to-manage-authentication/new-client-secret.png" alt-text="New client secret.":::

3. Enter a description for the client secret.

4. Select **Add**.

   :::image type="content" border="true" source="./media/how-to-manage-authentication/new-client-secret-add.png" alt-text="Add new client secret.":::

5. Copy the secret and store it securely in a service such as Azure Key Vault. Also, use the secret in the [Request token with Managed Identity](#request-a-token-with-managed-identity) section of this article.

      :::image type="content" border="true" source="./media/how-to-manage-authentication/copy-client-secret.png" alt-text="Copy client secret.":::

     >[!IMPORTANT]
     >To securely store the certificate or secret, see the [Azure Key Vault Developer Guide](../key-vault/general/developers-guide.md). You'll use this secret to get tokens from Microsoft Entra ID.

[!INCLUDE [grant role-based access to users](./includes/grant-rbac-users.md)]

### Request a token with managed identity

After a managed identity is configured for the hosting resource, you can use Azure SDK or REST API to acquire a token for Azure Maps. To learn how to acquire an access token, see [Acquire an access token](../active-directory/managed-identities-azure-resources/how-to-use-vm-token.md).

### Request token with application registration

After you register your app and associate it with Azure Maps, you'll need to request an access token.

To acquire the access token:

1. If you haven't done so already, sign in to the [Azure portal](https://portal.azure.com).

2. Select **Microsoft Entra ID**.

3. Under **Manage** in the left pane, select **App registrations**.

4. Select your application.

5. You should see the Overview page. Copy the Application (client) ID and the Directory (tenant) ID.

      :::image type="content" border="true" source="./media/how-to-manage-authentication/get-token-params.png" alt-text="Copy token parameters.":::

This article uses the [Postman](https://www.postman.com/) application to create the token request, but you can use a different API development environment.

1. In the Postman app, select **New**.

2. In the **Create New** window, select **HTTP Request**.

3. Enter a **Request name** for the request, such as *POST Token Request*.

4. Select the **POST** HTTP method.

5. Enter the following URL to address bar (replace `{Tenant-ID}` with the Directory (Tenant) ID, the `{Client-ID}` with the Application (Client) ID, and `{Client-Secret}` with your client secret:

    ```http
    https://login.microsoftonline.com/{Tenant-ID}/oauth2/v2.0/token?response_type=token&grant_type=client_credentials&client_id={Client-ID}&client_secret={Client-Secret}&scope=https://atlas.microsoft.com/.default
    ```

6. Select **Send**

7. You should see the following JSON response:

```json
{
    "token_type": "Bearer",
    "expires_in": 86399,
    "ext_expires_in": 86399,
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Im5PbzNaRHJPRFhFSzFq..."
}
```

For more information about authentication flow, see [OAuth 2.0 client credentials flow on the Microsoft identity platform](../active-directory/develop/v2-oauth2-client-creds-grant-flow.md#first-case-access-token-request-with-a-shared-secret)

## Next steps

For more detailed examples:
> [!div class="nextstepaction"]
> [Authentication scenarios for Microsoft Entra ID](../active-directory/develop/authentication-vs-authorization.md)

Find the API usage metrics for your Azure Maps account:
> [!div class="nextstepaction"]
> [View usage metrics](how-to-view-api-usage.md)

Explore samples that show how to integrate Microsoft Entra ID with Azure Maps:
> [!div class="nextstepaction"]
> [Azure Maps samples](https://github.com/Azure-Samples/Azure-Maps-AzureAD-Samples)
