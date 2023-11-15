---
title: Manage credential connections for end users - Azure API Management | Microsoft Docs
description: Learn how to configure a credential connection with user-delegated permissions to a backend OAuth 2.0 API using the Azure API Management credential manager. 
services: api-management
author: dlepow
ms.service: api-management
ms.topic: how-to
ms.date: 11/14/2023
ms.author: danlep
---

# Configure credential manager - user-delegated access to backend API

This article guides you through the high level steps to configure and use a managed [credential connection](credentials-overview.md) that grants Microsoft Entra users or groups delegated permissions to a backend OAuth 2.0 API. Follow these steps for scenarios when a client app (or bot) needs to access backend secured online resources on behalf of an authenticated user (for example, checking emails or placing an order).

## Scenario overview 

> [!NOTE]
> This scenario only applies to credential providers configured with the **authorization code** grant type.

In this scenario, you configure a managed [credential connection](credentials-overview.md) that enables a client app (or bot) to access a backend API on behalf of a Microsoft Entra user or group. For example, you might have a static web app that accesses a backend GitHub API and which you want to access data specific to the signed-in user. The following diagram illustrates the scenario. 

:::image type="content" source="media/credentials-how-to-user-delegated/scenario-overview.png" alt-text="Diagram showing process flow for user-delegated permissions." border="false":::

* The user must authorize the app to access secured resources on their behalf, and to authorize the app, the user must authenticate their identity
* To perform operations on behalf of a user, the app calls the external backend service, such as Microsoft Graph or GitHub
* Each external service has a way of securing those calls - for example, with a user token that uniquely identifies the user
* To secure the call to the external service, the app must ask the user to sign-in, so it can acquire the user's token
* As part of the configuration, a credential provider is registered using the credential manager in the API Management instance. It contains information about the identity provider to use, along with a valid OAuth client ID and secret, the OAuth scopes to enable, and other connection metadata required by that identity provider.
* Also, a credential connection is created and used to help sign-in the user and get the user token so it can be managed

## Prerequisites

- Access to a Microsoft Entra tenant where you have permissions to create an app registration and to grant admin consent for the app's permissions. [Learn more](../active-directory/roles/delegate-app-roles.md#restrict-who-can-create-applications)

    If you want to create your own developer tenant, you can sign up for the [Microsoft 365 Developer Program](https://developer.microsoft.com/microsoft-365/dev-program).
- One or more users or groups in the tenant to delegate permissions to.
- A running API Management instance. If you need to, [create an Azure API Management instance](get-started-create-service-instance.md).
- A backend OAuth 2.0 API that you want to access on behalf of the user or group.

[!INCLUDE [azure-powershell-requirements-no-header](../../includes/azure-powershell-requirements-no-header.md)]

## Step 1: Provision Azure API Management Data Plane service principal

You need to provision the Azure API Management Data Plane service principal to grant users or groups the necessary delegated permissions. Use the following steps to provision the service principal using Azure PowerShell.

1. Sign in to Azure PowerShell.

1. If the AzureAD module isn't already installed, install it with the following command:

    ```powershell
    Install-Module -Name AzureAD -Scope CurrentUser -Repository PSGallery -Force
    ```
    
1. Connect to your tenant with the following command:

    ```powershell
    Connect-AzureAD -TenantId "<YOUR_TENANT_ID>"
    ```
    
1. If prompted, sign in with administrator account credentials of your tenant.

1. Provision the Azure API Management Data Plane service principal with the following command:

    ```powershell
    New-AzureADServicePrincipal -AppId c8623e40-e6ab-4d2b-b123-2ca193542c65 -DisplayName "Azure API Management Data Plane"
    ```

## Create a Microsoft Entra ID app registration

Create a Microsoft Entra ID application for user delegation and give it the appropriate permissions to read the credential in API Management.

1. Sign in to the [Azure portal](https://portal.azure.com) with an account with sufficient permissions in the tenant.
1. Under **Azure Services**, search for **Microsoft Entra ID**.
1. On the left menu, select **App registrations**, and then select **+ New registration**.     
1. On the **Register an application** page, enter your application registration settings:
    1. In **Name**, enter a meaningful name that will be displayed to users of the app, such as *UserPermissions*.
    1. In **Supported account types**, select an option that suits your scenario, for example, **Accounts in this organizational directory only (Single tenant)**.
    1. Set the **Redirect URI** to **Web**,  and enter `https://www.postman-echo.com/get`.
1. On the left menu, select **API permissions**, and then select **+ Add a permission**.
    1. Select the **APIs my organization uses** tab, type *Azure API Management Data Plane*, and select it.
    1. Under ***Permissions**, select **Authorizations.Read**, and then select **Add permissions**. 
1. On the left menu, select **Overview**. On the **Overview** page, find the **Application (client) ID** value and record it for use in a later step.
1. On the left menu, select **Certificates & secrets**, and then select **+ New client secret**.    
    1. Enter a **Description**.
    1. Select an option for **Expires**.
    1. Select **Add**.
    1. Copy the client secret's **Value** before leaving the page. You need it in a later step.

## Step 2: Configure a credential provider in API Management

1. Sign into the [portal](https://portal.azure.com) and go to your API Management instance.
1. On the left menu, select **Credential manager**, and then select **+ Create**.    
    :::image type="content" source="media/credentials-how-to-azure-ad/create-credential.png" alt-text="Screenshot of creating an API credential in the portal.":::    
1. On the **Create credential provider** page, enter the settings for the credential provider for your API. For this scenario, in **Grant type**, you must select **Authorization code**. For more information, see [Configure identity providers for API credentials](credentials-configure-common-providers.md). 
1. Select **Create**.
1. When prompted, review the OAuth redirect URL that's displayed, and select **Yes** to confirm that it matches the URL you entered in the app registration.     

## Step 3: Configure a credential connection

After you create a credential provider, you can add a credential connection. On the **Connection** tab, complete the steps for your connection:

1. Enter a **Connection name**, then select **Save**. 
1. Under **Step 2: Login to your connection**, select the link to login to the credential provider. Complete steps there to authorize access, and return to API Management. 
1. Under **Step 3: Determine who will have access to this connection (Access policy)**, select **+ Add**. Depending on your delegation scenario, select **Users** or **Group**.
1. In the **Select item** window, make selections in the following order:
    1. First, search for one or more users (or groups) to add and check the selection box. 
    1. Then, in the list that appears, search for the app registration that you created in a previous section. 
    1. Then click **Select**.
1. Select **Complete**.

The new connection appears in the list of connections, and shows a status of **Connected**. If you want to create another connection for the credential provider, complete the preceding steps.

> [!TIP]
> Use the portal to add, update, or delete connections to a credential provider at any time. For more information, see [Configure multiple credential connections](configure-credential-connection.md). 

## Step 4: Acquire a Microsoft Entra ID access token

To enable user-delegated access to the backend API, an access token for the delegated user or group must be provided at runtime in the `get-authorization-context` policy. Typically this is done programmatically in your client app by using the [Microsoft Authentication Library](/entra/identity-platform/msal-overview) (MSAL). This section provides manual steps to create an access token for testing.

1. Paste the following URL in your browser, replacing the values for `<tenant-id>` and `<client-id>` with values from your Microsoft Entra app registration:

    ```http
    https://login.microsoftonline.com/<tenant-id>/oauth2/authorize?client_id=<client-id>&response_type=code&redirect_uri=https://www.postman-echo.com/get&response_mode=query&resource=https://azure-api.net/authorization-manager&state=1234`
    ```
1. When prompted, sign in. In the response body, copy the value of **code** that’s provided (example: `"0.AXYAh2yl…"`).
1. Send the following `POST` request to the token endpoint, replacing `<tenant-id>` with your tenant ID and including the indicated header and the body parameters from your app registration and the code you copied in the previous step.

    ```http
    POST https://login.microsoftonline.com/<tenant-id>/oauth2/token HTTP/1.1
    ```
    **Header**

    `Content-Type: application/x-www-form-urlencoded`
    
    **Body**
    ```
    grant_type: "authorization_code"
    client_id: <client-id>
    client_secret: <client-secret>
    redirect_uri: <redirect-url> 
    code: <code>   ## The code you copied in the previous step
    ```

1. In the response body, copy the value of **access_token** that’s provided (example: `eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjZqQmZ1...`). You'll pass this value in the policy configuration in the next step.


## Step 4: Configure get-authorization-context policy for backend API

Configure the `get-authorization-context` policy for the backend API that you want to access on behalf of the user or group. For test purposes, you can configure the policy using the Microsoft Entra ID access token for the user that you obtained in the previous section.

1. Sign into the [portal](https://portal.azure.com) and go to your API Management instance.
1. On the left menu, select **APIs** and then select your OAuth 2.0 backend API.

1. Select **All operations**. In the **Inbound processing** section, select the (**</>**) (code editor) icon.
1. Configure the `get-authorization-context` policy in the `inbound` section, setting `identity-type` to `jwt`:
    
    ```xml
    <policies>
        <inbound>
            [...]
            <get-authorization-context provider-id="<credential-provider-id>" authorization-id="<connection-id>" context-variable-name="auth-context" identity-type="jwt" identity="<access-token>" ignore-error="false" />
            [...]
        </inbound> 
    </policies>
    ```

In the preceding policy definition, replace:

* `<credential-provider-id>` and `<connection-id>` with the names of the credential provider and connection, respectively, that you configured in a preceding step.

* `<access-token>` with the Microsoft Entra ID access token that you generated in the preceding step. 

## Step 5: Test the API 

1. On the **Test** tab, select one operation that you configured.
1. Select **Send**. 
    
    A successful response returns user data from the backend API.

## Related content

* Learn more about [access restriction policies](api-management-access-restriction-policies.md)
* Learn more about [scopes and permissions](../active-directory/develop/scopes-oidc.md) in Microsoft Entra ID.
