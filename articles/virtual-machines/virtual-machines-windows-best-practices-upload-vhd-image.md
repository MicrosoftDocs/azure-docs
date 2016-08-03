<properties
	pageTitle="Best Practices for uploading Windows VM to Azure | Microsoft Azure"
	description="Best practices for preparing and uploading the Windows VM to Azure"
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
	ms.date="08/02/2016"
	ms.author="genli"/>

# Best Practices for uploading Windows VM to Azure

The following are best practices for preparing and uploading the Windows VM to Azure:

## VM Configuration

1.	Make sure that the VHD disk is working fine in the local Hyper-V.
2.	Azure can only accept VHD disk file that created for generation 1 virtual machines. The disk must be in Fixed size. The maximum size allowed for the VHD is 1,023 GB.

	If you have a Windows VM image in VHDX format, convert it to a VHD using either of the following:

	- Hyper-V: Open Hyper-V and select your local computer on the left. Then in the menu above it, click Action > Edit Disk.... Navigate through the screens by clicking Next and entering these options: Path for your VHDX file > Convert > VHD > Fixed size > Path for the new VHD file. Click Finish to close.

	- Convert-VHD PowerShell cmdlet: Read the blog post Converting Hyper-V .vhdx to .vhd file formats for more information.

	If you have a Windows VM image in the VMDK file format, convert it to a VHD by using the Microsoft Virtual Machine Converter. Read the blog How to Convert a VMware VMDK to Hyper-V VHD for more information.

3.	Remove the Network adapter from Hyper-V Manager and set to “Not connected” or reset all the network interfaces to default in Windows:

	-	Remove all static IP address, gateway and DNS settings.
	-	Set the IP setting to “Obtain an IP address automatically”.
	- Set the DNS setting to “Obtain DNS server address automatically”

## Windows Configuration

1. Remove any static persistent route on the routing table:

	A.	Run route print to view the route table.

	B.	Check the “Persistence Routes” sections. If there is a persistent route, use route delete to remove it.

2. Remove the Winhttp proxy by runing the following cmd: `netsh winhttp reset proxy`
3. Setup the disk SAN policy: `diskpart san policy=onlineall`
4. Setup the time service:

		REG ADD HKLM\SYSTEM\CurrentControlSet\Control\TimeZoneInformation /v RealTimeIsUniversal /t REG_DWORD /d 1

		 sc config w32time start= auto`

5. Make sure that the below windows services are set to its windows default values which are all enabled and with the following startup setting:

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

6. Remove any self-signed certificate tied to RDP listener:

	A. Open MMC, add Certificates snap-in, select “Compute Account” certificates, and then select “Local computer”.

	B. Navigate to the **Remote Desktop** folder -> **Certificates**, remove the certificates listed in this folder.

7. Setup the KeepAlive values on the RDP listener

		REG ADD "HKLM\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services" /v KeepAliveEnable /t REG_DWORD  /d 1 /f

		REG ADD "HKLM\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services" /v KeepAliveInterval /t REG_DWORD  /d 1 /f

		REG ADD "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\Winstations\RDP-Tcp" /v KeepAliveTimeout /t REG_DWORD /d 1 /f

8. Make sure that NLA is enabled:

		REG ADD "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp" /v UserAuthentication /t REG_DWORD  /d 1 /f

		REG ADD "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp" /v SecurityLayer /t REG_DWORD  /d 1 /f

		REG ADD "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp" /v fAllowSecProtocolNegotiation /t REG_DWORD  /d 1 /f

9. Enable RDP：`REG ADD "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server" /v fDenyTSConnections /t REG_DWORD  /d 0 /f`

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

12. Make sure that the WMI repository is healthy.
13. Ensure the BCD settings are the same as below:

		bcdedit /set {bootmgr} device partition=*Boot Partition*

		bcdedit /set {bootmgr} integrityservices enable

		bcdedit /set {default} device partition=*OS Partition*

		bcdedit /set {default} integrityservices enable

		bcdedit /set {default} recoveryenabled Off

		bcdedit /set {default} osdevice partition=*OS Partition*

		bcdedit /set {default} bootstatuspolicy IgnoreAllFailures

14. Remove any extra TDI filters like any software that analyze TCP packets.
15. Run a `CHKDSK /f` to ensure the disk is healthy and consistent.
16.	Uninstall all the other 3rd party (Other than Microsoft Hyper-V) physical or Virtualization software/drivers.
17. Ensure no 3rd Party application is using/tied to Port 3389.
18.	Ensure the a VM created from the disk in local Hyper-V is running fine.
19.	If this is a Domain Controller on-prem, follow the extra steps to prepare the disk as specified here https://support.microsoft.com/en-us/kb/2904015
20.	Before doing any migration, please be so kind as to do a healthy reboot on the VM to ensure the OS is healthy and if it is reachable with RDP
21.	Before migration, another option that I usually suggest customers in any case: reset the current local administrator password or create a new account and make sure it’s allowed by policies to RDP into the VM:
22. “Allow log on through Remote Desktop Services”, GPO_name\Computer Configuration\Windows Settings\Security Settings\Local Policies\User Rights Assignment
23.	Ideally, the OS patch level should be at the latest however if that is not possible, please ensure the following KBs are installed:

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

	- [KB3148528](https://support.microsoft.com/kb/3148528) MS16-048: Description of the security update for CSRSS: April 12, 2016
	System freezes during disk I/O in Windows
