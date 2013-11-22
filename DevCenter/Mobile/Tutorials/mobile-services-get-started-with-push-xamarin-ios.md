<properties linkid="develop-mobile-tutorials-get-started-with-push-xamarin-ios" urlDisplayName="Get Started with Push Notifications" pageTitle="Get started with push notifications (Xamarin.iOS) - Mobile Services" metaKeywords="" metaDescription="Learn how to use push notifications in Xamarin.iOS apps with Windows Azure Mobile Services." metaCanonical="" disqusComments="0" umbracoNaviHide="1" writer="rpeters" editor="mollybos" />

# Get started with push notifications in Mobile Services
<div class="dev-center-tutorial-selector sublanding"><a href="/en-us/develop/mobile/tutorials/get-started-with-push-dotnet" title="Windows Store C#">Windows Store C#</a><a href="/en-us/develop/mobile/tutorials/get-started-with-push-js" title="Windows Store JavaScript">Windows Store JavaScript</a><a href="/en-us/develop/mobile/tutorials/get-started-with-push-wp8" title="Windows Phone">Windows Phone</a><a href="/en-us/develop/mobile/tutorials/get-started-with-push-ios" title="iOS">iOS</a><a href="/en-us/develop/mobile/tutorials/get-started-with-push-android" title="Android">Android</a><a href="/en-us/develop/mobile/tutorials/get-started-with-push-xamarin-ios" title="Xamarin.iOS" class="current">Xamarin.iOS</a><a href="/en-us/develop/mobile/tutorials/get-started-with-push-xamarin-android" title="Xamarin.Android">Xamarin.Android</a></div>

<p>This topic shows you how to use Windows Azure Mobile Services to send push notifications to a Xamarin.iOS app. In this tutorial you add push notifications using the Apple Push Notification service (APNS) to the quickstart project. When complete, your mobile service will send a push notification each time a record is inserted.</p>

   <div class="dev-callout"><b>Note</b>
   <p>This tutorial demonstrates a simplified way of sending push notifications by attaching a push notification device token to the inserted record. Be sure to follow along with the next tutorial to get a better idea of how to incorporate push notifications into your real-world apps.</p>
   </div>

This tutorial walks you through these basic steps to enable push notifications:

1. [Generate the certificate signing request] 
2. [Register your app and enable push notifications]
3. [Create a provisioning profile for the app]
3. [Configure Mobile Services]
4. [Add push notifications to the app]
5. [Update scripts to send push notifications]
6. [Insert data to receive notifications]

This tutorial requires the following:

+ [XCode 5.0][Install Xcode] 
+ An iOS 5.0 (or later version) capable device
+ iOS Developer Program membership
+ [Xamarin.iOS]
+ [Azure Mobile Services Component]

   <div class="dev-callout"><b>Note</b>
   <p>Because of push notification configuration requirements, you must deploy and test push notifications on an iOS capable device (iPhone or iPad) instead of in the emulator.</p>
   </div>

This tutorial is based on the Mobile Services quickstart. Before you start this tutorial, you must first complete [Get started with Mobile Services]. 

The Apple Push Notification Service (APNS) uses certificates to authenticate your mobile service. Follow these instructions to create the necessary certificates and upload it to your Mobile Service. For the official APNS feature documentation, see [Apple Push Notification Service].

<h2><a name="certificates"></a><span class="short-header">Generate CSR file</span>Generate the Certificate Signing Request file</h2>

First you must generate the Certificate Signing Request (CSR) file, which is used by Apple to generate a signed certificate.

1. From the Utilities folder, run the Keychain Access tool.

2. Click **Keychain Access**, expand **Certificate Assistant**, then click **Request a Certificate from a Certificate Authority...**.

  	![][5]

3. Select your **User Email Address**, type **Common Name** and **CA Email Address** values, make sure that **Saved to disk** is selected, and then click **Continue**.

  	![][6]

4. Type a name for the Certificate Signing Request (CSR) file in **Save As**, select the location in **Where**, then click **Save**.

  	![][7]
  
  This saves the CSR file in the selected location; the default location is in the Desktop. Remember the location chosen for this file.

Next, you will register your app with Apple, enable push notifications, and upload this exported CSR to create a push certificate.

<h2><a name="register"></a><span class="short-header">Register your app</span>Register your app for push notifications</h2>

To be able to send push notifications to an iOS app from mobile services, you must register your application with Apple and also register for push notifications.  

1. If you have not already registered your app, navigate to the <a href="http://go.microsoft.com/fwlink/p/?LinkId=272456" target="_blank">iOS Provisioning Portal</a> at the Apple Developer Center, log on with your Apple ID, click **Identifiers**, then click **App IDs**, and finally click on the **+** sign to .

   ![][102] 

2. Type a name for your app in **Description**, enter the value _MobileServices.Quickstart_ in **Bundle Identifier**, check the "Push Notifications" option in the "App Services" section, and then click **Continue**. This example uses the ID **MobileServices.Quickstart** but you may not reuse this same ID, as app IDs must be unique across all users. As such, it is recommended that you append your full name or initials after the app name. 

   ![][103]
   
   This generates your app ID and requests you to **Submit** the information. Click **Submit**
   
   ![][104] 
   
   Once you click **Submit**, you will see the **Registration complete** screen, as shown below. Click **Done**.
   
   ![][105]

	Note: If you choose to supply a **Bundle Identifier** value other than *MobileServices.Quickstart*, you must also update the bundle identifier value in your Xcode project.
    

3. Locate the app ID that you just created, and click on its row. 

   ![][106]
   
   Clicking on the app ID will display details on the app and app ID. Click the **Settings** button.
   
   ![][107] 
   
4. Scroll to the bottom of the screen, and click the **Create Certificate...** button under the section **Development Push SSL Certificate**.

   ![][108] 

   This displays the "Add iOS Certificate" assistant.
   
   ![][108] 


    Note: This tutorial uses a development certificate. The same process is used when registering a production certificate. Just make sure that you set the same certificate type when you upload the certificate to Mobile Services.

5. Click **Choose File**, browse to the location where you saved the CSR file that you created in the first task, then click **Generate**. 

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

Later, you will use this certificate to generate a .p12 file and upload it to Mobile Services to enable authentication with APNS.

<h2><a name="profile"></a><span class="short-header">Provision the app</span>Create a provisioning profile for the app</h2>
 
1. Back in the <a href="http://go.microsoft.com/fwlink/p/?LinkId=272456" target="_blank">iOS Provisioning Portal</a>, select **Provisioning Profiles**, select **All**, and then click the **+** button to create a new profile. This launches the **Add iOS Provisiong Profile** Wizard

   ![][112]

2. Select **iOS App Development** under **Development** as the provisiong profile type, and click **Continue**

   ![][113]

3. Next, select the app ID for the Mobile Services Quickstart app from the **App ID** drop-down list, and click **Continue**

   ![][114]

4. In the **Select certificates** screen, select the certificate created earlier, and click **Continue**
  
   ![][115]

5. Next, select the **Devices** to use for testing, and click **Continue**

   ![][116]

6. Finally, pick a name for the profile in **Profile Name**, click **Generate**, and click **Done**

   ![][117]
  
  This creates a new provisioning profile.

7. In Xcode, open the Organizer select the Devices view, select **Provisioning Profiles** in the **Library** section in the left pane, and then click the **Refresh** button at the bottom of the middle pane. 

   ![][101]

8. Under **Targets**, click **Quickstart**, expand **Code Signing Identity**, then under **Debug** select the new profile.

   	![][17]

This ensures that the Xcode project uses the new profile for code signing. Next, you must upload the certificate to Mobile Services.

<a name="configure"></a><h2><span class="short-header">Configure the service</span>Configure Mobile Services to send push requests</h2>

After you have registered your app with APNS and configured your project, you must next configure your mobile service to integrate with APNS.

1. In Keychain Access, right-click the new certificate, click **Export**, name your file QuickstartPusher, select the **.p12** format, then click **Save**.

   ![][28]

  Make a note of the file name and location of the exported certificate.

    <div class="dev-callout"><b>Note</b>
	<p>This tutorial creates a QuickstartPusher.p12 file. Your file name and location might be different.</p>
    </div>

2. Log on to the [Windows Azure Management Portal], click **Mobile Services**, and then click your app.

   ![][18]

3. Click the **Push** tab and click **Upload**.

   ![][19]

   This displays the Upload Certificate dialog.

4. Click **File**, select the exported certificate QuickstartPusher.p12 file, enter the **Password**, make sure that the correct **Mode** is selected, click the check icon, then click **Save**.

   ![][20] 

    <div class="dev-callout"><b>Note</b>
	<p>This tutorial uses developement certificates.</p>
    </div>

Both your mobile service is now configured to work with APNS.

<a name="add-push"></a><h2><span class="short-header">Add push notifications</span>Add push notifications to your app</h2>

1. In Xamarin.Studio, open the AppDelegate.cs file and add the following property:

        public string DeviceToken { get; set; }

2. Open the **TodoItem** class and add the following property:

        [DataMember(Name = "deviceToken")]
        public string DeviceToken { get; set; }

    <div class="dev-callout"><b>Note</b>
	<p>When dynamic schema is enabled on your mobile service, a new 'deviceToken' column is automatically added to the <strong>TodoItem</strong> table when a new item that contains this property is inserted.</p>
    </div>

3. In **AppDelegate**, override the **FinishedLaunching** event: 

        public override bool FinishedLaunching(UIApplication application, NSDictionary launchOptions)
        {
            UIRemoteNotificationType notificationTypes = UIRemoteNotificationType.Alert | 
                UIRemoteNotificationType.Badge | UIRemoteNotificationType.Sound;
            UIApplication.SharedApplication.RegisterForRemoteNotificationTypes(notificationTypes); 

            return true;
        }

4. In **AppDelegate**, override the **RegisteredForRemoteNotifications** event:

        public override void RegisteredForRemoteNotifications(UIApplication application, NSData deviceToken)
        {
            string trimmedDeviceToken = deviceToken.Description;
            if (!string.IsNullOrWhiteSpace(trimmedDeviceToken))
            {
                trimmedDeviceToken = trimmedDeviceToken.Trim('<');
                trimmedDeviceToken = trimmedDeviceToken.Trim('>');
            }
            DeviceToken = trimmedDeviceToken;
        }

5. In **AppDelegate**, override the **ReceivedRemoteNotification** event:

        public override void ReceivedRemoteNotification(UIApplication application, NSDictionary userInfo)
        {
            Debug.WriteLine(userInfo.ToString());
            NSObject inAppMessage;

            bool success = userInfo.TryGetValue(new NSString("inAppMessage"), out inAppMessage);

            if (success)
            {
                var alert = new UIAlertView("Got push notification", inAppMessage.ToString(), null, "OK", null);
                alert.Show();
            }
        }

6. In **TodoListViewController**, modify the **OnAdd** action to get the device token stored in **AppDelegeate**, and store it into the **TodoItem** being added.

      string deviceToken = ((AppDelegate)UIApplication.SharedApplication.Delegate).DeviceToken;

			var newItem = new TodoItem() 
			{
				Text = itemText.Text, 
				Complete = false,
                DeviceToken = deviceToken
			};

Your app is now updated to support push notifications.

<h2><a name="update-scripts"></a><span class="short-header">Update the insert script</span>Update the registered insert script in the Management Portal</h2>

1. In the Management Portal, click the **Data** tab and then click the **TodoItem** table. 

   	![][21]

2. In **todoitem**, click the **Script** tab and select **Insert**.
   
  	![][22]

   	This displays the function that is invoked when an insert occurs in the **TodoItem** table.

3. Replace the insert function with the following code, and then click **Save**:

        function insert(item, user, request) {
            request.execute();
            // Set timeout to delay the notification, to provide time for the 
            // app to be closed on the device to demonstrate toast notifications
            setTimeout(function() {
                push.apns.send(item.deviceToken, {
                    alert: "Toast: " + item.text,
                    payload: {
                        inAppMessage: "Hey, a new item arrived: '" + item.text + "'"
                    }
                });
            }, 2500);
        }

   This registers a new insert script, which uses the [apns object] to send a push notification (the inserted text) to the device provided in the insert request. 


   <div class="dev-callout"><b>Note</b>
   <p>This script delays sending the notification to give you time to close the app to receive a toast notification.</p>
   </div> 

<h2><a name="test"></a><span class="short-header">Test the app</span>Test push notifications in your app</h2>

1. Press the **Run** button to build the project and start the app in an iOS capable device, then click **OK** to accept push notifications

  	![][23]

    <div class="dev-callout"><b>Note</b>
    <p>You must explicitly accept push notifications from your app. This request only occurs the first time that the app runs.</p>
    </div>

2. In the app, type meaningful text, such as _A new Mobile Services task_ and then click the plus (**+**) icon.

  	![][24]

3. Verify that a notification is received, then click **OK** to dismiss the notification.

  	![][25]

4. Repeat step 2 and immediately close the app, then verify that the following toast is shown.

  	![][26]

You have successfully completed this tutorial.

## Get completed example
Download the [completed example project]. Be sure to update the **applicationURL** and **applicationKey** variables with your own Azure settings. 

## <a name="next-steps"> </a>Next steps

In this simple example a user receives a push notification with the data that was just inserted. The device token used by APNS is supplied to the mobile service by the client in the request. In the next tutorial, [Push notifications to app users], you will create a separate Devices table in which to store device tokens and send a push notification out to all stored channels when an insert occurs. 

<!-- Anchors. -->
[Generate the certificate signing request]: #certificates
[Register your app and enable push notifications]: #register
[Create a provisioning profile for the app]: #profile
[Configure Mobile Services]: #configure
[Update scripts to send push notifications]: #update-scripts
[Add push notifications to the app]: #add-push
[Insert data to receive notifications]: #test
[Next Steps]:#next-steps

<!-- Images. -->
[1]: ../Media/mobile-services-ios-push-step1.png
[2]: ../Media/mobile-services-ios-push-step2.png
[3]: ../Media/mobile-services-ios-push-step3.png
[4]: ../Media/mobile-services-ios-push-step4.png
[5]: ../Media/mobile-services-ios-push-step5.png
[6]: ../Media/mobile-services-ios-push-step6.png
[7]: ../Media/mobile-services-ios-push-step7.png
[8]: ../Media/mobile-services-ios-push-step8.png
[9]: ../Media/mobile-services-ios-push-step9.png
[10]: ../Media/mobile-services-ios-push-step10.png
[11]: ../Media/mobile-services-ios-push-step11.png
[12]: ../Media/mobile-services-ios-push-step12.png
[13]: ../Media/mobile-services-ios-push-step13.png
[14]: ../Media/mobile-services-ios-push-step14.png
[15]: ../Media/mobile-services-ios-push-step15.png
[16]: ../Media/mobile-services-ios-push-step16.png
[17]: ../Media/mobile-services-ios-push-step17.png
[18]: ../Media/mobile-services-selection.png
[19]: ../Media/mobile-push-tab-ios.png
[20]: ../Media/mobile-push-tab-ios-upload.png
[21]: ../Media/mobile-portal-data-tables.png
[22]: ../Media/mobile-insert-script-push2.png
[23]: ../Media/mobile-quickstart-push1-ios.png
[24]: ../Media/mobile-quickstart-push2-ios.png
[25]: ../Media/mobile-quickstart-push3-ios.png
[26]: ../Media/mobile-quickstart-push4-ios.png
[28]: ../Media/mobile-services-ios-push-step18.png

[101]: ../Media/mobile-services-ios-push-01.png
[102]: ../Media/mobile-services-ios-push-02.png
[103]: ../Media/mobile-services-ios-push-03.png
[104]: ../Media/mobile-services-ios-push-04.png
[105]: ../Media/mobile-services-ios-push-05.png
[106]: ../Media/mobile-services-ios-push-06.png
[107]: ../Media/mobile-services-ios-push-07.png
[108]: ../Media/mobile-services-ios-push-08.png
[109]: ../Media/mobile-services-ios-push-09.png
[110]: ../Media/mobile-services-ios-push-10.png
[111]: ../Media/mobile-services-ios-push-11.png
[112]: ../Media/mobile-services-ios-push-12.png
[113]: ../Media/mobile-services-ios-push-13.png
[114]: ../Media/mobile-services-ios-push-14.png
[115]: ../Media/mobile-services-ios-push-15.png
[116]: ../Media/mobile-services-ios-push-16.png
[117]: ../Media/mobile-services-ios-push-17.png

[Install Xcode]: https://go.microsoft.com/fwLink/p/?LinkID=266532
[iOS Provisioning Portal]: http://go.microsoft.com/fwlink/p/?LinkId=272456
[Mobile Services iOS SDK]: https://go.microsoft.com/fwLink/p/?LinkID=266533
[Apple Push Notification Service]: http://go.microsoft.com/fwlink/p/?LinkId=272584
[Get started with Mobile Services]: ../tutorials/mobile-services-get-started-xamarin-ios.md
[Get started with data]: ../tutorials/mobile-services-get-started-with-data-xamarin-ios.md
[Get started with authentication]: ../tutorials/mobile-services-get-started-with-users-xamarin-ios.md
[Get started with push notifications]: ../tutorials/mobile-services-get-started-with-push-xamarin-ios.md
[Push notifications to app users]: ../tutorials/mobile-services-push-notifications-to-app-users-ios.md
[Authorize users with scripts]: ../tutorials/mobile-services-authorize-users-xamarin-ios.md
[WindowsAzure.com]: http://www.windowsazure.com/
[Xamarin.iOS]: http://xamarin.com/download
[Windows Azure Management Portal]: https://manage.windowsazure.com/
[apns object]: http://go.microsoft.com/fwlink/p/?LinkId=272333
[Azure Mobile Services Component]: http://components.xamarin.com/view/azure-mobile-services/
[completed example project]: http://go.microsoft.com/fwlink/p/?LinkId=331303
