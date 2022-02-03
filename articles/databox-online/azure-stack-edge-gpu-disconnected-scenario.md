---
title: Disconnected scenario for Azure Stack Edge Pro GPU
description: Describes scenarios, prerequisites, and feature availabity on Azure Stack Edge Pro GPU device disconnected from Internet.
services: databox
author: v-dalc

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 02/03/2022
ms.author: alkohli
---

# Disconnected scenario for Azure Stack Edge Pro GPU

This article helps you identify areas of consideration when you need to use Azure Stack Edge Pro GPU disconnected from the Internet.

Some environments require that your Azure Stack Edge device not be connected to the Internet. As a result, Azure Stack Edge becomes a standalone deployment that is disconnected from and does not communicate with Azure and other Azure services. In a disconnected scenario, certain functionality of the device is limited or unusable.

*Is this a shared scenario for Pro GPU, Pro R, Mini R?*

## Scenarios

You might need a disconnected deployment of Azure Stack Edge in the following scenarios:  

- Security or other restrictions require that you deploy your Azure Stack Edge device in an environment with no Internet connection.

- You want to block data, including usage data, from being sent to Azure.

- You want to use Azure Stack Edge purely as a standalone edge solution that's deployed on your corporate intranet.

## Prerequisites

Before you disconnect your Azure Stack Edge device from the network that allows Internet access, you need to complete the following prerequisites:

- Activate your Azure Stack Edge Pro device as described in [Activate Azure Stack Edge Pro](azure-stack-edge-gpu-deploy-activate.md).

- For IOT Edge / Kubernetes, deploy Kubernetes on your device, enable the Kubernetes components, and deploy compute modules and containers on the device. Then make sure the modules and components are running.<!--1) Is the only available method in a standalone deployment to use an IoT Edge module to run a stateless application? If so, we should state this. In "Deployment types" (https://docs.microsoft.com/en-us/azure/databox-online/azure-stack-edge-gpu-kubernetes-workload-management#deployment-types), the kubectl deployment looks appropriate also. 2) The IoT Edge deployment has three cormponents. Include the first and second (Deploy a stateless app; Deploy a GPU shared workload). How about the third: Develop a C# module to contain the app? 3) Can we make this a higher-level requirement? They need to complete the Kubernetes deployment instructions for the method of choice, and make sure things are running smoothly.-->

## Limited or unavailable features

When your Azure Stack Edge deployment is not connected to the Internet, Azure endpoints can't be reached, which affects some Azure Stack Edge features. When you connect the system to the Internet again, you'll be able to communicate with Azure and Azure services again. *Restoring full functionality? Any exceptions?*

The following table describes behavior changes for each Azure Stack Edge feature or component while your Azure Stack Edge device is disconnected from the Internet.

| Azure Stack Edge feature/component | Impact/behavior when disconnected |
|------------------------------------|-----------------------------------|
| Local UI / Minishell | Local access via the local web UI or the device minishell<!--This is a reference to a specific command-line app?--> is available by connecting a client computer directly to the device.<!--Should this say a "physical connection" (via cable) rather than a "direct connection" (a little more nebulous)?--> |
| Kubernetes | Deployments of Kubernetes will be limited:<ul><li>Users can use local `kubectl` access to manage deployments via the native `kubeconfig` app.</li><li>Azure Stack Edge has a local container registry to host images. You will manage the deployment of these images from your local network. For more information, see [Enable an Edge container registry on Azure Stack Edge Pro GPU device](azure-stack-edge-gpu-edge-container-registry.md).</li><li>Direct access to the cloud container registry isn't available. You're responsible for pushing and deleting images to the local container registry.</li><li>You can't monitor the Kubernetes cluster using Azure Monitor. Instead, use the local Kubernetes dashboard, available on the compute network. For more information, see [Monitor your Azure Stack Edge Pro device via Kubernetes dashboard](azure-stack-edge-gpu-monitor-kubernetes-dashboard.md).</li></ul> |
| Azure Arc for Kubernetes | An Azure Arc-enabled Kubernetes deployment can't be used in an offline Azure Stack Edge deployment.<!--Is "offline deployment" = "disconnected deployment"? Do we need to introduce "offline deployment?"--> |
| IoT Edge | IoT Edge modules deployed on the device continue to run, but you can't update the IOT Edge deployment manifest (for example, images and configuration options) while the device is disconnected from the Internet. You can make these updates when the device can communicate with Azure again. |
| Azure Arc for Data Services | Data services can run after the images are deployed on the device.<!--1) Cap style for "Data Services"? 2) "Data services can run for images that were deployed on the device while it was connected to the Internet"?--> New images won't be able to pull from Azure until connectivity is resumed. |
| Azure Storage tiers | Tiering to and from the cloud won't function in disconnected mode.<ul><li>You can't access any ghosted data directly through the device. The access attempt will fail with an error.<!--Is "ghosted data" archived data of simply data residing in access tiers in the cloud?--></li><li>You can't use the Refresh feature to sync data in your Azure Storage account for the cloud shares.<!--"to sync data in your Azure Storage account with cloud shares"?--> Data syncs resume when connectivity is established.</li></ul> |
| VM cloud management | <ul><li>While the device is disconnected, virtual machine (VM) images can't be downloaded to the device from the cloud. You can try again after connectivity is established.</li><li>A virtual machine can be managed locally via local Azure Resource Manager (ARM).>/li></ul> |
| VM Image Ingestion Job | This service doesn't function while the device is disconnected from Azure. To create a VM on the device, the operating system image must be in the local blob store on the device. You can manually upload a VM image locally to the device. When an image is available in local blob storage, you can create a VM from that image using the local ARM APIs.<!--Terminology inconsistency? Is the reference to "OS image" deliberate, or is this just the VM image?--> |
| Local ARM | Local Azure Resource Manager (ARM) requires connectivity during initial registration and configuration - for example, to set the ARM Edge user password and ARM subscription ID. Once the component is registered, and the password is set, Local ARM can function without connectivity to Azure.|
| Contacting Support | <ul><li>You can't automatically generate a support request and send logs to Microsoft Support via the Azure portal. Instead, you [collect a support package](azure-stack-edge-gpu-troubleshoot.md#collect-support-package) via the device's local web UI. Microsoft Support will send you a SAS URI to upload the support packages to.</li<li>Microsoft can't perform remote diagnostics and repairs while the device is disconnected. Running the commands on the device requires direct communication with Azure.</li></ul> |
| 5G | The following components require Azure connectivity:<ul><li>Registration</li><li>Vnf deployment: creating and deleting vnf</li></i>Vnf management</li><li>Metrics collection every 1-5 minutes</li><li>vnf heartbeat to the Azure private MEC<!--Full name is "Azure multi-access edge compute (MEC)"?--> every 10 min</li></ul> |
| Updates | Customers can apply updates by downloading update package manually and then applying the update package via the device local UI. |
| VPN | After you configure VPN, VPN will remain intact even when there is no connection to Azure. When connectivity to Azure is established, data-in-motion will transfer over the VPN. |
| Billing | Irrespective of whether the Azure Stack Edge device is disconnected or not, the billing will continue to happen against the order/management resource. |
 
## Next steps

- XXX
- XXX
