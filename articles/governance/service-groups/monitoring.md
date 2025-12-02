---
title: Monitoring Service Groups with Azure Monitor
description: Learn how to monitor the health and performance of Azure Service Groups using Azure Monitor within the Azure portal. 
author: lauradolan
ms.author: ladolan
ms.service: azure-policy 
ms.topic: conceptual
ms.date: 11/19/2025

---

# Monitoring Service Groups with Azure Monitor (preview)

> [!IMPORTANT]
> These Azure Monitor features for Azure Service Groups are currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

[Azure Monitor](/azure/governance/service-groups/overview) provides a set of experiences and tools to monitor the health and performance of workloads in Azure Service Groups. You can view Azure Monitor insights for resources in your service group directly from the Azure portal. You can also explore relevant signals to help your workload perform as expected.

## Access service group monitoring

The monitoring experience is available under Service Groups in the [Azure portal](https://portal.azure.com).

You must also have an existing service group to monitor. For more information, see the quickstart to [create a service group in the Azure portal](create-service-group-portal.md).

1. Sign in to the [Azure portal](https://portal.azure.com) and search for **Service groups**.
1. On the **Service groups** page, select the resource that you want to monitor.
1. In the sidebar menu for the resource, select **Monitor** then **Monitoring**.

On the **Monitoring** page for your resource, the **Overview** tab is shown. This tab has the following tiles: 

- **Issues in the last day (trend)** to [see and investigate active issues and trends](#find-and-investigate-issues). 
- **Application Map** to [view your application map](#view-application-maps).
- **Availability tests** to [run availability tests](#run-availability-tests)

The monitoring experience only shows insights for resources in the selected service group. Insights from child and/or nested service groups aren't included.

If you want to provide feedback, you can also select the **Feedback** button at the top of the **Monitoring** page. 

## Find and investigate issues

To see a breakdown of issues for a service group, go to the **Overview** tab on the **Monitoring** page for the service group. In the **Issues in the last day (trend)** tile, there's a trendline of created issues and counts of active issues. If there are no issues, no trendline is shown. The tile also shows [**Total alerts**](#view-alerts).

You can select one of the following issue types for more information, or select the button **See all issues**.

- **Total issues**
- **Critical**
- **Error**
- **Warning**
- **Informational**
- **Verbose**

[Azure Monitor issues and investigations](/azure/azure-monitor/aiops/aiops-issue-and-investigation-how-to), which are [Artificial Intelligence for IT Operations (AIOps)](/azure/azure-monitor/aiops/aiops-machine-learning) capabilities, provides details about the issues. The AI-based investigation automates the troubleshooting processes for Azure monitor alerts on resources. You get a summary of the problem, evidence, and next steps to fix each issue.   

## View alerts

To see [Azure Monitor alerts](/azure/azure-monitor/alerts/alerts-overview) alerts for resources in your service group, go to the **Overview** tab on the **Monitoring** page for the service group. In the **Issues in the last day (trend)** tile, select **Total alerts** to open the alerts pane. This view shows a list of active alerts that you can search or filter. 

There's a count by severity of active alerts fired on the service group or its members. You can select an alert to view more details. You can then trigger an investigation on an alert and automatically create an issue.

## View application maps

An [application map](/azure/azure-monitor/app/app-map) shows performance bottlenecks or failure hotspots in your service groups, such as dependencies, roles, or other Application Insights resources in your service group. You can also turn on the [**Intelligent view** feature](/azure/azure-monitor/app/app-map#explore-intelligent-view) to show probable causes for service failures using machine learning to identify patterns and anomalies. You can also scope your map by using filters to see only relevant nodes and edges.

To use application maps, you must have an Application Insights resource in your service group. You can use an existing resource or create a new one. 

To view the application map for resources in your service group, go to the **Overview** tab on the **Monitoring** page for the service group. In the **Application Map** tile, select **View App Map**.

If your application runs on an Azure Kubernetes Service (AKS) cluster or virtual machine, the application map shows compute details.

## Run availability tests

You can use the [availability tests](/azure/azure-monitor/app/availability) to monitor resources in your service group for responsiveness and uptime. Synthetic HTTP requests are sent at regular intervals from Azure datacenters to your application endpoints. This monitoring can help you detect failures and performance for a reliable experience across your services. You can configure test frequency, locations, and alerts based on critical paths and user locations.

To run availability tests, you must have an Application Insights resource in your service group. You can use an existing resource or create a new one. Then, configure availability tests through Application Insights in the Azure portal.

To see availability tests with your service group, go to the **Overview** tab on the **Monitoring** page for the service group. In the **Availability tests** tile, you can see the percent of successful tests over the last day, and how many tests are running.

Select **View details** to get more information on the availability tests for your resource.

## Monitoring coverage and recommendations

There are two types of monitoring available for service groups:

- **Basic monitoring** is the standard monitoring setting, which is enabled by default when you create a resource.
- **Enhanced monitoring** is the monitoring setting recommended by Microsoft. This setting might result in [extra costs](#costs).

Currently, only Azure Virtual Machines and AKS resources are supported for service group monitoring coverage and recommendations.

To see coverage and recommendations for monitoring your service group, go to the **Coverage + recommendations** tab in the **Monitoring** page for the service group. 

The **Monitoring coverage across all resources** tile helps you spot potential gaps in your monitoring. The chart shows the number and percentage of resources in your service group that have basic monitoring and enhanced monitoring. For more information, select **View monitoring details**. 

The **Monitoring coverage by resource type** tile shows what type of monitoring is applied to resources. The chart shows the number of each resource type with enhanced monitoring and basic monitoring. For more information, select **View monitoring details**. 

The **Monitoring recommendations** tile shows which monitoring enhancements you can apply at scale to close coverage gaps. If there are no supported resources in the service group, no recommendations are displayed. 

The table shows a description of each recommendation, which you can select for more details. The number and type of impacted resources are also listed along with the severity level. You can select the **Apply** button next to each recommendation to apply the suggested change automatically. 

## Costs

If you use Azure Monitor with Service Groups, there might be extra costs for enhanced monitoring, data collection, and storage depending on your configuration and data volume. For more information, see [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/).