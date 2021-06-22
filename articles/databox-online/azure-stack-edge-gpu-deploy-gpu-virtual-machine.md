---
title: Overview and deployment of GPU VMs on your Azure Stack Edge Pro GPU device
description: Describes how to create and manage GPU virtual machines (VMs) on an Azure Stack Edge Pro GPU device using templates.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 06/22/2021
ms.author: alkohli
#Customer intent: As an IT admin, I need to understand how to create and manage virtual machines (VMs) on my Azure Stack Edge Pro GPU device using APIs so that I can efficiently manage my VMs.
---

# Deploy GPU VMs on your Azure Stack Edge Pro GPU device

<!--In development. Overview was removed from the "Deploy GPU VMs" article, but no updates have been made to metadata, introduction, or procedures.-->

[!INCLUDE [applies-to-GPU-and-pro-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-sku.md)]

This article provides an overview of GPU virtual machines (VMs) on your Azure Stack Edge Pro GPU device. The article also describes how to create a GPU VM by using the Azure Resource Manager templates. 

---

## Create GPU VMs

You can deploy GPU VMs via the portal or using Azure Resource Manager templates.

### [Portal](#tab/portal)

Follow these steps when deploying GPU VMs on your device via the Azure portal:

1. Identify if your device will also be running Kubernetes. If the device will run Kubernetes, then you'll need to create the GPU VM first and then configure Kubernetes. If Kubernetes is configured first, then it will claim all the available GPU resources and the GPU VM creation will fail.

<!--1. [Download the VM templates and parameters files](https://aka.ms/ase-vm-templates) to your client machine. Unzip it into a directory you’ll use as a working directory.

1. Before you can deploy VMs on your Azure Stack Edge device, you must configure your client to connect to the device via Azure Resource Manager over Azure PowerShell. For detailed instructions, see [Connect to Azure Resource Manager on your Azure Stack Edge device](azure-stack-edge-gpu-connect-resource-manager.md).-->

1. To create GPU VMs, follow all the steps in [Deploy VM on your Azure Stack Edge using Azure portal](azure-stack-edge-gpu-deploy-virtual-machine-portal.md), with these configuration requirements: 
   
    1. On the **Basics** tab, select a [VM size from NCasT4-v3-series](azure-stack-edge-gpu-virtual-machine-sizes.md#ncast4_v3-series-preview).<!--Is this link too cryptic?-->

    1. On the **Advanced** tab, SELECT GPU EXTENSION TO INSTALL. If you don't want to install the GPU extension now, you can do it after the VM is deployed.

    Once the GPU VM is successfully created, you can view this VM in the list of virtual machines in your Azure Stack Edge resource in the Azure portal.

        ![GPU VM in list of virtual machines in Azure portal](media/azure-stack-edge-gpu-deploy-gpu-virtual-machine/list-virtual-machine-1.png)

    1. Select the VM and drill down to the details. <!--Copy the IP allocated to the VM. Included in the templates procedure because they will need to use this immediately to install the GPU extension using a template?-->

    ![IP allocated to GPU VM in Azure portal](media/azure-stack-edge-gpu-deploy-gpu-virtual-machine/get-ip-gpu-virtual-machine-1.png)

1. If needed, you could switch the compute network back to whatever you need. 

After the VM is created, you can deploy GPU extension using the extension template.


### [Templates](#tab/templates)

Follow these steps when deploying GPU VMs on your device using Azure Resource Manager templates:

1. Identify if your device will also be running Kubernetes. If the device will run Kubernetes, then you'll need to create the GPU VM first and then configure Kubernetes. If Kubernetes is configured first, then it will claim all the available GPU resources and the GPU VM creation will fail.

1. [Download the VM templates and parameters files](https://aka.ms/ase-vm-templates) to your client machine. Unzip it into a directory you’ll use as a working directory.

1. Before you can deploy VMs on your Azure Stack Edge device, you must configure your client to connect to the device via Azure Resource Manager over Azure PowerShell. For detailed instructions, see [Connect to Azure Resource Manager on your Azure Stack Edge device](azure-stack-edge-gpu-connect-resource-manager.md).

1. To create GPU VMs, follow all the steps in the [Deploy VM on your Azure Stack Edge using templates](azure-stack-edge-gpu-deploy-virtual-machine-templates.md), with these configuration requirements: 
            
    - When specifying GPU VM sizes, make sure to use the NCasT4-v3-series in the `CreateVM.parameters.json` as these are supported for GPU VMs. For more information, see [Supported VM sizes for GPU VMs](azure-stack-edge-gpu-virtual-machine-sizes.md#ncast4_v3-series-preview).

       ```json
           "vmSize": {
         "value": "Standard_NC4as_T4_v3"
       },
       ```

    Once the GPU VM is successfully created, you can view this VM in the list of virtual machines in your Azure Stack Edge resource in the Azure portal.

    ![GPU VM in list of virtual machines in Azure portal](media/azure-stack-edge-gpu-deploy-gpu-virtual-machine/list-virtual-machine-1.png)

1. Select the VM, and drill down to the details. Copy the IP allocated to the VM.

    ![IP allocated to GPU VM in Azure portal](media/azure-stack-edge-gpu-deploy-gpu-virtual-machine/get-ip-gpu-virtual-machine-1.png)

1. If needed, you could switch the compute network back to whatever you need. 

After the VM is created, you can deploy the GPU extension using the extension template.<!--Link task to procedure.-->

---

> [!NOTE]
> When updating your device software version from 2012 to later, you will need to manually stop the GPU VMs.


## Next steps

- Learn how to [Install GPU extension](azure-stack-edge-gpu-deploy-virtual-machine-install-gpu-extension.md) on the GPU VMs running on your device.
