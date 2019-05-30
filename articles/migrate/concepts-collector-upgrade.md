---
title: Upgrade the Collector appliance in Azure Migrate | Microsoft Docs
description: Provides information about upgrades for the Azure Migrate Collector appliance.
author: musa-57
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 03/29/2019
ms.author: hamusa
services: azure-migrate
---
# Collector appliance updates

This article summarizes upgrade information for the Collector appliance in [Azure Migrate](migrate-overview.md).

The Azure Migrate Collector is a lightweight appliance that's used to discover an on-premises vCenter environment, for the purposes of assessment before migration to Azure. [Learn more](concepts-collector.md).

## How to upgrade the appliance

You can upgrade the Collector to the latest version without downloading the OVA again.

1. Close all browser windows and any open files/folders in the appliance.
2. Download the latest upgrade package from the list of updates mentioned below in this article.
3. To ensure that the downloaded package is secure, open Administrator command window and run the following command to generate the hash for the ZIP file. The generated hash should match with the hash mentioned against the specific version:

	```C:\>CertUtil -HashFile <file_location> [Hashing Algorithm]```

    Example: **C:\>CertUtil -HashFile C:\AzureMigrate\CollectorUpdate_release_1.0.9.14.zip SHA256)**
4. Copy the zip file to the Collector appliance VM.
5. Right-click on the zip file > **Extract All**.
6. Right-click on **Setup.ps1** > **Run with PowerShell**, and follow the installation instructions.

## Collector update release history

### Continuous discovery: Upgrade versions

#### Version 1.0.10.14 (Released on 03/29/2019)

Contains few UI enhancements.

Hash values for upgrade [package 1.0.10.14](https://aka.ms/migrate/col/upgrade_10_14)

**Algorithm** | **Hash value**
--- | ---
MD5 | 846b1eb29ef2806bcf388d10519d78e6
SHA1 | 6243239fa49c6b3f5305f77e9fd4426a392d33a0
SHA256 | fb058205c945a83cc4a31842b9377428ff79b08247f3fb8bb4ff30c125aa47ad

#### Version 1.0.10.12 (Released on 03/13/2019)

Contains fixes for issues in selecting Azure cloud in the appliance.

Hash values for upgrade [package 1.0.10.12](https://aka.ms/migrate/col/upgrade_10_12)

**Algorithm** | **Hash value**
--- | ---
MD5 | 27704154082344c058238000dff9ae44
SHA1 | 41e9e2fb71a8dac14d64f91f0fd780e0d606785e
SHA256 | c6e7504fcda46908b636bfe25b8c73f067e3465b748f77e50027e66f2727c2a9

### One-time discovery (deprecated now): Previous upgrade versions

> [!NOTE]
> The one-time discovery appliance is now deprecated as this method relied on vCenter Server's statistics settings for performance data point availability and collected average performance counters which resulted in under-sizing of VMs for migration to Azure.

#### Version 1.0.9.16 (Released on 10/29/2018)

Contains fixes for PowerCLI issues faced while setting up the appliance.

Hash values for upgrade [package 1.0.9.16](https://aka.ms/migrate/col/upgrade_9_16)

**Algorithm** | **Hash value**
--- | ---
MD5 | d2c53f683b0ec7aaf5ba3d532a7382e1
SHA1 | e5f922a725d81026fa113b0c27da185911942a01
SHA256 | a159063ff508e86b4b3b7b9a42d724262ec0f2315bdba8418bce95d973f80cfc

#### Version 1.0.9.14

Hash values for upgrade [package 1.0.9.14](https://aka.ms/migrate/col/upgrade_9_14)

**Algorithm** | **Hash value**
--- | ---
MD5 | c5bf029e9fac682c6b85078a61c5c79c
SHA1 | af66656951105e42680dfcc3ec3abd3f4da8fdec
SHA256 | 58b685b2707f273aa76f2e1d45f97b0543a8c4d017cd27f0bdb220e6984cc90e

#### Version 1.0.9.13

Hash values for upgrade [package 1.0.9.13](https://aka.ms/migrate/col/upgrade_9_13)

**Algorithm** | **Hash value**
--- | ---
MD5 | 739f588fe7fb95ce2a9b6b4d0bf9917e
SHA1 | 9b3365acad038eb1c62ca2b2de1467cb8eed37f6
SHA256 | 7a49fb8286595f39a29085534f29a623ec2edb12a3d76f90c9654b2f69eef87e


## Next steps

- [Learn more](concepts-collector.md) about the Collector appliance.
- [Run an assessment](tutorial-assessment-vmware.md) for VMware VMs.
