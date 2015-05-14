<properties 
	pageTitle="Use Notification Hubs to send breaking news (Windows Phone)" 
	description="Use  Azure Notification Hubs to use tag in registrations to send breaking news to a Windows Phone app." 
	services="notification-hubs" 
	documentationCenter="windows" 
	authors="wesmc7777" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="notification-hubs" 
	ms.workload="mobile" 
	ms.tgt_pltfrm="mobile-windows-phone" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.date="04/27/2015" 
	ms.author="wesmc"/>

# Use Notification Hubs to send breaking news
<div class="dev-center-tutorial-selector sublanding"> 
    	<a href="notification-hubs-windows-store-dotnet-send-breaking-news.md" title="Windows Universal">Windows Universal</a><a href="/documentation/articles/notification-hubs-windows-phone-send-breaking-news/" title="Windows Phone" class="current">Windows Phone</a><a href="/documentation/articles/notification-hubs-ios-send-breaking-news/" title="iOS">iOS</a><a href="/documentation/articles/notification-hubs-aspnet-backend-android-breaking-news/" title="Android">Android</a>
</div>

##Overview

This topic shows you how to use Azure Notification Hubs to broadcast breaking news notifications to a Windows Phone 8.0/8.1 Silverlight app. If you are targeting Windows Store or Windows Phone 8.1 app, please refer to to the [Windows Universal](notification-hubs-windows-store-dotnet-send-breaking-news.md) version. When complete, you will be able to register for breaking news categories you are interested in, and receive only push notifications for those categories. This scenario is a common pattern for many apps where notifications have to be sent to groups of users that have previously declared interest in them, e.g. RSS reader, apps for music fans, etc. 

Broadcast scenarios are enabled by including one or more _tags_ when creating a registration in the notification hub. When notifications are sent to a tag, all devices that have registered for the tag will receive the notification. Because tags are simply strings, they do not have to be provisioned in advance. For more information about tags, refer to [Notification Hubs Guidance]. 

##Prerequisites

This topic builds on the app you created in [Get started with Notification Hubs]. Before starting this tutorial, you must have already completed [Get started with Notification Hubs].

##Add category selection to the app

The first step is to add the UI elements to your existing main page that enable the user to select categories to register. The categories selected by a user are stored on the device. When the app starts, a device registration is created in your notification hub with the selected categories as tags. 

1. Open the MainPage.xaml project file, then replace the **Grid** elements named `TitlePanel` and `ContentPanel` with the following code:
			
        <StackPanel x:Name="TitlePanel" Grid.Row="0" Margin="12,17,0,28">
            <TextBlock Text="Breaking News" Style="{StaticResource PhoneTextNormalStyle}" Margin="12,0"/>
            <TextBlock Text="Categories" Margin="9,-7,0,0" Style="{StaticResource PhoneTextTitle1Style}"/>
        </StackPanel>

        <Grid Name="ContentPanel" Grid.Row="1" Margin="12,0,12,0">
            <Grid.RowDefinitions>
                <RowDefinition Height="auto"/>
                <RowDefinition Height="auto" />
                <RowDefinition Height="auto" />
                <RowDefinition Height="auto" />
            </Grid.RowDefinitions>
            <Grid.ColumnDefinitions>
                <ColumnDefinition />
                <ColumnDefinition />
            </Grid.ColumnDefinitions>
            <CheckBox Name="WorldCheckBox" Grid.Row="0" Grid.Column="0">World</CheckBox>
            <CheckBox Name="PoliticsCheckBox" Grid.Row="1" Grid.Column="0">Politics</CheckBox>
            <CheckBox Name="BusinessCheckBox" Grid.Row="2" Grid.Column="0">Business</CheckBox>
            <CheckBox Name="TechnologyCheckBox" Grid.Row="0" Grid.Column="1">Technology</CheckBox>
            <CheckBox Name="ScienceCheckBox" Grid.Row="1" Grid.Column="1">Science</CheckBox>
            <CheckBox Name="SportsCheckBox" Grid.Row="2" Grid.Column="1">Sports</CheckBox>
            <Button Name="SubscribeButton" Content="Subscribe" HorizontalAlignment="Center" Grid.Row="3" Grid.Column="0" Grid.ColumnSpan="2" Click="SubscribeButton_Click" />
        </Grid>

2. In the project, create a new class named **Notifications**, add the **public** modifier to the class definition, then add the following **using** statements to the new code file:

		using Microsoft.Phone.Notification;
		using Microsoft.WindowsAzure.Messaging;
		using System.IO.IsolatedStorage;

3. Copy the following code into the new **Notifications** class:

		private NotificationHub hub;

		public Notifications()
		{
		    hub = new NotificationHub("<hub name>", "<connection string with listen access>");
		}
		
		public async Task StoreCategoriesAndSubscribe(IEnumerable<string> categories)
		{
		    var categoriesAsString = string.Join(",", categories);
		    var settings = IsolatedStorageSettings.ApplicationSettings;
		    if (!settings.Contains("categories"))
		    {
		        settings.Add("categories", categoriesAsString);
		    }
		    else
		    {
		        settings["categories"] = categoriesAsString;
		    }
		    settings.Save();
		
		    await SubscribeToCategories(categories);
		}
		
		public async Task SubscribeToCategories(IEnumerable<string> categories)
		{
		    var channel = HttpNotificationChannel.Find("MyPushChannel");
		
		    if (channel == null)
		    {
		        channel = new HttpNotificationChannel("MyPushChannel");
		        channel.Open();
		        channel.BindToShellToast();
		    }
		
		    await hub.RegisterNativeAsync(channel.ChannelUri.ToString(), categories);
		}

    This class uses the local storage to store the categories of news that this device has to receive. It also contains methods to register for these categories.

4. In the above code, replace the `<hub name>` and `<connection string with listen access>` placeholders with your notification hub name and the connection string for *DefaultListenSharedAccessSignature* that you obtained earlier.

	> [AZURE.NOTE] Because credentials that are distributed with a client app are not generally secure, you should only distribute the key for listen access with your client app. Listen access enables your app to register for notifications, but existing registrations cannot be modified and notifications cannot be sent. The full access key is used in a secured backend service for sending notifications and changing existing registrations.

4. In the App.xaml.cs project file, add the following property to the **App** class:

		public Notifications notifications = new Notifications();

	This property is used to create and access a **Notifications** instance.

5. In your MainPage.xaml.cs, add the following line:

		using Windows.UI.Popups;

6. In the MainPage.xaml.cs project file, add the following method:

		private async void SubscribeButton_Click(object sender, RoutedEventArgs e)
		{
		    var categories = new HashSet<string>();
		    if (WorldCheckBox.IsChecked == true) categories.Add("World");
		    if (PoliticsCheckBox.IsChecked == true) categories.Add("Politics");
		    if (BusinessCheckBox.IsChecked == true) categories.Add("Business");
		    if (TechnologyCheckBox.IsChecked == true) categories.Add("Technology");
		    if (ScienceCheckBox.IsChecked == true) categories.Add("Science");
		    if (SportsCheckBox.IsChecked == true) categories.Add("Sports");
		
		    await ((App)Application.Current).notifications.StoreCategoriesAndSubscribe(categories);
		
		    MessageBox.Show("Subscribed to: " + string.Join(",", categories));
		}
	
	This method creates a list of categories and uses the **Notifications** class to store the list in the local storage and register the corresponding tags with your notification hub. When categories are changed, the registration is recreated with the new categories.

Your app is now able to store a set of categories in local storage on the device and register with the notification hub whenever the user changes the selection of categories. 

##Register for notifications

These steps register with the notification hub on startup using the categories that have been stored in local storage. 

> [AZURE.NOTE] Because the channel URI assigned by the Microsoft Push Notification Service (MPNS) can chance at any time, you should register for notifications frequently to avoid notification failures. This example registers for notification every time that the app starts. For apps that are run frequently, more than once a day, you can probably skip registration to preserve bandwidth if less than a day has passed since the previous registration.

1. Add the following code to the **Notifications** class:

		public IEnumerable<string> RetrieveCategories()
		{
		    var categories = (string)IsolatedStorageSettings.ApplicationSettings["categories"];
		    return categories != null ? categories.Split(',') : new string[0];
		}

	This returns the categories defined in the class.

1. Open the App.xaml.cs file and add the **async** modifier to **Application_Launching** method.

2. In the **Application_Launching** method, locate and replace the Notification Hubs registration code that you added in [Get started with Notification Hubs] with the following line of code:

		await notifications.SubscribeToCategories(notifications.RetrieveCategories());

	This makes sure that every time the app starts it retrieves the categories from local storage and requests a registeration for these categories. 

3. In the MainPage.xaml.cs project file, add the following code that implements the **OnNavigatedTo** method:

		protected override void OnNavigatedTo(NavigationEventArgs e)
		{
		    var categories = ((App)Application.Current).notifications.RetrieveCategories();
		
		    if (categories.Contains("World")) WorldCheckBox.IsChecked = true;
		    if (categories.Contains("Politics")) PoliticsCheckBox.IsChecked = true;
		    if (categories.Contains("Business")) BusinessCheckBox.IsChecked = true;
		    if (categories.Contains("Technology")) TechnologyCheckBox.IsChecked = true;
		    if (categories.Contains("Science")) ScienceCheckBox.IsChecked = true;
		    if (categories.Contains("Sports")) SportsCheckBox.IsChecked = true;
		}

	This updates the main page based on the status of previously saved categories. 

The app is now complete and can store a set of categories in the device local storage used to register with the notification hub whenever the user changes the selection of categories. Next, we will define a backend that can send category notifications to this app.

##Send notifications from your back-end

[AZURE.INCLUDE [notification-hubs-back-end](../includes/notification-hubs-back-end.md)]

##Run the app and generate notifications

1. In Visual Studio, press F5 to compile and start the app.

	![][1] 

	Note that the app UI provides a set of toggles that lets you choose the categories to subscribe to. 

2. Enable one or more categories toggles, then click **Subscribe**.

	The app converts the selected categories into tags and requests a new device registration for the selected tags from the notification hub. The registered categories are returned and displayed in a dialog.

	![][2]

4. Send a new notification from the backend in one of the following ways:

	+ **Console app:** start the console app.

	+ **Java/PHP:** run your app/script.

	Notifications for the selected categories appear as toast notifications.

	![][3]

You have completed this topic.

<!--##Next steps

In this tutorial we learned how to broadcast breaking news by category. Consider completing one of the following tutorials that highlight other advanced Notification Hubs scenarios:

+ [Use Notification Hubs to broadcast localized breaking news]

	Learn how to expand the breaking news app to enable sending localized notifications. 

+ [Notify users with Notification Hubs]

	Learn how to push notifications to specific authenticated users. This is a good solution for sending notifications only to specific users.
-->

<!-- Anchors. -->
[Add category selection to the app]: #adding-categories
[Register for notifications]: #register
[Send notifications from your back-end]: #send
[Run the app and generate notifications]: #test-app
[Next Steps]: #next-steps

<!-- Images. -->
[1]: ./media/notification-hubs-windows-phone-send-breaking-news/notification-hub-breakingnews.png
[2]: ./media/notification-hubs-windows-phone-send-breaking-news/notification-hub-registration.png
[3]: ./media/notification-hubs-windows-phone-send-breaking-news/notification-hub-toast.png



<!-- URLs.-->
[Get started with Notification Hubs]: /manage/services/notification-hubs/get-started-notification-hubs-wp8/
[Use Notification Hubs to broadcast localized breaking news]: breakingnews-localized-wp8.md 
[Notify users with Notification Hubs]: /manage/services/notification-hubs/notify-users/
[Mobile Service]: /develop/mobile/tutorials/get-started
[Notification Hubs Guidance]: http://msdn.microsoft.com/library/jj927170.aspx
[Notification Hubs How-To for Windows Phone]: ??

[Azure Management Portal]: https://manage.windowsazure.com/




