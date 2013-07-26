<properties linkid="notification-hubs-how-to-guides-howto-register-user-with-mobile-service-ios" urlDisplayName="Notify iOS app users by using Mobile Services" pageTitle="Register the current user for push notifications by using a mobile service - Notification Hubs" metaKeywords="Windows Azure registering application, Notification Hubs, Azure push notifications, push notification iOS app" metaDescription="Learn how to request push notification registration in an iOS app with Windows Azure Notification Hubs when registeration is performed by Windows Azure Mobile Services." metaCanonical="" disqusComments="0" umbracoNaviHide="1" />

<div chunk="../chunks/notification-hubs-left-nav.md" />

# Register the current user for push notifications by using a mobile service

<div class="dev-center-tutorial-selector sublanding">
    <a href="/en-us/manage/services/notification-hubs/register-users-with-mobile-services-windowsdotnet" title="Windows Store C#">Windows Store C#</a>
    <a href="/en-us/manage/services/notification-hubs/register-users-with-mobile-services-ios" title="iOS" class="current">iOS</a>
</div>

This topic shows you how to request push notification registration with Windows Azure Notification Hubs when registration is performed by Windows Azure Mobile Services. This topic extends the tutorial [Notify users with Notification Hubs]. You must have already completed the required steps in that tutorial to create the authenticated mobile service. For more information on the notify users scenario, see [Notify users with Notification Hubs].  

1. In Xcode, open the QSTodoService.m file in the project that you created when you completed the prerequisite tutorial [Get started with authentication].

3. Just after the **viewDidAppear** method, add the following code:

       	/// method that calls the register_api method on the mobile service.

	This method creates a device token for push notifications and sends it, along with the device type, to the custom API method that creates a registration in Notification Hubs. This custom API was defined in [Notify users with Notification Hubs].

	<div class="dev-callout"><b>Note</b>
	<p>This makes sure that registration is requested every time that the page is loaded. In your app, you may only want to make this registration periodically to ensure that the registration is current.</p>
	</div>


Now that the client app has been updated, return to the [Notify users with Notification Hubs] and update the mobile service to send notifications by using Notification Hubs.

<!-- Anchors. -->

<!-- Images. -->


<!-- URLs. -->
[Notify users with Notification Hubs]: ./tutorial-notify-users-mobileservices.md
[Get started with authentication]: /en-us/develop/mobile/tutorials/get-started-with-users-ios/
[WindowsAzure.com]: http://www.windowsazure.com/
[Windows Azure Management Portal]: https://manage.windowsazure.com/