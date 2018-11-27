---
title: Tutorial - How to use Azure Key Vault with Azure Linux Virtual Machine in Python | Microsoft Docs
description: Tutorial Configure an ASP.NET core application to read a secret from Key vault
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
#Customer intent: As a developer I want to use Azure Key vault to store secrets for my app, so that they are kept secure.
---
# Tutorial: How to use Azure Key Vault with Azure Linux Virtual Machine in Python

Azure Key Vault helps you to protect secrets such as API Keys, Database Connection strings needed to access your applications, services, and IT resources.

In this tutorial, you follow the necessary steps for getting an Azure web application to read information from Azure Key Vault by using managed identities for Azure resources. This tutorial is based on [Azure Web Apps](../app-service/app-service-web-overview.md). In the following you learn how to:

> [!div class="checklist"]
> * Create a key vault.
> * Store a secret in the key vault.
> * Retrieve a secret from the key vault.
> * Create an Azure Virtual Machine.
> * Enable a [managed identity](../active-directory/managed-identities-azure-resources/overview.md) for the Virtual Machine.
> * Grant the required permissions for the console application to read data from the key vault.
> * Retrieve secrets from Key Vault

Before we go any further, please read the [basic concepts](key-vault-whatis.md#basic-concepts).

## Prerequisites
* All platforms:
  * Git ([download](https://git-scm.com/downloads)).
  * An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
  * [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) version 2.0.4 or later. This is available for Windows, Mac, and Linux.

This tutorial makes use of Managed Service Identity

## What is Managed Service Identity and how does it work?
Before we go any further let's understand MSI. Azure Key Vault can store credentials securely so they aren’t in your code, but to retrieve them you need to authenticate to Azure Key Vault. To authenticate to Key Vault, you need a credential! A classic bootstrap problem. Through the magic of Azure and Azure AD, MSI provides a “bootstrap identity” that makes it much simpler to get things started.

Here’s how it works! When you enable MSI for an Azure service such as Virtual Machines, App Service, or Functions, Azure creates a [Service Principal](key-vault-whatis.md#basic-concepts) for the instance of the service in Azure Active Directory, and injects the credentials for the Service Principal into the instance of the service. 

![MSI](media/MSI.png)

Next, Your code calls a local metadata service available on the Azure resource to get an access token.
Your code uses the access token it gets from the local MSI_ENDPOINT to authenticate to an Azure Key Vault service. 

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

* Key vault name: The name must be a string of 3-24 characters and must contain only (0-9, a-z, A-Z, and -).
* Resource group name.
* Location: **West US**.

```azurecli
az keyvault create --name "<YourKeyVaultName>" --resource-group "<YourResourceGroupName>" --location "West US"
```
At this point, your Azure account is the only one that's authorized to perform any operations on this new vault.

## Add a secret to the key vault

We're adding a secret to help illustrate how this works. You might be storing a SQL connection string or any other information that you need to keep securely but make available to your application.

Type the following commands to create a secret in the key vault called **AppSecret**. This secret will store the value **MySecret**.

```azurecli
az keyvault secret set --vault-name "<YourKeyVaultName>" --name "AppSecret" --value "MySecret"
```

## Create a Virtual Machine
Follow the below links to create a Windows Virtual Machine

[Azure CLI](https://docs.microsoft.com/azure/virtual-machines/windows/quick-create-cli) 

[Powershell](https://docs.microsoft.com/azure/virtual-machines/windows/quick-create-powershell)

[Portal](https://docs.microsoft.com/azure/virtual-machines/windows/quick-create-portal)

## Assign identity to Virtual Machine
In this step we're creating a system assigned identity to the virtual machine by running the following command in Azure CLI

```
az vm identity assign --name <NameOfYourVirtualMachine> --resource-group <YourResourceGroupName>
```

Please note the systemAssignedIdentity shown below. 
The output of the above command would be 

```
{
  "systemAssignedIdentity": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "userAssignedIdentities": {}
}
```

## Give Virtual Machine Identity permission to Key Vault
Now we can give the above created identity permission to Key Vault by running the following command

```
az keyvault set-policy --name '<YourKeyVaultName>' --object-id <VMSystemAssignedIdentity> --secret-permissions get list
```

## Login to the Virtual Machine

You can follow this [tutorial](https://docs.microsoft.com/azure/virtual-machines/windows/connect-logon)

## Create and run Sample Python App

The below is just an example file named "Sample.py". 
It uses [requests](http://docs.python-requests.org/master/) library to make HTTP GET calls.

## Edit Sample.py
After creating Sample.py open the file and copy the below code

```
The below is a 2 step process. 
1. Fetch a token from the local MSI endpoint on the VM which in turn fetches a token from Azure Active Directory
2. Pass the token to Key Vault and fetch your secret 
```
    # importing the requests library 
    import requests 

    # Step 1: Fetch an access token from a Managed Identity enabled azure resource      
    # Note that the resource here is https://vault.azure.net for public cloud and api-version is 2018-02-01
    MSI_ENDPOINT = "http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https%3A%2F%2Fvault.azure.net"
    r = requests.get(MSI_ENDPOINT, headers = {"Metadata" : "true"}) 
      
    # extracting data in json format 
    # This request gets a access_token from Azure Active Directory using the local MSI endpoint
    data = r.json() 
    
    # Step 2: Pass the access_token received from previous HTTP GET call to Key Vault
    KeyVaultURL = "https://prashanthwinvmvault.vault.azure.net/secrets/RandomSecret?api-version=2016-10-01"
    kvSecret = requests.get(url = KeyVaultURL, headers = {"Authorization": "Bearer " + data["access_token"]})
    
    print(kvSecret.json()["value"])
```

By running you should see the secret value 
```
python Sample.py
```

The above code shows you how to do operations with Azure Key Vault in an Azure Windows Virtual Machine. 

## Next steps

> [!div class="nextstepaction"]
> [Azure Key Vault REST API](https://docs.microsoft.com/rest/api/keyvault/)
