---
title: Bring dependencies or third party library to Azure Functions
description: Learn how to bring files or third party library 
ms.date: 4/6/2020
ms.topic: tutorial
ms.custom: "devx-track-python, devx-track-java"
zone_pivot_groups: programming-languages-set-functions-full
---

# Bring dependencies or third party library to Azure Functions

In this tutorial, you learn to bring in third party dependencies, such as json files, binary files, and machine learning models, into your functions apps. Completing this tutorial might incur costs of a few US dollars in your Azure account for the potential storage cost, which you can minimize by cleaning-up resources when you're done.

In this tutorial, you learn how to:
> [!div class="checklist"]
> * Bring in dependencies via Functions Code project 
> * Bring in dependencies via mounting Azure Fileshare

## Prerequisites
* An Azure account with an active subscription. Create an account for free.
* The Azure Functions Core Tools
* Visual Studio Code on one of the supported platforms.
* The Python extension for Visual Studio Code.*
* The Azure Functions extension for Visual Studio Code.
* Local Functions project setup with 1 HTTP Triggered function created. To learn more, **TODO** link to the vs code tutorial


## Bring Dependencies by putting them in Azure Functions Project Directory
One of the simplest ways to bring in dependencies is to put the files/artifact together with the functions app code in functions project directory structure. Here is an example of the directory samples in a Python functions project:
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
By putting the dependencies in a folder inside functions app project directory, the dependencies folder will get deployed together with the code.This means that your function code will be able to access the dependencies in the cloud via file system api. 

### Accessing the dependencies in your code

Here is an example to access and execute ```ffmpeg``` dependency that is put into ```<project_root>/ffmpeg_lib``` directory. 


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
>[!NOTE]
> You may need to use `chmod` to provide `Execute` rights to the ffmpeg binary in a Linux environment

::: zone pivot="devx-track-java"
## Bring Dependencies by putting them in Azure Functions Project Directory
One of the simplest ways to bring in dependencies is to put the files/artifact together with the functions app code in functions project directory structure. Here is an example of the directory samples in a Java functions project:
```
<project_root>/
 | - src/
 | | - main/java/com/function
 | | | - Function.java
 | | - test/java/com/function
 | - artifacts/
 | | - dependency1
 | - host.json
 | - local.settings.json
 | - pom.xml
```
For java specifically, you need to specifically include the artifacts into the build/target folder when copying resources. Here is an example on how to do it in Maven:

```xml
...
<execution>
    <id>copy-resources</id>
    <phase>package</phase>
    <goals>
        <goal>copy-resources</goal>
    </goals>
    <configuration>
        <overwrite>true</overwrite>
        <outputDirectory>${stagingDirectory}</outputDirectory>
        <resources>
            <resource>
                <directory>${project.basedir}</directory>
                <includes>
                    <include>host.json</include>
                    <include>local.settings.json</include>
                    <include>artifacts/**</include>
                </includes>
            </resource>
        </resources>
    </configuration>
</execution>
...
```
By putting the dependencies in a folder inside functions app project directory, the dependencies folder will get deployed together with the code.This means that your function code will be able to access the dependencies in the cloud via file system api. 

### Accessing the dependencies in your code

Here is an example to access and execute ```ffmpeg``` dependency that is put into ```<project_root>/ffmpeg_lib``` directory. 


```java
package com.function;

import com.microsoft.azure.functions.ExecutionContext;
import com.microsoft.azure.functions.HttpMethod;
import com.microsoft.azure.functions.HttpRequestMessage;
import com.microsoft.azure.functions.HttpResponseMessage;
import com.microsoft.azure.functions.HttpStatus;
import com.microsoft.azure.functions.annotation.AuthorizationLevel;
import com.microsoft.azure.functions.annotation.FunctionName;
import com.microsoft.azure.functions.annotation.HttpTrigger;

import java.util.*;
import java.nio.file.Files;
import java.io.File;
import java.io.IOException;
/**
 * Azure Functions with HTTP Trigger.
 */
public class Function {
    public final static String BASE_PATH = "BASE_PATH";
    public final static String FFMPEG_EXE_PATH = "/artifacts/ffmpeg/ffmpeg.exe";

    @FunctionName("HttpExample")
    public HttpResponseMessage run(
            @HttpTrigger(
                name = "req",
                methods = {HttpMethod.GET, HttpMethod.POST},
                authLevel = AuthorizationLevel.ANONYMOUS)
                HttpRequestMessage<Optional<String>> request,
            final ExecutionContext context) throws IOException{
        context.getLogger().info("Java HTTP trigger processed a request.");

        Runtime rt = Runtime.getRuntime();
        // Getting the base path of the execution from the environment variables
        String[] commands = { System.getenv(BASE_PATH) + FFMPEG_EXE_PATH, "-h"};
        Process proc = rt.exec(commands);

        if (name == null) {
            return request.createResponseBuilder(HttpStatus.BAD_REQUEST).body("successful").build();
        } else {
            return request.createResponseBuilder(HttpStatus.OK).body("Hello, " + name).build();
        }
    }
}

```
>[!NOTE]
> To get this snippet of code to work in Azure, you need to specify a custom application setting of "BASE_PATH" with value of "/home/site/wwwroot"
::: zone-end


::: zone pivot="devx-track-python"
## Bring dependencies by mounting a file share

Another way to bring in 3rd party dependency, available in Linux offering, is to utilize Azure Functions feature to mount a file share using Azure Files. This might be appropriate if you want to decouple dependencies or artifacts from your application code.

First, you need to create a Azure Storage Account. In the account, you also need to create file share in Azure files. To create these resources, please follow this [guide](../storage/files/storage-how-to-use-files-portal.md)

Once the storage account and file share are created, using Az CLI , execute the following command to attach the file share to your functions app.

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

Additional commands to modify/delete the file share configuration can be found [here](https:///cli/azure/webapp/config/storage-account?view=azure-cli-latest#az-webapp-config-storage-account-update)


### Uploading the dependencies to Azure Files

One option to upload your dependency into Azure Files is through Azure Portal. Please refer to this [guide](../storage/files/storage-how-to-use-files-portal.md#upload-a-file) for instruction to upload dependencies using portal. 


### Accessing the dependencies in your code

Once your dependencies file is uploaded in the file share, it is time to access your dependencies from your access code. The mounted share will be available at the path specified. Ex: ```/path/to/mount```. The target directory can be accessed by file system APIs.

This example is to access `ffmpeg` library that is stored in azure file share in HTTP triggered functions

```python
import logging

import azure.functions as func
import subprocess 

FILE_SHARE_MOUNT_PATH = os.environ['FILE_SHARE_MOUNT_PATH']
FFMPEG = "ffmpeg"

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    
    out = subprocess.check_output(["/".join(FILE_SHARE_MOUNT_PATH, FFMPEG) ,'-h'])

    return func.HttpResponse(
            str(out),
            status_code=200
    )
```

When you deploy this code snippet to Azure, you need to configure a custom app setting with key of "FILE_SHARE_MOUNT_PATH" and value of the mounted file share path e.g. `/azure-files-share`. To do local debugging, you need to populate the `FILE_SHARE_MOUNT_PATH` with the file path where your dependencies are stored in your local machine. Here is an example to set `FILE_SHARE_MOUNT_PATH` using `local.settings.json`:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "python",
    "FILE_SHARE_MOUNT_PATH" : "PATH_TO_LOCAL_FFMPEG_DIR"
  }
}

```
::: zone-end



## Next steps

+ [Monitoring functions](functions-monitoring.md)
+ [Scale and hosting options](functions-scale.md)
+ [Kubernetes-based serverless hosting](functions-kubernetes-keda.md)
