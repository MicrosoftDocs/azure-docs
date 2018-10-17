---
title: Microsoft Azure Data Box Gateway system requirements| Microsoft Docs
description: Learn about the software and networking requirements for your Azure Data Box Gateway
services: databox
author: alkohli

ms.service: databox
ms.subservice: gateway
ms.topic: article
ms.date: 09/24/2018
ms.author: alkohli
---
# Azure Data Box Gateway system requirements (Preview)

This article describes the important system requirements for your Microsoft Azure Data Box Gateway solution and for the clients connecting to Azure Data Box Gateway. We recommend that you review the information carefully before you deploy your Data Box Gateway, and then refer back to it as necessary during the deployment and subsequent operation.

The system requirements for the Data Box Gateway virtual device include:

- **Software requirements for hosts** - describes the supported platforms, browsers for the local configuration UI, SMB clients, and any additional requirements for the hosts that connect to the device.
- **Networking requirements for the device** - provides information about any networking requirements for the operation of the virtual device.

> [!IMPORTANT]
> Data Box Gateway is in Preview. Please review the [terms of use for the preview](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) before you deploy this solution. 

## Supported OS for clients connected to device

Here is a list of the supported operating systems for clients or hosts connected to the Data Box Gateway.

| **Operating system/platform** | **Versions** |
| --- | --- |
| Windows Server |2012 R2 <br> 2016 |
| Windows |8, 10 |
| SUSE Linux |Enterprise Server 12 (x86_64)|
| Ubuntu |16.04.3 LTS|
| CentOS | 7.0 |

## Supported protocols for clients accessing device

|**Protocol** |**Versions**   |**Notes**  |
|---------|---------|---------|
|SMB    | 2.X, 3.X      | SMB 1 is not supported.|
|NFS     | V3 and V4        |         |

## Supported virtualization platforms for device

| **Operating system/platform**  |**Versions**   |**Notes**  |
|---------|---------|---------|
|Hyper-V  |  2012 R2 <br> 2016  |         |
|VMware ESXi     | 6.0 <br> 6.5        |VMware tools are not supported.         |


## Supported storage accounts

Here is a list of the supported storage types for the Data Box Gateway.

| **Storage account** | **Notes** |
| --- | --- |
| Classic | Standard |
| General Purpose  |Standard; both V1 and V2 are supported. Both hot and cool tiers are supported. |


## Supported storage types

Here is a list of the supported storage types for the Data Box Gateway.

| **File format** | **Notes** |
| --- | --- |
| Azure block blob | |
| Azure page blob  | |
| Azure Files | |

## Supported browsers for local web UI

Here is a list of the browsers supported for the local web UI for the virtual device.

|Browser  |Versions  |Additional requirements/notes  |
|---------|---------|---------|
|Google Chrome   |Latest version         |         |
|Microsoft Edge    | Latest version        |         |
|Internet Explorer     | Latest version        |         |
|FireFox    |Latest version         |         |


## Networking requirements

The following table lists the ports that need to be opened in your firewall to allow for SMB, cloud, or management traffic. In this table, *in* or *inbound* refers to the direction from which incoming client requests access to your device. *Out* or *outbound* refers to the direction in which your Data Box Gateway device sends data externally, beyond the deployment: for example, outbound to the Internet.

| Port no.|	In or out |	Port scope|	Required|	Notes                                                             |                                                                                     |
|--------|---------|----------|--------------|----------------------|---------------|
| TCP 80 (HTTP)|Out|WAN	|No|Outbound port is used for Internet access to retrieve updates. <br>The outbound web proxy is user configurable. |                          
| TCP 443 (HTTPS)|Out|WAN|Yes|Outbound port is used for accessing data in the cloud.<br>The outbound web proxy is user configurable.|   
| UDP 53 (DNS)|Out|WAN|In some cases<br>See notes|This port is required only if you are using an Internet-based DNS server.<br>We recommend using local DNS server. |
| UDP 123 (NTP)|Out|WAN|In some cases<br>See notes|This port is required only if you are using an Internet-based NTP server.  |
| UDP 67 (DHCP)|Out|WAN|In some cases<br>See notes|This port is required only if you are using a DHCP server.  |
| TCP 80 (HTTP)|In|LAN|Yes|This is the inbound port for local UI on the device for local management. <br>Accessing the local UI over HTTP will automatically redirect to HTTPS.  | 
| TCP 443 (HTTPS)|In|LAN|Yes|This is the inbound port for local UI on the device for local management. | 

## URL patterns for firewall rules

Network administrators can often configure advanced firewall rules based on the URL patterns to filter the inbound and the outbound traffic. Your Data Box Gateway device and the Data Box Gateway service depend on other Microsoft applications such as Azure Service Bus, Azure Active Directory Access Control, storage accounts, and Microsoft Update servers. The URL patterns associated with these applications can be used to configure firewall rules. It is important to understand that the URL patterns associated with these applications can change. This in turn will require the network administrator to monitor and update firewall rules for your Data Box Gateway as and when needed.

We recommend that you set your firewall rules for outbound traffic, based on Data Box Gateway fixed IP addresses, liberally in most cases. However, you can use the information below to set advanced firewall rules that are needed to create secure environments.

> [!NOTE]
> - The device (source) IPs should always be set to all the cloud-enabled network interfaces.
> - The destination IPs should be set to [Azure datacenter IP ranges](https://www.microsoft.com/download/confirmation.aspx?id=41653).

|     URL pattern                                                                                                                                                                                                                                                                                                                                                                                                                                       |     Component/Functionality                                                                             |
|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|
|    https://*.databoxedge.azure.com/*<br>https://*.accesscontrol.windows.net/*<br>https://*.servicebus.windows.net/*<br>https://login.windows.net                                                                                                                                                                                                                                                                                                        |    Azure Data Box Gateway service<br>Access Control Service<br>Azure Service Bus<br>Authentication Service    |
|    http://*.backup.windowsazure.com                                                                                                                                                                                                                                                                                                                                                                                                                   |    Device activation                                                                                    |
|    http://crl.microsoft.com/pki/*   http://www.microsoft.com/pki/*                                                                                                                                                                                                                                                                                                                                                                                    |    Certificate revocation                                                                               |
|    https://*.core.windows.net/*   https://*.data.microsoft.com   http://*.msftncsi.com                                                                                                                                                                                                                                                                                                                                                                |    Azure storage accounts and monitoring                                                                |
|    http://windowsupdate.microsoft.com<br>http://*.windowsupdate.microsoft.com<br>https://*.windowsupdate.microsoft.com<br>http://*.update.microsoft.com<br>https://*.update.microsoft.com<br>http://*.windowsupdate.com<br>http://download.microsoft.com<br>http://*.download.windowsupdate.com<br>http://wustat.windows.com<br>http://ntservicepack.microsoft.com<br>http://*.ws.microsoft.com<br>https://*.ws.microsoft.com<br>http://*.mp.microsoft.com        |    Microsoft Update servers                                                                             |
|    http://*.deploy.akamaitechnologies.com                                                                                                                                                                                                                                                                                                                                                                                                             |    Akamai CDN                                                                                           |
|    https://*.partners.extranet.microsoft.com/*                                                                                                                                                                                                                                                                                                                                                                                                        |    Support package                                                                                      |
|    http://*.data.microsoft.com                                                                                                                                                                                                                                                                                                                                                                                                                        |    Telemetry service in Windows, see the update   for customer experience and diagnostic telemetry      |
|                                                                                                                                                                                                                                                                                                                                                                                                                                                       |                                                                                                         |



## Internet bandwidth

The following requirements apply to minimum Internet bandwidth available for your Data Box Gateway devices.

- Your Data Box Gateway has a dedicated 20 Mbps Internet bandwidth (or more) available at all times. This bandwidth should not be shared with any other applications. 
- Your Data Box Gateway has a dedicated 32 Mbps Internet bandwidth (or more) when using network throttling.

## Next step

* [Deploy your Azure Data Box Gateway](data-box-gateway-deploy-prep.md)

