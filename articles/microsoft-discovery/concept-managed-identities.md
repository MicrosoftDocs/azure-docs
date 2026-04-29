---
title: Managed identities in Microsoft Discovery
description: Understand how Microsoft Discovery uses user-assigned managed identities (UAMI) for authentication across workspaces, supercomputers, and bookshelves.
author: umamm
ms.author: umamm
ms.service: azure
ms.topic: concept-article
ms.date: 04/17/2026
---

# Managed identities in Microsoft Discovery

Microsoft Discovery uses **user-assigned managed identities (UAMI)** to authenticate against Azure resources on your behalf. Rather than managing secrets or connection strings, you create a managed identity, grant it the necessary Azure roles, and provide its resource ID when you create Discovery resources. The Discovery platform then uses that identity to access storage accounts, container registries, AI services, and managed resource group resources.

## Why user-assigned managed identities

Microsoft Discovery requires user-assigned (not system-assigned) managed identities for the following reasons:

| Reason | Explanation |
|--------|------------|
| **Customer ownership** | You create, manage, and control the lifecycle of the identity in your own subscription. |
| **Shared across resources** | A single UAMI can be reused across a workspace, supercomputer, and storage operations, reducing management overhead. |
| **Pre-provisioned role assignments** | You assign roles before resource creation, so the Discovery service has the permissions it needs from the start. |
| **Immutable binding** | The workspace identity and supercomputer cluster identity are bound at creation time and can't be changed later, ensuring a consistent security posture. The supercomputer's kubelet and workload identities can be updated after creation. |

> [!IMPORTANT]
> The workspace identity and supercomputer cluster identity are **immutable** after creation - you can't change them once provisioned. The supercomputer's kubelet and workload identities can be updated. Plan your identity strategy before creating resources.

## How Discovery uses your identity

When a workspace or supercomputer is created, the Discovery control plane:

1. **Reads your UAMI** - Validates the identity exists and the service can operate on it.
2. **Assigns itself Managed Identity Operator** - The Discovery service principal gets the Managed Identity Operator role on your UAMI so it can use the identity for managed resource operations.
3. **Uses the UAMI at runtime** - Tool runs on the supercomputer use the identity to pull container images and access blob storage. Agents use it to interact with Azure OpenAI and storage.

## Identity slots per resource type

Different Discovery resources use managed identities in different ways.

### Workspace

A workspace requires a single UAMI provided through the `workspaceIdentity` property. The Discovery service uses your UAMI to:

- **Identify your workspace** - the UAMI is the security principal that binds the workspace to your subscription's resources.
- **Read and write data** in your Azure Blob Storage accounts through storage containers.
- **Pull container images** from Azure Container Registry when running tools on a supercomputer.

The Discovery service provisions and operates the managed resource group (Cosmos DB, AI services, search indexes, Azure OpenAI) using its own service principals - not your UAMI. Your UAMI doesn't need roles on the managed resource group.

### Supercomputer

A supercomputer uses three identity slots, all of which can reference the same UAMI for simplicity, or separate UAMIs for least-privilege:

| Slot | Purpose |
|------|---------|
| **Cluster identity** | Used by the AKS control plane to manage cluster-level resources such as networking and load balancers. |
| **Kubelet identity** | Used at the node level to pull container images from Azure Container Registry and access Azure resources. |
| **Workload identity** | Used as federated credentials by pods running tools and agents on the supercomputer. |

### Bookshelf

A bookshelf references your UAMI through its `workloadIdentities` property. The Discovery service uses its own service principals to provision and operate the bookshelf managed resource group (AI Search, SQL, AI Services). The service also creates a system-managed identity inside the bookshelf MRG for internal resource-to-resource authentication.

## Required role assignments

You must assign the following built-in roles to your UAMI **before** creating Discovery resources. Assign these at the **resource group** scope.

| Role | Role definition ID | Purpose |
|------|-------------------|---------|
| Microsoft Discovery Platform Contributor (Preview) | `01288891-85ee-45a7-b367-9db3b752fc65` | Manage Discovery resources (workspaces, projects, agents, tools). |
| Storage Blob Data Contributor | `ba92f5b4-2d11-453d-a403-e96b0029c9fe` | Read and write blobs in Azure Storage accounts. |
| AcrPull | `7f951dda-4ed3-4680-a7ca-43fe172d538d` | Pull container images from Azure Container Registry. |

For additional roles needed in specialized scenarios, see [Configure managed identities](how-to-configure-managed-identity.md#additional-roles-for-specific-scenarios).

## End-to-end identity flow across Discovery resources

When you deploy a complete Discovery stack, the platform creates three managed resource groups (workspace MRG, bookshelf MRG, supercomputer MRG), each containing Azure resources managed by the service.

### What the service manages automatically

When you create a workspace, bookshelf, or supercomputer, the Discovery service automatically:

- Creates role assignments on the managed resource group so that the service can provision and operate MRG resources (AI Foundry, Cosmos DB, AI Search, Storage, Key Vault, AKS).
- Assigns **Managed Identity Operator** on your UAMI so the service can use it for MRG deployments.
- Creates a **system-managed identity** inside each workspace and bookshelf MRG for internal resource-to-resource authentication (Container Apps, Foundry, SQL).

You don't need to create or manage any of these identities or role assignments - they're fully lifecycle-managed by the service.

### What you're responsible for

You're responsible for:

- **Creating your UAMI** and assigning the three core roles (Discovery Platform Contributor, Storage Blob Data Contributor, AcrPull) before creating Discovery resources.
- **Providing the UAMI resource ID** when creating a workspace or supercomputer.


### Your UAMI at runtime

Your UAMI is the identity that agents and tools use at runtime:

| Operation | Azure resource accessed | Required role |
|-----------|----------------------|---------------|
| Read/write data in storage containers | Azure Blob Storage | Storage Blob Data Contributor |
| Pull tool container images | Azure Container Registry | AcrPull |
| Manage Discovery resources | Discovery RP | Microsoft Discovery Platform Contributor (Preview) |
| Operate AKS cluster networking | Virtual Network subnets | Network Contributor (supercomputer cluster identity) |

For the supercomputer, your UAMI is used in three slots:

- **Cluster identity** - AKS control plane uses it to manage load balancers and networking.
- **Kubelet identity** - Node-level agent uses it to pull images from ACR and access Azure resources.
- **Workload identity** - Federated credentials used by pods running tools and agents.

For guidance on choosing between a single shared UAMI and separate identities per function, see [Managed identity best practice recommendations](/entra/identity/managed-identities-azure-resources/managed-identity-best-practice-recommendations).

## Limitations

- The UAMI must be in the **same region** as the Discovery resource that uses it.
- The workspace identity and supercomputer cluster identity can't be changed after resource creation - you must delete and recreate the resource. The supercomputer's kubelet and workload identities can be updated via PATCH.
- Role assignment propagation can take up to 10 minutes. Create role assignments before creating Discovery resources.
- The Discovery service requires **Managed Identity Operator** on your UAMI. If this role assignment fails during resource creation (for example, due to Azure Policy restrictions), the workspace provisioning fails.

## Related content

- [Configure managed identities for Microsoft Discovery](how-to-configure-managed-identity.md) - Step-by-step instructions for creating a UAMI and assigning roles.
- [Role assignments in Microsoft Discovery](concept-role-assignments.md) - Built-in Discovery roles and persona-based assignment guidance.
- [Azure Blob Storage in Microsoft Discovery](concept-storage-account.md) - Storage account requirements including identity access.
- [Quickstart: Deploy infrastructure using Azure portal](quickstart-infrastructure-portal.md) — End-to-end setup including UAMI creation.
- [What are managed identities for Azure resources?](/entra/identity/managed-identities-azure-resources/overview) — Azure platform documentation on managed identities.
