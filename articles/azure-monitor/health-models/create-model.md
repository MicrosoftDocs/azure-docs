---
title: Create a health model resource in Azure Monitor
description: Learn now to create a health model resource.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 12/12/2023
---

# Create and configure a health model resource in Azure Monitor


## Prerequisites

- In order to be able to register a resource provider, you must have either **Contributor** or **Owner** role (permission to do the `/register/action` operation) in the target subscription of each resource added to your health model.
- In order to authorize the health model identity against Azure resources, you must be either an **Owner** or **User Access Administrator** for the resource. 

## Create a new model


1. Select **Health Models** from the **Monitor** menu in the Azure portal.

   :::image type="content" source="./media/health-model-getting-started/azure-portal-search-bar.png" lightbox="./media/health-model-getting-started/azure-portal-search-bar.png" alt-text="Screenshot of the search bar in the Azure portal with 'health models' entered in it. ":::

2. Any existing health models in your subscription will be listed. Select **Create** to create a new model.

   :::image type="content" source="./media/health-model-getting-started/health-model-resources-list.png" lightbox="./media/health-model-getting-started/health-model-resources-list.png" alt-text="Screenshot of the Azure portal with existing health models listed.":::

3. Select a resource group, name and location for the new health model.

   :::image type="content" source="./media/health-model-getting-started/create-a-new-azure-health-model-page-basics-tab.png" lightbox="./media/health-model-getting-started/create-a-new-azure-health-model-page-basics-tab.png" alt-text="Screenshot of the Create a new Azure Health Model page in the Azure portal with the Basics tab selected.":::

4. Click **Next** to view the **Identity** page. Select **System Assigned** or select an existing User assigned identity. This identity is used later to make authorized requests against the Azure resources that you add to your health model.

   :::image type="content" source="./media/health-model-getting-started/create-a-new-azure-health-model-page-identity-tab.png" lightbox="./media/health-model-getting-started/create-a-new-azure-health-model-page-identity-tab.png" alt-text="Screenshot of the Create a new Azure Health Model page in the Azure portal with the Identity tab selected.":::

5. Click **Create** on the last page of the wizard.

   :::image type="content" source="./media/health-model-getting-started/create-a-new-azure-health-model-page-review-create-tab.png" lightbox="./media/health-model-getting-started/create-a-new-azure-health-model-page-review-create-tab.png" alt-text="Screenshot of the Create a new Azure Health Model page in the Azure portal with the Review + Create tab selected.":::

## Designer view
The **Designer** view in Azure Monitor health models is your primary tool for visually building the health model once it's been created. Access the designer view from the **Designer** option in the health model's menu in the Azure portal. 

When you open the designer view, you're presented with *canvas* that allows you to add a configure different *entities*. A new health model will have a single entity called the *root entity*. This entity can't be deleted or cloned, and all other entities you add to the canvas must connect to the root, either directly or indirectly through another entity.

:::image type="content" source="./media/health-model-create-modify-with-designer/health-model-resource-designer-pane.png" lightbox="./media/health-model-create-modify-with-designer/health-model-resource-designer-pane.png" alt-text="Screenshot of a health model resource in the Azure portal with the Designer pane selected.":::

The following table describes the options available in the command bar in the designer.

:::image type="content" source="./media/health-model-create-modify-with-designer/designer-pane-command-bar.png" lightbox="./media/health-model-create-modify-with-designer/designer-pane-command-bar.png" alt-text="Screenshot of the command bar for a health model resource.":::

| Option | Description |
|:-------|:------------|
| **Add** | Add new entities to the canvas. |
| **Save** | Sends all edits to the server for persistence and validation. Until you click **Save**, changes only exist in the browser. |
| **Discard changes** | Discards all changes up to the last save point. |
| **Enable health model** | Starts the execution of the model. Health states aren't calculated if the model isn't active. Once enabled, Azure Monitor validates if the model is in a consistent state that can be executed. It will send an error message if there are issues that prevent activation. |
| **Refresh interval** | Lets you determine how often the health state of your model is getting calculated. The minimum (and default) value is 1 minute. |
| **Clone node** | Make a copy of the selected entity. Can't be performed on the root entity. | 
| **Delete** | Delete the selected entity. Can't be performed on the root entity. | 

## Add new entities

To add a new entities to the model, click **Add** and select the entity type to add.

| Entity Type | Description |
|:-------|:------------|
| Azure resources | An **Azure resource** from the current subscription or a subscription that you can access. The health model can use any metrics or logs that are associated with the resource. This includes [platform metrics](), [resource logs](), and data collected from insights such as [VM insights]() and [container insights](). |
| Aggregate entities | Aggregate entities represent parts of an application that aren't an Azure resource. The functionality of the aggregate entities are identical, but each is intended to represent a different type of entity. Their health is set by the aggregate of the health of their child entities. You can also add a [log query]() or [Prometheus metrics query]() to set its health state.<br><br>- **User flows** - High level business-oriented set of functionality that allows users of the system to achieve specific goals. Possible examples include *add comment*, *checkout*, *clean data*, and *generate report*.<br>- **System components** - Broader and more technical than user flows. Possible examples include *supporting API services* and *backend workers*.<br>- **Generic entity** - Meant to be used for maximum flexibility when neither user flow or system component have appropriate context in the model. |

## Entity properties


### [General](#tab/general)
The **General** tab allows you to configure the name and health impact of the entity.

:::image type="content" source="./media/health-model-create-modify-with-designer/entity-editor-general-tab.png" lightbox="./media/health-model-create-modify-with-designer/entity-editor-general-tab.png" alt-text="Screenshot of the Entity editor in the Azure portal with the General tab selected.":::


| Setting | Description |
|:---|:---|
| Display name | The name of the entity as it appears in the health model. You can modify this name later. |
| Impact | Determines how the health state of this entity is propagated to its parent(s) as described below. |
| Signals<br>(Aggregate entities only) | Select either a Log Analytics workspace or an Azure Monitor workspace if you want to add signals to the current entity in addition to the health impact of any child entities. This option enables the **Signals** tab for the entity. |

### [Signals](#tab/signals)
The **Signals** tab allows you to set the access of the health model to the selected resource and configuration both metric and log signals.

:::image type="content" source="./media/health-model-create-modify-with-designer/entity-editor-signals-tab.png" lightbox="./media/health-model-create-modify-with-designer/entity-editor-signals-tab.png" alt-text="Screenshot of the Entity editor in the Azure portal with the Signals tab selected.":::

| Setting | Description |
|:---|:---|
| Azure resource | Path to the Azure resource represented by this entity. Click on **Select Azure resource** to change the entity to represent another resource. Will also specify whether the health model has required access to the resource. |
| Metric signals | List of metric signals used to calculate the entity's health and their threshold for each health state. Click on a metric name to edit its details. |
| Log signals | |


### [Alert rules](#tab/alerts)

The **Alert rules** tab displays any alert rules configured on the Azure resource represented by the entity or on the entity itself. You can click on the rule name to edit it. These alert rules can be created either within the health model designer or externally using the standard Azure Alerts configuration. 

:::image type="content" source="./media/health-model-create-modify-with-designer/entity-editor-alert-rules-tab.png" lightbox="./media/health-model-create-modify-with-designer/entity-editor-alert-rules-tab.png" alt-text="Screenshot of the Entity editor in the Azure portal with the Alert rules tab selected.":::


| Setting | Description |
|:---|:---|
| Health entity | Alert rules configured for this health model entity based on the **Health score per node** metric. |
| Azure resources | Alert rules configured for this individual Azure resource. | 

> [!IMPORTANT] 
> If you change to a different resource type, any configured Metric signals are probably no longer valid.

**Configure access** opens the UI to configure at what scope the health model's Managed Identity gets access to read the resource metrics. If the identity is already authorized on a scope which includes the select resource, the link isn't being shown, instead a green checkmark indicates the status.

:::image type="content" source="./media/health-model-create-modify-with-designer/configure-access-ui.png" lightbox="./media/health-model-create-modify-with-designer/configure-access-ui.png" alt-text="Configure access UI in the Azure portal.":::

**Metric signals** lets you configure which resource metrics should be evaluated to determine the health state of this entity. For some resource types, there are _suggested_ signals available, which you can add via **Add all suggested**. These contain both, which metric to watch and sensible thresholds. Verify the added signals and adjust them for your scenario as needed.


Clicking **Create alert rule for health of this entity** guides you to the creation wizard for setting up new alert rules.

### Edit Metric signals

The metric signal dialog is where you chose and configure a particular metric.

The list of available metrics for the selected resource type are getting populated automatically, same for the available dimensions, aggregation type and time grain, once a metric is selected.

:::image type="content" source="./media/health-model-create-modify-with-designer/edit-metric-signal-dialog.png" lightbox="./media/health-model-create-modify-with-designer/edit-metric-signal-dialog.png" alt-text="Screenshot of the Edit metric signal dialog in the Azure portal.":::

### Create Alert rule

After clicking the **Create alert rule for health of this entity**, the Azure Alert rule creation wizard appears. The default **Signal name** is set to **Health score per node**, and health status is quantified numerically as follows: `100` for healthy, `50` for degraded, and `0` for unhealthy.

:::image type="content" source="./media/health-model-create-modify-with-designer/create-an-alert-rule-wizard.png" lightbox="./media/health-model-create-modify-with-designer/create-an-alert-rule-wizard.png" alt-text="Screenshot of the Create an alert rule wizard in the Azure portal with the Condition tab selected.":::

All editing, besides the Alert Rule creation, is done **locally** in the browser and can be rolled back at any time, until you **Save** the health model. To persist changes, don't forget to always click **OK**, **Apply** and finally **Save** in the Designer command bar.


## Next steps
- See [Using the health model designer view in Azure Monitor](./create-model.md#designer-view) for guidance on adding entities to your health model.