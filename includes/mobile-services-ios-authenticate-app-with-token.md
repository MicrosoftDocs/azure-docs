
The previous example showed a standard sign-in, which requires the client to contact both the identity provider and the mobile service every time that the app starts. Not only is this method inefficient, you can run into usage-relates issues should many customers try to start you app at the same time. A better approach is to cache the authorization token returned by Mobile Services and try to use this first before using a provider-based sign-in. 


>[WACOM.NOTE] You can cache the token issued by Mobile Services regardless of whether you are using client-managed or service-managed authentication. This tutorial uses service-managed authentication.

1. The recommended way to encrypt and store authentication tokens on an iOS client is use the Keychain. To do this, create a class KeychainWrapper, copying [KeychainWrapper.m](https://github.com/WindowsAzure-Samples/iOS-LensRocket/blob/master/source/client/LensRocket/Misc/KeychainWrapper.m) and [KeychainWrapper.h](https://github.com/WindowsAzure-Samples/iOS-LensRocket/blob/master/source/client/LensRocket/Misc/KeychainWrapper.h) from the [LensRocket sample](https://github.com/WindowsAzure-Samples/iOS-LensRocket). We use this KeychainWrapper as the KeychainWrapper defined in Apple's documentation does not account for automatic reference counting (ARC).


2. Open the project file **QSTodoListViewController.m** and add the following code:

		
		- (void) saveAuthInfo{
		    [KeychainWrapper createKeychainValue:self.todoService.client.currentUser.userId
				 forIdentifier:@"userid"];
		    [KeychainWrapper createKeychainValue:self.todoService.client.currentUser.mobileServiceAuthenticationToken
				 forIdentifier:@"token"];
		}
		
		
		- (void)loadAuthInfo {
		    NSString *userid = [KeychainWrapper keychainStringFromMatchingIdentifier:@"userid"];
		    if (userid) {
		        NSLog(@"userid: %@", userid);
		        self.todoService.client.currentUser = [[MSUser alloc] initWithUserId:userid];
		        self.todoService.client.currentUser.mobileServiceAuthenticationToken = [KeychainWrapper keychainStringFromMatchingIdentifier:@"token"];
		    }
		}
		


3. At the end of the **viewDidAppear** method in **QSTodoListViewController.m**, add a call to saveAuthInfo. With this call, we are simply storing the userId and token properties.  



		- (void)viewDidAppear:(BOOL)animated
		{
		    MSClient *client = self.todoService.client;
		
		    if (client.currentUser != nil) {
		        return;
		    }
		
		    [client loginWithProvider:@"facebook" controller:self animated:YES completion:^(MSUser *user, NSError *error) {
		
		        [self saveAuthInfo];
		        [self refresh];
		    }];
		}

  
4. Now that we've seen how we can cache the user token and ID, let's see how we can load that when the app starts. In the **viewDidLoad** method in **QSTodoListViewController.m**, add a call to loadAuthInfo, after **self.todoService** has been initialized. 
		
		- (void)viewDidLoad
		{
		    [super viewDidLoad];
		    
		    // Create the todoService - this creates the Mobile Service client inside the wrapped service
		    self.todoService = [QSTodoService defaultService];

			[self loadAuthInfo];
		    
		    // Set the busy method
		    UIActivityIndicatorView *indicator = self.activityIndicator;
		    self.todoService.busyUpdate = ^(BOOL busy)
		    {
		        if (busy)
		        {
		            [indicator startAnimating];
		        } else
		        {
		            [indicator stopAnimating];
		        }
		    };
		    
		    // have refresh control reload all data from server
		    [self.refreshControl addTarget:self
		                            action:@selector(onRefresh:)
		                  forControlEvents:UIControlEventValueChanged];
		
		    // load the data
		    [self refresh];
		}

5. If the app makes a request to your Mobile Service that should get through because the user is authenticated and you receive a 401 response (unauthorized error), it means the user token you're passing over has expired. In the completion handler for every method that we have that interacts with our Mobile Service, we could check for a 401 response, or we can handle things in one place: the MSFilter's handleRequest method.  To see how to handle this scenario, see [this blog post](http://www.thejoyofcode.com/Handling_expired_tokens_in_your_application_Day_11_.aspx)

