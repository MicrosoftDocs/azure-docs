---
title: include file
description: include file
services: storsimple
author: alkohli

ms.service: storsimple
ms.topic: include
ms.date: 07/18/2018
ms.author: alkohli
ms.custom: include file
---

#### To install updates via the Azure portal

1. Go to your StorSimple Device Manager and select **Devices**. From the list of devices connected to your service, select and click the device you want to update.

2. Under **Settings**, click **Device updates**.  

3. You see a message if the software updates are available. To check for updates, you can also click **Scan**. Make a note of the software version you are running. 

    ![The Device updates pane says "New updates are available" (highlighted), and "Last scanned / 6/22/2018 2:46 PM / Software version / 10.0.10296.0". The version is highlighted.](../includes/media/storsimple-virtual-array-install-update-via-portal-11/azupdate3m1.png)

    You are notified when the scan starts and completes successfully.
 
4. Once the updates are scanned, click **Download updates**. Under **New updates**, review the release notes. Also note that after the updates are downloaded, you need to confirm the installation. Click **OK**.

    ![In Device updates, the Download updates button is highlighted. In New updates, there is a link to release notes and a message to confirm the installation after the updates are downloaded. There is an OK button.](../includes/media/storsimple-virtual-array-install-update-via-portal-11/azupdate6m.png)

    You are notified when the upload starts and completes successfully.

5. Under **Device updates**, click **Install**.

     ![Device updates says "Confirm installing updates". The Install button and the Software version are highlighted.](../includes/media/storsimple-virtual-array-install-update-via-portal-11/azupdate11m1.png)

6. Under **New updates**, you are warned that the update is disruptive. As virtual array is a single node device, the device restarts after it is updated. This disrupts any IO in progress. Click **OK** to install the updates.

    ![New updates says "Your device will have a downtime when these updates are installed". There is a link to release notes, and an OK button.](../includes/media/storsimple-virtual-array-install-update-via-portal-11/azupdate12m.png)

    You are notified when the install job starts.

7.  After the install job completes successfully, click **View Job** link. This action takes you to the **Install Updates** blade. You can view detailed information about the job here. 

    ![Device updates has a link labelled "Installing updates. View job".](../includes/media/storsimple-virtual-array-install-update-via-portal-11/azupdate16m1.png)

8. If you started with a virtual array running software version Update 1 (10.0.10296.0), you are now running Update 1.1 and are done. You can skip the remaining steps. 

    If you started with a virtual array running software version Update 0.6 (10.0.10293.0), you are now updated to Update 1.0. You see another message indicating that updates are available. Repeat steps 4-7 to install Update 1.1.

    

