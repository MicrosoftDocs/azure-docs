---
title: Store a multiline secret in Azure Key Vault
description: Tutorial showing how to set multiline secrets from Azure Key Vault using Azure CLI and PowerShell
services: key-vault
author: msmbaldwin
tags: azure-resource-manager
ms.service: key-vault
ms.subservice: secrets
ms.topic: quickstart
ms.custom: mvc, seo-javascript-september2019, seo-javascript-october2019, devx-track-azurecli, devx-track-azurepowershell, mode-other
ms.date: 03/17/2021
ms.author: mbaldwin
#Customer intent: As a security admin who is new to Azure, I want to use Key Vault to securely store keys and passwords in Azure
---
# Store a multi-line secret in Azure Key Vault

The [Azure CLI quickstart](quick-create-cli.md) or [Azure PowerShell quickstart](quick-create-powershell.md) demonstrate how to store a single-line secret.   You can also use Key Vault to store a multi-line secret, such as a JSON file or RSA private key.

Multi-line secrets cannot be passed to the Azure CLI [az keyvault secret set](/cli/azure/keyvault/secret#az-keyvault-secret-set) command or the Azure PowerShell [Set-AzKeyVaultSecret](/powershell/module/az.keyvault/set-azkeyvaultsecret) cmdlet through the commandline. Instead, you must first store the multi-line secret as a text file. 

For example, you could create a text file called "secretfile.txt" containing the following lines:

```bash
This is my
multi-line
secret
```

## Set the secret using Azure CLI

You can then pass this file to the Azure CLI [az keyvault secret set](/cli/azure/keyvault/secret#az-keyvault-secret-set) command using the `--file` parameter.

```azurecli-interactive
az keyvault secret set --vault-name "<your-unique-keyvault-name>" --name "MultilineSecret" --file "secretfile.txt"
```
You can then view the stored secret using the Azure CLI [az keyvault secret show](/cli/azure/keyvault/secret#az-keyvault-secret-show) command.

```azurecli-interactive
az keyvault secret show --name "MultilineSecret" --vault-name "<your-unique-keyvault-name>" --query "value"
```

The secret will be returned with `\n` in place of newline:

```bash
"This is\nmy multi-line\nsecret"
```

The `\n` above is a `\` and `n` character, not the newline character. Quotes `"` are included in the string.

## Set the secret using Azure Powershell

With Azure PowerShell, you must first read in the file using the [Get-Content](/powershell/module/microsoft.powershell.management/get-content) cmdlet, then convert it to a secure string using [ConvertTo-SecureString](/powershell/module/microsoft.powershell.security/convertto-securestring). 

```azurepowershell-interactive
$RawSecret =  Get-Content "secretfile.txt" -Raw
$SecureSecret = ConvertTo-SecureString -String $RawSecret -AsPlainText -Force
```

Lastly, you store the secret using the [Set-AzKeyVaultSecret](/powershell/module/az.keyvault/set-azkeyvaultsecret) cmdlet.

```azurepowershell-interactive
$secret = Set-AzKeyVaultSecret -VaultName "<your-unique-keyvault-name>" -Name "MultilineSecret" -SecretValue $SecureSecret
```

You can then view the stored secret using the Azure CLI [az keyvault secret show](/cli/azure/keyvault/secret#az-keyvault-secret-show) command or the Azure PowerShell [Get-AzKeyVaultSecret](/powershell/module/az.keyvault/get-azkeyvaultsecret) cmdlet.

```azurecli-interactive
az keyvault secret show --name "MultilineSecret" --vault-name "<your-unique-keyvault-name>" --query "value"
```

The secret will be returned with `\n` in place of newline:

```bash
"This is\nmy multi-line\nsecret"
```

The `\n` above is a `\` and `n` character, not the newline character. Quotes `"` are included in the string.

## Next steps

- Read an [Overview of Azure Key Vault](../general/overview.md)
- See the [Azure CLI quickstart](quick-create-cli.md)
- See the [Azure CLI az keyvault commands](/cli/azure/keyvault)
- See the [Azure PowerShell quickstart](quick-create-powershell.md)
- See the [Azure PowerShell Az.KeyVault cmdlets](/powershell/module/az.keyvault#key-vault)
