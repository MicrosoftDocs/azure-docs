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

## Blob trigger

The following code snippet defines a function triggered from Azure Blob Storage:

```python
import logging
import azure.functions as func
app = func.FunctionApp()
@app.function_name(name="BlobTrigger1")
@app.blob_trigger(arg_name="myblob", path="samples-workitems/{name}",
                  connection="<STORAGE_CONNECTION_SETTING>")
def test_function(myblob: func.InputStream):
   logging.info(f"Python blob trigger function processed blob \n"
                f"Name: {myblob.name}\n"
                f"Blob Size: {myblob.length} bytes")
```

## Azure Cosmos DB trigger

The following code snippet defines a function triggered from an Azure Cosmos DB (SQL API):

```python
import logging
import azure.functions as func
app = func.FunctionApp()
@app.function_name(name="CosmosDBTrigger1")
@app.cosmos_db_trigger(arg_name="documents", database_name="<DB_NAME>", collection_name="<COLLECTION_NAME>", connection_string_setting="<COSMOS_CONNECTION_SETTING>",
 lease_collection_name="leases", create_lease_collection_if_not_exists="true")
def test_function(documents: func.DocumentList) -> str:
    if documents:
        logging.info('Document id: %s', documents[0]['id'])
```

## Azure EventHub trigger

The following code snippet defines a function triggered from an event hub instance:

```python
import logging
import azure.functions as func
app = func.FunctionApp()
@app.function_name(name="EventHubTrigger1")
@app.event_hub_message_trigger(arg_name="myhub", event_hub_name="samples-workitems",
                               connection="<EVENT_HUB_CONNECTION_SETTING>") 
def test_function(myhub: func.EventHubEvent):
    logging.info('Python EventHub trigger processed an event: %s',
                myhub.get_body().decode('utf-8'))
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

## Azure Queue Storage trigger

```python
import logging
import azure.functions as func
app = func.FunctionApp()
@app.function_name(name="QueueTrigger1")
@app.queue_trigger(arg_name="msg", queue_name="python-queue-items",
                   connection="")  
def test_function(msg: func.QueueMessage):
    logging.info('Python EventHub trigger processed an event: %s',
                 msg.get_body().decode('utf-8'))
```

## Azure Service Bus queue trigger

```python
import logging
import azure.functions as func
app = func.FunctionApp()
@app.function_name(name="ServiceBusQueueTrigger1")
@app.service_bus_queue_trigger(arg_name="msg", queue_name="myinputqueue", connection="")
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
@app.service_bus_topic_trigger(arg_name="message", topic_name="mytopic", connection="", subscription_name="testsub")
def test_function(message: func.ServiceBusMessage):
    message_body = message.get_body().decode("utf-8")
    logging.info("Python ServiceBus topic trigger processed message.")
    logging.info("Message Body: " + message_body)
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
## Next steps

+ [Python developer guide](./functions-reference-python.md)
+ [Get started with Visual Studio](./create-first-function-vs-code-python.md)
+ [Get started command prompt](./create-first-function-cli-python.md)