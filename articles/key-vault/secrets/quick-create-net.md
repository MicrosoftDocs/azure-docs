---
title: Quickstart - Azure Key Vault secrets client library for .NET
description: Learn how to create, retrieve, and delete secrets from an Azure key vault using the .NET client library
author: msmbaldwin
ms.author: mbaldwin
ms.date: 01/20/2023
ms.service: key-vault
ms.subservice: secrets
ms.topic: quickstart
ms.devlang: csharp
ms.custom: devx-track-csharp, mode-api, passwordless-dotnet, devx-track-dotnet
---

# Quickstart: Azure Key Vault secret client library for .NET

Get started with the Azure Key Vault secret client library for .NET. [Azure Key Vault](../general/overview.md) is a cloud service that provides a secure store for secrets. You can securely store keys, passwords, certificates, and other secrets. Azure key vaults may be created and managed through the Azure portal. In this quickstart, you learn how to create, retrieve, and delete secrets from an Azure key vault using the .NET client library

Key Vault client library resources:

[API reference documentation](/dotnet/api/azure.security.keyvault.secrets) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/keyvault) | [Package (NuGet)](https://www.nuget.org/packages/Azure.Security.KeyVault.Secrets/)

For more information about Key Vault and secrets, see:
- [Key Vault Overview](../general/overview.md)
- [Secrets Overview](about-secrets.md).

## Prerequisites

* An Azure subscription - [create one for free](https://azure.microsoft.com/free/dotnet)
* [.NET 6 SDK or later](https://dotnet.microsoft.com/download)
* [Azure CLI](/cli/azure/install-azure-cli) or [Azure PowerShell](/powershell/azure/install-azure-powershell)
* A Key Vault - you can create one using [Azure portal](../general/quick-create-portal.md), [Azure CLI](../general/quick-create-cli.md), or [Azure PowerShell](../general/quick-create-powershell.md)

This quickstart is using `dotnet` and Azure CLI or Azure PowerShell.

## Setup

### [Azure CLI](#tab/azure-cli)

This quickstart is using Azure Identity library with Azure CLI to authenticate user to Azure Services. Developers can also use Visual Studio or Visual Studio Code to authenticate their calls, for more information, see [Authenticate the client with Azure Identity client library](/dotnet/api/overview/azure/identity-readme?#authenticate-the-client&preserve-view=true).

### Sign in to Azure

1. Run the `az login` command.

    ```azurecli
    az login
    ```

    If the CLI can open your default browser, it will do so and load an Azure sign-in page.

    Otherwise, open a browser page at [https://aka.ms/devicelogin](https://aka.ms/devicelogin) and enter the
    authorization code displayed in your terminal.

2. Sign in with your account credentials in the browser.

### Grant access to your key vault

Create an access policy for your key vault that grants secret permissions to your user account

```azurecli
az keyvault set-policy --name <YourKeyVaultName> --upn user@domain.com --secret-permissions delete get list set purge
```

### [Azure PowerShell](#tab/azure-powershell)

This quickstart is using Azure Identity library with Azure PowerShell to authenticate user to Azure Services. Developers can also use Visual Studio or Visual Studio Code to authenticate their calls, for more information, see [Authenticate the client with Azure Identity client library](/dotnet/api/overview/azure/identity-readme?#authenticate-the-client&preserve-view=true).

### Sign in to Azure

1. Run the `Connect-AzAccount` command.

    ```azurepowershell
    Connect-AzAccount
    ```

    If the PowerShell can open your default browser, it will do so and load an Azure sign-in page.

    Otherwise, open a browser page at [https://aka.ms/devicelogin](https://aka.ms/devicelogin) and enter the
    authorization code displayed in your terminal.

2. Sign in with your account credentials in the browser.

### Grant access to your key vault

Create an access policy for your key vault that grants secret permissions to your user account

```azurepowershell
Set-AzKeyVaultAccessPolicy -VaultName "<YourKeyVaultName>" -UserPrincipalName "user@domain.com" -PermissionsToSecrets delete,get,list,set,purge
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

From the command shell, install the Azure Key Vault secret client library for .NET:

```dotnetcli
dotnet add package Azure.Security.KeyVault.Secrets
```

For this quickstart, you'll also need to install the Azure Identity client library:

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
```powershell
$Env:KEY_VAULT_NAME="<your-key-vault-name>"
```

macOS or Linux
```bash
export KEY_VAULT_NAME=<your-key-vault-name>
```

## Object model

The Azure Key Vault secret client library for .NET allows you to manage secrets. The [Code examples](#code-examples) section shows how to create a client, set a secret, retrieve a secret, and delete a secret.

## Code examples

### Add directives

Add the following directives to the top of *Program.cs*:

[!code-csharp[](~/samples-key-vault-dotnet-quickstart/key-vault-console-app/Program.cs?name=directives)]

### Authenticate and create a client

Application requests to most Azure services must be authorized. Using the [DefaultAzureCredential](/dotnet/azure/sdk/authentication#defaultazurecredential) class provided by the [Azure Identity client library](/dotnet/api/overview/azure/identity-readme) is the recommended approach for implementing passwordless connections to Azure services in your code. `DefaultAzureCredential` supports multiple authentication methods and determines which method should be used at runtime. This approach enables your app to use different authentication methods in different environments (local vs. production) without implementing environment-specific code. 

In this quickstart, `DefaultAzureCredential` authenticates to key vault using the credentials of the local development user logged into the Azure CLI. When the application is deployed to Azure, the same `DefaultAzureCredential` code can automatically discover and use a managed identity that is assigned to an App Service, Virtual Machine, or other services. For more information, see [Managed Identity Overview](/azure/active-directory/managed-identities-azure-resources/overview).

In this example, the name of your key vault is expanded to the key vault URI, in the format `https://<your-key-vault-name>.vault.azure.net`. For more information about authenticating to key vault, see [Developer's Guide](/azure/key-vault/general/developers-guide#authenticate-to-key-vault-in-code).

[!code-csharp[](~/samples-key-vault-dotnet-quickstart/key-vault-console-app/Program.cs?name=authenticate)]

### Save a secret

Now that the console app is authenticated, add a secret to the key vault. For this task, use the [SetSecretAsync](/dotnet/api/azure.security.keyvault.secrets.secretclient.setsecretasync) method. The method's first parameter accepts a name for the secret&mdash;"mySecret" in this sample.

```csharp
await client.SetSecretAsync(secretName, secretValue);
```

> [!NOTE]
> If secret name exists, the code will create new version of that secret.


### Retrieve a secret

You can now retrieve the previously set value with the [GetSecretAsync](/dotnet/api/azure.security.keyvault.secrets.secretclient.getsecretasync) method.

```csharp
var secret = await client.GetSecretAsync(secretName);
```

Your secret is now saved as `secret.Value`.

### Delete a secret

Finally, let's delete the secret from your key vault with the [StartDeleteSecretAsync](/dotnet/api/azure.security.keyvault.secrets.secretclient.startdeletesecretasync) and [PurgeDeletedSecretAsync](/dotnet/api/azure.security.keyvault.keys.keyclient) methods.

```csharp
var operation = await client.StartDeleteSecretAsync("mySecret");
// You only need to wait for completion if you want to purge or recover the key.
await operation.WaitForCompletionAsync();

await client.PurgeDeletedSecretAsync("mySecret");
```

## Sample code

Modify the .NET console app to interact with the Key Vault by completing the following steps:

1. Replace the code in *Program.cs* with the following code:

    ```csharp
    using System;
    using System.Threading.Tasks;
    using Azure.Identity;
    using Azure.Security.KeyVault.Secrets;
    
    namespace key_vault_console_app
    {
        class Program
        {
            static async Task Main(string[] args)
            {
                const string secretName = "mySecret";
                var keyVaultName = Environment.GetEnvironmentVariable("KEY_VAULT_NAME");
                var kvUri = $"https://{keyVaultName}.vault.azure.net";
    
                var client = new SecretClient(new Uri(kvUri), new DefaultAzureCredential());
    
                Console.Write("Input the value of your secret > ");
                var secretValue = Console.ReadLine();
    
                Console.Write($"Creating a secret in {keyVaultName} called '{secretName}' with the value '{secretValue}' ...");
                await client.SetSecretAsync(secretName, secretValue);
                Console.WriteLine(" done.");
    
                Console.WriteLine("Forgetting your secret.");
                secretValue = string.Empty;
                Console.WriteLine($"Your secret is '{secretValue}'.");
    
                Console.WriteLine($"Retrieving your secret from {keyVaultName}.");
                var secret = await client.GetSecretAsync(secretName);
                Console.WriteLine($"Your secret is '{secret.Value.Value}'.");
    
                Console.Write($"Deleting your secret from {keyVaultName} ...");
                DeleteSecretOperation operation = await client.StartDeleteSecretAsync(secretName);
                // You only need to wait for completion if you want to purge or recover the secret.
                await operation.WaitForCompletionAsync();
                Console.WriteLine(" done.");
                
                Console.Write($"Purging your secret from {keyVaultName} ...");
                await client.PurgeDeletedSecretAsync(secretName);
                Console.WriteLine(" done.");
            }
        }
    }
    ```
### Test and verify

1. Execute the following command to run the app.

    ```dotnetcli
    dotnet run
    ```

1. When prompted, enter a secret value. For example, mySecretPassword.

A variation of the following output appears:

```console
Input the value of your secret > mySecretPassword
Creating a secret in <your-unique-keyvault-name> called 'mySecret' with the value 'mySecretPassword' ... done.
Forgetting your secret.
Your secret is ''.
Retrieving your secret from <your-unique-keyvault-name>.
Your secret is 'mySecretPassword'.
Deleting your secret from <your-unique-keyvault-name> ... done.    
Purging your secret from <your-unique-keyvault-name> ... done.
```

## Next steps

To learn more about Key Vault and how to integrate it with your apps, see the following articles:

- Read an [Overview of Azure Key Vault](../general/overview.md)
- See an [Access Key Vault from App Service Application Tutorial](../general/tutorial-net-create-vault-azure-web-app.md)
- See an [Access Key Vault from Virtual Machine Tutorial](../general/tutorial-net-virtual-machine.md)
- See the [Azure Key Vault developer's guide](../general/developers-guide.md)
- Review the [Key Vault security overview](../general/security-features.md)
