---
title: Create or modify health models by using Designer view
description: Learn how to visually create and modify health models.
ms.topic: conceptual
ms.date: 12/12/2023
---

# Create or modify health models by using Designer view

The **Designer** pane, located under the **Development** heading in the left sidebar of a health model resource, is your primary tool for visually creating and modifying health models.

:::image type="content" source="./media/health-model-create-modify-with-designer/health-model-resource-designer-pane.png" lightbox="./media/health-model-create-modify-with-designer/health-model-resource-designer-pane.png" alt-text="Screenshot of a health model resource in the Azure portal with the Designer pane selected.":::

## Command bar

On top, you find the command bar:

:::image type="content" source="./media/health-model-create-modify-with-designer/designer-pane-command-bar.png" lightbox="./media/health-model-create-modify-with-designer/designer-pane-command-bar.png" alt-text="Screenshot of the command bar for a health model resource.":::

| Option | Description |
|:-------|:------------|
| **Add** | Lets you add new entities to the canvas. |
| **Save** | Sends all your edits to the server for persistence and validation. Until you click Save, your changes only exist in the browser. So make sure to save changes every now and then when you do larger edits! |
| **Discard changes** | Discards all changes up to your last save point. |
| **Enable health model** | Starts the execution of your model. While the model isn't active, health states aren't calculated yet. On enablement, the backend validates if your model is in a consistent state that can be executed. You'll receive an error message if there are issues that prevent activation. |
| **Refresh interval** | Lets you determine how often the health state of your model is getting calculated. The minimum (and default) value is 1 minute. |
| **Clone node** and **Delete** | Apply to currently selected entities (except the root entity, which can't be cloned, or deleted). |


## Canvas

The previous screenshot shows the - almost - empty canvas of a newly created health model. The only **entity** that is already there is what we also refer to as the "root". The root is a system entity and can't be deleted. However, you can change its name by clicking on **Edit**. All other entities must, directly or through other entities, connect up to the root.

## Add new entities

To add one or more new entities to the model, click **Add** and select the type of entity you would like to add.

:::image type="content" source="./media/health-model-create-modify-with-designer/designer-pane-command-bar.png" lightbox="./media/health-model-create-modify-with-designer/designer-pane-command-bar.png" alt-text="Screenshot of the Add dropdown within the command bar.":::

| Option | Description |
|:-------|:------------|
| **User flow, System component, and Generic entity** | All represent a part of an application that isn't an Azure resource. Typically these entities either only aggregate the health of their child entities, without specifying any signals themselves. Or, they (also) contain log-based queries, for example, towards an Azure Log Analytics workspace for application-level logs and metrics.<ul><li>_User flows_ are business-oriented and represent a high level, overarching, set of functionality that allows users of the system to achieve specific goals. Examples would be: "add comment", "checkout", "clean data", "generate report", etc.</li><li>_System components_ are still expected to be high level, but can be broader and more technical than User flows. System components include supporting API services, backend workers, etc.</li><li>_Generic entity_ is meant to be used for maximum flexibility when neither User flow or System component have the right meaning in the model.</li></ul> |
| **Azure resources** | Represents a part of the Azure-based infrastructure an application uses. Examples include Virtual Machines, SQL databases, Event Hubs, etc. They typically contain many metric signals, based on [Azure-provided resource metrics](../essentials/metrics-supported.md). In addition, they might contain log-based queries for [Diagnostics logs and metrics](../essentials/diagnostic-settings.md?tabs=portal), which are exported to an Azure Log Analytics workspace. |

## Edit entities

### Azure Resource entity

When you edit an Azure Resource entity for the first time, the **Entity editor** opens on the **General** tab and looks like this:

:::image type="content" source="./media/health-model-create-modify-with-designer/entity-editor-general-tab.png" lightbox="./media/health-model-create-modify-with-designer/entity-editor-general-tab.png" alt-text="Screenshot of the Entity editor in the Azure portal with the General tab selected.":::

The **General** tab offers the ability to configure an entity's display name and its impact. **Display Name** defaults to the name of the Azure resource, but you can modify it.

The **Impact** setting determines how the health state of this entity is being propagated to its parent(s):

| Option | Description |
|:-------|:------------|
| **Standard** | Standard impact propagates the entity state upwards as-is. If the entity is unhealthy, it propagates unhealthy. For degraded state respectively. |
| **Limited** | Limited impact doesn't propagate a degraded state and propagates an unhealthy state as degraded. |
| **Suppressed** | Suppressed doesn't propagate any degraded or unhealthy state (for the parents the entity appears as if it was healthy). |

The next tab is called **Signals** changing the selected Azure resource, verify or set the access of the health model to the selected resource and configuration both metric and log signals.

:::image type="content" source="./media/health-model-create-modify-with-designer/entity-editor-signals-tab.png" lightbox="./media/health-model-create-modify-with-designer/entity-editor-signals-tab.png" alt-text="Screenshot of the Entity editor in the Azure portal with the Signals tab selected.":::

**Select Azure resource** to change the resource association. 

> [!IMPORTANT] 
> Be aware that if you change to a different resource type, any configured Metric signals are probably no longer valid.

**Configure access** opens the UI to configure at what scope the health model's Managed Identity gets access to read the resource metrics. If the identity is already authorized on a scope which includes the select resource, the link isn't being shown, instead a green checkmark indicates the status.

:::image type="content" source="./media/health-model-create-modify-with-designer/configure-access-ui.png" lightbox="./media/health-model-create-modify-with-designer/configure-access-ui.png" alt-text="Configure access UI in the Azure portal.":::

**Metric signals** lets you configure which resource metrics should be evaluated to determine the health state of this entity. For some resource types, there are _suggested_ signals available, which you can add via **Add all suggested**. These contain both, which metric to watch and sensible thresholds. Verify the added signals and adjust them for your scenario as needed.

The list of suggested metrics are maintained in an open-source GitHub [repository](https://github.com/Azure/ahm-templates).

The last tab in the Entity editor is the **Alert rules** tab.

:::image type="content" source="./media/health-model-create-modify-with-designer/entity-editor-alert-rules-tab.png" lightbox="./media/health-model-create-modify-with-designer/entity-editor-alert-rules-tab.png" alt-text="Screenshot of the Entity editor in the Azure portal with the Alert rules tab selected.":::

The **Alert rules** section displays any Azure alert rules that may be configured on the resource itself (Azure resource) or on the entity (Health entity) and provides direct links to access these rules.

- **Health entity** contains Azure alerts configured for this health model entity based on the **Health score per node** metric.
- **Azure resource** contains Azure alerts configured for this individual Azure resource.

You have the flexibility to configure alert rules either within the health model designer or externally using the standard Azure Alerts configuration. The latter also applies to Infra-as-Code scenarios.

Clicking **Create alert rule for health of this entity** guides you to the creation wizard for setting up new alert rules.

### Edit Metric signals

The metric signal dialog is where you chose and configure a particular metric.

The list of available metrics for the selected resource type are getting populated automatically, same for the available dimensions, aggregation type and time grain, once a metric is selected.

:::image type="content" source="./media/health-model-create-modify-with-designer/edit-metric-signal-dialog.png" lightbox="./media/health-model-create-modify-with-designer/edit-metric-signal-dialog.png" alt-text="Screenshot of the Edit metric signal dialog in the Azure portal.":::

### Create Alert rule

After clicking the **Create alert rule for health of this entity**, the Azure Alert rule creation wizard appears. The default **Signal name** is set to **Health score per node**, and health status is quantified numerically as follows: `100` for healthy, `50` for degraded, and `0` for unhealthy.

:::image type="content" source="./media/health-model-create-modify-with-designer/create-an-alert-rule-wizard.png" lightbox="./media/health-model-create-modify-with-designer/create-an-alert-rule-wizard.png" alt-text="Screenshot of the Create an alert rule wizard in the Azure portal with the Condition tab selected.":::

All editing, besides the Alert Rule creation, is done **locally** in the browser and can be rolled back at any time, until you **Save** the health model. To persist changes, don't forget to always click **OK**, **Apply** and finally **Save** in the Designer command bar.