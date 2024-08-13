---
title: Supported Storage Software Versions in Azure Operator Nexus
description: Learn the storage appliance software versions supported by Azure Operator Nexus versions.
ms.topic: article
ms.date: 05/23/2024
author: neilverse
ms.author: soumyamaitra
ms.service: azure-operator-nexus
---

# Supported Storage Software Versions in Azure Operator Nexus

This document provides an overview of the storage appliance software versions supported by Azure Operator Nexus. The document also covers the version support lifecycle and end of life for each version of Storage Appliance Software.

Azure Nexus Supports Pure x70r3 and x70r4 each being deployed with a version of the Purity Operating System (PurityOS) that is compatible with the Azure Nexus version.

PurityOS uses the standard [Semantic Versioning](https://semver.org/) scheme for each version:

```bash
[major].[minor].[patch]

Examples:
  6.1.12
  6.5.4
```

Each number in the version indicates general compatibility with the previous version:

* **Major version numbers** change when breaking changes to the API might be introduced
* **Minor version numbers** change when functionality updates are made that are backwards compatible to the other minor releases. These versions involve new features and improvements.
* **Patch version numbers** change when backwards-compatible bug fixes are made. Patch releases are made available frequently and are intended for critical bug fixes within a minor version. The type of issues fixed under patch release includes fixes for security vulnerabilities or major bugs.

## Version support guidelines
- All changes to version support and any version specific upgrade instructions will be communicated in release notes.
- Nexus will only support Long Term Support (LTS) storage versions. Purity LTS versions contain an odd number minor version, such as 6.1.x, 6.5.x etc.
- Nexus will support up to two LTS versions at any time.
- Support shall be provided for all patch releases documented in Nexus public documentation. Which means that Nexus will handle and resolve issue tickets where storage appliance is running a supported release version. These tickets may require a fix to Nexus software or be referred to the storage vendor support team depending on the specific details. If a fix requires inclusion of new Pure patch release, it will be appropriately tested and documented.
- Each Pure LTS release listed as supported is tested equally with each new Nexus release to ensure comprehensive compatibility.


## Release process
1.	**End of support:** 
    - Nexus will announce end of support for the oldest supported LTS version via release notes once the timeline for the new LTS version is available.
    - Nexus will stop supporting the oldest supported LTS version shortly before adding support for new LTS version (that is before the next LTS version is ready for testing in labs).  
3.	**Introduction:** Nexus typically declares support for a new LTS release once the first patch release is available. This is to benefit from any critical fixes. Release cadence:
    - By default, the introduction of any new release support (LTS/patch) will be combined with Nexus runtime release.
    - Introduction of a new LTS release may, in rare cases, require a specific upgrade ordering and a timeline. 
    - Depending on severity of Common Vulnerabilities & Exposures (CVE) fixes or blocker issues, a Purity version may be verified and introduced outside of a runtime release. 

## Supported Storage Software Versions (Purity)

|  PurityOS version | Support added in | End of support | Remarks |
|-------------------|------------------|----------------|---------|
| 6.1.x             | Year 2021        | Jul 2024       | End of support in Nexus 2406.2 |
| 6.5.1             | Nexus 2403.x     | Dec 2025*     | |
| 6.5.4             | Nexus 2404.x     | Dec 2025*     | |
| 6.5.6             | Nexus 2406.2     | Dec 2025*     | Aligned with Nexus runtime release |

> [!IMPORTANT]
> \* At max 2 LTS versions will be supported. The dates are tentative assuming that by this timeframe we will have another set of LTS versions released, making this version deprecate per our support guidelines.

## Supported Pure HW Controller versions

| Pure HW Controller version | Support added in |
|----------|-------------|
| R3	| Year 2021 |
| R4	| Nexus 2404.x |

## FAQ

### How does Microsoft notify me of a new supported Purity version?

This document is updated periodically with planned dates of the new Storage software versions supported and for retiring versions. All new versions and end of support announcements are also communicated in release notes.

### What happens when a version reaches the end of support?

Only the documented versions receive appropriate support. When a version reaches the end of support, it will no longer receive patches or updates. We recommend upgrading to a supported version as soon as possible.

### What happens if I don't upgrade my storage appliance software?

If you don't upgrade your storage appliance software, you continue to receive support for the software version you're running until the end of the support period. After that, you'll no longer receive support for your storage appliance. You need to upgrade your storage appliance to a supported version to continue receiving support.

### What does 'Outside of Support' mean?

'Outside of Support' means that:

* The version you're running is outside of the supported versions list.
* Per the guidance, any support tickets reported with unsupported versions won’t be triaged until customer upgrades the storage appliance software to a supported version.