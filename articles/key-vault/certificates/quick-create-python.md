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

# Quickstart: Azure Key Vault certificate client library for Python

Get started with the Azure Key Vault certificate client library for Python. Follow the steps below to install the package and try out example code for basic tasks. By using Key Vault to store certificates, you avoid storing certificates in your code, which increases the security of your app.

[API reference documentation](/python/api/overview/azure/keyvault-certificates-readme) | [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/keyvault/azure-keyvault-certificates) | [Package (Python Package Index)](https://pypi.org/project/azure-keyvault-certificates)

## Prerequisites

- An Azure subscription - [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Python 2.7+ or 3.6+](/azure/developer/python/configure-local-development-environment)
- [Azure CLI](/cli/azure/install-azure-cli)

This quickstart assumes you are running [Azure CLI](/cli/azure/install-azure-cli) in a Linux terminal window.

## Set up your local environment

This quickstart is using Azure Identity library with Azure CLI to authenticate user to Azure Services. Developers can also use Visual Studio or Visual Studio Code to authenticate their calls, for more information, see [Authenticate the client with Azure Identity client library](/python/api/overview/azure/identity-readme)

### Sign in to Azure

1. Run the `login` command.

    ```azurecli-interactive
    az login
    ```

    If the CLI can open your default browser, it will do so and load an Azure sign-in page.

    Otherwise, open a browser page at [https://aka.ms/devicelogin](https://aka.ms/devicelogin) and enter the
    authorization code displayed in your terminal.

2. Sign in with your account credentials in the browser.

### Install the packages

1. In a terminal or command prompt, create a suitable project folder, and then create and activate a Python virtual environment as described on [Use Python virtual environments](/azure/developer/python/configure-local-development-environment?tabs=cmd#use-python-virtual-environments)

1. Install the Azure Active Directory identity library:

    ```terminal
    pip install azure.identity
    ```


1. Install the Key Vault certificate client library:

    ```terminal
    pip install azure-keyvault-certificates
    ```

### Create a resource group and key vault

[!INCLUDE [Create a resource group and key vault](../../../includes/key-vault-python-qs-rg-kv-creation.md)]

### Grant access to your key vault

Create an access policy for your key vault that grants certificate permission to your user account

```console
az keyvault set-policy --name <YourKeyVaultName> --upn user@domain.com --certificate-permissions delete get list create
```

#### Set environment variables

This application is using key vault name as an environment variable called `KEY_VAULT_NAME`.

Windows
```cmd
set KEY_VAULT_NAME=<your-key-vault-name>
````
Windows PowerShell
```powershell
$Env:KEY_VAULT_NAME="<your-key-vault-name>"
```

macOS or Linux
```cmd
export KEY_VAULT_NAME=<your-key-vault-name>
```

## Create the sample code

The Azure Key Vault certificate client library for Python allows you to manage certificates. The following code sample demonstrates how to create a client, set a certificate, retrieve a certificate, and delete a certificate.

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

- If you encounter permissions errors, make sure you ran the [`az keyvault set-policy` command](#grant-access-to-your-key-vault).
- Re-running the code with the same key name may produce the error, "(Conflict) Certificate <name> is currently in a deleted but recoverable state." Use a different key name.

## Code details

### Authenticate and create a client

In this quickstart, logged in user is used to authenticate to key vault, which is preferred method for local development. For applications deployed to Azure, managed identity should be assigned to App Service or Virtual Machine, for more information, see [Managed Identity Overview](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview).

In below example, the name of your key vault is expanded to the key vault URI, in the format "https://\<your-key-vault-name\>.vault.azure.net". This example is using  ['DefaultAzureCredential()'](/python/api/azure-identity/azure.identity.defaultazurecredential) class, which allows to use the same code across different environments with different options to provide identity. For more information, see [Default Azure Credential Authentication](https://docs.microsoft.com/python/api/overview/azure/identity-readme). 

```python
credential = DefaultAzureCredential()
client = CertificateClient(vault_url=KVUri, credential=credential)
```

### Save a certificate

Once you've obtained the client object for the key vault, you can create a certificate using the [begin_create_certificate](/python/api/azure-keyvault-certificates/azure.keyvault.certificates.certificateclient?#begin-create-certificate-certificate-name--policy----kwargs-) method: 

```python
policy = CertificatePolicy.get_default()
poller = client.begin_create_certificate(certificate_name=certificateName, policy=policy)
certificate = poller.result()
```

Here, the certificate requires a policy obtained with the [CertificatePolicy.get_default](/python/api/azure-keyvault-certificates/azure.keyvault.certificates.certificatepolicy?#get-default--) method.

Calling a `begin_create_certificate` method generates an asynchronous call to the Azure REST API for the key vault. The asynchronous call returns a poller object. To wait for the result of the operation, call the poller's `result` method.

When handling the request, Azure authenticates the caller's identity (the service principal) using the credential object you provided to the client.


### Retrieve a certificate

To read a certificate from Key Vault, use the [get_certificate](/python/api/azure-keyvault-certificates/azure.keyvault.certificates.certificateclient?#get-certificate-certificate-name----kwargs-) method:

```python
retrieved_certificate = client.get_certificate(certificateName)
 ```

You can also verify that the certificate has been set with the Azure CLI command [az keyvault certificate show](/cli/azure/keyvault/certificate?#az_keyvault_certificate_show).

### Delete a certificate

To delete a certificate, use the [begin_delete_certificate](/python/api/azure-keyvault-certificates/azure.keyvault.certificates.certificateclient?#begin-delete-certificate-certificate-name----kwargs-) method:

```python
poller = client.begin_delete_certificate(certificateName)
deleted_certificate = poller.result()
```

The `begin_delete_certificate` method is asynchronous and returns a poller object. Calling the poller's `result` method waits for its completion.

You can verify that the certificate is deleted with the Azure CLI command [az keyvault certificate show](/cli/azure/keyvault/certificate?#az_keyvault_certificate_show).

Once deleted, a certificate remains in a deleted but recoverable state for a time. If you run the code again, use a different certificate name.

## Clean up resources

If you want to also experiment with [secrets](../secrets/quick-create-python.md) and [keys](../keys/quick-create-python.md), you can reuse the Key Vault created in this article.

Otherwise, when you're finished with the resources created in this article, use the following command to delete the resource group and all its contained resources:

```azurecli
az group delete --resource-group KeyVault-PythonQS-rg
```

## Next steps

- [Overview of Azure Key Vault](../general/overview.md)
- [Secure access to a key vault](../general/security-features.md)
- [Azure Key Vault developer's guide](../general/developers-guide.md)
- [Key Vault security overview](../general/security-features.md)
- [Authenticate with Key Vault](../general/authentication.md)
