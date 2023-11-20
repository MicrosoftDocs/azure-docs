---
title: Edit and manage pipelines
description: Use the advanced features in the Digital Operations portal to edit pipelines and import and export pipelines.
author: dominicbetts
ms.author: dobett
# ms.subservice: data-processor
ms.topic: how-to
ms.custom:
  - ignite-2023
ms.date: 10/17/2023

#CustomerIntent: As an OT user, I want edit and manage my pipelines so that I have greater flexibility in advanced editing capabilities.
---

# Edit and manage pipelines

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

The Digital Operations portal provides a graphical user interface (GUI) for editing pipelines. To edit the JSON definition of a stage directly, you can use the **Advanced** tab. This feature gives you more flexibility and control over the pipeline configuration, especially if you need to manage complex configurations that might not be fully supported by the GUI such as for the [filter stage](howto-configure-filter-stage.md).

The portal also lets you import and export complete pipelines as JSON files.

## Prerequisites

To configure and use an aggregate pipeline stage, you need a deployed instance of Azure IoT Data Processor (preview).

## Edit the JSON definition of a stage

To edit the JSON definition of a pipeline stage, open the pipeline stage that you want to modify and select the **Advanced** tab:

:::image type="content" source="media/pipeline-advanced-editor.png" alt-text="A screenshot that shows the advanced pipeline editor.":::

Make the necessary changes directly to the JSON. Ensure that the modified JSON is valid and adheres to the correct schema for the pipeline stage.

When you're done with your modifications, select **Save** to apply the changes. The user interface updates to reflect your changes.

When you use the **Advanced** tab, it’s important to understand the underlying JSON structure and schema of the pipeline stage you’re configuring. An incorrect configuration can lead to errors or unexpected behavior. Be sure to refer to the appropriate documentation or schema definitions

## Import and export pipelines

You can import and export pipelines as JSON files. This feature lets you share pipelines between different instances of Data Processor:

:::image type="content" source="media/pipeline-import-export.png" alt-text="A screenshot that shows the location of the import and export options in the pipeline editor.":::

## Pause and restart a pipeline

To pause or restart a pipeline, open the pipeline, select **Edit** and use **Pipeline enabled** to toggle whether the pipeline is running:

:::image type="content" source="media/pipeline-enabled.png" alt-text="A screenshot that shows the location of the pipeline enabled option in the UI.":::

## Manage pipelines in your cluster

To create, delete or copy pipelines, use the **Pipelines** tab in the Digital Operations portal:

:::image type="content" source="media/pipelines-manage.png" alt-text="A screenshot that shows the options in the pipelines list.":::

This list also lets you view the provisioning state and status of your pipelines

## Related content

- [Data Processor pipeline deployment status is failed](../troubleshoot/troubleshoot.md#data-processor-pipeline-deployment-status-is-failed)
- [What are configuration patterns?](concept-configuration-patterns.md)
