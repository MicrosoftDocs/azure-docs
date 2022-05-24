---
title: Create an Azure Image Builder template
description: Learn how to create a template to use with Azure Image Builder.
author: kof-f
ms.author: kofiforson
ms.reviewer: cynthn
ms.date: 01/10/2022
ms.topic: reference
ms.service: virtual-machines
ms.subservice: image-builder
ms.custom: devx-track-azurepowershell
---
# Create an Azure Image Builder template 

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets 

Azure Image Builder uses a .json file to pass information into the Image Builder service. In this article we will go over the sections of the json file, so you can build your own. To see examples of full .json files, see the [Azure Image Builder GitHub](https://github.com/Azure/azvmimagebuilder/tree/main/quickquickstarts).

This is the basic template format:

```json
  { 
    "type": "Microsoft.VirtualMachineImages/imageTemplates", 
    "apiVersion": "2021-10-01", 
    "location": "<region>", 
    "tags": {
      "<name>": "<value>",
      "<name>": "<value>"
    },
    "identity": {},			 
    "properties": {
      "buildTimeoutInMinutes": <minutes>, 
      "stagingResourceGroup": "/subscriptions/<subscriptionID>/resourceGroups/<stagingResourceGroupName>",
      "vmProfile": {
        "vmSize": "<vmSize>",
        "proxyVmSize": "<vmSize>",
        "osDiskSizeGB": <sizeInGB>,
        "vnetConfig": {
          "subnetId": "/subscriptions/<subscriptionID>/resourceGroups/<vnetRgName>/providers/Microsoft.Network/virtualNetworks/<vnetName>/subnets/<subnetName>"
        },
	"userAssignedIdentities": [
          "/subscriptions/<subscriptionID>/resourceGroups/<identityRgName>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<identityName1>",
	  "/subscriptions/<subscriptionID>/resourceGroups/<identityRgName>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<identityName2>",
	  "/subscriptions/<subscriptionID>/resourceGroups/<identityRgName>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<identityName3>",
	  ...
      ]
      },
      "source": {}, 
      "customize": [], 
      "validate": {},
      "distribute": [] 
    } 
  } 
```

## Type and API version

The `type` is the resource type, which must be `"Microsoft.VirtualMachineImages/imageTemplates"`. The `apiVersion` will change over time as the API changes, but should be `"2021-10-01"` for now.

```json
    "type": "Microsoft.VirtualMachineImages/imageTemplates",
    "apiVersion": "2021-10-01",
```

## Location

The location is the region where the custom image will be created. The following regions are supported:

- East US
- East US 2
- West Central US
- West US
- West US 2
- West US 3
- South Central US
- North Europe
- West Europe
- South East Asia
- Australia Southeast
- Australia East
- UK South
- UK West
- Brazil South
- Canada Central
- Central India
- Central US
- France Central
- Germany West Central
- Japan East
- North Central US
- Norway East
- Switzerland North
- Jio India West
- UAE North
- East Asia
- Korea Central
- South Africa North


```json
    "location": "<region>",
```

### Data Residency
The Azure VM Image Builder service doesn't store or process customer data outside regions that have strict single region data residency requirements when a customer requests a build in that region. In the event of a service outage for regions that have data residency requirements, you will need to create templates in a different region and geography.

### Zone Redundancy
Distribution supports zone redundancy, VHDs are distributed to a Zone Redundant Storage (ZRS) account by default and the Azure Compute Gallery (formerly known as Shared Image Gallery) version will support a [ZRS storage type](../disks-redundancy.md#zone-redundant-storage-for-managed-disks) if specified.
 
## vmProfile
## buildVM
Image Builder will use a default SKU size of "Standard_D1_v2" for Gen1 images and "Standard_D2ds_v4" for Gen2 images. The generation is defined by the image you specify in the `source`. You can override this and may wish to do this for these reasons:
1. Performing customizations that require increased memory, CPU and handling large files (GBs).
2. Running Windows builds, you should use "Standard_D2_v2" or equivalent VM size.
3. Require [VM isolation](../isolation.md).
4. Customize an image that requires specific hardware. For example, for a GPU VM, you need a GPU VM size. 
5. Require end to end encryption at rest of the build VM, you need to specify the support build [VM size](../azure-vms-no-temp-disk.yml) that don't use local temporary disks.
 
This is optional.

## osDiskSizeGB

By default, Image Builder will not change the size of the image, it will use the size from the source image. You can **only** increase the size of the OS Disk (Win and Linux), this is optional, and a value of 0 means leave the same size as the source image. You cannot reduce the OS Disk size to smaller than the size from the source image.

```json
 {
    "osDiskSizeGB": 100
 },
```

## vnetConfig
If you don't specify any VNET properties, then Image Builder will create its own VNET, Public IP, and network security group (NSG). The Public IP is used for the service to communicate with the build VM, however if you don't want a Public IP or want Image Builder to have access to your existing VNET resources, such as configuration servers (DSC, Chef, Puppet, Ansible), file shares, then you can specify a VNET. For more information, review the [networking documentation](image-builder-networking.md), this is optional.

```json
    "vnetConfig": {
        "subnetId": "/subscriptions/<subscriptionID>/resourceGroups/<vnetRgName>/providers/Microsoft.Network/virtualNetworks/<vnetName>/subnets/<subnetName>"
        }
    }
```
## Tags

These are key/value pairs you can specify for the image that's generated.

## Identity

There are two ways to add user assigned identities explained below.

### User Assigned Identity for Azure Image Builder image template resource

Required - For Image Builder to have permissions to read/write images, read in scripts from Azure Storage you must create an Azure User-Assigned Identity, that has permissions to the individual resources. For details on how Image Builder permissions work, and relevant steps, please review the [documentation](image-builder-user-assigned-identity.md).


```json
    "identity": {
        "type": "UserAssigned",
        "userAssignedIdentities": {
            "<imgBuilderId>": {}
        }
    },
```


The Image Builder service User Assigned Identity:
* Supports a single identity only
* Doesn't support custom domain names

To learn more, see [What is managed identities for Azure resources?](../../active-directory/managed-identities-azure-resources/overview.md).
For more information on deploying this feature, see [Configure managed identities for Azure resources on an Azure VM using Azure CLI](../../active-directory/managed-identities-azure-resources/qs-configure-cli-windows-vm.md#user-assigned-managed-identity).

### User Assigned Identity for the Image Builder Build VM

This field is only available in API versions 2021-10-01 and newer.

Optional - The Image Builder Build VM, that is created by the Image Builder service in your subscription, is used to build and customize the image. For the Image Builder Build VM to have permissions to authenticate with other services like Azure Key Vault in your subscription, you must create one or more Azure User Assigned Identities that have permissions to the individual resources. Azure Image Builder can then associate these User Assigned Identities with the Build VM. Customizer scripts running inside the Build VM can then fetch tokens for these identities and interact with other Azure resources as needed. Please be aware, the user assigned identity for Azure Image Builder must have the "Managed Identity Operator" role assignment on all the user assigned identities for Azure Image Builder to be able to associate them to the build VM.

> [!NOTE]
> Please be aware that multiple identities can be specified for the Image Builder Build VM, including the identity you created for the [image template resource](#user-assigned-identity-for-azure-image-builder-image-template-resource). By default, the identity you created for the image template resource will not automatically be added to the build VM.

```json
    "properties": { 
      "vmProfile": {
	"userAssignedIdentities": [
          "/subscriptions/<subscriptionID>/resourceGroups/<identityRgName>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<identityName>"
        ]
      },
    },
```

The Image Builder Build VM User Assigned Identity:
* Supports a list of one or more user assigned managed identities to be configured on the VM
* Supports cross subscription scenarios (identity created in one subscription while the image template is created in another subscription under the same tenant)
* Doesn't support cross tenant scenarios (identity created in one tenant while the image template is created in another tenant)

To learn more, see [How to use managed identities for Azure resources on an Azure VM to acquire an access token](../../active-directory/managed-identities-azure-resources/how-to-use-vm-token.md) and [How to use managed identities for Azure resources on an Azure VM for sign-in](../../active-directory/managed-identities-azure-resources/how-to-use-vm-sign-in.md).

## Properties: stagingResourceGroup
The `stagingResourceGroup` field contains information about the staging resource group that the Image Builder service will create for use during the image build process. The `stagingResourceGroup` is an optional field for anyone who wants more control over the resource group created by Image Builder during the image build process. You can create your own resource group and specify it in the `stagingResourceGroup` section or have Image Builder create one on your behalf.

```json			 
    "properties": {
      "stagingResourceGroup": "/subscriptions/<subscriptionID>/resourceGroups/<stagingResourceGroupName>"
    }
```

> [!NOTE]
> Any staging resource group specified for use by the Image Builder service must be empty (no resources inside), in the same region as the image template and have either "Contributor" or "Owner" RBAC assigned to the identity appointed to the Azure Image Builder image template resource.

### Template Creation Scenarios

#### The stagingResourceGroup field is left empty
If the `stagingResourceGroup` field is not specified or specified with an empty string, the Image Builder service will create a staging resource group with the default name convention "IT_***". The staging resource group will have the default tags applied to it: `createdBy`, `imageTemplateName`, `imageTemplateResourceGroupName`. Also, the staging resource group will have the default RBAC applied to it, which is "Contributor".

#### The stagingResourceGroup field is specified with a resource group that exists
If the `stagingResourceGroup` field is specified with a resource group that does exist, then the Image Builder service will check to make sure the resource group is empty (no resources inside), in the same region as the image template and has either "Contributor" or "Owner" RBAC assigned to the identity appointed to the Azure Image Builder image template resource. If any of the aforementioned requirements are not met an error will be thrown. The staging resource group will have the following tags added to it: `usedBy`, `imageTemplateName`, `imageTemplateResourceGroupName`. Preexisting tags are not deleted.

#### The stagingResourceGroup field is specified with a resource group that DOES NOT exist
If the `stagingResourceGroup` field is specified with a resource group that does not exist, then the Image Builder service will create a staging resource group with the name provided in the `stagingResourceGroup` field. Of course, there will be an error if the given name does not meet Azure naming requirements for resource groups. The staging resource group will have the default tags applied to it: `createdBy`, `imageTemplateName`, `imageTemplateResourceGroupName`. By default the identity appointed to the Azure Image Builder image template resource will have the "Contributor" RBAC applied to it in the resource group.

### Template Deletion
Any staging resource group created by the Image Builder service will be deleted after the image template is deleted. This includes staging resource groups that were specified in the `stagingResourceGroup` field, but did not exist prior to the image build. 

If Image Builder did not create the staging resource group, but it did create resources inside of it, those resources will be deleted after the image build process as long as the Image Builder service has the appropriate permissions or role required to delete resources. 


## Properties: source

The `source` section contains information about the source image that will be used by Image Builder. Image Builder currently only natively supports creating Hyper-V generation (Gen1) 1 images to the Azure Compute Gallery (SIG) or managed image. If you want to create Gen2 images, then you need to use a source Gen2 image, and distribute to VHD. After, you will then need to create a managed image from the VHD, and inject it into the SIG as a Gen2 image.

The API requires a `SourceType` that defines the source for the image build, currently there are three types:
- PlatformImage - indicated the source image is a Marketplace image.
- ManagedImage - use this when starting from a regular managed image.
- SharedImageVersion - this is used when you're using an image version in an Azure Compute Gallery as the source.

> [!NOTE]
> When using existing Windows custom images, you can run the Sysprep command up to 3 times on a single Windows 7 or Windows Server 2008 R2 image, or 1001 times on a single Windows image for later versions; for more information, see the [sysprep](/windows-hardware/manufacture/desktop/sysprep--generalize--a-windows-installation#limits-on-how-many-times-you-can-run-sysprep) documentation.

### PlatformImage source 
Azure Image Builder supports Windows Server and client, and Linux  Azure Marketplace images, see [Learn about Azure Image Builder](../image-builder-overview.md#os-support) for the full list. 

```json
        "source": {
            "type": "PlatformImage",
            "publisher": "Canonical",
            "offer": "UbuntuServer",
            "sku": "18.04-LTS",
            "version": "latest"
        },	
```


The properties here are the same that are used to create VM's, using AZ CLI, run the below to get the properties: 
 
```azurecli-interactive
az vm image list -l westus -f UbuntuServer -p Canonical --output table --all 
```

You can use `latest` in the version, the version is evaluated when the image build takes place, not when the template is submitted. If you use this functionality with the Azure Compute Gallery destination, you can avoid resubmitting the template, and rerun the image build at intervals, so your images are recreated from the most recent images.

#### Support for Market Place Plan Information
You can also specify plan information, for example:
```json
    "source": {
        "type": "PlatformImage",
        "publisher": "RedHat",
        "offer": "rhel-byos",
        "sku": "rhel-lvm75",
        "version": "latest",
        "planInfo": {
            "planName": "rhel-lvm75",
            "planProduct": "rhel-byos",
            "planPublisher": "redhat"
       }
```
### ManagedImage source

Sets the source image as an existing managed image of a generalized VHD or VM.

> [!NOTE]
> The source managed image must be of a supported OS and the image must reside in the same subscription and region as your Azure Image Builder template.

```json
        "source": { 
            "type": "ManagedImage", 
            "imageId": "/subscriptions/<subscriptionId>/resourceGroups/{destinationResourceGroupName}/providers/Microsoft.Compute/images/<imageName>"
        }
```

The `imageId` should be the ResourceId of the managed image. Use `az image list` to list available images.


### SharedImageVersion source
Sets the source image as an existing image version in an Azure Compute Gallery.

> [!NOTE]
> The source shared image version must be of a supported OS and the image version must reside in the same region as your Azure Image Builder template, if not, please replicate the image version to the Image Builder Template region.


```json
        "source": { 
            "type": "SharedImageVersion", 
            "imageVersionID": "/subscriptions/<subscriptionId>/resourceGroups/<resourceGroup>/p  roviders/Microsoft.Compute/galleries/<sharedImageGalleryName>/images/<imageDefinitionName/versions/<imageVersion>" 
        } 
```

The `imageVersionId` should be the ResourceId of the image version. Use [az sig image-version list](/cli/azure/sig/image-version#az-sig-image-version-list) to list image versions.


## Properties: buildTimeoutInMinutes

By default, the Image Builder will run for 240 minutes. After that, it will timeout and stop, whether or not the image build is complete. If the timeout is hit, you will see an error similar to this:

```text
[ERROR] Failed while waiting for packerizer: Timeout waiting for microservice to
[ERROR] complete: 'context deadline exceeded'
```

If you don't specify a buildTimeoutInMinutes value, or set it to 0, this will use the default value. You can increase or decrease the value, up to the maximum of 960mins (16hrs). For Windows, we don't recommend setting this below 60 minutes. If you find you're hitting the timeout, review the [logs](image-builder-troubleshoot.md#customization-log), to see if the customization step is waiting on something like user input. 

If you find you need more time for customizations to complete, set this to what you think you need, with a little overhead. But, don't set it too high because you might have to wait for it to timeout before seeing an error. 

> [!NOTE]
> If you don't set the value to 0, the minimum supported value is 6 minutes. Using values 1 through 5 will fail.

## Properties: customize

Image Builder supports multiple `customizers`. Customizers are functions that are used to customize your image, such as running scripts, or rebooting servers. 

When using `customize`: 
- You can use multiple customizers
- Customizers execute in the order specified in the template.
- If one customizer fails, then the whole customization component will fail and report back an error.
- It is strongly advised you test the script thoroughly before using it in a template. Debugging the script on your own VM will be easier.
- don't put sensitive data in the scripts. 
- The script locations need to be publicly accessible, unless you're using [MSI](./image-builder-user-assigned-identity.md).

```json
        "customize": [
            {
                "type": "Shell",
                "name": "<name>",
                "scriptUri": "<path to script>",
                "sha256Checksum": "<sha256 checksum>"
            },
            {
                "type": "Shell",
                "name": "<name>",
                "inline": [
                    "<command to run inline>",
                ]
            }

        ],
```		

 
The customize section is an array. Azure Image Builder will run through the customizers in sequential order. Any failure in any customizer will fail the build process. 

> [!NOTE]
> Inline commands can be viewed in the image template definition. If you have sensitive information (including passwords, SAS token, authentication tokens, etc), it should be moved into scripts in Azure Storage, where access requires authentication.
 
### Shell customizer

The shell customizer supports running shell scripts. The shell scripts must be publicly accessible or you must have configured an [MSI](./image-builder-user-assigned-identity.md) for Image Builder to access them.

```json
    "customize": [ 
        { 
            "type": "Shell", 
            "name": "<name>", 
            "scriptUri": "<link to script>",
            "sha256Checksum": "<sha256 checksum>"       
        }, 
    ], 
    "customize": [ 
        { 
            "type": "Shell", 
            "name": "<name>", 
            "inline": "<commands to run>"
	}, 
    ],
```

OS Support: Linux 
 
Customize properties:

- **type** – Shell 
- **name** - name for tracking the customization 
- **scriptUri** - URI to the location of the file 
- **inline** - array of shell commands, separated by commas.
- **sha256Checksum** - Value of sha256 checksum of the file, you generate this locally, and then Image Builder will checksum and validate.
    * To generate the sha256Checksum, using a terminal on Mac/Linux run: `sha256sum <fileName>`

> [!NOTE]
> Inline commands are stored as part of the image template definition, you can see these when you dump out the image definition. If you have sensitive commands or values (including passwords, SAS token, authentication tokens etc), it is strongly recommended these are moved into scripts, and use a user identity to authenticate to Azure Storage.

#### Super user privileges
For commands to run with super user privileges, they must be prefixed with `sudo`, you can add these into scripts or use it inline commands, for example:
```json
                "type": "Shell",
                "name": "setupBuildPath",
                "inline": [
                    "sudo mkdir /buildArtifacts",
                    "sudo cp /tmp/index.html /buildArtifacts/index.html"
```
Example of a script using sudo that you can reference using scriptUri:
```bash
#!/bin/bash -e

echo "Telemetry: creating files"
mkdir /myfiles

echo "Telemetry: running sudo 'as-is' in a script"
sudo touch /myfiles/somethingElevated.txt
```

### Windows restart customizer 
The Restart customizer allows you to restart a Windows VM and wait for it come back online, this allows you to install software that requires a reboot.  

```json 
     "customize": [ 

            {
                "type": "WindowsRestart",
                "restartCommand": "shutdown /r /f /t 0", 
                "restartCheckCommand": "echo Azure-Image-Builder-Restarted-the-VM  > c:\\buildArtifacts\\azureImageBuilderRestart.txt",
                "restartTimeout": "5m"
            }
  
        ],
```

OS Support: Windows
 
Customize properties:
- **Type**: WindowsRestart
- **restartCommand** - Command to execute the restart (optional). The default is `'shutdown /r /f /t 0 /c \"packer restart\"'`.
- **restartCheckCommand** – Command to check if restart succeeded (optional). 
- **restartTimeout** - Restart timeout specified as a string of magnitude and unit. For example, `5m` (5 minutes) or `2h` (2 hours). The default is: '5m'

### Linux restart  
There is no Linux restart customizer. If you're installing drivers, or components that require a restart, you can install them and invoke a restart using the Shell customizer. There is a 20min SSH timeout to the build VM.

### PowerShell customizer 
The shell customizer supports running PowerShell scripts and inline command, the scripts must be publicly accessible for the IB to access them.

```json 
     "customize": [
        { 
             "type": "PowerShell",
             "name":   "<name>",  
             "scriptUri": "<path to script>",
             "runElevated": <true false>,
             "sha256Checksum": "<sha256 checksum>" 
        }, 	
        { 
             "type": "PowerShell", 
             "name": "<name>", 
             "inline": "<PowerShell syntax to run>", 
             "validExitCodes": "<exit code>",
             "runElevated": <true or false> 
         } 
     ], 
```

OS support: Windows

Customize properties:

- **type** – PowerShell.
- **scriptUri** - URI to the location of the PowerShell script file. 
- **inline** – Inline commands to be run, separated by commas.
- **validExitCodes** – Optional, valid codes that can be returned from the script/inline command, this will avoid reported failure of the script/inline command.
- **runElevated** – Optional, boolean, support for running commands and scripts with elevated permissions.
- **sha256Checksum** - Value of sha256 checksum of the file, you generate this locally, and then Image Builder will checksum and validate.
    * To generate the sha256Checksum, using a PowerShell on Windows [Get-Hash](/powershell/module/microsoft.powershell.utility/get-filehash)


### File customizer

The File customizer lets Image Builder download a file from a GitHub repo or Azure storage. If you have an image build pipeline that relies on build artifacts, you can set the file customizer to download from the build share, and move the artifacts into the image.  

```json
     "customize": [ 
         { 
            "type": "File", 
             "name": "<name>", 
             "sourceUri": "<source location>",
             "destination": "<destination>",
             "sha256Checksum": "<sha256 checksum>"
         }
     ]
```

OS support: Linux and Windows 

File customizer properties:

- **sourceUri** - an accessible storage endpoint, this can be GitHub or Azure storage. You can only download one file, not an entire directory. If you need to download a directory, use a compressed file, then uncompress it using the Shell or PowerShell customizers. 

> [!NOTE]
> If the sourceUri is an Azure Storage Account, irrespective if the blob is marked public, you will to grant the Managed User Identity permissions to read access on the blob. Please see this [example](./image-builder-user-assigned-identity.md#create-a-resource-group) to set the storage permissions.

- **destination** – this is the full destination path and file name. Any referenced path and subdirectories must exist, use the Shell or PowerShell customizers to set these up beforehand. You can use the script customizers to create the path. 

This is supported by Windows directories and Linux paths, but there are some differences: 
- Linux OS’s – the only path Image builder can write to is /tmp.
- Windows – No path restriction, but the path must exist.
 

If there is an error trying to download the file, or put it in a specified directory, then customize step will fail, and this will be in the customization.log.

> [!NOTE]
> The file customizer is only suitable for small file downloads, < 20MB. For larger file downloads, use a script or inline command, then use code to download files, such as, Linux `wget` or `curl`, Windows, `Invoke-WebRequest`.

### Windows Update Customizer
This customizer is built on the [community Windows Update Provisioner](https://packer.io/docs/provisioners/community-supported.html) for Packer, which is an open source project maintained by the Packer community. Microsoft tests and validate the provisioner with the Image Builder service, and will support investigating issues with it, and work to resolve issues, however the open source project is not officially supported by Microsoft. For detailed documentation on and help with the Windows Update Provisioner, please see the project repository.

```json
     "customize": [
          {
               "type": "WindowsUpdate",
               "searchCriteria": "IsInstalled=0",
               "filters": [
                    "exclude:$_.Title -like '*Preview*'",
                    "include:$true"
               ],
               "updateLimit": 20
          }
     ], 
```

OS support: Windows

Customizer properties:
- **type**  – WindowsUpdate.
- **searchCriteria** - Optional, defines which type of updates are installed (like Recommended or Important), BrowseOnly=0 and IsInstalled=0 (Recommended) is the default.
- **filters** – Optional, allows you to specify a filter to include or exclude updates.
- **updateLimit** – Optional, defines how many updates can be installed, default 1000.
 
> [!NOTE]
> The Windows Update customizer can fail if there are any outstanding Windows restarts, or application installations still running, typically you may see this error in the customization.log, `System.Runtime.InteropServices.COMException (0x80240016): Exception from HRESULT: 0x80240016`. We strongly advise you consider adding in a Windows Restart, and/or allowing applications enough time to complete their installations using [sleep](/powershell/module/microsoft.powershell.utility/start-sleep) or wait commands in the inline commands or scripts before running Windows Update.

### Generalize 
By default, Azure Image Builder will also run `deprovision` code at the end of each image customization phase, to generalize the image. Generalizing is a process where the image is set up so it can be reused to create multiple VMs. For Windows VMs, Azure Image Builder uses Sysprep. For Linux, Azure Image Builder runs `waagent -deprovision`. 

The commands Image Builder users to generalize may not be suitable for every situation, so Azure Image Builder will allow you to customize this command, if needed. 

If you're migrating existing customization, and you're using different Sysprep/waagent commands, you can use the Image Builder generic commands, and if the VM creation fails, use your own Sysprep or waagent commands.

If Azure Image Builder creates a Windows custom image successfully, and you create a VM from it, then find that the VM creation fails or doesn't complete successfully, you will need to review the Windows Server Sysprep documentation or raise a support request with the Windows Server Sysprep Customer Services Support team, who can troubleshoot and advise on the correct Sysprep usage.


#### Default Sysprep command
```powershell
Write-Output '>>> Waiting for GA Service (RdAgent) to start ...'
while ((Get-Service RdAgent).Status -ne 'Running') { Start-Sleep -s 5 }
Write-Output '>>> Waiting for GA Service (WindowsAzureTelemetryService) to start ...'
while ((Get-Service WindowsAzureTelemetryService) -and ((Get-Service WindowsAzureTelemetryService).Status -ne 'Running')) { Start-Sleep -s 5 }
Write-Output '>>> Waiting for GA Service (WindowsAzureGuestAgent) to start ...'
while ((Get-Service WindowsAzureGuestAgent).Status -ne 'Running') { Start-Sleep -s 5 }
Write-Output '>>> Sysprepping VM ...'
if( Test-Path $Env:SystemRoot\system32\Sysprep\unattend.xml ) {
  Remove-Item $Env:SystemRoot\system32\Sysprep\unattend.xml -Force
}
& $Env:SystemRoot\System32\Sysprep\Sysprep.exe /oobe /generalize /quiet /quit
while($true) {
  $imageState = (Get-ItemProperty HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Setup\State).ImageState
  Write-Output $imageState
  if ($imageState -eq 'IMAGE_STATE_GENERALIZE_RESEAL_TO_OOBE') { break }
  Start-Sleep -s 5
}
Write-Output '>>> Sysprep complete ...'
```
#### Default Linux deprovision command

```bash
/usr/sbin/waagent -force -deprovision+user && export HISTSIZE=0 && sync
```

#### Overriding the Commands
To override the commands, use the PowerShell or Shell script provisioners to create the command files with the exact file name, and put them in the correct directories:

* Windows: c:\DeprovisioningScript.ps1
* Linux: /tmp/DeprovisioningScript.sh

Image Builder will read these commands, these are written out to the AIB logs, `customization.log`. See [troubleshooting](image-builder-troubleshoot.md#customization-log) on how to collect logs.

## Properties: validate
You can use the `validate` property to validate platform images and any customized images you create regardless of if you used Azure Image Builder to create them.

Azure Image Builder supports a 'Source-Validation-Only' mode that can be set using the `sourceValidationOnly` field. If the `sourceValidationOnly` field is set to true, the image specified in the `source` section will directly be validated. No separate build will be run to generate and then validate a customized image.

The `inVMValidations` field takes a list of validators that will be performed on the image. Azure Image Builder supports both PowerShell and Shell validators.

The `continueDistributeOnFailure` field is responsible for whether the output image(s) will be distributed if validation fails. If validation fails and this field is set to false, the output image(s) will not be distributed (this is the default behavior). If validation fails and this field is set to true, the output image(s) will still be distributed. Please use this option with caution as it may result in failed images being distributed for use. In either case (true or false), the end to end image run will be reported as a failed in the case of a validation failure. This field has no effect on whether validation succeeds or not.

When using `validate`: 
- You can use multiple validators
- Validators execute in the order specified in the template.
- If one validator fails, then the whole validation component will fail and report back an error.
- It is strongly advised you test the script thoroughly before using it in a template. Debugging the script on your own VM will be easier.
- Don't put sensitive data in the scripts. 
- The script locations need to be publicly accessible, unless you're using [MSI](./image-builder-user-assigned-identity.md).

How to use the `validate` property to validate Windows images
        
```json
{
  "properties": {
      "validate": {
      "continueDistributeOnFailure": false,
      "sourceValidationOnly": false,
      "inVMValidations": [
        {
          "type": "PowerShell",
          "name": "test PowerShell validator inline",
          "inline": [
            "<command to run inline>"
          ],
	  "validExitCodes": "<exit code>",
	  "runElevated": <true or false> 
        },
        {
          "type": "PowerShell",
          "name": "<name>",
          "scriptUri": "<path to script>",
	  "runElevated": <true false>,
	  "sha256Checksum": "<sha256 checksum>" 
        }
      ]
    },
  }    
}
```

`inVMValidations` properties:

- **type** – PowerShell.
- **name** - name of the validator
- **scriptUri** - URI of the PowerShell script file. 
- **inline** – array of commands to be run, separated by commas.
- **validExitCodes** – Optional, valid codes that can be returned from the script/inline command, this will avoid reported failure of the script/inline command.
- **runElevated** – Optional, boolean, support for running commands and scripts with elevated permissions.
- **sha256Checksum** - Value of sha256 checksum of the file, you generate this locally, and then Image Builder will checksum and validate.
    * To generate the sha256Checksum, using a PowerShell on Windows [Get-Hash](/powershell/module/microsoft.powershell.utility/get-filehash)

How to use the `validate` property to validate Linux images
        
```json
{
 "properties": {
    "validate": {
      "continueDistributeOnFailure": false,
      "sourceValidationOnly": false,
      "inVMValidations": [
        {
          "type": "Shell",
          "name": "<name>",
          "inline": [
            "<command to run inline>"
          ]
        },
        {
          "type": "Shell",
          "name": "<name>",
          "scriptUri": "<path to script>",
	  "sha256Checksum": "<sha256 checksum>" 
        }
      ]
    },
  }
}
```

`inVMValidations` properties:

- **type** – Shell 
- **name** - name of the validator
- **scriptUri** - URI of the script file 
- **inline** - array of commands to be run, separated by commas.
- **sha256Checksum** - Value of sha256 checksum of the file, you generate this locally, and then Image Builder will checksum and validate.
    * To generate the sha256Checksum, using a terminal on Mac/Linux run: `sha256sum <fileName>`
 
## Properties: distribute

Azure Image Builder supports three distribution targets: 

- **managedImage** - managed image.
- **sharedImage** - Azure Compute Gallery.
- **VHD** - VHD in a storage account.

You can distribute an image to both of the target types in the same configuration.

> [!NOTE]
> The default AIB sysprep command doesn't include "/mode:vm", however this maybe required when create images that will have the HyperV role installed. If you need to add this command argument, you must override the sysprep command.

Because you can have more than one target to distribute to, Image Builder maintains a state for every distribution target that can be accessed by querying the `runOutputName`.  The `runOutputName` is an object you can query post distribution for information about that distribution. For example, you can query the location of the VHD, or regions where the image version was replicated to, or SIG Image version created. This is a property of every distribution target. The `runOutputName` must be unique to each distribution target. Here is an example, this is querying an Azure Compute Gallery distribution:

```azurecli
subscriptionID=<subcriptionID>
imageResourceGroup=<resourceGroup of image template>
runOutputName=<runOutputName>

az resource show \
        --ids "/subscriptions/$subscriptionID/resourcegroups/$imageResourceGroup/providers/Microsoft.VirtualMachineImages/imageTemplates/ImageTemplateLinuxRHEL77/runOutputs/$runOutputName"  \
        --api-version=2021-10-01
```

Output:
```json
{
  "id": "/subscriptions/xxxxxx/resourcegroups/rheltest/providers/Microsoft.VirtualMachineImages/imageTemplates/ImageTemplateLinuxRHEL77/runOutputs/rhel77",
  "identity": null,
  "kind": null,
  "location": null,
  "managedBy": null,
  "name": "rhel77",
  "plan": null,
  "properties": {
    "artifactId": "/subscriptions/xxxxxx/resourceGroups/aibDevOpsImg/providers/Microsoft.Compute/galleries/devOpsSIG/images/rhel/versions/0.24105.52755",
    "provisioningState": "Succeeded"
  },
  "resourceGroup": "rheltest",
  "sku": null,
  "tags": null,
  "type": "Microsoft.VirtualMachineImages/imageTemplates/runOutputs"
}
```

### Distribute: managedImage

The image output will be a managed image resource.

```json
{
       "type":"managedImage",
       "imageId": "<resource ID>",
       "location": "<region>",
       "runOutputName": "<name>",
       "artifactTags": {
            "<name>": "<value>",
            "<name>": "<value>"
        }
}
```
 
Distribute properties:
- **type** – managedImage 
- **imageId** – Resource ID of the destination image, expected format: /subscriptions/\<subscriptionId>/resourceGroups/\<destinationResourceGroupName>/providers/Microsoft.Compute/images/\<imageName>
- **location** - location of the managed image.  
- **runOutputName** – unique name for identifying the distribution.  
- **artifactTags** - Optional user specified key\value tags.
 
 
> [!NOTE]
> The destination resource group must exist.
> If you want the image distributed to a different region, it will increase the deployment time. 

### Distribute: sharedImage 
The Azure Compute Gallery is a new Image Management service that allows managing of image region replication, versioning and sharing custom images. Azure Image Builder supports distributing with this service, so you can distribute images to regions supported by Azure Compute Galleries. 
 
an Azure Compute Gallery is made up of: 
 
- Gallery - Container for multiple images. A gallery is deployed in one region.
- Image definitions - a conceptual grouping for images. 
- Image versions - this is an image type used for deploying a VM or scale set. Image versions can be replicated to other regions where VMs need to be deployed.
 
Before you can distribute to the gallery, you must create a gallery and an image definition, see [Create a gallery](../create-gallery.md). 

```json
{
    "type": "SharedImage",
    "galleryImageId": "<resource ID>",
    "runOutputName": "<name>",
    "artifactTags": {
        "<name>": "<value>",
        "<name>": "<value>"
    },
    "replicationRegions": [
        "<region where the gallery is deployed>",
        "<region>"
    ]
}
``` 

Distribute properties for galleries:

- **type** - sharedImage  
- **galleryImageId** – ID of the Azure Compute Gallery, this can specified in two formats:
    * Automatic versioning - Image Builder will generate a monotonic version number for you, this is useful for when you want to keep rebuilding images from the same template: The format is: `/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Compute/galleries/<sharedImageGalleryName>/images/<imageGalleryName>`.
    * Explicit versioning - You can pass in the version number you want image builder to use. The format is:
    `/subscriptions/<subscriptionID>/resourceGroups/<rgName>/providers/Microsoft.Compute/galleries/<sharedImageGalName>/images/<imageDefName>/versions/<version - for example: 1.1.1>`

- **runOutputName** – unique name for identifying the distribution.  
- **artifactTags** - Optional user specified key\value tags.
- **replicationRegions** - Array of regions for replication. One of the regions must be the region where the Gallery is deployed. Adding regions will mean an increase of build time, as the build doesn't complete until the replication has completed.
- **excludeFromLatest** (optional) This allows you to mark the image version you create not be used as the latest version in the gallery definition, the default is 'false'.
- **storageAccountType** (optional) AIB supports specifying these types of storage for the image version that is to be created:
    * "Standard_LRS"
    * "Standard_ZRS"


> [!NOTE]
> If the image template and referenced `image definition` are not in the same location, you will see additional time to create images. Image Builder currently doesn't have a `location` parameter for the image version resource, we take it from its parent `image definition`. For example, if an image definition is in westus and you want the image version replicated to eastus, a blob is copied to westus, from this, an image version resource in westus is created, and then replicate to eastus. To avoid the additional replication time, ensure the `image definition` and image template are in the same location.


### Distribute: VHD  
You can output to a VHD. You can then copy the VHD, and use it to publish to Azure MarketPlace, or use with Azure Stack.  

```json
{ 
    "type": "VHD",
    "runOutputName": "<VHD name>",
    "artifactTags": {
        "<name>": "<value>",
        "<name>": "<value>"
    }
}
```
 
OS Support: Windows  and Linux

Distribute VHD parameters:

- **type** - VHD.
- **runOutputName** – unique name for identifying the distribution.  
- **tags** - Optional user specified key value pair tags.
 
Azure Image Builder doesn't allow the user to specify a storage account location, but you can query the status of the `runOutputs` to get the location.  

```azurecli-interactive
az resource show \
   --ids "/subscriptions/$subscriptionId/resourcegroups/<imageResourceGroup>/providers/Microsoft.VirtualMachineImages/imageTemplates/<imageTemplateName>/runOutputs/<runOutputName>"  | grep artifactUri 
```

> [!NOTE]
> Once the VHD has been created, copy it to a different location, as soon as possible. The VHD is stored in a storage account in the temporary resource group created when the image template is submitted to the Azure Image Builder service. If you delete the image template, then you will lose the VHD. 

## Image Template Operations

### Starting an Image Build
To start a build, you need to invoke 'Run' on the Image Template resource, examples of `run` commands:

```PowerShell
Invoke-AzResourceAction -ResourceName $imageTemplateName -ResourceGroupName $imageResourceGroup -ResourceType Microsoft.VirtualMachineImages/imageTemplates -ApiVersion "2021-10-01" -Action Run -Force
```


```azurecli
az resource invoke-action \
     --resource-group $imageResourceGroup \
     --resource-type  Microsoft.VirtualMachineImages/imageTemplates \
     -n helloImageTemplateLinux01 \
     --action Run 
```

### Cancelling an Image Build
If you're running an image build that you believe is incorrect, waiting for user input, or you feel will never complete successfully, then you can cancel the build.

The build can be canceled any time. If the distribution phase has started you can still cancel, but you will need to clean up any images that may not be completed. The cancel command doesn't wait for cancel to complete, please monitor `lastrunstatus.runstate` for canceling progress, using these status [commands](image-builder-troubleshoot.md#customization-log).


Examples of `cancel` commands:

```powerShell
Invoke-AzResourceAction -ResourceName $imageTemplateName -ResourceGroupName $imageResourceGroup -ResourceType Microsoft.VirtualMachineImages/imageTemplates -ApiVersion "2021-10-01" -Action Cancel -Force
```

```azurecli
az resource invoke-action \
     --resource-group $imageResourceGroup \
     --resource-type  Microsoft.VirtualMachineImages/imageTemplates \
     -n helloImageTemplateLinux01 \
     --action Cancel 
```

## Next steps

There are sample .json files for different scenarios in the [Azure Image Builder GitHub](https://github.com/azure/azvmimagebuilder).
