---
title: 'How to use batch endpoints in studio'
titleSuffix: Azure Machine Learning
description: In this article, learn how to create a batch endpoint to continuously batch score large data in Azure Machine Learning studio.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
author: shivanissambare
ms.author: ssambare
ms.reviewer: larryfr
ms.date: 08/16/2021
ms.custom: how-to, studio, managed-batch-endpoints
---

# How to use batch endpoints (preview) in Azure Machine Learning studio

In this article, you learn how to use batch endpoints (preview) to do batch scoring in [Azure Machine Learning studio](https://ml.azure.com). For more, see [What are Azure Machine Learning endpoints (preview)?](concept-endpoints.md).

In this article, you learn about:

> [!div class="checklist"]
> * Create a batch endpoint with a no-code experience for MLflow model
> * Check batch endpoint details
> * Start a batch scoring job
> * Overview of batch endpoint features in Azure machine learning studio

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

## Prerequisites

* An Azure subscription - If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/) today.

* The example repository - Clone the [AzureML Example repository](https://github.com/Azure/azureml-examples). This article uses the assets in `/cli/endpoints/batch`.

* A compute target where you can run batch scoring workflows. For more information on creating a compute target, see [Create compute targets in Azure Machine Learning studio](how-to-create-attach-compute-studio.md).

* Register machine learning model.

## Create a batch endpoint

There are two ways to create Batch Endpoints in Azure Machine Learning studio:

- From the **Endpoints page**, select **Batch Endpoints** and then select **+ Create**. 

    :::image type="content" source="media/how-to-use-batch-endpoints-studio/create-batch-endpoints.png" alt-text="Create a batch endpoint and deployment from Endpoints page":::

- From the **Models page**, select the model you want to deploy and then select **Deploy to batch endpoint (preview)**.

    :::image type="content" source="media/how-to-use-batch-endpoints-studio/models-page-deployment.png" alt-text="Create a batch endpoint and deployment from Models page":::

> [!TIP]
> If you're using an MLflow model, you can use no-code batch endpoint creation. That is, you don't need to prepare a scoring script and environment, both can be auto generated. For more, see [Train and track ML models with MLflow and Azure Machine Learning (preview)](how-to-use-mlflow.md).
> 
> :::image type="content" source="media/how-to-use-batch-endpoints-studio/mlflow-model-wizard.png" alt-text="Deploy MLflow model":::

Complete all the steps in wizard to create a batch endpoint and deployment.

:::image type="content" source="media/how-to-use-batch-endpoints-studio/review-batch-wizard.png" alt-text="Batch endpoints and deployment review screen":::

## Check batch endpoint details

After a batch endpoint is created, select it from the **Endpoints page** to view the details.

:::image type="content" source="media/how-to-use-batch-endpoints-studio/batch-endpoint-details.png" alt-text="Check batch endpoints and deployment details":::

## Start a batch scoring job using the Azure machine learning studio

A batch scoring workload runs as an offline job. By default, batch scoring stores the scoring outputs in blob storage. You can also configure the outputs location and overwrite some of the settings to get the best performance.

1. Select **+ Create job**:

    :::image type="content" source="media/how-to-use-batch-endpoints-studio/create-batch-job.png" alt-text="Select create job option to start batch scoring":::

1. You can update the default deployment while submitting a job from the drop-down:

    :::image type="content" source="media/how-to-use-batch-endpoints-studio/job-setting-batch-scoring.png" alt-text="Select the deployment to submit a batch job":::

### Overwrite settings

Some settings can be overwritten when you start a batch scoring job to make best use of the compute resource and to improve performance. To override settings, select __Override deployment settings__ and provide the settings. For more information, see [Use batch endpoints](how-to-use-batch-endpoint.md#overwrite-settings).

:::image type="content" source="media/how-to-use-batch-endpoints-studio/overwrite-setting.png" alt-text="Overwrite setting to start a batch job":::

### Start a batch scoring job with different input options

You have two options to specify the data inputs in Azure machine learning studio:

* Use a **registered dataset**:

    > [!NOTE]
    > During Preview, only FileDataset is supported. 

    :::image type="content" source="media/how-to-use-batch-endpoints-studio/select-dataset-for-job.png" alt-text="Select registered dataset as an input option":::

* Use a **datastore**:

    You can specify AML registered datastore or if your data is publicly available, specify the public path.

    :::image type="content" source="media/how-to-use-batch-endpoints-studio/select-datastore-job.png" alt-text="Select datastore as an input option":::

### Configure the output location

By default, the batch scoring results are stored in the default blob store for the workspace. Results are contained in a folder named after the job name (a system-generated GUID). You can configure where to store the scoring results when you start a batch scoring job by providing a blob store and output path.

> [!IMPORTANT]
> You must use a unique output location. If the output file exists, the batch scoring job will fail. 

:::image type="content" source="media/how-to-use-batch-endpoints-studio/configure-output-location.png" alt-text="Optionally configure output location":::

## Check batch scoring results

To learn how to view the scoring results, see [Use batch endpoints](how-to-use-batch-endpoint.md#check-batch-scoring-results).

## Overview of batch endpoint features in Azure machine learning studio

In Azure machine learning studio, you can also perform following tasks:

1. Add a deployment to the batch endpoint
1. Update default deployment
1. Delete batch endpoint and deployments.
1. Summary of all submitted jobs

## Clean up resources

If you don't plan to use the resources you created, delete them, so you don't incur any charges:

1. In the Azure portal, in the left menu, select **Resource groups**.
1. In the list of resource groups, select the resource group you created.
1. Select **Delete resource group**.
1. Enter the resource group name. Then, select **Delete**.

You can also keep the resource group but delete a single workspace. Display the workspace properties, and then select **Delete**.

## Next steps

In this article, you learned how to create and call batch endpoints, allowing you to score large amounts of data. See these other articles to learn more about Azure Machine Learning:

* [Troubleshooting batch endpoints](how-to-troubleshoot-batch-endpoints.md)
* [Deploy and score a machine learning model with a managed online endpoint (preview)](how-to-deploy-managed-online-endpoints.md)
