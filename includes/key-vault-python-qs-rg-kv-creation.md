---
author: msmbaldwin
ms.service: key-vault
ms.topic: include
ms.date: 09/03/2020
ms.author: msmbaldwin

# Used by Python quickstarts for secrets, keys, and certificates

---

1. Use the `az group create` command to create a resource group:

    ```azurecli
    az group create --name KeyVault-PythonQS-rg --location eastus
    ```

    You can change "eastus" to a location nearer to you, if you prefer.

1. Use `az keyvault create` to create the key vault:

    ```azurecli
    az keyvault create --name <your-unique-keyvault-name> --resource-group KeyVault-PythonQS-rg
    ```

    Replace `<your-unique-keyvault-name>` with a name that's unique across all of Azure. You typically use your personal or company name along with other numbers and identifiers. 

1. Create an environment variable that supplies the name of the Key Vault to the code:

    ```bash
    export KEY_VAULT_NAME=<your-unique-keyvault-name>
    ```