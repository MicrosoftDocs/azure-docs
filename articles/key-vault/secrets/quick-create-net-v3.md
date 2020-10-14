---
title: Quickstart -  Azure Key Vault client library for .NET (SDK v3)
description: Learn how to create, retrieve, and delete secrets from an Azure key vault using the .NET client library (v3)
author: msmbaldwin
ms.author: mbaldwin
ms.date: 11/05/2019
ms.service: key-vault
ms.subservice: secrets
ms.topic: quickstart

---

# Quickstart: Azure Key Vault client library for .NET (SDK v3)

Get started with the Azure Key Vault client library for .NET. Follow the steps below to install the package and try out example code for basic tasks.

> [!NOTE]
> This quickstart uses the v3.0.4 version of the Microsoft.Azure.KeyVault client library. To use the most up-to-date version of the Key Vault client library, see [Azure Key Vault client library for .NET (SDK v4)](quick-create-net.md). 

[API reference documentation](https://docs.microsoft.com/dotnet/api/overview/azure/keyvault/v3) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/keyvault/Microsoft.Azure.KeyVault) | [Package (NuGet)](https://www.nuget.org/packages/Microsoft.Azure.KeyVault/)

> [!NOTE]
> Each key vault must have a unique name. Replace <your-unique-keyvault-name> with the name of your key vault in the following examples.


## Prerequisites

* An Azure subscription - [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* The [.NET Core 3.1 SDK or later](https://dotnet.microsoft.com/download/dotnet-core/3.1).
* [Azure CLI](/cli/azure/install-azure-cli)

This quickstart is using `dotnet` and Azure CLI

## Setting up

### Sign in to Azure

1. Run the `login` command.

    ```azurecli-interactive
    az login
    ```

    If the CLI can open your default browser, it will do so and load an Azure sign-in page.

    Otherwise, open a browser page at [https://aka.ms/devicelogin](https://aka.ms/devicelogin) and enter the
    authorization code displayed in your terminal.

2. Sign in with your account credentials in the browser.

### Create new .NET console app

In a console window, use the `dotnet new` command to create a new .NET console app with the name `akv-dotnet`.


```console
dotnet new console -n akvdotnet
```

Change your directory to the newly created app folder. You can build the application with:

```console
dotnet build
```

The build output should contain no warnings or errors.

```console
Build succeeded.
 0 Warning(s)
 0 Error(s)
```

### Install the package

From the console window, install the Azure Key Vault client library for .NET and [AppAuthentication](https://www.nuget.org/packages/Microsoft.Azure.Services.AppAuthentication) library:

```console
dotnet add package Microsoft.Azure.KeyVault
dotnet add package Microsoft.Azure.Services.AppAuthentication
```

For this quickstart, you will need to install the following packages as well:

```console
dotnet add package System.Threading.Tasks
dotnet add package Microsoft.IdentityModel.Clients.ActiveDirectory
dotnet add package Microsoft.Azure.Management.ResourceManager.Fluent
```

### Create a resource group and key vault

[!INCLUDE [Create a resource group and key vault](../../../includes/key-vault-rg-kv-creation.md)]

#### Grant access to your key vault

Create an access policy for your key vault that grants secret permission to your user account

```console
az keyvault set-policy --name <YourKeyVaultName> --upn user@domain.com --secret-permissions delete get list set
```

## Object model

The Azure Key Vault client library for .NET allows you to manage keys and related assets such as certificates and secrets. The code samples below will show you how to set a secret and retrieve a secret.

## Code examples

### Add directives

Add the following directives to the top of your code:

```csharp
using System;
using System.Threading.Tasks;
using Microsoft.Azure.KeyVault;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Microsoft.Azure.Management.ResourceManager.Fluent;
using Microsoft.Azure.Management.ResourceManager.Fluent.Authentication;
using Microsoft.Azure.Services.AppAuthentication;
```

### Authenticate to your key vault

Configure authentication to your application in [KeyVaultClient class](/dotnet/api/microsoft.azure.keyvault.keyvaultclient). In our example, it will use token provided by `AzureServiceTokenProvider` from currently logged in user:

```csharp
var azureServiceTokenProvider1 = new AzureServiceTokenProvider();
var kv = new KeyVaultClient(new KeyVaultClient.AuthenticationCallback(azureServiceTokenProvider1.KeyVaultTokenCallback));
```

For more information about `AzureServiceTokenProvider`, see [Authenticating to Azure Services](https://docs.microsoft.com/azure/key-vault/general/service-to-service-authentication#authenticating-to-azure-services)

### Save a secret

Now that your application is authenticated, you can put a secret into your keyvault using the [SetSecretAsync method](/dotnet/api/microsoft.azure.keyvault.keyvaultclientextensions.setsecretasync) This requires the URL of your key vault, which is in the form `https://<your-unique-keyvault-name>.vault.azure.net/secrets/`. It also requires a name for the secret -- we're using "mySecret". 

[!code-csharp[Set secret](~/samples-key-vault-dotnet-quickstart/akvdotnet/Program.cs?name=setsecret)]

You can verify that the secret has been set with the [az keyvault secret show](/cli/azure/keyvault/secret?view=azure-cli-latest#az-keyvault-secret-show) command:

```azurecli
az keyvault secret show --vault-name <your-unique-keyvault-name> --name mySecret
```

### Retrieve a secret

You can now retrieve the previously set value with the [GetSecretAsync method](/dotnet/api/microsoft.azure.keyvault.keyvaultclientextensions.getsecretasync)

[!code-csharp[Get secret](~/samples-key-vault-dotnet-quickstart/akvdotnet/Program.cs?name=getsecret)]

Your secret is now saved as `keyvaultSecret.Value;`.

## Clean up resources

When no longer needed, you can use the Azure CLI or Azure PowerShell to remove your key vault and the corresponding  resource group.

```azurecli
az group delete -g "myResourceGroup"
```

```azurepowershell
Remove-AzResourceGroup -Name "myResourceGroup"
```

## Sample code

Modify the .NET Core console app to interact with the Key Vault by completing the following steps:

1. Replace the code in *Program.cs* with the following code:
```csharp
using System;
using System.Threading.Tasks;
using Microsoft.Azure.KeyVault;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Microsoft.Azure.Services.AppAuthentication;
using Microsoft.Azure.Management.ResourceManager.Fluent;
using Microsoft.Azure.Management.ResourceManager.Fluent.Authentication;
// </directives>

namespace akvdotnet
{
    class Program
    {
        static async Task Main(string[] args)
        {
            Program P = new Program();
            string secretName = "mySecret";

            // kvURL must be updated to the URL of your key vault
            string kvURL = "https://myKV.vault.azure.net";

            // <authentication>

            var azureServiceTokenProvider1 = new AzureServiceTokenProvider();
            var kvClient = new KeyVaultClient(new KeyVaultClient.AuthenticationCallback(azureServiceTokenProvider1.KeyVaultTokenCallback));        
            // </authentication>


            Console.Write("Input the value of your secret > ");
            string secretValue = Console.ReadLine();

            Console.WriteLine("Your secret is '" + secretValue + "'.");

            Console.Write("Saving the value of your secret to your key vault ...");

            //set secret
            await kvClient.SetSecretAsync($"{kvURL}", secretName, secretValue);

            Console.WriteLine("done.");

            Console.WriteLine("Forgetting your secret.");
            secretValue = "";
            Console.WriteLine("Your secret is '" + secretValue + "'.");
            Console.WriteLine("Retrieving your secret from key vault.");

            //retrieve secret
            var keyvaultSecret = await kvClient.GetSecretAsync($"{kvURL}", secretName).ConfigureAwait(false);

            secretValue = keyvaultSecret.Result;
            Console.WriteLine("Your secret is " + secretValue);
        }
    }
}
```

## Next steps

To learn more about Key Vault and how to integrate it with your applications, continue on to the articles below.

- Implement [Service-to-service authentication to Azure Key Vault using .NET](../general/service-to-service-authentication.md)
- Read an [Overview of Azure Key Vault](../general/overview.md)
- See the [Azure Key Vault developer's guide](../general/developers-guide.md)
- Review [Azure Key Vault best practices](../general/best-practices.md)
