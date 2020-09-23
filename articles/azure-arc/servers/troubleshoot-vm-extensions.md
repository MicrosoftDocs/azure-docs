---
title: Troubleshoot Azure Arc enabled servers VM extension issues
description: This article tells how to troubleshoot and resolve issues with Azure VM extensions that arise with Azure Arc enabled servers.
ms.date: 09/23/2020
ms.topic: conceptual
---

# Troubleshoot Arc enabled servers VM extension issues

This article provides information on troubleshooting and resolving issues that may occur while attempting to deploy or remove Azure VM extensions with non-Azure Windows and Linux VMs. For general information, see [Manage and use Azure VM extensions](./manage-vm-extensions.md).

## General troubleshooting

Data about the state of extension deployments can be retrieved from the Azure portal.

The following troubleshooting steps apply to all VM extensions.

1. To check the Guest agent log, look at the activity when your extension was being provisioned in `%SystemDrive%\ProgramData\GuestConfig\ext_mgr_logs` for Windows, and for Linux under `/var/lib/GuestConfig/ext_mgr_logs`.

2. Check the extension logs for the specific extension for more details in `%SystemDrive%\ProgramData\GuestConfig\extension_logs\<Extension>` for Windows. Extension output is logged to a file for each extension installed on Linux under `/var/lib/GuestConfig/extension_logs`.

3. Check extension specific documentation troubleshooting sections for error codes, known issues etc. Additional troubleshooting information for each extension can be found in the **Troubleshoot and support** section in the overview for the extension. This includes the description of error codes written to the log. The extension articles are linked in the [extensions table](manage-vm-extensions.md#extensions).

4. Look at the system logs. Check for other operations that may have interfered with the extension, such as a long running installation of another application that required exclusive package manager access.

## Troubleshooting specific extension scenarios

### VM Insights

- When enabling VM Insights for an Azure Arc enabled server, it installs the Dependency and Log Analytics agent. On a slow machine or one with a slow network connection, it is possible to see timeouts during the installation process. While we are implementing changes to the Connected Machine agent to help improve this condition, in the interim a retry of the installation may succeed.

### Log Analytics Agent - Linux

- The Log Analytics Agent version is not correctly marking uploaded data with the resource ID of the Azure Arc enabled server. Although logs are being sent to the service, some views of the data are incomplete.

- Some distributions are not currently supported by the Log Analytics agent for Linux. The agent also requires additional dependencies to be installed, including Python 2. Check the support matrix and prerequisites [here](../../azure-monitor/platform/agents-overview.md#supported-operating-systems).

- If an installation fails, review the **Troubleshoot and support** section in the overview for the extension. In most cases there will be an error code included in the status message. For the Log Analytics agent for Linux, they are explained [here](.../../azure-monitor/platform/agent-linux-troubleshoot.md).

- Error code 52 in the status message indicates a missing dependency. Further information about the status message or the logs should indicate which dependency is required.

- Review general troubleshooting information for this VM extension [here](../../virtual-machines/extensions/oms-linux.md#troubleshoot-and-support).

## Next steps

If you don't see your problem here or you can't resolve your issue, try one of the following channels for additional support:

* Get answers from Azure experts through [Microsoft Q&A](/answers/topics/azure-arc.html).

* Connect with [@AzureSupport](https://twitter.com/azuresupport), the official Microsoft Azure account for improving customer experience. Azure Support connects the Azure community to answers, support, and experts.

* File an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/), and select **Get Support**.
