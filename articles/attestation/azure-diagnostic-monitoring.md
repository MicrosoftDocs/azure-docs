---
title: Azure diagnostic monitoring for Azure Attestation
description: Azure diagnostic monitoring for Azure Attestation
services: attestation
author: msmbaldwin
ms.service: attestation
ms.topic: overview
ms.date: 08/31/2020
ms.author: mbaldwin 
ms.custom: devx-track-azurepowershell
---

# Set up diagnostics with a Trusted Platform Module (TPM) endpoint of Azure Attestation

This article helps you create and configure diagnostic settings to send platform metrics and platform logs to different destinations. [Platform logs](/azure/azure-monitor/platform/platform-logs-overview) in Azure, including the Azure Activity log and resource logs, provide detailed diagnostic and auditing information for Azure resources and the Azure platform that they depend on. [Platform metrics](/azure/azure-monitor/platform/data-platform-metrics) are collected by default and are stored in the Azure Monitor Metrics database.

Before you begin, make sure you've [set up Azure Attestation with Azure PowerShell](quickstart-powershell.md).

The Trusted Platform Module (TPM) endpoint service is enabled in the diagnostic settings and can be used to monitor activity. Set up [Azure Monitoring](/azure/azure-monitor/overview) for the TPM service endpoint by using the following code.

```powershell

 Connect-AzAccount 

 Set-AzContext -Subscription <Subscription id> 

 $attestationProviderName=<Name of the attestation provider> 

 $attestationResourceGroup=<Name of the resource Group> 

 $attestationProvider=Get-AzAttestation -Name $attestationProviderName -ResourceGroupName $attestationResourceGroup 

 $storageAccount=New-AzStorageAccount -ResourceGroupName $attestationProvider.ResourceGroupName -Name <Storage Account Name> -SkuName Standard_LRS -Location <Location> 

 Set-AzDiagnosticSetting -ResourceId $ attestationProvider.Id -StorageAccountId $ storageAccount.Id -Enabled $true 

```

Activity logs are in the **Containers** section of the storage account. For more information, see [Collect and analyze resource logs from an Azure resource](/azure/azure-monitor/learn/tutorial-resource-logs).
