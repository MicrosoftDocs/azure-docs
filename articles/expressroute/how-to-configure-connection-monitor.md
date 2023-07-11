---
title: 'Configure Connection Monitor for Azure ExpressRoute'
description: Configure cloud-based network connectivity monitoring for Azure ExpressRoute circuits. This covers monitoring over ExpressRoute private peering and Microsoft peering.
services: expressroute
author: duongau
ms.service: expressroute
ms.topic: how-to
ms.date: 06/30/2023
ms.author: duau
---

# Configure Connection Monitor for ExpressRoute

This article helps you configure a Connection Monitor extension to monitor ExpressRoute. Connection Monitor is a cloud-based network monitoring solution that monitors connectivity between Azure cloud deployments and on-premises locations (Branch offices, etc.). Connection Monitor is part of Azure Monitor logs.  The extension also lets you monitor network connectivity for your private and Microsoft peering connections. When you configure Connection Monitor for ExpressRoute, you can detect network issues to identify and eliminate.

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../includes/azure-monitor-log-analytics-rebrand.md)]

With Connection Monitor for ExpressRoute you can:

* Monitor loss and latency across various VNets and set alerts.

* Monitor all paths (including redundant paths) on the network.

* Troubleshoot transient and point-in-time network issues that are difficult to replicate.

* Help determine a specific segment on the network that is responsible for degraded performance.

## <a name="workflow"></a> Workflow

Monitoring agents are installed on multiple servers, both on-premises and in Azure. The agents communicate with each other by sending TCP handshake packets. The communication between the agents allows Azure to map the network topology and path the traffic could take.

1. Create a Log Analytics workspace.

1. Install and configure software agents. (If you only want to monitor over Microsoft Peering, you don't need to install and configure software agents.):

    * Install monitoring agents on the on-premises servers and the Azure VMs (for private peering).
    * Configure settings on the monitoring agent servers to allow the monitoring agents to communicate. (Open firewall ports, etc.)

1. Configure network security group (NSG) rules to allow the monitoring agent installed on Azure VMs to communicate with on-premises monitoring agents.

1. Enable Network Watcher on your subscription.

1. Set up monitoring: Create connection monitors with test groups to monitor source and destination endpoints across your network.

If you're already using Network Performance Monitor (deprecated) or Connection Monitor to monitor other objects or services, and you already have a Log Analytics workspace in one of the supported regions. You may skip step 1 and step 2, and begin your configuration on step 3.

## <a name="configure"></a> Create a Workspace

Create a workspace in the subscription that has the VNets link to the ExpressRoute circuit(s).

1. Sign in to the [Azure portal](https://portal.azure.com). From the subscription that has the virtual networks connected to your ExpressRoute circuit, select **+ Create a resource**. Search for *Log Analytics Workspace*, then select **Create**.

   >[!NOTE]
   >You can create a new workspace, or use an existing workspace. If you want to use an existing workspace, you must make sure that the workspace has been migrated to the new query language. [More information...](../azure-monitor/logs/log-query-overview.md)
   >

    :::image type="content" source="./media/how-to-configure-connection-monitor/search-log-analytics.png" alt-text="Screenshot of searching for Log Analytics in create a resource.":::

1. Create a workspace by entering or selecting the following information.  

    | Settings | Value |
    | -------- | ----- |
    | Subscription | Select the subscription with the ExpressRoute circuit. |
    | Resource Group | Create a new or select an existing resource group. |
    | Name | Enter a name to identify this workspace. |
    | Region | Select a region where this workspace is created in. |

    :::image type="content" source="./media/how-to-configure-connection-monitor/create-workspace-basic.png" alt-text="Screenshot of basic tab for create Log Analytics workspace.":::

     >[!NOTE]
     >The ExpressRoute circuit can be anywhere in the world. It doesn't have to be in the same region as the workspace.
     >

1. Select **Review + Create** to validate and then **Create** to deploy the workspace. Once the workspace has been deployed continue to the next section to configure the monitoring solution.

## <a name="npm"></a>Configure monitoring solution

Complete the Azure PowerShell script by replacing the values for *$SubscriptionId*, *$location*, *$resourceGroup*, and *$workspaceName*. Then run the script to configure the monitoring solution.

```azurepowershell-interactive
$subscriptionId = "Subscription ID should come here"
Select-AzSubscription -SubscriptionId $subscriptionId

$location = "Workspace location should come here"
$resourceGroup = "Resource group name should come here"
$workspaceName = "Workspace name should come here"

$solution = @{
    Location          = $location
    Properties        = @{
        workspaceResourceId = "/subscriptions/$($subscriptionId)/resourcegroups/$($resourceGroup)/providers/Microsoft.OperationalInsights/workspaces/$($workspaceName)"
    }
    Plan              = @{
        Name          = "NetworkMonitoring($($workspaceName))" 
        Publisher     = "Microsoft"
        Product       = "OMSGallery/NetworkMonitoring"
        PromotionCode = ""
    }
    ResourceName      = "NetworkMonitoring($($workspaceName))" 
    ResourceType      = "Microsoft.OperationsManagement/solutions" 
    ResourceGroupName = $resourceGroup
}

New-AzResource @solution -Force
```

Once you've configured the monitoring solution. Continue to the next step of installing and configuring the monitoring agents on your servers.

## <a name="agents"></a>Install and configure agents on-premises

### <a name="download"></a>Download the agent setup file

1. Navigate to the **Log Analytics workspace** and select **Agents management** under *Settings*. Download the agent that corresponds to your machine's operating system.

    :::image type="content" source="./media/how-to-configure-connection-monitor/download-agent.png" alt-text="Screenshot of agent management page in workspace.":::

1. Next, copy the **Workspace ID** and **Primary Key** to Notepad.

    :::image type="content" source="./media/how-to-configure-connection-monitor/copy-id-key.png" alt-text="Screenshot of workspace ID and primary key.":::

1. For Windows machines, download and run this PowerShell script [*EnableRules.ps1*](https://aka.ms/npmpowershellscript) in a PowerShell window with Administrator privileges. The PowerShell script opens the relevant firewall port for the TCP transactions. 
 
    For Linux machines, the port number needs to be changed manually with the following steps:

    * Navigate to path: /var/opt/microsoft/omsagent/npm_state.
    * Open file: npmdregistry
    * Change the value for Port Number `PortNumber:<port of your choice>`

### <a name="installagentonprem"></a>Install Log Analytics agent on each monitoring server

It's recommended that you install the Log Analytics agent on at least two servers on both sides of the ExpressRoute connection for redundancy. For example, your on-premises and Azure virtual network. Use the following steps to install agents:

1. Select the appropriate operating system for the steps to install the Log Analytics agent on your servers.

    * [Windows](../azure-monitor/agents/agent-windows.md#install-the-agent)
    * [Linux](../azure-monitor/agents/agent-linux.md)

1. When complete, the Microsoft Monitoring Agent appears in the Control Panel. You can review your configuration, and [verify the agent connectivity](../azure-monitor/agents/agent-windows.md#verify-agent-connectivity-to-azure-monitor) to Azure Monitor logs.

1. Repeat steps 1 and 2 for the other on-premises machines that you wish to use for monitoring.

### <a name="installagentazure"></a>Install Network Watcher agent on each monitoring server

#### New Azure virtual machine

If you're creating a new Azure VM for monitoring connectivity your VNet, you can install the Network Watcher agent when creating the VM.

#### Existing Azure virtual machine

If you're using an existing VM to monitor connectivity, you can install the Network Agent separately for [Linux](../virtual-machines/extensions/network-watcher-linux.md) and [Windows](../virtual-machines/extensions/network-watcher-windows.md).

### <a name="firewall"></a>Open the firewall ports on the monitoring agent servers

Rules for a firewall can block communication between the source and destination servers. Connection Monitor detects this issue and displays it as a diagnostic message in the topology. To enable connection monitoring, ensure that firewall rules allow packets over TCP or ICMP between the source and destination.

#### Windows

For Windows machines, you can run a PowerShell script to create the registry keys required by the Connection Monitor. This script also creates the Windows Firewall rules to allow monitoring agents to create TCP connections with each other. The registry keys created by the script specify whether to log the debug logs, and the path for the logs file. It also defines the agent TCP port used for communication. The values for these keys get automatically set by the script. You shouldn't manually change these keys.

Port 8084 is opened by default. You can use a custom port by providing the parameter 'portNumber' to the script. However, if you do so, you must specify the same port for all the servers on which you run the script.

>[!NOTE]
>The 'EnableRules' PowerShell script configures Windows Firewall rules only on the server where the script is run. If you have a network firewall, you should make sure that it allows traffic destined for the TCP port being used by Connection Monitor.
>

On the agent servers, open a PowerShell window with administrative privileges. Run the [EnableRules](https://aka.ms/npmpowershellscript) PowerShell script (which you downloaded earlier). Don't use any parameters.

:::image type="content" source="./media/how-to-configure-connection-monitor/enable-rules-script.png" alt-text="Screenshot of running enable rules script in PowerShell window.":::

#### Linux

For Linux machines, the port numbers used needs to be changed manually:

1. Navigate to path: /var/opt/microsoft/omsagent/npm_state.
1. Open file: npmdregistry
1. Change the value for Port Number `PortNumber:\<port of your choice\>`. The port numbers being used should be same across all the agents used in a workspace

## <a name="opennsg"></a>Configure network security group rules

To monitor servers that are in Azure, you must configure network security group (NSG) rules to allow TCP or ICMP traffic from Connection Monitor. The default port is **8084, which allows the monitoring agent installed on the Azure VM to communicate with an on-premises monitoring agent.

For more information about NSG, see tutorial on [filtering network traffic](../virtual-network/tutorial-filter-network-traffic.md).

> [!NOTE]
> Make sure that you have installed the agents (both the on-premises server agent and the Azure server agent), and have run the PowerShell script before proceeding with this step.
>

## <a name="enablenetworkwatcher"></a>Enable Network Watcher

All subscriptions that have a virtual network are enabled with Network Watcher. Ensure that Network Watcher isn't explicitly disabled for your subscription. For more information, see [Enable Network Watcher](../network-watcher/network-watcher-create.md).

## <a name="createcm"></a> Create a connection monitor

For a high-level overview of how to create a connection monitor, tests, and test groups across source and destination endpoints in your network, see [Create a connection monitor](../network-watcher/connection-monitor-create-using-portal.md). Use the following steps to configure connection monitoring for Private Peering and Microsoft Peering.

1. In the Azure portal, navigate to your **Network Watcher** resource and select **Connection monitor** under *Monitoring*. Then select **Create** to create a new connection monitor.

    :::image type="content" source="./media/how-to-configure-connection-monitor/create-connection-monitor.png" alt-text="Screenshot of connection monitor in Network Watcher.":::

1. On the **Basics** tab of the creation workflow, select the same region where you deployed your Log Analytics workspace for the *Region* field. For *Workspace configuration*, select the existing Log Analytics workspace that you created earlier. Then select **Next: Test groups >>**.

    :::image type="content" source="./media/how-to-configure-connection-monitor/connection-monitor-basic.png" alt-text="Screenshot of basic tab for creating Connection Monitor.":::

1. On the *Add test group details* page, you add the source and destination endpoints for your test group. You also set up the test configurations between them. Enter a **Name** for this test group.

    :::image type="content" source="./media/how-to-configure-connection-monitor/add-test-group-details.png" alt-text="Screenshot of add test group details page.":::

1. Select **Add source** and navigate to the **Non-Azure endpoints** tab. Choose the on-premises resources that have Log Analytics agent installed that you want to monitor connectivity, then select **Add endpoints**.

    :::image type="content" source="./media/how-to-configure-connection-monitor/add-source-endpoints.png" alt-text="Screenshot of adding source endpoints.":::

1. Next, select **Add destinations**. 

    To monitor connectivity over ExpressRoute **private peering**, navigate to the **Azure endpoints** tab. Choose the Azure resources with the Network Watcher agent installed that you want to monitor connectivity to your virtual networks in Azure. Make sure to select the private IP address of each of these resources in the *IP* column. Select **Add endpoints** to add these endpoints to your list of destinations for the test group.
    
    :::image type="content" source="./media/how-to-configure-connection-monitor/add-destination-endpoints.png" alt-text="Screenshot of adding Azure destination endpoints.":::

    To monitor connectivity over ExpressRoute **Microsoft peering**, navigate to the **External Addresses** tab. Select the Microsoft services endpoints that you wish to monitor connectivity to over Microsoft Peering. Select **Add endpoints** to add these endpoints to your list of destinations for the test group.

    :::image type="content" source="./media/how-to-configure-connection-monitor/add-external-destination-endpoints.png" alt-text="Screenshot of adding external destination endpoints.":::

1. Now select **Add test configuration**. Select **TCP** for the protocol, and input the **destination port** you opened on your servers. Then configure your **test frequency** and **thresholds for failed checks and round trip time**. Then select **Add Test configuration**.

    :::image type="content" source="./media/how-to-configure-connection-monitor/add-test-configuration.png" alt-text="Screenshot of add test configuration page.":::

1. Select **Add Test Group** once you've added your sources, destinations, and test configuration.

    :::image type="content" source="./media/how-to-configure-connection-monitor/add-test-group-details-configured.png" alt-text="Screenshot of add test group detail configured." lightbox="./media/how-to-configure-connection-monitor/add-test-group-details-configured-expanded.png":::

1. Select the **Next : Create alert >>** if you want to create alerting. Once completed, select **Review + create** and then **Create**.

## View results

1. Go to your **Network Watcher** resource and select **Connection monitor** under *Monitoring*. You should see your new connection monitor after 5 minutes. To view the connection monitor's network topology and performance charts, select the test from the test group dropdown.

    :::image type="content" source="./media/how-to-configure-connection-monitor/overview.png" alt-text="Screenshot of connection monitor overview page." lightbox="./media/how-to-configure-connection-monitor/overview-expanded.png":::

1. In the **Performance analysis** panel, you can view the percentage of check failed and each test's results for round-trip time. You can adjust the time frame for the data displayed by selecting the dropdown at the top of the panel.

    :::image type="content" source="./media/how-to-configure-connection-monitor/performance-analysis.png" alt-text="Screenshot of performance analysis panel." lightbox="./media/how-to-configure-connection-monitor/performance-analysis-expanded.png":::

1. Closing the **Performance analysis** panel reveals the network topology detected by the connection monitor between the source and destination endpoints you selected. This view shows you the bi-directional paths of traffic between your source and destination endpoints. You can also see the hop-by-hop latency of packets before they reach the Microsoft's edge network. 

    :::image type="content" source="./media/how-to-configure-connection-monitor/topology.png" alt-text="Screenshot of network topology in connection monitor." lightbox="./media/how-to-configure-connection-monitor/topology-expanded.png":::

    Selecting any hop in the topology view displays additional information about the hop. Any issues detected by the connection monitor about the hop get displayed here.

    :::image type="content" source="./media/how-to-configure-connection-monitor/hop-details.png" alt-text="Screenshot of more information for a network hop.":::

## Next steps

Learn more about [Monitoring Azure ExpressRoute](monitor-expressroute.md)
