---
title: Managing the Azure Log Analytics Agent | Microsoft Docs
description: This article describes the different management tasks that you will typically perform during the lifecycle of the Microsoft Monitoring Agent (MMA) deployed on a machine.
services: log-analytics
documentationcenter: ''
author: mgoedtel
manager: carmonm
editor: ''
ms.assetid: 
ms.service: log-analytics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 03/30/2018
ms.author: magoedte
ms.component: 
---

# Managing and maintaining the Log Analytics agent for Windows and Linux

After initial deployment of the Windows or Linux agent for Log Analytics, you may need to reconfigure the agent, or remove it from the computer if has reached the retirement stage in its lifecycle.  You can easily manage these routine maintenance tasks manually or through automation, which reduces both operational error and expenses.

## Adding or removing a workspace 

### Windows agent

#### Update settings from Control Panel

1. Sign on to the computer with an account that has administrative rights.
2. Open **Control Panel**.
3. Select **Microsoft Monitoring Agent** and then click the **Azure Log Analytics (OMS)** tab.
4. If removing a workspace, select it and then click **Remove**. Repeat this step for any other workspace you want the agent to stop reporting to.
5. If adding a workspace, click **Add** and on the **Add a Log Analytics Workspace** dialog box, paste the Workspace ID and Workspace Key (Primary Key). If the computer should report to a Log Analytics workspace in Azure Government cloud, select Azure US Government from the Azure Cloud drop-down list. 
6. Click **OK** to save your changes.

#### Remove a workspace using PowerShell 

```PowerShell
$workspaceId = "<Your workspace Id>"
$mma = New-Object -ComObject 'AgentConfigManager.MgmtSvcCfg'
$mma.RemoveCloudWorkspace($workspaceId)
$mma.ReloadConfiguration()
```

#### Add a workspace in Azure commercial using PowerShell 

```PowerShell
$workspaceId = "<Your workspace Id>"
$workspaceKey = "<Your workspace Key>”
$mma = New-Object -ComObject 'AgentConfigManager.MgmtSvcCfg'
$mma.AddCloudWorkspace($workspaceId, $workspaceKey)
$mma.ReloadConfiguration()
```

#### Add a workspace in Azure for US Government using PowerShell 

```PowerShell
$workspaceId = "<Your workspace Id>"
$workspaceKey = "<Your workspace Key>”
$mma = New-Object -ComObject 'AgentConfigManager.MgmtSvcCfg'
$mma.AddCloudWorkspace($workspaceId, $workspaceKey, 1)
$mma.ReloadConfiguration()
```

>[!NOTE]
>If you've used the command line or script previously to install or configure the agent, `EnableAzureOperationalInsights` was replaced by `AddCloudWorkspace` and `RemoveCloudWorkspace`.
>

### Linux agent
The following steps demonstrate how to reconfigure the Linux agent if you decide to register it with a different workspace or want to remove a workspace from its configuration.  

1.  To verify it is registered to a workspace, run the following command.

    `/opt/microsoft/omsagent/bin/omsadmin.sh -l` 

    It should return a status similar to the following example - 

    `Primary Workspace: <workspaceId>   Status: Onboarded(OMSAgent Running)`

    It is important that the status also shows the agent is running, otherwise the following steps to reconfigure the agent will not complete successfully.  

2. If it is already registered with a workspace, remove the registered workspace by running the following command.  Otherwise if it is not registered, proceed to the next step.

    `/opt/microsoft/omsagent/bin/omsadmin.sh -X`  
    
3. To register with a different workspace, run the command `/opt/microsoft/omsagent/bin/omsadmin.sh -w <workspace id> -s <shared key> [-d <top level domain>]` 
4. To verify your changes took affect, run the command.

    `/opt/microsoft/omsagent/bin/omsadmin.sh -l` 

    It should return a status similar to the following example - 

    `Primary Workspace: <workspaceId>   Status: Onboarded(OMSAgent Running)`

The agent service does not need to be restarted in order for the changes to take effect.

## Update proxy settings 
To configure the agent to communicate to the service through a proxy server or [OMS Gateway](log-analytics-oms-gateway.md) after deployment, use one of the following methods to complete this task.

### Windows agent

#### Update settings using Control Panel

1. Sign on to the computer with an account that has administrative rights.
2. Open **Control Panel**.
3. Select **Microsoft Monitoring Agent** and then click the **Proxy Settings** tab.
4. Click **Use a proxy server** and provide the URL and port number of the proxy server or gateway. If your proxy server or OMS Gateway requires authentication, type the username and password to authenticate and then click **OK**. 

#### Update settings using PowerShell 

Copy the following sample PowerShell code, update it with information specific to your environment, and save it with a PS1 file name extension.  Run the script on each computer that connects directly to the Log Analytics service.

```PowerShell
param($ProxyDomainName="https://proxy.contoso.com:30443", $cred=(Get-Credential))

# First we get the Health Service configuration object.  We need to determine if we
#have the right update rollup with the API we need.  If not, no need to run the rest of the script.
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

### Linux agent
Perform the following steps if your Linux computers need to communicate through a proxy server or OMS Gateway to Log Analytics.  The proxy configuration value has the following syntax `[protocol://][user:password@]proxyhost[:port]`.  The *proxyhost* property accepts a fully qualified domain name or IP address of the proxy server.

1. Edit the file `/etc/opt/microsoft/omsagent/proxy.conf` by running the following commands and change the values to your specific settings.

    ```
    proxyconf="https://proxyuser:proxypassword@proxyserver01:30443"
    sudo echo $proxyconf >>/etc/opt/microsoft/omsagent/proxy.conf
    sudo chown omsagent:omiusers /etc/opt/microsoft/omsagent/proxy.conf 
    ```

2. Restart the agent by running the following command: 

    ```
    sudo /opt/microsoft/omsagent/bin/service_control restart [<workspace id>]
    ``` 

## Uninstall agent
Use one of the following procedures to uninstall the Windows or Linux agent using the command-line or setup wizard.

### Windows agent

#### Uninstall from Control Panel
1. Sign on to the computer with an account that has administrative rights.  
2. In **Control Panel**, click **Programs and Features**.
3. In **Programs and Features**, click **Microsoft Monitoring Agent**, click **Uninstall**, and then click **Yes**.

>[!NOTE]
>The Agent Setup Wizard can also be run by double-clicking **MMASetup-<platform>.exe**, which is available for download from a workspace in the Azure portal.

#### Uninstall from the command line
The downloaded file for the agent is a self-contained installation package created with IExpress.  The setup program for the agent and supporting files are contained in the package and need to be extracted in order to properly uninstall using the command line shown in the following example. 

1. Sign on to the computer with an account that has administrative rights.  
2. To extract the agent installation files, from an elevated command prompt run `extract MMASetup-<platform>.exe` and it will prompt you for the path to extract files to.  Alternatively, you can specify the path by passing the arguments `extract MMASetup-<platform>.exe /c:<Path> /t:<Path>`.  For more information on the command-line swtiches supported by IExpress, see [Command-line switches for IExpress](https://support.microsoft.com/help/197147/command-line-switches-for-iexpress-software-update-packages) and then update the example to suit your needs.
3. At the prompt, type `%WinDir%\System32\msiexec.exe /x <Path>:\MOMAgent.msi /qb`.  

### Linux agent
To remove the agent, run the following command on the Linux computer.  The *--purge* argument completely removes the agent and its configuration.

   `wget https://raw.githubusercontent.com/Microsoft/OMS-Agent-for-Linux/master/installer/scripts/onboard_agent.sh && sh onboard_agent.sh --purge`

## Configure agent to report to an Operations Manager management group

### Windows agent
Perform the following steps to configure the OMS Agent for Windows to report to a System Center Operations Manager management group. 

1. Sign on to the computer with an account that has administrative rights.
2. Open **Control Panel**. 
3. Click **Microsoft Monitoring Agent** and then click the **Operations Manager** tab.
4. If your Operations Manager servers have integration with Active Directory, click **Automatically update management group assignments from AD DS**.
5. Click **Add** to open the **Add a Management Group** dialog box.
6. In **Management group name** field, type the name of your management group.
7. In the **Primary management server** field, type the computer name of the primary management server.
8. In the **Management server port** field, type the TCP port number.
9. Under **Agent Action Account**, choose either the Local System account or a local domain account.
10. Click **OK** to close the **Add a Management Group** dialog box and then click **OK** to close the **Microsoft Monitoring Agent Properties** dialog box.

### Linux agent
Perform the following steps to configure the OMS Agent for Linux to report to a System Center Operations Manager management group. 

1. Edit the file `/etc/opt/omi/conf/omiserver.conf`
2. Ensure that the line beginning with `httpsport=` defines the port 1270. Such as: `httpsport=1270`
3. Restart the OMI server: `sudo /opt/omi/bin/service_control restart`

## Next steps

Review [Troubleshooting the Linux agent](log-analytics-agent-linux-support.md) if you encounter issues while installing or managing the agent.  