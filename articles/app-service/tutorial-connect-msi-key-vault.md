---
title: 'Tutorial: Connect to Azure services securely with Key Vault'
description: Learn how to secure connectivity to back-end Azure services that don't support managed identity natively.
ms.devlang: dotnet
ms.topic: tutorial
ms.date: 10/26/2021

ms.reviewer: madsd
---

# Tutorial: Secure Cognitive Service connection from App Service using Key Vault

[Azure App Service](overview.md) can use [managed identities](overview-managed-identity.md) to connect to back-end services without a connection string, which eliminates connection secrets to manage and keeps your back-end connectivity secure in a production environment. For back-end services that don't support managed identities and still requires connection secrets, you can use Key Vault to manage connection secrets. This tutorial uses Cognitive Services as an example to show you how it's done in practice. When you're finished, you have an app that makes programmatic calls to Cognitive Services, without storing any connection secrets inside App Service.

> [!TIP]
> Azure Cognitive Services do [support authentication through managed identities](../cognitive-services/authentication.md#authorize-access-to-managed-identities), but this tutorial uses the [subscription key authentication](../cognitive-services/authentication.md#authenticate-with-a-single-service-subscription-key) to demonstrate how you could connect to an Azure service that doesn't support managed identities from App Services.

![Architecture diagram for tutorial scenario.](./media/tutorial-connect-msi-key-vault/architecture.png)

With this architecture: 

- Connectivity to Key Vault is secured by managed identities
- App Service accesses the secrets using [Key Vault references](app-service-key-vault-references.md) as app settings.
- Access to the key vault is restricted to the app. App contributors, such as administrators, may have complete control of the App Service resources, and at the same time have no access to the Key Vault secrets.
- If your application code already accesses connection secrets with app settings, no change is required.

What you will learn:

> [!div class="checklist"]
> * Enable managed identities
> * Use managed identities to connect to Key Vault
> * Use Key Vault references
> * Access Cognitive Services

## Prerequisites

Prepare your environment for the Azure CLI.

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](../../includes/azure-cli-prepare-your-environment-no-header.md)]

## Create app with connectivity to Cognitive Services

1. Create a resource group to contain all of your resources:

    ```azurecli-interactive
    # Save resource group name as variable for convenience
    groupName=myKVResourceGroup
    region=westeurope

    az group create --name $groupName --location $region
    ```

1. Create a Cognitive Services resource. Replace *\<cs-resource-name>* with a unique name of your choice.

    ```azurecli-interactive
    # Save resource name as variable for convenience. 
    csResourceName=<cs-resource-name>

    az cognitiveservices account create --resource-group $groupName --name $csResourceName --location $region --kind TextAnalytics --sku F0 --custom-domain $csResourceName
    ```

    > [!NOTE]
    > `--sku F0` creates a free tier Cognitive Services resource. Each subscription is limited to a quota of one free-tier `TextAnalytics` resource. If you're already over the quota, use `--sku S` instead.

1. Clone the sample repository locally and deploy the sample application to App Service. Replace *\<app-name>* with a unique name.

    ### [.NET 5](#tab/dotnet)

    ```azurecli-interactive
    # Save app name as variable for convenience
    appName=<app-name>

    # Clone sample application
    git clone https://github.com/Azure-Samples/app-service-language-detector.git
    cd app-service-language-detector/dotnet
    
    az webapp up --sku F1 --resource-group $groupName --name $appName --plan $appName --location $region
    ```

    ### [PHP](#tab/php)

    ```azurecli-interactive
    # Clone and prepare sample application
    git clone https://github.com/Azure-Samples/app-service-language-detector.git
    cd app-service-language-detector/php
    zip default.zip index.php
    
    # Save app name as variable for convenience
    appName=<app-name>

    az appservice plan create --resource-group $groupName --name $appName --sku FREE --location $region
    az webapp create --resource-group $groupName --plan $appName --name $appName
    az webapp deployment source config-zip --resource-group $groupName --name $appName --src ./default.zip
    ```

    -----

1. Configure the Cognitive Services secrets as app settings `CS_ACCOUNT_NAME` and `CS_ACCOUNT_KEY`.

    ```azurecli-interactive
    # Get subscription key for Cognitive Services resource
    csKey1=$(az cognitiveservices account keys list --resource-group $groupName --name $csResourceName --query key1 --output tsv)

    az webapp config appsettings set --resource-group $groupName --name $appName --settings CS_ACCOUNT_NAME="$csResourceName" CS_ACCOUNT_KEY="$csKey1"
    ````

1. In the browser, navigate to your deploy app at `<app-name>.azurewebsites.net` and try out the language detector with strings in various languages.

    ![Screenshot that shows deployed language detector app in App Service.](./media/tutorial-connect-msi-key-vault/deployed-app.png)

    If you look at the application code, you may notice the debug output for the detection results in the same font color as the background. You can see it by trying to highlight the white space directly below the result.

## Secure back-end connectivity

At the moment, connection secrets are stored as app settings in your App Service app. This approach is already securing connection secrets from your application codebase. However, any contributor who can manage your app can also see the app settings. In this step, you move the connection secrets to a key vault, and lock down access so that only you can manage it and only the App Service app can read it using its managed identity.

1. Create a key vault. Replace *\<vault-name>* with a unique name.

    ```azurecli-interactive
    # Save app name as variable for convenience
    vaultName=<vault-name>

    az keyvault create --resource-group $groupName --name $vaultName --location $region --sku standard --enable-rbac-authorization
    ```

    The `--enable-rbac-authorization` parameter [sets Azure role-based access control (RBAC) as the permission model](../key-vault/general/rbac-guide.md#using-azure-rbac-secret-key-and-certificate-permissions-with-key-vault). This setting by default invalidates all access policies permissions.

1. Give yourself the *Key Vault Secrets Officer* RBAC role for the vault.
    
    ```azurecli-interactive
    vaultResourceId=$(az keyvault show --name $vaultName --query id --output tsv)
    myId=$(az ad signed-in-user show --query objectId --output tsv)
    az role assignment create --role "Key Vault Secrets Officer" --assignee-object-id $myId --assignee-principal-type User --scope $vaultResourceId
    ```

1. Enable the system-assigned managed identity for your app, and give it the *Key Vault Secrets User* RBAC role for the vault.

    ```azurecli-interactive
    az webapp identity assign --resource-group $groupName --name $appName --scope $vaultResourceId --role  "Key Vault Secrets User"
    ```

1. Add the Cognitive Services resource name and subscription key as secrets to the vault, and save their IDs as environment variables for the next step.

    ```azurecli-interactive
    csResourceKVUri=$(az keyvault secret set --vault-name $vaultName --name csresource --value $csResourceName --query id --output tsv)
    csKeyKVUri=$(az keyvault secret set --vault-name $vaultName --name cskey --value $csKey1 --query id --output tsv)
    ```

1. Previously, you set the secrets as app settings `CS_ACCOUNT_NAME` and `CS_ACCOUNT_KEY` in your app. Now, set them as [key vault references](app-service-key-vault-references.md) instead.

    ```azurecli-interactive
    az webapp config appsettings set --resource-group $groupName --name $appName --settings CS_ACCOUNT_NAME="@Microsoft.KeyVault(SecretUri=$csResourceKVUri)" CS_ACCOUNT_KEY="@Microsoft.KeyVault(SecretUri=$csKeyKVUri)"
    ```

1. In the browser, navigate to `<app-name>.azurewebsites.net` again. If you get detection results back, then you're connecting to the Cognitive Services endpoint with key vault references.

Congratulations, your app is now connecting to Cognitive Services using secrets kept in your key vault, without any changes to your application code.

## Clean up resources

In the preceding steps, you created Azure resources in a resource group. If you don't expect to need these resources in the future, delete the resource group by running the following command in the Cloud Shell:

```azurecli-interactive
az group delete --name $groupName
```

This command may take a minute to run.

## Next steps

- [Tutorial: Isolate back-end communication with Virtual Network integration](tutorial-networking-isolate-vnet.md)
- [Integrate your app with an Azure virtual network](overview-vnet-integration.md)
- [App Service networking features](networking-features.md)