---
title: Develop Azure Functions locally using Core Tools 
description: Learn how to code and test Azure Functions from the command prompt or terminal on your local computer before you deploy them to run them on Azure Functions.
ms.assetid: 242736be-ec66-4114-924b-31795fd18884
ms.topic: conceptual
ms.date: 08/24/2023
ms.custom: devx-track-csharp, 80e4ff38-5174-43, devx-track-extended-java, devx-track-js, devx-track-python
zone_pivot_groups: programming-languages-set-functions
---

# Develop Azure Functions locally using Core Tools

Azure Functions Core Tools lets you develop and test your functions on your local computer. When you're ready, you can also use Core Tools to deploy your code project to Azure and work with application settings.

::: zone pivot="programming-language-csharp"
>You're viewing the C# version of this article. Make sure to select your preferred Functions programming language at the top of the article.
 
If you want to get started right away, complete the [Core Tools quickstart article](create-first-function-cli-csharp.md).
::: zone-end
::: zone pivot="programming-language-java"
>You're viewing the Java version of this article. Make sure to select your preferred Functions programming language at the top of the article.

If you want to get started right away, complete the [Core Tools quickstart article](create-first-function-cli-java.md).
::: zone-end
::: zone pivot="programming-language-javascript"
>You're viewing the JavaScript version of this article. Make sure to select your preferred Functions programming language at the top of the article.
 
If you want to get started right away, complete the [Core Tools quickstart article](create-first-function-cli-node.md).
::: zone-end
::: zone pivot="programming-language-powershell"
>You're viewing the PowerShell version of this article. Make sure to select your preferred Functions programming language at the top of the article.
 
If you want to get started right away, complete the [Core Tools quickstart article](create-first-function-cli-powershell.md).
::: zone-end
::: zone pivot="programming-language-python"
>You're viewing the Python version of this article. Make sure to select your preferred Functions programming language at the top of the article.
 
If you want to get started right away, complete the [Core Tools quickstart article](create-first-function-cli-python.md).
::: zone-end
::: zone pivot="programming-language-typescript"
>You're viewing the TypeScript version of this article. Make sure to select your preferred Functions programming language at the top of the article.
 
If you want to get started right away, complete the [Core Tools quickstart article](create-first-function-cli-typescript.md).
::: zone-end

[!INCLUDE [functions-install-core-tools](../../includes/functions-install-core-tools.md)] 

For help with version-related issues, see [Core Tools versions](#v2).

## Create your local project
::: zone pivot="programming-language-python"  
> [!IMPORTANT]
> For Python, you must run Core Tools commands in a virtual environment. For more information, see [Quickstart: Create a Python function in Azure from the command line](create-first-function-cli-python.md#create-venv).
::: zone-end
In the terminal window or from a command prompt, run the following command to create a project in the `MyProjFolder` folder:

::: zone pivot="programming-language-csharp"
### [Isolated process](#tab/isolated-process)

```console
func init MyProjFolder --worker-runtime dotnet-isolated 
```

By default this command creates a project that runs in-process with the Functons host on the current [Long-Term Support (LTS) version of .NET Core]. You can use the `--target-framework` option to target a specific supported version of .NET, including .NET Framework. For more information, see the [`func init`](functions-core-tools-reference.md#func-init) reference.

### [In-process](#tab/in-process)

```console
func init MyProjFolder --worker-runtime dotnet 
```

This command creates a project that runs on the current [Long-Term Support (LTS) version of .NET Core]. For other .NET version, create an app that runs in an isolated worker process from the Functions host. 

---

For a comparison between the two .NET process models, see the [process mode comparison article](./dotnet-isolated-in-process-differences.md).
::: zone-end
::: zone pivot="programming-language-java"
Java uses a Maven archetype to create the local project, along with your first HTTP triggered function. Rather than using `func init` and `func new`, you should instead follow the steps in the [Command line quickstart](./create-first-function-cli-java.md).  
::: zone-end
::: zone pivot="programming-language-javascript"  
### [v4](#tab/node-v4)
```console
func init MyProjFolder --worker-runtime javascript --model V4
```
### [v3](#tab/node-v3)
```console
func init MyProjFolder --worker-runtime javascript --model V3
```
---

This command creates a JavaScript project that uses the desired [programming model version](functions-reference-node.md).
::: zone-end  
::: zone pivot="programming-language-typescript"   
### [v4](#tab/node-v4)
```console
func init MyProjFolder --worker-runtime typescript --model V4
```
### [v3](#tab/node-v3)
```console
func init MyProjFolder --worker-runtime typescript --model V3
```
---

This command creates a TypeScript project that uses the desired [programming model version](functions-reference-node.md).
::: zone-end  
::: zone pivot="programming-language-powershell"
```console
func init MyProjFolder --worker-runtime powershell
```
::: zone-end
::: zone pivot="programming-language-python"
### [v2](#tab/python-v2)
```console
func init MyProjFolder --worker-runtime python --model V2
```
### [v1](#tab/python-v1)
```console
func init MyProjFolder --worker-runtime python
```
---

This command creates a Python project that uses the desired [programming model version](functions-reference-python.md#programming-model).
::: zone-end

When you run `func init` without the `--worker-runtime` option, you're prompted to choose your project language. To learn more about the available options for the `func init` command, see the [`func init`](functions-core-tools-reference.md#func-init) reference.

## <a name="create-func"></a>Create a function

To add a function to your project, run the `func new` command using the `--template` option to select your trigger template. The following example creates an HTTP trigger named `MyHttpTrigger`:

```
func new --template "Http Trigger" --name MyHttpTrigger
```

This example creates a Queue Storage trigger named `MyQueueTrigger`:

```
func new --template "Azure Queue Storage Trigger" --name MyQueueTrigger
```

The following considerations apply when adding functions:

+ When you run `func new` without the `--template` option, you're prompted to choose a template.

+ Use the [`func templates list`](./functions-core-tools-reference.md#func-templates-list) command to see the complete list of available templates for your language. 

+ When you add a trigger that connects to a service, you'll also need to add an application setting that references a connection string or a managed identity to the local.settings.json file. Using app settings in this way prevents you from having to embed credentials in your code. For more information, see [Work with app settings locally](#local-settings). 
::: zone pivot="programming-language-csharp"  
+ Core Tools also adds a reference to the specific binding extension to your C# project.
::: zone-end

To learn more about the available options for the `func new` command, see the [`func new`](functions-core-tools-reference.md#func-new) reference.

## Add a binding to your function

Functions provides a set of service-specific input and output bindings, which make it easier for your function to connection to other Azure services without having to use the service-specific client SDKs. For more information, see [Azure Functions triggers and bindings concepts](functions-triggers-bindings.md). 
  
To add an input or output binding to an existing function, you must manually update the function definition. 
[!INCLUDE [functions-add-output-binding-example-all-langs](../../includes/functions-add-output-binding-example-all-languages.md)]
The following considerations apply when adding bindings to a function:
::: zone pivot="programming-language-javascript,programming-language-typescript,programming-language-python,programming-language-powershell"
+ For languages that define functions using the _function.json_ configuration file, Visual Studio Code simplifies the process of  adding bindings to an existing function definition. For more information, see [Connect functions to Azure services using bindings](add-bindings-existing-function.md#visual-studio-code). 
::: zone-end 
+ When you add bindings that connect to a service, you must also add an application setting that references a connection string or managed identity to the local.settings.json file. For more information, see [Work with app settings locally](#local-settings).  
::: zone pivot="programming-language-java,programming-language-javascript,programming-language-typescript,programming-language-powershell"
+ When you add a supported binding, the extension should already be installed when your app uses extension bundle. For more information, see [extension bundles](functions-bindings-register.md#extension-bundles).
::: zone-end  
::: zone pivot="programming-language-csharp"  
+ When you add a binding that requires a new binding extension, you must also add a reference to that specific binding extension in your C# project. 
::: zone-end  
::: zone pivot="programming-language-csharp" 
For more information, including links to example binding code that you can refer to, see [Add bindings to a function](add-bindings-existing-function.md?tabs=csharp#manually-add-bindings-based-on-examples).  
::: zone-end  
::: zone pivot="programming-language-java"
For more information, including links to example binding code that you can refer to, see [Add bindings to a function](add-bindings-existing-function.md?tabs=java#manually-add-bindings-based-on-examples).  
::: zone-end  
::: zone pivot="programming-language-javascript"
For more information, including links to example binding code that you can refer to, see [Add bindings to a function](add-bindings-existing-function.md?tabs=javascript#manually-add-bindings-based-on-examples).   
::: zone-end  
::: zone pivot="programming-language-powershell"  
For more information, including links to example binding code that you can refer to, see [Add bindings to a function](add-bindings-existing-function.md?tabs=powershell#manually-add-bindings-based-on-examples).   
::: zone-end  
::: zone pivot="programming-language-python"  
For more information, including links to example binding code that you can refer to, see [Add bindings to a function](add-bindings-existing-function.md?tabs=python#manually-add-bindings-based-on-examples).   
::: zone-end
::: zone pivot="programming-language-typescript"
For more information, including links to example binding code that you can refer to, see [Add bindings to a function](add-bindings-existing-function.md?tabs=typescript#manually-add-bindings-based-on-examples).   
::: zone-end 


## <a name="start"></a>Start the Functions runtime

Before you can run or debug the functions in your project, you need to start the Functions host from the root directory of your project. The host enables triggers for all functions in the project. Use this command to start the local runtime:

::: zone pivot="programming-language-java"  
```
mvn clean package 
mvn azure-functions:run
```
::: zone-end  
::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-powershell,programming-language-python"  
```
func start
```
::: zone-end  
::: zone pivot="programming-language-typescript"  
```
npm install
npm start     
```
::: zone-end
::: zone pivot="programming-language-python" 
This command must be [run in a virtual environment](./create-first-function-cli-python.md).
::: zone-end  

When the Functions host starts, it outputs a list of functions in the project, including the URLs of any HTTP-triggered functions, like in this example:

<pre>
Found the following functions:
Host.Functions.MyHttpTrigger

Job host started
Http Function MyHttpTrigger: http://localhost:7071/api/MyHttpTrigger
</pre>

Keep in mind the following considerations when running your functions locally:

+ By default, authorization isn't enforced locally for HTTP endpoints. This means that all local HTTP requests are handled as `authLevel = "anonymous"`. For more information, see the [HTTP binding article](functions-bindings-http-webhook-trigger.md#authorization-keys). You can use the `--enableAuth` option to require authorization when running locally. For more information, see [`func start`](./functions-core-tools-reference.md?tabs=v2#func-start)

+ While there's local storage emulation available, it's often best to validate your triggers and bindings against live services in Azure. You can maintain the connections to these services in the local.settings.json project file. For more information, see [Local settings file](functions-develop-local.md#local-settings-file). Make sure to keep test and production data separate when testing against live Azure services. 

+ You can trigger non-HTTP functions locally without connecting to a live service. For more information, see [Run a local function](./functions-run-local.md?tabs=non-http-trigger#run-a-local-function).

+ When you include your Application Insights connection information in the local.settings.json file, local log data is written to the specific Application Insights instance. To keep local telemetry data separate from production data, consider using a separate Application Insights instance for development and testing.
::: zone pivot="programming-language-csharp,programming-language-javascript"
+ When using version 1.x of the Core Tools, instead use the `func host start` command to start the local runtime.
::: zone-end 

## Run a local function

With your local Functions host (func.exe) running, you can now trigger individual functions to run and debug your function code. The way in which you execute an individual function depends on its trigger type.

> [!NOTE]  
> Examples in this topic use the cURL tool to send HTTP requests from the terminal or a command prompt. You can use a tool of your choice to send HTTP requests to the local server. The cURL tool is available by default on Linux-based systems and Windows 10 build 17063 and later. On older Windows, you must first download and install the [cURL tool](https://curl.haxx.se/).

### [HTTP trigger](#tab/http-trigger)

HTTP triggers are started by sending an HTTP request to the local endpoint and port as displayed in the func.exe output, which has this general format: 

```
http://localhost:<PORT>/api/<FUNCTION_NAME>
```

In this URL template, `<FUNCTION_NAME>` is the name of the function or route and `<PORT>` is the local port on which func.exe is listening.  

For example, this cURL command triggers the `MyHttpTrigger` quickstart function from a GET request with the _name_ parameter passed in the query string:

```
curl --get http://localhost:7071/api/MyHttpTrigger?name=Azure%20Rocks
```

This example is the same function called from a POST request passing _name_ in the request body, shown for both Bash shell and Windows command line:

```bash
curl --request POST http://localhost:7071/api/MyHttpTrigger --data '{"name":"Azure Rocks"}'
```

```cmd
curl --request POST http://localhost:7071/api/MyHttpTrigger --data "{'name':'Azure Rocks'}"
```

The following considerations apply when calling HTTP endpoints locally:

+ You can make GET requests from a browser passing data in the query string. For all other HTTP methods, you must use cURL, Fiddler, Postman, or a similar HTTP testing tool that supports POST requests.

+ Make sure to use the same server name and port that the Functions host is listening on. You see an endpoint like this in the output generated when starting the Function host. You can call this URL using any HTTP method supported by the trigger.

### [Non-HTTP trigger](#tab/non-http-trigger)

There are two ways to execute non-HTTP triggers locally. First, you can connect to live Azure services, such as Azure Storage and Azure Service Bus. This directly mirrors the behavior of your function when running in Azure. When using live services, make sure to include the required named connection strings in the [local settings file](#local-settings). You may consider using a different service connection during development than you do in production by using a different connection string in the local.settings.json file than you use in the function app settings in Azure.

Event Grid triggers require extra configuration to run locally.

You can also run a non-HTTP function locally using REST by calling a special endpoint called an _administrator endpoint_. Use this format to call the `admin` endpoint and trigger a specific non-HTTP function:

```
http://localhost:<PORT>/admin/functions/<FUNCTION_NAME>
```

In this URL template, `<FUNCTION_NAME>` is the name of the function or route and `<PORT>` is the local port on which func.exe is listening.

You can optionally pass test data to the execution in the body of the POST request. To pass test data, you must supply the data in the body of a POST request message, which has this JSON format:

```JSON
{
    "input": "<TRIGGER_INPUT>"
}
```

The `<TRIGGER_INPUT>` value contains data in a format expected by the function. This cURL example is shown for both Bash shell and Windows command line: 

```bash
curl --request POST -H "Content-Type:application/json" --data '{"input":"sample queue data"}' http://localhost:7071/admin/functions/QueueTrigger
```

```cmd
curl --request POST -H "Content-Type:application/json" --data "{'input':'sample queue data'}" http://localhost:7071/admin/functions/QueueTrigger
```

The previous examples generate a POST request that passes a string `sample queue data` to a function named `QueueTrigger` function, which simulates data arriving in the queue and triggering the function

The following considerations apply when using the administrator endpoint for local testing:

+ You can call the `functions` administrator endpoint (`http://localhost:{port}/admin/functions/`) to return a list of administrator URLs for all available functions, both HTTP triggered and non-HTTP triggered.

+ Authentication and authorization are bypassed when running locally. The same APIs exist in Azure, but when you try to call the same administrator endpoints in Azure, you must provide an access key. To learn more, see [Function access keys](functions-bindings-http-webhook-trigger.md#authorization-keys). 

+ Access keys are valuable shared secrets. When used locally, they must be securely stored outside of source control. Because authentication and authorization aren't required by Functions when running locally, you should avoid using and storing access keys unless your scenarios require it.

+ Calling an administrator endpoint and passing test data is similar to using the **Test** tab in the Azure portal.

### [Event Grid trigger](#tab/event-grid-trigger)

Event Grid triggers have specific requirements to enable local testing. For more information, see [Local testing with viewer web app](event-grid-how-tos.md#local-testing-with-viewer-web-app).

---

## <a name="publish"></a>Publish to Azure

The Azure Functions Core Tools supports three types of deployment:

| Deployment type | Command | Description |
| ----- | ----- | ----- |
| Project files | [`func azure functionapp publish`](functions-core-tools-reference.md#func-azure-functionapp-publish) | Deploys function project files directly to your function app using [zip deployment](functions-deployment-technologies.md#zip-deploy). |
| Azure Container Apps | `func azurecontainerapps deploy` | Deploys a containerized function app to an existing Container Apps environment. |
| Kubernetes cluster | `func kubernetes deploy` | Deploys your Linux function app as a custom Docker container to a Kubernetes cluster. | 

You must have either the [Azure CLI](/cli/azure/install-azure-cli) or [Azure PowerShell](/powershell/azure/install-azure-powershell) installed locally to be able to publish to Azure from Core Tools. By default, Core Tools uses these tools to authenticate with your Azure account. 

If you don't have these tools installed, you need to instead [get a valid access token](/cli/azure/account#az-account-get-access-token) to use during deployment. You can present an access token using the `--access-token` option in the deployment commands.  

## <a name="project-file-deployment"></a>Deploy project files

::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-powershell,programming-language-python,programming-language-typescript"
To publish your local code to a function app in Azure, use the [`func azure functionapp publish publish`](./functions-core-tools-reference.md#func-azure-functionapp-publish) command, as in the following example:

```
func azure functionapp publish <FunctionAppName>
```

This command publishes project files from the current directory to the `<FunctionAppName>` as a .zip deployment package. If the project requires compilation, it's done remotely during deployment. 
::: zone-end
::: zone pivot="programming-language-java"
Java uses Maven to publish your local project to Azure instead of Core Tools. Use the following Maven command to publish your project to Azure: 

```
mvn azure-functions:deploy
```

When you run this command, Azure resources are created during the initial deployment based on the settings in your _pom.xml_ file. For more information, see [Deploy the function project to Azure](create-first-function-cli-java.md#deploy-the-function-project-to-azure).
::: zone-end  
::: zone pivot="programming-language-csharp,programming-language-javascript,programming-language-powershell,programming-language-python,programming-language-typescript"  
The following considerations apply to this kind of deployment:

+ Publishing overwrites existing files in the remote function app deployment.

+ You must have already [created a function app in your Azure subscription](functions-cli-samples.md#create). Core Tools deploys your project code to this function app resource. To learn how to create a function app from the command prompt or terminal window using the Azure CLI or Azure PowerShell, see [Create a Function App for serverless execution](./scripts/functions-cli-create-serverless.md). You can also [create these resources in the Azure portal](./functions-create-function-app-portal.md#create-a-function-app). You get an error when you try to publish to a `<FunctionAppName>` that doesn't exist in your subscription. 

+ A project folder may contain language-specific files and directories that shouldn't be published. Excluded items are listed in a .funcignore file in the root project folder. 

+ By default, your project is deployed so that it [runs from the deployment package](run-functions-from-deployment-package.md). To disable this recommended deployment mode, use the [`--nozip` option][func azure functionapp publish]. 

+ A [remote build](functions-deployment-technologies.md#remote-build) is performed on compiled projects. This can be controlled by using the [`--no-build` option][func azure functionapp publish].  

+ Use the [`--publish-local-settings`][func azure functionapp publish] option to automatically create app settings in your function app based on values in the local.settings.json file.  

+ To publish to a specific named slot in your function app, use the [`--slot` option](functions-core-tools-reference.md#func-azure-functionapp-publish). 
::: zone-end

## Deploy containers

Core Tools lets you deploy your [containerized function app](functions-create-container-registry.md) to both managed Azure Container Apps environments and Kubernetes clusters that you manage. 

### [Container Apps](#tab/container-apps)    

Use the following [`func azurecontainerapps deploy`](./functions-core-tools-reference.md#func-azurecontainerapps-deploy) command to deploy an existing container image to a Container Apps environment:

```command
func azurecontainerapps deploy --name <APP_NAME> --environment <ENVIRONMENT_NAME> --storage-account <STORAGE_CONNECTION> --resource-group <RESOURCE_GROUP> --image-name <IMAGE_NAME> [--registry-password] [--registry-server] [--registry-username]

```

When you deploy to an Azure Container Apps environment, the following considerations apply:

+ The environment and storage account must already exist. The storage account connection string you provide is used by the deployed function app.

+ You don't need to create a separate function app resource when deploying to Container Apps.   

+ Storage connection strings and other service credentials are important secrets. Make sure to securely store any script files using `func azurecontainerapps deploy` and don't store them in any publicly accessible source control systems. You can [encrypt the local.settings.json file](#encrypt-the-local-settings-file) for added security.

For more information, see [Azure Container Apps hosting of Azure Functions](functions-container-apps-hosting.md). 

### [Kubernetes cluster](#tab/kubernetes)

The following [`func kubernetes deploy`](./functions-core-tools-reference.md#func-kubernetes-deploy) command uses the Dockerfile to generate a container in the specified registry and deploy it to the default Kubernetes cluster. 

```command
func kubernetes deploy --name <DEPLOYMENT_NAME> --registry <REGISTRY_USERNAME> 
```

Azure Functions on Kubernetes using KEDA is an open-source effort that you can use free of cost. Best-effort support is provided by contributors and from the community. To learn more, see [Deploying a function app to Kubernetes](functions-kubernetes-keda.md#deploying-a-function-app-to-kubernetes). 

---  

[!INCLUDE [functions-local-settings-file](../../includes/functions-local-settings-file.md)]

The following considerations apply when working with the local settings file:

+ Because the local.settings.json may contain secrets, such as connection strings, you should never store it in a remote repository. Core Tools helps you encrypt this local settings file for improved security. For more information, see [Local settings file](functions-develop-local.md#local-settings-file). You can also [encrypt the local.settings.json file](#encrypt-the-local-settings-file) for added security. 

+ By default, local settings aren't migrated automatically when the project is published to Azure. Use the [`--publish-local-settings`][func azure functionapp publish] option when you publish your project files to make sure these settings are added to the function app in Azure. Values in the `ConnectionStrings` section are never published. You can also [upload settings from the local.settings.json file](#upload-local-settings-to-azure) at any time. 

+ You can download and overwrite settings in your local.settings.json file with settings from your function app in Azure. For more information, see [Download application settings](#download-application-settings).   
::: zone pivot="programming-language-csharp"
+ The function app settings values can also be read in your code as environment variables. For more information, see [Environment variables](functions-dotnet-class-library.md#environment-variables).
::: zone-end
::: zone pivot="programming-language-java"
+ The function app settings values can also be read in your code as environment variables. For more information, see [Environment variables](functions-reference-java.md#environment-variables).
::: zone-end
::: zone pivot="programming-language-javascript,programming-language-typescript"
+ The function app settings values can also be read in your code as environment variables. For more information, see [Environment variables](functions-reference-node.md#environment-variables).
::: zone-end
::: zone pivot="programming-language-powershell"
+ The function app settings values can also be read in your code as environment variables. For more information, see [Environment variables](functions-reference-powershell.md#environment-variables).
::: zone-end
::: zone pivot="programming-language-python"
+ The function app settings values can also be read in your code as environment variables. For more information, see [Environment variables](functions-reference-python.md#environment-variables).
::: zone-end

+ When no valid storage connection string is set for [`AzureWebJobsStorage`](functions-app-settings.md#azurewebjobsstorage) and a local storage emulator isn't being used, an error is shown. You can use Core Tools to [download a specific connection string](#download-a-storage-connection-string) from any of your Azure Storage accounts.

### Download application settings

From the project root, use the following command to download all application settings from the `myfunctionapp12345` app in Azure:

```command
func azure functionapp fetch-app-settings myfunctionapp12345
```

This command overwrites any existing settings in the local.settings.json file with values from Azure. When not already present, new items are added to the collection. For more information, see the [`func azure functionapp fetch-app-settings`](functions-core-tools-reference.md#func-azure-functionapp-fetch-app-settings) command.

### Download a storage connection string

Core Tools also make it easy to get the connection string of any storage account to which you have access. From the project root, use the following command to download the connection string from a storage account named `mystorage12345`.   

```command
func azure storage fetch-connection-string mystorage12345
```

This command adds a setting named `mystorage12345_STORAGE` to the local.settings.json file, which contains the connection string for the `mystorage12345` account. For more information, see the [`func azure storage fetch-connection-string`](functions-core-tools-reference.md#func-azure-storage-fetch-connection-string) command. 

For improved security during development, consider [encrypting the local.settings.json file](#encrypt-the-local-settings-file). 

### Upload local settings to Azure

When you publish your project files to Azure without using the `--publish-local-settings` option, settings in the local.settings.json file aren't set in your function app. You can always rerun the `func azure functionapp publish` with the `--publish-settings-only` option to upload just the settings without republishing the project files. 

The following example uploads just settings from the `Values` collection in the local.settings.json file to the function app in Azure named `myfunctionapp12345`:

```command
func azure functionapp publish myfunctionapp12345 --publish-settings-only
```

### Encrypt the local settings file

To improve security of connection strings and other valuable data in your local settings, Core Tools lets you encrypt the local.settings.json file. When this file is encrypted, the runtime automatically decrypts the settings when needed the same way it does with application setting in Azure. You can also decrypt a locally encrypted file to work with the settings.

Use the following command to encrypt the local settings file for the project:

```command
func settings encrypt
```

Use the following command to decrypt an encrypted local setting, so that you can work with it:

```command
func settings decrypt
``` 

When the settings file is encrypted and decrypted, the file's `IsEncrypted` setting also gets updated.

## Configure binding extensions

[Functions triggers and bindings](functions-triggers-bindings.md) are implemented as .NET extension (NuGet) packages. To be able to use a specific binding extension, that extension must be installed in the project.

::: zone pivot="programming-language-javascript,programming-language-csharp"
This section doesn't apply to version 1.x of the Functions runtime. In version 1.x, supported binding were included in the core product extension.
::: zone-end

::: zone pivot="programming-language-csharp"
For C# class library projects, add references to the specific NuGet packages for the binding extensions required by your functions. C# script (.csx) project must use [extension bundles](functions-bindings-register.md#extension-bundles).
::: zone-end
::: zone pivot="programming-language-java,programming-language-javascript,programming-language-powershell,programming-language-python,programming-language-typescript"
Functions provides _extension bundles_ to make is easy to work with binding extensions in your project. Extension bundles, which are versioned and defined in the host.json file, install a complete set of compatible binding extension packages for your app. Your host.json should already have extension bundles enabled. If for some reason you need to add or update the extension bundle in the host.json file, see [Extension bundles](functions-bindings-register.md#extension-bundles).

If you must use a binding extension or an extension version not in a supported bundle, you need to manually install extensions. For such rare scenarios, see the [`func extensions install`](./functions-core-tools-reference.md#func-extensions-install) command.
::: zone-end

## <a name="v2"></a>Core Tools versions

Major versions of Azure Functions Core Tools are linked to specific major versions of the Azure Functions runtime. For example, version 4.x of Core Tools supports version 4.x of the Functions runtime. This version is the recommended major version of both the Functions runtime and Core Tools. You can determine the latest release version of Core Tools in the [Azure Functions Core Tools repository](https://github.com/Azure/azure-functions-core-tools/releases/latest).

Run the following command to determine the version of your current Core Tools installation:

```command
func --version
``` 

Unless otherwise noted, the examples in this article are for version 4.x. 

The following considerations apply to Core Tools installations:

+ You can only install one version of Core Tools on a given computer. 

+ When upgrading to the latest version of Core Tools, you should use the same method that you used for original installation to perform the upgrade. For example, if you used an MSI on Windows, uninstall the current MSI and install the latest one. Or if you used npm, rerun the `npm  install command`.  

+ Version 2.x and 3.x of Core Tools were used with versions 2.x and 3.x of the Functions runtime, which have reached their end of life (EOL). For more information, see [Azure Functions runtime versions overview](functions-versions.md).  
::: zone pivot="programming-language-csharp,programming-language-javascript"  
+ Version 1.x of Core Tools is required when using version 1.x of the Functions Runtime, which is still supported. This version of Core Tools can only be run locally on Windows computers. If you're currently running on version 1.x, you should consider [migrating your app to version 4.x](migrate-version-1-version-4.md) today.
::: zone-end  

[!INCLUDE [functions-x86-emulation-on-arm64](../../includes/functions-x86-emulation-on-arm64.md)]

When using Visual Studio Code, you can integrate Rosetta with the built-in Terminal. For more information, see [Enable emulation in Visual Studio Code](./functions-develop-vs-code.md#enable-emulation-in-visual-studio-code). 

## Next steps

Learn how to [develop, test, and publish Azure functions by using Azure Functions core tools](/training/modules/develop-test-deploy-azure-functions-with-core-tools/). Azure Functions Core Tools is [open source and hosted on GitHub](https://github.com/azure/azure-functions-cli). To file a bug or feature request, [open a GitHub issue](https://github.com/azure/azure-functions-cli/issues).

<!-- LINKS -->

[extension bundles]: functions-bindings-register.md#extension-bundles
[func azure functionapp publish]: functions-core-tools-reference.md?tabs=v2#func-azure-functionapp-publish


[Long-Term Support (LTS) version of .NET Core]: https://dotnet.microsoft.com/platform/support/policy/dotnet-core#lifecycle