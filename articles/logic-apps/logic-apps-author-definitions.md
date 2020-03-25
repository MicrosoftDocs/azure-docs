---
title: Create, edit, or extend logic app JSON workflow definitions
description: How to write, edit, and extend your logic app's JSON workflow definitions in Azure Logic Apps
services: logic-apps
ms.suite: integration
ms.reviewer: klam, logicappspm
ms.topic: article
ms.date: 01/01/2018
---

# Create, edit, or extend JSON for logic app workflow definitions in Azure Logic Apps

When you create enterprise integration
solutions with automated workflows in
[Azure Logic Apps](../logic-apps/logic-apps-overview.md),
the underlying logic app definitions use simple
and declarative JavaScript Object Notation (JSON)
along with the [Workflow Definition Language (WDL) schema](../logic-apps/logic-apps-workflow-definition-language.md)
for their description and validation. These formats
make logic app definitions easier to read and
understand without knowing much about code.
When you want to automate creating and deploying logic apps,
you can include logic app definitions as
[Azure resources](../azure-resource-manager/management/overview.md)
inside [Azure Resource Manager templates](../azure-resource-manager/templates/overview.md).
To create, manage, and deploy logic apps, you can then use
[Azure PowerShell](https://docs.microsoft.com/powershell/module/az.logicapp),
[Azure CLI](../azure-resource-manager/templates/deploy-cli.md), 
or the [Azure Logic Apps REST APIs](https://docs.microsoft.com/rest/api/logic/).

To work with logic app definitions in JSON,
open the Code View editor when working
in the Azure portal or in Visual Studio,
or copy the definition into any editor that you want.
If you're new to logic apps, review
[how to create your first logic app](../logic-apps/quickstart-create-first-logic-app-workflow.md).

> [!NOTE]
> Some Azure Logic Apps capabilities, such as defining
> parameters and multiple triggers in logic app definitions,
> are available only in JSON, not the Logic Apps Designer.
> So for these tasks, you must work in Code View or another editor.

## Edit JSON - Azure portal

1. Sign in to the
<a href="https://portal.azure.com" target="_blank">Azure portal</a>.

2. From the left menu, choose **All services**.
In the search box, find "logic apps",
and then from the results, select your logic app.

3. On your logic app's menu, under **Development Tools**,
select **Logic App Code View**.

   The Code View editor opens and shows
   your logic app definition in JSON format.

## Edit JSON - Visual Studio

Before you can work on your logic app definition
in Visual Studio, make sure that you've
[installed the required tools](../logic-apps/quickstart-create-logic-apps-with-visual-studio.md#prerequisites).
To create a logic app with Visual Studio, review
[Quickstart: Automate tasks and processes with Azure Logic Apps - Visual Studio](../logic-apps/quickstart-create-logic-apps-with-visual-studio.md).

In Visual Studio, you can open logic apps that were
created and deployed either directly from the Azure portal
or as Azure Resource Manager projects from Visual Studio.

1. Open the Visual Studio solution,
or [Azure Resource Group](../azure-resource-manager/management/overview.md)
project, that contains your logic app.

2. Find and open your logic app's definition,
which by default, appears in an
[Resource Manager template](../azure-resource-manager/templates/overview.md),
named **LogicApp.json**.
You can use and customize this template for
deployment to different environments.

3. Open the shortcut menu for your
logic app definition and template.
Select **Open With Logic App Designer**.

   ![Open logic app in a Visual Studio solution](./media/logic-apps-author-definitions/open-logic-app-designer.png)

   > [!TIP]
   > If you don't have this command in Visual Studio 2019, check that you have the latest updates for Visual Studio.

4. At the bottom of the designer, choose **Code View**.

   The Code View editor opens and shows
   your logic app definition in JSON format.

5. To return to designer view,
at the bottom of the Code View editor,
choose **Design**.

## Parameters

The deployment lifecycle usually has different environments for development, test, staging, and production. When you have values that you want to reuse throughout your logic app without hardcoding or that vary based on your deployment needs, you can create an [Azure Resource Manager template](../azure-resource-manager/management/overview.md) for your workflow definition so that you can also automate logic app deployment.

Follow these general steps to *parameterize*, or define and use parameters for, those values instead. You can then provide the values in a separate parameter file that passes those values to your template. That way, you can change those values more easily without having to update and redeploy your logic app. For full details, see [Overview: Automate deployment for logic apps with Azure Resource Manager templates](../logic-apps/logic-apps-azure-resource-manager-templates-overview.md).

1. In your template, define template parameters and workflow definition parameters for accepting the values to use at deployment and runtime, respectively.

   Template parameters are defined in a parameters section that's outside your workflow definition, while workflow definition parameters are defined in a parameters section that's inside your workflow definition.

1. Replace the hardcoded values with expressions that reference these parameters. Template expressions use syntax that differs from workflow definition expressions.

   Avoid complicating your code by not using template expressions, which are evaluated at deployment, inside workflow definition expressions, which are evaluated at runtime. Use only template expressions outside your workflow definition. Use only workflow definition expressions inside your workflow definition.

   When you specify the values for your workflow definition parameters, you can reference template parameters by using the parameters section that's outside your workflow definition but still inside the resource definition for your logic app. That way, you can pass template parameter values into your workflow definition parameters.

1. Store the values for your parameters in a separate [parameter file](../azure-resource-manager/templates/parameter-files.md) and include that file with your deployment.

## Process strings with functions

Logic Apps has various functions for working with strings.
For example, suppose you want to pass a company name from an order to another system.
However, you're not sure about proper handling for character encoding.
You could perform base64 encoding on this string, but to avoid escapes in the URL,
you can replace several characters instead. Also, you only need a substring for
the company name because the first five characters are not used.

``` json
{
  "$schema": "https://schema.management.azure.com/schemas/2016-06-01/Microsoft.Logic.json",
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
        "uri": "https://www.example.com/?id=@{replace(replace(base64(substring(parameters('order').companyName,5,sub(length(parameters('order').companyName), 5) )),'+','-') ,'/' ,'_' )}"
      }
    }
  },
  "outputs": {}
}
```

These steps describe how this example processes this string,
working from the inside to the outside:

```
"uri": "https://www.example.com/?id=@{replace(replace(base64(substring(parameters('order').companyName,5,sub(length(parameters('order').companyName), 5) )),'+','-') ,'/' ,'_' )}"
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
  "$schema": "https://schema.management.azure.com/schemas/2016-06-01/Microsoft.Logic.json",
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
        "science": "https://www.nasa.gov",
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
        "uri": "https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&q=https://feeds.wired.com/wired/index"
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
  "$schema": "https://schema.management.azure.com/schemas/2016-06-01/Microsoft.Logic.json",
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
        "uri": "https://www.example.com/?id=@{parameters('order').id}"
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
            "uri": "https://www.example.com/?recordLongOrderTime=@{parameters('order').id}&currentTime=@{utcNow('r')}"
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
