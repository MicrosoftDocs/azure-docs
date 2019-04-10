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
# Azure Image Builder json format

Azure Image Builder uses a .json file to pass information into the Image Builder service. In this article we will go over the sections of the json sample file located here: https://raw.githubusercontent.com/danielsollondon/azvmimagebuilder/master/quickquickstarts/0_Creating_a_Custom_Linux_Managed_Image/helloImageTemplateLinux.json

The .json file we will explore is for the creation of a basic custom image. The custom image is created using a marketplace image for Ubuntu 18.04 LTS from Canonical. The marketplace image us customized using a shell script found here: https://raw.githubusercontent.com/danielsollondon/azvmimagebuilder/master/quickquickstarts/customizeScript.sh.



## Type and API version


    "type": "Microsoft.VirtualMachineImages",
    "apiVersion": "2019-02-01-preview",


## Location

The location is the region where the custom image will be created. For the Image Builder preview, the following reqions are supported:

* East US
* East US 2
* West Central US
* West US
* West US 2


```json
    "location": "<region>",
```
	
## Depends on

This section isn't used in this example, but it can be used to ensure that dependencies are completed before proceeding. <!-- Need an example of how to configure this part - need to check the other samples -->

```json
    "dependsOn": [],
```

## Properties: source


```json
        "source": {
            "type": "PlatformImage",
                "publisher": "Canonical",
                "offer": "UbuntuServer",
                "sku": "18.04-LTS",
                "version": "18.04.201903060"
            
        },
		
```		
		
		
## Properties: customize	

	
```json
        "customize": [
            {
                "type": "Shell",
                "name": "RunScripts01",
                "script": "https://raw.githubusercontent.com/danielsollondon/azvmimagebuilder/master/quickquickstarts/customizeScript.sh"
            },
            {
                "type": "Shell",
                "name": "RunInlineCmds01",
                "inline": [
                    "sudo apt install unattended-upgrades",
                    "sudo mkdir /buildArtifacts",
                    "sudo touch /buildArtifacts/imageBuilder.md"
                ]
                }

        ],
		
```		



## Properties: distribute



		
```json
        "distribute": 
            [
                {   "type":"ManagedImage",
                    "imageId": "/subscriptions/<subscriptionID>/resourceGroups/<rgName>/providers/Microsoft.Compute/images/<imageName>",
                    "location": "<region>",
                    "runOutputName": "<imageName>",
                    "tags": {
                        "source": "azVmImageBuilder",
                        "baseosimg": "ubuntu1804"
                    }
                }
            ]
        }
    }
	
```