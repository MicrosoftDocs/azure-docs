---
title: Secure your Azure Traffic Manager deployment
description: Learn how to secure Azure Traffic Manager, with best practices for protecting your deployment.
author: msmbaldwin
ms.author: mbaldwin
ms.service: azure-traffic-manager
ms.topic: best-practice
ms.custom: horz-security
ms.date: 05/12/2026
ai-usage: ai-assisted
---

# Secure your Azure Traffic Manager deployment

Azure Traffic Manager is a DNS-based traffic load balancer that distributes traffic across global Azure regions, providing high availability and responsive performance for your applications. Because Traffic Manager controls how clients are routed to your service endpoints, securing your Traffic Manager configuration is essential to prevent misrouting, unauthorized changes, and monitoring gaps that could affect application availability.

This article provides security recommendations for Azure Traffic Manager. For an overview of Azure's network security services and how they work together, see [What is Azure network security?](../networking/security/network-security.md).

[!INCLUDE [Security horizontal Zero Trust statement](~/reusable-content/ce-skilling/azure/includes/security/zero-trust-security-horizontal.md)]

## Network security

Network security for Traffic Manager focuses on ensuring that health probes can reach your endpoints and that your DNS-based routing configuration prevents unintended traffic patterns. Because Traffic Manager operates at the DNS layer rather than as a proxy, network security centers on probe access and endpoint configuration.

- **Allow Traffic Manager health probe traffic through firewalls**: For Azure-hosted endpoints, configure network security groups (NSGs) or Azure Firewall rules to permit inbound traffic from Traffic Manager health probes using the `AzureTrafficManager` service tag. For non-Azure endpoints, allowlist the published Traffic Manager probe IP ranges in the endpoint's firewall. If probes are blocked, Traffic Manager marks endpoints as unhealthy and routes traffic away from otherwise healthy services, causing unexpected outages. See [Traffic Manager endpoint monitoring](traffic-manager-monitoring.md#configure-endpoint-monitoring).

- **Configure endpoint health monitoring over HTTPS**: Select HTTPS as the monitoring protocol for your Traffic Manager profile endpoints instead of HTTP or TCP. Use HTTPS probes to verify endpoints accept HTTPS connections; note that probes don't validate certificate validity. See [Traffic Manager endpoint monitoring](traffic-manager-monitoring.md).

- **Use nested profiles for per-endpoint monitoring settings**: Apply different monitoring configurations to individual endpoints by using nested Traffic Manager profiles. A single profile shares monitoring settings across all endpoints, but nesting lets you customize probe paths, intervals, and failure thresholds for each endpoint based on its specific requirements. See [Nested Traffic Manager profiles](traffic-manager-nested-profiles.md#example-5-per-endpoint-monitoring-settings).

- **Set appropriate MinChildEndpoints values in nested profiles**: Configure the `MinChildEndpoints` threshold in nested profiles to control when a child profile is considered healthy. Setting this value too low might route traffic to a degraded region with insufficient capacity. See [Nested Traffic Manager profiles](traffic-manager-nested-profiles.md).

- **Use geographic routing for data sovereignty requirements**: Apply the geographic routing method to direct users to endpoints in specific regions when data residency regulations require traffic to stay within certain boundaries. Combine geographic routing with nested profiles to provide failover within the allowed geographic region. See [Traffic Manager routing methods](traffic-manager-routing-methods.md#geographic-traffic-routing-method).

- **Configure a fallback endpoint for subnet routing**: When using subnet routing to map IP address ranges to specific endpoints, define a fallback endpoint to handle requests from unmapped IP addresses. Without a fallback, Traffic Manager returns no answer (NODATA or NXDOMAIN depending on the query) for unmatched client addresses. See [Traffic Manager routing methods](traffic-manager-routing-methods.md#subnet-traffic-routing-method).

## Identity and access management

Identity and access management for Traffic Manager ensures that only authorized users can modify your DNS routing configuration. Unauthorized changes to Traffic Manager profiles can redirect traffic to attacker-controlled endpoints or cause service disruptions.

- **Assign least-privilege RBAC roles for Traffic Manager management**: Grant the **Traffic Manager Contributor** role to users who manage Traffic Manager profiles and endpoints, and use **Reader** for view-only access. Separate read-only monitoring access from profile modification permissions to limit the blast radius of compromised accounts. See [Traffic Manager Contributor](/azure/role-based-access-control/built-in-roles/networking#traffic-manager-contributor).

- **Grant cross-subscription endpoint access with RBAC**: When adding endpoints from different Azure subscriptions to a Traffic Manager profile, grant the operator configuring the profile read access to the target endpoint resources. Without proper cross-subscription permissions for that user or service principal, endpoint additions fail. See [Traffic Manager endpoints](traffic-manager-endpoint-types.md#azure-endpoints).

- **Apply resource locks to prevent accidental deletion**: Place `CanNotDelete` resource locks on production Traffic Manager profiles to prevent accidental removal. Deleting a Traffic Manager profile immediately stops DNS-based routing for all associated endpoints, which can cause a full service outage. See [Lock your resources to protect your infrastructure](../azure-resource-manager/management/lock-resources.md).

## Data protection

Data protection for Traffic Manager covers the privacy of DNS query data and any telemetry features that collect client information. Because Traffic Manager processes DNS queries from end users, understanding what data is collected and how to control it helps you meet privacy requirements.

- **Understand RUM key exposure scope**: If you use Real User Measurements (RUM), recognize that the measurement key embedded in client-side JavaScript is visible to end users but is separate from your Azure subscription credentials. A leaked RUM key cannot be used to access or modify your Azure resources. If a key is misused to generate fraudulent measurements, regenerate the key to invalidate the old one. See [Real User Measurements in Traffic Manager](traffic-manager-rum-overview.md).

- **Remove Real User Measurements JavaScript when no longer needed**: Disable RUM data collection by removing the measurement JavaScript from your web pages when you no longer need latency-based routing optimization. Leaving the script active continues to send measurement data to Traffic Manager and incurs charges for each reported measurement. See [Real User Measurements in Traffic Manager](traffic-manager-rum-overview.md).

- **Review Traffic View data retention and privacy**: If you enable Traffic View, be aware that it uses the DNS resolver IP address, not EDNS Client Subnet information, to create the data set that shows where users are connecting from. Traffic View data is aggregated at the DNS resolver level, not at individual user level, and is updated approximately every 48 hours. See [Traffic View in Traffic Manager](traffic-manager-traffic-view-overview.md).

## Logging and monitoring

Logging and monitoring for Traffic Manager provides visibility into endpoint health, DNS query patterns, and routing behavior. Proactive monitoring helps you detect misconfigurations, endpoint failures, and unexpected traffic shifts before they affect end users.

- **Enable diagnostic logging for probe health results**: Configure diagnostic settings on your Traffic Manager profile to capture probe health result logs. Send these logs to a Log Analytics workspace, Azure Storage, or an event hub for analysis and long-term retention. Probe logs record endpoint health state changes that help you investigate past outages. See [Traffic Manager diagnostic logs](traffic-manager-diagnostic-logs.md).

- **Configure alerts on endpoint health status metrics**: Create Azure Monitor alerts on the **Endpoint status by endpoint** metric to detect when endpoints become unhealthy. Set the alert threshold so that the average status drops below 0.5, which indicates that more than half of the health probes are failing. Multiple probes from different locations check each endpoint, so a single probe failure doesn't necessarily indicate an outage. See [Traffic Manager metrics and alerts](traffic-manager-metrics-alerts.md).

- **Monitor DNS query volume per endpoint**: Track the **Queries by endpoint returned** metric to identify unexpected shifts in traffic distribution that could indicate a routing misconfiguration or endpoint failure. A sudden increase in queries to a secondary endpoint might signal that the primary endpoint is degraded. See [Traffic Manager metrics and alerts](traffic-manager-metrics-alerts.md).

- **Investigate degraded profile status promptly**: When your Traffic Manager profile status shows **Degraded**, one or more endpoints are unhealthy. Investigate immediately because degraded status means Traffic Manager might be routing traffic to remaining healthy endpoints, which could become overloaded. See [Troubleshoot Azure Traffic Manager degraded status](/troubleshoot/azure/traffic-manager/troubleshoot-traffic-manager-degraded-status).

## Compliance and governance

Compliance and governance for Traffic Manager helps you enforce organizational standards across your DNS routing infrastructure. Consistent policy enforcement prevents configuration drift that could introduce security gaps.

- **Use Azure Policy to audit Traffic Manager configurations**: Assign built-in Azure Policy definitions to audit and enforce security standards across your Traffic Manager profiles, such as requiring diagnostic logging to be enabled. Policy assignments provide continuous compliance visibility and can flag profiles that don't meet your security baseline. See [Azure Policy built-in definitions](/azure/governance/policy/samples/built-in-policies).

- **Validate endpoint health monitoring configuration across profiles**: Regularly audit all Traffic Manager profiles to confirm that health monitoring is configured with HTTPS protocol, appropriate probe intervals, and correct probe paths. Inconsistent monitoring settings across profiles can lead to delayed failover or false-positive health checks. See [Traffic Manager endpoint monitoring](traffic-manager-monitoring.md#configure-endpoint-monitoring).

## Backup and recovery

Backup and recovery for Traffic Manager ensures that your DNS-based routing remains functional during regional outages and service disruptions. Because Traffic Manager itself is a globally available service, recovery planning focuses on endpoint redundancy and profile resilience.

- **Configure multiple endpoints across regions for failover**: Add endpoints in at least two Azure regions to each Traffic Manager profile so that traffic automatically routes to a healthy region when one region experiences an outage. Use the priority routing method to define a clear failover order. See [Traffic Manager routing methods](traffic-manager-routing-methods.md#priority-traffic-routing-method).

- **Use nested profiles for granular regional failover**: Combine an outer profile using priority or performance routing with inner profiles that use weighted or performance routing within each region. This structure provides both cross-region failover and in-region load distribution, improving resilience against partial regional failures. See [Nested Traffic Manager profiles](traffic-manager-nested-profiles.md).

- **Set DNS TTL values appropriate for your failover requirements**: Configure the DNS time-to-live (TTL) value to balance failover speed against DNS query volume. A lower TTL (such as 30 seconds) enables faster failover but increases DNS query traffic and cost, while a higher TTL reduces queries but delays client redirection away from failed endpoints. See [Traffic Manager FAQs](traffic-manager-FAQs.md).

- **Test failover behavior regularly**: Periodically disable endpoints in your Traffic Manager profile to verify that failover routing works as expected and that monitoring alerts fire correctly. Untested failover configurations might not behave as designed during a real outage. See [Traffic Manager endpoints](traffic-manager-endpoint-types.md#enabling-and-disabling-endpoints).

## Next steps

- [Traffic Manager overview](traffic-manager-overview.md)
- [How Traffic Manager works](traffic-manager-how-it-works.md)
- [Microsoft cloud security benchmark](/security/benchmark/azure/introduction)
- [Secure your Azure Front Door deployment](../frontdoor/secure-front-door.md)
- [Secure your Azure DNS deployment](../dns/secure-dns.md)
