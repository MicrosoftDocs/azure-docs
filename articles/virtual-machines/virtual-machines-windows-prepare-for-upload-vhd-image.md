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
	ms.date="08/10/2016"
	ms.author="genli"/>

# Prepare a Windows VHD to upload to Azure

The following are recommended steps for preparing Windows VHD for Azure:

## Prepare VM configuration for upload

1.	Make sure that the Windows VHD is working fine in the local server.
2.	Azure can only accept VHD disk file that created for generation 1 virtual machines. The disk must be in **Fixed size**. The maximum size allowed for the VHD is 1,023 GB.

	If you have a Windows VM image in VHDX format, convert it to a VHD using either of the following:

	- Hyper-V: Open Hyper-V and select your local computer on the left. Then in the menu above it, click **Action** > **Edit Disk**. Navigate through the screens by clicking **Next** and entering these options: *Path for your VHDX file* > **Convert** > **VHD** > **Fixed size** > *Path for the new VHD file*. Click **Finish** to close.

	- [Convert-VHD PowerShell cmdlet](http://technet.microsoft.com/library/hh848454.aspx): Read the blog post [Converting Hyper-V .vhdx to .vhd file formats](https://blogs.technet.microsoft.com/cbernier/2013/08/29/converting-hyper-v-vhdx-to-vhd-file-formats-for-use-in-windows-azure/) for more information.

	If you have a Windows VM image in the [VMDK file format](https://en.wikipedia.org/wiki/VMDK), convert it to a VHD by using the [Microsoft Virtual Machine Converter](https://www.microsoft.com/download/details.aspx?id=42497). Read the blog [How to Convert a VMware VMDK to Hyper-V VHD](http://blogs.msdn.com/b/timomta/archive/2015/06/11/how-to-convert-a-vmware-vmdk-to-hyper-v-vhd.aspx) for more information.

## Prepare Windows configuration for upload

> [AZURE.NOTE] You must run the following commands with [administrative privileges](https://technet.microsoft.com/library/cc947813.aspx).

1. Remove any static persistent route on the routing table:

	A.	Run  `route print` to view the route table.

	B.	Check the **Persistence Routes** sections. If there is a persistent route, use [route delete](https://technet.microsoft.com/library/cc739598.apx) to remove it.

2. Remove the Winhttp proxy: `netsh winhttp reset proxy`
3. Configure the disk SAN policy to [Onlineall](https://technet.microsoft.com/library/gg252636.aspx): `diskpart san policy=onlineall`
4. Use Coordinated Universal Time (UTC) time for Windows and set the startup type of the Windows Time (w32time) service to automatically:

	 - `REG ADD HKLM\SYSTEM\CurrentControlSet\Control\TimeZoneInformation /v RealTimeIsUniversal /t REG_DWORD /d 1`

   - `sc config w32time start= auto`

5. Make sure that the below windows services are set to its windows default values which are all enabled and with the following startup setting. You can run these commands to reset the startup setting.

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

6. Remove any self-signed certificate tied to the Remote Desktop Protocol (RDP) service:

	A. Open MMC, add Certificates snap-in, select **Compute Account** certificates, and then select **Local computer**.

	B. Navigate to the **Remote Desktop** folder -> **Certificates**, remove the certificates listed in this folder.

7. Configure the [KeepAlive](https://technet.microsoft.com/library/cc957549.aspx) values on the RDP service:

		REG ADD "HKLM\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services" /v KeepAliveEnable /t REG_DWORD  /d 1 /f

		REG ADD "HKLM\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services" /v KeepAliveInterval /t REG_DWORD  /d 1 /f

		REG ADD "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\Winstations\RDP-Tcp" /v KeepAliveTimeout /t REG_DWORD /d 1 /f

8. Configure authentication mode for the RDP service:

		REG ADD "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp" /v UserAuthentication /t REG_DWORD  /d 1 /f

		REG ADD "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp" /v SecurityLayer /t REG_DWORD  /d 1 /f

		REG ADD "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp" /v fAllowSecProtocolNegotiation /t REG_DWORD  /d 1 /f

9. Enable RDP service：`REG ADD "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server" /v fDenyTSConnections /t REG_DWORD  /d 0 /f`

10. Allow WinRM through the three firewall profiles (Domain, Private and Public), and enable PowerShell Remote service: `Enable-PSRemoting -force`

11. Make sure that the following GuestOS firewall rules are in place:

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

12. Run `winmgmt /verifyrepository` to check if the Windows Management Instrumentation (WMI) repository is consistent. If the repository is corrupted,  see [here](https://blogs.technet.microsoft.com/askperf/2014/08/08/wmi-repository-corruption-or-not) to see how to rebuild the repository. /).
13. Ensure the BCD settings are the same as below:

		bcdedit /set {bootmgr} device partition=<Boot Partition>

		bcdedit /set {bootmgr} integrityservices enable

		bcdedit /set {default} device partition=<OS Partition>

		bcdedit /set {default} integrityservices enable

		bcdedit /set {default} recoveryenabled Off

		bcdedit /set {default} osdevice partition=<OS Partition>

		bcdedit /set {default} bootstatuspolicy IgnoreAllFailures

14. Remove any extra Transport Driver Interface (TDI) filters like any software that analyze TCP packets.
15. Run a `CHKDSK /f` to ensure the disk is healthy and consistent.
16.	Uninstall the other 3rd party (Other than Microsoft Hyper-V) physical，virtualization software or drivers.
17. Make sure that there is no third-party application is using Port 3389. This port is used for the RDP service in Azure.
18.	If the Windows VDH you want to upload is a Domain Controller, follow the extra steps to prepare the disk as specified [here](https://support.microsoft.com/kb/2904015).
19.	Do a healthy reboot on the VM to ensure the Windows is healthy， and it can be reached by using RDP connection.
20.	Reset the current local administrator password and make sure you can use this account to login Windows through RDP connection.  This access permission is controlled by the "Allow log on through Remote Desktop Services" policy object, which under "Computer Configuration\Windows Settings\Security Settings\Local Policies\User Rights Assignment".
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

## Suggested extra configuration

The following settings do not affect VHD uploading. However, it is good to have them configured.

- Install [VM Agent](http://go.microsoft.com/fwlink/?LinkID=394789&clcid=0x409).

- Enable Dump log collection.

		REG ADD "HKLM\SYSTEM\CurrentControlSet\Control\CrashControl" /v CrashDumpEnabled /t REG_DWORD /d 2 /f`

		REG ADD "HKLM\SOFTWARE\Microsoft\Windows\Windows Error Reporting\LocalDumps" /v DumpFolder /t REG_EXPAND_SZ /d "c:\CrashDumps" /f

		REG ADD "HKLM\SOFTWARE\Microsoft\Windows\Windows Error Reporting\LocalDumps" /v DumpCount /t REG_DWORD /d 10 /f

		REG ADD "HKLM\SOFTWARE\Microsoft\Windows\Windows Error Reporting\LocalDumps" /v DumpType /t REG_DWORD /d 2 /f

		sc config wer start= auto

- After the VM is created in Azure, setup the system defined size pagefile on D:

	`REG ADD "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management" /t REG_MULTI_SZ /v PagingFiles /d "D:\pagefile.sys 0 0" /f`

	## Next steps

	- [Upload a Windows VM image to Azure for Resource Manager deployments](virtual-machines-windows-upload-image.md)
	-
