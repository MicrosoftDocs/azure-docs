# Tutorial: Send push notifications to iOS apps using Azure Notification Hubs SDK (v3.0.0-preview1)

In this tutorial, you’ll use Azure Notification Hubs to send push
notifications to an iOS application.

This tutorial will take you through the following steps:

  - Create a sample iOS app

  - Connect your iOS app to Azure Notification Hubs

  - Send ‘test’ push notifications

  - Verify that your app receives notifications

The complete code for this tutorial can be downloaded from
[GitHub](https://go.microsoft.com/fwlink/?linkid=2129707).

## Prerequisites

To complete this tutorial, you’ll need the following prerequisites:

  - A Mac running
    [Xcode](https://go.microsoft.com/fwLink/p/?LinkID=266532), along
    with a valid developer certificate installed into your Keychain.

  - An iPhone or iPad running iOS version 10 or later

  - Your physical device registered in the [Apple
    Portal](https://developer.apple.com/) and associated with your
    certificate.

Before you proceed, be sure to go through the previous tutorial on
getting started with [Azure Notification Hubs for iOS
apps](https://go.microsoft.com/fwlink/?linkid=2129801) to setup and
configure push credentials in your notification hub. Even if you have no
prior experience with iOS development, you should be able to follow
along the steps below for creating this first-principles example.

<table>
<tbody>
<tr class="odd">
<td><p><strong>! Note</strong></p>
<p><strong>Because of configuration requirements for push notifications, you must deploy and test push notifications on a physical iOS device (iPhone or iPad) instead of the iOS Simulator.</strong></p></td>
</tr>
</tbody>
</table>

## Connect your iOS app to Notification Hubs

1.  > In Xcode, create a new iOS project and select the **Single View
    > Application** template.

> ![](media\\nh/media/image1.png)

2.  > When setting the options for your new project, make sure to use
    > the same **Product Name** and **Organization Identifier** that you
    > used when you set the bundle identifier in the Apple Developer
    > portal.

3.  > Under Project Navigator, select your project name
    > under **Targets**, then select the **Signing &
    > Capabilities** tab. Make sure you select the
    > appropriate **Team** for your Apple Developer account. XCode
    > should automatically pull down the Provisioning Profile you
    > created previously based on your bundle identifier.

> If you don't see the new provisioning profile that you created in
> Xcode, try refreshing the profiles for your signing identity.
> Click **Xcode** on the menu bar, click **Preferences**, click
> the **Account** tab, click the **View Details** button, click your
> signing identity, and then click the refresh button in the
> bottom-right corner.
> 
> ![](media\\nh/media/image2.png)

4.  > In the **Signing & Capabilities** tab, select **+ Capability**.
    > Double-click **Push Notifications** to enable it.

> ![](media\\nh/media/image3.png)

5.  > Add the Azure Notification Hubs SDK modules.

> You can integrate the Azure Notification Hubs SDK in your app by
> using [Cocoapods](https://cocoapods.org/) or by manually adding the
> binaries to your project.

  - > Integration via Cocoapods

> Add the following dependencies to your podfile to include Azure
> Notification Hubs SDK into your app.

| Ruby                            |
| ------------------------------- |
| pod 'AzureNotificationHubs-iOS' |

> Run pod install to install your newly defined pod and open your
> .xcworkspace.

<table>
<tbody>
<tr class="odd">
<td><p><strong>! Note</strong></p>
<p>If you see an error such as <strong>[!] Unable to find a specification for AzureNotificationHubs-iOS</strong> while running pod install, please run pod repo update to get the latest pods from the Cocoapods repository, and then run pod install.</p></td>
</tr>
</tbody>
</table>

  - > Integration by copying the binaries into your project
    
    1.  > Download the [Azure Notification Hubs
        > SDK](https://go.microsoft.com/fwlink/?linkid=2129045) framework
        > provided as a zip file and unzip it.
    
    2.  > In Xcode, right-click your project and click the **Add Files
        > to** option to add
        > the **WindowsAzureMessaging.framework** folder to your Xcode
        > project. Select **Options** and make sure **Copy items if
        > needed** is selected, and then click **Add**.

> ![](media\\nh/media/image4.png)

6.  > Add a new header file to your project named **Constants.h**. To do
    > so, right-click the project name and select **New File...**. Then
    > select **Header File**. This file holds the constants for your
    > notification hub. Then select **Next**. Name the
    > file **Constants.h**.

7.  > Add the following code to the Constants.h file:

<table>
<thead>
<tr class="header">
<th>Objective – C</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><p>#ifndef Constants_h</p>
<p>#define Constants_h</p>
<p>extern NSString* const NHInfoConnectionString;</p>
<p>extern NSString* const NHInfoHubName;extern NSString* const NHUserDefaultTags;</p>
<p>#endif /* Constants_h */</p></td>
</tr>
</tbody>
</table>

8.  > Add the implementation file for Constants.h. To do so, right-click
    > the project name and select **New File...**. Select **Objective-C
    > File**, and then select **Next**. Name the file **Constants.m**.

> ![](media\\nh/media/image5.png)

9.  > Open the **Constants.m** file and replace its contents with the
    > following code. Replace the string literal
    > placeholders NotificationHubConnectionString and NotificationHubConnectionString with
    > the hub name and the **DefaultListenSharedAccessSignature**,
    > respectively, as you previously obtained from the portal:

<table>
<thead>
<tr class="header">
<th>Objective-C</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><p>#import &lt;Foundation/Foundation.h&gt;</p>
<p>#import "Constants.h"</p>
<p>NSString* const NHInfoConnectionString = @"NotificationHubConnectionString";</p>
<p>NSString* const NHInfoHubName = @"NotificationHubName";NSString* const NHUserDefaultTags = @"notification_tags";</p></td>
</tr>
</tbody>
</table>

10. > In the project's **AppDelegate.m** file, add the
    > following import statements:

| Objective-C            |
| ---------------------- |
| \#import "Constants.h" |

11. > In the same **AppDelegate.m** file, replace all the code
    > after didFinishLaunchingWithOptions with the following code:

<table>
<thead>
<tr class="header">
<th>Objective-C</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><p>// Tells the delegate that the app successfully registered with Apple Push Notification service (APNs).</p>
<p>- (<strong>BOOL</strong>)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {</p>
<p>NSString *hubName = [[NSBundle mainBundle] objectForInfoDictionaryKey:NHInfoHubName];</p>
<p>NSString *connectionString = [[NSBundle mainBundle] objectForInfoDictionaryKey:NHInfoConnectionString];</p>
<p>[MSNotificationHub initWithConnectionString:connectionString withHubName:hubName];</p>
<p>NSMutableSet *tags = [[NSMutableSet alloc] init];</p>
<p>// Load and parse stored tags</p>
<p>NSString *unparsedTags = [[NSUserDefaults standardUserDefaults] valueForKey:NHUserDefaultTags];</p>
<p>if (unparsedTags.length &gt; 0) {</p>
<p>NSArray *tagsArray = [unparsedTags componentsSeparatedByString: @","];</p>
<p>[MSNotificationHub addTags:tagsArray];</p>
<p>}</p>
<p>}</p>
<p>- (void)showAlert:(NSString *)message withTitle:(NSString *)title {</p>
<p>if (title == nil) {</p>
<p>title = @"Alert";</p>
<p>}</p>
<p>UIAlertController *alert = [UIAlertController alertControllerWithTitle:title message:message preferredStyle:UIAlertControllerStyleAlert];</p>
<p>[alert addAction:[UIAlertAction actionWithTitle:@"OK" style:UIAlertActionStyleDefault handler:nil]];</p>
<p>[[[[UIApplication sharedApplication] keyWindow] rootViewController] presentViewController:alert animated:YES completion:nil];</p>
<p>}</p>
<p>- (void)showNotification:(NSDictionary *)userInfo {</p>
<p>[self logNotificationDetails:userInfo];</p>
<p>NotificationDetailViewController *notificationDetail = [[NotificationDetailViewController alloc] initWithUserInfo:userInfo];</p>
<p>[[[[UIApplication sharedApplication] keyWindow] rootViewController] presentViewController:notificationDetail animated:YES completion:nil];</p>
<p>}</p>
<p>@end</p></td>
</tr>
</tbody>
</table>

> This code connects to the notification hub using the connection
> information you specified in **Constants.h**. It then gives the device
> token to the notification hub so that the notification hub can send
> notifications.

### NotificationDetailViewController

1.  > Similar to the previous instructions, add another header file
    > named **NotificationDetailViewController.h**. Replace the contents
    > of the new header file with the following code:

<table>
<thead>
<tr class="header">
<th>Objective-C</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><p>#import &lt;UIKit/UIKit.h&gt;</p>
<p>NS_ASSUME_NONNULL_BEGIN</p>
<p>@interface NotificationDetailViewController : UIViewController</p>
<p>@property (strong, nonatomic) IBOutlet UILabel *titleLabel;</p>
<p>@property (strong, nonatomic) IBOutlet UILabel *bodyLabel;</p>
<p>@property (strong, nonatomic) IBOutlet UIButton *dismissButton;</p>
<p>@property (strong, nonatomic) NSDictionary *userInfo;</p>
<p>- (id)initWithUserInfo:(NSDictionary *)userInfo;</p>
<p>@end</p>
<p>NS_ASSUME_NONNULL_END</p></td>
</tr>
</tbody>
</table>

2.  > Add the implementation
    > file **NotificationDetailViewController.m**. Replace the contents
    > of the file with the following code, which implements
    > the UIViewController methods:

<table>
<thead>
<tr class="header">
<th>Objective-C</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><p>#import "NotificationDetailViewController.h"</p>
<p>@interface NotificationDetailViewController ()</p>
<p>@end</p>
<p>@implementation NotificationDetailViewController</p>
<p>- (id)initWithUserInfo:(NSDictionary *)userInfo {</p>
<p>self = [super initWithNibName:@"NotificationDetail" bundle:nil];</p>
<p>if (self) {</p>
<p>_userInfo = userInfo;</p>
<p>}</p>
<p>return self;</p>
<p>}</p>
<p>- (void)viewDidLayoutSubviews {</p>
<p>[self.titleLabel sizeToFit];</p>
<p>[self.bodyLabel sizeToFit];</p>
<p>}</p>
<p>- (void)viewDidLoad {</p>
<p>[super viewDidLoad];</p>
<p>NSString *title = nil;</p>
<p>NSString *body = nil;</p>
<p>NSDictionary *aps = [_userInfo valueForKey:@"aps"];</p>
<p>NSObject *alertObject = [aps valueForKey:@"alert"];</p>
<p>if (alertObject != nil) {</p>
<p>if ([alertObject isKindOfClass:[NSDictionary class]]) {</p>
<p>NSDictionary *alertDict = (NSDictionary *)alertObject;</p>
<p>title = [alertDict valueForKey:@"title"];</p>
<p>body = [alertObject valueForKey:@"body"];</p>
<p>} else if ([alertObject isKindOfClass:[NSString class]]) {</p>
<p>body = (NSString *)alertObject;</p>
<p>} else {</p>
<p>NSLog(@"Unable to parse notification content. Unexpected format: %@", alertObject);</p>
<p>}</p>
<p>}</p>
<p>if (title == nil) {</p>
<p>title = @"&lt;unset&gt;";</p>
<p>}</p>
<p>if (body == nil) {</p>
<p>body = @"&lt;unset&gt;";</p>
<p>}</p>
<p>self.titleLabel.text = title;</p>
<p>self.bodyLabel.text = body;</p>
<p>}</p>
<p>- (IBAction)handleDismiss:(id)sender {</p>
<p>[self dismissViewControllerAnimated:YES completion:nil];</p>
<p>}</p>
<p>@end</p></td>
</tr>
</tbody>
</table>

### ViewController

1.  > In the project's **ViewController.h** file, add the
    > following import statements:

<table>
<thead>
<tr class="header">
<th>Objective-C</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><p>#import &lt;WindowsAzureMessaging/WindowsAzureMessaging.h&gt;</p>
<p>#import &lt;UserNotifications/UserNotifications.h&gt;</p></td>
</tr>
</tbody>
</table>

2.  > Also in **ViewController.h**, add the following property
    > declarations after the @interface declaration:

| Objective-C                                                         |
| ------------------------------------------------------------------- |
| @property (strong, nonatomic) IBOutlet UITextField \*tagsTextField; |

3.  > In the project's **ViewController.m** implementation file, replace
    > the contents of the file with the following code:

<table>
<thead>
<tr class="header">
<th>Objective-C</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><p>#import "ViewController.h"</p>
<p>#import "Constants.h"</p>
<p>#import "AppDelegate.h"</p>
<p>@interface ViewController ()</p>
<p>@end</p>
<p>@implementation ViewController</p>
<p>// UIViewController methods</p>
<p>- (void)touchesBegan:(NSSet&lt;UITouch *&gt; *)touches withEvent:(UIEvent *)event {</p>
<p>// Simple method to dismiss keyboard when user taps outside of the UITextField.</p>
<p>[self.view endEditing:YES];</p>
<p>}</p>
<p>- (void)viewDidLoad {</p>
<p>[super viewDidLoad];</p>
<p>// Load raw tags text from storage and initialize the text field</p>
<p>self.tagsTextField.text = [[NSUserDefaults standardUserDefaults] valueForKey:NHUserDefaultTags];</p>
<p>}</p>
<p>- (IBAction)handleRegister:(id)sender {</p>
<p>// Save raw tags text in storage</p>
<p>[[NSUserDefaults standardUserDefaults] setValue:self.tagsTextField.text forKey:NHUserDefaultTags];</p>
<p>// Delegate processing the register action to the app delegate.</p>
<p>[[[UIApplication sharedApplication] delegate] performSelector:@selector(handleRegister)];</p>
<p>}</p>
<p>- (IBAction)handleUnregister:(id)sender {</p>
<p>[[[UIApplication sharedApplication] delegate] performSelector:@selector(handleUnregister)];</p>
<p>}</p>
<p>@end</p></td>
</tr>
</tbody>
</table>

4.  > To verify there are no failures, build and run the app on your
    > device.

## Send test push notifications

You can test receiving notifications in your app with the *Test
Send* option in the [Azure portal](https://portal.azure.com/). It sends
a test push notification to your device.

![](media\\nh/media/image6.png)

Push notifications are normally sent in a back-end service like Mobile
Apps or ASP.NET using a compatible library. If a library isn't available
for your back end, you can also use the REST API directly to send
notification messages.

Here is a list of some other tutorials you might want to review for
sending notifications:

  - > Azure Mobile Apps: For an example of how to send notifications
    > from a Mobile Apps back end integrated with Notification Hubs,
    > see [Add Push Notifications to your iOS
    > App](https://docs.microsoft.com/en-us/azure/app-service-mobile/app-service-mobile-ios-get-started-push).

  - > ASP.NET: [Use Notification Hubs to push notifications to
    > users](https://docs.microsoft.com/en-us/azure/notification-hubs/notification-hubs-aspnet-backend-ios-apple-apns-notification).

  - > Azure Notification Hubs Java SDK: See [How to use Notification
    > Hubs from
    > Java](https://docs.microsoft.com/en-us/azure/notification-hubs/notification-hubs-java-push-notification-tutorial) for
    > sending notifications from Java. This has been tested in Eclipse
    > for Android Development.

  - > PHP: [How to use Notification Hubs from
    > PHP](https://docs.microsoft.com/en-us/azure/notification-hubs/notification-hubs-php-push-notification-tutorial).

## Verify that your app receives push notifications

To test push notifications on iOS, you must deploy the app to a physical
iOS device. You cannot send Apple push notifications by using the iOS
Simulator.

1.  > Run the app and verify that registration succeeds, and then
    > press **OK**.

> ![](media\\nh/media/image7.png)

2.  > Next you send a test push notification from the [Azure
    > portal](https://portal.azure.com/), as described in the previous
    > section.

3.  > The push notification is sent to all devices that are registered
    > to receive the notifications from the particular Notification Hub.

> ![](media\\nh/media/image8.png)

## Next steps

In this simple example, you broadcasted push notifications to all your
registered iOS devices. To learn how to push notifications to specific
iOS devices, advance to the following tutorial:

[Tutorial: Push notifications to specific
devices](https://docs.microsoft.com/en-us/azure/notification-hubs/notification-hubs-ios-xplat-segmented-apns-push-notification)

For more information, see the following articles:

  - > [Azure Notification Hubs
    > overview](https://docs.microsoft.com/en-us/azure/notification-hubs/notification-hubs-push-notification-overview)

  - > [Notification Hubs REST
    > APIs](https://docs.microsoft.com/en-us/rest/api/notificationhubs/)

  - > [Notification Hubs SDK for back-end
    > operations](https://www.nuget.org/packages/Microsoft.Azure.NotificationHubs/)

  - > [Notification Hubs SDK on
    > GitHub](https://github.com/Azure/azure-notificationhubs)

  - > [Register with application back
    > end](https://docs.microsoft.com/en-us/azure/notification-hubs/notification-hubs-ios-aspnet-register-user-from-backend-to-push-notification)

  - > [Registration
    > management](https://docs.microsoft.com/en-us/azure/notification-hubs/notification-hubs-push-notification-registration-management)

  - > [Working with
    > tags](https://docs.microsoft.com/en-us/azure/notification-hubs/notification-hubs-tags-segment-push-message)

  - > [Working with custom
    > templates](https://docs.microsoft.com/en-us/azure/notification-hubs/notification-hubs-templates-cross-platform-push-messages)

  - > [Service Bus access control with shared access
    > signatures](https://docs.microsoft.com/en-us/azure/service-bus-messaging/service-bus-sas)

  - > [Programmatically generate SAS
    > tokens](https://docs.microsoft.com/en-us/rest/api/eventhub/generate-sas-token)

  - > [Apple security: common
    > crypto](https://developer.apple.com/security/)

  - > [UNIX Epoch time](https://en.wikipedia.org/wiki/Unix_time)

  - > [HMAC](https://en.wikipedia.org/wiki/HMAC)
