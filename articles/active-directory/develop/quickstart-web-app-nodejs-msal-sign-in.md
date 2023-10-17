---
title: "Quickstart: Sign in users and call the Microsoft Graph API from a Node.js web application using MSAL Node"
description: In this quickstart, you learn how to implement authentication with a Node.js web app and the Microsoft Authentication Library (MSAL) for Node.js.
services: active-directory
author: cilwerner
manager: celested

ms.service: active-directory
ms.subservice: develop
ms.topic: quickstart
ms.workload: identity
ms.date: 07/27/2023
ms.author: cwerner
ms.reviewer: jmprieur
ms.custom: aaddev, scenarios:getting-started, languages:js, devx-track-js
# Customer intent: As an application developer, I want to know how to set up authentication in a web application built using Node.js and MSAL Node.
---

# Quickstart: Sign in users and call the Microsoft Graph API from a Node.js web application using MSAL Node

In this quickstart, you download and run a code sample that demonstrates how a Node.js web app can sign in users by using the authorization code flow. The code sample also demonstrates how to get an access token to call the Microsoft Graph API.

See [How the sample works](#how-the-sample-works) for an illustration.

This quickstart uses the Microsoft Authentication Library for Node.js (MSAL Node) with the authorization code flow.

## Prerequisites

* An Azure subscription. [Create an Azure subscription for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* [Node.js](https://nodejs.org/en/download/)
* [Visual Studio Code](https://code.visualstudio.com/download) or another code editor


## Register and download your quickstart application

#### Step 1: Register your application

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator). 
1. If you have access to multiple tenants, use the **Directories + subscriptions** filter :::image type="icon" source="./media/quickstart-configure-app-access-web-apis/portal-01-directory-subscription-filter.png" border="false"::: in the top menu to select the tenant containing your client app's registration.
1. Browse to **Identity** > **Applications** > **App registrations** and select **New registration**.
1. Enter a **Name** for your application. Users of your app might see this name, and you can change it later.
1. Under **Supported account types**, select **Accounts in this organizational directory only**.
1. Set the **Redirect URI** type to **Web** and value to `http://localhost:3000/auth/redirect`.
1. Select **Register**.
1. On the app **Overview** page, note the **Application (client) ID** value for later use.
1. Under **Manage**, select **Certificates & secrets** > **Client secrets** > **New client secret**.  Leave the description blank and default expiration, and then select **Add**.
1. Note the value of **Client secret** for later use.

#### Step 2: Download the project

To run the project with a web server by using Node.js, [download the core project files](https://github.com/Azure-Samples/ms-identity-node/archive/main.zip).


#### Step 3: Configure your Node app

Extract the project, open the *ms-identity-node-main* folder, and then open the *.env* file under the *App* folder. Replace the values above as follows:

| Variable  |  Description | Example(s) |
|-----------|--------------|------------|
| `Enter_the_Cloud_Instance_Id_Here` | The Azure cloud instance in which your application is registered | `https://login.microsoftonline.com/` (include the trailing forward-slash) |
| `Enter_the_Tenant_Info_here` | Tenant ID or Primary domain | `contoso.microsoft.com` or `cbe899ec-5f5c-4efe-b7a0-599505d3d54f` |
| `Enter_the_Application_Id_Here` | Client ID of the application you registered | `cbe899ec-5f5c-4efe-b7a0-599505d3d54f` |
| `Enter_the_Client_Secret_Here` | Client secret of the application you registered | `WxvhStRfDXoEiZQj1qCy` |
| `Enter_the_Graph_Endpoint_Here` | The Microsoft Graph API cloud instance that your app will call | `https://graph.microsoft.com/` (include the trailing forward-slash) |
| `Enter_the_Express_Session_Secret_Here` | A random string of characters used to sign the Express session cookie | `WxvhStRfDXoEiZQj1qCy` |

Your file should look similar to below:

```text
CLOUD_INSTANCE=https://login.microsoftonline.com/
TENANT_ID=cbe899ec-5f5c-4efe-b7a0-599505d3d54f
CLIENT_ID=fa29b4c9-7675-4b61-8a0a-bf7b2b4fda91
CLIENT_SECRET=WxvhStRfDXoEiZQj1qCy

REDIRECT_URI=http://localhost:3000/auth/redirect
POST_LOGOUT_REDIRECT_URI=http://localhost:3000

GRAPH_API_ENDPOINT=https://graph.microsoft.com/

EXPRESS_SESSION_SECRET=6DP6v09eLiW7f1E65B8k
```


#### Step 4: Run the project

Run the project by using Node.js.

1. To start the server, run the following commands from within the project directory:

    ```console
    cd App
    npm install
    npm start
    ```

1. Go to `http://localhost:3000/`.

1. Select **Sign in** to start the sign-in process.

    The first time you sign in, you're prompted to provide your consent to allow the application to sign you in and access your profile. After you're signed in successfully, you'll be redirected back to the application home page.

## More information

### How the sample works

The sample hosts a web server on localhost, port 3000. When a web browser accesses this address, the app renders the home page. Once the user selects **Sign in**, the app redirects the browser to Microsoft Entra sign-in screen, via the URL generated by the MSAL Node library. After user consents, the browser redirects the user back to the application home page, along with an ID and access token.  

### MSAL Node

The MSAL Node library signs in users and requests the tokens that are used to access an API that's protected by Microsoft identity platform. You can download the latest version by using the Node.js Package Manager (npm):

```console
npm install @azure/msal-node
```

## Next steps

Learn more about the web app scenario that the Microsoft identity platform supports:
> [!div class="nextstepaction"]
> [Web app that signs in users scenario](scenario-web-app-sign-user-overview.md)
