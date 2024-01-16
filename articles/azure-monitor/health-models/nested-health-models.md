---
title: Add a nested health model in Azure Health Models
description: Learn how to add a nested health model. This functionality can be helpful for some scenarios such as complex environments, meta-models, or centralized health models that don’t need the full level of detail.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 12/12/2023
---

# Nested health models in Azure Health Models

An Azure Monitor can be added to another health model just like any other Azure resource, which allows you to created nested health models. This functionality can be helpful for scenarios such as complex environments, meta-models, or centralized health models that don't need the full level of detail.

Like other Azure resources, nested health models require one or more signals to determine their health in the current health model. There are three metric signals available.

   :::image type="content" source="./media/health-model-nested-health-models/edit-metric-signal-dialog.png" lightbox="./media/health-model-nested-health-models/edit-metric-signal-dialog.png" alt-text="Screenshot of the Edit metric signal dialog in the Azure portal.":::


| Metric option | Description |
|:-------|:------------|
| **Overall health score** (Suggested) | Health score of the root entity of the health model. |
| **Health score per node** | Health score from a specific entity in the selected health model. Name of the node is specified in the _Dimension_ of the criteria. |
| **Query execution duration** | Contains the overall duration the execution of all configured queries in a health model. |


## Next steps
