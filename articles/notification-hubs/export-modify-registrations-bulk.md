---
title: Export and import Azure Notification Hubs registrations in bulk | Microsoft Docs
description: Learn how to use Notification Hubs bulk support to perform a large number of operations on a notification hub, or to export all registrations.
services: notification-hubs
author: sethmanheim
manager: femila

ms.service: notification-hubs
ms.workload: mobile
ms.tgt_pltfrm: 
ms.devlang: 
ms.topic: article
ms.date: 08/04/2020
ms.author: sethm
ms.reviewer: thsomasu
ms.lastreviewed: 03/18/2019
ms.custom: devx-track-csharp
---

# Export and import Azure Notification Hubs registrations in bulk

There are scenarios in which it is required to create or modify large numbers of registrations in a notification hub. Some of these scenarios are tag updates following batch computations, or migrating an existing push implementation to use Azure Notification Hubs.

This article explains how to perform a large number of operations on a notification hub, or to export all registrations, in bulk.

> **_NOTE:_** Bulk import/export is only available for the 'standard' pricing tier

## High-level flow

Batch support is designed to support long-running jobs involving millions of registrations. To achieve this scale, batch support uses Azure Storage to store job details and output. For bulk update operations, the user is required to create a file in a blob container, whose content is the list of registration update operations. When starting the job, the user provides a URL to the input blob, along with a URL to an output directory (also in a blob container). After the job has started, the user can check the status by querying a URL location provided at starting of the job. A specific job can only perform operations of a specific kind (creates, updates, or deletes). Export operations are performed analogously.

## Import

### Set up

This section assumes you have the following entities:

- A provisioned notification hub.
- An Azure Storage blob container.
- References to the [Azure Storage NuGet package](https://www.nuget.org/packages/Azure.Storage.Blobs) and [Notification Hubs NuGet package](https://www.nuget.org/packages/Microsoft.Azure.NotificationHubs/).

### Create input file and store it in a blob

An input file contains a list of registrations serialized in XML, one per row. Using the Azure SDK, the following code example shows how to serialize the registrations and upload them to blob container:

```csharp
private static void SerializeToBlob(BlobContainerClient container, RegistrationDescription[] descriptions)
{
     StringBuilder builder = new StringBuilder();
     foreach (var registrationDescription in descriptions)
     {
          builder.AppendLine(registrationDescription.Serialize());
     }

     var inputBlob = container.GetBlobClient(INPUT_FILE_NAME);
     using (MemoryStream stream = new MemoryStream(Encoding.UTF8.GetBytes(builder.ToString())))
     {
         inputBlob.UploadAsync(stream);
     }
}
```

> [!IMPORTANT]
> The preceding code serializes the registrations in memory and then uploads the entire stream into a blob. If you have uploaded a file of more than just a few megabytes, see the Azure blob guidance on how to perform these steps; for example, [block blobs](/rest/api/storageservices/Understanding-Block-Blobs--Append-Blobs--and-Page-Blobs).

### Create URL tokens

Once your input file is uploaded, generate the URLs to provide to your notification hub for both the input file and the output directory. You can use two different blob containers for input and output.

```csharp
static Uri GetOutputDirectoryUrl(BlobContainerClient container)
{
      Console.WriteLine(container.CanGenerateSasUri);
      BlobSasBuilder builder = new BlobSasBuilder(BlobSasPermissions.All, DateTime.UtcNow.AddDays(1));
      return container.GenerateSasUri(builder);
}
        
        
        

static Uri GetInputFileUrl(BlobContainerClient container, string filePath)
{
      Console.WriteLine(container.CanGenerateSasUri);
      BlobSasBuilder builder = new BlobSasBuilder(BlobSasPermissions.Read, DateTime.UtcNow.AddDays(1));
      return container.GenerateSasUri(builder);

}
```

### Submit the job

With the two input and output URLs, you can now start the batch job.

```csharp
NotificationHubClient client = NotificationHubClient.CreateClientFromConnectionString(CONNECTION_STRING, HUB_NAME);
var createTask = client.SubmitNotificationHubJobAsync(
new NotificationHubJob {
        JobType = NotificationHubJobType.ImportCreateRegistrations,
        OutputContainerUri = outputContainerSasUri,
        ImportFileUri = inputFileSasUri
    }
);
createTask.Wait();

var job = createTask.Result;
long i = 10;
while (i > 0 && job.Status != NotificationHubJobStatus.Completed)
{
    var getJobTask = client.GetNotificationHubJobAsync(job.JobId);
    getJobTask.Wait();
    job = getJobTask.Result;
    Thread.Sleep(1000);
    i--;
}
```

In addition to the input and output URLs, this example creates a `NotificationHubJob` object that contains a `JobType` object, which can be one of the following types:

- `ImportCreateRegistrations`
- `ImportUpdateRegistrations`
- `ImportDeleteRegistrations`

Once the call is completed, the job is continued by the notification hub, and you can check its status with the call to [GetNotificationHubJobAsync](/dotnet/api/microsoft.azure.notificationhubs.notificationhubclient.getnotificationhubjobasync).

At the completion of the job, you can inspect the results by looking at the following files in your output directory:

- `/<hub>/<jobid>/Failed.txt`
- `/<hub>/<jobid>/Output.txt`

These files contain the list of successful and failed operations from your batch. The file format is `.cvs`, in which each row has the line number of the original input file, and the output of the operation (usually the created or updated registration description).

### Full sample code

The following sample code imports registrations into a notification hub.

```csharp
using Microsoft.Azure.NotificationHubs;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Xml;

namespace ConsoleApplication1
{
    class Program
    {
        private static string CONNECTION_STRING = "namespace"; 
        private static string HUB_NAME = "demohub";
        private static string INPUT_FILE_NAME = "CreateFile.txt";
        private static string STORAGE_ACCOUNT_CONNECTIONSTRING = "connectionstring";
        private static string CONTAINER_NAME = "containername";

        static void Main(string[] args)
        {
            var descriptions = new[]
            {
                new MpnsRegistrationDescription(@"http://dm2.notify.live.net/throttledthirdparty/01.00/12G9Ed13dLb5RbCii5fWzpFpAgAAAAADAQAAAAQUZm52OkJCMjg1QTg1QkZDMkUxREQFBlVTTkMwMQ"),
                new MpnsRegistrationDescription(@"http://dm2.notify.live.net/throttledthirdparty/01.00/12G9Ed13dLb5RbCii5fWzpFpAgAAAAADAQAAAAQUZm52OkJCMjg1QTg1QkZDMjUxREQFBlVTTkMwMQ"),
                new MpnsRegistrationDescription(@"http://dm2.notify.live.net/throttledthirdparty/01.00/12G9Ed13dLb5RbCii5fWzpFpAgAAAAADAQAAAAQUZm52OkJCMjg1QTg1QkZDMhUxREQFBlVTTkMwMQ"),
                new MpnsRegistrationDescription(@"http://dm2.notify.live.net/throttledthirdparty/01.00/12G9Ed13dLb5RbCii5fWzpFpAgAAAAADAQAAAAQUZm52OkJCMjg1QTg1QkZDMdUxREQFBlVTTkMwMQ"),
            };

// Get a reference to a container named "sample-container" and then create it
            BlobContainerClient container = new BlobContainerClient(STORAGE_ACCOUNT_CONNECTIONSTRING, CONTAINER_NAME);

            container.CreateIfNotExistsAsync();

            SerializeToBlob(container, descriptions);

            // TODO then create Sas
            var outputContainerSasUri = GetOutputDirectoryUrl(container);
            
            BlobContainerClient inputfilecontainer = new BlobContainerClient(STORAGE_ACCOUNT_CONNECTIONSTRING, STORAGE_ACCOUNT_CONNECTIONSTRING + "/" +         INPUT_FILE_NAME);

            var inputFileSasUri = GetInputFileUrl(inputcontainer, INPUT_FILE_NAME);


            // Import this file
            NotificationHubClient client = NotificationHubClient.CreateClientFromConnectionString(CONNECTION_STRING, HUB_NAME);
            var createTask = client.SubmitNotificationHubJobAsync(
                new NotificationHubJob {
                    JobType = NotificationHubJobType.ImportCreateRegistrations,
                    OutputContainerUri = outputContainerSasUri,
                    ImportFileUri = inputFileSasUri
                }
            );
            createTask.Wait();

            var job = createTask.Result;
            long i = 10;
            while (i > 0 && job.Status != NotificationHubJobStatus.Completed)
            {
                var getJobTask = client.GetNotificationHubJobAsync(job.JobId);
                getJobTask.Wait();
                job = getJobTask.Result;
                Thread.Sleep(1000);
                i--;
            }
        }

        private static void SerializeToBlob(BlobContainerClient container, RegistrationDescription[] descriptions)
        {
            StringBuilder builder = new StringBuilder();
            foreach (var registrationDescription in descriptions)
            {
                builder.AppendLine(registrationDescription.Serialize());
            }

            var inputBlob = container.GetBlobClient(INPUT_FILE_NAME);
            using (MemoryStream stream = new MemoryStream(Encoding.UTF8.GetBytes(builder.ToString())))
            {
                inputBlob.UploadAsync(stream);
            }
        }

        static Uri GetOutputDirectoryUrl(BlobContainerClient container)
        {
            Console.WriteLine(container.CanGenerateSasUri);
            BlobSasBuilder builder = new BlobSasBuilder(BlobSasPermissions.All, DateTime.UtcNow.AddDays(1));
            return container.GenerateSasUri(builder);
        }

        static Uri GetInputFileUrl(BlobContainerClient container, string filePath)
        {
            Console.WriteLine(container.CanGenerateSasUri);
            BlobSasBuilder builder = new BlobSasBuilder(BlobSasPermissions.Read, DateTime.UtcNow.AddDays(1));
            return container.GenerateSasUri(builder);

        }
    }
}
```

## Export

Exporting registration is similar to the import, with the following differences:

- You only need the output URL.
- You create a NotificationHubJob of type ExportRegistrations.

### Sample code snippet

The following is a sample code snippet for exporting registrations in Java:

```java
// Submit an export job
NotificationHubJob job = new NotificationHubJob();
job.setJobType(NotificationHubJobType.ExportRegistrations);
job.setOutputContainerUri("container uri with SAS signature");
job = hub.submitNotificationHubJob(job);

// Wait until the job is done
while(true){
    Thread.sleep(1000);
    job = hub.getNotificationHubJob(job.getJobId());
    if(job.getJobStatus() == NotificationHubJobStatus.Completed)
        break;
}

```

## Next steps

To learn more about registrations, see the following articles:

- [Registration management](notification-hubs-push-notification-registration-management.md)
- [Tags for registrations](notification-hubs-tags-segment-push-message.md)
- [Template registrations](notification-hubs-templates-cross-platform-push-messages.md)
