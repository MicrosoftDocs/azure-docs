
The previous example contacts both the identity provider and the mobile service every time the app starts. Instead, you can cache the authorization token and try to use it first.

* The recommended way to encrypt and store authentication tokens on an iOS client is use the iOS Keychain. We'll use [SSKeychain](https://github.com/soffes/sskeychain) -- a simple wrapper around the iOS Keychain. Follow the instructions on the SSKeychain page and add it to your project. Verify that the **Enable Modules** setting is enabled in the project's **Build Settings** (section **Apple LLVM - Languages - Modules**.)

* Open **QSTodoListViewController.m** and add the following code:

```
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
```

* In `loginAndGetData`, modify  `loginWithProvider:controller:animated:completion:`'s completion block. Add the following line right before `[self refresh]` to store the user ID and token properties:

```
				[self saveAuthInfo];
```

* Let's load the user ID and token when the app starts. In the `viewDidLoad` in **QSTodoListViewController.m**, add this right after`self.todoService` is initialized.

```
				[self loadAuthInfo];
```
