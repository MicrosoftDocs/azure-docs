---
title: How to enable Microsoft Defender for SQL servers on machines at scale
description: Learn how to protect your Microsoft SQL servers on Azure VMs, on-premises, and in hybrid and multicloud environments with Microsoft Defender for Cloud at scale.
ms.topic: how-to
ms.author: dacurwin
author: dcurwin
ms.date: 08/01/2024
#customer intent: As a user, I want to learn how to enable Defender for SQL servers at scale so that I can protect my SQL servers efficiently.
---

# Enable Microsoft Defender for SQL servers on machines at scale

Microsoft Defender for Cloud's SQL servers on machines component of the Defender for Databases plan, protects SQL IaaS and Defender for SQL extensions. The SQL servers on machines component identifies and mitigates potential database vulnerabilities while detecting anomalous activity that could indicate threats to your databases.

When [you enable the SQL Server on a machines](tutorial-enable-databases-plan.md#enable-specific-plans-database-protections) component of the Defender for Databases plan, the auto-provision process is it automatically initiated. The auto-provision process installs and configures all the necessary components for the plan to function. Such as the Azure Monitor Agent (AMA), SQL IaaS extension, and Defender for SQL extensions. The auto-provision process also sets up the workspace configuration, Data Collection Rules, identity (if needed), and the SQL IaaS extension.

This page explains how you can enable the auto-provision process for Defender for SQL across multiple subscriptions simultaneously using a PowerShell script. This process applies to SQL servers hosted on Azure VMs, on-premises environments, and Azure Arc-enabled SQL servers. This article also discusses how to utilize extra functionalities that can accommodate various configurations such as:

- Custom data collection rules

- Custom identity management 

- Default workspace integration 

- Custom workspace configuration

## Prerequisites

- Gain knowledge on: 
    - [SQL server on VMs](https://azure.microsoft.com/products/virtual-machines/sql-server/)
    - [SQL Server enabled by Azure Arc](/sql/sql-server/azure-arc/overview)
    - [How to migrate to Azure Monitor Agent from Log Analytics agent](../azure-monitor/agents/azure-monitor-agent-migration.md)

- [Connect AWS accounts to Microsoft Defender for Cloud](quickstart-onboard-aws.md)
- [Connect your GCP project to Microsoft Defender for Cloud](quickstart-onboard-gcp.md)

- Install PowerShell on [Windows](/powershell/scripting/install/installing-powershell-on-windows), [Linux](/powershell/scripting/install/installing-powershell-on-linux), [macOS](/powershell/scripting/install/installing-powershell-on-macos), or [Azure Resource Manager (ARM)](/powershell/scripting/install/powershell-on-arm).
- [Install the following PowerShell modules](/powershell/module/powershellget/install-module):
    - Az.Resources
    - Az.OperationalInsights
    - Az.Accounts
    - Az
    - Az.PolicyInsights
    - Az.Security

- Permissions: requires VM contributor, contributor, or owner rules.

## PowerShell script parameters and samples

The PowerShell script that enables Microsoft Defender for SQL on Machines on a given subscription has several parameters that you can customize to fit your needs. The following table lists the parameters and their descriptions:

| Parameter name | Required | Description |
|--|--|--|
| SubscriptionId: | Required | The Azure subscription ID that you want to enable Defender for SQL servers on machines for. |
| RegisterSqlVmAgnet | Required | A flag indicating whether to register the SQL VM Agent in bulk. <br><br> Learn more about [registering multiple SQL VMs in Azure with the SQL IaaS Agent extension](/azure/azure-sql/virtual-machines/windows/sql-agent-extension-manually-register-vms-bulk?view=azuresql). |
| WorkspaceResourceId | Optional | The resource ID of the Log Analytics workspace, if you want to use a custom workspace instead of the default one. |
| DataCollectionRuleResourceId | Optional | The resource ID of the data collection rule, if you want to use a custom DCR instead of the default one. |
| UserAssignedIdentityResourceId | Optional | The resource ID of the user assigned identity, if you want to use a custom user assigned identity instead of the default one. |

The following sample script is applicable when you use a default Log Analytics workspace, data collection rule, and managed identity.

```powershell
Write-Host "------ Enable Defender for SQL on Machines example ------" 
$SubscriptionId = "<SubscriptionID>"
.\EnableDefenderForSqlOnMachines.ps1 -SubscriptionId $SubscriptionId -RegisterSqlVmAgnet $RegisterSqlVmAgnet 
```

The following sample script is applicable when you use a custom Log Analytics workspace, data collection rule, and managed identity.

```powershell
Write-Host "------ Enable Defender for SQL on Machines example ------" 
$SubscriptionId = "<SubscriptionID>" 
$RegisterSqlVmAgnet = "false" 
$WorkspaceResourceId = "/subscriptions/<SubscriptionID>/resourceGroups/someResourceGroup/providers/Microsoft.OperationalInsights/workspaces/someWorkspace" 
$DataCollectionRuleResourceId = "/subscriptions/<SubscriptionID>/resourceGroups/someOtherResourceGroup/providers/Microsoft.Insights/dataCollectionRules/someDcr" 
$UserAssignedIdentityResourceId = "/subscriptions/<SubscriptionID>/resourceGroups/someElseResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/someManagedIdentity" 
.\EnableDefenderForSqlOnMachines.ps1 -SubscriptionId $SubscriptionId -RegisterSqlVmAgnet $RegisterSqlVmAgnet -WorkspaceResourceId $WorkspaceResourceId -DataCollectionRuleResourceId $DataCollectionRuleResourceId -UserAssignedIdentityResourceId $UserAssignedIdentityResourceId
```

## Enable Defender for SQL servers on machines at scale

You can enable Defender for SQL servers on machines at scale by following these steps.

1. Open a PowerShell window.

1. Copy the [EnableDefenderForSqlOnMachines.ps1](https://github.com/Azure/Microsoft-Defender-for-Cloud/blob/fd04330a79a4bcd48424bf7a4058f44216bc40e4/Powershell%20scripts/Enable%20Defender%20for%20SQL%20servers%20on%20machines/EnableDefenderForSqlOnMachines.ps1) script.

1. Paste the script into PowerShell.

1. Enter parameter information as needed.

1. Run the script. 

## Next step

> [!div class="nextstepaction"]
> [Scan your SQL servers for vulnerabilities](defender-for-sql-on-machines-vulnerability-assessment.md)
