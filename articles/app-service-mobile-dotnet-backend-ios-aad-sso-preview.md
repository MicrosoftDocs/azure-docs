<properties urlDisplayName="Authenticate users of your Mobile app with Azure Active Directory Single Sign-On" 
pageTitle="Authenticate users of your iOS app with Azure Active Directory Single Sign-On" 
metaKeywords="" 
description="Learn how to log users into your iOS application with the Active Directory Authentication Library." 
metaCanonical="" disqusComments="1" umbracoNaviHide="1" documentationCenter="Mobile" 
title="Authenticate users of your iOS app with Azure Active Directory Single Sign-On" 
authors="mattchenderson" 
services="app-service-mobile" 
manager="dwrede" />

<tags ms.service="mobile-services"
ms.workload="mobile"
ms.tgt_pltfrm="mobile-ios" 
ms.devlang="objective-c" 
ms.topic="article" 
ms.date="02/20/2015" 
ms.author="mahender" />

# Authenticate users of your Mobile App with Active Directory Authentication Library Single Sign-On (iOS)

[WACOM.INCLUDE [app-services-mobile-apps-selector-aad-sso](../includes/app-services-mobile-apps-selector-aad-sso.md)]

In this tutorial, you add authentication to the quickstart project using the Active Directory Authentication Library.

To be able to authenticate users, you must register your application with your Azure Active Directory (AAD) tenant. This is done in two steps. First, you must register your mobile service and expose permissions on it. Second, you must register your iOS app and grant it access to those permissions.

This tutorial walks you through these basic steps:

1. [Register your mobile service with the Azure Active Directory]
2. [Register your app with the Azure Active Directory]
3. [Configure the mobile service to require authentication]
4. [Add authentication code to the client app]
5. [Test the client using authentication]

This tutorial requires the following:

* XCode 4.5 and iOS 6.0 (or later versions)
* Completion of the [Get started with Mobile Services] or [Get Started with Data] tutorial.
* Microsoft Azure Mobile Services SDK
* The [Active Directory Authentication Library for iOS]

## <a name="register-application"></a>Register your application with the Azure Active Directory

[WACOM.INCLUDE [app-services-mobile-apps-adal-register-app](../includes/app-services-mobile-apps-adal-register-app.md)]

## <a name="require-authentication"></a>Configure the mobile service to require authentication

[AZURE.INCLUDE [app-services-mobile-apps-restrict-permissions-dotnet-backend](../includes/app-services-mobile-apps-restrict-permissions-dotnet-backend.md)] 

## <a name="add-authentication-code"></a>Add authentication code to the client app

1. Download the [Active Directory Authentication Library for iOS] and include it in your project. Be sure to also add the storyboards from the ADAL source.

2. In the QSTodoListViewController, include ADAL with the following:

        #import "ADALiOS/ADAuthenticationContext.h"

3. Then add the following method:

        - (void) loginAndGetData
        {
            MSClient *client = self.todoService.client;
            if (client.currentUser != nil) {
                return;
            }

            NSString *authority = @"<INSERT-AUTHORITY-HERE>";
            NSString *resourceURI = @"<INSERT-RESOURCE-URI-HERE>";
            NSString *clientID = @"<INSERT-CLIENT-ID-HERE>";
            NSString *redirectURI = @"<INSERT-REDIRECT-URI-HERE>";

            ADAuthenticationError *error;
            ADAuthenticationContext *authContext = [ADAuthenticationContext authenticationContextWithAuthority:authority error:&error];
            NSURL *redirectUri = [[NSURL alloc]initWithString:redirectURI];

            [authContext acquireTokenWithResource:resourceURI clientId:clientID redirectUri:redirectUri completionBlock:^(ADAuthenticationResult *result) {
                if (result.tokenCacheStoreItem == nil)
                {
                    return;
                }
                else
                {
                    NSDictionary *payload = @{
                        @"access_token" : result.tokenCacheStoreItem.accessToken
                    };
                    [client loginWithProvider:@"windowsazureactivedirectory" token:payload completion:^(MSUser *user, NSError *error) {
                        [self refresh];
                    }];
                }
            }];
        }

4. In the code for the `loginAndGetData` method above, replace **INSERT-AUTHORITY-HERE** with the name of the tenant in which you provisioned your application, the format should be https://login.windows.net/tenant-name.onmicrosoft.com. This value can be copied out of the Domain tab in your Azure Active Directory in the [Azure Management Portal].

5. In the code for the `loginAndGetData` method above, replace **INSERT-RESOURCE-URI-HERE** with the **App ID URI** for your mobile service. If you followed the [How to Register with the Azure Active Directory] topic your App ID URI should be similar to https://todolist.azure-mobile.net/login/aad.

6. In the code for the `loginAndGetData` method above, replace **INSERT-CLIENT-ID-HERE** with the client ID you copied from the native client application.

7. In the code for the `loginAndGetData` method above, replace **INSERT-REDIRECT-URI-HERE** with the /login/done endpoint for your mobile service. This should be similar to https://todolist.azure-mobile.net/login/done.

8. In the QSTodoListViewController, modify `ViewDidLoad` by replacing `[self refresh]` with the following:

        [self loginAndGetData];

## <a name="test-client"></a>Test the client using authentication

1. From the Product menu, click Run to start the app
2. You will receive a prompt to login against your Azure Active Directory.  
3. The app authenticates and returns the todo items.

<!-- Anchors. -->
[Register your mobile service with the Azure Active Directory]: #register-mobile-service-aad
[Register your app with the Azure Active Directory]: #register-app-aad
[Configure the mobile service to require authentication]: #require-authentication
[Add authentication code to the client app]: #add-authentication-code
[Test the client using authentication]: #test-client

<!-- URLs. -->
[Get started with data]: /en-us/documentation/articles/mobile-services-ios-get-started-data/
[Get started with Mobile Services]: /en-us/documentation/articles/mobile-services-dotnet-backend-ios-get-started/
[How to Register with the Azure Active Directory]: /en-us/documentation/articles/mobile-services-how-to-register-active-directory-authentication/
[Azure Management Portal]: https://manage.windowsazure.com/
[Active Directory Authentication Library for iOS]: https://github.com/MSOpenTech/azure-activedirectory-library-for-ios
 