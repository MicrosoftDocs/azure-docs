---
title: Quickstart – Azure Key Vault Python client library – manage secrets
description: Learn how to create, retrieve, and delete secrets from an Azure key vault using the Python client library
author: msmbaldwin
ms.author: mbaldwin
ms.date: 09/03/2020
ms.service: key-vault
ms.subservice: secrets
ms.topic: quickstart
ms.custom: devx-track-python

---

# Quickstart: Azure Key Vault secrets client library for Python

Get started with the Azure Key Vault client library for Python. Follow the steps below to install the package and try out example code for basic tasks. By using Key Vault to store secrets, you avoid storing secrets in your code, which increases the security of your app.

[API reference documentation](/python/api/overview/azure/keyvault-secrets-readme?view=azure-python) | [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/keyvault/azure-keyvault-secrets) | [Package (Python Package Index)](https://pypi.org/project/azure-keyvault-secrets/)

## Set up your local environment

[!INCLUDE [Set up your local environment](../../../includes/key-vault-python-qs-setup.md)]

7. Install the Key Vault secrets library:

    ```terminal
    pip install azure-keyvault-secrets
    ```

## Create a resource group and key vault

[!INCLUDE [Create a resource group and key vault](../../../includes/key-vault-python-qs-rg-kv-creation.md)]

## Give the service principal access to your key vault

Run the following [az keyvault set-policy](/cli/azure/keyvault?view=azure-cli-latest#az-keyvault-set-policy) command to authorize your service principal for get, list, and set operations on secrets. This command relies on the `KEY_VAULT_NAME` and `AZURE_CLIENT_ID` environment variables created in previous steps.

# [cmd](#tab/cmd)

```azurecli
az keyvault set-policy --name %KEY_VAULT_NAME% --spn %AZURE_CLIENT_ID% --resource-group KeyVault-PythonQS-rg --secret-permissions delete get list set 
```

# [bash](#tab/bash)

```azurecli
az keyvault set-policy --name $KEY_VAULT_NAME --spn $AZURE_CLIENT_ID --resource-group KeyVault-PythonQS-rg --secret-permissions delete get list set 
```

---

This command relies on the `KEY_VAULT_NAME` and `AZURE_CLIENT_ID` environment variables created in previous steps.

For more information, see [Assign an access policy - CLI](../general/assign-access-policy-cli.md)

## Create the sample code

The Azure Key Vault client library for Python allows you to manage secrets and related assets such as certificates and cryptographic keys. The following code sample demonstrates how to create a client, set a secret, retrieve a secret, and delete a secret.

Create a file named *kv_secrets.py* that contains this code.

```python
import os
import cmd
from azure.keyvault.secrets import SecretClient
from azure.identity import DefaultAzureCredential

keyVaultName = os.environ["KEY_VAULT_NAME"]
KVUri = f"https://{keyVaultName}.vault.azure.net"

credential = DefaultAzureCredential()
client = SecretClient(vault_url=KVUri, credential=credential)

secretName = input("Input a name for your secret > ")
secretValue = input("Input a value for your secret > ")

print(f"Creating a secret in {keyVaultName} called '{secretName}' with the value '{secretValue}' ...")

client.set_secret(secretName, secretValue)

print(" done.")

print(f"Retrieving your secret from {keyVaultName}.")

retrieved_secret = client.get_secret(secretName)

print(f"Your secret is '{retrieved_secret.value}'.")
print(f"Deleting your secret from {keyVaultName} ...")

poller = client.begin_delete_secret(secretName)
deleted_secret = poller.result()

print(" done.")
```

## Run the code

Make sure the code in the previous section is in a file named *kv_secrets.py*. Then run the code with the following command:

```terminal
python kv_secrets.py
```

- If you encounter permissions errors, make sure you ran the [`az keyvault set-policy` command](#give-the-service-principal-access-to-your-key-vault).
- Re-running the code with the same secrete name may produce the error, "(Conflict) Secret <name> is currently in a deleted but recoverable state." Use a different secret name.

## Code details

### Authenticate and create a client

In the preceding code, the [`DefaultAzureCredential`](/python/api/azure-identity/azure.identity.defaultazurecredential?view=azure-python) object uses the environment variables you created for your service principal. You provide this credential whenever you create a client object from an Azure library, such as [`SecretClient`](/python/api/azure-keyvault-secrets/azure.keyvault.secrets.secretclient?view=azure-python), along with the URI of the resource you want to work with through that client:

```python
credential = DefaultAzureCredential()
client = SecretClient(vault_url=KVUri, credential=credential)
```

### Save a secret

Once you've obtained the client object for the key vault, you can store a secret using the [set_secret](/python/api/azure-keyvault-secrets/azure.keyvault.secrets.secretclient?view=azure-python#set-secret-name--value----kwargs-) method: 

```python
client.set_secret(secretName, secretValue)
```

Calling `set_secret` generates a call to the Azure REST API for the key vault.

When handling the request, Azure authenticates the caller's identity (the service principal) using the credential object you provided to the client.

It also checks that the caller is authorized to perform the requested action. You granted this authorization to the service principal earlier using the [`az keyvault set-policy` command](#give-the-service-principal-access-to-your-key-vault).

### Retrieve a secret

To read a secret from Key Vault, use the [get_secret](/python/api/azure-keyvault-secrets/azure.keyvault.secrets.secretclient?view=azure-python#get-secret-name--version-none----kwargs-) method:

```python
retrieved_secret = client.get_secret(secretName)
 ```

The secret value is contained in `retrieved_secret.value`.

You can also retrieve a secret with the the Azure CLI command [az keyvault secret show](/cli/azure/keyvault/secret?view=azure-cli-latest#az-keyvault-secret-show).

### Delete a secret

To delete a secret, use the [begin_delete_secret](/python/api/azure-keyvault-secrets/azure.keyvault.secrets.secretclient?view=azure-python#begin-delete-secret-name----kwargs-) method:

```python
poller = client.begin_delete_secret(secretName)
deleted_secret = poller.result()
```

The `begin_delete_secret` method is asynchronous and returns a poller object. Calling the poller's `result` method waits for its completion.

You can verify that the secret had been removed with the Azure CLI command [az keyvault secret show](/cli/azure/keyvault/secret?view=azure-cli-latest#az-keyvault-secret-show).

Once deleted, a secret remains in a deleted but recoverable state for a time. If you run the code again, use a different secret name.

## Clean up resources

If you want to also experiment with [certificates](../certificates/quick-create-python.md) and [keys](../keys/quick-create-python.md), you can reuse the Key Vault created in this article.

Otherwise, when you're finished with the resources created in this article, use the following command to delete the resource group and all its contained resources:

```azurecli
az group delete --resource-group KeyVault-PythonQS-rg
```

## Next steps

- [Overview of Azure Key Vault](../general/overview.md)
- [Azure Key Vault developer's guide](../general/developers-guide.md)
- [Azure Key Vault best practices](../general/best-practices.md)
- [Authenticate with Key Vault](../general/authentication.md)
