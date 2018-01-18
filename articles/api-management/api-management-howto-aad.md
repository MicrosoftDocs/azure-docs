---
title: Authorize developer accounts using Azure Active Directory - Azure API Management | Microsoft Docs
description: Learn how to authorize users using Azure Active Directory in API Management.
services: api-management
documentationcenter: API Management
author: juliako
manager: cfowler
editor: ''

ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/16/2018
ms.author: apimpm
---

# How to authorize developer accounts using Azure Active Directory in Azure API Management

This guide shows you how to enable access to the developer portal for users from Azure Active Directory. This guide also shows you how to manage groups of Azure Active Directory users by adding external groups that contain the users of an Azure Active Directory.

> [!WARNING]
> Azure Active Directory integration is available in the [Developer, Standard and Premium](https://azure.microsoft.com/en-us/pricing/details/api-management/) tiers only.

## Prerequisites

- Complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md).
- Import and publish an API Management instance. For more information, see [Import and publish](import-and-publish.md).

## How to authorize developer accounts using Azure Active Directory

1. Sign in to the [Azure portal](https://portal.azure.com). 
2. Select ![arrow](./media/api-management-howto-aad/arrow.png).
3. Type "api" in the search box.
4. Click **API Management services**.
5. Select your APIM service instance.
6. Under **SECURITY**, select **Identities**.

    ![External Identities](./media/api-management-howto-aad/api-management-with-aad001.png)
7. Click **+Add** from the top.

    The **Add identity provider** window appears on the right.
8. Under **Provider type**, select **Azure Active Directory**.

    Controls that enable you to enter other necessary information appear in the window. The controls include: **Client ID**, **Client secret** (you get information later in the tutorial).
9. Make a note of the **Redirect URL**.  
10. In your browser, open a different tab. 
11. Open [Azure portal](https://portal.azure.com).
12. Select ![arrow](./media/api-management-howto-aad/arrow.png).
13. Type "active", the **Azure Active Directory** appears.
14. Select **Azure Active Directory**.
15. Under **MANAGE**, select **App registration**.

    ![App registration](./media/api-management-howto-aad/api-management-with-aad002.png)
16. Click **New application registration**.

    The **Create** window appears on the right. That is where you enter the AAD app relavent information.
17. Eneter a name for the application.
18. For the application type, select **Web app/API**.
19. For Sign-on URL, enter the sign-on URL of your developer portal. In this example, the Sign-on URL is: https://apimwithaad.portal.azure-api.net/signin.
20. Click **Create** to create the application.
21. To find your app, select **App registrations** and search by name.

    ![App registration](./media/api-management-howto-aad/find-your-app.png)
22. After the application is registered, go to **Reply URL** and make sure the "Redirect URL" is set to the value you got from step 9. 
23. If you want to configure your application (for example, change **App ID URL**) select **Properties**.

    ![App registration](./media/api-management-howto-aad/api-management-with-aad004.png)

    If multiple Azure Active Directories are going to be used for this application, click **Yes** for **Application is multi-tenant**. The default is **No**.
24. Set application permissions by selecting **Required permissions**.
25. Select the your application and check **Read directory data** and **Sign in and read user profile**.

    ![App registration](./media/api-management-howto-aad/api-management-with-aad005.png)

    For more information about application and delegated permissions, see [Accessing the Graph API][Accessing the Graph API].
26. In the left window, copy the **Application ID** value.

    ![App registration](./media/api-management-howto-aad/application-id.png)
27. Switch back to your API Management application. The **Add identity provider** window should be displayed. <br/>Paste the **Application ID** value in the **Client Id** box.
28. Switch back to the Azure Active Directory configuration, and click on **Keys**.
29. Create a new key by speicifying a name and duration. 
30. Click **Save**. The key gets generated.

    Copy the key to the clipboard.

    ![App registration](./media/api-management-howto-aad/api-management-with-aad006.png)

    > [!NOTE]
    > Make a note of this key. Once you close the Azure Active Directory configuration window, the key cannot be displayed again.
    > 
    > 
31. Switch back to your API Management application. <br/>In the **Add identity provider** window, paste the key into the **Client secret** text box.
32. The **Add identity provider** window, contains the **Allowed Tenants** text box, in you specify which directories have access to the APIs of the API Management service instance. <br/>Specify the domains of the Azure Active Directory instances to which you want to grant access. You can separate multiple domains with newlines, spaces, or commas.

    Multiple domains can be specified in the **Allowed Tenants** section. Before any user can log in from a different domain than the original domain where the application was registered, a global administrator of the different domain must grant permission for the application to access directory data. To grant permission, the global administrator should go to `https://<URL of your developer portal>/aadadminconsent` (for example, https://contoso.portal.azure-api.net/aadadminconsent), type in the domain name of the Active Directory tenant they want to give access to and click Submit. In the following example, a global administrator from `miaoaad.onmicrosoft.com` is trying to give permission to this particular developer portal. 

33. Once the desired configuration is specified, click **Add**.

    ![App registration](./media/api-management-howto-aad/api-management-with-aad007.png)

Once the changes are saved, the users in the specified Azure Active Directory can sign in to the Developer portal by following the steps in [Log in to the Developer portal using an Azure Active Directory account](#log_in_to_dev_portal).

![Permissions](./media/api-management-howto-aad/api-management-aad-consent.png)

In the next screen, the global administrator will be prompted to confirm giving the permission. 

![Permissions](./media/api-management-howto-aad/api-management-permissions-form.png)

If a non-global administrator tries to log in before permissions are granted by a global administrator, the login attempt fails and an error screen is displayed.

## How to add an external Azure Active Directory Group

After enabling access for users in an Azure Active Directory, you can add Azure Active Directory groups into API Management to more easily manage the association of the developers in the group with the desired products.

To configure an external Azure Active Directory group, the Azure Active Directory must first be configured in the Identities tab by following the procedure in the previous section. 

External Azure Active Directory groups are added from the **Groups** tab of your API Management instance.

![Groups](./media/api-management-howto-aad/api-management-with-aad008.png)

1. Select the **Groups** tab.
2. Click the **Add AAD group** button.
3. Select the group you want to add.
4. Press **Select** button.

Once an Azure Active Directory group has been created, you can review and configure the properties for external groups once they have been added, click the name of the group from the **Groups** tab.

From here you can edit the **Name** and the **Description** of the group.
 
Users from the configured Azure Active Directory can sign in to the Developer portal and view and subscribe to any groups for which they have visibility by following the instructions in the following section.

## <a id="log_in_to_dev_portal"/>How to log in to the Developer portal using an Azure Active Directory account

To log into the Developer portal using an Azure Active Directory account configured in the previous sections, open a new browser window using the **Sign-on URL** from the Active Directory application configuration, and click **Azure Active Directory**.

![Developer Portal][api-management-dev-portal-signin]

Enter the credentials of one of the users in your Azure Active Directory, and click **Sign in**.

![Sign in][api-management-aad-signin]

You may be prompted with a registration form if any additional information is required. Complete the registration form and click **Sign up**.

![Registration][api-management-complete-registration]

Your user is now logged into the developer portal for your API Management service instance.

![Registration Complete][api-management-registration-complete]

[api-management-dev-portal-signin]: ./media/api-management-howto-aad/api-management-dev-portal-signin.png
[api-management-aad-signin]: ./media/api-management-howto-aad/api-management-aad-signin.png
[api-management-complete-registration]: ./media/api-management-howto-aad/api-management-complete-registration.png
[api-management-registration-complete]: ./media/api-management-howto-aad/api-management-registration-complete.png

[How to add operations to an API]: api-management-howto-add-operations.md
[How to add and publish a product]: api-management-howto-add-products.md
[Monitoring and analytics]: api-management-monitoring.md
[Add APIs to a product]: api-management-howto-add-products.md#add-apis
[Publish a product]: api-management-howto-add-products.md#publish-product
[Get started with Azure API Management]: get-started-create-service-instance.md
[API Management policy reference]: api-management-policy-reference.md
[Caching policies]: api-management-policy-reference.md#caching-policies
[Create an API Management service instance]: get-started-create-service-instance.md

[http://oauth.net/2/]: http://oauth.net/2/
[WebApp-GraphAPI-DotNet]: https://github.com/AzureADSamples/WebApp-GraphAPI-DotNet
[Accessing the Graph API]: http://msdn.microsoft.com/library/azure/dn132599.aspx#BKMK_Graph

[Prerequisites]: #prerequisites
[Configure an OAuth 2.0 authorization server in API Management]: #step1
[Configure an API to use OAuth 2.0 user authorization]: #step2
[Test the OAuth 2.0 user authorization in the Developer Portal]: #step3
[Next steps]: #next-steps

[Log in to the Developer portal using an Azure Active Directory account]: #Log-in-to-the-Developer-portal-using-an-Azure-Active-Directory-account

