<properties
	pageTitle="Prepare a Windows VHD to upload to Azure | Microsoft Azure"
	description="Recommended practices for preparing a Windows VHD before uploading to Azure"
	services="virtual-machines-windows"
	documentationCenter=""
	authors="genlin"
	manager="timlt"
	editor=""
	tags="azure-resource-manager"/>

<tags
	ms.service="virtual-machines-windows"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="vm-windows"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/11/2016"
	ms.author="genli"/>

# Prepare a Windows VHD to upload to Azure
To upload a Windows VM from on-premises to Azure, you must correctly prepare the virtual hard disk (VHD). There are several recommended steps for you to complete before you upload a VHD to Azure. Running `sysprep` is a common process, but only one step in generalizing an image. This article shows you how to prepare a Windows VHD to upload to Microsoft Azure.

## Prepare the virtual disk

>[AZURE.NOTE] The newer VHDX format is not supported in Azure. The VHD must be a Fixed size, not Dynamic. If needed, the instructions below detail converting from VHDX or Dynamic disks. The maximum size allowed for the VHD is 1,023 GB.

Make sure that the Windows VHD is working correctly on the local server. Resolve any errors within the VM itself before trying to convert or upload to Azure.

If you need to convert your virtual disk to the required format for Azure, use one of the methods noted in the following sections.

### Convert using Hyper-V Manager
- Open Hyper-V Manager and select your local computer on the left. In the menu above it, click **Action** > **Edit Disk**.
	- On the **Locate Virtual Hard Disk** screen, browse to, and select your virtual disk.
	- Select **Convert** on the next screen
		- If you need to convert from VHDX, select **VHD** and click **Next**
		- If you need to convert from Dynamic disk, select **Fixed size** and click **Next**
		
	- Browse to and select **Path for the new VHD file**. 
	- Click **Finish** to close.

### Convert using PowerShell
You can convert a virtual disk using the [Convert-VHD PowerShell cmdlet](http://technet.microsoft.com/library/hh848454.aspx). In the following example, we are converting from a VHDX to VHD, and converting from a Dynamic to Fixed type:

```powershell
Convert-VHD –Path c:\test\MY-VM.vhdx –DestinationPath c:\test\MY-NEW-VM.vhd -VHDType Fixed
```

### Convert from VMware VMDK disk format
If you have a Windows VM image in the [VMDK file format](https://en.wikipedia.org/wiki/VMDK), convert it to a VHD by using the [Microsoft Virtual Machine Converter](https://www.microsoft.com/download/details.aspx?id=42497). Read the blog [How to Convert a VMware VMDK to Hyper-V VHD](http://blogs.msdn.com/b/timomta/archive/2015/06/11/how-to-convert-a-vmware-vmdk-to-hyper-v-vhd.aspx) for more information.

## Prepare Windows configuration for upload

> [AZURE.NOTE] Run all the following commands with [administrative privileges](https://technet.microsoft.com/library/cc947813.aspx).

1. Remove any static persistent route on the routing table:

	- To view the route table, run `route print`.
	- Check the **Persistence Routes** sections. If there is a persistent route, use [route delete](https://technet.microsoft.com/library/cc739598.apx) to remove it.

2. Remove the WinHTTP proxy:

	```
	netsh winhttp reset proxy
	```

3. Configure the disk SAN policy to [Onlineall](https://technet.microsoft.com/library/gg252636.aspx):

	```
	dispart san policy=onlineall
	```

4. Use Coordinated Universal Time (UTC) time for Windows and set the startup type of the Windows Time (w32time) service to **Automatically**:

	```
	REG ADD HKLM\SYSTEM\CurrentControlSet\Control\TimeZoneInformation /v RealTimeIsUniversal /t REG_DWORD /d 1
	sc config w32time start= auto
	```


## Configure Windows services
5. Make sure that each of the following Windows services is set to the **Windows default values**. They are configured with the startup settings noted in the following list. You can run these commands to reset the startup settings:

	```
	sc config bfe start= auto

	sc config dcomlaunch start= auto

	sc config dhcp start= auto

	sc config dnscache start= auto

	sc config IKEEXT start= auto

	sc config iphlpsvc start= auto

	sc config PolicyAgent start= manual

	sc config LSM start= auto

	sc config netlogon start= manual

	sc config netman start= manual

	sc config NcaSvc start= manual

	sc config netprofm start= manual

	sc config NlaSvc start= auto

	sc config nsi start= auto

	sc config RpcSs start= auto

	sc config RpcEptMapper start= auto

	sc config termService start= manual

	sc config MpsSvc start= auto

	sc config WinHttpAutoProxySvc start= manual

	sc config LanmanWorkstation start= auto

	sc config RemoteRegistry start= auto
	```


## Configure Remote Desktop configuration
6. If there are any self-signed certificates tied to the Remote Desktop Protocol (RDP) listener, remove them:

	```
	REG DELETE "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp\SSLCertificateSHA1Hash”
	```

	For more information about configuring certificates for RDP listener, see [Listener Certificate Configurations in Windows Server ](https://blogs.technet.microsoft.com/askperf/2014/05/28/listener-certificate-configurations-in-windows-server-2012-2012-r2/)

7. Configure the [KeepAlive](https://technet.microsoft.com/library/cc957549.aspx) values for RDP service:

	```
	REG ADD "HKLM\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services" /v KeepAliveEnable /t REG_DWORD  /d 1 /f

	REG ADD "HKLM\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services" /v KeepAliveInterval /t REG_DWORD  /d 1 /f

	REG ADD "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\Winstations\RDP-Tcp" /v KeepAliveTimeout /t REG_DWORD /d 1 /f
	```

8. Configure the authentication mode for the RDP service:

	```
	REG ADD "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp" /v UserAuthentication /t REG_DWORD  /d 1 /f

	REG ADD "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp" /v SecurityLayer /t REG_DWORD  /d 1 /f

	REG ADD "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp" /v fAllowSecProtocolNegotiation /t REG_DWORD  /d 1 /f
	```

9. Enable RDP service by adding the following subkeys to the registry:

	```
	REG ADD "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server" /v fDenyTSConnections /t REG_DWORD  /d 0 /f
	```


## Configure Windows Firewall rules
10. Allow WinRM through the three firewall profiles (Domain, Private and Public) and enable PowerShell Remote service: 

	```
	Enable-PSRemoting -force
	```

11. Make sure that the following guest operating system firewall rules are in place:

	- Inbound

	```
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

	- Inbound and outbound

	```
	netsh advfirewall firewall set rule group="Remote Desktop" new enable=yes

	netsh advfirewall firewall set rule group="Core Networking" new enable=yes
	```

	- Outbound

	```
	netsh advfirewall firewall set rule dir=in name="Network Discovery (LLMNR-UDP-Out)" new enable=yes

	netsh advfirewall firewall set rule dir=in name="Network Discovery (NB-Datagram-Out)" new enable=yes

	netsh advfirewall firewall set rule dir=in name="Network Discovery (NB-Name-Out)" new enable=yes

	netsh advfirewall firewall set rule dir=in name="Network Discovery (Pub-WSD-Out)" new enable=yes

	netsh advfirewall firewall set rule dir=in name="Network Discovery (SSDP-Out)" new enable=yes

	netsh advfirewall firewall set rule dir=in name="Network Discovery (UPnPHost-Out)" new enable=yes

	netsh advfirewall firewall set rule dir=in name="Network Discovery (UPnP-Out)" new enable=yes

	netsh advfirewall firewall set rule dir=in name="Network Discovery (WSD Events-Out)" new enable=yes

	netsh advfirewall firewall set rule dir=in name="Network Discovery (WSD EventsSecure-Out)" new enable=yes

	netsh advfirewall firewall set rule dir=in name="Network Discovery (WSD-Out)" new enable=yes
	```


## Additional Windows configuration steps
12. Run `winmgmt /verifyrepository` to confirm that the Windows Management Instrumentation (WMI) repository is consistent. If the repository is corrupted, see [this blog post](https://blogs.technet.microsoft.com/askperf/2014/08/08/wmi-repository-corruption-or-not).

13. Make sure the Boot Configuration Data (BCD) settings match the following:

	```
	bcdedit /set {bootmgr} device partition=<Boot Partition>

	bcdedit /set {bootmgr} integrityservices enable

	bcdedit /set {default} device partition=<OS Partition>

	bcdedit /set {default} integrityservices enable

	bcdedit /set {default} recoveryenabled Off

	bcdedit /set {default} osdevice partition=<OS Partition>

	bcdedit /set {default} bootstatuspolicy IgnoreAllFailures
	```

14. Remove any extra Transport Driver Interface filters, such as software that analyzes TCP packets.
15. To make sure the disk is healthy and consistent, run the `CHKDSK /f` command.
16.	Uninstall all other third-party software and drivers.
17. Make sure that a third-party application is not using Port 3389. This port is used for the RDP service in Azure.
18.	If the Windows VHD that you want to upload is a domain controller, follow [these extra steps](https://support.microsoft.com/kb/2904015) to prepare the disk.
19.	Reboot the VM to make sure that Windows is still healthy can be reached by using the RDP connection.
20.	Reset the current local administrator password and make sure that you can use this account to sign in to Windows through the RDP connection.  This access permission is controlled by the "Allow log on through Remote Desktop Services" policy object. This object is located under "Computer Configuration\Windows Settings\Security Settings\Local Policies\User Rights Assignment."


## Install Windows Updates
22. Install the latest updates for Windows. If that is not possible, make sure that the following updates are installed:

	- [KB3137061](https://support.microsoft.com/kb/3137061) Microsoft Azure VMs don't recover from a network outage and data corruption issues occur

	- [KB3115224](https://support.microsoft.com/kb/3115224) Reliability improvements for VMs that are running on a Windows Server 2012 R2 or Windows Server 2012 host

	- [KB3140410](https://support.microsoft.com/kb/3140410) MS16-031: Security update for Microsoft Windows to address elevation of privilege: March 8, 2016

	- [KB3063075](https://support.microsoft.com/kb/3063075) Many ID 129 events are logged when you run a Windows Server 2012 R2 virtual machine in Microsoft Azure

	- [KB3137061](https://support.microsoft.com/kb/3137061) Microsoft Azure VMs don't recover from a network outage and data corruption issues occur

	- [KB3114025](https://support.microsoft.com/kb/3114025) Slow performance when you access Azure files storage from Windows 8.1 or Server 2012 R2

	- [KB3033930](https://support.microsoft.com/kb/3033930) Hotfix increases the 64K limit on RIO buffers per process for Azure service in Windows

	- [KB3004545](https://support.microsoft.com/kb/3004545) You cannot access virtual machines that are hosted on Azure hosting services through a VPN connection in Windows

	- [KB3082343](https://support.microsoft.com/kb/3082343) Cross-Premises VPN connectivity is lost when Azure site-to-site VPN tunnels use Windows Server 2012 R2 RRAS

	- [KB3140410](https://support.microsoft.com/kb/3140410) MS16-031: Security update for Microsoft Windows to address elevation of privilege: March 8, 2016

	- [KB3146723](https://support.microsoft.com/kb/3146723) MS16-048: Description of the security update for CSRSS: April 12, 2016
	- [KB2904100](https://support.microsoft.com/kb/2904100) System freezes during disk I/O in Windows

23. If you want to create an image by using the VHD, it is better to run `sysprep` to prepare the installation of Windows for imaging.


## Suggested extra configurations

The following settings do not affect VHD uploading. However, we strongly recommend that you have them configured.

- Install the [Azure Virtual Machines Agent](http://go.microsoft.com/fwlink/?LinkID=394789&clcid=0x409). After you install the agent, you can enable VM extensions. The VM extensions implement most of the critical functionality that you want to use with your VMs like resetting passwords, configuring RDP, and many others.

- The Dump log can be helpful in troubleshooting Windows crash issues. Enable the Dump log collection:

	```
	REG ADD "HKLM\SYSTEM\CurrentControlSet\Control\CrashControl" /v CrashDumpEnabled /t REG_DWORD /d 2 /f`

	REG ADD "HKLM\SOFTWARE\Microsoft\Windows\Windows Error Reporting\LocalDumps" /v DumpFolder /t REG_EXPAND_SZ /d "c:\CrashDumps" /f

	REG ADD "HKLM\SOFTWARE\Microsoft\Windows\Windows Error Reporting\LocalDumps" /v DumpCount /t REG_DWORD /d 10 /f

	REG ADD "HKLM\SOFTWARE\Microsoft\Windows\Windows Error Reporting\LocalDumps" /v DumpType /t REG_DWORD /d 2 /f

	sc config wer start= auto
	```

- After the VM is created in Azure, configure the system defined size pagefile on drive D:

	```
	REG ADD "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /t REG_MULTI_SZ /v PagingFiles /d "D:\pagefile.sys 0 0" /f
	```


## Next steps

- [Upload a Windows VM image to Azure for Resource Manager deployments](virtual-machines-windows-upload-image.md)