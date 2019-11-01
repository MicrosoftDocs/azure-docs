---
title: Quickstart - Connect machines to Azure using Azure Arc for servers - PowerShell
description: In this quickstart you learn how to connect machines to Azure using Azure Arc for servers using PowerShell
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-servers
author: bobbytreed
ms.author: robreed
keywords: azure automation, DSC, powershell, desired state configuration, update management, change tracking, inventory, runbooks, python, graphical, hybrid, onboard
ms.date: 11/04/2019
ms.custom: mvc
ms.topic: quickstart
---
# Quickstart: Connect machines to Azure using Azure Arc for servers - PowerShell

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

Review the supported clients and required network configuration in the [Azure Arc for servers Overview](overview.md).

## Create a Service Principal for Onboarding At Scale

A Service Principal is a special limited management identity that is granted only the minimum permission necessary to connect machines to Azure. This is safer than using a more powerful account like a Tenant Administrator. The Service Principal is only used during onboarding. You can safely delete the Service Principal after you connect your desired servers.

> [!NOTE]
> This step is recommended, but not required.

### Steps to create the Service Principal

In this example, we will use [Azure PowerShell](/powershell/azure/install-az-ps) to create a Service Principal Name (SPN). Alternatively, you can follow the steps listed under [Create a Service Principal using the Azure portal](../../active-directory/develop/howto-create-service-principal-portal.md) for this task.

The `Azure Connected Machine Onboarding` role contains only the permissions required for onboarding. You can define the permission of a SPN to allow its scope to cover a resource group or a subscription.

You must store the output of the [`New-AzADServicePrincipal`](/powershell/module/az.resources/new-azadserviceprincipal) cmdlet, or you will not be able to retrieve the password to use in a later step.

```azurepowershell-interactive
$sp = New-AzADServicePrincipal -DisplayName "Arc-for-servers" -Role "Azure Connected Machine Onboarding"
$sp
```

```output
Secret                : System.Security.SecureString
ServicePrincipalNames : {ad9bcd79-be9c-45ab-abd8-80ca1654a7d1, https://Arc-for-servers}
ApplicationId         : ad9bcd79-be9c-45ab-abd8-80ca1654a7d1
ObjectType            : ServicePrincipal
DisplayName           : Hybrid-RP
Id                    : 5be92c87-01c4-42f5-bade-c1c10af87758
Type                  :
```

Now, retrieve the password using powershell.

```azurepowershell-interactive
$credential = New-Object pscredential -ArgumentList "temp", $sp.Secret
$credential.GetNetworkCredential().password
```

From the output, copy the **password** and **ApplicationId** (from the previous step) and store them for later in a safe place, such as the secret store for your server configuration tool. If you forget or lose your SPN password, you can reset it using the [`New-AzADSpCredential`](/powershell/module/azurerm.resources/new-azurermadspcredential) cmdlet.

In the install agent onboarding script:

* The **ApplicationId** property is used for the `--service-principal-id` parameter used in the install agent
* The **password** property is used for the  `--service-principal-secret` parameter in the install agent.

## Manually install the agent and connect to Azure

The following guide allows you to connect a machine to Azure by logging into the machine and performing the steps. You can also connect machines to Azure [From the Portal](quickstart-onboard-portal.md).

### Download and install the agent

Installing the agent package requires root or Local Administrator access on the target server, but no Azure access.

#### Linux

For **Linux** servers, the agent is distributed via [Microsoft's package repository](https://packages.microsoft.com) using the preferred package format for the distribution (.RPM or .DEB).

> [!NOTE]
> During Public Preview, only one package has been released, which is suitable for Ubuntu 16.04 or 18.04.

<!-- What about this aks? -->
The simplest option is to register the package repository, and then install the package using the distribution's package manager.
The bash script located at [https://aka.ms/azcmagent](https://aka.ms/azcmagent) performs the following actions:

1. Configures the host machine to download from `packages.microsoft.com`.
2. Installs the Hybrid Resource Provider package.
3. Optionally, configures the agent for proxy operation, if you specify `--proxy`.

The script also contains checks for supported and non-supported distributions, as well as detecting required permissions for install.

The example below downloads the agent and installs it, without any of the conditional checks.

```bash
# Download the installation package
wget https://aka.ms/azcmagent -O ~/Install_linux_azcmagent.sh

# Install the connected machine agent. Omit the '--proxy "{proxy-url}"' parameters if proxy is not needed
bash ~/Install_linux_azcmagent.sh--proxy "{proxy-url}"
```

> [!NOTE]
> If you prefer not to reference Microsoft's package repository you can copy the package file from there to your internal repository.

#### Windows

For **Windows**, the agent is packaged in a Windows Installer (`.MSI`) file and can be downloaded from [https://aka.ms/AzureConnectedMachineAgent](https://aka.ms/AzureConnectedMachineAgent), which is hosted on [https://download.microsoft.com](https://download.microsoft.com).

```powershell
# Download the package
Invoke-WebRequest -Uri https://aka.ms/AzureConnectedMachineAgent -OutFile AzureConnectedMachineAgent.msi

# Install the package
msiexec /i AzureConnectedMachineAgent.msi /l*v installationlog.txt /qn | Out-String
```

> [!NOTE]
> On Linux, running the installation script again will automatically upgrade to the latest version. On Windows, you must uninstall the "Azure Connected Machine Agent" before running the installer again to upgrade.

### Connecting to Azure

Once installed, you can manage and configure the agent using a command-line tool called `azcmagent.exe`. The agent is located under `/opt/azcmagent/bin` on Linux and `$env:programfiles\AzureConnectedMachineAgent` on Windows.

On Windows, open PowerShell as administrator on a target node and run:

```powershell
& "$env:ProgramFiles\AzureConnectedMachineAgent\azcmagent.exe" connect `
  --service-principal-id "{your-spn-appid}" `
  --service-principal-secret "{your-spn-password}" `
  --resource-group "{your-resource-group-name}" `
  --tenant-id "{your-tenant-id}" `
  --location "{location-of-your-resource-group}" `
  --subscription-id "{your-subscription-id}"
```

On Linux, open a shell and run

<!-- Same command for linux?-->
```bash
azcmagent connect \
  --service-principal-id "{your-spn-appid}" \
  --service-principal-secret "{your-spn-password}" \
  --resource-group "{your-resource-group-name}" \
  --tenant-id "{your-tenant-id}" \
  --location "{location-of-your-resource-group}" \
  --subscription-id "{your-subscription-id}"
```

Parameters:

* `tenant-id` : The Tenant GUID. You can find it in Azure portal by selecting **Azure Active directory** -> **properties** -> **Directory ID**.
* `subscription-id` : The GUID of the subscription, in Azure, where you want to connect your machine.
* `resource-group` : The resource group where you want your machine connected.
* `location` : See [Azure regions and locations](https://azure.microsoft.com/global-infrastructure/regions/). This location can be the same, or different, as the resource group's location. For public preview, the service is supported in **WestUS2** and **West Europe**.
* `resource-name` :  (*Optional*) Used for the Azure resource representation of your on-premises machine. If you do not specify this value, the machine hostname will be used.

You can find more information on the 'azcmagent' tool in [Azcmagent Reference](azcmagent-reference.md).
<!-- Isn't this still needed to view machines? -->

Upon successful completion, your machine is connected to Azure. You can view your machine in the Azure portal by visiting [https://aka.ms/hybridmachineportal](https://aka.ms/hybridmachineportal).

![Successful Onboarding](./media/quickstart-onboard/arc-for-servers-successful-onboard.png)

### Proxy server configuration

#### Linux

<!-- New proxy name? -->

For **Linux**, if the server requires a proxy server, you can either:

* Run the `install_linux_hybrid_agent.sh` script from the [Install the Agent](#download-and-install-the-agent) section above, with `--proxy`.
* If you have already installed the agent, execute the command `/opt/azcmagent/bin/hybridrp_proxy add https://{proxy-url}:{proxy-port}`, which configures the proxy and restarts the agent.

#### Windows

For **Windows**, if the server requires proxy server for access to internet resources, you should run the command below to set the proxy server environment variable. This allows the agent to use proxy server for internet access.

```powershell
# If a proxy server is needed, execute these commands with actual proxy URL
[Environment]::SetEnvironmentVariable("https_proxy", "{https:\\proxy-url:proxyport}", "Machine")
$env:https_proxy = [System.Environment]::GetEnvironmentVariable("https_proxy","Machine")
# The agent service needs to be restarted after the proxy environment variable is set in order for the changes to take effect.
Restart-Service -Name himds
```

> [!NOTE]
> Authenticated proxies are not supported for Public Preview.

## Clean up

To disconnect a machine from Azure Arc for servers, you need to perform two steps.

1. Select the machine in [Portal](https://aka.ms/hybridmachineportal), click the ellipsis (`...`) and select **Delete**.
1. Uninstall the agent from the machine.

## Next steps

> [!div class="nextstepaction"]
> [Assign a Policy to Connected Machines](../../governance/policy/assign-policy-portal.md)
