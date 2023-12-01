---
title: Azure Monitor Health Models
description: Over of Azure Monitor health models
ms.topic: conceptual
ms.date: 07/19/2023
ms.author: bwren
author: bwren
---

# Azure Monitor Health Models Designer view
The Designer, located under the Development heading in the left sidebar of a health model resource, is the primary tool for visually creating and modifying health models.

## Command bar

| Option | Description |
|:---|:---|
| Add | Add new entities to the canvas. |
| Save | Save changes to the health model to Azure Monitor. Until you click Save, your changes only exist in the browser. |
| Discard changes | Undo all changes up to the last save point. |
| Enable/Disable health model | Starts execution of the model. While the model is not active, health states are not calculated yet. Once enabled, Azure Monitor validates if the model is in a consistent state that can be executed. It will send an error message if there are issues which prevent activation. |
| Refresh interval | you determine how often the health state of your model is getting calculated. The minimum (and default) value is 1 minute.
| Clone entity | Create a copy of the selected entity. The root entity cannot be cloned. |
| Delete entity | Delete the selected entity. The root entity cannot be deleted. |

## Entities
A health model is made up of multiple entities 

### Root entity
When a new health model is created, it will have a single root entity. All other entities must connect directly or indirectly to the root entity. It can't be deleted, but you can rename it.

