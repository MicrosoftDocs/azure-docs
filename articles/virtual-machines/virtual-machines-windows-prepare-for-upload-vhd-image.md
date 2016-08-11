<properties
	pageTitle="Prepare a Windows VHD to upload to Azure | Microsoft Azure"
	description="Best Practices for preparing Windows VHD before uploading to Azure"
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

This article shows you how to prepare a Windows virtual hard disk (VHD) to upload to Microsoft Azure.

## Prepare the VM configuration for upload

>[AZURE.NOT] Azure accepts only VHD disk files that are created for generation 1 virtual machines. The disk must be in Fixed size. The maximum size allowed for the VHD is 1,023 GB.

1.	Make sure that the Windows VHD is working correctly on the local server.
2.	If you have a Windows VM image in VHDX format, convert it to a VHD by using either of the following:

	- Hyper-V: Open Hyper-V and select your local computer on the left. Then in the menu above it, click **Action** > **Edit Disk**. Navigate through the screens by clicking **Next** and entering these options: *Path for your VHDX file* > **Convert** > **VHD** > **Fixed size** > *Path for the new VHD file*. Click **Finish** to close.

	- [Convert-VHD PowerShell cmdlet](http://technet.microsoft.com/library/hh848454.aspx): Read the blog post [Converting Hyper-V .vhdx to .vhd file formats](https://blogs.technet.microsoft.com/cbernier/2013/08/29/converting-hyper-v-vhdx-to-vhd-file-formats-for-use-in-windows-azure/) for more information.

	If you have a Windows VM image in the [VMDK file format](https://en.wikipedia.org/wiki/VMDK), convert it to a VHD by using the [Microsoft Virtual Machine Converter](https://www.microsoft.com/download/details.aspx?id=42497). Read the blog [How to Convert a VMware VMDK to Hyper-V VHD](http://blogs.msdn.com/b/timomta/archive/2015/06/11/how-to-convert-a-vmware-vmdk-to-hyper-v-vhd.aspx) for more information.

## Prepare Windows configuration for upload

> [AZURE.NOTE] Run the following commands with [administrative privileges](https://technet.microsoft.com/library/cc947813.aspx).

1. Remove any static persistent route on the routing table:

	A.	To view the route table, run  `route print`.

	B.	Check the **Persistence Routes** sections. If there is a persistent route, use [route delete](https://technet.microsoft.com/library/cc739598.apx) to remove it.

2. Remove the WinHTTP proxy: `netsh winhttp reset proxy`
3. Configure the disk SAN policy to [Onlineall](https://technet.microsoft.com/library/gg252636.aspx): `diskpart san policy=onlineall`
4. Use Coordinated Universal Time (UTC) time for Windows and set the startup type of the Windows Time (w32time) service to **Automatically**:

	 - `REG ADD HKLM\SYSTEM\CurrentControlSet\Control\TimeZoneInformation /v RealTimeIsUniversal /t REG_DWORD /d 1`

   - `sc config w32time start= auto`

5. Make sure that each of the following windows services is set to its windows default values. They are all enabled with the following startup setting. You can run these commands to reset the startup setting.

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

6. If there is any self-signed certificate tied to the Remote Desktop Protocol (RDP) listener, remove them:

	`REG DELETE "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp\SSLCertificateSHA1Hash”`

	For more information about configure certificate for RDP listener, see [Listener Certificate Configurations in Windows Server ](https://blogs.technet.microsoft.com/askperf/2014/05/28/listener-certificate-configurations-in-windows-server-2012-2012-r2/)

7. Configure the [KeepAlive](https://technet.microsoft.com/library/cc957549.aspx) values for RDP service:

		REG ADD "HKLM\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services" /v KeepAliveEnable /t REG_DWORD  /d 1 /f

		REG ADD "HKLM\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services" /v KeepAliveInterval /t REG_DWORD  /d 1 /f

		REG ADD "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\Winstations\RDP-Tcp" /v KeepAliveTimeout /t REG_DWORD /d 1 /f

8. Configure the authentication mode for the RDP service:

		REG ADD "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp" /v UserAuthentication /t REG_DWORD  /d 1 /f

		REG ADD "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp" /v SecurityLayer /t REG_DWORD  /d 1 /f

		REG ADD "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp" /v fAllowSecProtocolNegotiation /t REG_DWORD  /d 1 /f

9. Enable RDP service by adding the following subkeys to the registry:：`REG ADD "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server" /v fDenyTSConnections /t REG_DWORD  /d 0 /f`

10. Allow WinRM through the three firewall profiles (Domain, Private and Public), and enable PowerShell Remote service: `Enable-PSRemoting -force`

11. Make sure that the following guest operating system firewall rules are in place:

	- Inbound

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

	- Inbound and outbound

			netsh advfirewall firewall set rule group="Remote Desktop" new enable=yes

			netsh advfirewall firewall set rule group="Core Networking" new enable=yes

	- Outbound

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

12. Run `winmgmt /verifyrepository` to check whether the Windows Management Instrumentation (WMI) repository is consistent. If the repository is corrupted,  see [this blog post](https://blogs.technet.microsoft.com/askperf/2014/08/08/wmi-repository-corruption-or-not) to learn how to fix the issue.

13. Make sure the Boot Configuration Data (BCD) settings match the following:

		bcdedit /set {bootmgr} device partition=<Boot Partition>

		bcdedit /set {bootmgr} integrityservices enable

		bcdedit /set {default} device partition=<OS Partition>

		bcdedit /set {default} integrityservices enable

		bcdedit /set {default} recoveryenabled Off

		bcdedit /set {default} osdevice partition=<OS Partition>

		bcdedit /set {default} bootstatuspolicy IgnoreAllFailures

14. Remove any extra Transport Driver Interface filters, such as software that analyzes TCP packets.
15. To make sure that disk is healthy and consistent, run a `CHKDSK /f` command.
16.	Uninstall all other third-party software and drivers.
17. Make sure that a third-party application is not using Port 3389. This port is used for the RDP service in Azure.
18.	If the Windows VDH that you want to upload is a domain controller, follow the extra steps to prepare the disk as specified [here](https://support.microsoft.com/kb/2904015).
19.	Do a reboot on the VM to make sure that the Windows is healthy， and that it can be reached by using the RDP connection.
20.	Reset the current local administrator password and make sure that you can use this account to sign in to Windows through the RDP connection.  This access permission is controlled by the "Allow log on through Remote Desktop Services" policy object. This object is located under "Computer Configuration\Windows Settings\Security Settings\Local Policies\User Rights Assignment."
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

## Suggested extra configurations

The following settings do not affect VHD uploading. However, we are recommended that you have them configured.

- Install [VM Agent](http://go.microsoft.com/fwlink/?LinkID=394789&clcid=0x409).

- Enable the Dump log collection.

		REG ADD "HKLM\SYSTEM\CurrentControlSet\Control\CrashControl" /v CrashDumpEnabled /t REG_DWORD /d 2 /f`

		REG ADD "HKLM\SOFTWARE\Microsoft\Windows\Windows Error Reporting\LocalDumps" /v DumpFolder /t REG_EXPAND_SZ /d "c:\CrashDumps" /f

		REG ADD "HKLM\SOFTWARE\Microsoft\Windows\Windows Error Reporting\LocalDumps" /v DumpCount /t REG_DWORD /d 10 /f

		REG ADD "HKLM\SOFTWARE\Microsoft\Windows\Windows Error Reporting\LocalDumps" /v DumpType /t REG_DWORD /d 2 /f

		sc config wer start= auto

- After the VM is created in Azure, setup the system defined size pagefile on drive D:

	`REG ADD "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /t REG_MULTI_SZ /v PagingFiles /d "D:\pagefile.sys 0 0" /f`

	## Next steps

	- [Upload a Windows VM image to Azure for Resource Manager deployments](virtual-machines-windows-upload-image.md)
