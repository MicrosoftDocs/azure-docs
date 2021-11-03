---
title: Use Azure Private Link to connect networks to Azure Monitor
description: Set up an Azure Monitor Private Link Scope to securely connect networks to Azure Monitor.
author: noakup
ms.author: noakuper
ms.topic: conceptual
ms.date: 10/05/2020
---

# Use Azure Private Link to connect networks to Azure Monitor

With [Azure Private Link](../../private-link/private-link-overview.md), you can securely link Azure platform as a service (PaaS) resources to your virtual network by using private endpoints. Azure Monitor is a constellation of different interconnected services that work together to monitor your workloads. An Azure Monitor Private Link connects a private endpoint to a set of Azure Monitor resources, defining the boundaries of your monitoring network. That set is called an Azure Monitor Private Link Scope (AMPLS).


## Advantages

With Private Link you can:

- Connect privately to Azure Monitor without opening up any public network access
- Ensure your monitoring data is only accessed through authorized private networks
- Prevent data exfiltration from your private networks by defining specific Azure Monitor resources that connect through your private endpoint
- Securely connect your private on-premises network to Azure Monitor using ExpressRoute and Private Link
- Keep all traffic inside the Microsoft Azure backbone network

For more information, see  [Key Benefits of Private Link](../../private-link/private-link-overview.md#key-benefits).

## How it works

### Overview
An Azure Monitor Private Link Scope connects private endpoints (and the VNets they're contained in) to one or more Azure Monitor resources - Log Analytics workspaces and Application Insights components.

![Diagram of basic resource topology](./media/private-link-security/private-link-basic-topology.png)

* An Azure Monitor Private Link connects a Private Endpoint to a set of Azure Monitor resources - Log Analytics workspaces and Application Insights resources. That set is called an Azure Monitor Private Link Scope (AMPLS).
* The Private Endpoint on your VNet allows it to reach Azure Monitor endpoints through private IPs from your network's pool, instead of using to the public IPs of these endpoints. That allows you to keep using your Azure Monitor resources without opening your VNet to unrequired outbound traffic. 
* Traffic from the Private Endpoint to your Azure Monitor resources will go over the Microsoft Azure backbone, and not routed to public networks.
* You can configure your Azure Monitor Private Link Scope (or specific networks connecting to it) to use the preferred access mode - either allow traffic only to Private Link resources, or allow traffic to both Private Link resources and non-Private-Link resources (resources out of the AMPLS)
* You can configure each of your workspaces or components to allow or deny ingestion and queries from public networks. That provides a resource-level protection, so that you can control traffic to specific resources.

> [!NOTE]
> A VNet can only connect to a single AMPLS, which lists up to 50 resources that can be reached over a Private Link.

### Azure Monitor Private Link relies on your DNS
When you set up a Private Link connection, your DNS zones are set to map Azure Monitor endpoints to private IPs in order to send traffic through the Private Link. Azure Monitor uses both resource-specific endpoints and regional or global endpoints that handle traffic to multiple workspaces/components. When it comes to regional and global endpoints, setting up a Private Link (even for a single resource) affects the DNS mapping that controls traffic to **all** resources. In other words, traffic to all workspaces or components could be affected by a single Private Link setup.

#### Global endpoints
Most importantly, traffic to the below global endpoints will be sent through the Private Link:
* All Application Insights endpoints - endpoints handling ingestion, live metrics, profiler, debugger etc. to Application Insights endpoints are global.
* The Query endpoint - the endpoint handling queries to both Application Insights and Log Analytics resources is global.

That effectively means that all Application Insights traffic will be sent to the Private Link, and that all queries - to both Application Insights and Log Analytics resources - will be sent to the Private Link.

Traffic to Application Insights resource not added to your AMPLS will not pass the Private Link validation, and will fail.

#### Resource-specific endpoints
All Log Analytics endpoints except the Query endpoint, are workspace-specific. So, creating a Private Link to a specific Log Analytics workspace won't affect ingestion to other workspaces, which will continue to use the public endpoints.


> [!NOTE]
> Create only a single AMPLS for all networks that share the same DNS. Creating multiple AMPLS resources will cause Azure Monitor DNS zones to override each other, and break existing environments.

### Private Link access modes: Private Only vs Open
As discussed in [Azure Monitor Private Link relies on your DNS](#azure-monitor-private-link-relies-on-your-dns), only a single AMPLS resource should be created for all networks that share the same DNS. As a result, organizations that use a single global or regional DNS in fact have a single Private Link to manage traffic to all Azure Monitor resources, across all global, or regional networks.

For Private Links created before September 2021, that means - 
* Log ingestion works only for resources in the AMPLS. Ingestion to all other resources is denied (across all networks that share the same DNS), regardless of subscription or tenant.
* Queries have a more open behavior, allowing query requests to reach even resources not in the AMPLS. The intention here was to avoid breaking customer queries to resources not in the AMPLS, and allow resource-centric queries to return the complete result set.

However, this behavior proved to be too restrictive for some customers (since it breaks ingestion to resources not in the AMPLS), too permissive for others (since it allows querying resources not in the AMPLS) and generally confusing.

Therefore, Private Links created starting September 2021 have new mandatory AMPLS settings, that explicitly set how Private Links should affect network traffic. When creating a new AMPLS resource, you're now required to select the desired access modes, for ingestion and queries separately. 
* Private Only mode - allows traffic only to Private Link resources
* Open mode - uses Private Link to communicate with resources in the AMPLS, but also allows traffic to continue to other resources as well. See [Control how Private Links apply to your networks](./private-link-design.md#control-how-private-links-apply-to-your-networks) to learn more.

> [!NOTE]
> Log Analytics ingestion uses resource-specific endpoints. As such, it doesn’t adhere to AMPLS access modes. **To assure Log Analytics ingestion requests can’t access workspaces out of the AMPLS, set the network firewall to block traffic to public endpoints, regardless of the AMPLS access modes**.

## Next steps
- [Design your Private Link setup](private-link-design.md)
- Learn how to [configure your Private Link](private-link-configure.md)
- Learn about [private storage](private-storage.md) for Custom Logs and Customer managed keys (CMK)
<h3><a id="connect-to-a-private-endpoint"></a></h3>
