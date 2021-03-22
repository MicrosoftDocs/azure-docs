---
title: Memory profiling on Python apps in Azure Functions
description: Learn how to profile Python apps memory usage and identify memory bottleneck.
ms.topic: article
ms.date: 3/22/2021
ms.custom: devx-track-python
---
# Profile Python apps memory usage in Azure Functions

During your development or after deploying your local function app project into Azure Functions, it is a good practice to analyize the memory bottleneck in your Python functions. The following sections demonstrate how to properly doing memory profiling in Python function apps.

## Tools and Services

Please ensure you have install [Azure Functions Core Tools](https://github.com/Azure/azure-functions-core-tools) if you want to do memory profiling on your local development environment. To enable memory profiling on your Azure Functions instances, you need to enable Application Insights for these function apps.

In the following tutorial, we will use the well known Python memory profiling package [memory-profiler](https://pypi.org/project/memory-profiler) which monitors Python process memory consumption line-by-line.

## Memory Profiling Tutorial

1. In your requirements.txt, add `memory-profiler` to ensure the package will be bundled with your deployment. If you are developing on your local machine, you may want to activate a Python virtual environment and do a package resolution by `pip install -r requirements.txt`.

2. In your function script (usually \_\_init\_\_.py), add the following lines above the `main()` function. This will ensure the root logger reports the child logger names, so that the memory profiling logs are distinguishable by the prefix `memory_profiler_logs`.

```python
import logging
import memory_profiler
root_logger = logging.getLogger()
root_logger.handlers[0].setFormatter(logging.Formatter("%(name)s: %(message)s"))
profiler_logstream = memory_profiler.LogFile('memory_profiler_logs', True)
```

3. Apply the following decorator above any functions that need memory profiling. This does not work directly on the trigger entrypoint `main()` method. You need to create subfunctions and decorate them. Also, due to a memory-profiler known issue, when applying to an async coroutine, the coroutine return value will always be None.

```python
@memory_profiler.profile(stream=memory_logger)
```

4. Test the memory profiler on your local machine by using azure Functions Core Tools command `func host start`. This should generate a memory usage report with file name, line of code, memory usage, memory increment, and the line content in it.

5. To check the memory profiling logs on an existing function app instance in Azure, you can query the memory profiling logs in recent invocations by pasting the following Kusto queries  in Application Insights -> Logs blade.

```kusto
traces
| where timestamp > ago(1d)
| where message startswith_cs 'memory_profiler_logs:'
| parse message with "memory_profiler_logs: " LineNumber "  " TotalMem_MiB "  " IncreMem_MiB "  " Occurences "  " Contents
| order by timestamp asc
| project timestamp, LineNumber, TotalMem_MiB, IncreMem_MiB, Occurences, Contents, RequestId=itemId
```

## Examples

Here is an example of performing memory profiling on an asynchronous and a synchronous HTTP triggers, named "HttpTriggerAsync" and "HttpTriggerSync" respectively. We will build a Python function app that simply sends out GET requests to the Microsoft's home page.

### Folder Structure

To scaffold the project, we recommend using the Azure Functions Core Tools by running the following commands:

```powershell
mkdir PythonMemoryProfilingDemo
cd PythonMemoryProfilingDemo
func init --python
func new -l python -t HttpTrigger -n HttpTriggerAsync
func new -l python -t HttpTrigger -n HttpTriggerSync
```

The template project should have the following folder structure:

```text
 <project_root>/
 | - HttpTriggerAsync/
 | | - functions.json
 | | - __init__.py
 | - HttpTriggerSync/
 | | - functions.json
 | | - __init__.py
 | - requirements.txt
 | - host.json
 | - local.settings.json
```

### File Contents

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
```

For synchronous HTTP trigger, please refer to the following `HttpTriggerSync/__init__.py` code section:

```python
# HttpTriggerSync/__init__.py

import azure.functions as func
import requests
import logging
import memory_profiler


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

After making all the above changes, simply run `func host start` in your command line window, and send a GET request to `https://localhost:7071/api/HttpTriggerAsync` or `https://localhost:7071/api/HttpTriggerSync`. It should show a memory profiling report similiar to below when the requests are processed.

```
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
