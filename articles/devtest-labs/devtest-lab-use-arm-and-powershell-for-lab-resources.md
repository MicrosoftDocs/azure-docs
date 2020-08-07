---
title: Create or modify labs using Azure Resource Manager templates
description: Learn how to use Azure Resource Manager templates with PowerShell to create or modify labs automatically in a DevTest lab
ms.topic: article
ms.date: 06/26/2020
---

# Create or modify labs automatically using Azure Resource Manager templates and PowerShell

DevTest Labs provides many Azure Resource Manager templates and PowerShell scripts that can help you quickly and automatically create new labs or modify existing labs and then deploy these resources.

This article helps guide you through the process of using these templates and scripts to automate the creation, modification, and deployment of your labs. This article also shows you where you can find more information about how to use PowerShell to perform some common tasks in DevTest Labs.

## Step 1: Gather your templates and scripts
You can find pre-made [Azure Resource Manager templates](https://github.com/Azure/azure-devtestlab/tree/master/samples/DevTestLabs/QuickStartTemplates) and [PowerShell scripts](https://github.com/Azure/azure-devtestlab/tree/master/samples/DevTestLabs/Scripts) at our public [GitHub repository](https://github.com/Azure/azure-devtestlab). Use them as-is, or customize them for your needs and store them in your own [private Git repo](devtest-lab-add-artifact-repo.md).

## Step 2: Modify your Azure Resource Manager template
You can follow the steps at [Create your first Azure Resource Manager template](https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-create-first-template) if you have never created a template before.

In addition, [Best practices for creating Azure Resource Manager templates](https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-template-best-practices) offers many guidelines and suggestions to help you create Azure Resource Manager templates that are reliable and easy to use. Typically, you will use a variation of one of the approaches or examples provided and modify your template for your needs.

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
