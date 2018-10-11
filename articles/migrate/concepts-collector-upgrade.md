---
title: Upgrade the Collector appliance in Azure Migrate | Microsoft Docs
description: Provides information about upgrades for the Azure Migrate Collector appliance.
author: musa-57
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 09/28/2018
ms.author: hamusa
services: azure-migrate
---

# Collector update release history

This article summarizes upgrade information for the Collector appliance in [Azure Migrate](migrate-overview.md).

The Azure Migrate Collector is a lightweight appliance that's used to discover an on-premises vCenter environment, for the purposes of assessment before migration to Azure. [Learn more](concepts-collector.md).


## One-time discovery: Upgrade versions

### Version 1.0.9.14

Hash values for upgrade [package 1.0.9.14](https://aka.ms/migrate/col/upgrade_9_14)

**Algorithm** | **Hash value**
--- | ---
MD5 | c5bf029e9fac682c6b85078a61c5c79c
SHA1 | af66656951105e42680dfcc3ec3abd3f4da8fdec
SHA256 | 58b685b2707f273aa76f2e1d45f97b0543a8c4d017cd27f0bdb220e6984cc90e

### Version 1.0.9.13

Hash values for upgrade [package 1.0.9.13](https://aka.ms/migrate/col/upgrade_9_13)

**Algorithm** | **Hash value**
--- | ---
MD5 | 739f588fe7fb95ce2a9b6b4d0bf9917e
SHA1 | 9b3365acad038eb1c62ca2b2de1467cb8eed37f6
SHA256 | 7a49fb8286595f39a29085534f29a623ec2edb12a3d76f90c9654b2f69eef87e

### Version 1.0.9.11

Hash values for upgrade [package 1.0.9.11](https://aka.ms/migrate/col/upgrade_9_11)

**Algorithm** | **Hash value**
--- | ---
MD5 | 0e36129ac5383b204720df7a56b95a60
SHA1 | aa422ef6aa6b6f8bc88f27727e80272241de1bdf
SHA256 | 5f76dbbe40c5ccab3502cc1c5f074e4b4bcbf356d3721fd52fb7ff583ff2b68f

### Version 1.0.9.7

Hash values for upgrade [package 1.0.9.7](https://aka.ms/migrate/col/upgrade_9_7)

**Algorithm** | **Hash value**
--- | ---
MD5 | 01ccd6bc0281f63f2a672952a2a25363
SHA1 | 3e6c57523a30d5610acdaa14b833c070bffddbff
SHA256 | e3ee031fb2d47b7881cc5b13750fc7df541028e0a1cc038c796789139aa8e1e6

## Continuous discovery: Upgrade versions

No upgrade for the continuous discovery appliance is available yet.

## Run an upgrade

You can upgrade the Collector to the latest version without downloading the OVA again.

1. You download the latest upgrade package in the list below.
2. To ensure that the downloaded hotfix is secure, you open Administrator command window and run the following command to generate the hash for the ZIP file. The generated hash should match with the hash mentioned against the specific version:

	```C:\>CertUtil -HashFile <file_location> [Hashing Algorithm]```

    Example: **C:\>CertUtil -HashFile C:\AzureMigrate\CollectorUpdate_release_1.0.9.14.zip SHA256)**
3. Copy the zip file to the Collector appliance VM.
4. Right-click on the zip file > **Extract All**.
5. Right-click on **Setup.ps1** > **Run with PowerShell**, and follow the installation instructions.


## Next steps

- [Learn more](concepts-collector.md) about the Collector appliance.
- [Run an assessment](tutorial-assessment-vmware.md) for VMware VMs.
