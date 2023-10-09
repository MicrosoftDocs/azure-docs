---
title: Sample events for Microsoft Azure Data Manager for Agriculture Preview based on Azure Event Grid #Required; page title is displayed in search results. Include the brand.
description: This article provides samples of Azure Data Manager for Agriculture Preview events. #Required; article description that is displayed in search results. 
author: gourdsay #Required; your GitHub user alias, with correct capitalization.
ms.author: angour #Required; microsoft alias of author; optional team alias.
ms.service: data-manager-for-agri #Required; service per approved list. slug assigned by ACOM.
ms.topic: conceptual #Required; leave this attribute/value as-is.
ms.date: 04/18/2023 #Required; mm/dd/yyyy format.
ms.custom: template-concept #Required; leave this attribute/value as-is.
---
# Azure Data Manager for Agriculture sample events 
This article provides the Azure Data Manager for Agriculture events samples. To learn more about our event properties that are provided with Azure Event Grid see our [how to use events](./how-to-use-events.md) page.
 
The event samples given on this page represent an event notification.

1. **Event type: Microsoft.AgFoodPlatform.PartyChanged**

````json
  {
      "data": {
        "actionType": "Deleted",
        "modifiedDateTime": "2022-10-17T18:43:37Z",
        "eTag": "f700fdd7-0000-0700-0000-634da2550000",
        "properties": {
        "key1": "value1",
        "key2": 123.45
        },
        "id": "<YOUR-PARTY-ID>",
        "createdDateTime": "2022-10-17T18:43:30Z"
      },
      "id": "23fad010-ec87-40d9-881b-1f2d3ba9600b",
      "topic": "/subscriptions/{SUBSCRIPTION-ID}/resourceGroups/{RESOURCE-GROUP-NAME}/providers/Microsoft.AgFoodPlatform/farmBeats/{YOUR-RESOURCE-NAME}",
      "subject": "/parties/<YOUR-PARTY-ID>",
      "eventType": "Microsoft.AgFoodPlatform.PartyChanged",
      "dataVersion": "1.0",
      "metadataVersion": "1",
      "eventTime": "2022-10-17T18:43:37.3306735Z"
    }
````

 2. **Event type: Microsoft.AgFoodPlatform.FarmChangedV2**
````json
  {
    "data": {
      "partyId": "<YOUR-PARTY-ID>",
      "actionType": "Updated",
      "status": "string",
      "modifiedDateTime": "2022-11-07T09:20:27Z",
      "eTag": "99017a4e-0000-0700-0000-6368cddb0000",
      "properties": {
        "key1": "value1",
        "key2": 123.45
      },
      "id": "<YOUR-FARM-ID>",
      "name": "string",
      "description": "string",
      "createdDateTime": "2022-03-26T12:51:24Z"
    },
    "id": "v2-796c89b6-306a-420b-be8f-4cd69df038f6",
    "topic": "/subscriptions/{SUBSCRIPTION-ID}/resourceGroups/{RESOURCE-GROUP-NAME}/providers/Microsoft.AgFoodPlatform/farmBeats/{YOUR-RESOURCE-NAME}",
    "subject": "/parties/<YOUR-PARTY-ID>/farms/<YOUR-FARM-ID>",
    "eventType": "Microsoft.AgFoodPlatform.FarmChangedV2",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2022-11-07T09:20:27.5307566Z"
  }
````

 3. **Event type: Microsoft.AgFoodPlatform.FieldChangedV2**

````json
  {
    "data": {
      "farmId": "<YOUR-FARM-ID>",
      "partyId": "<YOUR-PARTY-ID>",
      "actionType": "Created",
      "status": "string",
      "modifiedDateTime": "2022-11-01T10:44:17Z",
      "eTag": "af00eaf0-0000-0700-0000-6360f8810000",
      "properties": {
        "key1": "value1",
        "key2": 123.45
      },
      "id": "<YOUR-FIELD-ID>",
      "name": "string",
      "description": "string",
      "createdDateTime": "2022-11-01T10:44:17Z"
    },
    "id": "v2-b80e0977-5aeb-47c9-be7b-d6555e1c44f1",
    "topic": "/subscriptions/{SUBSCRIPTION-ID}/resourceGroups/{RESOURCE-GROUP-NAME}/providers/Microsoft.AgFoodPlatform/farmBeats/{YOUR-RESOURCE-NAME}",
    "subject": "/parties/<YOUR-PARTY-ID>/fields/<YOUR-FIELD-ID>",
    "eventType": "Microsoft.AgFoodPlatform.FieldChangedV2",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2022-11-01T10:44:17.162118Z"
  }
  ````

  
  
 4. **Event type: Microsoft.AgFoodPlatform.CropChanged**

````json
  {
    "data": {
      "actionType": "Created",
      "status": "Sample status",
      "modifiedDateTime": "2021-03-05T11:03:48Z",
      "eTag": "8601c4e5-0000-0700-0000-604210150000",
      "id": "<YOUR-CROP-ID>",
      "name": "Display name",
      "description": "Sample description",
      "createdDateTime": "2021-03-05T11:03:48Z",
      "properties": {
        "key1": "value1",
        "key2": 123.45
      }
    },
    "id": "4c59a797-b76d-48ec-8915-ceff58628f35",
    "topic": "/subscriptions/{SUBSCRIPTION-ID}/resourceGroups/{RESOURCE-GROUP-NAME}/providers/Microsoft.AgFoodPlatform/farmBeats/{YOUR-RESOURCE-NAME}",
    "subject": "/crops/<YOUR-CROP-ID>",
    "eventType": "Microsoft.AgFoodPlatform.CropChanged",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2021-03-05T11:03:49.0590658Z"
  }
  ````

 5. **Event type: Microsoft.AgFoodPlatform.CropProductChanged**

````json
   {
    "data": {
      "actionType": "Deleted",
      "status": "string",
      "modifiedDateTime": "2022-11-01T10:41:06Z",
      "eTag": "59055238-0000-0700-0000-6360f7080000",
      "properties": {
        "key1": "value1",
        "key2": 123.45
      },
      "id": "amcp",
      "name": "stridfng",
      "description": "string",
      "createdDateTime": "2022-11-01T10:34:54Z"
    },
    "id": "v2-a94f4e12-edca-4720-940f-f9d61755d8e2",
    "topic": "/subscriptions/{SUBSCRIPTION-ID}/resourceGroups/{RESOURCE-GROUP-NAME}/providers/Microsoft.AgFoodPlatform/farmBeats/{YOUR-RESOURCE-NAME}",
    "subject": "/cropProducts/amcp",
    "eventType": "Microsoft.AgFoodPlatform.CropProductChanged",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2022-11-01T10:41:06.6942143Z"
  }
````

 7. **Event type: Microsoft.AgFoodPlatform.SeasonChanged**
````json
  {
    "data": {
      "actionType": "Created",
      "status": "Sample status",
      "modifiedDateTime": "2021-03-05T11:18:38Z",
      "eTag": "86019afd-0000-0700-0000-6042138e0000",
      "id": "UNIQUE-SEASON-ID",
      "name": "Display name",
      "description": "Sample description",
      "createdDateTime": "2021-03-05T11:18:38Z",
      "properties": {
        "key1": "value1",
        "key2": 123.45
      }
    },
    "id": "63989475-397b-4b92-8160-8743bf8e5804",
    "topic": "/subscriptions/{SUBSCRIPTION-ID}/resourceGroups/{RESOURCE-GROUP-NAME}/providers/Microsoft.AgFoodPlatform/farmBeats/{FARMBEATS-RESOURCE-NAME}",
    "subject": "/seasons/UNIQUE-SEASON-ID",
    "eventType": "Microsoft.AgFoodPlatform.SeasonChanged",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2021-03-05T11:18:38.5804699Z"
  }
  ````
 8. **Event type: Microsoft.AgFoodPlatform.SatelliteDataIngestionJobStatusChangedV2**
```json
  {
    "data": {
      "partyId": "contoso-partyId",
      "message": "Created job 'sat-ingestion-job-1' to fetch satellite data for resource 'contoso-field' from startDate '08/07/2022' to endDate '10/07/2022' (both inclusive).",
      "status": "Running",
      "lastActionDateTime": "2022-11-07T09:35:23.3141004Z",
      "isCancellationRequested": false,
      "properties": {
        "key1": "value1",
        "key2": 123.45
      },
      "id": "sat-ingestion-job-1",
      "name": "string",
      "description": "string",
      "createdDateTime": "2022-11-07T09:35:15.8064528Z"
    },
    "id": "v2-3cab067b-4227-44c3-bea8-86e1e6d6968d",
    "topic": "/subscriptions/{SUBSCRIPTION-ID}/resourceGroups/{RESOURCE-GROUP-NAME}/providers/Microsoft.AgFoodPlatform/farmBeats/{YOUR-RESOURCE-NAME}",
    "subject": "/parties/contoso-partyId/satelliteDataIngestionJobs/sat-ingestion-job-1",
    "eventType": "Microsoft.AgFoodPlatform.SatelliteDataIngestionJobStatusChangedV2",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2022-11-07T09:35:23.3141452Z"
  }
```
 9. **Event type: Microsoft.AgFoodPlatform.WeatherDataIngestionJobStatusChangedV2**
```json
 {
    "data": {
      "partyId": "partyId1",
      "message": "Weather data available from '11/25/2020 00:00:00' to '11/30/2020 00:00:00'.",
      "status": "Succeeded",
      "lastActionDateTime": "2022-11-01T10:40:58.4472391Z",
      "isCancellationRequested": false,
      "properties": {
        "key1": "value1",
        "key2": 123.45
      },
      "id": "newIjJk",
      "name": "string",
      "description": "string",
      "createdDateTime": "2022-11-01T10:40:45.9408927Z"
    },
    "id": "0c1507dc-1fe6-4ad5-b2f4-680f3b12b7cf",
    "topic": "/subscriptions/{SUBSCRIPTION-ID}/resourceGroups/{RESOURCE-GROUP-NAME}/providers/Microsoft.AgFoodPlatform/farmBeats/{YOUR-RESOURCE-NAME}",
    "subject": "/parties/partyId1/weatherDataIngestionJobs/newIjJk",
    "eventType": "Microsoft.AgFoodPlatform.WeatherDataIngestionJobStatusChangedV2",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2022-11-01T10:40:58.4472961Z"
  }
```
 10. **Event type: Microsoft.AgFoodPlatform.WeatherDataRefresherJobStatusChangedV2**
```json
{
    "data": {
      "message": "Weather data refreshed successfully at '11/01/2022 10:45:57'.",
      "status": "Waiting",
      "lastActionDateTime": "2022-11-01T10:45:57.5966716Z",
      "isCancellationRequested": false,
      "id": "IBM.TWC~33.00~-9.00~currents-on-demand",
      "createdDateTime": "2022-11-01T10:39:34.2024298Z"
    },
    "id": "dff85442-3b9c-4fb0-95da-bda66c994e73",
    "topic": "/subscriptions/{SUBSCRIPTION-ID}/resourceGroups/{RESOURCE-GROUP-NAME}/providers/Microsoft.AgFoodPlatform/farmBeats/{YOUR-RESOURCE-NAME}",
    "subject": "/weatherDataRefresherJobs/IBM.TWC~33.00~-9.00~currents-on-demand",
    "eventType": "Microsoft.AgFoodPlatform.WeatherDataRefresherJobStatusChangedV2",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2022-11-01T10:45:57.596714Z"
  }
```

 11. **Event type: Microsoft.AgFoodPlatform.FarmOperationDataIngestionJobStatusChangedV2**
```json
{
    "data": {
      "partyId": "party-contoso",
      "message": "Created job 'ay-1nov' to fetch farm operation data for party id 'party-contoso'.",
      "status": "Running",
      "lastActionDateTime": "2022-11-01T10:36:58.4373839Z",
      "isCancellationRequested": false,
      "properties": {
        "key1": "value1",
        "key2": 123.45
      },
      "id": "ay-1nov",
      "name": "string",
      "description": "string",
      "createdDateTime": "2022-11-01T10:36:54.322847Z"
    },
    "id": "fa759285-9737-4636-ae47-8cffe8506986",
    "topic": "/subscriptions/{SUBSCRIPTION-ID}/resourceGroups/{RESOURCE-GROUP-NAME}/providers/Microsoft.AgFoodPlatform/farmBeats/{YOUR-RESOURCE-NAME}",
    "subject": "/parties/party-contoso/farmOperationDataIngestionJobs/ay-1nov",
    "eventType": "Microsoft.AgFoodPlatform.FarmOperationDataIngestionJobStatusChangedV2",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2022-11-01T10:36:58.4379601Z"
  }
```
 12. **Event type: Microsoft.AgFoodPlatform.BiomassModelJobStatusChangedV2**
```json
{
    "data": {
      "partyId": "party1",
      "message": "Created job 'job-biomass-13sdqwd' to calculate biomass values for resource 'field1' from plantingStartDate '05/03/2020' to inferenceEndDate '10/11/2020' (both inclusive).",
      "status": "Waiting",
      "lastActionDateTime": "0001-01-01T00:00:00Z",
      "isCancellationRequested": false,
      "properties": {
        "key1": "value1",
        "key2": 123.45
      },
      "id": "job-biomass-13sdqwd",
      "name": "biomass",
      "description": "biomass is awesome",
      "createdDateTime": "2022-11-07T15:16:28.3177868Z"
    },
    "id": "v2-bbb378f8-91cf-4005-8d1b-fe071d606459",
    "topic": "/subscriptions/{SUBSCRIPTION-ID}/resourceGroups/{RESOURCE-GROUP-NAME}/providers/Microsoft.AgFoodPlatform/farmBeats/{YOUR-RESOURCE-NAME}",
    "subject": "/parties/party1/biomassModelJobs/job-biomass-13sdqwd",
    "eventType": "Microsoft.AgFoodPlatform.BiomassModelJobStatusChangedV2",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2022-11-07T15:16:28.6070116Z"
  }
```

 13. **Event type: Microsoft.AgFoodPlatform.SoilMoistureModelJobStatusChangedV2**
```json
 {
    "data": {
      "partyId": "party",
      "message": "Created job 'job-soilmoisture-sf332q' to calculate soil moisture values for resource 'field1' from inferenceStartDate '05/01/2022' to inferenceEndDate '05/20/2022' (both inclusive).",
      "status": "Waiting",
      "lastActionDateTime": "0001-01-01T00:00:00Z",
      "isCancellationRequested": false,
      "properties": {
        "key1": "value1",
        "key2": 123.45
      },
      "id": "job-soilmoisture-sf332q",
      "name": "string",
      "description": "string",
      "createdDateTime": "2022-11-07T15:11:00.9484192Z"
    },
    "id": "v2-575d2196-63f2-44dc-b0f5-e5180b8475f1",
    "topic": "/subscriptions/{SUBSCRIPTION-ID}/resourceGroups/{RESOURCE-GROUP-NAME}/providers/Microsoft.AgFoodPlatform/farmBeats/{YOUR-RESOURCE-NAME}",
    "subject": "/parties/party/soilMoistureModelJobs/job-soilmoisture-sf332q",
    "eventType": "Microsoft.AgFoodPlatform.SoilMoistureModelJobStatusChangedV2",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2022-11-07T15:11:01.2957613Z"
  }
```

 14. **Event type: Microsoft.AgFoodPlatform.SensorPlacementModelJobStatusChangedV2**
```json
 {
    "data": {
      "partyId": "pjparty",
      "message": "Satellite scenes are available only for '0' days, expected scenes for '133' days. Not all scenes are available, please trigger satellite job for the required date range.",
      "status": "Running",
      "lastActionDateTime": "2022-11-01T10:44:19Z",
      "isCancellationRequested": false,
      "properties": {
        "key1": "value1",
        "key2": 123.45
      },
      "id": "pjjob2",
      "name": "string",
      "description": "string",
      "createdDateTime": "2022-11-01T10:44:01Z"
    },
    "id": "5d3e0d75-b963-494e-956a-3690b16315ff",
    "topic": "/subscriptions/{SUBSCRIPTION-ID}/resourceGroups/{RESOURCE-GROUP-NAME}/providers/Microsoft.AgFoodPlatform/farmBeats/{YOUR-RESOURCE-NAME}",
    "subject": "/parties/pjparty/sensorPlacementModelJobs/pjjob2",
    "eventType": "Microsoft.AgFoodPlatform.SensorPlacementModelJobStatusChangedV2",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2022-11-01T10:44:19Z"
  }
```

 15. **Event type: Microsoft.AgFoodPlatform.SeasonalFieldChangedV2**
````json
{
    "data": {
      "seasonId": "unique-season",
      "fieldId": "unique-field",
      "farmId": "unique-farm",
      "partyId": "unique-party",
      "actionType": "Created",
      "status": "string",
      "modifiedDateTime": "2022-11-07T07:40:30Z",
      "eTag": "9601f7cc-0000-0700-0000-6368b66e0000",
      "properties": {
        "key1": "value1",
        "key2": 123.45
      },
      "id": "unique-seasonalfield",
      "name": "string",
      "description": "string",
      "createdDateTime": "2022-11-07T07:40:30Z"
    },
    "id": "v2-8ac9fa0e-6750-4b9a-a62f-54fdeffb057a",
    "topic": "/subscriptions/{SUBSCRIPTION-ID}/resourceGroups/{RESOURCE-GROUP-NAME}/providers/Microsoft.AgFoodPlatform/farmBeats/{YOUR-RESOURCE-NAME}",
    "subject": "/parties/unique-party/seasonalFields/unique",
    "eventType": "Microsoft.AgFoodPlatform.SeasonalFieldChangedV2",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2022-11-07T07:40:30.1368975Z"
  }
````

 16. **Event type: Microsoft.AgFoodPlatform.ZoneChangedV2**
```json
{
    "data": {
      "managementZoneId": "contoso-mz",
      "partyId": "contoso-party",
      "actionType": "Deleted",
      "status": "string",
      "modifiedDateTime": "2022-11-01T10:50:07Z",
      "eTag": "5a058b39-0000-0700-0000-6360f9ae0000",
      "properties": {
        "key1": "value1",
        "key2": 123.45
      },
      "id": "contoso-zone-5764",
      "name": "string",
      "description": "string",
      "createdDateTime": "2022-11-01T10:48:39Z"
    },
    "id": "110777ec-e74e-42dd-aa5c-23c72fd2b2bf",
    "topic": "/subscriptions/{SUBSCRIPTION-ID}/resourceGroups/{RESOURCE-GROUP-NAME}/providers/Microsoft.AgFoodPlatform/farmBeats/{YOUR-RESOURCE-NAME}",
    "subject": "/parties/contoso-party/zones/contoso-zone-5764",
    "eventType": "Microsoft.AgFoodPlatform.ZoneChangedV2",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2022-11-01T10:50:07.586658Z"
  }
  ```
 17. **Event type: Microsoft.AgFoodPlatform.ManagementZoneChangedV2**
```json
{
    "data": {
      "seasonId": "season",
      "cropId": "crop",
      "fieldId": "contoso-field",
      "partyId": "contoso-party",
      "actionType": "Created",
      "status": "string",
      "modifiedDateTime": "2022-11-01T10:44:38Z",
      "eTag": "af00b1f1-0000-0700-0000-6360f8960000",
      "properties": {
        "key1": "value1",
        "key2": 123.45
      },
      "id": "contoso-mz",
      "name": "string",
      "description": "string",
      "createdDateTime": "2022-11-01T10:44:38Z"
    },
    "id": "0ac75094-ffd6-4dbf-847c-d9df03b630f4",
    "topic": "/subscriptions/{SUBSCRIPTION-ID}/resourceGroups/{RESOURCE-GROUP-NAME}/providers/Microsoft.AgFoodPlatform/farmBeats/{YOUR-RESOURCE-NAME}",
    "subject": "/parties/contoso-party/managementZones/contoso-mz",
    "eventType": "Microsoft.AgFoodPlatform.ManagementZoneChangedV2",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2022-11-01T10:44:38.3458983Z"
  }
  ```

 18. **Event type: Microsoft.AgFoodPlatform.PrescriptionChangedV2**
```json
{
    "data": {
      "prescriptionMapId": "contoso-prescriptionmapid123",
      "partyId": "contoso-partyId",
      "actionType": "Created",
      "status": "string",
      "modifiedDateTime": "2022-11-07T09:06:30Z",
      "eTag": "8f0745e8-0000-0700-0000-6368ca960000",
      "properties": {
        "key1": "value1",
        "key2": 123.45
      },
      "id": "contoso-prescrptionid123",
      "name": "string",
      "description": "string",
      "createdDateTime": "2022-11-07T09:06:30Z"
    },
    "id": "v2-f0c1df5d-db19-4bd9-adea-a0d38622d844",
    "topic": "/subscriptions/{SUBSCRIPTION-ID}/resourceGroups/{RESOURCE-GROUP-NAME}/providers/Microsoft.AgFoodPlatform/farmBeats/{YOUR-RESOURCE-NAME}",
    "subject": "/parties/contoso-partyId/prescriptions/contoso-prescrptionid123",
    "eventType": "Microsoft.AgFoodPlatform.PrescriptionChangedV2",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2022-11-07T09:06:30.9331136Z"
  }
  ```

 19. **Event type: Microsoft.AgFoodPlatform.PrescriptionMapChangedV2**
```json
 {
    "data": {
      "seasonId": "contoso-season",
      "cropId": "contoso-crop",
      "fieldId": "contoso-field",
      "partyId": "contoso-partyId",
      "actionType": "Updated",
      "status": "string",
      "modifiedDateTime": "2022-11-07T09:04:09Z",
      "eTag": "8f0722c1-0000-0700-0000-6368ca090000",
      "properties": {
        "key1": "value1",
        "key2": 123.45
      },
      "id": "contoso-prescriptionmapid123",
      "name": "string",
      "description": "string",
      "createdDateTime": "2022-11-07T09:01:25Z"
    },
    "id": "v2-625f09bd-c342-4af4-8ae9-0533fe36d8b5",
    "topic": "/subscriptions/{SUBSCRIPTION-ID}/resourceGroups/{RESOURCE-GROUP-NAME}/providers/Microsoft.AgFoodPlatform/farmBeats/{YOUR-RESOURCE-NAME}",
    "subject": "/parties/contoso-partyId/prescriptionMaps/contoso-prescriptionmapid123",
    "eventType": "Microsoft.AgFoodPlatform.PrescriptionMapChangedV2",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2022-11-07T09:04:09.8937395Z"
  }
  ```
 20. **Event type: Microsoft.AgFoodPlatform.PlantTissueAnalysisChangedV2**
```json
 {
    "data": {
      "fieldId": "contoso-field",
      "cropId": "contoso-crop",
      "cropProductId": "contoso-cropProduct",
      "seasonId": "contoso-season",
      "partyId": "contoso-partyId",
      "actionType": "Created",
      "status": "string",
      "modifiedDateTime": "2022-11-07T09:10:12Z",
      "eTag": "90078d29-0000-0700-0000-6368cb740000",
      "properties": {
        "key1": "value1",
        "key2": 123.45
      },
      "id": "contoso-planttissueanalysis123",
      "name": "string",
      "description": "string",
      "createdDateTime": "2022-11-07T09:10:12Z"
    },
    "id": "v2-1bcc9ef4-51a1-4192-bfbc-64deb3816583",
    "topic": "/subscriptions/{SUBSCRIPTION-ID}/resourceGroups/{RESOURCE-GROUP-NAME}/providers/Microsoft.AgFoodPlatform/farmBeats/{YOUR-RESOURCE-NAME}",
    "subject": "/parties/contoso-partyId/plantTissueAnalyses/contoso-planttissueanalysis123",
    "eventType": "Microsoft.AgFoodPlatform.PlantTissueAnalysisChangedV2",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2022-11-07T09:10:12.1008276Z"
  }
```
 21. **Event type: Microsoft.AgFoodPlatform.NutrientAnalysisChangedV2**
```json
 {
    "data": {
      "parentId": "contoso-planttissueanalysis123",
      "parentType": "PlantTissueAnalysis",
      "partyId": "contoso-partyId",
      "actionType": "Created",
      "status": "string",
      "modifiedDateTime": "2022-11-07T09:17:21Z",
      "eTag": "9901583d-0000-0700-0000-6368cd220000",
      "properties": {
        "key1": "value1",
        "key2": 123.45
      },
      "id": "nutrientAnalysis-123",
      "name": "string",
      "description": "string",
      "createdDateTime": "2022-11-07T09:17:21Z"
    },
    "id": "v2-c6eb10eb-27be-480a-bdca-bd8fbef7cfe7",
    "topic": "/subscriptions/{SUBSCRIPTION-ID}/resourceGroups/{RESOURCE-GROUP-NAME}/providers/Microsoft.AgFoodPlatform/farmBeats/{YOUR-RESOURCE-NAME}",
    "subject": "/parties/contoso-partyId/nutrientAnalyses/nutrientAnalysis-123",
    "eventType": "Microsoft.AgFoodPlatform.NutrientAnalysisChangedV2",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2022-11-07T09:17:22.0694093Z"
  }
  ```

 22. **Event type: Microsoft.AgFoodPlatform.AttachmentChangedV2**
```json
 {
      "data": {
        "resourceId": "NDk5MzQ5XzVmZWQ3ZWQ4ZGQxNzQ0MTI1YzliNjU5Yg",
        "resourceType": "ApplicationData",
        "partyId": "contoso-432623-party-6",
        "actionType": "Updated",
        "modifiedDateTime": "2022-10-17T18:56:23Z",
        "eTag": "19004980-0000-0700-0000-634da55a0000",
        "id": "NDk5MzQ5XzVmZWQ3ZWQ4ZGQxNzQ0MTI1YzliNjU5Yg-AppliedRate-TIF",
        "createdDateTime": "2022-06-08T15:03:00Z"
      },
      "id": "80542664-b16f-4b0c-9d7e-f453edede5e3",
      "topic": "/subscriptions/{SUBSCRIPTION-ID}/resourceGroups/{RESOURCE-GROUP-NAME}/providers/Microsoft.AgFoodPlatform/farmBeats/{YOUR-RESOURCE-NAME}",
      "subject": "/parties/contoso-432623-party-6/attachments/NDk5MzQ5XzVmZWQ3ZWQ4ZGQxNzQ0MTI1YzliNjU5Yg-AppliedRate-TIF",
      "eventType": "Microsoft.AgFoodPlatform.AttachmentChangedV2",
      "dataVersion": "1.0",
      "metadataVersion": "1",
      "eventTime": "2022-10-17T18:56:23.4832442Z"
    }
  ```

 23.  **Event type: Microsoft.AgFoodPlatform.InsightChangedV2**
```json
 {
    "data": {
      "modelId": "Microsoft.SoilMoisture",
      "resourceType": "Field",
      "resourceId": "fieldId",
      "modelVersion": "1.0",
      "partyId": "party",
      "actionType": "Updated",
      "modifiedDateTime": "2022-11-03T18:21:24Z",
      "eTag": "04011838-0000-0700-0000-636406a40000",
      "properties": {
        "SYSTEM-SENSORDATAMODELID": "pra-sm",
        "SYSTEM-INFERENCESTARTDATETIME": "2022-05-01T00:00:00Z",
        "SYSTEM-SENSORPARTNERID": "SensorPartner",
        "SYSTEM-SATELLITEPROVIDER": "Microsoft",
        "SYSTEM-SATELLITESOURCE": "Sentinel_2_L2A",
        "SYSTEM-IMAGERESOLUTION": 10,
        "SYSTEM-IMAGEFORMAT": "TIF"
      },
      "id": "02e96e5e-852b-f895-af1e-c6da309ae345",
      "createdDateTime": "2022-07-06T09:06:57Z"
    },
    "id": "v2-475358e4-3c8a-4a05-a22c-9fa4da6effc7",
    "topic": "/subscriptions/{SUBSCRIPTION-ID}/resourceGroups/{RESOURCE-GROUP-NAME}/providers/Microsoft.AgFoodPlatform/farmBeats/{YOUR-RESOURCE-NAME}",
    "subject": "/parties/party/insights/02e96e5e-852b-f895-af1e-c6da309ae345",
    "eventType": "Microsoft.AgFoodPlatform.InsightChangedV2",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2022-11-03T18:21:24.7502452Z"
  }
  ```

 24. **Event type: Microsoft.AgFoodPlatform.InsightAttachmentChangedV2**
```json
  {
    "data": {
      "insightId": "f5c2071c-c7ce-05f3-be4d-952a26f2490a",
      "modelId": "Microsoft.SoilMoisture",
      "resourceType": "Field",
      "resourceId": "fieldId",
      "partyId": "party",
      "actionType": "Updated",
      "modifiedDateTime": "2022-11-03T18:21:26Z",
      "eTag": "5d06cc22-0000-0700-0000-636406a60000",
      "id": "f5c2071c-c7ce-05f3-be4d-952a26f2490a-soilMoisture",
      "createdDateTime": "2022-07-06T09:07:00Z"
    },
    "id": "v2-46881f59-fd5c-48ed-a71f-342c04c75d1f",
    "topic": "/subscriptions/{SUBSCRIPTION-ID}/resourceGroups/{RESOURCE-GROUP-NAME}/providers/Microsoft.AgFoodPlatform/farmBeats/{YOUR-RESOURCE-NAME}",
    "subject": "/parties/party/insightAttachments/f5c2071c-c7ce-05f3-be4d-952a26f2490a-soilMoisture",
    "eventType": "Microsoft.AgFoodPlatform.InsightAttachmentChangedV2",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2022-11-03T18:21:26.9501924Z"
  }
  ```

 25. **Event type: Microsoft.AgFoodPlatform.ApplicationDataChangedV2**
```json
{
    "data": {
      "actionType": "Created",
      "partyId": "contoso-partyId",
      "status": "string",
      "source": "string",
      "modifiedDateTime": "2022-11-07T09:23:07Z",
      "properties": {
        "key1": "value1",
        "key2": 123.45
      },
      "eTag": "91072b09-0000-0700-0000-6368ce7b0000",
      "id": "applicationData-123",
      "name": "string",
      "description": "string",
      "createdDateTime": "2022-11-07T09:23:07Z"
    },
    "id": "v2-2d849164-a773-4926-bcd3-b3884bad5076",
    "topic": "/subscriptions/{SUBSCRIPTION-ID}/resourceGroups/{RESOURCE-GROUP-NAME}/providers/Microsoft.AgFoodPlatform/farmBeats/{YOUR-RESOURCE-NAME}",
    "subject": "/parties/contoso-partyId/applicationData/applicationData-123",
    "eventType": "Microsoft.AgFoodPlatform.ApplicationDataChangedV2",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2022-11-07T09:23:07.078703Z"
  }
  ```

 26. **Event type: Microsoft.AgFoodPlatform.HarvestDataChangedV2**
```json
 {
    "data": {
      "actionType": "Created",
      "partyId": "contoso-partyId",
      "status": "string",
      "source": "string",
      "modifiedDateTime": "2022-11-07T09:29:39Z",
      "properties": {
        "key1": "value1",
        "key2": 123.45
      },
      "eTag": "9901037e-0000-0700-0000-6368d0030000",
      "id": "harvestData-123",
      "name": "string",
      "description": "string",
      "createdDateTime": "2022-11-07T09:29:39Z"
    },
    "id": "v2-bd4c9d63-17f2-4c61-8583-a64e064f06d6",
    "topic": "/subscriptions/{SUBSCRIPTION-ID}/resourceGroups/{RESOURCE-GROUP-NAME}/providers/Microsoft.AgFoodPlatform/farmBeats/{YOUR-RESOURCE-NAME}",
    "subject": "/parties/contoso-partyId/harvestData/harvestData-123",
    "eventType": "Microsoft.AgFoodPlatform.HarvestDataChangedV2",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2022-11-07T09:29:39.3967693Z"
  }
  ```

 27. **Event type: Microsoft.AgFoodPlatform.TillageDataChangedV2**
```json
 {
    "data": {
      "actionType": "Created",
      "partyId": "contoso-partyId",
      "status": "string",
      "source": "string",
      "modifiedDateTime": "2022-11-07T09:32:00Z",
      "properties": {
        "key1": "value1",
        "key2": 123.45
      },
      "eTag": "9107eb95-0000-0700-0000-6368d0900000",
      "id": "tillageData-123",
      "name": "string",
      "description": "string",
      "createdDateTime": "2022-11-07T09:32:00Z"
    },
    "id": "v2-75b58a0f-00b9-4c73-9733-4caab2343686",
    "topic": "/subscriptions/{SUBSCRIPTION-ID}/resourceGroups/{RESOURCE-GROUP-NAME}/providers/Microsoft.AgFoodPlatform/farmBeats/{YOUR-RESOURCE-NAME}",
    "subject": "/parties/contoso-partyId/tillageData/tillageData-123",
    "eventType": "Microsoft.AgFoodPlatform.TillageDataChangedV2",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2022-11-07T09:32:00.7745737Z"
  }
  ```

 28. **Event type: Microsoft.AgFoodPlatform.PlantingDataChangedV2**
```json
  {
    "data": {
      "actionType": "Created",
      "partyId": "contoso-partyId",
      "status": "string",
      "source": "string",
      "modifiedDateTime": "2022-11-07T09:13:27Z",
      "properties": {
        "key1": "value1",
        "key2": 123.45
      },
      "eTag": "90073465-0000-0700-0000-6368cc370000",
      "id": "contoso-plantingdata123",
      "name": "string",
      "description": "string",
      "createdDateTime": "2022-11-07T09:13:27Z"
    },
    "id": "v2-1b55076b-d989-4831-81e4-ff8b469dc5f8",
    "topic": "/subscriptions/{SUBSCRIPTION-ID}/resourceGroups/{RESOURCE-GROUP-NAME}/providers/Microsoft.AgFoodPlatform/farmBeats/{YOUR-RESOURCE-NAME}",
    "subject": "/parties/contoso-partyId/plantingData/contoso-plantingdata123",
    "eventType": "Microsoft.AgFoodPlatform.PlantingDataChangedV2",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2022-11-07T09:13:27.9490317Z"
  }
  ```

 29. **Event type: Microsoft.AgFoodPlatform.ImageProcessingRasterizeJobStatusChangedV2**
```json
   {
    "data": {
      "shapefileAttachmentId": "attachment-contoso",
      "partyId": "party-contoso",
      "message": "Created job 'contoso-nov1-2' to rasterize shapefile attachment with id 'attachment-contoso'.",
      "status": "Running",
      "lastActionDateTime": "2022-11-01T10:44:44.8186582Z",
      "isCancellationRequested": false,
      "properties": {
        "key1": "value1",
        "key2": 123.45
      },
      "id": "contoso-nov1-2",
      "name": "string",
      "description": "string",
      "createdDateTime": "2022-11-01T10:44:39.3098984Z"
    },
    "id": "0ad2d5e6-1277-4880-adb6-bf0a621ad59b",
    "topic": "/subscriptions/{SUBSCRIPTION-ID}/resourceGroups/{RESOURCE-GROUP-NAME}/providers/Microsoft.AgFoodPlatform/farmBeats/{YOUR-RESOURCE-NAME}",
    "subject": "/parties/party-contoso/imageProcessingRasterizeJobs/contoso-nov1-2",
    "eventType": "Microsoft.AgFoodPlatform.ImageProcessingRasterizeJobStatusChangedV2",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2022-11-01T10:44:44.8203668Z"
  }
  ```

 30. **Event type: Microsoft.AgFoodPlatform.DeviceDataModelChanged**
```json
    {
    "data": {
      "sensorPartnerId": "partnerId",
      "actionType": "Created",
      "modifiedDateTime": "2022-11-03T03:37:42Z",
      "eTag": "e50094f2-0000-0700-0000-636337860000",
      "id": "synthetics-02a465da-0c85-40cf-b7a8-64e15baae3c4",
      "createdDateTime": "2022-11-03T03:37:42Z"
    },
    "id": "40ba84c3-b8f4-497d-8d44-1b8df6eb3b7c",
    "topic": "/subscriptions/{SUBSCRIPTION-ID}/resourceGroups/{RESOURCE-GROUP-NAME}/providers/Microsoft.AgFoodPlatform/farmBeats/{YOUR-RESOURCE-NAME}",
    "subject": "/sensorPartners/partnerId/deviceDataModels/synthetics-02a465da-0c85-40cf-b7a8-64e15baae3c4",
    "eventType": "Microsoft.AgFoodPlatform.DeviceDataModelChanged",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2022-11-03T03:37:42.4536218Z"
  }
  ```

 31. **Event type: Microsoft.AgFoodPlatform.DeviceChanged**
```json
    {
    "data": {
      "deviceDataModelId": "test-ddm1",
      "integrationId": "ContosoID",
      "sensorPartnerId": "SensorPartner",
      "actionType": "Created",
      "status": "string",
      "modifiedDateTime": "2022-11-01T11:29:01Z",
      "eTag": "b0000a6f-0000-0700-0000-636102fe0000",
      "properties": {
        "key1": "value1",
        "key2": 123.45
      },
      "id": "dddd1",
      "name": "string",
      "description": "string",
      "createdDateTime": "2022-11-01T11:29:01Z"
    },
    "id": "15ab45c7-0f04-4db3-b982-87380b3c1ba4",
    "topic": "/subscriptions/{SUBSCRIPTION-ID}/resourceGroups/{RESOURCE-GROUP-NAME}/providers/Microsoft.AgFoodPlatform/farmBeats/{YOUR-RESOURCE-NAME}",
    "subject": "/sensorPartners/SensorPartner/devices/dddd1",
    "eventType": "Microsoft.AgFoodPlatform.DeviceChanged",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2022-11-01T11:29:02.0578111Z"
  }
  ```

 32. **Event type: Microsoft.AgFoodPlatform.SensorDataModelChanged**
```json
 {
    "data": {
      "sensorPartnerId": "partnerId",
      "actionType": "Deleted",
      "modifiedDateTime": "2022-11-03T03:38:11Z",
      "eTag": "e50099f2-0000-0700-0000-636337860000",
      "id": "4fb0214a-459c-47b8-8564-b822f263ae12",
      "createdDateTime": "2022-11-03T03:37:42Z"
    },
    "id": "54fdb552-b5db-45c0-be49-8f4f27f27bde",
    "topic": "/subscriptions/{SUBSCRIPTION-ID}/resourceGroups/{RESOURCE-GROUP-NAME}/providers/Microsoft.AgFoodPlatform/farmBeats/{YOUR-RESOURCE-NAME}",
    "subject": "/sensorPartners/partnerId/sensorDataModels/4fb0214a-459c-47b8-8564-b822f263ae12",
    "eventType": "Microsoft.AgFoodPlatform.SensorDataModelChanged",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2022-11-03T03:38:11.7538559Z"
  }
  ```

 33. **Event type: Microsoft.AgFoodPlatform.SensorChanged**
```json
  {
    "data": {
      "sensorDataModelId": "4fb0214a-459c-47b8-8564-b822f263ae12",
      "integrationId": "159ce4e5-878f-4fc7-9bae-16eaf65bfb45",
      "sensorPartnerId": "partnerId",
      "actionType": "Deleted",
      "modifiedDateTime": "2022-11-03T03:38:09Z",
      "eTag": "13063e1e-0000-0700-0000-636337970000",
      "properties": {
        "key-a": "value-a"
      },
      "id": "ec1ed9c6-f476-448a-ab07-65e0d71e34d5",
      "createdDateTime": "2022-11-03T03:37:59Z"
    },
    "id": "b3a0f169-6d28-4e57-b570-6068446b50b4",
    "topic": "/subscriptions/{SUBSCRIPTION-ID}/resourceGroups/{RESOURCE-GROUP-NAME}/providers/Microsoft.AgFoodPlatform/farmBeats/{YOUR-RESOURCE-NAME}",
    "subject": "/sensorPartners/partnerId/sensors/ec1ed9c6-f476-448a-ab07-65e0d71e34d5",
    "eventType": "Microsoft.AgFoodPlatform.SensorChanged",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2022-11-03T03:38:09.7932361Z"
  }
  ```

 34. **Event type: Microsoft.AgFoodPlatform.SensorMappingChangedV2**
```json
    {
    "data": {
      "sensorId": "sensor",
      "partyId": "ContosopartyId",
      "sensorPartnerId": "sensorpartner",
      "actionType": "Created",
      "status": "string",
      "modifiedDateTime": "2022-11-01T11:08:33Z",
      "eTag": "b000ff36-0000-0700-0000-6360fe310000",
      "properties": {
        "key1": "value1",
        "key2": 123.45
      },
      "id": "sensormapping",
      "name": "string",
      "description": "string",
      "createdDateTime": "2022-11-01T11:08:33Z"
    },
    "id": "c532ff5c-bfa0-4644-a0bc-14f736ebc07d",
    "topic": "/subscriptions/{SUBSCRIPTION-ID}/resourceGroups/{RESOURCE-GROUP-NAME}/providers/Microsoft.AgFoodPlatform/farmBeats/{YOUR-RESOURCE-NAME}",
    "subject": "/sensorPartners/sensorpartner/sensorMappings/sensormapping",
    "eventType": "Microsoft.AgFoodPlatform.SensorMappingChangedV2",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2022-11-01T11:08:33.3345312Z"
  }
  ```

 35. **Event type: Microsoft.AgFoodPlatform.SensorPartnerIntegrationChangedV2**
```json
   {
    "data": {
      "integrationId": "159ce4e5-878f-4fc7-9bae-16eaf65bfb45",
      "sensorPartnerId": "partnerId",
      "actionType": "Deleted",
      "modifiedDateTime": "2022-11-03T03:38:10Z",
      "eTag": "e5009cf2-0000-0700-0000-636337870000",
      "id": "159ce4e5-878f-4fc7-9bae-16eaf65bfb45",
      "createdDateTime": "2022-11-03T03:37:42Z"
    },
    "id": "v2-3e6b1527-7f67-4c7d-b26e-1000a6a97612",
    "topic": "/subscriptions/{SUBSCRIPTION-ID}/resourceGroups/{RESOURCE-GROUP-NAME}/providers/Microsoft.AgFoodPlatform/farmBeats/{YOUR-RESOURCE-NAME}",
    "subject": "/sensorPartners/partnerId/integrations/159ce4e5-878f-4fc7-9bae-16eaf65bfb45",
    "eventType": "Microsoft.AgFoodPlatform.SensorPartnerIntegrationChangedV2",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2022-11-03T03:38:10.9531838Z"
  }
  ```
## Next steps
* For an introduction to Azure Event Grid, see [What is Event Grid?](../event-grid/overview.md)
* Test our APIs [here](/rest/api/data-manager-for-agri).
