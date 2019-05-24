---
author: alkohli
ms.service: storsimple
ms.topic: include
ms.date: 10/26/2018
ms.author: alkohli
---

#### To install updates via the Azure portal

1. Go to your StorSimple Device Manager and select **Devices**. From the list of devices connected to your service, select and click the device you want to update. 

    ![update device](../includes/media/storsimple-virtual-array-install-update-via-portal/azupdate1m.png) 

2. In the **Settings** blade, click **Device updates**. 

    ![update device](../includes/media/storsimple-virtual-array-install-update-via-portal/azupdate2m.png)  

3. You see a message if the software updates are available. To check for updates, you can also click **Scan**.

    ![update device](../includes/media/storsimple-virtual-array-install-update-via-portal/azupdate3m.png)

    You will be notified when the scan starts and completes successfully.

    ![update device](../includes/media/storsimple-virtual-array-install-update-via-portal/azupdate5m.png)

4. Once the updates are scanned, click **Download updates**. 

    ![update device](../includes/media/storsimple-virtual-array-install-update-via-portal/azupdate6m.png)

5. In the **New updates** blade, review the information that after the updates are downloaded, you need to confirm the installation. Click **OK**.

    ![update device](../includes/media/storsimple-virtual-array-install-update-via-portal/azupdate7m.png)

6. You are notified when the upload starts and completes successfully.

     ![update device](../includes/media/storsimple-virtual-array-install-update-via-portal/azupdate8m.png)

5. In the **Device updates** blade, click **Install**.

     ![update device](../includes/media/storsimple-virtual-array-install-update-via-portal/azupdate11m.png)   

6. In the **New updates** blade, you are warned that the update is disruptive. As virtual array is a single node device, the device restarts after it is updated. This disrupts any IO in progress. Click **OK** to install the updates. 

    ![update device](../includes/media/storsimple-virtual-array-install-update-via-portal/azupdate12m.png) 

7. You are notified when the install job starts. 

    ![update device](../includes/media/storsimple-virtual-array-install-update-via-portal/azupdate13m.png)

8.  After the install job completes successfully, click **View Job** link in the **Device updates** blade to monitor the installation. 

    ![update device](../includes/media/storsimple-virtual-array-install-update-via-portal/azupdate15m.png)

    This takes you to the **Install Updates** blade. You can view detailed information about the job here.

    ![update device](../includes/media/storsimple-virtual-array-install-update-via-portal/azupdate16m.png)

9. After the updates are successfully installed, you see a message to this effect in the Device updates blade. The software version also changes to **10.0.10288.0**. 

    ![update device](../includes/media/storsimple-virtual-array-install-update-via-portal/azupdate17m.png)