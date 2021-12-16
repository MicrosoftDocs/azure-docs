---
author: v-dalc
ms.service: databox  
ms.subservice: disk
ms.topic: include
ms.date: 12/16/2021
ms.author: alkohli
---

1. When the data upload completes, the Azure portal displays the disk status and the path to the copy logs for the disk.

    ![Screenshot of the Overview pane for a Data Box Disk order with Copy Completed With Errors status. The Disk Status and Copy Log Path for each disk are highlighted.](./media/data-box-disk-locate-logs/data-box-disk-portal-logs.png)

2. Use the COPY LOG PATH for a drive to locate the folder with the logs for your drive. The folder will have a copy log. If you chose to save a verbose log, the folder also has a verbose log.

   The logs are uploaded to a container (for blob imports) or share (for imports to Azure Files) in the storage account. The URLs have these formats:

   |Log type   |URL format|
   |-----------|----------|
   |copy log   |<*storage-account-name*>/databoxcopylog/<*order-name*>_<*device-serial-number*>_CopyLog_<*GUID*>.xml |
   |verbose log|<*storage-account-name*>/databoxcopylog/<*order-name*>_<*device-serial-number*>_VerboseLog_<*GUID*>.xml|

3. Go to the storage account, and download a copy of each log.
