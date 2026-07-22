---
title: What is an Azure standard service endpoint?
titleSuffix: Azure Private Link
description: Learn about Azure standard service endpoints, which provide scalable, secure IaaS-to-PaaS connectivity using Network Security Perimeter and network identifiers.
author: asudbring
ms.author: allensu
ms.service: azure-private-link
ms.topic: concept-article
ms.date: 07/08/2026
ms.custom: references_regions
---

# What is an Azure standard service endpoint?

A standard service endpoint enables you to securely connect IaaS workloads to PaaS resources using [network security perimeter](network-security-perimeter-concepts.md) and network identifiers ([public IPs](../virtual-network/ip-services/public-ip-addresses.md)). This capability addresses the scale limitations in basic [service endpoints](../virtual-network/virtual-network-service-endpoints-overview.md) and simplifies configuration for more secure and efficient cloud environments.

> [!IMPORTANT]
> Standard service endpoint is currently in public preview. This preview is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## How a standard service endpoint works

A standard service endpoint introduces the concept of a **network identifier** - a public IP address that you associate with service endpoints on your subnets. The public IP address is only used as method of identification of the traffic connecting directly to the virtual network to the service.

To configure a standard service endpoint, you create a public IP address, associate it as a network identifier with service endpoints on your subnets, secure your PaaS resources within a network security perimeter, and add IP-based inbound access rules that match the network identifier. The network identifier identifies traffic from your subnets and the network security perimeter authorizes it. You can assign the same public IP address to all subnets in a region and subscription, which dramatically reduces the number of ACL entries required compared to basic service endpoints. A single network identifier can represent many VNets and subnets.

For step-by-step implementation instructions, see:

- [Configure a standard service endpoint using the Azure portal](configure-service-endpoint-standard-portal.md)
- [Configure a standard service endpoint using the Azure CLI](configure-service-endpoint-standard-cli.md)
- [Configure a standard service endpoint using Azure PowerShell](configure-service-endpoint-standard-powershell.md)

## Supported services

Service endpoints with network identifiers are available for the following Azure services. The *Microsoft.\** resource is in parenthesis. Enable this resource from the subnet side while configuring a standard service endpoint:

| Service | Resource provider | Availability |
|---------|------------------|-------------|
| [Azure Storage](../storage/common/storage-network-security.md) | *Microsoft.Storage* | Generally available in all Azure regions |
| [Azure Key Vault](/azure/key-vault/general/overview-vnet-service-endpoints) | *Microsoft.KeyVault* | Generally available in all Azure regions |
| [Azure SQL Database](/azure/azure-sql/database/vnet-service-endpoint-rule-overview) | *Microsoft.Sql* | In public preview |
| [Azure Cosmos DB](/azure/cosmos-db/how-to-configure-vnet-service-endpoint) | *Microsoft.AzureCosmosDB* | In public preview |

## Key benefits

A standard service endpoint provides the following benefits:

- **Simplified configuration with less management overhead**: Associate a single public IP as a network identifier across multiple subnets and VNets. Subnet lifecycle changes don't require updating service-side access rules.

- **Improved scale and reliability**: Overcomes traditional service endpoint scalability limits, enabling thousands of connections without hitting resource provider throttles.

- **Network security perimeter integration**: Enforce perimeter-based security for PaaS resources using network security perimeter. Centralize access control using network security perimeter rules instead of managing per-resource ACLs.

- **Network identifier support**: Associate public IPs with subnets for flexible, multi-subscription connectivity. The same public IP can be reused across multiple VNets and subscriptions within the same tenant.

- **Cross-subscription support**: Reuse public IPs as network identifiers across subscriptions within the same tenant and region during public preview.

## Compare connectivity options

The following table compares basic service endpoints, standard service endpoints, and [Azure Private Link](private-link-overview.md):

| Capability | Basic service endpoint | Standard service endpoint | Azure Private Link |
|---|---|---|---|
| **Private connectivity** (no public endpoint exposed) | Not supported | Not supported | Supported |
| **On-premises connectivity** (route traffic privately) | Not supported | Not supported | Supported |
| **Data exfiltration protection** | Not supported | Not supported | Supported |
| **Ease of setup** (DNS, endpoint creation, approval) | Simple | Simple | Complex |
| **Scalable solution** | Not supported | Supported | Supported |
| **Service availability** | Limited (approximately 10 services) | Limited (4 services) | Broad (70+ services) |
| **Pricing** | Free | Paid | Paid |

## Limitations

- Endpoints are enabled on subnets configured in Azure virtual networks. Endpoints can't be used for traffic from your on-premises services to Azure services. For more information, see [Secure Azure service access from on-premises](../virtual-network/virtual-network-service-endpoints-overview.md#secure-azure-services-to-virtual-networks).

- All service endpoints in a subnet must reference the same network identifier, otherwise the operation fails.

- **Resource reusability**: The public preview supports reusing public IPs as network identifiers across subscriptions within the same tenant and region. Cross-tenant and cross-region sharing aren't supported. Public IP prefixes can be used in other deployment scenarios, such as NAT Gateway or Load Balancer.

- **PaaS resource access controls**: Network security perimeter allows restricted public access to PaaS resources through IP-based rules using public IP prefixes or instances. Up to 200 prefixes and 1,000 PaaS resources per network security perimeter are supported.

## Feature availability

The feature is currently available in Public cloud and the following national clouds: Mooncake, Fairfax, UsSec, and UsNAT. Bleu, Delos, and GovSG aren't yet enabled for Public Preview.

## Pricing

Standard Service Endpoint is available at no charge in July 2026. Billing is expected to begin after the public preview announcement, currently targeted for August 2026.

## Network security perimeter best practices

When you use a standard service endpoint with network security perimeter, follow these best practices:

- **Scale planning**: Map your environment scale to the [network security perimeter limits](network-security-perimeter-concepts.md#limitations-of-a-network-security-perimeter). Up to 100 network security perimeters per subscription, 200 profiles per network security perimeter, and 1,000 PaaS resources per network security perimeter are supported.

- **Resource grouping**: For large environments, split resources across multiple network security perimeters to stay within supported limits. Consider network architecture and isolation needs when grouping resources.

- **Profile design**: Group resources with similar access requirements into profiles. Define clear isolation boundaries based on organizational needs, such as separating dev/prod environments or application teams.

- **Rule configuration**: Network security perimeter only supports allow rules, not deny rules. All access must be explicitly permitted through configured rules.

- **Traffic pattern validation**: Review and verify all traffic patterns on network security perimeter before moving resources to enforced mode. Use [network security perimeter diagnostic logs](network-security-perimeter-diagnostic-logs.md) to confirm all traffic is approved by network security perimeter access rules. Monitor for one to two weeks to ensure all access patterns are covered.

- **Cross-subscription and region support**: Network security perimeter supports resources across different subscriptions and regions, allowing flexible grouping and management.

For more information, see [What is a network security perimeter?](network-security-perimeter-concepts.md)

## Frequently asked questions

### Can I use the same public IP across multiple VNets?

Yes. The same public IP can be referenced by multiple VNets for service endpoints.

### Can I use the same public IP across subscriptions?

Yes. Cross-subscription support is available during public preview within the same tenant.

### What permissions are required to configure this feature?

You need the **Network Contributor** role or higher. Specifically, you need the `Microsoft.Network/publicIPAddresses/joinServiceEndpointNetworkIdentifier/action` permission. For more information about network security perimeter permissions, see [network security perimeter role-based access control requirements](network-security-perimeter-role-based-access-control-requirements.md).

### Can overlapping IP ranges be used as network identifiers in different tenants?

No. Public IPs must be unique per region and can't overlap.

### Does adding or changing a network identifier disrupt active connections?

Yes. Active flows reset when you add or change a network identifier on an existing service endpoint, similar to upgrading from non-service endpoints to service endpoints. Plan this change for maintenance windows when possible.

### Can I reuse a public IP address across subscriptions and tenants?

Cross-subscription sharing is supported within the same tenant. Cross-tenant sharing isn't supported.

### Is it supported to have a VNet in one region and a PaaS resource in another region?

Yes, this configuration is supported for Azure Cosmos DB, Azure Key Vault, and Azure Storage. For Azure SQL Database, cross-region support isn't available during the preview.

## Next steps

- [Configure a standard service endpoint using the Azure portal](configure-service-endpoint-standard-portal.md)
- [Configure a standard service endpoint using the Azure CLI](configure-service-endpoint-standard-cli.md)
- [Configure a standard service endpoint using Azure PowerShell](configure-service-endpoint-standard-powershell.md)
- [What is a network security perimeter?](network-security-perimeter-concepts.md)
- [Create a network security perimeter - Azure portal](create-network-security-perimeter-portal.md)
- [Azure public IP address prefix](../virtual-network/ip-services/public-ip-address-prefix.md)
