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
ms.date: 6/26/2017
ms.author: genli

---
# Prepare a Windows VHD or VHDX to upload to Azure
To upload a Windows VM from on-premises to Microsoft Azure, you must prepare the virtual hard disk (VHD or VHDX). Azure only supports generation 1 virtual machines (VM) that are in the VHD file format and have a fixed sized disk. The maximum size allowed for the VHD is 1,023 GB. You can convert a generation 1 VM from VHDX to the VHD file format and from dynamically expanding to a fixed sized disk. But you can't change a VM's generation.  For more information, see [Should I create a generation 1 or 2 VM in Hyper-V](https://technet.microsoft.com/en-us/windows-server-docs/compute/hyper-v/plan/should-i-create-a-generation-1-or-2-virtual-machine-in-hyper-v).

For more information about the support policy for Azure VM, see [Microsoft server software support for Microsoft Azure VMs](https://support.microsoft.com/en-us/help/2721672/microsoft-server-software-support-for-microsoft-azure-virtual-machines).

The instructions in this article apply to 64-bit version of Windows Server 2008 R2 and later Windows server operating system.

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

>[!NOTE]
>The commands in the following instructions must be run on an elevated PowerShell session.

### Convert disk using PowerShell
You can convert a virtual disk by using the [Convert-VHD](http://technet.microsoft.com/library/hh848454.aspx) command in Windows PowerShell. Select **Run as administrator** when you start PowerShell. 

The following example shows you how to convert from a VHDX to VHD, and from a dynamically expanding disk to fixed size:

```Powershell
Convert-VHD –Path c:\test\MY-VM.vhdx –DestinationPath c:\test\MY-NEW-VM.vhd -VHDType Fixed
```
Replace the values for "-Path" with the path to the virtual hard disk that you want to convert and "-DestinationPath" with the new path and name for the converted disk.

### Convert from VMware VMDK disk format
If you have a Windows VM image in the [VMDK file format](https://en.wikipedia.org/wiki/VMDK), convert it to a VHD by using the [Microsoft VM Converter](https://www.microsoft.com/download/details.aspx?id=42497). For more information, see the blog [How to Convert a VMware VMDK to Hyper-V VHD](http://blogs.msdn.com/b/timomta/archive/2015/06/11/how-to-convert-a-vmware-vmdk-to-hyper-v-vhd.aspx).

## Set Windows configurations for Azure

On the VM you plan to upload to Azure, run all the following commands from the command prompt window with [administrative privileges](https://technet.microsoft.com/library/cc947813.aspx).

1. Remove any static persistent route on the routing table:
   
   * To view the route table, run `route print` from the command prompt window.
   * Check the **Persistence Routes** sections. If there is a persistent route, use [route delete](https://technet.microsoft.com/library/cc739598.apx) to remove it.
2. Remove the WinHTTP proxy:
   
    ```PowerShell
    netsh winhttp reset proxy
    ```
3. Set the disk SAN policy to [Onlineall](https://technet.microsoft.com/library/gg252636.aspx). 
   
    ```PowerShell
    diskpart 
    ```
    In the opened Command Prompt window, type the following commands:

     ```DISKPART
    san policy=onlineall
    exit   
    ```

4. Set Coordinated Universal Time (UTC) time for Windows and the startup type of the Windows Time (w32time) service to **Automatically**:
   
    ```PowerShell
    Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\TimeZoneInformation' -name "RealTimeIsUniversal" 1

    Set-Service -Name w32time -StartupType Auto
    ```

## Set Windows configurations for Azure
Make sure that each of the following Windows services is set to the **Windows default values**. Below is the minimum services that need to be set up to make sure that the machine has connectivity. To reset the startup settings, run the following commands:
   
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
Make share that the following settings are configured correctly for remote desktop connection:

1. Remote Desktop Protocol (RDP) is enabled:
   
    ```PowerShell
    Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Terminal Server' -name "fDenyTSConnections" -Value 0

    Set-ItemProperty -Path 'HKLM:\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Service' -name "fDenyTSConnections" -Value 0

    ```
 
2. The RDP port is properly set up (Default port 3389):
   
    ```PowerShell
   Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Terminal Server\Winstations\RDP-Tcp' -name "PortNumber" d3d
    ```
    When you deploy a machine, the default rules are created against 3389. You can review this on a later stage after the VM is deployed in Azure if needed.

3. The listener is listening in every network interface:
   
    ```PowerShell
    Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Terminal Server\Winstations\RDP-Tcp' -name "LanAdapter" 0
   ```
4. Configure the Network Level Authentication mode for the RDP connections:
   
    ```PowerShell
   Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp' -name "UserAuthentication" 1

    Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp' -name "SecurityLayer" 1

    Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp' -name "fAllowSecProtocolNegotiation" 1
     ```

5. Keep-Alive value：
    
    ```PowerShell
    Set-ItemProperty -Path 'HKLM:\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services' -name "KeepAliveEnable" 1
    Set-ItemProperty -Path 'HKLM:\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services' -name "KeepAliveInterval" 1
    Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Terminal Server\Winstations\RDP-Tcp ' -name "KeepAliveTimeout" 1
    ```

6. Keep-Alive value：
    
    ```PowerShell
    Set-ItemProperty -Path 'HKLM:\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services' -name "KeepAliveEnable" 1
    Set-ItemProperty -Path 'HKLM:\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services' -name "KeepAliveInterval" 1
    Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Terminal Server\Winstations\RDP-Tcp ' -name "KeepAliveTimeout" 1
    ```
7. Keep-Alive value：
    
    ```PowerShell
    Set-ItemProperty -Path 'HKLM:\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services' -name "KeepAliveEnable" 1
    Set-ItemProperty -Path 'HKLM:\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services' -name "KeepAliveInterval" 1
    Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Terminal Server\Winstations\RDP-Tcp ' -name "KeepAliveTimeout" 1
    ```
8. Reconnect：
    
    ```PowerShell
    Set-ItemProperty -Path 'HKLM:\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services' -name "fDisableAutoReconnect" 0
    Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Terminal Server\Winstations\RDP-Tcp' -name "fInheritReconnectSame" 1
    Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Terminal Server\Winstations\RDP-Tcp' -name "fReconnectSame" 0
    ```
9. Limit the number of concurrent connections：
    
    ```PowerShell
    Remove-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp' -name "SSLCertificateSHA1Hash"
    ```
10. If there are any self-signed certificates tied to the RDP listener, remove them:
    
    ```PowerShell
    Remove-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp' -name "SSLCertificateSHA1Hash"
    ```
    This is to make sure that you can connect at the beginning when you deploy the VM. You could review this on a later stage after the VM is deployed in Azure if needed.

11. If the VM will be part of a Domain,  all these settings should be checked and make sure that the former settings are not getting revered. The policies that must be checked are:
    
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

    - •	Limit the number of connections settings:

        Computer Configuration\Policies\Windows Settings\Administrative Templates\Windows Components\Remote Desktop Services\Remote Desktop Session Host\Connections: 
        
        **Limit number of connections**

## Configure Windows Firewall rules
1. Turn on the Windows Firewall on the three profiles (Domain, Standard and Public):

   ```PowerShell
    Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\services\SharedAccess\Parameters\FirewallPolicy\DomainProfile' -name "EnableFirewall" -Value 1
    Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\services\SharedAccess\Parameters\FirewallPolicy\PublicProfile' -name "EnableFirewall" -Value 1
    Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\services\SharedAccess\Parameters\FirewallPolicy\Standardprofile' -name "EnableFirewall" -Value 1
   ```

2. Run the following command in PowerShell to allow WinRM through the three firewall profiles (Domain, Private, and Public) and enable PowerShell Remote service:
   
   ```PowerShell
    Enable-PSRemoting -force
    netsh advfirewall firewall set rule dir=in name="Windows Remote Management (HTTP-In)" new enable=yes
    netsh advfirewall firewall set rule dir=in name="Windows Remote Management (HTTP-In)" new enable=yes
   ```
3. Now enable the following firewall rules to allow the RDP traffic 

   ```PowerShell
    netsh advfirewall firewall set rule group="Remote Desktop" new enable=yes
   ```   
4. Enable the File and Printer Sharing rule so the machine can respond to ping inside the Virtual Network:

   ```PowerShell
    netsh advfirewall firewall set rule dir=in name="File and Printer Sharing (Echo Request - ICMPv4-In)" new enable=yes
   ``` 
5. If the VM  will be part of a Domain, all these settings should be checked and make sure that the former settings are not getting revered. The AD policies that need to be checked are:

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
1. To make sure the disk is healthy and consistent, perform a check disk operation on the next restart of the machine. Then proceed with the restart and ensure that the check disk report comes clean and healthy:

    ```PowerShell
    Chkdsk /f
    ```
2. Set the Boot Configuration Data (BCD) settings:
   
   ```PowerShell
   bcdedit /set {bootmgr} integrityservices enable
   
   bcdedit /set {default} device partition=C:
   
   bcdedit /set {default} integrityservices enable
   
   bcdedit /set {default} recoveryenabled Off
   
   bcdedit /set {default} osdevice partition=C:
   
   bcdedit /set {default} bootstatuspolicy IgnoreAllFailures
   ```
3. Verify the Windows Management Instrumentations repository is consistent. To perform this, run the following:

    ```PowerShell
    winmgmt /verifyrepository
    ```
    If the repository is corrupted, see [WMI: Repository Corruption, or Not](https://blogs.technet.microsoft.com/askperf/2014/08/08/wmi-repository-corruption-or-not).

4. Make sure that any other application is not using the Port 3389. This port is used for the RDP service in Azure. You can run netstat -anob to see the ports which are in used in your machine:

    ```PowerShell
    etstat -anob
    ```

5. If the Windows VHD that you want to upload is a domain controller, then:

    A. Follow [these extra steps](https://support.microsoft.com/kb/2904015) to prepare the disk.

    B. Make sure that you know the DSRM password in case you need to boot the machine in DSRM at some point. You may want to refer to this link to set the [DSRM password](https://technet.microsoft.com/en-us/library/cc754363(v=ws.11).aspx)

6. Make sure that the Built-in Administrator account and password are known to you. You may want to reset the current local administrator password and make sure that you can use this account to sign in to Windows through the RDP connection. This access permission is controlled by the "Allow log on through Remote Desktop Services" Group Policy object. You can view this object in the Local Group Policy Editor under:

    Computer Configuration\Windows Settings\Security Settings\Local Policies\User Rights Assignment

7. Reboot the VM to make sure that Windows is still healthy can be reached by using the RDP connection. At this point, you may want to create a VM in your local Hyper-V to make sure the VM is booting all the way up and then test if it is RDP reachable.

8. Remove any extra Transport Driver Interface filters, such as software that analyzes TCP packets or extra firewalls. Note that in a later stage after you deploy the VM in Azure and you are able to reach the VM. You may want to review this item if needed.

9. Uninstall any other third-party software and driver related to physical components or any other virtualization technology.

## Install Windows Updates
The ideal configuration is to have the patch level of the machine at the latest. If that's not possible, make sure that the following updates are installed:

| Component               | Binary            | Windows 7 & Windows Server 2008 R2 | Windows 8 & Windows Server 2012             | Windows 8.1 & Windows Server 2012 R2 | Windows 10 & Windows Server 2016 RTM | Windows 10 & Windows Server 2016 Build 10586 | Windows 10 & Windows Server 2016 Build 14393 |
|-------------------------|-------------------|------------------------------------|---------------------------------------------|--------------------------------------|--------------------------------------|----------------------------------------------|----------------------------------------------|
|                         |                   |                                    |                                             |                                      |                                      |                                              |                                              |
| Storage                 | disk.sys          | 6.1.7601.23403 - KB3125574         | 6.2.9200.17638 / 6.2.9200.21757 - KB3137061 | 6.3.9600.18203 - KB3137061           | -                                    | -                                            | -                                            |
|                         | storport.sys      | 6.1.7601.23403 - KB3125574         | 6.2.9200.17188 / 6.2.9200.21306 - KB3018489 | 6.3.9600.18573 - KB4022726           | 10.0.10240.17022 - KB4022727         | -                                            | 10.0.14393.1358 - KB4022715                  |
|                         | ntfs.sys          | 6.1.7601.23403 - KB3125574         | 6.2.9200.17623 / 6.2.9200.21743 - KB3121255 | 6.3.9600.18654 - KB4022726           | 10.0.10240.17146 - KB4022727         | -                                            | 10.0.14393.1198 - KB4022715                  |
|                         | Iologmsg.dll      | 6.1.7601.23403 - KB3125574         | 6.2.9200.16384 - KB2995387                  | -                                    | -                                    | -                                            | -                                            |
|                         | Classpnp.sys      | 6.1.7601.23403 - KB3125574         | 6.2.9200.17061 / 6.2.9200.21180 - KB2995387 | 6.3.9600.18334 - KB3172614           | -                                    | -                                            | 10.0.14393.953 - KB4022715                   |
|                         | Volsnap.sys       | 6.1.7601.23403 - KB3125574         | 6.2.9200.17047 / 6.2.9200.21165 - KB2975331 | 6.3.9600.18265 - KB3145384           | -                                    | -                                            | -                                            |
|                         | partmgr.sys       | 6.1.7601.23403 - KB3125574         | 6.2.9200.16681 - KB2877114                  | 6.3.9600.17401 - KB3000850           | -                                    | 10.0.10586.420 - KB4019473                   | 10.0.14393.953 - KB4022715                   |
|                         | Volmgrx.sys       | 6.1.7601.23403 - KB3125574         | -                                           | -                                    | 10.0.10240.16384 - KB4022727         | 10.0.10586.0 - KB4019473                     | -                                            |
|                         | Msiscsi.sys       | 6.1.7601.23403 - KB3125574         | 6.2.9200.21006 - KB2955163                  | 6.3.9600.18624 - KB4022726           | -                                    | -                                            | 10.0.14393.1066 - KB4022715                  |
|                         | Msdsm.sys         | 6.1.7601.23403 - KB3125574         | 6.2.9200.21474 - KB3046101                  | 6.3.9600.18592 - KB4022726           | -                                    | -                                            | -                                            |
|                         | Mpio.sys          | 6.1.7601.23403 - KB3125574         | 6.2.9200.21190 - KB3046101                  | 6.3.9600.18616 - KB4022726           | -                                    | -                                            | 10.0.14393.1198 - KB4022715                  |
|                         | Fveapi.dll        | 6.1.7601.23311 - KB3125574         | 6.2.9200.20930 - KB2930244                  | 6.3.9600.18294 - KB3172614           | 10.0.10240.17184 - KB4022727         | -                                            | 10.0.14393.576 - KB4022715                   |
|                         | Fveapibase.dll    | 6.1.7601.23403 - KB3125574         | 6.2.9200.20930 - KB2930244                  | 6.3.9600.17415 - KB3172614           | 10.0.10240.16384 - KB4022727         | 10.0.10586.713 - KB4019473                   | 10.0.14393.206 - KB4022715                   |
| Network                 | netvsc.sys        | -                                  | -                                           | -                                    | -                                    | -                                            | 10.0.14393.1198 - KB4022715                  |
|                         | mrxsmb10.sys      | 6.1.7601.23816 - KB4022722         | 6.2.9200.22108 - KB4022724                  | 6.3.9600.18603 - KB4022726           | 10.0.10240.17319 - KB4022727         | -                                            | 10.0.14393.479 - KB4022715                   |
|                         | mrxsmb20.sys      | 6.1.7601.23816 - KB4022722         | 6.2.9200.21548 - KB4022724                  | 6.3.9600.18586 - KB4022726           | 10.0.10240.17319 - KB4022727         | -                                            | 10.0.14393.953 - KB4022715                   |
|                         | mrxsmb.sys        | 6.1.7601.23816 - KB4022722         | 6.2.9200.22074 - KB4022724                  | 6.3.9600.18586 - KB4022726           | 10.0.10240.17319 - KB4022727         | -                                            | 10.0.14393.953 - KB4022715                   |
|                         | tcpip.sys         | 6.1.7601.23761 - KB4022722         | 6.2.9200.22070 - KB4022724                  | 6.3.9600.18478 - KB4022726           | 10.0.10240.17113 - KB4022727         | -                                            | 10.0.14393.1358 - KB4022715                  |
|                         | http.sys          | 6.1.7601.23403 - KB3125574         | 6.2.9200.17285 - KB3042553                  | 6.3.9600.18574 - KB4022726           | 10.0.10240.16766 - KB4022727         | -                                            | 10.0.14393.251 - KB4022715                   |
|                         | vmswitch.sys      | 6.1.7601.23727 - KB4022719         | 6.2.9200.22117 - KB4022724                  | 6.3.9600.18654 - KB4022726           | 10.0.10240.17354 - KB4022727         | 10.0.10586.873 - KB4019473                   | 10.0.14393.1358 - KB4022715                  |
| Core                    | ntoskrnl.exe      | 6.1.7601.23807 - KB4022719         | 6.2.9200.22170 - KB4022718                  | 6.3.9600.18696 - KB4022726           | 10.0.10240.17443 - KB4022727         | -                                            | 10.0.14393.1358 - KB4022715                  |
| Remote Desktop Services | rdpcorets.dll     | 6.2.9200.21506 - KB4022719         | 6.2.9200.22104 - KB4022724                  | 6.3.9600.18619 - KB4022726           | 10.0.10240.17443 - KB4022727         | -                                            | 10.0.14393.1198 - KB4022715                  |
|                         | termsrv.dll       | 6.1.7601.23403 - KB3125574         | 6.2.9200.17048 - KB2973501                  | 6.3.9600.17415 - KB3000850           | -                                    | 10.0.10586.589 - KB4019473                   | 10.0.14393.0 - KB4022715                     |
|                         | termdd.sys        | 6.1.7601.23403 - KB3125574         | -                                           | -                                    | -                                    | -                                            | -                                            |
|                         | win32k.sys        | 6.1.7601.23807 - KB4022719         | 6.2.9200.22168 - KB4022718                  | 6.2.9200.22168 - KB4022718           | 10.0.10240.16384 - KB4022727         | 10.0.10586-20 - KB4019473                    | 10.0.14393.594 - KB4022715                   |
|                         | rdpdd.dll         | 6.1.7601.23403 - KB3125574         | -                                           | -                                    | -                                    | -                                            | -                                            |
|                         | rdpwd.sys         | 6.1.7601.23403 - KB3125574         | -                                           | -                                    | -                                    | -                                            | -                                            |
| Security                | Due to WannaCrypt | KB4012212                          | KB4012213                                   | KB4012213                            | KB4012606                            |                                              | KB4012606                                    |
|                         |                   |    KB4012215                                | KB4012216                                   |   KB4012216                                   | KB4013198                            |                                              | KB4013198                                    |
|                         |                   |                           | KB4012214                                   |                           | KB4013429                            |                                              | KB4013429                                    |
|                         |                   |                                    | KB4012217                                   |                                      | KB4013429                            |                                              | KB4013429                                    |
       
## Run Sysprep  <a id="step23"></a>    

Sysprep is a process that you could run into a windows installation that will reset the installation of the system and will provide an “Out of the box experience” by removing all personal data and resetting several components. You usually do this if you want to create a template from which you want to deploy several other machines with a specific configuration, this is called a **generalized image**.

If this is not what you want, and you just want to create one VM from one disk, you don’t need sysprep and what you need is just creating the VM from what is called a **specialized image**.

For more information about how to create a VM from a specialized disk, see:

- [Create a VM from a specialized disk](create-vm-specialized.md)
- [Create a VM from a specialized VHD disk](https://azure.microsoft.com/en-us/resources/templates/201-vm-specialized-vhd/)

If you want to create a generalized image, you need to run sysprep. For more information about Sysprep, see [How to Use Sysprep: An Introduction](http://technet.microsoft.com/library/bb457073.aspx). 

Not every role or application installed on a Windows machine supports this generalization, so before proceeding with this,  refer to the following article to ensure the role that machine has is supported by sysprep, [Sysprep Support for Server Roles](https://msdn.microsoft.com/windows/hardware/commercialize/manufacture/desktop/sysprep-support-for-server-roles).

### Steps to generalized a VHD

1. Sign in to the Windows VM
2. Run **Command Prompt** as an administrator. 
3. Change the directory to: **%windir%\system32\sysprep**, and then run **sysprep.exe**.
3. In the **System Preparation Tool** dialog box, select **Enter System Out-of-Box Experience (OOBE)**, and make sure that the **Generalize** check box is selected.

    ![System Preparation Tool](media/prepare-for-upload-vhd-image/syspre.png)
4. In **Shutdown Options**, select **Shutdown**.
5. Click **OK**.
6. When Sysprep completes, shut down the VM. Note that do not use **Restart** to shut down the VM.
7. Now the VHD is ready to be uploaded. For more information about how to create a VM from a generalized disk, see [Upload a generalized VHD and use it to create a new VMs in Azure](sa-upload-generalized.md)


## Complete recommended configurations
The following settings do not affect VHD uploading. However, we strongly recommend that you have them configured.

* Install the [Azure VMs Agent](http://go.microsoft.com/fwlink/?LinkID=394789&clcid=0x409). After you install the agent, you can enable VM extensions. The VM extensions implement most of the critical functionality that you want to use with your VMs like resetting passwords, configuring RDP, and many others. For more information about what the Azure VM agent, see:

    - [VM Agent and Extensions – Part 1](https://azure.microsoft.com/en-us/blog/vm-agent-and-extensions-part-1/)
    - [VM Agent and Extensions – Part 2](https://azure.microsoft.com/en-us/blog/vm-agent-and-extensions-part-2/)
* The Dump log can be helpful in troubleshooting Windows crash issues. Enable the Dump log collection:
  
    ```PowerShell
    Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\CrashControl' -name "CrashDumpEnable" -Value "2"
    Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\CrashControl' -name "DumpFile" -Value "%SystemRoot%\MEMORY.DMP"
    New-Item -Path 'HKLM:\SOFTWARE\Microsoft\Windows\Windows Error Reporting\LocalDumps'
    New-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\Windows\Windows Error Reporting\LocalDumps' -name "DumpFolder" -Value "c:\CrashDumps"
    New-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\Windows\Windows Error Reporting\LocalDumps' -name "DumpCount" -Value 10
    New-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\Windows\Windows Error Reporting\LocalDumps' -name "DumpType" -Value 2
    Set-Service -Name WerSvc -StartupType Manual
    ```
    If on the former steps you got errors, it means the registry keys already existed so then proceed with the following commands instead:

    ```PowerShell
    Set-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\Windows\Windows Error Reporting\LocalDumps' -name "DumpFolder" -Value "c:\CrashDumps"
    Set-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\Windows\Windows Error Reporting\LocalDumps' -name "DumpCount" -Value 10
    Set-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\Windows\Windows Error Reporting\LocalDumps' -name "DumpType" -Value 2
    ```
* After the VM is created in Azure, to improve the performance is recommended to place the pagefile on the temporal drive. You can set up this as following:

    ```PowerShell
    Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management' -name "PagingFiles" -Value "D:\pagefile"
    ```
Note that the pagefile should be placed on the volume that is labeled as "Temporal drive". If there’s any data disk attached on the VM, the Temporal drive volume's drive letter would be "D". However, depending on the number of drives and setting that you could make, this drive letter could be different.


## Next steps
* [Upload a Windows VM image to Azure for Resource Manager deployments](upload-generalized-managed.md)

