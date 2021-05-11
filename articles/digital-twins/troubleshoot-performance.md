---
# Mandatory fields.
title: Troubleshoot performance
titleSuffix: Azure Digital Twins
description: Tips for troubleshooting performance of an Azure Digital Twins instance.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 5/11/2021
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Troubleshooting Azure Digital Twins: Performance

If you are experiencing delays or other performance issues when working with Azure Digital Twins, use the tips in this article to help you troubleshoot.

## Isolate delayed service

If your solution uses Azure Digital Twins in combination with other Azure services (like Azure Functions), determine whether the delay is coming from Azure Digital Twins or another service. To investigate this, you can use the **API Latency** metric in [Azure Monitor](../azure-monitor/essentials/quick-monitor-azure-resource.md) through the Azure portal. For instructions on how to view Azure Monitor metrics for an Azure Digital Twins instance, see [Troubleshooting: View metrics with Azure Monitor](troubleshoot-metrics.md).

## Check regions

If your solution uses Azure Digital Twins in combination with other Azure services (like Azure Functions), check the region for the deployment of each service. If services are deployed in different regions, this may add delays across your solution. Unless you're intentionally creating a distributed solution, consider deploying all service instances within the same region to avoid accidentally introducing delays.

## Use logs

Azure Digital Twins can collect logs for your service instance to help monitor its performance, among other data. To enable logging in your instance, use the instructions in [Troubleshooting: Set up diagnostics](troubleshoot-diagnostics.md). You can analyze the timestamps on the logs to help isolate performance issues.

## Check API authorization

Another factor that might affect performance is time taken to authorize API calls. Consider the frequency of your API calls. If there is a gap of more than 15 minutes between calls, the system may be re-authorizing with each call, taking up additional time to do so. You can prevent this by adding a timer or something similar in your code to ensure that you call into Azure Digital Twins at least once every 15 minutes.

## Contact support

If you're still experiencing performance issues after troubleshooting with the steps above, you can reach out to the Azure Digital Twins support team for additional troubleshooting assistance. 

Follow these steps:

1. Gather [metrics](troubleshoot-metrics.md) and [logs](troubleshoot-diagnostics.md) for your instance
2. Use <Email? Azure portal?> to share... <a description of your problem, your metrics/logs, and any other information that the team can use to help investigate your issue.>

## Next steps

Read about other ways to troubleshoot your Azure Digital Twins instance in the following articles:
* [Troubleshooting: View metrics with Azure Monitor](troubleshoot-metrics.md)
* [Troubleshooting: Set up diagnostics](troubleshoot-diagnostics.md).
* [Troubleshooting: Set up alerts](troubleshoot-alerts.md)
* [Troubleshooting: Understand your resource health](troubleshoot-resource-health.md)
