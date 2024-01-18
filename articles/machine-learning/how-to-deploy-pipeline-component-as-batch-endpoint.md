---
title: 'How to deploy pipeline as batch endpoint'
titleSuffix: Azure Machine Learning
description: Learn how to deploy pipeline component as batch endpoint to trigger the pipeline using REST endpoint
ms.reviewer: lagayhar
author: zhanxia
ms.author: zhanxia
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 4/28/2023
---
# Deploy your pipeline as batch endpoint 

After building your machine learning pipeline, you can [deploy your pipeline as a batch endpoint](./concept-endpoints-batch.md#pipeline-component-deployment) for the following scenarios:

- You want to run your machine learning pipeline from other platforms out of Azure Machine Learning (for example: custom Java code, Azure DevOps, GitHub Actions, Azure Data Factory). Batch endpoint lets you do this easily because it's a REST endpoint and doesn't depend on the language/platform.
- You want to change the logic of your machine learning pipeline without affecting the downstream consumers who use a fixed URI interface.

## Pipeline component deployment as batch endpoint

Pipeline component deployment as batch endpoint is the feature that allows you to achieve the goals for the previously-listed scenarios. This is the equivalent feature with published pipeline/pipeline endpoint in SDK v1.

To deploy your pipeline as a batch endpoint, we recommend that you first convert your pipeline into a [pipeline component](./how-to-use-pipeline-component.md), and then deploy the pipeline component as a batch endpoint. For more information on deploying pipelines as batch endpoints, see [How to deploy pipeline component as batch endpoint](how-to-use-batch-pipeline-deployments.md).

It's also possible to deploy your pipeline job as a batch endpoint. In this case, Azure Machine Learning can accept that job as the input to your batch endpoint and create the pipeline component automatically for you. For more information. see [Deploy existing pipeline jobs to batch endpoints](how-to-use-batch-pipeline-from-job.md).

> [!NOTE]
> The consumer of the batch endpoint that invokes the pipeline job should be the user application, not the final end user. The application should control the inputs to the endpoint to prevent malicious inputs.

## Next steps

- [How to deploy a training pipeline with batch endpoints](how-to-use-batch-training-pipeline.md)
- [How to deploy a pipeline to perform batch scoring with preprocessing](how-to-use-batch-scoring-pipeline.md)
- [Access data from batch endpoints jobs](how-to-access-data-batch-endpoints-jobs.md)
- [Troubleshooting batch endpoints](how-to-troubleshoot-batch-endpoints.md)
