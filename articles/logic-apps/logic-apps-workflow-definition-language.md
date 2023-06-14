---
title: Workflow Definition Language schema reference
description: Reference guide to the JSON schema and syntax for the Workflow Definition Language that describes workflows in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: reference
ms.date: 08/20/2022
---

# Schema reference guide for the Workflow Definition Language in Azure Logic Apps

When you create a logic app in [Azure Logic Apps](../logic-apps/logic-apps-overview.md), 
your logic app has an underlying workflow definition that 
describes the actual logic that runs in your logic app. 
That workflow definition uses [JSON](https://www.json.org/) 
and follows a structure that's validated by the 
Workflow Definition Language schema. This reference 
provides an overview about this structure and how 
the schema defines attributes in your workflow definition.

## Workflow definition structure

A workflow definition always includes a trigger for instantiating your 
logic app, plus one or more actions that run after the trigger fires.

Here is the high-level structure for a workflow definition:

```json
"definition": {
  "$schema": "<workflow-definition-language-schema-version>",
  "actions": { "<workflow-action-definitions>" },
  "contentVersion": "<workflow-definition-version-number>",
  "outputs": { "<workflow-output-definitions>" },
  "parameters": { "<workflow-parameter-definitions>" },
  "staticResults": { "<static-results-definitions>" },
  "triggers": { "<workflow-trigger-definitions>" }
}
```

| Attribute | Required | Description |
|-----------|----------|-------------|
| `definition` | Yes | The starting element for your workflow definition |
| `$schema` | Only when externally referencing a workflow definition | The location for the JSON schema file that describes the Workflow Definition Language version, which you can find here: <p>`https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json`</p> |
| `actions` | No | The definitions for one or more actions to execute at workflow runtime. For more information, see [Triggers and actions](#triggers-actions). <p><p>Maximum actions: 250 |
| `contentVersion` | No | The version number for your workflow definition, which is "1.0.0.0" by default. To help identify and confirm the correct definition when deploying a workflow, specify a value to use. |
| `outputs` | No | The definitions for the outputs to return from a workflow run. For more information, see [Outputs](#outputs). <p><p>Maximum outputs: 10 |
| `parameters` | No | The definitions for one or more parameters that pass the values to use at your logic app's runtime. For more information, see [Parameters](#parameters). <p><p>Maximum parameters: 50 |
| `staticResults` | No | The definitions for one or more static results returned by actions as mock outputs when static results are enabled on those actions. In each action definition, the `runtimeConfiguration.staticResult.name` attribute references the corresponding definition inside `staticResults`. For more information, see [Static results](#static-results). |
| `triggers` | No | The definitions for one or more triggers that instantiate your workflow. You can define more than one trigger, but only with the Workflow Definition Language, not visually through the Logic Apps Designer. For more information, see [Triggers and actions](#triggers-actions). <p><p>Maximum triggers: 10 |
||||

<a name="triggers-actions"></a>

## Triggers and actions

In a workflow definition, the `triggers` and `actions` sections 
define the calls that happen during your workflow's execution. 
For syntax and more information about these sections, see 
[Workflow triggers and actions](../logic-apps/logic-apps-workflow-actions-triggers.md).

<a name="parameters"></a>

## Parameters

The deployment lifecycle usually has different environments for development, test, staging, and production. When deploying logic apps to various environments, you likely want to use different values, such as connection strings, based on your deployment needs. Or, you might have values that you want to reuse throughout your logic app without hardcoding or that change often. In your workflow definition's `parameters` section, you can define or edit parameters for the values that your logic app uses at runtime. You must define these parameters first before you can reference these parameters elsewhere in your workflow definition.

Here is the general structure for a parameter definition:

```json
"parameters": {
   "<parameter-name>": {
      "type": "<parameter-type>",
      "defaultValue": <default-parameter-value>,
      "allowedValues": [ <array-with-permitted-parameter-values> ],
      "metadata": {
         "description": "<parameter-description>"
      }
   }
},
```

| Attribute | Required | Type | Description |
|-----------|----------|------|-------------|
| <*parameter-name*> | Yes | String | The name for the parameter that you want to define |
| <*parameter-type*> | Yes | int, float, string, bool, array, object, securestring, secureobject <p><p>**Note**: For all passwords, keys, and secrets, use the `securestring` or `secureobject` types because the `GET` operation doesn't return these types. For more information about securing parameters, see [Security recommendations for action and input parameters](../logic-apps/logic-apps-securing-a-logic-app.md#secure-action-parameters). | The type for the parameter |
| <*default-parameter-value*> | Yes | Same as `type` | The default parameter value to use if no value is specified when the workflow instantiates. The `defaultValue` attribute is required so that the Logic App Designer can correctly show the parameter, but you can specify an empty value. |
| <*array-with-permitted-parameter-values*> | No | Array | An array with values that the parameter can accept |
| <*parameter-description*> | No | JSON object | Any other parameter details, such as a description for the parameter |
||||

Next, create an [Azure Resource Manager template](../azure-resource-manager/templates/overview.md) for your workflow definition, define template parameters that accept the values you want at deployment, replace hardcoded values with references to template or workflow definition parameters as appropriate, and store the values to use at deployment in a separate [parameter file](../azure-resource-manager/templates/parameter-files.md). That way, you can change those values more easily through the parameter file without having to update and redeploy your logic app. For information that is sensitive or must be secured, such as usernames, passwords, and secrets, you can store those values in Azure Key Vault and have your parameter file retrieve those values from your key vault. For more information and examples about defining parameters at the template and workflow definition levels, see [Overview: Automate deployment for logic apps with Azure Resource Manager templates](../logic-apps/logic-apps-azure-resource-manager-templates-overview.md).

<a name="static-results"></a>

## Static results

In the `staticResults` attribute, define an action's mock `outputs` and `status` 
that the action returns when the action's static result setting is turned on. In the 
action's definition, the `runtimeConfiguration.staticResult.name` attribute references 
the name for the static result definition inside `staticResults`. Learn how you can 
[test logic apps with mock data by setting up static results](../logic-apps/test-logic-apps-mock-data-static-results.md).

```json
"definition": {
   "$schema": "<...>",
   "actions": { "<...>" },
   "contentVersion": "<...>",
   "outputs": { "<...>" },
   "parameters": { "<...>" },
   "staticResults": {
      "<static-result-definition-name>": {
         "outputs": {
            <output-attributes-and-values-returned>,
            "headers": { <header-values> },
            "statusCode": "<status-code-returned>"
         },
         "status": "<action-status>"
      }
   },
   "triggers": { "<...>" }
}
```

| Attribute | Required | Type | Description |
|-----------|----------|------|-------------|
| <*static-result-definition-name*> | Yes | String | The name for a static result definition that an action definition can reference through a `runtimeConfiguration.staticResult` object. For more information, see [Runtime configuration settings](../logic-apps/logic-apps-workflow-actions-triggers.md#runtime-config-options). <p>You can use any unique name that you want. By default, this unique name is appended with a number, which is incremented as necessary. |
| <*output-attributes-and-values-returned*> | Yes | Varies | The requirements for these attributes vary based on different conditions. For example, when the `status` is `Succeeded`, the `outputs` attribute includes attributes and values returned as mock outputs by the action. If the `status` is `Failed`, the `outputs` attribute includes the `errors` attribute, which is an array with one or more error `message` objects that have error information. |
| <*header-values*> | No | JSON | Any header values returned by the action |
| <*status-code-returned*> | Yes | String | The status code returned by the action |
| <*action-status*> | Yes | String | The action's status, for example, `Succeeded` or `Failed` |
|||||

For example, in this HTTP action definition, the `runtimeConfiguration.staticResult.name` 
attribute references `HTTP0` inside the `staticResults` attribute where the mock outputs 
for the action are defined. The `runtimeConfiguration.staticResult.staticResultOptions` 
attribute specifies that the static result setting is `Enabled` on the HTTP action.

```json
"actions": {
   "HTTP": {
      "inputs": {
         "method": "GET",
         "uri": "https://www.microsoft.com"
      },
      "runAfter": {},
      "runtimeConfiguration": {
         "staticResult": {
            "name": "HTTP0",
            "staticResultOptions": "Enabled"
         }
      },
      "type": "Http"
   }
},
```

The HTTP action returns the outputs in the `HTTP0` definition inside `staticResults`. 
In this example, for the status code, the mock output is `OK`. For header values, 
the mock output is `"Content-Type": "application/JSON"`. For the action's status, 
the mock output is `Succeeded`.

```json
"definition": {
   "$schema": "<...>",
   "actions": { "<...>" },
   "contentVersion": "<...>",
   "outputs": { "<...>" },
   "parameters": { "<...>" },
   "staticResults": {
      "HTTP0": {
         "outputs": {
            "headers": {
               "Content-Type": "application/JSON"
            },
            "statusCode": "OK"
         },
         "status": "Succeeded"
      }
   },
   "triggers": { "<...>" }
},
```

<a name="expressions"></a>

## Expressions

With JSON, you can have literal values that exist at design time, for example:

```json
"customerName": "Sophia Owen",
"rainbowColors": ["red", "orange", "yellow", "green", "blue", "indigo", "violet"],
"rainbowColorsCount": 7
```

You can also have values that don't exist until run time. 
To represent these values, you can use *expressions*, 
which are evaluated at run time. An expression is a sequence 
that can contain one or more [functions](#functions), 
[operators](#operators), [variables](./logic-apps-create-variables-store-values.md), explicit values, 
or constants. In your workflow definition, 
you can use an expression anywhere in a JSON 
string value by prefixing the expression with the at-sign (\@). 
When evaluating an expression that represents a JSON value, 
the expression body is extracted by removing the \@ character, 
and always results in another JSON value.

For example, for the previously defined `customerName` property, 
you can get the property value by using the 
[parameters()](../logic-apps/workflow-definition-language-functions-reference.md#parameters) 
function in an expression and assign that value to the `accountName` property:

```json
"customerName": "Sophia Owen",
"accountName": "@parameters('customerName')"
```

*String interpolation* also lets you use multiple expressions inside 
strings that are wrapped by the \@ character and curly braces ({}). 
Here is the syntax:

```json
@{ "<expression1>", "<expression2>" }
```

The result is always a string, making this capability 
similar to the `concat()` function, for example: 

```json
"customerName": "First name: @{parameters('firstName')} Last name: @{parameters('lastName')}"
```

If you have a literal string that starts with the \@ character, 
prefix the \@ character with another \@ character as an escape character: \@\@

These examples show how expressions are evaluated:

| JSON value | Result |
|------------|--------|
| "Sophia Owen" | Return these characters: 'Sophia Owen' |
| "array[1]" | Return these characters: 'array[1]' |
| "\@\@" | Return these characters as a one-character string: '\@' |
| " \@" | Return these characters as a two-character string: ' \@' |
|||

For these examples, suppose you define "myBirthMonth" 
equal to "January" and "myAge" equal to the number 42:

```json
"myBirthMonth": "January",
"myAge": 42
```

These examples show how the following expressions are evaluated:

| JSON expression | Result |
|-----------------|--------|
| "\@parameters('myBirthMonth')" | Return this string: "January" |
| "\@{parameters('myBirthMonth')}" | Return this string: "January" |
| "\@parameters('myAge')" | Return this number: 42 |
| "\@{parameters('myAge')}" | Return this number as a string: "42" |
| "My age is \@{parameters('myAge')}" | Return this string: "My age is 42" |
| "\@concat('My age is ', string(parameters('myAge')))" | Return this string: "My age is 42" |
| "My age is \@\@{parameters('myAge')}" | Return this string, which includes the expression: "My age is \@{parameters('myAge')}` |
|||

When you're working visually in the Logic Apps Designer, 
you can create expressions through the Expression builder, 
for example:

![Logic Apps Designer > Expression builder](./media/logic-apps-workflow-definition-language/expression-builder.png)

When you're done, the expression appears for the 
corresponding property in your workflow definition, 
for example, the `searchQuery` property here:

```json
"Search_tweets": {
  "inputs": {
    "host": {
      "connection": {
        "name": "@parameters('$connections')['twitter']['connectionId']"
      }
    }
  },
  "method": "get",
  "path": "/searchtweets",
  "queries": {
    "maxResults": 20,
    "searchQuery": "Azure @{concat('firstName','', 'LastName')}"
  }
},
```

<a name="outputs"></a>

## Outputs

In the `outputs` section, define the data that 
your workflow can return when finished running. 
For example, to track a specific status or value from each run, 
specify that the workflow output returns that data.

> [!NOTE]
> When responding to incoming requests from a service's REST API, 
> do not use `outputs`. Instead, use the `Response` action type. 
> For more information, see [Workflow triggers and actions](../logic-apps/logic-apps-workflow-actions-triggers.md).

Here is the general structure for an output definition:

```json
"outputs": {
  "<key-name>": {
    "type": "<key-type>",
    "value": "<key-value>"
  }
}
```

| Attribute | Required | Type | Description |
|-----------|----------|------|-------------|
| <*key-name*> | Yes | String | The key name for the output return value |
| <*key-type*> | Yes | int, float, string, securestring, bool, array, JSON object | The type for the output return value |
| <*key-value*> | Yes | Same as <*key-type*> | The output return value |
|||||

To get the output from a workflow run, review your logic 
app's run history and details in the Azure portal or use the 
[Workflow REST API](/rest/api/logic/workflows). 
You can also pass output to external systems, for example, 
Power BI so that you can create dashboards.

<a name="operators"></a>

## Operators

In [expressions](#expressions) and [functions](#functions), 
operators perform specific tasks, such as reference a 
property or a value in an array.

| Operator | Task |
|----------|------|
| `'` | To use a string literal as input or in expressions and functions, wrap the string only with single quotation marks, for example, `'<myString>'`. Do not use double quotation marks (`""`), which conflict with the JSON formatting around an entire expression. For example: <p>**Yes**: length('Hello') </br>**No**: length("Hello") <p>When you pass arrays or numbers, you don't need wrapping punctuation. For example: <p>**Yes**: length([1, 2, 3]) </br>**No**: length("[1, 2, 3]") |
| `[]` | To reference a value at a specific position (index) in an array, use square brackets. For example, to get the second item in an array: <p>`myArray[1]` |
| `.` | To reference a property in an object, use the dot operator. For example, to get the `name` property for a `customer` JSON object: <p>`"@parameters('customer').name"` |
| `?` | To reference null properties in an object without a runtime error, use the question mark operator. For example, to handle null outputs from a trigger, you can use this expression: <p>`@coalesce(trigger().outputs?.body?.<someProperty>, '<property-default-value>')` |
|||

<a name="functions"></a>

## Functions

Some expressions get their values from runtime actions that might 
not yet exist when your workflow definition starts to run. 
To reference or work with these values in expressions, 
you can use [*functions*](../logic-apps/workflow-definition-language-functions-reference.md) 
that the Workflow Definition Language provides.

## Next steps

* Learn about [Workflow Definition Language actions and triggers](../logic-apps/logic-apps-workflow-actions-triggers.md)
* Learn about programmatically creating and managing logic apps with the [Workflow REST API](/rest/api/logic/workflows)
