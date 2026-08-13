---
title: Secure your Azure Traffic Manager deployment
description: Learn how to secure Azure Traffic Manager by protecting routing configuration, endpoint monitoring, access, telemetry, and failover.
author: msmbaldwin
ms.author: mbaldwin
ms.service: azure-traffic-manager
ms.topic: best-practice
ms.custom: horz-security
ms.date: 07/23/2026
ai-usage: ai-assisted
---

# Secure your Azure Traffic Manager deployment

Azure Traffic Manager is a DNS-based traffic load balancer that distributes traffic across global Azure regions, providing high availability and responsive performance for your applications. Because Traffic Manager controls how clients are routed to your service endpoints, securing your Traffic Manager configuration is essential to prevent misrouting, unauthorized changes, and monitoring gaps that could affect application availability.

This article provides security recommendations for Azure Traffic Manager. For an overview of Azure's network security services and how they work together, see [What is Azure network security?](../networking/security/network-security.md)

[!INCLUDE [Security horizontal Zero Trust statement](~/reusable-content/ce-skilling/azure/includes/security/zero-trust-security-horizontal.md)]

## Network security

Network security for Traffic Manager focuses on ensuring that health probes can reach your endpoints and that your DNS-based routing configuration prevents unintended traffic patterns. Because Traffic Manager operates at the DNS layer rather than as a proxy, network security focuses on probe access and endpoint configuration.

- **Allow Traffic Manager health probe traffic through firewalls**: For Azure-hosted endpoints, configure network security groups (NSGs) or Azure Firewall rules to permit inbound traffic from Traffic Manager health probes by using the `AzureTrafficManager` service tag. For non-Azure endpoints, add the published Traffic Manager probe IP ranges to the allow list in the endpoint's firewall. If probes are blocked, Traffic Manager marks endpoints as unhealthy and routes traffic away from otherwise healthy services, causing unexpected outages. For more information, see [Traffic Manager endpoint monitoring](traffic-manager-monitoring.md#firewall-setup-for-health-checks).

- **Configure endpoint health monitoring over HTTPS for web endpoints**: Select HTTPS as the monitoring protocol for web endpoints in your Traffic Manager profile instead of HTTP. Use HTTPS probes to verify endpoints accept HTTPS connections. Probes don't validate certificate validity. For more information, see [Traffic Manager endpoint monitoring](traffic-manager-monitoring.md).

- **Require TLS 1.2 or later for services that interact with Traffic Manager**: Verify that endpoints and other resources that interact with Traffic Manager support TLS 1.2 or later. Traffic Manager support for TLS 1.0 and 1.1 ended on February 28, 2025, and older TLS dependencies can cause service disruptions. For more information, see [Traffic Manager FAQ](traffic-manager-FAQs.md#what-version-of-tls-is-required-by-traffic-manager).

- **Use nested profiles for per-endpoint monitoring settings**: Apply different monitoring configurations to individual endpoints by using nested Traffic Manager profiles. A single profile shares monitoring settings across all endpoints, but nesting helps you customize probe paths, intervals, and failure thresholds for each endpoint based on its specific requirements. For more information, see [Nested Traffic Manager profiles](traffic-manager-nested-profiles.md#example-5-per-endpoint-monitoring-settings).

- **Set appropriate `MinChildEndpoints` values in nested profiles**: Configure the `MinChildEndpoints` threshold in nested profiles to control when Traffic Manager considers a child profile healthy. Setting this value too low might route traffic to a degraded region with insufficient capacity. For more information, see [Nested Traffic Manager profiles](traffic-manager-nested-profiles.md).

- **Use geographic routing for data sovereignty requirements**: Apply the geographic routing method to direct DNS queries from mapped regions to specific endpoints when data residency regulations require regional routing boundaries. Because Traffic Manager infers location from the DNS query source IP, typically the local DNS resolver, account for resolver-location limitations in compliance designs. Combine geographic routing with nested profiles to provide failover within the allowed geographic region. For more information, see [Traffic Manager routing methods](traffic-manager-routing-methods.md#geographic-traffic-routing-method).

- **Configure a fallback endpoint for subnet routing**: When using subnet routing to map source IP address ranges to specific endpoints, define a fallback endpoint with no address range to handle requests from unmapped IP addresses. Without a fallback, Traffic Manager returns a NODATA response for unmatched source addresses. For more information, see [Traffic Manager routing methods](traffic-manager-routing-methods.md#subnet-traffic-routing-method).

## Identity and access management

Identity and access management for Traffic Manager ensures that only authorized users can modify your DNS routing configuration. Unauthorized changes to Traffic Manager profiles can redirect traffic to attacker-controlled endpoints or cause service disruptions.

- **Assign least-privilege RBAC roles for Traffic Manager management**: Grant the **Traffic Manager Contributor** role to users who manage Traffic Manager profiles and endpoints, and use **Reader** for view-only access. Separate read-only monitoring access from profile modification permissions to limit the impact of compromised accounts. For more information, see [Traffic Manager Contributor](/azure/role-based-access-control/built-in-roles/networking#traffic-manager-contributor).

- **Grant cross-subscription endpoint access with RBAC**: For endpoint types that support cross-subscription configuration, grant the operator configuring the profile read access to the target endpoint resources. Azure Web Apps don't support endpoints from multiple subscriptions when the same custom domain name is used. Without proper cross-subscription permissions for the supported endpoint types, endpoint additions fail. For more information, see [Traffic Manager FAQ](traffic-manager-FAQs.md#can-i-use-traffic-manager-with-endpoints-from-multiple-subscriptions).

- **Apply resource locks to prevent accidental deletion**: Place `CanNotDelete` resource locks on production Traffic Manager profiles to prevent accidental removal. Deleting a Traffic Manager profile immediately stops DNS-based routing for all associated endpoints, which can cause a full service outage. For more information, see [Lock your resources to protect your infrastructure](../azure-resource-manager/management/lock-resources.md).

## Data protection

Data protection for Traffic Manager covers the privacy of DNS query data and any telemetry features that collect client information. Because Traffic Manager processes DNS queries on behalf of end users, typically from recursive DNS resolvers, understanding what data is collected and how to control it helps you meet privacy requirements.

- **Understand RUM key exposure scope**: If you use Real User Measurements (RUM), recognize that the measurement key embedded in client-side JavaScript is visible to end users but is separate from your Azure subscription credentials. You can't use a leaked RUM key to access or modify your Azure resources. If a key is misused to generate fraudulent measurements, regenerate the key to invalidate the old one. For more information, see [Traffic Manager FAQ](traffic-manager-FAQs.md#can-others-abuse-my-rum-key).

- **Remove Real User Measurements JavaScript when no longer needed**: Disable RUM data collection by removing the measurement JavaScript from your web pages when you no longer need latency-based routing optimization. Leaving the script active continues to send measurement data to Traffic Manager and incurs charges for each reported measurement. For more information, see [Traffic Manager FAQ](traffic-manager-FAQs.md#how-do-i-turn-off-real-user-measurements-for-my-subscription).

- **Review Traffic View data retention and privacy**: If you enable Traffic View, be aware that it uses the DNS resolver IP address, not EDNS Client Subnet information, to create the data set that shows where users are connecting from. Traffic View data is aggregated at the DNS resolver level, not at individual user level, and is updated approximately every 48 hours. For more information, see [Traffic View in Traffic Manager](traffic-manager-traffic-view-overview.md).

## Logging and monitoring

Logging and monitoring for Traffic Manager provide visibility into endpoint health, DNS query patterns, and routing behavior. Proactive monitoring helps you detect misconfigurations, endpoint failures, and unexpected traffic shifts before they affect end users.

- **Enable diagnostic logging for probe health results**: Configure diagnostic settings on your Traffic Manager profile to capture probe health result logs. Send these logs to a Log Analytics workspace, Azure Storage, or an event hub for analysis and long-term retention. Probe logs record endpoint health state changes that help you investigate past outages. For more information, see [Traffic Manager diagnostic logs](traffic-manager-diagnostic-logs.md).

- **Configure alerts on endpoint health status metrics**: Create Azure Monitor alerts on the **Endpoint Status by Endpoint** metric to detect when endpoints become unhealthy. Set the alert threshold so that the average status drops below 0.5, which indicates that more than half of the health probes are failing. Multiple probes from different locations check each endpoint, so a single probe failure doesn't necessarily indicate an outage. For more information, see [Traffic Manager metrics and alerts](traffic-manager-metrics-alerts.md).

- **Monitor DNS query volume per endpoint**: Track the **Queries by Endpoint Returned** metric to identify unexpected shifts in traffic distribution that could indicate a routing misconfiguration or endpoint failure. A sudden increase in queries to a secondary endpoint might signal that the primary endpoint is degraded. For more information, see [Traffic Manager metrics and alerts](traffic-manager-metrics-alerts.md).

- **Investigate degraded profile status promptly**: When your Traffic Manager profile status shows **Degraded**, one or more endpoints are unhealthy. Investigate immediately because degraded status means Traffic Manager might be routing traffic to remaining healthy endpoints, which could become overloaded. For more information, see [Troubleshoot Azure Traffic Manager degraded status](/troubleshoot/azure/traffic-manager/troubleshoot-traffic-manager-degraded-status).

## Compliance and governance

Compliance and governance for Traffic Manager help you enforce organizational standards across your DNS routing infrastructure. Consistent policy enforcement prevents configuration drift that could introduce security gaps.

- **Use Azure Policy to audit Traffic Manager configurations**: Assign built-in Azure Policy definitions to enforce diagnostic logging across your Traffic Manager profiles. The three built-in definitions for Traffic Manager - **Enable logging by category group for Traffic Manager profiles to Log Analytics**, **to Event Hub**, and **to Storage** - automatically deploy diagnostic settings that capture probe health results and DNS query data. Policy assignments provide continuous compliance visibility and flag profiles that don't meet your security baseline. For more information, see [Azure Policy built-in definitions](/azure/governance/policy/samples/built-in-policies).

- **Validate endpoint health monitoring configuration across profiles**: Regularly audit all Traffic Manager profiles to confirm that health monitoring uses the appropriate protocol (HTTPS for web endpoints when possible), appropriate probe intervals, and correct probe paths. Inconsistent monitoring settings across profiles can lead to delayed failover or false-positive health checks. For more information, see [Traffic Manager endpoint monitoring](traffic-manager-monitoring.md#configure-endpoint-monitoring).

## Backup and recovery

Backup and recovery for Traffic Manager ensure that your DNS-based routing remains functional during regional outages and service disruptions. Because Traffic Manager itself is a globally available service, recovery planning focuses on endpoint redundancy and profile resilience.

- **Configure multiple endpoints across regions for failover**: Add endpoints in at least two Azure regions to each Traffic Manager profile so that traffic automatically routes to a healthy region when one region experiences an outage. Use the priority routing method to define a clear failover order. For more information, see [Traffic Manager routing methods](traffic-manager-routing-methods.md#priority-traffic-routing-method).

- **Use nested profiles for granular regional failover**: Combine an outer profile using priority or performance routing with inner profiles that use weighted or performance routing within each region. This structure provides both cross-region failover and in-region load distribution, improving resilience against partial regional failures. For more information, see [Nested Traffic Manager profiles](traffic-manager-nested-profiles.md).

- **Set DNS TTL values appropriate for your failover requirements**: Configure the DNS time-to-live (TTL) value to balance failover speed against DNS query volume. A lower TTL (such as 30 seconds) enables faster failover but increases DNS query traffic and cost, while a higher TTL reduces queries but delays client redirection away from failed endpoints. For more information, see [Traffic Manager FAQs](traffic-manager-FAQs.md).

- **Test failover behavior regularly**: Periodically disable endpoints in your Traffic Manager profile to verify that failover routing works as expected and that monitoring alerts fire correctly. Untested failover configurations might not behave as designed during a real outage. For more information, see [Traffic Manager endpoints](traffic-manager-endpoint-types.md#enabling-and-disabling-endpoints).

## Next steps

- [Traffic Manager overview](traffic-manager-overview.md)
- [How Traffic Manager works](traffic-manager-how-it-works.md)
- [Microsoft cloud security benchmark](/security/benchmark/azure/introduction)
- [Secure your Azure Front Door deployment](../frontdoor/secure-front-door.md)
- [Secure your Azure DNS deployment](../dns/secure-dns.md)
- [Azure network security best practices](../security/fundamentals/network-best-practices.md)
