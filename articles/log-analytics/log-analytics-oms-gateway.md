---
title: Connect computers by using the OMS Gateway | Microsoft Docs
description: Connect your devices and Operations Manager-monitored computers with the OMS Gateway to send data to the Azure Automation and Log Analytics service when they do not have internet access.
services: log-analytics
documentationcenter: ''
author: MGoedtel
manager: carmonm
editor: ''
ms.assetid: ae9a1623-d2ba-41d3-bd97-36e65d3ca119
ms.service: log-analytics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/14/2018
ms.author: magoedte
---

# Connect computers without internet access by using the OMS Gateway
This document describes how to configure communication with Azure Automation and Log Analytics by using the OMS Gateway when directly connected computers or Operations Manager-monitored computers don't have internet access. The OMS Gateway is an HTTP-forward proxy that supports HTTP tunneling by using the HTTP CONNECT command. It can collect data and send it to Azure Automation and Log Analytics on behalf of the computers without internet access.  

The OMS Gateway supports:

* Azure Automation Hybrid Runbook Workers  
* Windows computers with the Microsoft Monitoring Agent directly connected to a Log Analytics workspace
* Linux computers with the OMS Agent for Linux directly connected to a Log Analytics workspace  
* System Center Operations Manager 2012 SP1 with UR7, Operations Manager 2012 R2 with UR3, Operations Manager 2016, and Operations Manager version 1801 management group integrated with Log Analytics  

If your IT security policies don't allow certain computers on your network to connect to the internet (such as point-of-sale devices or servers that support IT services) but you need to connect them to Azure Automation or Log Analytics to manage and monitor them, they can be configured to communicate directly with the OMS Gateway.

 If these computers are configured with the OMS agent to directly connect to a Log Analytics workspace, all computers instead communicate with the OMS Gateway. The OMS Gateway transfers data from the agents to the service directly. It doesn't analyze any of the data while it's in transit.

When an Operations Manager management group is integrated with Log Analytics, the management servers can be configured to connect to the OMS Gateway to receive configuration information and send collected data. Operations Manager agents send some data, such as Operations Manager alerts, configuration assessment, instance space, and capacity data to the management server. Other high-volume data, such as IIS logs, performance information, and security events, are sent directly to the OMS Gateway.  

If you have one or more Operations Manager Gateway servers that are deployed in a DMZ or other isolated network to monitor untrusted systems, they cannot communicate with an OMS Gateway. Operations Manager Gateway servers can only report to a management server. 

When an Operations Manager management group is configured to communicate with the OMS Gateway, the proxy configuration information is automatically distributed to every agent-managed computer that is configured to collect data for Log Analytics, even if the setting is empty.    

To provide high availability for direct-connected or Operations Management groups that communicate with Log Analytics through the OMS Gateway, you can use network load balancing to redirect and distribute the traffic across multiple OMS Gateway servers. If one gateway server goes down, the traffic is redirected to another available node.  

We recommended that you install the OMS agent on the computer that's running the OMS Gateway software to monitor it and analyze performance or event data. Additionally, the agent helps the OMS Gateway identify the service end points that it needs to communicate with.

All agents must have network connectivity to their gateway so that they can automatically transfer data to and from the gateway. We don't recommend installing a gateway on a domain controller.

The following diagram shows data flow from direct agents to Azure Automation and Log Analytics using the gateway server. The proxy configuration of the agent must use the same port that the OMS Gateway uses to communicate with the service.  

![Direct agent communication with services diagram](./media/log-analytics-oms-gateway/oms-omsgateway-agentdirectconnect.png)

The following diagram shows data flow from an Operations Manager management group to Log Analytics.   

![Operations Manager communication with Log Analytics diagram](./media/log-analytics-oms-gateway/log-analytics-agent-opsmgrconnect.png)

## Prerequisites

When you designate a computer to run the OMS Gateway, make sure it has the following components:

* Windows 10, Windows 8.1, Windows 7
* Windows Server 2016, Windows Server 2012 R2, Windows Server 2012, Windows Server 2008 R2, Windows Server 2008
* .NET Framework 4.5
* Minimum of a 4-core processor and 8 GB of memory 

### Language availability

The OMS Gateway is available in the following languages:

- Chinese (simplified)
- Chinese (traditional)
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
The OMS Gateway supports only Transport Layer Security (TLS) 1.0, 1.1, and 1.2.  It does not support Secure Sockets Layer (SSL).

### Supported number of agent connections
The following table highlights the supported number of agents that are communicating with a gateway server. This support is based on agents uploading approximately 200 KB of data every 6 seconds. The data volume per agent tested is about 2.7 GB per day.

|Gateway |Approximate number of agents that are supported|  
|--------|----------------------------------|  
|- CPU: Intel XEON CPU E5-2660 v3 @ 2.6 GHz 2 Cores<br> - Memory: 4 GB<br> - Network Bandwidth: 1 Gbps| 600|  
|- CPU: Intel XEON CPU E5-2660 v3 @ 2.6 GHz 4 Cores<br> - Memory: 8 GB<br> - Network Bandwidth: 1 Gbps| 1000|  

## Download the OMS Gateway

There are two ways to get the latest version of the OMS Gateway setup file.

1. Download it from the [Microsoft Download Center](https://www.microsoft.com/download/details.aspx?id=54443).

2. Download it from the Azure portal. After you sign in to the Azure portal, take the following steps:  

   1. Browse the list of services, and then select **Log Analytics**.  
   2. Select a workspace.
   3. In your workspace blade, under **General**, select **Quick Start**.
   4. Under **Choose a data source to connect to the workspace**, select **Computers**.
   5. In the **Direct Agent** panel, select **Download OMS Gateway**.
   
    ![Download OMS Gateway](./media/log-analytics-oms-gateway/download-gateway.png)

-- OR-- 

   1. In your workspace blade, under **Settings**, select **Advanced settings**.
   2. Select **Connected Sources** > **Windows Servers**. Then select **Download OMS Gateway**.

## Install the OMS Gateway

To install a gateway, take the following steps. If you installed the previous version, formerly called *Log Analytics Forwarder*, it will be upgraded to this release.  

1. In the destination folder, select **OMS Gateway.msi**.
2. On the **Welcome** page, select **Next**.

 ![Gateway Setup wizard](./media/log-analytics-oms-gateway/gateway-wizard01.png)
  
3. On the **License Agreement** page, select **I accept the terms in the License Agreement**. Then select **Next**.

4. On the **Port and proxy address** page:

   a. Type the TCP port number to be used for the gateway. Setup configures an inbound rule with this port number on Windows firewall. The default value is 8080. The valid range of the port number is 1 to 65535. If the input does not fall into this range, an error message appears.

   b. Optionally, if the server where the gateway is installed needs to communicate through a proxy, type the proxy to which the gateway needs to connect. An example would be `http://myorgname.corp.contoso.com:80`, as shown in the following screenshot. If you leave this field blank, the gateway tries to connect to the internet directly.  If your proxy server requires authentication, enter a user name and password.
   
    ![Gateway Wizard proxy configuration](./media/log-analytics-oms-gateway/gateway-wizard02.png)

4. Select **Next**.

5. If you don't have Microsoft Update enabled, the Microsoft Update page appears, and you can choose to enable it. Make a selection, and then select **Next**. Otherwise, continue to the next step.

6. On the **Destination Folder** page, either leave the default folder as **C:\Program Files\OMS Gateway** or type the location where you want to install the OMS gateway. Then select **Next**.

7. On the **Ready to install** page, select **Install**. User Account Control might appear requesting permission to install. If you get a request for permission, select **Yes**.

8. After setup finishes, select **Finish**. You can verify that the service is running by opening the services.msc snap-in, making sure that **OMS Gateway** appears in the list of services, and that its status is **Running**.

    ![Services – OMS Gateway](./media/log-analytics-oms-gateway/gateway-service.png)  

## Configure network load balancing 
You can configure the gateway for high availability by using network load balancing (NLB). Use either Microsoft Network Load Balancing or hardware-based load balancers.  The load balancer manages traffic by redirecting the requested connections from the OMS agents or Operations Manager management servers across its nodes. If one gateway server goes down, the traffic gets redirected to other nodes.

To learn how to design and deploy a Windows Server 2016 network load balancing cluster, see [Network load balancing](https://technet.microsoft.com/windows-server-docs/networking/technologies/network-load-balancing).  The following steps describe how to configure a Microsoft network load balancing cluster.  

1.  Sign in with an administrative account to the Windows server that is a member of the NLB cluster.  

2.  In Server Manager, open Network Load Balancing Manager. Select **Tools**, and then select **Network Load Balancing Manager**.

3. To connect an OMS Gateway server with the Microsoft Monitoring Agent installed, right-click the cluster's IP address, and then select **Add Host to Cluster**.

 ![Network Load Balancing Manager--Add Host To Cluster](./media/log-analytics-oms-gateway/nlb02.png)

4. Enter the IP address of the gateway server to which you want to connect.

    ![Network Load Balancing Manager--Add Host To Cluster: Connect](./media/log-analytics-oms-gateway/nlb03.png) 
    
## Configure the OMS agent and the Operations Manager management group
The following sections in this article include steps on how to configure directly connected OMS agents, an Operations Manager management group, or Azure Automation Hybrid Runbook workers with the OMS Gateway to communicate with Azure Automation or Log Analytics.  

To understand requirements and steps for installing the OMS agent on Windows computers that directly connect to Log Analytics, see [Collect data from computers in your environment with Log Analytics](log-analytics-concept-hybrid.md#prerequisites).

 For Linux computers, see [Connect Linux computers to Log Analytics](log-analytics-quick-collect-linux-computer.md). For information related to the Automation Hybrid Runbook Worker, see [Deploy Hybrid Runbook Worker](../automation/automation-hybrid-runbook-worker.md).

### Configure the standalone OMS agent
For information about configuring an agent to use a proxy server (which in this case is the gateway), see [Collect data from computers in your environment with Log Analytics](log-analytics-concept-hybrid.md#prerequisites). If you have deployed multiple gateway servers behind a network load balancer, the OMS agent proxy configuration is the virtual IP address of the NLB:

![Microsoft Monitoring Agent Properties – proxy settings](./media/log-analytics-oms-gateway/nlb04.png)

### Configure Operations Manager: all agents use the same proxy server
You configure Operations Manager to add the gateway server.  The Operations Manager proxy configuration is automatically applied to all agents that report to Operations Manager, even if the setting is empty.  

To use the OMS Gateway to support Operations Manager, the following components must be in place:

* Microsoft Monitoring Agent (agent version **8.0.10900.0** or later) installed on the gateway server and configured for the Log Analytics workspaces with which you want to communicate.

* A gateway that has internet connectivity or a connection to a proxy server that does.

> [!NOTE]
> If you don't specify a value for the gateway, blank values are pushed to all agents.
> 

If this is the first time your Operations Manager management group is registering with a Log Analytics workspace, the option to specify the proxy configuration for the management group won't be available in the Operations console. 

The management group has to be successfully registered with the service before this option is available. Update the system proxy configuration using Netsh on the same system on which you're running the Operations console and all management servers in the management group.

1. Open an elevated command prompt.

    a. Go to **Start**. Then type **cmd**.
    
    b. Right-click **Command prompt**. Then select **Run as administrator**.
    
2. Enter the following command, and then select **Enter**:

    `netsh winhttp set proxy <proxy>:<port>`

After you complete the integration with Log Analytics, you can remove the change by running `netsh winhttp reset proxy`. Then use the **Configure proxy server** option in the Operations console to specify the OMS Gateway server. 

1. Open the Operations Manager console. Under **Operations Management Suite**, select **Connection**. Then select **Configure Proxy Server**.

    ![Operations Manager--Configure Proxy Server](./media/log-analytics-oms-gateway/scom01.png)

2. Select **Use a proxy server to access the Operations Management Suite**. Then type the IP address of the OMS Gateway server or the virtual IP address of the NLB. Ensure that you start with the `http://` prefix.

    ![Operations Manager--proxy server address](./media/log-analytics-oms-gateway/scom02.png)

3. Select **Finish**. Your Operations Manager management group is now configured to communicate through the gateway server to the Log Analytics service.

### Configure Operations Manager: specific agents use proxy server
For large or complex environments, you might only want specific servers (or groups) to use the OMS Gateway server. For these servers, you cannot update the Operations Manager agent directly, because this value is overwritten by the global value for the management group. Instead you override the rule that's used to push these values.  

> [!NOTE] 
> This same configuration technique can be used to allow the use of multiple OMS Gateway servers in your environment. For example, you might require specific OMS Gateway servers to be specified on a per-region basis.
>  

1. Open the Operations Manager console, and then select the **Authoring** workspace.

2. In the Authoring workspace, select **Rules**. Then select the **Scope** button on the Operations Manager toolbar. If this button is not available, check to make sure that you have an object, not a folder, selected in the **Monitoring** pane. The **Scope Management Pack Objects** dialog box displays a list of common targeted classes, groups, or objects. 

3. in the **Look for** field, type **Health Service**. Then select it from the list. Select **OK**.  

4. Search for the rule **Advisor Proxy Setting Rule**. In the Operations console toolbar, select **Overrides**. Then select **Override the Rule\For a specific object of class: Health Service**. 

5. Next, select a specific object from the list. 

6. (Optional) Create a custom group that contains the health service object of the servers to which you want to apply this override. Then you can then apply the override to that group.

7. In the **Override Properties** dialog box, click to place a check mark in the **Override** column next to the **WebProxyAddress** parameter.  In the **Override Value** field, enter the URL of the OMS Gateway server, ensuring that it starts with the `http://` prefix.  

    >[!NOTE]
    > You don't need to enable the rule. It's already managed automatically with an override that's contained in the Microsoft System Center Advisor Secure Reference Override management pack that targets the Microsoft System Center Advisor Monitoring Server Group.
    >   

8. Either select a management pack from the **Select destination management pack** list, or create a new unsealed management pack by selecting **New**. 

9. When you complete your changes, select **OK**. 

### Configure the OMS Gateway for Automation Hybrid Runbook Workers
If you have Automation Hybrid Runbook Workers in your environment, the following steps provide manual, temporary workarounds to configure the OMS Gateway to support them.

In the following steps, you need to know the Azure region where the Automation account resides. To find the location, take the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Select the Azure Automation service.
3. Select the appropriate Azure Automation account.
4. Under **Location**, view the region of the account.

    ![Azure portal--Automation account location](./media/log-analytics-oms-gateway/location.png)  

Use the following tables to identify the URL for each location:

**Job runtime data service URLs**

| **Location** | **URL** |
| --- | --- |
| North Central US |ncus-jobruntimedata-prod-su1.azure-automation.net |
| West Europe |we-jobruntimedata-prod-su1.azure-automation.net |
| South Central US |scus-jobruntimedata-prod-su1.azure-automation.net |
| East US 2 |eus2-jobruntimedata-prod-su1.azure-automation.net |
| Central Canada |cc-jobruntimedata-prod-su1.azure-automation.net |
| North Europe |ne-jobruntimedata-prod-su1.azure-automation.net |
| South East Asia |sea-jobruntimedata-prod-su1.azure-automation.net |
| Central India |cid-jobruntimedata-prod-su1.azure-automation.net |
| Japan |jpe-jobruntimedata-prod-su1.azure-automation.net |
| Australia |ase-jobruntimedata-prod-su1.azure-automation.net |

**Agent service URLs**

| **Location** | **URL** |
| --- | --- |
| North Central US |ncus-agentservice-prod-1.azure-automation.net |
| West Europe |we-agentservice-prod-1.azure-automation.net |
| South Central US |scus-agentservice-prod-1.azure-automation.net |
| East US 2 |eus2-agentservice-prod-1.azure-automation.net |
| Central Canada |cc-agentservice-prod-1.azure-automation.net |
| North Europe |ne-agentservice-prod-1.azure-automation.net |
| South East Asia |sea-agentservice-prod-1.azure-automation.net |
| Central India |cid-agentservice-prod-1.azure-automation.net |
| Japan |jpe-agentservice-prod-1.azure-automation.net |
| Australia |ase-agentservice-prod-1.azure-automation.net |

If your computer is automatically registered as a Hybrid Runbook Worker for patching using the Update Management solution, follow these steps:

1. Add the Job Runtime Data service URLs to the Allowed Host list on the OMS Gateway. For example, type the following:
    `Add-OMSGatewayAllowedHost we-jobruntimedata-prod-su1.azure-automation.net`

2. Restart the OMS Gateway service by using the following PowerShell cmdlet:
   `Restart-Service OMSGatewayService`

If you on-board your computer to Azure Automation by using the Hybrid Runbook Worker registration cmdlet, follow these steps:

1. Add the agent service registration URL to the Allowed Host list on the OMS Gateway. For example, type the following:
   `Add-OMSGatewayAllowedHost ncus-agentservice-prod-1.azure-automation.net`

2. Add the Job Runtime Data service URLs to the Allowed Host list on the OMS Gateway. For example, type the following:
    `Add-OMSGatewayAllowedHost we-jobruntimedata-prod-su1.azure-automation.net`

3. Restart the OMS Gateway service:
    `Restart-Service OMSGatewayService`

## Useful PowerShell cmdlets
Cmdlets can help you complete tasks that are necessary for updating the configuration settings of the OMS Gateway. Before you use them, be sure to take the following steps:

1. Install the OMS Gateway (MSI).
2. Open a PowerShell console window.
3. Import the module by typing this command: `Import-Module OMSGateway`.
4. If no error occurred in the previous step, the module was successfully imported and the cmdlets can be used. Type `Get-Module OMSGateway`.
5. After you make changes by using the cmdlets, ensure that you restart the OMS Gateway service.

If you get an error in step 3, the module wasn't imported. The error might occur when PowerShell is unable to find the module. You can find it in the OMS Gateway installation path: *C:\Program Files\Microsoft OMS Gateway\PowerShell*.

| **Cmdlet** | **Parameters** | **Description** | **Example** |
| --- | --- | --- | --- |  
| `Get-OMSGatewayConfig` |Key |Gets the configuration of the service |`Get-OMSGatewayConfig` |  
| `Set-OMSGatewayConfig` |Key (required) <br> Value |Changes the configuration of the service |`Set-OMSGatewayConfig -Name ListenPort -Value 8080` |  
| `Get-OMSGatewayRelayProxy` | |Gets the address of the relay (upstream) proxy |`Get-OMSGatewayRelayProxy` |  
| `Set-OMSGatewayRelayProxy` |Address<br> Username<br> Password |Sets the address (and credential) of the relay (upstream) proxy |1. Set a relay proxy and credential:<br> `Set-OMSGatewayRelayProxy`<br>`-Address http://www.myproxy.com:8080`<br>`-Username user1 -Password 123` <br><br> 2. Set a relay proxy that doesn't need authentication: `Set-OMSGatewayRelayProxy`<br> `-Address http://www.myproxy.com:8080` <br><br> 3. Clear the relay proxy setting:<br> `Set-OMSGatewayRelayProxy` <br> `-Address ""` |  
| `Get-OMSGatewayAllowedHost` | |Gets the currently allowed host (only the locally configured allowed host; does not include automatically downloaded allowed hosts) |`Get-OMSGatewayAllowedHost` | 
| `Add-OMSGatewayAllowedHost` |Host (required) |Adds the host to the allowed list |`Add-OMSGatewayAllowedHost -Host www.test.com` |  
| `Remove-OMSGatewayAllowedHost` |Host (required) |Removes the host from the allowed list |`Remove-OMSGatewayAllowedHost`<br> `-Host www.test.com` |  
| `Add-OMSGatewayAllowedClientCertificate` |Subject (required) |Adds the client certificate subject to the allowed list |`Add-OMSGatewayAllowed`<br>`ClientCertificate` <br> `-Subject mycert` |  
| `Remove-OMSGatewayAllowedClientCertificate` |Subject (required) |Removes the client certificate subject from the allowed list |`Remove-OMSGatewayAllowed` <br> `ClientCertificate` <br> `-Subject mycert` |  
| `Get-OMSGatewayAllowedClientCertificate` | |Gets the currently allowed client certificate subjects (only the locally configured allowed subjects; does not include automatically downloaded allowed subjects) |`Get-`<br>`OMSGatewayAllowed`<br>`ClientCertificate` |  

## Troubleshooting
To collect events that are logged by the gateway, you need to also have the OMS agent installed.

![Event Viewer--OMS Gateway Log](./media/log-analytics-oms-gateway/event-viewer.png)

**OMS Gateway event IDs and descriptions**

The following table shows the event IDs and descriptions for OMS Gateway log events:

| **ID** | **Description** |
| --- | --- |
| 400 |Any application error that does not have a specific ID. |
| 401 |Wrong configuration. For example: listenPort = "text" instead of an integer. |
| 402 |Exception in parsing TLS handshake messages. |
| 403 |Networking error. For example: cannot connect to target server. |
| 100 |General information. |
| 101 |Service has started. |
| 102 |Service has stopped. |
| 103 |Received an HTTP CONNECT command from client. |
| 104 |Not an HTTP CONNECT command. |
| 105 |Destination server is not in allowed list or the destination port is not secure port (443). <br> <br> Ensure that the MMA agent on your Gateway server and the agents that are communicating with the Gateway are connected to the same Log Analytics workspace. |
| 105 |ERROR TcpConnection – Invalid Client certificate: CN=Gateway <br><br> Ensure that: <br>    <br> - You are using a Gateway with version number 1.0.395.0 or greater. <br> - The MMA agent on your Gateway server and the agents that are communicating with the gateway are connected to the same Log Analytics workspace. |
| 106 |The OMS Gateway only supports TLS 1.0, TLS 1.1 and 1.2.  It does not support SSL. For any unsupported TLS/SSL protocol version, OMS Gateway generates event ID 106.|
| 107 |The TLS session has been verified. |

**Performance counters to collect**

The following table shows the performance counters that are available for the OMS Gateway. You can add the counters by using Performance Monitor.

| **Name** | **Description** |
| --- | --- |
| OMS Gateway/Active Client Connection |Number of active client network (TCP) connections |
| OMS Gateway/Error Count |Number of errors |
| OMS Gateway/Connected Client |Number of connected clients |
| OMS Gateway/Rejection Count |Number of rejections due to any TLS validation error |

![OMS Gateway performance counters](./media/log-analytics-oms-gateway/counters.png)

## Get assistance
When you are signed in to the Azure portal, you can create a request for assistance with the OMS Gateway or any other Azure service or feature of a service.

To request assistance, select the question mark symbol in the upper right corner of the portal. Then select **New support request**. Complete the new support request form.

![New support request](./media/log-analytics-oms-gateway/support.png)

## Next steps
[Add data sources](log-analytics-data-sources.md) to collect data from your connected sources and store it in your Log Analytics workspace.
