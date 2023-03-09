---
title: 'Tutorial: Authenticate users E2E to Azure' 
description: Learn how to use App Service authentication and authorization to secure your App Service apps end-to-end to a downstream Azure service.
keywords: app service, azure app service, authN, authZ, secure, security, multi-tiered, azure active directory, azure ad
ms.devlang: javascript
ms.topic: tutorial
ms.date: 3/09/2023
ms.custom: "devx-track-js, seodec18, devx-track-azurecli, engagement-fy23"
zone_pivot_groups: app-service-platform-windows-linux
# Requires non-internal subscription - internal subscriptons doesn't provide permission to correctly configure AAD apps
---

# Tutorial: Authenticate and authorize users end-to-end in Azure App Service to a downstream Azure service

Learn how to create and configure a backend App service to accept a frontend app's user credential, then exchange that credential for a downstream Azure service. This allows a user to sign in to a frontend App service, pass their credential to a backend App service, then access an Azure service with the same identity. 

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Extend the previous tutorial's backend app
> * Configure the backend authentication app to provide a token scoped for the downstream Azure service
> * Use JavaScript code to exchange the user's token for a new token for downstream service.
> * Use JavaScript code to access downstream service.

## Prerequisites

Complete the [previous tutorial](tutorial-auth-aad.md) before starting this tutorial but don't remove the resources at the end of the tutorial. This tutorial assumes you have the two App services and their corresponding authentication apps. 

The previous tutorial used the Azure Cloud Shell as the shell for the Azure CLI. This tutorial continues that usage. In order to add the code to the backend app service to exchange the token, this tutorial uses a version of the _code_ editor. Other editors are available such as nano, vim, and emacs.

## Architecture

The tutorial shows how to pass the user credential provided by the frontend app to the backend app then on to an Azure service. In this tutorial, the downstream service is Microsoft Graph. The user's credential is used to get their profile from Microsoft Graph. 

**Authentication flow** for a user to get Microsoft Graph information in this architecture:

[Previous tutorial](tutorial-auth-aad.md) covered:

1. Sign in user to a frontend App service configured to use Active Directory as the identity provider. 
1. The frontend App service passes user's token to backend App service. 
1. The backend App is secured to allow the frontend to make an API request. The user's access token has an audience for the backend API and scope of `user_impersonation`.

This tutorial extends the architecture:

1. Provide code to have backend app **exchange token** for new token with scope of downstream Azure service such as Microsoft Graph. 
1. Provide code to have backend app **use new token** to access downstream service as the current authenticate user. 
1. **Redeploy** backend app with `az webapp up`.

This tutorial doesn't:
* Change the frontend app from the previous tutorial. 
* Change the backend authentication app's scope permission because `User.Read` is added by default to all authentication apps. 

## Understand user consent

In the previous tutorial, when the user signs in to the frontend app, a pop-up displayed asking for user consent to the authentication app. 

:::image type="content" source="{source}" alt-text="{alt-text}":::

In this tutorial, the backend needs to exchange the user's token for a new token with an audience for **Microsoft Graph** with a scope of **User.Read** in order to get the user's profile. Because the user isn't directly connected to the backend app, the backend authentication app needs to change to _not require_ user consent for Microsoft Graph. 

This is a setting change typically done by an Active Directory administrator. For this tutorial, you change that setting as though you're that role in your organization. If you don't change this setting, the backend app logs an error such as `AADSTS65001: The user or administrator has not consented to use the application with ID \<backend-authentication-id>. Send an interactive authorization request for this user and resource`. Because the error shows up in the log, the user doesn't know why they didn't see their profile in the frontend app.

## 1. Configure backend authentication app with admin consent

Configure the [user consent](#understand-user-consent) for the backend app. 

1. Open the Azure portal and search for your research for the backend App Service.
1. Find the **Settings -> Authentication** section.
1. Select the identity provider to go to the authentication app.
1. In the authentication app, select **Manage -> API permissions**.
1. Select **Grant admin consent for Default Directory**.
1. In the pop-up window, select **Yes** to confirm the consent. 
1. Verify the **Status** column says **Granted for Default Directory**.

## Install npm packages

In the previous tutorial, the backend app didn't need any npm packages for authentication because the only authentication was provided by configuring the identity provider. In this tutorial, the user's token for the backend API with `user_impersonation` needs to be exchanged for a Microsoft Graph token. This exchange is completed with two libraries.

* @azure/msal-node - exchange token
* @microsoft/microsoft-graph-client - connect to Microsoft Graph

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

1. Use the Cloud Shell to open the backend app with _code_:

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
## Clean up 

[!INCLUDE [tutorial-connect-app-app-clean.md](./includes/tutorial-connect-app-app-clean.md)]


## Frequently asked questions

### I got an error, what does it mean?

* `CompactToken parsing failed with error code: 80049217` means the backend App service isn't authorized to return the Microsoft Graph token. 
*  `AADSTS65001: The user or administrator has not consented to use the application with ID \<backend-authentication-id>. Send an interactive authorization request for this user and resource` means the backend authentication app hasn't been configured for Admin consent. 

## Connecting to a different Azure service

This tutorial demonstrates an API app authenticated to **Microsoft Graph**, however, the same general steps can be applied to access any Azure service on behalf of the user. The exchange for a new token must include the scope for that service.

## Next steps

* [TBD]()