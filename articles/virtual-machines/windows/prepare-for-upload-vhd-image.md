---
title: Prepare a Windows VHD to upload to Azure | Microsoft Docs
description: How to prepare a Windows VHD or VHDX before uploading to Azure
services: virtual-machines-windows
documentationcenter: ''
author: genlin
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 7802489d-33ec-4302-82a4-91463d03887a
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 5/26/2017
ms.author: glimoli;genli

---
# Prepare a Windows VHD or VHDX to upload to Azure
To upload a Windows VM from on-premises to Azure, you must prepare the virtual hard disk (VHD or VHDX). Azure only supports generation 1 virtual machines that are in the VHD file format and have a fixed sized disk. The maximum size allowed for the VHD is 1,023 GB. You can convert a generation 1 virtual machine from VHDX to the VHD file format and from dynamically expanding to a fixed sized disk. But you can't change a virtual machine's generation. For more information, see [Should I create a generation 1 or 2 virtual machine in Hyper-V?](https://technet.microsoft.com/en-us/windows-server-docs/compute/hyper-v/plan/should-i-create-a-generation-1-or-2-virtual-machine-in-hyper-v)

## Convert the virtual disk to VHD and fixed size disk 
If you need to convert your virtual disk to the required format for Azure, use one of the methods in this section. Back up the VM before you run the virtual disk conversion process and make sure that the Windows VHD works correctly on the local server. Resolve any errors within the VM itself before you try to convert or upload it to Azure.

After you convert the disk, create a VM that uses the converted disk. Start and sign in to the VM to finish preparing the VM for upload.

### Convert disk using Hyper-V Manager
1. Open Hyper-V Manager and select your local computer on the left. In the menu above it, click **Action** > **Edit Disk**.
2. On the **Locate Virtual Hard Disk** screen, browse to, and select your virtual disk.
3. On the **Choose Action** screen, select **Convert** and **Next**.
4. If you need to convert from VHDX, select **VHD** and click **Next**
5. If you need to convert from dynamically expanding disk, select **Fixed size** and click **Next**
6. Browse to and select a path to save the new VHD file.
7. Click **Finish** to close.

### Convert disk using PowerShell
You can convert a virtual disk by using the [Convert-VHD](http://technet.microsoft.com/library/hh848454.aspx) cmdlet in Windows PowerShell. Select **Run as administrator** when you start PowerShell. 
The following example shows you how to convert from a VHDX to VHD, and from a dynamically expanding disk to fixed size:

```powershell
Convert-VHD –Path c:\test\MY-VM.vhdx –DestinationPath c:\test\MY-NEW-VM.vhd -VHDType Fixed
```
Replace the values for -Path with the path to the virtual hard disk that you want to convert and -DestinationPath with the new path and name for the converted disk.

### Convert from VMware VMDK disk format
If you have a Windows VM image in the [VMDK file format](https://en.wikipedia.org/wiki/VMDK), convert it to a VHD by using the [Microsoft Virtual Machine Converter](https://www.microsoft.com/download/details.aspx?id=42497). For more information, see the blog [How to Convert a VMware VMDK to Hyper-V VHD](http://blogs.msdn.com/b/timomta/archive/2015/06/11/how-to-convert-a-vmware-vmdk-to-hyper-v-vhd.aspx).

## Set Windows configurations for Azure

On the virtual machine you plan to upload to Azure, run all the following commands from the command prompt window with [administrative privileges](https://technet.microsoft.com/library/cc947813.aspx).

1. Remove any static persistent route on the routing table:
   
   * To view the route table, run `route print` from the command prompt window.
   * Check the **Persistence Routes** sections. If there is a persistent route, use [route delete](https://technet.microsoft.com/library/cc739598.apx) to remove it.
2. Remove the WinHTTP proxy:
   
    ```CMD
    netsh winhttp reset proxy
    ```
3. Set the disk SAN policy to [Onlineall](https://technet.microsoft.com/library/gg252636.aspx). 
   
    ```CMD
    diskpart 
    san policy=onlineall
    exit
    ```
    

4. Set Coordinated Universal Time (UTC) time for Windows and the startup type of the Windows Time (w32time) service to **Automatically**:
   
    ```CMD
    REG ADD HKLM\SYSTEM\CurrentControlSet\Control\TimeZoneInformation /v RealTimeIsUniversal /t REG_DWORD /d 1
    ```
    ```CMD
    sc config w32time start= auto
    ```

## Set services startup to Windows default values
Make sure that each of the following Windows services is set to the **Windows default values**. To reset the startup settings, run the following commands:
   
```CMD
sc config bfe start= auto
   
sc config dcomlaunch start= auto
   
sc config dhcp start= auto
   
sc config dnscache start= auto
   
sc config IKEEXT start= auto
   
sc config iphlpsvc start= auto
   
sc config PolicyAgent start= demand
   
sc config LSM start= auto
   
sc config netlogon start= demand
   
sc config netman start= demand
   
sc config NcaSvc start= demand
   
sc config netprofm start= demand
   
sc config NlaSvc start= auto
   
sc config nsi start= auto
   
sc config RpcSs start= auto
   
sc config RpcEptMapper start= auto
   
sc config termService start= demand
   
sc config MpsSvc start= auto
   
sc config WinHttpAutoProxySvc start= demand
   
sc config LanmanWorkstation start= auto
   
sc config RemoteRegistry start= auto
```

## Update Remote Desktop registry settings
1. If there are any self-signed certificates tied to the Remote Desktop Protocol (RDP) listener, remove them:
   
    ```CMD
    REG DELETE "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp\SSLCertificateSHA1Hash”
    ```
   
    For more information about configuring certificates for RDP listener, see [Listener Certificate Configurations in Windows Server ](https://blogs.technet.microsoft.com/askperf/2014/05/28/listener-certificate-configurations-in-windows-server-2012-2012-r2/)
2. Configure the [KeepAlive](https://technet.microsoft.com/library/cc957549.aspx) values for RDP service:
   
    ```CMD
    REG ADD "HKLM\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services" /v KeepAliveEnable /t REG_DWORD  /d 1 /f
    ```
    ```CMD
    REG ADD "HKLM\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services" /v KeepAliveInterval /t REG_DWORD  /d 1 /f
    ```
    ```CMD
    REG ADD "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\Winstations\RDP-Tcp" /v KeepAliveTimeout /t REG_DWORD /d 1 /f
    ```
3. Configure the authentication mode for the RDP service:
   
    ```CMD
    REG ADD "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp" /v UserAuthentication /t REG_DWORD  /d 1 /f
   ```
    ```CMD
    REG ADD "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp" /v SecurityLayer /t REG_DWORD  /d 1 /f
   ```
    ```CMD
    REG ADD "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp" /v fAllowSecProtocolNegotiation /t REG_DWORD  /d 1 /f
    ```
4. Enable RDP service by adding the following subkeys to the registry:
   
    ```CMD
    REG ADD "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server" /v fDenyTSConnections /t REG_DWORD  /d 0 /f
    ```

## Configure Windows Firewall rules
1. Run the following command in PowerShell to allow WinRM through the three firewall profiles (Domain, Private, and Public) and enable PowerShell Remote service:
   
   ```powershell
   Enable-PSRemoting -force
   ```
2. Run the following commands in the command prompt window to make sure that the following guest operating system firewall rules are in place:
   
   * Inbound
   
   ```CMD
   netsh advfirewall firewall set rule dir=in name="File and Printer Sharing (Echo Request - ICMPv4-In)" new enable=yes
   
   netsh advfirewall firewall set rule dir=in name="Network Discovery (LLMNR-UDP-In)" new enable=yes
   
   netsh advfirewall firewall set rule dir=in name="Network Discovery (NB-Datagram-In)" new enable=yes
   
   netsh advfirewall firewall set rule dir=in name="Network Discovery (NB-Name-In)" new enable=yes
   
   netsh advfirewall firewall set rule dir=in name="Network Discovery (Pub-WSD-In)" new enable=yes
   
   netsh advfirewall firewall set rule dir=in name="Network Discovery (SSDP-In)" new enable=yes
   
   netsh advfirewall firewall set rule dir=in name="Network Discovery (UPnP-In)" new enable=yes
   
   netsh advfirewall firewall set rule dir=in name="Network Discovery (WSD EventsSecure-In)" new enable=yes
   
   netsh advfirewall firewall set rule dir=in name="Windows Remote Management (HTTP-In)" new enable=yes
   
   netsh advfirewall firewall set rule dir=in name="Windows Remote Management (HTTP-In)" new enable=yes
   ```
   
   * Inbound and outbound
   
   ```CMD
   netsh advfirewall firewall set rule group="Remote Desktop" new enable=yes
   
   netsh advfirewall firewall set rule group="Core Networking" new enable=yes
   ```
   
   * Outbound
   
   ```CMD
   netsh advfirewall firewall set rule dir=out name="Network Discovery (LLMNR-UDP-Out)" new enable=yes
   
   netsh advfirewall firewall set rule dir=out name="Network Discovery (NB-Datagram-Out)" new enable=yes
   
   netsh advfirewall firewall set rule dir=out name="Network Discovery (NB-Name-Out)" new enable=yes
   
   netsh advfirewall firewall set rule dir=out name="Network Discovery (Pub-WSD-Out)" new enable=yes
   
   netsh advfirewall firewall set rule dir=out name="Network Discovery (SSDP-Out)" new enable=yes
   
   netsh advfirewall firewall set rule dir=out name="Network Discovery (UPnPHost-Out)" new enable=yes
   
   netsh advfirewall firewall set rule dir=out name="Network Discovery (UPnP-Out)" new enable=yes
   
   netsh advfirewall firewall set rule dir=out name="Network Discovery (WSD Events-Out)" new enable=yes
   
   netsh advfirewall firewall set rule dir=out name="Network Discovery (WSD EventsSecure-Out)" new enable=yes
   
   netsh advfirewall firewall set rule dir=out name="Network Discovery (WSD-Out)" new enable=yes
   ```

## Verify VM is healthy, secure, and accessible with RDP 
1. In the command prompt window, run `winmgmt /verifyrepository` to confirm that the Windows Management Instrumentation (WMI) repository is consistent. If the repository is corrupted, see the blog post [WMI: Repository Corruption, or Not?](https://blogs.technet.microsoft.com/askperf/2014/08/08/wmi-repository-corruption-or-not)
2. Set the Boot Configuration Data (BCD) settings:
   
   ```CMD
   bcdedit /set {bootmgr} integrityservices enable
   
   bcdedit /set {default} device partition=C:
   
   bcdedit /set {default} integrityservices enable
   
   bcdedit /set {default} recoveryenabled Off
   
   bcdedit /set {default} osdevice partition=C:
   
   bcdedit /set {default} bootstatuspolicy IgnoreAllFailures
   ```
3. Remove any extra Transport Driver Interface filters, such as software that analyzes TCP packets.
4. To make sure the disk is healthy and consistent, run the `CHKDSK /f` command in the command prompt window. Type "Y" to schedule the check and restart the VM.
5. Uninstall any other third-party software and driver related to physical components or any other virtualization technology.
6. Make sure that a third-party application is not using Port 3389. This port is used for the RDP service in Azure. You can run `netstat -anob` in the command prompt window to see the ports that are used by the applications.
7. If the Windows VHD that you want to upload is a domain controller, follow [these extra steps](https://support.microsoft.com/kb/2904015) to prepare the disk.
8. Reboot the VM to make sure that Windows is still healthy can be reached by using the RDP connection.
9. Reset the current local administrator password and make sure that you can use this account to sign in to Windows through the RDP connection. This access permission is controlled by the "Allow log on through Remote Desktop Services" Group Policy object. You can view this object in the Local Group Policy Editor under "Computer Configuration\Windows Settings\Security Settings\Local Policies\User Rights Assignment."

## Install Windows Updates
Install the latest updates for Windows. If that's not possible, make sure that the following updates are installed:
   
   * [KB3137061](https://support.microsoft.com/kb/3137061) Microsoft Azure VMs don't recover from a network outage and data corruption issues occur
   * [KB3115224](https://support.microsoft.com/kb/3115224) Reliability improvements for VMs that are running on a Windows Server 2012 R2 or Windows Server 2012 host
   * [KB3140410](https://support.microsoft.com/kb/3140410) MS16-031: Security update for Microsoft Windows to address elevation of privilege: March 8, 2016
   * [KB3063075](https://support.microsoft.com/kb/3063075) Many ID 129 events are logged when you run a Windows Server 2012 R2 virtual machine in Microsoft Azure
   * [KB3114025](https://support.microsoft.com/kb/3114025) Slow performance when you access Azure files storage from Windows 8.1 or Server 2012 R2
   * [KB3033930](https://support.microsoft.com/kb/3033930) Hotfix increases the 64K limit on RIO buffers per process for Azure service in Windows
   * [KB3004545](https://support.microsoft.com/kb/3004545) You cannot access virtual machines that are hosted on Azure hosting services through a VPN connection in Windows
   * [KB3082343](https://support.microsoft.com/kb/3082343) Cross-Premises VPN connectivity is lost when Azure site-to-site VPN tunnels use Windows Server 2012 R2 RRAS
   * [KB3146723](https://support.microsoft.com/kb/3146723) MS16-048: Description of the security update for CSRSS: April 12, 2016
   * [KB2904100](https://support.microsoft.com/kb/2904100) System freezes during disk I/O in Windows
     
## Run Sysprep  <a id="step23"></a>    
If you want to create an image to deploy to multiple VMs, you need to generalize the image by running Sysprep before you upload the VHD to Azure. You don't need to run Sysprep to use a specialized VHD. 

Sysprep removes all your personal account information, among other things, and prepares the machine to be used as an image. For details about Sysprep, see [How to Use Sysprep: An Introduction](http://technet.microsoft.com/library/bb457073.aspx).

Make sure the server roles running on the machine are supported by Sysprep. For more information, see [Sysprep Support for Server Roles](https://msdn.microsoft.com/windows/hardware/commercialize/manufacture/desktop/sysprep-support-for-server-roles)

1. Sign in to the Windows virtual machine.
2. Open the Command Prompt window as an administrator. Change the directory to **%windir%\system32\sysprep**, and then run `sysprep.exe`.
3. In the **System Preparation Tool** dialog box, select **Enter System Out-of-Box Experience (OOBE)**, and make sure that the **Generalize** check box is selected.
4. In **Shutdown Options**, select **Shutdown**.
5. Click **OK**.
   
    ![Start Sysprep](./media/upload-generalized-managed/sysprepgeneral.png)
6. When Sysprep completes, it shuts down the virtual machine. Do not restart the VM.




## Complete recommended configurations
The following settings do not affect VHD uploading. However, we strongly recommend that you have them configured.

* Install the [Azure Virtual Machines Agent](http://go.microsoft.com/fwlink/?LinkID=394789&clcid=0x409). After you install the agent, you can enable VM extensions. The VM extensions implement most of the critical functionality that you want to use with your VMs like resetting passwords, configuring RDP, and many others.
* The Dump log can be helpful in troubleshooting Windows crash issues. Enable the Dump log collection:
  
    ```CMD
    REG ADD "HKLM\SYSTEM\CurrentControlSet\Control\CrashControl" /v CrashDumpEnabled /t REG_DWORD /d 2 /f`
  
    REG ADD "HKLM\SOFTWARE\Microsoft\Windows\Windows Error Reporting\LocalDumps" /v DumpFolder /t REG_EXPAND_SZ /d "c:\CrashDumps" /f
  
    REG ADD "HKLM\SOFTWARE\Microsoft\Windows\Windows Error Reporting\LocalDumps" /v DumpCount /t REG_DWORD /d 10 /f
  
    REG ADD "HKLM\SOFTWARE\Microsoft\Windows\Windows Error Reporting\LocalDumps" /v DumpType /t REG_DWORD /d 2 /f
  
    sc config wer start= auto
    ```
* After the VM is created in Azure, configure the system defined size pagefile on drive D:
  
    ```CMD
    REG ADD "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /t REG_MULTI_SZ /v PagingFiles /d "D:\pagefile.sys 0 0" /f
    ```

## Next steps
* [Upload a Windows VM image to Azure for Resource Manager deployments](upload-generalized-managed.md)

