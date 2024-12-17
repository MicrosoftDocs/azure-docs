---
title: 'Quickstart: Create an Azure Synapse Analytics workspace using Azure CLI'
description: Create an Azure Synapse Analytics workspace using the Azure CLI by following the steps in this article.
author: WilliamDAssafMSFT
ms.service: azure-synapse-analytics
ms.topic: quickstart
ms.subservice: workspace
ms.date: 02/04/2022
ms.author: wiassaf
ms.reviewer: whhender
ms.custom: mode-api, devx-track-azurecli
---

# Quickstart: Create an Azure Synapse Analytics workspace with the Azure CLI

The Azure CLI is Azure's command-line experience for managing Azure resources. You can use it in your browser with Azure Cloud Shell. You can also install it on macOS, Linux, or Windows and run it from the command line.

In this quickstart, you learn how to create an Azure Synapse Analytics workspace by using the Azure CLI.

[!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]

## Prerequisites

- Download and install [jq](https://stedolan.github.io/jq/download/), a lightweight and flexible command-line JSON processor.
- [Azure Data Lake Storage Gen2 storage account](../storage/common/storage-account-create.md).

    > [!IMPORTANT]
    > An Azure Synapse Analytics workspace needs to be able to read and write to the selected Data Lake Storage Gen2 account. In addition, for any storage account that you link as the primary storage account, you must have enabled **hierarchical namespace** at the creation of the storage account, as described in [Create a storage account](../storage/common/storage-account-create.md?tabs=azure-portal#create-a-storage-account).

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

## Create an Azure Synapse Analytics workspace by using the Azure CLI

1. Define necessary environment variables to create resources for an Azure Synapse Analytics workspace.

    | Environment Variable name | Description |
    |---|---|---|
    |StorageAccountName| Name for your existing Data Lake Storage Gen2 storage account.|
    |StorageAccountResourceGroup| Name of your existing Data Lake Storage Gen2 storage account resource group. |
    |FileShareName| Name of your existing storage file system.|
    |SynapseResourceGroup| Choose a new name for your Azure Synapse Analytics resource group. |
    |Region| Choose one of the [Azure regions](https://azure.microsoft.com/global-infrastructure/geographies/#overview). |
    |SynapseWorkspaceName| Choose a unique name for your new Azure Synapse Analytics workspace. |
    |SqlUser| Choose a value for a new username.|
    |SqlPassword| Choose a secure password.|
    |||

1. Create a resource group as a container for your Azure Synapse Analytics workspace:

    ```azurecli
    az group create --name $SynapseResourceGroup --location $Region
    ```

1. Create an Azure Synapse Analytics workspace:

    ```azurecli
    az synapse workspace create \
      --name $SynapseWorkspaceName \
      --resource-group $SynapseResourceGroup \
      --storage-account $StorageAccountName \
      --file-system $FileShareName \
      --sql-admin-login-user $SqlUser \
      --sql-admin-login-password $SqlPassword \
      --location $Region
    ```

1. Get the web and dev URLs for the Azure Synapse Analytics workspace:

    ```azurecli
    WorkspaceWeb=$(az synapse workspace show --name $SynapseWorkspaceName --resource-group $SynapseResourceGroup | jq -r '.connectivityEndpoints | .web')

    WorkspaceDev=$(az synapse workspace show --name $SynapseWorkspaceName --resource-group $SynapseResourceGroup | jq -r '.connectivityEndpoints | .dev')
    ```

1. Create a firewall rule to allow access to your Azure Synapse Analytics workspace from your machine:

    ```azurecli
    ClientIP=$(curl -sb -H "Accept: application/json" "$WorkspaceDev" | jq -r '.message')
    ClientIP=${ClientIP##'Client Ip address : '}
    echo "Creating a firewall rule to enable access for IP address: $ClientIP"

    az synapse workspace firewall-rule create --end-ip-address $ClientIP --start-ip-address $ClientIP --name "Allow Client IP" --resource-group $SynapseResourceGroup --workspace-name $SynapseWorkspaceName
    ```

1. Open the Azure Synapse Analytics workspace web URL address stored in the environment variable `WorkspaceWeb` to access your workspace:

    ```azurecli
    echo "Open your Azure Synapse Workspace Web URL in the browser: $WorkspaceWeb"
    ```
    
    :::image type="content" source="media/quickstart-create-synapse-workspace-cli/create-workspace-cli-1.png" alt-text="Screenshot that shows the Azure Synapse Analytics workspace web." lightbox="media/quickstart-create-synapse-workspace-cli/create-workspace-cli-1.png":::

1. After it's deployed, more permissions are required:

   - In the Azure portal, assign other users of the workspace to the Contributor role in the workspace. For more information, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.yml).
   - Assign other users the appropriate [Azure Synapse Analytics role-based access control roles](security/synapse-workspace-synapse-rbac-roles.md) by using Synapse Studio.
   - A member of the Owner role of the Azure Storage account must assign the Storage Blob Data Contributor role to the Azure Synapse Analytics workspace managed service identity and other users.

## Clean up resources

Follow these steps to delete the Azure Synapse Analytics workspace.

> [!WARNING]
> Deleting an Azure Synapse Analytics workspace removes the analytics engines and the data stored in the database of the contained SQL pools and workspace metadata. It will no longer be possible to connect to the SQL or Apache Spark endpoints. All code artifacts will be deleted (queries, notebooks, job definitions, and pipelines).
>
> Deleting the workspace won't affect the data in the Data Lake Storage Gen2 account linked to the workspace.

If you want to delete the Azure Synapse Analytics workspace, complete the following command:

```azurecli
az synapse workspace delete --name $SynapseWorkspaceName --resource-group $SynapseResourceGroup
```

## Related content

Next, you can [create SQL pools](quickstart-create-sql-pool-studio.md) or [create Apache Spark pools](quickstart-create-apache-spark-pool-studio.md) to start analyzing and exploring your data.
