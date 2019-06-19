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

# View definition artifact in Azure Managed Applications

View definition is an optional artifact in Azure Managed Applications. It allows to customize user interface elements, including customized overview page and additional views such as Metrics and Custom resources.

This article provides an overview of view definition artifact and its capabilities.

## View definition Artifact

The view definition artifact must be named **`viewDefinition.json`** and must be at the same level as `createUiDefinition.json` and `mainTemplate.json` in .zip package used for creating a managed application definition. To learn how to create .zip package and publish a managed application definition, see [Publish an Azure Managed Application definition](publish-managed-app-definition-quickstart.md)

## View definition Schema

The `viewDefinition.json` file has only one top-level `views` property which is an array of views that will be shown in managed application user interface as a separate menu item in the Table of Contents. Each view should have `kind` property ([Overview](#overview), [Metrics](#metrics), [CustomResources](#custom-Resources)). For more information, see current [JSON schema](TODO:) for `viewDefinition.json`.

The basic template for `viewDefinition.json`:

```json
{
    "views": [
        {
            "kind": "Overview",
            "properties": {
            }
        }
    ]
}

```

## Overview

`"kind": "Overview"`

If this view is provided in `viewDefinition.json`, its content will **override the default Overview page** in your managed application. Example JSON:

```json
{
    "kind": "Overview",
    "properties": {
        "header": "Welcome to your Azure Managed Application",
        "description": "This managed application is for demo purposes only.",
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
|description|No|The description of your managed application.|
|commands|No|The array of additional toolbar buttons of the overview page, see [Commands](#commands) The buttons are Azure Custom Providers actions defined in your `mainTemplate.json`. For an introduction to custom providers, see [Azure Custom Providers Preview overview](custom-providers-overview.md)|

## Metrics

`"kind": "Metrics"`

Metrics view allows to collect and aggregate data from your managed application resources in [Azure Monitor Metrics](../azure-monitor/platform/data-platform-metrics.md). Example JSON:

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

### Chart

|Property|Required|Description|
|---------|---------|---------|
|displayName|Yes|The displayed title of the chart.|
|chartType|No|The visualization to use for this chart. (Defaults to line chart). Supported chart types: `Bar, Line, Area, Scatter`.|
|metrics|Yes|The array of metrics to plot on this chart. List of metrics supported in Azure portal is here [Supported metrics with Azure Monitor](../azure-monitor/platform/metrics-supported.md)|

### Metric

|Property|Required|Description|
|---------|---------|---------|
|name|Yes|The name of the metric.|
|aggregationType|Yes|The aggregation type to use for this metric. Supported aggregation types: `none, sum, min, max, avg, unique, percentile, count`|
|namespace|No|Additional information to use when determining the correct metrics provider.|
|resourceTagFilter|No|The resource tags array (will be separated with `or` word) for which metrics would be displayed. Applies on top of resource type filter.|
|resourceType|Yes|The resource type for which metrics would be displayed.|

## Custom resources

`"kind": "CustomResources"`

You can define multiple views of this kind. Each view should represent **unique** custom resource type of your custom provider defined in `mainTemplate.json`. For an introduction to custom providers, see [Azure Custom Providers Preview overview](custom-providers-overview.md).

In this view you can perform GET, PUT, DELETE and POST operations for your custom resource type. POST operations could be global custom action or custom action in a context of your custom resource type. Example JSON for defining CustomResources view:

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
|displayName|Yes|The displayed title of the view. The title should be **unique** for each CustomResources view in your `viewDefinition.json`|
|version|No|The version of the platform used to render the view.|
|resourceType|Yes|The custom resource type. Must be a **unique** custom resource type of your custom provider.|
|createUIDefinition|No|Create UI Definition schema for create custom resource command. For an introduction to creating UI definitions, see [Getting started with CreateUiDefinition](create-uidefinition-overview.md)|
|commands|No|The array of additional toolbar buttons of the CustomResources view, see [Commands](#commands) The buttons are Azure Custom Providers actions defined in your `mainTemplate.json`. For an introduction to custom providers, see [Azure Custom Providers Preview overview](custom-providers-overview.md)|
|columns|No|The array of columns of the custom resource. If not defined the `name` column will be shown by default. The column must have `"key"` (The key of the property to display in a view. If nested, use dot as delimiter, for example, `"key": "name"` or `"key": "properties.property1"`) and `"displayName"` (The display name of the property to display in a view) properties, and could have `"optional"` property (If true, the column will be hidden in a view by default.).|

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
|path|Yes|The custom provider action name. The action must be defined in `mainTemplate.json`|
|icon|No|The icon of the command button. List of supported icons is defined in [JSON Schema](TODO:)|
|createUIDefinition|No|Create UI Definition schema for command. For an introduction to creating UI definitions, see [Getting started with CreateUiDefinition](create-uidefinition-overview.md)|

## Next steps

- For an introduction to managed applications, see [Azure Managed Application overview](overview.md).
- For an introduction to custom providers, see [Azure Custom Providers overview](custom-providers-overview.md).
