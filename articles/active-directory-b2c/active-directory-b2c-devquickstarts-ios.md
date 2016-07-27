<properties
	pageTitle="Azure Active Directory B2C: Call a web API from an iOS application using third party libraries| Microsoft Azure"
	description="This article will show you how to create an iOS 'to-do list' app that calls a Node.js web API by using OAuth 2.0 bearer tokens using a third party library"
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

	ms.date="07/26/2016"
	ms.author="brandwe"/>

# Azure AD B2C : Call a web API from an iOS application using a third party library

<!-- TODO [AZURE.INCLUDE [active-directory-b2c-devquickstarts-web-switcher](../../includes/active-directory-b2c-devquickstarts-web-switcher.md)]-->

The Microsoft identity platform uses open standards such as OAuth2 and OpenID Connect. This allows developers to leverage any library they wish to integrate with our services. To aid developers in using our platform with other libraries we've written a few walkthroughs like this one to demonstate how to configure third party libraries to connect to the Microsoft identity platform. Most libraries that implement [the RFC6749 OAuth2 spec](https://tools.ietf.org/html/rfc6749) will be able to connect to the Microsoft Identity platform.


If you're new to OAuth2 or OpenID Connect much of this sample configuration may not make much sense to you. We recommend you look at a brief [overview of the protocol we've documented here](active-directory-b2c-reference-protocols.md).

> [AZURE.NOTE]
    Some features of our platform that do have an expression in these standards, such as Conditional Access and Intune policy management, require you to use our open source Microsoft Azure Identity Libraries. 


> [AZURE.NOTE] 
    Not all Azure Active Directory scenarios & features are supported by the B2C platform.  To determine if you should use the B2C platform, read about [B2C limitations](active-directory-b2c-limitations.md).


> [AZURE.NOTE]
	To work fully, this Quickstart requires that you already have a web API protected by Azure AD B2C. We have built one for both .NET and Node.js that you can use. This walk-through assumes that the Node.js web API sample is configured. Refer to the [Azure Active Directory web API for Node.js sample](active-directory-b2c-devquickstarts-api-node.md) for more.



> [AZURE.NOTE]
	This article does not cover how to implement sign-in, sign-up and profile management by using Azure AD B2C. It focuses on calling web APIs after the user is authenticated. If you haven't already, you should start with the [.NET web app get started tutorial](active-directory-b2c-devquickstarts-web-dotnet.md) to learn about the basics of Azure AD B2C.

## Get an Azure AD B2C directory

Before you can use Azure AD B2C, you must create a directory, or tenant. A directory is a container for all of your users, apps, groups, and more. If you don't have one already, [create a B2C directory](active-directory-b2c-get-started.md) before you continue.

## Create an application

Next, you need to create an app in your B2C directory. This gives Azure AD information that it needs to communicate securely with your app. Both the app and the web API are represented by a single **Application ID** in this case, because they comprise one logical app. To create an app, follow [these instructions](active-directory-b2c-app-registration.md). Be sure to:

- Include a **mobile device** in the application.
- Copy the **Application ID** that is assigned to your app. You will also need this later.

[AZURE.INCLUDE [active-directory-b2c-devquickstarts-v2-apps](../../includes/active-directory-b2c-devquickstarts-v2-apps.md)]

## Create your policies

In Azure AD B2C, every user experience is defined by a [policy](active-directory-b2c-reference-policies.md). This app contains one identity experience: a combined sign in and sign-up. You need to create this policy of each type, as described in the
[policy reference article](active-directory-b2c-reference-policies.md#how-to-create-a-sign-up-policy). When you create the policy, be sure to:

- Choose the **Display name** and sign-up attributes in your policy.
- Choose the **Display name** and **Object ID** application claims in every policy. You can choose other claims as well.
- Copy the **Name** of each policy after you create it. It should have the prefix `b2c_1_`.  You'll need the policy name later.

[AZURE.INCLUDE [active-directory-b2c-devquickstarts-policy](../../includes/active-directory-b2c-devquickstarts-policy.md)]

After you have created your policies, you're ready to build your app.


## Download the code

The code for this tutorial is maintained [on GitHub](https://github.com/Azure-Samples/active-directory-ios-native-nxoauth2-b2c).  To follow along, you can [download the app as a .zip](https://github.com/Azure-Samples/active-directory-ios-native-nxoauth2-b2c)/archive/master.zip) or clone it:

```
git clone git@github.com:Azure-Samples/active-directory-ios-native-nxoauth2-b2c.git
```

Or just download the completed code and get started right away: 

```
git clone --branch complete git@github.com:Azure-Samples/active-directory-ios-native-nxoauth2-b2c.git
```

## Download the third party library nxoauth2 and launch a workspace

For this walkthrough we will use the OAuth2Client from GitHub, an OAuth2 library for Mac OS X & iOS (Cocoa & Cocoa touch). This library is based on draft 10 of the OAuth2 spec. It implements the native application profile and supports the end-user authorization endpoint. These are all the things we'll need in order to integrat with The Microsoft identity platform.

### Adding the library to your project using CocoaPods

CocoaPods is a dependency manager for Xcode projects. It manages the above installation steps automatically.

```
$ vi Podfile
```
Add the following to this podfile:

```
 platform :ios, '8.0'
 
 target 'SampleforB2C' do
 
 pod 'NXOAuth2Client'
 
 end
```

Now load the podfile using cocoapods. This will create a new XCode Workspace you will load.

```
$ pod install
...
$ open SampleforB2C.xcworkspace

```

## The Structure of the Project

We have the following structure set up for our project in the skeleton:

* A **Master View** with a task pane
* A **Add Task View** for the data about the selected task
* A **Login View** that allows a user to sign-in to the app.

We will jump in to various files in the project to add authentication. Other parts of the code such as the visual code is not germane to identity and are provided for you.

## Create the `settings.plist` file for your application

It's easier to configure the application if we have a centralized location to put our configuration values. It also helps you understand what each setting does in your application. We will leverage the *Property List* as a way to provide these values to the application.

* Create/Open the `settings.plist` file under `Supporting Files` in your application workspace

* Enter in the following values (we'll go through them in detail soon)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>accountIdentifier</key>
	<string>B2C_Acccount</string>
	<key>clientID</key>
	<string><client ID></string>
	<key>clientSecret</key>
	<string></string>
	<key>authURL</key>
	<string>https://login.microsoftonline.com/<tenant name>/oauth2/v2.0/authorize?p=<policy name></string>
	<key>loginURL</key>
	<string>https://login.microsoftonline.com/<tenant name>/login</string>
	<key>bhh</key>
	<string>urn:ietf:wg:oauth:2.0:oob</string>
	<key>tokenURL</key>
	<string>https://login.microsoftonline.com/<tenant name>/oauth2/v2.0/token?p=<policy name></string>
	<key>keychain</key>
	<string>com.microsoft.azureactivedirectory.samples.graph.QuickStart</string>
	<key>contentType</key>
	<string>application/x-www-form-urlencoded</string>
	<key>taskAPI</key>
	<string>https://aadb2cplayground.azurewebsites.net</string>
</dict>
</plist>
```

Let's go in to these in detail.


For `authURL`, `loginURL`, `bhh`, `tokenURL` you'll notice you need to fill in your tenant name. This is the tenant name of your B2C tenant that was assigned to you. For instance, `kidventusb2c.onmicrosoft.com`.If you use our open source Microsoft Azure Identity Libraries we would pull this data down for you using our metadata endpoint. We've done the hard work of extracting these values for you.

For more information on B2C tenant names take a look here: [active-directory-b2c-devquickstarts-tenant-name](../../includes/active-directory-b2c-devquickstarts-tenant-name.md)

The `keychain` value is the container that the NXOAuth2Client library will use to create a keychain to store your tokens. If you'd like to get SSO across numerous apps you can specify the same keychain in each of your applications as well as request the use of that keychain in your XCode entitements. This is covered in the Apple documentation.

The `<policy name>`  at the end of each URL are the places where you'd put the policy you created above. The app will call these policies depending on the flow.

The `taskAPI` is the REST Endpoint we will call with your B2C token to either add tasks or query existing tasks. This has been set up specifically for this sample. You don't need to change it for the sample to work.

The rest of these values are required to use the library and simply create places for you to carry values to the context.

Now that we have the `settings.plist` file created, we need code to read it.

## Set up a AppData class to read our settings

Let's make a simple file that just parses our `settngs.plist` file we created above and make those settings avaialble in the future to any class. Since we don't want to create a new copy of the data every time a class asks for it, we will use a Singleton pattern and only return the same instance created each time a request is made for the settings

* Create an `AppData.h` file:

```objc
#import <Foundation/Foundation.h>

@interface AppData : NSObject

@property(strong) NSString *accountIdentifier;
@property(strong) NSString *taskApiString;
@property(strong) NSString *authURL;
@property(strong) NSString *clientID;
@property(strong) NSString *loginURL;
@property(strong) NSString *bhh;
@property(strong) NSString *keychain;
@property(strong) NSString *tokenURL;
@property(strong) NSString *clientSecret;
@property(strong) NSString *contentType;

+ (id)getInstance;

@end
```

* Create an `AppData.m` file:

```objc
#import "AppData.h"

@implementation AppData

+ (id)getInstance {
  static AppData *instance = nil;
  static dispatch_once_t onceToken;

  dispatch_once(&onceToken, ^{
    instance = [[self alloc] init];

    NSDictionary *dictionary = [NSDictionary
        dictionaryWithContentsOfFile:[[NSBundle mainBundle]
                                         pathForResource:@"settings"
                                                  ofType:@"plist"]];
    instance.accountIdentifier = [dictionary objectForKey:@"accountIdentifier"];
    instance.clientID = [dictionary objectForKey:@"clientID"];
    instance.clientSecret = [dictionary objectForKey:@"clientSecret"];
    instance.authURL = [dictionary objectForKey:@"authURL"];
    instance.loginURL = [dictionary objectForKey:@"loginURL"];
    instance.bhh = [dictionary objectForKey:@"bhh"];
    instance.tokenURL = [dictionary objectForKey:@"tokenURL"];
    instance.keychain = [dictionary objectForKey:@"keychain"];
    instance.contentType = [dictionary objectForKey:@"contentType"];
    instance.taskApiString = [dictionary objectForKey:@"taskAPI"];

  });

  return instance;
}
@end
```

Now we can easily get at our data by simply calling `  AppData *data = [AppData getInstance];` in any of our classes as you'll see below.



## Set up the NXOAuth2Client library in your AppDelegate

The NXOAuthClient library requires some values to get set up. Once that is complete you can use the token that is aquired to call the REST API. Since we know that the `AppDelegate` will be called any time we load the application it makes sense that we put our configuration values in to that file.
* Open `AppDelegate.m` file

* Import some header files we will use later.

```objc
#import "NXOAuth2.h" // the Identity library we are using
#import "AppData.h" // the class we just created we will use to load the settings of our application
```

* Add the `setupOAuth2AccountStore` method in the AppDelegate

We need to create an AccountStore and then feed it the data we just read in from the `settings.plist` file.

There are some things you should be aware of regarding the B2C service at this point that will make this code more understandable:

> [AZURE.NOTE] 
    Azure AD B2C uses the *policy* as provided by the query parameters to service your request. This allows Azure Active Directory to act as an independent service just for your application. In order to provide these extra query parameters we need to provide the `kNXOAuth2AccountStoreConfigurationAdditionalAuthenticationParameters:` method with our custom policy parameters. 

> [AZURE.NOTE]
    Azure AD B2C uses scopes in much the same way as other OAuth2 servers. However since the use of B2C is as much about authenticating a user as accessing resources some scopes are absolutely required in order for the flow to work correctly. This is the `openid` scope. Our Microsoft identity SDKs automatically provide the `openid` scope for you so you won't see that in our SDK configuration. Since we are using a third party library, however, we need to specify this scope.

```objc
- (void)setupOAuth2AccountStore {
  AppData *data = [AppData getInstance]; // The singleton we use to get the settings

  NSDictionary *customHeaders =
      [NSDictionary dictionaryWithObject:@"application/x-www-form-urlencoded"
                                  forKey:@"Content-Type"];

  // Azure B2C needs
  // kNXOAuth2AccountStoreConfigurationAdditionalAuthenticationParameters for
  // sending policy to the server,
  // therefore we use -setConfiguration:forAccountType:
  NSDictionary *B2cConfigDict = @{
    kNXOAuth2AccountStoreConfigurationClientID : data.clientID,
    kNXOAuth2AccountStoreConfigurationSecret : data.clientSecret,
    kNXOAuth2AccountStoreConfigurationScope :
        [NSSet setWithObjects:@"openid", data.clientID, nil],
    kNXOAuth2AccountStoreConfigurationAuthorizeURL :
        [NSURL URLWithString:data.authURL],
    kNXOAuth2AccountStoreConfigurationTokenURL :
        [NSURL URLWithString:data.tokenURL],
    kNXOAuth2AccountStoreConfigurationRedirectURL :
        [NSURL URLWithString:data.bhh],
    kNXOAuth2AccountStoreConfigurationCustomHeaderFields : customHeaders,
    //      kNXOAuth2AccountStoreConfigurationAdditionalAuthenticationParameters:customAuthenticationParameters
  };

  [[NXOAuth2AccountStore sharedStore] setConfiguration:B2cConfigDict
                                        forAccountType:data.accountIdentifier];
}
```
Next, make sure you call it in the AppDelegate under `didFinishLaunchingWithOptions:` method. 

```
[self setupOAuth2AccountStore];
```


* Create a URL Cache

Inside of `(void)viewDidLoad()`, which is always called once the view is loaded, we prime a cache for our use.

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

## Create a `LoginViewController` class that we will use to handle Authentication requests

We use a webview for account sign-in. This allows us to prompt the user for additional factors like SMS text message (if configured) or give error messages back to the user. Here we'll set up the webview and then later write the code to handle the callbacks that will happen in the WebView from the Microsoft Identity Service.

* Create a `LoginViewController.h` class

```objc
@interface LoginViewController : UIViewController <UIWebViewDelegate>
@property(weak, nonatomic) IBOutlet UIWebView *loginView; // Our webview that we will use to do authentication

- (void)handleOAuth2AccessResult:(NSURL *)accessResult; // Allows us to get a token after we've received an Access code.
- (void)setupOAuth2AccountStore; // We will need to add to our OAuth2AccountStore we setup in our AppDelegate
- (void)requestOAuth2Access; // This is where we invoke our webview.
```

We will create each of these methods below.

> [AZURE.NOTE] 
    Make sure that you bind the `loginView` to the actual webview that is inside your storyboard. Otherwise you won't have a webview that can pop up when it's time to authenticate.

* Create a `LoginViewController.m` class

* Add some variables to carry state as we authenticate

```objc
NSURL *myRequestedUrl; \\ The URL request to Azure Active Directory 
NSURL *myLoadedUrl; \\ The URL loaded for Azure Active Directory
bool loginFlow = FALSE; 
bool isRequestBusy; \\ A way to give status to the thread that the request is still happening
NSURL *authcode; \\ A placeholder for our auth code.
```

* Override the WebView methods to handle authentication

We need to tell the webview the behavior we want when a user needs to login as discussed above. You can simply cut and paste the code below.

```objc
- (void)resolveUsingUIWebView:(NSURL *)URL {
  // We get the auth token from a redirect so we need to handle that in the
  // webview.

  if (![NSThread isMainThread]) {
    [self performSelectorOnMainThread:@selector(resolveUsingUIWebView:)
                           withObject:URL
                        waitUntilDone:YES];
    return;
  }

  NSURLRequest *hostnameURLRequest =
      [NSURLRequest requestWithURL:URL
                       cachePolicy:NSURLRequestUseProtocolCachePolicy
                   timeoutInterval:10.0f];
  isRequestBusy = YES;
  [self.loginView loadRequest:hostnameURLRequest];

  NSLog(@"resolveUsingUIWebView ready (status: UNKNOWN, URL: %@)",
        self.loginView.request.URL);
}

- (BOOL)webView:(UIWebView *)webView
    shouldStartLoadWithRequest:(NSURLRequest *)request
                navigationType:(UIWebViewNavigationType)navigationType {
  AppData *data = [AppData getInstance];

  NSLog(@"webView:shouldStartLoadWithRequest: %@ (%li)", request.URL,
        (long)navigationType);

  // The webview is where all the communication happens. Slightly complicated.

  myLoadedUrl = [webView.request mainDocumentURL];
  NSLog(@"***Loaded url: %@", myLoadedUrl);

  // if the UIWebView is showing our authorization URL or consent URL, show the
  // UIWebView control
  if ([request.URL.absoluteString rangeOfString:data.authURL
                                        options:NSCaseInsensitiveSearch]
          .location != NSNotFound) {
    self.loginView.hidden = NO;
  } else if ([request.URL.absoluteString rangeOfString:data.loginURL
                                               options:NSCaseInsensitiveSearch]
                 .location != NSNotFound) {
    // otherwise hide the UIWebView, we've left the authorization flow
    self.loginView.hidden = NO;
  } else if ([request.URL.absoluteString rangeOfString:data.bhh
                                               options:NSCaseInsensitiveSearch]
                 .location != NSNotFound) {
    // otherwise hide the UIWebView, we've left the authorization flow
    self.loginView.hidden = YES;
    [[NXOAuth2AccountStore sharedStore] handleRedirectURL:request.URL];
  } else {
    self.loginView.hidden = NO;
    // read the Location from the UIWebView, this is how Microsoft APIs is
    // returning the
    // authentication code and relation information. This is controlled by the
    // redirect URL we chose to use from Microsoft APIs
    // continue the OAuth2 flow
    // [[NXOAuth2AccountStore sharedStore] handleRedirectURL:request.URL];
  }

  return YES;
}

```

* Write code to handle the result of the OAuth2 request

We'll need code that will handle the redirectURL that comes back from the WebView. If it wasn't successful, we will try again. Meanwhile the library will provide the error that you can see in the console or handle asyncronously. 

```objc
- (void)handleOAuth2AccessResult:(NSURL *)accessResult {
  // parse the response for success or failure
  if (accessResult)
  // if success, complete the OAuth2 flow by handling the redirect URL and
  // obtaining a token
  {
    [[NXOAuth2AccountStore sharedStore] handleRedirectURL:accessResult];
  } else {
    // start over
    [self requestOAuth2Access];
  }
}
```

* Set up the Notification factories.

We create the same method we did in the `AppDelegate` above, but this time we will add some `NSNotification`s to tell us what is happening in our service. We set up an observer that will tell us when anything changes with the token. Once we get the token we return the user back to the `masterView`.



```objc
- (void)setupOAuth2AccountStore {
  [[NSNotificationCenter defaultCenter]
      addObserverForName:NXOAuth2AccountStoreAccountsDidChangeNotification
                  object:[NXOAuth2AccountStore sharedStore]
                   queue:nil
              usingBlock:^(NSNotification *aNotification) {
                if (aNotification.userInfo) {
                  // account added, we have access
                  // we can now request protected data
                  NSLog(@"Success!! We have an access token.");
                  dispatch_async(dispatch_get_main_queue(), ^{

                    MasterViewController *masterViewController =
                        [self.storyboard
                            instantiateViewControllerWithIdentifier:@"master"];
                    [self.navigationController
                        pushViewController:masterViewController
                                  animated:YES];
                  });
                } else {
                  // account removed, we lost access
                }
              }];

  [[NSNotificationCenter defaultCenter]
      addObserverForName:NXOAuth2AccountStoreDidFailToRequestAccessNotification
                  object:[NXOAuth2AccountStore sharedStore]
                   queue:nil
              usingBlock:^(NSNotification *aNotification) {
                NSError *error = [aNotification.userInfo
                    objectForKey:NXOAuth2AccountStoreErrorKey];
                NSLog(@"Error!! %@", error.localizedDescription);
              }];
}

```
* Add code that handles the user whenever a request is initiated for sign-native

Let's create a method that will be called whenever we have a request for authentication. This will be the method that actually creates a webview

```objc
- (void)requestOAuth2Access {
  AppData *data = [AppData getInstance];

  // in order to login to Mircosoft APIs using OAuth2 we must show an embedded
  // browser (UIWebView)
  [[NXOAuth2AccountStore sharedStore]
           requestAccessToAccountWithType:data.accountIdentifier
      withPreparedAuthorizationURLHandler:^(NSURL *preparedURL) {
        // navigate to the URL returned by NXOAuth2Client

        NSURLRequest *r = [NSURLRequest requestWithURL:preparedURL];
        [self.loginView loadRequest:r];
      }];
}
```

* Finally, let's call all these methods we've written above every time the `LoginViewController` loads. We do this by adding these methods to our `viewDidLoad` method Apple gives us

```objc
  [super viewDidLoad];
  // Do any additional setup after loading the view.

  // OAuth2 Code

  self.loginView.delegate = self;
  [self requestOAuth2Access];
  [self setupOAuth2AccountStore];
  NSURLCache *URLCache =
      [[NSURLCache alloc] initWithMemoryCapacity:4 * 1024 * 1024
                                    diskCapacity:20 * 1024 * 1024
                                        diskPath:nil];
  [NSURLCache setSharedURLCache:URLCache];
```

You are now done with creating the main way we'll interact with our application for sign in. After we've signed in, we'll need to use our tokens we've received. For that we'll create some helper code that will call REST APIs for us using this library.


## Create a `GraphAPICaller` class to handle our requests to a REST API

We have a configuration loaded every time we load our app. Now we need to do something with it once we have a token. 

* Create a `GraphAPICaller.h`  file

```objc
@interface GraphAPICaller : NSObject <NSURLConnectionDataDelegate>

+ (void)addTask:(Task *)task
completionBlock:(void (^)(bool, NSError *error))completionBlock;

+ (void)getTaskList:(void (^)(NSMutableArray *, NSError *error))completionBlock;

@end
```

You see from this code that we will be creating two methods: one to get the tasks from an API and another to add tasks to the API.

Now that we've set up our interface, let's add the actual implementation:

* Create a `GraphAPICaller.m file`

```objc
@implementation GraphAPICaller

// 
// Gets the tasks from our REST endpoint we specified in settings
//

+ (void)getTaskList:(void (^)(NSMutableArray *, NSError *))completionBlock

{
  AppData *data = [AppData getInstance];

  NSString *taskURL =
      [NSString stringWithFormat:@"%@%@", data.taskApiString, @"/api/tasks"];

  NXOAuth2AccountStore *store = [NXOAuth2AccountStore sharedStore];
  NSMutableArray *Tasks = [[NSMutableArray alloc] init];

  NSArray *accounts = [store accountsWithAccountType:data.accountIdentifier];
  [NXOAuth2Request performMethod:@"GET"
      onResource:[NSURL URLWithString:taskURL]
      usingParameters:nil
      withAccount:accounts[0]
      sendProgressHandler:^(unsigned long long bytesSend,
                            unsigned long long bytesTotal) {
        // e.g., update a progress indicator
      }
      responseHandler:^(NSURLResponse *response, NSData *responseData,
                        NSError *error) {
        // Process the response
        if (!error) {
          NSDictionary *dataReturned =
              [NSJSONSerialization JSONObjectWithData:responseData
                                              options:0
                                                error:nil];
          NSLog(@"Graph Response was: %@", dataReturned);

          if ([dataReturned count] != 0) {

            for (NSMutableDictionary *theTask in dataReturned) {

              Task *t = [[Task alloc] init];
              t.name = [theTask valueForKey:@"Text"];

              [Tasks addObject:t];
            }
          }

          completionBlock(Tasks, nil);
        } else {
          completionBlock(nil, error);
        }

      }];
}

// 
// Adds a task from our REST endpoint we specified in settings
//

+ (void)addTask:(Task *)task
completionBlock:(void (^)(bool, NSError *error))completionBlock {

  AppData *data = [AppData getInstance];

  NSString *taskURL =
      [NSString stringWithFormat:@"%@%@", data.taskApiString, @"/api/tasks"];

  NXOAuth2AccountStore *store = [NXOAuth2AccountStore sharedStore];
  NSDictionary *params = [self convertParamsToDictionary:task.name];

  NSArray *accounts = [store accountsWithAccountType:data.accountIdentifier];
  [NXOAuth2Request performMethod:@"POST"
      onResource:[NSURL URLWithString:taskURL]
      usingParameters:params
      withAccount:accounts[0]
      sendProgressHandler:^(unsigned long long bytesSend,
                            unsigned long long bytesTotal) {
        // e.g., update a progress indicator
      }
      responseHandler:^(NSURLResponse *response, NSData *responseData,
                        NSError *error) {
        // Process the response
        if (responseData) {
          NSDictionary *dataReturned =
              [NSJSONSerialization JSONObjectWithData:responseData
                                              options:0
                                                error:nil];
          NSLog(@"Graph Response was: %@", dataReturned);

          completionBlock(TRUE, nil);
        } else {
          completionBlock(FALSE, error);
        }

      }];
}

+ (NSDictionary *)convertParamsToDictionary:(NSString *)task {
  NSMutableDictionary *dictionary = [[NSMutableDictionary alloc] init];

  [dictionary setValue:task forKey:@"Text"];

  return dictionary;
}

@end
```

## Run the sample app

Finally, build and run the app in Xcode. Sign up or sign in to the app, and create tasks for a signed-in user. Sign out and sign back in as a different user, and create tasks for that user.

Notice that the tasks are stored per-user on the API, because the API extracts the user's identity from the access token that it receives.


## Next steps

You can now move onto more advanced B2C topics. You might try:

[Call a Node.js web API from a Node.js web app]()

[Customize the UX for a B2C app]()
