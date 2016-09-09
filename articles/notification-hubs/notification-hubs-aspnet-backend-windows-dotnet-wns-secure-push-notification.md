<properties
	pageTitle="Azure Notification Hubs Secure Push"
	description="Learn how to send secure push notifications in Azure. Code samples written in C# using the .NET API."
	documentationCenter="windows"
	authors="wesmc7777"
	manager="erikre"
	editor=""
	services="notification-hubs"/>

<tags
	ms.service="notification-hubs" 
	ms.workload="mobile"
	ms.tgt_pltfrm="windows"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.date="06/29/2016"
	ms.author="wesmc"/>

#Azure Notification Hubs Secure Push

> [AZURE.SELECTOR]
- [Windows Universal](notification-hubs-aspnet-backend-windows-dotnet-secure-push.md)
- [iOS](notification-hubs-aspnet-backend-ios-secure-push.md)
- [Android](notification-hubs-aspnet-backend-android-secure-push.md)


##Overview

Push notification support in Microsoft Azure enables you to access an easy-to-use, multiplatform, scaled-out push infrastructure, which greatly simplifies the implementation of push notifications for both consumer and enterprise applications for mobile platforms.

Due to regulatory or security constraints, sometimes an application might want to include something in the notification that cannot be transmitted through the standard push notification infrastructure. This tutorial describes how to achieve the same experience by sending sensitive information through a secure, authenticated connection between the client device and the app backend.

At a high level, the flow is as follows:

1. The app back-end:
	- Stores secure payload in back-end database.
	- Sends the ID of this notification to the device (no secure information is sent).
2. The app on the device, when receiving the notification:
	- The device contacts the back-end requesting the secure payload.
	- The app can show the payload as a notification on the device.

It is important to note that in the preceding flow (and in this tutorial), we assume that the device stores an authentication token in local storage, after the user logs in. This guarantees a completely seamless experience, as the device can retrieve the notification’s secure payload using this token. If your application does not store authentication tokens on the device, or if these tokens can be expired, the device app, upon receiving the notification should display a generic notification prompting the user to launch the app. The app then authenticates the user and shows the notification payload.

This Secure Push tutorial shows how to send a push notification securely. The tutorial builds on the [Notify Users](notification-hubs-aspnet-backend-windows-dotnet-wns-notification.md) tutorial, so you should complete the steps in that tutorial first.

> [AZURE.NOTE] This tutorial assumes that you have created and configured your notification hub as described in [Getting Started with Notification Hubs (Windows Store)](notification-hubs-windows-store-dotnet-get-started-wns-push-notification.md).
Also, note that Windows Phone 8.1 requires Windows (not Windows Phone) credentials, and that background tasks do not work on Windows Phone 8.0 or Silverlight 8.1. For Windows Store applications, you can receive notifications via a background task only if the app is lock-screen enabled (click the checkbox in the Appmanifest).

[AZURE.INCLUDE [notification-hubs-aspnet-backend-securepush](../../includes/notification-hubs-aspnet-backend-securepush.md)]

## Modify the Windows Phone Project

1. In the **NotifyUserWindowsPhone** project, add the following code to App.xaml.cs to register the push background task. Add the following line of code at the end of the `OnLaunched()` method:

		RegisterBackgroundTask();

2. Still in App.xaml.cs, add the following code immediately after the `OnLaunched()` method:

		private async void RegisterBackgroundTask()
        {
            if (!Windows.ApplicationModel.Background.BackgroundTaskRegistration.AllTasks.Any(i => i.Value.Name == "PushBackgroundTask"))
            {
                var result = await BackgroundExecutionManager.RequestAccessAsync();
                var builder = new BackgroundTaskBuilder();

                builder.Name = "PushBackgroundTask";
                builder.TaskEntryPoint = typeof(PushBackgroundComponent.PushBackgroundTask).FullName;
                builder.SetTrigger(new Windows.ApplicationModel.Background.PushNotificationTrigger());
                BackgroundTaskRegistration task = builder.Register();
            }
        }

3. Add the following `using` statements at the top of the App.xaml.cs file:

		using Windows.Networking.PushNotifications;
		using Windows.ApplicationModel.Background;

4. From the **File** menu in Visual Studio, click **Save All**.

## Create the Push Background Component

The next step is to create the push background component.

1. In Solution Explorer, right-click the top-level node of the solution (**Solution SecurePush** in this case), then click **Add**, then click **New Project**.

2. Expand **Store Apps**, then click **Windows Phone Apps**, then click **Windows Runtime Component (Windows Phone)**. Name the project **PushBackgroundComponent**, and then click **OK** to create the project.

	![][12]

3. In Solution Explorer, right-click the **PushBackgroundComponent (Windows Phone 8.1)** project, then click **Add**, then click **Class**. Name the new class **PushBackgroundTask.cs**. Click **Add** to generate the class.

4. Replace the entire contents of the **PushBackgroundComponent** namespace definition with the following code, substituting the placeholder `{back-end endpoint}` with the back-end endpoint obtained while deploying your back-end:

		public sealed class Notification
    		{
        		public int Id { get; set; }
        		public string Payload { get; set; }
        		public bool Read { get; set; }
    		}

		    public sealed class PushBackgroundTask : IBackgroundTask
    		{
        		private string GET_URL = "{back-end endpoint}/api/notifications/";

        		async void IBackgroundTask.Run(IBackgroundTaskInstance taskInstance)
		        {
        		    // Store the content received from the notification so it can be retrieved from the UI.
		            RawNotification raw = (RawNotification)taskInstance.TriggerDetails;
            		var notificationId = raw.Content;

            		// retrieve content
		            BackgroundTaskDeferral deferral = taskInstance.GetDeferral();
            		var httpClient = new HttpClient();
		            var settings = ApplicationData.Current.LocalSettings.Values;
		            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", (string)settings["AuthenticationToken"]);

		            var notificationString = await httpClient.GetStringAsync(GET_URL + notificationId);

            		var notification = JsonConvert.DeserializeObject<Notification>(notificationString);

		            ShowToast(notification);

		            deferral.Complete();
		        }

		        private void ShowToast(Notification notification)
		        {
		            ToastTemplateType toastTemplate = ToastTemplateType.ToastText01;
		            XmlDocument toastXml = ToastNotificationManager.GetTemplateContent(toastTemplate);
            		XmlNodeList toastTextElements = toastXml.GetElementsByTagName("text");
		            toastTextElements[0].AppendChild(toastXml.CreateTextNode(notification.Payload));
    	        	ToastNotification toast = new ToastNotification(toastXml);
		            ToastNotificationManager.CreateToastNotifier().Show(toast);
    		    }
    		}

5. In Solution Explorer, right-click the **PushBackgroundComponent (Windows Phone 8.1)** project and then click **Manage NuGet Packages**.

6. On the left-hand side, click **Online**.

7. In the **Search** box, type **Http Client**.

8. In the results list, click **Microsoft HTTP Client Libraries**, and then click **Install**. Complete the installation.

9. Back in the NuGet **Search** box, type **Json.net**. Install the **Json.NET** package, then close the NuGet Package Manager window.

10. Add the following `using` statements at the top of the **PushBackgroundTask.cs** file:

		using Windows.ApplicationModel.Background;
		using Windows.Networking.PushNotifications;
		using System.Net.Http;
		using Windows.Storage;
		using System.Net.Http.Headers;
		using Newtonsoft.Json;
		using Windows.UI.Notifications;
		using Windows.Data.Xml.Dom;

11. In Solution Explorer, in the **NotifyUserWindowsPhone (Windows Phone 8.1)** project, right-click **References**, then click **Add Reference...**. In the Reference Manager dialog, check the box next to **PushBackgroundComponent**, and then click **OK**.

12. In Solution Explorer, double-click **Package.appxmanifest** in the **NotifyUserWindowsPhone (Windows Phone 8.1)** project. Under **Notifications**, set **Toast Capable** to **Yes**.

	![][3]

13. Still in **Package.appxmanifest**, click the **Declarations** menu near the top. In the **Available Declarations** dropdown, click **Background Tasks**, and then click **Add**.

14. In **Package.appxmanifest**, under **Properties**, check **Push notification**.

15. In **Package.appxmanifest**, under **App Settings**, type **PushBackgroundComponent.PushBackgroundTask** in the **Entry Point** field.

	![][13]

16. From the **File** menu, click **Save All**.

## Run the Application

To run the application, do the following:

1. In Visual Studio, run the **AppBackend** Web API application. An ASP.NET web page is displayed.

2. In Visual Studio, run the **NotifyUserWindowsPhone (Windows Phone 8.1)** Windows Phone app. The Windows Phone emulator runs and loads the app automatically.

3. In the **NotifyUserWindowsPhone** app UI, enter a username and password. These can be any string, but they must be the same value.

4. In the **NotifyUserWindowsPhone** app UI, click **Log in and register**. Then click **Send push**.

[3]: ./media/notification-hubs-aspnet-backend-windows-dotnet-secure-push/notification-hubs-secure-push3.png
[12]: ./media/notification-hubs-aspnet-backend-windows-dotnet-secure-push/notification-hubs-secure-push12.png
[13]: ./media/notification-hubs-aspnet-backend-windows-dotnet-secure-push/notification-hubs-secure-push13.png
