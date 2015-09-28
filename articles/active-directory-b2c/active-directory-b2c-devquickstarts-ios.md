<properties
	pageTitle="Azure AD B2C Preview: Calling a Web API from an iOS application | Microsoft Azure"
	description="This article will show you how to create a iOS "To-Do List" app that calls a node.js web API using OAuth 2.0 bearer tokens. Both the iOS app and web api use Azure AD B2C to manage user identities and authenticate users."
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
	ms.topic="article"
	ms.date="09/22/2015"
	ms.author="brandwe"/>

# Azure AD B2C Preview: Calling a Web API from an iOS application

<!-- TODO [AZURE.INCLUDE [active-directory-b2c-devquickstarts-web-switcher](../../includes/active-directory-b2c-devquickstarts-web-switcher.md)]-->

With Azure AD B2C, you can add powerful self-service identity managment features to your iOS apps and web apis in a few short steps.  This article will show you how to create a iOS "To-Do List" app that calls a node.js web API using OAuth 2.0 bearer tokens. Both the iOS app and web api use Azure AD B2C to manage user identities
and authenticate users.

[AZURE.INCLUDE [active-directory-b2c-preview-note](../../includes/active-directory-b2c-preview-note.md)]
	
> [AZURE.NOTE]
	This quickstart has a pre-requisite that you have a Web API protected by Azure AD with B2C in order to work fully. We have built one for both .Net and node.js for you to use. This walk-through assumes the node.js Web-API sample is configured. 
	please refer to the [Azure Active Directory Web-API for Node.js sample](active-directory-b2c-devquickstarts-api-node.md`
).

> [AZURE.NOTE]
	This article does not cover how to implement sign-in, sign-up and profile management with Azure AD B2C.  It focuses on calling web APIs after the user is already authenticated.
If you haven't already, you should start with the [.NET Web App getting started tutorial](active-directory-b2c-devquickstarts-web-dotnet.md) to learn about the basics of Azure AD B2C.

## 1. Get an Azure AD B2C directory

Before you can use Azure AD B2C, you must create a directory, or tenant.  A directory is a container for all your users, apps, groups, and so on.  If you don't have
one already, go [create a B2C directory](active-directory-b2c-get-started.md) before moving on.

## 2. Create an application

Now you need to create an app in your B2C directory, which gives Azure AD some information that it needs to securely communicate with your app.  Both the app and web API will be represented by a single **Application ID** in this case, since they comprise one logical app.  To create an app,
follow [these instructions](active-directory-b2c-app-registration.md).  Be sure to

- Include a **web app/web api** in the application
- Enter `http://localhost:3000/auth/openid/return` as a **Reply URL** - it is the default URL for this code sample.
- Create an **Application Secret** for your application and copy it down.  You will need it shortly.
- Copy down the **Application ID** that is assigned to your app.  You will also need it shortly.

    > [AZURE.IMPORTANT]
    You cannot use applications registered in the **Applications** tab on the [Azure Portal](https://manage.windowsazure.com/) for this.

## 3. Create your policies

> [AZURE.NOTE] For our B2C preview you use the same policies across both client and server setups. If you've already went through a walk-through and created these policies there is no need to do so again. You may reuse the policies you've preveiously created in the portal if they match the requirements of the application.

In Azure AD B2C, every user experience is defined by a [**policy**](active-directory-b2c-reference-policies.md).  This app contains three 
identity experiences - sign-up, sign-in, and sign-in with Facebook.  You will need to create one policy of each type, as described in the 
[policy reference article](active-directory-b2c-reference-policies.md#how-to-create-a-sign-up-policy).  When creating your three policies, be sure to:

- Choose the **Display Name** and a few other sign-up attributes in your sign-up policy.
- Choose the **Display Name** and **Object ID** application claims in every policy.  You can choose other claims as well.
- Copy down the **Name** of each policy after you create it.  It should have the prefix `b2c_1_`.  You'll need those policy names shortly. 

Once you have your three policies successfully created, you're ready to build your app.

Note that this article does not cover how to use the policies you just created.  If you want to learn about how policies work in Azure AD B2C,
you should start with the [.NET Web App getting started tutorial](active-directory-b2c-devquickstarts-web-dotnet.md).

## 4. Download the code

The code for this tutorial is maintained [on GitHub](https://github.com/AzureADQuickStarts/B2C-NativeClient-iOS).  To build the sample as you go, you can 
[download a skeleton project as a .zip](https://github.com/AzureADQuickStarts/B2C-NativeClient-iOS/archive/skeleton.zip) or clone the skeleton:

```
git clone --branch skeleton https://github.com/AzureADQuickStarts/B2C-NativeClient-iOS.git
```

> [AZURE.NOTE] **Downloading the skeleton is required for completing this tutorial.** Due to the complexity of implementing a fully functioning application on iOS, the **skeleton** has UX code that will run once you've completed the tutorial below. This is a time saving measure for the developer. The UX code is not germane to the topic of adding B2C to an iOS application.

The completed app is also [available as a .zip](https://github.com/AzureADQuickStarts/B2C-NativeClient-iOS/archive/complete.zip) or on the
`complete` branch of the same repo.


Now load the podfile using cocoapods. This will create a new XCode Workspace you will load. If you don't have Cocoapods, visit [the website to setup cocoapods](https://cocoapods.org).

```
$ pod install
...
$ open Microsoft Tasks for Consumers.xcworkspace
```

## 5. Configure the iOS task application

In order for the iOS Task app to communicate with Azure AD B2C, there are a few common parameters that you will need to provide.  In the `Microsoft Tasks` folder, open up the `settings.plist` file in the root of the project and replace the values in the `<dict>` section.  These values will be used throughout the app.

```
<dict>
	<key>authority</key>
	<string>https://login.microsoftonline.com/<your tenant name>.onmicrosoft.com/</string>
	<key>clientId</key>
	<string><Enter the Application Id assinged to your app by the Azure portal, e.g.580e250c-8f26-49d0-bee8-1c078add1609></string>
	<key>scopes</key>
	<array>
		<string><Enter the Application Id assinged to your app by the Azure portal, e.g.580e250c-8f26-49d0-bee8-1c078add1609></string>
	</array>
	<key>additionalScopes</key>
	<array>
		<string></string>
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

## 6. Get access tokens and call the task API

This section will show how to complete an OAuth 2.0 token exchange in a web app using Microsoft's libraries and frameworks.  If you are
unfamiliar with **authorization codes** and **access tokens**, it may be a good idea to skim through the [OAuth 2.0 protocol reference](active-directory-b2c-reference-protocols.md).

#### Create header files with our methods we'll use.

We will need methods to get a token with our selected policy and then call our Task server. Let's set these up now.

Create a file called `samplesWebAPIConnector.h` under /Microsoft Tasks in your XCode project

Add the following code to define what we need to do:

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

You'll see that these are simple CRUD operations on our API as well as a method `doPolicy` that allows you to get a token with the policy you want.

You'll also see that we have two other header files we need to define which will hold our Task Item and our Policy Data. Let's create those now:

Create a  file called `samplesTaskItem.h` with the following code:

```
#import <Foundation/Foundation.h>

@interface samplesTaskItem : NSObject

@property NSString *itemName;
@property NSString *ownerName;
@property BOOL completed;
@property (readonly) NSDate *creationDate;

@end
```

Let's also create a file `samplesPolicyData.h` to hold our policy data:

```
#import <Foundation/Foundation.h>

@interface samplesPolicyData : NSObject

@property (strong) NSString* policyName;
@property (strong) NSString* policyID;

+(id) getInstance;

@end
```
#### Add an implementation for our Task and Policy items

Now that we have our header files in place, we need to write some code to store our data that we will be using for our sample.

Create a  file called `samplesPolicyData.m` with the following code:

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

#### Write setup code for our call in to ADAL for iOS

The quick code to store our objects for the UI is complete. We now need to write our code to access ADAL for iOS with the parameters we put in our `settings.plist` file in order to get an access token to provide to our Task server. This can get verbose, so stay focused.

All our work will be done in `samplesWebAPIConnector.m`. 

First, let's create our `doPolicy()` implementation that we wrote in our `samplesWebAPIConnector.h` header file:

```
+(void) doPolicy:(samplesPolicyData *)policy
         parent:(UIViewController*) parent
completionBlock:(void (^) (ADProfileInfo* userInfo, NSError* error)) completionBlock
{
    if (!loadedApplicationSettings)
    {
        [self readApplicationSettings];
    }
    
    NSDictionary* params = [self convertPolicyToDictionary:policy];
    
    [self getClaimsWithPolicyClearingCache:NO policy:policy params:params parent:parent completionHandler:^(ADProfileInfo* userInfo, NSError* error) {
        
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

You see that the the method is pretty simple. It takes as an input the `samplesPolicyData` object we created a few moments ago, the parent ViewController, and then a callback. The call back is interesting and we'll walk through it.

1. You'll see that the `completionBlock` has ADProfileInfo as a type that will get returned with a `userInfo` object. ADProfileInfo is the type that holds all the response from the server, in particular claims. 

2. You'll see that we `readApplicationSettings`. This reads the data that we've provided in the `settings.plist`
3. You'll see that we have a method `convertPolicyToDictionary:policy` which takes our policy and formats it as a URL to send to the server. We'll write this helper method next.
4. Finally, we have a rather large `getClaimsWithPolicyClearingCache` method. This is the actual call to ADAL for iOS we need to write. We'll do that later.


Next, we'll write that `convertPolicyToDictionary` method below the code we've just written:

```
// Here we have some converstion helpers that allow us to parse passed items in to dictionaries for URLEncoding later.

+(NSDictionary*) convertTaskToDictionary:(samplesTaskItem*)task
{
    NSMutableDictionary* dictionary = [[NSMutableDictionary alloc]init];
    
    if (task.itemName){
        [dictionary setValue:task.itemName forKey:@"task"];
    }
    
    return dictionary;
}

+(NSDictionary*) convertPolicyToDictionary:(samplesPolicyData*)policy
{
    NSMutableDictionary* dictionary = [[NSMutableDictionary alloc]init];

    
    if (policy.policyID){
        [dictionary setValue:policy.policyID forKey:@"p"];
    }
    
    return dictionary;
}

```
This rather simple code simply appends a p to our policy such that the look of the query should be ?p=<policy>. 

Now let's write our large method `getClaimsWithPolicyClearingCache`. This is large enough to merit it's own section

#### Create our call in to ADAL for iOS

If you downloaded the skeleton from GitHub, you'll see we already have several of these in place that help with the sample application. They all follow the pattern of `get(Claims|Token)With<verb>ClearningCache`. Using Objetive C conventions, this reads very much like English. For instance "get a Token with extra parameters I provide you and clear the cache". This is `getTokenWithExtraParamsClearingCache()`. Pretty simple. 

We'll be writing "get Claims and a token With the policy I provide you and don't clear the cache" or `getClaimsWithPolicyClearingCache`. We always get a token back from ADAL, so it's not necessary to specify "Claims and token" in the method. However sometimes you just want the token without the overhead of parsing the claims, so we provided a method without Claims called `getTokenWithPolicyClearingCache` in the skeleton.

Let's write this code now:

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

The first part of this should look familiar. We load the settings that were provided in `Settings.plist` and assign that to `data`. We then set up an `ADAuthenticationError` which will take any error that comes from ADAL for iOS. We also create an `authContext` which is setting up our call to ADAL. We pass it our *authority* to get things started. We also give the `authContext` a reference to our parent controller so we can return to it. We also convert our `redirectURI` which was a string in our `settings.plist` in to the NSURL type ADAL expects. Finally we set up a `correlationId` which is just a UUID that can follow the call across the client to the server and back. This is helpful for debugging.

Now we get to the actual call to ADAL, and this is where the call changes from what you'd expect to see in previous uses of ADAL for iOS:

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

Here you see the call is fairly simple.

**scopes** - is the scopes that we pass to the server that we wish to request from the server for the user logging in. For B2C Preview we pass the client_id. However this will change to read scopes in the future. This document will be updated then.
**addtionalScopes** - these are additional scopes you may want to use for your application. This will be used in the future
**clientId** - application ID you got from the portal
**redirectURI** - the redirect where we expect the token to be posted back.
**identifier** - this is a way to identify the user so we can see if their is a usable token in the cache vs. always asking the server for another token. You see this is carried in a type called `ADUserIdentifier` and we can specify what we want to use as an ID. You should use username.
**promptBehavior** - this is deprecated and should be AD_PROMPT_ALWAYS
**extraQueryParameters** - anything extra you want to pass to the server in URL encoded format.
**policy** - the policy you are invoking. The post important part for this walk-through.

You can see in the completionBlock we pass the `ADAuthenticationResult` which has our token and Profile info (if the call was successful)

Using the code above you can acquire a token for the policy you provide. We'll use this token to call the API.

#### Create our Task Calls to the server

Now that we have a token, we need to provide it to our API for authoriztion. 

If you recall we had three methods we need to implement:

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

Our `getTasksList` provides an array that represents the tasks in our server 
Our `addTask` and `deleteTask` do the subsequent action and return TRUE or FALSE if it was successful.

Let's write our `getTaskList` first:

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

It's beyond the scope of this walkthrough to discuss the Task code but there is something interesting you might have noticed: a `craftRequest` method that takes our task URL. This method is what we use to create the request, with the access token we received, for the server. Let's write that now. 

Let's add the following code to the `samplesWebAPIConnector.m' file:

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

As you can see this is takes a web URI, adds the token to it with the `Bearer` header in HTTP, and then returns it to us. We call the `getTokenClearingCache` API which may seem weird at first but we simply use this call to get a token from the cache and ensure that it's still valid (the getToken* calls do this for us by asking ADAL). We use this code in each call. Now let's get back to making our additional Task methods.

Let's write our `addTask`:

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

This following the same pattern but introduces another (and final!) method we need to implement: `convertTaskToDictionary` which takes our array and makes it a dictionary object which is more easily mutated to the query parameters we need to pass to the server. This code is very simple:

```
// Here we have some converstion helpers that allow us to parse passed items in to dictionaries for URLEncoding later.

+(NSDictionary*) convertTaskToDictionary:(samplesTaskItem*)task
{
    NSMutableDictionary* dictionary = [[NSMutableDictionary alloc]init];
    
    if (task.itemName){
        [dictionary setValue:task.itemName forKey:@"task"];
    }
    
    return dictionary;
}

```

Finally, let's write our `deleteTask`:

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

### Add sign-out to our application.

The last thing we need to do is implement Sign-Out for our application. This is rather simple. Again inside our `sampleWebApiConnector.m` file:

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

## 9. Run the sample app

Finally, build and run both the app in xCode.  Sign up or sign into the app, and create tasks for the signed in user.  Sign out, and sign back in as a different user, creating tasks for that user.

Notice how the tasks are stored per-user on the API, since the API extracts the user's identity from the access token it receives.

For reference, the completed sample [is provided as a .zip here](https://github.com/AzureADQuickStarts/B2C-NativeClient-iOS/archive/complete.zip),
or you can clone it from GitHub:

```git clone --branch complete https://github.com/AzureADQuickStarts/B2C-NativeClient-iOS```

## Next Steps

You can now move onto more advanced B2C topics.  You may want to try:

[Calling a node.js Web API from a node.js Web App >>]()

[Customizing the your B2C App's UX >>]()
