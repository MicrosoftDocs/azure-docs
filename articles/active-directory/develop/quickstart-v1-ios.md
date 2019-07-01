---
title: Build an iOS app that integrates with Azure AD for sign-in and calls protected APis using OAuth 2.0 | Microsoft Docs
description: Learn how to sign in users and call the Microsoft Graph API from my iOS app.
services: active-directory
documentationcenter: ios
author: rwike77
manager: CelesteDG
editor: ''

ms.assetid: 42303177-9566-48ed-8abb-279fcf1e6ddb
ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.tgt_pltfrm: mobile-ios
ms.devlang: objective-c
ms.topic: quickstart
ms.date: 05/21/2019
ms.author: ryanwi
ms.custom: aaddev
ms.reviewer: brandwe
#Customer intent: As an application developer, I want to know how to sign in users and call the Microsoft Graph API from my iOS app.
ms.collection: M365-identity-device-management
---

# Quickstart: Sign in users and call the Microsoft Graph API from an iOS app

[!INCLUDE [active-directory-develop-applies-v1-adal](../../../includes/active-directory-develop-applies-v1-adal.md)]

Azure Active Directory (Azure AD) provides the Active Directory Authentication Library (ADAL) for iOS clients that need to access protected resources. ADAL simplifies the process that your app uses to get access tokens. 

In this quickstart, you'll build an Objective C To-Do List application that:

* Gets access tokens for calling the Azure AD Graph API by using the OAuth 2.0 authentication protocol
* Searches a directory for users with a given alias

To build the complete, working application, you'll need to:

1. Register your application with Azure AD.
1. Install and configure ADAL.
1. Use ADAL to get tokens from Azure AD.

## Prerequisites

To get started, complete these prerequisites:

* [Download the app skeleton](https://github.com/AzureADQuickStarts/NativeClient-iOS/archive/skeleton.zip) or [download the completed sample](https://github.com/AzureADQuickStarts/NativeClient-iOS/archive/complete.zip).
* Have an Azure AD tenant in which you can create users and register an application. If you don't already have a tenant, [learn how to get one](quickstart-create-new-tenant.md).

> [!TIP]
> Try the [developer portal](https://identity.microsoft.com/Docs/iOS) to get up and running with Azure AD in just a few minutes. The developer portal guides you through the process of registering an app and integrating Azure AD into your code. When you’re finished, you'll have a simple application that can authenticate users in your tenant, and a back end that can accept tokens and perform validation.

## Step 1: Determine what your redirect URI is for iOS

To securely start your applications in certain SSO scenarios, you must create a *redirect URI* in a particular format. A redirect URI is used to make sure that the tokens return to the correct application that asked for them.

The iOS format for a redirect URI is:

```
<app-scheme>://<bundle-id>
```

* **app-scheme** - Is registered in your XCode project and is how other applications can call you. You can find app-scheme under **Info.plist > URL types > URL Identifier**. Create an app-scheme if you don't already have one or more configured.
* **bundle-id** - Is the Bundle Identifier found under **identity** in your XCode project settings.

An example for this quickstart code:

***msquickstart://com.microsoft.azureactivedirectory.samples.graph.QuickStart***

## Step 2: Register the DirectorySearcher application

To set up your app to get tokens, you need to register the app in your Azure AD tenant and grant it permission to access the Azure AD Graph API.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. On the top bar, select your account. Under the **Directory** list, choose the Active Directory tenant where you want to register your application.
3. Select **All services** in the leftmost navigation pane, and then select **Azure Active Directory**.
4. Select **App registrations**, and then select **New registration**.
5. Follow the prompts to create a new client application.
    * **Name** is the application name and describes your application to end users.
    * **Redirect URI** is a scheme and string combination that Azure AD uses to return token responses. Enter a value that is specific to your application and is based on the previous redirect URI information. Also select **Public client (mobile and desktop)** from the dropdown.
6. After you've completed the registration, Azure AD assigns your app a unique application ID. You'll need this value in the next sections, so copy it from the application tab.
7. From the **API permissions** page, select **Add a permission**. Inside **Select an API** select ***Microsoft Graph***.
8. Under **Delegated permissions**, select the permission **User.Read**, then hit **Add** to save. This permission sets up your application to query the Azure AD Graph API for users.

## Step 3: Install and configure ADAL

Now that you have an application in Azure AD, you can install ADAL and write your identity-related code. For ADAL to communicate with Azure AD, you need to provide it with some information about your app registration.

1. Begin by adding ADAL to the DirectorySearcher project by using CocoaPods.

    ```
    $ vi Podfile
    ```
1. Add the following to this podfile:

    ```
    source 'https://github.com/CocoaPods/Specs.git'
    link_with ['QuickStart']
    xcodeproj 'QuickStart'

    pod 'ADAL'
    ```

1. Load the podfile by using CocoaPods. This step creates a new XCode workspace that you load.

    ```
    $ pod install
    ...
    $ open QuickStart.xcworkspace
    ```

1. In the QuickStart project, open the plist file `settings.plist`.
1. Replace the values of the elements in the section to use the same values that you entered in the Azure portal. Your code references these values whenever it uses ADAL.
    * `tenant` is the domain of your Azure AD tenant, for example, contoso.onmicrosoft.com.
    * `clientId` is the client ID of your application that you copied from the portal.
    * `redirectUri` is the redirect URL that you registered in the portal.

## Step 4: Use ADAL to get tokens from Azure AD

The basic principle behind ADAL is that whenever your app needs an access token, it simply calls a completionBlock `+(void) getToken :`, and ADAL does the rest.

1. In the `QuickStart` project, open `GraphAPICaller.m` and locate the `// TODO: getToken for generic Web API flows. Returns a token with no additional parameters provided.` comment near the top.

    This is where you pass ADAL the coordinates through a CompletionBlock, to communicate with Azure AD, and tell it how to cache tokens.

    ```ObjC
    +(void) getToken : (BOOL) clearCache
               parent:(UIViewController*) parent
    completionHandler:(void (^) (NSString*, NSError*))completionBlock;
    {
        AppData* data = [AppData getInstance];
        if(data.userItem){
            completionBlock(data.userItem.accessToken, nil);
            return;
        }

        ADAuthenticationError *error;
        authContext = [ADAuthenticationContext authenticationContextWithAuthority:data.authority error:&error];
        authContext.parentController = parent;
        NSURL *redirectUri = [[NSURL alloc]initWithString:data.redirectUriString];

        [ADAuthenticationSettings sharedInstance].enableFullScreen = YES;
        [authContext acquireTokenWithResource:data.resourceId
                                     clientId:data.clientId
                                  redirectUri:redirectUri
                               promptBehavior:AD_PROMPT_AUTO
                                       userId:data.userItem.userInformation.userId
                        extraQueryParameters: @"nux=1" // if this strikes you as strange it was legacy to display the correct mobile UX. You most likely won't need it in your code.
                             completionBlock:^(ADAuthenticationResult *result) {

                                  if (result.status != AD_SUCCEEDED)
                                  {
                                     completionBlock(nil, result.error);
                                  }
                                  else
                                  {
                                      data.userItem = result.tokenCacheStoreItem;
                                      completionBlock(result.tokenCacheStoreItem.accessToken, nil);
                                  }
                             }];
    }

    ```

2. You need to use this token to search for users in the graph. Find the `// TODO: implement SearchUsersList` comment. This method makes a GET request to the Azure AD Graph API to query for users whose UPN begins with the given search term. 

    To query the Azure AD Graph API, you need to include an access_token in the `Authorization` header of the request. This is where ADAL comes in.

    ```ObjC
    +(void) searchUserList:(NSString*)searchString
                    parent:(UIViewController*) parent
          completionBlock:(void (^) (NSMutableArray* Users, NSError* error)) completionBlock
    {
        if (!loadedApplicationSettings)
       {
            [self readApplicationSettings];
        }
        
        AppData* data = [AppData getInstance];

        NSString *graphURL = [NSString stringWithFormat:@"%@%@/users?api-version=%@&$filter=startswith(userPrincipalName, '%@')", data.taskWebApiUrlString, data.tenant, data.apiversion, searchString];

        [self craftRequest:[self.class trimString:graphURL]
                    parent:parent
         completionHandler:^(NSMutableURLRequest *request, NSError *error) {

             if (error != nil)
             {
                 completionBlock(nil, error);
             }
             else
             {

                 NSOperationQueue *queue = [[NSOperationQueue alloc]init];

                 [NSURLConnection sendAsynchronousRequest:request queue:queue completionHandler:^(NSURLResponse *response, NSData *data, NSError *error) {

                     if (error == nil && data != nil){

                         NSDictionary *dataReturned = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];

                         // We can grab the JSON node at the top to get our graph data.
                         NSArray *graphDataArray = [dataReturned objectForKey:@"value"];

                         // Don't be thrown off by the key name being "value". It really is the name of the
                         // first node. :-)

                         // Each object is a key value pair
                         NSDictionary *keyValuePairs;
                         NSMutableArray* Users = [[NSMutableArray alloc]init];

                         for(int i =0; i < graphDataArray.count; i++)
                         {
                             keyValuePairs = [graphDataArray objectAtIndex:i];

                             User *s = [[User alloc]init];
                             s.upn = [keyValuePairs valueForKey:@"userPrincipalName"];
                             s.name =[keyValuePairs valueForKey:@"givenName"];

                             [Users addObject:s];
                         }

                         completionBlock(Users, nil);
                     }
                     else
                     {
                         completionBlock(nil, error);
                     }

                }];
             }
         }];

    }

    ```

3. When your app requests a token by calling `getToken(...)`, ADAL attempts to return a token without asking the user for credentials. If ADAL determines that the user needs to sign in to get a token, it will display a dialog box for sign-in, collect the user's credentials, and then return a token after successful authentication. If ADAL is not able to return a token for any reason, it throws an `AdalException`.

> [!NOTE]
> The `AuthenticationResult` object contains a `tokenCacheStoreItem` object that you can use to collect the information that your app may need. In the QuickStart, `tokenCacheStoreItem` is used to determine if authentication is already done.

## Step 5: Build and run the application

Congratulations! You now have a working iOS application that can authenticate users, securely call Web APIs by using OAuth 2.0, and get basic information about the user.

If you haven't already, now is the time to populate your tenant with some users.

1. Start your QuickStart app, and then sign in with one of those users.
1. Search for other users based on their UPN.
1. Close the app, and then start it again. Notice that the user's session remains intact.

ADAL makes it easy to incorporate all of these common identity features into your application. It takes care of all the dirty work for you, like cache management, OAuth protocol support, presenting the user with a UI to sign in, and refreshing expired tokens. All you really need to know is a single API call, `getToken`.

For reference, the completed sample (without your configuration values) is provided on [GitHub](https://github.com/AzureADQuickStarts/NativeClient-iOS/archive/complete.zip).

## Next steps

You can now move on to additional scenarios. We suggest trying these next:

* [Secure a Node.JS Web API with Azure AD](quickstart-v1-nodejs-webapi.md)
* Learn [how to enable cross-app SSO on iOS using ADAL](howto-v1-enable-sso-ios.md)  
