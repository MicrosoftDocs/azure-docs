
<properties linkid="develop-mobile-tutorials-sso-with-adal" urlDisplayName="Active Directory SSO Authentication with ADAL" pageTitle="Authenticate your app with Active Directory Authentication Library Single Sign-On (Windows Store) | Mobile Dev Center" metaKeywords="" description="Learn how to authentication users for single sign-on with ADAL in your Windows Store application." metaCanonical="" disqusComments="1" umbracoNaviHide="1" documentationCenter="Mobile" title="Authenticate your app with Active Directory Authentication Library Single Sign-On" authors="wesmc" />

# Authenticate your app with Active Directory Authentication Library Single Sign-On

<div class="dev-center-tutorial-selector sublanding">
<a href="/en-us/documentation/articles/mobile-services-windows-store-dotnet-adal-sso-authentication" title="Windows Store C#" class="current">Windows Store C#</a>
</div>

This topic shows you how to use Live Connect single sign-on to authenticate users in Windows Azure Mobile Services from a Windows Store app. In this tutorial, you add authentication to the quickstart project using the Active Directory Authentication Library. 

To be able to authenticate users, you must register your application with the Azure Active Directory (AAD). This is done in two steps. First, you must register your mobile service and expose permissions on it. Second, you must register your Windows Store app and grant it access to those permissions


>[WACOM.NOTE] This tutorial is intended to help you better understand how Mobile Services enables you to do single sign-on Azure Active Directory authentication for Windows Store apps. If this is your first experience with Mobile Services, complete the tutorial [Get started with Mobile Services].

This tutorial walks you through these basic steps:

1. [Register your mobile service with the Azure Active Directory]
2. [Register your app with the Azure Active Directory] 

This tutorial requires the following:

* Visual Studio 2013 running on Windows 8.1.
* Completion of the [Get started with Mobile Services] or [Get Started with Data] tutorial.
* Windows Azure Mobile Services SDK NuGet package version 1.3.0-alpha
* Windows Azure Mobile Services SQLite Store NuGet package 0.1.0-alpha 
* SQLite for Windows 8.1



## <a name="register-mobile-service-aad"></a>Register your mobile service with the Azure Active Directory


In this section you will register your mobile service with the Azure Active Directory and configure permissions to allow single sign-on impersonation.

1. Register your application with your Azure Active Directory by following the [How to Register with the Azure Active Directory] topic.

2. In the [Azure Management Portal], go back to the Azure Active Directory extension and click on your active directory

3. Click the **Applications** tab and then click your application.

4. Click **Manage Manifest**. Then click **Download Manifest** and save the application manifest to a local directory.

    ![][0]

5. Open the application manifest file with Visual Studio. At the top of the file find the app permissions line that looks as follows:

        "appPermissions": [],

    Replace that line with the following app permissions and save the file.

        "appPermissions": [
	        {
        		"claimValue": "user_impersonation",
		        "description": "Allow the application access to the mobile service",
        		"directAccessGrantTypes": [],
	        	"displayName": "Have full access to the mobile service",
	        	"impersonationAccessGrantTypes": [
	        		{
	        			"impersonated": "User",
	        			"impersonator": "Application"
	        		}
	        	],
	        	"isDisabled": false,
	        	"origin": "Application",
	        	"permissionId": "b69ee3c9-c40d-4f2a-ac80-961cd1534e40",
	        	"resourceScopeType": "Personal",
	        	"userConsentDescription": "Allow the application full access to the mobile service on your behalf",
	        	"userConsentDisplayName": "Have full access to the mobile service"
        	}
        ],

6. In the Azure Management portal, click **Manage Manifest** for the application again and click **Upload Manifest**.  Browse to the location of the application manifest that you just updated and upload the manifest.


## <a name="register-app-aad"></a>Register your app with the Azure Active Directory

1. In Visual Studio, right click the client app project and click **Store** and **Associate App with the Store**

    ![][1]

##Summary


## Next steps

* [Handling conflicts with offline support for Mobile Services]

<!-- Anchors. -->
[Register your mobile service with the Azure Active Directory]: #register-mobile-service-aad
[Register your app with the Azure Active Directory]: #register-app-aad
[Next Steps]:#next-steps

<!-- Images -->
[0]: ./media/mobile-services-windows-store-dotnet-adal-sso-authenticate/mobile-services-aad-app-manage-manifest.png
[1]: ./media/mobile-services-windows-store-dotnet-adal-sso-authenticate/mobile-services-vs-associate-app.png


<!-- URLs. -->
[How to Register with the Azure Active Directory]: /en-us/documentation/articles/mobile-services-how-to-register-active-directory-authentication/
[Azure Management Portal]: https://manage.windowsazure.com/
[Get started with data]: /en-us/documentation/articles/mobile-services-dotnet-backend-windows-store-dotnet-get-started-data/
[Get started with Mobile Services]: /en-us/documentation/articles/mobile-services-windows-store-get-started/


