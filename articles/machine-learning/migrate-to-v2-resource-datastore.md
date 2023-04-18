---
title: Upgrade datastore management to SDK v2
titleSuffix: Azure Machine Learning
description: Upgrade datastore management from v1 to v2 of Azure Machine Learning SDK
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
author: SturgeonMi
ms.author: xunwan
ms.date: 09/16/2022
ms.reviewer: sgilley
ms.custom: migration
monikerRange: 'azureml-api-1 || azureml-api-2'
---

# Upgrade datastore management to SDK v2

Azure Machine Learning Datastores securely keep the connection information to your data storage on Azure, so you don't have to code it in your scripts. V2 Datastore concept remains mostly unchanged compared with V1. The difference is we won't support SQL-like data sources via Azure Machine Learning Datastores. We'll support SQL-like data sources via Azure Machine Learning data import&export functionalities.

This article gives a comparison of scenario(s) in SDK v1 and SDK v2.

## Create a datastore from an Azure Blob container via account_key 

* SDK v1

    ```python
    blob_datastore_name='azblobsdk' # Name of the datastore to workspace
    container_name=os.getenv("BLOB_CONTAINER", "<my-container-name>") # Name of Azure blob container
    account_name=os.getenv("BLOB_ACCOUNTNAME", "<my-account-name>") # Storage account name
    account_key=os.getenv("BLOB_ACCOUNT_KEY", "<my-account-key>") # Storage account access key
    
    blob_datastore = Datastore.register_azure_blob_container(workspace=ws, 
                                                             datastore_name=blob_datastore_name, 
                                                             container_name=container_name, 
                                                             account_name=account_name,
                                                             account_key=account_key)
    ```


* SDK v2

    ```python
    from azure.ai.ml.entities import AzureBlobDatastore
    from azure.ai.ml import MLClient
    
    ml_client = MLClient.from_config()
    
    store = AzureBlobDatastore(
        name="blob-protocol-example",
        description="Datastore pointing to a blob container using wasbs protocol.",
        account_name="mytestblobstore",
        container_name="data-container",
        protocol="wasbs",
        credentials={
            "account_key": "XXXxxxXXXxXXXXxxXXXXXxXXXXXxXxxXxXXXxXXXxXXxxxXXxxXXXxXxXXXxxXxxXXXXxxxxxXXxxxxxxXXXxXXX"
        },
    )
    
    ml_client.create_or_update(store)
    ```


## Create a datastore from an Azure Blob container via sas_token

* SDK v1

    ```python
    blob_datastore_name='azblobsdk' # Name of the datastore to workspace
    container_name=os.getenv("BLOB_CONTAINER", "<my-container-name>") # Name of Azure blob container
    sas_token=os.getenv("BLOB_SAS_TOKEN", "<my-sas-token>") # Sas token
    
    blob_datastore = Datastore.register_azure_blob_container(workspace=ws, 
                                                             datastore_name=blob_datastore_name, 
                                                             container_name=container_name, 
                                                             sas_token=sas_token)
    ```
    
* SDK v2

    ```python
    from azure.ai.ml.entities import AzureBlobDatastore
    from azure.ai.ml import MLClient
    
    ml_client = MLClient.from_config()
    
    store = AzureBlobDatastore(
        name="blob-sas-example",
        description="Datastore pointing to a blob container using SAS token.",
        account_name="mytestblobstore",
        container_name="data-container",
        credentials=SasTokenCredentials(
            sas_token= "?xx=XXXX-XX-XX&xx=xxxx&xxx=xxx&xx=xxxxxxxxxxx&xx=XXXX-XX-XXXXX:XX:XXX&xx=XXXX-XX-XXXXX:XX:XXX&xxx=xxxxx&xxx=XXxXXXxxxxxXXXXXXXxXxxxXXXXXxxXXXXXxXXXXxXXXxXXxXX"
        ),
    )
    
    ml_client.create_or_update(store)
    ```
    
## Create a datastore from an Azure Blob container via identity-based authentication

* SDK v1

```python
blob_datastore = Datastore.register_azure_blob_container(workspace=ws,
                                                      datastore_name='credentialless_blob',
                                                      container_name='my_container_name',
                                                      account_name='my_account_name')

```

* SDK v2

    ```python
    from azure.ai.ml.entities import AzureBlobDatastore
    from azure.ai.ml import MLClient
    
    ml_client = MLClient.from_config()
    
    store = AzureBlobDatastore(
        name="",
        description="",
        account_name="",
        container_name=""
    )
    
    ml_client.create_or_update(store)
    ```

## Get datastores from your workspace

* SDK v1

    ```python
    # Get a named datastore from the current workspace
    datastore = Datastore.get(ws, datastore_name='your datastore name')
    ```
    
    ```python
    # List all datastores registered in the current workspace
    datastores = ws.datastores
    for name, datastore in datastores.items():
        print(name, datastore.datastore_type)
    ```

* SDK v2
    
    ```python
    from azure.ai.ml import MLClient
    from azure.identity import DefaultAzureCredential
    
    #Enter details of your Azure Machine Learning workspace
    subscription_id = '<SUBSCRIPTION_ID>'
    resource_group = '<RESOURCE_GROUP>'
    workspace_name = '<AZUREML_WORKSPACE_NAME>'
    
    ml_client = MLClient(credential=DefaultAzureCredential(),
                         subscription_id=subscription_id, 
                         resource_group_name=resource_group)
    
    datastore = ml_client.datastores.get(name='your datastore name')
    ```

## Mapping of key functionality in SDK v1 and SDK v2

|Storage types in SDK v1|Storage types in SDK v2|
|--------------|-------------------|
|[azureml_blob_datastore](/python/api/azureml-core/azureml.data.azure_storage_datastore.azureblobdatastore?view=azure-ml-py&preserve-view=true)|[azureml_blob_datastore](/python/api/azure-ai-ml/azure.ai.ml.entities.azuredatalakegen1datastore)|
|[azureml_data_lake_gen1_datastore](/python/api/azureml-core/azureml.data.azure_data_lake_datastore.azuredatalakedatastore?view=azure-ml-py&preserve-view=true)|[azureml_data_lake_gen1_datastore](/python/api/azure-ai-ml/azure.ai.ml.entities.azuredatalakegen1datastore)|
|[azureml_data_lake_gen2_datastore](/python/api/azureml-core/azureml.data.azure_data_lake_datastore.azuredatalakegen2datastore?view=azure-ml-py&preserve-view=true)|[azureml_data_lake_gen2_datastore](/python/api/azure-ai-ml/azure.ai.ml.entities.azuredatalakegen2datastore)|
|[azuremlml_sql_database_datastore](/python/api/azureml-core/azureml.data.azure_sql_database_datastore.azuresqldatabasedatastore?view=azure-ml-py&preserve-view=true)|Will be supported via import & export functionalities|
|[azuremlml_my_sql_datastore](/python/api/azureml-core/azureml.data.azure_my_sql_datastore.azuremysqldatastore?view=azure-ml-py&preserve-view=true)|Will be supported via import & export functionalities|
|[azuremlml_postgre_sql_datastore](/python/api/azureml-core/azureml.data.azure_postgre_sql_datastore.azurepostgresqldatastore?view=azure-ml-py&preserve-view=true)|Will be supported via import & export functionalities|


## Next steps

For more information, see:

* [Create datastores](how-to-datastore.md?tabs=cli-identity-based-access%2Csdk-adls-sp%2Csdk-azfiles-sas%2Csdk-adlsgen1-sp)
* [Read and write data in a job](how-to-read-write-data-v2.md)
* [V2 datastore operations](/python/api/azure-ai-ml/azure.ai.ml.operations.datastoreoperations)

