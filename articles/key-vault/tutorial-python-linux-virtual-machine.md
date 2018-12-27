---
title: Tutorial - Use Azure Key Vault with an Azure virtual Machine in Python | Microsoft Docs
description: In this tutorial, you configure a Python application to read a secret from a key vault
services: key-vault
documentationcenter: 
author: prashanthyv
manager: rajvijan

ms.assetid: 0e57f5c7-6f5a-46b7-a18a-043da8ca0d83
ms.service: key-vault
ms.workload: key-vault
ms.topic: tutorial
ms.date: 09/05/2018
ms.author: pryerram
ms.custom: mvc
#Customer intent: As a developer, I want to use Azure Key Vault to store secrets for my app, so that they are kept secure.
---
# Tutorial: Use Azure Key Vault with an Azure virtual machine in Python

Azure Key Vault helps you protect secrets such as API keys and database connection strings needed to access your applications, services, and IT resources.

In this tutorial, you follow the steps to get an Azure web application to read information from Azure Key Vault by using managed identities for Azure resources. You learn how to:

> [!div class="checklist"]
> * Create a key vault.
> * Store a secret in the key vault.
> * Retrieve a secret from the key vault.
> * Create an Azure virtual machine.
> * Enable a [managed identity](../active-directory/managed-identities-azure-resources/overview.md) for the virtual machine.
> * Grant the required permissions for the console application to read data from the key vault.
> * Retrieve secrets from the key vault

Before we go any further, please read the [basic concepts about Key Vault](key-vault-whatis.md#basic-concepts).

## Prerequisites
* All platforms:
  * Git ([download](https://git-scm.com/downloads)).
  * An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
  * [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) version 2.0.4 or later. It's available for Windows, Mac, and Linux.

This tutorial makes use of Managed Service Identity (MSI).

## What is Managed Service Identity and how does it work?
Azure Key Vault can store credentials securely so they aren’t in your code. To retrieve them, you need to authenticate to Key Vault. To authenticate to Key Vault, you need a credential! That's a classic bootstrap problem. Through Azure and Azure Active Directory (Azure AD), MSI provides a “bootstrap identity” that makes it simpler to get things started.

When you enable MSI for an Azure service such as Virtual Machines, App Service, or Functions, Azure creates a [service principal](key-vault-whatis.md#basic-concepts) for the instance of the service in Azure AD. Azure injects the credentials for the service principal into the instance of the service. 

![MSI](media/MSI.png)

Next, Your code calls a local metadata service available on the Azure resource to get an access token.
Your code uses the access token that it gets from the local MSI endpoint to authenticate to an Azure Key Vault service. 

## Log in to Azure

To log in to Azure by using the Azure CLI, enter:

```azurecli
az login
```

## Create a resource group

Create a resource group by using the [az group create](/cli/azure/group#az-group-create) command. An Azure resource group is a logical container into which Azure resources are deployed and managed.

Select a resource group name and fill in the placeholder.
The following example creates a resource group in the West US location:

```azurecli
# To list locations: az account list-locations --output table
az group create --name "<YourResourceGroupName>" --location "West US"
```

The resource group that you just created is used throughout this article.

## Create a key vault

Next you create a key vault in the resource group that you created in the previous step. Provide the following information:

* Key vault name: The name must be a string of 3-24 characters and must contain only 0-9, a-z, A-Z, and hyphens (-).
* Resource group name.
* Location: **West US**.

```azurecli
az keyvault create --name "<YourKeyVaultName>" --resource-group "<YourResourceGroupName>" --location "West US"
```
At this point, your Azure account is the only one that's authorized to perform any operations on this new vault.

## Add a secret to the key vault

We're adding a secret to help illustrate how this works. You might be storing a SQL connection string or any other information that you need to keep securely but make available to your application.

Type the following commands to create a secret in the key vault called *AppSecret*. This secret will store the value **MySecret**.

```azurecli
az keyvault secret set --vault-name "<YourKeyVaultName>" --name "AppSecret" --value "MySecret"
```

## Create a virtual machine

Create a VM by using the [az vm create](/cli/azure/vm#az_vm_create) command.

The following example creates a VM named *myVM* and adds a user account named *azureuser*. The `--generate-ssh-keys` parameter automatically generates an SSH key and puts it in the default key location (*~/.ssh*). To use a specific set of keys instead, use the `--ssh-key-value` option.

```azurecli-interactive
az vm create \
  --resource-group myResourceGroup \
  --name myVM \
  --image UbuntuLTS \
  --admin-username azureuser \
  --generate-ssh-keys
```

It takes a few minutes to create the VM and supporting resources. The following example output shows that the VM creation was successful:

```
{
  "fqdns": "",
  "id": "/subscriptions/<guid>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM",
  "location": "westus",
  "macAddress": "00-00-00-00-00-00",
  "powerState": "VM running",
  "privateIpAddress": "XX.XX.XX.XX",
  "publicIpAddress": "XX.XX.XXX.XXX",
  "resourceGroup": "myResourceGroup"
}
```

Note your own `publicIpAddress` value in the output from your VM. This address is used to access the VM in the next steps.

## Assign an identity to the virtual machine
In this step, we're creating a system-assigned identity for the virtual machine. Run the following command in the Azure CLI:

```
az vm identity assign --name <NameOfYourVirtualMachine> --resource-group <YourResourceGroupName>
```

The output of the command is as follows. Note the value of **systemAssignedIdentity**. 

```
{
  "systemAssignedIdentity": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "userAssignedIdentities": {}
}
```

## Give the virtual machine identity permission to the key vault
Now we can give the identity permission to the key vault. Run the following command:

```
az keyvault set-policy --name '<YourKeyVaultName>' --object-id <VMSystemAssignedIdentity> --secret-permissions get list
```

## Log in to the virtual machine

Log in to the virtual machine by following [this tutorial](https://docs.microsoft.com/azure/virtual-machines/windows/connect-logon).

## Create and run the sample Python app

The following example file is named *Sample.py*. 
It uses the [requests](https://pypi.org/project/requests/2.7.0/) library to make HTTP GET calls.

## Edit Sample.py
After you create Sample.py, open the file and copy the following code. The code is a two-step process: 
1. Fetch a token from the local MSI endpoint on the VM. The endpoint then fetches a token from Azure Active Directory.
2. Pass the token to the key vault and fetch your secret. 

```
    # importing the requests library 
    import requests 

    # Step 1: Fetch an access token from an MSI-enabled Azure resource      
    # Note that the resource here is https://vault.azure.net for the public cloud, and api-version is 2018-02-01
    MSI_ENDPOINT = "http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https%3A%2F%2Fvault.azure.net"
    r = requests.get(MSI_ENDPOINT, headers = {"Metadata" : "true"}) 
      
    # Extracting data in JSON format 
    # This request gets an access token from Azure Active Directory by using the local MSI endpoint
    data = r.json() 
    
    # Step 2: Pass the access token received from the previous HTTP GET call to the key vault
    KeyVaultURL = "https://prashanthwinvmvault.vault.azure.net/secrets/RandomSecret?api-version=2016-10-01"
    kvSecret = requests.get(url = KeyVaultURL, headers = {"Authorization": "Bearer " + data["access_token"]})
    
    print(kvSecret.json()["value"])
```

By running the following command, you should see the secret value: 

```
python Sample.py
```

The preceding code shows you how to do operations with Azure Key Vault in a Windows virtual machine. 

## Next steps

> [!div class="nextstepaction"]
> [Azure Key Vault REST API](https://docs.microsoft.com/rest/api/keyvault/)
