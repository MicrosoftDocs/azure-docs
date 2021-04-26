---
title: Telemetry processors (preview) - Azure Monitor Application Insights for Java
description: Learn to configure telemetry processors in Azure Monitor Application Insights for Java.
ms.topic: conceptual
ms.date: 10/29/2020
author: kryalama
ms.custom: devx-track-java
ms.author: kryalama
---

# Telemetry processors (preview) - Azure Monitor Application Insights for Java

> [!NOTE]
> The telemetry processors feature is in preview.

The Java 3.0 agent for Application Insights can process telemetry data before the data is exported.

Here are some use cases for telemetry processors:
 * Mask sensitive data.
 * Conditionally add custom dimensions.
 * Update the span name, which is used to aggregate similar telemetry in the Azure portal.
 * Drop specific span attribute(s) to control ingestion costs.

> [!NOTE]
> If you are looking to drop specific (whole) spans for controlling ingestion cost,
> see [sampling overrides](./java-standalone-sampling-overrides.md).

## Terminology

Before you learn about telemetry processors, you should understand the term *span*. A span is a general term for:

* An incoming request.
* An outgoing dependency (for example, a remote call to another service).
* An in-process dependency (for example, work being done by subcomponents of the service).

For telemetry processors, these span components are important:

* Name
* Attributes

The span name is the primary display for requests and dependencies in the Azure portal. Span attributes represent both standard and custom properties of a given request or dependency.

## Telemetry processor types

Currently, the two types of telemetry processors are attribute processors and span processors.

An attribute processor can insert, update, delete, or hash attributes.
It can also use a regular expression to extract one or more new attributes from an existing attribute.

A span processor can update the telemetry name.
It can also use a regular expression to extract one or more new attributes from the span name.

> [!NOTE]
> Currently, telemetry processors process only attributes of type string. They don't process attributes of type Boolean or number.

## Getting started

To begin, create a configuration file named *applicationinsights.json*. Save it in the same directory as *applicationinsights-agent-\*.jar*. Use the following template.

```json
{
  "connectionString": "InstrumentationKey=00000000-0000-0000-0000-000000000000",
  "preview": {
    "processors": [
      {
        "type": "attribute",
        ...
      },
      {
        "type": "attribute",
        ...
      },
      {
        "type": "span",
        ...
      }
    ]
  }
}
```

## Include criteria and exclude criteria

Both attribute processors and span processors support optional `include` and `exclude` criteria.
A processor is applied only to spans that match its `include` criteria (if it's provided)
_and_ don't match its `exclude` criteria (if it's provided).

To configure this option, under `include` or `exclude` (or both), specify at least one `matchType` and either `spanNames` or `attributes`.
The include-exclude configuration allows more than one specified condition.
All specified conditions must evaluate to true to result in a match. 

* **Required field**: `matchType` controls how items in `spanNames` arrays and `attributes` arrays are interpreted. Possible values are `regexp` and `strict`. 

* **Optional fields**: 
    * `spanNames` must match at least one of the items. 
    * `attributes` specifies the list of attributes to match. All of these attributes must match exactly to result in a match.
    
> [!NOTE]
> If both `include` and `exclude` are specified, the `include` properties are checked before the `exclude` properties are checked.

### Sample usage

```json
"processors": [
  {
    "type": "attribute",
    "include": {
      "matchType": "strict",
      "spanNames": [
        "spanA",
        "spanB"
      ]
    },
    "exclude": {
      "matchType": "strict",
      "attributes": [
        {
          "key": "redact_trace",
          "value": "false"
        }
      ]
    },
    "actions": [
      {
        "key": "credit_card",
        "action": "delete"
      },
      {
        "key": "duplicate_key",
        "action": "delete"
      }
    ]
  }
]
```
For more information, see [Telemetry processor examples](./java-standalone-telemetry-processors-examples.md).

## Attribute processor

The attribute processor modifies attributes of a span. It can support the ability to include or exclude spans. It takes a list of actions that are performed in the order that the configuration file specifies. The processor supports these actions:

- `insert`
- `update`
- `delete`
- `hash`
- `extract`
### `insert`

The `insert` action inserts a new attribute in spans where the key doesn't already exist.   

```json
"processors": [
  {
    "type": "attribute",
    "actions": [
      {
        "key": "attribute1",
        "value": "value1",
        "action": "insert"
      }
    ]
  }
]
```
The `insert` action requires the following settings:
* `key`
* Either `value` or `fromAttribute`
* `action`: `insert`

### `update`

The `update` action updates an attribute in spans where the key already exists.

```json
"processors": [
  {
    "type": "attribute",
    "actions": [
      {
        "key": "attribute1",
        "value": "newValue",
        "action": "update"
      }
    ]
  }
]
```
The `update` action requires the following settings:
* `key`
* Either `value` or `fromAttribute`
* `action`: `update`


### `delete` 

The `delete` action deletes an attribute from a span.

```json
"processors": [
  {
    "type": "attribute",
    "actions": [
      {
        "key": "attribute1",
        "action": "delete"
      }
    ]
  }
]
```
The `delete` action requires the following settings:
* `key`
* `action`: `delete`

### `hash`

The `hash` action hashes (SHA1) an existing attribute value.

```json
"processors": [
  {
    "type": "attribute",
    "actions": [
      {
        "key": "attribute1",
        "action": "hash"
      }
    ]
  }
]
```
The `hash` action requires the following settings:
* `key`
* `action`: `hash`

### `extract`

> [!NOTE]
> The `extract` feature is available only in version 3.0.2 and later.

The `extract` action extracts values by using a regular expression rule from the input key to target keys that the rule specifies. If a target key already exists, it's overridden. This action behaves like the [span processor](#extract-attributes-from-the-span-name) `toAttributes` setting, where the existing attribute is the source.

```json
"processors": [
  {
    "type": "attribute",
    "actions": [
      {
        "key": "attribute1",
        "pattern": "<regular pattern with named matchers>",
        "action": "extract"
      }
    ]
  }
]
```
The `extract` action requires the following settings:
* `key`
* `pattern`
* `action`: `extract`

For more information, see [Telemetry processor examples](./java-standalone-telemetry-processors-examples.md).

## Span processor

The span processor modifies either the span name or attributes of a span based on the span name. It can support the ability to include or exclude spans.

### Name a span

The `name` section requires the `fromAttributes` setting. The values from these attributes are used to create a new name, concatenated in the order that the configuration specifies. The processor will change the span name only if all of these attributes are present on the span.

The `separator` setting is optional. This setting is a string. It's specified to split values.
> [!NOTE]
> If renaming relies on the attributes processor to modify attributes, ensure the span processor is specified after the attributes processor in the pipeline specification.

```json
"processors": [
  {
    "type": "span",
    "name": {
      "fromAttributes": [
        "attributeKey1",
        "attributeKey2",
      ],
      "separator": "::"
    }
  }
] 
```

### Extract attributes from the span name

The `toAttributes` section lists the regular expressions to match the span name against. It extracts attributes based on subexpressions.

The `rules` setting is required. This setting lists the rules that are used to extract attribute values from the span name. 

The values in the span name are replaced by extracted attribute names. Each rule in the list is a regular expression (regex) pattern string. 

Here's how values are replaced by extracted attribute names:

1. The span name is checked against the regex. 
1. If the regex matches, all named subexpressions of the regex are extracted as attributes. 
1. The extracted attributes are added to the span. 
1. Each subexpression name becomes an attribute name. 
1. The subexpression matched portion becomes the attribute value. 
1. The matched portion in the span name is replaced by the extracted attribute name. If the attributes already exist in the span, they're overwritten. 
 
This process is repeated for all rules in the order they're specified. Each subsequent rule works on the span name that's the output of the previous rule.

```json
"processors": [
  {
    "type": "span",
    "name": {
      "toAttributes": {
        "rules": [
          "rule1",
          "rule2",
          "rule3"
        ]
      }
    }
  }
]

```

## Common span attributes

This section lists some common span attributes that telemetry processors can use.

### HTTP spans

| Attribute  | Type | Description | 
|---|---|---|
| `http.method` | string | HTTP request method.|
| `http.url` | string | Full HTTP request URL in the form `scheme://host[:port]/path?query[#fragment]`. The fragment isn't usually transmitted over HTTP. But if the fragment is known, it should be included.|
| `http.status_code` | number | [HTTP response status code](https://tools.ietf.org/html/rfc7231#section-6).|
| `http.flavor` | string | Type of HTTP protocol. |
| `http.user_agent` | string | Value of the [HTTP User-Agent](https://tools.ietf.org/html/rfc7231#section-5.5.3) header sent by the client. |

### JDBC spans

| Attribute  | Type | Description  |
|---|---|---|
| `db.system` | string | Identifier for the database management system (DBMS) product being used. |
| `db.connection_string` | string | Connection string used to connect to the database. It's recommended to remove embedded credentials.|
| `db.user` | string | Username for accessing the database. |
| `db.name` | string | String used to report the name of the database being accessed. For commands that switch the database, this string should be set to the target database, even if the command fails.|
| `db.statement` | string | Database statement that's being run.|
