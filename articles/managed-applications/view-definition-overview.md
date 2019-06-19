---
title: Overview of View Definition in Azure Managed Applications | Microsoft Docs
description: Describes the concept of creating View Definition for Azure Managed Applications. 
services: managed-applications
ms.service: managed-applications
ms.topic: conceptual
ms.author: lazinnat
author: lazinnat
ms.date: 06/12/2019
---

# Overview of View Definition artifact in Azure Managed Applications

View Definition is an optional artifact in Azure Managed Applications that allows you to customize user interface elements, including customized overview page and additional views such as Metrics and Custom Resources.

This article provides an overview of View Definition artifact and its capabilities.

## View Definition Artifact

The View Definition artifact must be named **`viewDefinition.json`** and must be at the same level as `createUiDefinition.json` and `mainTemplate.json` in .zip package used for creating a managed application definition. To learn how to create .zip package and publish a managed application definition, see [Publish an Azure managed application definition](publish-managed-app-definition-quickstart.md)

## View Definition Schema

The `viewDefinition.json` file has only one top level property `views` which is an array of views that will be shown in Azure Managed Application user interface as a separate menu item in the Table of Contents. Each view should have `kind` property from the [supported views](#Supported-views). For more details, see current [JSON schema](TODO:) for `viewDefinition.json`. The basic template for `viewDefinition.json`:

```json
{
    "views": [
        {
            "kind": "*Required. The view kind from the supported list.",
            "properties": {
            }
        }
    ]
}

```

## Supported views

1. Overview. `"kind": "Overview"`

    If this view is provided in `viewDefinition.json`, its content will **override the default Overview page** in your Azure Managed Application. Example JSON:

    ```json
    {
        "kind": "Overview",
        "properties": {
            "header": "Welcome to your Managed Application",
            "description": "This Managed app is for demo purposes only.",
            "commands": [
                {
                    "displayName": "Test Action.",
                    "path": "testAction"
                }
            ]
        }
    }
    ```

    |Property|Required|Description|
    |---------|---------|---------|
    |header|No|The header of the overview page.|
    |description|No|The description of your Azure Managed Application.|
    |commands|No|The array of additional toolbar buttons of the overview page, see [Commands](#commands) The buttons are Azure Custom Providers actions defined in your `mainTemplate.json`. For an introduction to custom providers, see [Azure Custom Providers Preview overview](custom-providers-overview.md)|

2. Metrics. `"kind": "Metrics"`

    Metrics view allows to collect and aggregate data from your Managed Application resources in [Azure Monitor Metrics](../azure-monitor/platform/data-platform-metrics.md). Example JSON:

    ```json
    {
        "kind": "Metrics",
        "properties": {
            "displayName": "This is my metrics view.",
            "version": "1.0.0",
            "charts": [
                {
                    "displayName": "This is my chart.",
                    "chartType": "Bar",
                    "metrics": [
                        {
                            "name": "This is my metric.",
                            "aggregationType": "avg",
                            "namespace": "Availability",
                            "resourceTagFilter": [ "tag1" ],
                            "resourceType": "Microsoft.Storage/storageAccounts"
                        }
                    ]
                }
            ]
        }
    }
    ```

    |Property|Required|Description|
    |---------|---------|---------|
    |displayName|No|The displayed title of the view.|
    |version|No|The version of the platform used to render the view.|
    |charts|Yes|The array of charts of the metrics page.|

    Chart properties:

    |Property|Required|Description|
    |---------|---------|---------|
    |displayName|Yes|The displayed title of the chart.|
    |chartType|No|The visualization to use for this chart. (Defaults to line chart). Supported chart types: `Bar, Line, Area, Scatter`.|
    |metrics|Yes|The array of metrics to plot on this chart. List of metrics supported in Azure Portal is here [Supported metrics with Azure Monitor](../azure-monitor/platform/metrics-supported.md)|

    Metrics properties:

    |Property|Required|Description|
    |---------|---------|---------|
    |name|Yes|The name of the metric.|
    |aggregationType|Yes|The aggregation type to use for this metric. Supported aggregation types: `none, sum, min, max, avg, unique, percentile, count`|
    |namespace|No|Additional information to use when determining the correct metrics provider.|
    |resourceTagFilter|No|The resource tags array (will be separated with `or` word) for which metrics would be displayed. This is on top of resource type filter.|
    |resourceType|Yes|The resource type for which metrics would be displayed.|

3. Custom Resources. `"kind": "CustomResources"`

    You can define multiple views of this kind. Each view should represent **unique** custom resource type of your Azure Custom Providers defined in `mainTemplate.json`. For an introduction to custom providers, see [Azure Custom Providers Preview overview](custom-providers-overview.md).

    In this view you can perform GET, PUT, DELETE and POST operations for your custom resource type. POST operations could be global custom action or custom action in a context of your custom resource type. Example JSON for defining Custom Resources view:

    ```json
    {
        "kind": "CustomResources",
        "properties": {
            "displayName": "This is my custom resource type.",
            "version": "1.0.0",
            "resourceType": "myCustomResource",
            "createUIDefinition": { },
            "commands": [
                {
                    "displayName": "Custom Test Action",
                    "path": "testAction"
                },
                {
                    "displayName": "Custom Context Test Action",
                    "path": "myCustomResource/testContextAction",
                    "icon": "Stop",
                    "createUIDefinition": { },
                }
            ],
            "columns": [
                {"key": "name", "displayName": "Name"},
                {"key": "properties.myProperty1", "displayName": "Property 1"},
                {"key": "properties.myProperty2", "displayName": "Property 2", "optional": true}
            ]
        }
    }
    ```

    |Property|Required|Description|
    |---------|---------|---------|
    |displayName|Yes|The displayed title of the view. This should be **unique** for each Custom Resources view in your `viewDefinition.json`|
    |version|No|The version of the platform used to render the view.|
    |resourceType|Yes|The Custom Resource type. Must be a **unique** custom resource type of your Azure Custom Providers.|
    |createUIDefinition|No|Create UI Definition schema for create custom resource command. For an introduction to creating UI definitions, see [Getting started with CreateUiDefinition](create-uidefinition-overview.md)|
    |commands|No|The array of additional toolbar buttons of the Custom Resources view, see [Commands](#commands) The buttons are Azure Custom Providers actions defined in your `mainTemplate.json`. For an introduction to custom providers, see [Azure Custom Providers Preview overview](custom-providers-overview.md)|
    |columns|No|The array of columns of the custom resource. If not defined the `name` column will be shown by default. The column must have `"key"` (The key of the property to display in a view. If nested, use dot as delimiter, e.g. `"key": "name"` or `"key": "properties.property1"`) and `"displayName"` (The display name of the property to display in a view) properties, and could have `"optional"` property (If true, the column will not be displayed in a view by default.).|

## Commands

Commands is an array of additional toolbar buttons that will be displayed on page. Each command represents POST action of your Azure Custom Provider defined in `mainTemplate.json`. Example JSON:

```json
    {
        "commands": [
            {
                "displayName": "Start Test Action.",
                "path": "testAction",
                "icon": "Start",
                "createUIDefinition": { }
            },
        ]
    }
```

|Property|Required|Description|
|---------|---------|---------|
|displayName|Yes|The displayed name of the command button.|
|path|Yes|The CustomProvider action name. The action must be defined in `mainTemplate.json`|
|icon|No|The icon of the command button. List of supported icons is defined in [JSON Schema](TODO:)|
|createUIDefinition|No|Create UI Definition schema for command. For an introduction to creating UI definitions, see [Getting started with CreateUiDefinition](create-uidefinition-overview.md)|

## Next steps

- For an introduction to managed applications, see [Managed Application overview](overview.md).
- For an introduction to custom providers, see [Custom Providers overview](custom-providers-overview.md).
