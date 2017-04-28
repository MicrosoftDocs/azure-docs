---
title: Create or modify labs automatically using Azure Resource Manager templates with PowerShell | Microsoft Docs
description: Learn how to use Azure Resource Manager templates with PowerShell to create or modify labs automatically in a DevTest lab
services: devtest-lab,virtual-machines,visual-studio-online
documentationcenter: na
author: tomarcher
manager: douge
editor: ''

ms.assetid: dad9944c-0b20-48be-ba80-8f4aa0950903
ms.service: devtest-lab
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/21/2017
ms.author: tarcher

---

# Create or modify labs automatically using Azure Resource Manager templates and PowerShell

DevTest Labs provides many Azure Resource Manager templates and PowerShell scripts that can help you quickly and automatically create new labs or modify existing labs and then deploy these resources.

This article helps guide you through the process of using these templates and scripts to automate the creation, modification, and deployment of your labs. This article also shows you where you can find more information about how to use PowerShell to perform some common tasks in DevTest Labs.

## Step 1: Gather your templates and scripts
You can find pre-made [Azure Resource Manager templates](https://github.com/Azure/azure-devtestlab/tree/master/ARMTemplates) and [PowerShell scripts](https://github.com/Azure/azure-devtestlab/tree/master/Scripts) at our public [Github repository](https://github.com/Azure/azure-devtestlab). Use them as-is, or customize them for your needs and store them in your own [private Git repo](devtest-lab-add-artifact-repo.md). 

## Step 2: Modify your Azure Resource Manager template
[Create multi-VM environments and PaaS resources with Azure Resource Manager templates](devtest-lab-create-environment-from-arm.md) shows you how to use Azure Resource Manager templates within DevTest labs to define the infrastructure and configuration of your Azure solution and repeatedly deploy multiple VMs in a consistent state.

For example, if you created a new virtual network and wanted to apply it to all of your existing labs, you could quickly do so by using an Azure Resource Manager template.

## Step 3: Deploy resources with PowerShell
After you have customized your templates and scripts, follow the steps necessary to [deploy resources with Resource Manager templates and Azure PowerShell](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-template-deploy). The article provides general information about using Azure PowerShell with Azure Resource Manager templates to deploy your resources to Azure.


## Common tasks you can perform in DevTest labs using PowerShell
There are many other common tasks that you can automate by using PowerShell. The following sections of the documentation outline the steps required to perform these tasks.

* [Create a custom image from a VHD file using PowerShell](devtest-lab-create-custom-image-from-vhd-using-powershell.md)
* [Upload VHD file to lab's storage account using PowerShell](devtest-lab-upload-vhd-using-powershell.md)
* [Add an external user to a lab using PowerShell](devtest-lab-add-devtest-user.md#add-an-external-user-to-a-lab-using-powershell)
* [Create a lab custom role using PowerShell](devtest-lab-grant-user-permissions-to-specific-lab-policies.md#creating-a-lab-custom-role-using-powershell)

### Next steps
* Learn how to create a [private Git repository](devtest-lab-add-artifact-repo.md) where you will store your customized templates or scripts.
* Explore the [Azure Resource Manager templates from Azure Quickstart template gallery](https://github.com/Azure/azure-quickstart-templates).
