---
title: "Configure autoscaling for Durable Task SDK app hosted in Azure Container Apps (preview)"
description: Learn how to implement autoscaling with the Durable Task Scheduler using the Durable Task .NET SDK in Azure Container Apps.
ms.subservice: durable-task-scheduler
ms.topic: how-to
ms.date: 05/06/2025
---

# Configure autoscaling for Durable Task SDK app hosted in Azure Container Apps (preview)

You can implement autoscaling in container apps that use the Durable Task Scheduler. Autoscaling maintains the reliability and scalability of long-running workflows by adapting to changing demands without manual intervention. 

Control autoscaling by setting the range of application replicas deployed in response to an orchestration, activity, or entity being triggered. The scaler dynamically adjusts the number of container app replicas within that range, allowing your solution to handle spikes in the workload and prevent resource exhaustion. 

> [!NOTE]
> Autoscaling is supported for apps built using the Durable Task SDKs and hosted in Azure Container Apps.

## Configure the autoscaler

You can set the autoscaler configuration via the Azure portal, a Bicep template, and the Azure CLI. 

# [Azure portal](#tab/portal)

:::image type="content" source="media/durable-task-scheduler-auto-scaling-aca/scaler-configuration.png" alt-text="Screenshot of the scaler min and max replica configuration in the Azure portal.":::

:::image type="content" source="media/durable-task-scheduler-auto-scaling-aca/scaler-configuration-details.png" alt-text="Screenshot of the Durable Task Scheduler-related configuration for the scaler in the Azure portal.":::

| Field | Description | Example |
| ----- | ----------- | ------- |
| Min replicas | Minimum number of replicas allowed for the container revision at any given time. | 1 |
| Max replicas | Maximum number of replicas allowed for the container revision at any given time. | 10 |
| endpoint | The Durable Task Scheduler endpoint that the scaler connects to. | `https://dts-ID.centralus.durabletask.io` |
| maxConcurrentWorkItemsCount | The maximum concurrent work items dispatched as an event to your compute, such as telling your compute to run an orchestration. | 1 |
| taskhubName | The name of the task hub connected to the scheduler. | taskhub-ID |
| workItemType | The work item type that is being dispatched. Options include Orchestration, Activity, or Entity. | Orchestration |
| Managed identity | The user assigned or system assigned managed identity linked to the scheduler and task hub resource. Ensure the **Authenticate with a Managed Identity** checkbox is selected. | someone@example.com |

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
| `maxConcurrentWorkItemsCount` | The maximum concurrent work items dispatched as an event to your compute, such as telling your compute to run an orchestration. | `1` |
| `taskhubName` | The name of the task hub connected to the scheduler. | `myTaskHubName` |
| `workItemType` | The work item type that is being dispatched. Options include Orchestration, Activity, or Entity. | `Orchestration` |
| `identity` | The user assigned or system assigned managed identity linked to the scheduler and task hub resource. | `someone@example.com` |


# [Azure CLI](#tab/cli)

```azurecli
az containerapp create \
  --resource-group <RESOURCE_GROUP> \
  --name <APP_NAME> \
  --environment <ENVIRONMENT_ID> \
  --user-assigned <USER_ASSIGNED_IDENTITY_ID> \
  --scale-rule-name dtsscaler-orchestration \
  --scale-rule-type azure-durabletask-scheduler \
  --scale-rule-metadata "endpoint=<DTS-ENDPOINT>" "maxConcurrentWorkItemsCount=1" "taskhubName=<TASKHUB-NAME> "workItemType=Orchestration" \
  --scale-rule-identity <USER_ASSIGNED_IDENTITY_ID>
```

| Field | Description | Example |
| ----- | ----------- | ------- |
| `minReplicas` | Minimum number of replicas allowed for the container revision at any given time. | `1` |
| `maxReplicas` | Maximum number of replicas allowed for the container revision at any given time. | `10` |
| `endpoint` | The Durable Task Scheduler endpoint that the scaler connects to. | `https://dts-ID.centralus.durabletask.io` |
| `maxConcurrentWorkItemsCount` | The maximum concurrent work items dispatched as an event to your compute, such as telling your compute to run an orchestration. | `1` |
| `taskhubName` | The name of the task hub connected to the scheduler. | `myTaskHubName` |
| `workItemType` | The work item type that is being dispatched. Options include Orchestration, Activity, or Entity. | `Orchestration` |
| `scale-rule-identity` | The user assigned or system assigned managed identity linked to the scheduler and task hub resource. | `someone@example.com` |

---

## Experiment with the sample

In the [Autoscaling in Azure Container Apps sample](https://github.com/Azure-Samples/Durable-Task-Scheduler/tree/main/samples/scenarios/AutoscalingInACA), you use the Azure Developer CLI to implement autoscaling for a container app built with the .NET Durable Task SDK and hosted in Azure Container Apps. The sample showcases an orchestration using the function chaining pattern.

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

1. Provision resources and deploy the application:

   ```azdeveloper
   azd up
   ```

1. When prompted in the terminal, provide the following parameters.

   | Parameter | Description |
   | --------- | ----------- |
   | Environment Name | Prefix for the resource group created to hold all Azure resources. |
   | Azure Location  | The Azure location for your resources. |
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

    You can view detailed progress in the Azure Portal:
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

   :::image type="content" source="media/durable-task-scheduler-auto-scaling-aca/client-app-log-stream.png" alt-text="Screenshot of the client container's log stream in the Azure portal.":::

1. Navigate back to the resource group page to select the `worker` container. 

1. Select **Monitoring** > **Log stream**.

1. Confirm the worker container is logging the function chaining tasks.

   :::image type="content" source="media/durable-task-scheduler-auto-scaling-aca/worker-app-log-stream.png" alt-text="Screenshot of the worker container's log stream in the Azure portal.":::

### Understanding the custom scaler

This sample includes an `azure.yaml` configuration file.  When you ran `azd up`, you deployed the entire sample solution to Azure, including a custom scaler for your container apps that automatically scales based on the Durable Task Scheduler's workload.

The custom scaler: 

- Monitors the number of pending orchestrations in the task hub.
- Scales the number of worker replicas up with increased workload.
- Scales back down when the load decreases.
- Provides efficient resource utilization by matching capacity to demand.

### Confirm the scaler is configured

Verify the autoscaling is functioning correctly in the deployed solution.

1. In the Azure portal, navigate to your worker app.

1. From the left side menu, click **Application** > **Revisions and replicas**.

1. Click the **Replicas** tab to verify your application is scaling out.

1. From the left side menu, click **Application** > **Scale**.

1. Click the scale name to view the scaler settings.

## Next steps

Currently, autoscaling container apps using Durable Functions for Durable Task Scheduler isn't available. In the meantime, [try autoscaling container apps using the Microsoft SQL (MSSQL) backend](../durable-functions-mssql-container-apps-hosting.md).