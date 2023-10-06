---
title: "Tutorial 4: Enable recurrent materialization and run batch inference (preview)"
titleSuffix: Azure Machine Learning managed feature store - basics
description: This is part 4 of a tutorial series on managed feature store.
services: machine-learning
ms.service: machine-learning

ms.subservice: core
ms.topic: tutorial
author: rsethur
ms.author: seramasu
ms.date: 07/24/2023
ms.reviewer: franksolomon
ms.custom: sdkv2, build-2023
#Customer intent: As a professional data scientist, I want to know how to build and deploy a model with Azure Machine Learning by using Python in a Jupyter Notebook.
---

# Tutorial 4: Enable recurrent materialization and run batch inference (preview)

This tutorial series shows how features seamlessly integrate all phases of the machine learning lifecycle: prototyping, training, and operationalization.

The first tutorial showed how to create a feature set specification with custom transformations, and then use that feature set to generate training data. The second tutorial showed how to enable materialization and perform a backfill. The third tutorial showed how to experiment with features as a way to improve model performance. It also showed how a feature store increases agility in the experimentation and training flows.

This tutorial explains how to:

> [!div class="checklist"]
> * Run batch inference for the registered model.
> * Enable recurrent materialization for the `transactions` feature set.
> * Run a batch inference pipeline on the registered model.

[!INCLUDE [machine-learning-preview-generic-disclaimer](includes/machine-learning-preview-generic-disclaimer.md)]

## Prerequisites

Before you proceed with the following procedures, be sure to complete the first, second, and third tutorials in the series.

## Set up

1. Configure the Azure Machine Learning Spark notebook.

   To run this tutorial, you can create a new notebook and execute the instructions step by step. You can also open and run the existing notebook named *4. Enable recurrent materialization and run batch inference*. You can find that notebook, and all the notebooks in this series, in the *featurestore_sample/notebooks* directory. You can choose *sdk_only* or *sdk_and_cli*. Keep this tutorial open and refer to it for documentation links and more explanation.

   1. On the top menu, in the **Compute** dropdown list, select **Serverless Spark Compute** under **Azure Machine Learning Serverless Spark**.

   1. Configure the session:
  
      1. When the toolbar displays **Configure session**, select it.
      1. On the **Python packages** tab, select **Upload conda file**.
      1. Upload the *conda.yml* file that you [uploaded in the first tutorial](./tutorial-get-started-with-feature-store.md#prepare-the-notebook-environment).
      1. Optionally, increase the session time-out (idle time) to avoid frequent prerequisite reruns.

   1. Start the Spark session.

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/4. Enable recurrent materialization and run batch inference.ipynb?name=start-spark-session)]

   1. Set up the root directory for the samples.

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/4. Enable recurrent materialization and run batch inference.ipynb?name=root-dir)]

      ### [Python SDK](#tab/python)

      Not applicable.

      ### [Azure CLI](#tab/cli)

      Set up the CLI:

      1. Install the Azure Machine Learning extension.

         [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/4. Enable recurrent materialization and run batch inference.ipynb?name=install-ml-ext-cli)]

      1. Authenticate.

         [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/4. Enable recurrent materialization and run batch inference.ipynb?name=auth-cli)]

      1. Set the default subscription.

         [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/4. Enable recurrent materialization and run batch inference.ipynb?name=set-default-subs-cli)]

      ---

1. Initialize the project workspace CRUD (create, read, update, and delete) client.

   The tutorial notebook runs from this current workspace.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/4. Enable recurrent materialization and run batch inference.ipynb?name=init-ws-crud-client)]

1. Initialize the feature store variables.

   Be sure to update the `featurestore_name` value, to reflect what you created in the first tutorial.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/4. Enable recurrent materialization and run batch inference.ipynb?name=init-fs-crud-client)]

1. Initialize the feature store SDK client.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/4. Enable recurrent materialization and run batch inference.ipynb?name=init-fs-core-sdk)]

## Enable recurrent materialization on the transactions feature set

In the second tutorial, you enabled materialization and performed backfill on the `transactions` feature set. Backfill is an on-demand, one-time operation that computes and places feature values in the materialization store.

To handle inference of the model in production, you might want to set up recurrent materialization jobs to keep the materialization store up to date. These jobs run on user-defined schedules. The recurrent job schedule works this way:

* Interval and frequency values define a window. For example, the following values define a three-hour window:

  * `interval` = `3`
  * `frequency` = `Hour`

* The first window starts at the `start_time` value defined in `RecurrenceTrigger`, and so on.
* The first recurrent job is submitted at the start of the next window after the update time.
* Later recurrent jobs are submitted at every window after the first job.

As explained in earlier tutorials, after data is materialized (backfill or recurrent materialization), feature retrieval uses the materialized data by default.

[!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/4. Enable recurrent materialization and run batch inference.ipynb?name=enable-recurrent-mat-txns-fset)]

## (Optional) Save the YAML file for the feature set asset

You use the updated settings to save the YAML file.

### [Python SDK](#tab/python)

[!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/4. Enable recurrent materialization and run batch inference.ipynb?name=dump-txn-fset-with-mat-yaml)]

### [Azure CLI](#tab/cli)

Not applicable.

---

## Run the batch inference pipeline

The batch inference has these steps:

1. You use the same built-in feature retrieval component for feature retrieval that you used in the training pipeline (covered in the third tutorial). For pipeline training, you provided a feature retrieval specification as a component input. For batch inference, you pass the registered model as the input. The component looks for the feature retrieval specification in the model artifact.

   Additionally, for training, the observation data had the target variable. However, the batch inference observation data doesn't have the target variable. The feature retrieval step joins the observation data with the features and outputs the data for batch inference.

1. The pipeline uses the batch inference input data from previous step, runs inference on the model, and appends the predicted value as output.

   > [!NOTE]
   > You use a job for batch inference in this example. You can also use batch endpoints in Azure Machine Learning.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/4. Enable recurrent materialization and run batch inference.ipynb?name=run-batch-inf-pipeline)]

### Inspect the output data for batch inference

In the pipeline view:

1. Select `inference_step` in the `outputs` card.
1. Copy the `Data` field value. It looks something like `azureml_995abbc2-3171-461e-8214-c3c5d17ede83_output_data_data_with_prediction:1`.
1. Paste the `Data` field value in the following cell, with separate name and version values. The last character is the version, preceded by a colon (`:`).
1. Note the `predict_is_fraud` column that the batch inference pipeline generated.

   In the batch inference pipeline (*/project/fraud_mode/pipelines/batch_inference_pipeline.yaml*) outputs, because you didn't provide `name` or `version` values for `outputs` of `inference_step`, the system created an untracked data asset with a GUID as the name value and `1` as the version value. In this cell, you derive and then display the data path from the asset.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/4. Enable recurrent materialization and run batch inference.ipynb?name=inspect-batch-inf-output-data)]

## Clean up

If you created a resource group for the tutorial, you can delete the resource group to delete all the resources associated with this tutorial. Otherwise, you can delete the resources individually:

- To delete the feature store, go to the resource group in the Azure portal, select the feature store, and delete it.
- To delete the user-assigned managed identity, follow [these instructions](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md).
- To delete the offline store (storage account), go to the resource group in the Azure portal, select the storage that you created, and delete it.

## Next steps

* Learn about [feature store concepts](./concept-what-is-managed-feature-store.md) and [top-level entities in managed feature store](./concept-top-level-entities-in-managed-feature-store.md).
* Learn about [identity and access control for managed feature store](./how-to-setup-access-control-feature-store.md).
* View the [troubleshooting guide for managed feature store](./troubleshooting-managed-feature-store.md).
* View the [YAML reference](./reference-yaml-overview.md).
