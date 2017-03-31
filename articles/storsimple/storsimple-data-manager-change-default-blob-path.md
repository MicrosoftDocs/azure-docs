---
title: Change blob path from the default | Microsoft Docs
description: Learn how to set up Azure Function to rename a Blob file path (private preview)
services: storsimple
documentationcenter: NA
author: vidarmsft
manager: syadav
editor: ''

ms.assetid:
ms.service: storsimple
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: TBD
ms.date: 03/16/2017
ms.author: vidarmsft
---

# Change blob path from the default (Private Preview)

This article describes how to set up an Azure function to rename a default Blob file path. 

## Prerequisites

Before you begin, ensure that you have:
* A job definition that has been correctly configured in a Hybrid Data Resource within a resource group.

## Create an Azure function

Perform the following steps to create an Azure function.

#### To create an Azure Function

1. Go to [Azure portal](http://portal.azure.com/).

2. Click **+ New** from top left corner. Type "Function app" in **Search** text box and press **Enter**.

    ![Go to Function app resource](./media/storsimple-data-manager-change-default-blob-path/goto-function-app-resource.png)

3. Click **Function App** from the results.

    ![Select Function app resource](./media/storsimple-data-manager-change-default-blob-path/select-function-app-resource.png)

4. Open **Function app** window and click **Create**.

    ![Create new function app](./media/storsimple-data-manager-change-default-blob-path/create-new-function-app.png)

5. In the **Configuration** blade, enter all the inputs and click **Create**.

    1. App name
    2. Subscription
    3. Resource group
    4. Hosting plan - **Consumption plan**
    5. Location
    6. Storage account - Use an existing storage account or create a new storage account. A storage account is used internally for the function.

        ![Enter new Function app config data](./media/storsimple-data-manager-change-default-blob-path/enter-new-funcion-app-data.png)

6. After the function app  is created, navigate to **More services >** from bottom left. Type "App Services" in the **Filter** textbox and click **App Services**.

    ![More services >](./media/storsimple-data-manager-change-default-blob-path/more-services.png)

7. Click **Function app name** from the list of App services.

8. Click **+ New Function**. Select **C#** from **Language** dropdown. Select **QueueTrigger-CSharp** option from list of templates. Enter all inputs.

   1. Name - Supply a name for your function.
   2. Queue name - Enter your **Data Transformation Job Definition name**.
   3. Storage account connection - Click **new** option. Select the account corresponding to Data Transformation job.
      
      Make a note of the `Connection name`. This name is required later in the Azure function.

   4. Click **Create** button.

       ![Create new C Sharp function >](./media/storsimple-data-manager-change-default-blob-path/create-new-csharp-function.png)

9. In the **Function** window, run _.csx_ file. Copy and paste the following code:

    ```
        using System;
        using System.Configuration;
        using Microsoft.WindowsAzure.Storage.Blob;
        using Microsoft.WindowsAzure.Storage.Queue;
        using Microsoft.WindowsAzure.Storage;
        using System.Collections.Generic;
        using System.Linq;

        public static void Run(QueueItem myQueueItem, TraceWriter log)
        {
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(ConfigurationManager.AppSettings["STORAGE_CONNECTIONNAME"]);

            string storageAccUriEndswith = "windows.net/";
            string uri = myQueueItem.TargetLocation.Replace("%20", " ");
            log.Info($"Blob Uri: {uri}");

            // Remove storage account uri string
            uri = uri.Substring(uri.IndexOf(storageAccUriEndswith) + storageAccUriEndswith.Length);

            string containerName = uri.Substring(0, uri.IndexOf("/")); 

            // Remove container name string
            uri = uri.Substring(containerName.Length + 1);

            // Current blob path
            string blobName = uri; 

            string volumeName = uri.Substring(containerName.Length + 1);
            volumeName = uri.Substring(0, uri.IndexOf("/"));

            // Remove volume name string
            uri = uri.Substring(volumeName.Length + 1);

            string newContainerName = uri.Substring(0, uri.IndexOf("/")).ToLower();
            string newBlobName = uri.Substring(newContainerName.Length + 1);

            log.Info($"Container name: {containerName}");
            log.Info($"Volume name: {volumeName}");
            log.Info($"New container name: {newContainerName}");

            log.Info($"Blob name: {blobName}");
            log.Info($"New blob name: {newBlobName}");

            // Create the blob client.
            CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

            // Container reference
            CloudBlobContainer container = blobClient.GetContainerReference(containerName);
            CloudBlobContainer newContainer = blobClient.GetContainerReference(newContainerName);
            newContainer.CreateIfNotExists();

            if(!container.Exists())
            {
                log.Info($"Container - {containerName} not exists");
                return;
            }

            if(!newContainer.Exists())
            {
               log.Info($"Container - {newContainerName} not exists");
               return;
            }

            CloudBlockBlob blob = container.GetBlockBlobReference(blobName);
            if (!blob.Exists())
            {
                // Skip to copy the blob to new container, if source blob doesn't exist
                log.Info($"The specified blob does not exist.");
                log.Info($"Blob Uri: {blob.Uri}");
                return;
            }

            CloudBlockBlob blobCopy = newContainer.GetBlockBlobReference(newBlobName);
            if (!blobCopy.Exists())
            {
                blobCopy.StartCopy(blob);
                // Delete old blob, after copy to new container
                blob.DeleteIfExists();
                log.Info($"Blob file path renamed completed successfully");
            }
            else
            {
                log.Info($"Blob file path renamed already done");
                // Delete old blob, if already exists.
                blob.DeleteIfExists();
            }
        }

        public class QueueItem
        {
            public string SourceLocation {get;set;}
            public long SizeInBytes {get;set;}
            public string Status {get;set;}
            public string JobID {get;set;}
            public string TargetLocation {get; set;}
        }
    
    ```

   1. Replace exact **STORAGE_CONNECTIONNAME** in line 11 with your storage account Connection (Refer point 8c).
   2. Click **Save** button from top left.

       ![Save function >](./media/storsimple-data-manager-change-default-blob-path/save-function.png)

9. As a last step, you need to add one more file to the function to complete it.

   1. Click **View files** from right corner.

       ![View files](./media/storsimple-data-manager-change-default-blob-path/view-files.png)

   2. Click **+ Add**. Type **project.json** and press **Enter**.
   3. Copy and paste the following code in **project.json** file.

        ```
            {
            "frameworks": {
                "net46":{
                "dependencies": {
                    "windowsazure.storage": "8.1.1"
                }
                }
            }
            }
        
        ```

   4. Click **Save**.

You have created an Azure function. This function is triggered each time a new blob is generated by the Data Transformation job.

## Next steps

[Use StorSimple Data Manager UI to transform your data](storsimple-data-manager-ui.md).
