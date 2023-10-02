---
title: "Quickstart - Set up a Log Analytics workspace in Azure Spring Apps"
description: This article describes the setup of a Log Analytics workspace for app deployment.
author: KarlErickson
ms.author: felixsong
ms.service: spring-apps
ms.topic: quickstart
ms.date: 12/09/2021
ms.custom: devx-track-java, fasttrack-edit, mode-other, devx-track-azurecli, event-tier1-build-2022
ms.devlang: azurecli
---

# Quickstart: Set up a Log Analytics workspace

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Basic/Standard ❌ Enterprise

This quickstart explains how to set up a Log Analytics workspace in Azure Spring Apps for application development.

Log Analytics is a tool in the Azure portal that's used to edit and run log queries with data in Azure Monitor Logs. You can write a query that returns a set of records and then use features of Log Analytics to sort, filter, and analyze those records. You can also write a more advanced query to do statistical analysis and visualize the results in a chart to identify particular trends. Whether you work with the results of your queries interactively or use them with other Azure Monitor features, Log Analytics is the tool that you use to write and test queries.

You can set up Azure Monitor Logs for your application in Azure Spring Apps to collect logs and run log queries via Log Analytics.

## Prerequisites

Complete the previous quickstart in this series: [Provision an Azure Spring Apps service](./quickstart-provision-service-instance.md).

#### [Portal](#tab/Azure-Portal)

## Create a Log Analytics workspace

To create a workspace, follow the steps in [Create a Log Analytics workspace in the Azure portal](../azure-monitor/logs/quick-create-workspace.md).

## Set up Log Analytics for a new service

In the wizard for creating an Azure Spring Apps service instance, you can configure the **Log Analytics workspace** field with an existing workspace or create one.

:::image type="content" source="media/quickstart-setup-log-analytics/setup-diagnostics-setting.png" alt-text="Screenshot that shows where to configure diagnostic settings during provisioning." lightbox="media/quickstart-setup-log-analytics/setup-diagnostics-setting.png":::

## Set up Log Analytics for an existing service

1. In the Azure portal, go to the **Diagnostic settings** section under **Monitoring**.

   :::image type="content" source="media/quickstart-setup-log-analytics/diagnostic-settings-entry.png" alt-text="Screenshot that shows the location of diagnostic settings." lightbox="media/quickstart-setup-log-analytics/diagnostic-settings-entry.png":::

1. If no settings exist, select **Add diagnostic setting**. You can also select **Edit setting** to update existing settings.

1. Fill out the form on the **Diagnostic setting** page:

   - **Diagnostic setting name**: Set a unique name for the configuration.
   - **Logs** > **Categories**: Select **ApplicationConsole** and **SystemLogs**. For more information on log categories and contents, see [Create diagnostic settings to send Azure Monitor platform logs and metrics to different destinations](../azure-monitor/essentials/diagnostic-settings.md).
   - **Destination details**: Select **Send to Log Analytics workspace** and specify the Log Analytics workspace that you created previously.

   :::image type="content" source="media/quickstart-setup-log-analytics/diagnostic-settings-edit-form.png" alt-text="Screenshot that shows an example of set-up diagnostic settings." lightbox="media/quickstart-setup-log-analytics/diagnostic-settings-edit-form.png":::

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

## Set up Log Analytics for a new service

Setting up for a new service isn't applicable when you're using the Azure CLI.

## Set up Log Analytics for an existing service

1. Get the instance ID for the Azure Spring Apps service:

   ```azurecli
   az spring show \
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

## Clean up resources

If you plan to continue working with subsequent quickstarts and tutorials, you might want to leave these resources in place. When no longer needed, delete the resource group, which deletes the resources in the resource group. To delete the resource group by using Azure CLI, use the following commands:

```azurecli
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName &&
echo "Press [ENTER] to continue ..."
```

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Monitoring Azure Spring Apps apps with logs, metrics, and tracing](./quickstart-logs-metrics-tracing.md)
