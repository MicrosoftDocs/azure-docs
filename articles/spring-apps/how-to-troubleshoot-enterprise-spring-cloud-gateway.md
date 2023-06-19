---
title: How to troubleshoot VMware Spring Cloud Gateway with the Azure Spring Apps Enterprise plan
description: Shows you how to troubleshoot VMware Spring Cloud Gateway with the Azure Spring Apps Enterprise plan.
author: jiec
ms.author: jiec
ms.service: spring-apps
ms.topic: how-to
ms.date: 06/09/2023
ms.custom: jiec
---

# Troubleshoot VMware Spring Cloud Gateway

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ❌ Basic/Standard ✔️ Enterprise

This article shows you how to troubleshoot Spring Cloud Gateway for VMware Tanzu with the Azure Spring Apps Enterprise plan. See [Manage Spring Cloud Gateway](./how-to-configure-enterprise-spring-cloud-gateway.md) to learn more about VMware Spring Cloud Gateway.

## Prerequisites

- An already provisioned Azure Spring Apps Enterprise plan service instance with VMware Spring Cloud Gateway enabled. For more information, see [Quickstart: Build and deploy apps to Azure Spring Apps using the Enterprise plan](quickstart-deploy-apps-enterprise.md).

  > [!NOTE]
  > You must enable VMware Spring Cloud Gateway when you provision your Azure Spring Apps service instance. You can't enable VMware Spring Cloud Gateway after provisioning.

- [Azure CLI](/cli/azure/install-azure-cli) version 2.45.0 or later. Use the following command to install the Azure Spring Apps extension: `az extension add --name spring`.

## Check Gateway logs

There are two components make up the Spring Cloud Gateway for VMware Tanzu: the Gateway itself and the Gateway operator. You can infer from the name that the Gateway operator is for managing the Gateway, while Gateway itself fullfils the features. The logs of both components are available, and you can check them in the following steps.

### Diagnostic Settings of Log Analytics

You must turn on System Logs and send to your Log Analytics before query logs for VMware Spring Cloud Gateway. To enable System Logs in the Azure Portal, use the following steps:

1. Open your Azure Spring Apps instance.
1. Select **Diagnostics settings** in the navigation pane.
1. Select **Add diagnostic setting** or select "Edit setting" for an existed one.
1. In the **Logs** section, check "System Logs" category.
1. In the **Destination details** section, check "Send to Log Analytics workspace", and choose yours accordingly.
1. Select **Save** to update the setting.
1. Restart the Gateway to take effect.

### Check logs in Log Analytics

To check logs in the Azure portal, use the following steps:

1. Make sure you turned on System Logs. See [Diagnostic Settings of Log Analytics](#diagnostic-settings-of-log-analytics) section in this document.
1. Open your Azure Spring Apps instance.
1. Select **Logs** in the navigation pane, and then select **Overview**.
1. Use below sample query in the query edit, adjust Time range, then click **Run** to search for logs.

##### [Query logs for Gateway](#tab/Gateway)

```Kusto
AppPlatformSystemLogs 
| where LogType in ("SpringCloudGateway")
| project TimeGenerated , ServiceName , LogType, Log , _ResourceId 
| limit 100
```

##### [Query logs for Gateway Operator](#tab/GatewayOperator)

```Kusto
AppPlatformSystemLogs
| where LogType in ("SpringCloudGatewayOperator")
| project TimeGenerated , ServiceName , LogType, Log , _ResourceId
| limit 100
```

---

Take below screenshot as an example:
:::image type="content" source="media/how-to-troubleshoot-enterprise-spring-cloud-gateway/query-logs-of-spring-cloud-gateway.png" alt-text="Screenshot of the Azure portal showing the query and result of logs of VMware Spring Cloud Gateway" lightbox="media/how-to-troubleshoot-enterprise-spring-cloud-gateway/query-logs-of-spring-cloud-gateway.png":::

  > [!NOTE]
  > There might be 3~5 minutes delay for the logs to be available in Log Analytics.

### Adjust log levels

This section describe how to adjust log levels of VMware Spring Cloud Gateway. And will take one logger as an example. **Please make sure you READ** [Configure log levels](./how-to-configure-enterprise-spring-cloud-gateway.md#configure-log-levels) to understand impacts before getting started.

1. In your Azure Spring Apps instance, select **Spring Cloud Gateway** in the navigation pane, and then select **Configuration**.
1. In the **Properties** sections, fill in the key vault pair `logging.level.org.springframework.cloud.gateway=DEBUG`.
1. Select **Save** to save your changes.
1. After succeeded, you can find more detailed logs for troubleshooting like how requets are routed.

## Next steps

- [How to Configure Spring Cloud Gateway](./how-to-configure-enterprise-spring-cloud-gateway.md)
