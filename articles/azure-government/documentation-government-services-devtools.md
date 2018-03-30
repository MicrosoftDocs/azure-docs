---
title: Azure Government Developer Tools | Microsoft Docs
description: This provides a comparison of features and guidance on developing applications for Azure Government.
services: azure-government
cloud: gov
documentationcenter: ''
author: ryansoc
manager: zakramer

ms.assetid: 4b7720c1-699e-432b-9246-6e49fb77f497
ms.service: azure-government
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 3/26/2018
ms.author: magoedte; ryansoc

---
# Azure Government Developer Tools
This article outlines the developer tools services variations and considerations for the Azure Government environment.

## DevTest Labs
DevTest Labs is generally available in Azure Government.
For more information, see [DevTest Labs public documentation](../devtest-lab/devtest-lab-overview.md).

### Variations
The following DevTest Labs features are not currently available in Azure Government:
* [Azure Resource Manager templates to create multi-VM environments and PaaS resources within a Lab](https://docs.microsoft.com/en-us/azure/devtest-lab/devtest-lab-create-environment-from-arm).
* Connect to an external GitHub repository to add Azure Resource Manager Templates, however [adding artifact repositories to leverage custom artifacts](../devtest-lab/devtest-lab-add-artifact-repo) is available.
* Auto shutdown feature for Azure compute VMs, however, setting auto shutdown for a [Lab](https://azure.microsoft.com/en-us/updates/azure-devtest-labs-auto-shutdown-notification/) and [Lab Virtual Machines](https://azure.microsoft.com/en-us/updates/azure-devtest-labs-set-auto-shutdown-for-a-single-lab-vm/) is available.  
 

## Next steps
* Subscribe to the [Azure Government blog](https://blogs.msdn.microsoft.com/azuregov/)
* Get help on Stack Overflow by using the [azure-gov](https://stackoverflow.com/questions/tagged/azure-gov)
* Give feedback or request new features via the [Azure Government feedback forum](https://feedback.azure.com/forums/558487-azure-government) 
