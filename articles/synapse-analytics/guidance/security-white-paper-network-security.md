---
title: "Azure Synapse Analytics security white paper: Network security"
description: Manage secure network access with Azure Synapse Analytics.
author: SnehaGunda
ms.author: sngun
ms.reviewer: sngun
ms.service: synapse-analytics
ms.topic: conceptual
ms.date: 01/14/2022
---

# Azure Synapse Analytics security white paper: Network security

[!INCLUDE [security-white-paper-context](includes/security-white-paper-context.md)]

To secure Azure Synapse, there are a range of network security options to consider.

## Network security terminology

This opening section provides an overview and definitions of some of key Azure Synapse terms related to network security. Keep these definitions in mind while reading this article.

### Synapse workspace

A [*Synapse workspace*](../get-started-create-workspace.md) is a securable logical collection of all services offered by Azure Synapse. It includes dedicated SQL pools (formerly SQL DW), serverless SQL pools, Apache Spark pools, pipelines, and other services. Certain network configuration settings, such as IP firewall rules, managed virtual network, and approved tenants for exfiltration protection, are configured and secured at the workspace level.

### Synapse workspace endpoints

An endpoint is a point of an incoming connection to access a service. Each Synapse workspace has three distinct endpoints:

- **Dedicated SQL endpoint** for accessing dedicated SQL pools.
- **Serverless SQL endpoint** for accessing serverless SQL pools.
- **Development endpoint** for accessing Apache Spark pools and pipeline resources in the workspace.

These endpoints are automatically created when the Synapse workspace is created.

### Synapse Studio

[*Synapse Studio*](/training/modules/explore-azure-synapse-studio/) is a secure web front-end development environment for Azure Synapse. It supports various roles, including the data engineer, data scientist, data developer, data analyst, and Synapse administrator.

Use Synapse Studio to perform various data and management operations in Azure Synapse, such as:

- Connecting to dedicated SQL pools, serverless SQL pools, and running SQL scripts.
- Developing and running notebooks on Apache Spark pools.
- Developing and running pipelines.
- Monitoring dedicated SQL pools, serverless SQL pools, Apache Spark pools, and pipeline jobs.
- Managing [Synapse RBAC permissions](../security/synapse-workspace-understand-what-role-you-need.md) of workspace items.
- Creating [managed private endpoint connections](#managed-private-endpoint-connection) to data sources and sinks.

Connections to workspace endpoints can be made using Synapse Studio. Also, it's possible to create [private endpoints](#private-endpoints) to ensure that communication to the workspace endpoints is private.

## Public network access and firewall rules

By default, the workspace endpoints are *public endpoints* when they're provisioned. Access to these workspace endpoints from any public network is enabled, including networks that are outside the customer's organization, without requiring a VPN connection or an ExpressRoute connection to Azure.

All Azure services, including PaaS services like Azure Synapse, are protected by [DDoS basic protection](../../ddos-protection/ddos-protection-overview.md) to mitigate malicious attacks (active traffic monitoring, always on detection, and automatic attack mitigations).

All traffic to workspace endpoints—even via public networks—is encrypted and secured in transit by Transport Level Security (TLS) protocol.

To protect any sensitive data, it's recommended to disable public access to the workspace endpoints entirely. By doing so, it ensures all workspace endpoints can only be accessed using [private endpoints](#private-endpoints).

Disabling public access for all the Synapse workspaces in a subscription or a resource group is enforced by assigning an [Azure Policy](../../governance/policy/overview.md). It's also possible to disable public network access on per-workspace basis based on the sensitivity of data processed by the workspace.

However, if public access needs to be enabled, it's highly recommended to configure the IP firewall rules to allow inbound connections only from the specified list of public IP addresses.

Consider enabling public access when the on-premises environment doesn't have VPN access or ExpressRoute to Azure, and it requires access to the workspace endpoints. In this case, specify a list of public IP addresses of the on-premises data centers and gateways in the IP firewall rules.

## Private endpoints

An [Azure private endpoint](../../private-link/private-endpoint-overview.md) is a virtual network interface with a private IP address that's created in the customer's own [Azure Virtual Network](../../virtual-network/virtual-networks-overview.md) (VNet) subnet. A private endpoint can be created for any Azure service that supports private endpoints, such as Azure Synapse, dedicated SQL pools (formerly SQL DW), Azure SQL Databases, Azure Storage, or any service in Azure powered by [Azure Private Link service](../../private-link/private-link-service-overview.md).

It's possible to create private endpoints in the VNet for all three Synapse workspace endpoints, individually. This way, there could be three private endpoints created for three endpoints of a Synapse workspace: one for dedicated SQL pool, one for serverless SQL pool, and one for the development endpoint.

Private endpoints have many security benefits compared to the public endpoints. Private endpoints in an Azure VNet can be accessed only from within:

- The same VNet that contains this private endpoint.
- Regionally or globally [peered](../../virtual-network/virtual-network-peering-overview.md) Azure VNets.
- On-premises networks connected to Azure via [VPN Gateway](../../vpn-gateway/vpn-gateway-about-vpngateways.md) or ExpressRoute.

The main benefit of private endpoints is that it's no longer necessary to expose workspace endpoints to the public internet. *The less exposure, the better.*

The following diagram depicts private endpoints.

:::image type="content" source="media/security-white-paper-network-security/private-endpoints.png" alt-text="Diagram shows a customer VNet in Azure and an Azure Synapse Analytics workspace. Elements of the diagram are described in the following table.":::

The above diagram depicts the following key points:

| **Item** | **Description** |
| --- | --- |
| ![Item 1.](media/common/icon-01-red-30x30.png) | Workstations from within the customer VNet access the Azure Synapse private endpoints. |
| ![Item 2.](media/common/icon-02-red-30x30.png) | Peering between customer VNet and another VNet. |
| ![Item 3.](media/common/icon-03-red-30x30.png) | Workstation from peered VNet access the Azure Synapse private endpoints. |
| ![Item 4.](media/common/icon-04-red-30x30.png) | On-premises network access the Azure Synapse private endpoints through VPN or ExpressRoute. |
| ![Item 5.](media/common/icon-05-red-30x30.png) | Workspace endpoints are mapped into customer's VNet through private endpoints using Azure Private Link service. |
| ![Item 6.](media/common/icon-06-red-30x30.png) | Public access is disabled on the Synapse workspace. |

In the following diagram, a private endpoint is mapped to an instance of a PaaS resource instead of the entire service. In the event of a security incident within the network, only the mapped resource instance is exposed, minimizing the exposure and threat of data leakage and exfiltration.

:::image type="content" source="media/security-white-paper-network-security/private-endpoint-mapped.png" alt-text="Diagram shows three workspaces: A, B, and C. Elements of the diagram are described in the following table.":::

The above diagram depicts the following key points:

| **Item** | **Description** |
| --- | --- |
| ![Item 1.](media/common/icon-01-red-30x30.png) | The private endpoint in the customer VNet is mapped to a single dedicated SQL pool (formerly SQL DW) endpoint in Workspace A. |
| ![Item 2.](media/common/icon-02-red-30x30.png) | Other SQL pool endpoints in the other workspaces (B and C) aren't accessible through this private endpoint, minimizing exposure. |

Private endpoint works across Azure Active Directory (Azure AD) tenants and regions, so it's possible to create private endpoint connections to Synapse workspaces across tenants and regions. In this case, it goes through the [private endpoint connection approval workflow](../../private-link/private-endpoint-overview.md#access-to-a-private-link-resource-using-approval-workflow). The resource owner controls which private endpoint connections are approved or denied. The resource owner is in full control of who can connect to their workspaces.

The following diagram depicts a private endpoint connection approval workflow.

:::image type="content" source="media/security-white-paper-network-security/private-endpoint-connection-approval-workflow.png" alt-text="Diagram shows a customer VNet in Tenant A, and a customer VNet in Tenant B. An Azure Private Link connects them. Elements of the diagram are described in the following table.":::

The above diagram depicts the following key points:

| **Item** | **Description** |
| --- | --- |
| ![Item 1.](media/common/icon-01-red-30x30.png) | Dedicated SQL pool (formerly SQL DW) in Workspace A in Tenant A is accessed by a private endpoint in the customer VNet in Tenant A. |
| ![Item 2.](media/common/icon-02-red-30x30.png) | The same dedicated SQL pool (formerly SQL DW) in Workspace A in Tenant A is accessed by a private endpoint in the customer VNet in Tenant B through a connection approval workflow. |

## Managed VNet

The [Synapse Managed VNet](../security/synapse-workspace-managed-vnet.md) feature provides a fully managed network isolation for the Apache Spark pool and pipeline compute resources between Synapse workspaces. It can be configured at workspace creation time. In addition, it also provides network isolation for Spark clusters within the same workspace. Each workspace has its own virtual network, which is fully managed by Synapse. The Managed VNet isn't visible to the users to make any modifications. Any pipeline or Apache Spark pool compute resources that are spun up by Azure Synapse in a Managed VNet gets provisioned inside its own VNet. This way, there's full network isolation from other workspaces.

This configuration eliminates the need to create and manage VNets and network security groups for the Apache Spark pool and pipeline resources, as is typically done by [VNet Injection](/azure/databricks/administration-guide/cloud-configurations/azure/vnet-inject).

As such, multi-tenant services in a Synapse workspace, such as dedicated SQL pools and serverless SQL pools, are **not** provisioned inside the Managed VNet.

The following diagram depicts network isolation between two Managed VNets of Workspaces A and B with their Apache Spark pools and pipeline resources inside the Managed VNets.

:::image type="content" source="media/security-white-paper-network-security/network-isolation-between-two-managed-vnets.png" alt-text="Diagram shows two workspaces: Workspace A and B with network isolation between workspaces.":::

## Managed private endpoint connection

A [managed private endpoint connection](../security/synapse-workspace-managed-private-endpoints.md) enables connections to any Azure PaaS service (that supports Private Link), securely and seamlessly, without the need to create a private endpoint for that service from the customer's VNet. Synapse automatically creates and manages the private endpoint. These connections are used by the compute resources that are provisioned inside the Synapse Managed VNet, such as Apache Spark pools and pipeline resources, to connect to the Azure PaaS services *privately*.

For example, if you want to connect to your Azure storage account *privately* from your pipeline, the usual approach is to create a private endpoint for the storage account and use a self-hosted integration runtime to connect to your storage private endpoint. With Synapse Managed VNets, you can privately connect to your storage account using Azure integration runtime simply by creating a managed private endpoint connection directly to that storage account. This approach eliminates the need to have a self-hosted integration runtime to connect to your Azure PaaS services privately.

As such, multi-tenant services in a Synapse workspace, such as dedicated SQL pools and serverless SQL pools, are **not** provisioned inside the Managed VNet. So, they don't use the managed private endpoint connections created in the workspace for their outbound connectivity.

The following diagram depicts a managed private endpoint connecting to an Azure storage account from a Managed VNet in Workspace A.

:::image type="content" source="media/security-white-paper-network-security/private-endpoint-connection-to-azure-storage.png" alt-text="Diagram shows Workspace A with an Azure Private Link to Azure storage.":::

## Advanced Spark security

A Managed VNet also provides some added advantages for Apache Spark pool users. There's no need to worry about configuring a *fixed* subnet address space as would be done in [VNet Injection](/azure/databricks/administration-guide/cloud-configurations/azure/vnet-inject). Azure Synapse automatically takes care of allocating these address spaces dynamically for workloads.

In addition, Spark pools operate as a job cluster. It means each user gets their own Spark cluster when interacting with the workspace. Creating an Spark pool within the workspace is metadata information for what will be assigned to the user when executing Spark workloads. It means each user will get their own Spark cluster *in a dedicated subnet inside the Managed VNet* to execute workloads. Spark pool sessions from the same user execute on the same compute resources. By providing this functionality, there are three main benefits:

- Greater security due to workload isolation based on the user.
- Reduction of noisy neighbors.
- Greater performance.

## Data exfiltration protection

Synapse workspaces with Managed VNet have an additional security feature called *[data exfiltration protection](../security/workspace-data-exfiltration-protection.md)*. It protects all egress traffic going out from Azure Synapse from all services, including dedicated SQL pools, serverless SQL pools, Apache spark pools, and pipelines. It's configured by enabling data exfiltration protection at the workspace level (at workspace creation time) to restrict the outbound connections to an allowed list of Azure Active Directory (Azure AD) tenants. By default, only the home tenant of the workspace is added to the list, but it's possible to add or modify the list of Azure AD tenants anytime after the workspace is created. Adding additional tenants is a highly privileged operation that requires the elevated role of [Synapse Administrator](../security/synapse-workspace-synapse-rbac-roles.md). It effectively controls exfiltration of data from Azure Synapse to other organizations and tenants, without the need to have complicated network security policies in place.

For workspaces with data exfiltration protection enabled, Synapse pipelines and Apache Spark pools must use managed private endpoint connections for all their outbound connections.

Dedicated SQL pool and serverless SQL pool don't use managed private endpoints for their outbound connectivity; however, any outbound connectivity from SQL pools can only be made to the *approved targets*, which are the targets of managed private endpoint connections.

## Private link hubs for Synapse Studio

[Synapse Private Link Hubs](../security/synapse-private-link-hubs.md) allows securely connecting to Synapse Studio from the customer's VNet using Azure Private Link. This feature is useful for customers who want to access the Synapse workspace using the Synapse Studio from a controlled and restricted environment, where the outbound internet traffic is restricted to a limited set of Azure services.

It's achieved by creating a private link hub resource and a private endpoint to this hub from the VNet. This private endpoint is then used to access the studio using its fully qualified domain name (FQDN), *web.azuresynapse.net*, with a private IP address from the VNet. The private link hub resource downloads the static contents of Synapse Studio over Azure Private Link to the user's workstation. In addition, separate private endpoints must be created for the individual workspace endpoints to ensure that communication to the workspace endpoints is private.

The following diagram depicts private link hubs for Synapse Studio.

:::image type="content" source="media/security-white-paper-network-security/private-link-hubs-for-synapse-studio.png" alt-text="Diagram shows private link hubs for Synapse Studio. Elements of the diagram are described in the following table.":::

The above diagram depicts the following key points:

| **Item** | **Description** |
| --- | --- |
| ![Item 1.](media/common/icon-01-red-30x30.png) | The workstation in a restricted customer VNet accesses the Synapse Studio using a web browser. |
| ![Item 2.](media/common/icon-02-red-30x30.png) | A private endpoint created for private link hubs resource is used to download the static studio contents using Azure Private Link. |
| ![Item 3.](media/common/icon-03-red-30x30.png) | Private endpoints created for Synapse workspace endpoints access the workspace resources securely using Azure Private Links. |
| ![Item 4.](media/common/icon-04-red-30x30.png) | Network security group rules in the restricted customer VNet allow outbound traffic over port 443 to a limited set of Azure services, such as Azure Resource Manager, Azure Front Door, and Azure Active Directory. |
| ![Item 5.](media/common/icon-05-red-30x30.png) | Network security group rules in the restricted customer VNet deny all other outbound traffic from the VNet. |
| ![Item 6.](media/common/icon-06-red-30x30.png) | Public access is disabled on the Synapse workspace. |

## Dedicated SQL pool (formerly SQL DW)

Prior to the Azure Synapse offering, an Azure SQL data warehouse product named SQL DW was offered. It's now renamed as [dedicated SQL pool (formerly SQL DW)](../sql-data-warehouse/sql-data-warehouse-overview-what-is.md).

Dedicated SQL pool (formerly SQL DW) is created inside a logical Azure SQL server. It's a securable logical construct that acts as a central administrative point for a collection of databases including SQL DW and other Azure SQL databases.

Most of the core network security features discussed in the previous sections of this article for Azure Synapse are also applicable to dedicated SQL pool (formerly SQL DW). They include:

> [!div class="checklist"]
> - IP firewall rules
> - Disabling public network access
> - Private endpoints
> - Data exfiltration protection through outbound firewall rules

Since dedicated SQL pool (formerly SQL DW) is a multi-tenant service, it's not provisioned inside a Managed VNet. It means some of the features, such as Managed VNet and managed private endpoint connections, aren't applicable to it.

## Network security feature matrix

The following comparison table provides a high-level overview of network security features supported across the Azure Synapse offerings:

| **Feature** | **Azure Synapse: Apache Spark pool** | **Azure Synapse: Dedicated SQL pool** | **Azure Synapse: Serverless SQL pool** | **Dedicated SQL pool (formerly SQL DW)** |
| --- | :-: | :-: | :-: | :-: |
| IP firewall rules | Yes | Yes | Yes | Yes |
| Disabling public access | Yes | Yes | Yes | Yes |
| Private endpoints | Yes | Yes | Yes | Yes |
| Data exfiltration protection | Yes | Yes | Yes | Yes |
| Secure access using Synapse Studio | Yes | Yes | Yes | No |
| Access from restricted network using Synapse private link hub | Yes | Yes | Yes | No |
| Managed VNet and workspace-level network isolation | Yes | N/A | N/A | N/A |
| Managed private endpoint connections for outbound connectivity | Yes | N/A | N/A | N/A |
| User-level network isolation | Yes | N/A | N/A | N/A |

## Next steps

In the [next article](security-white-paper-threat-protection.md) in this white paper series, learn about threat protection.
