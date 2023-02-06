---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 02/06/2023
ms.author: glenga
---

Update *HttpExample\\function_app.py* to match the following code, add the `msg` parameter to the function definition and `msg.set(name)` under the `if name:` statement:

```python
import azure.functions as func
import logging

app = func.FunctionApp()

@app.function_name(name="HttpTrigger1")
@app.route(route="hello", auth_level=func.AuthLevel.ANONYMOUS)
@app.queue_output(arg_name="msg", queue_name="outqueue", connection="AzureWebJobsStorage")
def test_function(req: func.HttpRequest, msg: func.Out[func.QueueMessage]) -> func.HttpResponse:
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
        msg.set(name)
        return func.HttpResponse(f"Hello {name}!")
     else:
        return func.HttpResponse(
                    "Please pass a name on the query string or in the request body",
                    status_code=400
                )
```
