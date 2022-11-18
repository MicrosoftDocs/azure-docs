---
title:  Overview of the Azure Connected Machine agent
description: This article provides a detailed overview of the Azure Arc-enabled servers agent available, which supports monitoring virtual machines hosted in hybrid environments.
ms.date: 10/08/2022
ms.topic: conceptual
ms.custom: devx-track-azurepowershell
---

# Overview of Azure Connected Machine agent

The Azure Connected Machine agent enables you to manage your Windows and Linux machines hosted outside of Azure on your corporate network or other cloud providers.

## Agent components

:::image type="content" source="media/agent-overview/connected-machine-agent.png" alt-text="Azure Arc-enabled servers agent architectural overview." border="false":::

The Azure Connected Machine agent package contains several logical components, which are bundled together:

* The Hybrid Instance Metadata service (HIMDS) manages the connection to Azure and the connected machine's Azure identity.

* The guest configuration agent provides functionality such as assessing whether the machine complies with required policies and enforcing compliance.

    Note the following behavior with Azure Policy [guest configuration](../../governance/machine-configuration/overview.md) for a disconnected machine:

  * An Azure Policy assignment that targets disconnected machines is unaffected.
  * Guest assignment is stored locally for 14 days. Within the 14-day period, if the Connected Machine agent reconnects to the service, policy assignments are reapplied.
  * Assignments are deleted after 14 days, and are not reassigned to the machine after the 14-day period.

* The Extension agent manages VM extensions, including install, uninstall, and upgrade. Extensions are downloaded from Azure and copied to the `%SystemDrive%\%ProgramFiles%\AzureConnectedMachineAgent\ExtensionService\downloads` folder on Windows, and to `/opt/GC_Ext/downloads` on Linux. On Windows, the extension is installed to the following path `%SystemDrive%\Packages\Plugins\<extension>`, and on Linux the extension is installed to `/var/lib/waagent/<extension>`.

>[!NOTE]
> The [Azure Monitor agent](../../azure-monitor/agents/azure-monitor-agent-overview.md) (AMA) is a separate agent that collects monitoring data, and it does not replace the Connected Machine agent; the AMA only replaces the Log Analytics agent, Diagnostics extension, and Telegraf agent for both Windows and Linux machines.

## Agent resources

The following information describes the directories and user accounts used by the Azure Connected Machine agent.

### Windows agent installation details

The Windows agent is distributed as a Windows Installer package (MSI) and can be downloaded from the [Microsoft Download Center](https://aka.ms/AzureConnectedMachineAgent).
After installing the Connected Machine agent for Windows, the following system-wide configuration changes are applied.

* The following installation folders are created during setup.

    | Directory | Description |
    |-----------|-------------|
    | %ProgramFiles%\AzureConnectedMachineAgent | azcmagent CLI and instance metadata service executables.|
    | %ProgramFiles%\AzureConnectedMachineAgent\ExtensionService\GC | Extension service executables.|
    | %ProgramFiles%\AzureConnectedMachineAgent\GuestConfig\GC | Guest configuration (policy) service executables.|
    | %ProgramData%\AzureConnectedMachineAgent | Configuration, log and identity token files for azcmagent CLI and instance metadata service.|
    | %ProgramData%\GuestConfig | Extension package downloads, guest configuration (policy) definition downloads, and logs for the extension and guest configuration services.|
    | %SYSTEMDRIVE%\packages | Extension package executables |

* The following Windows services are created on the target machine during installation of the agent.

    | Service name | Display name | Process name | Description |
    |--------------|--------------|--------------|-------------|
    | himds | Azure Hybrid Instance Metadata Service | himds | Synchronizes metadata with Azure and hosts a local REST API for extensions and applications to access the metadata and request Azure Active Directory managed identity tokens |
    | GCArcService | Guest configuration Arc Service | gc_service | Audits and enforces Azure guest configuration policies on the machine. |
    | ExtensionService | Guest configuration Extension Service | gc_service | Installs, updates, and manages extensions on the machine. |

* The following virtual service account is created during agent installation.

    | Virtual Account  | Description |
    |------------------|-------------|
    | NT SERVICE\\himds | Unprivileged account used to run the Hybrid Instance Metadata Service. |

    > [!TIP]
    > This account requires the "Log on as a service" right. This right is automatically granted during agent installation, but if your organization configures user rights assignments with Group Policy, you may need to adjust your Group Policy Object to grant the right to  "NT SERVICE\\himds" or "NT SERVICE\\ALL SERVICES" to allow the agent to function.

* The following local security group is created during agent installation.

    | Security group name | Description |
    |---------------------|-------------|
    | Hybrid agent extension applications | Members of this security group can request Azure Active Directory tokens for the system-assigned managed identity |

* The following environmental variables are created during agent installation.

    | Name | Default value | Description |
    |------|---------------|------------|
    | IDENTITY_ENDPOINT | `http://localhost:40342/metadata/identity/oauth2/token` |
    | IMDS_ENDPOINT | `http://localhost:40342` |

* There are several log files available for troubleshooting. They are described in the following table.

    | Log | Description |
    |-----|-------------|
    | %ProgramData%\AzureConnectedMachineAgent\Log\himds.log | Records details of the heartbeat and identity agent component. |
    | %ProgramData%\AzureConnectedMachineAgent\Log\azcmagent.log | Contains the output of the azcmagent tool commands. |
    | %ProgramData%\GuestConfig\arc_policy_logs\gc_agent.log | Records details about the guest configuration (policy) agent component. |
    | %ProgramData%\GuestConfig\ext_mgr_logs\gc_ext.log | Records details about extension manager activity (extension install, uninstall, and upgrade events). |
    | %ProgramData%\GuestConfig\extension_logs | Directory containing logs for individual extensions. |

* The local security group **Hybrid agent extension applications** is created.

* During uninstall of the agent, the following artifacts are not removed.

  * %ProgramData%\AzureConnectedMachineAgent\Log
  * %ProgramData%\AzureConnectedMachineAgent
  * %ProgramData%\GuestConfig
  * %SystemDrive%\packages

### Linux agent installation details

The Connected Machine agent for Linux is provided in the preferred package format for the distribution (.RPM or .DEB) that's hosted in the Microsoft [package repository](https://packages.microsoft.com/). The agent is installed and configured with the shell script bundle [Install_linux_azcmagent.sh](https://aka.ms/azcmagent).

Installing, upgrading, and removing the Connected Machine agent will not require you to restart your server.

After installing the Connected Machine agent for Linux, the following system-wide configuration changes are applied.

* The following installation folders are created during setup.

    | Directory | Description |
    |-----------|-------------|
    | /opt/azcmagent/ | azcmagent CLI and instance metadata service executables. |
    | /opt/GC_Ext/ | Extension service executables. |
    | /opt/GC_Service/ | Guest configuration (policy) service executables. |
    | /var/opt/azcmagent/ | Configuration, log and identity token files for azcmagent CLI and instance metadata service.|
    | /var/lib/GuestConfig/ | Extension package downloads, guest configuration (policy) definition downloads, and logs for the extension and guest configuration services.|

* The following daemons are created on the target machine during installation of the agent.

    | Service name | Display name | Process name | Description |
    |--------------|--------------|--------------|-------------|
    | himdsd.service | Azure Connected Machine Agent Service | himds | This service implements the Hybrid Instance Metadata service (IMDS) to manage the connection to Azure and the connected machine's Azure identity.|
    | gcad.service | GC Arc Service | gc_linux_service | Audits and enforces Azure guest configuration policies on the machine. |
    | extd.service | Extension Service | gc_linux_service | Installs, updates, and manages extensions on the machine. |

* There are several log files available for troubleshooting. They are described in the following table.

    | Log | Description |
    |-----|-------------|
    | /var/opt/azcmagent/log/himds.log | Records details of the heartbeat and identity agent component. |
    | /var/opt/azcmagent/log/azcmagent.log | Contains the output of the azcmagent tool commands. |
    | /var/lib/GuestConfig/arc_policy_logs | Records details about the guest configuration (policy) agent component. |
    | /var/lib/GuestConfig/ext_mgr_logs | Records details about extension manager activity (extension install, uninstall, and upgrade events). |
    | /var/lib/GuestConfig/extension_logs | Directory containing logs for individual extensions. |

* The following environment variables are created during agent installation. These variables are set in `/lib/systemd/system.conf.d/azcmagent.conf`.

    | Name | Default value | Description |
    |------|---------------|-------------|
    | IDENTITY_ENDPOINT | `http://localhost:40342/metadata/identity/oauth2/token` |
    | IMDS_ENDPOINT | `http://localhost:40342` |

* During uninstall of the agent, the following artifacts are not removed.

  * /var/opt/azcmagent
  * /var/lib/GuestConfig

## Agent resource governance

The Azure Connected Machine agent is designed to manage agent and system resource consumption. The agent approaches resource governance under the following conditions:

* The Guest Configuration agent is limited to use up to 5% of the CPU to evaluate policies.
* The Extension Service agent is limited to use up to 5% of the CPU to install, upgrade, run, and delete extensions. The following exceptions apply:

  * If the extension installs background services that run independent of Azure Arc, such as the Microsoft Monitoring Agent, those services will not be subject to the resource governance constraints listed above.
  * The Log Analytics agent and Azure Monitor Agent are allowed to use up to 60% of the CPU during their install/upgrade/uninstall operations on Red Hat Linux, CentOS, and other enterprise Linux variants. The limit is higher for this combination of extensions and operating systems to accommodate the performance impact of [SELinux](https://www.redhat.com/en/topics/linux/what-is-selinux) on these systems.
  * The Azure Monitor Agent can use up to 30% of the CPU during normal operations.

## Instance metadata

Metadata information about a connected machine is collected after the Connected Machine agent registers with Azure Arc-enabled servers. Specifically:

* Operating system name, type, and version
* Computer name
* Computer manufacturer and model
* Computer fully qualified domain name (FQDN)
* Domain name (if joined to an Active Directory domain)
* Active Directory and DNS fully qualified domain name (FQDN)
* UUID (BIOS ID)
* Connected Machine agent heartbeat
* Connected Machine agent version
* Public key for managed identity
* Policy compliance status and details (if using guest configuration policies)
* SQL Server installed (Boolean value)
* Cluster resource ID (for Azure Stack HCI nodes)
* Hardware manufacturer
* Hardware model
* CPU logical core count
* Cloud provider
* Amazon Web Services (AWS) metadata, when running in AWS:
  * Account ID
  * Instance ID
  * Region
* Google Cloud Platform (GCP) metadata, when running in GCP:
  * Instance ID
  * Image
  * Machine type
  * Project ID
  * Project number
  * Service accounts
  * Zone

The following metadata information is requested by the agent from Azure:

* Resource location (region)
* Virtual machine ID
* Tags
* Azure Active Directory managed identity certificate
* Guest configuration policy assignments
* Extension requests - install, update, and delete.

> [!NOTE]
> Azure Arc-enabled servers doesn't store/process customer data outside the region the customer deploys the service instance in.

## Deployment options and requirements

To deploy the agent and connect a machine, certain [prerequisites](prerequisites.md) must be met. There are also [networking requirements](network-requirements.md) to be aware of.

We provide several options for deploying the agent. For more information, see [Plan for deployment](plan-at-scale-deployment.md) and [Deployment options](deployment-options.md).

## Next steps

* To begin evaluating Azure Arc-enabled servers, see [Quickstart: Connect hybrid machines with Azure Arc-enabled servers](learn/quick-enable-hybrid-vm.md).
* Before you deploy the Azure Arc-enabled servers agent and integrate with other Azure management and monitoring services, review the [Planning and deployment guide](plan-at-scale-deployment.md).
* Review troubleshooting information in the [agent connection issues troubleshooting guide](troubleshoot-agent-onboard.md).
