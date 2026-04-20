---
title: Configure managed identities for Microsoft Discovery
description: Learn how to create and configure user-assigned managed identities (UAMI) for Microsoft Discovery workspaces, supercomputers, and bookshelves, including the required Azure role assignments.
ms.service: azure
ms.topic: how-to
ms.date: 04/17/2026
ms.author: umamm
author: umamm
ms.custom: identity, managed-identity, rbac
---

# Configure managed identities for Microsoft Discovery

Microsoft Discovery uses **user-assigned managed identities (UAMI)** to authenticate against Azure resources on your behalf. Every workspace and supercomputer requires a UAMI at creation time. This article explains how to create a UAMI, assign the required roles, and attach it to Discovery resources.

## How Discovery uses managed identities

When you create a Discovery workspace or supercomputer, you provide a UAMI resource ID. The Discovery service uses your identity to:

- **Read and write data** in your Azure Blob Storage accounts (storage containers and storage assets).
- **Pull container images** from Azure Container Registry when running tools on a supercomputer.
- **Operate AKS infrastructure** - the supercomputer uses three identity slots (cluster, kubelet, and workload) for node-level and pod-level access.

The Discovery service uses its own service principals (not your UAMI) to provision and operate resources inside the managed resource group.

> [!IMPORTANT]
> The workspace identity and supercomputer cluster identity are **immutable** after creation - you can't change them once provisioned. The supercomputer's kubelet and workload identities can be updated. Plan your identity strategy before creating resources.

## Identity strategy options

You can choose one of two approaches:

| Strategy | When to use |
|----------|------------|
| **Single UAMI** | Quickest setup. One identity gets all required roles. Recommended for proof-of-concept and small deployments. |
| **Separate UAMIs per function** | Better isolation. Use separate identities for the supercomputer (cluster, kubelet, workload) and the workspace. Recommended for production deployments with least-privilege requirements. |

Both approaches work with Microsoft Discovery. The quickstart guides use a single UAMI for simplicity.

## Prerequisites

- An active Azure subscription enabled for **Microsoft Discovery Public Preview**.
- **Managed Identity Contributor** role at the resource group or subscription level - required to create UAMI resources.
- **User Access Administrator** or **Owner** role at the resource group level - required to create role assignments on the UAMI.
- The `Microsoft.ManagedIdentity` resource provider [registered](concept-resource-provider-registration.md) in your subscription.

## Create a user-assigned managed identity

```azurecli
az identity create \
  --name "discovery-uami" \
  --resource-group "contoso-discovery-rg" \
  --location "eastus2"
```

Save the output values - you need `principalId` for role assignments and `id` (the full resource ID) when creating Discovery resources.

## Assign required roles

After creating the UAMI, assign the following Azure built-in roles at the **resource group** scope. Following are the minimum roles needed for a functional Discovery deployment.

### Core platform roles

| Role | Role definition ID | Purpose |
|------|-------------------|---------|
| **Microsoft Discovery Platform Contributor (Preview)** | `01288891-85ee-45a7-b367-9db3b752fc65` | Allows the UAMI to manage Discovery resources (workspaces, projects, agents, tools). |
| **Storage Blob Data Contributor** | `ba92f5b4-2d11-453d-a403-e96b0029c9fe` | Allows the UAMI to read and write blobs in Azure Storage accounts used by storage containers. |
| **AcrPull** | `7f951dda-4ed3-4680-a7ca-43fe172d538d` | Allows the UAMI to pull container images from Azure Container Registry for tool execution. |

### Additional roles for specific scenarios

| Role | Role definition ID | When needed |
|------|-------------------|-------------|
| **Cognitive Services OpenAI User** | `5e0bd9bd-7b93-4f28-af87-19fc36ad61bd` | When using Azure OpenAI chat model deployments with agents. Assigned by the service on the managed resource group. |
| **Managed Identity Operator** | `f1a07417-d97a-45cb-824c-7a7467783830` | The Discovery control plane assigns this role to itself on your UAMI during workspace creation (no action needed from you). |
| **Network Contributor** | `4d97b98b-1d4f-4787-a291-c67834d212e7` | When the workspace uses delegated subnets or NetApp volumes. |

### Assign the core roles

```azurecli
# Get the UAMI principal ID
UAMI_PRINCIPAL_ID=$(az identity show \
  --name "discovery-uami" \
  --resource-group "contoso-discovery-rg" \
  --query principalId -o tsv)

RG_ID=$(az group show \
  --name "contoso-discovery-rg" \
  --query id -o tsv)

# Microsoft Discovery Platform Contributor (Preview)
az role assignment create \
  --assignee-object-id "$UAMI_PRINCIPAL_ID" \
  --assignee-principal-type ServicePrincipal \
  --role "01288891-85ee-45a7-b367-9db3b752fc65" \
  --scope "$RG_ID"

# Storage Blob Data Contributor
az role assignment create \
  --assignee-object-id "$UAMI_PRINCIPAL_ID" \
  --assignee-principal-type ServicePrincipal \
  --role "ba92f5b4-2d11-453d-a403-e96b0029c9fe" \
  --scope "$RG_ID"

# AcrPull
az role assignment create \
  --assignee-object-id "$UAMI_PRINCIPAL_ID" \
  --assignee-principal-type ServicePrincipal \
  --role "7f951dda-4ed3-4680-a7ca-43fe172d538d" \
  --scope "$RG_ID"
```

## Attach the identity to a workspace

When creating a workspace, provide the UAMI resource ID in the `workspaceIdentity` property.

```azurecli
UAMI_ID=$(az identity show \
  --name "discovery-uami" \
  --resource-group "contoso-discovery-rg" \
  --query id -o tsv)

# Use the UAMI resource ID when creating the workspace
# See: how-to-manage-workspaces.md for full workspace creation steps
```

## Attach the identity to a supercomputer

A supercomputer uses three identity slots, all of which can reference the same UAMI for simplicity, or separate UAMIs for least-privilege.

| Identity slot | Purpose |
|--------------|---------|
| **Cluster identity** | Used by the AKS control plane to manage cluster-level resources. |
| **Kubelet identity** | Used at the node level to pull images and access Azure resources. |
| **Workload identity** | Used as federated credentials by pods running tools and agents. |

Provide the identity resource IDs when creating the supercomputer. For full creation steps, see [Manage supercomputers](how-to-manage-supercomputers.md).

> [!NOTE]
> The `workloadIdentities` property in the REST API is a dictionary where the key is the full UAMI resource ID, not an array.

## Verify the identity configuration

After creating your resources, verify that the UAMI is correctly configured.

```azurecli
# Check role assignments on the UAMI
az role assignment list \
  --assignee "$(az identity show --name discovery-uami --resource-group contoso-discovery-rg --query principalId -o tsv)" \
  --output table

# Verify the workspace identity
az rest --method GET \
  --url "https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Discovery/workspaces/{workspaceName}?api-version=2026-02-01-preview" \
  --query "properties.workspaceIdentity"
```

## Troubleshooting

### Storage access denied

**Symptom:** Storage container creation fails with `403 Forbidden` or you see `AuthorizationFailed` errors in activity logs.

**Cause:** The UAMI is missing the **Storage Blob Data Contributor** role on the storage account.

**Fix:**

```azurecli
az role assignment create \
  --assignee-object-id "{uamiPrincipalId}" \
  --assignee-principal-type ServicePrincipal \
  --role "Storage Blob Data Contributor" \
  --scope "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Storage/storageAccounts/{storageAccountName}"
```

> [!NOTE]
> Role assignment propagation can take up to 10 minutes. Retry the operation after waiting.

### Container image pull failures

**Symptom:** Tool runs fail with `ImagePullBackOff` errors on the supercomputer.

**Cause:** The UAMI is missing the **AcrPull** role on the Azure Container Registry.

**Fix:** Assign the AcrPull role to the UAMI at the ACR resource scope:

```azurecli
az role assignment create \
  --assignee-object-id "{uamiPrincipalId}" \
  --assignee-principal-type ServicePrincipal \
  --role "AcrPull" \
  --scope "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ContainerRegistry/registries/{acrName}"
```

### Workspace creation fails with identity error

**Symptom:** Workspace creation fails with `ManagedIdentityNotFound` or `LinkedAuthorizationFailed`.

**Cause:** The UAMI doesn't exist in the specified region, the resource ID is malformed, or the caller doesn't have permission to read the identity.

**Fix:**
1. Verify the UAMI exists: `az identity show --name {name} --resource-group {rg}`.
2. Ensure the UAMI is in the same region as the workspace.
3. Confirm you have **Reader** access to the identity resource.

### Chat model deployment fails

**Symptom:** Agent responses fail with authentication errors when calling Azure OpenAI.

**Cause:** The Cognitive Services OpenAI User role wasn't autoassigned on the managed resource group.

**Fix:** Check the managed resource group for the workspace and verify role assignments:

```azurecli
# Find the managed resource group name
az rest --method GET \
  --url "https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Discovery/workspaces/{workspaceName}?api-version=2026-02-01-preview" \
  --query "properties.managedResourceGroup"
```

If the role assignment is missing, contact Microsoft Support — autoassigned roles are managed by the Discovery service.

## Related content

- [Role assignments in Microsoft Discovery](concept-role-assignments.md)
- [Quickstart: Deploy infrastructure using Azure portal](quickstart-infrastructure-portal.md)
- [Quickstart: Deploy infrastructure using Bicep](quickstart-infrastructure-bicep.md)
- [Manage workspaces](how-to-manage-workspaces.md)
- [Manage supercomputers](how-to-manage-supercomputers.md)
- [Configure network security](how-to-configure-network-security.md)
- [What are managed identities for Azure resources?](/entra/identity/managed-identities-azure-resources/overview)
