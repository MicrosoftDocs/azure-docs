<properties
	pageTitle="Azure AD iOS Getting Started | Microsoft Azure"
	description="How to build an iOS application that integrates with Azure AD for sign in and calls Azure AD protected APIs using OAuth."
	services="active-directory"
	documentationCenter="ios"
	authors="brandwe"
	manager="terrylan"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="mobile-ios"
	ms.devlang="objective-c"
	ms.topic="article"
	ms.date="04/28/2015"
	ms.author="brandwe"/>

# Integrate Azure AD into an iOS App
If you're developing a desktop application, Azure AD makes it simple and straightforward for you to authenticate your users with their Active Directory accounts.  It also enables your application to securely consume any web API protected by Azure AD, such as the Office 365 APIs or the Azure API.

For iOS clients that need to access protected resources, Azure AD provides the Active Directory Authentication Library, or ADAL.  ADAL’s sole purpose in life is to make it easy for your app to get access tokens.  To demonstrate just how easy it is, here we’ll build a Objective C To-Do List application that:

-	Gets access tokens for calling the Azure AD Graph API using the [OAuth 2.0 authentication protocol](https://msdn.microsoft.com/library/azure/dn645545.aspx).
-	Searches a directory for users with a given alias.
-	Signs users out.

To build the complete working application, you’ll need to:

2. Register your application with Azure AD.
3. Install & Configure ADAL.
5. Use ADAL to get tokens from Azure AD.

To get started, [download the app skeleton](https://github.com/AzureADQuickStarts/NativeClient-iOS/archive/skeleton.zip) or [download the completed sample](https://github.com/AzureADQuickStarts/NativeClient-iOS/archive/complete.zip).  You'll also need an Azure AD tenant in which you can create users and register an application.  If you don't already have a tenant, [learn how to get one](active-directory-howto-tenant.md).

## Step 1: Download and run either the .Net or Node.js REST API TODO Sample Server

This sample is written specifically to work against our existing sample for building a single tenant ToDo REST API for Microsoft Azure Active Directory. This is a pre-requisite for the Quick Start.

For information on how to set this up, visit our existing sample here:

* [Microsoft Azure Active Directory Sample REST API Service for Node.js](active-directory-devquickstarts-webapi-nodejs.md)

## Step 2: Register your Web API with your Microsoft Azure AD Tenant

**What am I doing?**

*Microsoft Active Directory supports adding two types of applications. Web APIs that offer services to users and applications (either on the web or an applicaiton running on a device) that access those Web APIs. In this step you are registering the Web API you are running locally for testing this sample. Normally this Web API would be a REST service that is offering functionaltiy you want an app to access. Microsoft Azure Active Directory can protect any endpoint!*

*Here we are assuming you are registering the TODO REST API referenced above, but this works for any Web API you'd want Azure Active Directory to protect.*

Steps to register a Web API with Microsoft Azure AD

1. Sign in to the [Azure management portal](https://manage.windowsazure.com).
2. Click on Active Directory in the left hand nav.
3. Click the directory tenant where you wish to register the sample application.
4. Click the Applications tab.
5. In the drawer, click Add.
6. Click "Add an application my organization is developing".
7. Enter a friendly name for the application, for example "TodoListService", select "Web Application and/or Web API", and click next.
8. For the sign-on URL, enter the base URL for the sample, which is by default `https://localhost:8080`.
9. For the App ID URI, enter `https://<your_tenant_name>/TodoListService`, replacing `<your_tenant_name>` with the name of your Azure AD tenant.  Click OK to complete the registration.
10. While still in the Azure portal, click the Configure tab of your application.
11. **Find the Client ID value and copy it aside**, you will need this later when configuring your application.

## Step 3: Register the sample iOS Native Client application

Registering your web application is the first step. Next, you'll need to tell Azure Active Directory about your application as well. This allows your application to communicate with the just registered Web API

**What am I doing?**  

*As stated above, Microsoft Azure Active Directory supports adding two types of applications. Web APIs that offer services to users and applications (either on the web or an applicaiton running on a device) that access those Web APIs. In this step you are registering the application in this sample. You must do that in order for this application to be able to request to access the Web API you just registered. Azure Active Directory will refuse to even allow your application to ask for sign-in unless it's registered! That's part of the security of the model.*

*Here we are assuming you are registering this sample application referenced above, but this works for any app you are developing.*

**Why am I putting both an application and a Web API in one tenant?**

*As you might have guessed, you could build an app that accesses an external API that is registered in Azure Active Directory from another tenant. If you do that, your customers will be prompted to consent to the use of the API in the application. The nice part is, Active Directory Authentication Library for iOS takes care of this consent for you! As we get in to more advanced features, you'll see this is an important part of the work needed to access the suite of Microsoft APIs from Azure and Office as well as any other service provider. For now, because you registered both your Web API and application under the same tenant you won't see any prompts for consent. This is usually the case if you are developing an application just for your own company to use.*

1. Sign in to the [Azure management portal](https://manage.windowsazure.com).
2. Click on Active Directory in the left hand nav.
3. Click the directory tenant where you wish to register the sample application.
4. Click the Applications tab.
5. In the drawer, click Add.
6. Click "Add an application my organization is developing".
7. Enter a friendly name for the application, for example "TodoListClient-iOS", select "Native Client Application", and click next.
8. For the Redirect URI, enter `http://TodoListClient`.  Click finish.
9. Click the Configure tab of the application.
10. Find the Client ID value and copy it aside, you will need this later when configuring your application.
11. In "Permissions to Other Applications", click "Add Application."  Select "Other" in the "Show" dropdown, and click the upper check mark.  Locate & click on the TodoListService, and click the bottom check mark to add the application.  Select "Access TodoListService" from the "Delegated Permissions" dropdown, and save the configuration.


## Step 4: Download the iOS Native Client Sample code

* `$ git clone git@github.com:AzureADSamples/NativeClient-iOS.git`

## Step 5: Download ADAL for iOS and add it to your XCode Workspace

#### Download the ADAL for iOS

* `git clone git@github.com:MSOpenTech/azure-activedirectory-library-for-ios.git`

#### Import the library in to your Workspace

In XCode, right mouse click on your project directory and select "Add files to iOS Sample"...

When you are prompted, select the directory where you cloned ADAL for iOS

#### Add the libADALiOS.a to your Linked Frameworks and libraries

Click the add button under "Linked Frameworks and Libraries" and add the library file from the imported frameworks.

Build the project to make sure everything compiles correctly.


## Step 6: Configure the settings.plist file with your Web API information

Under "Supporting Files"you will find a settings.plist file. It contains the following information:

```XML
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>authority</key>
	<string>https://login.windows.net/common/oauth2/token</string>
	<key>clientId</key>
	<string>xxxxxxx-xxxxxx-xxxxxxx-xxxxxxx</string>
	<key>resourceString</key>
	<string>https://localhost/todolistservice</string>
	<key>redirectUri</key>
	<string>http://demo_todolist_app</string>
	<key>userId</key>
	<string>user@domain.com</string>
	<key>taskWebAPI</key>
	<string>https://localhost/api/todolist/</string>
</dict>
</plist>
```

Replace the information in the plist file with your Web API settings.

##### NOTE

The current defaults are set up to work with our [Azure Active Directory Sample REST API Service for Node.js](https://github.com/AzureADSamples/WebAPI-Nodejs). You will need to specify the clientID of your Web API, however. If you are running your own API, you will need to update the endpoints as required.

## Step 7: Build and Run the application

You should be able to connect to the REST API endpoint and be prompted with the credentials from your Azure Active Directory account.

For additional resources, check out:
- [AzureADSamples on GitHub >>](https://github.com/AzureAdSamples)
- Azure AD documentation on [Azure.com >>](http://azure.microsoft.com/documentation/services/active-directory/)
