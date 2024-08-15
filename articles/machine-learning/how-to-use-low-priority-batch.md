---
title: "Using low priority VMs in batch deployments"
titleSuffix: Azure Machine Learning
description: Learn how to use low priority VMs in Azure Machine Learning to save costs when you run batch inference jobs.
services: machine-learning
ms.service: azure-machine-learning
ms.subservice: inferencing
ms.topic: how-to
author: msakande
ms.author: mopeakande
ms.date: 08/15/2024
ms.reviewer: cacrest
ms.custom: devplatv2
#customer intent: As an analyst, I want to run batch inference workloads in the most cost efficient way possible.
---

# Use low priority VMs for batch deployments

[!INCLUDE [cli v2](includes/machine-learning-dev-v2.md)]

Azure Batch Deployments supports low priority virtual machines (VMs) to reduce the cost of batch inference workloads. Low priority virtual machines enable a large amount of compute power to be used for a low cost. Low priority virtual machines take advantage of surplus capacity in Azure. When you specify low priority VMs in your pools, Azure can use this surplus, when available.

> [!TIP]
> The tradeoff for using low priority VMs is that those virtual machines might not be available or they might be preempted at any time, depending on available capacity. For this reason, this approach is most suitable for batch and asynchronous processing workloads, where job completion time is flexible and the work is distributed across many virtual machines.

Low priority virtual machines are offered at a reduced price compared with dedicated virtual machines. For pricing details, see [Azure Machine Learning pricing](https://azure.microsoft.com/pricing/details/machine-learning/).

## How batch deployment works with low priority VMs

Azure Machine Learning Batch Deployments provides several capabilities that make it easy to consume and benefit from low priority VMs:

- Batch deployment jobs consume low priority VMs by running on Azure Machine Learning compute clusters created with low priority VMs. After a deployment is associated with a low priority VMs cluster, all the jobs produced by such deployment use low priority VMs. Per-job configuration isn't possible.
- Batch deployment jobs automatically seek the target number of VMs in the available compute cluster based on the number of tasks to submit. If VMs are preempted or unavailable, batch deployment jobs attempt to replace the lost capacity by queuing the failed tasks to the cluster.
- Low priority VMs have a separate vCPU quota that differs from the one for dedicated VMs. Low-priority cores per region have a default limit of 100 to 3,000, depending on your subscription. The number of low-priority cores per subscription can be increased and is a single value across VM families. See [Azure Machine Learning compute quotas](how-to-manage-quotas.md#azure-machine-learning-compute).

### Considerations and use cases

Many batch workloads are a good fit for low priority VMs. Using low priority VMs can introduce execution delays when deallocation of VMs occurs. If you have flexibility in the time jobs have to finish, you might tolerate the potential drops in capacity.

When you deploy models under batch endpoints, rescheduling can be done at the minibatch level. That approach has the benefit that deallocation only impacts those minibatches that are currently being processed and not finished on the affected node. All completed progress is kept.

### Limitations

- After a deployment is associated with a low priority VMs cluster, all the jobs produced by such deployment use low priority VMs. Per-job configuration isn't possible.
- Rescheduling is done at the mini-batch level, regardless of the progress. No checkpointing capability is provided.

> [!WARNING]
> In the cases where the entire cluster is preempted or running on a single-node cluster, the job is cancelled because there is no capacity available for it to run. Resubmitting is required in this case.

## Create batch deployments that use low priority VMs

Batch deployment jobs consume low priority VMs by running on Azure Machine Learning compute clusters created with low priority VMs.

> [!NOTE]
> After a deployment is associated with a low priority VMs cluster, all the jobs produced by such deployment use low priority VMs. Per-job configuration is not possible.

You can create a low priority Azure Machine Learning compute cluster as follows:

# [Azure CLI](#tab/cli)

Create a compute definition `YAML` like the following one, *low-pri-cluster.yml*:

```yaml
$schema: https://azuremlschemas.azureedge.net/latest/amlCompute.schema.json 
name: low-pri-cluster
type: amlcompute
size: STANDARD_DS3_v2
min_instances: 0
max_instances: 2
idle_time_before_scale_down: 120
tier: low_priority
```

Create the compute using the following command:

```azurecli
az ml compute create -f low-pri-cluster.yml
```

# [Python](#tab/sdk)

To create a new compute cluster with low priority VMs where to create the deployment, use the following script:

```python
compute_name = "low-pri-cluster"
compute_cluster = AmlCompute(
   name=compute_name, 
   description="Low priority compute cluster", 
   min_instances=0, 
   max_instances=2,
   tier='LowPriority'
)

ml_client.begin_create_or_update(compute_cluster)
```

---

After you create the new compute, you can create or update your deployment to use the new cluster:

# [Azure CLI](#tab/cli)

To create or update a deployment under the new compute cluster, create a `YAML` configuration file, *endpoint.yml*:

```yaml
$schema: https://azuremlschemas.azureedge.net/latest/batchDeployment.schema.json
endpoint_name: heart-classifier-batch
name: classifier-xgboost
description: A heart condition classifier based on XGBoost
type: model
model: azureml:heart-classifier@latest
compute: azureml:low-pri-cluster
resources:
  instance_count: 2
settings:
  max_concurrency_per_instance: 2
  mini_batch_size: 2
  output_action: append_row
  output_file_name: predictions.csv
  retry_settings:
    max_retries: 3
    timeout: 300
```

Then, create the deployment with the following command:

```azurecli
az ml batch-endpoint create -f endpoint.yml
```

# [Python](#tab/sdk)

To create or update a deployment under the new compute cluster, use the following script:

```python
deployment = ModelBatchDeployment(
    name="classifier-xgboost",
    description="A heart condition classifier based on XGBoost",
    endpoint_name=endpoint.name,
    model=model,
    compute=compute_name,
    settings=ModelBatchDeploymentSettings(
      instance_count=2,
      max_concurrency_per_instance=2,
      mini_batch_size=2,
      output_action=BatchDeploymentOutputAction.APPEND_ROW,
      output_file_name="predictions.csv",
      retry_settings=BatchRetrySettings(max_retries=3, timeout=300),
   )
)

ml_client.batch_deployments.begin_create_or_update(deployment)
```

---

## View and monitor node deallocation

New metrics are available in the [Azure portal](https://portal.azure.com) for low priority VMs to monitor low priority VMs. These metrics are:

- Preempted nodes
- Preempted cores

To view these metrics in the Azure portal:

1. Navigate to your Azure Machine Learning workspace in the [Azure portal](https://portal.azure.com).
1. Select **Metrics** from the **Monitoring** section.
1. Select the metrics you desire from the **Metric** list.

:::image type="content" source="./media/how-to-use-low-priority-batch/metrics.png" lightbox="./media/how-to-use-low-priority-batch/metrics.png" alt-text="Screenshot of the metrics section in the resource monitoring pane that shows the relevant metrics for low priority VMs.":::

## Related content

- [Create an Azure Machine Learning compute cluster](how-to-create-attach-compute-cluster.md)
- [Deploy MLflow models in batch deployments](how-to-mlflow-batch.md)
- [Manage compute resources for model training](how-to-create-attach-compute-studio.md)
