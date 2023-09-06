---
title: How to troubleshoot VMware Spring Cloud Gateway with the Azure Spring Apps Enterprise plan
description: Shows you how to troubleshoot VMware Spring Cloud Gateway with the Azure Spring Apps Enterprise plan.
author: KarlErickson
ms.author: jiec
ms.service: spring-apps
ms.topic: how-to
ms.date: 06/26/2023
ms.custom: devx-track-java
---

# Troubleshoot VMware Spring Cloud Gateway

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard ✔️ Enterprise

This article shows you how to troubleshoot Spring Cloud Gateway for VMware Tanzu with the Azure Spring Apps Enterprise plan. To learn more about VMware Spring Cloud Gateway, see [Configure VMware Spring Cloud Gateway](./how-to-configure-enterprise-spring-cloud-gateway.md).

## Prerequisites

- An already provisioned Azure Spring Apps Enterprise plan service instance with VMware Spring Cloud Gateway enabled. For more information, see [Quickstart: Build and deploy apps to Azure Spring Apps using the Enterprise plan](quickstart-deploy-apps-enterprise.md).

  > [!NOTE]
  > You must enable VMware Spring Cloud Gateway when you provision your Azure Spring Apps service instance. You can't enable VMware Spring Cloud Gateway after provisioning.

- [Azure CLI](/cli/azure/install-azure-cli) version 2.45.0 or later. Use the following command to install the Azure Spring Apps extension: `az extension add --name spring`.

## Check Gateway metrics

For more information on how to check metrics on the Azure portal, see the [Common metrics page](./concept-metrics.md#common-metrics-page) section of [Metrics for Azure Spring Apps](concept-metrics.md).

For more information on each supported metric, see the [Gateway](./concept-metrics.md#gateway) section of [Metrics for Azure Spring Apps](./concept-metrics.md).

## Check Gateway logs

There are two components that make up the Spring Cloud Gateway for VMware Tanzu: the Gateway itself and the Gateway operator. You can infer from the name that the Gateway operator is for managing the Gateway, while the Gateway itself fulfills the features. The logs of both components are available. The following sections describe how to check these logs.

### Diagnostic settings for Log Analytics

You must turn on System Logs and send to your Log Analytics before you query the logs for VMware Spring Cloud Gateway. To enable System Logs in the Azure portal, use the following steps:

1. Open your Azure Spring Apps instance.
1. Select **Diagnostics settings** in the navigation pane.
1. Select **Add diagnostic setting** or select **Edit setting** for an existing setting.
1. In the **Logs** section, select the **System Logs** category.
1. In the **Destination details** section, select **Send to Log Analytics workspace** and then select your workspace.
1. Select **Save** to update the setting.

### Check logs in Log Analytics

To check the logs by using the Azure portal, use the following steps:

1. Make sure you turned on System Logs. For more information, see the [Diagnostic settings for Log Analytics](#diagnostic-settings-for-log-analytics) section.
1. Open your Azure Spring Apps instance.
1. Select **Logs** in the navigation pane, and then select **Overview**.
1. Use one of the following sample queries in the query edit pane. Adjust the time range, then select **Run** to search for logs.

   - Query logs for Gateway

     ```Kusto
     AppPlatformSystemLogs 
     | where LogType in ("SpringCloudGateway")
     | project TimeGenerated , ServiceName , LogType, Log , _ResourceId 
     | limit 100
     ```

   - Query logs for Gateway Operator

     ```Kusto
     AppPlatformSystemLogs
     | where LogType in ("SpringCloudGatewayOperator")
     | project TimeGenerated , ServiceName , LogType, Log , _ResourceId
     | limit 100
     ```

The following screenshot shows an example of the query results\:

:::image type="content" source="media/how-to-troubleshoot-enterprise-spring-cloud-gateway/query-logs-of-spring-cloud-gateway.png" alt-text="Screenshot of the Azure portal showing the query and result of logs for VMware Spring Cloud Gateway." lightbox="media/how-to-troubleshoot-enterprise-spring-cloud-gateway/query-logs-of-spring-cloud-gateway.png":::

> [!NOTE]
> There might be a 3-5 minutes delay before the logs are available in Log Analytics.

### Adjust log levels

This section describes how to adjust the log levels for VMware Spring Cloud Gateway and offers one logger as an example.

> [!IMPORTANT]
> Before you get started, be sure to understand the details and impacts of adjusting the log levels by reading the [Configure log levels](./how-to-configure-enterprise-spring-cloud-gateway.md#configure-log-levels) section of [Configure VMware Spring Cloud Gateway](./how-to-configure-enterprise-spring-cloud-gateway.md#configure-log-levels).

Use the following steps to adjust the log levels:

1. In your Azure Spring Apps instance, select **Spring Cloud Gateway** in the navigation pane, and then select **Configuration**.
1. In the **Properties** sections, fill in the key/value pair `logging.level.org.springframework.cloud.gateway=DEBUG`.
1. Select **Save** to save your changes.
1. After the change is successful, you can find more detailed logs for troubleshooting, such as information about how requests are routed.

## Setup alert rules

You can create alert rules based on logs and metrics. For more information, see [Create or edit an alert rule](../azure-monitor/alerts/alerts-create-new-alert-rule.md).

Use the following steps to directly create alert rules from the Azure portal for Azure Spring Apps:

1. Open your Azure Spring Apps instance.
1. Navigate to **Logs** or **Metrics**.
1. Write the log query in the **Logs** pane, or add a metrics chart.
1. Select **New alert rule**. This action takes you to the **Create an alert rule** pane, and the log query or the metrics is filled out automatically.

You can now configure the alert rule details.

## Monitor Gateway with application performance monitor

 For more information on supported application performance monitors and how to configure them, see the [Configure application performance monitoring](./how-to-configure-enterprise-spring-cloud-gateway.md#configure-application-performance-monitoring) section of [Configure VMware Spring Cloud Gateway](./how-to-configure-enterprise-spring-cloud-gateway.md).

## Restart Gateway

For some errors, a restart might help solve the issue. For more information, see the [Restart Spring Cloud Gateway](./how-to-configure-enterprise-spring-cloud-gateway.md#restart-vmware-spring-cloud-gateway) section of [Configure VMware Spring Cloud Gateway](./how-to-configure-enterprise-spring-cloud-gateway.md).

## Next steps

- [How to Configure Spring Cloud Gateway](./how-to-configure-enterprise-spring-cloud-gateway.md)
