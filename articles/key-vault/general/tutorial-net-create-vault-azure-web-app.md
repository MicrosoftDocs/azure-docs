---
title: Tutorial - Use Azure Key Vault with an Azure webapp in .NET | Microsoft Docs
description: In this tutorial, you configure an ASP.NET core application to read a secret from your key vault.
services: key-vault
author: msmbaldwin
manager: rajvijan

ms.service: key-vault
ms.subservice: general
ms.topic: tutorial
ms.date: 05/06/2020
ms.author: mbaldwin

#Customer intent: As a developer I want to use Azure Key Vault to store secrets for my app, so that they are kept secure.

---

# Tutorial: Use a managed identity to connect Key Vault to an Azure Web App with .NET

Azure Key Vault provides a way to securely store credentials and other secrets, but your code needs to authenticate to Key Vault to retrieve them. [Managed identities for Azure resources overview](../../active-directory/managed-identities-azure-resources/overview.md) helps to solve this problem by giving Azure services an automatically managed identity in Azure AD. You can use this identity to authenticate to any service that supports Azure AD authentication, including Key Vault, without having to display credentials in your code.

This tutorial uses a managed identity to authenticate an Azure Web App with an Azure Key Vault. Although the steps use the [Azure Key Vault v4 client library for .NET](/dotnet/api/overview/azure/key-vault?view=azure-dotnet) and the [Azure CLI](/cli/azure/get-started-with-azure-cli), the same basic principles apply when using the development language of your choice, Azure PowerShell, and/or the Azure portal.

## Prerequisites

To complete this quickstart:

* An Azure subscription - [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* The [.NET Core 3.1 SDK or later](https://dotnet.microsoft.com/download/dotnet-core/3.1).
* [Azure CLI](/cli/azure/install-azure-cli?view=azure-cli-latest) or [Azure PowerShell](/powershell/azure/overview)

## Create a resource group

A resource group is a logical container into which Azure resources are deployed and managed. Create a resource group to house both your key vault and your web app with the [az group create](/cli/azure/group?view=azure-cli-latest#az-group-create) command:

```azurecli-interactive
az group create --name "myResourceGroup" -l "EastUS"
```

## Set up your key vault

You will now create a key vault and place a secret in it, for use later in this tutorial.

To create a key vault, use the [az keyvault create](/cli/azure/keyvault?view=azure-cli-latest#az-keyvault-create) command:

> [!Important]
> Each key vault must have a unique name. Replace <your-keyvault-name> with the name of your key vault in the following examples.

```azurecli-interactive
az keyvault create --name "<your-keyvault-name>" -g "myResourceGroup"
```

Make a note of the returned `vaultUri`, which will be in the format"https://<your-keyvault-name>.vault.azure.net/". It will be used in the [Update the code](#update-the-code) step.

You can now place a secret in your key vault with the [az keyvault secret set](/cli/azure/keyvault/secret?view=azure-cli-latest#az-keyvault-secret-set) command. Set the name of your secret to "MySecret" and the value to "Success!".

```azurecli-interactive
az keyvault secret set --vault-name "<your-keyvault-name>" --name "MySecret" --value "Success!"
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

Run the application locally so that you see how it should look when you deploy it to Azure. 

```bash
dotnet run
```

Open a web browser, and navigate to the app at `http://localhost:5000`.

You will see the **Hello World** message from the sample app displayed in the page.

### Initialize the Git repository

In your terminal window, press **Ctrl+C** to exit the web server.  Initialize a Git repository for the .NET Core project.

```bash
git init
git add .
git commit -m "first commit"
```

### Configure a deployment user

FTP and local Git can deploy to an Azure web app by using a *deployment user*. Once you configure your deployment user, you can use it for all your Azure deployments. Your account-level deployment username and password are different from your Azure subscription credentials. 

To configure the deployment user, run the [az webapp deployment user set](/cli/azure/webapp/deployment/user?view=azure-cli-latest#az-webapp-deployment-user-set) command. Choose a username and password that adheres to these guidelines: 

- The username must be unique within Azure, and for local Git pushes, must not contain the ‘@’ symbol. 
- The password must be at least eight characters long, with two of the following three elements: letters, numbers, and symbols. 

```azurecli-interactive
az webapp deployment user set --user-name "<username>" --password "<password>"
```

The JSON output shows the password as `null`. If you get a `'Conflict'. Details: 409` error, change the username. If you get a `'Bad Request'. Details: 400` error, use a stronger password. 

Record your username and password to use to deploy your web apps.

### Create an app service plan

Create an App Service plan with the Azure CLI [az appservice plan create](/cli/azure/appservice/plan?view=azure-cli-latest) command. This following example creates an App Service plan named `myAppServicePlan` in the **Free** pricing tier:

```azurecli-interactive
az appservice plan create --name myAppServicePlan --resource-group myResourceGroup --sku FREE
```

When the App Service plan has been created, the Azure CLI shows information similar to the following example:

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


### Create a remote web app

Create an [Azure web app](../../app-service/containers/app-service-linux-intro.md) in the `myAppServicePlan` App Service plan. 

> [!Important]
> Similar to Key Vault, an Azure Web App must have a unique name. Replace \<your-webapp-name\> with the name of your web app the following examples.


```azurecli-interactive
az webapp create --resource-group "myResourceGroup" --plan "myAppServicePlan" --name "<your-webapp-name>" --deployment-local-git
```

When the web app has been created, the Azure CLI shows output similar to the following example:

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


The URL of the Git remote is shown in the `deploymentLocalGitUrl` property, with the format `https://<username>@<your-webapp-name>.scm.azurewebsites.net/<your-webapp-name>.git`. Save this URL, as you need it later.

Browse to your newly created app. Replace _&lt;your-webapp-name>_ with your app name.

```bash
https://<your-webapp-name>.azurewebsites.net
```

You will see the default webpage for a newly created Azure Web App.

### Deploy your local app

Back in the local terminal window, add an Azure remote to your local Git repository, replacing *\<deploymentLocalGitUrl-from-create-step>* with the URL of the Git remote that you saved from [Create a remote web app](#create-a-remote-web-app) step.

```bash
git remote add azure <deploymentLocalGitUrl-from-create-step>
```

Push to the Azure remote to deploy your app with the following command. When Git Credential Manager prompts you for credentials, use the credentials you created in [Configure a deployment user](#configure-a-deployment-user) step.

```bash
git push azure master
```

This command may take a few minutes to run. While running, it displays information similar to the following example:
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
remote: Deployment Logs : 'https://&lt;your-webapp-name&gt;.scm.azurewebsites.net/newui/jsonviewer?view_url=/api/deployments/d6b54472f7e8e9fd885ffafaa64522e74cf370e1/log'
To https://&lt;your-webapp-name&gt;.scm.azurewebsites.net:443/&lt;your-webapp-name&gt;.git
   d87e6ca..d6b5447  master -> master
</pre>

Browse to (or refresh) the deployed application using your web browser.

```bash
http://<your-webapp-name>.azurewebsites.net
```

You will see the "Hello World!" message you previously saw when visiting `http://localhost:5000`.

## Create and assign a managed identity

In the Azure CLI, to create the identity for this application, run the [az webapp-identity assign](/cli/azure/webapp/identity?view=azure-cli-latest#az-webapp-identity-assign) command:

```azurecli-interactive
az webapp identity assign --name "<your-webapp-name>" --resource-group "myResourceGroup"
```

The operation will return this JSON snippet:

```json
{
  "principalId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "tenantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "type": "SystemAssigned"
}
```

To give your web app permission to do **get** and **list** operations on your key vault, pass the principalID to the Azure CLI [az keyvault set-policy](/cli/azure/keyvault?view=azure-cli-latest#az-keyvault-set-policy) command:

```azurecli-interactive
az keyvault set-policy --name "<your-keyvault-name>" --object-id "<principalId>" --secret-permissions get list
```


## Modify the app to access your key vault

### Install the packages

From the terminal window, install the Azure Key Vault client library for .NET packages:

```console
dotnet add package Azure.Identity
dotnet add package Azure.Security.KeyVault.Secrets
```

### Update the code

Find and open the Startup.cs file in your akvwebapp project. 

Add these two lines to the header:

```csharp
using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
```

Add these lines before the `app.UseEndpoints` call, updating the URI to reflect the `vaultUri` of your key vault. Below code is using  ['DefaultAzureCredential()'](/dotnet/api/azure.identity.defaultazurecredential?view=azure-dotnet) for authentication to key vault, which is using token from application managed identity to authenticate. It is also using exponential backoff for retries in case of key vault is being throttled.

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

KeyVaultSecret secret = client.GetSecret("mySecret");

string secretValue = secret.Value;
```

Update the line `await context.Response.WriteAsync("Hello World!");` to read:

```csharp
await context.Response.WriteAsync(secretValue);
```

Be certain to save your changes before proceeding to the next step.

### Redeploy your web app

Having updated your code, you can redeploy it to Azure with the following Git commands:

```bash
git add .
git commit -m "Updated web app to access my key vault"
git push azure master
```

## Visit your completed web app

```bash
http://<your-webapp-name>.azurewebsites.net
```

Where before you saw **Hello World**, you should now see the value of your secret displayed: **Success!**

## Next steps

- Learn more about [managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md)
- Learn more about [managed identities for App Service](../../app-service/overview-managed-identity.md?tabs=dotnet)
- See the [Azure Key Vault client library for .NET API reference](/dotnet/api/overview/azure/key-vault?view=azure-dotnet)
- See the [Azure Key Vault client library for .NET source code](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/keyvault)
- See the [v4 Azure Key Vault client library for .NET NuGet package](https://www.nuget.org/packages/Azure.Security.KeyVault.Secrets/)


