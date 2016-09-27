<properties 
	pageTitle="New schema version 2015-08-01-preview" 
	description="Learn how to write the JSON definition for the latest version of Logic apps" 
	authors="stepsic-microsoft-com" 
	manager="dwrede" 
	editor="" 
	services="logic-apps" 
	documentationCenter=""/>

<tags
	ms.service="logic-apps"
	ms.workload="integration"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/31/2016"
	ms.author="stepsic"/>
	
# New schema version 2015-08-01-preview

The new schema and API version for Logic apps has a number of improvements which improve the reliability and ease-of-use of Logic apps. There are 4 key differences:

1. The **APIApp** action type has been updated to a new **APIConnection** action type.
2. **Repeat** has been renamed to **Foreach**.
3. The **HTTP Listener** API app is no longer required.
4. Calling child workflows uses a new schema.

## 1. Moving to API connections

The biggest change is that you no longer need to deploy API apps into your Azure Subscription to use API's. There are 2 ways you can use APIs:
* Managed API's
* Your custom Web API's

Each of these is handled slightly differently because their management and hosting models are different. One advantage of this model is you're no longer constrained to resources that are deployed in your Resource Group. 

### Managed APIs

There are a number of API's that are managed by Microsoft on your behalf, such as Office 365, Salesforce, Twitter, FTP etc.... Some of these managed API's can be used as-is, such as Bing Translate, while others require configuration. This configuration is called a *connection*.

For example, when you use Office 365, you need to create a connection that contains your Office 365 sign-in token. This token will be securely stored and refreshed so that your Logic app can always call the Office 365 API. Alternatively, if you want to connect to your SQL or FTP server, you need to create a connection that has the connection string. 

Inside of the definition these actions are called `APIConnection`. Here is an example of a connection that calls Office 365 to send an email:

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

The portion of the inputs that is unique to API connections is the `host` object. This contains two parts: `api` and `connection`.

The `api` has the runtime URL of where that managed API is hosted. You can see all of the available managed APIs for you by calling `GET https://management.azure.com/subscriptions/{subid}/providers/Microsoft.Web/managedApis/?api-version=2015-08-01-preview`.

When you use an API, it may or may not have any **connection parameters** defined. If it doesn't then no **connection** is required. If it does, then you will have to create a connection. When you create that connection it'll have the name you choose, and then you reference that in the `connection` object inside the `host` object. To create a connection in a resource group, call:

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
	"parameterValues" : {
		"accountName" : "{The name of the storage account -- the set of parameters is different for each API}"
	}
  },
  "location" : "{Logic app's location}"
}
```

### Deploying managed APIs in an Azure Resource manager template

You can create a full application in an ARM template as long as it doesn’t require interactive sign-in. If it requires sign-in, you can set everything up with the ARM template, but will still have to visit the portal to authorize the connections. 

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
		"dependsOn": [
			"[resourceId('Microsoft.Web/connections', 'azureblob')]"
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
								"folderPath": "[concat('/',parameters('containerName'))]",
								"name": "helloworld.txt"
							},
							"body": "@decodeDataUri('data:,Hello+world!')",
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

You can see in this example that the connections are just normal resources that live in your resource group. They reference the managedAPIs available to you in your subscription.

### Your custom Web APIs

If you use your own API's (specifically, not Microsoft-managed ones), then you should use the built-in **HTTP** action to call them. In order to have an ideal experience, you should expose a swagger endpoint for your API. This will enable the Logic app designer to render the inputs and outputs for your API. Without a swagger, the designer will only be able to show the inputs and outputs as opaque JSON objects.

Here is an example showing the new `metadata.apiDefinitionUrl` property:
```
{
   "actions": {
        "mycustomAPI": {
            "type": "http",
            "metadata" : {
              "apiDefinitionUrl" : "https://mysite.azurewebsites.net/api/apidef/"  
            },
            "inputs": {
                "uri": "https://mysite.azurewebsites.net/api/getsomedata",
                "method" : "GET"
            }
        }
    }
}
```

If you host your Web API on **App Service** then it will automatically show up in the list of actions available in the designer. If not, you'll have to paste in the URL directly. The swagger endpoint must be unauthenticated in order to be usable inside of the Logic apps designer (although you may secure the API itself with whatever methods are supported in the Swagger).

### Using your already deployed API apps with 2015-08-01-preview

If you previously deployed an API app, you can call it via the **HTTP** action.

For example, if you use Dropbox to list files, you may have something like this in your **2014-12-01-preview** schema version definition:

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

You can construct the equivalent HTTP action like below (the parameters section of the Logic app definition remains unchanged):

```
{
    "actions": {
        "dropboxconnector": {
            "type": "Http",
            "metadata" : {
              "apiDefinitionUrl" : "https://avdemo.azurewebsites.net/api/service/apidef/dropboxconnector/?api-version=2015-01-14&format=swagger-2.0-standard"  
            },
            "inputs": {
                "uri": "https://avdemo.azurewebsites.net/api/service/invoke/dropboxconnector/ListFiles?api-version=2015-01-14",
                "method" : "POST",
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

| Action property |  Description |
| --------------- | -----------  |
| `type` | `Http` instead of `APIapp` |
| `metadata.apiDefinitionUrl` | If you want to use this action in the Logic apps designer, you'll want to include the metadata endpoint. This is constructed from: `{api app host.gateway}/api/service/apidef/{last segment of the api app host.id}/?api-version=2015-01-14&format=swagger-2.0-standard` |
| `inputs.uri` | This is constructed from: `{api app host.gateway}/api/service/invoke/{last segment of the api app host.id}/{api app operation}?api-version=2015-01-14` |
| `inputs.method` | Always `POST` |
| `inputs.body` | Identical to the api app parameters | 
| `inputs.authentication` | Identical to the api app authentication |

This approach should work for all API app actions. However, please keep in mind that these previous API apps are no longer supported, and you should move to one of the two other options above (either a managed API or hosting your custom Web API).

## 2. Repeat renamed to Foreach

For the previous schema version we received a lot of customer feedback that **Repeat** was confusing and didn't properly capture that it was really a for each loop. As a result, we have renamed it to **Foreach**. For example:

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

Would now be written as:

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

Previously the function `@repeatItem()` was used to reference the current item being iterated over. This has been simplified to just `@item()`. 

### Referencing the outputs of the Foreach
To further simplify, the outputs of **Foreach** actions will not be wrapped in an object called **repeatItems**. This means, whereas the outputs of the above repeat were:

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

Now it will be:

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

When referencing these outputs, to get to the body of the action you'd have to do:

```
{
    "actions": {
        "secondAction" : {
            "type" : "Http",
            "repeat" : "@outputs('pingBing').repeatItems",
            "inputs" : {
                "method" : "POST",
                "uri" : "http://www.example.com",
                "body" : "@repeatItem().outputs.body"
            }
        }
    }
}
```

Now you can do instead:

```
{
    "actions": {
        "secondAction" : {
            "type" : "Http",
            "foreach" : "@outputs('pingBing')",
            "inputs" : {
                "method" : "POST",
                "uri" : "http://www.example.com",
                "body" : "@item().outputs.body"
            }
        }
    }
}
```

With these changes, the functions `@repeatItem()`, `@repeatBody()` and `@repeatOutputs()` are removed.

## 3. Native HTTP listener 
The HTTP Listener capabilities are now built-in, so you no longer need to deploy an HTTP Listener API app. Read about [the full details for how to make your Logic app endpoint callable here](app-service-logic-http-endpoint.md). 

With these changes, the function `@accessKeys()` is removed and has been replaced with the `@listCallbackURL()` function for the purposes of getting the endpoint (when needed). In addition, you now must define at least one trigger in your Logic app now. If you want to `/run` the workflow, you'll need to have one of a `manual`, `apiConnectionWebhook` or `httpWebhook` triggers. 

## 4. Calling child workflows

Previously, calling child workflows required going to that workflow, getting the access token, and then pasting that in to the definition of the Logic app that you want to call that child. With the new schema version, the Logic apps engine will automatically generate a SAS at runtime for the child workflow, which means that you don't have to paste any secrets into the definition.  Here is an example:

```
"mynestedwf" : {
    "type" : "workflow",
    "inputs" : {
        "host" : {
            "id" : "/subscriptions/xxxxyyyyzzz/resourceGroups/rg001/providers/Microsoft.Logic/mywf001",
            "triggerName" : "myendpointtrigger"
        },
        "queries" : {
            "extrafield" : "specialValue"
        },
        "headers" : {
            "x-ms-date" : "@utcnow()",
            "Content-type" : "application/json"
        },
        "body" : {
            "contentFieldOne" : "value100",
            "anotherField" : 10.001
        }
    },
    "conditions" : []
}
```

A second improvement is we will be giving the child workflows full access to the incoming request. That means that you can pass parameters in the *queries* section and in the *headers* object and that you can fully define the entire body.

Finally, there are required changes to the child workflow. Whereas before you could just call a child workflow directly; now, you’ll need to define a trigger endpoint in the workflow for the parent to call. Generally, this means you’ll add a trigger of type **manual** and then use that in the parent definition. Note that the `host` property specifically has a `triggerName`, because you must always specify which trigger you are invoking.

## Other changes

### New queries property
All action types now support a new input called **queries**. This can be a structured object rather than you having to assemble the string by hand.

### parse() function renamed
As we will soon be adding more content types, the `parse()` function has been renamed to `json()`.

## Coming soon: Enterprise Integration APIs
At this point in time, we do not yet have managed versions of the Enterprise Integration APIs available (such as AS2). These will be coming soon as covered in the [roadmap](http://www.zdnet.com/article/microsoft-outlines-its-cloud-and-server-integration-roadmap-for-2016/). In the meanwhile, you can use your existing deployed BizTalk APIs via the HTTP action, as covered above in "Using your already deployed API apps."
