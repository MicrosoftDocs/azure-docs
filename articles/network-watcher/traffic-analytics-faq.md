---
title: Azure traffic analytics frequently asked questions | Microsoft Docs
description: Get answers to some of the most frequently asked questions about traffic analytics.
services: network-watcher
documentationcenter: na
author: damendo
ms.service: network-watcher
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload:  infrastructure-services
ms.date: 03/08/2018
ms.author: damendo
---

# Traffic Analytics frequently asked questions

This article collects in one place many of the most frequently asked questions about traffic analytics in Azure Network Watcher.


[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## What are the prerequisites to use traffic analytics?

Traffic Analytics requires the following prerequisites:

- A Network Watcher enabled subscription.
- Network Security Group (NSG) flow logs enabled for the NSGs you want to monitor.
- An Azure Storage account, to store raw flow logs.
- An Azure Log Analytics workspace, with read and write access.

Your account must meet one of the following to enable traffic analytics:

- Your account must have any one of the following role-based access control (RBAC) roles at the subscription scope: owner, contributor, reader, or network contributor.
- If your account is not assigned to one of the previously listed roles, it must be assigned to a custom role that is assigned the following actions, at the subscription level.
            
    - Microsoft.Network/applicationGateways/read
    - Microsoft.Network/connections/read
    - Microsoft.Network/loadBalancers/read 
    - Microsoft.Network/localNetworkGateways/read 
    - Microsoft.Network/networkInterfaces/read 
    - Microsoft.Network/networkSecurityGroups/read 
    - Microsoft.Network/publicIPAddresses/read
    - Microsoft.Network/routeTables/read
    - Microsoft.Network/virtualNetworkGateways/read 
    - Microsoft.Network/virtualNetworks/read
        
To check roles assigned to a user for a subscription:

1. Sign in to Azure by using **Login-AzAccount**. 

2. Select the required subscription by using **Select-AzSubscription**. 

3. To list all the roles that are assigned to a specified user, use
    **Get-AzRoleAssignment -SignInName [user email] -IncludeClassicAdministrators**. 

If you are not seeing any output, contact the respective subscription admin to get access to run the commands. For more details, see [Manage role-based access control with Azure PowerShell](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-powershell).


## In which Azure regions is Traffic Analytics available?

You can use traffic analytics for NSGs in any of the following supported regions:
- Canada Central
- West Central US
- East US
- East US 2
- North Central US
- South Central US
- Central US
- West US
- West US 2
- France Central
- West Europe
- North Europe
- Brazil South
- UK West
- UK South
- Australia East
- Australia Southeast 
- East Asia
- Southeast Asia
- Korea Central
- Central India
- South India
- Japan East
- Japan West
- US Gov Virginia
- China East 2

The Log Analytics workspace must exist in the following regions:
- Canada Central
- West Central US
- East US
- East US 2
- North Central US
- South Central US
- Central US
- West US
- West US 2
- France Central
- West Europe
- North Europe
- UK West
- UK South
- Australia East
- Australia Southeast
- East Asia
- Southeast Asia 
- Korea Central
- Central India
- Japan East
- US Gov Virginia
- China East 2

## Can the NSGs I enable flow logs for be in different regions than my workspace?

Yes, these NSGs can be in different regions than your Log Analytics workspace.

## Can multiple NSGs be configured within a single workspace?

Yes.

## Can I use an existing workspace?

Yes. If you select an existing workspace, make sure that it has been migrated to the new query language. If you do not want to upgrade the workspace, you need to create a new one. For more information about the new query language, see [Azure Monitor logs upgrade to new log search](../log-analytics/log-analytics-log-search-upgrade.md).

## Can my Azure Storage Account be in one subscription and my Log Analytics workspace be in a different subscription?

Yes, your Azure Storage account can be in one subscription, and your Log Analytics workspace can be in a different subscription.

## Can I store raw logs in a different subscription?

Yes. You can configure NSG Flow Logs to be sent to a storage account located in a different subscription, provided you have the appropriate privileges, and that the storage account is located in the same region as the NSG. The NSG and the destination storage account must also share the same Azure Active Directory Tenant.

## What if I can't configure an NSG for traffic analytics due to a "Not found" error?

Select a supported region. If you select a non-supported region, you receive a "Not found" error. The supported regions are listed earlier in this article.

## What if I am getting the status, “Failed to load,” under the NSG flow logs page?

The Microsoft.Insights provider must be registered for flow logging to work properly. If you are not sure whether the Microsoft.Insights provider is registered for your subscription, replace *xxxxx-xxxxx-xxxxxx-xxxx* in the following command, and run the following commands from PowerShell:

```powershell-interactive
**Select-AzSubscription** -SubscriptionId xxxxx-xxxxx-xxxxxx-xxxx
**Register-AzResourceProvider** -ProviderNamespace Microsoft.Insights
```

## I have configured the solution. Why am I not seeing anything on the dashboard?

The dashboard might take up to 30 minutes to appear the first time. The solution must first aggregate enough data for it to derive meaningful insights. Then it generates reports. 

## What if I get this message: “We could not find any data in this workspace for selected time interval. Try changing the time interval or select a different workspace.”?

Try the following options:
- Change the time interval in the upper bar.
- Select a different Log Analytics workspace in the upper bar.
- Try accessing traffic analytics after 30 minutes, if it was recently enabled.
    
If problems persist, raise concerns in the [User voice forum](https://feedback.azure.com/forums/217313-networking?category_id=195844).

## What if I get this message: “Analyzing your NSG flow logs for the first time. This process may take 20-30 minutes to complete. Check back after some time. 2) If the above step doesn’t work and your workspace is under the free SKU, then check your workspace usage here to validate over quota, else refer to FAQs for further information.”?

You might see this message because:
- Traffic Analytics was recently enabled, and might not yet have aggregated enough data for it to derive meaningful insights.
- You are using the free version of the Log Analytics workspace, and it exceeded the quota limits. You might need to use a workspace with a larger capacity.
    
If problems persist, raise concerns in the [User voice forum](https://feedback.azure.com/forums/217313-networking?category_id=195844).
    
## What if I get this message: “Looks like we have resources data (Topology) and no flows information. Meanwhile, click here to see resources data and refer to FAQs for further information.”?

You are seeing the resources information on the dashboard; however, no flow-related statistics are present. Data might not be present because of no communication flows between the resources. Wait for 60 minutes, and recheck status. If the problem persists, and you're sure that communication flows among resources exist, raise concerns in the [User voice forum](https://feedback.azure.com/forums/217313-networking?category_id=195844).

## Can I configure traffic analytics using PowerShell or an Azure Resource Manager template or client?

You can configure traffic analytics by using Windows PowerShell from version 6.2.1 onwards. To configure flow logging and traffic analytics for a specific NSG by using the Set cmdlet, see [Set-AzNetworkWatcherConfigFlowLog](https://docs.microsoft.com/powershell/module/az.network/set-aznetworkwatcherconfigflowlog). To get the flow logging and traffic analytics status for a specific NSG, see [Get-AzNetworkWatcherFlowLogStatus](https://docs.microsoft.com/powershell/module/az.network/get-aznetworkwatcherflowlogstatus).

Currently, you can't use an Azure Resource Manager template to configure traffic analytics.

To configure traffic analytics by using an Azure Resource Manager client, see the following examples.

**Set cmdlet example:**
```
#Requestbody parameters
$TAtargetUri ="/subscriptions/<NSG subscription id>/resourceGroups/<NSG resource group name>/providers/Microsoft.Network/networkSecurityGroups/<name of NSG>"
$TAstorageId = "/subscriptions/<storage subscription id>/resourcegroups/<storage resource group name> /providers/microsoft.storage/storageaccounts/<storage account name>"
$networkWatcherResourceGroupName = "<network watcher resource group name>"
$networkWatcherName = "<network watcher name>"

$requestBody = 
@"
{
    'targetResourceId': '${TAtargetUri}',
    'properties': 
    {
        'storageId': '${TAstorageId}',
        'enabled': '<true to enable flow log or false to disable flow log>',
        'retentionPolicy' : 
        {
            days: <enter number of days like to retail flow logs in storage account>,
            enabled: <true to enable retention or false to disable retention>
        }
    },
    'flowAnalyticsConfiguration':
    {
                'networkWatcherFlowAnalyticsConfiguration':
      {
        'enabled':,<true to enable traffic analytics or false to disable traffic analytics>
        'workspaceId':'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        'workspaceRegion':'<workspace region>',
        'workspaceResourceId':'/subscriptions/<workspace subscription id>/resourcegroups/<workspace resource group name>/providers/microsoft.operationalinsights/workspaces/<workspace name>'
        
      }

    }
}
"@
$apiversion = "2016-09-01"

armclient login
armclient post "https://management.azure.com/subscriptions/<NSG subscription id>/resourceGroups/<network watcher resource group name>/providers/Microsoft.Network/networkWatchers/<network watcher name>/configureFlowlog?api-version=${apiversion}" $requestBody
```
**Get cmdlet example:**
```
#Requestbody parameters
$TAtargetUri ="/subscriptions/<NSG subscription id>/resourceGroups/<NSG resource group name>/providers/Microsoft.Network/networkSecurityGroups/<NSG name>"


$requestBody = 
@"
{
    'targetResourceId': '${TAtargetUri}'
}
“@


armclient login
armclient post "https://management.azure.com/subscriptions/<NSG subscription id>/resourceGroups/<network watcher resource group name>/providers/Microsoft.Network/networkWatchers/<network watcher name>/queryFlowLogStatus?api-version=${apiversion}" $requestBody
```


## How is Traffic Analytics priced?

Traffic Analytics is metered. The metering is based on processing of flow log data by the service, and storing the resulting enhanced logs in a Log Analytics workspace. 

For example, as per the [pricing plan](https://azure.microsoft.com/pricing/details/network-watcher/), considering West Central US region, if flow logs data stored in a storage account processed by Traffic Analytics is 10 GB and enhanced logs ingested in Log Analytics workspace is 1 GB then the applicable charges are:
10 x 2.3$ + 1 x 2.76$ = 25.76$

## How frequently does Traffic Analytics process data?

Refer to the [data aggregation section](https://docs.microsoft.com/azure/network-watcher/traffic-analytics-schema#data-aggregation) in Traffic Analytics Schema and Data Aggregation Document

## How does Traffic Analytics decide that an IP is malicious? 

Traffic Analytics relies on Microsoft internal threat intelligence systems to deem an IP as malicious. These systems leverage diverse telemetry sources like Microsoft products and services,the Microsoft Digital Crimes Unit (DCU), the Microsoft Security Response Center (MSRC), and external feeds and build a lot of intelligence on top of it. 
Some of this data is Microsoft Internal. If a known IP is getting flagged as malicious, please raise a support ticket to know the details.

## How can I set alerts on Traffic Analytics data?

Traffic Analytics does not have inbuilt support for alerts. However, since Traffic Analytics data is stored in Log Analytics you can write custom queries and set alerts on them. 
Steps :
- You can use the shortlink for Log Analytics in Traffic Analytics. 
- Use the [schema documented here](traffic-analytics-schema.md) to write your queries 
- Click "New alert rule" to create the alert
- Refer to [log alerts documentation](https://docs.microsoft.com/azure/azure-monitor/platform/alerts-log) to create the alert

## How do I check which VMs are receiving most on-premise traffic

            AzureNetworkAnalytics_CL
            | where SubType_s == "FlowLog" and FlowType_s == "S2S" 
            | where <Scoping condition>
            | mvexpand vm = pack_array(VM1_s, VM2_s) to typeof(string)
            | where isnotempty(vm) 
             | extend traffic = AllowedInFlows_d + DeniedInFlows_d + AllowedOutFlows_d + DeniedOutFlows_d // For bytes use: | extend traffic = InboundBytes_d + OutboundBytes_d 
            | make-series TotalTraffic = sum(traffic) default = 0 on FlowStartTime_t from datetime(<time>) to datetime(<time>) step 1m by vm
            | render timechart

  For IPs:

            AzureNetworkAnalytics_CL
            | where SubType_s == "FlowLog" and FlowType_s == "S2S" 
            //| where <Scoping condition>
            | mvexpand IP = pack_array(SrcIP_s, DestIP_s) to typeof(string)
            | where isnotempty(IP) 
            | extend traffic = AllowedInFlows_d + DeniedInFlows_d + AllowedOutFlows_d + DeniedOutFlows_d // For bytes use: | extend traffic = InboundBytes_d + OutboundBytes_d 
            | make-series TotalTraffic = sum(traffic) default = 0 on FlowStartTime_t from datetime(<time>) to datetime(<time>) step 1m by IP
            | render timechart

For time, use format : yyyy-mm-dd 00:00:00

## How do I check standard deviation in traffic recieved by my VMs from on-premise machines

            AzureNetworkAnalytics_CL
            | where SubType_s == "FlowLog" and FlowType_s == "S2S" 
            //| where <Scoping condition>
            | mvexpand vm = pack_array(VM1_s, VM2_s) to typeof(string)
            | where isnotempty(vm) 
            | extend traffic = AllowedInFlows_d + DeniedInFlows_d + AllowedOutFlows_d + DeniedOutFlows_d // For bytes use: | extend traffic = InboundBytes_d + OutboundBytes_d
            | summarize deviation = stdev(traffic)  by vm


For IPs:

            AzureNetworkAnalytics_CL
            | where SubType_s == "FlowLog" and FlowType_s == "S2S" 
            //| where <Scoping condition>
            | mvexpand IP = pack_array(SrcIP_s, DestIP_s) to typeof(string)
            | where isnotempty(IP) 
            | extend traffic = AllowedInFlows_d + DeniedInFlows_d + AllowedOutFlows_d + DeniedOutFlows_d // For bytes use: | extend traffic = InboundBytes_d + OutboundBytes_d
            | summarize deviation = stdev(traffic)  by IP
            
## How do I check which ports are reachable (or bocked) between IP pairs with NSG rules

            AzureNetworkAnalytics_CL
            | where SubType_s == "FlowLog" and TimeGenerated between (startTime .. endTime)
            | extend sourceIPs = iif(isempty(SrcIP_s), split(SrcPublicIPs_s, " ") , pack_array(SrcIP_s)),
            destIPs = iif(isempty(DestIP_s), split(DestPublicIPs_s," ") , pack_array(DestIP_s))
            | mvexpand SourceIp = sourceIPs to typeof(string)
            | mvexpand DestIp = destIPs to typeof(string)
            | project SourceIp = tostring(split(SourceIp, "|")[0]), DestIp = tostring(split(DestIp, "|")[0]), NSGList_s, NSGRule_s, DestPort_d, L4Protocol_s, FlowStatus_s 
            | summarize DestPorts= makeset(DestPort_d) by SourceIp, DestIp, NSGList_s, NSGRule_s, L4Protocol_s, FlowStatus_s

## How can I navigate by using the keyboard in the geo map view?

The geo map page contains two main sections:
    
- **Banner**: The banner at the top of the geo map provides buttons to select traffic distribution filters (for example, Deployment, Traffic from countries/regions, and Malicious). When you select a button, the respective filter is applied on the map. For example, if you select the Active button, the map highlights the active datacenters in your deployment.
- **Map**: Below the banner, the map section shows traffic distribution among Azure datacenters and countries/regions.
    
### Keyboard navigation on the banner
    
- By default, the selection on the geo map page for the banner is the “Azure DCs” filter.
- To move to another filter, use either the `Tab` or the `Right arrow` key. To move backward, use either the `Shift+Tab` or the `Left arrow` key. Forward navigation is left to right, followed by top to bottom.
- Press `Enter` or the `Down` arrow key to apply the selected filter. Based on filter selection and deployment, one or multiple nodes under the map section are highlighted.
- To switch between banner and map, press `Ctrl+F6`.
        
### Keyboard navigation on the map
    
- After you have selected any filter on the banner and pressed `Ctrl+F6`, focus moves to one of the highlighted nodes (**Azure datacenter** or **Country/Region**) in the map view.
- To move to other highlighted nodes in the map, use either `Tab` or the `Right arrow` key for forward movement. Use `Shift+Tab` or the `Left arrow` key for backward movement.
- To select any highlighted node in the map, use the `Enter` or `Down arrow` key.
- On selection of any such nodes, focus moves to the **Information Tool Box** for the node. By default, focus moves to the closed button on the **Information Tool Box**. To further move inside the **Box** view, use `Right arrow` and `Left arrow` keys to move forward and backward, respectively. Pressing `Enter` has same effect as selecting the focused button in the **Information Tool Box**.
- When you press `Tab` while the focus is on the **Information Tool Box**, the focus moves to the end points in the same continent as the selected node. Use the `Right arrow` and `Left arrow` keys to move through these endpoints.
- To move to other flow endpoints or continent clusters, use `Tab` for forward movement and `Shift+Tab` for backward movement.
- When the focus is on **Continent clusters**, use the `Enter` or `Down` arrow keys to highlight the endpoints inside the continent cluster. To move through endpoints and the close button on the information box of the continent cluster, use either the `Right arrow` or `Left arrow` key for forward and backward movement, respectively. On any endpoint, you can use `Shift+L` to switch to the connection line from the selected node to the endpoint. You can press `Shift+L` again to move to the selected endpoint.
        
### Keyboard navigation at any stage
    
- `Esc` collapses the expanded selection.
- The `Up arrow` key performs the same action as `Esc`. The `Down arrow` key performs the same action as `Enter`.
- Use `Shift+Plus` to zoom in, and `Shift+Minus` to zoom out.

## How can I navigate by using the keyboard in the virtual network topology view?

The virtual networks topology page contains two main sections:
    
- **Banner**: The banner at the top of the virtual networks topology provides buttons to select traffic distribution filters (for example, Connected virtual networks, Disconnected virtual networks, and Public IPs). When you select a button, the respective filter is applied on the topology. For example, if you select the Active button, the topology highlights the active virtual networks in your deployment.
- **Topology**: Below the banner, the topology section shows traffic distribution among virtual networks.
    
### Keyboard navigation on the banner
    
- By default, the selection on the virtual networks topology page for the banner is the “Connected VNets” filter.
- To move to another filter, use the `Tab` key to move forward. To move backward, use the `Shift+Tab` key. Forward navigation is left to right, followed by top to bottom.
- Press `Enter` to apply the selected filter. Based on the filter selection and deployment, one or multiple nodes (virtual network) under the topology section are highlighted.
- To switch between the banner and the topology, press `Ctrl+F6`.
        
### Keyboard navigation on the topology
    
- After you have selected any filter on the banner and pressed `Ctrl+F6`, focus moves to one of the highlighted nodes (**VNet**) in the topology view.
- To move to other highlighted nodes in the topology view, use the `Shift+Right arrow` key for forward movement. 
- On highlighted nodes, focus moves to the **Information Tool Box** for the node. By default, focus moves to the **More details** button on the **Information Tool Box**. To further move inside the **Box** view, use the `Right arrow` and `Left arrow` keys to move forward and backward, respectively. Pressing `Enter` has same effect as selecting the focused button in the **Information Tool Box**.
- On selection of any such nodes, you can visit all its connections, one by one, by pressing the `Shift+Left arrow` key. Focus moves to the **Information Tool Box** of that connection. At any point, the focus can be shifted back to the node by pressing `Shift+Right arrow` again.
    

## How can I navigate by using the keyboard in the subnet topology view?

The virtual subnetworks topology page contains two main sections:
    
- **Banner**: The banner at the top of the virtual subnetworks topology provides buttons to select traffic distribution filters (for example, Active, Medium, and Gateway subnets). When you select a button, the respective filter is applied on the topology. For example, if you select the Active button, the topology highlights the active virtual subnetwork in your deployment.
- **Topology**: Below the banner, the topology section shows traffic distribution among virtual subnetworks.
    
### Keyboard navigation on the banner
    
- By default, the selection on the virtual subnetworks topology page for the banner is the “Subnets” filter.
- To move to another filter, use the `Tab` key to move forward. To move backward, use the `Shift+Tab` key. Forward navigation is left to right, followed by top to bottom.
- Press `Enter` to apply the selected filter. Based on filter selection and deployment, one or multiple nodes (Subnet) under the topology section are highlighted.
- To switch between the banner and the topology, press `Ctrl+F6`.
        
### Keyboard navigation on the topology
    
- After you have selected any filter on the banner and pressed `Ctrl+F6`, focus moves to one of the highlighted nodes (**Subnet**) in the topology view.
- To move to other highlighted nodes in the topology view, use the `Shift+Right arrow` key for forward movement. 
- On highlighted nodes, focus moves to the **Information Tool Box** for the node. By default, focus moves to the **More details** button on the **Information Tool Box**. To further move inside the **Box** view, use `Right arrow` and `Left arrow` keys to move forward and backward, respectively. Pressing `Enter` has same effect as selecting the focused button in the **Information Tool Box**.
- On selection of any such nodes, you can visit all its connections, one by one, by pressing `Shift+Left arrow` key. Focus moves to the **Information Tool Box** of that connection. At any point, the focus can be shifted back to the node by pressing `Shift+Right arrow` again.    

