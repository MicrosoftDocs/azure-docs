# Considerations for supporting multiple clients from a single mobile service #
 
This topic shows you how to use Live Connect single sign-on to authenticate users in Windows Azure Mobile Services, from a Windows Store app and a Windows Phone app at the same time. This topic also describes how to send push notifications across devices.

## App Registration ##
In order to use the same Live Connect project using Windows 8 and Windows Phone 8 (or iOS), you need only register the app on the Windows Store dashboard first. This is because once you create a Live Connect registration for Windows Phone, you may not create one for Windows Store. For more information about how to do this, please read the topic [Authenticate your Windows Store app with Live Connect single sign-on](http://www.windowsazure.com/en-us/develop/mobile/tutorials/single-sign-on-windows-8-dotnet/) and [Authenticate your Windows Phone 8 app with Live Connect single sign-on](http://www.windowsazure.com/en-us/develop/mobile/tutorials/single-sign-on-wp8/)

## Push Notifications ##
To support multiple clients for push, only a few changes are needed to the [previous push notification tutorial](http://www.windowsazure.com/en-us/develop/mobile/tutorials/push-notifications-to-users-dotnet/) on the client side. In the type definition for the channels table, add a field which indicates which platform the client is registering from:
		
		public class Channel
		{
			[JsonProperty(PropertyName = "platform")]			
			public string Platform { get; set; }
			
		    public int Id { get; set; }
		
			[JsonProperty(PropertyName = "uri")]
			public string Uri { get; set; }
		}

This way, when registering for a push channel, you know which push API to use. In a Windows Store app, the constructor could set this property to "winstore" (for example); in the Windows Phone app version, it could be set to "winphone"; and in the iOS version, it could be set to "ios." As long as dynamic schema is turned on (which it is by default although it is recommended that it be turned off before production), all you need to do is add a new property to the Channel class on the client as shown above. The new column will get automatically added by Mobile Services when the next insert occurs.

Next, on the server-side, add a script to handle the stored platform to send notifications to the correct client. The code below relies on parts of the "send" example from the [Get started with push notifications in Mobile Services on Windows Store](http://www.windowsazure.com/en-us/develop/mobile/tutorials/get-started-with-push-dotnet/) tutorial. See also [Get started with push notifications in Mobile Services on Windows Phone](http://www.windowsazure.com/en-us/develop/mobile/tutorials/get-started-with-push-wp8/) and [Get started with push notifications in Mobile Services on iOS](http://www.windowsazure.com/en-us/develop/mobile/tutorials/get-started-with-push-ios/) for more.

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
							push.wns.sendToast( "Text to push" , pushOptoins);					
						}
						else if (channel.platform === 'winphone') {
							push.mpns.sendToast( "Text to push" , pushOptoins);
						}					
						else if (channel.platform === 'ios') {						
							push.apns.sendToast( "Text to push" , pushOptoins);
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

## Best Practices for Reusing Code ##

Portable class libraries enable you to write and build managed assemblies that work on more than one platform, such as Windows Store and Windows Phone. You can create classes that contain code you wish to share across many projects, and then reference those classes from different types of projects. 

You can use the .NET Framework Portable Class Library to implement the Model-View-View Model (MVVM) pattern and share assemblies across multiple platforms. You can implement the model and view model classes in a Portable Class Library project in Visual Studio 2012, and then create views that are customized for different platforms. The model code, common across platforms, may (as an example) retrieve the data from a source such as a Windows Azure Mobile Service in a platform-agnostic manner. The MSDN Library provides an <a href="http://msdn.microsoft.com/en-us/library/gg597391(v=vs.110)">overview and example</a>, discussion of <a href="http://msdn.microsoft.com/en-us/library/gg597392(v=vs.110)">API differences</a>, an example of <a href="http://msdn.microsoft.com/en-us/library/hh563947(v=vs.110)">using portable class libraries to implement the MVVM pattern</a>, additional [prescriptive guidance](http://msdn.microsoft.com/en-us/library/windowsphone/develop/jj714086(v=vs.105).aspx), and and information about <a href="http://msdn.microsoft.com/en-us/library/hh871422(v=vs.110)">managing resources</a> in portable class library projects.


