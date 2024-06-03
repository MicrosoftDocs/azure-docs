---
title: "Tutorial 7: Develop a feature set using Domain Specific Language (preview)"
titleSuffix: Azure Machine Learning managed feature store - basics
description: This is part 7 of the managed feature store tutorial series.
services: machine-learning
ms.service: machine-learning

ms.subservice: core
ms.topic: tutorial
author: ynpandey
ms.author: yogipandey
ms.date: 03/29/2024
ms.reviewer: franksolomon
ms.custom: sdkv2
#Customer intent: As a professional data scientist, I want to know how to build and deploy a model with Azure Machine Learning by using Python in a Jupyter Notebook.
---

# Tutorial 7: Develop a feature set using Domain Specific Language (preview)

[!INCLUDE [preview disclaimer](includes/machine-learning-preview-generic-disclaimer.md)]

An Azure Machine Learning managed feature store lets you discover, create, and operationalize features. Features serve as the connective tissue in the machine learning lifecycle, starting from the prototyping phase, where you experiment with various features. That lifecycle continues to the operationalization phase, where you deploy your models, and proceeds to the inference steps that look up feature data. For more information about feature stores, visit [feature store concepts](./concept-what-is-managed-feature-store.md).

This tutorial describes how to develop a feature set using Domain Specific Language. The Domain Specific Language (DSL) for the managed feature store provides a simple and user-friendly way to define the most commonly used feature aggregations. With the feature store SDK, users can perform the most commonly used aggregations with a DSL *expression*. Aggregations that use the DSL *expression* ensure consistent results, compared with user-defined functions (UDFs). Additionally, those aggregations avoid the overhead of writing UDFs.

This Tutorial shows how to

> [!div class="checklist"]
> * Create a new, minimal feature store workspace
> * Locally develop and test a feature, through use of Domain Specific Language (DSL)
> * Develop a feature set through use of User Defined Functions (UDFs) that perform the same transformations as a feature set created with DSL
> * Compare the results of the feature sets created with DSL, and feature sets created with UDFs
> * Register a feature store entity with the feature store
> * Register the feature set created using DSL with the feature store
> * Generate sample training data using the created features

## Prerequisites

> [!NOTE]
> This tutorial uses an Azure Machine Learning notebook with **Serverless Spark Compute**.

Before you proceed with this tutorial, make sure that you cover these prerequisites:

1. An Azure Machine Learning workspace. If you don't have one, visit [Quickstart: Create workspace resources](./quickstart-create-resources.md?view-azureml-api-2) to learn how to create one.
1. To perform the steps in this tutorial, your user account needs either the **Owner** or **Contributor** role to the resource group where the feature store will be created.

## Set up

   This tutorial relies on the Python feature store core SDK (`azureml-featurestore`). This SDK is used for create, read, update, and delete (CRUD) operations, on feature stores, feature sets, and feature store entities.

   You don't need to explicitly install these resources for this tutorial, because in the set-up instructions shown here, the `conda.yml` file covers them.

   To prepare the notebook environment for development:

   1. Clone the [examples repository - (azureml-examples)](https://github.com/azure/azureml-examples) to your local machine with this command:

      `git clone --depth 1 https://github.com/Azure/azureml-examples`

      You can also download a zip file from the [examples repository (azureml-examples)](https://github.com/azure/azureml-examples). At this page, first select the `code` dropdown, and then select `Download ZIP`. Then, unzip the contents into a folder on your local machine.

   1. Upload the feature store samples directory to project workspace
      1. Open Azure Machine Learning studio UI of your Azure Machine Learning workspace
      1. Select **Notebooks** in left navigation panel
      1. Select your user name in the directory listing
      1. Select the ellipses (**...**), and then select **Upload folder**
      1. Select the feature store samples folder from the cloned directory path: `azureml-examples/sdk/python/featurestore-sample`

   1. Run the tutorial

      * Option 1: Create a new notebook, and execute the instructions in this document, step by step
      * Option 2: Open existing notebook `featurestore_sample/notebooks/sdk_only/7.Develop-feature-set-domain-specific-language-dsl.ipynb`. You can keep this document open, and refer to it for more explanation and documentation links

   1. To configure the notebook environment, you must upload the `conda.yml` file

      1. Select **Notebooks** on the left navigation panel, and then select the **Files** tab
      1. Navigate to the `env` directory (select **Users** > *your_user_name* > **featurestore_sample** > **project** > **env**), and then select the `conda.yml` file
      1. Select **Download**
      1. Select **Serverless Spark Compute** in the top navigation **Compute** dropdown. This operation might take one to two minutes. Wait for the status bar in the top to display the **Configure session** link
      1. Select **Configure session** in the top status bar
      1. Select **Settings**
      1. Select **Apache Spark version** as `Spark version 3.3`
      1. Optionally, increase the **Session timeout** (idle time) if you want to avoid frequent restarts of the serverless Spark session
      1. Under **Configuration settings**, define *Property* `spark.jars.packages` and *Value* `com.microsoft.azure:azureml-fs-scala-impl:1.0.4`
         :::image type="content" source="./media/tutorial-feature-store-domain-specific-language/dsl-spark-jars-property.png" lightbox="./media/tutorial-feature-store-domain-specific-language/dsl-spark-jars-property.png" alt-text="This screenshot shows the Spark session property for a package that contains the jar file used by managed feature store domain-specific language.":::
      1. Select **Python packages**
      1. Select **Upload conda file**
      1. Select the `conda.yml` you downloaded on your local device
      1. Select **Apply**

         > [!TIP]
         > Except for this specific step, you must run all the other steps every time you start a new spark session, or after session time out.

   1. This code cell sets up the root directory for the samples and starts the Spark session. It needs about 10 minutes to install all the dependencies and start the Spark session:

         [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/7.Develop-feature-set-domain-specific-language-dsl.ipynb?name=setup-root-dir)]

## Provision the necessary resources

   1. Create a minimal feature store:

      Create a feature store in a region of your choice, from the Azure Machine Learning studio UI or with Azure Machine Learning Python SDK code.

      * Option 1: Create feature store from the Azure Machine Learning studio UI

        1. Navigate to the feature store UI [landing page](https://ml.azure.com/featureStores)
        1. Select **+ Create**
        1. The **Basics** tab appears
        1. Choose a **Name** for your feature store
        1. Select the **Subscription**
        1. Select the **Resource group**
        1. Select the **Region**
        1. Select **Apache Spark version** 3.3, and then select **Next**
        1. The **Materialization** tab appears
        1. Toggle **Enable materialization**
        1. Select **Subscription** and **User identity** to **Assign user managed identity**
        1. Select **From Azure subscription** under **Offline store**
        1. Select **Store name** and **Azure Data Lake Gen2 file system name**, then select **Next**
        1. On the **Review** tab, verify the displayed information and then select **Create**

      * Option 2: Create a feature store using the Python SDK
         Provide `featurestore_name`, `featurestore_resource_group_name`, and `featurestore_subscription_id` values, and execute this cell to create a minimal feature store:

         [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/7.Develop-feature-set-domain-specific-language-dsl.ipynb?name=create-min-fs)]

   1. Assign permissions to your user identity on the offline store:

      If feature data is materialized, then you must assign the **Storage Blob Data Reader** role to your user identity to read feature data from offline materialization store.
      1. Open the [Azure ML global landing page](https://ml.azure.com/home)
      1. Select **Feature stores** in the left navigation
      1. You'll see the list of feature stores that you have access to. Select the feature store that you created above
      1. Select the storage account link under **Account name** on the **Offline materialization store** card, to navigate to the ADLS Gen2 storage account for the offline store
         :::image type="content" source="./media/tutorial-feature-store-domain-specific-language/offline-store-link.png" lightbox="./media/tutorial-feature-store-domain-specific-language/offline-store-link.png" alt-text="This screenshot shows the storage account link for the offline materialization store on the feature store UI.":::
      1. Visit [this resource](../role-based-access-control/role-assignments-portal.yml) for more information about how to assign the **Storage Blob Data Reader** role to your user identity on the ADLS Gen2 storage account for offline store. Allow some time for permissions to propagate.

## Available DSL expressions and benchmarks

   Currently, these aggregation expressions are supported:
   - Average - `avg`
   - Sum - `sum`
   - Count - `count`
   - Min - `min`
   - Max - `max`

   This table provides benchmarks that compare performance of aggregations that use DSL *expression* with the aggregations that use UDF, using a representative dataset of size 23.5 GB with the following attributes:
   - `numberOfSourceRows`: 348,244,374
   - `numberOfOfflineMaterializedRows`: 227,361,061

   |Function|*Expression*|UDF execution time|DSL execution time|
   |--------|------------|------------------|------------------|
   |`get_offline_features(use_materialized_store=false)`|`sum`, `avg`, `count`|~2 hours|< 5 minutes|
   |`get_offline_features(use_materialized_store=true)`|`sum`, `avg`, `count`|~1.5 hours|< 5 minutes|
   |`materialize()`|`sum`, `avg`, `count`|~1 hour|< 15 minutes|

   > [!NOTE]
   > The `min` and `max` DSL expressions provide no performance improvement over UDFs. We recommend that you use UDFs for `min` and `max` transformations.

## Create a feature set specification using DSL expressions

   1. Execute this code cell to create a feature set specification, using DSL expressions and parquet files as source data.

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/7.Develop-feature-set-domain-specific-language-dsl.ipynb?name=create-dsl-parq-fset)]

   1. This code cell defines the start and end times for the feature window.

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/7.Develop-feature-set-domain-specific-language-dsl.ipynb?name=define-feat-win)]

   1. This code cell uses `to_spark_dataframe()` to get a dataframe in the defined feature window from the above feature set specification defined using DSL expressions:

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/7.Develop-feature-set-domain-specific-language-dsl.ipynb?name=sparkdf-dsl-parq)]

   1. Print some sample feature values from the feature set defined with DSL expressions:

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/7.Develop-feature-set-domain-specific-language-dsl.ipynb?name=display-dsl-parq)]

## Create a feature set specification using UDF

   1. Create a feature set specification that uses UDF to perform the same transformations:

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/7.Develop-feature-set-domain-specific-language-dsl.ipynb?name=create-udf-parq-fset)]

      This transformation code shows that the UDF defines the same transformations as the DSL expressions:

      ```python
      class TransactionFeatureTransformer(Transformer):
         def _transform(self, df: DataFrame) -> DataFrame:
            days = lambda i: i * 86400
            w_3d = (
                  Window.partitionBy("accountID")
                  .orderBy(F.col("timestamp").cast("long"))
                  .rangeBetween(-days(3), 0)
            )
            w_7d = (
                  Window.partitionBy("accountID")
                  .orderBy(F.col("timestamp").cast("long"))
                  .rangeBetween(-days(7), 0)
            )
            res = (
                  df.withColumn("transaction_7d_count", F.count("transactionID").over(w_7d))
                  .withColumn(
                     "transaction_amount_7d_sum", F.sum("transactionAmount").over(w_7d)
                  )
                  .withColumn(
                     "transaction_amount_7d_avg", F.avg("transactionAmount").over(w_7d)
                  )
                  .withColumn("transaction_3d_count", F.count("transactionID").over(w_3d))
                  .withColumn(
                     "transaction_amount_3d_sum", F.sum("transactionAmount").over(w_3d)
                  )
                  .withColumn(
                     "transaction_amount_3d_avg", F.avg("transactionAmount").over(w_3d)
                  )
                  .select(
                     "accountID",
                     "timestamp",
                     "transaction_3d_count",
                     "transaction_amount_3d_sum",
                     "transaction_amount_3d_avg",
                     "transaction_7d_count",
                     "transaction_amount_7d_sum",
                     "transaction_amount_7d_avg",
                  )
            )
            return res

      ```

   1. Use `to_spark_dataframe()` to get a dataframe from the above feature set specification, defined using UDF:
      
      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/7.Develop-feature-set-domain-specific-language-dsl.ipynb?name=sparkdf-udf-parq)]

   1. Compare the results and verify consistency between the results from the DSL expressions and the transformations performed with UDF. To verify, select one of the `accountID` values to compare the values in the two dataframes:

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/7.Develop-feature-set-domain-specific-language-dsl.ipynb?name=display-dsl-acct)]

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/7.Develop-feature-set-domain-specific-language-dsl.ipynb?name=display-udf-acct)]

## Export feature set specifications as YAML

   To register the feature set specification with the feature store, it must be saved in a specific format. To review the generated `transactions-dsl` feature set specification, open this file from the file tree, to see the specification: `featurestore/featuresets/transactions-dsl/spec/FeaturesetSpec.yaml`

   The feature set specification contains these elements:

   1. `source`: Reference to a storage resource; in this case, a parquet file in a blob storage
   1. `features`: List of features and their datatypes. If you provide transformation code, the code must return a dataframe that maps to the features and data types
   1. `index_columns`: The join keys required to access values from the feature set

   For more information, read the [top level feature store entities document](./concept-top-level-entities-in-managed-feature-store.md) and the [feature set specification YAML reference](./reference-yaml-featureset-spec.md) resources.

   As an extra benefit of persisting the feature set specification, it can be source controlled.

   1. Execute this code cell to write YAML specification file for the feature set, using parquet data source and DSL expressions:

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/7.Develop-feature-set-domain-specific-language-dsl.ipynb?name=dump-dsl-parq-fset-spec)]

   1. Execute this code cell to write a YAML specification file for the feature set, using UDF:

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/7.Develop-feature-set-domain-specific-language-dsl.ipynb?name=dump-udf-parq-fset-spec)]

## Initialize SDK clients

   The following steps of this tutorial use two SDKs.

   1. Feature store CRUD SDK: The Azure Machine Learning (AzureML) SDK `MLClient` (package name `azure-ai-ml`), similar to the one used with Azure Machine Learning workspace. This SDK facilitates feature store CRUD operations
   
      - Create
      - Read
      - Update
      - Delete
   
      for feature store and feature set entities, because feature store is implemented as a type of Azure Machine Learning workspace

   1. Feature store core SDK: This SDK (`azureml-featurestore`) facilitates feature set development and consumption:

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/7.Develop-feature-set-domain-specific-language-dsl.ipynb?name=init-python-clients)]

## Register `account` entity with the feature store

   Create an account entity that has a join key `accountID` of `string` type:

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/7.Develop-feature-set-domain-specific-language-dsl.ipynb?name=register-account-entity)]

## Register the feature set with the feature store

   1. Register the `transactions-dsl` feature set (that uses DSL) with the feature store, with offline materialization enabled, using the exported feature set specification:

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/7.Develop-feature-set-domain-specific-language-dsl.ipynb?name=register-dsl-trans-fset)]

   1. Materialize the feature set to persist the transformed feature data to the offline store:

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/7.Develop-feature-set-domain-specific-language-dsl.ipynb?name=mater-dsl-trans-fset)]

   1. Execute this code cell to track the progress of the materialization job:

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/7.Develop-feature-set-domain-specific-language-dsl.ipynb?name=track-mater-job)]

   1. Print sample data from the feature set. The output information shows that the data was retrieved from the materialization store. The `get_offline_features()` method used to retrieve the training/inference data also uses the materialization store by default:

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/7.Develop-feature-set-domain-specific-language-dsl.ipynb?name=lookup-trans-dsl-fset)]

## Generate a training dataframe using the registered feature set

### Load observation data

   Observation data is typically the core data used in training and inference steps. Then, the observation data is joined with the feature data, to create a complete training data resource. Observation data is the data captured during the time of the event. In this case, it has core transaction data including transaction ID, account ID, and transaction amount. Since this data is used for training, it also has the target variable appended (`is_fraud`).

   1. First, explore the observation data:

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/7.Develop-feature-set-domain-specific-language-dsl.ipynb?name=load-obs-data)]

   1. Select features that would be part of the training data, and use the feature store SDK to generate the training data:

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/7.Develop-feature-set-domain-specific-language-dsl.ipynb?name=select-features-dsl)]

   1. The `get_offline_features()` function appends the features to the observation data with a point-in-time join. Display the training dataframe obtained from the point-in-time join:

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/7.Develop-feature-set-domain-specific-language-dsl.ipynb?name=get-offline-features-dsl)]

### Generate a training dataframe from feature sets using DSL and UDF

   1. Register the `transactions-udf` feature set (that uses UDF) with the feature store, using the exported feature set specification. Enable offline materialization for this feature set while registering with the feature store:

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/7.Develop-feature-set-domain-specific-language-dsl.ipynb?name=register-udf-trans-fset)]

   1. Select features from the feature sets (created using DSL and UDF) that you would like to become part of the training data, and use the feature store SDK to generate the training data:

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/7.Develop-feature-set-domain-specific-language-dsl.ipynb?name=select-features-dsl-udf)]

   1. The function `get_offline_features()` appends the features to the observation data with a point-in-time join. Display the training dataframe obtained from the point-in-time join:

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/7.Develop-feature-set-domain-specific-language-dsl.ipynb?name=get-offline-features-dsl-udf)]

The features are appended to the training data with a point-in-time join. The generated training data can be used for subsequent training and batch inferencing steps.

## Clean up

The [fifth tutorial in the series](./tutorial-develop-feature-set-with-custom-source.md#clean-up) describes how to delete the resources.

## Next steps

* [Part 2: Experiment and train models using features](./tutorial-experiment-train-models-using-features.md)
* [Part 3: Enable recurrent materialization and run batch inference](./tutorial-enable-recurrent-materialization-run-batch-inference.md)
