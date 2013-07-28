<properties linkid="" urlDisplayName="Notify Users" pageTitle="Notify cross-platform users of your ASP.NET service with Notification Hubs" metaKeywords="" writer="glenga" metaDescription="Follow this tutorial to register to receive notifications from your ASP.NET service by using Notification Hubs" metaCanonical="" disqusComments="1" umbracoNaviHide="1" />

<div chunk="../chunks/notification-hubs-left-nav.md" />

# Use Notification Hubs to send cross-platform notifications to users

<div class="dev-center-tutorial-selector sublanding">
    <a href="/en-us/manage/services/notification-hubs/notify-users-cross-platform-mobile-services" title="Mobile Services">Mobile Services</a>
    <a href="/en-us/manage/services/notification-hubs/notify-users-cross-platform-aspnet" title="ASP.NET" class="current">ASP.NET</a>
</div> 

In the Notifications Hubs push to users topic you learned how to register authenticated users to tags and push notifications to all devices of a specific user. If you have multiple client apps, though, you end up having to send multiple versions of the notification payload even if only one is required. In this topic we will show how you can take advantage of the template feature to send a single platform-agnostic notification that will target all platforms.

At a high level, templates are a way to specify how a specific device wants to receive a notification. The template specifies the exact payload format by referring to properties that are part of the message sent by your app back-end. In our case, we will send a platform-agnostic message containing just the text of the notification we want to push:

		{
			"message": "Hello!"
		}

Note that you can use multiple properties if you want to send other information like badges, images, sounds, and so forth.

Then we will make sure that when a device registers, our back-end registers a template that specifies the correct platform payload that we want to send. For instance, a Windows Store app that wants to receive a simple toast message will register for the following template:

		<toast>
		  <visual>
		    <binding template=\"ToastText01\">
		      <text id=\"1\">$(message)</text>
		    </binding>
		  </visual>
		</toast>

While an iOS app will register the following:

		{
			aps:{
				alert: "$(News_French)"
			}
		}

Note that the templates do not have to refer to all the properties in the message, and can specify any payload supported by the underlying notification platform.

Templates are a very powerful feature you can learn more about template in our [Notification Hub Guidance] article. A reference for the template expression language is in our [Notification Hub How to for Windows Store].

We will now modify the Notify User app that you created in the topic [How to use Notification Hubs to push notifications to users] to send cross-platform notifications using templates.

## .NET back-end

Since your client apps are already providing you the information regarding their platform, you only have to modify your registration api.
In your Register controller:

1. Modify the portion that creates the registration in the following way:

		if (!updated)
        {
            switch (platform)
            {
                case "windows":
                    var template = @"<toast><visual><binding template=""ToastText01""><text id=""1"">$(message)</text></binding></visual></toast>";
                    await hubClient.CreateWindowsTemplateRegistrationAsync(channelUri, template, new string[] { instId, userTag });
                    break;
                case "ios":
                    template = "{\"aps\":{\"alert\":\"$(message)\"}, \"inAppMessage\":\"$(message)\"}";
                    await hubClient.CreateAppleTemplateRegistrationAsync(deviceToken, template, new string[] { instId, userTag });
                    break;
            } 
        }
	
	Note how you are creating *template* registrations, instead of *native* registrations. Also, we do not have to modify the update portion of the code because template registrations are derived from native registrations.

Then change the portion of the code that sends a notification to the user with the following:

		var notification = new Dictionary<string, string> {{"message", "Hello, "+userTag}};
        await hubClient.SendTemplateNotificationAsync(notification, userTag);

	Note how, when sending a notification, we are not specifying a native payload. Also, by sending a template notification, we are targeting all platforms at the same time, as your Notification Hub will build and deliver the correct payload to every device with userTag (as specified by their templates).

Something to keep in mind when using templates is that if a device registers multiple templates with the same tag, an incoming message targeting that tag will result in multiple notifications delivered to the device (one for each template). This behavior is useful when the same logical message has to result in multiple visual notifications, for instance showing both a badge and a toast in a Windows Store application.

## Mobile Service back-end

	same edits

## Next Steps

For more information on how to use templates you can refer to the topic [Use Notification Hubs to send localized breaking news] and also on the [Notification Hub Guidance] article. A reference for the template expression language is in our [Notification Hub How to for Windows Store].