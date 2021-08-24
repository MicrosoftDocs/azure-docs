---
title: Use Log Analytics to collect and visualize metrics and logs (preview)
description: Learn how to enable the Synapse Studio connector for collecting and sending the Apache Spark application metrics and logs to your Log Analytics workspace.
services: synapse-analytics 
author: jejiang
ms.author: jejiang
ms.reviewer: jrasnick 
ms.service: synapse-analytics
ms.topic: tutorial
ms.subservice: spark
ms.date: 03/25/2021
ms.custom: references_regions
---
# Tutorial: Use Log Analytics to collect and visualize metrics and logs (preview)

In this tutorial, you learn how to enable the Synapse Studio connector that's built in to Log Analytics. You can then collect and send Apache Spark application metrics and logs to your [Log Analytics workspace](../../azure-monitor/logs/quick-create-workspace.md). Finally, you can use an Azure Monitor workbook to visualize the metrics and logs.

## Configure workspace information

Follow these steps to configure the necessary information in Synapse Studio.

### Step 1: Create a Log Analytics workspace

Consult one of the following resources to create this workspace:
- [Create a workspace in the Azure portal](../../azure-monitor/logs/quick-create-workspace.md)
- [Create a workspace with Azure CLI](../../azure-monitor/logs/quick-create-workspace-cli.md)
- [Create and configure a workspace in Azure Monitor by using PowerShell](../../azure-monitor/logs/powershell-workspace-configuration.md)

### Step 2: Prepare a Spark configuration file

Use any of the following options to prepare the file.

#### Option 1: Configure with Log Analytics workspace ID and key 

Copy the following Spark configuration, save it as *spark_loganalytics_conf.txt*, and fill in the following parameters:

   - `<LOG_ANALYTICS_WORKSPACE_ID>`: Log Analytics workspace ID.
   - `<LOG_ANALYTICS_WORKSPACE_KEY>`: Log Analytics key. To find this, in the Azure portal, go to **Azure Log Analytics workspace** > **Agents management** > **Primary key**.

```properties
spark.synapse.logAnalytics.enabled true
spark.synapse.logAnalytics.workspaceId <LOG_ANALYTICS_WORKSPACE_ID>
spark.synapse.logAnalytics.secret <LOG_ANALYTICS_WORKSPACE_KEY>
```

#### Option 2: Configure with Azure Key Vault

> [!NOTE]
> You need to grant read secret permission to the users who will submit Spark applications. For more information, see [Provide access to Key Vault keys, certificates, and secrets with an Azure role-based access control](../../key-vault/general/rbac-guide.md).

To configure Azure Key Vault to store the workspace key, follow these steps:

1. Create and go to your key vault in the Azure portal.
2. On the settings page for the key vault, select **Secrets**.
3. Select **Generate/Import**.
4. On the **Create a secret** screen, choose the following values:
   - **Name**: Enter a name for the secret. For the default, enter `SparkLogAnalyticsSecret`.
   - **Value**: Enter the `<LOG_ANALYTICS_WORKSPACE_KEY>` for the secret.
   - Leave the other values to their defaults. Then select **Create**.
5. Copy the following Spark configuration, save it as *spark_loganalytics_conf.txt*, and fill in the following parameters:

   - `<LOG_ANALYTICS_WORKSPACE_ID>`: The Log Analytics workspace ID.
   - `<AZURE_KEY_VAULT_NAME>`: The key vault name that you configured.
   - `<AZURE_KEY_VAULT_SECRET_KEY_NAME>` (optional): The secret name in the key vault for the workspace key. The default is `SparkLogAnalyticsSecret`.

```properties
spark.synapse.logAnalytics.enabled true
spark.synapse.logAnalytics.workspaceId <LOG_ANALYTICS_WORKSPACE_ID>
spark.synapse.logAnalytics.keyVault.name <AZURE_KEY_VAULT_NAME>
spark.synapse.logAnalytics.keyVault.key.secret <AZURE_KEY_VAULT_SECRET_KEY_NAME>
```

> [!NOTE]
> You can also store the workspace ID in Key Vault. Refer to the preceding steps, and store the workspace ID with the secret name `SparkLogAnalyticsWorkspaceId`. Alternatively, you can use the configuration `spark.synapse.logAnalytics.keyVault.key.workspaceId` to specify the workspace ID secret name in Key Vault.

#### Option 3. Configure with a linked service

> [!NOTE]
> You need to grant read secret permission to the users who will submit Spark applications. For more information, see [Provide access to Key Vault keys, certificates, and secrets with an Azure role-based access control](../../key-vault/general/rbac-guide.md).

To configure a Key Vault linked service in Synapse Studio to store the workspace key, follow these steps:

1. Follow all the steps in the preceding section, "Option 2."
2. Create a Key Vault linked service in Synapse Studio:

    a. Go to **Synapse Studio** > **Manage** > **Linked services**, and then select **New**.

    b. In the search box, search for **Azure Key Vault**.

    c. Enter a name for the linked service.

    d. Choose your key vault, and select **Create**.

3. Add a `spark.synapse.logAnalytics.keyVault.linkedServiceName` item to the Spark configuration.

```properties
spark.synapse.logAnalytics.enabled true
spark.synapse.logAnalytics.workspaceId <LOG_ANALYTICS_WORKSPACE_ID>
spark.synapse.logAnalytics.keyVault.name <AZURE_KEY_VAULT_NAME>
spark.synapse.logAnalytics.keyVault.key.secret <AZURE_KEY_VAULT_SECRET_KEY_NAME>
spark.synapse.logAnalytics.keyVault.linkedServiceName <LINKED_SERVICE_NAME>
```

#### Available Spark configuration

| Configuration name                                  | Default value                | Description                                                                                                                                                                                                |
| --------------------------------------------------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| spark.synapse.logAnalytics.enabled                  | false                        | To enable the Log Analytics sink for the Spark applications, true. Otherwise, false.                                                                                                                  |
| spark.synapse.logAnalytics.workspaceId              | -                            | The destination Log Analytics workspace ID.                                                                                                                                                          |
| spark.synapse.logAnalytics.secret                   | -                            | The destination Log Analytics workspace secret.                                                                                                                                                      |
| spark.synapse.logAnalytics.keyVault.linkedServiceName   | -                            | The Key Vault linked service name for the Log Analytics workspace ID and key.                                                                                                                       |
| spark.synapse.logAnalytics.keyVault.name            | -                            | The Key Vault name for the Log Analytics ID and key.                                                                                                                                                |
| spark.synapse.logAnalytics.keyVault.key.workspaceId | SparkLogAnalyticsWorkspaceId | The Key Vault secret name for the Log Analytics workspace ID.                                                                                                                                       |
| spark.synapse.logAnalytics.keyVault.key.secret      | SparkLogAnalyticsSecret      | The Key Vault secret name for the Log Analytics workspace key.                                                                                                                                      |
| spark.synapse.logAnalytics.uriSuffix       | ods.opinsights.azure.com     | The destination Log Analytics workspace [URI suffix][uri_suffix]. If your workspace isn't in Azure global, you need to update the URI suffix according to the respective cloud. |

> [!NOTE]  
> - For Azure China, the `spark.synapse.logAnalytics.uriSuffix` parameter should be `ods.opinsights.azure.cn`. 
> - For Azure Government, the `spark.synapse.logAnalytics.uriSuffix` parameter should be `ods.opinsights.azure.us`. 

[uri_suffix]: ../../azure-monitor/logs/data-collector-api.md#request-uri


### Step 3: Upload your Spark configuration to a Spark pool
You can upload the configuration file to your Azure Synapse Analytics Spark pool. In Synapse Studio:

   1. Select **Manage** > **Apache Spark pools**.
   2. Next to your Apache Spark pool, select the **...** button.
   3. Select **Apache Spark configuration**. 
   4. Select **Upload**, and choose the *spark_loganalytics_conf.txt* file.
   5. Select **Upload**, and then select **Apply**.

      > [!div class="mx-imgBorder"]
      > ![Screenshot that shows the Spark pool configuration.](./media/apache-spark-azure-log-analytics/spark-pool-configuration.png)

> [!NOTE] 
>
> All the Spark applications submitted to the Spark pool will use the configuration setting to push the Spark application metrics and logs to your specified workspace.

## Submit a Spark application and view the logs and metrics

Here's how:

1. Submit a Spark application to the Spark pool configured in the previous step. You can use any of the following ways to do so:
    - Run a notebook in Synapse Studio. 
    - In Synapse Studio, submit an Apache Spark batch job through a Spark job definition.
    - Run a pipeline that contains Spark activity.

1. Go to the specified Log Analytics workspace, and then view the application metrics and logs when the Spark application starts to run.

## Use the sample workbook to visualize the metrics and logs

1. [Download the workbook](https://aka.ms/SynapseSparkLogAnalyticsWorkbook).
2. Open and copy the workbook file content.
3. In the [Azure portal](https://portal.azure.com/), select **Log Analytics workspace** > **Workbooks**. 
4. Open the **Empty** workbook. Use the **Advanced Editor** mode by selecting the **</>** icon.
5. Paste over any JSON code that exists.
6. Select **Apply**, and then select **Done Editing**.

    > [!div class="mx-imgBorder"]
    > ![Screenshot that shows a new workbook.](./media/apache-spark-azure-log-analytics/new-workbook.png)

    > [!div class="mx-imgBorder"]
    > ![Screenshot that shows how to import a workbook.](./media/apache-spark-azure-log-analytics/import-workbook.png)

Then, submit your Apache Spark application to the configured Spark pool. After the application goes to a running state, choose the running application in the workbook dropdown list.

> [!div class="mx-imgBorder"]
> ![Screenshot that shows a workbook.](./media/apache-spark-azure-log-analytics/workbook.png)

You can customize the workbook. For example, you can use Kusto queries and configure alerts.

> [!div class="mx-imgBorder"]
> ![Screenshot that shows customizing a workbook with a query and alerts.](./media/apache-spark-azure-log-analytics/kusto-query-and-alerts.png)

## Sample Kusto queries

The following is an example of querying Spark events:

```kusto
SparkListenerEvent_CL
| where workspaceName_s == "{SynapseWorkspace}" and clusterName_s == "{SparkPool}" and livyId_s == "{LivyId}"
| order by TimeGenerated desc
| limit 100 
```

Here's an example of querying the Spark application driver and executors logs:

```kusto
SparkLoggingEvent_CL
| where workspaceName_s == "{SynapseWorkspace}" and clusterName_s == "{SparkPool}" and livyId_s == "{LivyId}"
| order by TimeGenerated desc
| limit 100
```

And here's an example of querying Spark metrics:

```kusto
SparkMetrics_CL
| where workspaceName_s == "{SynapseWorkspace}" and clusterName_s == "{SparkPool}" and livyId_s == "{LivyId}"
| where name_s endswith "jvm.total.used"
| summarize max(value_d) by bin(TimeGenerated, 30s), executorId_s
| order by TimeGenerated asc
```

## Write custom application logs

You can use the Apache Log4j library to write custom logs.

Example for Scala:

```scala
%%spark
val logger = org.apache.log4j.LogManager.getLogger("com.contoso.LoggerExample")
logger.info("info message")
logger.warn("warn message")
logger.error("error message")
```

Example for PySpark:

```python
%%pyspark
logger = sc._jvm.org.apache.log4j.LogManager.getLogger("com.contoso.PythonLoggerExample")
logger.info("info message")
logger.warn("warn message")
logger.error("error message")
```

## Create and manage alerts

Users can query to evaluate metrics and logs at a set frequency, and fire an alert based on the results. For more information, see [Create, view, and manage log alerts by using Azure Monitor](../../azure-monitor/alerts/alerts-log.md).

## Limitation

Azure Synapse Analytics workspace with [managed virtual network](../security/synapse-workspace-managed-vnet.md) enabled isn't supported.

## Next steps

 - [Use serverless Apache Spark pool in Synapse Studio](../quickstart-create-apache-spark-pool-studio.md).
 - [Run a Spark application in notebook](./apache-spark-development-using-notebooks.md).
 - [Create Apache Spark job definition in Azure Studio](./apache-spark-job-definitions.md).
