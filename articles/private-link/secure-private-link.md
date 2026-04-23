---
title: Secure your Azure Private Link deployment
description: Learn how to secure Azure Private Link, with best practices for protecting your deployment.
author: msmbaldwin
ms.author: mbaldwin
ms.service: azure-private-link
ms.topic: best-practice
ms.custom: horz-security
ms.date: 07/17/2025
ai-usage: ai-assisted
---

# Secure your Azure Private Link deployment

Azure Private Link enables you to access Azure PaaS services and Azure-hosted customer-owned or partner services over a private endpoint in your virtual network. Traffic between your virtual network and the service travels the Microsoft backbone network, eliminating exposure to the public internet.

This article provides security recommendations for Azure Private Link. Following these recommendations helps you fulfill your security obligations and improve the overall security posture of your Private Link deployments. For an overview of Azure's network security services and how they work together, see [What is Azure network security?](../networking/security/network-security.md).

[!INCLUDE [Security horizontal Zero Trust statement](~/reusable-content/ce-skilling/azure/includes/security/zero-trust-security-horizontal.md)]

## Network security

- **Map private endpoints to specific resource instances to prevent data exfiltration**: Private endpoints are mapped to a single instance of a PaaS resource rather than the entire service. This instance-level mapping prevents an attacker from accessing any other resource, even within the same service. See [What is a private endpoint?](/azure/private-link/private-endpoint-overview).

- **Enable network security group (NSG) support on private endpoint subnets**: By default, network policies are disabled for subnets containing private endpoints. Enable NSG support to enforce inbound and outbound traffic rules on private endpoint traffic. See [Manage network policies for private endpoints](/azure/private-link/disable-private-endpoint-network-policy).

- **Use application security groups (ASGs) to group private endpoints for simplified rule management**: Associate private endpoints with ASGs to apply NSG rules to groups of endpoints rather than writing individual rules per IP address. See [Configure an application security group with a private endpoint](/azure/private-link/configure-asg-private-endpoint).

- **Route private endpoint traffic through Azure Firewall for deep packet inspection**: Enable user-defined routes (UDRs) on private endpoint subnets and route traffic through Azure Firewall to inspect and filter traffic using FQDN-based rules. Use application rules rather than network rules to maintain flow symmetry with SNAT. See [Use Azure Firewall to inspect traffic destined to a private endpoint](/azure/private-link/inspect-traffic-with-azure-firewall). For broader guidance on firewall security, see [Secure your Azure Firewall deployment](/azure/firewall/secure-firewall).

- **Configure private DNS zones correctly to prevent DNS leakage**: Create Azure private DNS zones that match the [recommended zone names](/azure/private-link/private-endpoint-dns) for each service type. Link private DNS zones to all virtual networks that need to resolve private endpoint addresses. Incorrect DNS configuration can cause traffic to route over the public internet instead of through the private endpoint. See [Azure Private Endpoint DNS integration](/azure/private-link/private-endpoint-dns-integration).

- **Use Azure Private DNS Resolver for hybrid name resolution**: In hub-and-spoke or hybrid topologies, deploy Azure Private DNS Resolver to securely forward DNS queries between on-premises networks and Azure. This approach avoids deploying custom DNS forwarder VMs and centralizes DNS management. See [Azure Private Endpoint DNS integration](/azure/private-link/private-endpoint-dns-integration).

- **Associate resources with a Network Security Perimeter (NSP) to define a trusted network boundary**: Group PaaS resources into a perimeter that enforces inbound and outbound access rules at the network level. Use Enforced mode rather than Learning mode once you have validated your access patterns. See [Network Security Perimeter concepts](/azure/private-link/network-security-perimeter-concepts).

- **Disable public network access on target resources after deploying private endpoints**: After confirming private endpoint connectivity, disable public network access on the target PaaS resource to ensure all traffic flows over the private link. See [What is Azure Private Link?](/azure/private-link/private-link-overview).

- **Use network segmentation for Private Link Service workloads**: When publishing your own services via Private Link Service, place the backend load balancer and consumer-facing resources in separate subnets with appropriate NSG rules. See [What is Azure Private Link Service?](/azure/private-link/private-link-service-overview). For broader network segmentation guidance, see [Secure your Azure Virtual Network deployment](/azure/virtual-network/secure-virtual-network).

## Identity and access management

- **Assign least-privilege RBAC roles for private endpoint management**: Use the built-in Network Contributor role for users who need to create and manage private endpoints. For more granular control, create custom roles that include only the required `Microsoft.Network/privateEndpoints/*` and `Microsoft.Network/virtualNetworks/subnets/join/action` permissions. See [Azure RBAC permissions for Azure Private Link](/azure/private-link/rbac-permissions).

- **Require manual approval for private endpoint connections from external tenants**: When exposing services through Private Link Service, configure the visibility and auto-approval settings to require manual approval for connections originating outside your organization. This prevents unauthorized cross-tenant access to your resources. See [What is Azure Private Link Service?](/azure/private-link/private-link-service-overview).

- **Use managed identities for applications that access private-endpoint-connected resources**: Configure applications running in your virtual network to authenticate with Microsoft Entra managed identities rather than shared keys or connection strings when accessing PaaS resources through private endpoints. This eliminates the need to store credentials. See [What are managed identities for Azure resources?](/azure/active-directory/managed-identities-azure-resources/overview).

- **Assign granular RBAC roles for Network Security Perimeter management**: Separate NSP administration from general network management by assigning specific permissions for perimeter operations, profile management, and access rule management. See [Azure RBAC permissions for Network Security Perimeter](/azure/private-link/network-security-perimeter-role-based-access-control-requirements).

## Data protection

- **Use private endpoints to eliminate public internet exposure for data in transit**: Private endpoints route traffic over the Microsoft backbone network using a private IP address in your virtual network. This removes the need to allow public internet access to your PaaS resources, reducing the attack surface for data interception. See [What is a private endpoint?](/azure/private-link/private-endpoint-overview).

- **Enforce TLS encryption on connections through private endpoints**: Private Link does not change the encryption behavior of the underlying service. Continue to enforce TLS 1.2 or later on all services accessed through private endpoints to protect data in transit within the Microsoft backbone network. See the security documentation for each connected Azure service.

- **Restrict Private Link Service visibility to specific subscriptions**: When publishing services through Private Link Service, use the visibility property to limit which subscriptions can discover and request connections to your service. Restrict auto-approval lists to subscriptions you own. See [What is Azure Private Link Service?](/azure/private-link/private-link-service-overview).

## Logging and monitoring

- **Enable diagnostic settings for private endpoints**: Configure diagnostic settings to send resource logs and metrics to a Log Analytics workspace for analysis, to a storage account for long-term retention, or to an event hub for streaming. Monitor the bytes in and bytes out metrics and NAT port availability to detect anomalies. See [Monitor Azure Private Link](/azure/private-link/monitor-private-link).

- **Set alerts on NAT port utilization**: Create Azure Monitor alerts on the NAT port availability metric for your private endpoints. Low NAT port availability can indicate port exhaustion and affect connectivity. See [Monitor Azure Private Link](/azure/private-link/monitor-private-link).

- **Enable Network Security Perimeter diagnostic logs for access auditing**: Configure NSP diagnostic logs to capture inbound and outbound access decisions, including allowed and denied traffic by perimeter rules. Use these logs to audit access patterns and identify unauthorized access attempts. See [Diagnostic logs for Network Security Perimeter](/azure/private-link/network-security-perimeter-diagnostic-logs).

- **Monitor private endpoint connection state changes through activity logs**: Use Azure Activity logs to track when private endpoint connections are created, approved, rejected, or removed. Set up alerts for connection state changes to detect unexpected modifications. See [Monitor Azure Private Link](/azure/private-link/monitor-private-link).

## Compliance and governance

- **Use Azure Policy to enforce private endpoint usage on supported services**: Assign built-in policies such as *Azure services should use Private Link* to audit or deny the creation of PaaS resources without associated private endpoints. Apply these policies at the management group or subscription level for consistent enforcement. See [Azure Policy built-in definitions for Azure networking services](/azure/networking/policy-reference).

- **Use Azure Policy to block public network access on PaaS resources**: Complement private endpoint enforcement policies with policies that deny public network access on target services. This ensures that even if a private endpoint exists, the resource cannot also be reached over the public internet.

- **Govern Network Security Perimeter configurations with Azure Policy**: Use Azure Policy to enforce that resources within a perimeter have consistent access rules and that perimeters operate in Enforced mode rather than Learning mode in production environments. See [Network Security Perimeter concepts](/azure/private-link/network-security-perimeter-concepts).

- **Tag and track all private endpoint resources for inventory management**: Apply a consistent tagging strategy to private endpoints, private DNS zones, and Private Link Service resources. Use Azure Resource Graph queries to audit your private endpoint inventory and identify resources that lack private connectivity.

## Backup and recovery

- **Deploy private endpoints to zone-resilient services for high availability**: Azure Private Link and private endpoints span across Azure Availability Zones and are zone resilient. To fully benefit from this, ensure the target PaaS resource is also zone resilient. A private endpoint remains available even during an availability zone failure. See [What is Azure Private Link?](/azure/private-link/private-link-overview).

- **Document private endpoint configurations for disaster recovery**: Maintain infrastructure-as-code templates (Bicep, Terraform, or ARM) for all private endpoint deployments, associated DNS zone records, and NSG rules. Store these templates in version control so you can redeploy your private connectivity configurations in a secondary region if needed.

- **Plan DNS failover for multi-region deployments**: In multi-region disaster recovery scenarios, configure private DNS zones and DNS resolution to redirect traffic to private endpoints in the failover region. Test DNS failover regularly to verify that clients resolve the correct private IP addresses after a regional failure. See [Azure Private Endpoint DNS integration](/azure/private-link/private-endpoint-dns-integration).

## Next steps

- [What is Azure Private Link?](/azure/private-link/private-link-overview)
- [What is a private endpoint?](/azure/private-link/private-endpoint-overview)
- [Azure Private Endpoint private DNS zone values](/azure/private-link/private-endpoint-dns)
- [Network Security Perimeter concepts](/azure/private-link/network-security-perimeter-concepts)
- [Monitor Azure Private Link](/azure/private-link/monitor-private-link)
- [Azure RBAC permissions for Azure Private Link](/azure/private-link/rbac-permissions)
