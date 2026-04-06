---
title: Understanding Unified Extensible Firmware Interface firmware analysis capabilities and limitations in Firmware analysis.
description: Learn what UEFI analysis capabilities and limitations exist for firmware analysis.
author: karengu0
ms.author: karenguo
ms.topic: conceptual
ms.date: 03/05/2026
ms.service: azure
---

# UEFI firmware analysis capabilities

Firmware analysis can analyze Unified Extensible Firmware Interface (UEFI) firmware images and surface detected components, weaknesses, and selected binary attributes. Some UEFI analysis capabilities are **Generally Available**, while others are provided in **Preview** and may have limited coverage.

UEFI firmware differs from other firmware types in structure and content. As a result, some analysis results may vary across binaries or appear incomplete.

This article explains:
- Which UEFI firmware analysis capabilities are GA, and which are in Preview
- What firmware analysis currently supports for analyzing UEFI firmware
- How to interpret the UEFI analysis results and limitations

## What is UEFI firmware?

UEFI (Unified Extensible Firmware Interface) firmware is system firmware used to initialize hardware and boot an operating system.
Many modern servers, PCs, and virtual machines use UEFI firmware instead of legacy BIOS.

## UEFI firmware contents

A single UEFI firmware image can contain:
* UEFI-specific binaries
* Other executable formats embedded within the firmware

Because of this structure, firmware analysis results may include a mix of different executable types within the same analysis.

## Generally available UEFI analysis capabilities

The following UEFI firmware analysis capabilities are **Generally Available (GA)** and considered stable.

### Cryptographic certificates and keys (GA)


Firmware analysis provides GA support for detecting and analyzing cryptographic material embedded in UEFI firmware, including:
- Cryptographic certificates
- Cryptographic keys

These capabilities apply to UEFI firmware and are considered stable.

## Preview UEFI analysis capabilities

The following additional UEFI analysis capabilities are currently provided in **Preview** and may have limited coverage.

> [!NOTE]
> Because some UEFI analysis results are in **Preview**, not all firmware components, attributes, or weaknesses may be detected. Results should be interpreted as signals, not guarantees of vulnerability or protection.

### UEFI SBOM analysis results (Preview)

Firmware analysis can extract SBOM (Software Bill of Materials) information from UEFI firmware images.

#### Supported today
* Detection of OpenSSL components embedded in some UEFI firmware images
* Detection of OpenSSL version information when available
* CVE association for OpenSSL when a version can be determined

> [!NOTE]
> SBOM coverage for UEFI firmware is currently limited. Not all software components embedded in UEFI firmware can be detected. Absence of a component does not mean it is not present.

### UEFI weakness detection (Preview)
Weakness data for UEFI firmware is derived from detected SBOM components.
This means:
* CVEs may be detected only for components' versions that can be confidently identified
* Weakness results are signals, not verification of exploitability

### Binary hardening attributes for UEFI firmware (Preview)
Binary hardening attributes reflect security properties detected from executable metadata.
#### Supported today
* NX (NoExecute / DEP) is the supported binary hardening signal for UEFI firmware
#### Limitations
Other binary hardening attributes such as PIE, RELRO, or Stripped may appear in the results grid. These values may originate from:
* Non-UEFI executables embedded in the firmware
* Generic executable analysis that does not uniformly apply to UEFI binaries

These attributes are not considered reliable for UEFI firmware interpretation currently.

### Extractor paths (Preview)
Extractor paths for UEFI firmware now include the UEFI module name, in addition to GUID based identifiers, to improve clarity when reviewing results.

### Interpreting missing or partial data in binary hardening
A single firmware image can contain multiple executable types (for example, a mix of UEFI and Linux ELF executables). UEFI firmware analysis relies on metadata that can be extracted from these binaries.

As a result:
- The columns relevant to UEFI firmware images are NX / DEP
- For Linux ELF binaries, all the columns are applicable.

Missing or empty values should be interpreted as **unknown**, not as absence of a security property or feature.

## Summary
When reviewing UEFI firmware analysis results:
* Detection of cryptographic certificates and keys is **Generally Available**
* SBOM, weaknesses data, binary hardening, and extractor path enhancements are currently in **Preview**
* Preview capabilities may have limited coverage and should be interpreted as indicative signals, not guarantees of a vulnerability
* Rely on NX/DEP for UEFI binary hardening interpretation
* Interpret other binary attributes with caution

UEFI analysis capabilities may expand over time, and documentation will be updated accordingly.

