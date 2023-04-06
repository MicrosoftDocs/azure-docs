---
title: "Quickstart: Call Microsoft Graph from a Node.js console app"
description: In this quickstart, you download and run a code sample that shows how a Node.js console application can get an access token and call an API protected by a Microsoft identity platform endpoint, using the app's own identity
services: active-directory
author: OwenRichards1
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.date: 08/22/2022
ROBOTS: NOINDEX
ms.author: owenrichards
ms.custom: mode-api
#Customer intent: As an application developer, I want to learn how my Node.js app can get an access token and call an API that is protected by a Microsoft identity platform endpoint using client credentials flow.
---

# Quickstart: Acquire a token and call Microsoft Graph API from a Node.js console app using app's identity

> [!div renderon="docs"]
> Welcome! This probably isn't the page you were expecting. While we work on a fix, this link should take you to the right article:
> 
> > [Quickstart: Node.js console app that calls an API](console-app-quickstart.md?pivots=devlang-nodejs)
> 
> We apologize for the inconvenience and appreciate your patience while we work to get this resolved.

> [!div renderon="portal" id="display-on-portal" class="sxs-lookup"]
> # Quickstart: Acquire a token and call Microsoft Graph API from a Node.js console app using app's identity
> 
> In this quickstart, you download and run a code sample that demonstrates how a Node.js console application can get an access token using the app's identity to call the Microsoft Graph API and display a [list of users](/graph/api/user-list) in the directory. The code sample demonstrates how an unattended job or Windows service can run with an application identity, instead of a user's identity.
> 
> This quickstart uses the [Microsoft Authentication Library for Node.js (MSAL Node)](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node) with the [client credentials grant](v2-oauth2-client-creds-grant-flow.md).
> 
> ## Prerequisites
> 
> * [Node.js](https://nodejs.org/en/download/)
> * [Visual Studio Code](https://code.visualstudio.com/download) or another code editor
> 
> ### Download and configure the sample app
> 
> #### Step 1: Configure the application in Azure portal
> For the code sample for this quickstart to work, you need to create a client secret, and add Graph API's **User.Read.All** application permission.
>
> <button id="makechanges" class="nextstepaction configure-app-button"> Make these changes for me </button>
> 
> > [!div id="appconfigured" class="alert alert-info"]
> > ![Already configured](media/quickstart-v2-netcore-daemon/green-check.png) Your application is configured with these attributes.
> 
> #### Step 2: Download the Node.js sample project
> 
> > [!div class="nextstepaction"]
> > <button id="downloadsample" class="download-sample-button">Download the code sample</button>
> 
> > [!div class="sxs-lookup"]
> > > [!NOTE]
> > > `Enter_the_Supported_Account_Info_Here`
> 
> #### Step 3: Admin consent
> 
> If you try to run the application at this point, you'll receive *HTTP 403 - Forbidden* error: `Insufficient privileges to complete the operation`. This error happens because any *app-only permission* requires **admin consent**: a global administrator of your directory must give consent to your application. Select one of the options below depending on your role:
> 
> ##### Global tenant administrator
> 
> If you are a global administrator, go to **API Permissions** page select **Grant admin consent for > Enter_the_Tenant_Name_Here**
> > [!div id="apipermissionspage"]
> > [Go to the API Permissions page]()
> 
> ##### Standard user
> 
> If you're a standard user of your tenant, then you need to ask a global administrator to grant **admin consent** for your application. To do this, give the following URL to your administrator:
> 
> ```url
> https://login.microsoftonline.com/Enter_the_Tenant_Id_Here/adminconsent?client_id=Enter_the_Application_Id_Here
> ```
> 
> #### Step 4: Run the application
> 
> Locate the sample's root folder (where `package.json` resides) in a command prompt or console. You'll need to install the dependencies of this sample once:
> 
> ```console
> npm install
> ```
> 
> Then, run the application via command prompt or console:
> 
> ```console
> node . --op getUsers
> ```
> 
> You should see on the console output some JSON fragment representing a list of users in your Azure AD directory.
> 
> ## About the code
> 
> Below, some of the important aspects of the sample application are discussed.
> 
> ### MSAL Node
> 
> [MSAL Node](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node) is the library used to sign in users and request tokens used to access an API protected by Microsoft identity platform. As described, this quickstart requests tokens by application permissions (using the application's own identity) instead of delegated permissions. The authentication flow used in this case is known as [OAuth 2.0 client credentials flow](v2-oauth2-client-creds-grant-flow.md). For more information on how to use MSAL Node with daemon apps, see [Scenario: Daemon application](scenario-daemon-overview.md).
> 
>  You can install MSAL Node by running the following npm command.
> 
> ```console
> npm install @azure/msal-node --save
> ```
> 
> ### MSAL initialization
> 
> You can add the reference for MSAL by adding the following code:
> 
> ```javascript
> const msal = require('@azure/msal-node');
> ```
> 
> Then, initialize MSAL using the following code:
> 
> ```javascript
> const msalConfig = {
>     auth: {
>         clientId: "Enter_the_Application_Id_Here",
>         authority: "https://login.microsoftonline.com/Enter_the_Tenant_Id_Here",
>         clientSecret: "Enter_the_Client_Secret_Here",
>    }
> };
> const cca = new msal.ConfidentialClientApplication(msalConfig);
> ```
> 
> > | Where: |Description |
> > |---------|---------|
> > | `clientId` | Is the **Application (client) ID** for the application registered in the Azure portal. You can find this value in the app's **Overview** page in the Azure portal. |
> > | `authority`    | The STS endpoint for user to authenticate. Usually `https://login.microsoftonline.com/{tenant}` for public cloud, where {tenant} is the name of your tenant or your tenant Id.|
> > | `clientSecret` | Is the client secret created for the application in Azure Portal. |
> 
> For more information, please see the [reference documentation for `ConfidentialClientApplication`](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/initialize-confidential-client-application.md)
> 
> ### Requesting tokens
> 
> To request a token using app's identity, use `acquireTokenByClientCredential` method:
> 
> ```javascript
> const tokenRequest = {
>     scopes: [ 'https://graph.microsoft.com/.default' ],
> };
> 
> const tokenResponse = await cca.acquireTokenByClientCredential(tokenRequest);
> ```
> 
> > |Where:| Description |
> > |---------|---------|
> > | `tokenRequest` | Contains the scopes requested. For confidential clients, this should use the format similar to `{Application ID URI}/.default` to indicate that the scopes being requested are the ones statically defined in the app object set in the Azure Portal (for Microsoft Graph, `{Application ID URI}` points to `https://graph.microsoft.com`). For custom web APIs, `{Application ID URI}` is defined under **Expose an API** section in Azure Portal's Application Registration. |
> > | `tokenResponse` | The response contains an access token for the scopes requested. |
> 
> [!INCLUDE [Help and support](../../../includes/active-directory-develop-help-support-include.md)]
> 
> ## Next steps
> 
> To learn more about daemon/console app development with MSAL Node, see the tutorial:
> 
> > [!div class="nextstepaction"]
> > [Daemon application that calls web APIs](tutorial-v2-nodejs-console.md)
