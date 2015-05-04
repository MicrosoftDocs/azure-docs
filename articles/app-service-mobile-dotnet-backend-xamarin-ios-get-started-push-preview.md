<properties 
	pageTitle="Add push notifications to your Xamarin iOS app with Azure App Service" 
	description="Learn how to use Azure App Service to send push notifications to your Xamarin iOS app" 
	services="app-service\mobile" 
	documentationCenter="xamarin" 
	authors="ysxu"
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="app-service-mobile" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-xamarin-ios" 
	ms.devlang="dotnet" 
	ms.topic="article"
	ms.date="02/22/2015" 
	ms.author="yuaxu"/>

# Add push notifications to your Xamarin iOS App

[AZURE.INCLUDE [app-service-mobile-selector-get-started-push-preview](../includes/app-service-mobile-selector-get-started-push-preview.md)]

This topic shows you how to use Azure App Service to send push notifications to a Xamarin iOS 8 app. In this tutorial you add push notifications using the Apple Push Notification service (APNs) to the [Get started with App Service mobile apps] project. When complete, your mobile backend will send a push notification each time a record is inserted.

This tutorial requires the following:

+ An iOS 8 device
+ iOS Developer Program membership
+ [Xamarin.iOS Studio]
+ [Azure Mobile Services Component]

   > [AZURE.NOTE] Because of push notification configuration requirements, you must deploy and test push notifications on an iOS capable device (iPhone or iPad) instead of in the emulator.

The Apple Push Notification Service (APNs) uses certificates to authenticate your mobile app. Follow these instructions to create the necessary certificates and upload it to your mobile app. For the official APNS feature documentation, see [Apple Push Notification Service].

## <a name="certificates"></a>Generate the Certificate Signing Request file

First you must generate the Certificate Signing Request (CSR) file, which is used by Apple to generate a signed certificate.

1. From Utilities, run the **Keychain Access tool**.

2. Click **Keychain Access**, expand **Certificate Assistant**, then click **Request a Certificate from a Certificate Authority...**.

    ![][5]

3. Enter your **User Email Address**, type in a **Common Name** value, make sure that **Saved to disk** is selected, and then click **Continue**.

    ![][6]

4. Type a name for the Certificate Signing Request (CSR) file in **Save As**, select the location in **Where**, then click **Save**.

    ![][7]
  
    Remember the location you chose.

Next, you will register your app with Apple, enable push notifications, and upload this exported CSR to create a push certificate.

## <a name="register"></a>Register your app for push notifications

To be able to send push notifications to an iOS device from your mobile app, you must register your application with Apple and register for push notifications. 

1. If you have not already registered your app, navigate to the iOS Provisioning Portal</a> at the Apple Developer Center, log on with your Apple ID, click **Identifiers**, then click **App IDs**, and finally click on the **+** sign to create an app ID for your app.
    
    ![][102]

2. Type a name for your app in **Description**, enter and remember the unique **Bundle Identifier**, check the "Push Notifications" option in the "App Services" section, and then click **Continue**. This example uses the ID **MobileServices.Quickstart** but you may not reuse this same ID, as app IDs must be unique across all users. As such, it is recommended that you append your full name or initials after the app name. 

    ![][103]
   
    This generates your app ID and requests you to **Submit** the information. Click **Submit**.
   
    ![][104] 
   
    Once you click **Submit**, you will see the **Registration complete** screen, as shown below. Click **Done**.
   
    ![][105]    

3. Locate the app ID that you just created, and click on its row. 

    ![][106]
   
    Clicking on the app ID will display details on the app and app ID. Click the **Settings** button.
   
    ![][107] 
   
4. Scroll to the bottom of the screen, and click the **Create Certificate...** button under the section **Development Push SSL Certificate**.

    ![][108] 

    This displays the "Add iOS Certificate" assistant.
   
    Note: This tutorial uses a development certificate. The same process is used when registering a production certificate. Just make sure that you set the same certificate type when you upload the certificate to your mobile app.

5. Click **Choose File**, browse to the location where you saved the CSR file earlier, then click **Generate**. 

    ![][110]
  
6. After the certificate is created by the portal, click the **Download** button, and click **Done**.
 
    ![][111]  

    This downloads the signing certificate and saves it to your computer in your Downloads folder. 

    ![][9] 

    Note: By default, the downloaded file a development certificate is named <strong>aps_development.cer</strong>.

7. Double-click the downloaded push certificate **aps_development.cer**.

    This installs the new certificate in the Keychain, as shown below:

    ![][10]

    Note: The name in your certificate might be different, but it will be prefixed with <strong>Apple Development iOS Push Notification Services:</strong>.

Later, you will use this certificate to generate a .p12 file and upload it to your mobile app to enable authentication with APNS.

## <a name="profile"></a>Create a provisioning profile for the app
 
1. Back in the <a href="http://go.microsoft.com/fwlink/p/?LinkId=272456" target="_blank">iOS Provisioning Portal</a>, select **Provisioning Profiles**, select **All**, and then click the **+** button to create a new profile. This launches the **Add iOS Provisiong Profile** Wizard.

    ![][112]

2. Select **iOS App Development** under **Development** as the provisiong profile type, and click **Continue**.

3. Next, select the app ID for the Mobile App Quickstart app from the **App ID** drop-down list, and click **Continue**.

    ![][113]

4. In the **Select certificates** screen, select the certificate created earlier, and click **Continue**.

    ![][114]

5. Next, select the **Devices** to use for testing, and click **Continue**.
  
    ![][115]

6. Finally, pick a name for the profile in **Profile Name**, click **Generate**, and click **Done**.

    ![][116]

    This creates a new provisioning profile.

    ![][117]

## <a name="configure-appServiceMobile"></a>Configure App Service mobile backend to send push requests

[AZURE.INCLUDE [app-service-mobile-apns-configure-push-preview](../includes/app-service-mobile-apns-configure-push-preview.md)]

##<a id="update-server"></a>Update the server to send push notifications

1. In Visual Studio, right-click the solution, then click **Manage NuGet Packages**.

2. Search for **Microsoft.Azure.NotificationHubs** and click **Install** for all projects in the solution.

3. In Visual Studio Solution Explorer, expand the **Controllers** folder in the mobile backend project. Open TodoItemController.cs. At the top of the file, add the following `using` statements:

        using System.Collections.Generic;
        using Microsoft.Azure.NotificationHubs;

4. Add the following snippet to the `PostTodoItem` method after the **InsertAsync** call:  

        // get Notification Hubs credentials associated with this Mobile App
        string notificationHubName = this.Services.Settings.NotificationHubName;
        string notificationHubConnection = this.Services.Settings.Connections[ServiceSettingsKeys.NotificationHubConnectionString].ConnectionString;

        // connect to notification hub
        NotificationHubClient Hub = NotificationHubClient.CreateClientFromConnectionString(notificationHubConnection, notificationHubName);

        // iOS payload
        var appleNotificationPayload = "{\"aps\":{\"alert\":\"" + item.Text + "\"}}";

        await Hub.Push.SendAppleNativeNotificationAsync(appleNotificationPayload);

    This code tells the Notification Hub associated with this mobile app to send a push notification after a todo item insertion.


## <a name="publish-the-service"></a>Publish the mobile backend to Azure

[AZURE.INCLUDE [app-service-mobile-dotnet-backend-publish-service-preview](../includes/app-service-mobile-dotnet-backend-publish-service-preview.md)]

## <a name="configure-app"></a>Configure your Xamarin.iOS application

1. In Xamarin.Studio, open **Info.plist**, and update the **Bundle Identifier** with the ID you created earlier.

    ![][121]

2. Scroll down to **Background Modes** and check the **Enable Background Modes** box and the **Remote notifications** box. 

    ![][122]

3. Double click your project in the Solution Panel to open **Project Options**.

4.  Choose **iOS Bundle Signing** under **Build**, and select the corresponding **Identity** and **Provisioning profile** you had just set up for this project. 

    ![][120]

    This ensures that the Xamarin project uses the new profile for code signing. For the official Xamarin device provisioning documentation, see [Xamarin Device Provisioning].

## <a name="add-push"></a>Add push notifications to your app

1. In **QSTodoService**, override the existing client declaration so **AppDelegate** can acquire the mobile client:
        
        public MobileServiceClient client { get; private set; }

2. In **AppDelegate**, override the **FinishedLaunching** event: 

        public override bool FinishedLaunching(UIApplication application, NSDictionary launchOptions)
        {
            // registers for push for iOS8
            var settings = UIUserNotificationSettings.GetSettingsForTypes(
                UIUserNotificationType.Alert 
                | UIUserNotificationType.Badge 
                | UIUserNotificationType.Sound, 
                new NSSet());

            UIApplication.SharedApplication.RegisterUserNotificationSettings(settings); 
            UIApplication.SharedApplication.RegisterForRemoteNotifications();

            return true;
        }

3. In the same file, override the **RegisteredForRemoteNotifications** event:

        public override void RegisteredForRemoteNotifications(UIApplication application, NSData deviceToken)
        {
            MobileServiceClient client = QSTodoService.DefaultService.GetClient;

            // Register for push with your mobile app
            var push = client.GetPush();
            push.RegisterAsync(deviceToken);
        }

4. Then, override the **DidReceivedRemoteNotification** event:

        public override void DidReceiveRemoteNotification (UIApplication application, NSDictionary userInfo, Action<UIBackgroundFetchResult> completionHandler)
        {
            NSDictionary aps = userInfo.ObjectForKey(new NSString("aps")) as NSDictionary;

            string alert = string.Empty;
            if (aps.ContainsKey(new NSString("alert")))
                alert = (aps [new NSString("alert")] as NSString).ToString();

            //show alert
            if (!string.IsNullOrEmpty(alert))
            {
                UIAlertView avAlert = new UIAlertView("Notification", alert, null, "OK", null);
                avAlert.Show();
            }
        }

Your app is now updated to support push notifications.


## <a name="publish-the-service"></a>Publish the mobile backend to Azure

[AZURE.INCLUDE [app-service-mobile-dotnet-backend-publish-service-preview](../includes/app-service-mobile-dotnet-backend-publish-service-preview.md)]

## <a name="test"></a>Test push notifications in your app

1. Press the **Run** button to build the project and start the app in an iOS capable device, then click **OK** to accept push notifications.
	
	> [AZURE.NOTE] You must explicitly accept push notifications from your app. This request only occurs the first time that the app runs.

2. In the app, type a task, and then click the plus (**+**) icon.

3. Verify that a notification is received, then click **OK** to dismiss the notification.

4. Repeat step 2 and immediately close the app, then verify that a notification is shown.

You have successfully completed this tutorial.

<!-- Images. -->

[24]: ./media/mobile-services-ios-get-started-push/mobile-services-quickstart-push2-ios.png
[Get started with App Service mobile apps]: app-service-mobile-dotnet-backend-xamarin-ios-get-started-preview.md

[5]: ./media/partner-xamarin-mobile-services-ios-get-started-push/mobile-services-ios-push-step5.png
[6]: ./media/partner-xamarin-mobile-services-ios-get-started-push/mobile-services-ios-push-step6.png
[7]: ./media/partner-xamarin-mobile-services-ios-get-started-push/mobile-services-ios-push-step7.png

[9]: ./media/partner-xamarin-mobile-services-ios-get-started-push/mobile-services-ios-push-step9.png
[10]: ./media/partner-xamarin-mobile-services-ios-get-started-push/mobile-services-ios-push-step10.png

[17]: ./media/partner-xamarin-mobile-services-ios-get-started-push/mobile-services-ios-push-step17.png
[18]: ./media/partner-xamarin-mobile-services-ios-get-started-push/mobile-services-selection.png
[19]: ./media/partner-xamarin-mobile-services-ios-get-started-push/mobile-push-tab-ios.png
[20]: ./media/partner-xamarin-mobile-services-ios-get-started-push/mobile-push-tab-ios-upload.png
[21]: ./media/partner-xamarin-mobile-services-ios-get-started-push/mobile-portal-data-tables.png
[22]: ./media/partner-xamarin-mobile-services-ios-get-started-push/mobile-insert-script-push2.png
[23]: ./media/partner-xamarin-mobile-services-ios-get-started-push/mobile-quickstart-push1-ios.png
[25]: ./media/partner-xamarin-mobile-services-ios-get-started-push/mobile-quickstart-push3-ios.png
[26]: ./media/partner-xamarin-mobile-services-ios-get-started-push/mobile-quickstart-push4-ios.png
[28]: ./media/partner-xamarin-mobile-services-ios-get-started-push/mobile-services-ios-push-step18.png

[101]: ./media/partner-xamarin-mobile-services-ios-get-started-push/mobile-services-ios-push-01.png
[102]: ./media/partner-xamarin-mobile-services-ios-get-started-push/mobile-services-ios-push-02.png
[103]: ./media/partner-xamarin-mobile-services-ios-get-started-push/mobile-services-ios-push-03.png
[104]: ./media/partner-xamarin-mobile-services-ios-get-started-push/mobile-services-ios-push-04.png
[105]: ./media/partner-xamarin-mobile-services-ios-get-started-push/mobile-services-ios-push-05.png
[106]: ./media/partner-xamarin-mobile-services-ios-get-started-push/mobile-services-ios-push-06.png
[107]: ./media/partner-xamarin-mobile-services-ios-get-started-push/mobile-services-ios-push-07.png
[108]: ./media/partner-xamarin-mobile-services-ios-get-started-push/mobile-services-ios-push-08.png

[110]: ./media/partner-xamarin-mobile-services-ios-get-started-push/mobile-services-ios-push-10.png
[111]: ./media/partner-xamarin-mobile-services-ios-get-started-push/mobile-services-ios-push-11.png
[112]: ./media/partner-xamarin-mobile-services-ios-get-started-push/mobile-services-ios-push-12.png
[113]: ./media/partner-xamarin-mobile-services-ios-get-started-push/mobile-services-ios-push-13.png
[114]: ./media/partner-xamarin-mobile-services-ios-get-started-push/mobile-services-ios-push-14.png
[115]: ./media/partner-xamarin-mobile-services-ios-get-started-push/mobile-services-ios-push-15.png
[116]: ./media/partner-xamarin-mobile-services-ios-get-started-push/mobile-services-ios-push-16.png
[117]: ./media/partner-xamarin-mobile-services-ios-get-started-push/mobile-services-ios-push-17.png

[120]:./media/partner-xamarin-mobile-services-ios-get-started-push/mobile-services-ios-push-20.png
[121]:./media/partner-xamarin-mobile-services-ios-get-started-push/mobile-services-ios-push-21.png
[122]:./media/partner-xamarin-mobile-services-ios-get-started-push/mobile-services-ios-push-22.png

[Xamarin.iOS Studio]: http://xamarin.com/platform
[Install Xcode]: https://go.microsoft.com/fwLink/p/?LinkID=266532
[iOS Provisioning Portal]: http://go.microsoft.com/fwlink/p/?LinkId=272456
[Mobile Services iOS SDK]: https://go.microsoft.com/fwLink/p/?LinkID=266533
[Apple Push Notification Service]: http://go.microsoft.com/fwlink/p/?LinkId=272584
[Get started with Mobile Services]: /en-us/develop/mobile/tutorials/get-started-xamarin-ios
[Get started with data]: /en-us/develop/mobile/tutorials/get-started-with-data-xamarin-ios
[Get started with authentication]: /en-us/develop/mobile/tutorials/get-started-with-users-xamarin-ios
[Get started with push notifications]: /en-us/develop/mobile/tutorials/get-started-with-push-xamarin-ios
[Push notifications to app users]: /en-us/develop/mobile/tutorials/push-notifications-to-users-ios
[Authorize users with scripts]: /en-us/develop/mobile/tutorials/authorize-users-in-scripts-xamarin-ios
[Xamarin Device Provisioning]: http://developer.xamarin.com/guides/ios/getting_started/installation/device_provisioning/


[Azure Management Portal]: https://manage.windowsazure.com/
[apns object]: http://go.microsoft.com/fwlink/p/?LinkId=272333
[Azure Mobile Services Component]: http://components.xamarin.com/view/azure-mobile-services/
[completed example project]: http://go.microsoft.com/fwlink/p/?LinkId=331303

