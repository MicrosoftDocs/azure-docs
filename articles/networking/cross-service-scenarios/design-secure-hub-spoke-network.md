---
title: Design a secure hub-spoke network for regional web applications in Azure
description: Learn how to build a secure-by-default network foundation for regional web applications using a minimal hub-spoke topology with Application Gateway, WAF, DDoS Protection, Bastion, NSGs, and virtual network peering.
author: mbender-ms
ms.author: mbender
ms.reviewer: mbender
ms.service: azure-virtual-network
ms.topic: concept-article
ms.date: 03/24/2026

#CustomerIntent: As a network engineer or architect at a small or midsize organization, I want to understand secure network design patterns for regional web applications using a hub-spoke topology so that I can build a secure-by-default network foundation in Azure that scales as my organization grows.
---

# Design a secure hub-spoke network for regional web applications in Azure

When you host a web application in Azure, the network design you choose determines how much of your infrastructure is exposed to attack. Without an intentional design, teams commonly leave default configurations in place, expose management ports to the internet, or skip application-layer inspection—all of which increase the attack surface.

This article explains a repeatable architecture pattern that uses a minimal [hub-spoke topology](/azure/architecture/networking/architecture/hub-spoke) to build a secure-by-default foundation for single-region web applications. A hub virtual network hosts shared services like Azure Bastion, while a spoke virtual network contains your workload—whether running on Azure App Service (PaaS) or virtual machines (IaaS). The pattern scales from a single web app to multiple workloads by adding spokes.

The pattern follows a layered approach. The hub and spoke virtual networks form the base, virtual network (VNet) peering connects them, and NSGs add default-deny access control at every subnet boundary. Higher-level services—Application Gateway with Web Application Firewall (WAF) in the spoke, Azure Bastion in the hub, and DDoS Protection across both—layer on top. Each layer depends on the one below it. The [Deployment steps](#deployment-steps) section later in this article walks through the recommended order.

This pattern is for network engineers and architects at small or midsize organizations who need to:

- Separate shared services from workloads using a hub-spoke topology that's ready to grow.
- Put an application-layer gateway with WAF in front of every web workload.
- Enforce default-deny traffic rules at the subnet level.
- Eliminate direct RDP/SSH exposure to backend VMs.
- Protect public IPs from volumetric DDoS attacks when the threat profile warrants it.
- Keep the design simple enough to deploy without specialized networking expertise.

> [!NOTE]
> This article provides an opinionated baseline, not a full landing zone guide. For production-ready, enterprise-scale implementations, see [Azure Landing Zones](/azure/cloud-adoption-framework/ready/landing-zone/).

## Architecture

The backend compute model—IaaS or PaaS—determines which shared services are needed in the hub. Both variants use the same hub-spoke foundation with VNet peering, NSGs on every subnet, and conditional DDoS Protection.

### IaaS backend (Virtual Machines)

When the backend includes VMs, internet traffic flows through Application Gateway with WAF in the spoke to backend VMs in a private workload subnet. The hub hosts Azure Bastion for secure RDP/SSH management across peered spokes, and NAT Gateway provides explicit outbound connectivity for private workload subnets. Azure Firewall in the hub is optional and provides centralized egress control when FQDN-based filtering is needed.

### PaaS backend (App Service)

When the backend is PaaS, internet traffic flows through Application Gateway with WAF in the spoke to App Service in the workload subnet. You don't need Bastion because there's no OS-level access to manage. The hub exists for optional shared services (Azure Firewall) and future growth. VNet peering is always provisioned; it carries active traffic only when Azure Firewall handles centralized egress.

The architecture uses two virtual networks connected by VNet peering:

**Hub virtual network** — Hosts shared services that workloads use. In this minimal pattern, the hub contains Azure Bastion for secure VM management. As the organization grows, the hub can also host Azure Firewall for centralized egress control, a VPN or ExpressRoute gateway for on-premises connectivity, or centralized DNS.

**Spoke virtual network** — Contains workload-specific resources. Internet traffic arrives at a public IP address associated with [Azure Application Gateway](/azure/application-gateway/overview), which operates as a Layer 7 reverse proxy in a dedicated spoke subnet. A WAF policy inspects every HTTP/HTTPS request against OWASP Core Rule Set rules before forwarding traffic to the backend pool. The backend pool contains either PaaS endpoints (such as App Service) or IaaS resources (VMs or Virtual Machine Scale Sets) in a dedicated workload subnet.

**VNet peering** connects the hub and spoke with low-latency, high-bandwidth connectivity over the Azure backbone. Peering is nontransitive—each spoke connects only to the hub, not to other spokes—which enforces workload isolation by default.

[Network security groups](/azure/virtual-network/network-security-groups-overview) (NSGs) enforce default-deny rules on every subnet in both virtual networks. The Application Gateway subnet allows inbound HTTPS and the required `GatewayManager` health probe ports. The workload subnet accepts traffic only from the Application Gateway subnet. When the backend includes VMs, Azure Bastion in the hub provides secure RDP/SSH access across the peering connection. When there are internet-facing public IPs, Azure DDoS Protection defends against volumetric and protocol attacks at Layers 3 and 4.

Each component in this pattern has a clear role:

| Component | VNet | Role | Required? |
| --- | --- | --- | --- |
| Hub virtual network | Hub | Hosts shared services (Bastion, optional Firewall) | Always |
| Spoke virtual network | Spoke | Hosts workload (App Gateway, backend compute) | Always |
| VNet peering | Both | Connects hub and spoke over Azure backbone | Always |
| Application Gateway WAF_v2 | Spoke | Layer 7 reverse proxy with web attack inspection | Always |
| NSGs | Both | Default-deny subnet-level traffic control | Always |
| Azure DDoS Protection | Both | Layer 3/4 volumetric attack mitigation | When public IPs face the internet |
| Azure Bastion | Hub | Secure RDP/SSH without public IPs on VMs | When backend is IaaS |
| NAT Gateway | Spoke | Explicit outbound connectivity for private subnets | When workload subnets need internet egress without Azure Firewall |
| Azure Firewall Basic | Hub | Centralized egress filtering and logging | Optional — add when you need FQDN-based outbound control |

### Why use hub-spoke instead of a single virtual network?

A single virtual network with all resources is simpler to set up initially, but it creates problems as the organization grows:

- **CIDR collisions block peering.** If you start with a single virtual network and later need to peer it with a hub, the address spaces can't overlap. Retrofitting CIDR ranges on a live workload often requires redeployment.
- **Can't reuse shared services.** You must duplicate bastion, DNS, and monitoring resources for each new workload when you deploy them in a workload virtual network.
- **No isolation boundary.** All workloads share the same network boundary, so a compromise in one workload has a larger impact.

The minimal hub-spoke pattern in this article adds only one extra virtual network and one peering connection. The incremental complexity is small - roughly equivalent to creating one more NSG - but the architecture is ready to scale without rework.

## Deployment steps

This foundation is built in layers. Each layer depends on the one before it, so deploy in this order:

| Step | Layer | What you deploy | Why this order | How to deploy |
| --- | --- | --- | --- | --- |
| 1 | **Resource organization** | Resource group (or separate resource groups for hub and spoke) | Establishes the Role-based access control (RBAC) and cost boundary. Everything else deploys into it. Separate resource groups let you assign different owners to hub infrastructure and workload resources. | [Manage resource groups — Azure portal](/azure/azure-resource-manager/management/manage-resource-groups-portal) |
| 2 | **Hub network** | Hub virtual network with `AzureBastionSubnet` (/26) and optional `AzureFirewallSubnet` (/26) + `AzureFirewallManagementSubnet` (/26) | The hub is the shared services foundation. Creating it first establishes the address space that all spokes must avoid overlapping. | [Quickstart: Create a virtual network](/azure/virtual-network/quickstart-create-virtual-network) |
| 3 | **Spoke network** | Spoke virtual network with Application Gateway subnet (/24) and workload subnet (private subnet) | The spoke hosts all workload-specific resources. Plan CIDR ranges that don't overlap with the hub. Create workload subnets as private subnets (`defaultOutboundAccess = false`) to block implicit outbound IPs. | [Quickstart: Create a virtual network](/azure/virtual-network/quickstart-create-virtual-network) |
| 4 | **VNet peering** | Bidirectional peering between hub and spoke | Peering connects the two VNets so that Bastion in the hub can reach VMs in the spoke and traffic can flow between shared services and workloads. Create peering before deploying resources that depend on cross-VNet connectivity. | [Tutorial: Connect virtual networks with peering](/azure/virtual-network/tutorial-connect-virtual-networks) |
| 5 | **Access control** | NSGs with default-deny rules on every subnet in both VNets | NSGs are the first security boundary. Associating them immediately after peering ensures no resource ever operates in an uncontrolled subnet - even briefly during deployment. Add the Application Gateway, Bastion, and workload NSG rules at this step so subnets are ready to receive services. | [Tutorial: Filter network traffic with a network security group](/azure/virtual-network/tutorial-filter-network-traffic) |
| 6 | **DDoS protection** (conditional) | DDoS Protection plan linked to both VNets | DDoS Protection enables at the VNet level and covers every public IP in that VNet. Enabling the plan before you create public IPs for Application Gateway or Bastion means those IPs are protected from the moment they come online. Skip this step if the architecture has no public IPs. | [Quickstart: Create and configure Azure DDoS Network Protection](/azure/ddos-protection/manage-ddos-protection) |
| 7 | **Ingress security** | Application Gateway WAF_v2 with public IP, WAF policy, and Key Vault TLS certificates (in spoke) | With the network foundation, peering, NSG rules, and DDoS protection in place, the Application Gateway can deploy into a spoke subnet that's already locked down. The WAF policy inspects traffic before it reaches any backend. | [Quickstart: Direct web traffic with Azure Application Gateway](/azure/application-gateway/quick-create-portal) and [Create WAF policies for Application Gateway](/azure/web-application-firewall/ag/create-waf-policy-ag) |
| 7b | **Outbound connectivity** | NAT Gateway on workload subnet (or Azure Firewall UDR if step 10 is used) | Private subnets have no implicit outbound IP. Attach a NAT Gateway before deploying VMs so they have outbound connectivity (Windows Activation, updates, dependencies) from the start. Skip if Azure Firewall handles egress. | [Quickstart: Create a NAT gateway](/azure/nat-gateway/quickstart-create-nat-gateway) |
| 8 | **Backend compute** | App Service, VMs, or Virtual Machine Scale Sets in the spoke workload subnet | Backend resources inherit the NSG rules that allow traffic only from the Application Gateway subnet. Workloads start in a secure state from the first request. | [Quickstart: Deploy an ASP.NET web app](/azure/app-service/quickstart-dotnetcore) or [Quickstart: Create a Windows VM](/azure/virtual-machines/windows/quick-create-portal) |
| 9 | **Management access** (IaaS only) | Azure Bastion in the hub `AzureBastionSubnet` | Deploy Bastion in the hub after VMs exist in the spoke so operators have targets to manage. Bastion reaches spoke VMs through the peering connection. The Basic SKU or higher supports VNet peering. Skip this step for PaaS-only backends. | [Quickstart: Deploy Azure Bastion from the Azure portal](/azure/bastion/quickstart-host-portal) |
| 10 | **Observability** | Diagnostic logs on Application Gateway and WAF, VNet flow logs, Log Analytics workspace | Enable monitoring after all resources are deployed so that every component feeds data to the same workspace from the start. | [Tutorial: Log network traffic with VNet flow logs](/azure/network-watcher/vnet-flow-logs-tutorial) and [Quickstart: Create a Log Analytics workspace](/azure/azure-monitor/logs/quick-create-workspace) |

> [!NOTE]
> The **How to deploy** links are general quickstarts and tutorials for each service. Your specific deployment might require different configurations, SKUs, or settings based on your organization's requirements, compliance posture, and existing infrastructure.

> [!TIP]
> If you use infrastructure as code (Bicep, Terraform, or ARM templates), declare resources in this order so that dependency chains are explicit and deployments succeed on the first run.

## Network foundation: VNet and subnet planning

Before deploying any security service, create both virtual networks and size all subnets. Every component in this pattern requires a specific subnet, and some have strict naming and sizing requirements.

### Hub virtual network

The hub is intentionally small. It hosts shared services that spokes consume.

| Subnet | Purpose | Minimum size | Naming requirement |
| --- | --- | --- | --- |
| AzureBastionSubnet | Hosts Azure Bastion (IaaS management) | /26 (59 usable IPs) | Must be named exactly `AzureBastionSubnet` |
| AzureFirewallSubnet (optional) | Hosts Azure Firewall for centralized egress control | /26 (59 usable IPs) | Must be named exactly `AzureFirewallSubnet` |
| AzureFirewallManagementSubnet (required for Basic SKU) | Separates management traffic from customer traffic on Azure Firewall Basic | /26 (59 usable IPs) | Must be named exactly `AzureFirewallManagementSubnet` |

### Spoke virtual network

The spoke contains workload-specific resources. Each new workload gets its own spoke.

| Subnet | Purpose | Minimum size | Naming requirement |
| --- | --- | --- | --- |
| Application Gateway subnet | Hosts Application Gateway WAF_v2 instances | /24 (251 usable IPs) | No naming requirement, but must be dedicated to Application Gateway |
| Workload subnet | Hosts App Service VNet integration or backend VMs | Size based on workload | None — create as a **private subnet** (`defaultOutboundAccess = false`) and attach NAT Gateway or another explicit egress method |

### CIDR planning for hub-spoke

**Plan CIDR ranges for both VNets before the first deployment.** Address spaces must not overlap. VNet peering fails if any CIDR ranges collide. Use the following approach for a minimal hub-spoke architecture:

| VNet | Example CIDR | Notes |
| --- | --- | --- |
| Hub | 10.0.0.0/24 | Small address space is sufficient for Bastion and optional Firewall |
| Spoke (workload 1) | 10.1.0.0/16 | Larger space for Application Gateway /24 and workload subnets |
| Spoke (workload 2, future) | 10.2.0.0/16 | Reserve ranges now even if you only have one spoke today |

> [!TIP]
> Reserve address ranges for future spokes from day one. Adding a spoke later is straightforward, but changing address spaces after peering or gateway deployment is disruptive.

### VNet peering

[Virtual network peering](/azure/virtual-network/virtual-network-peering-overview) connects the hub and spoke with low-latency connectivity over the Azure backbone. Configure peering as bidirectional so that traffic flows in both directions:

- **Hub → Spoke:** Enables Bastion to reach VMs and (when present) Azure Firewall to inspect spoke traffic.
- **Spoke → Hub:** Enables workloads to use shared hub services.

Key peering settings:

| Setting | Value | Why |
| --- | --- | --- |
| Allow forwarded traffic | Enabled on both sides | Required when Azure Firewall or an NVA inspects traffic |
| Allow gateway transit | Enabled on hub (if hub has a VPN/ExpressRoute gateway) | Lets spokes use the hub's gateway for on-premises connectivity |
| Use remote gateways | Enabled on spoke (if hub has a gateway) | Spoke uses the hub's gateway instead of deploying its own |

> [!NOTE]
> VNet peering is nontransitive. If you add a second spoke, it must be peered directly to the hub. Spoke-to-spoke traffic must route through the hub (via Azure Firewall or an NVA with UDRs) or use [Azure Virtual Network Manager](/azure/virtual-network-manager/overview) for direct connectivity.

## Network segmentation with NSGs

> [!NOTE]
> **Deployment step 5.** Create NSGs and associate them with subnets immediately after creating the virtual networks and peering. See [Deployment steps](#deployment-steps).

Both the hub and spoke virtual networks use NSGs to enforce default-deny rules at every subnet boundary. By using separate subnets for each role—Application Gateway, workload, Bastion, and optional Firewall—you can use NSGs to control traffic precisely.

### Essentials when deploying

- **Associate an NSG with every subnet in both VNets.** Start with a deny-all inbound rule. Add explicit allow rules only for traffic the design requires.
- **Application Gateway subnet rules (spoke):** Allow inbound HTTPS (443) from the internet. Allow inbound on ports 65200-65535 from the `GatewayManager` [service tag](/azure/application-gateway/configuration-infrastructure#network-security-groups) (required for v2 health probes). Allow the `AzureLoadBalancer` service tag.
- **Workload subnet rules (spoke):** Allow inbound only from the Application Gateway subnet on the application port. Deny all other inbound traffic.
- **Bastion subnet rules (hub):** Follow the [Bastion NSG requirements](/azure/bastion/configuration-settings#nsg) exactly. Bastion has specific inbound and outbound rules that you must apply for connectivity to work across peered VNets.
- **Restrict egress.** Use NSG outbound rules to deny unwanted outbound traffic. For most regional web apps, limiting egress to known Azure service destinations is sufficient. If you need FQDN-based filtering, add [Azure Firewall](/azure/firewall/overview) in the hub virtual network (see [Centralized egress with Azure Firewall](#centralized-egress-with-azure-firewall-optional)).
- **Enable flow logs.** [Virtual network flow logs](/azure/network-watcher/vnet-flow-logs-overview) capture traffic patterns for security analysis and troubleshooting. If you still use NSG flow logs, [migrate to VNet flow logs](/azure/network-watcher/nsg-flow-logs-migrate) before the NSG flow logs retirement on September 30, 2027.

## DDoS Protection: Do you need it?

> [!NOTE]
> **Deployment step 6.** Enable DDoS Protection on both virtual networks before creating public IPs for Application Gateway or Bastion. See [Deployment steps](#deployment-steps).

Azure DDoS infrastructure protection and Azure DDoS Protection are separate services. All Azure services with public IPv4 and IPv6 addresses receive [Azure DDoS infrastructure protection](/azure/ddos-protection/ddos-protection-overview) at no extra cost. However, infrastructure protection defends the Azure platform as a whole—it operates at a higher threshold than most individual applications can handle and **doesn't protect customer resources at the resource level**. It provides no adaptive tuning to your specific traffic patterns, no diagnostics or alerting, and no response support. For workloads that accept traffic from the public internet, enable a DDoS Protection plan (Network Protection or IP Protection) to get resource-level adaptive tuning, attack diagnostics, rapid response support, and cost protection guarantees. Don't rely on infrastructure protection alone to protect your services.

The decision is straightforward:

- **Public IP facing the internet → Enable DDoS Protection.** Choose the tier based on how many public IPs you protect. Don't rely on infrastructure protection alone for customer-facing workloads.
- **Private only (no public IP), or behind Azure Front Door → A DDoS Protection plan is optional.** Front Door includes its own integrated DDoS protection. Private-only resources have no public endpoint to attack, but infrastructure protection alone doesn't provide resource-level guarantees.

| Tier | Best for | Key extras over infrastructure protection | Pricing model |
| --- | --- | --- | --- |
| DDoS Network Protection | 15+ public IPs, need rapid response or WAF discounts | Adaptive tuning, DDoS Rapid Response, cost protection, [WAF discount](/azure/ddos-protection/ddos-protection-sku-comparison) | Fixed monthly per plan (up to 100 IPs) |
| DDoS IP Protection | Fewer than 15 public IPs | Adaptive tuning, attack diagnostics | Per public IP |

In a hub-spoke topology, link the DDoS Protection plan to both the hub and spoke VNets so that public IPs in either network are covered.

> [!IMPORTANT]
> Don't treat Azure DDoS infrastructure protection as a substitute for a DDoS Protection plan. Infrastructure protection safeguards the Azure ecosystem but has a higher mitigation threshold than most applications can handle. It provides no telemetry, no alerting, and no resource-level tuning. Enable a paid DDoS Protection tier for any customer-facing workload with public IPs.

For more information, see [Azure DDoS Protection tier comparison](/azure/ddos-protection/ddos-protection-sku-comparison).

## Application Gateway with WAF

> [!NOTE]
> **Deployment step 7.** Deploy Application Gateway in the spoke virtual network after peering, NSG rules, and DDoS protection are in place. See [Deployment steps](#deployment-steps).

Application Gateway is a regional Layer 7 load balancer purpose-built for web traffic. The [WAF_v2 SKU](/azure/web-application-firewall/ag/ag-overview) provides OWASP CRS-based protection against SQL injection, cross-site scripting, and other common web exploits. It supports autoscaling, zone redundancy, and a static VIP.

You deploy Application Gateway into its dedicated subnet in the spoke virtual network—close to the workload it protects. This placement keeps ingress traffic in the spoke and avoids routing internet traffic through the hub unnecessarily.

**When to choose something else:** If you need global load balancing across multiple Azure regions, use [Azure Front Door with WAF](/azure/frontdoor/web-application-firewall) instead. If traffic isn't HTTP/HTTPS (for example, raw TCP or UDP), use [Azure Load Balancer](/azure/load-balancer/load-balancer-overview) at Layer 4.

### Essentials when deploying

- **Use WAF policies, not legacy WAF configuration.** You can't create new WAF configuration deployments on WAF v2 starting March 15, 2025. [Migrate existing configurations to WAF policies before March 15, 2027](/azure/web-application-firewall/ag/upgrade-ag-waf-policy). WAF policies provide per-site and per-URI rule granularity, bot protection, and the next-generation WAF engine.
- **Start in Detection mode, switch to Prevention before production.** Detection mode logs threats without blocking them, giving you time to tune rules and identify false positives. Use Prevention mode for all production workloads.
- **Size the subnet to /24.** Application Gateway v2 supports up to 125 instances and requires a [dedicated subnet](/azure/application-gateway/configuration-infrastructure#size-of-the-subnet). A /24 provides 251 usable addresses for autoscaling and maintenance upgrades.
- **Store TLS certificates in Azure Key Vault.** Use [Key Vault integration](/azure/application-gateway/key-vault-certs) with managed identities for automated certificate rotation. This approach eliminates manual certificate management and prevents outages from expired certificates.
- **Enable diagnostic logging from day one.** Send access logs, firewall logs, and performance metrics to a [Log Analytics workspace](/azure/application-gateway/application-gateway-diagnostics). Without logs, you can't investigate security incidents or tune WAF rules.

> [!IMPORTANT]
> Application Gateway v1 SKU [retires April 28, 2026](/azure/application-gateway/v1-retirement). Deploy all new workloads on v2.

For security hardening guidance, see [Secure your Azure Application Gateway](/azure/application-gateway/secure-application-gateway). For sizing and performance recommendations, see [Architecture best practices for Application Gateway v2](/azure/well-architected/service-guides/azure-application-gateway).

## Azure Bastion in the hub: PaaS versus IaaS decision

> [!NOTE]
> **Deployment step 9 (IaaS only).** Deploy Bastion in the hub virtual network after backend VMs are in place in the spoke. See [Deployment steps](#deployment-steps).

Whether you need Azure Bastion depends entirely on your backend compute model:

| Backend type | Bastion needed? | Why |
| --- | --- | --- |
| **PaaS** (App Service, Container Apps, AKS) | No | No OS-level access to expose. Manage through the portal, CLI, or CI/CD. |
| **IaaS** (VMs, Virtual Machine Scale Sets) | Yes | Eliminates public IPs on VMs and removes RDP/SSH exposure to the internet. |

### Why Bastion lives in the hub

When you place Bastion in the hub virtual network, you can deploy it once and use it to manage VMs across all peered spokes. If you put Bastion in each spoke, every new workload needs its own Bastion instance, which adds cost and management overhead.

The Basic SKU and higher support [virtual network peering](/azure/bastion/bastion-sku-comparison), so Bastion in the hub can connect to VMs in any peered spoke. For a full feature comparison across Developer, Basic, Standard, and Premium SKUs, see [Bastion SKU comparison](/azure/bastion/bastion-sku-comparison).

### Essentials when deploying

- **Deploy Bastion in a dedicated `AzureBastionSubnet` of /26 or larger.** Azure requires this exact subnet name and you can't share it with other resources.
- **Use Premium SKU for production workloads.** Premium supports private-only deployment (no public IP required), session recording for compliance, and host scaling (2–50 instances). The cost difference over Standard is marginal. For smaller deployments, Basic is an acceptable minimum - it provides dedicated instances and supports VNet peering. The Developer SKU uses shared infrastructure, doesn't support peering, and [isn't suitable for production](/azure/bastion/bastion-sku-comparison).
- **Follow the Bastion NSG requirements.** The Bastion subnet has [specific inbound and outbound rules](/azure/bastion/configuration-settings#nsg) that you must apply exactly. Missing rules cause connection failures. When Bastion is in the hub, ensure the spoke workload subnet NSG allows inbound RDP (3389) or SSH (22) from the hub VNet's address space.
- **Enable Microsoft Entra ID authentication for SSH/RDP.** Entra ID authentication eliminates distributing SSH keys or local passwords and enables MFA and conditional access policies. SSH via Entra ID in the portal is generally available; RDP via Entra ID in the portal is in public preview. The Basic SKU supports Entra ID auth in the portal; the Standard SKU or higher is required for native client connections. For setup instructions, see [Entra ID authentication for Azure Bastion](/azure/bastion/bastion-entra-id-authentication).

## Centralized egress with Azure Firewall (optional)

For organizations that need FQDN-based outbound filtering, TLS inspection, or centralized logging of all egress traffic, add [Azure Firewall](/azure/firewall/overview) to the hub virtual network. Azure Firewall is optional in this pattern - NSGs provide basic egress control, and many startups operate successfully without it.

### When to add Azure Firewall

| Scenario | Without Azure Firewall | With Azure Firewall |
| --- | --- | --- |
| Outbound traffic control | NSG rules filter by IP/port only | FQDN-based rules (for example, allow `*.microsoft.com`) |
| Compliance requirements | Limited egress logging | Full egress logging with threat intelligence |
| Spoke-to-spoke traffic | Not applicable (single spoke) | Centralized inspection through the hub |

### If you choose to add it

- **Use the Basic SKU for SMBs.** Azure Firewall Basic supports up to 250 Mbps throughput and costs less than Standard or Premium SKUs. It's designed for small and midsize environments. For help choosing a SKU, see [Choose the right Azure Firewall SKU](/azure/firewall/choose-firewall-sku).
- **Deploy in `AzureFirewallSubnet` (/26) in the hub.** Azure Firewall Basic also requires a dedicated `AzureFirewallManagementSubnet` (/26) to separate management traffic from customer traffic. Create both subnets before deploying the firewall.
- **Create UDRs on spoke subnets** with a default route (`0.0.0.0/0`) pointing to the firewall's private IP. This route forces all outbound traffic through the hub for inspection.
- **Start simple.** Begin with a small set of application and network rules. Add rules as you understand your workload's traffic patterns.

> [!TIP]
> If you don't need Azure Firewall today, design your hub virtual network with a reserved `AzureFirewallSubnet` anyway. Adding Firewall later is straightforward when the subnet already exists. Adding a subnet to a hub that's already peered requires no downtime - just add the subnet and deploy.

## Outbound access and private subnets

Starting after March 31, 2026, new virtual networks in Azure default to **private subnets** (`defaultOutboundAccess` set to `false`). VMs in a private subnet receive no implicit outbound public IP from Azure - an explicit outbound method is required to reach public endpoints. This change aligns with Zero Trust principles: the previous default assigned a Microsoft-owned IP address that could change without notice, making outbound traffic unpredictable. For full details, see [Default outbound access for VMs in Azure](/azure/virtual-network/ip-services/default-outbound-access).

### What this means for the architecture

Workload subnets in this pattern need an explicit egress path. Choose the method that fits your requirements:

| Egress method | Best for | Consideration |
| --- | --- | --- |
| **NAT Gateway** | Simple, predictable outbound without FQDN filtering | Recommended default for most workloads. Attach to workload subnets in the spoke. |
| **Azure Firewall with UDR** | FQDN-based filtering, TLS inspection, centralized logging | Higher cost, but provides full egress control. See [Centralized egress with Azure Firewall](#centralized-egress-with-azure-firewall-optional). |
| **Standard Load Balancer** with outbound rules | Workloads already behind a load balancer | Reuses existing infrastructure. |
| **Instance-level public IP** | Single VM that needs direct outbound | Use only when other methods aren't practical. |

### NAT Gateway for explicit outbound

When you don't need FQDN-based filtering, attach a [NAT Gateway](/azure/nat-gateway/nat-overview) to the workload subnet for explicit, predictable outbound connectivity. NAT Gateway provides a static outbound IP, supports up to 50 Gbps throughput (Standard SKU), and requires no UDRs.

**NAT Gateway V2 (StandardV2 SKU)** offers zone-redundant operation across all availability zones, IPv6 support, and 100 Gbps throughput at the same price as the Standard SKU. When deploying a new NAT Gateway, prefer StandardV2 where available. Note current limitations: StandardV2 requires StandardV2-SKU public IPs (Standard public IPs aren't compatible), doesn't yet support Terraform, and isn't available in all regions. For a full comparison, see [NAT Gateway SKU comparison](/azure/nat-gateway/nat-sku).

> [!IMPORTANT]
> Azure DDoS Protection plans can't protect public IPs attached to NAT Gateway. If DDoS Protection is critical for your outbound IPs, use Azure Firewall with a DDoS-protected public IP instead.

> [!NOTE]
> VMs in private subnets can't reach Windows Activation or Windows Update endpoints without an explicit egress path. Attach a NAT Gateway or configure another outbound method before deploying Windows VMs.

## Identity and access control

Use [Microsoft Entra ID](/entra/fundamentals/whatis) for role-based access control (RBAC) across all networking resources:

- Assign [built-in roles](/azure/role-based-access-control/built-in-roles) like **Network Contributor** instead of custom roles where possible.
- Require at least `Microsoft.Network/virtualNetworks/subnets/join/action` and `subnets/read` for users and service principals operating Application Gateway.
- Use [managed identities](/entra/identity/managed-identities-azure-resources/overview) for Application Gateway to access Key Vault—don't store credentials.

## Mistakes to avoid

| Anti-pattern | Why it's dangerous | Fix |
| --- | --- | --- |
| Starting with a single VNet and planning to "add hub-spoke later" | CIDR collisions, UDR retrofitting, and Bastion relocation make migration disruptive. | Start with hub-spoke from day one—it's one extra VNet and one peering connection. |
| Exposing RDP/SSH ports to the internet | Persistent attack surface for brute-force and credential-stuffing attacks. | Use Azure Bastion in the hub. Remove all public IPs from backend VMs. |
| Relying on NSGs alone for web app security | NSGs operate at Layers 3 and 4 and can't inspect HTTP request bodies. SQL injection and XSS pass through undetected. | Always place a WAF in front of web-facing endpoints. |
| Using WAF Detection mode in production | Threats are logged but not blocked—applications remain vulnerable. | Switch to Prevention mode before going to production. |
| Blocking `GatewayManager` ports in App Gateway NSG | Breaks v2 health probes. Backend health shows unknown and clients get 502 errors. | Always allow ports 65200-65535 from `GatewayManager`. |
| Sharing the Application Gateway subnet | Causes deployment failures and unpredictable behavior. | Keep the Application Gateway subnet [dedicated](/azure/application-gateway/configuration-infrastructure#virtual-network-and-dedicated-subnet). |
| Deploying without infrastructure as code | Manual configurations drift and are impossible to audit or reproduce. | Use Bicep, Terraform, or ARM templates for all production deployments. |
| Enabling DDoS Network Protection for private-only workloads | Adds fixed monthly cost with no benefit when no public IPs are exposed. | Evaluate whether your architecture exposes public IPs before purchasing. |
| Deploying resources before NSGs are in place | Resources operate briefly in an uncontrolled subnet, creating a window of exposure. | Always associate NSGs with subnets before deploying any resources into them. |
| Deploying Bastion in every spoke | Adds unnecessary cost and management overhead when the hub can serve all spokes. | Deploy Bastion once in the hub. Use VNet peering to reach spoke VMs. |
| Not planning CIDR ranges for future spokes | New spokes can't peer if their address space overlaps with existing VNets. | Reserve nonoverlapping address ranges for future spokes before deploying the first spoke. |
| Relying on default outbound access for internet egress | Default outbound uses an implicit, Microsoft-owned IP that can change without notice. After March 31, 2026, new VNets default to private subnets with no implicit outbound. | Use private subnets with NAT Gateway or Azure Firewall for explicit, predictable outbound connectivity. |

## When things go wrong

### 502 Bad Gateway from Application Gateway

**Check first:** Verify the Application Gateway subnet NSG allows ports 65200-65535 from `GatewayManager`. Confirm backend health probe settings match the application's listening port and path, and that the backend returns HTTP 200-399 on the probe endpoint.

**Common causes:** Blocked `GatewayManager` health probes, misconfigured custom health probes, backend app crashes, or [TLS certificate mismatch](/troubleshoot/azure/application-gateway/application-gateway-troubleshooting-502) when end-to-end TLS is enabled.

### WAF blocks legitimate traffic (false positives)

**Check first:** Enable WAF diagnostic logs and filter by blocked actions. Identify the rule ID (for example, `942130` for SQL injection detection) and determine whether the match is on safe content like authentication tokens.

**Fix:** Use [WAF exclusion lists](/azure/web-application-firewall/ag/application-gateway-waf-configuration) to omit specific request attributes, or use per-rule exclusions available in WAF policies.

### Can't connect to VMs through Bastion

**Check first:** Verify the `AzureBastionSubnet` is /26 or larger. Check that the NSG on the Bastion subnet in the hub has the [required rules](/azure/bastion/configuration-settings#nsg). Confirm the target VM's NSG in the spoke allows inbound RDP (3389) or SSH (22) from the hub VNet's address space.

**Common causes:** Missing or incorrect NSG rules on the Bastion subnet, Bastion SKU doesn't support peering (Developer SKU), subnet too small, or the target VM's OS-level firewall blocking connections.

### Peering shows "Disconnected" status

**Check first:** Verify that both sides of the peering exist (hub-to-spoke and spoke-to-hub). You must create peering in both directions. If you delete one side, the other side shows "Disconnected."

**Fix:** Delete the remaining peering and recreate both sides. Ensure CIDR address spaces don't overlap.

## Next steps

> [!div class="nextstepaction"]

- [Apply Zero Trust principles to a hub virtual network in Azure](/security/zero-trust/azure-infrastructure-networking)
- [Apply Zero Trust principles to a spoke virtual network with Azure PaaS Services](/security/zero-trust/azure-infrastructure-paas)

