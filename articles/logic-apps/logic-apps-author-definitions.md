---
title: Create, edit, or extend logic app JSON workflow definitions
description: Write, edit, and extend your logic app's JSON workflow definitions in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 12/09/2024
---

# Create, edit, or extend JSON for logic app workflow definitions in Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption](~/reusable-content/ce-skilling/azure/includes/logic-apps-sku-consumption.md)]

When you create enterprise integration solutions with automated workflows in [Azure Logic Apps](/azure/logic-apps/logic-apps-overview), the underlying workflow definitions use simple and declarative JavaScript Object Notation (JSON) along with the [Workflow Definition Language (WDL) schema](/azure/logic-apps/logic-apps-workflow-definition-language) for their description and validation. These formats make workflow definitions easier to read and understand without knowing much about code. When you want to automate creating and deploying logic app resources, you can include workflow definitions as [Azure resources](/azure/azure-resource-manager/management/overview) inside [Azure Resource Manager templates](/azure/azure-resource-manager/templates/overview). To create, manage, and deploy logic apps, you can then use [Azure PowerShell](/powershell/module/az.logicapp), [Azure CLI](/azure/azure-resource-manager/templates/deploy-cli), or the [Azure Logic Apps REST APIs](/rest/api/logic/).

To work with workflow definitions in JSON, open the code view editor when you work in the Azure portal or Visual Studio Code. You can also copy and paste the definition into any editor that you want.

> [!NOTE]
>
> Some Azure Logic Apps capabilities, such as defining parameters and multiple triggers 
> in workflow definitions, are available only in JSON, not the workflow designer. So, 
> for these tasks, you must work in code view or another editor.

## Edit JSON - Azure portal

1. In the <a href="https://portal.azure.com" target="_blank">Azure portal</a> search box, enter and select **logic apps**. From the **Logic apps** page, select the Consumption logic app resource that you want.

1. On the logic app menu, under **Development Tools**, select **Logic app code view**.

   The code view editor opens and shows your logic app's workflow definition in JSON format.

## Edit JSON - Visual Studio Code

See [Edit deployed logic app in Visual Studio Code](/azure/logic-apps/quickstart-create-logic-apps-visual-studio-code#edit-logic-app)

## Edit JSON - Visual Studio

[!INCLUDE [visual-studio-extension-deprecation](includes/visual-studio-extension-deprecation.md)]

Before you can work on a Consumption workflow definition in Visual Studio, make sure that you've [installed the required tools](/azure/logic-apps/quickstart-create-logic-apps-with-visual-studio#prerequisites). In Visual Studio, you can open logic apps that were created and deployed either directly from the Azure portal or as Azure Resource Manager projects from Visual Studio.

1. Open the Visual Studio solution, or [Azure Resource Group](/azure/azure-resource-manager/management/overview) project, that contains your logic app.

1. Find and open your workflow definition, which by default, appears in a [Resource Manager template](/azure/azure-resource-manager/templates/overview), named **LogicApp.json**.

   You can use and customize this template for deployment to different environments.

1. Open the shortcut menu for your workflow definition and template. Select **Open With Logic App Designer**.

   :::image type="content" source="media/logic-apps-author-definitions/open-logic-app-designer.png" alt-text="Screenshot shows opened logic app in a Visual Studio solution.":::

   > [!TIP]
   >
   > If you don't have this command in Visual Studio 2019, make sure that you have the latest updates for Visual Studio.

1. At the bottom of the workflow designer, choose **Code View**.

   The code view editor opens and shows your workflow definition in JSON format.

1. To return to designer view, at the bottom of the code view editor, choose **Design**.

## Parameters

The deployment lifecycle usually has different environments for development, test, staging, and production. When you have values that you want to reuse throughout your logic app without hardcoding or that vary based on your deployment needs, you can create an [Azure Resource Manager template](/azure/azure-resource-manager/management/overview) for your workflow definition so that you can also automate logic app deployment.

Follow these general steps to *parameterize*, or define and use parameters for, those values instead. You can then provide the values in a separate parameter file that passes those values to your template. That way, you can change those values more easily without having to update and redeploy your logic app. For full details, see [Overview: Automate deployment for logic apps with Azure Resource Manager templates](/azure/logic-apps/logic-apps-azure-resource-manager-templates-overview).

1. In your template, define template parameters and workflow definition parameters for accepting the values to use at deployment and runtime, respectively.

   Template parameters are defined in a parameters section that's outside your workflow definition, while workflow definition parameters are defined in a parameters section that's inside your workflow definition.

1. Replace the hardcoded values with expressions that reference these parameters. Template expressions use syntax that differs from workflow definition expressions.

   Avoid complicating your code by not using template expressions, which are evaluated at deployment, inside workflow definition expressions, which are evaluated at runtime. Use only template expressions outside your workflow definition. Use only workflow definition expressions inside your workflow definition.

   When you specify the values for your workflow definition parameters, you can reference template parameters by using the parameters section that's outside your workflow definition but still inside the resource definition for your logic app. That way, you can pass template parameter values into your workflow definition parameters.

1. Store the values for your parameters in a separate [parameter file](/azure/azure-resource-manager/templates/parameter-files) and include that file with your deployment.

## Process strings with functions

Azure Logic Apps has various functions for working with strings. For example, suppose you want to pass a company name from an order to another system. However, you're not sure about proper handling for character encoding. You could perform base64 encoding on this string, but to avoid escapes in the URL, you can replace several characters instead. Also, you only need a substring for the company name because the first five characters aren't used.

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

These steps describe how this example processes this string, working from the inside to the outside:

**`"uri": "https://www.example.com/?id=@{replace(replace(base64(substring(parameters('order').companyName,5,sub(length(parameters('order').companyName), 5) )),'+','-') ,'/' ,'_' )}"`**

1. Get the [**`length()`**](/azure/logic-apps/logic-apps-workflow-definition-language) for the company name, so that you get the total number of characters.

1. To get a shorter string, subtract **5**.

1. Now get a [**`substring()`**](/azure/logic-apps/logic-apps-workflow-definition-language). Start at index **`5`**, and go to the remainder of the string.

1. Convert this substring to a [**`base64()`**](/azure/logic-apps/logic-apps-workflow-definition-language) string.

1. Now [**`replace()`**](/azure/logic-apps/logic-apps-workflow-definition-language) all the **`+`** characters with **`-`** characters.

1. Finally, [**`replace()`**](/azure/logic-apps/logic-apps-workflow-definition-language) all the **`/`** characters with **`_`** characters.

## Map list items to property values, then use maps as parameters

To get different results based on a property's value, you can create a map that matches each property value to a result, then use that map as a parameter.

For example, this workflow defines some categories as parameters and a map that matches those categories with a specific URL. First, the workflow gets a list of articles. Then, the workflow uses the map to find the URL matching the category for each article.

*	The [**`intersection()`** function](/azure/logic-apps/logic-apps-workflow-definition-language) checks whether the category matches a known defined category.

*	After the example gets a matching category, the example pulls the item from the map using square brackets: **`parameters[...]`**

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

To get data from a data source that doesn't natively support *triggers*, you can use Date functions for working with times and dates instead. For example, this expression finds how long this workflow's steps are taking, working from the inside to the outside:

``` json
"expression": "@less(actions('order').startTime,addseconds(utcNow(),-1))",
```

1. From the **`order`** action, extract the **`startTime`**.

1. Get the current time with the **`utcNow()`** function.

1. Subtract one second: [**`addSeconds(..., -1)`**](/azure/logic-apps/logic-apps-workflow-definition-language)

   You can use other units of time such as **`minutes`** or **`hours`**.

1. Now, you can compare these two values.

   If the first value is less than the second value, then more than one second has passed since the order was first placed.

To format dates, you can use string formatters. For example, to get the RFC1123, use [**`utcnow('r')`**](/azure/logic-apps/logic-apps-workflow-definition-language). Learn more about [date formatting](/azure/logic-apps/logic-apps-workflow-definition-language).

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

## Related content

* [Run steps based on a condition (conditional statements)](/azure/logic-apps/logic-apps-control-flow-conditional-statement)
* [Run steps based on different values (switch statements)](/azure/logic-apps/logic-apps-control-flow-switch-statement)
* [Run and repeat steps (loops)](/azure/logic-apps/logic-apps-control-flow-loops)
* [Run or merge parallel steps (branches)](/azure/logic-apps/logic-apps-control-flow-branches)
* [Run steps based on grouped action status (scopes)](/azure/logic-apps/logic-apps-control-flow-run-steps-group-scopes)
* [Workflow Definition Language schema for Azure Logic Apps](/azure/logic-apps/logic-apps-workflow-definition-language)
* [Workflow actions and triggers for Azure Logic Apps](/azure/logic-apps/logic-apps-workflow-actions-triggers)
