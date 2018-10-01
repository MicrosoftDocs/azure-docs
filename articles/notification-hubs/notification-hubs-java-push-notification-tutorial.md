---
title: How to use Notification Hubs with Java
description: Learn how to use Azure Notification Hubs from a Java back-end.
services: notification-hubs
documentationcenter: ''
author: dimazaid
manager: kpiteira
editor: spelluru

ms.assetid: 4c3f966d-0158-4a48-b949-9fa3666cb7e4
ms.service: notification-hubs
ms.workload: mobile
ms.tgt_pltfrm: java
ms.devlang: java
ms.topic: article
ms.date: 04/14/2018
ms.author: dimazaid

---
# How to use Notification Hubs from Java
[!INCLUDE [notification-hubs-backend-how-to-selector](../../includes/notification-hubs-backend-how-to-selector.md)]

This topic describes the key features of the new fully supported official Azure Notification Hub Java SDK. 
This project is an open-source project and you can view the entire SDK code at [Java SDK]. 

In general, you can access all Notification Hubs features from a Java/PHP/Python/Ruby back-end using the Notification Hub REST interface as described in the MSDN topic [Notification Hubs REST APIs](http://msdn.microsoft.com/library/dn223264.aspx). This Java SDK provides a thin wrapper over these REST interfaces in Java. 

The SDK supports currently:

* CRUD on Notification Hubs 
* CRUD on Registrations
* Installation Management
* Import/Export Registrations
* Regular Sends
* Scheduled Sends
* Async operations via Java NIO
* Supported platforms: APNS (iOS), GCM (Android), WNS (Windows Store apps), MPNS(Windows Phone), ADM (Amazon Kindle Fire), Baidu (Android without Google services) 

## SDK Usage
### Compile and build
Use [Maven]

To build:

    mvn package

## Code
### Notification Hub CRUDs
**Create a NamespaceManager:**

    NamespaceManager namespaceManager = new NamespaceManager("connection string")

**Create Notification Hub:**

    NotificationHubDescription hub = new NotificationHubDescription("hubname");
    hub.setWindowsCredential(new WindowsCredential("sid","key"));
    hub = namespaceManager.createNotificationHub(hub);

 OR

    hub = new NotificationHub("connection string", "hubname");

**Get Notification Hub:**

    hub = namespaceManager.getNotificationHub("hubname");

**Update Notification Hub:**

    hub.setMpnsCredential(new MpnsCredential("mpnscert", "mpnskey"));
    hub = namespaceManager.updateNotificationHub(hub);

**Delete Notification Hub:**

    namespaceManager.deleteNotificationHub("hubname");

### Registration CRUDs
**Create a Notification Hub client:**

    hub = new NotificationHub("connection string", "hubname");

**Create Windows registration:**

    WindowsRegistration reg = new WindowsRegistration(new URI(CHANNELURI));
    reg.getTags().add("myTag");
    reg.getTags().add("myOtherTag");    
    hub.createRegistration(reg);

**Create iOS registration:**

    AppleRegistration reg = new AppleRegistration(DEVICETOKEN);
    reg.getTags().add("myTag");
    reg.getTags().add("myOtherTag");
    hub.createRegistration(reg);

Similarly you can create registrations for Android (GCM), Windows Phone (MPNS), and Kindle Fire (ADM).

**Create template registrations:**

    WindowsTemplateRegistration reg = new WindowsTemplateRegistration(new URI(CHANNELURI), WNSBODYTEMPLATE);
    reg.getHeaders().put("X-WNS-Type", "wns/toast");
    hub.createRegistration(reg);

**Create registrations using create registration ID + upsert pattern**

Removes duplicates due to any lost responses if storing registration IDs on the device:

    String id = hub.createRegistrationId();
    WindowsRegistration reg = new WindowsRegistration(id, new URI(CHANNELURI));
    hub.upsertRegistration(reg);

**Update registrations:**

    hub.updateRegistration(reg);

**Delete registrations:**

    hub.deleteRegistration(regid);

**Query registrations:**

* **Get single registration:**
  
        hub.getRegistration(regid);

* **Get all registrations in hub:**
  
        hub.getRegistrations();

* **Get registrations with tag:**
  
        hub.getRegistrationsByTag("myTag");

* **Get registrations by channel:**
  
        hub.getRegistrationsByChannel("devicetoken");


All collection queries support $top and continuation tokens.

### Installation API usage
Installation API is an alternative mechanism for registration management. Instead of maintaining multiple registrations, which are not trivial and may be easily done wrongly or inefficiently, it is now possible to use a SINGLE Installation object. 
Installation contains everything you need: push channel (device token), tags, templates, secondary tiles (for WNS and APNS). You don't need to call the service to get ID anymore - just generate GUID or any other identifier, keep it on device and send to your backend together with push channel (device token). 
On the backend, you should only do a single call: CreateOrUpdateInstallation, it is fully idempotent, so feel free to retry if needed.

As example for Amazon Kindle Fire:

    Installation installation = new Installation("installation-id", NotificationPlatform.Adm, "adm-push-channel");
    hub.createOrUpdateInstallation(installation);

If you want to update it: 

    installation.addTag("foo");
    installation.addTemplate("template1", new InstallationTemplate("{\"data\":{\"key1\":\"$(value1)\"}}","tag-for-template1"));
    installation.addTemplate("template2", new InstallationTemplate("{\"data\":{\"key2\":\"$(value2)\"}}","tag-for-template2"));
    hub.createOrUpdateInstallation(installation);

For advanced scenarios, use the partial update capability, which allows to modify only particular properties of the installation object. Partial update is subset of JSON Patch operations you can run against Installation object.

    PartialUpdateOperation addChannel = new PartialUpdateOperation(UpdateOperationType.Add, "/pushChannel", "adm-push-channel2");
    PartialUpdateOperation addTag = new PartialUpdateOperation(UpdateOperationType.Add, "/tags", "bar");
    PartialUpdateOperation replaceTemplate = new PartialUpdateOperation(UpdateOperationType.Replace, "/templates/template1", new InstallationTemplate("{\"data\":{\"key3\":\"$(value3)\"}}","tag-for-template1")).toJson());
    hub.patchInstallation("installation-id", addChannel, addTag, replaceTemplate);

Delete Installation:

    hub.deleteInstallation(installation.getInstallationId());

CreateOrUpdate, Patch, and Delete are eventually consistent with Get. Your requested operation just goes to the system queue during the call and is executed in background. Get is not designed for main runtime scenario but just for debug and troubleshooting purposes, it is tightly throttled by the service.

Send flow for Installations is the same as for Registrations. To target notification to the particular Installation - just use tag "InstallationId:{desired-id}". For this case, the code is:

    Notification n = Notification.createWindowsNotification("WNS body");
    hub.sendNotification(n, "InstallationId:{installation-id}");

For one of several templates:

    Map<String, String> prop =  new HashMap<String, String>();
    prop.put("value3", "some value");
    Notification n = Notification.createTemplateNotification(prop);
    hub.sendNotification(n, "InstallationId:{installation-id} && tag-for-template1");

### Schedule Notifications (available for STANDARD Tier)
The same as regular send but with one additional parameter - scheduledTime, which says when notification should be delivered. Service accepts any point of time between now + 5 minutes and now + 7 days.

**Schedule a Windows native notification:**

    Calendar c = Calendar.getInstance();
    c.add(Calendar.DATE, 1);    
    Notification n = Notification.createWindowsNotification("WNS body");
    hub.scheduleNotification(n, c.getTime());

### Import/Export (available for STANDARD Tier)
Sometimes it is required to perform bulk operation against registrations. Usually it is for integration with another system or just a massive fix to say update the tags. It is not recommended to use Get/Update flow if thousands of registrations are involved. Import/Export capability is designed to cover the scenario. Basically you provide an access to some blob container under your storage account as a source of incoming data and location for output.

**Submit export job:**

    NotificationHubJob job = new NotificationHubJob();
    job.setJobType(NotificationHubJobType.ExportRegistrations);
    job.setOutputContainerUri("container uri with SAS signature");
    job = hub.submitNotificationHubJob(job);


**Submit import job:**

    NotificationHubJob job = new NotificationHubJob();
    job.setJobType(NotificationHubJobType.ImportCreateRegistrations);
    job.setImportFileUri("input file uri with SAS signature");
    job.setOutputContainerUri("container uri with SAS signature");
    job = hub.submitNotificationHubJob(job);

**Wait until job is done:**

    while(true){
        Thread.sleep(1000);
        job = hub.getNotificationHubJob(job.getJobId());
        if(job.getJobStatus() == NotificationHubJobStatus.Completed)
            break;
    }       

**Get all jobs:**

    List<NotificationHubJob> jobs = hub.getAllNotificationHubJobs();

**URI with SAS signature:**
 This URL is the URL of some blob file or blob container plus set of parameters like permissions and expiration time plus signature of all these things made using account's SAS key. Azure Storage Java SDK has rich capabilities including creation of such kind of URIs. As simple alternative you can take a look at ImportExportE2E test class (from the github location) which has basic and compact implementation of signing algorithm.

### Send Notifications
The Notification object is simply a body with headers, some utility methods help in building the native and template notifications objects.

* **Windows Store and Windows Phone 8.1 (non-Silverlight)**
  
        String toast = "<toast><visual><binding template=\"ToastText01\"><text id=\"1\">Hello from Java!</text></binding></visual></toast>";
        Notification n = Notification.createWindowsNotification(toast);
        hub.sendNotification(n);
* **iOS**
  
        String alert = "{\"aps\":{\"alert\":\"Hello from Java!\"}}";
        Notification n = Notification.createAppleNotification(alert);
        hub.sendNotification(n);
* **Android**
  
        String message = "{\"data\":{\"msg\":\"Hello from Java!\"}}";
        Notification n = Notification.createGcmNotification(message);
        hub.sendNotification(n);
* **Windows Phone 8.0 and 8.1 Silverlight**
  
        String toast = "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
                    "<wp:Notification xmlns:wp=\"WPNotification\">" +
                       "<wp:Toast>" +
                            "<wp:Text1>Hello from Java!</wp:Text1>" +
                       "</wp:Toast> " +
                    "</wp:Notification>";
        Notification n = Notification.createMpnsNotification(toast);
        hub.sendNotification(n);
* **Kindle Fire**
  
        String message = "{\"data\":{\"msg\":\"Hello from Java!\"}}";
        Notification n = Notification.createAdmNotification(message);
        hub.sendNotification(n);
* **Send to Tags**
  
        Set<String> tags = new HashSet<String>();
        tags.add("boo");
        tags.add("foo");
        hub.sendNotification(n, tags);
* **Send to tag expression**       
  
        hub.sendNotification(n, "foo && ! bar");
* **Send template notification**
  
        Map<String, String> prop =  new HashMap<String, String>();
        prop.put("prop1", "v1");
        prop.put("prop2", "v2");
        Notification n = Notification.createTemplateNotification(prop);
        hub.sendNotification(n);

Running your Java code should now produce a notification appearing on your target device.

## <a name="next-steps"></a>Next Steps
This topic showed you how to create a simple Java REST client for Notification Hubs. From here you can:

* Download the full [Java SDK], which contains the entire SDK code. 
* Play with the samples:
  * [Get Started with Notification Hubs]
  * [Send breaking news]
  * [Send localized breaking news]
  * [Send notifications to authenticated users]
  * [Send cross-platform notifications to authenticated users]

[Java SDK]: https://github.com/Azure/azure-notificationhubs-java-backend
[Get started tutorial]: notification-hubs-ios-apple-push-notification-apns-get-started.md
[Get Started with Notification Hubs]: notification-hubs-windows-store-dotnet-get-started-wns-push-notification.md
[Send breaking news]: notification-hubs-windows-notification-dotnet-push-xplat-segmented-wns.md
[Send localized breaking news]: notification-hubs-windows-store-dotnet-xplat-localized-wns-push-notification.md
[Send notifications to authenticated users]: notification-hubs-aspnet-backend-windows-dotnet-wns-notification.md
[Send cross-platform notifications to authenticated users]: notification-hubs-aspnet-backend-windows-dotnet-wns-notification.md
[Maven]: http://maven.apache.org/

