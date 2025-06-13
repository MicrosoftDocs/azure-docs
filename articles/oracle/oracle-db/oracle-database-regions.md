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
# Customer intent: As a cloud architect, I want to understand the regional availability of Oracle Database services on Azure, so that I can plan the deployment of these databases in the appropriate locations for optimal performance and disaster recovery.
---

# Region availability for Oracle Database@Azure

Learn what Azure regions and corresponding Oracle Cloud Infrastructure (OCI) regions support Oracle Database@Azure in standard business regions across the globe. 

The list below mentions the Azure and corresponding OCI regions with the regional availability for Oracle Database@Azure:
- Dual – Minimum two Azure zones are available in this region
- Single – One Azure zone available with a corresponding paired DR region
- DR - Disaster recovery only region

## Asia Pacific (APAC)

| Azure region   | OCI region   | Oracle Exadata Database@Azure | Oracle Autonomous Database@Azure | Oracle Database Autonomous Recovery Service@Azure | Exadata Database Service on Exascale Infrastructure@Azure | BaseDB | Regional Availability |
| -------------- | ----------------------- | ----------------------------- | -------------------------------- | -------- |---------|---------|---------|
| Australia East | Australia East (Sydney) | ✓         | ✓      |  | |Preview available |  Dual   |
| Australia Southeast | Australia Southeast (Melbourne) | ✓        | | | |  |   Dual   |
| Japan East | Japan East (Tokyo) | ✓         | ✓  | ✓ | |Preview available |   Dual   |
| Southeast Asia |Singapore (Singapore) | ✓         | ✓      | ✓ | | |  Single   |



## Brazil

| Azure region   | OCI region  | Oracle Exadata Database@Azure | Oracle Autonomous Database@Azure | Oracle Database Autonomous Recovery Service@Azure| Exadata Database Service on Exascale Infrastructure@Azure | BaseDB | Regional Availability |
|----------------|--------------------------|-------------------|-------------------| -------- |----|----|----|
| Brazil South | Brazil Southeast (Vinhedo)   | ✓   |   ✓  | |✓ |  | Dual  |


## Europe, Middle East, Africa (EMEA)

|Azure region |OCI region  | Oracle Exadata Database@Azure | Oracle Autonomous Database@Azure | Oracle Database Autonomous Recovery Service@Azure| Exadata Database Service on Exascale Infrastructure@Azure | BaseDB | Regional Availability |
|------------|--|--------------------------|------------------------------| ------| ---- | ---- |----|
| France Central       |France central (Paris) | ✓   | ✓ | ✓ | | |  Dual |
| Germany West Central |Germany Central (Frankfurt) |  ✓  | ✓ | ✓| | Preview available | Dual |
| UK South             | UK South (London)   | ✓   | ✓   | ✓ | ✓| Preview available | Dual|
| Italy North          | Italy North (Milan)   | ✓   | ✓   |✓ |✓ | Preview available | Dual |
| UK West | UK West (Cardiff)   | ✓   | ✓  | | | |  Single |


## North America (NA)

| Azure region   | OCI region     | Oracle Exadata Database@Azure  | Oracle Autonomous Database@Azure | Oracle Database Autonomous Recovery Service@Azure| Exadata Database Service on Exascale Infrastructure@Azure | BaseDB | Regional Availability|
| -------------- | -------------------|------------------------|------------------ | ---- |-----|-----|----|
| East US        | US East (Ashburn)          | ✓   | ✓ | ✓ | | Preview available | Dual  |
| Canada Central | Canada Southeast (Toronto) | ✓ |  ✓ | | | | Single  |
| West US | US West (San Jose)  | ✓  | ✓  | ✓| | Preview available | Single |
| Central US | US Midwest (Chicago)  | ✓  |   ✓  | ✓ | | | Dual |
| East US 2 | US East (Ashburn) | ✓  |   | | | | Dual |

> [!NOTE]
> To provision Oracle Database@Azure resources in a supported region, your tenancy must be subscribed to the target region. Learn how to [manage regions](https://docs.oracle.com/iaas/Content/Identity/regions/managingregions.htm#Managing_Regions) and [subscribe to an infrastructure region](https://docs.oracle.com/iaas/Content/Identity/regions/To_subscribe_to_an_infrastructure_region.htm#subscribe).
