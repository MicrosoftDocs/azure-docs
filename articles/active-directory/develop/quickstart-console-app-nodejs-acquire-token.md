---
title: "Quickstart: Acquire a token and call Microsoft Graph from a Node.js console app"
description: In this quickstart, you download and run a code sample that shows how a Node.js console application can get an access token and call an API protected by a Microsoft identity platform endpoint, using the app's own identity
services: active-directory
author: cilwerner
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.topic: quickstart
ms.date: 09/09/2022
ms.author: cwerner
#Customer intent: As an application developer, I want to learn how my Node.js app can get an access token and call an API that is protected by a Microsoft identity platform endpoint using client credentials flow.
ms.custom: mode-other
---

# Quickstart: Acquire a token and call Microsoft Graph from a Node.js console app

In this quickstart, you download and run a code sample that demonstrates how a Node.js console application can get an access token using the app's identity to call the Microsoft Graph API and display a [list of users](/graph/api/user-list) in the directory. The code sample demonstrates how an unattended job or Windows service can run with an application identity, instead of a user's identity.

This quickstart uses the [Microsoft Authentication Library for Node.js (MSAL Node)](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node) with the [client credentials grant](v2-oauth2-client-creds-grant-flow.md).

## Prerequisites

* [Node.js](https://nodejs.org/en/download/)
* [Visual Studio Code](https://code.visualstudio.com/download) or another code editor


## Register and download the sample application

Follow the steps below to get started.

#### Step 1: Register the application

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

To register your application and add the app's registration information to your solution manually, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. If you have access to multiple tenants, use the **Directories + subscriptions** filter :::image type="icon" source="media/common/portal-directory-subscription-filter.png" border="false"::: in the top menu to switch to the tenant in which you want to register the application.
1. Search for and select **Azure Active Directory**.
1. Under **Manage**, select **App registrations** > **New registration**.
1. Enter a **Name** for your application, for example `msal-node-cli`. Users of your app might see this name, and you can change it later.
1. Select **Register**.
1. Under **Manage**, select **Certificates & secrets**.
1. Under **Client secrets**, select **New client secret**, enter a name, and then select **Add**. Record the secret value in a safe location for use in a later step.
1. Under **Manage**, select **API Permissions** > **Add a permission**. Select **Microsoft Graph**.
1. Select **Application permissions**.
1. Under **User** node, select **User.Read.All**, then select **Add permissions**.

#### Step 2: Download the Node.js sample project

[Download the code sample](https://github.com/azure-samples/ms-identity-javascript-nodejs-console/archive/main.zip)

#### Step 3: Configure the Node.js sample project

1. Extract the zip file to a local folder close to the root of the disk, for example, *C:/Azure-Samples*.
1. Edit *.env* and replace the values of the fields `TENANT_ID`, `CLIENT_ID`, and `CLIENT_SECRET` with the following snippet:

  ```
  "TENANT_ID": "Enter_the_Tenant_Id_Here",
   "CLIENT_ID": "Enter_the_Application_Id_Here",
   "CLIENT_SECRET": "Enter_the_Client_Secret_Here"
   ```
   Where:
   - `Enter_the_Application_Id_Here` - is the **Application (client) ID** of the application you registered earlier. Find this ID on the app registration's **Overview** pane in the Azure portal.
   - `Enter_the_Tenant_Id_Here` - replace this value with the **Tenant ID** or **Tenant name** (for example, contoso.microsoft.com).  Find these values on the app registration's **Overview** pane in the Azure portal.
   - `Enter_the_Client_Secret_Here` - replace this value with the client secret you created earlier. To generate a new key, use **Certificates & secrets** in the app registration settings in the Azure portal.
   
   Using a plaintext secret in the source code poses an increased security risk for your application. Although the sample in this quickstart uses a plaintext client secret, it's only for simplicity. We recommend using [certificate credentials](active-directory-certificate-credentials.md) instead of client secrets in your confidential client applications, especially those apps you intend to deploy to production.

3. Edit *.env* and replace the Azure AD and Microsoft Graph endpoints with the following values:
   - For the Azure AD endpoint, replace `Enter_the_Cloud_Instance_Id_Here` with `https://login.microsoftonline.com`.
   - For the Microsoft Graph endpoint, replace `Enter_the_Graph_Endpoint_Here` with `https://graph.microsoft.com/`.

#### Step 4: Admin consent

If you try to run the application at this point, you'll receive *HTTP 403 - Forbidden* error: `Insufficient privileges to complete the operation`. This error happens because any *app-only permission* requires **admin consent**: a global administrator of your directory must give consent to your application. Select one of the options below depending on your role:

##### Global tenant administrator

If you're a global tenant administrator, go to **API Permissions** page in the Azure portal's Application Registration and select **Grant admin consent for {Tenant Name}** (where {Tenant Name} is the name of your directory).

##### Standard user

If you're a standard user of your tenant, then you need to ask a global administrator to grant **admin consent** for your application. To do this, give the following URL to your administrator:

```url
https://login.microsoftonline.com/Enter_the_Tenant_Id_Here/adminconsent?client_id=Enter_the_Application_Id_Here
```

 Where:
 * `Enter_the_Tenant_Id_Here` - replace this value with the **Tenant Id** or **Tenant name** (for example, contoso.microsoft.com)
 * `Enter_the_Application_Id_Here` - is the **Application (client) ID** for the application you registered.

#### Step 5: Run the application

Locate the sample's root folder (where `package.json` resides) in a command prompt or console. You'll need to install the dependencies your sample app requires before running it for the first time:

```console
npm install
```

Then, run the application via command prompt or console:

```console
node . --op getUsers
```

You should see on the console output some JSON fragment representing a list of users in your Azure AD directory.

## About the code

Below, some of the important aspects of the sample application are discussed.

### MSAL Node

[MSAL Node](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node) is the library used to sign in users and request tokens used to access an API protected by Microsoft identity platform. As described, this quickstart requests tokens by application permissions (using the application's own identity) instead of delegated permissions. The authentication flow used in this case is known as [OAuth 2.0 client credentials flow](v2-oauth2-client-creds-grant-flow.md). For more information on how to use MSAL Node with daemon apps, see [Scenario: Daemon application](scenario-daemon-overview.md).

 You can install MSAL Node by running the following npm command.

```console
npm install @azure/msal-node --save
```

### MSAL initialization

You can add the reference for MSAL by adding the following code:

```javascript
const msal = require('@azure/msal-node');
```

Then, initialize MSAL using the following code:

```javascript
const msalConfig = {
    auth: {
        clientId: "Enter_the_Application_Id_Here",
        authority: "https://login.microsoftonline.com/Enter_the_Tenant_Id_Here",
        clientSecret: "Enter_the_Client_Secret_Here",
   }
};
const cca = new msal.ConfidentialClientApplication(msalConfig);
```

| Where: |Description |
|---------|---------|
| `clientId` | Is the **Application (client) ID** for the application registered in the Azure portal. You can find this value in the app's **Overview** page in the Azure portal. |
| `authority`    | The STS endpoint for user to authenticate. Usually `https://login.microsoftonline.com/{tenant}` for public cloud, where {tenant} is the name of your tenant or your tenant ID.|
| `clientSecret` | Is the client secret created for the application in Azure portal. |

For more information, please see the [reference documentation for `ConfidentialClientApplication`](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/initialize-confidential-client-application.md)

### Requesting tokens

To request a token using app's identity, use `acquireTokenByClientCredential` method:

```javascript
const tokenRequest = {
    scopes: [ 'https://graph.microsoft.com/.default' ],
};

const tokenResponse = await cca.acquireTokenByClientCredential(tokenRequest);
```

|Where:| Description |
|---------|---------|
| `tokenRequest` | Contains the scopes requested. For confidential clients, this should use the format similar to `{Application ID URI}/.default` to indicate that the scopes being requested are the ones statically defined in the app object set in the Azure portal (for Microsoft Graph, `{Application ID URI}` points to `https://graph.microsoft.com`). For custom web APIs, `{Application ID URI}` is defined under **Expose an API** section in Azure portal's Application Registration. |
| `tokenResponse` | The response contains an access token for the scopes requested. |

[!INCLUDE [Help and support](includes/error-handling-and-tips/help-support-include.md)]

## Next steps

To learn more about daemon/console app development with MSAL Node, see the tutorial:

> [!div class="nextstepaction"]
> [Daemon application that calls web APIs](tutorial-v2-nodejs-console.md)
