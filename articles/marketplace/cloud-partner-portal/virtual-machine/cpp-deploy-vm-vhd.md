---
title: Deploy a VM from your VHDs for the Azure Marketplace | Microsoft Docs
description: Explains how to register a VM from an Azure-deployed VHD.
services: Azure, Marketplace, Cloud Partner Portal, 
documentationcenter:
author: pbutlerm
manager: Patrick.Butler  
editor:

ms.assetid: 
ms.service: marketplace
ms.workload: 
ms.tgt_pltfrm: 
ms.devlang: 
ms.topic: article
ms.date: 10/19/2018
ms.author: pbutlerm
---

# Deploy a VM from your VHDs

This article explains how to register a virtual machine (VM) from an Azure-deployed virtual hard disk (VHD).  It lists the tools required, and how to use them to create a user VM image, then deploy it to Azure using either the [Microsoft Azure portal](https://ms.portal.azure.com/) or PowerShell scripts. 

After you have uploaded your virtual hard disks (VHDs)—the generalized operating system VHD and zero or more data disk VHDs—to your Azure storage account, you can register them as a user VM image. Then you can test that image. Because your operating system VHD is generalized, you cannot directly deploy the VM by providing the VHD URL.

To learn more about VM images, see the following blog posts:

- [VM Image](https://azure.microsoft.com/blog/vm-image-blog-post/)
- [VM Image PowerShell 'How To'](https://azure.microsoft.com/blog/vm-image-powershell-how-to-blog-post/)


## Set up the necessary tools

If you have not already done so, install Azure PowerShell and the Azure CLI, using the following instructions:

<!-- TD: Change the following URLs (in this entire topic) to relative paths.-->

- [Install Azure PowerShell on Windows with PowerShellGet](https://docs.microsoft.com/powershell/azure/install-azurerm-ps)
- [Install Azure CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli)


## Create a user VM image

Next, you will create an unmanaged image from your generalized VHD.

#### Capture the VM image

Use the instructions in the following article on capturing the VM that corresponds to your access approach:

-  PowerShell: [How to create an unmanaged VM image from an Azure VM](../../../virtual-machines/windows/capture-image-resource.md)
-  Azure CLI: [How to create an image of a virtual machine or VHD](../../../virtual-machines/linux/capture-image.md)
-  API: [Virtual Machines - Capture](https://docs.microsoft.com/rest/api/compute/virtualmachines/capture)

### Generalize the VM image

Because you have generated the user image from a previously generalized VHD, it should also be generalized.  Again, select the following article that corresponds to your access mechanism.  (You may have already generalized your disk when you captured it.)

-  PowerShell: [Generalize the VM](https://docs.microsoft.com/azure/virtual-machines/windows/sa-copy-generalized#generalize-the-vm)
-  Azure CLI: [Step 2: Create VM image](https://docs.microsoft.com/azure/virtual-machines/linux/capture-image#step-2-create-vm-image)
-  API: [Virtual Machines - Generalize](https://docs.microsoft.com/rest/api/compute/virtualmachines/generalize)


## Deploy a VM from a user VM image

Next, you will deploy a VM from a user VM image, using either Azure portal or PowerShell.

<!-- TD: Recapture following hilited images and replace with red-box. -->

### Deploy a VM from Azure portal

Use the following process to deploy your user VM from the Azure portal.

1.  Sign into the [Azure portal](https://portal.azure.com).

2.  Click **New** and search for **Template Deployment**, then select **Build your own template in Editor**.  <br/>
  ![Build VHD deployment template in Azure portal](./media/publishvm_021.png)

3. Copy and paste this [JSON template](./cpp-deploy-json-template.md) into the editor and click **Save**. <br/>
  ![Save VHD deployment template in Azure portal](./media/publishvm_022.png)

4. Provide the parameter values for the displayed **Custom deployment** property pages.

   <table> <tr> <td valign="top"> <img src="./media/publishvm_023.png" alt="Custom deployment property page 1"> </td> <td valign="top"> <img src="./media/publishvm_024.png" alt="Custom deployment property page 2"> </td> </tr> </table> <br/> 

   |  **Parameter**              |   **Description**                                                            |
   |  -------------              |   ---------------                                                            |
   | User Storage Account Name   | Storage account name where the generalized VHD is located                    |
   | User Storage Container Name | Container name where the generalized VHD is located                          |
   | DNS Name for Public IP      | Public IP DNS name                                                           |
   | Admin User Name             | Administrator account's username for new VM                                  |
   | Admin Password              | Administrator account's password for new VM                                  |
   | OS Type                     | VM operating system: `Windows` \| `Linux`                                    |
   | Subscription ID             | Identifier of the selected subscription                                      |
   | Location                    | Geographic location of the deployment                                        |
   | VM Size                     | [Azure VM size](https://docs.microsoft.com/azure/virtual-machines/windows/sizes), for example `Standard_A2` |
   | Public IP Address Name      | Name of your public IP address                                               |
   | VM Name                     | Name of the new VM                                                           |
   | Virtual Network Name        | Name of the virtual network used by the VM                                   |
   | NIC Name                    | Name of the network interface card running the virtual network               |
   | VHD URL                     | Complete OS Disk VHD URL                                                     |
   |  |  |
            
5. After you supply these values, click **Purchase**. 

Azure will begin deployment: it creates a new VM with the specified unmanaged VHD, in the specified storage account path.  You can track the progress in the Azure portal by clicking on **Virtual Machines** on the left-hand side of the portal.  When the VM has been created, the status will change from `Starting` to `Running`. 


### Deploy a VM from PowerShell

To deploy a large VM from the generalized VM image just created, use the following cmdlets.

``` powershell
    $img = Get-AzureVMImage -ImageName "myVMImage"
    $user = "user123"
    $pass = "adminPassword123"
    $myVM = New-AzureVMConfig -Name "VMImageVM" -InstanceSize "Large" -ImageName $img.ImageName | Add-AzureProvisioningConfig -Windows -AdminUsername $user -Password $pass
    New-AzureVM -ServiceName "VMImageCloudService" -VMs $myVM -Location "West US" -WaitForBoot
```

<!-- TD: The following is a marketplace-publishing article and may be out-of-date.  TD: update and move topic.
For help with issues, see [Troubleshooting common issues encountered during VHD creation](https://docs.microsoft.com/azure/marketplace-publishing/marketplace-publishing-vm-image-creation-troubleshooting) for additional assistance.
-->

## Next steps

After your VM is deployed, you are ready to [configure the VM](./cpp-configure-vm.md).
