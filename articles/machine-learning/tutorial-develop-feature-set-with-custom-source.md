---
title: "Tutorial 5: Develop a feature set with a custom source"
titleSuffix: Azure Machine Learning managed feature store - basics
description: This is part 5 of the managed feature store tutorial series
services: machine-learning
ms.service: machine-learning

ms.subservice: core
ms.topic: tutorial
author: ynpandey
ms.author: yogipandey
ms.date: 10/27/2023
ms.reviewer: franksolomon
ms.custom: sdkv2, ignite2023
#Customer intent: As a professional data scientist, I want to know how to build and deploy a model with Azure Machine Learning by using Python in a Jupyter Notebook.
---

# Tutorial 5: Develop a feature set with a custom source

An Azure Machine Learning managed feature store lets you discover, create, and operationalize features. Features serve as the connective tissue in the machine learning lifecycle, starting from the prototyping phase, where you experiment with various features. That lifecycle continues to the operationalization phase, where you deploy your models, and inference steps look up the feature data. For more information about feature stores, see [feature store concepts](./concept-what-is-managed-feature-store.md).

Part 1 of this tutorial series showed how to create a feature set specification with custom transformations, enable materialization and perform a backfill. Part 2 of this tutorial series showed how to experiment with features in the experimentation and training flows. Part 4 described how to run batch inference.

In this tutorial, you'll

> [!div class="checklist"]
> * Define the logic to load data from a custom data source.
> * Configure and register a feature set to consume from this custom data source.
> * Test the registered feature set.

## Prerequisites

> [!NOTE]
> This tutorial uses an Azure Machine Learning notebook with **Serverless Spark Compute**.

* Make sure you execute the notebook from Tutorial 1. That notebook includes creation of a feature store and a feature set, followed by enabling of materialization and performance of backfill.

## Set up

This tutorial uses the Python feature store core SDK (`azureml-featurestore`). The Python SDK is used for create, read, update, and delete (CRUD) operations, on feature stores, feature sets, and feature store entities.

You don't need to explicitly install these resources for this tutorial, because in the set-up instructions shown here, the `conda.yml` file covers them.

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
   * Option 2: Open existing notebook `featurestore_sample/notebooks/sdk_only/5. Develop a feature set with custom source.ipynb`. You can keep this document open and refer to it for more explanation and documentation links.

       1. Select **Serverless Spark Compute** in the top navigation **Compute** dropdown. This operation might take one to two minutes. Wait for a status bar in the top to display **Configure session**.
       1. Select **Configure session** in the top status bar.
       1. Select **Python packages**.
       1. Select **Upload conda file**.
       1. Select file `azureml-examples/sdk/python/featurestore-sample/project/env/conda.yml` located on your local device.
       1. (Optional) Increase the session time-out (idle time in minutes) to reduce the serverless spark cluster startup time.

## Set up the root directory for the samples
This code cell sets up the root directory for the samples. It needs about 10 minutes to install all dependencies and start the Spark session.

[!notebook-python[] (~/azureml-examples-yogi-fs-ga/sdk/python/featurestore_sample/notebooks/sdk_only/5. Develop a feature set with custom source.ipynb?name=root-dir)]

## Initialize the CRUD client of the feature store workspace
Initialize the `MLClient` for the feature store workspace, to cover the create, read, update, and delete (CRUD) operations on the feature store workspace.

[!notebook-python[] (~/azureml-examples-yogi-fs-ga/sdk/python/featurestore_sample/notebooks/sdk_only/5. Develop a feature set with custom source.ipynb?name=init-fset-crud-client)]

## Initialize the feature store core SDK client
As mentioned earlier, this tutorial uses the Python feature store core SDK (`azureml-featurestore`). This initialized SDK client covers create, read, update, and delete (CRUD) operations on feature stores, feature sets, and feature store entities.

[!notebook-python[] (~/azureml-examples-yogi-fs-ga/sdk/python/featurestore_sample/notebooks/sdk_only/5. Develop a feature set with custom source.ipynb?name=init-fs-core-sdk)]

## Custom source definition
You can define your own source loading logic from any data storage with a custom source definition. Implement a source processor user-defined function (UDF) class (`CustomerTransactionsTransformer` in this tutorial) to use this feature. This class should define an `__init__(self, **kwargs)` function, and a `process(self, start_time, end_time, **kwargs)` function. The `kwargs` dictionary is supplied as a part of the feature set specification definition, which is passed to the UDF. The `start_time` and `end_time` parameters are calculated and passed to the UDF function.

This is sample code for the source processor UDF class:

```python
class CustomTransactionsTransformer:
    def __init__(self, **kwargs):
        self.default_source = "wasbs://path_to_source@account.dfs.core.windows.net
        print("received kwargs:")
        for k, v in kwargs.items():
            print(f"Key: {k}, Value: {v}")

        # Peform additional set up tasks here

    def process(self, start_time: datetime, end_time: datetime, **kwargs) -> "pyspark.sql.DataFrame":
        if "source_url" in kwargs:
            df = spark.read.parquet(kwargs["source_url"])
            return df
        
        df = source.read.parquet(self.default_source)
        return df
```

## Create a feature set specification with a custom source, and experiment with it locally
Now, create a feature set specification with a custom source definition, and use it in your development environment to experiment with the feature set. The tutorial notebook attached to **Serverless Spark Compute** serves as the development environment.

[!notebook-python[] (~/azureml-examples-yogi-fs-ga/sdk/python/featurestore_sample/notebooks/sdk_only/5. Develop a feature set with custom source.ipynb?name=create-fs-custom-src)]

Next, define a feature window, and display the feature values in this feature window.

[!notebook-python[] (~/azureml-examples-yogi-fs-ga/sdk/python/featurestore_sample/notebooks/sdk_only/5. Develop a feature set with custom source.ipynb?name=display-features)]

### Export as a feature set specification
To register the feature set specification with the feature store, first save that specification in a specific format. Review the generated `transactions_custom_source` feature set specification. Open this file from the file tree to see the specification: `featurestore/featuresets/transactions_custom_source/spec/FeaturesetSpec.yaml`.

The specification has these elements:

- `features`: A list of features and their datatypes.
- `index_columns`: The join keys required to access values from the feature set.

To learn more about the specification, see [Understanding top-level entities in managed feature store](./concept-top-level-entities-in-managed-feature-store.md) and [CLI (v2) feature set YAML schema](./reference-yaml-feature-set.md).

Feature set specification persistence offers another benefit: the feature set specification can be source controlled.

[!notebook-python[] (~/azureml-examples-yogi-fs-ga/sdk/python/featurestore_sample/notebooks/sdk_only/5. Develop a feature set with custom source.ipynb?name=dump-txn-fs-spec)]

## Register the transaction feature set with the feature store
Use this code to register a feature set asset loaded from custom source with the feature store. You can then reuse that asset, and easily share it. Registration of a feature set asset offers managed capabilities, including versioning and materialization.

[!notebook-python[] (~/azureml-examples-yogi-fs-ga/sdk/python/featurestore_sample/notebooks/sdk_only/5. Develop a feature set with custom source.ipynb?name=register-txn-fset)]

Obtain the registered feature set, and print related information.

[!notebook-python[] (~/azureml-examples-yogi-fs-ga/sdk/python/featurestore_sample/notebooks/sdk_only/5. Develop a feature set with custom source.ipynb?name=get-txn-fset)]

## Test feature generation from registered feature set
Use the `to_spark_dataframe()` function of the feature set to test the feature generation from the registered feature set, and display the features.
print-txn-fset-sample-values

[!notebook-python[] (~/azureml-examples-yogi-fs-ga/sdk/python/featurestore_sample/notebooks/sdk_only/5. Develop a feature set with custom source.ipynb?name=print-txn-fset-sample-values)]

You should be able to successfully fetch the registered feature set as a Spark dataframe, and then display it. You can now use these features for a point-in-time join with observation data, and the subsequent steps in your machine learning pipeline.

## Clean up

If you created a resource group for the tutorial, you can delete that resource group, which deletes all the resources associated with this tutorial. Otherwise, you can delete the resources individually:

- To delete the feature store, open the resource group in the Azure portal, select the feature store, and delete it.
- To delete the user-assigned managed identity, follow [these](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md) instructions.
- To delete a storage account-type offline store, open the resource group in the Azure portal, select the storage that you created, and delete it.
- To delete an Azure Cache for Redis instance, open the resource group in the Azure portal, select the instance that you created, and delete it.

## Next steps

* [Network isolation with feature store](./tutorial-network-isolation-for-feature-store.md)
* [Azure Machine Learning feature stores samples repository](https://github.com/Azure/azureml-examples/tree/main/sdk/python/featurestore_sample)