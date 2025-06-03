---
title: Secure your Virtual Network deployment
description: Learn how to secure Azure Virtual Network with best practices for network isolation, access control, monitoring, and threat protection.
author: asudbring
ms.author: allensu
ms.service: azure-virtual-network
ms.topic: conceptual
ms.custom: horz-security
ms.date: 06/03/2025
ai-usage: ai-assisted
---

# Secure your Virtual Network deployment

Azure Virtual Network is the fundamental building block for your private network in Azure, enabling Azure resources to securely communicate with each other, the internet, and on-premises networks. When deploying virtual networks, you must implement security controls to protect your network infrastructure, control traffic flow, and prevent unauthorized access to your resources.

This article provides guidance on how to best secure your Azure Virtual Network deployment.

## Network security

Network security for Virtual Networks focuses on controlling traffic flow, implementing network segmentation, and protecting against external threats. Proper network security controls help isolate workloads, prevent lateral movement, and defend against distributed denial-of-service attacks.

- **Segment workloads using Network Security Groups (NSGs)**: Apply NSGs to subnets and network interfaces to control inbound and outbound traffic based on source IP, destination IP, port, and protocol. Use a "deny by default, permit by exception" approach to minimize attack surface. For more information, see [Network Security Groups](/azure/virtual-network/network-security-groups-overview).

- **Enable NSG flow logs for traffic monitoring**: Configure NSG flow logs to capture information about IP traffic flowing through your network security groups. Send these logs to Azure Monitor Log Analytics and use Traffic Analytics to visualize network activity and identify security threats. For more information, see [NSG flow logs](/azure/network-watcher/network-watcher-nsg-flow-logging-portal).

- **Deploy Azure Firewall with threat intelligence**: Use Azure Firewall with threat intelligence-based filtering enabled to automatically alert on and deny traffic to known malicious IP addresses and domains. Position the firewall at network boundaries to provide centralized protection. For more information, see [Azure Firewall threat intelligence](/azure/firewall/threat-intel).

- **Enable DDoS Protection Standard**: Activate DDoS Protection Standard on your virtual networks to defend against distributed denial-of-service attacks. This service provides enhanced DDoS mitigation capabilities and real-time monitoring for your public IP addresses. For more information, see [Azure DDoS Protection Standard](/azure/ddos-protection/manage-ddos-protection).

- **Implement network-based intrusion detection**: Deploy network virtual appliances with IDS/IPS capabilities or use Azure Firewall Premium with intrusion detection and prevention system (IDPS) features to monitor and block malicious network traffic. For more information, see [Azure Firewall Premium IDPS](/azure/firewall/premium-features#idps).

- **Use service tags to simplify security rules**: Replace specific IP addresses with service tags in your NSG rules to allow communication with Azure services while maintaining security. Service tags are automatically updated by Microsoft as IP ranges change. For more information, see [Service tags](/azure/virtual-network/service-tags-overview).

- **Configure packet capture for forensic analysis**: Enable packet capture on virtual machines or use VPN Gateway packet capture to record network traffic for security analysis and incident investigation. For more information, see [Network Watcher packet capture](/azure/network-watcher/network-watcher-packet-capture-overview).

- **Implement Azure Bastion for secure RDP/SSH access**: Use Azure Bastion to securely connect to virtual machines over RDP or SSH without exposing them to the public internet. This eliminates the need for public IP addresses on VMs and reduces attack surface. For more information, see [Azure Bastion](/azure/bastion/bastion-overview).

- **Implement Azure NAT Gateway for outbound traffic**: Use Azure NAT Gateway to provide a static outbound IP address for virtual network resources, ensuring consistent egress traffic and simplifying firewall rules. NAT Gateway also provides protection against port exhaustion. For more information, see [Azure NAT Gateway](/azure/virtual-network/nat-gateway/nat-overview).

- **Set up private link for Azure services**: Use Azure Private Link to access Azure PaaS services (like Azure Storage, SQL Database) over a private endpoint within your virtual network. This eliminates exposure to the public internet and enhances security by keeping traffic within the Azure backbone network. For more information, see [Azure Private Link](/azure/private-link/private-link-overview).

- **Set subnets to private**: For subnets that do not require public internet access, configure them as private subnets. Use Azure Firewall or NAT Gateway for controlled outbound access if needed. For more information, see [Default outbound access in Azure](/azure/virtual-network/ip-services/default-outbound-access)

## Identity management

Identity management for Virtual Networks involves controlling access to network resources and ensuring that only authorized users and services can modify network configurations. Proper identity controls prevent unauthorized network changes and maintain network security posture.

- **Use Azure RBAC for network resource access**: Assign appropriate built-in roles such as Network Contributor or custom roles with specific permissions to control who can create, modify, or delete virtual networks and related resources. Follow the principle of least privilege. For more information, see [Azure RBAC for networking](/azure/role-based-access-control/built-in-roles#networking).

- **Enable Azure Active Directory integration**: Use Azure AD as the centralized identity provider for managing access to network resources and related Azure services. This ensures consistent authentication and authorization across your network infrastructure.

- **Implement conditional access for network administrators**: Configure conditional access policies to require multi-factor authentication and restrict access to network management operations based on user location, device compliance, and risk level. For more information, see [Conditional Access](/azure/active-directory/conditional-access/overview).

## Privileged access

Privileged access management for Virtual Networks focuses on securing administrative operations and ensuring that network configuration changes are performed by authorized personnel with appropriate oversight and monitoring.

- **Enforce multi-factor authentication for network administrators**: Require MFA for all users with network administration privileges to add an additional security layer beyond passwords. This significantly reduces the risk of credential-based attacks. For more information, see [Azure AD MFA](/azure/active-directory/authentication/concept-mfa-howitworks).

- **Use just-in-time access for network operations**: Implement Azure AD Privileged Identity Management to provide time-limited access to network administration roles. This reduces the window of exposure for privileged credentials. For more information, see [Privileged Identity Management](/azure/active-directory/privileged-identity-management/pim-configure).

- **Monitor privileged network activities**: Enable logging and monitoring for all privileged network operations including NSG changes, route table modifications, and firewall rule updates. Use Azure Activity Log and Azure Monitor to track administrative actions. For more information, see [Azure Activity Log](/azure/azure-monitor/essentials/activity-log).

## Data protection

Data protection for Virtual Networks involves securing data in transit across your network infrastructure and ensuring that network communications are encrypted and protected from interception or tampering.

- **Enable encryption in transit**: Ensure all network traffic uses encryption protocols such as TLS 1.2 or higher, IPsec for VPN connections, and encrypted protocols for application communications. Azure provides encryption by default for traffic between Azure datacenters. For more information, see [Encryption in transit](/azure/security/fundamentals/encryption-overview#encryption-of-data-in-transit).

- **Use private endpoints for Azure services**: Deploy private endpoints to access Azure PaaS services over private IP addresses within your virtual network, eliminating exposure to the public internet and reducing data exfiltration risks. For more information, see [Private endpoints](/azure/private-link/private-endpoint-overview).

- **Implement network access controls for sensitive data**: Use NSGs and Azure Firewall to restrict access to subnets and resources containing sensitive data. Apply defense-in-depth principles with multiple layers of network security controls.

## Logging and threat detection

Comprehensive logging and threat detection for Virtual Networks enables security monitoring, incident response, and compliance reporting. Proper logging helps identify security threats and provides forensic capabilities for incident investigation.

- **Centralize log collection with Azure Monitor**: Configure diagnostic settings to send virtual network logs, NSG flow logs, and Azure Firewall logs to Azure Monitor Log Analytics workspace for centralized analysis and correlation. For more information, see [Azure Monitor](/azure/azure-monitor/overview).

- **Enable Microsoft Defender for Cloud**: Use Microsoft Defender for Cloud to monitor your virtual network resources for security misconfigurations and threats. Enable the enhanced security features for comprehensive protection. For more information, see [Microsoft Defender for Cloud](/azure/defender-for-cloud/defender-for-cloud-introduction).

- **Configure security alerts and notifications**: Set up Azure Monitor alerts for critical network security events such as NSG rule changes, unusual traffic patterns, or firewall blocks. Configure action groups to automatically notify security teams. For more information, see [Azure Monitor alerts](/azure/azure-monitor/alerts/alerts-overview).

- **Use Microsoft Sentinel for advanced threat detection**: Connect your virtual network logs to Microsoft Sentinel for advanced security analytics, threat hunting, and automated response capabilities. For more information, see [Microsoft Sentinel](/azure/sentinel/quickstart-onboard).

- **Enable DNS logging**: Configure DNS query logging for Azure DNS or custom DNS servers to detect DNS-based attacks and data exfiltration attempts. Monitor for suspicious domain queries and DNS tunneling activities.

## Asset management

Asset management for Virtual Networks involves maintaining an inventory of network resources, implementing governance policies, and ensuring compliance with security standards. Effective asset management helps maintain security posture and enables rapid response to security incidents.

- **Use Azure Policy for governance**: Implement Azure Policy definitions to enforce security standards for virtual networks, such as requiring NSGs on subnets, mandating specific security rules, or preventing creation of public IPs. For more information, see [Azure Policy for virtual networks](/azure/virtual-network/policy-reference).

- **Tag network resources for organization**: Apply consistent tagging strategies to virtual networks, subnets, NSGs, and related resources to enable proper organization, cost management, and security policy enforcement. For more information, see [Resource tagging](/azure/azure-resource-manager/management/tag-resources).

- **Monitor resource configuration changes**: Use Azure Resource Graph to query and discover all networking resources across subscriptions. Set up alerts for unauthorized changes to critical network configurations. For more information, see [Azure Resource Graph](/azure/governance/resource-graph/first-query-portal).

- **Implement configuration management**: Use Azure Resource Manager templates or Bicep to define and deploy network configurations consistently. Store templates in version control and implement change management processes for network modifications.

## Backup and recovery

Backup and recovery for Virtual Networks focuses on preserving network configurations and ensuring rapid restoration of network connectivity in case of accidental deletion or configuration errors. While virtual networks themselves don't require traditional backups, configuration preservation is critical.

- **Export network configurations regularly**: Use Azure Resource Manager to export virtual network configurations as templates that can be stored and used for disaster recovery. Automate this process using Azure Automation or Azure DevOps pipelines. For more information, see [Export templates](/azure/azure-resource-manager/templates/export-template-portal).

- **Document network architecture**: Maintain comprehensive documentation of your network design, including IP address schemes, routing tables, security group rules, and connectivity requirements. Store this documentation in a secure, accessible location.

- **Test configuration restoration procedures**: Regularly test your ability to recreate virtual network configurations from exported templates or documentation to ensure recovery procedures work correctly and meet recovery time objectives.

- **Use Azure Backup for connected resources**: While virtual networks don't require backup, ensure that virtual machines and other resources connected to your networks are properly backed up with Azure Backup to maintain complete recovery capabilities. For more information, see [Azure Backup](/azure/backup/).