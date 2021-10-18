---
title: 'Tutorial: Score machine learning models with PREDICT in Synapse Analytics spark pool'
description: Tutorial for how to use PREDICT functionality for predicting scores through machine learning models in dedicated Synapse spark pools.
services: synapse-analytics
ms.service: synapse-analytics 
ms.subservice: machine-learning
ms.topic: tutorial
ms.reviewer: jrasnick, garye

ms.date: 10/18/2021
author: AjAgr
ms.author: ajagarw
---

# Tutorial: Score machine learning models with PREDICT in Synapse Analytics spark pool

Learn how to use PREDICT functionality in dedicated spark pools in Azure Synapse Analytics, for score prediction if trained model is registered in Azure Machine Learning (AML) Or Synapse workspace default Azure Data Lake Storage (ADLS).

PREDICT in Synapse PySpark notebook provides you the capability to score machine learning models using the  SQL language, user defined functions (UDF) or Transformers. With PREDICT, you can bring your existing machine learning models trained outside Synapse with historical data and registered in Azure Data Lake Storage Gen2 or Azure Machine Learning to further score them within the secure boundaries of Azure Synapse Analytics. PREDICT function takes a model and data as inputs. This feature eliminates the step of moving valuable data outside Synapse for scoring. It aims to empower model consumers to easily infer machine learning models in Synapse as well as collaborate seamlessly with model producer working with the right framework for their task.


In this tutorial, you'll learn how to:

> [!div class="checklist"]
> - predict scores for data in Synapse spark pool using machine learning models which are trained outside Synapse and registered in Azure Machine Learning or Azure Data Lake Storage Gen2.

If you don't have an Azure subscription, [create a free account before you begin](https://azure.microsoft.com/free/).

## Prerequisites

- [Azure Synapse Analytics workspace](../get-started-create-workspace.md) with an Azure Data Lake Storage Gen2 storage account configured as the default storage. You need to be the *Storage Blob Data Contributor* of the Data Lake Storage Gen2 file system that you work with.
- Spark pool in your Azure Synapse Analytics workspace. For details, see [Create a Spark pool in Azure Synapse](../get-started-analyze-spark.md).
- Azure Machine Learning workspace is needed if you want to train or register model in Azure Machine Learning. For details, see [Manage Azure Machine Learning workspaces in the portal or with the Python SDK](articles/machine-learning/how-to-manage-workspace.md).
- If your model is registered in Azure Machine Learning then you need a linked service. In Azure Synapse Analytics, a linked service is where you define your connection information to other services. In this section, you'll add an Azure Synapse Analytics and Azure Machine Learning linked service. To learn more, see [Create a new Azure Machine Learning linked service in Synapse](quickstart-integrate-azure-machine-learning.md).
- The functionality requires that we already have trained model which is either registered in Azure Machine Learning OR uploaded in Azure Data Lake Storage Gen2.

> [!NOTE]
> This functionality is currently supported only for MLFLOW packaged ONNX, TensorFlow, PyTorch and Sklearn models. Mlflow Pyfunc packaging is also supported for customized python models (viz EBMClassifier etc.).
> Only AML or ADLS model source is supported. So to use PREDICT either model should be registered in AML or should be uploaded in ADLS. Here ADLS account refers to default Synapse workspace ADLS account.
> PREDICT is supported on Spark3.1 version onwards. Python 3.8 is recommended version for model creation and training

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com/).


## Use PREDICT in Synapse PySpark notebook for MLFLOW packaged models

Please make sure all prerequisites are in place beofre following below steps for using PREDICT.

1. Import libraries: Import below libraries to use PREDICT in spark session.

```PYSPARK
   # Import libraries
   from pyspark.sql.functions import col, pandas_udf,udf,lit
   from azureml.core import Workspace
   from azureml.core.authentication import ServicePrincipalAuthentication
   import azure.synapse.ml.predict as pcontext
```

1. Set parameters using variables: Synapse ADLS data path and model URI need to be set using input variables. We also need to define runtime which is "mlflow" and the data type of model output return. Please note that all data types which are supported in PySpark are supported through PREDICT also.

```PYSPARK
   # Import libraries
   DATA_FILE = "abfss://<filesystemname>@<account name>.dfs.windows.cor.net/<file path>"

   # Set model URI
       # Set AML URI, if trained model is registered in AML
          AML_MODEL_URI = "aml://mlflow_sklearn:1" #Here ":1" signifies model version in AML. We can choose which version we want to run. If ":1" is not provided then by default latest version will be picked

       # Set ADLS URI, if trained model is uploaded in ADLS
          ADLS_MODEL_URI = "abfss://<filesystemname>@<account name>.dfs.windows.cor.net/<model mlflow folder path>"

   # Define model return type
   RETURN_TYPES = "INT"

   # Define model runtime. This supports only mlflow
   RUNTIME = "mlflow"
```

1. Ways to authenticate AML workspace: If model is stored in default ADLS account of Synapse workspace then we do not need any further auth setup. In case model is registered in AML, then we can choose any of the 2 supported ways of authentication:

    1. Through service principle: You can use service principle client id and secret directly to authenticate to AML workspace. Service principle must have "Contributor" access at AML workspace.

    ```PYSPARK
       # AML workspace authentication using service principle
       AZURE_TENANT_ID = "<tenant_id>"
       AZURE_CLIENT_ID = "<client_id>"
       AZURE_CLIENT_SECRET = "<client_secret>"

       AML_SUBSCRIPTION_ID = "<subscription_id>"
       AML_RESOURCE_GROUP = "<resource_group_name>"
       AML_WORKSPACE_NAME = "<aml_workspace_name>"

       svc_pr = ServicePrincipalAuthentication( 
           tenant_id=AZURE_TENANT_ID,
           service_principal_id=AZURE_CLIENT_ID,
           service_principal_password=AZURE_CLIENT_SECRET
       )

       ws = Workspace(
           workspace_name = AML_WORKSPACE_NAME,
           subscription_id = AML_SUBSCRIPTION_ID,
           resource_group = AML_RESOURCE_GROUP,
           auth=svc_pr
       )
    ```

    1. Through linked service: You can use linked service to authenticate to AML workspace. Linked service can use "Service Principle" or Synapse workspace's "Managed Service Identity (MSI)" for authentication. "Service Principle" or "Managed Service Identity (MSI)" must have "Contributor" access at AML workspace.

    ```PYSPARK
       # AML workspace authentication using linked service
       from notebookutils.mssparkutils import azureML
       ws = azureML.getWorkspace("<linked_service_name>") # "<linked_service_name>" is the linked service name, not AML workspace name. Also, linked service supports MSI and service principle both
    ```

1. Enable PREDICT in spark session: Set the spark conf spark.synapse.ml.predict.enabled as true to enable the library.

```PYSPARK
   # Enable SynapseML predict
   spark.conf.set("spark.synapse.ml.predict.enabled","true")
```

1. Bind model in spark session: Bind model with required inputs so that model can be referred in spark session and define alias so that while PREDICT call you can use same alias..

```PYSPARK
   # Bind model within Spark session
   model = pcontext.bind_model(
    return_types=RETURN_TYPES, 
    runtime=RUNTIME, 
    model_alias="<give_some_random_alias>", #This alias will be used in PREDICT call to refer this model
    model_uri=ADLS_MODEL_URI, #In case of AML, it will be AML_MODEL_URI
    aml_workspace=ws #This is only for AML. In case of ADLS, this parameter can be removed
    ).register()
```

1. Enable PREDICT in spark session: Set the spark conf spark.synapse.ml.predict.enabled as true to enable the library.

 ```PYSPARK
   # Enable SynapseML predict
   spark.conf.set("spark.synapse.ml.predict.enabled","true")
```
1. Run the following code.

   > [!NOTE]
   > Update the file URL, ADLS Gen2 storage name and key in this script before running it.

   ```PYSPARK
   # To read data
   import fsspec
   import pandas

   adls_account_name = '' #Provide exact ADLS account name
   adls_account_key = '' #Provide exact ADLS account key

   fsspec_handle = fsspec.open('abfs://<container>/<path-to-file>', account_name=adls_account_name, account_key=adls_account_key)

   with fsspec_handle.open() as f:
       df = pandas.read_csv(f)

   # To write data
   import fsspec
   import pandas

   adls_account_name = '' #Provide exact ADLS account name 
   adls_account_key = '' #Provide exact ADLS account key 
   
   data = pandas.DataFrame({'Name':['Tom', 'nick', 'krish', 'jack'], 'Age':[20, 21, 19, 18]})
   
   fsspec_handle = fsspec.open('abfs://<container>/<path-to-file>', account_name=adls_account_name,    account_key=adls_account_key, mode="wt")
   
   with fsspec_handle.open() as f:
   	data.to_csv(f)
   ```

## Read/Write data using linked service

FSSPEC can read/write ADLS data by specifying the linked service name.


1. In Synapse studio, open **Data** > **Linked** > **Azure Data Lake Storage Gen2**. Upload data to the default storage account.

1. Run the following code.

   > [!NOTE]
   > Update the file URL, Linked Service Name and ADLS Gen2 storage name in this script before running it.

   ```PYSPARK
   # To read data
   import fsspec
   import pandas
   
   adls_account_name = '' #Provide exact ADLS account name
   sas_key = TokenLibrary.getConnectionString(<LinkedServiceName>)
   
   fsspec_handle = fsspec.open('abfs://<container>/<path-to-file>', account_name =    adls_account_name, sas_token=sas_key)
   
   with fsspec_handle.open() as f:
       df = pandas.read_csv(f)

   # To write data
   import fsspec
   import pandas
   
   adls_account_name = '' #Provide exact ADLS account name
   
   data = pandas.DataFrame({'Name':['Tom', 'nick', 'krish', 'jack'], 'Age':[20, 21, 19, 18]})
   sas_key = TokenLibrary.getConnectionString(<LinkedServiceName>) 
   
   fsspec_handle = fsspec.open('abfs://<container>/<path-to-file>', account_name =    adls_account_name, sas_token=sas_key, mode="wt") 
   
   with fsspec_handle.open() as f:
       data.to_csv(f) 
   ```

## Next steps

- [Machine Learning capabilities in Azure Synapse Analytics](what-is-machine-learning.md)