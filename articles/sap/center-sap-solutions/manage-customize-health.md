---
title: Manage and customize health - Azure Workload Center for SAP
description: Learn how to manage and customize health models, including signal definitions, thresholds, and alerts for your workload resources.
ms.date: 11/06/2026
ms.topic: how-to
ms.service: sap-on-azure
ms.subservice: center-sap-solutions
ms.author: vaidehikher
ms.reviewer: mattmcinnes
ai-usage: ai-assisted
---

# Manage and customize health in Azure Workload Center for SAP

The health model setup includes relevant health and signal definitions for infrastructure based on the workload context. However, you might need to customize the health or signal definitions, set up alerts, or make other changes to fit your requirements.

## To manage or customize the health model

1. Select **Manage Health model**. This option takes you to the health model resource that represents the health of the WVI.

1. Under **Configuration** in the health model resource menu, select **Designer** to customize the health or signal definitions.

   :::image type="content" source="media/manage-customize-health/health-model-designer-view.svg" alt-text="Screenshot of health model designer view." lightbox="media/manage-customize-health/health-model-designer-view.svg":::

1. In the **Designer** view, select **Edit** on an entity to open the **Entity editor**. In the editor, you can change general properties like the display name, customize signals, or set up alerts.

   :::image type="content" source="media/manage-customize-health/entity-editor-general-tab.png" alt-text="Screenshot of Entity editor panel showing General tab with Impact, Icon, and Tags settings." lightbox="media/manage-customize-health/entity-editor-general-tab.png":::

You can also open the **Entity editor** from **Entities** under **Configuration** in the resource menu.

Examples of customizations include:

## Modifying thresholds for Azure platform metrics for resources like Virtual Machines (VM)

Follow these steps to modify thresholds:

1. Open the **Entity editor** for the Azure VM whose threshold you want to customize.

1. Go to the **Signals** tab.

   :::image type="content" source="media/manage-customize-health/entity-editor-signals-tab.png" alt-text="Screenshot of Entity editor Signals tab showing data sources and list of metric signals with thresholds." lightbox="media/manage-customize-health/entity-editor-signals-tab.png":::

1. Select the signal you want to customize.

1. Update the signal definition if you want to make changes to all resources using the definition, or update the definition for just this resource. In either case, update the degraded or unhealthy thresholds according to your requirements.

   :::image type="content" source="media/manage-customize-health/edit-signal-cpu-percentage-dialog.png" alt-text="Screenshot of the Edit signal dialog for Percentage CPU." lightbox="media/manage-customize-health/edit-signal-cpu-percentage-dialog.png":::

1. Select **Save** in the **Edit signal** dialog to return to the entity editor.

1. Select **Save** in the **Entity editor** to save the entity's updated signal configuration.

## Add application metrics through Azure Monitor for SAP solution (AMS) in Log Analytics workspace

For example, you can add the HANA availability metric from AMS to the Database Instance workload component. Follow these steps:

1. Open the **Entity editor** for the Database Instance workload component where you want to customize the threshold.

1. Go to the **Signals** tab.

1. Select **Add Log Analytics signals**.

1. Select the Log Analytics workspace linked to your AMS instance.

1. Authenticate by using the managed identity. Ensure the managed identity has the **Monitoring Reader** permission on the workspace.

1. Select **Add signal**.

1. Add a display name (optional).

1. Select **Edit query** in the **Query text** section.

1. Switch to KQL mode if not selected already.

1. Paste the following query in the editor:

   ```kql

   let StartTime=now();

   let ts = toscalar(SapHana_SqlProbe_CL

   | where PROVIDER_INSTANCE_s == '<AMS provider name>'

   | top 1 by Time_Generated_t

   | project Time_Generated_t);

   SapHana_SqlProbe_CL

   | where PROVIDER_INSTANCE_s == '<AMS provider name>'

   | where Time_Generated_t == ts

   | extend TimeGenerated = Time_Generated_t

   | extend AggregateValue = iff((StartTime - TimeGenerated > 5min or SUCCESS_b == false), 0, 1)

   | summarize Availability = max(AggregateValue) by bin(TimeGenerated, 5m)

   | project Availability

   ```

1. Replace both `<AMS provider name>` placeholders with your AMS provider name.

1. Validate that the query runs successfully and returns the availability.

   :::image type="content" source="media/manage-customize-health/kql-query-availability-results.png" alt-text="Screenshot of KQL query results showing HANA availability." lightbox="media/manage-customize-health/kql-query-availability-results.png":::

1. Select **Done** to return from the query editor to the signal editor.

1. Remove the degraded threshold and update the unhealthy thresholds to `< 1`.

   :::image type="content" source="media/manage-customize-health/edit-signal.png" alt-text="Screenshot of the Edit signal dialog with a HANA availability query and thresholds." lightbox="media/manage-customize-health/edit-signal.png":::

1. Select **Save** in the **Edit signal** dialog to return to the entity editor.

1. Select **Save** in the **Entity editor** to save the entity's updated signal configuration.

The Database Instance now includes the HANA availability metric.

For more information about managing or customizing your health model, see [Configure an Azure Monitor health model using the designer (Preview) - Azure Monitor \| Microsoft Learn](/azure/azure-monitor/health-models/designer?tabs=azureresource).
