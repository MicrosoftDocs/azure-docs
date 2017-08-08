---
title: Create loops and scopes, or debatch data in workflows - Azure Logic Apps | Microsoft Docs
description: Create loops to iterate through data, group actions into scopes, or debatch data to start more workflows in Azure Logic Apps.
services: logic-apps
documentationcenter: .net,nodejs,java
author: jeffhollan
manager: anneta
editor: ''

ms.assetid: 75b52eeb-23a7-47dd-a42f-1351c6dfebdc
ms.service: logic-apps
ms.workload: integration
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 11/29/2016
ms.author: LADocs; jehollan

---
# Logic Apps Loops, Scopes, and Debatching
  
Logic Apps provides a number of ways to work with arrays, collections, batches, and loops within a workflow.
  
## ForEach loop and arrays
  
Logic Apps allows you to loop over a set of data and perform an action for each item.  This is possible via the `foreach` action.  In the designer, you can specify to add a for each loop.  After selecting the array you wish to iterate over, you can begin adding actions.  Currently you are limited to only one action per foreach loop, but this restriction will be lifted in the coming weeks.  Once within the loop you can begin to specify what should occur at each value of the array.

If using code-view, you can specify a for each loop like below.  This is an example of a for each loop that sends an email for each email address that contains 'microsoft.com':

``` json
{
    "email_filter": {
        "type": "query",
        "inputs": {
            "from": "@triggerBody()['emails']",
            "where": "@contains(item()['email'], 'microsoft.com')"
        }
    },
    "forEach_email": {
        "type": "foreach",
        "foreach": "@body('email_filter')",
        "actions": {
            "send_email": {
                "type": "ApiConnection",
                "inputs": {
                "body": {
                    "to": "@item()",
                    "from": "me@contoso.com",
                    "message": "Hello, thank you for ordering"
                },
                "host": {
                    "connection": {
                        "id": "@parameters('$connections')['office365']['connection']['id']"
                    }
                },
                }
            }
        },
        "runAfter":{
            "email_filter": [ "Succeeded" ]
        }
    }
}
```
  
  A `foreach` action can iterate over arrays up to 5,000 rows.  Each iteration will execute in parallel by default.  

### Sequential ForEach loops

To enable a foreach loop to execute sequentially, the `Sequential` operation option should be added.

``` json
"forEach_email": {
        "type": "foreach",
        "foreach": "@body('email_filter')",
        "operationOptions": "Sequential",
        "..."
}
```
  
## Until loop
  
  You can perform an action or series of actions until a condition is met.  The most common scenario for this is calling an endpoint until you get the response you are looking for.  In the designer, you can specify to add an until loop.  After adding actions inside the loop, you can set the exit condition, as well as the loop limits.  There is a 1 minute delay between loop cycles.
  
  If using code-view, you can specify an until loop like below.  This is an example of calling an HTTP endpoint until the response body has the value 'Completed'.  It will complete when either 
  
  * HTTP Response has status of 'Completed'
  * It has tried for 1 hour
  * It has looped 100 times
  
  ``` json
  {
      "until_successful":{
        "type": "until",
        "expression": "@equals(actions('http')['status'], 'Completed')",
        "limit": {
            "count": 100,
            "timeout": "PT1H"
        },
        "actions": {
            "create_resource": {
                "type": "http",
                "inputs": {
                    "url": "http://provisionRseource.com",
                    "body": {
                        "resourceId": "@triggerBody()"
                    }
                }
            }
        }
      }
  }
  ```
  
## SplitOn and debatching

Sometimes a trigger may receive an array of items that you want to debatch and start a workflow per item.  This can be accomplished via the `spliton` command.  By default, if your trigger swagger specifies a payload that is an array, a `spliton` will be added and start a run per item.  SplitOn can only be added to a trigger.  This can be manually configured or overridden in definition code-view.  Currently SplitOn can debatch arrays up to 5,000 items.  You cannot have a `spliton` and also implement the synchronous response pattern.  Any workflow called that has a `response` action in addition to `spliton` will run asynchronously and send an immediate `202 Accepted` response.  

SplitOn can be specified in code-view as the following example.  This receives an array of items and debatches on each row.

```
{
    "myDebatchTrigger": {
        "type": "Http",
        "inputs": {
            "url": "http://getNewCustomers",
        },
        "recurrence": {
            "frequencey": "Second",
            "interval": 15
        },
        "spliton": "@triggerBody()['rows']"
    }
}
```

## Scopes

It is possible to group a series of actions together using a scope.  This is particularly useful for implementing exception handling.  In the designer you can add a new scope, and begin adding any actions inside of it.  You can define scopes in code-view like the following:


```
{
    "myScope": {
        "type": "scope",
        "actions": {
            "call_bing": {
                "type": "http",
                "inputs": {
                    "url": "http://www.bing.com"
                }
            }
        }
    }
}
```