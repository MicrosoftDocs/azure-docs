---
title: "Tutorial #1: develop and register a feature set with managed feature store (preview)"
titleSuffix: Azure Machine Learning managed Feature Store - Basics
description: Managed Feature Store tutorial part 1. 
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: tutorial
author: rsethur
ms.author: seramasu
ms.date: 05/27/2023
ms.reviewer: franksolomon
ms.custom: sdkv2, build-2023
#Customer intent: As a professional data scientist, I want to know how to build and deploy a model with Azure Machine Learning by using Python in a Jupyter Notebook.
---

# Tutorial #1: develop and register a feature set with managed feature store (preview)

Azure Machine Learning managed feature store lets you discover, create and operationalize features. The machine learning lifecycle involves the prototyping phase, where you experiment with various features. It also involves the operationalization phase, where models are deployed and inference looks up feature data. Features serve as the connective tissue in the machine learning lifecycle. For information about the basic feature store concepts, see [what is managed feature store](./concept-what-is-managed-feature-store.md) and [top level entities in managed feature store](./concept-top-level-entities-in-managed-feature-store.md).

This tutorial is the first part of a four part series. In this tutorial, you'll learn how to:

> [!div class="checklist"]
> * Create a new minimal feature store resource
> * Develop and locally test a feature set with feature transformation capability
> * Register a feature store entity with the feature store
> * Register the feature set that you developed with the feature store
> * Generate a sample training dataframe using the features you created

> [!IMPORTANT]
> This feature is currently in public preview. This preview version is provided without a service-level agreement, and it's not recommended for production workloads. Certain features might not be supported, or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

> [!NOTE]
> This tutorial series has two tracks:
> * SDK only track: Uses only Python SDKs. Choose this track if you prefer pure, Python-based development and deployment.
> * SDK & CLI track: This track uses the CLI for CRUD operations (create/update/delete), and the Python SDK for feature set development and testing only. This is useful in CI / CD, or GitOps scenarios, where CLI/yaml is preferred.

Before you proceed with this article, make sure you cover these prerequisites:

* An Azure Machine Learning workspace. If you don't have one, see the [Quickstart: Create workspace resources](./quickstart-create-resources.md) article to create one

* To perform the steps in this article, your user account must be assigned the owner or contributor role to a resource group where the feature store is created

   (Optional): If you use a new resource group for this tutorial, you can easily delete all the resource by deleting the resource group

## Prepare the notebook environment for development
Note: This tutorial uses an Azure Machine Learning spark notebook for development.

1. Install the [Azure Machine Learning Python SDK](https://aka.ms/sdk-v2-install)

<!--

   Verify that the block below covers the original intended material it replaced.

 -->

1. [!INCLUDE [open or create notebook](includes/prereq-open-or-create.md)]
    * [!INCLUDE [new notebook](includes/prereq-new-notebook.md)]
    * Or, open **1. Develop a feature set and register with managed feature store.ipynb** from either the

    **Samples/SDK v2/sdk/python/featurestore_sample/notebooks/sdk_and_cli**

    or

    **Samples/SDK v2/sdk/python/featurestore_sample/notebooks/sdk_only**

    folders, located in the studio folder section. [!INCLUDE [clone notebook](includes/prereq-clone-notebook.md)]

<!--

   Verify that the block above covers the original intended material it replaced.

 -->

## Start Spark Session

[!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=start-spark-session)]

## Set up the root directory for the samples

[!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=root-dir)]

### [Python SDK](#tab/python)

Not applicable

### [Azure CLI](#tab/cli)

### Set up the CLI

1. Install the Azure Machine Learning extension

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/1. Develop a feature set and register with managed feature store.ipynb?name=install-ml-ext-cli)]

1. Authentication

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/1. Develop a feature set and register with managed feature store.ipynb?name=auth-cli)]

1. Set the default subscription

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/1. Develop a feature set and register with managed feature store.ipynb?name=set-default-subs-cli)]

---

> [!NOTE]
> Feature store Vs Project workspace: You'll use a feature store to reuse features across projects. You'll use a project workspace (an Azure Machine Learning workspace) to train and inference models, by leveraging features from feature stores. Many project workspaces can share and reuse the same feature store.

### [Python SDK](#tab/python)

**Content TBD**

### [Azure CLI](#tab/cli)

This tutorial uses the Feature store core SDK, and the CLI for CRUD (create / update / delete) operations. It uses the Python SDK only for Feature set development and testing. This approach is useful for GitOps or CI / CD scenarios, where CLI / yaml is preferred.
1. You'll use the CLI for CRUD (create / update / delete) operations, on feature store, feature set, and feature store entity
1. Feature store core SDK: This SDK (`azureml-featurestore`) is meant for feature set development and consumption. This tutorial covers these operations:

    * List / Get a registered feature set

    * Generate / resolve a feature retrieval spec

    * Execute a feature set definition, to generate a Spark dataframe

    * Generate training with a point-in-time join

You don't need to explicitly install these resources for this tutorial, because the instructions cover these steps. The **conda.yaml** file includes them in an earlier step.

---

## Create a minimal feature store

1. Set feature store parameters

   Set the name, location, and other values for the feature store

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=fs-params)]

1. Create the feature store

   ### [Python SDK](#tab/python)

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=create-fs)]

   ### [Azure CLI](#tab/cli)

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/1. Develop a feature set and register with managed feature store.ipynb?name=create-fs-cli)]

   ---

1. Initialize an Azure Machine Learning feature store core SDK client

   As explained earlier in this tutorial, the feature store core SDK client is used to develop and consume features

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=init-fs-core-sdk)]

## Prototype and develop a feature set

We'll build a feature set named `transactions` that has rolling window aggregate-based features

1. Explore the transactions source data

   > [!NOTE]
   > This notebook uses sample data hosted in a publicly-accessible blob container. It can only be read into Spark with a `wasbs` driver. When you create feature sets using your own source data, please host them in an adls gen2 account, and use an `abfss` driver in the data path.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=explore-txn-src-data)]

1. Locally develop the feature set

   A feature set specification is a self-contained feature set definition that you can locally develop and test.

   Here, we create these rolling window aggregate features:

   - transactions three-day count
   - transactions amount three-day sum
   - transactions amount three-day avg
   - transactions seven-day count
   - transactions amount seven-day sum
   - transactions amount seven-day avg

   **Action:**

   - Inspect the feature transformation code file: `featurestore/featuresets/transactions/transformation_code/transaction_transform.py`. Note the rolling aggregation defined for the features. This is a spark transformer.

   See [feature store concepts](./concept-what-is-managed-feature-store.md) and **transformation concepts** to learn more about the feature set and transformations.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=develop-txn-fset-locally)]

1. Export as a feature set spec

   To register the feature set spec with the feature store, that spec must be saved in a specific format.

   **Action:** Inspect the generated `transactions` feature set spec: Open this file from the file tree to see the spec: `featurestore/featuresets/accounts/spec/FeaturesetSpec.yaml`

   The spec contains these important elements:
       
      1. `source`: a reference to a storage resource. In this case, it's a parquet file in a blob storage resource.
      1. `features`: a list of features and their datatypes. If you provide transformation code (see the Day 2 section), the code must return a dataframe that maps to the features and datatypes.
      1. `index_columns`: the join keys required to access values from the feature set

   Learn more about the spec in the [top level feature store entities document](./concept-top-level-entities-in-managed-feature-store.md) and the [feature set spec yaml reference](./reference-yaml-feature-set.md).

   Persisting the feature set spec offers another benefit: the feature set spec can be source controlled.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=dump-transactions-fs-spec)]

## Register a feature-store entity

As a best practice, entities help enforce use of the same join key definition across feature sets that use the same logical entities. Examples of entities can include accounts, customers, etc. Entities are typically created once, and then reused across feature sets. For information, see [feature store concepts](./concept-top-level-entities-in-managed-feature-store.md).

   ### [Python SDK](#tab/python)

   1. Initialize the Feature Store CRUD client

      As explained earlier in this tutorial, MLClient is used for CRUD of feature store assets. The following code searches for the feature store we created in an earlier step. Here, we can't reuse the same ml_client we used earlier in this tutorial, because the earlier ml_client is scoped at the resource group level. This is a prerequisite for feature store creation. In the next code sample, the client is scoped at feature store level.

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=init-fset-crud-client)]

   1. Register the `account` entity with the feature store

      Create an account entity that has the join key `accountID`, of type string.

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=register-acct-entity)]

   ### [Azure CLI](#tab/cli)

   1. Initialize the Feature Store CRUD client

      As explained earlier in this tutorial, MLClient is used for CRUD of feature store assets. The following code searches for the feature store we created in an earlier step. Here, we can't reuse the same ml_client we used earlier in this tutorial, because the earlier ml_client is scoped at the resource group level. This is a prerequisite for feature store creation. The next code sample scopes the client at the feature store level, and registers the `account` entity with the feature store. Additionally, it creates an account entity that has the join key `accountID`, of type string.

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/1. Develop a feature set and register with managed feature store.ipynb?name=register-acct-entity-cli)]

   ---

## Register the transaction feature set with the feature store

You can register a feature set asset with the feature store. In this way, you can share and reuse that asset with others. Feature set asset registration offers managed capabilities, such as versioning and materialization (we'll learn more about managed capabilities in this tutorial series).

   ### [Python SDK](#tab/python)

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=register-txn-fset)]

   ### [Azure CLI](#tab/cli)

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/1. Develop a feature set and register with managed feature store.ipynb?name=register-txn-fset-cli)]

   ---

### Explore the feature store UI

* Open the [Azure Machine Learning global landing page](https://ml.azure.com/home).
* Select `Feature stores` in the left nav
* Note the list of accessible feature stores. Select on the feature store that you created earlier in this tutorial.

The list shows the feature set and entity that you created.

> [!NOTE]
> Creating and updating feature store assets are possible only through SDK and CLI. You can use the UI to search/browse the feature store.

## Generate a training data dataframe using the registered feature set

1. Load observation data

   First, we explore the observation data. Observation data typically involves the core data used in training and inferencing. Then, this data joins with the feature data to create the full training data. Observation data is the data captured during the time of the event. Here, it has core transaction data, including transaction ID, account ID, and transaction amount. Since we use it for training, it also has the target variable appended (**is_fraud**).

   Refer to the documentation resources to learn more about core concepts, including observation data.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=load-obs-data)]

1. Get the registered feature set and list its features

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=get-txn-fset)]

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=print-txn-fset-sample-values)]

1. Select features and generate training data

   Here, we select features that become part of the training data, and we use the feature store SDK to generate the training data.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=select-features-and-gen-training-data)]

   A point-in-time join appends the features to the training data.

   This tutorial built the training data with features from feature store. Optionally: you can save it to storage for later use, or you can run model training on it directly.

## Cleanup

The Tutorial #4 [clean up step](./tutorial-enable-recurrent-materialization-run-batch-inference.md#cleanup) describes how to delete the resources

## Next steps

* [Part 2: enable materialization and back fill feature data](./tutorial-enable-materialization-backfill-data.md)
* Understand concepts: [feature store concepts](./concept-what-is-managed-feature-store.md), [top level entities in managed feature store](./concept-top-level-entities-in-managed-feature-store.md)
* [Understand identity and access control for feature store](./how-to-setup-access-control-feature-store.md)
* [View feature store troubleshooting guide](./troubleshooting-managed-feature-store.md)
* Reference: [YAML reference](./reference-yaml-overview.md)