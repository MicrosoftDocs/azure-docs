---
title: What is local Azure Resource Manager on Azure Stack Edge Pro GPU device
description: Describes an overview of what is the local Azure Resource Manager on your Azure Stack Edge device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: overview
ms.date: 05/20/2021
ms.author: alkohli
#Customer intent: As an IT admin, I need to understand what si the local Azure Resource Manager on my Azure Stack Edge Pro device.
---

# What is local Azure Resource Manager on Azure Stack Edge?

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

Azure Resource Manager provides a management layer that enables you to create, update, and delete resources in your Azure subscription. The Azure Stack Edge devices support the same Azure Resource Manager APIs to create, update, and delete VMs in a local subscription. This support lets you manage the device in a manner consistent with the cloud. 

This article provides an overview of the local Azure Resource Manager that can be used to connect to the local APIs on your Azure Stack Edge devices.

## About local Azure Resource Manager

The local Azure Resource Manager provides a consistent management layer to call the Azure Stack Edge device APIs and perform operations such as create, update, and delete VMs. 

1. When you send a request from REST APIs or SDKs, the local Azure Resource Manager on the device receives the request. 
1. The local Azure Resource Manager uses the Security Token Service (STS) to authenticate and authorize the request. STS is responsible for creation, validation, renewal, and cancellation of security tokens. STS creates the access token and refresh token that are used for continuous communication between the device and the clients accessing the device via the local Azure Resource Manager.
1. The Resource Manager then sends the request to the resource providers that take the requested action.  Some of the common resource providers that are pre-registered with Azure Stack Edge are `Microsoft.Compute` (Compute resource provider), `Microsoft.Network` (Networking resource provider),  `Microsoft.Storage` (Storage resource provider), and `Microsoft.Disks` (Disk resource provider).

    Resources are manageable item that are available through Azure Stack Edge and the resource providers are responsible for providing resources. For example, virtual machines, storage accounts, and virtual networks are examples of resources. And the compute resource provider supplies the virtual machine resource.    

Because all requests are handled through the same API, you see consistent results and capabilities in all the different tools.

The following image shows the mechanism of handling all the API requests and the role the local Azure Resource Manager plays in providing a consistent management layer to handle those requests.


![Diagram for Azure Resource Manager](media/azure-stack-edge-gpu-connect-resource-manager/edge-device-flow.svg)

Another key benefit of Azure Resource Manager is that it lets you use Resource Manager templates. These are JavaScript Object Notation (JSON) files in a declarative syntax that can be used to deploy the resources consistently and repeatedly. The declarative syntax lets you state "Here is what I intend to create" without having to write the sequence of programming commands to create it. For example, you can use these declarative syntax templates to deploy virtual machines on your Azure Stack Edge devices. For detailed information, see [Deploy virtual machines on your Azure Stack Edge device via templates](azure-stack-edge-gpu-deploy-virtual-machine-templates.md).

## Connect to the local Azure Resource Manager

To create virtual machines or shares or storage accounts on your Azure Stack Edge device, you will need to create the corresponding resources. For example, for virtual machines, you will need resources such as network interface, OS and data disks on VM, from the networking, disk, and storage resource providers. 

To request the creation of any resources from the resource providers, you will need to first connect to the local Azure Resource Manager. For detailed steps, see Connect to Azure Resource Manager on your Azure Stack Edge device.

The first time you connect to Azure Resource Manager, you would also need to add reset your password. For detailed steps, see [Reset your Azure Resource Manager password](azure-stack-edge-gpu-set-azure-resource-manager-password.md).


## Azure Resource Manager endpoints

The local Azure Resource Manager and the STS services run on your device and can be reached at specific endpoints. The following table summarizes the various endpoints exposed on your device by these service, the supported protocols, and the ports to access those endpoints. 

| # | Endpoint | Supported protocols | Port used | Used for |
| --- | --- | --- | --- | --- |
| 1. | Azure Resource Manager | https | 443 | To connect to Azure Resource Manager for automation |
| 2. | Security token service | https | 443 | To authenticate via access and refresh tokens |


## Next steps

[Connect to the local Azure Resource Manager on your Azure Stack Edge Pro GPU device](azure-stack-edge-gpu-deploy-virtual-machine-powershell.md).
