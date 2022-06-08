---
title: SAP change data capture solution (Preview) - management
titleSuffix: Azure Data Factory
description: This topic describes how to manage SAP change data capture (Preview) in Azure Data Factory.
author: swinarko
ms.service: data-factory
ms.subservice: data-movement
ms.topic: conceptual
ms.date: 06/01/2022
ms.author: sawinark
---

# Management of SAP change data capture (CDC) (Preview) in Azure Data Factory

This topic describes how to manage SAP change data capture (Preview) in Azure Data Factory.

## Run SAP a data replication pipeline on a recurring schedule

To run an SAP data replication pipelines on a recurring schedule with a specified frequency, complete the following steps:

1.	Create a tumbling window trigger that runs SAP data replication pipeline frequently with the **Max concurrency** property set to _1_, see [Create a trigger that runs a pipeline on a tumbling window](how-to-create-tumbling-window-trigger.md?tabs=data-factory).

1.	After the tumbling window trigger is created, add a self-dependency on it, such that subsequent pipeline runs always waits until previous pipeline runs are successfully completed, see [Create a tumbling window trigger dependency](tumbling-window-trigger-dependency.md).

    :::image type="content" source="media/sap-cdc-solution/sap-cdc-tumbling-window-trigger.png" alt-text="Shows a screenshot of the Edit trigger window with values highlighted to configure the tumbling window trigger.":::

## Recover a failed SAP data replication pipeline run

To recover a failed SAP data replication pipeline run, complete the following steps:

1.	If any SAP data replication pipeline run fails, the subsequent run scheduled by tumbling window trigger will be suspended, waiting on dependency.

    :::image type="content" source="media/sap-cdc-solution/sap-cdc-trigger-status.png" alt-text="Shows a screenshot of the trigger status window with an SAP tumbling window trigger in the failed state.":::

1.	In that case, you can fix the issues causing pipeline run failure, switch the **Extraction mode** property of the copy activity to _Recovery_, and manually run SAP data replication pipeline in this mode.

1.	If the recovery run is successfully completed, switch back the **Extraction mode** property of the copy activity to _Delta_, and select the **Rerun** button next to the failed run of tumbling window trigger.

## Monitor data extractions on SAP systems

To monitor data extractions on SAP systems, complete the following steps:

1.	Using SAP Logon Tool on your SAP source system, run ODQMON transaction code.

    :::image type="content" source="media/sap-cdc-solution/sap-cdc-logon-tool.png" alt-text="Shows a screenshot of the SAP Logon Tool.":::

1.	Enter the value for the **Subscriber name** property of your SAP CDC linked service in the **Subscriber** input field and select _All_ in the **Request Selection** dropdown menu to show all data extractions using that linked service.

    :::image type="content" source="media/sap-cdc-solution/sap-cdc-monitor-delta-queues.png" alt-text="Shows a screenshot of the SAP ODQMON tool with all data extractions for a particular subscriber.":::

1.	You can now see all registered subscriber processes in ODQ representing data extractions from ADF copy activities that use your SAP CDC linked service.  On each ODQ subscription, you can drill down to see individual full/delta extractions.  On each extraction, you can drill down to see individual data packages that were consumed.

1.	When ADF copy activities that extract SAP data are no longer needed, their ODQ subscriptions should be deleted, so SAP systems can stop tracking their subscription states and remove the unconsumed data packages from ODQ.  To do so, select the unneeded ODQ subscriptions and delete them.

    :::image type="content" source="media/sap-cdc-solution/sap-cdc-delete-queue-subscriptions.png" alt-text="Shows a screenshot of the SAP ODQMON tool with the delete button highlighted for a particular queue subscription.":::

## Current limitations/future improvements

These are the current limitations of SAP CDC solution in ADF that will be removed/improved in the near future:

1.	Resetting and deleting ODQ subscriptions from ADF are not supported for now.
1.	SAP hierarchies are not supported for now.