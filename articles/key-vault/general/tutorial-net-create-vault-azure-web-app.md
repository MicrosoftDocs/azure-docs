---
title: Tutorial - Use Azure Key Vault with an Azure web app in .NET | Microsoft Docs
description: In this tutorial, you configure an ASP.NET core application to read a secret from your key vault.
services: key-vault
author: msmbaldwin
manager: rajvijan

ms.service: key-vault
ms.subservice: general
ms.topic: tutorial
ms.date: 12/21/2018
ms.author: mbaldwin
ms.custom: mvc
#Customer intent: As a developer I want to use Azure Key Vault to store secrets for my app, so that they are kept secure.
---
# Tutorial: Use Azure Key Vault with an Azure web app in .NET

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

This quickstart shows how to create a [.NET Core](https://docs.microsoft.com/aspnet/core/) webapp, and connect to an Azure Key Vault through the use of a Managed Identity. You will use the [Azure CLI](https://docs.microsoft.com/cli/azure/get-started-with-azure-cli) to create the app and Git to deploy the .NET Core code to the app.

You can follow the steps in this article using a Mac, Windows, or Linux machine.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

To complete this quickstart:

* An Azure subscription - [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* The [.NET Core 3.1 SDK or later](https://dotnet.microsoft.com/download/dotnet-core/3.1).
* [Azure CLI](/cli/azure/install-azure-cli?view=azure-cli-latest) or [Azure PowerShell](/powershell/azure/overview)

This quickstart assumes you are running `dotnet`, [Azure CLI](/cli/azure/install-azure-cli?view=azure-cli-latest), and Windows commands in a Windows terminal (such as [PowerShell Core](/powershell/scripting/install/installing-powershell-core-on-windows?view=powershell-6), [Windows PowerShell](/powershell/scripting/install/installing-windows-powershell?view=powershell-6), or the [Azure Cloud Shell](https://shell.azure.com/)).

## Create a resource group

A resource group is a logical container into which Azure resources are deployed and managed. 

Your first step is to create a resource group to house both your key vault and your web app. You can do so with the [az group create](/cli/azure/group?view=azure-cli-latest#az-group-create) command:

```azurecli
az group create --name "myResourceGroup" -l "EastUS"
```

## Set up your key vault

You will now create a key vault and place a secret in it, for use later in this quickstart.

To create a key vault, use the [az keyvault create](/cli/azure/keyvault?view=azure-cli-latest#az-keyvault-create) command:

> [!Important]
> Each key vault must have a unique name. Replace <your-unique-keyvault-name> with the name of your key vault in the following examples.

```azurecli
az keyvault create --name <your-unique-keyvault-name> -g "myResourceGroup"
```

You can now place a secret in your key vault with the [az keyvault secret set](/cli/azure/keyvault/secret?view=azure-cli-latest#az-keyvault-secret-set) command. Set the name of your secret to MySecret and the value to "Success!".

```azurecli
az keyvault secret set --vault-name <your-unique-keyvault-name> -name "MySecret" -value "Success!"
```

## Create a .NET web app

### Create a local app

In a terminal window on your machine, create a directory named `akvwebapp` and change the current directory to it.

```bash
mkdir akvwebapp
cd akvwebapp
```

Now create a new .NET Core app with the [dotnet new web](/dotnet/core/tools/dotnet-new) command:

```bash
dotnet new web
```

### Run the local app

Run the application locally so that you see how it should look when you deploy it to Azure. 

```bash
dotnet run
```

Open a web browser, and navigate to the app at `http://localhost:5000`.

You see the **Hello World** message from the sample app displayed in the page.

![Test with browser](media/quickstart-dotnetcore/dotnet-browse-local.png)

In your terminal window, press **Ctrl+C** to exit the web server. Initialize a Git repository for the .NET Core project.

```bash
git init
git add .
git commit -m "first commit"
```

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

[!INCLUDE [Configure deployment user](../../../includes/configure-deployment-user.md)]

[!INCLUDE [Create resource group](../../../includes/app-service-web-create-resource-group-linux.md)]

[!INCLUDE [Create app service plan](../../../includes/app-service-web-create-app-service-plan-linux.md)]

### Create a remote web app

[!INCLUDE [Create web app](../../../includes/app-service-web-create-web-app-dotnetcore-linux-no-h.md)]

Browse to your newly created app. Replace _&lt;app-name>_ with your app name.

```bash
https://<app-name>.azurewebsites.net
```

Here is what your new app should look like:

![Empty app page](media/quickstart-dotnetcore/dotnet-browse-created.png)

[!INCLUDE [Push to Azure](../../../includes/app-service-web-git-push-to-azure.md)] 

<pre>
Enumerating objects: 5, done.
Counting objects: 100% (5/5), done.
Compressing objects: 100% (3/3), done.
Writing objects: 100% (3/3), 285 bytes | 95.00 KiB/s, done.
Total 3 (delta 2), reused 0 (delta 0), pack-reused 0
remote: Deploy Async
remote: Updating branch 'master'.
remote: Updating submodules.
remote: Preparing deployment for commit id 'd6b54472f7'.
remote: Repository path is /home/site/repository
remote: Running oryx build...
remote: Build orchestrated by Microsoft Oryx, https://github.com/Microsoft/Oryx
remote: You can report issues at https://github.com/Microsoft/Oryx/issues
remote:
remote: Oryx Version      : 0.2.20200114.13, Commit: 204922f30f8e8d41f5241b8c218425ef89106d1d, ReleaseTagName: 20200114.13
remote: Build Operation ID: |imoMY2y77/s=.40ca2a87_
remote: Repository Commit : d6b54472f7e8e9fd885ffafaa64522e74cf370e1
.
.
.
remote: Deployment successful.
remote: Deployment Logs : 'https://&lt;app-name&gt;.scm.azurewebsites.net/newui/jsonviewer?view_url=/api/deployments/d6b54472f7e8e9fd885ffafaa64522e74cf370e1/log'
To https://&lt;app-name&gt;.scm.azurewebsites.net:443/&lt;app-name&gt;.git
   d87e6ca..d6b5447  master -> master
</pre>

### Browse to the app

Browse to the deployed application using your web browser.

```bash
http://<app_name>.azurewebsites.net
```

The .NET Core sample code is running in App Service on Linux with a built-in image.

![Sample app running in Azure](media/quickstart-dotnetcore/dotnet-browse-azure.png)


### Modify the app to access your key vault


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
