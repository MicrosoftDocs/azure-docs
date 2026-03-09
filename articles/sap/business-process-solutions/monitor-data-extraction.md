---
title: Monitoring data extraction in Azure Data Factory
titleSuffix: Business Process Solutions
description: Learn how to monitor data extraction in Azure Data Factory in Business Process Solutions.
author: mimansasingh
ms.service: sap-on-azure
ms.subservice:
ms.topic: how-to
ms.date: 02/23/2026
ms.author: mimansasingh
---

# Monitoring data extraction in Azure Data Factory

When configuring the data extraction, using Azure Data Factory the solution automatically deploys required Azure services with a set of prebuilt templates designed to execute the extraction process. This document explains how the data extraction process works, how to monitor it, and how to troubleshoot issues when they occur.

## Azure Data Factory pipelines for data extraction

The Orchestration Master pipeline initiates the data extraction process, which consists of four key pipelines. Firstly, the **Get Field Metadata** pipeline connects to each source system and reads field metadata for enabled CDS Views. This step is essential for data type mapping, which occurs during data extraction.

Once the field metadata is processed, the **System Lookup** pipeline (p_s2s_system_lookup) retrieves connection information and, for each source system, triggers the data extraction process. This process occurs in two main steps:

1. Extracting data from fact tables (p_s2s_fact_extract)
2. Extracting data from dimensions (p_s2s_dimension_extract)

These two jobs run sequentially, with the dimension extraction pipeline dependent on the successful completion of the fact extraction pipeline. If there's an issue with extracting facts, the subsequent dimension processing doesn't start.

:::image type="content" source="./media/monitoring-data-extraction/data-extraction-steps.png" alt-text="Screenshot showing different steps to extract data." lightbox="./media/monitoring-data-extraction/data-extraction-steps.png":::

Each pipeline executes a series of actions. If any step encounters an error, the entire pipeline registers a failure. This failure is reported back to the initiating pipelines, including System Lookup and Orchestration Master. Additionally, a failure in one pipeline prevents subsequent pipelines from starting. For example, a problem in the fact extraction step blocks the dimension extraction process.

Below is an example of the monitoring view when a data processing step fails:

:::image type="content" source="./media/monitoring-data-extraction/data-processing-failure.png" alt-text="Screenshot showing monitoring view if data processing fails." lightbox="./media/monitoring-data-extraction/data-processing-failure.png":::

Each pipeline automatically determines the required actions based on the CDS View metadata. The following steps outline the logic:

1. **df_ODP_WithDelta**: Initiates a data flow using the SAP CDC connector to extract data from the SAP system with delta processing. Applicable when the Context is set to ABAP_CDS and the Delta flag is True.
2. **df_ODP_NoDelta**: Similar to the previous step but without delta processing. Uses the **SAP CDC connector** to extract data from views when the Context is set to ABAP_CDS and the Delta flag is False.
3. **Copy SAP Table**: Uses the **SAP Table connector** to pull data from the SAP system and store it in the staging directory. Applicable when the Context is set to SAP Table.
4. **Convert to Delta**: Processes data extracted via the **SAP Table connector** and pushes it to the lakehouse. Applicable only if you process the initial extraction using the SAP Table connector.

Here's an example of the dimension extraction pipeline encountering some failed activities. Failures in specific actions can cascade back to the initiating actions, like pipeline failures. The For-Each loop iterates through all objects set for extraction, and the Select Connector action determines the appropriate processing steps based on the CDS View metadata. Generally, each issue will manifest as two failed actions.

:::image type="content" source="./media/monitoring-data-extraction/dim-pipeline-failure.png" alt-text="Screenshot showing dimension extraction pipeline failure." lightbox="./media/monitoring-data-extraction/dim-pipeline-failure.png":::

When an extraction process fails, the first step is to review the error details. The nature of the error guides the corrective actions required.

## Common issues

There are several reasons why a data extraction job in Azure Data Factory might fail. Your primary reference should always be **SAP Note 2930269 – ABAP CDC: Common issues, questions, troubleshooting and components**. This note provides a comprehensive list of troubleshooting steps for common problems, along with recommended corrections for different SAP system releases. Always consult this note as your frontline of support when encountering issues.

Below we provide a list of common problems related to the object configuration in Business Process Solutions.

### Error message: Source ODPName doesn't support deltas

This error indicates that the specified CDS View doesn't support delta extraction. To resolve this issue, update the table configuration in dataset configuration in the Business Process Solutions. Edit the failed table and set the Delta field to False. Save the changes and rerun the extraction process to ensure successful completion. The error message provides the ODP Name rather than the actual CDS View name.

### Error message: Source ODPName not found, not released or not authorized

There are three possible root causes for this issue.

- **Verify the view is available in your SAP release** - To check whether the CDS View is available, you need to examine the view annotations. Open transaction SE16n and access the table DDHEADANNO, which stores all CDS View annotations. Enter the CDS View name in the STRUCOBJN field. Keep in mind, the error message shows the SQL View Name (ODPName) and not the CDS View Name. If the system returns list of annotations, the CDS View exists and you can proceed to step (b) for troubleshooting. If the CDS View doesn't exists in your system remove the failed table from the dataset to resolve the issue.

   :::image type="content" source="./media/monitoring-data-extraction/view-sap.png" alt-text="Screenshot showing view is available in SAP release." lightbox="./media/monitoring-data-extraction/view-sap.png":::

- **Verify if the view is extractable** - Not all views defined in the system support extraction using the SAP CDC connector. To determine if a view can be extracted, review the list of annotations in the table DDHEADANNO and check for the annotation ANALYTICS.DATAEXTRACTION.ENABLED. This annotation confirms that the view is extractable using the ODP framework and the SAP CDC connector. If the required annotation is missing, you should switch the connector used for data extraction to SAP Table. This can be achieved by changing the context of the CDS View to SAP Table.

   :::image type="content" source="./media/monitoring-data-extraction/view-sap-extractable.png" alt-text="Screenshot showing if view is extractable." lightbox="./media/monitoring-data-extraction/view-sap-extractable.png":::

- **Check if you have the right authorizations** - Another common reason for extraction failures is missing authorizations in the source SAP system. Ensure that all required data sources are included in the SAP profile assigned to the user and pay special attention to the authorization objects S_RS_CDS_X and S_DHCDCCDS. To troubleshoot authorization issues, run the extraction using the test report RODPS_REPL_TEST with the same user defined in Business Process Solutions. After the test, execute transaction SU53 to review any missing authorizations. This process helps identify gaps that might be causing the extraction to fail.
