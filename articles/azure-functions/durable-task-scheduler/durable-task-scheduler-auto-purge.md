---
title: Set auto-purge retention policies for Azure Functions Durable Task Scheduler (preview)
description: Learn about how and why you'd want to configure auto-purge retention policies for Durable Task Scheduler.
ms.topic: conceptual
ms.date: 04/17/2025
---

# Set auto-purge retention policies for Azure Functions Durable Task Scheduler (preview)

Large volumes of completed orchestration instance data can lead to storage bloat, incur higher storage cost, and increase performance issues. The auto-purge feature for Durable Task Scheduler offers a lightweight, configurable, and adoptable way to manage orchestration instance clean-up without manual intervention.

## How it works

You can enable auto-purge by simply defining retention policies that control how long to keep completed, failed, or canceled orchestrations. Once enabled, auto-purge deletes orchestration instances older than the retention period you set. 

Auto-purge runs asynchronously in the background to avoid using too many system resources and blocking or delaying other Durable Task operations. While auto-purge doesn't run on a precise schedule, the clean-up rate roughly matches your orchestration scheduling rate.

### Enable auto-purge

You can configure auto-purge using:

- Azure Resource Manager: Retention Policy Spec
- Azure CLI (coming soon)
- Azure Portal UI (coming soon)

# [Azure Resource Manager](#tab/arm)  

When configuring in Azure Resource Manager, you can set a *specific* retention policy. Specific policies are applied only to the `orchestrationState` you've specified. 

```json
{
  "retentionPeriodInDays": 1,
  "orchestrationState": "Completed"
}
```

In this example, the retention policy tells Durable Task Scheduler to keep completed orchestrations for 1 day, and purge the rest. 

You can also set a default policy to apply to all purgeable statuses by omitting `orchestrationState`:

```json
{
  "retentionPeriodInDays": 2
}
```

You can set retention from 0 (purge immediately after completion) to any large number.

[For more information, see the API reference spec for Durable Task Scheduler retention policies](/rest/api/durabletask/retention-policies/create-or-replace?view=rest-durabletask-2025-04-01-preview&preserve-view=true)

# [Azure CLI](#tab/cli)  
todo

# [Azure portal](#tab/portal)  
todo

---

> [!NOTE]
> If you've set both a specific and a default policy, the specific policy takes priority.

### Disable auto-purge

# [Azure Resource Manager](#tab/arm)  

To disable auto-purge retention policies, just delete the policy from the template. Durable Task Scheduler will automatically stop cleaning up instances.

# [Azure CLI](#tab/cli)  
todo

# [Azure portal](#tab/portal)  
todo

---



## Next steps
