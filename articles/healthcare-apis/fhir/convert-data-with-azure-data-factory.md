---
title: Transform HL7v2 data to FHIR R4 with $convert-data and Azure Data Factory - Azure Health Data Services
description: Learn how to transform HL7v2 data to FHIR R4 with $convert-data and Azure Data Factory
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: how-to
ms.date: 09/05/2023
ms.author: jasteppe
---

# Transform HL7v2 data to FHIR R4 with $convert-data and Azure Data Factory

> [!NOTE]
> [Fast Healthcare Interoperability Resources (FHIR&#174;)](https://www.hl7.org/fhir/) is an open healthcare specification.

In this article, we detail how to use [Azure Data Factory (ADF)](../../data-factory/introduction.md) with the `$convert-data` operation to transform [HL7v2](https://www.hl7.org/implement/standards/product_brief.cfm?product_id=185) data to [FHIR R4](https://www.hl7.org/fhir/R4/). The transformed results are then persisted within an [Azure storage account](../../storage/common/storage-account-overview.md) with [Azure Data Lake Storage (ADLS) Gen2](../../storage/blobs/data-lake-storage-introduction.md) capabilities.

## Prerequisites

Before getting started, ensure you have taken the following steps:

1. Deploy an instance of the [FHIR service](fhir-portal-quickstart.md). The FHIR service is used to invoke the [`$convert-data`](overview-of-convert-data.md) operation.
2. By default, the ADF pipeline in this scenario uses the [predefined templates provided by Microsoft](configure-settings-convert-data.md#default-templates) for conversion. If your use case requires customized templates, set up your [Azure Container Registry instance to host your own templates](configure-settings-convert-data.md#host-your-own-templates) to be used for the conversion operation. 
3. Create storage account(s) with [Azure Data Lake Storage Gen2 (ADLS Gen2) capabilities](../../storage/blobs/create-data-lake-storage-account.md) by enabling a hierarchical namespace and container(s) to store the data to read from and write to.

   > [!NOTE]
   > You can create and use either one or separate ADLS Gen2 accounts and containers to:
   > * Store the HL7v2 data to be transformed (for example: the source account and container the pipeline will read the data to be transformed from).
   > * Store the transformed FHIR R4 bundles (for example: the destination account and container the pipeline will write the transformed result to).
   > * Store the errors encountered during the transformation (for example: the destination account and container the pipeline will write execution errors to).

4. Create an instance of [ADF](../../data-factory/quickstart-create-data-factory.md), which serves as a business logic orchestrator. Ensure that a [system-assigned managed identity](../../data-factory/data-factory-service-identity.md) has been enabled. 
5. Add the following [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md) assignments to the ADF system-assigned managed identity:
   * **FHIR Data Converter** role to [grant permission to the FHIR service](../../healthcare-apis/configure-azure-rbac.md#assign-roles-for-the-fhir-service).
   * **Storage Blob Data Contributor** role to [grant permission to the ADLS Gen2 account](../../storage/blobs/assign-azure-role-data-access.md?tabs=portal).

## Configure an Azure Data Factory pipeline  

In this example, an ADF [pipeline](../../data-factory/concepts-pipelines-activities.md?tabs=data-factory) is used to transform HL7v2 data and persist transformed FHIR R4 bundle in a JSON file within the configured destination ADLS Gen2 account and container.  
 
1. From the Azure portal, open your Azure Data Factory instance and select **Launch Studio** to begin. 

   :::image type="content" source="media/convert-data/convert-data-with-azure-data-factory/select-launch-studio.png" alt-text="Screenshot of Azure Data Factory." lightbox="media/convert-data/convert-data-with-azure-data-factory/select-launch-studio.png":::

## Create a pipeline

Azure Data Factory pipelines are a collection of activities that perform a task. This section details the creation of a pipeline that performs the task of transforming HL7v2 data to FHIR R4 bundles. Pipeline execution can be in an improvised fashion or regularly based on defined triggers. 

1. Select **Author** from the navigation menu. In the **Factory Resources** pane, select the **+** to add a new resource. Select **Pipeline** and then **Template gallery** from the menu.

   :::image type="content" source="media/convert-data/convert-data-with-azure-data-factory/open-template-gallery.png" alt-text="Screenshot of the Artifacts screen for registering an Azure Container Registry with a FHIR service." lightbox="media/convert-data/convert-data-with-azure-data-factory/open-template-gallery.png"::: 

2. In the Template gallery, search for **HL7v2**. Select the **Transform HL7v2 health data to FHIR R4 format and write to ADLS Gen2** tile and then select **Continue**. 

   :::image type="content" source="media/convert-data/convert-data-with-azure-data-factory/search-for-template.png" alt-text="Screenshot of the search for the Transform HL7v2 health data to FHIR R4 format and write to ADLS Gen2 template." lightbox="media/convert-data/convert-data-with-azure-data-factory/search-for-template.png":::

3. Select **Use this template** to create the new pipeline.

   :::image type="content" source="media/convert-data/convert-data-with-azure-data-factory/use-this-template.png" alt-text="Screenshot of the Transform HL7v2 health data to FHIR R4 format and write to ADLS Gen2 template preview." lightbox="media/convert-data/convert-data-with-azure-data-factory/use-this-template.png"::: 
  
   ADF imports the template, which is composed of an end-to-end main pipeline and a set of individual pipelines/activities. The main end-to-end pipeline for this scenario is named **Transform HL7v2 health data to FHIR R4 format and write to ADLS Gen2** and can be accessed by selecting **Pipelines**. The main pipeline invokes the other individual pipelines/activities under the subcategories of **Extract**, **Load**, and **Transform**.

   :::image type="content" source="media/convert-data/convert-data-with-azure-data-factory/overview-pipeline-template.png" alt-text="Screenshot of the Transform HL7v2 health data to FHIR R4 format and write to ADLS Gen2 Azure Data Factory template." lightbox="media/convert-data/convert-data-with-azure-data-factory/overview-pipeline-template.png"::: 

   If needed, you can make any modifications to the pipelines/activities to fit your scenario (for example: if you don't intend to persist the results in a destination ADLS Gen2 storage account, you can modify the pipeline to remove the **Write converted result to ADLS Gen2** pipeline altogether).

4. Select the **Parameters** tab and provide values based your configuration/setup. Some of the values are based on the resources setup as part of the [prerequisites](#prerequisites).

   :::image type="content" source="media/convert-data/convert-data-with-azure-data-factory/input-pipeline-parameters.png" alt-text="Screenshot of the pipeline parameters options." lightbox="media/convert-data/convert-data-with-azure-data-factory/input-pipeline-parameters.png"::: 

   * **fhirService** – Provide the URL of the FHIR service to target for the `$convert-data` operation. For example: `https://**myservice-fhir**.fhir.azurehealthcareapis.com/`
   * **acrServer** – Provide the name of the ACR server to pull the Liquid templates to use for conversion. By default, option is set to `microsofthealth`, which contains the predefined template collection published by Microsoft. To use your own template collection, replace this value with your ACR instance that hosts your templates and is registered to your FHIR service. 
   * **templateReference** – Provide the reference to the image within the ACR that contains the Liquid templates to use for conversion. By default, this option is set to `hl7v2templates:default` to pull the latest published Liquid templates for HL7v2 conversion by Microsoft. To use your own template collection, replace this value with the reference to the image within your ACR that hosts your templates and is registered to your FHIR service.
   * **inputStorageAccount** – The primary endpoint of the ADLS Gen2 storage account containing the input HL7v2 data to transform. For example: `https://**mystorage**.blob.core.windows.net`.
   * **inputStorageFolder** – The container and folder path within the configured. For example: `**mycontainer**/**myHL7v2folder**`.

   > [!NOTE]
   > This can be a static folder path or can be left blank here and dynamically configured when setting up storage account triggers for this pipeline execution (refer to the section titled [Executing a pipeline](#executing-a-pipeline)).

   * **inputStorageFile** – The name of the file within the configured container.
   * **inputStorageAccount** and **inputStorageFolder** that contains the HL7v2 data to transform. For example: `**myHL7v2file**.hl7`.

   > [!NOTE]
   > This can be a static folder path or can be left blank here and dynamically configured when setting up storage account triggers for this pipeline execution (refer to the section titled [Executing a pipeline](#executing-a-pipeline)).

   * **outputStorageAccount** – The primary endpoint of the ADLS Gen2 storage account to store the transformed FHIR bundle. For example: `https://**mystorage**.blob.core.windows.net`.
   * **outputStorageFolder** – The container and folder path within the configured **outputStorageAccount** to which the transformed FHIR bundle JSON files are written to.
   * **rootTemplate** – The root template to use while transforming the provided HL7v2 data. For example: ADT_A01, ADT_A02, ADT_A03, ADT_A04, ADT_A05, ADT_A08, ADT_A11, ADT_A13, ADT_A14, ADT_A15, ADT_A16, ADT_A25, ADT_A26, ADT_A27, ADT_A28, ADT_A29, ADT_A31, ADT_A47, ADT_A60, OML_O21, ORU_R01, ORM_O01, VXU_V04, SIU_S12, SIU_S13, SIU_S14, SIU_S15, SIU_S16, SIU_S17, SIU_S26, MDM_T01, MDM_T02.

   > [!NOTE]
   > This can be a static folder path or can be left blank here and dynamically configured when setting up storage account triggers for this pipeline execution (refer to the section titled [Executing a pipeline](#executing-a-pipeline)).

   * **errorStorageFolder** - The container and folder path within the configured **outputStorageAccount** to which the errors encountered during execution are written to. For example: `**mycontainer**/**myerrorfolder**`.

5. You can configure more pipeline settings under the **Settings** tab based on your requirements.

   :::image type="content" source="media/convert-data/convert-data-with-azure-data-factory/settings-tab-overview.png" alt-text="Screenshot of the Settings option." lightbox="media/convert-data/convert-data-with-azure-data-factory/settings-tab-overview.png":::

6. You can also optionally debug your pipeline to verify the setup. Select **Debug**. 

   :::image type="content" source="media/convert-data/convert-data-with-azure-data-factory/debug-pipeline.png" alt-text="Screenshot of the Azure Data Factory debugging option." lightbox="media/convert-data/convert-data-with-azure-data-factory/debug-pipeline.png"::: 

7. Verify your pipeline run parameters and select **OK**. 

   :::image type="content" source="media/convert-data/convert-data-with-azure-data-factory/verify-pipeline-parameters.png" alt-text="Screenshot of the Azure Data Factory verify pipeline parameters." lightbox="media/convert-data/convert-data-with-azure-data-factory/verify-pipeline-parameters.png"::: 

8. You can monitor the debug execution of the pipeline under the **Output** tab. 

   :::image type="content" source="media/convert-data/convert-data-with-azure-data-factory/output-pipeline-status.png" alt-text="Screenshot of the pipeline output status." lightbox="media/convert-data/convert-data-with-azure-data-factory/output-pipeline-status.png"::: 

9. Once you're satisfied with your pipeline setup, select **Publish all**.

   :::image type="content" source="media/convert-data/convert-data-with-azure-data-factory/select-publish-all.png" alt-text="Screenshot of the Azure Data Factory Publish all option." lightbox="media/convert-data/convert-data-with-azure-data-factory/select-publish-all.png"::: 

10. Select **Publish** to save your pipeline within your own ADF instance.

    :::image type="content" source="media/convert-data/convert-data-with-azure-data-factory/select-publish.png" alt-text="Screenshot of the Azure Data Factory Publish option." lightbox="media/convert-data/convert-data-with-azure-data-factory/select-publish.png"::: 

## Executing a pipeline

You can execute (or run) a pipeline either manually or by using a trigger. There are different types of triggers that can be created to help automate your pipeline execution. For example:

* **Manual trigger**
* **Schedule trigger**
* **Tumbling window trigger**
* **Event-based trigger**

For more information on the different trigger types and how to configure them, see [Pipeline execution and triggers in Azure Data Factory or Azure Synapse Analytics](../../data-factory/concepts-pipeline-execution-triggers.md).

By setting triggers, you can simulate batch transformation of HL7v2 data. The pipeline executes automatically based on the configured trigger parameters without requiring individual invocation of the `$convert-data` operation for each input message.

> [!IMPORTANT]
> In a scenario with batch processing of HL7v2 messages, this template does not take sequencing into account, so post processing will be needed if sequencing is a requirement.

## Create a new storage event trigger

In the following example, a storage event trigger is used. The storage event trigger automatically triggers the pipeline whenever a new HL7v2 data blob file to be processed is uploaded to the ADLS Gen2 storage account.

To configure the pipeline to automatically run whenever a new HL7v2 blob file in the source ADLS Gen2 storage account is available to transform, follow these steps:

1. Select **Author** from the navigation menu. Select the pipeline configured in the previous section and select **Add trigger** and **New/Edit** from the menu bar. 
   
   :::image type="content" source="media/convert-data/convert-data-with-azure-data-factory/select-add-trigger.png" alt-text="Screenshot of the Azure Data Factory Add trigger and New/Edit options." lightbox="media/convert-data/convert-data-with-azure-data-factory/select-add-trigger.png":::

2.	In the **Add triggers** panel, select the **Choose trigger** dropdown and then select **New**. 
3.	Enter a **Name** and **Description** for the trigger.
4.	Select **Storage events** as the **Type**.
5.	Configure the storage account details containing the source HL7v2 data to transform (for example: ADLS Gen2 storage account name, container name, blob path, etc.) to reference for the trigger.
6.	Select **Blob created** as the **Event**.

   :::image type="content" source="media/convert-data/convert-data-with-azure-data-factory/create-new-storage-event-trigger.png" alt-text="Screenshot of creating a new storage event trigger." lightbox="media/convert-data/convert-data-with-azure-data-factory/create-new-storage-event-trigger.png":::

7.	Select **Continue** to see the **Data preview** for the configured settings.
8.	Select **Continue** again at **Data preview**  to continue configuring the trigger run parameters. 

## Configure trigger run parameters

Triggers not only define when to run a pipeline, they also include [parameters](../../data-factory/how-to-use-trigger-parameterization.md) that are passed to the pipeline execution. You can configure pipeline parameters dynamically using the trigger run parameters.

The storage event trigger captures the folder path and file name of the blob into the properties `@triggerBody().folderPath` and `@triggerBody().fileName`. To use the values of these properties in a pipeline, you must map the properties to pipeline parameters. After mapping the properties to parameters, you can access the values captured by the trigger through the `@pipeline().parameters.parameterName` expression throughout the pipeline. For more information, see [Reference trigger metadata in pipeline runs](../../data-factory/how-to-use-trigger-parameterization.md).

For the **Transform HL7v2 health data to FHIR R4 format and write to ADLS Gen2 template**, the storage event trigger properties can be used to configure certain pipeline parameters.

> [!NOTE] 
> If no value is supplied during configuration, then the previously configured default value will be used for each parameter. 

1. In the **New trigger** pane, within the **Trigger Run Parameters** options, use the following values:
   * For **inputStorageFolder** use `@triggerBody().folderPath`. This parameter provides the runtime value for this parameter based on the folder path associated with the event triggered (for example: folder path of the new HL7v2 blob created/updated in the storage account configured in the trigger).
   * For **inputStorageFile** use `@triggerBody().fileName`. This parameter provides the runtime value for this parameter based on the file associated with the event triggered (for example: file name of the new HL7v2 blob created/updated in the storage account configured in the trigger).
   * For **rootTemplate** specify the name of the template to be used for the pipeline executions associated with this trigger (for example: `ADT_A01`).

2. Select **OK** to create the new trigger. Be sure to select **Publish** on the menu bar to begin your trigger running on the defined schedule.

   :::image type="content" source="media/convert-data/convert-data-with-azure-data-factory/trigger-run-parameters.png" alt-text="Screenshot of Azure Data Factory trigger parameters." lightbox="media/convert-data/convert-data-with-azure-data-factory/trigger-run-parameters.png":::

After the trigger is published, it can be triggered manually using the **Trigger now** option. If the start time was set for a value in the past, the pipeline starts immediately. 

## Monitoring pipeline runs

Trigger runs and their associated pipeline runs can be viewed in the **Monitor** tab. Here, users can browse when each pipeline ran, how long it took to execute, and potentially debug any problems that arose. 

:::image type="content" source="media/convert-data/convert-data-with-azure-data-factory/monitor-pipeline-runs.png" alt-text="Screenshot of monitoring Azure Data Factory pipeline runs." lightbox="media/convert-data/convert-data-with-azure-data-factory/monitor-pipeline-runs.png":::

## Pipeline execution results

### Transformed FHIR R4 results

Successful pipeline executions result in the transformed FHIR R4 bundles as JSON files in the configured destination ADLS Gen2 storage account and container.

:::image type="content" source="media/convert-data/convert-data-with-azure-data-factory/transformed-fhir-results.png" alt-text="Screenshot of transformed FHIR results." lightbox="media/convert-data/convert-data-with-azure-data-factory/transformed-fhir-results.png":::

### Errors

Errors encountered during conversion, as part of the pipeline execution, result in error details captured as JSON file in the configured error destination ADLS Gen2 storage account and container. For information on how to troubleshoot `$convert-data`, see [Troubleshoot $convert-data](troubleshoot-convert-data.md).

:::image type="content" source="media/convert-data/convert-data-with-azure-data-factory/pipeline-errors.png" alt-text="Screenshot of Azure Data Factory errors." lightbox="media/convert-data/convert-data-with-azure-data-factory/pipeline-errors.png":::

## Next steps

In this article, you learned how to use Azure Data Factory templates to create a pipeline to transform HL7v2 data to FHIR R4 persisting the results within an Azure Data Lake Storage Gen2 account. You also learned how to configure a trigger to automate the pipeline execution based on incoming HL7v2 data to be transformed.

For an overview of `$convert-data`, see
 
> [!div class="nextstepaction"]
> [Overview of $convert-data](overview-of-convert-data.md)

To learn how to configure settings for `$convert-data` using the Azure portal, see
 
> [!div class="nextstepaction"]
> [Configure settings for $convert-data using the Azure portal](convert-data-with-azure-data-factory.md)

To learn how to troubleshoot `$convert-data`, see
 
> [!div class="nextstepaction"]
> [Troubleshoot $convert-data](troubleshoot-convert-data.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
