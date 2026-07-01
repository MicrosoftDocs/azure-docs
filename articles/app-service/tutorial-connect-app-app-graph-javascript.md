---
title: 'Tutorial: Authenticate users E2E to Azure'
description: Learn how to use App Service authentication and authorization to secure your App Service apps end-to-end to a downstream Azure service.
keywords: app service, azure app service, authN, authZ, secure, security, multi-tiered, azure active directory, azure ad
author: cephalin
ms.author: cephalin
ms.devlang: javascript
ms.topic: tutorial
ms.date: 03/26/2026
ms.custom: devx-track-js, engagement-fy23, AppServiceConnectivity
zone_pivot_groups: app-service-platform-windows-linux
ms.service: azure-app-service
# Requires non-internal subscription - internal subscriptions doesn't provide permission to correctly configure Microsoft Entra apps
#customer intent: As an app developer, I want to use Microsoft Graph to support authenticating users end-to-end for my downstream service.
---

# Tutorial: Flow authentication from App Service through back-end API to Microsoft Graph

Learn how to create and configure a back-end App Service app to accept a front-end app's user credential, then exchange that credential for a downstream Azure service. This approach allows a user to sign in to a front-end App Service app, pass their credential to a back-end App Service, then access an Azure service with the same identity.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> - Configure the back-end authentication app to provide a token scoped for the downstream Azure service.
> - Use JavaScript code to exchange the [signed-in user's access token](configure-authentication-oauth-tokens.md#retrieve-tokens-in-app-code) for a new token for downstream service.
> - Use JavaScript code to access downstream service.

## Prerequisites

Complete the previous tutorial, [Access Microsoft Graph from a secured JavaScript app as the user](tutorial-auth-aad.md), before you start this tutorial. Don't remove the resources at the end of the tutorial. This tutorial assumes you have the two app services and their corresponding authentication apps.

The previous tutorial used the Azure Cloud Shell as the shell for the Azure CLI. This tutorial continues that usage.

## Architecture

The tutorial shows how to pass the user credential provided by the front-end app to the back-end app then on to an Azure service. In this tutorial, the downstream service is Microsoft Graph. The user's credential is used to get their profile from Microsoft Graph.

:::image type="content" source="./media/tutorial-connect-app-app-graph-javascript/architecture-app-to-app-to-graph.png" alt-text="Architectural image of App Service connecting to App Service connecting to Microsoft Graph on behalf of a signed-in user.":::

**Authentication flow** for a user to get Microsoft Graph information in this architecture:

The [previous tutorial](tutorial-auth-aad.md) covered:

1. Sign in user to a front-end app configured to use Active Directory as the identity provider.
1. The front-end app service passes user's token to back-end app service.
1. The back-end App is secured to allow the front end to make an API request. The user's access token has an audience for the back-end API and scope of `user_impersonation`.
1. The back-end app registration already has the Microsoft Graph with the scope `User.Read`. This scope is added by default to all app registrations.
1. At the end of the previous tutorial, a _fake_ profile was returned to the front-end app because Graph wasn't connected.

This tutorial extends the architecture:

1. Grant admin consent to bypass the user consent screen for the back-end app.
1. Change the application code to convert the access token sent from the front-end app to an access token with the required permission for Microsoft Graph.
1. Provide code to have back-end app **exchange token** for new token with scope of downstream Azure service such as Microsoft Graph.
1. Provide code to have back-end app **use new token** to access downstream service as the current authenticated user.
1. **Redeploy** back-end app with `az webapp up`.
1. At the end of this tutorial, a _real_ profile is returned to the front-end app because Graph is connected.

This tutorial doesn't:

- Change the front-end app from the previous tutorial.
- Change the back-end authentication app's scope permission because `User.Read` is added by default to all authentication apps.

<a name="1-configure-admin-consent-for-the-backend-app"></a>
## 1. Configure admin consent for the back-end app

In the previous tutorial, when the user signs in to the front-end app, a pop-up window asks for user consent.

In this tutorial, in order to read user profile from Microsoft Graph, the back-end app needs to exchange the signed-in user's [access token](../active-directory/develop/access-tokens.md) for a new access token with the required permissions for Microsoft Graph. Because the user isn't directly connected to the back-end app, they can't access the consent screen interactively. You must work around this issue by configuring the back-end app's app registration in Microsoft Entra ID to [grant admin consent](../active-directory/manage-apps/grant-admin-consent.md?pivots=portal). A Microsoft Entra administrator usually makes this setting change.

1. Open the Azure portal and search for your resource for the back-end App Service.
1. Find the **Settings** > **Authentication** section.
1. Select the identity provider to go to the authentication app.
1. In the authentication app, select **Manage** > **API permissions**.
1. Select **Grant admin consent for Default Directory**.

    :::image type="content" source="./media/tutorial-connect-app-app-graph-javascript/azure-portal-authentication-app-api-permission-admin-consent-area.png" alt-text="Screenshot of Azure portal authentication app with admin consent button highlighted." lightbox="./media/tutorial-connect-app-app-graph-javascript/azure-portal-authentication-app-api-permission-admin-consent-area.png":::

1. In the pop-up window, select **Yes** to confirm the consent.
1. Verify the **Status** column says **Granted for Default Directory**. With this setting, the back-end app is no longer required to show a consent screen to the signed-in user and can directly request an access token. The signed-in user has access to the `User.Read` scope setting because that is the default scope with which the app registration is created.

    :::image type="content" source="./media/tutorial-connect-app-app-graph-javascript/azure-portal-authentication-app-api-permission-admin-consent-granted.png" alt-text="Screenshot of Azure portal authentication app with admin consent granted in status column." lightbox="./media/tutorial-connect-app-app-graph-javascript/azure-portal-authentication-app-api-permission-admin-consent-granted.png":::

## 2. Install npm packages

In the previous tutorial, the back-end app didn't need any npm packages for authentication because the only authentication was provided by configuring the identity provider in the Azure portal. In this tutorial, the signed-in user's access token for the back-end API must be exchanged for an access token with Microsoft Graph in its scope. This exchange is completed with two libraries because this exchange doesn't use App Service authentication anymore. Instead, it uses Microsoft Entra ID and MSAL.js directly.

- [@azure/msal-node](https://www.npmjs.com/package/@azure/msal-node): exchange token
- [@microsoft/microsoft-graph-client](https://www.npmjs.com/package/@microsoft/microsoft-graph-client): connect to Microsoft Graph

1. Open the Azure Cloud Shell and change into the sample directory's back-end app:

    ```azurecli-interactive
    cd js-e2e-web-app-easy-auth-app-to-app/backend
    ```

1. Install the Azure Microsoft Authentication Library (MSAL) npm package:

    ```azurecli-interactive
    npm install @azure/msal-node
    ```

1. Install the Microsoft Graph npm package:

    ```azurecli-interactive
    npm install @microsoft/microsoft-graph-client
    ```

## 3. Add code to exchange current token for Microsoft Graph token

The source code to complete this step is provided for you. Use the following steps to include it.

1. Open the `./src/server.js` file.
1. Uncomment the following dependency at the top of the file:

    ```javascript
    import { getGraphProfile } from './with-graph/graph';
    ```

1. In the same file, uncomment the `graphProfile` variable:

    ```javascript
    let graphProfile={};
    ```

1. In the same file, uncomment the following `getGraphProfile` lines in the `get-profile` route to get the profile from Microsoft Graph:

    ```javascript
    // where did the profile come from
    profileFromGraph=true;

    // get the profile from Microsoft Graph
    graphProfile = await getGraphProfile(accessToken);

    // log the profile for debugging
    console.log(`profile: ${JSON.stringify(graphProfile)}`);
    ```

1. Save the changes: <kbd>Ctrl</kbd> + <kbd>s</kbd>.
1. Redeploy the back-end app:

    ```azurecli-interactive
    az webapp up --resource-group myAuthResourceGroup --name <back-end-app-name> 

<a name="4-inspect-backend-code-to-exchange-backend-api-token-for-the-microsoft-graph-token"></a>

## 4. Inspect back-end code to exchange back-end API token for the Microsoft Graph token

In order to change the back-end API audience token for a Microsoft Graph token, the back-end app needs to find the Tenant ID and use that as part of the MSAL.js configuration object. Because the back-end app is configured with Microsoft as the identity provider, the Tenant ID and several other required values are already in the App Service app settings.

The following code is provided for you in the sample app. You need to understand why it's there and how it works so that you can apply this work to other apps you build that need this same functionality.

### Inspect code for getting the Tenant ID

1. Open the `./backend/src/with-graph/auth.js` file.

1. Review the `getTenantId()` function.

    ```javascript
    export function getTenantId() {
    
        const openIdIssuer = process.env.WEBSITE_AUTH_OPENID_ISSUER;
        const backendAppTenantId = openIdIssuer.replace(/https:\/\/sts\.windows\.net\/(.{1,36})\/v2\.0/gm, '$1');
    
        return backendAppTenantId;
    }
    ```

1. This function gets the current tenant ID from the `WEBSITE_AUTH_OPENID_ISSUER` environment variable. The ID is parsed out of the variable with a regular expression.

### Inspect code to get Graph token using MSAL.js

1. In the `./backend/src/with-graph/auth.js` file, review the `getGraphToken()` function.
1. Build the MSAL.js configuration object. Use the MSAL configuration to create the `clientCredentialAuthority`. Configure the on-behalf-of request. Then use the `acquireTokenOnBehalfOf` to exchange the back-end API access token for a Graph access token.

    ```javascript
    // ./backend/src/auth.js
    // Exchange current bearerToken for Graph API token
    // Env vars were set by App Service
    export async function getGraphToken(backEndAccessToken) {
    
        const config = {
            // MSAL configuration
            auth: {
                // the backend's authentication CLIENT ID 
                clientId: process.env.WEBSITE_AUTH_CLIENT_ID,
                // the backend's authentication CLIENT SECRET 
                clientSecret: process.env.MICROSOFT_PROVIDER_AUTHENTICATION_SECRET,
                // OAuth 2.0 authorization endpoint (v2)
                // should be: https://login.microsoftonline.com/BACKEND-TENANT-ID
                authority: `https://login.microsoftonline.com/${getTenantId()}`
            },
            // used for debugging
            system: {
                loggerOptions: {
                    loggerCallback(loglevel, message, containsPii) {
                        console.log(message);
                    },
                    piiLoggingEnabled: true,
                    logLevel: MSAL.LogLevel.Verbose,
                }
            }
        };
    
        const clientCredentialAuthority = new MSAL.ConfidentialClientApplication(config);
    
        const oboRequest = {
            oboAssertion: backEndAccessToken,
            // this scope must already exist on the backend authentication app registration 
            // and visible in resources.azure.com backend app auth config
            scopes: ["https://graph.microsoft.com/.default"]
        }
    
        // This example has App Service validate token in runtime
        // from headers that can't be set externally
    
        // If you aren't using App Service's authentication, 
        // you must validate your access token yourself
        // before calling this code
        try {
            const { accessToken } = await clientCredentialAuthority.acquireTokenOnBehalfOf(oboRequest);
            return accessToken;
        } catch (error) {
            console.log(`getGraphToken:error.type = ${error.type}  ${error.message}`);
        }
    }
    ```

<a name="5-inspect-backend-code-to-access-microsoft-graph-with-the-new-token"></a>

## 5. Inspect back-end code to access Microsoft Graph with the new token

To access Microsoft Graph as a user signed in to the front-end application, the changes include:

- Configuration of the Active Directory app registration with an API permission to the downstream service, Microsoft Graph, with the necessary scope of `User.Read`.
- Grant admin consent to bypass the user consent screen for the back-end app.
- Change the application code to convert the access token sent from the front-end app to an access token with the required permission for the downstream service, Microsoft Graph.

Now that the code has the correct token for Microsoft Graph, use it to create a client to Microsoft Graph then get the user's profile.

1. Open the `./backend/src/graph.js`

2. In the `getGraphProfile()` function, get the token, then the authenticated client from the token, then get the profile.

    ```javascript
    // 
    import graph from "@microsoft/microsoft-graph-client";
    import { getGraphToken } from "./auth.js";
    
    // Create client from token with Graph API scope
    export function getAuthenticatedClient(accessToken) {
        const client = graph.Client.init({
            authProvider: (done) => {
                done(null, accessToken);
            }
        });
    
        return client;
    }
    export async function getGraphProfile(accessToken) {
        // exchange current backend token for token with 
        // graph api scope
        const graphToken = await getGraphToken(accessToken);
    
        // use graph token to get Graph client
        const graphClient = getAuthenticatedClient(graphToken);
    
        // get profile of user
        const profile = await graphClient
            .api('/me')
            .get();
    
        return profile;
    }
    ```

## 6. Test your changes

1. Use the front-end website in a browser. You might need to refresh your token if it expired.
1. Select `Get user's profile`. This passes your authentication in the bearer token to the back end.
1. The back end responds with the _real_ Microsoft Graph profile for your account.

    :::image type="content" source="./media/tutorial-connect-app-app-graph-javascript/browser-profile-from-microsoft-graph.png" alt-text="Screenshot of web browser showing front-end application after successfully getting real profile from back-end app.":::

## 7. Clean up 

[!INCLUDE [tutorial-connect-app-app-clean.md](./includes/tutorial-connect-app-app-clean.md)]

## Frequently asked questions

#### I got an error `80049217`, what does it mean?

This error, `CompactToken parsing failed with error code: 80049217`, means the back-end App Service isn't authorized to return the Microsoft Graph token. This error is caused because the app registration is missing the `User.Read` permission.

#### I got an error `AADSTS65001`, what does it mean?

This error, `AADSTS65001: The user or administrator has not consented to use the application with ID \<backend-authentication-id>. Send an interactive authorization request for this user and resource`, means the back-end authentication app hasn't been configured for Admin consent. Because the error shows up in the log for the back-end app, the front-end application can't tell the user why they didn't see their profile in the front-end app.

#### How do I connect to a different downstream Azure service as user?

This tutorial demonstrates an API app authenticated to **Microsoft Graph**. The same general steps can be applied to access any Azure service on behalf of the user.

1. No change to the front-end application. Only changes to the back end's authentication app registration and back-end app source code.
1. Exchange the user's token scoped for back-end API for a token to the downstream service you want to access.
1. Use token in downstream service's SDK to create the client.
1. Use downstream client to access service functionality.

## Related content

- [Tutorial: Create a secure n-tier app in Azure App Service](tutorial-secure-ntier-app.md)
- [Deploy a Node.js + MongoDB web app to Azure](tutorial-nodejs-mongodb-app.md)
