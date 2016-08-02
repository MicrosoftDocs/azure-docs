<properties
   pageTitle="Install Update 1.2 on your StorSimple device | Microsoft Azure"
   description="Explains how to install StorSimple 8000 Series Update 1.2 on your StorSimple 8000 series device."
   services="storsimple"
   documentationCenter="NA"
   authors="alkohli"
   manager="carmonm"
   editor="" />
<tags
   ms.service="storsimple"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="TBD"
   ms.date="05/24/2016"
   ms.author="alkohli" />

# Install Update 1.2 on your StorSimple device

## Overview

This tutorial explains how to install Update 1.2 on a StorSimple device that is running a software version prior to Update 1. The tutorial also covers the additional steps required for the update when a gateway is configured on a network interface other than DATA 0 of the StorSimple device.

Update 1.2 includes device software updates, LSI driver updates and disk firmware updates. The software and LSI driver updates are non-disruptive updates and can be applied via the Azure classic portal. The disk firmware updates are disruptive updates and can only be applied via the Windows PowerShell interface of the device.

Depending upon which version your device is running, you can determine if Update 1.2 will be applied. You can check the software version of your device by navigating to the **quick glance** section of your device **Dashboard**.

</br>

| If running software version …   | What happens in the portal?                              |
|---------------------------------|--------------------------------------------------------------|
| Release - GA 				   	  | If you are running Release version (GA), do not apply this update. Please [contact Microsoft Support](storsimple-contact-microsoft-support.md) to update your device.|
| Update 0.1 					  | Portal applies Update 1.2.                                |
| Update 0.2 					  | Portal applies Update 1.2.                                |
| Update 0.3                      | Portal applies Update 1.2.                                |
| Update 1                        | This update will not be available.                           |
| Update 1.1                      | This update will not be available.                           |

</br>

> [AZURE.IMPORTANT]

> -  You may not see Update 1.2 immediately because we do a phased rollout of the updates. Scan for updates in a few days again as this Update will become available soon.
> - This update includes a set of manual and automatic pre-checks to determine the device health in terms of hardware state and network connectivity. These pre-checks are performed only if you apply the updates from the Azure classic portal.
> - We recommend that you install the software and driver updates via the Azure  classic portal. You should only go to the Windows PowerShell interface of the device (to install updates) if the pre-update gateway check fails in the portal. The updates may take 5-10 hours to install (including the Windows Updates). The maintenance mode updates must be installed via the Windows PowerShell interface of the device. As maintenance mode updates are disruptive updates, these will result in a down time for your device.

[AZURE.INCLUDE [storsimple-preparing-for-update](../../includes/storsimple-preparing-for-updates.md)]

## Install Update 1.2 via the Azure classic portal

Perform the following steps to update your device to [Update 1.2](storsimple-update1-release-notes.md). Use this procedure only if you have a gateway configured on DATA 0 network interface on your device.

[AZURE.INCLUDE [storsimple-install-update2-via-portal](../../includes/storsimple-install-update2-via-portal.md)]

12. Verify that your device is running **StorSimple 8000 Series Update 1.2 (6.3.9600.17584)**. The **Last updated date** should also be modified. You'll also see that Maintenance mode updates are available (this message might continue to be displayed for up to 24 hours after you install the updates).

    Maintenance mode updates are disruptive updates that result in device downtime and can only be applied via the Windows PowerShell interface of your device.

    ![Maintenance page](./media/storsimple-install-update-1/InstallUpdate12_10M.png "Maintenance page")

13. Download the maintenance mode updates by using the steps listed in [To download hotfixes]( #to-download-hotfixes) to search for and download KB3063416, which installs disk firmware updates (the other updates should already be installed by now).

13. Follow the steps listed in [Install and verify maintenance mode hotfixes](#to-install-and-verify-maintenance-mode-hotfixes) to install the maintenance mode updates.

14. In the Azure classic portal, navigate to the **Maintenance** page and at the bottom of the page, click **Scan Updates** to check for any Windows Updates and then click **Install Updates**. You're finished after all of the updates are successfully installed.



## Install Update 1.2 on a device that has a gateway configured for a non-DATA 0 network interface

You should use this procedure only if you fail the gateway check when trying to install the updates through the Azure classic portal. The check fails as you have a gateway assigned to a non-DATA 0 network interface and your device is running a software version prior to Update 1. If your device does not have a gateway on a non-DATA 0 network interface, you can update your device directly from the Azure classic portal. See [Install update 1.2 via the Azure classic portal](#install-update-1.2-via-the-azure-classic-portal).

The software versions that can be upgraded using this method are Update 0.1, Update 0.2, and Update 0.3.


> [AZURE.IMPORTANT]
>
> - If your device is running Release (GA) version, please contact [Microsoft Support](storsimple-contact-microsoft-support.md) to assist you with the update.
> - This procedure needs to be performed only once to apply Update 1.2. You can use the Azure classic portal to apply subsequent updates.

If your device is running pre-Update 1 software and it has a gateway set for a network interface other than DATA 0, you can apply Update 1.2 in the following two ways:

- **Option 1**: Download the update and apply it by using the `Start-HcsHotfix` cmdlet from the Windows PowerShell interface of the device. This is the recommended method. **Do not use this method to apply Update 1.2 if your device is running Update 1.0 or Update 1.1.**

- **Option 2**: Remove the gateway configuration and install the update directly from the Azure classic portal.


Detailed instructions for each of these are provided in the following sections.

## Option 1: Use Windows PowerShell for StorSimple to apply Update 1.2 as a hotfix

You should use this procedure only if you are running Update 0.1, 0.2, 0.3 and if your gateway check has failed when trying to install updates from the Azure classic portal. If you are running Release (GA) software, please [Microsoft Support](storsimple-contact-microsoft-support.md) to update your device.

To install Update 1.2 as a hotfix, you must download and install the following hotfixes:

| Order  | KB        | Description             | Update type  |
|--------|-----------|-------------------------|------------- |
| 1      | KB3063418 | Software update         |  Regular     |
| 2      | KB3043005 | LSI SAS controller update |  Regular     |
| 3      | KB3063416 | Disk firmware           | Maintenance  |

Before using this procedure to apply the update, make sure that:

- Both device controllers are online.

Perform the following steps to apply Update 1.2. **The updates could take around 2 hours to complete (approximately 30 minutes for software, 30 minutes for driver, 45 minutes for disk firmware).**

[AZURE.INCLUDE [storsimple-install-update-option1](../../includes/storsimple-install-update-option1.md)]


## Option 2: Use the Azure classic portal to apply Update 1.2 after removing the gateway configuration

This procedure applies only to StorSimple devices that are running a software version prior to Update 1 and have a gateway set on a network interface other than DATA 0. You will need to clear the gateway setting prior to applying the update.

The update may take a few hours to complete. If your hosts are in different subnets, removing the gateway configuration on the iSCSI interfaces could result in downtime. We recommend that you configure DATA 0 for iSCSI traffic to reduce the downtime.

Perform the following steps to disable the network interface with the gateway and then apply the update.

[AZURE.INCLUDE [storsimple-install-update-option2](../../includes/storsimple-install-update-option2.md)]

[AZURE.INCLUDE [storsimple-install-troubleshooting](../../includes/storsimple-install-troubleshooting.md)]


## Next steps

Learn more about the [Update 1.2 release](storsimple-update1-release-notes.md).
