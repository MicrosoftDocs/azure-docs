### YamlMime:FAQ
metadata:
  title: Deprecated Azure Marketplace images
  description: "Learn about how the deprecation of Marketplace images can affect your deployment."
  author: cynthn
  ms.service: virtual-machines
  ms.subservice: imaging
  ms.date: 09/27/2022
  ms.author: cynthn
  ms.reviewer: edewe

title: Common questions about the Microsoft commercial marketplace 
summary: |
  This article answers commonly asked questions about the commercial marketplace. 
  
  [!INCLUDE [my-include-file](../includes/my-include-file.md)]
 
sections: 
  - name: General 
    questions: 
      - question: What is the Microsoft commercial marketplace? 
        answer: | 
          The commercial marketplace connects business and government agencies with solutions built by our partners. Our partners create and manage offers in Partner Center, and customers can discover and buy solutions … 
          To learn more, go to the [Microsoft commercial marketplace hub](https://partner.microsoft.com/asset/collection/commercial-marketplace#/). 

      - question: Where can I learn more about the Microsoft Admin Center? 
        answer: For information about the Microsoft Admin Center, see [Manage third-party app subscriptions for your organization](/microsoft-365/commerce/manage-saas-apps). 

  - name: Resources 
    questions: 
      - question: Where can I find more information about the commercial marketplace?
        answer: | 
          Here are some resources to get you started: 
          - [What is the Microsoft commercial marketplace?](overview.md) 
          - [Microsoft commercial marketplace partner hub](https://partner.microsoft.com/asset/collection/commercial-marketplace#/) 

additionalContent: |
  ## In Conclusion 
  Here's some optional text that can be placed at the end of the document.

# Azure Marketplace image deprecation


I got an email that my image is scheduled for deprecation, what does this mean? 

You might have received an email telling you that your Virtual machine is running on images that are scheduled for deprecation or already deprecated as seen in the diagram below. There are several reasons an image can be deprecated by the publisher which might be due to security issues or the image reaching end of life. 

 

Graphical user interface, text, application

Description automatically generated 

 

An image can be deprecated on the version, plan or offer level: 

Deprecation of an image version – The removal of an individual VM image version 

Deprecation of a plan or SKU – The removal of a plan or SKU and subsequently all images within the plan 

Deprecation of an offer – The removal of an entire VM offer, including all plans within the offer and subsequently all images within each plan. 

 

I received an email that my workloads are running on images that are scheduled for deprecation. What does this mean and does deprecation impact my existing workloads?  

Before the scheduled deprecation date: 

You can continue to deploy new VM/VMSS instances up until the deprecation date. 

After the scheduled deprecation date: 

You will not be able to deploy new instances using the affected images. If the plan is scheduled for deprecation, all image versions within the plan will no longer be available and if the entire offer is scheduled for deprecation, all plans within the offer will no longer be available following deprecation. 

Active VM instances will not be impacted. 

New VM instances cannot be created from any of the impacted images. 

Existing virtual machine scale sets (VMSS) deployments cannot be scaled out if configured with any of the impacted images. When a plan or offer is being deprecated, all existing VMSS deployments pinned to any image within the plan or offer respectively cannot be scaled out. 

 

 

 What is the recommended action? 

If you want your VMSS to scale out after the deprecation date, you will need to identify the VMSS running on the deprecated image and then migrate your workload to a supported image. (The steps to identify and migrate your workload are outlined below). If you want to remain on the image after deprecation, you can create your own custom image and migrate to it (Steps outlined below). If you already have auto updates configured for your VM/VMSS, you will only be impacted when an Offer or plan version is deprecated (No impact on image version deprecation). 

 

 

 

How can I identify the VM/VMSS instances in my subscription that are running on images that are scheduled for deprecation? 

You can search for the scheduled or deprecated image in your subscription (Your subscription ID and name is provided at the bottom of the email notification you received) in the following ways: 

If you are notified that an image is deprecated on only the Offer or plan (SKU) level: 

You can search for all virtual machines from the top search bar on the Azure Portal and edit the columns as seen below to include Publisher, Offer, Plan as below: (This will not give you version information, only up to the Plan information) 

 

               

If you are notified that an image is deprecated on the Offer, plan (SKU) or version level: 

Using Azure Resource Graph Explorer: 

You can use Azure Resource Graph Explorer on the Azure portal to find the specific version for images in your subscription that your VM/VMSS is running on. 

Run the queries below in the Azure Resource Graph explorer query window and uncomment the optional filters (delete the “//” to uncomment a line) to the Offer, Plan (SKU) or version level you are looking for. 

To find the details of the image versions that are being used by VM’s: 

Resources  

|where type == "microsoft.compute/virtualmachines"  

//| where properties.storageProfile.imageReference.publisher =~ 'Windows' //optional filter, uncomment this line to filter for a specific publisher. 

//| where properties.storageProfile.imageReference.sku =~ '2016-Datacenter' //optional filter, uncomment this line to filter for a specific deprecated SKU (Plan). 

//| where properties.storageProfile.imageReference.version == '14393.4467.2106061537' //optional filter, uncomment this line to filter for a specific deprecated version. 

|project name, subscriptionId, resourceGroup, ImagePublisher=properties.virtualMachineProfile.storageProfile.imageReference.publisher,ImageOffer=properties.virtualMachineProfile.storageProfile.imageReference.offer,imageSku=properties.virtualMachineProfile.storageProfile.imageReference.sku, imageVersion=properties.virtualMachineProfile.storageProfile.imageReference.version 

 

 

To find details of the image versions that are being used by VMSS: 

Resources  

|where type == "microsoft.compute/virtualmachinescalesets"  

//| where properties.virtualMachineProfile.storageProfile.imageReference.publisher =~ 'Windows' //optional filter, uncomment this line to filter for a specific publisher. 

//| where properties.virtualMachineProfile.storageProfile.imageReference.sku =~ '2016-Datacenter' //optional filter, uncomment this line to filter for a specific deprecated SKU (Plan). 

//| where properties.virtualMachineProfile.storageProfile.imageReference.version == '14393.4467.2106061537' //optional filter, uncomment this line to filter for a specific deprecated version.  

//| where properties.virtualMachineProfile.storageProfile.imageReference.version != "latest" //optional filter, uncomment this line to filter out VMSS that are not using "latest version" in VMSS model. 

|project name, subscriptionId, resourceGroup, ImagePublisher=properties.virtualMachineProfile.storageProfile.imageReference.publisher,ImageOffer=properties.virtualMachineProfile.storageProfile.imageReference.offer,imageSku=properties.virtualMachineProfile.storageProfile.imageReference.sku, imageVersion=properties.virtualMachineProfile.storageProfile.imageReference.version 

``` 

 

Graphical user interface, text, application, email

Description automatically generated 

 

 

Using Powershell commands: 

List VM with deprecated images at version level: 

To find VMs using a deprecated Version (Replace highlighted value with version you are looking for): 

 

(Get-AzVM -ResourceGroupName $rgname -Name $vmname).StorageProfile.ImageReference.ExactVersion 

 

To find VMSS using a deprecated Version (Replace highlighted value with version you are looking for): 

$vmsslist = Get-AzVmss 

$vmsslist | where {$_.virtualMachineProfile.storageProfile.imageReference.Version -eq '14393.4402.2105052108'} | Select-Object -Property ResourceGroupName, Name, @{label='imageOffer'; expression={$_.virtualMachineProfile.storageProfile.imageReference.Offer}}, @{label='imagePublisher'; expression={$_.virtualMachineProfile.storageProfile.imageReference.Publisher}}, @{label='imageSKU'; expression={$_.virtualMachineProfile.storageProfile.imageReference.Sku}}, @{label='imageVersion'; expression={$_.virtualMachineProfile.storageProfile.imageReference.Version}} 

 

List VMSS with deprecated images at plan/SKU level 

To find VMSS using a deprecated SKU (Replace highlighted value with SKU you are looking for): 

$vmsslist = Get-AzVmss 

$vmsslist | where {$_.virtualMachineProfile.storageProfile.imageReference.Sku -eq '2016-Datacenter'} | Select-Object -Property ResourceGroupName, Name, @{label='imageOffer'; expression={$_.virtualMachineProfile.storageProfile.imageReference.Offer}}, @{label='imagePublisher'; expression={$_.virtualMachineProfile.storageProfile.imageReference.Publisher}}, @{label='imageSKU'; expression={$_.virtualMachineProfile.storageProfile.imageReference.Sku}}, @{label='imageVersion'; expression={$_.virtualMachineProfile.storageProfile.imageReference.Version}} 

`` 

Using Azure CLI: 

List VM with deprecated image at Plan/SKU level 

az vm show --resource-group $rgName --name $vmName --query "storageProfile.imageReference.exactVersion 

az vm list --query "[?storageProfile.imageReference.sku=='2016-Datacenter'].{VM:id, imageOffer:storageProfile.imageReference.offer, imagePublisher:StorageProfile.imageReference.publisher, imageSku: storageProfile.imageReference.sku, imageVersion:storageProfile.imageReference.version}" 

 

List VM with deprecated image at version level 

az vm list --query "[?storageProfile.imageReference.version=='14393.4402.2105052108'].{VM:id, imageOffer:storageProfile.imageReference.offer, imagePublisher:StorageProfile.imageReference.publisher, imageSku: storageProfile.imageReference.sku, imageVersion:storageProfile.imageReference.version}" 

 

Note: When an image is deprecated, there is no impact on existing VM’s therefore there are no actions required. You can choose to migrate your workloads to a new image if you have a specific concern. 

How do I migrate my workloads to another image? 

You might want to keep using an image that is scheduled for deprecation for specific reasons or you might want to migrate your workloads to another Offer/Plan/Version. Both steps are outlined below: 

You want to keep using an image that is scheduled for deprecation: 

 If you want to remain on an older image version even after it has been scheduled for deprecation, follows the steps below: 

 First generalize (sysprep) the powered off VM and create a custom image (Azure Compute Gallery formally called Shared Image Gallery) out of it and use that custom image for your VM/VMSS.  

Modify the VM/VMSS deployment you want to point to the custom image. 

Here is how to create a custom image by capturing a VM and sharing in to Azure Compute Gallery (formerly known as Shared Image Gallery (SIG)): Capture an image of a VM using the portal - Azure Virtual Machines | Microsoft Docs 

 

Note: We recommend that you create custom images from Free Marketplace images (images that do not have Plan Info) that are scheduled for deprecation or already deprecated. For Paid Marketplace images, we suggest you create custom images from the latest version of the image. Workloads running on custom images created from a deprecated paid image will no longer work after the paid image is deprecated. 

 

You want to migrate to another Offer/Plan/Version: 

First search for other offers, plans or versions from the same publisher with the following commands (Replace all highlighted values as needed): 

 

To migrate to another Offer: 

 

Powershell: 

Get-AzVMImage -Location "west europe" -PublisherName “MicrosoftWindowsServer”  

Azure CLI: 

az vm image list --location "west europe" --publisher "MicrosoftWindowsServer"  

 

To migrate to another Plan: Search for other plans under the same offer and then migrate to that plan. 

 

Powershell: 

Get-AzVMImage -Location "west europe" -PublisherName “MicrosoftWindowsServer” -Offer “WindowsServer” 

  

Azure CLI: 

az vm image list --location "west europe" --publisher "MicrosoftWindowsServer" --offer "WindowsServer"  

 

To migrate to another version: Search for another version (we suggest migrating to the latest version)   

 

Powershell: 

Get-AzVMImage -Location "west europe" -PublisherName “MicrosoftWindowsServer” -Offer “WindowsServer” -Skus "2019-Datacenter-with-Containers" 

Azure CLI: 

az vm image list --location "west europe" --publisher "MicrosoftWindowsServer" --offer "WindowsServer" --sku "2019-Datacenter-with-Containers" --all" 

 

 

NOTE:  

You need to verify that your workloads are supported and will run properly on the new image before migrating your workloads to the new image. 

VMSS, in general, support image reference replacement (https://docs.microsoft.com/en-us/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-upgrade-scale-set#os-updates) but VMs do not. 

 

 

 

Migrating VMSS workloads to newer image with minimal downtime:  

 

VMSS, suggestions for updating the version should include: 

To avoid downtime, ensure the upgrade policy is set to manual or rolling.  

If set to manual, existing instances won’t be re-imaged until it’s manually upgraded. 

If set to rolling, existing instances will be automatically upgraded and re-imaged by batch. 	 

Update image reference using steps in Modify an Azure virtual machine scale set: Modify an Azure virtual machine scale set - Azure Virtual Machine Scale Sets | Microsoft Docs 

Ensure that all existing instances are upgraded and on the latest model. You can also scale out and migrate workload to the new instances then delete the old instances, instead of upgrading the existing instances.  

Once the existing instances are all upgraded to the new image, change the upgrade policy back to what it was if needed.  

 

 

 

Are all image versions lower than the indicated version also deprecated?  

Generally, yes. However, it is recommended to confirm against the list of valid versions in a Plan using Virtual Machine Images - List - REST API (Azure Compute) | Microsoft Docs  

  

How can I check if a specific image is deprecated or scheduled for deprecation: 

You can check if an image is deprecated or scheduled for deprecation using the API (see image below): https://docs.microsoft.com/en-us/rest/api/compute/virtual-machine-images/get?tabs=HTTP.  

If the image is deprecated, you will get a “VM Image is Deprecated” reponse. If the image is scheduled for deprecation, the response would show the date of the scheduled deprecation. 

Uploaded Image 

 

The response indicates that this is deprecated: 

{ 

  "error": { 

    "code": "ImageVersionDeprecated", 

    "message": "VM Image from publisher: MicrosoftWindowsServer with - Offer: WindowsServer, Sku: 2016-Datacenter, Version: 14393.4169.2101090332 is deprecated." 

  } 

} 

 

 

## Next steps

For information about how to supply purchase plan information, see [Supply Azure Marketplace purchase plan information when creating images](marketplace-images.md).
