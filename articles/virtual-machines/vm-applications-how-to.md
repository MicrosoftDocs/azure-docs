---
title: Create and deploy VM application packages (preview)
description: Learn how to create and deploy VM Applications using an Azure Compute Gallery.
ms.service: virtual-machines
ms.subservice: gallery
ms.topic: how-to
ms.workload: infrastructure
ms.date: 02/03/2022
ms.reviewer: amjads
ms.custom: 

---

# Create and deploy VM Applications (preview)

VM Applications are a resource type in Azure Compute Gallery (formerly known as Shared Image Gallery) that simplifies management, sharing and global distribution of applications for your virtual machines.


> [!IMPORTANT]
> **VM applications in Azure Compute Gallery** are currently in public preview.
> This preview version is provided without a service-level agreement, and we don't recommend it for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).


## Prerequisites

Before you get started, make sure you have the following:


This article assumes you already have an Azure Compute Gallery. If you don't already have a gallery, create one first. To learn more, see [Create a gallery for storing and sharing resources](create-gallery.md)..

You should have uploaded your application to a container in an Azure storage account. Your application can be stored in a block or page blob. If you choose to use a page blob, you need to byte align the files before you upload them. Here is a sample that will byte align your file:

```azurepowershell-interactive
$inputFile = <the file you want to pad>

$fileInfo = Get-Item -Path $inputFile

$remainder = $fileInfo.Length % 512

if ($remainder -ne 0){

    $difference = 512 - $remainder

    $bytesToPad = [System.Byte[]]::CreateInstance([System.Byte], $difference)

    Add-Content -Path $inputFile -Value $bytesToPad -Encoding Byte
    }
```

You need to make sure the files are publicly available, or you will need the SAS URI for the files in your storage account. You can use [Storage Explorer](../vs-azure-tools-storage-explorer-blobs.md) to quickly create a SAS URI if you don't already have one.

If you are using PowerShell, you need to be using version 3.11.0 of the Az.Storage module.

## Create the VM application

Choose an option below for creating your VM application definition and version:

### [Portal](#tab/portal)


1. Go to the [Azure portal](https://portal.azure.com), then search for and select **Azure Compute Gallery**.
1. Select the gallery you want to use from the list.
1. On the page for your gallery, select **Add** from the top of the page and then select **VM application definition** from the drop-down. The **Create a VM application definition** page will open.
1. In the **Basics** tab, enter a name for your application and choose whether the application is for VMs running Linux or Windows.
1. Select the **Publishing options** tab if you want to specify any of the following optional settings for your VM application definition:
    - A description of the VM application definition.
    - End of life date
    - Link to a Eula
    - URI of a privacy statement
    - URI for release notes
1. When you are done, select **Review + create**.
1. When validation completes, select **Create** to have the definition deployed.
1. Once the deployment is complete, select **Go to resource**.
1. On the page for the application, select **Create a VM application version**. The **Create a VM Application Version** page will open.
1. Enter a version number like 1.0.0.
1. Select the region where you have uploaded your application package.
1. Under **Source application package**, select **Browse**. Select the storage account, then the container where your package is located. Select the package from the list and then click **Select** when you are done.
1. Type in the **Install script**. You can also provide the **Uninstall script** and **Update script**. See the [Overview](vm-applications.md#command-interpreter) for information on how to create the scripts.
1. If you have a default configuration file uploaded to a storage account, you can select it in **Default configuration**.
1. Select **Exclude from latest** if you do not want this version to appear as the latest version when you create a VM.
1. For **End of life date**, choose a date in the future to track when this version should be retired. It is not deleted or removed automatically, it is only for your own tracking.
1. To replicate this version to other regions, select the **Replication** tab and add more regions and make changes to the number of replicas per region. The original region where your version was created must be in the list and cannot be removed.
1. When you are done making changes, select **Review + create** at the bottom of the page.
1. When validation shows as passed, select **Create** to deploy your VM application version.


Now you can create a VM and deploy the VM application to it using the portal. Just create the VM as usual, and under the **Advanced** tab, choose **Select a VM application to install**.

:::image type="content" source="media/vmapps/advanced-tab.png" alt-text="Screenshot of the Advanced tab where you can choose to install a VM application.":::

Select the VM application from the list, and then select **Save** at the bottom of the page.

:::image type="content" source="media/vmapps/select-app.png" alt-text="Screenshot showing selecting a VM application to install on the VM.":::

If you have more than one VM application to install, you can set the install order for each VM application back on the **Advanced tab**.

### [CLI](#tab/cli)

VM applications require [Azure CLI](/cli/azure/install-azure-cli) version 2.30.0 or later.

Crate the VM application definition using [az sig gallery-application create](/cli/azure/sig/gallery-application#az-sig-gallery-application-create). In this example we are creating a VM application definition named *myApp* for Linux-based VMs.

```azurecli-interactive
az sig gallery-application create \
    --application-name myApp \
    --gallery-name myGallery \
    --resource-group myResourceGroup \
    --os-type Linux \
    --location "East US"
```

Create a VM application version using [az sig gallery-application version create](/cli/azure/sig/gallery-application/version#az-sig-gallery-application-version-create). Allowed characters for version are numbers and periods. Numbers must be within the range of a 32-bit integer. Format: *MajorVersion*.*MinorVersion*.*Patch*.

Replace the values of the parameters with your own.

```azurecli-interactive
az sig gallery-application version create \
   --version-name 1.0.0 \
   --application-name myApp \
   --gallery-name myGallery \
   --location "East US" \
   --resource-group myResourceGroup \
   --package-file-link "https://<storage account name>.blob.core.windows.net/<container name>/<filename>" \
   --install-command "mv myApp .\myApp\myApp" \
   --remove-command "rm .\myApp\myApp" \
   --update-command  "mv myApp .\myApp\myApp \
   --default-configuration-file-link "https://<storage account name>.blob.core.windows.net/<container name>/<filename>"\
```


### [PowerShell](#tab/powershell)

Create the VM application definition using `New-AzGalleryApplication`. In this example, we are creating a Linux app named *myApp* in the *myGallery* Azure Compute Gallery, in the *myGallery* resource group and I've given a short description of the VM application for my own use. Replace the values as needed.

```azurepowershell-interactive
$galleryName = myGallery
$rgName = myResourceGroup
$applicationName = myApp
New-AzGalleryApplication `
  -ResourceGroupName $rgName `
  -GalleryName $galleryName `
  -Location "East US" `
  -Name $applicationName `
  -SupportedOSType Linux `
  -Description "Backend Linux application for finance."
```

Create a version of your application using `New-AzGalleryApplicationVersion`. Allowed characters for version are numbers and periods. Numbers must be within the range of a 32-bit integer. Format: *MajorVersion*.*MinorVersion*.*Patch*.

In this example, we are creating version number *1.0.0*. Replace the values of the variables as needed.

```azurepowershell-interactive
$version = 1.0.0
New-AzGalleryApplicationVersion `
   -ResourceGroupName $rgName `
   -GalleryName $galleryName `
   -GalleryApplicationName $applicationName `
   -Name $version `
   -PackageFileLink "https://<storage account name>.blob.core.windows.net/<container name>/<filename>" `
   -Location "East US" `
   -Install myApp.exe /silent `
   -Remove myApp.exe /uninstall `
```


To add the application to an existing VM, get the application version and use that to get the VM application version ID. Use the ID to add the application to the VM configuration.

```azurepowershell-interactive
$vmname = "myVM"
$vm = Get-AzVM -ResourceGroupName $rgname -Name $vmname
$appversion = Get-AzGalleryApplicationVersion `
   -GalleryApplicationName $applicationname `
   -GalleryName $galleryname `
   -Name $version `
   -ResourceGroupName $rgname
$packageid = $appversion.Id
$app = New-AzVmGalleryApplication -PackageReferenceId $packageid
Add-AzVmGalleryApplication -VM $vmname -GalleryApplication $app
Update-AzVM -ResourceGroupName $rgname -VM $vm
```
 
Verify the application succeeded:

```powershell-interactive
Get-AzVM -ResourceGroupName $rgname -VMName $vmname -Status
```

### [REST](#tab/rest2)

Create the application definition.


```rest
PUT
/subscriptions/\<**subscriptionId**\>/resourceGroups/\<**resourceGroupName**\>/providers/Microsoft.Compute/galleries/\<**galleryName**\>/applications/\<**applicationName**\>?api-version=2019-03-01

{
    "location": "West US",
    "name": "myApp",
    "properties": {
        "supportedOSType": "Windows | Linux",
        "endOfLifeDate": "2020-01-01"
    }
}

```

| Field Name | Description | Limitations |
|--|--|--|
| name | A unique name for the VM Application within the gallery | Max length of 117 characters. Allowed characters are uppercase or lowercase letters, digits, hyphen(-), period (.), underscore (_). Names not allowed to end with period(.). |
| supportedOSType | Whether this is a Windows or Linux application | “Windows” or “Linux” |
| endOfLifeDate | A future end of life date for the application. Note that this is for reference only, and is not enforced. | Valid future date |

Create a VM application version.

```rest
PUT
/subscriptions/\<**subscriptionId**\>/resourceGroups/\<**resourceGroupName**\>/providers/Microsoft.Compute/galleries/\<**galleryName**\>/applications/\<**applicationName**\>/versions/\<**versionName**\>?api-version=2019-03-01

{
  "location": "$location",
  "properties": {
    "publishingProfile": {
      "source": {
        "mediaLink": "$mediaLink",
        "defaultConfigurationLink": "$configLink"
      },
      "manageActions": {
        "install": "echo installed",
        "remove": "echo removed",
        "update": "echo update"
      },
      "targetRegions": [
        {
          "name": "$location1",
          "regionalReplicaCount": 1 
        },
        { "name": "$location1" }
      ]
    },
    "endofLifeDate": "datetime",
    "excludeFromLatest": "true | false"
  }
}

```

| Field Name | Description | Limitations |
|--|--|--|
| location | Source location for the VM Application version | Valid Azure region |
| mediaLink | The url containing the application version package | Valid and existing storage url |
| defaultConfigurationLink | Optional. The url containing the default configuration, which may be overridden at deployment time. | Valid and existing storage url |
| Install | The command to install the application | Valid command for the given OS |
| Remove | The command to remove the application | Valid command for the given OS |
| Update | Optional. The command to update the application. If not specified and an update is required, the old version will be removed and the new one installed. | Valid command for the given OS |
| targetRegions/name | The name of a region to which to replicate | Validate Azure region |
| targetRegions/regionalReplicaCount | Optional. The number of replicas in the region to create. Defaults to 1. | Integer between 1 and 3 inclusive |
| endOfLifeDate | A future end of life date for the application version. Note that this is for customer reference only, and is not enforced. | Valid future date |
| excludeFromLatest | If specified, this version will not be considered for latest. | True or false |




To add a VM application version to a VM, perform a PUT on the VM.

```rest
PUT
/subscriptions/\<**subscriptionId**\>/resourceGroups/\<**resourceGroupName**\>/providers/Microsoft.Compute/virtualMachines/\<**VMName**\>?api-version=2019-03-01

{
  "properties": {
    "applicationProfile": {
      "galleryApplications": [
        {
          "order": 1,
          "packageReferenceId": "/subscriptions/{subscriptionId}/resourceGroups/<resource group>/providers/Microsoft.Compute/galleries/{gallery name}/applications/{application name}/versions/{version}",
          "configurationReference": "{path to configuration storage blob}"
        }
      ]
    }
  },
  "name": "{vm name}",
  "id": "/subscriptions/{subscriptionId}/resourceGroups/{resource group}/providers/Microsoft.Compute/virtualMachines/{vm name}",
  "location": "{vm location}"
}
```


To apply the VM application to a uniform scale set:

```rest
PUT
/subscriptions/\<**subscriptionId**\>/resourceGroups/\<**resourceGroupName**\>/providers/Microsoft.Compute/
virtualMachineScaleSets/\<**VMSSName**\>?api-version=2019-03-01

{
  "properties": {
    "virtualMachineProfile": {
      "applicationProfile": {
        "galleryApplications": [
          {
            "order": 1,
            "packageReferenceId": "/subscriptions/{subscriptionId}/resourceGroups/<resource group>/providers/Microsoft.Compute/galleries/{gallery name}/applications/{application name}/versions/{version}",
            "configurationReference": "{path to configuration storage blob}"
          }
        ]
      }
    }
  },
  "name": "{vm name}",
  "id": "/subscriptions/{subscriptionId}/resourceGroups/{resource group}/providers/Microsoft.Compute/virtualMachines/{vm name}",
  "location": "{vm location}"
}
```


| Field Name | Description | Limitations |
|--|--|--|
| order | Optional. The order in which the applications should be deployed. See below. | Validate integer |
| packageReferenceId | A reference the the gallery application version | Valid application version reference |
| configurationReference | Optional. The full url of a storage blob containing the configuration for this deployment. This will override any value provided for defaultConfiguration earlier. | Valid storage blob reference |

The order field may be used to specify dependencies between applications. The rules for order are the following:

| Case | Install Meaning | Failure Meaning |
|--|--|--|
| No order specified | Unordered applications are installed after ordered applications. There is no guarantee of installation order amongst the unordered applications. | Installation failures of other applications, be it ordered or unordered doesn’t affect the installation of unordered applications. |
| Duplicate order values | Application will be installed in any order compared to other applications with the same order. All applications of the same order will be installed after those with lower orders and before those with higher orders. | If a previous application with a lower order failed to install, no applications with this order will install. If any application with this order fails to install, no applications with a higher order will install. |
| Increasing orders | Application will be installed after those with lower orders and before those with higher orders. | If a previous application with a lower order failed to install, this application will not install. If this application fails to install, no application with a higher order will install. |

The response will include the full VM model. The following are the
relevant parts.

```rest
{
  "name": "{vm name}",
  "id": "{vm id}",
  "type": "Microsoft.Compute/virtualMachines",
  "location": "{vm location}",
  "properties": {
    "applicationProfile": {
      "galleryApplications": ""
    },
    "provisioningState": "Updating"
  },
  "resources": [
    {
      "name": "VMAppExtension",
      "id": "{extension id}",
      "type": "Microsoft.Compute/virtualMachines/extensions",
      "location": "centraluseuap",
      "properties": "@{autoUpgradeMinorVersion=True; forceUpdateTag=7c4223fc-f4ea-4179-ada8-c8a85a1399f5; provisioningState=Creating; publisher=Microsoft.CPlat.Core; type=VMApplicationManagerLinux; typeHandlerVersion=1.0; settings=}"
    }
  ]
}

```

If the VM applications have not yet been installed on the VM, the value will be empty. 

---



## Next steps
Learn more about [VM applications](vm-applications.md).
