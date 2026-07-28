---
title: Managed Identities in Microsoft Discovery
description: Understand how Microsoft Discovery uses user-assigned managed identities (UAMIs) for authentication across workspaces, supercomputers, and bookshelves.
author: umamm
ms.author: umamm
ms.service: azure
ms.topic: concept-article
ms.date: 04/17/2026
---

# Managed identities in Microsoft Discovery

Microsoft Discovery uses user-assigned managed identities (UAMIs) to authenticate against Azure resources on your behalf. Rather than managing secrets or connection strings, you create a managed identity, grant it the necessary Azure roles, and provide its resource ID when you create Discovery resources. The Discovery platform then uses that identity to access storage accounts, container registries, AI services, and managed resource group (MRG) resources.

## Why user-assigned managed identities

Discovery requires user-assigned (not system-assigned) managed identities for the following reasons:

| Reason | Explanation |
|--------|------------|
| Customer ownership | You create, manage, and control the lifecycle of the identity in your own subscription. |
| Shared across resources | You can reuse a single UAMI across a workspace, supercomputer, and storage operations, which reduces management overhead. |
| E-provisioned role assignments | You assign roles before resource creation so that Discovery has the permissions that it needs from the start. |
| Immutable binding | The workspace identity and supercomputer cluster identity are bound at creation time and can't be changed later, which ensures a consistent security posture. You can update the supercomputer's kubelet and workload identities after creation. |

> [!IMPORTANT]
> The workspace identity and supercomputer cluster identity are *immutable* after creation. You can't change them after they're provisioned. You can update the supercomputer's kubelet and workload identities. Plan your identity strategy before you create resources.

## How Discovery uses your identity

When a workspace or supercomputer is created, the Discovery control plane:

- **Reads your UAMI**: Validates that the identity exists and that the service can operate on it.
- **Assigns itself Managed Identity Operator**: The Discovery service principal gets the Managed Identity Operator role on your UAMI so that it can use the identity for managed resource operations.
- **Uses the UAMI at runtime**: Tool runs on the supercomputer use the identity to pull container images and access blob storage. Agents use it to interact with Azure OpenAI and storage.

## Identity slots per resource type

Different Discovery resources use managed identities in different ways.

### Workspace

A workspace requires a single UAMI provided through the `workspaceIdentity` property. Discovery uses your UAMI to:

- **Identify your workspace**: UAMI is the security principal that binds the workspace to your subscription's resources.
- **Read and write data**: Azure Blob Storage accounts read and write data through storage containers.
- **Pull container images**: Container images are pulled from Azure Container Registry when you run tools on a supercomputer.

Discovery provisions and operates the MRG (Azure Cosmos DB, AI services, search indexes, and Azure OpenAI) by using its own service principals, not your UAMI. Your UAMI doesn't need roles on the MRG.

### Supercomputer

A supercomputer uses three identity slots, all of which can reference the same UAMI for simplicity or separate UAMIs for least privilege.

| Slot | Purpose |
|------|---------|
| Cluster identity | Used by the AKS control plane to manage cluster-level resources such as networking and load balancers. |
| Kubelet identity | Used at the node level to pull container images from Container Registry and access Azure resources. |
| Workload identity | Used as federated credentials by pods running tools and agents on the supercomputer. |

### Bookshelf

A bookshelf references your UAMI through its `workloadIdentities` property. Discovery uses its own service principals to provision and operate the bookshelf MRG (AI Search, SQL, AI Services). The service also creates a system-managed identity inside the bookshelf MRG for internal resource-to-resource authentication.

## Required role assignments

You must assign the following built-in roles to your UAMI *before* you create Discovery resources. Assign these roles at the *resource group* scope.

| Role | Role definition ID | Purpose |
|------|-------------------|---------|
| Microsoft Discovery Platform Contributor (preview) | `01288891-85ee-45a7-b367-9db3b752fc65` | Manage Discovery resources, such as workspaces, projects, agents, and tools. |
| Storage Blob Data Contributor | `ba92f5b4-2d11-453d-a403-e96b0029c9fe` | Read and write blobs in Azure Storage accounts. |
| AcrPull | `7f951dda-4ed3-4680-a7ca-43fe172d538d` | Pull container images from Container Registry. |

For other roles that are needed in specialized scenarios, see [Configure managed identities](how-to-configure-managed-identity.md#additional-roles-for-specific-scenarios).

## End-to-end identity flow across Discovery resources

When you deploy a complete Discovery stack, the platform creates three MRGs (workspace, bookshelf, and supercomputer). Each MRG contains Azure resources that the service manages.

### What the service manages automatically

When you create a workspace, bookshelf, or supercomputer, Discovery automatically:

- Creates role assignments on the MRG so that the service can provision and operate MRG resources. The resources include Microsoft Foundry, Azure Cosmos DB, Azure AI Search, Storage, Azure Key Vault, and Azure Kubernetes Service (AKS).
- Assigns Managed Identity Operator on your UAMI so that the service can use it for MRG deployments.
- Creates a system-managed identity inside each workspace and bookshelf MRG for internal resource-to-resource authentication (Azure Container Apps, Foundry, SQL).

You don't need to create or manage any of these identities or role assignments. They're fully lifecycle managed by the service.

### What you're responsible for

You're responsible for the following tasks:

- **Create your UAMI**: Assign the three core roles (Discovery Platform Contributor, Storage Blob Data Contributor, and AcrPull) before you create Discovery resources.
- **Provide the UAMI resource ID**: Enter the ID when you create a workspace or supercomputer.

### Your UAMI at runtime

Your UAMI is the identity that agents and tools use at runtime.

| Operation | Azure resource accessed | Required role |
|-----------|----------------------|---------------|
| Read/write data in storage containers | Azure Blob Storage | Storage Blob Data Contributor |
| Pull tool container images | Container Registry | AcrPull |
| Manage Discovery resources | Discovery resource provider | Microsoft Discovery Platform Contributor (preview) |
| Operate AKS cluster networking | Azure Virtual Network (VNet) subnets | Network Contributor (supercomputer cluster identity) |

For the supercomputer, your UAMI is used in three slots:

- **Cluster identity**: AKS control plane uses it to manage load balancers and networking.
- **Kubelet identity**: Node-level agent uses it to pull images from Container Registry and access Azure resources.
- **Workload identity**: Pods use federated credentials to run tools and agents.

For guidance on choosing between a single shared UAMI and separate identities per function, see [Managed identity best practice recommendations](/entra/identity/managed-identities-azure-resources/managed-identity-best-practice-recommendations).

## Advanced configuration: Granular role assignments per identity

The [required role assignments](#required-role-assignments) section describes the simplest approach where a single shared UAMI receives all three core roles at the resource group scope. For production environments that require tighter security control, assign separate UAMIs with least-privilege role assignments scoped to the specific resources that each identity accesses.

> [!IMPORTANT]
> The workload identity is accessible by agents through tool execution. Agents driven by large-language models (LLMs) invoke tools that use this identity at runtime, so minimizing the workload identity's permissions is critical. Only assign the permissions strictly necessary for tool operations. Broad permissions on the workload identity create risk if an agent uses the identity beyond its intended scope.

### Per-identity role assignments

The following table shows the recommended granular role assignment for each identity when you use separate UAMIs.

| Identity | Role | Scope | Purpose |
|----------|------|-------|---------|
| Workspace identity | Microsoft Discovery Platform Contributor (preview) | Resource group | Manage workspace resources such as projects, chat model deployments, and storage containers. |
| Workspace identity | Storage Blob Data Contributor | Storage account | Read/write workspace data, chat model artifacts, and project assets in the backing storage account. |
| Cluster identity | Platform-managed Network Contributor | Node resource group/VNet | Manage cluster-level networking, load balancers, and node resource group resources. |
| Cluster identity | Managed Identity Operator | Node resource group | Operate on managed identities for cluster workloads. |
| Kubelet identity | AcrPull | Resource group (covers Container Registry) | Pull container images for tool runs from any Container Registry provisioned in the resource group. |
| Kubelet identity | Storage Blob Data Contributor | Storage account | Read workload artifacts and inputs from the backing storage account during pod startup. |
| Workload identity | Storage Blob Data Contributor | Storage account | Access data during tool execution by agent workloads (federated identity). |

### Why separate identities improve security

When you use a single shared UAMI, the workload identity (which agents use through tool execution) inherits all roles, including Discovery Platform Contributor and AcrPull. This grants LLM-driven agents broader access than they need.

By separating identities:

- Workload identity receives only Storage Blob Data Contributor at the storage account level, which limits what agents can access through tools.
- Cluster identity receives networking and operator roles that are never exposed to agent workloads.
- Kubelet identity handles image pulls and pod startup data access, isolated from agent tool execution.

This separation ensures that even if an agent attempts to use its identity for operations beyond data access, the request fails because of insufficient permissions.

### When to use granular assignments

Use separate identities with scoped roles when:

- Your organization requires least-privilege access control.
- You run tools that process sensitive data and want to limit blast radius.
- Your compliance requirements mandate separation of control-plane and data-plane identities.
- You want to audit agent data access independently from infrastructure operations.

For guidance on choosing between shared and separate identities, see [Managed identity best practice recommendations](/entra/identity/managed-identities-azure-resources/managed-identity-best-practice-recommendations).

## Limitations

- The UAMI must be in the *same region* as the Discovery resource that uses it.
- The workspace identity and supercomputer cluster identity can't be changed after resource creation. You must delete and re-create the resource. You can update the supercomputer's kubelet and workload identities via `PATCH`.
- Role assignment propagation can take up to 10 minutes. Create role assignments before you create Discovery resources.
- Discovery requires the Managed Identity Operator role on your UAMI. If this role assignment fails during resource creation (for example, because of Azure Policy restrictions), the workspace provisioning fails.

## Related content

- For step-by-step instructions on how to create a UAMI and assign roles, see [Configure managed identities for Microsoft Discovery](how-to-configure-managed-identity.md).
- For built-in Discovery roles and persona-based assignment guidance, see [Role assignments in Microsoft Discovery](concept-role-assignments.md).
- For Storage account requirements, including identity access, see [Azure Blob Storage in Microsoft Discovery](concept-storage-account.md).
- For end-to-end setup, including UAMI creation, see [Quickstart: Deploy infrastructure by using the Azure portal](quickstart-infrastructure-portal.md).
- For Azure platform documentation on managed identities, see [What are managed identities for Azure resources?](/entra/identity/managed-identities-azure-resources/overview).
