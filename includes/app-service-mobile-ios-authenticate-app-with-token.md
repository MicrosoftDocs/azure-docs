
The previous example shows a standard sign-in, which requires the client to contact both the identity provider and the App Service every time the app starts. This method is inefficient, and it would be better to cache the authorization token returned by App Service and try to use this first before using a provider-based sign-in.

1. The recommended way to encrypt and store authentication tokens on an iOS client is use the iOS Keychain. This tutorial uses [SSKeychain](https://github.com/soffes/sskeychain) -- a simple wrapper around the iOS Keychain. Follow the instructions on the SSKeychain page and add it to your project. Verify that the **Enable Modules** setting is enabled in the project's **Build Settings** (section **Apple LLVM - Languages - Modules**.)

2. Open **QSTodoListViewController.m** and add the following code:


		- (void) saveAuthInfo {
				[SSKeychain setPassword:self.todoService.client.currentUser.mobileServiceAuthenticationToken forService:@"AzureMobileServiceTutorial" account:self.todoService.client.currentUser.userId]
		}


		- (void)loadAuthInfo {
				NSString *userid = [[SSKeychain accountsForService:@"AzureMobileServiceTutorial"][0] valueForKey:@"acct"];
		    if (userid) {
		        NSLog(@"userid: %@", userid);
		        self.todoService.client.currentUser = [[MSUser alloc] initWithUserId:userid];
		         self.todoService.client.currentUser.mobileServiceAuthenticationToken = [SSKeychain passwordForService:@"AzureMobileServiceTutorial" account:userid];

		    }
		}

3. In the `loginAndGetData` method, modify the `loginWithProvider:controller:animated:completion:` call's completion block by adding a call to `saveAuthInfo` right before the line `[self refresh]`. With this call, we simply store the user ID and token properties:

				[self saveAuthInfo];

4. Let's also load the user ID and token when the app starts. In the `viewDidLoad` method in **QSTodoListViewController.m**, add a call to loadAuthInfo right after `self.todoService` has been initialized.

				[self loadAuthInfo];
