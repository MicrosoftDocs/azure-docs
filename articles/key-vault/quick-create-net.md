---
title: Azure Quickstart - Configure an Azure web application to read a secret from Key vault | Microsoft Docs
description: Quickstart showing how to configure an ASP.Net core application to read a secret from Key vault
services: key-vault
author: prashanthyv
manager: sumedhb
ms.service: key-vault
ms.topic: quickstart
ms.date: 07/23/2018
ms.author: barclayn
ms.custom: mvc

#Customer intent: As a developer I want to use Azure Key vault to store secrets for my app, so that they are kept secure.
---

# Quickstart: Set and read a secret from Key Vault in a .NET Web App

In this quickstart, you go over the necessary steps for getting an Azure web application to read information from Key vault using managed service identities. You learn how to:

> [!div class="checklist"]
> * Create a Key Vault.
> * Store a secret in Key Vault.
> * Retrieve a secret from Key Vault.
> * Create an Azure Web Application.
> * [Enable managed service identities](../active-directory/managed-service-identity/overview.md).
> * Grant the required permissions for the web application to read data from Key vault.

Before we go any further, read the basic concepts especially [Managed Service Identity](../active-directory/managed-service-identity/overview.md)

## Prerequisites

* On Windows:
  * [Visual Studio 2017 version 15.7.3 or later](https://www.microsoft.com/net/download/windows) with the following workloads:
    * ASP.NET and web development
    * .NET Core cross-platform development
  * [.NET Core 2.1 SDK or later](https://www.microsoft.com/net/download/windows)

* On Mac:
  * https://visualstudio.microsoft.com/vs/mac/

* All platforms:
  * Download GIT from [here](https://git-scm.com/downloads).
  * An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
  * [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) You need Azure CLI version 2.0.4 or later. This is available for Windows, Mac, and Linux

## Login to Azure

   To log in to the Azure using the CLI, you can type:

```azurecli
az login
```

## Create a resource group

Create a resource group with the [az group create](/cli/azure/group#az_group_create) command. An Azure resource group is a logical container into which Azure resources are deployed and managed.

Please select a Resource Group name and fill in the placeholder.
The following example creates a resource group named *<YourResourceGroupName>* in the *eastus* location.

```azurecli
# To list locations: az account list-locations --output table
az group create --name "<YourResourceGroupName>" --location "East US"
```

The resource group you just created is used throughout this article.

## Create an Azure Key Vault

Next you create a Key Vault in the resource group created in the previous step. Provide the following information:

* Vault name - **Please Select a Key Vault Name here**. Key Vault name must be a string 3-24 characters in length containing only (0-9, a-z, A-Z, and -).
* Resource group name - **Please Select a Resource Group Name here**.
* The location - **East US**.

```azurecli
az keyvault create --name "<YourKeyVaultName>" --resource-group "<YourResourceGroupName>" --location "East US"
```

At this point, your Azure account is the only one authorized to perform any operations on this new vault.

## Add a secret to Key Vault

We're adding a secret to help illustrate how this works. You could be storing a SQL connection string or any other information that you need to keep securely but make available to your application. In this tutorial, the password will be called **AppSecret** and will store the value of **MySecret** in it.

Type the commands below to create a secret in Key Vault called **AppSecret** that will store the value **MySecret**:

```azurecli
az keyvault secret set --vault-name "<YourKeyVaultName>" --name "AppSecret" --value "MySecret"
```

To view the value contained in the secret as plain text:

```azurecli
az keyvault secret show --name "AppSecret" --vault-name "<YourKeyVaultName>"
```

This command shows the secret information including the URI. After completing these steps, you should have a URI to a secret in an Azure Key Vault. Make note of this information. You need it in a later step.

## Clone the repo

Clone the repo in order to make a local copy for you to edit the source by running the following command:

```
git clone https://github.com/Azure-Samples/key-vault-dotnet-core-quickstart.git
```

## Open and edit the solution

Edit the program.cs file in order to run the sample with your specific key vault name.

1. Navigate to the folder key-vault-dotnet-core-quickstart
2. Open the key-vault-dotnet-core-quickstart.sln file in Visual Studio 2017
3. Open Program.cs file and update the placeholder <YourKeyVaultName> with the name of your Key Vault that you created earlier.

This solution uses [AppAuthentication](https://www.nuget.org/packages/Microsoft.Azure.Services.AppAuthentication) and [KeyVault](https://www.nuget.org/packages/Microsoft.Azure.KeyVault) NuGet libraries

## Run the app

From the main menu of Visual Studio 2017, choose Debug > Start without Debugging. When the browser appears, navigate to the About page. The value for the AppSecret is displayed.

## Publish the web application to Azure

We are publishing this app to Azure to see it live as a web app and also see that we fetch the secret value

1. In Visual Studio, select **key-vault-dotnet-core-quickstart** Project.
2. Select **Publish** then **Start**.
3. Create a new **App Service**, select **Publish**.
4. Change the App Name to be "keyvaultdotnetcorequickstart"
5. Select **Create**.

## Enable Managed Service Identities (MSI)

Azure Key Vault provides a way to securely store credentials and other keys and secrets, but your code needs to authenticate to Azure Key Vault to retrieve them. Managed Service Identity (MSI) makes this easier by giving Azure services an automatically managed identity in Azure Active Directory (Azure AD). You can use this identity to authenticate to any service that supports Azure AD authentication, including Key Vault, without having any credentials in your code.

1. Return to the Azure CLI
2. Run the assign-identity command to create the identity for this application:

```azurecli
az webapp identity assign --name "keyvaultdotnetcorequickstart" --resource-group "<YourResourceGroupName>"
```

>[!NOTE]
>This command is the equivalent of going to the portal and switching **Managed service identity** to **On** in the web application properties.

## Assign permissions to your application to read secrets from Key Vault

Make a note of the output when you [publish the application to Azure][]. It should be of the format:
        
        {
          "principalId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          "tenantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          "type": "SystemAssigned"
        }
        
Then, run this command using the name of your Key Vault and the value of PrincipalId copied from above:

```azurecli

az keyvault set-policy --name '<YourKeyVaultName>' --object-id <PrincipalId> --secret-permissions get

```

## Next steps

* [Azure Key Vault Home Page](https://azure.microsoft.com/services/key-vault/)
* [Azure Key Vault Documentation](https://docs.microsoft.com/azure/key-vault/)
* [Azure SDK For .NET](https://github.com/Azure/azure-sdk-for-net)
* [Azure REST API Reference](https://docs.microsoft.com/rest/api/keyvault/)
