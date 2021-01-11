---
title: Troubleshoot Windows Virtual Desktop Agent Issues - Azure
description: How to resolve common agent and connectivity issues.
author: Sefriend
ms.topic: troubleshooting
ms.date: 12/16/2020
ms.author: sefriend
manager: clarkn
---
# Troubleshoot common Windows Virtual Desktop Agent issues

The Windows Virtual Desktop Agent can cause connection issues because of multiple factors:
   - An error on the broker that makes the agent stop the service.
   - Problems with updates.
   - Issues with installing the during agent installation, which disrupts connection to the session host.

This article will guide you through solutions to these common scenarios and how to address connection issues.

## Restart the boot loader

If the agent boot loader isn't running or you're receiving an INVALID_REGISTRATION_TOKEN error, follow the instructions in this section.

### Error: The RDAgentBootLoader has stopped running.

**Cause:** If you're seeing that *RDAgentBootLoader* is either stopped or not running, this means that the boot loader, which loads the agent, was unable to install the agent properly and the agent service isn't running.

**Fix:** Start the RDAgent boot loader.

1. In the Services window, right-click **Remote Desktop Agent Loader**.
2. Select **Start**. If this option is greyed out for you, you don't have administrator permissions and will need to get them to start the service.
3. Wait 10 seconds, then right-click **Remote Desktop Agent Loader**.
4. Select **Refresh**.
5. If the service stops after you started and refreshed it, you may have a registration failure. For more information, see [INVALID_REGISTRATION_TOKEN](#error-invalid_registration_token).

### Error: INVALID_REGISTRATION_TOKEN

**Cause:** The registration token that you have isn't recognized as valid.

**Fix:** Create a new registration token, change IsRegistered to 0, restart the RDAgent BootLoader, and check that IsRegistered is 1.

1. To create a new registration token, follow steps 1-5 in [Generate a new registration key for the VM](#generate-a-new-registration-key-for-the-vm).
2. Open the Registry Editor (in the Start menu, type *regedit*). 
3. Navigate to HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\RDInfraAgent. 
4. Double-click *IsRegistered*. 
5. In the *Value data:* entry box, type *0* and select *Ok*. 
6. Double-click *RegistrationToken*. 
7. In the *Value data:* entry box, paste the registration token from step 1. 

   > [!div class="mx-imgBorder"]
   > ![Screenshot of IsRegistered 0](media/isregisteredCopy.PNG)

8. Open a command prompt as an administrator.
9. Enter **net stop RDAgentBootLoader**. 
10. Enter **net start RDAgentBootLoader**. 
11. Open the Registry Editor.
12. Go to **HKEY_LOCAL_MACHINE** > **SOFTWARE** > **Microsoft** > **RDInfraAgent**.
13. Verify that *IsRegistered* is set to 1 and there is nothing in the data column for *RegistrationToken*. 

   > [!div class="mx-imgBorder"]
   > ![Screenshot of IsRegistered 1](media/isregistered.PNG)

## Ensure that your VMs can connect to the broker and gateway

Follow these instructions if you're having issues with service connectivity because you cannot connect to the broker, you're receiving an INVALID_FORM error, or you're receiving any 3019, 3703, or 3702 event.

### Error: Agent cannot connect to broker with error NOT_FOUND. URL or INVALID_FORM.

**Cause:** The agent cannot connect to the broker and is unable to reach a particular URL. This may be because of your firewall or DNS settings.

**Fix:** To check that you can reach BrokerURI and BrokerURIGlobal:
1. Open the Registry Editor (in Start menu, type *regedit*). 
2. Go to **HKEY_LOCAL_MACHINE** > **SOFTWARE** > **Microsoft** > **RDInfraAgent**. 
3. Make note of the values for *BrokerURI* and *BrokerURIGlobal*.

   > [!div class="mx-imgBorder"]
   > ![Screenshot of broker uri and broker uri global](media/brokeruri.PNG)

 
4. Open a browser and go to *\<BrokerURI\>api/health*. 
   - Make sure you use the value from step 3 in the *BrokerURI*. In this section's example, it would be <https://rdbroker-g-us-r0.wvd.microsoft.com/api/health>.
5. Open another tab in the browser and go to *\<BrokerURIGlobal\>api/health*. 
   - Make sure you use the value from step 3 in the *BrokerURIGlobal* link. In this section's example, it would be <https://rdbroker.wvd.microsoft.com/api/health>.
6. If the network isn't blocking broker connection, both pages will load successfully and will show a message that says :RDBroker is Healthy," as shown in the following screen shots. 

   > [!div class="mx-imgBorder"]
   > ![Screenshot of successfully loaded broker uri access](media/brokuri.PNG)

   > [!div class="mx-imgBorder"]
   > ![Screenshot of successfully loaded broker global uri access](media/brokglobal.PNG)
 

7. If the network is blocking broker connection, the pages will not load, as shown below. 

   > [!div class="mx-imgBorder"]
   > ![Screenshot of unsuccessful loaded broker access](media/unsuccessfulbrokeruri.PNG)

   > [!div class="mx-imgBorder"]
   > ![Screenshot of unsuccessful loaded broker global access](media/unsuccessfulbrokerglobal.PNG)

8. If the network is blocking these URLs, you will need to unblock the required URLs. For more information, see [Required URL List](safe-url-list.md).

### Error: 3703, 3702 or 3019.

**Cause:** This error happens when the service can't reach the WebSocket Transport URLs or RDGateway URLs. To successfully connect to your session host and allow network traffic to these endpoints to bypass restrictions, you must unblock the URLs from the [Required URL List](safe-url-list.md). Also, make sure your firewall or proxy settings don't block these URLs. Unblocking these URLs is required to use Windows Virtual Desktop.

**Fix:** Verify that your firewall and/or DNS settings are not blocking these URLs.
1. [Use Azure Firewall to protect Windows Virtual Desktop deployments.](../firewall/protect-windows-virtual-desktop.md).
2. Configure your [Azure Firewall DNS settings](../firewall/dns-settings.md).

## Make sure you don't have any conflicting group policies enabled

Follow these instructions if you have any group policies enabled. Some group policies disable the agent installation process through Windows Installer or the command prompt. If your policy disables installation, you will receive an InstallMsiException or Win32Exception error.

### Error: InstallMsiException.

**Cause:** This error appears when the installer is already running for another application while you're trying to install the agent, or a policy is blocking the msiexec.exe program from running.

**Fix:** To make sure the installation process goes smoothly, don't enable any policies or configurations that block Windows Installer or msiexec.exe.
To disable the blocking policies:
   - Turn off Windows Installer  
      - Category Path: Computer Configuration\Administrative Templates\Windows Component\Windows Installer\ 
    
>[!NOTE]
>This isn't a comprehensive list of policies, just the ones we're currently aware of.

### Error: Win32Exception.

**Cause:** This error appears when an enabled policy blocks cmd.exe from launching. Blocking this program prevents you from running the console window, which is what you need to use to restart the service whenever the agent updates.

**Fix:** Disable the following policies:
   - Prevent access to the command prompt   
      - Category Path: User Configuration\Administrative Templates\System\ 
    
>[!NOTE]
>This isn't a comprehensive list of policies, just the ones we're currently aware of.

## Make Regkey changes

Follow these instructions if you're having issues with the stack listener not working, your VMs show as Unavailable, or your VMs are missing a heartbeat to the service.

### Error: Stack listener isn't working or your VM shows as Unavailable, and you're running on Windows 10 2004.

**Cause:** Run *qwinsta* in your Command Prompt and make note of the version number that appears next to *rdp-sxs*. If you're not seeing the *rdp-tcp* and *rdp-sxs* components say *Listen* next to them or they aren't showing up at all after running *qwinsta*, it means that there's a stack issue. Stack updates get installed along with agent updates, and when this installation goes awry, the Windows Virtual Desktop Listener won't work.

**Fix:** Change fEnableWinStation and fReverseConnectMode to 1.
1. Open the Registry Editor.
2. Go to **HKEY_LOCAL_MACHINE** > **SYSTEM** > **CurrentControlSet** > **Control** > **Terminal Server** > **WinStations**.
3. Under *WinStations* you may see several folders for different stack versions, select the folder that matches the version information you saw when running *qwinsta* in your Command Prompt.
4. Find *fReverseConnectMode* and make sure its data value is 1. Also make sure that *fEnableWinStation* is set to 1.

   > [!div class="mx-imgBorder"]
   > ![Screenshot of fReverseConnectMode](media/fenable2.PNG)

5. If *fReverseConnectMode* isn't set to 1, select *fReverseConnectMode* and enter **1** in its value field. 
6. If *fEnableWinStation* isn't set to 1, select **fEnableWinStation** and enter **1** into its value field.

>[!NOTE]
>To change the *fReverseConnectMode* or *fEnableWinStation* mode for multiple VMs at a time, you can do one of the following two things:
>
>- Export the registry key from the machine that you already have working and import it into all other machines that need this change.
>- Create a general policy object (GPO) that sets the registry key value for the machines that need the change.

7. Go to **HKEY_LOCAL_MACHINE** > **SYSTEM** > **CurrentControlSet** > **Control** > **Terminal Server** > **ClusterSettings**.
8. Under *ClusterSettings*, find *SessionDirectoryListener* and make sure its data value is *rdp-sxs...*.
9. If *SessionDirectoryListener* isn't set to *rdp-sxs...*, you'll need to [reinstall the agent and boot loader](#re-register-your-vm-and-reinstall-the-agent-and-bootloader). This will reinstall the side-by-side stack.

### Error: CheckSessionHostDomainIsReachableAsync -SessionHost unhealthy

**Cause:** Your server isn't picking up a heartbeat from the Windows Virtual Desktop service.

**Fix:** Change the heartbeat threshold:
1. Open your command prompt as an administrator.
2. Enter the **qwinsta** command and run it.
3. There should be two stack components displayed: *rdp-tcp* and *rdp-sxs*. 
   - Depending on the version of the OS you're using, *rdp-sxs* may be followed by the build number as shown in teh following screen shot. If it is, make sure to write this number down for later.
4. Open the Registry Editor.
5. Go to **HKEY_LOCAL_MACHINE** > **SYSTEM** > **CurrentControlSet** > **Control** > **Terminal Server** > **WinStations**.
6. Under *WinStations* you may see several folders for different stack versions. Select the folder that matches the version number from step 3.
7. Create a new registry DWORD by right-clicking the registry editor, then selecting **New** > **DWORD (32-bit) Value**. When you create the DWORD, enter the following values:
   - HeartbeatInterval: 10000
   - HeartbeatWarnCount: 30 
   - HeartbeatDropCount: 60 
8. Restart your VM.

## My VMs are unavailable or can't connect to the agent

If the agent says your VMs are unavailable, or you receive an error that says "Connection not found: RDAgent does not have an active connection to the broker," you'll need to to increase your VM capacity.

### Error: DownloadMsiException

**Cause:** This error appears when there isn't enough space on the disk for the RDAgent.

**Fix:** Make space on your disk by:
   - Deleting files that are no longer in user
   - Increasing the storage capacity of your VM

### Error: VMs are showing as Unavailable or you're receiving *Connection not found: RDAgent does not have an active connection to the broker* error.

**Cause:** Your VMs are at their connection limit, so the VM can't accept new connections.

**Fix:** You can resolve this issue by:
   - Decreasing the max session limit. This ensures that resources are more evenly distributed across session hosts and will prevent resource depletion.
   - Increasing the resource capacity of the VMs.

## Re-register your VM and reinstall the agent and boot loader

Follow these instructions if one or more of the following apply to you:
- Your VM is stuck in upgrading or unavailable
- Your stack listener isn't working and you're running on Windows 10 1809, 1903, or 1904
- You're receiving an EXPIRED_REGISTRATION_TOKEN error
- You're not seeing your VMs show up in the session hosts list

### Uninstall all agent, boot loader, and stack component programs

1. Sign in to your VM as an administrator. 
2. Go to **Control Panel** > **Programs** > **Programs and Features**.
3. Remove the following programs:
   - Remote Desktop Agent Boot Loader
   - Remote Desktop Services Infrastructure Agent
   - Remote Desktop Services Infrastructure Geneva Agent
   - Remote Desktop Services SxS Network Stack
   
>[!NOTE]
>You may see multiple instances of these programs. Make sure to remove all of them.

   > [!div class="mx-imgBorder"]
   > ![Screenshot of uninstalling programs](media/uninstall.PNG)

### Remove the session host from the host pool.

1. Go to the *Overview* page for the host pool that your VM is in, in the [Azure portal](https://portal.azure.com). 
2. Go to the **Session Hosts** tab to see the list of all session hosts in that host pool.
3. Look at the list of session hosts and select the VM that you want to remove.
4. Select **Remove**.  

   > [!div class="mx-imgBorder"]
   > ![Screenshot of removing VM from host pool](media/remove.PNG)

### Generate a new registration key for the VM

1. Open the [Azure portal](https://portal.azure.com) and go to the **Overview** page for the host pool of the VM you want to edit.
2. Select **Registration key**.

   > [!div class="mx-imgBorder"]
   > ![Screenshot of registration key in portal](media/regkey.PNG)

3. Open the **Registration key** tab and select **Generate new key**.
4. Enter the expiration date and then select **Ok**.  

>[!NOTE]
>The expiration date can be no less than an hour and no longer than 27 days from its generation time and date. We highly recommend you set the expiration date to the 27 day maximum.

5. Copy the newly generated key to your clipboard. You'll need this key later.

### Reinstall the agent and boot loader.

1. Sign in to your VM as an administrator and follow the instructions in [Create host pools using PowerShell](create-host-pools-powershell.md#register-the-virtual-machines-to-the-windows-virtual-desktop-host-pool).
2. Download the *Windows Virtual Desktop Agent* and the *Windows Virtual Desktop Agent Bootloader* that are linked in parts 2 and 3 under *Register the virtual machines to the Windows Virtual Desktop host pool*.

   > [!div class="mx-imgBorder"]
   > ![Screenshot of agent and bootloader download page](media/downloads.PNG)

3. Right-click the agent and boot loader installers you just downloaded.
4. Select **Properties**.
5. Select **Unblock**.
6. Select **Ok**.
7. Run the agent installer.
8. When the installer asks you for the registration token, paste the registration key from your clipboard. 

   > [!div class="mx-imgBorder"]
   > ![Screenshot of pasted registration token](media/pasted-registration-token.PNG)

9. Run the boot loader installer.
10. Go to the [Azure portal](https://portal.azure.com) and open the **Overview** page for the host pool your VM belongs to.
11. Go to the **Session Hosts** tab to see the list of all session hosts in that host pool.
12. You should now see the session host registered in the host pool with the status *Available*. 

   > [!div class="mx-imgBorder"]
   > ![Screenshot of available session host](media/hostpool.PNG)

## Error: Operating a Pro VM or other unsupported OS

**Cause:** The side-by-side stack is only supported by Windows Enterprise or Windows Server SKUs, which means that OSes like Pro VM aren't. If you don't have an Enterprise or Server SKU, the stack will be installed on your VM but won't be activated, so you won't see it show up when you run **qwinsta** in your command line.

**Fix:** Create a VM that is Windows Enterprise or Windows Server.
1. Go to [Virtual machine details](create-host-pools-azure-marketplace.md#virtual-machine-details) and follow steps 1-12 to set up one of the following recommended images:
   - Windows 10 Enterprise multi-session, version 1909
   - Windows 10 Enterprise multi-session, version 1909 + Microsoft 365 Apps
   - Windows Server 2019 Datacenter
   - Windows 10 Enterprise multi-session, version 2004
   - Windows 10 Enterprise multi-session, version 2004 + Microsoft 365 Apps
2. Select **Review and Create**.

### Error: NAME_ALREADY_REGISTERED

**Cause:** The name of your VM has already been registered and is probably a duplicate.

**Fix:** Remove the session host from the host pool and create another one.
1. Follow steps 1-4 to [remove the session host from the host pool](#remove-the-session-host-from-the-host-pool).
2. [Create another VM](expand-existing-host-pool.md#add-virtual-machines-with-the-azure-portal). Make sure to choose a unique name for this VM.
3. Go to the Azure portal](https://portal.azure.com) and open the **Overview** page for the host pool your VM was in. 
4. Open the **Session Hosts** tab and check to make sure all session hosts are in that host pool.
5. Wait for 5-10 minutes for the session host status to say *Available*.

   > [!div class="mx-imgBorder"]
   > ![Screenshot of available session host](media/hostpool.PNG)

## Next steps

If the issue continues, create a support case and include detailed information about the problem you're having and any actions you've taken to try to resolve it. The following list includes other resources you can use to troubleshoot issues in your Windows Virtual Desktop deployment.

- For an overview on troubleshooting Windows Virtual Desktop and the escalation tracks, see [Troubleshooting overview, feedback, and support](troubleshoot-set-up-overview.md).
- To troubleshoot issues while creating a host pool in a Windows Virtual Desktop environment, see [Environment and host pool creation](troubleshoot-set-up-issues.md).
- To troubleshoot issues while configuring a virtual machine (VM) in Windows Virtual Desktop, see [Session host virtual machine configuration](troubleshoot-vm-configuration.md).
- To troubleshoot issues with Windows Virtual Desktop client connections, see [Windows Virtual Desktop service connections](troubleshoot-service-connection.md).
- To troubleshoot issues with Remote Desktop clients, see [Troubleshoot the Remote Desktop client](troubleshoot-client.md).
- To troubleshoot issues when using PowerShell with Windows Virtual Desktop, see [Windows Virtual Desktop PowerShell](troubleshoot-powershell.md).
- To learn more about the service, see [Windows Virtual Desktop environment](environment-setup.md).
- To go through a troubleshoot tutorial, see [Tutorial: Troubleshoot Resource Manager template deployments](../azure-resource-manager/templates/template-tutorial-troubleshoot.md).
- To learn about auditing actions, see [Audit operations with Resource Manager](../azure-resource-manager/management/view-activity-logs.md).
- To learn about actions to determine the errors during deployment, see [View deployment operations](../azure-resource-manager/templates/deployment-history.md).