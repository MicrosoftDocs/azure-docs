<properties pageTitle="How to authorize developer accounts using Azure Active Directory in Azure API Management" metaKeywords="" description="Learn how to authorize users using OAuth 2.0 in API Management." metaCanonical="" services="api-management" documentationCenter="API Management" title="How to authorize developer accounts using Azure Active Directory in Azure API Management" authors="sdanie" solutions="" manager="dwrede" editor="" />

<tags ms.service="api-management" ms.workload="mobile" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="1/8/2015" ms.author="sdanie" />

# How to authorize developer accounts using Azure Active Directory in Azure API Management

This guide shows you how to enable access to the developer portal for all users in one or more Azure Active Directories.

>To complete the steps in this guide you must first have an Azure Active Directory in which to create an application.

To get started, click **Management Console** in the Azure Portal for your API Management service. This takes you to the API Management administrative portal.

![API Management console][api-management-management-console]

>If you have not yet created an API Management service instance, see [Create an API Management service instance][] in the [Get started with Azure API Management][] tutorial.

Click **Security** from the **API Management** menu on the left and click **External Identities**.

![api-management-security-external-identities][]

Click **Azure Active Directory**. Make a note of the **Redirect URL** and switch over to your Azure Active Directory in the Azure Portal.

![api-management-security-aad-new][]

Click the **Add** button to create a new Azure Active Directory application, and choose **Add an application my organization is developing**.

![api-management-new-aad-application-menu][]

Enter a name for the application, select **Web application and/or Web API**, and click the next button.

![api-management-new-aad-application-1][]

For **Sign-on URL**, copy the **Redirect URL** from the **Azure Active Directory** section of the **External Identities** tab in the Management console and remove the **-aad** suffix from the end of the URL. In this example, the **Sign-on URL** is `https://aad03.portal.current.int-azure-api.net/signin`. 

For the **App ID URL**, enter either the default domain or a custom domain for the Azure Active Directory, and append a unique string to it. In this example the default domain of **https://contoso5api.onmicrosoft.com** is used with the suffix of **/api** specified.

![api-management-new-aad-application-2][]

Click the check button to save and create the new application, and switch  to the **Configure** tab to configure the new application.

![api-management-new-aad-app-created][]

If multiple Azure Active Directories are going to be used for this application, click **Yes** for **Application is multi-tenant**. The default is **No**.

![api-management-aad-app-multi-tenant][]

Copy the **Redirect URL** from the **Azure Active Directory** section of the **External Identities** tab in the Management console and paste it into the **Reply URL** text box. 

![api-management-aad-reply-url][]

Scroll to the bottom of the configure tab, select the **Application Permissions** drop-down, and check **Read directory data**.

![api-management-aad-app-permissions][]

Select the **Delegate Permissions** drop-down, and check **Enable sign-on and read users' profiles**.

![api-management-aad-delegated-permissions][]

>For more information about application and delegated permissions, see [Accessing the Graph API][].

Copy the **Client Id** to the clipboard.

![api-management-aad-app-client-id][]

Switch back to the Management console and paste in the **Client Id** copied from the Azure Active Directory application configuration.

![api-management-client-id][]

Switch back to the Azure Active Directory configuration, and click the **Select duration** drop-down in the **Keys** section and specify an interval. In this example **1 year** is used.

![api-management-aad-key-before-save][]

Click **Save** to save the configuration and display the key. Copy the key to the clipboard.

>Make a note of this key. Once you close the Azure Active Directory configuration window, the key cannot be displayed again.

![api-management-aad-key-after-save][]

Switch back to the Management console and paste the key into the **Client Secret** text box.

![api-management-client-secret][]

**Allowed Tenants** specifies which directories have access to the APIs of the API Management service instance. Specify the domains of the Azure Active Directory instances to which you want to grant access. You can separate multiple domains with newlines, spaces, or commas.

![api-management-client-allowed-tenants][]

Multiple domains can be specified in the **Allowed Tenants** section. Before any user can log in from a different domain than the original domain where the application was registered, a global administrator of the different domain must grant permission for the application to access directory data. To grant permission, a global administrator must log in to the application and click **Accept**. In the following example `miaoaad.onmicrosoft.com` has been added to **Allowed Tenants** and a global administrator from that domain is logging in for the first time.

![][api-management-permissions-form]

>If a non-global administrator tries to log in before permissions are granted by a global administrator, the login attempt fails and an error screen is displayed.

Once the desired configuration is specified, click **Save**.

![api-management-client-allowed-tenants-save][]

To test the configuration, open a new browser window using the **Sign-on URL** from the Active Directory application configuration, and click **Azure Active Directory**.

![api-management-dev-portal-signin][]

Enter the credentials of one of the users in your Azure Active Directory, and click **Sign in**.

![api-management-aad-signin][]

You may be prompted with a registration form if any additional information is required. Complete the registration form and click **Sign up**.

![api-management-complete-registration][]

Your user is now logged into the developer portal for your API Management service instance.

![api-management-registration-complete][]




[api-management-management-console]: ./media/api-management-howto-aad/api-management-management-console.png
[api-management-security-external-identities]: ./media/api-management-howto-aad/api-management-security-external-identities.png
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
[api-management-complete-registration]: ./media/api-management-howto-aad/api-management-complete-registration.png
[api-management-registration-complete]: ./media/api-management-howto-aad/api-management-registration-complete.png
[api-management-aad-app-multi-tenant]: ./media/api-management-howto-aad/api-management-aad-app-multi-tenant.png
[api-management-aad-reply-url]: ./media/api-management-howto-aad/api-management-aad-reply-url.png
[api-management-permissions-form]: ./media/api-management-howto-aad/api-management-permissions-form.png


[How to add operations to an API]: ../api-management-howto-add-operations
[How to add and publish a product]: ../api-management-howto-add-products
[Monitoring and analytics]: ../api-management-monitoring
[Add APIs to a product]: ../api-management-howto-add-products/#add-apis
[Publish a product]: ../api-management-howto-add-products/#publish-product
[Get started with Azure API Management]: ../api-management-get-started
[Get started with advanced API configuration]: ../api-management-get-started-advanced
[API Management policy reference]: ../api-management-policy-reference
[Caching policies]: ../api-management-policy-reference/#caching-policies
[Create an API Management service instance]: ../api-management-get-started/#create-service-instance

[http://oauth.net/2/]: http://oauth.net/2/
[WebApp-GraphAPI-DotNet]: https://github.com/AzureADSamples/WebApp-GraphAPI-DotNet
[Accessing the Graph API]: http://msdn.microsoft.com/en-us/library/azure/dn132599.aspx#BKMK_Graph

[Prerequisites]: #prerequisites
[Configure an OAuth 2.0 authorization server in API Management]: #step1
[Configure an API to use OAuth 2.0 user authorization]: #step2
[Test the OAuth 2.0 user authorization in the Developer Portal]: #step3
[Next steps]: #next-steps

