<properties 
	pageTitle="How to authorize developer accounts using Azure Active Directory in Azure API Management" 
	description="Learn how to authorize users using Azure Active Directory in API Management." 
	services="api-management" 
	documentationCenter="API Management" 
	authors="sdanie" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="api-management" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/10/2015" 
	ms.author="sdanie"/>

# How to authorize developer accounts using Azure Active Directory in Azure API Management


## Overview
This guide shows you how to enable access to the developer portal for all users in one or more Azure Active Directories. This guide also shows you how to manage groups of Azure Active Directory users by adding external groups that contain the users of an Azure Active Directory.

>To complete the steps in this guide you must first have an Azure Active Directory in which to create an application.

## How to authorize developer accounts using Azure Active Directory

To get started, click **Manage** in the Azure Portal for your API Management service. This takes you to the API Management publisher portal.

![Publisher portal][api-management-management-console]

>If you have not yet created an API Management service instance, see [Create an API Management service instance][] in the [Get started with Azure API Management][] tutorial.

Click **Security** from the **API Management** menu on the left and click **External Identities**.

![External Identities][api-management-security-external-identities]

Click **Azure Active Directory**. Make a note of the **Redirect URL** and switch over to your Azure Active Directory in the Azure Portal.

![External Identities][api-management-security-aad-new]

Click the **Add** button to create a new Azure Active Directory application, and choose **Add an application my organization is developing**.

![Add new Azure Active Directory application][api-management-new-aad-application-menu]

Enter a name for the application, select **Web application and/or Web API**, and click the next button.

![New Azure Active Directory application][api-management-new-aad-application-1]

For **Sign-on URL**, copy the **Redirect URL** from the **Azure Active Directory** section of the **External Identities** tab in the publisher portal and remove the **-aad** suffix from the end of the URL. In this example, the **Sign-on URL** is `https://aad03.portal.current.int-azure-api.net/signin`. 

For the **App ID URL**, enter either the default domain or a custom domain for the Azure Active Directory, and append a unique string to it. In this example the default domain of **https://contoso5api.onmicrosoft.com** is used with the suffix of **/api** specified.

![New Azure Active Directory application properties][api-management-new-aad-application-2]

Click the check button to save and create the new application, and switch  to the **Configure** tab to configure the new application.

![New Azure Active Directory application created][api-management-new-aad-app-created]

If multiple Azure Active Directories are going to be used for this application, click **Yes** for **Application is multi-tenant**. The default is **No**.

![Application is multi-tenant][api-management-aad-app-multi-tenant]

Copy the **Redirect URL** from the **Azure Active Directory** section of the **External Identities** tab in the publisher portal and paste it into the **Reply URL** text box. 

![Reply URL][api-management-aad-reply-url]

Scroll to the bottom of the configure tab, select the **Application Permissions** drop-down, and check **Read directory data**.

![Application Permissions][api-management-aad-app-permissions]

Select the **Delegate Permissions** drop-down, and check **Enable sign-on and read users' profiles**.

![Delegated Permissions][api-management-aad-delegated-permissions]

>For more information about application and delegated permissions, see [Accessing the Graph API][].

Copy the **Client Id** to the clipboard.

![Client Id][api-management-aad-app-client-id]

Switch back to the publisher portal and paste in the **Client Id** copied from the Azure Active Directory application configuration.

![Client Id][api-management-client-id]

Switch back to the Azure Active Directory configuration, and click the **Select duration** drop-down in the **Keys** section and specify an interval. In this example **1 year** is used.

![Key][api-management-aad-key-before-save]

Click **Save** to save the configuration and display the key. Copy the key to the clipboard.

>Make a note of this key. Once you close the Azure Active Directory configuration window, the key cannot be displayed again.

![Key][api-management-aad-key-after-save]

Switch back to the publisher portal and paste the key into the **Client Secret** text box.

![Client Secret][api-management-client-secret]

**Allowed Tenants** specifies which directories have access to the APIs of the API Management service instance. Specify the domains of the Azure Active Directory instances to which you want to grant access. You can separate multiple domains with newlines, spaces, or commas.

![Allowed tenants][api-management-client-allowed-tenants]

Multiple domains can be specified in the **Allowed Tenants** section. Before any user can log in from a different domain than the original domain where the application was registered, a global administrator of the different domain must grant permission for the application to access directory data. To grant permission, a global administrator must log in to the application and click **Accept**. In the following example `miaoaad.onmicrosoft.com` has been added to **Allowed Tenants** and a global administrator from that domain is logging in for the first time.

![Permissions][api-management-permissions-form]

>If a non-global administrator tries to log in before permissions are granted by a global administrator, the login attempt fails and an error screen is displayed.

Once the desired configuration is specified, click **Save**.

![Save][api-management-client-allowed-tenants-save]

Once the changes are saved, the users in the specified Azure Active Directory can log into the Developer portal by following the steps in [Log in to the Developer portal using an Azure Active Directory account][].

## How to add an external Azure Active Directory Group

After enabling access for users in an Azure Active Directory, you can add Azure Active Directory groups into API Management to more easily manage the association of the developers in the group with the desired products.

> In order to configure an external Azure Active Directory group, the Azure Active Directory must first be configured in the Identities tab by following the procedure in the previous section. 

External Azure Active Directory groups are added from the **Visibility** tab of the product for which you wish to grant access to the group. Click **Products**, and then click the name of the desired product.

![Configure product][api-management-configure-product]

Switch to the **Visibility** tab, and click **Add Groups from Azure Active Directory**.

![Add groups][api-management-add-groups]

Select the **Azure Active Directory Tenant** from the drop-down list, and then type the name of the desired group in the **Groups** to be added text box.

![Select group][api-management-select-group]

This group name can be found in the **Groups** list for your Azure Active Directory, as shown in the following example.

![Azure Active Directory Groups List][api-management-aad-groups-list]

Click **Add** to validate the group name and add the group. In this example the **Contoso 5 Developers** external group is added. 

![Group added][api-management-aad-group-added]

Click **Save** to save the new group selection.

Once an Azure Azure Active Directory group has been configured from one product, it is available to be checked on the **Visibility** tab for the other products in the API Management service instance.

To review and configure the properties for external groups once they have been added, click on the name of the group from the **Groups** tab.

![Manage groups][api-management-groups]

From here you can edit the **Name** and the **Description** of the group.

![Edit group][api-management-edit-group]

Users from the configured Azure Active Directory can log into the Developer portal and view and subscribe to any groups for which they have visibility by following the instructions in the following section.

## How to log in to the Developer portal using an Azure Active Directory account

To log into the Developer portal using an Azure Active Directory account configured in the previous sections, open a new browser window using the **Sign-on URL** from the Active Directory application configuration, and click **Azure Active Directory**.

![Developer Portal][api-management-dev-portal-signin]

Enter the credentials of one of the users in your Azure Active Directory, and click **Sign in**.

![Sign in][api-management-aad-signin]

You may be prompted with a registration form if any additional information is required. Complete the registration form and click **Sign up**.

![Registration][api-management-complete-registration]

Your user is now logged into the developer portal for your API Management service instance.

![Registration Complete][api-management-registration-complete]



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
[Get started with Azure API Management]: api-management-get-started.md
[Get started with advanced API configuration]: api-management-get-started-advanced.md
[API Management policy reference]: api-management-policy-reference.md
[Caching policies]: api-management-policy-reference.md#caching-policies
[Create an API Management service instance]: api-management-get-started.md#create-service-instance

[http://oauth.net/2/]: http://oauth.net/2/
[WebApp-GraphAPI-DotNet]: https://github.com/AzureADSamples/WebApp-GraphAPI-DotNet
[Accessing the Graph API]: http://msdn.microsoft.com/library/azure/dn132599.aspx#BKMK_Graph

[Prerequisites]: #prerequisites
[Configure an OAuth 2.0 authorization server in API Management]: #step1
[Configure an API to use OAuth 2.0 user authorization]: #step2
[Test the OAuth 2.0 user authorization in the Developer Portal]: #step3
[Next steps]: #next-steps

[Log in to the Developer portal using an Azure Active Directory account]: #Log-in-to-the-Developer-portal-using-an-Azure-Active-Directory-account

