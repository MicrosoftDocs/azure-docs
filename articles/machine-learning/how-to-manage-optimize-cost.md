---
title: Manage and optimize costs
titleSuffix: Azure Machine Learning
description: Learn tips to optimize your cost when building machine learning models in Azure Machine Learning
ms.reviewer: ssalgado
author: joburges
ms.author: joburges
ms.custom: subject-cost-optimization, event-tier1-build-2022
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.date: 08/01/2023
---

# Manage and optimize Azure Machine Learning costs

Learn how to manage and optimize costs when training and deploying machine learning models to Azure Machine Learning.

Use the following tips to help you manage and optimize your compute resource costs.

- Configure your training clusters for autoscaling
- Set quotas on your subscription and workspaces
- Set termination policies on your training job
- Use low-priority virtual machines (VM)
- Schedule compute instances to shut down and start up automatically
- Use an Azure Reserved VM Instance
- Train locally
- Parallelize training
- Set data retention and deletion policies
- Deploy resources to the same region

For information on planning and monitoring costs, see the [plan to manage costs for Azure Machine Learning](concept-plan-manage-cost.md) guide.

> [!IMPORTANT]
> Items marked (preview) in this article are currently in public preview.
> The preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Use Azure Machine Learning compute cluster (AmlCompute)

With constantly changing data, you need fast and streamlined model training and retraining to maintain accurate models. However, continuous training comes at a cost, especially for deep learning models on GPUs. 

Azure Machine Learning users can use the managed Azure Machine Learning compute cluster, also called AmlCompute. AmlCompute supports various GPU and CPU options. The AmlCompute is internally hosted on behalf of your subscription by Azure Machine Learning. It provides the same enterprise grade security, compliance and governance at Azure IaaS cloud scale.

Because these compute pools are inside of Azure's IaaS infrastructure, you can deploy, scale, and manage your training with the same security and compliance requirements as the rest of your infrastructure.  These deployments occur in your subscription and obey your governance rules. Learn more about [Azure Machine Learning compute](how-to-create-attach-compute-cluster.md).

## Configure training clusters for autoscaling

Autoscaling clusters based on the requirements of your workload helps reduce your costs so you only use what you need.

AmlCompute clusters are designed to scale dynamically based on your workload. The cluster can be scaled up to the maximum number of nodes you configure. As each job completes, the cluster releases nodes and scale to your configured minimum node count.

[!INCLUDE [min-nodes-note](includes/machine-learning-min-nodes.md)]

You can also configure the amount of time the node is idle before scale down. By default, idle time before scale down is set to 120 seconds.

+ If you perform less iterative experimentation, reduce this time to save costs.
+ If you perform highly iterative dev/test experimentation, you might need to increase the time so you aren't paying for constant scaling up and down after each change to your training script or environment.

AmlCompute clusters can be configured for your changing workload requirements in Azure portal, using the [AmlCompute SDK class](/python/api/azure-ai-ml/azure.ai.ml.entities.amlcompute), [AmlCompute CLI](/cli/azure/ml/compute#az-ml-compute-create), with the [REST APIs](https://github.com/Azure/azure-rest-api-specs/tree/master/specification/machinelearningservices/resource-manager/Microsoft.MachineLearningServices/stable).


## Set quotas on resources

AmlCompute comes with a [quota (or limit) configuration](how-to-manage-quotas.md#azure-machine-learning-compute). This quota is by VM family (for example, Dv2 series, NCv3 series) and varies by region for each subscription. Subscriptions start with small defaults to get you going, but use this setting to control the amount of Amlcompute resources available to be spun up in your subscription. 

Also configure [workspace level quota by VM family](how-to-manage-quotas.md#workspace-level-quotas), for each workspace within a subscription. Doing so allows you to have more granular control on the costs that each workspace might potentially incur and restrict certain VM families. 

To set quotas at the workspace level, start in the [Azure portal](https://portal.azure.com).  Select any workspace in your subscription, and select **Usages + quotas** in the left pane. Then select the **Configure quotas** tab to view the quotas. You need privileges at the subscription scope to set the quota, since it's a setting that affects multiple workspaces.

## Set job autotermination policies 

In some cases, you should configure your training runs to limit their duration or terminate them early. For example, when you're using Azure Machine Learning's built-in hyperparameter tuning or automated machine learning.

Here are a few options that you have:
* Define a parameter called `max_run_duration_seconds` in your RunConfiguration to control the maximum duration a run can extend to on the compute you choose (either local or remote cloud compute).
* For [hyperparameter tuning](how-to-tune-hyperparameters.md#early-termination), define an early termination policy from a Bandit policy, a Median stopping policy, or a Truncation selection policy. To further control hyperparameter sweeps, use parameters such as `max_total_runs` or `max_duration_minutes`.
* For [automated machine learning](how-to-configure-auto-train.md#exit-criteria), set similar termination policies using the  `enable_early_stopping` flag. Also use properties such as `iteration_timeout_minutes` and `experiment_timeout_minutes` to control the maximum duration of a job or for the entire experiment.

## <a id="low-pri-vm"></a> Use low-priority VMs

Azure allows you to use excess unutilized capacity as Low-Priority VMs across virtual machine scale sets, Batch, and the Machine Learning service. These allocations are pre-emptible but come at a reduced price compared to dedicated VMs. In general, we recommend using Low-Priority VMs for Batch workloads. You should also use them where interruptions are recoverable either through resubmits (for Batch Inferencing) or through restarts (for deep learning training with checkpointing).

Low-Priority VMs have a single quota separate from the dedicated quota value, which is by VM family. Learn [more about AmlCompute quotas](how-to-manage-quotas.md).

 Low-Priority VMs don't work for compute instances, since they need to support interactive notebook experiences.

## Schedule compute instances

When you create a [compute instance](concept-compute-instance.md), the VM stays on so it's available for your work.  
* [Enable idle shutdown (preview)](how-to-create-compute-instance.md#configure-idle-shutdown) to save on cost when the VM has been idle for a specified time period.
* Or [set up a schedule](how-to-create-compute-instance.md#schedule-automatic-start-and-stop) to automatically start and stop the compute instance (preview) to save cost when you aren't planning to use it.

## Use reserved instances

Another way to save money on compute resources is Azure Reserved VM Instance. With this offering, you commit to one-year or three-year terms. These discounts range up to 72% of the pay-as-you-go prices and are applied directly to your monthly Azure bill.

Azure Machine Learning Compute supports reserved instances inherently. If you purchase a one-year or three-year reserved instance, we'll automatically apply discount against your Azure Machine Learning managed compute.

## Parallelize training

One of the key methods of optimizing cost and performance is by parallelizing the workload with the help of a parallel component in Azure Machine Learning. A parallel component allows you to use many smaller nodes to execute the task in parallel, hence allowing you to scale horizontally. There's an overhead for parallelization. Depending on the workload and the degree of parallelism that can be achieved, this may or may not be an option. For more details, follow this link for [ParallelComponent](/python/api/azure-ai-ml/azure.ai.ml.entities.parallelcomponent) documentation.

## Set data retention & deletion policies

Every time a pipeline is executed, intermediate datasets are generated at each step. Over time, these intermediate datasets take up space in your storage account. Consider setting up policies to manage your data throughout its lifecycle to archive and delete your datasets. For more information, see [optimize costs by automating Azure Blob Storage access tiers](../storage/blobs/lifecycle-management-overview.md).

## Deploy resources to the same region

Computes located in different regions may experience network latency and increased data transfer costs. Azure network costs are incurred from outbound bandwidth from Azure data centers. To help reduce network costs, deploy all your resources in the region. Provisioning your Azure Machine Learning workspace and dependent resources in the same region as your data can help lower cost and improve performance.

For hybrid cloud scenarios like those using ExpressRoute, it can sometimes be more cost effective to move all resources to Azure to optimize network costs and latency.

## Next steps

- [Plan to manage costs for Azure Machine Learning](concept-plan-manage-cost.md)
- [Manage budgets, costs, and quota for Azure Machine Learning at organizational scale](/azure/cloud-adoption-framework/ready/azure-best-practices/optimize-ai-machine-learning-cost)
