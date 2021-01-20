---
title: What's new in Azure Automation
description: Significant updates to Azure Automation updated each month.
ms.subservice: 
ms.topic: overview
author: mgoedtel
ms.author: magoedte
ms.date: 01/19/2021
---

# What's new in Azure Automation?

Azure Automation receives improvements on an ongoing basis. To stay up to date with the most recent developments, this article provides you with information about:

- The latest releases
- Known issues
- Bug fixes

This page is updated monthly, so revisit it regularly.

## January 2021

### General

Azure Automation runbooks moved from TechNet Script Center to GitHub.  The TechNet Script Center is retiring and all runbooks hosted in the Runbook gallery have been moved to our [Automation GitHub organization](https://github.com/azureautomation). For more information, read [Azure Automation Runbooks moving to GitHub](https://techcommunity.microsoft.com/t5/azure-governance-and-management/azure-automation-runbooks-moving-to-github/ba-p/2039337).

## December 2020

### General

* Azure Automation & Update Management Private Link support announced as GA for Azure global & Government clouds. Azure Automation enabled Private Link support to secure execution of a runbook on a hybrid worker role, using Update Management to patch machines, invoking a runbook through a webhook, and using State Configuration service to keep your machines complaint. For more information, read [Azure Automation Private Link support](https://azure.microsoft.com/updates/azure-automation-private-link)

* Azure Automation classified as Grade-C certified on Accessibility. Accessibility features of Microsoft products help agencies address global accessibility requirements. On the [blog announcement](https://cloudblogs.microsoft.com/industry-blog/government/2018/09/11/accessibility-conformance-reports/) page, search for **Azure Automation** to read the Accessibility conformance report for the Automation service.

 * [Support for Automation and State Configuration declared GA in UAE North](https://azure.microsoft.com/updates/azure-automation-in-uae-north-region/). Automation account and State Configuration availability in the UAE North region. 

* [Support for Automation and State Configuration declared GA in Germany West Central](https://azure.microsoft.com/updates/azure-automation-in-germany-west-central-region/). Automation account and State Configuration availability in Germany West region.

* Announced DSC support for Oracle 6 and 7. Manage Oracle Linux 6 and 7 machines with Automation State Configuration. See [Supported Linux distros](https://github.com/Azure/azure-linux-extensions/tree/master/DSC#4-supported-linux-distributions) for updates to the documentation to reflect these changes.

### New feature

 * Announced Public Preview for Python3 runbooks in Automation. Azure Automation now supports Python 3 cloud & hybrid runbook execution in public preview in all regions in Azure global cloud. See the [announcement]((https://azure.microsoft.com/updates/azure-automation-python-3-public-preview/) more details.

## November 2020

### New feature

* Announced DSC support for Ubuntu 18.04. See [Suported Linux Distros](https://github.com/Azure/azure-linux-extensions/tree/master/DSC#4-supported-linux-distributions) for updates to the documentation to reflect these changes.

## October 2020

### General

* [Support for Automation and State Configuration declared GA in Switzerland North](https://azure.microsoft.com/updates/azure-automation-in-switzerland-north-region/). Automation account and State Configuration availability in Switzerland North.  

* [Support for Automation and State Configuration declared GA in Brazil South East](https://azure.microsoft.com/updates/azure-automation-in-brazil-southeast-region/). Automation account and State Configuration availability in Brazil South East.  

* [Announced Update Management availability in South Central US](how-to/region-mappings.md#supported-mappings) Region mapping updated to support Update Management in South Central US region.

## September 2020

### General

* Updated runbooks used by Start/Stop VMs during off-hours to use Azure Az modules. Start/Stop VM runbooks have been updated to use Az modules in place of Azure Resource Manager modules. See [Start/Stop VMs during off-hours](automation-solution-vm-management.md) overview for updates to the documentation to reflect these changes.

## August 2020

### New feature

* Published the DSC extension to support Azure Arc. Use Azure Automation State Configuration to centrally store configurations and maintain the desired state of hybrid connected machines enabled through the Azure Arc enabled servers DSC VM extension. For more information, read [Arc enabled servers VM extensions overview](../azure-arc/servers/manage-vm-extensions.md).

## General

* Microsoft announced as a leader in The Forrester Wave:  Infrastructure Automation Platforms, Q3 2020. Forrester research has named Azure Automation as a leader in the Infrastructure Automation Platform based on their evaluation of the Automation service against competitors like Red Hat, Puppet, Cisco, VMWare etc. The report can be found [here](https://reprints2.forrester.com/#/assets/2/108/RES157471/report).

### July 2020

### General

* Introduced Public Preview of Private Link support in Automation. Use Azure Private Link to securely connect virtual networks to Azure Automation using private endpoints. For more information, read the [announcement](https://azure.microsoft.com/updates/public-preview-private-link-azure-automation-is-now-available/).

* Announced Hybrid Runbook Worker support for Windows Server 2008 R2. Automation Hybrid Runbook Worker supports the Windows Server 2008 R2 operating system. See [Supported operating systems](automation-windows-hrw-install,.md#supported-windows-operating-system) for updates to the documentation to reflect these changes.

* Announced Update Management support for Windows Server 2008 R2. Update Management supports assessing and patching the Windows Server 2008 R2 operating system. See [Supported operating systems](update-management/overview.md#clients) for updates to the documentation to reflect these changes.

* Automation diagnostic logs schema update. Changed the  schema of Azure Automation log data in the Log Analytics service. To learn more, see [Forward Azure Automation job data to Azure Monitor logs](automation-manage-send-joblogs-log-analytics.md#filter-job-status-output-converted-into-a-json-object).

* Announced Azure Lighthouse supports Automation Update Management. Azure Lighthouse enables delegated resource management with Update Management for service providers and customers. Read more [here](https://azure.microsoft.com/blog/how-azure-lighthouse-enables-management-at-scale-for-service-providers/).

## June 2020

### General

* [Automation & Update Management availability in the US Gov Arizona region declared GA](https://azure.microsoft.com/updates/azure-automation-generally-available-in-usgov-arizona-region/). Process Automation and patching through Update Management available in US Gov Arizona.

* Updated version of script to onboard a machine as Hybrid Runbook Worker updated to use Az modules. The New-OnPremiseHybridWorker runbook has been updated to support Az modules. For more information, see the package in the [PowerShell Gallery](https://www.powershellgallery.com/packages/New-OnPremiseHybridWorker/1.7).

* [Announced Update Management availability in China East 2](how-to/region-mappings.md#supported-mappings). Region mapping updated to support Update Management in China East 2 region.

## May 2020

### New feature

* Updated Automation service DNS records from region-specific to Automation account-specific URLs. Azure Automation DNS records have been updated to support Private Links. For more information, read the [announcement](https://azure.microsoft.com/updates/azure-automation-updateddns-records/).

* Added capability to keep Automation runbooks & DSC scripts encrypted by default. In addition to the secure assets, now runbooks & DSC scripts are also encrypted to enhance Azure Automation security.

## April 2020

### Plan for change

Announced retirement of the Automation watcher task. Azure Logic Apps is now the recommended and supported way to monitor for events, schedule recurring tasks, and trigger actions. There will be no further investments in Watcher task functionality. To learn more, see [Schedule and run recurring automated tasks with Logic Apps](../logic-apps/concepts-schedule-automated-recurring-tasks-workflows.md).

## March 2020

### New feature

Support for Impact Level 5 (IL5) compute isolation in Azure commercial & Government cloud. Azure Automation Hybrid Runbook Worker can be used in Azure Government to support Impact Level 5 workloads. To learn more, see our [documentation](automation-hybrid-runbook-worker.md#support-for-impact-level-5-il5).

## February 2020

### New feature

* Introduced support for Azure virtual network service tags. Automation support of service tags allow or deny the traffic for the Automation service, for a subset of scenarios. To learn more, see the [documentation](automation-hybrid-runbook-worker.md#service-tags).

### Plan for change

* Enabled TLS 1.2 support for Azure Automation service: Azure Automation fully supports TLS 1.2 and all client calls (through webhooks, DSC nodes, and hybrid worker). TLS 1.1 and TLS 1.0 are still supported for backward compatibility with older clients until customers standardize and fully migrate to TLS 1.2.

## January 2020

### New feature

Introduced Public Preview of customer-managed keys for Azure Automation. Customers can manage and secure encryption of Azure Automation assets using their own managed keys. For more information, see [Use of customer-managed keys](automation-secure-asset-encryption.md#use-of-customer-managed-keys-for-an-automation-account).

### Retire
 
Announced retirement of Azure Service Management (ASM) REST APIs for Azure Automation. Azure Service Management (ASM) REST APIs for Azure Automation will be retired and no longer supported after 30th January 2020. To learn more, see the [announcement](https://azure.microsoft.com/updates/azure-automation-service-management-rest-apis-are-being-retired-april-30-2019/).

## Next steps

- If you'd like to contribute to Azure Automation documentation, see the [Docs Contributor Guide](/contribute/).