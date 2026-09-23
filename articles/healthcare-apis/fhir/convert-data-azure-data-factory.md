---
title: Transform HL7v2 data to FHIR R4 with $convert-data in the FHIR service
description: Transform HL7v2 health data to FHIR R4 with Azure Data Factory. Get step-by-step guidance on pipeline creation, and storing converted bundles in ADLS Gen2 storage.
author: EXPEkesheth
ms.service: azure-health-data-services
ms.subservice: fhir
ms.topic: how-to
ms.date: 08/14/2026
ms.author: kesheth
ms.custom: sfi-image-nochange
ai-usage: ai-assisted
---

# Transform HL7v2 data to FHIR R4 with $convert-data in the FHIR service

This article explains how to transform HL7v2 data to FHIR R4 using [Azure Data Factory (ADF)](../../data-factory/introduction.md) with the `$convert-data` operation. You can persist the transformed results in [Azure Data Lake Storage (ADLS) Gen2](../../storage/blobs/data-lake-storage-introduction.md) within an [Azure storage account](../../storage/common/storage-account-overview.md).

## Prerequisites

Before you begin, complete the following steps.

1. Deploy an instance of the [FHIR service](fhir-portal-quickstart.md). Use the FHIR service to invoke the [`$convert-data`](convert-data-overview.md) operation.

1. Create storage accounts with [Azure Data Lake Storage Gen2 (ADLS Gen2) capabilities](../../storage/blobs/create-data-lake-storage-account.md) by enabling a hierarchical namespace and container to store the data to read from and write to.

   You can create and use one or separate ADLS Gen2 accounts and containers to:

   - Store the HL7v2 data to transform (for example: the source account and container from which the pipeline reads the data to transform).
   - Store the transformed FHIR R4 bundles (for example: the destination account and container to which the pipeline writes the transformed result).
   - Store the errors encountered during the transformation (for example: the destination account and container to which the pipeline writes execution errors).

1. Create an instance of [Azure Data Factory (ADF)](../../data-factory/quickstart-create-data-factory.md), which serves to orchestrate business logic. Ensure that a [system-assigned managed identity](../../data-factory/data-factory-service-identity.md) is enabled. 
1. Add the following [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md) assignments to the ADF system-assigned managed identity:
   * **FHIR Data Converter** role to [grant permission to the FHIR service](../../healthcare-apis/configure-azure-rbac.md#assign-roles-for-the-fhir-and-dicom-services).
   * **Storage Blob Data Contributor** role to [grant permission to the ADLS Gen2 account](../../storage/blobs/assign-azure-role-data-access.md?tabs=portal).

1. By default, the ADF pipeline in this scenario uses the [predefined templates provided by Microsoft](convert-data-configuration.md#default-templates) for conversion. If your use case requires customized templates, set up your [Azure Container Registry instance to host your own templates](convert-data-configuration.md#host-your-own-templates) for the conversion operation. 

## Configure an Azure Data Factory pipeline  

In this example, use an [ADF pipeline](../../data-factory/concepts-pipelines-activities.md?tabs=data-factory) to transform HL7v2 data and persist a transformed FHIR R4 bundle in a JSON file within the configured destination ADLS Gen2 account and container.  
 
From the Azure portal, open your Azure Data Factory instance and select **Launch Studio** to begin. 

   :::image type="content" source="media/convert-data/convert-data-with-azure-data-factory/select-launch-studio.png" alt-text="Screenshot of Azure Data Factory in the Azure portal after selecting Launch Studio." lightbox="media/convert-data/convert-data-with-azure-data-factory/select-launch-studio.png":::

## Create a pipeline

Azure Data Factory pipelines are a collection of activities that perform a task. This section details the creation of a pipeline that performs the task of transforming HL7v2 data to FHIR R4 bundles. You can run a pipeline manually or regularly based on defined triggers. 

1. Select **Author** from the navigation menu. In the **Factory Resources** pane, select the **+** to add a new resource. Select **Pipeline** and then **Template gallery** from the menu.

   :::image type="content" source="media/convert-data/convert-data-with-azure-data-factory/open-template-gallery.png" alt-text="Screenshot of the Template gallery option in Azure Data Factory when creating a pipeline." lightbox="media/convert-data/convert-data-with-azure-data-factory/open-template-gallery.png"::: 

1. In the Template gallery, search for **HL7v2**. Select the **Transform HL7v2 health data to FHIR R4 format and write to ADLS Gen2** tile and then select **Continue**. 

   :::image type="content" source="media/convert-data/convert-data-with-azure-data-factory/search-for-template.png" alt-text="Screenshot of searching for the HL7v2 to FHIR R4 template in the Template gallery." lightbox="media/convert-data/convert-data-with-azure-data-factory/search-for-template.png":::

1. Select **Use this template** to create the new pipeline.

   :::image type="content" source="media/convert-data/convert-data-with-azure-data-factory/use-this-template.png" alt-text="Screenshot of the template preview for HL7v2 to FHIR R4 conversion before selection." lightbox="media/convert-data/convert-data-with-azure-data-factory/use-this-template.png"::: 
  
   Azure Data Factory imports the template, which is composed of an end-to-end main pipeline and a set of individual pipelines and activities. The main end-to-end pipeline for this scenario is named **Transform HL7v2 health data to FHIR R4 format and write to ADLS Gen2** and you can access it by selecting **Pipelines**. The main pipeline invokes the other individual pipelines and activities under the subcategories of **Extract**, **Load**, and **Transform**.

   :::image type="content" source="media/convert-data/convert-data-with-azure-data-factory/overview-pipeline-template.png" alt-text="Screenshot of the imported HL7v2 to FHIR R4 Azure Data Factory pipeline template." lightbox="media/convert-data/convert-data-with-azure-data-factory/overview-pipeline-template.png"::: 

   If needed, you can modify the pipelines and activities to fit your scenario. For example, if you don't need to persist results in a destination ADLS Gen2 storage account, remove the **Write converted result to ADLS Gen2** pipeline.

1. Select the **Parameters** tab and provide values based on your configuration. Some of the values are based on the resources set up as part of the [prerequisites](#prerequisites).

   :::image type="content" source="media/convert-data/convert-data-with-azure-data-factory/input-pipeline-parameters.png" alt-text="Screenshot of the pipeline Parameters tab with values for HL7v2 to FHIR R4 conversion." lightbox="media/convert-data/convert-data-with-azure-data-factory/input-pipeline-parameters.png"::: 

   | Parameter | Description |
   | --- | --- |
   | **fhirService** | Provide the URL of the FHIR service to target for the `$convert-data` operation. For example: `https://**myservice-fhir**.fhir.azurehealthcareapis.com/` |
   | **acrServer** | Provide the name of the ACR server to pull the Liquid templates to use for conversion. The default option is set to `microsofthealth`, which contains the predefined template collection published by Microsoft. To use your own template collection, replace this value with your ACR instance that hosts your templates and is registered to your FHIR service. |
   | **templateReference** | Provide the reference to the image within the ACR that contains the Liquid templates to use for conversion. The default option is set to `hl7v2templates:default` to pull the latest published Liquid templates for HL7v2 conversion by Microsoft. To use your own template collection, replace this value with the reference to the image within your ACR that hosts your templates and is registered to your FHIR service. |
   | **inputStorageAccount** | The primary endpoint of the ADLS Gen2 storage account containing the input HL7v2 data to transform. For example: `https://**mystorage**.blob.core.windows.net`. |
   | **inputStorageFolder** | The configured container and folder path. For example: `**mycontainer**/**myHL7v2folder**`. |
   | **inputStorageFile** | The name of the file within the configured container that contains the HL7v2 data to transform. For example: `**myHL7v2file**.hl7`. |
   | **outputStorageAccount** | The primary endpoint of the ADLS Gen2 storage account to store the transformed FHIR bundle. For example: `https://**mystorage**.blob.core.windows.net`. |
   | **outputStorageFolder** | The container and folder path within the configured **outputStorageAccount** to which the transformed FHIR bundle JSON files are written to. |
   | **rootTemplate** | The root template to use while transforming the provided HL7v2 data. For example: ADT_A01, ADT_A02, ADT_A03, ADT_A04, ADT_A05, ADT_A08, ADT_A11, ADT_A13, ADT_A14, ADT_A15, ADT_A16, ADT_A25, ADT_A26, ADT_A27, ADT_A28, ADT_A29, ADT_A31, ADT_A47, ADT_A60, OML_O21, ORU_R01, ORM_O01, VXU_V04, SIU_S12, SIU_S13, SIU_S14, SIU_S15, SIU_S16, SIU_S17, SIU_S26, MDM_T01, MDM_T02. |
   | **errorStorageFolder** | The container and folder path within the configured **outputStorageAccount** to which the errors encountered during execution are written. For example: `**mycontainer**/**myerrorfolder**`. |

    > [!NOTE]
    > You can leave the **inputStorageFolder** and **outputStorageFolder** parameters blank. You can dynamically configure them when setting up storage account triggers for this pipeline execution (refer to the section titled [Executing a pipeline](#execute-a-pipeline)).

1. Configure more pipeline settings under the **Settings** tab based on your requirements.

   :::image type="content" source="media/convert-data/convert-data-with-azure-data-factory/settings-tab-overview.png" alt-text="Screenshot of the pipeline Settings tab in Azure Data Factory." lightbox="media/convert-data/convert-data-with-azure-data-factory/settings-tab-overview.png":::

1. To debug your pipeline setup, select **Debug** to optionally run a debug session. 

   :::image type="content" source="media/convert-data/convert-data-with-azure-data-factory/debug-pipeline.png" alt-text="Screenshot of the Debug option used to test the Azure Data Factory pipeline." lightbox="media/convert-data/convert-data-with-azure-data-factory/debug-pipeline.png"::: 

1. Verify your pipeline run parameters and select **OK**. 

   :::image type="content" source="media/convert-data/convert-data-with-azure-data-factory/verify-pipeline-parameters.png" alt-text="Screenshot of the pipeline run parameter confirmation dialog in Azure Data Factory." lightbox="media/convert-data/convert-data-with-azure-data-factory/verify-pipeline-parameters.png"::: 

1. Monitor the debug execution of the pipeline under the **Output** tab. 

   :::image type="content" source="media/convert-data/convert-data-with-azure-data-factory/output-pipeline-status.png" alt-text="Screenshot of pipeline debug execution status in the Output tab." lightbox="media/convert-data/convert-data-with-azure-data-factory/output-pipeline-status.png"::: 

1. When you're satisfied with your pipeline setup, select **Publish all**.

   :::image type="content" source="media/convert-data/convert-data-with-azure-data-factory/select-publish-all.png" alt-text="Screenshot of the Publish all command in Azure Data Factory Studio." lightbox="media/convert-data/convert-data-with-azure-data-factory/select-publish-all.png"::: 

1. Select **Publish** to save your pipeline in your own ADF instance.

    :::image type="content" source="media/convert-data/convert-data-with-azure-data-factory/select-publish.png" alt-text="Screenshot of the Publish confirmation dialog in Azure Data Factory." lightbox="media/convert-data/convert-data-with-azure-data-factory/select-publish.png"::: 

## Execute a pipeline

You can run a pipeline manually or use a trigger. Different types of triggers can help automate your pipeline execution. For example:

* **Manual trigger**
* **Schedule trigger**
* **Tumbling window trigger**
* **Event-based trigger**

For more information about the different trigger types and how to configure them, see [Pipeline execution and triggers in Azure Data Factory or Azure Synapse Analytics](../../data-factory/concepts-pipeline-execution-triggers.md).

By setting triggers, you can simulate batch transformation of HL7v2 data. The pipeline executes automatically based on the configured trigger parameters without requiring individual invocation of the `$convert-data` operation for each input message.

> [!IMPORTANT]
> In a scenario with batch processing of HL7v2 messages, this template doesn't take sequencing into account. Post processing is needed if sequencing is a requirement.

## Create a new storage event trigger

In the following example, a storage event trigger is used. The storage event trigger automatically triggers the pipeline whenever a new HL7v2 data blob file is uploaded for processing to the ADLS Gen2 storage account.

To configure the pipeline to automatically run whenever a new HL7v2 blob file in the source ADLS Gen2 storage account is available to transform, follow these steps.

1. Select **Author** from the navigation menu. Select the pipeline configured in the previous section and select **Add trigger** and **New/Edit** from the menu bar. 
   
   :::image type="content" source="media/convert-data/convert-data-with-azure-data-factory/select-add-trigger.png" alt-text="Screenshot of the Add trigger and New/Edit options in Azure Data Factory." lightbox="media/convert-data/convert-data-with-azure-data-factory/select-add-trigger.png":::

1.	In the **Add triggers** pane, select the **Choose trigger** dropdown, and then select **New**. 
1.	Enter a **Name** and **Description** for the trigger.
1.	Select **Storage events** as the **Type**.
1.	Configure the storage account details containing the source HL7v2 data to transform (for example: ADLS Gen2 storage account name, container name, blob path, and other details) to reference for the trigger.
1.	Select **Blob created** as the **Event**.

   :::image type="content" source="media/convert-data/convert-data-with-azure-data-factory/create-new-storage-event-trigger.png" alt-text="Screenshot of creating new Storage events trigger for an ADLS Gen2 blob." lightbox="media/convert-data/convert-data-with-azure-data-factory/create-new-storage-event-trigger.png":::

1.	Select **Continue** to see the **Data preview** for the configured settings.
1.	Select **Continue** again at **Data preview**  to continue configuring the trigger run parameters. 

## Configure trigger run parameters

Triggers not only define when to run a pipeline, they also include [parameters](../../data-factory/how-to-use-trigger-parameterization.md) that they pass to the pipeline execution. You can configure pipeline parameters dynamically by using the trigger run parameters.

The storage event trigger captures the folder path and file name of the blob into the properties `@triggerBody().folderPath` and `@triggerBody().fileName`. To use the values of these properties in a pipeline, you must map the properties to pipeline parameters. After you map the properties to parameters, you can access the values captured by the trigger through the `@pipeline().parameters.parameterName` expression throughout the pipeline. For more information, see [Reference trigger metadata in pipeline runs](../../data-factory/how-to-use-trigger-parameterization.md).

For the **Transform HL7v2 health data to FHIR R4 format and write to ADLS Gen2 template**, use the storage event trigger properties to configure certain pipeline parameters.

> [!NOTE] 
> If you don't supply a value during configuration, the previously configured default value is used for each parameter. 

1. In the **New trigger** pane, within the **Trigger Run Parameters** options, use the following values:
   * For **inputStorageFolder**, use `@triggerBody().folderPath`. This parameter provides the runtime value for this parameter based on the folder path associated with the event triggered (for example: folder path of the new HL7v2 blob created or updated in the storage account configured in the trigger).
   * For **inputStorageFile**, use `@triggerBody().fileName`. This parameter provides the runtime value for this parameter based on the file associated with the event triggered (for example: file name of the new HL7v2 blob created or updated in the storage account configured in the trigger).
   * For **rootTemplate**, specify the name of the template to use for the pipeline executions associated with this trigger (for example: `ADT_A01`).

1. Select **OK** to create the new trigger. Be sure to select **Publish** on the menu bar to begin your trigger running on the defined schedule.

   :::image type="content" source="media/convert-data/convert-data-with-azure-data-factory/trigger-run-parameters.png" alt-text="Screenshot of trigger run parameters mapped to pipeline parameters." lightbox="media/convert-data/convert-data-with-azure-data-factory/trigger-run-parameters.png":::

After you publish the trigger, you can trigger it manually by using the **Trigger now** option. If the start time is set for a value in the past, the pipeline starts immediately. 

## Monitor pipeline runs

Use the **Monitor** tab to view triggered runs and their associated pipeline runs. You can see when each pipeline ran, how long it took, and troubleshoot issues. 

:::image type="content" source="media/convert-data/convert-data-with-azure-data-factory/monitor-pipeline-runs.png" alt-text="Screenshot of the Monitor tab showing Azure Data Factory pipeline runs." lightbox="media/convert-data/convert-data-with-azure-data-factory/monitor-pipeline-runs.png":::

## Pipeline execution results

### Transformed FHIR R4 results

When a pipeline runs successfully, it creates transformed FHIR R4 bundles as JSON files in the destination ADLS Gen2 storage account and container that you configured.

:::image type="content" source="media/convert-data/convert-data-with-azure-data-factory/transformed-fhir-results.png" alt-text="Screenshot of transformed FHIR R4 bundle JSON output in ADLS Gen2 storage." lightbox="media/convert-data/convert-data-with-azure-data-factory/transformed-fhir-results.png":::

### Errors

If the pipeline encounters errors during conversion, it captures the error details as a JSON file in the error destination ADLS Gen2 storage account and container that you configured. For information on how to troubleshoot `$convert-data`, see [Troubleshoot $convert-data](convert-data-troubleshoot.md).

:::image type="content" source="media/convert-data/convert-data-with-azure-data-factory/pipeline-errors.png" alt-text="Screenshot of JSON error output captured from pipeline execution failures." lightbox="media/convert-data/convert-data-with-azure-data-factory/pipeline-errors.png":::

## Next steps

[Configure settings for $convert-data](convert-data-azure-data-factory.md)

[Troubleshoot $convert-data](convert-data-troubleshoot.md)

[!INCLUDE [FHIR trademark statement](../includes/healthcare-apis-fhir-trademark.md)]
