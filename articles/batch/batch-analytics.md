---
title: Azure Batch Analytics
description: The topics in Batch Analytics contain reference information for the events and alerts available for Batch service resources.
ms.topic: reference
ms.date: 04/02/2025
# Customer intent: "As a cloud administrator, I want to understand the diagnostic log events for Batch service resources, so that I can effectively monitor and troubleshoot the performance of my cloud-based applications."
---

# Batch Analytics

The topics in this section contain reference information for the events and alerts available for Batch service resources.

See [Azure Batch diagnostic logging](./batch-diagnostics.md) for more information on enabling and consuming Batch diagnostic logs.

## Diagnostic logs

The Azure Batch service emits the following diagnostic log events during the lifetime of certain Batch resources.

### Service Log events

- [Pool create](batch-pool-create-event.md)
- [Pool delete start](batch-pool-delete-start-event.md)
- [Pool delete complete](batch-pool-delete-complete-event.md)
- [Pool resize start](batch-pool-resize-start-event.md)
- [Pool resize complete](batch-pool-resize-complete-event.md)
- [Pool autoscale](batch-pool-autoscale-event.md)
- [Task start](batch-task-start-event.md)
- [Task complete](batch-task-complete-event.md)
- [Task fail](batch-task-fail-event.md)
- [Task schedule fail](batch-task-schedule-fail-event.md)
