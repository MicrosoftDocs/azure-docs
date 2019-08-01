---
title: Authorize developer accounts by using Azure Active Directory B2C - Azure API Management | Microsoft Docs
description: Learn how to authorize users by using Azure Active Directory B2C in API Management.
services: api-management
documentationcenter: API Management
author: miaojiang
manager: cfowler
editor: ''

ms.service: api-management
ms.workload: mobile
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/30/2017
ms.author: apimpm
---

# How to authorize developer accounts by using Azure Active Directory B2C in Azure API Management

## Overview

Azure Active Directory B2C is a cloud identity management solution for consumer-facing web and mobile applications. You can use it to manage access to your developer portal. This guide shows you the configuration that's required in your API Management service to integrate with Azure Active Directory B2C. For information about enabling access to the developer portal by using classic Azure Active Directory, see [How to authorize developer accounts using Azure Active Directory].

> [!NOTE]
> To complete the steps in this guide, you must first have an Azure Active Directory B2C tenant to create an application in. Also, you need to have signup and signin policies ready. For more information, see [Azure Active Directory B2C overview].

[!INCLUDE [premium-dev-standard.md](../../includes/api-management-availability-premium-dev-standard.md)]

## Authorize developer accounts by using Azure Active Directory B2C

1. To get started, sign in to the [Azure portal](https://portal.azure.com) and locate your API Management instance.

   > [!NOTE]
   > If you haven't yet created an API Management service instance, see [Create an API Management service instance][Create an API Management service instance] in the [Get started with Azure API Management tutorial][Get started with Azure API Management].

2. Under **Identities**. Click **+Add** at the top.

   The **Add identity provider** pane appears on the right. Choose **Azure Active Directory B2C**.
    
   ![Add AAD B2C as identity provider][api-management-howto-add-b2c-identity-provider]

3. Copy the **Redirect URL**.

   ![AAD B2C identity provider redirect URL][api-management-howto-copy-b2c-identity-provider-redirect-url]

4. In a new tab, access your Azure Active Directory B2C tenant in the Azure portal and open the **Applications** blade.

   ![Register a new application 1][api-management-howto-aad-b2c-portal-menu]

5. Click the **Add** button to create a new Azure Active Directory B2C application.

   ![Register a new application 2][api-management-howto-aad-b2c-add-button]

6. In the **New application** blade, enter a name for the application. Choose **Yes** under **Web App/Web API**, and choose **Yes** under **Allow implicit flow**. Then paste the **Redirect URL** copied in step 3 into the **Reply URL** text box.

   ![Register a new application 3][api-management-howto-aad-b2c-app-details]

7. Click the **Create** button. When the application is created, it appears in the **Applications** blade. Click the application name to see its details.

   ![Register a new application 4][api-management-howto-aad-b2c-app-created]

8. From the **Properties** blade, copy the **Application ID** to the clipboard.

   ![Application ID 1][api-management-howto-aad-b2c-app-id]

9. Switch back to the API Management **Add identity provider** pane and paste the ID into the **Client Id** text box.
    
10. Switch back to the B2C app registration, click the **Keys** button, and then click **Generate key**. Click **Save** to save the configuration and display the **App key**. Copy the key to the clipboard.

    ![App key 1][api-management-howto-aad-b2c-app-key]

11. Switch back to the API Management **Add identity provider** pane and paste the key into the **Client Secret** text box.
    
12. Specify the domain name of the Azure Active Directory B2C tenant in **Signin tenant**.

13. The **Authority** field let you control the Azure AD B2C login URL to use. Set the value to **<your_b2c_tenant_name>.b2clogin.com**.

14. Specify the **Signup Policy** and **Signin Policy** from the B2C Tenant policies. Optionally, you can also provide the **Profile Editing Policy** and **Password Reset Policy**.

15. After you've specified the desired configuration, click **Save**.

    After the changes are saved, developers will be able to create new accounts and sign in to the developer portal by using Azure Active Directory B2C.

## Sign up for a developer account by using Azure Active Directory B2C

1. To sign up for a developer account by using Azure Active Directory B2C, open a new browser window and go to the developer portal. Click the **Sign up** button.

   ![Developer portal 1][api-management-howto-aad-b2c-dev-portal]

2. Choose to sign up with **Azure Active Directory B2C**.

   ![Developer portal 2][api-management-howto-aad-b2c-dev-portal-b2c-button]

3. You're redirected to the signup policy that you configured in the previous section. Choose to sign up by using your email address or one of your existing social accounts.

   > [!NOTE]
   > If Azure Active Directory B2C is the only option that's enabled on the **Identities** tab in the publisher portal, you'll be redirected to the signup policy directly.

   ![Developer portal][api-management-howto-aad-b2c-dev-portal-b2c-options]

   When the signup is complete, you're redirected back to the developer portal. You're now signed in to the developer portal for your API Management service instance.

    ![Registration complete][api-management-registration-complete]

## Next steps

*  [Azure Active Directory B2C overview]
*  [Azure Active Directory B2C: Extensible policy framework]
*  [Use a Microsoft account as an identity provider in Azure Active Directory B2C]
*  [Use a Google account as an identity provider in Azure Active Directory B2C]
*  [Use a LinkedIn account as an identity provider in Azure Active Directory B2C]
*  [Use a Facebook account as an identity provider in Azure Active Directory B2C]



[api-management-howto-add-b2c-identity-provider]: ./media/api-management-howto-aad-b2c/api-management-add-b2c-identity-provider.PNG
[api-management-howto-copy-b2c-identity-provider-redirect-url]: ./media/api-management-howto-aad-b2c/api-management-b2c-identity-provider-redirect-url.PNG
[api-management-howto-aad-b2c-portal-menu]: ./media/api-management-howto-aad-b2c/api-management-b2c-portal-menu.PNG
[api-management-howto-aad-b2c-add-button]: ./media/api-management-howto-aad-b2c/api-management-b2c-add-button.PNG
[api-management-howto-aad-b2c-app-details]: ./media/api-management-howto-aad-b2c/api-management-b2c-app-details.PNG
[api-management-howto-aad-b2c-app-created]: ./media/api-management-howto-aad-b2c/api-management-b2c-app-created.PNG
[api-management-howto-aad-b2c-app-id]: ./media/api-management-howto-aad-b2c/api-management-b2c-app-id.PNG
[api-management-howto-aad-b2c-client-id]: ./media/api-management-howto-aad-b2c/api-management-b2c-client-id.PNG
[api-management-howto-aad-b2c-app-key]: ./media/api-management-howto-aad-b2c/api-management-b2c-app-key.PNG
[api-management-howto-aad-b2c-app-key-saved]: ./media/api-management-howto-aad-b2c/api-management-b2c-app-key-saved.PNG
[api-management-howto-aad-b2c-client-secret]: ./media/api-management-howto-aad-b2c/api-management-b2c-client-secret.PNG
[api-management-howto-aad-b2c-allowed-tenant]: ./media/api-management-howto-aad-b2c/api-management-b2c-allowed-tenant.PNG
[api-management-howto-aad-b2c-policies]: ./media/api-management-howto-aad-b2c/api-management-b2c-policies.PNG
[api-management-howto-aad-b2c-dev-portal]: ./media/api-management-howto-aad-b2c/api-management-b2c-dev-portal.PNG
[api-management-howto-aad-b2c-dev-portal-b2c-button]: ./media/api-management-howto-aad-b2c/api-management-b2c-dev-portal-b2c-button.PNG
[api-management-howto-aad-b2c-dev-portal-b2c-options]: ./media/api-management-howto-aad-b2c/api-management-b2c-dev-portal-b2c-options.PNG
[api-management-complete-registration]: ./media/api-management-howto-aad/api-management-complete-registration.PNG
[api-management-registration-complete]: ./media/api-management-howto-aad/api-management-registration-complete.png

[api-management-management-console]: ./media/api-management-howto-aad/api-management-management-console.png
[api-management-security-external-identities]: ./media/api-management-howto-aad/api-management-b2c-security-tab.png
[api-management-security-aad-new]: ./media/api-management-howto-aad/api-management-security-aad-new.png
[api-management-new-aad-application-menu]: ./media/api-management-howto-aad/api-management-new-aad-application-menu.png
[api-management-new-aad-application-1]: ./media/api-management-howto-aad/api-management-new-aad-application-1.png
[api-management-new-aad-application-2]: ./media/api-management-howto-aad/api-management-new-aad-application-2.png
[api-management-new-aad-app-created]: ./media/api-management-howto-aad/api-management-new-aad-app-created.png
[api-management-aad-app-permissions]: ./media/api-management-howto-aad/api-management-aad-app-permissions.png
[api-management-aad-app-client-id]: ./media/api-management-howto-aad/api-management-aad-app-client-id.png
[api-management-client-id]: ./media/api-management-howto-aad/api-management-client-id.png
[api-management-aad-key-before-save]: ./media/api-management-howto-aad/api-management-aad-key-before-save.png
[api-management-aad-key-after-save]: ./media/api-management-howto-aad/api-management-aad-key-after-save.png
[api-management-client-secret]: ./media/api-management-howto-aad/api-management-client-secret.png
[api-management-client-allowed-tenants]: ./media/api-management-howto-aad/api-management-client-allowed-tenants.png
[api-management-client-allowed-tenants-save]: ./media/api-management-howto-aad/api-management-client-allowed-tenants-save.png
[api-management-aad-delegated-permissions]: ./media/api-management-howto-aad/api-management-aad-delegated-permissions.png
[api-management-dev-portal-signin]: ./media/api-management-howto-aad/api-management-dev-portal-signin.png
[api-management-aad-signin]: ./media/api-management-howto-aad/api-management-aad-signin.png
[api-management-aad-app-multi-tenant]: ./media/api-management-howto-aad/api-management-aad-app-multi-tenant.png
[api-management-aad-reply-url]: ./media/api-management-howto-aad/api-management-aad-reply-url.png
[api-management-permissions-form]: ./media/api-management-howto-aad/api-management-permissions-form.png
[api-management-configure-product]: ./media/api-management-howto-aad/api-management-configure-product.png
[api-management-add-groups]: ./media/api-management-howto-aad/api-management-add-groups.png
[api-management-select-group]: ./media/api-management-howto-aad/api-management-select-group.png
[api-management-aad-groups-list]: ./media/api-management-howto-aad/api-management-aad-groups-list.png
[api-management-aad-group-added]: ./media/api-management-howto-aad/api-management-aad-group-added.png
[api-management-groups]: ./media/api-management-howto-aad/api-management-groups.png
[api-management-edit-group]: ./media/api-management-howto-aad/api-management-edit-group.png

[How to add operations to an API]: api-management-howto-add-operations.md
[How to add and publish a product]: api-management-howto-add-products.md
[Monitoring and analytics]: api-management-monitoring.md
[Add APIs to a product]: api-management-howto-add-products.md#add-apis
[Publish a product]: api-management-howto-add-products.md#publish-product
[Get started with Azure API Management]: get-started-create-service-instance.md
[API Management policy reference]: api-management-policy-reference.md
[Caching policies]: api-management-policy-reference.md#caching-policies
[Create an API Management service instance]: get-started-create-service-instance.md

[https://oauth.net/2/]: https://oauth.net/2/
[WebApp-GraphAPI-DotNet]: https://github.com/AzureADSamples/WebApp-GraphAPI-DotNet
[Accessing the Graph API]: https://msdn.microsoft.com/library/azure/dn132599.aspx#BKMK_Graph
[Azure Active Directory B2C overview]: https://docs.microsoft.com/azure/active-directory-b2c/active-directory-b2c-overview
[How to authorize developer accounts using Azure Active Directory]: https://docs.microsoft.com/azure/api-management/api-management-howto-aad
[Azure Active Directory B2C: Extensible policy framework]: https://docs.microsoft.com/azure/active-directory-b2c/active-directory-b2c-reference-policies
[Use a Microsoft account as an identity provider in Azure Active Directory B2C]: https://docs.microsoft.com/azure/active-directory-b2c/active-directory-b2c-setup-msa-app
[Use a Google account as an identity provider in Azure Active Directory B2C]: https://docs.microsoft.com/azure/active-directory-b2c/active-directory-b2c-setup-goog-app
[Use a Facebook account as an identity provider in Azure Active Directory B2C]: https://docs.microsoft.com/azure/active-directory-b2c/active-directory-b2c-setup-fb-app
[Use a LinkedIn account as an identity provider in Azure Active Directory B2C]: https://docs.microsoft.com/azure/active-directory-b2c/active-directory-b2c-setup-li-app

[Prerequisites]: #prerequisites
[Configure an OAuth 2.0 authorization server in API Management]: #step1
[Configure an API to use OAuth 2.0 user authorization]: #step2
[Test the OAuth 2.0 user authorization in the Developer Portal]: #step3
[Next steps]: #next-steps

[Log in to the Developer portal using an Azure Active Directory account]: #Log-in-to-the-Developer-portal-using-an-Azure-Active-Directory-account
