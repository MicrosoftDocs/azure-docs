---
title: Media Services Python basic encoding quickstart
: Azure Media Services
description: This quickstart shows you how to do basic encoding with Python and Azure Media Services.
services: media-services
documentationcenter: ''
author: IngridAtMicrosoft
manager: femila
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: quickstart
ms.date: 2/12/2021
ms.author: inhenkel
---

# Media Services basic encoding with Python

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

## Introduction

This quickstart shows you how to do basic encoding with Python and Azure Media Services. It uses the 2020-05-01 Media Service v3 API. The Python SDK reference document is [here](https://docs.microsoft.com/python/api/overview/azure/mediaservices/management?view=azure-python&preserve-view=true).

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- Create a Media Services v3 account.
- Get your storage account key.
- Create a service principal and key.
- Start with the simple connection script first to set yourself up.  This script builds on that one. See [Connect to Media Services v3 API - Python](configure-connect-python-howto.md).

## Import the needed modules

```python
import adal
from msrestazure.azure_active_directory import AdalAuthentication
from msrestazure.azure_cloud import AZURE_PUBLIC_CLOUD
from azure.mgmt.media import AzureMediaServices
from azure.mgmt.media.models import Asset,Transform,TransformOutput,BuiltInStandardEncoderPreset, Job, JobInputAsset, JobOutputAsset
import os, uuid, sys
from azure.identity import DefaultAzureCredential
from azure.storage.blob import BlobServiceClient, BlobClient
#These are optional
import responses
import json
#After you have tested the script for yourself, you can eliminate everything that uses the random number generator and change the values to what you want them to be.
import random
```

## Establish authentication and AMS variables

If you don't know where to find the below values, see [Find your tenant ID](how-to-set-azure-tenant.md) and [Find your Azure subscription](how-to-set-azure-subscription.md).

```python
RESOURCE = 'https://management.core.windows.net/'
# Tenant ID for your Azure Subscription
TENANT_ID = 'your tenant id'
# Your Service Principal App ID
CLIENT = 'your service principal id'
# Your Service Principal Password
KEY = 'the service principal key (secret)'
# Your Azure Subscription ID
SUBSCRIPTION_ID = 'your subscription id'
# Active Directory
LOGIN_ENDPOINT = AZURE_PUBLIC_CLOUD.endpoints.active_directory
RESOURCE = AZURE_PUBLIC_CLOUD.endpoints.active_directory_resource_id
```

### ADAL Authentication
Azure Active Directory Authentication Library (ADAL) authenticates your Media Services client.

```python
context = adal.AuthenticationContext(LOGIN_ENDPOINT + '/' + TENANT_ID)
credentials = AdalAuthentication(
    context.acquire_token_with_client_credentials,
    RESOURCE,
    CLIENT,
    KEY
)
```

### Azure Media Services

```python
account_name = 'your media services account name'
resource_group_name = 'your resource group name'
uri = 'https://<your resource group name>.streaming.mediaservices.windows.net/'
```

## Azure Storage

```python
storage_account_name = 'your storage account name'
storage_account_key = 'your storage account key'
storage_blob_url = 'https://<your storage account name>.blob.core.windows.net/'
```

## Basic encoding with a single file

### Create the file path

In this case, the file would be in the same folder as your Python script.

```python
#The path of file you want to upload
source_file = "ignite.mp4"
```

### Create the AMS client

```python
client = AzureMediaServices(credentials, SUBSCRIPTION_ID)
```

### Generate a random number

This number is intended to be used only when you're running the script over and over while testing.  You can remove it when you're satisfied that your code is working. It creates a random number that is appended to entity names so you can associate them easily.

```python
thisRandom = random.randint(0,9999)
```

## Create input and output Assets

Here the script is creating assets sequentially.  You could create a function for creating assets instead and make this process more elegant.  (Again, the random number is just for testing.)

```python
# Set the attributes of the input Asset using the random number
in_assetname = 'inputassetName' + str(thisRandom)
in_alternate_id = 'inputALTid' + str(thisRandom)
in_description = 'inputdescription' + str(thisRandom)

#Set the attributes of the output Asset using the random number
out_assetname = 'outputassetName' + str(thisRandom)
out_alternate_id = 'outputALTid' + str(thisRandom)
out_description = 'outputdescription' + str(thisRandom)

##Input Asset parameters
#This actually should be done with an object, but for teaching purposes, we have used the REST request JSON.
in_asset_name = in_assetname
in_asset_properties = {
    'properties': {
        'description': in_description,
        'storageAccountName': storage_account_name
    }
}

##Output Asset parameters
#This actually should be done with an object, but for teaching purposes, we have used the REST request JSON.
out_asset_name = out_assetname
out_asset_properties = {
    'properties': {
        'description': out_description,
        'storageAccountName': storage_account_name
    }
}

#Create an input Asset
inputAsset = client.assets.create_or_update(resource_group_name, account_name, in_asset_name, in_asset_properties)
#Create the asset id to identify it Storage SDK file upload
in_container = 'asset-' + inputAsset.asset_id
#Get the SAS URL of the Asset
sas_URLs = client.assets.list_container_sas(resource_group_name,account_name,in_asset_name)

#create an output Asset
outputAsset = client.assets.create_or_update(resource_group_name, account_name, out_asset_name, out_asset_properties)
#Create the asset id to identify it Storage SDK file upload
out_container = 'asset-' + outputAsset.asset_id
#Get the SAS URL of the Asset
sas_URLs = client.assets.list_container_sas(resource_group_name,account_name,out_asset_name)
```

### Use the Storage SDK to upload the video

The container that the storage client is looking for is the Asset ID we established earlier: `in_container = 'asset-' + inputAsset.asset_id`.

```python
blob_service_client = BlobServiceClient(account_url=storage_blob_url, credential=storage_account_key)
blob_client = blob_service_client.get_blob_client(in_container,source_file)

# Upload the video to storage as a block blob.
with open(source_file, 'rb') as data:
    blob_client.upload_blob(data, blob_type='BlockBlob')

print('Uploading file')
```

### Create a Transform

The random number is being used here so you can see the transform as part of the set of things you are working with. It is be helpful for seeing the entities in the Azure portal.  

Here, we've used an object for the transform_output instead of JSON.

```python
transform_name='MyTransform' + str(thisRandom) 
transform_output = TransformOutput(preset=BuiltInStandardEncoderPreset(preset_name="AdaptiveStreaming"))
transform: Transform = client.transforms.create_or_update(resource_group_name=resource_group_name,account_name=account_name,transform_name=transform_name,outputs=[transform_output])
```

### Create a Job

```python
#Create a job
#This actually should be done with an object, but for teaching purposes, we have used the REST request JSON.
job_name = 'MyJob'+ str(thisRandom)
theJob = {
  "properties": {
    "input": {
      "@odata.type": "#Microsoft.Media.JobInputAsset",
      "assetName": in_asset_name
    },
    "outputs": [
      {
        "@odata.type": "#Microsoft.Media.JobOutputAsset",
        "assetName": out_asset_name
      }
    ]
  }
}
job: Job = client.jobs.create(resource_group_name,account_name,transform_name,job_name,parameters=theJob)
```

## Clean up resources

If you aren't planning to use the resources you created during this quickstart and you don't want to continue to be billed for them, delete them.

```python

client.assets.delete(resource_group_name, account_name, asset_name)

```

## Next steps

Get familiar with the [Media Services Python SDK](https://docs.microsoft.com/en-us/python/api/azure-mgmt-media/?view=azure-python)