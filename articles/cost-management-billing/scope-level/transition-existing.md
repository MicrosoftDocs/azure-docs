---
title: Transition to centrally managed Azure Hybrid Benefit
description: This article describes the changes and several transition scenarios to illustrate transitioning to centrally managed Azure Hybrid Benefit.
author: bandersmsft
ms.author: banders
ms.date: 03/21/2024
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: ahb
---

# Transition to centrally managed Azure Hybrid Benefit

When you transition to centrally managed Azure Hybrid Benefit, it removes the need to configure the benefit at the resource level. This article describes the changes and several transition scenarios to illustrate the result. For a better understanding about how the new scope-level license management experience applies licenses and discounts to your resources, see [What is centrally managed Azure Hybrid Benefit?](overview-azure-hybrid-benefit-scope.md)

## Changes to individual resource configuration

When you assign licenses to a subscription using the new experience, changes are shown in the Azure portal. Afterward, you can't manage the benefit at the resource level. Any changes that you make at a scope level override settings at the individual resource level.

:::image type="content" source="./media/transition-existing/sql-db-configure.png" alt-text="Screenshot showing SQL license override information." lightbox="./media/transition-existing/sql-db-configure.png" :::

> [!NOTE]
> If you change the Azure Hybrid Benefit settings using PowerShell, an API, or outside of the Azure portal to a resource, your settings change is saved. However, it won’t have any effect as long as that resource's subscription or billing account is covered by licenses assigned to a scope. If you ever opt out of scope-level management of Azure Hybrid Benefit by removing all license assignments, then your licensing discounts revert to being determined by the Azure Hybrid Benefit settings on each resource.

## Check how many SQL licenses you use before transition

When you enroll in the scope-level management of Azure Hybrid Benefit experience, you’ll see your current Azure Hybrid Benefit usage that’s enabled for individual resources. For more information on the overall experience, see [Create SQL Server license assignments for Azure Hybrid Benefit](create-sql-license-assignments.md). If you're a subscription contributor and you don’t have the billing administrator role required, you can analyze the usage of different types of SQL Server licenses in Azure by using a PowerShell script. The script generates a snapshot of the usage across multiple subscriptions or the entire account. For details and examples of using the script, see the [sql-license-usage PowerShell script](https://github.com/anosov1960/sql-server-samples/tree/master/samples/manage/azure-hybrid-benefit) example script. Once you’ve run the script, identify and engage your billing administrator about the opportunity to shift Azure Hybrid Benefit management to the subscription or billing account scope level.

> [!NOTE]
> The script includes support for normalized cores (NC). 

## HADR benefit for SQL Server VMs

The new Azure portal experience fully supports the high-availability and disaster recovery (HADR) benefit for SQL Server VMs. If your SQL Server VM is configured as an HADR replica, no other actions are required. For more information about how the SQL Server VM HADR benefit works, see [SQL Server HADR and centrally managed Azure Hybrid Benefit coexistence](sql-server-hadr-licenses.md).

## Transition scenario examples

Review the following transition scenario examples that most closely match your situation.

### Migrate SQL workloads from on-premises to the cloud using SQL Database with Azure Hybrid Benefit

- **On-premises SQL Server workloads -** Two 16-core machines hosting mission-critical SQL Server Enterprise edition databases will be migrated to the cloud.
- **Azure destination for migrating workloads -** After analysis, it's decided that the workloads will run on two 16-core Azure SQL Managed Instances.
- **Licenses to assign to Azure –** Considering the preceding points, 32 SQL Server Enterprise edition core licenses with Software Assurance will be assigned to Azure.
- **Recommended action -** Use the new Azure portal experience to assign 32 SQL Server Enterprise edition core licenses to the appropriate subscription or overall billing account.
- **Result -** An easy-to-manage, cost optimized migration of SQL Server workloads from on-premises to cloud.

> [!NOTE] 
> Azure Hybrid Benefit allows the licenses assigned to Azure to continue to also be used on-premises for up to 180 days, as the workloads are migrated, tested, and deployed.

### Simplify license management by transitioning to centralized scope-level management of Azure Hybrid Benefit

- **SQL Server resources running -** One 64-core Azure SQL Database Business Critical is running, with Azure Hybrid Benefit selected.
- **Licenses available to assign to Azure –** Your procurement team confirms there are more than 64 SQL Server Enterprise edition core licenses with Software Assurance that aren't in use on-premises.
- **Recommended action -** Use the new scope-level management of Azure Hybrid Benefit experience to assign 64 SQL Server Enterprise edition core licenses to Azure. Or if usage is expected to increase soon, assign more licenses as needed.
- **Result –** Transitioning will cover the SQL Server software cost, so there shouldn't be any change to your associated billing.

### Save more by assigning more SQL Server licenses to cover more Azure SQL resources

- **SQL Server resources running -** Two 16-core Azure SQL Database Business Critical are running, with Azure Hybrid Benefit selected on only one.
- **Licenses available to assign to Azure -** According to your procurement team, 48 SQL Server Enterprise edition core licenses with Software Assurance aren't in use on-premises or in Azure.
- **Recommended action -** Use the scope-level management of Azure Hybrid Benefit experience to assign all 48 SQL Server Enterprise edition core licenses. That's an increase of 16 compared to the resource-level Azure Hybrid Benefit selection.
- **Result -** Because more licenses purchased outside of Azure are being used, billed amounts in Azure should be reduced. Also, because the cost per year of Software Assurance is less than the cost per year of SQL Server at pay-as-you-go charges, your total cost for SQL Server usage is reduced.

### Restore compliance when excessive Azure Hybrid Benefit usage is found

- **SQL Server resources running -** Three 8-core SQL database General Purpose and one 16-core SQL Server VM Enterprise are running, with Azure Hybrid Benefit selected on all. The number of Azure Hybrid Benefit licenses required to cover that is 24 Standard edition cores + 16 SQL Server Enterprise cores. Or, 88 SQL Server Standard edition (+ 0 SQL Server Enterprise edition) -Or- 22 SQL Server Enterprise (+ 0 SQL Server Standard edition) could cover it, too. That's because one SQL Server Enterprise edition core license and four SQL Server Standard edition core licenses can cover the same Azure Hybrid Benefit usage across all Azure SQL resource types. Review the Azure Hybrid Benefit rules in the [What is centrally managed Azure Hybrid Benefit?](overview-azure-hybrid-benefit-scope.md) article to learn more about this flexibility.
- **Licenses available to assign to Azure -** According to your procurement team, 64 SQL Server Standard edition core licenses with Software Assurance aren't in use on-premises or in Azure. That's less than the required amount of 22 SQL Server Enterprise or 88 SQL Server Standard edition core licenses.
- **Recommended Action -** To restore compliance, identify 6 SQL Server Enterprise or 24 SQL Server Standard edition core licenses with Software Assurance and assign them and the already-confirmed 64 SQL Server Standard core licenses to Azure using the scope-level management of Azure Hybrid Benefit experience.
- **Result -** Non-compliance is eliminated and Azure Hybrid Benefit is used optimally to minimize costs.
- **Alternative Action -** Assign only the available 64 SQL Server Standard edition core licenses to Azure. You'll be compliant, but because those licenses are insufficient to cover all Azure SQL usage, you'll experience some pay-as-you-go charges.
## Next steps

- Follow the [Optimize centrally managed Azure Hybrid Benefit for SQL Server](tutorial-azure-hybrid-benefits-sql.md) tutorial.
- Move to scope-level license management by [creating SQL Server license assignments](create-sql-license-assignments.md).
- Review the [Centrally managed Azure Hybrid Benefit FAQ](faq-azure-hybrid-benefit-scope.yml).