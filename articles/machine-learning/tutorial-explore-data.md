---
title: "Tutorial: Upload, access and explore your data"
titleSuffix: Azure Machine Learning
description: Upload data to cloud storage, create an Azure Machine Learning data asset, create new versions for data assets, use the data for interactive development 
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: tutorial
ms.reviewer: franksolomon
author: samuel100
ms.author: samkemp
ms.date: 07/05/2023
#Customer intent: As a data scientist, I want to know how to prototype and develop machine learning models on a cloud workstation.
---

# Tutorial: Upload, access and explore your data in Azure Machine Learning

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

In this tutorial you learn how to:

> [!div class="checklist"]
> * Upload your data to cloud storage
> * Create an Azure Machine Learning data asset
> * Access your data in a notebook for interactive development
> * Create new versions of data assets

The start of a machine learning project typically involves exploratory data analysis (EDA), data-preprocessing (cleaning, feature engineering), and the building of Machine Learning model prototypes to validate hypotheses. This _prototyping_ project phase is highly interactive. It lends itself to development in an IDE or a Jupyter notebook, with a _Python interactive console_. This tutorial describes these ideas.

This video shows how to get started in Azure Machine Learning studio so that you can follow the steps in the tutorial. The video shows how to create a notebook, clone the notebook, create a compute instance, and download the data needed for the tutorial. The steps are also described in the following sections.

> [!VIDEO https://learn-video.azurefd.net/vod/player?id=514a29e2-0ae7-4a5d-a537-8f10681f5545]

## Prerequisites

1. [!INCLUDE [workspace](includes/prereq-workspace.md)]

1. [!INCLUDE [sign in](includes/prereq-sign-in.md)]

1. [!INCLUDE [open or create  notebook](includes/prereq-open-or-create.md)]
    * [!INCLUDE [new notebook](includes/prereq-new-notebook.md)]
    * Or, open **tutorials/get-started-notebooks/explore-data.ipynb** from the **Samples** section of studio. [!INCLUDE [clone notebook](includes/prereq-clone-notebook.md)]

[!INCLUDE [notebook set kernel](includes/prereq-set-kernel.md)] 

<!-- nbstart https://raw.githubusercontent.com/Azure/azureml-examples/main/tutorials/get-started-notebooks/explore-data.ipynb -->


## Download the data used in this tutorial

For data ingestion, the Azure Data Explorer handles raw data in [these formats](/azure/data-explorer/ingestion-supported-formats). This tutorial uses this [CSV-format credit card client data sample](https://azuremlexamples.blob.core.windows.net/datasets/credit_card/default_of_credit_card_clients.csv). We see the steps proceed in an Azure Machine Learning resource. In that resource, we'll create a local folder with the suggested name of **data** directly under the folder where this notebook is located.

> [!NOTE]
> This tutorial depends on data placed in an Azure Machine Learning resource folder location. For this tutorial, 'local' means a folder location in that Azure Machine Learning resource. 

1. Select **Open terminal** below the three dots, as shown in this image:

    :::image type="content" source="media/tutorial-cloud-workstation/open-terminal.png" alt-text="Screenshot shows open terminal tool in notebook toolbar.":::

1. The terminal window opens in a new tab. 
1. Make sure you `cd` to the same folder where this notebook is located.  For example, if the notebook is in a folder named **get-started-notebooks**:

    ```
    cd get-started-notebooks    #  modify this to the path where your notebook is located
    ```

1. Enter these commands in the terminal window to copy the data to your compute instance:

    ```
    mkdir data
    cd data                     # the sub-folder where you'll store the data
    wget https://azuremlexamples.blob.core.windows.net/datasets/credit_card/default_of_credit_card_clients.csv
    ```
1. You can now close the terminal window.


[Learn more about this data on the UCI Machine Learning Repository.](https://archive.ics.uci.edu/ml/datasets/default+of+credit+card+clients)

## Create handle to workspace

Before we dive in the code, you need a way to reference your workspace. You'll create `ml_client` for a handle to the workspace.  You'll then use `ml_client` to manage resources and jobs.

In the next cell, enter your Subscription ID, Resource Group name and Workspace name. To find these values:

1. In the upper right Azure Machine Learning studio toolbar, select your workspace name.
1. Copy the value for workspace, resource group and subscription ID into the code.
1. You'll need to copy one value, close the area and paste, then come back for the next one.


```python
from azure.ai.ml import MLClient
from azure.identity import DefaultAzureCredential
from azure.ai.ml.entities import Data
from azure.ai.ml.constants import AssetTypes

# authenticate
credential = DefaultAzureCredential()

# Get a handle to the workspace
ml_client = MLClient(
    credential=credential,
    subscription_id="<SUBSCRIPTION_ID>",
    resource_group_name="<RESOURCE_GROUP>",
    workspace_name="<AML_WORKSPACE_NAME>",
)
```

> [!NOTE]
> Creating MLClient will not connect to the workspace. The client initialization is lazy, it will wait for the first time it needs to make a call (this will happen in the next code cell).


## Upload data to cloud storage

Azure Machine Learning uses Uniform Resource Identifiers (URIs), which point to storage locations in the cloud. A URI makes it easy to access data in notebooks and jobs. Data URI formats look similar to the web URLs that you use in your web browser to access web pages. For example:

* Access data from public https server: `https://<account_name>.blob.core.windows.net/<container_name>/<folder>/<file>`
* Access data from Azure Data Lake Gen 2: `abfss://<file_system>@<account_name>.dfs.core.windows.net/<folder>/<file>`

An Azure Machine Learning data asset is similar to web browser bookmarks (favorites). Instead of remembering long storage paths (URIs) that point to your most frequently used data, you can create a data asset, and then access that asset with a friendly name.

Data asset creation also creates a *reference* to the data source location, along with a copy of its metadata. Because the data remains in its existing location, you incur no extra storage cost, and don't risk data source integrity. You can create Data assets from Azure Machine Learning datastores, Azure Storage, public URLs, and local files.

> [!TIP]
> For smaller-size data uploads, Azure Machine Learning data asset creation works well for data uploads from local machine resources to cloud storage. This approach avoids the need for extra tools or utilities. However, a larger-size data upload might require a dedicated tool or utility - for example, **azcopy**. The azcopy command-line tool moves data to and from Azure Storage. Learn more about azcopy [here](../storage/common/storage-use-azcopy-v10.md).

The next notebook cell creates the data asset. The code sample uploads the raw data file to the designated cloud storage resource.  

Each time you create a data asset, you need a unique version for it.  If the version already exists, you'll get an error.  In this code, we're using the "initial" for the first read of the data.  If that version already exists, we'll skip creating it again.

You can also omit the **version** parameter, and a version number is generated for you, starting with 1 and then incrementing from there. 

In this tutorial, we use the name "initial" as the first version. The [Create production machine learning pipelines](tutorial-pipeline-python-sdk.md) tutorial will also use this version of the data, so here we are using a value that you'll see again in that tutorial.


```python
from azure.ai.ml.entities import Data
from azure.ai.ml.constants import AssetTypes

# update the 'my_path' variable to match the location of where you downloaded the data on your
# local filesystem

my_path = "./data/default_of_credit_card_clients.csv"
# set the version number of the data asset
v1 = "initial"

my_data = Data(
    name="credit-card",
    version=v1,
    description="Credit card data",
    path=my_path,
    type=AssetTypes.URI_FILE,
)

## create data asset if it doesn't already exist:
try:
    data_asset = ml_client.data.get(name="credit-card", version=v1)
    print(
        f"Data asset already exists. Name: {my_data.name}, version: {my_data.version}"
    )
except:
    ml_client.data.create_or_update(my_data)
    print(f"Data asset created. Name: {my_data.name}, version: {my_data.version}")
```

You can see the uploaded data by selecting **Data** on the left. You'll see the data is uploaded and a data asset is created:

:::image type="content" source="media/tutorial-prepare-data/access-and-explore-data.png" alt-text="Screenshot shows the data in studio.":::

This data is named **credit-card**, and in the **Data assets** tab, we can see it in the **Name** column. This data uploaded to your workspace's default datastore named **workspaceblobstore**, seen in the **Data source** column. 

An Azure Machine Learning datastore is a *reference* to an *existing* storage account on Azure. A datastore offers these benefits:

1. A common and easy-to-use API, to interact with different storage types (Blob/Files/Azure Data Lake Storage) and authentication methods.
1. An easier way to discover useful datastores, when working as a team.
1. In your scripts, a way to hide connection information for credential-based data access (service principal/SAS/key).


## Access your data in a notebook

Pandas directly support URIs - this example shows how to read a CSV file from an Azure Machine Learning Datastore:

```
import pandas as pd

df = pd.read_csv("azureml://subscriptions/<subid>/resourcegroups/<rgname>/workspaces/<workspace_name>/datastores/<datastore_name>/paths/<folder>/<filename>.csv")
```

However, as mentioned previously, it can become hard to remember these URIs. Additionally, you must manually substitute all **<_substring_>** values in the **pd.read_csv** command with the real values for your resources. 

You'll want to create data assets for frequently accessed data. Here's an easier way to access the CSV file in Pandas:

> [!IMPORTANT]
> In a notebook cell, execute this code to install the `azureml-fsspec` Python library in your Jupyter kernel:


```python
%pip install -U azureml-fsspec
```


```python
import pandas as pd

# get a handle of the data asset and print the URI
data_asset = ml_client.data.get(name="credit-card", version=v1)
print(f"Data asset URI: {data_asset.path}")

# read into pandas - note that you will see 2 headers in your data frame - that is ok, for now

df = pd.read_csv(data_asset.path)
df.head()
```

Read [Access data from Azure cloud storage during interactive development](how-to-access-data-interactive.md) to learn more about data access in a notebook.

## Create a new version of the data asset

You might have noticed that the data needs a little light cleaning, to make it fit to train a machine learning model. It has:

* two headers
* a client ID column; we wouldn't use this feature in Machine Learning
* spaces in the response variable name

Also, compared to the CSV format, the Parquet file format becomes a better way to store this data. Parquet offers compression, and it maintains schema. Therefore, to clean the data and store it in Parquet, use:


```python
# read in data again, this time using the 2nd row as the header
df = pd.read_csv(data_asset.path, header=1)
# rename column
df.rename(columns={"default payment next month": "default"}, inplace=True)
# remove ID column
df.drop("ID", axis=1, inplace=True)

# write file to filesystem
df.to_parquet("./data/cleaned-credit-card.parquet")
```

This table shows the structure of the data in the original **default_of_credit_card_clients.csv** file .CSV file downloaded in an earlier step. The uploaded data contains 23 explanatory variables and 1 response variable, as shown here:

|Column Name(s) | Variable Type  |Description  |
|---------|---------|---------|
|X1     |   Explanatory      |    Amount of the given credit (NT dollar): it includes both the individual consumer credit and their family (supplementary) credit.    |
|X2     |   Explanatory      |   Gender (1 = male; 2 = female).      |
|X3     |   Explanatory      |   Education (1 = graduate school; 2 = university; 3 = high school; 4 = others).      |
|X4     |   Explanatory      |    Marital status (1 = married; 2 = single; 3 = others).     |
|X5     |   Explanatory      |    Age (years).     |
|X6-X11     | Explanatory        |  History of past payment. We tracked the past monthly payment records (from April to September  2005). -1 = pay duly; 1 = payment delay for one month; 2 = payment delay for two months; . . .; 8 = payment delay for eight months; 9 = payment delay for nine months and above.      |
|X12-17     | Explanatory        |  Amount of bill statement (NT dollar) from April to September  2005.      |
|X18-23     | Explanatory        |  Amount of previous payment (NT dollar) from April to September  2005.      |
|Y     | Response        |    Default payment (Yes = 1, No = 0)     |

Next, create a new _version_ of the data asset (the data automatically uploads to cloud storage).  For this version, we'll add a time value, so that each time this code is run, a different version number will be created.



```python
from azure.ai.ml.entities import Data
from azure.ai.ml.constants import AssetTypes
import time

# Next, create a new *version* of the data asset (the data is automatically uploaded to cloud storage):
v2 = "cleaned" + time.strftime("%Y.%m.%d.%H%M%S", time.gmtime())
my_path = "./data/cleaned-credit-card.parquet"

# Define the data asset, and use tags to make it clear the asset can be used in training

my_data = Data(
    name="credit-card",
    version=v2,
    description="Default of credit card clients data.",
    tags={"training_data": "true", "format": "parquet"},
    path=my_path,
    type=AssetTypes.URI_FILE,
)

## create the data asset

my_data = ml_client.data.create_or_update(my_data)

print(f"Data asset created. Name: {my_data.name}, version: {my_data.version}")
```

The cleaned parquet file is the latest version data source. This code shows the CSV version result set first, then the Parquet version:


```python
import pandas as pd

# get a handle of the data asset and print the URI
data_asset_v1 = ml_client.data.get(name="credit-card", version=v1)
data_asset_v2 = ml_client.data.get(name="credit-card", version=v2)

# print the v1 data
print(f"V1 Data asset URI: {data_asset_v1.path}")
v1df = pd.read_csv(data_asset_v1.path)
print(v1df.head(5))

# print the v2 data
print(
    "_____________________________________________________________________________________________________________\n"
)
print(f"V2 Data asset URI: {data_asset_v2.path}")
v2df = pd.read_parquet(data_asset_v2.path)
print(v2df.head(5))
```

<!-- nbend -->




## Clean up resources

If you plan to continue now to other tutorials, skip to [Next steps](#next-steps).

### Stop compute instance

If you're not going to use it now, stop the compute instance:

1. In the studio, in the left navigation area, select **Compute**.
1. In the top tabs, select **Compute instances**
1. Select the compute instance in the list.
1. On the top toolbar, select **Stop**.

### Delete all resources

[!INCLUDE [aml-delete-resource-group](includes/aml-delete-resource-group.md)]

## Next steps

Read [Create data assets](how-to-create-data-assets.md) for more information about data assets.

Read [Create datastores](how-to-datastore.md) to learn more about datastores.

Continue with tutorials to learn how to develop a training script.

> [!div class="nextstepaction"]
> [Model development on a cloud workstation](tutorial-cloud-workstation.md)
>
