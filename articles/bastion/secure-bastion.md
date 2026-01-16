---
title: Secure Your Azure Bastion Deployment
description: Learn how to secure your Azure Bastion deployment using actionable guidance aligned to the Microsoft Cloud Security Benchmark.
author: abell
ms.service: azure-bastion
ms.topic: conceptual
ms.custom: subject-security-benchmark
ms.date: 08/28/2025
ms.author: abell
ai-usage: ai-assisted
---

# Secure your Azure Bastion deployment

Azure Bastion is a fully managed platform-as-a-service (PaaS) that provides secure and seamless RDP and SSH connectivity to virtual machines directly in the Azure portal over TLS. Because Bastion acts as a critical gateway to your virtual networks and VMs, securing your deployment is essential to protect your infrastructure from unauthorized access and network threats.

This article provides guidance on how to best secure your Azure Bastion deployment.
> [!NOTE]
> Entra ID authentication for RDP connections is now available in preview! See [Microsoft Entra ID](bastion-connect-vm-rdp-windows.md#microsoft-entra-id-authentication-preview) for details.

## Network security

Azure Bastion is a network security service that provides secure remote access to your VMs by controlling how users and services connect while preventing unauthorized access or exposure to the public internet. Proper network controls help prevent DNS attacks and maintain service integrity.

* **Deploy Bastion in a dedicated virtual network**: Create or use an existing virtual network that follows enterprise segmentation principles aligned to business risks. Isolate high-risk systems within their own virtual networks and secure them with network security groups. For more information, see [How to create a network security group with security rules](../virtual-network/tutorial-filter-network-traffic.md).

* **Configure required port access correctly**: Enable port 443 inbound on the Bastion public IP for ingress traffic from the public internet. Don't open ports 3389 or 22 on the AzureBastionSubnet, as these aren't required. This reduces your attack surface significantly.

* **Configure data plane communication**: Enable ports 8080 and 5701 inbound and outbound from the VirtualNetwork service tag to the VirtualNetwork service tag. This allows internal components of Azure Bastion to communicate with each other securely.

* **Configure egress traffic for VM connectivity**: When deploying Bastion, ensure NSGs allow outbound traffic from the AzureBastionSubnet to target VM subnets on ports 3389 and 22. For custom port functionality with Standard SKU or higher, configure NSGs to allow outbound traffic to the VirtualNetwork service tag.

* **Enable Azure service connectivity**: Allow outbound traffic on port 443 to the AzureCloud service tag and port 443 inbound from the GatewayManager service tag to the AzureBastionSubnet. These connections are required for the managed service to function properly, enabling Bastion to communicate with Azure control plane services for health monitoring, diagnostics, and management operations.

* **Configure certificate validation connectivity**: Enable port 80 outbound to the Internet for session validation, Bastion Shareable Links, and certificate validation. For environments with restricted internet connectivity, work with your network team to allow these specific endpoints while maintaining your security posture.

* **Use virtual network peering for centralized deployment**: Deploy Bastion into a peered network to centralize your deployment and enable cross-network connectivity. For more information, see [Azure Bastion and virtual network peering](./vnet-peering.md).

* **Apply comprehensive network security groups**: Use NSGs on both the AzureBastionSubnet and target VM subnets to control traffic flow. Ensure all required rules are in place, as omitting any can block necessary updates and create security vulnerabilities. For more information, see [Working with NSG access and Azure Bastion](./bastion-nsg.md).

* **Consider private-only deployment for enhanced security**: For maximum security in environments with ExpressRoute, deploy Bastion as private-only to eliminate outbound access outside the virtual network. This requires Premium SKU and static IP assignment. For more information, see [Deploy Bastion as private-only](./private-only-deployment.md).

* **Use proper subnet sizing**: Deploy Bastion in an AzureBastionSubnet with a /26 or larger subnet to support host scaling and ensure sufficient IP address space for future growth. For more information, see [About Bastion configuration settings](./configuration-settings.md).

## Privileged access

Privileged access management for Azure Bastion ensures that only authorized users can modify Bastion resources and connect to VMs while following the principle of least privilege. Proper access controls prevent unauthorized changes that could compromise your infrastructure and help ensure that access is regularly reviewed and monitored.

* **Control Azure Bastion resource management with Microsoft Entra ID**: Use Microsoft Entra ID authentication and Azure RBAC to control who can create, modify, or delete Azure Bastion resources in the Azure portal. This provides centralized identity management and administrative control over the Bastion service itself.

* **Store SSH keys in Azure Key Vault**: Store SSH keys as Key Vault secrets and use them to connect to VMs through Bastion. Control access by assigning Key Vault access policies to individual users or Microsoft Entra ID groups.

* **Configure proper Key Vault permissions**: Grant users "Get" and "List" permissions to Key Vault secrets when using stored SSH keys for VM connections. This enables secure, centralized credential management.

* **Implement least privilege access with Microsoft Entra ID PIM**: Use Privileged Identity Management (PIM) to provide just-in-time, time-bound access to VMs through Bastion. Configure users with Reader roles on the target VM, the VM's NIC with private IP, the Bastion resource, and the target VM's virtual network (if Bastion is in a peered network). PIM ensures users only have elevated access when needed and helps identify stale or excessive permissions. For more information, see [Connect to a Linux virtual machine using Azure Bastion](./bastion-connect-vm-ssh-linux.md).

* **Enable Kerberos authentication for domain-joined VMs**: Configure Kerberos authentication for enhanced security when connecting to domain-joined Windows VMs. Ensure NSGs allow traffic on required ports (53, 88, 389, 464, 636) and configure custom DNS settings. For more information, see [Configure Bastion for Kerberos authentication using the Azure portal](./kerberos-authentication-portal.md).

* **Review user access regularly**: Use Microsoft Entra ID access reviews to regularly review group memberships, enterprise application access, and role assignments. This helps identify and remove stale or inappropriate access.

* **Use privileged access workstations**: Deploy secured, isolated workstations for administrators performing Bastion management tasks in production environments. Use Microsoft Entra ID, Microsoft Defender for Endpoint, or Intune to enforce strong authentication and restricted access.

* **Control shareable link access**: If using the Shareable Link feature, ensure users have only the minimum required permissions. By default, grant only "Read" access to shared links so users can view and use links but can't create or delete them. For more information, see [Create a shareable link for Bastion](./shareable-link.md).

## Data protection

Data protection for Azure Bastion focuses on protecting data integrity and preventing unauthorized access to session data and configuration information.

* **Leverage built-in TLS encryption**: Azure Bastion automatically uses TLS to encrypt data in transit between users and virtual machines. This encryption is managed by Microsoft and doesn't require additional configuration. For more information, see [Azure Bastion key benefits](./bastion-overview.md#key-benefits).

## Session management and monitoring

Session management capabilities help you maintain visibility and control over active connections to your VMs, ensuring compliance and operational security.

* **Monitor active sessions**: Use the Sessions page in the Azure portal to view which users are connected to which VMs, including connection times, duration, and source IP addresses. This provides real-time visibility into Bastion usage. For more information, see [Session monitoring and management for Azure Bastion](./session-monitoring.md).

* **Implement session disconnection capabilities**: Use the session management interface to force-disconnect users from ongoing sessions when necessary for security or administrative purposes. This helps maintain control over access to your resources.

* **Enable session recording for compliance**: Configure session recording with Premium SKU to capture all RDP and SSH sessions for auditing and compliance purposes. Store recordings in Azure Storage with appropriate retention policies. For more information, see [Configure Bastion session recording](./session-recording.md).

* **Set appropriate session recording policies**: Ensure session recording storage accounts don't have immutable storage policies or blob versioning enabled, as these can interfere with recording functionality. Configure storage accounts without Write-Once-Read-Many (WORM) policies for session recording containers.

## Logging and threat detection

Comprehensive logging and threat detection help you monitor Bastion usage, detect suspicious activities, and respond to security incidents effectively. Logging and monitoring enables effective threat detection and helps meet compliance requirements.

* **Enable Azure Bastion resource logs**: Turn on diagnostic logs like BastionAuditLogs to track which users connected to which workloads, when, and from where. Configure these logs to be sent to storage accounts for long-term retention and auditing. For more information, see [Enable and work with Azure Bastion logs](./diagnostic-logs.md).

* **Monitor Microsoft Entra ID sign-ins and audit logs**: Integrate Microsoft Entra ID logs with Azure Monitor, Microsoft Sentinel, or other SIEM tools to monitor sign-ins, audit changes, risky sign-ins, and users flagged for risk.

* **Enable NSG flow logs**: Collect NSG resource logs and flow logs on network security groups applied to virtual networks with Bastion resources. Use these for security analysis, incident investigations, and threat hunting. For more information, see [How to enable network security group flow logs](../network-watcher/network-watcher-nsg-flow-logging-portal.md).

* **Use Traffic Analytics**: Send NSG flow logs to Azure Monitor Log Analytics workspace and use Traffic Analytics to gain network insights and identify potential security issues.

* **Monitor Azure Activity Logs**: Activity logs automatically capture all write operations for Bastion resources. Use these logs for troubleshooting and monitoring resource modifications.

* **Centralize log management**: Ingest logs via Azure Monitor to aggregate security data. Use Log Analytics workspaces for querying and analytics, and Azure Storage accounts for long-term retention.

* **Set appropriate log retention**: Configure log retention periods in Log Analytics workspaces and storage accounts according to your organization's compliance requirements.

* **Enable Microsoft Defender for Cloud**: Use Defender for Cloud to monitor suspicious activities like excessive failed authentication attempts and deprecated accounts. The Threat Protection module provides in-depth security alerts.

## Asset management

Asset management for Azure Bastion involves implementing governance controls, monitoring configurations, and ensuring compliance with organizational security policies. Proper asset management helps maintain security posture and operational visibility.

* **Grant security teams proper visibility**: Ensure security teams have Security Reader permissions at appropriate scopes (tenant, management group, or subscription) to monitor security risks using Microsoft Defender for Cloud.

* **Apply consistent resource tagging**: Use tags on Bastion resources, resource groups, and subscriptions for logical organization. Apply tags like "Environment" and "Production" to enable proper asset categorization and management.

* **Enable asset inventory management**: Give security teams access to continuously updated asset inventories using Azure Resource Graph to query and discover all resources, including Bastion deployments.

* **Use Azure Policy for governance**: Implement Azure Policy to audit and restrict service provisioning, including allowing or denying Bastion resource deployments. Create custom policies using "Microsoft.Network" namespace aliases.

* **Establish secure configuration baselines**: Define standard security configurations for Bastion using Azure Policy, Azure Blueprints, or ARM templates to ensure consistent and secure deployments. For more information, see [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md).

* **Monitor compliance continuously**: Use Azure Policy to continuously audit and enforce network configurations for your Bastion resources, ensuring they remain compliant with organizational security standards.

* **Choose appropriate SKU for security requirements**: Select the SKU tier based on required security features. Use Premium SKU for session recording and private-only deployments, Standard SKU for shareable links and host scaling, or Basic SKU for standard deployments. For more information, see [About Bastion configuration settings](./configuration-settings.md).

## Next steps

- [Azure Well-Architected Framework - Security pillar](/azure/well-architected/security/)
- [Microsoft Cloud Adoption Framework - Secure methodology](/azure/cloud-adoption-framework/secure/overview)
