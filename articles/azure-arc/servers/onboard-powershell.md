---
title: Connect hybrid machines to Azure by using PowerShell
description: In this article, you learn how to install the agent and connect a machine to Azure by using Azure Arc enabled servers. You can do this with PowerShell.
ms.date: 10/28/2020
ms.topic: conceptual 
ms.custom: devx-track-azurepowershell
---

# Connect hybrid machines to Azure by using PowerShell

For servers enabled with Azure Arc, you can take manual steps to enable them for one or more Windows or Linux machines in your environment. Alternatively, you can use the PowerShell cmdlet [Connect-AzConnectedMachine](/powershell/module/az.connectedmachine/remove-azconnectedmachine) to download the Connected Machine agent, install the agent, and register the machine with Azure Arc. The cmdlet downloads the Windows agent package (Windows Installer) from the Microsoft Download Center, and the Linux agent package from the Microsoft package repository.

This method requires that you have administrator permissions on the machine to install and configure the agent. On Linux, by using the root account, and on Windows, you are member of the Local Administrators group. You can complete this process interactively or remotely on a Windows server by using [PowerShell remoting](/powershell/scripting/learn/ps101/08-powershell-remoting).

Before you get started, review the [prerequisites](agent-overview.md#prerequisites) and verify that your subscription and resources meet the requirements. For information about supported regions and other related considerations, see [supported Azure regions](overview.md#supported-regions).

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

- A machine with Azure PowerShell. For instructions, see [Install and configure Azure PowerShell](/powershell/azure/).

You use PowerShell to manage VM extensions on your hybrid servers managed by Azure Arc enabled servers. Before using PowerShell, install the `Az.ConnectedMachine` module. Run the following command on your server enabled with Azure Arc:

```powershell
Install-Module -Name Az.ConnectedMachine
```

When the installation finishes, you see the following message:

`The installed extension ``Az.ConnectedMachine`` is experimental and not covered by customer support. Please use with discretion.`

## Install the agent and connect to Azure

1. Open a PowerShell console with elevated privileges.

2. Sign in to Azure by running the command `Connect-AzAccount`.

3. To install the Connected Machine agent, use `Connect-AzConnectedMachine` with the `-Name`, `-ResourceGroupName`, and `-Location` parameters. Use the `-SubscriptionId` parameter to override the default subscription as a result of the Azure context created after sign-in. Run one of the following commands:

    * To install the Connected Machine agent on the target machine that can directly communicate to Azure, run:

        ```azurepowershell
        Connect-AzConnectedMachine -ResourceGroupName myResourceGroup -Name myMachineName -Location <region>
        ```
    
    * To install the Connected Machine agent on the target machine that communicates through a proxy server, run:
        
        ```azurepowershell
        Connect-AzConnectedMachine -ResourceGroupName myResourceGroup -Name myMachineName -Location <region> -Proxy http://<proxyURL>:<proxyport>
        ```

If the agent fails to start after setup is finished, check the logs for detailed error information. On Windows, check this file: *%ProgramData%\AzureConnectedMachineAgent\Log\himds.log*. On Linux, check this file: */var/opt/azcmagent/log/himds.log*.

## Install and connect by using PowerShell remoting

Here's how to configure one or more Windows servers with servers enabled with Azure Arc. You must enable PowerShell remoting on the remote machine. Use the `Enable-PSRemoting` cmdlet to do this.

1. Open a PowerShell console as an Administrator.

2. Sign in to Azure by running the command `Connect-AzAccount`.

3. To install the Connected Machine agent, use `Connect-AzConnectedMachine` with the `-ResourceGroupName`, and `-Location` parameters. The Azure resource names will automatically use the hostname of each server. Use the `-SubscriptionId` parameter to override the default subscription as a result of the Azure context created after sign-in.

    * To install the Connected Machine agent on the target machine that can directly communicate to Azure, run the following command:
    
        ```azurepowershell
        $sessions = New-PSSession -ComputerName myMachineName
        Connect-AzConnectedMachine -ResourceGroupName myResourceGroup -Location <region> -PSSession $sessions
        ```
    
    * To install the Connected Machine agent on multiple remote machines at the same time, add a list of remote machine names, each separated by a comma.

        ```azurepowershell
        $sessions = New-PSSession -ComputerName myMachineName1, myMachineName2, myMachineName3
        Connect-AzConnectedMachine -ResourceGroupName myResourceGroup -Location <region> -PSSession $sessions
        ```

    The following example shows the results of the command targeting a single machine:
    
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

After you install and configure the agent to register with Azure Arc enabled servers, go to the Azure portal to verify that the server has successfully connected. View your machine in the [Azure portal](https://portal.azure.com).

![Screenshot of Servers dashboard, showing a successful server connection.](./media/onboard-portal/arc-for-servers-successful-onboard.png)

## Next steps

* If necessary, see the [Troubleshoot Connected Machine agent guide](troubleshoot-agent-onboard.md).

* Learn how to manage your machine by using [Azure Policy](../../governance/policy/overview.md). You can use VM [guest configuration](../../governance/policy/concepts/guest-configuration.md), verify that the machine is reporting to the expected Log Analytics workspace, and enable monitoring with [Azure Monitor with VMs](../../azure-monitor/vm/vminsights-enable-policy.md).

* Learn more about the [Log Analytics agent](../../azure-monitor/agents/log-analytics-agent.md). The Log Analytics agent for Windows and Linux is required when you want to collect operating system and workload monitoring data, or manage it by using Azure Automation runbooks or features like Update Management. This agent is also required to use other Azure services, such as [Azure Security Center](../../security-center/security-center-introduction.md).
