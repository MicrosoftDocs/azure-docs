These steps create a new custom [ApiController](http://go.microsoft.com/fwlink/p/?LinkId=512673) that sends push notifications to the app. You could implement this same code in a [TableController](http://msdn.microsoft.com/library/azure/dn643359.aspx) or anywhere else in your backend services. 

1. In Visual Studio Solution Explorer, right-click the Controllers folder for the mobile service project, expand **Add**, then click **New Scaffolded Item**.

	This displays the Add Scaffold dialog.

2. Expand **Azure Mobile Services** and click **Azure Mobile Services Custom Controller**, then click **Add**, supply a **Controller name** of `NotifyAllUsersController`, then click **Add** again.

	![Web API Add Scaffold dialog](./media/mobile-services-dotnet-backend-update-server-push-vs2013/add-custom-api-controller.png)

	This creates a new empty controller class named **NotifyAllUsersController**. 

3. In the new NotifyAllUsersController.cs project file, add the following **using** statements:

        using Newtonsoft.Json.Linq;
        using System.Threading.Tasks;

4. Add the following code that implements the POST method on the controller:

        public async Task<bool> Post(JObject data)
        {
            try
            {
                // Define the XML paylod for a WNS native toast notification 
				// that contains the value supplied in the POST request.
                string wnsToast = 
                    string.Format("<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
                    "<toast><visual><binding template=\"ToastText01\">" + 
                    "<text id=\"1\">{0}</text></binding></visual></toast>", 
                    data.GetValue("toast").Value<string>());

                // Define the WNS native toast with the payload string.
                WindowsPushMessage message = new WindowsPushMessage();
                message.XmlPayload = wnsToast;

                // Send the toast notification.
                await Services.Push.SendAsync(message);
                return true;
            }
            catch (Exception e)
            {
                Services.Log.Error(e.ToString());
            }
            return false;
        }

	>[AZURE.NOTE]This POST method can be called by any client that has the application key, which is not secure. To secure the endpoint, apply the attribute `[AuthorizeLevel(AuthorizationLevel.User)]` to the method or class to require authentication. 
