---
title: Create an Azure AMD-based confidential VM with ARM template (preview) 
description: Learn how to quickly create and deploy an AMD-based DCasv5 or ECasv5 series Azure confidential virtual machine (confidential VM) using an ARM template.
author: lakmeedee
ms.author: dejv
ms.service: virtual-machines
ms.subservice: confidential-computing
ms.workload: infrastructure
ms.topic: quickstart
ms.date: 6/28/2022
ms.custom: mode-arm, devx-track-azurecli 
ms.devlang: azurecli
---

# Quickstart: Deploy confidential VM from an Azure Compute Gallery Image

## Security Type on Image Definition: ConfidentialVM

This security type should be used when the source of the image is a Confidential VM, a managed disk or a managed disk snapshot.
The source already has the VM Guest state information and the resulting image can only be used to create Confidential VMs.

### [Portal](#tab/portal)

1.	Sign in to the [portal](https://portal.azure.com)
2.	To create an Azure Compute Gallery Image from a VM, open an existing Confidential VM and select **Capture**.
3.	In the Create an Image page that follows, allow the image to be shared to the gallery as a VM image version. Managed Images are not supported for Confidential VM.
4.	Create a new target Azure Compute Gallery or select an existing gallery.
5.	Select the **Operating system state** as either **Generalized** or **Specialized**. If you want to create a generalized image, ensure that you [generalize the VM to remove machine specific information](https://docs.microsoft.com/azure/virtual-machines/generalize) before selecting this option. 
    > [!NOTE]
    > A Windows based Confidential VM with confidential OS disk encryption cannot be generalized.
7.	Create a new image definition by providing a name, publisher, offer and SKU details. The Security Type of the image definition is already set to ‘Confidential’.
8.	Provide a version number for the image version. 
9.	Under **Replication**, modify the replica count, if required.
    > [!NOTE]
    > Currently, the image cannot be replicated to a region different from the source
11.	At the bottom of the **Create an Image** page, select **Review + Create** and when validation shows as passed, select **Create**.
12.	Once the image version is created, go to the image version directly. Alternatively, you can navigate to the required image version through the image definition. Here, you can check the Confidential Compute encryption type and ensure that it matches with that of the source VM.
13.	On the VM image version page, select the **+ Create VM** to land on the Create a virtual machine page.
14.	In the Create a virtual machine page, under **Resource group**, select **Create new** and type a name for your resource group or select an existing resource group from the dropdown.
15.	Under Instance details, type a name for the virtual machine name and choose a region that supports Confidential virtual machines.
    > [!NOTE]
    > Confidential VMs are not available in all locations. For currently supported locations, see which [VM products are available by Azure region](https://azure.microsoft.com/global-infrastructure/services/?products=virtual-machines).
16.	The image and the security type are already populated based on the selected image version. 
17.	**vTPM** is always turned ON while Secure Boot can be turned ON by using **Configure security** features. If confidential compute encryption with platform managed key or customer managed key is used to encrypt the OS disk, Secure Boot is required and will also be turned ON.
18.	Under **Disks**, note that the Confidential compute encryption type and the disk encryption set (in case customer managed keys are used) are populated based on the image version created.D
19.	Fill in the **Administrator account** information and then **Inbound port rules**.
20.	At the bottom of the page, select **Review + Create**
21.	On the **Create a virtual machine** page, you can see the details about the VM you are about to deploy. Once validation shows as passed, select **Create**.

In case you want to use either a managed disk or a managed disk snapshot as a source of the image version (instead of a VM itself), then use the following steps

1.	Sign in to the [portal](https://portal.azure.com)
2.	Search for **VM Image Versions** and select **Create**
3.	Provide the subscription, resource group, region and image version number
4.	Select the source as **Disks and/or Snapshots**
5.	Select the OS disk as a managed disk or a managed disk snapshot from the dropdown list
6.	Select a **Target Azure Compute Gallery** to create and share the image. If no gallery exists, create a new gallery.
7.	Select the **Operating system state** as either **Generalized** or **Specialized**. If you want to create a generalized image, ensure that you generalize the disk or snapshot to remove machine specific information.
8.	For the **Target VM Image Definition** select Create new. In the window that opens, select an image definition name and ensure that the **Security type** is set to **Confidential**. Provide the publisher, offer and SKU information and select **OK**.
9.	In the **Replication** tab, you can modify the default replica count
    > [!NOTE]
    > Currently, the image cannot be replicated to a region different from the source
11.	In the **Encryption tab**, note that the **Confidential compute encryption type** matches with that of the source disk or snapshot.
12.	Select **Create** in the **Review + create** tab to create the image
13.	Once the image version is successfully created, select the **+ Create VM** to land on the Create a virtual machine page.
14.	The rest of the steps around creating a Confidential VM from this image version are similar to those provided earlier

### [CLI](#tab/cli)

Make sure you are running the latest version of Azure CLI 

Sign in to Azure using `az login`.  

```azurecli-interactive
az login 
```

Create an image definition with ConfidentialVM security type and set the OS state to be Generalized

```azurecli-interactive
az sig image-definition create --resource-group MyResourceGroup --location westus \ 
--gallery-name MyGallery --gallery-image-definition MyCVMImageDef \ 
--publisher CVMPublisher --offer CVMOffer --sku CVMSku \ 
--os-type Linux --os-state Generalized \ 
--hyper-v-generation V2 \ 
--features SecurityType=ConfidentialVM
```
To create an image version, we can capture a Linux Confidential VM which was created with DiskwithVMGuestState encryption using a customer managed key.
[Generalize the Confidential VM](https://docs.microsoft.com/azure/virtual-machines/generalize) before creating the image version.

```azurecli-interactive
diskEncryptionSetName=cvmdes
cvmdesId=$(az disk-encryption-set show -n $diskEncryptionSetName -g MyResourceGroup --query [id] -o tsv)
az sig image-version create --resource-group MyResourceGroup \
--gallery-name MyGallery --gallery-image-definition MyCVMImageDef \
--gallery-image-version 1.0.0 \
--managed-image /subscriptions/00000000-0000-0000-0000-00000000xxxx/resourceGroups/MyResourceGroup/providers/Microsoft.Compute/virtualMachines/myCVM
--target-regions westus
--target-region-cvm-encryption Encryptedwithcmk,$cvmdesId
```

In case a managed disk or a managed disk snapshot needs to be used as the image source for the image version, replace the --managed-image in the above command with --os-snapshot and provide the disk or the snapshot resource name

Create a Confidential VM using the above image version. The same customer managed key used to create the image version should be used while creating the VM.

```azurecli-interactive
adminUsername=linuxvm
az vm create --resource-group MyResourceGroup \
    --location westus
    --name mynewCVM \
    --size “Standard_DC2as_v5” \
    --image "/subscriptions/00000000-0000-0000-0000-00000000xxxx/resourceGroups/MyResourceGroup/providers/Microsoft.Compute/galleries/MyGallery/images/MyCVMImageDef" \
    --security-type ConfidentialVM \
    --os-disk-security-encryption-type DiskwithVMGuestState \
    --os-disk-securevm-disk-encryption-set $cvmdesId \
    --enable-secure-boot true \ 
    --enable-vtpm true \
    --admin-username $adminUsername \
    --generate-ssh-keys
 ```

## Security Type on Image Definition: ConfidentialVMSupported

This security type should be used when the source of the image is an OS disk VHD (without VM Guest state) or a Gen2 managed image.
The image will not have VM Guest state information and can be used to create either Azure Gen2 VMs or Confidential VMs.


### [Portal](#tab/portal2)

1.	Sign in to the [portal](https://portal.azure.com)
2.	Search for **VM Image Versions** and select **Create**
3.	Provide the subscription, resource group, region and image version number
4.	Select the source as either **Storage Blobs (VHD)** or **Managed Image**
5.	If **Storage Blobs (VHD)** is selected, provide an OS disk VHD (without VM Guest state) as input. Ensure that the OS Disk VHD is a Gen2 VHD.
6.	If **Managed Image** is selected, provide an existing managed image of an Azure Gen2 VM as input.
7.	Select a **Target Azure Compute Gallery** to create and share the image. If no gallery exists, create a new gallery.
9.	Select the **Operating system state** as either **Generalized** or **Specialized**. If VHD is chosen as the source and the OS state is set to generalized, ensure that the VHD is generalized to remove machine specific information before uploading to Azure. If Managed Image is chosen as the source, the operating system state should always be set to Generalized.   
10.	For the **Target VM Image Definition** select Create new. In the window that opens, select an image definition name and ensure that the **Security type** is set to **Confidential supported**. Provide the publisher, offer and SKU information and select **OK**.
11.	The **Replication** tab can be used to set the replica count and target regions for image replication, if required.
12.	The **Encryption** tab can also be used to provide SSE encryption related information. if required.
13.	Select **Create** in the **Review + create** tab to create the image
14.	Once the image version is successfully created, select the **+ Create VM** to land on the Create a virtual machine page.
14.	In the Create a virtual machine page, under **Resource group**, select **Create new** and type a name for your resource group or select an existing resource group from the dropdown.
15.	Under **Instance details**, type a name for the virtual machine name and choose a region that supports Confidential virtual machines, if Confidential VMs need to be created. If not, any region can be chosen.
    > [!NOTE]
    > Confidential VMs are not available in all locations. For currently supported locations, see which [VM products are available by Azure region](https://azure.microsoft.com/global-infrastructure/services/?products=virtual-machines).
16.	The image should already be populated. The **Security type** can either be set to **Standard** or **Confidential virtual machines**. Let’s select Confidential virtual machines. 
17. **vTPM** is always turned ON while Secure Boot can be turned ON by using **Configure security** features. If confidential compute encryption with platform managed key or customer managed key is used to encrypt the OS disk, Secure Boot is required and will also be turned ON.
18.	Under **Disks**, select **Confidential compute encryption** if required and select either confidential disk encryption with platform managed keys or customer managed keys and provide the disk encryption set information in case customer managed keys is selected.
19.	Fill in the **Administrator account** information and then **Inbound port rules**.
20.	At the bottom of the page, select **Review + Create**
21.	On the **Create a virtual machine** page, you can see the details about the VM you are about to deploy. Once validation shows as passed, select **Create**.	


### [CLI](#tab/cli2)

Make sure you are running the latest version of Azure CLI 

Sign in to Azure using `az login`.  

```azurecli-interactive
az login 
```

Create an image definition with ConfidentialVMSupported security type and set the OS state to be Generalized

```azurecli-interactive
az sig image-definition create --resource-group MyResourceGroup --location westus \ 
--gallery-name MyGallery --gallery-image-definition MyCVMImageDef \ 
--publisher CVMPublisher --offer CVMOffer --sku CVMSku \ 
--os-type Linux --os-state Generalized \ 
--hyper-v-generation V2 \ 
--features SecurityType=ConfidentialVMSupported
```

Use an OS disk VHD to create an image version. Ensure that the Linux VHD was generalized before uploading to an Azure storage account blob using steps outlined [here](https://docs.microsoft.com/azure/virtual-machines/linux/create-upload-generic)

```azurecli-interactive
az sig image-version create --resource-group MyResourceGroup \
--gallery-name MyGallery --gallery-image-definition MyCVMImageDef \
--gallery-image-version 1.0.0 \
--os-vhd-storage-account /subscriptions/00000000-0000-0000-0000-00000000xxxx/resourceGroups/imageGroups/providers/Microsoft.Storage/storageAccounts/mystorageaccount \
--os-vhd-uri https://mystorageaccount.blob.core.windows.net/container/path_to_vhd_file
```

Create a Confidential VM encrypted with Platform managed key using the above image version

```azurecli-interactive
adminUsername=linuxvm
az vm create --resource-group MyResourceGroup \
    --location westus
    --name mynewCVM \
    --size “Standard_DC2as_v5” \
    --image "/subscriptions/00000000-0000-0000-0000-00000000xxxx/resourceGroups/MyResourceGroup/providers/Microsoft.Compute/galleries/MyGallery/images/MyCVMImageDef" \
    --security-type ConfidentialVM \
    --os-disk-security-encryption-type DiskwithVMGuestState \
    --enable-secure-boot true \ 
    --enable-vtpm true \
    --admin-username $adminUsername \
    --generate-ssh-keys
 ```




