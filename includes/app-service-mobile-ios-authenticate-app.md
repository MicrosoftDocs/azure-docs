**Objective-C**: 

1. On your Mac, open *QSTodoListViewController.m* in Xcode and add the following method. Change *google* to *microsoftaccount*, *twitter*, *facebook*, or *windowsazureactivedirectory* if you're not using Google as your identity provider. If you use Facebook, [you will need to whitelist Facebook domains in your app](https://developers.facebook.com/docs/ios/ios9#whitelist).
   
            - (void) loginAndGetData
            {
                MSClient *client = self.todoService.client;
                if (client.currentUser != nil) {
                    return;
                }
   
                [client loginWithProvider:@"google" controller:self animated:YES completion:^(MSUser *user, NSError *error) {
                    [self refresh];
                }];
            }
2. Replace `[self refresh]` in `viewDidLoad` in *QSTodoListViewController.m* with the following:
   
            [self loginAndGetData];
3. Press  *Run* to start the app, and then log in. When you are logged in, you should be able to view the Todo list and make updates.

**Swift**:

1. On your Mac, open *ToDoTableViewController.swift* in Xcode and add the following method. Change *google* to *microsoftaccount*, *twitter*, *facebook*, or *windowsazureactivedirectory* if you're not using Google as your identity provider. If you use Facebook, [you will need to whitelist Facebook domains in your app](https://developers.facebook.com/docs/ios/ios9#whitelist).
   
            func loginAndGetData() {
   
                guard let client = self.table?.client where client.currentUser == nil else {
                    return
                }
   
                client.loginWithProvider("google", controller: self, animated: true) { (user, error) in
                    self.refreshControl?.beginRefreshing()
                    self.onRefresh(self.refreshControl)
                }
            }
2. Remove the lines `self.refreshControl?.beginRefreshing()` and `self.onRefresh(self.refreshControl)` at the end of `viewDidLoad()` in *ToDoTableViewController.swift*. Add a call to `loginAndGetData()` in their place:
   
            loginAndGetData()
3. Press  *Run* to start the app, and then log in. When you are logged in, you should be able to view the Todo list and make updates.

