---
title: Disconnected scenario for Azure Stack Edge
description: Describes scenarios, preparation, available features on Azure Stack Edge device disconnected from internet.
services: databox
author: v-dalc

ms.service: databox
ms.subservice: edge
ms.topic: conceptual
ms.date: 02/10/2022
ms.author: alkohli
---

# Disconnected scenario for Azure Stack Edge

[!INCLUDE [azure-stack-edge-applies-to-gpu-pro-r-mini-r-fpga-sku](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-fpga-sku.md)]

This article helps you identify areas of consideration when you need to use Azure Stack Edge disconnected from the internet.

Some environments require that your Azure Stack Edge device not be connected to the internet. As a result, Azure Stack Edge becomes a standalone deployment that is disconnected from and does not communicate with Azure and other Azure services. In a disconnected scenario, certain functionality of the device is limited or unusable.

## Scenarios for disconnected use

Choose this option if:  

- Security or other restrictions require that you deploy your Azure Stack Edge device in an environment with no internet connection.

- You want to block data, including usage data, from being sent to Azure.

- You want to deploy your device at the edge in your corporate intranet.

## Prepare for disconnected use

Before you disconnect your Azure Stack Edge device from the network that allows internet access, make these preparations:

- Activate your device. For instructions, see [Activate Azure Stack Edge Pro GPU](azure-stack-edge-gpu-deploy-activate.md), [Activate Azure Stack Edge Pro R](azure-stack-edge-pro-r-deploy-activate.md), [Activate Azure Stack Edge Mini R](azure-stack-edge-mini-r-deploy-activate.md), or [Activate Azure Stack Edge FPGA](azure-stack-edge-deploy-connect-setup-activate.md).

- For an IoT Edge and Kubernetes deployment, complete these tasks before you disconnect:
  1. Deploy Kubernetes on your device.
  1. Enable the Kubernetes components.
  1. Deploy compute modules and containers on the device.
  1. Make sure the modules and components are running.

## Key differences for disconnected use

When an Azure Stack Edge deployment is disconnected, it can't reach Azure endpoints. This affects the features that are available.

The following table describes the behavior of features and components when the device is disconnected.

| Azure Stack Edge feature/component | Impact/behavior when disconnected |
|------------------------------------|-----------------------------------|
| Local UI and Windows PowerShell interface | Available - Local access via the local web UI or the WIndows PowerShell interface is available by connecting a client computer directly to the device. |
| Kubernetes | Available - Kubernetes deployments on a disconnected device have these differences:<ul><li>You can use local `kubectl` access to manage deployments via the native `kubeconfig` app.</li><li>Azure Stack Edge has a local container registry to host images. While your device is disconnected, you'll manage the deployment of these images from your local network. For more information, see [Enable an Edge container registry on Azure Stack Edge Pro GPU device](azure-stack-edge-gpu-edge-container-registry.md). You won't have direct access to the Azure Container Registry (in the cloud). You're responsible for pushing images to and deleting images from your local container registry.</li><li>You can't monitor the Kubernetes cluster using Azure Monitor. Instead, use the local Kubernetes dashboard, available on the compute network. For more information, see [Monitor your Azure Stack Edge Pro device via the Kubernetes dashboard](azure-stack-edge-gpu-monitor-kubernetes-dashboard.md).<!--Should Azure Monitor be listed as an unavailable feature, with instructions for monitoring other Azure features?--></li></ul> |
| Azure Arc for Kubernetes | Not available - An Azure Arc-enabled Kubernetes deployment can't be used in a disconnected deployment. |
| IoT Edge | Available - IoT Edge modules deployed on the device continue to run when the device is disconnected, but you can't update the IoT Edge deployment manifest (for example, images and configuration options). You can make these updates when the device can communicate with Azure again. |
| Azure Arc-enabled data services | Available - After the images are deployed on the device, Azure Arc-enabled data services continue to run in a disconnected deployment. You'll deploy and manage these images from your local network. This will include pushing to and deleting images from the local XXX. |
| Azure Storage tiers | Not available - During disconnected use, you can't access Azure Storage tiers:<ul><li>Data in your Azure Storage account won't be uploaded to and from access tiers in the Azure cloud.</li><li>Ghosted data can't be accessed directly through the device.<!--"Archived data?"--> The access attempt will fail with an error.</li><li>The Refresh option can't be used to sync data in your Azure Storage account with shares in the Azure cloud. Data syncs resume when connectivity is established.</li></ul> |
| VM cloud management | <ul><li>Not available - During disconnected use, virtual machine (VM) images can't be downloaded to the device from the cloud.</li><li>Available - A virtual machine can be managed locally via local Azure Resource Manager (ARM).</li></ul> |
| VM Image Ingestion Job<!--Alpa, please advise. Rewrite of this item is needed.--> | Not available - This service doesn't function while the device is disconnected from Azure. To create a VM on the device, the operating system image must be in the local blob store on the device. You can manually upload a VM image locally to the device. When an image is available in local blob storage, you can create a VM from that image using the local ARM APIs. |
| Local ARM | Available - Local Azure Resource Manager (ARM) can function without connectivity to Azure. However, connectivity is required during registration and configuration of Local ARM - for example, to set the ARM Edge user password and ARM subscription ID. |
| 5G | Available - <!--What VNF functions are active during disconnected use? Not discussed.-->You must register, deploy, and manage Virtual Network Functions (VNF) while your device is connected. <br> Not available - Metrics collection (every 1-5 minute) and VNF heartbeat monitoring to Azure private Multi-access Edge Compute (MEC) (every 10 minutes) also require a connection to Azure. |
| VPN | Not available - Although not available during disconnected use, a configured virtual private network (VPN) remains intact when there's no connection to Azure. When connectivity to Azure is established, data-in-motion transfers over the VPN. |
| Updates | Available - Automatic updates from Windows Server Update Services (WSUS) aren't available during disconnected use. To apply updates, download update packages manually and then apply them via the device's local web UI. |
| Contacting Support | Microsoft Support is available, with these differences:<ul><li>Unavailable - You can't automatically generate a support request and send logs to Microsoft Support via the Azure portal. Instead, [collect a support package](azure-stack-edge-gpu-troubleshoot.md#collect-support-package) via the device's local web UI. Microsoft Support will send you a shared access signature (SAS) URI to upload the support packages to.</li><li>Not available - Microsoft can't perform remote diagnostics and repairs while the device is disconnected. Running the commands on the device requires direct communication with Azure.</li></ul> |
| Billing | Billing for your order or management resource continues whether or not your Azure Stack Edge device is connected to the internet. |
 
## Next steps

- Review use cases for [Azure Stack Edge Pro with GPU](azure-stack-edge-gpu-overview.md#use-cases), [Azure Stack Edge Pro R](azure-stack-edge-pro-r-overview.md#use-cases), and [Azure Stack Edge Mini R](azure-stack-edge-mini-r-overview.md#use-cases).
- [Get pricing](/pricing/details/azure-stack/edge/).
