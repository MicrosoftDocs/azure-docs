---
title: Disconnected scenario for Azure Stack Edge
description: Describes scenarios, preparation, available features on Azure Stack Edge device disconnected from internet.
services: databox
author: v-dalc

ms.service: databox
ms.subservice: edge
ms.topic: conceptual
ms.date: 02/07/2022
ms.author: alkohli
---

# Disconnected scenario for Azure Stack Edge Pro R and Azure Stack Edge Pro Mini R

This article helps you identify areas of consideration when you need to use Azure Stack Edge Pro GPU disconnected from the Internet.

Some environments require that your Azure Stack Edge device not be connected to the Internet. As a result, Azure Stack Edge becomes a standalone deployment that is disconnected from and does not communicate with Azure and other Azure services. In a disconnected scenario, certain functionality of the device is limited or unusable.

*Is this a shared scenario for Pro GPU, Pro R, Mini R?*

## Scenarios for disconnected use

Choose this option if:  

- Security or other restrictions require that you deploy your Azure Stack Edge device in an environment with no Internet connection.

- You want to block data, including usage data, from being sent to Azure.

- You want to deploy your device at the edge in your corporate intranet.

## Prepare for disconnected use

Before you disconnect your Azure Stack Edge device from the network that allows internet access, make these preparations:

- [Activate your device](azure-stack-edge-gpu-deploy-activate.md). <!--Verify SKUs. Then two linke: Pro R (azure-stack-edge-pro-r-deploy-activate.md) and Mini R (azure-stack-edge-mini-r-deploy-activate).-->

- For an IOT Edge and Kubernetes deployment, complete these tasks:
  - Deploy Kubernetes on your device.
  - Enable the Kubernetes components.
  - Deploy compute modules and containers on the device.
  - Make sure the modules and components are running.

## Key differences for disconnected use

When an Azure Stack Edge deployment is disconnected, it can't reach Azure endpoints. This affects the features that are available.

The following table describes the behavior of features and components when the device is disconnected.

| Azure Stack Edge feature/component | Impact/behavior when disconnected |
|------------------------------------|-----------------------------------|
| Local UI and Windows PowerShell interface | Local access via the local web UI or the WIndows PowerShell interface is available by connecting a client computer directly to the device. |
| Kubernetes | Kubernetes deployments on a disconnected device have these differences:<ul><li>You can use local `kubectl` access to manage deployments via the native `kubeconfig` app.</li><li>Azure Stack Edge has a local container registry to host images. You'll manage the deployment of these images from your local network. For more information, see [Enable an Edge container registry on Azure Stack Edge Pro GPU device](azure-stack-edge-gpu-edge-container-registry.md). Direct access to Azure Container Registry (in the cloud) isn't available. You're responsible for pushing to and deleting images from your local container registry.</li><li>You can't monitor the Kubernetes cluster using Azure Monitor. Instead, use the local Kubernetes dashboard, available on the compute network. For more information, see [Monitor your Azure Stack Edge Pro device via the Kubernetes dashboard](azure-stack-edge-gpu-monitor-kubernetes-dashboard.md).</li></ul> |
| Azure Arc for Kubernetes | An Azure Arc-enabled Kubernetes deployment can't be used in an offline Azure Stack Edge deployment.<!--Is "offline deployment" = "disconnected deployment"? Do we need to introduce "offline deployment?"--> |
| IoT Edge | IoT Edge modules deployed on the device continue to run when the device is disconnected, but you can't update the IoT Edge deployment manifest (for example, images and configuration options). You can make these updates when the device can communicate with Azure again. |
| Azure Arc-enabled data services | Azure Arc-enabled data services will run offline after the images are deployed on the device. New images won't be able to pull from Azure until connectivity is resumed. |
| Azure Storage tiers | <ul><li>Data in your Azure Storage account won't be uploaded to and from the access tiers in the Azure cloud in disconnected mode.</li><li>You can't access any ghosted data directly through the device. The access attempt will fail with an error. *What is "ghosted" data?)*</li><li>You can't use the Refresh feature to sync data in your Azure Storage account with shares in the Azure cloud.<!--"to sync data in your Azure Storage account with cloud shares"?--> Data syncs resume when connectivity is established.</li></ul> |
| VM cloud management | <ul><li>While the device is disconnected, virtual machine (VM) images can't be downloaded to the device from the cloud.</li><li>A virtual machine can be managed locally via local Azure Resource Manager (ARM).>/li></ul> |
| VM Image Ingestion Job<!--Ask about this.--> | This service doesn't function while the device is disconnected from Azure. To create a VM on the device, the operating system image must be in the local blob store on the device. You can manually upload a VM image locally to the device. When an image is available in local blob storage, you can create a VM from that image using the local ARM APIs. |
| Local ARM | Local Azure Resource Manager (ARM) requires connectivity during initial registration and configuration - for example, to set the ARM Edge user password and ARM subscription ID. <br> Once the component is registered, and the password is set, Local ARM can function without connectivity to Azure.|
| 5G | You must register, deploy, and manage Virtual Network Functions (VNF) while your device is connected. <br> Metrics collection (every 1-5 minute) and VNF heartbeat monitoring to Azure private Multi-access Edge Compute (MEC) (every 10 minutes) also require a connection to Azure. |
| VPN | A configured virtual private network (VPN) remains intact even when there's no connection to Azure. When connectivity to Azure is established, data-in-motion transfers over the VPN.<!--Terms: Why is data-in-motion hyphenated?--> |
| Updates | Customers can apply updates by downloading update packages manually and then applying them via the device's local web UI. |
| Contacting Support | <ul><li>You can't automatically generate a support request and send logs to Microsoft Support via the Azure portal. Instead, [collect a support package](azure-stack-edge-gpu-troubleshoot.md#collect-support-package) via the device's local web UI. Microsoft Support will send you a SAS <!--Spell out.-->URI to upload the support packages to.</li<li>Microsoft can't perform remote diagnostics and repairs while the device is disconnected. Running the commands on the device requires direct communication with Azure.</li></ul> |
| Billing | Billing for the order or management resource continues whether or not your Azure Stack Edge device is connected to the internet. |
 
## Next steps

- XXX
- 
- XXX
