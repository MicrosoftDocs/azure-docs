---
title: Deploy high performance network VMs on your Azure Stack Edge Pro GPU
description: Learn how to deploy high performance network VMs on your Azure Stack Edge Pro GPU.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 11/01/2022
ms.author: alkohli
# Customer intent: As an IT admin, I need to understand how to configure compute on an Azure Stack Edge Pro GPU device so that I can use it to transform data before I send it to Azure.
---

# Deploy high performance network VMs on your Azure Stack Edge Pro GPU device

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

You can create and manage virtual machines (VMs) on an Azure Stack Edge Pro GPU device by using the Azure portal, templates, and Azure PowerShell cmdlets, and via the Azure CLI or Python scripts. This article describes how to create and manage a high-performance network (HPN) VM on your Azure Stack Edge Pro GPU device. 

## About HPN VMs

A non-uniform memory access (NUMA) architecture is used to increase processing speeds. In a NUMA system, CPUs are arranged in smaller systems called nodes. Each node has its own processors and memory. Processors are typically allocated memory that they're close to so the access is quicker. For more information, see [NUMA Support](/windows/win32/procthread/numa-support).  

On your Azure Stack Edge device, logical processors are distributed on NUMA nodes and high speed network interfaces can be attached to these nodes. An HPN VM has a dedicated set of logical processors. These processors are first picked from the NUMA node that has high speed network interface attached to it, and then picked from other nodes. An HPN VM can only use the memory of the NUMA node that is assigned to its processors.  

For versions 2209 and lower, to run low latency and high throughput network applications on the HPN VMs deployed on your device, make sure to reserve vCPUs that reside in NUMA node 0. This node has Mellanox high speed network interfaces, Port 5 and Port 6, attached to it. 

For versions 2210 and higher, vCPUs are automatically reserved with the maximum supported vCPU set on each NUMA node. If HPN is already enabled from a pre-2210 version, the configuration will be carried over.

## HPN VM deployment workflow

The high-level summary of the HPN deployment workflow is as follows:

1. Enable a network interface for compute on your Azure Stack Edge device. This step creates a virtual switch on the specified network interface.
1. Enable cloud management of VMs from the Azure portal.
1. Upload a VHD to an Azure Storage account by using Azure Storage Explorer. 
1. Use the uploaded VHD to download the VHD onto the device, and create a VM image from the VHD.
1. Reserve vCPUs on the device for HPN VMs with versions 2209 and earlier.
1. Use the resources created in the previous steps:
    1. VM image that you created.
    1. Virtual switch associated with the network interface on which you enabled compute.
    1. Subnet associated with the virtual switch.

    And create or specify the following resources inline:
    1. VM name, choose a supported HPN VM size, sign-in credentials for the VM. 
    1. Create new data disks or attach existing data disks.
    1. Configure static or dynamic IP for the VM. If you're providing a static IP, choose from a free IP in the subnet range of the network interface enabled for compute.

    Use the preceding resources to create an HPN VM.

## Prerequisites

Before you begin to create and manage VMs on your device via the Azure portal, make sure that:

### [2210 and higher](#tab/2210)

- You've completed the network settings on your Azure Stack Edge Pro GPU device as described in [Step 1: Configure an Azure Stack Edge Pro GPU device](./azure-stack-edge-gpu-connect-resource-manager.md#step-1-configure-azure-stack-edge-device).

    1. You've enabled a network interface for compute. This network interface IP is used to create a virtual switch for the VM deployment. In the local UI of your device, go to **Compute**. Select the network interface that you'll use to create a virtual switch.

        > [!IMPORTANT] 
        > You can configure only one port for compute.

    1. Enable compute on the network interface. Azure Stack Edge Pro GPU creates and manages a virtual switch corresponding to that network interface.

-  You have access to a Windows or Linux VHD that you'll use to create the VM image for the VM you intend to create.
- Versions 2210 and higher have the default setting for SkuPolicy, with four logical processors reserved for root processes, and four processors available for HPN VMs. Versions 2209 and lower will carry forward the existing NUMA configuration, even if updated to 2210 from a lower version.
- Run ```Get-HcsNumaLpSetting``` to verify the NUMA lp configuration.
- Run ```Set-HcsNumaLpSetting```, if needed.

In addition to the above prerequisites that are used for VM creation, you'll also need to configure the following prerequisite specifically for the HPN VMs:

- Reserve vCPUs for HPN VMs on the Mellanox interface. Follow these steps:

    1. [Connect to the PowerShell interface of the device](azure-stack-edge-gpu-connect-powershell-interface.md#connect-to-the-powershell-interface).
    1. Identify all the VMs running on your device. This includes Kubernetes VMs, or any VM workloads that you may have deployed.

        ```powershell
        get-vm
        ```
    1. Stop all the running VMs.
    
        ```powershell
        stop-vm -force
        ``` 

    1. Get the `hostname` for your device. This should return a string corresponding to the device hostname.
        ```powershell
        hostname
        ```
    1. Get the logical processor indexes to reserve for HPN VMs. Use the following cmdlets to check or customize the CPU set.

       | Cmdlet | Description |
       |-------|----------|
       |Get-HcsNumaPolicy |Shows the current Lp PolicyType and indexes. |
       |Set-HcsNumaLpMapping |Set a policy. You can use the ```Policy``` parameter instead of specifying arrays of indexes. You also have the option to specify a custom Lp set. This cmdlet also stops VMs for you.|
       |Get-HcsNumaLpMapping |Confirm that a setting has been applied. |
       |

       ```powershell
       Get-HcsNumaPolicy
       ```
  
       Here's an example output:

       ```powershell
       SME: need sample output here
       ```


       ```powershell
       Set-HcsNumaLpMapping -Policy
       ```

       Here's an example output:

       ```powershell
       SME: need sample output here
       ```


       ```powershell
       Get-HcsNumaLpMapping
       ```

       Here's an example output:

       ```powershell
       SME: need sample output here
       ```


       > [!NOTE] 
       > Devices that are updated to 2210 from earlier versions will keep their minroot configuration from before upgrade.
       
        Here's an example output:

       ```powershell
       [dbe-1csphq2.microsoftdatabox.com]: PS>hostname 1CSPHQ2
       [dbe-1csphq2.microsoftdatabox.com]: P> Get-HcsNumaLpMapping -MapType HighPerformanceCapable -NodeName 1CSPHQ2
       { Numa Node #0 : CPUs [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19] }
       { Numa Node #1 : CPUs [24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39] }
        
       [dbe-1csphq2.microsoftdatabox.com]:PS>
       ```
 
    6. Reserve vCPUs for HPN VMs. The number of vCPUs reserved here determines the available vCPUs that could be assigned to the HPN VMs. For the number of cores that each HPN VM size uses, see the [Supported HPN VM sizes](azure-stack-edge-gpu-virtual-machine-sizes.md#supported-vm-sizes). On your device, Mellanox ports 5 and 6 are on NUMA node 0.
    
       - You can use policy instead of indexes with versions 2210 and higher.
       - You can still use a customized policy.
       - Do not need to stop/start the VM before and after running the commands, as is required in versions 2209 and lower.

         > [!Note]
         > - You can choose to reserve all the logical indexes from both NUMA nodes shown in the example or a subset of the indexes. If you choose to reserve a subset of indexes, pick the indexes from the device node that has a Mellanox network interface attached to it, for best performance. For Azure Stack Edge Pro GPU, the NUMA node with Mellanox network interface is #0. 
         > - The list of logical indexes must contain a paired sequence of an odd number and an even number. For example, ((4,5)(6,7)(10,11)). Attempting to set a list of numbers such as 5,6,7 or pairs such as 4,6 will not work. 
         > - Using two Set-HcsNuma commands consecutively to assign vCPUs will reset the configuration. Also, do not free the CPUs using the Set-HcsNuma cmdlet if you have deployed an HPN VM. 

    7. Wait for the device to finish rebooting. Once the device is running, open a new PowerShell session. [Connect to the PowerShell interface of the device](azure-stack-edge-gpu-connect-powershell-interface.md#connect-to-the-powershell-interface).
    
   8. Validate the vCPU reservation. 

      - You do not need to specify type or hostname.

      ```powershell
      Get-HcsNumaLpMapping -MapType MinRootAware -NodeName <Output of hostname command>
      ```

      The output should not show the indexes you set. If you see the indexes you set in the output, the Set command did not complete successfully. Retry the command and if the problem persists, contact Microsoft Support. 

      Here is an example output. 

      ```powershell
      dbe-1csphq2.microsoftdatabox.com]: PS> Get-HcsNumaLpMapping -MapType MinRootAware -NodeName 1CSPHQ2 

      { Numa Node #0 : CPUs [0, 1, 2, 3] } 

      { Numa Node #1 : CPUs [20, 21, 22, 23] } 

      [dbe-1csphq2.microsoftdatabox.com]: 

      PS> 
      ```

   9. Restart the VMs that you had stopped in the earlier step. 

      ```powershell
      start-vm
      ```

### [2209 and lower](#tab/2209)

- You've completed the network settings on your Azure Stack Edge Pro GPU device as described in [Step 1: Configure an Azure Stack Edge Pro GPU device](./azure-stack-edge-gpu-connect-resource-manager.md#step-1-configure-azure-stack-edge-device).

    1. You've enabled a network interface for compute. This network interface IP is used to create a virtual switch for the VM deployment. In the local UI of your device, go to **Compute**. Select the network interface that you'll use to create a virtual switch.

        > [!IMPORTANT] 
        > You can configure only one port for compute.

    1. Enable compute on the network interface. Azure Stack Edge Pro GPU creates and manages a virtual switch corresponding to that network interface.

-  You have access to a Windows or Linux VHD that you'll use to create the VM image for the VM you intend to create.

In addition to the above prerequisites that are used for VM creation, you'll also need to configure the following prerequisite specifically for the HPN VMs:

- Reserve vCPUs for HPN VMs on the Mellanox interface. Follow these steps:

    1. [Connect to the PowerShell interface of the device](azure-stack-edge-gpu-connect-powershell-interface.md#connect-to-the-powershell-interface).
    1. Identify all the VMs running on your device. This includes Kubernetes VMs, or any VM workloads that you may have deployed.

        ```powershell
        get-vm
        ```
    1. Stop all the running VMs.
    
        ```powershell
        stop-vm -force
        ``` 

    1. Get the `hostname` for your device. This should return a string corresponding to the device hostname.
        ```powershell
        hostname
        ```
    1. Get the logical processor indexes to reserve for HPN VMs. Use the following cmdlets to check or customize the CPU set.

       | Cmdlet | Description |
       |-------|----------|
       |Set-HcsNumaLpMapping |Set a policy. You can use the ```-Policy``` parameter instead of specifying arrays of indexes. You also have the option to specify a custom Lp set.|
       |Get-HcsNumaLpMapping |Confirm that a setting has been applied. |
       |


    1. Reserve vCPUs for HPN VMs. The number of vCPUs reserved here determines the available vCPUs that could be assigned to the HPN VMs. For the number of cores that each HPN VM size uses, see the [Supported HPN VM sizes](azure-stack-edge-gpu-virtual-machine-sizes.md#supported-vm-sizes). On your device, Mellanox ports 5 and 6 are on NUMA node 0.
           
       ```powershell
       Set-HcsNumaLpMapping -Policy
       ```

       After this command is run, all nodes will reboot automatically. 

       Here is an example output: 

       ```powershell
       [dbe-1csphq2.microsoftdatabox.com]: PS>Set-HcsNumaLpMapping -CpusForHighPerfVmsCommaSeperated "4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39" -AssignAllCpusToRoot $false 

       Requested Configuration requires a reboot...

       Machine will reboot in some time. Please be patient.

       [dbe-1csphq2.microsoftdatabox.com]: PS>
       ```

         > [!Note]
         > - You can choose to reserve all the logical indexes from both NUMA nodes shown in the example or a subset of the indexes. If you choose to reserve a subset of indexes, pick the indexes from the device node that has a Mellanox network interface attached to it, for best performance. For Azure Stack Edge Pro GPU, the NUMA node with Mellanox network interface is #0. 
         > - The list of logical indexes must contain a paired sequence of an odd number and an even number. For example, ((4,5)(6,7)(10,11)). Attempting to set a list of numbers such as 5,6,7 or pairs such as 4,6 will not work. 
         > - Using two Set-HcsNuma commands consecutively to assign vCPUs will reset the configuration. Also, do not free the CPUs using the Set-HcsNuma cmdlet if you have deployed an HPN VM.

       > [!NOTE] 
       > Devices that are updated to 2210 from earlier versions will keep their minroot configuration from before upgrade.
        
    1. Wait for the device to finish rebooting. Once the device is running, open a new PowerShell session. [Connect to the PowerShell interface of the device](azure-stack-edge-gpu-connect-powershell-interface.md#connect-to-the-powershell-interface).
    
   1. Validate the vCPU reservation. 

      ```powershell
      Get-HcsNumaLpMapping
      ```

      The output should not show the indexes you set. If you see the indexes you set in the output, the Set command did not complete successfully. Retry the command and if the problem persists, contact Microsoft Support. 

      Here is an example output. 

      ```powershell
      dbe-1csphq2.microsoftdatabox.com]: PS> Get-HcsNumaLpMapping -MapType MinRootAware -NodeName 1CSPHQ2 

      { Numa Node #0 : CPUs [0, 1, 2, 3] } 

      { Numa Node #1 : CPUs [20, 21, 22, 23] } 

      [dbe-1csphq2.microsoftdatabox.com]: 

      PS> 
      ```

   1. Restart the VMs that you had stopped in the earlier step. 

      ```powershell
      start-vm
      ```
---

## Deploy a VM

Follow these steps to create an HPN VM on your device.

> [!NOTE]
> Azure Stack Edge Pro 1 devices have two NUMA nodes, so you must provision HPN VMs before you provision non-HPN VMs.

1. In the Azure portal of your Azure Stack Edge resource, [Add a VM image](azure-stack-edge-gpu-deploy-virtual-machine-portal.md#add-a-vm-image). You'll use this VM image to create a VM in the next step. You can choose either Gen1 or Gen2 for the VM.

1. Follow all the steps in [Add a VM](azure-stack-edge-gpu-deploy-virtual-machine-portal.md#add-a-vm) with this configuration requirement. 

    On the Basics tab, select a VM size from [DSv2 or F-series supported for HPN](azure-stack-edge-gpu-virtual-machine-sizes.md#supported-vm-sizes).

    ![Screenshot showing the Basics tab in the Add Virtual Machine wizard for Azure Stack Edge. The Basics tab and the Next: Disks button are highlighted.](media/azure-stack-edge-gpu-deploy-virtual-machine-high-performance-network/add-high-performance-network-virtual-machine-1.png)

1. Finish the remaining steps in the VM creation. The VM will take approximately 30 minutes to be created. 

    ![Screenshot showing the Review + Create tab in the Add Virtual Machine wizard for Azure Stack Edge. The Create button is highlighted.](media/azure-stack-edge-gpu-deploy-virtual-machine-high-performance-network/add-high-performance-network-virtual-machine-2.png)

1. After the VM is successfully created, you'll see your new VM on the **Overview** pane. Select the newly created VM to go to **Virtual machines**.

    ![Screenshot showing the Virtual Machines pane of an Azure Stack Edge device. The Virtual Machines label and a virtual machine entry are highlighted.](media/azure-stack-edge-gpu-deploy-virtual-machine-high-performance-network/add-high-performance-network-virtual-machine-3.png)

    Select the VM to see the details.

    ![Screenshot that shows the Details tab on the Overview pane for a virtual machine in Azure Stack Edge. The VM size and the IP Address in Networking are highlighted.](media/azure-stack-edge-gpu-deploy-virtual-machine-high-performance-network/add-high-performance-network-virtual-machine-4.png)

    You'll use the IP address for the network interface to connect to the VM.

## Troubleshooting

 - **Issue: HPN VM provisioning fails**
   
   **Error description:** Use the following cmdlet to check capacity/host resource when HPN VM provisioning fails. 

   *Customer-facing error message*

   **Suggested solution:**

   Cmdlet:

   Next steps:

- **Issue: Insufficient CPU or memory resources**

   **Error description:** If deployment fails because not enough vCPUs are reserved for HPN VMs, you will see the following error message: 

   *`FabricVmPlacementErrorInsufficientNumaNodeCapacity`*

   **Suggested solution:** For versions 2210 and higher, you must reserve vCPUs for HPN VMs prior to deployment.
 
## Next steps

- [Troubleshoot VM deployment](azure-stack-edge-gpu-troubleshoot-virtual-machine-provisioning.md)
- [Monitor VM activity on your device](azure-stack-edge-gpu-monitor-virtual-machine-activity.md)
- [Monitor CPU and memory on a VM](azure-stack-edge-gpu-monitor-virtual-machine-metrics.md)

