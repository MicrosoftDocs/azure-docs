---
title: "Quickstart - Set up Log Analytics workspace"
description: Describes the setup of Log Analytics workspace for app deployment.
author: karlerickson
ms.author: felixsong
ms.service: spring-cloud
ms.topic: quickstart
ms.date: 11/25/2021
ms.custom: devx-track-java, fasttrack-edit, mode-other
---

# Quickstart: Set up Log Analytics workspace

Log Analytics is a tool in the Azure portal used to edit and run log queries with data in Azure Monitor Logs. You may write a simple query that returns a set of records and then use features of Log Analytics to sort, filter, and analyze them. Or you may write a more advanced query to perform statistical analysis and visualize the results in a chart to identify a particular trend. Whether you work with the results of your queries interactively or use them with other Azure Monitor features such as log query alerts or workbooks, Log Analytics is the tool that you're going to use write and test them.

You can set up Azure Monitor Logs for your Azure Spring Cloud instance to collect logs and run logs queries via Log Analytics.

## Prerequisites

* Complete the previous quickstart in this series: [Provision Azure Spring Cloud service](./quickstart-provision-service-instance.md).

## Set up Log Analytics for existing service

#### [Portal](#tab/Azure-Portal)

## Create Log Analytics Workspace

* Follow [log analytics mannual](https://docs.microsoft.com/en-us/azure/azure-monitor/logs/quick-create-workspace) to create a workspace.

## Configure Diagnostic Settings

1. In the Azure portal, go to the **Diagnostic Settings** blade under **Monitoring**.

    [ ![diagnostic settings menu](media/spring-cloud-quickstart-setup-log-analytics/diagnostic-settings-entry.png) ](media/spring-cloud-quickstart-setup-log-analytics/diagnostic-settings-entry.png#lightbox) 

1. If no settings exist, Click **Add diagnostic setting**, otherwise you can click **Edit setting** to update existing settings, or click **Add diagnostic setting** to add new ones. 

    [ ![add or update a diagnositc setting](media/spring-cloud-quickstart-setup-log-analytics/diagnostic-settings-add.png) ](media/spring-cloud-quickstart-setup-log-analytics/diagnostic-settings-add.png#lightbox)

1. Fill out the form on **Diagnostics setting** page.
    * **Diagnostic setting name**: Set a unique name for the given configuration.
    * **Logs/Categories**: You can choose **ApplicationConsole** and **SystemLogs** for quick start. See [diagnostic settings doc](https://docs.microsoft.com/azure/azure-monitor/essentials/diagnostic-settings) for more guidance about the different log categories and contents of those logs.
    * **Destination details**: Choose **Send to Log Analytics workspace** and specify the Log Analytics workspace you created previously.

    [ ![diagnostic settings edit form](media/spring-cloud-quickstart-setup-log-analytics/diagnostic-settings-edit-form.png) ](media/spring-cloud-quickstart-setup-log-analytics/diagnostic-settings-edit-form.png#lightbox)

1. Click **Save**

#### [CLI](#tab/Azure-CLI)

## Create Log Analytics Workspace

1. Create Log Analytics workspace and get workspace ID

    ```azurecli
    az monitor log-analytics workspace create --workspace-name <give a name for workspace> --resource-group <your resource group> --location <your service region> --query id --output tsv
    ```

    If you have already created a workspace before, you can get the workspace ID with the commend.

    ```azurecli
    az monitor log-analytics workspace show --resource-group <your resource group> --workspace-name <workspace name> --query id --output tsv
    ```

1. Get Azure Spring Cloud service instance id

    ```azurecli
    az spring-cloud show --name <spring cloud service name> --resource-group <your resource group> --query id --output tsv
    ```

## Set up Log Analytics for new service

1. Set up diagnostic setting, you can refer to [diagnostic settings doc](https://docs.microsoft.com/azure/azure-monitor/essentials/diagnostic-settings) for more about the different log categories and contents.

    ```azurecli
    az monitor diagnositc-settings create --name "<give your setting a name>" \
        --resource "<service resource id>" \
        --workspace "<workspace id>" \
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

> [!TIP]
> You can also setup Log Analytics when you create an Azure Spring Cloud service instance.<br />
> In the create Azure Spring Cloud service wizard, you can configure **Log Analytics workspace** with an existing LA workspace or create one.<br />
> [ ![setup diagnostic settings during provisioning](media/spring-cloud-quickstart-setup-log-analytics/setup-diagnostics-setting.png) ](media/spring-cloud-quickstart-setup-log-analytics/setup-diagnostics-setting.png#lightbox)

## Next steps

In this quickstart, you created Azure resources that will continue to accrue charges if they remain in your subscription. If you don't intend to continue on to the next quickstart, see [Clean up resources](./quickstart-logs-metrics-tracing.md#clean-up-resources). Otherwise, advance to the next quickstart:

> [!div class="nextstepaction"]
> [Logs, Metrics and Tracing](./quickstart-logs-metrics-tracing.md)
