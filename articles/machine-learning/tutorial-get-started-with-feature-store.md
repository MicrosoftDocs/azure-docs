---
title: "Tutorial #1: develop and register a feature set with managed feature store (preview)"
titleSuffix: Azure ML managed Feature Store - Basics
description: Managed Feature Store tutorial part 1. 
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: tutorial
author: rsethur
ms.author: seramasu
ms.date: 05/09/2023
ms.reviewer: franksolomon
ms.custom: sdkv2, build-2023
#Customer intent: As a professional data scientist, I want to know how to build and deploy a model with Azure Machine Learning by using Python in a Jupyter Notebook.
---

# Tutorial #1: develop and register a feature set with managed feature store (preview)

> [!IMPORTANT]
> This feature is currently in public preview. This preview version is provided without a service-level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Azure Machine Learning managed feature store lets you discover, create and operationalize features. The machine learning lifecycle involves the prototyping phase, where you experiment with various features. It also involves the operationalization phase, where models are deployed and inference looks up feature data. Features serve as the connective tissue in the machine learning lifecycle. For information about the basic feature store concepts, see [what is managed feature store](./concept-what-is-managed-feature-store.md) and [top level entities in managed feature store](./concept-top-level-entities-in-managed-feature-store.md).

This tutorial is the first part of a four part series. In this tutorial, you'll learn how to:

* Create a new minimal feature store resource
* Develop and locally test a feature set with feature transformation capability
* Register a feature store entity with the feature store
* Register the feature set that you developed with the feature store
* Generate a sample training dataframe using the features you created

## Prerequisites

Before you proceed with this article, make sure you cover these prerequisites:

* An Azure Machine Learning workspace. If you don't have one, see the [Quickstart: Create workspace resources](./quickstart-create-resources.md) article to create one

* To perform the steps in this article, your user account must be assigned the owner or contributor role to a resource group where the feature store is created

(Optional): If you use a new resource group for this tutorial, you can easily delete all the resource by deleting the resource group

## Setup

### Prepare the notebook environment for development
Note: This tutorial uses Azure Machine Learning spark notebook for development.

1. Clone the examples repository to your local machine: To run the tutorial, first clone the [examples repository - (azureml-examples)](https://github.com/azure/azureml-examples) with this command:

   `git clone --depth 1 https://github.com/Azure/azureml-examples`

   You can also download a zip file from the [examples repository (azureml-examples)](https://github.com/azure/azureml-examples). At this page, first select the `code` dropdown, and then select `Download ZIP`. Then, unzip the contents into a folder on your local device.

1. Upload the feature store samples directory to project workspace.
      * Open Azure Machine Learning studio UI of your Azure Machine Learning workspace
      * Select **Notebooks** in left nav
      * Select your user name in the directory listing
      * Select **upload folder**
      * Select the feature store samples folder from the cloned directory path: `azureml-examples/sdk/python/featurestore-sample`

1. You can create a new notebook, and proceed and execute the instructions in this document step by step. You can also open the existing notebook named `1. Develop a feature set and register with managed feature store.ipynb`, and execute its individual cells step by step, one at a time. The notebooks are available in the folder `featurestore_sample/notebooks/sdk_only`. Keep this document open and refer to it for detailed explanation of the steps.

1. Select **AzureML Spark compute** in the top nav "Compute" dropdown. This operation might take one to two minutes. Wait for a status bar in the top to display **configure session**.

1. Select "configure session" from the top nav (this could take one to two minutes to display):

      1. Select **configure session** in the bottom nav
      1. Select **Upload conda file**
      1. Select file `azureml-examples/sdk/python/featurestore-sample/project/env/conda.yml` located on your local device
      1. (Optional) Increase the session time-out (idle time) to reduce the serverless spark cluster startup time.

#### Start Spark Session

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=start-spark-session)]

#### Set up the root directory for the samples

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=root-dir)]

> [!Note]
> Feature store Vs Project workspace: You'll use a feature store to reuse features across projects. You'll use a project workspace (i.e. Azure ML workspace) to train and inference models, by leveraging features from feature stores. Many project workspaces can share and reuse the same feature store.

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
   >    - Develop feature set specification and retrieve feature data using it
   >    - List/Get registered feature sets
   >    - Generate/resolve feature retrieval spec
   >    - Generate training/inference data using a point-in-time join
>
> This tutorial does not require explicit installation of these SDK's, since the instructions already explain the process. The **conda YAML** instructions in the earlier step cover this.

## Step 1: Create a minimal feature store

### Step 1a: Set feature store parameters

Set name, location, and other values for the feature store

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=fs-params)]

### Step 1b: Create the feature store

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=create-fs)]

### Step 1c: Initialize Azure Machine Learning feature store core SDK client

As explained earlier in this tutorial, the feature store core SDK client is used to develop and consume features

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=init-fs-core-sdk)]

## Step 2: Prototype and develop a feature set called `transactions` that has rolling window aggregate based features

### Step 2a: Explore the transactions source data

> [!Note]
> This notebook uses sample data hosted in a publicly-accessible blob container. It can only be read into Spark with a `wasbs` driver. When you create feature sets using your own source data, please host them in an adls gen2 account, and use an `abfss` driver in the data path.

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=explore-txn-src-data)]

### Step 2b: Locally develop the feature set

A feature set specification is a self-contained feature set definition that you can locally develop and test.

In this step, we create these rolling window aggregate features:

- transactions three-day count
- transactions amount three-day sum
- transactions amount three-day avg
- transactions seven-day count
- transactions amount seven-day sum
- transactions amount seven-day avg

**Action:**

- Inspect the feature transformation code file: `featurestore/featuresets/transactions/transformation_code/transaction_transform.py`. Note the rolling aggregation defined for the features. This is a spark transformer.

See [feature store concepts](./concept-what-is-managed-feature-store.md) and **transformation concepts** to learn more about the feature set and transformations.

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=develop-txn-fset-locally)]

### Step 2c: Export as a feature set spec

To register the feature set spec with the feature store, that spec must be saved in a specific format.

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=dump-transactions-fs-spec)]

**Action:** Inspect the generated `transactions` Featureset spec: Open this file from the file tree to see the spec: `featurestore/featuresets/accounts/spec/FeaturesetSpec.yaml`

The spec contains these important elements:

1. `source`: a reference to a storage resource. In this case, it's a parquet file in a blob storage resource.
1. `features`: a list of features and their datatypes. If you provide transformation code (see the Day 2 section), the code must return a dataframe that maps to the features and datatypes.
1. `index_columns`: the join keys required to access values from the feature set

Learn more about the spec in the [top level feature store entities document](./concept-top-level-entities-in-managed-feature-store.md) and the [feature set spec yaml reference](./reference-yaml-feature-set.md).

Persisting the feature set spec offers another benefit: the feature set spec can be source controlled.

## Step 3: Register a feature-store entity

As a best practice, entities help enforce use of the same join key definition across feature sets that use the same logical entities. Examples of entities can include accounts, customers, etc. Entities are typically created once, and then reused across feature sets. For information, see [feature store concepts](./concept-top-level-entities-in-managed-feature-store.md).

### Step 3a: Initialize the Feature Store CRUD client

As explained earlier in this tutorial, MLClient is used for CRUD of feature store assets. The following code searches for the feature store we created in an earlier step. Here, we can't reuse the same ml_client we used earlier in this tutorial, because the earlier ml_client is scoped at the resource group level. This is a prerequisite for feature store creation. In the next code sample, the client is scoped at feature store level.

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=init-fset-crud-client)]

### Step 3b: Register the `account` entity with the feature store

Create an account entity that has the join key `accountID`, of type string.

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=register-acct-entity)]

## Step 4: Register the transaction feature set with the feature store

You can register a feature set asset with the feature store. In this way, you can share and reuse that asset with others. Feature set asset registration offers managed capabilities, such as versioning and materialization (we'll learn more about managed capabilities in this tutorial series).

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=register-txn-fset)]

### Explore the feature store UI

* Open the [Azure Machine Learning global landing page](https://ml.azure.com/home).
* Select `Feature stores` in the left nav
* Note the list of accessible feature stores. Select on the feature store that you created earlier in this tutorial.

The list shows the feature set and entity that you created.

> [!Note]
> Creating and updating feature store assets are possible only through SDK and CLI. You can use the UI to search/browse the feature store.

## Step 5: Generate a training data dataframe using the registered feature set

### Step 5a: Load observation data

First, we explore the observation data. Observation data typically involves the core data used in training and inferencing. Then, this data joins with the feature data to create the full training data. Observation data is the data captured during the time of the event. Here, it has core transaction data including transaction ID, account ID, and transaction amount. Since we use it for training, it also has the target variable appended (**is_fraud**).

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=load-obs-data)]

### Step 5b: Get the registered feature set and list its features

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=get-txn-fset)]

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=print-txn-fset-sample-values)]

### Step 5c: Select features and generate training data

Here, we select features that become part of the training data, and we use the feature store sdk to generate the training data.

A point-in-time join appends the features to the training data.

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=select-features-and-gen-training-data)]

This tutorial built the training data with features from feature store. Optionally: you can save it to storage for later use, or you can run model training on it directly.

## Cleanup

[Part 4](./tutorial-enable-recurrent-materialization-run-batch-inference.md#cleanup) of this tutorial describes how to delete the resources

## Next steps

* [Part 2: enable materialization and back fill feature data](./tutorial-enable-materialization-backfill-data.md)
* Understand concepts: [feature store concepts](./concept-what-is-managed-feature-store.md), [top level entities in managed feature store](./concept-top-level-entities-in-managed-feature-store.md)
* [Understand identity and access control for feature store](./how-to-setup-access-control-feature-store.md)
* [View feature store troubleshooting guide](./troubleshooting-managed-feature-store.md)
* Reference: [YAML reference](./reference-yaml-overview.md)
