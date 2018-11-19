---
author: conceptdev
ms.author: crdun
ms.service: app-service-mobile
ms.topic: include
ms.date: 08/23/2018
---
1. Create a new class in the project called `ToDoBroadcastReceiver`.
2. Add the following using statements to **ToDoBroadcastReceiver** class:

    ```csharp
    using Gcm.Client;
    using Microsoft.WindowsAzure.MobileServices;
    using Newtonsoft.Json.Linq;
    ```

3. Add the following permission requests between the **using** statements and the **namespace** declaration:

    ```csharp
    [assembly: Permission(Name = "@PACKAGE_NAME@.permission.C2D_MESSAGE")]
    [assembly: UsesPermission(Name = "@PACKAGE_NAME@.permission.C2D_MESSAGE")]
    [assembly: UsesPermission(Name = "com.google.android.c2dm.permission.RECEIVE")]
    //GET_ACCOUNTS is only needed for android versions 4.0.3 and below
    [assembly: UsesPermission(Name = "android.permission.GET_ACCOUNTS")]
    [assembly: UsesPermission(Name = "android.permission.INTERNET")]
    [assembly: UsesPermission(Name = "android.permission.WAKE_LOCK")]
    ```

4. Replace the existing **ToDoBroadcastReceiver** class definition with the following:

    ```csharp
    [BroadcastReceiver(Permission = Gcm.Client.Constants.PERMISSION_GCM_INTENTS)]
    [IntentFilter(new string[] { Gcm.Client.Constants.INTENT_FROM_GCM_MESSAGE }, 
        Categories = new string[] { "@PACKAGE_NAME@" })]
    [IntentFilter(new string[] { Gcm.Client.Constants.INTENT_FROM_GCM_REGISTRATION_CALLBACK }, 
        Categories = new string[] { "@PACKAGE_NAME@" })]
    [IntentFilter(new string[] { Gcm.Client.Constants.INTENT_FROM_GCM_LIBRARY_RETRY }, 
    Categories = new string[] { "@PACKAGE_NAME@" })]
    public class ToDoBroadcastReceiver : GcmBroadcastReceiverBase<PushHandlerService>
    {
        // Set the Google app ID.
        public static string[] senderIDs = new string[] { "<PROJECT_NUMBER>" };
    }
    ```

    In the above code, you must replace *`<PROJECT_NUMBER>`* with the project number assigned by Google when you provisioned your app in the Google developer portal. 

5. In the ToDoBroadcastReceiver.cs project file, add the following code that defines the **PushHandlerService** class:

    ```csharp
    // The ServiceAttribute must be applied to the class.
    [Service]
    public class PushHandlerService : GcmServiceBase
    {
        public static string RegistrationID { get; private set; }
        public PushHandlerService() : base(ToDoBroadcastReceiver.senderIDs) { }
    }
    ```

    Note that this class derives from **GcmServiceBase** and that the **Service** attribute must be applied to this class.

    > [!NOTE]
    > The **GcmServiceBase** class implements the **OnRegistered()**, **OnUnRegistered()**, **OnMessage()** and **OnError()** methods. You must override these methods in the **PushHandlerService** class.

6. Add the following code to the **PushHandlerService** class that overrides the **OnRegistered** event handler.

    ```csharp
    protected override void OnRegistered(Context context, string registrationId)
    {
        System.Diagnostics.Debug.WriteLine("The device has been registered with GCM.", "Success!");

        // Get the MobileServiceClient from the current activity instance.
        MobileServiceClient client = ToDoActivity.CurrentActivity.CurrentClient;
        var push = client.GetPush();

        // Define a message body for GCM.
        const string templateBodyGCM = "{\"data\":{\"message\":\"$(messageParam)\"}}";

        // Define the template registration as JSON.
        JObject templates = new JObject();
        templates["genericMessage"] = new JObject
        {
            {"body", templateBodyGCM }
        };

        try
        {
            // Make sure we run the registration on the same thread as the activity, 
            // to avoid threading errors.
            ToDoActivity.CurrentActivity.RunOnUiThread(

                // Register the template with Notification Hubs.
                async () => await push.RegisterAsync(registrationId, templates));

            System.Diagnostics.Debug.WriteLine(
                string.Format("Push Installation Id", push.InstallationId.ToString()));
        }
        catch (Exception ex)
        {
            System.Diagnostics.Debug.WriteLine(
                string.Format("Error with Azure push registration: {0}", ex.Message));
        }
    }
    ```

    This method uses the returned GCM registration ID to register with Azure for push notifications. Tags can only be added to the registration after it is created. For more information, see [How to: Add tags to a device installation to enable push-to-tags](../articles/app-service-mobile/app-service-mobile-dotnet-backend-how-to-use-server-sdk.md#tags).

7. Override the **OnMessage** method in **PushHandlerService** with the following code:

    ```csharp
    protected override void OnMessage(Context context, Intent intent)
    {
        string message = string.Empty;

        // Extract the push notification message from the intent.
        if (intent.Extras.ContainsKey("message"))
        {
            message = intent.Extras.Get("message").ToString();
            var title = "New item added:";

            // Create a notification manager to send the notification.
            var notificationManager = 
                GetSystemService(Context.NotificationService) as NotificationManager;

            // Create a new intent to show the notification in the UI. 
            PendingIntent contentIntent =
                PendingIntent.GetActivity(context, 0,
                new Intent(this, typeof(ToDoActivity)), 0);

            // Create the notification using the builder.
            var builder = new Notification.Builder(context);
            builder.SetAutoCancel(true);
            builder.SetContentTitle(title);
            builder.SetContentText(message);
            builder.SetSmallIcon(Resource.Drawable.ic_launcher);
            builder.SetContentIntent(contentIntent);
            var notification = builder.Build();

            // Display the notification in the Notifications Area.
            notificationManager.Notify(1, notification);

        }
    }
    ```

8. Override the **OnUnRegistered()** and **OnError()** methods with the following code.

    ```csharp
    protected override void OnUnRegistered(Context context, string registrationId)
    {
        throw new NotImplementedException();
    }

    protected override void OnError(Context context, string errorId)
    {
        System.Diagnostics.Debug.WriteLine(
            string.Format("Error occurred in the notification: {0}.", errorId));
    }
    ```
