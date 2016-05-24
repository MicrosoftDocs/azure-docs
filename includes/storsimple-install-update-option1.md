<!--author=SharS last changed: 03/17/2016-->

#### To download hotfixes

Perform the following steps to download the software update.

1. Start Internet Explorer and navigate to [http://catalog.update.microsoft.com](http://catalog.update.microsoft.com).

2. If this is your first time using the Microsoft Update Catalog on this computer, click **Install** when prompted to install the Microsoft Update Catalog add-on.
    ![Install catalog](./media/storsimple-install-update-option-1/HCS_InstallCatalog-include.png)

3. In the search box of the Microsoft Update Catalog, enter the Knowledge Base (KB) number of the hotfix you want to download, for example **3063418**, and then click **Search**.

4. You will see the **StorSimple Update 1.2 Appliance Update** bundle. Click **Add**. The update will be added to the basket.

5. Search for any additional hotfixes listed in the table above (**3043005** and **3063416**), and add each the basket.

5. Click **View Basket**.

    ![View basket](./media/storsimple-install-update-option-1/HCS_InstallBasket-include.png)

6. Click **Download**. Specify or **Browse** to a local location where you want the downloads to appear. The updates are downloaded to the specified location and placed in a subfolder with the same name as the update. The folder can also be copied to a network share that is reachable from the device.

>   [AZURE.NOTE]
The hotfixes must be accessible from both controllers to detect any potential error messages from the peer controller.

#### To install and verify regular mode hotfixes
Perform the following steps to install and verify the regular-mode hotfixes. If you already installed them using the Azure Portal, skip ahead to [install and verify maintenance mode hotfixes](#to-install-and-verify-maintenance-mode-hotfixes).

1. To install the software update, access the Windows PowerShell interface on your StorSimple device serial console. Follow the detailed instructions in [Use PuTTy to connect to the serial console](storsimple-deployment-walkthrough.md#use-putty-to-connect-to-the-device-serial-console). At the command prompt, press **Enter**.

4. Select **Option 1** to log on to the device with full access.

5. To install the update package, at the command prompt, type:

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
        LastHotfixTimestamp : 9/02/2015 10:36:13 PM
        LastUpdateTimestamp : 9/02/2015 10:35:25 PM
        Controller0Events   :
        Controller1Events   :
        ````

     The following sample output indicates that the update is finished. The `RunInProgress` will be `False` when the update has completed.

        ````
        Controller1>Get-HcsUpdateStatus

        RunInprogress       : False
        LastHotfixTimestamp : 9/02/2015 10:56:13 PM
        LastUpdateTimestamp : 9/02/2015 10:35:25 PM
        Controller0Events   :
        Controller1Events   :

        ````

	> [AZURE.NOTE] Occasionally, the cmdlet reports `False` when the update is still in progress. To ensure that the hotfix is complete, wait for a few minutes, rerun this command and verify that the `RunInProgress` is `False`. If it is, then the hotfix has completed.

8. After the software update is complete, verify the system software versions. Type the following command:

    `Get-HcsSystem`

    You should see the following versions:

    - HcsSoftwareVersion: 6.3.9600.17584
    - CisAgentVersion: 1.0.9049.0
    - MdsAgentVersion: 26.0.4696.1433

	If the version numbers do not change after applying the update, it indicates that the hotfix has failed to apply. Should you see this, please contact [Microsoft Support](storsimple-contact-microsoft-support.md) for further assistance.

9. Repeat steps 3-5 to install the remaining regular-mode hotfix (KB3043005).

#### To install and verify maintenance mode hotfixes

Use KB3063416 to install disk firmware updates. These are disruptive updates and take around 30-45 minutes to complete. You can choose to install these in a planned maintenance window by connecting to the device serial console.

To install the disk firmware updates, follow the instructions below.

1. Place the device in Maintenance mode. Note that you should not use Windows PowerShell remoting when connecting to a device in Maintenance mode. You will need to run this cmdlet on the device controller when connected through the device serial console. Type:

    `Enter-HcsMaintenanceMode`

	A sample output is shown below.

		Controller0>Enter-HcsMaintenanceMode
		Checking device state...

		In maintenance mode, your device will not service IOs and will be disconnected from the Microsoft Azure StorSimple Manager service. Entering maintenance mode will end the current session and reboot both controllers, which takes a few minutes to complete. Are you sure you want to enter maintenance mode?
		[Y] Yes [N] No (Default is "Y"): Y

		-----------------------MAINTENANCE MODE------------------------
		Microsoft Azure StorSimple Appliance Model 8100
		Name: Update1-8100-SHG0997879L76YD
		Software Version: 6.3.9600.17584
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
    	This operation starts a hotfix installation and could reboot one or both of the controllers. Are you sure you want to continue?
    	[Y] Yes [N] No (Default is "Y"): Y
    	WARNING: Installation is currently in progress. This operation can take several minutes to complete.

1.  Monitor the install progress using `Get-HcsUpdateStatus` command. The update is complete when the `RunInProgress` changes to `False`.

2.  After the installation is complete, the controller on which the maintenance mode hotfix was installed will be rebooted. Log in as option 1 with full access and verify the disk firmware version. Type:

	`Get-HcsFirmwareVersion`

    The expected disk firmware versions are:

    `XMGG, XGEE, KZ50, F6C2, VR08`

    Run the `Get-HcsFirmwareVersion` command on the second controller to verify that the software version has been updated. You can then exit the maintenance mode. Type the following command for each device controller:

    `Exit-HcsMaintenanceMode`

1. The controllers restart when you exit Maintenance mode. After the disk firmware updates are successfully applied and the device has exited maintenance mode, return to the Azure classic portal. Note that the portal might not show that you installed the Maintenance mode updates for 24 hours.
