---
title: Connect to data storage with the studio UI
titleSuffix: Azure Machine Learning
description: Create datastores and datasets to securely connect to data in storage services in Azure with the Azure Machine Learning studio.
services: machine-learning
ms.service: machine-learning
ms.subservice: mldata
ms.topic: how-to
ms.author: yogipandey
author: ynpandey
ms.reviewer: nibaccam
ms.date: 09/28/2021
ms.custom: UpdateFrequency5, data4ml, event-tier1-build-2022, ignite-2022
#Customer intent: As low code experience data scientist, I need to make my data in storage on Azure available to my remote compute to train my ML models.
---

# Connect to data with the Azure Machine Learning studio

In this article, learn how to access your data with the [Azure Machine Learning studio](https://ml.azure.com). Connect to your data in storage services on Azure with [Azure Machine Learning datastores](how-to-access-data.md), and then package that data for tasks in your ML workflows with [Azure Machine Learning datasets](how-to-create-register-datasets.md).

The following table defines and summarizes the benefits of datastores and datasets. 

|Object|Description| Benefits|   
|---|---|---|
|Datastores| Securely connect to your storage service on Azure, by storing your connection information, like your subscription ID and token authorization in your [Key Vault](https://azure.microsoft.com/services/key-vault/) associated with the workspace | Because your information is securely stored, you <br><br> <li> Don't&nbsp;put&nbsp;authentication&nbsp;credentials&nbsp;or&nbsp;original&nbsp;data sources at risk. <li> No longer need to hard code them in your scripts.
|Datasets| By creating a dataset, you create a reference to the data source location, along with a copy of its metadata. With datasets you can, <br><br><li> Access data during model training.<li> Share data and collaborate with other users.<li> Use open-source libraries, like pandas, for data exploration. | Because datasets are lazily evaluated, and the data remains in its existing location, you <br><br><li>Keep a single copy of data in your storage.<li> Incur no extra storage cost <li> Don't risk unintentionally changing your original data sources.<li>Improve ML workflow performance speeds. 

To understand where datastores and datasets fit in Azure Machine Learning's overall data access workflow, see the [Securely access data](concept-data.md#data-workflow) article.

For a code first experience, see the following articles to use the [Azure Machine Learning Python SDK](/python/api/overview/azure/ml/) to:
* [Connect to Azure storage services with datastores](how-to-access-data.md). 
* [Create Azure Machine Learning datasets](how-to-create-register-datasets.md). 

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/).

- Access to [Azure Machine Learning studio](https://ml.azure.com/).

- An Azure Machine Learning workspace. [Create workspace resources](../quickstart-create-resources.md).

    -  When you create a workspace, an Azure blob container and an Azure file share are automatically registered as datastores to the workspace. They're named `workspaceblobstore` and `workspacefilestore`, respectively. If blob storage is sufficient for your needs, the `workspaceblobstore` is set as the default datastore, and already configured for use. Otherwise, you need a storage account on Azure with a [supported storage type](how-to-access-data.md#supported-data-storage-service-types).
    

## Create datastores

You can create datastores from [these Azure storage solutions](how-to-access-data.md#supported-data-storage-service-types). **For unsupported storage solutions**, and to save data egress cost during ML experiments, you must [move your data](how-to-access-data.md#move-data-to-supported-azure-storage-solutions) to a supported Azure storage solution. [Learn more about datastores](how-to-access-data.md). 

You can create datastores with credential-based access or identity-based access. 

# [Credential-based](#tab/credential)

Create a new datastore in a few steps with the Azure Machine Learning studio.

> [!IMPORTANT]
> If your data storage account is in a virtual network, additional configuration steps are required to ensure the studio has access to your data. See [Network isolation & privacy](../how-to-enable-studio-virtual-network.md) to ensure the appropriate configuration steps are applied.

1. Sign in to [Azure Machine Learning studio](https://ml.azure.com/).
1. Select **Data** on the left pane under **Assets**.
1. At the top, select **Datastores**.
1. Select **+Create**.
1. Complete the form to create and register a new datastore. The form intelligently updates itself based on your selections for Azure storage type and authentication type. See the [storage access and permissions section](#access-validation) to understand where to find the authentication credentials you need to populate this form.

The following example demonstrates what the form looks like when you create an **Azure blob datastore**:

![Form for a new datastore](media/how-to-connect-data-ui/new-datastore-form.png)

# [Identity-based](#tab/identity)

Create a new datastore in a few steps with the Azure Machine Learning studio. Learn more about [identity-based data access](how-to-identity-based-data-access.md). 

> [!IMPORTANT]
> If your data storage account is in a virtual network, additional configuration steps are required to ensure the studio has access to your data. See [Network isolation & privacy](../how-to-enable-studio-virtual-network.md) to ensure the appropriate configuration steps are applied.

1. Sign in to [Azure Machine Learning studio](https://ml.azure.com/).
1. Select **Data** on the left pane under **Assets**.
1. At the top, select **Datastores**.
1. Select **+Create**.
1. Complete the form to create and register a new datastore. The form intelligently updates itself based on your selections for Azure storage type. See [which storage types support identity-based](how-to-identity-based-data-access.md#storage-access-permissions) data access.
    1. Customers need to choose the storage acct and container name they want to use
Blob reader role (for ADLS Gen 2 and Blob storage) is required; whoever is creating needs permissions to see the contents of the storage
Reader role of the subscription and resource group
1. Select **No** to  not **Save credentials with the datastore for data access**.

The following example demonstrates what the form looks like when you create an **Azure blob datastore**:

![Form for a new datastore](media/how-to-connect-data-ui/new-id-based-datastore-form.png)

---

## Create data assets

After you create a datastore, create a dataset to interact with your data. Datasets package your data into a lazily evaluated consumable object for machine learning tasks, like training. [Learn more about datasets](how-to-create-register-datasets.md).

There are two types of datasets, FileDataset and TabularDataset. 
[FileDatasets](how-to-create-register-datasets.md#filedataset) create references to single or multiple files or public URLs. Whereas [TabularDatasets](how-to-create-register-datasets.md#tabulardataset) represent your data in a tabular format. You can create TabularDatasets from .csv, .tsv, .parquet, .jsonl files, and from SQL query results.

The following steps describe how to create a dataset in [Azure Machine Learning studio](https://ml.azure.com).

> [!Note]
> Datasets created through Azure Machine Learning studio are automatically registered to the workspace.

1. Navigate to [Azure Machine Learning studio](https://ml.azure.com)

1. Under __Assets__ in the left navigation, select __Data__. On the Data assets tab, select Create
:::image type="content" source="media\how-to-connect-data-ui\data-assets-create.png" alt-text="This screenshot highlights Create in the Data assets tab.":::

1. Give your data asset a name and optional description. Then, under **Type**, select one of the Dataset types, either **File** or **Tabular**.
:::image type="content" source="media\how-to-connect-data-ui\create-data-asset-name-type.png" alt-text="This screenshot shows set the name, description, and type of the data asset.":::

1. You have a few options for your data source. If your data is already stored in Azure, choose "From Azure storage". If you want to upload data from your local drive, choose "From local files". If your data is stored at a public web location, choose "From web files". You can also create a data asset from a SQL database, or from [Azure Open Datasets](../../open-datasets/how-to-create-azure-machine-learning-dataset-from-open-dataset.md).

1. For the file selection step, select where you want your data to be stored in Azure, and what data files you want to use.
    1. Enable skip validation if your data is in a virtual network. Learn more about [virtual network isolation and privacy](../how-to-enable-studio-virtual-network.md).

1. Follow the steps to set the data parsing settings and schema for your data asset. The settings will be pre-populated based on file type and you can further configure your settings prior to creating the data asset.

1. Once you reach the Review step, click Create on the last page

<a name="profile"></a>

### Data preview and profile

After you create your dataset, verify you can view the preview and profile in the studio with the following steps: 

1. Sign in to the [Azure Machine Learning studio](https://ml.azure.com/)
1. Under __Assets__ in the left navigation, select __Data__.
:::image type="content" source="media\how-to-connect-data-ui\data-data-assets.png" alt-text="Screenshot highlights Create in the Data assets tab.":::
1. Select the name of the dataset you want to view. 
1. Select the **Explore** tab.
1. Select the **Preview** tab.
:::image type="content" source="media\how-to-connect-data-ui\explore-preview-dataset.png" alt-text="Screenshot shows a preview of a dataset.":::
1. Select the **Profile** tab.
:::image type="content" source="media\how-to-connect-data-ui\explore-generate-profile.png" alt-text="Screenshot shows dataset column metadata in the Profile tab.":::

You can get a vast variety of summary statistics across your data set to verify whether your data set is ML-ready. For non-numeric columns, they include only basic statistics like min, max, and error count. For numeric columns, you can also review their statistical moments and estimated quantiles. 

Specifically, Azure Machine Learning dataset's data profile includes:

>[!NOTE]
> Blank entries appear for features with irrelevant types.

|Statistic|Description
|------|------
|Feature| Name of the column that is being summarized.
|Profile| In-line visualization based on the type inferred. For example, strings, booleans, and dates will have value counts, while decimals (numerics) have approximated histograms. This allows you to gain a quick understanding of the distribution of the data.
|Type distribution| In-line value count of types within a column. Nulls are their own type, so this visualization is useful for detecting odd or missing values.
|Type|Inferred type of the column. Possible values include: strings, booleans, dates, and decimals.
|Min| Minimum value of the column. Blank entries appear for features whose type doesn't have an inherent ordering (like, booleans).
|Max| Maximum value of the column. 
|Count| Total number of missing and non-missing entries in the column.
|Not missing count| Number of entries in the column that aren't missing. Empty strings and errors are treated as values, so they won't contribute to the "not missing count."
|Quantiles| Approximated values at each quantile to provide a sense of the distribution of the data.
|Mean| Arithmetic mean or average of the column.
|Standard deviation| Measure of the amount of dispersion or variation of this column's data.
|Variance| Measure of how far spread out this column's data is from its average value. 
|Skewness| Measure of how different this column's data is from a normal distribution.
|Kurtosis| Measure of how heavily tailed this column's data is compared to a normal distribution.

## Storage access and permissions

To ensure you securely connect to your Azure storage service, Azure Machine Learning  requires that you  have permission to access the corresponding data storage. This access depends on the authentication credentials used to register the datastore.

### Virtual network

If your data storage account is in a **virtual network**, extra configuration steps are required to ensure Azure Machine Learning has access to your data. See [Use Azure Machine Learning studio in a virtual network](../how-to-enable-studio-virtual-network.md) to ensure the appropriate configuration steps are applied when you create and register your datastore.  

### Access validation

> [!WARNING]
>  Cross tenant access to storage accounts is not supported. If cross tenant access is needed for your scenario, please reach out to the Azure Machine Learning Data Support team alias at  amldatasupport@microsoft.com for assistance with a custom code solution.

**As part of the initial datastore creation and registration process**, Azure Machine Learning automatically validates that the underlying storage service exists and the user provided principal (username, service principal, or SAS token) has access to the specified storage.

**After datastore creation**, this validation is only performed for methods that require access to the underlying storage container, **not** each time datastore objects are retrieved. For example, validation happens if you want to download files from your datastore; but if you just want to change your default datastore, then validation doesn't happen.

To authenticate your access to the underlying storage service, you can provide either your account key, shared access signatures (SAS) tokens, or service principal according to the datastore type you want to create. The [storage type matrix](how-to-access-data.md#supported-data-storage-service-types) lists the supported authentication types that correspond to each datastore type.

You can find account key, SAS token, and service principal information on your [Azure portal](https://portal.azure.com).

* If you plan to use an account key or SAS token for authentication, select **Storage Accounts** on the left pane, and choose the storage account that you want to register.
  * The **Overview** page provides information such as the account name, container, and file share name.
      1. For account keys, go to **Access keys** on the **Settings** pane.
      1. For SAS tokens, go to **Shared access signatures** on the **Settings** pane.

* If you plan to use a [service principal](../../active-directory/develop/howto-create-service-principal-portal.md) for authentication, go to your **App registrations** and select which app you want to use.
    * Its corresponding **Overview** page will contain required information like tenant ID and client ID.

> [!IMPORTANT]
> * If you need to change your access keys for an Azure Storage account (account key or SAS token), be sure to sync the new credentials with your workspace and the datastores connected to it. Learn how to [sync your updated credentials](../how-to-change-storage-access-key.md). <br> <br>
> * If you unregister and re-register a datastore with the same name, and it fails, the Azure Key Vault for your workspace may not have soft-delete enabled. By default, soft-delete is enabled for the key vault instance created by your workspace, but it may not be enabled if you used an existing key vault or have a workspace created prior to October 2020. For information on how to enable soft-delete, see [Turn on Soft Delete for an existing key vault](../../key-vault/general/soft-delete-change.md#turn-on-soft-delete-for-an-existing-key-vault).

### Permissions

For Azure blob container and Azure Data Lake Gen 2 storage, make sure your authentication credentials  have **Storage Blob Data Reader** access. Learn more about [Storage Blob Data Reader](../../role-based-access-control/built-in-roles.md#storage-blob-data-reader). An account SAS token defaults to no permissions. 
* For data **read access**, your authentication credentials must have a minimum of list and read permissions for containers and objects. 

* For data **write access**, write and add permissions also are required.

## Train with datasets

Use your datasets in your machine learning experiments for training ML models. [Learn more about how to train with datasets](how-to-train-with-datasets.md).

## Next steps

* [A step-by-step example of training with TabularDatasets and automated machine learning](../tutorial-first-experiment-automated-ml.md).

* [Train a model](how-to-set-up-training-targets.md).

* For more dataset training examples, see the [sample notebooks](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/work-with-data/).