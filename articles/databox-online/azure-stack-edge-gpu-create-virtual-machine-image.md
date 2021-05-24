---
title: Create VM images for your Azure Stack Edge Pro GPU device
description: Describes how to create linux or Windows VM images to use with your Azure Stack Edge Pro GPU device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 05/24/2021
ms.author: alkohli
#Customer intent: As an IT admin, I need to understand how to create and upload Azure VM images that I can use with my Azure Stack Edge Pro device so that I can deploy VMs on the device.
---

# Create custom VM images for your Azure Stack Edge Pro device

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

To deploy VMs on your Azure Stack Edge Pro device, you need to be able to create custom VM images that you can use to create VMs. This article describes the steps that are required to create Linux or Windows VM custom images that you can use to deploy VMs on your Azure Stack Edge Pro GPU device.

> [!NOTE] 
> For a VM image used on an Azure Stack Edge Pro GPU device, you need to use a fixed VHD to create a Generation 1 VM. The VM can be any VM size that Azure supports. For more information, see [Supported VM sizes](azure-stack-edge-gpu-virtual-machine-sizes.md#supported-vm-sizes).

## Prerequisites

Complete the following prerequisite before you create your VM image:

- [Download AZCopy](/azure/storage/common/storage-use-azcopy-v10#download-azcopy). The `azcopy copy` gives you a fast way to download of an OS disk to an Azure Storage account.

## VM image workflow

The workflow requires you to create a virtual machine in Azure, customize the VM, generalize, and then download the OS VHD for that VM.

For more information, go to [Deploy a VM on your Azure Stack Edge Pro device using Azure PowerShell](azure-stack-edge-gpu-deploy-virtual-machine-powershell.md).


## Create a Windows custom VM image

Do the following steps to create a Windows VM image.

1. Create a Windows virtual machine in Azure. For portal instructions, see [Create a Windows virtual machine in the Azure portal](/azure/virtual-machines/windows/quick-create-portal). For PowerShell instructions, see [Tutorial: Create and manage Windows VMs with Azure PowerShell](../virtual-machines/windows/tutorial-manage-vm.md).

   The virtual machine must be a Generation 1 VM. The OS disk that you use to create your VM image must be a fixed-size VHD. 

2. Generalize the virtual machine. Connect to the virtual machine, open a command prompt, and run the following `sysprep` command:<!--Or link to "Optional: Generalize the VM" in "Download a Windows VHD from Azure" (https://docs.microsoft.com/en-us/azure/virtual-machines/windows/download-vhd#optional-generalize-the-vm).-->
    
    `c:\windows\system32\sysprep\sysprep.exe /oobe /generalize /shutdown /mode:vm`

   > [!IMPORTANT]
   > After the command is complete, the VM will shut down. **Do not restart the VM.** Restarting the VM will corrupt the disk you just prepared.

3. Download the OS disk from Azure:

   1. [Stop the VM in the portal](/azure/virtual-machines/windows/download-vhd#stop-the-vm). This step is required, even after the is generalize and shut down, to deallocate the OS disk so that the disk can be downloaded. 
   1. [Generate a download URL](/azure/virtual-machines/windows/download-vhd#generate-download-url). By default, the URI expires after 3600 seconds (1 hour). You can increase that time if needed. 
      
   1. Download the URL to you Azure Storage account. Two methods are available:
   
      - One method is to select **Download the VHD file** when you generate a download URL (in the previous step) to download the disk from the portal. **When you use this method, the disk copy takes a long time.**

      - A faster method is to use AzCopy. In PowerShell, navigate to the directory that contains adcopy.exe, and run the following command:

        `.\azcopy copy <source URI> <target URI> --recursive`

        where:
        * `<source URI>` is the download URL generated in the preceding step.
        * `<target URI>` is the URI to be assigned to the exported VHD in your Azure Storage account. 
          Save the VHD to a Blob container in an Azure Storage account. It's a good idea to save it to the storage account for your Azure Stack Edge Pro GPU device.
          - To get the target URI, generate a shared access signature (SAS) for the target Blob container. You can do this from the container in the Azure Storage account (NO LINK FOUND), [using Azure Storage Explorer](/azure/storage/blobs/sas-service-create?tabs=dotnet#create-a-service-sas-for-a-blob-container)<!--Procedure creates SAS URI for a file rather than its container.-->, or [using .NET or JavaScript](/azure/storage/blobs/sas-service-create?tabs=dotnet#create-a-service-sas-for-a-blob-container).  
          - Insert the name you want to assign the VHD before the query string (before the **?**) in the format "/<filename>.vhd". The file must have the VHD file name extension. 
        
             For example, the following URI will copy a file named **windowsosdisk.vhd** to the **virtual machines** Blob container in the **mystorageaccount** storage account:

             `https://mystorageaccount.blob.core.windows.net/virtualmachines/windowsosdisk.vhd?sp=rw&st=2021-05-21T16:52:24Z&se=2021-05-22T00:52:24Z&spr=https&sv=2020-02-10&sr=c&sig=PV3Q3zpaQ%2FOLidbQJDKlW9nK%2BJ7PkzYv2Eczxko5k%2Bg%3D`

            For example, the following command DESCRIBE.

             ```azcopy
             .\azcopy copy "https://md-h1rvdq3wwtdp.z24.blob.storage.azure.net/gxs3kpbgjhkr/abcd?sv=2018-03-28&sr=b&si=f86003fc-a231-43b0-baf2-61dd51e3a05a&sig=o5Rj%2BNZSook%2FVNMcuCcwEwsr0i7sy%2F7gIDzak6JhlKg%3D" "https://mystorageaccountvdalc.blob.core.windows.net/virtualmachines/osdisk.vhd?sp=rw&st=2021-05-21T16:52:24Z&se=2021-05-22T00:52:24Z&spr=https&sv=2020-02-10&sr=c&sig=PV3Q3zpaQ%2FOLidbQJDKlW9nK%2BJ7PkzYv2Eczxko5k%2Bg%3D" --recursive
             ```

            The sample command returns this output:

            ```output
            PS C:\azcopy\azcopy_windows_amd64_10.10.0> .\azcopy copy "https://md-h1rvdq3wwtdp.z24.blob.storage.azure.net/gxs3kpbgjhkr/abcd?sv=2018-03-28&sr=b&si=f86003fc-a231-43b0-baf2-61dd51e3a05a&sig=o5Rj%2BNZSook%2FVNMcuCcwEwsr0i7sy%2F7gIDzak6JhlKg%3D" "https://mystorageaccountvdalc.blob.core.windows.net/virtualmachines/osdisk.vhd?sp=rw&st=2021-05-21T16:52:24Z&se=2021-05-22T00:52:24Z&spr=https&sv=2020-02-10&sr=c&sig=PV3Q3zpaQ%2FOLidbQJDKlW9nK%2BJ7PkzYv2Eczxko5k%2Bg%3D" --recursive
            INFO: Scanning...
            INFO: Failed to create one or more destination container(s). Your transfers may still succeed if the container already exists.
            INFO: Any empty folders will not be processed, because source and/or destination doesn't have full folder support

            Job 783f2177-8317-3e4b-7d2f-697a8f1ab63c has started
            Log file is located at: C:\Users\alkohli\.azcopy\783f2177-8317-3e4b-7d2f-697a8f1ab63c.log

            INFO: Destination could not accommodate the tier P10. Going ahead with the default tier. In case of service to service transfer, consider setting the flag --s2s-preserve-access-tier=false.
            100.0 %, 0 Done, 0 Failed, 1 Pending, 0 Skipped, 1 Total,


            Job 783f2177-8317-3e4b-7d2f-697a8f1ab63c summary
            Elapsed Time (Minutes): 1.4671
            Number of File Transfers: 1
            Number of Folder Property Transfers: 0
            Total Number of Transfers: 1
            Number of Transfers Completed: 1
            Number of Transfers Failed: 0
            Number of Transfers Skipped: 0
            TotalBytesTransferred: 136367309312
            Final Job Status: Completed

            PS C:\azcopy\azcopy_windows_amd64_10.10.0>
            ```
<!--1) I removed the verbose feedback. Doesn't provide any value, and the procedure is too long. 2) Show a picture of the VM in the Blob container for verification?-->

You can now use this VHD to create and deploy a VM on your Azure Stack Edge Pro device.
<!--STOPPED HERE - 05/21. Will update Linux steps when the Windows steps are complete.-->


## Create a Linux custom VM image

Do the following steps to create a Linux VM image.

1. Create a Linux Virtual Machine. For more information, go to [Tutorial: Create and manage Linux VMs with the Azure CLI](../virtual-machines/linux/tutorial-manage-vm.md).<!--Note Generation 1 with fixed VHD requirement here also.-->

1. Deprovision the VM. Use the Azure VM agent to delete machine-specific files and data. Use the `waagent` command with the `-deprovision+user` parameter on your source Linux VM. For more information, see [Understanding and using Azure Linux Agent](../virtual-machines/extensions/agent-linux.md).

    1. Connect to your Linux VM with an SSH client.
    2. In the SSH window, enter the following command:
       
        ```bash
        sudo waagent -deprovision+user
        ```
       > [!NOTE]
       > Only run this command on a VM that you'll capture as an image. This command does not guarantee that the image is cleared of all sensitive information or is suitable for redistribution. The `+user` parameter also removes the last provisioned user account. To keep user account credentials in the VM, use only `-deprovision`.
     
    3. Enter **y** to continue. You can add the `-force` parameter to avoid this confirmation step.
    4. After the command completes, enter **exit** to close the SSH client.  The VM will still be running at this point.


1. [Download existing OS disk](../virtual-machines/linux/download-vhd.md).

Use this VHD to now create and deploy a VM on your Azure Stack Edge Pro device. You can use the following two Azure Marketplace images to create Linux custom images:

|Item name  |Description  |Publisher  |
|---------|---------|---------|
|[Ubuntu Server](https://azuremarketplace.microsoft.com/marketplace/apps/canonical.ubuntuserver) |Ubuntu Server is the world's most popular Linux for cloud environments.|Canonical|
|[Debian 8 "Jessie"](https://azuremarketplace.microsoft.com/marketplace/apps/credativ.debian) |Debian GNU/Linux is one of the most popular Linux distributions.     |credativ|

For a full list of Azure Marketplace images that could work (presently not tested), go to [Azure Marketplace items available for Azure Stack Hub](/azure-stack/operator/azure-stack-marketplace-azure-items?view=azs-1910&preserve-view=true).


## Next steps

[Deploy VMs on your Azure Stack Edge Pro device](azure-stack-edge-gpu-deploy-virtual-machine-powershell.md).