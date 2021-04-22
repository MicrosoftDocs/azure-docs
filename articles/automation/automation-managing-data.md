---
title: Azure Automation data security
description: This article helps you learn how Azure Automation protects your privacy and secures your data.
services: automation
ms.subservice: shared-capabilities
ms.date: 03/10/2021
ms.topic: conceptual 
ms.custom: devx-track-azurepowershell
---

# Management of Azure Automation data

This article contains several topics explaining how data is protected and secured in an Azure Automation environment.

## TLS 1.2 enforcement for Azure Automation

To insure the security of data in transit to Azure Automation, we strongly encourage you to configure the use of Transport Layer Security (TLS) 1.2. The following are a list of methods or clients that communicate over HTTPS to the Automation service:

* Webhook calls

* Hybrid Runbook Workers, which include machines managed by Update Management and Change Tracking and Inventory.

* DSC nodes

Older versions of TLS/Secure Sockets Layer (SSL) have been found to be vulnerable and while they still currently work to allow backwards compatibility, they are **not recommended**. We do not recommend explicitly setting your agent to only use TLS 1.2 unless its necessary, as it can break platform level security features that allow you to automatically detect and take advantage of newer more secure protocols as they become available, such as TLS 1.3.

For information about TLS 1.2 support with the Log Analytics agent for Windows and Linux, which is a dependency for the Hybrid Runbook Worker role, see [Log Analytics agent overview - TLS 1.2](..//azure-monitor/agents/log-analytics-agent.md#tls-12-protocol).

### Platform-specific guidance

|Platform/Language | Support | More Information |
| --- | --- | --- |
|Linux | Linux distributions tend to rely on [OpenSSL](https://www.openssl.org) for TLS 1.2 support.  | Check the [OpenSSL Changelog](https://www.openssl.org/news/changelog.html) to confirm your version of OpenSSL is supported.|
| Windows 8.0 - 10 | Supported, and enabled by default. | To confirm that you are still using the [default settings](/windows-server/security/tls/tls-registry-settings).  |
| Windows Server 2012 - 2016 | Supported, and enabled by default. | To confirm that you are still using the [default settings](/windows-server/security/tls/tls-registry-settings) |
| Windows 7 SP1 and Windows Server 2008 R2 SP1 | Supported, but not enabled by default. | See the [Transport Layer Security (TLS) registry settings](/windows-server/security/tls/tls-registry-settings) page for details on how to enable.  |

## Data retention

When you delete a resource in Azure Automation, it's retained for many days for auditing purposes before permanent removal. You can't see or use the resource during this time. This policy also applies to resources that belong to a deleted Automation account. The retention policy applies to all users and currently can't be customized. However, if you need to keep data for a longer period, you can [forward Azure Automation job data to Azure Monitor logs](automation-manage-send-joblogs-log-analytics.md).

The following table summarizes the retention policy for different resources.

| Data | Policy |
|:--- |:--- |
| Accounts |An account is permanently removed 30 days after a user deletes it. |
| Assets |An asset is permanently removed 30 days after a user deletes it, or 30 days after a user deletes an account that holds the asset. Assets include variables, schedules, credentials, certificates, Python 2 packages, and connections. |
| DSC Nodes |A DSC node is permanently removed 30 days after being unregistered from an Automation account using Azure portal or the [Unregister-AzAutomationDscNode](/powershell/module/az.automation/unregister-azautomationdscnode) cmdlet in Windows PowerShell. A node is also permanently removed 30 days after a user deletes the account that holds the node. |
| Jobs |A job is deleted and permanently removed 30 days after modification, for example, after the job completes, is stopped, or is suspended. |
| Modules |A module is permanently removed 30 days after a user deletes it, or 30 days after a user deletes the account that holds the module. |
| Node Configurations/MOF Files |An old node configuration is permanently removed 30 days after a new node configuration is generated. |
| Node Reports |A node report is permanently removed 90 days after a new report is generated for that node. |
| Runbooks |A runbook is permanently removed 30 days after a user deletes the resource, or 30 days after a user deletes the account that holds the resource<sup>1</sup>. |

<sup>1</sup>The runbook can be recovered within the 30-day window by filing an Azure support incident with Microsoft Azure Support. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select **Submit a support request**.

## Data backup

When you delete an Automation account in Azure, all objects in the account are deleted. The objects include runbooks, modules, configurations, settings, jobs, and assets. They can't be recovered after the account is deleted. You can use the following information to back up the contents of your Automation account before deleting it.

### Runbooks

You can export your runbooks to script files using either the Azure portal or the [Get-AzureAutomationRunbookDefinition](/powershell/module/servicemanagement/azure.service/get-azureautomationrunbookdefinition) cmdlet in Windows PowerShell. You can import these script files into another Automation account, as discussed in [Manage runbooks in Azure Automation](manage-runbooks.md).

### Integration modules

You can't export integration modules from Azure Automation, they have to be made available outside of the Automation account.

### Assets

You can't export Azure Automation assets: certificates, connections, credentials, schedules, and variables. Instead, you can use the Azure portal and Azure cmdlets to note the details of these assets. Then use these details to create any assets that are used by runbooks that you import into another Automation account.

You can't retrieve the values for encrypted variables or the password fields of credentials using cmdlets. If you don't know these values, you can retrieve them in a runbook. For retrieving variable values, see [Variable assets in Azure Automation](shared-resources/variables.md). To find out more about retrieving credential values, see [Credential assets in Azure Automation](shared-resources/credentials.md).

### DSC configurations

You can export your DSC configurations to script files using either the Azure portal or the [Export-AzAutomationDscConfiguration](/powershell/module/az.automation/export-azautomationdscconfiguration) cmdlet in Windows PowerShell. You can import and use these configurations in another Automation account.

## Geo-replication in Azure Automation

Geo-replication is standard in Azure Automation accounts. You choose a primary region when setting up your account. The internal Automation geo-replication service assigns a secondary region to the account automatically. The service then continuously backs up account data from the primary region to the secondary region. The full list of primary and secondary regions can be found at [Business continuity and disaster recovery (BCDR): Azure Paired Regions](../best-practices-availability-paired-regions.md).

The backup created by the Automation geo-replication service is a complete copy of Automation assets, configurations, and the like. This backup can be used if the primary region goes down and loses data. In the unlikely event that data for a primary region is lost, Microsoft attempts to recover it.

> [!NOTE]
> Azure Automation stores customer data in the region selected by the customer. For the purpose of BCDR, for all regions except Brazil South and Southeast Asia, Azure Automation data is stored in a different region (Azure paired region). Only for the Brazil South (Sao Paulo State) region of Brazil geography and Southeast Asia region (Singapore) of the Asia Pacific geography, we store Azure Automation data in the same region to accommodate data-residency requirements for these regions.

The Automation geo-replication service isn't accessible directly to external customers if there is a regional failure. If you want to maintain Automation configuration and runbooks during regional failures:

1. Select a secondary region to pair with the geographical region of your primary Automation account.

2. Create an Automation account in the secondary region.

3. In the primary account, export your runbooks as script files.

4. Import the runbooks to your Automation account in the secondary region.

## Next steps

* To learn more about secure assets in Azure Automation, see [Encryption of secure assets in Azure Automation](automation-secure-asset-encryption.md).

* To find out more about geo-replication, see [Creating and using active geo-replication](../azure-sql/database/active-geo-replication-overview.md).
