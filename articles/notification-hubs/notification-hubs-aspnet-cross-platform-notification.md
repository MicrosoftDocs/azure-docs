---
title: Send cross-platform notifications to users with Azure Notification Hubs (ASP.NET)
description: Learn how to use Notification Hubs templates to send, in a single request, a platform-agnostic notification that targets all platforms.
services: notification-hubs
documentationcenter: ''
author: sethmanheim
manager: femila
editor: thsomasu

ms.service: notification-hubs
ms.workload: mobile
ms.tgt_pltfrm: mobile-windows
ms.devlang: csharp
ms.topic: article
ms.date: 08/23/2021
ms.author: sethm
ms.reviewer: thsomasu
ms.lastreviewed: 10/02/2019
ms.custom: devx-track-csharp
---

# Send cross-platform notifications with Azure Notification Hubs

This tutorial builds on the previous tutorial, [Send notifications to specific users by using Azure Notification Hubs]. That tutorial describes how to push notifications to all devices that are registered to a specific authenticated user. That approach required multiple requests to send a notification to each supported client platform. Azure Notification Hubs supports templates, with which you can specify how a specific device wants to receive notifications. This method simplifies sending cross-platform notifications.

This article demonstrates how to take advantage of templates to send a notification that targets all platforms. This article uses a single request to send a platform neutral notification. For more detailed information about templates, see [Notification Hubs overview][Templates].

> [!IMPORTANT]
> Windows Phone projects 8.1 and earlier are not supported in Visual Studio 2019. For more information, see [Visual Studio 2019 platform targeting and compatibility](/visualstudio/releases/2019/compatibility).

> [!NOTE]
> With Notification Hubs, a device can register multiple templates by using the same tag. In this case, an incoming message that targets the tag results in multiple notifications being delivered to the device, one for each template. This process enables you to display the same message in multiple visual notifications, such as both as a badge and as a toast notification in a Windows Store app.

## Send cross-platform notifications using templates

> [!NOTE]
> Microsoft Push Notification Service (MPNS) has been deprecated and is no longer supported.

This section uses the sample code you built in the [Send notifications to specific users by using Azure Notification Hubs] tutorial. You can [download the complete sample from GitHub](https://github.com/Azure/azure-notificationhubs-dotnet/tree/master/Samples/NotifyUsers).

To send cross-platform notifications using templates, do the following:

1. In Visual Studio in **Solution Explorer**, expand the **Controllers** folder, and then open the *RegisterController.cs* file.

1. Locate the block of code in the `Put` method that creates a new registration, and then replace the `switch` content with the following code:

    ```csharp
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
        case "fcm":
            var messageTemplate = "{\"data\":{\"message\":\"$(message)\"}}";
            registration = new FcmTemplateRegistrationDescription(deviceUpdate.Handle, messageTemplate);
            break;
        default:
            throw new HttpResponseException(HttpStatusCode.BadRequest);
    }
    ```

    This code calls the platform-specific method to create a template registration instead of a native registration. Because template registrations derive from native registrations, you don't need to modify existing registrations.

1. In **Solution Explorer**, in the **Controllers** folder, open the **NotificationsController.cs** file. Replace the `Post` method with the following code:

    ```csharp
    public async Task<HttpResponseMessage> Post()
    {
        var user = HttpContext.Current.User.Identity.Name;
        var userTag = "username:" + user;

        var notification = new Dictionary<string, string> { { "message", "Hello, " + user } };
        await Notifications.Instance.Hub.SendTemplateNotificationAsync(notification, userTag);

        return Request.CreateResponse(HttpStatusCode.OK);
    }
    ```

    This code sends a notification to all platforms at the same time. You don't specify a native payload. Notification Hubs builds and delivers the correct payload to every device with the provided tag value, as specified in the registered templates.

1. Republish your Web API project.

1. Run the client app again to verify that the registration has succeeded.

1. Optionally, deploy the client app to a second device, and then run the app. A notification is displayed on each device.

## Next steps

Now that you've completed this tutorial, find out more about Notification Hubs and templates in these articles:

* For a different scenario for using templates, see the [Push notifications to specific Windows devices running Universal Windows Platform applications][Use Notification Hubs to send breaking news] tutorial.
* For more detailed information on templates, see [Notification Hubs Overview][Templates].

<!-- Anchors. -->

<!-- Images. -->

<!-- URLs. -->
[Push to users ASP.NET]: notification-hubs-aspnet-backend-ios-apple-apns-notification.md
[Push to users Mobile Services]: notification-hubs-aspnet-backend-windows-dotnet-wns-notification.md
[Visual Studio 2012 Express for Windows 8]: https://visualstudio.microsoft.com/downloads/

[Use Notification Hubs to send breaking news]: notification-hubs-windows-notification-dotnet-push-xplat-segmented-wns.md
[Azure Notification Hubs]: https://go.microsoft.com/fwlink/p/?LinkId=314257
[Send notifications to specific users by using Azure Notification Hubs]: notification-hubs-aspnet-backend-windows-dotnet-wns-notification.md
[Templates]: /previous-versions/azure/azure-services/jj927170(v=azure.100)
[Notification Hub How to for Windows Store]: /previous-versions/azure/azure-services/jj927170(v=azure.100)