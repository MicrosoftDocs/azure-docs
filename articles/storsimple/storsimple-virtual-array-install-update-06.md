---
title: Install Update 0.6 on StorSimple Virtual Array | Microsoft Docs
description: Describes how to use the StorSimple Virtual Array web UI to apply updates using the Azure portal and hotfix method
services: storsimple
documentationcenter: NA
author: alkohli
manager: timlt
editor: ''

ms.assetid: 
ms.service: storsimple
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: TBD
ms.date: 05/18/2017
ms.author: alkohli
---
# Install Update 0.6 on your StorSimple Virtual Array

## Overview

This article describes the steps required to install Update 0.6 on your StorSimple Virtual Array via the local web UI and via the Azure portal. You apply the software updates or hotfixes to keep your StorSimple Virtual Array up-to-date.

Before you apply an update, we recommend that you take the volumes or shares offline on the host first and then the device. This minimizes any possibility of data corruption. After the volumes or shares are offline, you should also take a manual backup of the device.

> [!IMPORTANT]
> - Update 0.6 corresponds to **10.0.10293.0** software version on your device. For information on what is new in this update, go to [Release notes for Update 0.6](storsimple-virtual-array-update-06-release-notes.md).
>
> - If you are running Update 0.2 or later, we recommend that you install the updates via the Azure portal. If you are running Update 0.1 or GA software versions, you must use the hotfix method via the local web UI to install Update 0.6.
>
> - Keep in mind that installing an update or hotfix restarts your device. Given that the StorSimple Virtual Array is a single node device, any I/O in progress is disrupted and your device experiences downtime.

## Use the Azure portal

If running Update 0.2 and later, we recommend that you install updates through the Azure portal. The portal procedure requires the user to scan, download, and then install the updates. This procedure takes around 7 minutes to complete. Perform the following steps to install the update or hotfix.

[!INCLUDE [storsimple-virtual-array-install-update-via-portal](../../includes/storsimple-virtual-array-install-update-via-portal-04.md)]

After the installation is complete, go to your StorSimple Device Manager service. Select **Devices** and then select and click the device you just updated. Go to **Settings > Manage > Device Updates**. The displayed software version should be **10.0.10293.0**.

## Use the local web UI

There are two steps when using the local web UI:

* Download the update or the hotfix
* Install the update or the hotfix

### Download the update or the hotfix

Perform the following steps to download the software update from the Microsoft Update Catalog.

#### To download the update or the hotfix

1. Start Internet Explorer and navigate to [https://catalog.update.microsoft.com](https://catalog.update.microsoft.com).

2. If you are using the Microsoft Update Catalog for the first time on this computer, click **Install** when prompted to install the Microsoft Update Catalog add-on.

3. In the search box of the Microsoft Update Catalog, enter the Knowledge Base (KB) number of the hotfix you want to download. Enter **4023268** for Update 0.6, and then click **Search**.
   
    The hotfix listing appears, for example, **StorSimple Virtual Array Update 0.6**.
   
    ![Search catalog](./media/storsimple-virtual-array-install-update-06/download1.png)

4. Click **Download**.

5. You should see five files to download. Download each of those files to a folder. The folder can also be copied to a network share that is reachable from the device.

6. Open the folder where the files are located.
    ![Files in the package](./media/storsimple-virtual-array-install-update-06/update06folder.png)

    You see:
    -  A Microsoft Update Standalone Package file `WindowsTH-KB3011067-x64`. This file is used to update the device software.
    - A Geneva Monitoring Agent Package file `GenevaMonitoringAgentPackageInstaller`. This file is used to update the Monitoring and Diagnostics service (MDS) agent. Double-click the cab file. A _.msi_ is displayed. Select the file, right-click, and then **Extract** the file. You use the _.msi_ file to update the agent.

        ![Extract MDS Agent Update file](./media/storsimple-virtual-array-install-update-06/extract-geneva-monitoring-agent-installer.png)

        > [!IMPORTANT]
        > You do not need to update the MDS agent if you are running StorSimple Update 0.5 (0.0.10293.0).

    - Three files that contain critical Windows security updates, `windows8.1-kb4012213-x64`,`windows8.1-kb3205400-x64`, and `windows8.1-kb4019213-x64`.


### Install the update or the hotfix

Prior to the update or hotfix installation, make sure that you have the update or the hotfix downloaded either locally on your host or accessible via a network share.

Use this method to install updates on a device running GA or Update 0.1 software versions. This procedure takes approximately 12 minutes to complete. Perform the following steps to install the update or hotfix.

#### To install the update or the hotfix

1. In the local web UI, go to **Maintenance** > **Software Update**. Make a note of the software version that you are running. If you are running **10.0.10290.0**, you do not need to update the MDS agent in step 6.
   
    ![update device](./media/storsimple-virtual-array-install-update-05/update1m.png)

2. In **Update file path**, enter the file name for the update or the hotfix. You can also browse to the update or hotfix installation file if placed on a network share. Click **Apply**.
   
    ![update device](./media/storsimple-virtual-array-install-update-05/update2m.png)

3. A warning is displayed. Given the virtual array is a single node device, after the update is applied, the device restarts and there is downtime. Click the check icon.
   
   ![update device](./media/storsimple-virtual-array-install-update-05/update3m.png)

4. The update starts. After the device is successfully updated, it restarts. The local UI is not accessible in this duration.
   
    ![update device](./media/storsimple-virtual-array-install-update-05/update5m.png)

5. After the restart is complete, you are taken to the **Sign in** page. To verify that the device software has updated, in the local web UI, go to **Maintenance** > **Software Update**. The displayed software version should be **10.0.0.0.0.10293** for Update 0.6.
   
   > [!NOTE]
   > We report the software versions in a slightly different way in the local web UI and the Azure portal. For example, the local web UI reports **10.0.0.0.0.10293** and the Azure portal reports **10.0.10293.0** for the same version.
   
    ![update device](./media/storsimple-virtual-array-install-update-06/update6m.png)

6. Skip this step if you were running StorSimple Virtual Array Update 0.5 (**10.0.10290.0**) before you applied this update. You made a note of the software version in step 1 before you began to update. If you were running Update 0.5, your MDS agent is already up-to-date .

    If you are running a software version prior to Update 0.5, the next step for you is to update the MDS agent. In the **Software Update** page, go to the **Update file path** and browse to the `GenevaMonitoringAgentPackageInstaller.msi` file. Repeat steps 2-4. After the virtual array restarts, sign into the local web UI.

7. Repeat step 2-4 to install the Windows security fixes using files `windows8.1-kb4012213-x64`,`windows8.1-kb3205400-x64`, and `windows8.1-kb4019213-x64`. The virtual array restarts after each install and you need to sign into the local web UI.

## Next steps

Learn more about [administering your StorSimple Virtual Array](storsimple-ova-web-ui-admin.md).

