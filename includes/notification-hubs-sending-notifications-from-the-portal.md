

Push notifications are normally sent in a back-end service like Mobile Apps or ASP.NET using a compatible library. You can also use the REST API directly to send notification messages if a library is not available for your back-end. 

Here is a list of some other tutorials you may want to review for sending notifications:

- Azure Mobile Apps : For an example of how to send notifications from an Mobile Apps backend integrated with Notification Hubs, see [Add Push Notifications to your iOS App](../articles/app-service-mobile/app-service-mobile-ios-get-started-push.md).  
- ASP.NET : [Use Notification Hubs to push notifications to users](../articles/notification-hubs/notification-hubs-aspnet-backend-ios-apple-apns-notification.md).
- Azure Notification Hub Java SDK: See [How to use Notification Hubs from Java](../articles/notification-hubs/notification-hubs-java-push-notification-tutorial.md) for sending notifications from Java. This has been tested in Eclipse for Android Development.
- PHP: [How to use Notification Hubs from PHP](../articles/notification-hubs/notification-hubs-php-push-notification-tutorial.md).


In the next section of the tutorial, you will learn how to use the [Notification Hub REST interface](http://msdn.microsoft.com/library/windowsazure/dn223264.aspx) to send the notification message directly in your app. All registered devices receive the notification sent by any device.  


