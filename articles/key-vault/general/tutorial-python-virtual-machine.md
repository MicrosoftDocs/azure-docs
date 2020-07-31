---
title: Tutorial - Use Azure Key Vault with a virtual machine in Python | Microsoft Docs
description: In this tutorial, you configure an ASP.NET core application to read a secret from your key vault.
services: key-vault
author: msmbaldwin

ms.service: key-vault
ms.subservice: general
ms.topic: tutorial
ms.date: 07/20/2020
ms.author: mbaldwin
ms.custom: mvc, tracking-python

# Customer intent: As a developer I want to use Azure Key vault to store secrets for my app, so that they are kept secure.

---

# Tutorial: Use Azure Key Vault with a virtual machine in Python

Azure Key Vault helps you to protect secrets such as API Keys and database connection strings that are needed to access your applications, services, and IT resources.

In this tutorial, you set up a Python application to read information from Azure Key Vault by using managed identities for Azure resources. You learn how to:

> [!div class="checklist"]
> * Create a key vault
> * Store a secret in Key Vault
> * Create an Azure Linux virtual machine
> * Enable a [managed identity](../../active-directory/managed-identities-azure-resources/overview.md) for the virtual machine
> * Grant the required permissions for the console application to read data from Key Vault
> * Retrieve a secret from Key Vault

Before you begin, read [Key Vault basic concepts](basic-concepts.md). 

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Prerequisites

For Windows, Mac, and Linux:
  * [Git](https://git-scm.com/downloads)
  * This tutorial requires that you run the Azure CLI locally. You must have the Azure CLI version 2.0.4 or later installed. Run `az --version` to find the version. If you need to install or upgrade the CLI, see [Install Azure CLI 2.0](/cli/azure/install-azure-cli).

## Log in to Azure

To log in to Azure by using the Azure CLI, enter:

```azurecli
az login
```

### Create a resource group and key vault

[!INCLUDE [Create a resource group and key vault](../../../includes/key-vault-rg-kv-creation.md)]

## Add a secret to the key vault

[!INCLUDE [Create a secret](../../../includes/key-vault-create-secret.md)]

## Create a virtual machine
You can create a virtual machine by using one of the following methods:

* [The Azure CLI](../../virtual-machines/windows/quick-create-cli.md)
* [PowerShell](../../virtual-machines/windows/quick-create-powershell.md)
* [The Azure portal](../../virtual-machines/windows/quick-create-portal.md)

## Assign an identity to the VM
In this step, you create a system-assigned identity for the virtual machine by running the following command in the Azure CLI:

```azurecli
az vm identity assign --name <NameOfYourVirtualMachine> --resource-group <YourResourceGroupName>
```

Note the system-assigned identity that's displayed in the following code. The output of the preceding command would be: 

```output
{
  "systemAssignedIdentity": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "userAssignedIdentities": {}
}
```

## Assign permissions to the VM identity
Now you can assign the previously created identity permissions to your key vault by running the following command:

```azurecli
az keyvault set-policy --name '<YourKeyVaultName>' --object-id <VMSystemAssignedIdentity> --secret-permissions get list
```

## Log on to the virtual machine

To log on to the virtual machine, follow the instructions in [Connect and log on to an Azure virtual machine running Windows](../../virtual-machines/windows/connect-logon.md).

## Create and run a sample Python app

In the next section is an example file named *Sample.py*. It uses a [requests](https://2.python-requests.org/en/master/) library to make HTTP GET calls.

## Edit Sample.py

After you create *Sample.py*, open the file, and then copy the code in this section. 

The code presents a two-step process:
1. Fetch a token from the local MSI endpoint on the VM.  
  Doing so also fetches a token from Azure AD.
1. Pass the token to your key vault, and then fetch your secret. 

```python
    # importing the requests library 
    import requests 

    # Step 1: Fetch an access token from a Managed Identity enabled azure resource.
    # Resources with an MSI configured recieve an AAD access token by using the Azure Instance Metadata Service (IMDS)
    # IMDS provides an endpoint accessible to all IaaS VMs using a non-routable well-known IP Address
    # To learn more about IMDS and MSI Authentication see the following link: https://docs.microsoft.com/azure/virtual-machines/windows/instance-metadata-service
    # Note that the resource here is https://vault.azure.net for public cloud and api-version is 2018-02-01
    MSI_ENDPOINT = "http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https%3A%2F%2Fvault.azure.net"
    r = requests.get(MSI_ENDPOINT, headers = {"Metadata" : "true"}) 
      
    # extracting data in json format 
    # This request gets an access_token from Azure AD by using the local MSI endpoint.
    data = r.json() 
    
    # Step 2: Pass the access_token received from previous HTTP GET call to your key vault.
    KeyVaultURL = "https://{YOUR KEY VAULT NAME}.vault.azure.net/secrets/{YOUR SECRET NAME}?api-version=2016-10-01"
    kvSecret = requests.get(url = KeyVaultURL, headers = {"Authorization": "Bearer " + data["access_token"]})
    
    print(kvSecret.json()["value"])
```

You can display the secret value by running the following code: 

```console
python Sample.py
```

The preceding code shows you how to do operations with Azure Key Vault in a Windows virtual machine. 

## Clean up resources

When they are no longer needed, delete the virtual machine and your key vault.

## Next steps

> [!div class="nextstepaction"]
> [Azure Key Vault REST API](https://docs.microsoft.com/rest/api/keyvault/)
