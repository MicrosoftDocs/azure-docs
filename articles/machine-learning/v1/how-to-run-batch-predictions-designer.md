---
title: Run batch predictions using Azure Machine Learning designer
titleSuffix: Azure Machine Learning
description: Learn how to create a batch prediction pipeline. Deploy the pipeline as a parameterized web service, and trigger it from any HTTP library.
services: machine-learning
ms.service: machine-learning
ms.subservice: mlops
ms.author: keli19
author: likebupt
ms.reviewer: lagayhar
ms.date: 05/10/2022
ms.topic: how-to
ms.custom: UpdateFrequency5, designer, event-tier1-build-2022
---

# Run batch predictions using Azure Machine Learning designer

In this article, you learn how to use the designer to create a batch prediction pipeline. Batch prediction lets you continuously score large datasets on-demand using a web service that can be triggered from any HTTP library.

In this how-to, you learn to do the following tasks:

> [!div class="checklist"]
> * Create and publish a batch inference pipeline
> * Consume a pipeline endpoint
> * Manage endpoint versions

To learn how to set up batch scoring services using the SDK, see the accompanying [tutorial on pipeline batch scoring](../tutorial-pipeline-batch-scoring-classification.md).

## Prerequisites

This how-to assumes you already have a training pipeline. For a guided introduction to the designer, complete [part one of the designer tutorial](tutorial-designer-automobile-price-train-score.md).

[!INCLUDE [machine-learning-missing-ui](../includes/machine-learning-missing-ui.md)]

## Create a batch inference pipeline

Your training pipeline must be run at least once to be able to create an inferencing pipeline.

1. Go to the **Designer** tab in your workspace.

1. Select the training pipeline that trains the model you want to use to make prediction.

1. **Submit** the pipeline.

![Submit the pipeline](./media/how-to-run-batch-predictions-designer/run-training-pipeline.png)

 :::image type="content" source="./media/how-to-run-batch-predictions-designer/run-training-pipeline.png" alt-text="Screenshot showing the set up pipeline job with the experiment drop-down and submit button highlighted." lightbox= "./media/how-to-run-batch-predictions-designer/run-training-pipeline.png":::

You'll see a submission list on the left of canvas. You can select the job detail link to go to the job detail page, and after the training pipeline job completes, you can create a batch inference pipeline.

 :::image type="content" source="./media/how-to-run-batch-predictions-designer/submission-list.png" alt-text="Screenshot showing the submitted job list." lightbox= "./media/how-to-run-batch-predictions-designer/submission-list.png":::

1. In job detail page, above the canvas, select the dropdown **Create inference pipeline**. Select **Batch inference pipeline**.

    > [!NOTE]
    > Currently auto-generating inference pipeline only works for training pipeline built purely by the designer built-in components.

    :::image type="content" source="./media/how-to-run-batch-predictions-designer/create-batch-inference.png" alt-text="Screenshot of the create inference pipeline drop-down with batch inference pipeline highlighted." lightbox= "./media/how-to-run-batch-predictions-designer/create-batch-inference.png":::
    
    It will create a batch inference pipeline draft for you. The batch inference pipeline draft uses the trained model as **MD-** node and transformation as **TD-** node from the training pipeline job.

    You can also modify this inference pipeline draft to better handle your input data for batch inference.

     :::image type="content" source="./media/how-to-run-batch-predictions-designer/batch-inference-draft.png" alt-text="Screenshot showing a batch inference pipeline draft." lightbox= "./media/how-to-run-batch-predictions-designer/batch-inference-draft.png":::

### Add a pipeline parameter

To create predictions on new data, you can either manually connect a different dataset in this pipeline draft view or create a parameter for your dataset. Parameters let you change the behavior of the batch inferencing process at runtime.

In this section, you create a dataset parameter to specify a different dataset to make predictions on.

1. Select the dataset component.

1. A pane will appear to the right of the canvas. At the bottom of the pane, select **Set as pipeline parameter**.
   
    Enter a name for the parameter, or accept the default value.

     :::image type="content" source="./media/how-to-run-batch-predictions-designer/create-pipeline-parameter.png" alt-text="Screenshot of cleaned dataset tab with set as pipeline parameter checked." lightbox= "./media/how-to-run-batch-predictions-designer/create-pipeline-parameter.png":::


1. Submit the batch inference pipeline and go to job detail page by selecting the job link in the left pane.

## Publish your batch inference pipeline

Now you're ready to deploy the inference pipeline. This will deploy the pipeline and make it available for others to use.

1. Select the **Publish** button.

1. In the dialog that appears, expand the drop-down for **PipelineEndpoint**, and select **New PipelineEndpoint**.

1. Provide an endpoint name and optional description.

    Near the bottom of the dialog, you can see the parameter you configured with a default value of the dataset ID used during training.

1. Select **Publish**.

:::image type="content" source="./media/how-to-run-batch-predictions-designer/publish-inference-pipeline.png" alt-text="Screenshot of set up published pipeline." lightbox= "./media/how-to-run-batch-predictions-designer/publish-inference-pipeline.png":::

## Consume an endpoint

Now, you have a published pipeline with a dataset parameter. The pipeline will use the trained model created in the training pipeline to score the dataset you provide as a parameter.

### Submit a pipeline job

In this section, you'll set up a manual pipeline job and alter the pipeline parameter to score new data.

1. After the deployment is complete, go to the **Endpoints** section.

1. Select **Pipeline endpoints**.

1. Select the name of the endpoint you created.

:::image type="content" source="./media/how-to-run-batch-predictions-designer/manage-endpoints.png" alt-text="Screenshot of the pipeline endpoint tab." :::

1. Select **Published pipelines**.

    This screen shows all published pipelines published under this endpoint.

1. Select the pipeline you published.

    The pipeline details page shows you a detailed job history and connection string information for your pipeline.
    
1. Select **Submit** to create a manual run of the pipeline.

    :::image type="content" source="./media/how-to-run-batch-predictions-designer/submit-manual-run.png" alt-text="Screenshot of set up pipeline job with parameters highlighted." lightbox= "./media/how-to-run-batch-predictions-designer/submit-manual-run.png" :::
    
1. Change the parameter to use a different dataset.
    
1. Select **Submit** to run the pipeline.

### Use the REST endpoint

You can find information on how to consume pipeline endpoints and published pipeline in the **Endpoints** section.

You can find the REST endpoint of a pipeline endpoint in the job overview panel. By calling the endpoint, you're consuming its default published pipeline.

You can also consume a published pipeline in the **Published pipelines** page. Select a published pipeline and you can find the REST endpoint of it in the **Published pipeline overview** panel to the right of the graph. 

To make a REST call, you'll need an OAuth 2.0 bearer-type authentication header. See the following [tutorial section](../tutorial-pipeline-batch-scoring-classification.md#publish-and-run-from-a-rest-endpoint) for more detail on setting up authentication to your workspace and making a parameterized REST call.

## Versioning endpoints

The designer assigns a version to each subsequent pipeline that you publish to an endpoint. You can specify the pipeline version that you want to execute as a parameter in your REST call. If you don't specify a version number, the designer will use the default pipeline.

When you publish a pipeline, you can choose to make it the new default pipeline for that endpoint.

:::image type="content" source="./media/how-to-run-batch-predictions-designer/set-default-pipeline.png" alt-text="Screenshot of set up published pipeline with set as default pipeline for this endpoint checked." :::

You can also set a new default pipeline in the **Published pipelines** tab of your endpoint.

:::image type="content" source="./media/how-to-run-batch-predictions-designer/set-new-default-pipeline.png" alt-text="Screenshot of sample pipeline tab with set as default highlighted." :::

## Update pipeline endpoint

If you make some modifications in your training pipeline, you may want to update the newly trained model to the pipeline endpoint.

1. After your modified training pipeline completes successfully, go to the job detail page.

1. Right click **Train Model** component and select **Register data**

    :::image type="content" source="./media/how-to-run-batch-predictions-designer/register-train-model-as-dataset.png" alt-text="Screenshot of the train model component options with register data highlighted." lightbox= "./media/how-to-run-batch-predictions-designer/register-train-model-as-dataset.png" :::

    Input name and select **File** type.

    :::image type="content" source="./media/how-to-run-batch-predictions-designer/register-train-model-as-dataset-2.png" alt-text="Screenshot of register as data asset with new data asset selected." lightbox= "./media/how-to-run-batch-predictions-designer/register-train-model-as-dataset-2.png" :::

1. Find the previous batch inference pipeline draft, or you can just **Clone** the published pipeline into a new draft.

1. Replace the **MD-** node in the inference pipeline draft with the registered data in the step above.

    :::image type="content" source="./media/how-to-run-batch-predictions-designer/update-inference-pipeline-draft.png" alt-text="Screenshot of updating the inference pipeline draft with the registered data in the step above." :::

1. Updating data transformation node **TD-** is the same as the trained model.

1. Then you can submit the inference pipeline with the updated model and transformation, and publish again.

## Next steps

* Follow the [designer tutorial to train and deploy a regression model](tutorial-designer-automobile-price-train-score.md).
* For how to publish and run a published pipeline using the SDK v1, see the [How to deploy pipelines](how-to-deploy-pipelines.md?view=azureml-api-1&preserve-view=true) article.
