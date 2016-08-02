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
		-	Set the IP setting to “Obtain an IP address automatically.
		- Set the DNS setting to “Obtain DNS server address automatically”

## Windows Configuration

1. Remove any static persistent route on the routing table:

	A.	Run route print to view the route table.

	B.	Check the “Persistence Routes” sections. If there is a persistent route, use route delete to remove it.

2. Remove the Winhttp proxy by runing the following cmd: `netsh winhttp reset proxy`
3. Setup the disk SAN policy: `diskpart san policy=onlineall`
4. Setup the time service:

	- `REG ADD HKLM\SYSTEM\CurrentControlSet\Control\TimeZoneInformation /v RealTimeIsUniversal /t REG_DWORD /d 1`
	- `sc config w32time start= auto`
5. Make sure that the below windows services are set to its windows default values which are all enabled and with the following startup setting:

	`sc config bfe start= auto
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
	sc config RemoteRegistry start= auto`

6. Remove any self-signed certificate tied to RDP listener:

	A. Open MMC, add Certificates snap-in, select “Compute Account” certificates, and then select “Local computer”.

	B. Navigate to the Remote Desktop folder -> Certificates, remove the certificates listed in this folder.

7. Setup the KeepAlive values on the RDP listener

	-	`REG ADD "HKLM\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services" /v KeepAliveEnable /t REG_DWORD  /d 1 /f`

	- `REG ADD "HKLM\SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services" /v KeepAliveInterval /t REG_DWORD  /d 1 /f`

	- `REG ADD "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\Winstations\RDP-Tcp" /v KeepAliveTimeout /t REG_DWORD /d 1 /f`
