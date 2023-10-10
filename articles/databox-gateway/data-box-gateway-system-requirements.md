---
title: Microsoft Azure Data Box Gateway system requirements| Microsoft Docs
description: Learn about the software and networking requirements for your Azure Data Box Gateway
services: databox
author: stevenmatthew

ms.service: databox
ms.subservice: gateway
ms.topic: article
ms.date: 03/24/2022
ms.author: shaas
---
# Azure Data Box Gateway system requirements

This article describes the important system requirements for your Microsoft Azure Data Box Gateway solution and for the clients connecting to Azure Data Box Gateway. We recommend that you review the information carefully before you deploy your Data Box Gateway, and then refer back to it as necessary during the deployment and subsequent operation. 

The system requirements for the Data Box Gateway virtual device include:

- **Software requirements for hosts** - describes the supported platforms, browsers for the local configuration UI, SMB clients, and any additional requirements for the hosts that connect to the device.
- **Networking requirements for the device** - provides information about any networking requirements for the operation of the virtual device.


## Specifications for the virtual device

The underlying host system for the Data Box Gateway is able to dedicate the following resources to provision your virtual device:

| Specifications                                          | Description              |
|---------------------------------------------------------|--------------------------|
| Virtual processors (cores)   | Minimum 4 |
| Memory  | Minimum 8 GB. We strongly recommend at least 16 GB. |
| Availability|Single node|
| Disks| OS disk: 250 GB <br> Data disk: 2 TB minimum, thin provisioned, and must be backed by SSDs|
| Network interfaces|1 or more virtual network interface|


## Supported OS for clients connected to device

[!INCLUDE [Supported OS for clients connected to device](../../includes/data-box-edge-gateway-supported-client-os.md)]

## Supported protocols for clients accessing device

[!INCLUDE [Supported protocols for clients accessing device](../../includes/data-box-edge-gateway-supported-client-protocols.md)]

## Supported virtualization platforms for device

| **Operating system/platform**  |**Versions**   |**Notes**  |
|---------|---------|---------|
|Hyper-V  |  2012 R2 <br> 2016 <br> 2019 |         |
|VMware ESXi     | 6.0 <br> 6.5 <br> 6.7       |VMware tools are not supported.         |


## Supported storage accounts

[!INCLUDE [Supported storage accounts](../../includes/data-box-edge-gateway-supported-storage-accounts.md)]


## Supported storage types

[!INCLUDE [Supported storage types](../../includes/data-box-edge-gateway-supported-storage-types.md)]

## Supported browsers for local web UI

[!INCLUDE [Supported browsers for local web UI](../../includes/data-box-edge-gateway-supported-browsers.md)]

## Networking port requirements

The following table lists the ports that need to be opened in your firewall to allow for SMB, cloud, or management traffic. In this table, *in* or *inbound* refers to the direction from which incoming client requests access to your device. *Out* or *outbound* refers to the direction in which your Data Box Gateway device sends data externally, beyond the deployment: for example, outbound to the Internet.

[!INCLUDE [Port configuration for device](../../includes/data-box-edge-gateway-port-config.md)]

## URL patterns for firewall rules

Network administrators can often configure advanced firewall rules based on the URL patterns to filter the inbound and the outbound traffic. Your Data Box Gateway device and the Data Box Gateway service depend on other Microsoft applications such as Azure Service Bus, Microsoft Entra ID Access Control, storage accounts, and Microsoft Update servers. The URL patterns associated with these applications can be used to configure firewall rules. It is important to understand that the URL patterns associated with these applications can change. This in turn will require the network administrator to monitor and update firewall rules for your Data Box Gateway as and when needed.

We recommend that you set your firewall rules for outbound traffic, based on Data Box Gateway fixed IP addresses, liberally in most cases. However, you can use the information below to set advanced firewall rules that are needed to create secure environments.

> [!NOTE]
> - The device (source) IPs should always be set to all the cloud-enabled network interfaces.
> - The destination IPs should be set to [Azure datacenter IP ranges](https://www.microsoft.com/download/confirmation.aspx?id=41653).

[!INCLUDE [URL patterns for firewall](../../includes/data-box-edge-gateway-url-patterns-firewall.md)]

### URL patterns for Azure Government

[!INCLUDE [Azure Government URL patterns for firewall](../../includes/data-box-edge-gateway-gov-url-patterns-firewall.md)]

## Internet bandwidth

[!INCLUDE [Internet bandwidth](../../includes/data-box-edge-gateway-internet-bandwidth.md)]

## Next step

* [Deploy your Azure Data Box Gateway](data-box-gateway-deploy-prep.md)
