---
title: Configure project storage for Microsoft Discovery
description: Create project storage for Microsoft Discovery and configure identity access, CORS, and approved private or selected-network access paths.
author: mukesh-dua
ms.author: mukeshdua
ms.service: azure
ms.topic: how-to
ms.date: 11/10/2026
---

# Configure project storage for Microsoft Discovery

<a id="azure-blob-storage-in-microsoft-discovery"></a>

Create and configure a customer-owned Azure Blob Storage account for project inputs and outputs. You need project storage even if you don't use Bookshelf.

For the onboarding tool, create the account before Stage 1, and then let [Stage 2](how-to-prepare-landing-zone.md) configure its storage networking and access settings after the network is available. The tool doesn't create the storage account. Review its changes before selecting a shared account.

## Prerequisites

- An active Azure subscription and permission to create and configure storage in the selected resource group, such as Storage Account Contributor or Contributor.
- The `Microsoft.Storage` resource provider registered.
- For role assignments, Owner, User Access Administrator, or Role Based Access Control Administrator at the assignment scope.
- For final networking, an approved virtual network, subnet, and client-access plan. You can create the account before the final virtual network exists.
- For runtime access, a [precreated UAMI](how-to-configure-managed-identity.md). Create its role assignments once the relevant resources exist.

## Role of storage in Microsoft Discovery

When you run an investigation in Microsoft Discovery Studio, the platform reads input data from and writes output data to an Azure Blob Storage account that you own and manage in your Azure subscription. This design keeps your research data within your own Azure environment.

A Discovery **storage container** registers the storage account; it isn't the physical Azure Blob container. Storage assets reference paths in that account. Input datasets and output files remain in Azure Blob Storage.

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

Choose the approved access path rather than applying both alternatives indiscriminately:

- **Private endpoint:** configure a blob private endpoint, its private DNS zone group, and a link to the intended VNet. Clients need a private network path and DNS resolution. See [Storage private endpoints](/azure/storage/common/storage-private-endpoints). A firewall default action of Deny isn't the same as setting public network access to Disabled.
- **Selected public networks/service endpoints:** keep public network access enabled only from approved networks and IPs, configure the `Microsoft.Storage` service endpoint on participating subnets, and add the required subnet/client rules.

For the selected-network path, configure **Networking** as follows:

- Set **Public network access** to **Enabled from selected virtual networks and IP addresses**.
- Add the virtual network and **all subnets** created for your Discovery deployment (supercomputer, AKS, workspace, private endpoint, and agent subnets).
- Add your client's public IP address (or configure private access via Azure VPN or ExpressRoute) so that output files are accessible outside the virtual network.

> [!NOTE]
> To view and download output files in Microsoft Discovery Studio, your browser needs direct network access to the blob storage endpoint. If you restrict public access completely, configure private access via Azure Private Link, Site-to-Site VPN, or ExpressRoute.

### Blob containers

You don't need to precreate output containers. When an agent writes outputs, the platform automatically performs a create-if-not-exists operation on the target blob container. Multiple investigations can safely share the same storage container, each conversation, or investigation creates a logical section within the container so that outputs remain isolated per conversation.

> [!NOTE]
> Automatic container creation requires the workspace managed identity to have **Storage Blob Data Contributor** and a working network path to storage. For selected-network access, allow the workspace agent subnet. For private access, configure the blob private endpoint and DNS instead.

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

For a same-region deployment, use the Discovery home region for the storage account. For different control-plane and workload regions, follow [Cross-region resource placement](how-to-deploy-across-regions.md#understand-resource-placement).

### Azure portal

If you only need the initial account for onboarding Stage 1, create it with the approved restrictive networking settings and complete final access after the VNet exists. The selected-network additions in the following steps apply when those subnets already exist; the private-endpoint alternative uses its own endpoint and DNS procedure.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for **Storage accounts** and select it.
1. Select **Create**.
1. On the **Basics** tab, enter the subscription, resource group, name, and approved workload region.
1. Under **Primary service**, select **Azure Blob Storage**.
1. Select the **Networking** tab.
1. Under **Public network access**, select the setting for the approved path: **Enable access from selected virtual networks and IP addresses** for service-endpoint access, or **Disabled** for private-only access.
1. For the selected-network path, under **Virtual networks**, select **Add existing virtual network** and add the approved subnets when available. For an initial onboarding account, defer this step until Stage 2.
1. Under **Firewall**, add your client IP address only if approved public browser access is part of the plan. For private-only access, configure the private endpoint and a private client path instead.
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
LOCATION="<workload-region>"
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

This step creates the account with a deny-by-default firewall. It doesn't create a private endpoint or grant client access. In the onboarding tool path, record the existing account in Stage 1 and continue with Stage 2 for planned networking changes. You don't need a not-yet-created virtual network to create this account.

#### Add virtual network rules

Use these rules only for the approved selected-network/service-endpoint path. First, enable the `Microsoft.Storage` service endpoint on each selected subnet. For private-only access, follow the linked private-endpoint procedure or the onboarding Stage 2 path. Subnet allow rules aren't a substitute for a private endpoint and DNS.

```azurecli
# Add each subnet that needs access to the storage account
for SUBNET in supercomputerNodepoolSubnet aksSubnet workspaceSubnet privateEndpointSubnet agentSubnet; do
  az storage account network-rule add \
    --account-name $STORAGE_NAME \
    --resource-group $RESOURCE_GROUP \
    --subnet "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$VNET_RESOURCE_GROUP/providers/Microsoft.Network/virtualNetworks/$VNET_NAME/subnets/$SUBNET"
done
```

Replace the example subnet names with the actual approved subnets. The full resource ID identifies the virtual network's resource group independently of the storage account's group.

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

## Verify project storage access

1. Confirm that the account, UAMI assignment, and approved network settings target the intended resource IDs.
1. From an approved platform-network test location, verify blob-endpoint DNS resolution and HTTPS connectivity. For private-only access, confirm DNS resolves to the intended private endpoint.
1. Use an approved test investigation to verify that the platform can write an output and that an authorized researcher can open it in Discovery Studio. Check the researcher's own network path, permissions, and browser CORS results separately.
1. Remove only the identified test data according to its owner's retention policy. Don't delete a shared container or storage account to clean up a test.

## Related content

- [Plan Discovery deployment](concept-deployment-planning.md)
- [What is Microsoft Discovery?](overview-what-is-microsoft-discovery.md)
- [Virtual networks and subnets in Microsoft Discovery](concept-virtual-networks.md)
- [Role assignments in Microsoft Discovery](concept-role-assignments.md)
- [Azure Blob Storage documentation](/azure/storage/blobs/storage-blobs-overview)
- [Configure Azure Storage firewalls and virtual networks](/azure/storage/common/storage-network-security)
