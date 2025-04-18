---
title: Set autopurge retention policies for Azure Functions Durable Task Scheduler (preview)
description: Learn about how and why you'd want to configure autopurge retention policies for Durable Task Scheduler.
ms.topic: conceptual
ms.date: 04/17/2025
---

# Set autopurge retention policies for Azure Functions durable task scheduler (preview)

Orchestration history data should be purged periodically to free up storage resources. Otherwise, the app will likely observe performance degradation as history data accumulates overtime. The Durable Task Scheduler offers a lightweight, configurable autopurge feature to help you manage orchestration data clean-up without manual intervention.

Autopurge runs asynchronously in the background and is optimized to avoid using too many system resources, so it won't prevent blocking or delaying other Durable Task operations. While autopurge doesn't run on a precise schedule, the clean-up rate roughly matches your orchestration scheduling rate.

## Enable autopurge

Autopurge is an opt-in feature. Enable it by defining retention policies that control how long to keep completed, failed, or canceled orchestrations. Once enabled, autopurge will periodically delete orchestration instances older than the retention period you set. 

You can configure autopurge using:

- Azure Resource Manager API
- Azure CLI

When configuring through retention policy, you can set either a *specific* or a *default* policy. Retention value can range from 0 (purge immediately after completion) to the maximum integer value. While there is no limit imposed on the max retention period, it is recommended that you keep completed orchestration data only for as long as you need it to free up storage resources and ensure app performance.

- **Default policy** purges orchestration data *regardless* of `orchestrationState`. The following policy purges orchestration data of all statuses after 2 days: 

     ```json
     {
       "retentionPeriodInDays": 2
     }
     ```

- **Specific policy** specifies purging of orchestration data for specific `orchestrationState`. The following policy tells Durable Task Scheduler to keep *completed* orchestration data for 1 day, after which this data is purged. 

     ```json
     {
       "retentionPeriodInDays": 1,
       "orchestrationState": "Completed"
     }
     ```

If you want to override a specific policy, you can add another specific policy. In the example below. the second specific policy would override the first, so the data of *failed* orchestrations is purged after 2 days: 

  ```json
    {
      "retentionPeriodInDays": 2,
      "orchestrationState": "Failed"
    }
  ```

[For more information, see the API reference spec for Durable Task Scheduler retention policies.](/rest/api/durabletask/retention-policies/create-or-replace?view=rest-durabletask-2025-04-01-preview&preserve-view=true)

# [Azure Resource Manager](#tab/arm)  

# [Azure CLI](#tab/cli)  

Set the retention policy by running the following:

```azurecli
  az rest --method put --url "/subscriptions/SUBSCRIPTION_ID/resourceGroups/RESOURCE_GROUP/providers/Microsoft.DurableTask/schedulers/SCHEDULER_NAME/retentionPolicies/default?api-version=2025-04-01-preview" --body '{
    "name": "orchestration-retention",
    "type": "private.durabletask/schedulers/retentionPolicies", 
    "properties": {
      "retentionPolicies": [
        {
          "retentionPeriodInDays": 1
        },
        {
          "retentionPeriodInDays": 1,
          "orchestrationState": "Completed"
        },
        {
          "retentionPeriodInDays": 2,
          "orchestrationState": "Failed"
        },
      ]
    }
  }'
```

---

> [!NOTE]
> If both a specific and a default policy are set, the specific policy takes priority.

## Disable autopurge

# [Azure Resource Manager](#tab/arm)  

To disable autopurge retention policies, just delete the policy from the template. Durable Task Scheduler automatically stops cleaning up instances.

# [Azure CLI](#tab/cli)  
todo

# [Azure portal](#tab/portal)  
todo

---



## Next steps
