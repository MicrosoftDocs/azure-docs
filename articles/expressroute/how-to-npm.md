---
title: 'Configure Network Performance Monitor for Azure ExpressRoute circuits (Preview) | Microsoft Docs'
description: Configure NPM for Azure ExpressRoute circuits. (Preview)
documentationcenter: na
services: expressroute
author: cherylmc
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid:
ms.service: expressroute
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 11/13/2017
ms.author: cherylmc

---
# Configure Network Performance Monitor for ExpressRoute (Preview)

Network Performance Monitor (NPM) is a cloud-based network monitoring solution that monitors connectivity between Azure cloud deployments and on-premises locations (Branch offices, etc.). NPM is part of Microsoft Operations Management Suite (OMS). NPM now offers an extension for ExpressRoute that lets you monitor network performance over ExpressRoute circuits that are configured to use Private Peering. When you configure NPM for ExpressRoute, you can detect network issues to identify and eliminate.

You can:

* Monitor loss and latency across various VNets and set alerts

* Monitor all paths (including redundant paths) on the network

* Troubleshoot transient and point-in-time network issues that are difficult to replicate

* Help determine a specific segment on the network that is responsible for degraded performance

* Get throughput per virtual network (If you have agents installed in each VNet)

* See the ExpressRoute system state from a previous point in time

## <a name="regions"></a>Supported regions

You can monitor ExpressRoute circuits in any part of the world by using a workspace that is hosted in one of the following regions:

* West Europe 
* East US 
* South East Asia 

## <a name="workflow"></a>Workflow

Monitoring agents are installed on multiple servers, both on-premises and in Azure. The agents communicate with each other, but do not send data, they send TCP handshake packets. The communication between the agents allows Azure to map the network topology and path the traffic could take.

1. Create an NPM Workspace in the one of the [supported regions](#regions).
2. Install and configure software agents: 
    * Install monitoring agents on the on-premises servers and the Azure VMs.
    * Configure settings on the monitoring agent servers to allow the monitoring agents to communicate. (Open firewall ports, etc.)
3. Configure network security group (NSG) rules to allow the monitoring agent installed on Azure VMs to communicate with on-premises monitoring agents.
4. Request to whitelist your NPM Workspace.
5. Set up monitoring: Auto-Discover and manage which networks are visible in NPM.

If you are already using Network Performance Monitor to monitor other objects or services, and you already have Workspace in one of the available regions, you can skip Step 1 and Step 2, and begin your configuration with Step 3.

## <a name="configure"></a>Step 1: Create a Workspace

1. In the [Azure portal](https://portal.azure.com), search the list of services in the **Marketplace** for 'Network Performance Monitor'. In the return, click to open the **Network Performance Monitor** page.

  ![portal](.\media\how-to-npm\3.png)<br><br>
2. At the bottom of the main **Network Performance Monitor** page, click **Create** to open **Network Performance Monitor - Create new solution** page. Click **OMS Workspace - select a workspace** to open the Workspaces page. Click **+ Create New Workspace** to open the Workspace page.
3. On the **OMS Workspace** page, select **Create New** and configure the following settings:

  * OMS Workspace - Type a name for your Workspace.
  * Subscription - If you have multiple subscriptions, choose the one you want to associate with the new Workspace.
  * Resource group - Create a resource group, or use an existing one.
  * Location - You must select a [supported region](#regions).
  * Pricing tier - Select 'Free'

  ![workspace](.\media\how-to-npm\4.png)<br><br>
4. Click **OK** to save and deploy the settings template. Once the template validates, click **Create** to deploy the Workspace.
5. After the Workspace has been deployed, navigate to the **NetworkMonitoring(name)** resource that you created. Validate the settings, then click **Solution requires additional configuration**.

  ![additional configuration](.\media\how-to-npm\5.png)
6. On the **Welcome to Network Performance Monitor** page, select **Use TCP for synthetic transactions**, then click **Submit**. The TCP transactions are used only to make and break the connection. No data is sent over these TCP connections.

  ![TCP for synthetic transactions](.\media\how-to-npm\6.png)

## <a name="agents"></a>Step 2: Install and configure agents

### <a name="download"></a>2.1: Download the agent setup file

1. On the **Network Performance Monitor Configuration - TCP Setup page** for your resource, in the **Install OMS Agents** section, click the agent that corresponds to your server's processor and download the setup file.

  >[!NOTE]
  >The Linux agent is currently not supported for ExpressRoute monitoring.
  >
  >
2. Next, copy the **Workspace ID** and **Primary Key** to Notepad.
3. In the **Configure Agents** section, download the Powershell Script. The PowerShell script helps you open the relevant firewall port for the TCP transactions.

  ![PowerShell script](.\media\how-to-npm\7.png)

### <a name="installagent"></a>2.2: Install a monitoring agent on each monitoring server

1. Run **Setup** to install the agent on each server that you want to use for monitoring ExpressRoute. The server you use for monitoring can either be a VM, or on-premises and must have Internet access. You need to install at least one agent on-premises, and one agent on each network segment that you want to monitor in Azure.
2. On the **Welcome** page, click **Next**.
3. On the **License Terms** page, read the license, and then click **I Agree**.
4. On the **Destination Folder** page, change or keep the default installation folder, and then click **Next**.
5. On the **Agent Setup Options** page, you can choose to connect the agent to Azure Log Analytics (OMS) or Operations Manager. Or, you can leave the choices blank if you want to configure the agent later. After making your selection(s), click **Next**.

  * If you chose to connect to **Azure Log Analytics (OMS)**, paste the **Workspace ID** and **Workspace Key** (Primary Key) that you copied into Notepad in the previous section. Then, click **Next**.

    ![ID and Key](.\media\how-to-npm\8.png)
  * If you chose to connect to **Operations Manager**, on the **Management Group Configuration** page, type the **Management Group Name**, **Management Server**, and the **Management Server Port**. Then, click **Next**.

    ![Operations Manager](.\media\how-to-npm\9.png)
  * On the **Agent Action Account** page, choose either the **Local System** account, or  **Domain or Local Computer Account**. Then, click **Next**.

    ![Account](.\media\how-to-npm\10.png)
6. On the **Ready to Install** page, review your choices, and then click **Install**.
7. On the **Configuration completed successfully** page, click **Finish**.
8. When complete, the Microsoft Monitoring Agent appears in the Control Panel. You can review your configuration there, and verify that the agent is connected to Operational Insights (OMS). When connected to OMS, the agent displays a message stating: **The Microsoft Monitoring Agent has successfully connected to the Microsoft Operations Management Suite service**.

### <a name="proxy"></a>2.3: Configure proxy settings (optional)

If you are using a web proxy to access the Internet, use the following steps to configure proxy settings for the Microsoft Monitoring Agent. Perform these steps for each server. If you have many servers that you need to configure, you might find it easier to use a script to automate this process. If so, see [To configure proxy settings for the Microsoft Monitoring Agent using a script](../log-analytics/log-analytics-windows-agents.md#to-configure-proxy-settings-for-the-microsoft-monitoring-agent-using-a-script).

To configure proxy settings for the Microsoft Monitoring Agent using the Control Panel:

1. Open the **Control Panel**.
2. Open **Microsoft Monitoring Agent**.
3. Click the **Proxy Settings** tab.
4. Select **Use a proxy server** and type the URL and port number, if one is needed. If your proxy server requires authentication, type the username and password to access the proxy server.

  ![proxy](.\media\how-to-npm\11.png)

### <a name="verifyagent"></a>2.4: Verify agent connectivity

You can easily verify whether your agents are communicating.

1. On a server with the monitoring agent, open the **Control Panel**.
2. Open the **Microsoft Monitoring Agent**.
3. Click the **Azure Log Analytics (OMS)** tab.
4. In the **Status** column, you should see that the agent connected successfully to the Operations Management Suite service.

  ![status](.\media\how-to-npm\12.png)

### <a name="firewall"></a>2.5: Open the firewall ports on the monitoring agent servers

To use the TCP protocol, you must open firewall ports to ensure that the monitoring agents can communicate.

You can run a PowerShell script that creates the registry keys required by the Network Performance Monitor, as well as creating the Windows Firewall rules to allow monitoring agents to create TCP connections with each other. The registry keys created by the script also specify whether to log the debug logs, and the path for the logs file. It also defines the agent TCP port used for communication. The values for these keys are automatically set by the script, so you should not manually change these keys.

Port 8084 is opened by default. You can use a custom port by providing the parameter 'portNumber' to the script. However, if you do so, you must specify the same port for all the servers on which you run the script.

>[!NOTE]
>The 'EnableRules' PowerShell script configures Windows Firewall rules only on the server where the script is run. If you have a network firewall, you should make sure that it allows traffic destined for the TCP port being used by Network Performance Monitor.
>
>

On the agent servers, open a PowerShell window with administrative privileges. Run the [EnableRules](https://gallery.technet.microsoft.com/OMS-Network-Performance-04a66634) PowerShell script (which you downloaded earlier). Don't use any parameters.

  ![PowerShell_Script](.\media\how-to-npm\script.png)

## <a name="opennsg"></a>Step 3: Configure network security group rules

For monitoring agent servers that are in Azure, you must configure network security group (NSG) rules to allow TCP traffic on a port used by NPM for synthetic transactions. The default port is 8084. This allows a monitoring agent installed on Azure VM to communicate with an on-premises monitoring agent.

For more information about NSG, see [Network Security Groups](../virtual-network/virtual-networks-create-nsg-arm-portal.md).

## <a name="whitelist"></a>Step 4: Request to whitelist Workspace

>[!NOTE]
>Make sure that you have installed the agents (both the on-premises server agent and the Azure server agent) and have run the PowerShell script before proceeding with this step.
>
>

Before you can start using the ExpressRoute monitoring feature of NPM, you must request to have your Workspace whitelisted. [Click here to go to the page and fill out the request form](https://go.microsoft.com/fwlink/?linkid=862263). (Hint: You may want to open this link in a new window or tab). The whitelisting process may take a business day or more. Once the whitelisting is complete, you will receive an email.

## <a name="setupmonitor"></a>Step 5: Configure NPM for ExpressRoute monitoring

>[!WARNING]
>Do not proceed further until your Workspace has been whitelisted and you receive a confirmation email.
>
>

After you complete the previous sections and verify that you have been whitelisted, you can set up monitoring.

1. Navigate to the Network Performance Monitor overview tile by going to the **All Resources** page, and clicking on the whitelisted NPM Workspace.

  ![npm workspace](.\media\how-to-npm\npm.png)
2. Click the **Network Performance Monitor** overview tile to bring up the dashboard. The dashboard contains an ExpressRoute page, which shows that ExpressRoute is in an 'unconfigured state'. Click **Feature Setup** to open the Network Performance Monitor configuration page.

  ![feature setup](.\media\how-to-npm\npm2.png)
3. On the configuration page, navigate to the 'ExpressRoute Peerings' tab, located on the left side panel. Click **Discover Now**.

  ![discover](.\media\how-to-npm\13.png)
4. When discovery completes, you see rules for unique Circuit name and VNet name. Initially, these rules are disabled. Enable the rules, then select the monitoring agents and threshold values.

  ![rules](.\media\how-to-npm\14.png)
5. After enabling the rules and selecting the values and agents you want to monitor, there is a wait of approximately 30-60 minutes for the values to begin populating and the **ExpressRoute Monitoring** tiles to become available. Once you see the monitoring tiles, your ExpressRoute circuits and connection resources are being monitored by NPM.

  ![monitoring tiles](.\media\how-to-npm\15.png)

## <a name="explore"></a>Step 6: View monitoring tiles

### <a name="dashboard"></a>Network Performance Monitor page

The NPM page contains a page for ExpressRoute that shows an overview of the health of ExpressRoute circuits and peerings.

  ![Dashboard](.\media\how-to-npm\dashboard.png)

### <a name="circuits"></a>Circuits list

To see a list of all monitored ExpressRoute circuits, click on the **ExpressRoute circuits** tile. You can select a circuit and view its health state, trend charts for packet loss, bandwidth utilization, and latency. The charts are interactive. You can select a custom time window for plotting the charts. You can drag the mouse over an area on the chart to zoom in and see fine-grained data points.

  ![circuit_list](.\media\how-to-npm\circuits.png)

#### <a name="trend"></a>Trend of Loss, Latency, and Throughput

The bandwidth, latency, and loss charts are interactive. You can zoom into any section of these charts, using mouse controls. You can also see the bandwidth, latency, and loss data for other intervals by clicking **Date/Time**, located below the Actions button on the upper left.

![trend](.\media\how-to-npm\16.png)

### <a name="peerings"></a>Peerings list

Clicking on the **Private Peerings** tile on the dashboard brings up a list of all connections to virtual networks over private peering. Here, you can select a virtual network connection and view its health state, trend charts for packet loss, bandwidth utilization, and latency.

  ![circuit list](.\media\how-to-npm\peerings.png)

### <a name="topology"></a>Circuit topology

To view circuit topology, click on the **Topology** tile. This takes you to the topology view of the selected circuit or peering. The topology diagram provides the latency for each segment on the network and each layer 3 hop is represented by a node of the diagram. Clicking on a hop reveals more details about the hop.
You can increase the level of visibility to include on-premises hops by moving the slider bar below **Filters**. Moving the slider bar to the left or right, increases/decreases the number of hops in the topology graph. The latency across each segment is visible, which allows for faster isolation of high latency segments on your network.

![filters](.\media\how-to-npm\topology.png)

#### Detailed Topology view of a circuit

This view shows VNet connections.
![detailed topology](.\media\how-to-npm\17.png)