---
title: 'Configure alerts for Azure ExpressRoute Connection Monitor'
description: Learn about the default Connection Monitor alert created for ExpressRoute connections and how to customize it for your monitoring needs.
services: network-watcher
author: dpremchandani
ms.service: azure-expressroute
ms.topic: how-to
ms.date: 11/04/2025
ms.author: divyapr
ai-usage: ai-assisted
---

# Configure alerts for ExpressRoute Connection Monitor

> [!NOTE]
> For comprehensive information about Connection Monitor alerts, including how to create custom alerts for performance metrics (RTT, packet loss), log-based alerts, troubleshooting, and best practices, see [Connection Monitor alerts](../network-watcher/connection-monitor-overview.md#analyze-monitoring-data-and-set-alerts). This article focuses on the default alert created for ExpressRoute connections.

Connection Monitor for ExpressRoute automatically creates an Azure Monitor alert when you enable monitoring. This article explains the default alert configuration and how to customize it for your specific needs.

## Default alert for ExpressRoute connections

When you enable Connection Monitor for an ExpressRoute connection through the Azure portal, an alert rule is automatically created with these ExpressRoute-optimized settings:

| Setting | Default value | What it means |
|---------|--------------|---------------|
| Signal | Test result | Monitors whether tests pass or fail |
| Aggregation | Maximum | Alert fires if ANY test fails |
| Threshold | Greater than 2 | Triggers on Warning (2) or Fail (3) status |
| Evaluation frequency | Every 1 minute | Checks for issues every minute |
| Lookback period | 5 minutes | Reviews the last 5 minutes of data |

### Understanding test result values

- **1 (Pass)** - Connectivity successful, performance within thresholds
- **2 (Warning)** - Connectivity works but performance is degraded
- **3 (Fail)** - Connectivity failed or performance severely degraded

> [!NOTE]
> The default alert is sensitive—it fires if even one test fails. This helps you catch issues quickly but might generate more alerts than needed. You can adjust the settings to match your environment.

For more information about test states and values, see [Connection Monitor overview](../network-watcher/connection-monitor-overview.md#checks-in-a-test).

## View and customize the default alert

1. Go to your ExpressRoute connection in the Azure portal.

1. Select **Monitoring** > **Connection Monitor**.

1. In the **Alerts** column, select the alert value to open the alert rule.

1. Select **Edit condition** to modify settings such as:
   - Aggregation type (Maximum, Average, Minimum)
   - Threshold value
   - Dimensions to filter specific endpoints

For detailed guidance on customizing alerts, adding dimensions, and configuring advanced alert logic, see [Customize Connection Monitor alerts](../network-watcher/connection-monitor-overview.md#data-collection-analysis-and-alerts).

## Create additional alerts

Beyond the default connectivity alert, you can create additional alerts for specific scenarios:

- **Performance degradation alerts** - Monitor Round-Trip Time (RTT) and packet loss
- **Monitoring gap alerts** - Detect when Connection Monitor stops sending data
- **Endpoint-specific alerts** - Focus on critical source-destination pairs

## Best practices

- **Start with the default alert** - Let it run for a week to understand your baseline before making changes
- **Add action groups** - Configure notifications via email, SMS, webhooks, or ITSM integration
- **Test your alerts** - Use the *Test action group* feature to verify notifications work
- **Create maintenance windows** - Suppress alerts during planned maintenance to avoid alert fatigue

## Next steps

- [Connection Monitor for ExpressRoute overview](connection-monitor-overview.md)
- [Configure Connection Monitor for ExpressRoute](configure-connection-monitor.md)
- [Connection Monitor alerts documentation](../network-watcher/connection-monitor-overview.md)
- [Monitor Azure ExpressRoute](monitor-expressroute.md)
