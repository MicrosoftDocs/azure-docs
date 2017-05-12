---
title: Integrate Azure AD into an iOS app | Microsoft Docs
description: How to build an iOS application that integrates with Azure AD for sign-in and calls Azure AD protected APIs by using OAuth.
services: active-directory
documentationcenter: ios
author: xerners
manager: mbaldwin
editor: ''

ms.assetid: 42303177-9566-48ed-8abb-279fcf1e6ddb
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: mobile-ios
ms.devlang: objective-c
ms.topic: article
ms.date: 01/07/2017
ms.author: xerners

---
# Integrate Azure AD into an iOS app
[!INCLUDE [active-directory-devquickstarts-switcher](../../../includes/active-directory-devquickstarts-switcher.md)]

> [!TIP]
> Try the preview of our new [developer portal](https://identity.microsoft.com/Docs/iOS) that helps you get up and running with Azure Active Directory in just a few minutes!  The developer portal guides you through the process of registering an app and integrating Azure AD into your code.  When you’re finished, you'll have a simple application that can authenticate users in your tenant and a backend that can accept tokens and perform validation. 
> 
> 

Azure Active Directory (Azure AD) provides the Active Directory Authentication Library, or ADAL, for iOS clients that need to access protected resources. ADAL simplifies the process that your app uses to obtain access tokens. To demonstrate how easy it is, in this article we build an Objective C To-Do List application that:

* Gets access tokens for calling the Azure AD Graph API by using the [OAuth 2.0 authentication protocol](https://msdn.microsoft.com/library/azure/dn645545.aspx).
* Searches a directory for users with a given alias.

To build the complete working application, you need to:

1. Register your application with Azure AD.
2. Install and configure ADAL.
3. Use ADAL to get tokens from Azure AD.

To get started, [download the app skeleton](https://github.com/AzureADQuickStarts/NativeClient-iOS/archive/skeleton.zip) or [download the completed sample](https://github.com/AzureADQuickStarts/NativeClient-iOS/archive/complete.zip). You also need an Azure AD tenant in which you can create users and register an application. If you don't already have a tenant, [learn how to get one](active-directory-howto-tenant.md).


> [!TIP]
> Try the preview of our new [developer portal](https://identity.microsoft.com/Docs/iOS) that helps you get up and running with Azure AD in just a few minutes. The developer portal guides you through the process of registering an app and integrating Azure AD into your code. When you’re finished, you'll have a simple application that can authenticate users in your tenant, and a back end that can accept tokens and perform validation. 
> 
> 

## 1. Determine what your redirect URI is for iOS
To securely start your applications in certain SSO scenarios, you must create a *redirect URI* in a particular format. A redirect URI is used to ensure that the tokens return to the correct application that asked for them.


The iOS format for a redirect URI is:

```
<app-scheme>://<bundle-id>
```

* **aap-scheme**: This is registered in your XCode project. It is how other applications can call you. You can find this in the XCode project at **Info.plist** > **URL types** > **URL Identifier**. You should create one if you don't already have one or more configured.
* **bundle-id**: This is the Bundle Identifier that is found under **identity** in your project settings in XCode.

An example for this QuickStart code: ***msquickstart://com.microsoft.azureactivedirectory.samples.graph.QuickStart***

## 2. Register the DirectorySearcher application
To set up your app to get tokens, you first need to register it in your Azure AD tenant and grant it permission to access the Azure AD Graph API:

1. Sign in to the [Azure portal](https://portal.azure.com).
2. On the top bar, click your account. Under the **Directory** list, choose the Active Directory tenant where you want to register your application.
3. Click **More Services** in the leftmost navigation pane, and then select **Azure Active Directory**.
4. Click **App registrations**, and then select **Add**.
5. Follow the prompts to create a new **Native Client Application**.
  * The **Name** of the application describes your application to end users.
  * The **Redirect Uri** is a scheme and string combination that Azure AD uses to return token responses.  Enter a value that is specific to your application and is based on the previous redirect URI information.
6. After you've completed the registration, Azure AD assigns your app a unique application ID.  You'll need this value in the next sections, so copy it from the application tab.
7. From the **Settings** page, select **Required Permissions** and then select **Add**. Select **Microsoft Graph** as the API, and then add the **Read Directory Data** permission under **Delegated Permissions**.  This sets up your application to query the Azure AD Graph API for users.

## 3. Install and configure ADAL
Now that you have an application in Azure AD, you can install ADAL and write your identity-related code.  For ADAL to communicate with Azure AD, you need to provide it with some information about your app registration.

1. Begin by adding ADAL to the DirectorySearcher project by using CocoaPods.

    ```
    $ vi Podfile
    ```
2. Add the following to this podfile:

    ```
    source 'https://github.com/CocoaPods/Specs.git'
    link_with ['QuickStart']
    xcodeproj 'QuickStart'

    pod 'ADALiOS'
    ```

3. Now load the podfile by using CocoaPods. This step creates a new XCode workspace that you load.

    ```
    $ pod install
    ...
    $ open QuickStart.xcworkspace
    ```

4. In the QuickStart project, open the plist file `settings.plist`.  Replace the values of the elements in the section to reflect the values that you entered in the Azure portal. Your code references these values whenever it uses ADAL.
  * The `tenant` is the domain of your Azure AD tenant, for example, contoso.onmicrosoft.com.
  * The `clientId` is the client ID of your application that you copied from the portal.
  * The `redirectUri` is the redirect URL that you registered in the portal.

## 4.    Use ADAL to get tokens from Azure AD
The basic principle behind ADAL is that whenever your app needs an access token, it simply calls a completionBlock `+(void) getToken : `, and ADAL does the rest.  

1. In the `QuickStart` project, open `GraphAPICaller.m` and locate the `// TODO: getToken for generic Web API flows. Returns a token with no additional parameters provided.` comment near the top.  This is where you pass ADAL the coordinates through a CompletionBlock, to communicate with Azure AD, and tell it how to cache tokens.

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

2. Now we need to use this token to search for users in the graph. Find the `// TODO: implement SearchUsersList` comment. This method makes a GET request to the Azure AD Graph API to query for users whose UPN begins with the given search term.  To query the Azure AD Graph API, you need to include an access_token in the `Authorization` header of the request. This is where ADAL comes in.

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


3. When your app requests a token by calling `getToken(...)`, ADAL attempts to return a token without asking the user for credentials.  If ADAL determines that the user needs to sign in to get a token, it will display a dialog box for sign-in, collect the user's credentials, and then return a token after successful authentication.  If ADAL is not able to return a token for any reason, it throws an `AdalException`.

> [!Note] 
> The `AuthenticationResult` object contains a `tokenCacheStoreItem` object that can be used to collect the information that your app may need. In the QuickStart, `tokenCacheStoreItem` is used to determine if authentication is already done.
>
>

## 5. Build and run the application
Congratulations! You now have a working iOS application that can authenticate users, securely call Web APIs by using OAuth 2.0, and get basic information about the user.  If you haven't already, now is the time to populate your tenant with some users.  Start your QuickStart app, and then sign in with one of those users.  Search for other users based on their UPN.  Close the app, and then start it again.  Notice that the user's session remains intact.

ADAL makes it easy to incorporate all of these common identity features into your application.  It takes care of all the dirty work for you, like cache management, OAuth protocol support, presenting the user with a UI to sign in, and refreshing expired tokens.  All you really need to know is a single API call, `getToken`.

For reference, the completed sample (without your configuration values) is provided on [GitHub](https://github.com/AzureADQuickStarts/NativeClient-iOS/archive/complete.zip).  

## Next steps
You can now move on to additional scenarios.  You may want to try:

* [Secure a Node.JS Web API with Azure AD](active-directory-devquickstarts-webapi-nodejs.md)
* Learn [how to enable cross-app SSO on iOS using ADAL](active-directory-sso-ios.md)  

[!INCLUDE [active-directory-devquickstarts-additional-resources](../../../includes/active-directory-devquickstarts-additional-resources.md)]

