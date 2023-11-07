---
title: Create an image definition and image version
description: Learn how to create an image in an Azure Compute Gallery.
author: sandeepraichura
ms.service: virtual-machines
ms.subservice: gallery
ms.topic: how-to
ms.workload: infrastructure
ms.date: 09/20/2023
ms.author: saraic
ms.reviewer: cynthn
ms.custom: 

---

# Create an image definition and an image version 

A [Azure Compute Gallery](shared-image-galleries.md) (formerly known as Shared Image Gallery) simplifies custom image sharing across your organization. Custom images are like marketplace images, but you create them yourself. Images can be created from a VM, VHD, snapshot, managed image, or another image version. 

The Azure Compute Gallery lets you share your custom VM images with others in your organization, within or across regions, within a Microsoft Entra tenant, or publicly using a [community gallery](azure-compute-gallery.md#community). Choose which images you want to share, which regions you want to make them available in, and who you want to share them with. You can create multiple galleries so that you can logically group images. Many new features like ARM64, Accelerated Networking and TrustedVM are only supported through Azure Compute Gallery and not available for managed images.

The Azure Compute Gallery feature has multiple resource types:

[!INCLUDE [virtual-machines-shared-image-gallery-resources](./includes/virtual-machines-shared-image-gallery-resources.md)]


## Before you begin

To complete this article, you must have an existing Azure Compute Gallery, and a source for your image available in Azure. Image sources can be:
- A VM in your subscription. You can capture an image from both [specialized and generalized](shared-image-galleries.md#generalized-and-specialized-images) VMs. 
- A Managed image,
- Managed OS and data disks.
- OS and data disks as VHDs in a storage account.
- Other image versions either in the same gallery or another gallery in the same subscription.

If the image will contain data disks, the data disk size cannot be more than 1 TB.

Image definition names can be made up of uppercase or lowercase letters, digits, dots, dashes and periods. For more information about the values you can specify for an image definition, see [Image definitions](shared-image-galleries.md#image-definitions).

Allowed characters for the image version are numbers and periods. Numbers must be within the range of a 32-bit integer. Format: *MajorVersion*.*MinorVersion*.*Patch*.

When working through this article, replace the resource names where needed.

For [generalized](generalize.md) images, see the OS specific guidance before capturing the image:
   
   - **Linux**
     - [Generic steps](./linux/create-upload-generic.md)
     - [CentOS](./linux/create-upload-centos.md)
     - [Debian](./linux/debian-create-upload-vhd.md)
     - [Flatcar](./linux/flatcar-create-upload-vhd.md)
     - [FreeBSD](./linux/freebsd-intro-on-azure.md)
     - [Oracle Linux](./linux/oracle-create-upload-vhd.md)
     - [OpenBSD](./linux/create-upload-openbsd.md)
     - [Red Hat](./linux/redhat-create-upload-vhd.md)
     - [SUSE](./linux/suse-create-upload-vhd.md)
     - [Ubuntu](./linux/create-upload-ubuntu.md)

   - **Windows**
   
      If you plan to run Sysprep before uploading your virtual hard disk (VHD) to Azure for the first time, make sure you have [prepared your VM](./windows/prepare-for-upload-vhd-image.md).  

## Community gallery

If you will be sharing your images using a [community gallery](azure-compute-gallery.md#community), make sure that you create your gallery, image definitions, and image versions in the same region. 

When users search for community gallery images, only the latest version of an image is shown.

> [!IMPORTANT]
> Information from your image definitions will be publicly available, like what you provide for **Publish**, **Offer**, and **SKU**.

## Create an image

Choose an option below for creating your image definition and image version:

### [Portal](#tab/portal)

To create an image from a VM in the portal, see [Capture an image of a VM](capture-image-portal.md). 

To create an image using a source other than a VM, follow these steps.

1. Go to the [Azure portal](https://portal.azure.com), then search for and select **Azure Compute Gallery**.
1. Select the gallery you want to use from the list.
1. On the page for your gallery, select **Add** from the top of the page and then select **VM image definition** from the drop-down.
1. on the **Add new image definition to Azure Compute Gallery** page, in the **Basics** tab, select a **Region**.
1. For **Image definition name**, type a name like *myImageDefinition*.
1. For **Operating system**, select the correct option based on your source.  
1. For **VM generation**, select the option based on your source. In most cases, this will be *Gen 1*. For more information, see [Support for generation 2 VMs](generation-2.md).
1. For **Operating system state**, select the option based on your source. For more information, see [Generalized and specialized](shared-image-galleries.md#generalized-and-specialized-images).
1. For **Publisher**, type a unique name like *myPublisher*. 
1. For **Offer**, type a unique name like *myOffer*.
1. For **SKU**, type a unique name like *mySKU*.
1. At the bottom of the page, select **Review + create**.
1. After the image definition passes validation, select **Create**.
1. When the deployment is finished, select **Go to resource**.
1. In the page for your image definition, on the **Get started** tab, select **Create a version**.
1. In **Region**, select the region where you want the image created. In some cases, the source must be in the same region where the image is created. If you aren't seeing your source listed in later drop-downs, try changing the region for the image. You can always replicate the image to other regions later.
1. For **Version number**, type a number like *1.0.0*. The image version name should follow *major*.*minor*.*patch* format using integers. 
1. In **Source**, select the type of file you are using for your source from the drop-down. See the table below for specific details for each source type.

    | Source | Other fields |
    |---|---|
    | Disks or snapshots | - For **OS disk** select the disk or snapshot from the drop-down. <br> - To add a data disk, type the LUN number and then select the data disk from the drop-down. |
    | Image version | - Select the **Source gallery** from the drop-down. <br> - Select the correct image definition from the drop-down. <br>- Select the existing image version that you want to use from the drop-down. |
    | Managed image | Select the **Source image** from the drop-down. <br>The managed image must be in the same region that you chose in **Instance details**.
    | VHD in a storage account | Select **Browse** to choose the storage account for the VHD. |

1. In **Exclude from latest**, leave the default value of *No* unless you don't want this version used when creating a VM using `latest` instead of a version number.
1. For **End of life date**, select a date from the calendar for when you think this version should stop being used.
1. In the **Replication** tab, select the storage type from the drop-down.
1. Set the **Default replica count**, you can override this for each region you add. 
1. You need to replicate to the source region, so the first replica in the list will be in the region where you created the image. You can add more replicas by selecting the region from the drop-down and adjusting the replica count as necessary.
1. When you are done, select **Review + create**. Azure will validate the configuration.
1. When image version passes validation, select **Create**.
1. When the deployment is finished, select **Go to resource**.

It can take a while to replicate the image to all of the target regions.

You can also capture an existing VM as an image, from the portal. For more information, see [Create an image of a VM in the portal](capture-image-portal.md).

### [CLI](#tab/cli)

Image definitions create a logical grouping for images. They are used to manage information about the image versions that are created within them.

Create an image definition in a gallery using [az sig image-definition create](/cli/azure/sig/image-definition#az-sig-image-definition-create). Make sure your image definition is the right type. If you have [generalized](generalize.md) the VM (using `waagent -deprovision` for Linux, or Sysprep for Windows) then you should create a generalized image definition using `--os-state generalized`. If you want to use the VM without removing existing user accounts, create a specialized image definition using `--os-state specialized`.

For more information about the parameters you can specify for an image definition, see [Image definitions](shared-image-galleries.md#image-definitions).

In this example, the image definition is named *myImageDefinition*, and is for a [specialized](shared-image-galleries.md#generalized-and-specialized-images) Linux OS image. To create a definition for images using a Windows OS, use `--os-type Windows`. 

```azurecli-interactive
az sig image-definition create \
   --resource-group myGalleryRG \
   --gallery-name myGallery \
   --gallery-image-definition myImageDefinition \
   --publisher myPublisher \
   --offer myOffer \
   --sku mySKU \
   --os-type Linux \
   --os-state specialized
```

> [!NOTE]
> For image definitions that will contain images descended from third-party marketplace images, the plan information must match exactly the plan information from the third-party image. Include the plan information in the image definition by adding `--plan-name`, `--plan-product`, and `--plan-publisher` when you create the image definition.
>

**Create the image version**

Create an image version using [az sig image version create](/cli/azure/sig/image-version#az-sig-image-version-create).  

The syntax for creating the image will change, depending on what you are using as your source. You can mix the source types, as long as you only have one OS source. You can also have different sources for each data disk.

| Source  | Parameter set |
|---|---|
|     **OS Disk:**| |
| VM using the VM ID| `--managed-image <Resource ID of the VM>` |
| Managed image or another image version | `--managed-image <Resource ID of the managed image or image version` |
| Snapshot or managed disk | `--os-snapshot <Resource ID of the snapshot or managed disk>` |
| VHD in a storage account | `--os-vhd-uri <URI> --os-vhd-storage-account <storage account name>`.  | 
|     **Data disk:** |
| Snapshot or managed disk | `--data-snapshots <Resource ID of the snapshot or managed disk> --data-snapshot-luns <LUN number>` |
| VHD in a storage account | `--data-vhds-sa <storageaccountname> --data-vhds-uris <URI> --data-vhds-luns <LUN number>` |

For detailed examples of how to specify different sources for your image, see the [az sig image-version create examples](/cli/azure/sig/image-version#az-sig-image-version-create-examples).

In the example below, we are creating an image from a **VM**. The version of our image is *1.0.0* and we are going to create 2 replicas in the *West Central US* region, 1 replica in the *South Central US* region and 1 replica in the *East US 2* region using zone-redundant storage. The replication regions must include the region the source VM is located.

It is a best practice to stop\deallocate the VM before creating an image.

Replace the value of `--managed-image` in this example with the ID of your VM.

```azurecli-interactive 
az sig image-version create \
   --resource-group myGalleryRG \
   --gallery-name myGallery \
   --gallery-image-definition myImageDefinition \
   --gallery-image-version 1.0.0 \
   --target-regions "westcentralus" "southcentralus=1" "eastus=1=standard_zrs" \
   --replica-count 2 \
   --managed-image "/subscriptions/<Subscription ID>/resourceGroups/MyResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM"
```

> [!NOTE]
> You need to wait for the image version to completely finish being built and replicated before you can use the same managed image to create another image version.
>
> You can also store your image in Premium storage by adding `--storage-account-type  premium_lrs`, or [Zone Redundant Storage](../storage/common/storage-redundancy.md) by adding `--storage-account-type  standard_zrs` when you create the image version.

### [PowerShell](#tab/powershell)

Image definitions create a logical grouping for images. When making your image definition, make sure it has all of the correct information. If you [generalized](generalize.md) the source VM, then you should create an image definition using `-OsState generalized`. If you didn't generalized the source, create an image definition using `-OsState specialized`.

For more information about the values you can specify for an image definition, see [Image definitions](./shared-image-galleries.md#image-definitions).

Create the image definition using [New-AzGalleryImageDefinition](/powershell/module/az.compute/new-azgalleryimagedefinition).

In this example, the image definition is named *myImageDefinition*, and is for a specialized VM running Windows. To create a definition for images using Linux, use `-OsType Linux`. 

```azurepowershell-interactive
$imageDefinition = New-AzGalleryImageDefinition `
   -GalleryName $gallery.Name `
   -ResourceGroupName $gallery.ResourceGroupName `
   -Location $gallery.Location `
   -Name 'myImageDefinition' `
   -OsState specialized `
   -OsType Windows `
   -Publisher 'myPublisher' `
   -Offer 'myOffer' `
   -Sku 'mySKU'
```

> [!NOTE]
> For image definitions that will contain images descended from third-party images, the plan information must match exactly the plan information from the third-party image. Include the plan information in the image definition by adding `-PurchasePlanName`, `-PurchasePlanProduct`, and `-PurchasePlanPublisher` when you create the image definition.
>

**Create an image version**

Create an image version using [New-AzGalleryImageVersion](/powershell/module/az.compute/new-azgalleryimageversion). 

The syntax for creating the image will change, depending on what you are using as your source. 

| Source  | Parameter set |
|---|---|
| **OS Disk**| |
| VM using the VM ID| `-SourceImageId <Resource ID of the VM>` |
| Managed image or another image version | `-SourceImageId <Resource ID of the managed image or image version` |
| Snapshot or managed disk | `-OSDiskImage <Resource ID of the snapshot or managed disk>` |
| **Data disk** |
| Snapshot or managed disk | `-DataDiskImage @{Source = @{Id=<source_id>}; Lun=<LUN>; SizeInGB = <Size in GB>; HostCaching = <Caching> }` |


In the example below, we are creating an image version from a VM. It is a best practice to stop\deallocate the VM before creating an image using [Stop-AzVM](/powershell/module/az.compute/stop-azvm).

In this example, the image version is *1.0.0* and it's replicated to both *West Central US* and *South Central US* datacenters. When choosing target regions for replication, remember that you also have to include the *source* region as a target for replication.


```azurepowershell-interactive
   $region1 = @{Name='South Central US';ReplicaCount=1}
   $region2 = @{Name='East US';ReplicaCount=2}
   $targetRegions = @($region1,$region2)

$job = $imageVersion = New-AzGalleryImageVersion `
   -GalleryImageDefinitionName $imageDefinition.Name`
   -GalleryImageVersionName '1.0.0' `
   -GalleryName $gallery.Name `
   -ResourceGroupName $gallery.ResourceGroupName `
   -Location $gallery.Location `
   -TargetRegion $targetRegions  `
   -SourceImageId $sourceVm.Id.ToString() `
   -PublishingProfileEndOfLifeDate '2020-12-01' `  
   -asJob 
```

It can take a while to replicate the image to all of the target regions, so we have created a job so we can track the progress. To see the progress of the job, type `$job.State`.

```azurepowershell-interactive
$job.State
```

> [!NOTE]
> You need to wait for the image version to completely finish being built and replicated before you can use the same managed image to create another image version.
>
> You can also store your image in Premium storage by adding `-StorageAccountType Premium_LRS`, or [Zone Redundant Storage](../storage/common/storage-redundancy.md) by adding `-StorageAccountType Standard_ZRS` when you create the image version.
>

### [REST](#tab/rest)

Create an image definition using the [REST API](/rest/api/compute/gallery-images/create-or-update)

```rest
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/galleries/{galleryName}/images/{galleryDefinitionName}?api-version=2019-12-01

{
    "location": "eastus",
    "properties": {
        "hyperVGeneration": "V1",
        "identifier": {
            "offer": "myOffer",
            "publisher": "myPublisher",
            "sku": "mySKU"
        },
        "osState": "Specialized",
        "osType": "Linux",
    },
}
```

Create an image version using the [REST API](/rest/api/compute/gallery-image-versions/create-or-update). In this example, we are creating an image version from a VM. To use another source, pass in the resource ID for source (for example, pass in the ID of the OS disk snapshot).

```rest
# @name imageVersion
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/galleries/{galleryName}/images/{galleryDefinitionName}/versions/{galleryImageVersionName}?api-version=2019-12-01

{
    "location": "{region}",
    "properties": {
        "publishingProfile": {
            "endOfLifeDate": "2024-12-02T00:00:00+00:00",
            "replicaCount": 1,
            "storageAccountType": "Standard_ZRS",
            "targetRegions": [
                {
                    "name": "eastus",
                    "regionalReplicaCount": 2,
                    "storageAccountType": "Standard_LRS",
                },
                {
                    "name": "westus2",
                }
            ]
        },
        "storageProfile": {
            "source": {
                "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/{vmName}"
            }
        }
    }
}
```

---

## Create an image in one tenant using the source image in another tenant

In the subscription where the source image exists, grant reader permissions to the user. Once the user has reader permission to the source image, login to both accounts (source and target).

You will need the `tenantID` of the source image, the `subscriptionID` for the subscription where the new image will be stored (target), and the `resourceID` of the source image.

### [CLI](#tab/cli2)

```azurecli-interactive
# Set some variables
tenantID="<tenant ID for the source image>"
subID="<subscription ID where the image will be creted>"
sourceImageID="<resource ID of the source image>"

# Login to the subscription where the new image will be created
az login

# Log in to the tenant where the source image is available
az login --tenant $tenantID

# Log back in to the subscription where the image will be created and ensure subscription context is set
az login
az account set --subscription $subID

# Create the image
az sig image-version create `
   --gallery-image-definition myImageDef `
   --gallery-image-version 1.0.0 `
   --gallery-name myGallery `
   --resource-group myResourceGroup `
   --image-version $sourceImageID
```


### [PowerShell](#tab/powershell2)

```azurepowershell-interactive
# Set variables 
$targetSubID = "<subscription ID for the target>"
$sourceTenantID = "<tenant ID where for the source image>"
$sourceImageID = "<resource ID of the source image>"

# Login to the tenant where the source image is published
Connect-AzAccount -Tenant $sourceTenantID -UseDeviceAuthentication 

# Login to the subscription where the new image will be created and set the context
Connect-AzAccount -UseDeviceAuthentication -Subscription $targetSubID
Set-AzContext -Subscription $targetSubID 

# Create the image version from another image version in a different tenant
New-AzGalleryImageVersion `
   -ResourceGroupName myResourceGroup -GalleryName myGallery `
   -GalleryImageDefinitionName myImageDef `
   -Location "West US 2" `
   -Name 1.0.0 `
   -SourceImageId $sourceImageID
```

---

## Next steps

For information about how to supply purchase plan information, see [Supply Azure Marketplace purchase plan information when creating images](marketplace-images.md).
