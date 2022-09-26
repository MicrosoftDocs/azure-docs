---
title:  Azure Connected Machine agent deployment options
description: Learn about the different options to onboard machines to Azure Arc-enabled servers.
ms.date: 03/14/2022
ms.topic: how-to 
---

# Azure Connected Machine agent deployment options

Connecting machines in your hybrid environment directly with Azure can be accomplished using different methods, depending on your requirements and the tools you prefer to use.

## Onboarding methods

 The following table highlights each method so that you can determine which works best for your deployment. For detailed information, follow the links to view the steps for each topic.

| Method | Description |
|--------|-------------|
| Interactively | Manually install the agent on a single or small number of machines by [connecting machines using a deployment script](onboard-portal.md).<br> From the Azure portal, you can generate a script and execute it on the machine to automate the install and configuration steps of the agent.|
| Interactively | [Connect machines from Windows Admin Center](onboard-windows-admin-center.md) |
| Interactively or at scale | [Connect machines using PowerShell](onboard-powershell.md) |
| Interactively or at scale | [Connect machines using Windows PowerShell Desired State Configuration (DSC)](onboard-dsc.md) |
| At scale | [Connect machines using a service principal](onboard-service-principal.md) to install the agent at scale non-interactively.|
| At scale | [Connect machines by running PowerShell scripts with Configuration Manager](onboard-configuration-manager-powershell.md)
| At scale | [Connect machines with a Configuration Manager custom task sequence](onboard-configuration-manager-custom-task.md)
| At scale | [Connect Windows machines using Group Policy](onboard-group-policy.md)
| At scale | [Connect machines from Automation Update Management](onboard-update-management-machines.md) to create a service principal that installs and configures the agent for multiple machines managed with Azure Automation Update Management to connect machines non-interactively. |

> [!IMPORTANT]
> The Connected Machine agent cannot be installed on an Azure Windows virtual machine. If you attempt to, the installation detects this and rolls back.

Be sure to review the basic [prerequisites](prerequisites.md) and [network configuration requirements](network-requirements.md) before deploying the agent, as well as any specific requirements listed in the steps for the onboarding method you choose.

## Agent installation details

Review the following details to understand more about how the Connected Machine agent is installed on Windows or Linux machines.

### Windows agent installation details

You can download the [Windows agent Windows Installer package](https://aka.ms/AzureConnectedMachineAgent) from the Microsoft Download Center.

The Connected Machine agent for Windows can be installed by using one of the following three methods:

* Running the file `AzureConnectedMachineAgent.msi`.
* Manually by running the Windows Installer package `AzureConnectedMachineAgent.msi` from the Command shell.
* From a PowerShell session using a scripted method.

Installing, upgrading, and removing the Connected Machine agent will not require you to restart your server.

After installing the Connected Machine agent for Windows, the following system-wide configuration changes are applied.

* The following installation folders are created during setup.

    |Folder |Description |
    |-------|------------|
    |%ProgramFiles%\AzureConnectedMachineAgent |azcmagent CLI and instance metadata service executables.|
    |%ProgramFiles%\AzureConnectedMachineAgent\ExtensionService\GC | Extension service executables.|
    |%ProgramFiles%\AzureConnectedMachineAgent\GuestConfig\GC | Guest configuration (policy) service executables.|
    |%ProgramData%\AzureConnectedMachineAgent |Configuration, log and identity token files for azcmagent CLI and instance metadata service.|
    |%ProgramData%\GuestConfig |Extension package downloads, guest configuration (policy) definition downloads, and logs for the extension and guest configuration services.|

* The following Windows services are created on the target machine during installation of the agent.

    |Service name |Display name |Process name |Description |
    |-------------|-------------|-------------|------------|
    |himds |Azure Hybrid Instance Metadata Service |himds |This service implements the Hybrid Instance Metadata service (IMDS) to manage the connection to Azure and the connected machine's Azure identity.|
    |GCArcService |Guest configuration Arc Service |gc_service |Monitors the desired state configuration of the machine.|
    |ExtensionService |Guest configuration Extension Service | gc_service |Installs the required extensions targeting the machine.|

* The following virtual service account is created during agent installation.

    | Virtual Account  | Description |
    |------------------|---------|
    | NT SERVICE\\himds | Unprivileged account used to run the Hybrid Instance Metadata Service. |

    > [!TIP]
    > This account requires the "Log on as a service" right. This right is automatically granted during agent installation, but if your organization configures user rights assignments with Group Policy, you may need to adjust your Group Policy Object to grant the right to  "NT SERVICE\\himds" or "NT SERVICE\\ALL SERVICES" to allow the agent to function.
* The following local security group is created during agent installation.

    | Security group name | Description |
    |---------------------|-------------|
    | Hybrid agent extension applications | Members of this security group can request Azure Active Directory tokens for the system-assigned managed identity |

* The following environmental variables are created during agent installation.

    |Name |Default value |Description |
    |-----|--------------|------------|
    |IDENTITY_ENDPOINT |<`http://localhost:40342/metadata/identity/oauth2/token`> ||
    |IMDS_ENDPOINT |<`http://localhost:40342`> ||

* There are several log files available for troubleshooting. They are described in the following table.

    |Log |Description |
    |----|------------|
    |%ProgramData%\AzureConnectedMachineAgent\Log\himds.log |Records details of the heartbeat and identity agent component.|
    |%ProgramData%\AzureConnectedMachineAgent\Log\azcmagent.log |Contains the output of the azcmagent tool commands.|
    |%ProgramData%\GuestConfig\arc_policy_logs\ |Records details about the guest configuration (policy) agent component.|
    |%ProgramData%\GuestConfig\ext_mgr_logs|Records details about the Extension agent component.|
    |%ProgramData%\GuestConfig\extension_logs\\\<Extension>|Records details from the installed extension.|

* The local security group **Hybrid agent extension applications** is created.

* During uninstall of the agent, the following artifacts are not removed.

  * %ProgramData%\AzureConnectedMachineAgent\Log
  * %ProgramData%\AzureConnectedMachineAgent and subdirectories
  * %ProgramData%\GuestConfig

### Linux agent installation details

The Connected Machine agent for Linux is provided in the preferred package format for the distribution (.RPM or .DEB) that's hosted in the Microsoft [package repository](https://packages.microsoft.com/). The agent is installed and configured with the shell script bundle [Install_linux_azcmagent.sh](https://aka.ms/azcmagent).

Installing, upgrading, and removing the Connected Machine agent will not require you to restart your server.

After installing the Connected Machine agent for Linux, the following system-wide configuration changes are applied.

* The following installation folders are created during setup.

    |Folder |Description |
    |-------|------------|
    |/opt/azcmagent/ |azcmagent CLI and instance metadata service executables.|
    |/opt/GC_Ext/ | Extension service executables.|
    |/opt/GC_Service/ |Guest configuration (policy) service executables.|
    |/var/opt/azcmagent/ |Configuration, log and identity token files for azcmagent CLI and instance metadata service.|
    |/var/lib/GuestConfig/ |Extension package downloads, guest configuration (policy) definition downloads, and logs for the extension and guest configuration services.|

* The following daemons are created on the target machine during installation of the agent.

    |Service name |Display name |Process name |Description |
    |-------------|-------------|-------------|------------|
    |himdsd.service |Azure Connected Machine Agent Service |himds |This service implements the Hybrid Instance Metadata service (IMDS) to manage the connection to Azure and the connected machine's Azure identity.|
    |gcad.service |GC Arc Service |gc_linux_service |Monitors the desired state configuration of the machine. |
    |extd.service |Extension Service |gc_linux_service | Installs the required extensions targeting the machine.|

* There are several log files available for troubleshooting. They are described in the following table.

    |Log |Description |
    |----|------------|
    |/var/opt/azcmagent/log/himds.log |Records details of the heartbeat and identity agent component.|
    |/var/opt/azcmagent/log/azcmagent.log |Contains the output of the azcmagent tool commands.|
    |/var/lib/GuestConfig/arc_policy_logs |Records details about the guest configuration (policy) agent component.|
    |/var/lib/GuestConfig/ext_mgr_logs |Records details about the extension agent component.|
    |/var/lib/GuestConfig/extension_logs|Records details from extension install/update/uninstall operations.|

* The following environmental variables are created during agent installation. These variables are set in `/lib/systemd/system.conf.d/azcmagent.conf`.

    |Name |Default value |Description |
    |-----|--------------|------------|
    |IDENTITY_ENDPOINT |<`http://localhost:40342/metadata/identity/oauth2/token`> ||
    |IMDS_ENDPOINT |<`http://localhost:40342`> ||

* During uninstall of the agent, the following artifacts are not removed.

  * /var/opt/azcmagent
  * /var/lib/GuestConfig

## Agent resource governance

The Azure Connected Machine agent is designed to manage agent and system resource consumption. The agent approaches resource governance under the following conditions:

* The Guest Configuration agent is limited to use up to 5% of the CPU to evaluate policies.
* The Extension Service agent is limited to use up to 5% of the CPU to install and manage extensions.

  * Once installed, each extension is limited to use up to 5% of the CPU while running. For example, if you have two extensions installed, they can use a combined total of 10% of the CPU.
  * The Log Analytics agent and Azure Monitor Agent are allowed to use up to 60% of the CPU during their install/upgrade/uninstall operations on Red Hat Linux, CentOS, and other enterprise Linux variants. The limit is higher for this combination of extensions and operating systems to accommodate the performance impact of [SELinux](https://www.redhat.com/en/topics/linux/what-is-selinux) on these systems.

## Next steps

* Learn about the Azure Connected Machine agent [prerequisites](prerequisites.md) and [network requirements](network-requirements.md).
* Review the [Planning and deployment guide for Azure Arc-enabled servers](plan-at-scale-deployment.md)
* Learn about [reconfiguring, upgrading, and removing the Connected Machine agent](manage-agent.md).
