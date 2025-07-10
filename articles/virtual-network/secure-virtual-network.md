---
title: Secure your Virtual Network deployment
description: Learn how to secure Azure Virtual Network with best practices for network isolation, access control, monitoring, and threat protection.
author: asudbring
ms.author: allensu
ms.service: azure-virtual-network
ms.topic: conceptual
ms.custom: horz-security
ms.date: 06/18/2025
ai-usage: ai-assisted
---

# Secure your Virtual Network deployment

Azure Virtual Network is the fundamental building block for your private network in Azure, enabling Azure resources to securely communicate with each other, the internet, and on-premises networks. When deploying virtual networks, you must implement security controls to protect your network infrastructure, control traffic flow, and prevent unauthorized access to your resources.

This article provides guidance on how to best secure your Azure Virtual Network deployment.

## Network security

Network security for Virtual Networks focuses on controlling traffic flow, implementing network segmentation, and protecting against external threats. Proper network security controls help isolate workloads, prevent lateral movement, and defend against distributed denial-of-service attacks.

- **Segment workloads using Network Security Groups (NSGs) and Application Security Groups**: Apply NSGs to subnets and network interfaces to control inbound and outbound traffic based on source IP, destination IP, port, and protocol. Use Application Security Groups to group virtual machines logically and define network security policies based on application structure. Use a "deny by default, permit by exception" approach to minimize attack surface. For more information, see [Network Security Groups](/azure/virtual-network/network-security-groups-overview).

- **Enable NSG flow logs for traffic monitoring**: Configure NSG flow logs to capture information about IP traffic flowing through your network security groups. Send these logs to Azure Monitor Log Analytics and use Traffic Analytics to visualize network activity and identify security threats. For more information, see [NSG flow logs](/azure/network-watcher/network-watcher-nsg-flow-logging-portal).

- **Deploy Azure Firewall for centralized, stateful protection**: Use Azure Firewall to control both inbound and outbound traffic across your virtual networks with fully stateful packet inspection. Define and manage application and network rules at scale using centralized Firewall Policies. Azure Firewall supports DNAT for secure inbound access and SNAT for consistent outbound connectivity. For enhanced security, enable threat intelligence-based filtering to automatically alert on and deny traffic to known malicious IP addresses and domains, and use Azure Firewall Premium with intrusion detection and prevention system (IDPS) to monitor and block malicious network traffic. Integrate with Azure Monitor for full traffic visibility and log analysis. For more information, see [Azure Firewall](/azure/firewall/overview).

- **Enable DDoS Protection Standard**: Activate DDoS Protection Standard on your virtual networks to defend against distributed denial-of-service attacks. This service provides enhanced DDoS mitigation capabilities and real-time monitoring for your public IP addresses. For more information, see [Azure DDoS Protection Standard](/azure/ddos-protection/manage-ddos-protection).

- **Use service tags to simplify security rules**: Replace specific IP addresses with service tags in your NSG rules to allow communication with Azure services while maintaining security. Microsoft automatically updates service tags as IP ranges change. For more information, see [Service tags](/azure/virtual-network/service-tags-overview).

- **Configure packet capture for forensic analysis**: Enable packet capture on virtual machines or use VPN Gateway packet capture to record network traffic for security analysis and incident investigation. For more information, see [Network Watcher packet capture](/azure/network-watcher/network-watcher-packet-capture-overview).

- **Implement Azure Bastion for secure RDP/SSH access**: Use Azure Bastion to securely connect to virtual machines over RDP or SSH without exposing them to the public internet. Bastion eliminates the need for public IP addresses on VMs and reduces attack surface. For more information, see [Azure Bastion](/azure/bastion/bastion-overview).

- **Implement Azure NAT Gateway for outbound traffic**: Use Azure NAT Gateway to provide a static outbound IP address for virtual network resources, ensuring secure and scalable egress traffic. NAT Gateway also provides protection against port exhaustion. For more information, see [Azure NAT Gateway](/azure/virtual-network/nat-gateway/nat-overview).

- **Use private endpoints and Private Link for Azure services**: Use Azure Private Link to access Azure PaaS services (like Azure Storage, SQL Database) over a private endpoint within your virtual network. Private Link eliminates exposure to the public internet and enhances security by keeping traffic within the Azure backbone network. For more information, see [Azure Private Link](/azure/private-link/private-link-overview).

- **Configure subnets as private by default**: For subnets that don't require public internet access, configure them as private subnets. Use Azure Firewall or NAT Gateway for controlled outbound access if needed. For more information, see [Default outbound access in Azure](/azure/virtual-network/ip-services/default-outbound-access)

- **Apply Adaptive Network Hardening recommendations**: Use Microsoft Defender for Cloud's Adaptive Network Hardening to receive machine learning-based recommendations for tightening NSG rules based on actual traffic patterns and threat intelligence. For more information, see [Adaptive Network Hardening](/azure/defender-for-cloud/adaptive-network-hardening).

- **Design with defense-in-depth principles**: Implement multiple layers of network security controls to create redundant protection. Use segmentation strategies that isolate critical workloads and apply different security measures at each network boundary to contain potential breaches.

- **Enable Virtual Network encryption**: Use Azure Virtual Network encryption to encrypt data in transit between virtual machines within the same virtual network and between regionally and globally peered virtual networks. This provides additional protection for sensitive data communications. For more information, see [Virtual Network encryption](/azure/virtual-network/virtual-network-encryption-overview).

- **Maintain updated security perimeter**: Regularly review and update security settings including NSGs, Application Security Groups, and IP address ranges. Outdated rules might not align with current network architecture or traffic patterns, potentially creating security gaps. For more information, see [Network Security Groups overview](/azure/virtual-network/network-security-groups-overview).

- **Limit public IP address usage**: Minimize the number of public IP addresses by using shared public IP addresses from services like Azure Front Door or Application Gateway. When public IPs are necessary, implement proper port management and request validation. For more information, see [Public IP addresses](/azure/virtual-network/ip-services/public-ip-addresses).

## Identity management

Identity management for Virtual Networks involves controlling access to network resources and ensuring that only authorized users and services can modify network configurations. Proper identity controls prevent unauthorized network changes and maintain network security posture.

- **Use Azure RBAC for network resource access**: Assign appropriate built-in roles such as Network Contributor or custom roles with specific permissions to control who can create, modify, or delete virtual networks and related resources. Follow the principle of least privilege. For more information, see [Azure RBAC for networking](/azure/role-based-access-control/built-in-roles#networking).

- **Enable Microsoft Entra ID integration with SSO**: Use Microsoft Entra ID as the centralized identity provider for managing access to network resources and related Azure services. Implement single sign-on (SSO) rather than configuring individual standalone credentials per service to reduce attack surface and minimize password requirements. Microsoft Entra ID integration ensures consistent authentication and authorization across your network infrastructure. For more information, see [Single sign-on to applications](/azure/active-directory/manage-apps/what-is-single-sign-on).

- **Implement conditional access for network administrators**: Configure conditional access policies to require multifactor authentication and restrict access to network management operations based on user location, device compliance, and risk level. For more information, see [Conditional Access](/azure/active-directory/conditional-access/overview).

- **Use managed identities for Azure resources**: Enable managed identities for Azure resources that need to access other Azure services, eliminating the need to store credentials in your virtual network configurations. This provides secure, credential-free authentication. For more information, see [Managed identities](/azure/active-directory/managed-identities-azure-resources/overview).

- **Regularly review and reconcile user access**: Perform regular access reviews to efficiently manage group memberships, access to enterprise applications, and role assignments. Ensure only active users have continued access to network management functions. For more information, see [Azure Identity Access Reviews](/azure/active-directory/governance/access-reviews-overview).

- **Apply principle of least privilege for network roles**: Configure role-based access control with a no-access mindset for network-related roles. Ensure users can only modify network settings as required by their job function to minimize potential security risks. For more information, see [Azure RBAC best practices](/azure/role-based-access-control/best-practices).

## Privileged access

Privileged access management for Virtual Networks focuses on securing administrative operations and ensuring that authorized personnel perform network configuration changes with appropriate oversight and monitoring.

- **Enforce multi-factor authentication for network administrators**: Require MFA for all users with network administration privileges to add an extra security layer beyond passwords. MFA significantly reduces the risk of credential-based attacks. For more information, see [Microsoft Entra multifactor authentication](/azure/active-directory/authentication/concept-mfa-howitworks).

- **Use just-in-time access for network operations**: Implement Microsoft Entra Privileged Identity Management to provide time-limited access to network administration roles. JIT access reduces the window of exposure for privileged credentials. For more information, see [Privileged Identity Management](/azure/active-directory/privileged-identity-management/pim-configure).

- **Monitor privileged network activities**: Enable logging and monitoring for all privileged network operations including NSG changes, route table modifications, and firewall rule updates. Use Azure Activity Log and Azure Monitor to track administrative actions. For more information, see [Azure Activity Log](/azure/azure-monitor/essentials/activity-log).

- **Use dedicated administrative accounts with Privileged Access Workstations**: Create standard operating procedures around the use of dedicated administrative accounts. Deploy Privileged Access Workstations (PAWs) with multifactor authentication configured for network administrators to perform administrative tasks. PAWs provide a hardened, secure environment for managing critical network infrastructure. Use Microsoft Defender for Cloud's Identity and Access Management to monitor the number of administrative accounts. For more information, see [Privileged Access Workstations](/security/compass/overview).

- **Maintain inventory of administrative accounts**: Use Microsoft Entra ID built-in administrator roles that can be explicitly assigned and are queryable. Regularly audit accounts that are members of administrative groups to ensure proper access control.

## Data protection

Data protection for Virtual Networks involves securing data in transit across your network infrastructure and ensuring that network communications are encrypted and protected from interception or tampering.

- **Enable encryption in transit**: Ensure all network traffic uses encryption protocols such as TLS 1.2 or higher, IPsec for VPN connections, and encrypted protocols for application communications. Azure provides encryption by default for traffic between Azure datacenters. For more information, see [Encryption in transit](/azure/security/fundamentals/encryption-overview#encryption-of-data-in-transit).

- **Enable Azure Virtual Network encryption**: Use Azure Virtual Network encryption to encrypt data in transit between virtual machines within the same virtual network. This provides an additional layer of security for sensitive data. For more information, see [Azure Virtual Network encryption](/azure/virtual-network/virtual-network-encryption-overview).

- **Implement network access controls for sensitive data**: Use NSGs and Azure Firewall to restrict access to subnets and resources containing sensitive data. Apply defense-in-depth principles with multiple layers of network security controls.

- **Enable MACsec for Azure ExpressRoute**: For ExpressRoute connections, enable MACsec (Media Access Control Security) to provide Layer 2 encryption between your on-premises network and Azure, ensuring confidentiality and integrity of data in transit. For more information, see [MACsec for ExpressRoute](/azure/expressroute/expressroute-howto-macsec).

- **Classify data based on sensitivity**: Assign confidentiality levels to data flowing through your virtual networks and implement appropriate network security controls based on these classifications. Use this classification to influence network design and security prioritization.

## Logging and threat detection

Comprehensive logging and threat detection for Virtual Networks enables security monitoring, incident response, and compliance reporting. Proper logging helps identify security threats and provides forensic capabilities for incident investigation.

- **Centralize log collection with Azure Monitor**: Configure diagnostic settings to send virtual network logs, NSG flow logs, and Azure Firewall logs to Azure Monitor Log Analytics workspace for centralized analysis and correlation. Set appropriate log retention periods according to your organization's compliance regulations and use Azure Storage accounts for long-term archival storage of security logs. For more information, see [Azure Monitor](/azure/azure-monitor/overview).

- **Enable Microsoft Defender for Cloud**: Use Microsoft Defender for Cloud to monitor your virtual network resources for security misconfigurations and threats. Enable the enhanced security features for comprehensive protection. For more information, see [Microsoft Defender for Cloud](/azure/defender-for-cloud/defender-for-cloud-introduction).

- **Configure security alerts and notifications**: Set up Azure Monitor alerts for critical network security events such as NSG rule changes, unusual traffic patterns, or firewall blocks. Configure action groups to automatically notify security teams. For more information, see [Azure Monitor alerts](/azure/azure-monitor/alerts/alerts-overview).

- **Use Microsoft Sentinel for advanced threat detection**: Connect your virtual network logs to Microsoft Sentinel for advanced security analytics, threat hunting, and automated response capabilities. For more information, see [Microsoft Sentinel](/azure/sentinel/quickstart-onboard).

- **Enable comprehensive logging for network resources**: Turn on diagnostic logging for virtual networks, load balancers, and other network components to capture configuration changes and access patterns. Configure DNS query logging for Azure DNS or custom DNS servers to detect DNS-based attacks and data exfiltration attempts. Monitor for suspicious domain queries and DNS tunneling activities.

- **Monitor and analyze logs with UEBA**: Regularly review logs for anomalous behavior and security events. Use Azure Monitor's Log Analytics Workspace to query and perform analytics on security data. Implement User and Entity Behavior Analytics (UEBA) tools to collect user behavior from monitoring data and analyze it to detect anomalous user access patterns that might indicate security threats.

## Asset management

Asset management for Virtual Networks involves maintaining an inventory of network resources, implementing governance policies, and ensuring compliance with security standards. Effective asset management helps maintain security posture and enables rapid response to security incidents.

- **Use Azure Policy for governance and resource restrictions**: Deploy Azure Policy definitions to enforce security standards for virtual networks. These policies can require NSGs on subnets, mandate specific security rules, or prevent creation of public IPs. Use built-in policy definitions such as "Not allowed resource types" and "Allowed resource types" to restrict resource creation. For more information, see [Azure Policy for virtual networks](/azure/virtual-network/policy-reference).

- **Tag network resources for organization**: Apply consistent tagging strategies to virtual networks, subnets, NSGs, and related resources to enable proper organization, cost management, and security policy enforcement. Use tags and the description field in NSG rules to specify business need, duration, and other information for security rules to aid in security audits and rule management. For more information, see [Resource tagging](/azure/azure-resource-manager/management/tag-resources).

- **Monitor resource configuration changes**: Use Azure Resource Graph to query and discover all networking resources across subscriptions. Set up alerts for unauthorized changes to critical network configurations. For more information, see [Azure Resource Graph](/azure/governance/resource-graph/first-query-portal).

- **Implement standardized configuration management**: Use Azure Resource Manager templates or Bicep to define and deploy network configurations consistently. Use Azure Blueprints to simplify large-scale Azure deployments by packaging key environment artifacts, such as Azure Resource Manager templates, role-based access control assignments, and policies, in a single blueprint definition. Store templates in version control and implement change management processes for network modifications. For more information, see [Azure Blueprints](/azure/governance/blueprints/create-blueprint-portal).

- **Maintain approved resource inventories**: Create and maintain inventories of approved Azure resources and approved configurations for your networking environment. Regularly audit deployments to ensure compliance with approved baselines.

## Security testing

Security testing for Virtual Networks ensures that implemented security controls are functioning correctly and can detect and prevent potential threats. Regular testing validates the effectiveness of your network security posture.

- **Conduct regular penetration testing**: Perform periodic penetration testing conducted by experts external to the workload team who attempt to ethically hack the network infrastructure. These tests validate security defenses by simulating real-world attacks.

- **Implement vulnerability scanning**: Run routine and integrated vulnerability scanning to detect exploits in network infrastructure, virtual machines, and network appliances. Integrate scanners into deployment pipelines to automatically detect vulnerabilities.

- **Test incident response procedures**: Conduct exercises to test your network security incident response capabilities on a regular basis. Identify weak points and gaps in your network security response procedures and revise plans as needed.

- **Validate network segmentation**: Regularly test network segmentation controls to ensure that compromised resources in one segment cannot access resources in other segments. Verify that isolation boundaries are functioning as designed.

- **Test backup and recovery procedures**: Regularly test your ability to recreate virtual network configurations from exported templates or documentation to ensure recovery procedures work correctly and meet recovery time objectives.

- **Enable Virtual Network Verifier**: Use Virtual Network Verifier in Azure Virtual Network Manager in preproduction environments to test connectivity between resources and ensure they are reachable and not blocked by policies. For more information, see [Virtual Network Verifier](/azure/virtual-network-manager/concept-virtual-network-verifier).

- **Use Azure Chaos Studio for resilience testing**: Implement Azure Chaos Studio to simulate network connectivity disruptions and validate that security controls remain effective during failure scenarios. This ensures that security mechanisms continue to function properly even when the network experiences stress or partial outages. For more information, see [Azure Chaos Studio](/azure/chaos-studio/chaos-studio-overview).

## Backup and recovery

Backup and recovery for Virtual Networks focuses on preserving network configurations and ensuring rapid restoration of network connectivity if there's accidental deletion or configuration errors. While virtual networks themselves don't require traditional backups, configuration preservation is critical.

- **Export and protect network configurations**: Use Azure Resource Manager to export virtual network configurations as templates that can be stored and used for disaster recovery. Automate this process using Azure Automation or Azure Pipelines. Use Azure DevOps to securely store and manage your code like custom Azure Policy definitions and Azure Resource Manager templates. Enable Soft-Delete and purge protection in Key Vault to protect keys against accidental or malicious deletion. For more information, see [Export templates](/azure/azure-resource-manager/templates/export-template-portal).

- **Document network architecture**: Maintain comprehensive documentation of your network design, including IP address schemes, routing tables, security group rules, and connectivity requirements. Store this documentation in a secure, accessible location.

- **Test and validate recovery procedures**: Regularly test your ability to recreate virtual network configurations from exported templates or documentation to ensure recovery procedures work correctly and meet recovery time objectives. Periodically perform deployment of Azure Resource Manager templates to an isolated subscription and test restoration of backed up customer-managed keys to ensure recovery procedures work correctly.

- **Backup connected resources and customer-managed keys**: While virtual networks don't require backup, ensure that virtual machines and other resources connected to your networks are properly backed up with Azure Backup to maintain complete recovery capabilities. If using customer-managed keys for encryption within your virtual network environment, ensure these keys are backed up in Azure Key Vault with appropriate retention and recovery procedures. For more information, see [Azure Backup](/azure/backup/).

- **Prepare redundant networking infrastructure**: Duplicate networking infrastructure in advance, especially for hybrid setups. Ensure that separate routes in different regions are ready to communicate with each other beforehand. Replicate and maintain consistent NSGs and Azure Firewall rules across both primary and disaster recovery sites. Avoid overlapping IP address ranges between production and disaster recovery networks to simplify network management and expedite transition during failover events.

## Incident response

Incident response for Virtual Networks involves establishing procedures to detect, respond to, and recover from security incidents affecting your network infrastructure. Proper incident response capabilities help minimize the impact of security breaches and ensure rapid restoration of services.

- **Create an incident response guide**: Build out an incident response guide for your organization that defines all roles of personnel and phases of incident handling from detection to post-incident review. Include specific procedures for network security incidents.

- **Implement incident scoring and prioritization**: Establish procedures to prioritize security incidents based on severity and impact. Use Microsoft Defender for Cloud alerts to help prioritize which network security incidents should be investigated first.

- **Configure security incident contact details**: Set up security incident contact information that will be used by Microsoft to contact you if the Microsoft Security Response Center discovers that your data has been accessed by an unlawful or unauthorized party. For more information, see [Microsoft Defender for Cloud Security Contact](/azure/defender-for-cloud/configure-email-notifications).

- **Incorporate security alerts into incident response**: Export Microsoft Defender for Cloud alerts and recommendations using the Continuous Export feature to help identify risks to Azure resources. Use the data connector to stream alerts to Microsoft Sentinel for centralized incident management.

- **Test security response procedures**: Conduct exercises to test your systems' incident response capabilities on a regular basis. Identify weak points and gaps in your network security response procedures and revise plans as needed.

- **Automate incident response**: Use the Workflow Automation feature in Microsoft Defender for Cloud to automatically trigger responses via Logic Apps on security alerts and recommendations to protect your Azure network resources.