---
title: Build on logic app definitions with JSON - Azure Logic Apps | Microsoft Docs
description: Add parameters, process strings, create parameter maps, and get data with Date functions
author: ecfan
manager: anneta
editor: ''
services: logic-apps
documentationcenter: ''

ms.assetid: d565873c-6b1b-4057-9250-cf81a96180ae
ms.service: logic-apps
ms.workload: integration
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.custom: H1Hack27Feb2017
ms.date: 01/31/2018
ms.author: LADocs; estfan
---

# Build on your logic app definition with JSON

To perform more advanced tasks with [Azure Logic Apps](../logic-apps/logic-apps-overview.md), 
you can use code view to edit your logic app definition, 
which uses simple, declarative JSON language. If you haven't already, first review 
[how to create your first logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md). 
Also, see the [full reference for the Workflow Definition Language](http://aka.ms/logicappsdocs).

> [!NOTE]
> Some Azure Logic Apps capabilities, like parameters, 
> are available only when you work in code view for your logic app's definition. 
> Parameters let you reuse values throughout your logic app. 
> For example, if you want to use the same email address across several actions, 
> define that email address as a parameter.

## View and edit your logic app definition's in JSON

1. Sign in to the [Azure portal](https://portal.azure.com "Azure portal").

2. From the left menu, choose **More services**. 
Under **Enterprise Integration**, choose **Logic Apps**. 
Select your logic app.

3. From your logic app menu, under **Development Tools**, 
choose **Logic App Code View**.

   The code view window opens and shows your logic app definition.

## Parameters

Parameters let you reuse values throughout your logic app 
and are good for replacing values that you might change often. 
For example, if you have an email address that you want use in multiple places, 
you should define that email address as a parameter. 

Parameters are also useful when you need to override parameters in different environments, 
Learn more about [parameters for deployment](#deployment-parameters) and the 
[REST API for Azure Logic Apps documentation](https://docs.microsoft.com/rest/api/logic).

> [!NOTE]
> Parameters are only available in code view.

In the [first example logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md), 
you created a workflow that sends emails when new posts appear in a website's RSS feed. 
The feed's URL is hardcoded, so this example shows how to replace the query value with a parameter so that you can change feed's URL more easily.

1. In code view, find the `parameters : {}` object, 
and add a `currentFeedUrl` object:

   ``` json
	 "currentFeedUrl" : {
      "type" : "string",
			"defaultValue" : "http://rss.cnn.com/rss/cnn_topstories.rss"
   }
   ```

2. In the `When_a_feed-item_is_published` action, 
find the `queries` section, and replace the query value 
with `"feedUrl": "#@{parameters('currentFeedUrl')}"`. 

   **Before**
   ``` json
   }
      "queries": {
          "feedUrl": "https://s.ch9.ms/Feeds/RSS"
       }
   },   
   ```

   **After**
   ``` json
   }
      "queries": {
          "feedUrl": "#@{parameters('currentFeedUrl')}"
       }
   },   
   ```

   To join two or more strings, you can also use the `concat` function. 
   For example, `"@concat('#',parameters('currentFeedUrl'))"` works the same 
   as the previous example.

3.	When you're done, choose **Save**. 

Now you can change the website's RSS feed by passing a different URL 
through the `currentFeedURL` object.

<a name="deployment-parameters"></a>

## Deployment parameters for different environments

Usually, deployment lifecycles have environments for development, staging, and production. 
For example, you might use the same logic app definition in all these environments 
but use different databases. Likewise, you might want to use the same definition 
across different regions for high availability but want each logic app instance 
to use that region's database. 

> [!NOTE] 
> This scenario differs from taking parameters at *runtime* 
> where you should use the `trigger()` function instead.

Here's a basic definition:

``` json
{
    "$schema": "https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "uri": {
            "type": "string"
        }
    },
    "triggers": {
        "request": {
          "type": "request",
          "kind": "http"
        }
    },
    "actions": {
        "readData": {
            "type": "Http",
            "inputs": {
                "method": "GET",
                "uri": "@parameters('uri')"
            }
        }
    },
    "outputs": {}
}
```
In the actual `PUT` request for the logic apps, you can provide the parameter `uri`. 
In each environment, you can provide a different value for the `connection` parameter. 
Because a default value no longer exists, the logic app payload requires this parameter:

``` json
{
    "properties": {},
        "definition": {
          /// Use the definition from above here
        },
        "parameters": {
            "connection": {
                "value": "https://my.connection.that.is.per.enviornment"
            }
        }
    },
    "location": "westus"
}
``` 

To learn more, see the 
[REST API for Azure Logic Apps documentation](https://docs.microsoft.com/rest/api/logic/).

## Process strings with functions

Logic Apps has various functions for working with strings. 
For example, suppose you want to pass a company name from an order to another system. 
However, you're not sure about proper handling for character encoding. 
You could perform base64 encoding on this string, but to avoid escapes in the URL, 
you can replace several characters instead. Also, you only need a substring for 
the company name because the first five characters are not used. 

``` json
{
  "$schema": "https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "order": {
      "defaultValue": {
        "quantity": 10,
        "id": "myorder1",
        "companyName": "NAME=Contoso"
      },
      "type": "Object"
    }
  },
  "triggers": {
    "request": {
      "type": "Request",
      "kind": "Http"
    }
  },
  "actions": {
    "order": {
      "type": "Http",
      "inputs": {
        "method": "GET",
        "uri": "http://www.example.com/?id=@{replace(replace(base64(substring(parameters('order').companyName,5,sub(length(parameters('order').companyName), 5) )),'+','-') ,'/' ,'_' )}"
      }
    }
  },
  "outputs": {}
}
```

These steps describe how this example processes this string, 
working from the inside to the outside:

``` 
"uri": "http://www.example.com/?id=@{replace(replace(base64(substring(parameters('order').companyName,5,sub(length(parameters('order').companyName), 5) )),'+','-') ,'/' ,'_' )}"
```

1. Get the [`length()`](../logic-apps/logic-apps-workflow-definition-language.md) 
for the company name, so you get the total number of characters.

2. To get a shorter string, subtract `5`.

3. Now get a [`substring()`](../logic-apps/logic-apps-workflow-definition-language.md). 
Start at index `5`, and go to the remainder of the string.

4. Convert this substring to a [`base64()`](../logic-apps/logic-apps-workflow-definition-language.md) string.

5. Now [`replace()`](../logic-apps/logic-apps-workflow-definition-language.md) 
all the `+` characters with `-` characters.

6. Finally, [`replace()`](../logic-apps/logic-apps-workflow-definition-language.md) 
all the `/` characters with `_` characters.

## Map list items to property values, then use maps as parameters

To get different results based a property's value, 
you can create a map that matches each property value to a result, 
then use that map as a parameter. 

For example, this workflow defines some categories as parameters 
and a map that matches those categories with a specific URL. 
First, the workflow gets a list of articles. Then, the workflow 
uses the map to find the URL matching the category for each article.

*	The [`intersection()`](../logic-apps/logic-apps-workflow-definition-language.md) 
function checks whether the category matches a known defined category.

*	After getting a matching category, the example pulls the item from the map 
using square brackets: `parameters[...]`

``` json
{
  "$schema": "https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "specialCategories": {
      "defaultValue": [
        "science",
        "google",
        "microsoft",
        "robots",
        "NSA"
      ],
      "type": "Array"
    },
    "destinationMap": {
      "defaultValue": {
        "science": "http://www.nasa.gov",
        "microsoft": "https://www.microsoft.com/en-us/default.aspx",
        "google": "https://www.google.com",
        "robots": "https://en.wikipedia.org/wiki/Robot",
        "NSA": "https://www.nsa.gov/"
      },
      "type": "Object"
    }
  },
  "triggers": {
    "Request": {
      "type": "Request",
      "kind": "http"
    }
  },
  "actions": {
    "getArticles": {
      "type": "Http",
      "inputs": {
        "method": "GET",
        "uri": "https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&q=http://feeds.wired.com/wired/index"
      }
    },
    "forEachArticle": {
      "type": "foreach",
      "foreach": "@body('getArticles').responseData.feed.entries",
      "actions": {
        "ifGreater": {
          "type": "if",
          "expression": "@greater(length(intersection(item().categories, parameters('specialCategories'))), 0)",
          "actions": {
            "getSpecialPage": {
              "type": "Http",
              "inputs": {
                "method": "GET",
                "uri": "@parameters('destinationMap')[first(intersection(item().categories, parameters('specialCategories')))]"
              }
            }
          }
        }
      },
      "runAfter": {
        "getArticles": [
          "Succeeded"
        ]
      }
    }
  }
}
```

## Get data with Date functions

To get data from a data source that doesn't natively support *triggers*, 
you can use Date functions for working with times and dates instead. 
For example, this expression finds how long this workflow's steps are taking, 
working from the inside to the outside:

``` json
"expression": "@less(actions('order').startTime,addseconds(utcNow(),-1))",
```

1. From the `order` action, extract the `startTime`. 
2. Get the current time with `utcNow()`.
3. Subtract one second:

   [`addseconds(..., -1)`](../logic-apps/logic-apps-workflow-definition-language.md) 

   You can use other units of time, like `minutes` or `hours`. 

3. Now, you can compare these two values. 

   If the first value is less than the second value, 
   then more than one second has passed since the order was first placed.

To format dates, you can use string formatters. For example, to get the RFC1123, 
use [`utcnow('r')`](../logic-apps/logic-apps-workflow-definition-language.md). 
Learn more about [date formatting](../logic-apps/logic-apps-workflow-definition-language.md).

``` json
{
  "$schema": "https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "order": {
      "defaultValue": {
        "quantity": 10,
        "id": "myorder-id"
      },
      "type": "Object"
    }
  },
  "triggers": {
    "Request": {
      "type": "request",
      "kind": "http"
    }
  },
  "actions": {
    "order": {
      "type": "Http",
      "inputs": {
        "method": "GET",
        "uri": "http://www.example.com/?id=@{parameters('order').id}"
      }
    },
    "ifTimingWarning": {
      "type": "If",
      "expression": "@less(actions('order').startTime,addseconds(utcNow(),-1))",
      "actions": {
        "timingWarning": {
          "type": "Http",
          "inputs": {
            "method": "GET",
            "uri": "http://www.example.com/?recordLongOrderTime=@{parameters('order').id}&currentTime=@{utcNow('r')}"
          }
        }
      },
      "runAfter": {
        "order": [
          "Succeeded"
        ]
      }
    }
  },
  "outputs": {}
}
```


## Next steps

* [Run steps based on a condition (conditional statements)](../logic-apps/logic-apps-control-flow-conditional-statement.md)
* [Run steps based on different values (switch statements)](../logic-apps/logic-apps-control-flow-switch-statement.md)
* [Run and repeat steps (loops)](../logic-apps/logic-apps-control-flow-loops.md)
* [Run or merge parallel steps (branches)](../logic-apps/logic-apps-control-flow-branches.md)
* [Run steps based on grouped action status (scopes)](../logic-apps/logic-apps-control-flow-run-steps-group-scopes.md)
* Learn more about the [Workflow Definition Language schema for Azure Logic Apps](../logic-apps/logic-apps-workflow-definition-language.md)
* Learn more about [workflow actions and triggers for Azure Logic Apps](../logic-apps/logic-apps-workflow-actions-triggers.md)