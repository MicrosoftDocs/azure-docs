---
title: 	How to manage Microsoft Discovery Supercomputers using REST API
description: Learn how to set up Azure Discovery Supercomputer infrastructure and configure node pools to run high-performance computing tasks using the REST API.
author: anzaman
ms.author: alzam
ms.service: azure
ms.topic: how-to
ms.date: 05/01/2026
ms.custom: references_regions
---

# How to run tasks on Supercomputers using the REST API

This article walks you through the end-to-end process of preparing Azure Discovery Supercomputer infrastructure and running compute tasks on it by using the REST API. You learn how to create a Supercomputer, add GPU-accelerated node pools, monitor provisioning, scale your compute, and clean up resources when you're finished.

Azure Discovery Supercomputers provide dedicated, cloud-hosted high-performance computing (HPC) infrastructure for running workloads such as AI model training, scientific simulations, and large-scale data processing. Node pools are the compute building blocks that run your tasks — each pool defines the VM size, scaling limits, and priority of the underlying virtual machine scale set.

## Prerequisites

Before you begin, make sure you have the following:

- An Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- A resource group in a [supported region](#supported-regions).
- Azure CLI installed, or another tool to make authenticated REST calls (such as `curl` or Postman).
- The following **user-assigned managed identities** created in your subscription:
  - **Cluster identity** — used by the Supercomputer control plane.
  - **Kubelet identity** — used at the node level to access Azure resources. Must have the `ManagedIdentityOperator` role on the cluster identity.
- A **virtual network** with:
  - A **system subnet** for the Supercomputer's managed system node pool.
  - A **management subnet** delegated to `Microsoft.ContainerService/managedClusters` for the AKS API server.
  - One or more **node pool subnets** for your compute node pools (these must have connectivity to the system subnet).
- Sufficient **GPU quota** in your subscription for the VM sizes you plan to use (for example, `Standard_NC24ads_A100_v4` requires NCads A100 v4-series quota).

### Supported regions

Supercomputers are currently available in the following Azure regions:

- East US
- UK South
- West Europe

### API version

All examples in this article use API version `2026-02-01-preview`.

### Authentication

All requests require a Microsoft Entra ID bearer token with the `user_impersonation` scope. To acquire a token using Azure CLI:

```bash
az account get-access-token --resource https://management.azure.com
```

Include the token in the `Authorization` header of every request:

```http
Authorization: Bearer <access-token>
```

---

## Step 1: Create a Supercomputer

A Supercomputer is the top-level resource that provides the managed AKS-backed cluster. You must create it before you can add node pools for your tasks.

### Request

```http
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Discovery/supercomputers/{supercomputerName}?api-version=2026-02-01-preview
Content-Type: application/json
Authorization: Bearer <access-token>
```

### Request body

```json
{
  "location": "eastus",
  "tags": {
    "environment": "production",
    "project": "molecular-simulation"
  },
  "properties": {
    "subnetId": "/subscriptions/{subscriptionId}/resourceGroups/{networkRG}/providers/Microsoft.Network/virtualNetworks/{vnetName}/subnets/{systemSubnet}",
    "managementSubnetId": "/subscriptions/{subscriptionId}/resourceGroups/{networkRG}/providers/Microsoft.Network/virtualNetworks/{vnetName}/subnets/{mgmtSubnet}",
    "outboundType": "LoadBalancer",
    "systemSku": "Standard_D4s_v6",
    "identities": {
      "clusterIdentity": {
        "id": "/subscriptions/{subscriptionId}/resourceGroups/{identityRG}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{clusterIdentityName}"
      },
      "kubeletIdentity": {
        "id": "/subscriptions/{subscriptionId}/resourceGroups/{identityRG}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{kubeletIdentityName}"
      }
    }
  }
}
```

### Key properties

| Property | Required | Description |
|----------|----------|-------------|
| `location` | Yes | The Azure region for the Supercomputer. |
| `properties.subnetId` | Yes | System subnet for the managed node pool. |
| `properties.managementSubnetId` | No | Subnet for the AKS API server, delegated to `Microsoft.ContainerService/managedClusters`. |
| `properties.outboundType` | No | Network egress: `LoadBalancer` (default) or `None`. |
| `properties.systemSku` | No | VM SKU for system nodes: `Standard_D4s_v6` (default), `Standard_D4s_v5`, or `Standard_D4s_v4`. |
| `properties.identities.clusterIdentity.id` | Yes | ARM resource ID of the cluster managed identity. |
| `properties.identities.kubeletIdentity.id` | Yes | ARM resource ID of the kubelet managed identity. |

### Response

- **201 Created** — The Supercomputer is being provisioned. The response includes `Azure-AsyncOperation` and `Retry-After` headers.
- **200 OK** — The Supercomputer already exists and was updated.

### Azure CLI equivalent

```bash
az rest --method PUT \
  --url "https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Discovery/supercomputers/{supercomputerName}?api-version=2026-02-01-preview" \
  --body @supercomputer-create.json
```

---

## Step 2: Wait for Supercomputer provisioning

Supercomputer creation is a long-running operation. Poll the resource until `provisioningState` reaches a terminal state.

```bash
while true; do
  STATE=$(az rest --method GET \
    --url "https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Discovery/supercomputers/{supercomputerName}?api-version=2026-02-01-preview" \
    --query "properties.provisioningState" -o tsv)
  echo "Provisioning state: ${STATE}"
  if [ "${STATE}" = "Succeeded" ] || [ "${STATE}" = "Failed" ] || [ "${STATE}" = "Canceled" ]; then
    break
  fi
  sleep 30
done
```

| Provisioning state | Meaning |
|--------------------|---------|
| `Accepted` | The request has been accepted. |
| `Provisioning` | Infrastructure is being created. |
| `Succeeded` | The Supercomputer is ready. |
| `Failed` | Provisioning failed — check error details. |
| `Canceled` | The operation was canceled. |

> [!IMPORTANT]
> Do not create node pools until the Supercomputer reaches the `Succeeded` state.

---

## Step 3: Create a node pool for your tasks

Node pools define the compute capacity for running your tasks. Each node pool specifies the VM size (including GPU options), scaling limits, and priority.

### Request

```http
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Discovery/supercomputers/{supercomputerName}/nodePools/{nodePoolName}?api-version=2026-02-01-preview
Content-Type: application/json
Authorization: Bearer <access-token>
```

### URI parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `subscriptionId` | string (UUID) | The ID of the target subscription. |
| `resourceGroupName` | string | The name of the resource group (1–90 characters, case-insensitive). |
| `supercomputerName` | string | Name of the parent Supercomputer. Must match `^[a-zA-Z0-9-]{3,24}$`. |
| `nodePoolName` | string | Name of the node pool. Must match `^[a-zA-Z0-9-]{3,24}$`. |

### Request body

```json
{
  "location": "eastus",
  "tags": {
    "workload": "ai-training",
    "gpu": "A100"
  },
  "properties": {
    "subnetId": "/subscriptions/{subscriptionId}/resourceGroups/{networkRG}/providers/Microsoft.Network/virtualNetworks/{vnetName}/subnets/{nodePoolSubnet}",
    "vmSize": "Standard_NC24ads_A100_v4",
    "minNodeCount": 0,
    "maxNodeCount": 4,
    "scaleSetPriority": "Regular"
  }
}
```

### Node pool properties

| Property | Required | Default | Description |
|----------|----------|---------|-------------|
| `location` | Yes | — | Must match the Supercomputer's region. |
| `properties.vmSize` | Yes | — | The VM size for compute nodes. |
| `properties.maxNodeCount` | Yes | — | Maximum number of nodes the pool can scale to (minimum: 1). |
| `properties.minNodeCount` | No | `0` | Minimum number of nodes. Set to `0` for scale-to-zero behavior. |
| `properties.subnetId` | No | — | The subnet for this node pool. Must have connectivity to the system subnet. |
| `properties.scaleSetPriority` | No | `Regular` | `Regular` for on-demand VMs or `Spot` for cost-optimized, interruptible VMs. |

### Response

- **201 Created** — The node pool is being provisioned. Includes `Azure-AsyncOperation` and `Retry-After` headers.
- **200 OK** — The node pool already exists and was updated.

#### Example response (201 Created)

```json
{
  "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Discovery/supercomputers/{supercomputerName}/nodePools/{nodePoolName}",
  "name": "{nodePoolName}",
  "type": "Microsoft.Discovery/supercomputers/nodePools",
  "location": "eastus",
  "tags": {
    "workload": "ai-training",
    "gpu": "A100"
  },
  "systemData": {
    "createdBy": "user@contoso.com",
    "createdByType": "User",
    "createdAt": "2026-05-01T10:00:00Z",
    "lastModifiedBy": "user@contoso.com",
    "lastModifiedByType": "User",
    "lastModifiedAt": "2026-05-01T10:00:00Z"
  },
  "properties": {
    "provisioningState": "Accepted",
    "subnetId": "/subscriptions/.../subnets/nodePoolSubnet",
    "vmSize": "Standard_NC24ads_A100_v4",
    "maxNodeCount": 4,
    "minNodeCount": 0,
    "scaleSetPriority": "Regular"
  }
}
```

### Azure CLI equivalent

```bash
az rest --method PUT \
  --url "https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Discovery/supercomputers/{supercomputerName}/nodePools/{nodePoolName}?api-version=2026-02-01-preview" \
  --body @nodepool-create.json
```

---

## Step 4: Wait for node pool provisioning

Poll the node pool resource until it reaches a terminal state, the same way you polled the Supercomputer.

```bash
while true; do
  STATE=$(az rest --method GET \
    --url "https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Discovery/supercomputers/{supercomputerName}/nodePools/{nodePoolName}?api-version=2026-02-01-preview" \
    --query "properties.provisioningState" -o tsv)
  echo "Node pool state: ${STATE}"
  if [ "${STATE}" = "Succeeded" ] || [ "${STATE}" = "Failed" ] || [ "${STATE}" = "Canceled" ]; then
    break
  fi
  sleep 30
done
```

When the node pool reaches `Succeeded`, it's ready to accept tasks.

---

## Step 5: Add workload identities (optional)

If your tasks need to access Azure resources (such as Storage accounts or Key Vaults), add workload identities to the Supercomputer. These identities are available to workloads running on the node pools as federated credentials.

### Request

```http
PATCH https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Discovery/supercomputers/{supercomputerName}?api-version=2026-02-01-preview
Content-Type: application/json
Authorization: Bearer <access-token>
```

### Request body

```json
{
  "properties": {
    "identities": {
      "workloadIdentities": {
        "/subscriptions/{subscriptionId}/resourceGroups/{identityRG}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{workloadIdentityName}": {}
      }
    }
  }
}
```

### Response

- **200 OK** — The update completed synchronously.
- **202 Accepted** — The update is in progress. Poll using the `Location` header.

After the update completes, the workload identity's `principalId` and `clientId` are populated in the response:

```json
{
  "properties": {
    "identities": {
      "workloadIdentities": {
        "/subscriptions/.../userAssignedIdentities/workloadIdentityName": {
          "principalId": "00000000-0000-0000-0000-000000000001",
          "clientId": "00000000-0000-0000-0000-000000000002"
        }
      }
    }
  }
}
```

---

## Step 6: Scale your node pool

You can update a node pool to adjust scaling limits — for example, to increase capacity before a large job or scale to zero after tasks complete.

### Request

```http
PATCH https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Discovery/supercomputers/{supercomputerName}/nodePools/{nodePoolName}?api-version=2026-02-01-preview
Content-Type: application/json
Authorization: Bearer <access-token>
```

### Scale up for a large task

```json
{
  "properties": {
    "maxNodeCount": 16
  }
}
```

### Scale to zero after tasks complete

```json
{
  "properties": {
    "minNodeCount": 0,
    "maxNodeCount": 0
  }
}
```

### Azure CLI equivalent

```bash
az rest --method PATCH \
  --url "https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Discovery/supercomputers/{supercomputerName}/nodePools/{nodePoolName}?api-version=2026-02-01-preview" \
  --body '{"properties": {"maxNodeCount": 16}}'
```

---

## Step 7: Monitor your resources

### Get Supercomputer status

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Discovery/supercomputers/{supercomputerName}?api-version=2026-02-01-preview
Authorization: Bearer <access-token>
```

### List node pools on a Supercomputer

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Discovery/supercomputers/{supercomputerName}/nodePools?api-version=2026-02-01-preview
Authorization: Bearer <access-token>
```

### List all Supercomputers in a resource group

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Discovery/supercomputers?api-version=2026-02-01-preview
Authorization: Bearer <access-token>
```

### List all Supercomputers in a subscription

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Discovery/supercomputers?api-version=2026-02-01-preview
Authorization: Bearer <access-token>
```

> [!TIP]
> List responses are paginated. If the response includes a `nextLink` property, make a GET request to that URL to retrieve the next page. Continue until `nextLink` is `null`.

---

## Step 8: Clean up resources

When your tasks are finished, delete the node pools first and then the Supercomputer.

### Delete a node pool

```http
DELETE https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Discovery/supercomputers/{supercomputerName}/nodePools/{nodePoolName}?api-version=2026-02-01-preview
Authorization: Bearer <access-token>
```

**Response:** `202 Accepted` (deletion in progress) or `204 No Content` (already deleted).

### Delete the Supercomputer

```http
DELETE https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Discovery/supercomputers/{supercomputerName}?api-version=2026-02-01-preview
Authorization: Bearer <access-token>
```

**Response:** `202 Accepted` (deletion in progress) or `204 No Content` (already deleted).

> [!WARNING]
> Deleting a Supercomputer removes all associated managed resources, including node pools and the managed resource group. This action cannot be undone. Ensure no active tasks are running before deletion.

---

## End-to-end example

This script walks through the full lifecycle: create a Supercomputer, add a GPU node pool, verify readiness, run a hypothetical task, then clean up.

### Set variables

```bash
SUBSCRIPTION_ID="00000000-0000-0000-0000-000000000000"
RESOURCE_GROUP="rg-discovery-prod"
SC_NAME="sc-ml-eastus"
NODEPOOL_NAME="gpu-a100"
API_VERSION="2026-02-01-preview"
SC_URL="https://management.azure.com/subscriptions/${SUBSCRIPTION_ID}/resourceGroups/${RESOURCE_GROUP}/providers/Microsoft.Discovery/supercomputers/${SC_NAME}"
NP_URL="${SC_URL}/nodePools/${NODEPOOL_NAME}"
```

### Create the Supercomputer

```bash
az rest --method PUT \
  --url "${SC_URL}?api-version=${API_VERSION}" \
  --body '{
    "location": "eastus",
    "properties": {
      "subnetId": "/subscriptions/'"${SUBSCRIPTION_ID}"'/resourceGroups/rg-network/providers/Microsoft.Network/virtualNetworks/vnet-discovery/subnets/snet-system",
      "managementSubnetId": "/subscriptions/'"${SUBSCRIPTION_ID}"'/resourceGroups/rg-network/providers/Microsoft.Network/virtualNetworks/vnet-discovery/subnets/snet-management",
      "systemSku": "Standard_D4s_v6",
      "identities": {
        "clusterIdentity": {
          "id": "/subscriptions/'"${SUBSCRIPTION_ID}"'/resourceGroups/rg-identity/providers/Microsoft.ManagedIdentity/userAssignedIdentities/id-sc-cluster"
        },
        "kubeletIdentity": {
          "id": "/subscriptions/'"${SUBSCRIPTION_ID}"'/resourceGroups/rg-identity/providers/Microsoft.ManagedIdentity/userAssignedIdentities/id-sc-kubelet"
        }
      }
    },
    "tags": { "environment": "production" }
  }'
```

### Wait for Supercomputer to be ready

```bash
while true; do
  STATE=$(az rest --method GET --url "${SC_URL}?api-version=${API_VERSION}" \
    --query "properties.provisioningState" -o tsv)
  echo "Supercomputer state: ${STATE}"
  [ "${STATE}" = "Succeeded" ] || [ "${STATE}" = "Failed" ] || [ "${STATE}" = "Canceled" ] && break
  sleep 30
done
```

### Create a GPU node pool

```bash
az rest --method PUT \
  --url "${NP_URL}?api-version=${API_VERSION}" \
  --body '{
    "location": "eastus",
    "properties": {
      "subnetId": "/subscriptions/'"${SUBSCRIPTION_ID}"'/resourceGroups/rg-network/providers/Microsoft.Network/virtualNetworks/vnet-discovery/subnets/snet-gpu",
      "vmSize": "Standard_NC24ads_A100_v4",
      "minNodeCount": 0,
      "maxNodeCount": 4,
      "scaleSetPriority": "Regular"
    },
    "tags": { "workload": "ai-training" }
  }'
```

### Wait for node pool to be ready

```bash
while true; do
  STATE=$(az rest --method GET --url "${NP_URL}?api-version=${API_VERSION}" \
    --query "properties.provisioningState" -o tsv)
  echo "Node pool state: ${STATE}"
  [ "${STATE}" = "Succeeded" ] || [ "${STATE}" = "Failed" ] || [ "${STATE}" = "Canceled" ] && break
  sleep 30
done
```

### Verify your infrastructure

```bash
# Check Supercomputer details
az rest --method GET --url "${SC_URL}?api-version=${API_VERSION}" \
  --query "{name:name, state:properties.provisioningState, sku:properties.systemSku}"

# List node pools
az rest --method GET --url "${SC_URL}/nodePools?api-version=${API_VERSION}" \
  --query "value[].{name:name, vmSize:properties.vmSize, min:properties.minNodeCount, max:properties.maxNodeCount, state:properties.provisioningState}"
```

### Clean up when tasks are done

```bash
# Delete node pool first
az rest --method DELETE --url "${NP_URL}?api-version=${API_VERSION}"
sleep 60

# Then delete the Supercomputer
az rest --method DELETE --url "${SC_URL}?api-version=${API_VERSION}"
```

---

## Error handling

All API operations return standard Azure Resource Manager error responses on failure:

```json
{
  "error": {
    "code": "ResourceNotFound",
    "message": "The Resource 'Microsoft.Discovery/supercomputers/my-sc' under resource group 'my-rg' was not found.",
    "target": "supercomputerName",
    "details": [],
    "additionalInfo": []
  }
}
```

### Common error codes

| HTTP status | Error code | Description |
|-------------|------------|-------------|
| 400 | `InvalidRequestContent` | The request body is malformed or missing required properties. |
| 404 | `ResourceNotFound` | The specified resource does not exist. |
| 409 | `Conflict` | The resource is in a state that conflicts with the request (for example, creating a node pool on a Supercomputer that is still provisioning). |
| 429 | `TooManyRequests` | Throttled. Retry after the interval in the `Retry-After` header. |

---

## Related content

- [Supercomputers REST API reference](/rest/api/discovery/supercomputers?view=rest-discovery-2026-02-01-preview)
- [Node Pools REST API reference](/rest/api/discovery/node-pools?view=rest-discovery-2026-02-01-preview)
