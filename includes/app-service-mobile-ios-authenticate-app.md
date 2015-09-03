1. On your Mac, open **QSTodoListViewController.m** in Xcode and add the following method. Change _facebook_ to _microsoftaccount_, _twitter_, _google_, or _windowsazureactivedirectory_ if you're not using Facebook as your identity provider.

        - (void) loginAndGetData
        {
            MSClient *client = self.todoService.client;
            if (client.currentUser != nil) {
                return;
            }

            [client loginWithProvider:@"facebook" controller:self animated:YES completion:^(MSUser *user, NSError *error) {
                [self refresh];
            }];
        }

2. Replace `[self refresh]` in `viewDidLoad` with the following:

        [self loginAndGetData];

3. Press  **Run** to start the app, and then log in. When you are logged in, you should be able to view the Todo list and make updates.
