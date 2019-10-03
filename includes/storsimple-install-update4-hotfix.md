---
author: alkohli
ms.service: storsimple
ms.topic: include
ms.date: 10/26/2018
ms.author: alkohli
---

#### To download hotfixes

Perform the following steps to download the software update from the Microsoft Update Catalog.

1. Start Internet Explorer and navigate to [http://catalog.update.microsoft.com](https://catalog.update.microsoft.com).
2. If this is your first time using the Microsoft Update Catalog on this computer, click **Install** when prompted to install the Microsoft Update Catalog add-on.

    ![Install catalog](./media/storsimple-install-update2-hotfix/HCS_InstallCatalog-include.png)

3. In the search box of the Microsoft Update Catalog, enter the Knowledge Base (KB) number of the hotfix you want to download, for example **4011839**, and then click **Search**.
   
    The hotfix listing appears, for example, **Cumulative Software Bundle Update 4.0 for StorSimple 8000 Series**.
   
    ![Search catalog](./media/storsimple-install-update2-hotfix/HCS_SearchCatalog1-include.png)

4. Click **Download**. Specify or **Browse** to a local location where you want the downloads to appear. Click the files to download to the specified location and folder. The folder can also be copied to a network share that is reachable from the device.
5. Search for any additional hotfixes listed in the table above (**4011841**), and download the corresponding files to the specific folders as listed in the preceding table.

> [!NOTE]
> The hotfixes must be accessible from both controllers to detect any potential error messages from the peer controller.
>
> The hotfixes must be copied in 3 separate folders. For example, the device software/Cis/MDS agent update can be copied in _FirstOrderUpdate_ folder, all the other non-disruptive updates could be copied in the _SecondOrderUpdate_ folder, and maintenance mode updates copied in _ThirdOrderUpdate_ folder.

#### To install and verify regular mode hotfixes

Perform the following steps to install and verify regular-mode hotfixes. If you already installed them using the Azure classic portal, skip ahead to [install and verify maintenance mode hotfixes](#to-install-and-verify-maintenance-mode-hotfixes).

1. To install the hotfixes, access the Windows PowerShell interface on your StorSimple device serial console. Follow the detailed instructions in [Use PuTTy to connect to the serial console](../articles/storsimple/storsimple-8000-deployment-walkthrough-u2.md#use-putty-to-connect-to-the-device-serial-console). At the command prompt, press **Enter**.
2. Select option 1, **Log in with full access**. We recommend that you install the hotfix on the passive controller first.
3. To install the hotfix, at the command prompt, type:
   
    `Start-HcsHotfix -Path <path to update file> -Credential <credentials in domain\username format>`
   
    Use IP rather than DNS in share path in the above command. The credential parameter is used only if you are accessing an authenticated share.
   
    We recommend that you use the credential parameter to access shares. Even shares that are open to “everyone” are typically not open to unauthenticated users.
   
    Supply the password when prompted.
   
    A sample output for installing the first order updates is shown below. For the first order update, you need to point to the specific file.
   
        ```
        Controller0>Start-HcsHotfix -Path \\10.100.100.100\share
        \FirstOrderUpdate\HcsSoftwareUpdate.exe -Credential contoso\John
   
        Confirm
   
        This operation starts the hotfix installation and could reboot one or
        both of the controllers. If the device is serving I/Os, these will not
        be disrupted. Are you sure you want to continue?
        [Y] Yes [N] No [?] Help (default is "Y"): Y
   
        ```
4. Type **Y** when prompted to confirm the hotfix installation.
5. Monitor the update by using the `Get-HcsUpdateStatus` cmdlet. The update will first complete on the passive controller. Once the passive controller is updated, there will be a failover and the update will then get applied on the other controller. The update is complete when both the controllers are updated.
   
    The following sample output shows the update in progress. The `RunInprogress` will be `True` when the update is in progress.

    ```
    Controller0>Get-HcsUpdateStatus
    RunInprogress       : True
    LastHotfixTimestamp :
    LastUpdateTimestamp : 02/03/2017 2:04:02 AM
    Controller0Events   :
    Controller1Events   :
    ```
   
     The following sample output indicates that the update is finished. The `RunInProgress` will be `False` when the update has completed.
   
    ```
    Controller0>Get-HcsUpdateStatus
    RunInprogress       : False
    LastHotfixTimestamp : 02/03/2017 9:15:55 AM
    LastUpdateTimestamp : 02/03/2017 9:06:07 AM
    Controller0Events   :
    Controller1Events   :
    ```

    > [!NOTE]
    > Occasionally, the cmdlet reports `False` when the update is still in progress. To ensure that the hotfix is complete, wait for a few minutes, rerun this command and verify that the `RunInProgress` is `False`. If it is, then the hotfix has completed.

6. After the software update is complete, verify the system software versions. Type:
   
    `Get-HcsSystem`
   
    You should see the following versions:
   
   * `FriendlySoftwareVersion: StorSimple 8000 Series Update 4.0`
   * `HcsSoftwareVersion: 6.3.9600.17820`
   
     If the version number does not change after applying the update, it indicates that the hotfix has failed to apply. Should you see this, please contact [Microsoft Support](../articles/storsimple/storsimple-contact-microsoft-support.md) for further assistance.
     
     > [!IMPORTANT]
     > You must restart the active controller via the `Restart-HcsController` cmdlet before applying the next update.
     
7. Repeat steps 3-5 to install the Cis/MDS agent downloaded to your _FirstOrderUpdate_ folder. 
8. Repeat steps 3-5 to install the second order updates. **For second order updates, multiple updates can be installed by just running the `Start-HcsHotfix cmdlet` and pointing to the folder where second order updates are located. The cmdlet will execute all the updates available in the folder.** If an update is already installed, the update logic will detect that and not apply that update. 

After all the hotfixes are installed, use the `Get-HcsSystem` cmdlet. The versions should be:

   * `CisAgentVersion:  1.0.9441.0`
   * `MdsAgentVersion: 35.2.2.0`
   * `Lsisas2Version: 2.0.78.00`


#### To install and verify maintenance mode hotfixes
Use KB4011837 to install disk firmware updates. These are disruptive updates and take around 30 minutes to complete. You can choose to install these in a planned maintenance window by connecting to the device serial console.

Note that if your disk firmware is already up-to-date, you won't need to install these updates. Run the `Get-HcsUpdateAvailability` cmdlet from the device serial console to check if updates are available and whether the updates are disruptive (maintenance mode) or non-disruptive (regular mode) updates.

To install the disk firmware updates, follow the instructions below.

1. Place the device in the maintenance mode. **Note that you should not use Windows PowerShell remoting when connecting to a device in maintenance mode. Instead run this cmdlet on the device controller when connected through the device serial console.** Type:
   
    `Enter-HcsMaintenanceMode`
   
    A sample output is shown below.
   
        Controller0>Enter-HcsMaintenanceMode
        Checking device state...
   
        In maintenance mode, your device will not service IOs and will be disconnected from the Microsoft Azure StorSimple Manager service. Entering maintenance mode will end the current session and reboot both controllers, which takes a few minutes to complete. Are you sure you want to enter maintenance mode?
        [Y] Yes [N] No (Default is "Y"): Y
   
        -----------------------MAINTENANCE MODE------------------------
        Microsoft Azure StorSimple Appliance Model 8600
        Name: Update4-8600-mystorsimple
        Copyright (C) 2014 Microsoft Corporation. All rights reserved.
        You are connected to Controller0 - Passive
        ---------------------------------------------------------------
   
        Serial Console Menu
        [1] Log in with full access
        [2] Log into peer controller with full access
        [3] Connect with limited access
        [4] Change language
        Please enter your choice>
   
    Both the controllers then restart into maintenance mode.
2. To install the disk firmware update, type:
   
    `Start-HcsHotfix -Path <path to update file> -Credential <credentials in domain\username format>`
   
    A sample output is shown below.
   
        Controller1>Start-HcsHotfix -Path \\10.100.100.100\share\ThirdOrderUpdates\ -Credential contoso\john
        Enter Password:
        WARNING: In maintenance mode, hotfixes should be installed on each controller sequentially. After the hotfix is installed on this controller, install it on the peer controller.
        Confirm
        This operation starts a hotfix installation and could reboot one or both of the controllers. By installing new updates you agree to, and accept any additional terms associated with, the new functionality listed in the release notes (https://go.microsoft.com/fwLink/?LinkID=613790). Are you sure you want to continue?
        [Y] Yes [N] No (Default is "Y"): Y
        WARNING: Installation is currently in progress. This operation can take several minutes to complete.
3. Monitor the install progress using `Get-HcsUpdateStatus` command. The update is complete when the `RunInProgress` changes to `False`.
4. After the installation is complete, the controller on which the maintenance mode hotfix was installed restarts. Sign in as option 1, **Log in with full access**, and verify the disk firmware version. Type:
   
   `Get-HcsFirmwareVersion`
   
   The expected disk firmware versions are:
   
   `XMGJ, XGEG, KZ50, F6C2, VR08, N002, 0106`
   
   A sample output is shown below.
   
       -----------------------MAINTENANCE MODE------------------------
       Microsoft Azure StorSimple Appliance Model 8600
       Name: Update4-8600-mystorsimple
       Software Version: 6.3.9600.17820
       Copyright (C) 2014 Microsoft Corporation. All rights reserved.
       You are connected to Controller1
       ---------------------------------------------------------------
   
       Controller1>Get-HcsFirmwareVersion
   
       Controller0 : TalladegaFirmware
           ActiveBIOS:0.45.0010
              BackupBIOS:0.45.0006
              MainCPLD:17.0.000b
              ActiveBMCRoot:2.0.001F
              BackupBMCRoot:2.0.001F
              BMCBoot:2.0.0002
              LsiFirmware:20.00.04.00
              LsiBios:07.37.00.00
              Battery1Firmware:06.2C
              Battery2Firmware:06.2C
              DomFirmware:X231600
              CanisterFirmware:3.5.0.56
              CanisterBootloader:5.03
              CanisterConfigCRC:0x9134777A
              CanisterVPDStructure:0x06
              CanisterGEMCPLD:0x19
              CanisterVPDCRC:0x142F7DC2
              MidplaneVPDStructure:0x0C
              MidplaneVPDCRC:0xA6BD4F64
              MidplaneCPLD:0x10
              PCM1Firmware:1.00|1.05
              PCM1VPDStructure:0x05
              PCM1VPDCRC:0x41BEF99C
              PCM2Firmware:1.00|1.05
              PCM2VPDStructure:0x05
              PCM2VPDCRC:0x41BEF99C

           EbodFirmware
              CanisterFirmware:3.5.0.56
              CanisterBootloader:5.03
              CanisterConfigCRC:0xB23150F8
              CanisterVPDStructure:0x06
              CanisterGEMCPLD:0x14
              CanisterVPDCRC:0xBAA55828
              MidplaneVPDStructure:0x0C
              MidplaneVPDCRC:0xA6BD4F64
              MidplaneCPLD:0x10
              PCM1Firmware:3.11
              PCM1VPDStructure:0x03
              PCM1VPDCRC:0x6B58AD13
              PCM2Firmware:3.11
              PCM2VPDStructure:0x03
              PCM2VPDCRC:0x6B58AD13

           DisksFirmware
              SmrtStor:TXA2D20800GA6XYR:KZ50
              SmrtStor:TXA2D20800GA6XYR:KZ50
              SmrtStor:TXA2D20800GA6XYR:KZ50
              SmrtStor:TXA2D20800GA6XYR:KZ50
              SmrtStor:TXA2D20800GA6XYR:KZ50
              WD:WD4001FYYG-01SL3:VR08
              WD:WD4001FYYG-01SL3:VR08
              WD:WD4001FYYG-01SL3:VR08
              WD:WD4001FYYG-01SL3:VR08
              WD:WD4001FYYG-01SL3:VR08
              WD:WD4001FYYG-01SL3:VR08
              WD:WD4001FYYG-01SL3:VR08
              WD:WD4001FYYG-01SL3:VR08
              WD:WD4001FYYG-01SL3:VR08
              WD:WD4001FYYG-01SL3:VR08
              WD:WD4001FYYG-01SL3:VR08
              WD:WD4001FYYG-01SL3:VR08
              WD:WD4001FYYG-01SL3:VR08
              WD:WD4001FYYG-01SL3:VR08
              WD:WD4001FYYG-01SL3:VR08
              WD:WD4001FYYG-01SL3:VR08
              WD:WD4001FYYG-01SL3:VR08
              WD:WD4001FYYG-01SL3:VR08
              WD:WD4001FYYG-01SL3:VR08
   
    Run the `Get-HcsFirmwareVersion` command on the second controller to verify that the software version has been updated. You can then exit the maintenance mode. To do so, type the following command for each device controller:
   
   `Exit-HcsMaintenanceMode`

5. The controllers restart when you exit maintenance mode. After the disk firmware updates are successfully applied and the device has exited maintenance mode, return to the Azure classic portal. Note that the portal might not show that you installed the maintenance mode updates for 24 hours.

