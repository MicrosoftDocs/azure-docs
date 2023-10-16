---
title: Get started using DICOM data in analytics workloads - Azure Health Data Services
description: This guide demonstrates how to use Azure Data Factory and Microsoft Fabric to perform analytics on DICOM data.
services: healthcare-apis
author: mmitrik
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: quickstart
ms.date: 10/13/2023
ms.author: mmitrik
---

# Get Started using DICOM Data in Analytics Workloads

This article details how to get started using DICOM&reg; data in analytics workloads with Azure Data Factory and Microsoft Fabric.

## Prerequisites
Before getting started, ensure you have done the following steps:

* Deploy an instance of the [DICOM Service](deploy-dicom-services-in-azure.md).
* Create a [storage account with Azure Data lake Storage Gen2 (ADLS Gen2) capabilities](../../storage/blobs/create-data-lake-storage-account.md) by enabling a hierarchical namespace. 
    * Create a container to store DICOM metadata, for example, named "dicom".  
* Create an instance of [Azure Data Factory (ADF)](../../data-factory/quickstart-create-data-factory.md).
    * Ensure that a [system assigned managed identity](../../data-factory/data-factory-service-identity.md) has been enabled.
* Create a [Lakehouse](/fabric/data-engineering/tutorial-build-lakehouse) in Microsoft Fabric.
* Add role assignments to the ADF system assigned managed identity for the DICOM Service and the ADLS Gen2 storage account.
    * Add the **DICOM Data Reader** role to grant permission to the DICOM service.
    * Add the **Storage Blob Data Contributor** role to grant permission to the ADLS Gen2 account.

## Configure an Azure Data Factory pipeline for the DICOM service

In this example, an Azure Data Factory [pipeline](../../data-factory/concepts-pipelines-activities.md) will be used to write DICOM attributes for instances, series, and studies into a storage account in a [Delta table](https://delta.io/) format.  

From the Azure portal, open the Azure Data Factory instance and select **Launch Studio** to begin.  

:::image type="content" source="media/data-factory-launch-studio.png" alt-text="Screenshot of the Launch studio button in the Azure portal." lightbox="media/data-factory-launch-studio.png":::

### Create linked services
Azure Data Factory pipelines read from _data sources_ and write to _data sinks_, typically other Azure services. These connections to other services are managed as _linked services_. The pipeline in this example will read data from a DICOM service and write its output to a storage account, so a linked service must be created for both. 

#### Create linked service for the DICOM service
1. In the Azure Data Factory Studio, select **Manage** from the navigation menu. Under **Connections** select **Linked services** and then select **New**.

:::image type="content" source="media/data-factory-linked-services.png" alt-text="Screenshot of the Linked services screen in Azure Data Factory." lightbox="media/data-factory-linked-services.png":::

2. On the New linked service panel, search for "REST". Select the **REST** tile and then **Continue**.

:::image type="content" source="media/data-factory-rest.png" alt-text="Screenshot of the New Linked services panel with REST tile selected." lightbox="media/data-factory-rest.png":::

3. Enter a **Name** and **Description** for the linked service.  

:::image type="content" source="media/data-factory-linked-service-dicom.png" alt-text="Screenshot of the New linked service panel with DICOM service details." lightbox="media/data-factory-linked-service-dicom.png":::

4. In the **Base URL** field, enter the Service URL for your DICOM service. For example, a DICOM service named `contosoclinic` in the `contosohealth` workspace will have the Service URL `https://contosohealth-contosoclinic.dicom.azurehealthcareapis.com`.

5. For Authentication type, select **System Assigned Managed Identity**.

6. For **AAD resource**, enter `https://dicom.healthcareapis.azure.com`. Note, this URL is the same for all DICOM service instances.

7. After populating the required fields, select **Test connection** to ensure the identity's roles are correctly configured.  

8. When the connection test is successful, select **Create**.

#### Create linked service for Azure Data Lake Storage Gen2
1. In the Azure Data Factory Studio, select **Manage** from the navigation menu. Under **Connections** select **Linked services** and then select **New**.

2. On the New linked service panel, search for "Azure Data Lake Storage Gen2". Select the **Azure Data Lake Storage Gen2** tile and then **Continue**.

:::image type="content" source="media/data-factory-adls.png" alt-text="Screenshot of the New Linked services panel with Azure Data Lake Storage Gen2 tile selected." lightbox="media/data-factory-adls.png":::

3. Enter a **Name** and **Description** for the linked service.

:::image type="content" source="media/data-factory-linked-service-adls.png" alt-text="Screenshot of the New Linked services panel with Azure Data Lake Storage Gen2 details." lightbox="media/data-factory-linked-service-adls.png":::

4. For Authentication type, select **System Assigned Managed Identity**.

5. Enter the storage account details by entering the URL to the storage account manually or by selecting the Azure subscription and storage account from dropdowns.  

6. After populating the required fields, select **Test connection** to ensure the identity's roles are correctly configured.

7. When the connection test is successful, select **Create**.

### Create a pipeline for DICOM data
Azure Data Factory pipelines are a collection of _activities_ that perform a task, like copying DICOM metadata to Delta tables. This section details the creation of a pipeline that regularly synchronizes DICOM data to Delta tables as data is added to, updated in, and deleted from a DICOM service.

1. Select **Author** from the navigation menu. In the **Factory Resources** pane, select the plus (+) to add a new resource. Select **Pipeline** and then **Template gallery** from the menu.  

:::image type="content" source="media/data-factory-create-pipeline-menu.png" alt-text="Screenshot of the New Pipeline from Template Gallery." lightbox="media/data-factory-create-pipeline-menu.png":::

2. In the Template gallery, search for "DICOM". Select the **Copy DICOM Metadata Changes to ADLS Gen2 in Delta Format** tile and then **Continue**.

:::image type="content" source="media/data-factory-gallery-dicom.png" alt-text="Screenshot of the DICOM template selected in Template gallery." lightbox="media/data-factory-gallery-dicom.png":::

3. In the **Inputs** section, select the linked services previously created for the DICOM service and Azure Data Lake Storage Gen2 account.

:::image type="content" source="media/data-factory-create-pipeline.png" alt-text="Screenshot of the Create pipeline view with linked services selected." lightbox="media/data-factory-create-pipeline.png":::

4. Select **Use this template** to create the new pipeline.  

## Scheduling a pipeline
Pipelines are scheduled by _triggers_. There are different types of triggers including _schedule triggers_, which allow pipelines to be triggered on a wall-clock schedule, and _manual triggers_, which trigger pipelines on demand. In this example, a _tumbling window trigger_ is used to periodically run the pipeline given a starting point and regular time interval. For more information about triggers, see the [pipeline execution and triggers article](../../data-factory/concepts-pipeline-execution-triggers.md). 

### Create a new tumbling window trigger
1. Select **Author** from the navigation menu. Select the pipeline for the DICOM service and select **Add trigger** and **New/Edit** from the menu bar.

:::image type="content" source="media/data-factory-add-trigger.png" alt-text="Screenshot of the pipeline view of Data Factory Studio with the Add trigger button on the menu bar selected." lightbox="media/data-factory-add-trigger.png":::

2. In the **Add triggers** panel, select the **Choose trigger** dropdown and then **New**.

3. Enter a **Name** and **Description** for the trigger.

:::image type="content" source="media/data-factory-new-trigger.png" alt-text="Screenshot of the New trigger details panel, with name, description, type, date, and recurrence." lightbox="media/data-factory-new-trigger.png":::

4. Select **Tumbling window** as the type.

5. To configure a pipeline that runs hourly, set the recurrence to **1 Hour**.

6. Expand the **Advanced** section and enter a **Delay** of **15 minutes**. This will allow any pending operations at the end of an hour to complete before processing.  

7. Set the **Max concurrency** to **1** to ensure consistency across tables.  

8. Select **Ok** to continue configuring the trigger run parameters.

### Configure trigger run parameters
Triggers not only define when to run a pipeline, they also include [parameters](../../data-factory/how-to-use-trigger-parameterization.md) that are passed to the pipeline execution.  The **Copy DICOM Metadata Changes to Delta** template defines a few parameters detailed in the table below.  Note, if no value is supplied during configuration, the listed default value will be used for each parameter.

| Parameter name    | Description                            | Default value |
| :---------------- | :------------------------------------- | :------------ |
| BatchSize         | The maximum number of changes to retrieve at a time from the change feed (max 200). | `200` |
| ApiVersion        | The API version for the Azure DICOM Service (min 2). | `2` |
| StartTime         | The inclusive start time for DICOM changes. | `0001-01-01T00:00:00Z` | 
| EndTime           | The exclusive end time for DICOM changes. | `9999-12-31T23:59:59Z` | 
| ContainerName     | The container name for the resulting Delta tables. | `dicom` | 
| InstanceTablePath | The path containing the Delta table for DICOM SOP instances within the container.| `instance` | 
| SeriesTablePath   | The path containing the Delta table for DICOM series within the container. | `series` | 
| StudyTablePath    | The path containing the Delta table for DICOM studies within the container. | `study` | 
| RetentionHours    | The maximum retention in hours for data in the Delta tables. | `720` | 

1. In the **Trigger run parameters** panel, enter in the **ContainerName** that matches the name of the storage container created in the prerequisites.

:::image type="content" source="media/data-factory-trigger-parameters.png" alt-text="Screenshot of the Trigger Run Parameters, with StartTime and EndTime values entered." lightbox="media/data-factory-trigger-parameters.png":::

2. For **StartTime** use the system variable `@formatDateTime(trigger().outputs.windowStartTime)`.

3. For **EndTime** use the system variable `@formatDateTime(trigger().outputs.windowEndTime)`.

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

4. Select **Save** to create the new trigger. Be sure to select **Publish** on the menu bar to begin your trigger running on the defined schedule.  

:::image type="content" source="media/data-factory-publish.png" alt-text="Screenshow showing the Publish button on the main menu bar." lightbox="media/data-factory-publish.png":::

After the trigger is published, it can be triggered manually using the **Trigger now** option. If the start time was set for a value in the past, the pipeline will start immediately.  

## Monitoring pipeline runs
Trigger runs and their associated pipeline runs can be monitored in the **Monitor** tab. Here, users can browse when each pipeline ran, how long it took to execute, and potentially debug any problems that arose.

:::image type="content" source="media/data-factory-monitor.png" alt-text="Screenshot of the Monitor view showing list of pipeline runs." lightbox="media/data-factory-monitor.png":::

## Microsoft Fabric
[Microsoft Fabric](https://www.microsoft.com/microsoft-fabric) is an all-in-one analytics solution that sits on top of [Microsoft OneLake](/fabric/onelake/onelake-overview). With the use of [Microsoft Fabric Lakehouse](/fabric/data-engineering/lakehouse-overview), data in OneLake can be managed, structured, and analyzed in a single location. Any data outside of OneLake, written to Azure Data Lake Storage Gen2, can be connected to OneLake as shortcuts to take advantage of Fabric’s suite of tools.

### Creating shortcuts
1. Navigate to the lakehouse created in the prerequisites. In the **Explorer** view, select the triple-dot menu (...) next to the **Tables** folder.  

2. Select **New shortcut** to create a new shortcut to the storage account that contains the DICOM analytics data.

:::image type="content" source="media/fabric-create-shortcut.png" alt-text="Screenshot of the New shortcut option in the Explorer view. " lightbox="media/fabric-create-shortcut.png":::

3. Select **Azure Data Lake Storage Gen2** as the source for the shortcut.

:::image type="content" source="media/fabric-new-shortcut.png" alt-text="Screenshot of the New shortcut view, showing the Azure Data Lake Storage Gen2 tile." lightbox="media/fabric-new-shortcut.png":::

4. Under **Connection settings**, enter the **URL** used in the [Linked Services](#create-linked-service-for-azure-data-lake-storage-gen2) section above.  

:::image type="content" source="media/fabric-connection-settings.png" alt-text="Screenshot of the connection settings for the Azure Data Lake Storage Gen2 account. " lightbox="media/fabric-connection-settings.png":::

5. Select an existing connection or create a new connection, selecting the Authentication kind you want to use. 

> [!NOTE]
> For authenticating between Azure Data Lake Storage Gen2 and Microsoft Fabric, there are a few options, including an organizational account and service principal; it is not recommended to use account keys or Shared Access Signature (SAS) tokens.

6. Select **Next**.

7. Enter a **Shortcut Name** that represents the data created by the Azure Data Factory pipeline. For example, for the `instance` Delta table, the shortcut name should probably be **instance**. 

8. Enter the **Sub Path** that matches the `ContainerName` parameter from [run parameters](#configure-trigger-run-parameters) configuration and the name of the table for the shortcut. For example, use "/dicom/instance" for the Delta table with the path `instance` in the `dicom` container. 

9. Select **Create** to create the shortcut.

10. Repeat steps 2-9 for adding the remaining shortcuts to the other Delta tables in the storage account (e.g. `series` and `study`).

After the shortcuts have been created, expanding a table will show the names and types of the columns.  

:::image type="content" source="media/fabric-shortcut-schema.png" alt-text="Screenshot of the table columns listed in the explorer view." lightbox="media/fabric-shortcut-schema.png":::

### Running notebooks
Once the tables have been created in the lakehouse, they can be queried from [Microsoft Fabric notebooks](/fabric/data-engineering/how-to-use-notebook). Notebooks may be created directly from the lakehouse by selecting **Open Notebook** from the menu bar. 

On the notebook page, the contents of the lakehouse can still be viewed on the left-hand side, including the newly added tables. At the top of the page, select the language for the notebook (the language may also be configured for individual cells). The following example will use Spark SQL.

#### Query tables using Spark SQL
In the cell editor, enter a simple Spark SQL query like a `SELECT` statement.

``` SQL
SELECT * from instance
```

This query will select all of the contents from the `instance` table. When ready, select the **Run cell** button to execute the query. 

:::image type="content" source="media/fabric-notebook.png" alt-text="Screenshot of a notebook with sample Spark SQL query." lightbox="media/fabric-notebook.png":::

After a few seconds, the results of the query should appear in a table beneath the cell like (the time might be longer if this is the first Spark query in the session as the Spark context will need to be initialized).

:::image type="content" source="media/fabric-notebook-results.png" alt-text="Screenshot of a notebook with sample Spark SQL query and results." lightbox="media/fabric-notebook-results.png":::

## Summary
In this article, you learned how to:
* Use Azure Data Factory templates to create a pipeline from the DICOM service to an Azure Data Lake Storage Gen2 account
* Configure a trigger to extract DICOM metadata on an hourly schedule
* Use shortcuts to connect DICOM data in a storage account to a Microsoft Fabric lakehouse
* Use notebooks to query for DICOM data in the lakehouse

## Next steps

Learn more about Azure Data Factory pipelines:

* [Pipelines and activities in Azure Data Factory](../../data-factory/concepts-pipelines-activities.md)

* [How to use Microsoft Fabric notebooks](/fabric/data-engineering/how-to-use-notebook)

  
[!INCLUDE [DICOM trademark statement](../includes/healthcare-apis-dicom-trademark.md)]
