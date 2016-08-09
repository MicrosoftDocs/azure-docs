<properties
	pageTitle="Configure proxy and firewall settings in Log Analytics | Microsoft Azure"
	description="Configure proxy and firewall settings when your agents or OMS services need to use specific ports."
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
	ms.topic="get-started-article"
	ms.date="08/09/2016"
	ms.author="banders;magoedte"/>

# Configure proxy and firewall settings in Log Analytics


Actions needed to configure proxy and firewall settings for Log Analytics in OMS differ when you use Operations Manager and its agents versus Microsoft Monitoring Agents that connect directly to servers. Review the following sections for the type of agent that you use.

## Configure proxy and firewall settings with the Microsoft Monitoring Agent

For the Microsoft Monitoring Agent to connect to and register with the OMS service, it must have access to the port number of your domains and the URLs. If you use a proxy server for communication between the agent and the OMS service, you’ll need to ensure that the appropriate resources are accessible. If you use a firewall to restrict access to the Internet, you need to configure your firewall to permit access to OMS. The following tables list the ports that OMS needs.

|**Agent Resource**|**Ports**|**Bypass HTTPS inspection**|
|--------------|-----||--------------|
|*.ods.opinsights.azure.com|Port 443|Yes|
|*.oms.opinsights.azure.com|Port 443|Yes|
|*.blob.core.windows.net|Port 443|Yes|
|ods.systemcenteradvisor.com|Port 443| |

You can use the following procedure to configure proxy settings for the Microsoft Monitoring Agent using Control Panel. You'll need to use the procedure for each server. If you have many servers that you need to configure, you might find it easier to use a script to automate this process. If so, see the next procedure [To configure proxy settings for the Microsoft Monitoring Agent using a script](#to-configure-proxy-settings-for-the-microsoft-monitoring-agent-using-a-script).

### To configure proxy settings for the Microsoft Monitoring Agent using Control Panel

1. Open **Control Panel**.

2. Open **Microsoft Monitoring Agent**.

3. Click the **Proxy Settings** tab.  
  ![proxy settings tab](./media/log-analytics-proxy-firewall/proxy-direct-agent-proxy.png)

4. Select **Use a proxy server** and type the URL and port number, if one is needed, similar to the example shown. If your proxy server requires authentication, type the username and password to access the proxy server.

Use the following procedure to create a PowerShell script that you can run to set the proxy settings for each agent that connects directly to servers.

### To configure proxy settings for the Microsoft Monitoring Agent using a script


- Copy the following sample, update it with information specific to your environment, save it with a PS1 file name extension, and then run the script on each computer that connects directly to the OMS service.


```
param($ProxyDomainName="http://proxy.contoso.com:80", $cred=(Get-Credential))

# First we get the Health Service configuration object.  We need to determine if we
# have the right update rollup with the API we need.  If not, no need to run the rest of the script.
$healthServiceSettings = New-Object -ComObject 'AgentConfigManager.MgmtSvcCfg'

$proxyMethod = $healthServiceSettings | Get-Member -Name 'SetProxyInfo'

if (!$proxyMethod)
{
    Write-Output 'Health Service proxy API not present, will not update settings.'
    return
}

Write-Output "Clearing proxy settings."
$healthServiceSettings.SetProxyInfo('', '', '')

$ProxyUserName = $cred.username

Write-Output "Setting proxy to $ProxyDomainName with proxy username $ProxyUserName."
$healthServiceSettings.SetProxyInfo($ProxyDomainName, $ProxyUserName, $cred.GetNetworkCredential().password)
```

## Configure proxy and firewall settings with Operations Manager

For an Operations Manager management group to connect to and register with the OMS service, it must have access to the port numbers of your domains and URLs. If you use a proxy server for communication between the Operations Manager management server and the OMS service, you’ll need to ensure that the appropriate resources are accessible. If you use a firewall to restrict access to the Internet, you need to configure your firewall to permit access to OMS. Even if an Operations Manager management server is not behind a proxy server, its agents might be. In this case, the proxy server should be configured in the same manner as agents are in order to enable and allow Security and Log Management solution data to get sent to the OMS web service.

In order for Operations Manager agents to communicate with the OMS service, your Operations Manager infrastructure (including agents) should have the correct proxy settings and version. The proxy setting for agents is specified in the Operations Manager console. Your version should be one of the following:

- Operations Manager 2012 SP1 Update Rollup 7 or later
- Operations Manager 2012 R2 Update Rollup 3 or later


The following tables list the ports related to these tasks.

>[AZURE.NOTE] Some of the following resources mention Advisor and Operational Insights, both were previous versions of OMS. However, the listed resources will change in the future.

Here's a list of agent resources and ports:

|**Agent Resource**|**Ports**|
|--------------|-----|
|*.ods.opinsights.azure.com|Port 443|
|*.oms.opinsights.azure.com|Port 443|
|*.blob.core.windows.net/|Port 443|
|ods.systemcenteradvisor.com|Port 443|

Here's a list of management server resources and ports:

|**Management server resource**|**Ports**|**Bypass HTTPS inspection**|
|--------------|-----||--------------|
|service.systemcenteradvisor.com|Port 443| |
|*.service.opinsights.azure.com|Port 443| |
|*.blob.core.windows.net|Port 443|Yes| 
|data.systemcenteradvisor.com|Port 443| | 
|ods.systemcenteradvisor.com|Port 443| | 
|*.ods.opinsights.azure.com|Port 443|Yes| 

Here's a list of OMS and Operations Manager console resources and ports.

|**OMS and Operations Manager console resource**|**Ports**|
|----|----|
|service.systemcenteradvisor.com|443|
|*.service.opinsights.azure.com|443|
|*.live.com|Port 80 and 443|
|*.microsoft.com|Port 80 and 443|
|*.microsoftonline.com|Port 80 and 443|
|*.mmms.microsoft.com|Port 80 and 443|
|login.windows.net|Port 80 and 443|

Use the following procedures to register your Operations Manager management group with the OMS service. If you are having communication problems between the management group and the OMS service, use the validation procedures to troubleshoot data transmission to the OMS service.

### To request exceptions for the OMS service endpoints

1. Use the information from the first table presented previously to ensure that the resources needed for the Operations Manager management server are accessible through any firewalls you might have.
2. Use the information from the second table presented previously to ensure that the resources needed for the Operations console in Operations Manager and OMS are accessible through any firewalls you might have.
3. If you use a proxy server with Internet Explorer, ensure that it is configured and works correctly. To verify, you can open a secure web connection (HTTPS), for example [https://bing.com](https://bing.com). If the secure web connection doesn’t work in a browser, it probably won’t work in the Operations Manager management console with web services in the cloud.

### To configure the proxy server in the Operations Manager console

1. Open the Operations Manager console and select the **Administration** workspace.

2. Expand **Operational Insights**, and then select **Operational Insights Connection**.  
    ![Operations Manager OMS Connection](./media/log-analytics-proxy-firewall/proxy-om01.png)
3. In the OMS Connection view, click **Configure Proxy Server**.  
    ![Operations Manager OMS Connection Configure Proxy Server](./media/log-analytics-proxy-firewall/proxy-om02.png)
4. In Operational Insights Settings Wizard: Proxy Server, select **Use a proxy server to access the Operational Insights Web Service**, and then type the URL with the port number, for example, **http://myproxy:80**.  
    ![Operations Manager OMS proxy address](./media/log-analytics-proxy-firewall/proxy-om03.png)


### To specify credentials if the proxy server requires authentication
 Proxy server credentials and settings need to propagate to managed computers that will report to OMS. Those servers should be in the *Microsoft System Center Advisor Monitoring Server Group*. Credentials are encrypted in the registry of each server in the group.

1. Open the Operations Manager console and select the **Administration** workspace.
2. Under **RunAs Configuration**, select **Profiles**.
3. Open the **System Center Advisor Run As Profile Proxy** profile.  
    ![image of the System Center Advisor Run As Proxy profile](./media/log-analytics-proxy-firewall/proxy-proxyacct1.png)
4. In the Run As Profile Wizard, click **Add** to use a Run As account. You can create a new Run As account or use an existing account. This account needs to have sufficient permissions to pass through the proxy server.  
    ![image of the Run As Profile Wizard](./media/log-analytics-proxy-firewall/proxy-proxyacct2.png)
5. To set the account to manage, choose **A selected class, group, or object** to open the Object Search box.  
    ![image of the Run As Profile Wizard](./media/log-analytics-proxy-firewall/proxy-proxyacct2-1.png)
6. Search for then select **Microsoft System Center Advisor Monitoring Server Group**.  
    ![image of the Object Search box](./media/log-analytics-proxy-firewall/proxy-proxyacct3.png)
7. Click **OK** to close the Add a Run As account box.  
    ![image of the Run As Profile Wizard](./media/log-analytics-proxy-firewall/proxy-proxyacct4.png)
8. Complete the wizard and save the changes.  
    ![image of the Run As Profile Wizard](./media/log-analytics-proxy-firewall/proxy-proxyacct5.png)


### To validate that OMS management packs are downloaded

- If you've added solutions to OMS, you can view them in the Operations Manager console as management packs under **Administration**. Search for *System Center Advisor* to quickly find them.  
    ![management packs downloaded](./media/log-analytics-proxy-firewall/proxy-mpdownloaded.png)
- Or, you can also check for OMS management packs by using the following Windows PowerShell command in the Operations Manager management server:

    ```
    Get-ScomManagementPack | where {$_.DisplayName -match 'Advisor'} | select Name,DisplayName,Version,KeyToken
    ```

### To validate that Operations Manager is sending data to the OMS service

1. In the Operations Manager management server, open Performance Monitor (perfmon.exe), and select **Performance Monitor**.
2. Click **Add**, and then select **Health Service Management Groups**.
3. Add all the counters that start with **HTTP**.  
    ![add counters](./media/log-analytics-proxy-firewall/proxy-sendingdata1.png)
4. If your Operations Manager configuration is good, you will see activity for Health Service Management counters for events and other data items, based on the management packs that you added in OMS and the configured log collection policy.  
    ![Performance Monitor showing activity](./media/log-analytics-proxy-firewall/proxy-sendingdata2.png)


## Azure Automation Hybrid Runbook Worker

There are no inbound firewall requirements to support Hybrid Runbook Workers.

For the on-premises machine running Hybrid Runbook Worker, it must have outbound access to \*.cloudapp.net on ports 443, 9354, and 30000-30199.

## Next steps

- [Add Log Analytics solutions from the Solutions Gallery](log-analytics-add-solutions.md) to add functionality and gather data.
- Get familiar with [log searches](log-analytics-log-searches.md) to view detailed information gathered by solutions.
