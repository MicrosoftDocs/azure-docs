---
title: "Tutorial #3: experiment and train models using features (preview)"
titleSuffix: Azure Machine Learning managed Feature Store - Basics
description: Managed Feature Store tutorial part 3. 
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

# Tutorial #3: Experiment and train models using features (preview)

This tutorial series shows how features seamlessly integrate all phases of the ML lifecycle: prototyping, training and operationalization.

Part 1 of this tutorial showed how to create a feature set spec with custom transformations, and use that feature set to generate training data. Part 2 of the tutorial showed how to enable materialization and perform a backfill. Tutorial 3 shows how to experiment with features, as a way to improve model performance. This tutorial also shows how a feature store increases agility in the experimentation and training flows. It shows how to:

> [!div class="checklist"]
> * Prototype a new `accounts` feature set spec, using existing precomputed values as features. Then, register the local feature set spec as a feature set in the feature store. This differs from tutorial part 1, where we created a feature set that had custom transformations
> * Select features for the model from the `transactions` and `accounts` feature sets, and save them as a feature-retrieval spec
> * Run a training pipeline that uses the feature retrieval spec to train a new model. This pipeline uses the built-in feature-retrieval component, to generate the training data

> [!IMPORTANT]
> This feature is currently in public preview. This preview version is provided without a service-level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

Before you proceed with this article, make sure you complete parts 1 and 2 of this tutorial series.

## Set up

1. Configure the Azure Machine Learning spark notebook

   1. Running the tutorial: You can create a new notebook, and execute the instructions in this document step by step. You can also open and run existing notebook `3. Experiment and train models using features.ipynb`. You can find the notebooks in the `featurestore_sample/notebooks directory`. You can select from `sdk_only`, or `sdk_and_cli`. You can keep this document open, and refer to it for documentation links and more explanation.

   1. Select Azure Machine Learning Spark compute in the "Compute" dropdown, located in the top nav. Wait for a status bar in the top to display "configure session".

   1. Configure the session:

      * Select "configure session" in the bottom nav
      * Select **upload conda file**
      * Upload the **conda.yml** file you [uploaded in Tutorial #1](./tutorial-get-started-with-feature-store.md#prepare-the-notebook-environment-for-development)
      * (Optional) Increase the session time-out (idle time) to avoid frequent prerequisite reruns

   1. Start the spark session

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/3. Experiment and train models using features.ipynb?name=start-spark-session)]

   1. Set up the root directory for the samples

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/3. Experiment and train models using features.ipynb?name=root-dir)]

      ### [Python SDK](#tab/python)
    
      Not applicable
    
      ### [Azure CLI](#tab/cli)
    
      Set up the CLI
    
      1. Install the Azure Machine Learning extension
    
         [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/3. Experiment and train models using features.ipynb?name=install-ml-ext-cli)]
    
      1. Authentication
    
         [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/3. Experiment and train models using features.ipynb?name=auth-cli)]
    
      1. Set the default subscription
    
         [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/3. Experiment and train models using features.ipynb?name=set-default-subs-cli)]
    
      ---

1. Initialize the project workspace variables

   This is the current workspace, and the tutorial notebook runs in this resource.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/3. Experiment and train models using features.ipynb?name=init-ws-crud-client)]

1. Initialize the feature store variables

   Make sure that you update the `featurestore_name` and `featurestore_location` values shown, to reflect what you created in part 1 of this tutorial.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/3. Experiment and train models using features.ipynb?name=init-fs-crud-client)]

1. Initialize the feature store consumption client

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/3. Experiment and train models using features.ipynb?name=init-fs-core-sdk)]

1. Create a compute cluster

   We'll create a compute cluster named `cpu-cluster` in the project workspace. We need this compute cluster when we run the training / batch inference jobs.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/3. Experiment and train models using features.ipynb?name=create-compute-cluster)]

## Create the accounts feature set locally

In tutorial part 1, we created a transactions feature set that had custom transformations. Here, we create an accounts feature set that uses precomputed values.

To onboard precomputed features, you can create a feature set spec without writing any transformation code. A feature set spec is a specification that we use to develop and test a feature set, in a fully local development environment. We don't need to connect to a feature store. In this step, you create the feature set spec locally, and then sample the values from it. For managed feature store capabilities, you must use a feature asset definition to register the feature set spec with a feature store. Later steps in this tutorial provide more details.

1. Explore the source data for the accounts

   > [!NOTE]
   > This notebook uses sample data hosted in a publicly-accessible blob container. Only a `wasbs` driver can read it in Spark. When you create feature sets using your own source data, please host those feature sets in an adls gen2 account, and use an `abfss` driver in the data path.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/3. Experiment and train models using features.ipynb?name=explore-accts-fset-src-data)]

1. Create the `accounts` feature set spec in local, from these precomputed features

   We don't need any transformation code here, because we reference precomputed features.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/3. Experiment and train models using features.ipynb?name=create-accts-fset-spec)]

1. Export as a feature set spec

   To register the feature set spec with the feature store, you must save the feature set spec in a specific format.

   Action: After you run the next cell, inspect the generated `accounts` feature set spec. To see the spec, open the `featurestore/featuresets/accounts/spec/FeatureSetSpec.yaml` file from the file tree to see the spec.

   The spec has these important elements:

   1. `source`: a reference to a storage resource, in this case, a parquet file in a blog storage resource
   
   1. `features`: a list of features and their datatypes. With provided transformation code (see the Day 2 section), the code must return a dataframe that maps to the features and datatypes. Without the provided transformation code (in this case, the generated `accounts` feature set spec, because it's precomputed), the system builds the query to map the features and datatypes to the source
   
   1. `index_columns`: the join keys required to access values from the feature set

   See the [top level feature store entities document](./concept-top-level-entities-in-managed-feature-store.md) and the [feature set spec yaml reference](./reference-yaml-featureset-spec.md) to learn more.

   As an extra benefit, persisting supports source control.

   We don't need any transformation code here, because we reference precomputed features.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/3. Experiment and train models using features.ipynb?name=dump-accts-fset-spec)]

## Locally experiment with unregistered features

As you develop features, you might want to locally test and validate them, before you register them with the feature store or run training pipelines in the cloud. A combination of a local unregistered feature set (`accounts`), and a feature set registered in the feature store (`transactions`), generates training data for the ML model.

1. Select features for the model

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/3. Experiment and train models using features.ipynb?name=select-unreg-features-for-model)]

1. Locally generate training data

   This step generates training data for illustrative purposes. As an option, you can locally train models here. Later steps in this tutorial explain how to train a model in the cloud.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/3. Experiment and train models using features.ipynb?name=gen-training-data-locally)]

1. Register the `accounts` feature set with the feature store

   After you locally experiment with different feature definitions, and they seem reasonable, you can register a feature set asset definition with the feature store.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/3. Experiment and train models using features.ipynb?name=reg-accts-fset)]

1. Get the registered feature set, and sanity test it

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/3. Experiment and train models using features.ipynb?name=sample-accts-fset-data)]

## Run a training experiment

In this step, you select a list of features, run a training pipeline, and register the model. You can repeat this step until the model performs as you'd like.

1. (Optional) Discover features from the feature store UI

   Part 1 of this tutorial covered this, when you registered the transactions feature set. Since you also have an accounts feature set, you can browse the available features:

   * Go to the [Azure Machine Learning global landing page](https://ml.azure.com/home?flight=FeatureStores).
   * In the left nav, select `feature stores`
   * The list of feature stores that you can access appears. Select the feature store that you created earlier.

   You can see the feature sets and entity that you created. Select the feature sets to browse the feature definitions. You can use the global search box to search for feature sets across feature stores.

1. (Optional) Discover features from the SDK

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/3. Experiment and train models using features.ipynb?name=discover-features-from-sdk)]

1. Select features for the model, and export the model as a feature-retrieval spec

   In the previous steps, you selected features from a combination of registered and unregistered feature sets, for local experimentation and testing. You can now experiment in the cloud. Your model shipping agility increases if you save the selected features as a feature-retrieval spec, and use the spec in the mlops/cicd flow for training and inference.

1. Select features for the model

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/3. Experiment and train models using features.ipynb?name=select-reg-features)]

1. Export selected features as a feature-retrieval spec

   > [!NOTE]
   > A **feature retrieval spec** is a portable definition of the feature list associated with a model. It can help streamline ML model development and operationalization. It will become an input to the training pipeline which generates the training data. Then, it will be packaged with the model. The inference phase uses it to look up the features. It becomes a glue that integrates all phases of the machine learning lifecycle. Changes to the training/inference pipeline can stay at a minimum as you experiment and deploy.

   Use of the feature retrieval spec and the built-in feature retrieval component is optional. You can directly use the `get_offline_features()` API, as shown earlier. The name of the spec should be **feature_retrieval_spec.yaml** when it's packaged with the model. This way, the system can recognize it.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/3. Experiment and train models using features.ipynb?name=export-as-frspec)]

## Train in the cloud with pipelines, and register the model

In this step, you manually trigger the training pipeline. In a production scenario, a ci/cd pipeline could trigger it, based on changes to the feature-retrieval spec in the source repository. You can register the model if it's satisfactory.

1. Run the training pipeline

   The training pipeline has these steps:

   1. Feature retrieval: For its input, this built-in component takes the feature retrieval spec, the observation data, and the timestamp column name. It then generates the training data as output. It runs these steps as a managed spark job.
   
   1. Training: Based on the training data, this step trains the model, and then generates a model (not yet registered)
   
   1. Evaluation: This step validates whether or not the model performance and quality fall within a threshold (in our case, it's a placeholder/dummy step for illustration purposes)
   
   1. Register the model: This step registers the model

      > [!NOTE]
      > In part 2 of this tutorial, you ran a backfill job to materialize data for the `transactions` feature set. The feature retrieval step reads feature values from the offline store for this feature set. The behavior will be the same, even if you use the `get_offline_features()` API.

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/3. Experiment and train models using features.ipynb?name=run-training-pipeline)]

   1. Inspect the training pipeline and the model

   1. Open the above pipeline, and run "web view" in a new window to see the pipeline steps.

1. Use the feature retrieval spec in the model artifacts

   1. In the left nav of the current workspace, select `Models`
   1. Select open in a new tab or window
   1. Select **fraud_model**
   1. In the top nav, select Artifacts

   The feature retrieval spec is packaged along with the model. The model registration step in the training pipeline handled this step. You created the feature retrieval spec during experimentation. Now it became part of the model definition. In the next tutorial, you'll see how inferencing uses it.

## View the feature set and model dependencies

1.  View the list of feature sets associated with the model

    In the same models page, select the `feature sets` tab. This tab shows both the `transactions` and the `accounts` feature sets on which this model depends.

1. View the list of models that use the feature sets

   1. Open the feature store UI (explained earlier in this tutorial)
   1. Select `Feature sets` on the left nav
   1. Select a feature set
   1. Select the `Models` tab

   You can see the list of models that use the feature sets. The feature retrieval spec determined this list when the model was registered.

## Cleanup

The Tutorial #4 [clean up step](./tutorial-enable-recurrent-materialization-run-batch-inference.md#cleanup) describes how to delete the resources

## Next steps

* Understand concepts: [feature store concepts](./concept-what-is-managed-feature-store.md), [top level entities in managed feature store](./concept-top-level-entities-in-managed-feature-store.md)
* [Understand identity and access control for feature store](./how-to-setup-access-control-feature-store.md)
* [View feature store troubleshooting guide](./troubleshooting-managed-feature-store.md)
* Reference: [YAML reference](./reference-yaml-overview.md)