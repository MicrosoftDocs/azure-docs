---
title: Azure Government documentation | Microsoft Docs
description: This provides a comparision of features and guidance on developing applications for Azure Government
services: Azure-Government
cloud: gov
documentationcenter: ''
author: scooxl
manager: zakramer
editor: ''

ms.assetid: 78b0379c-3371-463b-b5b9-3ef2da2f2a5d
ms.service: multiple
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 10/31/2016
ms.author: scooxl

---
# Azure Government Management and Security
## Automation
Automation is generally available in Azure Government.

### Variations
The following Automation features are not currently available in Azure Government:

* Creation of a Service Principle credential for authentication

For more information, see [Automation public documentation](../automation/automation-intro.md).

## Backup
Backup is generally available in Azure Government.

For more information, see [Backup public documentation](../backup/backup-introduction-to-azure-backup.md).

### Variations
The following Backup features are not currently available in Azure Government:

* Azure Resource Manager backup vaults
* Management using the Azure portal (the Azure classic portal is supported)

## Key Vault
For details on this service and how to use it, see the <a href="https://azure.microsoft.com/documentation/services/key-vault">Azure Key Vault public documentation. </a>

### Data Considerations
The following information identifies the Azure Government boundary for Azure Key Vault:

| Regulated/controlled data permitted | Regulated/controlled data not permitted |
| --- | --- |
| All data encrypted with an Azure Key Vault key may contain Regulated/controlled data. |Azure Key Vault metadata is not permitted to contain export controlled data. This metadata includes all configuration data entered when creating and maintaining your Key Vault.  Do not enter Regulated/controlled data into the following fields: Resource group names, Key Vault names, Subscription name |

Key Vault is generally available in Azure Government. As in public, there is no extension, so Key Vault is available through PowerShell and CLI only.

## Log Analytics
Log Analytics is generally available in Azure Government. 

### Variations
The following Log Analytics features and solutions are not currently available in Azure Government. This list is updated when the status of features / solutions changes.

* Solutions that are in preview in public Azure, including:
  * Network Monitoring solution
  * Application Dependency Monitoring
  * Office 365 solution
  * Windows 10 Upgrade Analytics solution
  * Application Insights
  * Azure Networking Analytics solution
  * Azure Automation Analytics
  * Key Vault Analytics
* Solutions and features that require updates to on-premises software, including
  * Integration with System Center Operations Manager 2016 (earlier versions of Operations Manager are supported)
  * Computers Groups from System Center Configuration Manager
  * Surface Hub solution
* Features that are in preview in public Azure, including
  * Export of data to PowerBI
* Azure metrics and Azure diagnostics
* OMS Mobile applications

The URLs for Log Analytics are different in Azure Government:

| Azure Public | Azure Government | Notes |
| --- | --- | --- |
| mms.microsoft.com |oms.microsoft.us |Log Analytics portal |
| *workspaceId*.ods.opinsights.azure.com |*workspaceId*.ods.opinsights.azure.us |[Data collector API](../log-analytics/log-analytics-data-collector-api.md) |
| \*.ods.opinsights.azure.com |\*.ods.opinsights.azure.us |Agent communication - [configuring firewall settings](../log-analytics/log-analytics-proxy-firewall.md) |
| \*.oms.opinsights.azure.com |\*.oms.opinsights.azure.us |Agent communication - [configuring firewall settings](../log-analytics/log-analytics-proxy-firewall.md) |
| \*.blob.core.windows.net |\*.blob.core.usgovcloudapi.net |Agent communication - [configuring firewall settings](../log-analytics/log-analytics-proxy-firewall.md) |

The following Log Analytics features have different behavior in Azure Government:

* The Windows agent must be downloaded from the [Log Analytics portal](https://oms.microsoft.us) for Azure Government.
* To connect your System Center Operations Manager management server to Log Analytics, you need to download and import updated Management Packs.
  1. Download and save the [updated management packs](http://go.microsoft.com/fwlink/?LinkId=828749)
  2. Unzip the file you have downloaded
  3. Import the management packs into Operations Manager. For information about how to import a management pack from a disk, see the [How to Import an Operations Manager Management Pack](http://technet.microsoft.com/library/hh212691.aspx) topic on the Microsoft TechNet website.
  4. To connect Operations Manager to Log Analytics, follow the steps in [Connect Operations Manager to Log Analytics](../log-analytics/log-analytics-om-agents.md) 

### Frequently asked questions
* Can I migrate data from Log Analytics in public Azure to Azure Government?
  * No. It is not possible to move data or your workspace from public Azure to Azure Government.
* Can I switch between public Azure and Azure Government workspaces from the OMS Log Analytics portal?
  * No. The portals for public Azure and Azure Government are separate and do not share information. 

For more information, see [Log Analytics public documentation](../log-analytics/log-analytics-overview.md).

## Site Recovery
Site Recovery is generally available in Azure Government.

For more information, see [Site Recovery public documentation](../site-recovery/site-recovery-overview.md).

### Variations
The following Site Recovery features are not currently available in Azure Government:

* Azure Resource Manager site recovery vaults

## Next Steps
For supplemental information and updates, subscribe to the
<a href="https://blogs.msdn.microsoft.com/azuregov/">Microsoft Azure Government Blog. </a>

