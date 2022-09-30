---
title: Design your Private Link setup
description: Design your Private Link setup
author: noakup
ms.author: noakuper
ms.topic: conceptual
ms.date: 1/5/2022
---

# Design your Private Link setup

Before you set up your Azure Monitor Private Link, consider your network topology, and specifically your DNS routing topology.

As discussed in the [Azure Monitor Private Link overview article](private-link-security.md), setting up a Private Link affects traffic to all Azure Monitor resources. That's especially true for Application Insights resources. Additionally, it affects not only the network connected to the Private Endpoint but also all other networks sharing the same DNS.

The simplest and most secure approach would be:
1. Create a single Private Link connection, with a single Private Endpoint and a single AMPLS. If your networks are peered, create the Private Link connection on the shared (or hub) VNet.
2. Add *all* Azure Monitor resources (Application Insights components, Log Analytics workspaces and [Data Collection endpoints](../essentials/data-collection-endpoint-overview.md)) to that AMPLS.
3. Block network egress traffic as much as possible.

If you can't add all Azure Monitor resources to your AMPLS, you can still apply your Private Link to some resources, as explained in [Control how Private Links apply to your networks](./private-link-design.md#control-how-private-links-apply-to-your-networks). While useful, this approach is less recommended since it doesn't prevent data exfiltration.

## Plan by network topology

### Guiding principle: Avoid DNS overrides by using a single AMPLS
Some networks are composed of multiple VNets or other connected networks. If these networks share the same DNS, setting up a Private Link on any of them would update the DNS and affect traffic across all networks.

In the below diagram, VNet 10.0.1.x connects to AMPLS1 which creates DNS entries mapping Azure Monitor endpoints to IPs from range 10.0.1.x. Later, VNet 10.0.2.x connects to AMPLS2, which overrides the same DNS entries by mapping **the same global/regional endpoints** to IPs from the range 10.0.2.x. Since these VNets aren't peered, the first VNet now fails to reach these endpoints.

To avoid this conflict, create only a single AMPLS object per DNS.

![Diagram of DNS overrides in multiple VNets](./media/private-link-security/dns-overrides-multiple-vnets.png)


### Hub-and-spoke networks
Hub-and-spoke networks should use a single Private Link connection set on the hub (main) network, and not on each spoke VNet. 

![Hub-and-spoke-single-PE](./media/private-link-security/hub-and-spoke-with-single-private-endpoint-with-data-collection-endpoint.png)

> [!NOTE]
> You may intentionally prefer to create separate Private Links for your spoke VNets, for example to allow each VNet to access a limited set of monitoring resources. In such cases, you can create a dedicated Private Endpoint and AMPLS for each VNet, but **must also verify they don't share the same DNS zones in order to avoid DNS overrides**.

### Peered networks
Network peering is used in various topologies, other than hub-spoke. Such networks can share reach each others' IP addresses, and most likely share the same DNS. In such cases, our recommendation is once again to create a single Private Link on a network that's accessible to your other networks. Avoid creating multiple Private Endpoints and AMPLS objects, since ultimately only the last one set in the DNS applies.

### Isolated networks
If your networks aren't peered, **you must also separate their DNS in order to use Private Links**. After that's done, create a separate Private Endpoint for each network, and a separate AMPLS object. Your AMPLS objects can link to the same workspaces/components, or to different ones.

### Testing locally: Edit your machine's hosts file instead of the DNS 
To test Private Links locally without affecting other clients on your network, make sure Not to update your DNS when you create your Private Endpoint. Instead, edit the hosts file on your machine so it will send requests to the Private Link endpoints:
* Set up a Private Link, but when connecting to a Private Endpoint choose **not** to auto-integrate with the DNS (step 5b).
* Configure the relevant endpoints on your machines' hosts files. To review the Azure Monitor endpoints that need mapping, see [Reviewing your Endpoint's DNS settings](./private-link-configure.md#reviewing-your-endpoints-dns-settings).

That approach isn't recommended for production environments.

## Control how Private Links apply to your networks
Private Link access modes (introduced in September 2021) allow you to control how Private Links affect your network traffic. These settings can apply to your AMPLS object (to affect all connected networks) or to specific networks connected to it.

Choosing the proper access mode has detrimental effects on your network traffic. Each of these modes can be set for ingestion and queries, separately:

* Private Only - allows the VNet to reach only Private Link resources (resources in the AMPLS). That's the most secure mode of work, preventing data exfiltration. To achieve that, traffic to Azure Monitor resources out of the AMPLS is blocked.
![Diagram of AMPLS Private Only access mode](./media/private-link-security/ampls-private-only-access-mode.png)
* Open - allows the VNet to reach both Private Link resources and resources not in the AMPLS (if they [accept traffic from public networks](./private-link-design.md#control-network-access-to-your-resources)). While the Open access mode doesn't prevent data exfiltration, it still offers the other benefits of Private Links - traffic to Private Link resources is sent through private endpoints, validated, and sent over the Microsoft backbone. The Open mode is useful for a mixed mode of work (accessing some resources publicly and others over a Private Link), or during a gradual onboarding process.
![Diagram of AMPLS Open access mode](./media/private-link-security/ampls-open-access-mode.png)
Access modes are set separately for ingestion and queries. For example, you can set the Private Only mode for ingestion and the Open mode for queries.

Apply caution when selecting your access mode. Using the Private Only access mode will block traffic to resources not in the AMPLS across all networks that share the same DNS, regardless of subscription or tenant (with the exception of Log Analytics ingestion requests, as explained below). If you can't add all Azure Monitor resources to the AMPLS, start with by adding select resources and applying the Open access mode. Only after adding *all* Azure Monitor resources to your AMPLS, switch to the 'Private Only' mode for maximum security.

See [Use APIs and command line](./private-link-configure.md#use-apis-and-command-line) for configuration details and examples.

> [!NOTE]
> Log Analytics ingestion uses resource-specific endpoints. As such, it doesn’t adhere to AMPLS access modes. **To assure Log Analytics ingestion requests can’t access workspaces out of the AMPLS, set the network firewall to block traffic to public endpoints, regardless of the AMPLS access modes**.

### Setting access modes for specific networks
The access modes set on the AMPLS resource affect all networks, but you can override these settings for specific networks.

In the following diagram, VNet1 uses the Open mode and VNet2 uses the Private Only mode. As a result, requests from VNet1 can reach Workspace1 and Component2 over a Private Link, and Component3 not over a Private Link (if it [accepts traffic from public networks](./private-link-design.md#control-network-access-to-your-resources)). However, VNet2 requests won't be able to reach Component3. 
![Diagram of mixed access modes](./media/private-link-security/ampls-mixed-access-modes.png)


## Consider AMPLS limits
The AMPLS object has the following limits:
* A VNet can only connect to **one** AMPLS object. That means the AMPLS object must provide access to all the Azure Monitor resources the VNet should have access to.
* An AMPLS object can connect to 300 Log Analytics workspaces and 1000 Application Insights components at most.
* An Azure Monitor resource (Workspace or Application Insights component or [Data Collection Endpoint](../essentials/data-collection-endpoint-overview.md)) can connect to 5 AMPLSs at most.
* An AMPLS object can connect to 10 Private Endpoints at most.

> [!NOTE]
> AMPLS resources created before December 1, 2021, support only 50 resources.

In the below diagram:
* Each VNet connects to only **one** AMPLS object.
* AMPLS A connects to two workspaces and one Application Insight component, using 2 of the possible 300 Log Analytics workspaces and 1 of the possible 1000 Application Insights components it can connect to.
* Workspace2 connects to AMPLS A and AMPLS B, using two of the five possible AMPLS connections.
* AMPLS B is connected to Private Endpoints of two VNets (VNet2 and VNet3), using two of the 10 possible Private Endpoint connections.

![Diagram of AMPLS limits](./media/private-link-security/ampls-limits.png)


## Control network access to your resources
Your Log Analytics workspaces or Application Insights components can be set to:
* Accept or block ingestion from public networks (networks not connected to the resource AMPLS).
* Accept or block queries from public networks (networks not connected to the resource AMPLS).

That granularity allows you to set access according to your needs, per workspace. For example, you may accept ingestion only through Private Link connected networks (meaning specific VNets), but still choose to accept queries from all networks, public and private. 

Blocking queries from public networks means clients (machines, SDKs etc.) outside of the connected AMPLSs can't query data in the resource. That data includes logs, metrics, and the live metrics stream. Blocking queries from public networks affects all experiences that run these queries, such as workbooks, dashboards, Insights in the Azure portal, and queries run from outside the Azure portal.

Your [Data Collection endpoints](../essentials/data-collection-endpoint-overview.md) can be set to:
* Accept or block access from public networks (networks not connected to the resource AMPLS).

See [Set resource access flags](./private-link-configure.md#set-resource-access-flags) for configuration details.

### Exceptions

#### Diagnostic logs
Logs and metrics uploaded to a workspace via [Diagnostic Settings](../essentials/diagnostic-settings.md) go over a secure private Microsoft channel and are not controlled by these settings.

#### 'Custom Metrics' or Azure Monitor guest metrics
[Custom Metrics (preview)](../essentials/metrics-custom-overview.md) collected and uploaded via the Azure Monitor Agent are not controlled by Data Collection endpoints nor can they be configured over private links.

#### Azure Resource Manager
Restricting access as explained above applies to data in the resource. However, configuration changes, including turning these access settings on or off, are managed by Azure Resource Manager. To control these settings, you should restrict access to resources using the appropriate roles, permissions, network controls, and auditing. For more information, see [Azure Monitor Roles, Permissions, and Security](../roles-permissions-security.md)

> [!NOTE]
> Queries sent through the Azure Resource Management (ARM) API can't use Azure Monitor Private Links. These queries can only go through if the target resource allows queries from public networks (set through the Network Isolation blade, or [using the CLI](./private-link-configure.md#set-resource-access-flags)).
>
> The following experiences are known to run queries through the ARM API:
> * LogicApp connector
> * Update Management solution
> * Change Tracking solution
> * VM Insights
> * Container Insights
> * Log Analytics' Workspace Summary blade (showing the solutions dashboard)

## Application Insights considerations
* You’ll need to add resources hosting the monitored workloads to a private link. For example, see [Using Private Endpoints for Azure Web App](../../app-service/networking/private-endpoint.md).
* Non-portal consumption experiences must also run on the private-linked VNET that includes the monitored workloads.
* In order to support Private Links for Profiler and Debugger, you'll need to [provide your own storage account](../app/profiler-bring-your-own-storage.md) 

> [!NOTE]
> To fully secure workspace-based Application Insights, you need to lock down both access to Application Insights resource as well as the underlying Log Analytics workspace.

## Log Analytics considerations

### Log Analytics solution packs download
Log Analytics agents need to access a global storage account to download solution packs. Private Link setups created at or after April 19, 2021 (or starting June 2021 on Azure Sovereign clouds) can reach the agents' solution packs storage over the private link. This capability is made possible through a DNS zone created for 'blob.core.windows.net'.

If your Private Link setup was created before April 19, 2021, it won't reach the solution packs storage over a private link. To handle that you can either:
* Re-create your AMPLS and the Private Endpoint connected to it
* Allow your agents to reach the storage account through its public endpoint, by adding the following rules to your firewall allowlist:

    | Cloud environment | Agent Resource | Ports | Direction |
    |:--|:--|:--|:--|
    |Azure Public     | scadvisorcontent.blob.core.windows.net         | 443 | Outbound
    |Azure Government | usbn1oicore.blob.core.usgovcloudapi.net | 443 |  Outbound
    |Azure China 21Vianet      | mceast2oicore.blob.core.chinacloudapi.cn| 443 | Outbound

### Collecting custom logs and IIS log over Private Link
Storage accounts are used in the ingestion process of custom logs. By default, service-managed storage accounts are used. However, to ingest custom logs on private links, you must use your own storage accounts and associate them with Log Analytics workspace(s).

For more information on connecting your own storage account, see [Customer-owned storage accounts for log ingestion](private-storage.md) and specifically [Using Private Links](private-storage.md#using-private-links) and [Link storage accounts to your Log Analytics workspace](private-storage.md#link-storage-accounts-to-your-log-analytics-workspace).

### Automation
If you use Log Analytics solutions that require an Automation account (such as Update Management, Change Tracking, or Inventory) you should also create a Private Link for your Automation account. For more information, see [Use Azure Private Link to securely connect networks to Azure Automation](../../automation/how-to/private-link-security.md).

> [!NOTE]
> Some products and Azure portal experiences query data through Azure Resource Manager and therefore won't be able to query data over a Private Link, unless Private Link settings are applied to the Resource Manager as well. To overcome this, you can configure your resources to accept queries from public networks as explained in [Controlling network access to your resources](./private-link-design.md#control-network-access-to-your-resources) (Ingestion can remain limited to Private Link networks).
We've identified the following products and experiences query workspaces through Azure Resource Manager:
> * LogicApp connector
> * Update Management solution
> * Change Tracking solution
> * The Workspace Summary blade in the portal (showing the solutions dashboard)
> * VM Insights
> * Container Insights



## Requirements

### Network subnet size
The smallest supported IPv4 subnet is /27 (using CIDR subnet definitions). While Azure VNets [can be as small as /29](../../virtual-network/virtual-networks-faq.md#how-small-and-how-large-can-vnets-and-subnets-be), Azure [reserves 5 IP addresses](../../virtual-network/virtual-networks-faq.md#are-there-any-restrictions-on-using-ip-addresses-within-these-subnets) and the Azure Monitor Private Link setup requires at least 11 additional IP addresses, even if connecting to a single workspace. [Review your endpoint's DNS settings](./private-link-configure.md#reviewing-your-endpoints-dns-settings) for the detailed list of Azure Monitor Private Link endpoints.


### Agents
The latest versions of the Windows and Linux agents must be used to support secure ingestion to Log Analytics workspaces. Older versions can't upload monitoring data over a private network.

**Azure Monitor Windows agents**

Azure Monitor Windows agent version 1.1.1.0 or higher (using [Data Collection endpoints](../essentials/data-collection-endpoint-overview.md))

**Azure Monitor Linux agents**

Azure Monitor Windows agent version 1.10.5.0 or higher (using [Data Collection endpoints](../essentials/data-collection-endpoint-overview.md))

**Log Analytics Windows agent (on deprecation path)**

Use the Log Analytics agent version 10.20.18038.0 or later.

**Log Analytics Linux agent (on deprecation path)**

Use agent version 1.12.25 or later. If you can't, run the following commands on your VM.

```cmd
$ sudo /opt/microsoft/omsagent/bin/omsadmin.sh -X
$ sudo /opt/microsoft/omsagent/bin/omsadmin.sh -w <workspace id> -s <workspace key>
```
### Azure portal
To use Azure Monitor portal experiences such as Application Insights, Log Analytics and [Data Collection endpoints](../essentials/data-collection-endpoint-overview.md), you need to allow the Azure portal and Azure Monitor extensions to be accessible on the private networks. Add **AzureActiveDirectory**, **AzureResourceManager**, **AzureFrontDoor.FirstParty**, and **AzureFrontdoor.Frontend** [service tags](../../firewall/service-tags.md) to your Network Security Group.

### Programmatic access
To use the REST API, [CLI](/cli/azure/monitor) or PowerShell with Azure Monitor on private networks, add the [service tags](../../virtual-network/service-tags-overview.md)  **AzureActiveDirectory** and **AzureResourceManager** to your firewall.

### Application Insights SDK downloads from a content delivery network
Bundle the JavaScript code in your script so that the browser doesn't attempt to download code from a CDN. An example is provided on [GitHub](https://github.com/microsoft/ApplicationInsights-JS#npm-setup-ignore-if-using-snippet-setup)

### Browser DNS settings
If you're connecting to your Azure Monitor resources over a Private Link, traffic to these resources must go through the private endpoint that is configured on your network. To enable the private endpoint, update your DNS settings as explained in [Connect to a private endpoint](./private-link-configure.md#connect-to-a-private-endpoint). Some browsers use their own DNS settings instead of the ones you set. The browser might attempt to connect to Azure Monitor public endpoints and bypass the Private Link entirely. Verify that your browsers settings don't override or cache old DNS settings. 

### Querying limitation: externaldata operator
The [`externaldata` operator](/azure/data-explorer/kusto/query/externaldata-operator?pivots=azuremonitor) isn't supported over a Private Link, as it reads data from storage accounts but doesn't guarantee the storage is accessed privately.

## Next steps
- Learn how to [configure your Private Link](private-link-configure.md)
- Learn about [private storage](private-storage.md) for Custom Logs and Customer managed keys (CMK)
- Learn about [Private Link for Automation](../../automation/how-to/private-link-security.md)
