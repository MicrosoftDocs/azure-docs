---
title: "Four Part Tutorial: Get Started with Feature Store (preview)"
titleSuffix: Azure ML managed Feature Store - Basics
description: Managed Feature Store tutorial part 1. 
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

# Tutorial #1: Hello World: develop and register a feature set with managed feature store (preview)

> [!IMPORTANT]
> This feature is currently in public preview. This preview version is provided without a service-level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

With the Azure Machine Learning managed feature store, you can discover, create and operationalize features. Features serve as the connective tissue in the ML lifecycle, starting from prototyping phase, where you experiment with various features, to the operationalization phase. In this phase, models are deployed and feature data is referenced during inference. For information about the basic feature store concept, see [feature store concepts](https://github.com/Azure/featurestore-prp/blob/9f4ce118fbc22d19099c0fa1a31783fc9a8d7fb3/featurestore_sample/fs-concepts).

This tutorial is the first part of a four part series. In this tutorial, you'll learn how to:

* Create a new minimal feature store resource
* Develop and locally test a feature set with feature transformation capability
* Register a feature store entity with the feature store
* Register the feature set that you developed with the feature store
* Generate a sample training dataframe using the features you created

## Prerequisites: Configure an Azure Machine Learning Spark notebook

Before you proceed with this article, make sure you cover these prerequisites:

* An Azure Machine Learning workspace. If you don't have one, see the [Quickstart: Create workspace resources](./quickstart-create-resources?view=azureml-api-2) article to create one

* To perform the steps in this article, your user account must be assigned the owner or contributor role to a resource group where the feature store will be created

## Setup

### Prepare the notebook environment for development
Note: This tutorial uses Azure Machine Learning spark notebook for development. (Placeholder: link to ADB document once ready)

1. Clone the examples repository to your local machine: To run the tutorial, first clone the [examples repository - (azureml-examples)](https://github.com/azure/azureml-examples) with this command:

   `git clone --depth 1 https://github.com/Azure/azureml-examples`

   You can also download a zip file from the [examples repository (azureml-examples)](https://github.com/azure/azureml-examples). At this page, first select the `code` dropdown, and then select `Download ZIP`. Then, unzip the contents into a folder on your local device.

1. Upload the feature store samples directory to project workspace.
      * Open Azure Machine Learning studio UI of your Azure Machine Learning workspace
      * Select **Notebooks** in left nav
      * Select your user name in the directory listing
      * Select **upload folder**
      * Select the feature store samples folder from the cloned directory path: `azureml-examples/sdk/python/featurestore-sample`

1. You can create a new notebook, and proceed and execute the instructions in this document step by step. You can also open the existing notebook named `hello_world.ipynb` notebook, and execute its individual cells step by step, one at a time. Keep this document open and refer to it for detailed explanation of the steps.

1. Enable preview access of managed spark: (To be removed in final draft)

      1. Select the "manage preview features" icon (this icon looks like an announcement icon) in the top right nav of this screen
      1. To enable access, select "Run notebooks and jobs on managed spark". If you have any issues, see detailed steps [here](./interactive-data-wrangling-with-apache-spark-azure-ml.md#prerequisites) - you only need to enable the managed Spark preview access feature for now

1. Select **AzureML Spark compute** in the top nav "Compute" dropdown. This operation might take one to two minutes. Wait for a status bar in the top to display **configure session**.

      1. Select **configure session**
      1. Select **Upload conda file**
      1. Select file `azureml-examples/sdk/python/featurestore-sample/project/env/conda.yml` located on your local device
      1. Increase the session time-out (idle time) to reduce the serverless spark cluster startup time.

      1. **Important:** Except for this step, you need to run all the other steps every time you have a new spark session/session time out

#### Start Spark Session

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/1. hello_world.ipynb?name=start-spark-session)]

[Quickstart: Create workspace resources](./quickstart-create-resources.md?view=azureml-api-2?view=azureml-api-2)

#### Set up the root directory for the samples

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/1. hello_world.ipynb?name=root-dir)]

> [!Note]
> Feature store Vs Project workspace: You'll use a feature store to reuse features across projects. You'll use a project workspace (the current workspace) to train and inference models, by leveraging features from feature stores. Many project workspaces can share and reuse the same feature store.

> [!Note]
> This tutorial uses two SDK's:
>
> 1. The Feature Store CRUD SDK
>
>    * You'll use the same MLClient (package name `azure-ai-ml`) SDK that you use with the Azure ML workpace. Feature store is implemented as a type of workspace. As a result, this SDK is used for feature store CRUD operations (Create, Update and Delete), for feature store, feature set and feature store entity.
>
> 2. The feature store core sdk
>
>    * This SDK (`azureml-featurestore`) is intended for feature set development and consumption (you'll learn more about these operations later):
>
   >    - List/Get registered feature set
   >    - Generate/resolve feature retrieval spec
   >    - Execute a feature set definition, to generate Spark dataframe
   >    - Generate training using a point-in-time join
>
> This tutorial does not require explicit installation of these SDK's, since the instructions already explain the process. The **conda YAML** instructions in the earlier step cover this.

## Step 1: Create a minimal feature store

### Step 1a: Set feature store parameters

Set name, location, and other values for the feature store

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/1. hello_world.ipynb?name=fs-params)]

### Step 1b: Create the feature store

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/1. hello_world.ipynb?name=create-fs)]

### Step 1c: Initialize Azure Machine Learning feature store core SDK client

As explained earlier in this tutorial, the feature store core SDK client develops and consumes features

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/1. hello_world.ipynb?name=init-fs-core-sdk)]

## Step 2: Prototype and develop a transaction rolling aggregation feature set in this notebook

### Step 2a: Explore the transactions source data

> [!Note]
> This notebook uses sample data hosted in a publicly-accessible blob container. It can only be read into Spark with a `wasbs` driver. When you create feature sets using your own source data, please host them in an adls gen2 account, and use an `abfss` driver in the data path.

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/1. hello_world.ipynb?name=explore-txn-src-data)]

### Step 2b: Locally develop a transactions feature set

A feature set specification is a self-contained feature set definition that you can locally develop and test.

We'll create these rolling window aggregate features:

- transactions three-day count
- transactions amount three-day sum
- transactions amount three-day avg
- transactions seven-day count
- transactions amount seven-day sum
- transactions amount seven-day avg

**Action:**

- Inspect the feature transformation code file: `featurestore/featuresets/transactions/spec/code/transaciton_transform.py`. Note the rolling aggregation defined for the features. This is a spark transformer.

See [feature store concepts](https://github.com/Azure/featurestore-prp/blob/9f4ce118fbc22d19099c0fa1a31783fc9a8d7fb3/featurestore_sample/fs-concepts-url-todo) and [transformation concepts](https://github.com/Azure/featurestore-prp/blob/9f4ce118fbc22d19099c0fa1a31783fc9a8d7fb3/featurestore_sample/fs-transformation-concepts-todo) to learn more about the feature set and transformations.

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/1. hello_world.ipynb?name=develop-txn-fset-locally)]

## Step 3: Register a feature-store entity

As a best practice, entities help enforce use of the same join key definition across feature sets that use the same logical entities. Examples of entities can include accounts, customers, etc. Entities are typically created once, and then reused across feature sets. For information on basics concept of feature store, see [feature store concepts](https://github.com/Azure/featurestore-prp/blob/9f4ce118fbc22d19099c0fa1a31783fc9a8d7fb3/featurestore_sample/fs-concepts).

### Step 3a: Explore the transactions source data

As explained earlier in this tutorial, MLClient is used for CRUD of feature store assets. [!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/1. hello_world.ipynb?name=dump-transactions-fs-spec)] searches for the feature store we created in an earlier step. Here, we can't reuse the same ml_client used earlier in this tutorial, because the earlier ml_client is scoped at the resource group level. This is a prerequisite for feature store creation. The one following is scoped at feature store level.

### Step 3a: Register the `account` entity with the feature store

Create an account entity that has the join key `accountID`, of type string.

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/1. hello_world.ipynb?name=init-fset-crud-client)]

## Step 4: Register the transaction feature set with the feature store

You register a feature set with the feature store so that you can share and reuse with others. This offers managed capabilities like versioning and materialization. We'll learn more about these capabilities in this tutorial series.

You also register a feature set asset with the feature store. This has a reference to the feature retrieval spec, and offers version, materialization, etc. as more properties.

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/1. hello_world.ipynb?name=register-acct-entity)]

### Explore the feature store UI

* Open the [Azure Machine Learning global landing page](https://ml.azure.com/home?flight=FeatureStoresPrPr,FeatureStoresPuPr). **(todo PuP: remove flight url)**
* Select `Feature stores` in the left nav
* Note the list of accessible features. Select on the feature store that you created earlier in this tutorial.

This shows the feature set and entity that you created.

> [!Note]
> Creating and updating feature store assets are possible only through SDK and CLI. You can use the UI to search/browse the feature store.

## Step 5: Generate a training data dataframe using the registered features

### Step 5a: Load observation data

First, we'll explore the observation data. Observation data typically involves the core data used in training and inferencing. Then, this data joins with the feature data to create the full training data. Observation data is the data captured during the time of the event. Here, it has core transaction data including transaction ID, account ID, AND transaction amount. Since we use it for training, it also has the target variable appended (**is_fraud**).

See [feature store concepts](https://github.com/Azure/featurestore-prp/blob/9f4ce118fbc22d19099c0fa1a31783fc9a8d7fb3/featurestore_sample/fs-concepts-link-todo) to learn more about core concepts, including observation data.

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/1. hello_world.ipynb?name=register-txn-fset)]

### Step 5c: Get the registered feature set and list its features

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/1. hello_world.ipynb?name=load-obs-data)]

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/1. hello_world.ipynb?name=get-txn-fset)]

### Step 5d: Select features and generate training data

Here, we select features that become part of the training data, and we use the feature store sdk to generate the training data.

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/1. hello_world.ipynb?name=print-txn-fset-sample-values)]

A point-in-time join appends the features to the training data.

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/1. hello_world.ipynb?name=select-features-and-gen-training-data)]

This tutorial built the training data with features from feature store. You can save it to storage for later use, or you can run model training on it directly.

## Cleanup

Part 4 of this tutorial describes how to delete the resources

## Next steps

* Part 2: run training pipeline with feature store
* Understand concepts: feature store concepts, feature transformation concepts
* Understand identity and access control for feature store
* View feature store troubleshooting guide
* Reference: YAML reference, feature store SDK