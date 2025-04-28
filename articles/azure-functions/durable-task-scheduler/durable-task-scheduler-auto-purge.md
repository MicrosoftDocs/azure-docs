---
title: Set autopurge retention policies for Azure Functions Durable Task Scheduler (preview)
description: Learn about how and why you'd want to configure autopurge retention policies for Durable Task Scheduler.
ms.topic: conceptual
ms.date: 04/28/2025
---

# Set autopurge retention policies for Azure Functions Durable Task Scheduler (preview)

Orchestration history data should be purged periodically to free up storage resources. Otherwise, the app observes performance degradation as history data accumulates overtime. The Durable Task Scheduler offers a lightweight, configurable autopurge feature that helps you manage orchestration data clean-up without manual intervention.

Autopurge operates asynchronously in the background, optimized to minimize system resource usage and prevent interference with other Durable Task operations. Although autopurge doesn't adhere to a strict schedule, its clean-up rate generally aligns with your orchestration scheduling rate.

## How it works

Autopurge is an opt-in feature. Enable it by defining retention policies that control how long to keep the data of orchestrations in certain statuses. The autopurge feature purges data associated only with the following statuses:
- `Completed`
- `Failed`
- `Canceled`
- `Terminated`

Autopurge ignores data associated with the following statuses:
- `Pending` 
- `Running` 

[Once enabled,](#enable-autopurge) autopurge periodically deletes orchestration instances older than the retention period you set. 

> [!NOTE]
> Retention policies you define are applied to **all** task hubs in a scheduler.

### Policy value

Retention value can range from 0 (purge immediately after completion) to the maximum integer value, with the unit being **days**. 

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
    
Add specific policies to override the default policy applied to orchestrations, regardless of status. In the following example, the second and third policies override the default policy (`"retentionPeriodInDays": 1`). 
- Data associated with completed orchestrations is deleted immediately. 
- Data associated with failed orchestrations is purged after 60 days. 

However, since no specific policy is set for canceled or terminated orchestrations, the default policy still applies to them, purging their data after 1 day. 

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

## Enable autopurge

You can define retention policies using:

- Bicep
- Azure Resource Manager (ARM)
- Azure CLI

# [Bicep](#tab/bicep)  

You can create or update retention policies by adding the `retentionPolicies` configuration to your Bicep file. Make sure you're pulling from the latest preview version.

```bicep
resource exampleResource 'Microsoft.DurableTask/schedulers/retentionPolicies@2025-04-01-preview' = {
  parent: parentResource 
  name: 'example'
  properties: {
    retentionPolicies: [
      {
        retentionPeriodInDays: 30
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

# [Azure CLI](#tab/cli)  

Create or update the retention policy by running the following command.

```azurecli
  az rest --method put --url "/subscriptions/SUBSCRIPTION_ID/resourceGroups/RESOURCE_GROUP/providers/Microsoft.DurableTask/schedulers/SCHEDULER_NAME/retentionPolicies/default?api-version=2025-04-01-preview" --body '{
    "name": "default",
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

**Example response**

If creation is successful, you receive the following response.

```json
{
  "id": "/subscriptions/SUBSCRIPTION_ID/resourceGroups/RESOURCE_GROUP_NAME/providers/Microsoft.DurableTask/schedulers/SCHEDULER_NAMER/retentionPolicies/default",
  "name": "default",
  "properties": {
    "provisioningState": "Succeeded",
    "retentionPolicies": [
      {
        "orchestrationState": "Completed",
        "retentionPeriodInDays": 0
      },
      {
        "orchestrationState": "Failed",
        "retentionPeriodInDays": 30
      }
    ]
  },
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

---

## Disable autopurge

# [Bicep](#tab/bicep)  

Remove `retentionPolicies` from your Bicep file.

# [Azure Resource Manager](#tab/arm)  

Delete the retention policy using an API call.

```HTTP
DELETE https://management.azure.com/subscriptions/SUBSCRIPTION_ID/resourceGroups/RESOURCE_GROUP/providers/Microsoft.DurableTask/schedulers/SCHEDULER_NAME/retentionPolicies/default?api-version=2025-04-01-preview
```

# [Azure CLI](#tab/cli)  

Delete the retention policies using the following command. The Durable Task Scheduler stops cleaning orchestration data within 5 to 10 minutes.

```azurecli
az rest --method delete --url "/subscriptions/SUBSCRIPTION_ID/resourceGroups/RESOURCE_GROUP_NAME/providers/Microsoft.DurableTask/schedulers/SCHEDULER_NAMER/retentionPolicies/default?api-version=2025-04-01-preview"
```

---

## Next steps

Monitor and manage your orchestration status and history using [the Durable Task Scheduler dashboard](./durable-task-scheduler-dashboard.md).