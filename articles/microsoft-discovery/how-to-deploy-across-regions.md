---
title: Deploy Microsoft Discovery across Azure regions
description: Learn how to deploy Microsoft Discovery control-plane resources in a supported home region and managed compute and infrastructure resources in another Azure region.
author: anzaman
ms.author: alzam
ms.date: 09/18/2026
ms.topic: how-to
ms.service: azure
---

# Deploy Microsoft Discovery across Azure regions

In this article, you deploy Microsoft Discovery across two Azure regions. You create Discovery control-plane resources in a supported Discovery home region and deploy the associated compute, networking, and storage resources in a target region.

This configuration can help you use capacity and quota in another region, place compute closer to users or data, and help meet regional compliance or data residency requirements.

## Prerequisites

Before you begin, ensure that you have:

- An Azure subscription with permissions to create Microsoft Discovery and supporting Azure resources.
- The prerequisites from [Quickstart: Deploy Microsoft Discovery infrastructure](https://learn.microsoft.com/azure/microsoft-discovery/quickstart-infrastructure), including registered resource providers, required roles, and sufficient quota.

> [!IMPORTANT]
> Discovery supports all regions where Foundry Projects are available as target regions. Ensure that the target region is supported by Foundry and is listed in the table at [Feature availability across cloud regions - Microsoft Foundry | Microsoft Learn](https://learn.microsoft.com/azure/foundry/reference/region-support)

## Understand resource placement

A cross-region deployment uses a home region for the Discovery control plane and a target region for workloads and supporting infrastructure.

| Resource | Deployment region |
| --- | --- |
| Discovery control-plane resources | Discovery home region |
| Managed resource groups | Discovery home region |
| Resources inside managed resource groups | Target region |
| Customer-managed compute, networking, storage, and security resources | Target region |

Discovery control-plane resources include:

- Discovery workspace
- Discovery supercomputer
- Discovery storage containers
- Discovery tools
- Discovery projects
- Discovery bookshelves

Resources in the target region can include:

- Managed compute resources
- Virtual networks and subnets
- Storage accounts
- Azure Container Registry
- User-assigned managed identities
- Private endpoints
- Network security groups
- Route tables
- Firewalls and other customer-managed security resources

The following diagram shows an example with the Discovery control plane in East US and the workload infrastructure in West US 3.

:::image type="content" source="./media/how-to-deploy-across-regions/cross-region-deployment.jpg" alt-text="Diagram that shows Discovery control-plane resources in East US and managed infrastructure resources in West US 3." lightbox="./media/how-to-deploy-across-regions/cross-region-deployment.jpg":::

## Deploy supporting infrastructure in the target region

Create the customer-managed resources that the Discovery deployment requires in your target region. The exact resources depend on your network and security configuration.

1. Create a virtual network and the required subnets.
1. Create the storage accounts and Azure Container Registry.
1. Create the user-assigned managed identities.
1. Create any required private endpoints, network security groups, route tables, and firewall rules.
1. Confirm that the target region has sufficient model and compute quota.

For detailed infrastructure requirements, see [Quickstart: Deploy Microsoft Discovery infrastructure](https://learn.microsoft.com/azure/microsoft-discovery/quickstart-infrastructure).

## Deploy Discovery resources in the home region

Create the Discovery resources in a supported home region. When you create a resource that supports a managed resource group region override, apply the `discovery.overridemrgregion` tag.

Use the following tag name and value:

```text
discovery.overridemrgregion: <target-region-identifier>
```

To deploy managed resources in West US 3, apply:

```text
discovery.overridemrgregion: westus3
```

Use the programmatic region identifier from the [Azure regions list](https://learn.microsoft.com/azure/reliability/regions-list?tabs=all#azure-regions-list-1), such as `westus3` instead of `West US 3`.

Apply the tag when you create each supported Discovery resource. The following resources support the managed resource group region override:

- Discovery workspace
- Discovery supercomputer
- Discovery bookshelf

The Discovery resource and its managed resource group remain in the home region. The resources inside the managed resource group are deployed in the target region.

> [!IMPORTANT]
> For Microsoft-owned subscriptions, also apply the following tag:
>
> ```text
> SkipAssociateKeyVaultToNsp: true
> ```

## Verify the deployment

After the deployment finishes, verify the location and connectivity of the resources.

1. In the Azure portal, confirm that the Discovery workspace, supercomputer, and bookshelves are in the selected home region.
1. Confirm that each managed resource group is in the home region.
1. Open each managed resource group and confirm that its managed compute, networking, storage, and Foundry resources are in the target region.
1. Verify network connectivity between the Discovery-managed resources and your customer-managed resources.
1. Confirm that managed identities have the required role assignments.
1. Test access to the storage accounts and Azure Container Registry from the compute resources.
1. Run a sample investigation to validate the deployment from end to end.

For example, a deployment that uses East US as the home region and West US 3 as the target region has the following resource placement:

| Resource | Region |
| --- | --- |
| Discovery workspace | East US |
| Discovery supercomputer | East US |
| Managed resource groups | East US |
| Resources inside managed resource groups | West US 3 |
| Customer-managed virtual network | West US 3 |
| Customer-managed storage account | West US 3 |
| Customer-managed Azure Container Registry | West US 3 |

## Understand the data flow

In a cross-region deployment, bulk customer data moves directly between authorized customer storage and compute resources in the target region.

- Investigations can access only storage resources that are linked to the project and authorized through managed identity.
- Authorized tools read customer data directly from linked storage accounts.
- Tools write generated output files back to customer storage.
- Discovery Studio receives summarized results and explicitly requested, size-limited data previews. It doesn't receive raw bulk customer data.
- The home-region control plane handles authorization context, resource metadata, provisioning, and operation status. It doesn't transport or persist bulk customer data payloads.
- Foundry and supporting workspace runtime resources run in the effective target region.

:::image type="content" source="./media/how-to-deploy-across-regions/data-flow.png" alt-text="Diagram that shows customer data flowing between authorized storage and compute resources in the target region while the home-region control plane handles authorization and metadata." lightbox="./media/how-to-deploy-across-regions/data-flow.png":::

## Troubleshoot cross-region deployments

### Managed resources deploy to the wrong region

Confirm that:

- The `discovery.overridemrgregion` tag is present on each supported Discovery resource.
- The tag value is a valid Azure programmatic region identifier.
- The tag was applied when the Discovery resource was created.
- The selected target region supports Discovery cross-region deployment and all required Foundry features.

### Deployment fails because of quota or capacity

1. Check model and compute quota in the target region.
1. Request additional quota if needed.
1. If capacity isn't available, select another supported target region.

### Resources can't communicate across the deployment

Confirm that:

- Network security groups, route tables, firewalls, and private endpoints allow the required traffic.
- DNS resolves private endpoints correctly.
- Managed identities have access to storage accounts, Azure Container Registry, and other dependencies.

## Next steps

- [Deploy Microsoft Discovery infrastructure](https://learn.microsoft.com/azure/microsoft-discovery/quickstart-infrastructure)
- [Review Microsoft Foundry regional availability](https://learn.microsoft.com/azure/foundry/reference/region-support)
- [Plan for Microsoft Discovery business continuity and disaster recovery](https://learn.microsoft.com/azure/microsoft-discovery/concept-discovery-business-continuity-disaster-recovery)
