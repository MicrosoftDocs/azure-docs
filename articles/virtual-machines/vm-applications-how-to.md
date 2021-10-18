---
title: Store and share vm application packages (preview)
description: Learn how to store and share vm application packages using an Azure Compute Gallery.
ms.service: virtual-machines
ms.subservice: shared-image-gallery
ms.topic: how-to
ms.workload: infrastructure
ms.date: 10/18/2021
ms.reviewer:
ms.custom: 

---

# How to store and share vm application packages (preview)



> [!IMPORTANT]
> **VM application packages in Azure Compute Gallery** are currently in public preview.
> This preview version is provided without a service-level agreement, and we don't recommend it for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).


## Prerequisites

Before you get started, make sure you have the following:


This article assumes you already have an Azure Compute Gallery. If you don't already have a gallery, create one first. To learn more, see [Create a gallery for storing and sharing resources](create-gallery.md)..

You should have uploaded your application to an Azure storage account

## Register the feature

For the public preview, you first need to register the feature:

### [CLI](#tab/cli)

- This article requires version <!-- version number --> or later of the Azure CLI. If using [Azure Cloud Shell](../cloud-shell/quickstart.md), the latest version is already installed.
- Run [az version](/cli/azure/reference-index?#az_version) to find the version. 
- To upgrade to the latest version, run [az upgrade](/cli/azure/reference-index?#az_upgrade).


```azurecli-interactive
az feature register \
   --namespace Microsoft.Compute \
   --name <!-- feature name-->
```

Check the status of the feature registration.

```azurecli-interactive
az feature show \
   --namespace Microsoft.Compute \
   --name <!-- feature name--> | grep state
```

Check your provider registration.

```azurecli-interactive
az provider show -n Microsoft.Compute | grep registrationState
```

If they do not say registered, run the following:

```azurecli-interactive
az provider register -n <!-- feature -->

```

### [PowerShell](#tab/powershell)

Install the latest [Azure PowerShell version](/powershell/azure/install-az-ps), and sign in to an Azure account using [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount).

```azurepowershell-interactive
Register-AzProviderFeature `
   -FeatureName <!-- feature name--> `
   -ProviderNamespace Microsoft.Compute
```

It takes a few minutes for the registration to finish. Use `Get-AzProviderFeature` to check the status of the feature registration:

```azurepowershell-interactive
Get-AzProviderFeature `
   -FeatureName <!-- feature name--> `
   -ProviderNamespace Microsoft.Compute
```

When `RegistrationState` returns `Registered`, you can move on to the next step.

Check your provider registration. Make sure it returns `Registered`.

```azurepowershell-interactive
Get-AzResourceProvider -ProviderNamespace Microsoft.Compute | Format-table -Property ResourceTypes,RegistrationState
```

If it doesn't return `Registered`, use the following code to register the providers:

```azurepowershell-interactive
Register-AzResourceProvider -ProviderNamespace Microsoft.Compute
```

### [Portal](#tab/portal)

1. Open the [portal](https://portal.azure.com).
1. Search for and select **Subscriptions**.
1. Select your subscription from the list. The page for your subscription will open.
1. In the left menu, select **Preview features**. The **Preview features** page will open.
1. In the filter, type <feature name>.
1. Select <feature name> and then select **+ Register**.

---

## Sample app

This section will create a very simple sample app to use for creating a VM application. If you already have an app, you can skip this section and replace the values in the rest of the article with your own.

### Installer

Our installer will simply read the contents of our configuration file and write it to a new file. Name the file MyAppInstaller.ps1 and copy the following into the file:

``` 
$contents = Get-Content -Path .\FirstVMApp.config
$contents | Out-File -FilePath .\AppInstall.txt
```

### Config file 

Create a text file called MyAppInstaller.config with the following contents:

```
Hello world!
```

### Byte align the files

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

### Create the package blobs
All VM Applications must have a package. Fill in the blanks for the following script to upload the byte aligned package to two storage blobs.

```azurepowershell-interactive
Login-AzureRMAccount

$subid = "<your subscription ID>"
Set-AzContext -SubscriptionId $subid

$rg = "myResourceGroup"
$saName = "sa10122021"
$containerName = "apppackages"
$location = "East US"

$sa = New-AzStorageAccount -name $saName -ResourceGroupName $rg -SkuName "Standard_LRS" -Location $location
New-AzStorageContainer -Name $containerName -Context $sa.Context -Permission Blob

$packageFile = ".\MyAppInstaller.ps1"
$packageBlob = "MyAppPackage"
Set-AzStorageBlobContent -BlobType Page -File $packageFile -Container $containerName -Blob $packageBlob -Context $sa.Context
```

### Create the default config blob

The default config is optional, but if provided will be downloaded to each VM unless it is overridden.

```azurepowershell-interactive
$configFile = ".\MyAppInstaller.config"
$configBlob = "MyAppConfig"
Set-AzureStorageBlobContent -BlobType Page -File $configFile -Container $containerName -Blob $configBlob -Context $sa.Context
```



## Create the VM application

Choose an option below for creating your VM application definition and version:

### [Portal](#tab/portal2)


1. Go to the [Azure portal](https://portal.azure.com), then search for and select **Azure Compute Gallery**.
1. Select the gallery you want to use from the list.
1. On the page for your gallery, select **Add** from the top of the page and then select **VM image definition** from the drop-down. The **Create a VM application definition** page will open.
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

### [CLI](#tab/cli2)

Crate the VM application definition using [az sig gallery-application create](/cli/azure/sig/gallery-application#az_sig_gallery_application_create). In this example we are creating a VM application definition named *myApp* for Linux-based VMs.

```azurecli-interactive
az sig gallery-application create \
    --gallery-application-name myApp \
    --gallery-name myGallery \
    --resource-group myResourceGroup \
    --os-type Linux \
    --location "East US"
```

Create a VM application version using []()

```azurecli-interactive
az sig gallery-application-version create \
   --gallery-application-version 1.0.0 \
   --gallery-application-name myApp \
   --gallery-name myGallery \
   --resource-group myResourceGroup \
   --package-file-link "" \
   --install-command "" \
   --remove-command "" \
   --location "East US" \
   --update-command "" \
   --target-regions \
   --default-configuration-file-link \
   --publishing-profile-end-of-life-date "01/01/2023" \
   --description "Initial version of the Linux application."
```


### [PowerShell](#tab/powershell2)

Create the VM application definition using `New-AzGalleryApplication`. In this example, we are creating an app named *myApp* in the *myGallery* Azure Compute Gallery, in the *myGallery* resource group. Replace the values of the variables as needed.

```azurepowershell-interactive
$galleryName = myGallery
$rgName = myResourceGroup
$applicationName = myApp
New-AzGalleryApplication `
  -ResourceGroupName $rgName `
  -GalleryName $galleryName `
  -Name $applicationName
```

Create a version of your application using `New-AzGalleryApplicationVersion`. Allowed characters for version are numbers and periods. Numbers must be within the range of a 32-bit integer. Format: *MajorVersion*.*MinorVersion*.*Patch*.

In this example, we are creating version number *1.0.0*. Replace the values of the variables as needed.

```azurepowershell-interactive
$version = 1.0.0
New-AzGalleryApplicationVersion `
   -ResourceGroupName $rgName `
   -GalleryName $galleryName `
   -ApplicationName  `
   -Name $applicationName
   -Version $version
   -PackageFileLink 
   -Location <String>
   -Install <String>
   -Remove <String>
```

To add the application to a VM, get the application version and use that to get the version ID. Use the ID to add the application to the VM configuration.

```azurepowershell-interactive
$version = Get-AzGalleryApplicationVersion `
   -ResourceGroupName $rgname `
   -GalleryName $galleryname `
   -ApplicationName $applicationname `
   -Version $version

$vm = Add-AzVmGalleryApplication `
   -VM $vm `
   -Id $vmapp.Id

Update-AzVm -ResourceGroupName $rgname -VM $vm
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
| endOfLifeDate | A future end of life date for the application. Note that this is for customer reference only, and is not enforced. | Valid future date |

Create a VM application version.

```rest
PUT 

/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Compute/galleries/<galleryName>/applications/<applicationName>/versions/<versionName>?api-version=2019-03-01 
```


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


| Field Name             | Description                                                                                                                                                        | Limitations                         |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------|
| order                  | Optional. The order in which the applications should be deployed. See below.                                                                                       | Validate integer                    |
| packageReferenceId     | A reference the the gallery application version                                                                                                                    | Valid application version reference |
| configurationReference | Optional. The full url of a storage blob containing the configuration for this deployment. This will override any value provided for defaultConfiguration earlier. | Valid storage blob reference        |

The order field may be used to specify dependencies between
applications. The rules for order are the following.

| Case                   | Install Meaning                                                                                                                                                                                                        | Failure Meaning                                                                                                                                                                                                      |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| No order specified     | Unordered applications are installed after ordered applications. There is no guarantee of installation order amongst the unordered applications.                                                                       | Installation failures of other applications, be it ordered or unordered doesn’t affect the installation of unordered applications.                                                                                   |
| Duplicate order values | Application will be installed in any order compared to other applications with the same order. All applications of the same order will be installed after those with lower orders and before those with higher orders. | If a previous application with a lower order failed to install, no applications with this order will install. If any application with this order fails to install, no applications with a higher order will install. |
| Increasing orders      | Application will be installed after those with lower orders and before those with higher orders.                                                                                                                       | If a previous application with a lower order failed to install, this application will not install. If this application fails to install, no application with a higher order will install.                            |

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
<!-- You can link back to the overview, or whatever seems like the logical next thing to read -->
- [Overview](preview-overview.md)


