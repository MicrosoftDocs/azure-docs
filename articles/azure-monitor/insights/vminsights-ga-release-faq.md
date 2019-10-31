---
title: Azure Monitor for VMs (GA) frequently asked questions | Microsoft Docs
description: Azure Monitor for VMs is a solution in Azure that combines health and performance monitoring of the Azure VM operating system, as well as automatically discovering application components and dependencies with other resources and maps the communication between them. This article answers common questions about the GA release.
ms.service:  azure-monitor
ms.subservice: 
ms.topic: conceptual
author: mgoedtel
ms.author: magoedte
ms.date: 10/07/2019

---

# Azure Monitor for VMs Generally Available (GA) Frequently Asked Questions

We recently announced on the [Azure Update](https://azure.microsoft.com/blog/) blog some planned changes that will be occurring in October and November 2019. More details about these changes are covered in this General Availability FAQ.

## Updates for Azure Monitor for VMs

We are releasing a new version of Azure Monitor for VMs in November. Customers enabling Azure Monitors for VMs after this release automatically receive the new version, but existing customers already using Azure Monitor for VMs are prompted to upgrade.  This FAQ and our documentation offers guidance to perform a bulk upgrade if you have large deployments across multiple workspaces.

With this upgrade, Azure Monitor for VMs performance datasets are now stored in the same `InsightsMetrics` table as [Azure Monitor for containers](container-insights-overview.md), and make it easier for you to query the two data sets. Also, you are able to store more diverse data sets that we could not store in the table we previously used.  Our performance views will also be updated to use this new table.

We are moving to new data types for our connection data sets. Data presently stored in `ServiceMapComputer_CL` and `ServiceMapProcess_CL`, which are using custom log tables, will move to dedicated data types named `VMComputer` and `VMProcess`.  By moving to dedicated data types we can give these priority for data ingestion and the table schema will be standardized across all customers.

We realize that asking existing customers to upgrade causes disruption to their workflow, which is why we have chosen to do this now while in Public Preview rather than later once we arrive in GA.

## What will change?

Currently when you complete the onboarding process for Azure Monitor for VMs, you enable the Service Map solution on the workspace you selected to store your monitoring data, and then configure performance counters for the data we collect from your VMs. In the upcoming weeks we will be releasing a new solution, named **VMInsights**, that will include additional capabilities for data collection along with a new location for storing this data in Log Analytics.

Our current process of using performance counters in your workspace sends the data to the Perf table in Log Analytics.  This new solution will send the data to a table named `InsightsMetrics` that is also used by Azure Monitor for containers. This table schema allows us to store additional metrics and service data sets that are not compatible with the Perf table format.

## What should I do about the Performance counters on my workspace if I install the VMInsights solution?

The current method of enabling Azure Monitor for VMs uses performance counters in your workspace. The new method stores this data in a new table, named `InsightsMetrics`.

Once we update our user interface to use the data in InsightsMetrics, we will update our documentation, and communicate this announcement via multiple channels, including displaying a banner in the Azure portal. At that point, you may choose to disable these [performance counters](vminsights-enable-overview.md#performance-counters-enabled) in your workspace if you no longer want to use them. 

[!NOTE]
>If you have Alert Rules that reference these counters in the Perf table, you need to update them to refer to the new data in the `InsightsMetrics` table.  Refer to our documentation for example log queries that you can use that refer to this table.

If you decide to keep the performance counters enabled, you will be billed for the data ingested and retained into the Perf table based on [Log Analytics pricing[(https://azure.microsoft.com/pricing/details/monitor/).

## How will this change affect my alert rules?

If you have created [Log alerts](../platform/alerts-unified-log.md) that query the `Perf` table targeting performance counters that were enabled on the workspace, you should update these rules to refer to the `InsightsMetrics` table instead. This guidance also applies to any log search rules using `ServiceMapComputer_CL` and `ServiceMapProcess_CL`, because those data sets are moving to `VMComputer` and `VMProcess` tables.

We will update this FAQ and our documentation to include example log search alert rules for the data sets we collect.

## Will there be any changes to billing?

The billing is still based on data ingested and retained in your Log Analytics workspace.

The machine level performance data that we collect is the same, is of a similar size to the data we stored in the Perf table, and will cost approximately the same amount.

## What if I only want to use Service Map?

That is fine.  You will see prompts in the Azure portal when viewing Azure Monitor for VMs about the upcoming update. Once released, you receive a prompt requesting you update to the new version. If you prefer to only use the [Maps](vminsights-maps.md) feature, then you can choose not to upgrade and continue to use the Maps feature Azure Monitor for VMs and the Service Map solution accessed from your workspace or dashboard tile.

If you chose to manually enable the performance counters in your workspace, then you may be able to see data in some of our performance charts viewed from Azure Monitor. Once the new solution is released we will update our performance charts to query the data stored in the `InsightsMetrics` table. If you would like to see data from that table in these charts, you will need to upgrade to the new version of Azure Monitor for VMs.

The changes to move data from `ServiceMapComputer_CL` and `ServiceMapProcess_CL` will affect both Service Map and Azure Monitor for VMs, so you still need to plan for this update.

If you chose to not upgrade to the **VMInsights** solution, we will continue to provide legacy versions of our performance workbooks that refer to data in the `Perf` table.  

## Will the Service Map data sets also be stored in InsightsMetrics?

The data sets will not be duplicated if you use both solutions. Both offerings share the data sets that will be stored in `VMComputer` (formerly ServiceMapComputer_CL), `VMProcess` (formerly ServiceMapProcess_CL), `VMConnection`, and `VMBoundPort` tables to store the map data sets that we collect.  

The `InsightsMetrics` table will be used to store VM, process, and service data sets that we collect and will only be populated if you are using Azure Monitor for VMs.

## Will I be double charged if I have the Service Map and VMInsights solutions on my workspace?

No, the two solutions share the map data sets that we store in `VMComputer` (formerly ServiceMapComputer_CL), `VMProcess` (formerly ServiceMapProcess_CL), `VMConnection`, and `VMBoundPort`.  You will not be double charged for this data if you have both solutions in your workspace.

## If I remove either the Service Map or VMInsights solution will it remove my data in Log Analytics?

No, the two solutions share the map data sets that we store in `VMComputer` (formerly ServiceMapComputer_CL), `VMProcess` (formerly ServiceMapProcess_CL), `VMConnection`, and `VMBoundPort`.  If you remove one of the solutions, these data sets notice that there is still a solution in place that uses the data and it remains in Log Analytics.  You need to remove both solutions from your workspace for the data to be removed from your Log Analytics workspace.

## When will this update be released?

We expect to release the update for Azure Monitor for VMs in mid-November. As we get closer to the release date we'll post updates here and present notifications in the Azure portal when you navigate to Azure Monitor.

## Health feature to enter limited public preview

We have received a lot of great feedback from customers about our VM Health feature set.  There is a lot of interest around this feature and excitement over its potential for supporting monitoring workflows. We are planning to make a series of changes to add functionality and address the feedback we have received. To minimize impact of these changes to new customers, we are moving this feature into a limited public preview.

This transition will begin in early October and should be completed by the end of the month.

Some of the areas we will be focusing on:

- More control over the health model and it’s thresholds
- Authoring at scale health models that apply to a scope of VMs
- Native use of the alerts platform for managing health based alert rules
- Ability to see health across a wider scope, such as one or more subscriptions
- Reduced latency in health transitions and alert notifications

## How do existing customers access the Health feature?

Existing customers that are using the Health feature will continue to have access to it, but it will not be offered to new customers.  

To access the feature, you can add the following feature flag `feature.vmhealth=true` to the portal URL [https://portal.azure.com](https://portal.azure.com). Example `https://portal.azure.com/?feature.vmhealth=true`.

You can also use this short url, which sets the feature flag automatically: [https://aka.ms/vmhealthpreview](https://aka.ms/vmhealthpreview).

As an existing customer, you can continue to use the Health feature on VMs that are connected to an existing workspace setup with the health functionality.  

## I use VM Health now with one environment and would like to deploy it for a new environment

If you are an existing customer that is using the Health feature and want to use it for a new roll-out, please contact us at vminsights@microsoft.com to request instructions.

## Next steps

To understand the requirements and methods that help you monitor your virtual machines, review [Deploy Azure Monitor for VMs](vminsights-enable-overview.md).
