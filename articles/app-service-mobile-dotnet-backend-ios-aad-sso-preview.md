<properties 
        pageTitle="Authenticate users of your iOS app with Azure Active Directory Single Sign-On" 
        description="Learn how to log users into your iOS application with the Active Directory Authentication Library." 
        documentationCenter="Mobile" 
        authors="mattchenderson" 
        services="app-service\mobile" 
        manager="dwrede" />

<tags ms.service="app-service"
ms.workload="mobile"
ms.tgt_pltfrm="mobile-ios" 
ms.devlang="objective-c" 
ms.topic="article" 
ms.date="02/20/2015" 
ms.author="mahender" />

# Add Azure Active Directory single sign-on to your iOS app

[AZURE.INCLUDE [app-service-mobile-selector-aad-sso](../includes/app-service-mobile-selector-aad-sso.md)]

In this tutorial, you add authentication to the quickstart project using the Active Directory Authentication Library.

To be able to authenticate users, you must register your application with your Azure Active Directory (AAD) tenant. This is done in two steps. First, you must register your App Service and expose permissions on it. Second, you must register your iOS app and grant it access to those permissions.

This tutorial requires the following:

* XCode 4.5 and iOS 6.0 (or later versions)
* Completion of the [Get started with Mobile Apps] tutorial.
* Microsoft Azure Mobile Services SDK
* The [Active Directory Authentication Library for iOS]

## <a name="register-application"></a>Register your application with the Azure Active Directory

[AZURE.INCLUDE [app-service-mobile-adal-register-app](../includes/app-service-mobile-adal-register-app.md)]

## <a name="require-authentication"></a>Configure the application to require authentication

[AZURE.INCLUDE [app-service-mobile-restrict-permissions-dotnet-backend](../includes/app-service-mobile-restrict-permissions-dotnet-backend.md)] 

## <a name="add-adal"></a>Add a reference to the Active Directory Authentication Library

1. Download the [Active Directory Authentication Library for iOS].

2. In Xcode Navigator, select your project and click **File** and choose **Add Files to...**. Navigate to where you downloaded the library and select **ADALiOS.xcodeproj**.

3. Select your project again and open the **Build Settings** tab. Navigate to the **Linking** section and add `-ObjC` to **Other Linker Flags**.

4. Select the **Build Phases** tab. Under **Target Dependencies**, add `ADALiOS`.

5. Under **Link Binary With Libraries**, add `libADALiOS.a`.

You will now be able to reference the Active Directory Authentication Library in your project.

## <a name="add-authentication-code"></a>Add authentication code to the client app

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

5. In the code for the `loginAndGetData` method above, replace **INSERT-RESOURCE-URI-HERE** with the **App ID URI** for your Mobile App. If you followed the [How to configure your Mobile App with Azure Active Directory] topic your App ID URI should be similar to https://contosogateway.azurewebsites.net/login/aad.

6. In the code for the `loginAndGetData` method above, replace **INSERT-CLIENT-ID-HERE** with the client ID you copied from the native client application.

7. In the code for the `loginAndGetData` method above, replace **INSERT-REDIRECT-URI-HERE** with the /login/done endpoint for your App Service Gateway. This should be similar to https://contosogateway.azurewebsites.net/login/done.

8. In the QSTodoListViewController, modify `viewDidLoad` by replacing `[self refresh]` with the following:

        [self loginAndGetData];

## <a name="test-client"></a>Test the client using authentication

1. From the Product menu, click Run to start the app
2. You will receive a prompt to login against your Azure Active Directory.  
3. The app authenticates and returns the todo items.

<!-- URLs. -->
[How to configure your Mobile App with Azure Active Directory]: app-service-mobile-how-to-configure-active-directory-authentication-preview.md
[Azure Management Portal]: https://manage.windowsazure.com/
[Active Directory Authentication Library for iOS]: https://github.com/MSOpenTech/azure-activedirectory-library-for-ios
 [Get started with Mobile Apps]: app-service-mobile-dotnet-backend-ios-get-started-preview.md
