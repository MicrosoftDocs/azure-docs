---
title: 'Make virtual machine scale sets available in Azure Stack | Microsoft Docs'
description: Learn how a cloud operator can add virtual machine scale to the Azure Stack Marketplace
services: azure-stack
author: brenduns
manager: femila
editor: ''

ms.service: azure-stack
ms.topic: article
ms.date: 04/20/2018
ms.author: brenduns
ms.reviewer: kivenkat

---

# Make virtual machine scale sets available in Azure Stack

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

Virtual machine scale sets are an Azure Stack compute resource. You can use them to deploy and manage a set of identical virtual machines. With all virtual machines configured the same, scale sets don’t require pre-provisioning of virtual machines. It's easier to build large-scale services that target big compute, big data, and containerized workloads.

This article guides you through the process to make scale sets available in the Azure Stack Marketplace. After you complete this procedure, your users can add virtual machine scale sets to their subscriptions.

Virtual machine scale sets on Azure Stack are like virtual machine scale sets on Azure. For more information, see the following videos:
* [Mark Russinovich talks Azure scale sets](https://channel9.msdn.com/Blogs/Regular-IT-Guy/Mark-Russinovich-Talks-Azure-Scale-Sets/)
* [Virtual Machine Scale Sets with Guy Bowerman](https://channel9.msdn.com/Shows/Cloud+Cover/Episode-191-Virtual-Machine-Scale-Sets-with-Guy-Bowerman)

On Azure Stack, virtual machine scale sets don't support auto-scale. You can add more instances to a scale set using the Azure Stack portal, Resource Manager templates, or PowerShell.

## Prerequisites
* **Powershell and tools**

   Install and configured PowerShell for Azure Stack and the Azure Stack tools. See [Get up and running with PowerShell in Azure Stack](azure-stack-powershell-configure-quickstart.md).

   After you install the Azure Stack tools, make sure you import the following PowerShell module (path relative to the .\ComputeAdmin folder in the AzureStack-Tools-master folder):

        Import-Module .\AzureStack.ComputeAdmin.psm1

* **Operating system image**

   If you haven’t added an operating system image to your Azure Stack Marketplace, see [Add the Windows Server 2016 VM image to the Azure Stack marketplace](azure-stack-add-default-image.md).

   For Linux support, download Ubuntu Server 16.04 and add it using ```Add-AzsPlatformImage``` with the following parameters: ```-publisher "Canonical" -offer "UbuntuServer" -sku "16.04-LTS"```.


## Add the virtual machine scale set

Edit the following PowerShell script for your environment and then run it to add a virtual machine scale set to your Azure Stack Marketplace. 

``$User`` is the account you use to connect the administrator portal. For example, serviceadmin@contoso.onmicrosoft.com.

```
$Arm = "https://adminmanagement.local.azurestack.external"
$Location = "local"

Add-AzureRMEnvironment -Name AzureStackAdmin -ArmEndpoint $Arm

$Password = ConvertTo-SecureString -AsPlainText -Force "<your Azure Stack administrator password>"

$User = "<your Azure Stack service administrator user name>"

$Creds =  New-Object System.Management.Automation.PSCredential $User, $Password

$AzsEnv = Get-AzureRmEnvironment AzureStackAdmin
$AzsEnvContext = Add-AzureRmAccount -Environment $AzsEnv -Credential $Creds

Select-AzureRmSubscription -SubscriptionName "Default Provider Subscription"

Add-AzsVMSSGalleryItem -Location $Location
```

## Update images in a virtual machine scale set 
After you create a virtual machine scale set, users can update images in the scale set without the scale set having to be recreated. The process to update an image depends on the following scenarios:

1. Virtual machine scale set deployment template **specifies latest** for *version*:  

   When the *version* is set as **latest** in the *imageReference* section of the template for a scale set, scale up operations on the scale set use the newest available version of the image for the scale set instances. After a scale up is complete, you can delete older virtual machine scale sets instances.  (The values for *publisher*, *offer*, and *sku* remain unchanged). 

   The following is an example of specifying *latest*:  

          "imageReference": {
             "publisher": "[parameters('osImagePublisher')]",
             "offer": "[parameters('osImageOffer')]",
             "sku": "[parameters('osImageSku')]",
             "version": "latest"
             }

   Before scale up can use a new image, you must download that new image:  

   - When the image on the Marketplace is a newer version than the image in the scale set: Download the new image that replaces the older image. After the image is replaced, a user can proceed to scale up. 

   - When the image version on the Marketplace is the same as the image in the scale set: Delete the image that is in use in the scale set, and then download the new image. During the time between the removal of the original image and the download of the new image, you cannot scale up. 
      
     This process is required  to resyndicate images that make use of the sparse file format, introduced with version 1803. 
 

2. Virtual machine scale set deployment template **does not specify latest** for *version* and specifies a version number instead:  

     If you download an image with a newer version (which changes the available version), the scale set can't scale up. This is by design as the image version specified in the scale set template must be available.  

For more information, see [operating system disks and images](.\user\azure-stack-compute-overview.md#operating-system-disks-and-images).  


## Remove a virtual machine scale set

To remove a virtual machine scale set gallery item, run the following PowerShell command:

    Remove-AzsVMSSGalleryItem

> [!NOTE]
> The gallery item may not be removed immediately. You night need to refresh the portal several times before the item shows as removed from the Marketplace.


## Next steps
[Frequently asked questions for Azure Stack](azure-stack-faq.md)

