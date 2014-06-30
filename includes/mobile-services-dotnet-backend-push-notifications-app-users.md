
1. In Solution Explorer in Visual Studio, expand the App_Start folder and open the WebApiConfig.cs project file.

2. Add the following line of code to the Register method after the **ConfigOptions** definition:

        options.PushAuthorization = 
            Microsoft.WindowsAzure.Mobile.Service.Security.AuthorizationLevel.User;
 
	This enforces user authentication before registering for push notifications. 

2. Right-click the project, click **Add** then click **Class...**.

3. Name the new empty class `PushRegistrationHandler` then click **Add**.

4. At the top of the code page, add the following **using** statements:

		using System.Threading.Tasks; 
		using System.Web.Http; 
		using System.Web.Http.Controllers; 
		using Microsoft.WindowsAzure.Mobile.Service; 
		using Microsoft.WindowsAzure.Mobile.Service.Notifications; 
		using Microsoft.WindowsAzure.Mobile.Service.Security; 

5. Replace the existing **PushRegistrationHandler** method with the following code:
 
	    public class PushRegistrationHandler : INotificationHandler
	    {
	        public Task Register(ApiServices services, HttpRequestContext context, 
	            NotificationRegistration registration)
	        {
	            // Get the logged-in user.
	            var currentUser = context.Principal as ServiceUser;
	
	            // Perform a check here for any disallowed tags.
	
	            // Add a new tag that is the user ID.
	            registration.Tags.Add(currentUser.Id);
	            services.Log.Info("Registered tag for userId: " + currentUser.Id);
	            
	            return Task.FromResult(true);
	        }
	
	        public Task Unregister(ApiServices services, HttpRequestContext context, 
	            string deviceId)
	        {
	            // This is where you can hook into registration deletion.
	            return Task.FromResult(true);
	        }
	    }

	The **Register** method is called during registration. This lets you add a tag to the registration that is the ID of the logged-in user. When a notification is sent to this user, it is recieved on this device. 

6. Expand the Controllers folder, open the TodoItemController.cs project file, locate the **PostTodoItem** method and replace the line of code that calls **SendAsync** with the following code:

        // Get the logged-in user.
		var currentUser = this.User as ServiceUser;
		
		// Use a tag to only send the notification to the logged-in user.
        var result = await Services.Push.SendAsync(message, currentUser.Id);

7. Republish the mobile service project.

Now, the service uses the user ID tag to send a push notification (with the text of the inserted item) to all registrations created by the logged-in user.
 