---
title: Azure Health Data Services as Event Grid source
description: Describes the properties that are provided for Azure Health Data Services events with Azure Event Grid
ms.topic: conceptual
ms.date: 01/31/2023
---

# Azure Health Data Services as an Event Grid source

This article provides the properties and schema for Azure Health Data Services Events. For an introduction to event schemas, see [Azure Event Grid event schema](event-schema.md).

## Available Event types

### List of Events for Azure Health Data Services REST APIs

These events are triggered when a Fast Healthcare Interoperability Resources (FHIR&#174;) Observation is created, updated, or deleted by calling the FHIR service REST APIs.

 |Event name|Description|
 |----------|-----------|
 |**FhirResourceCreated** |The event emitted after a FHIR Observation resource is created successfully.|
 |**FhirResourceUpdated** |The event emitted after a FHIR Observation resource is updated successfully.|
 |**FhirResourceDeleted** |The event emitted after a FHIR Observation resource is soft deleted successfully.|

These Events are triggered when a DICOM image is created or deleted by calling the DICOM service REST APIs.

 |Event name|Description|
 |----------|-----------|
 |**DicomImageCreated** |The event emitted after a DICOM image is created successfully.|
 |**DicomImageDeleted** |The event emitted after a DICOM image is deleted successfully.|
 |**DicomImageUpdated** |The event emitted after a DICOM image is updated successfully.|

## Example events
This section contains examples of what Azure Health Data Services Events message data would look like for each FHIR Observation and DICOM image event.

> [!NOTE]
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

### DicomImageCreated

# [Event Grid event schema](#tab/event-grid-event-schema)

```json
{
  "id": "d621839d-958b-4142-a638-bb966b4f7dfd",
  "topic": "/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.HealthcareApis/workspaces/{workspace-name}",
  "subject": "{dicom-account}.dicom.azurehealthcareapis.com/v1/studies/1.2.3.4.3/series/1.2.3.4.3.9423673/instances/1.3.6.1.4.1.45096.2.296485376.2210.1633373143.864442",
  "data": {
    "imageStudyInstanceUid": "1.2.3.4.3",
    "imageSeriesInstanceUid": "1.2.3.4.3.9423673",
    "imageSopInstanceUid": "1.3.6.1.4.1.45096.2.296485376.2210.1633373143.864442",
    "serviceHostName": "{dicom-account}.dicom.azurehealthcareapis.com",
    "sequenceNumber": 1
  },
  "eventType": "Microsoft.HealthcareApis.DicomImageCreated",
  "dataVersion": "1",
  "metadataVersion": "1",
  "eventTime": "2022-09-15T01:14:04.5613214Z"
}
```
# [CloudEvent schema](#tab/cloud-event-schema)

```json
{
  "source": "/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.HealthcareApis/workspaces/{workspace-name}",
  "subject": "{dicom-account}.dicom.azurehealthcareapis.com/v1/studies/1.2.3.4.3/series/1.2.3.4.3.9423673/instances/1.3.6.1.4.1.45096.2.296485376.2210.1633373143.864442",
  "type": "Microsoft.HealthcareApis.DicomImageCreated",
  "time": "2022-09-15T01:14:04.5613214Z",
  "id": "d621839d-958b-4142-a638-bb966b4f7dfd",
  "data": {
    "imageStudyInstanceUid": "1.2.3.4.3",
    "imageSeriesInstanceUid": "1.2.3.4.3.9423673",
    "imageSopInstanceUid": "1.3.6.1.4.1.45096.2.296485376.2210.1633373143.864442",
    "serviceHostName": "{dicom-account}.dicom.azurehealthcareapis.com",
    "sequenceNumber": 1
  },
  "specVersion": "1.0"
}
```
---

### DicomImageDeleted

# [Event Grid event schema](#tab/event-grid-event-schema)

```json
{
  "id": "eac1c1a0-ffa8-4b28-97cc-1d8b9a0a6021",
  "topic": "/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.HealthcareApis/workspaces/{workspace-name}",
  "subject": "{dicom-account}.dicom.azurehealthcareapis.com/v1/studies/1.2.3.4.3/series/1.2.3.4.3.9423673/instances/1.3.6.1.4.1.45096.2.296485376.2210.1633373143.864442",
  "data": {
    "imageStudyInstanceUid": "1.2.3.4.3",
    "imageSeriesInstanceUid": "1.2.3.4.3.9423673",
    "imageSopInstanceUid": "1.3.6.1.4.1.45096.2.296485376.2210.1633373143.864442",
    "serviceHostName": "{dicom-account}.dicom.azurehealthcareapis.com",
    "sequenceNumber": 2
  },
  "eventType": "Microsoft.HealthcareApis.DicomImageDeleted",
  "dataVersion": "1",
  "metadataVersion": "1",
  "eventTime": "2022-09-15T01:16:07.5692209Z"
}
```
# [CloudEvent schema](#tab/cloud-event-schema)

```json
{
  "source": "/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.HealthcareApis/workspaces/{workspace-name}",
  "subject": "{dicom-account}.dicom.azurehealthcareapis.com/v1/studies/1.2.3.4.3/series/1.2.3.4.3.9423673/instances/1.3.6.1.4.1.45096.2.296485376.2210.1633373143.864442",
  "type": "Microsoft.HealthcareApis.DicomImageDeleted",
  "time": "2022-09-15T01:14:04.5613214Z",
  "id": "eac1c1a0-ffa8-4b28-97cc-1d8b9a0a6021",
  "data": {
    "imageStudyInstanceUid": "1.2.3.4.3",
    "imageSeriesInstanceUid": "1.2.3.4.3.9423673",
    "imageSopInstanceUid": "1.3.6.1.4.1.45096.2.296485376.2210.1633373143.864442",
    "serviceHostName": "{dicom-account}.dicom.azurehealthcareapis.com",
    "sequenceNumber": 2
  },
  "specVersion": "1.0"
}
```
---
### DicomImageUpdated

# [Event Grid event schema](#tab/event-grid-event-schema)

```json
{
  "id": "83cb0f51-af41-e58c-3c6c-46344b349bc5",
  "topic": "/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.HealthcareApis/workspaces/{workspace-name}",
  "subject": "{dicom-account}.dicom.azurehealthcareapis.com/v1/partitions/Microsoft.Default/studies/1.2.3.4.3/series/1.2.3.4.3.9423673/instances/1.3.6.1.4.1.45096.2.296485376.2210.1633373143.864442",
  "data": {
    "partitionName": "Microsoft.Default",
    "imageStudyInstanceUid": "1.2.3.4.3",
    "imageSeriesInstanceUid": "1.2.3.4.3.9423673",
    "imageSopInstanceUid": "1.3.6.1.4.1.45096.2.296485376.2210.1633373143.864442",
    "serviceHostName": "{dicom-account}.dicom.azurehealthcareapis.com",
    "sequenceNumber": 2
  },
  "eventType": "Microsoft.HealthcareApis.DicomImageUpdated",
  "dataVersion": "1",
  "metadataVersion": "1",
  "eventTime": "2023-06-09T16:55:44.7197137Z"
}
```
# [CloudEvent schema](#tab/cloud-event-schema)
```json
{
  "source": "/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.HealthcareApis/workspaces/{workspace-name}",
  "subject": "{dicom-account}.dicom.azurehealthcareapis.com/v1/partitions/Microsoft.Default/studies/1.2.3.4.3/series/1.2.3.4.3.9423673/instances/1.3.6.1.4.1.45096.2.296485376.2210.1633373143.864442",
  "type": "Microsoft.HealthcareApis.DicomImageUpdated",
  "time": "2022-09-15T01:14:04.5613214Z",
  "id": "7e8aca04-e815-4387-82a8-9fcf15a3114b",
  "data": {
    "partitionName": "Microsoft.Default",
    "imageStudyInstanceUid": "1.2.3.4.3",
    "imageSeriesInstanceUid": "1.2.3.4.3.9423673",
    "imageSopInstanceUid": "1.3.6.1.4.1.45096.2.296485376.2210.1633373143.864442",
    "serviceHostName": "{dicom-account}.dicom.azurehealthcareapis.com",
    "sequenceNumber": 1
  },
  "specversion": "1.0"
}
```
---

## Next steps
* For an overview of the Azure Health Data Services Events feature, see [What are Events?](../healthcare-apis/events/events-overview.md).
* To learn how to deploy the Azure Health Data Services Events feature in the Azure portal, see [Deploy Events using the Azure portal](../healthcare-apis/events/events-deploy-portal.md).
 
FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
