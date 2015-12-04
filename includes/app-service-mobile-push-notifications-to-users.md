
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