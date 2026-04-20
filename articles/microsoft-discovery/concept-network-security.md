---
title: Network security for Microsoft Discovery
description: Understand how Microsoft Discovery uses Network Security Perimeters and private endpoints to protect managed resources and data-plane traffic.
ms.service: azure
ms.topic: concept-article
ms.date: 03/30/2026
ms.author: umamm
author: umamm
ms.custom: networking, private-link, nsp
---

# Network security for Microsoft Discovery

Microsoft Discovery provides two layers of network security to protect your workspace resources and data-plane traffic:

| Layer | What it protects | How it works |
|-------|-----------------|--------------|
| **Network hardening** | Managed resources like databases, storage, AI services, and other backend services | Network Security Perimeters (NSP) and private endpoints of Managed Resource Groups (MRG) resources restrict access to authorized Discovery components only |
| **Private endpoints** | Workspace and bookshelf data-plane APIs | Azure Private Link routes API traffic through the Azure backbone, eliminating public internet exposure |

Network hardening is enabled by default for all workspaces and bookshelves managed with the `2026-02-01-preview` API version and later. Private endpoints for data-plane access are optional and can be configured separately.

## Why network security matters

When you create a Microsoft Discovery workspace or bookshelf, the service provisions managed resources (databases, storage accounts, AI services) on your behalf. During early Preview, these resources had public endpoints and data-plane API traffic traversed the public internet.

With network hardening enabled by default, all managed resources are now protected automatically. Enabling private endpoints for data-plane access provides extra security:

- **Data protection** - All traffic stays on the Azure backbone network, never traversing the public internet.
- **Compliance** - Meet regulatory requirements for network hardening and private connectivity.
- **Reduced attack surface** - Managed resources are accessible only to authorized Discovery service components.
- **Defense in depth** - Combines network perimeters, private endpoints, virtual network injection, and identity-based access control.

## Before and after comparison

### Before: Public Preview (without network hardening)

:::image type="content" source="media/concept-network-security/before-network-isolation.jpg" alt-text="Diagram showing deployment without network hardening where traffic flows over public internet." lightbox="media/concept-network-security/before-network-isolation.jpg":::

### After: Public Preview (with network hardening)

:::image type="content" source="media/concept-network-security/after-network-isolation.jpg" alt-text="Diagram showing network-hardened deployment with private endpoints where traffic stays on Azure backbone." lightbox="media/concept-network-security/after-network-isolation.jpg":::

| Aspect | Without network hardening (Early Preview) | With network hardening (default) |
|--------|----------------------------------------------|----------------------------------|
| Managed resources | Public endpoints | Locked behind NSP + private endpoints |
| Data-plane traffic | Public internet | Azure backbone through Private Link |

## How network hardening works

When you create a workspace, the Discovery control plane automatically:

1. **Creates a Network Security Perimeter (NSP)** around the managed resources provisioned for your workspace.
2. **Deploys private endpoints** for managed resources (databases, storage, AI services) so they communicate over the Azure backbone.
3. **Configures virtual network injection for workspace services** using delegated subnets, ensuring workspace platform services and agents run within your virtual network.

The NSP enforces that only authorized Discovery service components can access the managed resources. No data travels over the public internet between Discovery components.

### Required role assignments

To create NSP associations, the Discovery first-party service principal (**AIFSPInfrastructure**) needs two role assignments on your subscription:

- **Discovery NSP Perimeter Joiner** (custom role) - Allows the service principal to create NSP inbound access rules.
- At least **Reader** (built-in role) - Allows the service principal to enumerate subscription resources for network configuration validation. If you already have Owner or Contributor assigned, a separate Reader assignment isn't needed.

For steps to create and assign these roles, see [Configure network security](how-to-configure-network-security.md#assign-the-nsp-perimeter-joiner-role).

## How private endpoints route data-plane traffic

With Azure Private Link, you can access workspace and bookshelf data-plane APIs over a private endpoint in your virtual network. When configured:

- A private endpoint is created in your virtual network subnet, receiving a private IP address.
- A private DNS zone maps the Discovery service FQDN to the private IP.
- All API traffic from your virtual network resolves to the private endpoint and traverses the Microsoft backbone network.

Without private endpoints, data-plane API calls traverse the public internet. With private endpoints, traffic stays entirely within the Azure backbone.

| `publicNetworkAccess` value | Via private endpoint | Via public internet |
|----------------------------|---------------------|-------------------|
| `Enabled` (default) | Allowed | Allowed |
| `Disabled` | Allowed | 403 Forbidden |

## Supported resource types for private endpoints

| Resource type | Group ID | Private DNS zone |
|---------------|----------|-----------------|
| `Microsoft.Discovery/workspaces` | `workspace` | `privatelink.workspace.discovery.azure.com` |
| `Microsoft.Discovery/bookshelves` | `bookshelf` | `privatelink.bookshelf.discovery.azure.com` |

Discovery resources support autoapproval for private endpoints created within the same tenant. Cross-tenant connections require manual approval by the resource owner.

## Security notes for the NSP Perimeter Joiner role

- **Minimal permission** - This custom role grants only `joinPerimeterRule/action` and `networkSecurityPerimeterOperationStatuses/read` - the narrowest possible permissions for NSP access rule creation.
- **No data access** - This permission doesn't grant access to read, write, or delete any customer data or resources.
- **Subscription scope required** - The permission must be at subscription scope because NSP inbound access rules reference subscriptions as allowed sources.

## Limitations

- Cross-region private endpoints aren't supported. The private endpoint must be in the same region as the Discovery resource.
- Each private endpoint connection is scoped to a single workspace or bookshelf resource.
- Each Discovery resource (workspace, bookshelf, supercomputer) requires its own unique, non-overlapping subnets. Subnets can't be shared across different Discovery resource instances.
- The supercomputer's AKS API server has a public FQDN. Workload traffic stays within the virtual network, but the Kubernetes API server endpoint is publicly accessible. Private cluster support is planned for a future release.
- Managed resources that don't support NSP are protected through virtual network injection or delegated subnets instead.
- Network hardening is supported in these regions: **East US**, **UK South**, and **Sweden Central**.

## Next steps

- [Configure network security](how-to-configure-network-security.md) - Assign roles, configure subnets, and create private endpoints.
- [End-to-end network-hardened deployment](how-to-deploy-network-hardened-stack.md) - Deploy a fully network-isolated Discovery stack.
- [What is Azure Private Link?](/azure/private-link/private-link-overview)
- [What is a Network Security Perimeter?](/azure/private-link/network-security-perimeter-concepts)
