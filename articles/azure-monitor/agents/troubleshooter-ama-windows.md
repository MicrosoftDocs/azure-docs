---
title: How to use the Windows operating system (OS) Azure Monitor Agent Troubleshooter
description: Detailed instructions on using the Windows agent troubleshooter tool to diagnose potential issues.
ms.topic: conceptual
author: guywi-ms
ms.author: guywild
ms.date: 12/14/2023
ms.custom: references_regions
ms.reviewer: jeffwo

# Customer intent: When AMA is experiencing issues, I want to investigate the issues and determine if I can resolve the issue on my own.
---

# How to use the Windows operating system (OS) Azure Monitor Agent Troubleshooter
The Azure Monitor Agent (AMA) Troubleshooter is designed to help identify issues with the agent and perform general health assessments. It can perform various checks to ensure that the agent is properly installed and connected, and can also gather AMA-related logs from the machine being diagnosed.

> [!Note]
> The Windows AMA Troubleshooter is a command line executable that is shipped with the agent for all versions newer than **1.12.0.0**. 

## Prerequisites
### Troubleshooter existence check
Check for the existence of the AMA Agent Troubleshooter directory on the machine to be diagnosed to confirm the installation of the agent troubleshooter:

# [AMA Extension - PowerShell](#tab/WindowsPowerShell)
To verify the Agent Troubleshooter is present, copy the following command and run in PowerShell as administrator:
```powershell
Test-Path -Path "C:/Packages/Plugins/Microsoft.Azure.Monitor.AzureMonitorWindowsAgent"
```

If the directory exists, the Test-Path cmdlet returns `True`.

:::image type="content" source="./media/use-azure-monitor-agent-troubleshooter/ama-win-prerequisites-powershell.png" alt-text="Screenshot of the PowerShell window, which shows the result of Test-Path PowerShell cmdlet." lightbox="media/use-azure-monitor-agent-troubleshooter/ama-win-prerequisites-powershell.png":::

# [AMA Extension - Command Prompt](#tab/WindowsCmd)
To verify the Agent Troubleshooter is present, copy the following command and run in Command Prompt as administrator:
```command
cd "C:/Packages/Plugins/Microsoft.Azure.Monitor.AzureMonitorWindowsAgent"
```

If the directory exists, the cd command changes directories successfully.

:::image type="content" source="media/use-azure-monitor-agent-troubleshooter/ama-win-prerequisites-cmd.png" alt-text="Screenshot of the command prompt window, which shows the result of cd command." lightbox="media/use-azure-monitor-agent-troubleshooter/ama-win-prerequisites-cmd.png":::

# [AMA Standalone - PowerShell](#tab/WindowsPowerShellStandalone)
To verify the Agent Troubleshooter is present, copy the following command and run in PowerShell as administrator:
```powershell
$installPath = (Get-ItemProperty -Path "Registry::HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\AzureMonitorAgent").AMAInstallPath
Test-Path -Path $installPath\Troubleshooter
```

If the directory exists, the Test-Path cmdlet returns `True`.

:::image type="content" source="./media/use-azure-monitor-agent-troubleshooter/ama-win-standalone-prerequisites-powershell.png" alt-text="Screenshot of the PowerShell window, which shows the result of Test-Path PowerShell cmdlet." lightbox="media/use-azure-monitor-agent-troubleshooter/ama-win-standalone-prerequisites-powershell.png":::

# [AMA Standalone - Command Prompt](#tab/WindowsCmdStandalone)
To verify the Agent Troubleshooter is present, copy the following command and run in Command Prompt as administrator:

> [!Note]
> If you have customized the AMAInstallPath, you'll need to adjust the below path to your custom path.

```command
cd "C:\Program Files\Azure Monitor Agent\Troubleshooter"
```

If the directory exists, the cd command changes directories successfully.

:::image type="content" source="media/use-azure-monitor-agent-troubleshooter/ama-win-standalone-prerequisites-cmd.png" alt-text="Screenshot of the command prompt window, which shows the result of cd command." lightbox="media/use-azure-monitor-agent-troubleshooter/ama-win-standalone-prerequisites-cmd.png":::

---

If directory doesn't exist or the installation is failed, follow [Basic troubleshooting steps](../agents/azure-monitor-agent-troubleshoot-windows-vm.md#basic-troubleshooting-steps-installation-agent-not-running-configuration-issues).

Yes, the directory exists. Proceed to [Run the Troubleshooter](#run-the-troubleshooter).

## Run the Troubleshooter
On the machine to be diagnosed, run the Agent Troubleshooter.

# [AMA Extension - PowerShell](#tab/WindowsPowerShell)
To start the Agent Troubleshooter, copy the following command and run in PowerShell as administrator:
```powershell
$currentVersion = ((Get-ChildItem -Path "Registry::HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows Azure\HandlerState\" `
    | where Name -like "*AzureMonitorWindowsAgent*" `
    | ForEach-Object {$_ | Get-ItemProperty} `
    | where InstallState -eq "Enabled").PSChildName -split('_'))[1]

$troubleshooterPath = "C:\Packages\Plugins\Microsoft.Azure.Monitor.AzureMonitorWindowsAgent\$currentVersion\Troubleshooter"
Set-Location -Path $troubleshooterPath
Start-Process -FilePath $troubleshooterPath\AgentTroubleshooter.exe -ArgumentList "--ama"
Invoke-Item $troubleshooterPath
```

It runs a series of activities that could take up to 15 minutes to complete. Be patient until the process completes.

:::image type="content" source="media/use-azure-monitor-agent-troubleshooter/ama-win-run-troubleshooter-powershell.png" alt-text="Screenshot of the PowerShell window, which shows the result of the AgentTroubleshooter." lightbox="media/use-azure-monitor-agent-troubleshooter/ama-win-run-troubleshooter-powershell.png":::

# [AMA Extension - Command Prompt](#tab/WindowsCmd)
To start the Agent Troubleshooter, copy the following command and run in Command Prompt as administrator:

> [!Note]
> Note: You'll need to update the {version} to match your installed version number. In the following example, the version is 1.20.0.0.

```command
cd C:/Packages/Plugins/Microsoft.Azure.Monitor.AzureMonitorWindowsAgent/{version}/Troubleshooter/
AgentTroubleshooter.exe --ama
```

It runs a series of activities that could take up to 15 minutes to complete. Be patient until this process completes.

:::image type="content" source="media/use-azure-monitor-agent-troubleshooter/ama-win-run-troubleshooter-cmd.png" alt-text="Screenshot of the command prompt window, which shows the result of the AgentTroubleshooter." lightbox="media/use-azure-monitor-agent-troubleshooter/ama-win-run-troubleshooter-cmd.png":::

# [AMA Standalone - PowerShell](#tab/WindowsPowerShellStandalone)
To start the Agent Troubleshooter, copy the following command and run in PowerShell as administrator:
```powershell
$installPath = (Get-ItemProperty -Path "Registry::HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\AzureMonitorAgent").AMAInstallPath
Set-Location -Path $installPath\Troubleshooter
Start-Process -FilePath $installPath\Troubleshooter\AgentTroubleshooter.exe -ArgumentList "--ama"
Invoke-Item $installPath\Troubleshooter
```

It runs a series of activities that could take up to 15 minutes to complete. Be patient until the process completes.

:::image type="content" source="media/use-azure-monitor-agent-troubleshooter/ama-win-standalone-run-troubleshooter-powershell.png" alt-text="Screenshot of the PowerShell window, which shows the result of the AgentTroubleshooter." lightbox="media/use-azure-monitor-agent-troubleshooter/ama-win-standalone-run-troubleshooter-powershell.png":::

# [AMA Standalone - Command Prompt](#tab/WindowsCmdStandalone)
To start the Agent Troubleshooter, copy the following command and run in Command Prompt as administrator:

> [!Note]
> If you have customized the AMAInstallPath, you'll need to adjust the below path to your custom path.

```command
cd "C:\Program Files\Azure Monitor Agent\Troubleshooter"
AgentTroubleshooter.exe --ama
```

It runs a series of activities that could take up to 15 minutes to complete. Be patient until this process completes.

:::image type="content" source="media/use-azure-monitor-agent-troubleshooter/ama-win-standalone-run-troubleshooter-cmd.png" alt-text="Screenshot of the command prompt window, which shows the result of the AgentTroubleshooter." lightbox="media/use-azure-monitor-agent-troubleshooter/ama-win-standalone-run-troubleshooter-cmd.png":::

---

Log file is created in the directory where the AgentTroubleshooter.exe is located.

Example for extension-based install:
:::image type="content" source="media/use-azure-monitor-agent-troubleshooter/ama-win-verify-log-exists.png" alt-text="Screenshot of the Windows explorer window, which shows the output of the AgentTroubleshooter for extension-based install." lightbox="media/use-azure-monitor-agent-troubleshooter/ama-win-verify-log-exists.png":::

Example for standalone install:
:::image type="content" source="media/use-azure-monitor-agent-troubleshooter/ama-win-standalone-verify-log-exists.png" alt-text="Screenshot of the Windows explorer window, which shows the output of the AgentTroubleshooter for standalone install." lightbox="media/use-azure-monitor-agent-troubleshooter/ama-win-standalone-verify-log-exists.png":::

## Frequently Asked Questions

### Can I copy the Troubleshooter from a newer agent to an older agent and run it on the older agent to diagnose issues with the older agent?
It isn't possible to use the Troubleshooter to diagnose an older version of the agent by copying it. You must have an up-to-date version of the agent for the Troubleshooter to work properly.

## Next Steps
- [Troubleshooting guidance for the Azure Monitor agent](../agents/azure-monitor-agent-troubleshoot-windows-vm.md) on Windows virtual machines and scale sets
- [Troubleshooting guidance for the Azure Monitor agent](../agents/azure-monitor-agent-troubleshoot-windows-arc.md) on Windows Arc-enabled server
