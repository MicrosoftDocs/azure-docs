---
title: Tutorial - Optimize centrally managed Azure Hybrid Benefit for SQL Server
description: This tutorial guides you through proactively assigning SQL Server licenses in Azure to manage and optimize Azure Hybrid Benefit.
author: bandersmsft
ms.author: banders
ms.date: 10/12/2023
ms.topic: tutorial
ms.service: cost-management-billing
ms.subservice: ahb
ms.reviewer: chrisrin
---

# Tutorial: Optimize centrally managed Azure Hybrid Benefit for SQL Server

This tutorial guides you through proactively assigning SQL Server licenses in Azure to optimize [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-benefit/) as you centrally manage it. Optimizing your benefit reduces the costs of running Azure SQL.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Gather license usage and availability details
> * Buy more licenses if needed
> * Assign licenses to Azure
> * Monitor usage and adjust
> * Establish a management schedule

## Prerequisites

Before you begin, ensure that you:

Have read and understand the [What is centrally managed Azure Hybrid Benefit?](overview-azure-hybrid-benefit-scope.md) article. The article explains the types of SQL Server licenses that quality for Azure Hybrid Benefit. It also explains how to enable the benefit for the subscription or billing account scopes you select.

> [!NOTE]
> Managing Azure Hybrid Benefit centrally at a scope-level is limited to enterprise customers and customers buying directly from Azure.com with a Microsoft Customer Agreement.

Verify that your self-installed virtual machines running SQL Server in Azure are registered before you start to use the new experience. Doing so ensures that Azure resources that are running SQL Server are visible to you and Azure. For more information about registering SQL VMs in Azure, see [Register SQL Server VM with SQL IaaS Agent Extension](/azure/azure-sql/virtual-machines/windows/sql-agent-extension-manually-register-single-vm) and [Register multiple SQL VMs in Azure with the SQL IaaS Agent extension](/azure/azure-sql/virtual-machines/windows/sql-agent-extension-manually-register-vms-bulk).

## Gather license usage and availability details

_The first step is preparation._ Engage other departments in your organization to understand two things:

- What SQL Server usage in Azure is expected during the upcoming planning time frame?
- How many SQL Server core licenses with Software Assurance (or in subscription) were purchased and are available to assign to Azure?

Your recent Azure SQL usage details detected by the system are shown when you [create SQL Server license assignments for Azure Hybrid Benefit](create-sql-license-assignments.md).

We recommend that you consult the appropriate people in your organization to validate that information and confirm any planned SQL Server usage growth.

An optional, but useful, method to investigate your Azure SQL usage (including usage of Azure Hybrid Benefit at the resource level) is to use the Azure Hybrid Benefit [sql-license-usage PowerShell script](https://github.com/anosov1960/sql-server-samples/tree/master/samples/manage/azure-hybrid-benefit). It analyzes and tracks the combined SQL Server license usage of all the SQL resources in a specific subscription or an entire account.

### Determine the number of eligible SQL Server core licenses available to assign to Azure

The quantity depends on how many licenses, with Software Assurance or subscription, that you purchased and how many are already in use outside Azure, on-premises.

Your software procurement or software asset management department is likely to have this information.

> [!TIP]
> When you migrate a workload from on-premises to Azure, the associated licenses are available to assign to Azure. That's because while you're using Azure Hybrid Benefit, you're granted 180 days of dual use rights (on-prem + in Azure) for the SQL Server license during migration. It's to help you ensure that they run seamlessly.

## Buy more licenses if needed

After reviewing the information gathered, if you determine that the number of SQL Server licenses available is insufficient to cover planned Azure SQL usage, then talk to your procurement department to buy more SQL Server core licenses with Software Assurance (or subscription licenses).

Buying SQL Server licenses and applying Azure Hybrid Benefit is less expensive than paying for SQL Server by the hour in Azure. By purchasing enough licenses to cover all planned Azure SQL usage, your organization maximizes cost savings from the benefit.

## Assign licenses to Azure

1. Follow the instructions in the Azure portal and documentation to select at least one scope and assign SQL Server licenses to them. For more information, see [Create SQL Server license assignments for Azure Hybrid Benefit](create-sql-license-assignments.md).
2. As you assign licenses, review the detected Azure SQL usage again to verify that the details are consistent with other information gathered.

## Monitor usage and adjust

1. Navigate to **Cost Management + Billing** > **Reservations + Hybrid Benefits**.
1. A table is shown that includes the Azure Hybrid Benefit licenses assignments that you've made and the utilization percentage of each one.
1. If any of the utilization percentages are 100%, then your organization is paying hourly rates for some SQL Server resources. Engage with other groups in your organization again to confirm whether current usage levels are temporary or if they're expected to continue. If the latter, your organization should consider purchasing more licenses and assigning them to Azure to reduce cost.
1. If utilization approaches 100%, but doesn't exceed it, determine whether usage is expected to rise in the near term. If so, you can proactively acquire and assign more licenses.

## Establish a management schedule

The preceding section discusses ongoing monitoring. We also recommend that you establish an annual or quarterly schedule that you follow repeatedly. The schedule includes the major steps described in the article:

- Gather license usage and availability details.
- Buy more licenses if needed to cover upcoming usage growth.
- Assign licenses to Azure.
- Monitor usage and adjust on the fly, as needed.
- Repeat the process every year or at whatever frequency best suits your needs.

### License assignment review date

After you assign a license and set a review date, the license assignment automatically expires 90 days after the review date. The license assignment becomes inactive and no longer applies 90 days after expiration.

Microsoft sends email notifications:

- 90 days before expiration
- 30 days before expiration
- Seven days before expiration

Before the license assignment expires, you can set the review date to a future date so that you continue to receive the benefit. When the license assignment expires, you're charged with pay-as-you-go prices. To change the review date, use the following steps:

1. Sign in to the Azure portal and navigate to **Cost Management + Billing**.
2. Select a license assignment that you want to change the review date for.
3. Select the review date.
4. Fill the review date and select **Save**.

No notification is sent on the review date. 

## Example walkthrough

In the following example, assume that you're the billing administrator for the Contoso Insurance company. You manage Contoso's Azure Hybrid Benefit for SQL Server.

Your procurement department informs you that you can centrally manage Azure Hybrid Benefit for SQL server at an overall account level. Procurement learned about it from their Microsoft account team. You're interested because it's been challenging to manage Azure Hybrid Benefit lately. In part, because your developers have been enabling the benefit (or not) arbitrarily on resources as they share scripts with each other.

You locate the new Azure Hybrid Benefit experience in the Cost Management + Billing area of the Azure portal.

After you've read the preceding instructions in the article, you understand that:

  - Contoso needs to register SQL Server VMs before taking other actions.
  - The ideal way to use the new capability is to assign licenses proactively to cover expected usage.

Then, do the following steps.

1. Use the preceding instructions to make sure self-installed SQL VMs are registered. They include talking to subscription owners to complete the registration for the subscriptions where you don't have sufficient permissions.
1. You review Azure resource usage data from recent months and you talk to others in Contoso. You determine that 2000 SQL Server Enterprise Edition and 750 SQL Server Standard Edition core licenses, or 8750 normalized cores, are needed to cover expected Azure SQL usage for the next year. Expected usage also includes migrating workloads (1500 SQL Server Enterprise Edition + 750 SQL Server Standard Edition = 6750 normalized) and net new Azure SQL workloads (another 500 SQL Server Enterprise Edition or 2000 normalized cores).
1. Next, confirm with your with procurement team that the needed licenses are already available or that they're planned to get purchased. The confirmation ensures that the licenses are available to assign to Azure.
   - Licenses you have in use on premises can be considered available to assign to Azure if the associated workloads are being migrated to Azure. As mentioned previously, Azure Hybrid Benefit allows dual use for up to 180 days.
   - You determine that there are 1800 SQL Server Enterprise Edition licenses and 2000 SQL Server Standard Edition licenses available to assign to Azure. The available licenses equal 9200 normalized cores. That value is a little more than the 8750 needed (2000 x 4 + 750 = 8750).
1. Then, you assign the 1800 SQL Server Enterprise Edition and 2000 SQL Server Standard Edition to Azure. That action results in 9200 normalized cores that the system can apply to Azure SQL resources as they run each hour. Assigning more licenses than are required now provides a buffer if usage grows faster than you expect.

Afterward, you monitor assigned license usage periodically, ideally monthly. After 10 months, usage approaches 95%, indicating faster Azure SQL usage growth than you expected. You talk to your procurement team to get more licenses so that you can assign them.

Lastly, you adopt an annual license review schedule. In the review process, you:

- Gather and analyze license usage data.
- Confirm license availability.
- Work with your procurement team to get more licenses, if needed.
- Update license assignments.
- Monitor over time.

## Next steps

- Learn about how to [transition to centrally managed Azure Hybrid Benefit](transition-existing.md).
- Review the [Centrally managed Azure Hybrid Benefit FAQ](faq-azure-hybrid-benefit-scope.yml).