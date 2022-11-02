---
title: What is centrally managed Azure Hybrid Benefit?
description: Azure Hybrid Benefit is a licensing benefit that lets you bring your on-premises core-based Windows Server and SQL Server licenses with active Software Assurance (or subscription) to Azure.
keywords:
author: bandersmsft
ms.author: banders
ms.date: 12/03/2021
ms.topic: overview
ms.service: cost-management-billing
ms.subservice: ahb
ms.reviewer: chrisrin
---

# What is centrally managed Azure Hybrid Benefit?

Azure Hybrid Benefit is a licensing benefit that helps you to significantly reduce the costs of running your workloads in the cloud. It works by letting you use your on-premises Software Assurance or subscription-enabled Windows Server and SQL Server licenses on Azure. For more information, see [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-benefit/).

You can centrally manage your Azure Hybrid Benefit for SQL Server across the scope of an entire Azure subscription or overall billing account. 

To use centrally manage licenses, you must have a specific role assigned to you, depending on your Azure agreement type:

- Enterprise Agreement
    - Enterprise Administrator  
        If you're not an Enterprise admin, you must be assigned that role by your organization (with full access). For more information about how to become a member of the role, see [Add another enterprise administrator](../manage/ea-portal-administration.md#create-another-enterprise-administrator).
- Microsoft Customer Agreement
    - Billing account owner
    - Billing account contributor
    - Billing profile owner
    - Billing profile contributor  
        If you don't have one of the roles above, your organization must assign one to you. For more information about how to become a member of the roles, see [Manage billing roles](../manage/understand-mca-roles.md#manage-billing-roles-in-the-azure-portal).

At a high level, here's how it works:

1. First, confirm that all your SQL Server VMs are visible to you and Azure by enabling automatic registration of the self-installed SQL server images with the IaaS extension. For more information, see [Register multiple SQL VMs in Azure with the SQL IaaS Agent extension](/azure/azure-sql/virtual-machines/windows/sql-agent-extension-manually-register-vms-bulk).
1. Under **Cost Management + Billing** in the Azure portal, you (the billing administrator) choose the scope and the number of qualifying licenses that you want to assign to cover the resources in the scope.  
    :::image type="content" source="./media/overview-azure-hybrid-benefit-scope/set-scope-assign-licenses.png" alt-text="Screenshot showing setting a scope and assigning licenses." lightbox="./media/overview-azure-hybrid-benefit-scope/set-scope-assign-licenses.png" :::

In the previous example, detected usage for 108 normalized core licenses is needed to cover all eligible Azure SQL resources. Detected usage for individual resources was 56 normalized core licenses. For the example, we showed 60 standard core licenses plus 12 Enterprise core licenses (12 * 4 = 48). So 60 + 48 = 108. Normalized core license values are covered in more detail in the following [How licenses apply to Azure resources](#how-licenses-apply-to-azure-resources) section.

- Each hour as resources in the scope run, Azure automatically assigns the licenses to them and discounts the costs correctly. Different resources can be covered each hour.
- Any usage above the number of assigned licenses is billed at normal, pay-as-you-go prices.
- When you choose to manage the benefit by assigning licenses at a scope level, you can't manage individual resources in the scope any longer.

The original resource-level way to enable Azure Hybrid Benefit is still available for SQL Server and is currently the only option for Windows Server. It involves a DevOps role selecting the benefit for each individual resource (like a SQL Database or Windows Server VM) when creating or managing it. Doing so results in the hourly cost of that resource being discounted. For more information, see [Azure Hybrid Benefit for Windows Server](/azure/azure-sql/azure-hybrid-benefit).

Enabling centralized management of Azure Hybrid Benefit of for SQL Server at a subscription or account scope level is currently in preview. It's available to enterprise customers and to customers that buy directly from Azure.com with a Microsoft Customer Agreement. We hope to extend the capability to Windows Server and more customers.

## Qualifying SQL Server licenses

SQL Server Enterprise and Standard core licenses with active Software Assurance qualify for this benefit. Plus, SQL Server core license subscriptions.

## Qualifying Azure resources

Centrally managing Azure Hybrid Benefit at a scope-level covers the following common Azure SQL resources:

- SQL Databases
- SQL Managed Instances
- SQL Elastic Pools
- SQL Server on Azure VMs

Resource-level Azure Hybrid Benefit management can cover all the above, too. It's currently the only option for covering the following resources:

- Azure Dedicated Hosts
- Azure Data Factory SQL Server Integration Services (SSIS)

## Centralized scope-level management advantages

You get the following:

- **A simpler, more scalable approach with better control** - The billing administrator directly assigns available licenses to one or more Azure scopes. The original approach, at a large scale, involves coordinating Azure Hybrid Benefit usage across many resources and DevOps owners.
- **An easy-to-use way to optimize costs** - An Administrator can monitor Azure Hybrid Benefit utilization and directly adjust licenses assigned to Azure. For example, an administrator might see an opportunity to save more money by assigning more licenses to Azure. Then they speak with their procurement department to confirm license availability. Finally, they can easily assign the licenses to Azure and start saving.
- **A better method to manage costs during usage spikes** - You can easily scale up the same resource or add more resources during temporary spikes. You don't need to assign more SQL Server licenses (for example, closing periods or increased holiday shopping). For short-lived workload spikes, pay-as-you-go charges for the extra capacity might cost less than acquiring more licenses to use Azure Hybrid Benefit for the capacity. Managing the benefit at a scope, rather than at a resource-level, helps you to decide based on aggregate usage.
- **Clear separation of duties to sustain compliance** - In the resource-level Azure Hybrid Benefit model, resource owners might select Azure Hybrid Benefit when there are no licenses available. Or, they might *not* select the benefit when there *are* licenses available. Scope-level management of Azure Hybrid Benefit solves this situation. The billing admins that manage the benefit centrally are positioned to confirm with procurement and software asset management departments how many licenses are available to assign to Azure. The point is illustrated by the following diagram.

:::image type="content" source="./media/overview-azure-hybrid-benefit-scope/duty-separation.svg" alt-text="Diagram showing the separation of duties." border="false" lightbox="./media/overview-azure-hybrid-benefit-scope/duty-separation.svg":::

## How licenses apply to Azure resources

Both SQL Server Enterprise (core) and SQL Server Standard (core) licenses with Software Assurance qualify but, as described in the [Microsoft Product Terms](https://www.microsoft.com/licensing/terms/productoffering/MicrosoftAzureServices/EAEAS), different conversion ratios apply when you bring them to Azure with Azure Hybrid Benefit.

One rule to understand: One SQL Server Enterprise Edition license has the same coverage as _four_ SQL Server Standard Edition licenses, across all qualified Azure SQL resource types.

To explain how it works further, the term _normalized core license_ or NCL is used. In alignment with the rule above, one SQL Server Standard core license produces one NCL. One SQL Server Enterprise core license produces four NCLs. For example, if you assign four SQL Server Enterprise core licenses and seven SQL Server Standard core licenses, your total coverage and Azure Hybrid Benefit discounting power is equal to 23 NCLs (4\*4+7\*1).

The following table summarizes how many NCLs you need to fully discount the SQL Server license cost for different resource types. Scope-level management of Azure Hybrid Benefit strictly applies the rules in the product terms, summarized below.

| **Azure Data Service** | **Service tier** | **Required number of NCLs** |
| --- | --- | --- |
| SQL Managed Instance or Instance pool | Business Critical | 4 per vCore |
| SQL Managed Instance or Instance pool | General Purpose | 1 per vCore |
| SQL Database or Elastic pool<sup>1</sup> | Business Critical | 4 per vCore |
| SQL Database or Elastic pool<sup>1</sup> | General Purpose | 1 per vCore |
| SQL Database or Elastic pool<sup>1</sup> | Hyperscale | 1 per vCore |
| Azure Data Factory SQL Server Integration Services | Enterprise | 4 per vCore |
| Azure Data Factory SQL Server Integration Services | Standard | 1 per vCore |
| SQL Server Virtual Machines<sup>2</sup> | Enterprise | 4 per vCPU |
| SQL Server Virtual Machines<sup>2</sup> | Standard | 1 per vCPU |

<sup>1</sup> *Azure Hybrid Benefit isn't available in the serverless compute tier of Azure SQL Database.*

<sup>2</sup> *Subject to a minimum of four vCore licenses per Virtual Machine.*

## Ongoing scope-level management

We recommend that you establish a proactive rhythm when centrally managing Azure Hybrid Benefit, similar to the following tasks and order:

- Engage within your organization to understand how many Azure SQL resources and vCores will be used during the next month, quarter, or year.
- Work with your procurement and software asset management departments to determine if enough SQL core licenses with Software Assurance are available. The benefit allows licenses supporting migrating workloads to be used both on-premises and in Azure for up to 180 days. So, those licenses can be counted as available.
- Assign available licenses to cover your current usage _and_ your expected usage growth during the upcoming period.
- Monitor assigned license utilization.
  - If it approaches 100%, then consult others in your organization to understand expected usage. Confirm license availability then assign more licenses to the scope.
  - If usage is 100%, you might be using resources beyond the number of licenses assigned. Return to the [Create license assignment experience](create-sql-license-assignments.md) and review the usage that Azure shows. Then assign additional available licenses to the scope for more coverage.
- Repeat the proactive process periodically.

## Next steps

- Follow the [Manage and optimize Azure Hybrid Benefit for SQL Server](tutorial-azure-hybrid-benefits-sql.md) tutorial.
- Learn about how to [transition to centrally managed Azure Hybrid Benefit](transition-existing.md).
- Review the [Centrally managed Azure Hybrid Benefit FAQ](faq-azure-hybrid-benefit-scope.yml).