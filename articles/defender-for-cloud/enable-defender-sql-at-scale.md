---
title: How to enable Microsoft Defender for SQL servers on machines at scale
description: Learn how to protect your Microsoft SQL servers on Azure VMs, on-premises, and in hybrid and multicloud environments with Microsoft Defender for Cloud at scale.
ms.topic: how-to
ms.author: dacurwin
author: dcurwin
ms.date: 07/14/2024
---

# Enable Microsoft Defender for SQL servers on machines at scale

Microsoft Defender for Cloud's Defender for Databases plan provides security for SQL servers on virtual machines. In order to protect your databases, the Azure Monitoring Agent (AMA) must be implemented to prevent attacks and to identify configuration errors. 

When you enable Defender for Databases, it automatically enables the auto provisioning process which configures of all the required agent components necessary for the plan to function. The auto provisioning process includes installation the configuration of the AMA, workspace configuration, and the virtusl machines (VM) extension and solution.

This page explains how you can enable the auto-provisioning process for Defender for Databases across multiple subscriptions simultaneously using PowerShell. This process applies to SQL servers hosted on Azure VMs, on-premises environments, and Azure Arc-enabled SQL servers. You will also learn how to utilize additional functionalities that accommodate a variety of configurations, including:

- Custom data collection rules

- Custom identity management 

- Default workspace integration 

- Custom workspace configuration

## Prerequisites

- Gain knowledge on: 
    - [SQL server on VMs](https://azure.microsoft.com/products/virtual-machines/sql-server/)
    - [SQL Server enabled by Azure Arc](/sql/sql-server/azure-arc/overview?view=sql-server-ver16)
    - [How to install Log Analytics agent on Windows computers](../azure-monitor/agents/agent-windows.md)
    - [How to migrate to Azure Monitor Agent from Log Analytics agent](../azure-monitor/agents/azure-monitor-agent-migration.md)

- [Connect AWS accounts to Microsoft Defender for Cloud](quickstart-onboard-aws.md)
- [Connect your GCP project to Microsoft Defender for Cloud](quickstart-onboard-gcp.md)

- Install Powershell on [Windows](/powershell/scripting/install/installing-powershell-on-windows?view=powershell-7.4), [Linux](/powershell/scripting/install/installing-powershell-on-linux?view=powershell-7.4), [MacOS](/powershell/scripting/install/installing-powershell-on-macos?view=powershell-7.4), or [ARM](/powershell/scripting/install/powershell-on-arm?view=powershell-7.4).
- [Install the following Powershell modules](/powershell/module/powershellget/install-module?view=powershellget-3.x):
    - Az.Resources
    - Az.OperationalInsights
    - Az.Accounts
    - Az
    - Az.PolicyInsights
    - Az.Security

- Permissions: requires VM contributor, contributor or owner rules.

## Run the Powershell script

The Powershell script that enables Microsoft Defender for SQL on Machines on a given subscription. 

| Parameter name | Required | Description |
|--|--|--|
| SubscriptionId: | Required | The Azure subscription ID that you want to enable Defender for SQL servers on machines for. |
| RegisterSqlVmAgnet | Required | A flag indicating whether to register the SQL VM Agent in bulk. <br><br> Learn more about [registering multiple SQL VMs in Azure with the SQL IaaS Agent extension](/azure/azure-sql/virtual-machines/windows/sql-agent-extension-manually-register-vms-bulk?view=azuresql). |
| WorkspaceResourceId | Optional | The resource ID of the Log Analytics workspace, if you want to use a custom workspace instead of the default one. |
| DataCollectionRuleResourceId | Optional | The resource ID of the data collection rule, if you want to use a custom DCR instead of the default one. |
| UserAssignedIdentityResourceId | Optional | The resource ID of the user assigned identity, if you want to use a custom user assigned identity instead of the default one. |

1. Open a Powershell window.
1. 
1. 

```powershell