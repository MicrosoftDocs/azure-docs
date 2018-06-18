---
title: Azure traffic analytics frequently asked questions | Microsoft Docs
description: Get answers to some of the most frequently asked questions about traffic analytics.
services: network-watcher
documentationcenter: na
author: jimdial
manager: jeconnoc
editor: 

ms.service: network-watcher
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload:  infrastructure-services
ms.date: 03/08/2018
ms.author: jdial
---

# Traffic analytics frequently asked questions

This article collects in one place many of the most frequently asked questions about traffic analytics in Azure Network Watcher.

## What are the prerequisites to use traffic analytics?

Traffic Analytics requires the following prerequisites:

- A Network Watcher enabled subscription.
- Network Security Group (NSG) flow logs enabled for the NSGs you want to monitor.
- An Azure Storage account, to store raw flog logs.
- An Azure Log Analytics workspace, with read and write access.

Additionally, you must have the following at the subscription level:
    
- You must be an account administrator, a service administrator, or a co-administrator.
        
- Your account must have any one of the following role-based access control (RBAC) roles at the subscription scope: owner, contributor, reader, or network contributor.

- Your account must have any custom RBAC roles with permission to all of the following actions at the subscription level:
            
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

1. Sign in to Azure by using **Login-AzureRmAccount**. 

2. Select the required subscription by using **Select-AzureRmSubscription**. 

3. To list all the roles that are assigned to a specified user, use
    **Get-AzureRmRoleAssignment -SignInName [user email] -IncludeClassicAdministrators**. 

If you are not seeing any output, contact the respective subscription admin to get access to run the commands. For more details, see [Manage role-based access control with Azure PowerShell](https://docs.microsoft.com/en-us/azure/role-based-access-control/role-assignments-powershell).


## In which Azure regions are traffic analytics available?

During the preview release, you can use traffic analytics for NSGs in any of the following supported regions: West Central US, East US, East US 2, North Central US, South Central US, Central US, West US, West US 2, West Europe, North Europe, UK West, UK South, Australia East, Australia Southeast and Southeast Asia. The Log Analytics workspace must exist in the West Central US, East US, West Europe, UK South, Australia Southeast, or the Southeast Asia region.

## Can the NSGs I enable flow logs for be in different regions than my workspace?

Yes, these NSGs can be in different regions than your Log Analytics workspace.

## Can multiple NSGs be configured within a single workspace?

Yes.

## Can I use an existing workspace?

Yes. If you select an existing workspace, make sure that it has been migrated to the new query language. If you do not want to upgrade the workspace, you need to create a new one. For more information about the new query language, see [Azure Log Analytics upgrade to new log search](../log-analytics/log-analytics-log-search-upgrade.md).

## Can my Azure Storage Account be in a different subscription?

Yes, your Azure Storage account can be in one subscription, and your Log Analytics workspace can be in a different subscription.

## Can I store raw logs in a different subscription?

No. You can store raw logs in any storage account where an NSG is enabled for flow logs. However, both the storage account and the raw logs must be in the same subscription and region.

## What if I can't configure an NSG for traffic analytics due to a "Not found" error?

Select a supported region. If you select a non-supported region, you receive a "Not found" error. The supported regions are listed earlier in this article.

## What if I am getting the NSG status, “Failed to load”?

The Microsoft.Insights provider must be registered for flow logging to work properly. If you are not sure whether the Microsoft.Insights provider is registered for your subscription, replace *xxxxx-xxxxx-xxxxxx-xxxx* in the following command, and run the following commands from PowerShell:

    ```powershell-interactive
    **Select-AzureRmSubscription** -SubscriptionId xxxxx-xxxxx-xxxxxx-xxxx
    **Register-AzureRmResourceProvider** -ProviderNamespace Microsoft.Insights
    ```

10. I have configured the solution. Why am I not seeing anything on the dashboard?

    The dashboard may take up to 30 mins to appear the first time. The solution must first aggregate enough data for it to derive meaningful insights, before any reports are generated. 

11.  If I receive the following message: “We could not find any data in this workspace for selected time interval. Try changing the time interval or select a different workspace”, how do I resolve it?

        Try the following options:
        - Try changing time interval in the upper bar.
        - Select a different Log Analytics Workspace in the upper bar
        - Try accessing Traffic Analytics after 30 mins, if it was recently enabled
    
        If issues persist, raise concerns in the [User voice forum](https://feedback.azure.com/forums/217313-networking?category_id=195844).

12.  If I receive the following message: “1) Analyzing your NSG flow logs for the first time. This process may take 20-30 minutes to complete. Check back after some time. 2) If the above step doesn’t work and your workspace is under the free SKU, then check your workspace usage here to validate over quota, else refer to FAQs for further information”, how do I resolve it?

        You may receive the error for the following reasons:
        - Traffic analytics may have been recently enabled and may not yet have aggregated enough data for it to derive meaningful insights.
        - Your OMS Workspace is under the free SKU and it breached the quota limits. In this case, you may need to use a workspace in a SKU with larger capacity.
    
        If issues persist, raise concerns in the [User voice forum](https://feedback.azure.com/forums/217313-networking?category_id=195844).
    
13.  If I receive the following message: “Looks like we have resources data (Topology) and no flows information. Meanwhile, click here to see resources data and refer to FAQs for further information”, how do I resolve it?

        You are seeing the resources information on the dashboard; however, no flow-related statistics are present. Data may not be present because of no communication flows between the resources. Wait for 60 mins and recheck status. If you're sure that communication flows among resources exist, then raise concerns in the [User voice forum](https://feedback.azure.com/forums/217313-networking?category_id=195844).

14. Can I configure traffic analytics using PowerShell or an Azure Resource Manager template?

        Yes, traffic analytics configuration using windows powershell is supported from version 6.2.1 onwards, however Azure Resource Manager template support is not available at present. To learn more, how PowerShell can be used to configure traffic analytics please refer following [documentation](https://docs.microsoft.com/en-us/powershell/module/azurerm.network/set-azurermnetworkwatcherconfigflowlog?view=azurermps-6.2.0). 

15.  How is traffic analytics priced?

        Traffic analytics is metered for flow log data processed by the service and storing the resulted enhanced logs in a Log Analytics workspace. To know more about pricing plan please [click here](https://azure.microsoft.com/en-us/pricing/details/network-watcher/) 

16.  How can I navigate using Keyboard in Geo Map View?

        The geo-map page contains two main sections:
    
        - **Banner**: The banner placed in the top of the Geo Map provides the capability to select traffic distribution filters via buttons like Deployment/No Deployment/Active/Inactive/Traffic Analytics Enabled/Traffic Analytics not enabled/Traffic from countries/Benign/Malicious/Allowed malicious traffic, and legend information. On the selection of defined buttons, the respective filter is applied on the Map, like if a user selects the “Active” filter button under the banner, then the map highlights the “Active” datacenters in your deployment.
        - **Map**: The Map section placed below the banner shows traffic distribution among Azure datacenters and countries.
    
        **Keyboard Navigation on Banner**
    
        - By default, the selection on the geo-map page for the banner is the filter “Azure DCs” button.
        - To navigate to another filters button, you can either use the `Tab` or `Right arrow` key to move next. To navigate backward, use either `Shift+Tab` or the `Left arrow` key. Forward navigation direction precedence is left to right, followed by top to bottom.
        - Press the `Enter` or `Down` arrow key to apply the selected filter. Based on filter selection and deployment, one or multiple nodes under the Map section are    highlighted.
            - To switch between **Banner** and **Map**, press `Ctrl+F6`.
        
        **Keyboard Navigation on Map**
    
        - Once you have selected any filter on the banner and pressed `Ctrl+F6`, focus moves to one of the highlighted nodes (**Azure datacenter** or **Country/Region**) in the map view.
        - To navigate to other highlighted nodes in the map you can either use the `Tab` or `Right arrow` keys for forward movement, and `Shift+Tab` or the `Left arrow` key for backward movement.
        - To select any highlighted node in the map, use the `Enter` or `Down arrow` key.
        - On selection of any such nodes, focus moves to the **Information Tool Box** for the node. By default, focus moves to the closed button on the **Information Tool Box**. To further navigate inside **Box** view, use `Right` and `Left arrow` keys to move forward and backward, respectively. Pressing `Enter` has same effect as selecting the focused button in the **Information Tool Box**.
        - Pressing `Tab` while the focus is on the **Information Tool Box**, the focus moves to the end points in the same continent as the selected node. You can use the `Right` and `Left arrow` keys to navigate through these endpoints.
        - To navigate to other flow endpoints/continents cluster, use `Tab` for forward movement and `Shift+Tab` for backward movement.
        - Once focus is on `Continent clusters`, use the `Enter` or `Down` arrow keys to highlight the endpoints inside the continent cluster. To navigate through endpoints and the close button on the information box of the continent cluster, use either the `Right` or `Left arrow` key for forward and backward movement, respectively. On any endpoint, you can use `Shift+L` to switch to the connection line from the selected node to the endpoint. Pressing `Shift+L` again navigates you to the selected endpoint.
        
        At any stage:
    
        - `ESC` collapses the expanded selection.
        - The `UP Arrow` key performs the same action as `ESC`. The `Down arrow` key performs the same action as `Enter`.
        - Use `Shift+Plus` to zoom in, and `Shift+Minus` to zoom out.

17. How can I navigate using Keyboard in VNet Topology View?

    The virtual networks topology page contains two main sections:
    
    - **Banner**: The banner placed in the top of the Virtual Networks Topology provides the capability to select traffic distribution filters via buttons like Connected VNets/Disconnected VNets/Active/Inactive/On-Premise/Azure region/Public IPs/Heavy/Medium/Low/Allowed/Blocked, and legend information. On the selection of defined buttons, the respective filter is applied on the topology, like if a user selects the “Active” filter button under the banner, then the topology highlights the “Active” VNets in your deployment.
    - **Topology**: The Topology section placed below the banner shows traffic distribution among VNets.
    
    **Keyboard Navigation on Banner**
    
    - By default, the selection on the virtual networks topology page for the banner is the filter “Connected VNets” button.
    - To navigate to another filters button, you can use the `Tab` key to move next. To navigate backward, use `Shift+Tab` key. Forward navigation direction precedence is left to right, followed by top to bottom.
    - Press the `Enter` arrow key to apply the selected filter. Based on filter selection and deployment, one or multiple nodes (VNet) under the Topology section are highlighted.
        - To switch between **Banner** and **Topology**, press `Ctrl+F6`.
        
    **Keyboard Navigation on Topology**
    
    - Once you have selected any filter on the banner and pressed `Ctrl+F6`, focus moves to one of the highlighted nodes (**VNet**) in the topology view.
    - To navigate to other highlighted nodes in the topology view you can use the `Shift+Right arrow` key for forward movement. 
    - On highlighted nodes, focus moves to the **Information Tool Box** for the node. By default, focus moves to “More details” button on the **Information Tool Box**. To further navigate inside **Box** view, use `Right` and `Left arrow` keys to move forward and backward, respectively. Pressing `Enter` has same effect as selecting the focused button in the **Information Tool Box**.
    - On selection of any such nodes, it’s all connections can be visited, one by one, by pressing `Shift+Left arrow` key. Focus moves to the **Information Tool Box** of that connection. At any point, the focus can be shifted back to the node by pressing `Shift+Right arrow` again.
    

18. How can I navigate using Keyboard in Subnet Topology View?

    The virtual subnetworks topology page contains two main sections:
    
    - **Banner**: The banner placed in the top of the Virtual Subnetworks Topology provides the capability to select traffic distribution filters via buttons like Active/Inactive/External Connections/On-Premise/Azure region/Public IPs/Active Flows/Heavy/Medium/Low/Malicious Traffic/Allowed/Blocked, Gateway subnets/Backend subnets and Frontend subnets. On the selection of defined buttons, the respective filter is applied on the topology, like if a user selects the “Active” filter button under the banner, then the topology highlights the “Active” Virtual Subnetwork in your deployment.
    - **Topology**: The Topology section placed below the banner shows traffic distribution among Virtual Subnetworks.
    
    **Keyboard Navigation on Banner**
    
    - By default, the selection on the Virtual Subnetworks Topology page for the banner is the filter “Subnets” button.
    - To navigate to another filters button, you can use the `Tab` key to move next. To navigate backward, use `Shift+Tab` key. Forward navigation direction precedence is left to right, followed by top to bottom.
    - Press the `Enter` arrow key to apply the selected filter. Based on filter selection and deployment, one or multiple nodes (Subnet) under the Topology section are highlighted.
        - To switch between **Banner** and **Topology**, press `Ctrl+F6`.
        
    **Keyboard Navigation on Topology**
    
    - Once you have selected any filter on the banner and pressed `Ctrl+F6`, focus moves to one of the highlighted nodes (**Subnet**) in the topology view.
    - To navigate to other highlighted nodes in the topology view you can use the `Shift+Right arrow` key for forward movement. 
    - On highlighted nodes, focus moves to the **Information Tool Box** for the node. By default, focus moves to “More details” button on the **Information Tool Box**. To further navigate inside **Box** view, use `Right` and `Left arrow` keys to move forward and backward, respectively. Pressing `Enter` has same effect as selecting the focused button in the **Information Tool Box**.
    - On selection of any such nodes, it’s all connections can be visited, one by one, by pressing `Shift+Left arrow` key. Focus moves to the **Information Tool Box** of that connection. At any point, the focus can be shifted back to the node by pressing `Shift+Right arrow` again.    

