---
title: Azure Notification Hubs and the Google Firebase Cloud Messaging (FCM) migration using REST API and the Azure portal
description: Describes how Azure Notification Hubs addresses the Google GCM to FCM migration using REST APIs.
author: sethmanheim
manager: femila
ms.service: notification-hubs
ms.topic: article
ms.date: 05/08/2024
ms.author: sethm
ms.reviewer: heathertian
ms.lastreviewed: 04/12/2024
---

# Google Firebase Cloud Messaging migration using REST API and the Azure portal

This article describes the core capabilities for the integration of Azure Notification Hubs with Firebase Cloud Messaging (FCM) v1. As a reminder, Google will stop supporting FCM legacy HTTP on June 20, 2024, so you must migrate your applications and notification payloads to the new format before then. All methods of onboarding will be ready for migration by March 1, 2024.

> [!IMPORTANT]
> As of June 2024, FCM legacy APIs will no longer be supported and will be retired. To avoid any disruption in your push notification service, you must [migrate to the FCM v1 protocol](notification-hubs-gcm-to-fcm.md) as soon as possible.

## Concepts for FCM v1

- A new platform type is supported, called **FCM v1**.
- New APIs, credentials, registrations, and installations are used for FCM v1.

> [!NOTE]
> The existing FCM platform is referred to as *FCM legacy* in this article.

## Migration steps

The Firebase Cloud Messaging (FCM) legacy API will be deprecated by July 2024. You can begin migrating from the legacy HTTP protocol to FCM v1 on March 1, 2024. You must complete the migration by June 2024. This section describes the steps to migrate from FCM legacy to FCM v1 using the Notification Hubs REST API.

## REST API

The following section describes how to perform the migration using the REST API.

### Step 1: Add FCM v1 credentials to hub

The first step is to add credentials via the Azure portal, a management-plane hub operation, or data-plane hub operation.

#### Create Google service account JSON file

1. In the [Firebase console](https://console.firebase.google.com/), select your project and go to **Project settings**.
1. Select the **Service accounts** tab, create a service account, and generate a private key from your Google service account.
1. Select **Generate new private key** to generate a JSON file. Download and open the file. Replace the values for `project_id`, `private_key`, and `client_email`, as these are required for Azure Notification Hubs hub credential updates.

   :::image type="content" source="media/firebase-migration-rest/firebase-project-settings.png" alt-text="Screenshot of Firebase console project settings." lightbox="media/firebase-migration-rest/firebase-project-settings.png":::

   OR

   If you want to create a service account with customized access permission, you can create a service account through the [IAM & Admin > Service Accounts page](https://console.cloud.google.com/iam-admin/serviceaccounts). Go to the page directly by clicking **Manage service account permissions**. You can create a service account that has one of the following roles:

    - Firebase Admin (roles/firebase.admin)
    - Firebase Grow Admin (roles/firebase.growthAdmin)
    - Firebase Admin SDK Administrator Service Agent (roles/firebase.sdkAdminServiceAgent)
    - Firebase SDK Provisioning Service Agent (roles/firebase.sdkProvisioningServiceAgent)

   :::image type="content" source="media/firebase-migration-rest/service-accounts.png" alt-text="Screenshot showing IAM service account settings." lightbox="media/firebase-migration-rest/service-accounts.png":::

#### Option 1: Update FcmV1 credentials via the Azure portal

Go to your notification hub on the Azure portal, and select **Settings > Google (FCM v1)**. Get the **Private Key**, **Project ID**, and **Client Email** values from the service account JSON file acquired from the previous section, and save them for later use.

:::image type="content" source="media/firebase-migration-rest/firebase-credentials.png" alt-text="Screenshot showing Azure portal Firebase credentials options." lightbox="media/firebase-migration-rest/firebase-credentials.png":::

#### Option 2: Update FcmV1 credentials via management plane hub operation

See the [description of a NotificationHub FcmV1Credential](/rest/api/notificationhubs/notification-hubs/create-or-update?view=rest-notificationhubs-2023-10-01-preview&tabs=HTTP#fcmv1credential).

- Use API version: 2023-10-01-preview
- **FcmV1CredentialProperties**:

  |     Name           |     Type      |
  |--------------------|---------------|
  |     `clientEmail`    |     string    |
  |     `privateKey`     |     string    |
  |     `projectId`      |     string    |

#### Option 3: Update FcmV1 credentials via data plane hub operation

See [Create a notification hub](/rest/api/notificationhubs/create-notification-hub) and [Update a notification hub](/rest/api/notificationhubs/update-notification-hub).

- Use API version: 2015-01
- Make sure to put **FcmV1Credential** after **GcmCredential**, as the order is important.

For example, the following is the request body:

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

For direct send scenarios, proceed directly to step 3. If you're using one of the Azure SDKs, see the [SDKs article](firebase-migration-sdk.md).

#### Option 1: Create FCM v1 registration or update GCM registration to FCM v1

If you have an existing GCM registration, update the registration to **FcmV1Registration**. See [Create or update a registration](/rest/api/notificationhubs/create-update-registration). If you don't have an existing **GcmRegistration**, create a new registration as **FcmV1Registration**. See [Create a registration](/rest/api/notificationhubs/create-registration). The registration request body should appear as in the following example:

```xml
// FcmV1Registration 
<?xml version="1.0" encoding="utf-8"?>
<entry xmlns="http://www.w3.org/2005/Atom">
    <content type="application/xml">
        <FcmV1RegistrationDescription xmlns:i="http://www.w3.org/2001/XMLSchema-instance"
            xmlns="http://schemas.microsoft.com/netservices/2010/10/servicebus/connect">
            <Tags>myTag, myOtherTag</Tags>
            <FcmV1RegistrationId>{deviceToken}</FcmV1RegistrationId>
        </FcmV1RegistrationDescription>
    </content>
</entry> 

// FcmV1TemplateRegistration 
<?xml version="1.0" encoding="utf-8"?>
<entry xmlns="http://www.w3.org/2005/Atom">
    <content type="application/xml">
        <FcmV1TemplateRegistrationDescription xmlns:i="http://www.w3.org/2001/XMLSchema-instance"
            xmlns="http://schemas.microsoft.com/netservices/2010/10/servicebus/connect">
            <Tags>myTag, myOtherTag</Tags>
            <FcmV1RegistrationId>{deviceToken}</FcmV1RegistrationId>
            <BodyTemplate><![CDATA[ {BodyTemplate}]]></BodyTemplate>
        </FcmV1TemplateRegistrationDescription>
    </content>
</entry>
```

#### Option 2: Create FCM c1 installation or update GCM installation to FCM v1

See [Create or overwrite an installation](/rest/api/notificationhubs/create-overwrite-installation) and set `platform` to `FCMV1`.

### Step 3: Send a push notification

#### Option 1: Debug send

Use this procedure to test notifications prior to option 2, 3, or 4. See [Notification Hubs - Debug Send](/rest/api/notificationhubs/notification-hubs/debug-send?view=rest-notificationhubs-2023-10-01-preview&tabs=HTTP).

> [!NOTE]
> Use API version: 2023-10-01-preview.

In the header:

|     Request header                   |     Value                             |
|--------------------------------------|---------------------------------------|
|     `Content-Type`                     |     `application/json;charset=utf-8`    |
|     `ServiceBusNotification-Format`    |     Set to `fcmV1` or `template`          |
|     `Servicebusnotification-Tags`      |     {single tag identifier}           |

Test a payload [with the following structure](https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages/send) via debug send. Note that FcmV1 introduces a significant change in the structuring of the JSON message payload:

1. The entire payload moved under a message object.
1. Android-specific options moved to the Android object and `time_to_live` is now `ttl` with a string value.
1. The `data` field now allows only a flat string-to-string mapping.
1. For more information, see [the FCM reference](https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages/send).

Alternatively, you can perform a test send (debug send) via the Azure portal:

:::image type="content" source="media/firebase-migration-rest/test-send.png" alt-text="Screenshot showing Azure portal test send page." lightbox="media/firebase-migration-rest/test-send.png":::

#### Option 2: Direct send

Perform a [direct send](/rest/api/notificationhubs/direct-send?view=rest-notificationhubs-2023-10-01-preview). In the request header, set `ServiceBusNotification-Format` to `fcmV1`.

#### Option 3: FcmV1 native notification (audience send)

Perform an FcmV1 native notification send. See [Send a Google Cloud Messaging (GCM) native notification](/rest/api/notificationhubs/send-gcm-native-notification?view=rest-notificationhubs-2023-10-01-preview). In the request header, set `ServiceBusNotification-Format` to `fcmV1`. For example, in the request body:

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

You can test template sends with a new request body following [the new JSON payload structure](https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages/send). No other changes need to be made. See [Send a template notification](/rest/api/notificationhubs/send-template-notification?view=rest-notificationhubs-2023-10-01-preview).

## Next steps

[Firebase Cloud Messaging migration using Azure SDKs](firebase-migration-sdk.md)
