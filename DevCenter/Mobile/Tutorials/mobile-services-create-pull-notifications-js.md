<properties linkid="mobile-services-create-pull-notifications-dotnet" writer="glenga" urlDisplayName="Define a custom API that supports pull notifications" pageTitle="Define a custom API that supports pull notifications - Windows Azure Mobile Services" metaKeywords="" metaDescription="Learn how to Define a custom API that supports periodic notifications in Windows Store apps that use Windows Azure Mobile Services." metaCanonical="" disqusComments="1" umbracoNaviHide="1" />

<div chunk="../chunks/article-left-menu-windows-store.md" />

# Define a custom API that supports pull notifications

<div class="dev-center-tutorial-selector"> 
	<a href="/en-us/develop/mobile/tutorials/create-pull-notifications-dotnet" title="Windows Store C#" class="current">Windows Store C#</a>
    <a href="/en-us/develop/mobile/tutorials/create-pull-notifications-js" title="Windows Store JavaScript">Windows Store JavaScript</a>
</div>

This topic shows you how to use a custom API to support periodic notifications in a Windows Store app. With period notifications enabled, Windows will periodically access your custom API endpoint and use the returned XML, in a tile-specific format, to update the app tile on start menu. You will add this functionality to the app that you created when you completed either the [Get started with Mobile Services] or the [Get started with data] tutorial. 

This tutorial walks you through these steps to update push notifications in your app:

1. [Define the custom API]
2. [Update the app to turn on period notifications]
3. [Test the app] 

This tutorial is based on the Mobile Services quickstart. Before you start this tutorial, you must first complete [Get started with Mobile Services] or the [Get started with data].  

## <a name="define-custom-api"></a>Define the custom API

1. Log into the [Windows Azure Management Portal], click **Mobile Services**, and then click your app.

   ![][0]

2. Click the **API** tab, and then click **Create a custom API**.

   ![][1]

   This displays the **Create a new custom API** dialog.

3. Keeping the default **Anybody with the application key** setting for all permissions, type _tiles_ in **API name**, and then click the check button.

   ![][2]

  This creates the new API.

4. Click the new tiles entry in the API table.

	![][3]

5. Click the **Scripts** tab and replace the existing code with the following:

		exports.get = function(request, response) {
		    var wns = require('wns');
		    var xml = wns.createTileSquareBlock("Hi", "from Azure");
		    response.set('content-type', 'application/xml');
		    response.send(200, xml);
		};

   	<div class="dev-callout"><b>Note</b>
   		<p>This custom API uses the Node.js <a href="">wns module</a>, which is referenced by using the <strong>require</strong> function. This module is different from the <a href="http://go.microsoft.com/fwlink/p/?LinkId=260591">wns object</a> returned by the <a href="http://msdn.microsoft.com/en-us/library/windowsazure/jj554217.aspx">push object</a>, which is used to send push notifications from server scripts.</p>
   	</div>

Next, you will modify the push notifications app to store data in this new table instead of in the **TodoItem** table.

<h2><a name="update-app"></a><span class="short-header">Update the app </span>Update the app to turn on period notifications</h2>

1. In Visual Studio 2012 Express for Windows 8, open the project from the tutorial [Get started with push notifications], open up file MainPage.xaml.cs, and remove the **Channel** property from the **TodoItem** class. It should now look like this:

        public class TodoItem
        {
        	public int Id { get; set; }

	       	[JsonProperty(PropertyName = "text")]
	        public string Text { get; set; }
	
	        [JsonProperty(PropertyName = "complete")]
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
	
	        [JsonProperty(PropertyName = "uri")]
	        public string Uri { get; set; }
	    }

4. Open the file App.xaml.cs and replace **AcquirePushChannel** method with the following code:

	    private async void AcquirePushChannel()
	    {
	       CurrentChannel = 
               await PushNotificationChannelManager.CreatePushNotificationChannelForApplicationAsync();
	
	       IMobileServiceTable<Channel> channelTable = App.MobileService.GetTable<Channel>();
	       var channel = new Channel { Uri = CurrentChannel.Uri };
	       await channelTable.InsertAsync(channel);
        }

     This code inserts the current channel into the Channel table.

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
                    	    push.wns.sendToastText04(channel.uri, {
                        	    text1: item.text
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

1. In Visual Studio, press the F5 key to run the app.

2. In the app, type text in **Insert a TodoItem**, and then click **Save**.

   ![][6]

   Note that after the insert completes, the app still receives a push notification from WNS.

   ![][7]

9. (Optional) Run the app on two machines at the same time, and repeat the previous step. 

    The notification is sent to all running app instances.

## Next steps

This concludes the tutorials that demonstrate the basics of working with push notifications. Consider finding out more about the following Mobile Services topics:

* [Get started with push notifications]


* [Mobile Services server script reference]
  <br/>Learn more about registering and using server scripts.

<!-- Anchors. -->
[Define the custom API]: #define-custom-api
[Update the app to turn on period notifications]: #update-app
[Test the app]: #test-app
[Next Steps]: #next-steps

<!-- Images. -->
[0]: ../Media/mobile-services-selection.png
[1]: ../Media/mobile-custom-api-create.png
[2]: ../Media/mobile-custom-api-create-dialog.png
[3]: ../Media/mobile-custom-api-select.png
[4]: ../Media/mobile-insert-script-channel.png
[5]: ../Media/mobile-insert-script-push2.png
[6]: ../Media/mobile-quickstart-push1.png
[7]: ../Media/mobile-quickstart-push2.png

<!-- URLs. -->
[Windows Push Notifications & Live Connect]: http://go.microsoft.com/fwlink/?LinkID=257677
[Mobile Services server script reference]: http://go.microsoft.com/fwlink/?LinkId=262293
[My Apps dashboard]: http://go.microsoft.com/fwlink/?LinkId=262039
[Get started with Mobile Services]: ./get-started/#create-new-service
[Get started with data]: ../tutorials/mobile-services-get-started-with-data-dotnet.md
[Get started with authentication]: ../tutorials/mobile-services-get-started-with-users-dotnet.md
[Get started with push notifications]: ../tutorials/mobile-services-get-started-with-push-dotnet.md
[JavaScript and HTML]: mobile-services-win8-javascript/
[WindowsAzure.com]: http://www.windowsazure.com/
[Windows Azure Management Portal]: https://manage.windowsazure.com/