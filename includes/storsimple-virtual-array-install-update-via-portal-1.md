---
author: alkohli
ms.service: storsimple
ms.topic: include
ms.date: 10/26/2018
ms.author: alkohli
---

#### To install updates via the Azure portal

1. Go to your StorSimple Device Manager and select **Devices**. From the list of devices connected to your service, select and click the device you want to update.

    ![update device](../includes/media/storsimple-virtual-array-install-update-via-portal-04/azupdate1m.png) 

2. In the **Settings** blade, click **Device updates**.

    ![update device](../includes/media/storsimple-virtual-array-install-update-via-portal-04/azupdate2m.png)  

3. You see a message if the software updates are available. To check for updates, you can also click **Scan**. Make a note of the software version you are running. 

    ![update device](../includes/media/storsimple-virtual-array-install-update-via-portal-1/azupdate3m1.png)

    You are notified when the scan starts and completes successfully.

    ![update device](../includes/media/storsimple-virtual-array-install-update-via-portal-1/azupdate5m.png)

4. Once the updates are scanned, click **Download updates**.

    ![update device](../includes/media/storsimple-virtual-array-install-update-via-portal-1/azupdate6m.png)

5. In the **New updates** blade, review the release notes. Also note that after the updates are downloaded, you need to confirm the installation. Click **OK**.

    ![update device](../includes/media/storsimple-virtual-array-install-update-via-portal-1/azupdate7m.png)

6. You are notified when the upload starts and completes successfully.

     ![update device](../includes/media/storsimple-virtual-array-install-update-via-portal-1/azupdate8m.png)

5. In the **Device updates** blade, click **Install**.

     ![update device](../includes/media/storsimple-virtual-array-install-update-via-portal-1/azupdate11m1.png)

6. In the **New updates** blade, you are warned that the update is disruptive. As virtual array is a single node device, the device restarts after it is updated. This disrupts any IO in progress. Click **OK** to install the updates.

    ![update device](../includes/media/storsimple-virtual-array-install-update-via-portal-1/azupdate12m.png)

7. You are notified when the install job starts.

    ![update device](../includes/media/storsimple-virtual-array-install-update-via-portal-1/azupdate13m.png)

8.  After the install job completes successfully, click **View Job** link in the **Device updates** blade to monitor the installation. 

    ![update device](../includes/media/storsimple-virtual-array-install-update-via-portal-1/azupdate15m1.png)

    This action takes you to the **Install Updates** blade. You can view detailed information about the job here.

    ![update device](../includes/media/storsimple-virtual-array-install-update-via-portal-1/azupdate16m1.png)

9. If you started with a virtual array running software version Update 0.6 (10.0.10293.0), you are now running Update 1 and are done. You can skip the remaining steps. If you started with a virtual array running a software version prior to Update 0.6 (10.0.10293.0), you are now updated to Update 0.6. You see another message indicating that updates are available. Repeat steps 4-8 to install Update 1.

    ![update device](../includes/media/storsimple-virtual-array-install-update-via-portal-1/azupdate17.png)

