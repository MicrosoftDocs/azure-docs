---
title: Capacity planning spreadheet for Azure Stack | Microsoft Docs
description: Learn about the capacity planning spreadsheet for Azure Stack deployments.
services: azure-stack
documentationcenter: ''
author: jeffgilb
manager: femila
editor: ''

ms.assetid:
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/12/2018
ms.author: jeffgilb
ms.reviewer: prchint
---

# Azure Stack capacity planning spreadsheet
The following is a short summary of the worksheets contained in the Azure Stack Capacity Planner spreadsheet that can be downloaded from [http://aka.ms/azstackcapacityplanner](http://aka.ms/azstackcapacityplanner):

|Tab Name|Description|
|-----|-----|
|SolutionSizing	|Overall summary of the solution capacity. User is supposed to select the Azure Stack Solution SKU and number of servers in the Scale Unit. No other inputs are required.|
|SolutionSKUs|Multi-column table that captures all solutions available for selection on the SolutionSizing worksheet.  Once a SKU is defined, a column is updated or added to capture all of the details.  At this point, only SSD + HDD storage solutions are allowed or calculated.|
|AzureStackSWBOM|All infrastructure software resources and allocation details are captured here. No modification is needed and the totals are used within the first sheet to account for infrastructure overhead.|
|VMSizeTemplate|All Azure VM sizes and details are enumerated for reference. The VMs supported in Azure Stack are noted along with the changes in Temp Disk sizes. Also note that the ratio of physical memory to temp disk sizes is calculated for reference.|
|Base Physical Model|Main worksheet used to calculate the Storage Spaces Direct capacities given the various Cache and Capacity device sizes and counts.|
|Base Physical VD Model|Unused – Storage Spaces Direct capacity calculations|
|Capacity to Content Model|Unused – Storage Spaces Direct capacity calculations|
|IntelArk|Copy of Intel’s public information on their CPU SKUs for the E5-26**V4 SKUs. This worksheet is referenced as part of the SolutionSKUs worksheet when selecting a CPU SKU to find the appropriate number of physical cores per CPU.|
|LogicalNetwork|Captures the logical network subnet layout for Azure Stack for reference|
|Support|Inputs to the Spaces Direct worksheets|
|AzureStackInputs|Inputs or values used in the Azure Stack capacity calculations|
|      |     |

## Next steps
[Datacenter integration considerations for Azure Stack](azure-stack-datacenter-integration.md)
