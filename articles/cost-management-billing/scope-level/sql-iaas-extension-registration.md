---
title: SQL IaaS extension registration options for Cost Management administrators
description: This article explains the SQL IaaS extension registration options available to Cost Management administrators.
keywords:
author: bandersmsft
ms.author: banders
ms.date: 04/19/2023
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: ahb
ms.reviewer: chrisrin
---

# SQL IaaS extension registration options for Cost Management administrators

Normally, you can use the Azure portal to view Azure VMs that are running SQL Server on the [**SQL virtual machines** page](https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.SqlVirtualMachine%2FSqlVirtualMachines). However, there are some situations where Azure can't detect that SQL Server is running in a virtual machine. The most common situation is when SQL Server VMs are created using custom images that run SQL Server 2014 or earlier. Or if the [SQL CEIP service](/sql/sql-server/usage-and-diagnostic-data-configuration-for-sql-server) is disabled or blocked.

When the Azure portal doesn't detect SQL Server running on your VMs, it's a problem because you can't fully manage Azure SQL. In this situation, you can't verify that you have enough licenses needed to cover your SQL Server usage. Microsoft provides a way to resolve this problem, with _SQL IaaS Agent extension registration_. At a high level, SQL IaaS Agent extension registration works in the following manner:

1. You give Microsoft authorization to detect SQL VMs that aren't detected by default.
2. The registration process runs at a subscription level or overall customer level. When registration completes, all current and future SQL VMs in the registration scope become visible.

You must complete SQL IaaS Agent extension registration before you can use [centrally managed Azure Hybrid Benefit for SQL Server](create-sql-license-assignments.md). Otherwise, you can't use Azure to manage all your SQL Servers running in Azure.

>[!NOTE]
> Avoid using centralized Azure Hybrid Benefit before you complete SQL IaaS Agent extension registration. If you use centralized Azure Hybrid Benefit before you complete SQL IaaS Agent extension registration, new SQL VMs may not be covered by the number of licenses you have assigned. This situation could lead to incorrect license assignments and might result in unnecessary pay-as-you-go charges for SQL Server licenses. Complete registration before you use centralized Azure Hybrid Benefit features.

## Scenarios and options

The following sections help Cost Management users understand how SQL IaaS Agent extension registration relates to centralized Azure Hybrid Benefit. Your first step is to determine whether your SQL Server VMs are already registered.

### Required permissions

You must have client credentials used to view or register your virtual machines with any of the following Azure roles:
- **Virtual Machine contributor**
- **Contributor**
- **Owner**

The permissions are required to perform the following procedure. If you don't have the required permission, contact someone that has the required roles.

### Determine if SQL Server VMs are already registered

1. Navigate to the [SQL virtual machines](https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.SqlVirtualMachine%2FSqlVirtualMachines) page in the Azure portal.
2. Select **Automatic SQL Server VM registration** to open the **Automatic registration** page.
3. If automatic registration is already enabled, a message appears at the bottom of the page indicating `Automatic registration has already been enabled for subscription <SubscriptionName>`.
4. Repeat this process for any other subscriptions that you want to manage with centralized Azure Hybrid Benefit.

Alternatively, you can run a PowerShell script to determine if there are any unregistered SQL Servers in your environment. You can download the script from the [azure-hybrid-benefit](https://github.com/microsoft/sql-server-samples/tree/master/samples/manage/azure-hybrid-benefit) page on GitHub.

If you determine that your SQL Server VMs aren't registered, there are a few ways to complete the registration:

### Register with the help of your Microsoft account team

The most comprehensive way to register is at the overall customer level. For both of the following options, contact your Microsoft account team.

- Your Microsoft account team can help you add a small amendment that accomplishes the authorization in an overarching way if:
    - If you have an Enterprise Agreement that's renewing soon
    - If you're a Microsoft Customer Agreement Enterprise customer
- If you have an Enterprise Agreement that isn't up for renewal, there's another option. A leader in your organization can use an email template to provide Microsoft with authorization.  
    >[!NOTE]
    > This option is time-limited, so if you want to use it, you should investigate it soon.

### Turn on SQL IaaS Agent extension automatic registration

You can use the self-serve registration capability, described at [Automatic registration with SQL IaaS Agent extension](/azure-sql/virtual-machines/windows/sql-agent-extension-automatic-registration-all-vms).

Because of the way that roles and permissions work in Azure, including segregation of duties, you may not be able to access or complete the extension registration process yourself. If you're in that situation, you need find the subscription contributors for the scope you want to register. Then, get their help to complete the process.

You can enable automatic registration in the Azure portal for a single subscription, or for multiple subscriptions suing the PowerShell script mentioned previously. We recommend that you complete the registration process for all of your subscriptions so you can view all of your Azure SQL infrastructure.

## Registration duration and verification

After you enable automatic registration, it can take up to 48 hours to detect all your SQL Servers. When complete, all your SQL Server virtual machines should be visible on the [SQL virtual machines](https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.SqlVirtualMachine%2FSqlVirtualMachines) page in the Azure portal.

## After registration completes

After SQL IaaS Extension registration is complete, we recommended you use Azure Hybrid Benefit for centralized management.

## Next steps

When you're ready, [Create SQL Server license assignments for Azure Hybrid Benefit](create-sql-license-assignments.md). Centrally managed Azure Hybrid Benefit is designed to make it easy to monitor your Azure SQL usage and optimize costs.