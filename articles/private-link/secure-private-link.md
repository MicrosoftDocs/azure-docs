---
title: Secure your Azure Private Link deployment
description: Learn how to secure Azure Private Link, with best practices for protecting your deployment.
author: msmbaldwin
ms.author: mbaldwin
ms.service: azure-private-link
ms.topic: best-practice
ms.custom: horz-security
ms.date: 05/12/2026
ai-usage: ai-assisted
---

# Secure your Azure Private Link deployment

Azure Private Link enables you to access Azure PaaS services and Azure-hosted customer-owned or partner services over a private endpoint in your virtual network. Traffic between your virtual network and the service travels the Microsoft backbone network, eliminating exposure to the public internet.

This article provides security recommendations for Azure Private Link. Following these recommendations helps you fulfill your security obligations and improve the overall security posture of your Private Link deployments. For an overview of Azure's network security services and how they work together, see [What is Azure network security?](../networking/security/network-security.md).

[!INCLUDE [Security horizontal Zero Trust statement](~/reusable-content/ce-skilling/azure/includes/security/zero-trust-security-horizontal.md)]

## Network security

- **Map private endpoints to specific resource instances to prevent data exfiltration**: Private endpoints are mapped to a single instance of a PaaS resource rather than the entire service. This instance-level mapping prevents an attacker from accessing any other resource, even within the same service. See [What is a private endpoint?](private-endpoint-overview.md).

- **Enable network security group (NSG) support on private endpoint subnets**: By default, network policies are disabled for subnets containing private endpoints. Enable NSG support to enforce inbound and outbound traffic rules on private endpoint traffic. See [Manage network policies for private endpoints](disable-private-endpoint-network-policy.md).

- **Use application security groups (ASGs) to group private endpoints for simplified rule management**: Associate private endpoints with ASGs to apply NSG rules to groups of endpoints rather than writing individual rules per IP address. See [Configure an application security group with a private endpoint](configure-asg-private-endpoint.md).

- **Route private endpoint traffic through Azure Firewall for deep packet inspection**: Enable user-defined routes (UDRs) on private endpoint subnets and route traffic through Azure Firewall to inspect and filter traffic using FQDN-based rules. Use application rules rather than network rules to maintain flow symmetry with SNAT. For broader firewall guidance, see [Secure your Azure Firewall deployment](../firewall/secure-firewall.md). See [Use Azure Firewall to inspect traffic destined to a private endpoint](inspect-traffic-with-azure-firewall.md).

- **Configure private DNS zones correctly to prevent DNS leakage**: Create Azure private DNS zones that match the recommended zone names for each service type. Link private DNS zones to all virtual networks that need to resolve private endpoint addresses. Incorrect DNS configuration can cause traffic to route over the public internet instead of through the private endpoint. See [Azure Private Endpoint DNS integration](private-endpoint-dns-integration.md).

- **Use Azure Private DNS Resolver for hybrid name resolution**: In hub-and-spoke or hybrid topologies, deploy Azure Private DNS Resolver to securely forward DNS queries between on-premises networks and Azure. This approach avoids deploying custom DNS forwarder VMs and centralizes DNS management. See [Azure Private Endpoint DNS integration](private-endpoint-dns-integration.md).

- **Associate resources with a Network Security Perimeter (NSP) to define a trusted network boundary**: Group supported PaaS resources into a perimeter that controls public inbound and outbound access. Start in Transition mode (formerly Learning mode) to validate access patterns, then explicitly move resource associations to Enforced mode so the resources obey only NSP access rules. In Enforced mode, trusted service access isn't supported, and private endpoint traffic isn't impacted by NSP. See [Transition to a network security perimeter](network-security-perimeter-transition.md).

- **Disable public network access on target resources after deploying private endpoints**: After confirming private endpoint connectivity, disable public network access on the target PaaS resource to ensure all traffic flows over the private link. See [What is Azure Private Link?](private-link-overview.md).

- **Configure Private Link Service NAT IP subnets correctly**: When publishing your own services via Private Link Service, use NAT IP configurations from a subnet where `privateLinkServiceNetworkPolicies` is disabled. A dedicated subnet isn't required for the Private Link Service, but other resources in the subnet remain governed by their NSG rules. See [Disable network policies for Private Link service source IP](disable-private-link-service-network-policy.md).

## Identity and access management

- **Assign least-privilege RBAC roles for private endpoint management**: Use the built-in Network Contributor role for users who need to create and manage private endpoints. For more granular control, create custom roles that include only the permissions listed in the Private Link RBAC reference (covering private endpoint, subnet join, target service, and approval actions as appropriate). See [Azure RBAC permissions for Azure Private Link](rbac-permissions.md).

- **Require manual approval for private endpoint connections from external tenants**: When exposing services through Private Link Service, configure the visibility and auto-approval settings to require manual approval for connections originating outside your organization. This prevents unauthorized cross-tenant access to your resources. See [What is Azure Private Link Service?](private-link-service-overview.md).

- **Use managed identities for applications that access private-endpoint-connected resources**: Where the hosting platform supports managed identities and the target PaaS service supports Microsoft Entra authentication, configure applications running in your virtual network to authenticate with managed identities rather than shared keys or connection strings when accessing resources through private endpoints. This eliminates the need to store credentials. See [What are managed identities for Azure resources?](/entra/identity/managed-identities-azure-resources/overview).

- **Assign granular RBAC roles for Network Security Perimeter management**: Separate NSP administration from general network management by assigning specific permissions for perimeter operations, profile management, and access rule management. See [Azure RBAC permissions for Network Security Perimeter](network-security-perimeter-role-based-access-control-requirements.md).

## Data protection

- **Use private endpoints to eliminate public internet exposure for data in transit**: Private endpoints route traffic over the Microsoft backbone network using a private IP address in your virtual network. This removes the need to allow public internet access to your PaaS resources, reducing the attack surface for data interception. See [What is a private endpoint?](private-endpoint-overview.md).

- **Enforce TLS encryption on connections through private endpoints**: Private Link doesn't change the encryption behavior of the underlying service. Continue to enforce TLS 1.2 or later on all services accessed through private endpoints to protect data in transit. See [Azure encryption overview](../security/fundamentals/encryption-overview.md).

- **Restrict Private Link Service visibility to specific subscriptions**: When publishing services through Private Link Service, use the visibility property to limit which subscriptions can discover and request connections to your service. Restrict auto-approval lists to subscriptions you own. See [What is Azure Private Link Service?](private-link-service-overview.md).

## Logging and monitoring

- **Monitor traffic volume for private endpoints**: Use Azure Monitor metrics to track private endpoint `Bytes In` and `Bytes Out` so you can identify unexpected traffic changes or connectivity issues. See [Supported metrics for Microsoft.Network/privateEndpoints](/azure/azure-monitor/reference/supported-metrics/microsoft-network-privateendpoints-metrics).

- **Set alerts on Private Link Service NAT port utilization**: For provider services that use Private Link Service, create Azure Monitor alerts on the `Nat Ports Usage` metric. High NAT port usage can indicate port pressure and affect connectivity for consumers. See [Supported metrics for Microsoft.Network/privateLinkServices](/azure/azure-monitor/reference/supported-metrics/microsoft-network-privatelinkservices-metrics).

- **Enable Network Security Perimeter diagnostic logs for access auditing**: Configure NSP diagnostic logs to capture inbound and outbound access decisions, including allowed and denied traffic by perimeter rules. Use these logs to audit access patterns and identify unauthorized access attempts. See [Diagnostic logs for Network Security Perimeter](network-security-perimeter-diagnostic-logs.md).

- **Monitor private endpoint connection state changes through activity logs**: Use Azure Activity logs to track when private endpoint connections are created, approved, rejected, or removed. Set up alerts for connection state changes to detect unexpected modifications. See [Monitor Azure Private Link](monitor-private-link.md).

## Compliance and governance

- **Use Azure Policy to audit or deploy private endpoints on supported services**: Assign service-specific built-in policies, such as *Storage accounts should use private link*, *Configure Storage account to use a private link connection*, *CosmosDB accounts should use private link*, and *Configure CosmosDB accounts with private endpoints*. Apply these policies at the management group or subscription level for consistent governance. See [Azure Policy built-in policy definitions](/azure/governance/policy/samples/built-in-policies).

- **Use Azure Policy to block public network access on PaaS resources**: Complement private endpoint policies with service-specific policies that deny or modify public network access on target services. This helps ensure that a resource with a private endpoint isn't also reachable over the public internet. See [Azure Policy built-in policy definitions](/azure/governance/policy/samples/built-in-policies).

- **Govern Network Security Perimeter configurations with documented controls**: Define the required perimeters, profiles, access rules, and association access modes in your deployment templates and change-management process. Use Transition mode to observe access patterns before explicitly moving associations to Enforced mode in production. See [Transition to a network security perimeter](network-security-perimeter-transition.md).

- **Tag and track all private endpoint resources for inventory management**: Apply a consistent tagging strategy to private endpoints, private DNS zones, and Private Link Service resources. Use Azure Resource Graph queries to audit your private connectivity inventory and identify resources that lack required tags or private connectivity. See [Azure Resource Graph overview](../governance/resource-graph/overview.md).

## Backup and recovery

- **Deploy private endpoints to zone-resilient services for high availability**: Azure Private Link and private endpoints span across Azure Availability Zones and are zone resilient. To fully benefit from this, ensure the target PaaS resource is also zone resilient. A private endpoint remains available even during an availability zone failure. See [What is Azure Private Link?](private-link-overview.md).

- **Document private endpoint configurations for disaster recovery**: Maintain infrastructure-as-code templates for all private endpoint deployments, associated DNS zone records, and NSG rules. Store these templates in version control so you can redeploy your private connectivity configurations in a secondary region if needed. See [Azure Resource Manager templates overview](../azure-resource-manager/templates/overview.md).

- **Plan private endpoint DNS resolution for multi-region deployments**: In multi-region disaster recovery scenarios, document how clients should resolve service FQDNs to the correct regional private endpoint and test DNS changes as part of your service-specific failover process. The DNS integration guidance explains private zone and resolver patterns, but it doesn't replace a full disaster recovery design. See [Azure Private Endpoint DNS integration](private-endpoint-dns-integration.md).

## Next steps

- [What is Azure Private Link?](private-link-overview.md)
- [What is a private endpoint?](private-endpoint-overview.md)
- [Azure Private Endpoint private DNS zone values](private-endpoint-dns.md)
- [Network Security Perimeter concepts](network-security-perimeter-concepts.md)
- [Monitor Azure Private Link](monitor-private-link.md)
- [Azure RBAC permissions for Azure Private Link](rbac-permissions.md)
