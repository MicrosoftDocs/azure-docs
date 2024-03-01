---
title: include file
 description: include file
 services: notification-hubs
 author: sethmanheim
 ms.service: notification-hubs
 ms.topic: include
 ms.date: 02/26/2024
 ms.author: sethm
 ms.custom: include file
---

The core capabilities for the integration of Azure Notification Hubs with Firebase Cloud Messaging (FCM) v1 are ready for testing. As a reminder, Google will stop supporting FCM legacy HTTP on June 20, 2024, so you must migrate your applications and notification payloads to the new format before then. All methods of onboarding will be ready for migration by March 1, 2024.

To help with this transition, we invite you to join our preview program and test the FCM v1 onboarding process for REST APIs in February 2024. The preview gives you early access to the new features and capabilities, as well as the opportunity to provide feedback and report any issues.

If you are interested in joining the preview program, [contact us by email](mailto:NotificationSvcsPM@microsoft.com) by January 25, 2024. We will reply with instructions on how to onboard to FCM v1 using the Azure portal or the REST API. You will also receive a link to our documentation and support channels.

## Concepts for FCM v1

- A new platform type is supported, called **FCM v1**.
- New APIs, credentials, registrations, and installations are used for FCM v1.

> [!NOTE]
> The existing FCM platform is referred to as *FCM legacy* in this article.

## Migration steps (preview)

The Firebase Cloud Messaging (FCM) legacy API will be deprecated by July 2024. You can begin migrating from the legacy HTTP protocol to FCM v1 on March 1, 2024. You must complete the migration by June 2024. This section describes the steps to migrate from FCM legacy to FCM v1.

## REST API

The following section describes how to perform the migration using the REST API.

### Step 1: Add FCM v1 credentials to hub

The first step is to add credentials via the Azure portal, management-plane hub operation, or data-plane hub operation.

#### Create Google service account JSON file

1. In the [Firebase console](https://console.firebase.google.com/), select your project and go to **Project settings**.
1. Select the **Service accounts** tab, create a service account, and generate a private key from your Google service account.
1. Select **Generate new private key** to generate a JSON file. Download and open the file. Replace the values for `project_id`, `private_key`, and `client_email`, as these are required for Azure Notification Hubs hub credential updates.

   OR

   If you want to create a service account with customized access permission, you can create a service account through the [IAM & Admin > Service Accounts page](https://console.cloud.google.com/iam-admin/serviceaccounts). Go to the page directly by clicking **Manage service account permissions**. You can create a service account that has **Firebase cloud messaging admin access** and use it for your notification hub credential update.

#### Option 1: Update FcmV1 credentials via the Azure portal

Go to your notification hub on the Azure portal, and select **Settings > Google (FCM v1)**. Get the **Private Key**, **Project ID**, and **Client Email** values from the service account JSON file acquired from the previous section, and save them for later use.

#### Option 2: Update FcmV1 credentials via management plane hub operation

See the [description of a NotificationHub FcmV1Credential.](/rest/api/notificationhubs/notification-hubs/create-or-update?view=rest-notificationhubs-2023-10-01-preview&tabs=HTTP#fcmv1credential).

#### Option 3: Update FcmV1 credentials via data plane hub operation

See [Create a notification hub](/rest/api/notificationhubs/create-notification-hub) and [Update a notification hub](/rest/api/notificationhubs/update-notification-hub). Make sure to put **FcmV1Credential** after **GcmCredential**, as the order is important. For example:

```xml
<NotificationHubDescription xmlns:i='http://www.w3.org/2001/XMLSchema-instance' 
    xmlns='http://schemas.microsoft.com/netservices/2010/10/servicebus/connect'> 
    <ApnsCredential> 
        <Properties> 
            <Property> 
                <Name>Endpoint</Name> 
                <Value>{_apnsCredential.Endpoint}</Value> 
            </Property> 
            <Property> 
                <Name>AppId</Name> 
                <Value>{_apnsCredential.AppId}</Value> 
            </Property> 
            <Property> 
                <Name>AppName</Name> 
                <Value>{_apnsCredential.AppName}</Value> 
            </Property> 
            <Property> 
                <Name>KeyId</Name> 
                <Value>{_apnsCredential.KeyId}</Value> 
            </Property> 
            <Property> 
                <Name>Token</Name> 
                <Value>{_apnsCredential.Token}</Value> 
            </Property> 
        </Properties> 
    </ApnsCredential> 
    <WnsCredential> 
        <Properties> 
            <Property> 
                <Name>PackageSid</Name> 
                <Value>{_wnsCredential.PackageSid}</Value> 
            </Property> 
            <Property> 
                <Name>SecretKey</Name> 
                <Value>{_wnsCredential.SecretKey}</Value> 
            </Property> 
        </Properties> 
    </WnsCredential> 
    <GcmCredential> 
        <Properties> 
            <Property> 
                <Name>GoogleApiKey</Name> 
                <Value>{_gcmCredential.GoogleApiKey}</Value> 
            </Property> 
        </Properties> 
    </GcmCredential> 
    <FcmV1Credential> 
        <Properties> 
            <Property> 
                <Name>ProjectId</Name> 
                <Value>{_fcmV1Credential.ProjectId}</Value> 
            </Property> 
            <Property> 
                <Name>PrivateKey</Name> 
                <Value>{_fcmV1Credential.PrivateKey}</Value> 
            </Property> 
            <Property> 
                <Name>ClientEmail</Name> 
                <Value>{_fcmV1Credential.ClientEmail}</Value> 
            </Property> 
        </Properties> 
    </FcmV1Credential> 
</NotificationHubDescription>
```

### Step 2: Manage registration and installation

For direct send scenarios, proceed directly to step 3. If you're using the Android SDK, see the [Android SDK](#android-sdk) section.

#### Option 1: Create FCM v1 registration or update GCM registration to FCM v1

If you have an existing GCM registration, update the registration to **FcmV1Registration**. See [Create or update a registration](/rest/api/notificationhubs/create-update-registration). If you don't have an existing **GcmRegistration**, create a new registration as **FcmV1Registration**. See [Create a registration](/rest/api/notificationhubs/create-registration). The registration request body should appear as in the following example:

```xml
// FcmV1Registration 
<?xml version="1.0" encoding="utf-8"?> 
<entry xmlns="http://www.w3.org/2005/Atom"> 
    <content type="application/xml"> 
        <FcmV1RegistrationDescription xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.microsoft.com/netservices/2010/10/servicebus/connect"> 
   <Tags>myTag, myOtherTag</Tags> 
            <FcmV1RegistrationId>{deviceToken}</FcmV1RegistrationId> 
        </FcmV1RegistrationDescription> 
    </content> 
</entry> 

// FcmV1TemplateRegistration 
<?xml version="1.0" encoding="utf-8"?> 
<entry xmlns="http://www.w3.org/2005/Atom"> 
    <content type="application/xml"> 
        <FcmV1TemplateRegistrationDescription xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.microsoft.com/netservices/2010/10/servicebus/connect"> 
            <Tags>myTag, myOtherTag</Tags> 
            <FcmV1RegistrationId>{deviceToken}</FcmV1RegistrationId>  
            <BodyTemplate><![CDATA[ {BodyTemplate}]]></BodyTemplate> 
        </ FcmV1TemplateRegistrationDescription > 
    </content> 
</entry>
```

#### Option 2: Create FCM c1 installation or update GCM installation to FCM v1

See [Create or overwrite an installation](/rest/api/notificationhubs/create-overwrite-installation) and set `platform` to `FCMV1`.

### Step 3: Send a push notification

#### Option 1: Debug send

Use this procedure to test notifications prior to option 2, 3, or 4. See [Notification Hubs - Debug Send](/rest/api/notificationhubs/notification-hubs/debug-send?view=rest-notificationhubs-2023-09-01&tabs=HTTP).

> [!NOTE]
> Use API version: 2023-10-01-preview.

Test a payload [with the following structure](https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages/send) via debug send. Note that FcmV1 introduces a significant change in the structuring of the JSON message payload:

1. The entire payload moved under a message object.
1. Android-specific options moved to the Android object and `time_to_live` is now `ttl` with a string value.
1. The `data` field now allows only a flat string-to-string mapping.
1. For more information, see [the FCM reference](https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages/send).

#### Option 2: Direct send

Perform a [direct send](/rest/api/notificationhubs/direct-send?view=rest-notificationhubs-2023-09-01). In the request header, set `ServiceBusNotification-Format` to `fcmV1`.

#### Option 3: FcmV1 native notification (audience send)

Perform an FcmV1 native notification send. See [Send a Google Cloud Messaging (GCM) native notification](/rest/api/notificationhubs/send-gcm-native-notification?view=rest-notificationhubs-2023-09-01). In the request header, set `ServiceBusNotification-Format` to `fcmV1`. For example, in the request body:

```json
{ 
  "message": { 
    "notification": {  
        "title": "Breaking News",  
        "body": "FcmV1 is ready."  
        }, 
    "android": {  
        "data": {  
            "name": "wrench",  
            "mass": "1.3kg",  
            "count": "3"  
            }  
        } 
    } 
}
```

#### Option 4: template notification

You can test template sends with a new request body following [the new JSON payload structure](https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages/send). No other changes need to be made. See [Send a template notification](/rest/api/notificationhubs/send-template-notification?view=rest-notificationhubs-2023-09-01).

## SDKs

### Android SDK

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
