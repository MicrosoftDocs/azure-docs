---
title: Manage the Azure Log Analytics agent 
description: This article describes the different management tasks that you'll typically perform during the lifecycle of the Log Analytics Windows or Linux agent deployed on a machine.
ms.topic: conceptual
author: guywi-ms
ms.author: guywild
ms.date: 07/06/2023
ms.reviewer: luki
---

# Manage and maintain the Log Analytics agent for Windows and Linux

After initial deployment of the Log Analytics Windows or Linux agent in Azure Monitor, you might need to reconfigure the agent, upgrade it, or remove it from the computer if it has reached the retirement stage in its lifecycle. You can easily manage these routine maintenance tasks manually or through automation, which reduces both operational error and expenses.

[!INCLUDE [Log Analytics agent deprecation](../../../includes/log-analytics-agent-deprecation.md)]

## Upgrade the agent

Upgrade to the latest release of the Log Analytics agent for Windows and Linux manually or automatically based on your deployment scenario and the environment the VM is running in.

| Environment | Installation method | Upgrade method |
|--------|----------|-------------|
| Azure VM | Log Analytics agent VM extension for Windows/Linux | The agent is automatically upgraded [after the VM model changes](../../virtual-machines/extensions/features-linux.md#how-agents-and-extensions-are-updated), unless you configured your Azure Resource Manager template to opt out by setting the property `autoUpgradeMinorVersion` to **false**. Once deployed, however, the extension won't upgrade minor versions unless redeployed, even with this property set to **true**. Only the Linux agent supports automatic update post deployment with `enableAutomaticUpgrade` property (see [Enable Auto-update for the Linux agent](#enable-auto-update-for-the-linux-agent)). Major version upgrade is always manual (see [VirtualMachineExtensionInner.AutoUpgradeMinorVersion Property](/dotnet/api/microsoft.azure.management.compute.fluent.models.virtualmachineextensioninner.autoupgrademinorversion)). |
| Custom Azure VM images | Manual installation of Log Analytics agent for Windows/Linux | Updating VMs to the newest version of the agent must be performed from the command line running the Windows installer package or Linux self-extracting and installable shell script bundle.|
| Non-Azure VMs | Manual installation of Log Analytics agent for Windows/Linux | Updating VMs to the newest version of the agent must be performed from the command line running the Windows installer package or Linux self-extracting and installable shell script bundle. |

### Upgrade the Windows agent

To update the agent on a Windows VM to the latest version not installed by using the Log Analytics VM extension, you either run from the command prompt, script, or other automation solution or use the **MMASetup-\<platform\>.msi Setup Wizard**.

To download the latest version of the Windows agent from your Log Analytics workspace:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the Azure portal, select **All services**. In the list of resources, enter **Log Analytics**. As you begin typing, the list filters based on your input. Select **Log Analytics workspaces**.

1. In your list of Log Analytics workspaces, select the workspace.

1. In your Log Analytics workspace, select the **Agents** tile and then select **Windows Servers**.

1. On the **Windows Servers** screen, select the appropriate **Download Windows Agent** version to download depending on the processor architecture of the Windows operating system.

>[!NOTE]
>During the upgrade of the Log Analytics agent for Windows, it doesn't support configuring or reconfiguring a workspace to report to. To configure the agent, follow one of the supported methods listed under [Add or remove a workspace](#add-or-remove-a-workspace).
>

#### Upgrade using the Setup Wizard

1. Sign on to the computer with an account that has administrative rights.

1. Execute **MMASetup-\<platform\>.exe** to start the **Setup Wizard**.

1. On the first page of the **Setup Wizard**, select **Next**.

1. In the **Microsoft Monitoring Agent Setup** dialog, select **I agree** to accept the license agreement.

1. In the **Microsoft Monitoring Agent Setup** dialog, select **Upgrade**. The status page displays the progress of the upgrade.

1. When the **Microsoft Monitoring Agent configuration completed successfully** page appears, select **Finish**.

#### Upgrade from the command line

1. Sign on to the computer with an account that has administrative rights.

1. To extract the agent installation files, run `MMASetup-<platform>.exe /c` from an elevated command prompt, and it will prompt you for the path to extract files to. Alternatively, you can specify the path by passing the arguments `MMASetup-<platform>.exe /c /t:<Full Path>`.

1. Run the following command, where D:\ is the location for the upgrade log file:

    ```dos
    setup.exe /qn /l*v D:\logs\AgentUpgrade.log AcceptEndUserLicenseAgreement=1
    ```

### Upgrade the Linux agent

Upgrade from prior versions (>1.0.0-47) is supported. Performing the installation with the `--upgrade` command will upgrade all components of the agent to the latest version.

Run the following command to upgrade the agent:

`sudo sh ./omsagent-*.universal.x64.sh --upgrade`

### Enable auto-update for the Linux agent

We recommend that you enable [Automatic Extension Upgrade](../../virtual-machines/automatic-extension-upgrade.md) by using these commands to update the agent automatically.

# [PowerShell](#tab/PowerShellLinux)

```powershell
Set-AzVMExtension \
  -ResourceGroupName myResourceGroup \
  -VMName myVM \
  -ExtensionName OmsAgentForLinux \
  -ExtensionType OmsAgentForLinux \
  -Publisher Microsoft.EnterpriseCloud.Monitoring \
  -TypeHandlerVersion latestVersion \
  -ProtectedSettingString '{"workspaceKey":"myWorkspaceKey"}' \
  -SettingString '{"workspaceId":"myWorkspaceId","skipDockerProviderInstall": true}' \
  -EnableAutomaticUpgrade $true
```

# [Azure CLI](#tab/CLILinux)

```powershell
az vm extension set \
  --resource-group myResourceGroup \
  --vm-name myVM \
  --name OmsAgentForLinux \
  --publisher Microsoft.EnterpriseCloud.Monitoring \
  --protected-settings '{"workspaceKey":"myWorkspaceKey"}' \
  --settings '{"workspaceId":"myWorkspaceId","skipDockerProviderInstall": true}' \
  --version latestVersion \
  --enable-auto-upgrade true
```
---

## Add or remove a workspace

Add or remove a workspace using the Windows agent or the Linux agent.

### Windows agent

The steps in this section are necessary not only when you want to reconfigure the Windows agent to report to a different workspace or remove a workspace from its configuration, but also when you want to configure the agent to report to more than one workspace. (This practice is commonly referred to as multihoming.) Configuring the Windows agent to report to multiple workspaces can only be performed after initial setup of the agent and by using the methods described in this section.

#### Update settings from Control Panel

1. Sign on to the computer with an account that has administrative rights.

1. Open Control Panel.

1. Select **Microsoft Monitoring Agent** and then select the **Azure Log Analytics** tab.

1. If you're removing a workspace, select it and then select **Remove**. Repeat this step for any other workspace you want the agent to stop reporting to.

1. If you're adding a workspace, select **Add**. In the **Add a Log Analytics Workspace** dialog, paste the workspace ID and workspace key (primary key). If the computer should report to a Log Analytics workspace in Azure Government cloud, select **Azure US Government** from the **Azure Cloud** dropdown list.

1. Select **OK** to save your changes.

#### Remove a workspace using PowerShell

```powershell
$workspaceId = "<Your workspace Id>"
$mma = New-Object -ComObject 'AgentConfigManager.MgmtSvcCfg'
$mma.RemoveCloudWorkspace($workspaceId)
$mma.ReloadConfiguration()
```

#### Add a workspace in Azure commercial using PowerShell

```powershell
$workspaceId = "<Your workspace Id>"
$workspaceKey = "<Your workspace Key>"
$mma = New-Object -ComObject 'AgentConfigManager.MgmtSvcCfg'
$mma.AddCloudWorkspace($workspaceId, $workspaceKey)
$mma.ReloadConfiguration()
```

#### Add a workspace in Azure for US Government using PowerShell

```powershell
$workspaceId = "<Your workspace Id>"
$workspaceKey = "<Your workspace Key>"
$mma = New-Object -ComObject 'AgentConfigManager.MgmtSvcCfg'
$mma.AddCloudWorkspace($workspaceId, $workspaceKey, 1)
$mma.ReloadConfiguration()
```

>[!NOTE]
>If you've used the command line or script previously to install or configure the agent, `EnableAzureOperationalInsights` was replaced by `AddCloudWorkspace` and `RemoveCloudWorkspace`.
>

### Linux agent

The following steps demonstrate how to reconfigure the Linux agent if you decide to register it with a different workspace or to remove a workspace from its configuration.

1. To verify the agent is registered to a workspace, run the following command:

    `/opt/microsoft/omsagent/bin/omsadmin.sh -l`

    It should return a status similar to the following example:

    `Primary Workspace: <workspaceId>   Status: Onboarded(OMSAgent Running)`

    It's important that the status also shows the agent is running. Otherwise, the following steps to reconfigure the agent won't finish successfully.

1. If the agent is already registered with a workspace, remove the registered workspace by running the following command. Otherwise, if it isn't registered, proceed to the next step.

    `/opt/microsoft/omsagent/bin/omsadmin.sh -X`

1. To register with a different workspace, run the following command:

    `/opt/microsoft/omsagent/bin/omsadmin.sh -w <workspace id> -s <shared key> [-d <top level domain>]`
    
1. To verify your changes took effect, run the following command:

    `/opt/microsoft/omsagent/bin/omsadmin.sh -l`

    It should return a status similar to the following example:

    `Primary Workspace: <workspaceId>   Status: Onboarded(OMSAgent Running)`

The agent service doesn't need to be restarted for the changes to take effect.

## Update proxy settings

Log Analytics Agent (MMA) doesn't use the system proxy settings. As a result, you have to pass proxy settings while you install MMA. These settings will be stored under MMA configuration (registry) on the VM. To configure the agent to communicate to the service through a proxy server or [Log Analytics gateway](./gateway.md) after deployment, use one of the following methods to complete this task.

### Windows agent

Use a Windows agent.

#### Update settings using Control Panel

1. Sign on to the computer with an account that has administrative rights.

1. Open Control Panel.

1. Select **Microsoft Monitoring Agent** and then select the **Proxy Settings** tab.

1. Select **Use a proxy server** and provide the URL and port number of the proxy server or gateway. If your proxy server or Log Analytics gateway requires authentication, enter the username and password to authenticate and then select **OK**.

#### Update settings using PowerShell

Copy the following sample PowerShell code, update it with information specific to your environment, and save it with a PS1 file name extension. Run the script on each computer that connects directly to the Log Analytics workspace in Azure Monitor.

```powershell
param($ProxyDomainName="https://proxy.contoso.com:30443", $cred=(Get-Credential))

# First we get the Health Service configuration object. We need to determine if we
#have the right update rollup with the API we need. If not, no need to run the rest of the script.
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

Perform the following steps if your Linux computers need to communicate through a proxy server or Log Analytics gateway. The proxy configuration value has the following syntax: `[protocol://][user:password@]proxyhost[:port]`. The `proxyhost` property accepts a fully qualified domain name or IP address of the proxy server.

1. Edit the file `/etc/opt/microsoft/omsagent/proxy.conf` by running the following commands and change the values to your specific settings:

    ```
    proxyconf="https://proxyuser:proxypassword@proxyserver01:30443"
    sudo echo $proxyconf >>/etc/opt/microsoft/omsagent/proxy.conf
    sudo chown omsagent:omiusers /etc/opt/microsoft/omsagent/proxy.conf
    ```

1. Restart the agent by running the following command:

    ```
    sudo /opt/microsoft/omsagent/bin/service_control restart [<workspace id>]
    ```

    If you see `cURL failed to perform on this base url` in the log, you can try removing `'\n'` in `proxy.conf` EOF to resolve the failure:

    ```
    od -c /etc/opt/microsoft/omsagent/proxy.conf
    cat /etc/opt/microsoft/omsagent/proxy.conf | tr -d '\n' > /etc/opt/microsoft/omsagent/proxy2.conf
    rm /etc/opt/microsoft/omsagent/proxy.conf
    mv /etc/opt/microsoft/omsagent/proxy2.conf /etc/opt/microsoft/omsagent/proxy.conf
    sudo chown omsagent:omiusers /etc/opt/microsoft/omsagent/proxy.conf
    sudo /opt/microsoft/omsagent/bin/service_control restart [<workspace id>]
    ```

## Uninstall agent

Use one of the following procedures to uninstall the Windows or Linux agent by using the command line or **Setup Wizard**.

### Windows agent

Use the Windows agent.

#### Uninstall from Control Panel

1. Sign on to the computer with an account that has administrative rights.

1. In Control Panel, select **Programs and Features**.

1. In **Programs and Features**, select **Microsoft Monitoring Agent** > **Uninstall** > **Yes**.

>[!NOTE]
>The **Agent Setup Wizard** can also be run by double-clicking `MMASetup-\<platform\>.exe`, which is available for download from a workspace in the Azure portal.

#### Uninstall from the command line

The downloaded file for the agent is a self-contained installation package created with IExpress. The setup program for the agent and supporting files are contained in the package and must be extracted to properly uninstall by using the command line shown in the following example.

1. Sign on to the computer with an account that has administrative rights.

1. To extract the agent installation files, from an elevated command prompt run `extract MMASetup-<platform>.exe` and it will prompt you for the path to extract files to. Alternatively, you can specify the path by passing the arguments `extract MMASetup-<platform>.exe /c:<Path> /t:<Path>`. For more information on the command-line switches supported by IExpress, see [Command-line switches for IExpress](https://www.betaarchive.com/wiki/index.php?title=Microsoft_KB_Archive/197147) and then update the example to suit your needs.

1. At the prompt, enter `%WinDir%\System32\msiexec.exe /x <Path>:\MOMAgent.msi /qb`.

### Linux agent

To remove the agent, run the following command on the Linux computer. The `--purge` argument completely removes the agent and its configuration.

   `wget https://raw.githubusercontent.com/Microsoft/OMS-Agent-for-Linux/master/installer/scripts/onboard_agent.sh && sh onboard_agent.sh --purge`

## Configure agent to report to an Operations Manager management group

Use the Windows agent.

### Windows agent

Perform the following steps to configure the Log Analytics agent for Windows to report to a System Center Operations Manager management group.

[!INCLUDE [log-analytics-agent-note](../../../includes/log-analytics-agent-note.md)]

1. Sign on to the computer with an account that has administrative rights.

1. Open Control Panel.

1. Select **Microsoft Monitoring Agent** and then select the **Operations Manager** tab.

1. If your Operations Manager servers have integration with Active Directory, select **Automatically update management group assignments from AD DS**.

1. Select **Add** to open the **Add a Management Group** dialog.

1. In the **Management group name** field, enter the name of your management group.

1. In the **Primary management server** field, enter the computer name of the primary management server.

1. In the **Management server port** field, enter the TCP port number.

1. Under **Agent Action Account**, choose either the local system account or a local domain account.

1. Select **OK** to close the **Add a Management Group** dialog. Then select **OK** to close the **Microsoft Monitoring Agent Properties** dialog.

### Linux agent

Perform the following steps to configure the Log Analytics agent for Linux to report to a System Center Operations Manager management group.

[!INCLUDE [log-analytics-agent-note](../../../includes/log-analytics-agent-note.md)]

1. Edit the file `/etc/opt/omi/conf/omiserver.conf`.

1. Ensure that the line beginning with `httpsport=` defines the port 1270, such as, `httpsport=1270`.

1. Restart the OMI server by using the following command:

    `sudo /opt/omi/bin/service_control restart`

## Frequently asked questions

This section provides answers to common questions.

### How do I stop the Log Analytics agent from communicating with Azure Monitor?

For agents connected to Log Analytics directly, open Control Panel and select **Microsoft Monitoring Agent**. Under the **Azure Log Analytics (OMS)** tab, remove all workspaces listed. In System Center Operations Manager, remove the computer from the Log Analytics managed computers list. Operations Manager updates the configuration of the agent to no longer report to Log Analytics.

## Next steps

- Review [Troubleshooting the Linux agent](agent-linux-troubleshoot.md) if you encounter issues while you install or manage the Linux agent.
- Review [Troubleshooting the Windows agent](agent-windows-troubleshoot.md) if you encounter issues while you install or manage the Windows agent.
