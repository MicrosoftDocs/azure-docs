---
title: Use Azure Private Link to connect networks to Azure Monitor
description: Set up an Azure Monitor Private Link Scope to securely connect networks to Azure Monitor.
ms.reviewer: mahesh.sundaram
ms.topic: conceptual
ms.date: 07/25/2023
---

# Use Azure Private Link to connect networks to Azure Monitor

With [Azure Private Link](../../private-link/private-link-overview.md), you can securely link Azure platform as a service (PaaS) resources to your virtual network by using private endpoints. Azure Monitor is a constellation of different interconnected services that work together to monitor your workloads. An Azure Monitor private link connects a private endpoint to a set of Azure Monitor resources to define the boundaries of your monitoring network. That set is called an Azure Monitor Private Link Scope (AMPLS).

> [!NOTE]
> Azure Monitor private links are structured differently from private links to other services you might use. Instead of creating multiple private links, one for each resource the virtual network connects to, Azure Monitor uses a single private link connection, from the virtual network to an AMPLS. AMPLS is the set of all Azure Monitor resources to which a virtual network connects through a private link.

## Advantages

With Private Link you can:

- Connect privately to Azure Monitor without opening up any public network access.
- Ensure your monitoring data is only accessed through authorized private networks.
- Prevent data exfiltration from your private networks by defining specific Azure Monitor resources that connect through your private endpoint.
- Securely connect your private on-premises network to Azure Monitor by using Azure ExpressRoute and Private Link.
- Keep all traffic inside the Azure backbone network.

For more information, see [Key benefits of Private Link](../../private-link/private-link-overview.md#key-benefits).

## How it works: Main principles
An Azure Monitor private link connects a private endpoint to a set of Azure Monitor resources made up of Log Analytics workspaces and Application Insights resources. That set is called an Azure Monitor Private Link Scope.

:::image type="content" source="./media/private-link-security/private-link-basic-topology.png" lightbox="./media/private-link-security/private-link-basic-topology.png" alt-text="Diagram that shows basic resource topology.":::

An AMPLS:

* **Uses private IPs**: The private endpoint on your virtual network allows it to reach Azure Monitor endpoints through private IPs from your network's pool, instead of using the public IPs of these endpoints. For this reason, you can keep using your Azure Monitor resources without opening your virtual network to unrequired outbound traffic.
* **Runs on the Azure backbone**: Traffic from the private endpoint to your Azure Monitor resources will go over the Azure backbone and not be routed to public networks.
* **Controls which Azure Monitor resources can be reached**: Configure your AMPLS to your preferred access mode. You can either allow traffic only to Private Link resources or to both Private Link and non-Private-Link resources (resources out of the AMPLS).
* **Controls network access to your Azure Monitor resources**: Configure each of your workspaces or components to accept or block traffic from public networks. You can apply different settings for ingestion and query requests.

## Azure Monitor private links rely on your DNS
When you set up a private link connection, your DNS zones map Azure Monitor endpoints to private IPs to send traffic through the private link. Azure Monitor uses both resource-specific endpoints and shared global/regional endpoints to reach the workspaces and components in your AMPLS.

> [!WARNING]
> Because Azure Monitor uses some shared endpoints (meaning endpoints that aren't resource specific), setting up a private link even for a single resource changes the DNS configuration that affects traffic to *all resources*. In other words, traffic to all workspaces or components is affected by a single private link setup.

The use of shared endpoints also means you should use a single AMPLS for all networks that share the same DNS. Creating multiple AMPLS resources will cause Azure Monitor DNS zones to override each other and break existing environments. To learn more, see [Plan by network topology](./private-link-design.md#plan-by-network-topology).

### Shared global and regional endpoints
When you configure Private Link even for a single resource, traffic to the following endpoints will be sent through the allocated private IPs:

* **All Application Insights endpoints**: Endpoints handling ingestion, live metrics, the Profiler, and the debugger to Application Insights endpoints are global.
* **The query endpoint**: The endpoint handling queries to both Application Insights and Log Analytics resources is global.

> [!IMPORTANT]
> Creating a private link affects traffic to *all* monitoring resources, not only resources in your AMPLS. Effectively, it will cause all query requests and ingestion to Application Insights components to go through private IPs. It doesn't mean the private link validation applies to all these requests.</br>
>
> Resources not added to the AMPLS can only be reached if the AMPLS access mode is Open and the target resource accepts traffic from public networks. When you use the private IP, *private link validations don't apply to resources not in the AMPLS*. To learn more, see [Private Link access modes](#private-link-access-modes-private-only-vs-open).
>
> Private Link settings for Managed Prometheus and ingesting data into your Azure Monitor workspace are configured on the Data Collection Endpoints for the referenced resource. Settings for querying your Azure Monitor workspace over Private Link are made directly on the Azure Monitor workspace and are not handled via AMPLS.

### Resource-specific endpoints
Log Analytics endpoints are workspace specific, except for the query endpoint discussed earlier. As a result, adding a specific Log Analytics workspace to the AMPLS will send ingestion requests to this workspace over the private link. Ingestion to other workspaces will continue to use the public endpoints.

[Data collection endpoints](../essentials/data-collection-endpoint-overview.md) are also resource specific. You can use them to uniquely configure ingestion settings for collecting guest OS telemetry data from your machines (or set of machines) when you use the new [Azure Monitor Agent](../agents/azure-monitor-agent-overview.md) and [data collection rules](../essentials/data-collection-rule-overview.md). Configuring a data collection endpoint for a set of machines doesn't affect ingestion of guest telemetry from other machines that use the new agent.

> [!IMPORTANT]
> Starting December 1, 2021, the private endpoints DNS configuration will use the Endpoint Compression mechanism, which allocates a single private IP address for all workspaces in the same region. It improves the supported scale (up to 300 workspaces and 1,000 components per AMPLS) and reduces the total number of IPs taken from the network's IP pool.

## Private Link access modes: Private Only vs. Open
As discussed in [Azure Monitor private links rely on your DNS](#azure-monitor-private-links-rely-on-your-dns), only a single AMPLS resource should be created for all networks that share the same DNS. As a result, organizations that use a single global or regional DNS have a single private link to manage traffic to all Azure Monitor resources, across all global or regional networks.

For private links created before September 2021, that means:

* Log ingestion works only for resources in the AMPLS. Ingestion to all other resources is denied (across all networks that share the same DNS), regardless of subscription or tenant.
* Queries have a more open behavior that allows query requests to reach even resources not in the AMPLS. The intention here was to avoid breaking customer queries to resources not in the AMPLS and allow resource-centric queries to return the complete result set.

This behavior proved to be too restrictive for some customers because it breaks ingestion to resources not in the AMPLS. But it was too permissive for others because it allows querying resources not in the AMPLS.

Starting September 2021, private links have new mandatory AMPLS settings that explicitly set how they should affect network traffic. When you create a new AMPLS resource, you're now required to select the access modes you want for ingestion and queries separately:

* **Private Only mode**: Allows traffic only to Private Link resources.
* **Open mode**: Uses Private Link to communicate with resources in the AMPLS, but also allows traffic to continue to other resources. To learn more, see [Control how private links apply to your networks](./private-link-design.md#control-how-private-links-apply-to-your-networks).

Although Log Analytics query requests are affected by the AMPLS access mode setting, Log Analytics ingestion requests use resource-specific endpoints and aren't controlled by the AMPLS access mode. To ensure Log Analytics ingestion requests can't access workspaces out of the AMPLS, set the network firewall to block traffic to public endpoints, regardless of the AMPLS access modes.

> [!NOTE]
> If you've configured Log Analytics with Private Link by initially setting the network security group rules to allow outbound traffic by `ServiceTag:AzureMonitor`, the connected VMs send the logs through a public endpoint. Later, if you change the rules to deny outbound traffic by `ServiceTag:AzureMonitor`, the connected VMs keep sending logs until you reboot the VMs or cut the sessions. To make sure the desired configuration takes immediate effect, reboot the connected VMs.
>

## Next steps
- [Design your Azure Private Link setup](private-link-design.md).
- Learn how to [configure your private link](private-link-configure.md).
- Learn about [private storage](private-storage.md) for custom logs and customer-managed keys.
<h3><a id="connect-to-a-private-endpoint"></a></h3>
