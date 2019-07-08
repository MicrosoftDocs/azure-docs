---
title: Add Authentication on iOS with Azure Mobile Apps
description: Learn how to use Azure Mobile Apps to authenticate users of your iOS app through a variety of identity providers, including AAD, Google, Facebook, Twitter, and Microsoft.
services: app-service\mobile
documentationcenter: ios
author: elamalani
manager: crdun
editor: ''

ms.assetid: ef3d3cbe-e7ca-45f9-987f-80c44209dc06
ms.service: app-service-mobile
ms.workload: mobile
ms.tgt_pltfrm: mobile-ios
ms.devlang: dotnet
ms.topic: article
ms.date: 06/25/2019
ms.author: emalani
---
# Add authentication to your iOS app
[!INCLUDE [app-service-mobile-selector-get-started-users](../../includes/app-service-mobile-selector-get-started-users.md)]

> [!NOTE]
> Visual Studio App Center is investing in new and integrated services central to mobile app development. Developers can use **Build**, **Test** and **Distribute** services to set up Continuous Integration and Delivery pipeline. Once the app is deployed, developers can monitor the status and usage of their app using the **Analytics** and **Diagnostics** services, and engage with users using the **Push** service. Developers can also leverage **Auth** to authenticate their users and **Data** service to persist and sync app data in the cloud. Check out [App Center](https://appcenter.ms/?utm_source=zumo&utm_campaign=app-service-mobile-ios-get-started-users) today.
>

In this tutorial, you add authentication to the [iOS quick start] project using a supported identity provider. This tutorial is based on the [iOS quick start] tutorial, which you must complete first.

## <a name="register"></a>Register your app for authentication and configure the App Service
[!INCLUDE [app-service-mobile-register-authentication](../../includes/app-service-mobile-register-authentication.md)]

## <a name="redirecturl"></a>Add your app to the Allowed External Redirect URLs

Secure authentication requires that you define a new URL scheme for your app.  This allows the authentication
system to redirect back to your app once the authentication process is complete.  In this tutorial, we use the
URL scheme _appname_ throughout.  However, you can use any URL scheme you choose.  It should be unique to your
mobile application.  To enable the redirection on th server side:

1. In the [Azure portal], select your App Service.

2. Click the **Authentication / Authorization** menu option.

3. Click **Azure Active Directory** under the **Authentication Providers** section.

4. Set the **Management mode** to **Advanced**.

5. In the **Allowed External Redirect URLs**, enter `appname://easyauth.callback`.  The _appname_ in this
    string is the URL Scheme for your mobile application.  It should follow normal URL specification for
    a protocol (use letters and numbers only, and start with a letter).  You should make a note of the string
    that you choose as you will need to adjust your mobile application code with the URL Scheme in several
    places.

6. Click **OK**.

7. Click **Save**.

## <a name="permissions"></a>Restrict permissions to authenticated users
[!INCLUDE [app-service-mobile-restrict-permissions-dotnet-backend](../../includes/app-service-mobile-restrict-permissions-dotnet-backend.md)]

In Xcode, press **Run** to start the app. An exception is raised because the app attempts to access the
backend as an unauthenticated user, but the *TodoItem* table now requires authentication.

## <a name="add-authentication"></a>Add authentication to app
**Objective-C**:

1. On your Mac, open *QSTodoListViewController.m* in Xcode and add the following method:

    ```Objective-C
    - (void)loginAndGetData
    {
        QSAppDelegate *appDelegate = (QSAppDelegate *)[UIApplication sharedApplication].delegate;
        appDelegate.qsTodoService = self.todoService;

        [self.todoService.client loginWithProvider:@"google" urlScheme:@"appname" controller:self animated:YES completion:^(MSUser * _Nullable user, NSError * _Nullable error) {
            if (error) {
                NSLog(@"Login failed with error: %@, %@", error, [error userInfo]);
            }
            else {
                self.todoService.client.currentUser = user;
                NSLog(@"User logged in: %@", user.userId);

                [self refresh];
            }
        }];
    }
    ```

    Change *google* to *microsoftaccount*, *twitter*, *facebook*, or *windowsazureactivedirectory* if you
    are not using Google as your identity provider. If you use Facebook, you must [whitelist Facebook domains][1]
    in your app.

    Replace the **urlScheme** with a unique name for your application.  The urlScheme should be the same as
    the URL Scheme protocol that you specified in the **Allowed External Redirect URLs** field in the Azure
    portal. The urlScheme is used by the authentication callback to switch back to your application after the
    authentication request is complete.

2. Replace `[self refresh]` in `viewDidLoad` in *QSTodoListViewController.m* with the following code:

    ```Objective-C
    [self loginAndGetData];
    ```

3. Open the `QSAppDelegate.h` file and add the following code:

    ```Objective-C
    #import "QSTodoService.h"

    @property (strong, nonatomic) QSTodoService *qsTodoService;
    ```

4. Open the `QSAppDelegate.m` file and add the following code:

    ```Objective-C
    - (BOOL)application:(UIApplication *)application openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
    {
        if ([[url.scheme lowercaseString] isEqualToString:@"appname"]) {
            // Resume login flow
            return [self.qsTodoService.client resumeWithURL:url];
        }
        else {
            return NO;
        }
    }
    ```

   Add this code directly before the line reading `#pragma mark - Core Data stack`.  Replace the
   _appname_ with the urlScheme value that you used in step 1.

5. Open the `AppName-Info.plist` file (replacing AppName with the name of your app), and add the following code:

    ```XML
    <key>CFBundleURLTypes</key>
    <array>
        <dict>
            <key>CFBundleURLName</key>
            <string>com.microsoft.azure.zumo</string>
            <key>CFBundleURLSchemes</key>
            <array>
                <string>appname</string>
            </array>
        </dict>
    </array>
    ```

    This code should be placed inside the `<dict>` element.  Replace the _appname_ string (within the
    array for **CFBundleURLSchemes**) with the app name you chose in step 1.  You can also make these
    changes in the plist editor - click on the `AppName-Info.plist` file in XCode to open the plist
    editor.

    Replace the `com.microsoft.azure.zumo` string for **CFBundleURLName** with your Apple bundle identifier.

6. Press *Run* to start the app, and then log in. When you are logged in, you should be able to view
    the Todo list and make updates.

**Swift**:

1. On your Mac, open *ToDoTableViewController.swift* in Xcode and add the following method:

    ```swift
    func loginAndGetData() {

        guard let client = self.table?.client, client.currentUser == nil else {
            return
        }

        let appDelegate = UIApplication.shared.delegate as! AppDelegate
        appDelegate.todoTableViewController = self

        let loginBlock: MSClientLoginBlock = {(user, error) -> Void in
            if (error != nil) {
                print("Error: \(error?.localizedDescription)")
            }
            else {
                client.currentUser = user
                print("User logged in: \(user?.userId)")
            }
        }

        client.login(withProvider:"google", urlScheme: "appname", controller: self, animated: true, completion: loginBlock)

    }
    ```

    Change *google* to *microsoftaccount*, *twitter*, *facebook*, or *windowsazureactivedirectory* if you
    are not using Google as your identity provider. If you use Facebook, you must [whitelist Facebook domains][1]
    in your app.

    Replace the **urlScheme** with a unique name for your application.  The urlScheme should be the same as
    the URL Scheme protocol that you specified in the **Allowed External Redirect URLs** field in the Azure
    portal. The urlScheme is used by the authentication callback to switch back to your application after the
    authentication request is complete.

2. Remove the lines `self.refreshControl?.beginRefreshing()` and `self.onRefresh(self.refreshControl)` at the
    end of `viewDidLoad()` in *ToDoTableViewController.swift*. Add a call to `loginAndGetData()` in their place:

    ```swift
    loginAndGetData()
    ```

3. Open the `AppDelegate.swift` file and add the following line to the `AppDelegate` class:

    ```swift
    var todoTableViewController: ToDoTableViewController?

    func application(_ application: UIApplication, openURL url: NSURL, options: [UIApplicationOpenURLOptionsKey : Any] = [:]) -> Bool {
        if url.scheme?.lowercased() == "appname" {
            return (todoTableViewController!.table?.client.resume(with: url as URL))!
        }
        else {
            return false
        }
    }
    ```

    Replace the _appname_ with the urlScheme value that you used in step 1.

4. Open the `AppName-Info.plist` file (replacing AppName with the name of your app), and add the following code:

    ```xml
    <key>CFBundleURLTypes</key>
    <array>
        <dict>
            <key>CFBundleURLName</key>
            <string>com.microsoft.azure.zumo</string>
            <key>CFBundleURLSchemes</key>
            <array>
                <string>appname</string>
            </array>
        </dict>
    </array>
    ```

    This code should be placed inside the `<dict>` element.  Replace the _appname_ string (within the
    array for **CFBundleURLSchemes**) with the app name you chose in step 1.  You can also make these
    changes in the plist editor - click on the `AppName-Info.plist` file in XCode to open the plist
    editor.

    Replace the `com.microsoft.azure.zumo` string for **CFBundleURLName** with your Apple bundle identifier.

5. Press *Run* to start the app, and then log in. When you are logged in, you should be able to view
    the Todo list and make updates.

App Service Authentication uses Apples Inter-App Communication.  For more details on this subject, refer
to the [Apple Documentation][2]
<!-- URLs. -->

[1]: https://developers.facebook.com/docs/ios/ios9#whitelist
[2]: https://developer.apple.com/library/content/documentation/iPhone/Conceptual/iPhoneOSProgrammingGuide/Inter-AppCommunication/Inter-AppCommunication.html
[Azure portal]: https://portal.azure.com

[iOS quick start]: app-service-mobile-ios-get-started.md

