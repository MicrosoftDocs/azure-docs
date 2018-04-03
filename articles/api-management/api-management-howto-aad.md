---
title: Authorize developer accounts by using Azure Active Directory - Azure API Management | Microsoft Docs
description: Learn how to authorize users by using Azure Active Directory in API Management.
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

# Authorize developer accounts by using Azure Active Directory in Azure API Management

This article shows you how to enable access to the developer portal for users from Azure Active Directory (Azure AD). This guide also shows you how to manage groups of Azure AD users by adding external groups that contain the users.

> [!NOTE]
> Azure AD integration is available in the [Developer, Standard, and Premium](https://azure.microsoft.com/pricing/details/api-management/) tiers only.

## Prerequisites

- Complete the following quickstart: [Create an Azure API Management instance](get-started-create-service-instance.md).
- Import and publish an Azure API Management instance. For more information, see [Import and publish](import-and-publish.md).

## Authorize developer accounts by using Azure AD

1. Sign in to the [Azure portal](https://portal.azure.com). 
2. Select ![arrow](./media/api-management-howto-aad/arrow.png).
3. Type **api** in the search box.
4. Select **API Management services**.
5. Select your API Management service instance.
6. Under **SECURITY**, select **Identities**.

7. Select **+Add** from the top.

    The **Add identity provider** pane appears on the right.
8. Under **Provider type**, select **Azure Active Directory**.

    Controls that enable you to enter other necessary information appear in the pane. The controls include **Client ID** and **Client secret**. (You get information about these controls later in the article.)
9. Make a note of the contents of **Redirect URL**.
    
   ![Steps for adding an identity provider in the Azure portal](./media/api-management-howto-aad/api-management-with-aad001.png)  
10. In your browser, open a different tab. 
11. Go to the [Azure portal](https://portal.azure.com).
12. Select ![arrow](./media/api-management-howto-aad/arrow.png).
13. Type **active**. The **Azure Active Directory** pane appears.
14. Select **Azure Active Directory**.
15. Under **MANAGE**, select **App registrations**.
16. Select **New application registration**.

    ![Selections for creating a new app registration](./media/api-management-howto-aad/api-management-with-aad002.png)

    The **Create** pane appears on the right. That's where you enter the Azure AD app-relevant information.
17. Enter a name for the application.
18. For the application type, select **Web app/API**.
19. For the sign-in URL, enter the sign-in URL of your developer portal. In this example, the sign-in URL is https://apimwithaad.portal.azure-api.net/signin.
20. Select **Create** to create the application.
21. To find your app, select **App registrations** and search by name.

    ![Box where you search for an app](./media/api-management-howto-aad/find-your-app.png)
22. After the application is registered, go to **Reply URL** and make sure **Redirect URL** is set to the value that you got from step 9. 
23. If you want to configure your application (for example, change **App ID URL**), select **Properties**.

    ![Opening the "Properties" pane](./media/api-management-howto-aad/api-management-with-aad004.png)

    If multiple Azure AD instances will be used for this application, select **Yes** for **Multi-tenanted**. The default is **No**.
24. Set application permissions by selecting **Required permissions**.
25. Select your application, and then select the **Read directory data** and **Sign in and read user profile** check boxes.

    ![Check boxes for permissions](./media/api-management-howto-aad/api-management-with-aad005.png)

    For more information about application permissions and delegated permissions, see [Accessing the Graph API][Accessing the Graph API].
26. In the left pane, copy the **Application ID** value.

    !["Application ID" value](./media/api-management-howto-aad/application-id.png)
27. Switch back to your API Management application. 

    In the **Add identity provider** window, paste the **Application ID** value in the **Client ID** box.
28. Switch back to the Azure AD configuration, and select **Keys**.
29. Create a new key by specifying a name and duration. 
30. Select **Save**. The key is generated.

    Copy the key to the clipboard.

    ![Selections for creating a key](./media/api-management-howto-aad/api-management-with-aad006.png)

    > [!NOTE]
    > Make a note of this key. After you close the Azure AD configuration pane, the key cannot be displayed again.
    > 
    > 
31. Switch back to your API Management application. 

    In the **Add identity provider** window, paste the key in the **Client secret** text box.
32. The **Add identity provider** window also contains the **Allowed Tenants** text box. There, specify the domains of the Azure AD instances to which you want to grant access to the APIs of the API Management service instance. You can separate multiple domains with newlines, spaces, or commas.

    You can specify multiple domains in the **Allowed Tenants** section. Before any user can sign in from a different domain than the original domain where the application was registered, a global administrator of the different domain must grant permission for the application to access directory data. To grant permission, the global administrator should:
    
    a. Go to `https://<URL of your developer portal>/aadadminconsent` (for example, https://contoso.portal.azure-api.net/aadadminconsent).
    
    b. Type in the domain name of the Azure AD tenant that they want to give access to.
    
    c. Select **Submit**. 
    
    In the following example, a global administrator from miaoaad.onmicrosoft.com is trying to give permission to this particular developer portal. 

33. After you specify the desired configuration, select **Add**.

    !["Add" button in "Add identity provider" pane](./media/api-management-howto-aad/api-management-with-aad007.png)

After the changes are saved, users in the specified Azure AD instance can sign in to the developer portal by following the steps in [Sign in to the developer portal by using an Azure AD account](#log_in_to_dev_portal).

![Entering the name of an Azure AD tenant](./media/api-management-howto-aad/api-management-aad-consent.png)

On the next screen, the global administrator is prompted to confirm giving the permission. 

![Confirmation of assigning permissions](./media/api-management-howto-aad/api-management-permissions-form.png)

If a non-global administrator tries to sign in before a global administrator grants permissions, the sign-in attempt fails and an error screen is displayed.

## Add an external Azure AD group

After you enable access for users in an Azure AD instance, you can add Azure AD groups in API Management. Then, you can more easily manage the association of the developers in the group with the desired products.

To configure an external Azure AD group, you must first configure the Azure AD instance on the **Identities** tab by following the procedure in the previous section. 

You add external Azure AD groups from the **Groups** tab of your API Management instance.

1. Select the **Groups** tab.
2. Select the **Add AAD group** button.
   !["Add AAD group" button](./media/api-management-howto-aad/api-management-with-aad008.png)
3. Select the group that you want to add.
4. Press the **Select** button.

After you add an external Azure AD group, you can review and configure its properties. Select the name of the group from the **Groups** tab. From here, you can edit **Name** and **Description** information for the group.
 
Users from the configured Azure AD instance can now sign in to the developer portal. They can view and subscribe to any groups for which they have visibility.

## <a id="log_in_to_dev_portal"/>Sign in to the developer portal by using an Azure AD account

To sign in to the developer portal by using an Azure AD account that you configured in the previous sections:

1. Open a new browser window by using the sign-in URL from the Active Directory application configuration, and select **Azure Active Directory**.

   ![Sign-in page][api-management-dev-portal-signin]

2. Enter the credentials of one of the users in Azure AD, and select **Sign in**.

   ![Signing in with username and password][api-management-aad-signin]

3. You might be prompted with a registration form if any additional information is required. Complete the registration form, and select **Sign up**.

   !["Sign up" button on registration form][api-management-complete-registration]

Your user is now signed in to the developer portal for your API Management service instance.

![Developer portal after registration is complete][api-management-registration-complete]

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

[Sign in to the developer portal by using an Azure AD account]: #Sign-in-to-the-developer-portal-by-using-an-Azure-AD-account
