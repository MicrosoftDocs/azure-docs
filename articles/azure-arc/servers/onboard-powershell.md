---
title: Connect hybrid machines to Azure using PowerShell
description: In this article, you learn how to install the agent and connect a machine to Azure by using Azure Arc enabled servers using PowerShell.
ms.date: 10/21/2020
ms.topic: conceptual
---

# Connect hybrid machines to Azure using PowerShell

You can enable Azure Arc enabled servers for one or a small number of Windows or Linux machines in your environment by performing a set of steps manually. Or you can use the PowerShell cmdlet [Connect-AzConnectedMachine](/powershell/module/az.connectedmachine/remove-azconnectedmachine). This cmdlet performs the following actions:

- Configures the host machine to download the Windows agent from the Microsoft Download Center, and the Linux agent package from packages.microsoft.com.
- Installs the Connected Machine agent.
- Registers the machine with Azure Arc

This method requires that you have administrator permissions on the machine to install and configure the agent. On Linux, by using the root account, and on Windows, you are member of the Local Administrators group.

Before you get started, be sure to review the [prerequisites](agent-overview.md#prerequisites) and verify that your subscription and resources meet the requirements. For information about supported regions and other related considerations, see [supported Azure regions](overview.md#supported-regions).

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

- A computer with Azure PowerShell. For instructions, see [Install and configure Azure PowerShell](/powershell/azure/).

Before using Azure PowerShell to manage VM extensions on your hybrid server managed by Arc enabled servers, you need to install the `Az.ConnectedMachine` module. Run the following command on your Arc enabled server:

```powershell
Install-Module -Name Az.ConnectedMachine
```

When the installation completes, the following message is returned:

`The installed extension ``Az.ConnectedMachine`` is experimental and not covered by customer support. Please use with discretion.`

## Install and validate the agent on Windows

1. Open a PowerShell console as an Administrator.

2. Sign into Azure by running the command `Connect-AzAccount`.

3. To install the Connected Machine agent, use `Connect-AzConnectedMachine` with the `-Name`, `-ResourceGroupName`, and `-Location` parameters. Use the `-SubscriptionId` parameter to override the default subscription as a result of the Azure context created after sign in.

    To install the Connected Machine agent on the target machine that can directly communicate to Azure, run the following command::

    ```azurepowershell
    Connect-AzConnectedMachine -ResourceGroupName myResourceGroup -Name myMachineName -Location <region> -SubscriptionId 978ab182-6cf0-4de3-a58b-53c8d0a3235e
    ```
    
    If the target machine communicates through a proxy server, run the following command:
    
    ```azurepowershell
    Connect-AzConnectedMachine -ResourceGroupName myResourceGroup -Name myMachineName -Location <region> -SubscriptionId 978ab182-6cf0-4de3-a58b-53c8d0a3235e -proxy http://<proxyURL>:<proxyport>
    ```

    If the agent fails to start after setup is finished, check the logs for detailed error information. On Windows at *%ProgramData%\AzureConnectedMachineAgent\Log\himds.log*, and on Linux at */var/opt/azcmagent/log/himds.log*.

## Verify the connection with Azure Arc

After you install the agent and configure it to connect to Azure Arc enabled servers, go to the Azure portal to verify that the server has successfully connected. View your machines in the [Azure portal](https://portal.azure.com).

![A successful server connection](./media/onboard-portal/arc-for-servers-successful-onboard.png)

## Next steps

* Troubleshooting information can be found in the [Troubleshoot Connected Machine agent guide](troubleshoot-agent-onboard.md).

* Learn how to manage your machine using [Azure Policy](../../governance/policy/overview.md), for such things as VM [guest configuration](../../governance/policy/concepts/guest-configuration.md), verifying the machine is reporting to the expected Log Analytics workspace, enable monitoring with [Azure Monitor with VMs](../../azure-monitor/insights/vminsights-enable-policy.md), and much more.

* Learn more about the [Log Analytics agent](../../azure-monitor/platform/log-analytics-agent.md). The Log Analytics agent for Windows and Linux is required when you want to collect operating system and workload monitoring data, manage it using Automation runbooks or features like Update Management, or use other Azure services like [Azure Security Center](../../security-center/security-center-introduction.md).