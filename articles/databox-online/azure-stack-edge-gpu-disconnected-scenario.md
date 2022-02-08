---
title: Disconnected scenario for Azure Stack Edge
description: Describes scenarios, preparation, available features on Azure Stack Edge device disconnected from internet.
services: databox
author: v-dalc

ms.service: databox
ms.subservice: edge
ms.topic: conceptual
ms.date: 02/08/2022
ms.author: alkohli
---

# Disconnected scenario for Azure Stack Edge Pro R and Azure Stack Edge Mini R

[!INCLUDE [applies-to-azure-stack-edge-pro-r-mini-r-sku](../../includes/azure-stack-edge-applies-to-pro-r-mini-r-sku.md)]
<!--Veriify SKUs.-->

This article helps you identify areas of consideration when you need to use Azure Stack Edge Pro GPU disconnected from the internet.

Some environments require that your Azure Stack Edge device not be connected to the internet. As a result, Azure Stack Edge becomes a standalone deployment that is disconnected from and does not communicate with Azure and other Azure services. In a disconnected scenario, certain functionality of the device is limited or unusable.

## Scenarios for disconnected use

Choose this option if:  

- Security or other restrictions require that you deploy your Azure Stack Edge device in an environment with no internet connection.

- You want to block data, including usage data, from being sent to Azure.

- You want to deploy your device at the edge in your corporate intranet.

## Prepare for disconnected use

Before you disconnect your Azure Stack Edge device from the network that allows internet access, make these preparations:

- [Activate your device](azure-stack-edge-gpu-deploy-activate.md). <!--Verify SKUs. Then two links: Pro R (azure-stack-edge-pro-r-deploy-activate.md) and Mini R (azure-stack-edge-mini-r-deploy-activate).-->

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
| Kubernetes | Available - Kubernetes deployments on a disconnected device have these differences:<ul><li>You can use local `kubectl` access to manage deployments via the native `kubeconfig` app.</li><li>Azure Stack Edge has a local container registry to host images. While your device is disconnected, you'll manage the deployment of these images from your local network. For more information, see [Enable an Edge container registry on Azure Stack Edge Pro GPU device](azure-stack-edge-gpu-edge-container-registry.md). You won't have direct access to the Azure Container Registry (in the cloud). You're responsible for pushing images to and deleting images from your local container registry.</li><li>You can't monitor the Kubernetes cluster using Azure Monitor. Instead, use the local Kubernetes dashboard, available on the compute network. For more information, see [Monitor your Azure Stack Edge Pro device via the Kubernetes dashboard](azure-stack-edge-gpu-monitor-kubernetes-dashboard.md).</li></ul> |
| Azure Arc for Kubernetes | Not available - An Azure Arc-enabled Kubernetes deployment can't be used in a disconnected deployment. |
| IoT Edge | Available - IoT Edge modules deployed on the device continue to run when the device is disconnected, but you can't update the IoT Edge deployment manifest (for example, images and configuration options). You can make these updates when the device can communicate with Azure again. |
| Azure Arc-enabled data services | Available - After the images are deployed on the device, Azure Arc-enabled data services continue to run in a disconnected deployment. You'll deploy and manage these images from your local network. This will include pushing to and deleting images from the local XXX. |
| Azure Storage tiers | Not available - <ul><li>Data in your Azure Storage account won't be uploaded to and from the access tiers in the Azure cloud in disconnected mode.</li><li>You can't access any ghosted data directly through the device. The access attempt will fail with an error.<!--Is "ghosted data" archived data?--></li><li>You can't use the Refresh feature to sync data in your Azure Storage account with shares in the Azure cloud. Data syncs resume when connectivity is established.</li></ul> |
| VM cloud management | <ul><li>Not available - While the device is disconnected, virtual machine (VM) images can't be downloaded to the device from the cloud.</li><li>Available - A virtual machine can be managed locally via local Azure Resource Manager (ARM).</li></ul> |
| VM Image Ingestion Job<!--Query out to Charles about this.--> | Not available - This service doesn't function while the device is disconnected from Azure. To create a VM on the device, the operating system image must be in the local blob store on the device. You can manually upload a VM image locally to the device. When an image is available in local blob storage, you can create a VM from that image using the local ARM APIs. |
| Local ARM | Available - Local Azure Resource Manager (ARM) requires connectivity during registration and configuration - for example, to set the ARM Edge user password and ARM subscription ID. <br> Once the component is registered, and the password is set, Local ARM can function without connectivity to Azure.|
| 5G | Available - You must register, deploy, and manage Virtual Network Functions (VNF) while your device is connected. <br> Not available - Metrics collection (every 1-5 minute) and VNF heartbeat monitoring to Azure private Multi-access Edge Compute (MEC) (every 10 minutes) also require a connection to Azure. |
| VPN | Not available - A configured virtual private network (VPN) remains intact even when there's no connection to Azure. When connectivity to Azure is established, data-in-motion transfers over the VPN. |
| Updates | Not available - Automatic updates from Windows Server Update Services (WSUS). You can apply updates by downloading update packages manually and then applying them via the device's local web UI. |
| Contacting Support | <ul><li>Unavailable - You can't automatically generate a support request and send logs to Microsoft Support via the Azure portal. Instead, [collect a support package](azure-stack-edge-gpu-troubleshoot.md#collect-support-package) via the device's local web UI. Microsoft Support will send you a shared access signature (SAS) URI to upload the support packages to.</li><li>Unavailable - Microsoft can't perform remote diagnostics and repairs while the device is disconnected. Running the commands on the device requires direct communication with Azure.</li></ul> |
| Billing | Billing for the order or management resource continues whether or not your Azure Stack Edge device is connected to the internet. |
 
## Next steps

- [Review use cases for Azure Stack Edge Pro R](azure-stack-edge-pro-r-overview.md#use-cases).
- [Review use cases for Azure Stack Edge Mini R](azure-stack-edge-mini-r-overview.md#use-cases).
- [Get pricing](/pricing/details/azure-stack/edge/)
