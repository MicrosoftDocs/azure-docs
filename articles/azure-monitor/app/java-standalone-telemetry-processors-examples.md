---
title: Telemetry processor examples - Azure Monitor Application Insights for Java
description: Explore examples that show telemetry processors in Azure Monitor Application Insights for Java.
ms.topic: conceptual
ms.date: 09/12/2023
ms.devlang: java
ms.custom: devx-track-java, devx-track-extended-java
ms.reviewer: mmcc
---

# Telemetry processor examples - Azure Monitor Application Insights for Java

This article provides examples of telemetry processors in Application Insights for Java, including samples for include and exclude configurations. It also includes samples for attribute processors and span processors.
## Include and exclude Span samples

In this section, you'll see how to include and exclude spans. You'll also see how to exclude multiple spans and apply selective processing.
### Include spans

This section shows how to include spans for an attribute processor. The processor doesn't process spans that don't match the properties.

A match requires the span name to be equal to `spanA` or `spanB`. 

These spans match the include properties, and the processor actions are applied:
* Span1 Name: 'spanA' Attributes: {env: dev, test_request: 123, credit_card: 1234}
* Span2 Name: 'spanB' Attributes: {env: dev, test_request: false}
* Span3 Name: 'spanA' Attributes: {env: 1, test_request: dev, credit_card: 1234}

This span doesn't match the include properties, and the processor actions aren't applied:
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

### Exclude spans

This section demonstrates how to exclude spans for an attribute processor. This processor doesn't process spans that match the properties.

A match requires the span name to be equal to `spanA` or `spanB`.

The following spans match the exclude properties, and the processor actions aren't applied:
* Span1 Name: 'spanA' Attributes: {env: dev, test_request: 123, credit_card: 1234}
* Span2 Name: 'spanB' Attributes: {env: dev, test_request: false}
* Span3 Name: 'spanA' Attributes: {env: 1, test_request: dev, credit_card: 1234}

This span doesn't match the exclude properties, and the processor actions are applied:
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

### Exclude spans by using multiple criteria

This section demonstrates how to exclude spans for an attribute processor. This processor doesn't process spans that match the properties.

A match requires the following conditions to be met:
* An attribute (for example, `env` with value `dev`) must exist in the span.
* The span must have an attribute that has key `test_request`.

The following spans match the exclude properties, and the processor actions aren't applied.
* Span1 Name: 'spanB' Attributes: {env: dev, test_request: 123, credit_card: 1234}
* Span2 Name: 'spanA' Attributes: {env: dev, test_request: false}

The following span doesn't match the exclude properties, and the processor actions are applied:
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

### Selective processing

This section shows how to specify the set of span properties that
indicate which spans this processor should be applied to. The include 
properties indicate which spans should be processed. The exclude properties filter out spans that shouldn't be processed.

In the following configuration, these spans match the properties, and processor actions are applied:

* Span1 Name: 'spanB' Attributes: {env: production, test_request: 123, credit_card: 1234, redact_trace: "false"}
* Span2 Name: 'spanA' Attributes: {env: staging, test_request: false, redact_trace: true}

These spans don't match the include properties, and processor actions aren't applied:
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

## Attribute processor samples

### Insert

The following sample inserts the new attribute `{"attribute1": "attributeValue1"}` into spans and logs where the key `attribute1` doesn't exist.

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

The following sample uses the value from attribute `anotherkey` to insert the new attribute `{"newKey": "<value from attribute anotherkey>"}` into spans and logs where the key `newKey` doesn't exist. If the attribute `anotherkey` doesn't exist, no new attribute is inserted into spans and logs.

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

The following sample updates the attribute to `{"db.secret": "redacted"}`. It updates the attribute `boo` by using the value from attribute `foo`. Spans and logs that don't have the attribute `boo` don't change.

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

The following sample shows how to delete an attribute that has the key `credit_card`.

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

The following sample shows how to hash existing attribute values.

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

The following sample shows how to use a regular expression (regex) to create new attributes based on the value of another attribute.
For example, given `http.url = http://example.com/path?queryParam1=value1,queryParam2=value2`, the following attributes are inserted:
* httpProtocol: `http`
* httpDomain: `example.com`
* httpPath: `path`
* httpQueryParams: `queryParam1=value1,queryParam2=value2`
* http.url: *no* change

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

### Mask

For example, given `http.url = https://example.com/user/12345622` is updated to `http.url = https://example.com/user/****` using either of the below configurations.


First configuration example:

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
            "pattern": "user\\/\\d+",
            "replace": "user\\/****",
            "action": "mask"
          }
        ]
      }
    ]
  }
}
```


Second configuration example with regular expression group name:

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
            "pattern": "^(?<userGroupName>[a-zA-Z.:\/]+)\d+",
            "replace": "${userGroupName}**",
            "action": "mask"
          }
        ]
      }
    ]
  }
}
```

## Span processor samples

### Name a span

The following sample specifies the values of attributes `db.svc`, `operation`, and `id`. It forms the new name of the span by using those attributes, in that order, separated by the value `::`.
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

### Extract attributes from a span name

Let's assume the input span name is `/api/v1/document/12345678/update`. The following sample results in the output span name `/api/v1/document/{documentId}/update`. It adds the new attribute `documentId=12345678` to the span.
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

### Extract attributes from a span name by using include and exclude

The following sample shows how to change the span name to `{operation_website}`. It adds an attribute with key `operation_website` and value `{oldSpanName}` when the span has the following properties:
- The span name contains `/` anywhere in the string.
- The span name isn't `donot/change`.
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


## Log processor samples

### Extract attributes from a log message body

Let's assume the input log message body is `Starting PetClinicApplication on WorkLaptop with PID 27984 (C:\randompath\target\classes started by userx in C:\randompath)`. The following sample results in the output message body `Starting PetClinicApplication on WorkLaptop with PID {PIDVALUE} (C:\randompath\target\classes started by userx in C:\randompath)`. It adds the new attribute `PIDVALUE=27984` to the log.

```json
{
  "connectionString": "InstrumentationKey=00000000-0000-0000-0000-000000000000",
  "preview": {
    "processors": [
      {
        "type": "log",
        "body": {
          "toAttributes": {
            "rules": [
              "^Starting PetClinicApplication on WorkLaptop with PID (?<PIDVALUE>\\d+) .*"
            ]
          }
        }
      }
    ]
  }
}
```

### Masking sensitive data in log message

The following sample shows how to mask sensitive data in a log message body using both log processor and attribute processor.
Let's assume the input log message body is `User account with userId 123456xx failed to login`. The log processor updates output message body to `User account with userId {redactedUserId} failed to login` and the attribute processor deletes the new attribute `redactedUserId`, which was adding in the previous step.
```json
{
  "connectionString": "InstrumentationKey=00000000-0000-0000-0000-000000000000",
  "preview": {
    "processors": [
      {
        "type": "log",
        "body": {
          "toAttributes": {
            "rules": [
              "^User account with userId (?<redactedUserId>\\d+) .*"
            ]
          }
        }
      },
      {
        "type": "attribute",
        "actions": [
          {
            "key": "redactedUserId",
            "action": "delete"
          }
        ]
      }
    ]
  }
}
```

## Frequently asked questions

### Why doesn't the log processor process logs using TelemetryClient.trackTrace()?

TelemetryClient.trackTrace() is part of the Application Insights Classic SDK bridge, and the log processors only work with the new [OpenTelemetry-based instrumentation](opentelemetry-enable.md).