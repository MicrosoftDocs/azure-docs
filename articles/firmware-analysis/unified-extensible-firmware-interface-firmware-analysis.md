---
title: Understand Unified Extensible Firmware Interface Analysis Capabilities
description: Learn what UEFI analysis capabilities and limitations exist for firmware analysis.
author: karengu0
ms.author: karenguo
ms.topic: conceptual
ms.date: 03/05/2026
ms.service: azure
---

# UEFI firmware analysis capabilities

Firmware analysis can analyze Unified Extensible Firmware Interface (UEFI) firmware images and find detected components, weaknesses, and selected binary attributes. Some UEFI analysis capabilities are *generally available*, while others are available in *preview* and might have limited coverage.

UEFI firmware differs from other firmware types in structure and content. As a result, some analysis results might vary across binaries or appear incomplete.

This article explains:

- Which UEFI firmware analysis capabilities are generally available, and which are in preview.
- How you can currently use firmware analysis to analyze UEFI firmware.
- How to interpret the UEFI analysis results and limitations.

## What is UEFI firmware?

UEFI firmware is system firmware that initializes hardware and boots an operating system. Many modern servers, PCs, and virtual machines use UEFI firmware instead of legacy BIOS.

## UEFI firmware contents

A single UEFI firmware image can contain:

- UEFI-specific binaries.
- Other executable formats embedded within the firmware.

Because of this structure, firmware analysis results might include a mix of different executable types within the same analysis.

## Generally available UEFI analysis capabilities

The following UEFI firmware analysis capabilities are *generally available* and considered stable.

### Cryptographic certificates and keys

Firmware analysis provides generally available support for detecting and analyzing embedded cryptographic material in UEFI firmware, including:

- Cryptographic certificates.
- Cryptographic keys.

These capabilities apply to UEFI firmware and are considered stable.

## Preview UEFI analysis capabilities

The following additional UEFI analysis capabilities are currently provided in *preview* and might have limited coverage.

> [!NOTE]
> Because some UEFI analysis results are in *preview*, not all firmware components, attributes, or weaknesses might be detected. Results should be interpreted as signals, not guarantees of vulnerability or protection.

### UEFI SBOM analysis results (preview)

Firmware analysis can extract information about a software bill of materials (SBOM) from UEFI firmware images.

#### Currently supported

- Detection of OpenSSL components embedded in some UEFI firmware images.
- Detection of OpenSSL version information, when available.
- Common Vulnerabilities and Exposures (CVE) association for OpenSSL (when a version can be determined).

  > [!NOTE]
  > SBOM coverage for UEFI firmware is currently limited. Not all software components embedded in UEFI firmware can be detected. If a component isn't detected, that doesn't mean it's not present.

### UEFI weakness detection (preview)

Weakness data for UEFI firmware is derived from the detected SBOM components.

This means:

- CVEs might be detected only for component versions that can confidently be identified.
- Weakness results are signals, and don't verify exploitability.

### Binary hardening attributes for UEFI firmware (preview)

Binary hardening attributes reflect security properties detected from executable metadata.

#### Supported today

- NoExecute/Data Execution Prevention (NX/DEP) is the supported binary hardening signal for UEFI firmware.

#### Limitations

Other binary hardening attributes such as PIE, RELRO, or stripped might appear in the results grid. These values might originate from:

- Non-UEFI executables embedded in the firmware.
- Generic executable analysis that doesn't uniformly apply to UEFI binaries.

Currently, these attributes aren't considered reliable for UEFI firmware interpretation.

### Extractor paths (preview)

Extractor paths for UEFI firmware now include the UEFI module name, in addition to GUID based identifiers, to improve clarity when reviewing results.

### Interpreting missing or partial data in binary hardening

A single firmware image can contain multiple executable types (for example, a mix of UEFI and Linux ELF executables). UEFI firmware analysis relies on metadata that can be extracted from these binaries.

As a result:

- The columns that are relevant to UEFI firmware images are NX/DEP.
- For Linux ELF binaries, all the columns are applicable.

You should interpret missing or empty values as *unknown*, and not as absence of a security property or feature.

## Summary

When reviewing UEFI firmware analysis results:

- Detection of cryptographic certificates and keys is *generally available*.
- SBOM, weaknesses data, binary hardening, and extractor path enhancements are currently in *preview*.
- Preview capabilities might have limited coverage and should be interpreted as indicative signals, not guarantees of a vulnerability.
- Rely on NX/DEP for UEFI binary-hardening interpretation.
- Interpret other binary attributes with caution.

UEFI analysis capabilities might expand over time, and we'll update the documentation accordingly.
