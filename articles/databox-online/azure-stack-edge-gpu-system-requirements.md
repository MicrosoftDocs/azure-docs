---
title: Microsoft Azure Stack Edge system requirements| Microsoft Docs
description: Learn about the system requirements for your Microsoft Azure Stack Edge solution and for the clients connecting to Azure Stack Edge.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: conceptual
ms.date: 06/02/2023
ms.author: alkohli
ms.custom: contperf-fy21q4, devx-track-arm-template
---
# System requirements for Azure Stack Edge Pro with GPU 

This article describes the important system requirements for your Microsoft Azure Stack Edge Pro GPU solution and for the clients connecting to Azure Stack Edge Pro. We recommend that you review the information carefully before you deploy your Azure Stack Edge Pro. You can refer back to this information as necessary during the deployment and subsequent operation.

The system requirements for the Azure Stack Edge Pro include:

- **Software requirements for hosts** - describes the supported platforms, browsers for the local configuration UI, SMB clients, and any additional requirements for the clients that access the device.
- **Networking requirements for the device** - provides information about any networking requirements for the operation of the physical device.

## Supported OS for clients connected to device

[!INCLUDE [Supported OS for clients connected to device](../../includes/azure-stack-edge-gateway-supported-client-os.md)]

## Supported protocols for clients accessing device

[!INCLUDE [Supported protocols for clients accessing device](../../includes/azure-stack-edge-gateway-supported-client-protocols.md)]

## Supported Azure Storage accounts

[!INCLUDE [Supported storage accounts](../../includes/azure-stack-edge-gateway-supported-storage-accounts.md)]

## Supported Edge storage accounts

The following Edge storage accounts are supported with REST interface of the device. The Edge storage accounts are created on the device. For more information, see [Edge storage accounts](azure-stack-edge-gpu-manage-storage-accounts.md#about-edge-storage-accounts).

|Type  |Storage account  |Comments  |
|---------|---------|---------|
|Standard     |GPv1: Block Blob         |         |

*Page blobs and Azure Files are currently not supported.

## Supported local Azure Resource Manager storage accounts

These storage accounts are created via the device local APIs when you are connecting to local Azure Resource Manager. The following storage accounts are supported:

|Type  |Storage account  |Comments  |
|---------|---------|---------|
|Standard     |GPv1: Block Blob, Page Blob        | SKU type is Standard_LRS       |
|Premium     |GPv1: Block Blob, Page Blob        | SKU type is Premium_LRS        |


## Supported storage types

[!INCLUDE [Supported storage types](../../includes/azure-stack-edge-gateway-supported-storage-types.md)]


## Supported browsers for local web UI

[!INCLUDE [Supported browsers for local web UI](../../includes/azure-stack-edge-gateway-supported-browsers.md)]

## Networking port requirements

### Port requirements for Azure Stack Edge Pro

The following table lists the ports that need to be opened in your firewall to allow for SMB, cloud, or management traffic. In this table, *in* or *inbound* refers to the direction from which incoming client requests access to your device. *Out* or *outbound* refers to the direction in which your Azure Stack Edge Pro device sends data externally, beyond the deployment, for example, outbound to the internet.

[!INCLUDE [Port configuration for device](../../includes/azure-stack-edge-gateway-port-config.md)]

### Port requirements for IoT Edge

Azure IoT Edge allows outbound communication from an on-premises Edge device to Azure cloud using supported IoT Hub protocols. Inbound communication is only required for specific scenarios where Azure IoT Hub needs to push down messages to the Azure IoT Edge device (for example, Cloud To Device messaging).

Use the following table for port configuration for the servers hosting Azure IoT Edge runtime:

| Port no. | In or out | Port scope | Required | Guidance |
|----------|-----------|------------|----------|----------|
| TCP 443 (HTTPS)| Out       | WAN        | Yes      | Outbound open for IoT Edge   provisioning. This configuration is required when using manual scripts or Azure IoT Device Provisioning Service (DPS).|

For complete information, go to [Firewall and port configuration rules for IoT Edge deployment](../iot-edge/troubleshoot.md).


### Port requirements for Kubernetes on Azure Stack Edge

| Port no. | In or out | Port scope | Required | Guidance |
|----------|-----------|------------|----------|----------|
| TCP 31000 (HTTPS)| In       | LAN        | In some cases. <br> See notes.      |This port is required only if you are connecting to the Kubernetes dashboard to monitor your device. |
| TCP 6443 (HTTPS)| In       | LAN        | In some cases. <br> See notes.       |This port is required by Kubernetes API server only if you are using `kubectl` to access your device. |

> [!IMPORTANT]
> If your datacenter firewall is restricting or filtering traffic based on source IPs or MAC addresses, make sure that the compute IPs (Kubernetes node IPs) and MAC addresses are in the allowed list. The MAC addresses can be specified by running the `Set-HcsMacAddressPool` cmdlet on the PowerShell interface of the device.

## URL patterns for firewall rules

Network administrators can often configure advanced firewall rules based on the URL patterns to filter the inbound and the outbound traffic. Your Azure Stack Edge Pro device and the service depend on other Microsoft applications such as Azure Service Bus, Microsoft Entra ID Access Control, storage accounts, and Microsoft Update servers. The URL patterns associated with these applications can be used to configure firewall rules. It is important to understand that the URL patterns associated with these applications can change. These changes require the network administrator to monitor and update firewall rules for your Azure Stack Edge Pro as and when needed.

We recommend that you set your firewall rules for outbound traffic, based on Azure Stack Edge Pro fixed IP addresses, liberally in most cases. However, you can use the information below to set advanced firewall rules that are needed to create secure environments.

> [!NOTE]
> - The device (source) IPs should always be set to all the cloud-enabled network interfaces.
> - The destination IPs should be set to [Azure datacenter IP ranges](https://www.microsoft.com/download/confirmation.aspx?id=41653).

### URL patterns for gateway feature

[!INCLUDE [URL patterns for firewall](../../includes/azure-stack-edge-gateway-url-patterns-firewall.md)]

### URL patterns for compute feature

| URL pattern                      | Component or functionality                     |   
|----------------------------------|---------------------------------------------|
| https:\//mcr.microsoft.com<br></br>https://\*.cdn.mscr.io | Microsoft container registry (required)               |
| https://\*.azurecr.io                     | Personal and third-party container registries (optional) | 
| https://\*.azure-devices.net              | IoT Hub access (required)                             | 
| https://\*.docker.com              | StorageClass (required)                             | 

### URL patterns for monitoring

Add the following URL patterns for Azure Monitor if you're using the containerized version of the Log Analytics agent for Linux.

| URL pattern | Port | Component or functionality |
|-------------|-------------|----------------------------|
| https://\*ods.opinsights.azure.com | 443 | Data ingestion |
| https://\*.oms.opinsights.azure.com | 443 | Operations Management Suite (OMS) onboarding |
| https://\*.dc.services.visualstudio.com | 443 | Agent telemetry that uses Azure Public Cloud Application Insights |

For more information, see [Network firewall requirements for monitoring container insights](../azure-monitor/containers/container-insights-onboard.md#network-firewall-requirements).

### URL patterns for gateway for Azure Government

[!INCLUDE [Azure Government URL patterns for firewall](../../includes/azure-stack-edge-gateway-gov-url-patterns-firewall.md)]

### URL patterns for compute for Azure Government

| URL pattern                      | Component or functionality                     |  
|----------------------------------|---------------------------------------------|
| https:\//mcr.microsoft.com<br></br>https://\*.cdn.mscr.com | Microsoft container registry (required)               |
| https://\*.azure-devices.us              | IoT Hub access (required)           |
| https://\*.azurecr.us                    | Personal and third-party container registries (optional) | 

### URL patterns for monitoring for Azure Government

Add the following URL patterns for Azure Monitor if you're using the containerized version of the Log Analytics agent for Linux.

| URL pattern | Port | Component or functionality |
|-------------|-------------|----------------------------|
| https://\*ods.opinsights.azure.us | 443 | Data ingestion |
| https://\*.oms.opinsights.azure.us | 443 | Operations Management Suite (OMS) onboarding |
| https://\*.dc.services.visualstudio.com | 443 | Agent telemetry that uses Azure Public Cloud Application Insights |


## Internet bandwidth

[!INCLUDE [Internet bandwidth](../../includes/azure-stack-edge-gateway-internet-bandwidth.md)]

## Compute sizing considerations

Use your experience while developing and testing your solution to ensure there is enough capacity on your Azure Stack Edge Pro device and you get the optimal performance from your device.

Factors you should consider include:

- **Container specifics** - Think about the following.

    - What is your container footprint? How much memory, storage, and CPU is your container consuming?
    - How many containers are in your workload? You could have a lot of lightweight containers versus a few resource-intensive ones.
    - What are the resources allocated to these containers versus what are the resources they are consuming (the footprint)?
    - How many layers do your containers share? Container images are a bundle of files organized into a stack of layers. For your container image, determine how many layers and their respective sizes to calculate resource consumption.
    - Are there unused containers? A stopped container still takes up disk space.
    - In which language are your containers written?
- **Size of the data processed** - How much data will your containers be processing? Will this data consume disk space or the data will be processed in the memory?
- **Expected performance** - What are the desired performance characteristics of your solution? 

To understand and refine the performance of your solution, you could use:

- The compute metrics available in the Azure portal. Go to your Azure Stack Edge resource and then go to **Monitoring > Metrics**. Look at the **Edge compute - Memory usage** and **Edge compute - Percentage CPU** to understand the available resources and how are the resources getting consumed.
- To monitor and troubleshoot compute modules, go to [Debug Kubernetes issues](azure-stack-edge-gpu-connect-powershell-interface.md#debug-kubernetes-issues-related-to-iot-edge).

Finally, make sure that you validate your solution on your dataset and quantify the performance on Azure Stack Edge Pro before deploying in production.

## Next step

- [Deploy your Azure Stack Edge Pro](azure-stack-edge-gpu-deploy-prep.md)
