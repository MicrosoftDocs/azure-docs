---
title: "Tutorial 3: Experiment and train models by using features (preview)"
titleSuffix: Azure Machine Learning managed feature store - basics
description: This is part 3 of a tutorial series on managed feature store. 
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

# Tutorial 3: Experiment and train models by using features (preview)

This tutorial series shows how features seamlessly integrate all phases of the machine learning lifecycle: prototyping, training, and operationalization.

The first tutorial showed how to create a feature set specification with custom transformations, and then use that feature set to generate training data. The second tutorial showed how to enable materialization and perform a backfill.

This tutorial shows how to experiment with features as a way to improve model performance. It also shows how a feature store increases agility in the experimentation and training flows.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Prototype a new `accounts` feature set specification, by using existing precomputed values as features. Then, register the local feature set specification as a feature set in the feature store. This process differs from the first tutorial, where you created a feature set that had custom transformations.
> * Select features for the model from the `transactions` and `accounts` feature sets, and save them as a feature retrieval specification.
> * Run a training pipeline that uses the feature retrieval specification to train a new model. This pipeline uses the built-in feature retrieval component to generate the training data.

[!INCLUDE [machine-learning-preview-generic-disclaimer](includes/machine-learning-preview-generic-disclaimer.md)]

## Prerequisites

Before you proceed with the following procedures, be sure to complete the first and second tutorials in the series.

## Set up

1. Configure the Azure Machine Learning Spark notebook.

   You can create a new notebook and execute the instructions in this tutorial step by step. You can also open and run the existing notebook named *3. Experiment and train models using features.ipynb* from the *featurestore_sample/notebooks* directory. You can choose *sdk_only* or *sdk_and_cli*. Keep this tutorial open and refer to it for documentation links and more explanation.

   1. On the top menu, in the **Compute** dropdown list, select **Serverless Spark Compute** under **Azure Machine Learning Serverless Spark**.

   1. Configure the session:

      1. When the toolbar displays **Configure session**, select it.
      1. On the **Python packages** tab, select **Upload Conda file**.
      1. Upload the *conda.yml* file that you [uploaded in the first tutorial](./tutorial-get-started-with-feature-store.md#prepare-the-notebook-environment).
      1. Optionally, increase the session time-out (idle time) to avoid frequent prerequisite reruns.

   1. Start the Spark session.

      [!notebook-python[] (~/azureml-examples-temp-fix/sdk/python/featurestore_sample/notebooks/sdk_only/3. Experiment and train models using features.ipynb?name=start-spark-session)]

   1. Set up the root directory for the samples.

      [!notebook-python[] (~/azureml-examples-temp-fix/sdk/python/featurestore_sample/notebooks/sdk_only/3. Experiment and train models using features.ipynb?name=root-dir)]

      ### [Python SDK](#tab/python)

      Not applicable.

      ### [Azure CLI](#tab/cli)

      Set up the CLI:

      1. Install the Azure Machine Learning extension.

         [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/3. Experiment and train models using features.ipynb?name=install-ml-ext-cli)]

      1. Authenticate.

         [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/3. Experiment and train models using features.ipynb?name=auth-cli)]

      1. Set the default subscription.

         [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/3. Experiment and train models using features.ipynb?name=set-default-subs-cli)]

      ---

1. Initialize the project workspace variables.

   This is the current workspace, and the tutorial notebook runs in this resource.

   [!notebook-python[] (~/azureml-examples-temp-fix/sdk/python/featurestore_sample/notebooks/sdk_only/3. Experiment and train models using features.ipynb?name=init-ws-crud-client)]

1. Initialize the feature store variables.

   Be sure to update the `featurestore_name` and `featurestore_location` values to reflect what you created in the first tutorial.

   [!notebook-python[] (~/azureml-examples-temp-fix/sdk/python/featurestore_sample/notebooks/sdk_only/3. Experiment and train models using features.ipynb?name=init-fs-crud-client)]

1. Initialize the feature store consumption client.

   [!notebook-python[] (~/azureml-examples-temp-fix/sdk/python/featurestore_sample/notebooks/sdk_only/3. Experiment and train models using features.ipynb?name=init-fs-core-sdk)]

1. Create a compute cluster named `cpu-cluster` in the project workspace.

   You'll need this compute cluster when you run the training/batch inference jobs.

   [!notebook-python[] (~/azureml-examples-temp-fix/sdk/python/featurestore_sample/notebooks/sdk_only/3. Experiment and train models using features.ipynb?name=create-compute-cluster)]

## Create the account feature set locally

In the first tutorial, you created a `transactions` feature set that had custom transformations. Here, you create an `accounts` feature set that uses precomputed values.

To onboard precomputed features, you can create a feature set specification without writing any transformation code. You use a feature set specification to develop and test a feature set in a fully local development environment.

You don't need to connect to a feature store. In this procedure, you create the feature set specification locally, and then sample the values from it. For capabilities of managed feature store, you must use a feature asset definition to register the feature set specification with a feature store. Later steps in this tutorial provide more details.

1. Explore the source data for the accounts.

   > [!NOTE]
   > This notebook uses sample data hosted in a publicly accessible blob container. Only a `wasbs` driver can read it in Spark. When you create feature sets by using your own source data, host those feature sets in an Azure Data Lake Storage Gen2 account, and use an `abfss` driver in the data path.

   [!notebook-python[] (~/azureml-examples-temp-fix/sdk/python/featurestore_sample/notebooks/sdk_only/3. Experiment and train models using features.ipynb?name=explore-accts-fset-src-data)]

1. Create the `accounts` feature set specification locally, from these precomputed features.

   You don't need any transformation code here, because you reference precomputed features.

   [!notebook-python[] (~/azureml-examples-temp-fix/sdk/python/featurestore_sample/notebooks/sdk_only/3. Experiment and train models using features.ipynb?name=create-accts-fset-spec)]

1. Export as a feature set specification.

   To register the feature set specification with the feature store, you must save the feature set specification in a specific format.

   After you run the next cell, inspect the generated `accounts` feature set specification. To see the specification, open the *featurestore/featuresets/accounts/spec/FeatureSetSpec.yaml* file from the file tree.

   The specification has these important elements:

   - `source`: A reference to a storage resource. In this case, it's a Parquet file in a blob storage resource.

   - `features`: A list of features and their datatypes. With provided transformation code (see the "Day 2" section), the code must return a DataFrame that maps to the features and datatypes. Without the provided transformation code, the system builds the query to map the features and datatypes to the source. In this case, the transformation code is the generated `accounts` feature set specification, because it's precomputed.

   - `index_columns`: The join keys required to access values from the feature set.

   To learn more, see [Understanding top-level entities in managed feature store](./concept-top-level-entities-in-managed-feature-store.md) and the [CLI (v2) feature set specification YAML schema](./reference-yaml-featureset-spec.md).

   As an extra benefit, persisting supports source control.

   You don't need any transformation code here, because you reference precomputed features.

   [!notebook-python[] (~/azureml-examples-temp-fix/sdk/python/featurestore_sample/notebooks/sdk_only/3. Experiment and train models using features.ipynb?name=dump-accts-fset-spec)]

## Locally experiment with unregistered features

As you develop features, you might want to locally test and validate them before you register them with the feature store or run training pipelines in the cloud. A combination of a local unregistered feature set (`accounts`) and a feature set registered in the feature store (`transactions`) generates training data for the machine learning model.

1. Select features for the model.

   [!notebook-python[] (~/azureml-examples-temp-fix/sdk/python/featurestore_sample/notebooks/sdk_only/3. Experiment and train models using features.ipynb?name=select-unreg-features-for-model)]

1. Locally generate training data.

   This step generates training data for illustrative purposes. As an option, you can locally train models here. Later steps in this tutorial explain how to train a model in the cloud.

   [!notebook-python[] (~/azureml-examples-temp-fix/sdk/python/featurestore_sample/notebooks/sdk_only/3. Experiment and train models using features.ipynb?name=gen-training-data-locally)]

1. Register the `accounts` feature set with the feature store.

   After you locally experiment with feature definitions, and they seem reasonable, you can register a feature set asset definition with the feature store.

   [!notebook-python[] (~/azureml-examples-temp-fix/sdk/python/featurestore_sample/notebooks/sdk_only/3. Experiment and train models using features.ipynb?name=reg-accts-fset)]

1. Get the registered feature set and test it.

   [!notebook-python[] (~/azureml-examples-temp-fix/sdk/python/featurestore_sample/notebooks/sdk_only/3. Experiment and train models using features.ipynb?name=sample-accts-fset-data)]

## Run a training experiment

In the following steps, you select a list of features, run a training pipeline, and register the model. You can repeat these steps until the model performs as you want.

1. Optionally, discover features from the feature store UI.

   The first tutorial covered this step, when you registered the `transactions` feature set. Because you also have an `accounts` feature set, you can browse through the available features:

   1. Go to the [Azure Machine Learning global landing page](https://ml.azure.com/home).
   1. On the left pane, select **Feature stores**.
   1. In the list of feature stores, select the feature store that you created earlier.

   The UI shows the feature sets and entity that you created. Select the feature sets to browse through the feature definitions. You can use the global search box to search for feature sets across feature stores.

1. Optionally, discover features from the SDK.

   [!notebook-python[] (~/azureml-examples-temp-fix/sdk/python/featurestore_sample/notebooks/sdk_only/3. Experiment and train models using features.ipynb?name=discover-features-from-sdk)]

1. Select features for the model, and export the model as a feature retrieval specification.

   In the previous steps, you selected features from a combination of registered and unregistered feature sets, for local experimentation and testing. You can now experiment in the cloud. Your model-shipping agility increases if you save the selected features as a feature retrieval specification, and then use the specification in the machine learning operations (MLOps) or continuous integration and continuous delivery (CI/CD) flow for training and inference.

1. Select features for the model.

   [!notebook-python[] (~/azureml-examples-temp-fix/sdk/python/featurestore_sample/notebooks/sdk_only/3. Experiment and train models using features.ipynb?name=select-reg-features)]

1. Export selected features as a feature retrieval specification.

   A feature retrieval specification is a portable definition of the feature list that's associated with a model. It can help streamline the development and operationalization of a machine learning model. It will become an input to the training pipeline that generates the training data. Then, it will be packaged with the model.

   The inference phase uses the feature retrieval to look up the features. It becomes a glue that integrates all phases of the machine learning lifecycle. Changes to the training/inference pipeline can stay at a minimum as you experiment and deploy.

   Use of the feature retrieval specification and the built-in feature retrieval component is optional. You can directly use the `get_offline_features()` API, as shown earlier. The name of the specification should be *feature_retrieval_spec.yaml* when it's packaged with the model. This way, the system can recognize it.

   [!notebook-python[] (~/azureml-examples-temp-fix/sdk/python/featurestore_sample/notebooks/sdk_only/3. Experiment and train models using features.ipynb?name=export-as-frspec)]

## Train in the cloud with pipelines, and register the model

In this procedure, you manually trigger the training pipeline. In a production scenario, a CI/CD pipeline could trigger it, based on changes to the feature retrieval specification in the source repository. You can register the model if it's satisfactory.

1. Run the training pipeline.

   The training pipeline has these steps:

   1. Feature retrieval: For its input, this built-in component takes the feature retrieval specification, the observation data, and the time-stamp column name. It then generates the training data as output. It runs these steps as a managed Spark job.

   1. Training: Based on the training data, this step trains the model and then generates a model (not yet registered).

   1. Evaluation: This step validates whether the model performance and quality fall within a threshold. (In this tutorial, it's a placeholder step for illustration purposes.)

   1. Register the model: This step registers the model.

      > [!NOTE]
      > In the second tutorial, you ran a backfill job to materialize data for the `transactions` feature set. The feature retrieval step reads feature values from the offline store for this feature set. The behavior is the same, even if you use the `get_offline_features()` API.

      [!notebook-python[] (~/azureml-examples-temp-fix/sdk/python/featurestore_sample/notebooks/sdk_only/3. Experiment and train models using features.ipynb?name=run-training-pipeline)]

   1. Inspect the training pipeline and the model.

   1. Open the pipeline. Run the web view in a new window to display the pipeline steps.

1. Use the feature retrieval specification in the model artifacts:

   1. On the left pane of the current workspace, select **Models**.
   1. Select **Open in a new tab or window**.
   1. Select **fraud_model**.
   1. Select **Artifacts**.

   The feature retrieval specification is packaged along with the model. The model registration step in the training pipeline handled this step. You created the feature retrieval specification during experimentation. Now it's part of the model definition. In the next tutorial, you'll see how inferencing uses it.

## View the feature set and model dependencies

1. View the list of feature sets associated with the model.

   On the same **Models** page, select the **Feature sets** tab. This tab shows both the `transactions` and `accounts` feature sets on which this model depends.

1. View the list of models that use the feature sets:

   1. Open the feature store UI (explained earlier in this tutorial).
   1. On the left pane, select **Feature sets**.
   1. Select a feature set.
   1. Select the **Models** tab.

   The feature retrieval specification determined this list when the model was registered.

## Clean up

The [fourth tutorial in the series](./tutorial-enable-recurrent-materialization-run-batch-inference.md#clean-up) describes how to delete the resources.

## Next steps

* Go to the next tutorial in the series: [Enable recurrent materialization and run batch inference](./tutorial-enable-recurrent-materialization-run-batch-inference.md).
* Learn about [feature store concepts](./concept-what-is-managed-feature-store.md) and [top-level entities in managed feature store](./concept-top-level-entities-in-managed-feature-store.md).
* Learn about [identity and access control for managed feature store](./how-to-setup-access-control-feature-store.md).
* View the [troubleshooting guide for managed feature store](./troubleshooting-managed-feature-store.md).
* View the [YAML reference](./reference-yaml-overview.md).
