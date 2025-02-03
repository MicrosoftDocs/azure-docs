---
title: How to Troubleshoot VMware Spring Cloud Gateway with the Azure Spring Apps Enterprise Plan
description: Shows you how to troubleshoot VMware Spring Cloud Gateway with the Azure Spring Apps Enterprise plan.
author: KarlErickson
ms.author: jiec
ms.service: azure-spring-apps
ms.topic: how-to
ms.date: 01/10/2024
ms.custom: devx-track-java
---

# Troubleshoot VMware Spring Cloud Gateway

[!INCLUDE [deprecation-note](../includes/deprecation-note.md)]

**This article applies to:** ❎ Basic/Standard ✅ Enterprise

This article shows you how to troubleshoot Spring Cloud Gateway for VMware Tanzu with the Azure Spring Apps Enterprise plan. To learn more about VMware Spring Cloud Gateway, see [Configure VMware Spring Cloud Gateway](./how-to-configure-enterprise-spring-cloud-gateway.md).

## Prerequisites

- An already provisioned Azure Spring Apps Enterprise plan service instance with VMware Spring Cloud Gateway enabled. For more information, see [Quickstart: Build and deploy apps to Azure Spring Apps using the Enterprise plan](quickstart-deploy-apps-enterprise.md).
- [Azure CLI](/cli/azure/install-azure-cli) version 2.45.0 or later. Use the following command to install the Azure Spring Apps extension: `az extension add --name spring`.

## Check Gateway metrics

For more information on how to check metrics on the Azure portal, see the [Common metrics page](../basic-standard/concept-metrics.md?toc=/azure/spring-apps/enterprise/toc.json&bc=/azure/spring-apps/enterprise/breadcrumb/toc.json#common-metrics-page) section of [Metrics for Azure Spring Apps](../basic-standard/concept-metrics.md?toc=/azure/spring-apps/enterprise/toc.json&bc=/azure/spring-apps/enterprise/breadcrumb/toc.json).

For more information on each supported metric, see the [Gateway](../basic-standard/concept-metrics.md?toc=/azure/spring-apps/enterprise/toc.json&bc=/azure/spring-apps/enterprise/breadcrumb/toc.json#gateway) section of [Metrics for Azure Spring Apps](../basic-standard/concept-metrics.md?toc=/azure/spring-apps/enterprise/toc.json&bc=/azure/spring-apps/enterprise/breadcrumb/toc.json).

## Check Gateway logs

Spring Cloud Gateway is composed of following subcomponents:

- `spring-cloud-gateway-operator` is for managing the Gateway.
- `spring-cloud-gateway` fulfills the features.

The logs of both subcomponents are available. The following sections describe how to check these logs.

### Use real-time log streaming

You can stream logs in real time with the Azure CLI. For more information, see [Stream Azure Spring Apps managed component logs in real time](./how-to-managed-component-log-streaming.md). The following examples show how you can use Azure CLI commands to continuously stream new logs for `spring-cloud-gateway` and `spring-cloud-gateway-operator` subcomponents.

Use the following command to stream logs for `spring-cloud-gateway`:

```azurecli
az spring component logs \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --name spring-cloud-gateway \
    --all-instances \
    --follow
```

Use the following command to stream logs for `spring-cloud-gateway-operator`:

```azurecli
az spring component logs \
    --resource-group <resource-group-name> \
    --service <Azure-Spring-Apps-instance-name> \
    --name spring-cloud-gateway-operator \
    --all-instances \
    --follow
```

### Use Log Analytics

The following sections show you how to view System Logs using Log Analytics.

#### Diagnostic settings for Log Analytics

You must turn on System Logs and send to your Log Analytics before you query the logs for VMware Spring Cloud Gateway. To enable System Logs in the Azure portal, use the following steps:

1. Open your Azure Spring Apps instance.

1. In the navigation menu, select **Diagnostics settings**.

1. Select **Add diagnostic setting** or select **Edit setting** for an existing setting.

1. In the **Logs** section, select the **System Logs** category.

1. In the **Destination details** section, select **Send to Log Analytics workspace** and then select your workspace.

1. Select **Save** to update the setting.

#### Check logs in Log Analytics

To check the logs of `spring-cloud-gateway` and `spring-cloud-gateway-operator` using the Azure portal, use the following steps:

1. Make sure you turned on **System Logs**. For more information, see the [Diagnostic settings for Log Analytics](#diagnostic-settings-for-log-analytics) section.

1. Open your Azure Spring Apps instance.

1. Select **Logs** in the navigation pane and then select **Overview**.

1. Use the following sample queries in the query edit pane. Adjust the time range then select **Run** to search for logs.

   - To view the logs for `spring-cloud-gateway`, use the following query:

     ```kusto
     AppPlatformSystemLogs
     | where LogType in ("SpringCloudGateway")
     | project TimeGenerated , ServiceName , LogType, Log , _ResourceId
     | limit 100
     ```

     :::image type="content" source="media/how-to-troubleshoot-enterprise-spring-cloud-gateway/query-logs-spring-cloud-gateway.png" alt-text="Screenshot of the Azure portal that shows the query result of logs for VMware Spring Cloud Gateway." lightbox="media/how-to-troubleshoot-enterprise-spring-cloud-gateway/query-logs-spring-cloud-gateway.png":::

   - To view the logs for `spring-cloud-gateway-operator`, use the following query:

     ```kusto
     AppPlatformSystemLogs
     | where LogType in ("SpringCloudGatewayOperator")
     | project TimeGenerated , ServiceName , LogType, Log , _ResourceId
     | limit 100
     ```

     :::image type="content" source="media/how-to-troubleshoot-enterprise-spring-cloud-gateway/query-logs-spring-cloud-gateway-operator.png" alt-text="Screenshot of the Azure portal that shows the query result of logs for VMware Spring Cloud Gateway operator." lightbox="media/how-to-troubleshoot-enterprise-spring-cloud-gateway/query-logs-spring-cloud-gateway-operator.png":::

> [!NOTE]
> There could be a few minutes delay before the logs are available in Log Analytics.

### Adjust log levels

This section describes how to adjust the log levels for VMware Spring Cloud Gateway and offers one logger as an example.

> [!IMPORTANT]
> Before you get started, be sure to understand the details and impacts of adjusting the log levels by reading the [Configure log levels](./how-to-configure-enterprise-spring-cloud-gateway.md#configure-log-levels) section of [Configure VMware Spring Cloud Gateway](./how-to-configure-enterprise-spring-cloud-gateway.md#configure-log-levels).

Use the following steps to adjust the log levels:

1. In your Azure Spring Apps instance, select **Spring Cloud Gateway** in the navigation pane and then select **Configuration**.
1. In the **Properties** sections, fill in the key/value pair `logging.level.org.springframework.cloud.gateway=DEBUG`.
1. Select **Save** to save your changes.
1. After the change is successful, you can find more detailed logs for troubleshooting, such as information about how requests are routed.

## Setup alert rules

You can create alert rules based on logs and metrics. For more information, see [Create or edit a metric alert rule](/azure/azure-monitor/alerts/alerts-create-metric-alert-rule).

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
- [Stream Azure Spring Apps managed component logs in real time](./how-to-managed-component-log-streaming.md)
