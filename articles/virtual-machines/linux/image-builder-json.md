---
title: Azure Image Builder json format (preview)
description: Learn more about the json format used with Azure Image Builder.
author: cynthn
ms.author: cynthn
ms.date: 04/10/2019
ms.topic: article
ms.service: virtual-machines-linux
manager: jeconnoc
---
# Azure Image Builder json template format

Azure Image Builder uses a .json file to pass information into the Image Builder service. In this article we will go over the sections of the json sample file located here: https://raw.githubusercontent.com/danielsollondon/azvmimagebuilder/master/quickquickstarts/0_Creating_a_Custom_Linux_Managed_Image/helloImageTemplateLinux.json

The .json file we will explore is for the creation of a basic custom image. The custom image is created using a marketplace image for Ubuntu 18.04 LTS from Canonical. The marketplace image us customized using a shell script found here: https://raw.githubusercontent.com/danielsollondon/azvmimagebuilder/master/quickquickstarts/customizeScript.sh.


```json
 { 
    "type": "Microsoft.VirtualMachineImages/imageTemplates", 
    "apiVersion": "2019-05-01-preview", 
     "location": "westcentralus", 
     "tags": { 
  	“imagetemplate_tag1” : “corpStdWin2019svr” 
 	“imagetemplate_tag2” : “baseBuild” 
 	}, 
     "dependsOn": [], 
     "properties": { 
 	   "buildTimeoutInMinutes": {}, 
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
	
## Depends on

This section can be used to ensure that dependencies are completed before proceeding. 

```json
    "dependsOn": [],
```

For more information, see [Define resource dependencies](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-define-dependencies#dependson).


## Properties: source

The `source` section contains information about the source image that will be used by Image Builder.

The API requires a 'SourceType' that defines the source for the image build, currently there are three types:
- ISO  - use this when the source is a RHEL ISO.
- PlatformImage - indicated the source image is a Marketplace image.
- ManagedImage - use this when starting from a regular managed image.
- SharedImageVersion - this is used when you are using an image version in a Shared Image Gallery as the source.

### ISO

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
 
### PlatformImage 
Azure Image Builder will support Azure Marketplace base OS Linux images:
- Ubuntu 18.04
- Ubuntu 16.04

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

### ManagedImage

This is an existing managed image of a generalized VHD or VM.

```json
        "source": { 
            "type": "ManagedImage", 
                "imageId": "/subscriptions/<subscriptionId>/resourceGroups/{destinationResourceGroupName}/providers/Microsoft.Compute/images/<imageName>"
        }
```

The `imageId` should be the ResourceId of the managed image. Use `az image list` to list available images.


### SharedImageVersion

This is an existing image version in a Shared Image Gallery.

```json
        "source": { 
            "type": "SharedImageVersion", 
            "imageVersionID": "/subscriptions/<subscriptionId>/resourceGroups/<resourceGroup>/p  roviders/Microsoft.Compute/galleries/<sharedImageGalleryName>/images/<imageDefinitionName/versions/<imageVersion>" 
   } 
```

The `imageVersionId` should be the ResourceId of the image version. Use [az sig image-version list](/cli/azure/sig/image-version#az-sig-image-version-list) to list image versions.

## Properties: customize


Image Builder supports multiple ‘customizers’. Customizers are functions that are used to customize your image, such as running scripts, or rebooting servers. 

```json
        "customize": [
            {
                "type": "Shell",
                "name": "<name>",
                "script": "<path to script>"
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
            "name": "setupOS", 
            "script": "<link to script>"        
		}, 
	], 
```

OS Support: Linux 
 
Customize properties:
**type** – Shell 
**name** - name for tracking the customization 
**script** - URI to the location of the file 
 
When using `customize`: 
- You can use multiple customizers, but they must have a unique `name`.
- Customizers execute in the order specified in the template.
- If one customizer fails, then the whole customization component will fail and report back an error.
- In preview, there is a 1-hour timeout allowance for customization.
- It is strongly advised you test the script thoroughly before using it in a template. Debugging the script on your own VM will be easier.
- Do not put sensitive data in the scripts. The script locations are publicly accessible.

> [!NOTE]
> When running the shell customizer with RHEL, you need to ensure your first customization shell handles registering with a Red Hat entitlement server before any customization occurs. Once customization is complete, the script should unregister with the entitlement server.

## Windows restart customizer 
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
**Type**: WindowsRestart
**restartCommand** - Command to execute the restart (optional). The default is `'shutdown /r /f /t 0 /c 
\"packer restart\"'`.
**restartCheckCommand** – Command to check if restart succeeded (optional).  [Default: '…..'] 
**restartTimeout** - Restart timeout specified as a string of magnitude and unit. For example, `5m` (5 minutes) or `2h` (2 hours). The default is: '5m'


### PowerShell Customizer 
The shell customizer supports running PowerShell scripts and inline command, the scripts must be publicly accessible for the IB to access them.

```json 
     "customize": [
        { 
             "type": "PowerShell",
             "name":   "<name>",  
             "script": "<path to script>" 
        }, 	
        { 
             "type": "PowerShell", 
             "name": "<name>", 
             "inline": "<PowerShell syntax to run>", 
  	         "valid_exit_codes": "<exit code>" 
         } 
 	], 
```

Customize properties:
**type** – PowerShell.
**script** - URI to the location of the PowerShell script file. 
**inline** – Inline commands to be run, separated by commas.
**valid_exit_codes** – Expected, valid codes that can be returned from the script/inline command, this will avoid reported failure of the script/inline command.

### File customizer

The File customizer lets image builder download a file from a GitHub or Azure storage. If you have an image build pipeline that relies on build artifacts, you can then set the file customizer to download from the build share, and move the artifacts into the image.  

```json
 
     "customize": [ 
         { 
            "type": "File", 
             "name": "<name>", 
             "sourceUri": "<source location>"                } "destination": "<destination>" 
  
 
 ```
 
 
**sourceUri** - this can be either GitHub or Azure storage. You can only download one file, not an entire directory. If you need to download a directory, use a compressed file, then uncompress it using the Shell or PowerShell customizers. 
 
**destination** – this is the full destination path and file name. Any referenced path and subdirectories must exist, use the Shell or PowerShell customizers to set these up beforehand. 

This is supported by Windows directories and Linux paths, but there are some differences: 
- Linux OS’s – the only path Image builder can write to is /tmp.
- Windows – No path restriction, but the path must exist.
 
 
If there is an error trying to download the file, or put it in a specified directory, the customize step will fail. 
 
 
## Properties: distribute

Azure Image Builder supports three distribution targets: 

- managedImage - managed image.
- sharedImage - Shared Image Gallery.
- VHD - VHD in a storage account.

You can distribute an image to both of the target types in the same configuration. For an example, see [azplatform_image_deploy_sigmdi.json](https://github.com/danielsollondon/azvmimagebuilder/blob/master/armTemplates/azplatform_image_deploy_sigmdi.json#L80).
 
### Managed image

The image output will be a managed image resource.

```json
"distribute": [
        {
"type":"managedImage",
       "imageId": "resourceid, see note on format",
       "location": "region",
       "runOutputName": "imageName",
       "tags": {
            "source": "goimagebuilderarm",
             "baseosimg": "ubuntu1804"
               }
         }]
```
 
Distribute properties:
**type** – managedImage 
**imageId** – Resource ID of the destination image, expected format: 
/subscriptions/<subscriptionId>/resourceGroups/<destinationResourceGroupName>/providers/Microsoft.Compute/images/<imageName>
**location** - location of the managed image.  
**runOutputName** – this must be the same as the image name.  
**tags** - Optional user specified key value pair tags.
 
 
> [!NOTE]
> The destination resource group must exist.
> If you want the image distributed to a different region, be aware that the Azure Image Builder service will need to transfer the image and this will increase deployment time. 

## Shared Image Gallery 
The Azure Shared Image Gallery is a new Image Management service that allows managing of image region replication, versioning and sharing custom images. Azure Image Builder supports distributing with this service, so you can distribute images to regions supported by Shared Image Galleries. 
 
A Shared Image Gallery is made up of: 
 
- Gallery - Container for multiple shared images. A gallery is deployed in one region.
- Image definitions - a conceptual grouping for images. 
- Image versions - this is an image type used for deploying a VM or scale set. Image versions can be replicated to other regions where VMs need to be deployed.
 
Before you can distribute to the Image Gallery, you must create a gallery and an image definition, see [Shared images](shared-images.md). 

```jason
{
     "type": "sharedImage",
"galleryImageId": “resourceId, see note below”,
     "runOutputName": "imageGalleryName",
     "tags": {
        "mytag1": "someValue",
        "mytag2": "someValue"
      	},
     "replicationRegions": [
        "westcentralus",
        "centralus"
    ]}
``` 

Distribute properties for shared image galleries:
**type** - sharedImage  
**galleryImageId** – ID of the shared image gallery. The format is: /subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.Compute/galleries/<sharedImageGalleryName>/images/<imageGalleryName>.
**imageName** - Image name  
**replicationRegions** - Array of regions for r.eplication
 
> [!NOTE]
> You can use Azure Image Builder in a different region to the gallery, but the Azure Image Builder service will need to transfer the image between the datacenters and this will take longer. 
> Image Builder will automatically version the image, based on a monotonic integer, you cannot specify it currently. 

## VHD  
You can output to a VHD. You can then copy the VHD, and use it to publish to Azure MarketPlace, or use with Azure Stack.  

```json
 { 
      "type": "VHD",
      "runOutputName": "imageGalleryName",
      "tags": {
         "mytag1": "someValue",
         "mytag2": "someValue"
      	}
 }
```
 
OS Support: Windows  and Linux

Distribute VHD parameters:
**type** - VHD.
**runOutputName** - name to use for the VHD image.
**tags** - Optional user specified key value pair tags.
 
Azure Image Builder does not allow the user to specify a storage account location, but you can query the status of the ‘runOutput’ to get the location.  

```azurecli-interactive
az resource show \
   --ids "/subscriptions/$subscriptionId/resourcegroups/<imageResourceGroup>/providers/Microsoft.VirtualMachineImages/imageTemplates/<imageTemplateName>/runOutputs/<runOutputName>"  | grep artifactUri 
```

> [!NOTE]
> Once the VHD has been created, copy it to a different location, as soon as possible. The VHD is stored in a storage account in the temporary resource group created when the image template is submitted to the Azure Image Builder service. If you delete the image template, then you will lose this VHD. 
 
## Next steps

There are sample .json files for different scenarios in the [Azure Image Builder GitHub](https://github.com/danielsollondon/azvmimagebuilder).
 
 
 
 
 
 
 
 
 
 
