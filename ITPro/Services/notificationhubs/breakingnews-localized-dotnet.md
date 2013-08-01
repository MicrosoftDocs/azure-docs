<properties linkid="develop-notificationhubs-tutorials-send-localized-breaking-news-windowsdotnet" writer="ricksal" urlDisplayName="Localized Breaking News" pageTitle="Notification Hubs Localized Breaking News Tutorial" metaKeywords="" metaDescription="Learn how to use Windows Azure Service Bus Notification Hubs to send localized breaking news notifications." metaCanonical="" disqusComments="1" umbracoNaviHide="1" />

<div chunk="../chunks/article-left-menu-windows-store.md" />

# Use Notification Hubs to send localized breaking news

<div class="dev-center-tutorial-selector sublanding"> 
    	<a href="/en-us/manage/services/notification-hubs/breaking-news-localized-dotnet" title="Windows Store C#" class="current">Windows Store C#</a>
		<a href="/en-us/manage/services/notification-hubs/breaking-news-localized-ios" title="iOS">iOS</a>
</div>

This topic shows you how to use the **template** feature of Windows Azure Notification Hubs to broadcast breaking news notifications that have been localized by language and device. In this tutorial you start with the Windows Store app created in [Use Notification Hubs to send breaking news]. When complete, you will be able to register for categories you are interested in, specify a language in which to receive the notifications, and receive only push notifications for the selected categories in that language.

This tutorial walks you through these basic steps to enable this scenario:

1. [Template concepts] 
2. [The app user interface]
3. [Building the Windows Store client app]
4. [Send notifications from your back-end]


There are two parts to this scenario:

- the Windows Store app allows client devices to specify a language, and to subscribe to different breaking news categories; 

- the back-end broadcasts the notifications, using the **tag** and **template** feautres of Windows Azure Notification Hubs.



##Prerequisites ##

You must have already completed the [Use Notification Hubs to send breaking news] tutorial and have the code available, because this tutorial builds directly upon that code. 

You also need Visual Studio 2012.


<h2><a name="concepts"></a><span class="short-header">concepts</span>Template concepts</h2>

In [Use Notification Hubs to send breaking news] you built an app that used **tags** to subscribe to notifications for different news categories.
Many apps, however, target multiple markets and require localization. This means that the content of the notifications themselves have to be localized and delivered to the correct set of devices.
In this topic we will show how to use the **template** feature of Notification Hubs to easily deliver localized breaking news notifications.

Note: one way to send localized notifications is to create multiple versions of each tag. For instance, to support English, French, and Mandarin, we would need three different tags for world news: "world_en", "world_fr", and "world_ch". We would then have to send a localized version of the world news to each of these tags. In this topic we use templates to avoid the proliferation of tags and the requirement of sending multiple messages.

At a high level, templates are a way to specify how a specific device should receive a notification. The template specifies the exact payload format by referring to properties that are part of the message sent by your app back-end. In our case, we will send a locale-agnostic message containing all supported languages:

		{
			"News_English": "...",
			"News_French": "...",
			"News_Mandarin": "..."
		}

Then we will ensure that devices register with a template that refers to the correct property. For instance, a Windows Store app that wants to receive a simple toast message will register for the following template:

		<toast>
		  <visual>
		    <binding template=\"ToastText01\">
		      <text id=\"1\">$(News_English)</text>
		    </binding>
		  </visual>
		</toast>



Templates are a very powerful feature you can learn more about in our [Notification Hubs Guidance] article. A reference for the template expression language is in our [Notification Hubs How-To for Windows Store].


<h2><a name="ui"></a><span class="short-header">App ui</span>The app user interface</h2>

We will now modify the Breaking News app that you created in the topic [Use Notification Hubs to send breaking news] to send localized breaking news using templates.


In order to adapt your client apps to receive localized messages, you have to replace your *native* registrations (i.e. registrations that do you specify a template) with template registrations.


In your Windows Store app:

Change your MainPage.xaml to include a locale combobox:

		<Grid Margin="120, 58, 120, 80"  
				Background="{StaticResource ApplicationPageBackgroundThemeBrush}">
            <Grid.RowDefinitions>
                <RowDefinition />
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
            <ComboBox Name="Locale" HorizontalAlignment="Left" VerticalAlignment="Center" Width="200" Grid.Row="1" Grid.Column="0">
                <x:String>English</x:String>
                <x:String>French</x:String>
                <x:String>Mandarin</x:String>
            </ComboBox>
            <ToggleSwitch Header="World" Name="WorldToggle" Grid.Row="2" Grid.Column="0"/>
            <ToggleSwitch Header="Politics" Name="PoliticsToggle" Grid.Row="3" Grid.Column="0"/>
            <ToggleSwitch Header="Business" Name="BusinessToggle" Grid.Row="4" Grid.Column="0"/>
            <ToggleSwitch Header="Technology" Name="TechnologyToggle" Grid.Row="2" Grid.Column="1"/>
            <ToggleSwitch Header="Science" Name="ScienceToggle" Grid.Row="3" Grid.Column="1"/>
            <ToggleSwitch Header="Sports" Name="SportsToggle" Grid.Row="4" Grid.Column="1"/>
            <Button Content="Subscribe" HorizontalAlignment="Center" Grid.Row="5" Grid.Column="0" Grid.ColumnSpan="2" Click="Button_Click" />
        </Grid>

<h2><a name="building-client"></a><span class="building app">App ui</span>Building the Windows Store client app</h2>

1. In your Notifications class, add a locale parameter to your  *StoreCategoriesAndSubscribe* and *SubscribeToCateories* methods.

		public async Task StoreCategoriesAndSubscribe(string locale, IEnumerable<string> categories)
        {
            ApplicationData.Current.LocalSettings.Values["categories"] = string.Join(",", categories);
            ApplicationData.Current.LocalSettings.Values["locale"] = locale;
            await SubscribeToCategories(locale, categories);
        }

        public async Task SubscribeToCategories(string locale, IEnumerable<string> categories)
        {
            var channel = await PushNotificationChannelManager.CreatePushNotificationChannelForApplicationAsync();
            var template = String.Format(@"<toast><visual><binding template=""ToastText01""><text id=""1"">$(News_{0})</text></binding></visual></toast>", locale);

            await hub.RegisterTemplateAsync(channel.Uri, template, "newsTemplate", categories);
        }

	Note that instead of calling the *RegisterNativeAsync* method we call *RegisterTemplateAsync*: we are registering a specific notification format in which the template depends on the locale. We also provide a name for the template ("newsTemplate"), because we might want to register more than one template (for instance one for toast notifications and one for tiles) and we need to name them in order to be able to update or delete them.

	Note that if a device registers multiple templates with the same tag, an incoming message targeting that tag will result in multiple notifications delivered to the device (one for each template). This behavior is useful when the same logical message has to result in multiple visual notifications, for instance showing both a badge and a toast in a Windows Store application.

2. Add the following method to retrieve the stored locale:

		public string RetrieveLocale()
        {
            var locale = (string) ApplicationData.Current.LocalSettings.Values["locale"];
            return locale != null ? locale : "English";
        }

3. In your MainPage.xaml.cs, update your button click handler by retrieving the current value of the Locale combobox and providing it to the call to the Notifications class, as shown:

		 var locale = (string)Locale.SelectedItem;
            
         var categories = new HashSet<string>();
         if (WorldToggle.IsOn) categories.Add("World");
         if (PoliticsToggle.IsOn) categories.Add("Politics");
         if (BusinessToggle.IsOn) categories.Add("Business");
         if (TechnologyToggle.IsOn) categories.Add("Technology");
         if (ScienceToggle.IsOn) categories.Add("Science");
         if (SportsToggle.IsOn) categories.Add("Sports");

         await ((App)Application.Current).Notifications.StoreCategoriesAndSubscribe(locale, categories);

         var dialog = new MessageDialog(String .Format("Locale: {0}; Subscribed to: {1}", locale, string.Join(",", categories)));
         dialog.Commands.Add(new UICommand("OK"));
         await dialog.ShowAsync();

4. Finally, in your App.xaml.cs file, make sure to update your call to the Notifications singleton in the *OnLaunched* method:

		Notifications.SubscribeToCategories(Notifications.RetrieveLocale(), Notifications.RetrieveCategories());


<div chunk="../chunks/notification-hubs-localized-back-end.md" />





## Next Steps

For more information on using templates, see [Notify users with Notification Hubs: ASP.NET], [Notify users with Notification Hubs: Mobile Services] and also see [Notification Hubs Guidance]. A reference for the template expression language is [Notification Hubs How-To for iOS].

<!-- Anchors. -->
[Template concepts]: #concepts
[The app user interface]: #ui
[Building the Windows Store client app]: #building-client
[Send notifications from your back-end]: #send
[Next Steps]:#next-steps

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

<!-- URLs. -->
[Get started with Notification Hubs]: mobile-services-get-started-with-notification-hub-dotnet.md
[Mobile Service]: ../../../DevCenter/Mobile/Tutorials/mobile-services-get-started.md
[Notify users with Notification Hubs: ASP.NET]: tutorial-notify-users-aspnet.md
[Notify users with Notification Hubs: Mobile Services]: tutorial-notify-users-mobileservices.md
[Use Notification Hubs to send breaking news]: breaking-news-dotnet.md 

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
[Notification Hubs How-To for iOS]: http://msdn.microsoft.com/en-us/library/jj927168.aspx
