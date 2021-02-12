---
title: Telemetry processors (preview) - Azure Monitor Application Insights for Java
description: How to configure telemetry processors in Azure Monitor Application Insights for Java
ms.topic: conceptual
ms.date: 10/29/2020
author: kryalama
ms.custom: devx-track-java
ms.author: kryalama
---

# Telemetry processors (preview) - Azure Monitor Application Insights for Java

> [!NOTE]
> This feature is still under preview.

Java 3.0 Agent for Application Insights now has the capabilities to process telemetry data before the data is exported.

The following are some use cases of telemetry processors:
 * Mask sensitive data
 * Conditionally add custom dimensions
 * Update the name that is used for aggregation and display in the Azure portal
 * Drop span attributes to control ingestion cost

## Terminology

Before we jump into telemetry processors, it is important to understand what the term span refers to.

A span is a general term for any of these three things:

* An incoming request
* An outgoing dependency (e.g. a remote call to another service)
* An in-process dependency (e.g. work being done by sub-components of the service)

For the purpose of telemetry processors, the important components of a span are:

* Name
* Attributes

The span name is the primary display used for requests and dependencies in the Azure portal.

The span attributes represent both standard and custom properties of a given request or dependency.

## Telemetry processor types

There are currently two types of telemetry processors.

#### Attribute processor

An attribute processor has the ability to insert, update, delete, or hash attributes.
It can also extract (via a regular expression) one or more new attributes from an existing attribute.

#### Span processor

A span processor has the ability to update the telemetry name.
It can also extract (via a regular expression) one or more new attributes from the span name.

> [!NOTE]
> Note that currently telemetry processors only process attributes of type string,
and do not process attributes of type boolean or number.

## Getting started

Create a configuration file named `applicationinsights.json`, and place it in the same directory as `applicationinsights-agent-*.jar`, with the following template.

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

## Include/exclude criteria

Both attribute processors and span processors support optional `include` and `exclude` criteria.
A processor will only be applied to those spans that match its `include` criteria (if provided)
_and_ do not match its `exclude` criteria (if provided).

To configure this option, under `include` and/or `exclude` at least one `matchType` and one of `spanNames` or `attributes` is required.
The include/exclude configuration is supported to have more than one specified condition.
All of the specified conditions must evaluate to true for a match to occur. 

**Required field**: 
* `matchType` controls how items in `spanNames` and `attributes` arrays are interpreted. Possible values are `regexp` or `strict`. 

**Optional fields**: 
* `spanNames` must match at least one of the items. 
* `attributes` specifies the list of attributes to match against. All of these attributes must match exactly for a match to occur.

> [!NOTE]
> If both `include` and `exclude` are specified, the `include` properties are checked before the `exclude` properties.

#### Sample Usage

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
For more understanding, check out the [telemetry processor examples](./java-standalone-telemetry-processors-examples.md) documentation.

## Attribute processor

The attributes processor modifies attributes of a span. It optionally supports the ability to include/exclude spans. It takes a list of actions which are performed in order specified in the configuration file. The supported actions are:

### `insert`

Inserts a new attribute in spans where the key does not already exist.   

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
For the `insert` action, following are required
  * `key`
  * one of `value` or `fromAttribute`
  * `action`:`insert`

### `update`

Updates an attribute in spans where the key does exist

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
For the `update` action, following are required
  * `key`
  * one of `value` or `fromAttribute`
  * `action`:`update`


### `delete` 

Deletes an attribute from a span

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
For the `delete` action, following are required
  * `key`
  * `action`: `delete`

### `hash`

Hashes (SHA1) an existing attribute value

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
For the `hash` action, following are required
* `key`
* `action` : `hash`

### `extract`

> [!NOTE]
> This feature is only in 3.0.2 and later

Extracts values using a regular expression rule from the input key to target keys specified in the rule. If a target key already exists, it will be overridden. It behaves similar to the [Span Processor](#extract-attributes-from-span-name) `toAttributes` setting with the existing attribute as the source.

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
For the `extract` action, following are required
* `key`
* `pattern`
* `action` : `extract`

For more understanding, check out the [telemetry processor examples](./java-standalone-telemetry-processors-examples.md) documentation.

## Span processor

The span processor modifies either the span name or attributes of a span based on the span name. It optionally supports the ability to include/exclude spans.

### Name a span

The following setting is required as part of the name section:

* `fromAttributes`: The attribute value for the keys are used to create a new name in the order specified in the configuration. All attribute keys needs to be specified in the span for the processor to rename it.

The following setting can be optionally configured:

* `separator`: A string, which is specified will be used to split values
> [!NOTE]
> If renaming is dependent on attributes being modified by the attributes processor, ensure the span processor is specified after the attributes processor in the pipeline specification.

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

### Extract attributes from span name

Takes a list of regular expressions to match span name against and extract attributes from it based on subexpressions. Must be specified under the `toAttributes` section.

The following settings are required:

`rules` : A list of rules to extract attribute values from span name. The values in the span name are replaced by extracted attribute names. Each rule in the list is regex pattern string. Span name is checked against the regex. If the regex matches, all named subexpressions of the regex are extracted as attributes and are added to the span. Each subexpression name becomes an attribute name and subexpression matched portion becomes the attribute value. The matched portion in the span name is replaced by extracted attribute name. If the attributes already exist in the span, they will be overwritten. The process is repeated for all rules in the order they are specified. Each subsequent rule works on the span name that is the output after processing the previous rule.

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

## List of Attributes

Following are list of some common span attributes that can be used in the telemetry processors.

### HTTP Spans

| Attribute  | Type | Description | 
|---|---|---|
| `http.method` | string | HTTP request method.|
| `http.url` | string | Full HTTP request URL in the form `scheme://host[:port]/path?query[#fragment]`. Usually the fragment is not transmitted over HTTP, but if it is known, it should be included nevertheless.|
| `http.status_code` | number | [HTTP response status code](https://tools.ietf.org/html/rfc7231#section-6).|
| `http.flavor` | string | Kind of HTTP protocol used |
| `http.user_agent` | string | Value of the [HTTP User-Agent](https://tools.ietf.org/html/rfc7231#section-5.5.3) header sent by the client. |

### JDBC Spans

| Attribute  | Type | Description  |
|---|---|---|
| `db.system` | string | An identifier for the database management system (DBMS) product being used. |
| `db.connection_string` | string | The connection string used to connect to the database. It is recommended to remove embedded credentials.|
| `db.user` | string | Username for accessing the database. |
| `db.name` | string | This attribute is used to report the name of the database being accessed. For commands that switch the database, this should be set to the target database (even if the command fails).|
| `db.statement` | string | The database statement being executed.|
