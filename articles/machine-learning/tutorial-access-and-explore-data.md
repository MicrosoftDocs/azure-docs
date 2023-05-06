---
title: "Four Part Tutorial: Hello, World (preview)"
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

# Tutorial #1: Hello World: Develop and register a feature set with Managed Feature Store (preview)

> [!IMPORTANT]
> This feature is currently in public preview. This preview version is provided without a service-level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

With the Azure ML managed feature store, you can discover, create and operationalize features. Features serve as the connective tissue in the ML lifecycle, starting from prototyping phase, where you experiment with various features, to the operationalization phase. In this phase, models are deployed and feature data is referenced during inference. For information about the basic feature store concept, see [feature store concepts](https://github.com/Azure/featurestore-prp/blob/9f4ce118fbc22d19099c0fa1a31783fc9a8d7fb3/featurestore_sample/fs-concepts).

This tutorial is the first part of a three part series. In this tutorial, you'll learn how to:

* Create a new minimal feature store resource
* Develop and locally test a featureset with feature transformation capability
* Register a feature store entity with the feature store
* Register the featureset that you developed with the feature store
* Generate a sample training dataframe using the features you created

## Prerequisites: Configure an AzureML Spark Notebook

Before you proceed with this article, make sure you cover these prerequisites:

* An Azure Machine Learning workspace. If you don't have one, see the [Quickstart: Create workspace resources](https://learn.microsoft.com/en-us/azure/machine-learning/quickstart-create-resources?view=azureml-api-2) article to create one

* To perform the steps in this article, your user account must be assigned the owner or contributor role to a resource group where the feature store will be created

## Setup

### Prepare the notebook environment for development
Note: This tutorial uses AzureML spark notebook for development. (Placeholder: link to ADB document once ready)

1. Clone the examples repository to your local machine: To run the tutorial, first clone the [examples repository - (azureml-examples)](https://github.com/azure/azureml-examples) with this command:

   `git clone --depth 1 https://github.com/Azure/azureml-examples`

   You can also download a zip file from the [examples repository (azureml-examples)](https://github.com/azure/azureml-examples). At this page, first select the `code` dropdown, and then select `Download ZIP`. Then, unzip the contents into a folder on your local device.

1. Upload the feature store samples directory to project workspace.
      * Open Azure ML studio UI of your Azure ML workspace
      * Select **Notebooks** in left nav
      * Select your user name in the directory listing
      * Select **upload folder**
      * Select the feature store samples folder from the cloned directory path: `azureml-examples/sdk/python/featurestore-sample`

1. You can create a new notebook, and proceed and execute the instructions in this document step by step. You can also open the existing notebook named `hello_world.ipynb` notebook, and execute its individual cells step by step, one at a time. Keep this document open and refer to it for detailed explanation of the steps.

1. Enable preview access of managed spark: (To be removed in final draft)

      1. Select the "manage preview features" icon (this icon looks like an announcement icon) in the top right nav of this screen
      1. To enable access, select "Run notebooks and jobs on managed spark". If you have any issues, see detailed steps [here](https://learn.microsoft.com/en-us/azure/machine-learning/interactive-data-wrangling-with-apache-spark-azure-ml#prerequisites) - you only need to enable the managed Spark preview access feature for now

1. Select **AzureML Spark Compute** in the top nav "Compute" dropdown. This operation might take one to two minutes. Wait for a status bar in the top to display **configure session**.

      1. Select **configure session**
      1. Select **Upload conda file**
      1. Select file `azureml-examples/sdk/python/featurestore-sample/project/env/conda.yml` located on your local device
      1. Increase the session time out (idle time) to reduce the serverless spark cluster startup time.

      1. **Important:** Except for this step, you need to run all the other steps every time you have a new spark session/session time out

#### Start Spark Session

[Start the Spark session code sample](~/azureml-examples-featurestore/sdk/python/featurestore_sample/1.%20hello_world.ipnyb?name=start-spark-session)

[Quickstart: Create workspace resources](https://learn.microsoft.com/en-us/azure/machine-learning/quickstart-create-resources?view=azureml-api-2)

#### Set up the root directory for the samples

[Set up the root directory for the samples code sample](~/azureml-examples-featurestore/sdk/python/featurestore_sample/1.%20hello_world.ipnyb?name=root-dir)

> [!Note]
> Feature store Vs Project workspace: You''ll use a featurestore to reuse features across projects. You'll use a project workspace (the current workspace) to train and inference models, by leveraging features from feature stores. Many project workspaces can share and reuse the same feature store.

> [!Note]
> This tutorial uses two SDK's:
>
> 1. The Feature Store CRUD SDK
>
>    * You'll use the same MLClient (package name `azure-ai-ml`) SDK that you use with the Azure ML workpace. Feature store is implemented as a type of workspace. As a result, this SDK is used for feature store CRUD operations (Create, Update and Delete), for featurestore, featureset and featurestore-entity.
>
> 2. The feature store core sdk
>
>    * This SDK (`azureml-featurestore`) is intended for feature set development and consumption (you'll learn more about these operations later):
>
   >    - List/Get registered feature set
   >    - Generate/resolve feature retrieval spec
   >    - Execute a featureset definition, to generate Spark dataframe
   >    - Generate training using a point-in-time join
>
> This tutorial does not require explicit installation of these SDK's, since the instructions already explain the process. The **conda YAML** instructions in the earlier step cover this.

## Step 1: Create a minimal feature store

### Step 1a: Set feature store parameters

Set name, location, and other values for the feature store

[Set the feature store parameters code sample](~/azureml-examples-featurestore/sdk/python/featurestore_sample/1.%20hello_world.ipnyb?name=fs-params)

### Step 1b: Create the feature store

[Create the feature store code sample](~/azureml-examples-featurestore/sdk/python/featurestore_sample/1.%20hello_world.ipnyb?name=create-fs)

### Step 1c: Initialize AzureML feature store core SDK client

As explained above, this develops and consumes features

[Initialize the Azure ML feature store core SDK code sample](~/azureml-examples-featurestore/sdk/python/featurestore_sample/1.%20hello_world.ipnyb?name=init-fs-core-sdk)

## Step 2: Prototype and develop a transaction rolling aggregation featureset in this notebook

### Step 2a: Explore the transactions source data

> [!Note]
> This notebook uses sample data hosted in a publicly-accessible blob container. It can only be read into Spark with a `wasbs` driver. When you create feature sets using your own source data, please host them in an adls gen2 account, and use an `abfss` driver in the data path.

[Explore the transactions source data code sample](~/azureml-examples-featurestore/sdk/python/featurestore_sample/1.%20hello_world.ipnyb?name=explore-txn-src-data)

### Step 2b: Locally develop a transactions feature set

A feature set specification is a self-contained feature set definition that you can locally develop and test.

We'll create these rolling window aggregate features:

- transactions 3-day count
- transactions amount 3-day sum
- transactions amount 3-day avg
- transactions 7-day count
- transactions amount 7-day sum
- transactions amount 7-day avg

**Action:**

- Inspect the feature transformation code file: featurestore/featuresets/`transactions/spec/code/transaciton_transform.py`. You'll see the rolling aggregation defined for the features. This is a spark transformer.

See [feature store concepts](https://github.com/Azure/featurestore-prp/blob/9f4ce118fbc22d19099c0fa1a31783fc9a8d7fb3/featurestore_sample/fs-concepts-url-todo) and [transformation concepts](https://github.com/Azure/featurestore-prp/blob/9f4ce118fbc22d19099c0fa1a31783fc9a8d7fb3/featurestore_sample/fs-transformation-concepts-todo) to learn more about the feature set and transformations.

[Locally develop a transactions featureset code sample](~/azureml-examples-featurestore/sdk/python/featurestore_sample/1.%20hello_world.ipnyb?name=develop-txn-fset-locally)

## Step 3: Register a feature-store entity

As a best practice, entities help enforce use of the same join key definition across featuresets which use the same logical entities. Examples of entities can include accounts, customers, etc. Entities are typically created once, and then re-used across featuresets. For information on basics concept of feature store, see [feature store concepts](https://github.com/Azure/featurestore-prp/blob/9f4ce118fbc22d19099c0fa1a31783fc9a8d7fb3/featurestore_sample/fs-concepts).

### Step 3a: Explore the transactions source data

As explained earlier in this tutorial, MLClient is used for CRUD of feature store assets. [This code sample](~/azureml-examples-featurestore/sdk/python/featurestore_sample/1.%20hello_world.ipnyb?name=init-fset-crud-client) searches for the feature store we created in an earlier step. Here, we cannot reuse the same ml_client used above because the earlier ml_client is scoped at the resource group level. This is a prerequisite for feature store creation. In the he below one is scoped at feature store level.

### Step 3a: Register the `account` entity with the feature store

Create an account entity that has the join key `accountID`, of type string.

[Code sample](~/azureml-examples-featurestore/sdk/python/featurestore_sample/1.%20hello_world.ipnyb?name=register-acct-entity)

## Step 4: Register the transaction featureset with the featurestore

You register a feature set with the feature store so that you can share and reuse with others. This offers managed capabilities like versioning and materialization. We'll learn more about these capabilities in this tutorial series.

You also register a feature set asset with the feature store. This has a reference to the feature retrieval spec, and offers version, materialization, etc. as additional properties.

[Register the transaction featureset with the featurestore code sample](~/azureml-examples-featurestore/sdk/python/featurestore_sample/1.%20hello_world.ipnyb?name=register-txn-fset)

### Explore the FeatureStore UI

* Open the [Azure ML global landing page](https://ml.azure.com/home?flight=FeatureStoresPrPr,FeatureStoresPuPr). **(todo PuP: remove flight url)**
* Select `Feature stores` in the left nav
* You'll see the list of feature stores that you can access. Select on the feature store that you created above.

This shows the feature set and entity that you created.

> [!Note]:
> Creating and updating feature store assets are possible only through SDK and CLI. You can use the UI to search/browse the feature store.

## Step 5: Generate a training data dataframe using the registered features

### Step 5a: Load observation data

First, we'll explore the observation data. Observation data typically involves the core data used in training and inferencing. Then, this data joins with the feature data to create the full training data. Observation data is the data captured during the time of the event. Here, it has core transaction data including transaction id, account id, AND transaction amount. Since we use it for training, it also has the target variable appended (**is_fraud**).

See [feature store concepts](https://github.com/Azure/featurestore-prp/blob/9f4ce118fbc22d19099c0fa1a31783fc9a8d7fb3/featurestore_sample/fs-concepts-link-todo) to learn more about core concepts, including observation data.

[Load observation data code sample](~/azureml-examples-featurestore/sdk/python/featurestore_sample/1.%20hello_world.ipnyb?name=load-obs-data)

### Step 5c: Get the registered featureset and list its features

[Get the registered featureset and list its features code sample](~/azureml-examples-featurestore/sdk/python/featurestore_sample/1.%20hello_world.ipnyb?name=get-txn-fset)

[Print sample values code sample](~/azureml-examples-featurestore/sdk/python/featurestore_sample/1.%20hello_world.ipnyb?name=print-txn-fset-sample-values)

### Step 5d: Select features and generate training data

Here, we'll select features that will become part of the training data, and we'll use the feature store sdk to generate the training data.

[Select features and generate training data code sample](~/azureml-examples-featurestore/sdk/python/featurestore_sample/1.%20hello_world.ipnyb?name=select-features-and-gen-training-data)

A [point-in-time](https://github.com/Azure/featurestore-prp/blob/9f4ce118fbc22d19099c0fa1a31783fc9a8d7fb3/featurestore_sample/fs-concepts-todo#pitjoin) join appends the features to the training data.

This tutorial built the training data with features from feature store. You can save it to storage for later use, or you can run model training on it directly.

## Cleanup

Part 4 of this tutorial describes how to delete the resources

## Next steps

* Part 2: run training pipeline with feature store
* Understand concepts: feature store concepts, feature transformation concepts
* Understand identity and access control for feature store
* View feature store troubleshooting guide
* Reference: YAML reference, feature store SDK