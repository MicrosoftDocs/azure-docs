---
title: "Tutorial #2: enable materialization and backfill feature data (preview)"
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
ms.custom: sdkv2, build-2023
#Customer intent: As a professional data scientist, I want to know how to build and deploy a model with Azure Machine Learning by using Python in a Jupyter Notebook.
---

# Tutorial #2: Enable materialization and backfill feature data (preview)

> [!IMPORTANT]
> This feature is currently in public preview. This preview version is provided without a service-level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

In this tutorial series you'll learn how features seamlessly integrate all phases of the ML lifecycle: prototyping, training and operationalization.

Part 1 of this tutorial showed how to create a feature set, and use it to generate training data. A feature set query applies the transformations to the source on the fly, to compute the features before it returns the values. This works well for the prototyping phase. However, when you run training and inference in production environment, it's recommended that you materialize the features, for greater reliability and availability. Materialization is the process of computing the feature values for a given feature window, and then storing these values in a materialization store. All feature queries now use the values from the materialization store.

Here in Tutorial part 2, you'll learn how to:

* Enable offline store on the feature store by creating and attaching an ADLS gen2 container and a user assigned managed identity
* Enable offline materialization on the feature sets, and backfill the feature data

## Prerequisites

Before you proceed with this article, make sure you cover these prerequisites:

1. Complete the part 1 tutorial, to create the required feature store, account entity and transaction feature set
1. An Azure Resource group, in which you (or the service principal you use) need to have `User Access Administrator` role and `Contributor` role.

* To perform the steps in this article, your user account must be assigned the owner or contributor role to the resource group, which holds the created feature store

## The summary of the setup steps to execute:

* In your project workspace, create Azure Machine Learning compute to run training pipeline
* In your feature store workspace, create an offline materialization store: create an Azure gen2 storage account and a container in it and attach to feature store. Optionally you can use existing storage container.
* Create and assign a user-assigned managed identity to the feature store. Optionally, you can use an existing managed identity. The system managed materialization jobs, in other words, recurrent jobs, uses the managed identity. Part 3 of the tutorial relies on it
* Grant required role-based authentication control (RBAC) permissions to the user-assigned managed identity
* Grant required role-based authentication control (RBAC) to your Azure AD identity. Users (like you) need read access to (a) sources (b) materialization store

#### Configure the Azure Machine Learning spark notebook

1. Select Azure Machine Learning Spark compute in the "Compute" dropdown, located in the top nav. Wait for a status bar in the top to display "configure session".

1. Configure session:

      * Select "configure session" in the top nav
      * Select **upload conda file**
      * Select file `azureml-examples/sdk/python/featurestore-sample/project/env/conda.yml` from your local device
      * (Optional) Increase the session time-out (idle time) to avoid frequent prerequisite reruns

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=start-spark-session)]

#### Set up the root directory for the samples

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=root-dir)]

#### Initialize the project workspace CRUD client

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=init-ws-crud-client)]

#### Initialize the feature store CRUD client

Ensure you update the `featurestore_name` value to reflect what you created in part 1 of this tutorial

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=init-fs-crud-client)]

#### Initialize the feature store core SDK client

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=init-fs-core-sdk)]

#### Set up offline materialization store

You can create a new gen2 storage account and container, or reuse an existing one to serve as the offline materialization store for the feature store

##### Set up utility functions

> [!Note]
> This code sets up utility functions that create storage and user assigned identity. These utility functions use standard azure SDKs. They are provided here to keep the tutorial concise. However, do not use this approach for production purposes, because it might not implement best practices.

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=setup-utility-fns)]

##### Set the values for the Azure data lake storage (ADLS) gen 2 storage that becomes a materialization store

You can optionally override the default settings

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=set-offline-store-params)]

##### Storage container (option 1): create a new storage container

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=create-new-storage)]

##### Storage container (option 2): reuse an existing storage container

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=use-existing-storage)]

#### Setup user assigned managed identity (UAI)

In part 3 of the tutorial, system managed materialization jobs - for example, recurrent jobs - use UAI

##### Set values for UAI

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=set-uai-params)]

##### User-assigned managed identity (option 1): create a new one

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=create-new-uai)]

##### User-assigned managed identity (option 2): reuse an existing managed identity

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=use-existing-uai)]

##### Grant role-based authentication control (RBAC) permission to the user assigned managed identity (UAI)

This UAI is assigned to the feature store shortly. It requires the following permissions:

| Scope      | Action / Role |
| ----------- | ----------- |
| Feature store | Azure Machine Learning Data Scientist role |
| Storage account of feature store offline store | Blob storage data contributor role |
| Storage accounts of source data  |  Blob storage data reader role |

This utility function code assigns the first two roles to the UAI. In this example, "Storage accounts of source data" doesn't apply, because we read the sample data from a public access blob storage resource. If you have your own data sources, then you should assign the required roles to the UAI. To learn more about access control, see the [access control document](./how-to-setup-access-control-feature-store.md)

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=grant-rbac-to-uai)]

##### Grant your user account the "Blob data reader" role on the offline store

If the feature data is materialized, then you need this role to read feature data from offline materialization store.

Learn how to get your Azure AD object ID from the Azure portal at [this](/partner-center/find-ids-and-domain-names#find-the-user-object-id) page.

To learn more about access control, see access control document.

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=grant-rbac-to-user-identity)]

## Step 1: Enable offline store on the feature store by attaching offline materialization store and UAI

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=enable-offline-store)]

## Step 2: Enable offline materialization on transactions feature set

Once materialization is enabled on a feature set, you can perform backfill (described in this part of the tutorial), or you can schedule recurrent materialization jobs (described in the next part of the tutorial)

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=enable-offline-mat-txns-fset)]

As another option, you can save the above feature set asset as a yaml resource

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=dump-txn-fset-yaml)]

## Step 3: Backfill data for the transactions feature set

As explained earlier in this tutorial, materialization involves computation of the feature values for a given feature window, and storage of those values in a materialization store. Materializing the features increases its reliability and availability. All feature queries now use the values from the materialization store. In this step, you perform a one-time backfill for a feature window of **three months**.

> [!Note]
> Determination of the backfill data window is important. It must match the training data window. For example, to train with two years of data, you must retrieve features for that same window. Therefore, backfill for a two year window.

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=backfill-txns-fset)]

Let's print sample data from the feature set. The output information shows that the data was retrieved from the materialization store. We retrieved the training and inference data with the `get_offline_features()` method. This method uses the materialization store by default.

[!notebook-python[] (~/azureml-examples-featurestore/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=sample-txns-fset-data)]

## Cleanup

[Part 4](./tutorial-enable-recurrent-materialization-run-batch-inference.md#cleanup) of this tutorial describes how to delete the resources

## Next steps

* [Part 3: tutorial features and the machine learning lifecycle](./tutorial-experiment-train-models-using-features.md)
* [Understand identity and access control for feature store](./how-to-setup-access-control-feature-store.md)
* [View feature store troubleshooting guide](./troubleshooting-managed-feature-store.md)
* Reference: [YAML reference](./reference-yaml-overview.md)
