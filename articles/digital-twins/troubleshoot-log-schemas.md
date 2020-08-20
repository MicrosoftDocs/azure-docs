---
# Mandatory fields.
title: Understand log schemas
titleSuffix: Azure Digital Twins
description: Understand the log schemas for Azure Digital Twins metrics.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 8/20/2020
ms.topic: troubleshooting
ms.service: digital-twins
---

# Troubleshooting Azure Digital Twins: Log schemas

This article describes the Azure Active Directory (Azure AD) log schemas in Azure Monitor for Azure Digital Twins. The schemas can be grouped into two greater categories:
* API log schemas
* Egress log schemas

Each individual log entry is stored as text and formatted as a JSON blob. Example JSON bodies will be provided along with each section below.

## API log schemas

This log schema is consistent for `ADTDigitalTwinsOperation`, `ADTModelsOperation`, and `ADTQueryOperation`. It contains information pertinent to API calls to an Azure Digital Twins instance.

Here are the field and property descriptions for API logs.

| Field name | Data type | Description |
|-----|------|-------------|
| TimeGenerated [UTC] | DateTime | The date and time that this event occurred |
| ResourceId | String | The Azure Resource Manager ResourceId where the event took place |
| OperationName | String  | The type of action being performed during the event |
| OperationVersion | String | The API Version utilized during the event |
| Category | String | The type of resource being emitted |
| ResultType | String | Outcome of the event |
| ResultSignature | String | Http status code for the event |
| ResultDescription | String | Additional details about the event |
| DurationMs | String | How long it took to perform the event in milliseconds |
| Caller IP Address | String | A masked source IP address for the event |
| Correlation ID | Guid | Customer provided unique identifier for the event |
| Level | String | The logging severity of the event |
| Location | String | The region where the event took place |
| RequestUri | Uri | The endpoint utilized during the event |

### Examples

#### ADTDigitalTwinsOperation

```json
{
  "time": "2020-03-14T21:11:14.9918922Z",
  "resourceId": "/SUBSCRIPTIONS/BBED119E-28B8-454D-B25E-C990C9430C8F/RESOURCEGROUPS/MYRESOURCEGROUP/PROVIDERS/MICROSOFT.DIGITALTWINS/DIGITALTWINSINSTANCES/MYINSTANCENAME",
  "operationName": "Microsoft.DigitalTwins/digitaltwins/write",
  "operationVersion": "2020-05-31-preview",
  "category": "DigitalTwinOperation",
  "resultType": "Success",
  "resultSignature": "200",
  "resultDescription": "",
  "durationMs": "314",
  "callerIpAddress": "13.68.244.*",
  "correlationId": "2f6a8e64-94aa-492a-bc31-16b9f0b16ab3",
  "level": "4",
  "location": "southcentralus",
  "uri": "https://myinstancename.api.scus.digitaltwins.azure.net/digitaltwins/factory-58d81613-2e54-4faa-a930-d980e6e2a884?api-version=2020-05-31-preview"
}
```

#### ADTModelsOperation

```json
{
  "time": "2020-10-29T21:12:24.2337302Z",
  "resourceId": "/SUBSCRIPTIONS/BBED119E-28B8-454D-B25E-C990C9430C8F/RESOURCEGROUPS/MYRESOURCEGROUP/PROVIDERS/MICROSOFT.DIGITALTWINS/DIGITALTWINSINSTANCES/MYINSTANCENAME",
  "operationName": "Microsoft.DigitalTwins/models/write",
  "operationVersion": "2020-05-31-preview",
  "category": "ModelsOperation",
  "resultType": "Success",
  "resultSignature": "201",
  "resultDescription": "",
  "durationMs": "935",
  "callerIpAddress": "13.68.244.*",
  "correlationId": "9dcb71ea-bb6f-46f2-ab70-78b80db76882",
  "level": "4",
  "location": "southcentralus",
  "uri": "https://myinstancename.api.scus.digitaltwins.azure.net/Models?api-version=2020-05-31-preview",
}
```

#### ADTQueryOperation

```json
{
  "time": "2020-12-04T21:11:44.1690031Z",
  "resourceId": "/SUBSCRIPTIONS/BBED119E-28B8-454D-B25E-C990C9430C8F/RESOURCEGROUPS/MYRESOURCEGROUP/PROVIDERS/MICROSOFT.DIGITALTWINS/DIGITALTWINSINSTANCES/MYINSTANCENAME",
  "operationName": "Microsoft.DigitalTwins/query/action",
  "operationVersion": "2020-05-31-preview",
  "category": "QueryOperation",
  "resultType": "Success",
  "resultSignature": "200",
  "resultDescription": "",
  "durationMs": "255",
  "callerIpAddress": "13.68.244.*",
  "correlationId": "1ee2b6e9-3af4-4873-8c7c-1a698b9ac334",
  "level": "4",
  "location": "southcentralus",
  "uri": "https://myinstancename.api.scus.digitaltwins.azure.net/query?api-version=2020-05-31-preview",
}
```

## Egress log schemas

These contain details pertaining to exceptions and the API operations around egress endpoints connected to an Azure Digital Twins instance.

|Field name | Data type | Description |
|-----|------|-------------|
| TimeGenerated [UTC] | DateTime | The date and time that this event occurred |
| ResourceId | String | The Azure Resource Manager ResourceId where the event took place |
| OperationName | String  | The type of action being performed during the event |
| Category | String | The type of resource being emitted |
| ResultDescription | String | Additional details about the event |
| Level | String | The logging severity of the event |
| Location | String | The region where the event took place |
| EndpointName | String | The name of egress endpoint created in Azure Digital Twins |

### Example

#### ADTEventRoutesOperation

```json
{
  "time": "2020-11-05T22:18:38.0708705Z",
  "resourceId": "/SUBSCRIPTIONS/BBED119E-28B8-454D-B25E-C990C9430C8F/RESOURCEGROUPS/MYRESOURCEGROUP/PROVIDERS/MICROSOFT.DIGITALTWINS/DIGITALTWINSINSTANCES/MYINSTANCENAME",
  "operationName": "Microsoft.DigitalTwins/eventroutes/action",
  "category": "EventRoutesOperation",
  "resultDescription": "Unable to send EventGrid message to [my-event-grid.westus-1.eventgrid.azure.net] for event Id [f6f45831-55d0-408b-8366-058e81ca6089].",
  "correlationId": "7f73ab45-14c0-491f-a834-0827dbbf7f8e",
  "level": "3",
  "location": "southcentralus",
  "properties": {
    "endpointName": "endpointEventGridInvalidKey"
  }
}
```

## Next steps

* For information about the Azure Digital Twins metrics, see [*Troubleshooting: View metrics with Azure Monitor*](troubleshoot-metrics.md).

* For more about the Azure Digital Twins APIs, see [*How-to: Use the Azure Digital Twins APIs and SDKs*](how-to-use-apis-sdks.md).
