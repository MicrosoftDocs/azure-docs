---
title: Connect hybrid machines to Azure using PowerShell
description: In this article, you learn how to install the agent and connect a machine to Azure by using Azure Arc enabled servers using PowerShell.
ms.date: 10/28/2020
ms.topic: conceptual
---

# Connect hybrid machines to Azure using PowerShell

You can enable Azure Arc enabled servers for one or more Windows or Linux machines in your environment by performing a set of manual steps. Or you can use the PowerShell cmdlet [Connect-AzConnectedMachine](/powershell/module/az.connectedmachine/remove-azconnectedmachine) to download the Connected Machine agent, install the agent, and register the machine with Azure Arc. The cmdlet downloads the Windows agent Windows Installer package from the Microsoft Download Center, and the Linux agent package from Microsoft's package repository.

This method requires that you have administrator permissions on the machine to install and configure the agent. On Linux, by using the root account, and on Windows, you are member of the Local Administrators group. You can complete this process interactively or remotely on a Windows server using [PowerShell remoting](/powershell/scripting/learn/ps101/08-powershell-remoting).

Before you get started, be sure to review the [prerequisites](agent-overview.md#prerequisites) and verify that your subscription and resources meet the requirements. For information about supported regions and other related considerations, see [supported Azure regions](overview.md#supported-regions).

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

- A machine with Azure PowerShell. For instructions, see [Install and configure Azure PowerShell](/powershell/azure/).

Before using Azure PowerShell to manage VM extensions on your hybrid server managed by Arc enabled servers, you need to install the `Az.ConnectedMachine` module. Run the following command on your Arc enabled server:

```powershell
Install-Module -Name Az.ConnectedMachine
```

When the installation completes, the following message is returned:

`The installed extension ``Az.ConnectedMachine`` is experimental and not covered by customer support. Please use with discretion.`

## Install the agent and connect to Azure

1. Open a PowerShell console with elevated privileges.

2. Sign into Azure by running the command `Connect-AzAccount`.

3. To install the Connected Machine agent, use `Connect-AzConnectedMachine` with the `-Name`, `-ResourceGroupName`, and `-Location` parameters. Use the `-SubscriptionId` parameter to override the default subscription as a result of the Azure context created after sign-in. Run one of the following commands:

    * To install the Connected Machine agent on the target machine that can directly communicate to Azure, run:

        ```azurepowershell
        Connect-AzConnectedMachine -ResourceGroupName myResourceGroup -Name myMachineName -Location <region> -SubscriptionId 978ab182-6cf0-4de3-a58b-53c8d0a3235e
        ```
    
    * To install the Connected Machine agent on the target machine that communicates through a proxy server, run:
        
        ```azurepowershell
        Connect-AzConnectedMachine -ResourceGroupName myResourceGroup -Name myMachineName -Location <region> -SubscriptionId 978ab182-6cf0-4de3-a58b-53c8d0a3235e -proxy http://<proxyURL>:<proxyport>
        ```

If the agent fails to start after setup is finished, check the logs for detailed error information. On Windows at *%ProgramData%\AzureConnectedMachineAgent\Log\himds.log*, and on Linux at */var/opt/azcmagent/log/himds.log*.

## Install and connect using PowerShell remoting

Perform the following steps to configure one or more Windows servers with Azure Arc enabled servers. PowerShell remoting must be enabled on the remote machine. Use the `Enable-PSRemoting` cmdlet to enable PowerShell remoting.

1. Open a PowerShell console as an Administrator.

2. Sign into Azure by running the command `Connect-AzAccount`.

3. To install the Connected Machine agent, use `Connect-AzConnectedMachine` with the `-Name`, `-ResourceGroupName`, and `-Location` parameters. Use the `-SubscriptionId` parameter to override the default subscription as a result of the Azure context created after sign-in.

    * To install the Connected Machine agent on the target machine that can directly communicate to Azure, run the following command:
    
        ```azurepowershell
        $session = Connect-PSSession -ComputerName myMachineName
        Connect-AzConnectedMachine -ResourceGroupName myResourceGroup -Name myMachineName -Location <region> -PSSession $session
        ```
    
    * To install the Connected Machine agent on multiple remote machines at the same time, add a list of remote machine names separated by a comma.

        ```azurepowershell
        $session = Connect-PSSession -ComputerName myMachineName1, myMachineName2, myMachineName3
        Connect-AzConnectedMachine -ResourceGroupName myResourceGroup -Name myMachineName -Location <region> -PSSession $session
        ```

    The following example is the results of the command targeting a single machine:
    
    ```azurepowershell
    time="2020-08-07T13:13:25-07:00" level=info msg="Onboarding Machine. It usually takes a few minutes to complete. Sometimes it may take longer depending on network and server load status."
    time="2020-08-07T13:13:25-07:00" level=info msg="Check network connectivity to all endpoints..."
    time="2020-08-07T13:13:29-07:00" level=info msg="All endpoints are available... continue onboarding"
    time="2020-08-07T13:13:50-07:00" level=info msg="Successfully Onboarded Resource to Azure" VM Id=f65bffc7-4734-483e-b3ca-3164bfa42941
    
    Name           Location OSName   Status     ProvisioningState
    ----           -------- ------   ------     -----------------
    myMachineName  eastus   windows  Connected  Succeeded
    ```

## Verify the connection with Azure Arc

After you install the agent and configure it to connect to Azure Arc enabled servers, go to the Azure portal to verify that the server has successfully connected. View your machines in the [Azure portal](https://portal.azure.com).

![A successful server connection](./media/onboard-portal/arc-for-servers-successful-onboard.png)

## Next steps

* Troubleshooting information can be found in the [Troubleshoot Connected Machine agent guide](troubleshoot-agent-onboard.md).

* Learn how to manage your machine using [Azure Policy](../../governance/policy/overview.md), for such things as VM [guest configuration](../../governance/policy/concepts/guest-configuration.md), verifying the machine is reporting to the expected Log Analytics workspace, enable monitoring with [Azure Monitor with VMs](../../azure-monitor/insights/vminsights-enable-policy.md), and much more.

* Learn more about the [Log Analytics agent](../../azure-monitor/platform/log-analytics-agent.md). The Log Analytics agent for Windows and Linux is required when you want to collect operating system and workload monitoring data, manage it using Automation runbooks or features like Update Management, or use other Azure services like [Azure Security Center](../../security-center/security-center-introduction.md).