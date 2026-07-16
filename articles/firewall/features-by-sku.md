---
title: Azure Firewall features by SKU
description: Comprehensive overview of Azure Firewall features across Basic, Standard, and Premium SKUs with detailed feature explanations.
services: firewall
author: duongau
ms.service: azure-firewall
ms.topic: concept-article
ms.date: 09/18/2025
ms.author: duau
# Customer intent: As a network security administrator, I want to understand all Azure Firewall features across different SKUs, so that I can choose the right version and effectively implement network security for our Azure Virtual Network resources.
---

# Azure Firewall features by SKU

Azure Firewall is a managed, cloud-based network security service that protects your Azure Virtual Network resources. It offers three SKUs - Basic, Standard, and Premium - each designed for different use cases and security requirements.

:::image type="content" source="media/features-by-sku/firewall-overview.png" alt-text="Diagram showing Azure Firewall deployment architecture protecting Azure Virtual Network resources from threats.":::

This article provides a comprehensive overview of all Azure Firewall features organized by SKU to help you understand capabilities and choose the right version for your needs.

## Feature comparison table

The following table compares features across all Azure Firewall SKUs:

| Category | Feature | Basic | Standard | Premium |
| --- | --- | --- | --- | --- |
| **Core firewall capabilities** | Stateful firewall (5-tuple rules) | ✓ | ✓ | ✓ |
|  | Network address translation (SNAT+DNAT) | ✓ | ✓ | ✓ |
|  | Built-in high availability | ✓ | ✓ | ✓ |
|  | Availability zones | ✓ | ✓ | ✓ |
| **Filtering and inspection** | Application level FQDN filtering (SNI based) for HTTPS/SQL | ✓ | ✓ | ✓ |
|  | Network level FQDN filtering – all ports and protocols |  | ✓ | ✓ |
|  | Network traffic filtering rules | ✓ | ✓ | ✓ |
|  | Web content filtering (web categories) |  | ✓ | ✓ |
|  | URL filtering (full path - including SSL termination) |  |  | ✓ |
|  | Outbound TLS termination (TLS forward proxy) |  |  | ✓ |
|  | Inbound TLS termination (TLS reverse proxy) |  |  | Using Azure Application Gateway |
| **Threat protection** | Threat intelligence-based filtering (known malicious IP address/domains) | Alert only | Alert and Deny | Alert and Deny |
|  | Fully managed IDPS |  |  | ✓ |
| **DNS** | DNS proxy + custom DNS |  | ✓ | ✓ |
| **Performance and scale** | Cloud scalability (auto-scale as traffic grows) | Up to 250 Mbps | Up to 30 Gbps | Up to 100 Gbps |
|  | Fat flow support | N/A | 1 Gbps | 10 Gbps |
| **Management and monitoring** | Central management via Firewall Manager | ✓ | ✓ | ✓ |
|  | Policy analytics (rule management over time) | ✓ | ✓ | ✓ |
|  | Full logging including SIEM integration | ✓ | ✓ | ✓ |
|  | Service tags and FQDN tags for easy policy management | ✓ | ✓ | ✓ |
|  | Easy DevOps integration using REST/PowerShell/CLI/templates/Terraform | ✓ | ✓ | ✓ |
| **Advanced networking** | Multiple public IP addresses | ✓ | Up to 250 | Up to 250 |
|  | Forced tunneling |  | ✓ | ✓ |
|  | Deployment without public IP address in Forced Tunnel Mode |  | ✓ | ✓ |
| **Compliance** | Certifications (PCI, SOC, ISO) | ✓ | ✓ | ✓ |
|  | Payment Card Industry Data Security Standard (PCI DSS) compliance |  |  | ✓ |

## Azure Firewall Basic features

Azure Firewall Basic is designed for small and medium-sized businesses (SMBs) to secure their Azure cloud environments with essential protection at an affordable price.

:::image type="content" source="media/features-by-sku/firewall-basic.png" alt-text="Diagram showing Firewall Basic.":::

### Key Basic features

- **Built-in high availability**: High availability is built in, so no extra load balancers are required and there's nothing you need to configure.

- **Availability Zones**: Azure Firewall can be configured during deployment to span multiple Availability Zones for increased availability. You can also associate Azure Firewall to a specific zone for proximity reasons.

- **Application FQDN filtering rules**: You can limit outbound HTTP/S traffic or Azure SQL traffic to a specified list of fully qualified domain names (FQDN) including wild cards. This feature doesn't require Transport Layer Security (TLS) termination.

- **Network traffic filtering rules**: You can centrally create allow or deny network filtering rules by source and destination IP address, port, and protocol. Azure Firewall is fully stateful, so it can distinguish legitimate packets for different types of connections.

- **FQDN tags**: [FQDN tags](fqdn-tags.md) make it easy for you to allow well-known Azure service network traffic through your firewall. For example, you can create an application rule and include the Windows Update tag to allow network traffic from Windows Update to flow through your firewall.

- **Service tags**: A [service tag](service-tags.md) represents a group of IP address prefixes to help minimize complexity for security rule creation. Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change.

- **Threat intelligence (alert mode only)**: [Threat intelligence-based filtering](threat-intel.md) can be enabled for your firewall to alert on traffic from/to known malicious IP addresses and domains. In Basic SKU, this feature only provides alerts and cannot deny traffic.

- **Outbound SNAT support**: All outbound virtual network traffic IP addresses are translated to the Azure Firewall public IP (Source Network Address Translation). You can identify and allow traffic originating from your virtual network to remote Internet destinations.

- **Inbound DNAT support**: Inbound Internet network traffic to your firewall public IP address is translated (Destination Network Address Translation) and filtered to the private IP addresses on your virtual networks.

- **Multiple public IP addresses**: You can associate multiple public IP addresses with your firewall for enhanced DNAT and SNAT scenarios.

- **Azure Monitor logging**: All events are integrated with Azure Monitor, allowing you to archive logs to a storage account, stream events to your event hub, or send them to Azure Monitor logs.

- **Certifications**: Azure Firewall Basic is Payment Card Industry (PCI), Service Organization Controls (SOC), and International Organization for Standardization (ISO) compliant.

### Basic limitations

- **Throughput**: Limited to 250 Mbps
- **DNS proxy**: Not available (uses Azure DNS only)
- **Threat intelligence**: Alert mode only (cannot deny traffic)
- **Network FQDN filtering**: Not supported (application FQDN filtering only)
- **Web categories**: Not supported
- **Forced tunneling**: Not supported

## Azure Firewall Standard features

Azure Firewall Standard is suitable for customers requiring Layer 3–Layer 7 firewall capabilities with autoscaling to manage peak traffic up to 30 Gbps. It includes enterprise features like threat intelligence, DNS proxy, custom DNS, and web categories.

:::image type="content" source="media/features-by-sku/firewall-standard.png" alt-text="Diagram showing Azure Firewall Standard deployment with enhanced features including threat intelligence, DNS proxy, and network-level FQDN filtering capabilities.":::

### Key Standard features

Standard includes all Basic features, plus:

- **Unrestricted cloud scalability**: Azure Firewall can scale out as much as you need to accommodate changing network traffic flows, so you don't need to budget for your peak traffic (up to 30 Gbps).

- **Network level FQDN filtering**: You can use fully qualified domain names (FQDNs) in network rules based on DNS resolution. This capability allows you to filter outbound traffic using FQDNs with any TCP/UDP protocol (including NTP, SSH, RDP, and more).

- **Threat intelligence (alert and deny)**: [Threat intelligence](threat-intel.md)-based filtering can be enabled for your firewall to alert and deny traffic from/to known malicious IP addresses and domains. The IP addresses and domains are sourced from the Microsoft Threat Intelligence feed.

- **DNS proxy**: With DNS proxy enabled, Azure Firewall can process and forward DNS queries from virtual networks to your desired DNS server. This functionality is crucial for reliable FQDN filtering in network rules.

- **Custom DNS**: Custom DNS allows you to configure Azure Firewall to use your own DNS server, while ensuring the firewall outbound dependencies are still resolved with Azure DNS. You can configure a single DNS server or multiple servers.

- **Forced tunneling**: You can configure Azure Firewall to route all Internet-bound traffic to a designated next hop instead of going directly to the Internet. For example, you can have an on-premises edge firewall or other network virtual appliance (NVA) to process network traffic before it's passed to the Internet.

- **Deploy without public IP address in Forced Tunnel mode**: You can deploy Azure Firewall in Forced Tunnel mode, which creates a management NIC that is used by Azure Firewall for its operations. The tenant datapath network can be configured without a public IP address, and Internet traffic can be forced tunneled to another firewall or blocked.

- **Web categories**: Web categories let administrators allow or deny user access to web site categories such as gambling websites, social media websites, and others. In Standard, categorization is based on FQDN only.

- **Enhanced multiple public IP support**: You can associate up to 250 public IP addresses with your firewall.

### Standard limitations compared to Premium

- **TLS inspection**: Not supported
- **IDPS**: Not supported  
- **URL filtering**: Not supported (FQDN filtering only)
- **Advanced web categories**: Basic FQDN-based categorization only
- **Performance**: Limited to 30 Gbps vs 100 Gbps for Premium

## Azure Firewall Premium features

Azure Firewall Premium offers advanced threat protection suitable for highly sensitive and regulated environments, such as payment and healthcare industries. It includes all Standard features plus advanced security capabilities.

:::image type="content" source="media/features-by-sku/firewall-premium.png" alt-text="Diagram showing Azure Firewall Premium deployment with advanced security features including TLS inspection, IDPS capabilities, URL filtering, and enhanced threat protection for enterprise environments.":::

### Key Premium features

Premium includes all Standard features, plus:

- **TLS inspection**: Decrypts outbound traffic, processes it, then re-encrypts and sends it to the destination. Azure Firewall Premium terminates and inspects TLS connections to detect, alert, and mitigate malicious activity in HTTPS. It creates two TLS connections: one with the web server and another with the client.

  - **Outbound TLS Inspection**: Protects against malicious traffic sent from an internal client hosted in Azure to the Internet.
  - **East-West TLS Inspection**: Protects Azure workloads from potential malicious traffic sent within Azure, including traffic to/from an on-premises network.

- **IDPS (Intrusion Detection and Prevention System)**: A network intrusion detection and prevention system (IDPS) monitors your network for malicious activity, logs information, reports it, and optionally blocks it. Azure Firewall Premium offers signature-based IDPS with:
  - Over 67,000 rules in more than 50 categories
  - 20 to 40+ new rules released daily
  - Low false positive rate using advanced malware detection techniques
  - Support for customizing up to 10,000 IDPS rules
  - Private IP ranges configuration for traffic direction determination

- **URL filtering**: Extends Azure Firewall's FQDN filtering capability to consider the entire URL, such as `www.contoso.com/a/c` instead of just `www.contoso.com`. URL filtering can be applied to both HTTP and HTTPS traffic when TLS inspection is enabled.

- **Advanced web categories**: Allows or denies user access to website categories such as gambling or social media with enhanced granularity. Unlike Standard which only examines FQDNs, Premium matches categories based on the entire URL for both HTTP and HTTPS traffic.

  For example, if Azure Firewall intercepts an HTTPS request for `www.google.com/news`:
  - Firewall Standard: Only the FQDN part is examined, so `www.google.com` is categorized as *Search Engine*
  - Firewall Premium: The complete URL is examined, so `www.google.com/news` is categorized as *News*

- **Enhanced performance**: Azure Firewall Premium uses a more powerful virtual machine SKU and can scale up to 100 Gbps with 10 Gbps fat flow support.

- **PCI DSS compliance**: The Premium SKU complies with Payment Card Industry Data Security Standard (PCI DSS) requirements, making it suitable for processing payment card data.

### Premium-only capabilities

- **IDPS Private IP ranges**: Configure private IP address ranges to determine if traffic is inbound, outbound, or internal (East-West)
- **IDPS signature rules**: Customize signatures by changing their mode to *Disabled*, *Alert*, or *Alert and Deny*
- **Web category search**: Identify the category of an FQDN or URL using the **Web Category Check** feature
- **Category change requests**: Request category changes for FQDNs or URLs that should be in different categories
- **TLS inspection certificate management**: Support for customer-provided CA certificates for TLS inspection

## Common features across all SKUs

### Built-in high availability and Availability Zones

All Azure Firewall SKUs include:
- Built-in high availability with no extra load balancers required
- Support for Availability Zones deployment for increased availability
- No extra cost for deployment across multiple Availability Zones

### Network Address Translation (NAT)

All SKUs support:
- **Source NAT (SNAT)**: All outbound virtual network traffic IP addresses are translated to the Azure Firewall public IP
- **Destination NAT (DNAT)**: Inbound Internet network traffic to your firewall public IP address is translated and filtered to private IP addresses

### Management and monitoring

All SKUs include:
- **Azure Monitor integration**: All events are integrated with Azure Monitor for logging and monitoring
- **Azure Firewall Workbook**: Flexible canvas for Azure Firewall data analysis
- **Central management**: Support for Azure Firewall Manager
- **Policy analytics**: Rule management and analysis over time
- **DevOps integration**: REST/PowerShell/CLI/templates/Terraform support

### Compliance and certifications

All SKUs are:
- Payment Card Industry (PCI) compliant
- Service Organization Controls (SOC) compliant  
- International Organization for Standardization (ISO) compliant

Premium additionally provides PCI DSS compliance for payment processing environments.

## Next steps

- [Choose the right Azure Firewall SKU to meet your needs](choose-firewall-sku.md)
- [Deploy and configure Azure Firewall using the Azure portal](tutorial-firewall-deploy-portal-policy.md)
- [Azure Firewall Premium certificates](premium-certificates.md)
- [Learn more about Azure network security](../networking/security/index.yml)