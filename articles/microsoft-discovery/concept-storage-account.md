---
title: Azure Blob Storage in Microsoft Discovery
description: Learn how Azure Blob Storage is used in Microsoft Discovery to store investigation input and output data, and how to configure networking, CORS, and identity access for the storage account.
author: mukesh-dua
ms.author: mukeshdua
ms.service: azure
ms.topic: concept-article
ms.date: 03/10/2026
---

# Azure Blob Storage in Microsoft Discovery

Microsoft Discovery uses Azure Blob Storage as the backing store for investigation input and output data. This article explains the role a storage account plays in the platform, and what networking, CORS, and identity access configuration is required before you create Discovery resources.

## Role of storage in Microsoft Discovery

When you run an investigation in Microsoft Discovery Studio, the platform reads input data from and writes output data to an Azure Blob Storage account that you own and manage in your Azure subscription. This design keeps your research data within your own Azure environment.

In Discovery Studio, the storage account is surfaced through **Storage Containers**: logical groupings that map to Azure Blob Storage containers inside your account. Both input assets (datasets, parameter files) and output assets (results, logs) are stored as blobs within these containers.

## Prerequisites

Before creating a storage account for Microsoft Discovery, ensure you have:

- An active Azure subscription with the **Contributor** or **Owner** role on the target resource group.
- The `Microsoft.Storage` resource provider registered on your subscription.
- A virtual network and subnets already provisioned. The storage account must allow network access from the same virtual network used by the supercomputer and workspace. See [Virtual networks and subnets in Microsoft Discovery](concept-virtual-networks.md).
- A User Assigned Managed Identity (UAMI) that will be granted access to the storage account. See [Role assignments in Microsoft Discovery](concept-role-assignments.md).

## Storage account requirements

A storage account used with Microsoft Discovery must satisfy the following requirements.

### Service type

Select **Azure Blob Storage** as the primary service type when creating the account. Hierarchical namespace (Azure Data Lake Storage Gen2) isn't required.

### Networking

The storage account must be reachable from two sources:

| Source | Purpose |
|--------|---------|
| Virtual network subnets (supercomputer, AKS, workspace) | Allows the Discovery platform to read and write investigation data |
| Client IP address or on-premises network | Allows researchers to access output data from their Discovery Studio portal or local tools |

Configure the **Networking** settings as follows:

- Set **Public network access** to **Enabled from selected virtual networks and IP addresses**.
- Add the virtual network and **all subnets** created for your Discovery deployment (supercomputer, AKS, workspace, private endpoint, and agent subnets).
- Add your client's public IP address (or configure private access via Azure VPN or ExpressRoute) so that output files are accessible outside the virtual network.

> [!NOTE]
> To view and download output files in Microsoft Discovery Studio, your browser needs direct network access to the blob storage endpoint. If you restrict public access completely, configure private access via Azure Private Link, Site-to-Site VPN, or ExpressRoute.

### Blob containers

You don't need to precreate output containers. When an agent writes outputs, the platform automatically performs a create-if-not-exists operation on the target blob container. Multiple investigations can safely share the same storage container, each conversation, or investigation creates a logical section within the container so that outputs remain isolated per conversation.

> [!NOTE]
> Automatic container creation requires two prerequisites: the workspace agent subnet must be added to the storage account network allow list, and the workspace managed identity must have the **Storage Blob Data Contributor** role on the storage account.

### CORS configuration

Microsoft Discovery Studio (`https://studio.discovery.microsoft.com`) and the integrated VSCode experience (`https://vscode.dev`, `https://*.vscode-cdn.net`) make direct browser requests to blob storage. You must configure Cross-Origin Resource Sharing (CORS) on the **Blob service** of the storage account to allow these origins.

Apply the following CORS rule under **Settings** > **Resource sharing (CORS)** > **Blob service**:

| Setting | Value |
|---------|-------|
| Allowed origins | `https://studio.discovery.microsoft.com`, `https://vscode.dev`, `https://*.vscode-cdn.net` |
| Allowed methods | `GET`, `HEAD`, `DELETE`, `PUT` |
| Allowed headers | `*` |
| Exposed headers | `*` |
| Max age (seconds) | `200` |

> [!IMPORTANT]
> CORS must be configured before researchers can view or download investigation outputs in Microsoft Discovery Studio.

### Identity access

Assign the **Storage Blob Data Contributor** role on the storage account to the User Assigned Managed Identity (UAMI) used by the Discovery workspace and supercomputer. This grants the platform the permissions it needs to read input data and write output data on behalf of investigations.

```azurecli
UAMI_PRINCIPAL_ID="<uami-principal-id>"
STORAGE_RESOURCE_ID=$(az storage account show \
  --name <storage-account-name> \
  --resource-group <resource-group> \
  --query id --output tsv)

az role assignment create \
  --assignee $UAMI_PRINCIPAL_ID \
  --role "Storage Blob Data Contributor" \
  --scope $STORAGE_RESOURCE_ID
```

## Create a storage account

### Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for **Storage accounts** and select it.
1. Select **Create**.
1. On the **Basics** tab, enter the subscription, resource group, name, and region. Select the same region as your Discovery workspace.
1. Under **Primary service**, select **Azure Blob Storage**.
1. Select the **Networking** tab.
1. Under **Public network access**, select **Enable access from selected virtual networks and IP addresses**.
1. Under **Virtual networks**, select **Add existing virtual network**, then select your Discovery virtual network and all its subnets.
1. Under **Firewall**, select **Add your client IP address** if you need browser access to output data over the public internet.
1. Select **Review + create**, then **Create**.

After the account is created, complete the following post-creation steps:

**Configure CORS:**

1. Under **Settings**, select **Resource sharing (CORS)**.
1. On the **Blob service** tab, add a new CORS rule using the values from the [CORS configuration](#cors-configuration) table above.
1. Select **Save**.

**Assign identity access:**

1. Select **Access control (IAM)** on the storage account.
1. Select **Add** > **Add role assignment**.
1. Assign the **Storage Blob Data Contributor** role to the UAMI used by your Discovery workspace.

### Azure CLI

#### Set variables

```azurecli
SUBSCRIPTION_ID="<your-subscription-id>"
RESOURCE_GROUP="<your-resource-group>"
STORAGE_NAME="<globally-unique-storage-account-name>"
LOCATION="eastus"   # Use the same region as your Discovery workspace
VNET_NAME="<your-vnet-name>"
VNET_RESOURCE_GROUP="<vnet-resource-group>"
```

#### Create the storage account

```azurecli
az storage account create \
  --name $STORAGE_NAME \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --sku Standard_LRS \
  --kind StorageV2 \
  --default-action Deny \
  --allow-blob-public-access false
```

#### Add virtual network rules

```azurecli
# Add each subnet that needs access to the storage account
for SUBNET in supercomputerNodepoolSubnet aksSubnet workspaceSubnet privateEndpointSubnet agentSubnet; do
  az storage account network-rule add \
    --account-name $STORAGE_NAME \
    --resource-group $RESOURCE_GROUP \
    --vnet-name $VNET_NAME \
    --subnet $SUBNET
done
```

#### Configure CORS

```azurecli
az storage cors add \
  --account-name $STORAGE_NAME \
  --services b \
  --methods GET HEAD DELETE PUT \
  --origins "https://studio.discovery.microsoft.com" "https://vscode.dev" "https://*.vscode-cdn.net" \
  --allowed-headers "*" \
  --exposed-headers "*" \
  --max-age 200
```

#### Assign identity access

```azurecli
UAMI_PRINCIPAL_ID="<uami-principal-id>"
STORAGE_RESOURCE_ID=$(az storage account show \
  --name $STORAGE_NAME \
  --resource-group $RESOURCE_GROUP \
  --query id --output tsv)

az role assignment create \
  --assignee $UAMI_PRINCIPAL_ID \
  --role "Storage Blob Data Contributor" \
  --scope $STORAGE_RESOURCE_ID
```

## Related content

- [What is Microsoft Discovery?](overview-what-is-microsoft-discovery.md)
- [Virtual networks and subnets in Microsoft Discovery](concept-virtual-networks.md)
- [Role assignments in Microsoft Discovery](concept-role-assignments.md)
- [Azure Blob Storage documentation](../storage/blobs/storage-blobs-overview.md)
- [Configure Azure Storage firewalls and virtual networks](../storage/common/storage-network-security.md)
