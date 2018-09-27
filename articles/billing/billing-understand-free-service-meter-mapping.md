---
title: Service to Meter mapping for Azure Free account | Microsoft Docs
description: Understand service to meter mapping for services included with free account.
services: ''
documentationcenter: ''
author: amberbhargava
manager: amberb
editor: ''
tags: billing

ms.service: billing
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 09/25/2017
ms.author: cwatson

---
# Understand free service to meter mapping

Every Azure service emits usage against meters, which the Azure billing system utilizes to charge users for services. To better understand the usage of free services, let's look at the service to meter mapping for these services. To learn how to create free services, see [Create free services with Azure free account](billing-create-free-services-included-free-account.md).

## Service to meter mapping for free account eligible services 

|    Service   | Meter Name on Azure portal | Meter Name in usage file/API | Meter ID |
| ------------ | -------------------------- | -------------------------| -------- |
| B1S Linux VM | Compute Hours - Standard_B1 VM | Compute Hours - Free | 8260cba2-4437-47d1-a31e-2561cd370f50
| B1S Windows VM | Compute Hours - Standard_B1 VM (Windows) | Compute Hours - Free | ff3e6fa5-ee46-478e-8d0e-b629f4f8a8ac
| B1S VM - Public IP Addresses  | IP Address Hours - Public IP Addresses | IP Address Hours - Free | ae56b367-2708-4454-a3d9-2be7b2364ea1
| CosmosDB | Storage (GB) - Cosmos DB | Storage (GB) - Free | 59c78b09-08e2-466a-9f3b-57a94c9e2f31
| CosmosDB | 100 Request Units (Hours) - Cosmos DB | 100 Request Units (Hours) - Free | 5d638a6f-e221-41cf-ae3f-0f81d368cef6 
| File Storage | Standard IO - Files (GB) - Locally Redundant | Standard IO - Files (GB) - Free | a7f2aa67-b9a2-4593-a413-6ec86d6c8e5b
| File Storage | Standard IO - File Read Operation Units (in 10,000s) | Standard IO - File Read Operation Units (in 10,000s) - Free | 6207404d-3389-4d20-9087-cc078ddc3fd9
| File Storage | Standard IO - File Write Operation Units (in 10,000s) | Standard IO - File Write Operation Units (in 10,000s) - Free | 223d8004-d29a-46cf-b4f4-d2d34b12548b
| File Storage | Standard IO - File Protocol Operation Units (in 10,000s) | Standard IO - File Protocol Operation Units (in 10,000s) - Free | a347d8cc-51d1-4a0e-b9eb-76f67566c3f5
| File Storage | Standard IO - File List Operation Units (in 10,000s) | Standard IO - File List Operation Units (in 10,000s) - Free | e8ae79ad-c2ab-4d82-b226-dd3c33dfd40c
| Hot Block Blob Storage | Standard IO - Hot Block Blob Read Operations (in 10,000s) | Standard IO - Hot Block Blob Read Operations (in 10,000s) - Free |fd7cfa1e-026e-4be1-871b-1c2386e8902e
| Hot Block Blob Storage | Standard IO - Hot Block Blob (GB) - Locally Redundant | Standard IO - Hot Block Blob (GB) - Free | 67a3a3fd-826f-42c1-8843-bffa14f0da13
| Hot Block Blob Storage | Standard IO - Hot Block Blob Write Operations (in 10,000s) | Standard IO - Hot Block Blob Write Operations (in 10,000s) - Free | b34bbb76-edce-4c2d-a288-81a2db1fea53
| Hot Block Blob Storage  | Standard IO - Hot Block Blob Write/List Operations (in 10,000s) | Standard IO - Hot Block Blob Write/List Operations (in 10,000s) - Free | 7e68cf36-1198-4d3b-baa7-86a74c5b3079
| Managed Disk *  | Standard Managed Disk/Snapshots (GB) - Locally Redundant | Standard Managed Disk/Snapshots (GB) - Free | ad94c237-52a5-4804-ae65-38c5bf85ef42
| Managed Disk *  | Standard Managed Disk Operations (in 10,000s) | Standard Managed Disk Operations (in 10,000s) - Free | 82cc6ea4-0abd-43ac-acc0-ec34edf0f14c
| Managed Disk *  | Premium Storage - Page Blob/P6 (Units) - Locally Redundant | Premium Storage - Page Blob/P6 (Units) - Free | 2b98c168-27ca-4cc1-b509-e887dec87657
| SQL Database | Standard S0 Database Days - SQL Database | Standard S0 Database Days - Free | dd6b69d3-9be0-4a91-abff-2c58bbcafd1d
| Shared - Bandwidth ** | Data Transfer Out (GB) | Data Transfer Out (GB) - Free | 0fc067a1-65d2-46da-b24b-7a9cbe2c69bd

\* If you create a Windows virtual machine and choose managed disk, you will consume managed disk meter as part of the virtual machine.

\** Shared meters can be consumed through multiple services. For instance, both Virtual machines and Storage emit usage against Data Transfer Out(GB) meter.





## Need help? Contact support

If you need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.
