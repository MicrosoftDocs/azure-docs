---
title: Connect to a SQL Server Virtual Machine (Resource Manager) | Microsoft Docs
description: Learn how to use the Azure  Hybrid Benefit to bring your own SQL Server license to a SQL Server Azure VM. 
services: virtual-machines-windows
documentationcenter: na
author: MashaMSFT
manager: craigg
tags: azure-resource-manager

ms.assetid: aa5bf144-37a3-4781-892d-e0e300913d03
ms.service: virtual-machines-sql
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 12/12/2017
ms.author: mathoma

---
# How to - Use the Azure Hybrid Benefit with a SQL Server virtual machine

## Overview

This topic describes how to use the Azure Hybrid Benefit to bring your own SQL Server license to a VM with SQL Server running on Azure. This article walks you through provisioning a SQL VM first, and then switching the SQL Server license over to your own license. If you already have your own SQL VM, then skip to [Step 2](#step-2---update-the-sql-vm-to-use-the-azure-hybrid-benefit)

The Azure Hybrid Benefit allows you to convert SQL Server licensing with active Software Assurance to save in Azure for IaaS and PaaS. For more information, see [Azure hybrid benefit](https://azure.microsoft.com/pricing/hybrid-benefit/)

## Prerequisites 
To complete this tutorial, you need an Azure account, the Azure powershell module, and a SQL Server license with Software Assurance. 

- Get a free [Azure Account](https://azure.microsoft.com/offers/ms-azr-0044p/).
- Install the [Azure Powershell module](https://docs.microsoft.com/powershell/azure/install-azurerm-ps?view=azurermps-6.12.0).
- Purchase [Software Assurance](https://www.microsoft.com/en-us/licensing/licensing-programs/software-assurance-default?activetab=software-assurance-default-pivot%3aprimaryr3).

## Step 1 - Create a plain VM
The first step is to provision your SQL VM. This is assuming that you do not already have a VM running SQL Server. If you do, go on to the next step. To create your SQL VM, use the Azure RM module in powershell to run the below code. 

```powershell
// Get existing plain vm​
Get-AzureRmVm -ResourceGroupName SQLDocsRG -Name AHBTest
```


## Step 2 - Update the SQL VM to use the Azure Hybrid Benefit


 

