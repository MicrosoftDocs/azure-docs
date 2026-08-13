---
title: Secure your Azure Virtual Network deployment
description: Learn how to secure Azure Virtual Network deployments by using network isolation, access control, monitoring, and threat protection.
author: msmbaldwin
ms.author: mbaldwin
ms.service: azure-virtual-network
ms.topic: best-practice
ms.custom: horz-security
ms.date: 07/22/2026
ai-usage: ai-assisted
---

# Secure your Azure Virtual Network deployment

Azure Virtual Network is the fundamental building block for your private network in Azure. Azure Virtual Network helps Azure resources securely communicate with each other, the internet, and on-premises networks. Secure virtual network deployments use network segmentation, traffic inspection, identity controls, monitoring, and resilient design to protect network infrastructure and prevent unauthorized access to resources.

This article provides security recommendations for Azure Virtual Network. When you implement these recommendations, you help fulfill your security obligations and improve the overall security posture of your deployment. For an overview of Azure's network security services and how they work together, see [What is Azure network security?](../networking/security/network-security.md)

[!INCLUDE [Security horizontal Zero Trust statement](~/reusable-content/ce-skilling/azure/includes/security/zero-trust-security-horizontal.md)]

## Network security

Network security for virtual networks focuses on controlling traffic flow, implementing segmentation, and protecting against external threats. Appropriate network controls help isolate workloads, prevent lateral movement, and defend against distributed denial-of-service attacks.

- **Segment workloads by using network security groups and application security groups**: Apply network security groups (NSGs) to subnets and network interfaces to control inbound and outbound traffic based on source IP, destination IP, port, and protocol. Use application security groups to group virtual machines logically and define network security policies based on application structure. Use a deny-by-default, permit-by-exception approach to reduce the attack surface. For more information, see [Network security groups](network-security-groups-overview.md).

- **Enforce baseline network rules by using security admin rules**: Use security admin rules in Azure Virtual Network Manager to centrally apply allow, always allow, and deny rules across managed virtual networks. Use them to block high-risk ports, enforce segmentation, and reduce the risk that workload-level NSG misconfiguration bypasses organization-wide policy. For more information, see [Security admin rules in Azure Virtual Network Manager](../virtual-network-manager/concept-security-admins.md).

- **Deploy Azure Firewall for centralized, stateful protection**: Use Azure Firewall to control both inbound and outbound traffic across your virtual networks through fully stateful packet inspection. Use centralized Firewall Policy to define and manage application and network rules at scale. Enable threat intelligence-based filtering. Use Azure Firewall Premium with intrusion detection and prevention system (IDPS) to monitor and block malicious network traffic. For more information, see [Azure Firewall](../firewall/overview.md).

- **Enable Azure DDoS Network Protection**: Activate Azure DDoS Network Protection on virtual networks with public IP resources to defend against distributed denial-of-service attacks. Use DDoS Network Protection for virtual-network-wide protection, or DDoS IP Protection when you need pay-per-protected-IP coverage for individual public IP resources. For more information, see [Azure DDoS Protection overview](../ddos-protection/ddos-protection-overview.md).

- **Use service tags to simplify security rules**: Replace specific IP addresses with service tags in your NSG rules to allow communication with Azure services while maintaining security. Microsoft automatically updates service tags as IP ranges change. For more information, see [Service tags](service-tags-overview.md).

- **Implement Azure Bastion for secure RDP and SSH access**: Use Azure Bastion to securely connect to virtual machines over RDP or SSH without exposing them to the public internet. Bastion eliminates the need for public IP addresses on VMs and reduces the attack surface. For more information, see [Azure Bastion](../bastion/bastion-overview.md).

- **Implement Azure NAT Gateway for outbound traffic**: Use Azure NAT Gateway to provide static outbound IP addresses for virtual network resources and secure, scalable egress traffic. NAT Gateway also helps protect against port exhaustion. For more information, see [Azure NAT Gateway](../nat-gateway/nat-overview.md).

- **Use private endpoints and Private Link for Azure services**: Use Azure Private Link to access Azure PaaS services over a private endpoint within your virtual network. Private Link keeps private-endpoint traffic on the Microsoft backbone network. Where the target service supports it, also disable public network access or configure the service firewall to prevent public access. For more information, see [Azure Private Link](../private-link/private-link-overview.md).

- **Prefer private endpoints over service endpoints for private service access**: Use private endpoints when supported so the service is represented by a private IP address in your virtual network and can use private DNS and network policies. Use service endpoints only when Private Link isn't available or when a service-specific requirement calls for them. For large-scale IaaS-to-PaaS access that uses service endpoints, evaluate standard service endpoints (preview) with network security perimeter integration, but don't treat them as equivalent to Private Link because they don't provide private connectivity or data exfiltration protection. For more information, see [What is a private endpoint?](../private-link/private-endpoint-overview.md), [Manage network policies for private endpoints](../private-link/disable-private-endpoint-network-policy.md), [Virtual network service endpoints](virtual-network-service-endpoints-overview.md), and [Azure standard service endpoints](/azure/private-link/service-endpoint-standard-overview).

- **Secure virtual network peering deliberately**: Treat peering as a direct, nontransitive connection between two virtual networks. Create explicit peerings for every required path, scope NSG and route rules for the peered address spaces, and enable gateway transit or remote gateways only where the hub-and-spoke design requires shared on-premises connectivity. For more information, see [Virtual network peering](virtual-network-peering-overview.md) and [Create, change, or delete a virtual network peering](virtual-network-manage-peering.md).

- **Configure subnets as private by default**: For subnets that don't require public internet access, configure them as private subnets. Use Azure Firewall or NAT Gateway for controlled outbound access when needed. For more information, see [Default outbound access in Azure](ip-services/default-outbound-access.md).

- **Limit public IP address usage**: Minimize the number of public IP addresses by using shared public IP addresses from services such as Azure Front Door or Application Gateway. When public IP addresses are necessary, implement proper port management, traffic filtering, and request validation. For more information, see [Public IP addresses](ip-services/public-ip-addresses.md).

- **Plan IPv6 dual-stack security controls explicitly**: If you enable IPv6, define dual-stack IPv4 and IPv6 address spaces and subnets, configure NSG rules for IPv6 traffic, and validate feature limitations such as IPv6-only VM and Azure Firewall support. For more information, see [IPv6 for Azure Virtual Network](ip-services/ipv6-overview.md).

- **Delegate subnets only for supported service integrations**: Use subnet delegation when an Azure service must be injected into a virtual network subnet. Review the service's network intent policies, NSG support, route table support, and private endpoint constraints before you delegate the subnet. For more information, see [Subnet delegation](subnet-delegation-overview.md).

- **Configure packet capture for forensic analysis**: Enable packet capture on virtual machines or use VPN Gateway packet capture to record network traffic for security analysis and incident investigation. For more information, see [Network Watcher packet capture](../network-watcher/packet-capture-overview.md) and [Configure packet capture for VPN Gateway](../vpn-gateway/packet-capture.md).

## Identity and access management

Identity and access management for virtual networks controls who can create, modify, and delete network resources and how privileged network operations are protected. Strong identity controls prevent unauthorized network changes and maintain the security posture of your network infrastructure.

- **Use Azure RBAC for network resource access**: Assign appropriate built-in roles, such as Network Contributor, or custom roles with specific permissions to control who can create, modify, or delete virtual networks and related resources. Follow the principle of least privilege. For more information, see [Azure RBAC built-in roles for networking](../role-based-access-control/built-in-roles.md#networking).

- **Apply least privilege for network roles**: Configure role-based access control with a no-access mindset for network-related roles. Ensure users can modify only the network settings required by their job function. For more information, see [Azure RBAC best practices](../role-based-access-control/best-practices.md).

- **Use Microsoft Entra ID for centralized identity**: Use Microsoft Entra ID as the centralized identity provider for managing access to network resources and related Azure services. Implement single sign-on instead of standalone credentials for each service to reduce the attack surface and password requirements. For more information, see [Single sign-on to applications](/entra/identity/enterprise-apps/what-is-single-sign-on).

- **Implement Conditional Access for network administrators**: Configure Conditional Access policies to require multifactor authentication and restrict access to network management operations based on user location, device compliance, and risk level. For more information, see [Conditional Access](/entra/identity/conditional-access/overview).

- **Enforce multifactor authentication for network administrators**: Require multifactor authentication for all users with network administration privileges to add a security layer beyond passwords and reduce the risk of credential-based attacks. For more information, see [Microsoft Entra multifactor authentication](/entra/identity/authentication/concept-mfa-howitworks).

- **Use just-in-time access for network operations**: Implement Microsoft Entra Privileged Identity Management to provide time-limited access to network administration roles. Just-in-time access reduces the exposure window for privileged credentials. For more information, see [Privileged Identity Management](/entra/id-governance/privileged-identity-management/pim-configure).

- **Use managed identities for network-integrated workloads**: Enable managed identities for Azure resources in your virtual networks that need to access other Azure services. Managed identities eliminate stored credentials in workload code and configuration, reducing credential exposure for services that depend on network connectivity. For more information, see [Managed identities](/entra/identity/managed-identities-azure-resources/overview).

- **Use dedicated administrative accounts with privileged access devices**: Create standard operating procedures for dedicated administrative accounts. Use privileged access devices with multifactor authentication for network administrators who perform administrative tasks. For more information, see [Securing privileged access devices](/security/privileged-access-workstations/privileged-access-devices).

- **Regularly review and reconcile user access**: Perform regular access reviews to manage group memberships, enterprise application access, and role assignments. Ensure only active users continue to access network management functions. For more information, see [Microsoft Entra access reviews](/entra/id-governance/access-reviews-overview).

## Data protection

Data protection for virtual networks focuses on securing data in transit across your network infrastructure and protecting network communications from interception or tampering.

- **Enable encryption in transit**: Require all network traffic to use encryption protocols such as TLS 1.2 or higher, IPsec for VPN connections, and encrypted protocols for application communications. Azure provides encryption by default for traffic between Azure datacenters. For more information, see [Encryption in transit](../security/fundamentals/encryption-overview.md#encryption-in-transit).

- **Enable Azure Virtual Network encryption for supported VM traffic**: Use Azure Virtual Network encryption to encrypt data in transit between supported virtual machines within the same virtual network and between regionally and globally peered virtual networks. Verify supported VM sizes, Accelerated Networking requirements, and topology limitations before you enable encryption, especially for virtual networks that use Azure Firewall, ExpressRoute gateways, Private Link service, or unsupported VM SKUs. For more information, see [Azure Virtual Network encryption](virtual-network-encryption-overview.md).

- **Enable MACsec on ExpressRoute Direct ports**: For ExpressRoute Direct connections, enable MACsec to provide Layer 2 encryption between your edge routers and Microsoft's edge routers, helping ensure confidentiality and integrity of data in transit. For more information, see [MACsec for ExpressRoute Direct ports](../expressroute/expressroute-howto-macsec.md).

## Logging and monitoring

Logging and monitoring for virtual networks provide visibility into traffic patterns, configuration changes, security events, and potential threats. Centralized monitoring supports incident response, threat detection, and compliance reporting.

- **Enable virtual network flow logs for traffic monitoring**: Configure virtual network flow logs, the successor to NSG flow logs, to capture information about IP traffic flowing through your virtual networks. Send flow logs to an Azure Storage account, and use a user-assigned managed identity for secure access to the storage account. Enable Traffic Analytics to process the logs and store the results in a Log Analytics workspace for visualization and threat detection. NSG flow logs retire on September 30, 2027. After June 30, 2025, you can't create new NSG flow logs. Migrate existing NSG flow log deployments to virtual network flow logs. For more information, see [Virtual network flow logs](../network-watcher/vnet-flow-logs-overview.md), [Managed identity for virtual network flow logs](../network-watcher/vnet-flow-logs-managed-identity.md), and [Migrate from NSG flow logs to virtual network flow logs](../network-watcher/nsg-flow-logs-migrate.md).

- **Centralize log collection by using Azure Monitor**: Configure diagnostic settings on virtual networks and network security groups to send resource logs to a Log Analytics workspace for centralized analysis and correlation. Send virtual network flow logs to Log Analytics through Traffic Analytics, and archive logs to an Azure Storage account for long-term retention. For more information, see [Monitor virtual networks](monitor-virtual-network.md) and [Diagnostic logging for a network security group](virtual-network-nsg-manage-log.md).

- **Enable Microsoft Defender for Cloud**: Use Microsoft Defender for Cloud to monitor your virtual network resources for security misconfigurations and threats. Enable the Defender for Cloud plans that cover your network-connected workloads (for example, Defender for Servers, Defender for Storage, Defender for Databases) for comprehensive protection. For more information, see [Microsoft Defender for Cloud](/azure/defender-for-cloud/defender-for-cloud-introduction).

- **Configure security alerts and notifications**: Set up Azure Monitor alerts for critical network security events such as NSG rule changes, unusual traffic patterns, firewall blocks, and DDoS attack indicators. Configure action groups to notify security teams automatically. For more information, see [Azure Monitor alerts](/azure/azure-monitor/alerts/alerts-overview).

- **Use Network Watcher diagnostics for connectivity investigation**: Use Connection Monitor for continuous endpoint monitoring, IP flow verify and NSG diagnostics to validate security rule decisions, next hop to confirm routing, and packet capture for incident investigation on supported virtual machines and scale sets. For more information, see [Network Watcher](../network-watcher/network-watcher-overview.md), [Connection Monitor](../network-watcher/connection-monitor-overview.md), and [Packet capture](../network-watcher/packet-capture-overview.md).

- **Use Microsoft Sentinel for advanced threat detection**: Stream virtual network flow logs and Traffic Analytics data to Microsoft Sentinel for advanced security analytics, threat hunting, and automated response. For more information, see [Connect Traffic Analytics data to Microsoft Sentinel](../network-watcher/traffic-analytics-sentinel.md).

- **Monitor privileged network activities**: Enable logging and monitoring for privileged network operations, including NSG changes, route table modifications, and firewall rule updates. Use Azure Activity Log and Azure Monitor to track administrative actions. For more information, see [Azure Activity Log](/azure/azure-monitor/platform/activity-log).

## Compliance and governance

Compliance and governance for virtual networks help ensure consistent network security controls, resource inventory, policy enforcement, security testing, and incident response across your organization.

- **Use Azure Policy for governance and resource restrictions**: Deploy Azure Policy definitions to enforce security standards for virtual networks. These definitions can require NSGs on subnets, mandate specific security rules, or prevent creation of public IP addresses. Use built-in policy definitions such as **Not allowed resource types** and **Allowed resource types** to restrict resource creation. For more information, see [Azure Policy for virtual networks](policy-reference.md).

- **Tag network resources for organization**: Apply consistent tags to virtual networks, subnets, NSGs, and related resources to support organization, cost management, and security policy enforcement. Use tags and NSG rule descriptions to document business need, duration, and other information for security audits and rule management. For more information, see [Resource tagging](../azure-resource-manager/management/tag-resources.md).

- **Monitor resource configuration changes**: Use Azure Resource Graph to query and discover networking resources across subscriptions. Set up alerts for unauthorized changes to critical network configurations. For more information, see [Azure Resource Graph](../governance/resource-graph/first-query-portal.md).

- **Implement standardized configuration management**: Use Azure Resource Manager templates or Bicep to define and deploy network configurations consistently. Store templates in version control, and implement change management processes for network modifications. For more information, see [Understand the structure and syntax of Bicep files](../azure-resource-manager/bicep/file.md).

- **Conduct regular penetration testing within Azure rules of engagement**: Have experts external to the workload team perform periodic penetration testing. Follow the Microsoft Cloud Penetration Testing Rules of Engagement. Use approved DDoS simulation partners for DDoS resilience testing. For more information, see [Penetration testing](../security/fundamentals/pen-testing.md).

- **Validate network segmentation**: Regularly test network segmentation controls to help ensure that resources in one segment can't access resources in other segments unless access is intended. Use Virtual Network Verifier in Azure Virtual Network Manager in preproduction environments to test connectivity between resources and ensure they're reachable and not blocked by policies. For more information, see [Virtual Network Verifier](../virtual-network-manager/concept-virtual-network-verifier.md).

- **Use Azure Chaos Studio for resilience testing**: Use Azure Chaos Studio to simulate network connectivity disruptions and validate that security controls remain effective during failure scenarios. For more information, see [Azure Chaos Studio fault and action library](/azure/chaos-studio/chaos-studio-fault-library).

- **Integrate Microsoft Defender for Cloud alerts into incident response**: Use Microsoft Defender for Cloud alerts to prioritize network security incidents. Export alerts and recommendations by using continuous export, and stream alerts to Microsoft Sentinel for centralized incident management. For more information, see [Continuously export Defender for Cloud data](/azure/defender-for-cloud/continuous-export).

- **Automate incident response**: Use the workflow automation feature in Microsoft Defender for Cloud to trigger responses through Logic Apps for security alerts and recommendations that affect Azure network resources. For more information, see [Workflow automation in Defender for Cloud](/azure/defender-for-cloud/workflow-automations).

## Backup and recovery

Backup and recovery for virtual networks focus on preserving network configurations and ensuring rapid restoration of connectivity after accidental deletion, configuration errors, attacks, or regional disruptions. Virtual networks don't require traditional data backup, but configuration preservation and tested recovery procedures are critical.

- **Manage network configurations as infrastructure as code**: Define virtual networks, subnets, NSGs, route tables, peerings, and related network configurations in Bicep or ARM templates stored in source control. Treat that repository as the source of truth for recovery. Use portal export as a reviewed point-in-time snapshot or bootstrap only, not as the ongoing source of truth. For more information, see [Export template from the Azure portal](../azure-resource-manager/templates/export-template-portal.md) and [Export Bicep from existing Azure resources](../azure-resource-manager/bicep/export-bicep-portal.md).

- **Use VNet-to-VNet peering for resilience patterns**: Design hub-and-spoke or multiregion connectivity patterns with virtual network peering where appropriate. Peering can support resilient service communication and disaster recovery designs when paired with regional isolation, routing controls, and tested failover procedures. For more information, see [Virtual network peering](virtual-network-peering-overview.md).

- **Attach DDoS Protection plans for resilience against attack-induced outages**: Enable Azure DDoS Network Protection on virtual networks with public IP resources so volumetric attacks are mitigated before they cause service outages. Ensure secondary or failover virtual networks have equivalent DDoS protection. For more information, see [Azure DDoS Protection overview](../ddos-protection/ddos-protection-overview.md).

- **Back up connected resources and customer-managed keys**: Although virtual networks don't require traditional backup, ensure that virtual machines and other resources connected to your networks are protected with Azure Backup as appropriate. If you use customer-managed keys for encryption in the network environment, back up keys in Azure Key Vault and enable soft-delete and purge protection. For more information, see [Azure Backup](../backup/index.yml) and [Azure Key Vault backup](/azure/key-vault/general/backup).

## Next steps

- [Azure Virtual Network overview](virtual-networks-overview.md)
- [Network security groups](network-security-groups-overview.md)
- [Virtual network flow logs](../network-watcher/vnet-flow-logs-overview.md)
- [Azure DDoS Protection overview](../ddos-protection/ddos-protection-overview.md)
- [What is Azure network security?](../networking/security/network-security.md)
- [Azure network security best practices](../security/fundamentals/network-best-practices.md)
