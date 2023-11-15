---
title: Get started using DICOM data in analytics workloads - Azure Health Data Services
description: This article demonstrates how to use Azure Data Factory and Microsoft Fabric to perform analytics on DICOM data.
services: healthcare-apis
author: mmitrik
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: quickstart
ms.date: 10/13/2023
ms.author: mmitrik
---

# Get started using DICOM data in analytics workloads

This article describes how to get started by using DICOM&reg; data in analytics workloads with Azure Data Factory and Microsoft Fabric.

## Prerequisites

Before you get started, ensure that you've done the following steps:

* Deploy an instance of the [DICOM service](deploy-dicom-services-in-azure.md).
   * (_Optional_) Deploy the [DICOM service with Data Lake Storage (Preview)](deploy-dicom-services-in-azure-data-lake.md) to enable direct access to DICOM files.
* Create a [storage account with Azure Data Lake Storage Gen2 capabilities](../../storage/blobs/create-data-lake-storage-account.md) by enabling a hierarchical namespace:
    * Create a container to store DICOM metadata, for example, named `dicom`.
* Create a [Data Factory](../../data-factory/quickstart-create-data-factory.md) instance:
    * Enable a [system-assigned managed identity](../../data-factory/data-factory-service-identity.md).
* Create a [lakehouse](/fabric/data-engineering/tutorial-build-lakehouse) in Fabric.
* Add role assignments to the Data Factory system-assigned managed identity for the DICOM service and the Data Lake Storage Gen2 storage account:
    * Add the **DICOM Data Reader** role to grant permission to the DICOM service.
    * Add the **Storage Blob Data Contributor** role to grant permission to the Data Lake Storage Gen2 account.

## Configure a Data Factory pipeline for the DICOM service

In this example, a Data Factory [pipeline](../../data-factory/concepts-pipelines-activities.md) is used to write DICOM attributes for instances, series, and studies into a storage account in a [Delta table](https://delta.io/) format.

From the Azure portal, open the Data Factory instance and select **Launch studio** to begin.

:::image type="content" source="media/data-factory-launch-studio.png" alt-text="Screenshot that shows the Launch studio button in the Azure portal." lightbox="media/data-factory-launch-studio.png":::

### Create linked services

Data Factory pipelines read from _data sources_ and write to _data sinks_, which are typically other Azure services. These connections to other services are managed as _linked services_. 

The pipeline in this example reads data from a DICOM service and writes its output to a storage account, so a linked service must be created for both.

#### Create a linked service for the DICOM service

1. In Azure Data Factory Studio, select **Manage** from the menu on the left. Under **Connections**, select **Linked services** and then select **New**.

   :::image type="content" source="media/data-factory-linked-services.png" alt-text="Screenshot that shows the Linked services screen in Data Factory." lightbox="media/data-factory-linked-services.png":::

1. On the **New linked service** pane, search for **REST**. Select the **REST** tile and then select **Continue**.

   :::image type="content" source="media/data-factory-rest.png" alt-text="Screenshot that shows the New linked service pane with the REST tile selected." lightbox="media/data-factory-rest.png":::

1. Enter a **Name** and **Description** for the linked service.

   :::image type="content" source="media/data-factory-linked-service-dicom.png" alt-text="Screenshot that shows the New linked service pane with DICOM service details." lightbox="media/data-factory-linked-service-dicom.png":::

1. In the **Base URL** field, enter the service URL for your DICOM service. For example, a DICOM service named `contosoclinic` in the `contosohealth` workspace has the service URL `https://contosohealth-contosoclinic.dicom.azurehealthcareapis.com`.

1. For **Authentication type**, select **System Assigned Managed Identity**.

1. For **AAD resource**, enter `https://dicom.healthcareapis.azure.com`. This URL is the same for all DICOM service instances.

1. After you fill in the required fields, select **Test connection** to ensure the identity's roles are correctly configured.

1. When the connection test is successful, select **Create**.

#### Create a linked service for Azure Data Lake Storage Gen2

1. In Data Factory Studio, select **Manage** from the menu on the left. Under **Connections**, select **Linked services** and then select **New**.

1. On the **New linked service** pane, search for **Azure Data Lake Storage Gen2**. Select the **Azure Data Lake Storage Gen2** tile and then select **Continue**.

   :::image type="content" source="media/data-factory-adls.png" alt-text="Screenshot that shows the New linked service pane with the Azure Data Lake Storage Gen2 tile selected." lightbox="media/data-factory-adls.png":::

1. Enter a **Name** and **Description** for the linked service.

   :::image type="content" source="media/data-factory-linked-service-adls.png" alt-text="Screenshot that shows the New linked service pane with Data Lake Storage Gen2 details." lightbox="media/data-factory-linked-service-adls.png":::

1. For **Authentication type**, select **System Assigned Managed Identity**.

1. Enter the storage account details by entering the URL to the storage account manually. Or you can select the Azure subscription and storage account from dropdowns.

1. After you fill in the required fields, select **Test connection** to ensure the identity's roles are correctly configured.

1. When the connection test is successful, select **Create**.

### Create a pipeline for DICOM data

Data Factory pipelines are a collection of _activities_ that perform a task, like copying DICOM metadata to Delta tables. This section details the creation of a pipeline that regularly synchronizes DICOM data to Delta tables as data is added to, updated in, and deleted from a DICOM service.

1. Select **Author** from the menu on the left. In the **Factory Resources** pane, select the plus sign (+) to add a new resource. Select **Pipeline** and then select **Template gallery** from the menu.

   :::image type="content" source="media/data-factory-create-pipeline-menu.png" alt-text="Screenshot that shows Template gallery selected under Pipeline." lightbox="media/data-factory-create-pipeline-menu.png":::

1. In the **Template gallery**, search for **DICOM**. Select the **Copy DICOM Metadata Changes to ADLS Gen2 in Delta Format** tile and then select **Continue**.

   :::image type="content" source="media/data-factory-gallery-dicom.png" alt-text="Screenshot that shows the DICOM template selected in the Template gallery." lightbox="media/data-factory-gallery-dicom.png":::

1. In the **Inputs** section, select the linked services previously created for the DICOM service and Data Lake Storage Gen2 account.

   :::image type="content" source="media/data-factory-create-pipeline.png" alt-text="Screenshot that shows the Inputs section with linked services selected." lightbox="media/data-factory-create-pipeline.png":::

1. Select **Use this template** to create the new pipeline.

## Schedule a pipeline

Pipelines are scheduled by _triggers_. There are different types of triggers. _Schedule triggers_ allow pipelines to be triggered on a wall-clock schedule. _Manual triggers_ trigger pipelines on demand.

In this example, a _tumbling window trigger_ is used to periodically run the pipeline given a starting point and regular time interval. For more information about triggers, see [Pipeline execution and triggers in Azure Data Factory or Azure Synapse Analytics](../../data-factory/concepts-pipeline-execution-triggers.md).

### Create a new tumbling window trigger

1. Select **Author** from the menu on the left. Select the pipeline for the DICOM service and select **Add trigger** and **New/Edit** from the menu bar.

   :::image type="content" source="media/data-factory-add-trigger.png" alt-text="Screenshot that shows the pipeline view of Data Factory Studio with the Add trigger button on the menu bar selected." lightbox="media/data-factory-add-trigger.png":::

1. On the **Add triggers** pane, select the **Choose trigger** dropdown and then select **New**.

1. Enter a **Name** and **Description** for the trigger.

   :::image type="content" source="media/data-factory-new-trigger.png" alt-text="Screenshot that shows the New trigger pane with the Name, Description, Type, Date, and Recurrence fields." lightbox="media/data-factory-new-trigger.png":::

1. Select **Tumbling window** as the **Type**.

1. To configure a pipeline that runs hourly, set the **Recurrence** to **1 Hour**.

1. Expand the **Advanced** section and enter a **Delay** of **15 minutes**. This setting allows any pending operations at the end of an hour to complete before processing.

1. Set **Max concurrency** to **1** to ensure consistency across tables.

1. Select **OK** to continue configuring the trigger run parameters.

### Configure trigger run parameters

Triggers define when to run a pipeline. They also include [parameters](../../data-factory/how-to-use-trigger-parameterization.md) that are passed to the pipeline execution. The **Copy DICOM Metadata Changes to Delta** template defines a few parameters that are described in the following table. If no value is supplied during configuration, the listed default value is used for each parameter.

| Parameter name    | Description                            | Default value |
| :---------------- | :------------------------------------- | :------------ |
| BatchSize         | The maximum number of changes to retrieve at a time from the change feed (maximum 200) | `200` |
| ApiVersion        | The API version for the Azure DICOM service (minimum 2) | `2` |
| StartTime         | The inclusive start time for DICOM changes | `0001-01-01T00:00:00Z` | 
| EndTime           | The exclusive end time for DICOM changes | `9999-12-31T23:59:59Z` | 
| ContainerName     | The container name for the resulting Delta tables | `dicom` | 
| InstanceTablePath | The path that contains the Delta table for DICOM SOP instances within the container| `instance` | 
| SeriesTablePath   | The path that contains the Delta table for DICOM series within the container | `series` | 
| StudyTablePath    | The path that contains the Delta table for DICOM studies within the container | `study` | 
| RetentionHours    | The maximum retention in hours for data in the Delta tables | `720` | 

1. On the **Trigger Run Parameters** pane, enter the **ContainerName** value that matches the name of the storage container created in the prerequisites.

   :::image type="content" source="media/data-factory-trigger-parameters.png" alt-text="Screenshot that shows the Trigger Run Parameters pane, with StartTime and EndTime values entered." lightbox="media/data-factory-trigger-parameters.png":::

1. For **StartTime**, use the system variable `@formatDateTime(trigger().outputs.windowStartTime)`.

1. For **EndTime**, use the system variable `@formatDateTime(trigger().outputs.windowEndTime)`.

    > [!NOTE]
    > Only tumbling window triggers support the system variables:
    > *  `@trigger().outputs.windowStartTime` and 
    > * `@trigger().outputs.windowEndTime`
    >
    > Schedule triggers use different system variables:
    > * `@trigger().scheduledTime` and 
    > * `@trigger().startTime`
    >
    > Learn more about [trigger types](../../data-factory/concepts-pipeline-execution-triggers.md#trigger-type-comparison).

1. Select **Save** to create the new trigger. Select **Publish** to begin your trigger running on the defined schedule.

   :::image type="content" source="media/data-factory-publish.png" alt-text="Screenshot that shows the Publish button on the main menu bar." lightbox="media/data-factory-publish.png":::

After the trigger is published, it can be triggered manually by using the **Trigger now** option. If the start time was set for a value in the past, the pipeline starts immediately.

## Monitor pipeline runs

You can monitor trigger runs and their associated pipeline runs on the **Monitor** tab. Here, you can browse when each pipeline ran and how long it took to run. You can also potentially debug any problems that arose.

:::image type="content" source="media/data-factory-monitor.png" alt-text="Screenshot that shows the Monitor view with a list of pipeline runs." lightbox="media/data-factory-monitor.png":::

## Microsoft Fabric

[Fabric](https://www.microsoft.com/microsoft-fabric) is an all-in-one analytics solution that sits on top of [Microsoft OneLake](/fabric/onelake/onelake-overview). With the use of a [Fabric lakehouse](/fabric/data-engineering/lakehouse-overview), you can manage, structure, and analyze data in OneLake in a single location. Any data outside of OneLake, written to Data Lake Storage Gen2, can be connected to OneLake as shortcuts to take advantage of Fabric's suite of tools.

### Create shortcuts to metadata tables

1. Go to the lakehouse created in the prerequisites. In the **Explorer** view, select the ellipsis menu (**...**) next to the **Tables** folder.

1. Select **New shortcut** to create a new shortcut to the storage account that contains the DICOM analytics data.

   :::image type="content" source="media/fabric-create-shortcut.png" alt-text="Screenshot that shows the New shortcut option in the Explorer view." lightbox="media/fabric-create-shortcut.png":::

1. Select **Azure Data Lake Storage Gen2** as the source for the shortcut.

   :::image type="content" source="media/fabric-new-shortcut.png" alt-text="Screenshot that shows the New shortcut view with the Azure Data Lake Storage Gen2 tile." lightbox="media/fabric-new-shortcut.png":::

1. Under **Connection settings**, enter the **URL** you used in the [Linked services](#create-a-linked-service-for-azure-data-lake-storage-gen2) section.

   :::image type="content" source="media/fabric-connection-settings.png" alt-text="Screenshot that shows the connection settings for the Azure Data Lake Storage Gen2 account." lightbox="media/fabric-connection-settings.png":::

1. Select an existing connection or create a new connection by selecting the **Authentication kind** you want to use.

    > [!NOTE]
    > There are a few options for authenticating between Data Lake Storage Gen2 and Fabric. You can use an organizational account or a service principal. We don't recommend using account keys or shared access signature tokens.

1. Select **Next**.

1. Enter a **Shortcut Name** that represents the data created by the Data Factory pipeline. For example, for the `instance` Delta table, the shortcut name should probably be **instance**.

1. Enter the **Sub Path** that matches the `ContainerName` parameter from [run parameters](#configure-trigger-run-parameters) configuration and the name of the table for the shortcut. For example, use `/dicom/instance` for the Delta table with the path `instance` in the `dicom` container.

1. Select **Create** to create the shortcut.

1. Repeat steps 2 to 9 to add the remaining shortcuts to the other Delta tables in the storage account (for example, `series` and `study`).

After you've created the shortcuts, expand a table to show the names and types of the columns.

:::image type="content" source="media/fabric-shortcut-schema.png" alt-text="Screenshot that shows the table columns listed in the Explorer view." lightbox="media/fabric-shortcut-schema.png":::

### Create shortcuts to files

If you're using a [DICOM service with Data Lake Storage](dicom-data-lake.md), you can additionally create a shortcut to the DICOM file data stored in the data lake.  

1. Go to the lakehouse created in the prerequisites. In the **Explorer** view, select the ellipsis menu (**...**) next to the **Files** folder.

1. Select **New shortcut** to create a new shortcut to the storage account that contains the DICOM data.

   :::image type="content" source="media/fabric-new-shortcut-files.png" alt-text="Screenshot that shows the New shortcut option of the Files menu in the Explorer view." lightbox="media/fabric-new-shortcut-files.png":::

1. Select **Azure Data Lake Storage Gen2** as the source for the shortcut.

   :::image type="content" source="media/fabric-new-shortcut.png" alt-text="Screenshot that shows the New shortcut view with the Azure Data Lake Storage Gen2 tile." lightbox="media/fabric-new-shortcut.png":::

1. Under **Connection settings**, enter the **URL** you used in the [Linked services](#create-a-linked-service-for-azure-data-lake-storage-gen2) section.

   :::image type="content" source="media/fabric-connection-settings.png" alt-text="Screenshot that shows the connection settings for the Azure Data Lake Storage Gen2 account." lightbox="media/fabric-connection-settings.png":::

1. Select an existing connection or create a new connection by selecting the **Authentication kind** you want to use.

1. Select **Next**.

1. Enter a **Shortcut Name** that describes the DICOM data. For example, **contoso-dicom-files**.

1. Enter the **Sub Path** that matches the name of the storage container and folder used by the DICOM service. For example, if you wanted to link to the root folder the Sub Path would be **/dicom/AHDS**.  Note, the root folder will always be `AHDS`, but you can optionally link to a child folder for a specific workspace or DICOM service instance.  

1. Select **Create** to create the shortcut.

:::image type="content" source="media/fabric-shortcut-files-complete.png" alt-text="Screenshot that shows the shortcut to the DICOM files." lightbox="media/fabric-shortcut-files-complete.png":::

### Run notebooks

After the tables are created in the lakehouse, you can query them from [Fabric notebooks](/fabric/data-engineering/how-to-use-notebook). You can create notebooks directly from the lakehouse by selecting **Open Notebook** from the menu bar.

On the notebook page, the contents of the lakehouse can still be viewed on the left side, including the newly added tables. At the top of the page, select the language for the notebook. The language can also be configured for individual cells. The following example uses Spark SQL.

#### Query tables by using Spark SQL

In the cell editor, enter a Spark SQL query like a `SELECT` statement.

``` SQL
SELECT * from instance
```

This query selects all the contents from the `instance` table. When you're ready, select **Run cell** to run the query.

:::image type="content" source="media/fabric-notebook.png" alt-text="Screenshot that shows a notebook with a sample Spark SQL query." lightbox="media/fabric-notebook.png":::

After a few seconds, the results of the query appear in a table underneath the cell like the example shown here. The amount of time might be longer if this Spark query is the first in the session because the Spark context needs to be initialized.

:::image type="content" source="media/fabric-notebook-results.png" alt-text="Screenshot that shows a notebook with a sample Spark SQL query and results." lightbox="media/fabric-notebook-results.png":::

### Access DICOM file data in notebooks

If you've created a shortcut to the DICOM file data, you can use the `filePath` column in the `instance` table to correlate instance metadata to file data.  

``` SQL
SELECT sopInstanceUid, filePath from instance
```
:::image type="content" source="media/fabric-notebook-filepath.png" alt-text="Screenshot that shows a notebook with a sample Spark SQL query and results that includes the filePath." lightbox="media/fabric-notebook-filepath.png":::


## Summary

In this article, you learned how to:

* Use Data Factory templates to create a pipeline from the DICOM service to a Data Lake Storage Gen2 account.
* Configure a trigger to extract DICOM metadata on an hourly schedule.
* Use shortcuts to connect DICOM data in a storage account to a Fabric lakehouse.
* Use notebooks to query for DICOM data in the lakehouse.

## Next steps

Learn more about Data Factory pipelines:

* [Pipelines and activities in Data Factory](../../data-factory/concepts-pipelines-activities.md)
* [Use Microsoft Fabric notebooks](/fabric/data-engineering/how-to-use-notebook)

[!INCLUDE [DICOM trademark statement](../includes/healthcare-apis-dicom-trademark.md)]
