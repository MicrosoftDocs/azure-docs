---
title: How to manage users in Microsoft Azure Data Manager for Energy
description: This article describes how to manage users in Azure Data Manager for Energy
author: shikhagarg1
ms.author: shikhagarg
ms.service: energy-data-services
ms.topic: how-to
ms.date: 08/19/2022
ms.custom: template-how-to
---

# How to manage users

**Request format**

```bash
curl --location --request PUT 'https://osdu-ship.msft-osdu-test.org/api/storage/v2/records/' \
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
