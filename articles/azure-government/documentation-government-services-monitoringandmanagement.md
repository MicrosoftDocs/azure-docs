<properties
	pageTitle="Azure Government documentation | Microsoft Azure"
	description="This provides a comparison of features and guidance on developing applications for Azure Government."
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
	ms.date="10/25/2016"
	ms.author="ryansoc"/>


#  Azure Government monitoring and management

This article outlines the monitoring and management services variations and considerations for the Azure Government environment.

## Automation

Automation is generally available in Azure Government.

### Variations

The following Automation features are not currently available in Azure Government.

+ Creation of a Service Principle credential for authentication

For more information, see [Automation public documentation](../automation/automation-intro.md).

## Log Analytics

Log Analytics is generally available in Azure Government.

### Variations

The following Log Analytics features and solutions are not currently available in Azure Government.

+ Solutions that are in preview in Microsoft Azure, including:
  - Network Monitoring solution
  - Application Dependency Monitoring solution
  - Office 365 solution
  - Windows 10 Upgrade Analytics solution
  - Application Insights solution
  - Azure Networking Analytics solution
  - Azure Automation Analytics solution
  - Key Vault Analytics solution
+ Solutions and features that require updates to on-premises software, including:
  - Integration with System Center Operations Manager 2016 (earlier versions of Operations Manager are supported)
  - Computers groups from System Center Configuration Manager
  - Surface Hub solution
+ Features that are in preview in public Azure, including:
  - Export of data to Power BI
+ Azure metrics and Azure diagnostics
+ Operations Management Suite mobile applications

The URLs for Log Analytics are different in Azure Government:

| Azure Public | Azure Government | Notes |
|--------------|------------------|-------|
| mms.microsoft.com | oms.microsoft.us | Log Analytics portal |
| *workspaceId*.ods.opinsights.azure.com | *workspaceId*.ods.opinsights.azure.us | [Data collector API](../log-analytics/log-analytics-data-collector-api.md) 
| \*.ods.opinsights.azure.com | \*.ods.opinsights.azure.us | Agent communication - [configuring firewall settings](../log-analytics/log-analytics-proxy-firewall.md) |
| \*.oms.opinsights.azure.com | \*.oms.opinsights.azure.us | Agent communication - [configuring firewall settings](../log-analytics/log-analytics-proxy-firewall.md) |
| \*.blob.core.windows.net | \*.blob.core.usgovcloudapi.net | Agent communication - [configuring firewall settings](../log-analytics/log-analytics-proxy-firewall.md) |


The following Log Analytics features behave differently in Azure Government:

+ The Windows Agent must be downloaded from the [Log Analytics portal](https://oms.microsoft.us) for Azure Government.
+ To connect your System Center Operations Manager management server to Log Analytics, you need to download and import updated management packs.
  1. Download and save the [updated management packs](http://go.microsoft.com/fwlink/?LinkId=828749).
  2. Unzip the file that you downloaded.
  3. Import the management packs into Operations Manager. For information about how to import a management pack from a disk, see [How to Import an Operations Manager Management Pack](http://technet.microsoft.com/library/hh212691.aspx) on the Microsoft TechNet website.
  4. To connect Operations Manager to Log Analytics, follow the steps in [Connect Operations Manager to Log Analytics](../log-analytics/log-analytics-om-agents.md).


## Frequently asked questions

+ Can I migrate data from Log Analytics in Microsoft Azure to Azure Government?
  - No. It is not possible to move data or your workspace from Microsoft Azure to Azure Government.
+ Can I switch between Microsoft Azure and Azure Government workspaces from the Operations Management Suite Log Analytics portal?
  - No. The portals for Microsoft Azure and Azure Government are separate and do not share information.

For more information, see [Log Analytics public documentation](../log-analytics/log-analytics-overview.md).

## Next steps

For supplemental information and updates, subscribe to the
<a href="https://blogs.msdn.microsoft.com/azuregov/">Microsoft Azure Government Blog. </a>
