---
ms.topic: include
ms.date: 04/07/2026

ms.reviewer: jordanselig 
ms.custom: devx-track-azurecli
ms.service: azure-app-service
---

[Azure App Service](../../overview.md) can use [managed identities](../../overview-managed-identity.md) to connect to back-end services without a connection string. This approach eliminates the need to manage connection secrets and keeps your back-end connectivity secure in a production environment. For back-end services that don't support managed identities and still require connection secrets, you can use Key Vault to manage connection secrets. This tutorial uses Foundry Tools as an example to show you how it's done. When you're finished, you have an app that makes programmatic calls to Foundry Tools without storing any connection secrets inside App Service.

* [Sample application](https://github.com/Azure-Samples/app-service-language-detector)

> [!TIP]
> Foundry Tools do [support authentication via managed identities](/azure/ai-services/authentication#authorize-access-to-managed-identities). This tutorial uses [subscription key authentication](/azure/ai-services/authentication#authenticate-with-a-single-service-resource-key) to demonstrate how you can connect to an Azure service that doesn't support managed identities from App Services.

![Architecture diagram for tutorial scenario.](../../media/tutorial-connect-msi-key-vault/architecture.png)

In this architecture: 

- Connectivity to Key Vault is secured by managed identities.
- App Service accesses the secrets by using [Key Vault references](../../app-service-key-vault-references.md) as app settings.
- Access to the key vault is restricted to the app. App contributors, such as administrators, might have complete control of the App Service resources and at the same time have no access to the Key Vault secrets.
- If your application code already accesses connection secrets with app settings, no change is required.

What you will learn:

> [!div class="checklist"]
> * Enable managed identities
> * Use managed identities to connect to Key Vault
> * Use Key Vault references
> * Access Foundry Tools

## Prerequisites

Prepare your environment for the Azure CLI.

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

<a name='create-app-with-connectivity-to-cognitive-services'></a>

## Create an app with connectivity to Foundry Tools

1. Create a resource group to contain all of your resources:

    ```azurecli-interactive
    # Save the resource group name as a variable for convenience
    groupName=myKVResourceGroup
    region=canadacentral

    az group create --name $groupName --location $region
    ```

1. Create a Foundry Tools resource. Replace *\<cs-resource-name>* with a unique name.

    ```azurecli-interactive
    # Save the resource name as a variable for convenience. 
    csResourceName=<cs-resource-name>

    az cognitiveservices account create --resource-group $groupName --name $csResourceName --location $region --kind TextAnalytics --sku F0 --custom-domain $csResourceName
    ```

    > [!NOTE]
    > `--sku F0` creates a free-tier Foundry Tools resource. Each subscription is limited to a quota of one free-tier `TextAnalytics` resource. If you've already used your quota, use `--sku S` instead.
