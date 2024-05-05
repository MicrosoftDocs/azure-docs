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
ms.reviewer: fsolomon
ms.date: 02/09/2024
ms.custom: UpdateFrequency5, data4ml
#Customer intent: As low code experience data scientist, I need to make my data in storage on Azure available to my remote compute to train my ML models.
---

# Connect to data with the Azure Machine Learning studio

This article shows how to access your data with the [Azure Machine Learning studio](https://ml.azure.com). Connect to your data in Azure storage services with [Azure Machine Learning datastores](how-to-access-data.md). Then, package that data for ML workflow tasks with [Azure Machine Learning datasets](how-to-create-register-datasets.md).

This table defines and summarizes the benefits of datastores and datasets.

|Object|Description| Benefits|
|---|---|---|
|Datastores| To securely connect to your storage service on Azure, store your connection information (subscription ID, token authorization, etc.) in the [Key Vault](https://azure.microsoft.com/services/key-vault/) associated with the workspace | Because your information is securely stored, you don't put authentication credentials or original data sources at risk, and you no longer need to hard code these values in your scripts
|Datasets| Dataset creation also creates a reference to the data source location, along with a copy of its metadata. With datasets you can access data during model training, share data and collaborate with other users, and use open-source libraries, like pandas, for data exploration. | Since datasets are lazily evaluated, and the data remains in its existing location, you keep a single copy of data in your storage. Additionally, you incur no extra storage cost, you avoid unintentional changes to your original data sources, and improve ML workflow performance speeds.|

To learn where datastores and datasets fit in the overall Azure Machine Learning data access workflow, visit [Securely access data](concept-data.md#data-workflow).

For more information about the [Azure Machine Learning Python SDK](/python/api/overview/azure/ml/) and a code-first experience, see:
* [Connect to Azure storage services with datastores](how-to-access-data.md)
* [Create Azure Machine Learning datasets](how-to-create-register-datasets.md)

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/)

- Access to [Azure Machine Learning studio](https://ml.azure.com/)

- An Azure Machine Learning workspace. [Create workspace resources](../quickstart-create-resources.md)

    -  When you create a workspace, an Azure blob container and an Azure file share are automatically registered to the workspace as datastores. They're named `workspaceblobstore` and `workspacefilestore`, respectively. For sufficient blob storage resources, the `workspaceblobstore` is set as the default datastore, already configured for use. If you require more blob storage resources, you need an Azure storage account, with a [supported storage type](how-to-access-data.md#supported-data-storage-service-types).

## Create datastores

You can create datastores from [these Azure storage solutions](how-to-access-data.md#supported-data-storage-service-types). **For unsupported storage solutions**, and to save data egress cost during ML experiments, you must [move your data](how-to-access-data.md#move-data-to-supported-azure-storage-solutions) to a supported Azure storage solution. For more information about datastores, visit [this resource](how-to-access-data.md).

You can create datastores with credential-based access or identity-based access.

# [Credential-based](#tab/credential)

Create a new datastore with the Azure Machine Learning studio.

> [!IMPORTANT]
> If your data storage account is located in a virtual network, additional configuration steps are required to ensure that the studio can access your data. Visit [Network isolation & privacy](../how-to-enable-studio-virtual-network.md) for more information about the appropriate configuration steps.

1. Sign in to [Azure Machine Learning studio](https://ml.azure.com/).
1. Select **Data** on the left pane under **Assets**.
1. At the top, select **Datastores**.
1. Select **+Create**.
1. Complete the form to create and register a new datastore. The form intelligently updates itself based on your selections for Azure storage type and authentication type. For more information about where to find the authentication credentials needed to populate this form, visit the [storage access and permissions section](#access-validation).

This screenshot shows the **Azure blob datastore** creation panel:

:::image type="content" source="media/how-to-connect-data-ui/new-datastore-form.png" lightbox="media/how-to-connect-data-ui/new-datastore-form.png" alt-text="Screenshot showing the Azure blob datastore creation panel.":::

# [Identity-based](#tab/identity)

For more information about new datastore creation with the Azure Machine Learning studio, visit [identity-based data access](how-to-identity-based-data-access.md).

> [!IMPORTANT]
> If your data storage account resides in a virtual network, additional configuration steps are required to ensure that Studio can access your data. Visit [Network isolation & privacy](../how-to-enable-studio-virtual-network.md) to ensure that the appropriate configuration steps are applied.

1. Sign in to [Azure Machine Learning studio](https://ml.azure.com/).
1. Select **Data** on the left pane under **Assets**.
1. At the top, select **Datastores**.
1. Select **+Create**.
1. Complete the form to create and register a new datastore. The form intelligently updates itself based on your selections for Azure storage type. See [which storage types support identity-based](how-to-identity-based-data-access.md#storage-access-permissions) data access.
    1. Customers need to choose the storage acct and container name they want to use

Blob reader role (for ADLS Gen 2 and Blob storage) is required; whoever is creating needs permissions to see the contents of the storage
Reader role of the subscription and resource group
1. Select **No** to  not **Save credentials with the datastore for data access**.

This screenshot shows the **Azure blob datastore** creation panel:

:::image type="content" source="media/how-to-connect-data-ui/new-id-based-datastore-form.png" lightbox="media/how-to-connect-data-ui/new-id-based-datastore-form.png" alt-text="Screenshot showing the Azure blob datastore creation panel.":::

![Form for a new datastore](media/how-to-connect-data-ui/new-id-based-datastore-form.png)

---

## Create data assets

After you create a datastore, create a dataset to interact with your data. Datasets package your data into a lazily evaluated consumable object for machine learning tasks - for example, training. Visit [Create Azure Machine Learning datasets](how-to-create-register-datasets.md) for more information about datasets.

Datasets have two types: FileDataset and TabularDataset. [FileDatasets](how-to-create-register-datasets.md#filedataset) create references to single or multiple files, or public URLs. [TabularDatasets](how-to-create-register-datasets.md#tabulardataset) represent data in a tabular format. You can create TabularDatasets from
- .csv
- .tsv
- .parquet
- .json
files, and from SQL query results.

The following steps describe how to create a dataset in [Azure Machine Learning studio](https://ml.azure.com).

> [!Note]
> Datasets created through Azure Machine Learning studio are automatically registered to the workspace.

1. Navigate to [Azure Machine Learning studio](https://ml.azure.com)

1. Under __Assets__ in the left navigation, select __Data__. On the Data assets tab, select Create
:::image type="content" source="media\how-to-connect-data-ui\data-assets-create.png" lightbox="media/how-to-connect-data-ui/new-id-based-datastore-form.png" alt-text="Screenshot showing Create in the Data assets tab.":::

1. Give the data asset a name and optional description. Then, under **Type**, select a Dataset type, either **File** or **Tabular**.
:::image type="content" source="media\how-to-connect-data-ui\create-data-asset-name-type.png" lightbox="media\how-to-connect-data-ui\create-data-asset-name-type.png" alt-text="Screenshot showing the setting of the name, description, and type of the data asset.":::

1. The **Data source** pane opens next, as shown in this screenshot:

:::image type="content" source="media\how-to-connect-data-ui\data-assets-source.png" lightbox="media\how-to-connect-data-ui\data-assets-source.png" alt-text="This screenshot showing the data source selection pane.":::

You have different options for your data source. For data already stored in Azure, choose "From Azure storage." To upload data from your local drive, choose "From local files." For data stored at a public web location, choose "From web files." You can also create a data asset from a SQL database, or from [Azure Open Datasets](../../open-datasets/how-to-create-azure-machine-learning-dataset-from-open-dataset.md).

1. At the file selection step, select the location where Azure should store your data, and the data files you want to use.
    1. Enable skip validation if your data is in a virtual network. Learn more about [virtual network isolation and privacy](../how-to-enable-studio-virtual-network.md).

1. Follow the steps to set the data parsing settings and schema for your data asset. The settings prepopulate based on file type, and you can further configure your settings before data asset creation.

1. Once you reach the Review step, select Create on the last page

### Data preview and profile

After you create your dataset, verify that you can view the preview and profile in the studio:

1. Sign in to the [Azure Machine Learning studio](https://ml.azure.com/)
1. Under __Assets__ in the left navigation, select __Data__.
:::image type="content" source="media\how-to-connect-data-ui\data-data-assets.png" alt-text="Screenshot highlights Create in the Data assets tab.":::
1. Select the name of the dataset you want to view. 
1. Select the **Explore** tab.
1. Select the **Preview** tab.
:::image type="content" source="media\how-to-connect-data-ui\explore-preview-dataset.png" alt-text="Screenshot shows a preview of a dataset.":::
1. Select the **Profile** tab.
:::image type="content" source="media\how-to-connect-data-ui\explore-generate-profile.png" alt-text="Screenshot shows dataset column metadata in the Profile tab.":::

You can use summary statistics across your data set to verify whether your data set is ML-ready. For non-numeric columns, these statistics include only basic statistics - for example, min, max, and error count. Numeric columns offer statistical moments and estimated quantiles.

The Azure Machine Learning dataset data profile includes:

>[!NOTE]
> Blank entries appear for features with irrelevant types.

|Statistic|Description|
|------|-----
|Feature| The summarized column name
|Profile| In-line visualization based on the inferred type. Strings, booleans, and dates have value counts. Decimals (numerics) have approximated histograms. These visualizations offer a quick understanding of the data distribution
|Type distribution| In-line value count of types within a column. Nulls are their own type, so this visualization can detect odd or missing values
|Type|Inferred column type. Possible values include: strings, booleans, dates, and decimals
|Min| Minimum value of the column. Blank entries appear for features whose type doesn't have an inherent ordering (for example, booleans)
|Max| Maximum value of the column. 
|Count| Total number of missing and nonmissing entries in the column
|Not missing count| Number of entries in the column that aren't missing. Empty strings and errors are treated as values, so they don't contribute to the "not missing count."
|Quantiles| Approximated values at each quantile, to provide a sense of the data distribution
|Mean| Arithmetic mean or average of the column
|Standard deviation| Measure of the amount of dispersion or variation for the data of this column
|Variance| Measure of how far the data of this column spreads out from its average value
|Skewness| Measures the difference of this column's data from a normal distribution
|Kurtosis| Measures the degree of "tailness" of this column's data, compared to a normal distribution

## Storage access and permissions

To ensure that you securely connect to your Azure storage service, Azure Machine Learning requires that you have permission to access the corresponding data storage. This access depends on the authentication credentials used to register the datastore.

### Virtual network

If your data storage account is in a **virtual network**, extra configuration steps are required to ensure that Azure Machine Learning has access to your data. See [Use Azure Machine Learning studio in a virtual network](../how-to-enable-studio-virtual-network.md) to ensure the appropriate configuration steps are applied when you create and register your datastore.  

### Access validation

> [!WARNING]
>  Cross-tenant access to storage accounts is not supported. If your scenario needs cross-tenant access, please reach out to the Azure Machine Learning Data Support team alias at amldatasupport@microsoft.com for assistance with a custom code solution.

**As part of the initial datastore creation and registration process**, Azure Machine Learning automatically validates that the underlying storage service exists and that the user-provided principal (username, service principal, or SAS token) has access to the specified storage.

**After datastore creation**, this validation is only performed for methods that require access to the underlying storage container. The validation is **not** performed each time datastore objects are retrieved. For example, validation happens when you download files from your datastore. However, if you want to change your default datastore, validation doesn't occur.

To authenticate your access to the underlying storage service, provide either your account key, shared access signatures (SAS) tokens, or service principal, according to the datastore type you want to create. The [storage type matrix](how-to-access-data.md#supported-data-storage-service-types) lists the supported authentication types that correspond to each datastore type.

You can find account key, SAS token, and service principal information at your [Azure portal](https://portal.azure.com).

* To obtain an account key for authentication, select **Storage Accounts** in the left pane, and choose the storage account that you want to register
  * The **Overview** page provides information such as the account name, container, and file share name.
  * Expand the **Security + networking** node in the left nav
  * Select **Access keys**
  * The available key values serve as **Account key** values
* To obtain an SAS token for authentication, select **Storage Accounts** in the left pane, and choose the storage account that you want
  * To obtain an **Access key** value, expand the **Security + networking** node in the left nav
  * Select **Shared access signature**
  * Complete the process to generate the SAS value

* To use a [service principal](../../active-directory/develop/howto-create-service-principal-portal.md) for authentication, go to your **App registrations** and select which app you want to use.
    * Its corresponding **Overview** page contains required information like tenant ID and client ID.

> [!IMPORTANT]
> * To change your access keys for an Azure Storage account (account key or SAS token), be sure to sync the new credentials with both your workspace and the datastores connected to it. For more information, visit [sync your updated credentials](../how-to-change-storage-access-key.md).
> * If you unregister and then re-register a datastore with the same name, and that re-registration fails, the Azure Key Vault for your workspace may not have soft-delete enabled. By default, soft-delete is enabled for the key vault instance created by your workspace, but it may not be enabled if you used an existing key vault or have a workspace created prior to October 2020. For more information about how to enable soft-delete, visit [Turn on Soft Delete for an existing key vault](../../key-vault/general/soft-delete-change.md#turn-on-soft-delete-for-an-existing-key-vault).

### Permissions

For Azure blob container and Azure Data Lake Gen 2 storage, ensure that your authentication credentials have **Storage Blob Data Reader** access. Learn more about [Storage Blob Data Reader](../../role-based-access-control/built-in-roles.md#storage-blob-data-reader). By default, an account SAS token has no permissions.
* For data **read access**, your authentication credentials must have a minimum of list and read permissions for containers and objects. 

* For data **write access**, write and add permissions also are required.

## Train with datasets

Use your datasets in your machine learning experiments for training ML models. [Learn more about how to train with datasets](how-to-train-with-datasets.md).

## Next steps

* [A step-by-step example of training with TabularDatasets and automated machine learning](../tutorial-first-experiment-automated-ml.md)

* [Train a model](how-to-set-up-training-targets.md)

* For more dataset training examples, see the [sample notebooks](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/work-with-data/)