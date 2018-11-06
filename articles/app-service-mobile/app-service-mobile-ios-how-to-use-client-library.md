---
title: How to Use iOS SDK for Azure Mobile Apps
description: How to Use iOS SDK for Azure Mobile Apps
services: app-service\mobile
documentationcenter: ios
author: conceptdev
editor: ''

ms.assetid: 4e8e45df-c36a-4a60-9ad4-393ec10b7eb9
ms.service: app-service-mobile
ms.workload: mobile
ms.tgt_pltfrm: mobile-ios
ms.devlang: objective-c
ms.topic: article
ms.date: 10/01/2016
ms.author: crdun
---
# How to Use iOS Client Library for Azure Mobile Apps

[!INCLUDE [app-service-mobile-selector-client-library](../../includes/app-service-mobile-selector-client-library.md)]

This guide teaches you to perform common scenarios using the latest [Azure Mobile Apps iOS SDK][1]. If you are
new to Azure Mobile Apps, first complete [Azure Mobile Apps Quick Start] to create a backend, create a table,
and download a pre-built iOS Xcode project. In this guide, we focus on the client-side iOS SDK. To learn more
about the server-side SDK for the backend, see the Server SDK HOWTOs.

## Reference documentation

The reference documentation for the iOS client SDK is located here: [Azure Mobile Apps iOS Client Reference][2].

## Supported Platforms

The iOS SDK supports Objective-C projects, Swift 2.2 projects, and Swift 2.3 projects for iOS versions 8.0 or later.

The "server-flow" authentication uses a WebView for the presented UI.  If the device is not able to present
a WebView UI, then another method of authentication is required that is outside the scope of the product.  
This SDK is thus not suitable for Watch-type or similarly restricted devices.

## <a name="Setup"></a>Setup and Prerequisites

This guide assumes that you have created a backend with a table. This guide assumes that the table has the
same schema as the tables in those tutorials. This guide also assumes that in your code, you reference
`MicrosoftAzureMobile.framework` and import `MicrosoftAzureMobile/MicrosoftAzureMobile.h`.

## <a name="create-client"></a>How to: Create Client

To access an Azure Mobile Apps backend in your project, create an `MSClient`. Replace `AppUrl` with the app URL. You may leave `gatewayURLString` and `applicationKey` empty. If you set up a gateway for authentication, populate `gatewayURLString` with the gateway URL.

**Objective-C**:

```objc
MSClient *client = [MSClient clientWithApplicationURLString:@"AppUrl"];
```

**Swift**:

```swift
let client = MSClient(applicationURLString: "AppUrl")
```

## <a name="table-reference"></a>How to: Create Table Reference

To access or update data, create a reference to the backend table. Replace `TodoItem` with the name of your table

**Objective-C**:

```objc
MSTable *table = [client tableWithName:@"TodoItem"];
```

**Swift**:

```swift
let table = client.tableWithName("TodoItem")
```

## <a name="querying"></a>How to: Query Data

To create a database query, query the `MSTable` object. The following query gets all the items in `TodoItem` and logs the text of each item.

**Objective-C**:

```objc
[table readWithCompletion:^(MSQueryResult *result, NSError *error) {
        if(error) { // error is nil if no error occured
                NSLog(@"ERROR %@", error);
        } else {
                for(NSDictionary *item in result.items) { // items is NSArray of records that match query
                        NSLog(@"Todo Item: %@", [item objectForKey:@"text"]);
                }
        }
}];
```

**Swift**:

```swift
table.readWithCompletion { (result, error) in
    if let err = error {
        print("ERROR ", err)
    } else if let items = result?.items {
        for item in items {
            print("Todo Item: ", item["text"])
        }
    }
}
```

## <a name="filtering"></a>How to: Filter Returned Data

To filter results, there are many available options.

To filter using a predicate, use an `NSPredicate` and `readWithPredicate`. The following filters returned data to find only incomplete Todo items.

**Objective-C**:

```objc
// Create a predicate that finds items where complete is false
NSPredicate * predicate = [NSPredicate predicateWithFormat:@"complete == NO"];
// Query the TodoItem table
[table readWithPredicate:predicate completion:^(MSQueryResult *result, NSError *error) {
        if(error) {
                NSLog(@"ERROR %@", error);
        } else {
                for(NSDictionary *item in result.items) {
                        NSLog(@"Todo Item: %@", [item objectForKey:@"text"]);
                }
        }
}];
```

**Swift**:

```swift
// Create a predicate that finds items where complete is false
let predicate =  NSPredicate(format: "complete == NO")
// Query the TodoItem table
table.readWithPredicate(predicate) { (result, error) in
    if let err = error {
        print("ERROR ", err)
    } else if let items = result?.items {
        for item in items {
            print("Todo Item: ", item["text"])
        }
    }
}
```

## <a name="query-object"></a>How to: Use MSQuery

To perform a complex query (including sorting and paging), create an `MSQuery` object, directly or by using a predicate:

**Objective-C**:

```objc
MSQuery *query = [table query];
MSQuery *query = [table queryWithPredicate: [NSPredicate predicateWithFormat:@"complete == NO"]];
```

**Swift**:

```swift
let query = table.query()
let query = table.queryWithPredicate(NSPredicate(format: "complete == NO"))
```

`MSQuery` lets you control several query behaviors.

* Specify order of results
* Limit which fields to return
* Limit how many records to return
* Specify total count in response
* Specify custom query string parameters in request
* Apply additional functions

Execute an `MSQuery` query by calling `readWithCompletion` on the object.

## <a name="sorting"></a>How to: Sort Data with MSQuery

To sort results, let's look at an example. To sort by field 'text' ascending, then by 'complete' descending,
invoke `MSQuery` like so:

**Objective-C**:

```objc
[query orderByAscending:@"text"];
[query orderByDescending:@"complete"];
[query readWithCompletion:^(MSQueryResult *result, NSError *error) {
        if(error) {
                NSLog(@"ERROR %@", error);
        } else {
                for(NSDictionary *item in result.items) {
                        NSLog(@"Todo Item: %@", [item objectForKey:@"text"]);
                }
        }
}];
```

**Swift**:

```swift
query.orderByAscending("text")
query.orderByDescending("complete")
query.readWithCompletion { (result, error) in
    if let err = error {
        print("ERROR ", err)
    } else if let items = result?.items {
        for item in items {
            print("Todo Item: ", item["text"])
        }
    }
}
```

## <a name="selecting"></a><a name="parameters"></a>How to: Limit Fields and Expand Query String Parameters with MSQuery

To limit fields to be returned in a query, specify the names of the fields in the **selectFields**
property. This example returns only the text and completed fields:

**Objective-C**:

```objc
query.selectFields = @[@"text", @"complete"];
```

**Swift**:

```swift
query.selectFields = ["text", "complete"]
```

To include additional query string parameters in the server request (for example, because a custom server-side script uses them), populate `query.parameters` like so:

**Objective-C**:

```objc
query.parameters = @{
    @"myKey1" : @"value1",
    @"myKey2" : @"value2",
};
```

**Swift**:

```swift
query.parameters = ["myKey1": "value1", "myKey2": "value2"]
```

## <a name="paging"></a>How to: Configure Page Size

With Azure Mobile Apps, the page size controls the number of records that are pulled at a time from the backend tables. A call to `pull` data would then batch up data, based on this page size, until there are no more records to pull.

It's possible to configure a page size using **MSPullSettings** as shown below. The default page size is 50, and the example below changes it to 3.

You could configure a different page size for performance reasons. If you have a large number of small data records, a high page size reduces the number of server round-trips.

This setting controls only the page size on the client side. If the client asks for a larger page size than the Mobile Apps backend supports, the page size is capped at the maximum the backend is configured to support.

This setting is also the *number* of data records, not the *byte size*.

If you increase the client page size, you should also increase the page size on the server. See ["How to: Adjust the table paging size"](app-service-mobile-dotnet-backend-how-to-use-server-sdk.md) for the steps to do this.

**Objective-C**:

```objc
  MSPullSettings *pullSettings = [[MSPullSettings alloc] initWithPageSize:3];
  [table  pullWithQuery:query queryId:@nil settings:pullSettings
                        completion:^(NSError * _Nullable error) {
                               if(error) {
                    NSLog(@"ERROR %@", error);
                }
                           }];
```

**Swift**:

```swift
let pullSettings = MSPullSettings(pageSize: 3)
table.pullWithQuery(query, queryId:nil, settings: pullSettings) { (error) in
    if let err = error {
        print("ERROR ", err)
    }
}
```

## <a name="inserting"></a>How to: Insert Data

To insert a new table row, create a `NSDictionary` and invoke `table insert`. If [Dynamic Schema] is enabled,
the Azure App Service mobile backend automatically generates new columns based on the `NSDictionary`.

If `id` is not provided, the backend automatically generates a new unique ID. Provide your own `id` to use
email addresses, usernames, or your own custom values as ID. Providing your own ID may ease joins and
business-oriented database logic.

The `result` contains the new item that was inserted. Depending on your server logic, it may have additional
or modified data compared to what was passed to the server.

**Objective-C**:

```objc
NSDictionary *newItem = @{@"id": @"custom-id", @"text": @"my new item", @"complete" : @NO};
[table insert:newItem completion:^(NSDictionary *result, NSError *error) {
    if(error) {
        NSLog(@"ERROR %@", error);
    } else {
        NSLog(@"Todo Item: %@", [result objectForKey:@"text"]);
    }
}];
```

**Swift**:

```swift
let newItem = ["id": "custom-id", "text": "my new item", "complete": false]
table.insert(newItem) { (result, error) in
    if let err = error {
        print("ERROR ", err)
    } else if let item = result {
        print("Todo Item: ", item["text"])
    }
}
```

## <a name="modifying"></a>How to: Modify Data

To update an existing row, modify an item and call `update`:

**Objective-C**:

```objc
NSMutableDictionary *newItem = [oldItem mutableCopy]; // oldItem is NSDictionary
[newItem setValue:@"Updated text" forKey:@"text"];
[table update:newItem completion:^(NSDictionary *result, NSError *error) {
    if(error) {
        NSLog(@"ERROR %@", error);
    } else {
        NSLog(@"Todo Item: %@", [result objectForKey:@"text"]);
    }
}];
```

**Swift**:

```swift
if let newItem = oldItem.mutableCopy() as? NSMutableDictionary {
    newItem["text"] = "Updated text"
    table2.update(newItem as [NSObject: AnyObject], completion: { (result, error) -> Void in
        if let err = error {
            print("ERROR ", err)
        } else if let item = result {
            print("Todo Item: ", item["text"])
        }
    })
}
```

Alternatively, supply the row ID and the updated field:

**Objective-C**:

```objc
[table update:@{@"id":@"custom-id", @"text":"my EDITED item"} completion:^(NSDictionary *result, NSError *error) {
    if(error) {
        NSLog(@"ERROR %@", error);
    } else {
        NSLog(@"Todo Item: %@", [result objectForKey:@"text"]);
    }
}];
```

**Swift**:

```swift
table.update(["id": "custom-id", "text": "my EDITED item"]) { (result, error) in
    if let err = error {
        print("ERROR ", err)
    } else if let item = result {
        print("Todo Item: ", item["text"])
    }
}
```

At minimum, the `id` attribute must be set when making updates.

## <a name="deleting"></a>How to: Delete Data

To delete an item, invoke `delete` with the item:

**Objective-C**:

```objc
[table delete:item completion:^(id itemId, NSError *error) {
    if(error) {
        NSLog(@"ERROR %@", error);
    } else {
        NSLog(@"Todo Item ID: %@", itemId);
    }
}];
```

**Swift**:

```swift
table.delete(newItem as [NSObject: AnyObject]) { (itemId, error) in
    if let err = error {
        print("ERROR ", err)
    } else {
        print("Todo Item ID: ", itemId)
    }
}
```

Alternatively, delete by providing a row ID:

**Objective-C**:

```objc
[table deleteWithId:@"37BBF396-11F0-4B39-85C8-B319C729AF6D" completion:^(id itemId, NSError *error) {
    if(error) {
        NSLog(@"ERROR %@", error);
    } else {
        NSLog(@"Todo Item ID: %@", itemId);
    }
}];
```

**Swift**:

```swift
table.deleteWithId("37BBF396-11F0-4B39-85C8-B319C729AF6D") { (itemId, error) in
    if let err = error {
        print("ERROR ", err)
    } else {
        print("Todo Item ID: ", itemId)
    }
}
```

At minimum, the `id` attribute must be set when making deletes.

## <a name="customapi"></a>How to: Call Custom API

With a custom API, you can expose any backend functionality. It doesn't have to map to a table operation. Not only do you gain more control over messaging, you can even read/set headers and change the response body format. To learn how to create a custom API on the backend, read [Custom APIs](app-service-mobile-node-backend-how-to-use-server-sdk.md#work-easy-apis)

To call a custom API, call `MSClient.invokeAPI`. The request and response content are treated as JSON. To use
other media types, [use the other overload of `invokeAPI`][5].  To make a `GET` request instead of a `POST`
request, set parameter `HTTPMethod` to `"GET"` and parameter `body` to `nil` (since GET requests do not have
message bodies.) If your custom API supports other HTTP verbs, change `HTTPMethod` appropriately.

**Objective-C**:

```objc
[self.client invokeAPI:@"sendEmail"
                  body:@{ @"contents": @"Hello world!" }
            HTTPMethod:@"POST"
            parameters:@{ @"to": @"bill@contoso.com", @"subject" : @"Hi!" }
               headers:nil
            completion: ^(NSData *result, NSHTTPURLResponse *response, NSError *error) {
                if(error) {
                    NSLog(@"ERROR %@", error);
                } else {
                    // Do something with result
                }
            }];
```

**Swift**:

```swift
client.invokeAPI("sendEmail",
            body: [ "contents": "Hello World" ],
            HTTPMethod: "POST",
            parameters: [ "to": "bill@contoso.com", "subject" : "Hi!" ],
            headers: nil)
            {
                (result, response, error) -> Void in
                if let err = error {
                    print("ERROR ", err)
                } else if let res = result {
                          // Do something with result
                }
        }
```

## <a name="templates"></a>How to: Register push templates to send cross-platform notifications

To register templates, pass templates with your **client.push registerDeviceToken** method in your client app.

**Objective-C**:

```objc
[client.push registerDeviceToken:deviceToken template:iOSTemplate completion:^(NSError *error) {
    if(error) {
        NSLog(@"ERROR %@", error);
    }
}];
```

**Swift**:

```swift
client.push?.registerDeviceToken(NSData(), template: iOSTemplate, completion: { (error) in
    if let err = error {
        print("ERROR ", err)
    }
})
```

Your templates are of type NSDictionary and can contain multiple templates in the following format:

**Objective-C**:

```objc
NSDictionary *iOSTemplate = @{ @"templateName": @{ @"body": @{ @"aps": @{ @"alert": @"$(message)" } } } };
```

**Swift**:

```swift
let iOSTemplate = ["templateName": ["body": ["aps": ["alert": "$(message)"]]]]
```

All tags are stripped from the request for security.  To add tags to installations or templates within
installations, see [Work with the .NET backend server SDK for Azure Mobile Apps][4].  To send notifications
using these registered templates, work with [Notification Hubs APIs][3].

## <a name="errors"></a>How to: Handle Errors

When you call an Azure App Service mobile backend, the completion block contains an `NSError` parameter. When
an error occurs, this parameter is non-nil. In your code, you should check this parameter and handle the error
as needed, as demonstrated in the preceding code snippets.

The file [`<WindowsAzureMobileServices/MSError.h>`][6] defines the constants `MSErrorResponseKey`,
`MSErrorRequestKey`, and `MSErrorServerItemKey`. To get more data related to the error:

**Objective-C**:

```objc
NSDictionary *serverItem = [error.userInfo objectForKey:MSErrorServerItemKey];
```

**Swift**:

```swift
let serverItem = error.userInfo[MSErrorServerItemKey]
```

In addition, the file defines constants for each error code:

**Objective-C**:

```objc
if (error.code == MSErrorPreconditionFailed) {
```

**Swift**:

```swift
if (error.code == MSErrorPreconditionFailed) {
```

## <a name="adal"></a>How to: Authenticate users with the Active Directory Authentication Library

You can use the Active Directory Authentication Library (ADAL) to sign users into your application using
Azure Active Directory. Client flow authentication using an identity provider SDK is preferable to using
the `loginWithProvider:completion:` method.  Client flow authentication provides a more native UX feel
and allows for additional customization.

1. Configure your mobile app backend for AAD sign-in by following the [How to configure App Service for Active Directory login][7]
   tutorial. Make sure to complete the optional step of registering a native client application. For iOS, we
   recommend that the redirect URI is of the form `<app-scheme>://<bundle-id>`. For more information, see
   the [ADAL iOS quickstart][8].
2. Install ADAL using Cocoapods. Edit your Podfile to include the following definition, replacing **YOUR-PROJECT**
   with the name of your Xcode project:

        source 'https://github.com/CocoaPods/Specs.git'
        link_with ['YOUR-PROJECT']
        xcodeproj 'YOUR-PROJECT'

   and the Pod:

        pod 'ADALiOS'

3. Using the Terminal, run `pod install` from the directory containing your project, and then open the generated
   Xcode workspace (not the project).
4. Add the following code to your application, according to the language you are using. In each, make these
   replacements:

   * Replace **INSERT-AUTHORITY-HERE** with the name of the tenant in which you provisioned your application. The
     format should be https://login.microsoftonline.com/contoso.onmicrosoft.com. This value can be copied from the Domain
     tab in your Azure Active Directory in the [Azure portal].
   * Replace **INSERT-RESOURCE-ID-HERE** with the client ID for your mobile app backend. You can obtain the
     client ID from the **Advanced** tab under **Azure Active Directory Settings** in the portal.
   * Replace **INSERT-CLIENT-ID-HERE** with the client ID you copied from the native client application.
   * Replace **INSERT-REDIRECT-URI-HERE** with your site's */.auth/login/done* endpoint, using the HTTPS
     scheme. This value should be similar to *https://contoso.azurewebsites.net/.auth/login/done*.

**Objective-C**:

```objc
#import <ADALiOS/ADAuthenticationContext.h>
#import <ADALiOS/ADAuthenticationSettings.h>
// ...
- (void) authenticate:(UIViewController*) parent
            completion:(void (^) (MSUser*, NSError*))completionBlock;
{
    NSString *authority = @"INSERT-AUTHORITY-HERE";
    NSString *resourceId = @"INSERT-RESOURCE-ID-HERE";
    NSString *clientId = @"INSERT-CLIENT-ID-HERE";
    NSURL *redirectUri = [[NSURL alloc]initWithString:@"INSERT-REDIRECT-URI-HERE"];
    ADAuthenticationError *error;
    ADAuthenticationContext *authContext = [ADAuthenticationContext authenticationContextWithAuthority:authority error:&error];
    authContext.parentController = parent;
    [ADAuthenticationSettings sharedInstance].enableFullScreen = YES;
    [authContext acquireTokenWithResource:resourceId
                                    clientId:clientId
                                redirectUri:redirectUri
                            completionBlock:^(ADAuthenticationResult *result) {
                                if (result.status != AD_SUCCEEDED)
                                {
                                    completionBlock(nil, result.error);;
                                }
                                else
                                {
                                    NSDictionary *payload = @{
                                                            @"access_token" : result.tokenCacheStoreItem.accessToken
                                                            };
                                    [client loginWithProvider:@"aad" token:payload completion:completionBlock];
                                }
                            }];
}
```

**Swift**:

```swift
// add the following imports to your bridging header:
//        #import <ADALiOS/ADAuthenticationContext.h>
//        #import <ADALiOS/ADAuthenticationSettings.h>

func authenticate(parent: UIViewController, completion: (MSUser?, NSError?) -> Void) {
    let authority = "INSERT-AUTHORITY-HERE"
    let resourceId = "INSERT-RESOURCE-ID-HERE"
    let clientId = "INSERT-CLIENT-ID-HERE"
    let redirectUri = NSURL(string: "INSERT-REDIRECT-URI-HERE")
    var error: AutoreleasingUnsafeMutablePointer<ADAuthenticationError?> = nil
    let authContext = ADAuthenticationContext(authority: authority, error: error)
    authContext.parentController = parent
    ADAuthenticationSettings.sharedInstance().enableFullScreen = true
    authContext.acquireTokenWithResource(resourceId, clientId: clientId, redirectUri: redirectUri) { (result) in
            if result.status != AD_SUCCEEDED {
                completion(nil, result.error)
            }
            else {
                let payload: [String: String] = ["access_token": result.tokenCacheStoreItem.accessToken]
                client.loginWithProvider("aad", token: payload, completion: completion)
            }
        }
}
```

## <a name="facebook-sdk"></a>How to: Authenticate users with the Facebook SDK for iOS

You can use the Facebook SDK for iOS to sign users into your application using Facebook.  Using a client flow
authentication is preferable to using the `loginWithProvider:completion:` method.  The client flow authentication
provides a more native UX feel and allows for additional customization.

1. Configure your mobile app backend for Facebook sign-in by following the
   [How to configure App Service for Facebook login][9] tutorial.
2. Install the Facebook SDK for iOS by following the [Facebook SDK for iOS - Getting Started][10]
   documentation. Instead of creating an app, you can add the iOS platform to your existing registration.
3. Facebook's documentation includes some Objective-C code in the App Delegate. If you are using **Swift**, you
   can use the following translations for AppDelegate.swift:

    ```swift
    // Add the following import to your bridging header:
    //        #import <FBSDKCoreKit/FBSDKCoreKit.h>

    func application(application: UIApplication, didFinishLaunchingWithOptions launchOptions: [NSObject : AnyObject]?) -> Bool {
        FBSDKApplicationDelegate.sharedInstance().application(application, didFinishLaunchingWithOptions: launchOptions)
        // Add any custom logic here.
        return true
    }

    func application(application: UIApplication, openURL url: NSURL, sourceApplication: String?, annotation: AnyObject?) -> Bool {
        let handled = FBSDKApplicationDelegate.sharedInstance().application(application, openURL: url, sourceApplication: sourceApplication, annotation: annotation)
        // Add any custom logic here.
        return handled
    }
    ```
4. In addition to adding `FBSDKCoreKit.framework` to your project, also add a reference to `FBSDKLoginKit.framework`
   in the same way.
5. Add the following code to your application, according to the language you are using.

    **Objective-C**:

    ```objc
    #import <FBSDKLoginKit/FBSDKLoginKit.h>
    #import <FBSDKCoreKit/FBSDKAccessToken.h>
    // ...
    - (void) authenticate:(UIViewController*) parent
                completion:(void (^) (MSUser*, NSError*)) completionBlock;
    {
        FBSDKLoginManager *loginManager = [[FBSDKLoginManager alloc] init];
        [loginManager
            logInWithReadPermissions: @[@"public_profile"]
            fromViewController:parent
            handler:^(FBSDKLoginManagerLoginResult *result, NSError *error) {
                if (error) {
                    completionBlock(nil, error);
                } else if (result.isCancelled) {
                    completionBlock(nil, error);
                } else {
                    NSDictionary *payload = @{
                                            @"access_token":result.token.tokenString
                                            };
                    [client loginWithProvider:@"facebook" token:payload completion:completionBlock];
                }
            }];
    }
    ```

    **Swift**:

    ```swift
    // Add the following imports to your bridging header:
    //        #import <FBSDKLoginKit/FBSDKLoginKit.h>
    //        #import <FBSDKCoreKit/FBSDKAccessToken.h>

    func authenticate(parent: UIViewController, completion: (MSUser?, NSError?) -> Void) {
        let loginManager = FBSDKLoginManager()
        loginManager.logInWithReadPermissions(["public_profile"], fromViewController: parent) { (result, error) in
            if (error != nil) {
                completion(nil, error)
            }
            else if result.isCancelled {
                completion(nil, error)
            }
            else {
                let payload: [String: String] = ["access_token": result.token.tokenString]
                client.loginWithProvider("facebook", token: payload, completion: completion)
            }
        }
    }
    ```

## <a name="twitter-fabric"></a>How to: Authenticate users with Twitter Fabric for iOS

You can use Fabric for iOS to sign users into your application using Twitter. Client Flow authentication is
preferable to using the `loginWithProvider:completion:` method, as it provides a more native UX feel and allows
for additional customization.

1. Configure your mobile app backend for Twitter sign-in by following the [How to configure App Service for Twitter login](../app-service/app-service-mobile-how-to-configure-twitter-authentication.md) tutorial.
2. Add Fabric to your project by following the [Fabric for iOS - Getting Started] documentation and setting up
   TwitterKit.

   > [!NOTE]
   > By default, Fabric creates a Twitter application for you. You can avoid creating an
   > application by registering the Consumer Key and Consumer Secret you created earlier using the following
   > code snippets.    Alternatively, you can replace the Consumer Key and Consumer Secret values that you provide
   > to App Service with the values you see in the [Fabric Dashboard]. If you choose this option, be sure to set
   > the callback URL to a placeholder value, such as `https://<yoursitename>.azurewebsites.net/.auth/login/twitter/callback`.

    If you choose to use the secrets you created earlier, add the following code to your App Delegate:

    **Objective-C**:

    ```objc
    #import <Fabric/Fabric.h>
    #import <TwitterKit/TwitterKit.h>
    // ...
    - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
    {
        [[Twitter sharedInstance] startWithConsumerKey:@"your_key" consumerSecret:@"your_secret"];
        [Fabric with:@[[Twitter class]]];
        // Add any custom logic here.
        return YES;
    }
    ```

    **Swift**:

    ```swift
    import Fabric
    import TwitterKit
    // ...
    func application(application: UIApplication, didFinishLaunchingWithOptions launchOptions: [NSObject : AnyObject]?) -> Bool {
        Twitter.sharedInstance().startWithConsumerKey("your_key", consumerSecret: "your_secret")
        Fabric.with([Twitter.self])
        // Add any custom logic here.
        return true
    }
    ```

3. Add the following code to your application, according to the language you are using.

    **Objective-C**:

    ```objc
    #import <TwitterKit/TwitterKit.h>
    // ...
    - (void)authenticate:(UIViewController*)parent completion:(void (^) (MSUser*, NSError*))completionBlock
    {
        [[Twitter sharedInstance] logInWithCompletion:^(TWTRSession *session, NSError *error) {
            if (session) {
                NSDictionary *payload = @{
                                            @"access_token":session.authToken,
                                            @"access_token_secret":session.authTokenSecret
                                        };
                [client loginWithProvider:@"twitter" token:payload completion:completionBlock];
            } else {
                completionBlock(nil, error);
            }
        }];
    }
    ```

    **Swift**:

    ```swift
    import TwitterKit
    // ...
    func authenticate(parent: UIViewController, completion: (MSUser?, NSError?) -> Void) {
        let client = self.table!.client
        Twitter.sharedInstance().logInWithCompletion { session, error in
            if (session != nil) {
                let payload: [String: String] = ["access_token": session!.authToken, "access_token_secret": session!.authTokenSecret]
                client.loginWithProvider("twitter", token: payload, completion: completion)
            } else {
                completion(nil, error)
            }
        }
    }
    ```

## <a name="google-sdk"></a>How to: Authenticate users with the Google Sign-In SDK for iOS

You can use the Google Sign-In SDK for iOS to sign users into your application using a Google account.  Google
recently announced changes to their OAuth security policies.  These policy changes will require the use of the
Google SDK in the future.

1. Configure your mobile app backend for Google sign-in by following the [How to configure App Service for Google login](../app-service/app-service-mobile-how-to-configure-google-authentication.md) tutorial.
2. Install the Google SDK for iOS by following the [Google Sign-In for iOS - Start integrating](https://developers.google.com/identity/sign-in/ios/start-integrating)
   documentation. You may skip the "Authenticate with a Backend Server" section.
3. Add the following to your delegate's `signIn:didSignInForUser:withError:` method, according to the language
   you are using.

    **Objective-C**:
    ```objc
    NSDictionary *payload = @{
                                @"id_token":user.authentication.idToken,
                                @"authorization_code":user.serverAuthCode
                                };

    [client loginWithProvider:@"google" token:payload completion:^(MSUser *user, NSError *error) {
        // ...
    }];
    ```

    **Swift**:

    ```swift
    let payload: [String: String] = ["id_token": user.authentication.idToken, "authorization_code": user.serverAuthCode]
    client.loginWithProvider("google", token: payload) { (user, error) in
        // ...
    }
    ```

4. Make sure you also add the following to `application:didFinishLaunchingWithOptions:` in your app delegate,
   replacing "SERVER_CLIENT_ID" with the same ID that you used to configure App Service in step 1.

    **Objective-C**:

    ```objc
    [GIDSignIn sharedInstance].serverClientID = @"SERVER_CLIENT_ID";
    ```

     **Swift**:

    ```swift
    GIDSignIn.sharedInstance().serverClientID = "SERVER_CLIENT_ID"
    ```

5. Add the following code to your application in a UIViewController that implements the `GIDSignInUIDelegate`
   protocol, according to the language you are using.  You are signed out before being signed in
   again, and although you don't need to enter your credentials again, you see a consent dialog.  Only call
   this method when the session token has expired.

   **Objective-C**:

    ```objc
    #import <Google/SignIn.h>
    // ...
    - (void)authenticate
    {
            [GIDSignIn sharedInstance].uiDelegate = self;
            [[GIDSignIn sharedInstance] signOut];
            [[GIDSignIn sharedInstance] signIn];
    }
    ```

   **Swift**:

    ```swift
    // ...
    func authenticate() {
        GIDSignIn.sharedInstance().uiDelegate = self
        GIDSignIn.sharedInstance().signOut()
        GIDSignIn.sharedInstance().signIn()
    }
    ```

<!-- Anchors. -->

[What is Mobile Services]: #what-is
[Concepts]: #concepts
[Setup and Prerequisites]: #Setup
[How to: Create the Mobile Services client]: #create-client
[How to: Create a table reference]: #table-reference
[How to: Query data from a mobile service]: #querying
[Filter returned data]: #filtering
[Sort returned data]: #sorting
[Return data in pages]: #paging
[Select specific columns]: #selecting
[How to: Bind data to the user interface]: #binding
[How to: Insert data into a mobile service]: #inserting
[How to: Modify data in a mobile service]: #modifying
[How to: Authenticate users]: #authentication
[Cache authentication tokens]: #caching-tokens
[How to: Upload images and large files]: #blobs
[How to: Handle errors]: #errors
[How to: Design unit tests]: #unit-testing
[How to: Customize the client]: #customizing
[Customize request headers]: #custom-headers
[Customize data type serialization]: #custom-serialization
[Next Steps]: #next-steps
[How to: Use MSQuery]: #query-object

<!-- Images. -->

<!-- URLs. -->
[Azure Mobile Apps Quick Start]: app-service-mobile-ios-get-started.md

[Add Mobile Services to Existing App]: /develop/mobile/tutorials/get-started-data
[Get started with Mobile Services]: /develop/mobile/tutorials/get-started-ios
[Validate and modify data in Mobile Services by using server scripts]: /develop/mobile/tutorials/validate-modify-and-augment-data-ios
[Mobile Services SDK]: https://go.microsoft.com/fwLink/p/?LinkID=266533
[Authentication]: /develop/mobile/tutorials/get-started-with-users-ios
[iOS SDK]: https://developer.apple.com/xcode
[Azure portal]: https://portal.azure.com/
[Handling Expired Tokens]: http://go.microsoft.com/fwlink/p/?LinkId=301955
[Live Connect SDK]: http://go.microsoft.com/fwlink/p/?LinkId=301960
[Permissions]: http://msdn.microsoft.com/library/windowsazure/jj193161.aspx
[Service-side Authorization]: mobile-services-javascript-backend-service-side-authorization.md
[Use scripts to authorize users]: /develop/mobile/tutorials/authorize-users-in-scripts-ios
[Dynamic Schema]: http://go.microsoft.com/fwlink/p/?LinkId=296271
[How to: access custom parameters]: /develop/mobile/how-to-guides/work-with-server-scripts#access-headers
[Create a table]: http://msdn.microsoft.com/library/windowsazure/jj193162.aspx
[NSDictionary object]: http://go.microsoft.com/fwlink/p/?LinkId=301965
[ASCII control codes C0 and C1]: http://en.wikipedia.org/wiki/Data_link_escape_character#C1_set
[CLI to manage Mobile Services tables]: /cli/azure/get-started-with-az-cli2
[Conflict-Handler]: mobile-services-ios-handling-conflicts-offline-data.md#add-conflict-handling

[Fabric Dashboard]: https://www.fabric.io/home
[Fabric for iOS - Getting Started]: https://docs.fabric.io/ios/fabric/getting-started.html
[1]: https://github.com/Azure/azure-mobile-apps-ios-client/blob/master/README.md#ios-client-sdk
[2]: http://azure.github.io/azure-mobile-apps-ios-client/
[3]: https://msdn.microsoft.com/library/azure/dn495101.aspx
[4]: app-service-mobile-dotnet-backend-how-to-use-server-sdk.md#tags
[5]: http://azure.github.io/azure-mobile-services/iOS/v3/Classes/MSClient.html#//api/name/invokeAPI:data:HTTPMethod:parameters:headers:completion:
[6]: https://github.com/Azure/azure-mobile-services/blob/master/sdk/iOS/src/MSError.h
[7]: ../app-service/app-service-mobile-how-to-configure-active-directory-authentication.md
[8]:../active-directory/develop/quickstart-v1-ios.md
[9]: ../app-service/app-service-mobile-how-to-configure-facebook-authentication.md
[10]: https://developers.facebook.com/docs/ios/getting-started
