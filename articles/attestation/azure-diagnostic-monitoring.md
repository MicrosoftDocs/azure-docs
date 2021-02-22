---
title: Azure diagnostic monitoring - Azure Attestation
description: Azure diagnostic monitoring for Azure Attestation
services: attestation
author: msmbaldwin
ms.service: attestation
ms.topic: overview
ms.date: 08/31/2020
ms.author: mbaldwin
---

# Setting up diagnostics with Trusted Platform Module (TPM) endpoint of Azure Attestation

[Platform logs](../azure-monitor/essentials/platform-logs-overview.md) in Azure, including the Azure Activity log and resource logs, provide detailed diagnostic and auditing information for Azure resources and the Azure platform they depend on. [Platform metrics](../azure-monitor/essentials/data-platform-metrics.md) are collected by default and typically stored in the Azure Monitor metrics database. This article provides details on creating and configuring diagnostic settings to send platform metrics and platform logs to different destinations. 

TPM endpoint service is enabled with diagnostic setting and can be used to monitor activity. To setup [Azure Monitoring](../azure-monitor/overview.md) for the TPM service endpoint using PowerShell kindly follow the below steps. 

Setup Azure Attestation service. 

[Set up Azure Attestation with Azure PowerShell](./quickstart-powershell.md)

```powershell

 Connect-AzAccount 

 Set-AzContext -Subscription <Subscription id> 

 $attestationProviderName=<Name of the attestation provider> 

 $attestationResourceGroup=<Name of the resource Group> 

 $attestationProvider=Get-AzAttestation -Name $attestationProviderName -ResourceGroupName $attestationResourceGroup 

 $storageAccount=New-AzStorageAccount -ResourceGroupName $attestationProvider.ResourceGroupName -Name <Storage Account Name> -SkuName Standard_LRS -Location <Location> 

 Set-AzDiagnosticSetting -ResourceId $ attestationProvider.Id -StorageAccountId $ storageAccount.Id -Enabled $true 

```
The activity logs can be found in the Containers section of the storage account. Detailed info can be found at [Collect resource logs from an Azure Resource and analyze with Azure Monitor - Azure Monitor](../azure-monitor/essentials/tutorial-resource-logs.md)
