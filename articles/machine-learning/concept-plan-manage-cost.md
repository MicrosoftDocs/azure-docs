---
title: Plan and manage costs 
titleSuffix: Azure Machine Learning
description: Plan and manage costs for Azure Machine Learning with cost analysis in Azure portal. When you build machine learning models, learn further cost-saving tips to lower your cost. 
author: sdgilley
ms.author: sgilley
ms.custom: subject-cost-optimization
ms.reviewer: nigup
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.date: 05/08/2020
---

# Plan and manage costs for Azure Machine Learning

This article describes how to plan and manage costs for Azure Machine Learning. First, you use the Azure pricing calculator to help plan for costs before you add any resources. Next, as you add the Azure resources, review the estimated costs. Finally, use cost-saving tips as you train your model with managed Azure Machine Learning compute clusters.

After you've started using Azure Machine Learning resources, use the cost management features to set budgets and monitor costs. Also review the forecasted costs and identify spending trends to identify areas where you might want to act.

Understand that the costs for Azure Machine Learning are only a portion of the monthly costs in your Azure bill. If you are using other Azure services, you're billed for all the Azure services and resources used in your Azure subscription, including the third-party services. This article explains how to plan for and manage costs for Azure Machine Learning. After you're familiar with managing costs for Azure Machine Learning, apply similar methods to manage costs for all the Azure services used in your subscription.

When you train your machine learning models, use managed Azure Machine Learning compute clusters to take advantage of more cost-saving tips:

* Configure your training clusters for autoscaling
* Set quotas on your subscription and workspaces
* Set termination policies on your training run
* Use low-priority virtual machines (VM)
* Use an Azure Reserved VM Instance

## Prerequisites

Cost analysis supports different kinds of Azure account types. To view the full list of supported account types, see [Understand Cost Management data](../cost-management-billing/costs/understand-cost-mgt-data.md). To view cost data, you need at least read access for your Azure account. 

For information about assigning access to Azure Cost Management data, see [Assign access to data](../cost-management-billing/costs/assign-access-acm-data.md).

## Estimate costs

Use the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/) to estimate costs before you create the resources in an Azure Machine Learning account. On the left, select **AI + Machine Learning**, then select **Azure Machine Learning** to begin.  

The following screenshot shows the cost estimation by using the calculator:

:::image type="content" source="media/concept-plan-manage-cost/capacity-calculator-cost-estimate.png" alt-text="Cost estimate in Azure calculator":::

As you add new resources to your workspace, return to this calculator and add the same resource here to update your cost estimates.

While the Enterprise edition is in preview, there is no ML surcharge. When the Enterprise edition becomes generally available, it will have a surcharge (for training and inferencing).  For more information, see [Azure Machine Learning pricing](https://azure.microsoft.com/pricing/details/machine-learning/).

## Get cost alerts

Create [budgets](../cost-management/tutorial-acm-create-budgets.md) to manage costs and create [alerts](../cost-management/cost-mgt-alerts-monitor-usage-spending.md) that automatically notify stakeholders of spending anomalies and overspending risks. Alerts are based on spending compared to budget and cost thresholds. Budgets and alerts are created for Azure subscriptions and resource groups, so they're useful as part of an overall cost monitoring strategy. However, budgets and alerts may have limited functionality to manage individual Azure service costs because they're designed to track costs at a higher level.

## Monitor costs

As you use resources with Azure Machine Learning, you incur costs. Azure resource usage unit costs vary by time intervals (seconds, minutes, hours, and days) or by request unit usage. As soon as usage of Azure Machine Learning starts, costs are incurred. View these costs in the [cost analysis](../cost-management/quick-acm-cost-analysis.md) pane in the Azure portal.

You can view costs in graphs and tables for different time intervals. You can also view costs against budgets and forecasted costs. Switching to longer views over time helps identify spending trends and see where overspending might have occurred. If you've created budgets, see where they exceeded.  

You won't see a separate service area for Machine Learning.  Instead you'll see the various resources you've added to your Machine Learning workspaces.

## Use Azure Machine Learning compute cluster (AmlCompute)

With constantly changing data, you need fast and streamlined model training and retraining to maintain accurate models. However, continuous training comes at a cost, especially for deep learning models on GPUs. 

Azure Machine Learning users can use the managed Azure Machine Learning compute cluster, also called AmlCompute. AmlCompute supports a variety of GPU and CPU options. The AmlCompute is internally hosted on behalf of your subscription by Azure Machine Learning. It provides the same enterprise grade security, compliance and governance at Azure IaaS cloud scale.

Because these compute pools are inside of Azure's IaaS infrastructure, you can deploy, scale, and manage your training with the same security and compliance requirements as the rest of your infrastructure.  These deployments occur in your subscription and obey your governance rules. Learn more about [Azure Machine Learning Compute](how-to-set-up-training-targets.md#amlcompute).

## Configure training clusters for autoscaling

Autoscaling clusters based on the requirements of your workload helps reduce your costs so you only use what you need.

AmlCompute clusters are designed to scale dynamically based on your workload. The cluster can be scaled up to the maximum number of nodes you configure. As each run completes, the cluster will release nodes and scale to your configured minimum node count.

[!INCLUDE [min-nodes-note](../../includes/machine-learning-min-nodes.md)]

You can also configure the amount of time the node is idle before scale down. By default, idle time before scale down is set to 120 seconds.

+ If you perform less iterative experimentation, reduce this time to save costs. 
+ If you perform highly iterative dev/test experimentation, you might need to increase the time so you aren't paying for constant scaling up and down after each change to your training script or environment.

AmlCompute clusters can be configured for your changing workload requirements in Azure portal, using the [AmlCompute SDK class](https://docs.microsoft.com/python/api/azureml-core/azureml.core.compute.amlcompute.amlcompute?view=azure-ml-py), [AmlCompute CLI](https://docs.microsoft.com/cli/azure/ext/azure-cli-ml/ml/computetarget/create?view=azure-cli-latest#ext-azure-cli-ml-az-ml-computetarget-create-amlcompute), with the [REST APIs](https://github.com/Azure/azure-rest-api-specs/tree/master/specification/machinelearningservices/resource-manager/Microsoft.MachineLearningServices/stable).

```azure cli
az ml computetarget create amlcompute --name testcluster --vm-size Standard_NC6 --min-nodes 0 --max-nodes 5 --idle-seconds-before-scaledown 300
```

## Set quotas on resources

AmlCompute comes with a [quota (or limit) configuration](how-to-manage-quotas.md#azure-machine-learning-compute). This quota is by VM family (for example, Dv2 series, NCv3 series) and varies by region for each subscription. Subscriptions start with small defaults to get you going, but use this setting to control the amount of Amlcompute resources available to be spun up in your subscription. 

Also configure [workspace level quota by VM family](how-to-manage-quotas.md#workspace-level-quota), for each workspace within a subscription. Doing so allows you to have more granular control on the costs that each workspace might potentially incur and restrict certain VM families. 

To set quotas at the workspace level, start in the [Azure portal](https://portal.azure.com).  Select any workspace in your subscription, and select **Usages + quotas** in the left pane. Then select the **Configure quotas** tab to view the quotas. You need privileges at the subscription scope to set the quota, since it's a setting that affects multiple workspaces.

## Set run autotermination policies 

In some cases, you should configure your training runs to limit their duration or terminate them early. For example, when you are using Azure Machine Learning's built-in hyperparameter tuning or automated machine learning.

Here are a few options that you have:
* Define a parameter called `max_run_duration_seconds` in your RunConfiguration to control the maximum duration a run can extend to on the compute you choose (either local or remote cloud compute).
* For [hyperparameter tuning](how-to-tune-hyperparameters.md#early-termination), define an early termination policy from a Bandit policy, a Median stopping policy, or a Truncation selection policy. To further control hyperparameter sweeps, use parameters such as `max_total_runs` or `max_duration_minutes`.
* For [automated machine learning](how-to-configure-auto-train.md#exit), set similar termination policies using the  `enable_early_stopping` flag. Also use properties such as `iteration_timeout_minutes` and `experiment_timeout_minutes` to control the maximum duration of a run or for the entire experiment.

## Use low-priority VMs

Azure allows you to use excess unutilized capacity as Low-Priority VMs across virtual machine scale sets, Batch, and the Machine Learning service. These allocations are pre-emptible but come at a reduced price compared to dedicated VMs. In general, we recommend using Low-Priority VMs for Batch workloads. You should also use them where interruptions are recoverable either through resubmits (for Batch Inferencing) or through restarts (for deep learning training with checkpointing).

Low-Priority VMs have a single quota separate from the dedicated quota value, which is by VM family. Learn [more about AmlCompute quotas](how-to-manage-quotas.md).

Set the priority of your VM in any of these ways:

* In the studio, choose **Low Priority** when you create a VM.

* With the Python SDK, set the `vm_priority` attribute in your provisioning configuration.  

    ```python
    compute_config = AmlCompute.provisioning_configuration(vm_size='STANDARD_D2_V2',
                                                               vm_priority='lowpriority',
                                                               max_nodes=4)
    ```

* Using the CLI, set the `vm-priority`:

    ```azurecli-interactive
    az ml computetarget create amlcompute --name lowpriocluster --vm-size Standard_NC6 --max-nodes 5 --vm-priority lowpriority
    ```

 Low-Priority VMs don't work for compute instances, since they need to support interactive notebook experiences. 

## Use reserved instances

Another way to save money on compute resources is Azure Reserved VM Instance. With this offering, you commit to one-year or three-year terms. These discounts range up to 72% of the pay-as-you-go prices and are applied directly to your monthly Azure bill.

Azure Machine Learning Compute supports reserved instances inherently. If you purchase a one-year or three-year reserved instance, we will automatically apply discount against your Azure Machine Learning managed compute.


## Next steps

Learn more about:
* [Manage and increase resource quotas](how-to-manage-quotas.md)
* [Managing costs with [cost analysis](../cost-management-billing/costs/quick-acm-cost-analysis.md).
* [Azure Machine Learning compute](how-to-set-up-training-targets.md#amlcompute).
