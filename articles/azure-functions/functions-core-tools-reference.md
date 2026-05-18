---
title: Azure Functions Core Tools reference
description: Reference documentation that supports the Azure Functions Core Tools (func.exe).
ms.topic: reference
ms.date: 04/10/2026
ms.custom:
  - ignite-2023
  - sfi-ropc-nochange
---

# Azure Functions Core Tools reference

This article provides reference documentation for the Azure Functions Core Tools, which lets you develop, manage, and deploy Azure Functions projects from your local computer. To learn more about using Core Tools, see [Work with Azure Functions Core Tools](functions-run-local.md). 

Core Tools commands are organized into the following contexts, each providing a unique set of actions.

| Command context | Description |
| ----- | ----- |
| [`func`](#func-init) | Commands to create and run functions on your local computer. |
| [`func azure`](#func-azure-functionapp-fetch-app-settings) | Commands to work with Azure resources, including publishing. |
| [`func azurecontainerapps`](#func-azurecontainerapps-deploy) | Commands to deploy a containerized function app to Azure Container Apps. |
| [`func bundles`](#func-bundles-add) | Commands to manage extension bundles. |
| [`func durable`](#func-durable-delete-task-hub)    | Commands to work with [Durable Functions](../durable-task/common/what-is-durable-task.md). |
| [`func extensions`](#func-extensions-install) | Commands to install and manage extensions. |
| [`func kubernetes`](#func-kubernetes-deploy) | Commands to work with Kubernetes and Azure Functions. |
| [`func settings`](#func-settings-decrypt)   | Commands to manage environment settings for the local Functions host. |
| [`func templates`](#func-templates-list)  | Commands to list available function templates. |

Before using the commands in this article, [install the Core Tools](functions-run-local.md#install-the-azure-functions-core-tools). 

## `func init`

Creates a new Functions project in a specific language.

```command
func init [<PROJECT_FOLDER>]
```

When you supply `<PROJECT_FOLDER>`, the project is created in a new folder with this name. Otherwise, the current folder is used.

The `func init` command supports these options, which aren't supported in version 1.x, unless otherwise noted:

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--bundles-channel`**, **`-c`** | Extension bundle release channel. Supported values are: `GA` (default), `Preview`, and `Experimental`. Applicable only for non-.NET projects. |
| **`--configuration-profile`** | Initializes a project with a host configuration profile. The `--configuration-profile` option is currently in preview. For more information, see [Configuration profiles](#configuration-profiles). |
| **`--csx`** | Creates .NET functions as C# script, which is the version 1.x behavior. Valid only with `--worker-runtime dotnet`. |
| **`--docker`** | Creates a Dockerfile for a container using a base image based on the chosen `--worker-runtime`. Use this option when you plan to deploy a containerized function app. |
| **`--docker-only`** |  Adds a Dockerfile to an existing project. Prompts for the worker-runtime if not specified or set in *local.settings.json*. Use this option when you plan to deploy a containerized function app and the project already exists. |
| **`--force`** | Initialize the project even when there are existing files in the project. This setting overwrites existing files with the same name. Other files in the project folder aren't affected. |
| **`--language`**, **`-l`** | Initializes a language-specific project. Currently supported when `--worker-runtime` is set to `node`. Options are `typescript` and `javascript`. You can also use `--worker-runtime javascript` or `--worker-runtime typescript`. |
| **`--managed-dependencies`**  | Installs managed dependencies. Currently, only the PowerShell worker runtime supports this feature. |
| **`--model`**, **`-m`** | Sets the programming model for a target language when more than one model is available. Supported options are `V1` and `V2` for Python, and `V3` and `V4` for Node.js. For more information, see the [Python developer guide](functions-reference-python.md#programming-model) and the [Node.js developer guide](functions-reference-node.md). |
| **`--no-bundle`** | Don't configure extension bundle in *host.json*. Applicable only for non-.NET projects. |
| **`--no-docs`** | Skips generating the "Getting Started" documentation files. Applicable for Python projects. |
| **`--skip-npm-install`** | Skip running `npm install` after project creation. Applicable for Node.js projects. |
| **`--source-control`** | Controls whether a Git repository is created. By default, a repository isn't created. When `true`, a repository is created. |
| **`--worker-runtime`** | Sets the language runtime for the project. Supported values are: `csharp`, `dotnet`, `dotnet-isolated`, `javascript`, `node` (JavaScript), `powershell`, `python`, and `typescript`. For Java, use [Maven](functions-reference-java.md#create-java-functions). To generate a language-agnostic project with just the project files, use `custom`. When not set, you're prompted to choose your runtime during initialization. |
| **`--target-framework`** | Sets the target framework for the function app project. Valid only with `--worker-runtime dotnet-isolated`. Supported values are: `net10.0` (preview), `net9.0`, `net8.0` (default), `net6.0`, and `net48` (.NET Framework 4.8). |

> [!NOTE]
> When you use either the `--docker` or `--docker-only` option, Core Tools automatically creates the Dockerfile for C#, JavaScript, Python, and PowerShell functions. For Java functions, you must manually create the Dockerfile. For more information, see [Creating containerized function apps](functions-how-to-custom-container.md#creating-containerized-function-apps).

### Configuration profiles

> [!IMPORTANT]
> Support for configuration profiles is currently in preview.

When you use the `--configuration-profile` option, a predefined set of project configurations and settings is created. When you specify a configuration profile, initialization might skip all other initialization steps.

| Profile value | Description | Specific actions |
| ----- | ----- | ----- |
| `mcp-custom-handler` | Creates a project that uses [custom handlers](functions-custom-handlers.md) to host an [MCP (Model Context Protocol)](https://modelcontextprotocol.io/) server that AI agents and other MCP clients can connect to. | • Configures the `"configurationProfile": "mcp-custom-handler"` element in the *host.json* file with specific custom handler settings.<br/>• Sets `MCP_EXTENSION_ENABLED` to `true` in *local.settings.json*. |

## `func logs`

Gets logs for functions running in a Kubernetes cluster.

```command
func logs --platform kubernetes --name <APP_NAME>
```

The `func logs` command supports these options:

| Option | Description |
| --- | --- |
| **`--platform`** | Hosting platform for the function app. Valid options: `kubernetes`. |
| **`--name`** | Function app name in Azure. |

For more information, see [Azure Functions on Kubernetes with KEDA](functions-kubernetes-keda.md).

## `func new`

Creates a new function in the current project based on a template.

```command
func new
```

When you run `func new` without the `--template` option, you're prompted to choose a template. In version 1.x, you also need to choose the language. 

The `func new` command supports these options:

| Option     | Description                            |
| ------------------------------------------ | -------------------------------------- |
| **`--authlevel`**, **`-a`** | Sets the authorization level for an HTTP trigger. Supported values are: `function`, `anonymous`, `admin`. Authorization isn't enforced when running locally. For more information, see [Authorization level](functions-bindings-http-webhook-trigger.md#http-auth). |
| **`--csx`** | (Version 2.x and later versions.) Generates the same C# script (.csx) templates used in version 1.x and in the portal. |
| **`--file`**, **`-f`** | The target file for the new function. For Python v2 projects, specifies the file to add the function to (defaults to *function_app.py*). For Node.js v4 projects, specifies the output file name in the `src/functions` folder. Not applicable for compiled .NET projects. |
| **`--language`**, **`-l`**| The template programming language, such as C# or JavaScript. This option is required in version 1.x. In version 2.x and later versions, don't use this option because the language is defined by the worker runtime. |
| **`--name`**, **`-n`** | The function name. |
| **`--template`**, **`-t`** | Use the `func templates list` command to see the complete list of available templates for each supported language.   |

For more information, see [Create a function](functions-run-local.md#create-func).

## `func pack`

Creates a deployment package that contains your project code in a runnable state. Use this method when you need to manually create a deployment package for your app on your local computer outside of the `func azure functionapp publish` command. By default, `func pack` builds your project when needed. 

```command
func pack [<FOLDER_PATH>]
```

By default, `func pack` packages the current directory, and the output .zip file has the same name as the root folder of your project. Run `func pack` in the directory that contains your *host.json* project file. If you need to run `func pack` in another directory, set `<FOLDER_PATH>` as the path to the project root, like `func pack ./myprojectroot`. If the specific .zip file already exists, it's first deleted and then replaced with an updated version.

The `func pack` command supports these options:

| Option     | Description                            |
| ------------------------------------------ | -------------------------------------- |
| **`--output`**, **`-o`** | Sets the path to the location where the deployment .zip package file is created. |
| **`--no-build`** | Project isn't built before packing. For C# apps, use only when you already generated your binaries. For Node.js apps, both `npm install` and `npm run build` are skipped. |
| **`--skip-install`** | Skips running `npm install` when packing Node.js-based function app. Used to avoid overwriting custom npm modules. |
| **`--build-native-deps`** | Installs Python dependencies locally by using an image that matches the environment used in Azure. When enabled, Core Tools starts a Docker container, builds the app inside that container, and creates a .zip file with all dependencies restored in `.python_packages`. Use this option when running on Windows to avoid potential library issues when you deploy to Linux in Azure. |

## `func run`

*Version 1.x only.*

Enables you to invoke a function directly, which is similar to running a function using the **Test** tab in the Azure portal. This action is only supported in version 1.x. For later versions, use `func start` and [call the function endpoint directly](functions-run-local.md#run-a-local-function).

```command
func run
```

The `func run` command supports these options:

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--content`** | Inline content passed to the function. |
| **`--debug`** | Attach a debugger to the host process before running the function.|
| **`--file`** | The file name to use as content.|
| **`--no-interactive`** | Doesn't prompt for input, which is useful for automation scenarios. |
| **`--timeout`** | Time to wait (in seconds) until the local Functions host is ready.|

For example, to call an HTTP-triggered function and pass content body, run this command:

```command
func run MyHttpTrigger --content '{\"name\": \"Azure\"}'
```

## `func start`

Starts the local runtime host and loads the function project in the current folder. 

The specific command depends on the [runtime version](functions-versions.md).   

### [v2.x+](#tab/v2)

```command
func start
```

The `func start` command supports these options:

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--cert`** | The path to a .pfx file that contains a private key. Only supported with `--useHttps`. |
| **`--cors`** | A comma-separated list of CORS origins, with no spaces. |
| **`--cors-credentials`** | Allows cross-origin authenticated requests that use cookies and the Authentication header. |
| **`--dotnet-isolated-debug`** | When set to `true`, pauses the .NET worker process until a debugger is attached from the .NET isolated project being debugged. |
| **`--enable-json-output`** | Emits console logs as JSON when possible. |
| **`--enableAuth`** | Enables the full authentication handling pipeline with authorization requirements. |
| **`--functions`** | A space-separated list of functions to load. |
| **`--json-output-file`** | If provided, a path to the file used to write the output when using `--enable-json-output`. |
| **`--language-worker`** | Arguments to configure the language worker. For example, you can enable debugging for language worker by providing [debug port and other required arguments](https://github.com/Azure/azure-functions-core-tools/wiki/Enable-Debugging-for-language-workers). |
| **`--no-build`** | Don't build the current project before running. For .NET class projects only. Default is `false`.  |
| **`--password`** | Either the password or a file that contains the password for a .pfx file. Only used with `--cert`. |
| **`--port`**, **`-p`** | The local port to listen on. Default value: 7071. |
| **`--runtime`** | Sets which version of the host to start. Allowed values are: `inproc6`, `inproc8`, and `default` (which runs the out-of-process host). |
| **`--timeout`**, **`-t`** | The timeout for the Functions host to start, in seconds. Default: 20 seconds. |
| **`--useHttps`** | Bind to `https://localhost:{port}` rather than to `http://localhost:{port}`. By default, this option creates a trusted certificate on your computer.|
| **`--user-log-level`** | Sets the minimum log level for user logs. Valid values are: `Trace`, `Debug`, `Information`, `Warning`, `Error`, `Critical`, and `None`. This setting doesn't affect system logs. For .NET isolated projects, also set the minimum level in `Program.cs` by using `builder.Logging.SetMinimumLevel(LogLevel.Debug)` for this option to take effect. |

With the project running, [verify individual function endpoints](functions-run-local.md#run-a-local-function).

### [v1.x](#tab/v1)

```command
func host start
```

The `func host start` command supports these options:

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--cors`** | A comma-separated list of CORS origins, with no spaces. |
| **`--port`** | The local port to listen on. Default value: 7071. |
| **`--pause-on-error`** | Pauses for more input before exiting the process. Used only when launching Core Tools from an integrated development environment (IDE). |
| **`--script-root`** | Specifies the path to the root of the function app to run or deploy. This option is used for compiled projects that generate project files into a subfolder. For example, when you build a C# class library project, the host.json, local.settings.json, and function.json files are generated in a *root* subfolder with a path like `MyProject/bin/Debug/netstandard2.0`. In this case, set the prefix as `--script-root MyProject/bin/Debug/netstandard2.0`. This path is the root of the function app when running in Azure. |
| **`--timeout`** | The timeout for the Functions host to start, in seconds. Default: 20 seconds.|
| **`--useHttps`** | Bind to `https://localhost:{port}` rather than to `http://localhost:{port}`. By default, this option creates a trusted certificate on your computer.|

In version 1.x, also use the [`func run`](#func-run) command to run a specific function and pass test data to it. 

---

## `func azure functionapp`

The `func azure functionapp` context contains the following commands:

+ [`func azure functionapp fetch-app-settings`](#func-azure-functionapp-fetch-app-settings)
+ [`func azure functionapp list-functions`](#func-azure-functionapp-list-functions)
+ [`func azure functionapp logstream`](#func-azure-functionapp-logstream)
+ [`func azure functionapp publish`](#func-azure-functionapp-publish)

All `func azure functionapp` commands support these options:

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--slot`** | Targets a specific named [deployment slot](functions-deployment-slots.md), if configured. |
| **`--access-token`** | Provides an access token, other than the default token, to use to perform authenticated actions in Azure.  |
| **`--access-token-stdin`** | Reads a specific access token from standard input. Use this option when reading the token directly from a previous command like [`az account get-access-token`](/cli/azure/account#az-account-get-access-token). |
| **`--management-url`** | Sets the management URL for the Azure cloud, which defaults to `https://management.azure.com`. Use this option when your function app runs in a sovereign cloud.  |
| **`--subscription`** | Sets the default Azure subscription.  |

## `func azure functionapp fetch-app-settings`

Gets settings from a specific function app.

```command
func azure functionapp fetch-app-settings <APP_NAME> 
```

For more information, see [Download application settings](functions-run-local.md#download-application-settings).

Settings download into the *local.settings.json* file for the project. On-screen values are masked for security. You can protect settings in the local.settings.json file by [enabling local encryption](functions-run-local.md#encrypt-the-local-settings-file). 

## `func azure functionapp list-functions`

Lists the functions in the specified function app.

```command
func azure functionapp list-functions <APP_NAME>
```

The `func azure functionapp list-functions` command supports this option:

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--show-keys`** | Include function-level access key values in the returned function endpoint URLs. |

## `func azure functionapp logstream`

Connects the local command prompt to streaming logs for the function app in Azure.

```command
func azure functionapp logstream <APP_NAME>
```

The default timeout for the connection is 2 hours. Change the timeout by adding an app setting named [SCM_LOGSTREAM_TIMEOUT](functions-app-settings.md#scm_logstream_timeout), with a timeout value in seconds. Not yet supported for Linux in a [Flex Consumption](flex-consumption-plan.md) or [Consumption](consumption-plan.md) plan. For these apps, use the `--browser` option to view logs in the portal.

The `func azure functionapp logstream` command supports this option:

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--browser`** | Open Azure Application Insights Live Stream for the function app in the default browser. |

For more information, see [Enable streaming execution logs in Azure Functions](streaming-logs.md).

## `func azure functionapp publish`

Deploys a Functions project to an existing function app resource in Azure. 

```command
func azure functionapp publish <APP_NAME>
```

For more information, see [Deploy project files](functions-run-local.md#project-file-deployment).

The following publishing options apply, based on version:

### [v2.x+](#tab/v2)

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--additional-packages`** | List of packages to install when building native dependencies. For example: `python3-dev libevent-dev`. |
| **`--build`**, **`-b`** | Performs a build action when deploying to a Linux function app. Accepts: `remote` and `local`. |
| **`--build-native-deps`** | Skips generating the `.wheels` folder when you publish Python function apps. |
| **`--csx`** | Publish a C# script (.csx) project. |
| **`--dotnet-cli-params`** | When you publish compiled C# (.csproj) functions, the core tools call `dotnet build --output bin/publish`. Any parameters passed to this option are appended to the command line. |
| **`--dotnet-version`** | For `dotnet-isolated` applications, specifies the target .NET version (for example, `8.0`). |
| **`--force`** | Ignores prepublishing verification in certain scenarios. |
|**`--list-ignored-files`** | Displays a list of files that are ignored during publishing, based on the *.funcignore* file. |
| **`--list-included-files`** | Displays a list of files that are published, which is based on the *.funcignore* file. |
| **`--no-build`** | Project isn't built during publishing. For Python, `pip install` doesn't run. |
| **`--nozip`** | Turns the default `Run-From-Package` mode off. Extracts files to the `wwwroot` folder on the server instead of running them directly from the deployment package. |
| **`--overwrite-settings`**, **`-y`** | Suppresses the prompt to overwrite app settings when you use `--publish-local-settings -i`.|
| **`--publish-local-settings`**, **`-i`** | Publishes settings in local.settings.json to Azure, prompting to overwrite if the setting already exists. If you're using a [local storage emulator](functions-develop-local.md#local-storage-emulator), first change the app setting to an [actual storage connection](#func-azure-storage-fetch-connection-string). |
| **`--publish-settings-only`**, **`-o`** | Publishes only settings and skips the content. Default is prompt. |
| **`--show-keys`** | Adds function keys to the URLs displayed in the logs. |

### [v1.x](#tab/v1)

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--overwrite-settings`**, **`-y`** | Suppresses the prompt to overwrite app settings when you use `--publish-local-settings -i`.|
| **`--publish-local-settings`**, **`-i`** | Publishes settings in local.settings.json to Azure, prompting to overwrite if the setting already exists. If you're using the Microsoft Azure Storage Emulator, first change the app setting to an [actual storage connection](#func-azure-storage-fetch-connection-string). |

---

## `func azure storage fetch-connection-string`

Gets the connection string for the specified Azure Storage account.

```command
func azure storage fetch-connection-string <STORAGE_ACCOUNT_NAME>
```

For more information, see [download a storage connection string](functions-run-local.md#download-a-storage-connection-string).

## `func azurecontainerapps deploy`

Deploys a containerized function app to an Azure Container Apps environment. The storage account used by the function app and the environment must already exist. For more information, see [Azure Container Apps hosting of Azure Functions](functions-container-apps-hosting.md). 

```command
func azurecontainerapps deploy --name <APP_NAME> --environment <ENVIRONMENT_NAME> --storage-account <STORAGE_CONNECTION> --resource-group <RESOURCE_GROUP> --image-name <IMAGE_NAME> --registry-server <REGISTRY_SERVER> --registry-username <USERNAME> --registry-password <PASSWORD>

```

The following deployment options apply:

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--environment`** | The name of an existing Container Apps environment.| 
| **`--image-build`** | Set to `true` to skip the local Docker build. |
| **`--image-name`** | The name of an existing container image in a container registry, including the tag name. |
| **`--location`** | Region for the deployment. Ideally, this region is the same as the environment and storage account resources. |
| **`--name`** | The name used for the function app deployment in the Container Apps environment. This name also appears when managing the function app in the portal. The name must be unique in the environment. | 
| **`--registry`** | When set, a Docker build runs and the image is pushed to the registry set in `--registry`. You can't use `--registry` with `--image-name`. For Docker Hub, also use `--registry-username`. |
| **`--registry-password`** | The password or token used to retrieve the image from a private registry.|
| **`--registry-username`** | The username used to retrieve the image from a private registry.|
| **`--resource-group`** | The resource group in which to create the functions-related resources.|
| **`--storage-account`** | The connection string for the storage account to be used by the function app.|
| **`--worker-runtime`** | Sets the runtime language of the function app. This parameter is only used with `--image-name` and `--image-build`; otherwise the language is determined during the local build. Supported values are: `dotnet`, `dotnetIsolated`, `node`, `python`, `powershell`, and `custom` (for custom handlers). |


> [!IMPORTANT]
> Storage connection strings and other service credentials are important secrets. Securely store any script files that use `func azurecontainerapps deploy` and don't store them in any publicly accessible source control. 

## `func deploy`

The `func deploy` command is deprecated. Instead use [`func kubernetes deploy`](#func-kubernetes-deploy).

## `func bundles add`

Adds extension bundle configuration to the *host.json* file.

```command
func bundles add
```

The `func bundles add` command supports these options:

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--force`**, **`-f`** | Overwrites existing extension bundle configuration if present. |
| **`--channel`**, **`-c`** | Extension bundle release channel. Supported values are: `GA` (default), `Preview`, and `Experimental`. |

## `func bundles download`

Downloads the extension bundle that's configured in *host.json*.

```command
func bundles download
```

The `func bundles download` command supports these options:

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--force`**, **`-f`** | Forces a redownload of the extension bundle even if it's already present. |

## `func bundles list`

Lists downloaded extension bundles.

```command
func bundles list
```

## `func bundles path`

Gets the path to the downloaded extension bundle.

```command
func bundles path
```

## `func durable delete-task-hub`

Deletes all storage artifacts in the Durable Functions task hub.

```command
func durable delete-task-hub
```

The `func durable delete-task-hub` command supports these options:

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--connection-string-setting`** | Name of the setting that contains the storage connection string to use. |
| **`--task-hub-name`** | Name of the Durable task hub to use. |

For more information, see the [Durable Functions documentation](../durable-task/common/durable-task-hubs.md).

## `func durable get-history`

Returns the history of a specified orchestration instance.

```command
func durable get-history --id <INSTANCE_ID>
```

The `func durable get-history` command supports these options:

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--id`** | ID of an orchestration instance. (Required) |
| **`--connection-string-setting`** | Name of the setting that has the storage connection string to use. |
| **`--task-hub-name`** | Name of the Durable task hub to use. |

For more information, see the [Durable Functions documentation](../durable-task/common/durable-task-instance-management.md#query-instances).

## `func durable get-instances`

Returns the status of all orchestration instances. This command supports paging with the `top` parameter.

```command
func durable get-instances
```

The `func durable get-instances` command supports these options:

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--continuation-token`** | Token that indicates a specific page or section of the requests to return. |
| **`--connection-string-setting`** | Name of the app setting that contains the storage connection string to use. |
| **`--created-after`** | Get the instances created after this date and time (UTC). All ISO 8601 formatted datetimes are accepted. |
| **`--created-before`** | Get the instances created before a specific date and time (UTC). All ISO 8601 formatted datetimes are accepted. |
| **`--runtime-status`** | Get the instances whose status matches a specific status, including `running`, `completed`, and `failed`. You can provide one or more space-separated statuses. |
| **`--top`** | Limit the number of records returned in a given request. |
| **`--task-hub-name`** | Name of the Durable Functions task hub to use. |

For more information, see [Durable Functions documentation](../durable-task/common/durable-task-instance-management.md#query-all-orchestration-instances).

## `func durable get-runtime-status`

Returns the status of a specified orchestration instance.

```command
func durable get-runtime-status --id <INSTANCE_ID>
```

The `func durable get-runtime-status` command supports these options:

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--connection-string-setting`** | Name of the setting containing the storage connection string to use. |
| **`--id`** | ID of an orchestration instance. (Required) |
| **`--show-input`** | When set, the response includes the input of the function. |
| **`--show-output`** | When set, the response includes the execution history. |
| **`--task-hub-name`** | Name of the Durable Functions task hub to use. |

For more information, see [Durable Functions documentation](../durable-task/common/durable-task-instance-management.md#query-instances).

## `func durable purge-history`

Purges orchestration instance state, history, and blob storage for orchestrations older than the specified threshold.

```command
func durable purge-history
```

The `func durable purge-history` command supports these options:

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--connection-string-setting`** | Name of the setting containing the storage connection string to use. |
| **`--created-after`** | Delete the history of instances created after this date/time (UTC). All ISO 8601 formatted datetime values are accepted. |
| **`--created-before`** | Delete the history of instances created before this date/time (UTC). All ISO 8601 formatted datetime values are accepted. |
| **`--runtime-status`** | Delete the history of instances whose status matches a specific status, including `completed`, `terminated`, `canceled`, and `failed`. Provide one or more space-separated statuses. If you don't include `--runtime-status`, instance history is deleted regardless of status. |
| **`--task-hub-name`** | Name of the Durable Functions task hub to use. |

For more information, see the [Durable Functions documentation](../durable-task/common/durable-task-instance-management.md#purge-orchestration-instance-history).

## `func durable raise-event`

Raises an event to the specified orchestration instance.

```command
func durable raise-event --event-name <EVENT_NAME> --event-data <DATA>
```

The `func durable raise-event` command supports these options:

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--connection-string-setting`** | Name of the setting containing the storage connection string to use. |
| **`--event-data`** | Data to pass to the event, either inline or from a JSON file. For files, prefix the path to the file with an at sign (`@`), like `@path/to/file.json`. (Required) |
| **`--event-name`** | Name of the event to raise. (Required) |
| **`--id`** | ID of an orchestration instance. (Required) |
| **`--task-hub-name`** | Name of the Durable Functions task hub to use. |

For more information, see [Durable Functions documentation](../durable-task/common/durable-task-instance-management.md#send-events-to-instances).

## `func durable rewind`

Rewinds the specified orchestration instance.

```command
func durable rewind --id <INSTANCE_ID> --reason <REASON>
```

The `func durable rewind` command supports these options:

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--connection-string-setting`** | Name of the setting containing the storage connection string to use. |
| **`--id`** | ID of an orchestration instance. (Required) |
| **`--reason`** | Reason for rewinding the orchestration. (Required) |
| **`--task-hub-name`** | Name of the Durable Functions task hub to use. |

For more information, see [Durable Functions documentation](../durable-task/common/durable-task-instance-management.md#rewind-orchestration-instances).

## `func durable start-new`

Starts a new instance of the specified orchestrator function.

```command
func durable start-new --id <INSTANCE_ID> --function-name <FUNCTION_NAME> --input <INPUT>
```

The `func durable start-new` command supports these options:

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--connection-string-setting`** | Name of the setting containing the storage connection string to use. |
| **`--function-name`** | Name of the orchestrator function to start. (Required) |
| **`--id`** | Specifies the ID of an orchestration instance. (Required) |
| **`--input`** | Input to the orchestrator function, either inline or from a JSON file. For files, prefix the path to the file with an ampersand (`@`), like `@path/to/file.json`. (Required) |
| **`--task-hub-name`** | Name of the Durable Functions task hub to use. |

For more information, see [Durable Functions documentation](../durable-task/common/durable-task-instance-management.md#start-instances).

## `func durable terminate`

Ends the specified orchestration instance.

```command
func durable terminate --id <INSTANCE_ID> --reason <REASON>
```

The `func durable terminate` command supports these options:

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--connection-string-setting`** | Name of the setting containing the storage connection string to use. |
| **`--id`** | Specifies the ID of an orchestration instance. (Required) |
| **`--reason`** | Reason for ending the orchestration. (Required) |
| **`--task-hub-name`** | Name of the Durable Functions task hub to use. |

For more information, see the [Durable Functions documentation](../durable-task/common/durable-task-instance-management.md#terminate-orchestration-instances).

## `func extensions install`

Manually installs Functions extensions in a non-.NET project or a C# script project. 

```command
func extensions install --package Microsoft.Azure.WebJobs.Extensions.<EXTENSION> --version <VERSION>
```

The `func extensions install` command supports these options:

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--configPath`**, **`-c`** | Path of the directory containing the extensions.csproj file. |
| **`--csx`** | Support C# scripting (.csx) projects. |
| **`--force`**, **`-f`** | Update the versions of existing extensions. |
| **`--output`**, **`-o`** | Output path for the extensions. |
| **`--package`**, **`-p`** | Identifier for a specific extension package. When not specified, all referenced extensions are installed, as with `func extensions sync`. |
| **`--source`**, **`-s`** | NuGet feed source when not using NuGet.org. |
| **`--version`**, **`-v`** | Extension package version. |

The following example installs version 5.0.1 of the Event Hubs extension in the local project:

```command
func extensions install --package Microsoft.Azure.WebJobs.Extensions.EventHubs --version 5.0.1
```

These considerations apply when using `func extensions install`:

+ For compiled C# projects (both in-process and isolated worker process), use standard NuGet package installation methods instead, like `dotnet add package`.

+ To manually install extensions by using Core Tools, you must have the [.NET SDK](https://dotnet.microsoft.com/download) installed.

+ When possible, you should instead use [extension bundles](extension-bundles.md). Here are some reasons why you might need to install extensions manually:

    + You need to access a specific version of an extension not available in a bundle.
    + You need to access a custom extension not available in a bundle.
    + You need to access a specific combination of extensions not available in a single bundle.

+ Before you can manually install extensions, you must first remove the [`extensionBundle`](functions-host-json.md#extensionbundle) object from the *host.json* file that defines the bundle. No action is taken when an extension bundle is already set in your *host.json* file.

+ The first time you explicitly install an extension, a .NET project file named *extensions.csproj* is added to the root of your app project. This file defines the set of NuGet packages required by your functions. While you can work with the [NuGet package references](/nuget/consume-packages/package-references-in-project-files) in this file, Core Tools lets you install extensions without having to manually edit this C# project file.

## `func extensions sync`

Installs all extensions added to the function app.

The `func extensions sync` command supports these options:

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--configPath`**, **`-c`** | Path of the directory containing extensions.csproj file.|
| **`--csx`** |   Supports C# scripting (.csx) projects. |
| **`--output`**, **`-o`** |  Output path for the extensions. |

Regenerates a missing extensions.csproj file. Takes no action when an extension bundle is defined in your host.json file.

## `func kubernetes deploy`

Deploys a Functions project as a custom docker container to a Kubernetes cluster.

```command
func kubernetes deploy 
```

This command builds your project as a custom container and publishes it to a Kubernetes cluster. Custom containers must have a Dockerfile. To create an app with a Dockerfile, use the `--dockerfile` option with the [`func init`](#func-init) command. 

The `func kubernetes deploy` command supports these options:

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--dry-run`** | Displays the deployment template, without execution. |
| **`--config-map-name`** | Name of an existing config map with [function app settings](functions-how-to-use-azure-function-app-settings.md#settings) to use in the deployment. Requires `--use-config-map`. The default behavior is to create settings based on the `Values` object in the *local.settings.json* file.|
| **`--cooldown-period`** | The cooldown period (in seconds) after all triggers are no longer active before the deployment scales back down to zero, with a default of 300 s. |
| **`--ignore-errors`** | Continue the deployment after a resource returns an error. The default behavior is to stop on error. |
| **`--image-name`** | The name of the image to use for the pod deployment and from which to read functions. |
| **`--keda-version`** | Set the version of KEDA to install. Valid options are: `v1` and `v2` (default). |
| **`--keys-secret-name`** | The name of a Kubernetes Secrets collection to use for storing [access keys](function-keys-how-to.md). |
| **`--max-replicas`** | Set the maximum replica count to which the Horizontal Pod Autoscaler (HPA) scales. |
| **`--min-replicas`** | Set the minimum replica count below which HPA won't scale. |
| **`--mount-funckeys-as-containervolume`** | Mount the [access keys](function-keys-how-to.md) as a container volume. |
| **`--name`** | The name used for the deployment and other artifacts in Kubernetes. |
| **`--namespace`** | Set the Kubernetes namespace to deploy to. Defaults to the default namespace. |
| **`--no-docker`** | Read functions from the current directory instead of from an image. Requires mounting the image filesystem. |
| **`--registry`** | When set, a Docker build runs and the image is pushed to a registry of that name. You can't use `--registry` with `--image-name`. For Docker, use your username. |
| **`--polling-interval`** | The polling interval (in seconds) for checking non-HTTP triggers, with a default of 30s. |
| **`--pull-secret`** | The secret used to access private registry credentials. |
| **`--secret-name`** | The name of an existing Kubernetes Secrets collection that has [function app settings](functions-how-to-use-azure-function-app-settings.md#settings) to use in the deployment. The default behavior is to create settings based on the `Values` object in the *local.settings.json* file. |
| **`--show-service-fqdn`** | Display the URLs of HTTP triggers with the Kubernetes FQDN instead of the default behavior of using an IP address. |
| **`--service-type`** | Set the type of Kubernetes Service. Supported values are: `ClusterIP`, `NodePort`, and `LoadBalancer` (default). |
| **`--use-config-map`** | Use a `ConfigMap` object (v1) instead of a `Secret` object (v1) to configure [function app settings](functions-how-to-use-azure-function-app-settings.md#settings). The map name is set using `--config-map-name`.|
| **`--use-git-hash-version`** | Use the Git hash as the version for the container image. |
| **`--write-configs`** | Output the Kubernetes configurations as YAML files instead of deploying. |
| **`--config-file`** | Output file path when using `--write-configs`. Default: *functions.yaml*. |
| **`--hash-files`** | Files to hash to determine the image version. |
| **`--image-build`** | When set to `false`, skips the Docker build. |
| **`--key-secret-annotations`** | Annotations to add to the keys secret, in `key1=val1,key2=val2` format. |

Core Tools uses the local Docker CLI to build and publish the image. Make sure Docker is already installed locally. Run the `docker login` command to connect to your account.

Azure Functions supports hosting your containerized functions either in Azure Container Apps or in Azure Functions. Azure Functions doesn't officially support running your containers directly in a Kubernetes cluster or in Azure Kubernetes Service (AKS). For more information, see [Linux container support in Azure Functions](container-concepts.md).

## `func kubernetes delete`

Deletes a Functions deployment from a Kubernetes cluster.

```command
func kubernetes delete --name <APP_NAME>
```

The `func kubernetes delete` command supports these options:

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--name`** | The name for the deployment and other artifacts in Kubernetes. (Required) |
| **`--namespace`** | Set the Kubernetes namespace. Defaults to the `default` namespace. |
| **`--registry`** | The name of the container registry. |
| **`--image-name`** | The image to use for the pod deployment. |
| **`--keda-version`** | Set the version of KEDA. Valid options are `v1` and `v2` (default). |

## `func kubernetes install`

Installs KEDA in a Kubernetes cluster

```command
func kubernetes install 
```

Installs KEDA to the cluster defined in the kubectl config file.

The `func kubernetes install` command supports these options:

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--dry-run`** | Displays the deployment template without execution. |
| **`--keda-version`** | Sets the version of KEDA to install. Valid options are: `v1` and `v2` (default). |
| **`--namespace`** | Installs to a specific Kubernetes namespace. When not set, the default namespace is used. |

For more information, see [Managing KEDA and functions in Kubernetes](functions-kubernetes-keda.md#managing-keda-and-functions-in-kubernetes).

## `func kubernetes remove`

Removes KEDA from the Kubernetes cluster defined in the `kubectl` config file.

```command
func kubernetes remove
```

Removes KEDA from the cluster defined in the `kubectl` config file.

The `func kubernetes remove` command supports this option:

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--namespace`** | Uninstalls from a specific Kubernetes namespace. When not set, the default namespace is used. | 

For more information, see [Uninstalling KEDA from Kubernetes](functions-kubernetes-keda.md#uninstalling-keda-from-kubernetes).

## `func settings add`

Adds a new setting to the `Values` collection in the [local.settings.json file].

```command
func settings add <SETTING_NAME> <VALUE>
```

Replace `<SETTING_NAME>` with the name of the app setting. 

The `func settings add` command supports this option:

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--connectionString`** | Adds the name-value pair to the `ConnectionStrings` collection instead of the `Values` collection. Use the `ConnectionStrings` collection only when certain frameworks require it. For more information, see [local.settings.json file]. |

## `func settings decrypt`

Decrypts encrypted values in the `Values` collection in the *local.settings.json* file.

```command
func settings decrypt
```

This command also decrypts connection string values in the `ConnectionStrings` collection. In local.settings.json, `IsEncrypted` is also set to `false`. Encrypt local settings to reduce the risk of leaking valuable information from local.settings.json. In Azure, application settings are always stored encrypted. 

## `func settings delete`

Removes an existing setting from the `Values` collection in the [local.settings.json file].

```command
func settings delete <SETTING_NAME>
```

Replace `<SETTING_NAME>` with the name of the app setting and `<VALUE>` with the value of the setting. 

The `func settings delete` command supports this option:

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--connectionString`** | Removes the name-value pair from the `ConnectionStrings` collection instead of the `Values` collection. |

## `func settings encrypt`

Encrypts the values of individual items in the `Values` collection in the [local.settings.json file].

```command
func settings encrypt
```

Connection string values in the `ConnectionStrings` collection are also encrypted. In local.settings.json, `IsEncrypted` is also set to `true`, which specifies that the local runtime decrypts settings before using them. Encrypt local settings to reduce the risk of leaking valuable information from local.settings.json. In Azure, application settings are always stored as encrypted. 

## `func settings list`

Outputs a list of settings in the `Values` collection in the [local.settings.json file]. 

```command
func settings list
```

The output also includes connection strings from the `ConnectionStrings` collection. By default, values are masked for security. You can use the `--showValue` option to display the actual value.

The `func settings list` command supports this option:

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--showValue`**, **`-a`** | Show the actual unmasked values in the output. |

## `func templates list`

Lists the available function (trigger) templates.

The `func templates list` command supports this option:

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--language`**, **`-l`** | Language for which to filter returned templates. Returns all languages by default. |

## Global options

These options are available for most Core Tools commands:

| Option     | Description                            |
| ------------ | -------------------------------------- |
| **`--script-root`** | Sets the root directory of the function app and changes the working directory for the command. |
| **`--verbose`** | Enables verbose output for detailed logging. Not supported by all commands. |
| **`--offline`** | Runs in offline mode, without making external network calls. Supported by `func start`, `func init`, and `func new`. Can also be set through the `FUNCTIONS_CORE_TOOLS_OFFLINE` environment variable. |
| **`--version`**, **`-v`** | Displays the version of Azure Functions Core Tools. |
| **`--help`**, **`-h`** | Displays help information. |
| **`--pause-on-error`** | Pauses for additional input before exiting the process. Useful when you launch Core Tools from an integrated development environment (IDE). |

[local.settings.json file]: functions-develop-local.md#local-settings-file
