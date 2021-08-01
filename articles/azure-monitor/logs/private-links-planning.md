---
title: Plan your Private Link setup
description: Plan your Private Link setup
author: noakup
ms.author: noakuper
ms.topic: conceptual
ms.date: 08/01/2021
---

# Plan your Private Link setup

Before setting up your Azure Monitor Private Link setup, consider your network topology, and specifically your DNS routing topology.

As discussed above, setting up a Private Link affects - in many ways - traffic to all Azure Monitor resources. That's especially true for Application Insights resources. Additionally, it affects not only the network connected to the Private Endpoint (and through it to the AMPLS resources) but also all other networks the share the same DNS.

> [!NOTE]
> Given all that, the simplest and most secure approach would be:
> 1. Create a single Private Link connection, with a single Private Endpoint and a single AMPLS. If your networks are peered, create the Private Link connection on the shared (or hub) VNet.
> 2. Add *all* Azure Monitor resources (Application Insights components and Log Analytics workspaces) to that AMPLS.
> 3. Block network egress traffic as much as possible.

If for some reason you can't use a single Private Link and a single AMPLS, the next best thing would be to create isolated Private Link connections for isolation networks. If you are (or can align with) using spoke vnets, follow the guidance in [Hub-spoke network topology in Azure](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke). Then, setup separate private link settings in the relevant spoke VNets. **Make sure to separate DNS zones as well**, since sharing DNS zones with other spoke networks will cause DNS overrides.

## Plan by network topology
### Hub-spoke networks
Hub-spoke topologies can avoid the issue of DNS overrides by setting the Private Link on the hub (main) VNet, and not on each spoke VNet. This setup makes sense especially if the Azure Monitor resources used by the spoke VNets are shared. 

![Hub-and-spoke-single-PE](./media/private-link-security/hub-and-spoke-with-single-private-endpoint.png)

> [!NOTE]
> You may intentionally prefer to create separate Private Links for your spoke VNets, for example to allow each VNet to access a limited set of monitoring resources. In such cases, you can create a dedicated Private Endpoint and AMPLS for each VNet, but **must also verify they don't share the same DNS zones in order to avoid DNS overrides**.

### Peered networks
Network peering is used in various topologies, other than hub-spoke. Such networks can share reach each others' IP addresses, and most likely share the same DNS. In such cases, our recommendation is similar to Hub-spoke - select a single network that is reached by all other (relevant) networks and set the Private Link connection on that network. Avoid creating multiple Private Endpoints and AMPLS objects, since ultimately only the last one set in the DNS will apply.

## Isolated networks
#If your networks aren't peered, **you must also separate their DNS in order to use Private Links**. Once that's done, you can create a Private Link for one (or many) network, without affecting traffic of other networks. That means creating a separate Private Endpoint for each network, and a separate AMPLS object. Your AMPLS objects can link to the same workspaces/components, or to different ones.

### Testing with a local bypass: Edit your machine's hosts file instead of the DNS 
As a local bypass to the All or Nothing behavior, you can select not to update your DNS with the Private Link records, and instead edit the hosts files on select machines so only these machines would send requests to the Private Link endpoints.
* Set up a Private Link as show below, but when [connecting to a Private Endpoint](#connect-to-a-private-endpoint) choose **not** to auto-integrate with the DNS (step 5b).
* Configure the relevant endpoints on your machines' hosts files. To review the Azure Monitor endpoints that need mapping, see [Reviewing your Endpoint's DNS settings](#reviewing-your-endpoints-dns-settings).

That approach isn't recommended for production environments.

## Consider AMPLS limits
The AMPLS object has the following limits:
* A VNet can only connect to **one** AMPLS object. That means the AMPLS object must provide access to all the Azure Monitor resources the VNet should have access to.
* An AMPLS object can connect to 50 Azure Monitor resources at most.
* An Azure Monitor resource (Workspace or Application Insights component) can connect to 5 AMPLSs at most.
* An AMPLS object can connect to 10 Private Endpoints at most.

In the below diagram:
* Each VNet connects to only **one** AMPLS object.
* AMPLS A connects to two workspaces and one Application Insight component, using 3 of the 50 possible Azure Monitor resources connections.
* Workspace2 connects to AMPLS A and AMPLS B, using two of the five possible AMPLS connections.
* AMPLS B is connected to Private Endpoints of two VNets (VNet2 and VNet3), using two of the 10 possible Private Endpoint connections.

![Diagram of AMPLS limits](./media/private-link-security/ampls-limits.png)


## Application Insights considerations
* You’ll need to add resources hosting the monitored workloads to a private link. For example, see [Using Private Endpoints for Azure Web App](../../app-service/networking/private-endpoint.md).
* Non-portal consumption experiences must also run on the private-linked VNET that includes the monitored workloads.
* In order to support Private Links for Profiler and Debugger, you'll need to [provide your own storage account](../app/profiler-bring-your-own-storage.md) 

> [!NOTE]
> To fully secure workspace-based Application Insights, you need to lock down both access to Application Insights resource as well as the underlying Log Analytics workspace.

## Log Analytics considerations

### Log Analytics solution packs download
Log Analytics agents need to access a global storage account to download solution packs. Private Link setups created at or after April 19, 2021 (or starting June 2021 on Azure Sovereign clouds) can reach the agents' solution packs storage over the private link. This capability is made possible through the new DNS zone created for [blob.core.windows.net](#privatelink-blob-core-windows-net).

If your Private Link setup was created before April 19, 2021, it won't reach the solution packs storage over a private link. To handle that you can either:
* Re-create your AMPLS and the Private Endpoint connected to it
* Allow your agents to reach the storage account through its public endpoint, by adding the following rules to your firewall allowlist:

    | Cloud environment | Agent Resource | Ports | Direction |
    |:--|:--|:--|:--|
    |Azure Public     | scadvisorcontent.blob.core.windows.net         | 443 | Outbound
    |Azure Government | usbn1oicore.blob.core.usgovcloudapi.net | 443 |  Outbound
    |Azure China 21Vianet      | mceast2oicore.blob.core.chinacloudapi.cn| 443 | Outbound

### Collecting custom logs and IIS log over Private Link
Storage accounts are used in the ingestion process of custom logs. By default, service-managed storage accounts are used. However to ingest custom logs on private links, you must use your own storage accounts and associate them with Log Analytics workspace(s). See more details on how to set up such accounts using the [command line](/cli/azure/monitor/log-analytics/workspace/linked-storage).

For more information on connecting your own storage account, see [Customer-owned storage accounts for log ingestion](private-storage.md)

### Automation
If you use Log Analytics solutions that require an Automation account, such as Update Management, Change Tracking, or Inventory, you should also set up a separate Private Link for your Automation account. For more information, see [Use Azure Private Link to securely connect networks to Azure Automation](../../automation/how-to/private-link-security.md).

> ![NOTE]
> Specific Azure portal experiences (such as the LogicApp connector, Update Management solution and the Workspace Summary blade in the portal, showing the solutions dashboard) query data through Azure Resource Manager and therefore won't be able to query data over a Private Link, unless Private Link settings are applied to the Resource Manager as well.

## Requirements
### Agents
The latest versions of the Windows and Linux agents must be used to support secure ingestion to Log Analytics workspaces. Older versions can't upload monitoring data over a private network.

**Log Analytics Windows agent**

Use the Log Analytics agent version 10.20.18038.0 or later.

**Log Analytics Linux agent**

Use agent version 1.12.25 or later. If you can't, run the following commands on your VM.

```cmd
$ sudo /opt/microsoft/omsagent/bin/omsadmin.sh -X
$ sudo /opt/microsoft/omsagent/bin/omsadmin.sh -w <workspace id> -s <workspace key>
```
### Azure portal
To use Azure Monitor portal experiences such as Application Insights and Log Analytics, you need to allow the Azure portal and Azure Monitor extensions to be accessible on the private networks. Add **AzureActiveDirectory**, **AzureResourceManager**, **AzureFrontDoor.FirstParty**, and **AzureFrontdoor.Frontend** [service tags](../../firewall/service-tags.md) to your Network Security Group.

### Programmatic access
To use the REST API, [CLI](/cli/azure/monitor) or PowerShell with Azure Monitor on private networks, add the [service tags](../../virtual-network/service-tags-overview.md)  **AzureActiveDirectory** and **AzureResourceManager** to your firewall.

### Application Insights SDK downloads from a content delivery network
Bundle the JavaScript code in your script so that the browser doesn't attempt to download code from a CDN. An example is provided on [GitHub](https://github.com/microsoft/ApplicationInsights-JS#npm-setup-ignore-if-using-snippet-setup)

### Browser DNS settings
If you're connecting to your Azure Monitor resources over a Private Link, traffic to these resources must go through the private endpoint that is configured on your network. To enable the private endpoint, update your DNS settings as explained in [Connect to a private endpoint](#connect-to-a-private-endpoint). Some browsers use their own DNS settings instead of the ones you set. The browser might attempt to connect to Azure Monitor public endpoints and bypass the Private Link entirely. Verify that your browsers settings don't override or cache old DNS settings. 

### Querying limitation: externaldata operator
The [`externaldata` operator](/azure/data-explorer/kusto/query/externaldata-operator?pivots=azuremonitor) isn't supported over a Private Link, as it reads data from storage accounts but doesn't guarantee the storage is accessed privately.

## Next steps
- Learn how to [setup your Azure Monitor Private Link](private-link-setup.md)
- Learn about [private storage](private-storage.md)
- Learn about [Private Link for Automation](../../automation/how-to/private-link-security.md)