---
title: "Tutorial 1: Develop and register a feature set with managed feature store (preview)"
titleSuffix: Azure Machine Learning managed feature store - basics
description: This is part 1 of a tutorial series on managed feature store. 
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

# Tutorial 1: Develop and register a feature set with managed feature store (preview)

This tutorial series shows how features seamlessly integrate all phases of the machine learning lifecycle: prototyping, training, and operationalization.

You can use Azure Machine Learning managed feature store to discover, create, and operationalize features. The machine learning lifecycle includes a prototyping phase, where you experiment with various features. It also involves an operationalization phase, where models are deployed and inference steps look up feature data. Features serve as the connective tissue in the machine learning lifecycle. To learn more about basic concepts for managed feature store, see [What is managed feature store?](./concept-what-is-managed-feature-store.md) and [Understanding top-level entities in managed feature store](./concept-top-level-entities-in-managed-feature-store.md).

This tutorial is the first part of a four-part series. Here, you learn how to:

> [!div class="checklist"]
> * Create a new, minimal feature store resource.
> * Develop and locally test a feature set with feature transformation capability.
> * Register a feature store entity with the feature store.
> * Register the feature set that you developed with the feature store.
> * Generate a sample training DataFrame by using the features that you created.

This tutorial series has two tracks:

* The SDK-only track uses only Python SDKs. Choose this track for pure, Python-based development and deployment.
* The SDK and CLI track uses the Python SDK for feature set development and testing only, and it uses the CLI for CRUD (create, read, update, and delete) operations. This track is useful in continuous integration and continuous delivery (CI/CD) or GitOps scenarios, where CLI/YAML is preferred.

[!INCLUDE [machine-learning-preview-generic-disclaimer](includes/machine-learning-preview-generic-disclaimer.md)]

## Prerequisites

Before you proceed with this tutorial, be sure to cover these prerequisites:

* An Azure Machine Learning workspace. For more information about workspace creation, see [Quickstart: Create workspace resources](./quickstart-create-resources.md).

* On your user account, the Owner or Contributor role for the resource group where the feature store is created.

   If you choose to use a new resource group for this tutorial, you can easily delete all the resources by deleting the resource group.

## Prepare the notebook environment

This tutorial uses an Azure Machine Learning Spark notebook for development.

1. In the Azure Machine Learning studio environment, select **Notebooks** on the left pane, and then select the **Samples** tab.

1. Browse to the *featurestore_sample* directory (select **Samples** > **SDK v2** > **sdk** > **python** > **featurestore_sample**), and then select **Clone**.

   :::image type="content" source="media/tutorial-get-started-with-feature-store/clone-featurestore-example-notebooks.png" lightbox="media/tutorial-get-started-with-feature-store/clone-featurestore-example-notebooks.png" alt-text="Screenshot that shows selection of the sample directory in Azure Machine Learning studio.":::

1. The **Select target directory** panel opens. Select the user directory (in this case, **testUser**), and then select **Clone**.

   :::image type="content" source="media/tutorial-get-started-with-feature-store/select-target-directory.png" lightbox="media/tutorial-get-started-with-feature-store/select-target-directory.png" alt-text="Screenshot that shows selection of the target directory location in Azure Machine Learning studio for the sample resource.":::

1. To configure the notebook environment, you must upload the *conda.yml* file:

   1. Select **Notebooks** on the left pane, and then select the **Files** tab.
   1. Browse to the *env* directory (select **Users** > **testUser** > **featurestore_sample** > **project** > **env**), and then select the *conda.yml* file. In this path, *testUser* is the user directory.
   1. Select **Download**.

   :::image type="content" source="media/tutorial-get-started-with-feature-store/download-conda-file.png" lightbox="media/tutorial-get-started-with-feature-store/download-conda-file.png" alt-text="Screenshot that shows selection of the Conda YAML file in Azure Machine Learning studio.":::

1. In the Azure Machine Learning environment, open the notebook, and then select **Configure session**.

   :::image type="content" source="media/tutorial-get-started-with-feature-store/open-configure-session.png" lightbox="media/tutorial-get-started-with-feature-store/open-configure-session.png" alt-text="Screenshot that shows selections for configuring a session for a notebook.":::

1. On the **Configure session** panel, select **Python packages**.

1. Upload the Conda file:
   1. On the **Python packages** tab, select **Upload Conda file**.
   1. Browse to the directory that hosts the Conda file.
   1. Select **conda.yml**, and then select **Open**.

   :::image type="content" source="media/tutorial-get-started-with-feature-store/open-conda-file.png" lightbox="media/tutorial-get-started-with-feature-store/open-conda-file.png" alt-text="Screenshot that shows the directory that hosts the Conda file.":::

1. Select **Apply**.

   :::image type="content" source="media/tutorial-get-started-with-feature-store/upload-conda-file.png" lightbox="media/tutorial-get-started-with-feature-store/upload-conda-file.png" alt-text="Screenshot that shows the Conda file upload.":::

## Start the Spark session

[!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=start-spark-session)]

## Set up the root directory for the samples

[!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=root-dir)]

### [SDK track](#tab/SDK-track)

Not applicable.

### [SDK and CLI track](#tab/SDK-and-CLI-track)

### Set up the CLI

1. Install the Azure Machine Learning extension.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/1. Develop a feature set and register with managed feature store.ipynb?name=install-ml-ext-cli)]

1. Authenticate.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/1. Develop a feature set and register with managed feature store.ipynb?name=auth-cli)]

1. Set the default subscription.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/1. Develop a feature set and register with managed feature store.ipynb?name=set-default-subs-cli)]

---

> [!NOTE]
> You use a feature store to reuse features across projects. You use a project workspace (an Azure Machine Learning workspace) to train inference models, by taking advantage of features from feature stores. Many project workspaces can share and reuse the same feature store.

### [SDK track](#tab/SDK-track)

This tutorial uses two SDKs:

* *Feature store CRUD SDK*

  You use the same `MLClient` (package name `azure-ai-ml`) SDK that you use with the Azure Machine Learning workspace. A feature store is implemented as a type of workspace. As a result, this SDK is used for CRUD operations for feature stores, feature sets, and feature store entities.

* *Feature store core SDK*

  This SDK (`azureml-featurestore`) is for feature set development and consumption. Later steps in this tutorial describe these operations:

  * Develop a feature set specification.
  * Retrieve feature data.
  * List or get a registered feature set.
  * Generate and resolve feature retrieval specifications.
  * Generate training and inference data by using point-in-time joins.

This tutorial doesn't require explicit installation of those SDKs, because the earlier Conda YAML instructions cover this step.

### [SDK and CLI track](#tab/SDK-and-CLI-track)

This tutorial uses both the feature store core SDK and the CLI for CRUD operations. It uses the Python SDK only for feature set development and testing. This approach is useful for GitOps or CI/CD scenarios, where CLI/YAML is preferred.

Here are general guidelines:

* Use the CLI for CRUD operations on feature stores, feature sets, and feature store entities.
* The feature store core SDK (`azureml-featurestore`) is for feature set development and consumption. This tutorial covers these operations:

  * List or get a registered feature set
  * Generate or resolve a feature retrieval specification
  * Execute a feature set definition, to generate a Spark DataFrame
  * Generate training by using point-in-time joins

This tutorial doesn't need explicit installation of these resources, because the instructions cover these steps. The *conda.yml* file includes them in an earlier step.

---

## Create a minimal feature store

1. Set feature store parameters, including name, location, and other values.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=fs-params)]

1. Create the feature store.

   ### [SDK track](#tab/SDK-track)

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=create-fs)]

   ### [SDK and CLI track](#tab/SDK-and-CLI-track)

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/1. Develop a feature set and register with managed feature store.ipynb?name=create-fs-cli)]

1. Initialize a feature store core SDK client for Azure Machine Learning.

   As explained earlier in this tutorial, the feature store core SDK client is used to develop and consume features.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=init-fs-core-sdk)]

## Prototype and develop a feature set

In the following steps, you build a feature set named `transactions` that has rolling, window aggregate-based features:

1. Explore the `transactions` source data.

   This notebook uses sample data hosted in a publicly accessible blob container. It can be read into Spark only through a `wasbs` driver. When you create feature sets by using your own source data, host them in an Azure Data Lake Storage Gen2 account, and use an `abfss` driver in the data path.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=explore-txn-src-data)]

1. Locally develop the feature set.

   A feature set specification is a self-contained definition of a feature set that you can locally develop and test. Here, you create these rolling window aggregate features:

   * `transactions three-day count`
   * `transactions amount three-day sum`
   * `transactions amount three-day avg`
   * `transactions seven-day count`
   * `transactions amount seven-day sum`
   * `transactions amount seven-day avg`

   Review the feature transformation code file: *featurestore/featuresets/transactions/transformation_code/transaction_transform.py*. Note the rolling aggregation defined for the features. This is a Spark transformer.

   To learn more about the feature set and transformations, see [What is managed feature store?](./concept-what-is-managed-feature-store.md).

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=develop-txn-fset-locally)]

1. Export as a feature set specification.

   To register the feature set specification with the feature store, you must save that specification in a specific format.

   Review the generated `transactions` feature set specification. Open this file from the file tree to see the specification: *featurestore/featuresets/accounts/spec/FeaturesetSpec.yaml*.

   The specification contains these elements:

   * `source`: A reference to a storage resource. In this case, it's a Parquet file in a blob storage resource.
   * `features`: A list of features and their datatypes. If you provide transformation code (see the "Day 2" section), the code must return a DataFrame that maps to the features and datatypes.
   * `index_columns`: The join keys required to access values from the feature set.

   To learn more about the specification, see [Understanding top-level entities in managed feature store](./concept-top-level-entities-in-managed-feature-store.md) and [CLI (v2) feature set YAML schema](./reference-yaml-feature-set.md).

   Persisting the feature set specification offers another benefit: the feature set specification can be source controlled.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=dump-transactions-fs-spec)]

## Register a feature store entity

As a best practice, entities help enforce use of the same join key definition across feature sets that use the same logical entities. Examples of entities include accounts and customers. Entities are typically created once and then reused across feature sets. To learn more, see [Understanding top-level entities in managed feature store](./concept-top-level-entities-in-managed-feature-store.md).

### [SDK track](#tab/SDK-track)

1. Initialize the feature store CRUD client.

   As explained earlier in this tutorial, `MLClient` is used for creating, reading, updating, and deleting a feature store asset. The notebook code cell sample shown here searches for the feature store that you created in an earlier step. Here, you can't reuse the same `ml_client` value that you used earlier in this tutorial, because it's scoped at the resource group level. Proper scoping is a prerequisite for feature store creation. 

   In this code sample, the client is scoped at feature store level.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=init-fset-crud-client)]

1. Register the `account` entity with the feature store.

   Create an `account` entity that has the join key `accountID` of type `string`.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=register-acct-entity)]

### [SDK and CLI track](#tab/SDK-and-CLI-track)

1. Initialize the feature store CRUD client.

   As explained earlier in this tutorial, `MLClient` is used for creating, reading, updating, and deleting a feature store asset. The notebook code cell sample shown here searches for the feature store that you created in an earlier step. Here, you can't reuse the same `ml_client` value that you used earlier in this tutorial, because it's scoped at the resource group level. Proper scoping is a prerequisite for feature store creation.

   In this code sample, the client is scoped at the feature store level, and it registers the `account` entity with the feature store. Additionally, it creates an account entity that has the join key `accountID` of type `string`.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/1. Develop a feature set and register with managed feature store.ipynb?name=register-acct-entity-cli)]

---

## Register the transaction feature set with the feature store

Use the following code to register a feature set asset with the feature store. You can then reuse that asset and easily share it. Registration of a feature set asset offers managed capabilities, including versioning and materialization. Later steps in this tutorial series cover managed capabilities.

### [SDK track](#tab/SDK-track)

[!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=register-txn-fset)]

### [SDK and CLI track](#tab/SDK-and-CLI-track)

[!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/1. Develop a feature set and register with managed feature store.ipynb?name=register-txn-fset-cli)]

---

## Explore the feature store UI

Feature store asset creation and updates can happen only through the SDK and CLI. You can use the UI to search or browse through the feature store:

1. Open the [Azure Machine Learning global landing page](https://ml.azure.com/home).
1. Select **Feature stores** on the left pane.
1. From the list of accessible feature stores, select the feature store that you created earlier in this tutorial.

## Generate a training data DataFrame by using the registered feature set

1. Load observation data.

   Observation data typically involves the core data used for training and inferencing. This data joins with the feature data to create the full training data resource.

   Observation data is data captured during the event itself. Here, it has core transaction data, including transaction ID, account ID, and transaction amount values. Because you use it for training, it also has an appended target variable (**is_fraud**).

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=load-obs-data)]

1. Get the registered feature set, and list its features.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=get-txn-fset)]

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=print-txn-fset-sample-values)]

1. Select the features that become part of the training data. Then, use the feature store SDK to generate the training data itself.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=select-features-and-gen-training-data)]

   A point-in-time join appends the features to the training data.

This tutorial built the training data with features from the feature store. Optionally, you can save the training data to storage for later use, or you can run model training on it directly.

## Clean up

The [fourth tutorial in the series](./tutorial-enable-recurrent-materialization-run-batch-inference.md#clean-up) describes how to delete the resources.

## Next steps

* Go to the next tutorial in the series: [Enable materialization and backfill feature data](./tutorial-enable-materialization-backfill-data.md).
* Learn about [feature store concepts](./concept-what-is-managed-feature-store.md) and [top-level entities in managed feature store](./concept-top-level-entities-in-managed-feature-store.md).
* Learn about [identity and access control for managed feature store](./how-to-setup-access-control-feature-store.md).
* View the [troubleshooting guide for managed feature store](./troubleshooting-managed-feature-store.md).
* View the [YAML reference](./reference-yaml-overview.md).
