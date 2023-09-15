---
title: What are batch endpoints?
titleSuffix: Azure Machine Learning
description: Learn how Azure Machine Learning uses batch endpoints to simplify machine learning deployments.
services: machine-learning
ms.service: machine-learning
ms.subservice: inferencing
ms.topic: conceptual
author: santiagxf
ms.author: fasantia
ms.reviewer: mopeakande
ms.custom: devplatv2
ms.date: 04/01/2023
#Customer intent: As an MLOps administrator, I want to understand what a managed endpoint is and why I need it.
---

# Batch endpoints

After you train a machine learning model, you need to deploy it so that others can consume its predictions. Such execution mode of a model is called *inference*. Azure Machine Learning uses the concept of [endpoints and deployments](concept-endpoints.md) for machine learning models inference.

> [!IMPORTANT]
> Items marked (preview) in this article are currently in public preview.
> The preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

**Batch endpoints** are endpoints that are used to do batch inferencing on large volumes of data over in asynchronous way.  Batch endpoints receive pointers to data and run jobs asynchronously to process the data in parallel on compute clusters. Batch endpoints store outputs to a data store for further analysis.

We recommend using them when:

> [!div class="checklist"]
> * You have expensive models or pipelines that requires a longer time to run.
> * You want to operationalize machine learning pipelines and reuse components.
> * You need to perform inference over large amounts of data, distributed in multiple files.
> * You don't have low latency requirements.
> * Your model's inputs are stored in an Storage Account or in an Azure Machine learning data asset.
> * You can take advantage of parallelization.

## Batch deployments

A deployment is a set of resources and computes required to implement the functionality the endpoint provides. Each endpoint can host multiple deployments with different configurations, which helps *decouple the interface* indicated by the endpoint, from *the implementation details* indicated by the deployment. Batch endpoints automatically route the client to the default deployment which can be configured and changed at any time.

:::image type="content" source="./media/concept-endpoints/batch-endpoint.png" alt-text="Diagram showing the relationship between endpoints and deployments in batch endpoints.":::

There are two types of deployments in batch endpoints: 

* [Model deployments](#model-deployments)
* [Pipeline component deployment (preview)](#pipeline-component-deployment-preview)

### Model deployments

Model deployment allows operationalizing model inference at scale, processing big amounts of data in a low latency and asynchronous way. Scalability is automatically instrumented by Azure Machine Learning by providing parallelization of the inferencing processes across multiple nodes in a compute cluster. 

Use __Model deployments__ when:

> [!div class="checklist"]
> * You have expensive models that requires a longer time to run inference.
> * You need to perform inference over large amounts of data, distributed in multiple files.
> * You don't have low latency requirements.
> * You can take advantage of parallelization.

The main benefit of this kind of deployments is that you can use the very same assets deployed in the online world (Online Endpoints) but now to run at scale in batch. If your model requires simple pre or pos processing, you can [author an scoring script](how-to-batch-scoring-script.md) that performs the data transformations required. 

To create a model deployment in a batch endpoint, you need to specify the following elements:

- Model
- Compute cluster
- Scoring script (optional for MLflow models)
- Environment (optional for MLflow models)

> [!div class="nextstepaction"]
> [Create your first model deployment](how-to-use-batch-model-deployments.md)

### Pipeline component deployment (preview)

[!INCLUDE [machine-learning-preview-generic-disclaimer](includes/machine-learning-preview-generic-disclaimer.md)]

Pipeline component deployment allows operationalizing entire processing graphs (pipelines) to perform batch inference in a low latency and asynchronous way.

Use __Pipeline component deployments__ when:

> [!div class="checklist"]
> * You need to operationalize complete compute graphs that can be decomposed in multiple steps.
> * You need to reuse components from training pipelines in your inference pipeline.
> * You don't have low latency requirements.

The main benefit of this kind of deployments is reusability of components already existing in your platform and the capability to operationalize complex inference routines. 

To create a pipeline component deployment in a batch endpoint, you need to specify the following elements:

- Pipeline component
- Compute cluster configuration

> [!div class="nextstepaction"]
> [Create your first pipeline component deployment](how-to-use-batch-pipeline-deployments.md)

Batch endpoints also allow you to [create Pipeline component deployments from an existing pipeline job (preview)](how-to-use-batch-pipeline-from-job.md). When doing that, Azure Machine Learning automatically creates a Pipeline component out of the job. This simplifies the use of these kinds of deployments. However, it is a best practice to always [create pipeline components explicitly to streamline your MLOps practice](how-to-use-batch-pipeline-deployments.md).

## Cost management

Invoking a batch endpoint triggers an asynchronous batch inference job. Compute resources are automatically provisioned when the job starts, and automatically de-allocated as the job completes. So you only pay for compute when you use it.

> [!TIP]
> When deploying models, you can [override compute resource settings](how-to-use-batch-endpoint.md#overwrite-deployment-configuration-per-each-job) (like instance count) and advanced settings (like mini batch size, error threshold, and so on) for each individual batch inference job to speed up execution and reduce cost if you know that you can take advantage of specific configurations.

Batch endpoints also can run on low-priority VMs. Batch endpoints can automatically recover from deallocated VMs and resume the work from where it was left when deploying models for inference. See [Use low-priority VMs in batch endpoints](how-to-use-low-priority-batch.md).

Finally, Azure Machine Learning doesn't charge for batch endpoints or batch deployments themselves, so you can organize your endpoints and deployments as best suits your scenario. Endpoints and deployment can use independent or shared clusters, so you can achieve fine grained control over which compute the produced jobs consume. Use __scale-to-zero__ in clusters to ensure no resources are consumed when they are idle. 

## Streamline the MLOps practice

Batch endpoints can handle multiple deployments under the same endpoint, allowing you to change the implementation of the endpoint without changing the URL your consumers use to invoke it.

You can add, remove, and update deployments without affecting the endpoint itself.

:::image type="content" source="./media/concept-endpoints/batch-endpoint-mlops.gif" alt-text="Diagram describing how multiple deployments can be used under the same endpoint.":::

## Flexible data sources and storage

Batch endpoints reads and write data directly from storage. You can indicate Azure Machine Learning datastores, Azure Machine Learning data asset, or Storage Accounts as inputs. For more information on supported input options and how to indicate them, see [Create jobs and input data to batch endpoints](how-to-access-data-batch-endpoints-jobs.md).

## Security

Batch endpoints provide all the capabilities required to operate production level workloads in an enterprise setting. They support [private networking](how-to-secure-batch-endpoint.md) on secured workspaces and [Azure Active Directory authentication](how-to-authenticate-batch-endpoint.md), either using a user principal (like a user account) or a service principal (like a managed or unmanaged identity). Jobs generated by a batch endpoint run under the identity of the invoker which gives you flexibility to implement any scenario. See [How to authenticate to batch endpoints](how-to-authenticate-batch-endpoint.md) for details.

> [!div class="nextstepaction"]
> [Configure network isolation in Batch Endpoints](how-to-secure-batch-endpoint.md)

## Next steps

- [Deploy models with batch endpoints](how-to-use-batch-model-deployments.md)
- [Deploy pipelines with batch endpoints (preview)](how-to-use-batch-pipeline-deployments.md)
- [Deploy MLFlow models in batch deployments](how-to-mlflow-batch.md)
- [Create jobs and input data to batch endpoints](how-to-access-data-batch-endpoints-jobs.md)
- [Network isolation for Batch Endpoints](how-to-secure-batch-endpoint.md)
