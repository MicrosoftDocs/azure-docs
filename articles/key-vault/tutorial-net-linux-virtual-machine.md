---
title: Tutorial - How to use Azure Key Vault with Azure Linux Virtual Machine in .NET | Microsoft Docs
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
# Tutorial: How to use Azure Key Vault with Azure Linux Virtual Machine in .NET

Azure Key Vault helps you to protect secrets such as API Keys, Database Connection strings needed to access your applications, services, and IT resources.

In this tutorial, you follow the necessary steps for getting an Console application to read information from Azure Key Vault by using managed identities for Azure resources. This tutorial is based on [Azure Web Apps](../app-service/app-service-web-overview.md). In the following you learn how to:

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

Create a VM with the [az vm create](/cli/azure/vm#az_vm_create) command.

The following example creates a VM named *myVM* and adds a user account named *azureuser*. The `--generate-ssh-keys` parameter us used to automatically generate an SSH key, and put it in the default key location (*~/.ssh*). To use a specific set of keys instead, use the `--ssh-key-value` option.

```azurecli-interactive
az vm create \
  --resource-group myResourceGroup \
  --name myVM \
  --image UbuntuLTS \
  --admin-username azureuser \
  --generate-ssh-keys
```

It takes a few minutes to create the VM and supporting resources. The following example output shows the VM create operation was successful.

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

Note your own `publicIpAddress` in the output from your VM. This address is used to access the VM in the next steps.

## Assign identity to Virtual Machine
In this step we're creating a system assigned identity to the virtual machine by running the following command

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

## Give VM Identity permission to Key Vault
Now we can give the above created identity permission to Key Vault by running the following command

```
az keyvault set-policy --name '<YourKeyVaultName>' --object-id <VMSystemAssignedIdentity> --secret-permissions get list
```

## Login to the Virtual Machine

Now login to the Virtual Machine by using a terminal

```
ssh azureuser@<PublicIpAddress>
```

## Install Dot Net core on Linux
### Register the Microsoft Product key as trusted. Run the following two commands

```
curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.gpg
sudo mv microsoft.gpg /etc/apt/trusted.gpg.d/microsoft.gpg
```

### Set up desired version host package feed based on Operating System
```
# Ubuntu 17.10
sudo sh -c 'echo "deb [arch=amd64] https://packages.microsoft.com/repos/microsoft-ubuntu-artful-prod artful main" > /etc/apt/sources.list.d/dotnetdev.list'
sudo apt-get update
 
# Ubuntu 17.04
sudo sh -c 'echo "deb [arch=amd64] https://packages.microsoft.com/repos/microsoft-ubuntu-zesty-prod zesty main" > /etc/apt/sources.list.d/dotnetdev.list'
sudo apt-get update
 
# Ubuntu 16.04 / Linux Mint 18
sudo sh -c 'echo "deb [arch=amd64] https://packages.microsoft.com/repos/microsoft-ubuntu-xenial-prod xenial main" > /etc/apt/sources.list.d/dotnetdev.list'
sudo apt-get update
 
# Ubuntu 14.04 / Linux Mint 17
sudo sh -c 'echo "deb [arch=amd64] https://packages.microsoft.com/repos/microsoft-ubuntu-trusty-prod trusty main" > /etc/apt/sources.list.d/dotnetdev.list'
sudo apt-get update
```

### Install .NET Core

And check .NET Version

```
sudo apt-get install dotnet-sdk-2.1.4
dotnet --version
```

## Create and run Sample Dot Net App

By running the below commands you should see "Hello World" printed to the console

```
dotnet new console -o helloworldapp
cd helloworldapp
dotnet run
```

## Edit console app
Open Program.cs file and add these packages
```
using System;
using System.IO;
using System.Net;
using System.Text;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
```
Then change the class file to contain the below code. It's a 2 step process. 
1. Fetch a token from the local MSI endpoint on the VM which inturn fetches a token from Azure Active Directory
2. Pass the token to Key Vault and fetch your secret 

```
 class Program
    {
        static void Main(string[] args)
        {
            // Step 1: Get a token from local (URI) Managed Service Identity endpoint which in turn fetches it from Azure Active Directory
            var token = GetToken();

            // Step 2: Fetch the secret value from Key Vault
            System.Console.WriteLine(FetchSecretValueFromKeyVault(token));
        }

        static string GetToken()
        {
            WebRequest request = WebRequest.Create("http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https%3A%2F%2Fvault.azure.net");
            request.Headers.Add("Metadata", "true");
            WebResponse response = request.GetResponse();
            return ParseWebResponse(response, "access_token");
        }

        static string FetchSecretValueFromKeyVault(string token)
        {
            WebRequest kvRequest = WebRequest.Create("https://prashanthwinvmvault.vault.azure.net/secrets/RandomSecret?api-version=2016-10-01");
            kvRequest.Headers.Add("Authorization", "Bearer "+  token);
            WebResponse kvResponse = kvRequest.GetResponse();
            return ParseWebResponse(kvResponse, "value");
        }

        private static string ParseWebResponse(WebResponse response, string tokenName)
        {
            string token = String.Empty;
            using (Stream stream = response.GetResponseStream())
            {
                StreamReader reader = new StreamReader(stream, Encoding.UTF8);
                String responseString = reader.ReadToEnd();

                JObject joResponse = JObject.Parse(responseString);    
                JValue ojObject = (JValue)joResponse[tokenName];   
                token = ojObject.Value.ToString();
            }
            return token;
        }
    }
```

The above code shows you how to do operations with Azure Key Vault in an Azure Linux Virtual Machine. 


## Next steps

> [!div class="nextstepaction"]
> [Azure Key Vault REST API](https://docs.microsoft.com/rest/api/keyvault/)
