

1. Open **QSTodoListViewController.m** and in the **viewDidLoad** method, remove the following line:

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

    > [AZURE.NOTE] If you are using an identity provider other than Facebook, change the value passed to **loginWithProvider**. The supported values are: _microsoftaccount_, _facebook_, _twitter_, _google_, or _windowsazureactivedirectory_.

3. Press  **Run** to start the app, and then log in with your chosen identity provider. When you are logged in, you should be able to view the Todo list and make updates.
