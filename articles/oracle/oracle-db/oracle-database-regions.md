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

The list below mentions the Azure and corresponding OCI regions with the regional availability for Oracle Database@Azure:
- Dual – Minimum two Azure zones are available in this region
- Single – One Azure zone available with a corresponding paired DR region
- DR - Disaster recovery only region

## Asia Pacific (APAC)

| Azure region   | OCI region   | Oracle Exadata Database@Azure | Oracle Autonomous Database@Azure | Regional Availability |
| -------------- | ----------------------- | ----------------------------- | -------------------------------- | ---------|
| Australia East | Australia East (Sydney) | ✓         | ✓      |   Single   |


## Brazil

| Azure region   | OCI region  | Oracle Exadata Database@Azure | Oracle Autonomous Database@Azure | Regional Availability |
|----------------|--------------------------|-------------------|-------------------|----|
| Brazil South | Brazil Southeast (Vinhedo)   | ✓   |   ✓    | Dual  |


## Europe, Middle East, Africa (EMEA)

|Azure region |OCI region  | Oracle Exadata Database@Azure | Oracle Autonomous Database@Azure | Regional Availability |
|------------|--|--------------------------|------------------------------| ---- |
| France Central       |France central (Paris) | ✓   | ✓ |  Dual |
| Germany West Central |Germany Central (Frankfurt) |  ✓  | ✓ | DR |
| UK South             | UK South (London)   | ✓   | ✓    |  Single|
| Italy North          | Italy North (Milan)   | ✓   |     | Dual |
| UK West | UK West (Cardiff)   | ✓   | ✓    |  Single      |


## North America (NA)

| Azure region   | OCI region     | Oracle Exadata Database@Azure  | Oracle Autonomous Database@Azure    |  Regional Availability|
| -------------- | -------------------|------------------------|------------------ | -----|
| East US        | US East (Ashburn)          | ✓   | ✓  | Dual  |
| Canada Central | Canada Southeast (Toronto) | ✓ |  ✓ | Single  |
| West US | US West (San Jose)  | ✓  |          ✓  | Single    |

> [!NOTE]
> To provision Oracle Database@Azure resources in a supported region, your tenancy must be subscribed to the target region. Learn how to [manage regions](https://docs.oracle.com/iaas/Content/Identity/regions/managingregions.htm#Managing_Regions) and [subscribe to an infrastructure region](https://docs.oracle.com/iaas/Content/Identity/regions/To_subscribe_to_an_infrastructure_region.htm#subscribe).
