---
title: 'Tutorial: Authenticate users E2E to Azure' 
description: Learn how to use App Service authentication and authorization to secure your App Service apps end-to-end to a downstream Azure service.
keywords: app service, azure app service, authN, authZ, secure, security, multi-tiered, azure active directory, azure ad
ms.devlang: javascript
ms.topic: tutorial
ms.date: 3/08/2023
ms.custom: "devx-track-js, seodec18, devx-track-azurecli, engagement-fy23"
zone_pivot_groups: app-service-platform-windows-linux
# Requires non-internal subscription - internal subscriptons doesn't provide permission to correctly configure AAD apps
---

# Tutorial: Authenticate and authorize users end-to-end in Azure App Service to a downstream Azure service

Learn how to create and configure a backend App service to accept a frontend app's user credential, then exchange that credential for a downstream Azure service. This allows a user to access a frontend App service, pass through a backend App service, then continue on to access an Azure service with the same identity. 

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Extend the previous tutorial's frontend and backend apps
> * Configure the backend authentication app to provide a token scoped for the downstream service
> * Use JavaScript code to exchange the user's token for a new token scoped to the downstream service.
> * Use JavaScript code to access downstream service.

## Architecture

The tutorial shows how to pass the user from the frontend app to the backend app to an Azure service, such as Microsoft Graph. The user's authorization and authentication is used to get their profile from Microsoft Graph as an example. The process would be similar when you need to access an Azure service on behalf of a user.

**Authentication flow** for a user to get Microsoft Graph information in this architecture:

[Previous tutorial](tutorial-auth-aad.md) covered:

1. Sign in user to a frontend App service. 
1. The frontend App service passes user's token to backend App service. Scope of token is limited to API (B).

This tutorial extends the architecture:

1. Configure the backend App service's login parameters to include the downstream service in **scope**. 
1. Provide code to have backend app **exchange token** for new token with scope of downstream Azure service such as Microsoft Graph. 
1. Provide code to have backend app **use new token** to access downstream service as the current authenticate user. 
1. **Redeploy** backend app with `az webapp up`.

This tutorial doesn't:
* Change the frontend app from the previous tutorial. 
* Change the backend authentication app's permission because User.Read is added by default to all authentication apps. 

## Prerequisites

Complete the [previous tutorial](tutorial-auth-aad.md) before starting this tutorial but don't remove the resources at the end of the tutorial. This tutorial assumes you have the two App services and their corresponding authentication apps. 

The previous tutorial used the Azure Cloud Shell as the shell for the Azure CLI. This tutorial continues that usage. In order to add the code to the backend app service to exchange the token, this tutorial uses a version of the _code_ editor. Other editors are available such as nano, vim, and emacs.

## 1. Configure backend authentication login parameters

Both the backend App Service and authentication app are created but the backend App Service isn't completely configured to access a downstream Azure service. Complete that configuration in these steps.

1. In the Cloud Shell, run the following commands on the backend app to add the `scope` parameter to the authentication setting `identityProviders.azureActiveDirectory.login.loginParameters`. 

    ```azurecli-interactive
    authSettings=$(az webapp auth show -g myAuthResourceGroup -n <backend-end-app-name>)
    authSettings=$(echo "$authSettings" | jq '.properties' | jq '.identityProviders.azureActiveDirectory.login += {"loginParameters":["scope=https://graph.microsoft.com/User.Read]}')
    az webapp auth set --resource-group myAuthResourceGroup --name <back-end-app-name> --body "$authSettings"
    ```

1. The final `identityProviders` object should have the following shape:

    ```json
    {
        "identityProviders": {
            "azureActiveDirectory": {
                "enabled": true,
                "registration": {
                    ... removed for brevity
                },
                "login": {
                    "loginParameters": [
                        "scope=https://graph.microsoft.com/User.Read"
                    ],
                    "disableWWWAuthenticate": false
                },
                "validation": {
                    ... removed for brevity
                },
                "isAutoProvisioned": true
            }
        }
    }
    ```

## Install npm packages

1. Open the Azure Cloud Shell and change into the sample directory's backend app:

    ```azurecli-interactive
    cd js-e2e-web-app-easy-auth-app-to-app/backend
    ```

1. Install the Azure MSAL npm package:

    ```azurecli-interactive
    npm install @azure/msal-node
    ```

1. Install the Microsoft Graph npm package:

    ```azurecli-interactive
    @microsoft/microsoft-graph-client
    ```

## Add code to exchange current token for Microsoft Graph token

The source code to complete this step is provided for you. Use the following steps to include it.

1. Use the cloud sell to open the backend app with _code_:

    ```azurecli-interactive
    code .
    ```

1. Open the `./src/server.js` file.
1. Uncomment the following dependency at the top of the file:

    ```javascript
    import { getGraphProfile } from './with-graph/graph';
    ```

1. In the same file, uncomment the following `getGraphProfile` lines in the `get-profile` route to get the profile from Microsoft Graph:

    ```javascript
    profile = await getGraphProfile(accessToken);
    console.log(`profile: ${JSON.stringify(profile)}`);
    ```

1. Save the changes: <kbd>Ctrl</kbd> + <kbd>s</kbd>.
1. Redeploy the backend app:

    ```azurecli-interactive
    az webapp up --resource-group myAuthResourceGroup --name <back-end-app-name> 
    ```

## Frequently asked questions

### I got an error, what does it mean?

* CompactToken parsing failed with error code: 80049217: the backend App service isn't authorized to return the Microsoft Graph token. 

## Troubleshooting

### Did the application source code deploy correctly to each web app?

1. In the Azure portal for the web app, select **Development Tools -> Advanced Tools**, then select **Go ->**. This opens a new browser tab or window. 
1. In the new browser tab, select **Browse Directory -> Site wwwroot**.
1. Verify the following are in the directory:

    * package.json
    * node_modules.tar.gz
    * /src/index.js 

1. Verify the package.json's `name` property is the same as the web name, either `client-a` or `api-b`.
1. Verify that the source files aren't one level deep but at the wwwwroot level. If the files are nested down 1 directory, you zip file is probably incorrectly including that directory. Rezip from inside the base of the source code directory for each project. 

### Did the application start correctly

Both the web apps should return something when the home page is requested. If the home page or an application error doesn't return, this is indication of the application not starting correctly. Review the error logs on the web app. 

1. In the Azure portal for the web app, select **Development Tools -> Advanced Tools**, then select **Go ->**. This opens a new browser tab or window. 
1. In the new browser tab, select **Browse Directory -> Deployment Logs**.
1. Review each log to find any reported issues. 

### Is each web app configured correctly?

In each web app, verify the **Settings -> Configuration** has app settings it needs

* Client (a):
    * API_B_URL: the URL of the API (b) app, such as `https://api-b-johnsmith.azurewebsites.net/get-profile`
    * SCM_DO_BUILD_DURING_DEPLOYMENT: true
    * MICROSOFT_PROVIDER_AUTHENTICATION_SECRET: this value is the Authentication app's secret
* API (b):
    * SCM_DO_BUILD_DURING_DEPLOYMENT: true
    * MICROSOFT_PROVIDER_AUTHENTICATION_SECRET: this value is the Authentication app's secret

### Does the client web app have a valid and correctly scoped token?

Each web site has a `/debug` route to help with this. 

Use the debug route to verify the client (a) has a token, and
1. Verify that the token isn't expired. The debug route decodes the `exp` property in the token in another property `IsExpired`. This value should be false.
1. Verify that the token has the correct scope: The debug route displays the `scp` property for the scope. This value should be `user_impersonation`.

The `/debug` route also displays the HTTP headers and the environment variables, if you need them. 

### Does the API app return an empty profile `{}`? 

1. Refresh you client (a) user token with a route like: `https://client-a-johnsmith.azurewebsites.net/.auth/refresh`.
1. Retry to get your profile from the API server with a route like: `https://client-a-johnsmith.azurewebsites.net/get-profile`

### Is the client web app able to talk to the API web app?

Because the client web app calls the API web app from server source code, this isn't something you can see in the browser network traffic. The API web app will return any errors it receives from Microsoft Graph back to the client web app.

## Connecting to a different Azure service

This tutorial demonstrates an API app authenticated to **Microsoft Graph**, however, the same general steps can be applied to access any Azure service on behalf of the user. The exchange for a new token must include the scope for that service.

[!INCLUDE [second-part](./includes/tutorial-connect-app-access-microsoft-graph-as-user/end.md)]