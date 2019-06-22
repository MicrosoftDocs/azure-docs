---
title: Quickstart - Set and retrieve a secret from Azure Key Vault by using a Node web app | Microsoft Docs
description: In this quickstart, you set and retrieve a secret from Azure Key Vault by using a Node web app 
services: key-vault
author: msmbaldwin
manager: sumedhb

ms.service: key-vault
ms.topic: quickstart
ms.date: 09/05/2018
ms.author: barclayn
ms.custom: mvc
#Customer intent: As a developer, I want to use Azure Key Vault to store secrets for my app, so that they are kept secure.
---

# Quickstart: Set and retrieve a secret from Azure Key Vault by using a Node web app 

This quickstart shows you how to store a secret in Azure Key Vault and how to retrieve it by using a web app. Using Key Vault helps keep the information secure. To see the secret value, you would have to run this quickstart on Azure. The quickstart uses Node.js and managed identities for Azure resources. You learn how to:

* Create a key vault.
* Store a secret in the key vault.
* Retrieve a secret from the key vault.
* Create an Azure web application.
* Enable a [managed identity](https://docs.microsoft.com/azure/active-directory/managed-service-identity/overview) for the web app.
* Grant the required permissions for the web application to read data from the key vault.

Before you proceed, make sure that you're familiar with the [basic concepts for Key Vault](key-vault-whatis.md#basic-concepts).

> [!NOTE]
> Key Vault is a central repository to store secrets programmatically. But to do so, applications and users need to first authenticate to Key Vault--that is, present a secret. In keeping with security best practices, this first secret needs to be rotated periodically. 
>
> With [managed service identities for Azure resources](../active-directory/managed-identities-azure-resources/overview.md), applications that run in Azure get an identity that Azure manages automatically. This helps solve the *secret introduction problem* so that users and applications can follow best practices and not have to worry about rotating the first secret.

## Prerequisites

* [Node.js](https://nodejs.org/en/)
* [Git](https://www.git-scm.com/)
* [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) 2.0.4 or later. This quickstart requires that you run the Azure CLI locally. Run `az --version` to find the version. If you need to install or upgrade the CLI, see [Install Azure CLI 2.0](https://review.docs.microsoft.com/en-us/cli/azure/install-azure-cli?branch=master&view=azure-cli-latest).
* An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Log in to Azure

To log in to Azure by using the Azure CLI, enter:

```azurecli
az login
```

## Create a resource group

Create a resource group by using the [az group create](/cli/azure/group#az-group-create) command. An Azure resource group is a logical container into which Azure resources are deployed and managed.

Select a resource group name and fill in the placeholder.
The following example creates a resource group in the East US location.

```azurecli
# To list locations: az account list-locations --output table
az group create --name "<YourResourceGroupName>" --location "East US"
```

The resource group that you just created is used throughout this article.

## Create a key vault

Next you create a key vault by using the resource group that you created in the previous step. Although this article uses “ContosoKeyVault” as the name, you have to use a unique name. Provide the following information:

* Key vault name.
* Resource group name. The name must be a string of 3-24 characters and must contain only 0-9, a-z, A-Z, and a hyphen (-).
* Location: **East US**.

```azurecli
az keyvault create --name "<YourKeyVaultName>" --resource-group "<YourResourceGroupName>" --location "East US"
```

At this point, your Azure account is the only one that's authorized to perform any operations on this new vault.

## Add a secret to the key vault

We're adding a secret to help illustrate how this works. You might be storing a SQL connection string or any other information that you need to keep securely but make available to your application. In this tutorial, the password will be called **AppSecret** and will store the value of **MySecret** in it.

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
git clone https://github.com/Azure-Samples/key-vault-node-quickstart.git
```

## Install dependencies

Run the following commands to install dependencies:

```
cd key-vault-node-quickstart
npm install
```

This project uses two Node modules: [ms-rest-azure](https://www.npmjs.com/package/ms-rest-azure) and [azure-keyvault](https://www.npmjs.com/package/azure-keyvault).

## Publish the web app to Azure

Create an [Azure App Service](https://azure.microsoft.com/services/app-service/) plan. You can store multiple web apps in this plan.

    ```
    az appservice plan create --name myAppServicePlan --resource-group myResourceGroup
    ```
Next, create a web app. In the following example, replace `<app_name>` with a globally unique app name (valid characters are a-z, 0-9, and -). The runtime is set to NODE|6.9. To see all supported runtimes, run `az webapp list-runtimes`.

    ```
    # Bash
    az webapp create --resource-group myResourceGroup --plan myAppServicePlan --name <app_name> --runtime "NODE|6.9" --deployment-local-git
    ```
When the web app has been created, the Azure CLI shows output similar to the following example:

    ```
    {
      "availabilityState": "Normal",
      "clientAffinityEnabled": true,
      "clientCertEnabled": false,
      "cloningInfo": null,
      "containerSize": 0,
      "dailyMemoryTimeQuota": 0,
      "defaultHostName": "<app_name>.azurewebsites.net",
      "enabled": true,
      "deploymentLocalGitUrl": "https://<username>@<app_name>.scm.azurewebsites.net/<app_name>.git"
      < JSON data removed for brevity. >
    }
    ```
Browse to your newly created web app, and you should see that it's functioning. Replace `<app_name>` with a unique app name.

    ```
    http://<app name>.azurewebsites.net
    ```
The preceding command also creates a Git-enabled app that enables you to deploy to Azure from your local Git repository. The local Git repo is configured with this URL: `https://<username>@<app_name>.scm.azurewebsites.net/<app_name>.git`.

After you finish the preceding command, you can add an Azure remote to your local Git repository. Replace `<url>` with the URL of the Git repo.

    ```
    git remote add azure <url>
    ```

## Enable a managed identity for the web app

Azure Key Vault provides a way to securely store credentials and other keys and secrets, but your code needs to authenticate to Key Vault to retrieve them. [Managed identities for Azure resources overview](../active-directory/managed-identities-azure-resources/overview.md) makes solving this problem simpler, by giving Azure services an automatically managed identity in Azure Active Directory (Azure AD). You can use this identity to authenticate to any service that supports Azure AD authentication, including Key Vault, without having any credentials in your code.

Run the assign-identity command to create the identity for this application:

```azurecli
az webapp identity assign --name <app_name> --resource-group "<YourResourceGroupName>"
```

This command is the equivalent of going to the portal and switching the **Identity / System assigned** setting to **On** in the web application properties.

### Assign permissions to your application to read secrets from Key Vault

Make note of the output of the previous command. It should be in the format:
        
        {
          "principalId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          "tenantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          "type": "SystemAssigned"
        }
        
Then, run the following command by using the name of your key vault and the value of **principalId**:

```azurecli
az keyvault set-policy --name '<YourKeyVaultName>' --object-id <PrincipalId> --secret-permissions get set
```

## Deploy the Node app to Azure and retrieve the secret value

Run the following command to deploy the app to Azure:

```
git push azure master
```

After this, when you browse to `https://<app_name>.azurewebsites.net`, you can see the secret value. Make sure that you replaced the name `<YourKeyVaultName>` with your vault name.

## Next steps

> [!div class="nextstepaction"]
> [Azure SDK for Node](https://docs.microsoft.com/javascript/api/overview/azure/key-vault)
