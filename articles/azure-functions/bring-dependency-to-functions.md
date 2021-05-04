---
title: Bring dependencies or third party library to Azure Functions
description: Learn how to bring files or third party library 
ms.date: 4/6/2020
ms.topic: article
zone_pivot_groups: "bring-third-party-dependency-programming-functions"
---

# Bring dependencies or third party library to Azure Functions

In this article, you learn to bring in third-party dependencies, such as json files, binary files, and machine learning models, into your functions apps.

In this article, you learn how to:
> [!div class="checklist"]
> * Bring in dependencies via Functions Code project 
::: zone pivot="programming-language-python"
> [!div class="checklist"]
> * Bring in dependencies via mounting Azure Fileshare
::: zone-end
## Prerequisites
*  An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio)
* The Azure Functions Core Tools

* [Visual Studio Code](https://code.visualstudio.com/) on one of the [supported platforms](https://code.visualstudio.com/docs/supporting/requirements#_platforms)

* The [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions) for Visual Studio Code. 
::: zone pivot="programming-language-python"
* [Python versions that are supported by Azure Functions](supported-languages.md#languages-by-runtime-version)
* Python Azure functions app deployed on Linux consumption plan. [Create your first Azure function in Python](./create-first-function-vs-code-python.md)
::: zone-end
::: zone pivot="programming-language-java"
* The [Java Developer Kit](/azure/developer/java/fundamentals/java-jdk-long-term-support), version 8 or 11.
* [Apache Maven](https://maven.apache.org), version 3.0 or above.
* The [Java extension pack](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-java-pack) 
* Java Azure functions app deployed on Windows consumption plan. [Create your first Azure function in Java](./create-first-function-vs-code-java.md) 
::: zone-end

## Bring in dependencies from the project directory
::: zone pivot="programming-language-python"
One of the simplest ways to bring in dependencies is to put the files/artifact together with the functions app code in Functions project directory structure. Here is an example of the directory samples in a Python functions project:
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
By putting the dependencies in a folder inside functions app project directory, the dependencies folder will get deployed together with the code. This means that your function code will be able to access the dependencies in the cloud via file system api. 

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

    command = req.params.get('command')
    # If no command specified, set the command to help
    if not command:
        command = "-h"

    # context.function_directory returns the current directory in which functions is executed 
    ffmpeg_path = "/".join([str(context.function_directory), FFMPEG_RELATIVE_PATH])
    
    try:
        byte_output  = subprocess.check_output([ffmpeg_path, command])
        return func.HttpResponse(byte_output.decode('UTF-8').rstrip(),status_code=200)
    except Exception as e:
        return func.HttpResponse("Unexpected exception happened when executing ffmpeg. Error message:" + str(e),status_code=200)
```
>[!NOTE]
> You may need to use `chmod` to provide `Execute` rights to the ffmpeg binary in a Linux environment
::: zone-end

::: zone pivot="programming-language-java"
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
public class Function {
    final static String BASE_PATH = "BASE_PATH";
    final static String FFMPEG_PATH = "/artifacts/ffmpeg/ffmpeg.exe";
    final static String HELP_FLAG = "-h";
    final static String COMMAND_QUERY = "command";

    @FunctionName("HttpExample")
    public HttpResponseMessage run(
            @HttpTrigger(
                name = "req",
                methods = {HttpMethod.GET, HttpMethod.POST},
                authLevel = AuthorizationLevel.ANONYMOUS)
                HttpRequestMessage<Optional<String>> request,
            final ExecutionContext context) throws IOException{
        context.getLogger().info("Java HTTP trigger processed a request.");
            
        // Parse query parameter
        String flags = request.getQueryParameters().get(COMMAND_QUERY);
        
        if (flags == null || flags.isBlank()) {
            flags = HELP_FLAG;
        }

        Runtime rt = Runtime.getRuntime();
        String[] commands = { System.getenv(BASE_PATH) + FFMPEG_PATH, flags};
        Process proc = rt.exec(commands);
        
        BufferedReader stdInput = new BufferedReader(new 
        InputStreamReader(proc.getInputStream()));
   
        String out = stdInput.lines().collect(Collectors.joining("\n"));
        if(out.isEmpty()) {
            BufferedReader stdError = new BufferedReader(new 
                InputStreamReader(proc.getErrorStream()));
            out = stdError.lines().collect(Collectors.joining("\n"));
        }
        return request.createResponseBuilder(HttpStatus.OK).body(out).build();

    }
```
>[!NOTE]
> To get this snippet of code to work in Azure, you need to specify a custom application setting of "BASE_PATH" with value of "/home/site/wwwroot"
::: zone-end


::: zone pivot="programming-language-python"
## Bring dependencies by mounting a file share

When running your function app on Linux, there's another way to bring in third-party dependencies. Functions lets you mount a file share hosted in Azure Files. Consider this approach when you want to decouple dependencies or artifacts from your application code.

First, you need to create an Azure Storage Account. In the account, you also need to create file share in Azure files. To create these resources, please follow this [guide](../storage/files/storage-how-to-use-files-portal.md)

After the storage account and file share are created, use the [az webapp config storage-account add](/cli/azure/webapp/config/storage-account#az_webapp_config_storage_account_add) command to attach the file share to your functions app, as shown in the following example.

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



|       Flag    |  Value     |
| ------------- | ---------------------------------- | 
| custom-id      |  Any unique string |
| storage-type      |  Only AzureFiles is supported currently |
| share-name      |  Pre-existing share |
| mount-path     |   Path at which the share will be accessible inside the container. Value has to be of the format `/dir-name` and it cannot start with `/home` |

Additional commands to modify/delete the file share configuration can be found [here](/cli/azure/webapp/config/storage-account#az-webapp-config-storage-account-update)


### Uploading the dependencies to Azure Files

One option to upload your dependency into Azure Files is through Azure portal. Refer to this [guide](../storage/files/storage-how-to-use-files-portal.md#upload-a-file) for instruction to upload dependencies using portal. Other options to upload your dependencies into Azure Files are through [Azure CLI](../storage/files/storage-how-to-use-files-cli.md#upload-a-file) and [PowerShell](../storage/files/storage-how-to-use-files-powershell.md#upload-a-file).


### Accessing the dependencies in your code

Once your dependencies file is uploaded in the file share, it is time to access your dependencies from your access code. The mounted share will be available at the path specified. Ex: ```/path/to/mount```. The target directory can be accessed by file system APIs.

This example is to access `ffmpeg` library that is stored in Azure file share in HTTP triggered functions

```python
import logging

import azure.functions as func
import subprocess 

FILE_SHARE_MOUNT_PATH = os.environ['FILE_SHARE_MOUNT_PATH']
FFMPEG = "ffmpeg"

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    command = req.params.get('command')
    # If no command specified, set the command to help
    if not command:
        command = "-h"

    try:
        byte_output  = subprocess.check_output(["/".join(FILE_SHARE_MOUNT_PATH, FFMPEG), command])
        return func.HttpResponse(byte_output.decode('UTF-8').rstrip(),status_code=200)
    except Exception as e:
        return func.HttpResponse("Unexpected exception happened when executing ffmpeg. Error message:" + str(e),status_code=200)
```

When you deploy this code to a function app in Azure, you need to [create an app setting](functions-how-to-use-azure-function-app-settings.md#settings) with a key name of `FILE_SHARE_MOUNT_PATH` and value of the mounted file share path, which for this example is `/azure-files-share`. To do local debugging, you need to populate the `FILE_SHARE_MOUNT_PATH` with the file path where your dependencies are stored in your local machine. Here is an example to set `FILE_SHARE_MOUNT_PATH` using `local.settings.json`:

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

+ [Develop Functions in Visual Studio Code](functions-develop-vs-code.md)
+ [Scale and hosting options](functions-scale.md)
