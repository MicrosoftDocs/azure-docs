---
title: Use Azure Private Link to connect networks to Azure Monitor
description: Set up an Azure Monitor Private Link Scope to securely connect networks to Azure Monitor.
author: noakup
ms.author: noakuper
ms.topic: conceptual
ms.date: 10/05/2020
---

# Use Azure Private Link to connect networks to Azure Monitor

With [Azure Private Link](../../private-link/private-link-overview.md), you can securely link Azure platform as a service (PaaS) services to your virtual network by using private endpoints. For many services, you just set up an endpoint for each resource. However, Azure Monitor is a constellation of different interconnected services that work together to monitor your workloads. 

You can use a resource called an Azure Monitor Private Link Scope to define the boundaries of your monitoring network and connect to your virtual network. This article covers when to use and how to set up an Azure Monitor Private Link Scope.

This article uses the following abbreviations in examples:

- AMPLS: Azure Monitor Private Link Scope
- VNet: virtual network
- AI: Application Insights
- LA: Log Analytics

## Advantages

With Private Link, you can:

- Connect privately to Azure Monitor without opening any public network access.
- Ensure that your monitoring data is accessed only through authorized private networks.
- Prevent data exfiltration from your private networks by defining specific Azure Monitor resources that connect through your private endpoint.
- Securely connect your private on-premises network to Azure Monitor by using Azure ExpressRoute.
- Keep all traffic inside the Microsoft Azure backbone network.

For more information, see [Key benefits of Private Link](../../private-link/private-link-overview.md#key-benefits).

## How it works

An Azure Monitor Private Link Scope connects private endpoints (and the virtual networks they're contained in) to one or more Azure Monitor resources. These resources are Log Analytics workspaces and Application Insights components.

![Diagram of a basic resource topology.](./media/private-link-security/private-link-basic-topology.png)

* The private endpoint allows your virtual network to reach Azure Monitor endpoints through private IPs from your network's pool, instead of using the public IPs of these endpoints. That allows you to keep using your Azure Monitor resources without opening your virtual network to unrequired outbound traffic. 
* Traffic from the private endpoint to your Azure Monitor resources will go over the Microsoft Azure backbone and not be routed to public networks. 
* You can configure each of your workspaces or components to allow or deny ingestion and queries from public networks. That provides a resource-level protection, so that you can control traffic to specific resources.

> [!NOTE]
> A single Azure Monitor resource can belong to multiple Azure Monitor Private Link Scopes, but you can't connect a single virtual network to more than one Azure Monitor Private Link Scope. 

### Azure Monitor Private Links and DNS: It's all or nothing

Some Azure Monitor services use global endpoints, meaning that they serve requests targeting any workspace or component. When you set up a Private Link connection, your DNS is updated to map Azure Monitor endpoints to private IPs, in order to send traffic through Private Link. 

For global endpoints, setting up a Private Link instance (even to a single resource) affects traffic to all resources. In other words, it's impossible to create a Private Link connection for only a specific component or workspace.

#### Global endpoints

Traffic to the following global endpoints will be sent through Private Link:
* All Application Insights endpoints. Endpoints that handle ingestion, live metrics, profiler, and debugger (for example) to Application Insights endpoints are global.
* The query endpoint. The endpoint that handles queries to both Application Insights and Log Analytics resources is global.

Effectively, all Application Insights traffic will be sent to Private Link. All queries, to both Application Insights and Log Analytics resources, will be sent to Private Link.

Traffic to Application Insights resources that aren't added to your Azure Monitor Private Link Scope will not pass the Private Link validation, and will fail.

![Diagram of all-or-nothing behavior.](./media/private-link-security/all-or-nothing.png)

#### Resource-specific endpoints

All Log Analytics endpoints, except the query endpoint, are workspace specific. Creating a Private Link connection to a specific Log Analytics workspace won't affect ingestion (or other) traffic to other workspaces, which will continue to use the public Log Analytics endpoints. All queries, however, will be sent through Private Link.

### Private Link applies to all networks that share the same DNS

Some networks consist of multiple virtual networks or other connected networks. If these networks share the same DNS, setting up a Private Link instance on any of them would update the DNS and affect traffic across all networks. That's especially important to note, because of the all-or-nothing behavior described earlier.

In the following diagram, virtual network 10.0.1.x first connects to AMPLS1 and maps the Azure Monitor global endpoints to IPs from its range. Later, virtual network 10.0.2.x connects to AMPLS2, and it overrides the DNS mapping of the *same global endpoints* with IPs from its range. Because these virtual networks aren't peered, the first virtual network now fails to reach these endpoints.

![Diagram of DNS overrides in multiple virtual networks.](./media/private-link-security/dns-overrides-multiple-vnets.png)

## Planning your Private Link setup

Before you set up Private Link, consider your network topology, and specifically your DNS routing topology.

As discussed earlier, setting up Private Link affects traffic to all Azure Monitor resources. That's especially true for Application Insights resources. Additionally, it affects not only the network connected to the private endpoint (and through it to the Azure Monitor Private Link Scope resources) but also all other networks that share the same DNS.

Given all that, the simplest and most secure approach would be:

1. Create a single Private Link connection, with a single private endpoint and a single Azure Monitor Private Link Scope. If your networks are peered, create the Private Link connection on the shared (or hub) virtual network.
2. Add *all* Azure Monitor resources (Application Insights components and Log Analytics workspaces) to that Azure Monitor Private Link Scope.
3. Block network egress traffic as much as possible.

If you can't use a single Private Link connection and a single Azure Monitor Private Link Scope, the next best thing is to create isolated Private Link connections for isolation networks. If you are (or can align with) using spoke virtual networks, follow the guidance in [Hub-and-spoke network topology in Azure](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke). Then, set up separate Private Link settings in the relevant spoke virtual networks. *Be sure to separate DNS zones*, because sharing DNS zones with other spoke networks will cause DNS overrides.

### Hub-and-spoke networks

Hub-and-spoke topologies can avoid the issue of DNS overrides by setting the Private Link connection on the hub (main) virtual network, and not on each spoke virtual network. This setup makes sense, especially if the Azure Monitor resources that the spoke virtual networks use are shared. 

![Diagram of a hub-and-spoke network with a single private endpoint.](./media/private-link-security/hub-and-spoke-with-single-private-endpoint.png)

> [!NOTE]
> You might prefer to create separate Private Link connections for your spoke virtual networks - for example, to allow each virtual network to access a limited set of monitoring resources. In such cases, you can create a dedicated Private Endpoint connection and Azure Monitor Private Link Scope for each virtual network. But you must also verify that they don't share the same DNS zones in order to avoid DNS overrides.

### Peered networks

Network peering is used in various topologies other than hub-and-spoke. Such networks can share reach each other's IP addresses, and most likely share the same DNS. 

In these cases, our recommendation is similar to hub-and-spoke. Select a single network that's reached by all other (relevant) networks, and set the Private Link connection on that network. Avoid creating multiple private endpoints and Azure Monitor Private Link Scope objects, because ultimately only the last one set in the DNS will apply.

### Isolated networks

If your networks aren't peered, *you must also separate their DNS in order to use a Private Link connection*. After that's done, you can create a Private Link connection for one or many networks, without affecting the traffic of other networks. That means creating a separate private endpoint for each network, and a separate Azure Monitor Private Link Scope object. Your Azure Monitor Private Link Scope objects can link to the same workspaces or components, or to different ones.

### Test with a local bypass: Edit your machine's host file instead of DNS 

As a local bypass to the all-or-nothing behavior, you can select not to update your DNS with the Private Link records. Instead, you can edit the host files on specific machines so that only these machines send requests to the Private Link endpoints:

* Set up a Private Link connection as described later in the [Connect to a private endpoint](#connect-to-a-private-endpoint) section of this article. But when you're connecting to a private endpoint, choose *not* to automatically integrate with the DNS (step 5b).
* Configure the relevant endpoints on your machines' host files. To review the Azure Monitor endpoints that need mapping, see [Reviewing your endpoint's DNS settings](#reviewing-your-endpoints-dns-settings).

> [!NOTE]
> We don't recommend this approach for production environments.

## Limits and additional considerations

### Azure Monitor Private Link Scope limits

The Azure Monitor Private Link Scope object has the following limits:
* A virtual network can connect to only *one* Azure Monitor Private Link Scope object. The Azure Monitor Private Link Scope object must provide access to all the Azure Monitor resources that the virtual network should have access to.
* An Azure Monitor Private Link Scope object can connect to 50 Azure Monitor resources at most.
* An Azure Monitor resource (workspace or Application Insights component) can connect to five Azure Monitor Private Link Scopes at most.
* An Azure Monitor Private Link Scope object can connect to 10 private endpoints at most.

In the following diagram:
* Each virtual network connects to only one Azure Monitor Private Link Scope object.
* AMPLS A connects to two workspaces and one Application Insights component, by using three of the 50 possible Azure Monitor resource connections.
* Workspace 2 connects to AMPLS A and AMPLS B, by using two of the five possible Azure Monitor Private Link Scope connections.
* AMPLS B is connected to private endpoints of two virtual networks (VNet2 and VNet3), by using two of the 10 possible private endpoint connections.

![Diagram of Azure Monitor Private Link Scope limits.](./media/private-link-security/ampls-limits.png)

### Application Insights considerations

* You'll need to add resources that host the monitored workloads to a Private Link instance. For an example, see [Using Private Endpoints for Azure Web Apps](../../app-service/networking/private-endpoint.md).
* Non-portal consumption experiences must also run on the connected virtual network that includes the monitored workloads.
* To support Private Link connections for Profiler and Debugger, you'll need to [provide your own storage account](../app/profiler-bring-your-own-storage.md).

> [!NOTE]
> To fully secure workspace-based Application Insights, you need to lock down access to both Application Insights resources and the underlying Log Analytics workspace.

### Log Analytics considerations

#### Automation

If you use Log Analytics solutions that require an Azure Automation account, such as Update Management, Change Tracking, or Inventory, you should also set up a separate Private Link connection for your Automation account. For more information, see [Use Azure Private Link to securely connect networks to Azure Automation](../../automation/how-to/private-link-security.md).

#### Log Analytics solution packs

Log Analytics agents need to access a global storage account to download solution packs. Private Link setups created on or after April 19, 2021 (or starting June 2021 on Azure Sovereign clouds) can reach the agents' solution pack storage over the Private Link connection. This capability is made possible through the new DNS zone created for [blob.core.windows.net](#privatelink-blob-core-windows-net).

If your Private Link setup was created before April 19, 2021, it won't reach the solution pack storage over a Private Link connection. To handle that, you can either:
* Re-create your Azure Monitor Private Link Scope and the private endpoint that's connected to it.
* Allow your agents to reach the storage account through its public endpoint, by adding the following rules to your firewall allowlist:

    | Cloud environment | Agent resource | Ports | Direction |
    |:--|:--|:--|:--|
    |Azure Public     | scadvisorcontent.blob.core.windows.net         | 443 | Outbound
    |Azure Government | usbn1oicore.blob.core.usgovcloudapi.net | 443 |  Outbound
    |Azure China 21Vianet      | mceast2oicore.blob.core.chinacloudapi.cn| 443 | Outbound

## Private Link connection setup

Start by creating an Azure Monitor Private Link Scope resource.

1. Go to **Create a resource** in the Azure portal and search for **Azure Monitor Private Link Scope**.

   ![Screenshot that shows finding Azure Monitor Private Link Scope.](./media/private-link-security/ampls-find-1c.png)

2. Select **Create**.
3. Choose a subscription and resource group.
4. Give the Azure Monitor Private Link Scope a name. It's best to use a meaningful and clear name, such as **AppServerProdTelem**.
5. Select **Review + create**. 

   ![Screenshot that shows selections for creating an Azure Monitor Private Link Scope.](./media/private-link-security/ampls-create-1d.png)

6. After validation, select **Create**.

### Connect Azure Monitor resources

Connect Azure Monitor resources (Log Analytics workspaces and Application Insights components) to your Azure Monitor Private Link Scope.

1. In your Azure Monitor Private Link Scope, select **Azure Monitor Resources** on the left menu. Select **Add**.
2. Add the workspace or component. Selecting the **Add** button brings up a dialog where you can select Azure Monitor resources. You can browse through your subscriptions and resource groups, or you can enter their names to filter down to them. Select the workspace or component, and select **Apply** to add them to your scope.

    ![Screenshot of the interface for selecting a scope.](./media/private-link-security/ampls-select-2.png)

> [!NOTE]
> Deleting Azure Monitor resources requires that you first disconnect them from any Azure Monitor Private Link Scope objects that they're connected to. It's not possible to delete resources that are connected to an Azure Monitor Private Link Scope.

### Connect to a private endpoint

Now that you have resources connected to your Azure Monitor Private Link Scope, create a private endpoint to connect your network. You can do this task in the [Azure portal Private Link center](https://portal.azure.com/#blade/Microsoft_Azure_Network/PrivateLinkCenterBlade/privateendpoints) or inside your Azure Monitor Private Link Scope. This example uses the Azure Monitor Private Link Scope:

1. In your scope resource, select **Private Endpoint connections** on the left resource menu. Select **Private Endpoint** to start the endpoint creation process. You can also approve connections that were started in the Private Link center here by selecting them and then selecting **Approve**.

    ![Screenshot of the interface for setting up private endpoint connections.](./media/private-link-security/ampls-select-private-endpoint-connect-3.png)

2. Choose the subscription, resource group, and name of the endpoint. Choose a region that matches the region of the virtual network that you connected the endpoint to.

3. Select **Next: Resource**. 

4. On the **Resource** tab:

   a. For **Subscription**, select the subscription that contains your Azure Monitor Private Scope resource. 

   b. For **Resource type**, select **Microsoft.Insights/privateLinkScopes**. 

   c. For **Resource**, select the Azure Monitor Private Link Scope that you created earlier. 

      ![Screenshot of resource selections for creating a private endpoint.](./media/private-link-security/ampls-select-private-endpoint-create-4.png)

   d. Select **Next: Configuration >**.      

5. On the **Configuration** tab:

   a. Choose the virtual network and subnet that you want to connect to your Azure Monitor resources. 
 
   b. For **Integrate with private DNS zone**, select **Yes** to automatically create a new private DNS zone. The actual DNS zones might be different from what's shown in the following screenshot. 
   
      > [!NOTE]
      > If you select **No** and prefer to manage DNS records manually, first complete setting up Private Link - including this private endpoint and the Azure Monitor Private Link Scope configuration. Then, configure your DNS according to the instructions in [Azure Private Endpoint DNS configuration](../../private-link/private-endpoint-dns.md). 
      >
      > Make sure not to create empty records as preparation for your Private Link setup. The DNS records that you create can override existing settings and affect your connectivity with Azure Monitor.
 
   c. Select **Review + create**.

      ![Screenshot of selections for configuring a private endpoint.](./media/private-link-security/ampls-select-private-endpoint-create-5.png)
 
   d. After validation, select **Create**. 

You've now created a new private endpoint that's connected to this Azure Monitor Private Link Scope.

## Configure access to your resources

We've now covered the configuration of your network. You should also consider how you want to configure network access to your monitored resources: Log Analytics workspaces and Application Insights components.

Go to the Azure portal. On your resource's menu, an item called **Network Isolation** is on the left side. This page controls both which networks can reach the resource through Private Link and whether other networks can reach it.

> [!NOTE]
> Starting August 16, 2021, network isolation will be strictly enforced. Resources that are set to block queries from public networks, and that aren't associated with an Azure Monitor Private Link Scope, will stop accepting queries from any network.

![Screenshot that shows network isolation.](./media/private-link-security/ampls-network-isolation.png)

### Connected Azure Monitor Private Link Scopes

On the Azure portal page for network isolation, in the **Azure Monitor Private Links Scopes** area, you can review and configure the resource's connections to Azure Monitor Private Link Scopes. Connecting to Azure Monitor Private Link Scopes allows traffic from the virtual network connected to each Azure Monitor Private Link Scope to reach this resource. It has the same effect as connecting a resource from the scope as we did in [Connect Azure Monitor resources](#connect-azure-monitor-resources). 

To add a new connection, select **Add** and select the Azure Monitor Private Link Scope. Select **Apply** to connect it. Your resource can connect to five Azure Monitor Private Link Scope objects, as mentioned in [Restrictions and limitations](#restrictions-and-limitations).

### Managing access from outside Azure Monitor Private Link Scopes

The bottom part of the Azure portal page for network isolation control is the **Virtual networks access configuration** area. These settings control access from public networks, meaning networks not connected to the listed Azure Monitor Private Link Scopes.

If you set **Accept data ingestion from public networks not connected through a Private Link Scope** to **No**, then clients (such as machines and SDKs) outside the connected scopes can't upload data or send logs to this resource.

If you set **Accept queries from public networks not connected through a Private Link Scope** to **No**, then clients (such as machines and SDKs) outside the connected scopes can't query data in this resource. That data includes access to logs, metrics, and the live metrics stream. It also includes experiences built on top, such as workbooks, dashboards, query API-based client experiences, and insights in the Azure portal. Experiences that run outside the Azure portal and that query Log Analytics data also have to be running within the virtual network that uses Private Link.

### Exceptions

#### Diagnostic logs

Logs and metrics uploaded to a workspace via [diagnostic settings](../essentials/diagnostic-settings.md) go over a secure private Microsoft channel and are not controlled by these settings.

#### Azure Resource Manager

Restricting access as explained earlier applies to data in the resource. However, Azure Resource Manager manages configuration changes, including turning these access settings on or off. To control these settings, you should restrict access to resources by using the appropriate roles, permissions, network controls, and auditing. For more information, see [Azure Monitor roles, permissions, and security](../roles-permissions-security.md).

Additionally, specific experiences (such as the Azure Logic Apps connector, the Update Management solution, and the **Workspace Summary** pane in the portal, showing the solution dashboard) query data through Azure Resource Manager. These experiences won't be able to query data unless Private Link settings are also applied to Resource Manager.

## Review and validate your Private Link setup

### Reviewing your endpoint's DNS settings
The private endpoint that you created should now have five DNS zones configured:

* privatelink-monitor-azure-com
* privatelink-oms-opinsights-azure-com
* privatelink-ods-opinsights-azure-com
* privatelink-agentsvc-azure-automation-net
* privatelink-blob-core-windows-net

> [!NOTE]
> Each of these zones maps specific Azure Monitor endpoints to private IPs from the virtual network's pool of IPs. The IP addresses shown in the following images are only examples. Your configuration should instead show private IPs from your own network.

#### privatelink-monitor-azure-com

This zone covers the global endpoints that Azure Monitor uses. These endpoints serve requests that consider all resources, not a specific one. This zone should have endpoints mapped for:

* `in.ai`: Application Insights ingestion endpoint (both a global and a regional entry).
* `api`: Application Insights and Log Analytics API endpoint.
* `live`: Application Insights live metrics endpoint.
* `profiler`: Application Insights profiler endpoint.
* `snapshot`: Application Insights snapshot endpoint.

[![Screenshot of the private D N S zone for global endpoints.](./media/private-link-security/dns-zone-privatelink-monitor-azure-com.png)](./media/private-link-security/dns-zone-privatelink-monitor-azure-com-expanded.png#lightbox)

#### privatelink-oms-opinsights-azure-com

This zone covers workspace-specific mapping to Operations Management Suite (OMS) endpoints. You should see an entry for each workspace linked to the Azure Monitor Private Link Scope that's connected with this private endpoint.

[![Screenshot of the private D N S zone for mapping to O M S endpoints.](./media/private-link-security/dns-zone-privatelink-oms-opinsights-azure-com.png)](./media/private-link-security/dns-zone-privatelink-oms-opinsights-azure-com-expanded.png#lightbox)

#### privatelink-ods-opinsights-azure-com

This zone covers workspace-specific mapping to Operational Data Store (ODS) endpoints - the ingestion endpoint of Log Analytics. You should see an entry for each workspace linked to the Azure Monitor Private Link Scope connected with this private endpoint.

[![Screenshot of the private D N S zone for mapping to O D S endpoints.](./media/private-link-security/dns-zone-privatelink-ods-opinsights-azure-com.png)](./media/private-link-security/dns-zone-privatelink-ods-opinsights-azure-com-expanded.png#lightbox)

#### privatelink-agentsvc-azure-automation-net

This zone covers workspace-specific mapping to the agent service automation endpoints. You should see an entry for each workspace linked to the Azure Monitor Private Link Scope connected with this private endpoint.

[![Screenshot of the private D N S zone for mapping to agent service automation endpoints.](./media/private-link-security/dns-zone-privatelink-agentsvc-azure-automation-net.png)](./media/private-link-security/dns-zone-privatelink-agentsvc-azure-automation-net-expanded.png#lightbox)

#### privatelink-blob-core-windows-net

This zone configures connectivity to the global agents' storage account for solution packs. Through it, agents can download new or updated solution packs (also known as management packs). Only one entry is required to handle to Log Analytics agents, no matter how many workspaces are used.

[![Screenshot of the private D N S zone for connectivity to the global agents' storage account for solution packs.](./media/private-link-security/dns-zone-privatelink-blob-core-windows-net.png)](./media/private-link-security/dns-zone-privatelink-blob-core-windows-net-expanded.png#lightbox)

> [!NOTE]
> This entry is only added to Private Link setups created on or after April 19, 2021 (or starting June 2021 on Azure Sovereign clouds).

### Validating that you're communicating over a Private Link connection

To validate that your requests are now sent through the private endpoint, you can review them with a network tracking tool or even your browser. For example, when you're trying to query your workspace or application, make sure the request is sent to the private IP that's mapped to the API endpoint. In this example, it's 172.17.0.9.

> [!NOTE]
> Some browsers might use [other DNS settings](#browser-dns-settings). Make sure that your DNS settings apply.

To make sure that your workspace or component isn't receiving requests from public networks (not connected through an Azure Monitor Private Link Scope), set the resource's public ingestion and query flags to **No** as explained in [Configure access to your resources](#configure-access-to-your-resources).

From a client on your protected network, use `nslookup` for any of the endpoints listed in your DNS zones. Your DNS server should resolve it to the mapped private IPs instead of the public IPs that are used by default.

## Use APIs and the command line

You can automate the process of using Azure Resource Manager templates, REST, and command-line interfaces.

To create and manage Azure Monitor Private Link Scopes, use the [REST API](/rest/api/monitor/privatelinkscopes(preview)/private%20link%20scoped%20resources%20(preview)) or the [Azure CLI (az monitor private-link-scope)](/cli/azure/monitor/private-link-scope).

To manage the network access flag on your workspace or component, use the flags `[--ingestion-access {Disabled, Enabled}]` and `[--query-access {Disabled, Enabled}]` on [Log Analytics workspaces](/cli/azure/monitor/log-analytics/workspace) or [Application Insights components](/cli/azure/ext/application-insights/monitor/app-insights/component).

### Example Azure Resource Manager template

The following Azure Resource Manager template creates:

* An Azure Monitor Private Link Scope named *my-scope*.
* A Log Analytics workspace named *my-workspace*.
* A scoped resource named *my-workspace-connection* added to the *my-scope* Azure Monitor Private Link Scope. 

```
{
    "$schema": https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#,
    "contentVersion": "1.0.0.0",
    "parameters": {
        "private_link_scope_name": {
            "defaultValue": "my-scope",
            "type": "String"
        },
        "workspace_name": {
            "defaultValue": "my-workspace",
            "type": "String"
        }
    },
    "variables": {},
    "resources": [
        {
            "type": "microsoft.insights/privatelinkscopes",
            "apiVersion": "2019-10-17-preview",
            "name": "[parameters('private_link_scope_name')]",
            "location": "global",
            "properties": {}
        },
        {
            "type": "microsoft.operationalinsights/workspaces",
            "apiVersion": "2020-10-01",
            "name": "[parameters('workspace_name')]",
            "location": "westeurope",
            "properties": {
                "sku": {
                    "name": "pergb2018"
                },
                "publicNetworkAccessForIngestion": "Enabled",
                "publicNetworkAccessForQuery": "Enabled"
            }
        },
        {
            "type": "microsoft.insights/privatelinkscopes/scopedresources",
            "apiVersion": "2019-10-17-preview",
            "name": "[concat(parameters('private_link_scope_name'), '/', concat(parameters('workspace_name'), '-connection'))]",
            "dependsOn": [
                "[resourceId('microsoft.insights/privatelinkscopes', parameters('private_link_scope_name'))]",
                "[resourceId('microsoft.operationalinsights/workspaces', parameters('workspace_name'))]"
            ],
            "properties": {
                "linkedResourceId": "[resourceId('microsoft.operationalinsights/workspaces', parameters('workspace_name'))]"
            }
        }
    ]
}
```

## Collect custom logs and IIS logs over Private Link

Storage accounts are used in the ingestion process of custom logs. By default, the process uses service-managed storage accounts. To ingest custom logs on Private Link, you must use your own storage accounts and associate them with Log Analytics workspaces. You can set up such accounts by using the [command line](/cli/azure/monitor/log-analytics/workspace/linked-storage).

For more information on bringing your own storage account, see [Customer-owned storage accounts for log ingestion](private-storage.md).

## Restrictions and limitations

### Azure Monitor Private Link Scope

When you're planning your Private Link setup, consider the [limits on the Azure Monitor Private Link Scope object](#azure-monitor-private-link-scope-limits).

### Agents

To support secure ingestion to Log Analytics workspaces, you must use the latest versions of the Windows and Linux agents. Older versions can't upload monitoring data over a private network.

- **Log Analytics Windows agent**: Use Log Analytics agent version 10.20.18038.0 or later.
- **Log Analytics Linux agent**: Use agent version 1.12.25 or later. If you can't, run the following commands on your VM:

  ```cmd
  $ sudo /opt/microsoft/omsagent/bin/omsadmin.sh -X
  $ sudo /opt/microsoft/omsagent/bin/omsadmin.sh -w <workspace id> -s <workspace key>
  ```

### Azure portal

To use Azure Monitor portal experiences such as Application Insights and Log Analytics, you need to allow the Azure portal and Azure Monitor extensions to be accessible on the private networks. Add `AzureActiveDirectory`, `AzureResourceManager`, `AzureFrontDoor.FirstParty`, and `AzureFrontdoor.Frontend` [service tags](../../firewall/service-tags.md) to your network security group.

### Querying data

The [`externaldata` operator](/azure/data-explorer/kusto/query/externaldata-operator?pivots=azuremonitor) isn't supported over a Private Link connection. It reads data from storage accounts but doesn't guarantee that the storage is accessed privately.

### Programmatic access

To use the REST API, the [CLI](/cli/azure/monitor), or PowerShell with Azure Monitor on private networks, add the [service tags](../../virtual-network/service-tags-overview.md) `AzureActiveDirectory` and `AzureResourceManager` to your firewall.

### Application Insights SDK downloads from a content delivery network

Bundle the JavaScript code in your script so that the browser doesn't try to download code from a content delivery network. An example is provided on [GitHub](https://github.com/microsoft/ApplicationInsights-JS#npm-setup-ignore-if-using-snippet-setup).

### Browser DNS settings

If you're connecting to your Azure Monitor resources over a Private Link connection, traffic to these resources must go through the private endpoint that's configured on your network. To enable the private endpoint, update your DNS settings as explained in [Connect to a private endpoint](#connect-to-a-private-endpoint). 

Some browsers use their own DNS settings instead of the ones you set. The browser might try to connect to Azure Monitor public endpoints and bypass the Private Link connection entirely. Verify that your browser's settings don't override or cache old DNS settings. 

## Next steps

- Learn about [private storage](private-storage.md).