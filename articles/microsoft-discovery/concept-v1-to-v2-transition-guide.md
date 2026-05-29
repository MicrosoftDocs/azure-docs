---
title: "Microsoft Discovery v1 to v2 transition: Resource retention and recreation guidance"
description: Understand which Microsoft Discovery resources can be retained and which must be recreated when transitioning from v1 to v2 APIs during the coexistence window.
author: mukesh-dua
ms.author: mukeshdua
ms.service: azure
ms.topic: concept-article
ms.date: 03/09/2026
ms.custom:
  - template-concept

#customer intent: As a Microsoft Discovery user, I want to understand the v1 to v2 transition guidance so that I can plan my migration with minimal friction.

---

# Microsoft Discovery v1 to v2 transition: Resource retention and recreation guidance

As Microsoft Discovery transitions from v1 to v2, there's a coexistence window where both versions are supported simultaneously. This article explains which resources you can keep, which must be recreated under v2, and what is deprecated, so you can plan your transition with confidence.

The guiding principles for the transition are:

- **No in-place migration**: v1 resources aren't upgraded to v2.
- **No cross-version references**: v1 and v2 resources can't reference each other.
- **Selective resource retention**: Some resources can be retained; others must be recreated.
- **v2-only capabilities**: Newer features and models (for example, newer GPT models) are only available in v2.

## Summary

| Resource | Keep | Recreate | Notes |
|---|---|---|---|
| Workspaces | No | Yes | Version-scoped |
| Projects | No | Yes | Tied to workspace version |
| Agents | No | Yes | v2 backend and behavior changes |
| Tools | No | Yes | Must be redeployed under v2; v1 tools can't be retained |
| Bookshelves / Knowledge Base | No | Yes | No cross-version references allowed |
| Data Containers | No | N/A | Deprecated in v2; replaced by Storage Containers |
| Data Assets | No | N/A | Deprecated in v2; replaced by Storage Assets |
| Models | No | N/A | Model resource is deprecated in v2; deploy scientific models in your own ML workspace |
| Supercomputers | No | Yes | Validate workflows after moving to v2 |
| Nodepools | No | Yes | Child resource of Supercomputer; must be recreated alongside the parent |

## Resources that must be recreated

### Discovery Workspaces

v1 workspaces must be recreated as v2 workspaces.

**Reason**: v1 and v2 workspaces are treated as distinct resource types. v2 workspaces are required to unlock v2-only features and models.

> [!NOTE]
> - There's no automatic migration path.
> - v1 workspaces remain functional until v1 APIs are retired.

### Discovery Projects

Projects must be recreated under a v2 workspace.

**Reason**: Projects are version-scoped to their parent workspace. Cross-version references between workspaces and projects are explicitly disallowed.

> [!NOTE]
> v2 projects can only exist inside v2 workspaces.

### Discovery Agents

Agents must be recreated under v2.

**Reason**: Agent v2 introduces backend and behavior changes. v1 agents can't reference v2 knowledge bases or v2 workspaces, and vice versa.

> [!NOTE]
> New agent creation is required to access v2 capabilities.

### Discovery Tools

You must recreate Tools under v2. v1 tools can't be retained or referenced by v2 resources.

**Reason**: v2 resources can only reference tools deployed within v2. Although tool functionality doesn't change between v1 and v2, you must redeploy each tool in your v2 workspace.

### Bookshelves / Knowledge Base

Bookshelves and Knowledge Base (KB) resources must be recreated under v2.

**Reason**: Bookshelf/KB is tightly coupled to the agent and workspace version. Cross-version linking isn't allowed by design.

> [!NOTE]
> Data must be reindexed under v2 Bookshelf resources.

### Discovery Supercomputers and Discovery Nodepools

Supercomputer resources and their child Nodepool resources must be recreated in v2. Nodepool is a child resource of Supercomputer and follows the same transition rules—v1 Nodepools can't be carried over to a v2 Supercomputer.

**Reason**: There's no in-place upgrade path for Supercomputer or Nodepool resources. A v2 Supercomputer can't reference Nodepools that were created under a v1 Supercomputer, and vice versa.

> [!NOTE]
> - All Nodepools associated with a v1 Supercomputer must also be recreated under the new v2 Supercomputer.
> - Supercomputer tools are evolving with Agent v2 support; data-plane and tool-calling improvements are landing post-3.1.

**Guidance**:
1. Create a new v2 Supercomputer resource.
2. Recreate all required Nodepools under the new v2 Supercomputer.
3. Revalidate your workflows and tool configurations after moving to v2 agents.
4. Ensure the Supercomputer's managed identity has the appropriate role assignments needed for scientific model access (see [Models](#models) section).

## Deprecated resources and their v2 replacements

### Discovery DataContainers and Discovery DataAssets

> [!IMPORTANT]
> Discovery Data Containers and Discovery Data Assets are deprecated in v2. These resource types are replaced by Discovery Storage Containers and Discovery Storage Assets respectively.

In v2, Microsoft Discovery introduces new resource types for managing data storage and assets. The v1 Data Container and Data Asset resources aren't carried forward and have no migration path. You must create new Storage Container and Storage Asset resources in v2.

**v1 to v2 resource mapping**:

| v1 Resource | v2 Replacement |
|---|---|
| Data Container | Storage Container |
| Data Asset | Storage Asset |

**Key points**:
- Data Container and Data Asset resources created in v1 aren't accessible from v2 APIs.
- You must create Storage Container and Storage Asset resources under your v2 workspace.
- Storage Container and Storage Asset are the only supported resource types for data management in v2.
- Plan to re-register or reonboard any data assets that were managed through v1 Data Container or Data Asset resources.

**Guidance**:
1. Identify all existing v1 Data Container and Data Asset resources in your workspace.
2. Create equivalent Storage Container resources in your v2 workspace.
3. Re-register data as Storage Asset resources under the new v2 Storage Containers.
4. Update any agents, tools, or workflows that previously referenced v1 Data Container or Data Asset resource identifiers.

## Resources with special considerations

### Models

> [!IMPORTANT]
> The Microsoft Discovery Model resource is deprecated in v2. You must deploy scientific models in your own Azure Machine Learning workspace.

In v2, Microsoft Discovery no longer manages model deployments as a platform resource. Customers are responsible for provisioning and managing scientific models directly in their own Azure Machine Learning (AML) workspace.

**Key points**:
- The Discovery Model resource isn't available in v2.
- The managed identity used by the Supercomputer must have appropriate access (for example, `Azure AI Developer` or equivalent role) to the Azure Machine Learning workspace so that the tool client can submit inference requests to the model.
- Ensure your Azure Machine Learning model deployment endpoint is reachable from the Supercomputer's network context.

**Guidance**:
1. Create or use an existing Azure Machine Learning workspace in your subscription.
2. Deploy the required model in that Azure Machine Learning workspace.
3. Assign the Supercomputer's managed identity the appropriate role on the Azure Machine Learning workspace or model deployment.
4. Configure your Discovery tool to reference the Azure Machine Learning endpoint for model inference.

## What is deprecated

The following are deprecated and will be removed after the coexistence window ends:

- **v1 APIs**: Will be fully retired after the coexistence window closes.
- **Cross-version references**: Explicitly disallowed—v1 and v2 resources can't reference each other.
- **Data Container**: Deprecated in v2 and replaced by Storage Container.
- **Data Asset**: Deprecated in v2 and replaced by Storage Asset.
- **Discovery model resource**: The model resource is deprecated in v2. Deploy models in your own Azure Machine Learning workspace and grant the Supercomputer's managed identity access for submitting inference requests.

## Design principles

The v1 to v2 transition is designed to:

- Avoid complex migration logic and hidden coupling between resource versions.
- Ensure clean deletion semantics and consistency checks.
- Drive early adoption of v2, where active innovation is happening.

## Related content

- [Collect Microsoft Discovery v1 resource configurations](how-to-collect-v1-configurations.md)
- [Recreate Microsoft Discovery resources in v2](how-to-recreate-v2-resources.md)
- [What is Microsoft Discovery?](overview-what-is-microsoft-discovery.md)
