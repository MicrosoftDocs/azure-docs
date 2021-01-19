
---
title: Azure Diagnostic Monitoring
description: Azure Diagnostic Monitoring fir Azure Attestation
services: attestation
author: msmbaldwin
ms.service: attestation
ms.topic: overview
ms.date: 08/31/2020
ms.author: mbaldwin


---

# Setting up diagnostics with Trusted Platform Module (TPM) endpoint

Platform logs in Azure, including the Azure Activity log and resource logs, provide detailed diagnostic and auditing information for Azure resources and the Azure platform they depend on. Platform metrics are collected by default and typically stored in the Azure Monitor metrics database. This article provides details on creating and configuring diagnostic settings to send platform metrics and platform logs to different destinations. 

TPM endpoint service is enabled with diagnostic setting and can be used to monitor activity. To setup Azure Monitoring for the TPM service endpoint using PowerShell kindly follow the below steps. 

1. Setup Azure Attestation service. 

2. Set up Azure Attestation with Azure PowerShell | Microsoft Docs 

3. Connect-AzAccount 

4. Set-AzContext -Subscription <Subscription id> 

5. $attestationProviderName=<Name of the attestation provider> 

6. $attestationResourceGroup=<Name of the resource Group> 

7. $attestationProvider=Get-AzAttestation -Name $attestationProviderName -ResourceGroupName $attestationResourceGroup 

8. $storageAccount=New-AzStorageAccount -ResourceGroupName $attestationProvider.ResourceGroupName -Name <Name for Storage Account> -SkuName Standard_LRS -Location <Location> 

9. Set-AzDiagnosticSetting -ResourceId $ attestationProvider.Id -StorageAccountId $ storageAccount.Id -Enabled $true 


The activity logs can be found in the Containers section of the storage account. Detailed info can be found at Collect resource logs from an Azure Resource and analyze with Azure Monitor - Azure Monitor | Microsoft Docs 
