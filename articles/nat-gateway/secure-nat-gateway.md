---
title: Secure your Azure NAT Gateway deployment
description: Learn how to secure Azure NAT Gateway, with best practices for protecting your deployment.
author: msmbaldwin
ms.author: mbaldwin
ms.service: azure-nat-gateway
ms.topic: best-practice
ms.custom: horz-security
ms.date: 05/11/2026
ai-usage: ai-assisted
---

# Secure your Azure NAT Gateway deployment

Azure NAT Gateway is a fully managed Network Address Translation (NAT) service that enables outbound internet connectivity for resources in private subnets. NAT Gateway blocks all unsolicited inbound connections and masks private IP addresses behind static public IPs, providing a secure-by-default outbound connectivity model.

This article provides security recommendations for Azure NAT Gateway. For an overview of Azure's network security services and how they work together, see [What is Azure network security?](../networking/security/network-security.md).

[!INCLUDE [Security horizontal Zero Trust statement](~/reusable-content/ce-skilling/azure/includes/security/zero-trust-security-horizontal.md)]

## Network security

Azure NAT Gateway follows a Zero Trust network security model, blocking unsolicited inbound traffic by design. Only return traffic from active outbound connections passes through the gateway.

- **Associate NAT Gateway with private subnets**: Enable [private subnets](../virtual-network/ip-services/default-outbound-access.md) to remove default outbound access and require explicit outbound connectivity through NAT Gateway. This prevents resources from using unpredictable default outbound IP addresses. See [Design virtual networks with Azure NAT Gateway](nat-gateway-design.md).

- **Scale public IP addresses for SNAT port availability**: Assign multiple public IP addresses or a public IP prefix to your NAT Gateway to increase the available SNAT port inventory and reduce the risk of SNAT port exhaustion. Each public IP address provides 64,512 SNAT ports. See [Azure NAT Gateway resource](nat-gateway-resource.md).

- **Use predictable outbound IPs for firewall allowlisting**: Assign a public IP prefix to NAT Gateway to provide a contiguous, predictable set of outbound IP addresses. Configure destination firewall rules based on this known IP range. See [What is Azure NAT Gateway?](nat-overview.md).

- **Integrate with Azure Firewall for traffic inspection**: Deploy NAT Gateway on the Azure Firewall subnet in a hub-and-spoke topology to combine outbound SNAT scalability with centralized traffic inspection and threat protection. See [Tutorial: Integrate NAT gateway with Azure Firewall in a hub-and-spoke network](tutorial-hub-spoke-nat-firewall.md) and [Secure your Azure Firewall deployment](../firewall/secure-firewall.md).

- **Use Private Link to reduce internet exposure**: Connect to Azure PaaS services through [Azure Private Link](../private-link/private-link-overview.md) instead of routing through NAT Gateway. This reduces outbound internet traffic, frees SNAT ports, and eliminates public internet exposure for Azure service communication. See [Design virtual networks with Azure NAT Gateway](nat-gateway-design.md).

- **Restrict NAT Gateway subnet scope**: Associate NAT Gateway only with subnets that require outbound internet access. Subnets hosting internal-only workloads should not have a NAT Gateway association. See [Azure NAT Gateway resource](nat-gateway-resource.md).

For related network-layer security guidance, see [Secure your Virtual Network deployment](../virtual-network/secure-virtual-network.md) and [Secure your Azure Load Balancer deployment](../load-balancer/secure-load-balancer.md).

## Identity and access management

Control who can create, modify, and delete NAT Gateway resources using Azure role-based access control.

- **Assign least-privilege roles for NAT Gateway management**: Use the Network Contributor built-in role for users who need to manage NAT Gateway resources, rather than granting broader roles like Contributor. See [Azure built-in roles](../role-based-access-control/built-in-roles.md#network-contributor).

- **Apply resource locks to prevent accidental deletion**: Set a Delete lock on production NAT Gateway resources to prevent accidental removal, which would immediately disrupt outbound connectivity for all associated subnets. See [Lock your Azure resources to protect your infrastructure](../azure-resource-manager/management/lock-resources.md).

## Data protection

Azure NAT Gateway operates at the network layer and does not inspect, store, or process customer data content.

- **Use NAT Gateway for outbound IP masking**: NAT Gateway replaces private source IP addresses and ports with its public IP and translated SNAT ports, hiding internal network topology from external destinations. See [Azure NAT Gateway SNAT](nat-gateway-snat.md).

- **Implement end-to-end encryption for sensitive traffic**: Because NAT Gateway operates at Layer 4, configure TLS/SSL encryption at the application layer for all sensitive outbound communication passing through the gateway.

## Logging and monitoring

Monitor NAT Gateway health and traffic patterns to detect SNAT exhaustion, connectivity failures, and unusual outbound activity.

- **Enable flow logs for outbound traffic auditing (StandardV2)**: Configure NAT Gateway flow logs through diagnostic settings to capture source and destination IPs, translated NAT IPs, packet counts, and dropped packet data. Use flow logs for compliance auditing, forensic analysis, and anomaly detection. See [Monitor NAT gateway with flow logs](monitor-nat-gateway-flow-logs.md).

- **Configure SNAT exhaustion alerts**: Create Azure Monitor alerts when the SNAT Connection Count metric shows failed connections greater than zero. Failed SNAT connections indicate port exhaustion, which causes outbound connectivity failures. See [NAT Gateway metrics and alerts](nat-metrics.md).

- **Monitor datapath availability**: Set up alerts when Datapath Availability drops below 90% over a 15-minute window, which indicates NAT Gateway infrastructure degradation. See [NAT Gateway metrics and alerts](nat-metrics.md).

- **Alert on connection count limits**: Configure alerts when Total SNAT Connection Count approaches 1.6 million (80% of the 2-million maximum) to proactively prevent connectivity degradation. See [NAT Gateway metrics and alerts](nat-metrics.md).

- **Use Network Insights dashboards**: Deploy the pre-configured NAT Gateway Network Insights dashboard in Azure Monitor for a visual overview of metrics, traffic patterns, and health status. See [Monitor NAT gateway](monitor-nat-gateway.md).

- **Configure resource health alerts**: Set up Azure Resource Health alerts to receive notifications when NAT Gateway enters a degraded or unavailable state. See [Resource health for NAT gateway](resource-health.md).

## Compliance and governance

Enforce consistent security configurations across NAT Gateway deployments using policy and governance controls.

- **Audit availability zone configuration with Azure Policy**: Use the built-in policy definition "NAT gateway should be Zone Aligned" to audit or deny NAT Gateway deployments that don't have exactly one entry in their zones array. This policy enforces that a Standard SKU NAT gateway is pinned to a specific availability zone rather than being deployed as a no-zone resource. For zone-redundant outbound connectivity, deploy the StandardV2 SKU (zone-redundant by default) rather than relying on this policy. See [Azure Policy built-in definitions](/azure/governance/policy/samples/built-in-policies) and [Reliability in Azure NAT Gateway](/azure/reliability/reliability-nat-gateway).

- **Monitor resource health history**: Review the 30-day resource health history for NAT Gateway resources to identify patterns of degradation or availability issues that may indicate underlying infrastructure problems. See [Resource health for NAT gateway](resource-health.md).

## Backup and recovery

Azure NAT Gateway is a fully managed service with built-in resilience, but design choices affect availability during zone or region failures.

- **Deploy StandardV2 for zone redundancy**: Use the StandardV2 SKU, which is zone-redundant by default. When an availability zone failure occurs, new connections automatically flow from the remaining healthy zones with no manual intervention. See [Design virtual networks with Azure NAT Gateway](nat-gateway-design.md).

- **Plan for regional failover**: NAT Gateway is a regional resource and does not replicate across regions. For multi-region architectures, deploy separate NAT Gateway instances in each region and use DNS-based or traffic manager failover to redirect workloads. See [Azure NAT Gateway resource](nat-gateway-resource.md).

## Next steps

- [What is Azure NAT Gateway?](nat-overview.md)
- [Design virtual networks with Azure NAT Gateway](nat-gateway-design.md)
- [Azure NAT Gateway SNAT](nat-gateway-snat.md)
- [NAT Gateway metrics and alerts](nat-metrics.md)
- [Azure security baseline for NAT Gateway](/security/benchmark/azure/baselines/virtual-network-nat-security-baseline)
