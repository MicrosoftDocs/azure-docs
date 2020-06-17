---
title: Quickstart -  Azure Key Vault client library for Python
description: Learn how to create, retrieve, and delete keys from an Azure key vault using the Python client library
author: msmbaldwin
ms.author: mbaldwin
ms.date: 3/30/2020
ms.service: key-vault
ms.subservice: keys
ms.topic: quickstart
ms.custom: tracking-python

---

# Quickstart: Azure Key Vault client library for Python

Get started with the Azure Key Vault client library for Python. Follow the steps below to install the package and try out example code for basic tasks.

Azure Key Vault helps safeguard cryptographic keys and secrets used by cloud applications and services. Use the Key Vault client library for Python to:

- Increase security and control over keys and passwords.
- Create and import encryption keys in minutes.
- Reduce latency with cloud scale and global redundancy.
- Simplify and automate tasks for TLS/SSL certificates.
- Use FIPS 140-2 Level 2 validated HSMs.

[API reference documentation](/python/api/overview/azure/key-vault?view=azure-python) | [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/keyvault) | [Package (Python Package Index)](https://pypi.org/project/azure-keyvault/)

## Prerequisites

- An Azure subscription - [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Python 2.7, 3.5.3, or later
- [Azure CLI](/cli/azure/install-azure-cli?view=azure-cli-latest) or [Azure PowerShell](/powershell/azure/overview)

This quickstart assumes you are running [Azure CLI](/cli/azure/install-azure-cli?view=azure-cli-latest) in a Linux terminal window.

## Setting up

### Install the package

From the console window, install the Azure Key Vault keys library for Python.

```console
pip install azure-keyvault-keys
```

For this quickstart, you will need to install the azure.identity package as well:

```console
pip install azure.identity
```

### Create a resource group and key vault

This quickstart uses a pre-created Azure key vault. You can create a key vault by following the steps in the [Azure CLI quickstart](quick-create-cli.md), [Azure PowerShell quickstart](quick-create-powershell.md), or [Azure portal quickstart](quick-create-portal.md). Alternatively, you can run the Azure CLI commands below.

> [!Important]
> Each key vault must have a unique name. Replace <your-unique-keyvault-name> with the name of your key vault in the following examples.

```azurecli
az group create --name "myResourceGroup" -l "EastUS"

az keyvault create --name <your-unique-keyvault-name> -g "myResourceGroup"
```

### Create a service principal

The simplest way to authenticate a cloud-based .NET application is with a managed identity; see [Use an App Service managed identity to access Azure Key Vault](../general/managed-identity.md) for details. 

For the sake of simplicity however, this quickstart creates a desktop application, which requires the use of a service principal and an access control policy. Your service principle requires a unique name in the format "http://&lt;my-unique-service-principle-name&gt;".

Create a service principle using the Azure CLI [az ad sp create-for-rbac](/cli/azure/ad/sp?view=azure-cli-latest#az-ad-sp-create-for-rbac) command:

```azurecli
az ad sp create-for-rbac -n "http://&lt;my-unique-service-principle-name&gt;" --sdk-auth
```

This operation will return a series of key / value pairs. 

```console
{
  "clientId": "7da18cae-779c-41fc-992e-0527854c6583",
  "clientSecret": "b421b443-1669-4cd7-b5b1-394d5c945002",
  "subscriptionId": "443e30da-feca-47c4-b68f-1636b75e16b3",
  "tenantId": "35ad10f1-7799-4766-9acf-f2d946161b77",
  "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
  "resourceManagerEndpointUrl": "https://management.azure.com/",
  "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
  "galleryEndpointUrl": "https://gallery.azure.com/",
  "managementEndpointUrl": "https://management.core.windows.net/"
}
```

Take note of the clientId and clientSecret, as we will use them in the [Set environmental variable](#set-environmental-variables) step below.

#### Give the service principal access to your key vault

Create an access policy for your key vault that grants permission to your service principal by passing the clientId to the [az keyvault set-policy](/cli/azure/keyvault?view=azure-cli-latest#az-keyvault-set-policy) command. Give the service principal get, list, and create permissions for keys.

```azurecli
az keyvault set-policy -n <your-unique-keyvault-name> --spn <clientId-of-your-service-principal> --key-permissions delete get list create 
```

#### Set environmental variables

The DefaultAzureCredential method in our application relies on three environmental variables: `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`, and `AZURE_TENANT_ID`. Set these variables to the clientId, clientSecret, and tenantId values you noted in the [Create a service principal](#create-a-service-principal) step using the `export VARNAME=VALUE` format. (This method only sets the variables for your current shell and processes created from the shell; to permanently add these variables to your environment, edit your `/etc/environment ` file.) 

You will also need to save your key vault name as an environment variable called `KEY_VAULT_NAME`.

```console
export AZURE_CLIENT_ID=<your-clientID>

export AZURE_CLIENT_SECRET=<your-clientSecret>

export AZURE_TENANT_ID=<your-tenantId>

export KEY_VAULT_NAME=<your-key-vault-name>
````

## Object model

The Azure Key Vault client library for Python allows you to manage keys and related assets such as certificates and secrets. The code samples below will show you how to create a client, create a key, retrieve a key, and delete a key.

## Code examples

### Add directives

Add the following directives to the top of your code:

```python
import os
from azure.keyvault.keys import KeyClient
from azure.identity import DefaultAzureCredential
```

### Authenticate and create a client

Authenticating to your key vault and creating a key vault client depends on the environmental variables in the [Set environmental variables](#set-environmental-variables) step above. The name of your key vault is expanded to the key vault URI, in the format "https://<your-key-vault-name>.vault.azure.net".

```python
credential = DefaultAzureCredential()

client = KeyClient(vault_url=KVUri, credential=credential)
```

### Save a key

Now that your application is authenticated, you can put a key into your keyvault 

```python
rsa_key = client.create_rsa_key(myKey,size=2048)
```

You can verify that the key has been set with the [az keyvault key show](/cli/azure/keyvault/key?view=azure-cli-latest#az-keyvault-key-show) command:

```azurecli
az keyvault key show --vault-name <your-unique-keyvault-name> --name myKey
```

### Retrieve a key

You can now retrieve the previously created key

```python
retrieved_key = client.get_key(keyName)
print(retrieve_key.name)

 ```

Your key is now saved as `retrieved_key`.

### Delete a key

Finally, let's delete the key from your key vault

```python
client.delete_key(keyName)
```

You can verify that the key is gone with the [az keyvault key show](/cli/azure/keyvault/key?view=azure-cli-latest#az-keyvault-key-show) command:

```azurecli
az keyvault key show --vault-name <your-unique-keyvault-name> --name myKey
```

## Clean up resources

When no longer needed, you can use the Azure CLI or Azure PowerShell to remove your key vault and the corresponding  resource group.

```azurecli
az group delete -g "myResourceGroup"
```

```azurepowershell
Remove-AzResourceGroup -Name "myResourceGroup"
```

## Sample code

```python
import os
from azure.keyvault.key import KeyClient
from azure.identity import DefaultAzureCredential

keyVaultName = os.environ["KEY_VAULT_NAME"]
KVUri = "https://" + keyVaultName + ".vault.azure.net"

credential = DefaultAzureCredential()
client = KeyClient(vault_url=KVUri, credential=credential)

keyName = "myKey"

print("Creating a key in " + keyVaultName + " called '" + keyName  + "` ...")

rsa_key = client.create_rsa_key(myKey,size=2048)

print(" done.")

print("Retrieving your key from " + keyVaultName + ".")

retrieved_key = client.get_key(keyName)

print("Key with name '{0}' was found'.".format(retrieved_key.name))
print("Deleting your key from " + keyVaultName + " ...")

client.begin_delete_key(keyName).result()

print(" done.")
```

## Next steps

In this quickstart you created a key vault, stored a key, and retrieved that key. To learn more about Key Vault and how to integrate it with your applications, continue on to the articles below.

- Read an [Overview of Azure Key Vault](../general/overview.md)
- See the [Azure Key Vault developer's guide](../general/developers-guide.md)
- Review [Azure Key Vault best practices](../general/best-practices.md)
