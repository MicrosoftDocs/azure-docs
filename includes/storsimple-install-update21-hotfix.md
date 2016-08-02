<!--author=alkohli last changed: 05/19/16-->

#### To download hotfixes

Perform the following steps to download the software update from the Microsoft Update Catalog.

1. Start Internet Explorer and navigate to [http://catalog.update.microsoft.com](http://catalog.update.microsoft.com).

2. If this is your first time using the Microsoft Update Catalog on this computer, click **Install** when prompted to install the Microsoft Update Catalog add-on.
    ![Install catalog](./media/storsimple-install-update2-hotfix/HCS_InstallCatalog-include.png)

3. In the search box of the Microsoft Update Catalog, enter the Knowledge Base (KB) number of the hotfix you want to download, for example **3179904**, and then click **Search**.

    The hotfix listing appears, for example, **Cumulative Software Bundle Update 2.2 for StorSimple 8000 Series**.

    ![Search catalog](./media/storsimple-install-update2-hotfix/HCS_SearchCatalog1-include.png)

4. Click **Add**. The update is added to the basket.

5. Search for any additional hotfixes listed in the table above (**3103616**, **3146621**), and add each to the basket.

5. Click **View Basket**.

6. Click **Download**. Specify or **Browse** to a local location where you want the downloads to appear. The updates are downloaded to the specified location and placed in a sub-folder with the same name as the update. The folder can also be copied to a network share that is reachable from the device.

>   [AZURE.NOTE]
The hotfixes must be accessible from both controllers to detect any potential error messages from the peer controller.

#### To install and verify regular mode hotfixes

Perform the following steps to install and verify regular-mode hotfixes. If you already installed them using the Azure Portal, skip ahead to [install and verify maintenance mode hotfixes](#to-install-and-verify-maintenance-mode-hotfixes).

1. To install the hotfixes, access the Windows PowerShell interface on your StorSimple device serial console. Follow the detailed instructions in [Use PuTTy to connect to the serial console](storsimple-deployment-walkthrough.md#use-putty-to-connect-to-the-device-serial-console). At the command prompt, press **Enter**.

4. Select **Option 1** to log on to the device with full access. We recommend that you install the hotfix on the passive controller first.

5. To install the hotfix, at the command prompt, type:

    `Start-HcsHotfix -Path <path to update file> -Credential <credentials in domain\username format>`

    Use IP rather than DNS in share path in the above command. The credential parameter is used only if you are accessing an authenticated share.

	We recommend that you use the credential parameter to access shares. Even shares that are open to “everyone” are typically not open to unauthenticated users.

	Supply the password when prompted.

    A sample output is shown below.

        ````
        Controller0>Start-HcsHotfix -Path \\10.100.100.100\share
        \hcsmdssoftwareupdate.exe -Credential contoso\John

        Confirm

        This operation starts the hotfix installation and could reboot one or
        both of the controllers. If the device is serving I/Os, these will not
        be disrupted. Are you sure you want to continue?
        [Y] Yes [N] No [?] Help (default is "Y"): Y

        ````

6. Type **Y** when prompted to confirm the hotfix installation.

> [AZURE.IMPORTANT] If installing Update 2.2, only install the binary file prefaced with 'all-hcsmdssoftwareudpate'. Do not install the Cis and the MDS agent update prefaced with all-cismdsagentupdatebundle. Failure to do so will result in an error. 

7. Monitor the update by using the `Get-HcsUpdateStatus` cmdlet. The update will first complete on the passive controller. Once the passive controller is updated, there will be a failover and the update will then get applied on the other controller. The update is complete when both the controllers are updated.

    The following sample output shows the update in progress. The `RunInprogress` will be `True` when the update is in progress.

        ````
        Controller0>Get-HcsUpdateStatus
		RunInprogress       : True
		LastHotfixTimestamp :
		LastUpdateTimestamp : 5/5/2016 2:04:02 AM
		Controller0Events   :
		Controller1Events   :

        ````

     The following sample output indicates that the update is finished. The `RunInProgress` will be `False` when the update has completed.

        ````
        Controller0>Get-HcsUpdateStatus
		RunInprogress       : False
		LastHotfixTimestamp : 5/17/2016 9:15:55 AM
		LastUpdateTimestamp : 5/17/2016 9:06:07 AM
		Controller0Events   :
		Controller1Events   :


        ````

	> [AZURE.NOTE] Occasionally, the cmdlet reports `False` when the update is still in progress. To ensure that the hotfix is complete, wait for a few minutes, rerun this command and verify that the `RunInProgress` is `False`. If it is, then the hotfix has completed.

8. After the software update is complete, verify the system software versions. Type:

    `Get-HcsSystem`

    You should see the following versions:

    - `HcsSoftwareVersion: 6.3.9600.17708`
    - `CisAgentVersion: 1.0.9299.0`
    - `MdsAgentVersion: 30.0.4698.16` 

	If the version numbers do not change after applying the update, it indicates that the hotfix has failed to apply. Should you see this, please contact [Microsoft Support](storsimple-contact-microsoft-support.md) for further assistance.
	
	> [AZURE.IMPORTANT] You must restart the active controller via the `Restart-HcsController` cmdlet before applying the remaining updates. 

9. Repeat steps 3-5 to install the remaining regular-mode hotfixes.

	- The iSCSI update KB3146621
	
	- The WMI update KB3103616
	

10. Skip this step if you are updating from Update 2. If you are updating from a version prior to Update 2, you will also need to download:


	- The LSI driver KB3121900

	- The Spaceport update KB3090322
	
	- The Storport update KB3080728

#### To install and verify maintenance mode hotfixes

Use KB3121899 to install disk firmware updates. These are disruptive updates and take around 30 minutes to complete. You can choose to install these in a planned maintenance window by connecting to the device serial console.

Note that if your disk firmware is already up-to-date, you won't need to install these updates. Run the `Get-HcsUpdateAvailability` cmdlet from the device serial console to check if updates are available and whether the updates are disruptive (maintenance mode) or non-disruptive (regular mode) updates.

To install the disk firmware updates, follow the instructions below.

1. Place the device in the Maintenance mode. Note that you should not use Windows PowerShell remoting when connecting to a device in Maintenance mode. Instead run this cmdlet on the device controller when connected through the device serial console. Type:

	`Enter-HcsMaintenanceMode`

	A sample output is shown below.

		Controller0>Enter-HcsMaintenanceMode
		Checking device state...

		In maintenance mode, your device will not service IOs and will be disconnected from the Microsoft Azure StorSimple Manager service. Entering maintenance mode will end the current session and reboot both controllers, which takes a few minutes to complete. Are you sure you want to enter maintenance mode?
		[Y] Yes [N] No (Default is "Y"): Y

		-----------------------MAINTENANCE MODE------------------------
		Microsoft Azure StorSimple Appliance Model 8100
		Name: Update2-8100-SHG0997879L76673
		Copyright (C) 2014 Microsoft Corporation. All rights reserved.
		You are connected to Controller0 - Passive
		---------------------------------------------------------------

		Serial Console Menu
		[1] Log in with full access
		[2] Log into peer controller with full access
		[3] Connect with limited access
		[4] Change language
		Please enter your choice>

	Both the controllers then restart into Maintenance mode.

3. To install the disk firmware update, type:

	`Start-HcsHotfix -Path <path to update file> -Credential <credentials in domain\username format>`

	A sample output is shown below.

        Controller1>Start-HcsHotfix -Path \\10.100.100.100\share\DiskFirmwarePackage.exe -Credential contoso\john
		Enter Password:
		WARNING: In maintenance mode, hotfixes should be installed on each controller sequentially. After the hotfix is installed on this controller, install it on the peer controller.
		Confirm
		This operation starts a hotfix installation and could reboot one or both of the controllers. By installing new updates you agree to, and accept any additional terms associated with, the new functionality listed in the release notes (https://go.microsoft.com/fwLink/?LinkID=613790). Are you sure you want to continue?
		[Y] Yes [N] No (Default is "Y"): Y
		WARNING: Installation is currently in progress. This operation can take several minutes to complete.

1.  Monitor the install progress using `Get-HcsUpdateStatus` command. The update is complete when the `RunInProgress` changes to `False`.

2.  After the installation is complete, the controller on which the maintenance mode hotfix was installed restarts. Log in as option 1 with full access and verify the disk firmware version. Type:

	`Get-HcsFirmwareVersion`

	The expected disk firmware versions are:

	`XMGG, XGEG, KZ50, F6C2, VR08`

	A sample output is shown below.

        -----------------------MAINTENANCE MODE------------------------
    	Microsoft Azure StorSimple Appliance Model 8100
    	Name: Update2-8100-SHG0997879L76YD
    	Software Version: 6.3.9600.17705
    	Copyright (C) 2014 Microsoft Corporation. All rights reserved.
    	You are connected to Controller1
    	---------------------------------------------------------------

    	Controller1>Get-HcsFirmwareVersion

    	Controller0 : TalladegaFirmware
    	  ActiveBIOS:0.45.0006
    	  BackupBIOS:0.45.0008
    	  MainCPLD:17.0.0005
    	  ActiveBMCRoot:2.0.000E
    	  BackupBMCRoot:2.0.000E
    	  BMCBoot:2.0.0001
    	  LsiFirmware:19.00.00.00
    	  LsiBios:07.37.00.00
    	  Battery1Firmware:06.29
    	  Battery2Firmware:06.29
    	  DomFirmware:X231600
    	  CanisterFirmware:3.5.0.32
    	  CanisterBootloader:5.03
    	  CanisterConfigCRC:0xD1B030A4
    	  CanisterVPDStructure:0x06
    	  CanisterGEMCPLD:0x17
    	  CanisterVPDCRC:0xEE3504B4
    	  MidplaneVPDStructure:0x0C
    	  MidplaneVPDCRC:0xA6BD4F64
    	  MidplaneCPLD:0x10
    	  PCM1Firmware:1.00|1.05
    	  PCM1VPDStructure:0x05
    	  PCM1VPDCRC:0x41BEF99C
    	  PCM2Firmware:1.00|1.05
    	  PCM2VPDStructure:0x05
    	  PCM2VPDCRC:0x41BEF99C

    	  DisksFirmware
    	  SEAGATE:ST400FM0073:XGEG
    	  SEAGATE:ST400FM0073:XGEG
    	  SEAGATE:ST400FM0073:XGEG
    	  SEAGATE:ST400FM0073:XGEG
    	  SEAGATE:ST4000NM0023:XMGG
    	  SEAGATE:ST4000NM0023:XMGG
    	  SEAGATE:ST4000NM0023:XMGG
    	  SEAGATE:ST4000NM0023:XMGG
    	  SEAGATE:ST4000NM0023:XMGG
    	  SEAGATE:ST4000NM0023:XMGG
    	  SEAGATE:ST4000NM0023:XMGG
    	  SEAGATE:ST4000NM0023:XMGG

	 Run the `Get-HcsFirmwareVersion` command on the second controller to verify that the software version has been updated. You can then exit the maintenance mode. To do so, type the following command for each device controller:

    `Exit-HcsMaintenanceMode`

1. The controllers restart when you exit Maintenance mode. After the disk firmware updates are successfully applied and the device has exited maintenance mode, return to the Azure classic portal. Note that the portal might not show that you installed the Maintenance mode updates for 24 hours.
