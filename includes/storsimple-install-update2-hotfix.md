<!--author=alkohli last changed: 01/12/15-->

#### To download hotfixes

Perform the following steps to download the software update from the Microsoft Update Catalog.

1. Start Internet Explorer and navigate to [http://catalog.update.microsoft.com/v7/site/Home.aspx](http://catalog.update.microsoft.com/v7/site/Home.aspx).

2. If you are a first-time user, you will be prompted to install a Microsoft Update Catalog. Click **Install**.
    
   	![Install catalog](./media/storsimple-install-update2-hotfix/HCS_InstallCatalog-include.png)

3. You will see a catalog search screen. Enter **3121901** in the search box, and click **Search**.

    ![Search catalog](./media/storsimple-install-update2-hotfix/HCS_SearchCatalog1-include.png)

4. You will see the **Cumulative Software Bundle Update 2.0 for StorSimple 8000 Series**. Click **Add**. The update will be added to the basket. 

5. Click **View Basket**.
 
6. Click **Download**. Specify or **Browse** to a local location where you want the download to appear. The update will be downloaded in a folder (same name as the update) to the chosen location. The folder can also be copied to a network share that is reachable from the device. 
       
	> [AZURE.NOTE] 
	> 
	> - You will also need to download **LSI driver update** (SAS Controller Update 2.0 for StorSimple 8000 Series - KB3121900),  **Storport update** (Hotfix for Windows Server 2012 R2 x64 Edition - KB3080728), **Spaceport update** (Hotfix for Windows Server 2012 R2 x64 Edition - KB3090322), and **Disk firmware update** (Cumulative Disk Firmware Update 2.0 for StorSimple 8000 Series - KB3121899) and copy to the same shared folder.
	> - The hotfix must be accessible from both controllers to detect any potential error messages from the peer controller.

#### To install and  verify regular mode hotfixes

Perform the following steps to install and verify the regular hotfixes.

1. To install the hotfixes, access the Windows PowerShell interface on your StorSimple device serial console. Follow the detailed instructions in [Use PuTTy to connect to the serial console](storsimple-deployment-walkthrough.md#use-putty-to-connect-to-the-device-serial-console). At the command prompt, press **Enter**.

4. Select **Option 1** to log on to the device with full access.

5. To install the hotfix, at the command prompt, type:

    `Start-HcsHotfix -Path <path to update file> -Credential <credentials in domain\username format>`

    Use IP rather than DNS in share path in the above command. The credential parameter is used only if you are accessing an authenticated share. 

	We recommend that you use the credential parameter to access shares. Even shares that are open to “everyone” are typically not open to unauthenticated users.

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

7. Monitor the update by using the `Get-HcsUpdateStatus` cmdlet.

    The following sample output shows the update in progress. The `RunInprogress` will be `True` when the update is in progress.

        ````
        Controller0>Get-HcsUpdateStatus
        RunInprogress       : True
        LastHotfixTimestamp : 12/21/2015 10:36:13 PM
        LastUpdateTimestamp : 12/21/2015 10:35:25 PM
        Controller0Events   :
        Controller1Events   : 
        ````
 
     The following sample output indicates that the update is finished. The `RunInProgress` will be `False` when the update has completed.

        ````
        Controller1>Get-HcsUpdateStatus

        RunInprogress       : False
        LastHotfixTimestamp : 12/21/2015 10:59:13 PM
        LastUpdateTimestamp : 12/21/2015 10:35:25 PM
        Controller0Events   :
        Controller1Events   :

        ````
		

	> [AZURE.NOTE] Occasionally, the cmdlet reports `False` when the update is still in progress. To ensure that the hotfix is complete, wait for a few minutes, rerun this command and verify that the `RunInProgress` is `False`. If it is, then the hotfix has completed. 
	
8. After the software update is complete, repeat steps 3-5 to install and monitor the SaaS agent and MDS agent using the `CisMdsAgentUpdateBundle.exe`. Ensure that `HcsMdsSoftwareUpdate.exe` is installed before `CisMdsAgentUpdateBundle.exe`. 

9. Verify the system software versions. Type:

    `Get-HcsSystem`

    You should see the following versions:

    - HcsSoftwareVersion: 6.3.9600.17673
    - CisAgentVersion: 1.0.9150.0
    - MdsAgentVersion: 30.0.4698.13 
    
	If the version numbers do not change after applying the update, it indicates that the hotfix has failed to apply. Should you see this, please contact [Microsoft Support](storsimple-contact-microsoft-support.md) for further assistance.
    
9. Repeat steps 3-5 to install and monitor the remaining regular hotfixes.

	- The LSI driver using the `HcsLsiUpdate.exe` package (KB3121900).
	- The Storport fix using the `Storport-KB3080728-x64.msu` package (KB3080728).
	- The Spaceport fix using the `spaceport-KB3090322-x64.msu` package (KB3090322).

#### To install and verify maintenance mode hotfix

Use the `DiskFirmwarePackage.exe` package (KB3121899) to install disk firmware updates. These are disruptive updates and take around 30 minutes to complete. You can choose to install these in a planned maintenance window by connecting to the device serial console. To install disk firmware updates, follow the instructions below.

1. Place the device in the Maintenance mode. Note that you should not use Windows PowerShell remoting when connecting to a device in Maintenance mode. You will need to run this cmdlet on the device controller when connected through the device serial console. Type:
		
	`Enter-HcsMaintenanceMode`

	A sample output is shown below.

		Controller0>Enter-HcsMaintenanceMode
		Checking device state...

		In maintenance mode, your device will not service IOs and will be disconnected from the Microsoft Azure StorSimple Manager service. Entering maintenance mode will end the current session and reboot both controllers, which takes a few minutes to complete. Are you sure you want to enter maintenance mode?
		[Y] Yes [N] No (Default is "Y"): Y

		-----------------------MAINTENANCE MODE------------------------
		Microsoft Azure StorSimple Appliance Model 8100
		Name: Update2-8100-SHG0997879L76YD
		Software Version: 6.3.9600.17664
		Copyright (C) 2014 Microsoft Corporation. All rights reserved.
		You are connected to Controller0 - Passive
		---------------------------------------------------------------

		Serial Console Menu
		[1] Log in with full access
		[2] Log into peer controller with full access
		[3] Connect with limited access
		[4] Change language
		Please enter your choice>

	Both the controllers will be rebooted. After the reboot is complete, both controllers will be in the Maintenance mode. 

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
 
2.  After the installation is complete, the controller on which the maintenance mode hotfix was installed will be rebooted. Log in as option 1 with full access and verify the disk firmware version. Type:
	
	`Get-HcsFirmwareVersion`
  
	The expected disk firmware versions are: 

	`XMGG, XGEG, KZ50, F6C2, VR08`

	A sample output is shown below.


        -----------------------MAINTENANCE MODE------------------------
    	Microsoft Azure StorSimple Appliance Model 8100
    	Name: Update2-8100-SHG0997879L76YD
    	Software Version: 6.3.9600.17664
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

	 Run the `Get-HcsFirmwareVersion` command on the second controller to verify that the software version has been updated. You can then exit the maintenance mode. Type the following command for each device controller: 

    `Exit-HcsMaintenanceMode`
     
1. The controllers will be rebooted when you exit the Maintenance mode. After the disk firmware updates are successfully applied and the device has exited maintenance mode, return to the Azure classic portal. Maintenance mode updates are not updated on the portal until 24 hours have elapsed. 






 
 

