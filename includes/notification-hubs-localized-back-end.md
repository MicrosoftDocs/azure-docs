



When you send template notifications you only need to provide a set of properties, in our case we will send the set of properties containing the localized version of the current news, for instance:

	{
		"News_English": "World News in English!",
    	"News_French": "World News in French!",
    	"News_Mandarin": "World News in Mandarin!"
	}


This section shows how to send notifications using a console app

The included code broadcasts to both Windows Store and iOS devices, since the backend can broadcast to any of the supported devices.


### To send notifications using a C# console app 

Modify the `SendTemplateNotificationAsync` method in the console app you previously created with the following code. Notice how in this case there is no need to send multiple notifications for different locales and platforms.

        private static async void SendTemplateNotificationAsync()
        {
            // Define the notification hub.
            NotificationHubClient hub = 
				NotificationHubClient.CreateClientFromConnectionString(
					"<connection string with full access>", "<hub name>");

            // Sending the notification as a template notification. All template registrations that contain 
			// "messageParam" or "News_<local selected>" and the proper tags will receive the notifications. 
			// This includes APNS, GCM, WNS, and MPNS template registrations.
            Dictionary<string, string> templateParams = new Dictionary<string, string>();

            // Create an array of breaking news categories.
            var categories = new string[] { "World", "Politics", "Business", "Technology", "Science", "Sports"};
            var locales = new string[] { "English", "French", "Mandarin" };

            foreach (var category in categories)
            {
                templateParams["messageParam"] = "Breaking " + category + " News!";

                // Sending localized News for each tag too...
                foreach( var locale in locales)
                {
                    string key = "News_" + locale;

					// Your real localized news content would go here.
                    templateParams[key] = "Breaking " + category + " News in " + locale + "!";
                }

                await hub.SendTemplateNotificationAsync(templateParams, category);
            }
        }


Note that this simple call will deliver the localized piece of news to **all** your devices, irrespective of the platform, as your Notification Hub builds and delivers the correct native payload to all the devices subscribed to a specific tag.

### Sending the notification with Mobile Services

In your Mobile Service scheduler, you can use the following script:

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
	

