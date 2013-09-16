<properties linkid="develop-notificationhubs-tutorials-send-breaking-news-windowsdotnet" writer="ricksal" urlDisplayName="Breaking News" pageTitle="Notification Hubs Breaking News Tutorial" metaKeywords="" metaDescription="Learn how to use Windows Azure Service Bus Notification Hubs to send breaking news notifications." metaCanonical="" disqusComments="1" umbracoNaviHide="1" />



# Use Notification Hubs to send breaking news
<div class="dev-center-tutorial-selector sublanding"> 
    	<a href="/en-us/manage/services/notification-hubs/breaking-news-dotnet" title="Windows Store C#" class="current">Windows Store C#</a>
		<a href="/en-us/manage/services/notification-hubs/breaking-news-ios" title="iOS">iOS</a>
</div>

This topic shows you how to use Windows Azure Notification Hubs to broadcast breaking news notifications to a Windows Store app. In this tutorial you start with the app created in [Get started with Notification Hubs]. When complete, you will be able to register for categories you are interested in, and receive only push notifications for those categories.

Note that the same concepts can be seamlessly applied to iOS, Windows Phone 8, and Android clients too. This scenario is a common pattern for many apps where notifications have to be sent to groups of users that have previously declared interest in them, e.g. RSS reader, apps for music fans, etc. 

This tutorial walks you through these basic steps to enable this scenario:

1. [The app user interface]
2. [Client app processing]
3. [Building the Windows Store client app]
4. [Send notifications from your back-end]


There are two parts to this scenario:

- the Windows Store app allows client devices to subscribe to different breaking news categories, using a Notification feature called **tags**; 

- the back-end broadcasts breaking news push notifications for all the categories, but the user will only recieve those notifications they have previously subscribed to.



##Prerequisites ##

You must have already completed the [Get started with Notification Hubs] tutorial and have the code available. You also need Visual Studio 2012.

<h2><a name="ui"></a><span class="short-header">App ui</span>The app user interface</h2>


The app lets you choose the categories to subscribe to. When you choose **subscribe**, the app converts the selected categories into ***tags*** and  registers them with the Notification Hub.

Tags are simple string and do not have to be provisioned in advance. Simply specify a specific tag when you register a device. When pushing a notification to that tag, all devices that have registered for the tag will receive the notification. For more information about tags, refer to [Notification Hubs Guidance].



![][1] 

<h2><a name="client-processing"></a><span class="client processing">App ui</span>Client App Processing</h2>

You register your client app with your notification hub in order to update the device's ChannelURI or device token, as well as register for the tags you are interested in. Generally, you register every time your app starts, but in order to save power and data transmission, you can reduce the frequency by avoiding registration if, when your app starts, less than a specified amount of time (usually a day) has passed since last registration.

Registrations in your notification hub can expire. This means that you cannot reliably store your preferences (the categories you chose) in your notification hub. In this topic we use the device local storage to store your preferences and then register the correct tags to your notification hub. You can also store that information in the cloud using your own app back-end or a [Mobile Service].

If you decide to change the tags you are interested in, you must re-register for the change to be reflected in your notification hub. Otherwise you might lose notifications targeted, or get notifications that you don't want.

Summary:

+ Your device registration in the notification hub might expire, so you have to store the selected categories in the device local storage.
+ You have to register your app with your notification hub, every time you change the selected categories, and every time your app starts


<h2><a name="building-client"></a><span class="building app">App ui</span>Building the Windows Store client app</h2>

We assume that you already followed the [Get started with Notification Hubs] in order to set up your app and create and/or configure your notification hub. Specifically, make sure to go through the following sections:

+ Register your app for push notifications
+ Configure your notification hub (if you already have a Notification Hub, start at step 4)

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

<div chunk="../chunks/notification-hubs-back-end.md" />

## <a name="next-steps"> </a>Next steps

In this tutorial we learned how to broadcast breaking news by category.

To learn how to expand the breaking news app by sending localized notifications,  see [Use Notification Hubs to broadcast localized Breaking News]. If your app must push notifications to specific users and the notification content is private, see the tutorial [Notify users with Notification Hubs]. 



<!-- Anchors. -->
[The app user interface]: #ui
[Client App Processing]: #client-processing
[Building the Windows Store client app]: #building-client
[Send notifications from your back-end]: #send
[Next Steps]: #next-steps

<!-- Images. -->
[0]: mobile-services-submit-win8-app.png
[1]: ../media/notification-hub-breakingnews-win1.png
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
[13]: ../media/notification-hub-create-console-app.png
[14]: ../media/notification-hub-windows-toast.png
[15]: ../media/notification-hub-scheduler1.png
[16]: ../media/notification-hub-scheduler2.png
[17]: mobile-services-win8-edit2-app.png
[18]: notification-hub-win8-app-toast.png
[19]: notification-hub-windows-reg.png

<!-- URLs.-->
[Get started with Notification Hubs]: ./getting-started-windowsdotnet.md
[Use Notification Hubs to broadcast localized Breaking News]: ./breakingnews-localized-dotnet.md 
[Notify users with Notification Hubs]: ./tutorial-notify-users-mobileservices.md
[Mobile Service]: ../../../DevCenter/Mobile/Tutorials/mobile-services-get-started.md

[Notification Hubs Guidance]: http://msdn.microsoft.com/en-us/library/jj927170.aspx
[Notification Hubs How-To for Windows Store]: http://msdn.microsoft.com/en-us/library/jj927172.aspx

[Submit an app page]: http://go.microsoft.com/fwlink/p/?LinkID=266582
[My Applications]: http://go.microsoft.com/fwlink/p/?LinkId=262039
[Live SDK for Windows]: http://go.microsoft.com/fwlink/p/?LinkId=262253
[WindowsAzure.com]: http://www.windowsazure.com/
[Windows Azure Management Portal]: https://manage.windowsazure.com/
[Windows Developer Preview registration steps for Mobile Services]: ../HowTo/mobile-services-windows-developer-preview-registration.md
[wns object]: http://go.microsoft.com/fwlink/p/?LinkId=260591





