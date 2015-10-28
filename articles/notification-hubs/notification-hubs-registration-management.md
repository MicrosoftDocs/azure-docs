<properties
	pageTitle="Registration Management"
	description="This topic explains how to register devices with notification hubs in order to receive push notifications."
	services="notification-hubs"
	documentationCenter=".net"
	authors="wesmc7777"
	manager="dwrede"
	editor=""/>

<tags
	ms.service="notification-hubs"
	ms.workload="mobile"
	ms.tgt_pltfrm="mobile-multiple"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.date="10/26/2015"
	ms.author="wesmc"/>

# Registration management

##Overview

This topic explains how to register devices with notification hubs in order to receive push notifications. The topic describes registrations at a high level, then introduces the two main patterns for registering devices: registering from the device directly to the notification hub, and registering through the application backend. 


##What is device registration

A registration is a sub-entity of a notification hub, and associates the Platform Notification Service (PNS) handle for a device with tags and possibly a template. The PNS handle could be a ChannelURI, device token, or GCM registration id. Tags are used to route notifications to the correct set of device handles. For more information, see [Routing and Tag Expressions](notification-hubs-routing-tag-expressions.md). Templates are used to implement per-registration transformation. For more information, see [Templates](notification-hubs-templates.md).

It is important to note that registrations are transient. Similar to the PNS handles that they contain, registrations expire. You can set the time to live for a registration on the Notification Hub, up to a maximum of 90 days. This limit means that they must be periodically refreshed, and also that they should not be the only store for important information. This automatic expiration also simplifies cleanup when your mobile application is uninstalled.
she most recent PNS handle for each device/channel. Because PNS handles can only be obtained in a client app on the device, one pattern is to register directly on that device with the client app. On the other hand, security considerations and business logic related to tags might require you to manage the registration in the app back-end. The following section describes these two patterns.


##Registration IDs and installations

When using one of the patterns for registration, you will register with the notification hub using a registration ID or installation ID. It is recommended that you use an installation ID to register with your notification hub. This is the latest and best approach. However, this approach is currently only supported by the Notification Hub SDKs from the backend. To register from the client device using an installation ID, you would need to use [Notification Hubs REST API](https://msdn.microsoft.com/library/mt621153.aspx) at this time.



##Registration management from the device

When managing registrations from client apps, the backend is only responsible for sending notifications. Client apps keep PNS handles up to date, and register tags. The following picture illustrates this pattern.

![](./media/notification-hubs-registration-management/notification-hubs-registering-on-device.png)

The device first retrieves the PNS handle from the PNS, then registers with the notification hub directly. After the registration is successful, the app backend can send a notification targeting that registration. For more information about how to send notifications, see [Routing and Tag Expressions](notification-hubs-routing-tag-expressions.md).
Note that in this case, you will use only Listen rights to access your notification hubs from the device. For more information, see [Security](notification-hubs-security.md).

Registering from the device is the simplest method, but it has some drawbacks.
The first drawback is that a client app can only update its tags when the app is active. For example, if a user has two devices that register tags related to sport teams, when the first device registers for an additional tag (for example, Seahawks), the second device will not receive the notifications about the Seahawks until the app on the second device is executed a second time. More generally, when tags are affected by multiple devices, managing tags from the backend is a desirable option.
The second drawback of registration management from the client app is that, since apps can be hacked, securing the registration to specific tags requires extra care, as explained in the section “Tag-level security.”



The code to register your device using Notification Hubs API will use a registration id or an installation id. Installation id is the recommended way.


#### Example Code to register with a notification hub from a device using an installation id

The call to CreateOrUpdateInstallation is fully idempotent so you can retry it without any concerns about duplicate registrations.

This registration model makes it easy to do individual pushes - targeting specific device. We add a system tag *"$InstallationId:[installationId]"* automatically with each Installation based registration. So you can call a send to this tag to target a specific device without having to do any additional coding.

This registration model also enables you to do partial registration updates. The partial update of an installation is requested with a PATCH method using the [JSON-Patch standard](https://tools.ietf.org/html/rfc6902). This is particularly useful when you want to update tags on the registration. You don't have to pull down the entire registration and then resend all the previous tags again.


	// Initialize the Notification Hub
	NotificationHubClient hub = NotificationHubClient.CreateClientFromConnectionString(listenConnString, hubName);

	// The Device id from the PNS
    var pushChannel = await PushNotificationChannelManager.CreatePushNotificationChannelForApplicationAsync();

    // If you are creating the installation from the client itself, then store this Installation in device
	// storage. Then when the app starts, you can check if an InstallationId already exists or not before
	// creating.

    Installation installation;
	var settings = ApplicationData.Current.LocalSettings.Values;

	// If we have not stored a installation id in application data, create on in application data.
	if (!settings.ContainsKey("__NHInstallationId"))
	{
	    string installationId = Guid.NewGuid().ToString();
	    installation = new Installation();
	    installation.InstallationId = installationId; 
	    installation.Platform = NotificationPlatform.Wns;
	    installation.PushChannel = pushChannel;

		settings.Add("__NHInstallationId", installation);
	}

	installation = (Installation)settings["__NHInstallationId"];

    // Create or update the installation associated with this ChannelURI in the notification hub
    hub.CreateOrUpdateInstallation(installation);
    // ASYNC - hub.CreateOrUpdateInstallationAsync(installation);
    

#### Example code to register with a notification hub from a device using a registration id


These methods create or update a registration for the device on which they are called. This means that in order to update the handle or the tags, you must overwrite the entire registration. Remember that registrations are transient, so you should always have a reliable store with the current tags that a specific device needs.


	// Initialize the Notification Hub
	NotificationHubClient hub = NotificationHubClient.CreateClientFromConnectionString(listenConnString, hubName);

	// The Device id from the PNS
    var pushChannel = await PushNotificationChannelManager.CreatePushNotificationChannelForApplicationAsync();

    // If you are registering from the client itself, then store this registration id in device
	// storage. Then when the app starts, you can check if a registration id already exists or not before
	// creating.
	var settings = ApplicationData.Current.LocalSettings.Values;

	// If we have not stored a registration id in application data, store in application data.
	if (!settings.ContainsKey("__NHRegistrationId"))
	{
		// make sure there are no existing registrations for this push handle (used for iOS and Android)	
		string newRegistrationId = null;
		var registrations = await hub.GetRegistrationsByChannelAsync(pushChannel.Uri, 100);
		foreach (RegistrationDescription registration in registrations)
		{
			if (newRegistrationId == null)
			{
				newRegistrationId = registration.RegistrationId;
			}
			else
			{
				await hub.DeleteRegistrationAsync(registration);
			}
		}

		newRegistrationId = await hub.CreateRegistrationIdAsync();

        settings.Add("__NHRegistrationId", newRegistrationId);
	}
     
    string regId = (string)settings["__NHRegistrationId"];

    RegistrationDescription registration = new WindowsRegistrationDescription(pushChannel.Uri);
    registration.RegistrationId = regId;
    registration.Tags = new HashSet<string>(YourTags);

	try
	{
		await hub.CreateOrUpdateRegistrationAsync(registration);
	}
	catch (Microsoft.WindowsAzure.Messaging.RegistrationGoneException e)
	{
		// regId likely expired, delete from local storage and try again
		settings.Remove("__NHRegistrationId");
	}


## Registration management from a backend

Managing registrations from the backend requires writing additional code. The app from the device must provide the updated PNS handle to the backend every time the app starts (along with tags and templates), and the backend must update this handle on the notification hub. The following picture illustrates this design.

![](./media/notification-hubs-registration-management/notification-hubs-registering-on-backend.png)

The advantages of managing registrations from the backend are the ability to modify tags to registrations even when the corresponding app on the device is inactive, and to authenticate the client app before adding a tag to its registration.
From your app backend, you can perform basic CRUDS operations on registrations. For example:

	var hub = NotificationHubClient.CreateClientFromConnectionString("{connectionString}", "hubName");
            
	// create a registration description object of the correct type, e.g.
	var reg = new WindowsRegistrationDescription(channelUri, tags);

	// Create
	await hub.CreateRegistrationAsync(reg);

	// Get by id
	var r = await hub.GetRegistrationAsync<RegistrationDescription>("id");

	// update
	r.Tags.Add("myTag");

	// update on hub
	await hub.UpdateRegistrationAsync(r);

	// delete
	await hub.DeleteRegistrationAsync(r);


The backend must handle concurrency between registration updates. Service Bus offers optimistic concurrency control for registration management. At the HTTP level, this is implemented with the use of ETag on registration management operations. This feature is transparently used by Microsoft SDKs, which throw an exception if an update is rejected for concurrency reasons. The app backend is responsible for handling these exceptions and retrying the update if required.