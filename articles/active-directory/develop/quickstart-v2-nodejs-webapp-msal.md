---
page_type: quickstart
languages:
- javascript
products:
- azure-active-directory
- javascript
- nodejs
description: "Add Authentication to a Node web app with MSAL Node"
urlFragment: "quickstart-v2-nodejs-webapp-msal"
---
# Quickstart: Sign in users and get an access token in a Node web app using the auth code flow

In this quickstart, you run a code sample that demonstrates how a Node.js web app can sign in users of personal accounts, work accounts, and school accounts by using the authorization code flow. The code sample also demonstrates obtaining an access token to call a web API, in this case the Microsoft Graph API. See [How the sample works](#how-the-sample-works) for an illustration.

This quickstart uses the Microsoft Authentication Library for Node.js (MSAL Node) with the authorization code flow.

> [!IMPORTANT]
> MSAL Node [!INCLUDE [PREVIEW BOILERPLATE](../../../includes/active-directory-develop-preview.md)]

## Prerequisites

* Azure subscription - [Create an Azure subscription for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
* [Node.js](https://nodejs.org/en/download/)
* [Visual Studio Code](https://code.visualstudio.com/download) or another code editor

> [!div renderon="docs"]
> ## Register and download your quickstart application
>
> #### Step 1: Register your application
>
> 1. Sign in to the [Azure portal](https://portal.azure.com).
> 1. If your account gives you access to more than one tenant, select your account at the top right, and then set your portal session to the Azure AD tenant you want to use.
> 1. Select [App registrations](https://go.microsoft.com/fwlink/?linkid=2083908).
> 1. Select **New registration**.
> 1. When the **Register an application** page appears, enter a name for your application.
> 1. Under **Supported account types**, select **Accounts in any organizational directory and personal Microsoft accounts**.
> 1. Set the **Redirect URI** value to `http://localhost:3000/redirect`.
> 1. Select **Register**. 
> 1. On the app **Overview** page, note the **Application (client) ID** value for later use.
> 1. Under **Certificates & secrets**, select **New client secret**.  Leave the description blank and default expiration, and then click **Add**.
> 1. Note the **Value** of the **Client Secret** for later use.

#### Step 2: Download the project

> [!div renderon="docs"]
> To run the project with a web server by using Node.js, [download the core project files](https://github.com/Azure-Samples/ms-identity-node/archive/main.zip).

> [!div renderon="portal" class="sxs-lookup"]
> Run the project with a web server by using Node.js

> [!div renderon="portal" class="sxs-lookup" id="autoupdate" class="nextstepaction"]
> [Download the code sample](https://github.com/Azure-Samples/ms-identity-node/archive/main.zip)

> [!div renderon="docs"]
> #### Step 3: Configure your Node app
>
> Extract the project, and open the folder *ms-identity-node-main*, then open the *index.js* file.
> Set the `clientID` with the **Application (client) ID**.
> Set the `clientSecret` with the **Value** of the **Client secret**.
>
>```javascript
>const config = {
>    auth: {
>        clientId: "Enter_the_Application_Id_Here",
>        authority: "https://login.microsoftonline.com/common",
>        clientSecret: "Enter_the_Client_Secret_Here"
>    },
>    system: {
>        loggerOptions: {
>            loggerCallback(loglevel, message, containsPii) {
>                console.log(message);
>            },
>            piiLoggingEnabled: false,
>            logLevel: msal.LogLevel.Verbose,
>        }
>    }
>};
> ```

> [!div renderon="docs"]
>
> Modify the values in the `config` section as described here:
>
> - `Enter_the_Application_Id_Here` is the **Application (client) ID** for the application you registered.
> - `Enter_the_Client_Secret_Here` is the **Value** of the **Client secret** for the application you registered.
>
> The default `authority` value represents the main (global) Azure cloud:
>
> ```javascript
> authority: "https://login.microsoftonline.com/common",
> ```
>
> > [!TIP]
> > To find the value of **Application (client) ID**, go to the app registration's **Overview** page in the Azure portal. Go under **Certificates & secrets** to retrieve or generate a new **Client secret**.
>
> [!div class="sxs-lookup" renderon="portal"]
> #### Step 3: Your app is configured and ready to run
>
> [!div renderon="docs"]
>
> #### Step 4: Run the project

Run the project by using Node.js:

1. To start the server, run the following commands from within the project directory:
    ```console
    npm install
    npm start
    ```
1. Browse to `http://localhost:3000/`.

1. Select **Sign In** to start the sign-in process.

    The first time you sign in, you're prompted to provide your consent to allow the application to access your profile and sign you in. After you're signed in successfully, you will see a log message in the command line.

## More information

### How the sample works

The sample, when run, hosts a web server on localhost, port 3000. When a web browser accesses this site, the sample immediately redirects the user to a Microsoft authentication page. Because of this, the sample does not contain any *html* or display elements. Authentication success displays the message, "OK".

### MSAL Node

The MSAL Node library signs in users and requests the tokens that are used to access an API that's protected by Microsoft identity platform. You can download the latest version by using the Node.js Package Manager (npm):

```console
npm install @azure/msal-node
```

## Next steps

> [!div class="nextstepaction"]
> [Adding Auth to an existing web app - GitHub code sample >](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/samples/msal-node-samples/standalone-samples/auth-code/readme.md)
