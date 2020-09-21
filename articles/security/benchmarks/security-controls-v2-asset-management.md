---
title: Azure Security Benchmark V2 - Asset Management
description: Azure Security Benchmark V2 Asset Management
author: msmbaldwin
ms.service: security
ms.topic: conceptual
ms.date: 09/20/2020
ms.author: mbaldwin
ms.custom: security-benchmark

---

# Security Control V2: Asset Management

Asset Management covers controls to ensure security visibility and governance over Azure resources. This includes recommendations on permissions for security personnel, security access to asset inventory, and managing approvals for services and resources (inventory, track, and correct).

## AM-1: Ensure security team has visibility into risks for assets

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP800-53 r4 ID(s) |
|--|--|--|--|
| AM-1 | 1.1, 1.2 | CM-8, PM-5 |

Ensure security teams are granted Security Reader permissions in your Azure tenant and subscriptions so they can monitor for security risks using Azure Security Center. 

Depending on how security team responsibilities are structured, monitoring for security risks could  be the responsibility of a central security team or a local team. That said, security insights and risks must always be aggregated centrally within an organization. 

Security Reader permissions can be applied broadly to an entire tenant (Root Management Group) or scoped to management groups or specific subscriptions. 

Note: Additional permissions might be required to get visibility into workloads and services. 

- [Overview of Security Reader Role](../../role-based-access-control/built-in-roles.md#security-reader)

- [Overview of Azure Management Groups](../../governance/management-groups/overview.md)

**Responsibility**: Customer

**Customer Security Stakeholders** ([Learn more](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)):

- [Infrastructure and endpoint security](/azure/cloud-adoption-framework/organize/cloud-security-infrastructure-endpoint)

- [Security Compliance Management](/azure/cloud-adoption-framework/organize/cloud-security-compliance-management)

## AM-2: Ensure security team has access to asset inventory and metadata

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP800-53 r4 ID(s) |
|--|--|--|--|
| AM-2 | 1.1, 1.2,  1.4, 1.5,  9.1, 12.1 | CM-8, PM-5 |

Ensure that security teams have access to a continuously updated inventory of assets on Azure. Security teams often need this inventory to evaluate their organization's potential exposure to emerging risks, and as an input to continuously security improvements. 

The Azure Security Center inventory feature and Azure Resource Graph can query for and discover all resources  in your subscriptions, including Azure services, applications, and network resources.  

Logically organize assets according to your organization’s taxonomy using Tags as well as other metadata in Azure (Name, Description, and Category).  

- [How to create queries with Azure Resource Graph Explorer](../../governance/resource-graph/first-query-portal.md)

- [Azure Security Center asset inventory management](../../security-center/asset-inventory.md)

- [For more information about tagging assets, see the resource naming and tagging decision guide](https://docs.microsoft.com/azure/cloud-adoption-framework/decision-guides/resource-tagging/?toc=/azure/azure-resource-manager/management/toc.json)

**Responsibility**: Customer

**Customer Security Stakeholders** ([Learn more](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)):

- [Infrastructure and endpoint security](/azure/cloud-adoption-framework/organize/cloud-security-infrastructure-endpoint)

- [Security Compliance Management](/azure/cloud-adoption-framework/organize/cloud-security-compliance-management)

## AM-3: Use only approved Azure services

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP800-53 r4 ID(s) |
|--|--|--|--|
| AM-3 | 2.3, 2.4 | CM-7, CM-8 |

Use Azure Policy to audit and restrict which services users can provision in your environment. Use Azure Resource Graph to query for and discover resources within their subscriptions.  You can also use Azure Monitor to create rules to trigger alerts when a non-approved service is detected.

- [Configure and manage Azure Policy](../../governance/policy/tutorials/create-and-manage.md)

- [How to deny a specific resource type with Azure Policy](/azure/governance/policy/samples/not-allowed-resource-types)

- [How to create queries with Azure Resource Graph Explorer](../../governance/resource-graph/first-query-portal.md)

**Responsibility**: Customer

**Customer Security Stakeholders** ([Learn more](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)):

- [Security Compliance Management](/azure/cloud-adoption-framework/organize/cloud-security-compliance-management)

- [Posture management](/azure/cloud-adoption-framework/organize/cloud-security-posture-management)  

## AM-4: Ensure security of asset lifecycle management

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP800-53 r4 ID(s) |
|--|--|--|--|
| AM-4 | 2.3, 2.4, 2.5 | CM-7, CM-8, CM-10, CM-11 |

Establish or update security policies that address asset lifecycle management processes for potentially high impact modifications. These modifications include changes to: identity providers and access, data sensitivity, network configuration, and administrative privilege assignment.

Remove Azure resources when they are no longer needed.

- [Delete Azure resource group and resource](../../azure-resource-manager/management/delete-resource-group.md)

**Responsibility**: Customer

**Customer Security Stakeholders** ([Learn more](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)):

- [Infrastructure and endpoint security](/azure/cloud-adoption-framework/organize/cloud-security-infrastructure-endpoint)

- [Posture management](/azure/cloud-adoption-framework/organize/cloud-security-posture-management)  

- [Security Compliance Management](/azure/cloud-adoption-framework/organize/cloud-security-compliance-management)

## AM-5: Limit users' ability to interact with Azure Resource Manager

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP800-53 r4 ID(s) |
|--|--|--|--|
| AM-5 | 2.9 | AC-3 |

Use Azure AD Conditional Access to limit users' ability to interact with Azure Resource Manager by configuring "Block access" for the "Microsoft Azure Management" App.

- [How to configure Conditional Access to block access to Azure Resources Manager](../../role-based-access-control/conditional-access-azure-management.md)

**Responsibility**: Customer

**Customer Security Stakeholders** ([Learn more](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)):

- [Posture management](/azure/cloud-adoption-framework/organize/cloud-security-posture-management)  

- [Infrastructure and endpoint security](/azure/cloud-adoption-framework/organize/cloud-security-infrastructure-endpoint)

## AM-6: Use only approved applications in compute resources

| Azure ID | CIS Controls v7.1 ID(s) | NIST SP800-53 r4 ID(s) |
|--|--|--|--|
| AM-6 | 2.6, 2.7 | AC-3, CM-7, CM-8, CM-10, CM-11 |

Ensure that only authorized software executes, and all unauthorized software is blocked from executing on Azure Virtual Machines.

Use Azure Security Center (ASC) adaptive application controls to discover and generate an application allow list. You can also use ASC adaptive application controls to ensure that only authorized software executes and all unauthorized software is blocked from executing on Azure Virtual Machines.

Use Azure Automation Change Tracking and Inventory to automate the collection of inventory information from your Windows and Linux VMs. Software name, version, publisher, and refresh time are available from the Azure portal. To get the software installation date and other information, enable guest-level diagnostics and direct the Windows Event Logs to Log Analytics workspace.

Depending on the type of scripts, you can use operating system-specific configurations or third-party resources to limit users' ability to execute scripts in Azure compute resources. 

You can also use a third-party solution to discover and identify unapproved software.

- [How to use Azure Security Center adaptive application controls](../../security-center/security-center-adaptive-application.md)

- [Understand Azure Automation Change Tracking and Inventory](../../automation/change-tracking.md)

- [How to control PowerShell script execution in Windows environments](https://docs.microsoft.com/powershell/module/microsoft.powershell.security/set-executionpolicy?view=powershell-6)

**Responsibility**: Customer

**Customer Security Stakeholders** ([Learn more](/azure/cloud-adoption-framework/organize/cloud-security#security-functions)):

- [Infrastructure and endpoint security](/azure/cloud-adoption-framework/organize/cloud-security-infrastructure-endpoint)

- [Posture management](/azure/cloud-adoption-framework/organize/cloud-security-posture-management)  

- [Security Compliance Management](/azure/cloud-adoption-framework/organize/cloud-security-compliance-management)

