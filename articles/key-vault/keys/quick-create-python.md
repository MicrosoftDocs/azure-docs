---
title: Quickstart – Azure Key Vault Python client library – manage keys
description: Learn how to create, retrieve, and delete keys from an Azure key vault using the Python client library
author: msmbaldwin
ms.author: mbaldwin
ms.date: 09/03/2020
ms.service: key-vault
ms.subservice: keys
ms.topic: quickstart
ms.custom: devx-track-python

---

# Quickstart: Azure Key Vault keys client library for Python

Get started with the Azure Key Vault client library for Python. Follow the steps below to install the package and try out example code for basic tasks. By using Key Vault to store cryptographic keys, you avoid storing such keys in your code, which increases the security of your app.

[API reference documentation](/python/api/overview/azure/keyvault-keys-readme?view=azure-python) | [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/keyvault/azure-keyvault-keys) | [Package (Python Package Index)](https://pypi.org/project/azure-keyvault-keys/)

## Set up your local environment

[!INCLUDE [Set up your local environment](../../../includes/key-vault-python-qs-setup.md)]

7. Install the Key Vault keys library:

    ```terminal
    pip install azure-keyvault-keys
    ```

## Create a resource group and key vault

[!INCLUDE [Create a resource group and key vault](../../../includes/key-vault-python-qs-rg-kv-creation.md)]

## Give the service principal access to your key vault

Run the following [az keyvault set-policy](/cli/azure/keyvault?view=azure-cli-latest#az-keyvault-set-policy) command to authorize your service principal for delete, get, list, and create operations on keys. 

# [cmd](#tab/cmd)

```azurecli
az keyvault set-policy --name %KEY_VAULT_NAME% --spn %AZURE_CLIENT_ID% --resource-group KeyVault-PythonQS-rg --key-permissions delete get list create
```

# [bash](#tab/bash)

```azurecli
az keyvault set-policy --name $KEY_VAULT_NAME --spn $AZURE_CLIENT_ID --resource-group KeyVault-PythonQS-rg --key-permissions delete get list create
```

---

This command relies on the `KEY_VAULT_NAME` and `AZURE_CLIENT_ID` environment variables created in previous steps.

For more information, see [Assign an access policy - CLI](../general/assign-access-policy-cli.md)

## Create the sample code

The Azure Key Vault client library for Python allows you to manage cryptographic keys and related assets such as certificates and secrets. The following code sample demonstrates how to create a client, set a secret, retrieve a secret, and delete a secret.

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

- If you encounter permissions errors, make sure you ran the [`az keyvault set-policy` command](#give-the-service-principal-access-to-your-key-vault).
- Re-running the code with the same key name may produce the error, "(Conflict) Key <name> is currently in a deleted but recoverable state." Use a different key name.

## Code details

### Authenticate and create a client

In the preceding code, the [`DefaultAzureCredential`](/python/api/azure-identity/azure.identity.defaultazurecredential?view=azure-python) object uses the environment variables you created for your service principal. You provide this credential whenever you create a client object from an Azure library, such as [`KeyClient`](/python/api/azure-keyvault-keys/azure.keyvault.keys.keyclient?view=azure-python), along with the URI of the resource you want to work with through that client:

```python
credential = DefaultAzureCredential()
client = KeyClient(vault_url=KVUri, credential=credential)
```

## Save a key

Once you've obtained the client object for the key vault, you can store a key using the [create_rsa_key](/python/api/azure-keyvault-keys/azure.keyvault.keys.keyclient?view=azure-python#create-rsa-key-name----kwargs-) method: 

```python
rsa_key = client.create_rsa_key(keyName, size=2048)
```

You can also use [create_key](/python/api/azure-keyvault-keys/azure.keyvault.keys.keyclient?view=azure-python#create-key-name--key-type----kwargs-) or [create_ec_key](/python/api/azure-keyvault-keys/azure.keyvault.keys.keyclient?view=azure-python#create-ec-key-name----kwargs-).

Calling a `create` method generates a call to the Azure REST API for the key vault.

When handling the request, Azure authenticates the caller's identity (the service principal) using the credential object you provided to the client.

It also checks that the caller is authorized to perform the requested action. You granted this authorization to the service principal earlier using the [`az keyvault set-policy` command](#give-the-service-principal-access-to-your-key-vault).

## Retrieve a key

To read a key from Key Vault, use the [get_key](/python/api/azure-keyvault-keys/azure.keyvault.keys.keyclient?view=azure-python#get-key-name--version-none----kwargs-) method:

```python
retrieved_key = client.get_key(keyName)
 ```

You can also verify that the key has been set with the Azure CLI command [az keyvault key show](/cli/azure/keyvault/key?view=azure-cli-latest#az-keyvault-key-show).

### Delete a key

To delete a key, use the [begin_delete_key](/python/api/azure-keyvault-keys/azure.keyvault.keys.keyclient?view=azure-python#begin-delete-key-name----kwargs-) method:

```python
poller = client.begin_delete_key(keyName)
deleted_key = poller.result()
```

The `begin_delete_key` method is asynchronous and returns a poller object. Calling the poller's `result` method waits for its completion.

You can verify that the key is deleted with the Azure CLI command [az keyvault key show](/cli/azure/keyvault/key?view=azure-cli-latest#az-keyvault-key-show).

Once deleted, a key remains in a deleted but recoverable state for a time. If you run the code again, use a different key name.

## Clean up resources

If you want to also experiment with [certificates](../certificates/quick-create-python.md) and [secrets](../secrets/quick-create-python.md), you can reuse the Key Vault created in this article.

Otherwise, when you're finished with the resources created in this article, use the following command to delete the resource group and all its contained resources:

```azurecli
az group delete --resource-group KeyVault-PythonQS-rg
```

## Next steps

- [Overview of Azure Key Vault](../general/overview.md)
- [Azure Key Vault developer's guide](../general/developers-guide.md)
- [Azure Key Vault best practices](../general/best-practices.md)
- [Authenticate with Key Vault](../general/authentication.md)
