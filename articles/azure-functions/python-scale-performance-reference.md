---
title: Improve throughput performance of Python apps in Azure Functions
description: Learn how to develop Azure Functions apps using Python that are highly performant and scale well under load.
ms.topic: article
ms.date: 02/13/2023
ms.devlang: python
ms.custom: devx-track-python, py-fresh-zinc
---
# Improve throughput performance of Python apps in Azure Functions

When developing for Azure Functions using Python, you need to understand how your functions perform and how that performance affects the way your function app gets scaled. The need is more important when designing highly performant apps. The main factors to consider when designing, writing, and configuring your functions apps are horizontal scaling and throughput performance configurations.

## Horizontal scaling
By default, Azure Functions automatically monitors the load on your application and creates more host instances for Python as needed. Azure Functions uses built-in thresholds for different trigger types to decide when to add instances, such as the age of messages and queue size for QueueTrigger. These thresholds aren't user configurable. For more information, see [Event-driven scaling in Azure Functions](event-driven-scaling.md).

## Improving throughput performance

The default configurations are suitable for most of Azure Functions applications. However, you can improve the performance of your applications' throughput by employing configurations based on your workload profile. The first step is to understand the type of workload that you're running.

| Workload type | Function app characteristics       | Examples                                          |
| ------------- | ---------------------------------- | ------------------------------------------------- |
| **I/O-bound**     | • App needs to handle many concurrent invocations.<br>• App processes a large number of I/O events, such as network calls and disk read/writes. | • Web APIs                                          |
| **CPU-bound**     | • App does long-running computations, such as image resizing.<br>• App does data transformation.                                                | • Data processing<br>• Machine learning inference<br> |

 
As real world function workloads are usually a mix of I/O and CPU bound, you should profile the app under realistic production loads.


### Performance-specific configurations

After you understand the workload profile of your function app, the following are configurations that you can use to improve the throughput performance of your functions.

* [Async](#async)
* [Multiple language worker](#use-multiple-language-worker-processes)
* [Max workers within a language worker process](#set-up-max-workers-within-a-language-worker-process)
* [Event loop](#managing-event-loop)
* [Vertical Scaling](#vertical-scaling)



#### Async

Because [Python is a single-threaded runtime](https://wiki.python.org/moin/GlobalInterpreterLock), a host instance for Python can process only one function invocation at a time by default. For applications that process a large number of I/O events and/or is I/O bound, you can improve performance significantly by running functions asynchronously.

To run a function asynchronously, use the `async def` statement, which runs the function with [asyncio](https://docs.python.org/3/library/asyncio.html) directly:

```python
async def main():
    await some_nonblocking_socket_io_op()
```
Here's an example of a function with HTTP trigger that uses [aiohttp](https://pypi.org/project/aiohttp/) http client:

```python
import aiohttp

import azure.functions as func

async def main(req: func.HttpRequest) -> func.HttpResponse:
    async with aiohttp.ClientSession() as client:
        async with client.get("PUT_YOUR_URL_HERE") as response:
            return func.HttpResponse(await response.text())

    return func.HttpResponse(body='NotFound', status_code=404)
```


A function without the `async` keyword is run automatically in a ThreadPoolExecutor thread pool:

```python
# Runs in a ThreadPoolExecutor threadpool. Number of threads is defined by PYTHON_THREADPOOL_THREAD_COUNT. 
# The example is intended to show how default synchronous functions are handled.

def main():
    some_blocking_socket_io()
```

In order to achieve the full benefit of running functions asynchronously, the I/O operation/library that is used in your code needs to have async implemented as well. Using synchronous I/O operations in functions that are defined as asynchronous **may hurt** the overall performance. If the libraries you're using don't have async version implemented, you may still benefit from running your code asynchronously by [managing event loop](#managing-event-loop) in your app. 

Here are a few examples of client libraries that have implemented async patterns:
- [aiohttp](https://pypi.org/project/aiohttp/) - Http client/server for asyncio 
- [Streams API](https://docs.python.org/3/library/asyncio-stream.html) - High-level async/await-ready primitives to work with network connection
- [Janus Queue](https://pypi.org/project/janus/) - Thread-safe asyncio-aware queue for Python
- [pyzmq](https://pypi.org/project/pyzmq/) - Python bindings for ZeroMQ
 
##### Understanding async in Python worker

When you define `async` in front of a function signature, Python marks the function as a coroutine. When you call the coroutine, it can be scheduled as a task into an event loop. When you call `await` in an async function, it registers a continuation into the event loop, which allows the event loop to process the next task during the wait time.

In our Python Worker, the worker shares the event loop with the customer's `async` function and it's capable for handling multiple requests concurrently. We strongly encourage our customers to make use of asyncio compatible libraries, such as [aiohttp](https://pypi.org/project/aiohttp/) and [pyzmq](https://pypi.org/project/pyzmq/). Following these recommendations increases your function's throughput compared to those libraries when implemented synchronously.

> [!NOTE]
>  If your function is declared as `async` without any `await` inside its implementation, the performance of your function will be severely impacted since the event loop will be blocked which prohibits the Python worker from handling concurrent requests.

#### Use multiple language worker processes

By default, every Functions host instance has a single language worker process. You can increase the number of worker processes per host (up to 10) by using the [`FUNCTIONS_WORKER_PROCESS_COUNT`](functions-app-settings.md#functions_worker_process_count) application setting. Azure Functions then tries to evenly distribute simultaneous function invocations across these workers.

For CPU bound apps, you should set the number of language workers to be the same as or higher than the number of cores that are available per function app. To learn more, see [Available instance SKUs](functions-premium-plan.md#available-instance-skus). 

I/O-bound apps may also benefit from increasing the number of worker processes beyond the number of cores available. Keep in mind that setting the number of workers too high can affect overall performance due to the increased number of required context switches. 

The `FUNCTIONS_WORKER_PROCESS_COUNT` applies to each host that Azure Functions creates when scaling out your application to meet demand.

> [!NOTE]
> Multiple Python workers are not supported by the Python v2 programming model at this time. This means that enabling intelligent concurrency and setting `FUNCTIONS_WORKER_PROCESS_COUNT` greater than 1 is not supported for functions developed using the v2 model. 

#### Set up max workers within a language worker process

As mentioned in the async [section](#understanding-async-in-python-worker), the Python language worker treats functions and [coroutines](https://docs.python.org/3/library/asyncio-task.html#coroutines) differently. A coroutine is run within the same event loop that the language worker runs on. On the other hand, a function invocation is run within a [ThreadPoolExecutor](https://docs.python.org/3/library/concurrent.futures.html#threadpoolexecutor), which is maintained by the language worker as a thread.

You can set the value of maximum workers allowed for running sync functions using the [PYTHON_THREADPOOL_THREAD_COUNT](functions-app-settings.md#python_threadpool_thread_count) application setting. This value sets the `max_worker` argument of the ThreadPoolExecutor object, which lets Python use a pool of at most `max_worker` threads to execute calls asynchronously. The `PYTHON_THREADPOOL_THREAD_COUNT` applies to each worker that Functions host creates, and Python decides when to create a new thread or reuse the existing idle thread. For older Python versions(that is, `3.8`, `3.7`, and `3.6`), `max_worker` value is set to 1. For Python version `3.9` , `max_worker` is  set to `None`.

For CPU-bound apps, you should keep the setting to a low number, starting from 1 and increasing as you experiment with your workload. This suggestion is to reduce the time spent on context switches and allowing CPU-bound tasks to finish.

For I/O-bound apps, you should see substantial gains by increasing the number of threads working on each invocation. The recommendation is to start with the Python default (the number of cores) + 4 and then tweak based on the throughput values you're seeing.

For mixed workloads apps, you should balance both `FUNCTIONS_WORKER_PROCESS_COUNT` and `PYTHON_THREADPOOL_THREAD_COUNT` configurations to maximize the throughput. To understand what your function apps spend the most time on, we recommend profiling them and setting the values according to their behaviors. To learn about these application settings, see [Use multiple worker processes](#use-multiple-language-worker-processes).

> [!NOTE]
>  Although these recommendations apply to both HTTP and non-HTTP triggered functions, you might need to adjust other trigger specific configurations for non-HTTP triggered functions to get the expected performance from your function apps. For more information about this, please refer to this [Best practices for reliable Azure Functions](functions-best-practices.md).


#### Managing event loop

You should use asyncio compatible third-party libraries. If none of the third-party libraries meet your needs, you can also manage the event loops in Azure Functions. Managing event loops give you more flexibility in compute resource management, and it also makes it possible to wrap synchronous I/O libraries into coroutines.

There are many useful Python official documents discussing the [Coroutines and Tasks](https://docs.python.org/3/library/asyncio-task.html) and [Event Loop](https://docs.python.org/3.8/library/asyncio-eventloop.html) by using the built-in **asyncio** library.

Take the following [requests](https://github.com/psf/requests) library as an example, this code snippet uses the **asyncio** library to wrap the `requests.get()` method into a coroutine, running multiple web requests to SAMPLE_URL concurrently.


```python
import asyncio
import json
import logging

import azure.functions as func
from time import time
from requests import get, Response


async def invoke_get_request(eventloop: asyncio.AbstractEventLoop) -> Response:
    # Wrap requests.get function into a coroutine
    single_result = await eventloop.run_in_executor(
        None,  # using the default executor
        get,  # each task call invoke_get_request
        'SAMPLE_URL'  # the url to be passed into the requests.get function
    )
    return single_result

async def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    eventloop = asyncio.get_event_loop()

    # Create 10 tasks for requests.get synchronous call
    tasks = [
        asyncio.create_task(
            invoke_get_request(eventloop)
        ) for _ in range(10)
    ]

    done_tasks, _ = await asyncio.wait(tasks)
    status_codes = [d.result().status_code for d in done_tasks]

    return func.HttpResponse(body=json.dumps(status_codes),
                             mimetype='application/json')
```
#### Vertical scaling
You might be able to get more processing units, especially in CPU-bound operation, by upgrading to premium plan with higher specifications. With higher processing units, you can adjust the number of worker processes count according to the number of cores available and achieve higher degree of parallelism. 

## Next steps

For more information about Azure Functions Python development, see the following resources:

* [Azure Functions Python developer guide](functions-reference-python.md)
* [Best practices for Azure Functions](functions-best-practices.md)
* [Azure Functions developer reference](functions-reference.md)

