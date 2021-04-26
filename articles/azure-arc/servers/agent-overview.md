---
title:  Overview of the Connected Machine agent
description: This article provides a detailed overview of the Azure Arc enabled servers agent available, which supports monitoring virtual machines hosted in hybrid environments.
ms.date: 03/25/2021
ms.topic: conceptual 
ms.custom: devx-track-azurepowershell
---

# Overview of Azure Arc enabled servers agent

The Azure Arc enabled servers Connected Machine agent enables you to manage your Windows and Linux machines hosted outside of Azure on your corporate network or other cloud provider. This article provides a detailed overview of the agent, system and network requirements, and the different deployment methods.

>[!NOTE]
>Starting with the general release of Azure Arc enabled servers in September 2020, all pre-release versions of the Azure Connected Machine agent (agents with versions less than 1.0) are being **deprecated** by **February 2, 2021**.  This time frame allows you to upgrade to version 1.0 or higher before the pre-released agents are no longer able to communicate with the Azure Arc enabled servers service.

## Agent component details

:::image type="content" source="media/agent-overview/connected-machine-agent.png" alt-text="Arc enabled servers agent overview." border="false":::

The Azure Connected Machine agent package contains several logical components, which are bundled together.

* The Hybrid Instance Metadata service (HIMDS) manages the connection to Azure and the connected machine's Azure identity.

* The Guest Configuration agent provides In-Guest Policy and Guest Configuration functionality, such as assessing whether the machine complies with required policies.

    Note the following behavior with Azure Policy [Guest Configuration](../../governance/policy/concepts/guest-configuration.md) for a disconnected machine:

    * A Guest Configuration policy assignment that targets disconnected machines is unaffected.
    * Guest assignment is stored locally for 14 days. Within the 14-day period, if the Connected Machine agent reconnects to the service, policy assignments are reapplied.
    * Assignments are deleted after 14 days, and are not reassigned to the machine after the 14-day period.

* The Extension agent manages VM extensions, including install, uninstall, and upgrade. Extensions are downloaded from Azure and copied to the `%SystemDrive%\%ProgramFiles%\AzureConnectedMachineAgent\ExtensionService\downloads` folder on Windows, and for Linux to `/opt/GC_Ext/downloads`. On Windows, the extension is installed to the following path `%SystemDrive%\Packages\Plugins\<extension>`, and on Linux the extension is installed to `/var/lib/waagent/<extension>`.

## Instance metadata

Metadata information about the connected machine is collected after the Connected Machine agent registers with Arc enabled servers. Specifically:

* Operating system name, type, and version
* Computer name
* Computer fully qualified domain name (FQDN)
* Connected Machine agent version
* Active Directory and DNS fully qualified domain name (FQDN)
* UUID (BIOS ID)
* Connected Machine agent heartbeat
* Connected Machine agent version
* Public key for managed identity
* Policy compliance status and details (if using Azure Policy Guest Configuration policies)

The following metadata information is requested by the agent from Azure:

* Resource location (region)
* Virtual machine ID
* Tags
* Azure Active Directory managed identity certificate
* Guest configuration policy assignments
* Extension requests - install, update, and delete.

## Download agents

You can download the Azure Connected Machine agent package for Windows and Linux from the locations listed below.

* [Windows agent Windows Installer package](https://aka.ms/AzureConnectedMachineAgent) from the Microsoft Download Center.

* Linux agent package is distributed from Microsoft's [package repository](https://packages.microsoft.com/) using the preferred package format for the distribution (.RPM or .DEB).

The Azure Connected Machine agent for Windows and Linux can be upgraded to the latest release manually or automatically depending on your requirements. For more information, see [here](manage-agent.md).

## Prerequisites

### Supported environments

Arc enabled servers support the installation of the Connected Machine agent on any physical server and virtual machine hosted *outside* of Azure. This includes virtual machines running on platforms like VMware, Azure Stack HCI, and other cloud environments. Arc enabled servers do not support installing the agent on virtual machines running in Azure, or virtual machines running on Azure Stack Hub or Azure Stack Edge as they are already modeled as Azure VMs.

### Supported operating systems

The following versions of the Windows and Linux operating system are officially supported for the Azure Connected Machine agent:

- Windows Server 2008 R2, Windows Server 2012 R2 and higher (including Server Core)
- Ubuntu 16.04 and 18.04 LTS (x64)
- CentOS Linux 7 (x64)
- SUSE Linux Enterprise Server (SLES) 15 (x64)
- Red Hat Enterprise Linux (RHEL) 7 (x64)
- Amazon Linux 2 (x64)
- Oracle Linux 7

> [!WARNING]
> The Linux hostname or Windows computer name cannot use one of the reserved words or trademarks in the name, otherwise attempting to register the connected machine with Azure will fail. See [Resolve reserved resource name errors](../../azure-resource-manager/templates/error-reserved-resource-name.md) for a list of the reserved words.

### Required permissions

* To onboard machines, you are a member of the **Azure Connected Machine Onboarding** or [Contributor](../../role-based-access-control/built-in-roles.md#contributor) role in the resource group.

* To read, modify, and delete a machine, you are a member of the **Azure Connected Machine Resource Administrator** role in the resource group.

* To select a resource group from the drop-down list when using the **Generate script** method, at a minimum you are a member of the [Reader](../../role-based-access-control/built-in-roles.md#reader) role for that resource group.

### Azure subscription and service limits

Before configuring your machines with Azure Arc enabled servers, review the Azure Resource Manager [subscription limits](../../azure-resource-manager/management/azure-subscription-service-limits.md#subscription-limits) and [resource group limits](../../azure-resource-manager/management/azure-subscription-service-limits.md#resource-group-limits) to plan for the number of machines to be connected.

Azure Arc enabled servers supports up to 5,000 machine instances in a resource group.

### Transport Layer Security 1.2 protocol

To ensure the security of data in transit to Azure, we strongly encourage you to configure machine to use Transport Layer Security (TLS) 1.2. Older versions of TLS/Secure Sockets Layer (SSL) have been found to be vulnerable and while they still currently work to allow backwards compatibility, they are **not recommended**.

|Platform/Language | Support | More Information |
| --- | --- | --- |
|Linux | Linux distributions tend to rely on [OpenSSL](https://www.openssl.org) for TLS 1.2 support. | Check the [OpenSSL Changelog](https://www.openssl.org/news/changelog.html) to confirm your version of OpenSSL is supported.|
| Windows Server 2012 R2 and higher | Supported, and enabled by default. | To confirm that you are still using the [default settings](/windows-server/security/tls/tls-registry-settings).|

### Networking configuration

The Connected Machine agent for Linux and Windows communicates outbound securely to Azure Arc over TCP port 443. If the machine connects through a firewall or proxy server to communicate over the Internet, review the following to understand the network configuration requirements.

> [!NOTE]
> Arc enabled servers does not support using a [Log Analytics gateway](../../azure-monitor/agents/gateway.md) as a proxy for the Connected Machine agent.
>

If outbound connectivity is restricted by your firewall or proxy server, make sure the URLs listed below are not blocked. When you only allow the IP ranges or domain names required for the agent to communicate with the service, you need to allow access to the following Service Tags and URLs.

Service Tags:

* AzureActiveDirectory
* AzureTrafficManager
* AzureResourceManager
* AzureArcInfrastructure

URLs:

| Agent resource | Description |
|---------|---------|
|`management.azure.com`|Azure Resource Manager|
|`login.windows.net`|Azure Active Directory|
|`login.microsoftonline.com`|Azure Active Directory|
|`dc.services.visualstudio.com`|Application Insights|
|`*.guestconfiguration.azure.com` |Guest Configuration|
|`*.his.arc.azure.com`|Hybrid Identity Service|
|`www.office.com`|Office 365|

Preview agents (version 0.11 and lower) also require access to the following URLs:

| Agent resource | Description |
|---------|---------|
|`agentserviceapi.azure-automation.net`|Guest Configuration|
|`*-agentservice-prod-1.azure-automation.net`|Guest Configuration|

For a list of IP addresses for each service tag/region, see the JSON file - [Azure IP Ranges and Service Tags – Public Cloud](https://www.microsoft.com/download/details.aspx?id=56519). Microsoft publishes weekly updates containing each Azure Service and the IP ranges it uses. This information in the JSON file is the current point-in-time list of the IP ranges that correspond to each service tag. The IP addresses are subject to change. If IP address ranges are required for your firewall configuration, then the **AzureCloud** Service Tag should be used to allow access to all Azure services. Do not disable security monitoring or inspection of these URLs, allow them as you would other Internet traffic.

For more information, review [Service tags overview](../../virtual-network/service-tags-overview.md).

### Register Azure resource providers

Azure Arc enabled servers depends on the following Azure resource providers in your subscription in order to use this service:

* **Microsoft.HybridCompute**
* **Microsoft.GuestConfiguration**

If they are not registered, you can register them using the following commands:

Azure PowerShell:

```azurepowershell-interactive
Login-AzAccount
Set-AzContext -SubscriptionId [subscription you want to onboard]
Register-AzResourceProvider -ProviderNamespace Microsoft.HybridCompute
Register-AzResourceProvider -ProviderNamespace Microsoft.GuestConfiguration
```

Azure CLI:

```azurecli-interactive
az account set --subscription "{Your Subscription Name}"
az provider register --namespace 'Microsoft.HybridCompute'
az provider register --namespace 'Microsoft.GuestConfiguration'
```

You can also register the resource providers in the Azure portal by following the steps under [Azure portal](../../azure-resource-manager/management/resource-providers-and-types.md#azure-portal).

## Installation and configuration

Connecting machines in your hybrid environment directly with Azure can be accomplished using different methods depending on your requirements. The following table highlights each method to determine which works best for your organization.

> [!IMPORTANT]
> The Connected Machine agent cannot be installed on an Azure Windows virtual machine. If you attempt to, the installation detects this and rolls back.

| Method | Description |
|--------|-------------|
| Interactively | Manually install the agent on a single or small number of machines following the steps in [Connect machines from Azure portal](onboard-portal.md).<br> From the Azure portal, you can generate a script and execute it on the machine to automate the install and configuration steps of the agent.|
| At scale | Install and configure the agent for multiple machines following the [Connect machines using a Service Principal](onboard-service-principal.md).<br> This method creates a service principal to connect machines non-interactively.|
| At scale | Install and configure the agent for multiple machines following the method [Using Windows PowerShell DSC](onboard-dsc.md).<br> This method uses a service principal to connect machines non-interactively with PowerShell DSC. |

## Connected Machine agent technical overview

### Windows agent installation details

The Connected Machine agent for Windows can be installed by using one of the following three methods:

* Double-click the file `AzureConnectedMachineAgent.msi`.
* Manually by running the Windows Installer package `AzureConnectedMachineAgent.msi` from the Command shell.
* From a PowerShell session using a scripted method.

After installing the Connected Machine agent for Windows, the following system-wide configuration changes are applied.

* The following installation folders are created during setup.

    |Folder |Description |
    |-------|------------|
    |%ProgramFiles%\AzureConnectedMachineAgent |Default installation path containing the agent support files.|
    |%ProgramData%\AzureConnectedMachineAgent |Contains the agent configuration files.|
    |%ProgramData%\AzureConnectedMachineAgent\Tokens |Contains the acquired tokens.|
    |%ProgramData%\AzureConnectedMachineAgent\Config |Contains the agent configuration file `agentconfig.json` recording its registration information with the service.|
    |%ProgramFiles%\ArcConnectedMachineAgent\ExtensionService\GC | Installation path containing the Guest Configuration agent files. |
    |%ProgramData%\GuestConfig |Contains the (applied) policies from Azure.|
    |%ProgramFiles%\AzureConnectedMachineAgent\ExtensionService\downloads | Extensions are downloaded from Azure and copied here.|

* The following Windows services are created on the target machine during installation of the agent.

    |Service name |Display name |Process name |Description |
    |-------------|-------------|-------------|------------|
    |himds |Azure Hybrid Instance Metadata Service |himds |This service implements the Azure Instance Metadata service (IMDS) to manage the connection to Azure and the connected machine's Azure identity.|
    |GCArcService |Guest Configuration Arc Service |gc_service |Monitors the desired state configuration of the machine.|
    |ExtensionService |Guest Configuration Extension Service | gc_service |Installs the required extensions targeting the machine.|

* The following environmental variables are created during agent installation.

    |Name |Default value |Description |
    |-----|--------------|------------|
    |IDENTITY_ENDPOINT |http://localhost:40342/metadata/identity/oauth2/token ||
    |IMDS_ENDPOINT |http://localhost:40342 ||

* There are several log files available for troubleshooting. They are described in the following table.

    |Log |Description |
    |----|------------|
    |%ProgramData%\AzureConnectedMachineAgent\Log\himds.log |Records details of the agents (HIMDS) service and interaction with Azure.|
    |%ProgramData%\AzureConnectedMachineAgent\Log\azcmagent.log |Contains the output of the azcmagent tool commands, when the verbose (-v) argument is used.|
    |%ProgramData%\GuestConfig\gc_agent_logs\gc_agent.log |Records details of the DSC service activity,<br> in particular the connectivity between the HIMDS service and Azure Policy.|
    |%ProgramData%\GuestConfig\gc_agent_logs\gc_agent_telemetry.txt |Records details about DSC service telemetry and verbose logging.|
    |%ProgramData%\GuestConfig\ext_mgr_logs|Records details about the Extension agent component.|
    |%ProgramData%\GuestConfig\extension_logs\<Extension>|Records details from the installed extension.|

* The local security group **Hybrid agent extension applications** is created.

* During uninstall of the agent, the following artifacts are not removed.

    * %ProgramData%\AzureConnectedMachineAgent\Log
    * %ProgramData%\AzureConnectedMachineAgent and subdirectories
    * %ProgramData%\GuestConfig

### Linux agent installation details

The Connected Machine agent for Linux is provided in the preferred package format for the distribution (.RPM or .DEB) that's hosted in the Microsoft [package repository](https://packages.microsoft.com/). The agent is installed and configured with the shell script bundle [Install_linux_azcmagent.sh](https://aka.ms/azcmagent).

After installing the Connected Machine agent for Linux, the following system-wide configuration changes are applied.

* The following installation folders are created during setup.

    |Folder |Description |
    |-------|------------|
    |/var/opt/azcmagent/ |Default installation path containing the agent support files.|
    |/opt/azcmagent/ |
    |/opt/GC_Ext | Installation path containing the Guest Configuration agent files.|
    |/opt/DSC/ |
    |/var/opt/azcmagent/tokens |Contains the acquired tokens.|
    |/var/lib/GuestConfig |Contains the (applied) policies from Azure.|
    |/opt/GC_Ext/downloads|Extensions are downloaded from Azure and copied here.|

* The following daemons are created on the target machine during installation of the agent.

    |Service name |Display name |Process name |Description |
    |-------------|-------------|-------------|------------|
    |himdsd.service |Azure Connected Machine Agent Service |himds |This service implements the Azure Instance Metadata service (IMDS) to manage the connection to Azure and the connected machine's Azure identity.|
    |gcad.servce |GC Arc Service |gc_linux_service |Monitors the desired state configuration of the machine. |
    |extd.service |Extension Service |gc_linux_service | Installs the required extensions targeting the machine.|

* There are several log files available for troubleshooting. They are described in the following table.

    |Log |Description |
    |----|------------|
    |/var/opt/azcmagent/log/himds.log |Records details of the agents (HIMDS) service and interaction with Azure.|
    |/var/opt/azcmagent/log/azcmagent.log |Contains the output of the azcmagent tool commands, when the verbose (-v) argument is used.|
    |/opt/logs/dsc.log |Records details of the DSC service activity,<br> in particular the connectivity between the himds service and Azure Policy.|
    |/opt/logs/dsc.telemetry.txt |Records details about DSC service telemetry and verbose logging.|
    |/var/lib/GuestConfig/ext_mgr_logs |Records details about the Extension agent component.|
    |/var/lib/GuestConfig/extension_logs|Records details from the installed extension.|

* The following environmental variables are created during agent installation. These variables are set in `/lib/systemd/system.conf.d/azcmagent.conf`.

    |Name |Default value |Description |
    |-----|--------------|------------|
    |IDENTITY_ENDPOINT |http://localhost:40342/metadata/identity/oauth2/token ||
    |IMDS_ENDPOINT |http://localhost:40342 ||

* During uninstall of the agent, the following artifacts are not removed.

    * /var/opt/azcmagent
    * /opt/logs

## Next steps

* To begin evaluating Azure Arc enabled servers, follow the article [Connect hybrid machines to Azure from the Azure portal](onboard-portal.md).

* Troubleshooting information can be found in the [Troubleshoot Connected Machine agent guide](troubleshoot-agent-onboard.md).
