<properties 
   pageTitle="connect-scom" 
   description="Connect computers directly to Operational Insights" 
   services="operational-insights" 
   documentationCenter="" 
   authors="lauracr" 
   manager="jwhit" 
   editor=""/>

<tags
   ms.service="operational-insights"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na" 
   ms.date="02/20/2015"
   ms.author="lauracr"/>

# Connect computers directly to Operational Insights 

You can connect computers directly to Operational Insights by installing the Operational Insights agent to each computer you'd like to on board. 


##Download, install and configure the Agent
###To Download the agent setup file
1. In the **Operations Insights portal**, on the **Overview** page, click **Servers and Usage**.
1. Under **Servers connected directly**, click **configure**.
1. Next to **Add Agents**, click the Agent link to download the setup file.
1. In the **Primary Workspace Key** box, select the key and copy it (CTRL+C).


### To install agent using setup
1. Run Setup to install the agent on a computer that you want to manage.
1. Select **Connect the agent to Microsoft Azure Operational Insights** and then click **Next**.
1. When prompted, enter the information that you copied in step 4.
1. When complete, the **Microsoft Management Agent** appears in **Control Panel**.

### To install agent using the command line
Modify and then use the following example to install the agent using the command line.

    MMASetup-AMD64.exe /C:"setup.exe /qn ADD_OPINSIGHTS_WORKSPACE=1 OPINSIGHTS_WORKSPACE_ID=<your workspace id> OPINSIGHTS_WORKSPACE_KEY=<your workspace key> AcceptEndUserLicenseAgreement=1"

## Reconfigure the Microsoft Monitoring Agent (Optional)
Use the following information to enable an agent to communicate directly with the Microsoft Azure Operational Insights service. After you've configured the agent, it will register with the agent service and will get necessary configuration information and management packs that contain intelligence pack information.

After data is collected from computers monitored by the agent, the number of computers monitored will appear in the Operational Insights portal on the Usage page under **Directly Connected Agents**. For any computer that sends data, you can view its data and assessment information in the Operational Insights portal.

You can also disable the agent, if needed or you enable it using the command line or script.

### To configure the agent
- After you've installed the **Microsoft Monitoring Agent**, open **Control Panel**.
- Open Microsoft Monitoring Agent and then click the Azure Operational Insights tab.
- Select **Connect to Azure Operational Insights**.
- In the **Workspace ID** box, type the workspace ID provided in the Operational Insights portal.
- In the Account Key box, paste the **Primary Workspace Key** that you copied when you installed the agent and then click **OK**.

### To disable an agent
- After installing the agent, open **Control Panel**.
- Open Microsoft Monitoring Agent and then click the **Azure Operational Insights** tab.
- Clear Connect to **Azure Operational Insights**.

### To Enable the agent using the command line or script
You can use either Windows PowerShell or a VB script with the following example.
    $healthServiceSettings = New-Object -ComObject 'AgentConfigManager.MgmtSvcCfg'
    $healthServiceSettings.EnableOnlineMonitoring('workspacename', 'workspacekey')
    $healthServiceSettings.ReloadConfiguration()
    



### Configure Proxy and Firewall Settings (Optional)
If you have proxy servers or firewalls in your environment that restrict access to the internet, you might need to follow the following procedures to enable Operations Manager and/or agents to communicate to the Operational Insights service 



- [Configure proxy and firewall settings (Optional)](https://msdn.microsoft.com/library/azure/dn884643.aspx) 


## Related Content

- [Blog post: Connect servers directly to Operational Insights](http://blogs.technet.com/b/momteam/archive/2015/01/20/connect-servers-directly-to-operational-insights.aspx)
- [Blog post: Enable Operational Insights for Azure Virtual machines](http://azure.microsoft.com/updates/easily-enable-operational-insights-for-azure-virtual-machines/)

