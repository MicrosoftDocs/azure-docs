---
title: What's new in Azure Automation
description: Significant updates to Azure Automation updated each month.
services: automation
ms.subservice:
ms.topic: overview
ms.date: 10/27/2023
ms.custom: references_regions
---

# What's new in Azure Automation?

Azure Automation receives improvements on an ongoing basis. To stay up to date with the most recent developments, this article provides you with information about:

- The latest releases
- New features
- Improvements to existing features
- Known issues
- Bug fixes


This page is updated monthly, so revisit it regularly. If you're looking for items older than six months, you can find them in [Archive for What's new in Azure Automation](whats-new-archive.md).

## October 2023


## General Availability: Automation extension for Visual Studio Code

 Azure Automation now provides an advanced editing experience for PowerShell and Python scripts along with [runbook management operations](how-to/runbook-authoring-extension-for-vscode.md). For more information, see the [Key features and limitations](automation-runbook-authoring.md).


### General Availability: Change Tracking using Azure Monitoring Agent

Azure Automation announces General Availability of Change Tracking using Azure Monitoring Agent. [Learn more](change-tracking/guidance-migration-log-analytics-monitoring-agent.md).


### Retirement of Run As accounts

**Type: Retirement**

Azure Automation Run As Accounts, including Classic Run as accounts have retired on **30 September 2023** and replaced with Managed Identities. You would no longer be able to create or renew Run as accounts through the Azure portal. For more information, see [migrating from an existing Run As accounts to managed identity](migrate-run-as-accounts-managed-identity.md).

## May 2023

### General Availability: Python 3.8 runbooks

Azure Automation announces General Availability of Python 3.8 runbooks. Learn more about Azure Automation [Runbooks](automation-runbook-types.md) and [Python packages](python-3-packages.md).

## April 2023

### Public preview update: Azure Automation supports PowerShell 7.2 and Python 3.10 runbooks

Azure Automation has expanded Public preview support for PowerShell 7.2 and Python 3.10 runbooks in almost all [Public regions](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=automation) except Australia Central2, Korea South, Sweden South, Jio India Central, Brazil Southeast, Central India, West India, UAE Central and Gov clouds. These new runtimes are now supported for both Cloud and Hybrid jobs. Learn more about [PowerShell 7.2 and Python 3.10 runbooks](automation-runbook-types.md) and [execution of Hybrid jobs](automation-hrw-run-runbooks.md#service-accounts) on new runtime versions.

## March 2023

### Retirement of Azure Automation Agent-based User Hybrid Runbook Worker 

**Type:** Plan for change

On **31 August 2024**, Azure Automation will [retire](https://azure.microsoft.com/updates/retirement-azure-automation-agent-user-hybrid-worker/) Agent-based User Hybrid Runbook Worker ([Windows](automation-windows-hrw-install.md) and [Linux](automation-linux-hrw-install.md)). You must migrate all Agent-based User Hybrid Workers to [Extension-based User Hybrid Runbook Worker](extension-based-hybrid-runbook-worker-install.md) (Windows and Linux) before the deprecation date. Moreover, starting **1 November 2023**, creating **new** Agent-based User Hybrid Runbook Worker will not be possible. [Learn more](migrate-existing-agent-based-hybrid-worker-to-extension-based-workers.md).


## January 2023

### Public Preview of Automation extension for Visual Studio Code

 Azure Automation now provides an [extension from VS Code](https://marketplace.visualstudio.com/items?itemName=azure-automation.vscode-azureautomation&ssr=false#overview) that allows you to create and manage runbooks. For more information, see the [Key features and limitations](automation-runbook-authoring.md) and [runbook management operations](how-to/runbook-authoring-extension-for-vscode.md).


## November 2022

### General Availability: Azure Automation User Hybrid Runbook Worker Extension 

User Hybrid Worker enables execution of the scripts directly on the machines for managing guest workloads or as a gateway to environments that are not accessible from Azure. Azure Automation announces **General Availability of User Hybrid Worker extension**, that is based on Virtual Machine extensions framework and provides a **seamless and integrated** installation experience. It is supported for Windows & Linux Azure VMs and [Azure Arc-enabled Servers](../azure-arc/servers/overview.md). It is also available for [Azure Arc-enabled VMware vSphere VMs](../azure-arc/vmware-vsphere/overview.md) in preview.


## October 2022

### Public preview of PowerShell 7.2 and Python 3.10

Azure Automation now supports runbooks in latest Runtime versions - PowerShell 7.2 and Python 3.10 in public preview. This enables creation and execution of runbooks for orchestration of management tasks. These new runtimes are currently supported only for Cloud jobs in five regions - West Central US, East US, South Africa North, North Europe, Australia, and Southeast. [Learn more](automation-runbook-types.md).

### Guidance for Disaster Recovery of Azure Automation account

Set up disaster recovery for your Automation accounts to handle a region-wide or zone-wide failure. [Learn more](automation-disaster-recovery.md).


## September 2022

### Availability zones support for Azure Automation

Azure Automation now supports [Azure availability zones](../reliability/availability-zones-overview.md#zonal-and-zone-redundant-services) to provide improved resiliency and reliability by providing high availability to the service, runbooks, and other Automation assets. [Learn more](automation-availability-zones.md).


## July 2022

### Support for Run As accounts

**Type:** Plan for change


Azure Automation Run As Account will retire on September 30, 2023 and will be replaced with Managed Identities.Before that date, you'll need to start migrating your runbooks to use [managed identities](automation-security-overview.md#managed-identities). For more information, see [migrating from an existing Run As accounts to managed identity](migrate-run-as-accounts-managed-identity.md?tabs=run-as-account#sample-scripts) to start migrating the runbooks from Run As account to managed identities before 30 September 2023.

## August 2022

### Azure Automation Hybrid Worker Extension (preview) now supports Arc-enabled VMware VMs

**Type:** Enhancement to an existing feature

In addition to the support for Azure VMs and Arc-enabled Servers, Azure Automation Hybrid Worker Extension (preview) now supports Arc-enabled VMware VMs as a target. You can now orchestrate management tasks using PowerShell and Python runbooks on Azure VMs, Arc-enabled Servers, and Arc-enabled VMware VMs with an identical experience. Read [here](extension-based-hybrid-runbook-worker-install.md) for more information.


## March 2022

###  Forward diagnostic audit data to Azure Monitor logs

**Type:** New feature

Azure Automation can send diagnostic audit logs in addition to runbook job status and job streams to your Log Analytics workspace. Read [here](automation-manage-send-joblogs-log-analytics.md) for more information.

## February 2022

### Permissions change in the built-in Reader role for the Automation Account.

**Type:** New change

To strengthen the overall Azure Automation security posture, the built-in RBAC Reader role would not have access to Automation account keys through the API call - `GET /automationAccounts/agentRegistrationInformation`. Read [here](./automation-role-based-access-control.md#reader) for more information.


### Restore deleted Automation Accounts

**Type:** New change

Users can now restore an Automation account deleted within 30 days. Read [here](./delete-account.md?tabs=azure-portal#restore-a-deleted-automation-account) for more information.


## December 2021

### New scripts added for Azure VM management based on Azure Monitor Alert

**Type:** New feature

New scripts are added to the Azure Automation [GitHub organization](https://github.com/azureautomation) to address one of Azure Automation's key scenarios of VM management based on Azure Monitor alert. For more information, see [Trigger runbook from Azure alert](./automation-create-alert-triggered-runbook.md#common-azure-vm-management-operations).

- [Stop-Azure-VM-On-Alert](https://github.com/azureautomation/Stop-Azure-VM-On-Alert)
- [Restart-Azure-VM-On-Alert](https://github.com/azureautomation/Restart-Azure-VM-On-Alert)
- [Delete-Azure-VM-On-Alert](https://github.com/azureautomation/Delete-Azure-VM-On-Alert)
- [ScaleDown-Azure-VM-On-Alert](https://github.com/azureautomation/ScaleDown-Azure-VM-On-Alert)
- [ScaleUp-Azure-VM-On-Alert](https://github.com/azureautomation/ScaleUp-Azure-VM-On-Alert)

## November 2021

### General Availability of Managed Identity for Azure Automation

**Type:** New feature

Azure Automation now supports Managed Identities in Azure public, Azure Gov, and Microsoft Azure operated by 21Vianet. [System Assigned Managed Identities](./enable-managed-identity-for-automation.md) is supported for cloud as well as hybrid jobs, while  [User Assigned Managed Identities](./automation-security-overview.md) is supported only for cloud jobs. Read the [announcement](https://azure.microsoft.com/updates/azure-automation-managed-identities-ga/) for more information.

### Preview support for PowerShell 7.1

**Type:** New feature

Azure Automation support for PowerShell 7.1 runbooks is available as public preview in Azure public, Azure Gov, and  Azure operated by 21Vianet clouds. Read the [announcement](https://azure.microsoft.com/updates/azure-automation-powershell-7/) for more information.



## October 2021

### Preview support for Hybrid Runbook Worker extension for Azure VMs and Arc-enabled servers

**Type:** New feature

Azure Automation released native integration of User Hybrid Runbook Worker for Azure VMs, and for non-Azure machines through Arc-enabled servers. Read the [announcement](https://azure.microsoft.com/updates/automation-user-hybrid-extension-support) for more information.

### Preview support for Azure Active Directory authentication

**Type:** New feature

Azure Automation added a critical security feature with Azure AD authentication support for all Automation service public endpoints. The feature has been implemented through Hybrid Runbook Worker extension support for Azure VMs and Arc-enabled servers.

This removes the dependency on certificates and enables you to meet your stringent audit and compliance requirements by not using local authentication methods. Read the [announcement](https://azure.microsoft.com/updates/automation-user-hybrid-extension-support) for more information.

### Source control enabled to use managed identities

**Type:** New feature

Source control integration in Azure Automation can now use [managed identities](automation-security-overview.md#managed-identities) instead of a Run As account. For more information, see [source control integration prerequisites](source-control-integration.md#prerequisites).

## September

### Support for Az modules by default

**Type:** New Feature

Azure Automation now supports Az modules by default. New Automation accounts created include the latest version of Az modules - 6.4.0 by default. Automation also includes an option in the Azure portal - **Update Az Modules** enabling you to update Az modules in your existing Automation accounts. Read the [announcement](https://azure.microsoft.com/updates/azure-automation-az-module-support) for more information.

## August 2021

### Azure Policy Guest Configuration

**Type:** Plan for change

Customers should evaluate and plan for migration from Azure Automation State Configuration to Azure Policy guest configuration. For more information, see [Azure Policy guest configuration](../governance/machine-configuration/overview.md).

## July 2021

### Preview support for user-assigned managed identity

**Type:** New feature

Azure Automation now supports [user-assigned Managed Identities](automation-secure-asset-encryption.md) for cloud jobs in Azure global, Azure Government, and  Azure operated by 21Vianet regions. Read the [announcement](https://azure.microsoft.com/updates/azure-automation-user-assigned-identities/) for more information.

### General Availability of customer-managed keys for Azure Automation

**Type:** New feature

Customers can manage and secure encryption of Azure Automation assets using their own managed keys. With the introduction of customer-managed keys, you can supplement default encryption with an extra encryption layer using keys that you create and manage in Azure Key Vault. This additional level of encryption should help you meet your organization’s regulatory or compliance needs.

For more information, see [Use of customer-managed keys](automation-secure-asset-encryption.md#use-of-customer-managed-keys-for-an-automation-account).

## June 2021

### Security update for Log Analytics Contributor role

**Type:** Plan for change

Microsoft intends to remove the Automation account rights from the Log Analytics Contributor role. Currently, the built-in [Log Analytics Contributor](./automation-role-based-access-control.md#log-analytics-contributor) role can escalate privileges to the subscription [Contributor](./../role-based-access-control/built-in-roles.md#contributor) role. Since Automation account Run As accounts are initially configured with Contributor rights on the subscription, it can be used by an attacker to create new runbooks and execute code as a Contributor on the subscription.

As a result of this security risk, we recommend you don't use the Log Analytics Contributor role to execute Automation jobs. Instead, create the Azure Automation Contributor custom role and use it for actions related to the Automation account.

### Support for Automation and State Configuration available in West US 3

**Type:** New feature

For more information, see [Data residency in Azure](https://azure.microsoft.com/global-infrastructure/data-residency/) and select your geography from the drop-down list.

## May 2021

### Start/Stop VMs during off-hours (v1)

**Type:** Plan for change

Start/Stop VMs during off-hours (v1) will deprecate on May 21, 2022. Customers should evaluate and plan for migration to the Start/Stop VMs v2 (preview). For more information, see [Start/Stop v2 overview](../azure-functions/start-stop-vms/overview.md) (preview).

## April 2021

### Support for Update Management and Change Tracking

**Type:** New feature

Region mapping has been updated to support Update Management and Change Tracking in Norway East, UAE North, North Central US, Brazil South, and Korea Central. For more information, see [Supported mappings](./how-to/region-mappings.md#supported-mappings-for-log-analytics-and-azure-automation).

### Support for system-assigned Managed Identities

**Type:** New feature

Azure Automation now supports [system-assigned managed identities](./automation-security-overview.md#managed-identities) for cloud and hybrid jobs in Azure global and Azure Government regions. Read the [announcement](https://azure.microsoft.com/updates/azure-automation-system-assigned-managed-identities/) for more information.

## Next steps

If you'd like to contribute to Azure Automation documentation, see our [contributor guide](/contribute/).
