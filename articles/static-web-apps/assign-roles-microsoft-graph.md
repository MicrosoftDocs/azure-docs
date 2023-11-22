---
title: "Tutorial: Assign Azure Static Web Apps roles with Microsoft Graph"
description: Learn to use a serverless function to assign custom user roles based on Active Directory group membership.
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic:  tutorial
ms.date: 07/11/2023
ms.author: cshoe
keywords: "static web apps authorization, assign user roles, custom roles"
---

# Tutorial: Assign custom roles with a function and Microsoft Graph

This article demonstrates how to use a function to query [Microsoft Graph](https://developer.microsoft.com/graph) and assign custom roles to a user based on their Active Directory group membership.

In this tutorial, you learn to:

- Deploy a static web app.
- Create a Microsoft Entra app registration.
- Set up custom authentication with Microsoft Entra ID.
- Configure a [serverless function](authentication-custom.md#manage-roles) that queries the user's Active Directory group membership and returns a list of custom roles.

> [!NOTE]
> This tutorial requires you to [use a function to assign roles](authentication-custom.md#manage-roles). Function-based role management is currently in preview. The permission level required to complete this tutorial is "User.Read.All".

There's a function named *GetRoles* in the app's API. This function uses the user's access token to query Active Directory from Microsoft Graph. If the user is a member of any groups defined in the app, then the corresponding custom roles are mapped to the user.

## Prerequisites

| Requirement | Comments |
|---|---|
| Active Azure account | If you don't have one, you can [create an account for free](https://azure.microsoft.com/free/). |
| Microsoft Entra permissions | You must have sufficient permissions to create a Microsoft Entra application. |

## Create a GitHub repository

1. Generate a repository based on the roles function template. Go to the following location to create a new repository.

    [https://github.com/staticwebdev/roles-function/generate](https://github.com/login?return_to=/staticwebdev/roles-function/generate)

1. Name your repository **my-custom-roles-app**.

1. Select **Create repository from template**.

## Deploy the static web app to Azure

1. In a new browser window, open the [Azure portal](https://portal.azure.com).

1. From the top left corner, select **Create a resource**.

1. In the search box, type **static web apps**.

1. Select **Static Web Apps**.

1. Select **Create**.

1. Configure your static web app with the following information:

    | Setting | Value | Notes |
    |---|---|---|
    | Subscription | Select your Azure subscription. | |
    | Resource group | Create a new group named **my-custom-roles-app-group**. | |
    | Name | **my-custom-roles-app**  | |
    | Plan type | **Standard** | Customizing authentication and assigning roles using a function require the *Standard* plan. |
    | Region for API | Select the region closest to you. |

1. In the *Deployment details* section:

    | Setting | Value |
    |---|---|
    | Source | Select **GitHub**. |
    | Organization | Select the organization where you generated the repository. |
    | Repository | Select **my-custom-roles-app**. |
    | Branch | Select **main**. |

1. In the _Build Details_ section, add the configuration details for this app.

    | Setting | Value | Notes |
    |---|---|---|
    | Build presets | Select **Custom**. | |
    | App location | Enter **/frontend**. | This folder contains the front end application. |
    | API location | **/api** | Folder in the repository containing the API functions. |
    | Output location | Leave blank. | This app has no build output. |

1. Select **Review + create**.

1. Select **Create** initiate the first deployment.

1. Once the process is complete, select **Go to resource** to open your new static web app.

1. In the overview section, locate your application's **URL**. Copy this value into a text editor to use in upcoming steps to set up Active Directory authentication.

<a name='create-an-azure-active-directory-application'></a>

## Create a Microsoft Entra application

1. In the Azure portal, search for and go to *Microsoft Entra ID*.

1. From the *Manage* menu, select **App registrations**.

1. Select **New registration** to open the *Register an application* window. Enter the following values:

    | Setting | Value | Notes |
    |---|---|---|
    | Name | Enter **MyStaticWebApp**. | |
    | Supported account types | Select **Accounts in this organizational directory only**. ||
    | Redirect URI | Select **Web** and enter the Microsoft Entra [authentication callback](authentication-custom.md#authentication-callbacks) URL of your static web app. Replace `<YOUR_SITE_URL>` in `<YOUR_SITE_URL>/.auth/login/aad/callback` with the URL of your static web app. | This URL is what you  copied to a text editor in an earlier step. |

    :::image type="content" source="media/assign-roles-microsoft-graph/create-app-registration.png" alt-text="Create an app registration":::

1. Select **Register**.

1. After the app registration is created, copy the **Application (client) ID** and **Directory (tenant) ID** in the *Essentials* section to a text editor.

    You need these values to configure Active Directory authentication in your static web app.

### Enable ID tokens

1. From the app registration settings, select **Authentication** under *Manage*.

1. In the *Implicit grant and hybrid flows* section, select **ID tokens (used for implicit and hybrid flows)**.

    The Static Web Apps runtime requires this configuration to authenticate your users.

1. Select **Save**.

### Create a client secret

1. In the app registration settings, select **Certificates & secrets** under *Manage*.

1. In the *Client secrets* section, select **New client secret**.

1. For the *Description* field, enter **MyStaticWebApp**.

1. For the *Expires* field, leave the default value of _6 months_.

    > [!NOTE]
    > You must rotate the secret before the expiration date by generating a new secret and updating your app with its value.

1. Select **Add**.

1. Copy the **Value** of the client secret you created to a text editor.

    You need this value to configure Active Directory authentication in your static web app.

    :::image type="content" source="media/assign-roles-microsoft-graph/create-client-secret.png" alt-text="Create a client secret":::

## Configure Active Directory authentication

1. In a browser, open the GitHub repository containing the static web app you deployed.

    Go to the app's configuration file at *frontend/staticwebapp.config.json*. This file contains the following section:

    ```json
    "auth": {
      "rolesSource": "/api/GetRoles",
      "identityProviders": {
        "azureActiveDirectory": {
          "userDetailsClaim": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
          "registration": {
            "openIdIssuer": "https://login.microsoftonline.com/<YOUR_AAD_TENANT_ID>",
            "clientIdSettingName": "AAD_CLIENT_ID",
            "clientSecretSettingName": "AAD_CLIENT_SECRET"
          },
          "login": {
            "loginParameters": [
              "resource=https://graph.microsoft.com"
            ]
          }
        }
      }
    },
    ```

    This configuration is made up of the following settings:

    | Properties | Description |
    |---|---|
    | `rolesSource` | The URL where the login process gets a list of available roles. For the sample application the URL is `/api/GetRoles`. |
    | `userDetailsClaim` | The URL of the schema used to validate the login request. |
    | `openIdIssuer` | The Microsoft Entra login route, appended with your tenant ID. |
    | `clientIdSettingName` | Your Microsoft Entra tenant ID. |
    | `clientSecretSettingName` | Your Microsoft Entra client secret value. |
    | `loginParameters` | To obtain an access token for Microsoft Graph, the `loginParameters` field must be configured with `resource=https://graph.microsoft.com`. |

1. Select **Edit** to update the file.

1. Update the *openIdIssuer* value of `https://login.microsoftonline.com/<YOUR_AAD_TENANT_ID>` by replacing `<YOUR_AAD_TENANT_ID>` with the directory (tenant) ID of your Microsoft Entra ID.

1. Select **Commit changes...**.

1. Enter a commit message, and select **Commit changes**.

    Committing these changes initiates a GitHub Actions run to update the static web app.

1. Go to your static web app resource in the Azure portal.

1. Select **Configuration** in the menu bar.

1. In the *Application settings* section, add the following settings:

    | Name | Value |
    |---|---|
    | `AAD_CLIENT_ID` | Your Active Directory application (client) ID. |
    | `AAD_CLIENT_SECRET` | Your Active Directory application client secret value. |

1. Select **Save**.

## Create roles

1. Open you Active Directory app registration in the Azure portal.

1. Under *Manage*, select **App roles**.

1. Select **Create app role** and enter the following values:

    | Setting | Value |
    |---|---|
    | Display name | Enter **admin**. |
    | Allowed member types | Select **Users/Groups**. |
    | Value | Enter **admin**. |
    | Description | Enter **Administrator**. |

1. Check the box for **Do you want to enable this app role?**

1. Select **Apply**.

1. Now repeat the same process for a role named **reader**.

1. Copy the *ID* values for each role and set them aside in a text editor.

## Verify custom roles

The sample application contains an API function (*api/GetRoles/index.js*) that queries Microsoft Graph to determine if a user is in a predefined group.

Based on the user's group memberships, the function assigns custom roles to the user. The application is configured to restrict certain routes based on these custom roles.

1. In your GitHub repository, go to the *GetRoles* function located at *api/GetRoles/index.js*.

    Near the top, there's a `roleGroupMappings` object that maps custom user roles to Microsoft Entra groups.

1. Select **Edit**.

1. Update the object with group IDs from your Microsoft Entra tenant.

    For instance, if you have groups with IDs `6b0b2fff-53e9-4cff-914f-dd97a13bfbd6` and `b6059db5-9cef-4b27-9434-bb793aa31805`, you would update the object to:

    ```js
    const roleGroupMappings = {
      'admin': '6b0b2fff-53e9-4cff-914f-dd97a13bfbd6',
      'reader': 'b6059db5-9cef-4b27-9434-bb793aa31805'
    };
    ```

    The *GetRoles* function is called whenever a user is successfully authenticated with Microsoft Entra ID. The function uses the user's access token to query their Active Directory group membership from Microsoft Graph. If the user is a member of any groups defined in the `roleGroupMappings` object, then the corresponding custom roles are returned.

    In the above example, if a user is a member of the Active Directory group with ID `b6059db5-9cef-4b27-9434-bb793aa31805`, they're granted the `reader` role.

1. Select **Commit changes...**.

1. Add a commit message and select **Commit changes**.

    Making these changes initiates a build in to update the static web app.

1. When the deployment is complete, you can verify your changes by navigating to the app's URL.

1. Sign in to your static web app using Microsoft Entra ID.

1. When you're logged in, the sample app displays the list of roles that you're assigned based on your identity's Active Directory group membership. 

    Depending on these roles, you're permitted or prohibited to access some of the routes in the app.

> [!NOTE]
> Some queries against Microsoft Graph return multiple pages of data. When more than one query request is required, Microsoft Graph returns an `@odata.nextLink` property in the response which contains a URL to the next page of results. For more information, see [Paging Microsoft Graph data in your app](/graph/paging)

## Clean up resources

Clean up the resources you deployed by deleting the resource group.

1. From the Azure portal, select **Resource group** from the left menu.

1. Enter the resource group name in the **Filter by name** field.

1. Select the resource group name you used in this tutorial.

1. Select **Delete resource group** from the top menu.

## Next steps

> [!div class="nextstepaction"]
> [Authentication and authorization](./authentication-authorization.md)
