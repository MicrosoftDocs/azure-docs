---
title: Region availability for Oracle Database@Azure
description: Learn about region availability for Oracle Database@Azure.
author: jjaygbay1
ms.service: oracle-on-azure
ms.collection: linux
ms.topic: concept-article
ms.date: 9/24/2024
ms.custom: references-regions
ms.author: jacobjaygbay
---

# Region availability for Oracle Database@Azure

Learn what Azure regions and corresponding Oracle Cloud Infrastructure (OCI) regions support Oracle Database@Azure in standard business regions across the globe.

## Asia-Pacific (APAC)

The following table lists Azure regions and corresponding OCI regions that support Oracle Database@Azure in the APAC business region:

| Azure region   | OCI region  | Oracle Exadata Database@Azure | Oracle Autonomous Database@Azure |
|----------------|--------------------------|-------------------|-------------------|
| Australia East | Australia East (Sydney)  | ✓  |          ✓                      |
| Southeast Asia | Singapore (Singapore)  | ✓  |          ✓                      |
| Japan East     | Japan East(Tokyo)  | ✓  |                                 |

## Europe, Middle East, Africa (EMEA)

The following table lists Azure regions and corresponding OCI regions that support Oracle Database@Azure in the EMEA business region:

|Azure region |OCI region  | Oracle Exadata Database@Azure | Oracle Autonomous Database@Azure |
|------------|--|--------------------------|------------------------------|
| France Central       |France central (Paris) | ✓   | ✓ |
| Germany West Central |Germany Central (Frankfurt) |  ✓  | ✓ |
| UK South             | UK South (London)   | ✓   | ✓    |
| Italy North          | Italy North (Milan)   | ✓   |     |

## North America (NA)

The following table lists Azure regions and corresponding OCI regions that support Oracle Database@Azure in the NA business region:

| Azure region   | OCI region                 | Oracle Exadata Database@Azure                    | Oracle Autonomous Database@Azure                      |
| -------------- | -------------------|------------------------|------------------ |
| East US        | US East (Ashburn)          | ✓   | ✓  |
| Canada Central | Canada Southeast (Toronto) | ✓ |  ✓ |

## Disaster recovery regions available for Oracle Database@Azure

The following table lists Azure regions and corresponding OCI regions that offer a single-zone disaster recovery solution for Oracle Database@Azure:

| Azure region   | OCI region  | Oracle Exadata Database@Azure | Oracle Autonomous Database@Azure |
|----------------|--------------------------|-------------------|-------------------|
| West US | US West (Phoenix)  | ✓  |          ✓  |

> [!NOTE]
> To provision Oracle Database@Azure resources in a supported region, your tenancy must be subscribed to the target region. Learn how to [manage regions](https://docs.oracle.com/iaas/Content/Identity/regions/managingregions.htm#Managing_Regions) and [subscribe to an infrastructure region](https://docs.oracle.com/iaas/Content/Identity/regions/To_subscribe_to_an_infrastructure_region.htm#subscribe).
