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
ms.date: 07/24/2023
ms.reviewer: franksolomon
ms.custom: sdkv2, build-2023
#Customer intent: As a professional data scientist, I want to know how to build and deploy a model with Azure Machine Learning by using Python in a Jupyter Notebook.
---

# Tutorial #1: develop and register a feature set with managed feature store (preview)

This tutorial series shows how features seamlessly integrate all phases of the ML lifecycle: prototyping, training and operationalization.

Azure Machine Learning managed feature store lets you discover, create and operationalize features. The machine learning lifecycle includes a prototyping phase, where you experiment with various features. It also involves an operationalization phase, where models are deployed and inference steps look up feature data. Features serve as the connective tissue in the machine learning lifecycle. To learn more about basic feature store concepts, see [what is managed feature store](./concept-what-is-managed-feature-store.md) and [top level entities in managed feature store](./concept-top-level-entities-in-managed-feature-store.md).

This tutorial is the first part of a four part series. Here, you'll learn how to:

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
> * SDK only track: Uses only Python SDKs. Choose this track for pure, Python-based development and deployment.
> * SDK & CLI track: This track uses the CLI for CRUD operations (create, update, and delete), and the Python SDK for feature set development and testing only. This is useful in CI / CD, or GitOps, scenarios, where CLI/yaml is preferred.

Before you proceed with this article, make sure you cover these prerequisites:

* An Azure Machine Learning workspace. See [Quickstart: Create workspace resources](./quickstart-create-resources.md) article for more information about workspace creation.

* To proceed with this article, your user account must be assigned the owner or contributor role to the resource group where the feature store is created

   (Optional): If you use a new resource group for this tutorial, you can easily delete all the resources by deleting the resource group

## Set up

### Prepare the notebook environment for development

> [!NOTE]
> This tutorial uses an Azure Machine Learning Spark notebook for development.

1. In the Azure Machine Learning studio environment, first select **Notebooks** in the left nav, and then select the **Samples** tab. Navigate to the **featurestore_sample** directory

   **Samples -> SDK v2 -> sdk -> python -> featurestore_sample**

   and then select **Clone**, as shown in this screenshot:

   :::image type="content" source="media/tutorial-get-started-with-feature-store/clone-featurestore-example-notebooks.png" lightbox="media/tutorial-get-started-with-feature-store/clone-featurestore-example-notebooks.png" alt-text="Screenshot showing selection of the featurestore_sample directory in Azure Machine Learning studio UI.":::

1. The **Select target directory** panel opens next. Select the User directory, in this case **testUser**, and then select **Clone**, as shown in this screenshot:

   :::image type="content" source="media/tutorial-get-started-with-feature-store/select-target-directory.png" lightbox="media/tutorial-get-started-with-feature-store/select-target-directory.png" alt-text="Screenshot showing selection of the target directory location in Azure Machine Learning studio UI for the featurestore_sample resource.":::

1. To configure the notebook environment, you must upload the **conda.yml** file. Select **Notebooks** in the left nav, and then select the **Files** tab. Navigate to the **env** directory

   **Users -> testUser -> featurestore_sample -> project -> env**

   and select the **conda.yml** file. In this navigation, **testUser** is the user directory. Select **Download**, as shown in this screenshot:

   :::image type="content" source="media/tutorial-get-started-with-feature-store/download-conda-file.png" lightbox="media/tutorial-get-started-with-feature-store/download-conda-file.png" alt-text="Screenshot showing selection of the conda.yml file in Azure Machine Learning studio UI.":::

1. At the Azure Machine Learning environment, open the notebook, and select **Configure Session**, as shown in this screenshot:

   :::image type="content" source="media/tutorial-get-started-with-feature-store/open-configure-session.png" lightbox="media/tutorial-get-started-with-feature-store/open-configure-session.png" alt-text="Screenshot showing Open Configure Session for this notebook.":::

1. At the **Configure Session** panel, select **Python packages**. To upload the Conda file, select **Upload Conda file**, and **Browse** to the directory that hosts the Conda file. Select **conda.yml**, and then select **Open**, as shown in this screenshot:

   :::image type="content" source="media/tutorial-get-started-with-feature-store/open-conda-file.png" lightbox="media/tutorial-get-started-with-feature-store/open-conda-file.png" alt-text="Screenshot showing the directory hosting the Conda file.":::

1. Select **Apply**, as shown in this screenshot:

   :::image type="content" source="media/tutorial-get-started-with-feature-store/upload-conda-file.png" lightbox="media/tutorial-get-started-with-feature-store/upload-conda-file.png" alt-text="Screenshot showing the Conda file upload.":::

## Start the Spark session

[!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=start-spark-session)]

## Set up the root directory for the samples

[!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=root-dir)]

### [SDK Track](#tab/SDK-track)

Not applicable

### [SDK and CLI Track](#tab/SDK-and-CLI-track)

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

### [SDK Track](#tab/SDK-track)

This tutorial uses two SDKs:
* The Feature Store CRUD SDK
* You use the same MLClient (package name azure-ai-ml) SDK that you use with the Azure Machine Learning workspace. A feature store is implemented as a type of workspace. As a result, this SDK is used for feature store CRUD operations for feature store, feature set, and feature store entity.

* The feature store core SDK
   
   This SDK (azureml-featurestore) is intended for feature set development and consumption. Later steps in this tutorial describe these operations:
   
   * Feature set specification development
   * Feature data retrieval
   * List and Get registered feature sets
   * Generate and resolve feature retrieval specs
   * Generate training and inference data using point-in-time joins

This tutorial doesn't require explicit installation of those SDKs, because the earlier **conda YAML** instructions cover this step.

### [SDK and CLI Track](#tab/SDK-and-CLI-track)

This tutorial uses both the Feature store core SDK, and the CLI, for CRUD operations. It only uses the Python SDK for Feature set development and testing. This approach is useful for GitOps or CI / CD scenarios, where CLI / yaml is preferred.

* Use the CLI for CRUD operations on feature store, feature set, and feature store entities
* Feature store core SDK: This SDK (`azureml-featurestore`) is meant for feature set development and consumption. This tutorial covers these operations:

   * List / Get a registered feature set
   * Generate / resolve a feature retrieval spec
   * Execute a feature set definition, to generate a Spark dataframe
   * Generate training with a point-in-time join

This tutorial doesn't need explicit installation of these resources, because the instructions cover these steps. The **conda.yaml** file includes them in an earlier step.

---

## Create a minimal feature store

1. Set feature store parameters

   Set the name, location, and other values for the feature store

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=fs-params)]

1. Create the feature store

   ### [SDK Track](#tab/SDK-track)

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=create-fs)]

   ### [SDK and CLI Track](#tab/SDK-and-CLI-track)

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/1. Develop a feature set and register with managed feature store.ipynb?name=create-fs-cli)]

1. Initialize an Azure Machine Learning feature store core SDK client

   As explained earlier in this tutorial, the feature store core SDK client is used to develop and consume features

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=init-fs-core-sdk)]

## Prototype and develop a feature set

We'll build a feature set named `transactions` that has rolling, window aggregate-based features

1. Explore the transactions source data

   > [!NOTE]
   > This notebook uses sample data hosted in a publicly-accessible blob container. It can only be read into Spark with a `wasbs` driver. When you create feature sets using your own source data, host them in an adls gen2 account, and use an `abfss` driver in the data path.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=explore-txn-src-data)]

1. Locally develop the feature set

   A feature set specification is a self-contained feature set definition that you can locally develop and test. Here, we create these rolling window aggregate features:

   * transactions three-day count
   * transactions amount three-day sum
   * transactions amount three-day avg
   * transactions seven-day count
   * transactions amount seven-day sum
   * transactions amount seven-day avg

   **Action:**

   - Review the feature transformation code file: `featurestore/featuresets/transactions/transformation_code/transaction_transform.py`. Note the rolling aggregation defined for the features. This is a spark transformer.

   See [feature store concepts](./concept-what-is-managed-feature-store.md) and **transformation concepts** to learn more about the feature set and transformations.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=develop-txn-fset-locally)]

1. Export as a feature set spec

   To register the feature set spec with the feature store, you must save that spec in a specific format.

   **Action:** Review the generated `transactions` feature set spec: Open this file from the file tree to see the spec: `featurestore/featuresets/accounts/spec/FeaturesetSpec.yaml`

   The spec contains these elements:
       
      1. `source`: a reference to a storage resource. In this case, it's a parquet file in a blob storage resource.
      1. `features`: a list of features and their datatypes. If you provide transformation code (see the Day 2 section), the code must return a dataframe that maps to the features and datatypes.
      1. `index_columns`: the join keys required to access values from the feature set

   To learn more about the spec, see [top level feature store entities document](./concept-top-level-entities-in-managed-feature-store.md) and the [feature set spec yaml reference](./reference-yaml-feature-set.md).

   Persisting the feature set spec offers another benefit: the feature set spec can be source controlled.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=dump-transactions-fs-spec)]

## Register a feature-store entity

As a best practice, entities help enforce use of the same join key definition across feature sets that use the same logical entities. Examples of entities can include accounts, customers, etc. Entities are typically created once, and then reused across feature sets. To learn more, see [feature store concepts](./concept-top-level-entities-in-managed-feature-store.md).

   ### [SDK Track](#tab/SDK-track)

   1. Initialize the Feature Store CRUD client

      As explained earlier in this tutorial, the MLClient is used for feature store asset CRUD (create, update, and delete). The notebook code cell sample shown here searches for the feature store we created in an earlier step. Here, we can't reuse the same ml_client we used earlier in this tutorial, because the earlier ml_client is scoped at the resource group level. Proper scoping is a prerequisite for feature store creation. In this code sample, the client is scoped at feature store level.

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=init-fset-crud-client)]

   1. Register the `account` entity with the feature store

      Create an account entity that has the join key `accountID`, of type string.

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=register-acct-entity)]

   ### [SDK and CLI Track](#tab/SDK-and-CLI-track)

   1. Initialize the Feature Store CRUD client

      As explained earlier in this tutorial, MLClient is used for feature store asset CRUD (create, update, and delete). The notebook code cell sample shown here searches for the feature store we created in an earlier step. Here, we can't reuse the same ml_client we used earlier in this tutorial, because the earlier ml_client is scoped at the resource group level. Proper scoping is a prerequisite for feature store creation. In this code sample, the client is scoped at the feature store level, and it registers the `account` entity with the feature store. Additionally, it creates an account entity that has the join key `accountID`, of type string.

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/1. Develop a feature set and register with managed feature store.ipynb?name=register-acct-entity-cli)]

   ---

## Register the transaction feature set with the feature store

First, register a feature set asset with the feature store. You can then reuse that asset, and easily share it. Feature set asset registration offers managed capabilities, including versioning and materialization. Later steps in this tutorial series cover managed capabilities.

   ### [SDK Track](#tab/SDK-track)

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=register-txn-fset)]

   ### [SDK and CLI Track](#tab/SDK-and-CLI-track)

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/1. Develop a feature set and register with managed feature store.ipynb?name=register-txn-fset-cli)]

   ---

## Explore the feature store UI

* Open the [Azure Machine Learning global landing page](https://ml.azure.com/home).
* Select `Feature stores` in the left nav
* From this list of accessible feature stores, select the feature store you created earlier in this tutorial.

> [!NOTE]
> Feature store asset creation and updates can happen only through the SDK and CLI. You can use the UI to search or browse the feature store.

## Generate a training data dataframe using the registered feature set

1. Load observation data

   Observation data typically involves the core data used for training and inferencing. This data joins with the feature data to create the full training data resource. Observation data is data captured during the event itself. Here, it has core transaction data, including transaction ID, account ID, and transaction amount values. Since we use it for training, it also has an appended target variable (**is_fraud**).

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=load-obs-data)]

1. Get the registered feature set, and list its features

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=get-txn-fset)]

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=print-txn-fset-sample-values)]

1. Select features, and generate training data

   Here, we select the features that become part of the training data. Then, we use the feature store SDK to generate the training data itself.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=select-features-and-gen-training-data)]

   A point-in-time join appends the features to the training data.

This tutorial built the training data with features from feature store. Optional: you can save the training data to storage for later use, or you can run model training on it directly.

## Cleanup

The Tutorial #4 [clean up step](./tutorial-enable-recurrent-materialization-run-batch-inference.md#cleanup) describes how to delete the resources

## Next steps

* [Part 2: enable materialization and back fill feature data](./tutorial-enable-materialization-backfill-data.md)
* Understand concepts: [feature store concepts](./concept-what-is-managed-feature-store.md), [top level entities in managed feature store](./concept-top-level-entities-in-managed-feature-store.md)
* [Understand identity and access control for feature store](./how-to-setup-access-control-feature-store.md)
* [View feature store troubleshooting guide](./troubleshooting-managed-feature-store.md)
* Reference: [YAML reference](./reference-yaml-overview.md)