<properties
	pageTitle="Azure AD v2.0 iOS App | Microsoft Azure"
	description="How to build an iOS app that signs users in with both personal Microsoft Account and work or school accounts using third party libraries."
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

# Add sign-in to an iOS app using a third party library with Graph API using the v2.0 endpoint

The Microsoft identity platform uses open standards such as OAuth2 and OpenID Connect. This allows developers to leverage any library they wish to integrate with our services. To aid developers in using our platform with other libraries we've written a few walkthroughs like this one to demonstate how to configure third party libraries to connect to the Microsoft identity platform. Most libraries that implement [the RFC6749 OAuth2 spec](https://tools.ietf.org/html/rfc6749) will be able to connect to the Microsoft Identity platform.

This application will allow a user to sign-in to their organization and then search for others in their organization using the Graph API.

If you're new to OAuth2 or OpenID Connect much of this sample configuration may not make much sense to you. We recommend you look at a brief [overview of the protocol we've documented here](active-directory-v2-protocols-oauth-code.md).


> [AZURE.NOTE]
    Some features of our platform that do have an expression in these standards, such as Conditional Access and Intune policy management, require you to use our open source Microsoft Azure Identity Libraries. 

> [AZURE.NOTE] 
    Not all Azure Active Directory scenarios & features are supported by the v2.0 endpoint.  To determine if you should use the v2.0 endpoint, read about [v2.0 limitations](active-directory-v2-limitations.md).

## Download
The code for this tutorial is maintained [on GitHub](https://github.com/Azure-Samples/active-directory-ios-native-nxoauth2-v2).  To follow along, you can [download the app's skeleton as a .zip](https://github.com/AzureADQuickStarts/AppModelv2-WebAPI-DotNet/archive/skeleton.zip) or clone the skeleton:

```
git clone --branch skeleton git@github.com:Azure-Samples/active-directory-ios-native-nxoauth2-v2.git
```

Or just download and get started right away: 

```
git clone git@github.com:Azure-Samples/active-directory-ios-native-nxoauth2-v2.git
```

## Register an app
Create a new app at [apps.dev.microsoft.com](https://apps.dev.microsoft.com), or follow these [detailed steps](active-directory-v2-app-registration.md).  Make sure to:

- Copy down the **Application Id** assigned to your app, you'll need it soon.
- Add the **Mobile** platform for your app.
- Copy down the **Redirect URI** from the portal. You must use the default value of `urn:ietf:wg:oauth:2.0:oob`.


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
 
 target 'QuickStart' do
 
 pod 'NXOAuth2Client'
 
 end
```

Now load the podfile using cocoapods. This will create a new XCode Workspace you will load.

```
$ pod install
...
$ open QuickStart.xcworkspace
```

## The Structure of the Project

We have the following structure set up for our project in the skeleton:

* A Master View with a UPN Search
* A Detail View for the data about the selected user
* A Login View that allows a user to sign-in to the app to query the graph.

We will jump in to various files in the skeleton to add authentication. Other parts of the code such as the visual code is not germane to identity and are provided for you.

## Set up the settings.plst file in the library

-	In the QuickStart project, open the plist file `settings.plist`.  Replace the values of the elements in the section to reflect the values you input into the Azure Portal.  Your code will reference these values whenever it uses ADAL.
    -	The `clientId` is the clientId of your application you copied from the portal.
    -	The `redirectUri` is the redirect url you were provided by the portal.

## Set up the NXOAuth2Client library in your LoginViewController

The NXOAuthClient library requires some values to get set up. Once that is complete you can use the token that is aquired to call the Graph API. Since we know that the `LoginView` will be called any time we need to authentication it makes sense that we put our conifugration values in to that file.
* Open `LoginViewController.m` file

* Let's add some values in the code that will set the context for our authentication and authorization. I'll explain these in detail below.

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

Let's go in to these in detail.

The first string we set is for the `scopes`.  The scopes we will be requesting for this application is `User.ReadBasic.All` which allows us to read the basic profile of all the users in our directory.
You can learn more about all the scopes that avaialble to [use with the Microsft Graph here](https://graph.microsoft.io/docs/authorization/permission_scopes).

For `authURL`, `loginURL`, `bhh`, `tokenURL` you should use the values provided above. If you use our open source Microsoft Azure Identity Libraries we would pull this data down for you using our metadata endpoint. We've done the hard work of extracting these values for you.

The `keychain` value is the container that the NXOAuth2Client library will use to create a keychain to store your tokens. If you'd like to get SSO across numerous apps you can specify the same keychain in each of your applications as well as request the use of that keychain in your XCode entitements. This is covered in the Apple documentation.

The rest of these values are required to use the library and simply create places for you to carry values to the context.

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

* Create a webview we will use to sign-in.

We use a webview for account sign-in. This allows us to prompt the user for additional factors like SMS text message (if configured) or give error messages back to the user. Here we'll set up the webview and then later write the code to handle the callbacks that will happen in the WebView from the Microsoft Identity Service.

```objc
-(void)requestOAuth2Access {
    //in order to login to Mircosoft APIs using OAuth2 we must show an embedded browser (UIWebView)
    [[NXOAuth2AccountStore sharedStore] requestAccessToAccountWithType:@"myGraphService"
                                   withPreparedAuthorizationURLHandler:^(NSURL *preparedURL) {
                                       //navigate to the URL returned by NXOAuth2Client
                                       
                                       NSURLRequest *r = [NSURLRequest requestWithURL:preparedURL];
                                       [self.loginView loadRequest:r];
                                   }];
}
```

* Override the WebView methods to handle authentication

We need to tell the webview the behavior we want when a user needs to login as discussed above. You can simply cut and paste the code below.

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

* Write code to handle the result of the OAuth2 request

We'll need code that will handle the redirectURL that comes back from the WebView. If it wasn't successful, we will try again. Meanwhile the library will provide the error that you can see in the console or handle asyncronously. 

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

* Set up the OAuth Context (Called Account Store)

Here you can call `-[NXOAuth2AccountStore setClientID:secret:authorizationURL:tokenURL:redirectURL:forAccountType:]` on the shared account store for each service you want to have access to from your application. The account type is a string which is used as an identifier for a certain service. Since we are accessing the Graph API, we'll go ahead and call it `"myGraphService"`. We then set up an observer that will tell us when anything changes with the token. Once we get the token we return the user back to the `masterView`.



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

## Set up the MasterView to search and display the users from the Graph API

A MVC app that displays the returned data in the grid is beyond the scope of this walkthrough, and there are many tutorials online to explain how to build one. We provide all this code for you in the skeleton file. However, we do need to deal with a few things in this MVC application:

* Intercept when a user types something in the search field
* Provide an object of data back to the MasterView so it can display the results in the grid

We'll do those below.

* Add a check to see if we're logged in

The application does little if the user is not logged in, so it's smart to check if there is already a token in our cache. If not, we redirect to the LoginView for the user to sign-in. If you recall, the best way to do actions when a view loads is to use the `viewDidLoad()` method Apple provides us.

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

* Update the Table View when data is received

When we get data back from the Graph API we need to dispaly the data that is returned. For simplicity here is all the code to update the table. You can just paste the right values in your MVC boilerplate code.

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

* Provide a way to call the Graph API when someone types in the search field

When someone types a search in the box we need to shove that over to the Graph API. To better separate the lookup functionality from the presentation we build another class called `GraphAPICaller` which we will build below. For now, let's go ahead and write the code to allow for feeding any search characters in to the Graph API. We do this by providing a method called `lookupInGraph` that takes the string we want to search for.

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

This is the meat of our application. Whereas the rest was inserting code in to the default MVC pattern from Apple, here we write code to query the graph as the user types and return that data. We will show the code and then explain it in detail.

* Create a new Objective C header file called `GraphAPICaller.h` with the following code:

```objc
@interface GraphAPICaller : NSObject<NSURLConnectionDataDelegate>

+(void) searchUserList:(NSString*)searchString
       completionBlock:(void (^) (NSMutableArray*, NSError* error))completionBlock;

@end
```

Here you see that we are specifying a method that takes a string and returns a completionBlock. This completionBlock, as you may have guessed, will udpate the table by provding an object with populated data in real-time as the user searches. 


* Create a new Objective C file called `GraphAPICaller.m` and add the following method:

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

Let's go through this method in detail

The meat of this code is in the `NXOAuth2Request` method which takes the paramters that we've defined inside of the settings.plist file early on.
Our first step is to construct the right Graph API call. Since we are calling `/users` we specify that by appending it to our Graph API resource along with the version. It makes sense to put these in an external settings life since these can change as the API evolves.


```objc
NSString *graphURL = [NSString stringWithFormat:@"%@%@/users", data.graphApiUrlString, data.apiversion];
```

Next, we need to specify parameters that we will also provide to the Graph API call. It is *very important* that you do not put the parameters in the resource endpoint as that is scrubbed for any non-URI conforming characters at runtime. All query code must be provided in the parameters.

```objc

NSDictionary* params = [self convertParamsToDictionary:searchString];
```

You might notice this calls a method `convertParamsToDictionary` we haven't written yet. Let's do so now at the end of the file:

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

Finally, let's look at how we return the data to the MasterViewController. The data comes back to us as serialzied and needs to be deserialized and loaded in to an object that the MainViewController can consume. For this purpose the Skeleton has a `User.m/h` file that creates a User object. We popuate that user object with information from the graph.

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

If you've used the skeleton or followed along with the walkthrough your application should now run. Launch the simulator and click "sign-in" to use the application.

## Get security updates for our product

We encourage you to get notifications of when security incidents occur by visiting [this page](https://technet.microsoft.com/security/dd252948) and subscribing to Security Advisory Alerts.