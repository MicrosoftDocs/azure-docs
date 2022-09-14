---
title: Create custom VM images for your Azure Stack Edge Pro GPU device
description: Describes how to create custom Windows and Linux VM images for deploying virtual machines on Azure Stack Edge Pro GPU devices.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 08/09/2022
ms.author: alkohli
#Customer intent: As an IT admin, I need to understand how to create Azure VM images that I can use to deploy virtual machines on my Azure Stack Edge Pro GPU device.
---

# Create custom VM images for your Azure Stack Edge Pro GPU device

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

To deploy VMs on your Azure Stack Edge Pro GPU device, you need to be able to create custom VM images that you can use to create VMs in Azure. This article describes the steps to create custom VM images in Azure for Windows and Linux VMs and download or copy those images to an Azure Storage account.

There's a required workflow for preparing a custom VM image. For the image source, you need to use a fixed VHD from any size that Azure supports. For VM size options, see [Supported VM sizes](azure-stack-edge-gpu-virtual-machine-sizes.md#supported-vm-sizes).

## Prerequisites

Complete the following prerequisite before you create your VM image:

- [Download AzCopy](../storage/common/storage-use-azcopy-v10.md#download-azcopy). AzCopy gives you a fast way to copy an OS disk to an Azure Storage account.

---

## Create a custom VM image

The steps for preparing a custom VM image vary for a Windows or Linux VM.


### [Windows](#tab/windows)

Do the following steps to create a Windows VM image:

1. Create a Windows virtual machine in Azure. For portal instructions, see [Create a Windows virtual machine in the Azure portal](../virtual-machines/windows/quick-create-portal.md). For PowerShell instructions, see [Tutorial: Create and manage Windows VMs with Azure PowerShell](../virtual-machines/windows/tutorial-manage-vm.md).  

   The virtual machine can be a Generation 1 or Generation 2 VM. The OS disk that you use to create your VM image must be a fixed-size VHD of any size that Azure supports. For VM size options, see [Supported VM sizes](azure-stack-edge-gpu-virtual-machine-sizes.md#supported-vm-sizes).

   You can use any Windows Gen1 or Gen2 VM with a fixed-size VHD in Azure Marketplace. For a of list Azure Marketplace images that could work, see [Commonly used Azure Marketplace images for Azure Stack Edge](azure-stack-edge-gpu-create-virtual-machine-marketplace-image.md#commonly-used-marketplace-images).

2. Generalize the virtual machine. To generalize the VM, [connect to the virtual machine](azure-stack-edge-gpu-deploy-virtual-machine-powershell.md#connect-to-a-windows-vm), open a command prompt, and run the following `sysprep` command:

   ```dos
   c:\windows\system32\sysprep\sysprep.exe /oobe /generalize /shutdown /mode:vm
   ```

   > [!IMPORTANT]
   > After the command is complete, the VM will shut down. **Do not restart the VM.** Restarting the VM will corrupt the disk you just prepared.


### [Linux](#tab/linux)

Do the following steps to create a Linux VM image:

1. Create a Linux virtual machine in Azure. For portal instructions, see [Quickstart: Create a Linux VM in the Azure portal](../virtual-machines/linux/quick-create-portal.md).  For PowerShell instructions, see [Quickstart: Create a Linux VM in Azure with PowerShell](../virtual-machines/linux/quick-create-powershell.md).

   You can use any Gen1 or Gen2 VM with a fixed-size VHD in Azure Marketplace to create Linux custom images. This excludes Red Hat Enterprise Linux (RHEL) images, which require extra steps and can only be used to create a Gen1 VM image. For a list of Azure Marketplace images that could work, see [Commonly used Azure Marketplace images for Azure Stack Edge](azure-stack-edge-gpu-create-virtual-machine-marketplace-image.md#commonly-used-marketplace-images). For guidance on RHEL images, see [Using RHEL BYOS images](#using-rhel-byos-images), below.

1. Deprovision the VM. Use the Azure VM agent to delete machine-specific files and data. Use the `waagent` command with the `-deprovision+user` parameter on your source Linux VM. For more information, see [Understanding and using Azure Linux Agent](../virtual-machines/extensions/agent-linux.md).

    1. [Connect to your Linux VM with an SSH client](azure-stack-edge-gpu-deploy-virtual-machine-powershell.md#connect-to-a-linux-vm).
    2. In the SSH window, enter the following command:
       
        ```bash
        sudo waagent -deprovision+user
        ```
       > [!NOTE]
       > Only run this command on a VM that you'll capture as an image. This command does not guarantee that the image is cleared of all sensitive information or is suitable for redistribution. The `+user` parameter also removes the last provisioned user account. To keep user account credentials in the VM, use only `-deprovision`.
     
    3. Enter **y** to continue. You can add the `-force` parameter to avoid this confirmation step.
    4. After the command completes, enter **exit** to close the SSH client.  The VM will still be running at this point.


### Using RHEL BYOS images

If using Red Hat Enterprise Linux (RHEL) images, only the Red Hat Enterprise Linux Bring Your Own Subscription (RHEL BYOS) images, also known as the Red Hat gold images, are supported and can be used to create your VM image. The standard pay-as-you-go RHEL images on Azure Marketplace aren't supported on Azure Stack Edge.

To create a VM image using the RHEL BYOS image, follow these steps:

1. Sign in to [Red Hat Subscription Management](https://access.redhat.com/management). Navigate to the [Cloud Access Dashboard](https://access.redhat.com/management/cloud) from the top menu bar.
1. Enable your Azure subscription. See [detailed instructions](https://access.redhat.com/documentation/en-us/red_hat_subscription_management/1/html/red_hat_cloud_access_reference_guide/getting-started-with-ca_cloud-access). Enabling the subscription will allow you to access the Red Hat Gold Images.

1. Accept the Azure terms of use (only once per Azure Subscription, per image) and provision a VM. See [instructions](https://access.redhat.com/documentation/en-us/red_hat_subscription_management/1/html/red_hat_cloud_access_reference_guide/understanding-gold-images_cloud-access). 

You can now use the VM that you provisioned to [Create a VM custom image](#create-a-custom-vm-image) in Linux.

---

## Download OS disk to storage account

To use your custom VM image to deploy VMs on your device, you must download the OS disk to an Azure Storage account. We recommend that you use the same storage account that  you used for your device.

To download the OS disk for the VM to an Azure storage account, do the following steps:

1. [Stop the VM in the portal](../virtual-machines/windows/download-vhd.md#stop-the-vm). You need to do this to deallocate the OS disk even if your Windows VM was shut down after you ran `sysprep` to generalize it.

1. [Generate a download URL for the OS disk](../virtual-machines/windows/download-vhd.md#generate-download-url), and make a note of the URL. By default, the URL expires after 3600 seconds (1 hour). You can increase that time if needed.
      
1. Download the VHD to your Azure Storage account using one of these methods:
   
   - Method 1: For a faster transfer, use AzCopy to copy the VHD to your Azure Storage account. For instructions, see [Use AzCopy to copy VM image to storage account](#copy-vhd-to-storage-account-using-azcopy), below. 

   - Method 2: For a simple, one-click method, you can select **Download the VHD file** when you generate a download URL (in step 3b) to download the disk from the portal. **When you use this method, the disk copy can take quite a long time, and you'll need to [upload the VHD to your Azure storage account](azure-stack-edge-gpu-deploy-virtual-machine-templates.md#use-storage-explorer-for-upload) to be able to create VMs using the portal.**

You can now use this VHD to create and deploy VMs on your Azure Stack Edge Pro GPU device.

## Copy VHD to storage account using AzCopy

The following procedures describe how to use AzCopy to copy a custom VM image to an Azure Storage account so you can use the image to deploy VMs on your Azure Stack Edge Pro GPU device. We recommend that you store your custom VM images in any existing storage account that you're using which is in the same region/subscription as Azure Stack Edge.


### Create target URI for a container

AzCopy requires a *target URI* that tells where to copy the new image to in your storage account. Before you run AzCopy, you'll generate a shared-access signature (SAS) URL for the blob container you want to copy the file to. To create the target URI, you'll add the filename to the SAS URL.

To create the target URI for your prepared VHD, do the following steps:

1. Generate a SAS URL for a container in an Azure Storage account, do the following steps:

   1. In the Azure portal, open the storage account, and select **Containers**. Select and then right-click the blob container you want to use, and select **Generate SAS**.

      ![Screenshot of the Generate SAS option for a blob container in the Azure portal](./media/azure-stack-edge-gpu-create-virtual-machine-image/storage-container-generate-sas-option.png)

   1. On the **Generate SAS** screen, select **Read** and **Write** in **Permissions**.  

      ![Screenshot of the Generate SAS screen with Read and Write permissions selected](./media/azure-stack-edge-gpu-create-virtual-machine-image/generate-sas-screen-read-and-write-permissions.png)

   1. Select **Generate SAS token and URL**, and then select **Copy** to copy the **Blob SAS URL**.

      ![Screenshot of the Generate SAS screen, with options for generating and copying a Blob SAS URL](./media/azure-stack-edge-gpu-create-virtual-machine-image/generate-sas-screen-copy-blob-sas-url.png)

1. To create the target URI for the `azcopy` command, add the desired filename to the SAS URL.

   The Blob SAS URL has the following format. 

   ![Graphic of a Blob SAS URL, with container path and place to insert the new filename labeled](./media/azure-stack-edge-gpu-create-virtual-machine-image/blob-sas-url-format.png)

   Insert the filename, in the format `/<filename>.vhd` before the question mark that begins the query string. The filename extension must be VHD. 

   For example, the following Blob SAS URL will copy the **osdisk.vhd** file to the **virtualmachines** blob container in **mystorageaccount**.

   ![Graphic of a Blob SAS URL example for a VHD named osdisk](./media/azure-stack-edge-gpu-create-virtual-machine-image/target-uri-example-based-on-blob-sas-url.png)


### Copy VHD to blob container

To copy your VHD to a blob container using AzCopy, do the following steps:

 1. [Download AZCopy](../storage/common/storage-use-azcopy-v10.md#download-azcopy) if you haven't done that already.
 
 1. In PowerShell, navigate to the directory where you stored azcopy.exe, and run the following command:

    `.\azcopy copy <source URI> <target URI> --recursive`

    where:
    * `<source URI>` is the download URL that you generated earlier.
    * `<target URI>` tells which blob container to copy the new image to in your Azure Storage account. For instructions, see [Use AzCopy to copy VM image to storage account](#copy-vhd-to-storage-account-using-azcopy).

    For example, the following URI will copy a file named **windowsosdisk.vhd** to the **virtual machines** blob container in the **mystorageaccount** storage account:

    ```azcopy 
    .\azcopy copy "https://md-h1rvdq3wwtdp.z24.blob.storage.azure.net/gxs3kpbgjhkr/abcd?sv=2018-03-28&sr=b&si=f86003fc-a231-43b0-baf2-61dd51e3a05a&sig=o5Rj%2BNZSook%2FVNMcuCcwEwsr0i7sy%2F7gIDzak6JhlKg%3D" "https://mystorageaccount.blob.core.windows.net/virtualmachines/osdisk.vhd?sp=rw&st=2021-05-21T16:52:24Z&se=2021-05-22T00:52:24Z&spr=https&sv=2020-02-10&sr=c&sig=PV3Q3zpaQ%2FOLidbQJDKlW9nK%2BJ7PkzYv2Eczxko5k%2Bg%3D" --recursive
    ```

#### Sample output

For the example AzCopy command above, the following output indicates a successful copy was completed.

   ```output
   PS C:\azcopy\azcopy_windows_amd64_10.10.0> .\azcopy copy "https://md-h1rvdq3wwtdp.z24.blob.storage.azure.net/gxs3kpbgjhkr/abcd?sv=2018-03-28&sr=b&si=f86003fc-a231-43b0-baf2-61dd51e3a05a&sig=o5Rj%2BNZSook%2FVNMcuCcwEwsr0i7sy%2F7gIDzak6JhlKg%3D" "https://mystorageaccount.blob.core.windows.net/virtualmachines/osdisk.vhd?sp=rw&st=2021-05-21T16:52:24Z&se=2021-05-22T00:52:24Z&spr=https&sv=2020-02-10&sr=c&sig=PV3Q3zpaQ%2FOLidbQJDKlW9nK%2BJ7PkzYv2Eczxko5k%2Bg%3D" --recursive
   INFO: Scanning...
   INFO: Failed to create one or more destination container(s). Your transfers may still succeed if the container already exists.
   INFO: Any empty folders will not be processed, because source and/or destination doesn't have full folder support

   Job 783f2177-8317-3e4b-7d2f-697a8f1ab63c has started
   Log file is located at: C:\Users\aseuser\.azcopy\783f2177-8317-3e4b-7d2f-697a8f1ab63c.log

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

## Next steps

- [Deploy VMs on your device using the Azure portal](azure-stack-edge-gpu-deploy-virtual-machine-portal.md)
- [Deploy VMs on your device via PowerShell](azure-stack-edge-gpu-deploy-virtual-machine-powershell.md)