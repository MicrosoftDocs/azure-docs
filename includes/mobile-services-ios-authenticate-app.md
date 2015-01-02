

1. Open the project file QSTodoListViewController.m and in the **viewDidLoad** method, remove the following code that reloads the data into the table:

        [self refresh];

2.	Just after the **viewDidLoad** method, add the following code:  

        - (void)viewDidAppear:(BOOL)animated
        {
            MSClient *client = self.todoService.client;
            
            if (client.currentUser != nil) {
                return;
            }
            
            [client loginWithProvider:@"facebook" controller:self animated:YES completion:^(MSUser *user, NSError *error) {
                [self refresh];
            }];
        }

    > [AZURE.NOTE] If you are using an identity provider other than Facebook, change the value passed to **loginWithProvider** above to one of the following: _microsoftaccount_, _facebook_, _twitter_, _google_, or _windowsazureactivedirectory_.
		
3. Press the **Run** button to build the project, start the app in the iPhone emulator, then log-on with your chosen identity provider.

   	When you are successfully logged-in, the app should run without errors, and you should be able to query Mobile Services and make updates to data.