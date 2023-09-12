---
title: "Tutorial 5: Enable online materialization and run online inference (preview)"
titleSuffix: Azure Machine Learning managed feature store - basics
description: This is part 5 of a tutorial series on managed feature store. 
services: machine-learning
ms.service: machine-learning

ms.subservice: core
ms.topic: tutorial
author: ynpandey
ms.author: yogipandey
ms.date: 09/12/2023
ms.reviewer: franksolomon
ms.custom: sdkv2
#Customer intent: As a professional data scientist, I want to know how to build and deploy a model with Azure Machine Learning by using Python in a Jupyter Notebook.
---

# Tutorial 5: Enable online materialization and run online inference (preview)

[!INCLUDE [preview disclaimer](includes/machine-learning-preview-generic-disclaimer.md)]

An Azure Machine Learning managed feature store lets you discover, create and operationalize features. Features serve as the connective tissue in the machine learning lifecycle, starting from the prototyping phase, where you experiment with various features. That lifecycle continues to the operationalization phase, where you deploy your models, and use inference to look up feature data. For more information about feature stores, see [feature store concepts](./concept-what-is-managed-feature-store.md).

Part 1 of this tutorial series showed how to create a feature set specification with custom transformations, and use that feature set to generate training data. Part 2 of the tutorial series showed how to enable materialization and perform a backfill. Part 3 of this tutorial series showed how to experiment with features, as a way to improve model performance. Part 3 also showed how a feature store increases agility in the experimentation and training flows. Part 4 described how to run batch inference. This tutorial shows how to

In this tutorial, you will

> [!div class="checklist"]
> * Set up an Azure Cache for Redis
> * Attach a cache to a feature store as the online materialization store, and grant the necessary permissions.
> * Materialize a feature set to the online store.
> * Test an online deployment with mock data.

## Prerequisites

> [!NOTE]
> This tutorial uses Azure Machine Learning notebook with **Serverless Spark Compute**.

* Make sure you complete parts 1 through 4 of this tutorial series. You will re-use the feature store and other resources created in the earlier tutorials.

## Set up

This tutorial uses the Python feature store core SDK (`azureml-featurestore`). The Python SDK is used for create, read, update, and delete (CRUD) operations, on feature stores, feature sets, and feature store entities.

You don't need to explicitly install these resources for this tutorial, because in the set-up instructions shown here, the `online.yaml` file covers them.

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
   * Option 2: Open existing notebook `featurestore_sample/notebooks/sdk_only/5. Enable online store and run online inference.ipynb`. You may keep this document open and refer to it for more explanation and documentation links.

       1. Select **Serverless Spark Compute** in the top navigation **Compute** dropdown. This operation might take one to two minutes. Wait for a status bar in the top to display **Configure session**.
       1. Select **Configure session** in the top status bar.
       1. Select **Python packages**.
       1. Select **Upload conda file**.
       1. Select file `azureml-examples/sdk/python/featurestore-sample/project/env/online.yml` located on your local device.
       1. (Optional) Increase the session time-out (idle time in minutes) to reduce the serverless spark cluster startup time.

1. This code cell starts the Spark session. It needs about 10 minutes to install all dependencies and start the Spark session.

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/5. Enable online store and run online inference.ipynb?name=start-spark-session)]

1. Set up the root directory for the samples

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/5. Enable online store and run online inference.ipynb?name=root-dir)]

1. Initialize the `MLClient` for the project workspace, where this tutorial notebook will run. The `MLClient` ise used for the create, read, update, and delete (CRUD) operations.

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/5. Enable online store and run online inference.ipynb?name=init-prj-ws-client)]

1. Initialize the `MLClient` for the feature store workspace, for the create, read, update, and delete (CRUD) operations on the feature store workspace.

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/5. Enable online store and run online inference.ipynb?name=init-fs-ws-client)]

   > [!NOTE]
   > A **feature store workspace** supports feature reuse across projects. A **project workspace** - the current workspace in use - leverages features from a specific feature store, to train and inference models. Many project workspaces can share and reuse the same feature store workspace.

1. As mentioned earlier, this tutorial uses the Python feature store core SDK (`azureml-featurestore`). The SDK client initialized here is used for create, read, update, and delete (CRUD) operations, on feature stores, feature sets, and feature store entities.

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/5. Enable online store and run online inference.ipynb?name=init-fs-core-sdk)]

## Provision Azure cache for Redis

This tutorial uses Azure Cache for Redis as the online materialization store. You can create a new Redis instance, or reuse an existing instance.

1. First, set values for the Azure Cache for Redis resource to use as online materialization store. In this code cell, define the name of the Azure Cache for Redis resource to create or reuse. You can override other default settings.

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/5. Enable online store and run online inference.ipynb?name=redis-settings)]

1. You can create a new Redis instance. For this, you would select the Redis cache tier (basic, standard, premium, or enterprise). Choose an SKU family available for the cache tier you select. See [how selecting different tiers may affect cache performance](https://learn.microsoft.com/azure/azure-cache-for-redis/cache-best-practices-performance) for more information about tiers and cache performance. See [pricing for different SKU tiers and families of Azure Cache for Redis](https://azure.microsoft.com/en-us/pricing/details/cache/) for more information about SKU tiers and Azure cache families.

Execute this code cell to create an Azure Cache for Redis with premium tier, SKU family `P`, and cache capacity 2. It may take from five to ten minutes to provision the Redis instance.

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/5. Enable online store and run online inference.ipynb?name=provision-redis)]

1. Additionally, this code cell reuses an existing Redis instance with the previously-defined name.

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/5. Enable online store and run online inference.ipynb?name=reuse-redis)]

1. Retrieve the user-assigned managed identity (UAI) used that the feature store used for materialization. This code cell retrieves the principal ID, client ID, and ARM ID property values for the UAI used by the feature store for data materialization.

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/5. Enable online store and run online inference.ipynb?name=retrieve-uai)]

1. Grant the `Contributor` role to the UAI on the Azure Cache for Redis. This is required to write data into Redis during materialization. This code cell grants the `Contributor` role to the UAI on the Azure Cache for Redis.

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/5. Enable online store and run online inference.ipynb?name=uai-redis-rbac)]

## Attach online materialization store to the feature store

The feature store needs the Azure Cache for Redis as an attached resource, for use as the online materialization store. This code cell handles that step.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/5. Enable online store and run online inference.ipynb?name=attach-online-store)]

## Materialize the `accounts` feature set data to online store

### Enable materialization on the `accounts` feature set

Earlier in this tutorial series, you did **not** materialize the accounts feature set because it had precomputed features, and only batch inference scenarios used it. In this code cell, you'll enable online materialization so that the features become available in the online store, with low latency access. You'll also enable offline materialization for consistency. Enabling offline materialization is optional.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/5. Enable online store and run online inference.ipynb?name=enable-accounts-material)]

### Backfill the `account` feature set

The `backfill` command backfills data to all the materialization stores enabled for this feature set. Here offline and online materialization are both enabled. In this code cell, `backfill` will proceed on both offline and online materialization stores.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/5. Enable online store and run online inference.ipynb?name=start-accounts-backfill)]

This code cell tracks completion of the backfill job. With the Azure Cache for Redis premium tier provisioned earlier, this step may take approximately 10 minutes to complete.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/5. Enable online store and run online inference.ipynb?name=track-accounts-backfill)]

## Materialize `transactions` feature set data to the online store

Earlier in this tutorial series, you materialized `transactions` feature set data to the offline materialization store.

1. This code cell enables the `transactions` feature set online materialization.

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/5. Enable online store and run online inference.ipynb?name=enable-transact-material)]

1. This code cell backfills the data to both the online and offline materialization store, to ensure that both cells have the latest data. The recurrent materialization job, which we set up in tutorial 2 of this series, now materializes data to both online and offline materialization stores.

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/5. Enable online store and run online inference.ipynb?name=start-transact-material)]

   This code cell tracks completion of the backfill job. Using the premium tier Azure Cache for Redis provisioned earlier, this step may take approximately 3-4 minutes to complete.

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/5. Enable online store and run online inference.ipynb?name=track-transact-material)]

## Test locally

Use your development environment (i.e. this notebook) to look up features from the online materialization store.

   This code cell parses the list of features from the existing feature retrieval specification.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/5. Enable online store and run online inference.ipynb?name=parse-feat-list)]

   This code retrieves feature values from the online materialization store.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/5. Enable online store and run online inference.ipynb?name=init-online-lookup)]

Prepare some observation data for testing, and use that data to look up features from the online materialization store. During the online look-up, the keys (`accountID`) defined in the observation sample data might not exist in the Redis (due to `TTL`). If this happens:

1. Open the Azure portal.
1. Navigate to the Redis instance.
1. Open the console for the Redis instance, and check for existing keys with the `KEYS *` command.
1. Replace the `accountID` values in the sample observation data with the existing keys.

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/5. Enable online store and run online inference.ipynb?name=online-feat-loockup)]

These steps looked up features from the online store. In the next step, you'll test online features using an Azure Machine Learning managed online endpoint.

## Test online features from Azure Machine Learning managed online endpoint

A managed online endpoint deploys and scores models for online/realtime inference. For this, you can use any available inference technology - like Kubernetes, for example.

As a part of this step, you will perform the following actions:

1. Create an Azure Machine Learning managed online endpoint.
1. Grant required role-based access control (RBAC) permissions.
1. Deploy the model that you trained in the tutorial 3 of this tutorial series. The scoring script used in this step will have the code to look up online features.
1. Score the model with sample data. You'll see that the endpoint looked up the online features, and that the model scoring completed successfully.

### Create Azure Machine Learning managed online endpoint

Visit [this resource](https://learn.microsoft.com/azure/machine-learning/how-to-deploy-online-endpoints?view=azureml-api-2&tabs=azure-cli) to learn more about managed online endpoints. With the managed feature store API, you can also look up online features from other inference platforms.

This code cell defines a managed online endpoint named `fraud-model`.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/5. Enable online store and run online inference.ipynb?name=define-endpoint)]

This code cell creates the managed online endpoint defined in the previous code cell.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/5. Enable online store and run online inference.ipynb?name=create-endpoint)]

### Grant required RBAC permissions

Here, you'll grant required RBAC permissions to the managed online endpoint on the Redis instance and feature store. The scoring code in the model deployment needs these RBAC permissions to successfully look up features from the online store with the managed feature store API.

#### Get managed identity of the managed online endpoint

This code cell retrieves the managed identity of the managed online endpoint:

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/5. Enable online store and run online inference.ipynb?name=get-endpoint-identity)]

#### Grant the `Contributor` role to the online endpoint managed identity on the Azure Cache for Redis

This code cell grants the `Contributor` role to the online endpoint managed identity on the Redis instance. This RBAC permission is needed to materialize data into the Redis online store.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/5. Enable online store and run online inference.ipynb?name=endpoint-redis-rbac)]

#### Grant `AzureML Data Scientist` role to the online endpoint managed identity on the feature store

This code cell grants the `AzureML Data Scientist` role to the online endpoint managed identity on the feature store. This RBAC permission is required for successful deployment of the model to the online endpoint.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/5. Enable online store and run online inference.ipynb?name=endpoint-fs-rbac)]

#### Deploy the model to the online endpoint

Review the scoring script `project/fraud_model/online_inference/src/scoring.py`. The scoring script

1. Loads the feature metadata from the feature retrieval specification packaged with the model during model training. Tutorial 3 of this tutorial series handled this. The specification has features from both the `transactions` and `accounts` feature sets.
1. Looks up the online features using the index keys from the request, when an input inference request is received. In this case, for both feature sets, the index column is `accountID`.
1. Passes the features to the model to perform the inference, and returns the response. The response is a boolean value that represents the variable `is_fraud`.

Next, execute this code cell to create a managed online deployment definition for model deployment.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/5. Enable online store and run online inference.ipynb?name=define-online-deployment)]

Deploy the model to online enpoint with this code cell. Note that deployment may need four to five minutes.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/5. Enable online store and run online inference.ipynb?name=begin-online-deployment)]

### Test online deployment with mock data

Execute this code cell to test the online deployment with the mock data. You should see `0` or `1` as the output of this cell.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/5. Enable online store and run online inference.ipynb?name=test-online-deployment)]

## Next steps

* [Network isolation with feature store (preview)](./tutorial-network-isolation-for-feature-store.md)
* [Azure Machine Learning feature stores samples repository](https://github.com/Azure/azureml-examples/tree/main/sdk/python/featurestore_sample)