---
title: What's new in Azure Automation
description: Significant updates to Azure Automation updated each month.
services: automation
ms.subservice: 
ms.topic: overview
ms.date: 08/12/2021
ms.custom: references_regions
---

# What's new in Azure Automation?

Azure Automation receives improvements on an ongoing basis. To stay up to date with the most recent developments, this article provides you with information about:

- The latest releases
- Known issues
- Bug fixes

This page is updated monthly, so revisit it regularly. If you're looking for items older than six months, you can find them in [Archive for What's new in Azure Automation](whats-new-archive.md).

## July 2021

### Preview Support for User Assigned Managed Identities

**Type:** New feature

Azure Automation now supports [User Assigned Managed Identities](automation-secure-asset-encryption.md) for cloud jobs in Azure public , Gov & China regions. Read the [announcement](https://azure.microsoft.com/updates/azure-automation-user-assigned-identities/) for more information.

### General Availability of customer-managed keys for Azure Automation

**Type:** New feature

Customers can manage and secure encryption of Azure Automation assets using their own managed keys. With the introduction of customer-managed keys you can supplement default encryption with an additional encryption layer using keys that you create and manage in Azure Key Vault. This additional encryption should help you meet your organization’s regulatory or compliance needs.

For more information, see [Use of customer-managed keys](automation-secure-asset-encryption.md#use-of-customer-managed-keys-for-an-automation-account).

## June 2021

### Security update for Log Analytics Contributor role

**Type:** Plan for change

Microsoft intends to remove the Automation account rights from the Log Analytics Contributor role. Currently, the built-in [Log Analytics Contributor](./automation-role-based-access-control.md#log-analytics-contributor) role can escalate privileges to the subscription [Contributor](./../role-based-access-control/built-in-roles.md#contributor) role. Since Automation account Run As accounts are initially configured with Contributor rights on the subscription, it can be used by an attacker to create new runbooks and execute code as a Contributor on the subscription.

As a result of this security risk, we recommend you don't use the Log Analytics Contributor role to execute Automation jobs. Instead, create the Azure Automation Contributor custom role and use it for actions related to the Automation account. For implementation steps, see [Custom Azure Automation Contributor role](./automation-role-based-access-control.md#custom-azure-automation-contributor-role).

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

Region mapping have been updated to support Update Management & Change Tracking in Norway East, UAE North, North Central US, Brazil South, and Korea Central. For more information, see [Supported mappings](./how-to/region-mappings.md#supported-mappings).

### Support for System Assigned Managed Identities

**Type:** New feature

Azure Automation now supports [System Assigned Managed Identities](./automation-security-overview.md#managed-identities-preview) for cloud and Hybrid jobs in Azure public and Gov regions. Read the [announcement](https://azure.microsoft.com/updates/azure-automation-system-assigned-managed-identities/) for more information.

## March 2021

### New Azure Automation built-in policies

**Type:** New feature

Azure Automation has added five new built-in policies:

- Automation accounts should disable public network access,
- Azure Automation accounts should use customer-managed keys to encrypt data at rest
- Configure Azure Automation accounts to disable public network access
- Configure private endpoint connections on Azure Automation accounts
- Private endpoint connections on Automation Accounts should be enabled.

For more information, see [policy reference](./policy-reference.md).

### Support for Automation and State Configuration declared GA in South India

**Type:** New feature

Use Process Automation and State configuration capabilities in South India. Read the [announcement](https://azure.microsoft.com/updates/azure-automation-in-south-india-region/) for more information.

### Support for Automation and State Configuration declared GA in UK West

**Type:** New feature

Use Process Automation and State configuration capabilities in UK West. For more information, read [announcement](https://azure.microsoft.com/updates/azure-automation-in-uk-west-region/).

### Support for Automation and State Configuration declared GA in UAE Central

**Type:** New feature

Use Process Automation and State configuration capabilities in UAE Central. Read the [announcement](https://azure.microsoft.com/updates/azure-automation-in-uae-central-region/) for more information.

### Support for Automation and State Configuration available in Australia Central 2, Norway West, and France South

**Type:** New feature

See more information on the [Data residency page](https://azure.microsoft.com/global-infrastructure/data-residency/) by selecting the geography for each region.

### New scripts added for installing Hybrid worker on Windows and Linux

**Type:** New feature

Two new scripts have been added to the Azure Automation [GitHub repository](https://github.com/azureautomation) addressing one of Azure Automation's key scenarios of setting up a Hybrid Runbook Worker on either a Windows or a Linux machine. The script creates a new VM or uses an existing one, creates a Log Analytics workspace if needed, installs the Log Analytics agent for Windows or Log Analytics agent for Linux, and registers the machine to the Log Analytics workspace. The Windows script is named **Create Automation Windows HybridWorker** and the Linux script is **Create Automation Linux HybridWorker**.

### Invoke runbook through an Azure Resource Manager template webhook

**Type:** New feature

For more information, see [Use a webhook from an ARM template](./automation-webhooks.md#create-runbook-and-webhook-with-arm-template).

### Azure Update Management now supports Centos 8.x, Red Hat Enterprise Linux Server 8.x, and SUSE Linux Enterprise Server 15

**Type:** New feature

See the [full list](./update-management/operating-system-requirements.md) of supported Linux operating systems for more details.

### In-region data residency support for Brazil South and South East Asia 

**Type:** New feature

In all regions except Brazil South and Southeast Asia, Azure Automation data is stored in a different region (Azure paired region) for providing Business Continuity and Disaster Recovery (BCDR). For the Brazil and Southeast Asia regions only, we now store Azure Automation data in the same region to accommodate data-residency requirements for these regions. For more information, see [Geo-replication in Azure Automation](./automation-managing-data.md#geo-replication-in-azure-automation).

## February 2021

### Support for Automation and State Configuration declared GA in Japan West

**Type:** New feature

Automation account and State Configuration availability in Japan West region. For more information, read [announcement](https://azure.microsoft.com/updates/azure-automation-in-japan-west-region/).

### Introduced custom Azure Policy compliance to enforce runbook execution on Hybrid Worker

**Type :** New feature

You can use the new Azure Policy compliance rule to allow creation of jobs, webhooks, and job schedules to run only on Hybrid Worker groups.

### Update Management availability in East US, France Central, and North Europe regions

**Type:** New feature

Automation Update Management feature is available in East US, France Central, and North Europe regions. See [Supported region mapping](how-to/region-mappings.md) for updates to the documentation reflecting this change.

## Next steps

If you'd like to contribute to Azure Automation documentation, see the [Docs Contributor Guide](/contribute/).
