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
	ms.date="08/25/2016"
	ms.author="ryansoc"/>


#  Azure Government Management and Security

##  Key Vault

The following information identifies the Azure Government boundary for Azure Key Vault:

| Regulated/controlled data permitted | Regulated/controlled data not permitted |
|--------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| All data encrypted with an Azure Key Vault key may contain Regulated/controlled data. | Azure Key Vault metadata is not permitted to contain export controlled data. This metadata includes all configuration data entered when creating and maintaining your Key Vault.  Do not enter Regulated/controlled data into the following fields: Resource group names, Key Vault names, Subscription name |

Key Vault is generally available in Azure Government. Just as in public, there is no extension, so Key Vault is available through PowerShell and CLI only.

For additional information, please see the [Azure Key Vault public documentation](/key-vault-get-started).

## Log Analytics

Log Analytics is in preview in Azure Government. 

### Differences from public Azure

The following Log Analytics features and solutions are not currently available in Azure Government. This list will be updated when the status of features / solutions changes.

+ Near real-time metrics
  - When viewing metric graphs with a time range of less than 6 hours, the graph will not automatically update with new metric values
+ Export of data to PowerBI
+ Network Monitoring solution
+ Office 365 solution
+ Windows 10 Upgrade Analytics solution
+ Application Dependency Monitoring
+ Update Assessment
+ Azure portal integration
  - Selecting Azure storage accounts to monitor must be done through PowerShell or resource manager templates
  - Selecting virtual machines to enable the Log Analytics agent must be done through PowerShell or resource manager templates
+ Linux monitoring

For additional information, please see [Log Analytics public documentation](/log-analytics-overview.md).

## Next Steps

For supplemental information and updates please subscribe to the
<a href="https://blogs.msdn.microsoft.com/azuregov/">Microsoft Azure Government Blog. </a>
