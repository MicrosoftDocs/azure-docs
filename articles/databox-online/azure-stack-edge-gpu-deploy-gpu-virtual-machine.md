---
title: Overview and deployment of GPU VMs on your Azure Stack Edge Pro GPU device
description: Describes how to create and manage GPU virtual machines (VMs) on an Azure Stack Edge Pro GPU device using templates.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 07/08/2021
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

> [!IMPORTANT]
> If your device will be running Kubernetes, do not configure Kubernetes before you deploy your GPU VMs. If you configure Kubernetes first, it claims all the available GPU resources, and GPU VM creation will fail.

### [Portal](#tab/portal)

Follow these steps when deploying GPU VMs on your device via the Azure portal:

1. To create GPU VMs, follow all the steps in [Deploy VM on your Azure Stack Edge using Azure portal](azure-stack-edge-gpu-deploy-virtual-machine-portal.md), with these configuration requirements:

    1. On the **Basics** tab, select a [VM size from NCasT4-v3-series](azure-stack-edge-gpu-virtual-machine-sizes.md#ncast4_v3-series-preview).

       ![Screenshot of Basics tab with supported VM sizes for GPU VMs identified.](media/azure-stack-edge-gpu-deploy-gpu-virtual-machine/basics-tab-01-select-vm-size-for-gpu.png)<!--Reshoot with Basics tab context.-->

    1. To install the GPU extension during deployment, on the **Advanced** tab, choose **Select an extension to install**. Then select a GPU extension to install.<!--Screenshots below to be combined as in post-deployment install.-->
    
       GPU extensions are only available for a virtual machine with a [VM size from NCasT4-v3-series](azure-stack-edge-gpu-virtual-machine-sizes.md#ncast4_v3-series-preview).

        > [!NOTE]
        > If you're using a Red Hat image, you'll need to install the GPU extension after VM deployment. Follow the steps in [Install GPU extension](azure-stack-edge-gpu-deploy-virtual-machine-install-gpu-extension.md).
    
       ![Screenshot identifying the Select an extension option on the Advanced tab](media/azure-stack-edge-gpu-deploy-gpu-virtual-machine/advanced-tab-01-select-an-extension-to-install.png)

       ![Screenshot showing Select extension to install on the Add extension pane](media/azure-stack-edge-gpu-deploy-gpu-virtual-machine/advanced-tab-02-add-extension-pane.png)

        The **Advanced** tab shows the extension you selected.

        ![Screenshot showing an extension added to the Advanced tab](media/azure-stack-edge-gpu-deploy-gpu-virtual-machine/advanced-tab-03-with-gpu-extension-added.png)

1. Once the GPU VM is successfully created, you can view this VM in the list of virtual machines in your Azure Stack Edge resource in the Azure portal.

    ![GPU VM in list of virtual machines in Azure portal](media/azure-stack-edge-gpu-deploy-gpu-virtual-machine/list-virtual-machine-1.png)

    Select the VM, and drill down to the details. On the **Basics** tab, under **Installed extensions**, make sure the GPU extension has **Succeeded** status. <!--NOT NEEDED? Copy the IP address allocated to the VM.-->

    ![Installed GPU extension shown on the Details pane for a virtual machine](media/azure-stack-edge-gpu-deploy-gpu-virtual-machine/vm-details-01-extension-settings.png)

1. If needed, you can switch the compute network back to whatever you need.

#### Install GPU extension on a deployed VM

To install a GPU extension after you deploy a virtual machine, do these steps in the Azure portal:

1. Go to the virtual machine you want to add the GPU extension to.

    ![Screenshot that shows how to select a virtual machines from the Virtual machines Overview.](media/azure-stack-edge-gpu-deploy-gpu-virtual-machine/add-virtual-machine-extension-01.png)
  
1. In **Details**, select **+ Add extension**. Then select a GPU extension to install.

    GPU extensions are only available for a virtual machine with a [VM size from NCasT4-v3-series](azure-stack-edge-gpu-virtual-machine-sizes.md#ncast4_v3-series-preview).

    ![Screenshot that shows the + Add virtual machine button on the dashboard for a VM.](media/azure-stack-edge-gpu-deploy-gpu-virtual-machine/add-virtual-machine-extension-02.png)

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

    ![GPU VM in list of virtual machines in Azure portal](media/azure-stack-edge-gpu-deploy-gpu-virtual-machine/list-virtual-machine-1.png)

1. Select the VM, and drill down to the details. Copy the IP address allocated to the VM.

    ![IP allocated to GPU VM in Azure portal](media/azure-stack-edge-gpu-deploy-gpu-virtual-machine/get-ip-gpu-virtual-machine-1.png)

1. If needed, you can switch the compute network back to whatever you need.

After the VM is created, you can [deploy the GPU extension using the extension template](azure-stack-edge-gpu-deploy-virtual-machine-install-gpu-extension.md?tabs=linux).

---

> [!NOTE]
> When updating your device software version from 2012 to later, you will need to manually stop the GPU VMs.


## Next steps

- Learn how to [Install the GPU extension](azure-stack-edge-gpu-deploy-virtual-machine-install-gpu-extension.md) on the GPU VMs running on your device.
- *Add link to central article about Kubernetes installation.*
