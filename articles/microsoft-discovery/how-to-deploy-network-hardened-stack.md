---
title: End-to-end network-hardened deployment for Microsoft Discovery
description: Learn how to deploy a Microsoft Discovery stack with private data-plane access for workspaces, bookshelves, and customer storage while planning outbound dependencies.
ms.service: azure
ms.topic: how-to
ms.date: 11/10/2026
ms.author: umamm
author: umamm
ms.custom: networking, private-link, nsp
---

# End-to-end network-hardened deployment

This guide walks you through deploying a Microsoft Discovery stack with private workspace data-plane, Bookshelf, and customer-storage access. Private data-plane access doesn't eliminate outbound platform dependencies or control-plane access requirements. Plan firewall and FQDN rules and verify the actual network paths before deployment.

## What you build

:::image type="content" source="media/how-to-deploy-network-hardened-stack/what-you-build.jpg" alt-text="Diagram showing end-to-end network-hardened Discovery deployment with private endpoints for workspace, bookshelf, and blob storage." lightbox="media/how-to-deploy-network-hardened-stack/what-you-build.jpg":::

| Component | Network protection | Access path |
|-----------|-------------------|-------------|
| **Workspace data-plane** | Private endpoint to Azure backbone | Hostname from `properties.workspaceApiUri` resolves to private IP |
| **Bookshelf data-plane** | Private endpoint to Azure backbone | Hostname from `properties.bookshelfUri` resolves to private IP |
| **Managed resources** | Network Security Perimeter (NSP) Enforced + MRG private endpoints | Accessible only to Discovery service components |
| **Supercomputer / Nodepool** | Virtual network injected | Runs in your virtual network subnet, accesses managed resources through private endpoints |
| **Customer blob storage** | Private endpoint + no public access + no keys | Accessible only through PE with managed identity RBAC |

## Prerequisites

- An Azure subscription with **Microsoft.Discovery** registered
- Azure CLI 2.50+
- A user-assigned managed identity (UAMI)
- The [Platform Administrator persona permissions](concept-role-assignments.md#roles-required-by-persona) and [required UAMI roles](how-to-configure-managed-identity.md#assign-required-roles)
- Network hardening prerequisites completed (see [Configure network security](how-to-configure-network-security.md#prerequisites))

## Step 1: Plan your virtual network

Create a virtual network with dedicated subnets for each component:

```azurecli
az network vnet create \
  --resource-group {rg} --name {vnetName} \
  --address-prefixes 10.200.0.0/16 --location {region}
```

Create the subnets:

| Subnet | CIDR | Purpose |
|--------|------|---------|
| `agent-ws` | `10.200.1.0/27` | Workspace agent workloads |
| `workspace-ws` | `10.200.2.0/24` | Workspace services |
| `pe-ws` | `10.200.3.0/27` | Private endpoints (workspace + bookshelf) |
| `bs-search` | `10.200.4.0/27` | Bookshelf search services |
| `sc-aks` | `10.200.6.0/24` | Supercomputer cluster |
| `sc-nodepool` | `10.200.5.0/24` | Supercomputer nodepool |
| `sc-mgmt` *(optional for LoadBalancer)* | `10.200.7.0/28` | Supercomputer AKS API server VNet integration. Required for `UserDefinedRouting` and private supercomputers. `/28` is the floor. Delegate to `Microsoft.ContainerService/managedClusters`. |
| `pe-storage` | `10.200.11.0/27` | Customer blob storage PE |

```azurecli
az network vnet subnet create --resource-group {rg} --vnet-name {vnetName} --name agent-ws --address-prefixes 10.200.1.0/27 --delegations Microsoft.App/environments
az network vnet subnet create --resource-group {rg} --vnet-name {vnetName} --name workspace-ws --address-prefixes 10.200.2.0/24 --delegations Microsoft.App/environments
az network vnet subnet create --resource-group {rg} --vnet-name {vnetName} --name pe-ws --address-prefixes 10.200.3.0/27
az network vnet subnet create --resource-group {rg} --vnet-name {vnetName} --name bs-search --address-prefixes 10.200.4.0/27 --delegations Microsoft.App/environments
az network vnet subnet create --resource-group {rg} --vnet-name {vnetName} --name sc-aks --address-prefixes 10.200.6.0/24
az network vnet subnet create --resource-group {rg} --vnet-name {vnetName} --name sc-nodepool --address-prefixes 10.200.5.0/24
az network vnet subnet create --resource-group {rg} --vnet-name {vnetName} --name sc-mgmt --address-prefixes 10.200.7.0/28 --delegations Microsoft.ContainerService/managedClusters
az network vnet subnet create --resource-group {rg} --vnet-name {vnetName} --name pe-storage --address-prefixes 10.200.11.0/27
```

> [!IMPORTANT]
> This example uses one virtual network and the same `{region}` for Discovery resources and workload infrastructure. For separate control-plane and workload regions, follow [Deploy across regions](how-to-deploy-across-regions.md). Keep the VNet, subnets, and managed workload resources together in the target workload region; don't place the workload network in the home region merely because the Discovery resource is there.

## Step 2: Create the Discovery resource stack

### Supercomputer (virtual network injected)

Create the supercomputer first so you can reference it in the workspace. The compute cluster uses your virtual network subnets. The following request doesn't enable a private supercomputer management plane. If you need one, configure `UserDefinedRouting`, a separate delegated management subnet, the creation-time `discovery.enableprivatecluster=true` tag, and the required Private Link service subnet policies before creation. See [Private supercomputer](how-to-configure-supercomputer-network-security.md#private-supercomputer). These settings are separate from workspace and bookshelf client API privacy.

> [!NOTE]
> Setting `properties.managementSubnetId` on the Supercomputer to a subnet delegated to `Microsoft.ContainerService/managedClusters` (for example, `sc-mgmt` in the preceding section) enables **AKS API-Server VNet Integration**: kubelet on the nodes reaches the API server over a private ILB in that subnet, so the node-to-control-plane data path stays inside the virtual network. For more information, see [Management subnet ID requirements](how-to-configure-network-security.md#management-subnet-id-requirements).

```azurecli
az rest --method PUT \
  --uri "https://management.azure.com/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Discovery/supercomputers/{scName}?api-version=2026-06-01" \
  --body '{
    "location": "{region}",
    "properties": {
      "subnetId": "/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Network/virtualNetworks/{vnet}/subnets/sc-aks",
      "identities": {
        "clusterIdentity": { "id": "{uamiResourceId}" },
        "kubeletIdentity": { "id": "{uamiResourceId}" },
        "workloadIdentities": { "{uamiResourceId}": {} }
      }
    }
  }'
```

Add a nodepool after the supercomputer is provisioned:

```azurecli
az rest --method PUT \
  --uri "https://management.azure.com/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Discovery/supercomputers/{scName}/nodepools/{nodepoolName}?api-version=2026-06-01" \
  --body '{
    "location": "{region}",
    "properties": {
      "subnetId": "/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Network/virtualNetworks/{vnet}/subnets/sc-nodepool",
      "vmSize": "Standard_D16s_v5",
      "minNodeCount": 0,
      "maxNodeCount": 3,
      "scaleSetPriority": "Regular"
    }
  }'
```

### Bookshelf

```azurecli
az rest --method PUT \
  --uri "https://management.azure.com/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Discovery/bookshelves/{bsName}?api-version=2026-06-01" \
  --body '{
    "location": "{region}",
    "properties": {
      "searchSubnetId": "/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Network/virtualNetworks/{vnet}/subnets/bs-search",
      "privateEndpointSubnetId": "/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Network/virtualNetworks/{vnet}/subnets/pe-ws",
      "workloadIdentities": { "{uamiResourceId}": {} }
    }
  }'
```

### Workspace

Create the workspace after the supercomputer so you can include `supercomputerIds` directly:

```azurecli
az rest --method PUT \
  --uri "https://management.azure.com/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Discovery/workspaces/{wsName}?api-version=2026-06-01" \
  --body '{
    "location": "{region}",
    "properties": {
      "agentSubnetId": "/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Network/virtualNetworks/{vnet}/subnets/agent-ws",
      "privateEndpointSubnetId": "/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Network/virtualNetworks/{vnet}/subnets/pe-ws",
      "workspaceSubnetId": "/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Network/virtualNetworks/{vnet}/subnets/workspace-ws",
      "workspaceIdentity": { "id": "{uamiResourceId}" },
      "supercomputerIds": [
        "/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Discovery/supercomputers/{scName}"
      ]
    }
  }'
```

## Step 3: Create private endpoints and configure DNS

Create private endpoints for workspace, bookshelf, and blob storage data-plane access, then configure private DNS zones. For detailed steps including CLI, PowerShell, and portal instructions, see [Create private endpoints for data-plane access](how-to-configure-network-security.md#create-private-endpoints-for-data-plane-access).

After you verify the workspace and bookshelf private paths, [disable public network access](how-to-configure-network-security.md#disable-public-network-access-optional) on both resources. Creating a private endpoint alone doesn't block their public APIs.

## Step 4: Add network-hardened customer blob storage

For workloads that need access to customer data (training data, documents), create a fully locked-down Azure Blob Storage account accessible only through your virtual network:

### Create the storage account (no public access, no keys)

```azurecli
az storage account create --resource-group {rg} \
  --name {storageAccountName} --location {region} \
  --sku Standard_LRS --kind StorageV2 \
  --min-tls-version TLS1_2 \
  --allow-blob-public-access false \
  --public-network-access Disabled \
  --allow-shared-key-access false \
  --default-action Deny --https-only true
```

### Assign RBAC (managed identity, no keys)

```azurecli
az role assignment create \
  --assignee-object-id {uamiPrincipalId} \
  --assignee-principal-type ServicePrincipal \
  --role "Storage Blob Data Contributor" \
  --scope "/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Storage/storageAccounts/{storageAccountName}"
```

### Create PE for blob access from your virtual network

```azurecli
az network private-endpoint create \
  --resource-group {rg} --name pe-blob-storage \
  --vnet-name {vnet} --subnet pe-storage \
  --private-connection-resource-id "/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Storage/storageAccounts/{storageAccountName}" \
  --group-id blob --connection-name pe-blob-conn
```

If you use a storage account with hierarchical namespaces enabled, you also need to create a private endpoint for the dfs endpoint:
```azurecli
az network private-endpoint create \
  --resource-group {rg} --name pe-dfs-storage \
  --vnet-name {vnet} --subnet pe-storage \
  --private-connection-resource-id "/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Storage/storageAccounts/{storageAccountName}" \
  --group-id dfs --connection-name pe-dfs-conn
```

Configure the [storage private DNS zones and VNet links](/azure/storage/common/storage-private-endpoints#dns-changes-for-private-endpoints) for each endpoint you created. Verify that the client and workload networks resolve the storage endpoints to their private IP addresses.

### Register the storage with Discovery

Create a Discovery storage container resource that references your blob storage:

```azurecli
az rest --method PUT \
  --uri "https://management.azure.com/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Discovery/storageContainers/{scName}?api-version=2026-06-01" \
  --body '{
    "location": "{region}",
    "properties": {
      "storageStore": {
        "kind": "AzureStorageBlob",
        "storageAccountId": "/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Storage/storageAccounts/{storageAccountName}"
      }
    }
  }'
```

> [!TIP]
> Configure [project storage CORS and user permissions](how-to-configure-project-storage.md#cors-configuration) before researchers open outputs in Studio. Their browsers also need private connectivity to storage.

## Step 5: Verify end-to-end network hardening

After deploying all resources and creating private endpoints, verify that DNS resolves to private IPs and connectivity works from within your virtual network. For detailed verification steps, see [Verify connectivity](how-to-configure-network-security.md#verify-connectivity).

## How traffic flows end to end

The following table describes the configured private data paths. Permit outbound platform and tool dependencies separately.

| Traffic path | Source | Network mechanism | Public internet? |
|-------------|--------|-------------------|-----------------|
| **Your app to Workspace API** | App in virtual network or connected via VPN/ExpressRoute/VNet peering | Private endpoint to Azure backbone | No |
| **Your app to Bookshelf API** | App in virtual network or connected via VPN/ExpressRoute/VNet peering | Private endpoint to Azure backbone | No |
| **Your app to Blob storage** | App in virtual network or connected via VPN/ExpressRoute/VNet peering | Private endpoint | No |
| **Discovery service to workspace MRG resources** | Discovery service | NSP + private endpoints in managed resource group | No |
| **Discovery service to bookshelf MRG resources** | Discovery service | NSP + private endpoints in managed resource group | No |
| **Discovery service to supercomputer MRG resources** | Discovery service | NSP + private endpoints in managed resource group | No |
| **Workspace to customer blob** | Workspace workload | UAMI + RBAC through private endpoint | No |
| **Bookshelf to customer blob** | Bookshelf workload | UAMI + RBAC through private endpoint | No |
| **Supercomputer to customer blob** | Virtual network injected compute | UAMI + RBAC through private endpoint | No |

### How Discovery resources access managed and customer data

For the configured private paths, workloads resolve the target FQDN through private DNS to a private IP address and connect through the corresponding private endpoint. Verify DNS and routing from each workload network; a client private endpoint doesn't by itself configure backend connectivity or outbound dependencies.

For customer storage, assign the UAMI the required storage RBAC role. The workspace, bookshelf, and supercomputer can use the same UAMI when you configure it for each resource. Managed identity authentication avoids storage keys but doesn't grant network connectivity: each workload must also be able to resolve and reach the storage private endpoint.

## Security summary

When you complete this deployment, you have:

- **Private client data paths** - workspace, Bookshelf, and storage APIs use approved private endpoints and DNS, with their public network access disabled.
- **Explicit outbound connectivity** - allow the dependencies required by the platform and your tools; private inbound access doesn't eliminate egress.
- **Defense in depth** - NSP (network perimeter) + PE (private connectivity) + virtual network injection (compute isolation) + RBAC (identity-based access)

## Next steps

- [Configure network security](how-to-configure-network-security.md) - detailed network hardening and PE setup
- [Bookshelf and Knowledge Bases](concept-bookshelf-knowledge-bases.md)
