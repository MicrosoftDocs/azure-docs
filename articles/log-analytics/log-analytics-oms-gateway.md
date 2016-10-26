<properties
	pageTitle="OMS Gateway | Microsoft Azure"
	description="Connect your OMS-managed devices and SCOM-monitored computers with the OMS Gateway to send data to the OMS service when they do not have Internet access."
	services="log-analytics"
	documentationCenter=""
	authors="bandersmsft"
	manager="jwhit"
	editor=""/>
<tags
	ms.service="log-analytics"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="10/26/2016"
	ms.author="banders"/>

# OMS Gateway

This document describes how your OMS-managed devices and SCOM-monitored computers can send data to the OMS service when they do not have Internet access. The OMS Gateway can collect the data and send it to the OMS service on their behalf.

The gateway is a HTTP forward proxy that supports HTTP tunneling using the HTTP CONNECT command. The gateway can handle up to 2000 OMS concurrently-connected devices when run on a 4-core CPU, 16 GB server running Windows.

As an example, your enterprise or large organization might have servers with network connectivity but might not have Internet connectivity. In another example, you might have many point of sale (POS) devices with no means of monitoring them directly. And in another example, SCOM can use the OMS Gateway as a proxy server. In these examples, the OMS Gateway can transfer data from the agents that are installed on these servers or POS devices to OMS.

Instead of each individual agent sending data directly to OMS, and requiring a direct Internet connection, all agent data is instead sent through a single computer that has an Internet connection. That is where you install and use the gateway. In this scenario, you can install agents on any computers where you want to collect data. The gateway then transfers data from the agents to OMS directly—the gateway does not analyze any of the data that is transferred.

To monitor the OMS Gateway and analyze performance or event data for the server where it is installed, you must install the OMS agent on the computer where the gateway is also installed.

The gateway must have access to the Internet to upload data to OMS. Each agent must also have network connectivity to its gateway so that agents can automatically transfer data to and from the gateway. For best results, do not install the gateway on a computer that is also a domain controller.

Here's a diagram that shows data flow from direct agents to OMS.

![direct agent diagram](./media/oms-gateway/direct-agent-diagram.png)

Here's a diagram that shows data flow from SCOM to OMS.

![SCOM diagram](./media/oms-gateway/scom-mgt-server.png)

## Install the OMS Gateway

Installing this Gateway replaces previous versions of the Gateway that you have installed (Log Analytics Forwarder).

Prerequisites: .Net Framework 4.5, Windows Server 2012 R2 SP1 and above

1. Download the latest version of the OMS Gateway from the [Microsoft Download Center](http://download.microsoft.com/download/2/5/C/25CF992A-0347-4765-BD7D-D45D5B27F92C/OMS%20Gateway.msi)
2. Double click **OMS Gateway.msi** to start the installation.
3. On the Welcome page, **Next**.  
    ![Gateway Setup wizard](./media/oms-gateway/gateway-wizard01.png)
4. On the License Agreement page, select **I accept the terms in the License Agreement** to agree to the EULA and then **Next**.
5. On the port and proxy address page, do the following:
    1. Type the TCP port number to be used for the gateway. Setup opens this port number from Windows firewall. The default value is 8080.
    The valid range of the port number is 1 - 65535. If the input does not fall into this range, an error message will appear.
    2. Optionally, if the server where the gateway is installed needs to use a proxy, type the proxy address where the gateway needs to connect. For example, `http://myorgname.corp.contoso.com:80` If blank, the gateway will try to connect to the Internet directly. Otherwise, the gateway will connect to the proxy. If your proxy server requires authentication, type your username and password.
        ![Gateway Wizard proxy configuration](./media/oms-gateway/gateway-wizard02.png)  
    3. Click **Next**
6. If you do not have Microsoft Updates enabled, the Microsoft Update page appears where you can choose to enable Microsoft Updates. Make a selection and then click **Next**. Otherwise, continue to the next step.
7. On the Destination Folder page, either leave the default folder **%ProgramFiles%\OMS Gateway** or type the location where you want to install gateway and then click **Next**.
8. On the Ready to install page, click **Install**. A User Account Control might appear requesting permission to install. If so, click **Yes**.
9. After Setup completes, click **Finish**. You can verify that the service is running by opening the services.msc snap-in and verify that **OMS Gateway** appears in the list of services.  
    ![Services – OMS Gateway](./media/oms-gateway/gateway-service.png)

## Install an agent on devices

If needed, see [Connect Windows computers to Log Analytics](..log-analytics-windows-agents.md) for information about how to install directly-connected agents. The article describes how you can install the agent using a Setup wizard or by using the command line.

## Configure OMS agents

See [Configure proxy and firewall settings with the Microsoft Monitoring Agent](..log-analytics-proxy-firewall.md) for information about configuring an agent to use the a proxy server, which is this case is the gateway.

SCOM agents send some data such as SCOM alerts, configuration assessment, instance space, and capacity data, through the Management Server. Other high-volume data, such as IIS logs, performance, security, etc., is sent directly to the OMS Gateway. See [Add Log Analytics solutions from the Solutions Gallery](..log-analytics-add-solutions.md) for a complete list of data that is sent through each channel.

>[AZURE.NOTE]
If you plan to use the Gateway with network load balancing, see [Optionally configure network load balancing](#optionally-configure-network-load-balancing).

## Configure a SCOM proxy server

You configure SCOM to add the gateway to act as a proxy server. When you update the proxy configuration, the proxy configuration is automatically applied to all the agents reporting to SCOM.

To use the Gateway to support SCOM, you need to have the following:

- Microsoft Monitoring Agent (agent version – **8.0.10900.0** and later) installed on the Gateway server and configured for the OMS workspaces with which you want to communicate.
- The gateway must have Internet connectivity or be connected to a proxy server that does.

### To configure SCOM for the gateway

1. Open the Operations Manager console and under **Operations Management Suite** , click **Connection** and then click **Configure Proxy Server** :  
    ![SCOM – Configure Proxy Server](./media/oms-gateway/scom01.png)
2. Select **Use a proxy server to access the Operations Management Suite** and then type the IP address of the OMS Gateway server. Ensure that you start with the `http://` prefix:  
    ![SCOM – proxy server address](./media/oms-gateway/scom02.png)
3. Click **Finish**. Your SCOM server is connected to your OMS workspace.

## Optionally configure network load balancing

You can configure the gateway for high availability using network load balancing by creating a cluster. The cluster manages traffic from your agents by redirecting the requested connections from the Microsoft Monitoring Agents across its nodes. If one Gateway server goes down, the traffic gets redirected to other nodes.

1. Open Network Load Balancing Manager and create a new cluster.
2. Right-click the cluster before adding gateways, and select **Cluster Properties.** Configure the cluster to have its own IP address:  
    ![Network Load Balancing Manager – Cluster IP Addresses](./media/oms-gateway/nlb01.png)
3. To connect an OMS Gateway server with the Microsoft Monitoring Agent installed, right-click the cluster's IP address, and then click **Add Host to Cluster**.  
    ![Network Load Balancing Manager – Add Host To Cluster](./media/oms-gateway/nlb02.png)
4. Enter the IP address of the Gateway's server that you want to connect:  
    ![Network Load Balancing Manager – Add Host To Cluster : Connect](./media/oms-gateway/nlb03.png)
5. On computers that do not have Internet connectivity, be sure to use the IP address of the cluster when you configure the **Microsoft Monitoring Agent Properties** :  
    ![Microsoft Monitoring Agent Properties – Proxy Settings](./media/oms-gateway/nlb04.png)

## Configure the Gateway for automation hybrid workers

If you have automation hybrid workers in your environment, the following steps provide manual, temporary workarounds to configure the Gateway to support them.

In the following steps, you need to know the Azure region where the Automation account resides. To locate the location:

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Select the Azure Automation service.
3. Select the appropriate Azure Automation account.
4. View its region under **Location**.  
    ![Azure Portal – Automation account location](./media/oms-gateway/location.png)

Use the following tables to identify the URL for each location:

**Job runtime dataservice URLs**

| **location** | **URL** |
| --- | --- |
| North Central US | ncus-jobruntimedata-prod-su1.azure-automation.net |
| West Europe | we-jobruntimedata-prod-su1.azure-automation.net |
| South Central US | scus-jobruntimedata-prod-su1.azure-automation.net |
| East US | eus-jobruntimedata-prod-su1.azure-automation.net |
| Central Canada | cc-jobruntimedata-prod-su1.azure-automation.net |
| North Europe | ne-jobruntimedata-prod-su1.azure-automation.net |
| South East Asia | sea-jobruntimedata-prod-su1.azure-automation.net |
| Central India | cid-jobruntimedata-prod-su1.azure-automation.net |
| Japan | jpe-jobruntimedata-prod-su1.azure-automation.net |
| Australia | ase-jobruntimedata-prod-su1.azure-automation.net |

**Agent service URLs**

| **location** | **URL** |
| --- | --- |
| North Central US | ncus-agentservice-prod-1.azure-automation.net |
| West Europe | we-agentservice-prod-1.azure-automation.net |
| South Central US | scus-agentservice-prod-1.azure-automation.net |
| East US | eus2-agentservice-prod-1.azure-automation.net |
| Central Canada | cc-agentservice-prod-1.azure-automation.net |
| North Europe | ne-agentservice-prod-1.azure-automation.net |
| South East Asia | sea-agentservice-prod-1.azure-automation.net |
| Central India | cid-agentservice-prod-1.azure-automation.net |
| Japan | jpe-agentservice-prod-1.azure-automation.net |
| Australia | ase-agentservice-prod-1.azure-automation.net |

If your computer is registered as a hybrid worker automatically for patching using the Update Management solution, use these steps:

1. Add the Job Runtime Data service URLs to the Allowed Host list on the OMS Gateway. For example:
    `Add-OMSGatewayAllowedHost we-jobruntimedata-prod-su1.azure-automation.net`
2. Restart the OMS Gateway Service by using the following PowerShell cmdlet:
`Restart-Service OMSGatewayService`

If your computer is on-boarded to Azure Automation by using the hybrid worker registration cmdlet, use these steps:

1. Add the agent service registration URL to the Allowed Host list on the OMS Gateway. For example:
`Add-OMSGatewayAllowedHost ncus-agentservice-prod-1.azure-automation.net`
2. Add the Job Runtime Data service URLs to the Allowed Host list on the OMS Gateway. For example:
    `Add-OMSGatewayAllowedHost we-jobruntimedata-prod-su1.azure-automation.net`
3. Restart the OMS Gateway Service.
    `Restart-Service OMSGatewayService`

## Useful PowerShell cmdlets

Cmdlets help you to carry certain tasks to update the OMS Gateway's configuration settings. Before you use them, be sure to do the following:

1. Install the OMS Gateway (MSI).
2. Open the PowerShell window.
3. Type this command to import the module: `Import-Module OMSGateway`
4. If no error occurred in the previous step, the module was successfully imported, and the cmdlets can be used. Type `Get-Module OMSGateway`
5. After you make changes by using the cmdlets, ensure that you restart the Gateway service.

If you get an error in step 3, the module wasn't imported. This is usually caused because PowerShell was unable to find the module. You can find it in the Gateway's installation path: C:\Program File\Microsoft OMS Gateway\PowerShell.

| **Cmdlet** | **Parameters** | **Description** | **Examples** |
| --- | --- | --- | --- |
| `Set-OMSGatewayConfig` | Key (required) <br> Value | Changes the configuration of the service | `Set-OMSGatewayConfig -Name ListenPort -Value 8080` |
| `Get-OMSGatewayConfig` | Key | Gets the configuration of the service | `Get-OMSGatewayConfig` <br> <br> `Get-OMSGatewayConfig -Name ListenPort` |
| `Set-OMSGatewayRelayProxy` | Address <br> Username <br> Password | Sets the address (and credential) of relay (upstream) proxy | 1. Set a reply proxy and the credential: `Set-OMSGatewayRelayProxy -Address http://www.myproxy.com:8080 -Username user1 -Password 123` <br> <br> 2. Set a reply proxy that doesn't need authentication: `Set-OMSGatewayRelayProxy -Address http://www.myproxy.com:8080` <br> <br> 3. Clear the reply proxy setting, that is, do not need a reply proxy: `Set-OMSGatewayRelayProxy -Address ""` |
| `Get-OMSGatewayRelayProxy` |   | Gets the address of relay (upstream) proxy | `Get-OMSGatewayRelayProxy` |
| `Add-OMSGatewayAllowedHost` | Host (required) | Adds the host to the allowed list | `Add-OMSGatewayAllowedHost -Host www.test.com` |
| `Remove-OMSGatewayAllowedHos`t | Host (required) | Removes the host from the allowed list | `Remove-OMSGatewayAllowedHost -Host www.test.com` |
| `Get-OMSGatewayAllowedHost` |   | Gets the currently allowed host (only the locally configured allowed host, do not include automatically downloaded allowed hosts) | `Get-OMSGatewayAllowedHost` |
| `Add-OMSGatewayAllowedClientCertificate` | Subject (required) | Adds the client certificate subject to the allowed list | `Add-OMSGatewayAllowedClientCertificate -Subject mycert` |
| `Remove-OMSGatewayAllowedClientCertificate` | Subject (required) | Removes the client certificate subject from the allowed list | `Remove- OMSGatewayAllowedClientCertificate -Subject mycert` |
| `Get-OMSGatewayAllowedClientCertificat`e |   | Gets the  currently allowed client certificate subjects (only the locally configured allowed subjects, do not include automatically downloaded allowed subjects) | `Get-OMSGatewayAllowedClientCertificate` |

## Troubleshoot the gateway

We recommend that you install the OMS agent on computers that have the gateway installed. You can then use the agent to collect the events that are logged by the gateway.

![Event Viewer – OMS Gateway Log](./media/oms-gateway/event-viewer.png)

**OMS Gateway Event IDs and descriptions**

The following table shows the event IDs and descriptions for OMS Gateway Log events.

| **ID** | **Description** |
| --- | --- |
| 400 | Any application error that does not have a specific ID |
| 401 | Wrong configuration. For example: listenPort = "text" instead of an integer |
| 402 | Exception in parsing TLS handshake messages |
| 403 | Networking error. For example: cannot connect to target server |
| 100 | General information |
| 101 | Service has started |
| 102 | Service has stopped |
| 103 | Received a HTTP CONNECT command from client |
| 104 | Not a HTTP CONNECT command |
| 105 | Destination server is not in allowed list or the destination port is not secure port (443) <br> <br> To resolve this problem, ensure that the MMA agent on your Gateway server and the agents communicating with the Gateway are connected to the same Log Analytics workspace.|
| 105 | ERROR TcpConnection – Invalid Client certificate: CN=Gateway <br><br> To resolve this problem, ensure the following: <br>	<br> 1. You are using a Gateway with version number 1.0.395.0 or greater. <br> 2. The MMA agent on your Gateway server and the agents communicating with the Gateway are connected to the same Log Analytics workspace. |
| 106 | Any reason that the TLS session is suspicious and rejected |
| 107 | The TLS session has been verified |

**Performance counters to collect**

The following table shows the performance counters available for the OMS Gateway. You can add the counters using Performance Monitor.

| **Name** | **Description** |
| --- | --- |
| OMS Gateway/Active Client Connection | Number of active client network (TCP) connections |
| OMS Gateway/Error Count | Number of errors |
| OMS Gateway/Connected Client | Number of connected clients |
| OMS Gateway/Rejection Count | Number of rejections due to any TLS validation error |

![OMS Gateway performance counters](./media/oms-gateway/counters.png)


## Get assistance from Microsoft

When you're signed-in to the Azure portal, you can create a new support request for assistance with the OMS Gateway or any other Azure service or feature of a service.
To request assistance, click the question mark symbol in the top right corner of the portal and then click **New support request**. Then, complete the new support request form.

![New support request](./media/oms-gateway/support.png)

You can also leave feedback about OMS or Log Analytics at the [Microsoft Azure feedback forum](https://feedback.azure.com/forums/267889).

## Next steps

- [Add data sources](log-analytics-data-sources.md) to collect data from the Connected Sources in your OMS workspace and store it in the OMS repository.
