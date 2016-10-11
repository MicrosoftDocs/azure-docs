<properties
	pageTitle="Azure Government documentation | Microsoft Azure"
	description="This provides a comparision of features and guidance on developing applications for Azure Government"
	services="Azure-Government"
	cloud="gov" 
	documentationCenter=""
	authors="ryansoc"
	manager="zakramer"
	editor=""/>

<tags
	ms.service="multiple"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.workload="azure-government"
	ms.date="10/11/2016"
	ms.author="ryansoc"/>


#  Azure Government Management and Security

##  Key Vault

The following information identifies the Azure Government boundary for Azure Key Vault:

| Regulated/controlled data permitted | Regulated/controlled data not permitted |
|--------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| All data encrypted with an Azure Key Vault key may contain Regulated/controlled data. | Azure Key Vault metadata is not permitted to contain export controlled data. This metadata includes all configuration data entered when creating and maintaining your Key Vault.  Do not enter Regulated/controlled data into the following fields: Resource group names, Key Vault names, Subscription name |

Key Vault is generally available in Azure Government. As in public, there is no extension, so Key Vault is available through PowerShell and CLI only.

For more information, see the [Azure Key Vault public documentation](/key-vault-get-started).

## Log Analytics

Log Analytics is generally available in Azure Government. 

### Differences from public Azure

The following Log Analytics features and solutions are not currently available in Azure Government. This list is updated when the status of features / solutions changes.

+ Solutions that are in preview in public Azure, including:
  - Network Monitoring solution
  - Azure Networking Analytics solution
  - Office 365 solution
  - Windows 10 Upgrade Analytics solution
  - Application Dependency Monitoring
  - Application Insights
  - Azure Activity Logs
  - Azure Automation Analytics
  - Key Vault Analytics
+ Solutions and features that require Azure Automation, including:
  - Update Management
  - Change Management
  - Alerts that trigger an Azure Automation runbook
+ Solutions and features that require updates to on-premises software, including
  - Integration with System Center Operations Manager 2016
  - Computers Groups from System Center Configuration Manager
  - Surface Hub solution
+ Features that are in preview in public Azure, including
  - Export of data to PowerBI
+ Azure portal integration
  - Selecting Azure storage accounts to monitor must be done through PowerShell or Resource Manager templates
  - Selecting virtual machines to enable the Log Analytics agent must be done through PowerShell or Resource Manager templates
  - Azure metrics and Azure diagnostics
+ OMS Mobile applications
+ OMS Linux Agent VM Extension
+ Usage data

The following Log Analytics features have different behavior in Azure Government:

+ The Windows agent must be downloaded from the [Log Analytics portal](https://oms.microsoft.us) for Azure Government.
+ Uploading data using the Data Collector API requires the use of the Azure Government URL, https://*workspaceId*.ods.opinsights.azure.us where *workspaceId* is the Workspace Id from the OMS portal. 
+ To connect your System Center Operations Manager management server to Log Analytics, you need to download and import updated Management Packs.
  1. Download and save the [updated management packs](http://go.microsoft.com/fwlink/?LinkId=828749)
  2. Unzip the file you have downloaded
  3. Import the management packs into Operations Manager. For information about how to import a management pack from a disk, see the [How to Import an Operations Manager Management Pack](http://technet.microsoft.com/library/hh212691.aspx) topic on the Microsoft TechNet website.
  4. To connect Operations Manager to Log Analytics, follow the steps in [Connect Operations Manager to Log Analytics](../log-analytics/log-analytics-om-agents.md) 



### Frequently asked questions

+ Can I migrate data from Log Analytics in public Azure to Azure Government?
  - No. It is not possible to move data or your workspace from public Azure to Azure Government.
+ Can I switch between public Azure and Azure Government workspaces from the OMS Log Analytics portal?
  - No. The portals for public Azure and Azure Government are separate and do not share information. 

For more information, see [Log Analytics public documentation](../log-analytics/log-analytics-overview.md).

## Next Steps

For supplemental information and updates, subscribe to the
<a href="https://blogs.msdn.microsoft.com/azuregov/">Microsoft Azure Government Blog. </a>
 
