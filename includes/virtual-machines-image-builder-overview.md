---
author: cynthn
ms.author: cynthn
ms.date: 3/22/2019
ms.topic: include
ms.service: virtual-machines-linux
manager: jeconnoc
---

Creating standardized virtual machine (VM) images allow organizations to migrate to the cloud and ensure consistency in the deployments. Users commonly want VMs to include predefined security and configuration settings as well as application software they own. However, setting up your own image build pipeline would require infrastructure and setup. With Azure VM Image Builder, you can take an ISO or Azure Marketplace image and start creating your own golden images in a few steps.
 
The Azure VM Image Builder (AIB) lets you start with either a Windows or Linux-based Azure Marketplace VM or Red Hat Enterprise Linux (RHEL) ISO and begin to add your own customizations. Your customizations can be added in the documented customizations in this document, and because the VM Image Builder is built on HashiCorp Packer (https://packer.io/), you can also import your existing Packer shell provisioner scripts. As the last step, you specify where you would like your images hosted, either in the Azure Shared Image Gallery (https://docs.microsoft.com/en-us/azure/virtual-machines/windows/shared-image-galleries) or as an Azure Managed Image. See below for a quick video on how to create a custom image using the VM Image Builder.
 
## Preview feature support
For the preview, we are supporting these key features:
 
* Migrating an existing image customization pipeline to Azure  o Use existing scripts, commands.
* Creating golden custom images, then update then customize them further for specific uses.
* Image management and distribution, through integration with Azure Shared Image Gallery.
* Integration with existing CI/CD pipeline. Simplify image customization as an integral part of your application build and release process as shown below.
* Create images in VHD format.
* Red Hat Bring Your Own Subscription support. Create Red Hat Enterprise Images for use with your eligible, unused Red Hat subscriptions.

## Regions
The AIB Service will be available for preview in these regions, however, images can be distributed outside of these regions. 
- East US
- East US 2
- West Central US
- West US"
- West US 2

## Pipeline


The AIB is a fully managed Azure service that is accessible by an Azure first party resource provider.  
 
The diagram below shows the end to end AIB pipeline, where you can see the three main components, source, customize and distribute, with their inputs and outputs. 

![Conceptual drawing of the image builder pipeline](/media/virtual-machines-image-builder-overview/pipelines.png)

To describe the pipeline steps requires a configuration template, this is ingested into the service, then stored as an ImageTemplate. 
 
For the AIB to stand up the pipeline requires an invocation call into the AIB service referencing a stored template.

![Conceptual drawing of the submit and run command processes](/media/virtual-machines-image-builder-overview/submit-run.png)

1. Create the Image Template, see the next sections on how to do this. 
1. Submit the Image Template, at this time AIB will download the RHEL ISO, and shell scripts needed, and store these in an automatically resource group created in your subscription, in this format : ‘IT_<DestinationResourceGroup>_<TemplateName>’. This will be removed when the Image Template artifact is deleted. You will also see the template artifact, that references these in the resource group referenced when creating the image template.
1. Invoking the AIB to create the image, will take the template artifact, then stand up a pipeline to create it, by standing up a VM, network, and storage in the automatically created resource group, ‘IT_<DestinationResourceGroup>_<TemplateName>’. 

## Getting Started 
To get started you must enable the pre-requisites, this involves 3 steps, please refer to the links below, note, these steps are in all the Quick Starts. 
 
1.	Register here to have your subscription enabled for the VM Image Builder For issues registering, please reach out to the MS Teams channel. 
 
1.	Register Subscription for the Image Builder Feature and Shared Image Gallery 
 https://github.com/danielsollondon/azvmimagebuilder/tree/master/quickquickstarts/1 _Creating_a_Custom_Linux_Shared_Image_Gallery_Image#registerfor-image-builder--vm--storage-features  
1.	Set Permissions for Image Builder and Create Shared Image Gallery 
https://github.com/danielsollondon/azvmimagebuilder/tree/master/quickquickstarts /1_Creating_a_Custom_Linux_Shared_Image_Galle ry_Image#step-1-set-permissions--create-shared-image-gallery-sig 
      If you want more details please see appendix. 
 

## Quickstarts 
If you are just too eager and do not want to read the rest of the documentation, then you can use prepared ‘Quick Quickstarts’, from this repository 
(https://github.com/danielsollondon/azvmimagebuilder/tree/master/quickquickstarts) 
 
You can run all these examples from CloudShell in the Portal, with the repository examples on creating: 
* Custom Image from an Azure Platform Vanilla OS Image for Windows or Linux. 
* Custom Image, then Distribute and Version over Multiple Regions using SIG. 
* Custom Image, from an Existing Custom Managed Image
* Custom Image from an Azure Platform Vanilla OS Image and distribute to VHD 5. Custom RHEL image using a RHEL ISO where you can use eligible Red Hat licenses.
* Troubleshooting guide
 
## Resource Manager templates  
The beauty of these examples, they are heavily parameterized, so you just need to drop in your own details, then begin image building, or integrate them to existing pipelines. https://github.com/danielsollondon/azvmimagebuilder/tree/master/armTemplates.  
 
Raw Image Builder Templates 
If you do not use ARM, you can use these when submitting an Image Template directly to the Azure Resource Provider, please see the Quick Starts, these contain template examples and how to submit them to the service.  
 
 
 
## Costs
You will incur some Azure Compute / Storage / Network costs when creating, building and storing images with AIB, in the same way you would do creating custom images manually. For the resources, you will be charged at your Azure rates, below outlines a high level of resources are used. 
 
When you create an Image Template, automatically the AIB creates a resource group, in the format, ‘IT_<DestinationResourceGroup>_<TemplateName>’, at this time the RHEL ISO and shell scripts will be stored until the Image Template is deleted, therefore you will incur small storage costs. Do NOT delete or modify this resource group, delete the Image Template artifact. 
 
When you invoke AIB to build an image, it will stand up a D1v2 VM, storage and networking for it, these will last the time of the image build process, and will be deleted once AIB has finished creating the image. 
 
AIB will distribute the image to your chosen regions, this will be backed by Azure storage.


## Create the image template 
In the proceeding example, the salient details will be called out, for all API detail, please refer to the API Reference Documentation (page 17). To see full examples of the templates, see: 
https://github.com/danielsollondon/azvmimagebuilder/tree/master/rawImageBuilderConfigTemplates 

The following describes the template format, and shows the 3 main components: 

```json 
 { 
     "type": "Microsoft.VirtualMachineImages/imageTemplates", 
    "apiVersion": "2018-02-01-preview", 
     "location": "westcentralus", 
     "dependsOn": [],      "properties": { 
        "build": {}, 
         "customize": {}, 
         "distribute": {} 
     } 
} 
```

**Properties** type - must be 'Microsoft.VirtualMachineImages'  apiVersion - for preview, use '2018-02-01-preview'  location – describe AIB service location.
 
**Source** - The API requires a 'SourceType', this defines the source for the image build, currently there are three types: 

* ISO - AIB only supports using published Red Hat Enterprise Linux 7.x Binary DVD ISO's, for private preview IB supports:
    RHEL 7.3 
    RHEL 7.4 
    RHEL 7.5 
 
    These are ISO's tested, and we will keep adding to the list over time, if you have a requirement for another RHEL version, please let us know. 
 
 "source": { 
Properties       "type": "ISO", 	 
       "sourceURI": "sourceURI from RH download center", 
To populate these, access 'https://access.redhat.com/downloads', then select the product 'Red         "sha256Checksum": "checksum associated with ISO" 
Hat Enterprise Linux', and supported version of RHEL.   } 	 
 
In the list of 'Installers and Images for Red Hat Enterprise Linux Server', you need to copy the link for Red Hat Enterprise Linux 7.x Binary DVD, and the checksum, in to these properties: 
•	sourceURI 
•	Sha256Checksum 
 
Note!! The access tokens of the links are refreshed at frequent intervals, so every time you 
want to submit a template, you must check if the RH link address has changed.	 
 
PlatformImage 
AIB will support Azure Marketplace base OS Linux images: 
•	Ubuntu 18.04 
•	Ubuntu 16.04 
 
**Note, the AIB can support more, and we are continually testing, so please contact us on MS Teams channel, if you would like a specific OS to be supported. 
 
These are images tested, and we will keep adding to the list over time, if you have a requirement for a different Azure Marketplace base OS Linux image, please let us know. 
 
 "source": { 
        "type": "PlatformImage", 
       "publisher": "[parameters('publisher')]", 
        "offer": "[parameters('offer')]", 
        "sku": "[parameters('sku')]", 
        "version": "[parameters('version')]" 
            }, 
 
 
Properties 
The properties here are the same that are used to create VM's, using AZ CLI, run the below to get the properties: 
 
 az vm image list -l westus -f UbuntuServer -p Canonical --output table –-all 
  
 
Note!! Version cannot be ‘latest’, you must use the command above to get a version number. 
 
ManagedImage 
Currently, this is only supported on Linux. 
 "source": { 
        "type": "ManagedImage", 
       "imageId": "ARM resource id of the managed image in customer subscription" 
 	   } 
Properties 
imageId – ResourceId of the source image, expected format: 
 
/subscriptions/{subscriptionId}/resourceGroups/{destinationResourceGroupName}/pr  oviders/Microsoft.Compute/images/{imageName} 
 
Customize 
We support multiple ‘customizers’, these are functions that are used to customize your image, such as running scripts, rebooting servers etc. We are adding support for customizers constantly, so please keep checking the documentation or MS Teams channel for announcements for additional customizers. 
 
The customize section is an array, AIB will run through the customizers in sequential order, any failure in any customizer will fail the build process. 
 
     "customize": [ 
         { 
                         ""typename": "S": "setupOS",hell",  
             "script": "http://myfilelocation.com/files/osconf.sh" 
         }, 
                { 
             "type": "WindowsRestart", 
             "restartCommand": "some PowerShell cmd", 
            "restartCheckCommand": "another PowerShell cmd", 
  	      "restartTimeout": "10m",          }], 
 
Shell customizer 
The shell customizer supports running shell scripts, these must be publicly accessible for the IB to access them. 
    "customize": [ 
        { 
            "type": "Shell", 
            "name": "setupOS", 
            "script": "http://myfilelocation.com/files/osconf.sh"         }, 
                { 
            "type": "Shell", 
            "name": "breakOS", 
            "script": "http://myfilelocation.com/files/brokenosconf.sh"         }], 
OS Support: Linux 
 
Properties type – Shell  
script - URI to the location of the file 
 
Notes: 
•	You can use multiple customizers, they must have a unique 'name' 
•	Customizers execute in the order specified in the template 
•	If one customizer fails, then the whole customization component will fail and report back an error 
•	In Private Preview, there is a 1 hour timeout for customization allowance. 
•	It is strongly advised you test the script thoroughly before using in a template, since debugging the script on your own accessible VM will be easier. 
•	Do not put sensitive data in the scripts, as the script locations are publically accessible. 
 
Note! Running the shell customizer with RHEL 
If you customize RHEL images, then you need to ensure your first customization shell handles registering with a Red Hat entitlement server before any customization occurs. Once customization is complete, the script should unregister with the entitlement server. 
 
Windows Restart Customizer 
The Restart customizer allows you to restart a Windows VM and wait for it come back online, this allows you to install software that requires a reboot.  
 
     "customize": [ 
                             "type{ ": "WindowsRestart", 
             "restartCommand": "some PowerShell cmd", 
              	      ""restartCheckCommandrestartTimeout": "10": "m" another PowerShell cmd", 
         }], 
  
OS Support: Windows 
 
Properties 
Type: WindowsRestart 
restartCommand - Command to execute the restart (Optional) [Default: 'shutdown /r /f /t 0 /c 
\"packer restart\"'] restartCheckCommand – (Optional) Command to check if restart succeeded [Default: '…..'] restartTimeout - Restart timeout specified as a string of magnitude and unit, e.g. '5m' (5 minutes) or '2h' (2 hours) [Default: '5m'] 
 
 
 
 
 
 
 
 
 
 
 
 
PowerShell Customizer 
The shell customizer supports running PowerShell scripts and inline command, the scripts must be publicly accessible for the IB to access them. 
 
     "customize": [          { 
                         ""typename": "PowerS": "setupOS",hell",  
             "script": "http://myfilelocation.com/files/osconf.ps" 
                         }, 	{ 
             "type": "PowerShell", 
             "name": "updateOS", 
            "inline": "Install-Module PSWindowsUpdate", 
  	      "valid_exit_codes": "30" 
         } 
 	], 
 
 
 
type – PowerShell  script - URI to the location of the PowerShell script file inline – Inline commands to be run, separated by commas valid_exit_codes – Expected, valid codes that can be returned from the script/inline command, this will avoid reported failure of the script/inline command. 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
Distribute 
IB supports two distribution targets: 
 
•	managedImage - Managed Disk Images (MDI) 
•	sharedImage - Shared Image Gallery (SIG) 
•	VHD - Distribute via VHD in a storage account 
 
You can distribute an image to both of the target types in the same configuration, please see examples: 
https://github.com/danielsollondon/azvmimagebuilder/blob/2b90e8147e3c2163ecf4d390f0fe b38e8b49c54b/armTemplates/azplatform_image_deploy_sigmdi.json#L80 
 
Managed Disk Image 
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
 
 
Properties type – managedImage imageId – ResourceId of the destination image, expected format: 
 
/subscriptions/{subscriptionId}/resourceGroups/{destinationResourceGroupName}/pr  oviders/Microsoft.Compute/images/{imageName} 
 
location - location of the MDI (see Note below)  runOutputName – this must be the same as {imageName}  tags - user specified key value pair tags 
 
 
Note!  
•	The destination resource group must exist 
•	If you want the image distributed to a different region to the AIB service, you must be aware that the AIB service will need to transfer the image bits between the datacenters, this will take significant increased time. 
 
 
 
 
Shared Image Gallery 
The Azure Shared Image Gallery (SIG) is a new Image Management service that allows managing of image region replication, versioning and sharing custom images. AIB supports distributing with this service, so you can distribute images to all SIG supported regions. 
 
SIG is made up of: 
 
•	Shared Image Gallery - Container for multiple Shared Images, deployed in one region. 
•	Image - Container for multiple Image Versions 
•	Image Version - Artifact used for deploying a VM or VMSS, you specify an array of regions. 
 
Before you can distribute to the Image Gallery, you must create a Shared Image Gallery and Image, see documentation (https://docs.microsoft.com/en-us/azure/virtualmachines/windows/shared-image-galleries). 
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
 
Properties type - sharedImage  galleryImageId – is expected in this format: 
 /subscriptions/{subId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/  galleries/{sharedImageGalleryName}/images/{imageGalleryName} 
 
You can get the above using this command: 
 
 az image gallery list-e '{imageGalleryName}-images ' 	-g {resourceGroupName} -r {sharedImageHalleryName} | grep 
 
imageName - Image name  
replicationRegions - Array of SIG replication regions  
 
Note!  
•	You can use AIB in a different region to the SIG, but the AIB service will need to transfer the image bits between the datacenters, this will take significant increased time. 
•	IB will automatically version the image, based on a monotonic integer, you cannot specify it currently. 
 
VHD  
You can specify outputting to a VHD, this allows you to copy the VHD, and use it to publish to Azure MarketPlace, or use with Azure Stack.  
 { 
      "type": "VHD", 
  	"runOutputName": "imageGalleryName", 
"tags": { 
         "mytag1": "someValue", 
         "mytag2": "someValue" 
      	} 
 
 
OS Support: Windows / Linux 
 
AIB does not allow the user to specify a storage account location, but you can query the status of the ‘runOutput’ to get the location.  
 
az resource show \     --ids 
"/subscriptions/$subscriptionId/resourcegroups/<imageResourceGroup>/providers/Microsof
t.VirtualMachineImages/imageTemplates/<imageTemplateName>/runOutputs/<runOutputName>"  | grep artifactUri 
} 
 
Note!! Once the VHD has been created, copy it to an alternative location, as soon as possible. 
The VHD is stored in a storage account in the temporary Resource Group created when the Image Template is submitted to the AIB service. If you delete the Image Template, then you will loose this VHD. 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
Creating AIB Image 
 
Submit Image Template to AIB 
To submit an image template to the resource provider, you can use parametrized ARM templates 
(https://github.com/danielsollondon/azvmimagebuilder/tree/master/armTemplates), or call the resource provider, see the Quick QuickStart examples directly 
(https://github.com/danielsollondon/azvmimagebuilder/tree/master/quickquickstarts). 
 
Note!  
•	Image Template resources cannot be updated. 
•	Image Template names must be unique. 
•	Even if an image template submission fails, an image template artifact will be created, if you want to re-run creating the image template, either rename, or delete it. The image template name is unique, and must not exist, otherwise the submission will fail.  
 
 
Timing 
Once you submit the template, it to create the template artifact, timings vary. 
 
•	iso - When a template is using an ISO source, the IB service will download the ISO, this takes additional time. In testing, this takes around 15mins for a RHEL7.3 ISO. 
•	image - When an Azure Platform image is used, the IB service will not download it. In testing we see this takes seconds. 
 
Note! Any referenced scripts in the shell customizer are also downloaded to the template 
artifact during template creation.	 
 
Checking status of the Image Template Submission 
If your client is disconnected, you can check the status of the template submission: 
 
 az resource show --resource-group {resourceGroup} --resource-type  
 Microsoft.VirtualMachineImages/imageTemplates -n {ImageTemplateName}  
  
 
 
 
 
 
 
 
 
Building the Image from the Image Template  
 
Once the Image Template has created successfully, the image needs to be processed and distributed. For this, you need to invoke 'RUN' on the service. 
 az resource invoke    --resource-group -action {resourceGroup\  	} \ 
     --resource-type  Microsoft.VirtualMachineImages/imageTemplates \  
     -n {ImageTemplateName} \      --action Run  
 
If using AZ CLI, once executed you will see the command prompt return 'running'. You can check the status and which component is running using: 
 
az resource show --resource-group {resourceGroup} --resource-type   Microsoft.VirtualMachineImages/imageTemplates -n {ImageTemplateName}  
 
Look for the ‘runSubState:’ 
     "lastRunStatus": { 
       "endTime": "0001-01-01T00:00:00Z", 
      "message": "", 
       "runState": "running", 
       "runSubState": "customizing", 
           },"startTime": "2018 	-09-13T23:41:28.708528526Z" 
  
When image builder has completed, the command will return with the image details, you can run these commands to check for the image: 
 #Managed Disks (MDI) Here you can see the additional image: 	  az resource list -g {destinationResourceGroup} --output table | grep -e 'images*'   #Shared Image Gallery Look for the additional version: 
   az image gallery list-image-versions -g {sharedImageGalleryResourceGroup} -r  {sharedImageGalleryName} -i {imageGalleryName}| grep -e '{imageGalleryName}' 
 
 
Note!  
•	If one component fails to run successfully, then this will result in an image build failure. 
•	In testing, we have seen occasionally latency between when the IB service reports completed, and the time when the managed disk image shows up in the CLI. 
 
Timing 
In our tests, it takes around 45mins to build from an ISO or Platform image, with a script that takes around 5s to run. Timings can differ greatly, depending on configuration, such as: • Shell customizer scripts - number / time to execute 
•	Distribution - If you are distributing you image to multiple regions, then this will take additional time. 
 
Listing AIB Resources 
AZ CLI: To list the templates and images:  az resource list -g {resourceGroup} --output table | grep -e 'images*' 
 
 
Deleting AIB Resource 
AZ CLI: To delete the templates: 
 az resource delete -n {ImageTemplateName}  -g {resourceGroup} --resource-type  Microsoft.VirtualMachineImages/imageTemplates 
  
 
Creating a VM 
For a shared image gallery source you need the URI: 
 az image gallery list-image-versions -g {sharedImageGalleryResourceGroup} -r 
 {sharedImageGalleryName} -i {imageGalleryName}| grep -e '{imageGalleryName}' 
 
The shared image gallery URI expected format: 
 "/subscriptions/{subID}/resourceGroups/{sharedImageGalleryResourceGroup}/provide  rs/Microsoft.Compute/galleries/{sharedImageGalleryName}/images/imageGalleryName/  versions/{version, e.g. 0.23440.8575}" 
The managed disk image source will be the runOutputName (the image name. 
 
Create the VM: 
 
az vm create \ 
   --resource-group $rgName \ 
Troubleshooting    ----name {vmName} admin-username {userName}  \ 	\ 
   --image $galimguri or $managedImageName \ 
     ----location $location ssh-key-value {sshPubKey}\ 	 
 
Please see this article for the latest troubleshooting information, such as where the logging exists, typical issues. 
 
https://github.com/danielsollondon/azvmimagebuilder/blob/master/quickquickstarts/troubles hootingaib.md 
 
 
Contact US / Further Support & Questions & Feedback 
Please reach out to us on the MS Teams Channel, ‘Azure VM Image Builder Community’. 
 
 
API Reference Azure Image Builder  
Version: 2019-02-01-preview 
 
Create or Update a Virtual Machine Image Template 
PUT 
/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft. VirtualMachineImages/imageTemplates/{ImageTemplateName}?api-version={api-version} 
 
“parameters”: [ 
          { 
            “name”: “parameters” {} // configuration image template, require, inbody 
          },  
          { 
            “api-version“ : “2019-02-01-preview” // string, required, in-query 
          }, 
          { 
             “subscriptionId” : “” // string, required, in-path 
          },  
          { 
             “resourceGroupName” : “<rgName>” // string, required, in-path 
          },  
          { 
             “ImageTemplateName” : “<imgTempName>” // string, required, in-path 
          } ] 
 
 
Note, all the string parameters accept the following character patterns “^[A-Za-z0-9-_]{1 64}$”, except api-version and subscriptionID. See Image Template 
 
 
Response 
This is a synchronous operation, and will return a 201, ‘Created’ if successful, but this does not mean the image template has been provisioned correctly. 
HTTP Status Code 	Error Code 	Description 
204 	No Content 	 
400 	Bad Request 	 
500 	Internal Server Error 	
 
Response Body 
Returns ImageTemplate output. 
  
 
 
 
 
 
 
 
GET Information about Virtual Machine Image Template  
 
GET /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft. VirtualMachineImages/imageTemplates/{ImageTemplateName}?api-version={api-version} 
 
        “parameters”: [ 
          { 
             “api-version” 
          }  
          { 
             “subscriptionId” 
          }  
          { 
             “resourceGroupName” 
          }  
          { 
             “ImageTemplateName” 
          } ] 
 
Response 
If successful a 200 ‘OK’ will be returned and the submitted Image Template. 
 
HTTP Status Code 	Error Code 	Description 
400 	Bad Request 	 
404 	Not found 	 
500 	Internal Server Error 	
 
Response Body 
Returns ImageTemplate output. 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
DELETE Virtual Machine Image Template 
 
DELETE 
/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.
VirtualMachineImages/imageTemplates/{ImageTemplateName}?api-version={api-version} 
 
        “parameters”: [ 
          { 
             “api-version” 
          },  
          { 
             “subscriptionId” 
          },  
          { 
             “resourceGroupName” 
          },  
          { 
             “ImageTemplateName” 
          } ] 
 
Response 
If successful will return a 202 if Accepted. 
HTTP Status Code 	Error Code 	Description 
204 	No Content 	 
400 	Bad Request 	 
500 	Internal Server Error 	
 
 
Response Body 
 
“Location”: {} //string, contains URL where the result of job execution will be available”  
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
POST Creating Image from Template Artifact 
 
POST   /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft. VirtualMachineImages/imageTemplates/{ImageTemplateName}/run?api-version={apiversion} 
 
        “parameters”: [ 
          { 
             “ApiVersionParameter” 
          },  
          { 
             “SubscriptionId” 
          },  
          { 
             “ResourceGroupName” 
          },  
          { 
             “ImageTemplateName” 
          } 
        ]  
 
Response 
If Accepted, you will receive a 202. 
 
HTTP Status Code 	Error Code 	Description 
400 	Bad Request 	 
404 	Not found 	 
500 	Internal Server Error 	
 
Response Body 
 
“Location”: {} //string, contains URL where the result of job exection will be available”  
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
GET Status of VM Image Building Task 
 
GET /subscriptions/{subscriptionId}/providers/Microsoft.VirtualMachineImages/locations/{location}/oper ations/{operationId}?api-version={api-version} 
 
Response 
If successful you will receive a 200 OK. 
 
HTTP Status Code 	Error Code 	Description 
404 	Not found 	
 
Response Body 
 
“OperationStatusResponse” // Operation status response 
{ 
“name” : “”, //string, readonly, operationID 
“status” : “”, //string, readonly, operation status 
“startTime” : “”, //string, readonly, fmt date-time, start time of operation 
“endTime” : “”, //string, readonly, fmt date-time, end time of operation “error” : “”, //string, readonly, API error 
} 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
GET All RunOutputs/Status of a Completed VM Image Building Task 
 
GET  /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft. VirtualMachineImages/imageTemplates/{ImageTemplateName}/runOutputs?apiversion={api-version} 
 
“parameters”: [ 
          { 
            “api-version“ : “”  
          }, 
          { 
“SkipTokenParam“ : “” // string, optional, in-query, used for pagination of a large data set 
          }, 
          { 
             “subscriptionId” : “”  
          },  
          { 
             “resourceGroupName” : “<rgName>”  
          },  
          { 
             “ImageTemplateName” : “<imgTempName>”  
          } ] 
 
Response 
If successful, you will receive a 200 OK. 
 
HTTP Status Code 	Error Code 	Description 
400 	Bad Request 	 
404 	Not found 	 
500 	Internal Server Error 	
 
Response Body 
 
    "RunOutputProperties": { 
        "artifactId": “” // string, the resource id of the artifact 
        "provisioningState": // string, output only, describes state of the resource 
{  
       ["Creating", 
        "Succeeded", 
        "Failed", 
        "Deleting"] 
        }, 
        } 
 
 
 
 
 
GET Specific RunOutput for an Image 
 
GET /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft. VirtualMachineImages/imageTemplates/{ImageTemplateName}/runOutputs/{RunOutputNa me}?api-version={api-version} 
 
“parameters”: [ 
          { 
            “api-version“ : “”  
          }, 
          { 
             “subscriptionId” : “”  
          },  
          { 
             “resourceGroupName” : “<rgName>”  
          },  
          { 
             “ImageTemplateName” : “<imgTempName>”  
          }, 
        { 
“RunOutputName” : “”//string, required, name of the image created from the run.      } ] 
 
Response 
If successful you will receive a 200  OK. 
 
HTTP Status Code 	Error Code 	Description 
400 	Bad Request 	 
404 	Not found 	 
500 	Internal Server Error 	
 
Response Body 
 
    "RunOutputProperties": { 
        "artifactId": “” // string, the resource id of the artifact 
        "provisioningState": // string, output only, describes state of the resource 
{  
       ["Creating", 
        "Succeeded", 
        "Failed", 
        "Deleting"] 
        }, 
        } 
 
 
 
Definitions 
 
ImageTemplate 
 
"ImageTemplateProperties": { 
 
//the properties below are used for creating an Image Template artifact 
       
"properties": { 
 
"source": // array, required, specifies the properties used to describe the 
source image	 
{ 
 
"type": <ISO or PlatformImage or ManagedImage>, // string, required, defined type, specifies the type of source   
 
// ISO Properties 
 
 “sourceURI” : “”, //string, required, URI for RHEL ISO, must be accessible 
“sha256Checksum” : “” //string, required, SHA256 Checksum of the ISO image 
 
 	 	// OR // 
 
 
// PlatformImage Properties 
 
“publisher” : “”, //type, required, Image publisher in Azure Gallery Images 
“offer” : “” //string, required, Image offer in Azure Gallery Images 
“sku” : “”, // string, required, Image sku in Azure Gallery Images 
“version” : “” // string, required, Image version in Azure Gallery Images 
 
// OR // 
 
// ManagedImage Properties 
 
 
“imageId” : “”, //string, required, ARM ResourceID of the custom image, must be accessible in the same resource group / location you are running AIB. 
 
}  
      }, 
 
 	 
    "customize": [ // array, specifies the properties for customization steps  
 	{ 
  
 
 
“type” : “e.g. Shell ”, // string, required, the type of customization tool you want to use on the Image, ‘shell’ is the only supported type 
 
//Shell customizer Properties 
 
“name” : “”, // string, required, friendly name to describe the step. 
 
“script”: “” // string, required, the shell script to be run for customizing, github link, SAS URI for Azure Storage, etc 
 
// script and inline option cannot be used together // 
 
“inline”: “” // array, required, the shell command(s), separated by commas, to be run for customizing. 
 
 
 
//PowerShell customizer Properties 
 
“name” : “”, // string, required, friendly name to describe the step. 
 
“script”: “” // string, required, the PowerShell script to be run for customizing, github link, SAS URI for Azure Storage, etc 
 
// script and inline option cannot be used together //  
“inline”: “” // array, required, the PowerShell command(s), separated by commas, to be run for customizing. 
 
“validExitCodes”: “” // array of integers, optional, Valid exit codes for the PowerShell script. [Default: 0]. 
 
 
//Window-Restart customizer Properties 
 
“restartCommand” : “”, // string, Command to execute the restart 
[Default: 'shutdown /r /f /t 0 /c \"packer restart\"'] 
 
“restartCheckCommand”: “” // string, optional, Command to check if restart succeeded [Default: ''] 
 
“restartTimeout”: “” // string, optional, Restart timeout specified as a string of magnitude and unit, e.g. '5m' (5 minutes) or '2h' (2 hours) [Default: '5m'] 
 
           
} ], 
 
 
 
 
 
 
 
 
"distribute": array, specifies one or multiple image distribution targets 
	{ 
“type” : “”, // string, required, the type of distribution, either 
‘ManagedImage’ or ‘SharedImage’ or ‘VHD’ 
 
“runOutputName” : “”, // string, required, the name to be used for the associated RunOutput 
 
“tags” : “”, // object, optional, user defined key value pairs  //managed disk properties 
 
 
“imageId” : “” // string, required, resourceID of the managed disk image “location” : “” // string, required, image location, should match existing image location if updating 
 
// shared image gallery specific properties  
“galleryImageId” : “” // string, required, resourceID of the managed disk image 
 
“replicationRegions” : “” // array, required, image location, should match existing image location if image exists…  
 
//VHD properties 
 
“runOutputName” : “”, // string, required, the name to be used for the associated RunOutput 
 
 
         	 	}, 
 
 	//the properties below are read only, and typically shown on GET requests  
 
 
        "provisioningState": // string, output only, describes state of the resource {  
       ["Creating", 
        "Succeeded", 
        "Failed", 
        "Deleting"] 
        }, 
 	  
"ProvisioningError":\\ string, output only, Error code of the provisioning 
failure	 
           { 
            "BadSourceType", 
            "BadPIRSource", 
            "BadISOSource", 
            "BadManagedImageSource", 
            "BadCustomizerType", 
            "UnsupportedCustomizerType", 
            "NoCustomizerScript", 
            "BadDistributeType", 
            "BadSharedImageDistribute", 
            "ServerError", 
            "Other" 
          }, 
 
"lastRunStatus":  // State of 'run' that is currently executing or was last
executed	 
	 	{ 	         
“startTime”:””, // string, output only, readonly, date-time, Start time of the last run (UTC) 
“endTime”:””, // string, output only, readonly, date-time, End time of the last run (UTC) 
“runState”:””, // string, output only, describe state of last run 
	 	 	["PartiallySucceeded", 
             "Running", 
             "Succeeded", 
             "Failed"] 
 
“runSubState”:””, // string, sub state of the last run 
	 	["queued", 
             "Queued", 
"Building", 
             "Customizing", 
             "Distributing] 
 
“message”:”” // string, verbose information about the last run state 
} }, 
 
Appendix 
Setting Permissions for AIB through the Portal 
To allow Azure VM Image Builder to distribute, you will need to provide permissions for the service "Azure Virtual Machine Image Builder" (app id cf32a0cc-373c-47c9-9156-0db11f6a6dfc) to these locations. E.g. 'contributor' on a resource group where your managed image is written or 'contributor' on a Shared Image Gallery where you're writing a new image version. 
 
The hyperlink shows how to do this through Az CLI, but you can go to the Portal, select Resource Group, Access Control (IAM), then ‘Add’: 
  
If the service account is not found, that may mean that the subscription where you are adding the role assignment has not yet registered for the resource provider. 
 
Creating a Shared Image Gallery 
The Azure Shared Image Gallery (SIG) allows you to share your custom images across your organization, and build VM’s referencing the Image Properties. The SIG allows you to version the images, replicate images across regions, specify number of replicas for performance, and apply RBAC. 

> [!NOTE]
> The SIG and Image Definition must be setup prior to using Image Builder 
 
The Azure Image Builder interfaces directly with the SIG API, so you can specify some of the SIG properties in the Image Builder Template, then your image will be distributed and replicated into those regions. 
 
For more information, see: 
Linux : https://docs.microsoft.com/en-us/azure/virtual-machines/linux/shared-images 
Windows : https://docs.microsoft.com/en-us/azure/virtual-machines/windows/shared-images 
 
## Getting Help 
 
If you have questions, issues, feature requests, image/iso support requests, meaningless errors, please reach out to us on the MS Teams channel and we will get back to you. Note, we are available Pacific Time Zone office hours only, and there is no MS Customer Support Services support yet. 
 
