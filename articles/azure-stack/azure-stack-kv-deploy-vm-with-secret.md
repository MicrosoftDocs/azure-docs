---
title: Deploy a VM with securely stored password on Azure Stack | Microsoft Docs
description: Learn how to deploy a VM using a password stored in Azure Stack Key Vault
services: azure-stack
documentationcenter: ''
author: SnehaGunda
manager: byronr
editor: ''

ms.assetid: 23322a49-fb7e-4dc2-8d0e-43de8cd41f80
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 08/08/2017
ms.author: sngun

---
# Create a virtual machine by retrieving the password stored in a Key Vault

When you need to pass a secure value (like a password) as a parameter during deployment, you can store that value as a secret in an Azure Stack key vault and reference the value in other Azure Resource Manager templates. You include only a reference to the secret in your template so the secret is never exposed. You do not need to manually enter
the value for the secret each time you deploy the resources. You specify which users or service principals can access the secret.

## Reference a secret with static ID
You reference the secret from within a parameters file, which passes values to your template. You reference the secret by passing the resource identifier of the key vault and the name of the secret. In this example, the key vault secret must already exist. You use a static value for its resource ID.

```powershell

$vaultName = "contosovault"
$resourceGroup = "contosovaultrg"
$location = "local"
$secretName = "MySecret"

New-AzureRmResourceGroup `
  -Name $resourceGroup `
  -Location $location

New-AzureRmKeyVault `
  -VaultName $vaultName `
  -ResourceGroupName $resourceGroup `
  -Location $location

$secretValue = ConvertTo-SecureString -String 'Demouser@123' -AsPlainText -Force

Set-AzureKeyVaultSecret `
  -VaultName $vaultName `
  -Name $secretName `
  -SecretValue $secretValue

Set-AzureRmKeyVaultAccessPolicy `
  -VaultName $vaultName `
  -EnabledForTemplateDeployment
```

**azuredeploy.parameters.json:**

```json
{
    "$schema":  "http://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
    "contentVersion":  "1.0.0.0",
    "parameters":  {
       "adminUsername":  {
         "value":  "demouser"
          },
         "adminPassword":  {
           "reference":  {
              "keyVault":  {
                "id":  "/subscriptions/c176b255-50f2-4224-9468-ec4a6ea95988/resourceGroups/RgKvPwd/providers/Microsoft.KeyVault/vaults/KvPwd"
                },
              "secretName":  "MySecret"
           }
         },
       "dnsLabelPrefix":  {
          "value":  "mydns123456"
        },
        "windowsOSVersion":  {
          "value":  "2016-Datacenter"
        }
    }
}

```

**Template deployment:**

Now deploy the template by using the following PowerShell script:

```powershell
New-AzureRmResourceGroupDeployment `
  -Name KVPwdDeployment `
  -ResourceGroupName $resourceGroup `
  -TemplateFile "<Fully qualified path to the azuredeploy.json file>" `
  -TemplateParameterFile "<Fully qualified path to the azuredeploy.parameters.json file>"
```

> [!NOTE]
> The parameter that accepts the secret should be a *securestring*.


## Next Steps
[Deploy a sample app with Key Vault](azure-stack-kv-sample-app.md)

[Deploy a VM with a Key Vault certificate](azure-stack-kv-push-secret-into-vm.md)

