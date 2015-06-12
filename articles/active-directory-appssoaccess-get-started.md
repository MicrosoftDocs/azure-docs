<properties
	pageTitle="What is application access and single sign-on with Azure Active Directory?"
	description="Use Azure Active Directory to enable single sign-on to all of the SaaS and web applications that you need for business."
	services="active-directory"
	documentationCenter=""
	authors="asmalser-msft"
	manager="terrylan"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/15/2015"
	ms.author="asmalser-msft"/>


#Get started with the Azure AD application gallery


###Other articles on this topic
[What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)<br>
[How does single sign-on with Azure Active Directory work?](active-directory-appssoaccess-works.md)<br>
[Deploying applications to users](active-directory-appssoaccess-deployapps.md)<br>

Ready to get started? To deploy single sign-on between Azure AD and SaaS applications that your organization uses, follow these guidelines.

##Using the Azure AD application gallery

The [Azure Active Directory Application Gallery](http://azure.microsoft.com/en-us/marketplace/active-directory/all/) provides a listing of applications that are known to support a form of single sign-on with Azure Active Directory.

![][1]

Here are some tips for finding apps by what capabilities they support:

*	Azure AD supports automatic provisioning and de-provisioning for all “Featured” apps in the [Azure Active Directory Application Gallery](http://azure.microsoft.com/en-us/marketplace/active-directory/all/).

*	A list of federated applications that specifically support federated single sign-on using a protocol such as SAML, WS-Federation, or OpenID Connect can be found [here](http://social.technet.microsoft.com/wiki/contents/articles/20235.azure-active-directory-application-gallery-federated-saas-apps.aspx).

Once you’ve found your application, you can get started by follow the step-by-step instructions presented in the app gallery and in the Azure management portal to enable single sign-on.

##Application not in the gallery?

If your application is not found in the Azure AD application gallery, then you have these options:

*	**Add an unlisted app you are using** - Use the Custom category in the app gallery within the Azure management portal to add the application you need. You can add any application that supports SAML 2.0 as a federated app, or any application that has an HTML-based sign-in page as a password SSO app. For more details, see this article on [adding your own password SSO app](http://blogs.technet.com/b/ad/archive/2014/12/11/wrapping-up-the-year-with-a-boat-load-of-azure-ad-news.aspx).


*	**Add your own app you are developing** - If you have developed the application yourself, follow the guidelines in the Azure AD developer documentation to implement federated single sign-on or provisioning using the Azure AD graph API. For more information, see these resources:
  * https://msdn.microsoft.com/en-us/library/azure/dn499820.aspx
  * https://github.com/AzureADSamples/WebApp-MultiTenant-OpenIdConnect-DotNet
  * https://github.com/AzureADSamples/WebApp-WebAPI-MultiTenant-OpenIdConnect-DotNet
  * https://github.com/AzureADSamples/NativeClient-WebAPI-MultiTenant-WindowsStore

*	**Request an app integration** - Request support for the application you need using the [Azure AD feedback forum](http://feedback.azure.com/forums/169401-azure-active-directory).

##Using the Azure management portal

You can use the Active Directory extension in the Azure Management Portal to configure the application single sign-on. As a first step, you need to select a directory from the Active Directory section in the portal:

![][2]

To manage your third-party SaaS applications, you can switch into the Applications tab of the selected directory. This view enables administrators to:

* Add new applications from the Azure AD gallery, as well as apps you are developing
* Delete integrated applications
* Manage the applications they have already integrated

Typical administrative tasks for a third-party SaaS application are:

* Enabling single sign-on with Azure AD, using password SSO or, if available for the target SaaS, federated SSO
* Optionally, enabling user provisioning for user provisioning and de-provisioning (identity lifecycle management)
* For applications where user provisioning is enabled, selecting which users have access to that application

For gallery apps that support federated single sign-on, configuration typically requires you to provide additional configuration settings such as certificates and metadata to create a federated trust between the third-party app and Azure AD. The configuration wizard walks you through the details and provides you with easy access to the SaaS application specific data and instructions.

For gallery apps that support automatic user provisioning, this requires you to give Azure AD permissions to manage your accounts in the SaaS application. At a minimum, you need to provide credentials Azure AD should use when authenticating over to the target application. Whether additional configuration settings need to be provided depends on the requirements of the application.

[Next: Deploying applications to users](active-directory-appssoaccess-deployapps.md)

<!--Image references-->
[1]: ./media/active-directory-appssoaccess-get-started/onlineappgallery.PNG
[2]: ./media/active-directory-appssoaccess-get-started/azuremgmtportal.PNG
