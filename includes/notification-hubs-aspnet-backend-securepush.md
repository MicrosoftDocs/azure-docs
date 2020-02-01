---
author: sethmanheim
ms.service: service-bus
ms.topic: include
ms.date: 11/09/2018	
ms.author: sethm
---
## WebAPI Project

1. In Visual Studio, open the **AppBackend** project that you created in the **Notify Users** tutorial.
2. In Notifications.cs, replace the whole **Notifications** class with the following code. Be sure to replace the placeholders with your connection string (with full access) for your notification hub, and the hub name. You can obtain these values from the [Azure portal](https://portal.azure.com). This module now represents the different secure notifications that will be sent. In a complete implementation, the notifications will be stored in a database; for simplicity, in this case we store them in memory.
   
   ```csharp
    public class Notification
    {
        public int Id { get; set; }
        public string Payload { get; set; }
        public bool Read { get; set; }
    }

    public class Notifications
    {
        public static Notifications Instance = new Notifications();

        private List<Notification> notifications = new List<Notification>();

        public NotificationHubClient Hub { get; set; }

        private Notifications() {
            Hub = NotificationHubClient.CreateClientFromConnectionString("{conn string with full access}",     "{hub name}");
        }

        public Notification CreateNotification(string payload)
        {
            var notification = new Notification() {
            Id = notifications.Count,
            Payload = payload,
            Read = false
            };

            notifications.Add(notification);

            return notification;
        }

        public Notification ReadNotification(int id)
        {
            return notifications.ElementAt(id);
        }
    }
    ```

1. In NotificationsController.cs, replace the code inside the **NotificationsController** class definition with the following code. This component implements a way for the device to retrieve the notification securely, and also provides a way (for the purposes of this tutorial) to trigger a secure push to your devices. Note that when sending the notification to the notification hub, we only send a raw notification with the ID of the notification (and no actual message):
   
   ```csharp
    public NotificationsController()
    {
        Notifications.Instance.CreateNotification("This is a secure notification!");
    }

    // GET api/notifications/id
    public Notification Get(int id)
    {
        return Notifications.Instance.ReadNotification(id);
    }

    public async Task<HttpResponseMessage> Post()
    {
        var secureNotificationInTheBackend = Notifications.Instance.CreateNotification("Secure confirmation.");
        var usernameTag = "username:" + HttpContext.Current.User.Identity.Name;

        // windows
        var rawNotificationToBeSent = new Microsoft.Azure.NotificationHubs.WindowsNotification(secureNotificationInTheBackend.Id.ToString(),
                        new Dictionary<string, string> {
                            {"X-WNS-Type", "wns/raw"}
                        });
        await Notifications.Instance.Hub.SendNotificationAsync(rawNotificationToBeSent, usernameTag);

        // apns
        await Notifications.Instance.Hub.SendAppleNativeNotificationAsync("{\"aps\": {\"content-available\": 1}, \"secureId\": \"" + secureNotificationInTheBackend.Id.ToString() + "\"}", usernameTag);

        // gcm
        await Notifications.Instance.Hub.SendGcmNativeNotificationAsync("{\"data\": {\"secureId\": \"" + secureNotificationInTheBackend.Id.ToString() + "\"}}", usernameTag);

        return Request.CreateResponse(HttpStatusCode.OK);
    }
    ```

Note that the `Post` method now does not send a toast notification. It sends a raw notification that contains only the notification ID, and not any sensitive content. Also, make sure to comment the send operation for the platforms for which you do not have credentials configured on your notification hub, as they will result in errors.

1. Now we will re-deploy this app to an Azure Website in order to make it accessible from all devices. Right-click on the **AppBackend** project and select **Publish**.
2. Select Azure Website as your publish target. Sign in with your Azure account and select an existing or new Website, and make a note of the **destination URL** property in the **Connection** tab. We will refer to this URL as your *backend endpoint* later in this tutorial. Click **Publish**.
