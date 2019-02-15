---
title: Manage authentication in Azure Maps | Microsoft Docs 
description: You can use the Azure portal to manage authentication in Azure Maps.
author: walsehgal
ms.author: v-musehg
ms.date: 02/14/2018
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
manager: timlt
---

# Manage authentication in Azure Maps

After you create an Azure Maps account, the client ID and keys are created to support either Azure Active Directory (Azure AD) or Shared Key authentication.

You can find your authentication details by navigating to the **Authentication** page under **Settings** in the Azure portal. Navigate to your account. Then select **Authentication** from the menu.


## View authentication details

To view your authentication details, navigate to the **Authentication** option in the settings menu.

![View authentication](./media/how-to-manage-authentication/how-to-view-auth.png)

 To learn about authentication and Azure Maps, see [Authentication with Azure Maps](https://aka.ms/amauth).


## Configure Azure AD App Registration

Once an Azure Map account is created, a link between your Azure AD tenant and the Azure Maps Azure resource is required. 

1. Go to the Azure AD blade and create an App Registration with a name and the sign in URL as the home page of the web app / API such as "https://localhost/" . If you already have a registered app, proceed to step 2.

    ![App registration](./media/how-to-manage-authentication/app-registration.png)

    ![App registration](./media/how-to-manage-authentication/app-create.png)

2. Assign delegated API permissions to Azure Maps by navigating to application under App registrations and click on **Settings**.  Select **Required permissions** and select **Add**. Search then select Azure Maps under **Select an API** and click **Select**.

    ![App api permissions](./media/how-to-manage-authentication/app-permissions.png)

3. Finally, under Select Permissions choose Access Azure Maps and click Select.

    ![Select app api permissions](./media/how-to-manage-authentication/select-app-permissions.png)

4. Follow step a or b, depending on authentication implementation.

    1. If the application is intending to use user token authentication with our Azure Maps Web SDK, you must enable the `oauthEnableImplicitFlow` by setting it to true in the Manifest section of your app registration detail page.
    
       ![App manifest](./media/how-to-manage-authentication/app-manifest.png)

    2. If your application uses server/application authentication go to the **Keys** blade within the app registration and either create a password or upload a public key certificate to the app registration. If you create a password, once you **Save**, copy the password for later, and store it securely, you will use this to acquire tokens from Azure AD.

       ![App keys](./media/how-to-manage-authentication/app-keys.png)


## Grant RBAC to Azure Maps

Once an Azure Maps account has been associated with your Azure AD tenant, access control can be granted by assigning the user or application to available Azure Maps access control role(s).

1. Navigate to **Access Control** option, click **Role Assignments**, and **Add role assignment**.

    ![Grant RBAC](./media/how-to-manage-authentication/how-to-grant-rbac.png)

2. On the Role Assignment pop out window, select Azure Maps Date Reader (Preview) **Role**, **Assign access to**: Azure AD user, group, or service principal, **Select** User or Application from dropdown, and **Save**.

    ![Add role assignment](./media/how-to-manage-authentication/add-role-assignment.png)

## View available Azure Maps RBAC roles

To view available role-based access control roles for Azure Maps that access can be granted to, navigate to **Access Control (IAM)** option, click on **Roles**, and search for roles beginning with **Azure Maps**.

![View available roles](./media/how-to-manage-authentication/how-to-view-avail-roles.png)


## View Azure Maps role-based access control (RBAC)

Azure AD allows for granular access control via role-based access control (RBAC). 

To view users or apps that have been granted RBAC for Azure Maps, navigate to **Access Control (IAM)** option, select **Role assignments**, and filter by **Azure Maps**. All available roles will appear below.

![View RBAC](./media/how-to-manage-authentication/how-to-view-amrbac.png)


## Request tokens for Azure Maps

Once your app is registered and associated with Azure Maps, you can now request access tokens.

* If the application is intending to use user token authentication with our Azure Maps Web SDK (Web), you need to configure your html page with Azure Maps Client ID and Azure AD App ID.

* For applications using server/application authentication, request a token from Azure AD login endpoint `https://login.microsoftonline.com` with Azure AD resource ID `https://atlas.microsoft.com/`, Azure Maps Client ID, Azure AD App ID, and Azure AD App registration password or certificate.

For more information on requesting access tokens from Azure AD for users and service principals, see [Authentication scenarios for Azure AD](https://docs.microsoft.com/azure/active-directory/develop/authentication-scenarios).


## Next steps

* To learn more about Azure AD authentication and the Azure Maps Web SDK, see [Azure AD and Azure Maps Web SDK](https://docs.microsoft.com/azure/azure-maps/how-to-use-map-control).