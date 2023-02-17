---
title: Python V2 model Azure Functions triggers and bindings
description: Provides examples of how to define Python triggers and bindings in Azure Functions using the preview v2 model
ms.topic: article
ms.date: 10/25/2022
ms.devlang: python
ms.custom: devx-track-python, devdivchpfy22
---

# Python V2 model Azure Functions triggers and bindings (preview)

The new Python v2 programming model in Azure Functions is intended to provide better alignment with Python development principles and with commonly used Python frameworks. 

The improved v2 programming model requires fewer files than the default model (v1), and specifically eliminates the need for a configuration file (`function.json`). Instead, triggers and bindings are represented in the `function_app.py` file as decorators. Moreover, functions can be logically organized with support for multiple functions to be stored in the same file. Functions within the same function application can also be stored in different files, and be referenced as blueprints.

To learn more about using the new Python programming model for Azure Functions, see the [Azure Functions Python developer guide](./functions-reference-python.md). In addition to the documentation, [hints](https://aka.ms/functions-python-hints) are available in code editors that support type checking with .pyi files.

This article contains example code snippets that define various triggers and bindings using the Python v2 programming model. To be able to run the code snippets below, ensure the following:

- The function application is defined and named `app`.
- Confirm that the parameters within the trigger reflect values that correspond with your storage account.
- The name of the file the function is in must be `function_app.py`.

To create your first function in the new v2 model, see one of these quickstart articles:

+ [Get started with Visual Studio](./create-first-function-vs-code-python.md)
+ [Get started command prompt](./create-first-function-cli-python.md)

## Azure Blob storage trigger

The following code snippet defines a function triggered from Azure Blob Storage:

```python
import logging
import azure.functions as func
app = func.FunctionApp()
@app.function_name(name="BlobTrigger1")
@app.blob_trigger(arg_name="myblob", path="samples-workitems/{name}",
                  connection="AzureWebJobsStorage")
def test_function(myblob: func.InputStream):
   logging.info(f"Python blob trigger function processed blob \n"
                f"Name: {myblob.name}\n"
                f"Blob Size: {myblob.length} bytes")
```

## Azure Blob storage input binding

```python
import logging
import azure.functions as func
app = func.FunctionApp()
@app.function_name(name="BlobInput1")
@app.route(route="file")
@app.blob_input(arg_name="inputblob",
                path="sample-workitems/{name}",
                connection="AzureWebJobsStorage")
def test(req: func.HttpRequest, inputblob: bytes) -> func.HttpResponse:
    logging.info(f'Python Queue trigger function processed {len(inputblob)} bytes')
    return inputblob
```

## Azure Blob storage output binding

```python
import logging
import azure.functions as func
app = func.FunctionApp()
@app.function_name(name="BlobOutput1")
@app.route(route="file")
@app.blob_input(arg_name="inputblob",
                path="sample-workitems/test.txt",
                connection="AzureWebJobsStorage")
@app.blob_output(arg_name="outputblob",
                path="newblob/test.txt",
                connection="AzureWebJobsStorage")
def main(req: func.HttpRequest, inputblob: str, outputblob: func.Out[str]):
    logging.info(f'Python Queue trigger function processed {len(inputblob)} bytes')
    outputblob.set(inputblob)
    return "ok"
```

## Azure Cosmos DB trigger

The following code snippet defines a function triggered from an Azure Cosmos DB (SQL API):

```python
import logging
import azure.functions as func
app = func.FunctionApp()
@app.function_name(name="CosmosDBTrigger1")
@app.cosmos_db_trigger(arg_name="documents", database_name="<DB_NAME>", collection_name="<COLLECTION_NAME>", connection_string_setting=""AzureWebJobsStorage"",
 lease_collection_name="leases", create_lease_collection_if_not_exists="true")
def test_function(documents: func.DocumentList) -> str:
    if documents:
        logging.info('Document id: %s', documents[0]['id'])
```

## Azure Cosmos DB input binding

```python
import logging
import azure.functions as func
app = func.FunctionApp()
@app.route()
@app.cosmos_db_input(
    arg_name="documents", database_name="<DB_NAME>",
    collection_name="<COLLECTION_NAME>",
    connection_string_setting="CONNECTION_SETTING")
def cosmosdb_input(req: func.HttpRequest, documents: func.DocumentList) -> str:
    return func.HttpResponse(documents[0].to_json())
```

## Azure Cosmos DB output binding

```python
import logging
import azure.functions as func
@app.route()
@app.cosmos_db_output(
    arg_name="documents", database_name="<DB_NAME>",
    collection_name="<COLLECTION_NAME>",
    create_if_not_exists=True,
    connection_string_setting="CONNECTION_SETTING")
def main(req: func.HttpRequest, documents: func.Out[func.Document]) -> func.HttpResponse:
    request_body = req.get_body()
    documents.set(func.Document.from_json(request_body))
    return 'OK'
```

## Azure EventHub trigger

The following code snippet defines a function triggered from an event hub instance:

```python
import logging
import azure.functions as func
app = func.FunctionApp()
@app.function_name(name="EventHubTrigger1")
@app.event_hub_message_trigger(arg_name="myhub", event_hub_name="samples-workitems",
                               connection=""CONNECTION_SETTING"") 
def test_function(myhub: func.EventHubEvent):
    logging.info('Python EventHub trigger processed an event: %s',
                myhub.get_body().decode('utf-8'))
```

## Azure EventHub output binding

```python
import logging
import azure.functions as func
app = func.FunctionApp()
@app.function_name(name="eventhub_output")
@app.route(route="eventhub_output")
@app.event_hub_output(arg_name="event",
                      event_hub_name="samples-workitems",
                      connection="CONNECTION_SETTING")
def eventhub_output(req: func.HttpRequest, event: func.Out[str]):
    body = req.get_body()
    if body is not None:
        event.set(body.decode('utf-8'))
    else:    
        logging.info('req body is none')
    return 'ok'
```

## HTTP trigger

The following code snippet defines an HTTP triggered function:

```python
import azure.functions as func
import logging
app = func.FunctionApp(auth_level=func.AuthLevel.ANONYMOUS)
@app.function_name(name="HttpTrigger1")
@app.route(route="hello")
def test_function(req: func.HttpRequest) -> func.HttpResponse:
     logging.info('Python HTTP trigger function processed a request.')
     name = req.params.get('name')
     if not name:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            name = req_body.get('name')
     if name:
        return func.HttpResponse(f"Hello, {name}. This HTTP triggered function executed successfully.")
     else:
        return func.HttpResponse(
             "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.",
             status_code=200
        )
```

## Azure Queue storage trigger

```python
import logging
import azure.functions as func
app = func.FunctionApp()
@app.function_name(name="QueueTrigger1")
@app.queue_trigger(arg_name="msg", queue_name="python-queue-items",
                   connection=""AzureWebJobsStorage"")  
def test_function(msg: func.QueueMessage):
    logging.info('Python EventHub trigger processed an event: %s',
                 msg.get_body().decode('utf-8'))
```

## Azure Queue storage output binding

```python
import logging
import azure.functions as func
app = func.FunctionApp()
@app.function_name(name="QueueOutput1")
@app.route(route="message")
@app.queue_output(arg_name="msg", queue_name="python-queue-items", connection="AzureWebJobsStorage")
def main(req: func.HttpRequest, msg: func.Out[str]) -> func.HttpResponse:
    input_msg = req.params.get('name')
    msg.set(input_msg)
    logging.info(input_msg)
    logging.info('name: {name}')
    return 'OK'
```

## Azure Service Bus queue trigger

```python
import logging
import azure.functions as func
app = func.FunctionApp()
@app.function_name(name="ServiceBusQueueTrigger1")
@app.service_bus_queue_trigger(arg_name="msg", queue_name="myinputqueue", connection="CONNECTION_SETTING")
def test_function(msg: func.ServiceBusMessage):
    logging.info('Python ServiceBus queue trigger processed message: %s',
                 msg.get_body().decode('utf-8'))
```

## Azure Service Bus topic trigger

```python
import logging
import azure.functions as func
app = func.FunctionApp()
@app.function_name(name="ServiceBusTopicTrigger1")
@app.service_bus_topic_trigger(arg_name="message", topic_name="mytopic", connection="CONNECTION_SETTING", subscription_name="testsub")
def test_function(message: func.ServiceBusMessage):
    message_body = message.get_body().decode("utf-8")
    logging.info("Python ServiceBus topic trigger processed message.")
    logging.info("Message Body: " + message_body)
```

## Azure Service Bus Topic output binding

```python
import logging
import azure.functions as func
app = func.FunctionApp()
@app.route(route="put_message")
@app.service_bus_topic_output(
    arg_name="message",
    connection="CONNECTION_SETTING",
    topic_name="mytopic")
def main(req: func.HttpRequest, message: func.Out[str]) -> func.HttpResponse:
    input_msg = req.params.get('message')
    message.set(input_msg)
    return 'OK'
```

## Timer trigger

```python
import datetime
import logging
import azure.functions as func
app = func.FunctionApp()
@app.function_name(name="mytimer")
@app.schedule(schedule="0 */5 * * * *", arg_name="mytimer", run_on_startup=True,
              use_monitor=False) 
def test_function(mytimer: func.TimerRequest) -> None:
    utc_timestamp = datetime.datetime.utcnow().replace(
        tzinfo=datetime.timezone.utc).isoformat()
    if mytimer.past_due:
        logging.info('The timer is past due!')
    logging.info('Python timer trigger function ran at %s', utc_timestamp)
```

## Durable Functions

Durable Functions also provides preview support of the V2 programming model. To try it out, install the Durable Functions SDK (PyPI package `azure-functions-durable`) from version `1.2.2` or greater. You can reach us in the [Durable Functions SDK for Python repo](https://github.com/Azure/azure-functions-durable-python) with feedback and suggestions.


> [!NOTE]
> Using [Extension Bundles](./functions-bindings-register.md#extension-bundles) is not currently supported when trying out the Python V2 programming model with Durable Functions, so you will need to manage your extensions manually.
> To do this, remove the `extensionBundle` section of your `host.json` as described [here](./functions-run-local.md#install-extensions) and run `func extensions install --package Microsoft.Azure.WebJobs.Extensions.DurableTask --version 2.9.1` on your terminal. This will install the Durable Functions extension for your app and will allow you to try out the new experience.

The Durable Functions Triggers and Bindings may be accessed from an instance `DFApp`, a subclass of `FunctionApp` that additionally exports Durable Functions-specific decorators. 

Below is a simple Durable Functions app that declares a simple sequential orchestrator, all in one file!

```python
import azure.functions as func
import azure.durable_functions as df

myApp = df.DFApp(http_auth_level=func.AuthLevel.ANONYMOUS)

# An HTTP-Triggered Function with a Durable Functions Client binding
@myApp.route(route="orchestrators/{functionName}")
@myApp.durable_client_input(client_name="client")
async def durable_trigger(req: func.HttpRequest, client):
    function_name = req.route_params.get('functionName')
    instance_id = await client.start_new(function_name)
    response = client.create_check_status_response(req, instance_id)
    return response

# Orchestrator
@myApp.orchestration_trigger(context_name="context")
def my_orchestrator(context):
    result1 = yield context.call_activity("hello", "Seattle")
    result2 = yield context.call_activity("hello", "Tokyo")
    result3 = yield context.call_activity("hello", "London")

    return [result1, result2, result3]

# Activity
@myApp.activity_trigger(input_name="myInput")
def hello(myInput: str):
    return "Hello " + myInput    
```

> [!NOTE]
> Previously, Durable Functions orchestrators needed an extra line of boilerplate, usually at the end of the file, to be indexed:
> `main = df.Orchestrator.create(<name_of_orchestrator_function>)`.
> This is no longer needed in V2 of the Python programming model. This applies to Entities as well, which required a similar boilerplate through
> `main = df.Entity.create(<name_of_entity_function>)`.

For reference, all Durable Functions Triggers and Bindings are listed below:

### Orchestration Trigger

```python
import azure.functions as func
import azure.durable_functions as df

myApp = df.DFApp(http_auth_level=func.AuthLevel.ANONYMOUS)

@myApp.orchestration_trigger(context_name="context")
def my_orchestrator(context):
    result = yield context.call_activity("Hello", "Tokyo")
    return result
```

### Activity Trigger

```python
import azure.functions as func
import azure.durable_functions as df

myApp = df.DFApp(http_auth_level=func.AuthLevel.ANONYMOUS)

@myApp.activity_trigger(input_name="myInput")
def my_activity(myInput: str):
    return "Hello " + myInput
```

### DF Client Binding

```python
import azure.functions as func
import azure.durable_functions as df

myApp = df.DFApp(http_auth_level=func.AuthLevel.ANONYMOUS)

@myApp.route(route="orchestrators/{functionName}")
@myApp.durable_client_input(client_name="client")
async def durable_trigger(req: func.HttpRequest, client):
    function_name = req.route_params.get('functionName')
    instance_id = await client.start_new(function_name)
    response = client.create_check_status_response(req, instance_id)
    return response
```

### Entity Trigger

```python
import azure.functions as func
import azure.durable_functions as df

myApp = df.DFApp(http_auth_level=func.AuthLevel.ANONYMOUS)

@myApp.entity_trigger(context_name="context")
def entity_function(context):
    current_value = context.get_state(lambda: 0)
    operation = context.operation_name
    if operation == "add":
        amount = context.get_input()
        current_value += amount
    elif operation == "reset":
        current_value = 0
    elif operation == "get":
        pass
    
    context.set_state(current_value)
    context.set_result(current_value)
```

## Next steps

+ [Python developer guide](./functions-reference-python.md)
+ [Get started with Visual Studio](./create-first-function-vs-code-python.md)
+ [Get started command prompt](./create-first-function-cli-python.md)
