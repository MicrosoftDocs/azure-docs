---
title: Microsoft Azure Stack Edge system requirements| Microsoft Docs
description: Learn about the software and networking requirements for your Azure Stack Edge
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: article
ms.date: 04/03/2019
ms.author: alkohli
---
# Azure Stack Edge system requirements

This article describes the important system requirements for your Microsoft Azure Stack Edge solution and for the clients connecting to Azure Stack Edge. We recommend that you review the information carefully before you deploy your Azure Stack Edge. You can refer back to this information as necessary during the deployment and subsequent operation.

The system requirements for the Azure Stack Edge include:

- **Software requirements for hosts** - describes the supported platforms, browsers for the local configuration UI, SMB clients, and any additional requirements for the clients that access the device.
- **Networking requirements for the device** - provides information about any networking requirements for the operation of the physical device.

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

## Networking port requirements

### Port requirements for Azure Stack Edge

The following table lists the ports that need to be opened in your firewall to allow for SMB, cloud, or management traffic. In this table, *in* or *inbound* refers to the direction from which incoming client requests access to your device. *Out* or *outbound* refers to the direction in which your Azure Stack Edge device sends data externally, beyond the deployment, for example, outbound to the internet.

[!INCLUDE [Port configuration for device](../../includes/data-box-edge-gateway-port-config.md)]

### Port requirements for IoT Edge

Azure IoT Edge allows outbound communication from an on-premises Edge device to Azure cloud using supported IoT Hub protocols. Inbound communication is only required for specific scenarios where Azure IoT Hub needs to push down messages to the Azure IoT Edge device (for example, Cloud To Device messaging).

Use the following table for port configuration for the servers hosting Azure IoT Edge runtime:

| Port no. | In or out | Port scope | Required | Guidance |
|----------|-----------|------------|----------|----------|
| TCP 443 (HTTPS)| Out       | WAN        | Yes      | Outbound open for IoT Edge   provisioning. This configuration is required when using manual scripts or Azure IoT Device Provisioning Service (DPS).|

For complete information, go to [Firewall and port configuration rules for IoT Edge deployment](https://docs.microsoft.com/azure/iot-edge/troubleshoot).

## URL patterns for firewall rules

Network administrators can often configure advanced firewall rules based on the URL patterns to filter the inbound and the outbound traffic. Your Azure Stack Edge device and the service depend on other Microsoft applications such as Azure Service Bus, Azure Active Directory Access Control, storage accounts, and Microsoft Update servers. The URL patterns associated with these applications can be used to configure firewall rules. It is important to understand that the URL patterns associated with these applications can change. These changes require the network administrator to monitor and update firewall rules for your Azure Stack Edge as and when needed.

We recommend that you set your firewall rules for outbound traffic, based on Azure Stack Edge fixed IP addresses, liberally in most cases. However, you can use the information below to set advanced firewall rules that are needed to create secure environments.

> [!NOTE]
> - The device (source) IPs should always be set to all the cloud-enabled network interfaces.
> - The destination IPs should be set to [Azure datacenter IP ranges](https://www.microsoft.com/download/confirmation.aspx?id=41653).

### URL patterns for gateway feature

[!INCLUDE [URL patterns for firewall](../../includes/data-box-edge-gateway-url-patterns-firewall.md)]

### URL patterns for compute feature

| URL pattern                      | Component or functionality                     |   
|----------------------------------|---------------------------------------------|
| https:\//mcr.microsoft.com<br></br>https://\*.cdn.mscr.io | Microsoft container registry (required)               |
| https://\*.azurecr.io                     | Personal and third-party container registries (optional) | 
| https://\*.azure-devices.net              | IoT Hub access (required)                             | 

### URL patterns for gateway for Azure Government

[!INCLUDE [Azure Government URL patterns for firewall](../../includes/data-box-edge-gateway-gov-url-patterns-firewall.md)]

### URL patterns for compute for Azure Government

| URL pattern                      | Component or functionality                     |  
|----------------------------------|---------------------------------------------|
| https:\//mcr.microsoft.com<br></br>https://\*.cdn.mscr.com | Microsoft container registry (required)               |
| https://\*.azure-devices.us              | IoT Hub access (required)           |
| https://\*.azurecr.us                    | Personal and third-party container registries (optional) | 

## Internet bandwidth

[!INCLUDE [Internet bandwidth](../../includes/data-box-edge-gateway-internet-bandwidth.md)]

## Compute sizing considerations

Use your experience while developing and testing your solution to ensure there is enough capacity on your Azure Stack Edge device and you get the optimal performance from your device.

Factors you should consider include:

- **Container specifics** - Think about the following.

    - How many containers are in your workload? You could have a lot of lightweight containers versus a few resource-intensive ones.
    - What are the resources allocated to these containers versus what are the resources they are consuming?
    - How many layers do your containers share?
    - Are there unused containers? A stopped container still takes up disk space.
    - In which language are your containers written?
- **Size of the data processed** - How much data will your containers be processing? Will this data consume disk space or the data will be processed in the memory?
- **Expected performance** - What are the desired performance characteristics of your solution? 

To understand and refine the performance of your solution, you could use:

- The compute metrics available in the Azure portal. Go to your Azure Stack Edge resource and then go to **Monitoring > Metrics**. Look at the **Edge compute - Memory usage** and **Edge compute - Percentage CPU** to understand the available resources and how are the resources getting consumed.
- The monitoring commands available via the PowerShell interface of the device such as:

    - `dkr` stats to get a live stream of container(s) resource usage statistics. The command supports CPU, memory usage, memory limit, and network IO metrics.
    - `dkr system df` to get information regarding the amount of disk space used. 
    - `dkr image [prune]` to clean up unused images and free up space.
    - `dkr ps --size` to view the approximate size of a running container. 

    For more information on the available commands, go to [Monitor and troubleshoot compute modules](azure-stack-edge-connect-powershell-interface.md#monitor-and-troubleshoot-compute-modules).

Finally, make sure that you validate your solution on your dataset and quantify the performance on Azure Stack Edge before deploying in production.


## Next step

- [Deploy your Azure Stack Edge](azure-stack-edge-deploy-prep.md)
