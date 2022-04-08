---
title: Azure Quickstart - Create an Azure key vault and a secret using Bicep | Microsoft Docs
description: Quickstart showing how to create Azure key vaults, and add secrets to the vaults using Bicep.
services: key-vault
author: schaffererin
tags: azure-resource-manager
ms.service: key-vault
ms.subservice: secrets
ms.topic: quickstart
ms.custom: mvc, subject-armqs, devx-track-azurepowershell, mode-arm
ms.date: 04/08/2022
ms.author: v-eschaffer
#Customer intent: As a security admin who is new to Azure, I want to use Key Vault to securely store keys and passwords in Azure.
---

# Quickstart: Set and retrieve a secret from Azure Key Vault using Bicep

[Azure Key Vault](../general/overview.md) is a cloud service that provides a secure store for secrets, such as keys, passwords, certificates, and other secrets. This quickstart focuses on the process of deploying a Bicep file to create a key vault and a secret.

[!INCLUDE [About Bicep](../../../includes/resource-manager-quickstart-bicep-introduction.md)]

## Prerequisites

To complete this article:

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Review the Bicep file

The template used in this quickstart is from [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/key-vault-create/).

:::code language="bicep" source="~/quickstart-templates/quickstarts/microsoft.keyvault/key-vault-create/main.bicep":::

Two Azure resources are defined in the Bicep file:

* [**Microsoft.KeyVault/vaults**](/azure/templates/microsoft.keyvault/vaults): create an Azure key vault.
* [**Microsoft.KeyVault/vaults/secrets**](/azure/templates/microsoft.keyvault/vaults/secrets): create a key vault secret.

## Deploy the Bicep file

1. Save the Bicep file as **main.bicep** to your local computer.
1. Deploy the Bicep file using either Azure CLI or Azure PowerShell.

    # [CLI](#tab/CLI)

    ```azurecli
    az group create --name exampleRG --location eastus
    az deployment group create --resource-group exampleRG --template-file main.bicep --parameters keyVaultName=<vault-name> objectID=<object-id>
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    New-AzResourceGroup -Name exampleRG -Location eastus
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./main.bicep -keyVaultName "<vault-name>" -objectID "<object-id>"
    ```

    ---

    > [!NOTE]
    > Replace **\<vault-name\>** with the name of the key vault. Replace **\<object-id\>** with the object ID of a user, service principal, or security group in the Azure Active Directory tenant for the vault. The object ID must be unique for the list of access policies. Get it by using Get-AzADUser or Get-AzADServicePrincipal cmdlets.

    When the deployment finishes, you should see a message indicating the deployment succeeded.

## Review deployed resources

Use the Azure portal, Azure CLI, or Azure PowerShell to list the deployed resources in the resource group.

# [CLI](#tab/CLI)

```azurecli-interactive
az resource list --resource-group exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Get-AzResource -ResourceGroupName exampleRG
```

---

## Clean up resources

When no longer needed, use the Azure portal, Azure CLI, or Azure PowerShell to delete the resource group and its resources.

# [CLI](#tab/CLI)

```azurecli-interactive
az group delete --name exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell-interactive
Remove-AzResourceGroup -Name exampleRG
```

---

## Next steps

In this quickstart, you created a key vault and a secret using Bicep and then validated the deployment. To learn more about Key Vault and Bicep, continue on to the articles below.

- Read an [Overview of Azure Key Vault](../general/overview.md)
- Learn more about [Bicep](../../azure-resource-manager/bicep/overview.md)
- Review the [Key Vault security overview](../general/security-features.md)
