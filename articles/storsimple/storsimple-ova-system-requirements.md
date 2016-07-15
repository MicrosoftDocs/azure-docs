<properties
   pageTitle="StorSimple Virtual Array system requirements"
   description="Learn about the software and networking requirements for your StorSimple Virtual Array"
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
   ms.workload="NA"
   ms.date="07/14/2016"
   ms.author="alkohli"/>

# StorSimple Virtual Array system requirements

## Overview

This article describes important system requirements for your Microsoft Azure StorSimple Virtual Array (also known as StorSimple on-premises virtual device or StorSimple virtual device) and for the storage clients accessing the array. We recommend that you review the information carefully before you deploy your StorSimple system, and then refer back to it as necessary during deployment and subsequent operation.

The system requirements include:

-   **Software requirements for storage clients** - describes the supported virtualization platforms, web browsers, iSCSI initiators, SMB clients, minimum virtual device requirements, and any additional requirements for those operating systems.

-   **Networking requirements for the StorSimple device** - provides information about the ports that need to be open in your firewall to allow for iSCSI, cloud, or management traffic.

The StorSimple system requirements information published in this article applies to StorSimple Virtual Arrays only.

- For 8000 series devices, go to [System requirements for your StorSimple 8000 series device](storsimple-system-requirements.md).
 
- For 7000 series devices, go to [System requirements for your StorSimple 5000-7000 series device](http://onlinehelp.storsimple.com/1_StorSimple_System_Requirements).


## Software requirements

The software requirements include the information on the supported web browsers, SMB versions, virtualization platforms and the minimum virtual device requirements.

### Supported virtualization platforms


| **Hypervisor** | **Version**                          |
|----------------|--------------------------------------|
| Hyper-V        | Windows Server 2008 R2 SP1 and later |
| VMware ESXi    | 5.5 and later                        |

### Virtual device requirements

| **Component**                                | **Requirement**            |
|----------------------------------------------|----------------------------|
| Minimum number of virtual processors (cores) | 4                          |
| Minimum memory (RAM)                         | 8 GB                       |
| Disk space<sup>1</sup>                       | OS disk - 80 GB <br></br>Data disk - 500 GB to 8 TB|
| Minimum number of network interface(s)       | 1                          |
| Minimum Internet bandwidth<sup>2</sup>       | 5 Mbps                     |

<sup>1</sup> - Thin provisioned

<sup>2</sup> - Network requirements may vary depending on the daily data change rate. For example, if a device needs to back up 10 GB or more changes during a day, then the daily backup over a 5 Mbps connection could take up to 4.25 hours (if the data could not be compressed or deduplicated).

### Supported web browsers

| **Component**     | **Version** | **Additional requirements/notes** |
|-------------------|-----------------|-----------------------------------|
| Microsoft Edge    | Latest version  |                                   |
| Internet Explorer | Latest version  | Tested with Internet Explorer 11  |
| Google Chrome     | Latest version  | Tested with Chrome 46             |

### Supported storage clients 

The following software requirements are for the iSCSI initiators that access your StorSimple Virtual Array (configured as an iSCSI server).

| **Supported operating systems** | **Version required** | **Additional requirements/notes** |
| --------------------------- | ---------------- | ------------- |
| Windows Server              | 2008R2 SP1, 2012, 2012R2 |StorSimple can create thinly provisioned and fully provisioned volumes. It cannot create partially provisioned volumes. StorSimple iSCSI volumes are supported for only: <ul><li>Simple volumes on Windows basic disks.</li><li>Windows NTFS for formatting a volume.</li>|

The following software requirements are for the SMB clients that access your StorSimple Virtual Array (configured as a file server).

| **SMB Version** |
|-------------|
| SMB 2.x     |
| SMB 3.0     |
| SMB 3.02    |
 
## Networking requirements 

The following table lists the ports that need to be opened in your firewall to allow for iSCSI, SMB, cloud, or management traffic. In this table, *in* or *inbound* refers to the direction from which incoming client requests access your device. *Out* or *outbound* refers to the direction in which your StorSimple device sends data externally, beyond the deployment: for example, outbound to the Internet.

| **Port No.<sup>1</sup>** | **In or out** | **Port scope** | **Required**              | **Notes**                                                                                                            |
|--------------------------|---------------|----------------|---------------------------|----------------------------------------------------------------------------------------------------------------------|
| TCP 80 (HTTP)            | Out           | WAN            | No                        | Outbound port is used for Internet access to retrieve updates. <br></br>The outbound web proxy is user configurable. |
| TCP 443 (HTTPS)          | Out           | WAN            | Yes                       | Outbound port is used for accessing data in the cloud. <br></br>The outbound web proxy is user configurable. |
| UDP 53 (DNS)             | Out           | WAN            | In some cases; see notes. | This port is required only if you are using an Internet-based DNS server. <br></br> **Note**: If deploying a file server, we recommend using local DNS server.|
| UDP 123 (NTP)            | Out           | WAN            | In some cases; see notes. | This port is required only if you are using an Internet-based NTP server.<br></br> **Note:** If deploying a file server, we recommend synchronizing time with your Active Directory domain controllers.  |
| TCP 80 (HTTP)           | In            | LAN            | Yes                       | This is the inbound port for local UI on the StorSimple device for local management. <br></br> **Note**: Accessing the local UI over HTTP will automatically redirect to HTTPS.|
| TCP 443 (HTTPS)		   | In            | LAN            | Yes                       | This is the inbound port for local UI on the StorSimple device for local management.|
| TCP 3260 (iSCSI)         | In            | LAN            | No                        | This port is used to access data over iSCSI.|

<sup>1</sup> No inbound ports need to be opened on the public Internet.

> [AZURE.IMPORTANT] Ensure that the firewall does not modify or decrypt any SSL traffic between the StorSimple device and Azure.


### URL patterns for firewall rules 

Network administrators can often configure advanced firewall rules based on the URL patterns to filter the inbound and the outbound traffic. Your virtual array and the StorSimple Manager service depend on other Microsoft applications such as Azure Service Bus, Azure Active Directory Access Control, storage accounts, and Microsoft Update servers. The URL patterns associated with these applications can be used to configure firewall rules. It is important to understand that the URL patterns associated with these applications can change. This in turn will require the network administrator to monitor and update firewall rules for your StorSimple as and when needed. 

We recommend that you set your firewall rules for outbound traffic, based on StorSimple fixed IP addresses, liberally in most cases. However, you can use the information below to set advanced firewall rules that are needed to create secure environments.

> [AZURE.NOTE] 
> 
> - The device (source) IPs should always be set to all the cloud-enabled network interfaces. 
> - The destination IPs should be set to [Azure datacenter IP ranges](https://www.microsoft.com/en-us/download/confirmation.aspx?id=41653).


| URL pattern                                                      | Component/Functionality                                           |
|------------------------------------------------------------------|---------------------------------------------------------------|
| `https://*.storsimple.windowsazure.com/*`<br>`https://*.accesscontrol.windows.net/*`<br>`https://*.servicebus.windows.net/*`   | StorSimple Manager service<br>Access Control Service<br>Azure Service Bus|
|`http://*.backup.windowsazure.com`|Device registration|
|`http://crl.microsoft.com/pki/*`<br>`http://www.microsoft.com/pki/*`|Certificate revocation |
| `https://*.core.windows.net/*`<br>`https://*.data.microsoft.com`<br>`http://*.msftncsi.com` | Azure storage accounts and monitoring |
| `http://*.windowsupdate.microsoft.com`<br>`https://*.windowsupdate.microsoft.com`<br>`http://*.update.microsoft.com`<br> `https://*.update.microsoft.com`<br>`http://*.windowsupdate.com`<br>`http://download.microsoft.com`<br>`http://wustat.windows.com`<br>`http://ntservicepack.microsoft.com`| Microsoft Update servers<br>                        |
| `http://*.deploy.akamaitechnologies.com`                         |Akamai CDN |
| `https://*.partners.extranet.microsoft.com/*`                    | Support package                                                  |
| `http://*.data.microsoft.com `                   | Telemetry service in Windows, see the [update for customer experience and diagnostic telemetry](https://support.microsoft.com/en-us/kb/3068708)                                                  |

## Next step

-   [Prepare the portal to deploy your StorSimple Virtual Array](storsimple-ova-deploy1-portal-prep.md)
