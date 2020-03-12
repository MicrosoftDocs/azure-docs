---
title: Azure Security Control - Inventory and Asset Management
description: Security Control Inventory and Asset Management
author: msmbaldwin
manager: rkarlin

ms.service: security
ms.topic: conceptual
ms.date: 12/30/2019
ms.author: mbaldwin
ms.custom: security-recommendations

---

# Security Control: Inventory and Asset Management

Inventory and Asset Management recommendations focus on addressing issues related to actively managing (inventory, track, and correct) all Azure resources so that only authorized resources are given access, and unauthorized and unmanaged resources are identified and removed.

## 6.1: Use Azure Asset Discovery

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 6.1 | 1.1, 1.2, 1.3, 1.4, 9.1, 12.1 | Customer |

Use Azure Resource Graph to query/discover all resources (such as compute, storage, network, ports, and protocols etc.) within your subscription(s).  Ensure appropriate (read) permissions in your tenant and enumerate all Azure subscriptions as well as resources within your subscriptions.

Although classic Azure resources may be discovered via Resource Graph, it is highly recommended to create and use Azure Resource Manager resources going forward.

How to create queries with Azure Resource Graph:

https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal

How to view your Azure Subscriptions:

https://docs.microsoft.com/powershell/module/az.accounts/get-azsubscription?view=azps-3.0.0

Understand Azure RBAC:

https://docs.microsoft.com/azure/role-based-access-control/overview

## 6.2: Maintain asset metadata

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 6.2 | 1.5 | Customer |

Apply tags to Azure resources giving metadata to logically organize them into a taxonomy.

How to create and use Tags:

https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags

## 6.3: Delete unauthorized Azure resources

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 6.3 | 1.6 | Customer |

Use tagging, management groups, and separate subscriptions, where appropriate, to organize and track assets. Reconcile inventory on a regular basis and ensure unauthorized resources are deleted from the subscription in a timely manner.

How to create additional Azure subscriptions:

https://docs.microsoft.com/azure/billing/billing-create-subscription

How to create Management Groups:

https://docs.microsoft.com/azure/governance/management-groups/create

How to create and use Tags:

https://docs.microsoft.com/azure/azure-resource-manager/resource-group-using-tags

## 6.4: Maintain an inventory of approved Azure resources and software titles

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 6.4 | 2.1 | Customer |

Define approved Azure resources and approved software for compute resources.

## 6.5: Monitor for unapproved Azure resources

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 6.5 | 2.3, 2.4 | Customer |

Use Azure Policy to put restrictions on the type of resources that can be created in your subscription(s).

Use Azure Resource Graph to query/discover resources within their subscription(s). &nbsp;Ensure that all Azure resources present in the environment are approved.

How to configure and manage Azure Policy:

https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

How to create queries with Azure Graph:

https://docs.microsoft.com/azure/governance/resource-graph/first-query-portal

## 6.6: Monitor for unapproved software applications within compute resources

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 6.6 | 2.3/2.4 | Customer |

Use Azure virtual machine Inventory to automate the collection of information about all software on Virtual Machines. Software Name, Version, Publisher, and Refresh time are available from the Azure portal. To get access to install date and other information, enable guest-level diagnostics and bring the Windows Event Logs into a Log Analytics Workspace.

How to enable Azure virtual machine Inventory:

https://docs.microsoft.com/azure/automation/automation-tutorial-installed-software

## 6.7: Remove unapproved Azure resources and software applications

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 6.7 | 2.5 | Customer |

Use Azure Security Center's File Integrity Monitoring (Change Tracking) and virtual machine Inventory to identify all software installed on Virtual Machines. You can implement your own process for removing unauthorized software. You can also use a third party solution to identify unapproved software.

How to use File Integrity Monitoring:

https://docs.microsoft.com/azure/security-center/security-center-file-integrity-monitoring#using-file-integrity-monitoring

Understand Azure Change Tracking:

https://docs.microsoft.com/azure/automation/change-tracking

How to enable Azure virtual machine inventory:

https://docs.microsoft.com/azure/automation/automation-tutorial-installed-software

## 6.8: Use only approved applications

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 6.8 | 2.6 | Customer |

Use Azure Security Center Adaptive Application Controls to ensure that only authorized software executes and all unauthorized software is blocked from executing on Azure Virtual Machines.

How to use Azure Security Center Adaptive Application Controls:

https://docs.microsoft.com/azure/security-center/security-center-adaptive-application

## 6.9: Use only approved Azure services

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 6.9 | 2.6 | Customer |

Use Azure Policy to restrict which services you can provision in your environment.

How to configure and manage Azure Policy:

https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage

How to deny a specific resource type with Azure Policy:

https://docs.microsoft.com/azure/governance/policy/samples/not-allowed-resource-types

## 6.10: Implement approved application list

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 6.1 | 2.7 | Customer |

Use Azure Security Center Adaptive Application Controls to specify which file types a rule may or may not apply to.

Implement third party solution if this does not meet the requirement.

How to use Azure Security Center Adaptive Application Controls:

https://docs.microsoft.com/azure/security-center/security-center-adaptive-application

## 6.11: Limit users' ability to interact with Azure Resource Manager via scripts

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 6.11 | 2.8 | Customer |

Use Azure Conditional Access to limit users' ability to interact with Azure Resource Manager by configuring &quot;Block access&quot; for the &quot;Microsoft Azure Management&quot; App.

How to configure Conditional Access to block access to Azure Resource Manager:

https://docs.microsoft.com/azure/role-based-access-control/conditional-access-azure-management

## 6.12: Limit users' ability to execute scripts within compute resources

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 6.12 | 2.8 | Customer |

Use operating system specific configurations or third-party resources to limit users' ability to execute scripts within Azure compute resources.

For example, how to control PowerShell script execution in Windows Environments:

https://docs.microsoft.com/powershell/module/microsoft.powershell.security/set-executionpolicy?view=powershell-6

## 6.13: Physically or logically segregate high risk applications

| Azure ID | CIS IDs | Responsibility |
|--|--|--|
| 6.13 | 2.9 | Customer |

Software that is required for business operations, but may incur higher risk for the organization, should be isolated within its own virtual machine and/or virtual network and sufficiently secured with either an Azure Firewall or Network Security Group.

How to create a virtual network:

https://docs.microsoft.com/azure/virtual-network/quick-create-portal

How to create an NSG with a security config:

https://docs.microsoft.com/azure/virtual-network/tutorial-filter-network-traffic

## Next steps

See the next security control: [Secure Configuration](security-control-secure-configuration.md)
