---
title: Region availability for Oracle AI Database@Azure
description: Learn about region availability for Oracle AI Database@Azure.
author: jjaygbay1
ms.service: oracle-on-azure
ms.collection: linux
ms.topic: concept-article
ms.date: 9/24/2024
ms.custom: references-regions
ms.author: jacobjaygbay
# Customer intent: As a cloud architect, I want to understand the regional availability of Oracle AI Database services on Azure, so that I can plan the deployment of these databases in the appropriate locations for optimal performance and disaster recovery.
---

# Region availability for Oracle AI Database@Azure

Learn what Azure regions and corresponding Oracle Cloud Infrastructure (OCI) regions support Oracle AI Database@Azure in standard business regions across the globe.

The list below mentions the Azure and corresponding OCI regions with the regional availability for Oracle AI Database@Azure:

- Dual – Minimum two Azure zones are available in this region
- Single – One Azure zone available with a corresponding paired DR region
- DR - Disaster recovery only region

## Asia Pacific (APAC)

| Azure region   | OCI region   | Oracle Exadata Database Service on Dedicated Infrastructure | Oracle Autonomous AI Database on Dedicated Exadata Infrastructure | Oracle AI Autonomous Database@Azure | Oracle Database Autonomous Recovery Service@Azure | Exadata Database Service on Exascale Infrastructure@Azure | Oracle Base Database Service | Oracle GoldenGate | Regional Availability |
| -------------- | ----------------------- | ------------|----------------- | -------------------------------- | -------- |---------|---------|---------|-----|
| Australia East | Australia East (Sydney) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓|  Dual   |
| Australia Southeast | Australia Southeast (Melbourne) | ✓ | ✓ | ✓ | ✓ | |  | |   Dual   |
| Central India | India West (Mumbai) | ✓  | ✓| ✓ | ✓ | ✓ | ✓ | ✓ |   Dual   |
| Japan East | Japan East (Tokyo) | ✓  | ✓| ✓  | ✓ | ✓ | ✓ | ✓ |   Dual   |
| Japan West | Japan Central (Osaka) | ✓  | ✓| ✓ | ✓ | ✓ | ✓ | ✓ |   Single   |
| South India | 	India South (Chennai) | ✓ | ✓ | ✓ | ✓ | | | |   Single   |
| Southeast Asia |Singapore (Singapore) | ✓  | ✓| ✓   | ✓ | ✓ | ✓ | ✓ |  Dual   |



## Brazil

| Azure region | OCI region                 | Oracle Exadata Database Service on Dedicated Infrastructure | Oracle Autonomous AI Database on Dedicated Exadata Infrastructure | Oracle AI Autonomous Database@Azure | Oracle Database Autonomous Recovery Service@Azure | Exadata Database Service on Exascale Infrastructure@Azure | Oracle Base Database Service | Oracle GoldenGate | Regional Availability |
| ------------ | -------------------------- | -------------------------|---- | -------------------------------- | ------------------------------------------------- | --------------------------------------------------------- | ------ | --------------------- |-------|
| Brazil South | Brazil Southeast (Vinhedo) | ✓   | ✓ | ✓      | ✓   | ✓     | ✓  | ✓   | Dual   |
| Brazil Southeast | Brazil East (Rio de Janeiro) | ✓   | ✓ |   ✓    | ✓   |      |   |  ✓  | Single   |

## Europe, Middle East, Africa (EMEA)

|Azure region |OCI region  | Oracle Exadata Database Service on Dedicated Infrastructure| Oracle Autonomous AI Database on Dedicated Exadata Infrastructure | Oracle AI Autonomous Database@Azure | Oracle Database Autonomous Recovery Service@Azure| Exadata Database Service on Exascale Infrastructure@Azure | Oracle Base Database Service | Oracle GoldenGate | Regional Availability |
|------------|--|-------------|-------------|------------------------------| ------| ---- | ---- |----|-------|
| France Central       |France central (Paris) | ✓  | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |  Dual |
| France South | France South (Marseille) |  ✓  | ✓| ✓ | ✓  | | | |   Single   |
| Germany North |Germany Central (Frankfurt) | ✓  | ✓ | ✓ | ✓  | ✓ | ✓ | ✓ |   Single    |
| Germany West Central |Germany Central (Frankfurt) |  ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Dual |
| Italy North | Italy North (Milan)   | ✓  | ✓ | ✓   | ✓ |  ✓ | ✓ | ✓ | Dual |
| North Europe | Ireland (Dublin) | ✓  | ✓| ✓ |  ✓ | ✓ | ✓ | ✓ |   Dual   |
| Spain Central | 	Spain Central (Madrid) | ✓ | ✓ | ✓ | ✓ |  | | ✓ |   Dual    |
| Sweden Central | 	Sweden Central (Stockholm) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |   Dual    |
| Switzerland North | Switzerland North (Zurich) | ✓ | ✓ | ✓ | ✓ |  | | ✓ |   Dual    |
| UAE Central | UAE Central (Abu Dhabi) | ✓  | ✓| ✓ | ✓ | | | ✓ |   Single    |
| UAE North | UAE North (Dubai) | ✓ | ✓ | ✓ | ✓ | | | ✓ |   Dual    |
| UK South| UK South (London)   | ✓   | ✓| ✓   | ✓ | ✓ | ✓ | ✓ | Dual |
| UK West | UK West (Newport)	   | ✓   | ✓ | ✓  | ✓ | ✓ | ✓ | ✓ | Single |
| West Europe | Netherlands Northwest (Amsterdam)   | ✓   | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | Dual |


## North America (NA)

| Azure region     | OCI region                 | Oracle Exadata Database Service on Dedicated Infrastructure| Oracle Autonomous AI Database on Dedicated Exadata Infrastructure | Oracle AI Autonomous Database@Azure | Oracle Database Autonomous Recovery Service@Azure | Exadata Database Service on Exascale Infrastructure@Azure | Oracle Base Database Service | Oracle GoldenGate | Regional Availability |
| ---------------- | -----------------------|---------- | ----------------------------- | -------------------------------- | ------------------------------------------------- | --------------------------------------------------------- | ----------------- | --------------------- |---------|
| Canada Central   | Canada Southeast (Toronto) | ✓  | ✓   | ✓   |  ✓  | ✓   | ✓ | ✓ |  Dual |
| Canada East | Canada Southeast (Montreal) | ✓ | ✓ |✓ | ✓ | | | ✓ |   Single    |
| Central US       | US Midwest (Chicago) | ✓  | ✓| ✓   | ✓  |  ✓   |  ✓  |   ✓   | Dual    |
| East US          | US East (Ashburn)  | ✓  | ✓| ✓   | ✓  | ✓    | ✓ | ✓ | Dual|
| East US 2        | US East (Ashburn)  | ✓  | ✓  | ✓  | ✓  |  ✓   | ✓  | ✓ | Dual     |
| North Central US | US Midwest (Chicago) | ✓ | ✓ |  ✓ |  ✓ | ✓  |  |  | Single   |
| South Central US | US South (Dallas)| ✓ | ✓ |  ✓  | ✓ |  |   | ✓ | Dual |
| West US          | US West (San Jose) | ✓  | ✓  | ✓  | ✓  |  ✓   |  ✓  | ✓ | Single   |
| West US 2        | US West (Quincy) | ✓ | ✓ | ✓ |  ✓ |  ✓ | ✓  | ✓ | Dual |
| West US 3        | US West (Phoenix) | ✓ | ✓ | ✓  |  ✓ |   |  |  | Dual   |


> [!NOTE]
> To provision Oracle AI Database@Azure resources in a supported region, your tenancy must be subscribed to the target region. Learn how to [manage regions](https://docs.oracle.com/iaas/Content/Identity/regions/managingregions.htm#Managing_Regions) and [subscribe to an infrastructure region](https://docs.oracle.com/iaas/Content/Identity/regions/To_subscribe_to_an_infrastructure_region.htm#subscribe).
