---
title: Azure Storage Mover networking Requirements
description: Learn about the network prerequisites for using Azure Storage Mover, including the implementation of private networking.
author: stevenmatthew
ms.author: shaas
ms.service: azure-storage-mover
ms.topic: conceptual
ms.date: 10/22/2025
---

# Storage Mover networking prerequisites

Azure Storage Mover is a service designed to facilitate seamless data migration to Azure Storage accounts. For organizations prioritizing security and compliance, integrating Storage Mover with Azure Private Networking ensures that sensitive data and credentials remain protected throughout the migration process. 

> [!NOTE]
> Azure Storage Mover supports both on-premises and cloud data sources and targets. On-premises data sources are migrated to Azure storage using one or more agents, while cloud data sources are migrated using the Storage Mover service directly. 
>
> This article focuses on the prerequisites for connecting on-premises infrastructure to Azure, and includes private networking considerations.

Azure Storage Mover communication occurs over HTTPS. This encrypted communication makes migrations over the public internet sufficiently secure for many organizations. These organizations might not, for example, require private network access to their storage account and key vault. For organizations prioritizing security and compliance, integrating Storage Mover with Azure Private Networking ensures that sensitive data and credentials remain protected throughout the migration process. These configurations typically begin with the creation of an Azure virtual network, which serves as the foundation for secure connectivity. For more information about Azure virtual networks, see [What is an Azure virtual network](../virtual-network/virtual-networks-overview.md).

> [!IMPORTANT]
> Currently, Storage Mover can be configured to route migration data from the agent to the destination storage account over Private Link. Hybrid Compute heartbeats and certificates can also be routed to a private Azure Arc service endpoint in your virtual network (VNet). Some Storage Mover traffic can't be routed through Private Link and is routed over the public endpoint of a storage mover resource. This data includes control messages, progress telemetry, and copy logs.

To link on-premises infrastructure to Azure, organizations need to enable hybrid connectivity. This hybrid link can be created using a Site-to-Site VPN via Azure VPN Gateway or Azure ExpressRoute. Both options establish private tunnels that enable secure access to Azure resources. For more information about Azure VPN Gateway or ExpressRoute, see [What is an Azure VPN Gateway](../vpn-gateway/vpn-gateway-about-vpngateways.md) or [What is Azure ExpressRoute](../expressroute/expressroute-introduction.md).

Private Endpoints also play a critical role in this approach, allowing services such as Azure Storage Accounts and Azure Key Vaults to be accessed privately. These endpoints reside within a subnet of the virtual network and require domain name system (DNS) records to correctly resolve private IP addresses. During setup, users can configure a Private DNS Zone to manage these records. For more information about Private Endpoints, see [What is an Azure Private Endpoint](../private-link/private-endpoint-overview.md).

This article outlines the key requirements and configuration steps necessary to deploy Azure Storage Mover in a private network environment.

## Networking overview

When Azure Storage Mover is deployed in a private networking environment, several components must be configured to ensure secure and efficient operation. The Storage Mover Agent, which performs the actual data migration tasks, needs to connect to various Azure services. Some of these services support private endpoints, while others require public endpoint access.

### Required ports

A storage mover agent supports both SMB and NFS clients. The following list of ports must be enabled between a Storage Mover Agent VM, a storage VM, and an Azure Fileshare. 

| Service                   | Port and Protocol | Source VM | Target                              |
|---------------------------|-------------------|-----------|-------------------------------------|
| SMB                       | 445/TCP           | Agent VM  | On-premises SMB share server        |
| NFS                       | 2049/TCP          | Agent VM  | On-premises NFS share server        |
| Blob or File Share target | 443/HTTPS         | Agent VM  | Azure File Share                    |

### Required services and endpoints

The following table provides a summary of the required services, their endpoint types, and whether private access is supported. Because your network settings must allow the Storage Mover Agent to connect over HTTPS to the service's endpoints, the Fully Qualified Domain Name (FQDN) is also included.

<!--# [Public Cloud](#tab/public)-->

| Service                    | Needed For           | Supports Private Endpoints | FQDN                                               |
|----------------------------|----------------------|----------------------------|----------------------------------------------------|
| **Microsoft Artifact Registry** | Agent updates   | &#10060;                   | `mcr.microsoft.com`                                |
| **Storage Mover Service**  | Agent heartbeats and migration job assignments    | &#10060; | `<region>.agentgateway.prd.azsm.azure.com` |
| **Event Hubs**             | Publishing copy logs | &#10060;                   | `evhns-sm-ur-prd-<region>.servicebus.windows.net`  |
| **Azure Arc**              | Registration         | &#9989; (via Arc Private Link Scope) | `*.guestconfiguration.azure.com` and<br />`*.his.arc.azure.com` |
| **Microsoft Entra ID**     | Registration         | &#10060;                   | `login.microsoftonline.com` and<br />`pas.windows.net` |
| **Azure Resource Manager** | Registration         | &#10060;                   | `management.azure.com`                             |
| **Storage Account (Flat Blob)** | Job targets     | &#9989;                    | `*.blob.core.windows.net`                          |
| **Storage Account (HNS Blob)**  | Job targets     | &#9989;                    | `*.blob.core.windows.net` and<br />`*.dfs.core.windows.net` |
| **Storage Account (File)** | Job targets          | &#9989;                    | `*.file.core.windows.net`                          |
| **Key Vault**              | Data source endpoint access credentials, as needed | &#9989; |  `*.vault.azure.net`                    |

<!--
# [Fairfax](#tab/fairfax)

| Service                    | Needed For           | Supports Private Endpoints | FQDN                                                   |
|----------------------------|----------------------|----------------------------|--------------------------------------------------------|
| **Microsoft Artifact Registry** | Agent updates   | &#10060;                   | `mcr.microsoft.com`                                    |
| **Storage Mover Service**  | Agent heartbeats and migration job assignments | &#10060; | `<region>.agentgateway.ff.azsm.azure.us`       |
| **Event Hubs**             | Publishing copy logs | &#10060;                   | `evhns-sm-ur-ff-<region>.servicebus.usgovcloudapi.net` |
| **Azure Arc**              | Registration         | &#9989; (via Arc Private Link Scope) | `*.guestconfiguration.azure.com` and<br />`*.his.arc.azure.com` |
| **Microsoft Entra ID**     | Registration         | &#10060;                   | `login.microsoftonline.com` and<br />`pasff.usgovcloudapi.net` |
| **Azure Resource Manager** | Registration         | &#10060;                   | `management.usgovcloudapi.net`                         |
| **Storage Account (Flat Blob)** | Job targets     | &#9989;                    | `*.blob.core.usgovcloudapi.net`                        |
| **Storage Account (HNS Blob)**  | Job targets     | &#9989;                    | `*.blob.core.windows.net` and<br />`*.dfs.core.usgovcloudapi.net` |
| **Storage Account (File)** | Job targets          | &#9989;                    | `*.file.core.usgovcloudapi.net`                        |
| **Key Vault**              | SMB credentials      | &#9989;                    |  `*.vault.usgovcloudapi.net`                           |

---
-->

The following sections detail the required components, public endpoint dependencies, and networking considerations for deploying Storage Mover in a private network.

## Private networking requirements

Within the Storage Mover hierarchy, a storage mover resource is the top-level service resource that you deploy in your Azure subscription. All aspects of the service and of your migration are controlled from this resource. However, Storage Mover Agents perform most of the migration's work. Storage Mover agents are virtual machines within your network that are used to facilitate migrations by performing the data transfer.

To ensure that a Storage Mover Agent can operate within a private network, it must connect to several Azure services. Some of these services support private endpoints, while others require public endpoint access.

To ensure that a Storage Mover Agent connects privately to Azure resources, the following components are required:

- **Azure Virtual Network:**<br>
An Azure virtual network is an isolated network within Azure that provides the foundation for private connectivity. It allows you to define subnets, configure routing, and set up network security groups (NSGs) to control traffic flow. The virtual network serves as the backbone for connecting your on-premises infrastructure to Azure resources securely.
- **VPN Gateway or ExpressRoute:**<br>
You can use a VPN gateway or Azure ExpressRoute to link your on-premises network to your Azure virtual network. A VPN Gateway is used for Site-to-Site VPN connections between networks, while ExpressRoute provides a dedicated private connection. Both options enable secure communication between on-premises infrastructure and Azure resources. 
- **Private Endpoints:**<br>
Azure Private Endpoints are resources that can securely connect Azure services using a private IP from your virtual network. You can limit access to clients in your virtual network by creating a Private Endpoint resource and assigning it to another preexisting resource, such as a Storage Account or Key Vault.
- **DNS Configuration:**<br>
Proper DNS configuration is necessary to resolve the private endpoint IP addresses of your resource endpoints. Because you can create a Private DNS Zone and link it to your virtual network during Private Endpoint creation, this configuration can be accomplished during setup.

All services that support Private Endpoints can also be accessed as public endpoints, though some resources can be configured to either reject or allow public connections.

The following diagram illustrates an example of a resource topology for enabling private connectivity to all endpoints that support it. 

> [!NOTE]
> This configuration is one of many possible setups for a private network and doesn't encompass all components involved in network configuration, such as DNS, proxies, and virtual network peering.

:::image border="false" type="content" source="media/network-prerequisites/networking-topology-sml.png" alt-text="A diagram illustrating an example of a resource topology for enabling private connectivity to all endpoints that support it." lightbox="media/network-prerequisites/networking-topology-lrg.png":::

<sup>1</sup> Arc Private Link Scopes provide access to three Arc services as shown in the image. The *Extensions* Arc service isn't used by the Storage Mover Agent. It appears muted in the image to avoid confusion.<br>
<sup>2</sup> Arc Private Link Scopes and the three Arc services to which they connect can both be accessed directly over public endpoints. The Arc Private Link Scope can be configured to enable or disable public network access.<br>
<sup>3</sup> The recommended best practice is to use multiple Azure Virtual Networks. Use the Azure VPN Gateway to connect to the "hub" Virtual Network. Use a second "spoke" virtual network, connected to the "hub" using virtual network peering, to contain the resources. For detailed guidance, see [What is an Azure landing zone](/azure/cloud-adoption-framework/ready/landing-zone/).

## Public endpoint dependencies

Despite the emphasis on private networking, certain required Storage Mover services are only accessible via public endpoints, as shown in the preceding diagram. These services can be accessed securely over public endpoints using ExpressRoute Microsoft Peering, which provides a private tunnel to Azure services. For more information, see [Microsoft Peering](../expressroute/expressroute-circuit-peerings.md).

The following endpoints *must* be accessible over public endpoints for the Storage Mover Agent to function correctly:

- **Microsoft Artifact Registry** for automated agent updates.
- **The Storage Mover Service** for agent heartbeats and job coordination.
- **Event Hubs** for publishing copy logs.
- **Azure AD/Microsoft Entra ID** for registration and identity management.
- **Azure Resource Manager** for registration and resource management.

## Arc-enabled server considerations

The Storage Mover Agent is an Arc-enabled server and requires connectivity to several Azure services. Since many Arc services don't support Azure Private Endpoint resources directly, you need to determine if your requirements include communicating with Arc privately. If so, the recommended approach is to configure an Azure Arc Private Link Scope. 

A Private Link Scope allows you to maintain private connectivity by facilitating data flow through between private endpoints and the Arc services required by the Storage Mover Agent. For more information about Arc Private Link Scopes, see [Use Azure Private Link to securely connect servers to Azure Arc](/azure/azure-arc/servers/private-link-security).

> [!NOTE]
> Azure Arc Private Link Scopes aren't required for Storage Accounts or Key Vaults.

## Additional networking considerations

Beyond the core components, there are networking considerations that can be configured to enhance the security and functionality of the Storage Mover Agent. However, these configurations are optional, depend on your specific network requirements, and might affect networking performance - especially if misconfigured.

### Proxy support

The Storage Mover Agent supports external HTTP and HTTPS proxies. Configuration is done via the agent's shell within the **Network Configuration** section's **Update network configuration** menu. When prompted, select **Proxy** and enter the Fully Qualified Domain Name (FQDN) or IP address of the proxy. Include the port number if necessary. The following example illustrates the configuration steps:

:::image type="content" source="media/network-prerequisites/proxy-configuration-sml.png" alt-text="A screenshot showing the proxy configuration screen in the Storage Mover Agent." lightbox="media/network-prerequisites/proxy-configuration-lrg.png":::

### SSL inspection
If your network performs SSL interception, the agent might fail to recognize modified certificates. Currently, adding custom certificates to the agent isn't supported. To avoid issues, add required endpoints to the allowlist to bypass SSL inspection. These endpoints are available in the [Networking overview](#networking-overview) section.
