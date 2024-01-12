---
title: Guidance on patching for SQL Server on Azure VMs (preview) using Azure Update Manager.
description: An overview on patching guidance for SQL Server on Azure VMs (preview) using Azure Update Manager  
author: snehasudhirG
ms.service: azure-update-manager
ms.topic: conceptual
ms.date: 09/27/2023
ms.author: sudhirsneha
---

# Guidance on patching for SQL Server on Azure VMs (preview) using Azure Update Manager

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.

This article provides the details on how to integrate [Azure Update Manager](overview.md) with your [SQL virtual machines](/azure/azure-sql/virtual-machines/windows/manage-sql-vm-portal) resource for your [SQL Server on Azure Virtual Machines (VMs)](/azure/azure-sql/virtual-machines/windows/sql-server-on-azure-vm-iaas-what-is-overview)

## Overview

[Azure Update Manager](overview.md) is a unified service that allows you to manage and govern updates for all your Windows and Linux virtual machines across your deployments in Azure, on-premises, and on the other cloud platforms from a single dashboard. 

Azure Update Manager designed as a standalone Azure service to provide SaaS experience to manage hybrid environments in Azure.

Using Azure Update Manager you can manage and govern updates for all your SQL Server instances at scale. Unlike with [Automated Patching](/azure/azure-sql/virtual-machines/windows/automated-patching), Update Manager installs cumulative updates for SQL server.



 
## Next steps
- [An overview on Azure Update Manager](overview.md)
- [Check update compliance](view-updates.md) 
- [Deploy updates now (on-demand) for single machine](deploy-updates.md) 
- [Schedule recurring updates](scheduled-patching.md)
