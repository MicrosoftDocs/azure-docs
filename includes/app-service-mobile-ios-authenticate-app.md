1. **Objective-C**: On your Mac, open **QSTodoListViewController.m** in Xcode and add the following method. Change _facebook_ to _microsoftaccount_, _twitter_, _google_, or _windowsazureactivedirectory_ if you're not using Facebook as your identity provider.

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

2. **Objective-C**: Replace `[self refresh]` in `viewDidLoad` with the following:

        [self loginAndGetData];

3. **Swift**: On your Mac, open **ToDoTableViewController.swift** in Xcode and add the following method. Change _facebook_ to _microsoftaccount_, _twitter_, _google_, or _windowsazureactivedirectory_ if you're not using Facebook as your identity provider.
        
            
        func loginAndGetData()
        {
            let client = MSClient(applicationURLString: "https://test911518.azurewebsites.net")
            if client.currentUser != nil {
                return
            }
                
            client.loginWithProvider("facebook", controller: self, animated: true, completion: { (user, error) -> Void in
                self.refreshControl?.beginRefreshing()
                self.onRefresh(self.refreshControl)
            })
        }

4. **Swift**: Replace the two lines `self.refreshControl?.beginRefreshing()` and `self.onRefresh(self.refreshControl)` in `viewDidLoad()` with the following:

        loginAndGetData();
                
5. Press  **Run** to start the app, and then log in. When you are logged in, you should be able to view the Todo list and make updates.
