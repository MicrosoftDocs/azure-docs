---
title: How to Secure a daemon application
description: Use the Azure portal to manage authentication to configure a trusted daemon application.
author: philmea
ms.author: philmea
ms.date: 05/14/2020
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: timlt
---

# Secure a daemon application

For background processes, timers, and jobs which are hosted in a trusted and secured environment. Examples include Azure Web Jobs, Azure Function Apps, Windows Services, and any other reliable background service.

[!Tip]
> Microsoft recommends implementing Azure AD Role based access control for production applications.

You can view the Azure Maps account authentication details in the Azure portal. There, in your account, on the **Settings** menu, select **Authentication**.

![Authentication details](./media/how-to-manage-authentication/how-to-view-auth.png)

## Scenario: Shared Key

After you create an Azure Maps account, the primary and secondary keys are generated. We recommend that you use a primary key as a subscription key when you [use Shared Key authentication to call Azure Maps](https://docs.microsoft.com/azure/azure-maps/azure-maps-authentication#shared-key-authentication). You can use a secondary key in scenarios such as rolling key changes. For more information, see [Authentication in Azure Maps](https://aka.ms/amauth).

### Securely store shared key

The primary and secondary keys allow authorization to all APIs for the Maps account. Applications should store the keys in a secure store such as Azure Key Vault. The application must retrieve the shared key as a Azure Key Vault secret to avoid storing the shared key in plain text in application configuration. To understand how to configure an Azure Key Vault, see [Azure Key Vault Developer Guide](https://docs.microsoft.com/azure/key-vault/general/developers-guide).

From a step by step overview:

1. Create an Azure Key Vault.
2. Create an Azure AD service principal (App registration or Managed Identity) responsible to access Azure Key Vault.
3. Assign the service principal access to Azure Key secrets `Get` permission.
4. Temporarily assign access to secrets `Set` permission for you as the developer.
5. Set the shared key in the Key Vault secrets and reference the secret ID as configuration for the daemon application and remove your secrets `Set` permission.
6. Implement Azure AD authentication in the daemon application to retrieve the shared key secret from Azure Key Vault.
7. Create Azure Maps REST API request with shared key.

[!Tip]
> If the app is hosted in Azure environment, we recommend implementing a Managed Identity to reduce the cost and complexity of managing a secret to authenticate to Azure Key Vault. See the following Azure Key Vault [tutorial to connect via Managed Identity](https://docs.microsoft.com/azure/key-vault/general/tutorial-net-create-vault-azure-web-app).

The daemon application is responsible to retrieve the shared key from a secure location. The implementation with Azure Key Vault requires authentication through Azure AD to access the secret. We **encourage** direct Azure AD Role based access control with Azure maps as a result of the additional complexity and operational requirements of using shared key authentication.

## Scenario: Azure AD Role Based Access Control

Once an Azure Maps account is created, the Azure Maps `x-ms-client-id` value is present in the Azure Portal authentication details page. This value represents the account which will be used for REST API requests. This value should be stored in application configuration and retrieved prior to making http requests. The objective of the scenario is to enable the daemon application to authenticate to Azure AD and call Azure Maps REST APIs.

[!Tip]
> We recommend hosting on Azure Virtual Machines, Virtual Machine Scale Sets, or App Services to enable benefits of Managed Identity components.

### Daemon hosted on non-Azure resources

When running on a non-Azure environment Managed Identities are not available. Therefore you must configure a service principal via an Azure AD application registration for the daemon application.

1. In the Azure portal, in the list of Azure services, select **Azure Active Directory** > **App registrations** > **New registration**.  

    ![App registration](./media/how-to-manage-authentication/app-registration.png)

2. If you've already registered your app, then continue to the next step. If you haven't registered your app, then enter a **Name**, choose a **Support account type**, and then select **Register**.  

    ![App registration details](./media/how-to-manage-authentication/app-create.png)

3. To assign delegated API permissions to Azure Maps, go to the application. Then under **App registrations**, select **API permissions** > **Add a permission**. Under **APIs my organization uses**, search for and select **Azure Maps**.

    ![Add app API permissions](./media/how-to-manage-authentication/app-permissions.png)

4. Select the check box next to **Access Azure Maps**, and then select **Add permissions**.

    ![Select app API permissions](./media/how-to-manage-authentication/select-app-permissions.png)

5. Complete the following steps to create a client secret or configure certificate.

    * If your application uses server or application authentication, then on your app registration page, go to **Certificates & secrets**. Then either upload a public key certificate or create a password by selecting **New client secret**.

       ![Create a client secret](./media/how-to-manage-authentication/app-keys.png)

    * After you select **Add**, copy the secret and store it securely in a service such as Azure Key Vault. Review [Azure Key Vault Developer Guide](https://docs.microsoft.com/azure/key-vault/general/developers-guide) to securely store the certificate or secret. You'll use this secret to get tokens from Azure AD.

       ![Add a client secret](./media/how-to-manage-authentication/add-key.png)

### Daemon hosted on Azure resources

When running on Azure resources, configure Azure Managed Identities to enable low cost, minimal credential management effort. 

See [Overview of Managed Identities](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview) to enable the application access to a Managed Identity.

Managed Identity Benefits:

* Azure system managed X509 certificate public key cryptography authentication.
* Superior Azure AD security with X509 certificates instead of client secrets.
* Azure manages and renews all certificates associated with the Managed Identity resource.
* No management and requirement of secret configuration stores.

### Grant role based access for the daemon application to Azure Maps

You grant *role-based access control* (RBAC) by assigning either the created Managed Identity or the service principal to one or more Azure Maps access control role definitions. To view RBAC role definitions that are available for Azure Maps, go to **Access control (IAM)**. Select **Roles**, and then search for roles that begin with *Azure Maps*. These Azure Maps roles are the roles that you can grant access to.

![View available roles](./media/how-to-manage-authentication/how-to-view-avail-roles.png)

1. Go to your **Azure Maps Account**. Select **Access control (IAM)** > **Role assignment**.

    ![Grant RBAC](./media/how-to-manage-authentication/how-to-grant-rbac.png)

2. On the **Role assignments** tab, under **Role**, select a built in Azure Maps role definition such as **Azure Maps Data Reader** or **Azure Maps Data Contributor**. Under **Assign access to**, select **Azure AD user, group, or service principal** or Managed Identity with **User assigned managed identity** / **System assigned Managed identity**. Select the principal. Then select **Save**.

    ![Add role assignment](./media/how-to-manage-authentication/add-role-assignment.png)

## Request token with Managed Identity

Once a Managed Identity is configured for the hosting resource, use Azure SDK or REST API to acquire a token for Azure Maps, see details on [Acquire an access token](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/how-to-use-vm-token). Following the guide, the expectation is that an access token will be returned which can be used on REST API requests.

## Request token with application registration

After you register your app and associate it with Azure Maps, you can request access tokens.

* Azure AD resource ID `https://atlas.microsoft.com/`
* Azure AD App ID
* Azure AD Tenant ID
* Azure AD App registration client secret

Request:

```http
POST /<Azure AD Tenant ID>/oauth2/token HTTP/1.1
Host: login.microsoftonline.com
Content-Type: application/x-www-form-urlencoded

client_id=<Azure AD App ID>&resource=https://atlas.microsoft.com/&client_secret=<client secret>&grant_type=client_credentials
```

Response:

```json
{
    "token_type": "Bearer",
    "expires_in": "...",
    "ext_expires_in": "...",
    "expires_on": "...",
    "not_before": "...",
    "resource": "https://atlas.microsoft.com/",
    "access_token": "ey...gw"
}
```

See [Authentication scenarios for Azure AD](https://docs.microsoft.com/azure/active-directory/develop/authentication-scenarios), for more detailed examples.

## Next steps

Find the API usage metrics for your Azure Maps account:
> [!div class="nextstepaction"]
> [View usage metrics](how-to-view-api-usage.md)

Explore samples that show how to integrate Azure AD with Azure Maps:

> [!div class="nextstepaction"]
> [Azure AD authentication samples](https://github.com/Azure-Samples/Azure-Maps-AzureAD-Samples)
