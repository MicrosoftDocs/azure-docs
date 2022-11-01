---
# Mandatory fields.
title: "Troubleshoot resource health and performance"
titleSuffix: Azure Digital Twins
description: Tips for troubleshooting the resource health and performance of an Azure Digital Twins instance.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 11/1/2022
ms.topic: troubleshooting
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Troubleshoot Azure Digital Twins resource health and performance

If you're experiencing delays or other performance issues when working with Azure Digital Twins, use this article to help you troubleshoot the health and performance of your Azure Digital Twins resource.

## Troubleshoot resource health

[Azure Service Health](../service-health/index.yml) is a suite of experiences that can help you diagnose and get support for service problems that affect your Azure resources. It contains resource health, service health, and status information, and reports on both current and past health information. This section contains tips for using this health information with Azure Digital Twins.

### Use Azure Resource Health

[Azure Resource Health](../service-health/resource-health-overview.md) can help you monitor whether your Azure Digital Twins instance is up and running. You can also use it to learn whether a regional outage is impacting the health of your instance.

To check the health of your instance, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) and navigate to your Azure Digital Twins instance. You can find it by typing its name into the portal search bar. 

2. From your instance's menu, select **Resource health** under **Support + troubleshooting**. This will take you to the page for viewing resource health history. 

    :::image type="content" source="media/troubleshoot-health-performance/resource-health.png" alt-text="Screenshot showing the 'Resource health' page. There is a 'Health history' section showing a daily report from the last nine days.":::

In the image above, this instance is showing as **Available**, and has been for the past nine days. To learn more about the Available status and the other status types that may appear, see [Resource Health overview](../service-health/resource-health-overview.md).

You can also learn more about the different checks that go into resource health for different types of Azure resources in [Resource types and health checks in Azure resource health](../service-health/resource-health-checks-resource-types.md).

### Use Azure Service Health

[Azure Service Health](../service-health/index.yml) is a suite of experiences that can help you diagnose and get support for service problems that affect your Azure resources. It contains resource health, service health, and status information, and reports on both current and past health information.
[Azure Service Health](../service-health/service-health-overview.md) can help you check the health of the entire Azure Digital Twins service in a certain region, and be aware of events like ongoing service issues and upcoming planned maintenance.

To check service health, sign in to the [Azure portal](https://portal.azure.com) and navigate to the **Service Health** service. You can find it by typing "service health" into the portal search bar. 

You can then filter service issues by subscription, region, and service.

For more information on using Azure Service Health, see [Service Health overview](../service-health/service-health-overview.md).

### Use Azure status

The [Azure status](../service-health/azure-status-overview.md) page provides a global view of the health of Azure services and regions. While Azure Service Health and Azure Resource Health are personalized to your specific resource, Azure status has a larger scope and can be useful to understand incidents with wide-ranging impact.

To check Azure status, navigate to the [Azure status](https://azure.status.microsoft/status/) page. The page displays a table of Azure services along with health indicators per region. You can view Azure Digital Twins by searching for its table entry on the page.

For more information on using the Azure status page, see [Azure status overview](../service-health/azure-status-overview.md).

## Troubleshoot performance

This section contains tips for troubleshooting performance issues with an Azure Digital Twins resource.

### Isolate the source of the delay

Determine whether the delay is coming from Azure Digital Twins or another service in your solution. To investigate this delay, you can use the **API Latency** metric in [Azure Monitor](../azure-monitor/essentials/quick-monitor-azure-resource.md) through the Azure portal. For more about Azure Monitor metrics for Azure Digital Twins, see [Azure Digital Twins metrics and alerts](how-to-monitor.md#metrics-and-alerts).

### Check regions

If your solution uses Azure Digital Twins in combination with other Azure services (like Azure Functions), check the region for the deployment of each service. Services that are deployed in different regions may add delays across your solution. Unless you're intentionally creating a distributed solution, consider deploying all service instances within the same region to avoid accidentally introducing delays.

### Check logs

Azure Digital Twins can collect logs for your service instance to help monitor its performance, among other data. Logs can be sent to [Log Analytics](../azure-monitor/logs/log-analytics-overview.md) or your custom storage mechanism. To enable logging in your instance, use the instructions in [Diagnostic settings in Azure Monitor](../azure-monitor/essentials/diagnostic-settings.md). You can analyze the timestamps on the logs to measure latencies, evaluate if they're consistent, and understand their source.

### Check API frequency

Another factor that might affect performance is time taken to reauthorize API calls. Consider the frequency of your API calls. If there's a gap of more than 15 minutes between calls, the system may be reauthorizing with each call, taking up extra time to do so. You can prevent this issue by adding a timer or something similar in your code to ensure that you call into Azure Digital Twins at least once every 15 minutes.

### Contact support

If you're still experiencing performance issues after troubleshooting with the steps above, you can create a support request from Azure Help + Support for more troubleshooting assistance. 

Follow these steps:

1. Gather [metrics](how-to-monitor.md#metrics-and-alerts) and [logs](how-to-monitor.md#diagnostics-logs) for your instance.
2. Navigate to [Azure Help + support](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest) in the Azure portal. Use the prompts to provide details of your issue, see recommended solutions, share your metrics/log files, and submit any other information that the support team can use to help investigate your issue. For more information on creating support requests, see [Create an Azure support request](../azure-portal/supportability/how-to-create-azure-support-request.md).

## Next steps

Read about other ways to monitor your Azure Digital Twins instance to help with troubleshooting in [Monitor your Azure Digital Twins instance](how-to-monitor.md).