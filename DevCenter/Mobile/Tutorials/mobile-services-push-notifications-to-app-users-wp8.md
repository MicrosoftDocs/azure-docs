<properties linkid="develop-net-tutorials-push-notifications-to-users-wp8" urlDisplayName="Push Notifications to Users (WP8)" pageTitle="Push notifications to users (Windows Phone) - Mobile Services" metaKeywords="" metaDescription="Learn how to push notifications to your Windows Store app users by using Windows Azure Mobile Services." metaCanonical="" disqusComments="1" umbracoNaviHide="1" />

<div chunk="../chunks/article-left-menu-wp8.md" />

# Push notifications to users by using Mobile Services
<div class="dev-center-tutorial-selector"> 
	<a href="/en-us/develop/mobile/tutorials/push-notifications-to-users-dotnet" title="Windows Store C#">Windows Store C#</a><a href="/en-us/develop/mobile/tutorials/push-notifications-to-users-js" title="Windows Store JavaScript">Windows Store JavaScript</a><a href="/en-us/develop/mobile/tutorials/push-notifications-to-users-wp8" title="Windows Phone 8" class="current">Windows Phone 8</a><a href="/en-us/develop/mobile/tutorials/push-notifications-to-users-ios" title="iOS">iOS</a>
</div>


This topic extends the [previous push notification tutorial][Get started with push notifications] by adding a new table to store Microsoft Push Notification Service (MPNS) channel URIs. These channels can then be used to send push notifications to users of the Windows Phone 8 app.  

This tutorial walks you through these steps to update push notifications in your app:

1. [Create the Channel table]
2. [Update the app]
3. [Update server scripts]
4. [Verify the push notification behavior] 

This tutorial is based on the Mobile Services quickstart and builds on the previous tutorial [Get started with push notifications]. Before you start this tutorial, you must first complete [Get started with push notifications].  

## <a name="create-table"></a>Create a new table

1. Log into the [Windows Azure Management Portal], click **Mobile Services**, and then click your app.

   ![][0]

2. Click the **Data** tab, and then click **Create**.

   ![][1]

   This displays the **Create new table** dialog.

3. Keeping the default **Anybody with the application key** setting for all permissions, type _Channel_ in **Table name**, and then click the check button.

   ![][2]

  This creates the **Channel** table, which stores the channel URIs used to send push notifications separate from item data.

Next, you will modify the push notifications app to store data in this new table instead of in the **TodoItem** table.

## <a name="update-app"></a>Update your app

1. In Visual Studio 2012 Express for Windows Phone, open the project from the tutorial [Get started with push notifications], open up file MainPage.xaml.cs, and remove the **Channel** property from the **TodoItem** class. It should now look like this:

        public class TodoItem
        {
        	public int Id { get; set; }

        	[DataMember(Name = "text")]
	        public string Text { get; set; }
	
	        [DataMember(Name = "complete")]
	        public bool Complete { get; set; }
        }

2. Replace the **ButtonSave_Click** event handler method with the original version of this method, as follows:

        private void ButtonSave_Click(object sender, RoutedEventArgs e)
        {
            var todoItem = new TodoItem { Text = TextInput.Text };
            InsertTodoItem(todoItem);
        }

3. Add the following code that creates a new **Channel** class:

	    public class Channel
	    {
	        public int Id { get; set; }
	
	        [DataMember(Name = "uri")]
	        public string Uri { get; set; }
	    }

4. Open the file App.xaml.cs and replace **AcquirePushChannel** method with the following code:

        private void AcquirePushChannel()
        {
            CurrentChannel = HttpNotificationChannel.Find("MyPushChannel");

            if (CurrentChannel == null)
            {
                CurrentChannel = new HttpNotificationChannel("MyPushChannel");
                CurrentChannel.Open();
                CurrentChannel.BindToShellTile();
            }
                  
           IMobileServiceTable<Channel> channelTable = App.MobileService.GetTable<Channel>();
           var channel = new Channel { Uri = CurrentChannel.ChannelUri.ToString() };
           channelTable.InsertAsync(channel);
        }

     This code inserts a channel into the Channel table.

## <a name="update-scripts"></a>Update server scripts

1. In the Management Portal, click the **Data** tab and then click the **Channel** table. 

   ![][3]

2. In **channel**, click the **Script** tab and select **Insert**.
   
   ![][4]

   This displays the function that is invoked when an insert occurs in the **Channel** table.

3. Replace the insert function with the following code, and then click **Save**:

			function insert(item, user, request) {
				var channelTable = tables.getTable('Channel');
				channelTable
					.where({ uri: item.uri })
					.read({ success: insertChannelIfNotFound });
		        function insertChannelIfNotFound(existingChannels) {
	        	    if (existingChannels.length > 0) {
	            	    request.respond(200, existingChannels[0]);
	        	    } else {
	            	    request.execute();
	        	    }
	    	    }
		    }

   This script checks the **Channel** table for an existing channel with the same URI. The insert only proceeds if no matching channel was found. This prevents duplicate channel records.

4. Click **TodoItem**, click **Script** and select **Insert**. 

   ![][5]

5. Replace the insert function with the following code, and then click **Save**:

	    function insert(item, user, request) {
    	    request.execute({
        	    success: function() {
            	    request.respond();
            	    sendNotifications();
        	    }
    	    });

	        function sendNotifications() {
        	    var channelTable = tables.getTable('Channel');
        	    channelTable.read({
            	    success: function(channels) {
                	    channels.forEach(function(channel) {
                    	    push.mpns.sendFlipTile(channel.uri, {
                        	    title: item.text
                    	    }, {
                        	    success: function(pushResponse) {
                            	    console.log("Sent push:", pushResponse);
                        	    }
                    	    });
                	    });
            	    }
        	    });
    	    }
	    }

    This insert script sends a push notification (with the text of the inserted item) to all channels stored in the **Channel** table.

## <a name="test-app"></a>Test the app

1. In Visual Studio, select **Deploy Solution** on the **Build**  menu.

3. Tap the tile named either **TodoList** or **hello push** to launch the app. 

  ![][23]

5. In the app, enter the text "hello push again" in the textbox, and then click **Save**.

   ![][24]

  This sends an insert request to the mobile service to store the added item.

6. Press the **Start** button to return to the start menu. 

  ![][25]

  Notice that the application received the push notification and that the title of the tile is now **hello push**.

9. (Optional) Run the app on two devices at the same time, and repeat the previous step. 

    The notification is sent to all running app instances.  

## Next steps

This concludes the tutorials that demonstrate the basics of working with push notifications. Consider finding out more about the following Mobile Services topics:

* [Get started with data]
  <br/>Learn more about storing and querying data using Mobile Services.

* [Get started with authentication]
  <br/>Learn how to authenticate users of your app with Windows Account.

* [Mobile Services server script reference]
  <br/>Learn more about registering and using server scripts.

<!-- anchors -->
[Create the Channel table]: #create-table
[Update the app]: #update-app
[Update server scripts]: #update-scripts
[Verify the push notification behavior]: #test-app
[Next Steps]: #next-steps

<!-- Images. -->
[0]: ../Media/mobile-services-selection.png
[1]: ../Media/mobile-create-table.png
[2]: ../Media/mobile-create-channel-table.png
[3]: ../Media/mobile-portal-data-tables-channel.png
[4]: ../Media/mobile-insert-script-channel.png
[5]: ../Media/mobile-insert-script-push2.png
[6]: ../Media/mobile-quickstart-push1.png
[7]: ../Media/mobile-quickstart-push2.png
[23]: ../Media/mobile-quickstart-push4-wp8.png
[24]: ../Media/mobile-quickstart-push5-wp8.png
[25]: ../Media/mobile-quickstart-push6-wp8.png

<!-- URLs. -->
[Mobile Services server script reference]: http://go.microsoft.com/fwlink/p/?LinkId=262293
[Get started with Mobile Services]: ../tutorials/mobile-services-get-started-wp8.md
[Get started with data]: ../tutorials/mobile-services-get-started-with-data-wp8.md
[Get started with authentication]: ../tutorials/mobile-services-get-started-with-users-wp8.md
[Get started with push notifications]: ../tutorials/mobile-services-get-started-with-push-wp8.md
[WindowsAzure.com]: http://www.windowsazure.com/
[Windows Azure Management Portal]: https://manage.windowsazure.com/