---
author: hhunter-ms
ms.author: hannahhunter
title: "Configure Autoscaling for Durable Task SDK in Azure Container Apps"
titleSuffix: Durable Task
description: Learn how to configure autoscaling for Durable Task Scheduler apps in Azure Container Apps. Set replica ranges and scale rules to handle workload spikes automatically.
ms.subservice: durable-task-sdks
ms.topic: how-to
ms.service: durable-task
ms.date: 04/30/2026
---

# Configure autoscaling for Durable Task SDK apps in Azure Container Apps

When you host Durable Task SDK apps in Azure Container Apps, you can configure autoscaling so the platform automatically adjusts the number of replicas based on your orchestration, activity, or entity workload.

In this article, you learn how to:

> [!div class="checklist"]
> - Set minimum and maximum replica counts for your container app.
> - Add scale rules that respond to Durable Task Scheduler work items.
> - Deploy and verify an autoscaling sample using Azure Developer CLI.

> [!NOTE]
> Autoscaling is supported for apps built using the Durable Task SDKs and hosted in Azure Container Apps. This feature uses the `azure-durabletask-scheduler` KEDA scaler.

> [!IMPORTANT]
> Setting `minReplicas` to `0` enables scale-to-zero, which saves costs when idle but introduces cold-start latency when new work items arrive. Set `minReplicas` to `1` or higher if your workload is latency-sensitive.

## Configure the autoscaler

You can set the autoscaler configuration via the Azure portal, a Bicep template, and the Azure CLI. 

# [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), navigate to your container app.

1. From the left side menu, select **Application** > **Scale**.

1. Set the **Min replicas** and **Max replicas** values for your revision.

   :::image type="content" source="../scheduler/media/durable-task-scheduler-auto-scaling-aca/scaler-configuration.png" alt-text="Screenshot of the scaler min and max replica configuration in the Azure portal.":::

1. Select **Add** to create a new scale rule. Set the **Type** to **Custom** and configure the Durable Task Scheduler fields.

   :::image type="content" source="../scheduler/media/durable-task-scheduler-auto-scaling-aca/scaler-configuration-details.png" alt-text="Screenshot of the Durable Task Scheduler-related configuration for the scaler in the Azure portal.":::

1. Ensure the **Authenticate with a Managed Identity** checkbox is selected and choose the identity linked to your scheduler and task hub resource.

1. Select **Save**.

| Field | Description | Example |
| ----- | ----------- | ------- |
| Min replicas | Minimum number of replicas allowed for the container revision at any given time. | `1` |
| Max replicas | Maximum number of replicas allowed for the container revision at any given time. | `10` |
| endpoint | The Durable Task Scheduler endpoint that the scaler connects to. | `https://dts-ID.centralus.durabletask.io` |
| maxConcurrentWorkItemsCount | Maximum number of work items a single replica processes concurrently. Lower values cause the scaler to add replicas sooner. Start with `1` for CPU-intensive work; increase for I/O-bound workloads. | `1` |
| taskhubName | The name of the task hub connected to the scheduler. | `taskhub-ID` |
| workItemType | The work item type that is being dispatched. Options include `Orchestration`, `Activity`, or `Entity`. | `Orchestration` |
| Managed identity | The user-assigned or system-assigned managed identity linked to the scheduler and task hub resource. | `/subscriptions/<SUB_ID>/resourceGroups/<RG>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<IDENTITY_NAME>` |

# [Bicep](#tab/bicep)

```bicep
scale: {
  minReplicas: containerMinReplicas
  maxReplicas: containerMaxReplicas
  rules: [
    {
      name: 'dts-scaler-orchestration'
      custom: {
        type: 'azure-durabletask-scheduler'
        metadata: {
          endpoint: dtsEndpoint
          maxConcurrentWorkItemsCount: '1'
          taskhubName: taskHubName
          workItemType: 'Orchestration'
        }
        identity: scaleRuleIdentity
      }
    }
  ]
}
```

| Field | Description | Example |
| ----- | ----------- | ------- |
| `minReplicas` | Minimum number of replicas allowed for the container revision at any given time. | `1` |
| `maxReplicas` | Maximum number of replicas allowed for the container revision at any given time. | `10` |
| `endpoint` | The Durable Task Scheduler endpoint that the scaler connects to. | `https://dts-ID.centralus.durabletask.io` |
| `maxConcurrentWorkItemsCount` | Maximum number of work items a single replica processes concurrently. Lower values cause the scaler to add replicas sooner. Start with `1` for CPU-intensive work; increase for I/O-bound workloads. | `1` |
| `taskhubName` | The name of the task hub connected to the scheduler. | `myTaskHubName` |
| `workItemType` | The work item type that is being dispatched. Options include `Orchestration`, `Activity`, or `Entity`. | `Orchestration` |
| `identity` | The resource ID of the user-assigned or system-assigned managed identity linked to the scheduler and task hub resource. | `/subscriptions/<SUB_ID>/resourceGroups/<RG>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<IDENTITY_NAME>` |

### Add multiple scale rules

You can define separate scale rules for different work item types. For example, to scale independently for both orchestrations and activities:

```bicep
scale: {
  minReplicas: containerMinReplicas
  maxReplicas: containerMaxReplicas
  rules: [
    {
      name: 'dts-scaler-orchestration'
      custom: {
        type: 'azure-durabletask-scheduler'
        metadata: {
          endpoint: dtsEndpoint
          maxConcurrentWorkItemsCount: '1'
          taskhubName: taskHubName
          workItemType: 'Orchestration'
        }
        identity: scaleRuleIdentity
      }
    }
    {
      name: 'dts-scaler-activity'
      custom: {
        type: 'azure-durabletask-scheduler'
        metadata: {
          endpoint: dtsEndpoint
          maxConcurrentWorkItemsCount: '5'
          taskhubName: taskHubName
          workItemType: 'Activity'
        }
        identity: scaleRuleIdentity
      }
    }
  ]
}
```

> [!TIP]
> Use a higher `maxConcurrentWorkItemsCount` for I/O-bound activities (like HTTP calls) and a lower value for CPU-intensive orchestrations.

# [Azure CLI](#tab/cli)

```azurecli
az containerapp create \
  --resource-group <RESOURCE_GROUP> \
  --name <APP_NAME> \
  --environment <ENVIRONMENT_ID> \
  --user-assigned <USER_ASSIGNED_IDENTITY_ID> \
  --min-replicas 1 \
  --max-replicas 10 \
  --scale-rule-name dtsscaler-orchestration \
  --scale-rule-type azure-durabletask-scheduler \
  --scale-rule-metadata "endpoint=<DTS-ENDPOINT>" "maxConcurrentWorkItemsCount=1" "taskhubName=<TASKHUB-NAME>" "workItemType=Orchestration" \
  --scale-rule-identity <USER_ASSIGNED_IDENTITY_ID>
```

| Field | Description | Example |
| ----- | ----------- | ------- |
| `--min-replicas` | Minimum number of replicas allowed for the container revision at any given time. | `1` |
| `--max-replicas` | Maximum number of replicas allowed for the container revision at any given time. | `10` |
| `endpoint` | The Durable Task Scheduler endpoint that the scaler connects to. | `https://dts-ID.centralus.durabletask.io` |
| `maxConcurrentWorkItemsCount` | Maximum number of work items a single replica processes concurrently. Lower values cause the scaler to add replicas sooner. Start with `1` for CPU-intensive work; increase for I/O-bound workloads. | `1` |
| `taskhubName` | The name of the task hub connected to the scheduler. | `myTaskHubName` |
| `workItemType` | The work item type that is being dispatched. Options include `Orchestration`, `Activity`, or `Entity`. | `Orchestration` |
| `--scale-rule-identity` | The resource ID of the user-assigned or system-assigned managed identity linked to the scheduler and task hub resource. | `/subscriptions/<SUB_ID>/resourceGroups/<RG>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<IDENTITY_NAME>` |

---

## Tutorial: Deploy an autoscaling container app

Already configured autoscaling on an existing app? You can skip this section. If you want a hands-on walkthrough, follow the steps below to deploy the [Autoscaling in Azure Container Apps sample](https://github.com/Azure-Samples/Durable-Task-Scheduler/tree/main/samples/scenarios/AutoscalingInACA) using Azure Developer CLI. The sample deploys a .NET Durable Task SDK app that uses the function chaining pattern and includes a pre-configured KEDA scaler.

> [!NOTE]
> Although this sample uses the Durable Task .NET SDK, autoscaling is language-agnostic.

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) or later
- [Docker](https://www.docker.com/products/docker-desktop/) (for building the image)
- [Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd)

### Set up your environment

1. Clone the `Azure-Samples/Durable-Task-Scheduler` directory.

   ```bash
   git clone https://github.com/Azure-Samples/Durable-Task-Scheduler.git
   ```   

1. Authenticate with Azure using the Azure Developer CLI.

   ```azdeveloper
   azd auth login
   ```

### Deploy the solution using Azure Developer CLI

1. Navigate into the `AutoscalingInACA` sample directory.

   ```azdeveloper
   cd /path/to/Durable-Task-Scheduler/samples/scenarios/AutoscalingInACA
   ```

1. Initialize the Azure Developer CLI environment (only required the first time):

   ```azdeveloper
   azd init
   ```

1. Provision resources and deploy the application:

   ```azdeveloper
   azd up
   ```

1. When prompted in the terminal, provide the following parameters.

   | Parameter | Description |
   | --------- | ----------- |
   | Environment Name | Prefix for the resource group created to hold all Azure resources. |
   | Azure Location | The Azure location for your resources. |
   | Azure Subscription | The Azure subscription for your resources. |

   This process may take some time to complete. As the `azd up` command completes, the CLI output displays two Azure portal links to monitor the deployment progress. The output also demonstrates how `azd up`:

   - Creates and configures all necessary Azure resources via the provided Bicep files in the `./infra` directory using `azd provision`. Once provisioned by Azure Developer CLI, you can access these resources via the Azure portal. The files that provision the Azure resources include:
     - `main.parameters.json`
     - `main.bicep`
     - An `app` resources directory organized by functionality
     - A `core` reference library that contains the Bicep modules used by the `azd` template
   - Deploys the code using `azd deploy`

   **Expected output**

   ```azdeveloper
   Packaging services (azd package)

   (✓) Done: Packaging service client
   - Image Hash: {IMAGE_HASH}
   - Target Image: {TARGET_IMAGE}


   (✓) Done: Packaging service worker
   - Image Hash: {IMAGE_HASH}
   - Target Image: {TARGET_IMAGE}


   Provisioning Azure resources (azd provision)
   Provisioning Azure resources can take some time.

   Subscription: SUBSCRIPTION_NAME (SUBSCRIPTION_ID)
   Location: West US 2

    You can view detailed progress in the Azure portal:
    https://portal.azure.com/#view/HubsExtension/DeploymentDetailsBlade/~/overview/id/%2Fsubscriptions%SUBSCRIPTION_ID%2Fproviders%2FMicrosoft.Resources%2Fdeployments%2FCONTAINER_APP_ENVIRONMENT

    (✓) Done: Resource group: GENERATED_RESOURCE_GROUP (1.385s)
    (✓) Done: Virtual Network: VNET_ID (862ms)
    (✓) Done: Container Apps Environment: GENERATED_CONTAINER_APP_ENVIRONMENT (54.125s)
    (✓) Done: Container Registry: GENERATED_REGISTRY (1m27.747s)
    (✓) Done: Container App: SAMPLE_CLIENT_APP (21.39s)
    (✓) Done: Container App: SAMPLE_WORKER_APP (24.136s)   
   
   Deploying services (azd deploy)

    (✓) Done: Deploying service client
    - Endpoint: https://SAMPLE_CLIENT_APP.westus2.azurecontainerapps.io/

    (✓) Done: Deploying service worker
    - Endpoint: https://SAMPLE_WORKER_APP.westus2.azurecontainerapps.io/


   SUCCESS: Your up workflow to provision and deploy to Azure completed in 10 minutes 34 seconds.   
   ```

### Confirm successful deployment 

In the Azure portal, verify the orchestrations are running successfully. 

1. Copy the resource group name from the terminal output.

1. Sign in to the [Azure portal](https://portal.azure.com) and search for that resource group name.

1. From the resource group overview page, click on the client container app resource.

1. Select **Monitoring** > **Log stream**.

1. Confirm the client container is logging the function chaining tasks.

   :::image type="content" source="../scheduler/media/durable-task-scheduler-auto-scaling-aca/client-app-log-stream.png" alt-text="Screenshot of the client container's log stream in the Azure portal.":::

1. Navigate back to the resource group page to select the `worker` container. 

1. Select **Monitoring** > **Log stream**.

1. Confirm the worker container is logging the function chaining tasks.

   :::image type="content" source="../scheduler/media/durable-task-scheduler-auto-scaling-aca/worker-app-log-stream.png" alt-text="Screenshot of the worker container's log stream in the Azure portal.":::

### Understand the custom scaler

This sample includes an `azure.yaml` configuration file.  When you ran `azd up`, you deployed the entire sample solution to Azure, including a custom scaler for your container apps that automatically scales based on the Durable Task Scheduler's workload.

The custom scaler: 

- Monitors the number of pending orchestrations in the task hub.
- Scales the number of worker replicas up with increased workload.
- Scales back down when the load decreases.
- Provides efficient resource utilization by matching capacity to demand.

### Verify the scaler configuration

Verify the autoscaling is functioning correctly in the deployed solution.

1. In the Azure portal, navigate to your worker app.

1. From the left side menu, select **Application** > **Revisions and replicas**.

1. Select the **Replicas** tab to verify your application is scaling out.

   :::image type="content" source="../scheduler/media/durable-task-scheduler-auto-scaling-aca/revision-management-page.png" alt-text="Screenshot of the Revisions and replicas page showing scaled replicas in the Azure portal.":::

1. From the left side menu, select **Application** > **Scale**.

1. Select the scale rule name to view the scaler settings.

## Related content

- [Durable Task Scheduler overview](../scheduler/durable-task-scheduler.md)
- [Quickstart: Deploy a Durable Task SDK app to Azure Container Apps](quickstart-container-apps-durable-task-sdk.md)
- [Set scaling rules in Azure Container Apps](/azure/container-apps/scale-app)
- [Host a Durable Functions app with MSSQL backend in Azure Container Apps](../../azure-functions/durable-functions/durable-functions-mssql-container-apps-hosting.md)