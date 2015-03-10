

In your back-end app, you now have to switch to sending template notifications instead of native payloads. This will simplify the back-end code as you will not have to send multiple payloads for the different platforms.

When you send template notifications you only need to provide a set of properties, in our case we will send the set of properties containing the localized version of the current news, for instance:

	{
		"News_English": "World News in English!",
    	"News_French": "World News in French!",
    	"News_Mandarin": "World News in Mandarin!"
	}


This section shows how to send notifications in two different ways:

- using a console app
- using a Mobile Services script

The included code broadcasts to both Windows Store and iOS devices, since the backend can broadcast to any of the supported devices.



## To send notifications using a C# console app ##

We will simply modify your *SendNotificationAsync* method by sending a single template notification.

	var hub = NotificationHubClient.CreateClientFromConnectionString("<connection string>", "<hub name>");
    var notification = new Dictionary<string, string>() {
							{"News_English", "World News in English!"},
                            {"News_French", "World News in French!"},
                            {"News_Mandarin", "World News in Mandarin!"}};
    await hub.SendTemplateNotificationAsync(notification, "World");

Note that this simple call will deliver the correct localized piece of news to **all** your devices, irrespective of the platform, as your Notification Hub builds and delivers the correct native payload to all the devices subscribed to a specific tag.

### Mobile Services

In your Mobile Service scheduler, overwrite your script with:

	var azure = require('azure');
    var notificationHubService = azure.createNotificationHubService('<hub name>', '<connection string with full access>');
    var notification = {
			"News_English": "World News in English!",
			"News_French": "World News in French!",
			"News_Mandarin", "World News in Mandarin!"
	}
	notificationHubService.send('World', notification, function(error) {
		if (!error) {
			console.warn("Notification successful");
		}
	});
	
Note how in this case there is no need to send multiple notifications for different locales and platforms.
