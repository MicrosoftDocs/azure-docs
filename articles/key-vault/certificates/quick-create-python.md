---
title: Quickstart – Azure Key Vault Python client library – manage certificates
description: Learn how to create, retrieve, and delete certificates from an Azure key vault using the Python client library
author: msmbaldwin
ms.author: mbaldwin
ms.date: 09/03/2020
ms.service: key-vault
ms.subservice: certificates
ms.topic: quickstart
ms.custom: devx-track-python

---

# Quickstart: Azure Key Vault certificates client library for Python

Get started with the Azure Key Vault client library for Python. Follow the steps below to install the package and try out example code for basic tasks. By using Key Vault to store certificates, you avoid storing certificates in your code, which increases the security of your app.

[API reference documentation](/python/api/overview/azure/keyvault-certificates-readme?view=azure-python) | [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/keyvault/azure-keyvault-certificates) | [Package (Python Package Index)](https://pypi.org/project/azure-keyvault-certificates)

## Set up your local environment

[!INCLUDE [Set up your local environment](../../../includes/key-vault-python-qs-setup.md)]

7. Install the Key Vault certificates library:

    ```terminal
    pip install azure-keyvault-certificates
    ```

## Create a resource group and key vault

[!INCLUDE [Create a resource group and key vault](../../../includes/key-vault-python-qs-rg-kv-creation.md)]

## Give the service principal access to your key vault

Run the following [az keyvault set-policy](/cli/azure/keyvault?view=azure-cli-latest#az-keyvault-set-policy) command to authorize your service principal for get, list, and create operations on certificates.

# [cmd](#tab/cmd)

```azurecli
az keyvault set-policy --name %KEY_VAULT_NAME% --spn %AZURE_CLIENT_ID% --resource-group KeyVault-PythonQS-rg --certificate-permissions delete get list create
```

# [bash](#tab/bash)

```azurecli
az keyvault set-policy --name $KEY_VAULT_NAME --spn $AZURE_CLIENT_ID --resource-group KeyVault-PythonQS-rg --certificate-permissions delete get list create 
```

---

This command relies on the `KEY_VAULT_NAME` and `AZURE_CLIENT_ID` environment variables created in previous steps.

For more information, see [Assign an access policy - CLI](../general/assign-access-policy-cli.md)

## Create the sample code

The Azure Key Vault client library for Python allows you to manage certificates and related assets such as secrets and cryptographic keys. The following code sample demonstrates how to create a client, set a secret, retrieve a secret, and delete a secret.

Create a file named *kv_certificates.py* that contains this code.

```python
import os
from azure.keyvault.certificates import CertificateClient, CertificatePolicy,CertificateContentType, WellKnownIssuerNames 
from azure.identity import DefaultAzureCredential

keyVaultName = os.environ["KEY_VAULT_NAME"]
KVUri = "https://" + keyVaultName + ".vault.azure.net"

credential = DefaultAzureCredential()
client = CertificateClient(vault_url=KVUri, credential=credential)

certificateName = input("Input a name for your certificate > ")

print(f"Creating a certificate in {keyVaultName} called '{certificateName}' ...")

policy = CertificatePolicy.get_default()
poller = client.begin_create_certificate(certificate_name=certificateName, policy=policy)
certificate = poller.result()

print(" done.")

print(f"Retrieving your certificate from {keyVaultName}.")

retrieved_certificate = client.get_certificate(certificateName)

print(f"Certificate with name '{retrieved_certificate.name}' was found'.")
print(f"Deleting your certificate from {keyVaultName} ...")

poller = client.begin_delete_certificate(certificateName)
deleted_certificate = poller.result()

print(" done.")
```

## Run the code

Make sure the code in the previous section is in a file named *kv_certificates.py*. Then run the code with the following command:

```terminal
python kv_certificates.py
```

- If you encounter permissions errors, make sure you ran the [`az keyvault set-policy` command](#give-the-service-principal-access-to-your-key-vault).
- Re-running the code with the same key name may produce the error, "(Conflict) Certificate <name> is currently in a deleted but recoverable state." Use a different key name.

## Code details

### Authenticate and create a client

In the preceding code, the [`DefaultAzureCredential`](/python/api/azure-identity/azure.identity.defaultazurecredential?view=azure-python) object uses the environment variables you created for your service principal. You provide this credential whenever you create a client object from an Azure library, such as [`CertificateClient`](/python/api/azure-keyvault-certificates/azure.keyvault.certificates.certificateclient?view=azure-python), along with the URI of the resource you want to work with through that client:

```python
credential = DefaultAzureCredential()
client = CertificateClient(vault_url=KVUri, credential=credential)
```

### Save a certificate

Once you've obtained the client object for the key vault, you can create a certificate using the [begin_create_certificate](/python/api/azure-keyvault-certificates/azure.keyvault.certificates.certificateclient?view=azure-python#begin-create-certificate-certificate-name--policy----kwargs-) method: 

```python
policy = CertificatePolicy.get_default()
poller = client.begin_create_certificate(certificate_name=certificateName, policy=policy)
certificate = poller.result()
```

Here, the certificate requires a policy obtained with the [CertificatePolicy.get_default](/python/api/azure-keyvault-certificates/azure.keyvault.certificates.certificatepolicy?view=azure-python#get-default--) method.

Calling a `begin_create_certificate` method generates an asynchronous call to the Azure REST API for the key vault. The asynchronous call returns a poller object. To wait for the result of the operation, call the poller's `result` method.

When handling the request, Azure authenticates the caller's identity (the service principal) using the credential object you provided to the client.

It also checks that the caller is authorized to perform the requested action. You granted this authorization to the service principal earlier using the [`az keyvault set-policy` command](#give-the-service-principal-access-to-your-key-vault).

### Retrieve a certificate

To read a certificate from Key Vault, use the [get_certificate](/python/api/azure-keyvault-certificates/azure.keyvault.certificates.certificateclient?view=azure-python#get-certificate-certificate-name----kwargs-) method:

```python
retrieved_certificate = client.get_certificate(certificateName)
 ```

You can also verify that the certificate has been set with the Azure CLI command [az keyvault certificate show](/cli/azure/keyvault/certificate?view=azure-cli-latest#az-keyvault-certificate-show).

### Delete a certificate

To delete a certificate, use the [begin_delete_certificate](/python/api/azure-keyvault-certificates/azure.keyvault.certificates.certificateclient?view=azure-python#begin-delete-certificate-certificate-name----kwargs-) method:

```python
poller = client.begin_delete_certificate(certificateName)
deleted_certificate = poller.result()
```

The `begin_delete_certificate` method is asynchronous and returns a poller object. Calling the poller's `result` method waits for its completion.

You can verify that the certificate is deleted with the Azure CLI command [az keyvault certificate show](/cli/azure/keyvault/certificate?view=azure-cli-latest#az-keyvault-certificate-show).

Once deleted, a certificate remains in a deleted but recoverable state for a time. If you run the code again, use a different certificate name.

## Clean up resources

If you want to also experiment with [secrets](../secrets/quick-create-python.md) and [keys](../keys/quick-create-python.md), you can reuse the Key Vault created in this article.

Otherwise, when you're finished with the resources created in this article, use the following command to delete the resource group and all its contained resources:

```azurecli
az group delete --resource-group KeyVault-PythonQS-rg
```

## Next steps

- [Overview of Azure Key Vault](../general/overview.md)
- [Azure Key Vault developer's guide](../general/developers-guide.md)
- [Azure Key Vault best practices](../general/best-practices.md)
- [Authenticate with Key Vault](../general/authentication.md)
