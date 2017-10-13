---
title: Prepare a Windows VHD to upload to Azure | Microsoft Docs
description: How to prepare a Windows VHD or VHDX before uploading to Azure
services: virtual-machines-windows
documentationcenter: ''
author: glimoli
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 7802489d-33ec-4302-82a4-91463d03887a
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 08/01/2017
ms.author: genli

---
# Prepare a Windows VHD or VHDX to upload to Azure
Before you upload a Windows  virtual machines (VM) from on-premises to Microsoft Azure, you must prepare the virtual hard disk (VHD or VHDX). Azure supports only generation 1 VMs that are in the VHD file format and have a fixed sized disk. The maximum size allowed for the VHD is 1,023 GB. You can convert a generation 1 VM from the VHDX file system to VHD and from a dynamically expanding disk to fixed-sized. But you can't change a VM's generation. For more information, see [Should I create a generation 1 or 2 VM in Hyper-V](https://technet.microsoft.com/windows-server-docs/compute/hyper-v/plan/should-i-create-a-generation-1-or-2-virtual-machine-in-hyper-v).

For more information about the support policy for Azure VM, see [Microsoft server software support for Microsoft Azure VMs](https://support.microsoft.com/help/2721672/microsoft-server-software-support-for-microsoft-azure-virtual-machines).

> [!Note]
> The instructions in this article apply to the 64-bit version of Windows Server 2008 R2 and later Windows server operating system. For information about running 32-bit version of operating system in Azure, see [Support for 32-bit operating systems in Azure virtual machines](https://support.microsoft.com/help/4021388/support-for-32-bit-operating-systems-in-azure-virtual-machines).

## Convert the virtual disk to VHD and fixed size disk 
If you need to convert your virtual disk to the required format for Azure, use one of the methods in this section. Back up the VM before you run the virtual disk conversion process and make sure that the Windows VHD works correctly on the local server. Resolve any errors within the VM itself before you try to convert or upload it to Azure.

After you convert the disk, create a VM that uses the converted disk. Start and sign in to the VM to finish preparing the VM for upload.

### Convert disk using Hyper-V Manager
1. Open Hyper-V Manager and select your local computer on the left. In the menu above the computer list, click **Action** > **Edit Disk**.
2. On the **Locate Virtual Hard Disk** screen, locate and select your virtual disk.
3. On the **Choose Action** screen, and then select **Convert** and **Next**.
4. If you need to convert from VHDX, select **VHD** and then click **Next**
5. If you need to convert from a dynamically expanding disk, select **Fixed size** and then click **Next**
6. Locate and select a path to save the new VHD file to.
7. Click **Finish**.

>[!NOTE]
>The commands in this article must be run on an elevated PowerShell session.

### Convert disk by using PowerShell
You can convert a virtual disk by using the [Convert-VHD](http://technet.microsoft.com/library/hh848454.aspx) command in Windows PowerShell. Select **Run as administrator** when you start PowerShell. 

The following example command converts from VHDX to VHD, and from a dynamically expanding disk to fixed-size:

```Powershell
Convert-VHD –Path c:\test\MY-VM.vhdx –DestinationPath c:\test\MY-NEW-VM.vhd -VHDType Fixed
```
In this command, replace the value for "-Path" with the path to the virtual hard disk that you want to convert and the value for "-DestinationPath" with the new path and name of the converted disk.

### Convert from VMware VMDK disk format
If you have a Windows VM image in the [VMDK file format](https://en.wikipedia.org/wiki/VMDK), convert it to a VHD by using the [Microsoft VM Converter](https://www.microsoft.com/download/details.aspx?id=42497). For more information, see the blog article [How to Convert a VMware VMDK to Hyper-V VHD](http://blogs.msdn.com/b/timomta/archive/2015/06/11/how-to-convert-a-vmware-vmdk-to-hyper-v-vhd.aspx).

## Set Windows configurations for Azure

On the VM that you plan to upload to Azure, run all commands in the following steps from an [elevated Command Prompt window](https://technet.microsoft.com/library/cc947813.aspx):

1. Remove any static persistent route on the routing table:
   
   * To view the route table, run `route print` at the command prompt.
   * Check the **Persistence Routes** sections. If there is a persistent route, use [route delete](https://technet.microsoft.com/library/cc739598.apx) to remove it.
2. Remove the WinHTTP proxy:
   
    ```PowerShell
    netsh winhttp reset proxy
    ```
3. Set the disk SAN policy to [Onlineall](https://technet.microsoft.com/library/gg252636.aspx). 
   
    ```PowerShell
    diskpart 
    ```
    In the open Command Prompt window, type the following commands:

     ```DISKPART
    san policy=onlineall
    exit   
    ```

4. Set Coordinated Universal Time (UTC) time for Windows and the startup type of the Windows Time (w32time) service to **Automatically**:
   
    ```PowerShell
    Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\TimeZoneInformation' -name "RealTimeIsUniversal" 1 -Type DWord

    Set-Service -Name w32time -StartupType Auto
    ```
5. Set the power profile to the **High Performance**:

    ```PowerShell
    powercfg /setactive SCHEME_MIN
    ```

## Check the Windows services
Make sure that each of the following Windows services is set to the **Windows default values**. These are the minimum numbers of services that must be set up to make sure that the VM has connectivity. To reset the startup settings, run the following commands:
   
```PowerShell
Set-Service -Name bfe -StartupType Auto
Set-Service -Name dhcp -StartupType Auto
Set-Service -Name dnscache -StartupType Auto
Set-Service -Name IKEEXT -StartupType Auto
Set-Service -Name iphlpsvc -StartupType Auto
Set-Service -Name netlogon -StartupType Manual
Set-Service -Name netman -StartupType Manual
Set-Service -Name nsi -StartupType Auto
Set-Service -Name termService -StartupType Manual
Set-Service -Name MpsSvc -StartupType Auto
Set-Service -Name RemoteRegistry -StartupType Auto
```

## Update Remote Desktop registry settings
Make sure that the following settings are configured correctly for remote desktop connection:

>[!Note] 
>You may receive an error message when you run the **Set-ItemProperty -Path 'HKLM:\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services -name &lt;object name&gt; &lt;value&gt;** in these steps. The error message can be safely ignored. It means only that the domain is not pushing that configuration through a Group Policy object.
>
>

1. Remote Desktop Protocol (RDP) is enabled:
   
    ```PowerShell
    Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Terminal Server' -name "fDenyTSConnections" -Value 0 -Type DWord

    Set-ItemProperty -Path 'HKLM:\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services' -name "fDenyTSConnections" -Value 0 -Type DWord
    ```
   
2. The RDP port is set up correctly (Default port 3389):
   
    ```PowerShell
   Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Terminal Server\Winstations\RDP-Tcp' -name "PortNumber" 3389 -Type DWord
    ```
    When you deploy a VM, the default rules are created against port 3389. If you want to change the port number,  do that after the VM is deployed in Azure.

3. The listener is listening in every network interface:
   
    ```PowerShell
    Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Terminal Server\Winstations\RDP-Tcp' -name "LanAdapter" 0 -Type DWord
   ```
4. Configure the Network Level Authentication mode for the RDP connections:
   
    ```PowerShell
   Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp' -name "UserAuthentication" 1 -Type DWord

    Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp' -name "SecurityLayer" 1 -Type DWord

    Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp' -name "fAllowSecProtocolNegotiation" 1 -Type DWord
     ```

5. Set the keep-alive value：
    
    ```PowerShell
    Set-ItemProperty -Path 'HKLM:\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services' -name "KeepAliveEnable" 1 -Type DWord
    Set-ItemProperty -Path 'HKLM:\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services' -name "KeepAliveInterval" 1 -Type DWord
    Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Terminal Server\Winstations\RDP-Tcp' -name "KeepAliveTimeout" 1 -Type DWord
    ```
6. Reconnect：
    
    ```PowerShell
    Set-ItemProperty -Path 'HKLM:\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services' -name "fDisableAutoReconnect" 0 -Type DWord
    Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Terminal Server\Winstations\RDP-Tcp' -name "fInheritReconnectSame" 1 -Type DWord
    Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Terminal Server\Winstations\RDP-Tcp' -name "fReconnectSame" 0 -Type DWord
    ```
7. Limit the number of concurrent connections：
    
    ```PowerShell
    Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Terminal Server\Winstations\RDP-Tcp' -name "MaxInstanceCount" 4294967295 -Type DWord
    ```
8. If there are any self-signed certificates tied to the RDP listener, remove them:
    
    ```PowerShell
    Remove-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp' -name "SSLCertificateSHA1Hash"
    ```
    This is to make sure that you can connect at the beginning when you deploy the VM. You can also review this on a later stage after the VM is deployed in Azure if needed.

9. If the VM will be part of a Domain, check all the following settings to make sure that the former settings are not reverted. The policies that must be checked are the following:
    
    - RDP is enabled:

         Computer Configuration\Policies\Windows Settings\Administrative Templates\ Components\Remote Desktop Services\Remote Desktop Session Host\Connections:
         
         **Allow users to connect remotely by using Remote Desktop**

    - NLA group policy:

        Settings\Administrative Templates\Components\Remote Desktop Services\Remote Desktop Session Host\Security: 
        
        **Require user Authentication for remote connections by using Network Level Authentication**
    
    - Keep Alive settings:

        Computer Configuration\Policies\Windows Settings\Administrative Templates\Windows Components\Remote Desktop Services\Remote Desktop Session Host\Connections: 
        
        **Configure keep-alive connection interval**

    - Reconnect settings:

        Computer Configuration\Policies\Windows Settings\Administrative Templates\Windows Components\Remote Desktop Services\Remote Desktop Session Host\Connections: 
        
        **Automatic reconnection**

    - Limit the number of connections settings:

        Computer Configuration\Policies\Windows Settings\Administrative Templates\Windows Components\Remote Desktop Services\Remote Desktop Session Host\Connections: 
        
        **Limit number of connections**

## Configure Windows Firewall rules
1. Turn on Windows Firewall on the three profiles (Domain, Standard, and Public):

   ```PowerShell
    Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\services\SharedAccess\Parameters\FirewallPolicy\DomainProfile' -name "EnableFirewall" -Value 1 -Type DWord
    Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\services\SharedAccess\Parameters\FirewallPolicy\PublicProfile' -name "EnableFirewall" -Value 1 -Type DWord
    Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\services\SharedAccess\Parameters\FirewallPolicy\Standardprofile' -name "EnableFirewall" -Value 1 -Type DWord
   ```

2. Run the following command in PowerShell to allow WinRM through the three firewall profiles (Domain, Private, and Public) and enable the PowerShell Remote service:
   
   ```PowerShell
    Enable-PSRemoting -force
    netsh advfirewall firewall set rule dir=in name="Windows Remote Management (HTTP-In)" new enable=yes
    netsh advfirewall firewall set rule dir=in name="Windows Remote Management (HTTP-In)" new enable=yes
   ```
3. Enable the following firewall rules to allow the RDP traffic 

   ```PowerShell
    netsh advfirewall firewall set rule group="Remote Desktop" new enable=yes
   ```   
4. Enable the File and Printer Sharing rule so that the VM can respond to a ping command inside the Virtual Network:

   ```PowerShell
    netsh advfirewall firewall set rule dir=in name="File and Printer Sharing (Echo Request - ICMPv4-In)" new enable=yes
   ``` 
5. If the VM  will be part of a Domain, check the following settings to make sure that the former settings are not reverted. The AD policies that must be checked are the following:

    - Enable the Windows Firewall profiles

        Computer Configuration\Policies\Windows Settings\Administrative Templates\Network\Network Connection\Windows Firewall\Domain Profile\Windows Firewall: **Protect all network connections**

       Computer Configuration\Policies\Windows Settings\Administrative Templates\Network\Network Connection\Windows Firewall\Standard Profile\Windows Firewall: **Protect all network connections**

    - Enable RDP 

        Computer Configuration\Policies\Windows Settings\Administrative Templates\Network\Network Connection\Windows Firewall\Domain Profile\Windows Firewall: **Allow inbound Remote Desktop exceptions**

        Computer Configuration\Policies\Windows Settings\Administrative Templates\Network\Network Connection\Windows Firewall\Standard Profile\Windows Firewall: **Allow inbound Remote Desktop exceptions**

    - Enable ICMP-V4

        Computer Configuration\Policies\Windows Settings\Administrative Templates\Network\Network Connection\Windows Firewall\Domain Profile\Windows Firewall: **Allow ICMP exceptions**

        Computer Configuration\Policies\Windows Settings\Administrative Templates\Network\Network Connection\Windows Firewall\Standard Profile\Windows Firewall: **Allow ICMP exceptions**

## Verify VM is healthy, secure, and accessible with RDP 
1. To make sure the disk is healthy and consistent, run a check disk operation at the next VM restart:

    ```PowerShell
    Chkdsk /f
    ```
    Make sure that the report shows a clean and healthy disk.

2. Set the Boot Configuration Data (BCD) settings. 

    > [!Note]
    > Make sure you run these commands on an elevated CMD window and **NOT** on PowerShell:
   
   ```CMD
   bcdedit /set {bootmgr} integrityservices enable
   
   bcdedit /set {default} device partition=C:
   
   bcdedit /set {default} integrityservices enable
   
   bcdedit /set {default} recoveryenabled Off
   
   bcdedit /set {default} osdevice partition=C:
   
   bcdedit /set {default} bootstatuspolicy IgnoreAllFailures
   ```
3. Verify that the Windows Management Instrumentations repository is consistent. To perform this, run the following command:

    ```PowerShell
    winmgmt /verifyrepository
    ```
    If the repository is corrupted, see [WMI: Repository Corruption, or Not](https://blogs.technet.microsoft.com/askperf/2014/08/08/wmi-repository-corruption-or-not).

4. Make sure that any other application is not using the port 3389. This port is used for the RDP service in Azure. You can run **netstat -anob** to see which ports are in used on the VM:

    ```PowerShell
    netstat -anob
    ```

5. If the Windows VHD that you want to upload is a domain controller, then follow these steps:

    A. Follow [these extra steps](https://support.microsoft.com/kb/2904015) to prepare the disk.

    B. Make sure that you know the DSRM password in case you have to start the VM in DSRM at some point. You may want to refer to this link to set the [DSRM password](https://technet.microsoft.com/library/cc754363(v=ws.11).aspx).

6. Make sure that the Built-in Administrator account and password are known to you. You may want to reset the current local administrator password and make sure that you can use this account to sign in to Windows through the RDP connection. This access permission is controlled by the "Allow log on through Remote Desktop Services" Group Policy object. You can view this object in the Local Group Policy Editor under:

    Computer Configuration\Windows Settings\Security Settings\Local Policies\User Rights Assignment

7. Check the following AD polices to make sure that you are not blocking your RDP access through RDP nor from the network:

    - Computer Configuration\Windows Settings\Security Settings\Local Policies\User Rights Assignment\Deny access to this computer from the network

    - Computer Configuration\Windows Settings\Security Settings\Local Policies\User Rights Assignment\Deny log on through Remote Desktop Services


8. Restart the VM to make sure that Windows is still healthy can be reached by using the RDP connection. At this point, you may want to create a VM in your local Hyper-V to make sure the VM is starting completely and then test whether it is RDP reachable.

9. Remove any extra Transport Driver Interface filters, such as software that analyzes TCP packets or extra firewalls. You can also review this on a later stage after the VM is deployed in Azure if needed.

10. Uninstall any other third-party software and driver that is related to physical components or any other virtualization technology.

### Install Windows Updates
The ideal configuration is to **have the patch level of the machine at the latest**. If this is not possible, make sure that the following updates are installed:

|                       |                   |           |                                       Minimum file version x64       |                                      |                                      |                            |
|-------------------------|-------------------|------------------------------------|---------------------------------------------|--------------------------------------|--------------------------------------|----------------------------|
| Component               | Binary            | Windows 7 & Windows Server 2008 R2 | Windows 8 & Windows Server 2012             | Windows 8.1 & Windows Server 2012 R2 | Windows 10 & Windows Server 2016 RS1 | Windows 10 RS2             |
| Storage                 | disk.sys          | 6.1.7601.23403 - KB3125574         | 6.2.9200.17638 / 6.2.9200.21757 - KB3137061 | 6.3.9600.18203 - KB3137061           | -                                    | -                          |
|                         | storport.sys      | 6.1.7601.23403 - KB3125574         | 6.2.9200.17188 / 6.2.9200.21306 - KB3018489 | 6.3.9600.18573 - KB4022726           | 10.0.14393.1358 - KB4022715          | 10.0.15063.332             |
|                         | ntfs.sys          | 6.1.7601.23403 - KB3125574         | 6.2.9200.17623 / 6.2.9200.21743 - KB3121255 | 6.3.9600.18654 - KB4022726           | 10.0.14393.1198 - KB4022715          | 10.0.15063.447             |
|                         | Iologmsg.dll      | 6.1.7601.23403 - KB3125574         | 6.2.9200.16384 - KB2995387                  | -                                    | -                                    | -                          |
|                         | Classpnp.sys      | 6.1.7601.23403 - KB3125574         | 6.2.9200.17061 / 6.2.9200.21180 - KB2995387 | 6.3.9600.18334 - KB3172614           | 10.0.14393.953 - KB4022715           | -                          |
|                         | Volsnap.sys       | 6.1.7601.23403 - KB3125574         | 6.2.9200.17047 / 6.2.9200.21165 - KB2975331 | 6.3.9600.18265 - KB3145384           | -                                    | 10.0.15063.0               |
|                         | partmgr.sys       | 6.1.7601.23403 - KB3125574         | 6.2.9200.16681 - KB2877114                  | 6.3.9600.17401 - KB3000850           | 10.0.14393.953 - KB4022715           | 10.0.15063.0               |
|                         | volmgr.sys        |                                    |                                             |                                      |                                      | 10.0.15063.0               |
|                         | Volmgrx.sys       | 6.1.7601.23403 - KB3125574         | -                                           | -                                    | -                                    | 10.0.15063.0               |
|                         | Msiscsi.sys       | 6.1.7601.23403 - KB3125574         | 6.2.9200.21006 - KB2955163                  | 6.3.9600.18624 - KB4022726           | 10.0.14393.1066 - KB4022715          | 10.0.15063.447             |
|                         | Msdsm.sys         | 6.1.7601.23403 - KB3125574         | 6.2.9200.21474 - KB3046101                  | 6.3.9600.18592 - KB4022726           | -                                    | -                          |
|                         | Mpio.sys          | 6.1.7601.23403 - KB3125574         | 6.2.9200.21190 - KB3046101                  | 6.3.9600.18616 - KB4022726           | 10.0.14393.1198 - KB4022715          | -                          |
|                         | Fveapi.dll        | 6.1.7601.23311 - KB3125574         | 6.2.9200.20930 - KB2930244                  | 6.3.9600.18294 - KB3172614           | 10.0.14393.576 - KB4022715           | -                          |
|                         | Fveapibase.dll    | 6.1.7601.23403 - KB3125574         | 6.2.9200.20930 - KB2930244                  | 6.3.9600.17415 - KB3172614           | 10.0.14393.206 - KB4022715           | -                          |
| Network                 | netvsc.sys        | -                                  | -                                           | -                                    | 10.0.14393.1198 - KB4022715          | 10.0.15063.250 - KB4020001 |
|                         | mrxsmb10.sys      | 6.1.7601.23816 - KB4022722         | 6.2.9200.22108 - KB4022724                  | 6.3.9600.18603 - KB4022726           | 10.0.14393.479 - KB4022715           | 10.0.15063.483             |
|                         | mrxsmb20.sys      | 6.1.7601.23816 - KB4022722         | 6.2.9200.21548 - KB4022724                  | 6.3.9600.18586 - KB4022726           | 10.0.14393.953 - KB4022715           | 10.0.15063.483             |
|                         | mrxsmb.sys        | 6.1.7601.23816 - KB4022722         | 6.2.9200.22074 - KB4022724                  | 6.3.9600.18586 - KB4022726           | 10.0.14393.953 - KB4022715           | 10.0.15063.0               |
|                         | tcpip.sys         | 6.1.7601.23761 - KB4022722         | 6.2.9200.22070 - KB4022724                  | 6.3.9600.18478 - KB4022726           | 10.0.14393.1358 - KB4022715          | 10.0.15063.447             |
|                         | http.sys          | 6.1.7601.23403 - KB3125574         | 6.2.9200.17285 - KB3042553                  | 6.3.9600.18574 - KB4022726           | 10.0.14393.251 - KB4022715           | 10.0.15063.483             |
|                         | vmswitch.sys      | 6.1.7601.23727 - KB4022719         | 6.2.9200.22117 - KB4022724                  | 6.3.9600.18654 - KB4022726           | 10.0.14393.1358 - KB4022715          | 10.0.15063.138             |
| Core                    | ntoskrnl.exe      | 6.1.7601.23807 - KB4022719         | 6.2.9200.22170 - KB4022718                  | 6.3.9600.18696 - KB4022726           | 10.0.14393.1358 - KB4022715          | 10.0.15063.483             |
| Remote Desktop Services | rdpcorets.dll     | 6.2.9200.21506 - KB4022719         | 6.2.9200.22104 - KB4022724                  | 6.3.9600.18619 - KB4022726           | 10.0.14393.1198 - KB4022715          | 10.0.15063.0               |
|                         | termsrv.dll       | 6.1.7601.23403 - KB3125574         | 6.2.9200.17048 - KB2973501                  | 6.3.9600.17415 - KB3000850           | 10.0.14393.0 - KB4022715             | 10.0.15063.0               |
|                         | termdd.sys        | 6.1.7601.23403 - KB3125574         | -                                           | -                                    | -                                    | -                          |
|                         | win32k.sys        | 6.1.7601.23807 - KB4022719         | 6.2.9200.22168 - KB4022718                  | 6.3.9600.18698 - KB4022726           | 10.0.14393.594 - KB4022715           | -                          |
|                         | rdpdd.dll         | 6.1.7601.23403 - KB3125574         | -                                           | -                                    | -                                    | -                          |
|                         | rdpwd.sys         | 6.1.7601.23403 - KB3125574         | -                                           | -                                    | -                                    | -                          |
| Security                | Due to WannaCrypt | KB4012212                          | KB4012213                                   | KB4012213                            | KB4012606                            | KB4012606                  |
|                         |                   |                                    | KB4012216                                   |                                      | KB4013198                            | KB4013198                  |
|                         |                   | KB4012215                          | KB4012214                                   | KB4012216                            | KB4013429                            | KB4013429                  |
|                         |                   |                                    | KB4012217                                   |                                      | KB4013429                            | KB4013429                  |
       
### When to use sysprep <a id="step23"></a>    

Sysprep is a process that you could run into a windows installation that will reset the installation of the system and will provide an “out of the box experience” by removing all personal data and resetting several components. You typically do this if you want to create a template from which you can deploy several other VMs that have a specific configuration. This is called a **generalized image**.

If, instead, you want only to create one VM from one disk, you don’t have to use sysprep. In this situation, you can just create the VM from what is known as a **specialized image**.

For more information about how to create a VM from a specialized disk, see:

- [Create a VM from a specialized disk](create-vm-specialized.md)
- [Create a VM from a specialized VHD disk](https://azure.microsoft.com/resources/templates/201-vm-specialized-vhd/)

If you want to create a generalized image, you need to run sysprep. For more information about Sysprep, see [How to Use Sysprep: An Introduction](http://technet.microsoft.com/library/bb457073.aspx). 

Not every role or application that’s installed on a Windows-based computer supports this generalization. So before you run this procedure, refer to the following article to make sure that the role of that computer is supported by sysprep. For more information, [Sysprep Support for Server Roles](https://msdn.microsoft.com/windows/hardware/commercialize/manufacture/desktop/sysprep-support-for-server-roles).

### Steps to generalize a VHD

>[!NOTE]
> After you run sysprep.exe as specified  in the following steps, turn off the VM, and do not turn it back on until you create an image from it in Azure.

1. Sign in to the Windows VM.
2. Run **Command Prompt** as an administrator. 
3. Change the directory to: **%windir%\system32\sysprep**, and then run **sysprep.exe**.
3. In the **System Preparation Tool** dialog box, select **Enter System Out-of-Box Experience (OOBE)**, and make sure that the **Generalize** check box is selected.

    ![System Preparation Tool](media/prepare-for-upload-vhd-image/syspre.png)
4. In **Shutdown Options**, select **Shutdown**.
5. Click **OK**.
6. When Sysprep completes, shut down the VM. Do not use **Restart** to shut down the VM.
7. Now the VHD is ready to be uploaded. For more information about how to create a VM from a generalized disk, see [Upload a generalized VHD and use it to create a new VMs in Azure](sa-upload-generalized.md).


## Complete recommended configurations
The following settings do not affect VHD uploading. However, we strongly recommend that you configured them.

* Install the [Azure VMs Agent](http://go.microsoft.com/fwlink/?LinkID=394789&clcid=0x409). Then you can enable VM extensions. The VM extensions implement most of the critical functionality that you might want to use with your VMs such as resetting passwords, configuring RDP, and so on. For more information, see:

    - [VM Agent and Extensions – Part 1](https://azure.microsoft.com/blog/vm-agent-and-extensions-part-1/)
    - [VM Agent and Extensions – Part 2](https://azure.microsoft.com/blog/vm-agent-and-extensions-part-2/)
* The Dump log can be helpful in troubleshooting Windows crash issues. Enable the Dump log collection:
  
    ```PowerShell
    Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\CrashControl' -name "CrashDumpEnable" -Value "2" -Type DWord
    Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\CrashControl' -name "DumpFile" -Value "%SystemRoot%\MEMORY.DMP"
    Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\CrashControl' -name "AutoReboot" -Value 0 -Type DWord
    New-Item -Path 'HKLM:\SOFTWARE\Microsoft\Windows\Windows Error Reporting\LocalDumps'
    New-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\Windows\Windows Error Reporting\LocalDumps' -name "DumpFolder" -Value "c:\CrashDumps"
    New-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\Windows\Windows Error Reporting\LocalDumps' -name "DumpCount" -Value 10 -Type DWord
    New-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\Windows\Windows Error Reporting\LocalDumps' -name "DumpType" -Value 2 -Type DWord
    Set-Service -Name WerSvc -StartupType Manual
    ```
    If you receive any errors during any of the procedural steps in this article, this means that the registry keys already exists. In this situation, use the following commands instead:

    ```PowerShell
    Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\CrashControl' -name "CrashDumpEnable" -Value "2" -Type DWord
    Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\CrashControl' -name "DumpFile" -Value "%SystemRoot%\MEMORY.DMP"
    Set-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\Windows\Windows Error Reporting\LocalDumps' -name "DumpFolder" -Value "c:\CrashDumps"
    Set-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\Windows\Windows Error Reporting\LocalDumps' -name "DumpCount" -Value 10 -Type DWord
    Set-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\Windows\Windows Error Reporting\LocalDumps' -name "DumpType" -Value 2 -Type DWord
    Set-Service -Name WerSvc -StartupType Manual
    ```
*  After the VM is created in Azure, we recommend that you put the pagefile on the ”Temporal drive” volume to improve performance. You can set up this as follows:

    ```PowerShell
    Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management' -name "PagingFiles" -Value "D:\pagefile"
    ```
If there’s any data disk that is attached to the VM, the Temporal drive volume's drive letter is typically "D." This designation could be different, depending on the number of available drives and the settings that you  make.

## Next steps
* [Upload a Windows VM image to Azure for Resource Manager deployments](upload-generalized-managed.md)

