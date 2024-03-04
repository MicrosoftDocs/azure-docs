---
title: Troubleshoot Custom image templates (preview) - Azure Virtual Desktop
description: Troubleshoot Custom image templates in Azure Virtual Desktop.
ms.topic: troubleshooting
author: dknappettmsft
ms.author: daknappe
ms.date: 04/05/2023
---

# Troubleshoot Custom image templates in Azure Virtual Desktop (preview)

> [!IMPORTANT]
> Custom image templates in Azure Virtual Desktop is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Custom image templates in Azure Virtual Desktop enable you to easily create a custom image that you can use when deploying session host virtual machines (VMs). This article helps troubleshoot some issues you could run into.

## General troubleshooting when creating an image

Azure Image Builder uses Hashicorp Packer to create images. Packer outputs all log entries to a file called **customization.log**. By default this file is located in a resource group that Azure Image Builder created automatically with the naming convention `IT_<ResourceGroupName>_<TemplateName>_<GUID>`. You can override this naming by specifying your own name in the template creation phase.

In this resource group is a storage account with a blob container called **packerlogs**. In the container is a folder named with a GUID in which you'll find the log file. 	Entries for built-in scripts you use to customize your image begin **Starting AVD AIB Customization: {Script name}: {Timestamp}**, to help you locate any errors related to the scripts.

To learn how to interpret Azure Image Builder logs, see [Troubleshoot Azure VM Image Builder](../virtual-machines/linux/image-builder-troubleshoot.md).

> [!IMPORTANT]
> Microsoft Support doesn't handle issues for any customer created scripts, or any scripts or templates copied from a Microsoft repository and modified. You are welcome to collaborate and improve these tools in our [GitHub repository](https://github.com/Azure/RDS-Templates/issues), where you can open an issue. For more information, see [Why do we not support customer or third party scripts?](https://techcommunity.microsoft.com/t5/ask-the-performance-team/help-my-powershell-script-isn-t-working-can-you-fix-it/ba-p/755797)

## Resource group must be empty

If you specify your own resource group for Azure Image Builder to use, then it needs to be empty before the image build starts. This means that if you want to reuse an existing resource group for this purpose you'll just need to delete all the resources within it. Alternatively, if you need to keep these items you can specify another new resource group on the build properties tab of the template creation.

## Script is unavailable

If you see the message **Resource *\<URI\>* is unavailable. Please check the file exists, and that Image Builder can access it**, check the Uniform Resource Identifier (URI) for your script. This needs to be a publicly available location, such as GitHub or a web service.

## Azure Compute Gallery VM image definition generation mismatch

If you see the message **Validation failed: Error with Hyper-V Version validation (cross-generation for multiple Hyper-V Versions is not supported). The provided SIG: *\<Resource ID\>* has a different Hyper-V Generation *\<version\>* than source image *\<version\>***, make sure that the generation of your source image is the same as the generation you specified for your Azure Compute Gallery VM image definition.

The generation for the source image is shown when you select the image you want to use. You can check the generation of the VM image definition in the Azure portal, Azure CLI using the [az sig image-definition list](/cli/azure/sig/image-definition#az-sig-image-definition-list) reference command, or PowerShell using the [Get-AzGalleryImageDefinition](/powershell/module/az.compute/get-azgalleryimagedefinition) cmdlet.

## PrivateLinkService Network Policy is not disabled for the given subnet

If you receive the error message starting **PrivateLinkService Network Policy is not disabled for the given subnet**, you need to disable the *private service policy* on the subnet. For more information, see [Disable private service policy on the subnet](../virtual-machines/windows/image-builder-vnet.md#disable-private-service-policy-on-the-subnet).
