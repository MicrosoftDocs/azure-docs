
## <a id="register"></a>Register App for Push Notifications

* [Register an App ID for your app](https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/AppDistributionGuide/MaintainingProfiles/MaintainingProfiles.html#//apple_ref/doc/uid/TP40012582-CH30-SW991). Check the optional **Push Notifications** checkbox in **App Services** when registering the app.

> [AZURE.NOTE] Create an explicit App ID (not a wildcard App ID) and for **Bundle ID**, use the exact **Bundle ID** that is in your Xcode quickstart project. It is also crucial that you check the **Push Notifications** option in **App Services** when registering the App ID. Push notifications will not work if you don't check this box.

* Next, [enable push notifications for the app](https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/AppDistributionGuide/ConfiguringPushNotifications/ConfiguringPushNotifications.html#//apple_ref/doc/uid/TP40012582-CH32-SW6). You may create either a "Development" or "Distribution" SSL certificate (remember to select the corresponding option -- "Sandbox" or "Production" -- in the Mobile Services portal later.)

* Next, [verify that the app ID enables push notifications](https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/AppDistributionGuide/ConfiguringPushNotifications/ConfiguringPushNotifications.html#//apple_ref/doc/uid/TP40012582-CH32-SW8).

* Finally, [refresh the provisioning profiles in the Xcode quickstart project](https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/AppDistributionGuide/ConfiguringPushNotifications/ConfiguringPushNotifications.html#//apple_ref/doc/uid/TP40012582-CH32-SW10) and then [verify that the provisioning profile was either created or regenerated to enable push notifications](https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/AppDistributionGuide/ConfiguringPushNotifications/ConfiguringPushNotifications.html#//apple_ref/doc/uid/TP40012582-CH32-SW12).
