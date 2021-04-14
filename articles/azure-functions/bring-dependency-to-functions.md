---
title: Bring dependencies or third party library to Azure Functions
description: Learn how to bring files or third party library 
ms.date: 4/6/2020
ms.topic: tutorial
ms.custom: "devx-track-csharp, mvc, devx-track-python, devx-track-azurepowershell, devx-track-azurecli"
zone_pivot_groups: programming-languages-set-functions-full
---

# Bring dependencies or third party library to Azure Functions

In this tutorial, you create and deploy your code to Azure Functions and bring in third party dependencies, e.g. binary files and machine learning models. 

## Put dependencies in Azure Functions Project Directory

One way to bring in dependencies is to put the files/artifact together with the functions app code in functions project directory structure.
```
<project_root>/
 | - my_first_function/
 | | - __init__.py
 | | - function.json
 | | - example.py
 | - dependencies/
 | | - dependency1
 | - .funcignore
 | - host.json
 | - local.settings.json
```
By putting the dependencies in a folder inside functions app project directory, the dependencies will get deployed together with the code.

### Accessing the dependencies in your code

Here is an example to execute ```ffmpeg``` dependency that is put into ```<project_root>/ffmpeg_lib``` directory. 


```python
import logging

import azure.functions as func
import subprocess

FFMPEG_RELATIVE_PATH = "../ffmpeg_lib/ffmpeg"

def main(req: func.HttpRequest,
         context: func.Context) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')
    
    # context.function_directory returns the current directory in which functions is executed 
    ffmpeg_path = "/".join([str(context.function_directory), FFMPEG_RELATIVE_PATH])

    try:
        subprocess.call(ffmpeg_path)
        return func.HttpResponse("ffmpeg is successfully executed",status_code=200)
    except Exception:
        return func.HttpResponse("Unexpected exception happened when executing ffmpeg",status_code=200)
```

## Use Azure Files to bring in dependencies

Another way to bring in 3rd party dependency, you can utilize Azure Functions feature to mount Azure Files.This might be appropriate if you want to decouple dependencies or artifacts from your application code.

First, you need to create a Azure Storage Account. In the account, you also need to create file share in Azure files. To create these resources, please follow this [guide](../storage/files/storage-how-to-use-files-portal.md)

Once, we have this, using Az CLI , execute this command 
```console
az webapp config storage-account add \
  --name < Function-App-Name > \
  --resource-group < Resource-Group > \
  --subscription < Subscription-Id > \
  --custom-id < Unique-Custom-Id > \
  --storage-type AzureFiles \
  --account-name < Storage-Account-Name > \
  --share-name < File-Share-Name >  \
  --access-key < Storage-Account-AccessKey > \
  --mount-path </path/to/mount>
```

#### custom-id 
 Any unique string
#### storage-type 
 Only AzureFiles is supported currently
#### share-name 
 Pre existing share
#### mount-path 
 Path at which the share will be accessible inside the container. has to be of the format /dir-name. Cannot start with /home.

Additional commands to modify/delete the file share configuration - https://docs.microsoft.com/en-us/cli/azure/webapp/config/storage-account?view=azure-cli-latest#az-webapp-config-storage-account-update


### Uploading the dependencies to Azure Files

One option to upload your dependency into Azure Files is through Azure Portal. Please refer to this [guide](../storage/files/storage-how-to-use-files-portal.md#upload-a-file) for instruction to upload dependencies using portal. 


### Accessing the dependencies in your code

Once your dependencies file is uploaded in the file share, it is time to access your dependencies from your access code. The mounted share will be available at the path specified. Ex: ```/path/to/mount```. The target directory can be accessed by file system APIs.

This example is to access ffmpeg library in Python in HTTP triggered functions

```python
import logging

import azure.functions as func
import subprocess 

FILE_SHARE_MOUNT_PATH = "/azure-files-share"
FFMPEG = "ffmpeg"

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    
    out = subprocess.check_output(["/".join(FILE_SHARE_MOUNT_PATH, FFMPEG) ,'-h'])

    return func.HttpResponse(
            str(out),
            status_code=200
    )
```


## Next steps

+ [Monitoring functions](functions-monitoring.md)
+ [Scale and hosting options](functions-scale.md)
+ [Kubernetes-based serverless hosting](functions-kubernetes-keda.md)
