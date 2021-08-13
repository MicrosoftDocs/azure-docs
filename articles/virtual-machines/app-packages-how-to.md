---
title: Store and share application packages (preview)
description: Learn how to store and share application packages using an Azure Compute Gallery..
author: cynthn
ms.service: virtual-machines
ms.subservice: shared-image-gallery
ms.topic: how-to
ms.workload: infrastructure
ms.date: 07/22/2021
ms.author: cynthn
ms.reviewer: akjosh 
ms.custom: 
ms.category: sig, disks

---

# How to store and share application packages (preview)



### [PowerShell](#tab/powershell)
### [CLI](#tab/cli)
### [Portal](#tab/portal)
### [REST](#tab/rest)

---


> [!IMPORTANT]
> **Feature** is currently in public preview.
> This preview version is provided without a service-level agreement, and we don't recommend it for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).


## Prerequisites

Before you get started, make sure you have the following:

- All files need to be byte aligned. You can do this using PowerShell:

```powershell
$inputFile = \<the file you want to pad>

$fileInfo = Get-Item -Path $inputFile

$remainder = $fileInfo.Length % 512

if ($remainder -ne 0){

$difference = 512 - $remainder

$bytesToPad = \[System.Byte\[\]\]::CreateInstance(\[System.Byte\],
$difference)

Add-Content -Path $inputFile -Value $bytesToPad -Encoding Byte
}
```

## Register the feature

For the public preview, you first need to register the feature:

### [CLI](#tab/cli)

- This article requires version <!-- version number --> or later of the Azure CLI. If using [Azure Cloud Shell](../cloud-shell/quickstart.md), the latest version is already installed.
- Run [az version](/cli/azure/reference-index?#az_version) to find the version. 
- To upgrade to the latest version, run [az upgrade](/cli/azure/reference-index?#az_upgrade).


```azurecli-interactive
az feature register --namespace <!-- feature namespace --> --name <!-- feature name-->
```

Check the status of the feature registration.

```azurecli-interactive
az feature show --namespace <!-- feature namespace --> --name <!-- feature name--> | grep state
```

Check your provider registration.

```azurecli-interactive
az provider show -n <!-- feature namespace --> | grep registrationState
```

If they do not say registered, run the following:

```azurecli-interactive
az provider register -n <!-- feature -->

```

### [PowerShell](#tab/powershell)

Install the latest [Azure PowerShell version](/powershell/azure/install-az-ps), and sign in to an Azure account using [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount).

```azurepowershell-interactive
Register-AzProviderFeature -FeatureName <!-- feature name--> -ProviderNamespace Microsoft.Compute
```

It takes a few minutes for the registration to finish. Use `Get-AzProviderFeature` to check the status of the feature registration:

```azurepowershell-interactive
Get-AzProviderFeature -FeatureName <!-- feature name--> -ProviderNamespace Microsoft.Compute
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

---


### [CLI](#tab/cli)
### [Portal](#tab/portal)
### [REST](#tab/rest)

---
## Do something

<!-- Give this section a short title and then an intro paragraph -->

<!-- In this template, we are going to cover multi ways to do something. For this, we use "tabbed content". Each tab starts with a ### and the type of tool. Delete the sections you aren't covering.-->

### [Portal](#tab/portal2)

<!-- Introduction paragraph if needed. The numbering is automatically controlled, so you can put 1. for each step and the rendering engine will fix the numbers in the live content. -->

1. Open the [portal](https://portal.azure.com).
1. In the search bar, type **<name_of_feature>**.
1. Select **<name_of_feature>**.
1. In the left menu under **Settings**, select **<something>**.
1. In the **<something>** page, select **<something>**.

### [CLI](#tab/cli2)
<!-- Introduction paragraph if needed-->

```azurecli-interactive

```

### [PowerShell](#tab/powershell2)

Create the application definition using `New-AzGalleryApplication`.

```azurepowershell-interactive
$galleryName = myGallery
$rgName = myResourceGroup
$applicationName = myApp
New-AzGalleryApplication -ResourceGroupName $rgName -GalleryName $galleryName -Name $applicationName
```

Create a version of your application using `New-AzGalleryApplicationVersion`.

```azurepowershell-interactive
$version = 1.0.0
New-AzGalleryApplicationVersion -ResourceGroupName $rgName -GalleryName $galleryName -ApplicationName $applicationName -Version $version
```

To add the application to a VM, get the application version and use that to get the version ID. Use the ID to add the application to the VM configuration.

```azurepowershell-interactive
$version = Get-AzGalleryApplicationVersion -ResourceGroupName $rgname -GalleryName $galleryname -ApplicationName $applicationname -Version $version

$vmapp = New-AzVmGalleryApplication -PackageReferenceId $version.Id

$vm = Add-AzVmGalleryApplication -VM $vm -Id $vmapp.Id

Update-AzVm -ResourceGroupName $rgname -VM $vm
```

### [REST](#tab/rest2)

Creating a VM application definition.


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

---

<!-- The three dashes above show that your section of tabbed content is complete. Don't remove them :) -->

## Next steps
<!-- You can link back to the overview, or whatever seems like the logical next thing to read -->
- [Overview](preview-overview.md)



































-------------------------



A current limitation of VM Applications is only page blobs are supported. We will support block blobs in the near future, but in the meantime all blobs must be page aligned before uploading. Use the following script to byte align all three files.

This modifies the file provided, make backups if required.

```azurepowershell-interactive

$inputFile = \<the file you want to pad>

$fileInfo = Get-Item -Path $inputFile

$remainder = $fileInfo.Length % 512

if ($remainder -ne 0){

$difference = 512 - $remainder

$bytesToPad = \[System.Byte\[\]\]::CreateInstance(\[System.Byte\],
$difference)

Add-Content -Path $inputFile -Value $bytesToPad -Encoding Byte

}

## Create the package blobs

All VM Applications must have a package. Fill in the blanks for the following script to upload the byte aligned package to two storage blobs.

```azurepowershell-interactive

Login-AzureRMAccount

$subid = {your subscription id}

Set-AzureRmContext -SubscriptionId $subid

$rg = {your resource group}

$saName = {your storage account name}

$containerName = {container name where your blobs will be stored}

# Uncomment to create a new storage account if you don't already have
one

#New-AzureRmStorageAccount -name $saName -ResourceGroupName $rg -SkuName
"Standard_LRS" -Location $location

$sa = Get-AzureRMStorageAccount -Name $saName -ResourceGroupName $rg

New-AzureStorageContainer -Name $containerName -Context $sa.Context
-Permission Blob

# Create the package blob. This step is required.

$packageFile = ".\\MyAppInstaller.ps1"

$packageBlob = "MyAppPackage"

Set-AzureStorageBlobContent -BlobType Page -File $packageFile -Container
$containerName -Blob $packageBlob -Context $sa.Context

# Create the second package blob.

$packageFile = ".\\CopyIt.bat"

$packageBlob = "MySecondAppPackage"

Set-AzureStorageBlobContent -BlobType Page -File $packageFile -Container
$containerName -Blob $packageBlob -Context $sa.Context

```

## Create the default config blob

The default config is optional, but if provided will be downloaded to each VM unless it is overridden.

```azurepowershell-interactive

Login-AzureRMAccount

$subid = {your subscription id}

Set-AzureRmContext -SubscriptionId $subid

$rg = {your resource group}

$saName = {your storage account name}

$containerName = {container name where your blobs will be stored}

$sa = Get-AzureRMStorageAccount -Name $saName -ResourceGroupName $rg

# Create the default config blob. This is the config that will be used
if not overridden during VM deployment.

# This may be a file, zip, or anything you define.

# Note that the default config is optional.

$configFile = ".\\MyAppInstaller.config"

$configBlob = "MyAppConfig"

Set-AzureStorageBlobContent -BlobType Page -File $configFile -Container
$containerName -Blob $configBlob -Context $sa.Context

```

The second application has no default configuration.

## Create the gallery

```azurepowershell-interactive

$rg = {your resource group}

$galleryName = "MyGallery"

$location = {location for the gallery}

New-AzureRmGallery -ResourceGroupName $rg -Name $galleryName -Location
$location
```

## Create our two VM Applications

While soon these steps will be possible via CLI and the Portal, for now
they require REST calls. Below is one way to do this via Powershell. See
later in this document for the REST API definitions.

```azurepowershell-interactive
$subid = {your subscription id}

Set-AzureRmContext -SubscriptionId $subid

$context = Get-AzureRmContext

$azureRmProfile =
\[Microsoft.Azure.Commands.Common.Authentication.Abstractions.AzureRmProfileProvider\]::Instance.Profile;

$profileClient = New-Object
Microsoft.Azure.Commands.ResourceManager.Common.RMProfileClient($azureRmProfile);

$token =
$profileClient.AcquireAccessToken($context.Subscription.TenantId).AccessToken;

$token

$rg = {your resource group}

$galleryName = "MyGallery"

$appname = "MyFirstApp"

$location = {your gallery location}

$uri =
"https://management.azure.com/subscriptions/$subid/ResourceGroups/$rg/providers/Microsoft.Compute/galleries/$galleryname/applications/$($appname)?api-version=2019-03-01"

$body = "{'location':'$location','properties':{'description':'first VM
app', 'supportedOSType':'Windows'}}"

$params = @{ Headers = @{'authorization'="Bearer $($token)"}; Method =
'Put'; URI = $uri; Body=$body; ContentType= 'application/json' }

$response = Invoke-RestMethod @params

$response \| convertto-json

$appname = "MySecondApp"

$uri =
"https://management.azure.com/subscriptions/$subid/ResourceGroups/$rg/providers/Microsoft.Compute/galleries/$galleryname/applications/$($appname)?api-version=2019-03-01"

$body = "{'location':'$location','properties':{'description':'first VM
app', 'supportedOSType':'Windows'}}"

$params = @{ Headers = @{'authorization'="Bearer $($token)"}; Method =
'Put'; URI = $uri; Body=$body; ContentType= 'application/json' }

$response = Invoke-RestMethod @params

$response \| convertto-json

```

## Create the VM Application versions

VM Application Versions are what we actually deploy to the VM. Each may be placed in multiple regions, with up to three replicas per region. Again, soon these operations will be available through CLI and Portal. In the meantime, direct REST requests are necessary.

The following is the configuration we’ll use for the first application.

```json
{
"location": "$location",
"properties": {
"publishingProfile": {
"source": {
"mediaLink": "$mediaLink",
"defaultConfigurationLink": "$configLink"
},
"manageActions": {
"install": "move .\\\\MyFirstApp .\\\\MyFirstApp.ps1 & powershell.exe -File .\\\\FirstVMApp.ps1",
"remove": "rm .\\\\MyFirstApp.ps1"
},
"targetRegions": \[
{ "name": "$location" }
\]
}
}
}
```

Note that we first have to rename the file MyFirstApp to MyFirstApp.ps1 and only then can we run it. Eventually we will have settings to remove this encumbrance. We run the Powershell script by passing it to Powershell.exe.

The second application is simpler, though we still have to rename.

```json
{
"location": "$location",
"properties": {
"publishingProfile": {
"source": {
"mediaLink": "$mediaLink"
},
"manageActions": {
"install": "move .\\\\MySecondApp .\\\\MySecondApp.bat & .\\\\MySecondApp.bat",
"remove": "rm .\\\\AppDidInstall.txt"
},
"targetRegions": \[
{ "name": "$location" }
\]
}
}
}
```

The following will create both VM application versions.

```azurepowershell-interactive
$subid = {your subscription id}

Set-AzureRmContext -SubscriptionId $subid

$context = Get-AzureRmContext

$azureRmProfile =
\[Microsoft.Azure.Commands.Common.Authentication.Abstractions.AzureRmProfileProvider\]::Instance.Profile;

$profileClient = New-Object
Microsoft.Azure.Commands.ResourceManager.Common.RMProfileClient($azureRmProfile);

$token =
$profileClient.AcquireAccessToken($context.Subscription.TenantId).AccessToken;

$rg = {your resource group}

$galleryName = "MyGallery"

$appname = "MyFirstApp"

$location = {your gallery location}

$saName = {your storage account name}

$uri =
"https://management.azure.com/subscriptions/$subid/ResourceGroups/$rg/providers/Microsoft.Compute/galleries/$galleryname/applications/$appname/versions/1.0?api-version=2019-03-01"

$mediaLink =
"https://$saName.blob.core.windows.net/$containerName/MyAppPackage"

$defaultConfiguration =
"https://$saName.blob.core.windows.net/$containerName/MyAppConfig"

$body = "{'location': '$location', 'properties': { 'publishingProfile':
{ 'source': { 'mediaLink': '$mediaLink', 'defaultConfigurationLink':
'$configLink' }, 'manageActions': { 'install': 'move .\\\\MyFirstApp
.\\\\MyFirstApp.ps1 & powershell.exe -File .\\\\FirstVMApp.ps1',
'remove': 'rm .\\\\MyFirstApp.ps1' }, 'targetRegions': \[ { 'name':
'$location' } \]}}}"

$params = @{ Headers = @{'authorization'="Bearer $($token)"}; Method =
'Put'; URI = $uri; Body=$body; ContentType= 'application/json' }

$response = Invoke-RestMethod @params

$response \| convertto-json

$appname = "MySecondApp"

$uri =
"https://management.azure.com/subscriptions/$subid/ResourceGroups/$rg/providers/Microsoft.Compute/galleries/$galleryname/applications/$($appname)/versions/1.0?api-version=2019-03-01"

$body = "{'location': '$location', 'properties': { 'publishingProfile':
{ 'source': { 'mediaLink': '$mediaLink' }, 'manageActions': { 'install':
'move .\\\\MySecondApp .\\\\MySecondApp.bat & .\\\\FirstSecondApp.bat',
'remove': 'rm .\\\\AppDidInstall.txt' }, 'targetRegions': \[ { 'name':
'$location' } \]}}}"

$params = @{ Headers = @{'authorization'="Bearer $($token)"}; Method =
'Put'; URI = $uri; Body=$body; ContentType= 'application/json' }

$response = Invoke-RestMethod @params

$response \| convertto-json
```

## Deploy the applications to the VM

The best way to deploy the applications to the VM is through a
deployment template. See the appendix at the end of this document for an
example. The following will be the application profile.

```json
{
"galleryApplications": {
"order": 1,
"packageReferenceId":"/subscriptions/$subid/resourceGroups/$rg/providers/Microsoft.Compute/galleries/$galleryName/applications/MyFirstApp/versions/1.0"
},
{
"order": 2,
"packageReferenceId":"/subscriptions/$subid/resourceGroups/$rg/providers/Microsoft.Compute/galleries/$galleryName/applications/MySecondApp/versions/1.0"
}
}
```

## REST API

VM Applications is available in Preview through a REST API as well as
Deployment Templates.

### Creating a VM Application


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



<table>
<colgroup>
<col style="width: 33%" />
<col style="width: 33%" />
<col style="width: 33%" />
</colgroup>
<thead>
<tr class="header">
<th>Field Name</th>
<th>Description</th>
<th>Limitations</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>name</td>
<td>A unique name for the VM Application within the gallery</td>
<td><p>Max length of 117 characters. Allowed characters are uppercase or lowercase letters, digits, hyphen(-), period (.), underscore (_).</p>
<p>Names not allowed to end with period(.).</p></td>
</tr>
<tr class="even">
<td>supportedOSType</td>
<td>Whether this is a Windows or Linux application</td>
<td>“Windows” or “Linux”</td>
</tr>
<tr class="odd">
<td>endOfLifeDate</td>
<td>A future end of life date for the application. Note that this is for customer reference only, and is not enforced.</td>
<td>Valid future date</td>
</tr>
</tbody>
</table>

### Creating a VM Application Version

PUT

/subscriptions/\<**subscriptionId**\>/resourceGroups/\<**resourceGroupName**\>/providers/Microsoft.Compute/galleries/\<**galleryName**\>/applications/\<**applicationName**\>/versions/\<**versionName**\>?api-version=2019-03-01

![](media/image2.emf)

| Field Name                         | Description                                                                                                                                             | Limitations                       |
|------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------|
| location                           | Source location for the VM Application version                                                                                                          | Valid Azure region                |
| mediaLink                          | The url containing the application version package                                                                                                      | Valid and existing storage url    |
| defaultConfigurationLink           | Optional. The url containing the default configuration, which may be overridden at deployment time.                                                     | Valid and existing storage url    |
| Install                            | The command to install the application                                                                                                                  | Valid command for the given OS    |
| Remove                             | The command to remove the application                                                                                                                   | Valid command for the given OS    |
| Update                             | Optional. The command to update the application. If not specified and an update is required, the old version will be removed and the new one installed. | Valid command for the given OS    |
| targetRegions/name                 | The name of a region to which to replicate                                                                                                              | Validate Azure region             |
| targetRegions/regionalReplicaCount | Optional. The number of replicas in the region to create. Defaults to 1.                                                                                | Integer between 1 and 3 inclusive |
| endOfLifeDate                      | A future end of life date for the application version. Note that this is for customer reference only, and is not enforced.                              | Valid future date                 |
| excludeFromLatest                  | If specified, this version will not be considered for latest.                                                                                           | True or false                     |

### Deploying a VM Application to a VM or a VMSS

To add a VM application version to a VM, perform a PUT on the VM.

PUT

/subscriptions/\<**subscriptionId**\>/resourceGroups/\<**resourceGroupName**\>/providers/Microsoft.Compute/virtualMachines/\<**VMName**\>?api-version=2019-03-01

![](media/image3.emf)

PUT

/subscriptions/\<**subscriptionId**\>/resourceGroups/\<**resourceGroupName**\>/providers/Microsoft.Compute/
virtualMachineScaleSets/\<**VMSSName**\>?api-version=2019-03-01

![](media/image4.emf)

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

![](media/image5.emf)

Note that the VM applications have not yet been installed on the VM, so
the value will be empty. Also note that the VMAppExtension will
automatically be installed on the VM. It is not possible to remove it.

To see the current deployment status, run:

Get-AzureRmVM -Status -ResourceGroupName $rg -Name $VMName

![](media/image6.emf)

**Important note for modifying Application Profile for VM or VMSS:**

Modifying VM application profile will get rid of existing extensions.
All extensions (besides VMAppExtension) will have to be added back. This
is a known bug we are deploying a fix for.

If *updating* the application profiles on VMSS, at least one extension
(other than VMAppExtension) must be present in the request. Also, all
extensions not a part of the request will be removed. This is due to a
bug. The easiest way to preserve all existing extensions while modifying
application profile is as follows:

#get vm information

$uri =
"https://management.azure.com/subscriptions/$subid/resourceGroups/$rg/providers/Microsoft.Compute/virtualMachineScaleSets/${vmssName}?api-version=2019-03-01"

$params = @{ Headers = @{'authorization'="Bearer $($token)"}; Method =
'Get'; URI = $uri }

$response = Invoke-RestMethod @params

$response \| convertto-json

$applicationProfile = @{

galleryApplications = @(

@{

order = 1

packageReferenceId =
"/subscriptions/$subid/resourceGroups/$rg/providers/Microsoft.Compute/galleries/$galleryName/applications/$appName/versions/$version"

}

)

}

$virtualMachineProfile = @{ applicationProfile = $applicationProfile;
extensionProfile =
$response.properties.virtualMachineProfile.extensionProfile }

$requestBody = @{

name = $response.name

id = $response.id

location = $response.location

properties = @{ virtualMachineProfile = $virtualMachineProfile }

}

$requestBodyJson = $requestBody \| ConvertTo-Json -Depth 8

$uri =
"https://management.azure.com/subscriptions/$subid/resourceGroups/$rg/providers/Microsoft.Compute/virtualMachineScaleSets/${vmssName}?api-version=2019-03-01"

$params = @{ Headers = @{'authorization'="Bearer $($token)"}; Method =
'PUT'; URI = $uri; Body = $requestBodyJson; ContentType =
'application/json' }

$response = Invoke-RestMethod @params

$response \| convertto-json -Depth 8

### Deleting VM Applications and VM Application Versions

To delete a VM Application. Note that the application **must not** have
any versions in it.

DELETE

/subscriptions/\<**subscriptionId**\>/resourceGroups/\<**resourceGroupName**\>/providers/Microsoft.Compute/galleries/\<**galleryName**\>/applications/\<**applicationName**\>?api-version=2019-03-01

To delete a VM Application version. Note that this will *not* check
whether any VMs have the version. For those who do, the application will
continue unaffected there, but the version may not be installed to any
more VMs.

DELETE

/subscriptions/\<**subscriptionId**\>/resourceGroups/\<**resourceGroupName**\>/providers/Microsoft.Compute/galleries/\<**galleryName**\>/applications/\<**applicationName**\>/versions/\<**versionName**\>?api-version=2019-03-01

### Listing VM Applications and VM Application Versions

To list the VM Applications in a gallery:

GET

/subscriptions/\<**subscriptionId**\>/resourceGroups/\<**resourceGroupName**\>/providers/Microsoft.Compute/galleries/\<**galleryName**\>/applications?api-version=2019-03-01

Sample response:

![](media/image7.emf)

To list the VM Application Version in the VM Application

GET

/subscriptions/\<**subscriptionId**\>/resourceGroups/\<**resourceGroupName**\>/providers/Microsoft.Compute/galleries/\<**galleryName**\>/applications/\<**applicationName>/**?api-version=2019-03-01

Sample response:

![](media/image8.emf)

### Deployment Template

A sample deployment template is provided in the Appendix at the end of
this document.

 

## Things to consider while authoring install/update/remove commands

 

### Download directory and working directory 

The download location of the application package and the configuration
file is  
 

Windows:
C:\\Packages\\Plugins\\Microsoft.CPlat.Core.VMApplicationManagerWindows\\1.0.3\\Downloads\\\<appname>\\\<app
version>

Linux:
/var/lib/waagent/Microsoft.CPlat.Core.VMApplicationManagerLinux/\<appname>/\<app
version>  
  
The install/update/remove commands have the working directory already
set to the download location, so the commands can be written assuming
the application package and the configuration are in the current
directory.

### Command interpreter 

 

The default command interpreter on Windows is cmd.exe and the default
command interpreter on linux is /bin/sh. It is possible to use a
different interpreter as long as it is installed on the machine, simply
by invoking the executable and passing the command to it. For example to
have your command run in PowerShell on windows instead of cmd, you can
pass "powershell.exe -Command '\<powershell commmand>' "

 

 

### Naming of the Application package and the configuration file

VMApps renames the application package as the \<appname> and the
configuration name as \<appname>\_config. The install/update/remove
command must be written with this consideration. In an upcoming update,
we will add an option to the VMApp publisher to specify how to name the
downloaded application package and application configuration file  
  
Windows example, if my gallery application name was 'firefoxwindows ',
my install command should be

move . & firefox.exe /S

 

Note: cmd expects executable files to have extension .exe, so the
application package file was renamed before it was invoked. The command
like parameter '/S' signals the installer to run in silent mode

 

Linux example, if my gallery application name was 'powershell', my
install command should be

tar -xf powershell && dpkg -i ./liblttng-ust-ctl4_2.10.1-1_amd64.deb
./liburcu6_0.10.1-1ubuntu1_amd64.deb ./liblttng-ust0_2.10.1-1_amd64.deb
./powershell_7.1.2-1.ubuntu.18.04_amd64.deb  
  
Note: the application package in this example is a compressed archive.
'tar -xf' is used to extract it to the current directory. The next part
of the command invokes Debian package manager to perform install on the
files that we know will be extracted in the previous operation

 

If a configurationReference was provided during creation of the gallery
application version, and the install/update/remove command want to pass
it to the application package file, they just need to refer to the file
\<appname>\_config.

 

Example: in the windows example, if we also needed to pass a config file
to the application package file, which is an executable, the install
command would be  
move . & firefox.exe /S -config firefox_config  
 

### How updates are handled

Say you want to update application A from version 1.0.0 to 1.1.0. If
1.1.0 has an update command specified. Only that would be invoked. If
1.1.0 doesn’t have an update command specified, a remove will be invoked
on 1.0.0 then an install will be invoked on 1.1.0. Update commands
should be written with the consideration that it could be updating from
any older version of the VM Application.

## Tips and tricks for creating VM Applications on Windows

 

Most 3rd party applications in Windows are available as .exe or .msi
installers. Some are also available as extract and run zip files. Let us
look at the best practices for each of them.

 

#### Executable .exe installer

Installer executables typically launch a GUI windows and require the
user to click through the GUI for the installation to proceed. This is
not compatible with VMApps. If the installer supports a silent mode, it
can be used with VMApps by invoking the executable and passing the
argument that makes it run in silent mode.

 

Cmd.exe also expects executable files to have the extension .exe, so it
is required to rename the file to have .exe extension. In the upcoming
version, the user would be able to specify the name that the application
package file and the application configuration files would be named
after they are downloaded, so in the future renaming the files in the
install/update/remove command would not be required.

 

Example, if I wanted to create a VMApp for Firefox for windows which
ships as an executable, I will have the following as install command. My
VM Application (Gallery application) is called 'firefoxwindows', so I
author the command assuming that the application package file is present
in the current directory  
"move . & firefox.exe /S -config firefox_config"  
  
This installer executable file doesn't support an uninstall command, so
to figure out an appropriate uninstall command, I look up the registry
on a test machine to know here the uninstaller is located.

Computer\\HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\\<installed
application name>\\UninstallString and use that as my remove command

'\\"C:\\\\Program Files\\\\Mozilla Firefox\\\\uninstall\\\\helper.exe\\"
/S'

 

#### .msi installer

For command line execution of .msi installers, the commands to
install/remove an application should invoke msiexec. Typically, msiexec
runs as its own separate process and cmd doesn't wait for it to
complete, which can lead to problems when installing more than one VMApp
on the VM/VMSS. Start command can be used with msiexec to ensure that
the installation completes before the command returns

Example install command

"start /wait %windir%\\\\system32\\\\msiexec.exe /i myapp /quiet
/forcerestart /log myapp_install.log"

Example remove command

"start /wait %windir%\\\\system32\\\\msiexec.exe /x $appname /quiet
/forcerestart /log ${appname}\_uninstall.log"

 

#### Zipped files

For installation, just unzip the contents of the application package to
the desired destination.

Example install command

"mkdir C:\\\\myapp && powershell.exe -Command \\"Expand-Archive -Path
myapp -DestinationPath C:\\\\myapp\\" "

Example remove command

"rmdir /S /Q C:\\\\myapp"

 

## Tips and tricks for creating VM Applications on Linux

 

#### .tar.gz files

These are compressed archives and can simply be extracted to a desired
location. Please check the installation instructions of the package to
know where to extract them. If .tar.gz file contains source code, please
refer to the instructions for the package for how to install from
source.

Example install command to install golang on a linux machine

"tar -C /usr/local -xzf go_linux"

Example remove command

"rm -rf /usr/local/go"

 

#### .deb.rpm and other platform specific packages

While it is possible to download individual packages for platform
specific package managers, they usually do not contain dependencies. To
install an application from such files, you must also include all
dependencies in the application package, or have the system package
manager download the dependencies through the repositories that are
available to the VM/VMSS. If you are working with a VM/VMSS with
restricted internet access, you must package all the dependencies
yourself.

 

Figuring out the dependencies is a bit tricky for these packages. There
are third party tools that show you the entire dependency tree. Without
using 3rd party tools, on Ubuntu, you can run "apt-get install \<name>
--simulate" to determine all the packages that will be installed for the
"apt-get install \<name>" command. Then you can use that output to
download all .deb files in that list to create an archive that can be
used as the application package. The downside to this method is that is
doesn't show the dependencies that are already installed on the VM. If
you ran the command "apt-get install \<name> --simulate" on a pristine
machine, which is equivalent to the Azure VM/VMSS that you intend to
install the package on, it shouldn't be an issue.  
  
Example, to create a VMApp version for powershell for ubuntu, run the
command "apt-get install powershell --simulate" on a freshly created
Ubuntu VM. Check the output of the line "The following NEW packages will
be installed" which has the following packages liblttng-ust-ctl4,
liblttng-ust0, liburcu6, powershell. Download these files using "apt-get
download " and create a tar archive with all files at the root level.
This tar archive will be the application package file. The install
command in this case is

"tar -xf powershell && dpkg -i ./liblttng-ust-ctl4_2.10.1-1_amd64.deb
./liburcu6_0.10.1-1ubuntu1_amd64.deb ./liblttng-ust0_2.10.1-1_amd64.deb
./powershell_7.1.2-1.ubuntu.18.04_amd64.deb"

And the remove command is

"dpkg -r powershell && apt autoremove"

Note: it is preferrable to use apt autoremove rather than explicitly
trying to remove all the dependencies as you may have installed other
applications could have overlapping dependencies, and in that case, the
explicit remove command would fail.

 

In case you don't want to resolve the dependencies yourself and apt/rpm
is able to connect to the repositories, you can install an application
with just one .deb/.rpm file and let apt/rpm handle the dependencies.

Example install command

"dpkg -i \<appname> \|\| apt --fix-broken install -y"

## Troubleshooting

The VM application extension always returns a success regardless of
whether any VM app referenced in the Application Profile failed while
being installed/updated/removed. The VM Application extension will only
report the extension status as failure when there is a problem with the
extension or the underlying infrastructure. To know whether a particular
VM application was successfully added to the VM/VMSS instance, please
check the message of the VMApplication extension using the command.

Read more about getting the status of VM extensions
[here](https://docs.microsoft.com/en-us/azure/virtual-machines/extensions/features-windows#view-extension-status)

To get status of VMSS extensions use the command

Get-AzureRmVmss -name \<VMSS name> -ResourceGroupName \<resource group
name> -InstanceView \| convertto-json

### Status file for VMApplication extension

- Windows:
    C:\\Packages\\Plugins\\Microsoft.CPlat.Core.VMApplicationManagerWindows\\1.0.3\\Status

- Linux:
    /var/lib/waagent/Microsoft.CPlat.Core.VMApplicationManagerLinux-1.0.3/status

Status file gives you a summary of the VMApps that are installed on the
VM/VM scale set instance, and a list of operations that were executed
for the last update the Application Profile. This is available via ARM
when querying the status of the VMApplication extension.

An example status file

\[

{

"version": 1,

"timestampUTC": "2021-04-01T04:49:59Z",

"status": {

"operation": "Enable",

"status": "success",

"formattedMessage": {

"lang": "en",

"message": "Enable succeeded: {\\n \\"CurrentState\\": \[\\n {\\n
\\"applicationName\\": \\"powershell\\",\\n \\"version\\":
\\"7.1.2\\",\\n \\"result\\": \\"Install SUCCESS\\"\\n }\\n \],\\n
\\"ActionsPerformed\\": \[\\n {\\n \\"package\\": \\"powershell\\",\\n
\\"version\\": \\"7.1.2\\",\\n \\"operation\\": \\"Install\\",\\n
\\"result\\": \\"SUCCESS\\"\\n }\\n \]\\n}"

}

}

}

\]

### Downloaded packages and stdout, stderr logs of the install/remove/update command

- Windows:
    C:\\Packages\\Plugins\\Microsoft.CPlat.Core.VMApplicationManagerWindows\\\<extension
    version>\\Downloads\\\<appname>\\\<app version>

- Linux:
    /var/lib/waagent/Microsoft.CPlat.Core.VMApplicationManagerLinux/\<appname>/\<app
    version>

The directory mentioned above contains the location of the downloaded
application package, the configuration file (if provided) and the stdout
and stderr output of the install/update/remove command as a text file.
If something went wrong during the installation, update or removal of a
VM application, please check this directory.

Tip: If you install command writes to stdout/stderr, the output should
be found in this directory. If it writes to another file, this is the
current directory for relative paths

Note: when an application is removed, and the remove command succeeds,
this directory is deleted.

### Local application registry

- Windows:
    C:\\Packages\\Plugins\\Microsoft.CPlat.Core.VMApplicationManagerWindows\\1.0.3\\RuntimeSettings\\applicationRegistry.active

- Linux:
    /var/lib/waagent/Microsoft.CPlat.Core.VMApplicationManagerLinux-1.0.3/config/applicationRegistry.active

Not to be confused with Windows registry, this file keeps track of all
the VMApps that are currently installed, and VMApps whose installation
was attempted on the VM or scale set instance.

## Appendix – Sample ARM template

```json

{

    "$schema":
"https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",

    "contentVersion": "1.0.0.0",

    "parameters": {

        "adminUsername": {

            "type": "string",

            "metadata": {

                "description": "Username for the Virtual Machine."

            }

        },

        "adminPassword": {

            "type": "securestring",

            "minLength": 12,

            "metadata": {

                "description": "Password for the Virtual Machine."

            }

        },

        "dnsLabelPrefix": {

            "type": "string",

            "defaultValue": "\[toLower(concat(parameters('VMName'),'-',
uniqueString(resourceGroup().id, parameters('VMName'))))\]",

            "metadata": {

                "description": "Unique DNS Name for the Public IP used
to access the Virtual Machine."

            }

        },

        "publicIpName": {

            "type": "string",

            "defaultValue": "myPublicIP",

            "metadata": {

                "description": "Name for the Public IP used to access
the Virtual Machine."

            }

        },

        "publicIPAllocationMethod": {

            "type": "string",

            "defaultValue": "Dynamic",

            "allowedValues": \[

                "Dynamic",

                "Static"

            \],

            "metadata": {

                "description": "Allocation method for the Public IP used
to access the Virtual Machine."

            }

        },

        "publicIpSku": {

            "type": "string",

            "defaultValue": "Basic",

            "allowedValues": \[

                "Basic",

                "Standard"

            \],

            "metadata": {

                "description": "SKU for the Public IP used to access the
Virtual Machine."

            }

        },

        "OSVersion": {

            "type": "string",

            "defaultValue": "2019-Datacenter",

            "allowedValues": \[

                "2008-R2-SP1",

                "2012-Datacenter",

                "2012-R2-Datacenter",

                "2016-Nano-Server",

                "2016-Datacenter-with-Containers",

                "2016-Datacenter",

                "2019-Datacenter",

                "2019-Datacenter-Core",

                "2019-Datacenter-Core-smalldisk",

                "2019-Datacenter-Core-with-Containers",

                "2019-Datacenter-Core-with-Containers-smalldisk",

                "2019-Datacenter-smalldisk",

                "2019-Datacenter-with-Containers",

                "2019-Datacenter-with-Containers-smalldisk"

            \],

            "metadata": {

                "description": "The Windows version for the VM. This
will pick a fully patched image of this given Windows version."

            }

        },

        "VMSize": {

            "type": "string",

            "defaultValue": "Standard_D2_v3",

            "metadata": {

                "description": "Size of the virtual machine."

            }

        },

        "location": {

            "type": "string",

            "defaultValue": "\[resourceGroup().location\]",

            "metadata": {

                "description": "Location for all resources."

            }

        },

        "VMName": {

            "type": "string",

            "defaultValue": "simple-VM",

            "metadata": {

                "description": "Name of the virtual machine."

            }

        },

        "packageReferenceId": {

            "type": "string",

            "metadata": {

                "description": "ARM id of the VM application version"

            }

        }

    },

    "variables": {

        "storageAccountName": "\[concat('bootdiags',
uniquestring(resourceGroup().id))\]",

        "nicName": "myVMNic",

        "addressPrefix": "10.0.0.0/16",

        "subnetName": "Subnet",

        "subnetPrefix": "10.0.0.0/24",

        "virtualNetworkName": "MyVNET",

        "subnetRef":
"\[resourceId('Microsoft.Network/virtualNetworks/subnets',
variables('virtualNetworkName'), variables('subnetName'))\]",

        "networkSecurityGroupName": "default-NSG"

    },

    "resources": \[

        {

            "type": "Microsoft.Storage/storageAccounts",

            "apiVersion": "2019-06-01",

            "name": "\[variables('storageAccountName')\]",

            "location": "\[parameters('location')\]",

            "sku": {

                "name": "Standard_LRS"

            },

            "kind": "Storage",

            "properties": {}

        },

        {

            "type": "Microsoft.Network/publicIPAddresses",

            "apiVersion": "2020-06-01",

            "name": "\[parameters('publicIPName')\]",

            "location": "\[parameters('location')\]",

            "sku": {

                "name": "\[parameters('publicIpSku')\]"

            },

            "properties": {

                "publicIPAllocationMethod":
"\[parameters('publicIPAllocationMethod')\]",

                "dnsSettings": {

                    "domainNameLabel":
"\[parameters('dnsLabelPrefix')\]"

                }

            }

        },

        {

            "type": "Microsoft.Network/networkSecurityGroups",

            "apiVersion": "2020-06-01",

            "name": "\[variables('networkSecurityGroupName')\]",

            "location": "\[parameters('location')\]",

            "properties": {

                "securityRules": \[

                    {

                        "name": "default-allow-3389",

                        "properties": {

                            "priority": 1000,

                            "access": "Allow",

                            "direction": "Inbound",

                            "destinationPortRange": "3389",

                            "protocol": "Tcp",

                            "sourcePortRange": "\*",

                            "sourceAddressPrefix": "\*",

                            "destinationAddressPrefix": "\*"

                        }

                    }

                \]

            }

        },

        {

            "type": "Microsoft.Network/virtualNetworks",

            "apiVersion": "2020-06-01",

            "name": "\[variables('virtualNetworkName')\]",

            "location": "\[parameters('location')\]",

            "dependsOn": \[

                "\[resourceId('Microsoft.Network/networkSecurityGroups',
variables('networkSecurityGroupName'))\]"

            \],

            "properties": {

                "addressSpace": {

                    "addressPrefixes": \[

                        "\[variables('addressPrefix')\]"

                    \]

                },

                "subnets": \[

                    {

                        "name": "\[variables('subnetName')\]",

                        "properties": {

                            "addressPrefix":
"\[variables('subnetPrefix')\]",

                            "networkSecurityGroup": {

                                "id":
"\[resourceId('Microsoft.Network/networkSecurityGroups',
variables('networkSecurityGroupName'))\]"

                            }

                        }

                    }

                \]

            }

        },

        {

            "type": "Microsoft.Network/networkInterfaces",

            "apiVersion": "2020-06-01",

            "name": "\[variables('nicName')\]",

            "location": "\[parameters('location')\]",

            "dependsOn": \[

                "\[resourceId('Microsoft.Network/publicIPAddresses',
parameters('publicIPName'))\]",

                "\[resourceId('Microsoft.Network/virtualNetworks',
variables('virtualNetworkName'))\]"

            \],

            "properties": {

                "ipConfigurations": \[

                    {

                        "name": "ipconfig1",

                        "properties": {

                            "privateIPAllocationMethod": "Dynamic",

                            "publicIPAddress": {

                                "id":
"\[resourceId('Microsoft.Network/publicIPAddresses',
parameters('publicIPName'))\]"

                            },

                            "subnet": {

                                "id": "\[variables('subnetRef')\]"

                            }

                        }

                    }

                \]

            }

        },

        {

            "type": "Microsoft.Compute/virtualMachines",

            "apiVersion": "2020-06-01",

            "name": "\[parameters('VMName')\]",

            "location": "\[parameters('location')\]",

            "dependsOn": \[

                "\[resourceId('Microsoft.Storage/storageAccounts',
variables('storageAccountName'))\]",

                "\[resourceId('Microsoft.Network/networkInterfaces',
variables('nicName'))\]"

            \],

            "properties": {

                "hardwareProfile": {

                    "VMSize": "\[parameters('VMSize')\]"

                },

                "osProfile": {

                    "computerName": "\[parameters('VMName')\]",

                    "adminUsername": "\[parameters('adminUsername')\]",

                    "adminPassword": "\[parameters('adminPassword')\]"

                },

                "storageProfile": {

                    "imageReference": {

                        "publisher": "MicrosoftWindowsServer",

                        "offer": "WindowsServer",

                        "sku": "\[parameters('OSVersion')\]",

                        "version": "latest"

                    },

                    "osDisk": {

                        "createOption": "FromImage",

                        "managedDisk": {

                            "storageAccountType": "StandardSSD_LRS"

                        }

                    },

                    "dataDisks": \[

                        {

                            "diskSizeGB": 1023,

                            "lun": 0,

                            "createOption": "Empty"

                        }

                    \]

                },

                "networkProfile": {

                    "networkInterfaces": \[

                        {

                            "id":
"\[resourceId('Microsoft.Network/networkInterfaces',
variables('nicName'))\]"

                        }

                    \]

                },

                "applicationProfile": {

                    "galleryApplications": \[

                        {

                            "packageReferenceId":
"\[parameters('packageReferenceId')\]"

                        }

                    \]

                },

                "diagnosticsProfile": {

                    "bootDiagnostics": {

                        "enabled": true,

                        "storageUri":
"\[reference(resourceId('Microsoft.Storage/storageAccounts',
variables('storageAccountName'))).primaryEndpoints.blob\]"

                    }

                }

            }

        }

    \],

    "outputs": {

        "hostname": {

            "type": "string",

            "value":
"\[reference(parameters('publicIPName')).dnsSettings.fqdn\]"

        }

    }

}
```