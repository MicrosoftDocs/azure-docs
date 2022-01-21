---
title: Disconnected scenario for Azure Stack Edge Pro GPU
description: Describes scenarios, prerequisites, and feature availabity on Azure Stack Edge Pro GPU device disconnected from Internet.
services: databox
author: v-dalc

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 01/21/2022
ms.author: alkohli
---

# Disconnected scenario for Azure Stack Edge Pro GPU

You may have a use case that requires your Azure Stack Edge device to not be connected to the Internet. As a result, Azure Stack Edge becomes a standalone deployment and is disconnected from and does not communicate with Azure and other Azure services. In a disconnected scenario, certain functionality of the device is limited or unusable. This article helps identify areas of consideration when you need to deploy Azure Stack Edge disconnected from the Internet.

*Is this a shared scenario for Pro GPU, Pro R, Mini R?*

## Scenarios

You might need a disconnected deployment in the following scenarios:  

- Security or other restrictions require that you deploy your Azure Stack Edge device in an environment with no Internet connection.

- You want to block data, including usage data, from being sent to Azure.

- You want to use Azure Stack Edge purely as a standalone edge solution that's deployed to your corporate intranet.

## Prerequisites

Before you disconnect your Azure Stack Edge device from the network that allows Internet access, complete the following prerequisites:

- Activate your Azure Stack Edge device.

- For IOT Edge / Kubernetes, deploy Kubernetes on your device. Enable the Kubernetes components and deploy compute modules and containers on the Azure Stack Edge device. Then make sure they're running. ADD LINK.

## Limited or unavailable features

When your Azure Stack Edge deployment is disconnected from the Internet, Azure endpoints can't be reached, which affects some Azure Stack Edge features. The following table describes behavior changes for each Azure Stack Edge feature or component.

When you reconnect the system, you'll be able to communicate with Azure and Azure services again. *Restoring full functionality? Any exceptions?*

*01/21: Table was ported in from source with minimal edits. Links to more info, tone (positive presentation), checks for standard descriptions of features and functions not yet performed.*

| Azure Stack Edge feature/component | Impact/behavior when disconnected |
|------------------------------------|-----------------------------------|
| Local UI / Minishell | Local access via the local UI or the device minishell is available by connecting a client machine directly to the device. |
| Kubernetes | Deployments of Kubernetes will be limited.<br>Users can use the local kubectl access to manage deployments via the Kubernetes’s native kubeconfig.<br>Azure Stack Edge does have a local container registry to host images. Users will have to manage the deployment of these images from their local network. For more information, see Enable an Edge container registry on Azure Stack Edge Pro GPU device | Microsoft Docs.<br>Direct access to the cloud container registry isn't available. You are respondible for pushing and deleting images to the local container registry.<br>You won't be able to monitor the Kubernetes cluster using Azure Monitor. You can use the local Kubernetes dashboard, available on the compute network, instead. For more information, see Monitor your Azure Stack Edge Pro device via Kubernetes dashboard | Microsoft Docs. |
| Azure Arc for Kubernetes | Projecting Kubernetes cluster as an ARC resource and for setting up/editing ARC configuration will not be available. |
| IoT Edge | IoT Edge modules already deployed on the device continue to run, but you can't update the IOT Edge deployment manifest (for example, images and configuration options). You can make these updates when the device can communicated with Azure again. |
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
