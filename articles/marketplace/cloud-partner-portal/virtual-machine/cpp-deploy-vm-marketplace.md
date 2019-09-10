---
title: Deploy a VM from the Azure Marketplace 
description: Explains how to deploy a virtual machine from an Azure Marketplace pre-configured virtual machine.
services: Azure, Marketplace, Cloud Partner Portal, 
author: v-miclar
ms.service: marketplace
ms.topic: article
ms.date: 11/29/2018
ms.author: pabutler
---

# Deploy a virtual machine from the Azure Marketplace

This article explains how to deploy a pre-configured virtual machine (VM) from an Azure Marketplace, using the provided Azure PowerShell script.  This script also exposes the WinRM HTTP and HTTPS endpoints on the VM.  The script requires that you already have a certificate uploaded to Azure Key Vault, as described in [Create certificates for Azure Key Vault](./cpp-create-key-vault-cert.md). 

[!INCLUDE [updated-for-az](../../../../includes/updated-for-az.md)]

## VM deployment template

The quickstart Azure VM deployment template, is available as the online file [azuredeploy.json](https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/201-vm-winrm-keyvault-windows/azuredeploy.json).  It contains the following parameters:

|  **Parameter**        |   **Description**                                 |
|  -------------        |   ---------------                                 |
| newStorageAccountName	| Name of the storage account                       |
| dnsNameForPublicIP	| DNS Name for the public IP. Must be lowercase.    |
| adminUserName	        | Administrator's username                          |
| adminPassword	        | Administrator's password                          |
| imagePublisher	    | Image publisher                                   |
| imageOffer	        | Image offer                                       |
| imageSKU	            | Image SKU                                         |
| vmSize	            | Size of the VM                                    |
| vmName	            | Name of the VM                                    |
| vaultName	            | Name of the key vault                             |
| vaultResourceGroup	| Resource group of the key vault                   |
| certificateUrl	    | URL for the certificate, including version in KeyVault, for example  `https://testault.vault.azure.net/secrets/testcert/b621es1db241e56a72d037479xab1r7` |
|  |  |


## Deployment script

Edit the following Azure PowerShell script and execute it to deploy the specified Azure Marketplace VM.

```powershell

New-AzResourceGroupDeployment -Name "dplvm$postfix" -ResourceGroupName "$rgName" -TemplateUri "https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/201-vm-winrm-keyvault-windows/azuredeploy.json" -newStorageAccountName "test$postfix" -dnsNameForPublicIP $vmName -adminUserName "isv" -adminPassword $pwd -vmSize "Standard_A2" -vmName $vmName -vaultName "$kvname" -vaultResourceGroup "$rgName" -certificateUrl $objAzureKeyVaultSecret.Id 

```


## Next steps

Once you have deployed a pre-configured VM, you can configure and access the solutions and services it contains, or use it for further development. 
