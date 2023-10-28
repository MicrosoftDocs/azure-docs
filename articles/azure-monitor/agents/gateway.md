---
title: Connect computers by using the Log Analytics gateway | Microsoft Docs
description: Connect your devices and Operations Manager-monitored computers by using the Log Analytics gateway to send data to the Azure Automation and Log Analytics service when they do not have internet access.
ms.topic: conceptual
ms.date: 07/06/2023
ms.reviewer: luki

---

# Connect computers without internet access by using the Log Analytics gateway in Azure Monitor

This article describes how to configure communication with Azure Automation and Azure Monitor by using the Log Analytics gateway when computers that are directly connected or that are monitored by Operations Manager have no internet access. 

The Log Analytics gateway is an HTTP forward proxy that supports HTTP tunneling using the HTTP CONNECT command. This gateway sends data to Azure Automation and a Log Analytics workspace in Azure Monitor on behalf of the computers that cannot directly connect to the internet. The gateway is only for log agent related connectivity and does not support Azure Automation features like runbook, DSC, and others.

The Log Analytics gateway supports:

* Reporting up to the same Log Analytics workspaces configured on each agent behind it and that are configured with Azure Automation Hybrid Runbook Workers.  
* Windows computers on which either the [Azure Monitor Agent](./azure-monitor-agent-overview.md) or the legacy Microsoft Monitoring Agent is directly connected to a Log Analytics workspace in Azure Monitor. Both the source and the gateway server must be running the same agent. You can't stream events from a server running Azure Monitor agent through a server running the gateway with the Log Analytics agent.
* Linux computers on which either the [Azure Monitor Agent](./azure-monitor-agent-overview.md) or the legacy Log Analytics agent for Linux is directly connected to a Log Analytics workspace in Azure Monitor.  
* System Center Operations Manager 2012 SP1 with UR7, Operations Manager 2012 R2 with UR3, or a management group in Operations Manager 2016 or later that is integrated with Log Analytics.  

Some IT security policies don't allow internet connection for network computers. These unconnected computers could be point of sale (POS) devices or servers supporting IT services, for example. To connect these devices to Azure Automation or a Log Analytics workspace so you can manage and monitor them, configure them to communicate directly with the Log Analytics gateway. The Log Analytics gateway can receive configuration information and forward data on their behalf. If the computers are configured with the Log Analytics agent to directly connect to a Log Analytics workspace, the computers instead communicate with the Log Analytics gateway.  

The Log Analytics gateway transfers data from the agents to the service directly. It doesn't analyze any of the data in transit and the gateway does not cache data when it loses connectivity with the service. When the gateway is unable to communicate with service, the agent continues to run and queues the collected data on the disk of the monitored computer. When the connection is restored, the agent sends the cached data collected to Azure Monitor.

When an Operations Manager management group is integrated with Log Analytics, the management servers can be configured to connect to the Log Analytics gateway to receive configuration information and send collected data, depending on the solution you have enabled.  Operations Manager agents send some data to the management server. For example, agents might send Operations Manager alerts, configuration assessment data, instance space data, and capacity data. Other high-volume data, such as Internet Information Services (IIS) logs, performance data, and security events, is sent directly to the Log Analytics gateway. 

If one or more Operations Manager Gateway servers are deployed to monitor untrusted systems in a perimeter network or an isolated network, those servers can't communicate with a Log Analytics gateway.  Operations Manager Gateway servers can report only to a management server.  When an Operations Manager management group is configured to communicate with the Log Analytics gateway, the proxy configuration information is automatically distributed to every agent-managed computer that is configured to collect log data for Azure Monitor, even if the setting is empty.

To provide high availability for directly connected or Operations Management groups that communicate with a Log Analytics workspace through the gateway, use network load balancing (NLB) to redirect and distribute traffic across multiple gateway servers. That way, if one gateway server goes down, the traffic is redirected to another available node.  

The computer that runs the Log Analytics gateway requires the agent to identify the service endpoints that the gateway needs to communicate with. The agent also needs to direct the gateway to report to the same workspaces that the agents or Operations Manager management group behind the gateway are configured with. This configuration allows the gateway and the agent to communicate with their assigned workspace.

A gateway can be multihomed to up to ten workspaces using the Azure Monitor Agent and [data collection rules](./data-collection-rule-azure-monitor-agent.md). Using the legacy Microsoft Monitor Agent, you can only multihome up to four workspaces as that is the total number of workspaces the legacy Windows agent supports.  

Each agent must have network connectivity to the gateway so that agents can automatically transfer data to and from the gateway. Avoid installing the gateway on a domain controller. Linux computers that are behind a gateway server cannot use the [wrapper script installation](../agents/agent-linux.md#install-the-agent) method to install the Log Analytics agent for Linux. The agent must be downloaded manually, copied to the computer, and installed manually because the gateway only supports communicating with the Azure services mentioned earlier.

The following diagram shows data flowing from direct agents, through the gateway, to Azure Automation and Log Analytics. The agent proxy configuration must match the port that the Log Analytics gateway is configured with.  

:::image type="content" source="./media/gateway/oms-omsgateway-agentdirectconnect.png" lightbox="./media/gateway/oms-omsgateway-agentdirectconnect.png" alt-text="Diagram of direct agent communication with services":::

The following diagram shows data flow from an Operations Manager management group to Log Analytics.   

:::image type="content" source="./media/gateway/log-analytics-agent-opsmgrconnect.png" lightbox="./media/gateway/log-analytics-agent-opsmgrconnect.png" alt-text="Diagram of Operations Manager communication with Log Analytics":::

## Set up your system

Computers designated to run the Log Analytics gateway must have the following configuration:

* Windows 10, Windows 8.1, or Windows 7
* Windows Server 2019, Windows Server 2016, Windows Server 2012 R2, Windows Server 2012, Windows Server 2008 R2, or Windows Server 2008
* Microsoft .NET Framework 4.5
* At least a 4-core processor and 8 GB of memory 
* An [Azure Monitor agent](./azure-monitor-agent-overview.md) installed with [data collection rule(s)](./data-collection-rule-azure-monitor-agent.md) configured, or the [Log Analytics agent for Windows](../agents/agent-windows.md) configured to report to the same workspace as the agents that communicate through the gateway

### Language availability

The Log Analytics gateway is available in these languages:

- Chinese (Simplified)
- Chinese (Traditional)
- Czech
- Dutch
- English
- French
- German
- Hungarian
- Italian
- Japanese
- Korean
- Polish
- Portuguese (Brazil)
- Portuguese (Portugal)
- Russian
- Spanish (International)

### Supported encryption protocols

The Log Analytics gateway supports only Transport Layer Security (TLS) 1.0, 1.1, and 1.2.  It doesn't support Secure Sockets Layer (SSL).  To ensure the security of data in transit to Log Analytics, configure the gateway to use at least TLS 1.2. Older versions of TLS or SSL are vulnerable. Although they currently allow backward compatibility, avoid using them.  

For additional information, review [Sending data securely using TLS 1.2](../logs/data-security.md#sending-data-securely-using-tls-12). 

>[!NOTE]
>The gateway is a forwarding proxy that doesn’t store any data. Once the agent establishes connection with Azure Monitor, it follows the same encryption flow with or without the gateway. The data is encrypted between the client and the endpoint. Since the gateway is just a tunnel, it doesn’t have the ability the inspect what is being sent.

### Supported number of agent connections

The following table shows approximately how many agents can communicate with a gateway server. Support is based on agents that upload about 200 KB of data every 6 seconds. For each agent tested, data volume is about 2.7 GB per day.

|Gateway |Agents supported (approximate)|  
|--------|----------------------------------|  
|CPU: Intel Xeon Processor E5-2660 v3 \@ 2.6 GHz 2 Cores<br> Memory: 4 GB<br> Network bandwidth: 1 Gbps| 600|  
|CPU: Intel Xeon Processor E5-2660 v3 \@ 2.6 GHz 4 Cores<br> Memory: 8 GB<br> Network bandwidth: 1 Gbps| 1000|  

## Download the Log Analytics gateway

Get the latest version of the Log Analytics gateway Setup file from Microsoft Download Center ([Download Link](https://go.microsoft.com/fwlink/?linkid=837444)).

## Install Log Analytics gateway using setup wizard

To install a gateway using the setup wizard, follow these steps. 

1. From the destination folder, double-click **Log Analytics gateway.msi**.
1. On the **Welcome** page, select **Next**.
   <!-- convertborder later -->
   :::image type="content" source="./media/gateway/gateway-wizard01.png" lightbox="./media/gateway/gateway-wizard01.png" alt-text="Screenshot of Welcome page in the Gateway Setup wizard" border="false":::

1. On the **License Agreement** page, select **I accept the terms in the License Agreement** to agree to the Microsoft Software License Terms, and then select **Next**.
1. On the **Port and proxy address** page:

   a. Enter the TCP port number to be used for the gateway. Setup uses this port number to configure an inbound rule on Windows Firewall.  The default value is 8080.
      The valid range of the port number is 1 through 65535. If the input does not fall into this range, an error message appears.

   b. If the server where the gateway is installed needs to communicate through a proxy, enter the proxy address where the gateway needs to connect. For example, enter `http://myorgname.corp.contoso.com:80`.  If you leave this field blank, the gateway will try to connect to the internet directly.  If your proxy server requires authentication, enter a username and password.

   c. Select **Next**.
   <!-- convertborder later -->
   :::image type="content" source="./media/gateway/gateway-wizard02.png" lightbox="./media/gateway/gateway-wizard02.png" alt-text="Screenshot of configuration for the gateway proxy" border="false":::

1. If you do not have Microsoft Update enabled, the Microsoft Update page appears, and you can choose to enable it. Make a selection and then select **Next**. Otherwise, continue to the next step.
1. On the **Destination Folder** page, either leave the default folder C:\Program Files\OMS Gateway or enter the location where you want to install the gateway. Then select **Next**.
1. On the **Ready to install** page, select **Install**. If User Account Control requests permission to install, select **Yes**.
1. After Setup finishes, select **Finish**. To verify that the service is running, open the services.msc snap-in and verify that **OMS Gateway** appears in the list of services and that its status is **Running**.
   <!-- convertborder later -->
   :::image type="content" source="./media/gateway/gateway-service.png" lightbox="./media/gateway/gateway-service.png" alt-text="Screenshot of local services, showing that OMS Gateway is running" border="false":::

## Install the Log Analytics gateway using the command line

The downloaded file for the gateway is a Windows Installer package that supports silent installation from the command line or other automated method. If you are not familiar with the standard command-line options for Windows Installer, see [Command-line options](/windows/desktop/msi/command-line-options).
 
The following table highlights the parameters supported by setup.

|Parameters| Notes|
|----------|------| 
|PORTNUMBER | TCP port number for gateway to listen on |
|PROXY | IP address of proxy server |
|INSTALLDIR | Fully qualified path to specify install directory of gateway software files |
|USERNAME | User ID to authenticate with proxy server |
|PASSWORD | Password of the user ID to authenticate with proxy |
|LicenseAccepted | Specify a value of **1** to verify you accept license agreement |
|HASAUTH | Specify a value of **1** when USERNAME/PASSWORD parameters are specified |
|HASPROXY | Specify a value of **1** when specifying IP address for **PROXY** parameter |

To silently install the gateway and configure it with a specific proxy address, port number, type the following:

```dos
Msiexec.exe /I "oms gateway.msi" /qn PORTNUMBER=8080 PROXY="10.80.2.200" HASPROXY=1 LicenseAccepted=1 
```

Using the /qn command-line option hides setup, /qb shows setup during silent install.  

If you need to provide credentials to authenticate with the proxy, type the following:

```dos
Msiexec.exe /I "oms gateway.msi" /qn PORTNUMBER=8080 PROXY="10.80.2.200" HASPROXY=1 HASAUTH=1 USERNAME="<username>" PASSWORD="<password>" LicenseAccepted=1 
```

After installation, you can confirm the settings are accepted (excluding the username and password) using the following PowerShell cmdlets:

- **Get-OMSGatewayConfig** – Returns the TCP Port the gateway is configured to listen on.
- **Get-OMSGatewayRelayProxy** – Returns the IP address of the proxy server you configured it to communicate with.

## Configure network load balancing

You can configure the gateway for high availability using network load balancing (NLB) using either Microsoft [Network Load Balancing (NLB)](/windows-server/networking/technologies/network-load-balancing), [Azure Load Balancer](../../load-balancer/load-balancer-overview.md), or hardware-based load balancers. The load balancer manages traffic by redirecting the requested connections from the Log Analytics agents or Operations Manager management servers across its nodes. If one Gateway server goes down, the traffic gets redirected to other nodes.

### Microsoft Network Load Balancing

To learn how to design and deploy a Windows Server 2016 network load balancing cluster, see [Network load balancing](/windows-server/networking/technologies/network-load-balancing). The following steps describe how to configure a Microsoft network load balancing cluster.  

1. Sign onto the Windows server that is a member of the NLB cluster with an administrative account.  
2. Open Network Load Balancing Manager in Server Manager, click **Tools**, and then click **Network Load Balancing Manager**.
3. To connect a Log Analytics gateway server with the Microsoft Monitoring Agent installed, right-click the cluster's IP address, and then click **Add Host to Cluster**. 

    :::image type="content" source="./media/gateway/nlb02.png" lightbox="./media/gateway/nlb02.png" alt-text="Network Load Balancing Manager – Add Host To Cluster":::
 
4. Enter the IP address of the gateway server that you want to connect. 

    :::image type="content" source="./media/gateway/nlb03.png" lightbox="./media/gateway/nlb03.png" alt-text="Network Load Balancing Manager – Add Host To Cluster: Connect"::: 

### Azure Load Balancer

To learn how to design and deploy an Azure Load Balancer, see [What is Azure Load Balancer?](../../load-balancer/load-balancer-overview.md). To deploy a basic load balancer, follow the steps outlined in this [quickstart](../../load-balancer/quickstart-load-balancer-standard-public-portal.md) excluding the steps outlined in the section **Create back-end servers**.   

> [!NOTE]
> Configuring the Azure Load Balancer using the **Basic SKU**, requires that Azure virtual machines belong to an Availability Set. To learn more about availability sets, see [Manage the availability of Windows virtual machines in Azure](../../virtual-machines/availability.md). To add existing virtual machines to an availability set, refer to [Set Azure Resource Manager VM Availability Set](https://gallery.technet.microsoft.com/Set-Azure-Resource-Manager-f7509ec4).
> 

After the load balancer is created, a backend pool needs to be created, which distributes traffic to one or more gateway servers. Follow the steps described in the quickstart article section [Create resources for the load balancer](../../load-balancer/quickstart-load-balancer-standard-public-portal.md).  

>[!NOTE]
>When configuring the health probe it should be configured to use the TCP port of the gateway server. The health probe dynamically adds or removes the gateway servers from the load balancer rotation based on their response to health checks. 
>

## Configure the Azure Monitor agent to communicate using Log Analytics gateway  

To configure the Azure Monitor agent (installed on the gateway server) to use the gateway to upload data for Windows or Linux:
1. Follow the instructions to [configure proxy settings on the agent](./azure-monitor-agent-overview.md#proxy-configuration) and provide the IP address and port number corresponding to the gateway server. If you have deployed multiple gateway servers behind a load balancer, the agent proxy configuration is the virtual IP address of the load balancer instead.  
2. Add the **configuration endpoint URL** to fetch data collection rules to the allowlist for the gateway  
   `Add-OMSGatewayAllowedHost -Host global.handler.control.monitor.azure.com`  
   `Add-OMSGatewayAllowedHost -Host <gateway-server-region-name>.handler.control.monitor.azure.com`  
   (If using private links on the agent, you must also add the [dce endpoints](../essentials/data-collection-endpoint-overview.md#components-of-a-data-collection-endpoint))  
3. Add the **data ingestion endpoint URL** to the allowlist for the gateway  
   `Add-OMSGatewayAllowedHost -Host <log-analytics-workspace-id>.ods.opinsights.azure.com`  
3. Restart the **OMS Gateway** service to apply the changes  
   `Stop-Service -Name <gateway-name>`  
   `Start-Service -Name <gateway-name>`  
   

## Configure the Log Analytics agent and Operations Manager management group

In this section, you'll see how to configure directly connected legacy Log Analytics agents, an Operations Manager management group, or Azure Automation Hybrid Runbook Workers with the Log Analytics gateway to communicate with Azure Automation or Log Analytics.  

### Configure a standalone Log Analytics agent

When configuring the legacy Log Analytics agent, replace the proxy server value with the IP address of the Log Analytics gateway server and its port number. If you have deployed multiple gateway servers behind a load balancer, the Log Analytics agent proxy configuration is the virtual IP address of the load balancer.  

>[!NOTE]
>To install the Log Analytics agent on the gateway and Windows computers that directly connect to Log Analytics, see [Connect Windows computers to the Log Analytics service in Azure](../agents/agent-windows.md). To connect Linux computers, see [Connect Linux computers to Azure Monitor](../agents/agent-linux.md). 
>

After you install the agent on the gateway server, configure it to report to the workspace or workspace agents that communicate with the gateway. If the Log Analytics Windows agent is not installed on the gateway, event 300 is written to the OMS Gateway event log, indicating that the agent needs to be installed. If the agent is installed but not configured to report to the same workspace as the agents that communicate through it, event 105 is written to the same log, indicating that the agent on the gateway needs to be configured to report to the same workspace as the agents that communicate with the gateway.

After you complete configuration, restart the **OMS Gateway** service to apply the changes. Otherwise, the gateway will reject agents that attempt to communicate with Log Analytics and will report event 105 in the OMS Gateway event log. This will also happen when you add or remove a workspace from the agent configuration on the gateway server.

For information related to the Automation Hybrid Runbook Worker, see [Automate resources in your datacenter or cloud by using Hybrid Runbook Worker](../../automation/automation-hybrid-runbook-worker.md).

### Configure Operations Manager, where all agents use the same proxy server

The Operations Manager proxy configuration is automatically applied to all agents that report to Operations Manager, even if the setting is empty.  

To use OMS Gateway to support Operations Manager, you must have:

* Microsoft Monitoring Agent (version 8.0.10900.0 or later) installed on the OMS Gateway server and configured with the same Log Analytics workspaces that your management group is configured to report to.
* Internet connectivity. Alternatively, OMS Gateway must be connected to a proxy server that is connected to the internet.

> [!NOTE]
> If you specify no value for the gateway, blank values are pushed to all agents.
>

If your Operations Manager management group is registering with a Log Analytics workspace for the first time, you won't see the option to specify the proxy configuration for the management group in the Operations console. This option is available only if the management group has been registered with the service.  

To configure integration, update the system proxy configuration by using Netsh on the system where you're running the Operations console and on all management servers in the management group. Follow these steps:

1. Open an elevated command prompt:

   a. Select **Start** and enter **cmd**.  

   b. Right-click **Command Prompt** and select **Run as administrator**.  

1. Enter the following command:

   `netsh winhttp set proxy <proxy>:<port>`

After completing the integration with Log Analytics, remove the change by running `netsh winhttp reset proxy`. Then, in the Operations console, use the **Configure proxy server** option to specify the Log Analytics gateway server. 

1. On the Operations Manager console, under **Operations Management Suite**, select **Connection**, and then select **Configure Proxy Server**.
   <!-- convertborder later -->
   :::image type="content" source="./media/gateway/scom01.png" lightbox="./media/gateway/scom01.png" alt-text="Screenshot of Operations Manager, showing the selection Configure Proxy Server" border="false":::

1. Select **Use a proxy server to access the Operations Management Suite** and then enter the IP address of the Log Analytics gateway server or virtual IP address of the load balancer. Be careful to start with the prefix `http://`.
   <!-- convertborder later -->
   :::image type="content" source="./media/gateway/scom02.png" lightbox="./media/gateway/scom02.png" alt-text="Screenshot of Operations Manager, showing the proxy server address" border="false":::

1. Select **Finish**. Your Operations Manager management group is now configured to communicate through the gateway server to the Log Analytics service.

### Configure Operations Manager, where specific agents use a proxy server

For large or complex environments, you might want only specific servers (or groups) to use the Log Analytics gateway server.  For these servers, you can't update the Operations Manager agent directly because this value is overwritten by the global value for the management group.  Instead, override the rule used to push these values.  

> [!NOTE] 
> Use this configuration technique if you want to allow for multiple Log Analytics gateway servers in your environment.  For example, you can require specific Log Analytics gateway servers to be specified on a regional basis.
>

To configure specific servers or groups to use the Log Analytics gateway server: 

1. Open the Operations Manager console and select the **Authoring** workspace.  
1. In the Authoring workspace, select **Rules**. 
1. On the Operations Manager toolbar, select the **Scope** button. If this button is not available, make sure you have selected an object, not a folder, in the **Monitoring** pane. The **Scope Management Pack Objects** dialog box displays a list of common targeted classes, groups, or objects. 
1. In the **Look for** field, enter **Health Service** and select it from the list. Select **OK**.  
1. Search for **Advisor Proxy Setting Rule**. 
1. On the Operations Manager toolbar, select **Overrides** and then point to **Override the Rule\For a specific object of class: Health Service** and select an object from the list.  Or create a custom group that contains the health service object of the servers you want to apply this override to. Then apply the override to your custom group.
1. In the **Override Properties** dialog box, add a check mark in the **Override** column next to the **WebProxyAddress** parameter.  In the **Override Value** field, enter the URL of the Log Analytics gateway server. Be careful to start with the prefix `http://`.  

    >[!NOTE]
    > You don't need to enable the rule. It's already managed automatically with an override in the Microsoft System Center Advisor Secure Reference Override management pack that targets the Microsoft System Center Advisor Monitoring Server Group.
    > 

1. Select a management pack from the **Select destination management pack** list, or create a new unsealed management pack by selecting **New**. 
1. When you finish, select **OK**. 

### Configure for Automation Hybrid Runbook Workers

If you have Automation Hybrid Runbook Workers in your environment, follow these steps to configure the gateway to support the workers.

Refer to the [Configure your network](../../automation/automation-hybrid-runbook-worker.md#network-planning) section of the Automation documentation to find the URL for each region.

If your computer is registered as a Hybrid Runbook Worker automatically, for example if the Update Management solution is enabled for one or more VMs, follow these steps:

1. Add the Job Runtime Data service URLs to the Allowed Host list on the Log Analytics gateway. For example:
    `Add-OMSGatewayAllowedHost we-jobruntimedata-prod-su1.azure-automation.net`
1. Restart the Log Analytics gateway service by using the following PowerShell cmdlet:
   `Restart-Service OMSGatewayService`

If your computer is joined to Azure Automation by using the Hybrid Runbook Worker registration cmdlet, follow these steps:

1. Add the agent service registration URL to the Allowed Host list on the Log Analytics gateway. For example:
   `Add-OMSGatewayAllowedHost ncus-agentservice-prod-1.azure-automation.net`
1. Add the Job Runtime Data service URLs to the Allowed Host list on the Log Analytics gateway. For example:
    `Add-OMSGatewayAllowedHost we-jobruntimedata-prod-su1.azure-automation.net`
1. Restart the Log Analytics gateway service.
    `Restart-Service OMSGatewayService`

## Useful PowerShell cmdlets

You can use cmdlets to complete the tasks to update the Log Analytics gateway's configuration settings. Before you use cmdlets, be sure to:

1. Install the Log Analytics gateway (Microsoft Windows Installer).
1. Open a PowerShell console window.
1. Import the module by typing this command: `Import-Module OMSGateway`
1. If no error occurred in the previous step, the module was successfully imported and the cmdlets can be used. Enter `Get-Module OMSGateway`
1. After you use the cmdlets to make changes, restart the OMS Gateway service.

An error in step 3 means that the module wasn't imported. The error might occur when PowerShell can't find the module. You can find the module in the OMS Gateway installation path: *C:\Program Files\Microsoft OMS Gateway\PowerShell\OmsGateway*.

| **Cmdlet** | **Parameters** | **Description** | **Example** |
| --- | --- | --- | --- |  
| `Get-OMSGatewayConfig` |Key |Gets the configuration of the service |`Get-OMSGatewayConfig` |  
| `Set-OMSGatewayConfig` |Key (required) <br> Value |Changes the configuration of the service |`Set-OMSGatewayConfig -Name ListenPort -Value 8080` |  
| `Get-OMSGatewayRelayProxy` | |Gets the address of relay (upstream) proxy |`Get-OMSGatewayRelayProxy` |  
| `Set-OMSGatewayRelayProxy` |Address<br> Username<br> Password (secure string) |Sets the address (and credential) of relay (upstream) proxy |1. Set a relay proxy and credential:<br> `Set-OMSGatewayRelayProxy`<br>`-Address http://www.myproxy.com:8080`<br>`-Username user1 -Password 123` <br><br> 2. Set a relay proxy that doesn't need authentication: `Set-OMSGatewayRelayProxy`<br> `-Address http://www.myproxy.com:8080` <br><br> 3. Clear the relay proxy setting:<br> `Set-OMSGatewayRelayProxy` <br> `-Address ""` |  
| `Get-OMSGatewayAllowedHost` | |Gets the currently allowed host (only the locally configured allowed host, not automatically downloaded allowed hosts) |`Get-OMSGatewayAllowedHost` | 
| `Add-OMSGatewayAllowedHost` |Host (required) |Adds the host to the allowed list |`Add-OMSGatewayAllowedHost -Host www.test.com` |  
| `Remove-OMSGatewayAllowedHost` |Host (required) |Removes the host from the allowed list |`Remove-OMSGatewayAllowedHost`<br> `-Host www.test.com` |  
| `Add-OMSGatewayAllowedClientCertificate` |Subject (required) |Adds the client certificate subject to the allowed list |`Add-OMSGatewayAllowed`<br>`ClientCertificate` <br> `-Subject mycert` |  
| `Remove-OMSGatewayAllowedClientCertificate` |Subject (required) |Removes the client certificate subject from the allowed list |`Remove-OMSGatewayAllowed` <br> `ClientCertificate` <br> `-Subject mycert` |  
| `Get-OMSGatewayAllowedClientCertificate` | |Gets the currently allowed client certificate subjects (only the locally configured allowed subjects, not automatically downloaded allowed subjects) |`Get-`<br>`OMSGatewayAllowed`<br>`ClientCertificate` |  

## Troubleshooting

To collect events logged by the gateway, you should have the Log Analytics agent installed.
<!-- convertborder later -->
:::image type="content" source="./media/gateway/event-viewer.png" lightbox="./media/gateway/event-viewer.png" alt-text="Screenshot of the Event Viewer list in the Log Analytics gateway log" border="false":::

### Log Analytics gateway event IDs and descriptions

The following table shows the event IDs and descriptions for Log Analytics gateway log events.

| **ID** | **Description** |
| --- | --- |
| 400 |Any application error that has no specific ID. |
| 401 |Wrong configuration. For example, listenPort = "text" instead of an integer. |
| 402 |Exception in parsing TLS handshake messages. |
| 403 |Networking error. For example, cannot connect to target server. |
| 100 |General information. |
| 101 |Service has started. |
| 102 |Service has stopped. |
| 103 |An HTTP CONNECT command was received from client. |
| 104 |Not an HTTP CONNECT command. |
| 105 |Destination server is not in allowed list, or destination port is not secure (443). <br> <br> Ensure that the MMA agent on your OMS Gateway server and the agents that communicate with OMS Gateway are connected to the same Log Analytics workspace. |
| 105 |ERROR TcpConnection – Invalid Client certificate: CN=Gateway. <br><br> Ensure that you're using OMS Gateway version 1.0.395.0 or greater. Also ensure that the MMA agent on your OMS Gateway server and the agents communicating with OMS Gateway are connected to the same Log Analytics workspace. |
| 106 |Unsupported TLS/SSL protocol version.<br><br> The Log Analytics gateway supports only TLS 1.0, TLS 1.1, and 1.2. It does not support SSL.|
| 107 |The TLS session has been verified. |

### Performance counters to collect

The following table shows the performance counters available for the Log Analytics gateway. Use Performance Monitor to add the counters.

| **Name** | **Description** |
| --- | --- |
| Log Analytics Gateway/Active Client Connection |Number of active client network (TCP) connections |
| Log Analytics Gateway/Error Count |Number of errors |
| Log Analytics Gateway/Connected Client |Number of connected clients |
| Log Analytics Gateway/Rejection Count |Number of rejections due to any TLS validation error |
<!-- convertborder later -->
:::image type="content" source="./media/gateway/counters.png" lightbox="./media/gateway/counters.png" alt-text="Screenshot of Log Analytics gateway interface, showing performance counters" border="false":::

## Assistance

When you're signed in to the Azure portal, you can get help with the Log Analytics gateway or any other Azure service or feature.
To get help, select the question mark icon in the upper-right corner of the portal and select **New support request**. Then complete the new support request form.

:::image type="content" source="./media/gateway/support.png" lightbox="./media/gateway/support.png" alt-text="Screenshot of a new support request":::

## Next steps

[Add data sources](./../agents/agent-data-sources.md) to collect data from connected sources, and store the data in your Log Analytics workspace.
