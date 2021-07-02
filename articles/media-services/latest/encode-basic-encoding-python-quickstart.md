---
title: Media Services Python basic encoding quickstart
description: This quickstart shows you how to do basic encoding with Python and Azure Media Services.
services: media-services
author: IngridAtMicrosoft
manager: femila

ms.service: media-services
ms.workload: 
ms.topic: quickstart
ms.date: 2/26/2021
ms.author: inhenkel
---

# Media Services basic encoding with Python

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

## Introduction

This quickstart shows you how to do basic encoding with Python and Azure Media Services. It uses the 2020-05-01 Media Service v3 API.

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- Create a resource group to use with this quickstart.
- Create a Media Services v3 account.
- Get your storage account key.
- Create a service principal and key.

## Get the sample

Create a fork and clone the sample located in the [Python samples repository](https://github.com/Azure-Samples/media-services-v3-python). For this quickstart, we're working with the BasicEncoding sample.

## Create the .env file

Get the values from your account to create an *.env* file. That's right, save it with no name, just the extension.  Use *sample.env* as a template then save the *.env* file to the BasicEncoder folder in your local clone.

## Use Python virtual environments
For samples, we recommend that you always create and activate a Python virtual environment using the following steps:

1. Open the sample folder in VSCode or other editor
1. Create the virtual environment

``` bash
# py -3 uses the global python interpreter. You can also use python -m venv .venv.
py -3 -m venv .venv
```

This command runs the Python venv module and creates a virtual environment in a folder named .venv.

1. Activate the virtual environment:

``` bash
.venv\scripts\activate
```

A virtual environment is a folder within a project that isolates a copy of a specific Python interpreter. Once you activate that environment (which Visual Studio Code does automatically), running pip install installs a library into that environment only. When you then run your Python code, it runs in the environment's exact context with specific versions of every library. And when you run pip freeze, you get the exact list of the those libraries. (In many of the samples, you create a requirements.txt file for the libraries you need, then use pip install -r requirements.txt. A requirements file is generally needed when you deploy code to Azure.)

## Set up

Set up and [configure your local Python dev environment for Azure](/azure/developer/python/configure-local-development-environment)

Install the azure-identity library for Python. This module is needed for Azure Active Directory authentication. See the details at [Azure Identity client library for Python](/python/api/overview/azure/identity-readme?view=azure-python#environment-variables)

``` bash
pip install azure-identity
```

Install the Python SDK for [Azure Media Services](/python/api/overview/azure/media-services)

The Pypi page for the Media Services Python SDK with latest version details is located at - [azure-mgmt-media](https://pypi.org/project/azure-mgmt-media/)


``` bash
pip install azure-mgmt-media
```

Install the [Azure Storage SDK for Python](https://pypi.org/project/azure-storage-blob/)

``` bash
pip install azure-storage-blob
```

You can optionally install ALL of the requirements for a given samples by using the "requirements.txt" file in the samples folder

``` bash
pip install -r requirements.txt
```

## Try the code

The code below is thoroughly commented.  Use the whole script or use parts of it for your own script.

In this sample, a random number is generated for naming things so you can identify them as a group that was created together when you ran the script.  The random number is optional, and can be removed when you're done testing the script.

We're not using the SAS URL for the input asset in this sample.

```python
from azure.identity import DefaultAzureCredential
from azure.mgmt.media import AzureMediaServices
from azure.storage.blob import BlobServiceClient, BlobClient
from azure.mgmt.media.models import (
  Asset,
  Transform,
  TransformOutput,
  BuiltInStandardEncoderPreset,
  Job,
  JobInputAsset,
  JobOutputAsset)
import os, uuid, sys

#Timer for checking job progress
import time

#This is only necessary for the random number generation
import random

# Set and get environment variables
# Open sample.env, edit the values there and save the file as .env
# (Not all of the values may be used in this sample code, but the .env file is reusable.)
# Use config to use the .env file.
print("Getting .env values")
default_value = "<Fill out the .env>"
account_name = os.getenv('ACCOUNTNAME',default_value)
resource_group_name = os.getenv('RESOURCEGROUP',default_value)
subscription_id = os.getenv('SUBSCRIPTIONID',default_value)

#### STORAGE ####
# Values from .env and the blob url
# For this sample you will use the storage account connection string to create and access assets
storage_account_connection = os.getenv('STORAGEACCOUNTCONNECTION',default_value)

# Get the default Azure credential from the environment variables AADCLIENTID and AADSECRET
default_credential = DefaultAzureCredential()

# The file you want to upload.  For this example, put the file in the same folder as this script. 
# The file ignite.mp4 has been provided for you. 
source_file = "ignite.mp4"

# Generate a random number that will be added to the naming of things so that you don't have to keep doing this during testing.
uniqueness = random.randint(0,9999)

# Set the attributes of the input Asset using the random number
in_asset_name = 'inputassetName' + str(uniqueness)
in_alternate_id = 'inputALTid' + str(uniqueness)
in_description = 'inputdescription' + str(uniqueness)
# Create an Asset object
# From the SDK
# Asset(*, alternate_id: str = None, description: str = None, container: str = None, storage_account_name: str = None, **kwargs) -> None
# The asset_id will be used for the container parameter for the storage SDK after the asset is created by the AMS client.
input_asset = Asset(alternate_id=in_alternate_id,description=in_description)

# Set the attributes of the output Asset using the random number
out_asset_name = 'outputassetName' + str(uniqueness)
out_alternate_id = 'outputALTid' + str(uniqueness)
out_description = 'outputdescription' + str(uniqueness)
# From the SDK
# Asset(*, alternate_id: str = None, description: str = None, container: str = None, storage_account_name: str = None, **kwargs) -> None
output_asset = Asset(alternate_id=out_alternate_id,description=out_description)

# The AMS Client
print("Creating AMS client")
# From SDK
# AzureMediaServices(credentials, subscription_id, base_url=None)
client = AzureMediaServices(default_credential, subscription_id)

# Create an input Asset
print("Creating input asset " + in_asset_name)
# From SDK
# create_or_update(resource_group_name, account_name, asset_name, parameters, custom_headers=None, raw=False, **operation_config)
inputAsset = client.assets.create_or_update(resource_group_name, account_name, in_asset_name, input_asset)

# An AMS asset is a container with a specific id that has "asset-" prepended to the GUID.
# So, you need to create the asset id to identify it as the container
# where Storage is to upload the video (as a block blob)
in_container = 'asset-' + inputAsset.asset_id

# create an output Asset
print("Creating output asset " + out_asset_name)
# From SDK
# create_or_update(resource_group_name, account_name, asset_name, parameters, custom_headers=None, raw=False, **operation_config)
outputAsset = client.assets.create_or_update(resource_group_name, account_name, out_asset_name, output_asset)

### Use the Storage SDK to upload the video ###
print("Uploading the file " + source_file)

blob_service_client = BlobServiceClient.from_connection_string(storage_account_connection)

# From SDK
# get_blob_client(container, blob, snapshot=None)
blob_client = blob_service_client.get_blob_client(in_container,source_file)
working_dir = os.getcwd()
print("Current working directory:" + working_dir)
upload_file_path = os.path.join(working_dir, source_file)

# WARNING: Depending on where you are launching the sample from, the path here could be off, and not include the BasicEncoding folder. 
# Adjust the path as needed depending on how you are launching this python sample file. 

# Upload the video to storage as a block blob
with open(upload_file_path, "rb") as data:
  # From SDK
  # upload_blob(data, blob_type=<BlobType.BlockBlob: 'BlockBlob'>, length=None, metadata=None, **kwargs)
    blob_client.upload_blob(data)

### Create a Transform ###
transform_name='MyTrans' + str(uniqueness)
# From SDK
# TransformOutput(*, preset, on_error=None, relative_priority=None, **kwargs) -> None
transform_output = TransformOutput(preset=BuiltInStandardEncoderPreset(preset_name="AdaptiveStreaming"))

transform = Transform()
transform.outputs = [transform_output]

print("Creating transform " + transform_name)
# From SDK
# Create_or_update(resource_group_name, account_name, transform_name, outputs, description=None, custom_headers=None, raw=False, **operation_config)
transform = client.transforms.create_or_update(
  resource_group_name=resource_group_name,
  account_name=account_name,
  transform_name=transform_name,
  parameters = transform)

### Create a Job ###
job_name = 'MyJob'+ str(uniqueness)
print("Creating job " + job_name)
files = (source_file)
# From SDK
# JobInputAsset(*, asset_name: str, label: str = None, files=None, **kwargs) -> None
input = JobInputAsset(asset_name=in_asset_name)
# From SDK
# JobOutputAsset(*, asset_name: str, **kwargs) -> None
outputs = JobOutputAsset(asset_name=out_asset_name)
# From SDK
# Job(*, input, outputs, description: str = None, priority=None, correlation_data=None, **kwargs) -> None
theJob = Job(input=input,outputs=[outputs])
# From SDK
# Create(resource_group_name, account_name, transform_name, job_name, parameters, custom_headers=None, raw=False, **operation_config)
job: Job = client.jobs.create(resource_group_name,account_name,transform_name,job_name,parameters=theJob)

### Check the progress of the job ### 
# From SDK
# get(resource_group_name, account_name, transform_name, job_name, custom_headers=None, raw=False, **operation_config)
job_state = client.jobs.get(resource_group_name,account_name,transform_name,job_name)
# First check
print("First job check")
print(job_state.state)

# Check the state of the job every 10 seconds. Adjust time_in_seconds = <how often you want to check for job state>
def countdown(t):
    while t: 
        mins, secs = divmod(t, 60) 
        timer = '{:02d}:{:02d}'.format(mins, secs) 
        print(timer, end="\r") 
        time.sleep(1) 
        t -= 1
    job_current = client.jobs.get(resource_group_name,account_name,transform_name,job_name)
    if(job_current.state == "Finished"):
      print(job_current.state)
      # TODO: Download the output file using blob storage SDK
      return
    if(job_current.state == "Error"):
      print(job_current.state)
      # TODO: Provide Error details from Job through API
      return
    else:
      print(job_current.state)
      countdown(int(time_in_seconds))

time_in_seconds = 10
countdown(int(time_in_seconds))
```

## Delete resources

When you're finished with the quickstart, delete the resources created in the resource group.

## Next steps

Get familiar with the [Media Services Python SDK](/python/api/azure-mgmt-media/)

## Resources

- See the Azure Media Services [management API](/python/api/overview/azure/mediaservices/management).
- Learn how to use the [Storage APIs with Python](/azure/developer/python/azure-sdk-example-storage-use?tabs=cmd)
- Learn more about the [Azure Identity client library for Python](/python/api/overview/azure/identity-readme#environment-variables)
- Learn more about [Azure Media Services v3](/azure/media-services/latest/media-services-overview).
- Learn about the [Azure Python SDKs](/azure/developer/python)
- Learn more about [usage patterns for Azure Python SDKs](/azure/developer/python/azure-sdk-library-usage-patterns)
- Find more Azure Python SDKs in the [Azure Python SDK index](/azure/developer/python/azure-sdk-library-package-index)
- [Azure Storage Blob Python SDK reference](/python/api/azure-storage-blob/)
