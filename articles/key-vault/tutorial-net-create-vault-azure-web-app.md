---
title: Tutorial: How to use Azure Key Vault with Azure Web App in .NET | Microsoft Docs
description: Tutorial Configure an ASP.Net core application to read a secret from Key vault
services: key-vault
documentationcenter: 
author: pryerram
manager: rajvijan

ms.assetid: 0e57f5c7-6f5a-46b7-a18a-043da8ca0d83
ms.service: key-vault
ms.workload: identity
ms.topic: tutorial
ms.date: 09/05/2018
ms.author: pryerram
ms.custom: mvc
#Customer intent: As a developer I want to use Azure Key vault to store secrets for my app, so that they are kept secure.
---
# Tutorial: Part 1 - How to use Azure Key Vault with Azure Web App in .NET

Azure Key Vault helps you to protect secrets such as API Keys, Database Connection strings needed to access your applications, services, and IT resources.

In this tutorial, you follow the necessary steps for getting an Azure web application to read information from Azure Key Vault by using managed identities for Azure resources. This tutorial is based on [Azure Web Apps](../articles/app-service/app-service-web-overview.md). You learn how to:

> [!div class="checklist"]
> * Create a key vault.
> * Store a secret in the key vault.
> * Retrieve a secret from the key vault.
> * Create an Azure web application.
> * Enable a [managed identity](../active-directory/managed-identities-azure-resources/overview.md) for the web app.
> * Grant the required permissions for the web application to read data from the key vault.
> * Run the Web Application on Azure

Before we go any further, please read the [basic concepts](key-vault-whatis.md#basic-concepts).

> [!NOTE]
> Key Vault is a central repository to store secrets programmatically. But to do so, applications and users need to first authenticate to Key Vault--that is, present a secret. To follow security best practices, this first secret needs to be rotated periodically. 
>
> With [managed service identities for Azure resources](../active-directory/managed-identities-azure-resources/overview.md), applications that run in Azure are given an identity that Azure manages automatically. This helps solve the *secret introduction problem* so that users and applications can follow best practices and not have to worry about rotating the first secret.

## Prerequisites

* On Windows:
  * .NET Core cross-platform development
  * [.NET Core 2.1 SDK or later](https://www.microsoft.com/net/download/windows)

* On Mac:
  * See [What’s New in Visual Studio for Mac](https://visualstudio.microsoft.com/vs/mac/).

* All platforms:
  * Git ([download](https://git-scm.com/downloads)).
  * An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
  * [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) version 2.0.4 or later. This is available for Windows, Mac, and Linux.
  * [.NET Core](https://www.microsoft.com/net/download/dotnet-core/2.1)

## What is Managed Service Identity and how does it work?
 Azure Key Vault can store credentials securely so they aren’t in your code, but to retrieve them you need to authenticate to Azure Key Vault. To authenticate to Key Vault, you need a credential! A classic bootstrap problem. Through the magic of Azure and Azure AD, MSI provides a “bootstrap identity” that makes it much simpler to get things started.

Here’s how it works! When you enable MSI for an Azure service such as Virtual Machines, App Service, or Functions, Azure creates a [Service Principal](key-vault-whatis#basic-concepts) for the instance of the service in Azure Active Directory, and injects the credentials for the Service Principal into the instance of the service. 

![MSI](media/MSI.png)

Next, Your code calls a local MSI endpoint (http://localhost:PORTNO) available on the Azure resource to get an access token.
Your code uses the access token it gets from the local MSI ENDPOINT to authenticate to an Azure Key Vault service. 

Now let's begin the tutorial

## Log in to Azure

To log in to Azure by using the Azure CLI, enter:

```azurecli
az login
```

## Create a resource group

Create a resource group by using the [az group create](/cli/azure/group#az-group-create) command. An Azure resource group is a logical container into which Azure resources are deployed and managed.

Select a resource group name and fill in the placeholder.
The following example creates a resource group in the East US location:

```azurecli
# To list locations: az account list-locations --output table
az group create --name "<YourResourceGroupName>" --location "East US"
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

To view the value contained in the secret as plain text:

```azurecli
az keyvault secret show --name "AppSecret" --vault-name "<YourKeyVaultName>"
```

This command shows the secret information, including the URI. After you complete these steps, you should have a URI to a secret in a key vault. Make note of this information. You'll need it in a later step.

## Clone the repo

Clone the repo to make a local copy where you can edit the source. Run the following command:

```
git clone https://github.com/Azure-Samples/key-vault-dotnet-core-quickstart.git
```

## Open and edit the solution

Edit the program.cs file to run the sample with your specific key vault name:

1. Browse to the folder key-vault-dotnet-core-quickstart.
2. Open the key-vault-dotnet-core-quickstart.sln file in Visual Studio 2017 **OR** open the folder in Visual Studio Code
3. Open the Program.cs file and update the placeholder *YourKeyVaultName* with the name of your key vault that you created earlier.

This solution uses [AppAuthentication](https://www.nuget.org/packages/Microsoft.Azure.Services.AppAuthentication) and [KeyVault](https://www.nuget.org/packages/Microsoft.Azure.KeyVault) NuGet libraries.

## Run the app

From the main menu of Visual Studio 2017, select **Debug** > **Start** without debugging. When the browser appears, go to the **About** page. The value for **AppSecret** is displayed.

## Publish the web application to Azure

Publish this app to Azure to see it live as a web app, and to see that you can fetch the secret value:

1. In Visual Studio, select the **key-vault-dotnet-core-quickstart** project.
2. Select **Publish** > **Start**.
3. Create a new **App Service**, and then select **Publish**.
4. Change the app name to **keyvaultdotnetcorequickstart**.
5. Select **Create**.

>[!VIDEO https://sec.ch9.ms/ch9/e93d/a6ac417f-2e63-4125-a37a-8f34bf0fe93d/KeyVault_high.mp4]

## Enable a managed identity for the web app

Azure Key Vault provides a way to securely store credentials and other keys and secrets, but your code needs to authenticate to Key Vault to retrieve them. [Managed identities for Azure resources overview](../active-directory/managed-identities-azure-resources/overview.md) makes solving this problem simpler, by giving Azure services an automatically managed identity in Azure Active Directory (Azure AD). You can use this identity to authenticate to any service that supports Azure AD authentication, including Key Vault, without having any credentials in your code.

1. Return to the Azure CLI.
2. Run the assign-identity command to create the identity for this application:

   ```azurecli
   az webapp identity assign --name "keyvaultdotnetcorequickstart" --resource-group "<YourResourceGroupName>"
   ```

>[!NOTE]
>The command in this procedure is the equivalent of going to the portal and switching the **Identity / System assigned** setting to **On** in the web application properties.

## Assign permissions to your application to read secrets from Key Vault

Make a note of the output when you publish the application to Azure. It should be of the format:
        
        {
          "principalId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          "tenantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          "type": "SystemAssigned"
        }
        
Then, run this command by using the name of your key vault and the value of **PrincipalId**:

```azurecli

az keyvault set-policy --name '<YourKeyVaultName>' --object-id <PrincipalId> --secret-permissions get list

```

Now when you run the application, you should see your secret value retrieved. In the above command you are giving the Identity(MSI) of the App Service permissions to do **get** and **list** operations on your Key Vault