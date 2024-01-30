---
title: Events message structure - Azure Health Data Services
description: Learn about the events message structures and required values.
services: healthcare-apis
author: msjasteppe
ms.service: healthcare-apis
ms.subservice: fhir
ms.topic: reference
ms.date: 07/11/2023
ms.author: jasteppe
---

# Events message structures

In this article, learn about the events message structures, required and nonrequired elements, and see samples of events message payloads.

> [!IMPORTANT]
> Events currently supports the following operations:
>
> * **FhirResourceCreated** - The event emitted after a FHIR resource gets created successfully.
>
> * **FhirResourceUpdated** - The event emitted after a FHIR resource gets updated successfully.
>
> * **FhirResourceDeleted** - The event emitted after a FHIR resource gets soft deleted successfully.
>
> * **DicomImageCreated** - The event emitted after a DICOM image gets created successfully.
> 
> * **DicomImageDeleted** - The event emitted after a DICOM image gets deleted successfully.
> 
> * **DicomImageUpdated** - The event emitted after a DICOM image gets updated successfully.
>
> For more information about the FHIR service delete types, see [FHIR REST API capabilities for Azure Health Data Services FHIR service](../../healthcare-apis/fhir/fhir-rest-api-capabilities.md)

## FHIR events message structure

|Name|Type|Required|Description|
|----|----|--------|-----------|
|`topic`|string|Yes|The topic is the Azure Resource ID of your Azure Health Data Services workspace.|
|`subject`|string|Yes|The Uniform Resource Identifier (URI) of the FHIR resource that was changed. Customer can access the resource with the subject with https:// scheme. Customer should use the dataVersion or data.resourceVersionId to visit specific data version regarding this event.|
|`eventType`|string(enum)|Yes|The type of change on the FHIR resource.|
|`eventTime`|string(datetime)|Yes|The UTC time when the FHIR resource change committed.|
|`id`|string|Yes|Unique identifier for the event.|
|`data`|object|Yes|FHIR resource change event details.|
|`data.resourceType`|string(enum)|Yes|The FHIR Resource Type.|
|`data.resourceFhirAccount`|string|Yes|The service name of FHIR account in the Azure Health Data Services workspace.|
|`data.resourceFhirId`|string|Yes|The resource ID of the FHIR account. The FHIR service randomly generates the ID when a customer creates the resource. The customer can also use customized ID in FHIR resource creation; however the ID should **not** include or infer any PHI/PII information. It should be a system metadata, not specific to any personal data content.|
|`data.resourceVersionId`|string(number)|Yes|The data version of the FHIR resource.|
|`dataVersion`|string|No|Same as `data.resourceVersionId`.|
|`metadataVersion`|string|No|The schema version of the event metadata. This is defined by Azure Event Grid and should be constant most of the time.|

## FHIR events message samples

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

## DICOM events message structure

|Name | Type | Required	| Description |
|-----|------|----------|-------------|
|`topic`	| string	| Yes	| The topic is the Azure Resource ID of your Azure Health Data Services workspace.
|`subject` | string | Yes | The Uniform Resource Identifier (URI) of the DICOM image that was changed. Customer can access the image with the subject with https:// scheme. Customer should use the dataVersion or data.resourceVersionId to visit specific data version regarding this event.
| `eventType`	| string(enum)	| Yes	| The type of change on the DICOM image.
| `eventTime`	| string(datetime)	| Yes	| The UTC time when the DICOM image change was committed.
| `id`	| string	| Yes	| Unique identifier for the event.
| `data`	| object	| Yes	| DICOM image change event details.
| `data.partitionName`	| string	| No | Data partition name.
| `data.imageStudyInstanceUid`	| string	| Yes | The image's Study Instance UID.
| `data.imageSeriesInstanceUid`	| string	| Yes	| The image's Series Instance UID.
| `data.imageSopInstanceUid`	| string	| Yes	| The image's SOP Instance UID.
| `data.serviceHostName`	| string	| Yes	| The hostname of the DICOM service where the change occurred. 
| `data.sequenceNumber`	| int	| Yes	| The sequence number of the change in the DICOM service. Every image creation and deletion have a unique sequence within the service. This number correlates to the sequence number of the DICOM service's Change Feed. Querying the DICOM Service Change Feed with this sequence number gives you the change that created this event.
| `dataVersion`	| string	| No	| The data version of the DICOM image.
| `metadataVersion`	| string	| No	| The schema version of the event metadata. This is defined by Azure Event Grid and should be constant most of the time.

## DICOM events message samples

### DicomImageCreated

# [Event Grid event schema](#tab/event-grid-event-schema)

```json
{
  "id": "d621839d-958b-4142-a638-bb966b4f7dfd",
  "topic": "/subscriptions/{subscription-id}/resourceGroups/{resource-group-name}/providers/Microsoft.HealthcareApis/workspaces/{workspace-name}",
  "subject": "{dicom-account}.dicom.azurehealthcareapis.com/v1/partitions/Microsoft.Default/studies/1.2.3.4.3/series/1.2.3.4.3.9423673/instances/1.3.6.1.4.1.45096.2.296485376.2210.1633373143.864442",
  "data": {
    "partitionName": "Microsoft.Default",
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
  "subject": "{dicom-account}.dicom.azurehealthcareapis.com/v1/partitions/Microsoft.Default/studies/1.2.3.4.3/series/1.2.3.4.3.9423673/instances/1.3.6.1.4.1.45096.2.296485376.2210.1633373143.864442",
  "type": "Microsoft.HealthcareApis.DicomImageCreated",
  "time": "2022-09-15T01:14:04.5613214Z",
  "id": "d621839d-958b-4142-a638-bb966b4f7dfd",
  "data": {
    "partitionName": "Microsoft.Default",
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
  "subject": "{dicom-account}.dicom.azurehealthcareapis.com/v1/partitions/Microsoft.Default/studies/1.2.3.4.3/series/1.2.3.4.3.9423673/instances/1.3.6.1.4.1.45096.2.296485376.2210.1633373143.864442",
  "data": {
    "partitionName": "Microsoft.Default",
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
  "subject": "{dicom-account}.dicom.azurehealthcareapis.com/v1/partitions/Microsoft.Default/studies/1.2.3.4.3/series/1.2.3.4.3.9423673/instances/1.3.6.1.4.1.45096.2.296485376.2210.1633373143.864442",
  "type": "Microsoft.HealthcareApis.DicomImageDeleted",
  "time": "2022-09-15T01:14:04.5613214Z",
  "id": "eac1c1a0-ffa8-4b28-97cc-1d8b9a0a6021",
  "data": {
    "partitionName": "Microsoft.Default",
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

In this article, you learned about the events message structures.

To learn how to deploy events using the Azure portal, see

> [!div class="nextstepaction"]
> [Deploy events using the Azure portal](events-deploy-portal.md)

FHIR&#174; is a registered trademark of Health Level Seven International, registered in the U.S. Trademark Office and is used with their permission.
