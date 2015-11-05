<!--author=SharS last changed: 9/17/15-->

#### To install Update 1.2 from Windows PowerShell for StorSimple

1. Perform the following steps to download the software update.

    1. Start Internet Explorer and navigate to [http://catalog.update.microsoft.com/v7/site/Home.aspx](http://catalog.update.microsoft.com/v7/site/Home.aspx).
    2. If you are a first-time user, you will be prompted to install a Microsoft Update Catalog. Click **Install**.
    
        ![Install catalog](./media/storsimple-install-update-option-1/HCS_InstallCatalog-include.png)

    3. You will see a catalog search screen. Enter **3063418** in the search box, and click **Search**.

        ![Search catalog](./media/storsimple-install-update-option-1/HCS_SearchCatalog-include.png)

    4. You will see the **StorSimple Update 1.2 Appliance Update** bundle. Click **Add**. The update will be added to the basket. 

        ![Update bundle](./media/storsimple-install-update-option-1/HCS_UpdateBundle-include.png) 

    5. Click **View Basket**.
 
        ![View basket](./media/storsimple-install-update-option-1/HCS_InstallBasket-include.png) 

    6. Click **Download**. Specify or **Browse** to a local location where you want the download to appear. The update will be downloaded in a **StorSimple Update 1.2 Appliance Update bundle** (KB3063418) folder to the chosen location. The folder can also be copied to a network share that is reachable from the device. 
    
	This procedure describes how to install software device update as a hotfix, the disk firmware updates from the Microsoft Update server, and the LSI driver and Windows Updates from the Management Portal. You could however choose to install software, driver and disk firmware updates all as hotfixes. You will then need to download StorSimple 1.2 SAS Controller Update (KB3043005) and StorSimple 1.2 Disk Firmware Update (KB3063416) and copy to the same shared folder. To install disk firmware updates as a hotfix, follow the instructions in [installing maintenance mode hotfixes via Windows PowerShell for StorSimple](storsimple-update-device.md#install-hotfixes-via-windows-powershell-for-storsimple).
    
	> [AZURE.NOTE] The hotfix must be accessible from both controllers to detect any potential error messages from the peer controller. 
            
2. To install the software update, access the Windows PowerShell interface on your StorSimple device serial console. Follow the detailed instructions in [Use PuTTy to connect to the serial console](storsimple-deployment-walkthrough.md#use-putty-to-connect-to-the-device-serial-console).

3. At the command prompt, press **Enter**.

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
    
9. You will now install the disk firmware updates that are disruptive and take around 30-45 minutes to complete. You can choose to install these in a planned maintenance window by connecting to the device serial console. To install disk firmware updates, follow the instructions in [Install Maintenance mode updates via the Winwdow PowerShell for StorSimple](storsimple-update-device.md#install-maintenance-mode-updates-via-windows-powershell-for-storsimple).  

10. After the disk firmware updates are successfully applied and the device has exited maintenance mode, return to the Management Portal. Maintenance mode updates are not updated on the portal until 24 hours have elapsed. You may need to wait before you apply the remaining non-disruptive updates from the Management Portal. 

11. When you are ready to apply updates, navigate to **Maintenance** page and from the bottom of the page, click **Scan Updates**. You will be notified that updates are available, these include the driver and the Windows Updates. Click **Install Updates** to begin the install. You are done after all the updates are successfully installed. 





 
 

