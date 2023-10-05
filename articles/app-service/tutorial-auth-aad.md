---
title: 'Tutorial: Authenticate users E2E' 
description: Learn how to use App Service authentication and authorization to secure your App Service apps end-to-end, including access to remote APIs.
keywords: app service, azure app service, authN, authZ, secure, security, multi-tiered, azure active directory, azure ad
author: cephalin
ms.author: cephalin
ms.devlang: csharp
ms.topic: tutorial
ms.date: 3/08/2023
ms.custom: seodec18, devx-track-azurecli, engagement-fy23, AppServiceIdentity
zone_pivot_groups: app-service-platform-windows-linux
# Requires non-internal subscription - internal subscriptions doesn't provide permission to correctly configure AAD apps
---

# Tutorial: Authenticate and authorize users end-to-end in Azure App Service

::: zone pivot="platform-windows"  

[Azure App Service](overview.md) provides a highly scalable, self-patching web hosting service. In addition, App Service has built-in support for [user authentication and authorization](overview-authentication-authorization.md). This tutorial shows how to secure your apps with App Service authentication and authorization. It uses an Express.js with views frontend as an example. App Service authentication and authorization support all language runtimes, and you can learn how to apply it to your preferred language by following the tutorial.

::: zone-end

::: zone pivot="platform-linux"

[Azure App Service](overview.md) provides a highly scalable, self-patching web hosting service using the Linux operating system. In addition, App Service has built-in support for [user authentication and authorization](overview-authentication-authorization.md). This tutorial shows how to secure your apps with App Service authentication and authorization. It uses an Express.js with views. App Service authentication and authorization support all language runtimes, and you can learn how to apply it to your preferred language by following the tutorial.

::: zone-end

In the tutorial, you learn:

> [!div class="checklist"]
> * Enable built-in authentication and authorization
> * Secure apps against unauthenticated requests
> * Use Azure Active Directory as the identity provider
> * Access a remote app on behalf of the signed-in user
> * Secure service-to-service calls with token authentication
> * Use access tokens from server code
> * Use access tokens from client (browser) code

> [!TIP]
> After completing this scenario, continue to the next procedure to learn how to connect to Azure services as an authenticated user. Common scenarios include accessing Azure Storage or a database as the user who has specific abilities or access to specific tables or files. 

The authentication in this procedure is provided at the hosting platform layer by Azure App Service. You must deploy the frontend and backend app and configure authentication for this web app to be used successfully. 

:::image type="content" source="./media/tutorial-auth-aad/front-end-app-service-to-back-end-app-service-authentication.png" alt-text="Conceptual diagram show the authentication flow from the web user to the frontend app to the backend app.":::

## Get the user profile

The frontend app is configured to securely use the backend API. The frontend application provides a Microsoft sign-in for the user, then allows the user to get their **_fake_** profile from the backend. This tutorial uses a fake profile to simplify the steps to complete the scenario. 

Before your source code is executed on the frontend, the App Service injects the authenticated `accessToken` from the App Service `x-ms-token-aad-access-token` header. The frontend source code then accesses and sends the accessToken to the backend server as the `bearerToken` to securely access the backend API. The backend server validates the bearerToken before it's passed into your backend source code. Once your backend source code receives the bearerToken, it can be used. 

 _In [the next article](tutorial-connect-app-access-microsoft-graph-as-user-javascript.md) in this series_, the bearerToken is exchanged for a token with a scope to access the Microsoft Graph API. The Microsoft Graph API returns the user's profile information.

## Prerequisites

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

- [Node.js (LTS)](https://nodejs.org/download/)
[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/articles/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

## 1. Clone the sample application 

1. In the [Azure Cloud Shell](https://shell.azure.com), run the following command to clone the sample repository. 

    ```azurecli-interactive
    git clone https://github.com/Azure-Samples/js-e2e-web-app-easy-auth-app-to-app
    ```

## 2. Create and deploy apps

Create the resource group, web app plan, the web app and deploy in a single step.

::: zone pivot="platform-windows"  

1. Change into the frontend web app directory.

    ```azurecli-interactive
    cd frontend
    ```

1. Create and deploy the frontend web app with [az webapp up](/cli/azure/webapp#az-webapp-up). Because web app name has to be globally unique, replace `<front-end-app-name>` with a unique name. 

    ```azurecli-interactive
    az webapp up --resource-group myAuthResourceGroup --name <front-end-app-name> --plan myPlan --sku FREE --os-type Windows --location "West Europe" --runtime "NODE:16LTS"
    ```

1. Change into the backend web app directory.

    ```azurecli-interactive
    cd ../backend
    ```

1. Deploy the backend web app to same resource group and app plan. Because web app name has to be globally unique, replace `<back-end-app-name>` with a unique set of initials or numbers. 

    ```azurecli-interactive
    az webapp up --resource-group myAuthResourceGroup --name <back-end-app-name> --plan myPlan --os-type Windows --location "West Europe" --runtime "NODE:16LTS"
    ```

::: zone-end

::: zone pivot="platform-linux"

1. Change into the frontend web app directory.

    ```azurecli-interactive
    cd frontend
    ```

1. Create and deploy the frontend web app with [az webapp up](/cli/azure/webapp#az-webapp-up). Because web app name has to be globally unique, replace `<front-end-app-name>` with a unique set of initials or numbers. 

    ```azurecli-interactive
    az webapp up --resource-group myAuthResourceGroup --name <front-end-app-name> --plan myPlan --sku FREE --location "West Europe" --os-type Linux --runtime "NODE:16-lts"
    ```

1. Change into the backend web app directory.

    ```azurecli-interactive
    cd ../backend
    ```

1. Deploy the backend web app to same resource group and app plan. Because web app name has to be globally unique, replace `<back-end-app-name>` with a unique set of initials or numbers. 

    ```azurecli-interactive
    az webapp up --resource-group myAuthResourceGroup --name <back-end-app-name> --plan myPlan --runtime "NODE:16-lts"
    ```

::: zone-end

## 3. Configure app setting

The frontend application needs to the know the URL of the backend application for API requests. Use the following Azure CLI command to configure the app setting. The URL should be in the format of `https://<back-end-app-name>.azurewebsites.net`.

```azurecli-interactive
az webapp config appsettings set --resource-group myAuthResourceGroup --name <front-end-app-name> --settings BACKEND_URL="https://<back-end-app-name>.azurewebsites.net"
```

## 4. Frontend calls the backend

Browse to the frontend app and return the _fake_ profile from the backend. This action validates that the frontend is successfully requesting the profile from the backend, and the backend is returning the profile. 

1. Open the frontend web app in a browser, `https://<front-end-app-name>.azurewebsites.net`. 

    :::image type="content" source="./media/tutorial-auth-aad/app-home-page.png" alt-text="Screenshot of web browser showing frontend application after successfully completing authentication.":::

1. Select the `Get user's profile` link. 
1. View the _fake_ profile returned from the backend web app. 

    :::image type="content" source="./media/tutorial-auth-aad/app-profile-without-authentication.png" alt-text="Screenshot of browser with fake profile returned from server.":::

    The `withAuthentication` value of **false** indicates the authentication _isn't_ set up yet. 

## 5. Configure authentication

In this step, you enable authentication and authorization for the two web apps. This tutorial uses Azure Active Directory as the identity provider. 

You also configure the frontend app to: 

- Grant the frontend app access to the backend app
- Configure App Service to return a usable token
- Use the token in your code.

For more information, see [Configure Azure Active Directory authentication for your App Services application](configure-authentication-provider-aad.md).

### Enable authentication and authorization for backend app

1. In the [Azure portal](https://portal.azure.com) menu, select **Resource groups** or search for and select *Resource groups* from any page.

1. In **Resource groups**, find and select your resource group. In **Overview**, select your backend app.

1. In your backend app's left menu, select **Authentication**, and then select **Add identity provider**.

1. In the **Add an identity provider** page, select **Microsoft** as the **Identity provider** to sign in Microsoft and Azure AD identities.

1. Accept the default settings and select **Add**.

    :::image type="content" source="./media/tutorial-auth-aad/configure-auth-back-end.png" alt-text="Screenshot of the backend app's left menu showing Authentication/Authorization selected and settings selected in the right menu.":::

1. The **Authentication** page opens. Copy the **Client ID** of the Azure AD application to a notepad. You need this value later.

    :::image type="content" source="./media/tutorial-auth-aad/get-application-id-back-end.png" alt-text="Screenshot of the Azure Active Directory Settings window showing the Azure AD App, and the Azure AD Applications window showing the Client ID to copy.":::

If you stop here, you have a self-contained app that's already secured by the App Service authentication and authorization. The remaining sections show you how to secure a multi-app solution by "flowing" the authenticated user from the frontend to the backend. 

### Enable authentication and authorization for frontend app

1. In the [Azure portal](https://portal.azure.com) menu, select **Resource groups** or search for and select *Resource groups* from any page.

1. In **Resource groups**, find and select your resource group. In **Overview**, select your backend app's management page.

    :::image type="content" source="./media/tutorial-auth-aad/portal-navigate-back-end.png" alt-text="Screenshot of the Resource groups window, showing the Overview for an example resource group and a backend app's management page selected.":::

1. In your backend app's left menu, select **Authentication**, and then select **Add identity provider**.

1. In the **Add an identity provider** page, select **Microsoft** as the **Identity provider** to sign in Microsoft and Azure AD identities.

1. Accept the default settings and select **Add**.

    :::image type="content" source="./media/tutorial-auth-aad/configure-auth-back-end.png" alt-text="Screenshot of the backend app's left menu showing Authentication/Authorization selected and settings selected in the right menu.":::

1. The **Authentication** page opens. Copy the **Client ID** of the Azure AD application to a notepad. You need this value later.

    :::image type="content" source="./media/tutorial-auth-aad/get-application-id-back-end.png" alt-text="Screenshot of the Azure Active Directory Settings window showing the Azure AD App, and the Azure AD Applications window showing the Client ID to copy.":::


### Grant frontend app access to backend

Now that you've enabled authentication and authorization to both of your apps, each of them is backed by an AD application. To complete the authentication, you need to do three things:

- Grant the frontend app access to the backend app
- Configure App Service to return a usable token
- Use the token in your code.

> [!TIP]
> If you run into errors and reconfigure your app's authentication/authorization settings, the tokens in the token store may not be regenerated from the new settings. To make sure your tokens are regenerated, you need to sign out and sign back in to your app. An easy way to do it is to use your browser in private mode, and close and reopen the browser in private mode after changing the settings in your apps.

In this step, you **grant the frontend app access to the backend app** on the user's behalf. (Technically, you give the frontend's _AD application_ the permissions to access the backend's _AD application_ on the user's behalf.)

1. In the **Authentication** page for the frontend app, select your frontend app name under **Identity provider**. This app registration was automatically generated for you. Select **API permissions** in the left menu.

1. Select **Add a permission**, then select **My APIs** > **\<back-end-app-name>**.

1. In the **Request API permissions** page for the backend app, select **Delegated permissions** and **user_impersonation**, then select **Add permissions**.

    :::image type="content" source="./media/tutorial-auth-aad/select-permission-front-end.png" alt-text="Screenshot of the Request API permissions page showing Delegated permissions, user_impersonation, and the Add permission button selected.":::

### Configure App Service to return a usable access token

The frontend app now has the required permissions to access the backend app as the signed-in user. In this step, you configure App Service authentication and authorization to give you a usable access token for accessing the backend. For this step, you need the backend's client ID, which you copied from [Enable authentication and authorization for backend app](#enable-authentication-and-authorization-for-backend-app).

In the Cloud Shell, run the following commands on the frontend app to add the `scope` parameter to the authentication setting `identityProviders.azureActiveDirectory.login.loginParameters`. Replace *\<front-end-app-name>* and *\<back-end-client-id>*.

```azurecli-interactive
authSettings=$(az webapp auth show -g myAuthResourceGroup -n <front-end-app-name>)
authSettings=$(echo "$authSettings" | jq '.properties' | jq '.identityProviders.azureActiveDirectory.login += {"loginParameters":["scope=openid offline_access api://<back-end-client-id>/user_impersonation"]}')
az webapp auth set --resource-group myAuthResourceGroup --name <front-end-app-name> --body "$authSettings"
```

The commands effectively add a `loginParameters` property with additional custom scopes. Here's an explanation of the requested scopes:

- `openid` is requested by App Service by default already. For information, see [OpenID Connect Scopes](../active-directory/develop/v2-permissions-and-consent.md#openid-connect-scopes).
- [offline_access](../active-directory/develop/v2-permissions-and-consent.md#offline_access) is included here for convenience (in case you want to [refresh tokens](#what-happens-when-the-frontend-token-expires)).
- `api://<back-end-client-id>/user_impersonation` is an exposed API in your backend app registration. It's the scope that gives you a JWT token that includes the backend app as a [token audience](https://wikipedia.org/wiki/JSON_Web_Token). 

> [!TIP]
> - To view the `api://<back-end-client-id>/user_impersonation` scope in the Azure portal, go to the **Authentication** page for the backend app, click the link under **Identity provider**, then click **Expose an API** in the left menu.
> - To configure the required scopes using a web interface instead, see the Microsoft steps at [Refresh auth tokens](configure-authentication-oauth-tokens.md#refresh-auth-tokens).
> - Some scopes require admin or user consent. This requirement causes the consent request page to be displayed when a user signs into the frontend app in the browser. To avoid this consent page, add the frontend's app registration as an authorized client application in the **Expose an API** page by clicking **Add a client application** and supplying the client ID of the frontend's app registration.

::: zone pivot="platform-linux"

::: zone-end
    
Your apps are now configured. The frontend is now ready to access the backend with a proper access token.

For information on how to configure the access token for other providers, see [Refresh identity provider tokens](configure-authentication-oauth-tokens.md#refresh-auth-tokens).

## 6. Frontend calls the authenticated backend

The frontend app needs to pass the user's authentication with the correct `user_impersonation` scope to the backend. The following steps review the code provided in the sample for this functionality. 

View the frontend app's source code:

1. Use the frontend App Service injected `x-ms-token-aad-access-token` header to programmatically get the user's accessToken.

    ```javascript
    // ./src/server.js
    const accessToken = req.headers['x-ms-token-aad-access-token'];
    ```

1. Use the accessToken in the `Authentication` header as the `bearerToken` value. 

    ```javascript
    // ./src/remoteProfile.js
    // Get profile from backend
    const response = await fetch(remoteUrl, {
        cache: "no-store", // no caching -- for demo purposes only
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    if (response.ok) {
        const { profile } = await response.json();
        console.log(`profile: ${profile}`);
    } else {
        // error handling
    }
    ```

    This tutorial returns a _fake_ profile to simplify the scenario. The [next tutorial](tutorial-connect-app-access-microsoft-graph-as-user-javascript.md) in this series demonstrates how to exchange the backend bearerToken for a new token with the scope of a downstream Azure service, such as Microsoft Graph.

## <a name="call-api-securely-from-server-code"></a>7. Backend returns profile to frontend

If the request from the frontend isn't authorized, the backend App service rejects the request with a 401 HTTP error code _before_ the request reaches your application code. When the backend code is reached (because it including an authorized token), extract the bearerToken to get the accessToken. 

View the backend app's source code:

```javascript
// ./src/server.js
const bearerToken = req.headers['Authorization'] || req.headers['authorization'];

if (bearerToken) {
    const accessToken = bearerToken.split(' ')[1];
    console.log(`backend server.js accessToken: ${!!accessToken ? 'found' : 'not found'}`);

    // TODO: get profile from Graph API
    // provided in next article in this series
    // return await getProfileFromMicrosoftGraph(accessToken)

    // return fake profile for this tutorial
    return {
        "displayName": "John Doe",
        "withAuthentication": !!accessToken ? true : false
    }
}
```

## 8. Browse to the apps

1. Use the frontend web site in a browser. The URL is in the format of `https://<front-end-app-name>.azurewebsites.net/`.
1. The browser requests your authentication to the web app. Complete the authentication.

    :::image type="content" source="./media/tutorial-auth-aad/browser-screenshot-authentication-permission-requested-pop-up.png" alt-text="Screenshot of browser authentication pop-up requesting permissions.":::

1. After authentication completes, the frontend application returns the home page of the app.

    :::image type="content" source="./media/tutorial-auth-aad/app-home-page.png" alt-text="Screenshot of web browser showing frontend application after successfully completing authentication.":::

1. Select `Get user's profile`. This passes your authentication in the bearer token to the backend. 
1. The backend end responds with the _fake_ hard-coded profile name: `John Doe`.

    :::image type="content" source="./media/tutorial-auth-aad/app-profile.png" alt-text="Screenshot of web browser showing frontend application after successfully getting fake profile from backend app.":::

    The `withAuthentication` value of **true** indicates the authentication _is_ set up yet. 

## 9. Clean up resources

[!INCLUDE [tutorial-connect-app-app-clean.md](./includes/tutorial-connect-app-app-clean.md)]

## Frequently asked questions

### How do I test this authentication on my local development machine?

The authentication in this procedure is provided at the hosting platform layer by Azure App Service. There's no equivalent emulator. You must deploy the frontend and backend app and configuration authentication for each in order to use the authentication. 

### The app isn't displaying _fake_ profile, how do I debug it?

The frontend and backend apps both have `/debug` routes to help debug the authentication when this application doesn't return the _fake_ profile. The frontend debug route provides the critical pieces to validate:

* Environment variables: 
    * The `BACKEND_URL` is configured correctly as `https://<back-end-app-name>.azurewebsites.net`. Don't include that trailing forward slash or the route.
* HTTP headers:
    * The `x-ms-token-*` headers are injected. 
* Microsoft Graph profile name for signed in user is displayed.
* Frontend app's **scope** for the token has `user_impersonation`. If your scope doesn't include this, it could be an issue of timing. Verify your frontend app's `login` parameters in [Azure resources](https://resources.azure.com). Wait a few minutes for the replication of the authentication.

### Did the application source code deploy correctly to each web app?

1. In the Azure portal for the web app, select **Development Tools -> Advanced Tools**, then select **Go ->**. This opens a new browser tab or window. 
1. In the new browser tab, select **Browse Directory -> Site wwwroot**.
1. Verify the following are in the directory:

    * package.json
    * node_modules.tar.gz
    * /src/index.js 

1. Verify the package.json's `name` property is the same as the web name, either `frontend` or `backend`.
1. If you changed the source code, and need to redeploy, use [az webapp up](/cli/azure/webapp#az-webapp-up) from the directory that has the package.json file for that app.

### Did the application start correctly

Both the web apps should return something when the home page is requested. If you can't reach `/debug` on a web app, the app didn't start correctly. Review the error logs for that web app. 

1. In the Azure portal for the web app, select **Development Tools -> Advanced Tools**, then select **Go ->**. This opens a new browser tab or window. 
1. In the new browser tab, select **Browse Directory -> Deployment Logs**.
1. Review each log to find any reported issues. 

### Is the frontend app able to talk to the backend app?

Because the frontend app calls the backend app from server source code, this isn't something you can see in the browser network traffic. Use the following list to determine the backend profile request success:

* The backend web app returns any errors to the frontend app if it was reached. If it wasn't reached, the frontend app reports the status code and message.
    * 401: The user didn't pass authentication correctly. This can indicate the scope isn't set correctly.
    * 404: The URL to the server doesn't match a route the server has
* Use the backend app's streaming logs to watch as you make the frontend request for the user's profile. There's debug information in the source code with `console.log` which helps determine where the failure happened.

### What happens when the frontend token expires?

Your access token expires after some time. For information on how to refresh your access tokens without requiring users to reauthenticate with your app, see [Refresh identity provider tokens](configure-authentication-oauth-tokens.md#refresh-auth-tokens).


<a name="next"></a>
## Next steps

What you learned:

> [!div class="checklist"]
> * Enable built-in authentication and authorization
> * Secure apps against unauthenticated requests
> * Use Azure Active Directory as the identity provider
> * Access a remote app on behalf of the signed-in user
> * Secure service-to-service calls with token authentication
> * Use access tokens from server code
> * Use access tokens from client (browser) code

Advance to the next tutorial to learn how to use this user's identity to access an Azure service.

> [!div class="nextstepaction"]
> [Create a secure n-tier app in Azure App Service](tutorial-secure-ntier-app.md)
