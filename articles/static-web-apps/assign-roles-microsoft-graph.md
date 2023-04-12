---
title: "Tutorial: Assign Azure Static Web Apps roles with Microsoft Graph"
description: Learn to use a serverless function to assign custom user roles based on Active Directory group membership.
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic:  tutorial
ms.date: 10/08/2021
ms.author: cshoe
keywords: "static web apps authorization, assign user roles, custom roles"
---

# Tutorial: Assign custom roles with a function and Microsoft Graph

This article demonstrates how to use a function to query [Microsoft Graph](https://developer.microsoft.com/graph) and assign custom roles to a user based on their Active Directory group membership.

In this tutorial, you learn to:

- Deploy a static web app.
- Create an Azure Active Directory app registration.
- Set up custom authentication with Azure Active Directory.
- Configure a [serverless function](authentication-custom.md#manage-roles) that queries the user's Active Directory group membership and returns a list of custom roles.

> [!NOTE]
> This tutorial requires you to [use a function to assign roles](authentication-custom.md#manage-roles). Function-based role management is currently in preview.

## Prerequisites

- **Active Azure account:** If you don't have one, you can [create an account for free](https://azure.microsoft.com/free/).
- You must have sufficient permissions to create an Azure Active Directory application.

## Create a GitHub repository

1. Go to the following location to create a new repository:
    - [https://github.com/staticwebdev/roles-function/generate](https://github.com/login?return_to=/staticwebdev/roles-function/generate)

1. Name your repository **my-custom-roles-app**.

1. Select **Create repository from template**.

## Deploy the static web app to Azure

1. In a new browser window, go to the [Azure portal](https://portal.azure.com) and sign in with your Azure account.

1. Select **Create a resource** in the top left corner.

1. Type **static web apps** in the search box.

1. Select **Static Web App**.

1. Select **Create**.

1. Configure your Azure Static Web App with the following information:

    | **Input** | **Value** | **Notes** |
    | ---------- | ---------- | ---------- |
    | _Subscription_ | Select your Azure subscription | |
    | _Resource group_ | Create a new one named **my-custom-roles-app-group** | |
    | _Name_ | **my-custom-roles-app**  | |
    | _Hosting plan_ | **Standard** | Customizing authentication and assigning roles using a function require the Standard plan |
    | _Region_ | Select a region closest to you | |
    | _Deployment details_ | Select **GitHub** as the source | |

1. Select **Sign-in with GitHub** and authenticate with GitHub.

1. Select the name of the _Organization_ where you created the repository.

1. Select **my-custom-roles-app** from the _Repository_ drop-down.

1. Select **main** from the _Branch_ drop-down.

1. In the _Build Details_ section, add configuration details for this app.

    | **Input** | **Value** | **Notes** |
    | ---------- | ---------- | ---------- |
    | _Build presets_ | **Custom** | |
    | _App location_ | **frontend** | Folder in the repository containing the app |
    | _API location_ | **api** | Folder in the repository containing the API |
    | _Output location_ | | This app has no build output |

1. Select **Review + create**. Then select **Create** to create the static web app and initiate the first deployment.

1. Select **Go to resource** to open your new static web app.

1. In the overview section, locate your application's **URL**. Copy this value into a text editor as you'll need this URL to set up Active Directory authentication and test the app.

## Create an Azure Active Directory application

1. In the Azure portal, search for and go to *Azure Active Directory*.

1. In the menu bar, select **App registrations**.

1. Select **+ New registration** to open the *Register an application* page

1. Enter a name for the application. For example, **MyStaticWebApp**.

1. For *Supported account types*, select **Accounts in this organizational directory only**.

1. For *Redirect URIs*, select **Web** and enter the Azure Active Directory login [authentication callback](authentication-custom.md#authentication-callbacks) of your static web app. For example, `<YOUR_SITE_URL>/.auth/login/aad/callback`.

    Replace `<YOUR_SITE_URL>` with the URL of your static web app.

    :::image type="content" source="media/assign-roles-microsoft-graph/create-app-registration.png" alt-text="Create an app registration":::

1. Select **Register**.

1. After the app registration is created, copy the **Application (client) ID** and **Directory (tenant) ID** in the *Essentials* section to a text editor. You'll need these values to configure Active Directory authentication in your static web app.

### Enable ID tokens

1. Select *Authentication* in the menu bar.

1. In the *Implicit grant and hybrid flows* section, select **ID tokens (used for implicit and hybrid flows)**.

    :::image type="content" source="media/assign-roles-microsoft-graph/enable-id-tokens.png" alt-text="Enable ID tokens":::
    
    This configuration is required by Static Web Apps to authenticate your users.

1. Select **Save**.

### Create a client secret

1. Select *Certificates & secrets* in the menu bar.

1. In the *Client secrets* section, select **+ New client secret**.

1. Enter a name for the client secret. For example, **MyStaticWebApp**.

1. Leave the default of _6 months_ for the *Expires* field.

    > [!NOTE]
    > You must rotate the secret before the expiration date by generating a new secret and updating your app with its value.

1. Select **Add**.

1. Note the **Value** of the client secret you created. You'll need this value to configure Active Directory authentication in your static web app.

    :::image type="content" source="media/assign-roles-microsoft-graph/create-client-secret.png" alt-text="Create a client secret":::

## Configure Active Directory authentication

1. In a browser, open the GitHub repository containing the static web app you deployed. Go to the app's configuration file at *frontend/staticwebapp.config.json*. It contains the following section:

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

    > [!NOTE]
    > To obtain an access token for Microsoft Graph, the `loginParameters` field must be configured with `resource=https://graph.microsoft.com`.

2. Select **Edit** to update the file.

3. Update the *openIdIssuer* value of `https://login.microsoftonline.com/<YOUR_AAD_TENANT_ID>` by replacing `<YOUR_AAD_TENANT_ID>` with the directory (tenant) ID of your Azure Active Directory.

4. Select **Commit directly to the main branch** and select **Commit changes**.

5. A GitHub Actions run triggers to update the static web app.

6. Go to your static web app resource in the Azure portal.

7. Select **Configuration** in the menu bar.

8. In the *Application settings* section, add the following settings:

    | Name | Value |
    |------|-------|
    | `AAD_CLIENT_ID` | *Your Active Directory application (client) ID* |
    | `AAD_CLIENT_SECRET` | *Your Active Directory application client secret value* |

9. Select **Save**.

## Verify custom roles

The sample application contains a serverless function (*api/GetRoles/index.js*) that queries Microsoft Graph to determine if a user is in a pre-defined group. Based on the user's group memberships, the function assigns custom roles to the user. The application is configured to restrict certain routes based on these custom roles.

1. In your GitHub repository, go to the *GetRoles* function located at *api/GetRoles/index.js*. Near the top, there is a `roleGroupMappings` object that maps custom user roles to Azure Active Directory groups.

2. Select **Edit**.

3. Update the object with group IDs from your Azure Active Directory tenant.

    For instance, if you have groups with IDs `6b0b2fff-53e9-4cff-914f-dd97a13bfbd6` and `b6059db5-9cef-4b27-9434-bb793aa31805`, you would update the object to:

    ```js
    const roleGroupMappings = {
      'admin': '6b0b2fff-53e9-4cff-914f-dd97a13bfbd6',
      'reader': 'b6059db5-9cef-4b27-9434-bb793aa31805'
    };
    ```

    The *GetRoles* function is called whenever a user is successfully authenticated with Azure Active Directory. The function uses the user's access token to query their Active Directory group membership from Microsoft Graph. If the user is a member of any groups defined in the `roleGroupMappings` object , the corresponding custom roles are returned by the function.
    
    In the above example, if a user is a member of the Active Directory group with ID `b6059db5-9cef-4b27-9434-bb793aa31805`, they are granted the `reader` role.

4. Select **Commit directly to the main branch** and select **Commit changes**.

5. A GitHub Actions run triggers to update the static web app.

6. When the deployment is complete, you can verify your changes by navigating to the app's URL.

7. Log in to your static web app using Azure Active Directory.

8. When you are logged in, the sample app displays the list of roles that you are assigned based on your identity's Active Directory group membership. Depending on these roles, you are permitted or prohibited to access some of the routes in the app.

> [!NOTE]
> Some queries against Microsoft Graph return multiple pages of data. When more than one query request is required, Microsoft Graph returns an `@odata.nextLink` property in the response which contains a URL to the next page of results. For more details please refer to [Paging Microsoft Graph data in your app](/graph/paging)

## Clean up resources

Clean up the resources you deployed by deleting the resource group.

1. From the Azure portal, select **Resource group** from the left menu.

1. Enter the resource group name in the **Filter by name** field.

1. Select the resource group name you used in this tutorial.

1. Select **Delete resource group** from the top menu.

## Next steps

> [!div class="nextstepaction"]
> [Authentication and authorization](./authentication-authorization.md)
