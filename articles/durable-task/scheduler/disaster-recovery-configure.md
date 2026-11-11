---
author: hhunter-ms
ms.author: hannahhunter
title: Configure disaster recovery in Durable Task Scheduler
titleSuffix: Durable Task
description: Set up and operate disaster recovery for Durable Task Scheduler to pair two schedulers in different Azure regions and fail workloads over between them.
ms.topic: how-to
ms.service: durable-task
ms.subservice: durable-task-scheduler
ms.date: 10/09/2026
ai-usage: ai-assisted

#customer intent: As an Azure developer or operator using Durable Task Scheduler, I want to configure disaster recovery across two regions so that I can fail my workflows over when a region becomes unavailable.
---

# Configure disaster recovery in Durable Task Scheduler

> [!IMPORTANT]
> Disaster recovery for Durable Task Scheduler is in public preview. Preview features are subject to the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/), and some details might change before general availability.

This article shows you how to pair a primary and secondary Durable Task Scheduler, keep them in sync, and perform a failover. For background on how disaster recovery works, see [Disaster recovery in Durable Task Scheduler](disaster-recovery.md).

In this article, you:

> [!div class="checklist"]
> * Create a primary and secondary scheduler that meet the disaster recovery requirements.
> * Enable disaster recovery between them.
> * Perform a planned or forced failover.
> * Redirect your app to the new primary.
> * Disable disaster recovery when you no longer need it.

## Prerequisites

* [!INCLUDE [quickstarts-free-trial-note](~/reusable-content/ce-skilling/azure/includes/quickstarts-free-trial-note.md)]
* The [Azure CLI](/cli/azure/install-azure-cli), with the `durabletask` extension installed: `az extension add --name durabletask`.
* The examples in this article use Bash. Run them in [Azure Cloud Shell](/azure/cloud-shell/overview) (Bash) or a local Bash shell.
* Two [Durable Task Scheduler](quickstart-durable-task-scheduler.md) resources on the **Dedicated SKU**, each in a different Azure region. The scheduler you plan to use as the secondary must not have any task hubs on it yet. Wait until both schedulers report `provisioningState` as `Succeeded` before you enable disaster recovery.
* Create the task hubs you need on the primary scheduler, and leave the secondary scheduler empty of task hubs. Enabling disaster recovery copies the primary's existing task hub records to the secondary.
* Your user or deployment identity needs the **Contributor** role, or another Azure RBAC role with the required permissions, on both the primary and secondary schedulers. Use role assignments scoped to the schedulers or inherited from a resource group or subscription.
* For the Bicep option, your deployment identity also needs permission to create and manage deployments in the primary scheduler's resource group. For example, assign **Contributor** at that resource-group scope or an inherited parent scope. A role assignment on the scheduler alone doesn't grant these [deployment permissions](/azure/azure-resource-manager/bicep/deploy-cli#required-permissions).
* Your client and worker identities need a Durable Task Scheduler data role that covers the task hubs they use on **both schedulers**. Most applications need **Durable Task Data Contributor**. Use **Durable Task Worker** for applications that only process orchestrations, activities, and entities, or **Durable Task Data Reader** for read-only applications. Assign data roles at the task hub scope for least-privilege access; use the scheduler scope only when an identity needs access to all task hubs on that scheduler.
* The **Contributor** role doesn't grant access to orchestration data or permission to create role assignments. To assign the data roles, use an identity with role-assignment permissions at the target scope, such as **Owner** or **User Access Administrator**. See [Configure managed identity for Durable Task Scheduler](durable-task-scheduler-identity.md).

Disaster recovery is available in Azure public cloud regions where Durable Task Scheduler is available, except: Austria East, Belgium Central, Central US EUAP, Chile Central, East US 2 EUAP, France South, Italy North, Jio India West, Northeast US 5, and Southeast US 5. Confirm region support before you choose your primary and secondary regions.

> [!IMPORTANT]
> You're billed for both the primary and secondary schedulers at the same time, even while the secondary is on standby. Each scheduler is billed for its provisioned capacity units (CUs) at the price for its Azure region. See [Disaster recovery costs](disaster-recovery.md#costs).

## Sign in and set variables

Sign in to Azure and set the variables for the examples in this article:

```azurecli
az login

primaryRg="<primary-resource-group>"
primaryScheduler="<primary-scheduler-name>"
secondaryRg="<secondary-resource-group>"
secondaryScheduler="<secondary-scheduler-name>"
apiVersion="2026-07-01-preview"
```

## Enable disaster recovery

Get the resource ID of each scheduler:

```azurecli
secondaryId=$(az durabletask scheduler show \
  --resource-group $secondaryRg \
  --name $secondaryScheduler \
  --query id -o tsv)

primaryId=$(az durabletask scheduler show \
  --resource-group $primaryRg \
  --name $primaryScheduler \
  --query id -o tsv)
```

Choose Azure CLI or Bicep to enable disaster recovery:

# [Azure CLI](#tab/azure-cli)

Call the primary scheduler's `failoverInstances/default` endpoint by using the secondary's resource ID as the `partnerSchedulerResourceId` value:

```azurecli
az rest --method put \
  --uri "https://management.azure.com${primaryId}/failoverInstances/default?api-version=${apiVersion}" \
  --body "{\"properties\": {\"partnerSchedulerResourceId\": \"$secondaryId\"}}"
```

Enabling disaster recovery is asynchronous. The request returns `202 Accepted` while the operation finishes in the background. An accepted response doesn't mean the pairing is ready.

# [Bicep](#tab/bicep)

Save the following template as `main.bicep`. It creates a [`failoverInstances/default` resource](/azure/templates/microsoft.durabletask/2026-07-01-preview/schedulers/failoverinstances) under the existing primary scheduler and pairs it with the secondary scheduler. It doesn't redeploy either scheduler.

```bicep
@description('Name of the existing primary scheduler in the deployment resource group.')
param primarySchedulerName string

@description('Resource ID of the existing secondary scheduler in a different Azure region.')
param secondarySchedulerResourceId string

resource primaryScheduler 'Microsoft.DurableTask/schedulers@2026-07-01-preview' existing = {
  name: primarySchedulerName
}

resource failoverInstance 'Microsoft.DurableTask/schedulers/failoverInstances@2026-07-01-preview' = {
  parent: primaryScheduler
  name: 'default'
  properties: {
    partnerSchedulerResourceId: secondarySchedulerResourceId
  }
}
```

> [!NOTE]
> Bicep might report [BCP081](/azure/azure-resource-manager/bicep/diagnostics/bcp081) because type definitions for this preview API aren't included in the Bicep CLI yet. This warning doesn't prevent deployment.

Deploy the template to the primary scheduler's resource group in incremental mode:

```azurecli
az deployment group create \
  --resource-group $primaryRg \
  --mode Incremental \
  --template-file main.bicep \
  --parameters primarySchedulerName="$primaryScheduler" secondarySchedulerResourceId="$secondaryId"
```

Removing the resource from your Bicep file doesn't disable disaster recovery. To stop replication, follow [Stop disaster recovery](#stop-disaster-recovery).

---

The remaining steps use Azure CLI to check status and manage failover, regardless of which option you used to enable disaster recovery.

### Check status

Poll the same resource until `provisioningState` reports `Succeeded`:

```azurecli
az rest --method get \
  --uri "https://management.azure.com${primaryId}/failoverInstances/default?api-version=${apiVersion}"
```

A successful response looks similar to:

```json
{
  "properties": {
    "provisioningState": "Succeeded",
    "replicationRole": "Primary",
    "failoverState": "None",
    "partnerSchedulerResourceId": "/subscriptions/.../resourceGroups/.../providers/Microsoft.DurableTask/schedulers/<secondary>",
    "partnerSchedulerLocation": "<secondary-region>"
  }
}
```

`provisioningState` can be `Provisioning`, `Succeeded`, `Deleting`, or `Failed`. `failoverState` is normally `None` after initial pairing. It describes failover progress, not whether pairing provisioning succeeded. For example, a failed attempt that didn't reach the database transition step can also reset `failoverState` back to `None`.

After `provisioningState` becomes `Succeeded`, you can't change the partner. Reissuing the same `PUT` is idempotent and returns `200`. To pair with a different scheduler, delete the failover resource and re-enable disaster recovery.

Because `primary` and `secondary` are roles that can swap after a failover - not fixed identities - track which resource currently holds each role with its own variables. Keep them updated whenever a failover succeeds:

```azurecli
currentPrimaryId=$primaryId
currentSecondaryId=$secondaryId
```

## Keep your schedulers in sync

Create the task hubs you need on the primary scheduler before you enable disaster recovery, and leave the secondary empty of task hubs. Enabling disaster recovery copies the primary's existing task hub records to the secondary as part of setting up the pairing. Task hub names stay the same after a failover; clients and workers still need to use the new primary's endpoint.

After you enable disaster recovery:

* Keep app registrations, role assignments, and any other configuration consistent on both schedulers so your workers and clients can connect to either one after a failover.
* Consider keeping the schedulers' capacity (`sku.capacity`) aligned so the secondary can absorb the full workload if it's promoted.

> [!NOTE]
> The secondary doesn't serve read-only queries or process business requests before promotion. Every data-plane business call to it - including orchestration, entity, and task hub operations - returns `HTTP 503 Service Unavailable`. Validate the full workload through a planned failover.

## Perform a failover

Planned and forced failover are two different operations, and they're alternatives - not steps you perform in sequence. Both target the scheduler that is currently the **secondary** (`currentSecondaryId`).

### Perform a planned failover

Use a planned failover when both schedulers are healthy and reachable, for example to validate your runbook or to move traffic ahead of scheduled maintenance. A planned failover stops new data-plane traffic on the current primary, performs a planned transition of the underlying database, promotes the secondary, and reverses the primary/secondary roles. It doesn't drain or wait for orchestrations that are already running. Send the request without a request body:

```azurecli
az rest --method post \
  --uri "https://management.azure.com${currentSecondaryId}/failoverInstances/default/failover?api-version=${apiVersion}"
```

Replicated orchestration and entity state can resume on the newly promoted primary once your clients and workers target its endpoint.

### Perform a forced failover

Use a forced failover only when the current primary is unreachable and a planned failover isn't possible. Send this action without a request body:

```azurecli
az rest --method post \
  --uri "https://management.azure.com${currentSecondaryId}/failoverInstances/default/forceFailoverAllowDataLoss?api-version=${apiVersion}"
```

Because the primary is unreachable, any data that didn't already replicate before the outage isn't available after the failover. The promotion is asynchronous; check its completion the same way as shown in [Confirm the failover completed](#confirm-the-failover-completed).

If a forced failover request returns `409 OperationPending`, check `provisioningState`, `failoverState`, and `replicationRole`. The scheduler might already be the primary while recovery steps are still pending. Don't reissue a forced failover. If the operation reports failure or can't complete, contact Azure support.

### Confirm the failover completed

Poll the resource that is becoming the new primary and wait until the response shows **both** `replicationRole` equal to `Primary` **and** `failoverState` equal to `Succeeded` before you treat the failover as complete and redirect traffic:

```azurecli
az rest --method get \
  --uri "https://management.azure.com${currentSecondaryId}/failoverInstances/default?api-version=${apiVersion}"
```

Once the failover succeeds, update your role-tracking variables so later commands target the correct scheduler:

```azurecli
tmp=$currentPrimaryId
currentPrimaryId=$currentSecondaryId
currentSecondaryId=$tmp
```

## Redirect your app

Disaster recovery doesn't provide a shared or floating endpoint. After you confirm the failover succeeded, update the scheduler endpoint used by both your clients and your workers to point at the new primary (`currentPrimaryId`). Ensure your client and worker identities have the role assignments and network access they need on the new primary. For supported authentication and RBAC patterns, see [Configure managed identity for Durable Task Scheduler](durable-task-scheduler-identity.md).

## Fail back

Disaster recovery doesn't fail back automatically. Updates to the former primary are best-effort while its region is unavailable, so before you fail back:

1. Confirm the former primary's region is healthy and reachable.
2. Poll its `failoverInstances/default` resource and verify `replicationRole` reports `Secondary`.

Once you verify both, fail back the same way you performed the original failover:

1. Trigger a [planned failover](#perform-a-planned-failover) targeting the current secondary (the former primary).
2. [Confirm the failover completed](#confirm-the-failover-completed) and update your `currentPrimaryId`/`currentSecondaryId` variables.
3. [Redirect your clients and workers](#redirect-your-app) to the new primary's endpoint.

## Stop disaster recovery

To stop replication while keeping both schedulers, disable disaster recovery on the current primary scheduler:

```azurecli
az rest --method delete \
  --uri "https://management.azure.com${currentPrimaryId}/failoverInstances/default?api-version=${apiVersion}"
```

Run the delete against whichever scheduler is the **current primary** - deleting the failover resource on the secondary while the pairing is active isn't allowed.

This operation is asynchronous. It cleans up the failover relationship on both schedulers and returns the formerly secondary scheduler to normal standalone operation. If the partner region is unavailable when you disable, you might need to complete cleanup on the partner after the region recovers.

## Related content

* [Disaster recovery in Durable Task Scheduler](disaster-recovery.md)
