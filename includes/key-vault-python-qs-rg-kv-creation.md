---
author: msmbaldwin
ms.service: key-vault
ms.topic: include
ms.date: 09/03/2020
ms.author: msmbaldwin

# Used by Python quickstarts for secrets, keys, and certificates

---

# [Azure CLI](#tab/azure-cli)

1. Use the `az group create` command to create a resource group:

    ```azurecli
    az group create --name myResourceGroup --location eastus
    ```

    You can change "eastus" to a location nearer to you, if you prefer.

1. Use `az keyvault create` to create the key vault:

    ```azurecli
    az keyvault create --name <your-unique-keyvault-name> --resource-group myResourceGroup
    ```

    Replace `<your-unique-keyvault-name>` with a name that's unique across all of Azure. You typically use your personal or company name along with other numbers and identifiers.

# [Azure PowerShell](#tab/azure-powershell)

1. Use the `New-AzResourceGroup` command to create a resource group:

    ```azurepowershell
    New-AzResourceGroup -Name myResourceGroup -Location eastus
    ```

    You can change "eastus" to a location nearer to you, if you prefer.

1. Use `New-AzKeyVault` to create the key vault:

    ```azurepowershell
    New-AzKeyVault -Name <your-unique-keyvault-name> -ResourceGroupName myResourceGroup -Location eastus
    ```

    Replace `<your-unique-keyvault-name>` with a name that's unique across all of Azure. You typically use your personal or company name along with other numbers and identifiers.

---