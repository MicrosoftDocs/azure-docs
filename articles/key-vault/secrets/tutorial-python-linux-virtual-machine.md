---
title: Tutorial - Use a Linux virtual machine and a Python application to store secrets in Azure Key Vault | Microsoft Docs
description: In this tutorial, you learn how to configure a Python application to read a secret from Azure Key Vault.
services: key-vault
author: msmbaldwin
manager: rajvijan

ms.service: key-vault
ms.subservice: secrets
ms.topic: tutorial
ms.date: 09/05/2018
ms.author: mbaldwin
ms.custom: mvc, tracking-python
#Customer intent: As a developer, I want to use Azure Key Vault to store secrets for my app so that they are kept secure.
---

# Tutorial: Use a Linux VM and a Python app to store secrets in Azure Key Vault

Azure Key Vault helps you protect secrets such as the API keys and database connection strings needed to access your applications, services, and IT resources.

In this tutorial, you set up an Azure web application to read information from Azure Key Vault by using managed identities for Azure resources. You learn how to:

> [!div class="checklist"]
> * Create a key vault
> * Store a secret in your key vault
> * Create a Linux virtual machine
> * Enable a [managed identity](../../active-directory/managed-identities-azure-resources/overview.md) for the virtual machine
> * Grant the required permissions for the console application to read data from the key vault
> * Retrieve a secret from your key vault

Before you go any further, make sure you understand the [basic concepts about Key Vault](../general/basic-concepts.md).

## Prerequisites

* [Git](https://git-scm.com/downloads).
* An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* [Azure CLI version 2.0.4 or later](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) or Azure Cloud Shell.

[!INCLUDE [Azure Cloud Shell](../../../includes/cloud-shell-try-it.md)]

## Understand Managed Service Identity

Azure Key Vault can store credentials securely so they aren't in your code. To retrieve them, you need to authenticate to Azure Key Vault. However, to authenticate to Key Vault, you need a credential. It's a classic bootstrap problem. Through Azure and Azure Active Directory (Azure AD), Managed Service Identity (MSI) provides a bootstrap identity that makes it simpler to get things started.

When you enable MSI for an Azure service like Virtual Machines, App Service, or Functions, Azure creates a service principal for the instance of the service in Azure AD. It injects the credentials for the service principal into the instance of the service.

![MSI](../media/MSI.png)

Next, your code calls a local metadata service available on the Azure resource to get an access token. Your code uses the access token that it gets from the local MSI endpoint to authenticate to an Azure Key Vault service.

## Sign in to Azure

To sign in to Azure by using the Azure CLI, enter:

```azurecli-interactive
az login
```

## Create a resource group

An Azure resource group is a logical container into which Azure resources are deployed and managed.

Create a resource group by using the `az group create` command in the West US location with the following code. Replace `YourResourceGroupName` with a name of your choice.

```azurecli-interactive
# To list locations: az account list-locations --output table
az group create --name "<YourResourceGroupName>" --location "West US"
```

You use this resource group throughout the tutorial.

## Create a key vault

Next, you create a key vault in the resource group that you created in the previous step. Provide the following information:

* Key vault name: The name must be a string of 3-24 characters and must contain only 0-9, a-z, A-Z, and hyphens (-).
* Resource group name.
* Location: **West US**.

```azurecli-interactive
az keyvault create --name "<YourKeyVaultName>" --resource-group "<YourResourceGroupName>" --location "West US"
```

At this point, your Azure account is the only one that's authorized to perform any operations on this new vault.

## Add a secret to the key vault

We're adding a secret to help illustrate how this works. You might want to store a SQL connection string or any other information that needs to be both kept secure and available to your application.

Type the following commands to create a secret in the key vault called *AppSecret*. This secret will store the value **MySecret**.

```azurecli-interactive
az keyvault secret set --vault-name "<YourKeyVaultName>" --name "AppSecret" --value "MySecret"
```

## Create a Linux virtual machine

Create a VM by using the `az vm create` command.

The following example creates a VM named **myVM** and adds a user account named **azureuser**. The `--generate-ssh-keys` parameter automatically generates an SSH key and puts it in the default key location (**~/.ssh**). To create a specific set of keys instead, use the `--ssh-key-value` option.

```azurecli-interactive
az vm create \
  --resource-group myResourceGroup \
  --name myVM \
  --image UbuntuLTS \
  --admin-username azureuser \
  --generate-ssh-keys
```

It takes a few minutes to create the VM and supporting resources. The following example output shows that the VM creation was successful:

```output
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

Make a note of your own `publicIpAddress` in the output from your VM. You'll use this address to access the VM in later steps.

## Assign an identity to the VM

Create a system-assigned identity to the virtual machine by running the following command:

```azurecli-interactive
az vm identity assign --name <NameOfYourVirtualMachine> --resource-group <YourResourceGroupName>
```

The output of the command is as follows.

```output
{
  "systemAssignedIdentity": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "userAssignedIdentities": {}
}
```

Make a note of the `systemAssignedIdentity`. You use it the next step.

## Give the VM identity permission to Key Vault

Now you can give Key Vault permission to the identity you created. Run the following command:

```azurecli-interactive
az keyvault set-policy --name '<YourKeyVaultName>' --object-id <VMSystemAssignedIdentity> --secret-permissions get list
```

## Log in to the VM

Log in to the virtual machine by using a terminal.

```terminal
ssh azureuser@<PublicIpAddress>
```

## Install Python library on the VM

Download and install the [requests](https://pypi.org/project/requests/2.7.0/) Python library to make HTTP GET calls.

## Create, edit, and run the sample Python app

Create a Python file called **Sample.py**.

Open Sample.py and edit it to contain the following code:

```python
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

The preceding code performs a two-step process:

   1. Fetches a token from the local MSI endpoint on the VM. The endpoint then fetches a token from Azure Active Directory.
   1. Passes the token to the key vault and fetches your secret.

Run the following command. You should see the secret value.

```console
python Sample.py
```

In this tutorial, you learned how to use Azure Key Vault with a Python app running on a Linux virtual machine.

## Clean up resources

Delete the resource group, virtual machine, and all related resources when you no longer need them. To do so, select the resource group for the VM and select **Delete**.

Delete the key vault by using the `az keyvault delete` command:

```azurecli-interactive
az keyvault delete --name
                   [--resource-group]
                   [--subscription]
```

## Next steps

> [!div class="nextstepaction"]
> [Azure Key Vault REST API](https://docs.microsoft.com/rest/api/keyvault/)
