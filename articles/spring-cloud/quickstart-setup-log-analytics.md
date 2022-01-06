---
title: "Quickstart - Set up a Log Analytics workspace in Azure Spring Cloud"
description: This article describes the setup of a Log Analytics workspace for app deployment.
author: karlerickson
ms.author: felixsong
ms.service: spring-cloud
ms.topic: quickstart
ms.date: 12/09/2021
ms.custom: devx-track-java, fasttrack-edit, mode-other
---

# Quickstart: Set up a Log Analytics workspace

This quickstart explains how to set up a Log Analytics workspace in Azure Spring Cloud for application development.

Log Analytics is a tool in the Azure portal that's used to edit and run log queries with data in Azure Monitor Logs. You can write a query that returns a set of records and then use features of Log Analytics to sort, filter, and analyze those records. You can also write a more advanced query to do statistical analysis and visualize the results in a chart to identify particular trends. Whether you work with the results of your queries interactively or use them with other Azure Monitor features, Log Analytics is the tool that you use to write and test queries.

You can set up Azure Monitor Logs for your application in Azure Spring Cloud to collect logs and run log queries via Log Analytics.

## Prerequisites

Complete the previous quickstart in this series: [Provision an Azure Spring Cloud service](./quickstart-provision-service-instance.md).

## Set up a Log Analytics workspace

Use the following steps to set up your Log Analytics workspace.

#### [Portal](#tab/Azure-Portal)

## Create a Log Analytics workspace

To create a workspace, follow the steps in [Create a Log Analytics workspace in the Azure portal](../azure-monitor/logs/quick-create-workspace.md).

## Set up Log Analytics for a new service

In the wizard for creating an Azure Spring Cloud service instance, you can configure the **Log Analytics workspace** field with an existing workspace or create one.

[![Screenshot that shows where to configure diagnostic settings during provisioning.](media/spring-cloud-quickstart-setup-log-analytics/setup-diagnostics-setting.png)](media/spring-cloud-quickstart-setup-log-analytics/setup-diagnostics-setting.png#lightbox)

## Set up Log Analytics for an existing service

1. In the Azure portal, go to the **Diagnostic settings** section under **Monitoring**.

    [![Screenshot that shows the location of diagnostic settings.](media/spring-cloud-quickstart-setup-log-analytics/diagnostic-settings-entry.png)](media/spring-cloud-quickstart-setup-log-analytics/diagnostic-settings-entry.png#lightbox) 

1. If no settings exist, select **Add diagnostic setting**. You can also select **Edit setting** to update existing settings.

1. Fill out the form on the **Diagnostic setting** page:

    * **Diagnostic setting name**: Set a unique name for the configuration.
    * **Logs** > **Categories**: Select **ApplicationConsole** and **SystemLogs**. For more information on log categories and contents, see [Create diagnostic settings to send Azure Monitor platform logs and metrics to different destinations](../azure-monitor/essentials/diagnostic-settings.md).
    * **Destination details**: Select **Send to Log Analytics workspace** and specify the Log Analytics workspace that you created previously.

    [![Screenshot that shows an example of set-up diagnostic settings.](media/spring-cloud-quickstart-setup-log-analytics/diagnostic-settings-edit-form.png)](media/spring-cloud-quickstart-setup-log-analytics/diagnostic-settings-edit-form.png#lightbox)

1. Select **Save**.

#### [CLI](#tab/Azure-CLI)

## Create a Log Analytics workspace

Use the following commands to create a Log Analytics workspace and get the workspace ID:

```azurecli
az monitor log-analytics workspace create \
    --workspace-name <new-workspace-name> \
    --resource-group <your-resource-group> \
    --location <your-service-region> \
    --query id --output tsv
```

If you have an existing workspace, you can get the workspace ID by using the following commands:

```azurecli
az monitor log-analytics workspace show \
     --resource-group <your-resource-group> \
     --workspace-name <workspace-name> \
     --query id --output tsv
```

## Set up Log Analytics for an existing service

1. Get the instance ID for the Azure Spring Cloud service:

   ```azurecli
   az spring-cloud show \
       --name <spring-cloud-service-name> \
       --resource-group <your-resource-group> \
       --query id --output tsv
    ```

1. Configure the diagnostic settings. For more information on log categories and contents, see [Create diagnostic settings to send Azure Monitor platform logs and metrics to different destinations](../azure-monitor/essentials/diagnostic-settings.md).

   ```azurecli
   az monitor diagnostic-settings create \
       --name "<new-name-for-settings>" \
       --resource "<service-instance-id>" \
       --workspace "<workspace-id>" \
       --logs '[
            {
                "category": "ApplicationConsole",
                "enabled": true,
                "retentionPolicy": {
                    "enabled": false,
                    "days": 0
                }
            },
            {
                "category": "SystemLogs",
                "enabled": true,
                "retentionPolicy": {
                    "enabled": false,
                    "days": 0
                }
            }
        ]'
    ```

---

## Next steps

In this quickstart, you created Azure resources that will continue to accrue charges if they remain in your subscription. If you don't want to continue on to the next quickstart, see [Clean up resources](./quickstart-logs-metrics-tracing.md#clean-up-resources). Otherwise, advance to the next quickstart:

> [!div class="nextstepaction"]
> [Monitor Azure Spring Cloud apps with logs, metrics, and tracing](./quickstart-logs-metrics-tracing.md)
