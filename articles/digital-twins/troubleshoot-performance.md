---
# Mandatory fields.
title: "Troubleshoot performance"
titleSuffix: Azure Digital Twins
description: Tips for troubleshooting performance of an Azure Digital Twins instance.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 03/10/2022
ms.topic: troubleshooting
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Troubleshoot Azure Digital Twins performance

If you're experiencing delays or other performance issues when working with Azure Digital Twins, use the tips in this article to help you troubleshoot.

## Isolate the source of the delay

Determine whether the delay is coming from Azure Digital Twins or another service in your solution. To investigate this delay, you can use the **API Latency** metric in [Azure Monitor](../azure-monitor/essentials/quick-monitor-azure-resource.md) through the Azure portal. For instructions on how to view Azure Monitor metrics for an Azure Digital Twins instance, see [Monitor with metrics](how-to-monitor-metrics.md).

## Check regions

If your solution uses Azure Digital Twins in combination with other Azure services (like Azure Functions), check the region for the deployment of each service. Services that are deployed in different regions may add delays across your solution. Unless you're intentionally creating a distributed solution, consider deploying all service instances within the same region to avoid accidentally introducing delays.

## Check logs

Azure Digital Twins can collect logs for your service instance to help monitor its performance, among other data. Logs can be sent to [Log Analytics](../azure-monitor/logs/log-analytics-overview.md) or your custom storage mechanism. To enable logging in your instance, use the instructions in [Monitor with diagnostic logs](how-to-monitor-diagnostics.md). You can analyze the timestamps on the logs to measure latencies, evaluate if they're consistent, and understand their source.

## Check API frequency

Another factor that might affect performance is time taken to reauthorize API calls. Consider the frequency of your API calls. If there's a gap of more than 15 minutes between calls, the system may be reauthorizing with each call, taking up extra time to do so. You can prevent this issue by adding a timer or something similar in your code to ensure that you call into Azure Digital Twins at least once every 15 minutes.

## Contact support

If you're still experiencing performance issues after troubleshooting with the steps above, you can create a support request from Azure Help + Support for more troubleshooting assistance. 

Follow these steps:

1. Gather [metrics](how-to-monitor-metrics.md) and [logs](how-to-monitor-diagnostics.md) for your instance.
2. Navigate to [Azure Help + support](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest) in the Azure portal. Use the prompts to provide details of your issue, see recommended solutions, share your metrics/log files, and submit any other information that the support team can use to help investigate your issue. For more information on creating support requests, see [Create an Azure support request](../azure-portal/supportability/how-to-create-azure-support-request.md).

## Next steps

Read about other ways to monitor your Azure Digital Twins instance to help with troubleshooting:
* [Monitor with metrics](how-to-monitor-metrics.md)
* [Monitor with diagnostics logs](how-to-monitor-diagnostics.md).
* [Monitor with alerts](how-to-monitor-alerts.md)
* [Monitor resource health](how-to-monitor-resource-health.md)
