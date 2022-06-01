---
title: Use Azure Private Link to connect networks to Azure Monitor
description: Set up an Azure Monitor Private Link Scope to securely connect networks to Azure Monitor.
author: noakup
ms.author: noakuper
ms.topic: conceptual
ms.date: 1/5/2022
---

# Use Azure Private Link to connect networks to Azure Monitor

With [Azure Private Link](../../private-link/private-link-overview.md), you can securely link Azure platform as a service (PaaS) resources to your virtual network by using private endpoints. Azure Monitor is a constellation of different interconnected services that work together to monitor your workloads. An Azure Monitor Private Link connects a private endpoint to a set of Azure Monitor resources, defining the boundaries of your monitoring network. That set is called an Azure Monitor Private Link Scope (AMPLS).

> [!NOTE]
> Azure Monitor Private Links are structured differently from Private Links to other services you may use. Instead of creating multiple Private Links, one for each resource the VNet connects to, Azure Monitor uses a single Private Link connection, from the VNet to an Azure Monitor Private Link Scope (AMPLS). AMPLS is the set of all Azure Monitor resources to which VNet connects through a Private Link.


## Advantages

With Private Link you can:

- Connect privately to Azure Monitor without opening up any public network access
- Ensure your monitoring data is only accessed through authorized private networks
- Prevent data exfiltration from your private networks by defining specific Azure Monitor resources that connect through your private endpoint
- Securely connect your private on-premises network to Azure Monitor using ExpressRoute and Private Link
- Keep all traffic inside the Microsoft Azure backbone network

For more information, see  [Key Benefits of Private Link](../../private-link/private-link-overview.md#key-benefits).

## How it works: main principles
An Azure Monitor Private Link connects a Private Endpoint to a set of Azure Monitor resources - Log Analytics workspaces and Application Insights resources. That set is called an Azure Monitor Private Link Scope (AMPLS).

![Diagram of basic resource topology](./media/private-link-security/private-link-basic-topology.png)

* Using Private IPs - the Private Endpoint on your VNet allows it to reach Azure Monitor endpoints through private IPs from your network's pool, instead of using to the public IPs of these endpoints. That allows you to keep using your Azure Monitor resources without opening your VNet to unrequired outbound traffic. 
* Running on the Azure backbone - traffic from the Private Endpoint to your Azure Monitor resources will go over the Microsoft Azure backbone, and not routed to public networks.
* Control which Azure Monitor resources can be reached - configure your Azure Monitor Private Link Scope to your preferred access mode - either allowing traffic only to Private Link resources, or to both Private Link and non-Private-Link resources (resources out of the AMPLS).
* Control networks access to your Azure Monitor resources - configure each of your workspaces or components to accept or block traffic from public networks. You can apply different settings for ingestion and query requests.


## Azure Monitor Private Links rely on your DNS
When you set up a Private Link connection, your DNS zones map Azure Monitor endpoints to private IPs in order to send traffic through the Private Link. Azure Monitor uses both resource-specific endpoints and shared global / regional endpoints to reach the workspaces and components in your AMPLS. 

> [!WARNING]
> Because Azure Monitor uses some shared endpoints (meaning endpoints that are not resource-specific),  setting up a Private Link even for a single resource changes the DNS configuration affecting traffic to **all resources**. In other words, traffic to all workspaces or components are affected by a single Private Link setup. Read the below for more details.

The use of shared endpoints also means you should use a single AMPLS for all networks that share the same DNS. Creating multiple AMPLS resources will cause Azure Monitor DNS zones to override each other, and break existing environments. See [Plan by network topology](./private-link-design.md#plan-by-network-topology) to learn more.


### Shared global and regional endpoints
When configuring Private Link even for a single resource, traffic to the below endpoints will be sent through the allocated Private IPs.

* All Application Insights endpoints - endpoints handling ingestion, live metrics, profiler, debugger etc. to Application Insights endpoints are global.
* The Query endpoint - the endpoint handling queries to both Application Insights and Log Analytics resources is global.


> [!IMPORTANT]
> Creating a Private Link affects traffic to **all** monitoring resources, not only resources in your AMPLS. Effectively, it will cause all query requests as well as ingestion to Application Insights components to go through private IPs. However, it does not mean the Private Link validation applies to all these requests.</br>
> Resources not added to the AMPLS can only be reached if the AMPLS access mode is 'Open' and the target resource accepts traffic from public networks. While using the private IP, **Private Link validations don't apply to resources not in the AMPLS**. See [Private Link access modes](#private-link-access-modes-private-only-vs-open) to learn more.

### Resource-specific endpoints
Log Analytics endpoints are workspace-specific, except for the query endpoint discussed earlier. As a result, adding a specific Log Analytics workspace to the AMPLS will send ingestion requests to this workspace over the Private Link, while ingestion to other workspaces will continue to use the public endpoints.

[Data Collection Endpoints](../essentials/data-collection-endpoint-overview.md) are also resource-specific, and allow you to uniquely configure ingestion settings for collecting guest OS telemetry data from your machines (or set of machines) when using the new [Azure Monitor agent](../agents/azure-monitor-agent-overview.md) and [Data Collection Rules](../essentials/data-collection-rule-overview.md). Configuring a data collection endpoint for a set of machines does not affect ingestion of guest telemetry from other machines using the new agent.

> [!IMPORTANT]
> Starting December 1, 2021, the Private Endpoints DNS configuration will use the Endpoint Compression mechanism, which allocates a single private IP address for all workspaces in the same region. This improves the supported scale (up to 300 workspaces and 1000 components per AMPLS) and  reduces the total number of IPs taken from the network's IP pool.  


## Private Link access modes: Private Only vs Open
As discussed in [Azure Monitor Private Link relies on your DNS](#azure-monitor-private-links-rely-on-your-dns), only a single AMPLS resource should be created for all networks that share the same DNS. As a result, organizations that use a single global or regional DNS in fact have a single Private Link to manage traffic to all Azure Monitor resources, across all global, or regional networks.

For Private Links created before September 2021, that means - 
* Log ingestion works only for resources in the AMPLS. Ingestion to all other resources is denied (across all networks that share the same DNS), regardless of subscription or tenant.
* Queries have a more open behavior, allowing query requests to reach even resources not in the AMPLS. The intention here was to avoid breaking customer queries to resources not in the AMPLS, and allow resource-centric queries to return the complete result set.

However, this behavior proved to be too restrictive for some customers (since it breaks ingestion to resources not in the AMPLS) and too permissive for others (since it allows querying resources not in the AMPLS).

Therefore, Private Links created starting September 2021 have new mandatory AMPLS settings, that explicitly set how Private Links should affect network traffic. When creating a new AMPLS resource, you're now required to select the desired access modes, for ingestion and queries separately. 
* Private Only mode - allows traffic only to Private Link resources
* Open mode - uses Private Link to communicate with resources in the AMPLS, but also allows traffic to continue to other resources as well. See [Control how Private Links apply to your networks](./private-link-design.md#control-how-private-links-apply-to-your-networks) to learn more.

> [!NOTE]
> While Log Analytics query requests are affected by the AMPLS access mode setting, Log Analytics ingestion requests use resource-specific endpoints, and are therefore not controlled by the AMPLS access mode. **To assure Log Analytics ingestion requests can’t access workspaces out of the AMPLS, set the network firewall to block traffic to public endpoints, regardless of the AMPLS access modes**.

> [!NOTE]
>  If you have configured Log Analytics with Private Link by initially setting the NSG rules to allow outbound traffic by ServiceTag:AzureMonitor, then the connected VMs would send the logs through Public endpoint. Later, if you change the rules to deny outbound traffic by ServiceTag:AzureMonitor, still the connected VMs would keep sending logs until you reboot the VMs or cut the sessions. In order to make sure the desired configuration take immediate effect, the recommendation is to reboot the connected VMs.
> 
## Next steps
- [Design your Private Link setup](private-link-design.md)
- Learn how to [configure your Private Link](private-link-configure.md)
- Learn about [private storage](private-storage.md) for Custom Logs and Customer managed keys (CMK)
<h3><a id="connect-to-a-private-endpoint"></a></h3>
