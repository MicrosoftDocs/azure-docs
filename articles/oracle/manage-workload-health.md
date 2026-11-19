---
title: Manage and customize health
titleSuffix: Azure Workload Center for Oracle
description: Learn how to change signal thresholds, add signals, and customize the health model of an Oracle workload.
author: teja-san
ms.author: tsankranthi
ms.service: oracle-on-azure
ms.collection: linux
ms.topic: how-to
ms.date: 11/06/2026
ai-usage: ai-assisted
---
# Manage and customize health

The health model includes health and signal definitions for Oracle workloads. You can change these definitions, such as setting a threshold that fits your system, adding a signal, or setting up alerts.

## Open the entity editor

To change one entity, open **Workload health**, select the entity, and then select **Edit entity**. The **Entity editor** opens with the **General**, **Signals**, and **Alerts** tabs.

To work with the whole health model, use the designer:

1.  Open the *Workload Virtual Instance (WVI)* and select **Workload health**.

2.  Select **Manage Health model**. The Azure Monitor health model resource opens.

3.  Under **Configuration**, select **Designer**.

4.  Select an entity, and then select **Edit**. The **Entity editor** opens. You can also open it from **Configuration** > **Entities**.

## Change the threshold of a signal

1.  In the **Entity editor**, go to the **Signals** tab.

2.  Select the signal that you want to change.

3.  Choose whether to change the signal definition for all entities that use it, or only for this entity.

4.  Update the **Degraded** and **Unhealthy** thresholds.

5.  Select **Save** in the signal pane, and then select **Save** on the **Signals** tab.

## Add a signal

You can add signals from Azure platform metrics, a Log Analytics workspace, or an Azure Monitor workspace. For example, you can add a Log Analytics query that returns a database metric that you already collect.

1.  In the **Entity editor**, go to the **Signals** tab.

2.  Under **Data sources**, add the Log Analytics workspace or Azure Monitor workspace if you didn't configure one. The managed identity needs **Monitoring Reader** on the workspace.

3.  Select **Add metric signal**, **Add log query signal**, or **Add Prometheus signal**.

:::image type="content" source="media/manage-workload-health/entity-editor-signals.png" alt-text="Screenshot that shows the Signals tab of the Entity editor with the data sources and the options to add a signal." lightbox="media/manage-workload-health/entity-editor-signals.png":::

4.  Define the metric or query, and set the **Degraded** and **Unhealthy** thresholds.

5.  Select **Save**.

To set up alerts and all other options, see [Configure an Azure Monitor health model using the designer](/azure/azure-monitor/health-models/designer).

## Change detection

Azure Workload Center for Oracle keeps the health model in line with the WVI. Change detection runs every five minutes.

| **Change**                                                         | **What happens**                                                                                                                 | **Example**                                                                                             |
|--------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|
| You add or remove resources or components in the WVI               | The health model adds or removes the matching entities. A new resource gets the existing signal definition for its resource type | You add a VM to the Application Services component. The VM shows in Workload health with the VM signals |
| You change a health or signal definition                           | Your change stays in place                                                                                                       | You set the CPU threshold of a VM to 90%. It stays at 90%                                               |
| You delete an entity that Azure Workload Center for Oracle created | The entity comes back in the next change detection run                                                                           | You delete the Database Services entity. It shows again within five minutes                                |
| You add or delete other entities                                   | Your change stays in place                                                                                                       | You add a generic entity for a business process. It stays                                               |
