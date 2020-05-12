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

Azure Key Vault helps safeguard cryptographic keys and secrets used by cloud applications and services. Use the Key Vault client library for .NET to:

- Increase security and control over keys and passwords.
- Create and import encryption keys in minutes.
- Reduce latency with cloud scale and global redundancy.
- Simplify and automate tasks for TLS/SSL certificates.
- Use FIPS 140-2 Level 2 validated HSMs.

[API reference documentation](/dotnet/api/overview/azure/key-vault?view=azure-dotnet) | [Library source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/keyvault) | [Package (NuGet)](https://www.nuget.org/packages/Microsoft.Azure.KeyVault/)

> [!NOTE]
> Each key vault must have a unique name. Replace <your-unique-keyvault-name> with the name of your key vault in the following examples.


## Prerequisites

* An Azure subscription - [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* The [.NET Core 3.1 SDK or later](https://dotnet.microsoft.com/download/dotnet-core/3.1).
* [Azure CLI](/cli/azure/install-azure-cli?view=azure-cli-latest) or [Azure PowerShell](/powershell/azure/overview)

This quickstart assumes you are running `dotnet`, [Azure CLI](/cli/azure/install-azure-cli?view=azure-cli-latest), and Windows commands in a Windows terminal (such as [PowerShell Core](/powershell/scripting/install/installing-powershell-core-on-windows?view=powershell-6), [Windows PowerShell](/powershell/scripting/install/installing-windows-powershell?view=powershell-6), or the [Azure Cloud Shell](https://shell.azure.com/)).

## Setting up

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

From the console window, install the Azure Key Vault client library for .NET:

```console
dotnet add package Microsoft.Azure.KeyVault
```

For this quickstart, you will need to install the following packages as well:

```console
dotnet add package System.Threading.Tasks
dotnet add package Microsoft.IdentityModel.Clients.ActiveDirectory
dotnet add package Microsoft.Azure.Management.ResourceManager.Fluent
```

### Create a resource group and key vault

This quickstart uses a pre-created Azure key vault. You can create a key vault by following the steps in the [Azure CLI quickstart](quick-create-cli.md), [Azure PowerShell quickstart](quick-create-powershell.md), or [Azure portal quickstart](quick-create-portal.md). Alternatively, you can simply run the Azure CLI commands below.

> [!Important]
> Each key vault must have a unique name. Replace <your-unique-keyvault-name> with the name of your key vault in the following examples.

```azurecli
az group create --name "myResourceGroup" -l "EastUS"

az keyvault create --name <your-unique-keyvault-name> -g "myResourceGroup"
```

### Create a service principal

The simplest way to authenticate a cloud-based .NET application is with a managed identity; see [Use an App Service managed identity to access Azure Key Vault](../general/managed-identity.md) for details. 

For the sake of simplicity however, this quickstart creates a .NET console application, which requires the use of a service principal and an access control policy. Your service principle requires a unique name in the format "http://&lt;my-unique-service-principle-name&gt;".

Create a service principle using the Azure CLI [az ad sp create-for-rbac](/cli/azure/ad/sp?view=azure-cli-latest#az-ad-sp-create-for-rbac) command:

```azurecli
az ad sp create-for-rbac -n "http://&lt;my-unique-service-principle-name&gt;" --sdk-auth
```

This operation will return a series of key / value pairs. 

```console
{
  "clientId": "7da18cae-779c-41fc-992e-0527854c6583",
  "clientSecret": "b421b443-1669-4cd7-b5b1-394d5c945002",
  "subscriptionId": "443e30da-feca-47c4-b68f-1636b75e16b3",
  "tenantId": "35ad10f1-7799-4766-9acf-f2d946161b77",
  "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
  "resourceManagerEndpointUrl": "https://management.azure.com/",
  "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
  "galleryEndpointUrl": "https://gallery.azure.com/",
  "managementEndpointUrl": "https://management.core.windows.net/"
}
```

Take note of the clientId and clientSecret, as we will use them in the [Authenticate to your key vault](#authenticate-to-your-key-vault) step below.

#### Give the service principal access to your key vault

Create an access policy for your key vault that grants permission to your service principal by passing the clientId to the [az keyvault set-policy](/cli/azure/keyvault?view=azure-cli-latest#az-keyvault-set-policy) command. Give the service principal get, list, and set permissions for both keys and secrets.

```azurecli
az keyvault set-policy -n <your-unique-keyvault-name> --spn <clientId-of-your-service-principal> --secret-permissions delete get list set --key-permissions create decrypt delete encrypt get list unwrapKey wrapKey
```

## Object model

The Azure Key Vault client library for .NET allows you to manage keys and related assets such as certificates and secrets. The code samples below will show you how to set a secret and retrieve a secret.

The entire console app is available at https://github.com/Azure-Samples/key-vault-dotnet-core-quickstart/tree/master/akvdotnet.

## Code examples

### Add directives

Add the following directives to the top of your code:

[!code-csharp[Directives](~/samples-key-vault-dotnet-quickstart/akvdotnet/Program.cs?name=directives)]

### Authenticate to your key vault

This .NET quickstart relies on environment variables to store credentials that should not be put in code. 

Before you build and run your app, use the `setx` command to set the `akvClientId`, `akvClientSecret`, `akvTenantId`, and `akvSubscriptionId` environment variables to the values you noted above.

**Windows**

```console
setx akvClientId "<your-clientID>"
setx akvClientSecret "<your-clientSecret>"
```

**Linux**

```bash
export akvClientId = "<your-clientID>"
export akvClientSecret = "<your-clientSecret>"
```

**MacOS**

```bash
export akvClientId = "<your-clientID>"
export akvClientSecret = "<your-clientSecret>"
```

Assign these environment variables to strings in your code, and then authenticate your application by passing them to the [KeyVaultClient class](/dotnet/api/microsoft.azure.keyvault.keyvaultclient):

[!code-csharp[Authentication](~/samples-key-vault-dotnet-quickstart/akvdotnet/Program.cs?name=authentication)]

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

## Next steps

In this quickstart you created a key vault, stored a secret, and retrieved that secret. See the [entire console app in GitHub](https://github.com/Azure-Samples/key-vault-dotnet-core-quickstart/tree/master/akvdotnet).

To learn more about Key Vault and how to integrate it with your applications, continue on to the articles below.

- Implement [Service-to-service authentication to Azure Key Vault using .NET](../general/service-to-service-authentication.md)
- Read an [Overview of Azure Key Vault](../general/overview.md)
- See the [Azure Key Vault developer's guide](../general/developers-guide.md)
- Review [Azure Key Vault best practices](../general/best-practices.md)
