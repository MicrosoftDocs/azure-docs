

1. Open **QSTodoListViewController.m** and add the following method:


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


    > [AZURE.NOTE] If you are using an identity provider other than Facebook, change the value passed to **loginWithProvider**. The supported values are: _microsoftaccount_, _facebook_, _twitter_, _google_, or _windowsazureactivedirectory_.


2. Modify `viewDidLoad` by replacing `[self refresh]` at the end with the following:

        [self loginAndGetData];

3. Press  **Run** to start the app, and then log in with your chosen identity provider. When you are logged in, you should be able to view the Todo list and make updates.
