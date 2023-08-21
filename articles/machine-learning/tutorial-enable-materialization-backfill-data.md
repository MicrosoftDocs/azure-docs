---
title: "Tutorial 2: Enable materialization and backfill feature data (preview)"
titleSuffix: Azure Machine Learning managed feature store - basics
description: This is part 2 of a tutorial series on managed feature store.
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

# Tutorial 2: Enable materialization and backfill feature data (preview)

This tutorial series shows how features seamlessly integrate all phases of the machine learning lifecycle: prototyping, training, and operationalization.

This tutorial is the second part of a four-part series. The first tutorial showed how to create a feature set specification with custom transformations, and then use that feature set to generate training data. This tutorial describes materialization.

Materialization computes the feature values for a feature window and then stores those values in a materialization store. All feature queries can then use the values from the materialization store.

Without materialization, a feature set query applies the transformations to the source on the fly, to compute the features before it returns the values. This process works well for the prototyping phase. However, for training and inference operations in a production environment, we recommend that you materialize the features for greater reliability and availability.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Enable an offline store on the feature store by creating and attaching an Azure Data Lake Storage Gen2 container and a user-assigned managed identity (UAI).
> * Enable offline materialization on the feature sets, and backfill the feature data.

[!INCLUDE [machine-learning-preview-generic-disclaimer](includes/machine-learning-preview-generic-disclaimer.md)]

## Prerequisites

Before you proceed with this tutorial, be sure to cover these prerequisites:

* Completion of [Tutorial 1: Develop and register a feature set with managed feature store](tutorial-get-started-with-feature-store.md), to create the required feature store, account entity, and `transactions` feature set.
* An Azure resource group, where you (or the service principal that you use) have User Access Administrator and Contributor roles.
* On your user account, the Owner or Contributor role for the resource group that holds the created feature store.

## Set up

This list summarizes the required setup steps:

1. In your project workspace, create an Azure Machine Learning compute resource to run the training pipeline.
1. In your feature store workspace, create an offline materialization store. Create an Azure Data Lake Storage Gen2 account and a container inside it, and attach it to the feature store. Optionally, you can use an existing storage container.
1. Create and assign a UAI to the feature store. Optionally, you can use an existing managed identity. The system-managed materialization jobs - in other words, the recurrent jobs - use the managed identity. The third tutorial in the series relies on it.
1. Grant required role-based access control (RBAC) permissions to the UAI.
1. Grant required RBAC permissions to your Azure Active Directory (Azure AD) identity. Users, including you, need read access to the sources and the materialization store.

### Configure the Azure Machine Learning Spark notebook

You can create a new notebook and execute the instructions in this tutorial step by step. You can also open the existing notebook named *2. Enable materialization and backfill feature data.ipynb* from the *featurestore_sample/notebooks* directory, and then run it. You can choose *sdk_only* or *sdk_and_cli*. Keep this tutorial open and refer to it for documentation links and more explanation.

1. On the top menu, in the **Compute** dropdown list, select **Serverless Spark Compute** under **Azure Machine Learning Serverless Spark**.

1. Configure the session:

   1. On the toolbar, select **Configure session**.
   1. On the **Python packages** tab, select **Upload Conda file**.
   1. Upload the *conda.yml* file that you [uploaded in the first tutorial](./tutorial-get-started-with-feature-store.md#prepare-the-notebook-environment).
   1. Increase the session time-out (idle time) to avoid frequent prerequisite reruns.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=start-spark-session)]

### Set up the root directory for the samples

[!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=root-dir)]

1. Set up the CLI.

   # [Python SDK](#tab/python)

   Not applicable.

   # [Azure CLI](#tab/cli)

   1. Install the Azure Machine Learning extension.

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/2. Enable materialization and backfill feature data.ipynb?name=install-ml-ext-cli)]

   1. Authenticate.

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/2. Enable materialization and backfill feature data.ipynb?name=auth-cli)]

   1. Set the default subscription.

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/2. Enable materialization and backfill feature data.ipynb?name=set-default-subs-cli)]

       ---

1. Initialize the project workspace properties.

   This is the current workspace. You'll run the tutorial notebook from this workspace.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=init-ws-crud-client)]

1. Initialize the feature store properties.

   Be sure to update the `featurestore_name` and `featurestore_location` values to reflect what you created in the first tutorial.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=init-fs-crud-client)]

1. Initialize the feature store core SDK client.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=init-fs-core-sdk)]

1. Set up the offline materialization store.

   You can create a new storage account and a container. You can also reuse an existing storage account and container as the offline materialization store for the feature store.

   # [Python SDK](#tab/python)

   You can optionally override the default settings.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=setup-utility-fns)]

   # [Azure CLI](#tab/cli)

   Not applicable.

   ---

## Set values for Azure Data Lake Storage Gen2 storage

The materialization store uses these values. You can optionally override the default settings.

[!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=set-offline-store-params)]

1. Create storage containers.

   The first option is to create new storage and container resources.

      # [Python SDK](#tab/python)

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=create-new-storage)]

      # [Azure CLI](#tab/cli)

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/2. Enable materialization and backfill feature data.ipynb?name=create-new-storage)]

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/2. Enable materialization and backfill feature data.ipynb?name=create-new-storage-container)]

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/2. Enable materialization and backfill feature data.ipynb?name=set-container-arm-id-cli)]

      ---

   The second option is to reuse an existing storage container.

      # [Python SDK](#tab/python)

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=use-existing-storage)]

      # [Azure CLI](#tab/cli)

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/2. Enable materialization and backfill feature data.ipynb?name=use-existing-storage)]

      ---

1. Set up a UAI.

   The system-managed materialization jobs will use the UAI. For example, the recurrent job in the third tutorial uses this UAI.

### Set the UAI values

[!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=set-uai-params)]

### Set up a UAI

The first option is to create a new managed identity.

[!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=create-new-uai)]

The second option is to reuse an existing managed identity.

[!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=use-existing-uai)]

### Retrieve UAI properties

Run this code sample in the SDK to retrieve the UAI properties.

[!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/2. Enable materialization and backfill feature data.ipynb?name=retrieve-uai-properties)]

---

## Grant RBAC permission to the UAI

This UAI is assigned to the feature store shortly. It requires these permissions:

| Scope                                      | Role                            |
|------------------------------------------------|--------------------------------------------|
| Feature store                                  | Azure Machine Learning Data Scientist role |
| Storage account of the offline store on the feature store | Storage Blob Data Contributor role         |
| Storage accounts of the source data                | Storage Blob Data Reader role              |

The next CLI commands assign the first two roles to the UAI. In this example, the "storage accounts of the source data" scope doesn't apply because you read the sample data from a public access blob storage. To use your own data sources, you must assign the required roles to the UAI. To learn more about access control, see [Manage access control for managed feature store](./how-to-setup-access-control-feature-store.md).

# [Python SDK](#tab/python)

[!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=grant-rbac-to-uai)]

# [Azure CLI](#tab/cli)

[!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/2. Enable materialization and backfill feature data.ipynb?name=grant-rbac-to-uai-fs)]

[!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/2. Enable materialization and backfill feature data.ipynb?name=grant-rbac-to-uai-offline-store)]

---

### Grant the Storage Blob Data Reader role access to your user account in the offline store

If the feature data is materialized, you need the Storage Blob Data Reader role to read feature data from the offline materialization store.

Obtain your Azure AD object ID value from the Azure portal, as described in [Find the user object ID](/partner-center/find-ids-and-domain-names#find-the-user-object-id).

To learn more about access control, see [Manage access control for managed feature store](./how-to-setup-access-control-feature-store.md).

[!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=grant-rbac-to-user-identity)]

The following steps grant the Storage Blob Data Reader role access to your user account:

1. Attach the offline materialization store and UAI, to enable the offline store on the feature store.

   # [Python SDK](#tab/python)

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=enable-offline-store)]

   # [Azure CLI](#tab/cli)

   Inspect file `xxxx`. This command attaches the offline store and the UAI, to update the feature store.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/2. Enable materialization and backfill feature data.ipynb?name=dump_featurestore_yaml)]

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/2. Enable materialization and backfill feature data.ipynb?name=enable-offline-store)]

   ---

2. Enable offline materialization on the `transactions` feature set.

   After you enable materialization on a feature set, you can perform a backfill, as explained in this tutorial. You can also schedule recurrent materialization jobs. For more information, see [the third tutorial in the series](./tutorial-experiment-train-models-using-features.md).

      # [Python SDK](#tab/python)

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=enable-offline-mat-txns-fset)]

      # [Azure CLI](#tab/cli)

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_and_cli/2. Enable materialization and backfill feature data.ipynb?name=enable-offline-mat-txns-fset)]

      ---

   Optionally, you can save the feature set asset as a YAML resource.

      # [Python SDK](#tab/python)

      [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=dump-txn-fset-yaml)]

      # [Azure CLI](#tab/cli)

      Not applicable.

      ---

3. Backfill data for the `transactions` feature set.

   As explained earlier in this tutorial, materialization computes the feature values for a feature window, and it stores these computed values in a materialization store. Feature materialization increases the reliability and availability of the computed values. All feature queries now use the values from the materialization store. This step performs a one-time backfill for a feature window of three months.

   > [!NOTE]
   > You might need to determine a backfill data window. The window must match the window of your training data. For example, to use two years of data for training, you need to retrieve features for the same window. This means you should backfill for a two-year window.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=backfill-txns-fset)]

   Next, print sample data from the feature set. The output information shows that the data was retrieved from the materialization store. The `get_offline_features()` method retrieved the training and inference data. It also uses the materialization store by default.

   [!notebook-python[] (~/azureml-examples-main/sdk/python/featurestore_sample/notebooks/sdk_only/2. Enable materialization and backfill feature data.ipynb?name=sample-txns-fset-data)]

## Clean up

The [fourth tutorial in the series](./tutorial-enable-recurrent-materialization-run-batch-inference.md#clean-up) describes how to delete the resources.

## Next steps

* Go to the next tutorial in the series: [Experiment and train models by using features](./tutorial-experiment-train-models-using-features.md).
* Learn about [identity and access control for managed feature store](./how-to-setup-access-control-feature-store.md).
* View the [troubleshooting guide for managed feature store](./troubleshooting-managed-feature-store.md).
* View the [YAML reference](./reference-yaml-overview.md).
