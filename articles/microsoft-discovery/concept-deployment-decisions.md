---
title: Microsoft Discovery architecture decisions
description: Learn which Microsoft Discovery settings you can't change after you create a resource, and compare the architecture options for networking, identities, encryption, and regions.
author: loubigard
ms.author: loubigard
ms.service: azure
ms.topic: concept-article
ms.date: 11/04/2026
ms.custom: networking, security

#CustomerIntent: As a platform administrator, I want to understand which Microsoft Discovery settings are fixed at creation so that I can make the right architecture decisions before I deploy.
---

# Microsoft Discovery architecture decisions and fixed settings

You fix several Discovery settings when you create a resource, including tags, the workspace and cluster identities, the encryption model, the supercomputer outbound type, and subnet bindings. Changing these settings later means deleting and re-creating the workspace, supercomputer, or bookshelf. This article lists those decisions, the options for each, and where to find the configuration details, so you can agree on them with your security, network, and platform owners before your first deployment.

For deployment paths, prerequisites and their owners, and the onboarding tool stages, see [Microsoft Discovery deployment planning overview](concept-deployment-planning.md).

## Settings fixed at creation

| Setting | Resource | Can you change it after creation? | More information |
| --- | --- | --- | --- |
| Tags, such as `NetworkIsolation`, `discovery.overridemrgregion`, and `discovery.enableprivatecluster` | Workspace, supercomputer, node pool, bookshelf | No. Any tag change requires redeploying the resource. | [Quickstart: Deploy infrastructure](quickstart-infrastructure.md) |
| Workspace identity | Workspace | No | [Managed identities](concept-managed-identities.md#limitations) |
| Cluster identity | Supercomputer | No | [Managed identities](concept-managed-identities.md#limitations) |
| Kubelet and workload identities | Supercomputer | Yes, by using `PATCH` | [Managed identities](concept-managed-identities.md#limitations) |
| Customer-managed keys or Microsoft-managed keys | Workspace, supercomputer, bookshelf | No | [Configure customer-managed keys](howto-data-encryption-at-rest.md) |
| `outboundType` and `managementSubnetId` | Supercomputer | No | [Configure secure networking for a supercomputer](how-to-configure-supercomputer-network-security.md) |
| Subnets | Workspace, supercomputer, node pool, bookshelf | No | [Configure network security](how-to-configure-network-security.md) |
| VM size and scale set priority | Node pool | No. Add another node pool instead. | [Manage supercomputers by using REST APIs](how-to-manage-supercomputers-rest-api.md) |
| `publicNetworkAccess` | Workspace, bookshelf | Yes | [Disable public network access](how-to-configure-network-security.md#disable-public-network-access-optional) |
| Private endpoints and private DNS | Workspace, bookshelf | Yes | [Create private endpoints](how-to-configure-network-security.md#create-private-endpoints-for-data-plane-access) |
| Role assignments for users and groups | All | Yes | [Role assignments](concept-role-assignments.md) |

## Data-plane network access

The system enables network hardening of managed resources by default for every workspace and bookshelf. You decide whether clients reach the data plane privately.

| Option | What you get | Choose it when |
| --- | --- | --- |
| [Quickstart deployment](quickstart-infrastructure.md) | Managed resources protected by a Network Security Perimeter (NSP), public data-plane endpoints protected by Microsoft Entra ID | Evaluations and environments without private-network requirements |
| [Network-hardened deployment](how-to-deploy-network-hardened-stack.md) | Private endpoints for the workspace and bookshelf data planes, and network-hardened customer storage | Regulated data, landing zones that deny public endpoints, or private-only access requirements |

Plan the client access path, such as VPN, Azure ExpressRoute, or virtual network peering, before you set `publicNetworkAccess` to `Disabled`. With public access disabled, requests from the public internet receive `403 Forbidden`. Private endpoints must be in the same region as the Discovery resource. For details, see [Network security](concept-network-security.md).

## Supercomputer egress and management plane

The `outboundType` setting and the management subnet decide how supercomputer traffic leaves your virtual network and how the Discovery service reaches the cluster management plane.

| Option | Outbound traffic | Management plane | Requirements |
| --- | --- | --- | --- |
| `LoadBalancer` (default) | Unrestricted outbound access through a managed public IP | Public IP. Register the `Microsoft.ContainerService/EnableServiceTagAuthorizedIPPreview` feature to restrict it to the Discovery service. | Management subnet optional, recommended for defense in depth |
| `UserDefinedRouting` | Through your Azure Firewall or network virtual appliance, with no managed public IP for egress | Public IP restricted to the Discovery service when the feature is registered | Management subnet, route table, and firewall rules in place before you create the supercomputer |
| Private supercomputer | Through your Azure Firewall or network virtual appliance | No public IP. Discovery reaches the management plane over Azure Private Link. | `UserDefinedRouting`, a management subnet, Private Link service network policies disabled, a default route to Azure Firewall or a network virtual appliance, and the `discovery.enableprivatecluster` tag |

If an Azure Policy assignment denies public IP creation, use `UserDefinedRouting`. For more information, see [Known issues](known-issues.md#azure-policy-blocks-public-ip-creation-during-supercomputer-deployment).

For the firewall rules and management subnet requirements, see [Configure secure networking for a supercomputer](how-to-configure-supercomputer-network-security.md) and [Management subnet ID requirements](how-to-configure-network-security.md#management-subnet-id-requirements).

## Identities

| Option | Trade-off |
| --- | --- |
| One shared user-assigned managed identity | Simplest to set up. The workload identity, which agents use through tool execution, inherits every role, including Discovery Platform Contributor and AcrPull. |
| Separate identities for each slot | More setup. The workload identity receives only Storage Blob Data Contributor on the storage account. |

Use separate identities when your organization requires least-privilege access, when tools process sensitive data, or when you must separate control-plane and data-plane identities. For the recommended role assignments for each identity, see [Granular role assignments per identity](concept-managed-identities.md#advanced-configuration-granular-role-assignments-per-identity).

## Encryption keys

Microsoft-managed keys require no action. Customer-managed keys need an Azure Key Vault with soft delete and purge protection, an RSA key, and a user-assigned managed identity with the Key Vault Crypto Service Encryption User role, all in the same region as the Discovery resource.

Choose the key model when you create each workspace, supercomputer, and bookshelf. Discovery requires an explicit key version, so plan to update each Discovery resource after you rotate the key. For details, see [Configure customer-managed keys](howto-data-encryption-at-rest.md) and [Rotate a customer-managed key](howto-data-encryption-at-rest.md#rotate-a-customer-managed-key).

## Regions

| Option | Resource placement |
| --- | --- |
| Single region | All resources in one supported region: East US, Sweden Central, or UK South |
| Cross-region | Discovery resources and their managed resource groups in a supported home region, the resources inside the managed resource groups, and your virtual network, storage, container registry, and identities, in one target region |

For a cross-region deployment, apply the `discovery.overridemrgregion` tag when you create each workspace, supercomputer, and bookshelf, and confirm that the target region supports the required Microsoft Foundry features. For details, including how data moves between regions, see [Deploy Microsoft Discovery across Azure regions](how-to-deploy-across-regions.md).

## Workspaces, virtual networks, and subnets

- Each workspace, bookshelf, and supercomputer requires its own non-overlapping subnets. You can't share delegated subnets between Azure Container Apps environments. See [Subnet requirements for workspaces and bookshelves](how-to-configure-network-security.md#subnet-requirements-for-workspaces-and-bookshelves).
- The quickstart uses a separate virtual network for each workspace. See [Quickstart: Deploy infrastructure](quickstart-infrastructure.md).
- Leave room in the private endpoint subnets for future endpoints, because you can't change subnets after creating the resources that use them.
- Projects in a workspace share its supercomputer and chat model deployments. Use [project-level access control](concept-project-rbac.md) to separate teams within a workspace, and separate workspaces when network, identity, or model boundaries must differ.

## Workbench features

Decide on the workbench tags when you create the workspace.

| Tag | Effect |
| --- | --- |
| `NetworkIsolation` | Set to `false` to enable public access to the preview workbench and other managed resource group resources. When you keep network isolation enabled, connect to the workspace's virtual network through VPN or ExpressRoute to use the workbench. |
| `discovery.workbench.enableGhcpAiFeatures` | Enables GitHub Copilot and AI features. Users need a GitHub account. |
| `discovery.workbench.enableExtensions` | Enables the Visual Studio Code Extension Marketplace. |

The Bicep template in the quickstart sets the GitHub Copilot and extension tags to `true`. Set them to `false` if your organization hasn't approved these features. For details, see [Use GitHub Copilot in Microsoft Discovery](how-to-copilot.md).

## Project storage

- Discovery Studio downloads files directly from the browser to Blob Storage, so plan a network path from your clients to the storage account. See [Configure project storage](how-to-configure-project-storage.md).
- For private-only storage, use the [network-hardened customer storage](how-to-deploy-network-hardened-stack.md#step-4-add-network-hardened-customer-blob-storage) configuration.
- Choose a [redundancy option](/azure/storage/common/storage-redundancy) that meets your residency requirements. Geo-redundant options copy data to a secondary region.

## Compute and quota

- Plan model, VM family, and Azure Container Apps quota before deployment. See [Quota reservations](concept-quota-reservation.md).
- Use `Regular` priority for jobs that can't restart, and `Spot` only for restartable work.
- Discovery manages AKS upgrades automatically. Make long-running tools restartable. See [Supercomputer AKS upgrades](concept-supercomputer-aks-upgrades.md).

## Bookshelf

- A bookshelf needs its own search subnet and private endpoint subnet.
- Choose the `indexSize` tag before you create the bookshelf. See [Resource quota requirements](how-to-index-bookshelf-knowledgebase.md#resource-quota-requirements).
- Bookshelf infrastructure, including Azure AI Search, Azure Container Apps, and Azure SQL Database, runs continuously after deployment. See [Quota reservations](concept-quota-reservation.md).

## Business continuity

Discovery doesn't replicate customer state between regional deployments. To recover from a regional outage, plan a secondary deployment with replication for your storage accounts and container registry. See [Business continuity and disaster recovery](concept-discovery-business-continuity-disaster-recovery.md).

## Related content

- [Microsoft Discovery deployment planning overview](concept-deployment-planning.md)
- [Quickstart: Deploy Microsoft Discovery infrastructure](quickstart-infrastructure.md)
- [End-to-end network-hardened deployment](how-to-deploy-network-hardened-stack.md)
- [Security and compliance overview](concept-security-overview.md)
