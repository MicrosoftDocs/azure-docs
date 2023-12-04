---
title:  Managing the Azure Connected Machine agent
description: This article describes the different management tasks that you will typically perform during the lifecycle of the Azure Connected Machine agent.
ms.date: 05/04/2023
ms.topic: conceptual
ms.custom:
  - ignite-2023
---

# Managing and maintaining the Connected Machine agent

After initial deployment of the Azure Connected Machine agent, you may need to reconfigure the agent, upgrade it, or remove it from the computer. These routine maintenance tasks can be done manually or through automation (which reduces both operational error and expenses). This article describes the operational aspects of the agent. See the [azcmagent CLI documentation](azcmagent.md) for command line reference information.

## Installing a specific version of the agent

Microsoft recommends using the most recent version of the Azure Connected Machine agent for the best experience. However, if you need to run an older version of the agent for any reason, you can follow these instructions to install a specific version of the agent.

### [Windows](#tab/windows)

Links to the current and previous releases of the Windows agents are available below the heading of each [release note](agent-release-notes.md). If you're looking for an agent version that's more than 6 months old, check out the [release notes archive](agent-release-notes-archive.md).

### [Linux - apt](#tab/linux-apt)

1. If you haven't already, configure your package manager with the [Linux Software Repository for Microsoft Products](/windows-server/administration/linux-package-repository-for-microsoft-software).
1. Search for available agent versions with `apt-cache`:

   ```bash
   sudo apt-cache madison azcmagent
   ```

1. Find the version you want to install, replace `VERSION` in the following command with the full (4-part) version number, and run the command to install the agent:

   ```bash
   sudo apt install azcmagent=VERSION
   ```

   For example, to install version 1.28, the install command is:

   ```bash
   sudo apt install azcmagent=1.28.02260.736
   ```

### [Linux - yum](#tab/linux-yum)

1. If you haven't already, configure your package manager with the [Linux Software Repository for Microsoft Products](/windows-server/administration/linux-package-repository-for-microsoft-software).
1. Search for available agent versions with `yum list`:

   ```bash
   sudo yum list azcmagent --showduplicates
   ```

1. Find the version you want to install, replace `VERSION` in the following command with the full (4-part) version number, and run the command to install the agent:

   ```bash
   sudo yum install azcmagent-VERSION
   ```

   For example, to install version 1.28, the install command would look like:

   ```bash
   sudo yum install azcmagent-1.28.02260-755
   ```

### [Linux - zypper](#tab/linux-zypper)

1. If you haven't already, configure your package manager with the [Linux Software Repository for Microsoft Products](/windows-server/administration/linux-package-repository-for-microsoft-software).
1. Search for available agent versions with `zypper search`:

   ```bash
   sudo zypper search -s azcmagent
   ```

1. Find the version you want to install, replace `VERSION` in the following command with the full (4-part) version number, and run the command to install the agent:

   ```bash
   sudo zypper install -f azcmagent-VERSION
   ```

   For example, to install version 1.28, the install command would look like:

   ```bash
   sudo zypper install -f azcmagent-1.28.02260-755
   ```

---

## Upgrade the agent

The Azure Connected Machine agent is updated regularly to address bug fixes, stability enhancements, and new functionality. [Azure Advisor](../../advisor/advisor-overview.md) identifies resources that are not using the latest version of the machine agent and recommends that you upgrade to the latest version. It will notify you when you select the Azure Arc-enabled server by presenting a banner on the **Overview** page or when you access Advisor through the Azure portal.

The Azure Connected Machine agent for Windows and Linux can be upgraded to the latest release manually or automatically depending on your requirements. Installing, upgrading, or uninstalling the Azure Connected Machine Agent will not require you to restart your server.

The following table describes the methods supported to perform the agent upgrade:

| Operating system | Upgrade method |
|------------------|----------------|
| Windows | Manually<br> Microsoft Update |
| Ubuntu | [apt](https://help.ubuntu.com/lts/serverguide/apt.html) |
| SUSE Linux Enterprise Server | [zypper](https://en.opensuse.org/SDB:Zypper_usage_11.3) |

### Windows agent

The latest version of the Azure Connected Machine agent for Windows-based machines can be obtained from:

* Microsoft Update

* [Microsoft Update Catalog](https://www.catalog.update.microsoft.com/Home.aspx)

* [Microsoft Download Center](https://aka.ms/AzureConnectedMachineAgent)

#### Microsoft Update configuration

The recommended way of keeping the Windows agent up to date is to automatically obtain the latest version through Microsoft Update. This allows you to utilize your existing update infrastructure (such as Microsoft Configuration Manager or Windows Server Update Services) and include Azure Connected Machine agent updates with your regular OS update schedule.

Windows Server doesn't check for updates in Microsoft Update by default. To receive automatic updates for the Azure Connected Machine Agent, you must configure the Windows Update client on the machine to check for other Microsoft products.

For Windows Servers that belong to a workgroup and connect to the Internet to check for updates, you can enable Microsoft Update by running the following commands in PowerShell as an administrator:

```powershell
$ServiceManager = (New-Object -com "Microsoft.Update.ServiceManager")
$ServiceID = "7971f918-a847-4430-9279-4a52d1efe18d"
$ServiceManager.AddService2($ServiceId,7,"")
```

For Windows Servers that belong to a domain and connect to the Internet to check for updates, you can configure this setting at-scale using Group Policy:

1. Sign into a computer used for server administration with an account that can manage Group Policy Objects (GPO) for your organization.

1. Open the **Group Policy Management Console**.

1. Expand the forest, domain, and organizational unit(s) to select the appropriate scope for your new GPO. If you already have a GPO you wish to modify, skip to step 6.

1. Right-click the container and select **Create a GPO in this domain, and Link it here...**.

1. Provide a name for your policy such as "Enable Microsoft Update".

1. Right-click the policy and select **Edit**.

1. Navigate to **Computer Configuration > Administrative Templates > Windows Components > Windows Update**.

1. Select the **Configure Automatic Updates** setting to edit it.

1. Select the **Enabled** radio button to allow the policy to take effect.

1. At the bottom of the **Options** section, check the box for **Install updates for other Microsoft products** at the bottom.

1. Select **OK**.

The next time computers in your selected scope refresh their policy, they will start to check for updates in both Windows Update and Microsoft Update.

For organizations that use Microsoft Configuration Manager (MECM) or Windows Server Update Services (WSUS) to deliver updates to their servers, you need to configure WSUS to synchronize the Azure Connected Machine Agent packages and approve them for installation on your servers. Follow the guidance for [Windows Server Update Services](/windows-server/administration/windows-server-update-services/manage/setting-up-update-synchronizations#to-specify-update-products-and-classifications-for-synchronization) or [MECM](/mem/configmgr/sum/get-started/configure-classifications-and-products#to-configure-classifications-and-products-to-synchronize) to add the following products and classifications to your configuration:

* **Product Name**: Azure Connected Machine Agent (select all 3 sub-options)
* **Classifications**: Critical Updates, Updates

Once the updates are being synchronized, you can optionally add the Azure Connected Machine Agent product to your auto-approval rules so your servers automatically stay up to date with the latest agent software.

#### To manually upgrade using the Setup Wizard

1. Sign in to the computer with an account that has administrative rights.

1. Download the latest agent installer from https://aka.ms/AzureConnectedMachineAgent

1. Run **AzureConnectedMachineAgent.msi** to start the Setup Wizard.

If the Setup Wizard discovers a previous version of the agent, it will upgrade it automatically. When the upgrade completes, the Setup Wizard closes automatically.

#### To upgrade from the command line

If you're unfamiliar with the command-line options for Windows Installer packages, review [Msiexec standard command-line options](/windows/win32/msi/standard-installer-command-line-options) and [Msiexec command-line options](/windows/win32/msi/command-line-options).

1. Sign on to the computer with an account that has administrative rights.

1. Download the latest agent installer from https://aka.ms/AzureConnectedMachineAgent

1. To upgrade the agent silently and create a setup log file in the `C:\Support\Logs` folder, run the following command:

    ```dos
    msiexec.exe /i AzureConnectedMachineAgent.msi /qn /l*v "C:\Support\Logs\azcmagentupgradesetup.log"
    ```

### Linux agent

Updating the agent on a Linux machine involves two commands; one command to update the local package index with the list of latest available packages from the repositories, and another command to upgrade the local package.

You can download the latest agent package from Microsoft's [package repository](https://packages.microsoft.com/).

> [!NOTE]
> To upgrade the agent, you must have *root* access permissions or an account that has elevated rights using Sudo.

#### Upgrade the agent on Ubuntu

1. To update the local package index with the latest changes made in the repositories, run the following command:

    ```bash
    sudo apt update
    ```

2. To upgrade your system, run the following command:

    ```bash
    sudo apt upgrade azcmagent
    ```

Actions of the [apt](https://help.ubuntu.com/lts/serverguide/apt.html) command, such as installation and removal of packages, are logged in the `/var/log/dpkg.log` log file.

#### Upgrade the agent on Red Hat/CentOS/Oracle Linux/Amazon Linux

1. To update the local package index with the latest changes made in the repositories, run the following command:

    ```bash
    sudo yum check-update
    ```

2. To upgrade your system, run the following command:

    ```bash
    sudo yum update azcmagent
    ```

Actions of the [yum](https://access.redhat.com/articles/yum-cheat-sheet) command, such as installation and removal of packages, are logged in the `/var/log/yum.log` log file.

#### Upgrade the agent on SUSE Linux Enterprise

1. To update the local package index with the latest changes made in the repositories, run the following command:

    ```bash
    sudo zypper refresh
    ```

2. To upgrade your system, run the following command:

    ```bash
    sudo zypper update azcmagent
    ```

Actions of the [zypper](https://en.opensuse.org/Portal:Zypper) command, such as installation and removal of packages, are logged in the `/var/log/zypper.log` log file.

### Automatic agent upgrades

The Azure Connected Machine agent will support automatic and manual upgrades of the agent, initiated by Azure, in an upcoming release. To facilitate this capability, the agent enables a scheduled task on Windows or cron job on Linux that runs daily to see if the agent should be upgraded. The scheduler job will be installed when you install agent versions 1.30 or higher. While the scheduler job is currently enabled, the complete automatic upgrade experience is not yet available, so no changes will be made to your system even if a newer version of the Azure Connected Machine agent is available.

To view these scheduler jobs in Windows through PowerShell, run the following command:

```powershell
schtasks /query /TN azcmagent
```

To view these scheduler jobs in Windows through Task Scheduler:

:::image type="content" source="media/manage-agent/task-scheduler.png" alt-text="Screenshot of Task Scheduler":::

To view these scheduler jobs in Linux, run the following command:

```
cat /etc/cron.d/azcmagent_autoupgrade
```

To opt-out of any future automatic upgrades or the scheduler jobs, execute the following Azure CLI commands:

For Windows:

```powershell
az rest --method patch --url https://management.azure.com/subscriptions/<subscriptionId>/resourceGroups/<resourceGroup>/providers/Microsoft.HybridCompute/machines/<machineName>?api-version=2022-12-27-preview --resource https://management.azure.com/ --headers Content-Type=application/json --body '{\"properties\": {\"agentUpgrade\": {\"enableAutomaticUpgrade\": false}}}'
```

For Linux:

```bash
az rest --method patch --url https://management.azure.com/subscriptions/<subscriptionId>/resourceGroups/<resourceGroup>/providers/Microsoft.HybridCompute/machines/<machineName>?api-version=2022-12-27-preview --resource https://management.azure.com/ --headers Content-Type=application/json --body '{"properties": {"agentUpgrade": {"enableAutomaticUpgrade": false}}}'
```

## Renaming an Azure Arc-enabled server resource

When you change the name of a Linux or Windows machine connected to Azure Arc-enabled servers, the new name is not recognized automatically because the resource name in Azure is immutable. As with other Azure resources, you must delete the resource and re-create it in order to use the new name.

For Azure Arc-enabled servers, before you rename the machine, it's necessary to remove the VM extensions before proceeding:

1. Audit the VM extensions installed on the machine and note their configuration using the [Azure CLI](manage-vm-extensions-cli.md#list-extensions-installed) or [Azure PowerShell](manage-vm-extensions-powershell.md#list-extensions-installed).

2. Remove any VM extensions installed on the machine. You can do this using the [Azure portal](manage-vm-extensions-portal.md#remove-extensions), the [Azure CLI](manage-vm-extensions-cli.md#remove-extensions), or [Azure PowerShell](manage-vm-extensions-powershell.md#remove-extensions).

3. Use the **azcmagent** tool with the [Disconnect](azcmagent-disconnect.md) parameter to disconnect the machine from Azure Arc and delete the machine resource from Azure. You can run this manually while logged on interactively, with a Microsoft identity [access token](../../active-directory/develop/access-tokens.md), or with the service principal you used for onboarding (or with a [new service principal that you create](onboard-service-principal.md#create-a-service-principal-for-onboarding-at-scale).

    Disconnecting the machine from Azure Arc-enabled servers doesn't remove the Connected Machine agent, and you do not need to remove the agent as part of this process.

4. Re-register the Connected Machine agent with Azure Arc-enabled servers. Run the `azcmagent` tool with the [Connect](azcmagent-connect.md) parameter to complete this step. The agent will default to using the computer's current hostname, but you can choose your own resource name by passing the `--resource-name` parameter to the connect command.

5. Redeploy the VM extensions that were originally deployed to the machine from Azure Arc-enabled servers. If you deployed the Azure Monitor for VMs (insights) agent or the Log Analytics agent using an Azure Policy definition, the agents are redeployed after the next [evaluation cycle](../../governance/policy/how-to/get-compliance-data.md#evaluation-triggers).

## Uninstall the agent

For servers you no longer want to manage with Azure Arc-enabled servers, follow the steps below to remove any VM extensions from the server, disconnect the agent, and uninstall the software from your server. It's important to complete all of these steps to fully remove all related software components from your system.

### Step 1: Remove VM extensions

If you have deployed Azure VM extensions to an Azure Arc-enabled server, you must uninstall the extensions before disconnecting the agent or uninstalling the software. Uninstalling the Azure Connected Machine agent doesn't automatically remove extensions, and these extensions won't be recognized if you reconnect the server to Azure Arc.

For guidance on how to identify and remove any extensions on your Azure Arc-enabled server, see the following resources:

* [Manage VM extensions with the Azure portal](manage-vm-extensions-portal.md#remove-extensions)
* [Manage VM extensions with Azure PowerShell](manage-vm-extensions-powershell.md#remove-extensions)
* [Manage VM extensions with Azure CLI](manage-vm-extensions-cli.md#remove-extensions)

### Step 2: Disconnect the server from Azure Arc

Disconnecting the agent deletes the corresponding Azure resource for the server and clears the local state of the agent. To disconnect the agent, run the `azcmagent disconnect` command as an administrator on the server. You'll be prompted to log in with an Azure account that has permission to delete the resource in your subscription. If the resource has already been deleted in Azure, you'll need to pass an additional flag to clean up the local state: `azcmagent disconnect --force-local-only`.

### Step 3a: Uninstall the Windows agent

Both of the following methods remove the agent, but they do not remove the *C:\Program Files\AzureConnectedMachineAgent* folder on the machine.

#### Uninstall from Control Panel

Follow these steps to uninstall the Windows agent from the machine:

1. Sign in to the computer with an account that has administrator permissions.

1. In **Control panel**, select **Programs and Features**.

1. In **Programs and Features**, select **Azure Connected Machine Agent**, select **Uninstall**, and then select **Yes**.

You can also delete the Windows agent directly from the agent setup wizard. Run the **AzureConnectedMachineAgent.msi** installer package to do so.

#### Uninstall from the command line

You can uninstall the agent manually from the Command Prompt or by using an automated method (such as a script) by following the example below. First you need to retrieve the product code, which is a GUID that is the principal identifier of the application package, from the operating system. The uninstall is performed by using the Msiexec.exe command line - `msiexec /x {Product Code}`.

1. Open the Registry Editor.

2. Under registry key `HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Uninstall`, look for and copy the product code GUID.

3. Uninstall the agent using Msiexec, as in the following examples:

   * From the command-line type:

       ```dos
       msiexec.exe /x {product code GUID} /qn
       ```

   * You can perform the same steps using PowerShell:

       ```powershell
       Get-ChildItem -Path HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall | `
       Get-ItemProperty | `
       Where-Object {$_.DisplayName -eq "Azure Connected Machine Agent"} | `
       ForEach-Object {MsiExec.exe /x "$($_.PsChildName)" /qn}
       ```

### Step 3b: Uninstall the Linux agent

> [!NOTE]
> To uninstall the agent, you must have *root* access permissions or an account that has elevated rights using sudo.

The command used to uninstall the Linux agent depends on the Linux operating system.

* For Ubuntu, run the following command:

    ```bash
    sudo apt purge azcmagent
    ```

* For RHEL, CentOS, Oracle Linux, and Amazon Linux, run the following command:

    ```bash
    sudo yum remove azcmagent
    ```

* For SLES, run the following command:

    ```bash
    sudo zypper remove azcmagent
    ```

## Update or remove proxy settings

To configure the agent to communicate to the service through a proxy server or to remove this configuration after deployment, use one of the methods described below. Note that the agent communicates outbound using the HTTP protocol under this scenario.

As of agent version 1.13, proxy settings can be configured using the `azcmagent config` command or system environment variables. If a proxy server is specified in both the agent configuration and system environment variables, the agent configuration will take precedence and become the effective setting. Use `azcmagent show` to view the effective proxy configuration for the agent.

> [!NOTE]
> Azure Arc-enabled servers doesn't support using proxy servers that require authentication, TLS (HTTPS) connections, or a [Log Analytics gateway](../../azure-monitor/agents/gateway.md) as a proxy for the Connected Machine agent.

### Agent-specific proxy configuration

Agent-specific proxy configuration is available starting with version 1.13 of the Azure Connected Machine agent and is the preferred way of configuring proxy server settings. This approach prevents the proxy settings for the Azure Connected Machine agent from interfering with other applications on your system.

> [!NOTE]
> Extensions deployed by Azure Arc will not inherit the agent-specific proxy configuration.
> Refer to the documentation for the extensions you deploy for guidance on how to configure proxy settings for each extension.

To configure the agent to communicate through a proxy server, run the following command:

```bash
azcmagent config set proxy.url "http://ProxyServerFQDN:port"
```

You can use an IP address or simple hostname in place of the FQDN if your network requires it. If your proxy server runs on port 80, you may omit ":80" at the end.

To check if a proxy server URL is configured in the agent settings, run the following command:

```bash
azcmagent config get proxy.url
```

To stop the agent from communicating through a proxy server, run the following command:

```bash
azcmagent config clear proxy.url
```

You do not need to restart any services when reconfiguring the proxy settings with the `azcmagent config` command.

### Proxy bypass for private endpoints

Starting with agent version 1.15, you can also specify services which should **not** use the specified proxy server. This can help with split-network designs and private endpoint scenarios where you want Microsoft Entra ID and Azure Resource Manager traffic to go through your proxy server to public endpoints but want Azure Arc traffic to skip the proxy and communicate with a private IP address on your network.

The proxy bypass feature does not require you to enter specific URLs to bypass. Instead, you provide the name of the service(s) that should not use the proxy server. The location parameter refers to the Azure region of the Arc Server(s).

Proxy bypass value when set to `ArcData` only bypasses the traffic of the Azure extension for SQL Server and not the Arc agent.

| Proxy bypass value | Affected endpoints |
| --------------------- | ------------------ |
| `AAD` | `login.windows.net`</br>`login.microsoftonline.com`</br> `pas.windows.net` |
| `ARM` | `management.azure.com` |
| `Arc` | `his.arc.azure.com`</br>`guestconfiguration.azure.com`</br> `san-af-<location>-prod.azurewebsites.net`</br>`telemetry.<location>.arcdataservices.com`|
| `ArcData` <sup>1</sup> | `san-af-<region>-prod.azurewebsites.net`</br>`telemetry.<location>.arcdataservices.com` |

<sup>1</sup> The proxy bypass value `ArcData` is available starting with Azure Connected Machine agent version 1.36 and Azure Extension for SQL Server version 1.1.2504.99. Earlier versions include the Azure Arc-enabled SQL Server endpoints in the "Arc" proxy bypass value.

To send Microsoft Entra ID and Azure Resource Manager traffic through a proxy server but skip the proxy for Azure Arc traffic, run the following command:

```bash
azcmagent config set proxy.url "http://ProxyServerFQDN:port"
azcmagent config set proxy.bypass "Arc"
```

To provide a list of services, separate the service names by commas:

```bash
azcmagent config set proxy.bypass "ARM,Arc"
```

To clear the proxy bypass, run the following command:

```bash
azcmagent config clear proxy.bypass
```

You can view the effective proxy server and proxy bypass configuration by running `azcmagent show`.

### Windows environment variables

On Windows, the Azure Connected Machine agent will first check the `proxy.url` agent configuration property (starting with agent version 1.13), then the system-wide `HTTPS_PROXY` environment variable to determine which proxy server to use. If both are empty, no proxy server is used, even if the default Windows system-wide proxy setting is configured.

Microsoft recommends using the agent-specific proxy configuration instead of the system environment variable.

To set the proxy server environment variable, run the following commands:

```powershell
# If a proxy server is needed, execute these commands with the proxy URL and port.
[Environment]::SetEnvironmentVariable("HTTPS_PROXY", "http://ProxyServerFQDN:port", "Machine")
$env:HTTPS_PROXY = [System.Environment]::GetEnvironmentVariable("HTTPS_PROXY", "Machine")
# For the changes to take effect, the agent services need to be restarted after the proxy environment variable is set.
Restart-Service -Name himds, ExtensionService, GCArcService
```

To configure the agent to stop communicating through a proxy server, run the following commands:

```powershell
[Environment]::SetEnvironmentVariable("HTTPS_PROXY", $null, "Machine")
$env:HTTPS_PROXY = [System.Environment]::GetEnvironmentVariable("HTTPS_PROXY", "Machine")
# For the changes to take effect, the agent services need to be restarted after the proxy environment variable removed.
Restart-Service -Name himds, ExtensionService, GCArcService
```

### Linux environment variables

On Linux, the Azure Connected Machine agent first checks the `proxy.url` agent configuration property (starting with agent version 1.13), and then the `HTTPS_PROXY` environment variable set for the himds, GC_Ext, and GCArcService daemons. There's an included script that will configure systemd's default proxy settings for the Azure Connected Machine agent and all other services on the machine to use a specified proxy server.

To configure the agent to communicate through a proxy server, run the following command:

```bash
sudo /opt/azcmagent/bin/azcmagent_proxy add "http://ProxyServerFQDN:port"
```

To remove the environment variable, run the following command:

```bash
sudo /opt/azcmagent/bin/azcmagent_proxy remove
```

### Migrating from environment variables to agent-specific proxy configuration

If you're already using environment variables to configure the proxy server for the Azure Connected Machine agent and want to migrate to the agent-specific proxy configuration based on local agent settings, follow these steps:

1. [Upgrade the Azure Connected Machine agent](#upgrade-the-agent) to the latest version (starting with version 1.13) to use the new proxy configuration settings.

1. Configure the agent with your proxy server information by running `azcmagent config set proxy.url "http://ProxyServerFQDN:port"`.

1. Remove the unused environment variables by following the steps for [Windows](#windows-environment-variables) or [Linux](#linux-environment-variables).

## Next steps

* Troubleshooting information can be found in the [Troubleshoot Connected Machine agent guide](troubleshoot-agent-onboard.md).

* Review the [Planning and deployment guide](plan-at-scale-deployment.md) to plan for deploying Azure Arc-enabled servers at any scale and implement centralized management and monitoring.

* Learn how to manage your machine using [Azure Policy](../../governance/policy/overview.md), for such things as VM [guest configuration](../../governance/machine-configuration/overview.md), verifying the machine is reporting to the expected Log Analytics workspace, enable monitoring with [VM insights](../../azure-monitor/vm/vminsights-enable-policy.md), and much more.
