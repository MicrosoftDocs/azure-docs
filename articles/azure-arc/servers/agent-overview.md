---
title:  Overview of the Azure Connected Machine agent
description: This article provides a detailed overview of the Azure Arc-enabled servers agent available, which supports monitoring virtual machines hosted in hybrid environments.
ms.date: 07/05/2022
ms.topic: conceptual
ms.custom: devx-track-azurepowershell
---

# Overview of Azure Connected Machine agent

The Azure Connected Machine agent enables you to manage your Windows and Linux machines hosted outside of Azure on your corporate network or other cloud providers.

## Agent component details

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
