---
title: Restrict Azure AD app to a set of users | Azure
titleSuffix: Microsoft identity platform
description: Learn how to restrict access to your apps registered in Azure AD to a selected set of users.
services: active-directory
author: kalyankrishna1
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: how-to
ms.date: 09/24/2018
ms.author: kkrishna
ms.reviewer: jmprieur
ms.custom: aaddev
#Customer intent: As a tenant administrator, I want to restrict an application that I have registered in Azure AD to a select set of users available in my Azure AD tenant
---
# How to: Restrict your Azure AD app to a set of users in an Azure AD tenant

Applications registered in an Azure Active Directory (Azure AD) tenant are, by default, available to all users of the tenant who authenticate successfully.

Similarly, in case of a [multi-tenant](howto-convert-app-to-be-multi-tenant.md) app, all users in the Azure AD tenant where this app is provisioned will be able to access this application once they successfully authenticate in their respective tenant.

Tenant administrators and developers often have requirements where an app must be restricted to a certain set of users. Developers can accomplish the same by using popular authorization patterns like Role Based Access Control (RBAC), but this approach requires a significant amount of work on part of the developer.

Tenant administrators and developers can restrict an app to a specific set of users or security groups in the tenant by using this built-in feature of Azure AD as well.

## Supported app configurations

The option to restrict an app to a specific set of users or security groups in a tenant works with the following types of applications:

- Applications configured for federated single sign-on with SAML-based authentication
- Application proxy applications that use Azure AD pre-authentication
- Applications built directly on the Azure AD application platform that use OAuth 2.0/OpenID Connect authentication after a user or admin has consented to that application.

     > [!NOTE]
     > This feature is available for web app/web API and enterprise applications only. Apps that are registered as [native](quickstart-v1-integrate-apps-with-azure-ad.md) cannot be restricted to a set of users or security groups in the tenant.

## Update the app to enable user assignment

There are two ways to create an application with enabled user assignment. One requires the **Global Administrator** role, the second does not.

### Enterprise applications (requires the Global Administrator role)

1. Go to the [**Azure portal**](https://portal.azure.com/) and sign in as a **Global Administrator**.
1. On the top bar, select the signed-in account. 
1. Under **Directory**, select the Azure AD tenant where the app will be registered.
1. In the navigation on the left, select **Azure Active Directory**. If Azure Active Directory is not available in the navigation pane, follow these steps:

    1. Select **All services** at the top of the main left-hand navigation menu.
    1. Type in **Azure Active Directory** in the filter search box, and then select the **Azure Active Directory** item from the result.

1. In the **Azure Active Directory** pane, select **Enterprise Applications** from the **Azure Active Directory** left-hand navigation menu.
1. Select **All Applications** to view a list of all your applications.

     If you do not see the application you want show up here, use the various filters at the top of the **All applications** list to restrict the list or scroll down the list to locate your application.

1. Select the application you want to assign a user or security group to from the list.
1. On the application's **Overview** page, select **Properties** from the application’s left-hand navigation menu.
1. Locate the setting **User assignment required?** and set it to **Yes**. When this option is set to **Yes**, users in the tenant must first be assigned to this application or they won't be able to sign-in to this application.
1. Select **Save** to save this configuration change.

### App registration

1. Go to the [**Azure portal**](https://portal.azure.com/).
1. On the top bar, select the signed-in account. 
1. Under **Directory**, select the Azure AD tenant where the app will be registered.
1. In the navigation on the left, select **Azure Active Directory**.
1. In the **Azure Active Directory** pane, select **App Registrations** from the **Azure Active Directory** left-hand navigation menu.
1. Create or select the app you want to manage. You need to be **Owner** of this app registration.
1. On the application's **Overview** page, follow the **Managed application in local directory** link under the essentials in the top of the page. This will take you to the _managed Enterprise Application_ of your app registration.
1. From the navigation blade on the left, select **Properties**.
1. Locate the setting **User assignment required?** and set it to **Yes**. When this option is set to **Yes**, users in the tenant must first be assigned to this application or they won't be able to sign-in to this application.
1. Select **Save** to save this configuration change.

## Assign users and groups to the app

Once you've configured your app to enable user assignment, you can go ahead and assign users and groups to the app.

1. Select the **Users and groups** pane in the application’s left-hand navigation menu.
1. At the top of the **Users and groups** list, select the **Add user** button to open the **Add Assignment** pane.
1. Select the **Users** selector from the **Add Assignment** pane. 

     A list of users and security groups will be shown along with a textbox to search and locate a certain user or group. This screen allows you to select multiple users and groups in one go.

1. Once you are done selecting the users and groups, press the **Select** button on bottom to move to the next part.
1. (Optional) If you have defined App roles in your application, you can use the **Select role** option to assign the selected users and groups to one of the application's roles. 
1. Press the **Assign** button on the bottom to finish the assignments of users and groups to the app. 
1. Confirm that the users and groups you added are showing up in the updated **Users and groups** list.

## More information

- [How to: Add app roles in your application](https://docs.microsoft.com/azure/active-directory/develop/howto-add-app-roles-in-azure-ad-apps)
- [Add authorization using app roles & roles claims to an ASP.NET Core web app](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/tree/master/5-WebApp-AuthZ/5-1-Roles)
- [Using Security Groups and Application Roles in your apps (Video)](https://www.youtube.com/watch?v=V8VUPixLSiM)
- [Azure Active Directory, now with Group Claims and Application Roles](https://techcommunity.microsoft.com/t5/Azure-Active-Directory-Identity/Azure-Active-Directory-now-with-Group-Claims-and-Application/ba-p/243862)
- [Azure Active Directory app manifest](https://docs.microsoft.com/azure/active-directory/develop/reference-app-manifest)