---
title: Quickstart – Azure Key Vault Python client library – manage keys
description: Learn how to create, retrieve, and delete keys from an Azure key vault using the Python client library
author: msmbaldwin
ms.author: mbaldwin
ms.date: 02/03/2023
ms.service: key-vault
ms.subservice: keys
ms.topic: quickstart
ms.devlang: python
ms.custom: devx-track-python, devx-track-azurecli, mode-api, passwordless-python
---

# Quickstart: Azure Key Vault keys client library for Python

Get started with the Azure Key Vault client library for Python. Follow these steps to install the package and try out example code for basic tasks. By using Key Vault to store cryptographic keys, you avoid storing such keys in your code, which increases the security of your app.

[API reference documentation](/python/api/overview/azure/keyvault-keys-readme) | [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/keyvault/azure-keyvault-keys) | [Package (Python Package Index)](https://pypi.org/project/azure-keyvault-keys/)

## Prerequisites

- An Azure subscription - [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Python 3.7+](/azure/developer/python/configure-local-development-environment)
- [Azure CLI](/cli/azure/install-azure-cli)

This quickstart assumes you're running [Azure CLI](/cli/azure/install-azure-cli) or [Azure PowerShell](/powershell/azure/install-azure-powershell) in a Linux terminal window.

## Set up your local environment

This quickstart is using the Azure Identity library with Azure CLI or Azure PowerShell to authenticate the user to Azure services. Developers can also use Visual Studio or Visual Studio Code to authenticate their calls. For more information, see [Authenticate the client with Azure Identity client library](/python/api/overview/azure/identity-readme).

### Sign in to Azure

### [Azure CLI](#tab/azure-cli)

1. Run the `login` command.

    ```azurecli-interactive
    az login
    ```

    If the CLI can open your default browser, it will do so and load an Azure sign-in page.

    Otherwise, open a browser page at [https://aka.ms/devicelogin](https://aka.ms/devicelogin) and enter the
    authorization code displayed in your terminal.

2. Sign in with your account credentials in the browser.

### [Azure PowerShell](#tab/azure-powershell)

1. Run the `Connect-AzAccount` command.

    ```azurepowershell
    Connect-AzAccount
    ```

    If PowerShell can open your default browser, it will do so and load an Azure sign-in page.

    Otherwise, open a browser page at [https://aka.ms/devicelogin](https://aka.ms/devicelogin) and enter the
    authorization code displayed in your terminal.

2. Sign in with your account credentials in the browser.

---

### Install the packages

1. In a terminal or command prompt, create a suitable project folder, and then create and activate a Python virtual environment as described on [Use Python virtual environments](/azure/developer/python/configure-local-development-environment?tabs=cmd#use-python-virtual-environments).

1. Install the Microsoft Entra identity library:

    ```terminal
    pip install azure-identity
    ```


1. Install the Key Vault key client library:

    ```terminal
    pip install azure-keyvault-keys
    ```

### Create a resource group and key vault

[!INCLUDE [Create a resource group and key vault](../../../includes/key-vault-python-qs-rg-kv-creation.md)]

### Set the KEY_VAULT_NAME environmental variable

[!INCLUDE [Set the KEY_VAULT_NAME environmental variable](../../../includes/key-vault-set-environmental-variables.md)]

### Grant access to your key vault

Create an access policy for your key vault that grants key permission to your user account.

### [Azure CLI](#tab/azure-cli)

```azurecli
az keyvault set-policy --name <your-unique-keyvault-name> --upn user@domain.com --key-permissions get list create delete
```

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Set-AzKeyVaultAccessPolicy -VaultName "<your-unique-keyvault-name>" -UserPrincipalName "user@domain.com" -PermissionsToKeys get,list,create,delete
```

---

## Create the sample code

The Azure Key Vault key client library for Python allows you to manage cryptographic keys. The following code sample demonstrates how to create a client, set a key, retrieve a key, and delete a key.

Create a file named *kv_keys.py* that contains this code.

```python
import os
from azure.keyvault.keys import KeyClient
from azure.identity import DefaultAzureCredential

keyVaultName = os.environ["KEY_VAULT_NAME"]
KVUri = "https://" + keyVaultName + ".vault.azure.net"

credential = DefaultAzureCredential()
client = KeyClient(vault_url=KVUri, credential=credential)

keyName = input("Input a name for your key > ")

print(f"Creating a key in {keyVaultName} called '{keyName}' ...")

rsa_key = client.create_rsa_key(keyName, size=2048)

print(" done.")

print(f"Retrieving your key from {keyVaultName}.")

retrieved_key = client.get_key(keyName)

print(f"Key with name '{retrieved_key.name}' was found.")
print(f"Deleting your key from {keyVaultName} ...")

poller = client.begin_delete_key(keyName)
deleted_key = poller.result()

print(" done.")
```

## Run the code

Make sure the code in the previous section is in a file named *kv_keys.py*. Then run the code with the following command:

```terminal
python kv_keys.py
```

- If you encounter permissions errors, make sure you ran the [`az keyvault set-policy` or `Set-AzKeyVaultAccessPolicy` command](#grant-access-to-your-key-vault).
- Rerunning the code with the same key name may produce the error, "(Conflict) Key \<name\> is currently in a deleted but recoverable state." Use a different key name.

## Code details

### Authenticate and create a client

Application requests to most Azure services must be authorized. Using the [DefaultAzureCredential](/python/api/azure-identity/azure.identity.defaultazurecredential) class provided by the [Azure Identity client library](/python/api/overview/azure/identity-readme) is the recommended approach for implementing passwordless connections to Azure services in your code. `DefaultAzureCredential` supports multiple authentication methods and determines which method should be used at runtime. This approach enables your app to use different authentication methods in different environments (local vs. production) without implementing environment-specific code. 

In this quickstart, `DefaultAzureCredential` authenticates to key vault using the credentials of the local development user logged into the Azure CLI. When the application is deployed to Azure, the same `DefaultAzureCredential` code can automatically discover and use a managed identity that is assigned to an App Service, Virtual Machine, or other services. For more information, see [Managed Identity Overview](../../active-directory/managed-identities-azure-resources/overview.md).

In the example code, the name of your key vault is expanded using the value of the `KVUri` variable, in the format: "https://\<your-key-vault-name>.vault.azure.net".

```python
credential = DefaultAzureCredential()
client = KeyClient(vault_url=KVUri, credential=credential)
```

## Save a key

Once you've obtained the client object for the key vault, you can store a key using the [create_rsa_key](/python/api/azure-keyvault-keys/azure.keyvault.keys.keyclient#azure-keyvault-keys-keyclient-create-rsa-key) method: 

```python
rsa_key = client.create_rsa_key(keyName, size=2048)
```

You can also use [create_key](/python/api/azure-keyvault-keys/azure.keyvault.keys.keyclient#azure-keyvault-keys-keyclient-create-key) or [create_ec_key](/python/api/azure-keyvault-keys/azure.keyvault.keys.keyclient#azure-keyvault-keys-keyclient-create-ec-key).

Calling a `create` method generates a call to the Azure REST API for the key vault.

When Azure handles the request, it authenticates the caller's identity (the service principal) using the credential object you provided to the client.

## Retrieve a key

To read a key from Key Vault, use the [get_key](/python/api/azure-keyvault-keys/azure.keyvault.keys.keyclient#azure-keyvault-keys-keyclient-get-key) method:

```python
retrieved_key = client.get_key(keyName)
 ```

You can also verify that the key has been set with the Azure CLI command [az keyvault key show](/cli/azure/keyvault/key?#az-keyvault-key-show) or the Azure PowerShell cmdlet [Get-AzKeyVaultKey](/powershell/module/az.keyvault/get-azkeyvaultkey).

### Delete a key

To delete a key, use the [begin_delete_key](/python/api/azure-keyvault-keys/azure.keyvault.keys.keyclient#azure-keyvault-keys-keyclient-begin-delete-key) method:

```python
poller = client.begin_delete_key(keyName)
deleted_key = poller.result()
```

The `begin_delete_key` method is asynchronous and returns a poller object. Calling the poller's `result` method waits for its completion.

You can verify that the key is deleted with the Azure CLI command [az keyvault key show](/cli/azure/keyvault/key?#az-keyvault-key-show) or the Azure PowerShell cmdlet [Get-AzKeyVaultKey](/powershell/module/az.keyvault/get-azkeyvaultkey).

Once deleted, a key remains in a deleted but recoverable state for a time. If you run the code again, use a different key name.

## Clean up resources

If you want to also experiment with [certificates](../certificates/quick-create-python.md) and [secrets](../secrets/quick-create-python.md), you can reuse the Key Vault created in this article.

Otherwise, when you're finished with the resources created in this article, use the following command to delete the resource group and all its contained resources:

### [Azure CLI](#tab/azure-cli)

```azurecli
az group delete --resource-group myResourceGroup
```

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Remove-AzResourceGroup -Name myResourceGroup
```

---

## Next steps

- [Overview of Azure Key Vault](../general/overview.md)
- [Secure access to a key vault](../general/security-features.md)
- [Azure Key Vault developer's guide](../general/developers-guide.md)
- [Key Vault security overview](../general/security-features.md)
- [Authenticate with Key Vault](../general/authentication.md)
