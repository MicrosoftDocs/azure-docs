---
title: Manage Apache Spark configuration
description: Learn how to create an Apache Spark configuration for your synapse studio.
author: jejiang
ms.author: jejiang
ms.reviewer: whhender 
ms.service: azure-synapse-analytics
ms.topic: how-to
ms.subservice: spark
ms.date: 11/20/2024
ms.custom: references_regions
---

# Manage Apache Spark configuration

In this article, you learn how to create an Apache Spark configuration for your synapse studio. The created Apache Spark configuration can be managed in a standardized manner and when you create Notebook or Apache spark job definition can select the Apache Spark configuration that you want to use with your Apache Spark pool. When you select it, the details of the configuration are displayed.

## Create an Apache Spark Configuration

You can create custom configurations from different entry points, such as from the Apache Spark configuration page of an existing spark pool.

## Create custom configurations in Apache Spark configurations

Follow the steps below to create an Apache Spark Configuration in Synapse Studio.

1. Select **Manage** > **Apache Spark configurations**.
1. Select **New** button to create a new Apache Spark configuration, or select **Import** a local .json file to your workspace.
1. **New Apache Spark configuration** page will be opened after you select **New** button.
1. For **Name**, you can enter your preferred and valid name.
1. For **Description**, you can input some description in it.
1. For **Annotations**, you can add annotations by clicking the **New** button, and also you can delete existing annotations by selecting and clicking **Delete** button.
1. For **Configuration properties**, customize the configuration by clicking **Add** button to add properties. If you don't add a property, Azure Synapse will use the default value when applicable. 

   ![Screenshot that create spark configuration.](./media/apache-spark-azure-log-analytics/create-spark-configuration.png)

1. Select **Continue** button.
1. Select **Create** button when the validation succeeded.
1. Publish all.

> [!NOTE]
> **Upload Apache Spark configuration** feature has been removed.
>
> Pools using an uploaded configuration need to be updated. [Update your pool's configuration](#create-an-apache-spark-configuration-in-already-existing-apache-spark-pool) by selecting an existing configuration or creating a new configuration in the **Apache Spark configuration** menu for the pool. If no new configuration is selected, jobs for these pools will be run using the default configuration in the Spark system settings.

## Create an Apache Spark Configuration in already existing Apache Spark pool

Follow the steps below to create an Apache Spark configuration in an existing Apache Spark pool.

1. Select an existing Apache Spark pool, and select action "..." button.
1. Select the **Apache Spark configuration** in the content list.

   ![Screenshot that apache spark configuration.](./media/apache-spark-azure-create-spark-configuration/create-spark-configuration-by-right-click-on-spark-pool.png)

1. For Apache Spark configuration, you can select an already created configuration from the drop-down list, or select **+New** to create a new configuration.

   * If you select **+New**, the Apache Spark Configuration page will open, and you can create a new configuration by following the steps in [Create custom configurations in Apache Spark configurations](#create-custom-configurations-in-apache-spark-configurations).
   * If you select an existing configuration, the configuration details will be displayed at the bottom of the page, you can also select the **Edit** button to edit the existing configuration.

      ![Screenshot that edit spark configuration.](./media/apache-spark-azure-create-spark-configuration/edit-spark-config.png)

1. Select **View Configurations** to open the **Select a Configuration** page. All configurations will be displayed on this page. You can select a configuration that you want to use on this Apache Spark pool.
  
   ![Screenshot that select a configuration.](./media/apache-spark-azure-create-spark-configuration/select-a-configuration.png)

1. Select **Apply** button to save your action.

## Create an Apache Spark Configuration in the Notebook's configure session

If you need to use a custom Apache Spark Configuration when creating a Notebook, you can create and configure it in the **configure session** by following the steps below.

1. Create a new/Open an existing Notebook.
1. Open the **Properties** of this notebook.
1. Select **Configure session** to open the Configure session page.
1. Scroll down the configure session page, for Apache Spark configuration, expand the drop-down menu, you can select New button to [create a new configuration](#create-custom-configurations-in-apache-spark-configurations). Or select an existing configuration, if you select an existing configuration, select the **Edit** icon to go to the Edit Apache Spark configuration page to edit the configuration.
1. Select **View Configurations** to open the **Select a Configuration** page. All configurations will be displayed on this page. You can select a configuration that you want to use.

   ![Screenshot that create configuration in configure session.](./media/apache-spark-azure-create-spark-configuration/create-spark-config-in-configure-session.png)

## Create an Apache Spark Configuration in Apache Spark job definitions

When you're creating a spark job definition, you need to use Apache Spark configuration, which can be created by following the steps below:

1. Create a new/Open an existing Apache Spark job definition.
1. For **Apache Spark configuration**, you can select the **New** button to [create a new configuration](#create-custom-configurations-in-apache-spark-configurations). Or select an existing configuration in the drop-down menu, if you select an existing configuration, select the **Edit** icon to go to the Edit Apache Spark configuration page to edit the configuration.
1. Select **View Configurations** to open the **Select a Configuration** page. All configurations will be displayed on this page. You can select a configuration that you want to use.

   ![Screenshot that create configuration in spark job definitions.](./media/apache-spark-azure-create-spark-configuration/create-spark-config-in-spark-job-definition.png)

> [!NOTE]
>
> If the Apache Spark configuration in the Notebook and Apache Spark job definition does not do anything special, the default configuration will be used when running the job.

## Import and Export an Apache Spark configuration

You can import .txt/.conf/.json config in three formats and then convert it to artifact and publish it. And can also export to one of these three formats.  

* Import .txt/.conf/.json configuration from local.

   ![Screenshot that import config.](./media/apache-spark-azure-create-spark-configuration/import-config.png)

* Export .txt/.conf/.json configuration to local.

   ![Screenshot that export config.](./media/apache-spark-azure-create-spark-configuration/export-config.png)

For .txt config file and .conf config file, you can refer to the following examples:

```txt

spark.synapse.key1 sample
spark.synapse.key2 true
# spark.synapse.key3 sample2

```

For .json config file, you can refer to the following examples:

```json
{
"configs": {
   "spark.synapse.key1": "hello world",
"spark.synapse.key2": "true"
},
"annotations": [
   "Sample"
]
}
```

> [!NOTE]
> Synapse Studio will continue to support terraform or bicep-based configuration files.

## Related content

* [Use serverless Apache Spark pool in Synapse Studio](../quickstart-create-apache-spark-pool-studio.md).
* [Run a Spark application in notebook](./apache-spark-development-using-notebooks.md).
* [Collect Apache Spark applications logs and metrics with Azure Storage account](./azure-synapse-diagnostic-emitters-azure-storage.md).