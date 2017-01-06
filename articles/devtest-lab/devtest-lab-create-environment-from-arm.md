---
title: Create multi-VM environments with Azure Resource Manager templates | Microsoft Docs
description: Learn how to create multi-VM environments in Azure DevTest Labs from an Azure Resource Manager (ARM) template
services: devtest-lab,virtual-machines,visual-studio-online
documentationcenter: na
author: tomarcher
manager: douge
editor: ''

ms.assetid: 
ms.service: devtest-lab
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/03/2017
ms.author: tarcher

---

# Create multiple VM environments with Azure Resource Manager templates

The [Azure portal](http://go.microsoft.com/fwlink/p/?LinkID=525040) enables you to easily [create and add a VM to a lab](./devtest-lab-add-vm-with-artifacts.md). This works well for one-off VM creation. However, for scenarios such as a multi-tier Web app or a SharePoint farm, a mechanism is needed to allow for the creation of multiple identical VMs in a single step. By leveraging Azure Resource Manager templates, you can now define the infrastructure and configuration of your Azure solution and repeatedly deploy multiple VMs in a consistent state. This feature provides the following benefits:

- Azure Resource Manager templates are loaded directly from your source control repository (GitHub or Team Services Git).
- Once configured, users can create an environment by simply picking an Azure Resource Manager template from the Azure portal as what they can do with other types of [VM bases](./devtest-lab-comparing-vm-base-image-types.md).
- Azure PaaS resources can be provisioned in an environment from an Azure Resource Manager template in addition to IaasS VMs.
- The cost of environments can be tracked in the lab in addition to individual VMs created by other types of bases.

## Configure Azure Resource Manager template repositories

## Create the environments

## Next steps


