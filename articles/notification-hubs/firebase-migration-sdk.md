---
title: Azure Notification Hubs and the Google Firebase Cloud Messaging (FCM) migration using SDKs
description: Describes how Azure Notification Hubs addresses the Google GCM to FCM migration using the Azure SDKs.
author: sethmanheim
manager: femila
ms.service: notification-hubs
ms.topic: article
ms.date: 03/01/2024
ms.author: sethm
ms.reviewer: heathertian
ms.lastreviewed: 03/01/2024
---

# Azure Notification Hubs and Google Firebase Cloud Messaging migration using Azure SDKs

The Firebase Cloud Messaging (FCM) legacy API will be deprecated by July 2024. You can begin migrating from the legacy HTTP protocol to FCM v1 on March 1, 2024. You must complete the migration by June 2024. This section describes the steps to migrate from FCM legacy to FCM v1 using the Azure SDKs.

## Prerequisites

[Follow step 1 in the REST API guide](firebase-migration-rest.md#step-1-add-fcm-v1-credentials-to-hub) to update your FCM credentials.

## Android SDK

1. Update the SDK version to `2.0.0-preview` in the **build.gradle** file of your application. For example:

   ```gradle
   // This is not a complete build.gradle file; it only highlights the portions you need to update. 

   dependencies { 
       // Ensure the following line is updated in your app/library's "dependencies" section.
   implementation 'com.microsoft.azure:notification-hubs-android-sdk:2.0.0-preview' 
       // optionally, use the fcm optimized SKU instead: 
       // implementation 'com.microsoft.azure:notification-hubs-android-sdk-fcm:2.0.0-preview' 
   }
   ```

1. Update the payload template. If you're not using templates, you can skip this step.

   See the [FCM REST reference](https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages) for the FCM v1 payload structure. For information about migrating from the FCM legacy payload to the FCM v1 payload, see [Update the payload of send requests](https://firebase.google.com/docs/cloud-messaging/migrate-v1#update-the-payload-of-send-requests).

   For example, if you're using registrations:

   ```csharp
   NotificationHub hub = new NotificationHub(BuildConfig.hubName, BuildConfig.hubListenConnectionString, context);
   String template = "{\"message\":{\"android\":{\"data\":{\"message\":\"{'Notification Hub test notification: ' + $(myTextProp)}\"}}}}";
   hub.registerTemplate(token, "template-name", template);
   ```

   If you're using installations:

   ```csharp
   InstallationTemplate testTemplate = new InstallationTemplate(); 
   testTemplate.setBody("{\"message\":{\"android\":{\"data\":{\"message\":\"{'Notification Hub test notification: ' + $(myTextProp)}\"}}}}");  
   NotificationHub.setTemplate("testTemplate", testTemplate);
   ```

### Server SDKs (Data Plane)

1. Update the SDK package to the preview version (4.2.0-beta1). The general availability release is not yet available.

   For example, in the **.csproj** file:

   ```xml
   <PackageReference Include="Microsoft.Azure.NotificationHubs" Version="4.2.0-beta1" />
   ```

1. Add the `FcmV1Credential` to the notification hub. This is a one-time setup. Unless you have a lot of hubs, and want to automate this step, you can use the REST API, or the Azure portal, to add the FCM v1 credentials.

   ```csharp
   // Create new notification hub with FCM v1 credentials
   var hub = new NotificationHubDescription("hubname"); 
   hub.FcmV1Credential = new FcmV1Credential("private-key", "project-id", "client-email"); 
   hub = await namespaceManager.CreateNotificationHubAsync(hub); 

   // Update existing notification hub with FCM v1 credentials 
   var hub = await namespaceManager.GetNotificationHubAsync("hubname", CancellationToken.None); 
   hub.FcmV1Credential = new FcmV1Credential("private-key", "project-id", "client-email"); 
   hub = await namespaceManager.UpdateNotificationHubAsync(hub, CancellationToken.None);
   ```

   ```java
   // Create new notification hub with FCM V1 credentials
   NamespaceManager namespaceManager = new NamespaceManager(namespaceConnectionString);
   NotificationHubDescription hub = new NotificationHubDescription("hubname");
   hub.setFcmV1Credential(new FcmV1Credential("private-key", "project-id", "client-email"));
   hub = namespaceManager.createNotificationHub(hub);

   // Updating existing Notification Hub with FCM V1 Credentials
   NotificationHubDescription hub = namespaceManager.getNotificationHub("hubname");
   hub.setFcmV1Credential(new FcmV1Credential("private-key", "project-id", "client-email"));
   hub = namespaceManager.updateNotificationHub(hub);
   ```

1. Manage registrations and installations. For registrations, use `FcmV1RegistrationDescription` to register FCM v1 devices. For example:

   ```csharp
   // Create new Registration
   var deviceToken = "device-token"; 
   var tags = new HashSet<string> { "tag1", "tag2" }; 
   FcmV1RegistrationDescription registration = await hub. CreateFcmV1NativeRegistrationAsync(deviceToken, tags);
   ```

   For installations, use `NotificationPlatform.FcmV1` as the platform with `Installation`, or use `FcmV1Installation` to create FCM v1 installations:

   ```csharp
   // Create new installation
   var installation = new Installation 
   { 
       InstallationId = "installation-id", 
       PushChannel = "device-token", 
       Platform = NotificationPlatform.FcmV1 
   }; 
   await hubClient.CreateOrUpdateInstallationAsync(installation); 

   // Alternatively, you can use the FcmV1Installation class directly 
   var installation = new FcmV1Installation("installation-id", "device-token"); 
   await hubClient.CreateOrUpdateInstallationAsync(installation);
   ```

   Note the following considerations:

   - If the client app registers itself, then you must update the client app first, to register under the FCM v1 platform.
   - If the client app doesn't register itself, you can retrieve all registrations/installations and migrate them all to FCM v1 on the server.

1. Send the notification to FCM v1. Use `FcmV1Notification` when you send notifications that target FCM v1. For example:

   ```csharp
   // Send FCM v1 notification
   var jsonBody = "{\"message\":{\"android\":{\"data\":{\"message\":\"Notification Hub test notification\"}}}}"; 
   var n = new FcmV1Notification(jsonBody); 
   NotificationOutcome outcome = await hub.SendNotificationAsync(n, "tag");
   ```
