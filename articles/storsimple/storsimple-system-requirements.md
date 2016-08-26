<properties
   pageTitle="StorSimple system requirements | Microsoft Azure"
   description="Describes software, networking, and high availability requirements and best practices for a Microsoft Azure StorSimple solution."
   services="storsimple"
   documentationCenter="NA"
   authors="alkohli"
   manager="carmonm"
   editor=""/>

<tags
   ms.service="storsimple"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="TBD"
   ms.date="05/25/2016"
   ms.author="alkohli"/>

# StorSimple software, high availability, and networking requirements

## Overview

Welcome to Microsoft Azure StorSimple. This article describes important system requirements and best practices for your StorSimple device and for the storage clients accessing the device. We recommend that you review the information carefully before you deploy your StorSimple system, and then refer back to it as necessary during deployment and subsequent operation.

The system requirements include:

- **Software requirements for storage clients** - describes the supported operating systems and any additional requirements for those operating systems.
- **Networking requirements for the StorSimple device** - provides information about the ports that need to be open in your firewall to allow for iSCSI, cloud, or management traffic.
- **High availability requirements for StorSimple** - describes high availability requirements and best practices for your StorSimple device and host computer. 


## Software requirements for storage clients

The following software requirements are for the storage clients that access your StorSimple device.

| Supported operating systems | Version required | Additional requirements/notes |
| --------------------------- | ---------------- | ------------- |
| Windows Server              | 2008R2 SP1, 2012, 2012R2 |StorSimple iSCSI volumes are supported for use on only the following Windows disk types:<ul><li>Simple volume on basic disk</li><li>Simple and mirrored volume on dynamic disk</li></ul>Windows Server 2012 thin provisioning and ODX features are supported if you are using a StorSimple iSCSI volume.<br><br>StorSimple can create thinly provisioned and fully provisioned volumes. It cannot create partially provisioned volumes.<br><br>Reformatting a thinly provisioned volume may take a long time. We recommend deleting the volume and then creating a new one instead of reformatting. However, if you still prefer to reformat a volume:<ul><li>Run the following command before the reformat to avoid space reclamation delays: <br>`fsutil behavior set disabledeletenotify 1`</br></li><li>After the formatting is complete, use the following command to re-enable space reclamation:<br>`fsutil behavior set disabledeletenotify 0`</br></li><li>Apply the Windows Server 2012 hotfix as described in [KB 2878635](https://support.microsoft.com/kb/2870270) to your Windows Server computer.</li></ul></li></ul></ul> If you are configuring StorSimple Snapshot Manager or StorSimple Adapter for SharePoint, go to [Software requirements for optional components](#software-requirements-for-optional-components).|
| VMWare ESX | 5.5, and 6.0 | Supported with VMWare vSphere as iSCSI client. VAAI-block feature is supported with VMware vSphere on StorSimple devices.
| Linux RHEL/CentOS | 5 and 6 | Support for Linux iSCSI clients with open-iSCSI initiator versions 5 and 6. |
| Linux | SUSE Linux 11 | |
 > [AZURE.NOTE] IBM AIX is currently not supported with StorSimple.

## Software requirements for optional components

The following software requirements are for the optional StorSimple components (StorSimple Snapshot Manager and StorSimple Adapter for SharePoint).

| Component | Host platform | Additional requirements/notes |
| --------------------------- | ---------------- | ------------- |
| StorSimple Snapshot Manager | Windows Server 2008R2 SP1, 2012, 2012R2 | Use of StorSimple Snapshot Manager on Windows Server is required for backup/restore of mirrored dynamic disks and for any application-consistent backups.<br> StorSimple Snapshot Manager is supported only on Windows Server 2008 R2 SP1 (64-bit), Windows 2012 R2, and Windows Server 2012.<ul><li>If you are using Window Server 2012, you must install .NET 3.5–4.5 before you install StorSimple Snapshot Manager.</li><li>If you are using Windows Server 2008 R2 SP1, you must install Windows Management Framework 3.0 before you install StorSimple Snapshot Manager.</li></ul> |
| StorSimple Adapter for SharePoint | Windows Server 2008R2 SP1, 2012, 2012R2 |<ul><li>StorSimple Adapter for SharePoint is only supported on SharePoint 2010 and SharePoint 2013.</li><li>RBS requires SQL Server Enterprise Edition, version 2008 R2 or 2012.</li></ul>|

## Networking requirements for your StorSimple device

Your StorSimple device is a locked-down device. However, ports need to be opened in your firewall to allow for iSCSI, cloud, and management traffic. The following table lists the ports that need to be opened in your firewall. In this table, *in* or *inbound* refers to the direction from which incoming client requests access your device. *Out* or *outbound* refers to the direction in which your StorSimple device sends data externally, beyond the deployment: for example, outbound to the Internet.

| Port No.<sup>1,2</sup> | In or out | Port scope | Required | Notes |
|------------------------|-----------|------------|----------|-------|
|TCP 80 (HTTP)<sup>3</sup>|  Out |  WAN | No |<ul><li>Outbound port is used for Internet access to retrieve updates.</li><li>The outbound web proxy is user configurable.</li><li>To allow system updates, this port must also be open for the controller fixed IPs.</li></ul> |
|TCP 443 (HTTPS)<sup>3</sup>| Out | WAN | Yes |<ul><li>Outbound port is used for accessing data in the cloud.</li><li>The outbound web proxy is user configurable.</li><li>To allow system updates, this port must also be open for the controller fixed IPs.</li></ul>|
|UDP 53 (DNS) | Out | WAN | In some cases; see notes. |This port is required only if you are using an Internet-based DNS server. |
| UDP 123 (NTP) | Out | WAN | In some cases; see notes. |This port is required only if you are using an Internet-based NTP server. |
| TCP 9354 | Out | WAN | Yes |The outbound port is used by the StorSimple device to communicate with the StorSimple Manager service. |
| 3260 (iSCSI) | In | LAN | No | This port is used to access data over iSCSI.|
| 5985 | In | LAN | No | Inbound port is used by StorSimple Snapshot Manager to communicate with the StorSimple device.<br>This port is also used when you remotely connect to Windows PowerShell for StorSimple over HTTP. |
| 5986 | In | LAN | No | This port is used when you remotely connect to Windows PowerShell for StorSimple over HTTPS. |

<sup>1</sup> No inbound ports need to be opened on the public Internet.

<sup>2</sup> If multiple ports carry a gateway configuration, the outbound routed traffic order will be determined based on the port routing order described in [Port routing](#routing-metric), below.

<sup>3</sup> The controller fixed IPs on your StorSimple device must be routable and able to connect to the Internet. The fixed IP addresses are used for servicing the updates to the device. If the device controllers cannot connect to the Internet via the fixed IPs, you will not be able to update your StorSimple device.

> [AZURE.IMPORTANT] Ensure that the firewall does not modify or decrypt any SSL traffic between the StorSimple device and Azure.

### URL patterns for firewall rules

Network administrators can often configure advanced firewall rules based on the URL patterns to filter the inbound and the outbound traffic. Your StorSimple device and the StorSimple Manager service depend on other Microsoft applications such as Azure Service Bus, Azure Active Directory Access Control, storage accounts, and Microsoft Update servers. The URL patterns associated with these applications can be used to configure firewall rules. It is important to understand that the URL patterns associated with these applications can change. This in turn will require the network administrator to monitor and update firewall rules for your StorSimple as and when needed.

We recommend that you set your firewall rules for outbound traffic, based on StorSimple fixed IP addresses, liberally in most cases. However, you can use the information below to set advanced firewall rules that are needed to create secure environments.

> [AZURE.NOTE] The device (source) IPs should always be set to all the enabled network interfaces. The destination IPs should be set to [Azure datacenter IP ranges](https://www.microsoft.com/en-us/download/confirmation.aspx?id=41653).


| URL pattern                                                      | Component/Functionality                                           | Device IPs                           |
|------------------------------------------------------------------|---------------------------------------------------------------|-----------------------------------------|
| `https://*.storsimple.windowsazure.com/*`<br>`https://*.accesscontrol.windows.net/*`<br>`https://*.servicebus.windows.net/*`   | StorSimple Manager service<br>Access Control Service<br>Azure Service Bus| Cloud-enabled network interfaces        |
|`https://*.backup.windowsazure.com`|Device registration| DATA 0 only|
|`http://crl.microsoft.com/pki/*`<br>`http://www.microsoft.com/pki/*`|Certificate revocation |Cloud-enabled network interfaces |
| `https://*.core.windows.net/*` <br>`https://*.data.microsoft.com`<br>`http://*.msftncsi.com` | Azure storage accounts and monitoring | Cloud-enabled network interfaces        |
| `http://*.windowsupdate.microsoft.com`<br>`https://*.windowsupdate.microsoft.com`<br>`http://*.update.microsoft.com`<br> `https://*.update.microsoft.com`<br>`http://*.windowsupdate.com`<br>`http://download.microsoft.com`<br>`http://wustat.windows.com`<br>`http://ntservicepack.microsoft.com`| Microsoft Update servers<br>                             | Controller fixed IPs only               |
| `http://*.deploy.akamaitechnologies.com`                         |Akamai CDN |Controller fixed IPs only   |
| `https://*.partners.extranet.microsoft.com/*`                    | Support package                                                  | Cloud-enabled network interfaces        |

### Routing metric

A routing metric is associated with the interfaces and the gateway that route the data to the specified networks. Routing metric is used by the routing protocol to calculate the best path to a given destination, if it learns multiple paths exist to the same destination. The lower the routing metric, the higher the preference.

In the context of StorSimple, if multiple network interfaces and gateways are configured to channel traffic, the routing metrics will come into play to determine the relative order in which the interfaces will get used. The routing metrics cannot be changed by the user. You can however use the `Get-HcsRoutingTable` cmdlet to print out the routing table (and metrics) on your StorSimple device. More information on Get-HcsRoutingTable cmdlet in [Troubleshooting StorSimple deployment](storsimple-troubleshoot-deployment.md).

The routing metric algorithms are different depending on the software version running on your StorSimple device.

**Releases prior to Update 1**

This includes software versions prior to Update 1 such as the GA, 0.1, 0.2, or 0.3 release. The order based on routing metrics is as follows:

   *Last configured 10 GbE network interface > Other 10 GbE network interface > Last configured 1 GbE network interface > Other 1 GbE network interface*


**Releases starting from Update 1 and prior to Update 2**

This includes software versions such as 1, 1.1, or 1.2. The order based on routing metrics is decided as follows:

   *DATA 0 > Last configured 10 GbE network interface > Other 10 GbE network interface > Last configured 1 GbE network interface > Other 1 GbE network interface*

   In Update 1, the routing metric of DATA 0 is made the lowest; therefore, all the cloud-traffic is routed through DATA 0. Make a note of this if there are more than one cloud-enabled network interface on your StorSimple device.


**Releases starting from Update 2**

Update 2 has several networking-related improvements and the routing metrics has changed. The behavior can be explained as follows.

- A set of predetermined values have been assigned to network interfaces. 	

- Consider an example table shown below with values assigned to the various network interfaces when they are cloud-enabled or cloud-disabled but with a configured gateway. Note the values assigned here are example values only.


	| Network interface | Cloud-enabled | Cloud-disabled with gateway |
	|-----|---------------|---------------------------|
	| Data 0  | 1            | -                        |
	| Data 1  | 2            | 20                       |
	| Data 2  | 3            | 30                       |
	| Data 3  | 4            | 40                       |
	| Data 4  | 5            | 50                       |
	| Data 5  | 6            | 60                       |


- The order in which the cloud traffic will be routed through the network interfaces is:

	*Data 0 > Data 1 > Date 2 > Data 3 > Data 4 > Data 5*

	This can be explained by the following example.

	Consider a StorSimple device with two cloud-enabled network interfaces, Data 0 and Data 5. Data 1 through Data 4 are cloud-disabled but have a configured gateway. The order in which traffic will be routed for this device will be:

	*Data 0 (1) > Data 5 (6) > Data 1 (20) > Data 2 (30) > Data 3 (40) > Data 4 (50)*

	*where the numbers in parentheses indicate the respective routing metrics.*

	If Data 0 fails, the cloud traffic will get routed through Data 5. Given that a gateway is configured on all other network, if both Data 0 and Data 5 were to fail, the cloud traffic will go through Data 1.


- If a cloud-enabled network interface fails, then are 3 retries with a 30 second delay to connect to the interface. If all the retries fail, the traffic is routed to the next available cloud-enabled interface as determined by the routing table. If all the cloud-enabled network interfaces fail, then the device will fail over to the other controller (no reboot in this case).

- If there is a VIP failure for an iSCSI-enabled network interface, there will be 3 retries with a 2 seconds delay. This behavior has stayed the same from the previous releases. If all the iSCSI network interfaces fail, then a controller failover will occur (accompanied by a reboot).


- An alert is also raised on your StorSimple device when there is a VIP failure. For more information, go to [alert quick reference](storsimple-manage-alerts.md).

- In terms of retries, iSCSI will take precedence over cloud.

	Consider the following example:
	A StorSimple device has two network interfaces enabled, Data 0 and Data 1. Data 0 is cloud-enabled whereas Data 1 is both cloud and iSCSI-enabled. No other network interfaces on this device are enabled for cloud or iSCSI.

	If Data 1 fails, given it is the last iSCSI network interface, this will result in a controller failover to Data 1 on the other controller.


### Networking best practices

In addition to the above networking requirements, for the optimal performance of your StorSimple solution, please adhere to the following best practices:

- Ensure that your StorSimple device has a dedicated 40 Mbps bandwidth (or more) available at all times. This bandwidth should not be shared (or allocation should be guaranteed through the use of QoS policies) with any other applications.

- Ensure network connectivity to the Internet is available at all times. Sporadic or unreliable Internet connections to the devices, including no Internet connectivity whatsoever, will result in an unsupported configuration.

- Isolate the iSCSI and cloud traffic by having dedicated network interfaces on your device for iSCSI and cloud access. For more information, see how to [modify network interfaces](storsimple-modify-device-config.md#modify-network-interfaces) on your StorSimple device.

- Do not use a Link Aggregation Control Protocol (LACP) configuration for your network interfaces. This is an unsupported configuration.


## High availability requirements for StorSimple

The hardware platform that is included with the StorSimple solution has availability and reliability features that provide a foundation for a highly available, fault-tolerant storage infrastructure in your datacenter. However, there are requirements and best practices that you should comply with to help ensure the availability of your StorSimple solution. Before you deploy StorSimple, carefully review the following requirements and best practices for the StorSimple device and connected host computers.

For more information about monitoring and maintaining the hardware components of your StorSimple device, go to [Use the StorSimple Manager service to monitor hardware components and status](storsimple-monitor-hardware-status.md) and [StorSimple hardware component replacement](storsimple-hardware-component-replacement.md).

### High availability requirements and procedures for your StorSimple device

Review the following information carefully to ensure the high availability of your StorSimple device.

#### PCMs

StorSimple devices include redundant, hot-swappable power and cooling modules (PCMs). Each PCM has enough capacity to provide service for the entire chassis. To ensure high availability, both PCMs must be installed.

- Connect your PCMs to different power sources to provide availability if a power source fails.
- If a PCM fails, request a replacement immediately.
- Remove a failed PCM only when you have the replacement and are ready to install it.
- Do not remove both PCMs concurrently. The PCM module includes the backup battery module. Removing both of the PCMs will result in a shutdown without battery protection, and the device state will not be saved. For more information about the battery, go to [Maintain the backup battery module](storsimple-battery-replacement.md#maintain-the-backup-battery-module).

#### Controller modules

StorSimple devices include redundant, hot-swappable controller modules. The controller modules operate in an active/passive manner. At any given time, one controller module is active and is providing service, while the other controller module is passive. The passive controller module is powered on and becomes operational if the active controller module fails or is removed. Each controller module has enough capacity to provide service for the entire chassis. Both controller modules must be installed to ensure high availability.

- Make sure that both controller modules are installed at all times.

- If a controller module fails, request a replacement immediately.

- Remove a failed controller module only when you have the replacement and are ready to install it. Removing a module for extended periods will affect the airflow and hence the cooling of the system.

- Make sure that the network connections to both controller modules are identical, and the connected network interfaces have an identical network configuration.

- If a controller module fails or needs replacement, make sure that the other controller module is in an active state before replacing the failed controller module. To verify that a controller is active, go to [Identify the active controller on your device](storsimple-controller-replacement.md#identify-the-active-controller-on-your-device).

- Do not remove both controller modules at the same time. If a controller failover is in progress, do not shut down the standby controller module or remove it from the chassis.

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

StorSimple devices include solid state disks (SSDs) and hard disk drives (HDDs) that are protected using mirrored spaces. Use of mirrored spaces ensures that the device is able to tolerate the failure of one or more SSDs or HDDs.

- Make sure that all SSD and HDD modules are installed.

- If an SSD or HDD fails, request a replacement immediately.

- If an SSD or HDD fails or requires replacement, make sure that you remove only the SSD or HDD that requires replacement.

- Do not remove more than one SSD or HDD from the system at any point in time.
A failure of 2 or more disks of certain type (HDD, SSD) or consecutive failure within a short time frame may result in system malfunction and potential data loss. If this occurs, [contact Microsoft Support](storsimple-contact-microsoft-support.md) for assistance.

- During replacement, monitor the **Hardware Status** in the **Maintenance** page for the drives in the SSDs and HDDs. A green check status indicates that the disks are healthy or OK, whereas a red exclamation point indicates a failed SSD or HDD.

- We recommend that you configure cloud snapshots for all volumes that you need to protect in case of a system failure.

#### EBOD enclosure

StorSimple device model 8600 includes an Extended Bunch of Disks (EBOD) enclosure in addition to the primary enclosure. An EBOD contains EBOD controllers and hard disk drives (HDDs) that are protected using mirrored spaces. Use of mirrored spaces ensures that the device is able to tolerate the failure of one or more HDDs. The EBOD enclosure is connected to the primary enclosure through redundant SAS cables.

- Make sure that both EBOD enclosure controller modules, both SAS cables, and all the hard disk drives are installed at all times.

- If an EBOD enclosure controller module fails, request a replacement immediately.

- If an EBOD enclosure controller module fails, make sure that the other controller module is active before you replace the failed module. To verify that a controller is active, go to [Identify the active controller on your device](storsimple-controller-replacement.md#identify-the-active-controller-on-your-device).

- During an EBOD controller module replacement, continuously monitor the status of the component in the StorSimple Manager service by accessing **Maintenance** > **Hardware status**.

- If an SAS cable fails or requires replacement (Microsoft Support should be involved to make such a determination), make sure that you remove only the SAS cable that requires replacement.

- Do not concurrently remove both SAS cables from the system at any point in time.

### High availability recommendations for your host computers

Carefully review these best practices to ensure the high availability of hosts connected to your StorSimple device.

- Configure StorSimple with [two-node file server cluster configurations][1]. By removing single points of failure and building in redundancy on the host side, the entire solution becomes highly available.

- Use Continuously available (CA) shares available with Windows Server 2012 (SMB 3.0) for high availability during failover of the storage controllers. For additional information for configuring file server clusters and Continuously Available shares with Windows Server 2012, refer to this [video demo](http://channel9.msdn.com/Events/IT-Camps/IT-Camps-On-Demand-Windows-Server-2012/DEMO-Continuously-Available-File-Shares).

## Next steps

- [Learn about StorSimple system limits](storsimple-limits.md).
- [Learn how to deploy your StorSimple solution](storsimple-deployment-walkthrough-u2.md).

<!--Reference links-->
[1]: https://technet.microsoft.com/library/cc731844(v=WS.10).aspx
