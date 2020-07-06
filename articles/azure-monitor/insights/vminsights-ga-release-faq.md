---
title: Azure Monitor for VMs (GA) frequently asked questions | Microsoft Docs
description: Azure Monitor for VMs is a solution in Azure that combines health and performance monitoring of the Azure VM operating system, as well as automatically discovering application components and dependencies with other resources and maps the communication between them. This article answers common questions about the GA release.
ms.subservice: 
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 01/31/2020

---

# Azure Monitor for VMs Generally Available (GA) Frequently Asked Questions
This General Availability FAQ covers changes that were made in Q4 2019 and Q1 2020 as we prepared for GA.

## Updates for Azure Monitor for VMs
We released a new version of Azure Monitor for VMs in January 2020 ahead of our GA announcement. Customers enabling Azure Monitor for VMs will now receive the GA version, but existing customers using the version of Azure Monitor for VMs from Q4 2019 and earlier will be prompted to upgrade. This FAQ offers guidance to perform an upgrade at scale if you have large deployments across multiple workspaces.


With this upgrade, Azure Monitor for VMs performance data are stored in the same *InsightsMetrics* table as [Azure Monitor for containers](container-insights-overview.md), which makes it easier for you to query the two data sets. Also, you are able to store more diverse data sets that we could not store in the table previously used. 

Our performance views are now using the data we store in the *InsightsMetrics* table.  If you have not yet upgraded to use the latest VMInsights solution on your workspace, your charts will no longer display information.  You can upgrade from our **Get Started** page as described below.


## What is changing?
We have released a new solution, named VMInsights, that includes additional capabilities for data collection along with a new location for storing this data in your Log Analytics workspace. 

In the past, we enabled the ServiceMap solution on your workspace and setup performance counters in your Log Analytics workspace to send the data to the *Perf* table. This new solution sends the data to a table named *InsightsMetrics* that is also used by Azure Monitor for containers. This table schema allows us to store additional metrics and service data sets that are not compatible with the *Perf* table format.

We have updated our Performance charts to use the data we store in the *InsightsMetrics* table. You can upgrade to use the *InsightsMetrics* table from our **Get Started** page as described below.


## How do I upgrade?
When a Log Analytics workspace is upgraded to the latest version of Azure Monitor to VMs, it will upgrade the dependency agent on each of the VMs attached to that workspace. Each VM requiring upgrade will be identified in the **Get Started** tab in Azure Monitor for VMs in the Azure portal. When you choose to upgrade a VM, it will upgrade the workspace for that VM along with any other VMs attached to that workspace. You can select a single VM or multiple VMs, resource groups, or subscriptions. 

Use the following command to upgrade a workspace using PowerShell:

```PowerShell
Set-AzureRmOperationalInsightsIntelligencePack -ResourceGroupName <resource-group-name> -WorkspaceName <workspace-name> -IntelligencePackName "VMInsights" -Enabled $True
```

## What should I do about the Performance counters in my workspace if I install the VMInsights solution?

The previous method of enabling Azure Monitor for VMs used performance counters in your workspace. The current version stores this data in a table named `InsightsMetrics`. You may choose to disable these performance counters in your workspace if you no longer need to use them. 

>[!NOTE]
>If you have Alert Rules that reference these counters in the `Perf` table, you need to update them to reference new data stored in the `InsightsMetrics` table. Refer to our documentation for example log queries that you can use that refer to this table.
>

If you decide to keep the performance counters enabled, you will be billed for the data ingested and stored in the `Perf` table based on [Log Analytics pricing[(https://azure.microsoft.com/pricing/details/monitor/).

## How will this change affect my alert rules?

If you have created [Log alerts](../platform/alerts-unified-log.md) that query the `Perf` table targeting performance counters that were enabled in the workspace, you should update these rules to refer to the `InsightsMetrics` table instead. This guidance also applies to any log search rules using `ServiceMapComputer_CL` and `ServiceMapProcess_CL`, because those data sets are moving to `VMComputer` and `VMProcess` tables.

We will update this FAQ and our documentation to include example log search alert rules for the data sets we collect.

## How will this affect my bill?

Billing is still based on data ingested and retained in your Log Analytics workspace.

The machine level performance data that we collect is the same, is of a similar size to the data we stored in the `Perf` table, and will cost approximately the same amount.

## What if I only want to use Service Map?

That is fine. You will see prompts in the Azure portal when viewing Azure Monitor for VMs about the upcoming update. Once released, you will receive a prompt requesting that you update to the new version. If you prefer to only use the [Maps](vminsights-maps.md) feature, you can choose not to upgrade and continue to use the Maps feature in Azure Monitor for VMs and the Service Map solution accessed from your workspace or dashboard tile.

If you chose to manually enable the performance counters in your workspace, then you may be able to see data in some of our performance charts viewed from Azure Monitor. Once the new solution is released we will update our performance charts to query the data stored in the `InsightsMetrics` table. If you would like to see data from that table in these charts, you will need to upgrade to the new version of Azure Monitor for VMs.

The changes to move data from `ServiceMapComputer_CL` and `ServiceMapProcess_CL` will affect both Service Map and Azure Monitor for VMs, so you still need to plan for this update.

If you chose to not upgrade to the **VMInsights** solution, we will continue to provide legacy versions of our performance workbooks that refer to data in the `Perf` table.  

## Will the Service Map data sets also be stored in InsightsMetrics?

The data sets will not be duplicated if you use both solutions. Both offerings share the data sets that will be stored in `VMComputer` (formerly ServiceMapComputer_CL), `VMProcess` (formerly ServiceMapProcess_CL), `VMConnection`, and `VMBoundPort` tables to store the map data sets that we collect.  

The `InsightsMetrics` table will store VM, process, and service data sets that we collect and will only be populated if you are using Azure Monitor for VMs and the VM Insights solution. The Service Map solution will not collect or or store data in the `InsightsMetrics` table.

## Will I be double charged if I have the Service Map and VMInsights solutions in my workspace?

No, the two solutions share the map data sets that we store in `VMComputer` (formerly ServiceMapComputer_CL), `VMProcess` (formerly ServiceMapProcess_CL), `VMConnection`, and `VMBoundPort`. You will not be double charged for this data if you have both solutions in your workspace.

## If I remove either the Service Map or VMInsights solution will it remove my data?

No, the two solutions share the map data sets that we store in `VMComputer` (formerly ServiceMapComputer_CL), `VMProcess` (formerly ServiceMapProcess_CL), `VMConnection`, and `VMBoundPort`. If you remove one of the solutions, these data sets notice that there is still a solution in place that uses the data and it remains in the Log Analytics workspace. You need to remove both solutions from your workspace in order for the data to be removed from it.

## Health feature is in limited public preview

We have received a lot of great feedback from customers about our VM Health feature set. There is a lot of interest around this feature and excitement over its potential for supporting monitoring workflows. We are planning to make a series of changes to add functionality and address the feedback we have received. 

To minimize impact of these changes to new customers, we have moved this feature into a **limited public preview**. This update happened in October 2019.

We plan to re-launch this Health feature in 2020, after Azure Monitor for VMs is in GA.

## How do existing customers access the Health feature?

Existing customers that are using the Health feature will continue to have access to it, but it will not be offered to new customers.  

To access the feature, you can add the following feature flag `feature.vmhealth=true` to the Azure portal URL [https://portal.azure.com](https://portal.azure.com). Example `https://portal.azure.com/?feature.vmhealth=true`.

You can also use this short url, which sets the feature flag automatically: [https://aka.ms/vmhealthpreview](https://aka.ms/vmhealthpreview).

As an existing customer, you can continue to use the Health feature on VMs that are connected to an existing workspace setup with the health functionality.  

## I use VM Health now with one environment and would like to deploy it to a new one

If you are an existing customer that is using the Health feature and want to use it for a new roll-out, please contact us at vminsights@microsoft.com to request instructions.

## Next steps

To understand the requirements and methods that help you monitor your virtual machines, review [Deploy Azure Monitor for VMs](vminsights-enable-overview.md).
