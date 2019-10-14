---
title: Schema updates for August-1-2015 preview - Azure Logic Apps | Microsoft Docs
description: Updated schema version 2015-08-01-preview for logic app definitions in Azure Logic Apps
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: kevinlam1
ms.author: klam
ms.reviewer: estfan, LADocs
ms.assetid: 0d03a4d4-e8a8-4c81-aed5-bfd2a28c7f0c
ms.topic: article
ms.date: 05/31/2016
---

# Schema updates for Azure Logic Apps - August 1, 2015 preview

This schema and API version for Azure Logic Apps includes key 
improvements that make logic apps more reliable and easier to use:

* The **APIApp** action type is now named [**APIConnection**](#api-connections).
* The **Repeat** action is now named [**Foreach**](#foreach).
* The [**HTTP Listener** API App](#http-listener) is no longer required.
* Calling child workflows uses a [new schema](#child-workflows).

<a name="api-connections"></a>

## Move to API connections

The biggest change is that you no longer have to deploy API Apps into 
your Azure subscription so that you can use APIs. Here are the ways that you can use APIs:

* Managed APIs
* Your custom Web APIs

Each way is handled slightly differently because 
their management and hosting models are different. 
One advantage of this model is you're no longer 
constrained to resources that are deployed in your Azure resource group. 

### Managed APIs

Microsoft manages some APIs on your behalf, 
such as Office 365, Salesforce, Twitter, and FTP. 
You can use some managed APIs as-is, such as Bing Translate, 
while others require configuration, also called a *connection*.

For example, when you use Office 365, 
you must create a connection that includes your Office 365 sign-in token. 
Your token is securely stored and refreshed so that 
your logic app can always call the Office 365 API. 
If you want to connect to your SQL or FTP server, 
you must create a connection that has the connection string. 

In this definition, these actions are called `APIConnection`. 
Here is an example of a connection that calls Office 365 to send an email:

``` json
{
   "actions": {
      "Send_an_email": {
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
            "method": "POST",
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

The `host` object is a part of the inputs that is unique to API connections, 
and contains these parts: `api` and `connection`. 
The `api` object specifies the runtime URL for where that managed API is hosted. 
You can see all the available managed APIs by calling this method:

```text
GET https://management.azure.com/subscriptions/<Azure-subscription-ID>/providers/Microsoft.Web/locations/<location>/managedApis?api-version=2015-08-01-preview
```

When you use an API, that API might or might not have defined any *connection parameters*. 
So, if the API doesn't define these parameters, no connection is required. 
If the API does define these parameters, you must create a connection with a specified name.  
You then reference that name in the `connection` object inside the `host` object. 
To create a connection in a resource group, call this method:

```text
PUT https://management.azure.com/subscriptions/<Azure-subscription-ID>/resourceGroups/<Azure-resource-group-name>/providers/Microsoft.Web/connections/<name>?api-version=2015-08-01-preview
```

With the following body:

``` json
{
   "properties": {
      "api": {
         "id": "/subscriptions/<Azure-subscription-ID>/providers/Microsoft.Web/managedApis/azureblob"
      },
      "parameterValues": {
         "accountName": "<Azure-storage-account-name-with-different-parameters-for-each-API>"
      }
   },
   "location": "<logic-app-location>"
}
```

### Deploy managed APIs in an Azure Resource Manager template

When interactive sign-in isn't required, you can 
create a full app by using a Resource Manager template.
If sign-in is required, you can still use a Resource Manager template, 
but you have to authorize the connections through the Azure portal. 

``` json
"resources": [ {
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
    },
},
{
   "type": "Microsoft.Logic/workflows",
   "apiVersion": "2015-08-01-preview",
   "name": "[parameters('logicAppName')]",
   "location": "[resourceGroup().location]",
   "dependsOn": ["[resourceId('Microsoft.Web/connections', 'azureblob')]"],
   "properties": {
      "sku": {
         "name": "[parameters('sku')]",
         "plan": {
            "id": "[concat(resourceGroup().id, '/providers/Microsoft.Web/serverfarms/', parameters('svcPlanName'))]"
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
      },
      "definition": {
         "$schema": "https://schema.management.azure.com/schemas/2016-06-01/Microsoft.Logic.json",
         "contentVersion": "1.0.0.0",
         "parameters": {
            "type": "Object",
            "$connections": {
               "defaultValue": {},
 
            }
         },
         "triggers": {
            "Recurrence": {
               "type": "Recurrence",
               "recurrence": {
                  "frequency": "Day",
                  "interval": 1
               }
            }
         },
         "actions": {
            "Create_file": {
               "type": "ApiConnection",
               "inputs": {
                  "host": {
                     "api": {
                        "runtimeUrl": "https://logic-apis-westus.azure-apim.net/apim/azureblob"
                     },
                     "connection": {
                       "name": "@parameters('$connections')['azureblob']['connectionId']"
                     }
                  },
                  "method": "POST",
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
         "outputs": {}
      }
   }
} ]
```

You can see in this example that the connections are just resources that live in your resource group. 
They reference the managed APIs available to you in your subscription.

### Your custom Web APIs

If you use your own APIs rather than Microsoft-managed ones, 
use the built-in **HTTP** action to call your APIs. Ideally, 
you should provide a Swagger endpoint for your API. 
This endpoint helps Logic App Designer show your API's 
inputs and outputs. Without a Swagger endpoint, 
the designer can only show the inputs and outputs as opaque JSON objects.

Here is an example showing the new `metadata.apiDefinitionUrl` property:

``` json
"actions": {
   "mycustomAPI": {
      "type": "Http",
      "metadata": {
         "apiDefinitionUrl": "https://mysite.azurewebsites.net/api/apidef/"  
      },
      "inputs": {
         "uri": "https://mysite.azurewebsites.net/api/getsomedata",
         "method": "GET"
      }
   }
}
```

If you host your Web API on Azure App Service, 
your Web API automatically appears in the list of actions available in the designer. 
If not, you have to paste in the URL directly. The Swagger endpoint must be unauthenticated 
to be usable in the Logic App Designer, although you can secure the API itself with whatever methods that Swagger supports.

### Call deployed API apps with 2015-08-01-preview

If you previously deployed an API App, you can call that app with the **HTTP** action.
For example, if you use Dropbox to list files, 
your **2014-12-01-preview** schema version definition might have something like:

``` json
"definition": {
   "$schema": "https://schema.management.azure.com/schemas/2016-06-01/Microsoft.Logic.json",
   "contentVersion": "1.0.0.0",
   "parameters": {
      "/subscriptions/<Azure-subscription-ID>/resourcegroups/avdemo/providers/Microsoft.AppService/apiapps/dropboxconnector/token": {
         "defaultValue": "eyJ0eX...wCn90",
         "type": "String",
         "metadata": {
            "token": {
               "name": "/subscriptions/<Azure-subscription-ID>/resourcegroups/avdemo/providers/Microsoft.AppService/apiapps/dropboxconnector/token"
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
                "id": "/subscriptions/<Azure-subscription-ID>/resourcegroups/avdemo/providers/Microsoft.AppService/apiapps/dropboxconnector",
                "gateway": "https://avdemo.azurewebsites.net"
             },
             "operation": "ListFiles",
             "parameters": {
                "FolderPath": "/myfolder"
             },
             "authentication": {
                "type": "Raw",
                "scheme": "Zumo",
                "parameter": "@parameters('/subscriptions/<Azure-subscription-ID>/resourcegroups/avdemo/providers/Microsoft.AppService/apiapps/dropboxconnector/token')"
             }
          }
       }
    }
}
```

Now, you can now build a similar HTTP action and leave the 
logic app definition's `parameters` section unchanged, for example:

``` json
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
            "parameter": "@parameters('/subscriptions/<Azure-subscription-ID>/resourcegroups/avdemo/providers/Microsoft.AppService/apiapps/dropboxconnector/token')"
         }
      }
   }
}
```

Walking through these properties one-by-one:

| Action property | Description |
| --- | --- |
| `type` | `Http` instead of `APIapp` |
| `metadata.apiDefinitionUrl` | To use this action in the Logic App Designer, include the metadata endpoint, which is constructed from: `{api app host.gateway}/api/service/apidef/{last segment of the api app host.id}/?api-version=2015-01-14&format=swagger-2.0-standard` |
| `inputs.uri` | Constructed from: `{api app host.gateway}/api/service/invoke/{last segment of the api app host.id}/{api app operation}?api-version=2015-01-14` |
| `inputs.method` | Always `POST` |
| `inputs.body` | Same as the API App parameters |
| `inputs.authentication` | Same as the API App authentication |

This approach should work for all API App actions. However, 
remember that these previous API Apps are no longer supported. 
So you should move to one of the two other previous options, 
a managed API or hosting your custom Web API.

<a name="foreach"></a>

## Renamed 'repeat' to 'foreach'

For the previous schema version, we received much customer feedback that the **Repeat** action 
name was confusing and didn't properly capture that **Repeat** was really a for-each loop. 
So, we renamed `repeat` to `foreach`. Previously you'd write this action like this example:

``` json
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
```

Now you'd write this version instead:

``` json
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
```

Also, the `repeatItem()` function, which referenced the item that the 
loop is processing during the current iteration, is now renamed `item()`. 

### Reference outputs from 'foreach'

For simplification, the outputs from `foreach` actions are 
no longer wrapped in an object named `repeatItems`. 
Also, with these changes, the `repeatItem()`, 
`repeatBody()`, and `repeatOutputs()` functions are removed.

So, using the previous `repeat` example, you get these outputs:

``` json
"repeatItems": [ {
   "name": "pingBing",
   "inputs": {
      "uri": "https://www.bing.com/search?q=0",
      "method": "GET"
   },
   "outputs": {
      "headers": { },
      "body": "<!DOCTYPE html><html lang=\"en\" xml:lang=\"en\" xmlns=\"http://www.w3.org/1999/xhtml\" xmlns:Web=\"https://schemas.live.com/Web/\">...</html>"
   },
   "status": "Succeeded"
} ]
```

Now you get these outputs instead:

``` json
[ {
   "name": "pingBing",
      "inputs": {
         "uri": "https://www.bing.com/search?q=0",
         "method": "GET"
      },
      "outputs": {
         "headers": { },
         "body": "<!DOCTYPE html><html lang=\"en\" xml:lang=\"en\" xmlns=\"http://www.w3.org/1999/xhtml\" xmlns:Web=\"https://schemas.live.com/Web/\">...</html>"
      },
      "status": "Succeeded"
} ]
```

Previously, to get the `body` from the action when referencing these outputs:

``` json
"actions": {
   "secondAction": {
      "type": "Http",
      "repeat": "@outputs('pingBing').repeatItems",
      "inputs": {
         "method": "POST",
         "uri": "https://www.example.com",
         "body": "@repeatItem().outputs.body"
      }
   }
}
```

Now you can use this version instead:

``` json
"actions": {
   "secondAction": {
      "type": "Http",
      "foreach": "@outputs('pingBing')",
      "inputs": {
         "method": "POST",
         "uri": "https://www.example.com",
         "body": "@item().outputs.body"
      }
   }
}
```

<a name="http-listener"></a>

## Native HTTP listener

HTTP listener features are now built-in, so you 
don't have to deploy an HTTP Listener API App. 
For more information, learn how to 
[make your logic app endpoint callable](../logic-apps/logic-apps-http-endpoint.md). 

With these changes, Logic Apps replaces the `@accessKeys()` function 
with the `@listCallbackURL()` function, which gets the endpoint when necessary. 
Also, you now must define at least one trigger in your logic app. 
If you want to `/run` the workflow, you have to use one of these trigger types: 
`Manual`, `ApiConnectionWebhook`, or `HttpWebhook`

<a name="child-workflows"></a>

## Call child workflows

Previously, calling child workflows required going to the workflow, 
getting the access token, and pasting the token in the logic app 
definition where you want to call that child workflow. 
With this schema, the Logic Apps engine automatically generates 
a SAS at runtime for the child workflow so you don't have to 
paste any secrets into the definition. Here is an example:

``` json
"myNestedWorkflow": {
   "type": "Workflow",
   "inputs": {
      "host": {
         "id": "/subscriptions/<Azure-subscription-ID>/resourceGroups/<Azure-resource-group-name>/providers/Microsoft.Logic/myWorkflow001",
         "triggerName": "myEndpointTrigger"
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

Also, child workflows get full access to the incoming request. 
So, you can pass parameters in the `queries` section and in the 
`headers` object. You can also fully define the entire `body` section.

Finally, child workflows have these required changes. 
While you could previously and directly call a child workflow, 
you must now define a trigger endpoint in the workflow for the parent to call. 
Generally, you would add a trigger that has `Manual` type, 
and then use that trigger in the parent definition. 
The `host` property specifically has a `triggerName` 
because you must always specify the trigger you're calling.

## Other changes

### New 'queries' property

All action types now support a new input called `queries`. 
This input can be a structured object, rather than you having to assemble the string by hand.

### Renamed 'parse()' function to 'json()'

The `parse()` function is now renamed the `json()` function for future content types.

## Enterprise Integration APIs

This schema doesn't yet support managed versions for Enterprise Integration APIs, 
such as AS2. However, you can use existing deployed BizTalk APIs through the HTTP action. 
For more information, see "Using your already deployed API apps" in the 
[integration roadmap](https://www.zdnet.com/article/microsoft-outlines-its-cloud-and-server-integration-roadmap-for-2016/). 
