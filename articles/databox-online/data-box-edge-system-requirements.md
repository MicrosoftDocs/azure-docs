---
title: Microsoft Azure Data Box Edge system requirements| Microsoft Docs
description: Learn about the software and networking requirements for your Azure Data Box Edge
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: article
ms.date: 11/06/2018
ms.author: alkohli
---
# Azure Data Box Edge system requirements (preview)

This article describes the important system requirements for your Microsoft Azure Data Box Edge solution and for the clients connecting to Azure Data Box Edge. We recommend that you review the information carefully before you deploy your Data Box Edge. You can refer back to this information as necessary during the deployment and subsequent operation.

The system requirements for the Data Box Edge include:

- **Software requirements for hosts** - describes the supported platforms, browsers for the local configuration UI, SMB clients, and any additional requirements for the clients that access the device.
- **Networking requirements for the device** - provides information about any networking requirements for the operation of the physical device.

> [!IMPORTANT]
> Data Box Edge is in preview. Please review the [terms of use for the preview](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) before you deploy this solution.

## Supported OS for clients connected to device

[!INCLUDE [Supported OS for clients connected to device](../../includes/data-box-edge-gateway-supported-client-os.md)]

## Supported protocols for clients accessing device

[!INCLUDE [Supported protocols for clients accessing device](../../includes/data-box-edge-gateway-supported-client-protocols.md)]

## Supported storage accounts

[!INCLUDE [Supported storage accounts](../../includes/data-box-edge-gateway-supported-storage-accounts.md)]

## Supported storage types

[!INCLUDE [Supported storage types](../../includes/data-box-edge-gateway-supported-storage-types.md)]

## Supported browsers for local web UI

[!INCLUDE [Supported browsers for local web UI](../../includes/data-box-edge-gateway-supported-browsers.md)]

## Port configuration for Data Box Edge

The following table lists the ports that need to be opened in your firewall to allow for SMB, cloud, or management traffic. In this table, *in* or *inbound* refers to the direction from which incoming client requests access to your device. *Out* or *outbound* refers to the direction in which your Data Box Edge device sends data externally, beyond the deployment, for example, outbound to the internet.

[!INCLUDE [Port configuration for device](../../includes/data-box-edge-gateway-port-config.md)]

## Port configuration for IoT Edge

Azure IoT Edge allows outbound communication from an on-premises Edge device to Azure cloud using supported IoT Hub protocols. Inbound communication is only required for specific scenarios where Azure IoT Hub needs to push down messages to the Azure IoT Edge device (for example, Cloud To Device messaging).

Use the following table for port configuration for the servers hosting Azure IoT Edge runtime:

| Port no. | In or out | Port scope | Required | Guidance |
|----------|-----------|------------|----------|----------|
| TCP 5671 (AMQP)| Out       | WAN        | Yes      | Default communication protocol for IoT Edge. Must be open if Azure IoT Edge is not configured for other supported protocols or AMQP is the desired communication protocol. <br>5672 for AMQP is not supported by IoT Edge. <br>Block this port when Azure IoT Edge uses a different IoT Hub supported protocol. |
| TCP 443 (HTTPS)| Out       | WAN        | Yes      | Outbound open for IoT Edge   provisioning. If you have a transparent gateway with leaf devices that may send method   requests. In this case, port 443 does not need to be open to external networks to connect to IoT Hub or provide IoT Hub services through Azure IoT Edge. Thus the incoming rule could be restricted to only open inbound from the internal network. |
| TCP 5671 (AMQP) | In        |            | No       | Inbound connections should be blocked.|
| TCP 443 (HTTPS) | In        |            | In some cases, see comments | Inbound connections should be opened only for specific scenarios. If non-HTTP protocols such as AMQP, MQTT cannot be configured, the messages can be sent over WebSockets using port 443. |

For complete information, go to [Firewall and port configuration rules for IoT Edge deployment](https://docs.microsoft.com/azure/iot-edge/troubleshoot).

## URL patterns for firewall rules

Network administrators can often configure advanced firewall rules based on the URL patterns to filter the inbound and the outbound traffic. Your Data Box Edge device and the service depend on other Microsoft applications such as Azure Service Bus, Azure Active Directory Access Control, storage accounts, and Microsoft Update servers. The URL patterns associated with these applications can be used to configure firewall rules. It is important to understand that the URL patterns associated with these applications can change. These changes require the network administrator to monitor and update firewall rules for your Data Box Edge as and when needed.

We recommend that you set your firewall rules for outbound traffic, based on Data Box Edge fixed IP addresses, liberally in most cases. However, you can use the information below to set advanced firewall rules that are needed to create secure environments.

> [!NOTE]
> - The device (source) IPs should always be set to all the cloud-enabled network interfaces.
> - The destination IPs should be set to [Azure datacenter IP ranges](https://www.microsoft.com/download/confirmation.aspx?id=41653).

|     URL pattern                                                                                                                                                                                                                                                                                                                                                                                                                                       |     Component or functionality                                                                             |
|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|
|    https://*.databoxedge.azure.com/*<br>https://*.servicebus.windows.net/*<br>https://login.windows.net                                                                                                                                                                                                                                                                                                        |    Azure Data Box Edge service<br>Azure Service Bus<br>Authentication Service    |
|    http://*.backup.windowsazure.com                                                                                                                                                                                                                                                                                                                                                                                                                   |    Device activation                                                                                    |
|    http://crl.microsoft.com/pki/*   http://www.microsoft.com/pki/*                                                                                                                                                                                                                                                                                                                                                                                    |    Certificate revocation                                                                               |
|    https://*.core.windows.net/*   https://*.data.microsoft.com   http://*.msftncsi.com                                                                                                                                                                                                                                                                                                                                                                |    Azure storage accounts and monitoring                                                                |
|    http://windowsupdate.microsoft.com<br>http://*.windowsupdate.microsoft.com<br>https://*.windowsupdate.microsoft.com<br>http://*.update.microsoft.com<br>https://*.update.microsoft.com<br>http://*.windowsupdate.com<br>http://download.microsoft.com<br>http://*.download.windowsupdate.com<br>http://wustat.windows.com<br>http://ntservicepack.microsoft.com<br>http://*.ws.microsoft.com<br>https://*.ws.microsoft.com<br>http://*.mp.microsoft.com        |    Microsoft Update servers                                                                             |
|    http://*.deploy.akamaitechnologies.com                                                                                                                                                                                                                                                                                                                                                                                                             |    Akamai CDN                                                                                           |
|    https://*.partners.extranet.microsoft.com/*                                                                                                                                                                                                                                                                                                                                                                                                        |    Support package                                                                                      |
|    http://*.data.microsoft.com                                                                                                                                                                                                                                                                                                                                                                                                                        |    Telemetry service in Windows, see the update   for customer experience and diagnostic telemetry      |
|                                                                                                                                                                                                                                                                                                                                                                                                                                                       |                                                                                                         |

## Internet bandwidth

[!INCLUDE [Internet bandwidth](../../includes/data-box-edge-gateway-internet-bandwidth.md)]

## Next step

* [Deploy your Azure Data Box Edge](data-box-Edge-deploy-prep.md)
