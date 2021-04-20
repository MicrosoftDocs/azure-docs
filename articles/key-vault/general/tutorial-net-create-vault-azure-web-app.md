---
title: Tutorial - Use Azure Key Vault with an Azure web app in .NET 
description: In this tutorial, you'll configure an Azure web app in an ASP.NET Core application to read a secret from your key vault.
services: key-vault
author: msmbaldwin
manager: rajvijan

ms.service: key-vault
ms.subservice: general
ms.topic: tutorial
ms.date: 05/06/2020
ms.author: mbaldwin
ms.custom: devx-track-csharp, devx-track-azurecli

#Customer intent: As a developer, I want to use Azure Key Vault to store secrets for my app to help keep them secure.

---

# Tutorial: Use a managed identity to connect Key Vault to an Azure web app in .NET

[Azure Key Vault](./overview.md) provides a way to store credentials and other secrets with increased security. But your code needs to authenticate to Key Vault to retrieve them. [Managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md) help to solve this problem by giving Azure services an automatically managed identity in Azure Active Directory (Azure AD). You can use this identity to authenticate to any service that supports Azure AD authentication, including Key Vault, without having to display credentials in your code.

In this tutorial, you'll create and deploy Azure web application to [Azure App Service](../../app-service/overview.md). You'll  use a managed identity to authenticate your Azure web app with an Azure key vault using [Azure Key Vault secret client library for .NET](/dotnet/api/overview/azure/key-vault) and the [Azure CLI](/cli/azure/get-started-with-azure-cli). The same basic principles apply when you use the development language of your choice, Azure PowerShell, and/or the Azure portal.

For more information about Azure App service web applications and deployment presented in this tutorial, see:
- [App Service overview](../../app-service/overview.md)
- [Create an ASP.NET Core web app in Azure App Service](../../app-service/quickstart-dotnetcore.md)
- [Local Git deployment to Azure App Service](../../app-service/deploy-local-git.md)

## Prerequisites

To complete this tutorial, you need:

* An Azure subscription. [Create one for free.](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
* The [.NET Core 3.1 SDK (or later)](https://dotnet.microsoft.com/download/dotnet-core/3.1).
* A [Git](https://www.git-scm.com/downloads) installation of version 2.28.0 or greater.
* The [Azure CLI](/cli/azure/install-azure-cli) or [Azure PowerShell](/powershell/azure/).
* [Azure Key Vault.](./overview.md) You can create a key vault by using the [Azure portal](quick-create-portal.md), the [Azure CLI](quick-create-cli.md), or [Azure PowerShell](quick-create-powershell.md).
* A Key Vault [secret](../secrets/about-secrets.md). You can create a secret by using the [Azure portal](../secrets/quick-create-portal.md), [PowerShell](../secrets/quick-create-powershell.md), or the [Azure CLI](../secrets/quick-create-cli.md).

If you already have your web application deployed in Azure App Service, you can skip to [configure web app access to a key vault](#create-and-assign-a-managed-identity) and [modify web application code](#modify-the-app-to-access-your-key-vault) sections.

## Create a .NET Core app
In this step, you'll set up the local .NET Core project.

In a terminal window on your machine, create a directory named `akvwebapp` and make it the current directory:

```bash
mkdir akvwebapp
cd akvwebapp
```

Create a .NET Core app by using the [dotnet new web](/dotnet/core/tools/dotnet-new) command:

```bash
dotnet new web
```

Run the application locally so you know how it should look when you deploy it to Azure:

```bash
dotnet run
```

In a web browser, go to the app at `http://localhost:5000`.

You'll see the "Hello World!" message from the sample app displayed on the page.

For more information about creating web applications for Azure, see [Create an ASP.NET Core web app in Azure App Service](../../app-service/quickstart-dotnetcore.md)

## Deploy the app to Azure

In this step, you'll deploy your .NET Core application to Azure App Service by using local Git. For more information on how to create and deploy applications, see [Create an ASP.NET Core web app in Azure](../../app-service/quickstart-dotnetcore.md).

### Configure the local Git deployment

In the terminal window, select **Ctrl+C** to close the web server.  Initialize a Git repository for the .NET Core project:

```bash
git init --initial-branch=main
git add .
git commit -m "first commit"
```

You can use FTP and local Git to deploy an Azure web app by using a *deployment user*. After you configure your deployment user, you can use it for all your Azure deployments. Your account-level deployment user name and password are different from your Azure subscription credentials. 

To configure the deployment user, run the [az webapp deployment user set](/cli/azure/webapp/deployment/user?#az-webapp-deployment-user-set) command. Choose a user name and password that adheres to these guidelines: 

- The user name must be unique within Azure. For local Git pushes, it can't contain the at sign symbol (@). 
- The password must be at least eight characters long and contain two of the following three elements: letters, numbers, and symbols. 

```azurecli-interactive
az webapp deployment user set --user-name "<username>" --password "<password>"
```

The JSON output shows the password as `null`. If you get a `'Conflict'. Details: 409` error, change the user name. If you get a `'Bad Request'. Details: 400` error, use a stronger password. 

Record your user name and password so you can use it to deploy your web apps.

### Create a resource group

A resource group is a logical container into which you deploy Azure resources and manage them. Create a resource group to contain both your key vault and your web app by using the [az group create](/cli/azure/group?#az-group-create) command:

```azurecli-interactive
az group create --name "myResourceGroup" -l "EastUS"
```

### Create an App Service plan

Create an [App Service plan](../../app-service/overview-hosting-plans.md) by using the Azure CLI [az appservice plan create](/cli/azure/appservice/plan) command. This following example creates an App Service plan named `myAppServicePlan` in the `FREE` pricing tier:

```azurecli-interactive
az appservice plan create --name myAppServicePlan --resource-group myResourceGroup --sku FREE
```

When the App Service plan is created, the Azure CLI displays information similar to what you see here:

<pre>
{ 
  "adminSiteName": null,
  "appServicePlanName": "myAppServicePlan",
  "geoRegion": "West Europe",
  "hostingEnvironmentProfile": null,
  "id": "/subscriptions/0000-0000/resourceGroups/myResourceGroup/providers/Microsoft.Web/serverfarms/myAppServicePlan",
  "kind": "app",
  "location": "West Europe",
  "maximumNumberOfWorkers": 1,
  "name": "myAppServicePlan",
  &lt; JSON data removed for brevity. &gt;
  "targetWorkerSizeId": 0,
  "type": "Microsoft.Web/serverfarms",
  "workerTierName": null
} 
</pre>

For more information, see [Manage an App Service plan in Azure](../../app-service/app-service-plan-manage.md).

### Create a web app

Create an [Azure web app](../../app-service/overview.md) in the `myAppServicePlan` App Service plan. 

> [!Important]
> Like a key vault, an Azure web app must have a unique name. Replace `<your-webapp-name>` with the name of your web app in the following examples.


```azurecli-interactive
az webapp create --resource-group "myResourceGroup" --plan "myAppServicePlan" --name "<your-webapp-name>" --deployment-local-git
```

When the web app is created, the Azure CLI shows output similar to what you see here:

<pre>
Local git is configured with url of 'https://&lt;username&gt;@&lt;your-webapp-name&gt;.scm.azurewebsites.net/&lt;ayour-webapp-name&gt;.git'
{
  "availabilityState": "Normal",
  "clientAffinityEnabled": true,
  "clientCertEnabled": false,
  "clientCertExclusionPaths": null,
  "cloningInfo": null,
  "containerSize": 0,
  "dailyMemoryTimeQuota": 0,
  "defaultHostName": "&lt;your-webapp-name&gt;.azurewebsites.net",
  "deploymentLocalGitUrl": "https://&lt;username&gt;@&lt;your-webapp-name&gt;.scm.azurewebsites.net/&lt;your-webapp-name&gt;.git",
  "enabled": true,
  &lt; JSON data removed for brevity. &gt;
}
</pre>

The URL of the Git remote is shown in the `deploymentLocalGitUrl` property, in the format `https://<username>@<your-webapp-name>.scm.azurewebsites.net/<your-webapp-name>.git`. Save this URL. You'll need it later.

Now configure your web app to deploy from the `main` branch:

```azurecli-interactive
 az webapp config appsettings set -g MyResourceGroup -name "<your-webapp-name>"--settings deployment_branch=main
```

Go to your new app by using the following command. Replace `<your-webapp-name>` with your app name.

```bash
https://<your-webapp-name>.azurewebsites.net
```

You'll see the default webpage for a new Azure web app.

### Deploy your local app

Back in the local terminal window, add an Azure remote to your local Git repository. In the following command, replace `<deploymentLocalGitUrl-from-create-step>` with the URL of the Git remote that you saved in the [Create a web app](#create-a-web-app) section.

```bash
git remote add azure <deploymentLocalGitUrl-from-create-step>
```

Use the following command to push to the Azure remote to deploy your app. When Git Credential Manager prompts you for credentials, use the credentials you created in the [Configure the local Git deployment](#configure-the-local-git-deployment) section.

```bash
git push azure main
```

This command might take a few minutes to run. While it runs, it displays information similar to what you see here:
<pre>
Enumerating objects: 5, done.
Counting objects: 100% (5/5), done.
Compressing objects: 100% (3/3), done.
Writing objects: 100% (3/3), 285 bytes | 95.00 KiB/s, done.
Total 3 (delta 2), reused 0 (delta 0), pack-reused 0
remote: Deploy Async
remote: Updating branch 'main'.
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
remote: Deployment Logs : 'https://&lt;your-webapp-name&gt;.scm.azurewebsites.net/newui/jsonviewer?view_url=/api/deployments/d6b54472f7e8e9fd885ffafaa64522e74cf370e1/log'
To https://&lt;your-webapp-name&gt;.scm.azurewebsites.net:443/&lt;your-webapp-name&gt;.git
   d87e6ca..d6b5447  main -> main
</pre>

Go to (or refresh) the deployed application by using your web browser:

```bash
http://<your-webapp-name>.azurewebsites.net
```

You'll see the "Hello World!" message you saw earlier when you visited `http://localhost:5000`.

For more information about deploying web application using Git, see [Local Git deployment to Azure App Service](../../app-service/deploy-local-git.md)
 
## Configure the web app to connect to Key Vault

In this section, you'll configure web access to Key Vault and update your application code to retrieve a secret from Key Vault.

### Create and assign a managed identity

In this tutorial, we'll use [managed identity](../../active-directory/managed-identities-azure-resources/overview.md) to authenticate to Key Vault. Managed identity automatically manages application credentials.

In the Azure CLI, to create the identity for the application, run the [az webapp-identity assign](/cli/azure/webapp/identity?#az-webapp-identity-assign) command:

```azurecli-interactive
az webapp identity assign --name "<your-webapp-name>" --resource-group "myResourceGroup"
```

The command will return this JSON snippet:

```json
{
  "principalId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "tenantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "type": "SystemAssigned"
}
```

To give your web app permission to do **get** and **list** operations on your key vault, pass the `principalId` to the Azure CLI [az keyvault set-policy](/cli/azure/keyvault?#az-keyvault-set-policy) command:

```azurecli-interactive
az keyvault set-policy --name "<your-keyvault-name>" --object-id "<principalId>" --secret-permissions get list
```

You can also assign access policies by using the [Azure portal](./assign-access-policy-portal.md) or [PowerShell](./assign-access-policy-powershell.md).

### Modify the app to access your key vault

In this tutorial, you'll use [Azure Key Vault secret client library](/dotnet/api/overview/azure/security.keyvault.secrets-readme) for demonstration purposes. You can also use [Azure Key Vault certificate client library](/dotnet/api/overview/azure/security.keyvault.certificates-readme), or [Azure Key Vault key client library](/dotnet/api/overview/azure/security.keyvault.keys-readme).

#### Install the packages

From the terminal window, install the Azure Key Vault secret client library for .NET and Azure Identity client library packages:

```console
dotnet add package Azure.Identity
dotnet add package Azure.Security.KeyVault.Secrets
```

#### Update the code

Find and open the Startup.cs file in your akvwebapp project. 

Add these lines to the header:

```csharp
using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
using Azure.Core;
```

Add the following lines before the `app.UseEndpoints` call, updating the URI to reflect the `vaultUri` of your key vault. This code uses  [DefaultAzureCredential()](/dotnet/api/azure.identity.defaultazurecredential) to authenticate to Key Vault, which uses a token from managed identity to authenticate. For more information about authenticating to Key Vault, see the [Developer's Guide](./developers-guide.md#authenticate-to-key-vault-in-code). The code also uses exponential backoff for retries in case Key Vault is being throttled. For more information about Key Vault transaction limits, see [Azure Key Vault throttling guidance](./overview-throttling.md).

```csharp
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
var client = new SecretClient(new Uri("https://<your-unique-key-vault-name>.vault.azure.net/"), new DefaultAzureCredential(),options);

KeyVaultSecret secret = client.GetSecret("<mySecret>");

string secretValue = secret.Value;
```

Update the line `await context.Response.WriteAsync("Hello World!");` to look like this line:

```csharp
await context.Response.WriteAsync(secretValue);
```

Be sure to save your changes before continuing to the next step.

#### Redeploy your web app

Now that you've updated your code, you can redeploy it to Azure by using these Git commands:

```bash
git add .
git commit -m "Updated web app to access my key vault"
git push azure main
```

## Go to your completed web app

```bash
http://<your-webapp-name>.azurewebsites.net
```

Where before you saw "Hello World!", you should now see the value of your secret displayed.

## Next steps

- [Use Azure Key Vault with applications deployed to a virtual machine in .NET](./tutorial-net-virtual-machine.md)
- Learn more about [managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md)
- View the [Developer's Guide](./developers-guide.md)
- [Secure access to a key vault](./security-overview.md)