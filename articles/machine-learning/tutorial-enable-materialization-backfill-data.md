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
ms.date: 07/24/2023
ms.reviewer: franksolomon
ms.custom: sdkv2, build-2023
#Customer intent: As a professional data scientist, I want to know how to build and deploy a model with Azure Machine Learning by using Python in a Jupyter Notebook.
---

# Tutorial #2: Enable materialization and backfill feature data (preview)

This tutorial series shows how features seamlessly integrate all phases of the ML lifecycle: prototyping, training and operationalization.

Part 1 of this tutorial showed how to create a feature set spec with custom transformations, and use that feature set to generate training data. This tutorial describes materialization, which computes the feature values for a given feature window, and then stores those values in a materialization store. All feature queries can then use the values from the materialization store. A feature set query applies the transformations to the source on the fly, to compute the features before it returns the values. This works well for the prototyping phase. However, for training and inference operations in a production environment, it's recommended that you materialize the features, for greater reliability and availability.

This tutorial is part two of a four part series. In this tutorial, you'll learn how to:

> [!div class="checklist"]
> * Enable offline store on the feature store by creating and attaching an Azure Data Lake Storage Gen2 container and a user assigned managed identity
> * Enable offline materialization on the feature sets, and backfill the feature data

> [!IMPORTANT]
> This feature is currently in public preview. This preview version is provided without a service-level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

Before you proceed with this article, make sure you cover these prerequisites:

* Complete the part 1 tutorial, to create the required feature store, account entity and transaction feature set
* An Azure Resource group, where you (or the service principal you use) have `User Access Administrator`and `Contributor` roles.

To proceed with this article, your user account needs the owner role or contributor role for the resource group that holds the created feature store.

## Set up

This list summarizes the required setup steps:

1. In your project workspace, create an Azure Machine Learning compute resource, to run the training pipeline
1. In your feature store workspace, create an offline materialization store: create an Azure gen2 storage account and a container inside it, and attach it to the feature store. Optional: you can use an existing storage container
1. Create and assign a user-assigned managed identity to the feature store. Optionally, you can use an existing managed identity. The system managed materialization jobs - in other words, the recurrent jobs - use the managed identity. Part 3 of the tutorial relies on this
1. Grant required role-based authentication control (RBAC) permissions to the user-assigned managed identity
1. Grant required role-based authentication control (RBAC) to your Azure AD identity. Users, including yourself, need read access to the sources and the materialization store

### Configure the Azure Machine Learning spark notebook

1. Running the tutorial:

   You can create a new notebook, and execute the instructions in this document, step by step. You can also open the existing notebook named `2. Enable materialization and backfill feature data.ipynb`, and then run it. You can find the notebooks in the `featurestore_sample/notebooks directory`. You can select from `sdk_only`, or `sdk_and_cli`. You can keep this document open, and refer to it for documentation links and more explanation.

1. Select Azure Machine Learning Spark compute in the "Compute" dropdown, located in the top nav.

1. Configure the session:

   * Select "configure session" in the bottom nav
   * Select **upload conda file**
   * Upload the **conda.yml** file you [uploaded in Tutorial #1](./tutorial-get-started-with-feature-store.md#prepare-the-notebook-environment-for-development)
   * Increase the session time-out (idle time) to avoid frequent prerequisite reruns

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=start-spark-session)]

### Set up the root directory for the samples

[!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=root-dir)]

   1. Set up the CLI

      # [Python SDK](#tab/python)
      
      Not applicable
      
      # [Azure CLI](#tab/cli)
      
      1. Install the Azure Machine Learning extension
      
         [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/2. Enable materialization and backfill feature data.ipynb?name=install-ml-ext-cli)]
      
      1. Authentication
      
         [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/2. Enable materialization and backfill feature data.ipynb?name=auth-cli)]
      
       1. Set the default subscription
       
          [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/2. Enable materialization and backfill feature data.ipynb?name=set-default-subs-cli)]
       
       ---

1. Initialize the project workspace properties

   This is the current workspace. You'll run the tutorial notebook from this workspace.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=init-ws-crud-client)]

1. Initialize the feature store properties

   Make sure that you update the `featurestore_name` and `featurestore_location` values shown, to reflect what you created in part 1 of this tutorial.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=init-fs-crud-client)]

1. Initialize the feature store core SDK client

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=init-fs-core-sdk)]

1. Set up the offline materialization store

   You can create a new gen2 storage account and a container. You can also reuse an existing gen2 storage account and container as the offline materialization store for the feature store.

   # [Python SDK](#tab/python)

   You can optionally override the default settings.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=setup-utility-fns)]

   # [Azure CLI](#tab/cli)

   Not applicable

   ---

## Set values for the Azure Data Lake Storage Gen2 storage

   The materialization store uses these values. You can optionally override the default settings.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=set-offline-store-params)]

1. Storage containers

   Option 1: create new storage and container resources

      # [Python SDK](#tab/python)

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=create-new-storage)]

      # [Azure CLI](#tab/cli)

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/2. Enable materialization and backfill feature data.ipynb?name=create-new-storage)]

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/2. Enable materialization and backfill feature data.ipynb?name=create-new-storage-container)]

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/2. Enable materialization and backfill feature data.ipynb?name=set-container-arm-id-cli)]

      ---

   Option 2: reuse an existing storage container

      # [Python SDK](#tab/python)
    
      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=use-existing-storage)]
    
      # [Azure CLI](#tab/cli)
    
      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/2. Enable materialization and backfill feature data.ipynb?name=use-existing-storage)]
    
      ---

1. Set up user assigned managed identity (UAI)

    The system-managed materialization jobs will use the UAI. For example, the recurrent job in part 3 of this tutorial uses this UAI.

### Set the UAI values

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=set-uai-params)]

### User assigned managed identity (option 1)

   Create a new one

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=create-new-uai)]

### User assigned managed identity (option 2)

   Reuse an existing managed identity

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=use-existing-uai)]

### Retrieve UAI properties

   Run this code sample in the SDK to retrieve the UAI properties:

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/2. Enable materialization and backfill feature data.ipynb?name=retrieve-uai-properties)]

   ---

## Grant RBAC permission to the user assigned managed identity (UAI)

   This UAI is assigned to the feature store shortly. It requires these permissions:

   | **Scope**                                      | **Action/Role**                            |
   |------------------------------------------------|--------------------------------------------|
   | Feature Store                                  | Azure Machine Learning Data Scientist role |
   | Storage account of feature store offline store | Blob storage data contributor role         |
   | Storage accounts of source data                | Blob storage data reader role              |

   The next CLI commands will assign the first two roles to the UAI. In this example, "Storage accounts of source data" doesn't apply because we read the sample data from a public access blob storage. To use your own data sources, you must assign the required roles to the UAI. To learn more about access control, see the [access control document]() in the documentation resources.

   # [Python SDK](#tab/python)

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=grant-rbac-to-uai)]

   # [Azure CLI](#tab/cli)

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/2. Enable materialization and backfill feature data.ipynb?name=grant-rbac-to-uai-fs)]

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/2. Enable materialization and backfill feature data.ipynb?name=grant-rbac-to-uai-offline-store)]

   ---

### Grant the blob data reader role access to your user account in the offline store

   If the feature data is materialized, you need this role to read feature data from the offline materialization store.

   Obtain your Azure AD object ID value from the Azure portal as described [here](/partner-center/find-ids-and-domain-names#find-the-user-object-id).

   To learn more about access control, see the [access control document](./how-to-setup-access-control-feature-store.md).

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=grant-rbac-to-user-identity)]

   The following steps grant the blob data reader role access to your user account.

   1. Attach the offline materialization store and UAI, to enable the offline store on the feature store

   # [Python SDK](#tab/python)

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=enable-offline-store)]

   # [Azure CLI](#tab/cli)

   Action: inspect file `xxxx`. This command attaches the offline store and the UAI, to update the feature store.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/2. Enable materialization and backfill feature data.ipynb?name=dump_featurestore_yaml)]

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/2. Enable materialization and backfill feature data.ipynb?name=enable-offline-store)]

   ---

   2. Enable offline materialization on the transactions feature set

   Once materialization is enabled on a feature set, you can perform a backfill, as explained in this tutorial. You can also schedule recurrent materialization jobs. See [part 3](./tutorial-experiment-train-models-using-features.md) of this tutorial series for more information.

   # [Python SDK](#tab/python)

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=enable-offline-mat-txns-fset)]

   # [Azure CLI](#tab/cli)

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/2. Enable materialization and backfill feature data.ipynb?name=enable-offline-mat-txns-fset)]

   ---

   Optional: you can save the feature set asset as a YAML resource

   # [Python SDK](#tab/python)

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=dump-txn-fset-yaml)]

   # [Azure CLI](#tab/cli)

   Not applicable

   ---

   3. Backfill data for the transactions feature set

   As explained earlier in this tutorial, materialization computes the feature values for a given feature window, and stores these computed values in a materialization store. Feature materialization increases the reliability and availability of the computed values. All feature queries now use the values from the materialization store. This step performs a one-time backfill, for a feature window of three months.

   > [!NOTE]
   > You might need to determine a backfill data window. The window must match the window of your training data. For example, to use two years of data for training, you need to retrieve features for the same window. This means you should backfill for a two year window.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=backfill-txns-fset)]

   We'll print sample data from the feature set. The output information shows that the data was retrieved from the materialization store. The `get_offline_features()` method retrieved the training and inference data, and it also uses the materialization store by default.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=sample-txns-fset-data)]

## Cleanup

The Tutorial #4 [clean up step](./tutorial-enable-recurrent-materialization-run-batch-inference.md#cleanup) describes how to delete the resources

## Next steps

* [Part 3: tutorial features and the machine learning lifecycle](./tutorial-experiment-train-models-using-features.md)
* [Understand identity and access control for feature store](./how-to-setup-access-control-feature-store.md)
* [View feature store troubleshooting guide](./troubleshooting-managed-feature-store.md)
* Reference: [YAML reference](./reference-yaml-overview.md)