---
title: "Using low priority VMs in batch deployments"
titleSuffix: Azure Machine Learning
description: Learn how to use low priority VMs to save costs when running batch jobs.
services: machine-learning
ms.service: machine-learning
ms.subservice: inferencing
ms.topic: how-to
author: santiagxf
ms.author: fasantia
ms.date: 10/10/2022
ms.reviewer: mopeakande 
ms.custom: devplatv2
---

# Using low priority VMs in batch deployments

[!INCLUDE [cli v2](includes/machine-learning-dev-v2.md)]

Azure Batch Deployments supports low priority VMs to reduce the cost of batch inference workloads. Low priority VMs enable a large amount of compute power to be used for a low cost. Low priority VMs take advantage of surplus capacity in Azure. When you specify low priority VMs in your pools, Azure can use this surplus, when available.

The tradeoff for using them is that those VMs may not always be available to be allocated, or may be preempted at any time, depending on available capacity. For this reason, __they are most suitable for batch and asynchronous processing workloads__ where the job completion time is flexible and the work is distributed across many VMs.

Low priority VMs are offered at a significantly reduced price compared with dedicated VMs. For pricing details, see [Azure Machine Learning pricing](https://azure.microsoft.com/pricing/details/machine-learning/).

## How batch deployment works with low priority VMs

Azure Machine Learning Batch Deployments provides several capabilities that make it easy to consume and benefit from low priority VMs:

- Batch deployment jobs consume low priority VMs by running on Azure Machine Learning compute clusters created with low priority VMs. Once a deployment is associated with a low priority VMs' cluster, all the jobs produced by such deployment will use low priority VMs. Per-job configuration is not possible.
- Batch deployment jobs automatically seek the target number of VMs in the available compute cluster based on the number of tasks to submit. If VMs are preempted or unavailable, batch deployment jobs attempt to replace the lost capacity by queuing the failed tasks to the cluster.
- Low priority VMs have a separate vCPU quota that differs from the one for dedicated VMs. Low-priority cores per region have a default limit of 100 to 3,000, depending on your subscription offer type. The number of low-priority cores per subscription can be increased and is a single value across VM families. See [Azure Machine Learning compute quotas](how-to-manage-quotas.md#azure-machine-learning-compute).

## Considerations and use cases

Many batch workloads are a good fit for low priority VMs. Although this may introduce further execution delays when deallocation of VMs occurs, the potential drops in capacity can be tolerated at expenses of running with a lower cost if there is flexibility in the time jobs have to complete. 

When **deploying models** under batch endpoints, rescheduling can be done at the mini batch level. That has the extra benefit that deallocation only impacts those mini-batches that are currently being processed and not finished on the affected node. Every completed progress is kept.

## Creating batch deployments with low priority VMs

Batch deployment jobs consume low priority VMs by running on Azure Machine Learning compute clusters created with low priority VMs. 

> [!NOTE] 
> Once a deployment is associated with a low priority VMs' cluster, all the jobs produced by such deployment will use low priority VMs. Per-job configuration is not possible.

You can create a low priority Azure Machine Learning compute cluster as follows:

   # [Azure CLI](#tab/cli)
   
   Create a compute definition `YAML` like the following one:
   
   __low-pri-cluster.yml__
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
   
Once you have the new compute created, you can create or update your deployment to use the new cluster:

   # [Azure CLI](#tab/cli)
   
   To create or update a deployment under the new compute cluster, create a `YAML` configuration like the following:
   
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

To view these metrics in the Azure portal

1. Navigate to your Azure Machine Learning workspace in the [Azure portal](https://portal.azure.com).
2. Select **Metrics** from the **Monitoring** section.
3. Select the metrics you desire from the **Metric** list.

:::image type="content" source="./media/how-to-use-low-priority-batch/metrics.png" alt-text="Screenshot of the metrics section in the resource monitoring blade showing the relevant metrics for low priority VMs.":::

## Limitations

- Once a deployment is associated with a low priority VMs' cluster, all the jobs produced by such deployment will use low priority VMs. Per-job configuration is not possible.
- Rescheduling is done at the mini-batch level, regardless of the progress. No checkpointing capability is provided.

> [!WARNING]
> In the cases where the entire cluster is preempted (or running on a single-node cluster), the job will be cancelled as there is no capacity available for it to run. Resubmitting will be required in this case. 


