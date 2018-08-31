---
title: Azure Stack Validation as a Service known issues. | Microsoft Docs
description: Azure Stack Validation as a Service known issues.
services: azure-stack
documentationcenter: ''
author: mattbriggs
manager: femila

ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/24/2018
ms.author: mabrigg
ms.reviewer: johnhas

---

# Known issues for Validation as a Service

[!INCLUDE[Azure_Stack_Partner](./includes/azure-stack-partner-appliesto.md)]

_VaaS Version 2.1.0_

_Azure Stack Version Prod_20170624.1_
 
**Issue:** When running workload validation as part of VaaS testing for Azure Stack solution validation on Azure Stack build Prod_20170624.1 the Linux workload tests fail. 
 
**Status:** This is a known issue that will be fixed in an upcoming release of VaaS. 
 
**Resolution:** Until VaaS is updated users must manually upload the Linux image. Please follow the instructions below. 
 
**Instructions for Uploading VM Images via Admin Portal (Linux 16.04-LTS)**
 
1.       Login as the Service Admin to the admin portal. 
2.       Click on More services – Resource Providers – Compute – VM Images
3.       Click on the “+ Add” button at the top of the VM Images blade
4.       Update/Confirm the following fields (important, not all defaults are correct for the existing Marketplace Item):
    a. Publisher: Canonical
    b. Offer: UbuntuServer
    c. OS Type: Linux
    d. SKU: 16.04-LTS
    e. Version: 1.0.0
    f.  OS Disk Blob URL: [OS Disk Blob URL](https://azurestacktemplate.blob.core.windows.net/azurestacktemplate-public-container/Ubuntu1604LTS.vhd )
5.       Click on the “Create” button
 
- [Troubleshoot Validation as a Service](azure-stack-vaas-troubleshoot.md)