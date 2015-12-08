<!---Use the procedure that matches your backend project type&mdash;either [.NET backend](#dotnet) or [Node.js backend](#nodejs).

### <a name="dotnet"></a>.NET backend project -->
1. In Visual Studio, update the `PostTodoItem` method definition with the following code:  

	    public async Task<IHttpActionResult> PostTodoItem(TodoItem item)
	    {
	        TodoItem current = await InsertAsync(item);
	
	        // Get the settings for the server project.
	        HttpConfiguration config = this.Configuration;
	        MobileAppSettingsDictionary settings =
	            this.Configuration.GetMobileAppSettingsProvider().GetMobileAppSettings();
	
	        // Get the Notification Hubs credentials for the Mobile App.
	        string notificationHubName = settings.NotificationHubName;
	        string notificationHubConnection = settings
	            .Connections[MobileAppSettingsKeys.NotificationHubConnectionString].ConnectionString;
	
	        // Create the notification hub client.
	        NotificationHubClient hub = NotificationHubClient
	            .CreateClientFromConnectionString(notificationHubConnection, notificationHubName);
	
	        // Get the current user SID and create a tag for the current user.
	        var claimsPrincipal = this.User as ClaimsPrincipal;
	        string sid = claimsPrincipal.FindFirst(ClaimTypes.NameIdentifier).Value;
	        string userTag = "_UserId:" + sid;
	
	        // Define push message text.
	        var messageText = string.Format("New item added: {0}", item.Text);
	
	        // Build a dictionary for the template.
	        var notification = new Dictionary<string, string> { { "message", messageText } };
	
	        try
	        {
	            // Send a template notification to the user ID.
	            await hub.SendTemplateNotificationAsync(notification, userTag);
	        }
	        catch (System.Exception)
	        {
	            throw new HttpResponseException(System.Net.HttpStatusCode.InternalServerError);
	        }
	        return CreatedAtRoute("Tables", new { id = current.Id }, current);
	    }

	This code sends a template notification only to registrations tagged with the current user's SID. Note that the SID value can change since it derived from the authentication provider's token. 
 
2. Republish the server project.

<!---### <a name="nodejs"></a>Node.js backend project

1. Replace the existing code in the todoitem.js file with the following:

		var azureMobileApps = require('azure-mobile-apps'),
	    promises = require('azure-mobile-apps/src/utilities/promises'),
	    logger = require('azure-mobile-apps/src/logger');
	
		var table = azureMobileApps.table();
		
		table.insert(function (context) {
	    // For more information about the Notification Hubs JavaScript SDK, 
	    // see http://aka.ms/nodejshubs
	    logger.info('Running TodoItem.insert');

		// Get the current user SID and create a tag for the current user.
        string userTag = context.user.Id;
	    
	    // Define the template payload.
	    var payload = '{"message": context.item.text}'; 
	    
	    // Execute the insert.  The insert returns the results as a Promise,
	    // Do the push as a post-execute action within the promise flow.
	    return context.execute()
	        .then(function (results) {
	            // Only do the push if configured
	            if (context.push) {
					// Send a template notification.
	                context.push.send(userTag, payload, function (error) {
	                    if (error) {
	                        logger.error('Error while sending push notification: ', error);
	                    } else {
	                        logger.info('Push notification sent successfully!');
	                    }
	                });
	            }
	            // Don't forget to return the results from the context.execute()
	            return results;
	        })
	        .catch(function (error) {
	            logger.error('Error while running context.execute: ', error);
	        });
		});

		module.exports = table;  

	This sends a template notification only to registrations tagged with the current user's SID. Note that the SID value can change since it derived from the authentication provider's token. 

2. When editing the file in your local computer, republish the server project.-->