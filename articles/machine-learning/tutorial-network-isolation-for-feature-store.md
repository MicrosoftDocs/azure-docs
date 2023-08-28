---
title: "Tutorial #6: Network isolation for feature store (preview)"
titleSuffix: Azure ML managed Feature Store - Basics
description: Managed Feature Store tutorial part 6. 
services: machine-learning
ms.service: machine-learning

ms.subservice: core
ms.topic: tutorial
author: ynpandey
ms.author: yogipandey
ms.date: 08/17/2023
ms.reviewer: franksolomon
ms.custom: sdkv2, build-2023
#Customer intent: As a professional data scientist, I want to know how to build and deploy a model with Azure Machine Learning by using Python in a Jupyter Notebook.
---

# Tutorial #6: Network isolation with feature store (preview)

An Azure ML managed feature store lets you discover, create and operationalize features. Features serve as the connective tissue in the machine learning lifecycle, starting from the prototyping phase, where you experiment with various features. That lifecycle continues to the operationalization phase, where you deploy your models, and inference looks up feature data. See [feature store concepts](./concept-what-is-managed-feature-store.md) for more information about feature stores.

In this tutorial you will learn how to configure secure ingress through a private endpoint and secure egress through a managed VNET.

Part 1 of this tutorial showed how to create a feature set spec with custom transformations, and use that feature set to generate training data. Part 2 of the tutorial showed how to enable materialization and perform a backfill. Part 3 of this tutorial showed how to experiment with features, as a way to improve model performance. Part 3 also showed how a feature store increases agility in the experimentation and training flows. Tutorial 4 described how to run batch inference. Tutorial 5 explained how to **_TBD_**. Tutorial 6 shows how to

> [!div class="checklist"]
> * Set up the necessary resources for network isolation of a managed feature store
> * Create a new feature store resource
> * Set up your feature store to support network isolation scenarios
> * Update your project workspace (current workspace) to support network isolation scenarios 

[!INCLUDE [preview disclaimer](includes/machine-learning-preview-generic-disclaimer.md)]

## Prerequisites

> [!NOTE]
> This tutorial uses an Azure Machine Learning spark notebook for development.

* Make sure you complete parts 1 through 5 of this tutorial series.
* An Azure Machine Learning workspace, enabled with Managed VNet for **serverless spark jobs**.
* If your workspace has an **Azure Container Registry**, it must use **Premium SKU** to successfully complete the workspace configuration. To configure your project workspace:
  1. Create a YAML file named `network.yml`:
     ```YAML
     managed_network:
     isolation_mode: allow_internet_outbound
     ```
  1. Execute these commands to update the workspace and provision the managed virual network for serverless Spark jobs:

     ```cli
     az ml workspace update --file network.yml --resource-group my_resource_group --name
     my_workspace_name
     az ml workspace provision-network --resource-group my_resource_group --name my_workspace_name
     --include-spark
     ```

   See [Configure for serverless spark job](./how-to-managed-network?view=azureml-api-2&tabs=azure-cli#configure-for-serverless-spark-jobs) for more information.
     
* Your user account must have the `owner` or `contributor` role assigned to the resource group where the feature store will be created. Your user account also needs the `User Access Administrator` role.

> [!IMPORTANT]
> For your Azure Machine Learning workspace, set the `isolation_mode` to `allow_internet_outbound`. This is the only isolation_mode option available at this time. However, we are actively working to add `allow_only_approved_outbound` isolation_mode functionality. As a workaround, this notebook will show how to connect to sources, materialization store and observation data securely through private endpoints.

## Set up

   This tutorial uses the Python feature store SDK (`azureml-featurestore`) only for feature set development and testing only. This is useful in CI/CD or GitOps scenarios where CLI/yaml is preferred. This SDK is meant for feature set development and consumption. This tutorial will describe these operations later:

   * List and Get a registered feature set
   * Generate and resolve a feature retrieval spec
   * Execute a featureset definition, to generate Spark dataframe
   * Generate training using a point-in-time join

   This tutorial uses the CLI for **CRUD**, or create, update, and delete operations, on feature stores, feature sets, and feature store entities.

   You don't need to explicitly install these resources for this tutorial, because in these set up instructions, the `conda yaml` file will cover them.

1. Clone the [azureml-examples](https://github.com/azure/azureml-examples) repository to your local GitHub resources with this command:

   `git clone --depth 1 https://github.com/Azure/azureml-examples`

You can also download a zip file from the [azureml-examples](https://github.com/azure/azureml-examples) repository. At this page, first select the `code` dropdown, and then select `Download ZIP`. Then, unzip the contents into a folder on your local device.

1. In your feature store workspace, create an offline materialization store: create an Azure gen2 storage account and a container inside it, and attach it to the feature store. Optional: you can use an existing storage container

1. Upload the feature store samples directory to project workspace

   * Open the Azure Machine Learning studio UI in your Azure Machine Learning workspace
   * Select **Notebooks** in the left nav
   * Select your user name in the directory listing
   * Select **Upload folder**
   * Select the feature store samples folder from the cloned directory path: `azureml-examples/sdk/python/featurestore-sample`

1. Run the tutorial

   * Option 1: Create a new notebook, and execute the instructions in this document, step by step
   * Option 2: Open the existing notebook `featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb`. You can keep this tutorial document open, and refer to it for documentation links and additional explanation

1. Select **Serverless Spark compute** in the top nav "Compute" dropdown. This step might need one to two minutes to complete. Wait for the top status bar to display **configure session**

   * Select **configure session** at the top nav.  This step might need one to two minutes to complete.

   * Select **Python packages**

   * Select **Upload conda file**

   * In your local device, select the `azureml-examples/sdk/python/featurestore-sample/project/env/conda.yml` file

   * (Optional) To reduce the serverless spark cluster startup time, increase the session time-out, or idle time, value

1. Start the Spark session

      [!notebook-python[] (~/azureml-examples/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=start-spark-session)]

1. Set up the root directory for the samples

      [!notebook-python[] (~/azureml-examples/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=root-dir)]

1. Set up the CLI

   * Install the **azure ml cli** extension

      [!notebook-python[] (~/azureml-examples/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=install-ml-ext-cli)]

   * Authenticate

      [!notebook-python[] (~/azureml-examples/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=auth-cli)]

   * Set the default subscription

      [!notebook-python[] (~/azureml-examples/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=set-default-subs-cli)]

   A feature store supports feature reuse across projects. A project workspace - the current workspace in use - leverages features from feature store to train and inference models. Many project workspaces can share and reuse the same feature store.

## Provision the necessary resources

   You can create a new Gen2 storage account and containers, or reuse existing storage account and container resources for the feature store. In a real-world situation, different storage accounts can host the Gen2 containers. Both options will work, depending on your specific requirements.

   For this tutorial, we'll create three separate storage containers in the same gen2 storage account:

   * Source data
   * Offline store
   * Observation data

1. Create an ADLS Gen 2 storage account, to store source, offline store and observation data.

   STEP 1A:

   You can optionally override the default settings, as shown in these code cell samples:

   **This needs a code cell name:**

   [!notebook-python[] (~/azureml-examples/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=set-default-subs-cli)]

   **This needs a code cell name:**

   [!notebook-python[] (~/azureml-examples/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=set-default-subs-cli)]

   **This needs a code cell name:**

   [!notebook-python[] (~/azureml-examples/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=set-default-subs-cli)]

   **This needs a code cell name:**

   [!notebook-python[] (~/azureml-examples/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=set-default-subs-cli)]

   **This needs a code cell name:**

   [!notebook-python[] (~/azureml-examples/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=set-default-subs-cli)]

   **This needs a code cell name:**

   [!notebook-python[] (~/azureml-examples/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=set-default-subs-cli)]

1. Copy the sample data required for this tutorial series into the newly created storage containers, as shown in these code cell samples:

   STEP 1B:

   **This needs a code cell name:**

   [!notebook-python[] (~/azureml-examples/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=set-default-subs-cli)]

   **This needs a code cell name:**

   [!notebook-python[] (~/azureml-examples/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=set-default-subs-cli)]

   **This needs a code cell name:**

   [!notebook-python[] (~/azureml-examples/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=set-default-subs-cli)]

   **This needs a code cell name:**

   [!notebook-python[] (~/azureml-examples/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=set-default-subs-cli)]

1. Disable the public network access on the newly created storage account, as shown in these code cell samples:

   STEP 1C:

   **This needs a code cell name:**

   [!notebook-python[] (~/azureml-examples/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=set-default-subs-cli)]

   **This needs a code cell name:**

   [!notebook-python[] (~/azureml-examples/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=set-default-subs-cli)]

## Provision the user-assigned managed identity (UAI)

1. Create a new User-assigned managed identity, as shown in these code cell samples:

   STEP 2A:

   **This needs a code cell name:**

   [!notebook-python[] (~/azureml-examples/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=set-default-subs-cli)]

   **This needs a code cell name:**

   [!notebook-python[] (~/azureml-examples/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=set-default-subs-cli)]

   Retrieve the UAI properties

   **This needs a code cell name:**

   [!notebook-python[] (~/azureml-examples/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=set-default-subs-cli)]

   ### Grant RBAC permission to the user assigned managed identity (UAI)

   The UAI will be assigned to the feature store, and requires the following permissions:

   |Scope|Action / Role|
   | ---------- | -------------------- |
   |Feature store|AzureML Data Scientist role|
   |Storage account of feature store offline store|Blob storage data contributor role|
   |Storage accounts of source data|Blob storage data reader role|

   The next CLI commands will assign the first two roles to the UAI. In this example, "Storage accounts of source data" doesn't apply because we read the sample data from a public access blob storage. To use your own data sources, you must assign the required roles to the UAI. To learn more about storage account RBAC, see [this document](../storage/blobs/data-lake-storage-access-control-model.md#role-based-access-control-azure-rbac). To learn more about Azure Machine Learning RBAC, see [this document](./how-to-assign-roles.md).

   **This needs a code cell name:**

   [!notebook-python[] (~/azureml-examples/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=set-default-subs-cli)]

   **This needs a code cell name:**

   [!notebook-python[] (~/azureml-examples/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=set-default-subs-cli)]

   **This needs a code cell name:**

   [!notebook-python[] (~/azureml-examples/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=set-default-subs-cli)]

   ### Grant your user account the "Blob data reader" role on the offline store

   For materialized feature data, you need the **Blob data reader** role to read feature data from an offline materialization store, as shown in these notebook code cells:

   **This needs a code cell name:**

   [!notebook-python[] (~/azureml-examples/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=set-default-subs-cli)]

   **This needs a code cell name:**

   [!notebook-python[] (~/azureml-examples/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=set-default-subs-cli)]

   **This needs a code cell name:**

   [!notebook-python[] (~/azureml-examples/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=set-default-subs-cli)]

   For more information about how to get your AAD object ID from the Azure portal, see [Find the user object ID](/partner-center/find-ids-and-domain-names#find-the-user-object-id).

## Create a feature store with materialization enabled

   ### Set the feature store parameters

   Set the feature store name, location, subscription ID, group name, and ARM ID values, as shown in this code cell sample:

   [!notebook-python[] (~/azureml-examples/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=fs-params)]

   Create a feature store with enabled materialization, as shown in this code cell sample:

   **This needs a code cell name:**

   [!notebook-python[] (~/azureml-examples/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=set-default-subs-cli)]

   ### Create the feature store

   [!notebook-python[] (~/azureml-examples/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=create-fs-cli)]

   ### Initialize the Azure ML feature store core SDK client

   The code in this cell develops and consumes features:

   [!notebook-python[] (~/azureml-examples/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=init-fs-core-sdk)]

   ### Grant UAI access to the feature store

   **This needs a code cell name:**

   [!notebook-python[] (~/azureml-examples/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=init-fs-core-sdk)]

   **This needs a code cell name:**

   [!notebook-python[] (~/azureml-examples/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=init-fs-core-sdk)]

   ### Obtain the default storage account and key vault for the feature store, and disable public network access to the corresponding resources

   **This needs a code cell name:**

   [!notebook-python[] (~/azureml-examples/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=init-fs-core-sdk)]

   **This needs a code cell name:**

   [!notebook-python[] (~/azureml-examples/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=init-fs-core-sdk)]

   **This needs a code cell name:**

   [!notebook-python[] (~/azureml-examples/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=init-fs-core-sdk)]

   **This needs a code cell name:**

   [!notebook-python[] (~/azureml-examples/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=init-fs-core-sdk)]

   ### Disable the public network access for the default feature store key vault created earlier

   * Open the default key vault that you created in the previous cell, in the azure portal
   * Select the Networking tab
   * Select `Disable Public Access`, and then select on `Apply` on the bottom left of the page

## Enable the Managed Vnet for the feature store workspace

   ### Update the feature store with the necessary outbound rules

   **This needs a code cell name:**

   [!notebook-python[] (~/azureml-examples/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=init-fs-core-sdk)]

   **This needs a code cell name:**

   [!notebook-python[] (~/azureml-examples/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=init-fs-core-sdk)]

   ### To create private endpoints for the outbound rules created above, execute provision network commands

   **Sentence two needs clarification:**

   A **provision network** command creates private endpoints from the managed vnet where the materialization job will execute to the source, offline store, observation data, default blob store for the featurestore and the default keyvault for the featurestore. This command might need ten to fifteen minutes to complete.

   **This needs a code cell name:**

   [!notebook-python[] (~/azureml-examples/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=init-fs-core-sdk)]

   **This needs a code cell name:**

   [!notebook-python[] (~/azureml-examples/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=init-fs-core-sdk)]

## Update the managed Vnet for the current project workspace

   **This needs a code cell name:**

   [!notebook-python[] (~/azureml-examples/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=init-fs-core-sdk)]

   ### Update the project workspace with the necessary outbound rules

   The project workspace needs access to these resources:

   * Source data
   * Offline store
   * Observation data
   * Featurestore
   * Default storage account of featurestore

   **This needs a code cell name:**

   [!notebook-python[] (~/azureml-examples/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=init-fs-core-sdk)]

   **This needs a code cell name:**

   [!notebook-python[] (~/azureml-examples/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=init-fs-core-sdk)]

   **This needs a code cell name:**

   [!notebook-python[] (~/azureml-examples/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=init-fs-core-sdk)]

## Prototype and develop a transaction rolling aggregation feature set in this notebook

   ### Explore the transactions source data

   > [!NOTE]
   > A publicly-accessible blob container hosts the sample data used in this notebook. It can only be read in Spark via `wasbs` driver. When you create feature sets using your own source data, please host them in an ADLS Gen2 account, and use an `abfss` driver in the data path.

   [!notebook-python[] (~/azureml-examples/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=explore-txn-src-data)]

   ### Locally develop a transactions feature set

   A feature set specification is a self-contained feature set definition that can be developed and tested locally.

   Here we want to create the following rolling window aggregate features:

   * transactions 3-day count
   * transactions amount 3-day sum
   * transactions amount 3-day avg
   * transactions 7-day count
   * transactions amount 7-day sum
   * transactions amount 7-day avg

   Inspect the feature transformation code file `featurestore/featuresets/transactions/spec/transformation_code/transaction_transform.py`. This is a spark transformer - the rolling aggregation defined for the features.

   **The URL's here don't work:**

   See [feature store concepts](https://github.com/Azure/azureml-examples/blob/0d5a7a836ff07af867af9c17f63fff012b66f7a5/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/fs-concepts-url-todo) and [transformation concepts](https://github.com/Azure/azureml-examples/blob/0d5a7a836ff07af867af9c17f63fff012b66f7a5/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/fs-transformation-concepts-todo) for more information about the feature set and transformations.

   [!notebook-python[] (~/azureml-examples/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=develop-txn-fset-locally)]

   ### Export a feature set specification

   To register a feature set specification with the feature store, that specification must be saved in a specific format.

   To inspect the generated transactions feature set specification, open this file from the file tree to see the spec:

   `featurestore/featuresets/accounts/spec/FeaturesetSpec.yaml`

   The specification contains these elements:

   * `source``: a reference to a storage, in this case a parquet file in a blob storage resource
   * `features``: a list of features and their datatypes. If you provide transformation code

   **This needs a URL:**

   (see Day 2 section)

    the code must return a dataframe that maps to the features and datatypes.

   * index_columns: the join keys required to access values from the feature set

   **The URL's here don't work:**

   Learn more about this in the [top level feature store entities](https://github.com/Azure/azureml-examples/blob/0d5a7a836ff07af867af9c17f63fff012b66f7a5/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/fs-concepts-todo) document and the [feature set spec yaml](https://github.com/Azure/azureml-examples/blob/0d5a7a836ff07af867af9c17f63fff012b66f7a5/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/reference-yaml-featureset-spec.md) reference.

   **This sentence needs background and context:**

   The additional benefit of persisting it is that it can be source controlled.

   **This needs a code cell name:**

   [!notebook-python[] (~/azureml-examples/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=init-fs-core-sdk)]

## Register a feature-store entity

   **The URL here doesn't work. Also, the second sentence does not seem to match the flow of this block:**

   Entities help enforce use of the same join key definitions across feature sets which use the same logical entities. Entity examples could include account entities, customer entities, etc. Entities are typically created once and then reused across feature sets. See [feature store concepts](https://github.com/Azure/azureml-examples/blob/0d5a7a836ff07af867af9c17f63fff012b66f7a5/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/fs-concepts) for more information about feature stores.

## Register the transaction feature set with the feature store, and submit a materialization job

   To share and reuse a feature set asset, you must first register that asset with the feature store. Feature set asset registration offers managed capabilities including versioning and materialization. This tutorial series covers these topics.

   The feature set asset has reference to the feature set spec that you created earlier and additional properties like version and materialization settings.

   ### Create a feature set

   [!notebook-python[] (~/azureml-examples/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=register-txn-fset-cli)]

   **This needs a code cell name:**

   [!notebook-python[] (~/azureml-examples/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=init-fs-core-sdk)]

   ### Submit a backfill materialization job

   **This needs a code cell name:**

   [!notebook-python[] (~/azureml-examples/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=init-fs-core-sdk)]

   **This needs a code cell name:**

   [!notebook-python[] (~/azureml-examples/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=init-fs-core-sdk)]

   **This needs a code cell name:**

   [!notebook-python[] (~/azureml-examples/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=init-fs-core-sdk)]

## Use the registered features to generate a training data dataframe

   ### Load observation data

   We start by exploring the observation data. The core data used for training and inference typically involves observation data. This is then joined with feature data to create a full training data resource. Observation data is the data captured during the time of the event. In this case, it has core transaction data including transaction ID, account ID, and transaction amount values. Here, since the observation data is used for training, it also has the target variable appended (is_fraud).   

   **The reference to 'the docs' needs a URL:**

   To learn more core concepts including observation data, refer to the docs.

   [!notebook-python[] (~/azureml-examples/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=load-obs-data)]

   ### Get the registered feature set, and list its features

   [!notebook-python[] (~/azureml-examples/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=get-txn-fset)]

   [!notebook-python[] (~/azureml-examples/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=print-txn-fset-sample-values)]

   ### Select features, and generate training data

   Here, we select features for the training data, and we use the feature store SDK to generate the training data.

   [!notebook-python[] (~/azureml-examples/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=select-features-and-gen-training-data)]

   We can see that a point-in-time join appended the features to the training data.

## Optional next steps

   Now that you successfully created a secure feature store and submitted a successful materialization run, you can go through the tutorial notebook series to build an understanding of the feature store.

   This notebook contains a mixture of steps from tutorials 1 and 2 of this series. Remember to replace the necessary public storage containers used in the other notebooks with the ones created in this notebook, for the network isolation.



We have reached the end of the tutorial. You have training data that uses features from feature store. You can either save it to storage for later use, or run model training on it directly.



## Next steps

* [Part 3: Experiment and train models using features](./tutorial-experiment-train-models-using-features.md)
* [Part 4: Enable recurrent materialization and run batch inference](./tutorial-enable-recurrent-materialization-run-batch-inference.md)