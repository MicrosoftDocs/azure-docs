---
title: Best practices for scale and performance in python apps
description: Understand how to develop highly performant python function app
ms.topic: article
ms.date: 10/13/2020
ms.custom: devx-track-python
---
# Best practices for performance in python apps

The default configurations are suitable for most of Azure Functions applications. However, you can improve the performance of your applications' throughput by employing configurations based on your workload profile. The first step is to understand the type of workload that you are running.

## Understanding your workload



|| I/O-bound workload | CPU-bound workload |
|--| -- | -- |
|Function app characteristics| <ul><li>App needs to handle many concurrent invocations.</li> <li> App processes a large number of I/O events, such as network calls and disk read/writes.</li> </ul>| <ul><li>App does long-running computations, such as image resizing.</li> <li>App does data transformation.</li> </ul> |
|Examples| <ul><li>Web APIs</li><ul> | <ul><li>Data processing</li><li> Machine learning inference</li><ul>|

 
> [!NOTE]
>  As real world functions workload are most of often a mix of I/O and CPU bound, we recommend to profile the workload under realistic production loads.

## Performance-specific configurations

After understanding the workload profile of your function app, the following are configurations that you can use to improve the throughput performance of your functions.

### Async

Because [Python is a single-threaded runtime](https://wiki.python.org/moin/GlobalInterpreterLock), a host instance for Python can process only one function invocation at a time. For applications that process a large number of I/O events and/or is I/O bound, you can improve performance significantly by running functions asynchronously.

To run a function asynchronously, use the `async def` statement, which runs the function with [asyncio](https://docs.python.org/3/library/asyncio.html) directly:

```python
async def main():
    await some_nonblocking_socket_io_op()
```
Here is an example of a function with HTTP trigger that uses [aiohttp](https://pypi.org/project/aiohttp/) http client:

```python
import aiohttp

import azure.functions as func

async def main(req: func.HttpRequest) -> func.HttpResponse:
    async with aiohttp.ClientSession() as client:
        async with client.get("PUT_YOUR_URL_HERE") as response:
            return func.HttpResponse(await response.text())

    return func.HttpResponse(body='NotFound', status_code=404)
```


A function without the `async` keyword is run automatically in an asyncio thread-pool:

```python
# Runs in an asyncio thread-pool

def main():
    some_blocking_socket_io()
```

In order to achieve the full benefit of running functions asynchronously, the I/O operation/library that is used in your code needs to have async implemented as well. Using synchronous I/O operations in functions that are defined as asynchronous **may hurt** the overall performance.

Here are a few examples of client libraries that has implemented async pattern:
- [aiohttp](https://pypi.org/project/aiohttp/) - Http client/server for asyncio 
- [Streams API](https://docs.python.org/3/library/asyncio-stream.html) - High-level async/await-ready primitives to work with network connection
- [Janus Queue](https://pypi.org/project/janus/) - Thread-safe asyncio-aware queue for Python
- [pyzmq](https://pypi.org/project/pyzmq/) - Python bindings for ZeroMQ
 
#### Understanding Async in Python Worker

When you define `async` in front of a function signature, Python will mark the function as a coroutine. When calling the coroutine, it can be scheduled as a task into an event loop. When you call `await` in an async function, it registers a continuation into the event loop and allow event loop to process next task during the wait time.

In our Python Worker, the worker shares the event loop with the customer's `async` function and it is capable for handling multiple requests concurrently. We strongly encourage our customers to make use of asyncio compatible libraries (e.g. [aiohttp](https://pypi.org/project/aiohttp/), [pyzmq](https://pypi.org/project/pyzmq/)). This will greatly increase your function's throughput compared to those libraries implemented in synchronous fashion.

> [!NOTE]
>  If your function is declared as `async` without any `await` inside its implementation, the performance of your function will be severely impacted since the event loop will be blocked which prohibit the python worker to handle concurrent requests.

### Use multiple language worker processes

By default, every Functions host instance has a single language worker process. You can increase the number of worker processes per host (up to 10) by using the [FUNCTIONS_WORKER_PROCESS_COUNT](functions-app-settings.md#functions_worker_process_count) application setting. Azure Functions then tries to evenly distribute simultaneous function invocations across these workers.

For CPU bound apps, you should set the number of language worker to be the same as or higher than the number of cores that are available per function app. To learn more, see [Available instance SKUs](functions-premium-plan.md#available-instance-skus). 

I/O-bound apps may also benefit from increasing the number of worker processes beyond the number of cores available. Keep in mind that setting the number of workers too high can impact overall performance due to the increased number of required context switches. 

The FUNCTIONS_WORKER_PROCESS_COUNT applies to each host that Functions creates when scaling out your application to meet demand.

### Adjusting the number of thread in AsyncIO thread pool
By default, this is currently set to 1. Inc


### Vertical Scaling
For more processing units especially in CPU-bound operation, you might be able to get this by upgrading to premium plan with higher specifications. With higher processing units, you can adjust the number of worker process count according to the number of cores available and achieve higher degree of parallelism. 

### Managing Event Loop

We encourage our customers to use asyncio compatible third-party libraries. If none of the third-party libraries meets your need, one alternative is to managing event loops in Azure Functions. This enables more flexibility in compute resource management. Also making it possible to wrap synchronous I/O libraries into coroutines.

There are many useful Python official documents discussing the [Coroutines and Tasks](https://docs.python.org/3/library/asyncio-task.html) and [Event Loop](https://docs.python.org/3.8/library/asyncio-eventloop.html) by leveraging the built in **asyncio** library.

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
