---
title:  Overview of the Azure Connected Machine agent
description: This article provides a detailed overview of the Azure Connected Machine agent, which supports monitoring virtual machines hosted in hybrid environments.
ms.date: 09/11/2023
ms.topic: conceptual
---

# Overview of Azure Connected Machine agent

The Azure Connected Machine agent enables you to manage your Windows and Linux machines hosted outside of Azure on your corporate network or other cloud providers.

## Agent components

:::image type="content" source="media/agent-overview/connected-machine-agent.png" alt-text="Azure Connected Machine agent architectural overview." border="false":::

The Azure Connected Machine agent package contains several logical components bundled together:

* The Hybrid Instance Metadata service (HIMDS) manages the connection to Azure and the connected machine's Azure identity.

* The guest configuration agent provides functionality such as assessing whether the machine complies with required policies and enforcing compliance.

    Note the following behavior with Azure Policy [guest configuration](../../governance/machine-configuration/overview.md) for a disconnected machine:

  * An Azure Policy assignment that targets disconnected machines is unaffected.
  * Guest assignment is stored locally for 14 days. Within the 14-day period, if the Connected Machine agent reconnects to the service, policy assignments are reapplied.
  * Assignments are deleted after 14 days, and aren't reassigned to the machine after the 14-day period.

* The Extension agent manages VM extensions, including install, uninstall, and upgrade. Azure downloads extensions and copies them to the `%SystemDrive%\%ProgramFiles%\AzureConnectedMachineAgent\ExtensionService\downloads` folder on Windows, and to `/opt/GC_Ext/downloads` on Linux. On Windows, the extension installs to the following path `%SystemDrive%\Packages\Plugins\<extension>`, and on Linux the extension installs to `/var/lib/waagent/<extension>`.

>[!NOTE]
> The [Azure Monitor agent](../../azure-monitor/agents/azure-monitor-agent-overview.md) (AMA) is a separate agent that collects monitoring data, and it does not replace the Connected Machine agent; the AMA only replaces the Log Analytics agent, Diagnostics extension, and Telegraf agent for both Windows and Linux machines.

## Agent resources

The following information describes the directories and user accounts used by the Azure Connected Machine agent.

### Windows agent installation details

The Windows agent is distributed as a Windows Installer package (MSI). Download the Windows agent from the [Microsoft Download Center](https://aka.ms/AzureConnectedMachineAgent).
Installing the Connected Machine agent for Window applies the following system-wide configuration changes:

* The installation process creates the following folders during setup.

    | Directory | Description |
    |-----------|-------------|
    | %ProgramFiles%\AzureConnectedMachineAgent | azcmagent CLI and instance metadata service executables.|
    | %ProgramFiles%\AzureConnectedMachineAgent\ExtensionService\GC | Extension service executables.|
    | %ProgramFiles%\AzureConnectedMachineAgent\GCArcService\GC | Guest configuration (policy) service executables.|
    | %ProgramData%\AzureConnectedMachineAgent | Configuration, log and identity token files for azcmagent CLI and instance metadata service.|
    | %ProgramData%\GuestConfig | Extension package downloads, guest configuration (policy) definition downloads, and logs for the extension and guest configuration services.|
    | %SYSTEMDRIVE%\packages | Extension package executables |

* Installing the agent creates the following Windows services on the target machine.

    | Service name | Display name | Process name | Description |
    |--------------|--------------|--------------|-------------|
    | himds | Azure Hybrid Instance Metadata Service | `himds.exe` | Synchronizes metadata with Azure and hosts a local REST API for extensions and applications to access the metadata and request Microsoft Entra managed identity tokens |
    | GCArcService | Guest configuration Arc Service | `gc_arc_service.exe` (gc_service.exe prior to version 1.36) | Audits and enforces Azure guest configuration policies on the machine. |
    | ExtensionService | Guest configuration Extension Service | `gc_extension_service.exe` (gc_service.exe prior to version 1.36) | Installs, updates, and manages extensions on the machine. |

* Agent installation creates the following virtual service account.

    | Virtual Account  | Description |
    |------------------|-------------|
    | NT SERVICE\\himds | Unprivileged account used to run the Hybrid Instance Metadata Service. |

    > [!TIP]
    > This account requires the "Log on as a service" right. This right is automatically granted during agent installation, but if your organization configures user rights assignments with Group Policy, you might need to adjust your Group Policy Object to grant the right to  "NT SERVICE\\himds" or "NT SERVICE\\ALL SERVICES" to allow the agent to function.

* Agent installation creates the following local security group.

    | Security group name | Description |
    |---------------------|-------------|
    | Hybrid agent extension applications | Members of this security group can request Microsoft Entra tokens for the system-assigned managed identity |

* Agent installation creates the following environmental variables

    | Name | Default value | Description |
    |------|---------------|------------|
    | IDENTITY_ENDPOINT | `http://localhost:40342/metadata/identity/oauth2/token` |
    | IMDS_ENDPOINT | `http://localhost:40342` |

* There are several log files available for troubleshooting, described in the following table.

    | Log | Description |
    |-----|-------------|
    | %ProgramData%\AzureConnectedMachineAgent\Log\himds.log | Records details of the heartbeat and identity agent component. |
    | %ProgramData%\AzureConnectedMachineAgent\Log\azcmagent.log | Contains the output of the azcmagent tool commands. |
    | %ProgramData%\GuestConfig\arc_policy_logs\gc_agent.log | Records details about the guest configuration (policy) agent component. |
    | %ProgramData%\GuestConfig\ext_mgr_logs\gc_ext.log | Records details about extension manager activity (extension install, uninstall, and upgrade events). |
    | %ProgramData%\GuestConfig\extension_logs | Directory containing logs for individual extensions. |

* The process creates the local security group **Hybrid agent extension applications**.

* After uninstalling the agent, the following artifacts remain.

  * %ProgramData%\AzureConnectedMachineAgent\Log
  * %ProgramData%\AzureConnectedMachineAgent
  * %ProgramData%\GuestConfig
  * %SystemDrive%\packages

### Linux agent installation details

The preferred package format for the distribution (`.rpm` or `.deb`) that's hosted in the Microsoft [package repository](https://packages.microsoft.com/) provides the Connected Machine agent for Linux. The shell script bundle [Install_linux_azcmagent.sh](https://aka.ms/azcmagent) installs and configures the agent.

Installing, upgrading, and removing the Connected Machine agent isn't required after server restart.

Installing the Connected Machine agent for Linux applies the following system-wide configuration changes.

* Setup creates the following installation folders.

    | Directory | Description |
    |-----------|-------------|
    | /opt/azcmagent/ | azcmagent CLI and instance metadata service executables. |
    | /opt/GC_Ext/ | Extension service executables. |
    | /opt/GC_Service/ | Guest configuration (policy) service executables. |
    | /var/opt/azcmagent/ | Configuration, log and identity token files for azcmagent CLI and instance metadata service.|
    | /var/lib/GuestConfig/ | Extension package downloads, guest configuration (policy) definition downloads, and logs for the extension and guest configuration services.|

* Installing the agent creates the following daemons.

    | Service name | Display name | Process name | Description |
    |--------------|--------------|--------------|-------------|
    | himdsd.service | Azure Connected Machine Agent Service | himds | This service implements the Hybrid Instance Metadata service (IMDS) to manage the connection to Azure and the connected machine's Azure identity.|
    | gcad.service | GC Arc Service | gc_linux_service | Audits and enforces Azure guest configuration policies on the machine. |
    | extd.service | Extension Service | gc_linux_service | Installs, updates, and manages extensions on the machine. |

* There are several log files available for troubleshooting, described in the following table.

    | Log | Description |
    |-----|-------------|
    | /var/opt/azcmagent/log/himds.log | Records details of the heartbeat and identity agent component. |
    | /var/opt/azcmagent/log/azcmagent.log | Contains the output of the azcmagent tool commands. |
    | /var/lib/GuestConfig/arc_policy_logs | Records details about the guest configuration (policy) agent component. |
    | /var/lib/GuestConfig/ext_mgr_logs | Records details about extension manager activity (extension install, uninstall, and upgrade events). |
    | /var/lib/GuestConfig/extension_logs | Directory containing logs for individual extensions. |

* Agent installation creates the following environment variables, set in `/lib/systemd/system.conf.d/azcmagent.conf`.

    | Name | Default value | Description |
    |------|---------------|-------------|
    | IDENTITY_ENDPOINT | `http://localhost:40342/metadata/identity/oauth2/token` |
    | IMDS_ENDPOINT | `http://localhost:40342` |

* After uninstalling the agent, the following artifacts remain.

  * /var/opt/azcmagent
  * /var/lib/GuestConfig

## Agent resource governance

The Azure Connected Machine agent is designed to manage agent and system resource consumption. The agent approaches resource governance under the following conditions:

* The Guest Configuration agent can use up to 5% of the CPU to evaluate policies.
* The Extension Service agent can use up to 5% of the CPU on Windows machines and 30% of the CPU on Linux machines to install, upgrade, run, and delete extensions. Some extensions might apply more restrictive CPU limits once installed. The following exceptions apply:

  | Extension type | Operating system | CPU limit |
  | -------------- | ---------------- | --------- |
  | AzureMonitorLinuxAgent | Linux | 60% |
  | AzureMonitorWindowsAgent | Windows | 100% |
  | LinuxOsUpdateExtension | Linux | 60% |
  | MDE.Linux | Linux | 60% |
  | MicrosoftDnsAgent | Windows | 100% |
  | MicrosoftMonitoringAgent | Windows | 60% |
  | OmsAgentForLinux | Linux | 60%|

During normal operations, defined as the Azure Connected Machine agent being connected to Azure and not actively modifying an extension or evaluating a policy, you can expect the agent to consume the following system resources:

|     | Windows | Linux |
| --- | ------- | ----- |
| **CPU usage (normalized to 1 core)** | 0.07% | 0.02% |
| **Memory usage** | 57 MB | 42 MB |

The performance data above was gathered in April 2023 on virtual machines running Windows Server 2022 and Ubuntu 20.04. Actual agent performance and resource consumption will vary based on the hardware and software configuration of your servers.

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
* CPU family, socket, physical core and logical core counts
* Total physical memory
* Serial number
* SMBIOS asset tag
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

The agent requests the following metadata information from Azure:

* Resource location (region)
* Virtual machine ID
* Tags
* Microsoft Entra managed identity certificate
* Guest configuration policy assignments
* Extension requests - install, update, and delete.

> [!NOTE]
> Azure Arc-enabled servers doesn't store/process customer data outside the region the customer deploys the service instance in.

## Deployment options and requirements

Agent deployment and machine connection requires certain [prerequisites](prerequisites.md). There are also [networking requirements](network-requirements.md) to be aware of.

We provide several options for deploying the agent. For more information, see [Plan for deployment](plan-at-scale-deployment.md) and [Deployment options](deployment-options.md).

## Next steps

* To begin evaluating Azure Arc-enabled servers, see [Quickstart: Connect hybrid machines with Azure Arc-enabled servers](learn/quick-enable-hybrid-vm.md).
* Before you deploy the Azure Connected Machine agent and integrate with other Azure management and monitoring services, review the [Planning and deployment guide](plan-at-scale-deployment.md).
* Review troubleshooting information in the [agent connection issues troubleshooting guide](troubleshoot-agent-onboard.md).
