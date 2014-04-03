<properties linkid="" urlDisplayName="" pageTitle="" metaKeywords="" description="" metaCanonical="" services="" documentationCenter="" title="Considerations for supporting multiple clients from a single mobile service" authors="krisragh" solutions="" manager="" editor="" />

# Considerations for supporting multiple clients from a single mobile service
 
One of the major benefits of using Azure Mobile Services to support mobile app development is the ability to use a single backend service that supports an app on multiple client platforms. Mobile Services provides native client libraries for all major device platforms. For more information, see [Tutorials and resources].

While Mobile Services makes it easy to migrate your native app across multiple client platforms using a single backend service, there are a few considerations that you will need to plan for. This topic provides guidance on how to get push notifications working across all your client platforms. It also decribes how to work around an issue with using client-directed single sign-on using Microsoft Account in both Windows Store and Windows Phone apps. Finally, this topic discusses some best practices for reusing code in Visual Studio projects.

## Push Notifications 
This section discusses two approaches for sending push notifications from your mobile service to client apps on multiple platforms.

### Leverage Notification Hubs

Azure Notification Hubs is an Azure service is a scalable solution for sending push notifications from your mobile service (or any backend) to client apps on all major device plaforms. For more information, see [Azure Notification Hubs]. 

Notification Hubs provide a consistent and unified infrastructure for creating and managing device registrations and for sending push notifications to devices running on all major device platforms. For more information, see [Get started with Notification Hubs]. Notification Hubs supports platform-specific template registrations, which enables you to use a single API call to send a notification to your app running on any registered platform. For more information, see [Send cross-platform notifications to users].

Notification Hubs is the recommended solution for sending notifications from your mobile service to mutiple client platforms.

### Use a common registration table and platform identifier 

If you choose not to use Notification Hubs, you can still support push notifications to multiple clients from your mobile service by defining a common device registration mechanism. Use a single table to store the device-specific information used by the push notification services of your supported platform. The **Get started with push notifications** tutorials ([Windows Store C#][Get started with push Windows dotnet]/[Windows Store JavaScript][Get started with push Windows js]/[Windows Phone][Get started with push Windows Phone]/[iOS][Get started with push iOS]/[Android][Get started with push Android]) use a **Registrations** table, and store the channel URI (Windows), device token (iOS), or handle (Android) in a column named _handle_. 

<div class="dev-callout"><b>Note</b>
	<p>When you use the Add Push Notification wizard in Visual Studio 2013 to add push notifications to a Windows Store app, the wizard automatically creates a table named <strong>Channel</strong> to store channel URIs. The tutorial <strong>Get started with push notifications in Visual Studio 2012</strong> (<a href="/en-us/develop/mobile/tutorials/get-started-with-push-dotnet-vs2012">Windows Store C#</a>/<a href="/en-us/develop/mobile/tutorials/get-started-with-push-js-vs2012">Windows Store JavaScript</a>) shows you how to enable push notifications using the <strong>Registrations</strong> table.</p>
</div>

To support multiple clients in this single registration table, include a _platform_ column in the table, where this field is set to the platform of the client inserting a row during registeration. For example, the following **Registrations** class definition, from a Windows Store C# or Windows Phone app, maps the client _ChannelUri_ field to the _handle_ column in the Registrations table: 
		
		public class Registrations
		{
			[JsonProperty(PropertyName = "platform")]			
			public string Platform { 
				get
				{
					return "windowsstore";
					// return "windowsphone";
				}
				set {}
			}
			
		    public string Id { get; set; }
		
			[JsonProperty(PropertyName = "handle")]
			public string ChannelUri { get; set; }
		}

Note that on this Windows device, the _Platform_ field always returns `windowsstore` (or `windowsphone`). With dynamic schema enabled (the default), Mobile Services adds a platform column in the Registrations table, if it doesn't already exist. For more information, see [Dynamic schema]. 

In your server-side script that sends notifications, use the platform field to determine which platform-specific function to call on the [push object].  The following script is a modification of the server script from the **Get started with push notifications** tutorials ([Windows Store C#][Get started with push Windows dotnet]/[Windows Store JavaScript][Get started with push Windows js]/[Windows Phone][Get started with push Windows Phone]/[iOS][Get started with push iOS]/[Android][Get started with push Android]) to enable multiple client platforms:

		function insert(item, user, request) {
		    request.execute({
		        success: function() {
		            request.respond();
		            sendNotifications();
		        }
		    });
		
		    function sendNotifications() {
		        var registrationsTable = tables.getTable('Registrations');
		        registrationsTable.read({
		            success: function(registrations) {
		                registrations.forEach(function(registration) {
		                    if (registration.platform === 'winstore') {
		                        push.wns.sendToastText04(registration.handle, {
		                            text1: item.text
		                        }, {
		                            success: pushCompleted
		                        });
		                    } else if (registration.platform === 'winphone') {
		                        push.mpns.sendFlipTile(registration.handle, {
		                            title: item.text
		                        }, {
		                            success: pushCompleted
		                        });
		                    } else if (registration.platform === 'ios') {
		                        push.apns.send(registration.handle, {
		                            alert: "Toast: " + item.text,
		                            payload: {
		                                inAppMessage: item.text
		                            }
		                        });
		                    } else if (registration.platform === 'android') {
		                        push.gcm.send(registration.handle, item.text, {
		                            success: pushCompleted
		                        });
		                    } else {
		                        console.error("Unknown push notification platform");
		                    }
		                });
		            }
		        });
		    }
		
		    function pushCompleted(pushResponse) {
		        console.log("Sent push:", pushResponse);
		    }
		}



## Windows App Registration

In order to use single sign-on client authentication using Microsoft Account in both Windows Store and Windows Phone apps, you must register the Windows Store app on the Windows Store dashboard first. This is because once you create a Live Connect registration for Windows Phone, you cannot create one for Windows Store. For more information about how to do this, please read the topic **Authenticate your Windows Store app with Live Connect single sign-on** ([Windows Store][SSO Windows Store]/[Windows Phone][SSO Windows Phone]).

## Best practices for reusing code in Visual Studio projects

Portable class libraries enable you to write and build managed assemblies that work on more than one platform, such as Windows Store and Windows Phone. You can create classes that contain code you wish to share across many projects, and then reference those classes from different types of projects. 

You can use the .NET Framework Portable Class Library to implement the Model-View-View Model (MVVM) pattern and share assemblies across multiple platforms. You can implement the model and view model classes in a Portable Class Library project in Visual Studio 2012, and then create views that are customized for different platforms. The model code, common across platforms, may (as an example) retrieve the data from a source such as an Azure Mobile Service in a platform-agnostic manner. The MSDN Library provides an <a href="http://msdn.microsoft.com/en-us/library/gg597391(v=vs.110)">overview and example</a>, discussion of <a href="http://msdn.microsoft.com/en-us/library/gg597392(v=vs.110)">API differences</a>, an example of <a href="http://msdn.microsoft.com/en-us/library/hh563947(v=vs.110)">using portable class libraries to implement the MVVM pattern</a>, additional <a href="http://msdn.microsoft.com/en-us/library/windowsphone/develop/jj714086(v=vs.105).aspx">prescriptive guidance</a>, and information about <a href="http://msdn.microsoft.com/en-us/library/hh871422(v=vs.110)">managing resources</a> in portable class library projects.

<!-- URLs -->

[Azure Notification Hubs]: /en-us/develop/net/how-to-guides/service-bus-notification-hubs/
[SSO Windows Store]: /en-us/develop/mobile/tutorials/single-sign-on-windows-8-dotnet/
[SSO Windows Phone]: /en-us/develop/mobile/tutorials/single-sign-on-wp8/
[Tutorials and resources]: /en-us/develop/mobile/resources/
[Get started with Notification Hubs]: /en-us/manage/services/notification-hubs/getting-started-windows-dotnet/
[Send cross-platform notifications to users]: /en-us/manage/services/notification-hubs/notify-users-xplat-mobile-services/
[Get started with push Windows dotnet]: /en-us/develop/mobile/tutorials/get-started-with-push-dotnet-vs2012/
[Get started with push Windows js]: /en-us/develop/mobile/tutorials/get-started-with-push-js-vs2012/
[Get started with push Windows Phone]: /en-us/develop/mobile/tutorials/get-started-with-push-wp8/
[Get started with push iOS]: /en-us/develop/mobile/tutorials/get-started-with-push-ios/
[Get started with push Android]: /en-us/develop/mobile/tutorials/get-started-with-push-android/
[Dynamic schema]: http://msdn.microsoft.com/en-us/library/windowsazure/jj193175.aspx
[push object]: http://msdn.microsoft.com/en-us/library/windowsazure/jj554217.aspx
