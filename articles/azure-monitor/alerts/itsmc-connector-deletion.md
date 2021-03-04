---
title: Deletion of ITSM connector and the action that are associated to it
description: This article provides an explanation of how to delete ITSM connector and the action groups that are associated to it.
ms.topic: conceptual
author: nolavime
ms.author: v-jysur
ms.date: 12/29/2020
ms.custom: references_regions

---

# Deletion of unused ITSM connectors

The process of deletion of unused connector contain 2 phases:

1. Deletion of the associated actions: all the actions that are associated with the ITSM connector should be deleted. This should be done in order not to have actions without connector that might cause errors in your subscription.

2. Deletion of the unused ITSM connector.

## Deletion of the associated actions

1. In order to find the action group you should go into “Monitor”
    ![Screenshot of monitor selection.](media/itsmc-connector-deletion/itsmc-monitor-selection.png)

2. Select “Alerts”
    ![Screenshot of alerts selection.](media/itsmc-connector-deletion/itsmc-alert-selection.png)
3. Select “Manage Actions”
    ![Screenshot of manage actions selection.](media/itsmc-connector-deletion/itsmc-actions-selection.png)
4. Select all the ITSM connectors that is connected to Cherwell
    ![Screenshot of ITSM connectors that is connected to Cherwell.](media/itsmc-connector-deletion/itsmc-actions-screen.png)
5. Delete the action group
    ![Screenshot of action group deletion.](media/itsmc-connector-deletion/itsmc-action-deletion.png)

## Deletion of the unused ITSM connector

1. You should search and select “ServiceDesk” LA in the top search bar
    ![Screenshot of search and select “ServiceDesk” LA.](media/itsmc-connector-deletion/itsmc-connector-selection.png)
2. Select the “ITSM Connections” and select the Cherwell connector
    ![Screenshot of Cherwell ITSM connectors.](media/itsmc-connector-deletion/itsmc-cherwell-connector.png)
3. Select “Delete”
    ![Screenshot of ITSM connector deletion.](media/itsmc-connector-deletion/itsmc-connector-deletion.png)

## Next steps

* [Troubleshooting problems in ITSM Connector](./itsmc-resync-servicenow.md)
