---
title: Azure Health Data Services as Event Grid source
description: Describes the properties that are provided for Azure Health Data Services events with Azure Event Grid
ms.topic: conceptual
ms.date: 02/03/2022
---

# Azure Health Data Services as an Event Grid source

This article provides the properties and schema for Azure Health Data Services events. For an introduction to event schemas, see [Azure Event Grid event schema](event-schema.md).

## Available event types

### List of events for Azure Health Data Services REST APIs

The following Fast Healthcare Interoperability Resources (FHIR&#174;) resource events are triggered when calling the REST APIs.

 |Event name|Description|
 |----------|-----------|
 |**FhirResourceCreated** |The event emitted after a FHIR resource gets created successfully.|
 |**FhirResourceUpdated** |The event emitted after a FHIR resource gets updated successfully.|
 |**FhirResourceDeleted** |The event emitted after a FHIR resource gets soft deleted successfully.|

## Example event
This section contains examples of what events message data would look like for each FHIR resource event.

> [!Note]
> Events data looks similar to these examples with the `metadataVersion` property set to a value of `1`.
>
> For more information, see [Azure Event Grid event schema properties](./event-schema.md#event-properties).

### FhirResourceCreated event

# [Event Grid event schema](#tab/event-grid-event-schema)

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
# [CloudEvent schema](#tab/cloud-event-schema)

```json
{
  "id": "d674b9b7-7d1c-9b0a-8c48-139f3eb86c48",
  "source": "/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.HealthcareApis/workspaces/{workspace-name}",
  "specversion": "1.0",
  "type": "Microsoft.HealthcareApis.FhirResourceCreated",
  "dataschema": "#1",
  "subject": "{fhir-account}.fhir.azurehealthcareapis.com/Patient/e87ef649-abe1-485c-8c09-549d85dfe30b",
  "time": "2022-02-03T16:48:09.6223354Z",
  "data": {
    "resourceType": "Patient",
    "resourceFhirAccount": "{fhir-account}.fhir.azurehealthcareapis.com",
    "resourceFhirId": "e87ef649-abe1-485c-8c09-549d85dfe30b",
    "resourceVersionId": 1
  }
}
```
---

### FhirResourceUpdated event

# [Event Grid event schema](#tab/event-grid-event-schema)

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
# [CloudEvent schema](#tab/cloud-event-schema)

```json
{
  "id": "5e45229e-c663-ea98-72d2-833428f48ad0",
  "source": "/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.HealthcareApis/workspaces/{workspace-name}",
  "specversion": "1.0",
  "type": "Microsoft.HealthcareApis.FhirResourceUpdated",
  "dataschema": "#2",
  "subject": "{fhir-account}.fhir.azurehealthcareapis.com/Patient/e87ef649-abe1-485c-8c09-549d85dfe30b",
  "time": "2022-02-03T16:48:33.5147352Z",
  "data": {
    "resourceType": "Patient",
    "resourceFhirAccount": "{fhir-account}.fhir.azurehealthcareapis.com",
    "resourceFhirId": "e87ef649-abe1-485c-8c09-549d85dfe30b",
    "resourceVersionId": 2
  }
}
```
---

### FhirResourceDeleted event

# [Event Grid event schema](#tab/event-grid-event-schema)

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
# [CloudEvent schema](#tab/cloud-event-schema)

```json
{
  "id": "14648a6e-d978-950e-ee9c-f84c70dba8d3",
  "source": "/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.HealthcareApis/workspaces/{workspace-name}",
  "specversion": "1.0",
  "type": "Microsoft.HealthcareApis.FhirResourceDeleted",
  "dataschema": "#3",
  "subject": "{fhir-account}.fhir.azurehealthcareapis.com/Patient/e87ef649-abe1-485c-8c09-549d85dfe30b",
  "time": "2022-02-03T16:48:38.7338799Z",
  "data": {
    "resourceType": "Patient",
    "resourceFhirAccount": "{fhir-account}.fhir.azurehealthcareapis.com",
    "resourceFhirId": "e87ef649-abe1-485c-8c09-549d85dfe30b",
    "resourceVersionId": 3
  }
}
```
---

## Next steps

* For an introduction to Azure Event Grid, see [What is Event Grid?](overview.md)
* For more information about creating an Azure Event Grid subscription, see [Event Grid subscription schema](subscription-creation-schema.md). 

(FHIR&#174;) is a registered trademark of [HL7](https://hl7.org/fhir/) and is used with the permission of HL7.