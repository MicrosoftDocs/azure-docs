---
title: Schema updates August-1-2015 preview - Azure Logic Apps | Microsoft Docs
description: Create JSON definitions for Azure Logic Apps with schema version 2015-08-01-preview
author: stepsic-microsoft-com
manager: anneta
editor: ''
services: logic-apps
documentationcenter: ''

ms.assetid: 0d03a4d4-e8a8-4c81-aed5-bfd2a28c7f0c
ms.service: logic-apps
ms.workload: integration
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.custom: H1Hack27Feb2017
ms.date: 05/31/2016
ms.author: LADocs; stepsic

---
# Schema updates for Azure Logic Apps - August 1, 2015 preview

This new schema and API version for Azure Logic Apps includes key improvements that make logic apps 
more reliable and easier to use:

*	The **APIApp** action type is updated to a new [**APIConnection**](#api-connections) action type.
*	**Repeat** is renamed to [**Foreach**](#foreach).
*	The [**HTTP Listener** API App](#http-listener) is no longer required.
*	Calling child workflows uses a [new schema](#child-workflows).

<a name="api-connections"></a>
## Move to API connections

The biggest change is that you no longer have to deploy API Apps into 
your Azure subscription so you can use APIs. Here are the ways that you can use APIs:

* Managed APIs
* Your custom Web APIs

Each way is handled slightly differently because their management and hosting models are different. 
One advantage of this model is you're no longer constrained to resources that are deployed in your Azure resource group. 

### Managed APIs

Microsoft manages some APIs on your behalf, such as Office 365, Salesforce, Twitter, and FTP. 
You can use some managed APIs as-is, such as Bing Translate, while others require configuration. 
This configuration is called a *connection*.

For example, when you use Office 365, you must create a connection that contains your Office 365 sign-in token. 
This token is securely stored and refreshed so that your logic app can always call the Office 365 API. 
Alternatively, if you want to connect to your SQL or FTP server, you must create a connection that 
has the connection string. 

In this definition, these actions are called `APIConnection`. 
Here is an example of a connection that calls Office 365 to send an email:

```
{
    "actions": {
        "Send_Email": {
            "type": "ApiConnection",
            "inputs": {
                "host": {
                    "api": {
                        "runtimeUrl": "https://msmanaged-na.azure-apim.net/apim/office365"
                    },
                    "connection": {
                        "name": "@parameters('$connections')['shared_office365']['connectionId']"
                    }
                },
                "method": "post",
                "body": {
                    "Subject": "Reminder",
                    "Body": "Don't forget!",
                    "To": "me@contoso.com"
                },
                "path": "/Mail"
            }
        }
    }
}
```

The `host` object is portion of inputs that is unique to API connections, 
and contains tow parts: `api` and `connection`.

The `api` has the runtime URL of where that managed API is hosted. 
You can see all the available managed APIs by calling 
`GET https://management.azure.com/subscriptions/{subid}/providers/Microsoft.Web/managedApis/?api-version=2015-08-01-preview`.

When you use an API, the API might or might not have any *connection parameters* defined. 
If the API doesn't, no *connection* is required. If the API does, you must create a connection. 
The created connection has the name that you choose. 
You then reference the name in the `connection` object inside the `host` object. 
To create a connection in a resource group, call:

```
PUT https://management.azure.com/subscriptions/{subid}/resourceGroups/{rgname}/providers/Microsoft.Web/connections/{name}?api-version=2015-08-01-preview
```

With the following body:

```
{
  "properties": {
    "api": {
      "id": "/subscriptions/{subid}/providers/Microsoft.Web/managedApis/azureblob"
    },
    "parameterValues": {
        "accountName": "{The name of the storage account -- the set of parameters is different for each API}"
    }
  },
  "location": "{Logic app's location}"
}
```

### Deploy managed APIs in an Azure Resource Manager template

You can create a full application in an Azure Resource Manager template as long as interactive sign-in isn't required.
If sign-in is required, you can set up everything with the Azure Resource Manager template, 
but you still have to visit the portal to authorize the connections. 

```
    "resources": [{
        "apiVersion": "2015-08-01-preview",
        "name": "azureblob",
        "type": "Microsoft.Web/connections",
        "location": "[resourceGroup().location]",
        "properties": {
            "api": {
                "id": "[concat(subscription().id,'/providers/Microsoft.Web/locations/westus/managedApis/azureblob')]"
            },
            "parameterValues": {
                "accountName": "[parameters('storageAccountName')]",
                "accessKey": "[parameters('storageAccountKey')]"
            }
        }
    }, {
        "type": "Microsoft.Logic/workflows",
        "apiVersion": "2015-08-01-preview",
        "name": "[parameters('logicAppName')]",
        "location": "[resourceGroup().location]",
        "dependsOn": ["[resourceId('Microsoft.Web/connections', 'azureblob')]"
        ],
        "properties": {
            "sku": {
                "name": "[parameters('sku')]",
                "plan": {
                    "id": "[concat(resourceGroup().id, '/providers/Microsoft.Web/serverfarms/',parameters('svcPlanName'))]"
                }
            },
            "definition": {
                "$schema": "https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2015-08-01-preview/workflowdefinition.json#",
                "actions": {
                    "Create_file": {
                        "type": "apiconnection",
                        "inputs": {
                            "host": {
                                "api": {
                                    "runtimeUrl": "https://logic-apis-westus.azure-apim.net/apim/azureblob"
                                },
                                "connection": {
                                    "name": "@parameters('$connections')['azureblob']['connectionId']"
                                }
                            },
                            "method": "post",
                            "queries": {
                                "folderPath": "[concat('/', parameters('containerName'))]",
                                "name": "helloworld.txt"
                            },
                            "body": "@decodeDataUri('data:, Hello+world!')",
                            "path": "/datasets/default/files"
                        },
                        "conditions": []
                    }
                },
                "contentVersion": "1.0.0.0",
                "outputs": {},
                "parameters": {
                    "$connections": {
                        "defaultValue": {},
                        "type": "Object"
                    }
                },
                "triggers": {
                    "recurrence": {
                        "type": "Recurrence",
                        "recurrence": {
                            "frequency": "Day",
                            "interval": 1
                        }
                    }
                }
            },
            "parameters": {
                "$connections": {
                    "value": {
                        "azureblob": {
                            "connectionId": "[concat(resourceGroup().id,'/providers/Microsoft.Web/connections/azureblob')]",
                            "connectionName": "azureblob",
                            "id": "[concat(subscription().id,'/providers/Microsoft.Web/locations/westus/managedApis/azureblob')]"
                        }

                    }
                }
            }
        }
    }]
```

You can see in this example that the connections are just resources that live in your resource group. 
They reference the managed APIs available to you in your subscription.

### Your custom Web APIs

If you use your own APIs, not Microsoft-managed ones, 
use the built-in **HTTP** action to call them. 
For an ideal experience, you should expose a Swagger endpoint for your API. 
This endpoint enables the Logic App Designer to render the inputs and outputs for your API. 
Without Swagger, the designer can only show the inputs and outputs as opaque JSON objects.

Here is an example showing the new `metadata.apiDefinitionUrl` property:

```
{
   "actions": {
        "mycustomAPI": {
            "type": "http",
            "metadata": {
              "apiDefinitionUrl": "https://mysite.azurewebsites.net/api/apidef/"  
            },
            "inputs": {
                "uri": "https://mysite.azurewebsites.net/api/getsomedata",
                "method": "GET"
            }
        }
    }
}
```

If you host your Web API on Azure App Service, 
your Web API automatically appears in the list of actions available in the designer. 
If not, you have to paste in the URL directly. The Swagger endpoint must be unauthenticated 
to be usable in the Logic App Designer, although you can secure the API itself with whatever methods that Swagger supports.

### Call deployed API apps with 2015-08-01-preview

If you previously deployed an API App, you can call the app with the **HTTP** action.

For example, if you use Dropbox to list files, 
your **2014-12-01-preview** schema version definition might have something like:

```
{
    "$schema": "https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2014-12-01-preview/workflowdefinition.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "/subscriptions/423db32d-...-b59f14c962f1/resourcegroups/avdemo/providers/Microsoft.AppService/apiapps/dropboxconnector/token": {
            "defaultValue": "eyJ0eX...wCn90",
            "type": "String",
            "metadata": {
                "token": {
                    "name": "/subscriptions/423db32d-...-b59f14c962f1/resourcegroups/avdemo/providers/Microsoft.AppService/apiapps/dropboxconnector/token"
                }
            }
        }
    },
    "actions": {
        "dropboxconnector": {
            "type": "ApiApp",
            "inputs": {
                "apiVersion": "2015-01-14",
                "host": {
                    "id": "/subscriptions/423db32d-...-b59f14c962f1/resourcegroups/avdemo/providers/Microsoft.AppService/apiapps/dropboxconnector",
                    "gateway": "https://avdemo.azurewebsites.net"
                },
                "operation": "ListFiles",
                "parameters": {
                    "FolderPath": "/myfolder"
                },
                "authentication": {
                    "type": "Raw",
                    "scheme": "Zumo",
                    "parameter": "@parameters('/subscriptions/423db32d-...-b59f14c962f1/resourcegroups/avdemo/providers/Microsoft.AppService/apiapps/dropboxconnector/token')"
                }
            }
        }
    }
}
```

You can construct the equivalent HTTP action like this example, 
while the parameters section of the Logic app definition remains unchanged:

```
{
    "actions": {
        "dropboxconnector": {
            "type": "Http",
            "metadata": {
              "apiDefinitionUrl": "https://avdemo.azurewebsites.net/api/service/apidef/dropboxconnector/?api-version=2015-01-14&format=swagger-2.0-standard"  
            },
            "inputs": {
                "uri": "https://avdemo.azurewebsites.net/api/service/invoke/dropboxconnector/ListFiles?api-version=2015-01-14",
                "method": "POST",
                "body": {
                    "FolderPath": "/myfolder"
                },
                "authentication": {
                    "type": "Raw",
                    "scheme": "Zumo",
                    "parameter": "@parameters('/subscriptions/423db32d-...-b59f14c962f1/resourcegroups/avdemo/providers/Microsoft.AppService/apiapps/dropboxconnector/token')"
                }
            }
        }
    }
}
```

Walking through these properties one-by-one:

| Action property | Description |
| --- | --- |
| `type` |`Http` instead of `APIapp` |
| `metadata.apiDefinitionUrl` |To use this action in the Logic App Designer, include the metadata endpoint, which is constructed from: `{api app host.gateway}/api/service/apidef/{last segment of the api app host.id}/?api-version=2015-01-14&format=swagger-2.0-standard` |
| `inputs.uri` |Constructed from: `{api app host.gateway}/api/service/invoke/{last segment of the api app host.id}/{api app operation}?api-version=2015-01-14` |
| `inputs.method` |Always `POST` |
| `inputs.body` |Identical to the API App parameters |
| `inputs.authentication` |Identical to the API App authentication |

This approach should work for all API App actions. However, remember that these previous API Apps are no longer supported. 
So you should move to one of the two other previous options, a managed API or hosting your custom Web API.

<a name="foreach"></a>
## Renamed 'repeat' to 'foreach'

For the previous schema version, we received much customer feedback that **Repeat** was confusing 
and didn't properly capture that **Repeat** was really a for-each loop. 
As a result, we have renamed `repeat` to `foreach`. For example, previously you would write:

```
{
    "actions": {
        "pingBing": {
            "type": "Http",
            "repeat": "@range(0,2)",
            "inputs": {
                "method": "GET",
                "uri": "https://www.bing.com/search?q=@{repeatItem()}"
            }
        }
    }
}
```

Now you would write:

```
{
    "actions": {
        "pingBing": {
            "type": "Http",
            "foreach": "@range(0,2)",
            "inputs": {
                "method": "GET",
                "uri": "https://www.bing.com/search?q=@{item()}"
            }
        }
    }
}
```

The function `@repeatItem()` was previously used to reference the current item being iterated over. 
This function is now simplified to `@item()`. 

### Reference outputs from 'foreach'

For simplification, the outputs from `foreach` actions are not wrapped in an object called `repeatItems`. 
While the outputs from the previous `repeat` example were:

```
{
    "repeatItems": [
        {
            "name": "pingBing",
            "inputs": {
                "uri": "https://www.bing.com/search?q=0",
                "method": "GET"
            },
            "outputs": {
                "headers": { },
                "body": "<!DOCTYPE html><html lang=\"en\" xml:lang=\"en\" xmlns=\"http://www.w3.org/1999/xhtml\" xmlns:Web=\"http://schemas.live.com/Web/\">...</html>"
            }
            "status": "Succeeded"
        }
    ]
}
```

Now these outputs are:

```
[
    {
        "name": "pingBing",
        "inputs": {
            "uri": "https://www.bing.com/search?q=0",
            "method": "GET"
        },
        "outputs": {
            "headers": { },
            "body": "<!DOCTYPE html><html lang=\"en\" xml:lang=\"en\" xmlns=\"http://www.w3.org/1999/xhtml\" xmlns:Web=\"http://schemas.live.com/Web/\">...</html>"
        }
        "status": "Succeeded"
    }
]
```

Previously, to get to the body of the action when referencing these outputs:

```
{
    "actions": {
        "secondAction": {
            "type": "Http",
            "repeat": "@outputs('pingBing').repeatItems",
            "inputs": {
                "method": "POST",
                "uri": "http://www.example.com",
                "body": "@repeatItem().outputs.body"
            }
        }
    }
}
```

Now you can do instead:

```
{
    "actions": {
        "secondAction": {
            "type": "Http",
            "foreach": "@outputs('pingBing')",
            "inputs": {
                "method": "POST",
                "uri": "http://www.example.com",
                "body": "@item().outputs.body"
            }
        }
    }
}
```

With these changes, the functions `@repeatItem()`, `@repeatBody()`, and `@repeatOutputs()` are removed.

<a name="http-listener"></a>
## Native HTTP listener

The HTTP Listener capabilities are now built in. So you no longer need to deploy an HTTP Listener API App. 
See [the full details for how to make your Logic app endpoint callable here](../logic-apps/logic-apps-http-endpoint.md). 

With these changes, we removed the `@accessKeys()` function, which we replaced with the `@listCallbackURL()` 
function for getting the endpoint when necessary. Also, you must now define at least one trigger in your logic app. 
If you want to `/run` the workflow, you must have one of these triggers: `manual`, `apiConnectionWebhook`, 
or `httpWebhook`.

<a name="child-workflows"></a>
## Call child workflows

Previously, calling child workflows required going to the workflow, 
getting the access token, and pasting the token in the logic app 
definition where you want to call that child workflow. 
With the new schema, the Logic Apps engine automatically generates 
a SAS at runtime for the child workflow so you don't have to 
paste any secrets into the definition. Here is an example:

```
"mynestedwf": {
    "type": "workflow",
    "inputs": {
        "host": {
            "id": "/subscriptions/xxxxyyyyzzz/resourceGroups/rg001/providers/Microsoft.Logic/mywf001",
            "triggerName": "myendpointtrigger"
        },
        "queries": {
            "extrafield": "specialValue"
        },
        "headers": {
            "x-ms-date": "@utcnow()",
            "Content-type": "application/json"
        },
        "body": {
            "contentFieldOne": "value100",
            "anotherField": 10.001
        }
    },
    "conditions": []
}
```

A second improvement is we are giving the child workflows full access to the incoming request. 
That means that you can pass parameters in the *queries* section and in the *headers* object 
and that you can fully define the entire body.

Finally, there are required changes to the child workflow. 
While you could previously call a child workflow directly, 
now you must define a trigger endpoint in the workflow for the parent to call. 
Generally, you would add a trigger that has `manual` type, 
and then use that trigger in the parent definition. 
Note the `host` property specifically has a `triggerName` 
because you must always specify which trigger you are invoking.

## Other changes

### New 'queries' property

All action types now support a new input called `queries`. 
This input can be a structured object, rather than you having to assemble the string by hand.

### Renamed 'parse()' function to 'json()'

We are adding more content types soon, so we renamed the `parse()` function to `json()`.

## Coming soon: Enterprise Integration APIs

We don't have managed versions yet of the Enterprise Integration APIs, like AS2. 
Meanwhile, you can use your existing deployed BizTalk APIs through the HTTP action. 
For details, see "Using your already deployed API apps" in the 
[integration roadmap](http://www.zdnet.com/article/microsoft-outlines-its-cloud-and-server-integration-roadmap-for-2016/). 
