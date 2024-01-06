---
title: Health state
description: Concept of health state
ms.topic: conceptual
ms.date: 12/12/2023
---

# Health state

The health state of an object represents the ability of that object to perform its required tasks. As opposed to 


Each resource in a health model has a health state based on a number of signals. A signal may be a metric value with a particular threshold or the results of a log query that's scheduled to run periodically. The health state of a resource rolls up to any resources that depend on it. For example, if an application depends on a storage account with a degraded health state, the application's health state is also degraded. The health of all the components of the health model roll up to a single root entity that provides a health state for the overall workflow.

The health state is updated regularly, so you can always view an up-to-date health state in addition to tracking the health of each component and the entire model over time .

## Health states



## Signals
The health of an entity is determined by one or more signals. A signal is a metric or log query that is evaluated on a schedule. The result of the signal is compared to a threshold to determine the health state of the entity.


## Impact
*Impact* refers to how the health an entity impacts the health of its parents. The different impact settings are described in the following table.

### Impact
The *impact* of an entity determines how its health state is propagated to its parent(s). Each entity in the health model has an impact setting that applies to any of the parent entities that entity is connected to. The following table describes the different impact settings.

| Option | Description |
|:-------|:------------|
| Standard | Propagates the entity state up to each parent. |
| Limited  | Doesn't propagate a degraded state and propagates on unhealthy state as degraded. Each parent will never receive an unhealthy state. |
| Suppressed | Doesn't propagate any health state to each parent. Even if the entity is degraded or unhealthy, the parent will appear as healthy. |

The following sample shows the effect of each impact setting. Each of the child entities are in an unhealthy state, but the parent health states are difference based on the impact setting of each child. 

This sample also shows the worst-case rollup of the parent health states to the root entity. Each of the parent entities are configured for standard impact meaning their health state will propogate to the root entity which is their parent.  The root entity is in an unhealthy state because this is the worst case of the entities directly underneath it. 

:::image type="content" source="media/health-state/health-impact.png" lightbox="media/health-state/health-impact.png" alt-text="Screenshot of an example health model showing different impact settings. ":::