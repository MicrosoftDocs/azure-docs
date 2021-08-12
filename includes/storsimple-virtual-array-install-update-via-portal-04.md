---
author: alkohli
ms.service: storsimple
ms.topic: include
ms.date: 10/26/2018
ms.author: alkohli
---

#### To install updates via the Azure portal

1. Go to your StorSimple Device Manager and select **Devices**. From the list of devices connected to your service, select and click the device you want to update. 

    ![In Recent, Device Manager MySSDevManager is highlighted and selected, Devices is highlighted and selected, and device MYSSIS1103 is highlighted and selected.](../includes/media/storsimple-virtual-array-install-update-via-portal-04/azupdate1m.png) 

2. In the **Settings** blade, click **Device updates**. 

    ![Information for MYSSIS1103 is shown. In Settings, Device updates is highlighted.](../includes/media/storsimple-virtual-array-install-update-via-portal-04/azupdate2m.png)  

3. You see a message if the software updates are available. To check for updates, you can also click **Scan**.

    ![The Device updates pane says "New updates are available", and "Last scanned / 18/01/2017 2:42 PM / Software version / 10.0.10288.0". The version is highlighted.](../includes/media/storsimple-virtual-array-install-update-via-portal-04/azupdate3m1.png)

    You will be notified when the scan starts and completes successfully.

    ![The notification says "Scanning updates for device MySSIS1103. 2:12 PM / Successfully complete the operation."](../includes/media/storsimple-virtual-array-install-update-via-portal-04/azupdate5m.png)

4. Once the updates are scanned, click **Download updates**. 

    ![In the The Device updates pane there is the message "New updates are available". The Download updates button is highlighted.](../includes/media/storsimple-virtual-array-install-update-via-portal-04/azupdate6m.png)

5. In the **New updates** blade, review the information that after the updates are downloaded, you need to confirm the installation. Click **OK**.

    ![The New updates pane says "After the updates are downloaded, you will need to confirm the installation". The OK button is highlighted.](../includes/media/storsimple-virtual-array-install-update-via-portal-04/azupdate7m.png)

6. You are notified when the upload starts and completes successfully.

     ![The notification says "Downloading updates for device MySSIS1… 2:13 PM".](../includes/media/storsimple-virtual-array-install-update-via-portal-04/azupdate8m.png)

5. In the **Device updates** blade, click **Install**.

     ![Device updates says "Confirm installing updates". There is an Install button.](../includes/media/storsimple-virtual-array-install-update-via-portal-04/azupdate11m1.png)   

6. In the **New updates** blade, you are warned that the update is disruptive. As virtual array is a single node device, the device restarts after it is updated. This disrupts any IO in progress. Click **OK** to install the updates. 

    ![The message in the New updates pane is "Your device will have a downtime when these updates are installed". The OK button is highlighted.](../includes/media/storsimple-virtual-array-install-update-via-portal-04/azupdate12m.png) 

7. You are notified when the install job starts. 

    ![The notification says "Installing updates for device MySSIS1103. 2:15 PM".](../includes/media/storsimple-virtual-array-install-update-via-portal-04/azupdate13m.png)

8.  After the install job completes successfully, click **View Job** link in the **Device updates** blade to monitor the installation. 

    ![In the Device updates pane, there is a link labelled "Installing updates. View Job".](../includes/media/storsimple-virtual-array-install-update-via-portal-04/azupdate15m1.png)

    This takes you to the **Install Updates** blade. You can view detailed information about the job here.

    ![The Install Updates pane has installation information, including device, status, duration, start time, and stop time.](../includes/media/storsimple-virtual-array-install-update-via-portal-04/azupdate16m1.png)

9. After the updates are successfully installed, you see a message to this effect in the **Device updates** blade. 
