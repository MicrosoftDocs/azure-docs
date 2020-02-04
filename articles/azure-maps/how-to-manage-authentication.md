---
title: Manage authentication | Microsoft Azure Maps 
description: You can use the Azure portal to manage authentication in Microsoft Azure Maps.
author: walsehgal
ms.author: v-musehg
ms.date: 01/29/2020
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: timlt
---

# Manage authentication in Azure Maps

After you create an Azure Maps account, a client ID and keys are created to support Azure Active Directory (Azure AD) and Shared Key authentication.

## View authentication details

After creation of the Azure Maps account, the primary and secondary keys are generated. It's recommended to use primary key as subscription key, when calling Azure Maps using [shared key authentication](https://docs.microsoft.com/azure/azure-maps/azure-maps-authentication#shared-key-authentication). Secondary key can be used in scenarios such as rolling key changes. To learn more, see [Authentication with Azure Maps](https://aka.ms/amauth).

You can view your authentication details on the Azure portal. Go to your account and select **Authentication** on the **Settings** menu.

![Authentication details](./media/how-to-manage-authentication/how-to-view-auth.png)


## Configure Azure AD App Registration

1. Select **Azure Active Directory** from list of Azure services in Azure portal.  Select **App registrations** and click **New Registration**.  Next. Enter **Name**, choose **Support account type**, and click **Register**.  If you already have a registered app, continue to step 2. 

    ![App registration](./media/how-to-manage-authentication/app-registration.png)

    ![App registration details](./media/how-to-manage-authentication/app-create.png)

2. To assign delegated API permissions to Azure Maps, go to the application under **App registrations**. Then, select **API permissions**, and then select **Add a permission**. Search for and select **Azure Maps** under **APIs my organization uses**.

    ![App API permissions](./media/how-to-manage-authentication/app-permissions.png)

3. Check **Access Azure Maps** and then click **Add permissions**.

    ![Select app API permissions](./media/how-to-manage-authentication/select-app-permissions.png)

4. Complete step a or b, depending on your authentication method. 

    1. If your application uses user-token authentication with the Azure Maps Web SDK, enable `oauth2AllowImplicitFlow`. To enable `oauth2AllowImplicitFlow`, set it to true in the Manifest section of your app registration. 
    
       ![App manifest](./media/how-to-manage-authentication/app-manifest.png)

    2. If your application uses server/application authentication, go to the **Certificates & secrets** blade in your app registration page and either create a password by clicking on **New client secret** or upload a public key certificate to the app registration. If you create a password, after you click **Add**, copy the password for later and store it securely. You'll use this password to acquire tokens from Azure AD.

       ![App keys](./media/how-to-manage-authentication/app-keys.png)

       ![Add key](./media/how-to-manage-authentication/add-key.png)


## Grant role-based access control (RBAC) to Azure Maps

After you associate an Azure Maps account with your Azure AD tenant, you can grant access control. You grant access control by assigning a user, group, or application to one or more Azure Maps access control roles.

1. Go to your **Azure Maps Account**. Select **Access control (IAM)**, then select **Role assignment**.

    ![Grant RBAC](./media/how-to-manage-authentication/how-to-grant-rbac.png)

2. In the **Role assignment** window, under **Role**, select **Azure Maps Date Reader (Preview)**. Under **Assign access to** select **Azure AD user, group, or service principle**. Select the user or application. Select **Save**.

    ![Add role assignment](./media/how-to-manage-authentication/add-role-assignment.png)

## View available Azure Maps RBAC roles

To view role-based access control (RBAC) roles that are available for Azure Maps, go to **Access control (IAM)**, select **Roles**, and then search for roles beginning with **Azure Maps**. These roles are the roles, which you can grant access to.

![View available roles](./media/how-to-manage-authentication/how-to-view-avail-roles.png)


## View Azure Maps RBAC

RBAC provides granular access control.

To view users and apps that have been granted RBAC for Azure Maps, go to **Access Control (IAM)**, select **Role assignments**, and then filter by **Azure Maps**.

![View users and apps granted RBAC](./media/how-to-manage-authentication/how-to-view-amrbac.png)


## Request tokens for Azure Maps

After you register your app and associated it with Azure Maps, you can request access tokens.

* If your application uses user-token authentication with the Azure Maps Web SDK, you need to configure your HTML page with the Azure Maps client ID and the Azure AD app ID.

* If your application uses server/application authentication, you need to request a token from Azure AD token endpoint `https://login.microsoftonline.com` with the Azure AD resource ID `https://atlas.microsoft.com/`, the Azure Maps client ID, the Azure AD app ID, and the Azure AD app registration password or certificate.

| Azure Environment   | Azure AD token endpoint | Azure Resource ID |
| --------------------|-------------------------|-------------------|
| Azure Public        | https://login.microsoftonline.com | https://atlas.microsoft.com/ |
| Azure Government    | https://login.microsoftonline.us  | https://atlas.microsoft.com/ | 

For more information about requesting access tokens from Azure AD, for users and service principals, see [Authentication scenarios for Azure AD](https://docs.microsoft.com/azure/active-directory/develop/authentication-scenarios).


## Next steps

To learn more about Azure AD authentication and the Azure Maps Web SDK, see [Azure AD and Azure Maps Web SDK](https://docs.microsoft.com/azure/azure-maps/how-to-use-map-control).

Learn how to see the API usage metrics for your Azure Maps account:
> [!div class="nextstepaction"]	
> [View usage metrics](how-to-view-api-usage.md)

For a list of samples showing how to integrate Azure Active Directory (AAD) with Azure Maps, see:

> [!div class="nextstepaction"]
> [Azure AD authentication samples](https://github.com/Azure-Samples/Azure-Maps-AzureAD-Samples)
