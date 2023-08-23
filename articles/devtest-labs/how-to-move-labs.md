---
title: Move DevTest Labs to another region
description: Shows you how to move a lab to another region.
ms.topic: how-to
ms.custom: devx-track-azurepowershell, UpdateFrequency2
ms.author: rosemalcolm
author: RoseHJM
ms.date: 03/03/2022
---

# Move DevTest Labs to another region

To move a lab, create a copy of an existing lab in another region.

In this article, you learn how to:
> [!div class="checklist"]
> >
> - Export an Azure Resource Manager (ARM) template of your lab.
> - Modify the template by adding or updating the target region and other parameters.
> - Deploy the template to create the new lab in the target region.
> - Configure the new lab.
> - Move data to the new  lab.
> - Delete the resources in the source region.

## Prerequisites

- Ensure that the services and features that your account uses are supported in the target region.

- For preview features, ensure that your subscription is allowlisted for the target region.

- DevTest Labs doesn't store or expose passwords from the exported ARM template. You need to know the passwords/secrets for:

  - the VMs
  - the Stored Secrets
  - PAT tokens of the private Artifact Repos to move the private repos together with the lab.

## Prepare to move

To get started, export and modify a Resource Manager template.

### Prepare your Virtual Network

1. Sign in to the [Azure portal](https://portal.azure.com).

1. If you don't have [Resource Group](../azure-resource-manager/management/manage-resource-groups-portal.md#create-resource-groups) under the target region, create one now.

1. Move your current Virtual Network to the new region and resource group using the steps included in the article, "[Move an Azure virtual network to another region](../virtual-network/move-across-regions-vnet-portal.md)".

   Alternately, you can create a new virtual network, if you don't have to keep the original one.

### Export an ARM template of your lab.

Next, you export a JSON template contains settings that describe your lab.

To export a template by using Azure portal:

1. Select **All resources**, and then select the resource group for the lab.

1. Select **Export template**.

1. Choose **Download** in **Export template**.

1. Locate the .zip file that you downloaded from the portal, and unzip that file to a folder of your choice.

   This zip file contains the .json files that comprise the template and scripts to deploy the template. It contains all the resources under your lab listed in ARM template format, except for the Shared Image Gallery resources.

### Modify the template

In order for the ARM template to deploy correctly in the new region, you must change a few parts of the template.

To update the template by using Azure portal:

1. In the Azure portal, select **Create a resource**.

1. In **Search the Marketplace**, type **template deployment**, and then press **ENTER**.

1. Select **Template deployment**.

   ![Azure Resource Manager templates library](../storage/common/media/storage-account-move/azure-resource-manager-template-library.png)

1. Select **Create**.

1. Select **Build your own template in the editor**.

1. Select **Load file**, and then follow the instructions to load the **template.json** file that you downloaded in the last section.

1. In the editor, make the following changes to the **template.json** file:

   1. Replace the original `location` with the new region in which you want to deploy, such as `westus2`, `southeastasia`, etc. To obtain region location codes, see [Azure Locations](https://azure.microsoft.com/global-infrastructure/locations/).  The code for a region is the region name with no spaces, **Central US** = `centralus`.

      ```json
      "variables": {},
      "resources": [
        {
          "type": "microsoft.devtestlab/labs",
          "location": "centralus",
      ```

   1. If you have "All virtual machines in one resource group" set in the "Lab settings", also update the following values in the ARM template:

      + Update the `apiVersion` of the `microsoft.devtestlab/labs` resource to `2018-10-15-preview`.
      + Add `vmCreationResourceGroupId` to the `properties` section.

      ```json
      "variables": {},
      "resources": [
        {
          "type": "microsoft.devtestlab/labs",
          "apiVersion": "2018-10-15-preview",
          "name": "[parameters('labs_lj_dtl_rgsettings_name')]",
          "location": "<regionName>",
          "properties": {
            "vmCreationResourceGroupId": "/subscriptions/<subscriptionID>/resourceGroups/<myResourceGroup>",
            "labStorageType": "Premium",
      ```

   1. Find the `"type": "microsoft.devtestlab/labs/users"` resource. There, remove the entire `secretStore` section, including the `keyVaultld` and the `keyVaultUri` parameters.

      ```json
      secretStore": {
        "keyVaultUri": "<vaultvalue>"
        "keyVaultld": "<id>"
      }
      ```

   1. Find the `"type": "microsoft.devtestlab/labs/virtualnetworks"` resource. If you created a new virtual network earlier in these steps, you must add the actual subnet name in `/subnets/[SUBNET_NAME]`. If you chose to move the Vnet to a new region, you should skip this step.

   1. Find the `"type": "microsoft.devtestlab/labs/virtualmachines"` resource.

      1. Under the "properties", add `"password": "RANDOM_PASSWORD"`

         > [!Note]
         > A "password" property is required to create a new VM. We input a random password because we will later be swapping the OS disk with the original VM.

      1. For Shared IP virtual machines, add this snippet under the "properties.networkInterface",

         Windows VM with RDP:

         ```
         "networkInterface": {
           "sharedPublicIpAddressConfiguration": {
             "inboundNatRules": [
               {
                 "transportProtocol": "tcp",
                 "backendPort": 3389
               }
             ]
           }
         }
         ```

         Linux VM with SSH:

         ```
          "networkInterface": {
             "sharedPublicIpAddressConfiguration": {
               "inboundNatRules": [
                 {
                   "transportProtocol": "tcp",
                   "backendPort": 22
                 }
               ]
             }
           }
         ```

   1. Under the `microsoft.devtestlab/labs/users/secrets` resources, the following parameter the "properties". Replace `YOUR_STORED_PASSWORD` with your password.

      > [!IMPORTANT]
      > Use secureString for password values.
      ```json
      "value": "YOUR_STORED_PASSWORD"
      ```

   1. Under the `microsoft.devtestlab/labs/artifactsources` resources, the following parameter the "properties". Replace `YOUR_STORED_PASSWORD` with your password. Again, use secureString for password values.

      ```json
      "securityToken": "YOUR_PAT_TOKEN_VALUE"
      ```

   1. In the editor, save the template.

## Deploy to move

Deploy the template to create a new lab in the target region.

1. In the **Custom deployment** page, update all the parameters with the corresponding values defined in the template.

1. Enter the following values:

   |Name|Value|
   |----|----|
   |**Subscription**|Select an Azure subscription.|
   |**Resource group**|Select the resource group name you created in the last section. |
   |**Location**|Select a location for the lab. For example, **Central US**. |
   |**Lab Name**|Must be a different name. |
   |**Vnet ID**|Must be the moved one, or the new one you created. |


1. Select **Review + create**.

1. Select **Create**.

1. Select the bell icon (notifications) from the top of the screen to see the deployment status. You shall see **Deployment in progress**. Wait until the deployment is completed.

### Configure the new lab

While most Lab resources have been replicated under the new region using the ARM template, a few edits still need to be moved manually.

1. Add the Compute Gallery back to the lab if there are any in the original one.
1. Add the policies "Virtual machines per user", "Virtual machines per lab" and "Allowed Virtual machine sizes" back to the moved lab

### Swap the OS disks of the Compute VMs under the new VMs.

Note the VMs under the new Lab have the same specs as the ones under the old Lab. The only difference is their OS Disks.

1. Create an empty disk under the new region.

   - Get the target Compute VM OS disk name under the new Lab.  You can find the Compute VM and its disk under the Resource group on the lab's Virtual Machine page.

   - Use [AzCopy](../storage/common/storage-use-azcopy-v10.md) to copy the old disk content into the new/empty disks in the new region. You can run the PowerShell commands from your Dev Box or from the [Azure Cloud Shell](/azure/cloud-shell/quickstart?tabs=powershell).

     AzCopy is the preferred tool to move your data over. It's optimized for performance.  One way that it's faster, is that data is copied directly, so AzCopy doesn't use the network bandwidth of your computer. Use AzCopy at the command line or as part of a custom script. See [Get started with AzCopy](../storage/common/storage-use-azcopy-v10.md).

     ```powershell
     # Fill in the source/target disk names and their resource group names
     $sourceDiskName = "SOURCE_DISK"
     $sourceRG = "SOURCE_RG"
     $targetDiskName = "TARGET_DISK"
     $targetRG = "TARGET_RG"
     $targetRegion = "TARGET_LOCATION"

     # Create an empty target disk from the source disk
     $sourceDisk = Get-AzDisk -ResourceGroupName $sourceRG -DiskName $sourceDiskName
     $targetDiskconfig = New-AzDiskConfig -SkuName $sourceDisk.Sku.Name -UploadSizeInBytes $($sourceDisk.DiskSizeBytes+512) -Location $targetRegion -OsType $sourceDisk.OsType -CreateOption 'Upload'
     $targetDisk = New-AzDisk -ResourceGroupName $targetRG -DiskName $targetDiskName -Disk $targetDiskconfig

     # Copy the disk content from source to target
     $sourceDiskSas = Grant-AzDiskAccess -ResourceGroupName $sourceRG -DiskName $sourceDiskName -DurationInSecond 1800 -Access 'Read'
     $targetDiskSas = Grant-AzDiskAccess -ResourceGroupName $targetRG -DiskName $targetDiskName -DurationInSecond 1800 -Access 'Write'
     azcopy copy $sourceDiskSas.AccessSAS $targetDiskSas.AccessSAS --blob-type PageBlob
     Revoke-AzDiskAccess -ResourceGroupName $sourceRG -DiskName $sourceDiskName
     Revoke-AzDiskAccess -ResourceGroupName $targetRG -DiskName $targetDiskName
     ```

     After that, you'll have a new disk under the new region.

   1. Swap the OS disk of the Compute VM under the new lab with the new disk. To learn how, see the article, "[Change the OS disk used by an Azure VM using PowerShell](../virtual-machines/windows/os-disk-swap.md)".

## Discard or clean up

After the deployment, if you want to start over, you can delete the target lab, and repeat the steps described in the [Prepare](#prepare-to-move) and [Move](#deploy-to-move) sections of this article.

To commit the changes and complete the move, you must delete the original lab.

To remove a lab by using the Azure portal:

1. In the Azure portal, expand the menu on the left side to open the menu of services, and choose **DevTest Labs** to display the list of labs.

1. Locate the target lab to delete, and right-click the **More** button (**...**) on the right side of the listing.

1. Select **Delete**, and confirm.

## Next steps

In this article, you moved DevTest Labs from one region to another and cleaned up the source resources.  To learn more about moving resources between regions and disaster recovery in Azure, refer to:

- [Move resources to a new resource group or subscription](../azure-resource-manager/management/move-resource-group-and-subscription.md)
- [Move Azure VMs to another region](../site-recovery/azure-to-azure-tutorial-migrate.md)
- [Move Microsoft.DevtestLab/schedules to another region](./how-to-move-schedule-to-new-region.md)
