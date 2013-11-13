<properties linkid="develop-mobile-how-to-guides-multiple-clients-single-service" writer="krisragh" urldisplayname="Multiple Clients" pagetitle="Target multiple clients from a single mobile service | Mobile Services Tutorials" metakeywords="mobile services, multiple clients" metadescription="Learn how to use a single mobile service back-end from multiple client apps that target different mobile platforms, including Windows Store and Windows Phone." umbraconavihide="0" disquscomments="1"></properties>

# Considerations for supporting multiple clients from a single mobile service
 
One of the major benefits of using Windows Azure Mobile Services to support mobile app development is the ability to use a single backend service that supports an app on multiple client platforms. Mobile Services provides native client libraries for all major device platforms. For more information, see [Tutorials and resources].

While Mobile Services makes it easy to migrate your native app across multiple client platforms using a single backend service, there are a few considerations that you will need to plan for. This topic provides guidance on how to get push notifications working across all your client platforms. It also decribes how to work around an issue with using client-directed single sign-on using Microsoft Account in both Windows Store and Windows Phone apps. Finally, this topic discusses some best practices for reusing code in Visual Studio projects.

## Push Notifications 
This section discusses two approaches for sending push notifications from your mobile service to client apps on multiple platforms.

### Leverage Notification Hubs

Windows Azure Notification Hubs is a Windows Azure service is a scalable solution for sending push notifications from your mobile service (or any backend) to client apps on all major device plaforms. For more information, see [Windows Azure Notification Hubs]. 

Notification Hubs provide a consistent and unified infrastructure for creating and managing device registrations and for sending push notifications to devices running on all major device platforms. For more information, see [Get started with Notification Hubs]. Notification Hubs supports platform-specific template registrations, which enables you to use a single API call to send a notification to your app running on any registered platform. For more information, see [Send cross-platform notifications to users].

Notification Hubs is the recommended solution for sending notifications from your mobile service to mutiple client platforms.

### Use a common registration table and platform identifier 

To support multiple clients for push, only a few changes are needed to the [previous push notification tutorial](http://www.windowsazure.com/en-us/develop/mobile/tutorials/push-notifications-to-users-dotnet/) on the client side. In the type definition for the channels table, add a field which indicates which platform the client is registering from:
		
		public class Registrations
		{
			[JsonProperty(PropertyName = "platform")]			
			public string Platform { get; set; }
			
		    public string Id { get; set; }
		
			[JsonProperty(PropertyName = "handle")]
			public string Handle { get; set; }
		}

This way, when registering for a push channel, you know which push API to use. In a Windows Store app, the constructor could set this property to "winstore" (for example) and in the Windows Phone app version, it could be set to "winphone." As long as dynamic schema is turned on (which it is by default although it is recommended that it be turned off before production), all you need to do is add a new property to the Channel class on the client as shown above. The new column will get automatically added by Mobile Services when the next insert occurs.

Next, on the server-side, add a script to handle the stored platform to send notifications to the correct client. The code below relies on parts of the "send" example from the [Push notifications to users by using Mobile Services on Windows Store](http://www.windowsazure.com/en-us/develop/mobile/tutorials/push-notifications-to-users-dotnet/) tutorial and the [Push notifications to users by using Mobile Services on Windows Phone](http://www.windowsazure.com/en-us/develop/mobile/tutorials/push-notifications-to-users-wp8/) tutorial.

		function sendNotifications() {
			var channelTable = tables.getTable('Channel');
			var pushOptions = {
				success: function(pushResult) {
					console.log('Push succeeded: ', pushResult);
				},
				error: function(err) {
					console.warn('Push failed: ', err);
				}
			}; 
				

			channelTable.read({
				success: function(channels) {
					channels.forEach(function(channel) {
					
						if (channel.platform === 'winstore') {
							push.wns.sendToastText04(channel.uri, "Text to push" , pushOptions);                  
						}
						else if (channel.platform === 'winphone') {
							push.mpns.sendFlipTile(channel.uri, "Text to push" , pushOptions);
						} 
						else
						{
							console.error('Unknown platform.');
						}
					});
				}
			});
		} 

Finally, notification hubs are an excellent way to support cross-platform notifications. For more information, please see [Notify users with Notification Hubs](http://www.windowsazure.com/en-us/manage/services/notification-hubs/notify-users/tutorial-notify-users-cross-platform-mobileservice/) and [Send cross-platform notifications to users with Notification Hubs](http://www.windowsazure.com/en-us/manage/services/notification-hubs/notify-users-xplat-mobile-services/).


## Windows App Registration

In order to use single sign-on client authentication using Microsoft Account in both Windows Store and Windows Phone apps, you must register the Windows Store app on the Windows Store dashboard first. This is because once you create a Live Connect registration for Windows Phone, you cannot create one for Windows Store. For more information about how to do this, please read the topic **Authenticate your Windows Store app with Live Connect single sign-on** ([Windows Store][SSO Windows Store]/[Windows Phone][SSO Windows Phone]).

## Best practices for reusing code in Visual Studio projects

Portable class libraries enable you to write and build managed assemblies that work on more than one platform, such as Windows Store and Windows Phone. You can create classes that contain code you wish to share across many projects, and then reference those classes from different types of projects. 

You can use the .NET Framework Portable Class Library to implement the Model-View-View Model (MVVM) pattern and share assemblies across multiple platforms. You can implement the model and view model classes in a Portable Class Library project in Visual Studio 2012, and then create views that are customized for different platforms. The model code, common across platforms, may (as an example) retrieve the data from a source such as a Windows Azure Mobile Service in a platform-agnostic manner. The MSDN Library provides an <a href="http://msdn.microsoft.com/en-us/library/gg597391(v=vs.110)">overview and example</a>, discussion of <a href="http://msdn.microsoft.com/en-us/library/gg597392(v=vs.110)">API differences</a>, an example of <a href="http://msdn.microsoft.com/en-us/library/hh563947(v=vs.110)">using portable class libraries to implement the MVVM pattern</a>, additional [prescriptive guidance](http://msdn.microsoft.com/en-us/library/windowsphone/develop/jj714086(v=vs.105).aspx), and and information about <a href="http://msdn.microsoft.com/en-us/library/hh871422(v=vs.110)">managing resources</a> in portable class library projects.

<!-- URLs -->

[Windows Azure Notification Hubs]: /en-us/develop/net/how-to-guides/service-bus-notification-hubs/
[SSO Windows Store]: /en-us/develop/mobile/tutorials/single-sign-on-windows-8-dotnet/
[SSO Windows Phone]: /en-us/develop/mobile/tutorials/single-sign-on-wp8/
[Tutorials and resources]: /en-us/develop/mobile/resources/
[Get started with Notification Hubs]: /en-us/manage/services/notification-hubs/getting-started-windows-dotnet/
[Send cross-platform notifications to users]: /en-us/manage/services/notification-hubs/notify-users-xplat-mobile-services/