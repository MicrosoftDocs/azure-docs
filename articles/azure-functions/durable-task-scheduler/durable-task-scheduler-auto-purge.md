---
title: Set autopurge retention policies for Azure Functions Durable Task Scheduler (preview)
description: Learn about how and why you'd want to configure autopurge retention policies for Durable Task Scheduler.
ms.topic: conceptual
ms.date: 04/17/2025
---

# Set autopurge retention policies for Azure Functions durable task scheduler (preview)

Orchestration history data should be purged periodically to free up storage resources. Otherwise, the app will likely observe performance degradation as history data accumulates overtime. The Durable Task Scheduler offers a lightweight, configurable autopurge feature that helps you manage orchestration data clean-up without manual intervention.

Autopurge runs asynchronously in the background. It's optimized to avoid using too many system resources to prevent blocking or delaying other Durable Task operations. While autopurge doesn't run on a precise schedule, the clean-up rate roughly matches your orchestration scheduling rate.

## Enable autopurge

Autopurge is an opt-in feature. Enable it by defining retention policies that control how long to keep the data of orchestrations in certain statuses. The autopurge feature covers **completed, failed, canceled, or terminated** statuses only. It does not purge data associated of other statuses such as pending or running. Once enabled, autopurge will periodically delete orchestration instances older than the retention period you set. 

At the moment, retention policies you define will be applied to **ALL** task hubs in a scheduler.

You can define retention policies using:

- Azure Resource Manager (ARM)
- Azure CLI
- Azure portal 

When configuring autopurge retention policy, you can set either a *specific* or a *default* policy. Retention value can range from  0 (purge immediately after completion) to the maximum integer value, with the unit being **days**. While there is no limit imposed on the max retention period, it's recommended that you don't keep large volumes of stale orchestration data for too long to ensure efficient use of storage resources and maintain app performance.

- **Default policy** purges orchestration data *regardless* of `orchestrationState`. The following policy purges orchestration data of all statuses covered by the feature after 2 days: 

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
    
You can add specific policies to override the default which applies to orchestrations of all statuses. In the example below, the second and third policies override the default, so data associated with completed orchestrations is deleted immediately and those associated with failed orchestrations is purged after 60 days. However, because there's no specific policy for orchestrations of statuses canceled and terminated, the default policy still applies so these data are purged after 1 day: 

  ```json
  [
    {
      "retentionPeriodInDays": 1
    },
    {
      "retentionPeriodInDays": 0,
      "orchestrationState": "Completed"
    },
    {
      "retentionPeriodInDays": 60,
      "orchestrationState": "Failed"
    }
  ]
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
          "retentionPeriodInDays": 0,
          "orchestrationState": "Completed"
        },
        {
          "retentionPeriodInDays": 60,
          "orchestrationState": "Failed"
        },
      ]
    }
  }'
```

# [Azure portal](#tab/portal)
Experience coming soon!  
---

## Disable autopurge
# [Azure Resource Manager](#tab/arm)  

# [Azure CLI](#tab/cli)  
To disable autopurge, run the following with the `retentionPolicies` property removed. The Durable Task Scheduler automatically stops cleaning up instances.

```azurecli
az rest --method put --url "/subscriptions/SUBSCRIPTION_ID/resourceGroups/RESOURCE_GROUP/providers/Microsoft.DurableTask/schedulers/SCHEDULER_NAME/retentionPolicies/default?api-version=2025-04-01-preview" --body '{
    "name": "orchestration-retention",
    "type": "private.durabletask/schedulers/retentionPolicies", 
    "properties": {
    }
  }'
```

# [Azure portal](#tab/arm) 
Experience coming soon!  
---



## Next steps
