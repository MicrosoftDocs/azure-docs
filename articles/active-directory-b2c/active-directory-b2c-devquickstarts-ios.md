<properties
	pageTitle="Azure Active Directory B2C Preview: Call a web API from an iOS application | Microsoft Azure"
	description="This article will show you how to create an iOS 'to-do list' app that calls a Node.js web API by using OAuth 2.0 bearer tokens. Both the iOS app and the web API use Azure Active Directory B2C to manage user identities and authenticate users."
	services="active-directory-b2c"
	documentationCenter="ios"
	authors="brandwe"
	manager="mbaldwin"
	editor=""/>

<tags
	ms.service="active-directory-b2c"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="objectivec"
	ms.topic="hero-article"

	ms.date="07/22/2016"
	ms.author="brandwe"/>

# Azure AD B2C Preview: Call a web API from an iOS application

<!-- TODO [AZURE.INCLUDE [active-directory-b2c-devquickstarts-web-switcher](../../includes/active-directory-b2c-devquickstarts-web-switcher.md)]-->

By using Azure Active Directory (Azure AD) B2C, you can add powerful self-service identity management features to your iOS apps and web APIs in a few short steps. This article shows you how to create an iOS "to-do list" app that calls a Node.js web API by using OAuth 2.0 bearer tokens. Both the iOS app and the web API use Azure AD B2C to manage user identities and authenticate users.

> [AZURE.NOTE]
	To work fully, this Quickstart requires that you already have a web API protected by Azure AD B2C. We have built one for both .NET and Node.js that you can use. This walk-through assumes that the Node.js web API sample is configured. Refer to the [Azure Active Directory web API for Node.js sample](active-directory-b2c-devquickstarts-api-node.md) for more.
).

> [AZURE.NOTE]
	This article does not cover how to implement sign-in, sign-up and profile management by using Azure AD B2C. It focuses on calling web APIs after the user is authenticated. If you haven't already, you should start with the [.NET web app get started tutorial](active-directory-b2c-devquickstarts-web-dotnet.md) to learn about the basics of Azure AD B2C.

## Get an Azure AD B2C directory

Before you can use Azure AD B2C, you must create a directory, or tenant. A directory is a container for all of your users, apps, groups, and more. If you don't have one already, [create a B2C directory](active-directory-b2c-get-started.md) before you continue.

## Create an application

Next, you need to create an app in your B2C directory. This gives Azure AD information that it needs to communicate securely with your app. Both the app and the web API are represented by a single **Application ID** in this case, because they comprise one logical app. To create an app, follow [these instructions](active-directory-b2c-app-registration.md). Be sure to:

- Include a **web app/web API** in the application.
- Enter `http://localhost:3000/auth/openid/return` as a **Reply URL**. It is the default URL for this code sample.
- Create an **Application secret** for your application and copy it. You will need it later.
- Copy the **Application ID** that is assigned to your app. You will also need this later.

[AZURE.INCLUDE [active-directory-b2c-devquickstarts-v2-apps](../../includes/active-directory-b2c-devquickstarts-v2-apps.md)]

## Create your policies

In Azure AD B2C, every user experience is defined by a [policy](active-directory-b2c-reference-policies.md). This app contains three
identity experiences: sign up, sign in, and sign in by using Facebook. You need to create one policy of each type, as described in the
[policy reference article](active-directory-b2c-reference-policies.md#how-to-create-a-sign-up-policy). When you create the three policies, be sure to:

- Choose the **Display name** and sign-up attributes in your sign-up policy.
- Choose the **Display name** and **Object ID** application claims in every policy. You can choose other claims as well.
- Copy the **Name** of each policy after you create it. It should have the prefix `b2c_1_`.  You'll need these policy names later.

[AZURE.INCLUDE [active-directory-b2c-devquickstarts-policy](../../includes/active-directory-b2c-devquickstarts-policy.md)]

After you have created your three policies, you're ready to build your app.

Note that this article does not cover how to use the policies that you just created. To learn about how policies work in Azure AD B2C, start with the [.NET web app getting started tutorial](active-directory-b2c-devquickstarts-web-dotnet.md).

## Download the code

The code for this tutorial [is maintained on GitHub](https://github.com/AzureADQuickStarts/B2C-NativeClient-iOS). To build the sample as you go, you can [download the skeleton project as a .zip file](https://github.com/AzureADQuickStarts/B2C-NativeClient-iOS/archive/skeleton.zip). You can also clone the skeleton:

```
git clone --branch skeleton https://github.com/AzureADQuickStarts/B2C-NativeClient-iOS.git
```

> [AZURE.NOTE] **You must download the skeleton to complete this tutorial.** Because of the complexity of implementing a fully functioning application on iOS, the **skeleton** has UX code that will run after you have completed the tutorial. This is a time-saving measure for the developer. The UX code is not germane to the topic of how to add B2C to an iOS application.

The completed app is also [available as a .zip file](https://github.com/AzureADQuickStarts/B2C-NativeClient-iOS/archive/complete.zip) or on the `complete` branch of the same repo.

Next, load `podfile` by using CocoaPods. This will create a new Xcode workspace that you will load. If you don't have CocoaPods, [visit the website to set it up](https://cocoapods.org).

```
$ pod install
...
$ open Microsoft Tasks for Consumers.xcworkspace
```

## Configure the iOS task application

To get the iOS task app to communicate with Azure AD B2C, you need to provide a few common parameters. In the `Microsoft Tasks` folder, open the `settings.plist` file in the root of the project and replace the values in the `<dict>` section. These values will be used throughout the app.

```
<dict>
	<key>authority</key>
	<string>https://login.microsoftonline.com/<your tenant name>.onmicrosoft.com/</string>
	<key>clientId</key>
	<string><Enter the Application Id assigned to your app by the Azure portal, e.g.580e250c-8f26-49d0-bee8-1c078add1609></string>
	<key>scopes</key>
	<array>
		<string><Enter the Application Id assigned to your app by the Azure portal, e.g.580e250c-8f26-49d0-bee8-1c078add1609></string>
	</array>
	<key>additionalScopes</key>
	<array>
	</array>
	<key>redirectUri</key>
	<string>urn:ietf:wg:oauth:2.0:oob</string>
	<key>taskWebAPI</key>
	<string>http://localhost/tasks:3000</string>
	<key>emailSignUpPolicyId</key>
	<string><Enter your sign up policy name, e.g.g b2c_1_sign_up></string>
	<key>faceBookSignInPolicyId</key>
	<string><your sign in policy for FB></string>
	<key>emailSignInPolicyId</key>
	<string><Enter your sign in policy name, e.g. b2c_1_sign_in></string>
	<key>fullScreen</key>
	<false/>
	<key>showClaims</key>
	<true/>
</dict>
</plist>
```

[AZURE.INCLUDE [active-directory-b2c-devquickstarts-tenant-name](../../includes/active-directory-b2c-devquickstarts-tenant-name.md)]

## Get access tokens and call the task API

This section discusses how you can complete an OAuth 2.0 token exchange in a web app by using Microsoft's libraries and frameworks. If you are unfamiliar with authorization codes and access tokens, you can learn more in the [OAuth 2.0 protocol reference](active-directory-b2c-reference-protocols.md).

### Create header files by using methods

You will need methods to get a token with your selected policy and then call your task server. Set up these now.

Create a file called `samplesWebAPIConnector.h` under `/Microsoft Tasks` in your Xcode project

Add the following code to define what you need to do:

```
#import <Foundation/Foundation.h>
#import "samplesTaskItem.h"
#import "samplesPolicyData.h"
#import "ADALiOS/ADAuthenticationContext.h"

@interface samplesWebAPIConnector : NSObject<NSURLConnectionDataDelegate>

+(void) getTaskList:(void (^) (NSArray*, NSError* error))completionBlock
             parent:(UIViewController*) parent;

+(void) addTask:(samplesTaskItem*)task
         parent:(UIViewController*) parent
completionBlock:(void (^) (bool, NSError* error)) completionBlock;

+(void) deleteTask:(samplesTaskItem*)task
            parent:(UIViewController*) parent
   completionBlock:(void (^) (bool, NSError* error)) completionBlock;

+(void) doPolicy:(samplesPolicyData*)policy
         parent:(UIViewController*) parent
completionBlock:(void (^) (ADProfileInfo* userInfo, NSError* error)) completionBlock;

+(void) signOut;

@end
```

These are simple create, read, update and delete (CRUD) operations on your API, as well as a method `doPolicy`. By using this method, you can get a token with the policy you want.

Notice that two other header files need to be defined. These will hold your task item and policy data. Create those now:

Create the file `samplesTaskItem.h` with the following code:

```
#import <Foundation/Foundation.h>

@interface samplesTaskItem : NSObject

@property NSString *itemName;
@property NSString *ownerName;
@property BOOL completed;
@property (readonly) NSDate *creationDate;

@end
```

Also create the file `samplesPolicyData.h` to hold your policy data:

```
#import <Foundation/Foundation.h>

@interface samplesPolicyData : NSObject

@property (strong) NSString* policyName;
@property (strong) NSString* policyID;

+(id) getInstance;

@end
```
### Add an implementation for your task and policy items

Now that your header files are in place, you can write code to store the data that you will use for your sample.

Create the file `samplesPolicyData.m` with the following code:

```
#import <Foundation/Foundation.h>
#import "samplesPolicyData.h"

@implementation samplesPolicyData

+(id) getInstance
{
    static samplesPolicyData *instance = nil;
    static dispatch_once_t onceToken;

    dispatch_once(&onceToken, ^{
        instance = [[self alloc] init];
        NSDictionary *dictionary = [NSDictionary dictionaryWithContentsOfFile:[[NSBundle mainBundle] pathForResource:@"settings" ofType:@"plist"]];
        instance.policyName = [dictionary objectForKey:@"policyName"];
        instance.policyID = [dictionary objectForKey:@"policyID"];


    });

    return instance;
}


@end
```

### Write setup code for your call to ADAL for iOS

The quick code to store your objects for the UI is now complete. Next, you need to write code to access the Active Directory Authentication Library (ADAL) for iOS by using the parameters you put in `settings.plist`. This will get an access token to provide to your task server.

All of your work will be done in `samplesWebAPIConnector.m`.

First, create the `doPolicy()` implementation that you wrote in your `samplesWebAPIConnector.h` header file:

```
+(void) doPolicy:(samplesPolicyData *)policy
         parent:(UIViewController*) parent
completionBlock:(void (^) (ADProfileInfo* userInfo, NSError* error)) completionBlock
{
    if (!loadedApplicationSettings)
    {
        [self readApplicationSettings];
    }

    [self getClaimsWithPolicyClearingCache:NO policy:policy params:nil parent:parent completionHandler:^(ADProfileInfo* userInfo, NSError* error) {

        if (userInfo == nil)
        {
            completionBlock(nil, error);
        }

        else {

            completionBlock(userInfo, nil);
        }
    }];

}


```

The method is simple. It takes as inputs the `samplesPolicyData` object you created, the parent `ViewController`, and a callback. The callback is interesting, and we'll take a closer look at it.

- Note that `completionBlock` has `ADProfileInfo` as a type that will be returned by using a `userInfo` object. `ADProfileInfo` is the type that holds all of the responses from the server, including claims.
- Also note `readApplicationSettings`. This reads the data that you provided in `settings.plist`.
- Finally, you have a large `getClaimsWithPolicyClearingCache` method. This is the actual call to ADAL for iOS that you need to write. We'll return to this later.

Next, write your large method `getClaimsWithPolicyClearingCache`. This is large enough to merit its own section.

### Create your call to ADAL for iOS

After you download the skeleton from GitHub, you can see that we have several of these calls in place to help with the sample application. They all follow the pattern of `get(Claims|Token)With<verb>ClearningCache`. By using Objective C conventions, they read much like English. For instance, "Get a token with extra parameters that I provide to you and clear the cache" is `getTokenWithExtraParamsClearingCache()`.

You'll be writing "Get claims and a token with the policy that I provide to you and don't clear the cache" or `getClaimsWithPolicyClearingCache`. You always get a token back from ADAL, so it's not necessary to specify "claims and a token" in the method. However, sometimes you want just the token without the overhead of parsing the claims, so we also provide a method without claims called `getTokenWithPolicyClearingCache` in the skeleton.

Write this code now:

```
+(void) getClaimsWithPolicyClearingCache  : (BOOL) clearCache
                           policy:(samplesPolicyData *)policy
                           params:(NSDictionary*) params
                           parent:(UIViewController*) parent
                completionHandler:(void (^) (ADProfileInfo*, NSError*))completionBlock;
{
    SamplesApplicationData* data = [SamplesApplicationData getInstance];


    ADAuthenticationError *error;
    authContext = [ADAuthenticationContext authenticationContextWithAuthority:data.authority error:&error];
    authContext.parentController = parent;
    NSURL *redirectUri = [[NSURL alloc]initWithString:data.redirectUriString];

    if(!data.correlationId ||
       [[data.correlationId stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceAndNewlineCharacterSet]] length] == 0)
    {
        authContext.correlationId = [[NSUUID alloc] initWithUUIDString:data.correlationId];
    }

    [ADAuthenticationSettings sharedInstance].enableFullScreen = data.fullScreen;
    [authContext acquireTokenWithScopes:data.scopes
                      additionalScopes: data.additionalScopes
                              clientId:data.clientId
                           redirectUri:redirectUri
                            identifier:[ADUserIdentifier identifierWithId:data.userItem.profileInfo.username type:RequiredDisplayableId]
                            promptBehavior:AD_PROMPT_ALWAYS
                  extraQueryParameters: params.urlEncodedString
                                policy: policy.policyID
                       completionBlock:^(ADAuthenticationResult *result) {

                           if (result.status != AD_SUCCEEDED)
                           {
                               completionBlock(nil, result.error);
                           }                              else
                              {
                                  data.userItem = result.tokenCacheStoreItem;
                                  completionBlock(result.tokenCacheStoreItem.profileInfo, nil);
                              }
                          }];
}


```

The first part of this should look familiar.

- Load the settings that were provided in `settings.plist` and assign them to `data`.
- Set up `ADAuthenticationError`, which takes any error that comes from ADAL for iOS.
- Create `authContext`, which sets up your call to ADAL. You pass your authority to it to get things started.
- Give `authContext` a reference to the parent controller so that you can return to it.
- Convert `redirectURI`, which was a string in `settings.plist` into the NSURL type ADAL expects.
- Set up `correlationId`. This is a UUID that can follow the call across the client to the server and back. This is helpful for debugging.

Next, you get to the actual call to ADAL. This is where the call changes from what you would expect to see in previous uses of ADAL for iOS:

```
[authContext acquireTokenWithScopes:data.scopes
                      additionalScopes: data.additionalScopes
                              clientId:data.clientId
                           redirectUri:redirectUri
                            identifier:[ADUserIdentifier identifierWithId:data.userItem.profileInfo.username type:RequiredDisplayableId]
                            promptBehavior:AD_PROMPT_ALWAYS
                  extraQueryParameters: params.urlEncodedString
                                policy: policy.policyID
                       completionBlock:^(ADAuthenticationResult *result) {

```

You can see that the call is fairly simple.

`scopes`: The scopes that you pass to the server that you want to request from the server for a user who signs in. For B2C preview, you pass `client_id`. However, this is expected to change to read scopes in the future. We plan to update this document then.
`additionalScopes`: These are additional scopes that you might want to use for your application. They are expected to be used in the future.
`clientId`: The Application ID that you got from the portal.
`redirectURI`: The redirect where you expect the token to be posted back to.
`identifier`: A way to identify a user so that you can see if there is a usable token in the cache. This avoids always asking the server for another token. This is carried in a type called `ADUserIdentifier`, and you can specify what you want to use as an ID. You should use `username`.
`promptBehavior`: This is deprecated. It should be `AD_PROMPT_ALWAYS`.
`extraQueryParameters`: Anything extra you want to pass to the server in URL-encoded format.
`policy`: The policy you are invoking. This is the most important part for this walk-through.

You can see in `completionBlock` that you pass `ADAuthenticationResult`. This has your token and profile information (if the call was successful).

By using the code above, you can acquire a token for the policy you provide. You can then use this token to call the API.

### Create your task calls to the server

Now that you have a token, you need to provide it to your API for authorization.

Three methods need to be implemented:

```
+(void) getTaskList:(void (^) (NSArray*, NSError* error))completionBlock
             parent:(UIViewController*) parent;

+(void) addTask:(samplesTaskItem*)task
         parent:(UIViewController*) parent
completionBlock:(void (^) (bool, NSError* error)) completionBlock;

+(void) deleteTask:(samplesTaskItem*)task
            parent:(UIViewController*) parent
   completionBlock:(void (^) (bool, NSError* error)) completionBlock;
```

`getTasksList` provides an array that represents the tasks in your server. `addTask` and `deleteTask` do the subsequent actions and return `true` or `false` if they are successful.

Write `getTaskList` first:

```

+(void) getTaskList:(void (^) (NSArray*, NSError*))completionBlock
             parent:(UIViewController*) parent;
{
    if (!loadedApplicationSettings)
    {
        [self readApplicationSettings];
    }

    SamplesApplicationData* data = [SamplesApplicationData getInstance];

    [self craftRequest:[self.class trimString:data.taskWebApiUrlString]
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

                    NSArray *tasks = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];

                    //each object is a key value pair
                    NSDictionary *keyValuePairs;
                    NSMutableArray* sampleTaskItems = [[NSMutableArray alloc]init];

                    for(int i =0; i < tasks.count; i++)
                    {
                        keyValuePairs = [tasks objectAtIndex:i];

                        samplesTaskItem *s = [[samplesTaskItem alloc]init];
                        s.itemName = [keyValuePairs valueForKey:@"task"];

                        [sampleTaskItems addObject:s];
                    }

                    completionBlock(sampleTaskItems, nil);
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

A discussion of the task code is beyond the scope of this walk-through. But you might have noticed something interesting: a `craftRequest` method that takes your task URL. This method is what you use to create the request for the server by using the access token you received. Write that now.

Add the following code to the `samplesWebAPIConnector.m` file:

```
+(void) craftRequest : (NSString*)webApiUrlString
               parent:(UIViewController*) parent
    completionHandler:(void (^)(NSMutableURLRequest*, NSError* error))completionBlock
{
    [self getClaimsWithPolicyClearingCache:NO parent:parent completionHandler:^(NSString* accessToken, NSError* error){

        if (accessToken == nil)
        {
            completionBlock(nil,error);
        }
        else
        {
            NSURL *webApiURL = [[NSURL alloc]initWithString:webApiUrlString];

            NSMutableURLRequest *request = [[NSMutableURLRequest alloc]initWithURL:webApiURL];

            NSString *authHeader = [NSString stringWithFormat:@"Bearer %@", accessToken];

            [request addValue:authHeader forHTTPHeaderField:@"Authorization"];

            completionBlock(request, nil);
        }
    }];
}
```

This takes a web uniform resource identifier (URI), adds the token to it by using the `Bearer` header in HTTP, and then returns it to you. You call the `getTokenClearingCache` API. This might seem weird, but you simply use this call to get a token from the cache and to ensure that it's still valid. (The `getToken` calls do this for you by asking ADAL.) You will use this code in each call. Next, make your additional task methods.

Write `addTask`:

```
+(void) addTask:(samplesTaskItem*)task
         parent:(UIViewController*) parent
completionBlock:(void (^) (bool, NSError* error)) completionBlock
{
    if (!loadedApplicationSettings)
    {
        [self readApplicationSettings];
    }

    SamplesApplicationData* data = [SamplesApplicationData getInstance];
    [self craftRequest:data.taskWebApiUrlString parent:parent completionHandler:^(NSMutableURLRequest* request, NSError* error){

        if (error != nil)
        {
            completionBlock(NO, error);
        }
        else
        {
            NSDictionary* taskInDictionaryFormat = [self convertTaskToDictionary:task];

            NSData* requestBody = [NSJSONSerialization dataWithJSONObject:taskInDictionaryFormat options:0 error:nil];

            [request setHTTPMethod:@"POST"];
            [request addValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
            [request setHTTPBody:requestBody];

            NSString *myString = [[NSString alloc] initWithData:requestBody encoding:NSUTF8StringEncoding];

            NSLog(@"Request was: %@", request);
            NSLog(@"Request body was: %@", myString);

            NSOperationQueue *queue = [[NSOperationQueue alloc]init];

            [NSURLConnection sendAsynchronousRequest:request queue:queue completionHandler:^(NSURLResponse *response, NSData *data, NSError *error) {

                NSString* content = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
                NSLog(@"%@", content);

                if (error == nil){

                    completionBlock(true, nil);
                }
                else
                {
                    completionBlock(false, error);
                }
            }];
        }
    }];
}
```

This follows the same pattern, but it also introduces the final method you need to implement: `convertTaskToDictionary`. This takes your array and makes it a dictionary object. This object is more easily mutated to the query parameters you need to pass to the server. The code is simple:

```
// Here we have some conversation helpers that allow us to parse passed items into dictionaries for URLEncoding later.

+(NSDictionary*) convertTaskToDictionary:(samplesTaskItem*)task
{
    NSMutableDictionary* dictionary = [[NSMutableDictionary alloc]init];

    if (task.itemName){
        [dictionary setValue:task.itemName forKey:@"task"];
    }

    return dictionary;
}

```

Next, write `deleteTask`:

```
+(void) deleteTask:(samplesTaskItem*)task
            parent:(UIViewController*) parent
   completionBlock:(void (^) (bool, NSError* error)) completionBlock
{
    if (!loadedApplicationSettings)
    {
        [self readApplicationSettings];
    }

    SamplesApplicationData* data = [SamplesApplicationData getInstance];
    [self craftRequest:data.taskWebApiUrlString parent:parent completionHandler:^(NSMutableURLRequest* request, NSError* error){

        if (error != nil)
        {
            completionBlock(NO, error);
        }
        else
        {
            NSDictionary* taskInDictionaryFormat = [self convertTaskToDictionary:task];

            NSData* requestBody = [NSJSONSerialization dataWithJSONObject:taskInDictionaryFormat options:0 error:nil];

            [request setHTTPMethod:@"DELETE"];
            [request addValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
            [request setHTTPBody:requestBody];

            NSLog(@"%@", request);

            NSOperationQueue *queue = [[NSOperationQueue alloc]init];

            [NSURLConnection sendAsynchronousRequest:request queue:queue completionHandler:^(NSURLResponse *response, NSData *data, NSError *error) {

                NSString* content = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
                NSLog(@"%@", content);

                if (error == nil){

                    completionBlock(true, nil);
                }
                else
                {
                    completionBlock(false, error);
                }
            }];
        }
    }];
}
```

### Add sign-out to your application

The last thing to do is implement sign-out for your application. This is simple. Inside the `sampleWebApiConnector.m` file:

```
+(void) signOut
{
    [authContext.tokenCacheStore removeAll:nil];

    NSHTTPCookie *cookie;

    NSHTTPCookieStorage *storage = [NSHTTPCookieStorage sharedHTTPCookieStorage];
    for (cookie in [storage cookies])
    {
        [storage deleteCookie:cookie];
    }
}
```

## Run the sample app

Finally, build and run the app in Xcode. Sign up or sign in to the app, and create tasks for a signed-in user. Sign out and sign back in as a different user, and create tasks for that user.

Notice that the tasks are stored per-user on the API, because the API extracts the user's identity from the access token that it receives.

For reference, the complete sample [is provided as a .zip file](https://github.com/AzureADQuickStarts/B2C-NativeClient-iOS/archive/complete.zip). You can also clone it from GitHub:

```git clone --branch complete https://github.com/AzureADQuickStarts/B2C-NativeClient-iOS```

## Next steps

You can now move onto more advanced B2C topics. You might try:

[Call a Node.js web API from a Node.js web app]()

[Customize the UX for a B2C app]()
