---
title: Azure Healthcare APIs as Event Grid source
description: Describes the properties that are provided for Azure Healthcare APIs events with Azure Event Grid
ms.topic: conceptual
ms.date: 02/02/2022
---

# Azure Healthcare APIs as an Event Grid source

This article provides the properties and schema for Azure Healthcare APIs events. For an introduction to event schemas, see [Azure Event Grid event schema](event-schema.md).

## Available event types

### List of events for Azure Healthcare APIs REST APIs

These events are triggered when a client creates, updates, or deletes a resource by calling the REST APIs.

 |Event name|Description|
 |----------|-----------|
 |**FhirResourceCreated** |Triggered when a FHIR resource is created on the FHIR service.|
 |**FhirResourceUpdated** |Triggered when a FHIR resource is updated on the FHIR service.|
 |**FhirResourceDeleted** |Triggered when a FHIR resource is deleted on the FHIR service. Note: Soft delete is the default.|

## Example event
When an event is triggered, the Event Grid service sends data about that event to a subscribing endpoint. This section contains an example of what that data would look like for each FHIR resource event.

### FhirResourceCreated event

> [!Note]
> Events data looks similar to this example except for this change:
>
>* The `metadataVersion` key is set to a value of `1`.
>
>For more information, see [Azure Event Grid event schema](/azure/event-grid/event-schema#event-properties)

```json
{
  "id": "e4c7f556-d72c-e7f7-1069-1e82ac76ab41",
  "topic": "/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.HealthcareApis/workspaces/{workspace-name}",
  "subject": "{fhir-account}.fhir.azurehealthcareapis.com/Patient/e0a1f743-1a70-451f-830e-e96477163902",
  "data": {
    "resourceType": "Patient",
    "resourceFhirAccount": "{fhir-account}.fhir.azurehealthcareapis.com",
    "resourceFhirId": "e0a1f743-1a70-451f-830e-e96477163902",
    "resourceVersionId": 1
  },
  "eventType": "Microsoft.HealthcareApis.FhirResourceCreated",
  "dataVersion": "1",
  "metadataVersion": "1",
  "eventTime": "2021-09-08T01:14:04.5613214Z"
}
```

### FhirResourceUpdated event

> [!Note]
> Events data looks similar to this example except for this change:
>
>* The `metadataVersion` key is set to a value of `1`.
>
>For more information, see [Azure Event Grid event schema](/azure/event-grid/event-schema#event-properties)

```json
{
  "id": "634bd421-8467-f23c-b8cb-f6a31e41c32a",
  "topic": "/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.HealthcareApis/workspaces/{workspace-name}",
  "subject": "{fhir-account}.fhir.azurehealthcareapis.com/Patient/e0a1f743-1a70-451f-830e-e96477163902",
  "data": {
    "resourceType": "Patient",
    "resourceFhirAccount": "{fhir-account}.fhir.azurehealthcareapis.com",
    "resourceFhirId": "e0a1f743-1a70-451f-830e-e96477163902",
    "resourceVersionId": 2
  },
  "eventType": "Microsoft.HealthcareApis.FhirResourceUpdated",
  "dataVersion": "2",
  "metadataVersion": "1",
  "eventTime": "2021-09-08T01:29:12.0618739Z"
}
```

### FhirResourceDelete event

> [!Note]
> Events data looks similar to this example except for this change:
>
>* The `metadataVersion` key is set to a value of `1`.
>
>For more information, see [Azure Event Grid event schema](/azure/event-grid/event-schema#event-properties)

```json
{
  "id": "ef289b93-3159-b833-3a44-dc6b86ed1a8a",
  "topic": "/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.HealthcareApis/workspaces/{workspace-name}",
  "subject": "{fhir-account}.fhir.azurehealthcareapis.com/Patient/e0a1f743-1a70-451f-830e-e96477163902",
  "data": {
    "resourceType": "Patient",
    "resourceFhirAccount": "{fhir-account}.fhir.azurehealthcareapis.com",
    "resourceFhirId": "e0a1f743-1a70-451f-830e-e96477163902",
    "resourceVersionId": 3
  },
  "eventType": "Microsoft.HealthcareApis.FhirResourceDeleted",
  "dataVersion": "3",
  "metadataVersion": "1",
  "eventTime": "2021-09-08T01:31:58.5175837Z"
}
```

## Next steps

* For an introduction to Azure Event Grid, see [What is Event Grid?](overview.md)
* For more information about creating an Azure Event Grid subscription, see [Event Grid subscription schema](subscription-creation-schema.md). 

(FHIR&#174;) is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.
