---
title: Tutorial - Use a Linux virtual machine and an ASP.NET console application to store secrets in Azure Key Vault | Microsoft Docs
description: In this tutorial, you learn how to configure an ASP.NET Core application to read a secret from Azure Key vault.
services: key-vault
author: msmbaldwin
manager: rajvijan

ms.service: key-vault
ms.topic: tutorial
ms.date: 12/21/2018
ms.author: mbaldwin
ms.custom: mvc

#Customer intent: As a developer, I want to use Azure Key Vault to store secrets for my app so that they are kept secure.
---

# Tutorial: Use a Linux VM and a .NET app to store secrets in Azure Key Vault

Azure Key Vault helps you to protect secrets such as API Keys and database connection strings that are needed to access your applications, services, and IT resources.

In this tutorial, you set up a .NET console application to read information from Azure Key Vault by using managed identities for Azure resources. You learn how to:

> [!div class="checklist"]
> * Create a key vault
> * Store a secret in Key Vault
> * Create an Azure Linux virtual machine
> * Enable a [managed identity](../active-directory/managed-identities-azure-resources/overview.md) for the virtual machine
> * Grant the required permissions for the console application to read data from Key Vault
> * Retrieve a secret from Key Vault

Before we go any further, read about [key vault basic concepts](key-vault-whatis.md#basic-concepts).

## Prerequisites

* [Git](https://git-scm.com/downloads).
* An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* [Azure CLI 2.0 or later](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) or Azure Cloud Shell.

[!INCLUDE [Azure Cloud Shell](../../includes/cloud-shell-try-it.md)]

## Understand Managed Service Identity

Azure Key Vault can store credentials securely so they aren’t in your code, but to retrieve them you need to authenticate to Azure Key Vault. However, to authenticate to Key Vault, you need a credential. It's a classic bootstrap problem. With Azure and Azure Active Directory (Azure AD), Managed Service Identity (MSI) can provide a bootstrap identity that makes it much simpler to get things started.

When you enable MSI for an Azure service like Virtual Machines, App Service, or Functions, Azure creates a service principal for the instance of the service in Azure Active Directory. It injects the credentials for the service principal into the instance of the service.

![MSI](media/MSI.png)

Next, your code calls a local metadata service available on the Azure resource to get an access token.
Your code uses the access token it gets from the local MSI_ENDPOINT to authenticate to an Azure Key Vault service.

## Sign in to Azure

To sign in to Azure by using the Azure CLI, enter:

```azurecli-interactive
az login
```

## Create a resource group

Create a resource group by using the `az group create` command. An Azure resource group is a logical container into which Azure resources are deployed and managed.

Create a resource group in the West US location. Pick a name for your resource group and replace `YourResourceGroupName` in the following example:

```azurecli-interactive
# To list locations: az account list-locations --output table
az group create --name "<YourResourceGroupName>" --location "West US"
```

You use this resource group throughout the tutorial.

## Create a key vault

Next, create a key vault in your resource group. Provide the following information:

* Key vault name: a string of 3 to 24 characters that can contain only numbers, letters, and hyphens ( 0-9, a-z, A-Z, and \- ).
* Resource group name
* Location: **West US**

```azurecli-interactive
az keyvault create --name "<YourKeyVaultName>" --resource-group "<YourResourceGroupName>" --location "West US"
```

At this point, only your Azure account is authorized to perform any operations on this new vault.

## Add a secret to the key vault

Now, you add a secret. In a real-world scenario, you might be storing a SQL connection string or any other information that you need to keep securely, but make available to your application.

For this tutorial, type the following commands to create a secret in the key vault. The secret is called **AppSecret** and its value is **MySecret**.

```azurecli
az keyvault secret set --vault-name "<YourKeyVaultName>" --name "AppSecret" --value "MySecret"
```

## Create a Linux virtual machine

Create a VM with the `az vm create` command.

The following example creates a VM named **myVM** and adds a user account named **azureuser**. The `--generate-ssh-keys` parameter us used to automatically generate an SSH key and put it in the default key location (**~/.ssh**). To use a specific set of keys instead, use the `--ssh-key-value` option.

```azurecli-interactive
az vm create \
  --resource-group myResourceGroup \
  --name myVM \
  --image UbuntuLTS \
  --admin-username azureuser \
  --generate-ssh-keys
```

It takes a few minutes to create the VM and supporting resources. The following example output shows that the VM create operation was successful.

```azurecli
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

Make a note of your `publicIpAddress` in the output from your VM. You'll use this address to access the VM in later steps.

## Assign an identity to the VM

Create a system-assigned identity to the virtual machine by running the following command:

```azurecli
az vm identity assign --name <NameOfYourVirtualMachine> --resource-group <YourResourceGroupName>
```

The output of the command should be:

```azurecli
{
  "systemAssignedIdentity": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "userAssignedIdentities": {}
}
```

Make a note of the `systemAssignedIdentity`. You use it in the next step.

## Give the VM identity permission to Key Vault

Now you can give Key Vault permission to the identity you created. Run the following command:

```azurecli
az keyvault set-policy --name '<YourKeyVaultName>' --object-id <VMSystemAssignedIdentity> --secret-permissions get list
```

## Log in to the VM

Log in to the virtual machine by using a terminal.

```terminal
ssh azureuser@<PublicIpAddress>
```

## Install .NET Core on Linux

On your Linux VM:

Register the Microsoft product key as trusted by running the following commands:

   ```console
   curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.gpg
   sudo mv microsoft.gpg /etc/apt/trusted.gpg.d/microsoft.gpg
   ```

Set up desired version host package feed based on operating system:

```console
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

Install .NET and check the version:

   ```console
   sudo apt-get install dotnet-sdk-2.1.4
   dotnet --version
   ```

## Create and run a sample .NET app

Run the following commands. You should see "Hello World" printed to the console.

```console
dotnet new console -o helloworldapp
cd helloworldapp
dotnet run
```

## Edit the console app to fetch your secret

Open Program.cs file and add these packages:

   ```csharp
   using System;
   using System.IO;
   using System.Net;
   using System.Text;
   using Newtonsoft.Json;
   using Newtonsoft.Json.Linq;
   ```

It's a two-step process to change the class file to enable the app to access the secret in the key vault.

1. Fetch a token from the local MSI endpoint on the VM that in turn fetches a token from Azure Active Directory.
1. Pass the token to Key Vault and fetch your secret.

   Edit the class file to contain the following code:

   ```csharp
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

Now you've learned how to perform operations with Azure Key Vault in a .NET application running on an Azure Linux virtual machine.

## Clean up resources

Delete the resource group, virtual machine, and all related resources when you no longer need them. To do so, select the resource group for the VM and select **Delete**.

Delete the key vault by using the `az keyvault delete` command:

```azurecli-interactive
az keyvault delete --name
                   [--resource group]
                   [--subscription]
```

## Next steps

> [!div class="nextstepaction"]
> [Azure Key Vault REST API](https://docs.microsoft.com/rest/api/keyvault/)
