---
title: Network security for Microsoft Discovery
description: Understand how Microsoft Discovery uses Network Security Perimeters and private endpoints to protect managed resources and data-plane traffic.
ms.service: azure
ms.topic: concept-article
ms.date: 11/10/2026
ms.author: umamm
author: umamm
ms.custom: networking, private-link, nsp
---

# Network security for Microsoft Discovery

Microsoft Discovery provides two layers of network security to protect your workspace resources and data-plane traffic:

| Layer | What it protects | How it works |
|-------|-----------------|--------------|
| **Network hardening** | Managed resources like databases, storage, AI services, and other backend services | Network Security Perimeters (NSPs), managed-resource private endpoints, and delegated subnets provide resource-specific controls |
| **Client private endpoints** | Workspace and bookshelf data-plane APIs | Azure Private Link provides a private access path. Disable public network access separately to require that path. |

Managed-backend hardening and client API access are separate controls. Client private endpoints for workspace and bookshelf data-plane access are configured separately, and creating them doesn't disable public network access.

## Why network security matters

When you create a Microsoft Discovery workspace or bookshelf, the service provisions managed resources (databases, storage accounts, AI services) on your behalf. Their backend network controls are separate from client data-plane access.

Backend hardening and client private endpoints protect different access paths. Configure both according to your deployment requirements:

- **Data protection** - Traffic using correctly configured private endpoints stays on the Azure backbone network.
- **Compliance planning** - Support requirements for network hardening and private connectivity as part of your broader compliance controls.
- **Reduced attack surface** - Resource-specific network controls restrict backend access.
- **Defense in depth** - Combines network perimeters, private endpoints, virtual network injection, and identity-based access control.

## Before and after comparison

### Before: Without network hardening

:::image type="content" source="media/concept-network-security/before-network-isolation.jpg" alt-text="Diagram showing deployment without network hardening where traffic flows over public internet." lightbox="media/concept-network-security/before-network-isolation.jpg":::

### After: With network hardening

:::image type="content" source="media/concept-network-security/after-network-isolation.jpg" alt-text="Diagram showing network-hardened deployment with private endpoints where traffic stays on Azure backbone." lightbox="media/concept-network-security/after-network-isolation.jpg":::

| Aspect | Without network hardening | With network hardening |
|--------|----------------------------------------------|----------------------------------|
| Managed resources | Public endpoints | Resource-specific NSP, private endpoint, or delegated-subnet controls |
| Client data-plane traffic | Public endpoint unless a private endpoint is configured | Private Link when a client private endpoint and DNS are configured; public access is controlled separately |

## How network hardening works

Backend hardening uses different controls for different resources:

- **NSP associations** control network access to associated managed resources.
- **Managed-resource private endpoints** provide private backend connectivity.
- **Delegated subnets** support workspace services and agents in your virtual network.

These backend controls don't require clients to use a private endpoint for workspace or bookshelf APIs.

### Required role assignments

For network-hardening preparation, the Discovery first-party service principal (**Discovery control-plane service App**) needs two role assignments on your subscription:

- **Discovery NSP Perimeter Joiner** (custom role) - Grants the join permissions used by the Discovery control plane during network-hardening preparation. It doesn't grant arbitrary perimeter or access-rule administration.
- At least **Reader** (built-in role) - Allows the service principal to enumerate subscription resources for network configuration validation. If you already have Owner or Contributor assigned, a separate Reader assignment isn't needed.

For steps to create and assign these roles, see [Configure network security](how-to-configure-network-security.md#assign-the-nsp-perimeter-joiner-role).

## How private endpoints route data-plane traffic

With Azure Private Link, you can access workspace and bookshelf data-plane APIs over a private endpoint in your virtual network. When configured:

- A private endpoint is created in your virtual network subnet, receiving a private IP address.
- A private DNS zone maps the Discovery service FQDN to the private IP.
- All API traffic from your virtual network resolves to the private endpoint and traverses the Microsoft backbone network.

Traffic through a correctly configured client private endpoint uses the Azure backbone. Creating that endpoint doesn't disable the resource's public endpoint. Set `publicNetworkAccess` explicitly for each workspace or bookshelf:

| `publicNetworkAccess` value | Via private endpoint | Via public internet |
|----------------------------|---------------------|-------------------|
| `Enabled` | Allowed | Allowed |
| `Disabled` | Allowed | 403 Forbidden |

The onboarding tool defaults `workspace.publicNetworkAccess` to `Enabled`. Its `workspace.networkIsolation` setting controls Workbench access independently and defaults to `true`. Review both settings and the browser's separate path to project storage in [Plan workspace and client access](how-to-plan-deployment-network.md#plan-workspace-and-client-access).

## Supported resource types for private endpoints

| Resource type | Group ID | Private DNS zone |
|---------------|----------|-----------------|
| `Microsoft.Discovery/workspaces` | `workspace` | `privatelink.workspace.discovery.azure.com` |
| `Microsoft.Discovery/bookshelves` | `bookshelf` | `privatelink.bookshelf.discovery.azure.com` |

Discovery resources support autoapproval for private endpoints created within the same tenant. Cross-tenant connections require manual approval by the resource owner.

## Security notes for the NSP Perimeter Joiner role

- **Limited permission** - This custom role grants `joinPerimeterRule/action` and `networkSecurityPerimeterOperationStatuses/read`, but it doesn't grant general access-rule creation or modification permissions.
- **No data-plane access** - These actions don't grant permission to read, write, or delete customer data.
- **Subscription scope required** - The permission must be at subscription scope because NSP inbound access rules reference subscriptions as allowed sources.

## Limitations

- Cross-region private endpoints aren't supported. The private endpoint must be in the same region as the Discovery resource.
- Each private endpoint connection is scoped to a single workspace or bookshelf resource.
- Allocate nonoverlapping address ranges for workspace, agent, and bookshelf search subnets within the VNet, and keep the supercomputer's management and node subnets distinct. Use the delegations and layout in [Subnet requirements](how-to-configure-network-security.md#subnet-requirements-for-workspaces-and-bookshelves).
- A supercomputer's workload network and management-plane access are separate controls. To remove its public management-plane IP, configure a private supercomputer at creation with `discovery.enableprivatecluster=true`, user-defined routing, and the required management subnet. For prerequisites and limitations, see [Private supercomputer](how-to-configure-supercomputer-network-security.md#private-supercomputer).
- Managed resources that don't support NSP are protected through virtual network injection or delegated subnets instead.
- Network hardening is supported in these regions: **East US**, **UK South**, and **Sweden Central**.

## Next steps

- [Configure network security](how-to-configure-network-security.md) - Assign roles, configure subnets, and create private endpoints.
- [End-to-end network-hardened deployment](how-to-deploy-network-hardened-stack.md) - Configure private data-plane and storage access while planning required outbound connectivity.
- [What is Azure Private Link?](/azure/private-link/private-link-overview)
- [What is a Network Security Perimeter?](/azure/private-link/network-security-perimeter-concepts)
