<properties
	pageTitle="Azure AD v2.0 iOS App | Microsoft Azure"
	description="How to build an iOS app that signs in users with both personal Microsoft account and work or school accounts by using third-party libraries."
	services="active-directory"
	documentationCenter=""
	authors="brandwe"
	manager="mbaldwin"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="mobile-ios"
	ms.devlang="objective-c"
	ms.topic="article"
	ms.date="06/28/2016"
	ms.author="brandwe"/>

# Add sign-in to an iOS app using a third-party library with Graph API using the v2.0 endpoint

The Microsoft identity platform uses open standards such as OAuth2 and OpenID Connect. Developers can use any library they want to integrate with our services. To help developers use our platform with other libraries, we've written a few walkthroughs like this one to demonstrate how to configure third-party libraries to connect to the Microsoft identity platform. Most libraries that implement [the RFC6749 OAuth2 spec](https://tools.ietf.org/html/rfc6749) can connect to the Microsoft identity platform.

With the application that this walkthrough creates, users can sign in to their organization and then search for others in their organization by using the Graph API.

If you're new to OAuth2 or OpenID Connect, much of this sample configuration may not make sense to you. We recommend that you read  [v2.0 Protocols - OAuth 2.0 Authorization Code Flow](active-directory-v2-protocols-oauth-code.md) for background.


> [AZURE.NOTE]
    Some features of our platform that do have an expression in the OAuth2 or OpenID Connect standards, such as Conditional Access and Intune policy management, require you to use our open source Microsoft Azure Identity Libraries.

The v2.0 endpoint does not support all Azure Active Directory scenarios and features.

> [AZURE.NOTE]
    To determine if you should use the v2.0 endpoint, read about [v2.0 limitations](active-directory-v2-limitations.md).

## Download code from GitHub
The code for this tutorial is maintained [on GitHub](https://github.com/Azure-Samples/active-directory-ios-native-nxoauth2-v2).  To follow along, you can [download the app's skeleton as a .zip](https://github.com/AzureADQuickStarts/AppModelv2-WebAPI-DotNet/archive/skeleton.zip) or clone the skeleton:

```
git clone --branch skeleton git@github.com:Azure-Samples/active-directory-ios-native-nxoauth2-v2.git
```

You can also just download the sample and get started right away:

```
git clone git@github.com:Azure-Samples/active-directory-ios-native-nxoauth2-v2.git
```

## Register an app
Create a new app at the [Application registration portal](https://apps.dev.microsoft.com), or follow the detailed steps at  [How to register an app with the v2.0 endpoint](active-directory-v2-app-registration.md).  Make sure to:

- Copy the **Application Id** that's assigned to your app because you'll need it soon.
- Add the **Mobile** platform for your app.
- Copy the **Redirect URI** from the portal. You must use the default value of `urn:ietf:wg:oauth:2.0:oob`.


## Download the third-party NXOAuth2 library and create a workspace

For this walkthrough, you will use the OAuth2Client from GitHub, which is an OAuth2 library for Mac OS X and iOS (Cocoa and Cocoa touch). This library is based on draft 10 of the OAuth2 spec. It implements the native application profile and supports the authorization endpoint of the user. These are all the things you'll need to integrate with the Microsoft identity platform.

### Add the library to your project by using CocoaPods

CocoaPods is a dependency manager for Xcode projects. It manages the previous installation steps automatically.

```
$ vi Podfile
```
1. Add the following to this podfile:

	```
	 platform :ios, '8.0'

	 target 'QuickStart' do

	 pod 'NXOAuth2Client'

	 end
	```

2. Load the podfile by using CocoaPods. This will create a new Xcode workspace that you will load.

	```
	$ pod install
	...
	$ open QuickStart.xcworkspace
	```

## Explore the structure of the project

The following structure is set up for our project in the skeleton:

- A Master View with a UPN Search
- A Detail View for the data about the selected user
- A Login View where a user can sign in to the app to query the graph

We will move to various files in the skeleton to add authentication. Other parts of the code, such as the visual code, do not pertain to identity but are provided for you.

## Set up the settings.plst file in the library

-	In the QuickStart project, open the `settings.plist` file. Replace the values of the elements in the section to reflect the values that you used in the Azure portal. Your code will reference these values whenever it uses the Active Directory Authentication Library.
    -	The `clientId` is the client ID of your application that you copied from the portal.
    -	The `redirectUri` is the redirect URL that the portal provided.

## Set up the NXOAuth2Client library in your LoginViewController

The NXOAuth2Client library requires some values to get set up. After you complete that task, you can use the acquired token to call the Graph API. Because `LoginView` will be called any time we need to authenticate, it makes sense to put configuration values in to that file.

- Let's add some values to the  `LoginViewController.m` file to set the context for authentication and authorization. Details about the values follow the code.

	```objc
	NSString *scopes = @"offline_access User.ReadBasic.All";
	NSString *authURL = @"https://login.microsoftonline.com/common/oauth2/v2.0/authorize";
	NSString *loginURL = @"https://login.microsoftonline.com/common/login";
	NSString *bhh = @"urn:ietf:wg:oauth:2.0:oob?code=";
	NSString *tokenURL = @"https://login.microsoftonline.com/common/oauth2/v2.0/token";
	NSString *keychain = @"com.microsoft.azureactivedirectory.samples.graph.QuickStart";
	static NSString * const kIDMOAuth2SuccessPagePrefix = @"session_state=";
	NSURL *myRequestedUrl;
	NSURL *myLoadedUrl;
	bool loginFlow = FALSE;
	bool isRequestBusy;
	NSURL *authcode;
	```

Let's look at details about the code.

The first string is for `scopes`.  The `User.ReadBasic.All` value allows you to read the basic profile of all the users in your directory.

You can learn more about all the available scopes at [Microsoft Graph permission scopes](https://graph.microsoft.io/docs/authorization/permission_scopes).

For `authURL`, `loginURL`, `bhh`, and `tokenURL`, you should use the values provided previously. If you use the open source Microsoft Azure Identity Libraries, we pull this data down for you by using our metadata endpoint. We've done the hard work of extracting these values for you.

The `keychain` value is the container that the NXOAuth2Client library will use to create a keychain to store your tokens. If you'd like to get single sign-on (SSO) across numerous apps, you can specify the same keychain in each of your applications and request the use of that keychain in your Xcode entitlements. This is explained in the Apple documentation.

The rest of these values are required to use the library and create places for you to carry values to the context.

### Create a URL cache

Inside `(void)viewDidLoad()`, which is always called after the view is loaded, the following code primes a cache for our use.

Add the following code:

```objc
- (void)viewDidLoad {
    [super viewDidLoad];
    self.loginView.delegate = self;
    [self setupOAuth2AccountStore];
    [self requestOAuth2Access];
    NSURLCache *URLCache = [[NSURLCache alloc] initWithMemoryCapacity:4 * 1024 * 1024
                                                         diskCapacity:20 * 1024 * 1024
                                                             diskPath:nil];
    [NSURLCache setSharedURLCache:URLCache];

}
```

### Create a WebView for sign-in

A WebView can prompt the user for additional factors like SMS text message (if configured) or return error messages to the user. Here you'll set up the WebView and then later write the code to handle the callbacks that will happen in the WebView from the identity services.

```objc
-(void)requestOAuth2Access {
    //to sign in to Microsoft APIs using OAuth2, we must show an embedded browser (UIWebView)
    [[NXOAuth2AccountStore sharedStore] requestAccessToAccountWithType:@"myGraphService"
                                   withPreparedAuthorizationURLHandler:^(NSURL *preparedURL) {
                                       //navigate to the URL returned by NXOAuth2Client

                                       NSURLRequest *r = [NSURLRequest requestWithURL:preparedURL];
                                       [self.loginView loadRequest:r];
                                   }];
}
```

### Override the WebView methods to handle authentication

To tell the WebView what happens when a user needs to sign in as discussed previously, you can paste the following code.

```objc
- (void)resolveUsingUIWebView:(NSURL *)URL {

    // We get the auth token from a redirect so we need to handle that in the webview.

    if (![NSThread isMainThread]) {
        [self performSelectorOnMainThread:@selector(resolveUsingUIWebView:) withObject:URL waitUntilDone:YES];
        return;
    }

    NSURLRequest *hostnameURLRequest = [NSURLRequest requestWithURL:URL cachePolicy:NSURLRequestUseProtocolCachePolicy timeoutInterval:10.0f];
    isRequestBusy = YES;
    [self.loginView loadRequest:hostnameURLRequest];

    NSLog(@"resolveUsingUIWebView ready (status: UNKNOWN, URL: %@)", self.loginView.request.URL);
}

- (BOOL)webView:(UIWebView *)webView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType {

    NSLog(@"webView:shouldStartLoadWithRequest: %@ (%li)", request.URL, (long)navigationType);

    // The webview is where all the communication happens. Slightly complicated.

    myLoadedUrl = [webView.request mainDocumentURL];
    NSLog(@"***Loaded url: %@", myLoadedUrl);

    //if the UIWebView is showing our authorization URL or consent URL, show the UIWebView control
    if ([request.URL.absoluteString rangeOfString:authURL options:NSCaseInsensitiveSearch].location != NSNotFound) {
        self.loginView.hidden = NO;
    } else if ([request.URL.absoluteString rangeOfString:loginURL options:NSCaseInsensitiveSearch].location != NSNotFound) {
        //otherwise hide the UIWebView, we've left the authorization flow
        self.loginView.hidden = NO;
    } else if ([request.URL.absoluteString rangeOfString:bhh options:NSCaseInsensitiveSearch].location != NSNotFound) {
        //otherwise hide the UIWebView, we've left the authorization flow
        self.loginView.hidden = YES;
        [[NXOAuth2AccountStore sharedStore] handleRedirectURL:request.URL];
    }
    else {
        self.loginView.hidden = NO;
        //read the Location from the UIWebView, this is how Microsoft APIs is returning the
        //authentication code and relation information. This is controlled by the redirect URL we chose to use from Microsoft APIs
        //continue the OAuth2 flow
       // [[NXOAuth2AccountStore sharedStore] handleRedirectURL:request.URL];
    }

    return YES;

}
```

### Write code to handle the result of the OAuth2 request

The following code will handle the redirectURL that returns from the WebView. If authentication wasn't successful, the code will try again. Meanwhile, the library will provide the error that you can see in the console or handle asynchronously.

```objc
- (void)handleOAuth2AccessResult:(NSString *)accessResult {

    AppData* data = [AppData getInstance];

    //parse the response for success or failure
     if (accessResult)
    //if success, complete the OAuth2 flow by handling the redirect URL and obtaining a token
     {
         [[NXOAuth2AccountStore sharedStore] handleRedirectURL:accessResult];
    } else {
        //start over
        [self requestOAuth2Access];
    }
}
```

### Set up the OAuth Context (called account store)

Here you can call `-[NXOAuth2AccountStore setClientID:secret:authorizationURL:tokenURL:redirectURL:forAccountType:]` on the shared account store for each service that you want the application to be able to access. The account type is a string that is used as an identifier for a certain service. Because you are accessing the Graph API, the code refers to it as `"myGraphService"`. You then set up an observer that will tell you when anything changes with the token. After you get the token, you return the user back to the `masterView`.



```objc
- (void)setupOAuth2AccountStore {


        AppData* data = [AppData getInstance];

    [[NXOAuth2AccountStore sharedStore] setClientID:data.clientId
                                             secret:data.secret
                                              scope:[NSSet setWithObject:scopes]
                                   authorizationURL:[NSURL URLWithString:authURL]
                                           tokenURL:[NSURL URLWithString:tokenURL]
                                        redirectURL:[NSURL URLWithString:data.redirectUriString]
                                      keyChainGroup: keychain
                                     forAccountType:@"myGraphService"];

    [[NSNotificationCenter defaultCenter] addObserverForName:NXOAuth2AccountStoreAccountsDidChangeNotification
                                                      object:[NXOAuth2AccountStore sharedStore]
                                                       queue:nil
                                                  usingBlock:^(NSNotification *aNotification) {
                                                      if (aNotification.userInfo) {
                                                          //account added, we have access
                                                          //we can now request protected data
                                                          NSLog(@"Success!! We have an access token.");
                                                          dispatch_async(dispatch_get_main_queue(),^ {

                                                              MasterViewController* masterViewController = [self.storyboard instantiateViewControllerWithIdentifier:@"masterView"];
                                                              [self.navigationController pushViewController:masterViewController animated:YES];
                                                          });
                                                      } else {
                                                          //account removed, we lost access
                                                      }
                                                  }];

    [[NSNotificationCenter defaultCenter] addObserverForName:NXOAuth2AccountStoreDidFailToRequestAccessNotification
                                                      object:[NXOAuth2AccountStore sharedStore]
                                                       queue:nil
                                                  usingBlock:^(NSNotification *aNotification) {
                                                      NSError *error = [aNotification.userInfo objectForKey:NXOAuth2AccountStoreErrorKey];
                                                      NSLog(@"Error!! %@", error.localizedDescription);
                                                  }];
}
```

## Set up the Master View to search and display the users from the Graph API

A Master-View-Controller (MVC) app that displays the returned data in the grid is beyond the scope of this walkthrough, and many online tutorials explain how to build one. All this code is in the skeleton file. However, you do need to deal with a few things in this MVC application:

* Intercept when a user types something in the search field
* Provide an object of data back to the MasterView so it can display the results in the grid

We'll do those below.

### Add a check to see if you're logged in

The application does little if the user is not signed in, so it's smart to check if there is already a token in the cache. If not, you redirect to the LoginView for the user to sign in. If you recall, the best way to do actions when a view loads is to use the `viewDidLoad()` method that Apple provides us.

```objc
- (void)viewDidLoad {
    [super viewDidLoad];


    NXOAuth2AccountStore *store = [NXOAuth2AccountStore sharedStore];
    NSArray *accounts = [store accountsWithAccountType:@"myGraphService"];

        if (accounts.count == 0) {

        dispatch_async(dispatch_get_main_queue(),^ {

            LoginViewController* userSelectController = [self.storyboard instantiateViewControllerWithIdentifier:@"LoginUserView"];
            [self.navigationController pushViewController:userSelectController animated:YES];
        });
        }
```

### Update the Table View when data is received

When the Graph API returns data, you need to display the data. For simplicity, here is all the code to update the table. You can just paste the right values in your MVC boilerplate code.

```objc
#pragma mark - Table View

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView {
    return 1;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {

        return [upnArray count];
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {

    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"TaskPrototypeCell" forIndexPath:indexPath];

    if ( cell == nil ) {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:@"TaskPrototypeCell"];
    }

    User *user = nil;
     user = [upnArray objectAtIndex:indexPath.row];


    // Configure the cell
    cell.textLabel.text = user.name;
    [cell setAccessoryType:UITableViewCellAccessoryDisclosureIndicator];

    return cell;
}

```

### Provide a way to call the Graph API when someone types in the search field

When a user types a search in the box, you need to shove that over to the Graph API. The `GraphAPICaller` class, which you will build in the following code, separates the lookup functionality from the presentation. For now, let's write the code that feeds any search characters to the Graph API. We do this by providing a method called `lookupInGraph`, which takes the string that we want to search for.

```objc

-(void)lookupInGraph:(NSString *)searchText {
if (searchText.length > 0) {

    };



        [GraphAPICaller searchUserList:searchText completionBlock:^(NSMutableArray* returnedUpns, NSError* error) {
            if (returnedUpns) {


                upnArray = returnedUpns;


            }
            else
            {
                UIAlertView *alertView = [[UIAlertView alloc]initWithTitle:nil message:[[NSString alloc]initWithFormat:@"Error : %@", error.localizedDescription] delegate:nil cancelButtonTitle:@"Retry" otherButtonTitles:@"Cancel", nil];

                [alertView setDelegate:self];

                dispatch_async(dispatch_get_main_queue(),^ {
                    [alertView show];
                });
            }


        }];


}
```

## Write a Helper class to access the Graph API

This is the core of our application. Whereas the rest was inserting code in the default MVC pattern from Apple, here you write code to query the graph as the user types and then return that data. Here's the code, and a detailed explanation follows it.

### Create a new Objective C header file

Name the file `GraphAPICaller.h`, and add the following code.

```objc
@interface GraphAPICaller : NSObject<NSURLConnectionDataDelegate>

+(void) searchUserList:(NSString*)searchString
       completionBlock:(void (^) (NSMutableArray*, NSError* error))completionBlock;

@end
```

Here you see that a specified method takes a string and returns a completionBlock. This completionBlock, as you may have guessed, will update the table by providing an object with populated data in real time as the user searches.


### Create a new Objective C file

Name the file `GraphAPICaller.m`, and add the following method.

```objc
+(void) searchUserList:(NSString*)searchString
       completionBlock:(void (^) (NSMutableArray* Users, NSError* error)) completionBlock
{
    if (!loadedApplicationSettings)
    {
        [self readApplicationSettings];
    }

    AppData* data = [AppData getInstance];

    NSString *graphURL = [NSString stringWithFormat:@"%@%@/users", data.graphApiUrlString, data.apiversion];

    NXOAuth2AccountStore *store = [NXOAuth2AccountStore sharedStore];
    NSDictionary* params = [self convertParamsToDictionary:searchString];

    NSArray *accounts = [store accountsWithAccountType:@"myGraphService"];
    [NXOAuth2Request performMethod:@"GET"
                        onResource:[NSURL URLWithString:graphURL]
                   usingParameters:params
                       withAccount:accounts[0]
               sendProgressHandler:^(unsigned long long bytesSend, unsigned long long bytesTotal) {
                   // e.g., update a progress indicator
               }
                   responseHandler:^(NSURLResponse *response, NSData *responseData, NSError *error) {
                       // Process the response
                       if (responseData) {
                           NSError *error;
                           NSDictionary *dataReturned = [NSJSONSerialization JSONObjectWithData:responseData options:0 error:nil];
                           NSLog(@"Graph Response was: %@", dataReturned);

                           // We can grab the top most JSON node to get our graph data.
                           NSArray *graphDataArray = [dataReturned objectForKey:@"value"];

                           // Don't be thrown off by the key name being "value". It really is the name of the
                           // first node. :-)

                           //each object is a key value pair
                           NSDictionary *keyValuePairs;
                           NSMutableArray* Users = [[NSMutableArray alloc]init];

                           for(int i =0; i < graphDataArray.count; i++)
                           {
                               keyValuePairs = [graphDataArray objectAtIndex:i];

                               User *s = [[User alloc]init];
                               s.upn = [keyValuePairs valueForKey:@"userPrincipalName"];
                               s.name =[keyValuePairs valueForKey:@"displayName"];
                               s.mail =[keyValuePairs valueForKey:@"mail"];
                               s.businessPhones =[keyValuePairs valueForKey:@"businessPhones"];
                               s.mobilePhones =[keyValuePairs valueForKey:@"mobilePhone"];


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

```

Let's go through this method in detail.

The core of this code is in the `NXOAuth2Request`, method which takes the parameters that you've already defined in the settings.plist file.

The first step is to construct the right Graph API call. Because you are calling `/users`, you specify that by appending it to the Graph API resource along with the version. It makes sense to put these in an external settings file because these can change as the API evolves.


```objc
NSString *graphURL = [NSString stringWithFormat:@"%@%@/users", data.graphApiUrlString, data.apiversion];
```

Next, you need to specify parameters that you will also provide to the Graph API call. It is *very important* that you do not put the parameters in the resource endpoint because that is scrubbed for all non-URI conforming characters at runtime. All query code must be provided in the parameters.

```objc

NSDictionary* params = [self convertParamsToDictionary:searchString];
```

You might notice this calls a `convertParamsToDictionary` method that you haven't written yet. Let's do so now at the end of the file:

```objc
+(NSDictionary*) convertParamsToDictionary:(NSString*)searchString
{
    NSMutableDictionary* dictionary = [[NSMutableDictionary alloc]init];

        NSString *query = [NSString stringWithFormat:@"startswith(givenName, '%@')", searchString];

           [dictionary setValue:query forKey:@"$filter"];



    return dictionary;
}

```
Next, let's use the `NXOAuth2Request` method to get data back from the API in JSON format.

```objc
NSArray *accounts = [store accountsWithAccountType:@"myGraphService"];
    [NXOAuth2Request performMethod:@"GET"
                        onResource:[NSURL URLWithString:graphURL]
                   usingParameters:params
                       withAccount:accounts[0]
               sendProgressHandler:^(unsigned long long bytesSend, unsigned long long bytesTotal) {
                   // e.g., update a progress indicator
               }
                   responseHandler:^(NSURLResponse *response, NSData *responseData, NSError *error) {
                       // Process the response
                       if (responseData) {
                           NSError *error;
                           NSDictionary *dataReturned = [NSJSONSerialization JSONObjectWithData:responseData options:0 error:nil];
                           NSLog(@"Graph Response was: %@", dataReturned);

                           // We can grab the top most JSON node to get our graph data.
                           NSArray *graphDataArray = [dataReturned objectForKey:@"value"];
```

Finally, let's look at how you return the data to the MasterViewController. The data returns as serialized and needs to be deserialized and loaded in an object that the MainViewController can consume. For this purpose, the skeleton has a `User.m/h` file that creates a User object. You populate that User object with information from the graph.

```objc
                           // We can grab the top most JSON node to get our graph data.
                           NSArray *graphDataArray = [dataReturned objectForKey:@"value"];

                           // Don't be thrown off by the key name being "value". It really is the name of the
                           // first node. :-)

                           //each object is a key value pair
                           NSDictionary *keyValuePairs;
                           NSMutableArray* Users = [[NSMutableArray alloc]init];

                           for(int i =0; i < graphDataArray.count; i++)
                           {
                               keyValuePairs = [graphDataArray objectAtIndex:i];

                               User *s = [[User alloc]init];
                               s.upn = [keyValuePairs valueForKey:@"userPrincipalName"];
                               s.name =[keyValuePairs valueForKey:@"displayName"];
                               s.mail =[keyValuePairs valueForKey:@"mail"];
                               s.businessPhones =[keyValuePairs valueForKey:@"businessPhones"];
                               s.mobilePhones =[keyValuePairs valueForKey:@"mobilePhone"];


                               [Users addObject:s];
```


## Run the sample

If you've used the skeleton or followed along with the walkthrough your application should now run. Start the simulator and click **Sign in** to use the application.

## Get security updates for our product

We encourage you to get notifications of when security incidents occur by visiting the [Security TechCenter](https://technet.microsoft.com/security/dd252948) and subscribing to Security Advisory Alerts.
