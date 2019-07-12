---
title: Create an Azure Image Builder template (preview)
description: Learn how to create a template to use with Azure Image Builder.
author: cynthn
ms.author: cynthn
ms.date: 05/10/2019
ms.topic: article
ms.service: virtual-machines-linux
manager: gwallace
---
# Preview: Create an Azure Image Builder template 

Azure Image Builder uses a .json file to pass information into the Image Builder service. In this article we will go over the sections of the json file, so you can build your own. To see examples of full .json files, see the [Azure Image Builder GitHub](https://github.com/danielsollondon/azvmimagebuilder/tree/master/quickquickstarts).

This is the basic template format:

```json
 { 
    "type": "Microsoft.VirtualMachineImages/imageTemplates", 
    "apiVersion": "2019-05-01-preview", 
    "location": "<region>", 
    "tags": {
        "<name": "<value>",
        "<name>": "<value>"
             }
    "identity":{},			 
    "dependsOn": [], 
    "properties": { 
 	    "buildTimeoutInMinutes": <minutes>, 
        "build": {}, 
        "customize": {}, 
        "distribute": {} 
      } 
 } 
```



## Type and API version

The `type` is the resource type, which must be `"Microsoft.VirtualMachineImages/imageTemplates"`. The `apiVersion` will change over time as the API changes, but should be `"2019-05-01-preview"` for preview.

```json
    "type": "Microsoft.VirtualMachineImages/imageTemplates",
    "apiVersion": "2019-05-01-preview",
```

## Location

The location is the region where the custom image will be created. For the Image Builder preview, the following regions are supported:

- East US
- East US 2
- West Central US
- West US
- West US 2


```json
    "location": "<region>",
```
	
## Depends on (optional)

This optional section can be used to ensure that dependencies are completed before proceeding. 

```json
    "dependsOn": [],
```

For more information, see [Define resource dependencies](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-define-dependencies#dependson).

## Identity
By default, Image Builder supports using scripts, or copying files from multiple locations, such as GitHub and Azure storage. To use these, they must be publicly accessible.

You can also use an Azure User-Assigned Managed Identity, defined by you, to allow Image Builder access Azure Storage, as long as the identity has been granted a minimum of ‘Storage Blob Data Reader’ on the Azure storage account. This means you do not need to make the storage blobs externally accessible, or setup SAS Tokens.


```json
    "identity": {
    "type": "UserAssigned",
          "userAssignedIdentities": {
            "<imgBuilderId>": {}
        }
        },
```

For a complete example, see [
Use an Azure User-Assigned Managed Identity to access files in Azure Storage](https://github.com/danielsollondon/azvmimagebuilder/tree/master/quickquickstarts/7_Creating_Custom_Image_using_MSI_to_Access_Storage).

Image Builder support for a User-Assigned Identity:
•	Supports a single identity only
•	Does not support custom domain names

To learn more, see [What is managed identities for Azure resources?](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview).
For more information on deploying this feature, see [Configure managed identities for Azure resources on an Azure VM using Azure CLI](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/qs-configure-cli-windows-vm#user-assigned-managed-identity).

## Properties: source

The `source` section contains information about the source image that will be used by Image Builder.

The API requires a 'SourceType' that defines the source for the image build, currently there are three types:
- ISO  - use this when the source is a RHEL ISO.
- PlatformImage - indicated the source image is a Marketplace image.
- ManagedImage - use this when starting from a regular managed image.
- SharedImageVersion - this is used when you are using an image version in a Shared Image Gallery as the source.

### ISO source

Azure Image Builder only supports using published Red Hat Enterprise Linux 7.x Binary DVD ISOs, for preview. Image Builder supports:
- RHEL 7.3 
- RHEL 7.4 
- RHEL 7.5 
 
```json
"source": {
       "type": "ISO",
       "sourceURI": "<sourceURI from the download center>",
       "sha256Checksum": "<checksum associated with ISO>"
}
```

To get the `sourceURI` and `sha256Checksum` values, go to `https://access.redhat.com/downloads` then select the product **Red Hat Enterprise Linux**, and a supported version. 

In the list of **Installers and Images for Red Hat Enterprise Linux Server**, you need to copy the link for Red Hat Enterprise Linux 7.x Binary DVD, and the checksum.

> [!NOTE]
> The access tokens of the links are refreshed at frequent intervals, so every time you want to submit a template, you must check if the RH link address has changed.
 
### PlatformImage source 
Azure Image Builder supports the following Azure Marketplace images:
* Ubuntu 18.04
* Ubuntu 16.04
* RHEL 7.6
* CentOS 7.6
* Windows 2016
* Windows 2019

```json
        "source": {
            "type": "PlatformImage",
                "publisher": "Canonical",
                "offer": "UbuntuServer",
                "sku": "18.04-LTS",
                "version": "18.04.201903060"
        },
```


The properties here are the same that are used to create VM's, using AZ CLI, run the below to get the properties: 
 
```azurecli-interactive
az vm image list -l westus -f UbuntuServer -p Canonical --output table –-all 
```

> [!NOTE]
> Version cannot be ‘latest’, you must use the command above to get a version number. 

### ManagedImage source

Sets the source image as an existing managed image of a generalized VHD or VM. The source managed image must be of a supported OS, and be in the same region as your Azure Image Builder template. 

```json
        "source": { 
            "type": "ManagedImage", 
                "imageId": "/subscriptions/<subscriptionId>/resourceGroups/{destinationResourceGroupName}/providers/Microsoft.Compute/images/<imageName>"
        }
```

The `imageId` should be the ResourceId of the managed image. Use `az image list` to list available images.


### SharedImageVersion source
Sets the source image an existing image version in a Shared Image Gallery. The image version must be of a supported OS, and the image must be replicated to the same region as your Azure Image Builder template. 

```json
        "source": { 
            "type": "SharedImageVersion", 
            "imageVersionID": "/subscriptions/<subscriptionId>/resourceGroups/<resourceGroup>/p  roviders/Microsoft.Compute/galleries/<sharedImageGalleryName>/images/<imageDefinitionName/versions/<imageVersion>" 
   } 
```

The `imageVersionId` should be the ResourceId of the image version. Use [az sig image-version list](/cli/azure/sig/image-version#az-sig-image-version-list) to list image versions.

## Properties: customize


Image Builder supports multiple ‘customizers’. Customizers are functions that are used to customize your image, such as running scripts, or rebooting servers. 

When using `customize`: 
- You can use multiple customizers, but they must have a unique `name`.
- Customizers execute in the order specified in the template.
- If one customizer fails, then the whole customization component will fail and report back an error.
- Consider how much time your image build will require, and adjust the 'buildTimeoutInMinutes' property to allow image builder enough time to complete.
- It is strongly advised you test the script thoroughly before using it in a template. Debugging the script on your own VM will be easier.
- Do not put sensitive data in the scripts. 
- The script locations need to be publicly accessible, unless you are using [MSI](https://github.com/danielsollondon/azvmimagebuilder/tree/master/quickquickstarts/7_Creating_Custom_Image_using_MSI_to_Access_Storage).

```json
        "customize": [
            {
                "type": "Shell",
                "name": "<name>",
                "scriptUri": "<path to script>"
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
 
 
### Shell customizer

The shell customizer supports running shell scripts, these must be publicly accessible for the IB to access them.

```json
    "customize": [ 
        { 
            "type": "Shell", 
            "name": "<name>", 
            "scriptUri": "<link to script>"        
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
 
> [!NOTE]
> When running the shell customizer with RHEL ISO source, you need to ensure your first customization shell handles registering with a Red Hat entitlement server before any customization occurs. Once customization is complete, the script should unregister with the entitlement server.

### Windows restart customizer 
The Restart customizer allows you to restart a Windows VM and wait for it come back online, this allows you to install software that requires a reboot.  

```json 
     "customize": [ 
            "type{ ": "WindowsRestart", 
            "restartCommand": "shutdown /r /f /t 0 /c", 
            "restartCheckCommand": "echo Azure-Image-Builder-Restarted-the-VM  > buildArtifacts/azureImageBuilderRestart.txt",
            "restartTimeout": "5m"
         }],
```

OS Support: Windows
 
Customize properties:
- **Type**: WindowsRestart
- **restartCommand** - Command to execute the restart (optional). The default is `'shutdown /r /f /t 0 /c \"packer restart\"'`.
- **restartCheckCommand** – Command to check if restart succeeded (optional). 
- **restartTimeout** - Restart timeout specified as a string of magnitude and unit. For example, `5m` (5 minutes) or `2h` (2 hours). The default is: '5m'


### PowerShell customizer 
The shell customizer supports running PowerShell scripts and inline command, the scripts must be publicly accessible for the IB to access them.

```json 
     "customize": [
        { 
             "type": "PowerShell",
             "name":   "<name>",  
             "scriptUri": "<path to script>" 
        }, 	
        { 
             "type": "PowerShell", 
             "name": "<name>", 
             "inline": "<PowerShell syntax to run>", 
  	         "valid_exit_codes": "<exit code>" 
         } 
 	], 
```

OS support: Windows and Linux

Customize properties:

- **type** – PowerShell.
- **scriptUri** - URI to the location of the PowerShell script file. 
- **inline** – Inline commands to be run, separated by commas.
- **valid_exit_codes** – Optional, valid codes that can be returned from the script/inline command, this will avoid reported failure of the script/inline command.

### File customizer

The File customizer lets image builder download a file from a GitHub or Azure storage. If you have an image build pipeline that relies on build artifacts, you can then set the file customizer to download from the build share, and move the artifacts into the image.  

```json
     "customize": [ 
         { 
            "type": "File", 
             "name": "<name>", 
             "sourceUri": "<source location>",
             "destination": "<destination>" 
         }
     ]
```

OS support: Linux and Windows 

File customizer properties:

- **sourceUri** - an accessible storage endpoint, this can be GitHub or Azure storage. You can only download one file, not an entire directory. If you need to download a directory, use a compressed file, then uncompress it using the Shell or PowerShell customizers. 
- **destination** – this is the full destination path and file name. Any referenced path and subdirectories must exist, use the Shell or PowerShell customizers to set these up beforehand. You can use the script customizers to create the path. 

This is supported by Windows directories and Linux paths, but there are some differences: 
- Linux OS’s – the only path Image builder can write to is /tmp.
- Windows – No path restriction, but the path must exist.
 
 
If there is an error trying to download the file, or put it in a specified directory, the customize step will fail, and this will be in the customization.log.

>> Note! The file customizer is only suitable for small file downloads, < 20MB. For larger file downloads use a script or inline command, the use code to download files, such as, Linux `wget` or `curl`, Windows, `Invoke-WebRequest`.

Files in the File customizer can be downloaded from Azure Storage using [MSI](https://github.com/danielsollondon/azvmimagebuilder/tree/master/quickquickstarts/7_Creating_Custom_Image_using_MSI_to_Access_Storage).

### Generalize 
By default, Azure Image Builder will also run ‘deprovision’ code at the end of each image customization phase, to ‘generalize’ the image. Generalizing is a process where the image is set up so it can be reused to create multiple VMs. For Windows VMs, Azure Image Builder uses Sysprep. For Linux, Azure Image Builder runs ‘waagent -deprovision’. 

The commands Image Builder users to generalize may not be suitable for every situation, so Azure Image Builder will allow you to customize this command, if needed. 

If you are migrating existing customization, and you are using different Sysprep/waagent commands, you can using the Image Builder generic commands, and if the VM creation fails, use your own Sysprep or waagent commands.

If Azure Image Builder creates a Windows custom image successfully, and you create a VM from it, then find that the VM creation fails or does not complete successfully, you will need to review the Windows Server Sysprep documentation or raise a support request with the Windows Server Sysprep Customer Services Support team, who can troubleshoot and advise on the correct Sysprep usage.


#### Default Sysprep command
```powershell
echo '>>> Waiting for GA to start ...'
while ((Get-Service RdAgent).Status -ne 'Running') { Start-Sleep -s 5 }
while ((Get-Service WindowsAzureTelemetryService).Status -ne 'Running') { Start-Sleep -s 5 }
while ((Get-Service WindowsAzureGuestAgent).Status -ne 'Running') { Start-Sleep -s 5 }
echo '>>> Sysprepping VM ...'
if( Test-Path $Env:SystemRoot\\windows\\system32\\Sysprep\\unattend.xml ){ rm $Env:SystemRoot\\windows\\system32\\Sysprep\\unattend.xml -Force} & $Env:SystemRoot\\System32\\Sysprep\\Sysprep.exe /oobe /generalize /quiet /quit
while($true) { $imageState = Get-ItemProperty HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Setup\\State | Select ImageState; if($imageState.ImageState -ne 'IMAGE_STATE_GENERALIZE_RESEAL_TO_OOBE') { Write-Output $imageState.ImageState; Start-Sleep -s 5  } else { break } }
```
#### Default Linux deprovision command

```bash
/usr/sbin/waagent -force -deprovision+user && export HISTSIZE=0 && sync
```

#### Overriding the Commands
To override the commands, use the PowerShell or Shell script provisioners to create the command files with the exact file name, and put them in the correct directories:

* Windows: c:\DeprovisioningScript.ps1
* Linux: /tmp/DeprovisioningScript.sh

Image Builder will read these commands, these are written out to the AIB logs, ‘customization.log’. See [troubleshooting](https://github.com/danielsollondon/azvmimagebuilder/blob/master/troubleshootingaib.md#collecting-and-reviewing-aib-logs) on how to collect logs.
 
## Properties: distribute

Azure Image Builder supports three distribution targets: 

- **managedImage** - managed image.
- **sharedImage** - Shared Image Gallery.
- **VHD** - VHD in a storage account.

You can distribute an image to both of the target types in the same configuration, please see [examples](https://github.com/danielsollondon/azvmimagebuilder/blob/7f3d8c01eb3bf960d8b6df20ecd5c244988d13b6/armTemplates/azplatform_image_deploy_sigmdi.json#L80).

Because you can have more than one target to distribute to, Image Builder maintains a state for every distribution target that can be accessed by querying the `runOutputName`.  The `runOutputName` is an object you can query post distribution for information about that distribution. For example, you can query the location of the VHD, or regions where the image version was replicated to. This is a property of every distribution target. The `runOutputName` must be unique to each distribution target.
 
### Distribute: managedImage

The image output will be a managed image resource.

```json
"distribute": [
        {
"type":"managedImage",
       "imageId": "<resource ID>",
       "location": "<region>",
       "runOutputName": "<name>",
       "artifactTags": {
            "<name": "<value>",
             "<name>": "<value>"
               }
         }]
```
 
Distribute properties:
- **type** – managedImage 
- **imageId** – Resource ID of the destination image, expected format: /subscriptions/<subscriptionId>/resourceGroups/<destinationResourceGroupName>/providers/Microsoft.Compute/images/<imageName>
- **location** - location of the managed image.  
- **runOutputName** – unique name for identifying the distribution.  
- **artifactTags** - Optional user specified key value pair tags.
 
 
> [!NOTE]
> The destination resource group must exist.
> If you want the image distributed to a different region, it will increase the deployment time . 

### Distribute: sharedImage 
The Azure Shared Image Gallery is a new Image Management service that allows managing of image region replication, versioning and sharing custom images. Azure Image Builder supports distributing with this service, so you can distribute images to regions supported by Shared Image Galleries. 
 
A Shared Image Gallery is made up of: 
 
- Gallery - Container for multiple shared images. A gallery is deployed in one region.
- Image definitions - a conceptual grouping for images. 
- Image versions - this is an image type used for deploying a VM or scale set. Image versions can be replicated to other regions where VMs need to be deployed.
 
Before you can distribute to the Image Gallery, you must create a gallery and an image definition, see [Shared images](shared-images.md). 

```json
{
     "type": "sharedImage",
     "galleryImageId": “<resource ID>”,
     "runOutputName": "<name>",
     "artifactTags": {
          "<name": "<value>",
           "<name>": "<value>"
             }
     "replicationRegions": [
        "<region where the gallery is deployed>",
        "<region>"
    ]}
``` 

Distribute properties for shared image galleries:

- **type** - sharedImage  
- **galleryImageId** – ID of the shared image gallery. The format is: /subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Compute/galleries/<sharedImageGalleryName>/images/<imageGalleryName>.
- **runOutputName** – unique name for identifying the distribution.  
- **artifactTags** - Optional user specified key value pair tags.
- **replicationRegions** - Array of regions for replication. One of the regions must be the region where the Gallery is deployed.
 
> [!NOTE]
> You can use Azure Image Builder in a different region to the gallery, but the Azure Image Builder service will need to transfer the image between the datacenters and this will take longer. 
> Image Builder will automatically version the image, based on a monotonic integer, you cannot specify it currently. 

### Distribute: VHD  
You can output to a VHD. You can then copy the VHD, and use it to publish to Azure MarketPlace, or use with Azure Stack.  

```json
 { 
     "type": "VHD",
     "runOutputName": "<VHD name>",
     "tags": {
          "<name": "<value>",
           "<name>": "<value>"
             }
 }
```
 
OS Support: Windows  and Linux

Distribute VHD parameters:

- **type** - VHD.
- **runOutputName** – unique name for identifying the distribution.  
- **tags** - Optional user specified key value pair tags.
 
Azure Image Builder does not allow the user to specify a storage account location, but you can query the status of the `runOutputs` to get the location.  

```azurecli-interactive
az resource show \
   --ids "/subscriptions/$subscriptionId/resourcegroups/<imageResourceGroup>/providers/Microsoft.VirtualMachineImages/imageTemplates/<imageTemplateName>/runOutputs/<runOutputName>"  | grep artifactUri 
```

> [!NOTE]
> Once the VHD has been created, copy it to a different location, as soon as possible. The VHD is stored in a storage account in the temporary resource group created when the image template is submitted to the Azure Image Builder service. If you delete the image template, then you will lose the VHD. 
 
## Next steps

There are sample .json files for different scenarios in the [Azure Image Builder GitHub](https://github.com/danielsollondon/azvmimagebuilder).
 
 
 
 
 
 
 
 
 
 
