---
title: Archive for What's new in Azure Automation
description: The What's new release notes in the Overview section of this content set contains 6 months of activity. After 6 months, the items are removed from the main article and put into this archive article.
services: automation
ms.topic: overview
ms.date: 08/12/2021
ms.custom: references_regions
---

# Archive for What's new in Azure Automation?

The primary [What's new in Azure Automation?](whats-new.md) article contains updates for the last six months, while this article contains all the older information.

What's new in Azure Automation? provides you with information about:

- The latest releases
- Known issues
- Bug fixes

---

## January 2021

### Support for Automation and State Configuration declared GA in Switzerland West

**Type:** New feature

Automation account and State Configuration availability in the Switzerland West region. For more information, read the [announcement](https://azure.microsoft.com/updates/azure-automation-in-switzerland-west-region/).

### Added Python 3 script to import module with multiple dependencies

**Type:** New feature

The script is available for download from our [GitHub repository](https://github.com/azureautomation/runbooks/blob/master/Utility/Python/import_py3package_from_pypi.py). 
 
### Hybrid Runbook Worker role support for Centos 8.x/RHEL 8.x/SLES 15

**Type.** New feature

The Hybrid Runbook Worker feature supports CentOS 8.x, REHL 8.x, and SLES 15 distributions for only process automation on Hybrid Runbook Workers. See [Supported operating systems](automation-linux-hrw-install.md#supported-linux-operating-systems) for updates to the documentation to reflect these changes.

### Update Management and Change Tracking availability in Australia East, East Asia, West US, and Central US regions

**Type:** New feature

Automation account, Change Tracking and Inventory, and Update Management are available in Australia East, East Asia, West US, and Central US regions. 

### Introduced public preview of Python 3 runbooks in US Government cloud

**Type:** New feature
Azure Automation introduces public preview support of Python 3 cloud and hybrid runbook execution in US Government cloud regions. For more information, see the [announcement](https://azure.microsoft.com/updates/azure-automation-python-3-public-preview/).

### Azure Automation runbooks moved from TechNet Script Center to GitHub

**Type:** Plan for change

The TechNet Script Center is retiring and all runbooks hosted in the Runbook gallery have been moved to our [Automation GitHub organization](https://github.com/azureautomation). For more information, read [Azure Automation Runbooks moving to GitHub](https://techcommunity.microsoft.com/t5/azure-governance-and-management/azure-automation-runbooks-moving-to-github/ba-p/2039337).

## December 2020

### Azure Automation and Update Management Private Link GA

**Type:** New feature

Azure Automation and Update Management support announced as GA for Azure global and Government clouds. Azure Automation enabled Private Link support to secure execution of a runbook on a hybrid worker role, using Update Management to patch machines, invoking a runbook through a webhook, and using State Configuration service to keep your machines complaint. For more information, read [Azure Automation Private Link support](https://azure.microsoft.com/updates/azure-automation-private-link)

### Azure Automation classified as Grade-C certified on Accessibility

**Type:** New feature

Accessibility features of Microsoft products help agencies address global accessibility requirements. On the [blog announcement](https://cloudblogs.microsoft.com/industry-blog/government/2018/09/11/accessibility-conformance-reports/) page, search for **Azure Automation** to read the Accessibility conformance report for the Automation service.

### Support for Automation and State Configuration GA in UAE North

**Type:** New feature

Automation account and State Configuration availability in the UAE North region. For more information, read [announcement](https://azure.microsoft.com/updates/azure-automation-in-uae-north-region/).

### Support for Automation and State Configuration GA in Germany West Central

**Type:** New feature

Automation account and State Configuration availability in Germany West region. For more information, read [announcement](https://azure.microsoft.com/updates/azure-automation-in-germany-west-central-region/).

### DSC support for Oracle 6 and 7

**Type:** New feature

Manage Oracle Linux 6 and 7 machines with Automation State Configuration. See [Supported Linux distros](https://github.com/Azure/azure-linux-extensions/tree/master/DSC#4-supported-linux-distributions) for updates to the documentation to reflect these changes.

### Public Preview for Python3 runbooks in Automation

**Type:** New feature

Azure Automation now supports Python 3 cloud and hybrid runbook execution in public preview in all regions in Azure global cloud. For more information, see the [announcement]((https://azure.microsoft.com/updates/azure-automation-python-3-public-preview/).

## November 2020

### DSC support for Ubuntu 18.04

**Type:** New feature

See [Supported Linux Distros](https://github.com/Azure/azure-linux-extensions/tree/master/DSC#4-supported-linux-distributions) for updates to the documentation reflecting these changes.

## October 2020

### Support for Automation and State Configuration GA in Switzerland North

**Type:** New feature

Automation account and State Configuration availability in Switzerland North. For more information, read [announcement](https://azure.microsoft.com/updates/azure-automation-in-switzerland-north-region/).

### Support for Automation and State Configuration GA in Brazil South East

**Type:** New feature

Automation account and State Configuration availability in Brazil South East. For more information, read [announcement](https://azure.microsoft.com/updates/azure-automation-in-brazil-southeast-region/).

### Update Management availability in South Central US

**Type:** New feature

Azure Automation region mapping updated to support Update Management feature in South Central US region. See [Supported region mapping](how-to/region-mappings.md#supported-mappings) for updates to the documentation to reflect this change.

## September 2020

### Start/Stop VMs during off-hours runbooks updated to use Azure Az modules

**Type:** New feature

Start/Stop VM runbooks have been updated to use Az modules in place of Azure Resource Manager modules. See [Start/Stop VMs during off-hours](automation-solution-vm-management.md) overview for updates to the documentation to reflect these changes.

## August 2020

### Published the DSC extension to support Azure Arc

**Type:** New feature

Use Azure Automation State Configuration to centrally store configurations and maintain the desired state of hybrid connected machines enabled through the Azure Arc enabled servers DSC VM extension. For more information, read [Arc enabled servers VM extensions overview](../azure-arc/servers/manage-vm-extensions.md).

### July 2020

### Introduced Public Preview of Private Link support in Automation

**Type:** New feature

Use Azure Private Link to securely connect virtual networks to Azure Automation using private endpoints. For more information, read the [announcement](https://azure.microsoft.com/updates/public-preview-private-link-azure-automation-is-now-available/).

### Hybrid Runbook Worker support for Windows Server 2008 R2

**Type:** New feature

Automation Hybrid Runbook Worker supports the Windows Server 2008 R2 operating system. See [Supported operating systems](automation-windows-hrw-install.md#supported-windows-operating-system) for updates to the documentation to reflect these changes.

### Update Management support for Windows Server 2008 R2

**Type:** New feature

Update Management supports assessing and patching the Windows Server 2008 R2 operating system. See [Supported operating systems](update-management/operating-system-requirements.md) for updates to the documentation to reflect these changes.

### Automation diagnostic logs schema update

**Type:** New feature

Changed the schema of Azure Automation log data in the Log Analytics service. To learn more, see [Forward Azure Automation job data to Azure Monitor logs](automation-manage-send-joblogs-log-analytics.md#filter-job-status-output-converted-into-a-json-object).

### Azure Lighthouse supports Automation Update Management

**Type:** New feature

Azure Lighthouse enables delegated resource management with Update Management for service providers and customers. Read more [here](https://azure.microsoft.com/blog/how-azure-lighthouse-enables-management-at-scale-for-service-providers/).

## June 2020

### Automation and Update Management availability in the US Gov Arizona region

**Type:** New feature

Automation account and Update Management are available in US Gov Arizona. For more information, see [announcement](https://azure.microsoft.com/updates/azure-automation-generally-available-in-usgov-arizona-region/).

### Hybrid Runbook Worker onboarding script updated to use Az modules

**Type:** New feature

The New-OnPremiseHybridWorker runbook has been updated to support Az modules. For more information, see the package in the [PowerShell Gallery](https://www.powershellgallery.com/packages/New-OnPremiseHybridWorker/1.7).

### Update Management availability in China East 2

**Type:** New feature

Azure Automation region mapping updated to support Update Management feature in China East 2 region. See [Supported region mapping](how-to/region-mappings.md#supported-mappings) for updates to the documentation to reflect this change.

## May 2020

### Updated Automation service DNS records from region-specific to Automation account-specific URLs

**Type:** New feature

Azure Automation DNS records have been updated to support Private Links. For more information, read the [announcement](https://azure.microsoft.com/updates/azure-automation-updateddns-records/).

### Added capability to keep Automation runbooks and DSC scripts encrypted by default

**Type:** New feature

In addition to improve security of assets, runbooks, and DSC scripts are also encrypted to enhance Azure Automation security.

## April 2020

### Retirement of the Automation watcher task

**Type:** Plan for change

Azure Logic Apps is now the recommended and supported way to monitor for events, schedule recurring tasks, and trigger actions. There will be no further investments in Watcher task functionality. To learn more, see [Schedule and run recurring automated tasks with Logic Apps](../logic-apps/concepts-schedule-automated-recurring-tasks-workflows.md).

## March 2020

### Support for Impact Level 5 (IL5) compute isolation in Azure commercial and Government cloud

**Type:**

Azure Automation Hybrid Runbook Worker can be used in Azure Government to support Impact Level 5 workloads. To learn more, see our [documentation](automation-hybrid-runbook-worker.md#support-for-impact-level-5-il5).

## February 2020

### Introduced support for Azure virtual network service tags

**Type:** New feature

Automation support of service tags allows or denies the traffic for the Automation service, for a subset of scenarios. To learn more, see the [documentation](automation-hybrid-runbook-worker.md#service-tags).

### Enable TLS 1.2 support for Azure Automation service

**Type:** Plan for change

Azure Automation fully supports TLS 1.2 and all client calls (through webhooks, DSC nodes, and hybrid worker). TLS 1.1 and TLS 1.0 are still supported for backward compatibility with older clients until customers standardize and fully migrate to TLS 1.2.

## January 2020

### Introduced Public Preview of customer-managed keys for Azure Automation

**Type:** New feature

Customers can manage and secure encryption of Azure Automation assets using their own managed keys. For more information, see [Use of customer-managed keys](automation-secure-asset-encryption.md#use-of-customer-managed-keys-for-an-automation-account).

### Retirement of Azure Service Management (ASM) REST APIs for Azure Automation

**Type:** Retire

Azure Service Management (ASM) REST APIs for Azure Automation will be retired and no longer supported after January 30, 2020. To learn more, see the [announcement](https://azure.microsoft.com/updates/azure-automation-service-management-rest-apis-are-being-retired-april-30-2019/).

## Next steps

If you'd like to contribute to Azure Automation documentation, see the [Docs Contributor Guide](/contribute/).
