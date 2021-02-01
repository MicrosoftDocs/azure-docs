---
title: Connect Spark pools for data preparation (preview)
titleSuffix: Azure Machine Learning
description: Learn how to connect Spark pools for data preparation with Azure Synapse and Azure Machine Learning
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: nibaccam
author: nibaccam
ms.reviewer: nibaccam
ms.date: 03/02/2021
ms.custom: how-to, devx-track-python, data4ml


# Customer intent: As a data scientist, I want to prepare my data at scale and to train my machine learning models from a single notebook.
---

# Connect Spark pools for data preparation with Azure Synapse (preview)

In this article, you learn how to connect and launch an Apache Spark pool backed by [Azure Synapse](/synapse-analytics/overview-what-is.md) for data preparation within your Azure Machine Learning experiments.

## Azure Machine Learning and Azure Synapse integration (preview)

The Azure Synapse integration with Azure Machine Learning (preview) allows you to connect a separate compute, in this case an Apache Spark pool backed by Azure Synapse, for interactive data exploration and preparation. With this integration, you can perform data preparation at scale within the same Python notebook you use for training your machine learning models.

>[!IMPORTANT]
> The Azure Machine Learning and Azure Synapse integration is in public preview. The functionalities presented from the `azureml-synapse` package are [experimental](/python/api/overview/azure/ml/?preserve-view=true&view=azure-ml-py#stable-vs-experimental) preview features, and may change at any time.

## Prerequisites

* [Create an Azure Machine Learning workspace](how-to-manage-workspace.md?tabs=python).

* [Create a Synapse workspace in Azure portal](/synapse-analytics/quickstart-create-workspace.md).

* [Create Apache Spark pool using Azure portal, web tools, or Synapse Studio](/synapse-analytics/quickstart-create-apache-spark-pool-portal.md)

* Install the [Azure Machine Learning Python SDK](/python/api/overview/azure/ml/intro?preserve-view=true&view=azure-ml-py)

* Install the `azureml-synapse` package (preview)

    ```python
    pip install azureml-synapse
    ```

## Link machine learning workspace and Synapse assets

Before you can attach a Spark pool for data preparation, you first need to link your Azure Machine Learning workspace with your Azure Synapse workspace.

To link to the Synapse workspace successfully, grant User Assigned Identity the synapse admin role in Synapse Studio. The resource ID of your User Assigned Identity can be found in the [Azure portal](https://ms.portal.azure.com/).

> [!IMPORTANT]
> There is a MSI `system_assigned_identity_principal_id` created for each linked service. Make sure you grant Spark *admin* role of the synapse workspace to MSI in synapse studio before you submit job.

The following code,

* Links your machine learning workspace, `ws` with your Azure Synapse workspace.
* Registers your Synape workspace with Azure Machine Learning as a linked service.

``` python
import datetime  
from azureml.core import Workspace, Experiment, Dataset, Environment,Datastore, LinkedWorkspace

# Azure Machine Learning workspace
ws = Workspace.from_config()

# Link workspaces and register Synapse workspace in Azure Machine Learning
linked_workspace = LinkedWorkspace.register(workspace = ws,              
                                            name = '<Synapse workspace alias>',    
                                            linked_workspace_resource_id = '<Synapse workspace resource ID>', # Synapse workspace resource ID can be found in Synapse Studio
```

### Manage linked services

To unlink your workspaces, use the `unregister()` method

``` python
linked_workspace.unregister()
```

To get linked workspace content, use the following code

``` python
ws.linked_workspaces['synapse workspace alias']
```

View all the linked services

```python
LinkedService.list(ws)
```

## Attach Spark pools as compute

Once your workspaces are linked, attach a Spark pool as a dedicated compute resource for your data preparation tasks with the following code.

```python
from azureml.core.compute import SynapseCompute, ComputeTarget

attach_config = SynapseCompute.attach_configuration(linked_workspace, #Linked synapse workspace alias
                                                    type="SynapseSpark", #Type of assets to attach
                                                    pool_name="<Synapse Spark pool name>") #Name of Synapse spark pool 

synapse_compute = ComputeTarget.attach(workspace= ws,                
                                       name='<Synapse pool alias in Azure ML>', #Alias of attached Synapse Apache Spark pools in Azure ML
                                       attach_configuration=attach_config
                                      )

synapse_compute.wait_for_completion()
```

Verify the Spark pool is attached.

```python
ws.compute_targets['Spark pool alias']
```

## Launch Spark pool for data preparation tasks

To start using the Spark pool for data preparation, specify the Spark pool name and the machine learning workspace information.

> [!IMPORTANT]
> To continue use of the Synapse pool you must indicate which compute resource to use throughout your data preparation tasks with `%synpase`

```python
%synapse start -c SynapseSparkPoolAlias -s AzureMLworkspaceSubscriptionID -r AzureMLworkspaceResourceGroupName -w AzureMLworkspaceName
```

After the session start, you can check the session's metadata.

```python
%synapse meta
```

```python
%%synapse

import numpy as np
import pyspark
import os
import urllib
import sys
from datetime import datetime
from datetime import datetime
from dateutil import parser
from pyspark.sql.functions import *
from pyspark.ml.classification import *
from pyspark.ml.evaluation import *
from pyspark.ml.feature import *
from pyspark.sql.types import StructType, StructField
from pyspark.sql.types import DoubleType, IntegerType, StringType
from azureml.core.run import Run

# print runtime versions
print('****************')
print('Python version: {}'.format(sys.version))
print('Spark version: {}'.format(spark.version))
print('****************')

# initialize logger
run = Run.get_context()

# start Spark session
spark = pyspark.sql.SparkSession.builder.appName('NYCGreenTaxi')\
    .config("spark.jars.packages", "io.delta:delta-core_2.12:0.7.0") \
    .config("spark.sql.extensions", "io.delta.sql.DeltaSparkSessionExtension") \
    .config("spark.sql.catalog.spark_catalog", "org.apache.spark.sql.delta.catalog.DeltaCatalog") \
    .getOrCreate()
```

## Retrieve data from Azure Machine Learning Open dataset

The following example,  uses the input data from the Azure Machine Learning Open dataset, [NYC green taxi trip records](https://azure.microsoft.com/en-us/services/open-datasets/catalog/nyc-taxi-limousine-commission-green-taxi-trip-records/). Learn more about [Azure Machine Learning Open Datasets](/open-datasets/overview-what-are-open-datasets.md).

```python
%%synapse

from azureml.opendatasets import NycTlcGreen

end_date = parser.parse('2018-06-01')
start_date = parser.parse('2018-05-01')
nyc_green = NycTlcGreen(start_date=start_date, end_date=end_date)
nyc_green_df = nyc_green.to_spark_dataframe()

# Print schema of input data
print("Schema of the input data:")
nyc_green_df.printSchema()

# Print statistical summary for predicted Y value - total amount for trips
print("Statistics summary for Total Amount:")
nyc_green_df.describe("totalAmount").show()

```

## Perform data preparation tasks

After you've retrieved and explored your data, you can perform data preparation tasks.

The following code,

* Specifies which columns to drop and transform.
* Defines a data frame of a subset of the data by leveraging `pyspark sql`.

```python
%%synapse

# Drop columns that are not relavant to ML modeling
columns_to_drop = ['vendorID','pickupLongitude','pickupLatitude','dropoffLongitude','dropoffLatitude','lpepPickupDatetime','lpepDropoffDatetime','puLocationId','doLocationId','rateCodeID','storeAndFwdFlag','paymentType','fareAmount','ehailFee','extra','mtaTax','improvementSurcharge','tipAmount','tollsAmount','puYear','puMonth']
df = nyc_green_df.drop(*columns_to_drop)

# Transform column tripType
df_t = df.withColumn('tripType', when(df.tripType==2,lit('0')).otherwise(df.tripType))

# Create or replace temp view to prepare for pyspark sql
df_t.createOrReplaceTempView("df_temp")

# Run query by leveraging pyspark sql 
sqlDF = spark.sql("""
    SELECT * 
    FROM df_temp 
    WHERE  (tripDistance>=25 and tripDistance<50)
    AND (passengerCount>0 and totalAmount>0)
""")

# Data exploration and transformation is completed. Print processed data sample.
print("Reading for machine learning")
sqlDF.show(10)
```

## Save data to storage and stop spark session

Once your data exploration and preparation is complete, store your prepared data for later use in your data storage account in Azure.

In the following example, the prepared data is written as a table to Azure Data Lake Storage Generation 2 (ADLS Gen 2).

```python
%%synapse
# Output process data to storage accounts. Below sqlDF is written as delta table to ADLS Gen2. 
sqlDF.write.format("delta").save("abfss://containername@storageaccountpath/foldername/")
```

You can also save the data as a parquet file to the storage of your choosing.

```python
%%synapse
sqlDF.write.parquet("abfss://containername@storageaccountpath/foldername/",mode='overwrite')
```

When you've completed data preparation, stop using your synapse pool with the following command.

```python
%synapse stop
```

## Retrieve prepared data from storage

When you're ready to consume your prepared data for model training, connect to your storage with an [Azure Machine Learning datastore](how-to-access-data.md), and specify which file(s) you want to use with an [Azure Machine Learning dataset](how-to-create-register-datasets.md).

The following code,

* Creates and registers an ADLS Gen 2 datastore to connect to the Azure Data Lake Storage Generation 2 container that contains the prepared data. 
* Creates a [TabularDataset](how-to-create-register-datasets.md#tabulardataset), `nyc_green`, that references the prepared data's file location in the ADLS Gen 2 directory. 
* Registers the `nyc_green` dataset to the machine learning workspace, `ws`. Registering the dataset allows for the `nyc_green` dataset to be referenced and reused in training scripts and machine learning experiments within the `ws` workspace.

```python
import os
from azureml.core import Workspace, Datastore, Dataset

ws = Workspace.from_config()
adlsgen2_datastore_name = '<ADLS gen2 storage account alias>'  #set ADLS Gen2 storage account alias in AML

subscription_id=os.getenv("ADL_SUBSCRIPTION", "<ADLS account subscription ID>") # subscription id of ADLS account
resource_group=os.getenv("ADL_RESOURCE_GROUP", "<ADLS account resource group>") # resource group of ADLS account

account_name=os.getenv("ADLSGEN2_ACCOUNTNAME", "<ADLS account name>") # ADLS Gen2 account name
tenant_id=os.getenv("ADLSGEN2_TENANT", "<tenant id of service principal>") # tenant id of service principal
client_id=os.getenv("ADLSGEN2_CLIENTID", "<client id of service principal>") # client id of service principal
client_secret=os.getenv("ADLSGEN2_CLIENT_SECRET", "<secret of service principal>") # the secret of service principal

## create and register datastore that connects to ADLS Gen 2 storage
adlsgen2_datastore = Datastore.register_azure_data_lake_gen2(
    workspace=ws,
    datastore_name=adlsgen2_datastore_name,
    account_name=account_name, # ADLS Gen2 account name
    filesystem='<filesystem name>', # ADLS Gen2 filesystem
    tenant_id=tenant_id, # tenant id of service principal
    client_id=client_id, # client id of service principal
    client_secret=client_secret) # the secret of service principal


datastore = Datastore.get(ws, adlsgen2_datastore_name)
datastore_path = [(datastore, '/data/*.snappy.parquet')]

# create TabularDataset        
nyc_green = Dataset.Tabular.from_parquet_files(path=datastore_path)

# register nyc_green dataset to machine learning workspace 
nyc_green = nyc_green.register(workspace=ws,
                                 name='nyc_green',
                                 description='nyc green taxi data')
```

## Example notebook

See this [end to end notebook](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/automated-machine-learning) for a detailed code example of how to perform data preparation and model training from a single notebook with Azure Synapse and Azure Machine Learning.

## Next steps

* [Create an Azure machine learning dataset](how-to-create-register-datasets.md).
* [Train a model](how-to-set-up-training-targets.md).
