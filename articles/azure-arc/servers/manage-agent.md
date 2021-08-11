---
title:  Managing the Azure Arc-enabled servers agent
description: This article describes the different management tasks that you will typically perform during the lifecycle of the Azure Arc-enabled servers Connected Machine agent.
ms.date: 07/16/2021
ms.topic: conceptual
---

# Managing and maintaining the Connected Machine agent

After initial deployment of the Azure Arc-enabled servers Connected Machine agent for Windows or Linux, you may need to reconfigure the agent, upgrade it, or remove it from the computer. You can easily manage these routine maintenance tasks manually or through automation, which reduces both operational error and expenses.

## Before uninstalling agent

Before removing the Connected Machine agent from your Azure Arc-enabled server, consider the following to avoid unexpected issues or costs added to your Azure bill:

* If you have deployed Azure VM extensions to an enabled server, and you remove the Connected Machine agent or you delete the resource representing the Azure Arc-enabled server in the resource group, those extensions continue to run and perform their normal operation.

* If you delete the resource representing the Azure Arc-enabled server in your resource group, but you don't uninstall the VM extensions, when you re-register the machine, you won't be able to manage the installed VM extensions.

For servers or machines you no longer want to manage with Azure Arc-enabled servers, it is necessary to follow these steps to successfully stop managing it:

1. Remove the VM extensions from the machine or server. Steps are provided below.

2. Disconnect the machine from Azure Arc using one of the following methods:

    * Running `azcmagent disconnect` command on the machine or server.

    * From the selected registered Azure Arc-enabled server in the Azure portal by selecting **Delete** from the top bar.

    * Using the [Azure CLI](../../azure-resource-manager/management/delete-resource-group.md?tabs=azure-cli#delete-resource) or [Azure PowerShell](../../azure-resource-manager/management/delete-resource-group.md?tabs=azure-powershell#delete-resource). For the`ResourceType` parameter use `Microsoft.HybridCompute/machines`.

3. [Uninstall the agent](#remove-the-agent) from the machine or server following the steps below.

## Renaming a machine

When you change the name of the Linux or Windows machine connected to Azure Arc-enabled servers, the new name is not recognized automatically because the resource name in Azure is immutable. As with other Azure resources, you have to delete the resource and re-create it in order to use the new name.

For Azure Arc-enabled servers, before you rename the machine, it is necessary to remove the VM extensions before proceeding.

> [!NOTE]
> While installed extensions continue to run and perform their normal operation after this procedure is complete, you won't be able to manage them. If you attempt to redeploy the extensions on the machine, you may experience unpredictable behavior.

> [!WARNING]
> We recommend you avoid renaming the machine's computer name and only perform this procedure if absolutely necessary.

1. Audit the VM extensions installed on the machine and note their configuration, using the [Azure CLI](manage-vm-extensions-cli.md#list-extensions-installed) or using [Azure PowerShell](manage-vm-extensions-powershell.md#list-extensions-installed).

2. Remove VM extensions installed from the [Azure portal](manage-vm-extensions-portal.md#uninstall-extensions), using the [Azure CLI](manage-vm-extensions-cli.md#remove-an-installed-extension), or using [Azure PowerShell](manage-vm-extensions-powershell.md#remove-an-installed-extension).

3. Use the **azcmagent** tool with the [Disconnect](manage-agent.md#disconnect) parameter to disconnect the machine from Azure Arc and delete the machine resource from Azure. Disconnecting the machine from Azure Arc-enabled servers does not remove the Connected Machine agent, and you do not need to remove the agent as part of this process. You can run azcmagent manually while logged on interactively, or automate using the same service principal you used to onboard multiple agents, or with a Microsoft identity platform [access token](../../active-directory/develop/access-tokens.md). If you did not use a service principal to register the machine with Azure Arc-enabled servers, see the following [article](onboard-service-principal.md#create-a-service-principal-for-onboarding-at-scale) to create a service principal.

4. Rename the machines computer name.

5. Re-register the Connected Machine agent with Azure Arc-enabled servers. Run the `azcmagent` tool with the [Connect](manage-agent.md#connect) parameter complete this step.

6. Redeploy the VM extensions that were originally deployed to the machine from Azure Arc-enabled servers. If you deployed the Azure Monitor for VMs (insights) agent or the Log Analytics agent using an Azure policy, the agents are redeployed after the next [evaluation cycle](../../governance/policy/how-to/get-compliance-data.md#evaluation-triggers).

## Upgrading agent

The Azure Connected Machine agent is updated regularly to address bug fixes, stability enhancements, and new functionality. [Azure Advisor](../../advisor/advisor-overview.md) identifies resources that are not using the latest version of machine agent and recommends that you upgrade to the latest version. It will notify you when you select the Azure Arc-enabled server by presenting a banner on the **Overview** page or when you access Advisor through the Azure portal.

The Azure Connected Machine agent for Windows and Linux can be upgraded to the latest release manually or automatically depending on your requirements.

The following table describes the methods supported to perform the agent upgrade.

| Operating system | Upgrade method |
|------------------|----------------|
| Windows | Manually<br> Windows Update |
| Ubuntu | [Apt](https://help.ubuntu.com/lts/serverguide/apt.html) |
| SUSE Linux Enterprise Server | [zypper](https://en.opensuse.org/SDB:Zypper_usage_11.3) |
| RedHat Enterprise, Amazon, CentOS Linux | [yum](https://wiki.centos.org/PackageManagement/Yum) |

### Windows agent

Update package for the Connected Machine agent for Windows is available from:

* Microsoft Update

* [Microsoft Update Catalog](https://www.catalog.update.microsoft.com/Home.aspx)

* [Windows agent Windows Installer package](https://aka.ms/AzureConnectedMachineAgent) from the Microsoft Download Center.

The agent can be upgraded following various methods to support your software update management process. Outside of obtaining from Microsoft Update, you can download and run manually from the Command Prompt, from a script or other automation solution, or from the UI wizard by executing `AzureConnectedMachine.msi`.

> [!NOTE]
> * To upgrade the agent, you must have *Administrator* permissions.
> * To upgrade manually, you must first download and copy the Installer package to a folder on the target server, or from a shared network folder. 

If you are unfamiliar with the command-line options for Windows Installer packages, review [Msiexec standard command-line options](/windows/win32/msi/standard-installer-command-line-options) and [Msiexec command-line options](/windows/win32/msi/command-line-options).

#### To upgrade using the Setup Wizard

1. Sign on to the computer with an account that has administrative rights.

2. Execute **AzureConnectedMachineAgent.msi** to start the Setup Wizard.

The Setup Wizard discovers if a previous version exists, and then it automatically performs an upgrade of the agent. When the upgrade completes, the Setup Wizard automatically closes.

#### To upgrade from the command line

1. Sign on to the computer with an account that has administrative rights.

2. To upgrade the agent silently and create a setup log file in the `C:\Support\Logs` folder, run the following command.

    ```dos
    msiexec.exe /i AzureConnectedMachineAgent.msi /qn /l*v "C:\Support\Logs\Azcmagentupgradesetup.log"
    ```

### Linux agent

To update the agent on a Linux machine to the latest version, it involves two commands. One command to update the local package index with the list of latest available packages from the repositories, and one command to upgrade the local package.

You can download the latest agent package from Microsoft's [package repository](https://packages.microsoft.com/).

> [!NOTE]
> To upgrade the agent, you must have *root* access permissions or with an account that has elevated rights using Sudo.

#### Upgrade Ubuntu

1. To update the local package index with the latest changes made in the repositories, run the following command:

    ```bash
    apt update
    ```

2. To upgrade your system, run the following command:

    ```bash
    apt upgrade
    ```

Actions of the [apt](https://help.ubuntu.com/lts/serverguide/apt.html) command, such as installation and removal of packages, are logged in the `/var/log/dpkg.log` log file.

#### Upgrade Red Hat/CentOS/Amazon Linux

1. To update the local package index with the latest changes made in the repositories, run the following command:

    ```bash
    yum check-update
    ```

2. To upgrade your system, run the following command:

    ```bash
    yum update
    ```

Actions of the [yum](https://access.redhat.com/articles/yum-cheat-sheet) command, such as installation and removal of packages, are logged in the `/var/log/yum.log` log file. 

#### Upgrade SUSE Linux Enterprise

1. To update the local package index with the latest changes made in the repositories, run the following command:

    ```bash
    zypper refresh
    ```

2. To upgrade your system, run the following command:

    ```bash
    zypper update
    ```

Actions of the [zypper](https://en.opensuse.org/Portal:Zypper) command, such as installation and removal of packages, are logged in the `/var/log/zypper.log` log file.

## About the Azcmagent tool

The Azcmagent tool (Azcmagent.exe) is used to configure the Azure Arc-enabled servers Connected Machine agent during installation, or modify the initial configuration of the agent after installation. Azcmagent.exe provides command-line parameters to customize the agent and view its status:

* **Connect** - To connect the machine to Azure Arc

* **Disconnect** - To disconnect the machine from Azure Arc

* **Show** - View agent status and its configuration properties (Resource Group name, Subscription ID, version, etc.), which can help when troubleshooting an issue with the agent. Include the `-j` parameter to output the results in JSON format.

* **Logs** - Creates a .zip file in the current directory containing logs to assist you while troubleshooting.

* **Version** - Shows the Connected Machine agent version.

* **-useStderr** - Directs error and verbose output to stderr. Include the `-json` parameter to output the results in JSON format.

* **-h or --help** - Shows available command-line parameters

    For example, to see detailed help for the **Connect** parameter, type `azcmagent connect -h`. 

* **-v or --verbose** - Enable verbose logging

You can perform a **Connect** and **Disconnect** manually while logged on interactively, or automate using the same service principal you used to onboard multiple agents or with a Microsoft identity platform [access token](../../active-directory/develop/access-tokens.md). If you did not use a service principal to register the machine with Azure Arc-enabled servers, see the following [article](onboard-service-principal.md#create-a-service-principal-for-onboarding-at-scale) to create a service principal.

>[!NOTE]
>You must have *root* access permissions on Linux machines to run **azcmagent**.

### Connect

This parameter specifies a resource in Azure Resource Manager representing the machine is created in Azure. The resource is in the subscription and resource group specified, and data about the machine is stored in the Azure region specified by the `--location` setting. The default resource name is the hostname of the machine if not specified.

A certificate corresponding to the system-assigned identity of the machine is then downloaded and stored locally. Once this step is completed, the Azure Connected Machine Metadata Service and Guest Configuration Agent begin synchronizing with Azure Arc-enabled servers.

To connect using a service principal, run the following command:

`azcmagent connect --service-principal-id <serviceprincipalAppID> --service-principal-secret <serviceprincipalPassword> --tenant-id <tenantID> --subscription-id <subscriptionID> --resource-group <ResourceGroupName> --location <resourceLocation>`

To connect using an access token, run the following command:

`azcmagent connect --access-token <> --subscription-id <subscriptionID> --resource-group <ResourceGroupName> --location <resourceLocation>`

To connect with your elevated logged-on credentials (interactive), run the following command:

`azcmagent connect --tenant-id <TenantID> --subscription-id <subscriptionID> --resource-group <ResourceGroupName> --location <resourceLocation>`

### Disconnect

This parameter specifies a resource in Azure Resource Manager representing the machine is deleted in Azure. It does not remove the agent from the machine, you uninstall the agent separately. After the machine is disconnected, if you want to re-register it with Azure Arc-enabled servers, use `azcmagent connect` so a new resource is created for it in Azure.

> [!NOTE]
> If you have deployed one or more of the Azure VM extensions to your Azure Arc-enabled server and you delete its registration in Azure, the extensions are still installed. It is important to understand that depending on the extension installed, it is actively performing its function. Machines that are intended to be retired or no longer managed by Azure Arc-enabled servers should first have the extensions removed before removing its registration from Azure.

To disconnect using a service principal, run the following command:

`azcmagent disconnect --service-principal-id <serviceprincipalAppID> --service-principal-secret <serviceprincipalPassword> --tenant-id <tenantID>`

To disconnect using an access token, run the following command:

`azcmagent disconnect --access-token <accessToken>`

To disconnect with your elevated logged-on credentials (interactive), run the following command:

`azcmagent disconnect`

## Remove the agent

Perform one of the following methods to uninstall the Windows or Linux Connected Machine agent from the machine. Removing the agent does not unregister the machine with Azure Arc-enabled servers or remove the Azure VM extensions installed. For servers or machines you no longer want to manage with Azure Arc-enabled servers, it is necessary to follow these steps to successfully stop managing it: 

1. Remove VM extensions installed from the [Azure portal](manage-vm-extensions-portal.md#uninstall-extensions), using the [Azure CLI](manage-vm-extensions-cli.md#remove-an-installed-extension), or using [Azure PowerShell](manage-vm-extensions-powershell.md#remove-an-installed-extension) that you don't want to remain on the machine.
1. Unregister the machine by running `azcmagent disconnect` to delete the Azure Arc-enabled servers resource in Azure. If that fails, you can delete the resource manually in Azure. Otherwise, if the resource was deleted in Azure, you'll need to run `azcmagent disconnect --force-local-only` on the server to remove the local configuration.

### Windows agent

Both of the following methods remove the agent, but they do not remove the *C:\Program Files\AzureConnectedMachineAgent* folder on the machine.

#### Uninstall from Control Panel

1. To uninstall the Windows agent from the machine, do the following:

    a. Sign in to the computer with an account that has administrator permissions.  
    b. In **Control Panel**, select **Programs and Features**.  
    c. In **Programs and Features**, select **Azure Connected Machine Agent**, select **Uninstall**, and then select **Yes**.  

    >[!NOTE]
    > You can also run the agent setup wizard by double-clicking the **AzureConnectedMachineAgent.msi** installer package.

#### Uninstall from the command line

To uninstall the agent manually from the Command Prompt or to use an automated method, such as a script, you can use the following example. First you need to retrieve the product code, which is a GUID that is the principal identifier of the application package, from the operating system. The uninstall is performed by using the Msiexec.exe command line - `msiexec /x {Product Code}`.

1. Open the Registry Editor.

2. Under registry key `HKEY_LOCAL_MACHINE\Software\Microsoft\Windows\CurrentVersion\Uninstall`, look for and copy the product code GUID.

3. You can then uninstall the agent by using Msiexec using the following examples:

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

### Linux agent

> [!NOTE]
> To uninstall the agent, you must have *root* access permissions or with an account that has elevated rights using Sudo.

To uninstall the Linux agent, the command to use depends on the Linux operating system.

- For Ubuntu, run the following command:

    ```bash
    sudo apt purge azcmagent
    ```

- For RHEL, CentOS, and Amazon Linux, run the following command:

    ```bash
    sudo yum remove azcmagent
    ```

- For SLES, run the following command:

    ```bash
    sudo zypper remove azcmagent
    ```

## Unregister machine

If you are planning to stop managing the machine with supporting services in Azure, perform the following steps to unregister the machine with Azure Arc-enabled servers. You can perform these steps either before or after you have removed the Connected Machine agent from the machine.

1. Open Azure Arc-enabled servers by going to the [Azure portal](https://aka.ms/hybridmachineportal).

2. Select the machine in the list, select the ellipsis (**...**), and then select **Delete**.

## Update or remove proxy settings

To configure the agent to communicate to the service through a proxy server or remove this configuration after deployment, or use one of the following methods to complete this task.

> [!NOTE]
> Azure Arc-enabled servers does not support using a [Log Analytics gateway](../../azure-monitor/agents/gateway.md) as a proxy for the Connected Machine agent.
>

### Windows

To set the proxy server environment variable, run the following command:

```powershell
# If a proxy server is needed, execute these commands with the proxy URL and port.
[Environment]::SetEnvironmentVariable("https_proxy","http://{proxy-url}:{proxy-port}","Machine")
$env:https_proxy = [System.Environment]::GetEnvironmentVariable("https_proxy","Machine")
# For the changes to take effect, the agent service needs to be restarted after the proxy environment variable is set.
Restart-Service -Name himds
```

To configure the agent to stop communicating through a proxy server, run the following command to remove the proxy server environmental variable and restart the agent service:

```powershell
[Environment]::SetEnvironmentVariable("https_proxy",$null,"Machine")
$env:https_proxy = [System.Environment]::GetEnvironmentVariable("https_proxy","Machine")
# For the changes to take effect, the agent service needs to be restarted after the proxy environment variable removed.
Restart-Service -Name himds
```

### Linux

To set the proxy server, run the following command from the directory you downloaded the agent installation package to:

```bash
# Reconfigure the connected machine agent and set the proxy server.
bash ~/Install_linux_azcmagent.sh --proxy "{proxy-url}:{proxy-port}"
```

To configure the agent to stop communicating through a proxy server, run the following command to remove the proxy configuration:

```bash
sudo azcmagent_proxy remove
```

## Next steps

* Troubleshooting information can be found in the [Troubleshoot Connected Machine agent guide](troubleshoot-agent-onboard.md).

* Review the [Planning and deployment guide](plan-at-scale-deployment.md) to plan for deploying Azure Arc-enabled servers at any scale and implement centralized management and monitoring.

* Learn how to manage your machine using [Azure Policy](../../governance/policy/overview.md), for such things as VM [guest configuration](../../governance/policy/concepts/guest-configuration.md), verifying the machine is reporting to the expected Log Analytics workspace, enable monitoring with [VM insights](../../azure-monitor/vm/vminsights-enable-policy.md), and much more.
