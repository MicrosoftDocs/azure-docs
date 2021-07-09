---
title: Overview and deployment of GPU VMs on your Azure Stack Edge Pro GPU device
description: Describes how to create and manage GPU virtual machines (VMs) on an Azure Stack Edge Pro GPU device using templates.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 07/09/2021
ms.author: alkohli
#Customer intent: As an IT admin, I need to understand how to create and manage virtual machines (VMs) on my Azure Stack Edge Pro GPU device using APIs so that I can efficiently manage my VMs.
---


# Deploy GPU VMs on your Azure Stack Edge Pro GPU device

[!INCLUDE [applies-to-GPU-and-pro-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-sku.md)]

This article how to create a GPU VM in the Azure portal or by using the Azure Resource Manager templates. In the Azure portal, you can install the GPU extension as part of VM creation.

*ADD LINK TO GPU VMs OVERVIEW WHEN ARTICLE IS AVAILABLE.*

---

## Create GPU VMs

You can deploy GPU VMs via the portal or using Azure Resource Manager templates.

> [!IMPORTANT]
> If your device will be running Kubernetes, do not configure Kubernetes before you deploy your GPU VMs. If you configure Kubernetes first, it claims all the available GPU resources, and GPU VM creation will fail.

### [Portal](#tab/portal)

Follow these steps when deploying GPU VMs on your device via the Azure portal:

1. To create GPU VMs, follow all the steps in [Deploy VM on your Azure Stack Edge using Azure portal](azure-stack-edge-gpu-deploy-virtual-machine-portal.md), with these configuration requirements:

    1. On the **Basics** tab, select a [VM size from NCasT4-v3-series](azure-stack-edge-gpu-virtual-machine-sizes.md#ncast4_v3-series-preview).

       ![Screenshot of Basics tab with supported VM sizes for GPU VMs identified.](media/azure-stack-edge-gpu-deploy-gpu-virtual-machine/basics-vm-size-for-gpu.png)

    1. To install the GPU extension during deployment, on the **Advanced** tab, choose **Select an extension to install**. Then select a GPU extension to install. GPU extensions are only available for a virtual machine with a [VM size from NCasT4-v3-series](azure-stack-edge-gpu-virtual-machine-sizes.md#ncast4_v3-series-preview).
        
        > [!NOTE]
        > If you're using a Red Hat image, you'll need to install the GPU extension after VM deployment. Follow the steps in [Install GPU extension](azure-stack-edge-gpu-deploy-virtual-machine-install-gpu-extension.md).
    
       ![Illustration showing how to add a GPU extension to a virtual machine during VM creation in the portal](media/azure-stack-edge-gpu-deploy-gpu-virtual-machine/add-extension-01.png)

       The **Advanced** tab shows the extension you selected.

       ![Screenshot showing an extension added to the Advanced tab during VM creation](media/azure-stack-edge-gpu-deploy-gpu-virtual-machine/add-extension-02.png)

1. Once the GPU VM is successfully created, you can view this VM in the list of virtual machines in your Azure Stack Edge resource in the Azure portal.

    ![GPU VM in list of virtual machines in Azure portal - 1](media/azure-stack-edge-gpu-deploy-gpu-virtual-machine/list-virtual-machines-01.png)

    Select the VM, and drill down to the details. Make sure the GPU extension has **Succeeded** status.

    ![Installed GPU extension shown on the Details pane for a virtual machine](media/azure-stack-edge-gpu-deploy-gpu-virtual-machine/vm-details-extension-installed.png)


### [Templates](#tab/templates)

Follow these steps when deploying GPU VMs on your device using Azure Resource Manager templates:

1. [Download the VM templates and parameters files](https://aka.ms/ase-vm-templates) to your client machine. Unzip it into a directory you’ll use as a working directory.

1. Before you can deploy VMs on your Azure Stack Edge device, you must configure your client to connect to the device via Azure Resource Manager over Azure PowerShell. For detailed instructions, see [Connect to Azure Resource Manager on your Azure Stack Edge device](azure-stack-edge-gpu-connect-resource-manager.md).

1. To create GPU VMs, follow all the steps in [Deploy VM on your Azure Stack Edge using templates](azure-stack-edge-gpu-deploy-virtual-machine-templates.md), with these configuration requirements: 
            
    - When specifying GPU VM sizes, make sure to use the NCasT4-v3-series in the `CreateVM.parameters.json`, which are supported for GPU VMs. For more information, see [Supported VM sizes for GPU VMs](azure-stack-edge-gpu-virtual-machine-sizes.md#ncast4_v3-series-preview).

       ```json
           "vmSize": {
         "value": "Standard_NC4as_T4_v3"
       },
       ```

    Once the GPU VM is successfully created, you can view this VM in the list of virtual machines in your Azure Stack Edge resource in the Azure portal.

    ![GPU VM in list of virtual machines in Azure portal](media/azure-stack-edge-gpu-deploy-gpu-virtual-machine/list-virtual-machines-01.png)

1. Select the VM, and drill down to the details. Copy the IP address allocated to the VM.

    ![IP allocated to GPU VM in Azure portal](media/azure-stack-edge-gpu-deploy-gpu-virtual-machine/get-ip-of-virtual-machine.png)

1. If needed, you can switch the compute network back to whatever you need.

After the VM is created, you can [deploy the GPU extension using the extension template](azure-stack-edge-gpu-deploy-virtual-machine-install-gpu-extension.md?tabs=linux).

---

> [!NOTE]
> When updating your device software version from 2012 to later, you will need to manually stop the GPU VMs.

## Install GPU extension after deployment

After you create a virtual machine for use with GPU, you must install a GPU extension. From the portal, you can install the GPU extension during or after VM deployment. If you're using templates, you'll install the GPU extension after you create the VM.

---

### [Portal](#tab/portal)

If you didn't install the GPU extension when you created the VM, you can install it after deployment. 

Follow these steps to install a GPU extension on a VM in the Azure portal:

1. Go to the virtual machine you want to add the GPU extension to.

    ![Screenshot that shows how to select a virtual machines from the Virtual machines Overview.](media/azure-stack-edge-gpu-deploy-gpu-virtual-machine/add-extension-after-deployment-01.png)
  
1. In **Details**, select **+ Add extension**. Then select a GPU extension to install.

    GPU extensions are only available for a virtual machine with a [VM size from NCasT4-v3-series](azure-stack-edge-gpu-virtual-machine-sizes.md#ncast4_v3-series-preview).

    ![Illustration showing how to use the + Add extension button in VM details to add a GPU extension to a VM.](media/azure-stack-edge-gpu-deploy-gpu-virtual-machine/add-extension-after-deployment-02.png)

### [Templates](#tab/templates)

When you create a GPU VM using templates, you install the GPU extension after deployment. For detailed steps for using templates to deploy a GPU extension on a Windows virtual machine or a Linux virtual machine, see [Install GPU extension](azure-stack-edge-gpu-deploy-virtual-machine-install-gpu-extension.md).

---

## Next steps

- Learn how to [Install the GPU extension](azure-stack-edge-gpu-deploy-virtual-machine-install-gpu-extension.md) on the GPU VMs running on your device.
- *Add link to central article about Kubernetes installation.*
