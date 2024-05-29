---
title: Supported Storage Software Versions in Azure Operator Nexus
description: Learn the storage appliance software versions supported by Azure Operator Nexus versions
ms.topic: article
ms.date: 05/23/2024
author: neilverse
ms.author: soumya.maitra
ms.service: azure-operator-nexus
---

# Supported Storage Software Versions in Azure Operator Nexus

This document provides an overview of the storage appliance software versions supported by Azure Operator Nexus. The document also covers the version support lifecycle and end of life for each version of Storage Appliance Software.

Minor version releases include new features and improvements. Patch releases are made available frequently and are intended for critical bug fixes within a minor version. Patch releases include fixes for security vulnerabilities or major bugs.

Azure Nexus Supports Pure x70r3 and x70r4 each being deployed with a version of the Purity Operating System (PurityOS) that is compatible with the Azure Nexus version.

PurityOS uses the standard [Semantic Versioning](https://semver.org/) versioning scheme for each version:

```bash
[major].[minor].[patch]

Examples:
  6.1.12
  6.5.4
```

Each number in the version indicates general compatibility with the previous version:

* **Major version numbers** change when breaking changes to the API might be introduced
* **Minor version numbers** change when functionality updates are made that are backwards compatible to the other minor releases.
* **Patch version numbers** change when backwards-compatible bug fixes are made.

We strongly recommend staying up to date with the latest available patches. For example, if your production cluster is on **`6.5.1`**, and **`6.5.4`** is the latest available patch version available for the *6.5* series. You should upgrade to **`6.5.4`** as soon as possible to ensure your cluster is fully patched and supported.

## Supported Storage Software Versions

|  PurityOS version | Nexus GA      | End of support |
|-------------------|---------------|----------------|
| 6.1.x             | Year 2021     | Jul 2024       |
| 6.5.1             | Nexus 2403.x  | Dec 2025       |
| 6.5.4             | Nexus 2404.x  | Dec 2025       |

## FAQ

### How does Microsoft notify me of new Kubernetes versions?

This document is updated periodically with planned dates of the new Storage Software versions supported. 

### What happens when a version reaches end of support?

When a version reaches end of support, it will no longer receive patches or updates. We recommend upgrading to a supported version as soon as possible.

### What happens if I don't upgrade my storage appliance software?

If you don't upgrade your storage appliance software, you continue to receive support for the software version you're running until the end of the support period. After that, you'll no longer receive support for your storage appliance. You need to upgrade your cluster to a supported version to continue receiving support.

### What does 'Outside of Support' mean?

'Outside of Support' means that:

* The version you're running is outside of the supported versions list.
* You're asked to upgrade the storage appliance software to a supported version when requesting support.