---
title: Memory profiling on Python apps in Azure Functions
description: Learn how to profile Python apps memory usage and identify memory bottleneck.
ms.topic: how-to
author: hazhzeng
ms.author: hazeng
ms.date: 3/22/2021
ms.custom: devx-track-python
---
# Profile Python apps memory usage in Azure Functions

During development or after deploying your local Python function app project to Azure, it's a good practice to analyze for potential memory bottlenecks in your functions. Such bottlenecks can decrease the performance of your functions and lead to errors. The following instruction show you how to use the [memory-profiler](https://pypi.org/project/memory-profiler) Python package, which provides line-by-line memory consumption analysis of your functions as they execute.

> [!NOTE]
> Memory profiling is intended only for memory footprint analysis on development environment. Please do not apply the memory profiler on production function apps.

## Prerequisites

Before you start developing a Python function app, you must meet these requirements:

* [Python 3.6.x or above](https://www.python.org/downloads/release/python-374/). To check the full list of supported Python versions in Azure Functions, please visit [Python developer guide](functions-reference-python.md#python-version).

* The [Azure Functions Core Tools](functions-run-local.md#v2) version 3.x.

* [Visual Studio Code](https://code.visualstudio.com/) installed on one of the [supported platforms](https://code.visualstudio.com/docs/supporting/requirements#_platforms).

* An active Azure subscription.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Memory profiling process

1. In your requirements.txt, add `memory-profiler` to ensure the package will be bundled with your deployment. If you are developing on your local machine, you may want to [activate a Python virtual environment](create-first-function-cli-python.md#create-venv) and do a package resolution by `pip install -r requirements.txt`.

2. In your function script (usually \_\_init\_\_.py), add the following lines above the `main()` function. This will ensure the root logger reports the child logger names, so that the memory profiling logs are distinguishable by the prefix `memory_profiler_logs`.

    ```python
    import logging
    import memory_profiler
    root_logger = logging.getLogger()
    root_logger.handlers[0].setFormatter(logging.Formatter("%(name)s: %(message)s"))
    profiler_logstream = memory_profiler.LogFile('memory_profiler_logs', True)

3. Apply the following decorator above any functions that need memory profiling. This does not work directly on the trigger entrypoint `main()` method. You need to create subfunctions and decorate them. Also, due to a memory-profiler known issue, when applying to an async coroutine, the coroutine return value will always be None.

    ```python
    @memory_profiler.profile(stream=profiler_logstream)

4. Test the memory profiler on your local machine by using azure Functions Core Tools command `func host start`. This should generate a memory usage report with file name, line of code, memory usage, memory increment, and the line content in it.

5. To check the memory profiling logs on an existing function app instance in Azure, you can query the memory profiling logs in recent invocations by pasting the following Kusto queries in Application Insights, Logs.

:::image type="content" source="media/python-memory-profiler-reference/application-insights-query.png" alt-text="Query memory usage of a Python app in Application Insights":::

```text
traces
| where timestamp > ago(1d)
| where message startswith_cs "memory_profiler_logs:"
| parse message with "memory_profiler_logs: " LineNumber "  " TotalMem_MiB "  " IncreMem_MiB "  " Occurences "  " Contents
| union (
    traces
    | where timestamp > ago(1d)
    | where message startswith_cs "memory_profiler_logs: Filename: "
    | parse message with "memory_profiler_logs: Filename: " FileName
    | project timestamp, FileName, itemId
)
| project timestamp, LineNumber=iff(FileName != "", FileName, LineNumber), TotalMem_MiB, IncreMem_MiB, Occurences, Contents, RequestId=itemId
| order by timestamp asc
```

## Example

Here is an example of performing memory profiling on an asynchronous and a synchronous HTTP triggers, named "HttpTriggerAsync" and "HttpTriggerSync" respectively. We will build a Python function app that simply sends out GET requests to the Microsoft's home page.

### Create a Python function app

A Python function app should follow Azure Functions specified [folder structure](functions-reference-python.md#folder-structure). To scaffold the project, we recommend using the Azure Functions Core Tools by running the following commands:

```bash
func init PythonMemoryProfilingDemo --python
cd PythonMemoryProfilingDemo
func new -l python -t HttpTrigger -n HttpTriggerAsync -a anonymous
func new -l python -t HttpTrigger -n HttpTriggerSync -a anonymous
```

### Update file contents

The requirements.txt defines the packages that will be used in our project. Besides the Azure Functions SDK and memory-profiler, we introduce `aiohttp` for asynchronous HTTP requests and `requests` for synchronous HTTP calls.

```text
# requirements.txt

azure-functions
memory-profiler
aiohttp
requests
```

We also need to rewrite the asynchronous HTTP trigger `HttpTriggerAsync/__init__.py` and configure the memory profiler, root logger format, and logger streaming binding.

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
        f"Microsoft Page Is Loaded",
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

For synchronous HTTP trigger, please refer to the following `HttpTriggerSync/__init__.py` code section:

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
        f"Microsoft Page Response Size: {len(content)}",
        status_code=200
    )

@memory_profiler.profile(stream=profiler_logstream)
def profile_get_request(url: str):
    response = requests.get(url)
    return response.content
```

### Profile Python function app in local development environment

After making all the above changes, there are a few more steps to initialize a Python virtual envionment for Azure Functions runtime.

1. Open a Windows PowerShell or any Linux shell as you prefer.
2. Create a Python virtual environment by `py -m venv .venv` in Windows, or `python3 -m venv .venv` in Linux.
3. Activate the Python virutal environment with `.venv\Scripts\Activate.ps1` in Windows PowerShell or `source .venv/bin/activate` in Linux shell.
4. Restore the Python dependencies with `pip install requirements.txt`
5. Start the Azure Functions runtime locally with Azure Functions Core Tools `func host start`
6. Send a GET request to `https://localhost:7071/api/HttpTriggerAsync` or `https://localhost:7071/api/HttpTriggerSync`.
7. It should show a memory profiling report similiar to below section in Azure Functions Core Tools.

    ```text
    Filename: <ProjectRoot>\HttpTriggerAsync\__init__.py
    Line #    Mem usage    Increment  Occurences   Line Contents
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
