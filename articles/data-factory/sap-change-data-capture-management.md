---
title: SAP change data capture solution (Preview) - management
titleSuffix: Azure Data Factory
description: This article describes how to manage SAP change data capture (Preview) in Azure Data Factory.
author: ukchrist
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.date: 06/01/2022
ms.author: ulrichchrist
---

# Management of SAP change data capture (CDC) (Preview) in Azure Data Factory

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article describes how to manage SAP change data capture (Preview) in Azure Data Factory.

## Run SAP a data replication pipeline on a recurring schedule

To run an SAP data replication pipeline on a recurring schedule with a specified frequency, complete the following steps:

1.	Create a tumbling window trigger that runs SAP data replication pipeline frequently with the **Max concurrency** property set to _1_, see [Create a trigger that runs a pipeline on a tumbling window](how-to-create-tumbling-window-trigger.md?tabs=data-factory).

1.	After the tumbling window trigger is created, add a self-dependency on it, such that subsequent pipeline runs always waits until previous pipeline runs are successfully completed, see [Create a tumbling window trigger dependency](tumbling-window-trigger-dependency.md).

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-tumbling-window-trigger.png" alt-text="Screenshot of the Edit trigger window with values highlighted to configure the tumbling window trigger.":::

## Recover a failed SAP data replication pipeline run

To recover a failed SAP data replication pipeline run, complete the following steps:

1.	If any SAP data replication pipeline run fails, the subsequent run scheduled by tumbling window trigger will be suspended, waiting on dependency.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-trigger-status.png" alt-text="Screenshot of the trigger status window with an SAP tumbling window trigger in the failed state.":::

1.	In that case, you can fix the issues causing pipeline run failure, switch the **Extraction mode** property of the copy activity to _Recovery_, and manually run SAP data replication pipeline in this mode.

1.	If the recovery run is successfully completed, switch back the **Extraction mode** property of the copy activity to _Delta_, and select the **Rerun** button next to the failed run of tumbling window trigger.

## Monitor data extractions on SAP systems

To monitor data extractions on SAP systems, complete the following steps:

1.	Using SAP Logon Tool on your SAP source system, run ODQMON transaction code.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-logon-tool.png" alt-text="Screenshot of the SAP Logon Tool.":::

1.	Enter the value for the **Subscriber name** property of your SAP ODP linked service in the **Subscriber** input field and select _All_ in the **Request Selection** dropdown menu to show all data extractions using that linked service.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-monitor-delta-queues.png" alt-text="Screenshot of the SAP ODQMON tool with all data extractions for a particular subscriber.":::

1.	You can now see all registered subscriber processes in ODQ representing data extractions from ADF copy activities that use your SAP ODP linked service.  On each ODQ subscription, you can drill down to see individual full/delta extractions.  On each extraction, you can drill down to see individual data packages that were consumed.

1.	When ADF copy activities that extract SAP data are no longer needed, their ODQ subscriptions should be deleted, so SAP systems can stop tracking their subscription states and remove the unconsumed data packages from ODQ.  To do so, select the unneeded ODQ subscriptions and delete them.

    :::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-delete-queue-subscriptions.png" alt-text="Screenshot of the SAP ODQMON tool with the delete button highlighted for a particular queue subscription.":::

## Troubleshooting delta change

The Azure Data Factory ODP connector reads delta changes from the ODP framework, which itself provides them in tables called Operational Delta Queues (ODQs). 

In situations where the data movement works technically (that is, copy activities complete without errors), but doesn't appear to deliver the data correctly (for example, no data at all, or maybe just a subset of the expected data), you should first investigate if the number of records provided on the SAP side match the number of rows transferred by ADF. If so, the issue isn't related to ADF, but probably comes from incorrect or missing configuration on SAP side. 

### Troubleshooting in SAP using ODQMON 

To analyze what data the SAP system has provided for your scenario, start transaction ODQMON in your SAP backend system. If you're using the SLT scenario, with a standalone SLT server, start the transaction there. 

To find the Operational Delta Queue(s) corresponding to your copy activities or copy activity runs, use the filter options (blurred out below). In the field “Queue” you can use wildcards to narrow down the search, for example, by table name *EKKO*, etc. 

Selecting the check box “Calculate Data Volume” provides details about the number of rows and data volume (in bytes) contained in the ODQs. 

:::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-odqmon-troubleshooting-1.png" alt-text="Screenshot of the SAP ODQMON tool with delta queues displayed."::: 

Double clicking on the queue will bring you to the subscriptions of this ODQ. Since there can be multiple subscribers to the same ODQ, check for the subscriber name (which you entered in the ADF linked service) and pick the subscription whose timestamp best fits your copy activity run. (Note that for delta subscriptions, the first run of the copy activity will be recorded on SAP side for the subscription). 

:::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-odqmon-troubleshooting-2.png" alt-text="Screenshot of the SAP ODQMON tool with delta queue subscriptions displayed.":::

Drilling down into the subscription, you find a list of “requests”, corresponding to copy activity runs in ADF. In the screenshot below, you see the result of four copy activity runs.  

:::image type="content" source="media/sap-change-data-capture-solution/sap-cdc-odqmon-troubleshooting-3.png" alt-text="Screenshot of the SAP ODQMON tool with delta queue requests displayed."::: 

Based on the timestamp in the first row, find the line corresponding to the copy activity run you want to analyze. If the number of rows shown in this screen equals the number of rows read by the copy activity, you've verified that ADF has read and transferred the data as provided by the SAP system. 

In this case, we recommend consulting with the team responsible for your SAP system. 

## Current limitations

The following are the current limitations of SAP CDC solution in ADF:

- Resetting and deleting ODQ subscriptions from ADF aren't supported for now.
- SAP hierarchies aren't supported for now.


