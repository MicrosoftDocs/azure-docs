---
title: Set autopurge retention policies for Azure Functions Durable Task Scheduler (preview)
description: Learn about how and why you'd want to configure autopurge retention policies for Durable Task Scheduler.
ms.topic: conceptual
ms.date: 05/06/2025
---

# Set autopurge retention policies for Azure Functions Durable Task Scheduler (preview)

To prevent reaching the memory limit of a [capacity unit (CU)](./durable-task-scheduler-dedicated-sku.md#dedicated-sku-concepts), it's best practice to periodically purge orchestration history data. The Durable Task Scheduler offers a lightweight, configurable autopurge feature that helps you manage orchestration data clean-up without manual intervention.

Autopurge operates asynchronously in the background, optimized to minimize system resource usage and prevent interference with other Durable Task operations. Although autopurge doesn't adhere to a strict schedule, its clean-up rate generally aligns with your orchestration scheduling rate.

## How it works

Autopurge is an opt-in feature. You can enable it by defining retention policies that control how long to keep the data of orchestrations in certain statuses. The autopurge feature purges orchestration data associated with terminal statuses. "Terminal" refers to orchestrations that have reached a final state with no further scheduling, event processing, or work item generation. Terminal statuses include:
- `Completed`
- `Failed`
- `Canceled`
- `Terminated`

The orchestration instances eligible for autopurge match those targeted by [the Durable SDK PurgeInstancesAsync API](/dotnet/api/microsoft.durabletask.client.durabletaskclientextensions.purgeinstancesasync?view=durabletask-dotnet-1.x&preserve-view=true).

Autopurge ignores orchestration data associated with non-terminal statuses. "Non-terminal" statuses indicate that the orchestration instance is either actively executing, paused, or in a state where it may resume in the future (waiting for external events or timers). These orchestrations that are continuing as new, where the current *execution* is completed, but a new instance has been started as a continuation.

These statuses include:
- `Pending` 
- `Running` 
- `Suspended`
- `Continued_As_New`

[Once enabled,](#enable-autopurge) autopurge periodically deletes orchestration data older than the retention period you set. Autopurge only 

> [!NOTE]
> Retention policies you define are applied to **all** task hubs in a scheduler.

### Policy value

Retention value can range from 0 (purge as soon as possible) to the maximum integer value, with the unit being **days**. 

The retention period refers to the time period since the orchestration entered terminal state. For example, you set a retention value of 1 day. If the orchestration takes 10 days to finish, autopurge won't delete it until the following day. Autopurge isn't triggered until the orchestration finishes.

Although retention periods have no maximum limit, we recommend you avoid retaining large volumes of stale orchestration data for extended periods. This practice ensures efficient use of storage resources and maintains optimal app performance.

### Types of policies

When configuring an autopurge retention policy, you can set either a *specific* or a *default* policy.

- **Default policy** purges orchestration data *regardless* of `orchestrationState`. The following policy purges orchestration data of all statuses covered by the feature after 2 days: 

     ```json
     {
       "retentionPeriodInDays": 2
     }
     ```

- **Specific policy** defines purging of orchestration data for specific `orchestrationState`. The following policy tells Durable Task Scheduler to keep *completed* orchestration data for 1 day, after which this data is purged. 

     ```json
     {
       "retentionPeriodInDays": 1,
       "orchestrationState": "Completed"
     }
     ```
    
Add specific policies to override the default policy applied to orchestrations. In the following example, the second and third policies override the default policy (`"retentionPeriodInDays": 1`). 
- Data associated with `completed` orchestrations is deleted as soon as possible. 
- Data associated with `failed` orchestrations is purged after 60 days. 

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

Since no specific policy is set for `canceled` or `terminated` orchestrations, the default policy still applies to them, purging their data after 1 day. 

[For more information, see the API reference spec for Durable Task Scheduler retention policies.](/rest/api/durabletask/retention-policies/create-or-replace?view=rest-durabletask-2025-04-01-preview&preserve-view=true)

## Enable autopurge

You can define retention policies using:

- Durable Task CLI
- Azure Resource Manager (ARM)
- Bicep

# [Durable Task CLI](#tab/cli)  

Make sure you have the latest version of the Durable Task CLI extension.

```azurecli 
az extension add --name durabletask
az extension update --name durabletask
``` 

Create or update the retention policy by running the following command.

```azurecli
az durabletask retention-policy create --scheduler-name SCHEDULER_NAME --resource-group RESOURCE_GROUP --default-days 1 --completed-days 0 --failed-days 60
```

The following properties specify the retention duration for orchestration data of different statuses.

| Property | Description |
| -------- | ----------- |
| `--canceled-days` or `-x` | The number of days to retain canceled orchestrations. |
| `--completed-days` or `-c` | The number of days to retain completed orchestrations. |
| `--default-days` or `-d` | The number of days to retain orchestrations. |
| `--failed-days` or `-f` | The number of days to retain failed orchestrations. |
| `--terminated-days` or `-t` | The number of days to retain terminated orchestrations. |

**Example response**

If creation is successful, you receive the following response.

```json
{
  "id": "/subscriptions/SUBSCRIPTION_ID/resourceGroups/RESOURCE_GROUP/providers/Microsoft.DurableTask/schedulers/SCHEDULER_NAMER/retentionPolicies/default",
  "name": "default",
  "properties": {
    "provisioningState": "Succeeded",
    "retentionPolicies": [
      {
        "retentionPeriodInDays": 1
      },
      {
        "orchestrationState": "Completed",
        "retentionPeriodInDays": 0
      },
      {
        "orchestrationState": "Failed",
        "retentionPeriodInDays": 60
      }
    ]
  },
  "resourceGroup": "RESOURCE_GROUP",
  "systemData": {
    "createdAt": "2025-04-23T23:41:17.3165122Z",
    "createdBy": "someone@microsoft.com",
    "createdByType": "User",
    "lastModifiedAt": "2025-04-23T23:41:17.3165122Z",
    "lastModifiedBy": "someone@microsoft.com",
    "lastModifiedByType": "User"
  },
  "type": "microsoft.durabletask/schedulers/retentionpolicies"
}
```

> [!TIP]
> Learn more about the retention policy command via [the CLI reference](/cli/azure/durabletask/retention-policy?view=azure-cli-latest&preserve-view=true). 

# [Azure Resource Manager](#tab/arm)  

You can create or update retention policies using the Azure Resource Manager API using the following request. Make sure you're pulling from the latest preview version.

```HTTP
PUT https://management.azure.com/subscriptions/SUBSCRIPTION_ID/resourceGroups/RESOURCE_GROUP/providers/Microsoft.DurableTask/schedulers/SCHEDULER_NAME/retentionPolicies/default?api-version=2025-04-01-preview

{
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
      }
    ]
  }
}
```

**Example response**

If creation is successful, you receive the following response.

```json
{
  "properties": {
    "provisioningState": "Succeeded",
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
      }
    ]
  },
  "id": "/subscriptions/SUBSCRIPTION_ID/resourceGroups/RESOURCE_GROUP/providers/Microsoft.DurableTask/schedulers/SCHEDULER_NAME/retentionPolicies/default",
  "name": "default",
  "type": "Microsoft.DurableTask/schedulers/retentionPolicies",
  "systemData": {
    "createdBy": "someone@microsoft.com",
    "createdByType": "User",
    "createdAt": "2025-03-31T23:34:09.612Z",
    "lastModifiedBy": "someone@microsoft.com",
    "lastModifiedByType": "User",
    "lastModifiedAt": "2025-03-31T23:34:09.612Z"
  }
}
```

# [Bicep](#tab/bicep)  

You can create or update retention policies by adding the `retentionPolicies` configuration to your Bicep file. Make sure you're pulling from the latest preview version.

```bicep
resource exampleResource 'Microsoft.DurableTask/schedulers/retentionPolicies@2025-04-01-preview' = {
  parent: parentResource 
  name: 'default'
  properties: {
    retentionPolicies: [
      {
        retentionPeriodInDays: 1
      }
      {
        "retentionPeriodInDays": 0,
        "orchestrationState": "Completed"
      }
      {
        retentionPeriodInDays: 60
        orchestrationState: 'Failed'
      }
    ]
  }
}
```
---

## Disable autopurge

# [Durable Task CLI](#tab/cli)  

Delete the retention policies using the following command. The Durable Task Scheduler stops cleaning orchestration data within 5 to 10 minutes.

```azurecli
az durabletask retention-policy delete --scheduler-name SCHEDULER_NAME --resource-group RESOURCE_GROUP
```

# [Azure Resource Manager](#tab/arm)  

Delete the retention policy using an API call.

```HTTP
DELETE https://management.azure.com/subscriptions/SUBSCRIPTION_ID/resourceGroups/RESOURCE_GROUP/providers/Microsoft.DurableTask/schedulers/SCHEDULER_NAME/retentionPolicies/default?api-version=2025-04-01-preview
```

# [Bicep](#tab/bicep)  

Remove `retentionPolicies` from your Bicep file.

---

## Next steps

Monitor and manage your orchestration status and history using [the Durable Task Scheduler dashboard](./durable-task-scheduler-dashboard.md).