# Use Notification Hubs to send breaking news

In this topic you will learn how to use Notification Hubs to broadcast breaking news notifications to mobile apps. This scenario is a template for many apps where notifications have to be sent to groups of users that have previously declared interest in them, e.g. RSS reader, apps for music fans. If your app has to push notifications to specific users and, more importantly, the notification content is private, please follow the topic [Use Notification Hubs to send notifications to users].

The app that you will build allows client devices to subscribe to different breaking news categories, and then enables the back-end to broadcast push notifications of any category reaching the users that previously subscribed to it.

![][1] ![][2]

You will use *tags* to represent categories. Tags are simple string and do not have to be provisioned in advance. Simply specify a specific tag when you register a set of devices, and when pushing a notification to that tag, all those devices will receive your notification. For more information about tags, refer to [Notification Hubs Guidance].

In this topic we will show you how to build an app that has both a Windows Store and an iOS client. Note that the same concepts can be seamlessly applied if you have a Windows Phone 8 and an Android client too. We assume, however, that you already followed the [Get started with Notification Hubs] for your device platform of choice.

## Client Apps

In your client app, you will let the user choose the categories to which he wants to subscribe, and then you will have to register those categories in your Notification Hub.
Remember, though, that registrations in your notification hub can expire. This means that you cannot safely store your users' preferences (the categories they selected) using only your Notification Hub. In this topic we will use the device local storage to store user preferences and then register the correct tags to your Notification Hub. In general, you can store that information in the cloud using your own app back-end or a [Mobile Service].

Note: As shown in [Get started with Notification Hub] and explained in [Notification Hubs Guidance], you have to register your client app in order to update its ChannelURI or device token. Generally, you register every time your app starts, but in order to save power and data transmission, you can reduce the frequency by avoiding registration if, when your app starts, less than a specified amount of time (usually a day) has passed since last registration.
Important: if your tags change you have to register or the change will not be reflected in your Notification Hub and you might lose notifications targeted at the device or send notifications that the user should not receive.

Summarizing:

+ Your device registration in the Notification Hub might expire, so you have to store the selected categories in the device local storage.
+ You have to register your app with your Notification Hub, every time the user changes the selected categories, and every time your app starts

Follow the following sub-topic to create your Windows Store or iOS client app. Note that you do not have to build both client apps.


------------------------------------- These should be different topics -------------------

## Windows Store client app

In this sub-topic, we assume that you already followed the [Get started with Notification Hubs]in order to set up your app and create and/or configure you Notification Hub.
Specifically, make sure to go through the following sections:

+ Register your app for push notifications
+ Configure your Notification Hub (if you already have a Notification Hub, start at step 4)

Then, make sure to install the <a href="http://nuget.org/packages/WindowsAzure.Messaging.Managed/">WindowsAzure.Messaging.Managed NuGet package</a>.

+ In Visual Studio Main Menu, select **TOOLS** -> **Library Package Manager** -> **Package Manager Console**. Then, in the console window type:

        Install-Package WindowsAzure.Messaging.Managed

    and press Enter. 

We will build the app by following the two main use cases:
+ When a user selects a set of categories we store them in the local storage and register the corresponding tags with your Notification Hub,
+ When your app starts, we register the categories stored with your Notification Hub.

### User chooses the news categories

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

2. Create a new public class called Notifications add the following statements:

		using Windows.Networking.PushNotifications;
		using Microsoft.WindowsAzure.Messaging;

3. Then copy the following code in the class, making sure to replace your notification hub name and connection string with listen access:

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

4. In your App.xaml.cs, add the following property:

		public Notifications Notifications = new Notifications();
	We will use this property to create and easily access a singleton instance of Notifications.

5. In your MainPage.xaml.cs, add the following method:

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
	This method creates a list of categories and uses the Notifications class to store the list in the local storage and register the corresponding tags with your Notification Hub.

Our app is now able to store a set of categories in the device local storage and to register with the notification hub whenever the user changes the selection of categories. Since it is not guaranteed that the user will regularly subscribe, we have to make sure that when the app starts, we register with notification hub the categories that have been stored in the local storage.

### Registering when your app starts

1. First we have to add the code to retrieve the categories in the Notifications class:

		public IEnumerable<string> RetrieveCategories()
        {
            var categories = (string) ApplicationData.Current.LocalSettings.Values["categories"];
            return categories != null ? categories.Split(','): new string[0];
        }

2. In your App.xaml.cs, add at the bottom of the OnLaunched method the following code:

		Notifications.SubscribeToCategories(Notifications.RetrieveCategories());
	Now, every time the app starts, it will retrieve the categories and register for the categories saved in the local storage.

3. Finally, when starting, we want to update the MainPage with the categories previously saved. In your MainPage.xaml.cs, add the following code in the OnNavigatedTo method:

		var categories = ((App)Application.Current).Notifications.RetrieveCategories();

        if (categories.Contains("World")) WorldToggle.IsOn = true;
        if (categories.Contains("Politics")) PoliticsToggle.IsOn = true;
        if (categories.Contains("Business")) BusinessToggle.IsOn = true;
        if (categories.Contains("Technology")) TechnologyToggle.IsOn = true;
        if (categories.Contains("Science")) ScienceToggle.IsOn = true;
        if (categories.Contains("Sports")) SportsToggle.IsOn = true;

Our app is now completed.


--------------------------------------The following should be the iOS subtopic ---------

## iOS client app

In this sub-topic, we assume that you already followed the [Get started with Notification Hubs] for iOS apps in order to set up your app and create and/or configure you Notification Hub.
Specifically, make sure to go through the following sections:

+ Generate the certificate signing request
+ Register your app and enable push notifications
+ Create a provisioning profile for the app
+ Configure your Notification Hub (if you already have a Notification Hub, start at step 4)
+ Connecting your app to the Notification Hub, up to step 3.

We will build the app by following the two main use cases:
+ When a user selects a set of categories we store them in the local storage and register the corresponding tags with your Notification Hub,
+ When your app starts, we register the categories stored with your Notification Hub.


### User chooses the news categories

Assume familiar with Apple tutorial

1. Follow the steps in Get start with hub to configure a new Single View Page app to receive push notifications.

2. In your MainStoryboard_iPhone.storyboard add the following components from the object library:
	+ A label with "Breaking News" text,
	+ Labels with category texts "World", "Politics", "Business", "Technology", "Science", "Sports",
	+ Six switches, one per category,
	+ On button labeled "Subscribe"
	
	Your storyboard should look as follows:
	
   ![][3]
    
3. In the assistant editor, create outlets for all the switched and call them "WorldSwitch", "PoliticsSwitch", "BusinessSwitch", "TechnologySwitch", "ScienceSwitch", "SportsSwitch"

   ![][4]

4. Create an Action for your button called "subscribe". Your BreakingNewsViewController.h should contain the following:
			
			@property (weak, nonatomic) IBOutlet UISwitch *WorldSwitch;
			@property (weak, nonatomic) IBOutlet UISwitch *PoliticsSwitch;
			@property (weak, nonatomic) IBOutlet UISwitch *BusinessSwitch;
			@property (weak, nonatomic) IBOutlet UISwitch *TechnologySwitch;
			@property (weak, nonatomic) IBOutlet UISwitch *ScienceSwitch;
			@property (weak, nonatomic) IBOutlet UISwitch *SportsSwitch;

			- (IBAction)subscribe:(id)sender;

5. Create a new class called Notifications. Copy the following code in the interface section of the file Notifications.h:

			- (void)storeCategoriesAndSubscribeWithCategories:(NSArray*) categories completion: (void (^)(NSError* error))completion;
			- (void)subscribeWithCategories:(NSSet*) categories completion:(void (^)(NSError *))completion;

6. Add the following import directibe in Notifications.m:

			#import <WindowsAzureMessaging/WindowsAzureMessaging.h>

7. Copy the following code in the implementation section of the file Notifications.m:
		
			- (void)storeCategoriesAndSubscribeWithCategories:(NSSet *)categories completion:(void (^)(NSError *))completion {
			    NSUserDefaults* defaults = [NSUserDefaults standardUserDefaults];
			    [defaults setValue:[categories allObjects] forKey:@"BreakingNewsCategories"];
			    
			    [self subscribeWithCategories:categories completion:completion];
			}

			- (void)subscribeWithCategories:(NSSet *)categories completion:(void (^)(NSError *))completion{
			    SBNotificationHub* hub = [[SBNotificationHub alloc] initWithConnectionString:@"<connection string>" notificationHubPath:@"<hub name>"];
			    
			    [hub registerNativeWithDeviceToken:self.deviceToken tags:categories completion: completion];
			}

	Make sure to replace the placeholders with your notification hub name and your connection string with listen access. 
	This class uses the local storage to store the categories of news that this device has to receive. Also, it contains methods to register these categories.

8. Now we will create a singleton instance of the Notification class in our AppDelegate. In your BreakingNewsAppDelegate.h, add the following property:

			@property (nonatomic) Notifications* notifications;
	Then initialize it in your *didFinishLaunchingWithOptions* method in BreakingNewsAppDelegate.m, which should contain the following:
	
			self.notifications = [[Notifications alloc] init];
			
		    [[UIApplication sharedApplication] registerForRemoteNotificationTypes: UIRemoteNotificationTypeAlert | UIRemoteNotificationTypeBadge | UIRemoteNotificationTypeSound];
	The first line initialized the Notification singleton, while the second one starts the registration for push notifications (you should have added this line while following the Get Started with Notification Hub tutorial).
	Remember that the Notification class has a property that has to hold the device token for this device provided by APNs. In order to obtain this information, you have to implement the method *didRegisterForRemoteNotificationsWithDeviceToken* in your AppDelegate, and copy the following code:
	
			self.notifications.deviceToken = deviceToken;
	Note that at this time you should not have any other code in this method. If you followed the Get Started with Notification Hub tutorial you might have a call to the *registerNativeWithDeviceToken* method of a SBNotificationHub, remove that call.

	Finally, add the following method, which will handle the notification in case it is received when the app is running. This app will display a simple **UIAlert**, but you can decide otherwise.

			- (void)application:(UIApplication *)application didReceiveRemoteNotification:
				(NSDictionary *)userInfo {
			    NSLog(@"%@", userInfo);
			    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Notification" message:
			    [userInfo objectForKey:@"inAppMessage"] delegate:nil cancelButtonTitle: @"OK" otherButtonTitles:nil, nil];
			    [alert show];
		    }

9. In your BreakingNewsViewController.m, XCode has created the method *subscribe*, copy the following content in it:

			NSMutableArray* categories = [[NSMutableArray alloc] init];
		    
		    if (self.WorldSwitch.isOn) [categories addObject:@"World"];
		    if (self.PoliticsSwitch.isOn) [categories addObject:@"Politics"];
		    if (self.BusinessSwitch.isOn) [categories addObject:@"Business"];
		    if (self.TechnologySwitch.isOn) [categories addObject:@"Technology"];
		    if (self.ScienceSwitch.isOn) [categories addObject:@"Science"];
		    if (self.SportsSwitch.isOn) [categories addObject:@"Sports"];
		    
		    Notifications* notifications = [(BreakingNewsAppDelegate*)[[UIApplication sharedApplication]delegate] notifications];
		    
		    [notifications storeCategoriesAndSubscribeWithCategories:categories completion: ^(NSError* error) {
		        if (!error) {
		            UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Notification" message:
		                                  @"Subscribed!" delegate:nil cancelButtonTitle:
		                                  @"OK" otherButtonTitles:nil, nil];
		            [alert show];
		        } else {
		            NSLog(@"Error subscribing: %@", error);
		        }
		    }];
	This method creates an NSMutableArray of categories and uses the Notifications class to store the list in the local storage and register the corresponding tags with your Notification Hub.

	Note: In case the call to your Notification Hub fails, you might want to either retry or reset the switches and the local store to the previous state. In this tutorial we assume, for simplicity's sake, that the app will re-register with the Notification Hub next time it starts, correcting the misalignment.

Our app is now able to store a set of categories in the device local storage and to register with the notification hub whenever the user changes the selection of categories. Since it is not guaranteed that the user will regularly subscribe, we have to make sure that when the app starts, we register with notification hub the categories that have been stored in the local storage.

You can now run the app and verify that clicking the subscribe button will trigger a registration to your Notification Hub.

### Registering when your app starts

1. First we have to add the code to retrieve the categories in the Notifications class, add the following method in the interface section of the file Notifications.h:

		- (NSSet*)retrieveCategories;
	Then add the corresponding implementation in the file Notifications.m:
	
		- (NSSet*)retrieveCategories {
		    NSUserDefaults* defaults = [NSUserDefaults standardUserDefaults];
		    
		    NSArray* categories = [defaults stringArrayForKey:@"BreakingNewsCategories"];
		    
		    if (!categories) return [[NSSet alloc] init];
		    return [[NSSet alloc] initWithArray:categories];
		}

2. In order to make sure that your app updates its notification hub registration every time it starts, add the following code in the *didRegisterForRemoteNotificationsWithDeviceToken*:

		Notifications* notifications = [(BreakingNewsAppDelegate*)[[UIApplication sharedApplication]delegate] notifications];
    
	    NSSet* categories = [notifications retrieveCategories];
	    [notifications subscribeWithCategories:categories completion:^(NSError* error) {
	        if (error != nil) {
	            NSLog(@"Error registering for notifications: %@", error);
	        }
	    }];
	Now, every time the app starts, it will retrieve the categories and register for the categories saved in the local storage.

3. Finally, when starting, we want to update your switches with the categories previously saved. In your BreakingNewsViewController.h, add the following code in the *viewDidLoad* method:

		Notifications* notifications = [(BreakingNewsAppDelegate*)[[UIApplication sharedApplication]delegate] notifications];
    
	    NSSet* categories = [notifications retrieveCategories];
	    
	    if ([categories containsObject:@"World"]) self.WorldSwitch.on = true;
	    if ([categories containsObject:@"Politics"]) self.PoliticsSwitch.on = true;
	    if ([categories containsObject:@"Business"]) self.BusinessSwitch.on = true;
	    if ([categories containsObject:@"Technology"]) self.TechnologySwitch.on = true;
	    if ([categories containsObject:@"Science"]) self.ScienceSwitch.on = true;
	    if ([categories containsObject:@"Sports"]) self.SportsSwitch.on = true;

Our app is now completed.

-------------------------------------------- End of iOS subtopic ------------------------

## Sending breaking News from your back-end

This section will show how to broadcast the different categories of breaking news and easily reach all the devices that subscribed to them.

### .NET

For simplicity we assume you are building a Windows Console application, but clearly, these code snippets will work in any .NET back-end.

We used the following tags for our categories

1. Add a reference to the Windows Azure Service Bus SDK with the <a href="http://nuget.org/packages/WindowsAzure.ServiceBus/">WindowsAzure.ServiceBus NuGet package</a>. In Visual Studio Main Menu, select **TOOLS** -> **Library Package Manager** -> **Package Manager Console**. Then, in the console window type:

        Install-Package WindowsAzure.ServiceBus

    and press Enter.

2. Open the file Program.cs and add the following using statement:

        using Microsoft.ServiceBus.Notifications;

3. In your Program class add the following method:

        private static async void SendNotificationAsync()
        {
            NotificationHubClient hub = NotificationHubClient.CreateClientFromConnectionString("<connection string with full access>", "<hub name>");

            var toast = @"<toast><visual><binding template=""ToastText01""><text id=""1"">Breaking News!</text></binding></visual></toast>";
            await hub.SendWindowsNativeNotificationAsync(toast, "<category>");

			var alert = "{\"aps\":{\"alert\":\"Breaking News!\"}, \"inAppMessage\":\"Breaking News!\"}";
            await hub.SendAppleNativeNotificationAsync(toast, "<category>");
        }

	Make sure to replace the placeholders with you hub name and connection string with full access. Replace the category placeholder with any one of the category tags that we used in our client apps ("World", "Politics", "Business", "Technology", "Science", "Sports").

4. Then add the following line in your Main method:

         SendNotificationAsync();
		 Console.ReadLine();

### Mobile Services

We assume you already have your [Mobile Service].

1. Insert the following script inside your scheduler function. Make sure to replace the placeholders with your notification hub name and the connection string for *DefaultFullSharedAccessSignature* that you obtained earlier. Replace the category placeholder with any one of the category tags that we used in our client apps ("World", "Politics", "Business", "Technology", "Science", "Sports"). Click **Save**.

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

## Next Steps
In this tutorial we learned how to broadcast breaking news by category. If you want to learn how to send private notifications to single users please follow [Use Notification Hubs to send notifications to users]. Also, if you want to learn how to expand the breaking news app by sending localized notifications follow [Use Notification Hubs to broadcast localized Breaking News].

<!-- Images. -->
[1]: ../media/notification-hub-breakingnews-win1.png
[2]: ../media/notification-hub-breakingnews-ios1.png

[3]: ../media/notification-hub-breakingnews-ios2.png
[4]: ../media/notification-hub-breakingnews-ios3.png
[5]: ../media/notification-hub-breakingnews-ios4.png
