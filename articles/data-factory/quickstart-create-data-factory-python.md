---
title: Create an Azure data factory using Python | Microsoft Docs
description: Create an Azure data factory to copy data from one location in in an Azure Blob Storage to another location in the same Blob Storage. 
services: data-factory
documentationcenter: ''
author: linda33wj
manager: jhubbard
editor: spelluru

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: 
ms.devlang: dotnet
ms.topic: hero-article
ms.date: 09/19/2017
ms.author: jingwang

---

# Create a data factory and pipeline using Python
This quickstart describes how to use Python to create an Azure data factory. The pipeline in this data factory copies data from one folder to another folder in an Azure blob storage.

## Prerequisites

* **Azure subscription**. If you don't have a subscription, you can create a [free trial](http://azure.microsoft.com/pricing/free-trial/) account.
* **Azure Storage account**. You use the blob storage as **source** and **sink** data store. If you don't have an Azure storage account, see the [Create a storage account](../storage/common/storage-create-storage-account.md#create-a-storage-account) article for steps to create one. 
* **Visual Studio** 2013, 2015, or 2017. The walkthrough in this article uses Visual Studio 2017.
* **Download and install [Azure .NET SDK](http://azure.microsoft.com/downloads/)**.
* **Create an application in Azure Active Directory** following [this instruction](../azure-resource-manager/resource-group-create-service-principal-portal.md#create-an-azure-active-directory-application). Make note of the following values that you use in later steps: **application ID**, **authentication key**, and **tenant ID**. Assign application to "**Contributor**" role by following instructions in the same article. 

### Create and upload an input file

1. Launch Notepad. Copy the following text and save it as **input.txt** file on your disk.
    
    ```
    John|Doe
    Jane|Doe
    ```
2.	Use tools such as [Azure Storage Explorer](http://storageexplorer.com/) to create the **adfv2tutorial** container, and to upload the input.txt file to the container. 

## Install the Python package

1.	Download the Azure Data Factory Python file into a directory where you’ll run your project.
2.	Open a terminal or command prompt with administrator privileges. 
3.	To install the package, run the following command:

    ```
    pip install azure_mgmt_datafactory-0.1.0-py2.py3-none-any.whl
    ```
4. You should see the following output if you successfully installed the file

    ```
    Installing collected packages: certifi, msrest, msrestazure, azure-nspkg, azure-common, azure-mgmt-nspkg, azure-mgmt-datafactory, idna
    Successfully installed azure-common-1.1.8 azure-mgmt-datafactory-0.1.0 azure-mgmt-nspkg-2.0.0 azure-nspkg-2.0.0 certifi-2017.7.27.1 idna-2.6 msrest-0.4.14 msrestazure-0.4.14
    ```

## Create a data factory client

1. Create a file named **datafactory.py**. Add the following statements to add references to namespaces.
    
    ```python
    from azure.common.credentials import ServicePrincipalCredentials
    from msrestazure.azure_cloud import Cloud, CloudEndpoints, CloudSuffixes
    from azure.mgmt.resource import ResourceManagementClient
    from azure.mgmt.datafactory import DataFactoryManagementClient
    from azure.mgmt.datafactory.models import *
    import json
    import time    
    ```
2. Add the following functions that print information. 

    ```python
    def print_item(group):
      """Print an Azure object instance."""
      print("\tName: {}".format(group.name))
      print("\tId: {}".format(group.id))
      if hasattr(group, 'location'):
          print("\tLocation: {}".format(group.location))
      if hasattr(group, 'tags'):
          print("\tTags: {}".format(group.tags))
      if hasattr(group, 'properties'):
          print_properties(group.properties)
    
    def print_properties(props):
      """Print a ResourceGroup properties instance."""
      if props and hasattr(props, 'provisioning_state') and props.provisioning_state:
          print("\tProperties:")
          print("\t\tProvisioning State: {}".format(props.provisioning_state))
      print("\n\n")    
    ```
3. Add the following code to the **Main** method that creates an instance of DataFactoryManagementClient class. You use this object to create the data factory, linked service, datasets, and pipeline. You also use this object to monitor the pipeline run details.

    ```python   
    subscription_id = '<your subscription ID where the factory resides>'
    credentials = ServicePrincipalCredentials(
            client_id=<yourClientId>',
            secret='<YourPassword>',
            tenant='<YourTenandId>'
    
    resource_client = ResourceManagementClient(credentials, subscription_id)
    adf_client = DataFactoryManagementClient(credentials, subscription_id)
    
    rg_params = {'location':'eastus'}
    df_params = {'location':'eastus'}
    rg_name = '<Your Resource Group Name>'
    df_name = '<Your Data Factory Name>'
    ```

## Create a data factory

Add the following code to the **Main** method that creates a **data factory**. 

```python
#Create Resource Group
resource_client.resource_groups.create_or_update(rg_name, rg_params)

#Create Data Factory
df_resource = Factory(location='eastus')
df = adf_client.factories.create_or_update(rg_name, df_name, df_resource)
print_item(df)
while df.provisioning_state != 'Succeeded':
    df = adf_client.factories.get(rg_name, df_name)
    time.sleep(1)
print_item(adf_client.factories.get(rg_name, df_name))
```

## Create a linked service

Add the following code to the **Main** method that creates an **Azure Storage linked service**.

You create linked services in a data factory to link your data stores and compute services to the data factory. In this quickstart, you only need create one Azure Storage linked service as both copy source and sink store, named "AzureStorageLinkedService" in the sample.

```python
#Create Storage Linked Service
ls_name = 'storageLinkedService'

#Replace Storage String with your credentials
storage_string = SecureString('DefaultEndpointsProtocol=https;AccountName=<replace>;AccountKey=<replace>

ls_azure_storage = AzureStorageLinkedService(connection_string=storage_string)
ls = adf_client.linked_services.create_or_update(rg_name, df_name, ls_name, ls_azure_storage)
print_item(ls)
```
## Create datasets
In this section, you create two datasets: one for the source and the other for the sink.

### Create a dataset for source Azure Blob
Add the following code to the Main method that creates an Azure blob dataset. For information about properties of Azure Blob dataset, see [Azure blob connector](connector-azure-blob-storage.md#dataset-properties) article. 

You define a dataset that represents the source data in Azure Blob. This Blob dataset refers to the Azure Storage linked service you create in the previous step.

```python
#Create Dataset Input
ds_name = 'ds_in'
ds_ls = LinkedServiceReference(ls_name)
blob_path= 'adfv2branch/'
blob_filename = 'input.txt'
ds_azure_blob= AzureBlobDataset(ds_ls, folder_path=blob_path, file_name = blob_filename)
ds = adf_client.datasets.create_or_update(rg_name, df_name, ds_name, ds_azure_blob)
print_item(ds)
```

### Create a dataset for sink Azure Blob
Add the following code to the Main method that creates an Azure blob dataset. For information about properties of Azure Blob dataset, see [Azure blob connector](connector-azure-blob-storage.md#dataset-properties) article. 

You define a dataset that represents the source data in Azure Blob. This Blob dataset refers to the Azure Storage linked service you create in the previous step.

```python
#Create Dataset Output
dsOut_name = 'ds_out'
output_blobpath = 'output/'
dsOut_azure_blob = AzureBlobDataset(ds_ls, folder_path=output_blobpath)
dsOut = adf_client.datasets.create_or_update(rg_name, df_name, dsOut_name, dsOut_azure_blob)
print_item(dsOut)
```

## Create a pipeline

Add the following code to the **Main** method that creates a **pipeline with a copy activity**.

```python
#Create 1st activity: Copy Activity
act_name =  'copyBlobtoBlob'
blob_source = BlobSource()
blob_sink = BlobSink()
dsin_ref = DatasetReference(ds_name)
dsOut_ref = DatasetReference(dsOut_name)
copy_activity = CopyActivity(act_name,inputs=[dsin_ref], outputs=[dsOut_ref], source=blob_source, sink=blob_sink)

#Create Pipeline
p_name =  'copyPipeline'
params_for_pipeline = {}
p_obj = PipelineResource(activities=[copy_activity], parameters=params_for_pipeline)
p = adf_client.pipelines.create_or_update(rg_name, df_name, p_name, p_obj)
print_item(p)
```


## Create a pipeline run

Add the following code to the **Main** method that **triggers a pipeline run**.

```python
#Create Pipeline Run
print(adf_client.pipelines.create_run(rg_name, df_name, p_name,
    {
    }
))
```

## Run the code
Build and start the application, then verify the pipeline execution.

The console prints the progress of creating data factory, linked service, datasets, pipeline, and pipeline run. It then checks the pipeline run status. Wait until you see the copy activity run details with data read/written size. Then, use tools such as [Azure Storage explorer](https://azure.microsoft.com/features/storage-explorer/) to check the blob(s) is copied to "outputBlobPath" from "inputBlobPath" as you specified in variables.


## Clean up resources
To programmatically, delete the data factory, add the following lines of code to the program: 

```csharp
adf_client.data_factories.delete(rg_name, df_name)
```

## Next steps
You used Python to create a data factory and a pipeline in this tutorial. The pipeline in this sample copies data from one location to another location in an Azure blob storage. To learn more, review other Quickstarts and tutorials.

Tutorial | Description
-------- | -----------
[Tutorial: copy data from Azure Blob Storage to Azure SQL Database](tutorial-copy-data-dot-net.md) | Shows you how to copy data from a blob storage to a SQL database. For a list of data stores supported as sources and sinks in a copy operation by data factory, see [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats). 
[Tutorial: copy data from an on-premises SQL Server to an Azure blob storage](tutorial-copy-onprem-data-to-cloud-powershell.md) | Shows you how to copy data from an on-premises SQL Server database to an Azure blob storage. 
[Tutorial: transform data using Spark](tutorial-transform-data-spark-powershell.md) | Shows you how to transform data in the cloud by using a Spark cluster on Azure
