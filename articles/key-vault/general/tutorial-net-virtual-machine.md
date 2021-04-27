---
title: Tutorial - Use Azure Key Vault with a virtual machine in .NET | Microsoft Docs
description: In this tutorial, you configure a virtual machine an ASP.NET core application to read a secret from your key vault.
services: key-vault
author: msmbaldwin

ms.service: key-vault
ms.subservice: general
ms.topic: tutorial
ms.date: 03/17/2021
ms.author: mbaldwin
ms.custom: "mvc, devx-track-csharp, devx-track-azurepowershell"

#Customer intent: As a developer I want to use Azure Key Vault to store secrets for my app, so that they are kept secure.
---
# Tutorial: Use Azure Key Vault with a virtual machine in .NET

Azure Key Vault helps you to protect secrets such as API keys, the database connection strings you need to access your applications, services, and IT resources.

In this tutorial, you learn how to get a console application to read information from Azure Key Vault. Application would use virtual machine managed identity to authenticate to Key Vault. 

The tutorial shows you how to:

> [!div class="checklist"]
> * Create a resource group.
> * Create a key vault.
> * Add a secret to the key vault.
> * Retrieve a secret from the key vault.
> * Create an Azure virtual machine.
> * Enable a [managed identity](../../active-directory/managed-identities-azure-resources/overview.md) for the Virtual Machine.
> * Assign permissions to the VM identity.

Before you begin, read [Key Vault basic concepts](basic-concepts.md). 

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Prerequisites

For Windows, Mac, and Linux:
  * [Git](https://git-scm.com/downloads)
  * The [.NET Core 3.1 SDK or later](https://dotnet.microsoft.com/download/dotnet-core/3.1).
  * [Azure CLI](/cli/azure/install-azure-cli) or [Azure PowerShell](/powershell/azure/install-az-ps)

## Create resources and assign permissions

Before you start coding you need to create some resources, put a secret into your key vault, and assign permissions.

### Sign in to Azure

To sign in to Azure by using following command:

# [Azure CLI](#tab/azure-cli)
```azurecli
az login
```
# [Azure PowerShell](#tab/azurepowershell)

```azurepowershell
Connect-AzAccount
```
---

## Create a resource group and key vault

[!INCLUDE [Create a resource group and key vault](../../../includes/key-vault-rg-kv-creation.md)]

## Populate your key vault with a secret

[!INCLUDE [Create a secret](../../../includes/key-vault-create-secret.md)]

## Create a virtual machine
Create a Windows or Linux virtual machine using one of the following methods:

| Windows | Linux |
|--|--|
| [Azure CLI](../../virtual-machines/windows/quick-create-cli.md) | [Azure CLI](../../virtual-machines/linux/quick-create-cli.md) |  
| [PowerShell](../../virtual-machines/windows/quick-create-powershell.md) | [PowerShell](../../virtual-machines/linux/quick-create-powershell.md) |
| [Azure portal](../../virtual-machines/windows/quick-create-portal.md) | [Azure portal](../../virtual-machines/linux/quick-create-portal.md) |

## Assign an identity to the VM
Create a system-assigned identity for the virtual machine with the following example:

# [Azure CLI](#tab/azure-cli)
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

# [Azure PowerShell](#tab/azurepowershell)

```azurepowershell
$vm = Get-AzVM -Name <NameOfYourVirtualMachine>
Update-AzVM -ResourceGroupName <YourResourceGroupName> -VM $vm -IdentityType SystemAssigned
```

Note the PrincipalId that's displayed in the following code. The output of the preceding command would be: 


```output
PrincipalId          TenantId             Type             UserAssignedIdentities
-----------          --------             ----             ----------------------
xxxxxxxx-xx-xxxxxx   xxxxxxxx-xxxx-xxxx   SystemAssigned
```
---

## Assign permissions to the VM identity
Assign the previously created identity permissions to your key vault with the [az keyvault set-policy](/cli/azure/keyvault#az_keyvault_set_policy) command:

# [Azure CLI](#tab/azure-cli)
```azurecli
az keyvault set-policy --name '<your-unique-key-vault-name>' --object-id <VMSystemAssignedIdentity> --secret-permissions  get list set delete
```
# [Azure PowerShell](#tab/azurepowershell)

```azurepowershell
Set-AzKeyVaultAccessPolicy -ResourceGroupName <YourResourceGroupName> -VaultName '<your-unique-key-vault-name>' -ObjectId '<VMSystemAssignedIdentity>' -PermissionsToSecrets  get,list,set,delete
```
---

## Sign in to the virtual machine

To sign in to the virtual machine, follow the instructions in [Connect and sign in to an Azure Windows virtual machine](../../virtual-machines/windows/connect-logon.md) or [Connect and sign in to an Azure Linux virtual machine](../../virtual-machines/linux/login-using-aad.md).

## Set up the console app

Create a console app and install the required packages using the `dotnet` command.

### Install .NET Core

To install .NET Core, go to the [.NET downloads](https://dotnet.microsoft.com/download) page.

### Create and run a sample .NET app

Open a command prompt.

You can print "Hello World" to the console by running the following commands:

```console
dotnet new console -n keyvault-console-app
cd keyvault-console-app
dotnet run
```

### Install the package

From the console window, install the Azure Key Vault Secrets client library for .NET:

```console
dotnet add package Azure.Security.KeyVault.Secrets
```

For this quickstart, you will need to install the following identity package to authenticate to Azure Key Vault:

```console
dotnet add package Azure.Identity
```

## Edit the console app

Open the *Program.cs* file and add these packages:

```csharp
using System;
using Azure.Core;
using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
```

Add these lines, updating the URI to reflect the `vaultUri` of your key vault. Below code is using  ['DefaultAzureCredential()'](/dotnet/api/azure.identity.defaultazurecredential) for authentication to key vault, which is using token from application managed identity to authenticate. It is also using exponential backoff for retries in case of key vault is being throttled.

```csharp
  class Program
    {
        static void Main(string[] args)
        {
            string secretName = "mySecret";
            string keyVaultName = "<your-key-vault-name>";
            var kvUri = "https://<your-key-vault-name>.vault.azure.net";
            SecretClientOptions options = new SecretClientOptions()
            {
                Retry =
                {
                    Delay= TimeSpan.FromSeconds(2),
                    MaxDelay = TimeSpan.FromSeconds(16),
                    MaxRetries = 5,
                    Mode = RetryMode.Exponential
                 }
            };

            var client = new SecretClient(new Uri(kvUri), new DefaultAzureCredential(),options);

            Console.Write("Input the value of your secret > ");
            string secretValue = Console.ReadLine();

            Console.Write("Creating a secret in " + keyVaultName + " called '" + secretName + "' with the value '" + secretValue + "` ...");

            client.SetSecret(secretName, secretValue);

            Console.WriteLine(" done.");

            Console.WriteLine("Forgetting your secret.");
            secretValue = "";
            Console.WriteLine("Your secret is '" + secretValue + "'.");

            Console.WriteLine("Retrieving your secret from " + keyVaultName + ".");

            KeyVaultSecret secret = client.GetSecret(secretName);

            Console.WriteLine("Your secret is '" + secret.Value + "'.");

            Console.Write("Deleting your secret from " + keyVaultName + " ...");

            client.StartDeleteSecret(secretName);

            System.Threading.Thread.Sleep(5000);
            Console.WriteLine(" done.");

        }
    }
```

## Clean up resources

When they are no longer needed, delete the virtual machine and your key vault.

## Next steps

> [!div class="nextstepaction"]
> [Azure Key Vault REST API](/rest/api/keyvault/)
