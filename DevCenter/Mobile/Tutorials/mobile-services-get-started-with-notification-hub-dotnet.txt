<properties linkid="develop-mobile-tutorials-get-started-with-push-dotnet" writer="glenga" urlDisplayName="Get Started with Push Notifications" pageTitle="Get started with push notifications - Mobile Services" metaKeywords="" metaDescription="Learn how to use push notifications with Windows Azure Mobile Services." metaCanonical="" disqusComments="0" umbracoNaviHide="1" />

<div chunk="../chunks/article-left-menu-windows-store.md" />

# Get started with notification hubs in Mobile Services
<div class="dev-center-tutorial-selector"> 
	<a href="/en-us/develop/mobile/tutorials/get-started-with-push-dotnet" title="Windows Store C#" class="current">Windows Store C#</a><a href="/en-us/develop/mobile/tutorials/get-started-with-push-js" title="Windows Store JavaScript">Windows Store JavaScript</a><a href="/en-us/develop/mobile/tutorials/get-started-with-push-wp8" title="Windows Phone 8">Windows Phone 8</a><a href="/en-us/develop/mobile/tutorials/get-started-with-push-ios" title="iOS">iOS</a> <a href="/en-us/develop/mobile/tutorials/get-started-with-push-android" title="Android">Android</a>
</div>	


This topic shows you how to use Windows Azure Mobile Services to send push notifications to a Windows Store app using a Service Bus Notification Hub, which  enables a user to send device push notifications through third-party application platforms, including:
 
• The Windows Push Notification Services (WNS) for Windows 8.


• The Apple Push Notification service (APNs).

Support for the Microsoft Push Notification Service (MPNS) for Windows Phone, and Google Cloud Messaging (GCM), targeting the Android platform, will be added soon.

 
In this tutorial you add push notifications using the Windows Push Notification service (WNS) to the quickstart project. When complete, your mobile service will send a push notification each time a record is inserted.

This tutorial walks you through these basic steps to enable use of Service Bus's Notification Hub:


1. [Register your app for the Windows Store]
2. [Create and Configure a Service Bus Notification Hub]
3. [Connecting the App to the Notification Hub]
4. [Add tag data to table item]
5. [Update scripts to send push notifications]
6. [Insert data to receive notifications]

<h2><a name="register"></a><span class="short-header">Prerequisites</span>Prerequisites</h2>

This tutorial requires the following:

+ Microsoft Visual Studio 2012 Express for Windows 8 RC, or a later version

+ A Windows Store development account.


+ Service Bus .NET Preview SDK. The SDK is a NuGet package that contains Service Bus preview features, and you can download it here. The package is ServiceBus preview features, and it contains a new Service Bus library called Microsoft.ServiceBus.Preview.dll. In order to use Notification Hubs, use this library instead of the production version (Microsoft.ServiceBus.dll).


+ Service Bus WinRT Managed SDK. You can download this SDK here.



This tutorial is based on several earlier Mobile Services tutorials. Before you start this tutorial, you must first complete [Get started with Mobile Services], and [Get started with data]. 



<h2><a name="register"></a><span class="short-header">Register your app</span>Register your app for the Windows Store</h2>

To be able to send push notifications to Windows Store apps from Mobile Services, you must submit your app to the Windows Store. You must then configure your mobile service to integrate with WNS.

<div chunk="../chunks/mobile-services-register-windoes-store-app.md" />
   

7. Back in the Windows Dev Center page for your new app, click **Advanced features**. 

   ![][4] 

8. In the Advanced Features page, click **Push notifications and Live Connect services info**, then click **Authenticating your service**.

   ![][16]

9. Make a note of the values of **Client secret** and **Package security identifier (SID)**. 

   ![][5]

    <div class="dev-callout"><b>Security Note</b>
	<p>The client secret and package SID are important security credentials. Do not share these secrets with anyone or distribute them with your app.</p>
    </div> 

10. Log on to the [Windows Azure Management Portal], click **Mobile Services**, and then click your app.

   ![][9]

11. Click the **Push** tab, enter the **Client secret** and **Package SID** values obtained from WNS in Step 4, and then click **Save**.

   ![][10]

Both your mobile service and your app are now configured to work with WNS.

<h2><a name="create-hub"></a><span class="short-header">Create Notification Hub</span>Create and Configure a Service Bus Notification Hub</h2>

After the basic setup of the Windows app and its matching Windows Store profile, associate the app with a new Service Bus Notification Hub.

1. Log on to the [Windows Azure Management Portal]. Then click **NEW** in the bottom left corner of the page.

2. Click on **Service Bus**, then click **NEW** in the lower left corner, and then click **Notification Hub**. Click **Quick Create** and type a name for the Notification Hub. If the default values are not acceptable, select a geographic region and the Service Bus namespace in which the Notification Hub is created. If there are no namespaces available, a new one with the specified name is created.
 

![][17]

3. To create the Notification Hub, click the check mark. After selecting the Service Bus tab on the left navigation pane, click the newly-created (or reused) namespace. A help page appears. Click **ALL** in the row below the namespace title, and the new Notification Hub appears in the list.
![][18]

4. Click the Notification Hub. The Notification Hub overview page is displayed. Then click the Configure tab at the top.
![][19]
 
5. Insert the Package SID and Client Secret. Then click Save in the bottom toolbar. 

6. Do not navigate away yet. In the Notification Hub, click View SAS Key and note the two values. The values are used to obtain access to the Notification Hub at runtime. You must use these keys to complete this scenario.
![][20]

<h2><a name="connect-app"></a><span class="short-header">Connecting the App</span>Connecting the App to the Notification Hub</h2>

Your App is now linked to its Windows Store profile and that is linked to the Notification Hub. You will now send the application a “toast” alert in this quick first walkthrough. 

First, enable the toast capability in the manifest, which you do in Visual Studio 2012.

1. Right-click the **package.appxmanifest** manifest file in the project and click **Open With**. In the dialog, click **XML Text Editor**.

2. Find the **VisualElements** node and add the attribute *ToastCapable=”true”* as shown in the following snippet. Save and close the application.

		<VisualElements DisplayName="MyPushApp" Logo="Assets\Logo.png"
		                SmallLogo="Assets\SmallLogo.png" Description="App1"
		                ForegroundText="light" BackgroundColor="#464646"
		                ToastCapable="true">
		    <DefaultTile ShowName="allLogos" />
		    <SplashScreen Image="Assets\SplashScreen.png" />
		</VisualElements>


The app must register with the Notification Hub at runtime, so that the particular app instance running on your computer becomes known to the system. Technically, the app registers with both WNS and the Notification Hub, but the Service Bus API wraps these separate steps into a single step. It also remembers the settings across application restarts. In the app settings, you must provide a way for users to disable notifications. See <a href="http://msdn.microsoft.com/en-us/library/windows/apps/Hh761462.aspx">Windows Store guidelines</a>. This information is not covered in this walkthrough. 

1. To implement the push notification client, add a reference to **Microsoft.WindowsAzure.Messaging.Managed.dll** for WinRT from within your project. Download it from <a href="http://go.microsoft.com/fwlink/?LinkID=277160">here</a>. Unzip the downloaded file: the dll you want is in the **releases** directory.

5. Right-click the **References** node in your Visual Studio project and add the new reference. In the dialog, browse to the assembly location and select it.

6. Open the **App.xaml.cs** file. 

7. Add the following using statements:

		using Microsoft.WindowsAzure.Messaging;
		using System.Threading.Tasks;
		using Windows.Data.Xml.Dom;
		using Windows.UI.Notifications;
		

8. Inside the **App** class, add a field to hold a reference to the **NotificationHub** client class for the application – from the Service Bus Notification API:


		sealed partial class App : Application
		{
		    NotificationHub notificationHub;
		


9. Initialize the **notificationHub** in the constructor. To create the connection string, you need the Notification Hub **DefaultListenSharedAccessSignature** value, from the portal. Creating the connection string with this key enables you to create a call signature that expresses access rights for adding a new registration. It does not confer any further rights. Replace *mynamespace* with your own namespace name and ***myhub*** with the name of your Notification Hub.


		public App()
		{
		    var cn = 
		        ConnectionString.CreateUsingSharedAccessSecretWithListenAccess(
		        new Uri("sb://mynamespace.servicebus.windows.net/ "),
		        "… insert DefaultListenSharedAccessSignature key …");
		    notificationHub = new NotificationHub("myhub", cn);
		
		    this.InitializeComponent();
		    this.Suspending += OnSuspending;
		}
		

10. To initialize notifications and renew the registration on app startup, add two methods. The first is **InitializeNotificationsAsync**. This method refreshes existing registrations, and reacquires and reassociates the WNS channel URI whenever needed. It also creates a new registration; or, if a template registration called *myToastRegistration* already exists, it overwrites it.

		async Task InitializeNotificationsAsync()
		{
		    var channel = await PushNotificationChannelManager.CreatePushNotificationChannelForApplicationAsync();
		    await notificationHub.RefreshChannelUriAsync(channel.Uri);
		
		    await notificationHub.CreateTemplateRegistrationAsync(
		            BuildTextToastTemplate(), "myToastRegistration");
		    }
		}


11. The second method is **BuildTextToastTemplate**. It is used when calling **CreatingTemplateRegistrationAsync** on the **notificationHub** instance. It uses the Windows native notification template library. In the *ToastText01* template, modify its text node by adding a Notification Hub template expression: `$(msg)`, as follows:

		XmlDocument BuildTextToastTemplate()
		{
		    var template = 
		        ToastNotificationManager.GetTemplateContent(ToastTemplateType.ToastText01);
		    var textNode = template.SelectSingleNode("//text[@id='1']") as XmlElement;
		    if (textNode != null)
		    {
		        textNode.InnerText = "$(msg)";
		    }
		    return template;
		}
		

This is different from other common push notification API approaches. The app chooses a notification template from the native library. Using the native API, it adds expressions to places at which it expects notification content. Then it registers this customized template with the Notification Hub service. 

Each application instance can choose a different template and different customization expressions. The notification information, which is supplied in the form of key/value pairs, is applied to the template as the notification is delivered. In Windows, it is up to the application whether to receive a particular notification as a toast or as a live tile. It can also register (with two separately named registrations) for both. 

This model enables targeting hundreds of highly customized and concurrent notification registrations that can be served with notifications by sending a single message that carries the key/value information.

12. To add the initialization function to the app, mark the **OnLaunched** method as asynchronous and add the required call:

		protected async override void OnLaunched(LaunchActivatedEventArgs args) 



		{
		    await InitializeNotificationsAsync();
		


13. To perform the registration for other activation modes, add the same call to the **OnActivated** event override:

		protected async override void OnActivated(IActivatedEventArgs args) {
		    base.OnActivated(args);
		    await InitializeNotificationsAsync();
		}



To recap, this procedure showed how to add highly scalable and highly customizable delivery of notification events to your Windows Store app with just a few lines of code.


<h2><a name="add-tag"></a><span class="short-header">Add tag data</span>Add tag data to table item</h2>

Tags allow you to configure your app to filter the stream of push notifications and only receive the ones you are interested in. There are several steps to enable tags: your app must register for the tags you are interested in. And the backend app must somehow tell the Notification Hub what tag to apply to a notification.

In this sample app, we will add a tag field to the Mobile Services table. Inserts
to the table will generate notifications which will use the field for the tag value.

1. Open the file App.xaml.cs and add the following using statement:

        using Windows.Networking.PushNotifications;

2. Add the following to App.xaml.cs:
	
        public static PushNotificationChannel CurrentChannel { get; private set; }

	    private async void AcquirePushChannel()
	    {
            CurrentChannel =  
                await PushNotificationChannelManager.CreatePushNotificationChannelForApplicationAsync();
        }

   This code acquires and stores a push notification channel.
    
3. At the top of the **OnLaunched** event handler in App.xaml.cs, add the following call to the new **AcquirePushChannel** method:

        AcquirePushChannel();

   This guarantees that the **CurrentChannel** property is initialized each time the application is launched.
		
4. Open the project file MainPage.xaml.cs and add the following new attributed property to the **TodoItem** class:

        [JsonProperty(PropertyName = "channel")]
        public string Channel { get; set; }

    <div class="dev-callout"><b>Note</b>
	<p>When dynamic schema is enabled on your mobile service, a new 'channel' column is automatically added to the <strong>TodoItem</strong> table when a new item that contains this property is inserted.</p>
    </div>

5. Replace the **ButtonSave_Click** event handler method with the following code:

	        private void ButtonSave_Click(object sender, RoutedEventArgs e)
	        {
	            var todoItem = new TodoItem { Text = TextInput.Text, Channel = App.CurrentChannel.Uri };
	            InsertTodoItem(todoItem);
            }

   This sets the client's current channel value on the item before it is sent to the mobile service.

6. (Optional) If you are not using the Management Portal-generated quickstart project, open the Package.appxmanifest file and make sure that in the **Application UI** tab, **Toast capable** is set to **Yes**.

   ![][15]

   This makes sure that your app can raise toast notifications. These notifications are already enabled in the downloaded quickstart project.

<h2><a name="update-scripts"></a><span class="short-header">Update the insert script</span>Update the registered insert script in the Management Portal</h2>

1. In the Management Portal, click the **Data** tab and then click the **TodoItem** table. 

   ![][11]

2. In **todoitem**, click the **Script** tab and select **Insert**.
   
  ![][12]

   This displays the function that is invoked when an insert occurs in the **TodoItem** table.

3. Replace the insert function with the following code, and then click **Save**:

        function insert(item, user, request) {
            request.execute({
                success: function() {
                    // Write to the response and then send the notification in the background
                    request.respond();
                    push.wns.sendToastText04(item.channel, {
                        text1: item.text
                    }, {
                        success: function(pushResponse) {
                            console.log("Sent push:", pushResponse);
                        }
                    });
                }
            });
        }

   This registers a new insert script, which uses the [wns object] to send a push notification (the inserted text) to the channel provided in the insert request.

<h2><a name="test"></a><span class="short-header">Test the app</span>Test push notifications in your app</h2>

1. In Visual Studio, press the F5 key to run the app.

2. In the app, type text in **Insert a TodoItem**, and then click **Save**.

   ![][13]

   Note that after the insert completes, the app receives a push notification from WNS.

   ![][14]

## <a name="next-steps"> </a>Next steps

In this simple example a user receives a push notification with the data that was just inserted. The channel used by WNS is supplied to the mobile service by the client in the request. In the next tutorial, [Push notifications to app users], you will create a separate Channel table in which to store channel URIs and send a push notification out to all stored channels when an insert occurs. 

<!-- Anchors. -->
[Create and Configure a Service Bus Notification Hub]: #CreateHub
[Register your app for the Windows Store]: #register
[Connecting the App to the Notification Hub]: #connect-app
[Update scripts to send push notifications]: #update-scripts
[Add tag data to table item]: #add-tag
[Insert data to receive notifications]: #test
[Next Steps]:#next-steps

<!-- Images. -->
[0]: ../Media/mobile-services-submit-win8-app.png
[1]: ../Media/mobile-services-win8-app-name.png
[2]: ../Media/mobile-services-store-association.png
[3]: ../Media/mobile-services-select-app-name.png
[4]: ../Media/mobile-services-win8-edit-app.png
[5]: ../Media/mobile-services-win8-app-push-auth.png
[6]: ../Media/mobile-services-win8-app-advanced.png
[7]: ../Media/mobile-services-win8-app-push-connect.png
[8]: ../Media/mobile-services-win8-app-push-auth.png
[9]: ../Media/mobile-services-selection.png
[10]: ../Media/mobile-push-tab.png
[11]: ../Media/mobile-portal-data-tables.png
[12]: ../Media/mobile-insert-script-push2.png
[13]: ../Media/mobile-quickstart-push1.png
[14]: ../Media/mobile-quickstart-push2.png
[15]: ../Media/mobile-app-enable-toast-win8.png
[16]: ../Media/mobile-services-win8-app-push-connect.png
[17]: ../Media/mobile-create-notification-hub.png
[18]: ../Media/mobile-list-notification-hubs.png
[19]: ../Media/mobile-configure-notification-hub.png
[20]: ../Media/mobile-sas-key-notification-hub.png

mobile-configure-notification-hub

<!-- URLs. -->
[Submit an app page]: http://go.microsoft.com/fwlink/p/?LinkID=266582
[My Applications]: http://go.microsoft.com/fwlink/p/?LinkId=262039
[Live SDK for Windows]: http://go.microsoft.com/fwlink/p/?LinkId=262253
[Get started with Mobile Services]: /en-us/develop/mobile/tutorials/get-started/#create-new-service
[Get started with data]: ../tutorials/mobile-services-get-started-with-data-dotnet.md
[Get started with authentication]: ../tutorials/mobile-services-get-started-with-users-dotnet.md
[Get started with push notifications]: ../tutorials/mobile-services-get-started-with-push-dotnet.md
[Push notifications to app users]: ../tutorials/mobile-services-push-notifications-to-app-users-dotnet.md
[Authorize users with scripts]: ../tutorials/mobile-services-authorize-users-dotnet.md
[JavaScript and HTML]: ../tutorials/mobile-services-get-started-with-push-js.md
[WindowsAzure.com]: http://www.windowsazure.com/
[Windows Azure Management Portal]: https://manage.windowsazure.com/
[Windows Developer Preview registration steps for Mobile Services]: ../HowTo/mobile-services-windows-developer-preview-registration.md
[wns object]: http://go.microsoft.com/fwlink/p/?LinkId=260591
