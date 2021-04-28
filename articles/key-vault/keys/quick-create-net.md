---
title: Quickstart - Azure Key Vault keys client library for .NET (version 4)
description: Learn how to create, retrieve, and delete keys from an Azure key vault using the .NET client library (version 4)
author: msmbaldwin
ms.author: mbaldwin
ms.date: 09/23/2020
ms.service: key-vault
ms.subservice: keys
ms.topic: quickstart
ms.custom: "devx-track-csharp, devx-track-azurepowershell"
---

# Quickstart: Azure Key Vault key client library for .NET (SDK v4)

Get started with the Azure Key Vault key client library for .NET. [Azure Key Vault](../general/overview.md) is a cloud service that provides a secure store for cryptographic keys. You can securely store cryptographic keys, passwords, certificates, and other secrets. Azure key vaults may be created and managed through the Azure portal. In this quickstart, you learn how to create, retrieve, and delete keys from an Azure key vault using the .NET key client library

Key Vault key client library resources:

[API reference documentation](/dotnet/api/azure.security.keyvault.keys) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/keyvault) | [Package (NuGet)](https://www.nuget.org/packages/Azure.Security.KeyVault.keys/)

For more information about Key Vault and keys, see:
- [Key Vault Overview](../general/overview.md)
- [Keys Overview](about-keys.md).

## Prerequisites

* An Azure subscription - [create one for free](https://azure.microsoft.com/free/dotnet)
* [.NET Core 3.1 SDK or later](https://dotnet.microsoft.com/download/dotnet-core)
* [Azure CLI](/cli/azure/install-azure-cli)
* A Key Vault - you can create one using [Azure portal](../general/quick-create-portal.md), [Azure CLI](../general/quick-create-cli.md), or [Azure PowerShell](../general/quick-create-powershell.md).

## Setup

This quickstart is using Azure Identity library to authenticate user to Azure Services. Developers can also use Visual Studio or Visual Studio Code to authenticate their calls, for more information, see [Authenticate the client with Azure Identity client library](/dotnet/api/overview/azure/identity-readme?#authenticate-the-client&preserve-view=true).

### Sign in to Azure

1. Run the `login` command.

    # [Azure CLI](#tab/azure-cli)
    ```azurecli-interactive
    az login
    ```
    # [Azure PowerShell](#tab/azurepowershell)
    
    ```azurepowershell-interactive
    Connect-AzAccount
    ```
    ---

    If Azure CLI or Azure PowerShell can open your default browser, it will do so and load an Azure sign-in page.

    Otherwise, open a browser page at [https://aka.ms/devicelogin](https://aka.ms/devicelogin) and enter the
    authorization code displayed in your terminal.

2. Sign in with your account credentials in the browser.

#### Grant access to your key vault

Create an access policy for your key vault that grants key permissions to your user account

# [Azure CLI](#tab/azure-cli)
```azurecli-interactive
az keyvault set-policy --name <your-key-vault-name> --upn user@domain.com --key-permissions delete get list create purge
```
# [Azure PowerShell](#tab/azurepowershell)

```azurepowershell-interactive
Set-AzKeyVaultAccessPolicy -VaultName <your-key-vault-name> -UserPrincipalName user@domain.com -PermissionsToSecrets delete,get,list,set,purge
```
---

### Create new .NET console app

1. In a command shell, run the following command to create a project named `key-vault-console-app`:

    ```dotnetcli
    dotnet new console --name key-vault-console-app
    ```

1. Change to the newly created *key-vault-console-app* directory, and run the following command to build the project:

    ```dotnetcli
    dotnet build
    ```

    The build output should contain no warnings or errors.
    
    ```console
    Build succeeded.
     0 Warning(s)
     0 Error(s)
    ```

### Install the packages

From the command shell, install the Azure Key Vault key client library for .NET:

```dotnetcli
dotnet add package Azure.Security.KeyVault.Keys
```

For this quickstart, you'll also need to install the Azure SDK client library for Azure Identity:

```dotnetcli
dotnet add package Azure.Identity
```

#### Set environment variables

This application is using key vault name as an environment variable called `KEY_VAULT_NAME`.

Windows
```cmd
set KEY_VAULT_NAME=<your-key-vault-name>
````
Windows PowerShell
```azurepowershell
$Env:KEY_VAULT_NAME="<your-key-vault-name>"
```

macOS or Linux
```bash
export KEY_VAULT_NAME=<your-key-vault-name>
```

## Object model

The Azure Key Vault key client library for .NET allows you to manage keys. The [Code examples](#code-examples) section shows how to create a client, set a key, retrieve a key, and delete a key.

## Code examples

### Add directives

Add the following directives to the top of *Program.cs*:

```csharp
using System;
using Azure.Identity;
using Azure.Security.KeyVault.Keys;
```

### Authenticate and create a client

In this quickstart, logged in user is used to authenticate to key vault, which is preferred method for local development. For applications deployed to Azure, managed identity should be assigned to App Service or Virtual Machine, for more information, see [Managed Identity Overview](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview).

In below example, the name of your key vault is expanded to the key vault URI, in the format "https://\<your-key-vault-name\>.vault.azure.net". This example is using ['DefaultAzureCredential()'](/dotnet/api/azure.identity.defaultazurecredential) class from [Azure Identity Library](https://docs.microsoft.com/dotnet/api/overview/azure/identity-readme), which allows to use the same code across different environments with different options to provide identity. Fore more information about authenticating to key vault, see [Developer's Guide](https://docs.microsoft.com/azure/key-vault/general/developers-guide#authenticate-to-key-vault-in-code).

```csharp
var keyVaultName = Environment.GetEnvironmentVariable("KEY_VAULT_NAME");
var kvUri = "https://" + keyVaultName + ".vault.azure.net";

var client = new KeyClient(new Uri(kvUri), new DefaultAzureCredential());
```

### Save a key

For this task, use the [CreateKeyAsync](/dotnet/api/azure.security.keyvault.keys.keyclient.createkeyasync) method. The method's parameters accepts a key name and the [key type](https://docs.microsoft.com/dotnet/api/azure.security.keyvault.keys.keytype).

```csharp
var key = await client.CreateKeyAsync("myKey", KeyType.Rsa);
```

> [!NOTE]
> If key name exists, above code will create new version of that key.

### Retrieve a key

You can now retrieve the previously created key with the [GetKeyAsync](/dotnet/api/azure.security.keyvault.keys.keyclient.getkeyasync) method.

```csharp
var key = await client.GetKeyAsync("myKey");
```

### Delete a key

Finally, let's delete and purge the key from your key vault with the [StartDeleteKeyAsync](/dotnet/api/azure.security.keyvault.keys.keyclient.startdeletekeyasync) and [PurgeDeletedKeyAsync](/dotnet/api/azure.security.keyvault.keys.keyclient.purgedeletedkeyasync) methods.

```csharp
var operation = await client.StartDeleteKeyAsync("myKey");

// You only need to wait for completion if you want to purge or recover the key.
await operation.WaitForCompletionAsync();

var key = operation.Value;
await client.PurgeDeletedKeyAsync("myKey");
```

## Sample code

Modify the .NET Core console app to interact with the Key Vault by completing the following steps:

- Replace the code in *Program.cs* with the following code:

    ```csharp
    using System;
    using System.Threading.Tasks;
    using Azure.Identity;
    using Azure.Security.KeyVault.Keys;
    
    namespace key_vault_console_app
    {
        class Program
        {
            static async Task Main(string[] args)
            {
                const string keyName = "myKey";
                var keyVaultName = Environment.GetEnvironmentVariable("KEY_VAULT_NAME");
                var kvUri = $"https://{keyVaultName}.vault.azure.net";
    
                var client = new KeyClient(new Uri(kvUri), new DefaultAzureCredential());
    
                Console.Write($"Creating a key in {keyVaultName} called '{keyName}' ...");
                var createdKey = await client.CreateKeyAsync(keyName, KeyType.Rsa);
                Console.WriteLine("done.");
    
                Console.WriteLine($"Retrieving your key from {keyVaultName}.");
                var key = await client.GetKeyAsync(keyName);
                Console.WriteLine($"Your key version is '{key.Value.Properties.Version}'.");
    
                Console.Write($"Deleting your key from {keyVaultName} ...");
                var deleteOperation = await client.StartDeleteKeyAsync(keyName);
                // You only need to wait for completion if you want to purge or recover the key.
                await deleteOperation.WaitForCompletionAsync();
                Console.WriteLine("done.");

                Console.Write($"Purging your key from {keyVaultName} ...");
                await client.PurgeDeletedKeyAsync(keyName);
                Console.WriteLine(" done.");
            }
        }
    }
    ```
### Test and verify

1.  Execute the following command to build the project

    ```dotnetcli
    dotnet build
    ```

1. Execute the following command to run the app.

    ```dotnetcli
    dotnet run
    ```

1. When prompted, enter a secret value. For example, mySecretPassword.

    A variation of the following output appears:

    ```console
    Creating a key in mykeyvault called 'myKey' ... done.
    Retrieving your key from mykeyvault.
    Your key version is '8532359bced24e4bb2525f2d2050738a'.
    Deleting your key from jl-kv ... done
    Purging your key from <your-unique-keyvault-name> ... done.   
    ```

## Next steps

In this quickstart, you created a key vault, stored a key, and retrieved that key. 

To learn more about Key Vault and how to integrate it with your apps, see the following articles:

- Read an [Overview of Azure Key Vault](../general/overview.md)
- Read an [Overview of keys](about-keys.md)
- See an [Access Key Vault from App Service Application Tutorial](../general/tutorial-net-create-vault-azure-web-app.md)
- See an [Access Key Vault from Virtual Machine Tutorial](../general/tutorial-net-virtual-machine.md)
- See the [Azure Key Vault developer's guide](../general/developers-guide.md)
- Review the [Key Vault security overview](../general/security-features.md)
