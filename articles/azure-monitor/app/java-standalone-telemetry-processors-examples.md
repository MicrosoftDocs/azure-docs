---
title: Telemetry processors examples - Azure Monitor Application Insights for Java
description: Examples illustrating telemetry processors in Azure Monitor Application Insights for Java
ms.topic: conceptual
ms.date: 12/29/2020
author: kryalama
ms.custom: devx-track-java
ms.author: kryalama
---

# Telemetry processors examples - Azure Monitor Application Insights for Java

## Include/Exclude Samples

### 1. Include Spans

The following demonstrates including spans for this attributes processor. All other spans that do no match the properties are not processed by this processor.

The following are conditions to be met for a match:
* The span name must be equal to "spanA" or "spanB" 

The following are spans that match the include properties and the processor actions are applied.
* Span1 Name: 'spanA' Attributes: {env: dev, test_request: 123, credit_card: 1234}
* Span2 Name: 'spanB' Attributes: {env: dev, test_request: false}
* Span3 Name: 'spanA' Attributes: {env: 1, test_request: dev, credit_card: 1234}

The following span does not match the include properties and the processor actions are not applied.
* Span4 Name: 'spanC' Attributes: {env: dev, test_request: false}

```json
{
  "connectionString": "InstrumentationKey=00000000-0000-0000-0000-000000000000",
  "preview": {
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
        "actions": [
          {
            "key": "credit_card",
            "action": "delete"
          }
        ]
      }
    ]
  }
}
```

### 2. Exclude Spans

The following demonstrates excluding spans for this attributes processor. All spans that match the properties are not processed by this processor.

The following are conditions to be met for a match:
* The span name must be equal to "spanA" or "spanB" 

The following are spans that match the exclude properties and the processor actions are not applied.
* Span1 Name: 'spanA' Attributes: {env: dev, test_request: 123, credit_card: 1234}
* Span2 Name: 'spanB' Attributes: {env: dev, test_request: false}
* Span3 Name: 'spanA' Attributes: {env: 1, test_request: dev, credit_card: 1234}

The following span do not match the exclude properties and the processor actions are applied.
* Span4 Name: 'spanC' Attributes: {env: dev, test_request: false}

```json
{
  "connectionString": "InstrumentationKey=00000000-0000-0000-0000-000000000000",
  "preview": {
    "processors": [
      {
        "type": "attribute",
        "exclude": {
          "matchType": "strict",
          "spanNames": [
            "spanA",
            "spanB"
          ]
        },
        "actions": [
          {
            "key": "credit_card",
            "action": "delete"
          }
        ]
      }
    ]
  }
}
```

### 3. ExcludeMulti Spans

The following demonstrates excluding spans for this attributes processor. All spans that match the properties are not processed by this processor.

The following are conditions to be met for a match:
* An attribute ('env', 'dev') must exist in the span for a match.
* As long as there is an attribute with key 'test_request' in the span there is a match.

The following are spans that match the exclude properties and the processor actions are not applied.
* Span1 Name: 'spanB' Attributes: {env: dev, test_request: 123, credit_card: 1234}
* Span2 Name: 'spanA' Attributes: {env: dev, test_request: false}

The following span do not match the exclude properties and the processor actions are applied.
* Span3 Name: 'spanB' Attributes: {env: 1, test_request: dev, credit_card: 1234}
* Span4 Name: 'spanC' Attributes: {env: dev, dev_request: false}


```json
{
  "connectionString": "InstrumentationKey=00000000-0000-0000-0000-000000000000",
  "preview": {
    "processors": [
      {
        "type": "attribute",
        "exclude": {
          "matchType": "strict",
          "spanNames": [
            "spanA",
            "spanB"
          ],
          "attributes": [
            {
              "key": "env",
              "value": "dev"
            },
            {
              "key": "test_request"
            }
          ]
        },
        "actions": [
          {
            "key": "credit_card",
            "action": "delete"
          }
        ]
      }
    ]
  }
}
```

### 4. Selective processing

The following demonstrates specifying the set of span properties to
indicate which spans this processor should be applied to. The `include` of
properties say which ones should be included and the `exclude` properties
further filter out spans that shouldn't be processed.

With the below configuration, the following spans match the properties and processor actions are applied:

* Span1 Name: 'spanB' Attributes: {env: production, test_request: 123, credit_card: 1234, redact_trace: "false"}
* Span2 Name: 'spanA' Attributes: {env: staging, test_request: false, redact_trace: true}

The following spans do not match the include properties and processor actions are not applied:
* Span3 Name: 'spanB' Attributes: {env: production, test_request: true, credit_card: 1234, redact_trace: false}
* Span4 Name: 'spanC' Attributes: {env: dev, test_request: false}

```json
{
  "connectionString": "InstrumentationKey=00000000-0000-0000-0000-000000000000",
  "preview": {
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
  }
}
```
## Attribute Processor Samples

### Insert

The following inserts a new attribute {"attribute1": "attributeValue1"} to spans where the key "attribute1" does not exist.

```json
{
  "connectionString": "InstrumentationKey=00000000-0000-0000-0000-000000000000",
  "preview": {
    "processors": [
      {
        "type": "attribute",
        "actions": [
          {
            "key": "attribute1",
            "value": "attributeValue1",
            "action": "insert"
          }
        ]
      }
    ]
  }
}
```

### Insert from another key

The following uses the value from attribute "anotherkey" to insert a new attribute {"newKey": "value from attribute 'anotherkey'} to spans where the key "newKey" does not exist. If the attribute 'anotherkey' doesn't exist, no new attribute is inserted to spans.

```json
{
  "connectionString": "InstrumentationKey=00000000-0000-0000-0000-000000000000",
  "preview": {
    "processors": [
      {
        "type": "attribute",
        "actions": [
          {
            "key": "newKey",
            "fromAttribute": "anotherKey",
            "action": "insert"
          }
        ]
      }
    ]
  }
}
```

### Update

The following updates the attribute to { "db.secret": "redacted"} and updates the attribute 'boo' using the value from attribute 'foo'. Spans without the attribute 'boo' will not change.

```json
{
  "connectionString": "InstrumentationKey=00000000-0000-0000-0000-000000000000",
  "preview": {
    "processors": [
      {
        "type": "attribute",
        "actions": [
          {
            "key": "db.secret",
            "value": "redacted",
            "action": "update"
          },
          {
            "key": "boo",
            "fromAttribute": "foo",
            "action": "update" 
          }
        ]
      }
    ]
  }
}
```

### Delete

The following demonstrates deleting attribute with key 'credit_card'.

```json
{
  "connectionString": "InstrumentationKey=00000000-0000-0000-0000-000000000000",
  "preview": {
    "processors": [
      {
        "type": "attribute",
        "actions": [
          {
            "key": "credit_card",
            "action": "delete"
          }
        ]
      }
    ]
  }
}
```

### Hash

The following demonstrates hash existing attribute values.

```json
{
  "connectionString": "InstrumentationKey=00000000-0000-0000-0000-000000000000",
  "preview": {
    "processors": [
      {
        "type": "attribute",
        "actions": [
          {
            "key": "user.email",
            "action": "hash"
          }
        ]
      }
    ]
  }
}
```

### Extract

The following example demonstrates using regex to create new attributes based on the value of another attribute.
For example given http.url = 'http://example.com/path?queryParam1=value1,queryParam2=value2' the following attributes will be inserted:
* httpProtocol: http
* httpDomain: example.com
* httpPath: path
* httpQueryParams: queryParam1=value1,queryParam2=value2
* http.url value does NOT change.

```json
{
  "connectionString": "InstrumentationKey=00000000-0000-0000-0000-000000000000",
  "preview": {
    "processors": [
      {
        "type": "attribute",
        "actions": [
          {
            "key": "http.url",
            "pattern": "^(?<httpProtocol>.*):\\/\\/(?<httpDomain>.*)\\/(?<httpPath>.*)(\\?|\\&)(?<httpQueryParams>.*)",
            "action": "extract"
          }
        ]
      }
    ]
  }
}
```

The following example demonstrates how to process spans that have a span name that match regexp patterns.
This processor will remove "token" attribute and will obfuscate "password" attribute in spans where span name matches "auth.\*" 
and where span name does not match "login.\*".

```json
{
  "connectionString": "InstrumentationKey=00000000-0000-0000-0000-000000000000",
  "preview": {
    "processors": [
      {
        "type": "attribute",
        "include": {
          "matchType": "regexp",
          "spanNames": [
            "auth.*"
          ]
        },
        "exclude": {
          "matchType": "regexp",
          "spanNames": [
            "login.*"
          ]
        },
        "actions": [
          {
            "key": "password",
            "value": "obfuscated",
            "action": "update"
          },
          {
            "key": "token",
            "action": "delete"
          }
        ]
      }
    ]
  }
}
```


## Span Processor Samples

### Name a span

The following example specifies the values of attribute "db.svc", "operation", and "id" will form the new name of the span, in that order, separated by the value "::".
```json
{
  "connectionString": "InstrumentationKey=00000000-0000-0000-0000-000000000000",
  "preview": {
    "processors": [
      {
        "type": "span",
        "name": {
          "fromAttributes": [
            "db.svc",
            "operation",
            "id"
          ],
          "separator": "::"
        }
      }
    ]
  }
}
```

### Extract attributes from span name

Let's assume the input span name is /api/v1/document/12345678/update. Applying the following results in the output span name /api/v1/document/{documentId}/update will add a new attribute "documentId"="12345678" to the span.
```json
{
  "connectionString": "InstrumentationKey=00000000-0000-0000-0000-000000000000",
  "preview": {
    "processors": [
      {
        "type": "span",
        "name": {
          "toAttributes": {
            "rules": [
              "^/api/v1/document/(?<documentId>.*)/update$"
            ]
          }
        }
      }
    ]
  }
}
```

### Extract attributes from span name with include and exclude

The following demonstrates renaming the span name to "{operation_website}" and adding the attribute {Key: operation_website, Value: oldSpanName } when the span has the following properties:
- The span name contains '/' anywhere in the string.
- The span name is not 'donot/change'.
```json
{
  "connectionString": "InstrumentationKey=00000000-0000-0000-0000-000000000000",
  "preview": {
    "processors": [
      {
        "type": "span",
        "include": {
          "matchType": "regexp",
          "spanNames": [
            "^(.*?)/(.*?)$"
          ]
        },
        "exclude": {
          "matchType": "strict",
          "spanNames": [
            "donot/change"
          ]
        },
        "name": {
          "toAttributes": {
            "rules": [
              "(?<operation_website>.*?)$"
            ]
          }
        }
      }
    ]
  }
}
```