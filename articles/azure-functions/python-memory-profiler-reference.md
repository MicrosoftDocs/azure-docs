---
title: Memory profiling of Python apps in Azure Functions
description: Learn how to profile the memory usage of Python apps and identify memory bottleneck.
ms.topic: how-to
ms.date: 4/11/2023
ms.devlang: python
ms.custom: devx-track-python, py-fresh-zinc
---
# Profile Python apps memory usage in Azure Functions

During development or after deploying your local Python function app project to Azure, it's a good practice to analyze for potential memory bottlenecks in your functions. Such bottlenecks can decrease the performance of your functions and lead to errors. The following instructions show you how to use the [memory-profiler](https://pypi.org/project/memory-profiler) Python package, which provides line-by-line memory consumption analysis of your functions as they execute.

> [!NOTE]
> Memory profiling is intended only for memory footprint analysis in development environments. Please do not apply the memory profiler on production function apps.

## Prerequisites

Before you start developing a Python function app, you must meet these requirements:

* [Python 3.7 or above](https://www.python.org/downloads). To check the full list of supported Python versions in Azure Functions, see the [Python developer guide](functions-reference-python.md#python-version).

* The [Azure Functions Core Tools](functions-run-local.md#v2), version 4.x or greater. Check your version with `func --version`. To learn about updating, see [Azure Functions Core Tools on GitHub](https://github.com/Azure/azure-functions-core-tools).

* [Visual Studio Code](https://code.visualstudio.com/) installed on one of the [supported platforms](https://code.visualstudio.com/docs/supporting/requirements#_platforms).

* An active Azure subscription.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Memory profiling process

1. In your requirements.txt, add `memory-profiler` to ensure the package is bundled with your deployment. If you're developing on your local machine, you may want to [activate a Python virtual environment](create-first-function-cli-python.md#create-venv) and do a package resolution by `pip install -r requirements.txt`.

2. In your function script (for example, *\_\_init\_\_.py* for the Python v1 programming model and *function_app.py* for the v2 model), add the following lines above the `main()` function. These lines ensure the root logger reports the child logger names, so that the memory profiling logs are distinguishable by the prefix `memory_profiler_logs`.

    ```python
    import logging
    import memory_profiler
    root_logger = logging.getLogger()
    root_logger.handlers[0].setFormatter(logging.Formatter("%(name)s: %(message)s"))
    profiler_logstream = memory_profiler.LogFile('memory_profiler_logs', True)

3. Apply the following decorator above any functions that need memory profiling. The decorator doesn't work directly on the trigger entrypoint `main()` method. You need to create subfunctions and decorate them. Also, due to a memory-profiler known issue, when applying to an async coroutine, the coroutine return value is always `None`.

    ```python
    @memory_profiler.profile(stream=profiler_logstream)

4. Test the memory profiler on your local machine by using Azure Functions Core Tools command `func host start`. When you invoke the functions, they should generate a memory usage report. The report contains file name, line of code, memory usage, memory increment, and the line content in it.

5. To check the memory profiling logs on an existing function app instance in Azure, you can query the memory profiling logs for recent invocations with [Kusto](/azure/azure-monitor/logs/log-query-overview) queries in Application Insights, Logs.

    :::image type="content" source="media/python-memory-profiler-reference/application-insights-query.png" alt-text="Screenshot showing the query memory usage of a Python app in Application Insights.":::

    ```kusto
    traces
    | where timestamp > ago(1d)
    | where message startswith_cs "memory_profiler_logs:"
    | parse message with "memory_profiler_logs: " LineNumber "  " TotalMem_MiB "  " IncreMem_MiB "  " Occurrences "  " Contents
    | union (
        traces
        | where timestamp > ago(1d)
        | where message startswith_cs "memory_profiler_logs: Filename: "
        | parse message with "memory_profiler_logs: Filename: " FileName
        | project timestamp, FileName, itemId
    )
    | project timestamp, LineNumber=iff(FileName != "", FileName, LineNumber), TotalMem_MiB, IncreMem_MiB, Occurrences, Contents, RequestId=itemId
    | order by timestamp asc
    ```
    
## Example

Here's an example of performing memory profiling on an asynchronous and a synchronous HTTP trigger, named "HttpTriggerAsync" and "HttpTriggerSync" respectively. We'll build a Python function app that simply sends out GET requests to the Microsoft's home page.

### Create a Python function app

A Python function app should follow Azure Functions specified [folder structure](functions-reference-python.md#folder-structure). To scaffold the project, we recommend using the Azure Functions Core Tools by running the following commands:

# [v1](#tab/v1)

```bash
func init PythonMemoryProfilingDemo --python
cd PythonMemoryProfilingDemo
func new -l python -t HttpTrigger -n HttpTriggerAsync -a anonymous
func new -l python -t HttpTrigger -n HttpTriggerSync -a anonymous
```

# [v2](#tab/v2)

```bash
func init PythonMemoryProfilingDemov2 --python -m v2
cd PythonMemoryProfilingDemov2
```

For the Python V2 programming model, triggers and bindings are created as decorators within the Python file itself, the *function_app.py* file. For information on how to create a new function with the new programming model, see the [Azure Functions Python developer guide](https://aka.ms/pythonprogrammingmodel). `func new` isn't supported for the preview of the V2 Python programming model.

---

### Update file contents

The *requirements.txt* defines the packages that are used in our project. Besides the Azure Functions SDK and memory-profiler, we introduce `aiohttp` for asynchronous HTTP requests and `requests` for synchronous HTTP calls.

```text
# requirements.txt

azure-functions
memory-profiler
aiohttp
requests
```

Create the asynchronous HTTP trigger.

# [v1](#tab/v1)

Replace the code in the asynchronous HTTP trigger *HttpTriggerAsync/\_\_init\_\_.py* with the following code, which configures the memory profiler, root logger format, and logger streaming binding.

```python
# HttpTriggerAsync/__init__.py

import azure.functions as func
import aiohttp
import logging
import memory_profiler

# Update root logger's format to include the logger name. Ensure logs generated
# from memory profiler can be filtered by "memory_profiler_logs" prefix.
root_logger = logging.getLogger()
root_logger.handlers[0].setFormatter(logging.Formatter("%(name)s: %(message)s"))
profiler_logstream = memory_profiler.LogFile('memory_profiler_logs', True)

async def main(req: func.HttpRequest) -> func.HttpResponse:
    await get_microsoft_page_async('https://microsoft.com')
    return func.HttpResponse(
        f"Microsoft page loaded.",
        status_code=200
    )

@memory_profiler.profile(stream=profiler_logstream)
async def get_microsoft_page_async(url: str):
    async with aiohttp.ClientSession() as client:
        async with client.get(url) as response:
            await response.text()
    # @memory_profiler.profile does not support return for coroutines.
    # All returns become None in the parent functions.
    # GitHub Issue: https://github.com/pythonprofilers/memory_profiler/issues/289
```

# [v2](#tab/v2)

Replace the code in the *function_app.py* file with the following code, which configures the memory profiler, root logger format, and logger streaming binding.

```python
# function_app.py
import azure.functions as func
import logging
import aiohttp
import requests
import memory_profiler

app = func.FunctionApp()

# Update root logger's format to include the logger name. Ensure logs generated
# from memory profiler can be filtered by "memory_profiler_logs" prefix.
root_logger = logging.getLogger()
root_logger.handlers[0].setFormatter(logging.Formatter("%(name)s: %(message)s"))
profiler_logstream = memory_profiler.LogFile('memory_profiler_logs', True)

@app.function_name(name="HttpTriggerAsync")
@app.route(route="HttpTriggerAsync", auth_level=func.AuthLevel.ANONYMOUS)
async def test_function(req: func.HttpRequest) -> func.HttpResponse:
    await get_microsoft_page_async('https://microsoft.com')
    return func.HttpResponse(f"Microsoft page loaded.")

@memory_profiler.profile(stream=profiler_logstream)
async def get_microsoft_page_async(url: str):
    async with aiohttp.ClientSession() as client:
        async with client.get(url) as response:
            await response.text()
    # @memory_profiler.profile does not support return for coroutines.
    # All returns become None in the parent functions.
    # GitHub Issue: https://github.com/pythonprofilers/memory_profiler/issues/289
```

---

Create the synchronous HTTP trigger.

# [v1](#tab/v1)

Replace the code in the asynchronous HTTP trigger *HttpTriggerSync/\_\_init\_\_.py* with the following code.

```python
# HttpTriggerSync/__init__.py

import azure.functions as func
import requests
import logging
import memory_profiler

# Update root logger's format to include the logger name. Ensure logs generated
# from memory profiler can be filtered by "memory_profiler_logs" prefix.
root_logger = logging.getLogger()
root_logger.handlers[0].setFormatter(logging.Formatter("%(name)s: %(message)s"))
profiler_logstream = memory_profiler.LogFile('memory_profiler_logs', True)

def main(req: func.HttpRequest) -> func.HttpResponse:
    content = profile_get_request('https://microsoft.com')
    return func.HttpResponse(
        f"Microsoft page response size: {len(content)}",
        status_code=200
    )

@memory_profiler.profile(stream=profiler_logstream)
def profile_get_request(url: str):
    response = requests.get(url)
    return response.content
```

# [v2](#tab/v2)

Add this code to the bottom of the existing *function_app.py* file.

```python
@app.function_name(name="HttpTriggerSync")
@app.route(route="HttpTriggerSync", auth_level=func.AuthLevel.ANONYMOUS)
def test_function(req: func.HttpRequest) -> func.HttpResponse:
    content = profile_get_request('https://microsoft.com')
    return func.HttpResponse(f"Microsoft Page Response Size: {len(content)}")

@memory_profiler.profile(stream=profiler_logstream)
def profile_get_request(url: str):
    response = requests.get(url)
    return response.content
```

---

### Profile Python function app in local development environment

After you make the above changes, there are a few more steps to initialize a Python virtual environment for Azure Functions runtime.

1. Open a Windows PowerShell or any Linux shell as you prefer.
2. Create a Python virtual environment by `py -m venv .venv` in Windows, or `python3 -m venv .venv` in Linux.
3. Activate the Python virtual environment with `.venv\Scripts\Activate.ps1` in Windows PowerShell or `source .venv/bin/activate` in Linux shell.
4. Restore the Python dependencies with `pip install -r requirements.txt`
5. Start the Azure Functions runtime locally with Azure Functions Core Tools `func host start`
6. Send a GET request to `https://localhost:7071/api/HttpTriggerAsync` or `https://localhost:7071/api/HttpTriggerSync`.
7. It should show a memory profiling report similar to the following section in Azure Functions Core Tools.

    ```text
    Filename: <ProjectRoot>\HttpTriggerAsync\__init__.py
    Line #    Mem usage    Increment  Occurrences   Line Contents
    ============================================================
        19     45.1 MiB     45.1 MiB           1   @memory_profiler.profile
        20                                         async def get_microsoft_page_async(url: str):
        21     45.1 MiB      0.0 MiB           1       async with aiohttp.ClientSession() as client:
        22     46.6 MiB      1.5 MiB          10           async with client.get(url) as response:
        23     47.6 MiB      1.0 MiB           4               await response.text()
    ```

## Next steps

For more information about Azure Functions Python development, see the following resources:

* [Azure Functions Python developer guide](functions-reference-python.md)
* [Best practices for Azure Functions](functions-best-practices.md)
* [Azure Functions developer reference](functions-reference.md)
