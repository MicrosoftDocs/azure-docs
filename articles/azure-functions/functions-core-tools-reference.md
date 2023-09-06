---
title: Azure Functions Core Tools reference 
description: Reference documentation that supports the Azure Functions Core Tools (func.exe).
ms.topic: reference
ms.date: 08/20/2023
---

# Azure Functions Core Tools reference

This article provides reference documentation for the Azure Functions Core Tools, which lets you develop, manage, and deploy Azure Functions projects from your local computer. To learn more about using Core Tools, see [Work with Azure Functions Core Tools](functions-run-local.md). 

Core Tools commands are organized into the following contexts, each providing a unique set of actions.

| Command context | Description |
| ----- | ----- |
| [`func`](#func-init) | Commands used to create and run functions on your local computer. |
| [`func azure`](#func-azure-functionapp-fetch-app-settings) | Commands for working with Azure resources, including publishing. |
| [`func azurecontainerapps`](#func-azurecontainerapps-deploy) | Deploy containerized function app to Azure Container Apps. |
| [`func durable`](#func-durable-delete-task-hub)    | Commands for working with [Durable Functions](./durable/durable-functions-overview.md). |
| [`func extensions`](#func-extensions-install) | Commands for installing and managing extensions. |
| [`func kubernetes`](#func-kubernetes-deploy) | Commands for working with Kubernetes and Azure Functions. |
| [`func settings`](#func-settings-decrypt)   | Commands for managing environment settings for the local Functions host. |
| [`func templates`](#func-templates-list)  | Commands for listing available function templates. |

Before using the commands in this article, you must [install the Core Tools](functions-run-local.md#install-the-azure-functions-core-tools). 

## func init 

Creates a new Functions project in a specific language.

```command
func init <PROJECT_FOLDER>
```

When you supply `<PROJECT_FOLDER>`, the project is created in a new folder with this name. Otherwise, the current folder is used.

`func init` supports the following options, which don't support version 1.x unless otherwise noted:

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--csx`** | Creates .NET functions as C# script, which is the version 1.x behavior. Valid only with `--worker-runtime dotnet`. |
| **`--docker`** | Creates a Dockerfile for a container using a base image that is based on the chosen `--worker-runtime`. Use this option when you plan to deploy a containerized function app. |
| **`--docker-only`** |  Adds a Dockerfile to an existing project. Prompts for the worker-runtime if not specified or set in local.settings.json. Use this option when you plan to deploy a containerized function app and the project already exists. |
| **`--force`** | Initialize the project even when there are existing files in the project. This setting overwrites existing files with the same name. Other files in the project folder aren't affected. |
| **`--language`** | Initializes a language-specific project. Currently supported when `--worker-runtime` set to `node`. Options are `typescript` and `javascript`. You can also use `--worker-runtime javascript` or `--worker-runtime typescript`.  |
| **`--managed-dependencies`**  | Installs managed dependencies. Currently, only the PowerShell worker runtime supports this functionality. |
| **`--model`** | Sets the desired programming model for a target language when more than one model is available. Supported options are `V1` and `V2` for Python and `V3` and `V4` for Node.js. For more information, see the [Python developer guide](functions-reference-python.md#programming-model) and the [Node.js developer guide](functions-reference-node.md), respectively. |
| **`--source-control`** | Controls whether a git repository is created. By default, a repository isn't created. When `true`, a repository is created. |
| **`--worker-runtime`** | Sets the language runtime for the project. Supported values are: `csharp`, `dotnet`, `dotnet-isolated`, `javascript`,`node` (JavaScript), `powershell`, `python`, and `typescript`. For Java, use [Maven](functions-reference-java.md#create-java-functions). To generate a language-agnostic project with just the project files, use `custom`. When not set, you're prompted to choose your runtime during initialization. |
| **`--target-framework`** | Sets the target framework for the function app project. Valid only with `--worker-runtime dotnet-isolated`. Supported values are: `net6.0` (default), `net7.0`, and `net48` (.NET Framework 4.8). |
|

> [!NOTE]
> When you use either `--docker` or `--dockerfile` options, Core Tools automatically create the Dockerfile for C#, JavaScript, Python, and PowerShell functions. For Java functions, you must manually create the Dockerfile. For more information, see [Creating containerized function apps](functions-how-to-custom-container.md#creating-containerized-function-apps).

## func logs

Gets logs for functions running in a Kubernetes cluster.

```
func logs --platform kubernetes --name <APP_NAME>
``` 

The `func logs` action supports the following options:

| Option     | Description                            |
| ------------------------------------------ | -------------------------------------- |
| **`--platform`** | Hosting platform for the function app. Supported options: `kubernetes`. |
| **`--name`** | Function app name in Azure. |

To learn more, see [Azure Functions on Kubernetes with KEDA](functions-kubernetes-keda.md).

## func new

Creates a new function in the current project based on a template.

```
func new
``` 

When you run `func new` without the `--template` option, you're prompted to choose a template. In version 1.x, you're also required to choose the language. 

The `func new` action supports the following options:

| Option     | Description                            |
| ------------------------------------------ | -------------------------------------- |
| **`--authlevel`** | Lets you set the authorization level for an HTTP trigger. Supported values are: `function`, `anonymous`, `admin`. Authorization isn't enforced when running locally. For more information, see the [HTTP binding article](functions-bindings-http-webhook-trigger.md#authorization-keys). |
| **`--csx`** | (Version 2.x and later versions.) Generates the same C# script (.csx) templates used in version 1.x and in the portal. |
| **`--language`**, **`-l`**| The template programming language, such as C#, F#, or JavaScript. This option is required in version 1.x. In version 2.x and later versions, you don't use this option because the language is defined by the worker runtime. |
| **`--name`**, **`-n`** | The function name. |
| **`--template`**, **`-t`** | Use the `func templates list` command to see the complete list of available templates for each supported language.   |

To learn more, see [Create a function](functions-run-local.md#create-func).

## func run

*Version 1.x only.*

Enables you to invoke a function directly, which is similar to running a function using the **Test** tab in the Azure portal. This action is only supported in version 1.x. For later versions, use `func start` and [call the function endpoint directly](functions-run-local.md#run-a-local-function).

```command
func run
```

The `func run` action supports the following options:

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--content`** | Inline content passed to the function. |
| **`--debug`** | Attach a debugger to the host process before running the function.|
| **`--file`** | The file name to use as content.|
| **`--no-interactive`** | Doesn't prompt for input, which is useful for automation scenarios.|
| **`--timeout`** | Time to wait (in seconds) until the local Functions host is ready.|

For example, to call an HTTP-triggered function and pass content body, run the following command:

```
func run MyHttpTrigger --content '{\"name\": \"Azure\"}'
```

## func start

Starts the local runtime host and loads the function project in the current folder. 

The specific command depends on the [runtime version](functions-versions.md).   

# [v2.x+](#tab/v2)

```command
func start
```

`func start` supports the following options:

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--cert`** | The path to a .pfx file that contains a private key. Only supported with `--useHttps`. |
| **`--cors`** | A comma-separated list of CORS origins, with no spaces. |
| **`--cors-credentials`** | Allow cross-origin authenticated requests using cookies and the Authentication header. |
| **`--dotnet-isolated-debug`** | When set to `true`, pauses the .NET worker process until a debugger is attached from the .NET isolated project being debugged. |
| **`--enable-json-output`** | Emits console logs as JSON, when possible. |
| **`--enableAuth`** | Enable full authentication handling pipeline, with authorization requirements. |
| **`--functions`** | A space-separated list of functions to load. |
| **`--language-worker`** | Arguments to configure the language worker. For example, you may enable debugging for language worker by providing [debug port and other required arguments](https://github.com/Azure/azure-functions-core-tools/wiki/Enable-Debugging-for-language-workers). |
| **`--no-build`** | Don't build the current project before running. For .NET class projects only. The default is `false`.  |
| **`--password`** | Either the password or a file that contains the password for a .pfx file. Only used with `--cert`. |
| **`--port`** | The local port to listen on. Default value: 7071. |
| **`--timeout`** | The timeout for the Functions host to start, in seconds. Default: 20 seconds.|
| **`--useHttps`** | Bind to `https://localhost:{port}` rather than to `http://localhost:{port}`. By default, this option creates a trusted certificate on your computer.|

With the project running, you can [verify individual function endpoints](functions-run-local.md#run-a-local-function).

# [v1.x](#tab/v1)

```command
func host start
```

`func start` supports the following options:

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--cors`** | A comma-separated list of CORS origins, with no spaces. |
| **`--port`** | The local port to listen on. Default value: 7071. |
| **`--pause-on-error`** | Pause for more input before exiting the process. Used only when launching Core Tools from an integrated development environment (IDE).|
| **`--script-root`** | Used to specify the path to the root of the function app that is to be run or deployed. This is used for compiled projects that generate project files into a subfolder. For example, when you build a C# class library project, the host.json, local.settings.json, and function.json files are generated in a *root* subfolder with a path like `MyProject/bin/Debug/netstandard2.0`. In this case, set the prefix as `--script-root MyProject/bin/Debug/netstandard2.0`. This is the root of the function app when running in Azure. |
| **`--timeout`** | The timeout for the Functions host to start, in seconds. Default: 20 seconds.|
| **`--useHttps`** | Bind to `https://localhost:{port}` rather than to `http://localhost:{port}`. By default, this option creates a trusted certificate on your computer.|

In version 1.x, you can also use the [`func run`](#func-run) command to run a specific function and pass test data to it. 

---

## func azure functionapp fetch-app-settings

Gets settings from a specific function app.

```command
func azure functionapp fetch-app-settings <APP_NAME> 
```

For more information, see [Download application settings](functions-run-local.md#download-application-settings).

Settings are downloaded into the local.settings.json file for the project. On-screen values are masked for security. You can protect settings in the local.settings.json file by [enabling local encryption](functions-run-local.md#encrypt-the-local-settings-file). 

## func azure functionapp list-functions

Returns a list of the functions in the specified function app.

```command
func azure functionapp list-functions <APP_NAME>
```
## func azure functionapp logstream

Connects the local command prompt to streaming logs for the function app in Azure.

```command
func azure functionapp logstream <APP_NAME>
```

The default timeout for the connection is 2 hours. You can change the timeout by adding an app setting named [SCM_LOGSTREAM_TIMEOUT](functions-app-settings.md#scm_logstream_timeout), with a timeout value in seconds. Not yet supported for Linux apps in the Consumption plan. For these apps, use the `--browser` option to view logs in the portal.

The `deploy` action supports the following options:

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--browser`** | Open Azure Application Insights Live Stream for the function app in the default browser. |

For more information, see [Enable streaming execution logs in Azure Functions](streaming-logs.md).

## func azure functionapp publish 

Deploys a Functions project to an existing function app resource in Azure. 

```command
func azure functionapp publish <APP_NAME>
```

For more information, see [Deploy project files](functions-run-local.md#project-file-deployment).

The following publish options apply, based on version:

# [v2.x+](#tab/v2)

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--access-token`** | Lets you use a specific access token when performing authenticated azure actions. |
| **`--access-token-stdin `** | Reads a specific access token from a standard input. Use this when reading the token directly from a previous command such as [`az account get-access-token`](/cli/azure/account#az-account-get-access-token). |
| **`--additional-packages`** | List of packages to install when building native dependencies. For example: `python3-dev libevent-dev`. |
| **`--build`**, **`-b`** | Performs build action when deploying to a Linux function app. Accepts: `remote` and `local`. |
| **`--build-native-deps`** | Skips generating the `.wheels` folder when publishing Python function apps. |
| **`--csx`** | Publish a C# script (.csx) project. |
| **`--dotnet-cli-params`** | When publishing compiled C# (.csproj) functions, the core tools calls `dotnet build --output bin/publish`. Any parameters passed to this are appended to the command line. |
| **`--force`** | Ignore prepublishing verification in certain scenarios. |
|**`--list-ignored-files`** | Displays a list of files that are ignored during publishing, which is based on the `.funcignore` file. |
| **`--list-included-files`** | Displays a list of files that are published, which is based on the `.funcignore` file. |
| **`--management-url`** | Sets the management URL for your cloud. Use this when running in a sovereign cloud. |
| **`--no-build`** | Project isn't built during publishing. For Python, `pip install` isn't performed. |
| **`--nozip`** | Turns the default `Run-From-Package` mode off. |
| **`--overwrite-settings -y`** | Suppress the prompt to overwrite app settings when `--publish-local-settings -i` is used.|
| **`--publish-local-settings -i`** |  Publish settings in local.settings.json to Azure, prompting to overwrite if the setting already exists. If you're using a [local storage emulator](functions-develop-local.md#local-storage-emulator), first change the app setting to an [actual storage connection](#func-azure-storage-fetch-connection-string). |
| **`--publish-settings-only`**, **`-o`** |  Only publish settings and skip the content. Default is prompt. |
| **`--slot`** | Optional name of a specific slot to which to publish. |
| **`--subscription`** | Sets the default subscription to use. |


# [v1.x](#tab/v1)

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--overwrite-settings -y`** | Suppress the prompt to overwrite app settings when `--publish-local-settings -i` is used.|
| **`--publish-local-settings -i`** |  Publish settings in local.settings.json to Azure, prompting to overwrite if the setting already exists. If you're using the Microsoft Azure Storage Emulator, first change the app setting to an [actual storage connection](#func-azure-storage-fetch-connection-string). |

---

## func azure storage fetch-connection-string    

Gets the connection string for the specified Azure Storage account.

```command
func azure storage fetch-connection-string <STORAGE_ACCOUNT_NAME>
```

For more information, see [Download a storage connection string](functions-run-local.md#download-a-storage-connection-string).

## func azurecontainerapps deploy    

Deploys a containerized function app to an Azure Container Apps environment. Both the storage account used by the function app and the environment must already exist. For more information, see [Azure Container Apps hosting of Azure Functions](functions-container-apps-hosting.md). 

```command
func azurecontainerapps deploy --name <APP_NAME> --environment <ENVIRONMENT_NAME> --storage-account <STORAGE_CONNECTION> --resource-group <RESOURCE_GROUP> --image-name <IMAGE_NAME> --registry-server <REGISTRY_SERVER> --registry-username <USERNAME> --registry-password <PASSWORD>

```

The following deployment options apply:

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--access-token`** | Lets you use a specific access token when performing authenticated azure actions. |
| **`--access-token-stdin `** | Reads a specific access token from a standard input. Use this when reading the token directly from a previous command such as [`az account get-access-token`](/cli/azure/account#az-account-get-access-token). |
| **`--environment`** | The name of an existing Container Apps environment.| 
| **`--image-build`** | When set to `true`, skips the local Docker build. |
| **`--image-name`** | The image name of an existing container in a container registry. The image name includes the tag name. |
| **`--location `** | Region for the deployment. Ideally, this is the same region as the environment and storage account resources. |
| **`--management-url`** | Sets the management URL for your cloud. Use this when running in sovereign cloud. |
| **`--name`** | The name used for the function app deployment in the Container Apps environment. This same name is also used when managing the function app in the portal. The name should be unique in the environment. | 
| **`--registry`** | When set, a Docker build is run and the image is pushed to the registry set in `--registry`. You can't use `--registry` with `--image-name`. For Docker Hub, also use `--registry-username`.|
| **`--registry-password`** | The password or token used to retrieve the image from a private registry.|
| **`--registry-username`** | The username used to retrieve the image from a private registry.|
| **`--resource-group`** | The resource group in which to create the functions-related resources.|
| **`--storage-account`** | The connection string for the storage account to be used by the function app.|
| **`--subscription`** | Sets the default subscription to use. |
| **`--worker-runtime`** | Sets the runtime language of the function app. This parameter is only used with `--image-name` and `--image-build`, otherwise the language is determined during the local build. Supported values are: `dotnet`, `dotnetIsolated`, `node`, `python`, `powershell`, and `custom` (for customer handlers). |


> [!IMPORTANT]
> Storage connection strings and other service credentials are important secrets. Make sure to securely store any script files using `func azurecontainerapps deploy` and don't store them in any publicly accessible source control. 

## func deploy

The `func deploy` command is deprecated. Instead use [`func kubernetes deploy`](#func-kubernetes-deploy).

## func durable delete-task-hub

Deletes all storage artifacts in the Durable Functions task hub.

```command
func durable delete-task-hub
```

The `delete-task-hub` action supports the following options:

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--connection-string-setting`** | Optional name of the setting containing the storage connection string to use. |
| **`--task-hub-name`** |             Optional name of the Durable Task Hub to use. |

To learn more, see the [Durable Functions documentation](./durable/durable-functions-instance-management.md#delete-a-task-hub).

## func durable get-history

Returns the history of the specified orchestration instance.

```command
func durable get-history --id <INSTANCE_ID>
```

The `get-history` action supports the following options:

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--id`** | Specifies the ID of an orchestration instance (required). |
| **`--connection-string-setting`** | Optional name of the setting containing the storage connection string to use. |
| **`--task-hub-name`** |             Optional name of the Durable Task Hub to use. |

To learn more, see the [Durable Functions documentation](./durable/durable-functions-instance-management.md#azure-functions-core-tools-1).

## func durable get-instances

Returns the status of all orchestration instances. Supports paging using the `top` parameter.

```command
func durable get-instances
```

The `get-instances` action supports the following options:

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--continuation-token`** | Optional token that indicates a specific page/section of the requests to return. |
| **`--connection-string-setting`** | Optional name of the app setting that contains the storage connection string to use. |
| **`--created-after`** | Optionally, get the instances created after this date/time (UTC). All ISO 8601 formatted datetimes are accepted. |
| **`--created-before`** | Optionally, get the instances created before a specific date/time (UTC). All ISO 8601 formatted datetimes are accepted. |
| **`--runtime-status`** | Optionally, get the instances whose status match a specific status, including  `running`, `completed`, and `failed`. You can provide one or more space-separated statues. |
| **`--top`** | Optionally limit the number of records returned in a given request. |
| **`--task-hub-name`** | Optional name of the Durable Functions task hub to use. |

To learn more, see the [Durable Functions documentation](./durable/durable-functions-instance-management.md#azure-functions-core-tools-2).

## func durable get-runtime-status  

Returns the status of the specified orchestration instance.

```command
func durable get-runtime-status --id <INSTANCE_ID>
```

The `get-runtime-status` action supports the following options:

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--connection-string-setting`** | Optional name of the setting containing the storage connection string to use. |
| **`--id`** | Specifies the ID of an orchestration instance (required). |
| **`--show-input`** | When set, the response contains the input of the function. |
| **`--show-output`** | When set, the response contains the execution history. |
| **`--task-hub-name`** | Optional name of the Durable Functions task hub to use. |

To learn more, see the [Durable Functions documentation](./durable/durable-functions-instance-management.md#azure-functions-core-tools-1).

## func durable purge-history

Purge orchestration instance state, history, and blob storage for orchestrations older than the specified threshold.

```command
func durable purge-history
```

The `purge-history` action supports the following options:

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--connection-string-setting`** | Optional name of the setting containing the storage connection string to use. |
| **`--created-after`** | Optionally delete the history of instances created after this date/time (UTC). All ISO 8601 formatted datetime values are accepted. |
| **`--created-before`** | Optionally delete the history of instances created before this date/time (UTC). All ISO 8601 formatted datetime values are accepted.|
| **`--runtime-status`** | Optionally delete the history of instances whose status match a specific status, including `completd`, `terminated`, `canceled`, and `failed`. You can provide one or more space-separated statues. If you don't include `--runtime-status`, instance history is deleted regardless of status.|
| **`--task-hub-name`** | Optional name of the Durable Functions task hub to use. |

To learn more, see the [Durable Functions documentation](./durable/durable-functions-instance-management.md#azure-functions-core-tools-7).

## func durable raise-event         

Raises an event to the specified orchestration instance.

```command
func durable raise-event --event-name <EVENT_NAME> --event-data <DATA>
```

The `raise-event` action supports the following options:

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--connection-string-setting`** | Optional name of the setting containing the storage connection string to use. |
| **`--event-data`** | Data to pass to the event, either inline or from a JSON file (required). For files, prefix the path to the file with an ampersand (`@`), such as `@path/to/file.json`. |
| **`--event-name`** | Name of the event to raise (required).
| **`--id`** | Specifies the ID of an orchestration instance (required). |
| **`--task-hub-name`** | Optional name of the Durable Functions task hub to use. |

To learn more, see the [Durable Functions documentation](./durable/durable-functions-instance-management.md#azure-functions-core-tools-5).

## func durable rewind              

Rewinds the specified orchestration instance.

```command
func durable rewind --id <INSTANCE_ID> --reason <REASON>
```

The `rewind` action supports the following options:

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--connection-string-setting`** | Optional name of the setting containing the storage connection string to use. |
| **`--id`** | Specifies the ID of an orchestration instance (required). |
| **`--reason`** | Reason for rewinding the orchestration (required).|
| **`--task-hub-name`** | Optional name of the Durable Functions task hub to use. |

To learn more, see the [Durable Functions documentation](./durable/durable-functions-instance-management.md#azure-functions-core-tools-6).

## func durable start-new

Starts a new instance of the specified orchestrator function.

```command
func durable start-new --id <INSTANCE_ID> --function-name <FUNCTION_NAME> --input <INPUT>
```

The `start-new` action supports the following options:

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--connection-string-setting`** | Optional name of the setting containing the storage connection string to use. |
| **`--function-name`** | Name of the orchestrator function to start (required).|
| **`--id`** | Specifies the ID of an orchestration instance (required). |
| **`--input`** | Input to the orchestrator function, either inline or from a JSON file (required). For files, prefix the path to the file with an ampersand (`@`), such as `@path/to/file.json`. |
| **`--task-hub-name`** | Optional name of the Durable Functions task hub to use. |

To learn more, see the [Durable Functions documentation](./durable/durable-functions-instance-management.md#azure-functions-core-tools).

## func durable terminate

Stops the specified orchestration instance.

```command
func durable terminate --id <INSTANCE_ID> --reason <REASON>
```

The `terminate` action supports the following options:

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--connection-string-setting`** | Optional name of the setting containing the storage connection string to use. |
| **`--id`** | Specifies the ID of an orchestration instance (required). |
| **`--reason`** | Reason for stopping the orchestration (required). |
| **`--task-hub-name`** | Optional name of the Durable Functions task hub to use. |

To learn more, see the [Durable Functions documentation](./durable/durable-functions-instance-management.md#azure-functions-core-tools-4).

## func extensions install

Manually installs Functions extensions in a non-.NET project or in a C# script project. 

```command
func extensions install --package Microsoft.Azure.WebJobs.Extensions.<EXTENSION> --version <VERSION>
```

The `install` action supports the following options:

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--configPath`** | Path of the directory containing extensions.csproj file.|
| **`--csx`** |   Supports C# scripting (.csx) projects. |
| **`--force`** |  Update the versions of existing extensions. |
| **`--output`** |  Output path for the extensions. |
| **`--package`** |   Identifier for a specific extension package. When not specified, all referenced extensions are installed, as with `func extensions sync`.|
| **`--source`** |  NuGet feed source when not using NuGet.org.|
| **`--version`** |  Extension package version. |

The following example installs version 5.0.1 of the Event Hubs extension in the local project:

```command
func extensions install --package Microsoft.Azure.WebJobs.Extensions.EventHubs --version 5.0.1
```

The following considerations apply when using `func extensions install`:

+ For compiled C# projects (both in-process and isolated worker process), instead use standard NuGet package installation methods, such as `dotnet add package`.

+ To manually install extensions using Core Tools, you must have the [.NET 6.0 SDK](https://dotnet.microsoft.com/download) installed.

+ When possible, you should instead use [extension bundles](functions-bindings-register.md#extension-bundles). The following are some reasons why you might need to install extensions manually:

    + You need to access a specific version of an extension not available in a bundle.
    + You need to access a custom extension not available in a bundle.
    + You need to access a specific combination of extensions not available in a single bundle.

+ Before you can manually install extensions, you must first remove the [`extensionBundle`](functions-host-json.md#extensionbundle) object from the host.json file that defines the bundle. No action is taken when an extension bundle is already set in your [host.json file](functions-host-json.md#extensionbundle).

+ The first time you explicitly install an extension, a .NET project file named extensions.csproj is added to the root of your app project. This file defines the set of NuGet packages required by your functions. While you can work with the [NuGet package references](/nuget/consume-packages/package-references-in-project-files) in this file, Core Tools lets you install extensions without having to manually edit this C# project file.

## func extensions sync

Installs all extensions added to the function app.

The `sync` action supports the following options:

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--configPath`** | Path of the directory containing extensions.csproj file.|
| **`--csx`** |   Supports C# scripting (.csx) projects. |
| **`--output`** |  Output path for the extensions. |

Regenerates a missing extensions.csproj file. No action is taken when an extension bundle is defined in your host.json file.

## func kubernetes deploy

Deploys a Functions project as a custom docker container to a Kubernetes cluster.

```command
func kubernetes deploy 
```

This command builds your project as a custom container and publishes it to a Kubernetes cluster. Custom containers must have a Dockerfile. To create an app with a Dockerfile, use the `--dockerfile` option with the [`func init`](#func-init) command. 

The following Kubernetes deployment options are available:

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--dry-run`** | Optionally displays the deployment template, without execution. |
| **`--config-map-name`** | Optional name of an existing config map with [function app settings](functions-how-to-use-azure-function-app-settings.md#settings) to use in the deployment. Requires `--use-config-map`. The default behavior is to create settings based on the `Values` object in the [local.settings.json file].|
| **`--cooldown-period`** | The cool-down period (in seconds) after all triggers are no longer active before the deployment scales back down to zero, with a default of 300 s. |
| **`--ignore-errors`** | Continues the deployment after a resource returns an error. The default behavior is to stop on error. |
| **`--image-name`** | The name of the image to use for the pod deployment and from which to read functions. |
| **`--keda-version`** | Sets the version of KEDA to install. Valid options are: `v1` and `v2` (default). |
| **`--keys-secret-name`** | The name of a Kubernetes Secrets collection to use for storing [function access keys](functions-bindings-http-webhook-trigger.md#authorization-keys). |
| **`--max-replicas`** | Sets the maximum replica count for to which the Horizontal Pod Autoscaler (HPA) scales. |
| **`--min-replicas`** | Sets the minimum replica count below which HPA won't scale. |
| **`--mount-funckeys-as-containervolume`** | Mounts the [function access keys](functions-bindings-http-webhook-trigger.md#authorization-keys) as a container volume. |
| **`--name`** | The name used for the deployment and other artifacts in Kubernetes. |
| **`--namespace`** | Sets the Kubernetes namespace to which to deploy, which defaults to the default namespace. |
| **`--no-docker`** | Functions are read from the current directory instead of from an image. Requires mounting the image filesystem. |
| **`--registry`** | When set, a Docker build is run and the image is pushed to a registry of that name. You can't use `--registry` with `--image-name`. For Docker, use your username. |
| **`--polling-interval`** | The polling interval (in seconds) for checking non-HTTP triggers, with a default of 30s. |
| **`--pull-secret`** | The secret used to access private registry credentials. |
| **`--secret-name`** | The name of an existing Kubernetes Secrets collection that contains [function app settings](functions-how-to-use-azure-function-app-settings.md#settings) to use in the deployment. The default behavior is to create settings based on the `Values` object in the [local.settings.json file]. |
| **`--show-service-fqdn`** | Displays the URLs of HTTP triggers with the Kubernetes FQDN instead of the default behavior of using an IP address. |
| **`--service-type`** | Sets the type of Kubernetes Service. Supported values are: `ClusterIP`, `NodePort`, and `LoadBalancer` (default). |
| **`--use-config-map`** | Use a `ConfigMap` object (v1) instead of a `Secret` object (v1) to configure [function app settings](functions-how-to-use-azure-function-app-settings.md#settings). The map name is set using `--config-map-name`.|

Core Tools uses the local Docker CLI to build and publish the image. Make sure your Docker is already installed locally. Run the `docker login` command to connect to your account.

To learn more, see [Deploying a function app to Kubernetes](functions-kubernetes-keda.md#deploying-a-function-app-to-kubernetes).

## func kubernetes install

Installs KEDA in a Kubernetes cluster.

```command
func kubernetes install 
```

Installs KEDA to the cluster defined in the kubectl config file.

The `install` action supports the following options:

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--dry-run`** | Displays the deployment template, without execution. |
| **`--keda-version`** | Sets the version of KEDA to install. Valid options are: `v1` and `v2` (default). |
| **`--namespace`** | Supports installation to a specific Kubernetes namespace. When not set, the default namespace is used. |

To learn more, see [Managing KEDA and functions in Kubernetes](functions-kubernetes-keda.md#managing-keda-and-functions-in-kubernetes).

## func kubernetes remove

Removes KEDA from the Kubernetes cluster defined in the kubectl config file.

```command
func kubernetes remove 
```

Removes KEDA from the cluster defined in the kubectl config file.

The `remove` action supports the following options:

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--namespace`** | Supports uninstall from a specific Kubernetes namespace. When not set, the default namespace is used. | 

To learn more, see [Uninstalling KEDA from Kubernetes](functions-kubernetes-keda.md#uninstalling-keda-from-kubernetes).

## func settings add

Adds a new setting to the `Values` collection in the [local.settings.json file].

```command
func settings add <SETTING_NAME> <VALUE>
```

Replace `<SETTING_NAME>` with the name of the app setting and `<VALUE>` with the value of the setting. 

The `add` action supports the following option:

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--connectionString`** | Adds the name-value pair to the `ConnectionStrings` collection instead of the `Values` collection. Only use the `ConnectionStrings` collection when required by certain frameworks. To learn more, see [local.settings.json file]. |

## func settings decrypt

Decrypts previously encrypted values in the `Values` collection in the [local.settings.json file].

```command
func settings decrypt
```

Connection string values in the `ConnectionStrings` collection are also decrypted. In local.settings.json, `IsEncrypted` is also set to `false`. Encrypt local settings to reduce the risk of leaking valuable information from local.settings.json. In Azure, application settings are always stored encrypted. 

## func settings delete

Removes an existing setting from the `Values` collection in the [local.settings.json file].

```command
func settings delete <SETTING_NAME>
```

Replace `<SETTING_NAME>` with the name of the app setting and `<VALUE>` with the value of the setting. 

The `delete` action supports the following option:

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--connectionString`** | Removes the name-value pair from the `ConnectionStrings` collection instead of from the `Values` collection. |

## func settings encrypt

Encrypts the values of individual items in the `Values` collection in the [local.settings.json file].

```command
func settings encrypt
```

Connection string values in the `ConnectionStrings` collection are also encrypted. In local.settings.json, `IsEncrypted` is also set to `true`, which specifies that the local runtime decrypts settings before using them. Encrypt local settings to reduce the risk of leaking valuable information from local.settings.json. In Azure, application settings are always stored encrypted. 

## func settings list

Outputs a list of settings in the `Values` collection in the [local.settings.json file]. 

```command
func settings list
```

Connection strings from the `ConnectionStrings` collection are also output. By default, values are masked for security. You can use the `--showValue` option to display the actual value.

The `list` action supports the following option:

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--showValue`** | Shows the actual unmasked values in the output. |

## func templates list

Lists the available function (trigger) templates.

The `list` action supports the following option:

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--language`** | Language for which to filter returned templates. Default is to return all languages. |

[local.settings.json file]: functions-develop-local.md#local-settings-file
