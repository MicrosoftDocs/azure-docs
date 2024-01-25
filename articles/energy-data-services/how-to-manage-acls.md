---
title: Manage ACLs in Azure Data Manager for Energy
description: This article describes how to manage ACLs in Azure Data Manager for Energy.
author: shikhagarg1
ms.author: shikhagarg
ms.service: energy-data-services
ms.topic: how-to
ms.date: 12/11/2023
ms.custom: template-how-to
---

# Manage ACLs of the data record

In this article, you learn how to add or remove ACLs from the data record in your Azure Data Manager for Energy instance.

## Create a data group as ACL
Run the following curl command in Azure Cloud Shell to create a new data group, e.g., data.sampledb.viewer, in the specific data partition of the Azure Data Manager for Energy instance.

**Request format**

```bash
    curl --location --request POST "https://<adme-url>/api/entitlements/v2/groups/" \
    --header 'data-partition-id: <data-partition>' \
    --header 'Authorization: Bearer <access_token>'
    --data-raw '{
       "description": "<data-group-description>",
       "name": "data.sampledb.viewer"
    }
```



## Create a record with ACLs

**Request format**

```bash
curl --location --request PUT 'https://<adme-url>/api/storage/v2/records/' \
--header 'data-partition-id: opendes' \
--header 'Accept: application/json' \
--header 'Authorization: Bearer <token>’ \
--header 'Content-Type: application/json' \	
--data-raw '[
  {
    "acl": {
      "owners": [
        "data.default.owners@opendes.contoso.com",
        "data.wellbore1.owner@opendes.contoso.com"
      ],
      "viewers": [
        "data.default.viewers@opendes.contoso.com"
      ]
    },
    "data": {
        "FacilityID": "Example External Facility Identifier",
        "Source": "Create Record test"
      },
    "id": "opendes:master-data--Well:999635346360",
    "kind": "osdu:wks:master-data--Well:1.0.0",
    "legal": {
      "legaltags": [
        "opendes-Test-Legal-Tag-2311232"
      ],
      "otherRelevantDataCountries": [
        "US"
      ],
      "status": "compliant"
    },
    "meta": [
      {}
    ],
    "version": 0
  }
]
```

**Sample response**

```JSON
{
    "recordCount": 1,
    "recordIds": [
        "opendes:master-data--Well:999736019023"
    ],
    "skippedRecordIds": [],
    "recordIdVersions": [
        "opendes:master-data--Well:999736019023:1702017200855277"
    ]
}
```

Keep the record ID from the response handy for future references.

## Get created record with ACLs

**Request format**

```bash
curl --location 'https://<adme-url>/api/storage/v2/records/opendes:master-data--Well:999736019023' \
--header 'data-partition-id: opendes' \
--header 'Authorization: Bearer <token>’
```

**Sample response**

```JSON
{
    "data": {
        "FacilityID": "Example External Facility Identifier",
        "Source": "Create Record test"
    },
    "meta": [
        {}
    ],
    "id": "opendes:master-data--Well:999736019023",
    "version": 1702017200855277,
    "kind": "osdu:wks:master-data--Well:1.0.0",
    "acl": {
        "viewers": [
            "data.default.viewers@opendes.contoso.com"
        ],
        "owners": [
            "data.default.owners@opendes.contoso.com",
            "data.wellbore1.owner@opendes.contoso.com"
        ]
    },
    "legal": {
        "legaltags": [
            "opendes-Test-Legal-Tag-2311232"
        ],
        "otherRelevantDataCountries": [
            "US"
        ],
        "status": "compliant"
    },
    "createUser": "preshipping@azureglobal1.onmicrosoft.com",
    "createTime": "2023-12-08T06:33:21.338Z"
}
```

## Delete ACLs from the data record

The first `/acl/owners/0` operation removes ACL from 0th position in the array of ACL. When you delete the first entry with this operation, the system deletes it. The previous second entry then becomes the first entry. The second `/acl/owners/0` operation tries to remove the second entry.
  
**Request format**

```bash
curl --location --request PATCH 'https://<adme-url>/api/storage/v2/records/' \
--header 'data-partition-id: opendes' \
--header 'Accept: application/json' \
--header 'Authorization: Bearer <token>’\
--header 'Content-Type: application/json-patch+json' \
--data '
{
    "query": {
        "ids": ["opendes:master-data--Well:999736019023"]
    },
    "ops": [
        { 
          "op": "remove", 
          "path": "/acl/owners/0"
        }
      ]
}
```

**Sample response**

```JSON
{
      "recordCount": 1,
      "recordIds": [
          "opendes:master-data--Well:999736019023:1702017200855277"
      ],
      "notFoundRecordIds": [],
      "failedRecordIds": [],
      "errors": []
}
```

If you delete the last owner ACL from the data record, you get the error.

**Sample response**

```JSON
{
    "recordCount": 0,
    "recordIds": [],
    "notFoundRecordIds": [],
    "failedRecordIds": [
        "opendes:master-data--Well: 999736019023"
    ],
    "errors": [
        "Patch operation for record: opendes:master-data--Well:999512152273 aborted. Potentially empty value of legaltags or acl/owners or acl/viewers"
    ]
}
```


## Next steps

After you add ACLs to the data records, you can:

- [Manage legal tags](how-to-manage-legal-tags.md)
- [Manage users](how-to-manage-users.md)

You can also ingest data into your Azure Data Manager for Energy instance:

- [Tutorial on CSV parser ingestion](tutorial-csv-ingestion.md)
- [Tutorial on manifest ingestion](tutorial-manifest-ingestion.md)
