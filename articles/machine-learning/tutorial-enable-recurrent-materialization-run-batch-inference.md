---
title: "Tutorial #4: enable recurrent materialization and run batch inference (preview)"
titleSuffix: Azure ML managed Feature Store - Basics
description: Managed Feature Store tutorial part 4
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

# Tutorial #4: Enable recurrent materialization and run batch inference (preview)

This tutorial series shows how features seamlessly integrate all phases of the ML lifecycle: prototyping, training and operationalization.

Part 1 of this tutorial showed how to create a feature set spec with custom transformations, and use that feature set to generate training data. Part 2 of the tutorial showed how to enable materialization and perform a backfill. Part 3 of this tutorial showed how to experiment with features, as a way to improve model performance. Part 3 also showed how a feature store increases agility in the experimentation and training flows. Tutorial 4 explains how to

> [!div class="checklist"]
> * Run batch inference for the registered model
> * Enable recurrent materialization for the `transactions` feature set
> * Run a batch inference pipeline on the registered model

> [!IMPORTANT]
> This feature is currently in public preview. This preview version is provided without a service-level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

Before you proceed with this article, make sure you complete parts 1, 2, and 3 of this tutorial series.

## Set up

### Configure the Azure Machine Learning spark notebook

   1. In the "Compute" dropdown in the top nav, select "Configure session"

      To run this tutorial, you can create a new notebook, and execute the instructions in this document, step by step. You can also open and run the existing notebook named `4. Enable recurrent materialization and run batch inference`. You can find that notebook, and all the notebooks in this series, at the `featurestore_sample/notebooks directory`. You can select from `sdk_only`, or `sdk_and_cli`. You can keep this document open, and refer to it for documentation links and more explanation.

   1. Select Azure Machine Learning Spark compute in the "Compute" dropdown, located in the top nav.

   1. Configure session:

      * Select "configure session" in the bottom nav
      * Select **upload conda file**
      * Upload the **conda.yml** file you [uploaded in Tutorial #1](./tutorial-get-started-with-feature-store.md#prepare-the-notebook-environment-for-development)
      * (Optional) Increase the session time-out (idle time) to avoid frequent prerequisite reruns

### Start the spark session

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/4. Enable recurrent materialization and run batch inference.ipynb?name=start-spark-session)]

### Set up the root directory for the samples

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/4. Enable recurrent materialization and run batch inference.ipynb?name=root-dir)]

   ### [Python SDK](#tab/python)

   Not applicable

   ### [Azure CLI](#tab/cli)

   **Set up the CLI**

   1. Install the Azure Machine Learning extension

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/4. Enable recurrent materialization and run batch inference.ipynb?name=install-ml-ext-cli)]

   1. Authentication

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/4. Enable recurrent materialization and run batch inference.ipynb?name=auth-cli)]

   1. Set the default subscription

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/4. Enable recurrent materialization and run batch inference.ipynb?name=set-default-subs-cli)]

   ---

1. Initialize the project workspace CRUD client

   The tutorial notebook runs from this current workspace

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/4. Enable recurrent materialization and run batch inference.ipynb?name=init-ws-crud-client)]

1. Initialize the feature store variables

   Make sure that you update the `featurestore_name` value, to reflect what you created in part 1 of this tutorial.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/4. Enable recurrent materialization and run batch inference.ipynb?name=init-fs-crud-client)]

1. Initialize the feature store SDK client

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/4. Enable recurrent materialization and run batch inference.ipynb?name=init-fs-core-sdk)]

## Enable recurrent materialization on the `transactions` feature set

We enabled materialization in tutorial part 2, and we also performed backfill on the transactions feature set. Backfill is an on-demand, one-time operation that computes and places feature values in the materialization store. However, to handle inference of the model in production, you might want to set up recurrent materialization jobs to keep the materialization store up-to-date. These jobs run on user-defined schedules. The recurrent job schedule works this way:

* Interval and frequency values define a window. For example, values of

     * interval = 3
     * frequency = Hour

  define a three-hour window.

* The first window starts at the start_time defined in the RecurrenceTrigger, and so on.
* The first recurrent job is submitted at the start of the next window after the update time.
* Later recurrent jobs will be submitted at every window after the first job.

As explained in earlier parts of this tutorial, once data is materialized (backfill / recurrent materialization), feature retrieval uses the materialized data by default.

[!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/4. Enable recurrent materialization and run batch inference.ipynb?name=enable-recurrent-mat-txns-fset)]

## (Optional) Save the feature set asset yaml file

   We use the updated settings to save the yaml file

   ### [Python SDK](#tab/python)

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/4. Enable recurrent materialization and run batch inference.ipynb?name=dump-txn-fset-with-mat-yaml)]

   ### [Azure CLI](#tab/cli)

   Not applicable

   ---

## Run the batch-inference pipeline

   The batch-inference has these steps:

   1. Feature retrieval: this uses the same built-in feature retrieval component used in the training pipeline, covered in tutorial part 3. For pipeline training, we provided a feature retrieval spec as a component input. However, for batch inference, we pass the registered model as the input, and the component looks for the feature retrieval spec in the model artifact.
   
       Additionally, for training, the observation data had the target variable. However, the batch inference observation data doesn't have the target variable. The feature retrieval step joins the observation data with the features, and outputs the data for batch inference.

   1. Batch inference: This step uses the batch inference input data from previous step, runs inference on the model, and appends the predicted value as output.

   > [!NOTE]
   > We use a job for batch inference in this example. You can also use Azure ML's batch endpoints.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/4. Enable recurrent materialization and run batch inference.ipynb?name=run-batch-inf-pipeline)]

   ### Inspect the batch inference output data

   In the pipeline view
   1. Select `inference_step` in the `outputs` card
   1. Copy the Data field value. It looks something like `azureml_995abbc2-3171-461e-8214-c3c5d17ede83_output_data_data_with_prediction:1`
   1. Paste the Data field value in the following cell, with separate name and version values (note that the last character is the version, preceded by a `:`).
   1. Note the `predict_is_fraud` column that the batch inference pipeline generated

      Explanation: In the batch inference pipeline (`/project/fraud_mode/pipelines/batch_inference_pipeline.yaml`) outputs, since we didn't provide `name` or `version` values in the `outputs` of the `inference_step`, the system created an untracked data asset with a guid as the name value, and 1 as the version value. In this cell, we derive and then display the data path from the asset:

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/4. Enable recurrent materialization and run batch inference.ipynb?name=inspect-batch-inf-output-data)]

## Cleanup

If you created a resource group for the tutorial, you can delete the resource group, to delete all the resources associated with this tutorial. Otherwise, you can delete the resources individually:

1. To delete the feature store, go to the resource group in the Azure portal, select the feature store, and delete it
1. Follow [these instructions](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md) to delete the user-assigned managed identity
1. To delete the offline store (storage account), go to the resource group in the Azure portal, select the storage you created, and delete it

## Next steps

* Understand concepts: [feature store concepts](./concept-what-is-managed-feature-store.md), [top level entities in managed feature store](./concept-top-level-entities-in-managed-feature-store.md)
* [Understand identity and access control for feature store](./how-to-setup-access-control-feature-store.md)
* [View feature store troubleshooting guide](./troubleshooting-managed-feature-store.md)
* Reference: [YAML reference](./reference-yaml-overview.md)