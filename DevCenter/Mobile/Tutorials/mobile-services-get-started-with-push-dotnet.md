<properties linkid="mobile-get-started-with-push-dotnet" urldisplayname="Mobile Services" headerexpose="" pagetitle="Get started with push notifications for Mobile Services in Windows Azure" metakeywords="Get started Windows Azure Mobile Services, mobile devices, Windows Push Notifications, Windows Azure, mobile, Windows 8, WinRT app" footerexpose="" metadescription="Get started using Windows Azure Mobile Services in your Windows Store apps." umbraconavihide="0" disquscomments="1"></properties>

<div class="umbMacroHolder" title="This is rendered content from macro" onresizestart="return false;" umbpageid="14799" ismacro="true" umb_chunkname="MobileArticleLeft" umb_chunkpath="devcenter/Menu" umb_macroalias="AzureChunkDisplayer" umb_hide="0" umb_modaltrigger="" umb_chunkurl="" umb_modalpopup="0"><!-- startUmbMacro --><span><strong>Azure Chunk Displayer</strong><br />No macro content available for WYSIWYG editing</span><!-- endUmbMacro --></div>

# Get started with push notifications in Mobile Services
Language: **C# and XAML**  

This topic shows you how to use Windows Azure Mobile Services to send push notifications to a Windows Store app.  
In this tutorial you add push notifications using the Windows Push Notification service (WNS) to the quickstart project. When complete, your mobile service will send a push notification each time a record is inserted.

   <div class="dev-callout"><b>Note</b>
   <p>This tutorial demonstrates a simplified way of sending push notifications by attaching a push notification channel to the inserted record. Be sure to follow along with the next tutorial to get a better idea of how to incorporate push notifications into your real-world apps.</p>
   </div>

This tutorial walks you through these basic steps to enable push notifications:

1. [Register your app for push notifications and configure Mobile Services]
2. [Add push notifications to the app]
3. [Update scripts to send push notifications]
4. [Insert data to receive notifications]

This tutorial is based on the Mobile Services quickstart. Before you start this tutorial, you must first complete [Get started with Mobile Services].

## <a name="register"></a>Register your app for push notifications and configure Mobile Services

To be able to send push notifications to Windows Store apps from Mobile Services, you must register your Windows Store app at the Live Connect Developer Center. You must then configure your mobile service to integrate with WNS.

1. In Visual Studio 2012 Express for Windows 8, open the project that you created when you completed the tutorial [Get started with Mobile Services]. 

2. Navigate to the [Windows Push Notifications & Live Connect] page, login with your Microsoft account if needed, and then follow the instructions to register your app. Note that these instructions include updating the package name for the project you opened in the previous step.

3. Once you have registered your app, navigate to the [My Apps dashboard] in Live Connect Developer Center, click on your app in the **My applications** list.

   ![][0] 

4. Under **API Settings** make a note of the values of **Client secret** and **Package security identifier (SID)**.

   ![][1]

   You must provide these values to Mobile Services to be able to use WNS. 

    <div class="dev-callout"><b>Security Note</b>
	<p>The client secret and package SID are important security credentials. Do not share these secrets with anyone or distribute them with your app.</p>
    </div>

5. Log into the [Windows Azure Management Portal], click **Mobile Services**, and then click your app.

   ![][2]

6. Click the **Push** tab, enter the **Client secret** and **Package SID** values obtained from WNS, and click **Save**.

   ![][3]

## <a name="add-push"></a>Add push notifications to the app

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

         [DataMember(Name = "channel")]
         public string Channel { get; set; }

    <div class="dev-callout"><b>Note</b>
	<p>When dynamic schema is enabled on your mobile service, a new 'channel' column is automatically added to the <b>TodoItem</b> table when a new item that contains this property is inserted.</p>
    </div>

5. Replace the **ButtonSave_Click** event handler method with the following code:

	        private void ButtonSave_Click(object sender, RoutedEventArgs e)
	        {
	            var todoItem = new TodoItem { Text = TextInput.Text, Channel = App.CurrentChannel.Uri };
	            InsertTodoItem(todoItem);
            }

   This sets the client's current channel value on the item before it is sent to the mobile service.

## <a name="update-scripts"></a>Update the insert script to send push notifications

1. In the Management Portal, click the **Data** tab and then click the **TodoItem** table. 

   ![][4]

2. In **todoitem**, click the **Script** tab and select **Insert**.
   
  ![][5]

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

   This registers a new insert script, which sends a push notification (the inserted text) to the channel provided in the insert request.

## <a name="test"></a>Insert data to receive notifications

1. In Visual Studio, press the F5 key to run the app.

2. In the app, type text in **Insert a TodoItem**, and then click **Save**.

    ![][6]

   Note that after the insert completes, the app receives a push notification from WNS.

   ![][7]

## <a name="next-steps"> </a>Next Steps

In this simple example a user receives a push notification with the data that was just inserted. The channel used by WNS is supplied to the mobile service by the client in the request. In the next tutorial, [Push notifications to app users], you will create a separate Channel table in which to store channel URIs and send a push notification out to all stored channels when an insert occurs. 

<!-- Anchors. -->
[Register your app for push notifications and configure Mobile Services]: #register
[Update scripts to send push notifications]: #update-scripts
[Add push notifications to the app]: #add-push
[Insert data to receive notifications]: #test
[Next Steps]:#next-steps

<!-- Images. -->
[0]: ../Media/mobile-live-connect-apps-list.png
[1]: ../Media/mobile-live-connect-app-details.png
[2]: ../Media/mobile-services-selection.png
[3]: ../Media/mobile-push-tab.png
[4]: ../Media/mobile-portal-data-tables.png
[5]: ../Media/mobile-insert-script-push.png
[6]: ../Media/mobile-quickstart-push1.png
[7]: ../Media/mobile-quickstart-push2.png

<!-- URLs. -->
[Windows Push Notifications & Live Connect]: http://go.microsoft.com/fwlink/?LinkID=257677
[My Apps dashboard]: http://go.microsoft.com/fwlink/?LinkId=262039
[Live SDK for Windows]: http://go.microsoft.com/fwlink/?LinkId=262253
[Get started with Mobile Services]: /en-us/develop/mobile/tutorials/get-started/#create-new-service
[Get started with data]: ./mobile-services-get-started-with-data-dotnet.md
[Get started with users]: ./mobile-services-get-started-with-users-dotnet.md
[Get started with push notifications]: ./mobile-services-get-started-with-push-dotnet.md
[Push notifications to app users]: ./mobile-services-push-notifications-to-app-users-dotnet.md
[Authorize users with scripts]: ./mobile-services-authorize-users-dotnet.md
[JavaScript and HTML]: mobile-services-win8-javascript/
[WindowsAzure.com]: http://www.windowsazure.com/
[Windows Azure Management Portal]: https://manage.windowsazure.com/