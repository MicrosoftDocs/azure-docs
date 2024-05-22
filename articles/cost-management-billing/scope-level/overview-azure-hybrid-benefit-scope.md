---
title: What is centrally managed Azure Hybrid Benefit for SQL Server?
description: Azure Hybrid Benefit is a licensing benefit that lets you bring your on-premises core-based Windows Server and SQL Server licenses with active Software Assurance (or subscription) to Azure.
author: bandersmsft
ms.author: banders
ms.date: 03/21/2024
ms.topic: overview
ms.service: cost-management-billing
ms.subservice: ahb
ms.reviewer: chrisrin
---

# What is centrally managed Azure Hybrid Benefit for SQL Server?

Azure Hybrid Benefit is a licensing benefit that helps you to significantly reduce the costs of running your workloads in the cloud. It works by letting you use your on-premises Software Assurance or subscription-enabled Windows Server and SQL Server licenses on Azure. For more information, see [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-benefit/).

You can centrally manage your Azure Hybrid Benefit for SQL Server across the scope of an entire Azure subscription or overall billing account. To quickly learn how it works, watch the following video.

>[!VIDEO https://www.youtube.com/embed/ReoLB9N76Lo]

To use centrally managed licenses, you must have a specific role assigned to you, depending on your Azure agreement type:

- Enterprise Agreement
    - Enterprise Administrator  
        If you're not an Enterprise admin, you need to contact one and either:
        - Have them give you the enterprise administrator role with full access.
        - Contact your Microsoft account team to have them identify your primary enterprise administrator.  
        For more information about how to become a member of the role, see [Add another enterprise administrator](../manage/direct-ea-administration.md#add-another-enterprise-administrator).
- Microsoft Customer Agreement
    - Billing account owner
    - Billing account contributor
    - Billing profile owner
    - Billing profile contributor  
        If you don't have one of the roles, your organization must assign one to you. For more information about how to become a member of the roles, see [Manage billing roles](../manage/understand-mca-roles.md#manage-billing-roles-in-the-azure-portal).

At a high level, here's how centrally managed Azure Hybrid Benefit works:

1. First, confirm that all your SQL Server VMs are visible to you and Azure by enabling automatic registration of the self-installed SQL server images with the IaaS extension. For more information, see [Register multiple SQL VMs in Azure with the SQL IaaS Agent extension](/azure/azure-sql/virtual-machines/windows/sql-agent-extension-manually-register-vms-bulk).
1. Under **Cost Management + Billing** in the Azure portal, you (the billing administrator) choose the scope and coverage option for the number of qualifying licenses that you want to assign.  
1. Select the date that you want to review the license assignment. For example, you might set it to the agreement renewal or anniversary date, or the subscription renewal date, for the source of the licenses.

:::image type="content" source="./media/overview-azure-hybrid-benefit-scope/set-scope-assign-licenses.png" alt-text="Screenshot showing setting a scope and assigning licenses." lightbox="./media/overview-azure-hybrid-benefit-scope/set-scope-assign-licenses.png" :::

Let's break down the previous example.

- Detected usage shows that 8 SQL Server standard core licenses and 8 enterprise licenses (equaling 40 normalized cores) need to be assigned to keep the existing level of Azure Hybrid Benefit coverage.
- To expand coverage to all eligible Azure SQL resources, you need to assign 10 standard and 10 enterprise core licenses (equaling 50 normalized cores).
    - Normalized cores needed = 1 x (SQL Server standard core license count) + 4 x (enterprise core license count).
    - From the example again: 1 x (10 standard) + 4 x (10 enterprise) = 50 normalized cores.

Normalized core values are covered in more detail in the following section, [How licenses apply to Azure resources](#how-licenses-apply-to-azure-resources).

Here's a brief summary of how centralized Azure Hybrid Benefit management works:

- Each hour as resources in the scope run, Azure automatically applies the licenses to them and discounts the costs correctly. Different resources can be covered each hour.
- Any usage above the number of assigned licenses is billed at normal, pay-as-you-go prices.
- When you choose to manage the benefit by assigning licenses at a scope level, you can't manage individual resources in the scope any longer.

The original resource-level way to enable Azure Hybrid Benefit is still available for SQL Server and is currently the only option for Windows Server. It involves a DevOps role selecting the benefit for each individual resource (like a SQL Database or Windows Server VM) when you create or manage it. Doing so results in the hourly cost of that resource being discounted. For more information, see [Azure Hybrid Benefit for Windows Server](/azure/azure-sql/azure-hybrid-benefit).

You can enable centralized management of Azure Hybrid Benefit for SQL Server at a subscription or account scope level. It's available to enterprise customers and to customers that buy directly from Azure.com with a Microsoft Customer Agreement. It’s not currently available for Windows Server customers or to customers who work with a Cloud Solution Provider (CSP) partner that manages Azure for them.

## Qualifying SQL Server licenses

SQL Server Enterprise and Standard core licenses with active Software Assurance qualify for this benefit. Plus, SQL Server core license subscriptions.

## Qualifying Azure resources

Centrally managing Azure Hybrid Benefit at a scope-level covers the following common Azure SQL resources:

- SQL Databases
- SQL Managed Instances
- SQL Elastic Pools
- SQL Server on Azure VMs

Resource-level Azure Hybrid Benefit management can cover all of those points, too. It's currently the only option for covering the following resources:

- Azure Dedicated Hosts
- Azure Data Factory SQL Server Integration Services (SSIS)

## Centralized scope-level management advantages

You get the following benefits:

- **A simpler, more scalable approach with better control** - The billing administrator directly assigns available licenses to one or more Azure scopes. The original approach, at a large scale, involves coordinating Azure Hybrid Benefit usage across many resources and DevOps owners.
- **An easy-to-use way to optimize costs** - An Administrator can monitor Azure Hybrid Benefit utilization and directly adjust licenses assigned to Azure. Track SQL Server license utilization and optimize costs to proactively identify other licenses. It helps to maximize savings and receive notifications when license agreements need to be refreshed. For example, an administrator might see an opportunity to save more money by assigning more licenses to Azure. Then they speak with their procurement department to confirm license availability. Finally, they can easily assign the licenses to Azure and start saving.
- **A better method to manage costs during usage spikes** - You can easily scale up the same resource or add more resources during temporary spikes. You don't need to assign more SQL Server licenses (for example, closing periods or increased holiday shopping). For short-lived workload spikes, pay-as-you-go charges for the extra capacity might cost less than acquiring more licenses to use Azure Hybrid Benefit for the capacity. When you manage the benefit at a scope, rather than at a resource-level, helps you to decide based on aggregate usage.
- **Clear separation of duties to sustain compliance** - In the resource-level Azure Hybrid Benefit model, resource owners might select Azure Hybrid Benefit when there are no licenses available. Or, they might *not* select the benefit when there *are* licenses available. Scope-level management of Azure Hybrid Benefit solves this situation. The billing admins that manage the benefit centrally are positioned to confirm with procurement and software asset management departments how many licenses are available to assign to Azure. The following diagram illustrates the point.

:::image type="content" source="./media/overview-azure-hybrid-benefit-scope/duty-separation.svg" alt-text="Diagram showing the separation of duties." border="false" lightbox="./media/overview-azure-hybrid-benefit-scope/duty-separation.svg":::

## How licenses apply to Azure resources

Both SQL Server Enterprise (core) and SQL Server Standard (core) licenses with Software Assurance qualify but, as described in the [Microsoft Product Terms](https://www.microsoft.com/licensing/terms/productoffering/MicrosoftAzureServices/EAEAS), different conversion ratios apply when you bring them to Azure with Azure Hybrid Benefit.

One rule to understand: One SQL Server Enterprise Edition license has the same coverage as _four_ SQL Server Standard Edition licenses, across all qualified Azure SQL resource types.

The following table summarizes how many normalized cores (NCs) you need to fully discount the SQL Server license cost for different resource types. Scope-level management of Azure Hybrid Benefit strictly applies the rules in the product terms, summarized as follows.

| **Azure Data Service** | **Service tier** | **Required number of NCs** |
| --- | --- | --- |
| SQL Managed Instance or Instance pool | Business Critical | 4 per vCore |
| SQL Managed Instance or Instance pool | General Purpose | 1 per vCore |
| SQL Database or Elastic pool¹ | Business Critical | 4 per vCore |
| SQL Database or Elastic pool¹ | General Purpose | 1 per vCore |
| SQL Database or Elastic pool¹ | Hyperscale | 1 per vCore |
| Azure Data Factory SQL Server Integration Services | Enterprise | 4 per vCore |
| Azure Data Factory SQL Server Integration Services | Standard | 1 per vCore |
| SQL Server Virtual Machines² | Enterprise | 4 per vCPU |
| SQL Server Virtual Machines² | Standard | 1 per vCPU |

¹ *Azure Hybrid Benefit isn't available in the serverless compute tier of Azure SQL Database.*

² *Subject to a minimum of four vCores per Virtual Machine, which translates to four NCs if Standard edition is used, and 16 NCs if Enterprise edition is used.*

## Ongoing scope-level management

We recommend that you establish a proactive rhythm when centrally managing Azure Hybrid Benefit, like the following tasks and order.

- Engage within your organization to understand how many Azure SQL resources and vCores will be used during the next month, quarter, or year.
- Work with your procurement and software asset management departments to determine if enough SQL core licenses with Software Assurance (or subscription core licenses) are available. The benefit allows licenses supporting migrating workloads to be used both on-premises and in Azure for up to 180 days. So, those licenses can be counted as available.
- Assign available licenses to cover your current usage _and_ your expected usage growth during the upcoming period.
- Monitor assigned license utilization.
  - If it approaches 100%, then consult others in your organization to understand expected usage. Confirm license availability then assign more licenses to the scope.
  - If usage is 100%, you might be using resources beyond the number of licenses assigned. Return to the [Add Azure Hybrid Benefit experience](create-sql-license-assignments.md) and review the usage. Then assign more available licenses to the scope for more coverage.
- Repeat the proactive process periodically.

## Next steps

- Follow the [Manage and optimize Azure Hybrid Benefit for SQL Server](tutorial-azure-hybrid-benefits-sql.md) tutorial.
- Learn about how to [transition to centrally managed Azure Hybrid Benefit](transition-existing.md).
- Review the [Centrally managed Azure Hybrid Benefit FAQ](faq-azure-hybrid-benefit-scope.yml).