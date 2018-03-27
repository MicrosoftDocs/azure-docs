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

1.  What are the pre-requisites to use traffic analytics?

    Traffic Analytics requires the following pre-requisites:

    - A Network Watcher enabled subscription
    - NSG flow logs enabled for the NSGs you want to monitor
    - An Azure Storage account, to store raw flog logs
    - A Log Analytics (OMS) Workspace, with read and write access
    - Your account must be assigned the following actions on the Microsoft.Network provider:

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

2.  Which Azure regions are traffic analytics available in?

    While in preview release, you can use traffic analytics for NSGs in any of the following **supported regions**: West Central US, East US, East US 2, North Central US, South Central US, Central US, West US, West US-2, West Europe, North Europe, West UK, South UK, Australia East, and Australia Southeast. The Log Analytics workspace must exist in the West Central US, East US, West Europe, Australia Southeast, or the South UK region.

3.  Can the NSGs I enable flow logs for be in different regions than my OMS Workspace?

    Yes

4.  Can multiple NSGs be configured within a single workspace?

    Yes

5.  Can I use an existing OMS Workspace?

    Yes, if you select an existing workspace, make sure that it has been migrated to the new query language. If you do not wish to upgrade the workspace; you need to create a new one. For more information about the new query language, see [Azure Log Analytics upgrade to new log search](../log-analytics/log-analytics-log-search-upgrade.md).

6.  Can my Azure Storage Account be in one subscription and my OMS Workspace be in a different subscription?

    Yes

7.  Can I store raw logs in different Storage Account in different subscription?

    No. You can store raw logs in any storage account where an NSG is enabled for flow logs, however, both the storage account and the raw logs must be in the same subscription and region.

8.  If I receive a "Not found" error while configuring an NSG for traffic analytics, how can I resolve it?

    Select a supported region listed in question 2. If you select a non-supported region, you receive a "Not found" error.

9.  Under NSG flow logs, I am getting NSG status as “Failed to load”, what to do next?

    The Microsoft.Insights provider must be registered for flow logging to work properly. If you are not sure whether the Microsoft.Insights provider is registered or not for your subscription, replace *xxxxx-xxxxx-xxxxxx-xxxx* in the following command and then run the following commands from PowerShell:

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
        - Traffic analytics may have been recently enabled and may be aggregating enough data for it to derive meaningful insights before any reports can be generated. In this case, try again after 30 minutes
        - Your OMS Workspace is under the free SKU and it breached the quota limits. In this case, you may need to use a workspace in a SKU with larger capacity.
    
        If issues persist, raise concerns in the [User voice forum](https://feedback.azure.com/forums/217313-networking?category_id=195844).
    
13.  If I receive the following message: “Looks like we have resources data (Topology) and no flows information. Meanwhile, click here to see resources data and refer to FAQs for further information”, how do I resolve it?

        You are seeing the resources information on the dashboard; however, no flow-related statistics are present. Data may not be present because of no communication flows between the resources. Wait for 60 mins and recheck status. If you're sure that communication flows among resources exist, then raise concerns in the [User voice forum](https://feedback.azure.com/forums/217313-networking?category_id=195844).

14.  How is traffic analytics priced?

        Traffic analytics is metered for enhancing reduced logs, and storing the enhanced logs in a Log Analytics workspace. While in preview, traffic analytics is not billed for enhancing the reduced logs, however retention of data in a workspace is subject to billing at published rates. This answer will be updated once pricing for traffic analytics is available.

15.  How can I navigate using Keyboard in Geo Map View?

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
