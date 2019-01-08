---
title: Azure Monitor for VMs (preview) known issues | Microsoft Docs
description: This article covers known issues with Azure Monitor for VMs, a solution in Azure that combines health, application dependency discovery, and performance monitoring of the Azure VM operating system. 
services: azure-monitor
documentationcenter: ''
author: mgoedtel
manager: carmonm
editor: tysonn
ms.assetid: 
ms.service: azure-monitor
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 01/08/2018
ms.author: magoedte
---

# Known issues with Azure Monitor for VMs (preview)

This article covers known issues with Azure Monitor for VMs, a solution in Azure that combines health and performance monitoring of the Azure VM operating system. 

The following are known issues with the Health feature:

- If an Azure VM is removed or deleted, it's displayed in the VM list view for sometime. Additionally, clicking the state of a removed or deleted VM opens the **Health Diagnostics** view and then initiates a loading loop. Selecting the name of the deleted VM opens a pane with a message stating that the VM has been deleted.
- Configuration changes, such as updating a threshold, take up to 30 minutes even if the portal or Workload Monitor API might update them immediately. 
- The Health Diagnostics experience updates faster than the other views. The information might be delayed when you switch between them. 
- Shutting down VMs updates some of health criteria to *critical* and others to *healthy*. The net VM state is displayed as *critical*.
- For Linux VMs, the title of the page listing the health criteria for a single VM view has the entire domain name of the VM instead of the user-defined VM name. 
- After you disable monitoring for a VM using one of the supported methods and you try deploying it again, you should deploy it in the same workspace. If chose a different workspace and try to view the health state for that VM, it might show inconsistent behavior.

## Next steps
To understand the requirements and methods for enabling monitoring of your virtual machines, review [Deploy Azure Monitor for VMs](vminsights-onboard.md).
