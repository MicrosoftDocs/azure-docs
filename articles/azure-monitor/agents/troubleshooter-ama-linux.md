---
title: Use Azure Monitor Agent Troubleshooter for Linux
description: Detailed instructions on using the Linux agent troubleshooter tool to diagnose potential issues.
ms.topic: conceptual
author: RepinStyle
ms.author: bhumphrey
ms.date: 12/14/2023
ms.custom: references_regions
ms.reviewer: jeffwo

# customer-intent: When AMA is experiencing issues, I want to investigate the issues and determine if I can resolve the issue on my own.
---

# Use the Azure Monitor Agent Troubleshooter for Linux
The Azure Monitor Agent Troubleshooter (AMA) is designed to help identify issues with the agent and perform general health assessments. It can perform various checks to ensure that the agent is properly installed and connected, and can also gather AMA-related logs from the machine being diagnosed.

> [!Note]
> The AMA Troubleshooter is an executable that is shipped with the agent for all versions newer than **1.25.1** for Linux.

## Prerequisites
The linux Troubleshooter requires Python 2.6+ or any Python 3 installed on the machine. In addition, the following Python packages are required to run (all should be present on a default install of Python 2 or Python 3):

|Python Package|Required for Python 2?|Required for Python 3?|
|:---|:---|:---|
|copy|yes|yes|
|datetime|yes|yes|
|json|yes|yes|
|os|yes|yes|
|platform|yes|yes|
|re|yes|yes|
|requests|no|yes|
|shutil|yes|yes|
|subprocess|yes|yes|
|url lib|yes|no|
|xml.dom.minidom|yes|yes|

On the machine to be diagnosed, does this directory exist:
***/var/lib/waagent/Microsoft.Azure.Monitor.AzureMonitorLinuxAgent-{version}***

To verify the Agent Troubleshooter is present, copy the following command and run in Bash as root:

```Bash
ls -ltr /var/lib/waagent | grep "Microsoft.Azure.Monitor.AzureMonitorLinuxAgent-*"
```

:::image type="content" source="./media/use-azure-monitor-agent-troubleshooter/ama-nix-prerequisites-shell.png" alt-text="Screenshot of the Bash window, which shows the result of ls command for the AMA installation directory.":::

If not, the directory doesn't exist and the installation failed. In this case, follow [Basic troubleshooting steps](azure-monitor-agent-troubleshoot-linux-vm.md#basic-troubleshooting-steps) instead.

Yes, the directory exists. Proceed to [Run the Troubleshooter](#run-the-troubleshooter).

## Run the Troubleshooter
On the machine to be diagnosed, run the Agent Troubleshooter.

# [Log Mode](#tab/GenerateLogs)

To start the Agent Troubleshooter in log mode, copy the following command and run in Bash as root:

> [!Note]
> You'll need to update the {version} to match your installed version number. In the following example, the version is 1.28.11.

```Bash
cd /var/lib/waagent/Microsoft.Azure.Monitor.AzureMonitorLinuxAgent-{version}/ama_tst/
sudo sh ama_troubleshooter.sh -L	
```

Enter a path to output logs to. For instance, you might use **/tmp**.

It runs a series of activities and outputs a .tgz file to the Output Directory you specified. Be patient until this process completes.

:::image type="content" source="media/use-azure-monitor-agent-troubleshooter/ama-nix-run-the-troubleshooter-option-l-shell.png" alt-text="Screenshot of the Bash window, which shows the result of the AgentTroubleshooter running with the -L option to generate logs.":::

# [Interactive Mode](#tab/Interactive)

To start the Agent Troubleshooter in interactive mode, copy the following command and run in Bash as root:

> [!Note]
> You'll need to update the {version} to match your installed version number. In the following example, the version is 1.28.11.

```Bash
cd /var/lib/waagent/Microsoft.Azure.Monitor.AzureMonitorLinuxAgent-{version}/ama_tst/
sudo sh ama_troubleshooter.sh -A	
```

It runs a series of scenarios and displays the results.

> [!Note]
> The interactive mode will **not** generate log files, but will **only** output results to the screen. Switch to log mode, if you need to generate log files.

:::image type="content" source="media/use-azure-monitor-agent-troubleshooter/ama-nix-run-the-troubleshooter-option-l-shell.png" alt-text="Screenshot of the Bash window, which shows the result of the AgentTroubleshooter running with the -A option to output Troubleshooter results to the screen.":::
---

## Frequently Asked Questions

**Can I copy the Troubleshooter from a newer agent to an older agent and run it on the older agent to diagnose issues with the older agent?**
It isn't possible to use the Troubleshooter to diagnose an older version of the agent by copying it. You must have an up-to-date version of the agent for the Troubleshooter to work properly.

## Next Steps
- [Troubleshooting guidance for the Azure Monitor agent](../agents/azure-monitor-agent-troubleshoot-linux-vm.md) on Linux virtual machines and scale sets
- [Syslog troubleshooting guide for Azure Monitor Agent](../agents/azure-monitor-agent-troubleshoot-linux-vm-rsyslog.md) for Linux