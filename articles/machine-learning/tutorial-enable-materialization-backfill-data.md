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
ms.date: 05/26/2023
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

* Enable offline store on the feature store by creating and attaching an Azure Data Lake Storage Gen2 container and a user assigned managed identity
* Enable offline materialization on the feature sets, and backfill the feature data

## Prerequisites

Before you proceed with this article, make sure you cover these prerequisites:

1. Complete the part 1 tutorial, to create the required feature store, account entity and transaction feature set
1. An Azure Resource group, in which you (or the service principal you use) need to have `User Access Administrator` role and `Contributor` role.

* To perform the steps in this article, your user account must be assigned the owner or contributor role to the resource group, which holds the created feature store

## Set-up

The summary of the setup steps to execute:

* In your project workspace, create Azure Machine Learning compute to run training pipeline
* In your feature store workspace, create an offline materialization store: create an Azure gen2 storage account and a container in it and attach to feature store. Optionally you can use existing storage container.
* Create and assign a user assigned managed identity to the feature store. Optionally, you can use an existing managed identity. The system managed materialization jobs, in other words, recurrent jobs, uses the managed identity. Part 3 of the tutorial relies on it
* Grant required role-based authentication control (RBAC) permissions to the user assigned managed identity
* Grant required role-based authentication control (RBAC) to your Azure AD identity. Users (like you) need read access to (a) sources (b) materialization store

## Configure the Azure Machine Learning spark notebook

1. Running the tutorial: You can create a new notebook, and execute the instructions in this document step by step. You can also open the existing notebook named `2. Enable materialization and backfill feature data.ipynb`, and run it. You can find the notebooks in the `featurestore_sample/notebooks directory`. You can select from `sdk_only`, or `sdk_and_cli`. You can keep this document open, and refer to it for documentation links and more explanation.

1. Select Azure Machine Learning Spark compute in the "Compute" dropdown, located in the top nav.

1. Configure the session:

      * Select "configure session" in the bottom nav
      * Select **upload conda file**
      * Select file `azureml-examples/sdk/python/featurestore-sample/project/env/conda.yml` from your local device
      * Increase the session time-out (idle time) to avoid frequent prerequisite reruns

[!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=start-spark-session)]

## Set up the root directory for the samples

[!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=root-dir)]

## Set up the CLI

### [SDK only](#tab/sdk-only)

Not applicable

### [SDK and CLI](#tab/sdk-and-cli)

1. Install the Azure Machine Learning extension

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/2. Enable materialization and backfill feature data.ipynb?name=install-ml-ext-cli)]

1. Authentication

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/2. Enable materialization and backfill feature data.ipynb?name=auth-cli)]

1. Set the default subscription

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/2. Enable materialization and backfill feature data.ipynb?name=set-default-subs-cli)]

---

## Initialize the project workspace properties

This is the current workspace, and you'll run the tutorial notebook from this workspace.

[!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=init-ws-crud-client)]

## Initialize the feature store properties

Make sure that you update the `featurestore_name` and `featurestore_location` values shown, to reflect what you created in part 1 of this tutorial.

[!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=init-fs-crud-client)]

## Initialize the feature store core SDK client

[!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=init-fs-core-sdk)]

## Set up the offline materialization store

You can create a new gen2 storage account and a container. You can also reuse an existing gen2 storage account and container, as the offline materialization store for the feature store.

### [SDK only](#tab/sdk-only)

You can optionally override the default settings.

[!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=setup-utility-fns)]

### [SDK and CLI](#tab/sdk-and-cli)

Not applicable

---

## Set values for the Azure Data Lake Storage Gen2 storage that will be used as the materialization store

You can optionally override the default settings.

[!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=set-offline-store-params)]

## Storage container (option 1): create new storage and container resources

### [SDK only](#tab/sdk-only)

[!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=create-new-storage)]

### [SDK and CLI](#tab/sdk-and-cli)

[!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/2. Enable materialization and backfill feature data.ipynb?name=create-new-storage)]

[!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/2. Enable materialization and backfill feature data.ipynb?name=create-new-storage-container)]

[!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/2. Enable materialization and backfill feature data.ipynb?name=set-container-arm-id-cli)]

---

## Storage container (option 2): you have an existing storage container that you want to reuse

### [SDK only](#tab/sdk-only)

[!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=use-existing-storage)]

### [SDK and CLI](#tab/sdk-and-cli)

[!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/2. Enable materialization and backfill feature data.ipynb?name=use-existing-storage)]

---

## Set up user assigned managed identity (UAI)

This will be used by the system managed materialization jobs. For example, the recurrent job in part 3 of this tutorial uses this UAI.

## Set the UAI values

[!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=set-uai-params)]

## User assigned managed identity (option 1): create a new one

[!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=create-new-uai)]

## User assigned managed identity (option 2): reuse an existing managed identity

[!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=use-existing-uai)]

## Retrieve UAI properties

### [SDK only](#tab/sdk-only)

Not applicable

### [SDK and CLI](#tab/sdk-and-cli)

[!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/2. Enable materialization and backfill feature data.ipynb?name=retrieve-uai-properties)]

---

## Grant RBAC permission to the user assigned managed identity (UAI)

This UAI is assigned to the feature store shortly. It requires these permissions:

| **Scope**                                      | **Action/Role**                            |
|------------------------------------------------|--------------------------------------------|
| Feature Store                                  | Azure Machine Learning Data Scientist role |
| Storage account of feature store offline store | Blob storage data contributor role         |
| Storage accounts of source data                | Blob storage data reader role              |

The next CLI commands will assign the first two roles to the UAI. In this example, "Storage accounts of source data" doesn't apply because we read the sample data from a public access blob storage. If you'd like to use your own data sources, then you must assign the required roles to the UAI. To learn more about access control, see the access control document in the documentation resources.

### [SDK only](#tab/sdk-only)

[!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=grant-rbac-to-uai)]

### [SDK and CLI](#tab/sdk-and-cli)

[!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/2. Enable materialization and backfill feature data.ipynb?name=grant-rbac-to-uai-fs)]

[!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/2. Enable materialization and backfill feature data.ipynb?name=grant-rbac-to-uai-offline-store)]

---

## Grant your user account the **Blob data reader** role in the offline store

If the feature data is materialized, you need this role to read feature data from the offline materialization store.

Get your Azure AD object ID value from the Azure portal as described [here](/partner-center/find-ids-and-domain-names#find-the-user-object-id).

To learn more about access control, see the access control document in the documentation resources.

[!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=grant-rbac-to-user-identity)]

## Step 1: Attach the offline materialization store and UAI, to enable the offline store on the feature store

### [SDK only](#tab/sdk-only)

[!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=enable-offline-store)]

### [SDK and CLI](#tab/sdk-and-cli)

Action: inspect file `xxxx`. This command attaches the offline store and UAI to update the feature store.

[!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/2. Enable materialization and backfill feature data.ipynb?name=dump_featurestore_yaml)]

[!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/2. Enable materialization and backfill feature data.ipynb?name=enable-offline-store)]

---

## Step 2: Enable offline materialization on the transactions feature set

Once materialization is enabled on a feature set, you can perform a backfill, as explained in this tutorial. You can also schedule recurrent materialization jobs. Tutorial part 3 covers this topic.

### [SDK only](#tab/sdk-only)

[!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=enable-offline-mat-txns-fset)]

### [SDK and CLI](#tab/sdk-and-cli)

[!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/2. Enable materialization and backfill feature data.ipynb?name=enable-offline-mat-txns-fset)]

---

Optionally, you can save the feature set asset as YAML

### [SDK only](#tab/sdk-only)

[!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=dump-txn-fset-yaml)]

### [SDK and CLI](#tab/sdk-and-cli)

Not applicable

---

## Step 3: Backfill data for the transactions feature set

As explained at the start of this tutorial, materialization computes the feature values for a given feature window, and stores these computed values in a materialization store. Feature materialization increases the reliability and availability of the computed values. All feature queries now use the values from the materialization store. In this step, you perform a one-time backfill, for a feature window of three months.

> [!NOTE]
> How to determine the window of backfill data needed? It has to match with the window of your training data. For e.g. if you want to train with two years of data, then you will want to be able to retrieve features for the same window, so you will backfill for a two year window.

[!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=backfill-txns-fset)]

Lets print some sample data from the feature set. The data was retrieved from the materialization store, as seen in the output information. The `get_offline_features()` method used to retrieve training/inference data, also uses the materialization store by default.

[!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=sample-txns-fset-data)]

## Cleanup

[Part 4](./tutorial-enable-recurrent-materialization-run-batch-inference.md#cleanup) of this tutorial describes how to delete the resources

## Next steps

* [Part 3: tutorial features and the machine learning lifecycle](./tutorial-experiment-train-models-using-features.md)
* [Understand identity and access control for feature store](./how-to-setup-access-control-feature-store.md)
* [View feature store troubleshooting guide](./troubleshooting-managed-feature-store.md)
* Reference: [YAML reference](./reference-yaml-overview.md)
