---
title: "Tutorial 6: Network isolation for feature store (preview)"
titleSuffix: Azure Machine Learning managed feature store - basics
description: This is part 6 of a tutorial series on managed feature store. 
services: machine-learning
ms.service: machine-learning

ms.subservice: core
ms.topic: tutorial
author: ynpandey
ms.author: yogipandey
ms.date: 09/13/2023
ms.reviewer: franksolomon
ms.custom: sdkv2
#Customer intent: As a professional data scientist, I want to know how to build and deploy a model with Azure Machine Learning by using Python in a Jupyter Notebook.
---

# Tutorial 6: Network isolation with feature store (preview)

[!INCLUDE [preview disclaimer](includes/machine-learning-preview-generic-disclaimer.md)]

An Azure Machine Learning managed feature store lets you discover, create, and operationalize features. Features serve as the connective tissue in the machine learning lifecycle, starting from the prototyping phase, where you experiment with various features. That lifecycle continues to the operationalization phase, where you deploy your models, and inference steps look up the feature data. For more information about feature stores, see the [feature store concepts](./concept-what-is-managed-feature-store.md) document.

This tutorial describes how to configure secure ingress through a private endpoint, and secure egress through a managed virtual network.

Part 1 of this tutorial series showed how to create a feature set specification with custom transformations, and use that feature set to generate training data. Part 2 of the tutorial series showed how to enable materialization and perform a backfill. Part 3 of this tutorial series showed how to experiment with features, as a way to improve model performance. Part 3 also showed how a feature store increases agility in the experimentation and training flows. Tutorial 4 described how to run batch inference. Tutorial 5 explained how to use feature store for online/realtime inference use cases. Tutorial 6 shows how to

> [!div class="checklist"]
> * Set up the necessary resources for network isolation of a managed feature store.
> * Create a new feature store resource.
> * Set up your feature store to support network isolation scenarios.
> * Update your project workspace (current workspace) to support network isolation scenarios .

## Prerequisites

> [!NOTE]
> This tutorial uses Azure Machine Learning notebook with **Serverless Spark Compute**.

* Make sure you complete parts 1 through 5 of this tutorial series.
* An Azure Machine Learning workspace, enabled with Managed virtual network for **serverless spark jobs**.
* If your workspace has an **Azure Container Registry**, it must use **Premium SKU** to successfully complete the workspace configuration. To configure your project workspace:
  1. Create a YAML file named `network.yml`:
     ```YAML
     managed_network:
     isolation_mode: allow_internet_outbound
     ```
  1. Execute these commands to update the workspace and provision the managed virtual network for serverless Spark jobs:

     ```cli
     az ml workspace update --file network.yml --resource-group my_resource_group --name
     my_workspace_name
     az ml workspace provision-network --resource-group my_resource_group --name my_workspace_name
     --include-spark
     ```

   For more information, see [Configure for serverless spark job](./how-to-managed-network.md#configure-for-serverless-spark-jobs).
     
* Your user account must have the `Owner` or `Contributor` role assigned to the resource group where you create the feature store. Your user account also needs the `User Access Administrator` role.

> [!IMPORTANT]
> For your Azure Machine Learning workspace, set the `isolation_mode` to `allow_internet_outbound`. This is the only `isolation_mode` option available at this time. However, we are actively working to add `allow_only_approved_outbound` isolation_mode functionality. As a workaround, this tutorial will show how to connect to sources, materialization store and observation data securely through private endpoints.

## Set up

This tutorial uses the Python feature store core SDK (`azureml-featurestore`). The Python SDK is used for feature set development and testing only. The CLI is used for create, read, update, and delete (CRUD) operations, on feature stores, feature sets, and feature store entities. This is useful in continuous integration and continuous delivery (CI/CD) or GitOps scenarios where CLI/YAML is preferred.

You don't need to explicitly install these resources for this tutorial, because in the set-up instructions shown here, the `conda.yaml` file covers them.

To prepare the notebook environment for development:

1. Clone the [azureml-examples](https://github.com/azure/azureml-examples) repository to your local GitHub resources with this command:

   `git clone --depth 1 https://github.com/Azure/azureml-examples`

   You can also download a zip file from the [azureml-examples](https://github.com/azure/azureml-examples) repository. At this page, first select the `code` dropdown, and then select `Download ZIP`. Then, unzip the contents into a folder on your local device.

1. Upload the feature store samples directory to the project workspace

   1. In the Azure Machine Learning workspace, open the Azure Machine Learning studio UI.
   1. Select **Notebooks** in left navigation panel.
   1. Select your user name in the directory listing.
   1. Select ellipses (**...**) and then select **Upload folder**.
   1. Select the feature store samples folder from the cloned directory path: `azureml-examples/sdk/python/featurestore-sample`.

1. Run the tutorial

   * Option 1: Create a new notebook, and execute the instructions in this document, step by step.
   * Option 2: Open existing notebook `featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb`. You may keep this document open and refer to it for more explanation and documentation links.

       1. Select **Serverless Spark Compute** in the top navigation **Compute** dropdown. This operation might take one to two minutes. Wait for a status bar in the top to display **Configure session**.
       1. Select **Configure session** in the top status bar.
       1. Select **Python packages**.
       1. Select **Upload conda file**.
       1. Select file `azureml-examples/sdk/python/featurestore-sample/project/env/conda.yml` located on your local device.
       1. (Optional) Increase the session time-out (idle time in minutes) to reduce the serverless spark cluster startup time.

1. This code cell starts the Spark session. It needs about 10 minutes to install all dependencies and start the Spark session.

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=start-spark-session)]

1. Set up the root directory for the samples

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=root-dir)]

1. Set up the Azure Machine Learning CLI:

   * Install the Azure Machine Learning CLI extension

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=install-ml-ext-cli)]

   * Authenticate

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=auth-cli)]

   * Set the default subscription

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=set-default-subs-cli)]

   > [!NOTE]
   > A **feature store workspace** supports feature reuse across projects. A **project workspace** - the current workspace in use - leverages features from a specific feature store, to train and inference models. Many project workspaces can share and reuse the same feature store workspace.

## Provision the necessary resources

You can create a new Azure Data Lake Storage (ADLS) Gen2 storage account and containers, or reuse existing storage account and container resources for the feature store. In a real-world situation, different storage accounts can host the ADLS Gen2 containers. Both options work, depending on your specific requirements.

For this tutorial, you create three separate storage containers in the same ADLS Gen2 storage account:

   * Source data
   * Offline store
   * Observation data

1. Create an ADLS Gen2 storage account for source data, offline store, and observation data.

   1. Provide the name of an Azure Data Lake Storage Gen2 storage account in the following code sample. You can execute the following code cell with the provided default settings. Optionally, you can override the default settings.  

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=default-settings)]

   1. This code cell creates the ADLS Gen2 storage account defined in the above code cell.

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=create-storage-cli)]

   1. This code cell creates a new storage container for offline store.

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=create-offline-cli)]

   1. This code cell creates a new storage container for source data.

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=create-source-cli)]

   1. This code cell creates a new storage container for observation data.

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=create-obs-cli)]

1. Copy the sample data required for this tutorial series into the newly created storage containers.

   1. To write data to the storage containers, ensure that **Contributor** and **Storage Blob Data Contributor** roles are assigned to the user identity on the created ADLS Gen2 storage account in the Azure portal [following these steps](../role-based-access-control/role-assignments-portal.md).

      > [!IMPORTANT]
      > Once you have ensured that the **Contributor** and **Storage Blob Data Contributor** roles are assigned to the user identity, wait for a few minutes after role assignment to let permissions propagate before proceeding with the next steps. To learn more about access control, see [role-based access control (RBAC) for Azure storage accounts](../storage/blobs/data-lake-storage-access-control-model.md#role-based-access-control-azure-rbac)

      The following code cells copy sample source data for transactions feature set used in this tutorial from a public storage account to the newly created storage account.

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=copy-transact-data)]

   1. Copy sample source data for account feature set used in this tutorial from a public storage account to the newly created storage account.

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=copy-account-data)]

   1. Copy sample observation data used for training from a public storage account to the newly created storage account.

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=copy-obs-train-data)]

   1. Copy sample observation data used for batch inference from a public storage account to the newly created storage account.

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=copy-obs-batch-data)]

1. Disable the public network access on the newly created storage account.

   1. This code cell disables public network access for the ADLS Gen2 storage account created earlier.

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=disable-pna-gen2-cli)]

   1. Set ARM IDs for the offline store, source data, and observation data containers.

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=set-container-arm-ids)]

## Provision the user-assigned managed identity (UAI)

1. Create a new User-assigned managed identity.

   1. In the following code cell, provide a name for the user-assigned managed identity that you would like to create.

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=define-uai-name)]

   1. This code cell creates the UAI.

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=create-uai-cli)]

   1. This code cell retrieves the principal ID, client ID, and ARM ID property values for the created UAI.

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=retrieve-uai-props)]

   ### Grant RBAC permission to the user-assigned managed identity (UAI)

   The UAI is assigned to the feature store, and requires the following permissions:

   |Scope|	Action/Role|
   |--|--|
   |Feature store	|Azure Machine Learning Data Scientist role|
   |Storage account of feature store offline store	|Storage Blob Data Contributor role|
   |Storage accounts of source data	|Storage Blob Data Contributor role|

   The next CLI commands will assign the **Storage Blob Data Contributor** role to the UAI. In this example, "Storage accounts of source data" doesn't apply because you read the sample data from a public access blob storage. To use your own data sources, you must assign the required roles to the UAI. To learn more about access control, see role-based access control for [Azure storage accounts](../storage/blobs/data-lake-storage-access-control-model.md#role-based-access-control-azure-rbac) and [Azure Machine Learning workspace](./how-to-assign-roles.md).

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=uai-offline-role-cli)]

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=uai-source-role-cli)]

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=uai-obs-role-cli)]

## Create a feature store with materialization enabled

   ### Set the feature store parameters

   Set the feature store name, location, subscription ID, group name, and ARM ID values, as shown in this code cell sample:

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=fs-params)]

   Following code cell generates a YAML specification file for a feature store with materialization enabled.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=create-fs-yaml)]

   ### Create the feature store

   This code cell creates a feature store with materialization enabled by using the YAML specification file generated in the previous step.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=create-fs-cli)]

   ### Initialize the Azure Machine Learning feature store core SDK client

   The SDK client initialized in this cell facilitates development and consumption of features:

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=init-fs-core-sdk)]

   ### Grant UAI access to the feature store

   This code cell assigns **AzureML Data Scientist** role to the UAI on the created feature store. To learn more about access control, see role-based access control for [Azure storage accounts](../storage/blobs/data-lake-storage-access-control-model.md#role-based-access-control-azure-rbac) and [Azure Machine Learning workspace](./how-to-assign-roles.md).

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=uai-fs-role-cli)]

   Follow these instructions to [get the Microsoft Entra Object ID for your user identity](/partner-center/find-ids-and-domain-names#find-the-user-object-id). Then, use your Microsoft Entra Object ID in the following command to assign **AzureML Data Scientist** role to your user identity on the created feature store.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=aad-fs-role-cli)]

   ### Obtain the default storage account and key vault for the feature store, and disable public network access to the corresponding resources

   The following code cell gets the feature store object for the next steps.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=fs-get)]

   This code cell gets names of default storage account and key vault for the feature store.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=copy-storage-kv-props)]

   This code cell disables public network access to the default storage account for the feature store.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=disable-pna-fs-gen2-cli)]

   The following cell prints name of the default key vault for the feature store.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=print-default-kv)]

   ### Disable the public network access for the default feature store key vault created earlier

   * Open the default key vault that you created in the previous cell, in the Azure portal.
   * Select the **Networking** tab.
   * Select **Disable public access**, and then select **Apply** on the bottom left of the page.

## Enable the managed virtual network for the feature store workspace

   ### Update the feature store with the necessary outbound rules

   The following code cell creates a YAML specification file for outbound rules that are defined for the feature store.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=create-fs-vnet-yaml)]

   This code cell updates the feature store using the generated YAML specification file with the outbound rules.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=create-fs-vnet-cli)]

   ### Create private endpoints for the defined outbound rules

   A `provision-network` command creates private endpoints from the managed virtual network where the materialization job executes to the source, offline store, observation data, default storage account, and the default key vault for the feature store. This command may need about 20 minutes to complete.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=fs-vnet-provision-cli)]

   This code cell confirms that private endpoints defined by the outbound rules have been created.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=fs-show-cli)]

## Update the managed virtual network for the project workspace

   Next, update the managed virtual network for the project workspace. First, get the subscription ID, resource group, and workspace name for the project workspace.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=lookup-subid-rg-wsname)]

   ### Update the project workspace with the necessary outbound rules

   The project workspace needs access to these resources:

   * Source data
   * Offline store
   * Observation data
   * Feature store
   * Default storage account of feature store

   This code cell updates the project workspace using the generated YAML specification file with required outbound rules.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=create-fs-prjws-vnet-yaml)]

   This code cell updates the project workspace using the generated YAML specification file with the outbound rules.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=create-fs-prjws-vnet-cli)]

   This code cell confirms that private endpoints defined by the outbound rules have been created.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=show-prjws-cli)]

   You can also verify the outbound rules from the Azure portal by navigating to **Networking** from left navigation panel for the project workspace and then opening **Workspace managed outbound access** tab.

   :::image type="content" source="./media/tutorial-network-isolation-for-feature-store/project-workspace-outbound-rules.png" lightbox="./media/tutorial-network-isolation-for-feature-store/project-workspace-outbound-rules.png" alt-text="This screenshot shows outbound rules for a project workspace in Azure portal.":::

## Prototype and develop a transaction rolling aggregation feature set

   ### Explore the transactions source data

   > [!NOTE]
   > A publicly-accessible blob container hosts the sample data used in this tutorial. It can only be read in Spark via `wasbs` driver. When you create feature sets using your own source data, please host them in an ADLS Gen2 account, and use an `abfss` driver in the data path.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=explore-txn-src-data)]

   ### Locally develop a transactions feature set

   A feature set specification is a self-contained feature set definition that can be developed and tested locally.

   Create the following rolling window aggregate features:

   * transactions three-day count
   * transactions amount three-day sum
   * transactions amount three-day avg
   * transactions seven-day count
   * transactions amount seven-day sum
   * transactions amount seven-day avg

   Inspect the feature transformation code file `featurestore/featuresets/transactions/spec/transformation_code/transaction_transform.py`. This spark transformer performs the rolling aggregation defined for the features.

   To understand the feature set and transformations in more detail, see [feature store concepts](./concept-what-is-managed-feature-store.md).

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=develop-txn-fset-locally)]

   ### Export a feature set specification

   To register a feature set specification with the feature store, that specification must be saved in a specific format.

   To inspect the generated transactions feature set specification, open this file from the file tree to see the specification:

   `featurestore/featuresets/accounts/spec/FeaturesetSpec.yaml`

   The specification contains these elements:

   * `source`: a reference to a storage resource - in this case a parquet file in a blob storage resource
   * `features`: a list of features and their datatypes. If you provide transformation code
   * `index_columns`: the join keys required to access values from the feature set

   As another benefit of persisting a feature set specification as a YAML file, the specification can be version controlled. Learn more about feature set specification in the [top level feature store entities document](./concept-top-level-entities-in-managed-feature-store.md) and the [feature set specification YAML reference](./reference-yaml-featureset-spec.md).

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=dump-transactions-fs-spec)]

## Register a feature-store entity

   Entities help enforce use of the same join key definitions across feature sets that use the same logical entities. Entity examples could include account entities, customer entities, etc. Entities are typically created once and then reused across feature sets. For more information, see the [top level feature store entities document](./concept-top-level-entities-in-managed-feature-store.md).

   This code cell creates an account entity for the feature store.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=register-acct-entity-cli)]

## Register the transaction feature set with the feature store, and submit a materialization job

   To share and reuse a feature set asset, you must first register that asset with the feature store. Feature set asset registration offers managed capabilities including versioning and materialization. This tutorial series covers these topics.

   The feature set asset references both the feature set spec that you created earlier, and other properties like version and materialization settings.

   ### Create a feature set

   The following code cell creates a feature set by using a predefined YAML specification file.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=register-txn-fset-cli)]

   This code cell previews the newly created feature set.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=preview-fs-cli)]

   ### Submit a backfill materialization job

   The following code cell defines start and end time values for the feature materialization window, and submits a backfill materialization job.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=submit-backfill-cli)]

   This code cell checks the status of the backfill materialization job, by providing `<JOB_ID_FROM_PREVIOUS_COMMAND>`.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=check-job-status-cli)]

   Next, This code cell lists all the materialization jobs for the current feature set.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=list-material-ops-cli)]

## Use the registered features to generate training data

   ### Load observation data

   Start by exploring the observation data. The core data used for training and inference typically involves observation data. The core data is then joined with feature data, to create a full training data resource. Observation data is the data captured during the time of the event. In this case, it has core transaction data including transaction ID, account ID, and transaction amount values. Here, since the observation data is used for training, it also has the target variable appended (`is_fraud`).

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=load-obs-data)]

   ### Get the registered feature set, and list its features

   Next, get a feature set by providing its name and version, and then list features in this feature set. Also, print some sample feature values.  

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=get-txn-fset)]

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=print-txn-fset-sample-values)]

   ### Select features, and generate training data

   Select features for the training data, and use the feature store SDK to generate the training data.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/network_isolation/Network Isolation for Feature store.ipynb?name=select-features-and-gen-training-data)]

   You can see that a point-in-time join appended the features to the training data.

## Optional next steps

   Now that you successfully created a secure feature store and submitted a successful materialization run, you can go through the tutorial series to build an understanding of the feature store.

   This tutorial contains a mixture of steps from tutorials 1 and 2 of this series. Remember to replace the necessary public storage containers used in the other tutorial notebooks with the ones created in this tutorial notebook, for the network isolation.

We have reached the end of the tutorial. Your training data uses features from a feature store. You can either save it to storage for later use, or directly run model training on it.

## Next steps

* [Part 3: Experiment and train models using features](./tutorial-experiment-train-models-using-features.md)
* [Part 4: Enable recurrent materialization and run batch inference](./tutorial-enable-recurrent-materialization-run-batch-inference.md)
