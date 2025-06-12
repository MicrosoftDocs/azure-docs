---
title: Create and configure a dev center for Azure Deployment Environments by using the Azure CLI
titleSuffix: Azure Deployment Environments
description: Learn how to create and configure a dev center for an Azure Deployment Environments project by using the Azure CLI.
author: renato-marciano
ms.author: remarcia
ms.service: azure-deployment-environments
ms.custom: devx-track-azurecli, build-2023
ms.topic: quickstart
ms.date: 03/20/2025

#customer intent: As a platform engineer, I want to create and configure a dev center so that my teams can deploy applications.
---

# Create and configure a dev center for Azure Deployment Environments by using the Azure CLI

In this quickstart, you create and configure a dev center in Azure Deployment Environments.

A platform engineering team typically sets up a dev center, attaches external catalogs to the dev center, creates projects, and provides access to development teams. Development teams can then create [environments](concept-environments-key-concepts.md#environments) by using [environment definitions](concept-environments-key-concepts.md#environment-definitions), connect to individual resources, and deploy applications.

## Prerequisites

|Category|Requirements|
|-|-|
|Azure|- An [Azure subscription](https://azure.microsoft.com/free/).<br>- An Azure role-based access control role that has permissions to create and manage resources in the subscription, such as [Contributor](../role-based-access-control/built-in-roles.md#contributor) or [Owner](../role-based-access-control/built-in-roles.md#owner).<br>-The [Azure CLI devcenter extension](how-to-install-devcenter-cli-extension.md).|
|GitHub|A GitHub account and a [personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) with repo access.| 

## Create a dev center

To create and configure a dev center in Azure Deployment Environments:

1. Sign in to the Azure CLI:

    ```azurecli
    az login
    ```

1. Install the Azure CLI *devcenter* extension.

   ```azurecli
   az extension add --name devcenter --upgrade
   ```

1. Configure the default subscription as the subscription in which you want to create the dev center:

   ```azurecli
   az account set --subscription <subscriptionName>
   ```

1. Configure the default location where you want to create the dev center. Make sure to choose a [region that supports Azure Deployment Environments](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=deployment-environments&regions=all).

   ```azurecli
   az configure --defaults location=eastus
   ```

1. Create the resource group in which you want to create the dev center:

   ```azurecli
   az group create -n <resourceGroupName>
   ```

1. Configure the default resource group as the resource group you created:

   ```azurecli
   az config set defaults.group=<resourceGroupName>
   ```

1. Create the dev center:

   ```azurecli
   az devcenter admin devcenter create -n <devcenterName>
   ```

   After a few minutes, the output indicates that the dev center was created:

   ```output
   {
      "devCenterUri": "https://...",
      "id": "/subscriptions/.../<devcenterName>",
      "location": "eastus",
      "name": "<devcenter name>",
      "provisioningState": "Succeeded",
      "resourceGroup": "<resourceGroupName>",
      "systemData": {
         "createdAt": "...",
         "createdBy": "...",
         ...
      },
      "type": "microsoft.devcenter/devcenters"
   }
   ```

> [!NOTE]
> You can use `--help` to view more details about any command, accepted arguments, and examples. For example, use `az devcenter admin devcenter create --help` to view more details about creating a dev center.

## Add a personal access token to Azure Key Vault

You need an Azure Key Vault to store the GitHub personal access token (PAT) that's used to grant Azure access to your GitHub repository.

1. Create a key vault:

   ```azurecli
   # Use a globally unique name
   az keyvault create -n <keyvaultName>
   ```

   > [!NOTE]
   > You might get the following error: 
   `Code: VaultAlreadyExists Message: The vault name 'kv-devcenter' is already in use. Vault names are globally unique so it is possible that the name is already taken.` You must use a globally unique key vault name.

1. Assign yourself the Key Vault Secrets Officer RBAC role:

   ```azurecli
   az role assignment create --assignee <YourPrincipalId> --role "Key Vault Secrets Officer" --scope /subscriptions/<YourSubscriptionId>/resourceGroups/<YourResourceGroupName>/providers/Microsoft.KeyVault/vaults/<YourKeyVaultName>
   
1. Add the GitHub PAT to Key Vault as a secret:

   ```azurecli
   az keyvault secret set --vault-name <keyvaultName> --name GHPAT --value <personalAccessToken> 
   ```

## Attach an identity to the dev center

After you create a dev center, attach an [identity](concept-environments-key-concepts.md#identities) to the dev center. You can attach either a system-assigned managed identity or a user-assigned managed identity. For information, see [Add a managed identity](how-to-configure-managed-identity.md#add-a-managed-identity).

In this quickstart, you configure a system-assigned managed identity for your dev center. 

### Attach a system-assigned managed identity

Attach a system-assigned managed identity to your dev center:

   ```azurecli
   az devcenter admin devcenter update -n <devcenterName> --identity-type SystemAssigned
   ```

### Grant the system-assigned managed identity access to the key vault secret

Make sure that the identity has access to the key vault secret that contains the GitHub PAT for accessing your repository. Key vaults support two methods of access: Azure role-based access control (RBAC) and vault access policy. In this quickstart, you use RBAC:

```azurecli
az role assignment create --role "Key Vault Secrets Officer" --assignee <devCenterManagedIdentityObjectID> --scope /subscriptions/<subscriptionID>/resourcegroups/<resourceGroupName>/providers/Microsoft.KeyVault/vaults/<keyVaultName>
```

## Add a catalog to the dev center

Azure Deployment Environments supports attaching Azure DevOps repositories and GitHub repositories. You can store a set of curated IaC templates in a repository. Attaching the repository to a dev center as a catalog grants your development teams access to the templates and allows them to quickly create consistent environments.

In this quickstart, you attach a GitHub repository that contains samples created and maintained by the Azure Deployment Environments team.

To add a catalog to your dev center, you first need to gather some information.

### Gather GitHub repo information

To add a catalog, you must specify the GitHub repo URL, the branch, and the folder that contains your environment definitions. You can gather this information before you begin the process of adding the catalog to the dev center.

You can use this [sample catalog](https://github.com/Azure/deployment-environments) as your repository. Make a fork of the repository for the following steps.

> [!TIP]
> If you're attaching an Azure DevOps repository, use these steps: [Get the clone URL of an Azure DevOps repository](how-to-configure-catalog.md#get-the-clone-url-for-your-azure-repos-repository).

1. Navigate to your repository, select **<> Code**, and then copy the clone URL.
1. Make a note of the branch that you're working in.
1. Make a note of the folder that contains your environment definitions. 

     :::image type="content" source="media/how-to-create-configure-dev-center/github-info.png" alt-text="Screenshot that shows the GitHub repo with branch, copy URL, and folder highlighted." lightbox="media/how-to-create-configure-dev-center/github-info.png":::

### Add a catalog to your dev center

1. Retrieve the secret identifier:

   ```azurecli
   $SECRETID = az keyvault secret show --vault-name <keyvaultName> --name GHPAT --query id -o tsv
   Write-Output $SECRETID
   ```

1. Add the catalog:

   ```azurecli
   # Sample catalog example
   $REPO_URL = "<clone URL that you copied earlier>"
   az devcenter admin catalog create --git-hub path="/Environments" branch="main" secret-identifier=$SECRETID uri=$REPO_URL -n <catalogName> -d <devcenterName>
   ```

1. Confirm that the catalog was successfully added and synced:

   ```azurecli
   az devcenter admin catalog list -d <devcenterName> -o table
   ```

## Create an environment type

Use an environment type to help you define the different types of environments your development teams can deploy. You can apply different settings for each environment type.

1. Create an environment type:

   ```azurecli
   az devcenter admin environment-type create -d <devcenterName> -n <environmentTypeName> 
   ```

1. Confirm that the environment type was created:

   ```azurecli
   az devcenter admin environment-type list -d <devcenterName> -o table 
   ```

## Next step

In this quickstart, you created a dev center and configured it with an identity, a catalog, and an environment type. To learn how to create and configure a project, go to the next quickstart:

> [!div class="nextstepaction"]
> [Create and configure a project by using the Azure CLI](how-to-create-configure-projects.md)
