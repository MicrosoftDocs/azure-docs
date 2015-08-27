<properties 
   pageTitle="StorSimple system requirements | Microsoft Azure" 
   description="Describes system requirements and best practices for software,  high availability, and networking for an Azure StorSimple solution." 
   services="storsimple" 
   documentationCenter="NA" 
   authors="alkohli" 
   manager="carolz" 
   editor=""/>

<tags
   ms.service="storsimple"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="TBD" 
   ms.date="08/26/2015"
   ms.author="alkohli"/>

# StorSimple software, high availability, and networking requirements

## Overview

Welcome to Microsoft Azure StorSimple. This article describes important system requirements and best practices for your StorSimple device and for the storage clients accessing the device. These requirements include:

- **Software requirements for storage clients** - describes the supported operating systems and any additional requirements for those operating systems.
- **High availability requirements for StorSimple** - describes high availability requirements and best practices for your StorSimple device and host computer. 
- **Networking requirements for the StorSimple device** - provides information about the ports that need to be open in your firewall to allow for iSCSI, cloud, or management traffic.

We recommend that you review the following information carefully before you deploy your Azure StorSimple system, and then refer back to it as necessary during deployment and subsequent operation.

## Software requirements for storage clients 

The following software requirements are for the storage clients that access your StorSimple device.

| Supported operating systems | Version required | Details/notes |
| --------------------------- | ---------------- | ------------- |
| Windows Server              | 2008R2 SP1, 2012, 2012R2 |<ul><li>StorSimple iSCSI volumes are supported for use on only the following Windows disk types:<ul><li>Simple volume on basic disk</li><li>Simple and mirrored volume on dynamic disk</li></ul>Use of StorSimple Snapshot Manager on Windows Server is required for backup/restore of mirrored dynamic disks and for any application-consistent backups.</li><li>StorSimple Snapshot Manager is supported only on Windows Server 2008 R2 SP1 (64-bit), Windows 2012 R2, and Windows Server 2012. <ul><li>If you are using Window Server 2012, you must install .NET 3.5–4.5 before you install StorSimple Snapshot Manager.</li><li>If you are using Windows Server 2008 R2 SP1, you must install Windows Management Framework 3.0 before you install StorSimple Snapshot Manager.</li></ul></li><li>Windows Server 2012 thin provisioning and ODX features are supported if you are using a StorSimple iSCSI volume.<ul><li>StorSimple can create thinly provisioned volumes only. It cannot create fully provisioned or partially provisioned volumes.</li><li>Reformatting a thinly provisioned volume may take a long time. We recommend deleting the volume and then creating a new one instead of reformatting.</li><li>If you still prefer to reformat a volume:<ul><li>Run the following command before the reformat to avoid space reclamation delays: <br>`fsutil behavior set disabledeletenotify 1`</br></li><li>After the formatting is complete, use the following command to re-enable space reclamation:<br>`fsutil behavior set disabledeletenotify 0`</br></li><li>Apply the Windows Server 2012 hotfix as described in KB2870270 to your Windows Server computer.</li></ul></li></ul><li>StorSimple Adapter for SharePoint is only supported on SharePoint 2010 and SharePoint 2013. RBS requires SQL Server Enterprise Edition, version 2008 R2 or 2012.</li></ul>|
| VMWare | Tested with VMware vSphere 5.1 as iSCSI client | VAAI-block feature is tested with VMware vSphere v.5.1 on StorSimple devices. 
| Linux RHEL/CentOS | Support for Linux iSCSI clients with Open-iSCSI initiator versions 5 and 6 | Supported with open-iSCSI initiator only. |
| Linux | SUSE Linux 11 | |
 > [AZURE.NOTE] Based on the limited testing performed in-house, IBM AIX is currently not supported with StorSimple.

## High availability requirements for StorSimple

The hardware platform that is included with the StorSimple solution has enterprise-grade availability and reliability features that provide a foundation for a highly available, fault-tolerant storage infrastructure in your datacenter. However, there are requirements and best practices that you should comply with to help ensure the availability of your Azure StorSimple solution. Before you deploy Azure StorSimple, carefully review the following requirements and best practices for the StorSimple device and connected host computers.

### High availability requirements and procedures for your StorSimple device

Review the following information carefully to ensure the high availability of your StorSimple device.

#### Power and Cooling Modules (PCMs)

StorSimple devices include redundant, hot-swappable PCMs. Each PCM has enough capacity to provide service for the entire chassis. To ensure high availability, both PCMs must be installed. 

- Connect your PCMs to different power sources to provide availability if a power source fails.

- If a PCM fails, request a replacement immediately.

- Remove a failed PCM only when you have the replacement and are ready to install it.

- Do not remove both PCMs concurrently. The PCM module includes the battery. Removing both of the PCMs will result in a no battery-protected shutdown.

#### Controller modules

StorSimple devices include redundant, hot-swappable controller modules. The controller modules operate in an active/passive manner. At any given time, one controller module is active and is providing service, while the other controller module is passive. The passive controller module is powered on and becomes operational if the active controller module fails or is removed. Each controller module has enough capacity to provide service for the entire chassis. Both controller modules must be installed to ensure high availability.

- Make sure that both controller modules are installed at all times.

- If a controller module fails, request a replacement immediately.

- Remove a failed controller module only when you have the replacement and are ready to install it. Removing a module for extended periods will affect the airflow and hence the cooling of the system.

- Make sure that the network connections to both controller modules are identical, and the connected network interfaces have an identical network configuration.

- If a controller module fails or needs replacement, make sure that the other controller module is in an active state before replacing the failed controller module.

- Do not remove both controller modules at the same time.

- If a controller failover is in progress, do not shut down the standby controller module or remove it from the chassis.

- After a controller failover, wait at least five minutes before removing either controller module. 

#### Network interfaces

StorSimple device controller modules each have four 1 Gigabit and two 10 Gigabit Ethernet network interfaces.

- Make sure that the network connections to both controller modules are identical, and the network interfaces that the controller module interfaces are connected to have an identical network configuration.

- When possible, deploy network connections across different switches to ensure service availability in the event of a network device failure.

- When unplugging the only or the last remaining iSCSI-enabled interface (with IPs assigned), disable the interface first and then unplug the cables. If the interface is unplugged first, then it will cause the active controller to fail over to the passive controller. If the passive controller also has its corresponding interfaces unplugged, then both the controllers will reboot multiple times before settling on one controller.

- Connect at least two DATA interfaces to the network from each controller module.

- If you have enabled the two 10 GbE interfaces, deploy those across different switches.

- When possible, use MPIO on servers to ensure that the servers can tolerate a link, network, or interface failure.

For more information about networking your device for high availability and performance, go to [Install your StorSimple 8100 device](storsimple-8100-hardware-installation.md#cable-your-storsimple-8100-device) or [Install your StorSimple 8600 device](storsimple-8600-hardware-installation.md#cable-your-storsimple-8600-device).

#### SSDs and HDDs

StorSimple devices include solid state disks (SSDs) and hard disk drives (HDDs) that are protected using mirrored spaces, and a hot-spare is provided for the HDDs. Use of mirrored spaces ensures that the device is able to tolerate the failure of one or more SSDs or HDDs.

- Make sure that all SSD and HDD modules are installed.

- If an SSD or HDD fails, request a replacement immediately.

- If an SSD or HDD fails or requires replacement, make sure that you remove only the SSD or HDD that requires replacement.

- Do not remove more than one SSD or HDD from the system at any point in time.

- During replacement, monitor the **Hardware Status** in the **Maintenance** page for the drives in the SSDs and HDDs. A green check status indicates that the disks are healthy or OK, whereas a red exclamation point indicates a failed SSD or HDD.

- A failure of 2 or more disks of certain type (HDD, SSD) or consecutive failure within a short time frame may result in system malfunction and potential data loss. If this occurs, contact technical support for assistance. We recommend that you configure cloud snapshots for all volumes that you need to protect in case of a system failure.

#### EBOD enclosure

StorSimple device model 8600 includes an Extended Bunch of Disks (EBOD) enclosure in addition to the primary enclosure. An EBOD contains EBOD controllers and hard disk drives (HDDs) that are protected using mirrored spaces. Use of mirrored spaces ensures that the device is able to tolerate the failure of one or more HDDs. The EBOD enclosure is connected to the primary enclosure through redundant SAS cables.

- Make sure that both EBOD enclosure controller modules, both SAS cables, and all the hard disk drives are installed at all times.

- If an EBOD enclosure controller module or an HDD fails, request a replacement immediately.

- If an EBOD enclosure controller module fails, make sure that the other controller module is active before you replace the failed module.

- If an HDD fails or requires replacement, make sure that you remove only the HDD that requires replacement. Do not remove an HDD until there is an indication that the disks and the array are healthy.

- Do not remove more than one HDD from the system at any point in time.

- During an EBOD controller module or HDD replacement, continuously monitor the status of the relevant component in the StorSimple Manager service by accessing **Maintenance** - **Hardware** status.

- If an SAS cable fails or requires replacement (Microsoft Support should be involved to make such a determination), make sure that you remove only the SAS cable that requires replacement.

- Do not concurrently remove both SAS cables from the system at any point in time.

### High availability requirements for your host computers

Carefully review these requirements and best practices to ensure the high availability of hosts connected to your StorSimple device.

- Configure StorSimple with [two-node file server cluster configurations][1]. By removing single points of failure and building in redundancy on the host side, the entire solution becomes highly available.

- Use Continuously available (CA) shares available with Windows Server 2012 (SMB 3.0) for high availability during failover of the storage controllers. For additional information for configuring file server clusters and Continuously Available shares with Windows Server 2012, refer to this [video demo](http://channel9.msdn.com/Events/IT-Camps/IT-Camps-On-Demand-Windows-Server-2012/DEMO-Continuously-Available-File-Shares).

## Networking requirements for your StorSimple device

Your StorSimple device is a locked-down device. However, ports need to be opened in your firewall to allow for iSCSI, cloud, or management traffic. The following table lists the ports that need to be opened in your firewall. In this table, *in* or *inbound* refers to the direction from which incoming client requests access your device. *Out* or *outbound* refers to the direction in which your StorSimple device sends data externally, beyond the deployment: for example, outbound to the Internet.

| Port No.<sup>1,2</sup> | In or out | Port scope | Required | Notes |
|------------------------|-----------|------------|----------|-------| 
|TCP 80 (HTTP)<sup>3</sup>|  Out |  WAN | No |<ul><li>Outbound port is used for Internet access to retrieve updates.</li><li>The outbound web proxy is user configurable.</li><li>To allow system updates, this port must also be open for the controller fixed IPs.</li></ul> |
|TCP 443 (HTTPS)<sup>3</sup>| Out | WAN | Yes |<ul><li>Outbound port is used for accessing data in the cloud.</li><li>The outbound web proxy is user configurable.</li><li>To allow system updates, this port must also be open for the controller fixed IPs.</li></ul>|
|UDP 53 (DNS) | Out | WAN | In some cases; see notes. |This port is required only if you are using an Internet-based DNS server. |
| UDP 123 (NTP) | Out | WAN | In some cases; see notes. |This port is required only if you are using an Internet-based NTP server. |
| TCP 9354 | Out | WAN | In some cases; see notes. |The outbound port is used by the StorSimple Manager service to communicate with the device. This port is required if your current network does not support using HTTP 1.1 to connect to the Internet; for instance if you are using an HTTP 1.0-based proxy server.<br> If connecting via a proxy server, refer to [service bus requirements](https://msdn.microsoft.com/library/azure/ee706729.aspx) for detailed information. |
| 3260 (iSCSI) | In | LAN | No | This port is used to access data over iSCSI.|
| 5985 | In | LAN | No | Inbound port is used by StorSimple Snapshot Manager to communicate with the StorSimple device.<br>This port is also used when you remotely connect to Windows PowerShell for StorSimple over HTTP or HTTPS. |

<sup>1</sup> No inbound ports need to be opened on the public Internet.

<sup>2</sup> If multiple ports carry a gateway configuration, the outbound routed traffic order will be determined based on the port routing order described below.

<sup>3</sup> The controller fixed IPs on your StorSimple device must be routable and able to connect to the Internet. The fixed IP addresses are used for servicing the updates to the device. If the device controllers cannot connect to the Internet via the fixed IPs, you will not be able to update your StorSimple device.

### Port routing

Port routing is different depending on the software version running on your StorSimple device.

- If the device is running a software version earlier that Update 1, such as the GA, 0.1, 0.2, or 0.3 release, then the port routing is decided as follows:

     Last configured 10 GbE network interface > Other 10 GbE network interface > Last configured 1 GbE network interface > Other 1 GbE network interface

- If the device is running Update 1, then the port routing is decided as follows:

     DATA 0 > Last configured 10 GbE network interface > Other 10 GbE network interface > Last configured 1 GbE network interface > Other 1 GbE network interface

In Update 1, the routing metric of DATA 0 is made the lowest; therefore, all the cloud-traffic is routed through DATA 0. Make a note of this if there are more than one cloud-enabled network interfaces on your StorSimple device.

### Networking best practices

In addition to the above networking requirements, for the optimal performance of your StorSimple solution, please adhere to the following best practices:

- Ensure that your StorSimple device has a dedicated 40 Mbps bandwidth (or more) available at all times. This bandwidth should not be shared with any other applications.

- Ensure network connectivity to the Internet is available at all times. Sporadic or unreliable Internet connections to the devices, including no Internet connectivity whatsoever, will result in an unsupported configuration.

- Isolate the iSCSI and cloud traffic by having dedicated network interfaces on your device for iSCSI and cloud access. For more information, see how to [modify network interfaces](storsimple-modify-device-config.md#modify-network-interfaces) on your StorSimple device.

## Next steps

- [Learn about StorSimple system limits](storsimple-limits.md).
- [Learn how to deploy your StorSimple solution](storsimple-deployment-walkthrough.md).
 
<!--Reference links-->
[1]: https://technet.microsoft.com/library/cc731844(v=WS.10).aspx