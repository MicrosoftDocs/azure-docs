<properties linkid="develop-notificationhubs-tutorials-send-breaking-news-windowsdotnet" writer="ricksal" urlDisplayName="Breaking News" pageTitle="Notification Hubs Breaking News Tutorial" metaKeywords="" metaDescription="Learn how to use Windows Azure Service Bus Notification Hubs to send breaking news notifications." metaCanonical="" disqusComments="1" umbracoNaviHide="1" />

<div chunk="../chunks/article-left-menu-windows-store.md" />

# Use Notification Hubs to send breaking news
<div class="dev-center-tutorial-selector sublanding"> 
    	<a href="/en-us/manage/services/notification-hubs/notify-users-aspnet" title="Windows Store C#" class="current">Windows Store C#</a>
		<a href="/en-us/manage/services/notification-hubs/notify-users-mobile-ios" title="iOS">iOS</a>
</div>

This topic shows you how to use Windows Azure Notification Hubs to broadcast breaking news notifications to a Windows Store app. In this tutorial you start with the app created in [Get started with Notification Hubs]. When complete, you will be able to register for categories you are interested in, and receive only push notifications for those categories.

Note that the same concepts can be seamlessly applied to iOS, Windows Phone 8, and Android clients too. This scenario is a common pattern for many apps where notifications have to be sent to groups of users that have previously declared interest in them, e.g. RSS reader, apps for music fans, etc. 

This tutorial walks you through these basic steps to enable this scenario:

1. [The app user interface]
2. [Client app processing]
3. [Building the Windows Store client app]
4. [Send notifications from your back-end]


There are two pieces to this scenario:

- the Windows Store app allows client devices to subscribe to different breaking news categories, using a Notification feature called **tags**; 

- the back-end broadcasts breaking news push notifications for all the categories, but the user will only recieve those notifications they have previously subscribed to.



If your app has to push notifications to specific users and, more importantly, the notification content is private, please follow the topic [Use Notification Hubs to send notifications to users].

##Prerequisites ##

You must have already completed the [Get started with Notification Hubs] tutorial and have the code available.

<h2><a name="ui"></a><span class="short-header">App ui</span>The app user interface</h2>


The app lets the user choose the categories to which they want to subscribe. When the user chooses **subscribe**, the app will convert the selected categories into ***tags*** and then register them with the Notification Hub.

Tags are simple string and do not have to be provisioned in advance. Simply specify a specific tag when you register a device. When pushing a notification to that tag, all devices that have registered for that tag will receive the notification. For more information about tags, refer to [Notification Hubs Guidance].



![][1] 

<h2><a name="processing"></a><span class="client processing">App ui</span>Client App Processing</h2>

Note: As shown in [Get started with Notification Hubs] and explained in [Notification Hubs Guidance], you have to register your client app with your notification hub in order to update the device's ChannelURI or device token, as well as register for the tags you are interested in.

 Generally, you register every time your app starts, but in order to save power and data transmission, you can reduce the frequency by avoiding registration if, when your app starts, less than a specified amount of time (usually a day) has passed since last registration.

Remember, though, that registrations in your notification hub can expire. This means that you cannot safely store your users' preferences (the categories they selected) using only your Notification Hub. In this topic we will use the device local storage to store user preferences and then register the correct tags to your Notification Hub. In general, you can store that information in the cloud using your own app back-end or a [Mobile Service].

Important: if you decide to change the tags you are interested in, you have to re-register or the change will not be reflected in your Notification Hub and you might lose notifications targeted at the device or send notifications that the user should not receive.

Summarizing:

+ Your device registration in the Notification Hub might expire, so you have to store the selected categories in the device local storage.
+ You have to register your app with your Notification Hub, every time the user changes the selected categories, and every time your app starts


<h2><a name="building-client"></a><span class="building app">App ui</span>Building the Windows Store client app</h2>

We assume that you already followed the [Get started with Notification Hubs] in order to set up your app and create and/or configure your Notification Hub. Specifically, make sure to go through the following sections:

+ Register your app for push notifications
+ Configure your Notification Hub (if you already have a Notification Hub, start at step 4)

Then, make sure to install the <a href="http://nuget.org/packages/WindowsAzure.Messaging.Managed/">WindowsAzure.Messaging.Managed NuGet package</a>.

+ In Visual Studio Main Menu, select **TOOLS** -> **Library Package Manager** -> **Package Manager Console**. Then, in the console window type:

        Install-Package WindowsAzure.Messaging.Managed

    and press Enter. 

We will build the app around the two main use cases:

+ When a user selects a set of categories we store them in the local storage and register the corresponding tags with your Notification Hub,
+ When your app starts, we register the categories stored with your Notification Hub.

### Choosing the news categories

1. Open your MainPage.xaml, then copy the following code in the Grid element:
			
		<Grid Margin="120, 58, 120, 80" >
            <Grid.RowDefinitions>
                <RowDefinition />
                <RowDefinition />
                <RowDefinition />
                <RowDefinition />
                <RowDefinition />
            </Grid.RowDefinitions>
            <Grid.ColumnDefinitions>
                <ColumnDefinition />
                <ColumnDefinition />
            </Grid.ColumnDefinitions>
            <TextBlock Grid.Row="0" Grid.Column="0" Grid.ColumnSpan="2"  TextWrapping="Wrap" Text="Breaking News" FontSize="42" VerticalAlignment="Top"/>
            <ToggleSwitch Header="World" Name="WorldToggle" Grid.Row="1" Grid.Column="0"/>
            <ToggleSwitch Header="Politics" Name="PoliticsToggle" Grid.Row="2" Grid.Column="0"/>
            <ToggleSwitch Header="Business" Name="BusinessToggle" Grid.Row="3" Grid.Column="0"/>
            <ToggleSwitch Header="Technology" Name="TechnologyToggle" Grid.Row="1" Grid.Column="1"/>
            <ToggleSwitch Header="Science" Name="ScienceToggle" Grid.Row="2" Grid.Column="1"/>
            <ToggleSwitch Header="Sports" Name="SportsToggle" Grid.Row="3" Grid.Column="1"/>
            <Button Content="Subscribe" HorizontalAlignment="Center" Grid.Row="4" Grid.Column="0" Grid.ColumnSpan="2" Click="Button_Click" />
        </Grid>

2. Create a new public class called `Notifications` add the following statements:

		using Windows.Networking.PushNotifications;
		using Microsoft.WindowsAzure.Messaging;
		using System.Threading.Tasks;
		using Windows.Storage;

3. Then copy the following code in the class, making sure to replace your notification hub name and use the connection string with listen access:

		private NotificationHub hub;

        public Notifications()
        {
            hub = new NotificationHub("<hub name>", "<connection string>");
        }

        public async Task StoreCategoriesAndSubscribe(IEnumerable<string> categories)
        {
            ApplicationData.Current.LocalSettings.Values["categories"] = string.Join(",", categories);
            await SubscribeToCategories(categories);
        }

        public async Task SubscribeToCategories(IEnumerable<string> categories)
        {
            var channel = await PushNotificationChannelManager.CreatePushNotificationChannelForApplicationAsync();
            await hub.RegisterNativeAsync(channel.Uri, categories);
        }

    This class uses the local storage to store the categories of news that this device has to receive. Also, it contains methods to register these categories

4. In your App.xaml.cs, add the following property to the *App* class:

		public Notifications Notifications = new Notifications();

	We will use this property to create and easily access a singleton instance of Notifications.

5. In your MainPage.xaml.cs, add the following line:

		using Windows.UI.Popups;


6. In your MainPage.xaml.cs, add the following method:

		private async void Button_Click(object sender, RoutedEventArgs e)
        {
            var categories = new HashSet<string>();
            if (WorldToggle.IsOn) categories.Add("World");
            if (PoliticsToggle.IsOn) categories.Add("Politics");
            if (BusinessToggle.IsOn) categories.Add("Business");
            if (TechnologyToggle.IsOn) categories.Add("Technology");
            if (ScienceToggle.IsOn) categories.Add("Science");
            if (SportsToggle.IsOn) categories.Add("Sports");

            await ((App)Application.Current).Notifications.StoreCategoriesAndSubscribe(categories);

            var dialog = new MessageDialog("Subscribed to: " + string.Join(",", categories));
            dialog.Commands.Add(new UICommand("OK"));
            await dialog.ShowAsync();
        }
	This method creates a list of categories and uses the `Notifications` class to store the list in the local storage and register the corresponding tags with your Notification Hub.

Our app is now able to store a set of categories in the device local storage and to register with the notification hub whenever the user changes the selection of categories. Since it is not guaranteed that the user will regularly subscribe, we have to make sure that when the app starts, we register with the notification hub the categories that have been stored in local storage.

### Registering when your app starts

1. Add this code to the *Notifications* class in App.xaml.cs, which will retrieve the categories in the Notifications class:

		public IEnumerable<string> RetrieveCategories()
        {
            var categories = (string) ApplicationData.Current.LocalSettings.Values["categories"];
            return categories != null ? categories.Split(','): new string[0];
        }

2. In your App.xaml.cs, add the following code at the bottom of the *OnLaunched* method:

		Notifications.SubscribeToCategories(Notifications.RetrieveCategories());

	Now, every time the app starts, it will retrieve the categories and register for the categories saved in the local storage.

3. Finally, when starting, we want to update the MainPage with the categories previously saved. In your MainPage.xaml.cs, add the following code in the *OnNavigatedTo* method:

		var categories = ((App)Application.Current).Notifications.RetrieveCategories();

        if (categories.Contains("World")) WorldToggle.IsOn = true;
        if (categories.Contains("Politics")) PoliticsToggle.IsOn = true;
        if (categories.Contains("Business")) BusinessToggle.IsOn = true;
        if (categories.Contains("Technology")) TechnologyToggle.IsOn = true;
        if (categories.Contains("Science")) ScienceToggle.IsOn = true;
        if (categories.Contains("Sports")) SportsToggle.IsOn = true;

Our app is now completed.


Our app is now able to store a set of categories in the device local storage and to register with the notification hub whenever the user changes the selection of categories. Since it is not guaranteed that the user will regularly subscribe, we have to make sure that when the app starts, we register with your notification hub the categories that have been stored in the local storage.

You can now run the app and verify that clicking the subscribe button will trigger a registration to your Notification Hub.


<h2><a name="send"></a><span class="short-header">Send notifications</span>Send notifications from your back-end</h2>

You can send notifications using notification hubs from any back-end using the <a href="http://msdn.microsoft.com/en-us/library/windowsazure/dn223264.aspx">REST interface</a>. 

This section shows how to send notifications in two different ways:

- using a console app
- using a Mobile Services script

We also include the needed code to broadcast to both Windows Store and iOS devices, since the backend can broadcast to any of the supported devices



## To send notifications using a C# console app ##

1. In Visual Studio create a new Visual C# console application: 

   ![][13]

2. Add a reference to the Windows Azure Service Bus SDK with the <a href="http://nuget.org/packages/WindowsAzure.ServiceBus/">WindowsAzure.ServiceBus NuGet package</a>. In the Visual Studio main menu, click **Tools**, then click **Library Package Manager**, then click **Package Manager Console**. Then, in the console window type the following:

        Install-Package WindowsAzure.ServiceBus

    then press **Enter**.

3. Open the file Program.cs and add the following `using` statement:

        using Microsoft.ServiceBus.Notifications;

4. In the `Program` class, add the following method:

        private static async void SendNotificationAsync()
        {
		    NotificationHubClient hub = NotificationHubClient.CreateClientFromConnectionString("<connection string with full access>", "<hub name>");
		
            var category = "World";
            var toast = @"<toast><visual><binding template=""ToastText02""><text id=""1"">" + "Breaking " + category + " News!" + "</text></binding></visual></toast>";
            await hub.SendWindowsNativeNotificationAsync(toast, category);

            category = "Politics";
            toast = @"<toast><visual><binding template=""ToastText02""><text id=""1"">" + "Breaking " + category + " News!" + "</text></binding></visual></toast>";
            await hub.SendWindowsNativeNotificationAsync(toast, category);

            category = "Business";
            toast = @"<toast><visual><binding template=""ToastText02""><text id=""1"">" + "Breaking " + category + " News!" + "</text></binding></visual></toast>";
            await hub.SendWindowsNativeNotificationAsync(toast, category);

            category = "Technology";
            toast = @"<toast><visual><binding template=""ToastText02""><text id=""1"">" + "Breaking " + category + " News!" + "</text></binding></visual></toast>";
            await hub.SendWindowsNativeNotificationAsync(toast, category);

            category = "Science";
            toast = @"<toast><visual><binding template=""ToastText02""><text id=""1"">" + "Breaking " + category + " News!" + "</text></binding></visual></toast>";
            await hub.SendWindowsNativeNotificationAsync(toast, category);

            category = "Sports";
            toast = @"<toast><visual><binding template=""ToastText02""><text id=""1"">" + "Breaking " + category + " News!" + "</text></binding></visual></toast>";
            await hub.SendWindowsNativeNotificationAsync(toast, category);

		
		    var alert = "{\"aps\":{\"alert\":\"Breaking News!\"}, \"inAppMessage\":\"Breaking News!\"}";
		    await hub.SendAppleNativeNotificationAsync(toast, "<category>");
		 }

   Make sure to insert the name of your hub and the connection string called **DefaultFullSharedAccessSignature** that you obtained in the section "Configure your Notification Hub." Note that this is the connection string with **Full** access, not **Listen** access.

Note that this code sends one notification for each of 6 tags. Your device will only receive notitications for the ones you have registered for.

Also note the last line of code sends an alert to an iOS device. this shows how a single notification hub can push notifications to multiple device types. In this line, replace the category placeholder with any one of the category tags that we used in our client apps ("World", "Politics", "Business", "Technology", "Science", "Sports").

7. Then add the following lines in the `Main` method:

         SendNotificationAsync();
		 Console.ReadLine();

8. Press the **F5** key to run the app. You should receive a toast notification for each category that you registered for.

   ![][14]

## Mobile Services ##

To send a notification using a Mobile Service, follow [Get started with Mobile Services], then do the following:

1. Log on to the [Windows Azure Management Portal], and click your Mobile Service.

2. Select the tab **Scheduler** on the top.

   ![][15]

3. Create a new scheduled job, insert a name, and then click **On demand**.

   ![][16]

4. When the job is created, click the job name. Then click the **Script** tab in the top bar.

5. Insert the following script inside your scheduler function. Make sure to replace the placeholders with your notification hub name and the connection string for *DefaultFullSharedAccessSignature* that you obtained earlier. When you are finished, click **Save** on the bottom bar.

    var azure = require('azure');
    var notificationHubService = azure.createNotificationHubService('<hub name>', <connection string with full access>');
    notificationHubService.wns.sendToastText01(
        '<category>',
        {
            text1: 'Breaking News!'
        },
        function (error) {
            if (!error) {
                console.warn("Notification successful");
            }
    });
    notificationHubService.hub.apple.send(
        '<category>',
        {
            alert: "Breaking News!"
        },
        function (error)
        {
            if (!error) {
                console.warn("Notification successful");
            }
        }
    );



6. Click **Run Once** on the bottom bar. You should receive a toast notification.



## Next Steps
In this tutorial we learned how to broadcast breaking news by category. If you want to learn how to send private notifications to single users please follow [Use Notification Hubs to send notifications to users]. Also, if you want to learn how to expand the breaking news app by sending localized notifications follow [Use Notification Hubs to broadcast localized Breaking News].


<!-- Anchors. -->
[The app user interface]: #ui
[Client App Processing]: #client-processing
[Building the Windows Store client app]: #building-client
[Send notifications from your back-end]: #send
[Next Steps]:#next-steps

<!-- Images. -->
[0]: mobile-services-submit-win8-app.png
[1]: notification-hub-breakingnews-win1.png
[2]: notification-hub-create-win8-app.png
[3]: notification-hub-associate-win8-app.png
[4]: mobile-services-select-app-name.png
[5]: mobile-services-win8-edit-app.png
[6]: mobile-services-win8-app-push-auth.png
[7]: notification-hub-create-from-portal.png
[8]: notification-hub-create-from-portal2.png
[9]: notification-hub-select-from-portal.png
[10]: notification-hub-select-from-portal2.png
[11]: notification-hub-configure-wns.png
[12]: notification-hub-connection-strings.png
[13]: notification-hub-create-console-app.png
[14]: notification-hub-windows-toast.png
[15]: notification-hub-scheduler1.png
[16]: notification-hub-scheduler2.png
[17]: mobile-services-win8-edit2-app.png
[18]: notification-hub-win8-app-toast.png
[19]: notification-hub-windows-reg.png

<!-- URLs. -->
[Get started with Notification Hubs]: mobile-services-get-started-with-notification-hub-dotnet.md
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
[Notification Hubs Guidance]: http://msdn.microsoft.com/en-us/library/jj927170.aspx
[Notification Hubs How-To for Windows Store]: http://msdn.microsoft.com/en-us/library/jj927172.aspx
