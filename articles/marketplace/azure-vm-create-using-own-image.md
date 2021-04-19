---
title: Create an Azure virtual machine offer on Azure Marketplace using your own image
description: Learn how to publish a virtual machine offer to Azure Marketplace using your own image.
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
author: krsh
ms.author: krsh
ms.date: 04/16/2021
---

# How to create a virtual machine using your own image

This article describes how to create and deploy a user-provided virtual machine (VM) image.

> [!NOTE]
> Before you start this procedure, review the [technical requirements](marketplace-virtual-machines.md#technical-requirements) for Azure VM offers, including virtual hard disk (VHD) requirements.

To use an approved base image instead, follow the instructions in [Create a VM image from an approved base](azure-vm-create-using-approved-base.md).

## Configure the VM

This section describes how to size, update, and generalize an Azure VM. These steps are necessary to prepare your VM to be deployed on Azure Marketplace.

### Size the VHDs

[!INCLUDE [Discussion of VHD sizing](includes/vhd-size.md)]

### Install the most current updates

[!INCLUDE [Discussion of most current updates](includes/most-current-updates.md)]

### Perform more security checks

[!INCLUDE [Discussion of addition security checks](includes/additional-security-checks.md)]

### Perform custom configuration and scheduled tasks

[!INCLUDE [Discussion of custom configuration and scheduled tasks](includes/custom-config.md)]

### Generalize the image

All images in the Azure Marketplace must be reusable in a generic fashion. To achieve this, the operating system VHD must be generalized, an operation that removes all instance-specific identifiers and software drivers from a VM.

## Bring your image into Azure

> [!NOTE]
> The Azure subscription containing the SIG must be under the same tenant as the publisher account in order to publish. Also, the publisher account must have at least Contributor access to the subscription containing SIG.

There are three ways to bring your image into Azure:

1. Upload the vhd to a Shared Image Gallery (SIG).
1. Upload the vhd to an Azure storage account.
1. Extract the vhd from a Managed Image (if using image building services).

The following three sections describe these options.

### Option 1: Upload the VHD as Shared Image Gallery

1. Upload vhd(s) to Storage Account.
2. On the Azure portal, search for **Deploy a custom template**.
3. Select **Build your own template in the editor**.
4. Copy the following Azure Resource Manager (ARM) template.

    ```json
    {
      "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
      "contentVersion": "1.0.0.0",
      "parameters": {
        "sourceStorageAccountResourceId": {
          "type": "string",
          "metadata": {
            "description": "Resource ID of the source storage account that the blob vhd resides in."
          }
        },
        "sourceBlobUri": {
          "type": "string",
          "metadata": {
            "description": "Blob Uri of the vhd blob (must be in the storage account provided.)"
          }
        },
        "sourceBlobDataDisk0Uri": {
          "type": "string",
          "metadata": {
            "description": "Blob Uri of the vhd blob (must be in the storage account provided.)"
          }
        },
        "sourceBlobDataDisk1Uri": {
          "type": "string",
          "metadata": {
            "description": "Blob Uri of the vhd blob (must be in the storage account provided.)"
          }
        },
        "galleryName": {
          "type": "string",
          "metadata": {
            "description": "Name of the Shared Image Gallery."
          }
        },
        "galleryImageDefinitionName": {
          "type": "string",
          "metadata": {
            "description": "Name of the Image Definition."
          }
        },
        "galleryImageVersionName": {
          "type": "string",
          "metadata": {
            "description": "Name of the Image Version - should follow <MajorVersion>.<MinorVersion>.<Patch>."
          }
        }
      },
      "resources": [
        {
          "type": "Microsoft.Compute/galleries/images/versions",
          "name": "[concat(parameters('galleryName'), '/', parameters('galleryImageDefinitionName'), '/', parameters('galleryImageVersionName'))]",
          "apiVersion": "2020-09-30",
          "location": "[resourceGroup().location]",
          "properties": {
            "storageProfile": {
              "osDiskImage": {
                "source": {
                  "id": "[parameters('sourceStorageAccountResourceId')]",
                  "uri": "[parameters('sourceBlobUri')]"
                }
              },
    
              "dataDiskImages": [
                {
                  "lun": 0,
                  "source": {
                    "id": "[parameters('sourceStorageAccountResourceId')]",
                    "uri": "[parameters('sourceBlobDataDisk0Uri')]"
                  }
                },
                {
                  "lun": 1,
                  "source": {
                    "id": "[parameters('sourceStorageAccountResourceId')]",
                    "uri": "[parameters('sourceBlobDataDisk1Uri')]"
                  }
                }
              ]
            }
          }
        }
      ]
    }
    
    ```

5. Paste the template into the editor.

    :::image type="content" source="media/create-vm/vm-sample-code-screen.png" alt-text="Sample code screen for VM.":::

1. Select **Save**.
1. Use the parameters in this table to complete the fields in the screen that follows.

| Parameters | Description |
| --- | --- |
| sourceStorageAccountResourceId | Resource ID of the source storage account in which the blob vhd resides.<br><br>To get the Resource ID, go to your **Storage Account** on **Azure portal**, go to **Properties**, and copy the **ResourceID** value. |
| sourceBlobUri | Blob Uri of the OS disk vhd blob (must be in the storage account provided).<br><br>To get the blob URL, go to your **Storage Account** on **Azure portal**, go to your **blob**, and copy the **URL** value. |
| sourceBlobDataDisk0Uri | Blob Uri of the data disk vhd blob (must be in the storage account provided). If you don't have a data disk, remove this parameter from the template.<br><br>To get the blob URL, go to your **Storage Account** on **Azure portal**, go to your **blob**, and copy the **URL** value. |
| sourceBlobDataDisk1Uri | Blob Uri of additional data disk vhd blob (must be in the storage account provided). If you don't have additional data disk, remove this parameter from the template.<br><br>To get the blob URL, go to your **Storage Account** on **Azure portal**, go to your **blob**, and copy the **URL** value. |
| galleryName | Name of the Shared Image Gallery |
| galleryImageDefinitionName | Name of the Image Definition |
| galleryImageVersionName | Name of the Image Version to be created, in this format: `<MajorVersion>.<MinorVersion>.<Patch>` |
|

:::image type="content" source="media/create-vm/custom-deployment-window.png" alt-text="Shows the custom deployment window.":::

8. Select **Review + create**. Once validation finishes, select **Create**.

> [!TIP]
> Publisher account must have “Owner” access to publish the SIG Image. If required, follow the below steps to grant access:
>
> 1. Go to the Shared Image Gallery (SIG).
> 2. Select **Access control** (IAM) on the left panel.
> 3. Select **Add**, then **Add role assignment**.
> 4. For **Role**, select **Owner**.
> 5. For **Assign access to**, select **User, group, or service principal**.
> 6. Enter the Azure email of the person who will publish the image.
> 7. Select **Save**.<br><br>
> :::image type="content" source="media/create-vm/add-role-assignment.png" alt-text="The add role assignment window is shown.":::

### Option 2: Upload the VHD to a Storage Account

Configure and prepare the VM to be uploaded as described in [Prepare a Windows VHD or VHDX to upload to Azure](../virtual-machines/windows/prepare-for-upload-vhd-image.md) or [Create and Upload a Linux VHD](../virtual-machines/linux/create-upload-generic.md).

### Option 3: Extract the VHD from Managed Image (if using image building services)

If you are using an image building service like [Packer](https://www.packer.io/), you may need to extract the VHD from the image. There is no direct way to do this. You will have to create a VM and extract the VHD from the VM disk.

## Create the VM on the Azure portal

Follow these steps to create the base VM image on the [Azure portal](https://ms.portal.azure.com/).

1. Sign in to the [Azure portal](https://ms.portal.azure.com/).
2. Select **Virtual machines**.
3. Select **+ Add** to open the **Create a virtual machine** screen.
4. Select the image from the dropdown list or select **Browse all public and private images** to search or browse all available virtual machine images.
5. To create a **Gen 2** VM, go to the **Advanced** tab and select the **Gen 2** option.

    :::image type="content" source="media/create-vm/vm-gen-option.png" alt-text="Select Gen 1 or Gen 2.":::

6. Select the size of the VM to deploy.

    :::image type="content" source="media/create-vm/create-virtual-machine-sizes.png" alt-text="Select a recommended VM size for the selected image.":::

7. Provide the other required details to create the VM.
8. Select **Review + create** to review your choices. When the **Validation passed** message appears, select **Create**.

Azure begins provisioning the virtual machine you specified. Track its progress by selecting the **Virtual Machines** tab in the left menu. After it's created the status of Virtual Machine changes to **Running**.

## Connect to your VM

Refer to the following documentation to connect to your [Windows](../virtual-machines/windows/connect-logon.md) or [Linux](../virtual-machines/linux/ssh-from-windows.md#connect-to-your-vm) VM.

[!INCLUDE [Discussion of addition security checks](includes/size-connect-generalize.md)]

## Next steps

- [Test your VM image](azure-vm-image-test.md) to ensure it meets Azure Marketplace publishing requirements. This is optional.
- If you don't want to test your VM image, sign in to [Partner Center](https://partner.microsoft.com/) and publish the SIG Image (option #1).
- If you followed option #2 or #3, [Generate the SAS URI](azure-vm-get-sas-uri.md).
- If you encountered difficulty creating your new Azure-based VHD, see [VM FAQ for Azure Marketplace](azure-vm-create-faq.md).
