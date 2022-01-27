---
title: Disconnected scenario for Azure Stack Edge Pro GPU
description: Describes scenarios, prerequisites, and feature availabity on Azure Stack Edge Pro GPU device disconnected from Internet.
services: databox
author: v-dalc

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 01/27/2022
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

- You've activated your Azure Stack Edge Pro device as described in [Activate Azure Stack Edge Pro](azure-stack-edge-gpu-deploy-activate.md).

- For IOT Edge / Kubernetes, deploy Kubernetes on your device. Enable the Kubernetes components, and deploy compute modules and containers on the Azure Stack Edge device. Then make sure they're running.<!--1) Is the only available method in a standalone deployment to use an IoT Edge module to run a stateless application? If so, we should state this. In "Deployment types" (https://docs.microsoft.com/en-us/azure/databox-online/azure-stack-edge-gpu-kubernetes-workload-management#deployment-types), the kubectl deployment looks appropriate also. 2) The IoT Edge deployment has three components. Include the first and second (Deploy a stateless app; Deploy a GPU shared workload). How about the third: Develop a C# module to contain the app? 3) Can we make this a higher-level requirement? They need to complete the Kubernetes deployment instructions for the method of choice, and make sure things are running smoothly.-->

## Limited or unavailable features

When your Azure Stack Edge deployment is disconnected from the Internet, Azure endpoints can't be reached, which affects some Azure Stack Edge features. When you reconnect the system, you'll be able to communicate with Azure and Azure services again. *Restoring full functionality? Any exceptions?*

The following table describes behavior changes for each Azure Stack Edge feature or component while your Azure Stack Edge device is disconnected from the Internet.

TABLE EDIT IN PROGRESS.

| Azure Stack Edge feature/component | Impact/behavior when disconnected |
|------------------------------------|-----------------------------------|
| Local UI / Minishell | Local access via the local web UI or the device minishell<!--This is a reference to a specific command-line app?--> is available by connecting a client computer directly to the device. |
| Kubernetes | Deployments of Kubernetes will be limited:<ul><li>Users can use local `kubectl` access to manage deployments via the native `kubeconfig` app.</li><li>Azure Stack Edge has a local container registry to host images. You will manage the deployment of these images from your local network. For more information, see [Enable an Edge container registry on Azure Stack Edge Pro GPU device](azure-stack-edge-gpu-edge-container-registry.md).</li><li>Direct access to the cloud container registry isn't available. You're responsible for pushing and deleting images to the local container registry.</li><li>You can't monitor the Kubernetes cluster using Azure Monitor. Instead, use the local Kubernetes dashboard, available on the compute network. For more information, see [Monitor your Azure Stack Edge Pro device via Kubernetes dashboard](azure-stack-edge-gpu-monitor-kubernetes-dashboard.md).</li></ul> |
| Azure Arc for Kubernetes | An Azure Arc-enabled Kubernetes deployment can't be used in an offline Azure Stack Edge deployment.<!--Projection of the Kubernetes cluster as an ARC resource and for setting up and editing the ARC configuration will not be available.--> |
| IoT Edge | IoT Edge modules already deployed on the device continue to run, but you can't update the IOT Edge deployment manifest (for example, images and configuration options) while the device is disconnected from the Internet. You can make these updates when the device can communicate with Azure again. |
| Azure Arc for Data Services | Data services can run after the images are deployed on the device. New images won't be able to pull from Azure until connectivity is resumed. |
| Tiering | Tiering to and from the cloud won't function in disconnected mode. You won't be able to access any ghosted data directly through the device. The access attempt will failed with an error. You won't be able to use the Refresh feature where it syncs the storage account data for the cloud shares. Syncing of the data can resume<!--resumes?--> when connectivity is established. |
| VM cloud Management | Images from cloud source will not be able to download to the device. Users can try again once connectivity is resumed. VM can be managed locally via local ARM. |
| VM Image Ingestion Job | This service does not function disconnect from Azure. To create a VM on the device, the OS image needs to be present on the local blob store of the device. Users can manually upload a VM image locally to the device. Once an image is available on the local blob storage user can create a VM from that image via the local ARM APIs. |
| Local ARM Function | This component requires connectivity during initial registration and configuration like setting arm edge user password and ARM subscription ID. Once registration, and arm edge user password completes, ARM can function without connectivity to Azure.|
| Supportability/Support Log Collection/Remote Supportability | Supportability functions like automatically sending logs to Microsoft to support issues will not be available. Customers will have to trigger support packages manually from the device local UI. While working with Microsoft Support, customers will receive a SAS URI to upload the support packages to.<br>In addition, Microsoft's ability perform remote diagnostic and repair functionality remotely won't be available. This function requires communications with Azure for the commands to be applied onto the device. |
| 5G | These components require Azure connectivity: registration, Vnf deploymnet (creating, deleting vnf); Vnf management, Metrics collection - every 1-5 min; vnf heartbeat to Mec service every 10 min |
| Updates | Customers can apply updates by downloading update package manually and then applying the update package via the device local UI. |
| VPN | After you configure VPN, VPN will remain intact even when there is no connection to Azure. When connectivity to Azure is established, data-in-motion will transfer over the VPN. |
| Billing | Irrespective of whether the Azure Stack Edge device is disconnected or not, the billing will continue to happen against the order/management resource. |
 
## Next steps

- XXX
- XXX
