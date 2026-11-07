---
title: Configure private network connectivity for on-premises to Azure migrations with Azure Storage Mover
description: Set up hybrid network connectivity between on-premises SMB shares or S3-compatible object storage and Azure, and run migrations that keep data off the public internet.
author: rajsinghmsa
ms.service: azure-storage-mover
ms.topic: concept-article
ms.author: singra
ms.date: 10/06/2026
zone_pivot_groups: storage-mover-on-premises
---

# Configure private network connectivity for on-premises to Azure migrations with Azure Storage Mover

:::zone pivot="on-premises-smb"

Azure supports several ways to connect to private networks. The best approach depends on your requirements for latency, bandwidth, security, cost, and operational complexity.

* **Azure ExpressRoute** - Private, dedicated connectivity that doesn't traverse the public internet.
* **Site-to-site IPsec VPN** - Encrypted tunnels over the public internet (typically using Azure VPN Gateway).
* **SD-WAN via network virtual appliances (NVAs)** - Third-party appliances provide VPN and firewall features, and they can terminate tunnels instead of using native gateways.

In general, ExpressRoute is preferred for the highest bandwidth and lowest latency. When ExpressRoute isn't available, use site-to-site VPN or an SD-WAN/NVA-based design.

## Key concepts

**ExpressRoute**: Private connectivity to Azure through a connectivity provider. Typically used for predictable latency and higher throughput.

**Azure VPN Gateway SKU**: The gateway size/SKU affects tunnel counts and throughput. Choose based on required bandwidth and resiliency.

**IPsec/IKE policy**: Cryptographic algorithms and parameters used to establish and secure VPN tunnels, such as AES and SHA families, DH, and PFS groups.

**BGP (Border Gateway Protocol)**: Dynamic routing that exchanges prefixes between networks. Commonly used for active/active tunnels and route failover.

**Network virtual appliance (NVA)**: A third-party virtual network device, such as a firewall or SD-WAN deployed in Azure. Often used for advanced inspection, policy, and routing.

**UDR (user-defined routes)**: Custom routes in Azure that steer traffic to a specific next hop, such as an NVA.

**Azure Private Link Service Direct Connect**: Azure capability to create outbound private connectivity to a destination IP, such as an AWS VPCE IP, for services like Storage Mover private connections.

**Private connection approval**: Private connections might require explicit approval before workloads or jobs can use them.

## When to use each option

**ExpressRoute**: Choose when you need predictable performance, private connectivity, and higher throughput for hybrid connectivity.

**Site-to-site VPN**: Choose for faster setup, lower cost, or as a backup path. Performance depends on internet conditions and gateway SKU.

**SD-WAN/NVAs**: Choose when you need vendor-specific routing, security inspection, or an existing SD-WAN operational model.

| **Option** | **Connectivity path** | **Typical strengths** | **Common tradeoffs** |
|---|---|---|---|
| **ExpressRoute** | Private circuit via provider/colocation | Low latency, high throughput, predictable performance | Lead time, cost, provider dependencies |
| **Site-to-site IPsec VPN** | Encrypted tunnels over public internet | Quick to deploy, good for backup/DR | Variable performance; throughput limits per gateway/SKU |
| **SD-WAN / NVAs** | Tunnels terminate on third-party appliances | Advanced policy, inspection, vendor features | More components to manage; appliance sizing/licensing |

## Connectivity options in Azure

### ExpressRoute

**Learn more:** [ExpressRoute documentation](/azure/expressroute/)

**Routing:** Use BGP over private circuits to exchange prefixes between Azure and your network.

**Connectivity providers:** Typically, you provision ExpressRoute through a colocation or connectivity provider, such as Equinix or Megaport.

### Site-to-site IPsec VPN (Azure VPN Gateway)

**Overview:** Use VPN Gateway for encrypted site-to-site IPsec tunnels over the public internet. For higher throughput and resilience, select an appropriate gateway SKU, such as Generation2 and zone-redundant SKUs where available.

**Learn more:** [Tutorial - Create an S2S VPN connection](/azure/vpn-gateway/tutorial-site-to-site-portal)

**Routing:** Use BGP to exchange routes and support active/active tunnels across multiple connections.

#### Implementation tips (VPN performance)

Example custom IPsec/IKE settings (validate against your device compatibility): **GCMAES256** for IPsec encryption and integrity, **SHA256** for IKE integrity, **DHGroup14**, **PFS2048**.

:::image type="content" source="./media/cloud-to-cloud-networking/ipsec-policy.png" alt-text="Screenshot of ipsec policy." lightbox="./media/cloud-to-cloud-networking/ipsec-policy.png":::

**Learn more:** [Configure custom IPsec/IKE connection policies](/azure/vpn-gateway/ipsec-ike-policy-howto).

### SD-WAN with network virtual appliances (NVAs)

SD-WAN and firewall NVAs can terminate VPN tunnels, perform inspection, and apply centralized routing and security policy. This approach is useful when you need vendor-specific capabilities or you already operate an SD-WAN platform across sites.

**Fortinet**: FortiGate Next-Generation Firewall

**Cisco**: Catalyst SD-WAN, Meraki SD-WAN

**HPE (Aruba Networks)**: EdgeConnect SD-WAN

**Palo Alto Networks**: Prisma SD-WAN

**Arista (VMware)**: VeloCloud SD-WAN Virtual Edge

SD-WAN NVAs are commonly licensed as either pay-as-you-go (PAYG) or bring-your-own-license (BYOL). Vendor support varies by deployment option.

#### Example deployment (FortiGate NVA in Azure)

**Select a topology** (single VM, active/passive, or active/active) based on availability and throughput requirements.

**Choose a suitable VM size** (often F or D-series with higher vCPU) and enable **accelerated networking** where supported.

**Network design**: place interfaces in WAN/LAN (and protected) subnets and configure NSG rules for required management and VPN ports (for example, UDP 500/4500 for IPsec).

**Routing**: use UDRs to steer Azure-to-AWS prefixes through the NVA next hop.

**Vendor documentation:** For example steps to configure IPsec between FortiGate devices, see the Fortinet Community article below.

[How to configure VPN site-to-site between FortiGate devices (Fortinet Community)](https://community.fortinet.com/t5/FortiGate/Technical-Tip-How-to-configure-VPN-Site-to-Site-between/ta-p/197922)

#### Security group considerations

Allow required traffic from on-premises source prefixes to the Azure virtual network (VNet) using the principle of least privilege.

## Azure configuration for Private Link Service Direct Connect

> [!IMPORTANT]
> Your Azure VNet should have connectivity to your on-premises resources through the Private Link Scope direct connect.

> [!IMPORTANT]
> For Windows SMB share sources, ensure that secure traffic is permitted on port 445 by default.

### Create the Private Link Service Direct Connect resource

Private Link Service Direct Connect enables Azure to create outbound private connectivity to a destination IP address. In this scenario, it enables Storage Mover private connections to reach an on-premises endpoint over your established Azure VNet path.

1. Deploy the PLS Direct Connect resource in the **same Azure region** as the Storage Mover resource and the Azure virtual network used to reach your on-premises data.
1. Enable the feature in the Azure portal by using the provided flight link: [Azure portal flight link (PLS Direct Connect)](https://ms.portal.azure.com/?feature.canmodifystamps=true&exp.plsdirectconnect=true).
1. Ensure the Azure VNet and subnet selected for source NAT has connectivity to the source target address.

#### High-level steps

1. Create the **Private Link Service (Your Service)** resource for Direct Connect in the correct region.
1. Configure **Outbound settings**:
1. Set connection method to **Destination IP address** and enter the **source target address**.
1. Select the **source NAT** virtual network and subnet that can route to your file share.
1. Configure private IP address settings as required for resiliency, such as two or more addresses in supported increments.

### Create and approve private connections

After creating the Direct Connect resource, create a private connection in Storage Mover and approve it before use.

1. In **Storage Mover**, open **Storage Endpoints** and then the **Private Connections** tab.
1. Create a private connection that references the Direct Connect private link service, and then approve it so it can be associated to jobs.
1. Use the preceding private connection as part of the *create job* operation for your SMB migration workload.
1. Select the migration type and source type values corresponding to **agentless SMB mount** in your tenant.
1. Configure the SMB source endpoint (host/share and Key Vault credentials) and associate the approved private connection.
1. Verify the private connection is listed and in **Approved** state.
1. Complete the remaining job configuration and run steps as documented for SMB-to-Azure target migrations.

## Troubleshooting

### Connectivity and IP addressing

- Verify Destination IP in Azure PLS: Ensure the Azure Private Link Service Direct connects Destination IP points to the correct reachable server on-premises. A mismatch here prevents the initial handshake.
- Validate Network Path: Confirm that the underlying network infrastructure (for example, VPN, ExpressRoute, or Cloud Interconnect) is established and routing traffic correctly between the Azure environment and the on-premises network.
- Check the Virtual Network Configurations: Review the virtual network and, as applicable, the network gateway configuration to ensure it's active and associated with the correct subnets and security groups.

### On-premises network configuration

Allow network traffic over required ports: Verify firewall settings allow the inbound network traffic over required ports (port 445 for SMB traffic) from Azure virtual network.

## Limits

* You can configure up to 10 private connections per region. This limit includes private connection states in **Approved**, **Pending**, and **Disconnected** states.
* Configure PLS direct in the same region as the Storage Mover resource.

## Performance

| **Setup**                                                          | ** Max Throughput (Approximate)** |
|--------------------------------------------------------------------|-----------------------------|
| **FortiGate SDWAN with a Private Connection**                      | 2 Gbps                      |
| **2 FortiGate SDWANs each with VPN tunnel and Private Connection** | 2 Gbps * 2                  |

:::zone-end

:::zone pivot="on-premises-s3"

Azure Storage Mover supports secure, large-scale data migration from on-premises S3-compatible object storage, including scenarios that require strict network isolation. By using hybrid connectivity (ExpressRoute or site-to-site VPN) together with Storage Mover private connections, data transfers stay on a private path between your datacenter and Azure.

This article explains how to set up hybrid network connectivity between your on-premises S3 endpoint and Azure, configure private connections in Storage Mover, and create a migration job that keeps data off the public internet.

> [!NOTE]
> On-premises S3 migration reuses the same hybrid-connectivity building blocks that Azure Storage Mover uses for SMB and NFS on-premises migrations (ExpressRoute or site-to-site VPN), plus a Storage Mover private connection that targets the S3 endpoint over HTTPS (TCP 443). The main addition for S3 is the requirement for a publicly trusted, CA-signed certificate on the endpoint.

## Prerequisites

### Azure prerequisites

- An active Azure subscription with permissions to create and manage Azure Storage Mover resources.
- A Storage Mover resource deployed in your Azure subscription.
- An Azure Key Vault to store your S3 access keys (Access Key and Secret Key).
- Familiarity with the Azure Storage Mover resource hierarchy.

### On-premises prerequisites

- An S3-compatible object storage system (for example, MinIO, Dell ECS, NetApp StorageGRID, Cloudian, Scality, or Pure Storage FlashBlade) that exposes an Amazon S3 API endpoint over HTTPS.
- S3 access keys generated on the appliance (Access Key ID + Secret Key) with read and list permissions on the target buckets.
- A **publicly trusted, CA-signed TLS certificate** installed on the S3 endpoint whose subject or SAN matches the endpoint FQDN. Self-signed and private-CA certificates aren't supported.
- A stable private IP address (or load-balancer VIP) for the S3 endpoint that is reachable from Azure over your hybrid link.
- An on-premises edge device (VPN device or router) that can establish an ExpressRoute circuit or IPsec site-to-site VPN to Azure.

### Private networking prerequisites

- A Private Link Service (PLS) Direct Connect resource configured in Azure with the on-premises S3 endpoint IP as the destination.
- Familiarity with Azure Private Link networking documentation.

## Private network connectivity options

To migrate data from an on-premises S3 endpoint that isn't publicly reachable, you first need a private network path between your datacenter and Azure. Azure supports several connectivity options:

| Option | Connectivity path | Strengths | Tradeoffs |
|---|---|---|---|
| ExpressRoute | Private circuit via provider (Equinix, Megaport) | Low latency, high throughput, predictable performance | Lead time, cost, provider dependencies |
| Site-to-site IPsec VPN (Azure VPN Gateway) | Encrypted tunnels over public internet | Quick to deploy, lower cost | Variable performance; throughput limits per gateway SKU |
| SD-WAN / NVAs | Tunnels terminate on third-party appliances (Fortinet, Cisco, Palo Alto) | Advanced policy, inspection, vendor features | More components to manage; appliance sizing/licensing |

For most scenarios, site-to-site VPN provides a good balance of cost and performance. For highest throughput, use ExpressRoute. If you already operate an SD-WAN platform across sites, terminate tunnels on your existing NVAs.

## Connectivity options in Azure

### ExpressRoute

**Learn more:** [ExpressRoute documentation](/azure/expressroute/)

**Routing:** Use BGP over private circuits to exchange prefixes between Azure and your network.

**Connectivity providers:** Typically, you provision ExpressRoute through a colocation or connectivity provider, such as Equinix or Megaport.

### Site-to-site IPsec VPN (Azure VPN Gateway)

**Overview:** Use Azure VPN Gateway for encrypted site-to-site IPsec tunnels over the public internet. For higher throughput and resilience, select an appropriate gateway SKU, such as Generation2 and zone-redundant SKUs where available.

**Learn more:** [Tutorial - Create an S2S VPN connection](/azure/vpn-gateway/tutorial-site-to-site-portal)

**Routing:** Use BGP to exchange routes and support active/active tunnels across multiple connections.

### SD-WAN with network virtual appliances (NVAs)

SD-WAN and firewall NVAs can terminate VPN tunnels, perform inspection, and apply centralized routing and security policy. This approach is useful when you need vendor-specific capabilities or you already operate an SD-WAN platform across sites. Examples include Fortinet FortiGate, Cisco Catalyst SD-WAN, and Palo Alto Prisma SD-WAN. Use user-defined routes (UDRs) to steer Azure-to-datacenter prefixes through the NVA next hop, and open TCP 443 for HTTPS along with the VPN ports, such as UDP 500 and 4500 for IPsec.

## Implementation tips (VPN performance)

Example custom IPsec/IKE settings (validate against your device compatibility): **GCMAES256** for IPsec encryption and integrity, **SHA256** for IKE integrity, **DHGroup14**, and **PFS2048**.

**Learn more:** [Configure custom IPsec/IKE connection policies](/azure/vpn-gateway/ipsec-ike-policy-howto).

## Configure hybrid connectivity between Azure and your datacenter

**On the on-premises side:**

- Configure your VPN device or router to establish IPsec site-to-site tunnels to the Azure VPN Gateway public IP addresses (or provision an ExpressRoute circuit through your provider).
- Configure **BGP** (or static routing) to advertise the subnet that contains the S3 endpoint to Azure.
- Ensure the S3 endpoint IP address (or load-balancer VIP) is reachable from Azure over the tunnel.
- Allow inbound **HTTPS (TCP 443)** from the Azure source NAT range to the S3 endpoint on your firewall.

> [!NOTE]
> Validate the IPsec/IKE parameters on your on-premises device against the Azure VPN Gateway policy so both ends negotiate the same ciphers.

**On the Azure side:**

- Deploy an Azure VPN Gateway (or ExpressRoute gateway) in the virtual network you'll use to reach your datacenter.
- Establish the connection and confirm BGP sessions are up and the on-premises S3 subnet is learned.

## Ensure a CA-signed certificate on the S3 endpoint

The Storage Mover data plane validates the S3 endpoint's TLS certificate against publicly trusted certificate authorities.

- Install a **publicly trusted, CA-signed certificate** on the S3 endpoint (or on the load balancer/reverse proxy terminating TLS).
- Ensure the certificate subject or SAN matches the FQDN you use in the source URL.
- Publish a DNS record so the endpoint FQDN resolves to the private IP reachable over the hybrid link.

> [!IMPORTANT]
> Self-signed certificates, private/internal enterprise-CA certificates, and IP-address-only certificates aren't supported. If your appliance ships with a self-signed certificate by default, replace it before you migrate.

## Create the private link service direct connect resource

Private Link Service (PLS) Direct Connect creates outbound private connectivity from Azure to a destination IP address. For on-premises S3, the destination IP is the S3 endpoint IP in your datacenter, reachable through your VPN or ExpressRoute link.

- In the Azure portal, go to **Home** > **Network foundation** > **Private Link services**.
- Select **Create a private link service**.
- On the **Basics** tab, select the same Azure region as your Storage Mover resource.
- On the **Outbound settings** tab:
  - Connection method: select **Destination IP address**.
  - IP address: enter the on-premises S3 endpoint IP address that you recorded earlier.
  - Source NAT Virtual network: select the VNet containing your Azure VPN Gateway or ExpressRoute gateway.
  - Source NAT subnet: select the subnet with connectivity to your datacenter.
  - Private IP address settings: configure at least two NAT IPs (even number required).
- On the **Access security** tab: select the appropriate visibility setting (Role-based access control only is most restrictive).
- Select **Review + create**.

## Create and approve private connections

After creating the PLS Direct Connect resource, create a private connection in Storage Mover and approve it before use.

### Create a private connection

1. Go to your Storage Mover resource in the Azure portal.
1. Under **Resource management**, select **Storage endpoints**.
1. Select the **Private connections (Preview)** tab.
1. Select **Add private connections**.
1. Enter a name for the private connection.
1. Select the **Private Link Service Direct Connect** resource you created.
1. Select **Create**. Provisioning takes 20-30 seconds. Refresh to see the connection in the grid.

> [!TIP]
> Create multiple private connections (each backed by a separate PLS Direct Connect resource) to maximize bandwidth and avoid single-connection throughput limits.

### Approve the private connection

1. Select the checkbox next to your newly created private connection.
1. Select **Approve**.
1. Wait for the **Private link service connection** status to change to **Approved**.

> [!IMPORTANT]
> Only private connections in **Approved** state can be used for migration jobs. Connections in pending, rejected, or disconnected states don't appear as options.

## Create a migration job with private connections

### Basics tab

| Field | Value |
|---|---|
| Migration type | Multicloud migration |
| Source type | S3-compatible object storage (Preview) |
| S3 bucket type | Private (Preview) |
| Name | A meaningful name for the job |
| Description | (Optional) Up to 1,024 characters |

- **Source endpoint**: select an existing on-premises S3-compatible source endpoint, or select **Add source endpoint** to create one.
- **Target Endpoint**: select an existing Azure Blob Storage target endpoint, or select **Add target endpoint**.
- In the **Private connections (Preview)** section, select **Add** to associate approved private connections with this job. You can associate multiple private connections for load balancing.
- Remaining job steps are the same as a public S3-to-Blob migration.

## Troubleshooting

### Connectivity and IP addressing

- **Verify Destination IP in Azure PLS:** ensure PLS Direct Connect points to your on-premises S3 endpoint IP address. A mismatch prevents connectivity.
- **Validate network path:** confirm the site-to-site VPN tunnels (or ExpressRoute circuit) show an **Up/Connected** status.
- **Check routing:** confirm BGP sessions are established and the on-premises S3 subnet is advertised to Azure.
- **Verify firewall rules:** confirm inbound HTTPS (TCP 443) from the Azure source NAT range is allowed to the S3 endpoint.
- **Check region alignment:** PLS Direct Connect and Storage Mover must be in the same Azure region.

### Certificate and authentication

- Confirm the S3 endpoint presents a publicly trusted, CA-signed certificate whose subject or SAN matches the endpoint FQDN.
- Verify the Access Key and Secret Key in Key Vault are active and correct.
- Confirm the source endpoint managed identity has the **Key Vault Secrets User** role on your Key Vault.
- If S3 client initialization fails, use path-style URLs for buckets whose names contain `_` or `.`.

## Known limits

- Maximum 10 private connections per subscription per region (Approved + Pending + Disconnected combined).
- PLS Direct Connect must be configured in the same region as the Storage Mover resource.
- Scheduling isn't available for the S3-compatible source type. You must run jobs manually.
- Each migration job supports transfer of up to 500 million objects.
- Only HTTPS access to the S3-compatible source is supported (TCP 443).
- Only publicly trusted CA-signed certificates are supported for S3-compatible endpoints.
- The S3-compatible source must support AWS Signature Version 4 (SigV4) authentication.
- Buckets with DNS-incompatible names (`_`, `.`) must use path-style URLs.

## Performance

The following benchmarks show results for VPN Gateway with multiple IPsec tunnels combined with Storage Mover private connections. Actual throughput depends on your datacenter link, VPN/ExpressRoute, and appliance limits.

| Setup | Approximate maximum throughput |
|---|---|
| Azure VPN Gateway - 4 IPsec tunnels + 1 private connection | ~4.5 Gbps |
| Azure VPN Gateway - 4 IPsec tunnels + 2 private connections | ~5.6 Gbps |
| FortiGate SD-WAN with a private connection | ~2 Gbps |
| 2 FortiGate SD-WANs, each with a VPN tunnel and private connection | ~2 Gbps x 2 |

:::zone-end

## Next steps

:::zone pivot="on-premises-smb"

- [Migrate data from on-premises SMB to Azure Files with Azure Storage Mover (Preview)](agentless-on-premises-files-migration.md)
- [Migrate data using private connections in Azure Storage Mover](migrations-requiring-private-connections.md)
- [Azure Storage Mover networking requirements](network-prerequisites.md)

:::zone-end

:::zone pivot="on-premises-s3"

- Review ExpressRoute concepts and planning in the [ExpressRoute documentation](/azure/expressroute/).
- Create a site-to-site VPN connection in Azure: [Tutorial - Create an S2S VPN connection](/azure/vpn-gateway/tutorial-site-to-site-portal).
- [Migrate data from on-premises S3-compatible object storage to Azure Blob Storage](on-premises-s3-compatible-migration.md)

:::zone-end
