---
title: "Four Part Tutorial: Enable Materialization and Backfill Feature Data (preview)"
titleSuffix: Azure ML managed Feature Store - Basics
description: Managed Feature Store tutorial part 2. 
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: tutorial
author: rsethur
ms.author: seramasu
ms.date: 05/05/2023
ms.reviewer: franksolomon
ms.custom: sdkv2

#Customer intent: As a professional data scientist, I want to know how to build and deploy a model with Azure Machine Learning by using Python in a Jupyter Notebook.
---

# Tutorial #2: Enable materialization and backfill feature data (preview)

> [!IMPORTANT]
> This feature is currently in public preview. This preview version is provided without a service-level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

In this tutorial series you will learn how features seamlessly integrate all phases of the ML lifecycle: feature prototyping, training and operationalization.

Part 1 of this tutorial showed how to create a feature set, and use it to generate training data. A feature set query applies the transformations to the source on the fly, to compute the features before it returns the values. This works well for the prototyping phase. However, when you run training and inference in production environment, it is recommended that you materialize the features, for greater reliability and availability. Materialization is the process of computing the feature values for a given feature window, and then storing these values in a materialization store. All feature queries will now use the values from the materialization store.

Here in Tutorial part 2, you'll learn how to:

* Enable offline store on the feature store by creating and attaching an ADLS gen2 container and a user assigned managed identity
* Create a feature set which uses pre computed features (this will be useful in next part of the tutorial)
* Enable offline materialization on the feature sets, and backfill the feature data

## Prerequisites: Configure an AzureML Spark Notebook

Before you proceed with this article, make sure you cover these prerequisites:

1. Complete the `1. hello_world.ipynb` notebook, to create the required feature store, account entity and transaction feature set
1. An Azure Resource group, in which you (or the service principal you use) need to have `User Access Administrator` role and `Contributor` role.

* To perform the steps in this article, your user account must be assigned the owner or contributor role to a resource group where the feature store will be created

## Setup

* In your project workspace, create Azure ML compute to run training pipeline
* In your feature store workspace, create a offline materialization store: create a Azure gen2 storage account and a container in it and attach to feature store. Optionally you can use existing storage container.
* Create and assign user-assigned managed identity to feature store. Optionally you can use existing one. This will be used by the system managed materialization jobs i.e. recurrent job that will be used in part 3 of the tutorial
* Grant required RBAC permissions to the user-assigned managed identity
* Grant required RBAC to your AAD identity. Users (like you) need to have read access to (a) sources (b) materialization store

#### Configure the Azure ML spark notebook

1. In the "Compute" dropdown in the top nav, select "AzureML Spark Compute".

1. Upload the feature store samples directory to project workspace.
      * Select "configure session" in the bottom nav
      * Select **upload conda file**
      * Select file `azureml-examples/sdk/python/featurestore-sample/project/env/conda.yml` from your local device
      * Increase the session time out (idle time) to avoid frequent prerequisite re-runs

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/2. backfill.ipynb?name=start-spark-session)]

#### Set up the root directory for the samples

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/2. backfill.ipynb?name=root-dir)]

#### Initialize the project workspace CRUD client

The tutorial notebook will run from this current workspace

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/2. backfill.ipynb?name=init-ws-crud-client)]

#### Initialize the feature store CRUD client

Ensure you update the `featurestore_name` value to reflect what you created in part 1 of this tutorial

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/2. backfill.ipynb?name=init-fs-crud-client)]

#### Initialize the feature store core SDK client

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/2. backfill.ipynb?name=init-fs-core-sdk)]

#### Set up offline materialization store

You can create a new gen2 storage account and container, or re-use an existing one to serve as the offline materialization store for the feature store

##### Set up utility functions

> [!Note]
> This code sets up utility functions that create storage and user assigned identity. These utility functions use standard azure SDKs. They are provided here to keep the tutorial concise. However, do not use this approach for production purposes, because it might not implement best practices.

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/2. backfill.ipynb?name=setup-utility-fns)]

##### Set the values for the adls gen 2 storage that will become a materialization store

You can optionally override the default settings

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/2. backfill.ipynb?name=set-offline-store-params)]

##### Storage container (option 1): re-use an existing storage container

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/2. backfill.ipynb?name=use-existing-storage)]

##### Storage container (option 2): create a new existing storage container

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/2. backfill.ipynb?name=create-new-storage)]

#### Setup user assigned managed identity (UAI)

In part 3 of the tutorial, system managed materialization jobs - for example, recurrent jobs - will use this

##### Set values for UAI

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/2. backfill.ipynb?name=set-uai-params)]

##### User-assigned managed identity (option 1): create a new one

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/2. backfill.ipynb?name=create-new-uai)]

##### User-assigned managed identity (option 2): reuse an existing managed identity

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/2. backfill.ipynb?name=use-existing-uai)]

##### Grant RBAC permission to the user assigned managed identity (UAI)

This UAI will be assigned to the feature store shortly. It requires the following permissions:

| Scope      | Action / Role |
| ----------- | ----------- |
| Feature store | AzureML Data Scientist role |
| Storage account of feature store offline store | Blob storage data contributor role |
| Storage accounts of source data  |  Blob storage data reader role |

This utility function code assigns the first two roles to the UAI. In this example, "Storage accounts of source data" does not apply, because we read the sample data from a public access blob storage resource. If you have your own data sources, then you should assign the required roles to the UAI. To learn more about access control, see the [**BAD URL! access control document**](https://github.com/Azure/featurestore-prp/blob/c5a2cd10abada95309036e45d4acd3e47f0a4559/featurestore_sample/access-control-doc-url-todo)

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/2. backfill.ipynb?name=grant-rbac-to-uai)]

##### Grant your user account the "Blob data reader" role on the offline store

If the feature data is materialized, then you need this role to read feature data from offline materialization store.

Learn how to get your AAD object id from the Azure portal at [this](https://learn.microsoft.com/en-us/partner-center/find-ids-and-domain-names#find-the-user-object-id) page.

To learn more about access control, see access control document.

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/2. backfill.ipynb?name=grant-rbac-to-user-identity)]

## Step 1: Enable offline store on the feature store by attaching offline materialization store and UAI

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/2. backfill.ipynb?name=enable-offline-store)]

## Step 2: Enable offline materialization on transactions feature set

Once materialization is enabled on a feature set, you can perform backfill (described in this part of the tutorial), or you can schedule recurrent materialization jobs (described in the next part of the tutorial)

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/2. backfill.ipynb?name=enable-offline-mat-txns-fset)]

As another option, you can save the the above feature set asset as a yaml resource

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/2. backfill.ipynb?name=dump-txn-fset-yaml)]

## Step 3: Backfill data for the transactions feature set

As explained earlier in this tutorial, materialization involves computation of the feature values for a given feature window, and storage of those values in a materialization store. Materializing the features increases its reliability and availability. All feature queries will now use the values from the materialization store. In this step, you perform a one-time backfill for a feature window of **three months**.

> [!Note]
> Determination of the backfill data window is important. It must match the training data window. For example, to train with two years of data, you must retrieve features for that same window. Therefore, backfill for a two year window.

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/2. backfill.ipynb?name=backfill-txns-fset)]

Let's print sample data from the feature set. The output information shows that the data was retrieved from the materialization store. We retrieved the training and inference data with The `get_offline_features()` method retrieved the training / inference data, and this method uses the materialization store by default.

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/2. backfill.ipynb?name=sample-txns-fset-data)]

## Cleanup

Part 4 of this tutorial describes how to delete the resources

## Next steps

* Part 2: Experiment with and train models using features
* Understand concepts: feature materialization concepts
* Understand identity and access control for feature store
* View feature store troubleshooting guide
* Reference: YAML reference, feature store SDK