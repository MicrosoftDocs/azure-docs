---
title: Project Flash - Use Azure Resource Health to monitor Azure Virtual Machine availability
description: This article covers important concepts for monitoring Azure virtual machine availability using Azure Resource Health.
ms.service: virtual-machines
ms.author: tomcassidy
author: tomvcassidy
ms.custom: subject-monitoring
ms.date: 01/31/2024
ms.topic: conceptual
---

# Project Flash - Use Azure Resource Health to monitor Azure Virtual Machine availability

Azure Resource Health is one solution offered by Flash. Flash is the internal name for a project dedicated to building a robust, reliable, and rapid mechanism for customers to monitor virtual machine (VM) health.

This article covers the use of Azure Resource Health to monitor Azure Virtual Machine availability. For a general overview of Flash solutions, see the [Flash overview](flash-overview.md).

For documentation specific to the other solutions offered by Flash, choose from the following articles:
* [Use Azure Resource Graph to monitor Azure Virtual Machine availability](flash-azure-resource-graph.md)
* [Use Event Grid system topics to monitor Azure Virtual Machine availability](flash-event-grid-system-topic.md)
* [Use Azure Monitor to monitor Azure Virtual Machine availability](flash-azure-monitor.md)

## Azure Resource Health

It offers immediate and user-friendly health checks for individual resources through the portal. Customers can quickly access the [resource health](../service-health/resource-health-overview.md) blade on the portal and also review a 30-day historical record of health checks, making it an excellent tool for fast and straightforward troubleshooting. The existing Azure Resource Health feature helps you to diagnose and get support for service problems that affect your Azure resources. It reports on the current and past health of your resources, showing any time ranges that each of your resources have been unavailable.

But we know that our customers and partners are interested in understanding what causes underlying technical issues, and in improving how they can receive communications about any issues—to feed into monitoring processes, to explain hiccups to other stakeholders, and ultimately to inform business decisions.

### Root causes for VM issues in Azure Resource Health

We recently shipped an improvement to the resource health experience that will enhance the information we share with customers about VM failures and provide further context on the root cause that led to the issue. Now, in addition to getting a fast notification when a VM's availability is impacted, customers can expect a root cause to be added at a later point once our automated Root Cause Analysis (RCA) system identifies the failing Azure platform component that led to the VM failure. Let's walk through an example to see how this works process in practice:

At time T1, a server rack goes offline due to a networking issue, causing VMs on the rack to lose connectivity. Recent reliability improvements related to network architecture will be shared in a future [Advancing Reliability](https://www.aka.ms/AdvancingReliability) blog post—watch this space!

At time T2, Azure's internal monitoring recognizes that it's unable to reach VMs on the rack and begins to mitigate by redeploying the impacted VMs to a new rack. During this time, an annotation is sent to resource health notifying customers that their VM is currently impacted and unavailable.

   :::image type="content" source="media/flash/azure-portal-resource-health-history.png" alt-text="Screenshot of the Azure portal resource health blade showing the health history of a resource." lightbox="media/flash/azure-portal-resource-health-history.png" :::

At time T3, platform telemetry from the top of rack switch, the host machine, and internal monitoring systems are correlated together in our RCA engine to derive the root cause of the failure. Once computed, the RCA is then published back into resource health along with relevant architectural resiliency recommendations that customers can implement to minimize the probability of impact in the future.

   :::image type="content" source="media/flash/azure-portal-resource-health-history-root-cause.png" alt-text="Screenshot of the Azure portal health history blade showing root cause details for an example of a VM issue." lightbox="media/flash/azure-portal-resource-health-history-root-cause.png" :::

While the initial downtime notification functionality is several years old, the publishing of a root cause statement is a new addition. Now, let's dive into the details of how we derive these root causes.

### Root Cause Analysis engine

Let's take a closer look at the prior example and walk through the details of how the RCA engine works and the technology behind it. At the core of our RCA engine for VMs is [Azure Data Explorer](/azure/data-explorer/data-explorer-overview) (ADX), a big data service optimized for high volume log telemetry analytics. Azure Data Explorer enables the ability to easily parse terabytes of log telemetry from devices and services that comprise the Azure platform, join them together, and interpret the correlated information streams to derive a root cause for different failure scenarios. This ends up being a multistep data engineering process:

Phase 1: Detecting downtime

The first phase in root cause analysis is to define the trigger under which the analysis is executed. For Virtual Machines, we want to determine root causes whenever a VM unexpectedly reboots, so the trigger is a VM transitioning from an up state to a down state. Identifying these transitions from platform telemetry is straightforward in most scenarios, but more complicated around certain kinds of infrastructure failure where platform telemetry might get lost due to device failure or power loss. To handle these classes of failures, other techniques are required—like tracking data loss as a possible indication of a VM availability transition. Azure Data Explorer excels at this time of series analysis, and a more detailed look at techniques around this process can be found in the Microsoft Tech Community: [Calculating downtime using Window functions and Time Series functions in Azure Data Explorer](https://techcommunity.microsoft.com/t5/azure-data-explorer/calculating-downtime-using-window-functions-and-time-series/ba-p/1345430).

Phase 2: Correlation analysis

Once a trigger event is defined (in this case, a VM transitioning to an unhealthy state) the next phase is correlation analysis. In this step, we use the presence of the trigger event to correlate telemetry from points across the Azure platform, like:

- Azure host: the physical blade hosting VMs.
- TOR: the top of rack network switch.
- Azure Storage: the service that hosts Virtual Disks for Azure Virtual Machines.

Each of these systems has their own telemetry feeds that need to get parsed and correlated with the VM downtime trigger event. This process is done through understanding the dependency graph for a VM and the underlying systems that can cause a VM to fail, and then joining all these dependent systems' health telemetry together, filtered on events that occurred close to the time of the VM transition. Azure Data Explorer's intuitive and powerful query language helps by offering documented patterns like [time window join](/azure/data-explorer/kusto/query/join-timewindow) for correlating temporal telemetry streams together. At the end of this correlation process, we have a dataset that represents VM downtime transitions with correlated platform telemetry from all the dependent systems that could cause or could have information useful in determining what led to the VM failure.

Phase 3: Root cause attribution

The next step in the process is attribution. Now that we've collected all the relevant data together in a single dataset, attribution rules get applied to interpret the information and translate it into a customer-facing root cause statement. If you go back to our original example of a TOR failure, after our correlation analysis we might have many interesting pieces of information to interpret. For example, systems monitoring the Azure hosts might have logs indicating they lost connectivity to the hosts during this time. We might also have signals related to virtual disk connectivity problems, and explicit signals from the TOR device about the failure. All these pieces of information are now scanned over, and the explicit TOR failure signal is prioritized over the other signals as the root cause. This prioritization process, and the rules behind it, are constructed with domain experts and modified as the Azure platform evolves. Machine learning and anomaly detection mechanisms sit on top of these attributed root causes, to help identify opportunities to improve these classification rules and detect pattern changes in the rate of these failures to feed back into [safe deployment pipelines](https://azure.microsoft.com/blog/advancing-safe-deployment-with-aiops-introducing-gandalf/).

Phase 4: RCA publishing

The last step is publishing root causes to Azure Resource Health, where they become visible to customers. Publishing is done by a simple [Azure Functions](https://azure.microsoft.com/services/functions/) application, which periodically queries the processed root cause data in Azure Data Explorer, and emits the results to the resource health backend. Because information streams can come in with various data delays, RCAs can occasionally be updated in this process to reflect better sources of information having arrived leading to a more specific root cause that what was originally published.

### Going forward

Identifying and communicating the root cause of any issues to our customers and partners is just the beginning. Our customers may need to take these RCAs and share them with their customers and coworkers. We want to build on the work here to make it easier to identify and track resource RCAs, and easily share them out. To accomplish that, we're working on backend changes to generate unique per-resource and per-downtime tracking IDs that we can expose to you, so that you can easily match downtimes to their RCAs. We're also working on new features to make it easier to email RCAs out, and eventually subscribe to RCAs for your VMs. This feature will make it possible to sign up for RCAs directly in your inbox after an unavailability event with no further action needed on your part.

## Next steps

To learn more about the solutions offered, proceed to corresponding solution article:
* [Use Azure Resource Graph to monitor Azure Virtual Machine availability](flash-azure-resource-graph.md)
* [Use Event Grid system topics to monitor Azure Virtual Machine availability](flash-event-grid-system-topic.md)
* [Use Azure Monitor to monitor Azure Virtual Machine availability](flash-azure-monitor.md)

For a general overview of how to monitor Azure Virtual Machines, see [Monitor Azure virtual machines](monitor-vm.md) and the [Monitoring Azure virtual machines reference](monitor-vm-reference.md).