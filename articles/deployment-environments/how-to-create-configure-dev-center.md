---
title: Create and configure a dev center for Azure Deployment Environments by using the Azure CLI
titleSuffix: Azure Deployment Environments
description: Learn how to create and access an environment in an Azure Deployment Environments project using Azure CLI.
author: renato-marciano
ms.author: remarcia
ms.service: deployment-environments
ms.custom: devx-track-azurecli, build-2023
ms.topic: quickstart
ms.date: 04/28/2023
---

# Create and configure a dev center for Azure Deployment Environments by using the Azure CLI

This quickstart shows you how to create and configure a dev center in Azure Deployment Environments.

A platform engineering team typically sets up a dev center, attaches external catalogs to the dev center, creates projects, and provides access to development teams. Development teams create [environments](concept-environments-key-concepts.md#environments) by using [environment definitions](concept-environments-key-concepts.md#environment-definitions), connect to individual resources, and deploy applications.


## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Azure role-based access control role with permissions to create and manage resources in the subscription, such as [Contributor](../role-based-access-control/built-in-roles.md#contributor) or [Owner](../role-based-access-control/built-in-roles.md#owner).
- [Install the Azure CLI](/cli/azure/install-azure-cli).
- [Install dev center CLI extension](how-to-install-devcenter-cli-extension.md)
- A GitHub Account and a [Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) with Repo Access. 

## Create a dev center
To create and configure a Dev center in Azure Deployment Environments by using the Azure portal:

1. Sign in to the Azure CLI:

    ```azurecli
    az login
    ```

1. Install the Azure Dev Center extension for the CLI.

   ```azurecli
   az extension add --name devcenter --upgrade
   ```

1. Configure the default subscription as the subscription in which you want to create the dev center:

   ```azurecli
   az account set --subscription <name>
   ```

1. Configure the default location as the location in which you want to create the dev center. Make sure to choose an [available regions for Azure Deployment Environments](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=deployment-environments&regions=all):

   ```azurecli
   az configure --defaults location=eastus
   ```

1. Create the resource group in which you want to create the dev center:

   ```azurecli
   az group create -n <group name>
   ```

1. Configure the default resource group as the resource group you created:

   ```azurecli
   az config set defaults.group=<group name>
   ```

1. Create the dev center:

   ```azurecli
   az devcenter admin devcenter create -n <devcenter name>
   ```

   After a few minutes, you'll get an output that it's created:

   ```output
   {
      "devCenterUri": "https://...",
      "id": "/subscriptions/.../<devcenter name>",
      "location": "eastus",
      "name": "<devcenter name>",
      "provisioningState": "Succeeded",
      "resourceGroup": "<group name>",
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

## Adding personal access token to Key Vault
You need an Azure Key Vault to store the GitHub personal access token (PAT) that is used to grant Azure access to your GitHub repository. 

1. Create a Key Vault:

   ```azurecli
   # Change the name to something Globally unique
   az keyvault create -n <kv name>
   ```

   > [!NOTE]
   > You may get the following Error: 
   `Code: VaultAlreadyExists Message: The vault name 'kv-devcenter-unique' is already in use. Vault names are globally unique so it is possible that the name is already taken.` You must use a globally unique key vault name.

1. Add GitHub personal access token (PAT) to Key Vault as a secret:

   ```azurecli
   az keyvault secret set --vault-name <kv name> --name GHPAT --value <PAT> 
   ```

## Attach an identity to the dev center

After you create a dev center, attach an [identity](concept-environments-key-concepts.md#identities) to the dev center. You can attach either a system-assigned managed identity or a user-assigned managed identity. Learn about the two [types of identities](how-to-configure-managed-identity.md#add-a-managed-identity).

In this quickstart, you configure a system-assigned managed identity for your dev center. 

## Attach a system-assigned managed identity

To attach a system-assigned managed identity to your dev center:

   ```azurecli
   az devcenter admin devcenter update -n <devcenter name> --identity-type SystemAssigned
   ```

### Assign the system-assigned managed identity access to the key vault secret
Make sure that the identity has access to the key vault secret that contains the personal access token to access your repository. Key Vaults support two methods of access; Azure role-based access control or Vault access policy. In this quickstart, you use a vault access policy.

1. Retrieve Object ID of your dev center's identity:

    ```azurecli
   OID=$(az ad sp list --display-name <devcenter name> --query [].id -o tsv)
   echo $OID
   ```

1. Add a Key Vault Policy to allow dev center to get secrets from Key Vault:

   ```azurecli
   az keyvault set-policy -n <kv name> --secret-permissions get --object-id $OID
   ```

## Add a catalog to the dev center
Azure Deployment Environments supports attaching Azure DevOps repositories and GitHub repositories. You can store a set of curated IaC templates in a repository. Attaching the repository to a dev center as a catalog gives your development teams access to the templates and enables them to quickly create consistent environments.

In this quickstart, you attach a GitHub repository that contains samples created and maintained by the Azure Deployment Environments team.

To add a catalog to your dev center, you first need to gather some information.

### Gather GitHub repo information
To add a catalog, you must specify the GitHub repo URL, the branch, and the folder that contains your environment definitions. You can gather this information before you begin the process of adding the catalog to the dev center.

> [!TIP]
> If you are attaching an Azure DevOps repository, use these steps: [Get the clone URL of an Azure DevOps repository](how-to-configure-catalog.md#get-the-clone-url-for-your-azure-devops-repository).

1. On your [GitHub](https://github.com) account page, select **<> Code**, and then select copy.
1. Take a note of the branch that you're working in.
1. Take a note of the folder that contains your environment definitions. 
 
     :::image type="content" source="media/how-to-create-configure-dev-center/github-info.png" alt-text="Screenshot that shows the GitHub repo with Code, branch, and folder highlighted.":::

### Add a catalog to your dev center

1. Retrieve the secret identifier:
   
   ```azurecli
   SECRETID=$(az keyvault secret show --vault-name <kv name> --name GHPAT --query id -o tsv)
   echo $SECRETID
   ```

1. Add Catalog:

   ```azurecli
   # Sample Catalog example
   REPO_URL="https://github.com/Azure/deployment-environments.git"
   az devcenter admin catalog create --git-hub path="/Environments" branch="main" secret-identifier=$SECRETID uri=$REPO_URL -n <catalog name> -d <devcenter name>
   ```

1. Confirm that the catalog is successfully added and synced:

   ```azurecli
   az devcenter admin catalog list -d <devcenter name> -o table
   ```

## Create an environment type

Use an environment type to help you define the different types of environments your development teams can deploy. You can apply different settings for each environment type.

1. Create an Environment Type:

   ```azurecli
   az devcenter admin environment-type create -d <devcenter name> -n <environment type name> 
   ```

1. Confirm that the Environment type is created:

   ```azurecli
   az devcenter admin environment-type list -d <devcenter name> -o table 
   ```

## Next steps

In this quickstart, you created a dev center and configured it with an identity, a catalog, and an environment type. To learn how to create and configure a project, advance to the next quickstart.

> [!div class="nextstepaction"]
> [Create and configure a project with Azure CLI](how-to-create-configure-projects.md)
