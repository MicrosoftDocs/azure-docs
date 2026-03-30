---
title: "Tutorial: Use Rock and Fluid Samples (RAFS) DDMS APIs"
titleSuffix: Microsoft Azure Data Manager for Energy
description: Learn how to use RAFS DDMS v2 endpoints for rock and fluid samples.
ms.topic: tutorial
author: bharathim
ms.author: bselvaraj
ms.service: azure-data-manager-energy
ms.date: 09/16/2025
# Customer intent: "As a Geoscientist, I want to learn how to use Rock and Fluid Sample DDMS APIs to ingest and retrieve rock and fluid samples subsurface data."
---

# Tutorial: Use Rock and Fluid Samples (RAFS) DDMS APIs
Rock and Fluid Samples (RAFS) DDMS allows you to manage storage, retrieval, and association of rock and fluid sample master data, analyses, and reports. This tutorial shows a step-by-step workflow using cURL to create and interact with these entities in your Azure Data Manager for Energy instance.

In this tutorial, you learn how to use a RAFS DDMS APIs to:

> [!div class="checklist"]
> * Create a legal tag
> * Create Master data hierarchy
> * Create RAFS master data records
> * Create Sample Analysis Report
> * Create Sample Analysis

This tutorial shows common end-to-end cURL-based interactions with RAFS DDMS API endpoints.

## Prerequisites

* An Azure subscription
* Azure Data Manager for Energy instance (see [quickstart]](quickstart-create-microsoft-energy-data-services-instance.md))
* [cURL](https://curl.se/) installed locally
* OSDU standard reference data loaded in your instance
* Valid access token (See [How to generate auth token](how-to-generate-auth-token.md))

### Get details for the Azure Data Manager for Energy instance

For this tutorial, you need the following parameters:

| Parameter | Value to use | Example | Where to find this value |
|----|----|----|----|
| `DNS` | URI of the Azure Data Manager for Energy instance | `<instance>.energy.azure.com` | Overview page of the Azure Data Manager for Energy instance |
| `DATA_PARTITION_ID` | Data partition identifier | `<data-partition-id>` | Data Partition section within the Azure Data Manager for Energy instance |
| `ACCESS_TOKEN` | OAuth 2.0 access token (Bearer token) | `0.ATcA01-XWHdJ0ES-qDevC6r...........` | Generate using the [How to generate auth token](how-to-generate-auth-token.md) guide |
| `LEGAL_TAG`| 	Name for a new legal tag | `opendes-demo-legal-tag` | You define (see below) |

Follow the [Manage users](how-to-manage-users.md) guide to add appropriate entitlements for the user who's running this tutorial.

## 1. Create a legal tag

Legal tags are essential for compliance purposes and are used in subsequent records.

```bash
curl --request POST \
  --url {{DNS}}/api/legal/v1/legaltags \
  --header 'authorization: Bearer {{ACCESS_TOKEN}}' \
  --header 'content-type: application/json' \
  --header 'data-partition-id: {{DATA_PARTITION_ID}}' \
  --data '{
  "name": "{{LEGAL_TAG}}",
  "description": "RAFS DDMS Demo legal tag",
  "properties": {
    "countryOfOrigin": [
      "US"
    ],
    "contractId": "A1234",
    "expirationDate": "2099-01-25",
    "originator": "Contoso",
    "dataType": "Public Domain Data",
    "securityClassification": "Public",
    "personalData": "No Personal Data",
    "exportClassification": "EAR99"
  }
}'
```

Sample response:
```JSON
{
  "name": "opendes-osdu-rafs-ddms-demo-legal-ta",
  "description": "RAFS DDMS Demo legal tag",
  "properties": {
    "countryOfOrigin": ["US"],
    "contractId": "A1234",
    "expirationDate": "2099-01-25",
    "originator": "Contoso",
    "dataType": "Public Domain Data",
    "securityClassification": "Public",
    "personalData": "No Personal Data",
    "exportClassification": "EAR99"
  }
}
```

## 2. Create Master data hierarchy

Entities must be created in this sequence: Organization → Field → Well → Wellbore. All requests use the Storage Service endpoint: `/api/storage/v2/records`.

### 2.1 Organization
Create organization record using the following sample cURL command.

```bash
curl --request PUT \
  --url {{DNS}}/api/storage/v2/records \
  --header 'authorization: Bearer {{ACCESS_TOKEN}}' \
  --header 'content-type: application/json' \
  --header 'data-partition-id: {{DATA_PARTITION_ID}}' \
  --data '[
  {
    "id": "{{DATA_PARTITION_ID}}:master-data--Organisation:CoreLabs-IN",
    "kind": "{{AUTHORITY}}:{{SCHEMA_SOURCE}}:master-data--Organisation:1.2.0",
    "acl": {
      "owners": [
        "{{ACL_DATA_OWNERS}}"
      ],
      "viewers": [
        "{{ACL_DATA_VIEWERS}}"
      ]
    },
    "legal": {
      "legaltags": [
        "{{DATA_PARTITION_ID}}-{{LEGAL_TAG}}"
      ],
      "otherRelevantDataCountries": [
        "FR",
        "US"
      ],
      "status": "compliant"
    },
    "data": {
      "OrganisationID": "CoreLabs India Identifier",
      "OrganisationName": "CoreLabs India",
      "EffectiveDateTime": "2020-02-13T09:13:15.55Z",
      "TerminationDateTime": "2030-02-13T09:13:15.55Z"
    }
  }
]'
```

Sample response:
```JSON
{
  "recordCount": 1,
  "recordIds": [
    "opendes:master-data--Organisation:CoreLabs-IN"
  ],
  "skippedRecordIds": [],
  "recordIdVersions": [
    "opendes:master-data--Organisation:CoreLabs-IN:1758005682610981"
  ]
}
```

### 2.2 Field

```bash
curl --request PUT \
  --url {{DNS}}/api/storage/v2/records \
  --header 'authorization: Bearer {{ACCESS_TOKEN}}' \
  --header 'content-type: application/json' \
  --header 'data-partition-id: {{DATA_PARTITION_ID}}' \
  --data '[
  {
    "id": "{{DATA_PARTITION_ID}}:master-data--Field:RAFS-Field",
    "kind": "{{AUTHORITY}}:{{SCHEMA_SOURCE}}:master-data--Field:1.0.0",
    "acl": {
      "owners": [
        "{{ACL_DATA_OWNERS}}"
      ],
      "viewers": [
        "{{ACL_DATA_VIEWERS}}"
      ]
    },
    "legal": {
      "legaltags": [
        "{{DATA_PARTITION_ID}}-{{LEGAL_TAG}}"
      ],
      "otherRelevantDataCountries": [
        "FR",
        "US"
      ],
      "status": "compliant"
    },
    "data": {
      "FieldID": "RAFS Field Identifier",
      "FieldName": "RAFS FieldName",
      "FieldDescription": "RAFS FieldDescription",
      "NameAliases": [
        {
          "AliasName": "RAFS AliasName",
          "AliasNameTypeID": "{{DATA_PARTITION_ID}}:reference-data--AliasNameType:RegulatoryIdentifier:",
          "DefinitionOrganisationID": "{{organisation_id}}:",
          "EffectiveDateTime": "2020-02-13T09:13:15.55Z",
          "TerminationDateTime": "2030-02-13T09:13:15.55Z"
        }
      ]
    }
  }
]'
```

Sample response:
```JSON
{
  "recordCount": 1,
  "recordIds": [
    "opendes:master-data--Field:RAFS-Field"
  ],
  "skippedRecordIds": [],
  "recordIdVersions": [
    "opendes:master-data--Field:RAFS-Field:1758005692653158"
  ]
}
```
### 2.3 Well

```bash
curl --request PUT \
  --url {{DNS}}/api/storage/v2/records \
  --header 'authorization: Bearer {{ACCESS_TOKEN}}' \
  --header 'content-type: application/json' \
  --header 'data-partition-id: {{DATA_PARTITION_ID}}' \
  --data '[
  {
    "id": "{{DATA_PARTITION_ID}}:master-data--Well:RAFS-Well",
    "kind": "{{AUTHORITY}}:{{SCHEMA_SOURCE}}:master-data--Well:1.4.0",
    "acl": {
      "owners": [
        "{{ACL_DATA_OWNERS}}"
      ],
      "viewers": [
        "{{ACL_DATA_VIEWERS}}"
      ]
    },
    "legal": {
      "legaltags": [
        "{{DATA_PARTITION_ID}}-{{LEGAL_TAG}}"
      ],
      "otherRelevantDataCountries": [
        "FR",
        "US"
      ],
      "status": "compliant"
    },
    "data": {
      "FacilityID": "RAFS Facility Identifier",
      "FacilityTypeID": "{{DATA_PARTITION_ID}}:reference-data--FacilityType:Well:",
      "FacilityOperators": [
        {
          "FacilityOperatorID": "RAFS Facility Operator ID",
          "FacilityOperatorOrganisationID": "{{organisation_id}}:",
          "EffectiveDateTime": "2020-02-13T09:13:15.55Z",
          "TerminationDateTime": "2030-02-13T09:13:15.55Z",
          "Remark": "Example Remark"
        }
      ],
      "GeoContexts": [
        {
          "FieldID": "{{field_id}}:",
          "GeoTypeID": "Field"
        }
      ]
    }
  }
]'
```

Sample response:
```JSON
{
  "recordCount": 1,
  "recordIds": [
    "opendes:master-data--Well:RAFS-Well"
  ],
  "skippedRecordIds": [],
  "recordIdVersions": [
    "opendes:master-data--Well:RAFS-Well:1758005701048535"
  ]
}
```

### 2.4 Wellbore

```bash
curl --request PUT \
  --url {{DNS}}/api/storage/v2/records \
  --header 'authorization: Bearer {{ACCESS_TOKEN}}' \
  --header 'content-type: application/json' \
  --header 'data-partition-id: {{DATA_PARTITION_ID}}' \
  --data '[
  {
    "id": "{{DATA_PARTITION_ID}}:master-data--Wellbore:RAFS-Wellbore",
    "kind": "{{AUTHORITY}}:{{SCHEMA_SOURCE}}:master-data--Wellbore:1.5.1",
    "acl": {
      "owners": [
        "{{ACL_DATA_OWNERS}}"
      ],
      "viewers": [
        "{{ACL_DATA_VIEWERS}}"
      ]
    },
    "legal": {
      "legaltags": [
        "{{DATA_PARTITION_ID}}-{{LEGAL_TAG}}"
      ],
      "otherRelevantDataCountries": [
        "FR",
        "US"
      ],
      "status": "compliant"
    },
    "data": {
      "FacilityID": "RAFS Facility Identifier",
      "FacilityTypeID": "{{DATA_PARTITION_ID}}:reference-data--FacilityType:Well:",
      "FacilityOperators": [
        {
          "FacilityOperatorID": "RAFS Facility Operator ID",
          "FacilityOperatorOrganisationID": "{{organisation_id}}:",
          "EffectiveDateTime": "2020-02-13T09:13:15.55Z",
          "TerminationDateTime": "2030-02-13T09:13:15.55Z",
          "Remark": "Example Remark"
        }
      ],
      "GeoContexts": [
        {
          "FieldID": "{{field_id}}:",
          "GeoTypeID": "Field"
        }
      ],
      "WellID": "{{well_id}}:"
    }
  }
]'
```

Sample response:
```JSON
{
  "recordCount": 1,
  "recordIds": [
    "opendes:master-data--Wellbore:RAFS-Wellbore"
  ],
  "skippedRecordIds": [],
  "recordIdVersions": [
    "opendes:master-data--Wellbore:RAFS-Wellbore:1758005709139052"
  ]
}
```

## 3. Ingest RAFS master data
Use RAFS DDMS API `/v2/masterdata` to load Generic Facility, Generic Site, Sample Acquisition Job, Sample Acquisition Container, Sample and Sample Chain of Custody Event master data.

### 3.1 Generic Facility

```bash
curl --request POST \
  --url {{DNS}}/api/rafs-ddms/v2/masterdata \
  --header 'authorization: Bearer {{ACCESS_TOKEN}}' \
  --header 'cache-control: no-store' \
  --header 'content-type: application/json' \
  --header 'data-partition-id: {{DATA_PARTITION_ID}}' \
  --data '[
  {
    "id": "{{DATA_PARTITION_ID}}:master-data--GenericFacility:CENTRAL-LAB-001",
    "kind": "osdu:wks:master-data--GenericFacility:1.0.0",
    "legal": {
      "legaltags": [
        "{{DATA_PARTITION_ID}}-{{LEGAL_TAG}}"
      ],
      "otherRelevantDataCountries": [
        "IN"
      ],
      "status": "compliant"
    },
    "acl": {
      "owners": [
        "{{ACL_DATA_OWNERS}}"
      ],
      "viewers": [
        "{{ACL_DATA_VIEWERS}}"
      ]
    },
    "data": {
      "ResourceHomeRegionID": "{{DATA_PARTITION_ID}}:reference-data--OSDURegion:AWSEastUSA:",
      "ResourceHostRegionIDs": [
        "{{DATA_PARTITION_ID}}:reference-data--OSDURegion:AWSEastUSA:"
      ],
      "ResourceCurationStatus": "{{DATA_PARTITION_ID}}:reference-data--ResourceCurationStatus:Created:",
      "ResourceLifecycleStatus": "{{DATA_PARTITION_ID}}:reference-data--ResourceLifecycleStatus:Loading:",
      "Source": "Example Data Source",
      "ExistenceKind": "{{DATA_PARTITION_ID}}:reference-data--ExistenceKind:Prototype:",
      "NameAliases": [
        {
          "AliasName": "Example AliasName",
          "AliasNameTypeID": "{{DATA_PARTITION_ID}}:reference-data--AliasNameType:RegulatoryIdentifier:",
          "DefinitionOrganisationID": "{{organisation_id}}:",
          "EffectiveDateTime": "2020-02-13T09:13:15.55Z",
          "TerminationDateTime": "2020-02-13T09:13:15.55Z"
        }
      ],
      "GeoContexts": [
        {
          "FieldID": "{{field_id}}:",
          "GeoTypeID": "Field"
        }
      ],
      "Name": "Chevron Central Core Lab",
      "FacilityTypeID": "{{DATA_PARTITION_ID}}:reference-data--FacilityType:Wellbore:",
      "ResourceHomeRegionID": "{{DATA_PARTITION_ID}}:reference-data--OSDURegion:AzureAustralia:",
      "ResourceLifecycleStatus": "{{DATA_PARTITION_ID}}:reference-data--ResourceLifecycleStatus:ACCEPTED:",
      "VersionCreationReason": "Example VersionCreationReason",
      "FacilityID": "Example External Facility Identifier",
      "FacilityTypeID": "{{DATA_PARTITION_ID}}:reference-data--FacilityType:Well:",
      "FacilityOperators": [
        {
          "FacilityOperatorID": "Example Facility Operator ID",
          "FacilityOperatorOrganisationID": "{{organisation_id}}:",
          "EffectiveDateTime": "2020-02-13T09:13:15.55Z",
          "TerminationDateTime": "2020-02-13T09:13:15.55Z",
          "Remark": "Example Remark"
        }
      ],
      "InitialOperatorID": "{{organisation_id}}:",
      "CurrentOperatorID": "{{organisation_id}}:",
      "DataSourceOrganisationID": "{{organisation_id}}:",
      "OperatingEnvironmentID": "{{DATA_PARTITION_ID}}:reference-data--OperatingEnvironment:Onshore:",
      "FacilityName": "Example FacilityName",
      "FacilityDescription": "Example Facility Description",
      "FacilityStates": [
        {
          "EffectiveDateTime": "2020-02-13T09:13:15.55Z",
          "TerminationDateTime": "2020-02-13T09:13:15.55Z",
          "FacilityStateTypeID": "{{DATA_PARTITION_ID}}:reference-data--FacilityStateType:Closed:",
          "Remark": "Example Remark"
        }
      ],
      "FacilityEvents": [
        {
          "FacilityEventTypeID": "{{DATA_PARTITION_ID}}:reference-data--FacilityEventType:Abandon:",
          "EffectiveDateTime": "2020-02-13T09:13:15.55Z",
          "TerminationDateTime": "2020-02-13T09:13:15.55Z",
          "Remark": "Example Remark"
        }
      ],
      "FacilitySpecifications": [
        {
          "EffectiveDateTime": "2020-02-13T09:13:15.55Z",
          "TerminationDateTime": "2020-02-13T09:13:15.55Z",
          "FacilitySpecificationQuantity": 12345.6,
          "FacilitySpecificationDateTime": "2020-02-13T09:13:15.55Z",
          "FacilitySpecificationIndicator": true,
          "FacilitySpecificationText": "Example FacilitySpecificationText",
          "UnitOfMeasureID": "{{DATA_PARTITION_ID}}:reference-data--UnitOfMeasure:m:",
          "ParameterTypeID": "{{DATA_PARTITION_ID}}:reference-data--ParameterType:SlotName:"
        }
      ],
      "ExtensionProperties": {}
    }
  }
]'
```

Sample response:
```JSON
{
  "recordCount": 1,
  "recordIdVersions": [
    "opendes:master-data--GenericFacility:CENTRAL-LAB-001:1758005722706490"
  ],
  "skippedRecordCount": 0
}
```

### 3.2 Generic Site

```bash
curl --request POST \
  --url {{DNS}}/api/rafs-ddms/v2/masterdata \
  --header 'authorization: Bearer {{ACCESS_TOKEN}}' \
  --header 'cache-control: no-store' \
  --header 'content-type: application/json' \
  --header 'data-partition-id: {{DATA_PARTITION_ID}}' \
  --data '[
  {
    "id": "{{DATA_PARTITION_ID}}:master-data--GenericSite:KKS-ADIT-001",
    "kind": "osdu:wks:master-data--GenericSite:1.0.0",
    "legal": {
      "legaltags": [
        "{{DATA_PARTITION_ID}}-{{LEGAL_TAG}}"
      ],
      "otherRelevantDataCountries": [
        "IN"
      ],
      "status": "compliant"
    },
    "acl": {
      "owners": [
        "{{ACL_DATA_OWNERS}}"
      ],
      "viewers": [
        "{{ACL_DATA_VIEWERS}}"
      ]
    },
    "data": {
      "Name": "Kentish Knock South-1 Adit",
      "SiteTypeID": "{{DATA_PARTITION_ID}}:reference-data--SiteType:Adit:",
      "ResourceHomeRegionID": "{{DATA_PARTITION_ID}}:reference-data--OSDURegion:AzureAustralia:",
      "ResourceLifecycleStatus": "{{DATA_PARTITION_ID}}:reference-data--ResourceLifecycleStatus:ACCEPTED:",
      "ExistenceKind": "{{DATA_PARTITION_ID}}:reference-data--ExistenceKind:Simulated:"
    }
  }
]'
```

Sample response:
```JSON
{
  "recordCount": 1,
  "recordIdVersions": [
    "opendes:master-data--GenericSite:KKS-ADIT-001:1758005728156709"
  ],
  "skippedRecordCount": 0
}
```

### 3.3 Sample Acquisition Job

```bash
curl --request POST \
  --url {{DNS}}/api/rafs-ddms/v2/masterdata \
  --header 'authorization: Bearer {{ACCESS_TOKEN}}' \
  --header 'cache-control: no-store' \
  --header 'content-type: application/json' \
  --header 'data-partition-id: {{DATA_PARTITION_ID}}' \
  --data '[
  {
    "id": "{{DATA_PARTITION_ID}}:master-data--SampleAcquisitionJob:KKS-CORE-20230304-001",
    "kind": "osdu:wks:master-data--SampleAcquisitionJob:1.0.0",
    "legal": {
      "legaltags": [
        "{{DATA_PARTITION_ID}}-{{LEGAL_TAG}}"
      ],
      "otherRelevantDataCountries": [
        "IN"
      ],
      "status": "compliant"
    },
    "acl": {
      "owners": [
        "{{ACL_DATA_OWNERS}}"
      ],
      "viewers": [
        "{{ACL_DATA_VIEWERS}}"
      ]
    },
    "data": {
      "ContractorID": "{{organisation_id}}:",
      "ProjectBeginDate": "2013-03-04T00:00:00Z",
      "ProjectEndDate": "2013-03-07T00:00:00Z"
    }
  }
]'
```

Sample response:
```JSON
{
  "recordCount": 1,
  "recordIdVersions": [
    "opendes:master-data--SampleAcquisitionJob:KKS-CORE-20230304-001:1758005733180422"
  ],
  "skippedRecordCount": 0
}
```

### 3.4 Sample Acquisition Container

```bash
curl --request POST \
  --url {{DNS}}/api/rafs-ddms/v2/masterdata \
  --header 'authorization: Bearer {{ACCESS_TOKEN}}' \
  --header 'cache-control: no-store' \
  --header 'content-type: application/json' \
  --header 'data-partition-id: {{DATA_PARTITION_ID}}' \
  --data '[
  {
    "id": "{{DATA_PARTITION_ID}}:master-data--SampleContainer:COB-12A-001",
    "kind": "osdu:wks:master-data--SampleContainer:1.0.0",
    "legal": {
      "legaltags": [
        "{{DATA_PARTITION_ID}}-{{LEGAL_TAG}}"
      ],
      "otherRelevantDataCountries": [
        "IN"
      ],
      "status": "compliant"
    },
    "acl": {
      "owners": [
        "{{ACL_DATA_OWNERS}}"
      ],
      "viewers": [
        "{{ACL_DATA_VIEWERS}}"
      ]
    },
    "data": {
      "SampleContainerTypeID": "{{DATA_PARTITION_ID}}:reference-data--SampleContainerType:Box:",
      "Capacity": 10.0,
      "ContainerIdentifier": "CORE-BOX-12A",
      "OperatingConditionRating": {
        "Pressure": 200,
        "Temperature": 100
      },
      "SampleContainerServiceTypeIDs": [
        "{{DATA_PARTITION_ID}}:reference-data--SampleContainerServiceType:Hydrocarbon.Sour:"
      ]
    }
  }
]'
```

Sample response:
```JSON
{
  "recordCount": 1,
  "recordIdVersions": [
    "opendes:master-data--SampleContainer:COB-12A-001:1758005738846690"
  ],
  "skippedRecordCount": 0
}
```

### 3.5 Sample

```bash
curl --request POST \
  --url {{DNS}}/api/rafs-ddms/v2/masterdata \
  --header 'authorization: Bearer {{ACCESS_TOKEN}}' \
  --header 'cache-control: no-store' \
  --header 'content-type: application/json' \
  --header 'data-partition-id: {{DATA_PARTITION_ID}}' \
  --data '[
  {
    "id": "{{DATA_PARTITION_ID}}:master-data--Sample:KKS-CORE-PLUG-001",
    "kind": "osdu:wks:master-data--Sample:2.1.0",
    "legal": {
      "legaltags": [
        "{{DATA_PARTITION_ID}}-{{LEGAL_TAG}}"
      ],
      "otherRelevantDataCountries": [
        "IN"
      ],
      "status": "compliant"
    },
    "acl": {
      "owners": [
        "{{ACL_DATA_OWNERS}}"
      ],
      "viewers": [
        "{{ACL_DATA_VIEWERS}}"
      ]
    },
    "data": {
      "SampleAcquisition": {
        "SampleAcquisitionJobID": "{{sar_sample_acquisition_record_id}}:",
        "SampleAcquisitionDetail": {
          "VerticalMeasurement": {
            "EffectiveDateTime": "2020-02-13T09:13:15.55Z",
            "VerticalMeasurement": 12345.6,
            "TerminationDateTime": "2020-02-13T09:13:15.55Z",
            "VerticalMeasurementTypeID": "{{DATA_PARTITION_ID}}:reference-data--VerticalMeasurementType:ArbitraryPoint:",
            "VerticalMeasurementPathID": "{{DATA_PARTITION_ID}}:reference-data--VerticalMeasurementPath:MD:",
            "VerticalMeasurementSourceID": "{{DATA_PARTITION_ID}}:reference-data--VerticalMeasurementSource:DRL:",
            "VerticalMeasurementUnitOfMeasureID": "{{DATA_PARTITION_ID}}:reference-data--UnitOfMeasure:m:",
            "VerticalCRSID": "{{DATA_PARTITION_ID}}:reference-data--CoordinateReferenceSystem:BoundProjected:EPSG::32021_EPSG::15851:",
            "VerticalReferenceID": "Example VerticalReferenceID",
            "VerticalMeasurementDescription": "Example VerticalMeasurementDescription"
          },
          "TopDepth": 10000.0,
          "BaseDepth": 20000.0,
          "ToolKind": "Wireline Formation Tester",
          "RunNumber": "22",
          "WellboreID": "{{wellbore_id}}:",
          "WellheadOperatingCondition": {
            "Pressure": 1.0,
            "Temperature": 15.0
          },
          "SeparatorOperatingCondition": {
            "Pressure": 1.0,
            "Temperature": 15.0
          },
          "SamplingPoint": {
            "SamplingPointTypeID": "{{DATA_PARTITION_ID}}:reference-data--SamplingPointType:FlowPort:",
            "SamplingPointName": "VALVE:1723RR-01"
          },
          "CorrectedOilRate": 12345.6,
          "CorrectedGasRate": 12345.6,
          "CorrectedWaterRate": 12345.6,
          "MeasuredOilRate": 12345.6,
          "MeasuredGasRate": 12345.6,
          "MeasuredWaterRate": 12345.6,
          "FormationCondition": {
            "Pressure": 120,
            "Temperature": 60
          },
          "CorrectionRemarks": {
            "RemarkSequenceNumber": 1,
            "Remark": "Example Remark",
            "RemarkSource": "Example Remark Source",
            "RemarkDate": "2020-02-13"
          },
          "SampleCarrierSlotName": "Example Sample Carrier Slot Name",
          "ToolSectionName": "Example Tool Section Name",
          "SampleContainerCushionPressure": 12345.6,
          "GrossFluidKindID": "{{DATA_PARTITION_ID}}:reference-data--WellProductType:Gas:",
          "FacilityEquipmentOperatingCondition": {
            "Pressure": 1.0,
            "Temperature": 15.0
          },
          "SiteID": "{{sar_generic_site_record_id}}:",
          "SampleRecoveredLengthActual": 12345.6,
          "PreservationTypeID": "{{DATA_PARTITION_ID}}:reference-data--CorePreservationType:ClingWrap:",
          "SampleRecoveredLengthPlanned": 12345.6,
          "AcquisitionCondition": {
            "Pressure": 120,
            "Temperature": 60
          },
          "AcquisitionGOR": 340.0,
          "MudBaseTypeID": "{{DATA_PARTITION_ID}}:reference-data--MudBaseType:Brine:",
          "MudTracerTypeID": "{{DATA_PARTITION_ID}}:reference-data--MudTracerType:ChemicalTracer:"
        },
        "SampleAcquisitionTypeID": "{{DATA_PARTITION_ID}}:reference-data--SampleAcquisitionType:DownholeSampleAcquisition:",
        "SampleAcquisitionContainerID": "{{sar_sample_container_record_id}}:",
        "AcquisitionStartDate": "2023-01-01T12:00:00Z",
        "AcquisitionEndDate": "2023-01-01T12:00:00Z",
        "Remarks": [
          {
            "RemarkSequenceNumber": 1,
            "Remark": "Example Remark",
            "RemarkSource": "Example Remark Source",
            "RemarkDate": "2020-02-13"
          }
        ],
        "CollectionServiceCompanyID": "{{organisation_id}}:",
        "HandlingServiceCompanyID": "{{organisation_id}}:"
      }
    }
  }
]'
```

Sample response:
```JSON
{
  "recordCount": 1,
  "recordIdVersions": [
    "opendes:master-data--Sample:KKS-CORE-PLUG-001:1758005744573136"
  ],
  "skippedRecordCount": 0
}
```

### 3.6 Sample Chain of Custody Event
```bash
curl --request POST \
  --url {{DNS}}/api/rafs-ddms/v2/masterdata \
  --header 'authorization: Bearer {{ACCESS_TOKEN}}' \
  --header 'cache-control: no-store' \
  --header 'content-type: application/json' \
  --header 'data-partition-id: {{DATA_PARTITION_ID}}' \
  --data '[
  {
    "id": "{{DATA_PARTITION_ID}}:master-data--SampleChainOfCustodyEvent:KKS-TRANSFER-001",
    "kind": "osdu:wks:master-data--SampleChainOfCustodyEvent:1.0.0",
    "legal": {
      "legaltags": [
        "{{DATA_PARTITION_ID}}-{{LEGAL_TAG}}"
      ],
      "otherRelevantDataCountries": [
        "IN"
      ],
      "status": "compliant"
    },
    "acl": {
      "owners": [
        "{{ACL_DATA_OWNERS}}"
      ],
      "viewers": [
        "{{ACL_DATA_VIEWERS}}"
      ]
    },
    "data": {
      "Name": "Example Name",
      "TransferCondition": {
        "Pressure": 100,
        "Temperature": 60
      },
      "OpeningCondition": {
        "Pressure": 100,
        "Temperature": 60
      },
      "ClosingCondition": {
        "Pressure": 100,
        "Temperature": 60
      },
      "CustodyDate": "2022-01-01T10:00:00",
      "CustodyEventTypeID": "{{DATA_PARTITION_ID}}:reference-data--CustodyEventType:SampleTransfer:",
      "Custodian": "Harris A.",
      "PreviousStorageLocation": {
        "StorageLocationDescription": "Example StorageLocationDescription",
        "StorageOrganisationID": "{{organisation_id}}:",
        "EffectiveDateTime": "2020-02-13",
        "TerminationDateTime": "2020-02-13",
        "SampleIdentifier": "Example SampleIdentifier"
      },
      "CurrentStorageLocation": {
        "StorageLocationDescription": "Example StorageLocationDescription",
        "StorageOrganisationID": "{{organisation_id}}:",
        "EffectiveDateTime": "2020-02-13",
        "TerminationDateTime": "2020-02-13",
        "SampleIdentifier": "Example SampleIdentifier"
      },
      "CustodyEventLocationID": "{{organisation_id}}:",
      "CurrentContainerID": "{{sar_sample_container_record_id}}:",
      "Remarks": [
        {
          "Remark": "Transfer process resulted in lost volume.",
          "RemarkSource": "Lab Analyst 1"
        }
      ],
      "SampleID": "{{sample_record_id}}:"
    }
  }
]'
```

Sample response:
```JSON
{
  "recordCount": 1,
  "recordIdVersions": [
    "opendes:master-data--SampleChainOfCustodyEvent:KKS-TRANSFER-001:1758005749904118"
  ],
  "skippedRecordCount": 0
}
```

## 4. Ingest Sample Analysis Report

### 4.1 Create a new Sample Analysis Report
```bash
curl --request POST \
  --url {{DNS}}/api/rafs-ddms/v2/samplesanalysesreport \
  --header 'authorization: Bearer {{ACCESS_TOKEN}}' \
  --header 'content-type: application/json' \
  --header 'data-partition-id: {{DATA_PARTITION_ID}}' \
  --data '[
  {
    "id": "{{DATA_PARTITION_ID}}:work-product-component--SamplesAnalysesReport:KKS1",
    "kind": "{{AUTHORITY}}:wks:work-product-component--SamplesAnalysesReport:1.0.0",
    "acl": {
      "viewers": [
        "{{ACL_DATA_VIEWERS}}"
      ],
      "owners": [
        "{{ACL_DATA_OWNERS}}"
      ]
    },
    "legal": {
      "legaltags": [
        "{{DATA_PARTITION_ID}}-{{LEGAL_TAG}}"
      ],
      "otherRelevantDataCountries": [
        "IN"
      ],
      "status": "compliant"
    },
    "tags": {
      "NameOfKey": "String value"
    },
    "meta": [],
    "data": {
      "DocumentTypeID": "{{DATA_PARTITION_ID}}:reference-data--DocumentType:SampleAnalysisReport:",
      "NumberOfPages": 210,
      "SubTitle": "An Advanced Rock Properties Study Of Selected Samples From Well: KENTISH KNOCK SOUTH 1",
      "DocumentSubject": "Special Core Analysis Results Report (Final)",
      "DatePublished": "2020-12-16T11:46:20.163Z",
      "DateModified": "2020-12-16T11:46:20.163Z",
      "DocumentLanguage": "English",
      "SampleIDs": [
        "{{sample_record_id}}:"
      ],
      "ReportSampleIdentifiers": [
        "48B"
      ],
      "SampleAnalysisTypeIDs": [
        "{{DATA_PARTITION_ID}}:reference-data--SampleAnalysisType:RelativePermeability.SteadyState:",
        "{{DATA_PARTITION_ID}}:reference-data--SampleAnalysisType:NMR:",
        "{{DATA_PARTITION_ID}}:reference-data--SampleAnalysisType:ElectricalProperties.FormationResistivityFactor:"
      ],
      "SamplesAnalysisCategoryTagIDs": [
        "{{DATA_PARTITION_ID}}:reference-data--SamplesAnalysisCategoryTag:GreenCompany.SCAL:"
      ],
      "Remarks": [
        {
          "Remark": "RelativePermeability, page 105",
          "RemarkSequenceNumber": 1,
          "RemarkSource": "CoreLab"
        },
        {
          "Remark": "NMR, page 91",
          "RemarkSequenceNumber": 1,
          "RemarkSource": "CoreLab"
        }
      ],
      "LaboratoryIDs": [
        "{{organisation_id}}:"
      ],
      "LaboratoryNames": [
        "Core Laboratories"
      ]
    }
  }
]'
```

Sample response:
```JSON
{
  "recordCount": 1,
  "recordIdVersions": [
    "opendes:work-product-component--SamplesAnalysesReport:KKS1:1758005756819109"
  ],
  "skippedRecordCount": 0
}
```

### 4.2 Get the Sample Analysis Report record
To retrieve a report, use `GET /api/rafs-ddms/v2/samplesanalysesreport/{reportId}`

```bash
curl --request GET \
  --url {{DNS}}/api/rafs-ddms/v2/samplesanalysesreport/{{report_id}} \
  --header 'authorization: Bearer {{ACCESS_TOKEN}}' \
  --header 'cache-control: no-store' \
  --header 'content-type: application/json' \
  --header 'data-partition-id: {{DATA_PARTITION_ID}}'
```

```JSON
{
  "data": {
    "DocumentTypeID": "opendes:reference-data--DocumentType:SampleAnalysisReport:",
    "NumberOfPages": 210,
    "SubTitle": "An Advanced Rock Properties Study Of Selected Samples From Well: KENTISH KNOCK SOUTH 1",
    "DocumentSubject": "Special Core Analysis Results Report (Final)",
    "DatePublished": "2020-12-16T11:46:20.163Z",
    "DateModified": "2020-12-16T11:46:20.163Z",
    "DocumentLanguage": "English",
    "SampleIDs": [
      "opendes:master-data--Sample:KKS-CORE-PLUG-001:"
    ],
    "ReportSampleIdentifiers": [
      "48B"
    ],
    "SampleAnalysisTypeIDs": [
      "opendes:reference-data--SampleAnalysisType:RelativePermeability.SteadyState:",
      "opendes:reference-data--SampleAnalysisType:NMR:",
      "opendes:reference-data--SampleAnalysisType:ElectricalProperties.FormationResistivityFactor:"
    ],
    "SamplesAnalysisCategoryTagIDs": [
      "opendes:reference-data--SamplesAnalysisCategoryTag:GreenCompany.SCAL:"
    ],
    "Remarks": [
      {
        "Remark": "RelativePermeability, page 105",
        "RemarkSequenceNumber": 1,
        "RemarkSource": "CoreLab"
      },
      {
        "Remark": "NMR, page 91",
        "RemarkSequenceNumber": 1,
        "RemarkSource": "CoreLab"
      }
    ],
    "LaboratoryIDs": [
      "opendes:master-data--Organisation:CoreLabs-IN:"
    ],
    "LaboratoryNames": [
      "Core Laboratories"
    ]
  },
  "meta": [],
  "modifyUser": "89a1a081-3783-4824-88f9-e2b97d602d52",
  "modifyTime": "2025-09-16T06:55:56.839Z",
  "id": "opendes:work-product-component--SamplesAnalysesReport:KKS1",
  "version": 1758005756819109,
  "kind": "osdu:wks:work-product-component--SamplesAnalysesReport:1.0.0",
  "acl": {
    "viewers": [
      "data.default.viewers@opendes.dataservices.energy"
    ],
    "owners": [
      "data.default.owners@opendes.dataservices.energy"
    ]
  },
  "legal": {
    "legaltags": [
      "opendes-osdu-rafs-ddms-demo-legal-tag"
    ],
    "otherRelevantDataCountries": [
      "IN"
    ],
    "status": "compliant"
  },
  "tags": {
    "NameOfKey": "String value"
  },
  "createUser": "89a1a081-3783-4824-88f9-e2b97d602d52",
  "createTime": "2025-09-15T11:04:40.310Z"
}
```

### 4.3 Get all the Sample Analysis Report versions
To list all versions, use `GET /api/rafs-ddms/v2/samplesanalysesreport/{record_id}/versions`

```bash
curl --request GET \
  --url {{DNS}}/api/rafs-ddms/v2/samplesanalysesreport/{{record_id}}/versions \
  --header 'authorization: Bearer {{ACCESS_TOKEN}}' \
  --header 'content-type: application/json' \
  --header 'data-partition-id: {{DATA_PARTITION_ID}}'
```

Sample response:
```JSON
{
  "recordId": "opendes:work-product-component--SamplesAnalysesReport:KKS1",
  "versions": [
    1757934280081250,
    1757940413848125,
    1757996685957604,
    1758004251045884,
    1758004420706401,
    1758005756819109
  ]
}
```

### 4.4 Get a specific version of the Sample Analysis Report
To get a specific version, use `GET /api/rafs-ddms/v2/samplesanalysesreport/{record_id}/versions/{version}`


```bash
curl --request GET \
  --url {{DNS}}/api/rafs-ddms/v2/samplesanalysesreport/{{record_id}}/versions/{{version}} \
  --header 'authorization: Bearer {{ACCESS_TOKEN}}' \
  --header 'cache-control: no-store' \
  --header 'content-type: application/json' \
  --header 'data-partition-id: {{DATA_PARTITION_ID}}'
```

Sample response:
```JSON
{
  "data": {
    "DocumentTypeID": "opendes:reference-data--DocumentType:SampleAnalysisReport:",
    "NumberOfPages": 210,
    "SubTitle": "An Advanced Rock Properties Study Of Selected Samples From Well: KENTISH KNOCK SOUTH 1",
    "DocumentSubject": "Special Core Analysis Results Report (Final)",
    "DatePublished": "2020-12-16T11:46:20.163Z",
    "DateModified": "2020-12-16T11:46:20.163Z",
    "DocumentLanguage": "English",
    "SampleIDs": [
      "opendes:master-data--Sample:KKS-CORE-PLUG-001:"
    ],
    "ReportSampleIdentifiers": [
      "48B"
    ],
    "SampleAnalysisTypeIDs": [
      "opendes:reference-data--SampleAnalysisType:RelativePermeability.SteadyState:",
      "opendes:reference-data--SampleAnalysisType:NMR:",
      "opendes:reference-data--SampleAnalysisType:ElectricalProperties.FormationResistivityFactor:"
    ],
    "SamplesAnalysisCategoryTagIDs": [
      "opendes:reference-data--SamplesAnalysisCategoryTag:GreenCompany.SCAL:"
    ],
    "Remarks": [
      {
        "Remark": "RelativePermeability, page 105",
        "RemarkSequenceNumber": 1,
        "RemarkSource": "CoreLab"
      },
      {
        "Remark": "NMR, page 91",
        "RemarkSequenceNumber": 1,
        "RemarkSource": "CoreLab"
      }
    ],
    "LaboratoryIDs": [
      "opendes:master-data--Organisation:CoreLabs-IN:"
    ],
    "LaboratoryNames": [
      "Core Laboratories"
    ]
  },
  "meta": [],
  "modifyUser": "89a1a081-3783-4824-88f9-e2b97d602d52",
  "modifyTime": "2025-09-16T06:55:56.839Z",
  "id": "opendes:work-product-component--SamplesAnalysesReport:KKS1",
  "version": 1758005756819109,
  "kind": "osdu:wks:work-product-component--SamplesAnalysesReport:1.0.0",
  "acl": {
    "viewers": [
      "data.default.viewers@opendes.dataservices.energy"
    ],
    "owners": [
      "data.default.owners@opendes.dataservices.energy"
    ]
  },
  "legal": {
    "legaltags": [
      "opendes-osdu-rafs-ddms-demo-legal-tag"
    ],
    "otherRelevantDataCountries": [
      "IN"
    ],
    "status": "compliant"
  },
  "tags": {
    "NameOfKey": "String value"
  },
  "createUser": "89a1a081-3783-4824-88f9-e2b97d602d52",
  "createTime": "2025-09-15T11:04:40.310Z"
}
```

## 5. Ingest Sample Analysis

### 5.1 Create a sample analysis record
To create a new analysis, use `POST /api/rafs-ddms/v2/samplesanalysis`

```bash
curl --request POST \
  --url {{DNS}}/api/rafs-ddms/v2/samplesanalysis \
  --header 'authorization: Bearer {{ACCESS_TOKEN}}' \
  --header 'content-type: application/json' \
  --header 'data-partition-id: {{DATA_PARTITION_ID}}' \
  --data '[
  {
    "kind": "{{AUTHORITY}}:wks:work-product-component--SamplesAnalysis:1.0.0",
    "acl": {
      "viewers": [
        "{{ACL_DATA_VIEWERS}}"
      ],
      "owners": [
        "{{ACL_DATA_OWNERS}}"
      ]
    },
    "legal": {
      "legaltags": [
        "{{DATA_PARTITION_ID}}-{{LEGAL_TAG}}"
      ],
      "otherRelevantDataCountries": [
        "IN"
      ],
      "status": "compliant"
    },
    "tags": {
      "NameOfKey": "String value"
    },
    "data": {
      "SampleIDs": [
        "{{sample_record_id}}:"
      ],
      "ReportSampleIdentifiers": [
        "53B"
      ],
      "AnalysisDate": "2015-01-01",
      "LaboratoryIDs": [
        "{{organisation_id}}:"
      ],
      "LaboratoryNames": [
        "TestLab"
      ],
      "Remarks": [
        {
          "Remark": "Kentish Knock South 1 - Special Core Analysis (SCAL) Report, Section 6.2 Page 91, 92",
          "RemarkSequenceNumber": 1,
          "RemarkSource": "RAFSDDMS",
          "RemarkDate": "2023-12-21"
        }
      ],
      "DatePublished": "2015-01-01",
      "ParentSamplesAnalysesReports": [
        {
          "ParentSamplesAnalysesReportID": "{{sar_record_id}}:"
        }
      ],
      "SampleAnalysisTypeIDs": [
        "{{DATA_PARTITION_ID}}:reference-data--SampleAnalysisType:NMR:"
      ],
      "SamplesAnalysisCategoryTagIDs": [
        "{{DATA_PARTITION_ID}}:reference-data--SamplesAnalysisCategoryTag:GreenCompany.SCAL:"
      ],
      "AvailableSampleAnalysisProperties": [
        "SamplesAnalysisID",
        "SampleID",
        "CumulativeWaterSaturation",
        "T2FullySaturated",
        "IncrementalPorosity",
        "DisplacedFluid",
        "EchoSpacing",
        "InjectedFluid",
        "Porosity",
        "Permeability",
        "NMRT2Swirr",
        "T2CutOff",
        "T2Mean",
        "Temperature",
        "PoreVolume",
        "NetConfiningStress"
      ],
      "DDMSDatasets": [],
      "Parameters": []
    }
  }
]'
```

Sample response:
```JSON
{
  "recordCount": 1,
  "recordIdVersions": [
    "opendes:work-product-component--SamplesAnalysis:1c022fcfa0134607b7c3dbc26f8783cf:1758005811171994"
  ],
  "skippedRecordCount": 0
}
```

### 5.2 Get the content schema
To get content schema, use `GET /api/rafs-ddms/v2/samplesanalysis/{analysistype}/data/schema`


```bash
curl --request GET \
  --url {{DNS}}/api/rafs-ddms/v2/samplesanalysis/nmr/data/schema \
  --header 'accept: */*;version={{rafsddms-content-schema-version}}' \
  --header 'authorization: Bearer {{ACCESS_TOKEN}}' \
  --header 'cache-control: no-store' \
  --header 'content-type: application/json' \
  --header 'data-partition-id: {{DATA_PARTITION_ID}}'
```

Sample response:
```JSON
{
  "title": "NmrModel100",
  "type": "object",
  "properties": {
    "SamplesAnalysisID": {
      "title": "Samples Analysis ID",
      "description": "The OSDU Identifier for this SamplesAnalysis.",
      "pattern": "^[\\w\\-\\.]+:work-product-component\\-\\-SamplesAnalysis:[\\w\\-\\.\\:\\%]+:[0-9]*$",
      "type": "string"
    },
    "SampleID": {
      "title": "Sample ID",
      "description": "The OSDU Identifier for the Sample associated with this analysis.",
      "pattern": "^[\\w\\-\\.]+:master-data\\-\\-Sample:[\\w\\-\\.\\:\\%]+:[0-9]*$",
      "type": "string"
    },
    "Meta": {
      "title": "Meta",
      "description": "A meta data item, which allows the association of named properties or property values to a Unit/Measurement/CRS/Azimuth/Time context.",
      "example": "",
      "type": "array",
      "items": {
        "anyOf": [
          {
            "$ref": "#/definitions/Meta"
          },
          {
            "$ref": "#/definitions/Meta1"
          },
          {
            "$ref": "#/definitions/Meta2"
          },
          {
            "$ref": "#/definitions/Meta3"
          }
        ]
      }
    },
    "NMRTest": {
      "title": "NMR Test",
      "description": "An analysis of rock or fluid samples using Nuclear Magnetic Resonance to assess various properties, including fluid content and pore structure.",
      "type": "array",
      "items": {
        "$ref": "#/definitions/NMRTestItem"
      }
    }
  },
  "required": [
    "SamplesAnalysisID",
    "SampleID",
    "Meta"
  ],
  "additionalProperties": false,
  "definitions": {
    "Meta": {
      "title": "Meta",
      "type": "object",
      "properties": {
        "kind": {
          "title": "UOM Reference Kind",
          "description": "The kind of reference, 'Unit' for FrameOfReferenceUOM.",
          "default": "Unit",
          "const": "Unit",
          "type": "string"
        },
        "name": {
          "title": "UOM Unit Symbol",
          "description": "The unit symbol or name of the unit.",
          "example": "ft[US]",
          "type": "string"
        },
        "persistableReference": {
          "title": "UOM Persistable Reference",
          "description": "The self-contained, persistable reference string uniquely identifying the Unit.",
          "example": "{\"abcd\":{\"a\":0.0,\"b\":1200.0,\"c\":3937.0,\"d\":0.0},\"symbol\":\"ft[US]\",\"baseMeasurement\":{\"ancestry\":\"L\",\"type\":\"UM\"},\"type\":\"UAD\"}",
          "type": "string"
        },
        "unitOfMeasureID": {
          "title": "Unitofmeasureid",
          "description": "SRN to unit of measure reference.",
          "example": "namespace:reference-data--UnitOfMeasure:ftUS:",
          "pattern": "^[\\w\\-\\.]+:reference-data\\-\\-UnitOfMeasure:[\\w\\-\\.\\:\\%]+:[0-9]*$",
          "type": "string"
        },
        "propertyNames": {
          "title": "UOM Property Names",
          "description": "The list of property names, to which this meta data item provides Unit context to. A full path like \"StructureA.PropertyB\" is required to define a unique context; \"data\" is omitted since frame-of reference normalization only applies to the data block.",
          "example": [
            "HorizontalDeflection.EastWest",
            "HorizontalDeflection.NorthSouth"
          ],
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      },
      "additionalProperties": false
    },
    "Meta1": {
      "title": "Meta1",
      "type": "object",
      "properties": {
        "kind": {
          "title": "CRS Reference Kind",
          "description": "The kind of reference, constant 'CRS' for FrameOfReferenceCRS.",
          "default": "CRS",
          "const": "CRS",
          "type": "string"
        },
        "name": {
          "title": "CRS Name",
          "description": "The name of the CRS.",
          "example": "WGS 84 / UTM zone 15N",
          "type": "string"
        },
        "persistableReference": {
          "title": "CRS Persistable Reference",
          "description": "The self-contained, persistable reference string uniquely identifying the CRS.",
          "example": "{\"authCode\":{\"auth\":\"EPSG\",\"code\":\"32615\"},\"name\":\"WGS_1984_UTM_Zone_15N\",\"type\":\"LBC\",\"ver\":\"PE_10_9_1\",\"wkt\":\"PROJCS[\\\"WGS_1984_UTM_Zone_15N\\\",GEOGCS[\\\"GCS_WGS_1984\\\",DATUM[\\\"D_WGS_1984\\\",SPHEROID[\\\"WGS_1984\\\",6378137.0,298.257223563]],PRIMEM[\\\"Greenwich\\\",0.0],UNIT[\\\"Degree\\\",0.0174532925199433]],PROJECTION[\\\"Transverse_Mercator\\\"],PARAMETER[\\\"False_Easting\\\",500000.0],PARAMETER[\\\"False_Northing\\\",0.0],PARAMETER[\\\"Central_Meridian\\\",-93.0],PARAMETER[\\\"Scale_Factor\\\",0.9996],PARAMETER[\\\"Latitude_Of_Origin\\\",0.0],UNIT[\\\"Meter\\\",1.0],AUTHORITY[\\\"EPSG\\\",32615]]\"}",
          "type": "string"
        },
        "coordinateReferenceSystemID": {
          "title": "Coordinatereferencesystemid",
          "description": "SRN to CRS reference.",
          "example": "namespace:reference-data--CoordinateReferenceSystem:Projected:EPSG::32615:",
          "pattern": "^[\\w\\-\\.]+:reference-data\\-\\-CoordinateReferenceSystem:[\\w\\-\\.\\:\\%]+:[0-9]*$",
          "type": "string"
        },
        "propertyNames": {
          "title": "CRS Property Names",
          "description": "The list of property names, to which this meta data item provides CRS context to. A full path like \"StructureA.PropertyB\" is required to define a unique context; \"data\" is omitted since frame-of reference normalization only applies to the data block.",
          "example": [
            "KickOffPosition.X",
            "KickOffPosition.Y"
          ],
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      },
      "required": [
        "persistableReference"
      ],
      "additionalProperties": false
    },
    "Meta2": {
      "title": "Meta2",
      "type": "object",
      "properties": {
        "kind": {
          "title": "DateTime Reference Kind",
          "description": "The kind of reference, constant 'DateTime', for FrameOfReferenceDateTime.",
          "default": "DateTime",
          "const": "DateTime",
          "type": "string"
        },
        "name": {
          "title": "DateTime Name",
          "description": "The name of the DateTime format and reference.",
          "example": "UTC",
          "type": "string"
        },
        "persistableReference": {
          "title": "DateTime Persistable Reference",
          "description": "The self-contained, persistable reference string uniquely identifying DateTime reference.",
          "example": "{\"format\":\"yyyy-MM-ddTHH:mm:ssZ\",\"timeZone\":\"UTC\",\"type\":\"DTM\"}",
          "type": "string"
        },
        "propertyNames": {
          "title": "DateTime Property Names",
          "description": "The list of property names, to which this meta data item provides DateTime context to. A full path like \"StructureA.PropertyB\" is required to define a unique context; \"data\" is omitted since frame-of reference normalization only applies to the data block.",
          "example": [
            "Acquisition.StartTime",
            "Acquisition.EndTime"
          ],
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      },
      "required": [
        "persistableReference"
      ],
      "additionalProperties": false
    },
    "Meta3": {
      "title": "Meta3",
      "type": "object",
      "properties": {
        "kind": {
          "title": "AzimuthReference Reference Kind",
          "description": "The kind of reference, constant 'AzimuthReference', for FrameOfReferenceAzimuthReference.",
          "default": "AzimuthReference",
          "const": "AzimuthReference",
          "type": "string"
        },
        "name": {
          "title": "AzimuthReference Name",
          "description": "The name of the CRS or the symbol/name of the unit.",
          "example": "TrueNorth",
          "type": "string"
        },
        "persistableReference": {
          "title": "AzimuthReference Persistable Reference",
          "description": "The self-contained, persistable reference string uniquely identifying AzimuthReference.",
          "example": "{\"code\":\"TrueNorth\",\"type\":\"AZR\"}",
          "type": "string"
        },
        "propertyNames": {
          "title": "AzimuthReference Property Names",
          "description": "The list of property names, to which this meta data item provides AzimuthReference context to. A full path like \"StructureA.PropertyB\" is required to define a unique context; \"data\" is omitted since frame-of reference normalization only applies to the data block.",
          "example": [
            "Bearing"
          ],
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      },
      "required": [
        "persistableReference"
      ],
      "additionalProperties": false
    },
    "CumulativePorosity": {
      "title": "CumulativePorosity",
      "type": "object",
      "properties": {
        "Value": {
          "title": "Value",
          "description": "The porosity value of the sample.",
          "type": "number"
        },
        "PorosityMeasurementTypeID": {
          "title": "Porosity Measurement Type ID",
          "description": "The type of porosity being measured, e.g. BrineSaturation, HeliumInjection.",
          "pattern": "^[\\w\\-\\.]+:reference-data\\-\\-PorosityMeasurementType:[\\w\\-\\.\\:\\%]+:[0-9]*$",
          "type": "string"
        }
      },
      "additionalProperties": false
    },
    "IncrementalPorosity": {
      "title": "IncrementalPorosity",
      "type": "object",
      "properties": {
        "Value": {
          "title": "Value",
          "description": "The porosity value.",
          "type": "number"
        },
        "PorosityMeasurementTypeID": {
          "title": "Porosity Measurement Type ID",
          "description": "The type of porosity being measured, e.g. BrineSaturation, HeliumInjection.",
          "pattern": "^[\\w\\-\\.]+:reference-data\\-\\-PorosityMeasurementType:[\\w\\-\\.\\:\\%]+:[0-9]*$",
          "type": "string"
        }
      },
      "additionalProperties": false
    },
    "NMRTestStep": {
      "title": "NMRTestStep",
      "type": "object",
      "properties": {
        "CumulativeWaterSaturation": {
          "title": "Cumulative Water Saturation",
          "description": "Cumulative water saturation",
          "type": "number"
        },
        "CumulativeVolume": {
          "title": "Cumulative Volume",
          "description": "Cumulative volume of fluid calculated based on amplitude measurement.",
          "type": "number"
        },
        "CumulativePorosity": {
          "title": "Cumulative Porosity",
          "description": "Cumulative porosity of the sample.",
          "allOf": [
            {
              "$ref": "#/definitions/CumulativePorosity"
            }
          ]
        },
        "IncrementalWaterSaturation": {
          "title": "Incremental Water Saturation",
          "description": "Water saturation increment for this test step.",
          "type": "number"
        },
        "IncrementalPorosity": {
          "title": "Incremental Porosity",
          "description": "Incremental porosity of the sample.",
          "allOf": [
            {
              "$ref": "#/definitions/IncrementalPorosity"
            }
          ]
        },
        "IncrementalVolume": {
          "title": "Incremental Volume",
          "description": "Incremental volume of fluid calculated based on amplitude measurement.",
          "type": "number"
        },
        "T2FullySaturated": {
          "title": "T2 Fully Saturated",
          "description": "T2 (transverse or spin-spin relaxation) when the sample is fully saturated.",
          "type": "number"
        },
        "T2PartiallySaturated": {
          "title": "T2 Partially Saturated",
          "description": "T2 (transverse or spin-spin relaxation) when the sample is partially saturated.",
          "type": "number"
        },
        "T1CumulativePorosity": {
          "title": "T1 Cumulative Porosity",
          "description": "Cumulative porosity of the sample based on T1.",
          "type": "number"
        },
        "T1CumulativeWaterSaturation": {
          "title": "T1 Cumulative Water Saturation",
          "description": "Cumulative water saturation of the sample based on T1.",
          "type": "number"
        },
        "T1IncrementalPorosity": {
          "title": "T1 Incremental Porosity",
          "description": "Incremental porosity of the sample based on T1.",
          "type": "number"
        },
        "T1IncrementalWaterSaturation": {
          "title": "T1 Incremental Water Saturation",
          "description": "Incremental water saturation of the sample based on T1.",
          "type": "number"
        }
      },
      "additionalProperties": false
    },
    "PorosityItem": {
      "title": "PorosityItem",
      "type": "object",
      "properties": {
        "Value": {
          "title": "Value",
          "description": "The porosity value.",
          "type": "number"
        },
        "PorosityMeasurementTypeID": {
          "title": "Porosity Measurement Type ID",
          "description": "The classification of porosity measured in the NMR test, which could be based on the method of measurement or the characteristics of the pore spaces.",
          "pattern": "^[\\w\\-\\.]+:reference-data\\-\\-PorosityMeasurementType:[\\w\\-\\.\\:\\%]+:[0-9]*$",
          "type": "string"
        }
      },
      "additionalProperties": false
    },
    "PermeabilityItem": {
      "title": "PermeabilityItem",
      "type": "object",
      "properties": {
        "Value": {
          "title": "Value",
          "type": "number"
        },
        "PermeabilityMeasurementTypeID": {
          "title": "Permeability Measurement Type ID",
          "description": "The type of permeability being measured, e.g. Gas, PulseDecay, Klinkenberg.",
          "pattern": "^[\\w\\-\\.]+:reference-data\\-\\-PermeabilityMeasurementType:[\\w\\-\\.\\:\\%]+:[0-9]*$",
          "type": "string"
        }
      },
      "additionalProperties": false
    },
    "NMRSummaryData": {
      "title": "NMRSummaryData",
      "type": "object",
      "properties": {
        "BoundFluidBVI": {
          "title": "Bound Fluid BVI",
          "description": "Bound fluid following sample desaturation, relative to pore volume.",
          "type": "number"
        },
        "NMRT2BoundFluidRelativetoPoreVolume": {
          "title": "NMRT2BoundFluidRelativetoPoreVolume",
          "description": "NMR T2 bound fluid relative to pore volume.",
          "type": "number"
        },
        "DisplacedFluidID": {
          "title": "Displaced Fluid ID",
          "description": "The type of fluid displaced during the NMR test, which can influence the interpretation of pore and fluid properties.",
          "pattern": "^[\\w\\-\\.]+:reference-data\\-\\-DisplacedFluidType:[\\w\\-\\.\\:\\%]+:[0-9]*$",
          "type": "string"
        },
        "EchoSpacing": {
          "title": "Echo Spacing",
          "description": "The time interval between successive echoes in a sequence of pulse and acquisition events.",
          "type": "number"
        },
        "FreeFluidFFI": {
          "title": "Free Fluid FFI",
          "description": "Free fluid following sample desaturation, relative to pore volume.",
          "type": "number"
        },
        "NMRT2FreeFluid": {
          "title": "NMR T2 Free Fluid",
          "description": "The amount of NMR T2 free fluid expressed relative to pore volume.",
          "type": "number"
        },
        "InjectionFluidID": {
          "title": "Injected Fluid ID",
          "description": "The type of fluid injected into the sample during the NMR test, used to assess how different fluids affect the sample's magnetic resonance properties.",
          "pattern": "^[\\w\\-\\.]+:reference-data\\-\\-SampleInjectionFluidType:[\\w\\-\\.\\:\\%]+:[0-9]*$",
          "type": "string"
        },
        "Porosity": {
          "title": "Porosity",
          "description": "The amount of pore space relative to the volume of a sample.",
          "type": "array",
          "items": {
            "$ref": "#/definitions/PorosityItem"
          }
        },
        "Permeability": {
          "title": "Permeability",
          "description": "The permeability of the sample as determined by the NMR test, reflecting the ability of fluids to flow through the rock or material.",
          "type": "array",
          "items": {
            "$ref": "#/definitions/PermeabilityItem"
          }
        },
        "Swirr": {
          "title": "Irreducible Water Saturation",
          "description": "The irreducible water saturation relative to pore volume of the sample.",
          "type": "number"
        },
        "NMRT2Swirr": {
          "title": "NMR T2 Irreducible Water Saturation",
          "description": "NMR T2 irreducible water saturation relative to pore volume of the sample.",
          "type": "number"
        },
        "T2CutOff": {
          "title": "T2 Cut Off",
          "description": "Cut off of transverse relaxation time (T2).",
          "type": "number"
        },
        "T2Mean": {
          "title": "T2 Mean",
          "description": "Average of T2 relaxation time.",
          "type": "number"
        },
        "Temperature": {
          "title": "Temperature",
          "description": "The temperature of the test environment.",
          "type": "number"
        },
        "PoreVolume": {
          "title": "Pore Volume",
          "description": "The pore volume of the sample.",
          "type": "number"
        },
        "NetConfiningStress": {
          "title": "Net Confining Stress",
          "description": "The pressure exerted on a sample from its environment, minus the pore pressure within the sample.",
          "type": "number"
        }
      },
      "additionalProperties": false
    },
    "NMRTestItem": {
      "title": "NMRTestItem",
      "type": "object",
      "properties": {
        "TestConditionID": {
          "title": "Test Condition ID",
          "description": "The sample condition at which the NMR test was conducted.",
          "pattern": "^[\\w\\-\\.]+:reference-data\\-\\-NMRTestCondition:[\\w\\-\\.\\:\\%]+:[0-9]*$",
          "type": "string"
        },
        "NMRTestSteps": {
          "title": "NMR Test Steps",
          "description": "An array capturing the individual test steps for this NMR analysis.",
          "type": "array",
          "items": {
            "$ref": "#/definitions/NMRTestStep"
          }
        },
        "NMRSummaryData": {
          "title": "NMR Summary Data",
          "description": "A summary of results from the NMR test, providing key metrics and findings related to the analysis.",
          "allOf": [
            {
              "$ref": "#/definitions/NMRSummaryData"
            }
          ]
        }
      },
      "additionalProperties": false
    }
  }
}
```

### 5.3 Add data to the sample analysis
To add data, use `POST /api/rafs-ddms/v2/samplesanalysis/{record_id}/data/{analysistype}`

```bash
curl --request POST \
  --url {{DNS}}/api/rafs-ddms/v2/samplesanalysis/opendes:work-product-component--SamplesAnalysis:1c022fcfa0134607b7c3dbc26f8783cf/data/nmr \
  --header 'accept: */*;version={{rafsddms-content-schema-version}}' \
  --header 'authorization: Bearer {{ACCESS_TOKEN}}' \
  --header 'content-type: application/json' \
  --header 'data-partition-id: {{DATA_PARTITION_ID}}' \
  --data '{
    "columns": [
        "SamplesAnalysisID",
        "SampleID",
        "Meta",
        "NMRTest"
    ],
    "index": [
        0
    ],
    "data": [
        [
            "{{nmr_record_id}}:",
            "{{sample_record_id}}:",
            [
                {
                    "kind": "Unit",
                    "name": "degree Fahrenheit",
                    "unitOfMeasureID": "{{DATA_PARTITION_ID}}:reference-data--UnitOfMeasure:degF:",
                    "propertyNames": [
                        "NMRSummaryData.Temperature"
                    ]
                },
                {
                    "kind": "Unit",
                    "name": "pound-force per square inch",
                    "unitOfMeasureID": "{{DATA_PARTITION_ID}}:reference-data--UnitOfMeasure:psi:",
                    "propertyNames": [
                        "NMRSummaryData.NetConfiningStress"
                    ]
                },
                {
                    "kind": "Unit",
                    "name": "millidarcy",
                    "unitOfMeasureID": "{{DATA_PARTITION_ID}}:reference-data--UnitOfMeasure:mD:",
                    "propertyNames": [
                        "NMRSummaryData.Permeability.Value"
                    ]
                },
                {
                    "kind": "Unit",
                    "name": "cubic centimetre",
                    "unitOfMeasureID": "{{DATA_PARTITION_ID}}:reference-data--UnitOfMeasure:cm3:",
                    "propertyNames": [
                        "NMRTestSteps[*].CumulativeVolume",
                        "NMRTestSteps[*].IncrementalVolume",
                        "NMRSummaryData.BoundFluidBVI",
                        "NMRSummaryData.PoreVolume"
                    ]
                },
                {
                    "kind": "Unit",
                    "name": "centimetre",
                    "unitOfMeasureID": "{{DATA_PARTITION_ID}}:reference-data--UnitOfMeasure:cm:",
                    "propertyNames": [
                        "NMRSummaryData.EchoSpacing"
                    ]
                },
                {
                    "kind": "Unit",
                    "name": "milliseconds",
                    "unitOfMeasureID": "{{DATA_PARTITION_ID}}:reference-data--UnitOfMeasure:ms:",
                    "propertyNames": [
                        "NMRTestSteps[*].T2FullySaturated",
                        "NMRTestSteps[*].T2PartiallySaturated",
                        "NMRSummaryData.T2CutOff",
                        "NMRSummaryData.T2Mean"
                    ]
                },
                {
                    "kind": "Unit",
                    "name": "percent",
                    "unitOfMeasureID": "{{DATA_PARTITION_ID}}:reference-data--UnitOfMeasure:%25:",
                    "propertyNames": [
                        "NMRTestSteps[*].CumulativeWaterSaturation",
                        "NMRTestSteps[*].CumulativePorosity.Value",
                        "NMRTestSteps[*].IncrementalWaterSaturation",
                        "NMRTestSteps[*].IncrementalPorosity.Value",
                        "NMRTestSteps[*].T1CumulativePorosity",
                        "NMRTestSteps[*].T1CumulativeWaterSaturation",
                        "NMRTestSteps[*].T1IncrementalPorosity",
                        "NMRTestSteps[*].T1IncrementalWaterSaturation",
                        "NMRSummaryData.NMRT2BoundFluidRelativetoPoreVolume",
                        "NMRSummaryData.FreeFluidFFI",
                        "NMRSummaryData.NMRT2FreeFluid",
                        "NMRSummaryData.Porosity.Value",
                        "NMRSummaryData.Swirr",
                        "NMRSummaryData.NMRT2Swirr"
                    ]
                }
            ],
            [
                {
                    "TestConditionID": "{{DATA_PARTITION_ID}}:reference-data--NMRTestCondition:FullySaturated:",
                    "NMRTestSteps": [
                        {
                            "CumulativeWaterSaturation": 100.0,
                            "T2FullySaturated": 0.100,
                            "IncrementalPorosity": {
                                "Value": 0.000,
                                "PorosityMeasurementTypeID": "{{DATA_PARTITION_ID}}:reference-data--PorosityMeasurementType:BrineSaturation:"
                            }
                        },
                        {
                            "CumulativeWaterSaturation": 100.0,
                            "T2FullySaturated": 0.126,
                            "IncrementalPorosity": {
                                "Value": 0.000,
                                "PorosityMeasurementTypeID": "{{DATA_PARTITION_ID}}:reference-data--PorosityMeasurementType:BrineSaturation:"
                            }
                        },
                        {
                            "CumulativeWaterSaturation": 100.0,
                            "T2FullySaturated": 0.158,
                            "IncrementalPorosity": {
                                "Value": 0.000,
                                "PorosityMeasurementTypeID": "{{DATA_PARTITION_ID}}:reference-data--PorosityMeasurementType:BrineSaturation:"
                            }
                        },
                        {
                            "CumulativeWaterSaturation": 100.0,
                            "T2FullySaturated": 0.200,
                            "IncrementalPorosity": {
                                "Value": 0.000,
                                "PorosityMeasurementTypeID": "{{DATA_PARTITION_ID}}:reference-data--PorosityMeasurementType:BrineSaturation:"
                            }
                        },
                        {
                            "CumulativeWaterSaturation": 100.0,
                            "T2FullySaturated": 0.251,
                            "IncrementalPorosity": {
                                "Value": 0.000,
                                "PorosityMeasurementTypeID": "{{DATA_PARTITION_ID}}:reference-data--PorosityMeasurementType:BrineSaturation:"
                            }
                        },
                        {
                            "CumulativeWaterSaturation": 100.0,
                            "T2FullySaturated": 0.316,
                            "IncrementalPorosity": {
                                "Value": 0.000,
                                "PorosityMeasurementTypeID": "{{DATA_PARTITION_ID}}:reference-data--PorosityMeasurementType:BrineSaturation:"
                            }
                        },
                        {
                            "CumulativeWaterSaturation": 100.0,
                            "T2FullySaturated": 0.398,
                            "IncrementalPorosity": {
                                "Value": 0.000,
                                "PorosityMeasurementTypeID": "{{DATA_PARTITION_ID}}:reference-data--PorosityMeasurementType:BrineSaturation:"
                            }
                        },
                        {
                            "CumulativeWaterSaturation": 100.0,
                            "T2FullySaturated": 0.501,
                            "IncrementalPorosity": {
                                "Value": 0.000,
                                "PorosityMeasurementTypeID": "{{DATA_PARTITION_ID}}:reference-data--PorosityMeasurementType:BrineSaturation:"
                            }
                        },
                        {
                            "CumulativeWaterSaturation": 100.0,
                            "T2FullySaturated": 0.631,
                            "IncrementalPorosity": {
                                "Value": 0.000,
                                "PorosityMeasurementTypeID": "{{DATA_PARTITION_ID}}:reference-data--PorosityMeasurementType:BrineSaturation:"
                            }
                        },
                        {
                            "CumulativeWaterSaturation": 100.0,
                            "T2FullySaturated": 0.794,
                            "IncrementalPorosity": {
                                "Value": 0.000,
                                "PorosityMeasurementTypeID": "{{DATA_PARTITION_ID}}:reference-data--PorosityMeasurementType:BrineSaturation:"
                            }
                        },
                        {
                            "CumulativeWaterSaturation": 100.0,
                            "T2FullySaturated": 1.00,
                            "IncrementalPorosity": {
                                "Value": 0.019,
                                "PorosityMeasurementTypeID": "{{DATA_PARTITION_ID}}:reference-data--PorosityMeasurementType:BrineSaturation:"
                            }
                        },
                        {
                            "CumulativeWaterSaturation": 100.0,
                            "T2FullySaturated": 1.26,
                            "IncrementalPorosity": {
                                "Value": 0.040,
                                "PorosityMeasurementTypeID": "{{DATA_PARTITION_ID}}:reference-data--PorosityMeasurementType:BrineSaturation:"
                            }
                        },
                        {
                            "CumulativeWaterSaturation": 100.0,
                            "T2FullySaturated": 1.58,
                            "IncrementalPorosity": {
                                "Value": 0.057,
                                "PorosityMeasurementTypeID": "{{DATA_PARTITION_ID}}:reference-data--PorosityMeasurementType:BrineSaturation:"
                            }
                        },
                        {
                            "CumulativeWaterSaturation": 100.0,
                            "T2FullySaturated": 2.00,
                            "IncrementalPorosity": {
                                "Value": 0.071,
                                "PorosityMeasurementTypeID": "{{DATA_PARTITION_ID}}:reference-data--PorosityMeasurementType:BrineSaturation:"
                            }
                        },
                        {
                            "CumulativeWaterSaturation": 100.0,
                            "T2FullySaturated": 2.51,
                            "IncrementalPorosity": {
                                "Value": 0.085,
                                "PorosityMeasurementTypeID": "{{DATA_PARTITION_ID}}:reference-data--PorosityMeasurementType:BrineSaturation:"
                            }
                        },
                        {
                            "CumulativeWaterSaturation": 100.0,
                            "T2FullySaturated": 3.16,
                            "IncrementalPorosity": {
                                "Value": 0.1,
                                "PorosityMeasurementTypeID": "{{DATA_PARTITION_ID}}:reference-data--PorosityMeasurementType:BrineSaturation:"
                            }
                        },
                        {
                            "CumulativeWaterSaturation": 100.0,
                            "T2FullySaturated": 3.98,
                            "IncrementalPorosity": {
                                "Value": 0.119,
                                "PorosityMeasurementTypeID": "{{DATA_PARTITION_ID}}:reference-data--PorosityMeasurementType:BrineSaturation:"
                            }
                        },
                        {
                            "CumulativeWaterSaturation": 100.0,
                            "T2FullySaturated": 5.01,
                            "IncrementalPorosity": {
                                "Value": 0.136,
                                "PorosityMeasurementTypeID": "{{DATA_PARTITION_ID}}:reference-data--PorosityMeasurementType:BrineSaturation:"
                            }
                        },
                        {
                            "CumulativeWaterSaturation": 100.0,
                            "T2FullySaturated": 6.31,
                            "IncrementalPorosity": {
                                "Value": 0.147,
                                "PorosityMeasurementTypeID": "{{DATA_PARTITION_ID}}:reference-data--PorosityMeasurementType:BrineSaturation:"
                            }
                        },
                        {
                            "CumulativeWaterSaturation": 100.0,
                            "T2FullySaturated": 7.94,
                            "IncrementalPorosity": {
                                "Value": 0.148,
                                "PorosityMeasurementTypeID": "{{DATA_PARTITION_ID}}:reference-data--PorosityMeasurementType:BrineSaturation:"
                            }
                        },
                        {
                            "CumulativeWaterSaturation": 100.0,
                            "T2FullySaturated": 10,
                            "IncrementalPorosity": {
                                "Value": 0.142,
                                "PorosityMeasurementTypeID": "{{DATA_PARTITION_ID}}:reference-data--PorosityMeasurementType:BrineSaturation:"
                            }
                        },
                        {
                            "CumulativeWaterSaturation": 100.0,
                            "T2FullySaturated": 12.6,
                            "IncrementalPorosity": {
                                "Value": 0.143,
                                "PorosityMeasurementTypeID": "{{DATA_PARTITION_ID}}:reference-data--PorosityMeasurementType:BrineSaturation:"
                            }
                        },
                        {
                            "CumulativeWaterSaturation": 100.0,
                            "T2FullySaturated": 15.8,
                            "IncrementalPorosity": {
                                "Value": 0.164,
                                "PorosityMeasurementTypeID": "{{DATA_PARTITION_ID}}:reference-data--PorosityMeasurementType:BrineSaturation:"
                            }
                        },
                        {
                            "CumulativeWaterSaturation": 100.0,
                            "T2FullySaturated": 20,
                            "IncrementalPorosity": {
                                "Value": 0.217,
                                "PorosityMeasurementTypeID": "{{DATA_PARTITION_ID}}:reference-data--PorosityMeasurementType:BrineSaturation:"
                            }
                        },
                        {
                            "CumulativeWaterSaturation": 100.0,
                            "T2FullySaturated": 25.1,
                            "IncrementalPorosity": {
                                "Value": 0.3,
                                "PorosityMeasurementTypeID": "{{DATA_PARTITION_ID}}:reference-data--PorosityMeasurementType:BrineSaturation:"
                            }
                        },
                        {
                            "CumulativeWaterSaturation": 100.0,
                            "T2FullySaturated": 31.6,
                            "IncrementalPorosity": {
                                "Value": 0.403,
                                "PorosityMeasurementTypeID": "{{DATA_PARTITION_ID}}:reference-data--PorosityMeasurementType:BrineSaturation:"
                            }
                        },
                        {
                            "CumulativeWaterSaturation": 100.0,
                            "T2FullySaturated": 39.8,
                            "IncrementalPorosity": {
                                "Value": 0.499,
                                "PorosityMeasurementTypeID": "{{DATA_PARTITION_ID}}:reference-data--PorosityMeasurementType:BrineSaturation:"
                            }
                        },
                        {
                            "CumulativeWaterSaturation": 100.0,
                            "T2FullySaturated": 50.1,
                            "IncrementalPorosity": {
                                "Value": 0.559,
                                "PorosityMeasurementTypeID": "{{DATA_PARTITION_ID}}:reference-data--PorosityMeasurementType:BrineSaturation:"
                            }
                        },
                        {
                            "CumulativeWaterSaturation": 100.0,
                            "T2FullySaturated": 63.1,
                            "IncrementalPorosity": {
                                "Value": 0.562,
                                "PorosityMeasurementTypeID": "{{DATA_PARTITION_ID}}:reference-data--PorosityMeasurementType:BrineSaturation:"
                            }
                        },
                        {
                            "CumulativeWaterSaturation": 100.0,
                            "T2FullySaturated": 79.4,
                            "IncrementalPorosity": {
                                "Value": 0.518,
                                "PorosityMeasurementTypeID": "{{DATA_PARTITION_ID}}:reference-data--PorosityMeasurementType:BrineSaturation:"
                            }
                        },
                        {
                            "CumulativeWaterSaturation": 100.0,
                            "T2FullySaturated": 100,
                            "IncrementalPorosity": {
                                "Value": 0.49,
                                "PorosityMeasurementTypeID": "{{DATA_PARTITION_ID}}:reference-data--PorosityMeasurementType:BrineSaturation:"
                            }
                        },
                        {
                            "CumulativeWaterSaturation": 100.0,
                            "T2FullySaturated": 126,
                            "IncrementalPorosity": {
                                "Value": 0.595,
                                "PorosityMeasurementTypeID": "{{DATA_PARTITION_ID}}:reference-data--PorosityMeasurementType:BrineSaturation:"
                            }
                        },
                        {
                            "CumulativeWaterSaturation": 100.0,
                            "T2FullySaturated": 158,
                            "IncrementalPorosity": {
                                "Value": 0.979,
                                "PorosityMeasurementTypeID": "{{DATA_PARTITION_ID}}:reference-data--PorosityMeasurementType:BrineSaturation:"
                            }
                        },
                        {
                            "CumulativeWaterSaturation": 100.0,
                            "T2FullySaturated": 200,
                            "IncrementalPorosity": {
                                "Value": 1.75,
                                "PorosityMeasurementTypeID": "{{DATA_PARTITION_ID}}:reference-data--PorosityMeasurementType:BrineSaturation:"
                            }
                        },
                        {
                            "CumulativeWaterSaturation": 100.0,
                            "T2FullySaturated": 251,
                            "IncrementalPorosity": {
                                "Value": 2.895,
                                "PorosityMeasurementTypeID": "{{DATA_PARTITION_ID}}:reference-data--PorosityMeasurementType:BrineSaturation:"
                            }
                        },
                        {
                            "CumulativeWaterSaturation": 100.0,
                            "T2FullySaturated": 316,
                            "IncrementalPorosity": {
                                "Value": 4.217,
                                "PorosityMeasurementTypeID": "{{DATA_PARTITION_ID}}:reference-data--PorosityMeasurementType:BrineSaturation:"
                            }
                        },
                        {
                            "CumulativeWaterSaturation": 100.0,
                            "T2FullySaturated": 398,
                            "IncrementalPorosity": {
                                "Value": 5.335,
                                "PorosityMeasurementTypeID": "{{DATA_PARTITION_ID}}:reference-data--PorosityMeasurementType:BrineSaturation:"
                            }
                        },
                        {
                            "CumulativeWaterSaturation": 100.0,
                            "T2FullySaturated": 501,
                            "IncrementalPorosity": {
                                "Value": 5.784,
                                "PorosityMeasurementTypeID": "{{DATA_PARTITION_ID}}:reference-data--PorosityMeasurementType:BrineSaturation:"
                            }
                        },
                        {
                            "CumulativeWaterSaturation": 100.0,
                            "T2FullySaturated": 631,
                            "IncrementalPorosity": {
                                "Value": 5.162,
                                "PorosityMeasurementTypeID": "{{DATA_PARTITION_ID}}:reference-data--PorosityMeasurementType:BrineSaturation:"
                            }
                        },
                        {
                            "CumulativeWaterSaturation": 100.0,
                            "T2FullySaturated": 794,
                            "IncrementalPorosity": {
                                "Value": 3.267,
                                "PorosityMeasurementTypeID": "{{DATA_PARTITION_ID}}:reference-data--PorosityMeasurementType:BrineSaturation:"
                            }
                        },
                        {
                            "CumulativeWaterSaturation": 100.0,
                            "T2FullySaturated": 1000,
                            "IncrementalPorosity": {
                                "Value": 0.139,
                                "PorosityMeasurementTypeID": "{{DATA_PARTITION_ID}}:reference-data--PorosityMeasurementType:BrineSaturation:"
                            }
                        },
                        {
                            "CumulativeWaterSaturation": 100.0,
                            "T2FullySaturated": 1259,
                            "IncrementalPorosity": {
                                "Value": 0,
                                "PorosityMeasurementTypeID": "{{DATA_PARTITION_ID}}:reference-data--PorosityMeasurementType:BrineSaturation:"
                            }
                        },
                        {
                            "CumulativeWaterSaturation": 100.0,
                            "T2FullySaturated": 1585,
                            "IncrementalPorosity": {
                                "Value": 0,
                                "PorosityMeasurementTypeID": "{{DATA_PARTITION_ID}}:reference-data--PorosityMeasurementType:BrineSaturation:"
                            }
                        },
                        {
                            "CumulativeWaterSaturation": 100.0,
                            "T2FullySaturated": 1995,
                            "IncrementalPorosity": {
                                "Value": 0,
                                "PorosityMeasurementTypeID": "{{DATA_PARTITION_ID}}:reference-data--PorosityMeasurementType:BrineSaturation:"
                            }
                        },
                        {
                            "CumulativeWaterSaturation": 100.0,
                            "T2FullySaturated": 2512,
                            "IncrementalPorosity": {
                                "Value": 0,
                                "PorosityMeasurementTypeID": "{{DATA_PARTITION_ID}}:reference-data--PorosityMeasurementType:BrineSaturation:"
                            }
                        },
                        {
                            "CumulativeWaterSaturation": 100.0,
                            "T2FullySaturated": 3162,
                            "IncrementalPorosity": {
                                "Value": 0,
                                "PorosityMeasurementTypeID": "{{DATA_PARTITION_ID}}:reference-data--PorosityMeasurementType:BrineSaturation:"
                            }
                        },
                        {
                            "CumulativeWaterSaturation": 100.0,
                            "T2FullySaturated": 3981,
                            "IncrementalPorosity": {
                                "Value": 0,
                                "PorosityMeasurementTypeID": "{{DATA_PARTITION_ID}}:reference-data--PorosityMeasurementType:BrineSaturation:"
                            }
                        },
                        {
                            "CumulativeWaterSaturation": 100.0,
                            "T2FullySaturated": 5012,
                            "IncrementalPorosity": {
                                "Value": 0,
                                "PorosityMeasurementTypeID": "{{DATA_PARTITION_ID}}:reference-data--PorosityMeasurementType:BrineSaturation:"
                            }
                        },
                        {
                            "CumulativeWaterSaturation": 100.0,
                            "T2FullySaturated": 6310,
                            "IncrementalPorosity": {
                                "Value": 0,
                                "PorosityMeasurementTypeID": "{{DATA_PARTITION_ID}}:reference-data--PorosityMeasurementType:BrineSaturation:"
                            }
                        },
                        {
                            "CumulativeWaterSaturation": 100.0,
                            "T2FullySaturated": 7943,
                            "IncrementalPorosity": {
                                "Value": 0,
                                "PorosityMeasurementTypeID": "{{DATA_PARTITION_ID}}:reference-data--PorosityMeasurementType:BrineSaturation:"
                            }
                        },
                        {
                            "CumulativeWaterSaturation": 100.0,
                            "T2FullySaturated": 10000,
                            "IncrementalPorosity": {
                                "Value": 0,
                                "PorosityMeasurementTypeID": "{{DATA_PARTITION_ID}}:reference-data--PorosityMeasurementType:BrineSaturation:"
                            }
                        }
                    ],
                    "NMRSummaryData": {
                        "DisplacedFluidID": "{{DATA_PARTITION_ID}}:reference-data--DisplacedFluidType:Brine:",
                        "EchoSpacing": 0.2,
                        "InjectionFluidID": "{{DATA_PARTITION_ID}}:reference-data--SampleInjectionFluidType:Brine:",
                        "Porosity": [
                            {
                                "Value": 35.5,
                                "PorosityMeasurementTypeID": "{{DATA_PARTITION_ID}}:reference-data--PorosityMeasurementType:HeliumInjection:"
                            }
                        ],
                        "Permeability": [
                            {
                                "Value": 4740,
                                "PermeabilityMeasurementTypeID": "{{DATA_PARTITION_ID}}:reference-data--PermeabilityMeasurementType:Air:"
                            }
                        ],
                        "NMRT2Swirr": 8.7,
                        "T2CutOff": 44.1,
                        "T2Mean": 281.2,
                        "Temperature": 30,
                        "PoreVolume": 0.0,
                        "NetConfiningStress": 800.0
                    }
                }
            ]
        ]
    ]
}'
```

Sample response:
```JSON
{
  "ddms_urn": "urn://rafs/opendes:work-product-component--SamplesAnalysis:1c022fcfa0134607b7c3dbc26f8783cf/samplesanalysis/nmr/1.0.0/2fb9788f-043c-4f32-b9fa-29a2cb218d3a",
  "updated_wpc_id": [
    "opendes:work-product-component--SamplesAnalysis:1c022fcfa0134607b7c3dbc26f8783cf:1758009160406872"
  ]
}
```

### 5.4 Get the sample analysis dataset
To get record data, use `GET /api/rafs-ddms/v2/samplesanalysis/{record_id}/data/{analysistype}/{content_id}`

```bash
curl --request GET \
  --url {{DNS}}/api/rafs-ddms/v2/samplesanalysis/opendes:work-product-component--SamplesAnalysis:1c022fcfa0134607b7c3dbc26f8783cf/data/nmr/2fb9788f-043c-4f32-b9fa-29a2cb218d3a \
  --header 'accept: */*;version={{rafsddms-content-schema-version}}' \
  --header 'authorization: Bearer {{ACCESS_TOKEN}}' \
  --header 'cache-control: no-store' \
  --header 'content-type: application/json' \
  --header 'data-partition-id: {{DATA_PARTITION_ID}}'
```

```JSON
{
  "columns": [
    "SamplesAnalysisID",
    "SampleID",
    "Meta",
    "NMRTest"
  ],
  "index": [
    0
  ],
  "data": [
    [
      "opendes:work-product-component--SamplesAnalysis:1c022fcfa0134607b7c3dbc26f8783cf:",
      "opendes:master-data--Sample:KKS-CORE-PLUG-001:",
      [
        {
          "kind": "Unit",
          "name": "degree Fahrenheit",
          "propertyNames": [
            "NMRSummaryData.Temperature"
          ],
          "unitOfMeasureID": "opendes:reference-data--UnitOfMeasure:degF:"
        },
        {
          "kind": "Unit",
          "name": "pound-force per square inch",
          "propertyNames": [
            "NMRSummaryData.NetConfiningStress"
          ],
          "unitOfMeasureID": "opendes:reference-data--UnitOfMeasure:psi:"
        },
        {
          "kind": "Unit",
          "name": "millidarcy",
          "propertyNames": [
            "NMRSummaryData.Permeability.Value"
          ],
          "unitOfMeasureID": "opendes:reference-data--UnitOfMeasure:mD:"
        },
        {
          "kind": "Unit",
          "name": "cubic centimetre",
          "propertyNames": [
            "NMRTestSteps[*].CumulativeVolume",
            "NMRTestSteps[*].IncrementalVolume",
            "NMRSummaryData.BoundFluidBVI",
            "NMRSummaryData.PoreVolume"
          ],
          "unitOfMeasureID": "opendes:reference-data--UnitOfMeasure:cm3:"
        },
        {
          "kind": "Unit",
          "name": "centimetre",
          "propertyNames": [
            "NMRSummaryData.EchoSpacing"
          ],
          "unitOfMeasureID": "opendes:reference-data--UnitOfMeasure:cm:"
        },
        {
          "kind": "Unit",
          "name": "milliseconds",
          "propertyNames": [
            "NMRTestSteps[*].T2FullySaturated",
            "NMRTestSteps[*].T2PartiallySaturated",
            "NMRSummaryData.T2CutOff",
            "NMRSummaryData.T2Mean"
          ],
          "unitOfMeasureID": "opendes:reference-data--UnitOfMeasure:ms:"
        },
        {
          "kind": "Unit",
          "name": "percent",
          "propertyNames": [
            "NMRTestSteps[*].CumulativeWaterSaturation",
            "NMRTestSteps[*].CumulativePorosity.Value",
            "NMRTestSteps[*].IncrementalWaterSaturation",
            "NMRTestSteps[*].IncrementalPorosity.Value",
            "NMRTestSteps[*].T1CumulativePorosity",
            "NMRTestSteps[*].T1CumulativeWaterSaturation",
            "NMRTestSteps[*].T1IncrementalPorosity",
            "NMRTestSteps[*].T1IncrementalWaterSaturation",
            "NMRSummaryData.NMRT2BoundFluidRelativetoPoreVolume",
            "NMRSummaryData.FreeFluidFFI",
            "NMRSummaryData.NMRT2FreeFluid",
            "NMRSummaryData.Porosity.Value",
            "NMRSummaryData.Swirr",
            "NMRSummaryData.NMRT2Swirr"
          ],
          "unitOfMeasureID": "opendes:reference-data--UnitOfMeasure:%25:"
        }
      ],
      [
        {
          "NMRSummaryData": {
            "DisplacedFluidID": "opendes:reference-data--DisplacedFluidType:Brine:",
            "EchoSpacing": 0.2,
            "InjectionFluidID": "opendes:reference-data--SampleInjectionFluidType:Brine:",
            "NMRT2Swirr": 8.7,
            "NetConfiningStress": 800,
            "Permeability": [
              {
                "PermeabilityMeasurementTypeID": "opendes:reference-data--PermeabilityMeasurementType:Air:",
                "Value": 4740
              }
            ],
            "PoreVolume": 0,
            "Porosity": [
              {
                "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:HeliumInjection:",
                "Value": 35.5
              }
            ],
            "T2CutOff": 44.1,
            "T2Mean": 281.2,
            "Temperature": 30
          },
          "NMRTestSteps": [
            {
              "CumulativeWaterSaturation": 100,
              "IncrementalPorosity": {
                "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                "Value": 0
              },
              "T2FullySaturated": 0.1
            },
            {
              "CumulativeWaterSaturation": 100,
              "IncrementalPorosity": {
                "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                "Value": 0
              },
              "T2FullySaturated": 0.126
            },
            {
              "CumulativeWaterSaturation": 100,
              "IncrementalPorosity": {
                "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                "Value": 0
              },
              "T2FullySaturated": 0.158
            },
            {
              "CumulativeWaterSaturation": 100,
              "IncrementalPorosity": {
                "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                "Value": 0
              },
              "T2FullySaturated": 0.2
            },
            {
              "CumulativeWaterSaturation": 100,
              "IncrementalPorosity": {
                "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                "Value": 0
              },
              "T2FullySaturated": 0.251
            },
            {
              "CumulativeWaterSaturation": 100,
              "IncrementalPorosity": {
                "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                "Value": 0
              },
              "T2FullySaturated": 0.316
            },
            {
              "CumulativeWaterSaturation": 100,
              "IncrementalPorosity": {
                "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                "Value": 0
              },
              "T2FullySaturated": 0.398
            },
            {
              "CumulativeWaterSaturation": 100,
              "IncrementalPorosity": {
                "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                "Value": 0
              },
              "T2FullySaturated": 0.501
            },
            {
              "CumulativeWaterSaturation": 100,
              "IncrementalPorosity": {
                "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                "Value": 0
              },
              "T2FullySaturated": 0.631
            },
            {
              "CumulativeWaterSaturation": 100,
              "IncrementalPorosity": {
                "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                "Value": 0
              },
              "T2FullySaturated": 0.794
            },
            {
              "CumulativeWaterSaturation": 100,
              "IncrementalPorosity": {
                "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                "Value": 0.019
              },
              "T2FullySaturated": 1
            },
            {
              "CumulativeWaterSaturation": 100,
              "IncrementalPorosity": {
                "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                "Value": 0.04
              },
              "T2FullySaturated": 1.26
            },
            {
              "CumulativeWaterSaturation": 100,
              "IncrementalPorosity": {
                "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                "Value": 0.057
              },
              "T2FullySaturated": 1.58
            },
            {
              "CumulativeWaterSaturation": 100,
              "IncrementalPorosity": {
                "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                "Value": 0.071
              },
              "T2FullySaturated": 2
            },
            {
              "CumulativeWaterSaturation": 100,
              "IncrementalPorosity": {
                "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                "Value": 0.085
              },
              "T2FullySaturated": 2.51
            },
            {
              "CumulativeWaterSaturation": 100,
              "IncrementalPorosity": {
                "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                "Value": 0.1
              },
              "T2FullySaturated": 3.16
            },
            {
              "CumulativeWaterSaturation": 100,
              "IncrementalPorosity": {
                "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                "Value": 0.119
              },
              "T2FullySaturated": 3.98
            },
            {
              "CumulativeWaterSaturation": 100,
              "IncrementalPorosity": {
                "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                "Value": 0.136
              },
              "T2FullySaturated": 5.01
            },
            {
              "CumulativeWaterSaturation": 100,
              "IncrementalPorosity": {
                "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                "Value": 0.147
              },
              "T2FullySaturated": 6.31
            },
            {
              "CumulativeWaterSaturation": 100,
              "IncrementalPorosity": {
                "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                "Value": 0.148
              },
              "T2FullySaturated": 7.94
            },
            {
              "CumulativeWaterSaturation": 100,
              "IncrementalPorosity": {
                "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                "Value": 0.142
              },
              "T2FullySaturated": 10
            },
            {
              "CumulativeWaterSaturation": 100,
              "IncrementalPorosity": {
                "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                "Value": 0.143
              },
              "T2FullySaturated": 12.6
            },
            {
              "CumulativeWaterSaturation": 100,
              "IncrementalPorosity": {
                "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                "Value": 0.164
              },
              "T2FullySaturated": 15.8
            },
            {
              "CumulativeWaterSaturation": 100,
              "IncrementalPorosity": {
                "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                "Value": 0.217
              },
              "T2FullySaturated": 20
            },
            {
              "CumulativeWaterSaturation": 100,
              "IncrementalPorosity": {
                "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                "Value": 0.3
              },
              "T2FullySaturated": 25.1
            },
            {
              "CumulativeWaterSaturation": 100,
              "IncrementalPorosity": {
                "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                "Value": 0.403
              },
              "T2FullySaturated": 31.6
            },
            {
              "CumulativeWaterSaturation": 100,
              "IncrementalPorosity": {
                "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                "Value": 0.499
              },
              "T2FullySaturated": 39.8
            },
            {
              "CumulativeWaterSaturation": 100,
              "IncrementalPorosity": {
                "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                "Value": 0.559
              },
              "T2FullySaturated": 50.1
            },
            {
              "CumulativeWaterSaturation": 100,
              "IncrementalPorosity": {
                "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                "Value": 0.562
              },
              "T2FullySaturated": 63.1
            },
            {
              "CumulativeWaterSaturation": 100,
              "IncrementalPorosity": {
                "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                "Value": 0.518
              },
              "T2FullySaturated": 79.4
            },
            {
              "CumulativeWaterSaturation": 100,
              "IncrementalPorosity": {
                "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                "Value": 0.49
              },
              "T2FullySaturated": 100
            },
            {
              "CumulativeWaterSaturation": 100,
              "IncrementalPorosity": {
                "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                "Value": 0.595
              },
              "T2FullySaturated": 126
            },
            {
              "CumulativeWaterSaturation": 100,
              "IncrementalPorosity": {
                "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                "Value": 0.979
              },
              "T2FullySaturated": 158
            },
            {
              "CumulativeWaterSaturation": 100,
              "IncrementalPorosity": {
                "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                "Value": 1.75
              },
              "T2FullySaturated": 200
            },
            {
              "CumulativeWaterSaturation": 100,
              "IncrementalPorosity": {
                "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                "Value": 2.895
              },
              "T2FullySaturated": 251
            },
            {
              "CumulativeWaterSaturation": 100,
              "IncrementalPorosity": {
                "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                "Value": 4.217
              },
              "T2FullySaturated": 316
            },
            {
              "CumulativeWaterSaturation": 100,
              "IncrementalPorosity": {
                "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                "Value": 5.335
              },
              "T2FullySaturated": 398
            },
            {
              "CumulativeWaterSaturation": 100,
              "IncrementalPorosity": {
                "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                "Value": 5.784
              },
              "T2FullySaturated": 501
            },
            {
              "CumulativeWaterSaturation": 100,
              "IncrementalPorosity": {
                "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                "Value": 5.162
              },
              "T2FullySaturated": 631
            },
            {
              "CumulativeWaterSaturation": 100,
              "IncrementalPorosity": {
                "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                "Value": 3.267
              },
              "T2FullySaturated": 794
            },
            {
              "CumulativeWaterSaturation": 100,
              "IncrementalPorosity": {
                "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                "Value": 0.139
              },
              "T2FullySaturated": 1000
            },
            {
              "CumulativeWaterSaturation": 100,
              "IncrementalPorosity": {
                "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                "Value": 0
              },
              "T2FullySaturated": 1259
            },
            {
              "CumulativeWaterSaturation": 100,
              "IncrementalPorosity": {
                "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                "Value": 0
              },
              "T2FullySaturated": 1585
            },
            {
              "CumulativeWaterSaturation": 100,
              "IncrementalPorosity": {
                "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                "Value": 0
              },
              "T2FullySaturated": 1995
            },
            {
              "CumulativeWaterSaturation": 100,
              "IncrementalPorosity": {
                "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                "Value": 0
              },
              "T2FullySaturated": 2512
            },
            {
              "CumulativeWaterSaturation": 100,
              "IncrementalPorosity": {
                "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                "Value": 0
              },
              "T2FullySaturated": 3162
            },
            {
              "CumulativeWaterSaturation": 100,
              "IncrementalPorosity": {
                "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                "Value": 0
              },
              "T2FullySaturated": 3981
            },
            {
              "CumulativeWaterSaturation": 100,
              "IncrementalPorosity": {
                "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                "Value": 0
              },
              "T2FullySaturated": 5012
            },
            {
              "CumulativeWaterSaturation": 100,
              "IncrementalPorosity": {
                "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                "Value": 0
              },
              "T2FullySaturated": 6310
            },
            {
              "CumulativeWaterSaturation": 100,
              "IncrementalPorosity": {
                "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                "Value": 0
              },
              "T2FullySaturated": 7943
            },
            {
              "CumulativeWaterSaturation": 100,
              "IncrementalPorosity": {
                "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                "Value": 0
              },
              "T2FullySaturated": 10000
            }
          ],
          "TestConditionID": "opendes:reference-data--NMRTestCondition:FullySaturated:"
        }
      ]
    ]
  ]
}
```

### Search sample analysis data
To search data for a specific RAFS DDMS schema version, use `GET /api/rafs-ddms/v2/samplesanalysis/{analysistype}/search/data`

```bash
curl --request GET \
  --url {DNS}/api/rafs-ddms/v2/samplesanalysis/nmr/search/data \
  --header 'accept: */*;version={{rafsddms-content-schema-version}}' \
  --header 'authorization: Bearer {{ACCESS_TOKEN}}' \
  --header 'cache-control: no-store' \
  --header 'content-type: application/json' \
  --header 'data-partition-id: {{DATA_PARTITION_ID}}'
```

Sample response:
```JSON
{
  "result": {
    "columns": [
      "SamplesAnalysisID",
      "SampleID",
      "Meta",
      "NMRTest"
    ],
    "index": [
      0
    ],
    "data": [
      [
        "opendes:work-product-component--SamplesAnalysis:1c022fcfa0134607b7c3dbc26f8783cf:",
        "opendes:master-data--Sample:KKS-CORE-PLUG-001:",
        [
          {
            "kind": "Unit",
            "name": "degree Fahrenheit",
            "propertyNames": [
              "NMRSummaryData.Temperature"
            ],
            "unitOfMeasureID": "opendes:reference-data--UnitOfMeasure:degF:"
          },
          {
            "kind": "Unit",
            "name": "pound-force per square inch",
            "propertyNames": [
              "NMRSummaryData.NetConfiningStress"
            ],
            "unitOfMeasureID": "opendes:reference-data--UnitOfMeasure:psi:"
          },
          {
            "kind": "Unit",
            "name": "millidarcy",
            "propertyNames": [
              "NMRSummaryData.Permeability.Value"
            ],
            "unitOfMeasureID": "opendes:reference-data--UnitOfMeasure:mD:"
          },
          {
            "kind": "Unit",
            "name": "cubic centimetre",
            "propertyNames": [
              "NMRTestSteps[*].CumulativeVolume",
              "NMRTestSteps[*].IncrementalVolume",
              "NMRSummaryData.BoundFluidBVI",
              "NMRSummaryData.PoreVolume"
            ],
            "unitOfMeasureID": "opendes:reference-data--UnitOfMeasure:cm3:"
          },
          {
            "kind": "Unit",
            "name": "centimetre",
            "propertyNames": [
              "NMRSummaryData.EchoSpacing"
            ],
            "unitOfMeasureID": "opendes:reference-data--UnitOfMeasure:cm:"
          },
          {
            "kind": "Unit",
            "name": "milliseconds",
            "propertyNames": [
              "NMRTestSteps[*].T2FullySaturated",
              "NMRTestSteps[*].T2PartiallySaturated",
              "NMRSummaryData.T2CutOff",
              "NMRSummaryData.T2Mean"
            ],
            "unitOfMeasureID": "opendes:reference-data--UnitOfMeasure:ms:"
          },
          {
            "kind": "Unit",
            "name": "percent",
            "propertyNames": [
              "NMRTestSteps[*].CumulativeWaterSaturation",
              "NMRTestSteps[*].CumulativePorosity.Value",
              "NMRTestSteps[*].IncrementalWaterSaturation",
              "NMRTestSteps[*].IncrementalPorosity.Value",
              "NMRTestSteps[*].T1CumulativePorosity",
              "NMRTestSteps[*].T1CumulativeWaterSaturation",
              "NMRTestSteps[*].T1IncrementalPorosity",
              "NMRTestSteps[*].T1IncrementalWaterSaturation",
              "NMRSummaryData.NMRT2BoundFluidRelativetoPoreVolume",
              "NMRSummaryData.FreeFluidFFI",
              "NMRSummaryData.NMRT2FreeFluid",
              "NMRSummaryData.Porosity.Value",
              "NMRSummaryData.Swirr",
              "NMRSummaryData.NMRT2Swirr"
            ],
            "unitOfMeasureID": "opendes:reference-data--UnitOfMeasure:%25:"
          }
        ],
        [
          {
            "NMRSummaryData": {
              "DisplacedFluidID": "opendes:reference-data--DisplacedFluidType:Brine:",
              "EchoSpacing": 0.2,
              "InjectionFluidID": "opendes:reference-data--SampleInjectionFluidType:Brine:",
              "NMRT2Swirr": 8.7,
              "NetConfiningStress": 800,
              "Permeability": [
                {
                  "PermeabilityMeasurementTypeID": "opendes:reference-data--PermeabilityMeasurementType:Air:",
                  "Value": 4740
                }
              ],
              "PoreVolume": 0,
              "Porosity": [
                {
                  "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:HeliumInjection:",
                  "Value": 35.5
                }
              ],
              "T2CutOff": 44.1,
              "T2Mean": 281.2,
              "Temperature": 30
            },
            "NMRTestSteps": [
              {
                "CumulativeWaterSaturation": 100,
                "IncrementalPorosity": {
                  "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                  "Value": 0
                },
                "T2FullySaturated": 0.1
              },
              {
                "CumulativeWaterSaturation": 100,
                "IncrementalPorosity": {
                  "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                  "Value": 0
                },
                "T2FullySaturated": 0.126
              },
              {
                "CumulativeWaterSaturation": 100,
                "IncrementalPorosity": {
                  "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                  "Value": 0
                },
                "T2FullySaturated": 0.158
              },
              {
                "CumulativeWaterSaturation": 100,
                "IncrementalPorosity": {
                  "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                  "Value": 0
                },
                "T2FullySaturated": 0.2
              },
              {
                "CumulativeWaterSaturation": 100,
                "IncrementalPorosity": {
                  "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                  "Value": 0
                },
                "T2FullySaturated": 0.251
              },
              {
                "CumulativeWaterSaturation": 100,
                "IncrementalPorosity": {
                  "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                  "Value": 0
                },
                "T2FullySaturated": 0.316
              },
              {
                "CumulativeWaterSaturation": 100,
                "IncrementalPorosity": {
                  "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                  "Value": 0
                },
                "T2FullySaturated": 0.398
              },
              {
                "CumulativeWaterSaturation": 100,
                "IncrementalPorosity": {
                  "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                  "Value": 0
                },
                "T2FullySaturated": 0.501
              },
              {
                "CumulativeWaterSaturation": 100,
                "IncrementalPorosity": {
                  "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                  "Value": 0
                },
                "T2FullySaturated": 0.631
              },
              {
                "CumulativeWaterSaturation": 100,
                "IncrementalPorosity": {
                  "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                  "Value": 0
                },
                "T2FullySaturated": 0.794
              },
              {
                "CumulativeWaterSaturation": 100,
                "IncrementalPorosity": {
                  "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                  "Value": 0.019
                },
                "T2FullySaturated": 1
              },
              {
                "CumulativeWaterSaturation": 100,
                "IncrementalPorosity": {
                  "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                  "Value": 0.04
                },
                "T2FullySaturated": 1.26
              },
              {
                "CumulativeWaterSaturation": 100,
                "IncrementalPorosity": {
                  "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                  "Value": 0.057
                },
                "T2FullySaturated": 1.58
              },
              {
                "CumulativeWaterSaturation": 100,
                "IncrementalPorosity": {
                  "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                  "Value": 0.071
                },
                "T2FullySaturated": 2
              },
              {
                "CumulativeWaterSaturation": 100,
                "IncrementalPorosity": {
                  "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                  "Value": 0.085
                },
                "T2FullySaturated": 2.51
              },
              {
                "CumulativeWaterSaturation": 100,
                "IncrementalPorosity": {
                  "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                  "Value": 0.1
                },
                "T2FullySaturated": 3.16
              },
              {
                "CumulativeWaterSaturation": 100,
                "IncrementalPorosity": {
                  "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                  "Value": 0.119
                },
                "T2FullySaturated": 3.98
              },
              {
                "CumulativeWaterSaturation": 100,
                "IncrementalPorosity": {
                  "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                  "Value": 0.136
                },
                "T2FullySaturated": 5.01
              },
              {
                "CumulativeWaterSaturation": 100,
                "IncrementalPorosity": {
                  "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                  "Value": 0.147
                },
                "T2FullySaturated": 6.31
              },
              {
                "CumulativeWaterSaturation": 100,
                "IncrementalPorosity": {
                  "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                  "Value": 0.148
                },
                "T2FullySaturated": 7.94
              },
              {
                "CumulativeWaterSaturation": 100,
                "IncrementalPorosity": {
                  "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                  "Value": 0.142
                },
                "T2FullySaturated": 10
              },
              {
                "CumulativeWaterSaturation": 100,
                "IncrementalPorosity": {
                  "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                  "Value": 0.143
                },
                "T2FullySaturated": 12.6
              },
              {
                "CumulativeWaterSaturation": 100,
                "IncrementalPorosity": {
                  "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                  "Value": 0.164
                },
                "T2FullySaturated": 15.8
              },
              {
                "CumulativeWaterSaturation": 100,
                "IncrementalPorosity": {
                  "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                  "Value": 0.217
                },
                "T2FullySaturated": 20
              },
              {
                "CumulativeWaterSaturation": 100,
                "IncrementalPorosity": {
                  "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                  "Value": 0.3
                },
                "T2FullySaturated": 25.1
              },
              {
                "CumulativeWaterSaturation": 100,
                "IncrementalPorosity": {
                  "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                  "Value": 0.403
                },
                "T2FullySaturated": 31.6
              },
              {
                "CumulativeWaterSaturation": 100,
                "IncrementalPorosity": {
                  "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                  "Value": 0.499
                },
                "T2FullySaturated": 39.8
              },
              {
                "CumulativeWaterSaturation": 100,
                "IncrementalPorosity": {
                  "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                  "Value": 0.559
                },
                "T2FullySaturated": 50.1
              },
              {
                "CumulativeWaterSaturation": 100,
                "IncrementalPorosity": {
                  "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                  "Value": 0.562
                },
                "T2FullySaturated": 63.1
              },
              {
                "CumulativeWaterSaturation": 100,
                "IncrementalPorosity": {
                  "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                  "Value": 0.518
                },
                "T2FullySaturated": 79.4
              },
              {
                "CumulativeWaterSaturation": 100,
                "IncrementalPorosity": {
                  "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                  "Value": 0.49
                },
                "T2FullySaturated": 100
              },
              {
                "CumulativeWaterSaturation": 100,
                "IncrementalPorosity": {
                  "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                  "Value": 0.595
                },
                "T2FullySaturated": 126
              },
              {
                "CumulativeWaterSaturation": 100,
                "IncrementalPorosity": {
                  "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                  "Value": 0.979
                },
                "T2FullySaturated": 158
              },
              {
                "CumulativeWaterSaturation": 100,
                "IncrementalPorosity": {
                  "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                  "Value": 1.75
                },
                "T2FullySaturated": 200
              },
              {
                "CumulativeWaterSaturation": 100,
                "IncrementalPorosity": {
                  "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                  "Value": 2.895
                },
                "T2FullySaturated": 251
              },
              {
                "CumulativeWaterSaturation": 100,
                "IncrementalPorosity": {
                  "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                  "Value": 4.217
                },
                "T2FullySaturated": 316
              },
              {
                "CumulativeWaterSaturation": 100,
                "IncrementalPorosity": {
                  "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                  "Value": 5.335
                },
                "T2FullySaturated": 398
              },
              {
                "CumulativeWaterSaturation": 100,
                "IncrementalPorosity": {
                  "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                  "Value": 5.784
                },
                "T2FullySaturated": 501
              },
              {
                "CumulativeWaterSaturation": 100,
                "IncrementalPorosity": {
                  "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                  "Value": 5.162
                },
                "T2FullySaturated": 631
              },
              {
                "CumulativeWaterSaturation": 100,
                "IncrementalPorosity": {
                  "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                  "Value": 3.267
                },
                "T2FullySaturated": 794
              },
              {
                "CumulativeWaterSaturation": 100,
                "IncrementalPorosity": {
                  "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                  "Value": 0.139
                },
                "T2FullySaturated": 1000
              },
              {
                "CumulativeWaterSaturation": 100,
                "IncrementalPorosity": {
                  "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                  "Value": 0
                },
                "T2FullySaturated": 1259
              },
              {
                "CumulativeWaterSaturation": 100,
                "IncrementalPorosity": {
                  "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                  "Value": 0
                },
                "T2FullySaturated": 1585
              },
              {
                "CumulativeWaterSaturation": 100,
                "IncrementalPorosity": {
                  "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                  "Value": 0
                },
                "T2FullySaturated": 1995
              },
              {
                "CumulativeWaterSaturation": 100,
                "IncrementalPorosity": {
                  "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                  "Value": 0
                },
                "T2FullySaturated": 2512
              },
              {
                "CumulativeWaterSaturation": 100,
                "IncrementalPorosity": {
                  "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                  "Value": 0
                },
                "T2FullySaturated": 3162
              },
              {
                "CumulativeWaterSaturation": 100,
                "IncrementalPorosity": {
                  "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                  "Value": 0
                },
                "T2FullySaturated": 3981
              },
              {
                "CumulativeWaterSaturation": 100,
                "IncrementalPorosity": {
                  "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                  "Value": 0
                },
                "T2FullySaturated": 5012
              },
              {
                "CumulativeWaterSaturation": 100,
                "IncrementalPorosity": {
                  "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                  "Value": 0
                },
                "T2FullySaturated": 6310
              },
              {
                "CumulativeWaterSaturation": 100,
                "IncrementalPorosity": {
                  "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                  "Value": 0
                },
                "T2FullySaturated": 7943
              },
              {
                "CumulativeWaterSaturation": 100,
                "IncrementalPorosity": {
                  "PorosityMeasurementTypeID": "opendes:reference-data--PorosityMeasurementType:BrineSaturation:",
                  "Value": 0
                },
                "T2FullySaturated": 10000
              }
            ],
            "TestConditionID": "opendes:reference-data--NMRTestCondition:FullySaturated:"
          }
        ]
      ]
    ]
  },
  "offset": 0,
  "page_limit": 100,
  "total_size": 1
}
```
## Troubleshooting
To troubleshoot issues, review the `OEPDataplaneLogs` diagnostic logs in your Log Analytics workspace. These logs provide detailed information about RAFS DDMS operations and can help identify errors or unexpected behavior. In the Azure portal, navigate to your Azure Data Manager for Energy resource, select **Diagnostic settings** under the **Monitoring** section, and then choose the `Rock and Fluid Samples DDMS Logs` category.

**Sample Kusto query:**

```kusto
OEPDataplaneLogs
| where Category == "RafsDdmsLogs"
| project TenantId, TimeGenerated, Message, _ResourceId
```

**Sample Kusto response:**

| TenantId                               | TimeGenerated [UTC]      | Message                                                                                                                                                                                                                              | _ResourceId                                                                                                                                         |
|----------------------------------------|--------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| aaaabbbb-0000-cccc-1111-dddd2222eeee   | 2025-10-21 13:33:12.495  | 2025-10-21 13:33:12,495 [11][INFO] --- {correlation-id=rafs-ddms-7f9c2e1a-4b2d-4e3a-8c1d-9a2b3c4d5e6f} uvicorn.access: 127.0.0.6:32997 - "GET /api/rafs-ddms/healthz HTTP/1.1" 200                                                  | /subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourcegroups/test-rg/providers/microsoft.openenergyplatform/energyservices/adme-instance     |



## Related content
[RAFS OSDU community tutorial](https://community.opengroup.org/osdu/platform/domain-data-mgmt-services/rock-and-fluid-sample/rafs-ddms-services/-/tree/release/0.28/docs/tutorial)

## Next step
Advance to the next tutorial:

> [!div class="nextstepaction"]
> [Tutorial: Use Reservoir DDMS websocket API endpoints](tutorial-reservoir-ddms-websocket.md)