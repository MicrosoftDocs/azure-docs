---
title: How to configure MSI on an Azure VM using a template
description: Step by step instructions for configuring a Managed Service Identity (MSI) on an Azure VM, using an Azure Resource Manager template.
services: active-directory
documentationcenter: ''
author: bryanla
manager: mbaldwin
editor: ''

ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 09/14/2017
ms.author: bryanla
---

# Configure an Azure VM Managed Service Identity (MSI) using a template

## Prerequisites

[!INCLUDE [active-directory-msi-qs-configure-prereqs](../../includes/active-directory-msi-qs-configure-prereqs.md)]

As with the Azure portal and scripting, Azure Resource Manager templates provide the ability to deploy new/modified resources defined by an Azure resource group. Several options are available for template-based management, including:

- Web-based features in the Azure portal such as:
  - Using a [custom template from Azure marketplace](../azure-resource-manager/resource-group-template-deploy-portal.md#deploy-resources-from-custom-template), which allows you to create a template from scratch, or base it on an existing common or [QuickStart template](https://azure.microsoft.com/documentation/templates/).
  - Deriving from an existing resource group, by exporting a template from either [the original deployment](../azure-resource-manager/resource-manager-export-template.md#view-template-from-deployment-history), or from the [current state of the deployment](../azure-resource-manager/resource-manager-export-template.md#export-the-template-from-resource-group).

- Local tools such as:
  - [a JSON editor (such as VS Code)](../azure-resource-manager/resource-manager-create-first-template.md), then upload/deploy using PowerShell or CLI.
  - Visual Studio's [Azure Resource Group project](../azure-resource-manager/vs-azure-tools-resource-groups-deployment-projects-create-deploy.md).

Feel free to use any of the preceding techniques, but for purposes of demonstration in this article we use Xxxxx

## Enable MSI during creation of an Azure VM



```JSON
    {
        "apiVersion": "2015-06-15",
        "type": "Microsoft.Compute/virtualMachines",
        ...
        "identity": { 
            "type": "systemAssigned"
        },
        ...
    }
```


1. Sign in to the [Azure portal](https://portal.azure.com) using an account associated with the Azure subscription under which you would like to deploy the VM.

2. Find the [resource group](../azure-resource-manager/resource-group-overview.md#terminology). Resource groups are used for containment and deployment of the VM and related resources. 

## Enable MSI on an existing Azure VM

See https://github.com/rashidqureshi/MSI-Samples#appendix for incremental update on existing deployment.

If you have a VM that was originally provisioned without an MSI:

1. TODO

## Remove MSI from an Azure VM

See https://github.com/rashidqureshi/MSI-Samples#appendix for removing the extension.w

If you have a Virtual Machine that no longer needs an MSI, you can remove the VM's MSI:

1. TODO  

## Related content

- [Managed Service Identity overview](active-directory-msi-qs-configure-portal-windows-vm.md)

## Next steps

- Assign an MSI access to Azure Resource Manager
- Get a token using Managed Service Identity 

Use the following comments section to provide feedback and help us refine and shape our content.

<!--Reference style links IN USE -->
[AAD-App-Branding]: ./active-directory-branding-guidelines.md

<!--Image references-->
[AAD-Sign-In]: ./media/active-directory-devhowto-multi-tenant-overview/sign-in-with-microsoft-light.png
