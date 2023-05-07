---
title: "Four Part Tutorial: Training (preview)"
titleSuffix: Azure ML managed Feature Store - Basics
description: Managed Feature Store tutorial. 
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: tutorial
author: rsethur
ms.author: seramasu
ms.date: 05/05/2023
ms.reviewer: franksolomon
ms.custom: sdkv2

#Customer intent: As a professional data scientist, I want to know how to build and deploy a model with Azure Machine Learning by using Python in a Jupyter Notebook.
---

# Tutorial #3: Experiment and train models using features (preview)

> [!IMPORTANT]
> This feature is currently in public preview. This preview version is provided without a service-level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

In this tutorial series you will learn how features seamlessly integrate all phases of the ML lifecycle: feature prototyping, training and operationalization.

Part 1 of this tutorial showed how to create a feature set spec with custom transformations. Part 2 of the tutorial showed how to enable materialization and perform a backfull. This tutorial will show how to experiment with features, to improve model performance. You'll see how a feature store increases agility in the experimentation and training flows.

Here in Tutorial part 3, you'll learn how to:

* Prototype a create new `accounts` feature set spec, using existing precomputed values as features. You will then Register the local feature set spec as a feature set in the feature store. This differs from part 1 of the tutorial, where we created a feature set that had custom transformations.
* Select features for the model. You will select features from the `transactions` and `accounts` feature sets, and save them as a feature-retrieval spec.
* Run a training pipeline that uses the feature retrieval spec to train a new model. This pipeline will use the built-in feature-retrieval component, to generate the training data.

## Prerequisites: Configure an AzureML Spark Notebook

- Ensure you have executed part 1 and 2 of the tutorial.

## Setup

### Configure the Azure ML spark notebook

1. At the "Compute" dropdown in the top nav, select "AzureML Spark Compute". Note that it might show "Ready" there, but the spark session is created only after you execute the next steps.

      * Select "configure session" in the bottom nav
      * Select **upload conda file**
      * Select file `azureml-examples/sdk/python/featurestore-sample/project/env/conda.yml` from your local device
      * Increase the session time out (idle time) to avoid frequent prerequisite re-runs

#### Start the spark session

[Start the spark session code sample](~/azureml-examples-featurestore/sdk/python/featurestore_sample/3.%20training.ipynb?name=start-spark-session)

#### Set up the samples root directory

[Start the samples root directory code sample](~/azureml-examples-featurestore/sdk/python/featurestore_sample/3.%20training.ipynb?name=root-dir)

#### Initialize the project workspace CRUD client

The tutorial notebook will run from this current workspace

[Initialize the project workspace CRUD client code sample](~/azureml-examples-featurestore/sdk/python/featurestore_sample/3.%20training.ipynb?name=init-ws-crud-client)

#### Initialize the feature store CRUD client

Ensure you update the `featurestore_name` to reflect what you created in part 1 of this tutorial

[Initialize the Feature Store CRUD client code sample](~/azureml-examples-featurestore/sdk/python/featurestore_sample/3.%20training.ipynb?name=init-fs-crud-client)

#### Initialize the feature store consumption client

[Start the feature store consumption client code sample](~/azureml-examples-featurestore/sdk/python/featurestore_sample/3.%20training.ipynb?name=init-fs-core-sdk)

#### In the project workspace, create a compute cluster named cpu-cluster

We'll run training/batch inference jobs that rely on this compute cluster

[Start the create a compute cluster code sample](~/azureml-examples-featurestore/sdk/python/featurestore_sample/3.%20training.ipynb?name=create-compute-cluster)

## Step 1: Locally create an accounts feature set from precomputed data

In tutorial part 1, we created a transactions feature set that had custom transformations. Now, we'll create an accounts feature set that uses precomputed values.

To onboard precomputed features, you can create a feature set spec without writing any transformation code. A feature set spec, or specification, is a specification to develop and test a feature set, in a fully local development environment, without a connection to a featurestore. In this step, you'll create the feature set spec locally, and sample the values from it. If you want to get managed feature store capabilities, you must use a feature asset definition to register the feature set spec with a feature store. A future step of this tutorial will cover this topic.

### Step 1a: Explore the source data for accounts

> [!Note]
> The sample data used in this notebook is hosted in a public accessible blob container. It can only be read in Spark via wasbs driver. When you create feature sets using your own source data, please host them in adls gen2 account and use abfss driver in the data path.

[Explore the source data for accounts code sample](~/azureml-examples-featurestore/sdk/python/featurestore_sample/3.%20training.ipynb?name=explore-accts-fset-src-data)

### Step 1b: Create an `accounts` feature set spec in local from these precomputed features

This will not require transformation code because we reference precomputed features.

[Create an `accounts` feature set spec code sample](~/azureml-examples-featurestore/sdk/python/featurestore_sample/3.%20training.ipynb?name=create-accts-fset-spec)

Action: Please inspect the generated `accounts` FeaturesetSpec file. Open this file from the file tree to see the spec: `featurestore/featuresets/accounts/spec/FeaturesetSpec.yaml`

The spec contains these important elements:

1. source: a reference to a storage - in this case, a parquet file in a blob storage.
1. features: a list of features and their datatypes. If you provide transformation code (see the Day 2 section), the code must return a dataframe that maps to the features and datatypes. If the system does not receive the transformation code (as in this case of accounts, because it is precomputed), the system will build the query to map these to the source
1. index_columns: the join keys required to access values from the feature set

## Step 2: Experiment with unregistered features locally and register with feature store when ready

In feature development, you might want to locally test and validate before proceeding with feature store registration, or execution of cloud training pipelines. In this step, you'll generate training data for the ML model from a combination of features that includes a local unregistered feature set (accounts), and a feature set registered in the feature store (transactions).

### Step 2a: Select model features

[Select model features code sample](~/azureml-examples-featurestore/sdk/python/featurestore_sample/3.%20training.ipynb?name=select-unreg-features-for-model)

### Step 2b: Locally generate training data

In this step, we'll generate training data for illustrative purposes. You can optionally train models locally with this. Later in this tutorial, you'll train a model in the cloud.

[Locally generate training data code sample](~/azureml-examples-featurestore/sdk/python/featurestore_sample/3.%20training.ipynb?name=gen-training-data-locally)

### Step 2c: Register the `accounts` feature set with the featurestore

After you locally experiment with different feature definitions and sanity tested them, you can register them with the feature store. To do this, you'll register a feature set asset definition with the feature store.

[Register the accounts feature set code sample](~/azureml-examples-featurestore/sdk/python/featurestore_sample/3.%20training.ipynb?name=reg-accts-fset)

### Step 2d: Get the registered feature set, and sanity test it

[Get the registered feature set code sample](~/azureml-examples-featurestore/sdk/python/featurestore_sample/3.%20training.ipynb?name=sample-accts-fset-data)

## Step 3: Run a training experiment

In this step, you'll select a list of features, run a training pipeline, and register the model. You can repeat this step until you are happy with the model performance.

### (Optional) Step 3a: Discover features from the feature store UI

You already did this in part 1 of the tutorial, after you registered the transactions feature set. Since you also have the accounts feature set, you can browse the available features:

* Go to the [Azure ML global landing page](https://ml.azure.com/home?flight=FeatureStoresPrPr,FeatureStoresPuPr)
* In the left nav, select `Feature stores`
* You'll see a list of feature stores that you can access. Select the feature store that you created in the steps above.

You can see the feature sets and entity that you created. Select feature sets to browse the feature definitions. You can also use the global search box to search for feature sets across feature stores.

### (Optional) Step 3b: Discover features from the SDK

[Discover features from the SDK code sample](~/azureml-examples-featurestore/sdk/python/featurestore_sample/3.%20training.ipynb?name=discover-features-from-sdk)

### Step 3c: Select features for the model, and export it as a feature-retrieval spec

In the previous steps, you selected features from a combination of registered and unregistered feature sets, for local experimentation and testing. Now you can experiment in the cloud. Saving the selected features as a feature-retrieval spec and using that spec in the mlops / cicd flow, for training and inference, increases your agility as you ship models.

Select features for the model

[Select features for the model code sample](~/azureml-examples-featurestore/sdk/python/featurestore_sample/3.%20training.ipynb?name=select-reg-features)

Export selected features as a feature-retrieval spec

> [!Note]
> A feature retrieval spec is a portable definition of a feature list associated with a model. This can help streamline ML model development and operationalization. This will become an input to the training pipeline, which generates the training data. It will be packaged along with the model, and during inference, it looks up the features. It becomes a glue that integrates all phases of the ML lifecycle. Changes to the training and inference pipeline can be kept minimal as you experiment and deploy.

Use of the feature retrieval spec and the built-in feature retrieval component is optional. You can directly use the `get_offline_features()` api as shown above.

For the system to recognize the name of the spec when it is packaged with the model, the spec should have the name `feature_retrieval_spec.yaml`.

[Export selected features as a feature-retrieval spec code sample](~/azureml-examples-featurestore/sdk/python/featurestore_sample/3.%20training.ipynb?name=export-as-frspec)

## Step 4: Train in the cloud using pipelines, and register the model if satisfactory

In this step, you'll manually trigger the training pipeline. A ci/cd pipeline could trigger this in a production scenario based on changes to the feature-retrieval spec in the source repository.

### Step 4a: Run the training pipeline

The training pipeline has these steps:

1. Feature retrieval step: This a built-in component takes the feature retrieval spec, the observation data, and the timestamp column name, all as input. Then, it generates the training data as output. It runs this as a managed spark job.
1. Training step: This step trains the model based on the training data, and generates a model (not yet registered)
1. Evaluation step: This step validates whether or not the model performance and /quality falls within the threshold (here, it works as a placeholder / dummy step for illustration purposes)
1. Register model step: This step registers the model

In part 2 of this tutorial, you ran a backfill job to materialize data for a transactions feature set. The feature retrieval step will read feature values from an offline store for this feature set. The behavior will be the same even if you use the `get_offline_features()` api.

[Run the training pipeline code sample](~/azureml-examples-featurestore/sdk/python/featurestore_sample/3.%20training.ipynb?name=run-training-pipeline)

Inspect the training pipeline and the model

Open the pipeline run "web view" in a new window to see the steps in the pipeline.

#### Step 4b: Examine the feature retrieval spec in the model artifacts

1. In the left nav of the current workspace, select Models, to open in a new tab or window
1. Select `fraud_model`
1. In the top nav, select `Artifacts`

Notice that the feature retrieval spec is packaged along with the model. The model registration step in the training pipeline has done this. You created a feature retrieval spec during experimentation, which has become part of the model definition. The next tutorial will show how inferencing uses this.

## Step 5: View the feature set and model dependencies

### Step 5a: View the list of feature sets associated with the model

In the same models page, select the `feature sets` tab. This shows both the `transactions` and `accounts` featuresets on which this model depends.

### Step 5b: View the list of models using the feature sets

1. Open the feature store UI (described earlier in this tutorial)
1. In the left nav, select `Feature sets`
1. Select any feature set
1. Select the Models tab

You can see the list of models that are using the feature sets (determined from the feature retrieval spec when the model was registered).

## Cleanup

Part 4 of this tutorial describes how to delete the resources

## Next steps

* Part 4: run a batch inference pipeline with a feature store
* Understand concepts: feature store concepts, feature transformation concepts
* Understand identity and access control for feature store
* View feature store troubleshooting guide
* Reference: YAML reference, feature store SDK