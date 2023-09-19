---
title: Tutorial - Web app accesses Microsoft Graph as the user | Azure
description: In this tutorial, you learn how to access data in Microsoft Graph for a signed-in user.
services: microsoft-graph, app-service-web
author: rwike77
manager: CelesteDG

ms.service: app-service
ms.topic: include
ms.workload: identity
ms.date: 09/15/2023
ms.author: ryanwi
ms.reviewer: stsoneff
ms.devlang: csharp, javascript
ms.custom: azureday1
#Customer intent: As an application developer, I want to learn how to access data in Microsoft Graph for a signed-in user.
ms.subservice: web-apps
---

Learn how to access Microsoft Graph from a web app running on Azure App Service.

:::image type="content" alt-text="Diagram that shows accessing Microsoft Graph." source="../../media/scenario-secure-app-access-microsoft-graph/web-app-access-graph.svg" border="false":::

You want to add access to Microsoft Graph from your web app and perform some action as the signed-in user. This section describes how to grant delegated permissions to the web app and get the signed-in user's profile information from Azure Active Directory (Azure AD).

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Grant delegated permissions to a web app.
> * Call Microsoft Graph from a web app for a signed-in user.

[!INCLUDE [quickstarts-free-trial-note](../../../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

* A web application running on Azure App Service that has the [App Service authentication/authorization module enabled](../../scenario-secure-app-authentication-app-service.md).

## Grant front-end access to call Microsoft Graph

Now that you've enabled authentication and authorization on your web app, the web app is registered with the Microsoft identity platform and is backed by an Azure AD application. In this step, you give the web app permissions to access Microsoft Graph for the user. (Technically, you give the web app's Azure AD application the permissions to access the Microsoft Graph Azure AD application for the user.)

1. In the [Microsoft Entra admin center](https://entra.microsoft.com), select **Applications**.

1. Select **App registrations** > **Owned applications** > **View all applications in this directory**. Select your web app name, and then select **API permissions**.

1. Select **Add a permission**, and then select Microsoft APIs and Microsoft Graph.

1. Select **Delegated permissions**, and then select **User.Read** from the list. Select **Add permissions**.

## Configure App Service to return a usable access token

The web app now has the required permissions to access Microsoft Graph as the signed-in user. In this step, you configure App Service authentication and authorization to give you a usable access token for accessing Microsoft Graph. For this step, you need to add the User.Read scope for the downstream service (Microsoft Graph): `https://graph.microsoft.com/User.Read`.

> [!IMPORTANT]
> If you don't configure App Service to return a usable access token, you receive a ```CompactToken parsing failed with error code: 80049217``` error when you call Microsoft Graph APIs in your code.

# [Azure Resource Explorer](#tab/azure-resource-explorer)
Go to [Azure Resource Explorer](https://resources.azure.com/) and using the resource tree, locate your web app. The resource URL should be similar to `https://resources.azure.com/subscriptions/subscriptionId/resourceGroups/SecureWebApp/providers/Microsoft.Web/sites/SecureWebApp20200915115914`.

The Azure Resource Explorer is now opened with your web app selected in the resource tree. 

1. At the top of the page, select **Read/Write** to enable editing of your Azure resources.

1. In the left browser, drill down to **config** > **authsettingsV2**.

1. In the **authsettingsV2** view, select **Edit**. 
1. Find the **login** section of **identityProviders** -> **azureActiveDirectory** and add the following **loginParameters** settings: `"loginParameters":[ "response_type=code id_token","scope=openid offline_access profile https://graph.microsoft.com/User.Read" ]` .

    ```json
    "identityProviders": {
        "azureActiveDirectory": {
          "enabled": true,
          "login": {
            "loginParameters":[
              "response_type=code id_token",
              "scope=openid offline_access profile https://graph.microsoft.com/User.Read"
            ]
          }
        }
      }
    },
    ```

1. Save your settings by selecting **PUT**. This setting can take several minutes to take effect. Your web app is now configured to access Microsoft Graph with a proper access token. If you don't, Microsoft Graph returns an error saying that the format of the compact token is incorrect.

# [Azure CLI](#tab/azure-cli)

Use the Azure CLI to call the App Service Web App REST APIs to [get](/rest/api/appservice/web-apps/get-auth-settings) and [update](/rest/api/appservice/web-apps/update-auth-settings) the auth configuration settings so your web app can call Microsoft Graph. 

1. Open a command window and login to Azure CLI:

    ```azurecli
    az login
    ```

1. Get your existing 'config/authsettingsv2' settings and save to a local *authsettings.json* file.
    
    ```azurecli
    az rest --method GET --url '/subscriptions/{SUBSCRIPTION_ID}/resourceGroups/{RESOURCE_GROUP}/providers/Microsoft.Web/sites/{WEBAPP_NAME}/config/authsettingsv2/list?api-version=2020-06-01' > authsettings.json
    ```

1. Open the *authsettings.json* file using your preferred text editor. 
1. Find the **login** section of **identityProviders** -> **azureActiveDirectory**.
1. Add the following **loginParameters** settings: `"loginParameters":[ "response_type=code id_token","scope=openid offline_access profile https://graph.microsoft.com/User.Read" ]` .

    ```json
    "identityProviders": {
        "azureActiveDirectory": {
          "enabled": true,
          "login": {
            "loginParameters":[
              "response_type=code id_token",
              "scope=openid offline_access profile https://graph.microsoft.com/User.Read"
            ]
          }
        }
      }
    },
    ```

1. Save your changes to the *authsettings.json* file and upload the local settings to your web app:

    ```azurecli
    az rest --method PUT --url '/subscriptions/{SUBSCRIPTION_ID}/resourceGroups/{RESOURCE_GROUP}/providers/Microsoft.Web/sites/{WEBAPP_NAME}/config/authsettingsv2?api-version=2020-06-01' --body @./authsettings.json
    ```
---
