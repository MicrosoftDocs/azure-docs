---
title: Deploy an Azure VM from a user VHD | Azure Marketplace
description: Explains how to deploy a user VHD image to create an Azure VM instance.
services: Azure, Marketplace, Cloud Partner Portal, 
author: v-miclar
ms.service: marketplace
ms.topic: article
ms.date: 11/29/2018
ms.author: pabutler
---

# Deploy an Azure VM from a user VHD

This article explains how to deploy a generalized VHD image to create a new Azure VM resource, using the supplied Azure Resource Manager template and Azure PowerShell script.

[!INCLUDE [updated-for-az](../../../../includes/updated-for-az.md)]

## VHD deployment template

Copy the Azure Resource Manager template for [VHD deployment](cpp-deploy-json-template.md) to a local file named `VHDtoImage.json`.  Edit this file to provide values for the following parameters. 

|  **Parameter**             |   **Description**                                                              |
|  -------------             |   ---------------                                                              |
| ResourceGroupName          | Existing Azure resource group name.  Typically use the same RG associated with your key vault  |
| TemplateFile               | Full pathname to the file `VHDtoImage.json`                                    |
| userStorageAccountName     | Name of the storage account                                                    |
| sNameForPublicIP           | DNS name for the public IP. Must be lowercase                                  |
| subscriptionId             | Azure subscription identifier                                                  |
| Location                   | Standard Azure geographic location of the resource group                       |
| vmName                     | Name of the virtual machine                                                    |
| vaultName                  | Name of the key vault                                                          |
| vaultResourceGroup         | Resource group of the key vault
| certificateUrl             | Url of the certificate, including version stored in the key vault, for example:  `https://testault.vault.azure.net/secrets/testcert/b621es1db241e56a72d037479xab1r7` |
| vhdUrl                     | URL of the virtual hard disk                                                   |
| vmSize                     | Size of the virtual machine instance                                           |
| publicIPAddressName        | Name of the public IP address                                                  |
| virtualNetworkName         | Name of the virtual network                                                    |
| nicName                    | Name of the network interface card for the virtual network                     |
| adminUserName              | Username of the administrator account                                          |
| adminPassword              | Administrator password                                                          |
|  |  |


## Powershell script

Copy and edit the following script to supply values for the `$storageaccount` and `$vhdUrl` variables.  Execute it to create an Azure VM resource from your existing generalized VHD.

```powershell
# storage account of existing generalized VHD 
$storageaccount = "testwinrm11815"

# generalized VHD URL
$vhdUrl = "https://testwinrm11815.blob.core.windows.net/vhds/testvm1234562016651857.vhd"

echo "New-AzResourceGroupDeployment -Name "dplisvvm$postfix" -ResourceGroupName "$rgName" -TemplateFile "C:\certLocation\VHDtoImage.json" -userStorageAccountName "$storageaccount" -dnsNameForPublicIP "$vmName" -subscriptionId "$mysubid" -location "$location" -vmName "$vmName" -vaultName "$kvname" -vaultResourceGroup "$rgName" -certificateUrl $objAzureKeyVaultSecret.Id  -vhdUrl "$vhdUrl" -vmSize "Standard_A2" -publicIPAddressName "myPublicIP1" -virtualNetworkName "myVNET1" -nicName "myNIC1" -adminUserName "isv" -adminPassword $pwd"

#deploying VM with existing VHD
New-AzResourceGroupDeployment -Name "dplisvvm$postfix" -ResourceGroupName "$rgName" -TemplateFile "C:\certLocation\VHDtoImage.json" -userStorageAccountName "$storageaccount" -dnsNameForPublicIP "$vmName" -subscriptionId "$mysubid" -location "$location" -vmName "$vmName" -vaultName "$kvname" -vaultResourceGroup "$rgName" -certificateUrl $objAzureKeyVaultSecret.Id  -vhdUrl "$vhdUrl" -vmSize "Standard_A2" -publicIPAddressName "myPublicIP1" -virtualNetworkName "myVNET1" -nicName "myNIC1" -adminUserName "isv" -adminPassword $pwd 

```

## Next steps

After your VM is deployed, you are ready to [certify your VM image](./cpp-certify-vm.md).
