---
title: Make virtual machine scale sets available in Azure Stack
description: Learn how a cloud administrator can add virtual machine scale to the Azure Stack Marketplace
services: azure-stack
author: anjayajodha
ms.service: azure-stack
ms.topic: article
ms.date: 9/25/2017
ms.author: anajod
keywords:
---

# Make virtual machine scale sets available in Azure Stack

*Applies to: Azure Stack integrated systems and Azure Stack Development Kit*

Virtual machine scale sets are an Azure Stack compute resource. You can use them to deploy and manage a set of identical virtual machines. With all virtual machines configured the same, scale sets don’t require pre-provisioning of virtual machines. It's easier to build large-scale services that target big compute, big data, and containerized workloads.

This topic guides you through the process to make scale sets available in the Azure Stack Marketplace. After you complete this procedure, your users can add virtual machine scale sets to their subscriptions.

Virtual machine scale sets on Azure Stack are like virtual machine scale sets on Azure. For more information, see the following videos:
* [Mark Russinovich talks Azure scale sets](https://channel9.msdn.com/Blogs/Regular-IT-Guy/Mark-Russinovich-Talks-Azure-Scale-Sets/)
* [Virtual Machine Scale Sets with Guy Bowerman](https://channel9.msdn.com/Shows/Cloud+Cover/Episode-191-Virtual-Machine-Scale-Sets-with-Guy-Bowerman)

On Azure Stack, Virtual Machine Scale Sets do not support auto-scale. You can add more instances to a scale set using the Azure Stack portal, Resource Manager templates, or PowerShell.

## Prerequisites
* **Powershell and tools**

   Install and configured PowerShell for Azure Stack and the Azure Stack tools. See [Get up and running with PowerShell in Azure Stack](azure-stack-powershell-configure-quickstart.md).

   After you install the Azure Stack tools, make sure you import the following PowerShell module (path relative to the .\ComputeAdmin folder in the AzureStack-Tools-master folder):

        Import-Module .\AzureStack.ComputeAdmin.psm1

* **Operating system image**

   If you haven’t added an operating system image to your Azure Stack Marketplace, see [Add the Windows Server 2016 VM image to the Azure Stack marketplace](azure-stack-add-default-image.md).

   For Linux support, download Ubuntu Server 16.04 and add it using ```Add-AzsVMImage``` with the following parameters: ```-publisher "Canonical" -offer "UbuntuServer" -sku "16.04-LTS"```.

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
Select-AzureRmProfile -Profile $AzsEnvContext

Select-AzureRmSubscription -SubscriptionName "Default Provider Subscription"

Add-AzsVMSSGalleryItem -Location $Location
```

## Remove a virtual machine scale set

To remove a virtual machine scale set gallery item, run the following PowerShell command:

    Remove-AzsVMSSGalleryItem

> [!NOTE]
> The gallery item may not be removed immediately. You may need to refresh the portal several times before it is removed from the Marketplace.


## Next steps
[Frequently asked questions for Azure Stack](azure-stack-faq.md)

