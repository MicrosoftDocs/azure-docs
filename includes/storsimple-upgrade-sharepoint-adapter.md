<properties 
   pageTitle="Upgrade the StorSimple Adapter for SharePoint | Microsoft Azure"
   description="Describes how to upgrade SharePoint and then install a new version of the StorSimple Adapter for SharePoint."
   services="storsimple"
   documentationCenter="NA"
   authors="SharS"
   manager="carolz"
   editor="" />
<tags 
   ms.service="storsimple"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="TBD"
   ms.date="07/13/2015"
   ms.author="v-sharos" />

### Upgrade SharePoint 2010 to SharePoint 2013 and then install the StorSomple Adapter for SharePoint

>[AZURE.IMPORTANT] Any files that were previously moved to external storage via RBS will not be available until the upgrade is finished and the RBS feature is enabled again. To limit user impact, perform any upgrade or reinstallation during a planned maintenance window.

[AZURE.INCLUDE [storsimple-upgrade-sharepoint-adapter](../../includes/storsimple-upgrade-sharepoint-adapter.md)]
 
#### To upgrade SharePoint 2010 to SharePoint 2013 and then install the adapter

1. In the SharePoint 2010 farm, note the BLOB store path for the externalized BLOBs and the content databases for which RBS is enabled. 

2. Install and configure the new SharePoint 2013 farm. 

3. Move databases, applications, and site collections from the SharePoint 2010 farm to the new SharePoint 2013 farm. For instructions, go to Overview of the upgrade process to SharePoint 2013.

4. Install the StorSimple Adapter for SharePoint on the new farm. Go to [Install the StorSimple Adapter for SharePoint](#install-the-storsimple-adapter-for-sharepoint) for procedures.

5. Using the information that you noted in step 1, enable RBS for the same set of content databases and provide the same BLOB store path that was used in the SharePoint 2010 installation. Go to [Configure RBS](#configure-rbs) for procedures. After you complete this step, previously externalized files should be accessible from the new farm. 

### Upgrade the StorSimple Adapter for SharePoint

>[AZURE.IMPORTANT] You should schedule this upgrade to occur during a planned maintenance window for the following reasons:
>
>- Previously externalized content will not be available until the adapter is reinstalled.
>
>- Any content uploaded to the site after you uninstall the previous version of the StorSimple Adapter for SharePoint, but before you install the new version, will be stored in the content database. You will need to move that content to the StorSimple device after you install the new adapter. 


#### To upgrade the StorSimple Adapter for SharePoint 

1. Uninstall the previous version of StorSimple Adapter for SharePoint.

    >[AZURE.NOTE] This will automatically disable RBS on the content databases. However, existing BLOBs will remain on the StorSimple device. Because RBS is disabled and the BLOBs have not been migrated back to the content databases, any requests for those BLOBs will fail. 
 
2. Install the new StorSimple Adapter for SharePoint. The new adapter will automatically recognize the content databases that were previously enabled or disabled for RBS and will use the previous settings.
