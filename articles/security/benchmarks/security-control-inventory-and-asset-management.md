---
title: Security Control - Inventory and Asset Management
description: Security Control Inventory and Asset Management
author: msmbaldwin
manager: rkarlin

ms.service: security
ms.topic: conceptual
ms.date: 12/16/2019
ms.author: mbaldwin
ms.custom: security-recommendations

---

# Security Control: Inventory and Asset Management

## Utilize Azure Asset Discovery

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 6.1 | 1.1, 1.2, 1.3, 1.4, 9.1, 12.1 | Customer |

**Guidance**: Customer to utilize Azure Resource Graph to query/discover all resources (such as compute, storage, network, ports, and protocols etc.) within their subscription(s). &nbsp;Customer to ensure they have appropriate (read) permissions in their tenant and are able to enumerate all Azure subscriptions as well as resources within their subscriptions.<br><br>Although classic Azure resources may be discovered via Resource Graph, it is highly recommended to create and utilize ARM resources going forward.<br><br>How to create queries with Azure Graph:<br>https://docs.microsoft.com/en-us/azure/governance/resource-graph/first-query-portal<br><br>How to view your Azure Subscriptions:<br>https://docs.microsoft.com/en-us/powershell/module/az.accounts/get-azsubscription?view=azps-3.0.0<br><br>Understanding Azure RBAC:<br>https://docs.microsoft.com/en-us/azure/role-based-access-control/overview

## Maintain Asset Metadata

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 6.2 | 1.5 | Customer |

**Guidance**: Apply tags to Azure resources giving metadata to logically organize them into a taxonomy.<br><br><br><br>How to create and utilize Tags:<br><br>https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-using-tags

## Delete Unauthorized Azure Resources

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 6.3 | 1.6 | Customer |

**Guidance**: Customer to utilize tagging, management groups, and separate subscriptions, where appropriate, to organize and track assets. Customer to reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription in a timely manner.<br><br><br><br>How to create additional Azure subscriptions:<br><br>https://docs.microsoft.com/en-us/azure/billing/billing-create-subscription<br><br><br><br>How to create Management Groups:<br><br>https://docs.microsoft.com/en-us/azure/governance/management-groups/create<br><br><br><br>How to create and utilize Tags:<br><br>https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-using-tags

## Maintain inventory of approved Azure resources and software titles.

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 6.4 | 2.1 | Customer |

**Guidance**: Customer to define list of approved Azure resources and approved software for their compute resources

## Monitor for Unapproved Azure Resources

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 6.5 | 2.3, 2.4 | Customer |

**Guidance**: Customer to utilize Azure policy to put restrictions on the type of resources that can be created in customer subscription(s).<br><br><br><br>Customer to utilize Azure Resource Graph to query/discover resources within their subscription(s). &nbsp;Ensure that all Azure resources present in the environment are approved.<br><br><br><br>How to configure and manage Azure Policy:<br><br>https://docs.microsoft.com/en-us/azure/governance/policy/tutorials/create-and-manage<br><br><br><br>How to create queries with Azure Graph:<br><br>https://docs.microsoft.com/en-us/azure/governance/resource-graph/first-query-portal

## Monitor for Unapproved Software Applications within Compute Resources

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 6.6 | 2.3/2.4 | Customer |

**Guidance**: Utilize Azure Virtual Machine Inventory to automate the collection of information about all software on Virtual Machines. Note: Software Name, Version, Publisher, and Refresh time are available from the Azure Portal. To get access to install date and other information, customer required to enable guest-level diagnostic and bring the Windows Event logs into a Log Analytics Workspace.<br><br><br><br>How to enable Azure VM Inventory:<br><br>https://docs.microsoft.com/en-us/azure/automation/automation-tutorial-installed-software

## Remove Unapproved Azure Resources and Software Applications

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 6.7 | 2.5 | Customer |

**Guidance**: Customer to Utilize Change Tracking and VM Inventory to identify all software installed on Virtual Machines. Customer to implement own process for removing unauthorized. (When Change Tracking and VM Inventory not available, customer to utilize third party solution to identify unapproved software.)<br><br><br><br>How to enable Azure VM Inventory:<br><br>https://docs.microsoft.com/en-us/azure/automation/automation-tutorial-installed-software<br><br><br><br>Understanding Change Tracking:<br><br>https://docs.microsoft.com/en-us/azure/automation/change-tracking

## Utilize only approved applications

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 6.8 | 2.6 | Customer |

**Guidance**: Utilize Azure Security Center Adaptive Application Controls to ensure that only authorized software executes and all unauthorized software is blocked from executing on Azure Virtual Machines.<br><br><br><br>How to use Azure Security Center Adaptive Application Controls:<br><br>https://docs.microsoft.com/en-us/azure/security-center/security-center-adaptive-application

## Utilize only approved Azure Services

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 6.9 | 2.6 | Customer |

**Guidance**: Leverage Azure Policy to restrict which services you can provision in your environment.<br><br><br><br>How to configure and manage Azure Policy:<br><br>https://docs.microsoft.com/en-us/azure/governance/policy/tutorials/create-and-manage<br><br><br><br>How to deny a specific resource type with Azure Policy:<br><br>https://docs.microsoft.com/en-us/azure/governance/policy/samples/not-allowed-resource-types

## Implement approved application list

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 6.1 | 2.7 | Customer |

**Guidance**: Utilize Azure Security Center Adaptive Application Controls to specify which file types a rule may or may not apply to. Note: Microsoft documentation states: &quot;This can be EXE, Script, MSI, or any permutation of these types.&quot;<br><br><br><br>Customer to implement third party solution if this does not meet the requirement.<br><br><br><br>How to use Azure Security Center Adaptive Application Controls:<br><br>https://docs.microsoft.com/en-us/azure/security-center/security-center-adaptive-application

## Limit Users' Ability to interact with ARM via Scripts

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 6.11 | 2.8 | Customer |

**Guidance**: Utilize Azure Conditional Access to limit users' ability to interact with ARM by configuring &quot;Block access&quot; for the &quot;Microsoft Azure Management&quot; App.<br><br><br><br>How to configure Conditional Access to block access to ARM:<br><br>https://docs.microsoft.com/en-us/azure/role-based-access-control/conditional-access-azure-management

## Limit Users' Ability to Execute Scripts within Compute Resources

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 6.12 | 2.8 | Customer |

**Guidance**: Customer to utilize operating system specific configurations or third-party resources to limit users' ability to execute scripts within Azure compute resources.<br><br>For example, how to control PowerShell script execution in Windows Environments:<br>https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.security/set-executionpolicy?view=powershell-6

## Physically or Logically Segregate High Risk Applications

| Azure ID | CIS Control IDs | Responsibility |
|--|--|--|
| 6.13 | 2.9 | Customer |

**Guidance**: Software that is required for business operations but may incur higher risk for the organization should be isolated within its own Virtual Machine and/or Virtual Network and sufficiently secured with either an Azure Firewall or Network Security Group.<br><br><br><br>How to create a Virtual Network:<br><br>https://docs.microsoft.com/en-us/azure/virtual-network/quick-create-portal<br><br><br><br>How to create an NSG with a Security Config:<br><br>https://docs.microsoft.com/en-us/azure/virtual-network/tutorial-filter-network-traffic

