---
title: Supported Microsoft Azure Linux versions
description: Learn about supported Azure Linux versions, Azure Linux's support policy, and version lifecycle.
author: htaubenfeld
ms.author: htaubenfeld
ms.service: microsoft-linux
ms.topic: article
ms.date: 04/18/2023
---

# Supported Microsoft Azure Linux versions 

Microsoft Azure Linux releases both major and minor versions of its images:

- **Major versions** contain new packages and package versions, an updated kernel, and security, tooling, performance, and developer experience enhancements.
- **Minor versions** contain package updates of medium, high, and critical severity, minor kernel updates, and bug fixes. 

Azure Linux releases major versions approximately every 24 months and minor versions at the beginning of each month or when there is a critical package fix. When a new major version is released, the older version will be deprecated within six months. This overlap period is intended to give time to migrate between releases while maintaining appropriate support and security. At any given time, only two Azure Linux versions are supported.

Azure Linux does not currently offer LTS support for major releases.

New Azure Linux Container Host for AKS base images are built weekly, but new image versions are not rolled out weekly. AKS has a schedule and tracks which weekly version has been released. Typically, an image will spend one week in end-to-end testing before being rolled out over a few days. As Azure Linux updates, it aligns with [AKS's release process](../../articles/aks/supported-kubernetes-versions.md#release-and-deprecation-process).

## Azure Linux versioning scheme

Azure Linux follows the standard [Calendar Versioning](https://calver.org/) scheme for versioning:

```
[major].[minor release date]

Examples: 
    2.0.20221203
    2.0.20221122
```

The major version number increments in integer numbers when a new major image version is released every ~2 years. The minor release date number, in the format YYYYMMDD, represents the date of the minor version release and changes monthly.

### Azure Linux 1.0 

Azure Linux 1.0 is FIPS kernel certified and FedRAMP approved. It's available in public, sovereign, and air-gapped clouds for both non-production and production use. Azure Linux 1.0 will reach end of life on July 31, 2023.

### Azure Linux 2.0

Azure Linux 2.0 features the latest Linux 5.15 kernel with Azure cloud optimizations and full-featured eBPF, providing greater observability and debugging for AKS environments, along with other tooling. Azure Linux 2.0 is FedRAMP approved, and every OS partition is a tested configuration to avoid package update surprises.

## Azure Linux major version release calendar

| Azure Linux version | Azure Linux release | End of life |
|-----------------|-----------------|-------------|
| 2.0 | Apr 2022 | TBA |
| 1.0 | Sept 2020 | Jul 31 2023 |

## FAQ

### How do upgrades from one major Azure Linux version to another work?
When upgrading between major Azure Linux versions, a [SKU migration](./tutorial-azure-linux-migration.md) is required. Moving forward, the Azure Linux osSKU will be a rolling release that will include Azure Linux 3.0 once it is generally available.

### How does Microsoft notify users of new Azure Linux versions?
Azure Linux releases new images on a monthly basis or whenever there is a critical CVE. You can find these releases on the [Azure Linux release notes](https://github.com/microsoft/CBL-Mariner/releases) page on Github. AKS releases can be tracked on the [AKS release tracker](../../articles/aks/release-tracker.md).

### Can I use a specific Azure Linux version indefinitely?
You can decide to opt out of automatic node image upgrades and manually upgrade your node image to control what version of Azure Linux you use. This way, you can use a specific Azure Linux version for as long as you want. 

### Is it possible to skip multiple Azure Linux minor versions during an upgrade?
If you choose to manually upgrade your node image instead of using automatic node image upgrades, you can skip Azure Linux minor versions during an upgrade. The next manual node image upgrade you perform will upgrade you to the latest Azure Linux Container Host for AKS image.