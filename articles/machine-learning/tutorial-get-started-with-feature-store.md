---
title: "Tutorial 1: Develop and register a feature set with managed feature store"
titleSuffix: Azure Machine Learning managed feature store - basics
description: This is the first part of a tutorial series on managed feature store. 
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: tutorial
author: rsethur
ms.author: seramasu
ms.date: 11/01/2023
ms.reviewer: franksolomon
ms.custom: sdkv2, build-2023, ignite-2023
#Customer intent: As a professional data scientist, I want to know how to build and deploy a model with Azure Machine Learning by using Python in a Jupyter Notebook.
---

# Tutorial 1: Develop and register a feature set with managed feature store

This tutorial series shows how features seamlessly integrate all phases of the machine learning lifecycle: prototyping, training, and operationalization.

You can use Azure Machine Learning managed feature store to discover, create, and operationalize features. The machine learning lifecycle includes a prototyping phase, where you experiment with various features. It also involves an operationalization phase, where models are deployed and inference steps look up feature data. Features serve as the connective tissue in the machine learning lifecycle. To learn more about basic concepts for managed feature store, see [What is managed feature store?](./concept-what-is-managed-feature-store.md) and [Understanding top-level entities in managed feature store](./concept-top-level-entities-in-managed-feature-store.md).

This tutorial describes how to create a feature set specification with custom transformations. It then uses that feature set to generate training data, enable materialization, and perform a backfill. Materialization computes the feature values for a feature window, and then stores those values in a materialization store. All feature queries can then use those values from the materialization store.

Without materialization, a feature set query applies the transformations to the source on the fly, to compute the features before it returns the values. This process works well for the prototyping phase. However, for training and inference operations in a production environment, we recommend that you materialize the features, for greater reliability and availability.

This tutorial is the first part of the managed feature store tutorial series. Here, you learn how to:

> [!div class="checklist"]
> * Create a new, minimal feature store resource.
> * Develop and locally test a feature set with feature transformation capability.
> * Register a feature store entity with the feature store.
> * Register the feature set that you developed with the feature store.
> * Generate a sample training DataFrame by using the features that you created.
> * Enable offline materialization on the feature sets, and backfill the feature data.

This tutorial series has two tracks:

* The SDK-only track uses only Python SDKs. Choose this track for pure, Python-based development and deployment.
* The SDK and CLI track uses the Python SDK for feature set development and testing only, and it uses the CLI for CRUD (create, read, update, and delete) operations. This track is useful in continuous integration and continuous delivery (CI/CD) or GitOps scenarios, where CLI/YAML is preferred.

## Prerequisites

Before you proceed with this tutorial, be sure to cover these prerequisites:

* An Azure Machine Learning workspace. For more information about workspace creation, see [Quickstart: Create workspace resources](./quickstart-create-resources.md).

* On your user account, the Owner role for the resource group where the feature store is created.

   If you choose to use a new resource group for this tutorial, you can easily delete all the resources by deleting the resource group.

## Prepare the notebook environment

This tutorial uses an Azure Machine Learning Spark notebook for development.

1. In the Azure Machine Learning studio environment, select **Notebooks** on the left pane, and then select the **Samples** tab.

1. Browse to the *featurestore_sample* directory (select **Samples** > **SDK v2** > **sdk** > **python** > **featurestore_sample**), and then select **Clone**.

   :::image type="content" source="media/tutorial-get-started-with-feature-store/clone-featurestore-example-notebooks.png" lightbox="media/tutorial-get-started-with-feature-store/clone-featurestore-example-notebooks.png" alt-text="Screenshot that shows selection of the sample directory in Azure Machine Learning studio.":::

1. The **Select target directory** panel opens. Select the **Users** directory, then select _your user name_, and finally select **Clone**.

   :::image type="content" source="media/tutorial-get-started-with-feature-store/select-target-directory.png" lightbox="media/tutorial-get-started-with-feature-store/select-target-directory.png" alt-text="Screenshot showing selection of the target directory location in Azure Machine Learning studio for the sample resource.":::

1. To configure the notebook environment, you must upload the *conda.yml* file:

   1. Select **Notebooks** on the left pane, and then select the **Files** tab.
   1. Browse to the *env* directory (select **Users** > **your_user_name** > **featurestore_sample** > **project** > **env**), and then select the *conda.yml* file.
   1. Select **Download**.

   :::image type="content" source="media/tutorial-get-started-with-feature-store/download-conda-file.png" lightbox="media/tutorial-get-started-with-feature-store/download-conda-file.png" alt-text="Screenshot that shows selection of the Conda YAML file in Azure Machine Learning studio.":::

   1. Select **Serverless Spark Compute** in the top navigation **Compute** dropdown. This operation might take one to two minutes. Wait for a status bar in the top to display **Configure session**.
   1. Select **Configure session** in the top status bar.
   1. Select **Python packages**.
   1. Select **Upload conda files**.
   1. Select the `conda.yml` file you downloaded on your local device.
   1. (Optional) Increase the session time-out (idle time in minutes) to reduce the serverless spark cluster startup time.

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

## Set up the CLI

### [SDK track](#tab/SDK-track)

Not applicable.

### [SDK and CLI track](#tab/SDK-and-CLI-track)

1. Install the Azure Machine Learning CLI extension.

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

This tutorial doesn't require explicit installation of those SDKs, because the earlier *conda.yml* instructions cover this step.

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

   > [!NOTE]
   > - The default blob store for the feature store is an ADLS Gen2 container.
   > - A feature store is always created with an offline materialization store and a user-assigned managed identity (UAI).
   > - If feature store is created with parameters `offline_store=None` and `materialization_identity=None` (default values), then the system performs this set-up:
   >   - An Azure Data Lake Storage Gen 2 (ADLS Gen2) container is created as the offline store.
   >   - A UAI is created and assigned to the feature store as the materialization identity.
   >   - Required role-based access control (RBAC) permissions are assigned to the UAI on the offline store.
   > - Optionally, an existing ADLS Gen2 container can be used as the offline store by defining the `offline_store` parameter. For offline materialization stores, only ADLS Gen2 containers are supported.
   > - Optionally, an existing UAI can be provided by defining a `materialization_identity` parameter. The required RBAC permissions are assigned to the UAI on the offline store during the feature store creation.

   This code sample shows the creation of a feature store with user-defined `offline_store` and `materialization_identity` parameters.
 
   ```python
      import os
      from azure.ai.ml import MLClient
      from azure.ai.ml.identity import AzureMLOnBehalfOfCredential
      from azure.ai.ml.entities import (
         ManagedIdentityConfiguration,
         FeatureStore,
         MaterializationStore,
      )
      from azure.mgmt.msi import ManagedServiceIdentityClient

      # Get an existing offline store
      storage_subscription_id = "<OFFLINE_STORAGE_SUBSCRIPTION_ID>"
      storage_resource_group_name = "<OFFLINE_STORAGE_RESOURCE_GROUP>"
      storage_account_name = "<OFFLINE_STORAGE_ACCOUNT_NAME>"
      storage_file_system_name = "<OFFLINE_STORAGE_CONTAINER_NAME>"

      # Get ADLS Gen2 container ARM ID
      gen2_container_arm_id = "/subscriptions/{sub_id}/resourceGroups/{rg}/providers/Microsoft.Storage/storageAccounts/{account}/blobServices/default/containers/{container}".format(
         sub_id=storage_subscription_id,
         rg=storage_resource_group_name,
         account=storage_account_name,
         container=storage_file_system_name,
      )

      offline_store = MaterializationStore(
         type="azure_data_lake_gen2",
         target=gen2_container_arm_id,
      )

      # Get an existing UAI
      uai_subscription_id = "<UAI_SUBSCRIPTION_ID>"
      uai_resource_group_name = "<UAI_RESOURCE_GROUP>"
      uai_name = "<FEATURE_STORE_UAI_NAME>"

      msi_client = ManagedServiceIdentityClient(
         AzureMLOnBehalfOfCredential(), uai_subscription_id
      )

      managed_identity = msi_client.user_assigned_identities.get(
         uai_resource_group_name, uai_name
      )

      # Get UAI information
      uai_principal_id = managed_identity.principal_id
      uai_client_id = managed_identity.client_id
      uai_arm_id = managed_identity.id

      materialization_identity1 = ManagedIdentityConfiguration(
         client_id=uai_client_id, principal_id=uai_principal_id, resource_id=uai_arm_id
      )

      # Create a feature store
      featurestore_name = "<FEATURE_STORE_NAME>"
      featurestore_location = "<AZURE_REGION>"
      featurestore_subscription_id = os.environ["AZUREML_ARM_SUBSCRIPTION"]
      featurestore_resource_group_name = os.environ["AZUREML_ARM_RESOURCEGROUP"]

      ml_client = MLClient(
         AzureMLOnBehalfOfCredential(),
         subscription_id=featurestore_subscription_id,
         resource_group_name=featurestore_resource_group_name,
      )

      # Use existing ADLS Gen2 container and UAI
      fs = FeatureStore(
         name=featurestore_name,
         location=featurestore_location,
         offline_store=offline_store,
         materialization_identity=materialization_identity1,
      )

      fs_poller = ml_client.feature_stores.begin_update(fs)

      print(fs_poller.result()) 
   ```    

2. Initialize a feature store core SDK client for Azure Machine Learning.

   As explained earlier in this tutorial, the feature store core SDK client is used to develop and consume features.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=init-fs-core-sdk)]

3. Grant the "Azure Machine Learning Data Scientist" role on the feature store to your user identity. Obtain your Microsoft Entra object ID value from the Azure portal, as described in [Find the user object ID](/partner-center/find-ids-and-domain-names#find-the-user-object-id).

   Assign the **AzureML Data Scientist** role to your user identity, so that it can create resources in feature store workspace. The permissions might need some time to propagate.

   For more information more about access control, see [Manage access control for managed feature store](./how-to-setup-access-control-feature-store.md).

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/1. Develop a feature set and register with managed feature store.ipynb?name=assign-aad-ds-role-cli)]  

## Prototype and develop a feature set

In these steps, you build a feature set named `transactions` that has rolling window aggregate-based features:

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
   * `features`: A list of features and their datatypes. If you provide transformation code, the code must return a DataFrame that maps to the features and datatypes.
   * `index_columns`: The join keys required to access values from the feature set.

   To learn more about the specification, see [Understanding top-level entities in managed feature store](./concept-top-level-entities-in-managed-feature-store.md) and [CLI (v2) feature set YAML schema](./reference-yaml-feature-set.md).

   Persisting the feature set specification offers another benefit: the feature set specification can be source controlled.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=dump-transactions-fs-spec)]

## Register a feature store entity

As a best practice, entities help enforce use of the same join key definition across feature sets that use the same logical entities. Examples of entities include accounts and customers. Entities are typically created once and then reused across feature sets. To learn more, see [Understanding top-level entities in managed feature store](./concept-top-level-entities-in-managed-feature-store.md).

### [SDK track](#tab/SDK-track)

1. Initialize the feature store CRUD client.

   As explained earlier in this tutorial, `MLClient` is used for creating, reading, updating, and deleting a feature store asset. The notebook code cell sample shown here searches for the feature store that you created in an earlier step. Here, you can't reuse the same `ml_client` value that you used earlier in this tutorial, because it is scoped at the resource group level. Proper scoping is a prerequisite for feature store creation.

   In this code sample, the client is scoped at feature store level.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=init-fset-crud-client)]

1. Register the `account` entity with the feature store.

   Create an `account` entity that has the join key `accountID` of type `string`.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=register-acct-entity)]

### [SDK and CLI track](#tab/SDK-and-CLI-track)

1. Register the `account` entity with the feature store.

   Create an `account` entity that has the join key `accountID` of type `string`.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/1. Develop a feature set and register with managed feature store.ipynb?name=register-acct-entity-cli)]

---

## Register the transaction feature set with the feature store

Use this code to register a feature set asset with the feature store. You can then reuse that asset and easily share it. Registration of a feature set asset offers managed capabilities, including versioning and materialization. Later steps in this tutorial series cover managed capabilities.

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

## Grant the Storage Blob Data Reader role access to your user account in the offline store
The Storage Blob Data Reader role must be assigned to your user account on the offline store. This ensures that the user account can read materialized feature data from the offline materialization store.

### [SDK track](#tab/SDK-track)

1. Obtain your Microsoft Entra object ID value from the Azure portal, as described in [Find the user object ID](/partner-center/find-ids-and-domain-names#find-the-user-object-id).
1. Obtain information about the offline materialization store from the Feature Store **Overview** page in the Feature Store UI. You can find the values for the storage account subscription ID, storage account resource group name, and storage account name for offline materialization store in the **Offline materialization store** card.

   :::image type="content" source="media/tutorial-get-started-with-feature-store/offline-store-information.png" lightbox="media/tutorial-get-started-with-feature-store/offline-store-information.png" alt-text="Screenshot that shows offline store account information on feature store Overview page.":::

   For more information about access control, see [Manage access control for managed feature store](./how-to-setup-access-control-feature-store.md).

   Execute this code cell for role assignment. The permissions might need some time to propagate.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=grant-rbac-to-user-identity)]

### [SDK and CLI track](#tab/SDK-and-CLI-track)

1. Obtain information about the offline materialization store from the Feature Store **Overview** page in the Feature Store UI. The values for the storage account subscription ID, storage account resource group name, and storage account name for offline materialization store are located in the **Offline materialization store** card.

   :::image type="content" source="media/tutorial-get-started-with-feature-store/offline-store-information.png" lightbox="media/tutorial-get-started-with-feature-store/offline-store-information.png" alt-text="Screenshot that shows offline store account information on feature store Overview page.":::

   For more information about access control, see [Manage access control for managed feature store](./how-to-setup-access-control-feature-store.md).

   Execute this code cell for role assignment. The permissions might need some time to propagate.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/1. Develop a feature set and register with managed feature store.ipynb?name=grant-rbac-to-user-identity-cli)]

---

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

## Enable offline materialization on the `transactions` feature set

   After feature set materialization is enabled, you can perform a backfill. You can also schedule recurrent materialization jobs. For more information, see [the third tutorial in the series](./tutorial-enable-recurrent-materialization-run-batch-inference.md).

### [SDK track](#tab/SDK-track)

#### Set spark.sql.shuffle.partitions in the yaml file according to the feature data size

   The spark configuration `spark.sql.shuffle.partitions` is an OPTIONAL parameter that can affect the number of parquet files generated (per day) when the feature set is materialized into the offline store. The default value of this parameter is 200. As best practice, avoid generation of many small parquet files. If offline feature retrieval becomes slow after feature set materialization, go to the corresponding folder in the offline store to check whether the issue involves too many small parquet files (per day), and adjust the value of this parameter accordingly.

   > [!NOTE]
   > The sample data used in this notebook is small. Therefore, this parameter is set to 1 in the
   > featureset_asset_offline_enabled.yaml file.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=enable-offline-mat-txns-fset)]

### [SDK and CLI track](#tab/SDK-and-CLI-track)

#### Set spark.sql.shuffle.partitions in the yaml file according to the feature data size

   The spark configuration `spark.sql.shuffle.partitions` is an OPTIONAL parameter that can affect the number of parquet files generated (per day) when the feature set is materialized into the offline store. The default value of this parameter is 200. As best practice, avoid generation of many small parquet files. If offline feature retrieval becomes slow after feature set materialization, go to the corresponding folder in the offline store to check whether the issue involves too many small parquet files (per day), and adjust the value of this parameter accordingly.

   > [!NOTE]
   > The sample data used in this notebook is small. Therefore, this parameter is set to 1 in the
   > featureset_asset_offline_enabled.yaml file.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/1. Develop a feature set and register with managed feature store.ipynb?name=enable-offline-mat-txns-fset-cli)]

---

   You can also save the feature set asset as a YAML resource.

### [SDK track](#tab/SDK-track)

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=dump-txn-fset-yaml)]

### [SDK and CLI track](#tab/SDK-and-CLI-track)

   Not applicable.

---

## Backfill data for the `transactions` feature set

   As explained earlier, materialization computes the feature values for a feature window, and it stores these computed values in a materialization store. Feature materialization increases the reliability and availability of the computed values. All feature queries now use the values from the materialization store. This step performs a one-time backfill for a feature window of 18 months.

   > [!NOTE]
   > You might need to determine a backfill data window value. The window must match the window of your training data. For example, to use 18 months of data for training, you must retrieve features for 18 months. This means you should backfill for an 18-month window.

### [SDK track](#tab/SDK-track)

   This code cell materializes data by current status *None* or *Incomplete* for the defined feature window.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=backfill-txns-fset)]

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=stream-mat-job-logs)]

### [SDK and CLI track](#tab/SDK-and-CLI-track)

   This code cell materializes data by current status *None* or *Incomplete* for the defined feature window.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/1. Develop a feature set and register with managed feature store.ipynb?name=backfill-txns-fset-cli)]  

---

   > [!TIP]
   > - The `feature_window_start_time` and `feature_window_end_time` granularity is limited to seconds. Any milliseconds provided in the `datetime` object will be ignored.
   > - A materialization job will only be submitted if data in the feature window matches the `data_status` that is defined while submitting the backfill job.

   Print sample data from the feature set. The output information shows that the data was retrieved from the materialization store. The `get_offline_features()` method retrieved the training and inference data. It also uses the materialization store by default.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/1. Develop a feature set and register with managed feature store.ipynb?name=sample-txns-fset-data)]

## Further explore offline feature materialization
You can explore feature materialization status for a feature set in the **Materialization jobs** UI.

1. Open the [Azure Machine Learning global landing page](https://ml.azure.com/home).
1. Select **Feature stores** on the left pane.
1. From the list of accessible feature stores, select the feature store for which you performed backfill.
1. Select **Materialization jobs** tab.

   :::image type="content" source="media/tutorial-get-started-with-feature-store/feature-set-materialization-ui.png" lightbox="media/tutorial-get-started-with-feature-store/feature-set-materialization-ui.png" alt-text="Screenshot that shows the feature set Materialization jobs UI.":::

- Data materialization status can be
  - Complete (green)
  - Incomplete (red)
  - Pending (blue)
  - None (gray)
- A *data interval* represents a contiguous portion of data with same data materialization status. For example, the earlier snapshot has 16 *data intervals* in the offline materialization store.
- The data can have a maximum of 2,000 *data intervals*. If your data contains more than 2,000 *data intervals*, create a new feature set version.
- You can provide a list of more than one data statuses (for example, `["None", "Incomplete"]`) in a single backfill job.
- During backfill, a new materialization job is submitted for each *data interval* that falls within the defined feature window.
- If a materialization job is pending, or it is running for a *data interval* that hasn't yet been backfilled, a new job isn't submitted for that *data interval*.
- You can retry a failed materialization job.

   > [!NOTE]
   > To get the job ID of a failed materialization job:
   >   - Navigate to the feature set **Materialization jobs** UI.
   >   - Select the **Display name** of a specific job with **Status** of *Failed*.
   >   - Locate the job ID under the **Name** property found on the job **Overview** page. It starts with `Featurestore-Materialization-`.  

### [SDK track](#tab/SDK-track)

```python

poller = fs_client.feature_sets.begin_backfill(
    name="transactions",
    version=version,
    job_id="<JOB_ID_OF_FAILED_MATERIALIZATION_JOB>",
)
print(poller.result().job_ids)
```

### [SDK and CLI track](#tab/SDK-and-CLI-track)

```AzureCLI
az ml feature-set backfill --by-job-id <JOB_ID_OF_FAILED_MATERIALIZATION_JOB> --name <FEATURE_SET_NAME> --version <VERSION>  --feature-store-name <FEATURE_STORE_NAME> --resource-group <RESOURCE_GROUP>
```
---

### Updating offline materialization store
- If an offline materialization store must be updated at the feature store level, then all feature sets in the feature store should have offline materialization disabled.
- If offline materialization is disabled on a feature set, materialization status of the data already materialized in the offline materialization store resets. The reset renders data that is already materialized unusable. You must resubmit materialization jobs after enabling offline materialization.

This tutorial built the training data with features from the feature store, enabled materialization to offline feature store, and performed a backfill. Next, you'll run model training using these features.

## Clean up

The [fifth tutorial in the series](./tutorial-develop-feature-set-with-custom-source.md#clean-up) describes how to delete the resources.

## Next steps

* See the next tutorial in the series: [Experiment and train models by using features](./tutorial-experiment-train-models-using-features.md).
* Learn about [feature store concepts](./concept-what-is-managed-feature-store.md) and [top-level entities in managed feature store](./concept-top-level-entities-in-managed-feature-store.md).
* Learn about [identity and access control for managed feature store](./how-to-setup-access-control-feature-store.md).
* View the [troubleshooting guide for managed feature store](./troubleshooting-managed-feature-store.md).
* View the [YAML reference](./reference-yaml-overview.md).