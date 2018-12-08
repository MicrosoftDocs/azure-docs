---
title: Send cross-platform notifications to users with Azure Notification Hubs (ASP.NET)
description: Learn how to use Notification Hubs templates to send, in a single request, a platform-agnostic notification that targets all platforms.
services: notification-hubs
documentationcenter: ''
author: dimazaid
manager: kpiteira
editor: spelluru

ms.assetid: 11d2131b-f683-47fd-a691-4cdfc696f62b
ms.service: notification-hubs
ms.workload: mobile
ms.tgt_pltfrm: mobile-windows
ms.devlang: multiple
ms.topic: article
ms.date: 04/14/2018
ms.author: dimazaid

---
# Send cross-platform notifications to users with Notification Hubs
In a previous tutorial, [Notify users with Notification Hubs], you learned how to push notifications to all devices that are registered to a specific authenticated user. In that tutorial, multiple requests were required to send a notification to each supported client platform. Azure Notification Hubs supports templates, with which you can specify how a specific device wants to receive notifications. This method simplifies sending cross-platform notifications. 

This article demonstrates how to take advantage of templates to send, in a single request, a platform-agnostic notification that targets all platforms. For more detailed information about templates, see [Azure Notification Hubs Overview][Templates].

> [!IMPORTANT]
> Windows Phone projects 8.1 and earlier are not supported in Visual Studio 2017. For more information, see [Visual Studio 2017 Platform Targeting and Compatibility](https://www.visualstudio.com/en-us/productinfo/vs2017-compatibility-vs).

> [!NOTE]
> With Notification Hubs, a device can register multiple templates with the same tag. In this case, an incoming message that targets the tag results in multiple notifications delivered to the device, one for each template. This process enables you to display the same message in multiple visual notifications, such as both as a badge and as a toast notification in a Windows Store app.
> 
> 

To send cross-platform notifications by using templates, do the following:

1. In the Solution Explorer in Visual Studio, expand the **Controllers** folder, and then open the RegisterController.cs file.

2. Locate the block of code in the **Put** method that creates a new registration, and then replace the `switch` content with the following code:
   
        switch (deviceUpdate.Platform)
        {
            case "mpns":
                var toastTemplate = "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
                    "<wp:Notification xmlns:wp=\"WPNotification\">" +
                       "<wp:Toast>" +
                            "<wp:Text1>$(message)</wp:Text1>" +
                       "</wp:Toast> " +
                    "</wp:Notification>";
                registration = new MpnsTemplateRegistrationDescription(deviceUpdate.Handle, toastTemplate);
                break;
            case "wns":
                toastTemplate = @"<toast><visual><binding template=""ToastText01""><text id=""1"">$(message)</text></binding></visual></toast>";
                registration = new WindowsTemplateRegistrationDescription(deviceUpdate.Handle, toastTemplate);
                break;
            case "apns":
                var alertTemplate = "{\"aps\":{\"alert\":\"$(message)\"}}";
                registration = new AppleTemplateRegistrationDescription(deviceUpdate.Handle, alertTemplate);
                break;
            case "gcm":
                var messageTemplate = "{\"data\":{\"message\":\"$(message)\"}}";
                registration = new GcmTemplateRegistrationDescription(deviceUpdate.Handle, messageTemplate);
                break;
            default:
                throw new HttpResponseException(HttpStatusCode.BadRequest);
        }
   
    This code calls the platform-specific method to create a template registration instead of a native registration. Because template registrations derive from native registrations, you don't need to modify existing registrations.

3. In the **Notifications** controller, replace the **sendNotification** method with the following code:
   
        public async Task<HttpResponseMessage> Post()
        {
            var user = HttpContext.Current.User.Identity.Name;
            var userTag = "username:" + user;
   
            var notification = new Dictionary<string, string> { { "message", "Hello, " + user } };
            await Notifications.Instance.Hub.SendTemplateNotificationAsync(notification, userTag);
   
            return Request.CreateResponse(HttpStatusCode.OK);
        }
   
    This code sends a notification to all platforms at the same time, without you are having to specify a native payload. Notification Hubs builds and delivers the correct payload to every device with the provided *tag* value, as specified in the registered templates.

4. Republish your WebApi back-end project.

5. Run the client app again, and then verify that the registration has succeeded.

6. (Optional) Deploy the client app to a second device, and then run the app.
    A notification is displayed on each device.

## Next steps
Now that you have completed this tutorial, find out more about Notification Hubs and templates in these topics:

* [Use Notification Hubs to send breaking news]: Demonstrates another scenario for using templates.
* [Azure Notification Hubs overview][Templates]: Contains more detailed information on templates.

<!-- Anchors. -->

<!-- Images. -->




<!-- URLs. -->
[Push to users ASP.NET]: notification-hubs-aspnet-backend-ios-apple-apns-notification.md
[Push to users Mobile Services]: notification-hubs-aspnet-backend-windows-dotnet-wns-notification.md
[Visual Studio 2012 Express for Windows 8]: http://go.microsoft.com/fwlink/?LinkId=257546

[Use Notification Hubs to send breaking news]: notification-hubs-windows-notification-dotnet-push-xplat-segmented-wns.md
[Azure Notification Hubs]: http://go.microsoft.com/fwlink/p/?LinkId=314257
[Notify users with Notification Hubs]: notification-hubs-aspnet-backend-windows-dotnet-wns-notification.md
[Templates]: http://go.microsoft.com/fwlink/p/?LinkId=317339
[Notification Hub How to for Windows Store]: http://msdn.microsoft.com/library/windowsazure/jj927172.aspx
