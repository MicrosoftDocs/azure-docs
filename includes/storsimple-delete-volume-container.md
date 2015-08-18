<properties 
   pageTitle="Delete a StorSimple volume container"
   description="Explains how you can use the StorSimple Manager service volume containers page to delete a volume container."
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
   ms.date="08/14/2015"
   ms.author="v-sharos" />


#### To delete a volume container

1. On the **Devices** page, select the device, double-click it, and then click the **Volume containers** tab.

2. Select the volume container you want to delete.

3. If a volume container has no associated volumes, then it can be deleted. Click **Delete** at the bottom of the page to delete this container. When prompted for confirmation, click **Yes**. This will delete the volume container.

If the volume container has associated volumes, you will first need to take those volumes offline by following the steps in [Take a volume offline](../articles/storsimple/storsimple-manage-volumes.md#take-a-volume-offline). After the volumes are offline, you can delete them. When the volume container has no associated volumes, delete the volume container as described above.
