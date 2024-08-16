---
title: "What's new with Azure Arc resource bridge"
ms.date: 08/16/2024
ms.topic: conceptual
description: "Learn about the latest releases of Azure Arc resource bridge."
---

# What's new with Azure Arc resource bridge

Azure Arc resource bridge is updated on an ongoing basis. To stay up to date with the most recent developments, this article provides you with information about recent releases.


We generally recommend using the most recent versions of the agents. The [version support policy](overview.md#supported-versions) generally covers the most recent version and the three previous versions (n-3).

## Version 1.2.0 (July 2024)

Appliance: 1.2.0
CLI extension: 1.2.0
SFS release: 0.1.32.10710
Kubernetes: 1.28.5
Mariner: 2.0.20240609

### Arc-enabled SCVMM

- CreateConfig: Improve prompt messages and re-order networking prompts for the custom IP range scenario.
- CreateConfig: Validate Gateway IP input against specified IP range for the custom IP range scenario.
- CreateConfig: Add validation to check infra configuration capability for HA VM deployment. If HA not supported, re-prompt users to proceed with standalone VM deployment.

### Arc-enabled VMware

- Improve prompt messages in createconfig for vmware.
- Validate proxy scheme and check for required noproxy entries.

### Features

- Reject double commas in no_proxy string ",,"
- Add default folder to createconfig list
- Add conditional Fairfax URLs for US Gov Virginia support.
- New error codes added

### Bug fixes

- Fix for openSSH [CVE-2024-63870](https://github.com/advisories/GHSA-2x8c-95vh-gfv4)

## Next steps

- Learn more about [Arc resource bridge](overview.md).
- Learn how to [upgrade Arc resource bridge](upgrade.md).
