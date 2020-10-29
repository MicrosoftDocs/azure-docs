---
title: Data Scrubbing with Java In Process Agent - Azure Monitor Application Insights
description: Data Scrubbing with Java In Process Agent
ms.topic: conceptual
ms.date: 10/29/2020

---

# Data Scrubbing with Java In Process Agent - private preview

Java In Process Agent has now the capabilities to pre-process telemetry data before it is exported.

### Some Use Cases:
 * Mask sensitive data.
 * Filter data to control cost.
 * Static attributes for all telemetry, e.g. applying "k8spod=abc" to all telemetry.

### Supported Processors:
 * Attribute Processor
 * Span Processor

## Quick Start

Create a configuration file named ApplicationInsights.json, and place it in the same directory as `applicationinsights-agent-***.jar`, with the following content:

```json
{
    "connectionString": "InstrumentationKey=00000000-0000-0000-0000-000000000000",
    "preview": {
        "processors": [
            // your processor configuration
        ]
    }
}
```

## Processor Configuration Options:

### Include/Exclude Spans

The attribute processor and the span processor expose the option to provide a set of properties of a span to match against to determine if the span should be included or excluded from the processor. To configure this option, under `include` and/or `exclude` at least `matchType` and one of `spanNames` or `attributes` is required. It is supported to have more than one specified, but all of the specified conditions must evaluate to true for a match to occur. 

`matchType` controls how items in `spanNames` and `attributes` arrays are interpreted. Possible values are `regexp` or `strict`. This is a required field.
`spanNames` must match at least one of the items. This is an optional field.
`attributes` specifies the list of attributes to match against. All of these attributes must match exactly for a match to occur. This is an optional field.

Note: If both `include` and `exclude` are specified, the `include` properties are checked before the `exclude` properties.

#### Sample Usage

```json
/* The following demonstrates specifying the set of span properties to
   indicate which spans this processor should be applied to. The `include` of
   properties say which ones should be included and the `exclude` properties
   further filter out spans that shouldn't be processed.
   Ex. The following are spans match the properties and the actions are applied.
   Note this span is processed because the value type of redact_trace is a string instead of a boolean.
   Span1 Name: 'svcB' Attributes: {env: production, test_request: 123, credit_card: 1234, redact_trace: "false"}
   Span2 Name: 'svcA' Attributes: {env: staging, test_request: false, redact_trace: true}
   The following span does not match the include properties and the
   processor actions are not applied.
   Span3 Name: 'svcB' Attributes: {env: production, test_request: true, credit_card: 1234, redact_trace: false}
   Span4 Name: 'svcC' Attributes: {env: dev, test_request: false} */

{
    "connectionString": "InstrumentationKey=00000000-0000-0000-0000-000000000000",
    "preview": {
        "processors": [
            {
                "type": "attribute",
                "processorName": "attributes/selectiveProcessing",
                "include": {
                    /* match_type defines that spanNames is an array of strings that must match service name strictly. */
                    "matchType": "strict",
                    /* The Span service name must be equal to svcA or svcB. */
                    "spanNames": [
                        "svcA",
                        "svcB"
                    ]
                },
                "exclude": {
                    /* match_type defines that attributes values must match strictly. */
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
            },
        ]
    }
}
```

### Attribute Processor 

The attributes processor modifies attributes of a span. It optionally supports the ability to include/exclude spans.
It takes a list of actions which are performed in order specified in the config. The supported actions are:

* `insert` : Inserts a new attribute in spans where the key does not already exist.
* `update` : Updates an attribute in spans where the key does exist.
* `delete` : Deletes an attribute from a span.
* `hash`   : Hashes (SHA1) an existing attribute value.

For the actions `insert` and `update`
* `key` is required
* one of `value` or `fromAttribute` is required
* `action` is required.

For the `delete` action,
* `key` is required
* `action`: `delete` is required.

For the `hash` action,
* `key` is required
* `action` : `hash` is required.

The list of actions can be composed to create rich scenarios, such as back filling attribute, copying values to a new key, redacting sensitive information.

#### Sample Usage

```json
{
    "connectionString": "InstrumentationKey=00000000-0000-0000-0000-000000000000",
    "preview": {
        "processors": [
            // The following example demonstrates inserting keys/values into spans.
            {
                "type": "attribute",
                "processorName": "attributes/insert",
                "actions": [
                    /* The following inserts a new attribute {attribute1: value1} to spans where the key attribute1 doesn't exist.
                   This demonstrates how to backfill spans with an attribute that may not have been sent by all clients. */
                    {
                        "key" : "attribute1",
                        "value" : "value1",
                        "action" : "insert"
                    },
                    /* The following uses the value from attribute 'anotherkey' to insert a new attribute {'key1': <value from attribute 'anotherkey'>} to spans where the key 'key1' does not exist. If the attribute 'anotherkey' doesn't exist, no new attribute is inserted to spans.*/
                    {
                        "key" : "key1",
                        "fromAttribute" : "anotherkey",
                        "action" : "insert"
                    }
                ]
            },
            // The following demonstrates configuring the processor to only update existing keys in an attribute.
            {
                "type": "attribute",
                "processorName": "attributes/update",
                "actions": [
                    /* The following updates the attribute to { 'piiattribute': 'redacted'}. This demonstrates sanitizing spans of sensitive data.*/
                    {
                        "key" : "piiattribute",
                        "value" : "redacted",
                        "action" : "update"
                    }, 
                    /* The following demonstrates deleting keys from an attribute. */
                    {
                        "key" : "credit_card",
                        "action" : "delete"
                    }, 
                    /*  The following demonstrates hash existing attribute values. */
                    {
                        "key" : "user.email",
                        "action" : "hash"
                    }
                ]
            },
        ]
    }
}
```