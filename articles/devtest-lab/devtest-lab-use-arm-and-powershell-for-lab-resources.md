---
title: Use Azure Resource Manager templates and PowerShell to provision DevTest lab resources | Microsoft Docs
description: Learn how to use Azure Resource Manager templates with PowerShell to provision resources in a DevTest lab
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

# Use Azure Resource Manager templates and PowerShell to provision DevTest lab resources

You can use Azure PowerShell with Azure Resource Manager templates to provision DevTest lab resources in Azure. You can create multi-VM environments from your Azure Resource Manager templates and then use PowerShell to deploy those resources.

This article points you to many different topics that will help you better understand how to use PowerShell and Azure Resource Manager templates in DevTest labs.

* [Create multi-VM environments with Azure Resource Manager templates](devtest-lab-create-environment-from-arm.md) shows you how to use Azure Resource Manager templates within DevTest labs to define the infrastructure and configuration of your Azure solution and repeatedly deploy multiple VMs in a consistent state.

* [Deploy resources with Resource Manager templates and Azure PowerShell](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-template-deploy) provides general information about using Azure PowerShell with Azure Resource Manager templates to deploy your resources to Azure.

* We have provided a [Github repository of lab Azure Resource Manager templates](https://github.com/Azure/azure-devtestlab/tree/master/ARMTemplates) that you can deploy as-is or modify to create custom templates for your labs. Each of these templates has a link that you can click to deploy the lab as-is under your own Azure subscription, or you can customize the template and [deploy using PowerShell or Azure CLI](../azure-resource-manager/resource-group-template-deploy.md).

An Azure Resource Manager template can be either a local file or an external file that is available through a URI. When your template resides in a storage account, you can restrict access to the template and provide a shared access signature (SAS) token during deployment.

## Using PowerShell in DevTest labs
Here are a few other things you can do in DevTest labs using PowerShell.
* [Create a custom image from a VHD file using PowerShell](devtest-lab-create-custom-image-from-vhd-using-powershell.md)
* [Upload VHD file to lab's storage account using PowerShell](devtest-lab-upload-vhd-using-powershell.md)
* [Add an external user to a lab using PowerShell](devtest-lab-add-devtest-user.md#add-an-external-user-to-a-lab-using-powershell)
* [Creating a lab custom role using PowerShell](devtest-lab-grant-user-permissions-to-specific-lab-policies.md#creating-a-lab-custom-role-using-powershell)

## Next steps
* Once a VM has been created, you can connect to the VM by selecting **Connect** on the VM's blade.
* Explore the [Azure Resource Manager templates from Azure Quickstart template gallery](https://github.com/Azure/azure-quickstart-templates)
