---
title: How to manage Microsoft Discovery Supercomputers using REST API
description: Learn how to create, retrieve, update, list, and delete Supercomputer resources in Azure Discovery using the REST API.
author: anzaman
ms.author: alzam
ms.service: azure
ms.topic: how-to
ms.date: 04/08/2026
---

# How to manage Supercomputers using the REST API

This article shows you how to manage Azure Discovery Supercomputer resources by using the REST API. You learn how to create, retrieve, update, list, and delete Supercomputer resources in your Azure subscription.

A Supercomputer provides dedicated compute infrastructure for running workloads on the Azure Discovery platform. It manages an AKS-backed cluster with configurable networking, identity, and encryption settings.

## Prerequisites

- An Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/).
- A resource group in a supported region.
- Azure CLI installed, or another tool to make authenticated REST calls (such as `curl` or Postman).
- The following user-assigned managed identities created in your subscription:
  - **Cluster identity** — used by the Supercomputer control plane.
  - **Kubelet identity** — used at the node level to access Azure resources. Must have the `ManagedIdentityOperator` role on the cluster identity.
  - **Workload identities** — used by workloads as federated credentials running on the Supercomputer.
- A virtual network with:
  - A **system subnet** for the managed node pool.
  - A **management subnet** delegated to `Microsoft.ContainerService/managedClusters` for the AKS API server.

### API version

All examples in this article use API version `2026-02-01-preview`.

### Authentication

All requests require an Azure Active Directory (Microsoft Entra ID) bearer token with the `user_impersonation` scope. To acquire a token using Azure CLI:

```bash
az account get-access-token --resource https://management.azure.com
```

Include the token in the `Authorization` header of every request:

```http
Authorization: Bearer <access-token>
```

## Create a Supercomputer

To create a Supercomputer, send a `PUT` request with the required properties.

### Request

```http
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Discovery/supercomputers/{supercomputerName}?api-version=2026-02-01-preview
Content-Type: application/json
Authorization: Bearer <access-token>
```

### URI parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `subscriptionId` | string (UUID) | The ID of the target subscription. |
| `resourceGroupName` | string | The name of the resource group (1–90 characters, case-insensitive). |
| `supercomputerName` | string | Name of the Supercomputer. Must match the pattern `^[a-zA-Z0-9-]{3,24}$`. |

### Request body

```json
{
  "location": "uksouth",
  "tags": {
    "environment": "production",
    "team": "data-science",
    "version": "v2"
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
      },
      "workloadIdentities": {
        "/subscriptions/{subscriptionId}/resourceGroups/{identityRG}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{workloadIdentityName}": {}
      }
    }
  }
}
```

### Required properties

| Property | Type | Description |
|----------|------|-------------|
| `location` | string | The Azure region where the resource is created. |
| `properties.subnetId` | string (ARM ID) | System subnet for the managed node pool. Must have connectivity to child node pool subnets. |
| `properties.identities.clusterIdentity.id` | string (ARM ID) | User-assigned identity for the Supercomputer control plane. |
| `properties.identities.kubeletIdentity.id` | string (ARM ID) | User-assigned identity for node-level resource access. Must have `ManagedIdentityOperator` role on the cluster identity. |

### Optional properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `properties.managementSubnetId` | string (ARM ID) | — | Subnet for the AKS API server. Must be delegated to `Microsoft.ContainerService/managedClusters`. |
| `properties.outboundType` | string | `LoadBalancer` | Network egress type: `LoadBalancer` or `None`. If `None`, you are responsible for outbound connectivity. |
| `properties.systemSku` | string | `Standard_D4s_v6` | VM SKU for the system node pool. See [Supported SKUs](#supported-system-skus). |
| `properties.identities.workloadIdentities` | object | — | Dictionary of user-assigned identities for workloads. Keys are the ARM resource IDs of the identity resources. |
| `properties.customerManagedKeys` | string | `Disabled` | Set to `Enabled` to use customer-managed keys for data-at-rest encryption. |
| `properties.diskEncryptionSetId` | string (ARM ID) | — | Required when `customerManagedKeys` is `Enabled`. |
| `properties.logAnalyticsClusterId` | string (ARM ID) | — | Required when `customerManagedKeys` is `Enabled`. Used for debug logs. |
| `tags` | object | — | Key-value pairs for resource tagging. |

### Response

- **200 OK** — The Supercomputer was updated (already existed).
- **201 Created** — The Supercomputer is being created. The response includes `Azure-AsyncOperation` and `Retry-After` headers for tracking the long-running operation.

#### Example response (201 Created)

```json
{
  "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Discovery/supercomputers/{supercomputerName}",
  "name": "{supercomputerName}",
  "type": "Microsoft.Discovery/supercomputers",
  "location": "uksouth",
  "tags": {
    "environment": "production",
    "team": "data-science"
  },
  "systemData": {
    "createdBy": "user@contoso.com",
    "createdByType": "User",
    "createdAt": "2026-04-08T10:00:00Z",
    "lastModifiedBy": "user@contoso.com",
    "lastModifiedByType": "User",
    "lastModifiedAt": "2026-04-08T10:00:00Z"
  },
  "properties": {
    "provisioningState": "Accepted",
    "subnetId": "/subscriptions/.../subnets/systemSubnet",
    "managementSubnetId": "/subscriptions/.../subnets/mgmtSubnet",
    "outboundType": "LoadBalancer",
    "systemSku": "Standard_D4s_v6",
    "identities": {
      "clusterIdentity": {
        "id": "/subscriptions/.../userAssignedIdentities/clusterIdentity"
      },
      "kubeletIdentity": {
        "id": "/subscriptions/.../userAssignedIdentities/kubeletIdentity"
      },
      "workloadIdentities": {
        "/subscriptions/.../userAssignedIdentities/workloadId1": {
          "principalId": "00000000-0000-0000-0000-000000000001",
          "clientId": "00000000-0000-0000-0000-000000000002"
        }
      }
    },
    "managedResourceGroup": "mrg-supercomputer-abc123"
  }
}
```

### Track the long-running operation

Creation is asynchronous. Poll the URL in the `Azure-AsyncOperation` response header until `provisioningState` changes to `Succeeded`, `Failed`, or `Canceled`.

```bash
az rest --method GET --url "<Azure-AsyncOperation URL>"
```

### Azure CLI equivalent

```bash
az rest --method PUT \
  --url "https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Discovery/supercomputers/{supercomputerName}?api-version=2026-02-01-preview" \
  --body @supercomputer-create.json
```

---

## Get a Supercomputer

Retrieve the details of an existing Supercomputer.

### Request

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Discovery/supercomputers/{supercomputerName}?api-version=2026-02-01-preview
Authorization: Bearer <access-token>
```

### Response (200 OK)

Returns the full Supercomputer resource object, including `provisioningState`, networking, identity, and encryption settings. See the [Create response example](#example-response-201-created) for the schema.

### Azure CLI equivalent

```bash
az rest --method GET \
  --url "https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Discovery/supercomputers/{supercomputerName}?api-version=2026-02-01-preview"
```

---

## Update a Supercomputer

Update the tags or workload identities of an existing Supercomputer. Not all properties are updatable after creation — only `tags` and `properties.identities.workloadIdentities` can be modified via PATCH.

### Request

```http
PATCH https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Discovery/supercomputers/{supercomputerName}?api-version=2026-02-01-preview
Content-Type: application/json
Authorization: Bearer <access-token>
```

### Request body

```json
{
  "tags": {
    "environment": "staging",
    "costCenter": "12345"
  },
  "properties": {
    "identities": {
      "workloadIdentities": {
        "/subscriptions/{subscriptionId}/resourceGroups/{identityRG}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{newWorkloadIdentity}": {}
      }
    }
  }
}
```

### Response

- **200 OK** — The update completed synchronously.
- **202 Accepted** — The update is in progress. Poll using the `Location` header.

### Azure CLI equivalent

```bash
az rest --method PATCH \
  --url "https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Discovery/supercomputers/{supercomputerName}?api-version=2026-02-01-preview" \
  --body @supercomputer-update.json
```

---

## List Supercomputers

### List by resource group

Retrieve all Supercomputers in a resource group.

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Discovery/supercomputers?api-version=2026-02-01-preview
Authorization: Bearer <access-token>
```

### List by subscription

Retrieve all Supercomputers across all resource groups in a subscription.

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Discovery/supercomputers?api-version=2026-02-01-preview
Authorization: Bearer <access-token>
```

### Response (200 OK)

Both endpoints return a paginated list:

```json
{
  "value": [
    {
      "id": "/subscriptions/.../supercomputers/sc-prod-01",
      "name": "sc-prod-01",
      "location": "uksouth",
      "type": "Microsoft.Discovery/supercomputers",
      "properties": {
        "provisioningState": "Succeeded",
        "..."
      }
    }
  ],
  "nextLink": "https://management.azure.com/...?$skiptoken=..."
}
```

If `nextLink` is present, make a GET request to that URL to retrieve the next page of results. Continue until `nextLink` is `null`.

### Azure CLI equivalent

```bash
# List by resource group
az rest --method GET \
  --url "https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Discovery/supercomputers?api-version=2026-02-01-preview"

# List by subscription
az rest --method GET \
  --url "https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Discovery/supercomputers?api-version=2026-02-01-preview"
```

---

## Delete a Supercomputer

Delete a Supercomputer and its managed resources.

### Request

```http
DELETE https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Discovery/supercomputers/{supercomputerName}?api-version=2026-02-01-preview
Authorization: Bearer <access-token>
```

### Response

- **202 Accepted** — Deletion is in progress. Track via the `Location` and `Retry-After` headers.
- **204 No Content** — The resource does not exist (already deleted).

> [!WARNING]
> Deleting a Supercomputer removes all associated managed resources, including the managed resource group and its contents. This action cannot be undone. Ensure no active workloads are running on the Supercomputer before deletion.

### Azure CLI equivalent

```bash
az rest --method DELETE \
  --url "https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Discovery/supercomputers/{supercomputerName}?api-version=2026-02-01-preview"
```

---

## Supercomputer resource properties

### Provisioning states

The `provisioningState` property tracks the lifecycle status of the resource:

| State | Description |
|-------|-------------|
| `Accepted` | The create or update request has been accepted. |
| `Provisioning` | The resource is being provisioned. |
| `Updating` | The resource is being updated. |
| `Succeeded` | The resource has been created or updated successfully. |
| `Failed` | The operation failed. Check the error details. |
| `Canceled` | The operation was canceled. |
| `Deleting` | The resource is being deleted. |

### Supported system SKUs

The `systemSku` property controls the VM size for the system node pool:

| SKU | Description |
|-----|-------------|
| `Standard_D4s_v6` | 4 vCPUs, latest generation (default) |
| `Standard_D4s_v5` | 4 vCPUs, previous generation |
| `Standard_D4s_v4` | 4 vCPUs, older generation |

### Network egress types

| Type | Description |
|------|-------------|
| `LoadBalancer` | Public outbound network via a managed load balancer (default). |
| `None` | No default outbound connectivity. You must provide your own outbound connectivity (for example, via Azure Firewall or NAT gateway). |

### Identities

Supercomputers use three categories of managed identities:

| Identity | Required | Purpose |
|----------|----------|---------|
| **Cluster identity** | Yes | Used by the Supercomputer control plane to manage Azure resources. |
| **Kubelet identity** | Yes | Used at the node level to pull images and access Azure resources. Must have `ManagedIdentityOperator` role on the cluster identity. |
| **Workload identities** | No | User-assigned identities available to workloads running on the Supercomputer as federated credentials. |

### Customer-managed keys

To encrypt data at rest with your own keys:

1. Set `customerManagedKeys` to `Enabled`.
2. Provide `diskEncryptionSetId` — the ARM resource ID of your Disk Encryption Set.
3. Provide `logAnalyticsClusterId` — the ARM resource ID of a Log Analytics Cluster for debug logs.

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

| HTTP Status | Error Code | Description |
|-------------|------------|-------------|
| 400 | `InvalidRequestContent` | The request body is malformed or missing required properties. |
| 404 | `ResourceNotFound` | The specified Supercomputer or resource group does not exist. |
| 409 | `Conflict` | The resource is in a state that conflicts with the request (for example, updating while provisioning). |
| 429 | `TooManyRequests` | Throttled. Retry after the interval specified in the `Retry-After` header. |

---

## End-to-end example

This section walks through a complete lifecycle: create a Supercomputer, wait for provisioning, verify it, update tags, then clean up.

### Step 1: Set variables

```bash
SUBSCRIPTION_ID="00000000-0000-0000-0000-000000000000"
RESOURCE_GROUP="rg-discovery-prod"
SC_NAME="sc-prod-eastus"
API_VERSION="2026-02-01-preview"
BASE_URL="https://management.azure.com/subscriptions/${SUBSCRIPTION_ID}/resourceGroups/${RESOURCE_GROUP}/providers/Microsoft.Discovery/supercomputers/${SC_NAME}"
```

### Step 2: Create the Supercomputer

```bash
az rest --method PUT \
  --url "${BASE_URL}?api-version=${API_VERSION}" \
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
    "tags": {
      "environment": "production"
    }
  }'
```

### Step 3: Wait for provisioning

```bash
# Poll until provisioningState is "Succeeded"
while true; do
  STATE=$(az rest --method GET --url "${BASE_URL}?api-version=${API_VERSION}" \
    --query "properties.provisioningState" -o tsv)
  echo "Provisioning state: ${STATE}"
  if [ "${STATE}" = "Succeeded" ] || [ "${STATE}" = "Failed" ] || [ "${STATE}" = "Canceled" ]; then
    break
  fi
  sleep 30
done
```

### Step 4: Add a workload identity

```bash
az rest --method PATCH \
  --url "${BASE_URL}?api-version=${API_VERSION}" \
  --body '{
    "properties": {
      "identities": {
        "workloadIdentities": {
          "/subscriptions/'"${SUBSCRIPTION_ID}"'/resourceGroups/rg-identity/providers/Microsoft.ManagedIdentity/userAssignedIdentities/id-workload-indexing": {}
        }
      }
    }
  }'
```

### Step 5: Verify the update

```bash
az rest --method GET \
  --url "${BASE_URL}?api-version=${API_VERSION}" \
  --query "properties.identities.workloadIdentities"
```

### Step 6: Clean up (delete)

```bash
az rest --method DELETE \
  --url "${BASE_URL}?api-version=${API_VERSION}"
```

---

## Related content

- [Supercomputers REST API reference](/rest/api/discovery/supercomputers?view=rest-discovery-2026-02-01-preview&preserve-view=true)
