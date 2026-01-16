---
title: Python developer reference for Azure Functions
description: Understand how to develop, validate, and deploy your Python code projects to Azure Functions using the Python library for Azure Functions.
ms.topic: article
ms.date: 11/09/2025
ms.devlang: python
ms.custom:
  - devx-track-python
  - devdivchpfy22
  - ignite-2024
  - build-2025
  - py-devguide-refactor
zone_pivot_groups: python-mode-functions
#customer intent: As a Python developer, I want to reference the supported features, syntax, and limitations for developing Azure Functions so that I can build and deploy Python serverless apps effectively.
---

# Azure Functions developer reference guide for Python apps

Azure Functions is a serverless compute service that enables you to run event-driven code without provisioning or managing infrastructure. Function executions are triggered by events such as HTTP requests, queue messages, timers, or changes in storage—and scale automatically based on demand.

This guide focuses specifically on building Python-based Azure Functions and helps you:
- Create and run function apps locally
- Understand the Python programming model
- Organize and configure your application
- Deploy and monitor your app in Azure
- Apply best practices for scaling and performance

> Looking for a conceptual overview? See the [Azure Functions Developer Reference](functions-reference.md).
>
> Interested in real-world use cases? Explore the [Scenarios & Samples](functions-scenarios.md?pivots=programming-language-python) page.
::: zone pivot="python-mode-decorators"
## Getting started
Choose the environment that fits your workflow and jump into Azure Functions for Python:
- [Visual Studio Code Quickstart](./how-to-create-function-vs-code.md?pivot=programming-language-python)
- [Core Tools Quickstart](./how-to-create-function-azure-cli.md?pivots=programming-language-python)
::: zone-end  

## Building your function app

This section covers the essential components for creating and structuring your Python function app. Topics include the [programming model](#programming-model), [project structure](#folder-structure), [triggers and bindings](#triggers-and-bindings), and [dependency management](#package-management).

### Programming model

Functions supports two versions of the Python programming model:

| Version | Description |
| ---- | ----- |
| 2.x | Use a decorator-based approach to define triggers and bindings directly in your Python code file. You implement each function as a global, stateless method in a `function_app.py` file or a referenced blueprint file. This model version is recommended for new Python apps. |
| 1.x | You define triggers and bindings for each function in a separate `function.json` file. You implement each function as a global, stateless method in your Python code file. This version of the model supports legacy apps. |

This article targets a specific Python model version. Choose your desired version at the [top of the article](#top).
::: zone pivot="python-mode-configuration"
> [!IMPORTANT]  
> Use the v2 programming model for a **decorator-based approach** to define triggers and bindings directly in your code.

In the Python v1 programming model, each function is defined as a global, stateless `main()` method inside a file named `__init__.py`.
The function’s triggers and bindings are configured separately in a `function.json` file, and the binding `name` values are used as parameters in your `main()` method.

**Example**

Here's a simple function that responds to an HTTP request:
```python
# __init__.py
def main(req):
    user = req.params.get('user')
    return f'Hello, {user}!'
```

Here's the corresponding `function.json` file:
:::code language="json" source="~/functions-quickstart-templates/Functions.Templates/Templates/HttpTrigger-Python/function.json":::

#### Key concepts
- The function has a single HTTP trigger.
- The [HttpRequest] object contains request headers, query parameters, route parameters, and the message body. This function gets the value of the `name` query parameter from the `params` parameter of the [HttpRequest] object.
- To send a name in this example, append `?name={name}` to the exposed function URL. For example, if running locally, the full URL might look like `http://localhost:7071/api/http_trigger?name=Test`.
For examples using bindings, see [Triggers and Bindings](#triggers-and-bindings).

Use the `azure-functions` SDK and include **type annotations** to improve IntelliSense and editor support:
```python
# __init__.py
import azure.functions as func

def http_trigger(req: func.HttpRequest) -> str:
```

```text
# requirements.txt
azure-functions
```

#### The `azure-functions` library
The `azure-functions` Python library provides the core types used to interact with the Azure Functions runtime. To see all types and methods available, visit the [`azure-functions` API](/python/api/azure-functions/).
Your function code can use `azure-functions` to:
- Access trigger input data (for example, `HttpRequest`, `TimerRequest`)
- Create output values (such as `HttpResponse`)
- Interact with runtime-provided context and binding data

If you're using `azure-functions` in your app, it must be included in your project dependencies.

> [!NOTE]
> The `azure-functions` library defines the programming surface for Python Azure Functions, but it isn’t a general-purpose SDK. Use it specifically for authoring and running functions within the Azure Functions runtime.


### Alternative entry point

You can change the default behavior of a function by specifying the `scriptFile` and `entryPoint` properties in the `function.json` file. For example, 
the following `function.json` file directs the runtime to use the `custom_entry()` method in the `main.py` file as the entry point for your Azure function.

```json
{
  "scriptFile": "main.py",
  "entryPoint": "custom_entry",
  "bindings": [
      ...
  ]
}
```

### Folder structure
Use the following structure for a Python Azure Functions project:

```cmd
<project_root>/
│
├── .venv/                   # (Optional) Local Python virtual environment
├── .vscode/                 # (Optional) VS Code workspace settings
│
├── my_first_function/       # Function directory
│   └── __init__.py          # Function code file
│   └── function.json        # Function binding configuration file
│
├── my_second_function/
│   └── __init__.py  
│   └── function.json 
│
├── shared/                  # (Optional) Pure helper code with no triggers/bindings
│   └── utils.py
│
├── additional_functions/    # (Optional) Contains blueprints for organizing related Functions
│   └── blueprint_1.py  
│
├── tests/                   # (Optional) Unit tests for your functions
│   └── test_my_function.py
│
├── .funcignore              # Excludes files from being published
├── host.json                # Global function app configuration
├── local.settings.json      # Local-only app settings (not published)
├── requirements.txt         # (Optional) Defines Python dependencies for remote build
├── Dockerfile               # (Optional) For custom container deployment
```

#### Key files and folders

| File / Folder           | Description                                                                                                      | Required for app to run in Azure       |
|-------------------------|------------------------------------------------------------------------------------------------------------------|----------------------------------------|
| `my_first_function/`    | Directory for a single function.                                                                                 | ✅                                      |
| `__init__.py/`          | Main script where the `my_first_function` function code is defined.                                              | ✅                                      |
| `function.json/`        | Contains the binding configuration for the `my_first_function` function.                                         | ✅                                      |
| `host.json`             | Global configuration for all functions in the app.                                                               | ✅                                      |
| `requirements.txt`      | Python dependencies installed during publish when using [remote build](./python-build-options.md#remote-build).  | ❌ (recommended for package management) |
| `local.settings.json`   | Local-only app settings and secrets (never published).                                                           | ❌ (required for local development)     |
| `.funcignore`           | Specifies files and folders to exclude from deployment (for example, `.venv/`, `tests/`, `local.settings.json`). | ❌ (recommended)                        |
| `.venv/`                | Local virtual environment for Python (excluded from deployment).                                                 | ❌                                      |
| `.vscode/`              | Editor config for Visual Studio Code. Not required for deployment.                                               | ❌                                      |
| `shared/`               | Holds helper code shared across the Function App project                                                         | ❌                                      |
| `additional_functions/` | Used for modular code organization—typically with [blueprints](#organizing-with-blueprints).                     | ❌                                      |
| `tests/`                | Unit tests for your function app. Not published to Azure.                                                        | ❌                                      |
| `Dockerfile`            | Defines a custom container for deployment.                                                                       | ❌                                      |

::: zone-end
::: zone pivot="python-mode-decorators"
In the Python v2 programming model, Azure Functions uses a **decorator-based approach** to define triggers and bindings directly in your code. Each function is implemented as a **global, stateless method** within a `function_app.py` file.

**Example**

Here's a simple function that responds to an HTTP request:
```python
import azure.functions as func

app = func.FunctionApp()

@app.route("hello")
def http_trigger(req):
    user = req.params.get("user")
    return f"Hello, {user}!"
```

```text
# requirements.txt
azure-functions
```

#### Key concepts
- The code imports the `azure-functions` package and uses decorators and types to define the function app.
- The function has a single HTTP trigger.
- The [HttpRequest] object contains request headers, query parameters, route parameters, and the message body. This function gets the value of the `name` query parameter from the `params` parameter of the [HttpRequest] object.
- To send a name in this example, append `?name={name}` to the exposed function URL. For example, if running locally, the full URL might look like `http://localhost:7071/api/http_trigger?name=Test`.
For examples using bindings, see [Triggers and Bindings](#triggers-and-bindings).

#### The `azure-functions` library
The `azure-functions` Python library is a core part of the Azure Functions programming model. It provides the decorators, trigger and binding types, and request/response objects used to define and interact with functions at runtime.
To see all types and decorators available, visit the [`azure-functions` API](/python/api/azure-functions/).
Your function app code depends on this library to:
- Define all functions using the `FunctionApp` object
- Declare triggers and bindings (for example, `@app.route`, `@app.timer_trigger`)
- Access typed inputs and outputs (such as `HttpRequest` and `HttpResponse`, and Out`)

The `azure-functions` must be included in your project dependencies. To learn more, see [package management](#package-management).

> [!NOTE]
> The `azure-functions` library defines the programming surface for Python Azure Functions, but it isn’t a general-purpose SDK. Use it specifically for authoring and running functions within the Azure Functions runtime.


Use **type annotations** to improve IntelliSense and editor support:
```python
def http_trigger(req: func.HttpRequest) -> str:
```

### Organizing with blueprints

For larger or modular apps, use *blueprints* to define functions in separate Python files 
and register them with your main app. This separation keeps your code organized and reusable.

To define and register a blueprint:

1. Define a blueprint in another Python file, such as `http_blueprint.py`:
 
    ```python
    import azure.functions as func
    
    bp = func.Blueprint()
    
    @bp.route(route="default_template")
    def default_template(req: func.HttpRequest) -> func.HttpResponse:
        return func.HttpResponse("Hello World!")
    ```

1. Register the blueprint in main `function_app.py` file:

    ```python
    import azure.functions as func
    from http_blueprint import bp
    
    app = func.FunctionApp()
    app.register_functions(bp)
    ```

By using blueprints, you can:
- Break up your app into reusable modules
- Keep related functions grouped by file or feature
- Extend or share blueprints across projects

> [!NOTE]
> Durable Functions also supports blueprints by using [`azure-functions-durable`](https://pypi.org/project/azure-functions-durable). 
> [View sample →](https://github.com/Azure/azure-functions-durable-python/tree/dev/samples-v2/blueprint)

### Folder structure
Use the following structure for a Python Azure Functions project:

```cmd
<project_root>/
│
├── .venv/                   # (Optional) Local Python virtual environment
├── .vscode/                 # (Optional) VS Code workspace settings
│
├── function_app.py          # Main function entry point (decorator model)
├── shared/                  # (Optional) Pure helper code with no triggers/bindings
│   └── utils.py
│
├── additional_functions/    # (Optional) Contains blueprints for organizing related Functions
│   └── blueprint_1.py  
│
├── tests/                   # (Optional) Unit tests for your functions
│   └── test_my_function.py
│
├── .funcignore              # Excludes files from being published
├── host.json                # Global function app configuration
├── local.settings.json      # Local-only app settings (not published)
├── requirements.txt         # (Optional) Defines Python dependencies for remote build
├── Dockerfile               # (Optional) For custom container deployment
```

#### Key files and folders

| File / Folder           | Description                                                                                                      | Required for app to run in Azure       |
|-------------------------|------------------------------------------------------------------------------------------------------------------|----------------------------------------|
| `function_app.py`       | Main script where Azure Functions and triggers are defined using decorators.                                     | ✅                                      |
| `host.json`             | Global configuration for all functions in the app.                                                               | ✅                                      |
| `requirements.txt`      | Python dependencies installed during publish when using [remote build](./python-build-options.md#remote-build).  | ❌ (recommended for package management) |
| `local.settings.json`   | Local-only app settings and secrets (never published).                                                           | ❌ (required for local development)     |
| `.funcignore`           | Specifies files and folders to exclude from deployment (for example, `.venv/`, `tests/`, `local.settings.json`). | ❌ (recommended)                        |
| `.venv/`                | Local virtual environment for Python (excluded from deployment).                                                 | ❌                                      |
| `.vscode/`              | Editor config for Visual Studio Code. Not required for deployment.                                               | ❌                                      |
| `shared/`               | Holds helper code shared across the Function App project                                                         | ❌                                      |
| `additional_functions/` | Used for modular code organization—typically with [blueprints](#organizing-with-blueprints).                     | ❌                                      |
| `tests/`                | Unit tests for your function app. Not published to Azure.                                                        | ❌                                      |
| `Dockerfile`            | Defines a custom container for deployment.                                                                       | ❌                                      |

::: zone-end


> [NOTE!]
> Include a `requirements.txt` file when you deploy with [remote build](./python-build-options.md#remote-build). If you don't use remote build or want to use another file for defining app dependencies, you can perform a [local build](./python-build-options.md#local-build) and deploy the app with pre-built dependencies.

> For guidance on unit testing, see [Unit Testing](#unit-testing).
> For container deployments, see [Deploy with custom containers](./functions-how-to-custom-container.md?pivots=azure-functions).


---

### Triggers and bindings
Azure Functions uses **triggers** to start function execution and **bindings** to connect your code to other services 
like storage, queues, and databases. In the Python v2 programming model, you declare bindings by using decorators.

Two main types of bindings exist:
- **Triggers** (input that starts the function)
- **Inputs and outputs** (extra data sources or destinations)

For more information about the available triggers and bindings, see [Triggers and Bindings in Azure Functions](./functions-triggers-bindings.md).

::: zone pivot="python-mode-decorators"

#### Example: Timer Trigger with Blob Input

This function:
- Triggers every 10 minutes
- Reads from a Blob by using [SDK Type Bindings](#sdk-type-bindings)
- Caches results and writes to a temporary file

```python
import azure.functions as func
import azurefunctions.extensions.bindings.blob as blob
import logging
import tempfile

CACHED_BLOB_DATA = None

app = func.FunctionApp()

@app.function_name(name="TimerTriggerWithBlob")
@app.schedule(schedule="0 */10 * * * *", arg_name="mytimer")
@app.blob_input(arg_name="client",
                path="PATH/TO/BLOB",
                connection="BLOB_CONNECTION_SETTING")
def timer_trigger_with_blob(mytimer: func.TimerRequest,
                            client: blob.BlobClient,
                            context: func.Context) -> None:
    global CACHED_BLOB_DATA
    if CACHED_BLOB_DATA is None:
        # Download blob and save as a global variable
        CACHED_BLOB_DATA = client.download_blob().readall()

        # Create temp file prefix
        my_prefix = context.invocation_id
        temp_file = tempfile.NamedTemporaryFile(prefix=my_prefix)
        temp_file.write(CACHED_BLOB_DATA)
        logging.info(f"Cached data written to {temp_file.name}")
```
#### Key concepts
- Use SDK type bindings to work with rich types. For more information, see [SDK type bindings](#sdk-type-bindings).
- You can use global variables to cache expensive computations, but their state isn't guaranteed to persist across function executions.
- Temporary files are stored in `tmp/` and aren't guaranteed to persist across invocations or scale-out instances.
- You can access the invocation context of a function through the [Context class](/python/api/azure-functions/azure.functions.context).

::: zone-end


#### Example: HTTP Trigger with Cosmos DB Input and Event Hub Output

This function:
- Triggers on an HTTP request
- Reads from a Cosmos DB
- Writes to an Event Hub output
- Returns an HTTP response

::: zone pivot="python-mode-configuration"
```python
# __init__.py
import azure.functions as func

def main(req: func.HttpRequest,
         documents: func.DocumentList,
         event: func.Out[str]) -> func.HttpResponse:
    
    # Content from HttpRequest and Cosmos DB input
    http_content = req.params.get("body")
    doc_id = documents[0]["id"] if documents else "No documents found"

    event.set(f"HttpRequest content: {http_content} | CosmosDB ID: {doc_id}")

    return func.HttpResponse(
        "Function executed successfully.",
        status_code=200
    )
```

```json
// function.json
{
  "scriptFile": "__init__.py",
  "entryPoint": "main",
  "bindings": [
    {
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["get", "post"],
      "route": "file"
    },
    {
      "type": "http",
      "direction": "out",
      "name": "$return"
    },
    {
      "type": "cosmosDB",
      "direction": "in",
      "name": "documents",
      "databaseName": "test",
      "containerName": "items",
      "id": "cosmosdb-input-test",
      "connection": "COSMOSDB_CONNECTION_SETTING"
    },
    {
      "type": "eventHub",
      "direction": "out",
      "name": "event",
      "eventHubName": "my-test-eventhub",
      "connection": "EVENTHUB_CONNECTION_SETTING"
    }
  ]
}

```

**Key concepts**
- Each function has a single trigger, but it can have multiple bindings.
- Add inputs by specifying the `direction` as "in" in `function.json`. Outputs have a `direction` of `out`.
- You can access request details through the `HttpRequest` object and construct a custom `HttpResponse` with headers, status code, and body.

::: zone-end

::: zone pivot="python-mode-decorators"
```python
import azure.functions as func

app = func.FunctionApp()

@app.function_name(name="HttpTriggerWithCosmosDB")
@app.route(route="file")
@app.cosmos_db_input(arg_name="documents",
                     database_name="test",
                     container_name="items",
                     connection="COSMOSDB_CONNECTION_SETTING")
@app.event_hub_output(arg_name="event",
                      event_hub_name="my-test-eventhub",
                      connection="EVENTHUB_CONNECTION_SETTING")
def http_trigger_with_cosmosdb(req: func.HttpRequest,
                               documents: func.DocumentList,
                               event: func.Out[str]) -> func.HttpResponse:
    # Content from HttpRequest and Cosmos DB input
    http_content = req.params.get('body')
    doc_id = documents[0]['id']

    event.set("HttpRequest content: " + http_content
              + " | CosmosDB ID: " + doc_id)
    
    return func.HttpResponse(
        f"Function executed successfully.",
        status_code=200
    )
```
#### Key concepts
- Use `@route()` or trigger-specific decorators (`@timer_trigger`, `@queue_trigger`, and others) to define how your function is invoked.
- Add inputs by using decorators like `@blob_input`, `@queue_input`, and others.
- Outputs can be:
   - Returned directly (if only one output)
   - Assigned by using `Out` bindings and the `.set()` method for multiple outputs.
- You can access request details through the `HttpRequest` object and construct a custom `HttpResponse` with headers, status code, and body.


### SDK type bindings
For select triggers and bindings, you can work with data types implemented by the underlying Azure SDKs and frameworks. 
By using these _SDK type bindings_, you can interact with binding data as if you were using the underlying service SDK. 
For more information, see [supported SDK type bindings](./functions-triggers-bindings.md?pivots=programming-language-python#sdk-types).
> [!IMPORTANT]  
> SDK type bindings support for Python is only available in the Python v2 programming model.

::: zone-end

### Environment variables
Environment variables in Azure Functions let you securely manage configuration values, connection strings, and app secrets without hardcoding them in your function code.

You can define environment variables:
- Locally: in the [local.settings.json file](functions-develop-local.md#local-settings-file), during local development.
- In Azure: as [Application Settings](functions-how-to-use-azure-function-app-settings.md#settings) in your Function App's configuration page in the Azure portal.

Access the variables directly in your code by using `os.environ` or `os.getenv`.
```python
setting_value = os.getenv("myAppSetting", "default_value")
```

> [!NOTE]
> Azure Functions also recognizes system environment variables that configure the Functions runtime and Python worker behavior. These variables aren't explicitly used in your function code but affect how your app runs. For a complete list of system environment variables, see [App settings reference](./functions-app-settings.md).


### Package management

To use other Python packages in your Azure Functions app, list them in a `requirements.txt` file at the root of your project. These packages are imported by Python's import system, and you can then reference those packages as usual.
To learn more about building and deployment options with external dependencies, see [Build Options for Python Function Apps](./python-build-options.md).

For example, the following sample shows how the `requests` module is included and used in the function app.
```text
<requirements.txt>
requests==2.31.0
```
Install the package locally with `pip install -r requirements.txt`.

Once the package is installed, you can import and use it in your function code:

::: zone pivot="python-mode-configuration"

```python
import azure.functions as func
import requests

def main(req: func.HttpRequest) -> func.HttpResponse:
    r = requests.get("https://api.github.com")
    return func.HttpResponse(f"Status: {r.status_code}")
```

::: zone-end

::: zone pivot="python-mode-decorators"

```python
import azure.functions as func
import requests

app = func.FunctionApp()

@app.function_name(name="HttpExample")
@app.route(route="call_api")
def main(req: func.HttpRequest) -> func.HttpResponse:
    r = requests.get("https://api.github.com")
    return func.HttpResponse(f"Status: {r.status_code}")
```

::: zone-end

#### Considerations
- Conflicts with built-in modules:
   - Avoid naming your project folders after [Python standard libraries](https://docs.python.org/3/library/) (for example, `email/`, `json/`).
   - Don't include Python native libraries (like `logging`, `asyncio`, or `uuid`) in `requirements.txt`.
- Deployment:
   - To prevent [`ModuleNotFound` errors](./recover-python-functions.md#troubleshoot-modulenotfounderror), ensure all required dependencies are listed in `requirements.txt`.
   - If you update your app's Python version, rebuild and redeploy your app on the new Python version to avoid dependency conflicts with previously built packages.
- Non-PyPI Dependencies:
   - You can include dependencies that aren't available on PyPI in your app, such as local packages, wheel files, or private feeds. See [Custom dependencies in Python  Azure Functions](./python-build-options.md#custom-dependencies) for setup instructions.
- Azure Functions Python worker dependencies:
   - If your package contains certain libraries that might collide with worker's dependencies (for example, `protobuf` or `grpcio`), configure [PYTHON_ISOLATE_WORKER_DEPENDENCIES](./functions-app-settings.md#python_isolate_worker_dependencies) to 1 in app settings to prevent your application from referring to worker's dependencies. For Python 3.13 and above, [this feature is enabled by default](#python-313-updates).

## Running and deploying
This section provides information about [running functions locally](#running-locally), [Python version support](#supported-python-versions), [build and deployment options](#build-and-deployment), and runtime configuration. Use this information to successfully run your function app in both local and Azure environments.

### Running locally
You can run and test your Python function app on your local machine before deploying to Azure. 

#### Using Azure Functions Core Tools
Install [Azure Functions Core Tools](./functions-run-local.md) and start the local runtime by running the `func start` command from your project root:

```bash
func start
```

When you start the function app locally, Core Tools displays all the functions it finds for your app:

```output
Functions:
        http_trigger:  http://localhost:7071/api/http_trigger
```

You can learn more about how to use Core Tools by visiting [Develop Azure Functions locally using Core Tools](./functions-run-local.md).

#### Invoking the function directly

By using `azure-functions >= 1.21.0`, you can also call functions directly by using the Python interpreter without running Core Tools. This approach is useful for quick unit tests:

::: zone pivot="python-mode-decorators"

```python
# function_app.py
import azure.functions as func

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)

@app.route(route="http_trigger")
def http_trigger(req: func.HttpRequest) -> func.HttpResponse:
    return "Hello, World!"

# Test the function directly
print(http_trigger(None))
```

To see the output, run the file directly with Python:

```bash
> python function_app.py

Hello, World!
```

::: zone-end

::: zone pivot="python-mode-configuration"

```python
# __init__.py
import azure.functions as func

def main(req: func.HttpRequest) -> func.HttpResponse:
    return func.HttpResponse("Hello, World!")

# Test the function directly
print(main(None))
```

To see the output, run the file directly with Python:

```bash
> python __init__.py

Hello, World!
```

::: zone-end

This approach doesn't require any extra packages or setup and is ideal for quick validation during development. For more in-depth testing, see [Unit Testing](#unit-testing)

### Supported Python versions
Azure Functions supports the Python versions listed in [Supported languages in Azure Functions](./supported-languages.md).
For more general information, see the [Azure Functions runtime support policy](./language-support-policy.md).

> [!Important]  
> If you change the Python version for your function app, you must rebuild and redeploy the app by using the new version. 
> Existing deployment artifacts and dependencies aren't automatically rebuilt when the Python version changes.

## Build and Deployment
To learn more about the recommended build mechanism for your scenario, see [Build Options](./python-build-options.md). For a general overview of deployment, see [Deployment technologies in Azure Functions](functions-deployment-technologies.md).

**Deployment Mechanisms Quick Comparison**

| **Tool / Platform**                                                                             | **Command / Action**                                                                                                                  | **Best Use Case**                                                                                                                                             |
|-------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [**Azure Functions Core Tools**](./functions-run-local.md)                                      | [`func azure functionapp publish <APP_NAME>`](./functions-core-tools-reference.md#func-azure-functionapp-publish)                     | Ideal for CI runs, local automation, or when working cross-platform.                                                                                          |
| [**AZ CLI**](/cli/azure/functionapp)                                                            | [`az functionapp deployment source config-zip`](/cli/azure/functionapp/deployment/source#az-functionapp-deployment-source-config-zip) | Useful when scripting deployments outside of Core Tools. Works well in automated pipelines or cloud-based terminals (Azure Cloud Shell).                      |
| [**Visual Studio Code (Azure Functions Extension)**](./functions-develop-vs-code.md)            | **Command Palette → “Azure Functions: Deploy to Azure…”**                                                                             | Best for beginners or interactive deployments. Automatically handles packaging and build.                                                                     |
| [**GitHub Actions**](./functions-how-to-github-actions.md)                                      | `Azure/functions-action@v1`                                                                                                           | Ideal for GitHub-based CI/CD. Enables automated deployments on push or PR merges.                                                                             |
| [**Azure Pipelines**](./functions-how-to-azure-devops.md)                                       | `AzureFunctionApp@2` task                                                                                                             | Enterprise CI/CD using Azure DevOps. Best for controlled release workflows, gated builds, and multi-stage pipelines.                                          |
| [**Custom Container Deployment**](./functions-how-to-custom-container.md?pivot=azure-functions) | Push container → `az functionapp create --image <container>`                                                                          | Required when you need OS-level packages, custom Python builds, pinned runtimes, or unsupported dependencies (for example, system libraries, local binaries). |
| [**Portal-based Function Creation**](./functions-create-function-app-portal.md)                 | Create function in the [Azure portal](https://portal.azure.com) → inline editor                                                       | Use only for **simple**, dependency-free functions. Great for demos or learning, but **not recommended** for apps requiring third-party packages.             |

> [!NOTE]  
> [**Portal-based Function Creation**](./functions-create-function-app-portal.md) doesn't support third-party dependencies and isn't recommended for creating production apps. You can't install or reference packages outside `azure-functions` and the built-in Python standard library.



[!INCLUDE [functions-linux-consumption-retirement](../../includes/functions-linux-consumption-retirement.md)]

### Python 3.13+ updates
Starting with Python 3.13, Azure Functions introduces several major runtime and performance improvements that affect how you build and run your apps.
Key changes include:

::: zone pivot="python-mode-decorators"

- Runtime version control: You can now optionally pin or upgrade your app to specific Python worker versions by referencing the [`azure-functions-runtime`](https://pypi.org/project/azure-functions-runtime/) package in your `requirements.txt`.
   - Without version control enabled, your app runs on a default version of the Python runtime, which Functions manages. You must modify your *requirements.txt* file to request the latest released version, a prereleased version, or to pin your app to a specific version of the Python runtime.
   - You enable runtime version control by adding a reference to the Python runtime package to your *requirements.txt* file, where the value assigned to the package determines the runtime version used.
   - Avoid pinning any production app to prerelease (alpha, beta, or dev) runtime versions.
   - To be aware of changes, review [Python runtime release notes](https://github.com/Azure/azure-functions-python-worker/releases) regularly.  
   - The following table indicates the versioning behavior based on the version value of this setting in your *requirements.txt* file:
      
      | Version                      | Example                          | Behavior                                                                                                                                                                                                                                                                                                                                                                                                                            |
      |------------------------------|----------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
      | No value set                 | `azure-functions-runtime`        | Your Python 3.13+ app runs on the latest available version of the Functions Python runtime. This option is best for staying current with platform improvements and features, since your app automatically receives the latest stable runtime updates.                                                                                                                                                                               |
      | Pinned to a specific version | `azure-functions-runtime==1.2.0` | Your Python 3.13+ app stays on the pinned runtime version and doesn't receive automatic updates. You must instead manually update your pinned version to take advantage of new features, fixes, and improvements in the runtime. Pinning is recommended for critical production workloads where stability and predictability are essential. Pinning also lets you test your app on prereleased runtime versions during development. |
      | No package reference         | n/a                              | By not setting the `azure-functions-runtime`, your Python 3.13+ app runs on a default version of the Python runtime that is behind the latest released version. Updates are made periodically by Functions. This option ensures stability and broad compatibility. However, access to the newest features and fixes are delayed until the default version is updated.                                                               |

- Dependency isolation: Your app’s dependencies (like `grpcio` or `protobuf`) are fully isolated from the worker’s dependencies, preventing version conflicts. The app setting [`PYTHON_ISOLATE_WORKER_DEPENDENCIES`](./functions-app-settings.md#python_isolate_worker_dependencies) will have no impact for apps running on Python 3.13 or later.
- Simplified [HTTP streaming](./functions-bindings-http-webhook-trigger.md?tabs=python-v2&pivots=programming-language-python#http-streams-1) setup—no special app settings required.
- Removed support for worker extensions and shared memory features.

::: zone-end

::: zone pivot="python-mode-configuration"

- Runtime version control: You can now optionally pin or upgrade your app to specific Python worker versions by referencing the [`azure-functions-runtime-v1`](https://pypi.org/project/azure-functions-runtime-v1/) package in your `requirements.txt`.
   - Without version control enabled, your app runs on a default version of the Python runtime, which Functions manages. You must modify your *requirements.txt* file to request the latest released version, a prereleased version, or to pin your app to a specific version of the Python runtime.
   - You enable runtime version control by adding a reference to the Python runtime package to your *requirements.txt* file, where the value assigned to the package determines the runtime version used.
   - Avoid pinning any production app to prerelease (alpha, beta, or dev) runtime versions.
   - To be aware of changes, review [Python runtime release notes](https://github.com/Azure/azure-functions-python-worker/releases) regularly.    
   - The following table indicates the versioning behavior based on the version value of this setting in your *requirements.txt* file:
      
      | Version                      | Example                             | Behavior                                                                                                                                                                                                                                                                                                                                                                                                                            |
      |------------------------------|-------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
      | No value set                 | `azure-functions-runtime-v1`        | Your Python 3.13+ app runs on the latest available version of the Functions Python runtime. This option is best for staying current with platform improvements and features, since your app automatically receives the latest stable runtime updates.                                                                                                                                                                               |
      | Pinned to a specific version | `azure-functions-runtime-v1==1.2.0` | Your Python 3.13+ app stays on the pinned runtime version and doesn't receive automatic updates. You must instead manually update your pinned version to take advantage of new features, fixes, and improvements in the runtime. Pinning is recommended for critical production workloads where stability and predictability are essential. Pinning also lets you test your app on prereleased runtime versions during development. |
      | No package reference         | n/a                                 | By not setting the `azure-functions-runtime-v1`, your Python 3.13+ app runs on a default version of the Python runtime that is behind the latest released version. Updates are made periodically by Functions. This option ensures stability and broad compatibility. However, access to the newest features and fixes are delayed until the default version is updated.                                                            |

- Dependency isolation: Your app’s dependencies (like `grpcio` or `protobuf`) are fully isolated from the worker’s dependencies, preventing version conflicts. The app setting [`PYTHON_ISOLATE_WORKER_DEPENDENCIES`](./functions-app-settings.md#python_isolate_worker_dependencies) will have no impact for apps running on Python 3.13 or later.
- Removed support for worker extensions and shared memory features.

::: zone-end

## Observability and testing

This section covers [logging](#logging-and-monitoring), [monitoring](#opentelemetry-support), and [testing capabilities](#unit-testing) to help you debug problems, track performance, and ensure the reliability of your Python function apps.

### Logging and monitoring

Azure Functions exposes a root logger that you can use directly with Python's built-in `logging` module. Any messages written using this logger are automatically sent to **Application Insights** when your app is running in Azure.

Logging allows you to capture runtime information and diagnose issues without needing any more setup.

#### Logging example with an HTTP trigger

::: zone pivot="python-mode-configuration"

```python
import logging
import azure.functions as func

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.debug("Example debug log")
    logging.info("Example info log")
    logging.warning("Example warning")
    logging.error("Example error log")
    return func.HttpResponse("OK")
```

::: zone-end

::: zone pivot="python-mode-decorators"

```python
import logging
import azure.functions as func

app = func.FunctionApp()

@app.route(route="http_trigger")
def http_trigger(req) -> func.HttpResponse:
    logging.debug("Example debug log")
    logging.info("Example info log")
    logging.warning("Example warning")
    logging.error("Example error log")
    return func.HttpResponse("OK")
```

::: zone-end

You can use the full set of logging levels (`debug`, `info`, `warning`, `error`, `critical`), and they appear in the Azure portal under Logs or Application Insights.

To learn more about monitoring Azure Functions in the portal, see [Monitor Azure Functions](functions-monitoring.md).

> [!NOTE]
> To view debug logs in Application Insights, more setup is required. You can enable this feature by setting [PYTHON_ENABLE_DEBUG_LOGGING](./functions-app-settings.md#python_enable_debug_logging) to `1` and setting `logLevel` to `trace` or `debug` in your [host.json file](./functions-host-json.md#logging). By default, debug logs aren't visible in Application Insights.

#### Logging from background threads

If your function starts a new thread and needs to log from that thread, make sure to pass the `context` argument into the thread. The `context` contains thread-local storage and the current `invocation_id`, which must be set on the worker thread in order for logs to be associated properly with the function execution.

::: zone pivot="python-mode-configuration"

```python
import logging
import threading
import azure.functions as func

def main(req: func.HttpRequest, context) -> func.HttpResponse:
    logging.info("Function started")
    t = threading.Thread(target=log_from_thread, args=(context,))
    t.start()
    return "okay"

def log_from_thread(context):
    # Associate the thread with the current invocation
    context.thread_local_storage.invocation_id = context.invocation_id  
    logging.info("Logging from a background thread")
```

::: zone-end

::: zone pivot="python-mode-decorators"

```python
import azure.functions as func
import logging
import threading

app = func.FunctionApp()

@app.route(route="http_trigger")
def http_trigger(req, context) -> func.HttpResponse:
    logging.info("Function started")
    t = threading.Thread(target=log_from_thread, args=(context,))
    t.start()
    return "okay"

def log_from_thread(context):
    # Associate the thread with the current invocation
    context.thread_local_storage.invocation_id = context.invocation_id  
    logging.info("Logging from a background thread")
```

::: zone-end

#### Configuring custom loggers
You can configure custom loggers in Python when you need more control over logging behavior, such as custom formatting, log filtering, or third-party integrations.
To configure a custom logger, use Python's `logging.getLogger()` with a custom name and add handlers or formatters as needed.
```python
import logging

custom_logger = logging.getLogger('my_custom_logger')
```


### OpenTelemetry support
Azure Functions for Python also supports **OpenTelemetry**, which enables you to emit traces, metrics, and logs in a standardized format. Using OpenTelemetry is especially valuable for distributed applications or scenarios where you want to export telemetry to tools outside of Application Insights (such as Grafana or Jaeger).
> See our [OpenTelemetry Quickstart for Azure Functions (Python)](./opentelemetry-howto.md?pivot=programming-language-python) for setup instructions and sample code.

### Unit testing
Write and run unit tests for your functions by using `pytest`.
You can test Python functions like other Python code by using standard testing frameworks. For most bindings, you can create a mock input object by creating an instance of an appropriate class from the `azure.functions` package.

By using `my_function` as an example, the following example is a mock test of an HTTP-triggered function:

First, create the *<project_root>/function_app.py* file and implement the `my_function` function as the HTTP trigger.

```python
# <project_root>/function_app.py
import azure.functions as func
import logging

app = func.FunctionApp()

# Define the HTTP trigger that accepts the ?value=<int> query parameter
# Double the value and return the result in HttpResponse
@app.function_name(name="my_function")
@app.route(route="hello")
def my_function(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Executing myfunction.')

    initial_value: int = int(req.params.get('value'))
    doubled_value: int = initial_value * 2

    return func.HttpResponse(
        body=f"{initial_value} * 2 = {doubled_value}",
        status_code=200
    )
```

You can start writing test cases for your HTTP trigger.

```python
# <project_root>/test_my_function.py
import unittest
import azure.functions as func

from function_app import my_function

class TestFunction(unittest.TestCase):
  def test_my_function(self):
    # Construct a mock HTTP request.
    req = func.HttpRequest(method='GET',
                           body=None,
                           url='/api/my_function',
                           params={'value': '21'})
    # Call the function.
    func_call = main.build().get_user_function()
    resp = func_call(req)
    # Check the output.
    self.assertEqual(
        resp.get_body(),
        b'21 * 2 = 42',
    )
```

Inside your Python virtual environment folder, you can run the following commands to test the app:
```bash
pip install pytest
pytest test_my_function.py
```

You see the `pytest` results in the terminal, like this:
```bash
============================================================================================================ test session starts ============================================================================================================
collected 1 item                                                                                                                                                                                                                             

test_my_function.py .                                                                                                                                                                                                                  [100%] 
============================================================================================================= 1 passed in 0.24s ============================================================================================================= 
```

## Optimization and advanced topics

To learn more about optimizing your Python functions apps, see these articles:

- [Scaling & Performance](./python-scale-performance-reference.md)
- [Using Flask Framework with Azure Functions](/samples/azure-samples/flask-app-on-azure-functions/azure-functions-python-create-flask-app/)
- [Durable Functions](./durable/durable-functions-overview.md)
- [HTTP Streaming](./functions-bindings-http-webhook-trigger.md?tabs=python-v2&pivots=programming-language-python#http-streams-1)

## Related articles

For more information about Functions, see these articles:

* [Azure Functions package API documentation](/python/api/azure-functions/azure.functions)
* [Best practices for Azure Functions](functions-best-practices.md)
* [Azure Functions triggers and bindings](functions-triggers-bindings.md)
* [Blob Storage bindings](functions-bindings-storage-blob.md)
* [HTTP and webhook bindings](functions-bindings-http-webhook.md)
* [Queue Storage bindings](functions-bindings-storage-queue.md)
* [Timer triggers](functions-bindings-timer.md)

[Having issues with using Python? Let us know and file an issue.](https://github.com/Azure/azure-functions-python-worker/issues)


[HttpRequest]: /python/api/azure-functions/azure.functions.httprequest