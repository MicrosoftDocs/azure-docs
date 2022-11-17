---
title: Manage the SAP CDC process
titleSuffix: Azure Data Factory
description: Learn how to manage your SAP change data capture (CDC) process in Azure Data Factory.
author: ukchrist
ms.service: data-factory
ms.subservice: data-movement
ms.custom: ignite-2022
ms.topic: conceptual
ms.date: 08/18/2022
ms.author: ulrichchrist
---

# Manage the SAP CDC process

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

After you create a pipeline and mapping data flow in Azure Data Factory using the SAP CDC connector, it's important to manage the ETL process appropriately.

## Run an SAP data replication pipeline on a recurring schedule

To run an SAP data replication pipeline on a recurring schedule with a specified frequency:

1. Create a tumbling window trigger that runs the SAP data replication pipeline frequently. Set **Max concurrency** to **1**.

    For more information, see [Create a trigger that runs a pipeline on a tumbling window](how-to-create-tumbling-window-trigger.md?tabs=data-factory).

1. Add a self-dependency on the tumbling window trigger so that a subsequent pipeline run always waits until earlier pipeline runs are successfully completed.

   For more information, see [Create a tumbling window trigger dependency](tumbling-window-trigger-dependency.md).

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-tumbling-window-trigger.png" alt-text="Screenshot of the Edit trigger window with values highlighted to configure the tumbling window trigger.":::

## Monitor data extractions on SAP systems

To monitor data extractions on SAP systems:

1. In the SAP Logon tool on your SAP source system, run the ODQMON transaction code.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-logon-tool.png" alt-text="Screenshot of the SAP Logon Tool.":::

1. In **Subscriber**, enter the value for the **Subscriber name** property of your SAP CDC linked service. In the **Request Selection** dropdown, select **All** to show all data extractions that use the linked service.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-monitor-delta-queues.png" alt-text="Screenshot of the SAP ODQMON tool with all data extractions for a specific subscriber.":::

   You can see all registered subscriber processes in the operational delta queue (ODQ). Subscriber processes represent data extractions from Azure Data Factory mapping data flow that use your SAP CDC linked service. For each ODQ subscription, you can look at details to see all full and delta extractions. For each extraction, you can see individual data packages that were consumed.

1. When Data Factory mapping data flows that extract SAP data are no longer needed, you should delete their ODQ subscriptions. When you delete ODQ subscriptions, SAP systems can stop tracking their subscription states and remove the unconsumed data packages from the ODQ. To delete an ODQ subscription, select the subscription and select the Delete icon.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-delete-queue-subscriptions.png" alt-text="Screenshot of the SAP ODQMON tool with the delete button highlighted for a specific queue subscription.":::

## Troubleshoot delta changes

The SAP CDC connector in Data Factory reads delta changes from the SAP ODP framework. The deltas are recorded in ODQ tables.

In scenarios in which data movement works (mapping data flows finish without errors), but data isn't delivered correctly (no data at all, or maybe just a subset of the expected data), you should first check in ODQMON whether the number of records provided on the SAP side match the number of rows transferred by Data Factory. If they match, the issue isn't related to Data Factory, but probably comes from an incorrect or missing configuration on the SAP side.

### Troubleshoot in SAP by using ODQMON

To analyze what data the SAP system has provided for your scenario, start transaction ODQMON in your SAP back-end system. If you're using SAP Landscape Transformation Replication Server (SLT) with a standalone server, start the transaction there.

To find the ODQs that correspond to your mapping data flows, use the filter options. In **Queue**, you can use wildcards to narrow the search. For example, you can search by the table name **EKKO**.

Select the **Calculate Data Volume** checkbox to see details about the number of rows and data volume (in bytes) contained in the ODQs.

:::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-odqmon-troubleshoot-queues.png" alt-text="Screenshot of the SAP ODQMON tool, with delta queues shown.":::

To view the ODQ subscriptions, double-click the queue. An ODQ can have multiple subscribers, so check for the subscriber name that you entered in the Data Factory linked service. Choose the subscription that has a timestamp that most closely matches the time your mapping data flow ran. For delta subscriptions, the first run of the mapping data flow for the subscription is recorded on the SAP side.

:::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-odqmon-troubleshoot-subscriptions.png" alt-text="Screenshot of the SAP ODQMON tool, with delta queue subscriptions shown.":::

In the subscription, a list of requests corresponds to mapping data flow runs in Data Factory. In the following figure, you see the result of four mapping data flow runs:

:::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-odqmon-troubleshoot-requests.png" alt-text="Screenshot of the SAP ODQMON tool with delta queue requests shown.":::

Based on the timestamp in the first row, find the line that corresponds to the mapping data flow run you want to analyze. If the number of rows shown equals the number of rows read by the mapping data flow, you've verified that Data Factory has read and transferred the data as provided by the SAP system. In this scenario, we recommend that you consult with the team that's responsible for your SAP system.

## Current limitations

Here are current limitations of the SAP CDC connector in Data Factory:

- You can't reset or delete ODQ subscriptions in Data Factory (use ODQMON for this).
- You can't use SAP hierarchies with the solution.

## Next steps

Learn more about [SAP connectors](industry-sap-connectors.md).
